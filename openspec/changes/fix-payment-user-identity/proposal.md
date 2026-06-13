## Why

Payment balance is keyed on `user_id` from LiteLLM's `UserAPIKeyAuth`, but keys created without an explicit user association receive `user_id = "default_user_id"`. Multiple users end up sharing the same balance bucket under this placeholder, making the payment feature unusable in production.

## What Changes

- `get_current_user` in `litellm_payment/api/router.py` resolves effective user identity via a priority chain: `user_id` (when not a known placeholder) → `user_email` → HTTP 401 (cannot identify user)
- All payment operations (balance, create, list, webhook credit) use this resolved identity
- No schema or DB migration needed — the fix is purely in the auth layer

## Capabilities

### New Capabilities
- `user-identity-resolution`: Derive a stable, unique user identifier from `UserAPIKeyAuth` for payment operations

### Modified Capabilities
None.
