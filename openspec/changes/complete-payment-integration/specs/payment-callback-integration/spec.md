## ADDED Requirements

### Requirement: Callback handler inherits CustomLogger

The `PaymentCallbackHandler` class SHALL inherit from `litellm.integrations.custom_logger.CustomLogger` to ensure LiteLLM's callback dispatcher invokes its hooks.

#### Scenario: Handler is recognized as CustomLogger instance
- **WHEN** `PaymentCallbackHandler` is instantiated
- **THEN** `isinstance(handler, CustomLogger)` SHALL return `True`

#### Scenario: Handler registered in litellm.callbacks
- **WHEN** `startup_hook()` runs and appends handler to `litellm.callbacks`
- **THEN** the handler SHALL be invocable by LiteLLM's proxy callback dispatcher

### Requirement: Pre-call hook enforces balance with correct signature

The `async_pre_call_hook` method SHALL accept `(self, user_api_key_dict: UserAPIKeyAuth, cache: DualCache, data: dict, call_type: CallTypesLiteral)` and return `Optional[Union[Exception, str, dict]]`.

#### Scenario: Sufficient balance allows request
- **WHEN** user has balance >= estimated cost
- **THEN** the hook SHALL return `data` unchanged (passthrough)

#### Scenario: Insufficient balance rejects request
- **WHEN** user has balance < estimated cost and `enforce_balance=True`
- **THEN** the hook SHALL raise `HTTPException(status_code=402)` with error code `PAYMENT_REQUIRED`

#### Scenario: Enforcement disabled skips check
- **WHEN** `enforce_balance=False` in config
- **THEN** the hook SHALL return `data` without checking balance

### Requirement: User identity resolution in callback

The callback handler SHALL resolve user identity using the same priority chain as the router: `user_id` → `user_email` → skip.

#### Scenario: Valid user_id used for balance operations
- **WHEN** `user_api_key_dict.user_id` is a real UUID (not in placeholder set)
- **THEN** the handler SHALL use that `user_id` for balance check and deduction

#### Scenario: Placeholder user_id falls back to email
- **WHEN** `user_api_key_dict.user_id` is `None`, `""`, or `"default_user_id"`
- **AND** `user_api_key_dict.user_email` is a non-empty string
- **THEN** the handler SHALL use `user_email` as the identity for balance operations

#### Scenario: No resolvable identity skips balance operations
- **WHEN** `user_api_key_dict.user_id` is placeholder AND `user_api_key_dict.user_email` is empty/None
- **THEN** the handler SHALL skip balance check/deduction (return data unchanged, no error)

### Requirement: Post-call hook deducts actual cost

The `async_log_success_event` method SHALL deduct the actual LLM call cost from the resolved user's balance.

#### Scenario: Cost deducted after successful call
- **WHEN** a successful LLM call completes with cost > 0
- **AND** user identity resolves to a valid ID
- **THEN** the handler SHALL deduct the cost (in VND) from that user's balance

#### Scenario: Zero cost calls skip deduction
- **WHEN** actual cost is 0 or cannot be determined
- **THEN** the handler SHALL not modify the user's balance

### Requirement: Reconciliation loop auto-starts

The `startup_hook()` SHALL launch the reconciliation background loop after route registration.

#### Scenario: Loop starts when providers are configured
- **WHEN** `startup_hook()` completes successfully
- **AND** at least one provider is registered
- **THEN** `start_reconciliation_loop()` SHALL be running as a background asyncio task

#### Scenario: Loop skips when no providers configured
- **WHEN** no payment providers are successfully registered
- **THEN** reconciliation loop SHALL not start (no error, just skip)

#### Scenario: Loop survives individual cycle failures
- **WHEN** a single reconciliation cycle throws an exception
- **THEN** the loop SHALL log the error and continue to the next cycle
