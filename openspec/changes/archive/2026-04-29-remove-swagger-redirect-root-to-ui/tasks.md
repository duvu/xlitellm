## 1. Configuration Changes

- [x] 1.1 Identify the active LiteLLM and reverse-proxy config files used by `lite.x51.vn` in this repository.
- [x] 1.2 Update LiteLLM/FastAPI configuration to disable docs endpoints (`/docs`, `/redoc`, `/openapi.json`) in the target deployment.
- [x] 1.3 Add or update reverse-proxy rule so exact `/` redirects to `/ui` without affecting `/ui` handling.

## 2. Safety and Compatibility Validation

- [x] 2.1 Verify `/docs`, `/redoc`, and `/openapi.json` return non-success responses and do not expose docs content.
- [x] 2.2 Verify `/` returns an HTTP redirect with `Location: /ui` and `/ui` does not redirect back to `/`.
- [x] 2.3 Verify at least one representative non-doc API endpoint still behaves as before.

## 3. Deployment and Rollback Readiness

- [x] 3.1 Document the exact deployment steps and environments affected by this change.
- [x] 3.2 Document rollback instructions to restore prior routing/docs behavior if needed.
- [x] 3.3 Capture post-deploy verification evidence (commands/outputs) in the change notes or PR description.
