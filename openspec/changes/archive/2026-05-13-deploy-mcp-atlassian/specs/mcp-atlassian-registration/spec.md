## ADDED Requirements

### Requirement: MCP server registered in LiteLLM
The system SHALL register the running `mcp-atlassian` container as a named MCP server in LiteLLM (`lite.x51.vn`) using the management API. The server name SHALL be `mcp-atlassian`. The registered URL SHALL point to the Streamable HTTP endpoint of the container.

#### Scenario: Successful registration
- **WHEN** a POST request is sent to `https://lite.x51.vn/mcp/server` with the management key and a body containing `server_name: "mcp-atlassian"` and `url: "http://<host>:9090/mcp"`
- **THEN** the API returns HTTP 200 and the response includes the registered server entry with the provided name and URL

#### Scenario: Server appears in server list
- **WHEN** a GET request is sent to `https://lite.x51.vn/mcp/server` with the management key
- **THEN** the response includes an entry with `server_name: "mcp-atlassian"`

### Requirement: Registered server is reachable from LiteLLM
LiteLLM SHALL be able to proxy MCP tool calls to the registered `mcp-atlassian` URL. The URL stored in LiteLLM SHALL be reachable from the LiteLLM process at runtime.

#### Scenario: LiteLLM proxies tool list
- **WHEN** a client sends a `tools/list` MCP request to `https://lite.x51.vn/mcp-atlassian/mcp`
- **THEN** LiteLLM forwards the request to the registered URL and returns the tool list from `mcp-atlassian`
