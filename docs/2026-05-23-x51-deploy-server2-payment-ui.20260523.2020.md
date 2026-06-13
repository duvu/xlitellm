# X51 Deploy Report: litellm (Payment UI) -> server2

**Date:** 2026-05-23
**Tag:** `1.85.1-x51.enterprise.payment-ui.20260523.2020`
**Registry:** docker.x51.vn
**Deployment repo:** github.com:x51vn/deployment.git (commit `8fd795c`)
**Hosts:** `root@10.113.213.1`
**Final status:** SUCCESS

## Summary

| Step | Status | Notes |
|------|--------|-------|
| UI build (`npm run build`) | PASS | `/payment` route included in output |
| Dockerfile creation | PASS | Extends payment image, copies UI `out/` to both Python paths |
| Docker build | PASS | `sha256:bfef4136f003` |
| Push to registry | PASS | `sha256:db0c43a679102cca86333e7e5f1986cb671873a00426fece866b96919825cee1` |
| Deployment compose update | PASS | `server2/docker-compose.yml` line 158 updated |
| Git commit & push | PASS | commit `8fd795c` on master |
| Remote state check | PASS | Was running previous payment image without issues |
| Pull & recreate | PASS | New image pulled, container recreated |
| 120s stabilization wait | PASS | 20:22:02 → 20:24:02 +07 |
| Log collection & analysis | PASS | No errors, normal DEBUG spend cycles |
| Debug / patch / retest | N/A | No issues |
| Redeploy attempts | N/A | First attempt succeeded |
| Final verification | PASS | Up 2 minutes, correct tag, RestartCount=0 |

## Activities

- `20:18:xx` Local: `npm run build` → success, /payment route built (7.95 kB)
- `20:19:xx` Local: Created `/tmp/litellm-ui-build/Dockerfile` extending `payment.20260523.1826`
- `20:19:xx` Local: `docker build -t docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui.20260523.2020` → `sha256:bfef4136f003`
- `20:20:xx` Local: `docker push docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui.20260523.2020` → digest `sha256:db0c43a6...`
- `20:20:xx` Local: Updated `server2/docker-compose.yml` line 158 with new tag
- `20:20:xx` Local: `git commit + push` → commit `8fd795c` on master
- `20:21:xx` `root@10.113.213.1`: `git pull --ff-only` → Fast-forward to `8fd795c`
- `20:21:xx` `root@10.113.213.1`: `docker compose pull litellm` → 2 new layers pulled
- `20:21:xx` `root@10.113.213.1`: `docker compose up -d --force-recreate litellm` → Container recreated and started
- `20:22:02` Wait: `sleep 120` → started
- `20:24:02` Wait: `sleep 120` → completed
- `20:24:xx` `root@10.113.213.1`: `docker compose ps litellm` → `Up 2 minutes`, correct tag
- `20:24:xx` `root@10.113.213.1`: `docker compose logs --tail=50 litellm` → only DEBUG spend update logs

## Images

- `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui.20260523.2020`
  - digest: `sha256:db0c43a679102cca86333e7e5f1986cb671873a00426fece866b96919825cee1`
  - base: `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment.20260523.1826`
  - added: Next.js UI build with Payment page (sidebar entry + /payment route)

## Services Recreated

- `litellm` on `root@10.113.213.1`

## Issues, Errors, Fixes

| Issue | Error | Fix applied | Result |
|-------|-------|-------------|--------|
| None | None | N/A | N/A |

## Post-Deploy Log Analysis

| Host | Service | Log window | Findings | Action |
|------|---------|------------|----------|--------|
| root@10.113.213.1 | litellm | last 50 lines after 120s | Only DEBUG spend update transactions (normal background task). No ERROR, Exception, panic, or connection issues. | None needed |

## Verification Evidence

```
NAME      IMAGE                                                                      STATUS         PORTS
litellm   docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui.20260523.2020   Up 2 minutes   4000/tcp, 10.113.213.1:5003->5003/tcp, 127.0.0.1:5003->5003/tcp

RestartCount: 0
```

## What Changed

- **New Payment page** accessible at `/ui/payment` (full URL: `http://10.113.213.1:5003/ui/payment`)
- **Sidebar entry** "Payment" added between Logs and Guardrails (WalletOutlined icon, visible to all users)
- Page features: balance card, top-up modal (preset amounts + QR code display), payment history table, admin tab with credit modal
- UI built from source: `ui/litellm-dashboard/src/app/(dashboard)/payment/` (7 new files)

## Remaining Risks / Next Steps

- **Payment API not yet active**: The `/payment/*` backend routes require:
  1. `PAYMENT_DATABASE_URL` env var set in `/home/beou/deployment/server2/litellm/default.env`
  2. Alembic migrations run: `litellm-payment migrate`
  3. Redeploy after env var is added
- Until then, the Payment page loads but all API calls will return 404/500
