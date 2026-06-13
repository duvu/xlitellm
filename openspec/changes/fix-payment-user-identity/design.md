## Context

LiteLLM's `UserAPIKeyAuth` carries several user-related fields:
- `user_id: Optional[str]` — the user ID stored when the key was created. Set to `"default_user_id"` when no explicit user was provided at key-creation time.
- `user_email: Optional[str]` — the authenticated user's email. Populated for UI session keys (OAuth, email login).

The payment module currently uses `user_api_key_dict.user_id` directly. For UI users logging in via browser, LiteLLM may issue a session key where `user_id = "default_user_id"` but `user_email` is set to the real email (e.g. `alice@example.com`).

## Goals / Non-Goals

**Goals:**
- Every authenticated user gets a unique, stable `user_id` for payment operations
- UI-authenticated users (with `user_email` set) get their email as their payment identity
- Keys with neither `user_id` (real) nor `user_email` receive HTTP 401 with a clear message

**Non-Goals:**
- Migrating existing `"default_user_id"` balance rows — those are zero-balance rows from testing
- Supporting `end_user_id` (that's for LLM request end-users, not API key owners)

## Decisions

**Decision: Identity resolution priority chain**

```
effective_user_id =
  user_id  (if not None and not in PLACEHOLDER_IDS)
  → user_email
  → raise HTTPException(401, "Cannot identify user: no user_id or email on token")
```

`PLACEHOLDER_IDS = {"default_user_id", "", None}` — the known LiteLLM placeholders.

Rationale:
- `user_id` first — explicit user association on a key is the most precise identity
- `user_email` fallback — always set for UI-login sessions; unique per user; stable
- Hard 401 if neither — better to fail loudly than silently bucket all unknown users together

**Decision: Keep the fix in `get_current_user` only**

All downstream router endpoints already receive `user["user_id"]` from `get_current_user`. No other code change needed.

**Decision: No DB migration**

Existing rows with `user_id = "default_user_id"` in `payment_user_balance` are stale test data with balance=0. They will not collide after the fix because new requests from real users will use `user_email` as the key.

## Implementation

In `litellm_payment/api/router.py`:

```python
_PLACEHOLDER_USER_IDS = {None, "", "default_user_id"}

async def get_current_user(
    user_api_key_dict: UserAPIKeyAuth = Depends(user_api_key_auth),
) -> dict:
    """Extract user from LiteLLM's standard bearer token auth."""
    uid = user_api_key_dict.user_id
    if uid in _PLACEHOLDER_USER_IDS:
        uid = user_api_key_dict.user_email or None
    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Cannot identify user: token carries no user_id or user_email",
        )
    return {
        "user_id": uid,
        "is_admin": user_api_key_dict.user_role == LitellmUserRoles.PROXY_ADMIN,
    }
```

## Risks / Trade-offs

- [Risk: Existing test data with `user_id="default_user_id"` is orphaned] → Balance is 0; no real money lost.
- [Risk: A future LiteLLM version renames placeholder to something else] → Add to `_PLACEHOLDER_USER_IDS` set. Low risk.
- [Risk: User has `user_id` set but it's a team/org ID, not personal] → Out of scope. The key metadata is LiteLLM's responsibility; we consume what's provided.
