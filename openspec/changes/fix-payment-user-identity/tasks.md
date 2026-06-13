## 1. Code Fix

- [x] 1.1 In `litellm-payment/src/litellm_payment/api/router.py`: add `_PLACEHOLDER_USER_IDS` set and update `get_current_user` to resolve identity via priority chain (`user_id` → `user_email` → 401)

## 2. Build & Push

- [x] 2.1 Build wheel from updated `litellm-payment` source
- [x] 2.2 Write Dockerfile extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v5.20260523.2223` installing new wheel
- [x] 2.3 Build and push Docker image as `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v6.20260523.2246`

## 3. Deploy

- [x] 3.1 Update `/home/beou/deployment/server2/docker-compose.yml` image tag to the new v6 tag
- [x] 3.2 Commit and push deployment repo
- [x] 3.3 SSH `root@10.113.213.1`: `git pull --ff-only && docker compose pull litellm && docker compose up -d --force-recreate litellm`
- [x] 3.4 Wait 60s for container startup

## 4. Verify

- [x] 4.1 `GET /payment/balance` with user key (c6430f01-8ea9-4ab7-b2ce-9000aedb31d7) → 200, `user_id` is NOT `"default_user_id"`
- [x] 4.2 Confirm user_id is actual user UUID in response (`c6430f01-8ea9-4ab7-b2ce-9000aedb31d7`)
- [x] 4.3 No-auth request → still 401
- [x] 4.4 `/openapi.json` → still 200
