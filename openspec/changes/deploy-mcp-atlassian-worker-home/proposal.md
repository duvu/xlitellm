## Why

`mcp-atlassian` needs to run as a durable service instead of an ad-hoc container so it survives restarts and can be managed with the rest of the `worker-home` stack. The LiteLLM MCP gateway at `lite.x51.vn` also needs a persistent server registration so clients can access Atlassian tools through the gateway.

## What Changes

- Add `mcp-atlassian` to `beou@10.113.213.4:~/deployment/worker-home/docker-compose.yml` as a permanent Docker Compose service.
- Configure the service with required Atlassian environment variables, a pinned image reference, restart policy, and a Streamable HTTP endpoint.
- Deploy or recreate only the `mcp-atlassian` service on `worker-home` without disrupting unrelated services.
- Register `mcp-atlassian` in the LiteLLM MCP gateway on `https://lite.x51.vn/` through the LiteLLM REST API.
- Verify host-local service health, LiteLLM-to-service reachability, and MCP gateway tool-list proxy behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `mcp-atlassian-deployment`: Make the deployment permanent in the `worker-home` Compose file on `beou@10.113.213.4` rather than relying on an ad-hoc container command.
- `mcp-atlassian-registration`: Require registration through the LiteLLM REST API on `lite.x51.vn` and verify gateway visibility and proxy behavior.

## Impact

- Remote deployment host: `beou@10.113.213.4`.
- Remote Compose file: `~/deployment/worker-home/docker-compose.yml`.
- Docker image: `ghcr.io/sooperset/mcp-atlassian` with an explicit tag or digest.
- Secrets/configuration: Atlassian and LiteLLM credentials must be consumed from existing secret sources or environment files and must not be printed in logs or reports.
- LiteLLM MCP gateway API: `https://lite.x51.vn/` management endpoints for MCP server registration and verification.
