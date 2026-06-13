## MODIFIED Requirements

### Requirement: /openapi.json returns 200 with valid JSON schema

#### Scenario: OpenAPI schema generates without error
- **WHEN** `GET /openapi.json` is called on the LiteLLM proxy
- **THEN** the response status SHALL be 200
- **THEN** the response body SHALL be valid JSON
- **THEN** the response SHALL contain a `paths` object with the payment routes

#### Scenario: All payment routes appear in schema
- **GIVEN** the payment plugin is loaded
- **WHEN** `GET /openapi.json` is called
- **THEN** the schema SHALL contain paths: `/payment/balance`, `/payment/list`, `/payment/create`, `/payment/{payment_id}`, `/payment/webhook/{provider}`, `/payment/admin/list`, `/payment/admin/credit`

#### Scenario: Swagger UI loads correctly
- **WHEN** a user navigates to `http://<host>:5003/docs`
- **THEN** the Swagger UI SHALL load without error
- **THEN** the payment routes SHALL be visible in the UI
