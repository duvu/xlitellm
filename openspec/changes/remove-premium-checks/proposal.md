## Why

LiteLLM gắn license check vào ~43 tính năng thông qua biến `premium_user`. Hệ thống của chúng ta là self-hosted nội bộ, không có hợp đồng enterprise với LiteLLM — việc duy trì license gate chỉ tạo ra friction không cần thiết và ngăn sử dụng các tính năng đã có sẵn trong codebase.

## What Changes

- Patch `LicenseCheck.is_premium()` để luôn trả về `True`
- Xóa bỏ network call tới `https://license.litellm.ai` (không còn dependency ngoài)
- Tất cả ~43 tính năng enterprise được unlock: SSO, JWT auth, Tags, Spend reports, Team admins, key regeneration, budgets, custom routes, IP allowlist, v.v.
- Build Docker image mới và deploy lên server2

## Capabilities

### New Capabilities
- `enterprise-unlocked`: Toàn bộ tính năng enterprise được kích hoạt trên self-hosted instance — SSO, key tags, spend reports, team admins, enforced params, IP allowlist, JWT auth, custom routes, budget per model, key regeneration

### Modified Capabilities
- `disable-public-api-docs`: Không thay đổi requirements, chỉ liên quan implementation

## Impact

- **Code**: 1 hàm trong `litellm/proxy/auth/litellm_license.py`
- **Behavior**: `premium_user = True` globally sau khi startup
- **Network**: Loại bỏ outbound call tới `license.litellm.ai`
- **Docker**: Cần rebuild image và deploy lên server2 (`10.113.213.1`)
- **No breaking changes**: Các tính năng hiện tại tiếp tục hoạt động bình thường
