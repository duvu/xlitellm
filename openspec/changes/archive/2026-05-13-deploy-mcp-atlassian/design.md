## Context

The team relies on Confluence for documentation and Jira for project tracking. Currently there is no programmatic AI-accessible interface to either system. The LiteLLM proxy at `lite.x51.vn` already acts as an MCP gateway, capable of proxying tool calls to registered MCP servers. The `sooperset/mcp-atlassian` project provides an MCP-compatible server (SSE/Streamable HTTP) that wraps the Atlassian REST APIs.

This change wires together three already-available pieces:
1. `mcp-atlassian` Docker container (new, on the same host as LiteLLM or accessible from it)
2. LiteLLM MCP server registration (management API call, no code change)
3. OpenCode client config (`.opencode/config.json` addition)

## Goals / Non-Goals

**Goals:**
- Run `mcp-atlassian` as a persistent Docker container with Confluence and Jira credentials
- Register it as a named MCP server (`mcp-atlassian`) in `lite.x51.vn` via the management API
- Configure OpenCode to reach Atlassian tools through `lite.x51.vn/mcp-atlassian/mcp`
- Verify that OpenCode can list and call Atlassian tools via the gateway

**Non-Goals:**
- LiteLLM source code changes
- Custom access-control rules for MCP tools (team/key-level filtering can be added later)
- Jira write operations beyond what `mcp-atlassian` exposes out of the box
- High-availability or horizontal scaling of the container

## Decisions

### Decision 1: Transport — SSE vs Streamable HTTP
**Choice**: Streamable HTTP (`/mcp` endpoint).  
**Rationale**: LiteLLM's `handle_streamable_http_mcp` expects a Streamable HTTP endpoint. `mcp-atlassian` supports this via the `--transport streamable-http` flag. SSE is deprecated and would require a different LiteLLM code path.  
**Alternative**: SSE — skipped because LiteLLM's primary MCP path is Streamable HTTP.

### Decision 2: Container runtime — Docker Compose vs `docker run`
**Choice**: `docker run` with `--restart=unless-stopped`.  
**Rationale**: Single-container deployment; no inter-service dependencies. Compose is not needed. A simple `docker run` is easier to audit and reproduce without a Compose file checked in alongside credentials.  
**Alternative**: Docker Compose — acceptable if the host already uses Compose; adds a `docker-compose.yml` but keeps credentials out of source control via `.env`.

### Decision 3: Credential storage — env vars in `docker run` vs `.env` file
**Choice**: Env vars passed directly in `docker run` (not committed to source control).  
**Rationale**: Simplest approach for a single-host deployment. The credentials are already known and scoped to the Atlassian workspace. No secrets manager is in scope.  
**Alternative**: `.env` file mounted into the container — marginally better hygiene; choose this if the team wants file-based secret rotation.

### Decision 4: Port
**Choice**: Host port `9090` → container port `9000` (default `mcp-atlassian` port).  
**Rationale**: Avoids collision with common ports (8080, 8000, 3000). Configurable if taken.

### Decision 5: LiteLLM server URL registered
**Choice**: `http://<host-internal-ip>:9090/mcp` (or `http://localhost:9090/mcp` if LiteLLM runs on the same host).  
**Rationale**: LiteLLM makes outbound calls to the registered URL when a client invokes the MCP server. The URL must be reachable from inside the LiteLLM container/process.

## Risks / Trade-offs

- **Credential exposure in shell history** → Mitigation: use `--env-file` or set env vars from a file rather than inline on the command line.
- **Container restart on host reboot** → Mitigation: `--restart=unless-stopped` handles this for Docker; for systemd-managed Docker this is sufficient.
- **mcp-atlassian version drift** → Mitigation: pin the image tag (e.g., `ghcr.io/sooperset/mcp-atlassian:latest` or a specific version tag) and document the pinned version.
- **Network reachability from LiteLLM to mcp-atlassian** → Mitigation: verify with `curl http://<host>:9090/mcp` from the LiteLLM host before registering; use Docker `--network host` or explicit bridge if needed.
- **Atlassian API rate limits** → Low risk for interactive use; no mitigation needed for now.

## Migration Plan

1. Pull the `mcp-atlassian` Docker image on the host.
2. Run the container with credentials and `--restart=unless-stopped`.
3. Smoke-test the container directly: `curl http://localhost:9090/mcp`.
4. Register the server in LiteLLM via the management API (POST to `/mcp/server`).
5. Update `.opencode/config.json` to add the gateway entry.
6. Verify via OpenCode: list tools and run a sample Confluence search.

**Rollback**: Remove the MCP server registration via management API (`DELETE /mcp/server/{id}`), revert `.opencode/config.json`, and stop/remove the container.

## Open Questions

- Should the container be placed behind a private network or firewall rule so only the LiteLLM host can reach port 9090? (Recommended for production; out of scope here.)
- Should team/key-level MCP access control be applied to `mcp-atlassian` in LiteLLM? (Can be added as a follow-up change.)
