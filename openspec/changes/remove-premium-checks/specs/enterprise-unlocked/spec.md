## ADDED Requirements

### Requirement: enterprise-always-enabled
Hệ thống self-hosted luôn hoạt động ở chế độ enterprise, không cần license key bên ngoài.

#### Scenario: startup without license
- **WHEN** LiteLLM proxy khởi động mà không có `LITELLM_LICENSE` env var
- **THEN** `premium_user = True` và tất cả enterprise features hoạt động bình thường

#### Scenario: SSO login với >5 users
- **WHEN** user đăng nhập qua Google/Microsoft SSO khi tổng user trong DB > 5
- **THEN** login thành công, không bị block bởi user limit

#### Scenario: key với tags
- **WHEN** tạo API key với `tags` field
- **THEN** key được tạo thành công với tags metadata

#### Scenario: spend report
- **WHEN** gọi `GET /spend/report`
- **THEN** trả về spend data, không trả về 403

#### Scenario: team admin assignment
- **WHEN** assign `team_admin` role cho user trong team
- **THEN** assignment thành công

#### Scenario: key regeneration
- **WHEN** gọi `/key/regenerate` cho virtual key
- **THEN** key được regenerate thành công

#### Scenario: enforced params
- **WHEN** config `enforced_params` trong `general_settings`
- **THEN** params được enforce trên mọi request, không bị bỏ qua

#### Scenario: model budget per key
- **WHEN** tạo key với `model_max_budget`
- **THEN** budget được set thành công theo từng model
