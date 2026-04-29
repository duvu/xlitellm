# disable-public-api-docs Specification

## Purpose
TBD - created by archiving change remove-swagger-redirect-root-to-ui. Update Purpose after archive.
## Requirements
### Requirement: Public API docs endpoints are disabled
The deployment SHALL prevent public access to generated API documentation endpoints, including `/docs`, `/redoc`, and `/openapi.json`.

#### Scenario: Request to Swagger UI path
- **WHEN** an unauthenticated client sends `GET /docs`
- **THEN** the system MUST return a non-success response that does not expose Swagger UI content

#### Scenario: Request to ReDoc path
- **WHEN** an unauthenticated client sends `GET /redoc`
- **THEN** the system MUST return a non-success response that does not expose ReDoc content

#### Scenario: Request to OpenAPI schema path
- **WHEN** an unauthenticated client sends `GET /openapi.json`
- **THEN** the system MUST return a non-success response that does not expose OpenAPI schema content

