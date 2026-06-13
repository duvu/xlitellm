## 1. Prepare Static Files

- [x] 1.1 Create build context dir `/tmp/litellm-payment-v8/static/`
- [x] 1.2 Copy new dashboard layout JS: `ui/litellm-dashboard/out/_next/static/chunks/app/(dashboard)/layout-2655ce84242e7470.js` → `/tmp/litellm-payment-v8/static/_next/static/chunks/app/(dashboard)/`
- [x] 1.3 Remove old layout JS file from the image path (will be done via Dockerfile)
- [x] 1.4 Copy payment page JS dir: `ui/litellm-dashboard/out/_next/static/chunks/app/(dashboard)/payment/` → `/tmp/litellm-payment-v8/static/_next/static/chunks/app/(dashboard)/payment/`
- [x] 1.5 Sync all changed top-level chunks: rsync `ui/litellm-dashboard/out/_next/static/chunks/` → `/tmp/litellm-payment-v8/static/_next/static/chunks/` (only new/changed files)
- [x] 1.6 Create payment page: `mkdir -p /tmp/litellm-payment-v8/static/payment && cp ui/litellm-dashboard/out/payment.html /tmp/litellm-payment-v8/static/payment/index.html`
- [x] 1.7 Copy `ui/litellm-dashboard/out/payment.txt` → `/tmp/litellm-payment-v8/static/payment.txt`

## 2. Dockerfile

- [x] 2.1 Write `/tmp/litellm-payment-v8/Dockerfile` extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v7.20260523.2257`
- [x] 2.2 Add RUN step to delete old layout JS (by glob: `rm -f .../out/_next/static/chunks/app/\(dashboard\)/layout-*.js`)
- [x] 2.3 Add COPY step: `COPY static/ /usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/`
- [x] 2.4 Build image: `docker build -t docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v8.<TIMESTAMP> /tmp/litellm-payment-v8/`
- [x] 2.5 Verify: `docker run --rm <image> grep -r '"Payment"' /usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/_next/static/chunks/app/\(dashboard\)/layout-*.js | head -2`
- [x] 2.6 Verify: `docker run --rm <image> ls /usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/payment/` shows `index.html`
- [x] 2.7 Push image: `docker push docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v8.<TIMESTAMP>`

## 3. Deployment

- [x] 3.1 Update `/home/beou/deployment/server2/docker-compose.yml` image tag to v8
- [x] 3.2 Commit: `git add docker-compose.yml && git commit -m "deploy(litellm): sync payment UI static files to sidebar, tag payment-ui-v8"` in `/home/beou/deployment/server2/`
- [x] 3.3 Push deployment repo
- [x] 3.4 SSH `root@10.113.213.1`: `cd ~/deployment/server2 && git pull --ff-only && docker compose pull litellm && docker compose up -d --force-recreate litellm`
- [x] 3.5 Wait 120 seconds

## 4. Verify

- [x] 4.1 Check container state: `docker inspect litellm --format '{{.State.Status}} restart={{.RestartCount}} image={{.Config.Image}}'` → running, restart=0, v10 tag
- [x] 4.2 Verify sidebar JS has Payment: `curl -s http://127.0.0.1:5003/ui/_next/static/chunks/app/\(dashboard\)/layout-*.js | grep -o '"Payment"' | head -1` → `"Payment"`
- [x] 4.3 Verify `/ui/payment` loads: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5003/ui/payment` → `307` (redirect to login, expected for unauthenticated)
- [x] 4.4 Verify payment API still works: `curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer <user-key>" http://127.0.0.1:5003/payment/balance` → `200`
