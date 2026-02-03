# Shadowing Presentation Agent

A comprehensive agent system for generating D365 Business Central shadowing meeting presentations with questions derived from Notion process flows.

## Purpose

During D365 Business Central implementations, consultants conduct **shadowing sessions** with customers to understand their current business processes. This agent generates professional HTML presentations containing targeted questions that consultants use to facilitate these meetings.

## Structure

```
shadowing-presentation-agent/
├── agent.yaml                     # Main agent configuration
├── system.md                      # Main agent system prompt
├── README.md                      # This file
└── sub-agents/
    ├── shadowing-question-generator/  # Generates questions from process flows
    │   ├── agent.yaml
    │   └── system.md
    └── presentation-creator/          # Creates the HTML presentation
        ├── agent.yaml
        └── system.md
```

## Sub-Agents

| Agent | Purpose | Input | Output |
|-------|---------|-------|--------|
| **Shadowing Question Generator** | Generate 4-10 questions per process flow from Notion data | Process flows from Notion | Structured questions JSON |
| **Presentation Creator** | Create branded HTML slideshow | Questions + context | HTML presentation file |

## Workflow

```
Notion Process Flows → Question Generator → Presentation Creator → HTML Output
```

### Pipeline Flow

1. **Query Notion** for process flows in the specified grouping
2. **Generate Questions** (4-10 per process flow) covering:
   - Current state discovery
   - Volume and frequency
   - Pain points and challenges
   - Requirements and expectations
   - Integration and data needs
3. **Create Presentation** with Volt Technologies branding
4. **Output HTML** to the `output/` directory

## Usage

### Run the full pipeline:
```bash
claude "Run shadowing-pipeline for White Warren, Inventory Management process flows"
```

### Direct agent invocation:
```bash
claude "Create a shadowing presentation for Order to Cash process flows"
```

See: `commands/workflows/shadowing-pipeline.yaml`

## Question Categories

Questions are generated across these categories:

1. **Current State Discovery** - Understanding existing processes
2. **Volume & Frequency** - Transaction volumes and patterns
3. **Pain Points & Challenges** - Current system limitations
4. **Requirements & Expectations** - Desired improvements
5. **Integration & Data** - System connections and migration needs

## Example Questions

**Location Management:**
- "Please showcase how your current warehouse locations, zones, bins, aisles, and racks are managed today"
- "How do you track which products are stored in which locations?"

**Sales Order Processing:**
- "Walk me through how a sales order is created from customer request to shipment"
- "How do you currently handle credit checking and approval processes?"

## Output

Presentations are saved to `output/` with Volt Technologies branding:
- Format: `{client}-shadowing-{process-group}-{date}.html`
- Example: `white-warren-shadowing-inventory-management-2026-02-03.html`

## Notion Integration

The agent connects to Notion via MCP server to fetch process flow data:
- Process flow names and descriptions
- Sub-processes and related items
- Categories and groupings
- Implementation status

## Brand Compliance

All presentations follow Volt Technologies brand guidelines:
- Black/white/gold color scheme
- Montserrat headings, Fira Sans body text
- Official logo assets (never recreated)
- Professional, minimalist design
