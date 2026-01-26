# Show and Tell Presentation Agent

A comprehensive agent system for generating D365 Business Central sprint review presentations from Notion data.

## Structure

```
show-and-tell-presentation-agent/
├── agent.yaml                 # Main agent configuration
├── system.md                  # Main agent system prompt
├── README.md                  # This file
└── sub-agents/
    ├── process-flow-percentage/   # Queries Notion for completion %
    ├── requirements/              # Extracts requirements from transcripts
    ├── sprint-goals/              # Pulls sprint goals from Notion
    └── demonstration/             # Creates D365 BC demo steps
```

## Sub-Agents

| Agent | Purpose | Input | Output |
|-------|---------|-------|--------|
| **Process Flow Percentage** | Query Notion for design completion % | Sprint, grouping | Completion data |
| **Requirements** | Extract D365 BC requirements from transcripts | Process flows, transcript | Structured requirements |
| **Sprint Goals** | Pull sprint goals for process flows | Sprint, process flows | Goals with status |
| **Demonstration** | Create D365 BC demo scripts | All above data | Demo steps |

## Workflow

```
Notion Data → Sub-Agents → Aggregated Data → Presentation Agent → HTML Output
```

Run the full pipeline:
```bash
claude "Run show-and-tell-pipeline for Sprint 5, Order to Cash"
```

See: `commands/workflows/show-and-tell-pipeline.yaml`

## Output

Presentations saved to `output/` with Volt Technologies branding.
