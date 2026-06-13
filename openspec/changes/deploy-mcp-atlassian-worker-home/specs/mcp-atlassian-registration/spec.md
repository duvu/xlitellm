## MODIFIED Requirements

### Requirement: MCP server registered in LiteLLM
The system SHALL register the running `mcp-atlassian` Compose service as a named MCP server in LiteLLM (`lite.x51.vn`) using the LiteLLM REST management API. The server name SHALL be `mcp-atlassian`. The registered URL SHALL point to the verified Streamable HTTP endpoint of the container.

#### Scenario: Successful REST API registration
- **WHEN** an authenticated REST request is sent to the LiteLLM MCP server management endpoint with `server_name: "mcp-atlassian"` and the verified service URL
- **THEN** the API returns a successful response and the response includes the registered server entry with the provided name and URL

#### Scenario: Registration is idempotent
- **WHEN** an existing LiteLLM MCP server named `mcp-atlassian` is present
- **THEN** implementation updates or replaces the existing entry through the API rather than creating a duplicate server entry

#### Scenario: Server appears in server list
- **WHEN** an authenticated REST request lists MCP servers from `https://lite.x51.vn/`
- **THEN** the response includes exactly one active entry with `server_name: "mcp-atlassian"`

### Requirement: Registered server is reachable from LiteLLM
LiteLLM SHALL be able to proxy MCP tool calls to the registered `mcp-atlassian` URL. The URL stored in LiteLLM SHALL be reachable from the LiteLLM process at runtime.

#### Scenario: LiteLLM proxies tool list
- **WHEN** a client sends a `tools/list` MCP request through the LiteLLM gateway route for `mcp-atlassian`
- **THEN** LiteLLM forwards the request to the registered URL and returns the tool list from `mcp-atlassian`

#### Scenario: Failed registration is not accepted as complete
- **WHEN** REST API registration or gateway tool-list verification fails
- **THEN** the deployment is reported as incomplete and the failure evidence is captured without exposing credentials
