## ADDED Requirements

### Requirement: PayOS Payment Creation
The system SHALL create payments via PayOS API, generating payment links for users.

#### Scenario: Create PayOS payment
- **WHEN** a payment intent is created with provider "payos"
- **THEN** the system SHALL call PayOS API to create a payment order
- **THEN** the returned PaymentIntent SHALL contain `payment_url` (checkout link) and `order_code`

#### Scenario: PayOS API unavailable
- **WHEN** the PayOS API returns an error or times out
- **THEN** the system SHALL return a provider error with details and NOT create a payment record

### Requirement: PayOS Webhook Handling
The system SHALL receive and verify PayOS webhook notifications for payment status changes.

#### Scenario: Successful payment notification
- **WHEN** PayOS sends a webhook with status "PAID" and valid signature
- **THEN** the system SHALL mark the corresponding payment as "completed" and credit the user balance

#### Scenario: Cancelled payment notification
- **WHEN** PayOS sends a webhook with status "CANCELLED"
- **THEN** the system SHALL mark the corresponding payment as "failed" and NOT credit any balance

#### Scenario: PayOS signature verification
- **WHEN** a webhook is received at `/payment/webhook/payos`
- **THEN** the system SHALL verify the signature using the configured PayOS checksum key

### Requirement: PayOS Order Query
The system SHALL support querying PayOS API directly for payment order status.

#### Scenario: Query PayOS order status
- **WHEN** a payment status check is requested for a PayOS payment
- **THEN** the system SHALL query PayOS API with the order_code and return the current status

### Requirement: PayOS Configuration
The system SHALL require the following environment variables for PayOS: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`.

#### Scenario: Missing PayOS configuration
- **WHEN** the PayOS provider is loaded without required environment variables
- **THEN** the system SHALL raise a configuration error at startup with a clear message indicating which variables are missing
