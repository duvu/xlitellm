## 1. Remote Discovery

- [x] 1.1 Verify SSH access to `beou@10.113.213.4` and locate `~/deployment/worker-home/docker-compose.yml`.
- [x] 1.2 Inspect current `worker-home` Compose services, env files, git status, and existing `mcp-atlassian` containers without printing secrets.
- [x] 1.3 Identify existing Atlassian credential variable names and secret source; stop for clarification if required credentials are missing.
- [x] 1.4 Determine a host port and URL for `mcp-atlassian` that LiteLLM can reach.

## 2. Compose Implementation

- [x] 2.1 Back up the current remote `~/deployment/worker-home/docker-compose.yml` before editing.
- [x] 2.2 Add a permanent `mcp-atlassian` service with pinned `ghcr.io/sooperset/mcp-atlassian` image tag or digest.
- [x] 2.3 Configure Streamable HTTP transport, internal port `9000`, stable host port mapping, restart policy, and env-file or secret references.
- [x] 2.4 Validate the updated remote Compose file with `docker compose config`.

## 3. Service Deployment

- [x] 3.1 Pull the pinned `mcp-atlassian` image on `beou@10.113.213.4`.
- [x] 3.2 Recreate only the `mcp-atlassian` service with Docker Compose.
- [x] 3.3 Verify `docker compose ps mcp-atlassian`, restart policy, image tag/digest, and logs.
- [x] 3.4 Run a host-local MCP endpoint smoke test against the configured `/mcp` URL.

## 4. LiteLLM Gateway Registration

- [ ] 4.1 Discover or confirm the LiteLLM MCP server REST API shape on `https://lite.x51.vn/` without exposing management credentials.
- [ ] 4.2 Check whether an MCP server named `mcp-atlassian` already exists.
- [ ] 4.3 Register or update `mcp-atlassian` with the verified service URL through the LiteLLM REST API.
- [ ] 4.4 Verify the LiteLLM MCP server list contains exactly one active `mcp-atlassian` entry.

## 5. End-to-End Verification

- [ ] 5.1 Send a `tools/list` MCP request through the LiteLLM gateway route for `mcp-atlassian`.
- [ ] 5.2 Verify at least one Atlassian tool is listed or capture the exact non-secret failure response.
- [ ] 5.3 Confirm remote service logs and LiteLLM gateway response show no credential exposure, restart loop, or connection failure.
- [ ] 5.4 Document commands, backups, final URLs, image tag/digest, verification evidence, and remaining risks in a deployment/debug report.

## 6. Rollback Readiness

- [ ] 6.1 Record the remote Compose backup path and the previous LiteLLM MCP registration state.
- [ ] 6.2 Define rollback commands to restore the Compose file and remove or revert the LiteLLM MCP server registration if verification fails.
