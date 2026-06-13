## Why

All payment API endpoints (`/payment/balance`, `/payment/list`, etc.) return 401 Unauthorized for every authenticated UI user. The `litellm-payment` router uses a custom `get_current_user` dependency that attempts to read `request.state.user_api_key_user_id`, but LiteLLM's auth (`user_api_key_auth`) is a FastAPI `Depends` dependency — not middleware — so `request.state` is never populated with auth data unless the route explicitly declares it. The fallback reads an `x-user-id` header that browsers never send. Every call fails.

## What Changes

- **`litellm_payment/api/router.py`**: Replace the custom `get_current_user` function with one that uses `Depends(user_api_key_auth)` from LiteLLM, extracting `user_id` and `is_admin` from the validated `UserAPIKeyAuth` dict
- **No API contract change**: Route paths, request/response schemas, and HTTP methods are unchanged
- **No database schema change**: No migrations required

## Capabilities

### New Capabilities
_(none — this is a bug fix, not a new feature)_

### Modified Capabilities
- **payment-api-auth**: The payment API authentication behavior changes from "always 401 due to broken state-read" to "authenticate via LiteLLM's standard bearer token validation"

## Impact

- **Affected code**: `litellm_payment/api/router.py` (the `get_current_user` function only)
- **Dependency**: Adds explicit runtime dependency on `litellm.proxy.auth.user_api_key_auth` and `litellm.proxy._types.UserAPIKeyAuth`/`LitellmUserRoles` (already present as transitive deps since `litellm-payment` is a LiteLLM plugin)
- **Deployment**: Requires rebuilding the `litellm-payment` wheel and a new Docker image for the LiteLLM proxy
- **Rollback**: Revert `docker-compose.yml` image tag to `payment-ui-v3.20260523.2148`
