## ADDED Requirements

### Requirement: SePay Payment Creation
The system SHALL create payments via SePay API, generating QR bank transfer codes for users to scan and pay.

#### Scenario: Create SePay payment
- **WHEN** a payment intent is created with provider "sepay"
- **THEN** the system SHALL call SePay API to generate a payment with bank transfer QR code
- **THEN** the returned PaymentIntent SHALL contain `qr_data` (base64 QR image or QR URL) and `bank_info` (account number, bank name, transfer content)

#### Scenario: SePay API unavailable
- **WHEN** the SePay API returns an error or times out
- **THEN** the system SHALL return a provider error with details and NOT create a payment record

### Requirement: SePay Webhook Handling
The system SHALL receive and verify SePay webhook notifications for completed bank transfers.

#### Scenario: Successful payment notification
- **WHEN** SePay sends a webhook with transferType="in" and valid signature
- **THEN** the system SHALL mark the corresponding payment as "completed" and credit the user balance

#### Scenario: SePay signature verification
- **WHEN** a webhook is received at `/payment/webhook/sepay`
- **THEN** the system SHALL verify the HMAC-SHA256 signature using the configured SePay webhook secret

### Requirement: SePay Transaction Reconciliation
The system SHALL support polling SePay API to reconcile transactions that may have been missed due to webhook delivery failures.

#### Scenario: Reconciliation finds unprocessed payment
- **WHEN** the reconciliation job runs and finds a completed transaction in SePay that has no matching completed payment locally
- **THEN** the system SHALL create/update the payment record and credit the user balance

#### Scenario: Reconciliation with no discrepancies
- **WHEN** the reconciliation job runs and all SePay transactions match local records
- **THEN** no balance changes SHALL be made

### Requirement: SePay Configuration
The system SHALL require the following environment variables for SePay: `SEPAY_API_KEY`, `SEPAY_WEBHOOK_SECRET`, `SEPAY_BANK_ACCOUNT_NUMBER`, `SEPAY_BANK_CODE`.

#### Scenario: Missing SePay configuration
- **WHEN** the SePay provider is loaded without required environment variables
- **THEN** the system SHALL raise a configuration error at startup with a clear message indicating which variables are missing
