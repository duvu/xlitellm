## Why

The team uses Confluence and Jira extensively, but there is no AI-accessible interface to these tools. Deploying `mcp-atlassian` as a self-hosted Docker container and registering it with the LiteLLM MCP gateway at `lite.x51.vn` enables AI agents (via OpenCode and other clients) to read and interact with Atlassian content through a single, access-controlled endpoint.

## What Changes

- Deploy `mcp-atlassian` (sooperset/mcp-atlassian) as a Docker container on the current server exposing an SSE/HTTP MCP endpoint
- Register the running instance as an MCP server in LiteLLM (`lite.x51.vn`) using the management API
- Configure OpenCode's `.opencode/config.json` to route Atlassian MCP calls through the LiteLLM MCP gateway
- Verify end-to-end tool availability via the gateway

## Capabilities

### New Capabilities

- `mcp-atlassian-deployment`: Docker deployment of the `mcp-atlassian` server with Confluence and Jira credentials injected as environment variables
- `mcp-atlassian-registration`: Registration of the running container as a named MCP server in LiteLLM via the management API
- `mcp-atlassian-opencode-config`: OpenCode client configuration pointing to the LiteLLM MCP gateway for Atlassian tools

### Modified Capabilities

(none)

## Impact

- **Infrastructure**: New Docker container on the current server; requires an available port (default: 9000 or configurable)
- **LiteLLM proxy** (`lite.x51.vn`): New MCP server entry added via management API; no code changes to LiteLLM required
- **OpenCode config** (`.opencode/config.json`): New MCP server entry added pointing at `lite.x51.vn`
- **Credentials**: Confluence and Jira API tokens stored as Docker env vars (not committed to source control)
- **Dependencies**: `sooperset/mcp-atlassian` Docker image; Docker Compose or `docker run` on the host
