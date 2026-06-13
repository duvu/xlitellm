## 1. Repository & Package Setup

- [x] 1.1 Create private repository `litellm-payment` on GitHub (duvu/litellm-payment)
- [x] 1.2 Initialize Python package with src layout (`src/litellm_payment/`)
- [x] 1.3 Create `pyproject.toml` with metadata, dependencies (httpx, pydantic, sqlalchemy, alembic), and litellm as peer dependency
- [x] 1.4 Setup Alembic for database migrations with `payment_` table prefix
- [x] 1.5 Create initial migration: `payment_transactions`, `payment_user_balance` tables
- [x] 1.6 Add basic CLI entry point (`litellm-payment migrate`, `litellm-payment status`)

## 2. Payment Gateway Abstraction

- [x] 2.1 Define `PaymentProvider` abstract base class with `create_payment`, `verify_webhook`, `get_payment_status`, `list_transactions` methods
- [x] 2.2 Define Pydantic models: `CreatePaymentRequest`, `PaymentIntent`, `WebhookEvent`, `PaymentStatus`
- [x] 2.3 Implement `PaymentProviderRegistry` with register/get provider methods
- [x] 2.4 Implement idempotency logic for webhook processing (transaction_id dedup)
- [x] 2.5 Write unit tests for abstraction layer (mock provider)

## 3. SePay Provider

- [x] 3.1 Implement `SepayProvider` class extending `PaymentProvider`
- [x] 3.2 Implement `create_payment` - call SePay API, return QR/bank info
- [x] 3.3 Implement `verify_webhook` - HMAC-SHA256 signature verification
- [x] 3.4 Implement `get_payment_status` - query SePay transaction API
- [x] 3.5 Implement configuration loading from env vars (`SEPAY_API_KEY`, `SEPAY_WEBHOOK_SECRET`, `SEPAY_BANK_ACCOUNT_NUMBER`, `SEPAY_BANK_CODE`)
- [x] 3.6 Write unit tests with mocked SePay API responses
- [x] 3.7 Implement reconciliation polling job

## 4. PayOS Provider

- [x] 4.1 Implement `PayosProvider` class extending `PaymentProvider`
- [x] 4.2 Implement `create_payment` - call PayOS API, return payment link and order_code
- [x] 4.3 Implement `verify_webhook` - PayOS checksum signature verification
- [x] 4.4 Implement `get_payment_status` - query PayOS order API
- [x] 4.5 Implement configuration loading from env vars (`PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`)
- [x] 4.6 Write unit tests with mocked PayOS API responses

## 5. API Endpoints

- [x] 5.1 Create FastAPI router for `/payment/*` endpoints
- [x] 5.2 Implement `POST /payment/create` - create payment intent
- [x] 5.3 Implement `GET /payment/{payment_id}` - query payment status
- [x] 5.4 Implement `GET /payment/list` - list user payments with pagination
- [x] 5.5 Implement `GET /payment/balance` - get user balance
- [x] 5.6 Implement `POST /payment/webhook/{provider}` - webhook receiver
- [x] 5.7 Implement `GET /payment/admin/list` - admin list all payments
- [x] 5.8 Implement `POST /payment/admin/credit` - admin manual credit
- [x] 5.9 Add authentication middleware (reuse LiteLLM's user_api_key_auth)
- [x] 5.10 Write API endpoint tests

## 6. LiteLLM Integration

- [x] 6.1 Create `PaymentCallback` class extending LiteLLM's `CustomLogger`
- [x] 6.2 Implement `async_pre_call_hook` - balance check (reject with 402 if insufficient)
- [x] 6.3 Implement `async_log_success_event` - deduct cost from balance after successful call
- [x] 6.4 Implement auto-registration logic (detect litellm proxy, register callback + routes)
- [x] 6.5 Support configuration via litellm_config.yaml `payment` section
- [x] 6.6 Write integration tests (mock litellm callback flow)

## 7. Docker & Deployment Integration

- [x] 7.1 Create Dockerfile fragment for building payment module into litellm image
- [x] 7.2 Create build script to generate wheel file
- [x] 7.3 Update private litellm Docker build to include payment module wheel
- [x] 7.4 Add payment environment variables to docker-compose deployment
- [x] 7.5 Run Alembic migrations in container startup or as init container
- [x] 7.6 Test end-to-end: build image → start container → create payment → webhook → balance updated

## 8. Documentation & Final Verification

- [x] 8.1 Write README.md with setup instructions, configuration reference, and API docs
- [x] 8.2 Document adding a new payment provider (developer guide)
- [x] 8.3 Run full test suite (unit + integration)
- [x] 8.4 Verify no dependency conflicts with litellm package
