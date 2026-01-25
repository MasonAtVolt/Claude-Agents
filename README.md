# Claude Agents

A centralized repository for managing Claude AI agents, skills, and shared assets for your team.

## Overview

This repository provides a structured approach to organizing and deploying Claude agents across your team. It enables:

- **Consistent agent definitions** - Standardized configuration format for all agents
- **Reusable skills** - Share capabilities across multiple agents
- **Shared assets** - Centralized prompts, templates, and configurations
- **MCP connections** - External tool and data source integrations
- **Commands & workflows** - Chain agents together for complex automation
- **Input/Output workflow** - Organized file processing with temporary inputs and persistent outputs

## Directory Structure

```
Claude-Agents/
├── agents/                 # Agent definitions
│   └── examples/           # Example agents to get started
├── skills/                 # Reusable agent capabilities
│   ├── core/               # Foundational skills
│   └── custom/             # Team-specific skills
├── assets/                 # Shared resources
│   ├── prompts/            # System prompts and templates
│   ├── templates/          # Configuration templates
│   └── configs/            # Shared configurations
├── mcp/                    # MCP server connections
│   ├── servers/            # Server definitions
│   └── configs/            # Connection configurations
├── commands/               # Reusable commands & workflows
│   ├── workflows/          # Multi-agent pipelines
│   └── scripts/            # Standalone command scripts
├── input/                  # Temporary input files (auto-cleaned)
├── output/                 # Generated outputs (presentations, reports)
└── README.md
```

## Quick Start

### 1. Create a New Agent

```bash
mkdir agents/my-agent
```

Create `agents/my-agent/agent.yaml`:
```yaml
name: "My Agent"
description: "Description of what this agent does"
version: "1.0.0"
model: "claude-sonnet-4-20250514"
skills:
  - core/file-operations
```

### 2. Add a System Prompt

Create `agents/my-agent/system.md`:
```markdown
You are a helpful assistant that specializes in...
```

### 3. Create Custom Skills

```bash
mkdir skills/custom/my-skill
```

See the [Skills README](skills/README.md) for detailed instructions.

### 4. Configure MCP Connections

Add MCP servers to enable external tool access:

```yaml
# agents/my-agent/agent.yaml
mcp_servers:
  - mcp/servers/github
  - mcp/servers/database
```

See the [MCP Guide](mcp/README.md) for available servers and configuration.

### 5. Create a Workflow

Chain multiple agents together:

```yaml
# commands/workflows/code-review.yaml
name: "Code Review Pipeline"
steps:
  - name: "lint"
    agent: "agents/linter"
  - name: "security"
    agent: "agents/security-scanner"
    depends_on: ["lint"]
  - name: "review"
    agent: "agents/code-reviewer"
    depends_on: ["security"]
```

See the [Commands Guide](commands/README.md) for workflow patterns.

### 6. Process Files with Agents

Use the input/output workflow:

```bash
# Add source content to input
cp my-content.md input/

# Run an agent to process it
claude "Create a presentation from input/my-content.md"

# Find the generated output
ls output/
# → my-content-presentation.html
```

- **input/** - Temporary files for agents to consume (cleaned after use)
- **output/** - Generated documents, presentations, and reports

## Documentation

- [Agents Guide](agents/README.md) - How to create and configure agents
- [Skills Guide](skills/README.md) - How to create reusable skills
- [Assets Guide](assets/README.md) - How to manage shared resources
- [MCP Guide](mcp/README.md) - How to configure MCP server connections
- [Commands Guide](commands/README.md) - How to create workflows and chain agents

## Contributing

1. Create a feature branch for your changes
2. Follow the established directory structure
3. Document your agents and skills thoroughly
4. Submit a pull request for review

## License

[Add your license here]
