# Agents

This directory contains Claude agent definitions for your team.

## Structure

```
agents/
├── examples/           # Example agents to get started
├── <agent-name>/       # Each agent gets its own directory
│   ├── agent.yaml      # Agent configuration
│   ├── system.md       # System prompt
│   └── tools/          # Agent-specific tools (optional)
└── README.md
```

## Creating a New Agent

1. Create a new directory with your agent's name (use kebab-case)
2. Add an `agent.yaml` configuration file
3. Define the system prompt in `system.md`
4. Add any agent-specific tools in a `tools/` subdirectory

## Agent Configuration Schema

```yaml
name: "Agent Name"
description: "Brief description of what this agent does"
version: "1.0.0"

# Model configuration
model: "claude-sonnet-4-20250514"  # or claude-opus-4-5-20251101

# Skills this agent uses (references to /skills directory)
skills:
  - core/file-operations
  - custom/your-custom-skill

# Agent-specific settings
settings:
  max_tokens: 4096
  temperature: 0.7
```

## Best Practices

- Keep agents focused on specific domains or tasks
- Reuse skills from the `/skills` directory when possible
- Document agent capabilities clearly in the description
- Version your agents to track changes over time
