## Context

The existing MCP Atlassian capability describes running `mcp-atlassian` and registering it with the LiteLLM MCP gateway, but this change needs to make the deployment permanent on `beou@10.113.213.4` under the `worker-home` Compose stack. The target Compose file is `~/deployment/worker-home/docker-compose.yml`, and the gateway registration target is `https://lite.x51.vn/` via REST API.

The implementation must preserve existing services on `worker-home`, avoid printing Atlassian or LiteLLM secrets, and avoid destructive Docker or Git operations. The service should be independently recreatable so only `mcp-atlassian` changes during rollout.

## Goals / Non-Goals

**Goals:**

- Add a durable `mcp-atlassian` service to the `worker-home` Docker Compose file.
- Configure the service to expose the Streamable HTTP MCP endpoint on a stable host URL reachable by LiteLLM.
- Use existing secret sources or environment files for Atlassian credentials and LiteLLM management API credentials.
- Register or update the MCP server entry in LiteLLM through the REST API.
- Verify local service health, LiteLLM gateway registration, and end-to-end MCP `tools/list` behavior.

**Non-Goals:**

- Do not change LiteLLM source code unless the gateway REST API is broken.
- Do not rotate or expose Atlassian, LiteLLM, or deployment credentials.
- Do not recreate unrelated services in the `worker-home` stack.
- Do not migrate databases or alter unrelated deployment repositories.

## Decisions

- Use Docker Compose as the source of permanence for `mcp-atlassian`.
  - Rationale: the user explicitly requested a permanent deployment in `~/deployment/worker-home/docker-compose.yml`; Compose also gives restart policy, logs, and service-scoped recreate behavior.
  - Alternative considered: `docker run --restart=unless-stopped`; rejected because it would not be tracked in the stack file.

- Bind the service to a stable host port and register that URL in LiteLLM.
  - Rationale: LiteLLM at `lite.x51.vn` must be able to reach the MCP Streamable HTTP endpoint consistently after restarts.
  - Alternative considered: container-only network name; only acceptable if LiteLLM shares the same Docker network, which is not guaranteed across hosts.

- Keep secrets in env files or existing secret stores referenced by Compose.
  - Rationale: Compose can reference secret values without committing them, and deployment/debug logs must not expose tokens.
  - Alternative considered: inline environment values in Compose; rejected because it risks leaking credentials in git history and reports.

- Register via LiteLLM REST API with idempotent behavior.
  - Rationale: repeated deploys should not create duplicate MCP server records; if an entry already exists, implementation should update or replace it according to the API behavior.
  - Alternative considered: manual dashboard registration; rejected because the user requested REST API registration and automation is easier to verify.

## Risks / Trade-offs

- LiteLLM cannot reach `beou@10.113.213.4` on the chosen host port → verify network path from LiteLLM/server context before declaring success, and adjust the registered URL only with evidence.
- Required Atlassian credentials are missing or invalid → stop and request/confirm secret source rather than printing or hardcoding credentials.
- LiteLLM MCP REST API shape differs from expected `/mcp/server` behavior → inspect current OpenAPI or existing gateway responses and use the documented live API shape.
- Existing `worker-home` Compose file is dirty or managed manually → back it up before editing, preserve unrelated changes, and recreate only `mcp-atlassian`.
- `ghcr.io/sooperset/mcp-atlassian` tag changes unexpectedly → pin a specific tag or record the resolved digest during implementation.

## Migration Plan

1. Inspect `beou@10.113.213.4:~/deployment/worker-home/docker-compose.yml` and existing env files without printing secrets.
2. Add `mcp-atlassian` service with pinned image, restart policy, stable port mapping, command/args for Streamable HTTP, and secret references.
3. Validate remote Compose config.
4. Pull and recreate only `mcp-atlassian`.
5. Verify container status and host-local MCP endpoint.
6. Register or update the LiteLLM MCP server entry through `https://lite.x51.vn/` REST API.
7. Verify gateway server list and MCP `tools/list` through LiteLLM.

Rollback: restore the backed-up Compose file or remove only the `mcp-atlassian` service entry, recreate/removal only that service, and remove or revert the LiteLLM MCP server registration if it was added.

## Open Questions

- Which exact env file on `worker-home` contains the Atlassian credential variables, or should a new non-committed env file be created?
- Which host/port URL is reachable from the LiteLLM gateway: `http://10.113.213.4:<port>/mcp`, an internal DNS name, or another routed address?
- Should the registered LiteLLM MCP server name remain exactly `mcp-atlassian` if an existing entry already exists?
