## Why

The `litellm-payment` module is functionally complete but has several integration gaps that prevent seamless operation within the LiteLLM proxy ecosystem. The callback handler doesn't inherit from LiteLLM's `CustomLogger` base class (may cause hooks to not fire), the reconciliation loop is never started, the callback's user identity extraction doesn't handle `default_user_id` placeholder (leading to wrong-bucket deductions), and there are no integration-level tests validating the module works end-to-end within a proxy instance.

## What Changes

- **Fix `PaymentCallbackHandler`** to inherit from `litellm.integrations.custom_logger.CustomLogger` with correct method signatures matching the base class
- **Fix user identity extraction in callback** to apply the same `_PLACEHOLDER_USER_IDS` logic from the router (skip deduction for unidentified users rather than deducting from `default_user_id` bucket)
- **Start reconciliation loop** from `startup_hook()` as a background asyncio task
- **Add integration test** validating end-to-end: startup hook → route registration → balance check callback → cost deduction flow
- **Add type annotations** to callback handler using LiteLLM's actual types (`UserAPIKeyAuth`, `DualCache`, `CallTypesLiteral`)

## Capabilities

### New Capabilities

- `payment-callback-integration`: Proper CustomLogger inheritance, correct method signatures, user identity resolution, and reconciliation auto-start

### Modified Capabilities

## Impact

- `litellm_payment/integration.py` — rewrite callback handler class to inherit CustomLogger
- `litellm_payment/proxy_integration.py` — add reconciliation loop launch in startup_hook
- `tests/` — new integration test file
- No API changes, no DB schema changes, no breaking changes
- Deployment: new Docker image build required after fix
