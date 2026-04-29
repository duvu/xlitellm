# LiteLLM Enterprise Feature Unlock Analysis

> **Explore mode notes** — Đây là tài liệu khảo sát, không phải implementation plan.
> Generated: 2026-04-29

---

## Cơ chế khóa Enterprise

Toàn bộ gating chạy qua một biến duy nhất:

```python
# litellm/proxy/proxy_server.py:535
premium_user: bool = _license_check.is_premium()
```

`is_premium()` trả về `True` khi:
1. **Online check**: `LITELLM_LICENSE` env var → gọi `https://license.litellm.ai/verify_license/{key}`
2. **Offline check**: License key được ký bằng RSA private key, verify bằng `public_key.pem` local

```
┌──────────────────────────────────────────────────────────────┐
│                    is_premium() flow                         │
│                                                              │
│  LITELLM_LICENSE env ──► verify_license_without_api_request  │
│                              │ RSA signature check           │
│                              ▼                               │
│                         if fail ──► _verify() (HTTP call)    │
│                                         │                    │
│                                         ▼                    │
│                               https://license.litellm.ai     │
│                                                              │
│  No license ──► premium_user = False (always)                │
└──────────────────────────────────────────────────────────────┘
```

**Điểm mấu chốt**: Nếu set `premium_user = True` ở dòng 535 trong `proxy_server.py`, **tất cả** các feature unlock ngay lập tức — vì đây là biến global được import và check trực tiếp.

---

## Danh sách Feature Enterprise (với đánh giá)

### Độ khó unlock: 🟢 Trivial | 🟡 Easy | 🟠 Medium | 🔴 Hard

---

### Category 1: Auth & Access Control

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **SSO (Microsoft/Google/Generic)** | `proxy/management_endpoints/ui_sso.py:159` | 🟢 Trivial | Chỉ check `premium_user`, không cần package riêng. Free tier cho ≤5 users, >5 bị block |
| **JWT Auth** | `proxy/auth/user_api_key_auth.py:506` | 🟢 Trivial | Chỉ check `premium_user` |
| **Custom public routes** | `proxy/auth/auth_utils.py:229` | 🟢 Trivial | Config `public_routes` trong general_settings |
| **admin_only_routes** | `proxy/auth/route_checks.py:265` | 🟢 Trivial | Config `admin_only_routes` |
| **IP Allowlist** | `proxy/proxy_server.py:2569` | 🟢 Trivial | Config `allowed_ips` |
| **OAuth2 check** | `proxy/auth/oauth2_check.py:133` | 🟢 Trivial | Check `premium_user` trước khi call oauth2 |
| **Custom SSO handler** | `management_endpoints/ui_sso.py:210` | 🟡 Easy | Cần `user_custom_ui_sso_sign_in_handler` — function callback, không cần package |

---

### Category 2: Request/Response Control

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **max_request_size_mb** | `proxy/auth/auth_utils.py:334` | 🟢 Trivial | Config `max_request_size_mb` trong general_settings |
| **max_response_size_mb** | `proxy/auth/auth_utils.py:398` | 🟢 Trivial | Config `max_response_size_mb` |
| **max_file_size_mb** (audio transcription) | `proxy/common_utils/http_parsing_utils.py:200` | 🟢 Trivial | Check `premium_user` |
| **enforced_params** | `proxy/litellm_pre_call_utils.py:1228` | 🟢 Trivial | Config `enforced_params` trong general_settings |
| **Pass-through endpoints** | `proxy/pass_through_endpoints/pass_through_endpoints.py:2117` | 🟢 Trivial | Check `premium_user` cho custom pass-through |
| **DISABLE_LLM_API_ENDPOINTS** | `enterprise/litellm_enterprise/proxy/auth/route_checks.py:18` | 🟢 Trivial | Env var + `premium_user` check |
| **DISABLE_ADMIN_ENDPOINTS** | `enterprise/litellm_enterprise/proxy/auth/route_checks.py:32` | 🟢 Trivial | Env var + `premium_user` check |

---

### Category 3: Key Management

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **Tags on API keys** | `management_endpoints/key_management_endpoints.py:595` | 🟢 Trivial | `tags` field khi tạo key |
| **Regenerate virtual keys** | `management_endpoints/key_management_endpoints.py:2716` | 🟢 Trivial | `/key/regenerate` endpoint. Note: regenerate master key được phép ngay cả free |
| **model_max_budget per key** | `management_endpoints/key_management_endpoints.py:3840` | 🟢 Trivial | Budget per model trong key config |
| **Per-key budget list** | `management_endpoints/key_management_endpoints.py:1994` | 🟢 Trivial | Liên quan budget list |

---

### Category 4: Team Management

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **Team model access control** | `management_endpoints/model_management_endpoints.py:519` | 🟢 Trivial | Team admin quản lý model |
| **model_info.team_id** | `management_endpoints/model_management_endpoints.py:551` | 🟢 Trivial | Gán model cho team cụ thể |
| **Team admins** | `management_endpoints/team_endpoints.py:1445` | 🟢 Trivial | Assign `team_admin` role |

---

### Category 5: Spend & Analytics

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **Spend reports** `/spend/report` | `proxy/spend_tracking/spend_management_endpoints.py:1003` | 🟢 Trivial | Reporting endpoint |
| **Tag budgets** | `litellm/router_strategy/budget_limiter.py:804` | 🟢 Trivial | Budget tracking by tag |

---

### Category 6: Integrations & Logging

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **GCS Bucket logging** | `integrations/gcs_bucket/gcs_bucket.py:46` | 🟡 Easy | Check `premium_user` + cần GCP credentials |
| **Azure Blob Storage logging** | `integrations/azure_storage/azure_storage.py:328` | 🟡 Easy | Check `premium_user` + cần Azure credentials |
| **Slack custom email alerts** | `integrations/SlackAlerting/slack_alerting.py:1177` | 🟢 Trivial | Custom email trong Slack alerts |
| **PagerDuty** | `enterprise/litellm_enterprise/enterprise_callbacks/pagerduty/` | 🟡 Easy | Cần `litellm-enterprise` package |

---

### Category 7: Secret Managers

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **CyberArk Secret Manager** | `secret_managers/cyberark_secret_manager.py:58` | 🟡 Easy | Check `premium_user` + cần CyberArk setup |
| **HashiCorp Vault** | `secret_managers/hashicorp_secret_manager.py:63` | 🟡 Easy | Check `premium_user` + cần Vault |
| **Google Secret Manager** | `secret_managers/google_secret_manager.py:29` | 🟡 Easy | Check `premium_user` + cần GCP |

---

### Category 8: Guardrails (cần `litellm-enterprise` package)

> ⚠️ Các feature này có **double gate**: check `premium_user` VÀ `from litellm_enterprise import ...`
> Package `litellm-enterprise` không có trong repo open-source, cần cài riêng (`pip install litellm-enterprise`)

| Feature | Package | Độ khó | Ghi chú |
|---------|---------|--------|---------|
| **LlamaGuard moderation** | `litellm_enterprise.enterprise_callbacks.llama_guard` | 🔴 Hard | Cần enterprise package + Meta LlamaGuard model |
| **Secret detection (hide_secrets)** | `litellm_enterprise.enterprise_callbacks.secret_detection` | 🔴 Hard | Cần enterprise package |
| **LLM Guard** | `litellm_enterprise.enterprise_callbacks.llm_guard` | 🔴 Hard | Cần enterprise package |
| **OpenAI Moderations** | `enterprise.enterprise_hooks.openai_moderation` | 🟠 Medium | Package nằm trong `enterprise/` local (có trong repo!) |
| **Google Text Moderation** | `enterprise.enterprise_hooks.google_text_moderation` | 🟠 Medium | Package nằm trong `enterprise/` local (có trong repo!) |
| **Blocked User List** | `enterprise.enterprise_hooks.blocked_user_list` | 🟠 Medium | Package nằm trong `enterprise/` local (có trong repo!) |
| **Banned Keywords** | `enterprise.enterprise_hooks.banned_keywords` | 🟠 Medium | Package nằm trong `enterprise/` local (có trong repo!) |
| **Tag-based guardrails** | `litellm/integrations/custom_guardrail.py:399` | 🔴 Hard | Cần enterprise package |
| **Custom guardrail (premium)** | `litellm/integrations/custom_guardrail.py:494` | 🔴 Hard | Cần enterprise package |

---

### Category 9: Enterprise Infrastructure

| Feature | File | Độ khó | Ghi chú |
|---------|------|--------|---------|
| **SCIM v2** (user provisioning) | `proxy/management_endpoints/scim/scim_v2.py` | 🟠 Medium | Entire module là enterprise, không check `premium_user` trong route handler nhưng chú thích rõ là enterprise |
| **Audit Logs** | `enterprise/litellm_enterprise/proxy/audit_logging_endpoints.py` | 🟠 Medium | Enterprise module riêng |
| **Block web crawlers** | `enterprise/litellm_enterprise/proxy/utils.py:32` | 🟢 Trivial | Config `block_robots: true` |
| **Vector Store endpoints** | `enterprise/litellm_enterprise/proxy/vector_stores/endpoints.py` | 🟠 Medium | Enterprise module riêng |
| **SMTP Email callbacks** | `enterprise/litellm_enterprise/enterprise_callbacks/send_emails/` | 🟠 Medium | Enterprise module, cần SMTP credentials |
| **Fine-tuning endpoints** | `proxy/fine_tuning_endpoints/endpoints.py:114` | 🟢 Trivial | Check `premium_user`, core logic là OpenAI API |
| **Response API endpoints** | `proxy/response_api_endpoints/endpoints.py` | 🟢 Trivial | Check `premium_user` |

---

## Phân tích: Cơ chế Unlock

### Option A: Patch `is_premium()` — ĐƠN GIẢN NHẤT

```python
# litellm/proxy/auth/litellm_license.py
def is_premium(self) -> bool:
    return True  # Unlock tất cả trivial/easy features
```

**Pros**: 1 dòng, unlock toàn bộ Category 1-7 và một phần Category 8-9
**Cons**: Mỗi lần update LiteLLM phải patch lại
**Risk**: Thấp — chỉ thay đổi behavior local, không ảnh hưởng gì bên ngoài

---

### Option B: Self-signed License Key

Nếu có `public_key.pem` trong `litellm/proxy/auth/`, có thể tự tạo private/public key pair và sign license data:

```json
{
  "expiration_date": "2099-12-31",
  "max_users": 999999,
  "max_teams": 999999
}
```

**Pros**: Không cần patch code, portable
**Cons**: Cần thay thế `public_key.pem` (file nhị phân trong source) + tạo valid RSA signature
**Risk**: Phức tạp hơn, nhưng sạch hơn về mặt maintenance

---

### Option C: Chỉ unlock features cụ thể (Surgical)

Thay vì unlock tất cả, chỉ remove check cho features ta thực sự dùng:

```python
# Ví dụ: chỉ unlock SSO
# ui_sso.py: bỏ dòng check `if premium_user is not True:`
```

**Pros**: Minimal surface area, dễ audit
**Cons**: Nhiều file phải sửa, phức tạp khi update

---

## Features hữu ích cho use case (lite.x51.vn, internal team)

| Priority | Feature | Lý do |
|----------|---------|-------|
| 🔥 High | **SSO (Google/Microsoft)** | Login tiện hơn, team đang dùng Google Workspace |
| 🔥 High | **Tags on API keys** | Phân loại keys theo project/team |
| 🔥 High | **Spend reports** `/spend/report` | Analytics chi tiêu |
| 🔶 Medium | **JWT Auth** | Nếu muốn tích hợp với internal auth system |
| 🔶 Medium | **model_max_budget per key** | Budget control per project |
| 🔶 Medium | **Team admins** | Delegation quyền cho team lead |
| 🔷 Low | **IP Allowlist** | Ta đã dùng Caddy + Netmaker |
| 🔷 Low | **GCS/Azure logging** | Chưa cần |
| ❌ Skip | **LlamaGuard/LLM Guard** | Cần enterprise package, overkill |
| ❌ Skip | **SCIM v2** | Team nhỏ, không cần automated provisioning |

---

## Conclusion

```
┌─────────────────────────────────────────────────────────────┐
│                    Unlock Path                               │
│                                                              │
│  1 line patch in is_premium()                                │
│       │                                                      │
│       ▼                                                      │
│  Unlocks ~85% of enterprise features                        │
│  (all Category 1-7, + some 8-9)                             │
│                                                              │
│  Remaining 15% cần `litellm-enterprise` package             │
│  (LlamaGuard, LLM Guard, hide_secrets)                      │
│  → Không cần thiết cho use case hiện tại                    │
└─────────────────────────────────────────────────────────────┘
```

**Recommended path**: Option A (patch `is_premium()`) cho nhanh, kết hợp với Dockerfile để patch được áp dụng mỗi build.

---

*Tài liệu này là output của explore mode. Để implement, cần tạo change proposal riêng.*
