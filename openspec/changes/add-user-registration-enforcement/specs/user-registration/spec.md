## ADDED Requirements

### Requirement: User can self-register for the payment system
The system SHALL provide a `POST /payment/register` endpoint that creates a payment balance record for the authenticated user. Registration is idempotent — subsequent calls return the existing record.

#### Scenario: First-time registration
- **WHEN** an authenticated user calls `POST /payment/register` and has no existing `payment_user_balance` row
- **THEN** the system creates a `PaymentUserBalance` row with `user_id` set to the resolved identity and `balance=0`, and returns HTTP 201 with `{"user_id": "<id>", "balance": 0, "currency": "VND", "registered": true}`

#### Scenario: Already registered user
- **WHEN** an authenticated user calls `POST /payment/register` and already has a `payment_user_balance` row
- **THEN** the system returns HTTP 200 with the existing balance record including `{"registered": true}`

#### Scenario: Unauthenticated request
- **WHEN** a request to `POST /payment/register` has no valid Bearer token
- **THEN** the system returns HTTP 401

#### Scenario: Unidentifiable user (placeholder key)
- **WHEN** a request to `POST /payment/register` uses a key with no `user_id` and no `user_email`
- **THEN** the system returns HTTP 401 with `"Cannot identify user: token carries no user_id or user_email"`

### Requirement: User can check registration status
The system SHALL provide a `GET /payment/register/status` endpoint that returns the user's registration status and current balance.

#### Scenario: Registered user checks status
- **WHEN** a registered user calls `GET /payment/register/status`
- **THEN** the system returns HTTP 200 with `{"registered": true, "user_id": "<id>", "balance": <amount>, "currency": "VND"}`

#### Scenario: Unregistered user checks status
- **WHEN** an authenticated but unregistered user calls `GET /payment/register/status`
- **THEN** the system returns HTTP 200 with `{"registered": false, "user_id": "<id>", "balance": 0}`

### Requirement: Admin can list registered users
The system SHALL provide a `GET /payment/admin/users` endpoint that returns a paginated list of all registered users (all rows in `payment_user_balance`).

#### Scenario: Admin lists users
- **WHEN** an admin calls `GET /payment/admin/users?page=1&page_size=50`
- **THEN** the system returns HTTP 200 with `{"page": 1, "page_size": 50, "items": [{"user_id": "...", "balance": ..., "currency": "VND", "last_updated": "..."}]}`

#### Scenario: Non-admin attempts to list users
- **WHEN** a non-admin user calls `GET /payment/admin/users`
- **THEN** the system returns HTTP 403
