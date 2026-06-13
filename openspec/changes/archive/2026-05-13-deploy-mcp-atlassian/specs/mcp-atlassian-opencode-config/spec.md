## ADDED Requirements

### Requirement: OpenCode routes Atlassian MCP calls through LiteLLM gateway
The `.opencode/config.json` file SHALL contain an MCP server entry named `mcp-atlassian` with `type: "sse"` (or `"http"`) pointing to `https://lite.x51.vn/mcp-atlassian/mcp`. The entry SHALL include the user's LiteLLM API key as a Bearer token in the `Authorization` header.

#### Scenario: Config entry present
- **WHEN** `.opencode/config.json` is inspected
- **THEN** it contains an `mcp.servers.mcp-atlassian` (or equivalent list entry) with a URL targeting `lite.x51.vn/mcp-atlassian/mcp` and an Authorization header

#### Scenario: OpenCode lists Atlassian tools
- **WHEN** OpenCode starts and connects to the configured MCP server
- **THEN** Atlassian tools (e.g., `confluence_search`, `jira_get_issue`) appear in the available tools list

### Requirement: End-to-end tool call succeeds
A tool call made through OpenCode to an Atlassian tool SHALL travel through LiteLLM and return a valid response from the Atlassian API.

#### Scenario: Confluence search returns results
- **WHEN** OpenCode invokes the `confluence_search` (or equivalent) tool with a valid query
- **THEN** the tool returns page results from the configured Confluence instance (`https://x51labs.atlassian.net/wiki`)

#### Scenario: Jira issue lookup returns data
- **WHEN** OpenCode invokes a Jira tool (e.g., `jira_get_issue`) with a valid issue key
- **THEN** the tool returns issue data from `https://x51labs.atlassian.net/`
