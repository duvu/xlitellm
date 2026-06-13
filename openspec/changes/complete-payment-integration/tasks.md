## 1. Fix PaymentCallbackHandler to inherit CustomLogger

- [x] 1.1 Update `integration.py`: add `from litellm.integrations.custom_logger import CustomLogger` import and change class to inherit from it
- [x] 1.2 Update `async_pre_call_hook` signature to match `CustomLogger` base class: `(self, user_api_key_dict: UserAPIKeyAuth, cache: DualCache, data: dict, call_type: CallTypesLiteral) -> Optional[Union[Exception, str, dict]]`
- [x] 1.3 Add `_resolve_user_id` helper using `_PLACEHOLDER_USER_IDS` frozenset: try `user_id`, fall back to `user_email`, return `None` if neither resolves
- [x] 1.4 Update `async_pre_call_hook` to use `_resolve_user_id` — skip balance check if user identity is `None`
- [x] 1.5 Update `async_log_success_event` to use `_resolve_user_id` — skip deduction if user identity is `None`
- [x] 1.6 Add proper type imports: `UserAPIKeyAuth`, `DualCache`, `CallTypesLiteral` from litellm

## 2. Start Reconciliation Loop from Startup Hook

- [x] 2.1 In `proxy_integration.py`: add module-level `_reconciliation_task: Optional[asyncio.Task] = None`
- [x] 2.2 Add `_start_reconciliation()` function that checks if any providers are registered, gets the running event loop, and creates asyncio task for `start_reconciliation_loop()`
- [x] 2.3 Call `_start_reconciliation()` at end of `startup_hook()` after `_ensure_tables()`

## 3. Integration Tests

- [x] 3.1 Create `tests/test_integration.py` with fixtures mocking litellm proxy app and DB session
- [x] 3.2 Test: `PaymentCallbackHandler` is instance of `CustomLogger`
- [x] 3.3 Test: `async_pre_call_hook` returns data when balance sufficient
- [x] 3.4 Test: `async_pre_call_hook` raises 402 when balance insufficient
- [x] 3.5 Test: placeholder user_id is resolved to email or skipped
- [x] 3.6 Test: `async_log_success_event` deducts cost for valid user
- [x] 3.7 Test: `async_log_success_event` skips deduction for unresolved user

## 4. Build and Deploy

- [x] 4.1 Build wheel: `cd /home/beou/IdeaProjects/litellm-payment && python -m build`
- [x] 4.2 Write Dockerfile extending v10 image, install updated wheel with `--force-reinstall --no-deps`
- [x] 4.3 Build and push new Docker image (v11)
- [x] 4.4 Update `docker-compose.yml` to v11 tag, commit and push deployment repo
- [x] 4.5 SSH deploy: recreate litellm container

## 5. Verification

- [x] 5.1 Verify container starts without errors (RestartCount=0)
- [x] 5.2 Verify `/openapi.json` returns 200
- [x] 5.3 Verify `/payment/balance` with user key returns 200
- [x] 5.4 Check container logs for "Payment callback handler registered" and "Starting SePay reconciliation loop"
- [x] 5.5 Run unit tests: `cd /home/beou/IdeaProjects/litellm-payment && pytest tests/ -v`
