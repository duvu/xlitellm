## Context

The litellm-payment module (`/home/beou/IdeaProjects/litellm-payment/`) is a standalone FastAPI plugin registered via `LITELLM_WORKER_STARTUP_HOOKS`. It currently:
- Provides `/payment/*` routes for balance checking, payment creation, webhooks
- Uses `PaymentCallbackHandler` (inherits `CustomLogger`) for pre-call balance checks and post-call cost deduction
- Resolves user identity via `_resolve_user_id()` which falls back user_id → user_email → None
- When user identity is `None` (unresolved), the pre-call hook **allows the call through** (returns `data`)

The current enforcement gap: users without a registered identity or with zero balance can still make inference calls.

## Goals / Non-Goals

**Goals:**
- Allow users to self-register with email via a new API endpoint
- Block ALL inference calls for users without positive balance when enforcement is enabled
- Block unregistered/unidentified users from inference APIs (402 response)
- Provide admin visibility into registered users

**Non-Goals:**
- Email verification (OTP, verification links) — out of scope for now
- User profile management (name changes, password, etc.)
- Integration with LiteLLM's own user management (`LiteLLM_UserTable`)
- Rate limiting or quota management beyond balance checks
- UI changes (no new pages in the dashboard)

## Decisions

### 1. Registration via existing `PaymentUserBalance` table

**Decision**: Use the existing `payment_user_balance` table as the registration record. If a row exists with `balance >= 0`, the user is "registered". No new table needed.

**Rationale**: The `PaymentUserBalance.user_id` already serves as the canonical user identity. Creating a separate registration table would add complexity with no value — the balance row IS the registration.

**Alternative considered**: New `payment_registered_users` table with email, name, created_at. Rejected because it duplicates identity already tracked by `user_id` in balance table.

### 2. Registration endpoint creates balance row with 0

**Decision**: `POST /payment/register` creates a `PaymentUserBalance(user_id=<email_or_user_id>, balance=0)` row if one doesn't already exist. Idempotent — calling again returns existing record.

**Rationale**: Simple, idempotent, no side effects. User still needs to top up before using paid APIs.

### 3. Enforcement change: block unresolved users with 402

**Decision**: In `PaymentCallbackHandler.async_pre_call_hook`, when `_resolve_user_id()` returns `None`, raise HTTP 402 instead of returning `data`.

**Rationale**: Current behavior silently allows unidentified users through. The new behavior matches the stated requirement: only users with balance > 0 can use inference.

### 4. Balance > 0 required (not >= 0)

**Decision**: The pre-call check requires `balance > 0` (strictly positive). A registered user with `balance == 0` will be blocked with 402.

**Rationale**: Matches the user requirement: "Chỉ những user có số dư trong tài khoản mới có thể sử dụng các API suy luận (có giá tiền > 0)". Zero balance = cannot use.

### 5. Registration uses authenticated identity

**Decision**: `/payment/register` requires `Depends(user_api_key_auth)` — the user must already have an API key. The registration simply ensures they have a balance row. The `user_id` comes from the resolved identity (same `_resolve_user_id` logic from `get_current_user`).

**Rationale**: We cannot create identities outside LiteLLM's auth system. Registration = "opt-in to the payment system" for an already-authenticated user.

## Risks / Trade-offs

- **[Breaking change]** Users who previously used inference with zero balance will get 402 → **Mitigation**: Admin can credit initial balance via `/payment/admin/credit`. Document the change clearly.
- **[No email verification]** Anyone with a valid API key can register → **Mitigation**: LiteLLM's existing key management controls who gets keys. Registration is just payment enrollment.
- **[Race condition on balance check]** Two concurrent calls could both pass the pre-call check, then both deductions push balance negative → **Mitigation**: Accept minor overdraft; reconciliation handles it. Adding DB-level locking would add latency to every inference call.
