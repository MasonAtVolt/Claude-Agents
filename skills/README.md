# Skills

Skills are reusable capabilities that can be shared across multiple agents.

## Structure

```
skills/
├── core/               # Foundational skills used by many agents
├── custom/             # Team-specific custom skills
└── README.md
```

## Skill Types

### Core Skills (`/core`)
Foundational capabilities that are commonly needed:
- File operations
- Web interactions
- Data processing
- Code execution

### Custom Skills (`/custom`)
Team-specific skills tailored to your workflows:
- Domain-specific tools
- Integration with internal systems
- Custom business logic

## Creating a New Skill

1. Choose the appropriate directory (`core/` or `custom/`)
2. Create a directory with the skill name (use kebab-case)
3. Add the required files:

```
skill-name/
├── skill.yaml          # Skill configuration
├── handler.py          # Implementation (if applicable)
└── README.md           # Documentation
```

## Skill Configuration Schema

```yaml
name: "Skill Name"
description: "What this skill enables agents to do"
version: "1.0.0"

# Tool definitions
tools:
  - name: "tool_name"
    description: "Tool description"
    parameters:
      - name: "param1"
        type: "string"
        required: true
        description: "Parameter description"

# Dependencies on other skills (optional)
dependencies:
  - core/file-operations
```

## Best Practices

- Keep skills focused and single-purpose
- Document all parameters and expected outputs
- Include usage examples in the skill's README
- Version skills to maintain compatibility
