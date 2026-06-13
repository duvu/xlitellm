## ADDED Requirements

### Requirement: Upgrade LiteLLM to 1.88.1 on a dedicated branch
The system SHALL have a git branch `upgrade/litellm-1.88.1-x51` that is based on the upstream `v1.88.1` tag and contains all x51 custom patches cherry-picked from `upgrade/litellm-1.85.1-enterprise-patch`.

#### Scenario: Branch exists and is based on 1.88.1
- **WHEN** `git log --oneline v1.88.1..upgrade/litellm-1.88.1-x51` is executed
- **THEN** only x51 patch commits appear (no upstream 1.88.1 commits listed)

#### Scenario: Version references updated
- **WHEN** `pyproject.toml` is read on the new branch
- **THEN** `version = "1.88.1"` is present

### Requirement: Custom Docker image built for 1.88.1
The build system SHALL produce an image `docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.<date>` using `Dockerfile.x51` with the correct base image, custom UI assets, and litellm-payment installed from source.

#### Scenario: Image builds successfully
- **WHEN** `IMAGE_TAG=docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.YYYYMMDD ./build-docker.sh` is executed
- **THEN** the command exits 0 and the image exists locally

#### Scenario: Image contains single layout JS file
- **WHEN** the build script validates `ui/litellm-dashboard/out/`
- **THEN** exactly one `layout-<hash>.js` file is found (no split-brain)

#### Scenario: litellm-payment installed in image
- **WHEN** `docker run --rm <image> pip show litellm-payment` is executed
- **THEN** the package is listed with a valid version

### Requirement: Image pushed to private registry
The built image SHALL be pushed to `docker.x51.vn/dev/litellm` with the new version tag and be pullable from `root@10.113.213.1`.

#### Scenario: Push succeeds
- **WHEN** `docker push docker.x51.vn/dev/litellm:1.88.1-x51.enterprise.payment-ui-v16.<date>` is executed
- **THEN** all layers are uploaded and the tag is visible in the registry

### Requirement: Deployment compose updated on server2
The `deployment/server2/docker-compose.yml` litellm service image reference SHALL be updated to the new `1.88.1-x51` tag before deployment.

#### Scenario: Compose file references new tag
- **WHEN** `grep image deployment/server2/docker-compose.yml` is executed
- **THEN** the litellm service image contains `1.88.1-x51`

#### Scenario: LITELLM_PAYMENT_ENABLED stays false
- **WHEN** the compose env section is read
- **THEN** `LITELLM_PAYMENT_ENABLED=false` is present (payment feature remains disabled)

### Requirement: LiteLLM 1.88.1 deployed and healthy on root@10.113.213.1
After deployment, the LiteLLM container on server2 SHALL be running version 1.88.1 and passing health checks within 120 seconds.

#### Scenario: Health endpoint returns 200
- **WHEN** `curl -sf http://localhost:5003/health` is executed on the server
- **THEN** HTTP 200 is returned and the response body indicates healthy status

#### Scenario: Version endpoint confirms 1.88.1
- **WHEN** `curl -sf http://localhost:5003/` or version endpoint is called
- **THEN** the response references version `1.88.1`

#### Scenario: /models endpoint lists configured models
- **WHEN** `curl -sf -H "Authorization: Bearer <MASTER_KEY>" http://localhost:5003/models` is called
- **THEN** the response contains a non-empty model list

### Requirement: Proxy chat completion works after upgrade
The deployed LiteLLM SHALL successfully proxy a chat completion request to at least one configured upstream provider.

#### Scenario: Successful chat completion via OpenRouter
- **WHEN** a POST to `/chat/completions` with `model: openrouter/<model>` and valid master key is sent
- **THEN** the response contains a `choices` array with at least one message

### Requirement: Rollback documented and tested
The deployment artifacts SHALL include a documented rollback procedure that can restore the previous `1.85.1` image within 5 minutes.

#### Scenario: Rollback reverts to previous tag
- **WHEN** `docker-compose.yml` litellm image is reverted to `1.85.1-x51.enterprise.payment-ui-v16.20260524` and `docker compose up -d --no-deps litellm` is run
- **THEN** the container restarts with the 1.85.1 image and passes health checks
