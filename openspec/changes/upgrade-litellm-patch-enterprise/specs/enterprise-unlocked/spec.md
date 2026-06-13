## ADDED Requirements

### Requirement: enterprise-patch-resilience
Sau khi upgrade litellm lên 1.85.1, tất cả enterprise bypass patches từ version 1.80.11 SHALL vẫn hoạt động đúng. Không có enterprise guard mới nào trong upstream 1.81–1.85 được phép block features.

#### Scenario: is_premium luôn trả về True sau upgrade
- **WHEN** `LicenseCheck.is_premium()` được gọi trên codebase version 1.85.1
- **THEN** method trả về `True` bất kể `LITELLM_LICENSE` env var có được set hay không

#### Scenario: không có enterprise guard mới bị bypass
- **WHEN** upstream 1.85.1 có thêm guard `if premium_user is not True:` mới
- **THEN** guard đó SHALL được patch hoặc `premium_user` được đảm bảo là `True` tại source

#### Scenario: allowed_routes enterprise check
- **WHEN** config có `allowed_routes` trong `general_settings`
- **THEN** route restriction hoạt động bình thường, không bị block bởi enterprise check

#### Scenario: max_request_size_mb enterprise check
- **WHEN** config có `max_request_size_mb` trong `general_settings`
- **THEN** request size limit được áp dụng, không bị bỏ qua vì enterprise check

#### Scenario: max_response_size_mb enterprise check
- **WHEN** config có `max_response_size_mb` trong `general_settings`
- **THEN** response size limit được áp dụng, không bị bỏ qua vì enterprise check

#### Scenario: oauth2 check enterprise
- **WHEN** proxy được config với OAuth2 verification
- **THEN** OAuth2 check hoạt động bình thường, không bị block bởi enterprise gate

#### Scenario: admin_only_routes enterprise check
- **WHEN** config có `admin_only_routes` trong `general_settings`
- **THEN** route protection hoạt động, không bị block bởi enterprise check
