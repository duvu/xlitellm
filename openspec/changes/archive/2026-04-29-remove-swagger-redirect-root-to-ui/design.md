## Context

The deployment currently allows public access to FastAPI-generated docs endpoints (for example `/docs`, `/redoc`, `/openapi.json`) and serves root (`/`) without enforcing dashboard landing behavior. The requested change is deployment-focused and must preserve existing API behavior for non-doc routes while improving security posture and UX.

This touches multiple layers that can route HTTP traffic: LiteLLM/FastAPI settings and external reverse proxy configuration. A robust solution must account for both application-level and edge-level behavior.

## Goals / Non-Goals

**Goals:**
- Ensure root requests to `lite.x51.vn/` are redirected to `lite.x51.vn/ui`.
- Ensure public docs endpoints are disabled or inaccessible.
- Preserve normal API request handling for supported non-doc routes.
- Make behavior explicit and verifiable in deployment configuration.

**Non-Goals:**
- Redesigning dashboard routes under `/ui`.
- Changing API schemas or endpoint contracts.
- Introducing authentication or authorization redesign.

## Decisions

1. Disable docs at the application layer.
- Decision: configure LiteLLM/FastAPI startup so docs URLs are unset/disabled (`docs_url=None`, `redoc_url=None`, `openapi_url=None` or equivalent LiteLLM config path).
- Rationale: this removes docs generation at source and minimizes accidental re-exposure through future proxy changes.
- Alternative considered: block docs only at reverse proxy. Rejected as single-layer defense can regress if proxy rules drift.

2. Enforce root redirect at the edge routing layer.
- Decision: configure the reverse proxy to return an explicit redirect (`301` or `302`) from `/` to `/ui` for browser navigation.
- Rationale: edge-level redirect guarantees consistent user experience before app routing is evaluated.
- Alternative considered: app-level redirect middleware only. Rejected because deployment may place additional routing before app.

3. Keep API compatibility for non-doc paths.
- Decision: add negative/allowlist checks in verification to ensure common API paths still return prior behavior (non-redirect, non-block).
- Rationale: prevents accidental overbroad route blocks while tightening docs exposure.

## Risks / Trade-offs

- [Risk] Hidden internal tooling depends on `/openapi.json`.
  → Mitigation: confirm no internal consumer relies on public docs URL; if needed, provide private/internal docs path behind restricted network.

- [Risk] Redirect loops caused by conflicting `/` and `/ui` rules at multiple layers.
  → Mitigation: add explicit condition that only exact `/` redirects, and validate `/ui` returns non-redirect response.

- [Trade-off] Disabling docs reduces discoverability in non-production environments if shared config is reused.
  → Mitigation: scope config to target deployment environment and keep local/dev docs enabled where needed.

## Migration Plan

1. Update deployment and/or LiteLLM config to disable public docs endpoints.
2. Add or update reverse proxy rule for `/ -> /ui` redirect.
3. Redeploy service in target environment.
4. Run verification:
- `GET /` returns redirect to `/ui`
- `GET /ui` serves dashboard
- `GET /docs`, `/redoc`, `/openapi.json` are not publicly accessible
- Representative API endpoint still behaves as before
5. Rollback plan: revert proxy/config changes to prior version and redeploy.

## Open Questions

- Should root redirect use permanent (`301`) or temporary (`302`) status for this environment?
- Do we require a custom JSON response for blocked docs paths, or is `404`/`403` sufficient?
