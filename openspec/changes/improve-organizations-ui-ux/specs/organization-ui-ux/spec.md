## ADDED Requirements

### Requirement: Organizations page MUST expose clear management workflow
Dashboard SHALL hiển thị Organizations page với workflow rõ ràng gồm danh sách tổ chức, bộ lọc/tìm kiếm, vùng chi tiết, và các hành động quản trị chính.

#### Scenario: Admin mở Organizations page
- **WHEN** proxy admin truy cập dashboard và chọn Organizations
- **THEN** hệ thống hiển thị đầy đủ list panel, action controls và detail area trong một layout nhất quán

### Requirement: Organizations list MUST support discoverability and control
Organizations list SHALL hỗ trợ search, sort, và filter theo các thuộc tính chính để admin tìm đúng organization nhanh chóng.

#### Scenario: Admin tìm organization theo tên
- **WHEN** admin nhập từ khóa vào ô search
- **THEN** list chỉ hiển thị organizations khớp và cập nhật trong thời gian phản hồi hợp lý

### Requirement: Organization create and edit forms MUST provide validation feedback
Form tạo/chỉnh sửa organization SHALL validate input bắt buộc và hiển thị lỗi inline, không chỉ hiển thị lỗi chung chung.

#### Scenario: Submit form thiếu trường bắt buộc
- **WHEN** admin submit form với dữ liệu thiếu hoặc không hợp lệ
- **THEN** UI hiển thị validation message tại đúng field và chặn submit

### Requirement: Member management MUST provide reliable UX feedback
Tác vụ thêm, cập nhật role, và xóa member SHALL có loading state, success toast, error toast, và cập nhật trạng thái UI nhất quán.

#### Scenario: Add member thành công
- **WHEN** admin thêm member hợp lệ vào organization
- **THEN** member mới xuất hiện trong danh sách và hệ thống hiển thị success feedback

#### Scenario: Add member thất bại
- **WHEN** API thêm member trả lỗi
- **THEN** UI rollback state tạm, hiển thị lỗi rõ ràng và giữ dữ liệu hiện tại không bị hỏng

### Requirement: Destructive actions MUST be guarded
Các thao tác xóa organization hoặc xóa member SHALL yêu cầu xác nhận rõ ràng trước khi thực thi.

#### Scenario: Admin nhấn delete organization
- **WHEN** admin bấm nút delete
- **THEN** hệ thống hiển thị confirmation dialog trước khi gửi API request

### Requirement: Organizations UI MUST handle loading empty and error states consistently
Organizations views SHALL hiển thị trạng thái loading, empty, và error theo một pattern nhất quán để tránh mơ hồ cho người dùng.

#### Scenario: Không có organization nào
- **WHEN** API list trả về rỗng
- **THEN** UI hiển thị empty state có call-to-action tạo organization mới

### Requirement: Organizations UI MUST be responsive across desktop and mobile
Trang Organizations SHALL giữ khả năng sử dụng đầy đủ trên desktop và mobile với layout không vỡ và thao tác chạm đủ lớn.

#### Scenario: Mở Organizations trên màn hình nhỏ
- **WHEN** user truy cập Organizations page trên viewport mobile
- **THEN** list và detail vẫn thao tác được, không tràn layout, và action controls vẫn accessible
