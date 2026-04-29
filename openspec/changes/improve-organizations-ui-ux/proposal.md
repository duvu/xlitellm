## Why

Trang Organizations trên dashboard hiện chưa đạt mức usable: bố cục và affordance yếu, thao tác tạo/chỉnh sửa membership chưa trực quan, feedback trạng thái chưa rõ ràng. Cần nâng cấp UI/UX để admin thao tác nhanh, ít lỗi và tự tin hơn khi quản lý tổ chức.

## What Changes

- Thiết kế lại Organizations page theo flow rõ ràng: Overview, List, Detail, Members, Actions
- Cải thiện table/filter/search/sort và trạng thái loading-empty-error cho Organizations
- Chuẩn hóa create/edit organization form với validation rõ ràng và inline error
- Cải thiện trải nghiệm quản lý thành viên: add/update/remove role với phản hồi tức thì
- Bổ sung UX guardrails: confirm destructive actions, toast nhất quán, optimistic update hợp lý
- Nâng cấp responsive cho desktop và mobile để thao tác quản trị không bị vỡ layout

## Capabilities

### New Capabilities
- organization-ui-ux: Trải nghiệm quản lý Organizations hoàn chỉnh trên dashboard với flow rõ ràng, thao tác nhanh và phản hồi trạng thái tốt

### Modified Capabilities
- enterprise-unlocked: Mở rộng yêu cầu để đảm bảo các capability enterprise đã mở khóa phải được thể hiện đầy đủ trong Organizations UI và có thể thao tác trực tiếp từ dashboard

## Impact

- UI code trong ui/litellm-dashboard liên quan Organizations page, organization detail view, sidebar navigation và helper components
- API calls hiện có cho organization endpoints được tái sử dụng, không thay đổi contract backend
- Test UI/component cần cập nhật để phản ánh behavior mới
- Docker image cần rebuild để đóng gói out artifacts mới trước khi deploy
