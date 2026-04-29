## Context

Trang Organizations trên dashboard đã có route và API wiring cơ bản nhưng UX hiện chưa tốt: khó discover action, trạng thái loading/empty/error chưa nhất quán, và thao tác quản lý thành viên còn rời rạc. Đây là thay đổi cross-cutting giữa nhiều component dashboard và phải bảo toàn behavior backend hiện có.

Stakeholders chính: proxy admin và org admin vận hành tenant hàng ngày.

Ràng buộc:
- Không đổi API contract backend.
- Không thêm dependency nặng mới nếu có thể tránh.
- Giữ tương thích layout hiện tại của dashboard để giảm regression.

## Goals / Non-Goals

**Goals:**
- Nâng cấp Organizations page thành flow quản trị rõ ràng và hiệu quả.
- Chuẩn hóa trạng thái UI (loading, empty, error, success) và thông báo người dùng.
- Cải thiện trải nghiệm create/edit organization và member management.
- Đảm bảo responsive tốt trên desktop và mobile.

**Non-Goals:**
- Thay đổi schema database hoặc nghiệp vụ backend organizations.
- Thêm quyền mới ngoài proxy admin/org admin hiện có.
- Viết lại toàn bộ dashboard design system.

## Decisions

1. Cấu trúc lại Organizations page theo 3 vùng: header actions, list/filter panel, detail/member panel.
Lý do: giảm context switching và giúp admin thao tác theo workflow thực tế.
Alternative: giữ layout cũ và thêm nhỏ lẻ từng nút; bị rời rạc và khó cải thiện toàn diện.

2. Reuse API endpoints hiện có, chỉ chuẩn hóa client-side state và error handling.
Lý do: giảm rủi ro backend regression, tập trung vào UX.
Alternative: thêm endpoint mới cho UX; không cần thiết ở giai đoạn này.

3. Dùng optimistic update có điều kiện cho add/remove member, còn create/delete org dùng confirm + refetch.
Lý do: member operations cần phản hồi nhanh, còn create/delete cần độ an toàn cao.
Alternative: refetch toàn bộ sau mọi thao tác; đơn giản nhưng chậm và cảm giác lag.

4. Thống nhất reusable UI states component cho loading/empty/error ở Organizations views.
Lý do: nhất quán trải nghiệm và giảm duplicate logic.
Alternative: xử lý riêng từng component; khó bảo trì.

## Risks / Trade-offs

- [Risk] UI refactor có thể làm hỏng luồng admin hiện tại → Mitigation: giữ nguyên API contract, bổ sung test component/integration cho flow quan trọng.
- [Risk] Optimistic update có thể lệch state khi API fail → Mitigation: rollback state và hiển thị toast lỗi rõ ràng.
- [Risk] Responsive thay đổi layout gây khó dùng trên desktop quen thuộc → Mitigation: giữ desktop-first, kiểm thử manual cả desktop/mobile.
- [Risk] Build out artifacts cũ không phản ánh source mới → Mitigation: bắt buộc rebuild UI và verify chunk trước deploy.

## Migration Plan

1. Refactor UI components liên quan Organizations trong dashboard source.
2. Chạy test/lint cho UI components bị ảnh hưởng.
3. Rebuild admin UI artifacts vào litellm/proxy/_experimental/out.
4. Build Docker image mới, push registry, update compose và deploy server2.
5. Smoke test: list/create/update/delete org, add/remove member, verify responsive.

Rollback:
- Rollback image tag trong deployment compose về bản stable trước đó.
- Recreate litellm service bằng image cũ.

## Open Questions

- Có cần thêm quick metrics card theo org (spend, members) ngay vòng này hay để phase sau?
- Có cần hỗ trợ bulk member actions trong lần đầu tiên không?
- Có cần thêm feature flag để bật/tắt Organizations UI mới theo environment?
