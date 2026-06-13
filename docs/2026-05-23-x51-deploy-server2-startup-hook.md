# X51 Deploy Report: litellm-payment startup_hook -> server2

**Date:** 2026-05-23
**Tag:** `1.85.1-x51.enterprise.payment-ui-v2.20260523.2046`
**Registry:** docker.x51.vn
**Deployment repo:** `github.com:x51vn/deployment.git` (commit `5cd1413`)
**Hosts:** `root@10.113.213.1`
**Final status:** SUCCESS

## Summary

| Step | Status | Notes |
|------|--------|-------|
| Root cause analysis | PASS | Routes not registering; startup_hook missing |
| Add `startup_hook()` to proxy_integration.py | PASS | Auto-discovers litellm app and calls register_with_litellm_proxy |
| Rebuild wheel | PASS | `litellm_payment-0.1.0-py3-none-any.whl` at /tmp/payment-wheels-v2/ |
| Push git (litellm-payment) | PASS | commit `35e8fd5` on master |
| Build Docker image | PASS | `--force-reinstall` required to overwrite cached old package |
| Push Docker image | PASS | digest `sha256:ac244bd418e039f6eecdf63118ab2e33178f388bbc54ab736860396948dd7e1d` |
| Update default.env | PASS | Added `LITELLM_WORKER_STARTUP_HOOKS=litellm_payment.proxy_integration:startup_hook` |
| Update docker-compose.yml | PASS | Image tag updated to `payment-ui-v2.20260523.2046` |
| Commit & push deployment repo | PASS | commit `5cd1413` |
| Remote state check | PASS | Stash/pull/pop required (server had local default.env changes) |
| Recreate litellm service | PASS | `docker compose up -d --force-recreate litellm` |
| 120s stabilization wait | PASS | 20:49:18 → 20:51:18 (+07) |
| Log collection & analysis | PASS | No errors, no restart loop |
| Verify /payment routes | PASS | 7 routes registered in /openapi.json |

## Root Cause

`register_with_litellm_proxy(app)` requires an explicit FastAPI `app` instance. The previous deployment had `PAYMENT_DATABASE_URL` set but no `LITELLM_WORKER_STARTUP_HOOKS`, so the module was installed but payment routes were never attached to the app.

**Fix:** Added `startup_hook()` function in `litellm_payment/proxy_integration.py`:

```python
def startup_hook() -> None:
    """No-arg startup hook for LITELLM_WORKER_STARTUP_HOOKS."""
    from litellm.proxy.proxy_server import app as litellm_app
    register_with_litellm_proxy(app=litellm_app)
```

Then set `LITELLM_WORKER_STARTUP_HOOKS=litellm_payment.proxy_integration:startup_hook` in `default.env`.

## Activities

- `20:43` Local: Added `startup_hook()` to `proxy_integration.py`
- `20:44` Local: `python -m build --wheel` → `litellm_payment-0.1.0-py3-none-any.whl` rebuilt
- `20:44` Local: `git commit + git push origin master` → commit `35e8fd5`
- `20:46` Local: `docker build --force-reinstall` → image `payment-ui-v2.20260523.2046` (startup_hook OK)
- `20:46` Local: `docker push` → digest `sha256:ac244...`
- `20:47` Local: `default.env` → added `LITELLM_WORKER_STARTUP_HOOKS=...`
- `20:47` Local: `docker-compose.yml` → image tag updated
- `20:47` Local: `git commit + push` → commit `5cd1413`
- `20:48` `root@10.113.213.1`: `git stash && git pull --ff-only && git stash pop`
- `20:49` `root@10.113.213.1`: `docker compose pull litellm && docker compose up -d --force-recreate litellm`
- `20:49` Wait start: `sleep 120`
- `20:51` Wait end
- `20:51` `root@10.113.213.1`: logs collected; `Worker startup hook ... executed successfully`
- `20:51` `root@10.113.213.1`: `curl http://127.0.0.1:5003/openapi.json` → 7 `/payment/*` paths confirmed

## Images

- `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v2.20260523.2046`

## Services Recreated

- `litellm`

## Issues, Errors, Fixes

| Issue | Error | Fix applied | Result |
|-------|-------|-------------|--------|
| Routes not registering | `startup_hook` function missing from litellm-payment | Added `startup_hook()` auto-discovering litellm app | Routes registered |
| Docker build used cached old package | `ImportError: cannot import name 'startup_hook'` | Added `--force-reinstall` to pip install | Build passed |
| Server local env changes blocked git pull | `error: Your local changes would be overwritten` | `git stash / pull / stash pop` | Merged cleanly |

## Post-Deploy Log Analysis

| Host | Service | Log window | Findings | Action |
|------|---------|------------|----------|--------|
| `root@10.113.213.1` | `litellm` | last 100 lines after 120s | `Worker startup hook 'litellm_payment.proxy_integration:startup_hook' executed successfully`; `Application startup complete`; no ERROR/Exception | None required |

## Verification Evidence

```
NAME      IMAGE                                                                         STATUS         PORTS
litellm   docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v2.20260523.2046   Up 2 minutes   4000/tcp, 10.113.213.1:5003->5003/tcp, 127.0.0.1:5003->5003/tcp

RestartCount: 0, State: running

Payment paths (7):
/payment/admin/credit
/payment/admin/list
/payment/balance
/payment/create
/payment/list
/payment/webhook/{provider}
/payment/{payment_id}
```

## Remaining Risks / Next Steps

- Payment routes are now live. Ensure `Authorization: Bearer {accessToken}` is passed correctly from the UI to the payment API endpoints.
- The `ENFORCE_PRISMA_MIGRATION_CHECK=true` variable remains server-local (not tracked in deployment repo) — this is intentional per server admin preference.
- Monitor logs for any `litellm_payment` errors on first real user requests.
