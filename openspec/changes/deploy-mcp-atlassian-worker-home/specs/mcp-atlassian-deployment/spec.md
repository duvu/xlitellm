## MODIFIED Requirements

### Requirement: Container runs with Atlassian credentials
The system SHALL run `mcp-atlassian` as a permanent Docker Compose service in `beou@10.113.213.4:~/deployment/worker-home/docker-compose.yml` with Confluence URL, Confluence username, Confluence API token, Jira URL, Jira username, and Jira API token provided through environment variables or env files. The service SHALL use the `streamable-http` transport and listen on port 9000 internally.

#### Scenario: Compose service starts successfully
- **WHEN** `docker compose up -d mcp-atlassian` is executed from `~/deployment/worker-home`
- **THEN** the `mcp-atlassian` container starts, stays running, and exposes its MCP endpoint on the configured host port

#### Scenario: Compose file persists service definition
- **WHEN** `~/deployment/worker-home/docker-compose.yml` is inspected after deployment
- **THEN** it contains a service named `mcp-atlassian` with required Atlassian environment references and Streamable HTTP configuration

### Requirement: Container survives host restart
The `mcp-atlassian` Compose service SHALL define a restart policy that restarts the container automatically after Docker daemon or host restart unless the service has been intentionally stopped.

#### Scenario: Compose restart policy is configured
- **WHEN** the `mcp-atlassian` service definition is inspected
- **THEN** it includes a restart policy such as `unless-stopped` or an equivalent policy that survives host restart

### Requirement: Container is reachable from LiteLLM host
The deployed container SHALL be reachable by the LiteLLM MCP gateway using the URL registered for `mcp-atlassian`. The registered URL SHALL point to the service's Streamable HTTP endpoint, such as `http://10.113.213.4:<port>/mcp` or another verified route reachable from LiteLLM.

#### Scenario: Host-local connectivity smoke test passes
- **WHEN** an MCP initialize request is sent to the service endpoint from `beou@10.113.213.4`
- **THEN** the response is a valid MCP response or a protocol-level response, not a connection-refused or 404 error

#### Scenario: LiteLLM-to-service connectivity smoke test passes
- **WHEN** LiteLLM uses the registered URL for `mcp-atlassian`
- **THEN** LiteLLM can connect to the service endpoint and proxy MCP requests without network connection failure
