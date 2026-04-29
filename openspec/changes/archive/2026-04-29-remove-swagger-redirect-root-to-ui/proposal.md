## Why

The LiteLLM deployment at `lite.x51.vn` currently exposes Swagger endpoints and does not send users from `/` to the dashboard entrypoint. This increases public surface area and causes an inconsistent default user experience.

## What Changes

- Remove public Swagger UI and related OpenAPI docs exposure from the LiteLLM service path for this deployment.
- Change default web navigation so requests to `lite.x51.vn/` are redirected to `lite.x51.vn/ui`.
- Keep API functionality intact for existing non-docs endpoints.
- Document and validate the new behavior with tests or verification steps.

## Capabilities

### New Capabilities
- `disable-public-api-docs`: Prevent public access to Swagger/OpenAPI documentation routes for the deployment.
- `default-ui-root-redirect`: Ensure requests to the root path (`/`) are redirected to `/ui`.

### Modified Capabilities
- None.

## Impact

- Affected systems: LiteLLM proxy routing, FastAPI docs configuration, and/or reverse proxy routing in deployment manifests.
- Affected paths: deployment compose/config files and LiteLLM proxy startup configuration.
- User-facing impact: browser visits to root now land on dashboard UI; API docs endpoints are no longer publicly available.
