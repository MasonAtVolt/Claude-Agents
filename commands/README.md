# Commands

Reusable commands and workflows that chain agents together for complex multi-step tasks.

## Structure

```
commands/
├── workflows/          # Multi-agent workflow definitions
├── scripts/            # Standalone command scripts
└── README.md
```

## Overview

Commands enable you to orchestrate multiple agents in sequence or parallel, creating powerful automation pipelines that can be invoked from Claude Code.

## Directory Contents

### Workflows (`/workflows`)
Multi-agent pipeline definitions:
- Sequential agent chains
- Parallel execution patterns
- Conditional branching workflows

### Scripts (`/scripts`)
Standalone command scripts:
- Single-purpose automation scripts
- Utility commands
- Helper scripts for common tasks

## Available Commands

| Command | Description | Agents Used |
|---------|-------------|-------------|
| *Add your commands here* | | |

## Workflow Definition

### Basic Workflow

Create a workflow in `workflows/`:

```yaml
# workflows/code-review.yaml
name: "Code Review Pipeline"
description: "Automated code review with multiple specialized agents"
version: "1.0.0"

steps:
  - name: "lint"
    agent: "agents/linter"
    description: "Run linting checks"

  - name: "security"
    agent: "agents/security-scanner"
    description: "Check for security vulnerabilities"
    depends_on: ["lint"]

  - name: "review"
    agent: "agents/code-reviewer"
    description: "Perform code review"
    depends_on: ["lint", "security"]
    inputs:
      lint_results: "{{steps.lint.output}}"
      security_results: "{{steps.security.output}}"
```

### Parallel Execution

```yaml
# workflows/full-analysis.yaml
name: "Full Codebase Analysis"
description: "Run multiple analysis agents in parallel"

steps:
  - name: "parallel_checks"
    parallel:
      - agent: "agents/type-checker"
      - agent: "agents/test-runner"
      - agent: "agents/doc-checker"

  - name: "summarize"
    agent: "agents/summarizer"
    depends_on: ["parallel_checks"]
    inputs:
      results: "{{steps.parallel_checks.outputs}}"
```

### Conditional Steps

```yaml
# workflows/deploy.yaml
name: "Conditional Deploy"
description: "Deploy only if all checks pass"

steps:
  - name: "test"
    agent: "agents/test-runner"

  - name: "deploy"
    agent: "agents/deployer"
    condition: "{{steps.test.success}}"
    depends_on: ["test"]
```

## Using Commands with Claude Code

### Invoke a Command

```bash
# Run a workflow
claude "Run the code-review workflow on the current branch"

# Run with specific inputs
claude "Run deploy workflow for staging environment"
```

### Reference in Conversations

```
User: Run the code review pipeline
Claude: I'll execute the code-review workflow which will:
        1. Run linting checks
        2. Scan for security vulnerabilities
        3. Perform comprehensive code review
        [Executes workflow...]
```

### Custom Slash Commands

Register workflows as slash commands in Claude Code:

```json
// .claude/commands/review.md
Run the code review workflow from commands/workflows/code-review.yaml
Analyze all changed files and provide a summary of issues found.
```

Then invoke with:
```bash
/review
```

## Creating a New Command

### 1. Define the Workflow

```bash
touch commands/workflows/my-workflow.yaml
```

### 2. Specify Steps and Dependencies

```yaml
name: "My Workflow"
description: "What this workflow accomplishes"
version: "1.0.0"

inputs:
  - name: "target"
    description: "Target to process"
    required: true

steps:
  - name: "step1"
    agent: "agents/first-agent"
    inputs:
      target: "{{inputs.target}}"

  - name: "step2"
    agent: "agents/second-agent"
    depends_on: ["step1"]
```

### 3. Document the Command

Add to the Available Commands table in this README.

### 4. Test Locally

```bash
claude "Test the my-workflow command with target=./src"
```

## Best Practices

1. **Single Responsibility** - Each workflow should have one clear purpose
2. **Idempotency** - Workflows should be safe to run multiple times
3. **Error Handling** - Define failure behavior for each step
4. **Documentation** - Clearly describe inputs, outputs, and behavior
5. **Versioning** - Version your workflows for reproducibility
6. **Testing** - Test workflows in development before team-wide rollout

## Error Handling

```yaml
steps:
  - name: "risky_step"
    agent: "agents/deployer"
    on_failure:
      action: "rollback"
      agent: "agents/rollback-handler"
    retry:
      max_attempts: 3
      delay: "5s"
```

## Workflow Outputs

Capture and use outputs from workflows:

```yaml
outputs:
  summary: "{{steps.final.output.summary}}"
  artifacts: "{{steps.build.output.artifacts}}"
```

Access in subsequent commands or conversations:
```
The workflow completed with: {{workflow.outputs.summary}}
```
