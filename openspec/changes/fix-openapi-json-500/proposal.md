## Why

After deploying `fix-payment-api-auth`, `GET /openapi.json` returns 500 Internal Server Error, breaking the Swagger UI (`/docs`) and any tool that auto-discovers the API. The root cause is a missing `Request` import in the payment router introduced during the auth fix.

## What Changes

- **litellm-payment `api/router.py`**: Add `Request` to the `from fastapi import ...` line (1-character fix that adds `Request` to the import list)

## Capabilities

### Modified Capabilities

- **openapi-schema-generation**: `/openapi.json` must return 200 with a valid JSON schema containing all payment routes
