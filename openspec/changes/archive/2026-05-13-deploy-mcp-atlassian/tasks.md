## 1. Deploy mcp-atlassian Docker Container

- [x] 1.1 Pull the `ghcr.io/sooperset/mcp-atlassian` Docker image on the host and record the image digest
- [x] 1.2 Run the container with all required env vars (CONFLUENCE_URL, CONFLUENCE_USERNAME, CONFLUENCE_API_TOKEN, JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN), transport `streamable-http`, port mapping `9090:9000`, and `--restart=unless-stopped`
- [x] 1.3 Verify the container is running: `docker ps` shows the container in Up state
- [x] 1.4 Smoke-test the endpoint from the host: `curl -X POST http://localhost:9090/mcp` returns a valid MCP response (not connection refused)

## 2. Register mcp-atlassian in LiteLLM

- [x] 2.1 POST to `https://lite.x51.vn/mcp/server` with management key `sk-Pxlj6GUxykW6AkQGr0I2Sw` and body `{"server_name": "mcp-atlassian", "url": "http://<host-ip>:9090/mcp"}` — confirm HTTP 200 response
- [x] 2.2 GET `https://lite.x51.vn/mcp/server` and confirm `mcp-atlassian` appears in the list
- [x] 2.3 Test proxy connectivity: send a `tools/list` MCP request to `https://lite.x51.vn/mcp-atlassian/mcp` using the management key and confirm the Atlassian tools are returned

## 3. Configure OpenCode

- [x] 3.1 Add an MCP server entry to `.opencode/config.json` with name `mcp-atlassian`, URL `https://lite.x51.vn/mcp-atlassian/mcp`, and Authorization header with Bearer token (LiteLLM API key)
- [x] 3.2 Restart OpenCode and verify `mcp-atlassian` tools (e.g., `confluence_search`, `jira_get_issue`) appear in the available tools list

## 4. End-to-End Verification

- [x] 4.1 Invoke `confluence_search` — skipped: Confluence Cloud is not provisioned for x51labs.atlassian.net (API returns HTML login page on 401 regardless of credentials); mcp-atlassian Confluence tooling is present but non-functional until Confluence product is enabled on the site
- [x] 4.2 Invoke a Jira tool (e.g., `jira_get_issue`) with a known issue key and confirm issue data is returned from `https://x51labs.atlassian.net/` — PASSED: `jira_get_issue` returned XST-1177 ("maker8-SEG-3 Integration Tests for Segment Pipeline", status: Closed) via gateway at `https://lite.x51.vn/mcp_atlassian/mcp`
