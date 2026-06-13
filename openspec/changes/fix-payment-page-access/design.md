## Context

LiteLLM proxy serves the Next.js dashboard UI from a static export at `/usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/`. Next.js exports routes as `<route>.html` files. FastAPI's `StaticFiles(html=True)` requires `<route>/index.html` to serve extensionless URLs like `/ui/payment`.

LiteLLM solves this with `_restructure_ui_html_files()` at startup: it moves `payment.html` → `payment/index.html`. **But it skips restructuring if `_is_ui_pre_restructured()` returns True** — which happens when any `<route>/index.html` already exists in the directory. The base image already has `login/index.html`, `logs/index.html`, etc., so our payment page added on top is never restructured.

## Goals / Non-Goals

**Goals:**
- `/ui/payment` returns 200 (payment page loads in browser)
- Pre-structure `payment/index.html` at Docker build time so runtime skip is harmless
- Minimal Dockerfile change — no full rebuild from scratch

**Non-Goals:**
- Changing LiteLLM's restructuring logic
- Rebuilding the Next.js UI from source in CI
- Fixing any other routes

## Decisions

**Decision: Pre-structure in Dockerfile, not at runtime**

Options:
1. Create `payment/index.html` in Dockerfile (chosen) — zero runtime risk, no write permissions needed, idempotent
2. Force runtime restructuring via env var — no env var exists for this; would require LiteLLM code change
3. Mount a writable overlay volume — adds infra complexity for a one-line Dockerfile fix

Rationale: The fix is 2 lines in the Dockerfile. `cp payment.html payment/index.html` is safe, deterministic, and aligns with LiteLLM's own "pre-restructure in Dockerfile" guidance (logged as `"Skipping UI restructuring: ... is already pre-restructured"`).

**Decision: Extend current payment-ui-v2 image**

Base: `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v2.20260523.2046`
All payment layers (wheel + UI) are already in this image; we only need to add the `payment/index.html` file. No need to rebuild the full chain.

## Risks / Trade-offs

- [Risk: Both `payment.html` AND `payment/index.html` coexist] → LiteLLM's restructure skips `.html` files with an existing index, so it won't try to move `payment.html` again. FastAPI StaticFiles will serve `payment/index.html` for `/ui/payment` correctly.
- [Risk: Future UI rebuilds lose the pre-structure] → Document in Dockerfile comments; any future UI deploy must include the same step.

## Migration Plan

1. Build new Docker image extending `payment-ui-v2.20260523.2046` with `payment/index.html` added
2. Push to `docker.x51.vn/dev/litellm:<new-tag>`
3. Update `/home/beou/deployment/server2/docker-compose.yml` image tag
4. Commit & push deployment repo
5. SSH recreate litellm service, wait 120s
6. Verify `curl http://127.0.0.1:5003/ui/payment` returns 200
7. Verify navigation to `/ui/payment` in browser shows the Payment page

**Rollback**: Revert `docker-compose.yml` image tag to `payment-ui-v2.20260523.2046` (no payment UI), commit & push, recreate.

## Open Questions

None. Root cause is confirmed and fix is deterministic.
