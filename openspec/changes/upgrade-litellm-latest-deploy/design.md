## Context

The x51 deployment runs a custom-built LiteLLM image (`docker.x51.vn/dev/litellm`) on `server2` (`root@10.113.213.1`). The image layers three things on top of upstream LiteLLM:

1. **x51 enterprise patches** — committed on branch `upgrade/litellm-1.85.1-enterprise-patch`; include fixes for internal key leakage, UI asset-prefix, guardrails, openapi.json 500, and schema-sync alignment.
2. **Custom UI build** — `ui/litellm-dashboard/out/` exported via Next.js static build; mounted into the image at `/usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/`.
3. **litellm-payment module** — installed from source (`/home/beou/IdeaProjects/litellm-payment`); wired via `LITELLM_WORKER_STARTUP_HOOKS`. Currently **disabled** (`LITELLM_PAYMENT_ENABLED=false`) in production.

Current state: `1.85.1`, upstream latest: `1.88.1` (3 minor bumps; ~300 commits).

## Goals / Non-Goals

**Goals:**
- Rebase or cherry-pick all x51 patches onto upstream `1.88.1` tag without regression.
- Build a new image `docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16` with the same layer structure as today.
- Push image and redeploy on `root@10.113.213.1` with zero manual schema changes.
- Verify health, `/models`, and a proxy chat completion after deploy.

**Non-Goals:**
- Enabling the payment feature (stays `LITELLM_PAYMENT_ENABLED=false`).
- Upgrading litellm-payment module itself.
- Changing the UI (no new Next.js build needed unless upstream UI conflicts appear).
- Migrating the database schema manually (Prisma auto-applies on startup).

## Decisions

### D1 — New branch from upstream tag, not a merge

**Decision:** Create `upgrade/litellm-1.88.1-x51` by checking out the upstream `v1.88.1` tag, then cherry-picking the x51 patch commits from `upgrade/litellm-1.85.1-enterprise-patch` on top.

**Rationale:** A merge would drag in the full upstream history delta and makes conflicts harder to reason about. Cherry-picking isolates each x51 change and shows exactly what we're carrying forward. If a patch no longer applies cleanly (upstream fixed the same thing), we skip it — that's a feature, not a bug.

**Alternative considered:** Rebase `upgrade/litellm-1.85.1-enterprise-patch` onto `v1.88.1` — equivalent but cherry-pick gives more granular control per commit.

### D2 — Build on existing `Dockerfile.x51` structure unchanged

**Decision:** Do not restructure `Dockerfile.x51`. Only update `ARG BASE_IMAGE` to point to the new upstream base image.

**Rationale:** The three-layer image (upstream → remove stale UI → copy x51-ui-out → install payment) is proven. Changing the Dockerfile now risks introducing new problems unrelated to the version bump.

**Alternative considered:** Rebuild from `ghcr.io/berriai/litellm:main-latest` instead of a private registry base — avoids needing a pre-built base, but loses the enterprise image which is already tested at `1.88.1`.

### D3 — Determine base image for 1.88.1

**Decision:** Use `ghcr.io/berriai/litellm-non-root:main-v1.88.1-stable` as the new BASE_IMAGE if a private `docker.x51.vn/dev/litellm:1.88.1-base` is not available. Fall back to building the base from the upstream `Dockerfile` if neither is available.

**Rationale:** The upstream GitHub Container Registry publishes stable tags; the private registry may or may not have 1.88.1 pre-pulled.

### D4 — Image tag naming convention

**Decision:** Tag the new image `docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.$(date +%Y%m%d)` to match existing conventions.

### D5 — Deployment strategy

**Decision:** On `root@10.113.213.1`, update `docker-compose.yml` image reference, then `docker compose pull litellm && docker compose up -d --no-deps litellm`. This restarts only the litellm container, leaving postgres, redis, and other services untouched.

**Rationale:** `--no-deps` avoids cascading restarts; postgres downtime would interrupt all active sessions.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Cherry-pick conflicts on x51 patches | Review each conflict; if upstream already fixed the issue, drop the patch and note it. Keep a log. |
| `python3.13` path in Dockerfile.x51 changes (upstream may use different python) | Check `python --version` in the new base image before copying UI; update path if needed. |
| Prisma schema drift between 1.85.1 and 1.88.1 | Prisma migrations auto-apply on container start; monitor logs for migration errors in the first 60 s. |
| UI asset split-brain (build script checks for single layout JS) | Re-run `npm run build` in `ui/litellm-dashboard/` only if the upstream UI changed; the build script already validates this. |
| Registry push fails | Ensure `docker login docker.x51.vn` is active on build host before pushing. |
| litellm-payment startup hook fails against 1.88.1 API surface | `LITELLM_PAYMENT_ENABLED=false` suppresses hook execution paths; risk is low. Monitor startup logs. |

## Migration Plan

1. **Branch** — `git checkout -b upgrade/litellm-1.88.1-x51 v1.88.1` (or upstream tag equivalent).
2. **Cherry-pick patches** — list commits from `upgrade/litellm-1.85.1-enterprise-patch` that are not upstream, cherry-pick each; resolve conflicts.
3. **Version bump** — `pyproject.toml` → `1.88.1`; `Dockerfile.x51 ARG BASE_IMAGE` → 1.88.1 base.
4. **Build image** — `IMAGE_TAG=docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.YYYYMMDD ./build-docker.sh`
5. **Push** — `docker push <tag>`
6. **Update compose** — edit `deployment/server2/docker-compose.yml` litellm image line.
7. **Deploy** — SSH to `root@10.113.213.1`, `cd /path/to/server2 && docker compose pull litellm && docker compose up -d --no-deps litellm`
8. **Verify** — health check, `/models`, proxy chat completion test.

**Rollback:** Revert `docker-compose.yml` image tag to `1.85.1-x51.enterprise.payment-ui-v16.20260524` and `docker compose up -d --no-deps litellm`.

## Open Questions

- Is `docker.x51.vn/dev/litellm:1.88.1-base` already in the private registry, or do we need to pull and re-tag from `ghcr.io/berriai/litellm`?
- Does the upstream 1.88.1 Dockerfile still use `python3.13`? (Needed to verify the UI copy path in `Dockerfile.x51`.)
- Is there a DB migration between 1.85.1 → 1.88.1 that requires a maintenance window?
