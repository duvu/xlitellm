## 1. Code Fix

- [x] 1.1 Add `Request` to `from fastapi import ...` in `litellm-payment/src/litellm_payment/api/router.py`

## 2. Verification

- [x] 2.1 Confirm schema generation passes locally: `python3 -c "from fastapi import FastAPI; from litellm_payment.api.router import router; ..."`

## 3. Build & Push

- [x] 3.1 Build wheel from `/home/beou/IdeaProjects/litellm-payment/` source
- [x] 3.2 Write Dockerfile extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v4.20260523.2204` that installs the new wheel
- [x] 3.3 Build Docker image: `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v5.20260523.2223`
- [x] 3.4 Push image to registry

## 4. Deploy

- [x] 4.1 Update `/home/beou/deployment/server2/docker-compose.yml` image tag to v5
- [x] 4.2 Commit and push deployment repo
- [x] 4.3 SSH `root@10.113.213.1`: git pull, docker compose recreate litellm
- [x] 4.4 Wait 60s for container startup

## 5. Verify

- [x] 5.1 `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5003/openapi.json` returns `200`
- [x] 5.2 Confirm payment routes in schema: `curl http://127.0.0.1:5003/openapi.json | python3 -c "import sys,json; d=json.load(sys.stdin); print([k for k in d['paths'] if 'payment' in k])"`
- [x] 5.3 Confirm auth still works: `curl http://127.0.0.1:5003/payment/balance -H "Authorization: Bearer qXg8lavzU2U"` returns 200
