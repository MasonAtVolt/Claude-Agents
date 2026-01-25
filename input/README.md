# Input Directory

Temporary storage for files and content to be processed by agents.

## Purpose

Place source materials here for agents to consume:
- Documents to analyze
- Content to transform
- Files to process
- Data to convert

## Usage

```bash
# Example: Add content for the presentation agent
cp my-report.md input/

# Run the agent
claude "Create a presentation from input/my-report.md"
```

## Cleanup Policy

**Files in this directory are temporary and will be deleted after processing.**

- Input files are consumed by agents during execution
- Clean up regularly to avoid clutter
- Do not store permanent files here

## Git Behavior

This directory is tracked but its contents are ignored:
- The folder structure is preserved
- Actual input files are not committed
- Keeps the repo clean while maintaining the workflow

## Supported Input Types

| Type | Extensions | Example Agents |
|------|------------|----------------|
| Text | `.txt`, `.md` | Presentation, Summary |
| Documents | `.pdf`, `.docx` | Analysis, Extraction |
| Data | `.json`, `.csv` | Report, Visualization |
| Code | `.py`, `.js`, etc. | Review, Documentation |
| URLs | (inline) | Web scraping agents |
