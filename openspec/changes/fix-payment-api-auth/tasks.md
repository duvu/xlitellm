## 1. Fix Payment Router Auth

- [x] 1.1 Read `/home/beou/IdeaProjects/litellm-payment/src/litellm_payment/api/router.py` and identify the current `get_current_user` function
- [x] 1.2 Replace `get_current_user` to use `Depends(user_api_key_auth)` from `litellm.proxy.auth.user_api_key_auth`, extracting `user_id` and `is_admin` from `UserAPIKeyAuth`
- [x] 1.3 Update imports: add `from litellm.proxy.auth.user_api_key_auth import user_api_key_auth` and `from litellm.proxy._types import UserAPIKeyAuth, LitellmUserRoles`
- [x] 1.4 Remove the old `Request` import if no longer needed
- [x] 1.5 Commit the change to `litellm-payment` repo with message: `fix(auth): use user_api_key_auth Depends for payment routes`

## 2. Build Updated Wheel

- [x] 2.1 Activate venv at `/tmp/litellm-payment-venv/` and run `pip install build`
- [x] 2.2 Build wheel from `/home/beou/IdeaProjects/litellm-payment` using `python -m build --wheel`
- [x] 2.3 Verify wheel file exists in `dist/` directory

## 3. Build & Push Docker Image

- [x] 3.1 Create Dockerfile at `/tmp/litellm-payment-v4/Dockerfile` extending `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v3.20260523.2148` that installs the updated wheel
- [x] 3.2 Build image: `docker build -t docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v4.20260523.2204 /tmp/litellm-payment-v4/`
- [x] 3.3 Push image: `docker push docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v4.20260523.2204`

## 4. Deploy

- [x] 4.1 Update `/home/beou/deployment/server2/docker-compose.yml` image tag to the new v4 tag
- [x] 4.2 Commit and push deployment repo: `deploy(litellm): fix payment API 401, install auth-fixed wheel v4`
- [x] 4.3 SSH `root@10.113.213.1`: `git stash && git pull --ff-only && git stash pop`
- [x] 4.4 SSH: `docker compose pull litellm && docker compose up -d --force-recreate litellm`

## 5. Verify

- [x] 5.1 Wait 120 seconds for service stabilization
- [x] 5.2 Get a valid API key from server and run: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5003/payment/balance -H "Authorization: Bearer <key>"` → expect 200
- [x] 5.3 Verify unauthenticated call returns 401: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5003/payment/balance` → expect 401
- [x] 5.4 Verify container state: RestartCount=0, Status=running, correct image tag

## 6. Documentation

- [x] 6.1 Write deployment report at `docs/2026-05-23-x51-deploy-server2-payment-ui-v4.md`
