## ADDED Requirements

### Requirement: Create Payment Intent Endpoint
The system SHALL expose `POST /payment/create` to create a new payment intent.

#### Scenario: Authenticated user creates payment
- **WHEN** an authenticated user calls `POST /payment/create` with `{"provider": "sepay", "amount": 100000, "currency": "VND"}`
- **THEN** the system SHALL return HTTP 201 with the PaymentIntent object including payment_url/qr_data

#### Scenario: Unauthenticated request
- **WHEN** a request without valid API key calls `POST /payment/create`
- **THEN** the system SHALL return HTTP 401

#### Scenario: Unsupported provider
- **WHEN** a request specifies a provider that is not configured
- **THEN** the system SHALL return HTTP 400 with error message listing available providers

### Requirement: Payment Status Endpoint
The system SHALL expose `GET /payment/{payment_id}` to query payment status.

#### Scenario: User queries own payment
- **WHEN** an authenticated user calls `GET /payment/{payment_id}` for their own payment
- **THEN** the system SHALL return the payment details and current status

#### Scenario: User queries another user's payment
- **WHEN** an authenticated user calls `GET /payment/{payment_id}` for a payment belonging to another user
- **THEN** the system SHALL return HTTP 403 (unless user is admin)

### Requirement: List Payments Endpoint
The system SHALL expose `GET /payment/list` to list a user's payment history.

#### Scenario: List user payments with pagination
- **WHEN** an authenticated user calls `GET /payment/list?page=1&page_size=20`
- **THEN** the system SHALL return paginated list of user's payments ordered by creation date descending

### Requirement: User Balance Endpoint
The system SHALL expose `GET /payment/balance` to query the user's current payment balance.

#### Scenario: Query balance
- **WHEN** an authenticated user calls `GET /payment/balance`
- **THEN** the system SHALL return `{"balance": <amount>, "currency": "VND"}`

### Requirement: Webhook Receiver Endpoints
The system SHALL expose `POST /payment/webhook/{provider}` to receive payment provider webhooks.

#### Scenario: Receive SePay webhook
- **WHEN** SePay sends a POST to `/payment/webhook/sepay` with valid signature
- **THEN** the system SHALL process the webhook, update payment status, and return HTTP 200

#### Scenario: Receive PayOS webhook
- **WHEN** PayOS sends a POST to `/payment/webhook/payos` with valid signature
- **THEN** the system SHALL process the webhook, update payment status, and return HTTP 200

#### Scenario: Unknown provider webhook
- **WHEN** a POST is received at `/payment/webhook/unknown_provider`
- **THEN** the system SHALL return HTTP 404

### Requirement: Admin Payment Endpoints
The system SHALL expose admin-only endpoints for payment management.

#### Scenario: Admin lists all payments
- **WHEN** an admin user calls `GET /payment/admin/list`
- **THEN** the system SHALL return all payments across all users with filtering options (status, provider, user_id, date range)

#### Scenario: Admin manually credits balance
- **WHEN** an admin user calls `POST /payment/admin/credit` with `{"user_id": "...", "amount": 50000, "reason": "manual top-up"}`
- **THEN** the system SHALL credit the user's balance and create an audit record
