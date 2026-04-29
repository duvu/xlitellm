## 1. Refactor Organizations UI Flow

- [ ] 1.1 Refactor Organizations page layout trong ui/litellm-dashboard để có 3 vùng rõ ràng: header actions, list/filter panel, detail/member panel
- [ ] 1.2 Chuẩn hóa list state: loading, empty, error cho Organizations table/list view
- [ ] 1.3 Bổ sung search, sort, filter controls có hành vi nhất quán và dễ discover

## 2. Improve Forms and Member Management UX

- [ ] 2.1 Chuẩn hóa create/edit organization form với field-level validation và inline errors
- [ ] 2.2 Nâng cấp add/update/remove member flow với loading states, success/error toasts, và rollback khi API fail
- [ ] 2.3 Thêm confirm guard cho destructive actions (delete organization, remove member)

## 3. Responsive and Visual Consistency

- [ ] 3.1 Cải thiện responsive behavior cho Organizations page trên viewport mobile/tablet
- [ ] 3.2 Đảm bảo action controls và table/detail interactions không vỡ layout trên desktop
- [ ] 3.3 Đồng bộ typography, spacing, và visual feedback với dashboard patterns hiện tại

## 4. Testing and Build Artifacts

- [ ] 4.1 Cập nhật hoặc thêm tests cho Organizations components và các hành vi chính (search, form validation, member actions)
- [ ] 4.2 Chạy test/lint cho UI và fix regression nếu có
- [ ] 4.3 Rebuild admin UI artifacts để cập nhật litellm/proxy/_experimental/out

## 5. Deploy and Verify on server2

- [ ] 5.1 Build image mới với tag docker.x51.vn/dev/litellm:1.80.11-x51.org-uiux.{TIMESTAMP}
- [ ] 5.2 Push image lên registry docker.x51.vn và update deployment compose
- [ ] 5.3 Deploy lên server2, verify container health và logs
- [ ] 5.4 Smoke test Organizations UX trên https://lite.x51.vn/ui?page=organizations (list/create/edit/delete org, member management, responsive)
