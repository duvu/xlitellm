## ADDED Requirements

### Requirement: Admin có thể tạo Organization mới
Proxy admin SHALL có thể tạo organization mới qua endpoint `POST /organization/new` với alias, budget và model access.

#### Scenario: Tạo org thành công
- **WHEN** proxy admin gửi `POST /organization/new` với `organization_alias` và `max_budget`
- **THEN** hệ thống tạo org mới trong DB và trả về `organization_id`

#### Scenario: Non-admin không thể tạo org
- **WHEN** user không phải proxy admin gửi `POST /organization/new`
- **THEN** hệ thống trả về HTTP 401

### Requirement: Admin có thể list tất cả Organizations
Proxy admin SHALL có thể xem danh sách tất cả organizations qua `GET /organization/list`.

#### Scenario: List organizations
- **WHEN** proxy admin gửi `GET /organization/list`
- **THEN** hệ thống trả về array chứa tất cả organizations hiện có

### Requirement: Admin có thể cập nhật Organization
Proxy admin SHALL có thể cập nhật thông tin org (alias, budget, models) qua `PATCH /organization/update`.

#### Scenario: Update org alias
- **WHEN** proxy admin gửi `PATCH /organization/update` với `organization_id` và `organization_alias` mới
- **THEN** hệ thống cập nhật org và trả về org đã update

### Requirement: Admin có thể xóa Organization
Proxy admin SHALL có thể xóa organization qua `DELETE /organization/delete`.

#### Scenario: Delete org
- **WHEN** proxy admin gửi `DELETE /organization/delete` với `organization_id` hợp lệ
- **THEN** hệ thống xóa org khỏi DB

### Requirement: Admin có thể thêm/xóa thành viên Organization
Proxy admin và org admin SHALL có thể quản lý membership qua `/organization/member_add` và `/organization/member_delete`.

#### Scenario: Thêm user vào org
- **WHEN** admin gửi `POST /organization/member_add` với `organization_id` và `user_id`
- **THEN** user được thêm vào org với role được chỉ định

### Requirement: Tab Organizations hiển thị trong Admin UI
Proxy admin SHALL thấy tab **Organizations** trong sidebar khi đăng nhập vào dashboard.

#### Scenario: Tab visible sau khi đăng nhập
- **WHEN** proxy admin đăng nhập vào `https://lite.x51.vn/ui`
- **THEN** sidebar hiển thị menu item "Organizations" trong nhóm Access Controls

#### Scenario: Tạo org từ UI
- **WHEN** proxy admin click vào tab Organizations và click "Create Organization"
- **THEN** form hiện ra, admin điền alias + budget và submit thành công

### Requirement: UI build phải chứa Organizations components
Docker image SHALL được build với Next.js `out/` artifacts chứa Organizations tab.

#### Scenario: Organizations chunk tồn tại trong out/
- **WHEN** kiểm tra `litellm/proxy/_experimental/out/`
- **THEN** có ít nhất một file chứa string "organizations" (route hoặc component chunk)
