## ADDED Requirements

### Requirement: Container runs with Atlassian credentials
The system SHALL run `mcp-atlassian` as a Docker container with Confluence URL, Confluence username, Confluence API token, Jira URL, Jira username, and Jira API token provided as environment variables. The container SHALL use the `streamable-http` transport and listen on port 9000 internally.

#### Scenario: Container starts successfully
- **WHEN** `docker run` is executed with all required environment variables and port mapping `9090:9000`
- **THEN** the container starts, stays running, and `curl http://localhost:9090/mcp` returns an HTTP 200 response

#### Scenario: Container survives host restart
- **WHEN** the Docker host is rebooted
- **THEN** the container restarts automatically due to `--restart=unless-stopped` policy

### Requirement: Container is reachable from LiteLLM host
The deployed container SHALL be reachable from the LiteLLM process via `http://<host>:9090/mcp`. If LiteLLM and `mcp-atlassian` run on the same host, `http://localhost:9090/mcp` SHALL be reachable from within the LiteLLM process.

#### Scenario: Connectivity smoke test passes
- **WHEN** a `curl -X POST http://localhost:9090/mcp` (or equivalent MCP initialize request) is sent from the LiteLLM host
- **THEN** the response contains a valid MCP JSON response (not a connection-refused error)

### Requirement: Image version is pinned
The deployment SHALL reference a specific image tag or digest for `ghcr.io/sooperset/mcp-atlassian` rather than relying solely on `latest`, so that the deployed version is reproducible.

#### Scenario: Image tag is explicit
- **WHEN** reviewing the `docker run` command or Compose file
- **THEN** the image reference includes a version tag (e.g., `:latest` is acceptable only if the resolved digest is also recorded; a semver tag is preferred)
