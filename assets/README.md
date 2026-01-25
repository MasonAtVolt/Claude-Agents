# Assets

Shared resources, templates, and configurations used across agents and skills.

## Structure

```
assets/
├── prompts/            # System prompts and prompt templates
├── templates/          # Reusable configuration templates
├── configs/            # Shared configuration files
└── README.md
```

## Directory Contents

### Prompts (`/prompts`)
System prompts and prompt templates that can be included in agents:
- Base system prompts
- Role-specific instructions
- Task-specific prompt fragments

### Templates (`/templates`)
Reusable templates for common patterns:
- Agent configuration templates
- Skill definition templates
- Output format templates

### Configs (`/configs`)
Shared configuration files:
- Environment configurations
- Model settings
- Team-wide defaults

## Usage

Assets can be referenced from agent and skill configurations:

```yaml
# In an agent.yaml
system_prompt: "{{assets/prompts/base-system.md}}"

# Include additional context
includes:
  - assets/prompts/code-review-guidelines.md
  - assets/prompts/team-conventions.md
```

## Best Practices

- Keep prompts modular for easy composition
- Use descriptive names for all assets
- Document the purpose and usage of each asset
- Avoid duplicating content - reference shared assets instead
