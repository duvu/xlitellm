# Deployment Report: LiteLLM payment-ui-v4 — Fix Payment API 401

**Date:** 2026-05-23  
**Environment:** server2 (`root@10.113.213.1`)  
**Image:** `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v4.20260523.2204`  
**Change:** `fix-payment-api-auth`  
**Deployment commit:** `4393592`

---

## Problem

All payment API endpoints (`/payment/balance`, `/payment/list`, `/payment/create`, etc.) returned **401 Unauthorized** for every authenticated request from the UI.

**Root cause:** The `litellm-payment` router used a custom `get_current_user` dependency that read `request.state.user_api_key_user_id`. LiteLLM's `user_api_key_auth` is a **FastAPI Depends dependency**, not middleware — so `request.state` is never populated for plugin routes. The fallback read an `x-user-id` header that browsers never send.

## Fix

Replaced `get_current_user` in `litellm_payment/api/router.py` to use `Depends(user_api_key_auth)` from LiteLLM directly:

```python
async def get_current_user(
    user_api_key_dict: UserAPIKeyAuth = Depends(user_api_key_auth),
) -> dict:
    return {
        "user_id": user_api_key_dict.user_id,
        "is_admin": user_api_key_dict.user_role == LitellmUserRoles.PROXY_ADMIN,
    }
```

Source commit: `42a954b` on `github.com:duvu/litellm-payment.git`

## DB Migration (unblocked by fix)

Once auth was unblocked, the payment endpoints hit a `UndefinedTableError` — the DB tables hadn't been created. Applied directly via psql since the alembic CLI requires `psycopg2` (only `asyncpg` available in image):

```sql
CREATE TABLE payment_transactions (...);
CREATE TABLE payment_user_balance (...);
CREATE TABLE alembic_version (...);
INSERT INTO alembic_version VALUES ('001');
```

## Verification Results

| Check | Result |
|---|---|
| `GET /payment/balance` with master key | `200 {"user_id":"default_user_id","balance":0,"currency":"VND"...}` |
| `GET /payment/list` with master key | `200 {"page":1,"page_size":20,"items":[]}` |
| `GET /payment/balance` without auth | `401` |
| Container status | `running`, RestartCount=0 |
| Image tag | `payment-ui-v4.20260523.2204` ✓ |

## Rollback

```bash
# On server: revert docker-compose.yml to payment-ui-v3
# Or locally:
git revert 4393592
git push
ssh root@10.113.213.1 "cd ~/deployment/server2 && git pull && docker compose up -d --force-recreate litellm"
```

Note: DB tables will remain but won't be queried since routes are gone.
