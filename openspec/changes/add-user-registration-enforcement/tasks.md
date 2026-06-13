## 1. Registration Endpoints

- [x] 1.1 Add `POST /payment/register` endpoint in `router.py` — uses `Depends(get_current_user)`, creates `PaymentUserBalance` row with `balance=0` if not exists, returns 201 (new) or 200 (existing) with `{"user_id", "balance", "currency", "registered": true}`
- [x] 1.2 Add `GET /payment/register/status` endpoint in `router.py` — returns `{"registered": true/false, "user_id", "balance", "currency"}`
- [x] 1.3 Add `GET /payment/admin/users` endpoint in `router.py` — `Depends(require_admin)`, paginated query on `PaymentUserBalance`, returns list of all registered users

## 2. Balance Gate Enforcement

- [x] 2.1 Modify `PaymentCallbackHandler.async_pre_call_hook` in `integration.py` — when `_resolve_user_id()` returns `None` AND `self._enforce=True`, raise HTTP 402 with `code: "USER_NOT_REGISTERED"` instead of returning `data`
- [x] 2.2 Modify balance check logic — replace `check_balance_sufficient(session, user_id, estimated_cost_vnd)` with simple `balance > 0` check via direct DB query on `payment_user_balance`
- [x] 2.3 Update `_estimate_cost_vnd` and related cost estimation — remove since we no longer compare estimated cost (just check balance > 0)

## 3. Tests

- [x] 3.1 Add test for `POST /payment/register` — first-time → 201 with balance=0, second-time → 200 with same record
- [x] 3.2 Add test for `GET /payment/register/status` — registered vs unregistered user
- [x] 3.3 Add test for `GET /payment/admin/users` — admin gets list, non-admin gets 403
- [x] 3.4 Update `test_integration.py` — test that unresolved user gets 402 (not allowed through)
- [x] 3.5 Update `test_integration.py` — test that user with balance=0 gets 402
- [x] 3.6 Update `test_integration.py` — test that user with balance>0 passes pre-call

## 4. Build & Deploy

- [ ] 4.1 Build new wheel from litellm-payment repo
- [ ] 4.2 Write Dockerfile extending current v11 image, install updated wheel
- [ ] 4.3 Build and push Docker image as v12
- [ ] 4.4 Update `docker-compose.yml` image tag to v12
- [ ] 4.5 Commit and push deployment repo
- [ ] 4.6 SSH deploy: pull + recreate litellm container

## 5. Verification

- [ ] 5.1 Verify container running, RestartCount=0
- [ ] 5.2 Verify `/openapi.json` → 200 and new endpoints visible
- [ ] 5.3 Verify `POST /payment/register` with valid user key → 201 first time, 200 second time
- [ ] 5.4 Verify `GET /payment/register/status` → registered=true after registration
- [ ] 5.5 Verify inference call with balance=0 → 402 (balance gate)
- [ ] 5.6 Verify admin credits user, then inference call → succeeds
