## ADDED Requirements

### Requirement: Payment Provider Interface
The system SHALL define an abstract `PaymentProvider` interface that all payment providers MUST implement. The interface SHALL include methods for: creating a payment intent, verifying webhook signatures, querying payment status, and listing transactions.

#### Scenario: Provider implements all required methods
- **WHEN** a new payment provider class is created
- **THEN** it MUST implement `create_payment`, `verify_webhook`, `get_payment_status`, and `list_transactions` methods

#### Scenario: Provider registration
- **WHEN** a payment provider is registered with the gateway
- **THEN** it SHALL be discoverable by its provider name (e.g., "sepay", "payos")

### Requirement: Payment Intent Creation
The system SHALL create a payment intent with amount, currency, user reference, and optional metadata. The payment intent SHALL return provider-specific payment details (QR code URL, payment link, etc.).

#### Scenario: Successful payment intent creation
- **WHEN** a valid create payment request is submitted with amount > 0, currency "VND", and a valid user_id
- **THEN** the system SHALL return a PaymentIntent object with: id, provider, amount, currency, status="pending", payment_url or qr_data, and expires_at

#### Scenario: Invalid amount
- **WHEN** a create payment request is submitted with amount <= 0
- **THEN** the system SHALL reject with a validation error

### Requirement: Webhook Verification
The system SHALL verify webhook authenticity using provider-specific signature verification before processing any webhook payload.

#### Scenario: Valid webhook signature
- **WHEN** a webhook is received with a valid signature header matching the configured secret
- **THEN** the system SHALL process the webhook and return the parsed WebhookEvent

#### Scenario: Invalid webhook signature
- **WHEN** a webhook is received with an invalid or missing signature
- **THEN** the system SHALL reject the webhook with HTTP 401 and NOT process the payment

### Requirement: Idempotent Webhook Processing
The system SHALL process each webhook event exactly once, using a transaction reference as idempotency key.

#### Scenario: Duplicate webhook received
- **WHEN** a webhook with the same transaction_id is received more than once
- **THEN** the system SHALL return success (HTTP 200) but NOT double-credit the user balance

### Requirement: Payment Status Query
The system SHALL allow querying the current status of a payment by its payment_id.

#### Scenario: Query existing payment
- **WHEN** a payment status query is made with a valid payment_id
- **THEN** the system SHALL return the current status (pending, completed, failed, expired)

#### Scenario: Query non-existent payment
- **WHEN** a payment status query is made with an unknown payment_id
- **THEN** the system SHALL return HTTP 404
