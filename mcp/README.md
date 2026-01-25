# MCP Connections

Model Context Protocol (MCP) server configurations for extending agent capabilities with external tools and data sources.

## Structure

```
mcp/
├── servers/            # MCP server definitions
├── configs/            # Connection configurations
└── README.md
```

## Overview

MCP (Model Context Protocol) allows agents to connect to external services, databases, APIs, and tools. Each MCP server provides a set of capabilities that agents can utilize.

## Directory Contents

### Servers (`/servers`)
MCP server definitions and implementations:
- Server configuration files
- Custom server implementations
- Server documentation

### Configs (`/configs`)
Connection configurations for different environments:
- Development configurations
- Staging configurations
- Production configurations

## Available MCP Servers

| Server | Description | Status |
|--------|-------------|--------|
| *Add your servers here* | | |

## Configuring MCP Connections

### Basic Configuration

Create a server configuration in `servers/`:

```json
{
  "name": "my-mcp-server",
  "description": "Description of what this server provides",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-example"],
  "env": {
    "API_KEY": "${MCP_API_KEY}"
  }
}
```

### Transport Types

| Type | Description | Use Case |
|------|-------------|----------|
| `stdio` | Standard input/output | Local servers, CLI tools |
| `sse` | Server-Sent Events | Remote HTTP servers |
| `websocket` | WebSocket connection | Real-time bidirectional |

### Using MCP in Agents

Reference MCP servers in your agent configuration:

```yaml
# agents/my-agent/agent.yaml
name: "My Agent"
mcp_servers:
  - servers/github
  - servers/database
  - servers/slack
```

## Common MCP Servers

### File System
```json
{
  "name": "filesystem",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
}
```

### GitHub
```json
{
  "name": "github",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

### PostgreSQL
```json
{
  "name": "postgres",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "${DATABASE_URL}"
  }
}
```

### Slack
```json
{
  "name": "slack",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_TOKEN": "${SLACK_TOKEN}"
  }
}
```

## Environment Variables

Store sensitive credentials in environment variables, never in configuration files:

```bash
# .env (do not commit)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@host:5432/db
SLACK_TOKEN=xoxb-xxxxxxxxxxxx
```

## Best Practices

1. **Security** - Never commit credentials; use environment variables
2. **Documentation** - Document each server's capabilities and requirements
3. **Versioning** - Pin MCP server versions for reproducibility
4. **Testing** - Test connections in development before production
5. **Permissions** - Follow principle of least privilege for server access

## Adding a New MCP Server

1. Create configuration in `servers/my-server.json`
2. Document capabilities and requirements
3. Add to the Available MCP Servers table above
4. Test the connection locally
5. Submit PR for team review
