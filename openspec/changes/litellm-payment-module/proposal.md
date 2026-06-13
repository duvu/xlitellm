## Why

LiteLLM proxy cần một module thanh toán để quản lý billing cho người dùng API. Hiện tại không có cơ chế thu phí tự động - module payment riêng biệt sẽ cho phép tích hợp các cổng thanh toán Việt Nam (SePay, PayOS) và mở rộng sang các merchant khác sau này. Module cần tách biệt khỏi codebase public của LiteLLM vì lý do bảo mật và licensing.

## What Changes

- Tạo repository private riêng biệt chứa payment module (`litellm-payment`)
- Phát triển payment gateway abstraction layer hỗ trợ multiple providers
- Tích hợp SePay (QR bank transfer) và PayOS (payment gateway) làm 2 provider đầu tiên
- Cung cấp REST API endpoints cho payment operations (create payment, check status, webhook handling)
- Tích hợp với LiteLLM proxy thông qua callback hooks và custom middleware
- Package module dưới dạng installable Python package, dễ dàng build vào Docker image riêng
- Webhook endpoints để nhận payment confirmations từ SePay/PayOS

## Capabilities

### New Capabilities

- `payment-gateway-abstraction`: Abstract layer cho multiple payment providers với common interface (create payment, query status, handle webhook, refund)
- `sepay-provider`: SePay integration - QR bank transfer payments, webhook confirmation, transaction reconciliation
- `payos-provider`: PayOS integration - payment link generation, webhook handling, order management
- `payment-api-endpoints`: REST API endpoints tích hợp vào LiteLLM proxy (create payment intent, check status, list transactions, webhook receivers)
- `payment-litellm-integration`: Hook-based integration với LiteLLM proxy - balance checking, usage-based billing, automatic top-up triggers
- `payment-packaging`: Standalone Python package structure, pip-installable, Docker build integration, environment-based configuration

### Modified Capabilities

<!-- No existing capabilities are being modified at the spec level -->

## Impact

- **New repository**: `litellm-payment` (private) - standalone Python package
- **LiteLLM proxy integration**: Custom callback hooks, optional middleware for balance enforcement
- **APIs**: New `/payment/*` endpoints added to proxy when module is installed
- **Dependencies**: httpx (HTTP client for provider APIs), pydantic (models), cryptography (webhook signature verification)
- **Database**: New tables for payment transactions, user balances (via Prisma migration or standalone DB)
- **Deployment**: Modified Dockerfile/docker-compose to include payment module in private builds
- **Security**: Webhook secrets, API keys for SePay/PayOS stored as environment variables
