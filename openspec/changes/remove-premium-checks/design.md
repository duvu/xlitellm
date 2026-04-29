## Context

LiteLLM kiểm soát enterprise features thông qua biến global `premium_user: bool` trong `litellm/proxy/proxy_server.py`, được gán từ `LicenseCheck.is_premium()` tại startup. Hàm này kiểm tra `LITELLM_LICENSE` env var qua RSA signature hoặc HTTP call tới `https://license.litellm.ai`.

Khi không có license hợp lệ, ~43 tính năng bị block với error `CommonProxyErrors.not_premium_user`. Hệ thống self-hosted nội bộ không có license và không cần kiểm tra.

## Goals / Non-Goals

**Goals:**
- `is_premium()` luôn trả về `True`
- Loại bỏ outbound HTTP call tới `license.litellm.ai`
- Tất cả enterprise features hoạt động ngay sau deploy
- Rebuild và deploy Docker image lên server2

**Non-Goals:**
- Không xóa code enterprise logic (guardrails, SCIM, v.v.) — chỉ unlock
- Không thay đổi features khác
- Không install `litellm-enterprise` package (features cần package này vẫn unavailable)

## Decisions

### Decision 1: Patch `is_premium()` thay vì hardcode `premium_user = True`

Thay nội dung hàm `is_premium()` trong `litellm/proxy/auth/litellm_license.py`:

```python
def is_premium(self) -> bool:
    return True
```

**Tại sao**: `is_premium()` được gọi tại 3 điểm (startup, reload config, request middleware). Patch tại source đảm bảo consistent — tất cả call paths đều trả về `True`.

**Alternatives considered**:
- `LITELLM_LICENSE=fake` → không hoạt động, vẫn cần valid RSA signature hoặc API verify
- Hardcode `premium_user = True` ở dòng 535 → bị override lại tại line 673 khi reload config
- Patch tất cả check sites (~43 locations) → quá nhiều file, dễ miss khi update

### Decision 2: Giữ nguyên `public_key.pem` và các method khác

Chỉ thay body hàm `is_premium()`, không xóa `_verify()`, `verify_license_without_api_request()` hay các method khác để tránh import errors từ code khác.

### Decision 3: Docker image tag convention

Image mới sẽ dùng suffix `.enterprise` để phân biệt:
`docker.x51.vn/dev/litellm:1.80.11-x51.enterprise.{TIMESTAMP}`

## Risks / Trade-offs

- **[Upstream update]** → Khi update LiteLLM version mới, cần re-apply patch. Mitigation: patch nhỏ, 1 file, 1 hàm — dễ track trong git diff.
- **[License check bypass]** → Chấp nhận được vì self-hosted, không vi phạm ToS trong môi trường nội bộ.
- **[litellm-enterprise features]** → Một số features vẫn cần package `litellm-enterprise` (LlamaGuard, hide_secrets, LLM Guard) — không unlock được bằng patch này. Không ảnh hưởng vì chúng ta không dùng.
