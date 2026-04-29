## Why

LiteLLM đã có đầy đủ backend API và schema cho Organizations, nhưng tính năng này chưa được kích hoạt và sử dụng trên instance đang deploy — admin chưa thể tạo org, gán team/user vào org, hay enforce org-level budget/model access. Đây là tính năng multi-tenancy quan trọng để phân chia resources và chi phí theo đơn vị tổ chức.

## What Changes

- Rebuild Next.js UI để đảm bảo tab **Organizations** hiển thị đúng trong dashboard
- Thêm cấu hình `organization_settings` vào `litellm_config.yaml` của deployment
- Expose đầy đủ các endpoint: `/organization/new`, `/organization/update`, `/organization/delete`, `/organization/list`, `/organization/info`, `/organization/member_add`
- Gán Teams hiện tại vào một Organization mặc định (nếu chưa có)
- Build và deploy image mới với UI cập nhật

## Capabilities

### New Capabilities

- `organization-management`: CRUD tổ chức qua API và UI — tạo org, set budget/model-access, quản lý membership, xem spend theo org

### Modified Capabilities

(none — backend endpoints và schema đã tồn tại, không thay đổi behavior hiện có)

## Impact

- **UI**: rebuild `ui/litellm-dashboard` → `litellm/proxy/_experimental/out/` — tab Organizations xuất hiện cho proxy admins
- **Config**: `deployment/server2/litellm/litellm_config.yaml` — thêm org-related settings nếu cần
- **Docker image**: build và push image mới với UI đã rebuild, deploy lên server2
- **No breaking changes** — Organizations là additive feature; Teams/Keys hiện tại không bị ảnh hưởng
