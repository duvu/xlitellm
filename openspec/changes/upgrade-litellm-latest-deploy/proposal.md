## Why

LiteLLM upstream has advanced from **1.85.1** to **1.88.1**, bringing three minor-version bumps worth of bug fixes, provider improvements, and security patches. The current deployed image on `server2` (root@10.113.213.1) is pinned to `1.85.1-x51.enterprise.payment-ui-v16` and needs to be refreshed before the version gap grows further and makes rebasing harder.

## What Changes

- Create new git branch `upgrade/litellm-1.88.1-x51` from latest upstream `1.88.1` tag.
- Cherry-pick / rebase all x51 custom patches from `upgrade/litellm-1.85.1-enterprise-patch` onto the new branch.
- Bump version references (`pyproject.toml`, `Dockerfile.x51` `ARG BASE_IMAGE`) to `1.88.1`.
- Build a new custom Docker image `docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16` using `Dockerfile.x51` (custom UI + litellm-payment source).
- Update `deployment/server2/docker-compose.yml` `litellm.image` to the new tag.
- Push image to registry and redeploy on `root@10.113.213.1` via `docker compose pull && docker compose up -d litellm`.
- Keep `LITELLM_PAYMENT_ENABLED=false` — payment module is bundled but not activated.
- Run post-deploy smoke tests: health endpoint, `/models` listing, proxy chat completion.

## Capabilities

### New Capabilities
- `litellm-upgrade-1.88.1`: Bump LiteLLM core from 1.85.1 → 1.88.1, re-apply x51 patches, build new image, deploy, and verify on server2.

### Modified Capabilities
<!-- No existing spec-level behavior changes — this is an upgrade + redeploy, not a feature addition. -->

## Impact

- **Code**: `pyproject.toml` version bump; `Dockerfile.x51` base image ARG; `build-docker.sh` IMAGE_TAG default.
- **Deployment**: `deployment/server2/docker-compose.yml` litellm service image tag.
- **Git**: New branch `upgrade/litellm-1.88.1-x51`; cherry-pick of all x51 patches.
- **Registry**: New image pushed to `docker.x51.vn/dev/litellm`.
- **Runtime**: ~30 s container restart on server2; no schema migration expected (Prisma migrations are additive and already applied).
- **Payment**: Unaffected — module stays bundled, `LITELLM_PAYMENT_ENABLED=false` unchanged.
