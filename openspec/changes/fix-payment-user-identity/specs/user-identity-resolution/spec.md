## ADDED Requirements

### Requirement: User identity resolved to a unique, non-placeholder value
The payment module SHALL resolve a stable, unique user identifier for every authenticated request.

#### Scenario: Token carries a real user_id
- **GIVEN** a Bearer token where `UserAPIKeyAuth.user_id` is a non-placeholder value (not None, not `""`, not `"default_user_id"`)
- **WHEN** any payment endpoint is called
- **THEN** `get_current_user` SHALL return `user_id = UserAPIKeyAuth.user_id`

#### Scenario: Token has placeholder user_id but has user_email
- **GIVEN** a Bearer token where `UserAPIKeyAuth.user_id` is `"default_user_id"` (or None / `""`)
- **AND** `UserAPIKeyAuth.user_email` is set to a non-empty string (e.g. `"alice@example.com"`)
- **WHEN** any payment endpoint is called (e.g. `GET /payment/balance`)
- **THEN** `get_current_user` SHALL return `user_id = UserAPIKeyAuth.user_email`
- **THEN** the balance response SHALL contain `"user_id": "alice@example.com"`
- **THEN** the balance SHALL be Alice's personal balance, isolated from other users

#### Scenario: Token has neither real user_id nor user_email
- **GIVEN** a Bearer token where `UserAPIKeyAuth.user_id` is a placeholder AND `user_email` is None or `""`
- **WHEN** any payment endpoint is called
- **THEN** the response SHALL be HTTP 401
- **THEN** the error detail SHALL contain `"Cannot identify user"`

#### Scenario: Multiple users with placeholder user_id get isolated balances
- **GIVEN** user Alice authenticated via UI (email: `alice@example.com`, `user_id = "default_user_id"`)
- **AND** user Bob authenticated via UI (email: `bob@example.com`, `user_id = "default_user_id"`)
- **WHEN** Alice calls `GET /payment/balance`
- **THEN** the response SHALL show Alice's balance (keyed on `"alice@example.com"`)
- **THEN** Bob's balance SHALL remain isolated from Alice's balance
