## 1. Preparation

- [x] 1.1 Confirm upstream `v1.88.1` tag exists: `git fetch upstream --tags && git tag | grep 1.88.1`
- [x] 1.2 List x51 patch commits to cherry-pick: `git log --oneline upgrade/litellm-1.85.1-enterprise-patch ^v1.85.1`
- [x] 1.3 Verify python version in upstream 1.88.1 base Dockerfile (check if still `python3.13`)
- [x] 1.4 Check if `docker.x51.vn/dev/litellm:1.88.1-base` already exists in registry; if not, pull `ghcr.io/berriai/litellm-non-root:main-v1.88.1-stable` and retag

## 2. Git Branch Setup

- [x] 2.1 Create new branch: `git checkout -b upgrade/litellm-1.88.1-x51 v1.88.1`
- [x] 2.2 Cherry-pick each x51 patch commit in order; resolve any conflicts (drop if upstream already fixed)
- [x] 2.3 Update `pyproject.toml` version to `1.88.1`
- [x] 2.4 Update `Dockerfile.x51` `ARG BASE_IMAGE` to point to 1.88.1 base image
- [x] 2.5 Push branch: `git push -u origin upgrade/litellm-1.88.1-x51`

## 3. Docker Image Build

- [x] 3.1 Set `DATE=$(date +%Y%m%d)` and `IMAGE_TAG=docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.$DATE`
- [x] 3.2 Run `IMAGE_TAG=$IMAGE_TAG ./build-docker.sh` and verify exit 0
- [x] 3.3 Confirm image built: `docker images | grep 1.88.1-x51`
- [x] 3.4 Smoke-test image locally: `docker run --rm $IMAGE_TAG python3 -c "import litellm; print(litellm.__version__)"` → should print `1.88.1`
- [x] 3.5 Verify litellm-payment in image: `docker run --rm $IMAGE_TAG pip show litellm-payment`

## 4. Registry Push

- [x] 4.1 Ensure logged in: `docker login docker.x51.vn`
- [x] 4.2 Push image: `docker push $IMAGE_TAG`
- [x] 4.3 Confirm push succeeded (no layer errors in output)

## 5. Deployment Compose Update

- [x] 5.1 Edit `deployment/server2/docker-compose.yml`: update litellm service `image:` to new `1.88.1-x51` tag
- [x] 5.2 Verify `LITELLM_PAYMENT_ENABLED=false` is still in env section (payment stays disabled)
- [x] 5.3 Commit change: `git -C /home/beou/deployment add server2/docker-compose.yml && git -C /home/beou/deployment commit -m "chore: upgrade litellm image to 1.88.1-x51"`

## 6. Deploy to root@10.113.213.1

- [x] 6.1 SSH to server: `ssh root@10.113.213.1`
- [x] 6.2 Navigate to server2 deployment dir (e.g. `~/server2` or `/opt/server2`)
- [x] 6.3 Pull new image: `docker compose pull litellm`
- [x] 6.4 Recreate container: `docker compose up -d --no-deps litellm`
- [x] 6.5 Wait 60 s for startup, then check logs: `docker compose logs --tail=100 litellm`
- [x] 6.6 Confirm no Prisma migration errors in logs

## 7. Post-Deploy Verification

- [x] 7.1 Health check: `curl -sf http://localhost:5003/health` → HTTP 200
- [x] 7.2 Models list: `curl -sf -H "Authorization: Bearer qXg8lavzU2U" http://localhost:5003/models | python3 -m json.tool | head -20`
- [x] 7.3 Proxy chat completion: POST to `/v1/chat/completions` with a model from the list; verify `choices[0].message.content` is non-empty
- [x] 7.4 Confirm litellm version in startup logs or via `docker exec litellm python3 -c "import litellm; print(litellm.__version__)"`
- [x] 7.5 Confirm `LITELLM_PAYMENT_ENABLED` is false in running container: `docker exec litellm env | grep PAYMENT`

## 8. Rollback (if needed)

- [ ] 8.1 Revert `deployment/server2/docker-compose.yml` image to `docker.x51.vn/dev/litellm:1.85.1-x51.enterprise.payment-ui-v16.20260524`
- [ ] 8.2 On server: `docker compose up -d --no-deps litellm`
- [ ] 8.3 Verify health check passes with 1.85.1 image
