## Why

Users currently access inference APIs without any identity verification beyond an API key. There is no email registration step, so the system cannot enforce per-user billing. The payment module already checks balances (via `PaymentCallbackHandler`), but any key with `balance > 0` or no identity can bypass enforcement. We need: (1) user self-registration with email, and (2) strict enforcement that only registered users with positive balance can use paid inference endpoints.

## What Changes

- **New `/payment/register` endpoint**: Accepts email + optional name; creates or retrieves a `PaymentUserBalance` row and associates the user identity. Returns user_id for subsequent API usage.
- **Balance enforcement hardening in `PaymentCallbackHandler`**: Currently, if `_resolve_user_id()` returns `None` (unregistered user), the pre-call hook returns `data` (allowing the call). Change to **block** unregistered users with HTTP 402 when `enforce_balance=True`.
- **New `/payment/register/status` endpoint**: Allows users to check their registration status (registered, balance, etc.).
- **Admin endpoint to list registered users**: `/payment/admin/users` for admin visibility.

## Capabilities

### New Capabilities
- `user-registration`: Self-service user registration via email at `/payment/register`, plus registration status check. Establishes user identity in the payment system.
- `balance-gate-enforcement`: Strict pre-call enforcement requiring positive balance (> 0 VND) AND valid user identity for all paid inference calls. Unregistered or zero-balance users get HTTP 402.

### Modified Capabilities
- `payment-in-sidebar`: No requirement changes (UI already exists).

## Impact

- **Code**: `litellm_payment/api/router.py` (new endpoints), `litellm_payment/integration.py` (enforcement logic change), `litellm_payment/db.py` (possible schema extension for registration metadata)
- **APIs**: New `POST /payment/register`, `GET /payment/register/status`, `GET /payment/admin/users`
- **Behavior change**: Users without positive balance will receive 402 on all inference calls (previously allowed through). This is a **BREAKING** change for users who relied on zero-balance access.
- **Dependencies**: No new external dependencies.
