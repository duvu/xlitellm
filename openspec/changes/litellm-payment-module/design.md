## Context

LiteLLM proxy hiện quản lý budget/spend tracking qua database (Prisma) nhưng không có cơ chế thu phí trực tiếp từ người dùng. Hệ thống hiện tại track usage và enforce budget limits, nhưng việc nạp tiền/thanh toán hoàn toàn manual.

Module payment sẽ là một Python package riêng biệt (`litellm-payment`), hosted trong private repository, được cài đặt vào LiteLLM proxy thông qua pip install hoặc baked vào Docker image. Module này integrate với LiteLLM thông qua callback system và custom endpoints.

**Constraints:**
- Phải tách biệt hoàn toàn khỏi litellm public codebase
- Phải hoạt động như optional plugin - litellm proxy vẫn chạy bình thường khi không có module
- Payment providers ban đầu: SePay (QR bank transfer), PayOS (payment links)
- Phải extensible cho providers mới trong tương lai
- Webhook handling phải secure (signature verification)

## Goals / Non-Goals

**Goals:**
- Standalone Python package có thể pip install và tích hợp vào LiteLLM proxy
- Abstract payment gateway interface cho multiple providers
- SePay và PayOS integration hoàn chỉnh (create payment, webhook, status check)
- REST API endpoints cho payment operations khi module được cài đặt
- Balance management tích hợp với LiteLLM spend tracking
- Dễ dàng thêm payment provider mới (implement interface + register)
- Docker-friendly packaging cho private deployment builds

**Non-Goals:**
- Subscription/recurring billing (phase sau)
- Multi-currency support (chỉ VND giai đoạn đầu)
- Admin UI cho payment management (dùng API trước)
- Refund automation (manual refund qua API)
- Invoice generation
- Tax calculation

## Decisions

### 1. Separate Repository + pip Package

**Decision:** Module payment sẽ là standalone Python package trong private repo, cài đặt qua pip.

**Alternatives considered:**
- Monorepo subfolder: Vi phạm yêu cầu tách biệt khỏi public repo
- Git submodule: Phức tạp, khó manage versions
- Plugin via entry_points: Quá abstract, harder to debug

**Rationale:** pip package cho phép version pinning, easy Docker integration (`pip install git+ssh://...` hoặc copy wheel vào build), và clear dependency boundary.

### 2. Provider Pattern (Strategy + Registry)

**Decision:** Mỗi payment provider implement `PaymentProvider` abstract class. Registry pattern để discover/load providers.

```python
class PaymentProvider(ABC):
    @abstractmethod
    async def create_payment(self, request: CreatePaymentRequest) -> PaymentIntent: ...
    @abstractmethod
    async def verify_webhook(self, headers: dict, body: bytes) -> WebhookEvent: ...
    @abstractmethod
    async def get_payment_status(self, payment_id: str) -> PaymentStatus: ...
```

**Rationale:** Clean separation, easy to add new providers, testable with mocks.

### 3. LiteLLM Integration via Custom Callbacks + Router

**Decision:** Payment module registers itself as LiteLLM custom callback và adds FastAPI routes khi được import.

```python
# In litellm config yaml:
litellm_settings:
  callbacks: ["litellm_payment.callbacks.PaymentCallback"]

# Or auto-register on import:
# litellm_payment auto-detects litellm proxy and registers routes
```

**Alternatives:**
- Middleware-only: Không đủ cho full payment flow
- Separate microservice: Overkill, adds network hop
- Monkey-patching: Fragile, breaks on upgrades

**Rationale:** LiteLLM's callback system đã support custom hooks. Adding FastAPI routes programmatically cho phép payment endpoints sống cùng proxy mà không modify source.

### 4. Database Strategy

**Decision:** Dùng chung PostgreSQL database với LiteLLM proxy, thêm tables riêng cho payment (prefix `payment_`). Migrations managed bởi Alembic (không dùng Prisma vì đó là LiteLLM's concern).

**Alternatives:**
- Separate database: Extra infrastructure, harder to join with spend data
- SQLite for payment: Không production-ready
- Prisma migrations: Couples too tightly with LiteLLM's schema management

**Rationale:** Shared DB cho phép query payment data cùng spend data. Alembic migrations tách biệt khỏi LiteLLM's Prisma. Tables có prefix riêng để tránh collision.

### 5. Webhook Security

**Decision:** Mỗi provider có riêng webhook signature verification. Module expose `/payment/webhook/{provider}` endpoint. Signature verification mandatory.

**Rationale:** SePay dùng HMAC-SHA256, PayOS dùng signature riêng. Phải verify trước khi process.

### 6. Balance Model

**Decision:** Payment module maintains `payment_user_balance` table. Khi payment confirmed → update balance. LiteLLM callback checks balance trước mỗi request (optional enforcement).

**Flow:**
1. User tạo payment intent → QR/link
2. User thanh toán → Provider gửi webhook
3. Webhook verified → Update `payment_user_balance`
4. LiteLLM pre-call hook: check balance >= estimated cost
5. LiteLLM post-call hook: deduct actual cost from balance

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Webhook delivery failure (missed payments) | Polling reconciliation job chạy periodic, so sánh với provider API |
| Race condition on balance update | Database-level locking (SELECT FOR UPDATE) trên balance row |
| Provider API downtime | Graceful degradation - payment creation fails with clear error, existing balances still work |
| Schema conflicts with LiteLLM migrations | Separate migration chain (Alembic), table prefix `payment_`, no FK to litellm tables |
| Module version incompatible with LiteLLM version | Pin compatible LiteLLM version range in package requirements |
| Webhook replay attacks | Idempotency key per transaction, dedup check before processing |

## Migration Plan

**Phase 1 - Module Setup:**
1. Create private repo `litellm-payment`
2. Setup package structure (pyproject.toml, src layout)
3. Implement provider abstraction + SePay provider
4. Basic API endpoints
5. Docker integration into private litellm build

**Phase 2 - PayOS + Production:**
1. Add PayOS provider
2. Balance enforcement callback
3. Reconciliation job
4. Production deployment

**Rollback:** Module is optional - removing it from pip install / Docker build restores vanilla LiteLLM behavior instantly.

## Open Questions

1. Nên dùng LiteLLM's existing `LiteLLM_UserTable.max_budget` field hay maintain balance riêng?
   - **Leaning toward**: Maintain riêng (`payment_user_balance`) vì LiteLLM budget là hard limit, payment balance là available funds. Sync giữa hai khi cần.
2. Payment webhooks cần authentication không (ngoài signature verification)?
   - **Leaning toward**: Không, signature verification là đủ (industry standard cho webhooks).
3. Có cần admin approval cho large payments?
   - **Leaning toward**: Phase sau, ban đầu auto-approve tất cả.
