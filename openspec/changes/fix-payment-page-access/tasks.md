## 1. Dockerfile Fix

- [x] 1.1 Create new Dockerfile extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v2.20260523.2046` that adds `payment/index.html` pre-structure step
- [x] 1.2 Build and verify: `docker build` succeeds and `payment/index.html` exists in image
- [x] 1.3 Push image as `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v3.<TIMESTAMP>`

## 2. Deployment Update

- [x] 2.1 Update `/home/beou/deployment/server2/docker-compose.yml` image tag to the new v3 tag
- [x] 2.2 Commit and push deployment repo (commit message: `deploy(litellm): pre-structure payment UI route, tag payment-ui-v3`)

## 3. Deploy & Verify

- [x] 3.1 SSH `root@10.113.213.1`: `git stash && git pull --ff-only && git stash pop`
- [x] 3.2 SSH: `docker compose pull litellm && docker compose up -d --force-recreate litellm`
- [x] 3.3 Wait 120 seconds for service stabilization
- [x] 3.4 Verify: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5003/ui/payment` returns `200`
- [x] 3.5 Verify container state: RestartCount=0, Status=running, correct image tag
- [x] 3.6 Confirm payment API routes still registered: `curl http://127.0.0.1:5003/openapi.json | python3 -c "..."`

## 4. Documentation

- [x] 4.1 Write deployment report at `docs/2026-05-23-x51-deploy-server2-payment-ui-v3.md`
