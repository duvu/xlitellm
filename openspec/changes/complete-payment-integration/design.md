## Context

The `litellm-payment` module (at `/home/beou/IdeaProjects/litellm-payment/`) is a standalone Python package providing payment gateway integration (SePay + PayOS) for the LiteLLM proxy. It registers routes via `LITELLM_WORKER_STARTUP_HOOKS=litellm_payment.proxy_integration:startup_hook` and appends a callback handler to `litellm.callbacks`.

Currently deployed at `root@10.113.213.1:5003` as Docker image `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v10.20260524.0016`. All API routes work (`/payment/balance`, `/payment/create`, etc.) but the callback handler has structural issues that prevent proper cost enforcement.

Key files:
- `src/litellm_payment/integration.py` — `PaymentCallbackHandler` (the LiteLLM callback)
- `src/litellm_payment/proxy_integration.py` — `startup_hook()`, route registration
- `src/litellm_payment/reconciliation.py` — `start_reconciliation_loop()` (never invoked)

## Goals / Non-Goals

**Goals:**
- `PaymentCallbackHandler` inherits `CustomLogger` and implements hooks with correct signatures
- Callback's user identity extraction rejects `default_user_id` placeholder (same as router logic)
- Reconciliation loop auto-starts as background task during proxy startup
- Integration test validates the full startup → callback → deduction flow

**Non-Goals:**
- No new API endpoints
- No DB schema changes
- No provider logic changes
- No UI changes

## Decisions

### 1. Inherit from `litellm.integrations.custom_logger.CustomLogger`

**Rationale**: LiteLLM's proxy dispatches callbacks by checking `isinstance(cb, CustomLogger)` for certain hook types. Without inheritance, `async_pre_call_hook` may never fire. The base class at `litellm/integrations/custom_logger.py:69` defines the canonical signatures.

**Alternative considered**: Keep standalone class and rely on duck typing. Rejected because LiteLLM explicitly checks class hierarchy for some hooks.

### 2. Match `async_pre_call_hook` signature exactly

The base class signature is:
```python
async def async_pre_call_hook(
    self,
    user_api_key_dict: UserAPIKeyAuth,
    cache: DualCache,
    data: dict,
    call_type: CallTypesLiteral,
) -> Optional[Union[Exception, str, dict]]:
```

Our implementation will accept these typed params and return `data` (passthrough) or raise `HTTPException(402)`.

### 3. User identity extraction in callback

Apply the same `_PLACEHOLDER_USER_IDS` check from `router.py`:
```python
_PLACEHOLDER_USER_IDS = frozenset({None, "", "default_user_id"})
```
If user_id is placeholder, fall back to `user_api_key_dict.user_email`. If neither resolves, skip balance check/deduction (don't deduct from wrong bucket).

### 4. Start reconciliation loop in startup_hook

After route registration and table creation, launch `start_reconciliation_loop()` as a background `asyncio.Task` (fire-and-forget). If providers aren't configured, the loop exits gracefully.

### 5. Integration test approach

Use `pytest` + FastAPI `TestClient` with mocked LiteLLM callback dispatch. Test:
- `startup_hook()` registers routes + callback
- `async_pre_call_hook` rejects when balance insufficient
- `async_log_success_event` deducts cost
- Placeholder user IDs are skipped (no deduction)

## Risks / Trade-offs

- [Risk] Reconciliation loop runs forever in background → Mitigation: Only starts if at least one provider is configured; logs errors, doesn't crash proxy
- [Risk] `CustomLogger` interface may change between LiteLLM versions → Mitigation: litellm is pinned in Docker image; bump carefully
- [Risk] `asyncio.Task` may be garbage-collected → Mitigation: Store task reference in module-level variable
