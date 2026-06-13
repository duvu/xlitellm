## Context

LiteLLM proxy uses `user_api_key_auth` as a FastAPI **Depends** dependency — not middleware. Routes that need auth must declare `user_api_key_dict: UserAPIKeyAuth = Depends(user_api_key_auth)` in their signature. This dependency:
1. Reads the `Authorization: Bearer <token>` header
2. Validates the key against the LiteLLM database
3. Returns a `UserAPIKeyAuth` object with `.user_id`, `.user_role`, `.team_id`, etc.

The `litellm-payment` router currently has its own `get_current_user()` that does NOT use `Depends(user_api_key_auth)`. Instead it tries to read `request.state.user_api_key_user_id` (never set by LiteLLM for non-LiteLLM routes) and falls back to an `x-user-id` header (never sent by browsers). Both paths produce 401.

## Goals / Non-Goals

**Goals:**
- `/payment/balance` and all other payment endpoints return the correct response when called with a valid `Authorization: Bearer <key>` header
- Admin-only endpoints (`/payment/admin/*`) correctly check `is_admin` against `LitellmUserRoles.PROXY_ADMIN`

**Non-Goals:**
- Changing any route path, request schema, or response schema
- Adding new payment functionality
- Changing LiteLLM's auth system

## Decision: Replace `get_current_user` with direct `Depends(user_api_key_auth)`

**Current (broken):**
```python
async def get_current_user(request: Request) -> dict:
    user_id = getattr(request.state, "user_api_key_user_id", None)
    if not user_id:
        user_id = request.headers.get("x-user-id")
    if not user_id:
        raise HTTPException(status_code=401, ...)
    return {"user_id": user_id, "is_admin": False}
```

**New (correct):**
```python
from litellm.proxy.auth.user_api_key_auth import user_api_key_auth
from litellm.proxy._types import UserAPIKeyAuth, LitellmUserRoles

async def get_current_user(
    user_api_key_dict: UserAPIKeyAuth = Depends(user_api_key_auth)
) -> dict:
    return {
        "user_id": user_api_key_dict.user_id,
        "is_admin": user_api_key_dict.user_role == LitellmUserRoles.PROXY_ADMIN,
    }
```

**Why this approach:**
- `Depends(user_api_key_auth)` is the idiomatic LiteLLM pattern for all plugin routes (e.g., LiteLLM's own `/spend/keys`, `/user/info` all use it)
- Zero new code paths — we delegate entirely to LiteLLM's existing, tested auth logic
- `UserAPIKeyAuth.user_id` and `.user_role` are well-typed and stable attributes

**Alternatives considered:**
1. Custom JWT check — adds new dependencies, duplicates what LiteLLM already does
2. `request.state` approach — only works for LiteLLM's own router, not plugin routers
3. Separate auth middleware — FastAPI middleware executes before `Depends`, complicates error handling

## Key Types

| Symbol | Location | Used for |
|---|---|---|
| `user_api_key_auth` | `litellm.proxy.auth.user_api_key_auth:user_api_key_auth` | FastAPI Depends callable |
| `UserAPIKeyAuth` | `litellm.proxy._types:UserAPIKeyAuth` | Return type, `.user_id`, `.user_role` |
| `LitellmUserRoles.PROXY_ADMIN` | `litellm.proxy._types:LitellmUserRoles` | Admin role check (`== "proxy_admin"`) |

## Migration Plan

1. Edit `router.py`: replace `get_current_user` function + update imports
2. Build new wheel from `/home/beou/IdeaProjects/litellm-payment` (using existing venv at `/tmp/litellm-payment-venv/`)
3. Build Docker image extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v3.20260523.2148` that installs the updated wheel
4. Push as `payment-ui-v4.<TIMESTAMP>`
5. Update `docker-compose.yml` at `/home/beou/deployment/server2/docker-compose.yml`
6. Deploy and verify

**Rollback:** Revert `docker-compose.yml` tag to `payment-ui-v3.20260523.2148`

## Risks

- **Risk: `user_api_key_auth` imports cycle** — `litellm-payment` is installed into the same Python environment as LiteLLM, so the import is direct. No circular import risk.
- **Risk: `UserAPIKeyAuth.user_id` is `None`** — Possible for API keys without explicit user assignment. The existing balance/history endpoints already handle `None` user_id via the database layer (they return empty results, not errors).
