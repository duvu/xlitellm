## MODIFIED Requirements

### Requirement: Payment API endpoints authenticate via LiteLLM bearer token
All payment API endpoints SHALL accept and validate the `Authorization: Bearer <token>` header using LiteLLM's standard key authentication.

#### Scenario: Valid bearer token returns data
- **GIVEN** a valid LiteLLM API key exists in the system
- **WHEN** an HTTP GET request is made to `http://<host>:5003/payment/balance` with header `Authorization: Bearer <valid-key>`
- **THEN** the response status code SHALL be 200
- **THEN** the response body SHALL contain the user's balance information

#### Scenario: Missing Authorization header returns 401
- **WHEN** an HTTP GET request is made to `http://<host>:5003/payment/balance` with no `Authorization` header
- **THEN** the response status code SHALL be 401

#### Scenario: Invalid token returns 401
- **WHEN** an HTTP GET request is made to `http://<host>:5003/payment/balance` with header `Authorization: Bearer invalid-key-xyz`
- **THEN** the response status code SHALL be 401

#### Scenario: Admin endpoint accessible to PROXY_ADMIN role
- **GIVEN** a valid LiteLLM API key associated with a user who has `user_role = "proxy_admin"`
- **WHEN** an HTTP GET request is made to `http://<host>:5003/payment/admin/list` with that key's bearer token
- **THEN** the response status code SHALL be 200

#### Scenario: Admin endpoint forbidden for non-admin users
- **GIVEN** a valid LiteLLM API key associated with a regular user (not proxy_admin)
- **WHEN** an HTTP GET request is made to `http://<host>:5003/payment/admin/list` with that key's bearer token
- **THEN** the response status code SHALL be 403
