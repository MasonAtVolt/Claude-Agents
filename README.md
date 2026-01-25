# Claude Agents

A centralized repository for managing Claude AI agents, skills, and shared assets for your team.

## Overview

This repository provides a structured approach to organizing and deploying Claude agents across your team. It enables:

- **Consistent agent definitions** - Standardized configuration format for all agents
- **Reusable skills** - Share capabilities across multiple agents
- **Shared assets** - Centralized prompts, templates, and configurations

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

## Documentation

- [Agents Guide](agents/README.md) - How to create and configure agents
- [Skills Guide](skills/README.md) - How to create reusable skills
- [Assets Guide](assets/README.md) - How to manage shared resources

## Contributing

1. Create a feature branch for your changes
2. Follow the established directory structure
3. Document your agents and skills thoroughly
4. Submit a pull request for review

## License

[Add your license here]
