## ADDED Requirements

### Requirement: Unregistered users are blocked from inference APIs
The system SHALL block inference API calls from users who cannot be identified (no `user_id` and no `user_email` resolved from their API key) when `enforce_balance=True`. The response MUST be HTTP 402 with a message indicating registration is required.

#### Scenario: Unidentified user attempts inference call
- **WHEN** `enforce_balance=True` AND a user makes an inference API call AND `_resolve_user_id()` returns `None`
- **THEN** the `async_pre_call_hook` raises HTTP 402 with `{"error": "Payment required", "code": "USER_NOT_REGISTERED", "message": "You must register for the payment system before using inference APIs. Call POST /payment/register"}`

#### Scenario: Enforcement disabled allows unidentified users
- **WHEN** `enforce_balance=False` AND an unidentified user makes an inference call
- **THEN** the call proceeds normally (no 402)

### Requirement: Users with zero or negative balance are blocked
The system SHALL block inference API calls from users whose `payment_user_balance.balance <= 0` when `enforce_balance=True`. The response MUST be HTTP 402 indicating insufficient balance.

#### Scenario: Registered user with zero balance
- **WHEN** `enforce_balance=True` AND a registered user with `balance=0` makes an inference call
- **THEN** the `async_pre_call_hook` raises HTTP 402 with `{"error": "Insufficient balance", "code": "PAYMENT_REQUIRED", "message": "Your payment balance is insufficient for this request. Please top up your balance at /payment/create"}`

#### Scenario: Registered user with positive balance
- **WHEN** `enforce_balance=True` AND a registered user with `balance > 0` makes an inference call
- **THEN** the call proceeds normally (pre-call hook returns `data`)

#### Scenario: User with negative balance (overdraft)
- **WHEN** `enforce_balance=True` AND a user has `balance < 0` (due to race condition overdraft)
- **THEN** the `async_pre_call_hook` raises HTTP 402

### Requirement: Balance check uses actual DB balance (not estimated cost comparison)
The system SHALL check `balance > 0` directly rather than comparing estimated cost against balance. This simplifies the logic and ensures any user with positive balance can make at least one call.

#### Scenario: User with balance=1 VND makes expensive call
- **WHEN** a user has `balance=1` and makes an inference call estimated at 500 VND
- **THEN** the pre-call hook allows the call (balance > 0), and the post-call hook deducts actual cost (may go negative)

#### Scenario: User with balance=0 makes any call
- **WHEN** a user has `balance=0` and makes any inference call
- **THEN** the pre-call hook blocks with 402 (balance is not > 0)
