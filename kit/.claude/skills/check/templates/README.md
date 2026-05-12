# /check templates

The dispatcher in `../SKILL.md` classifies the descriptor and fires one or more of these templates. Each template is self-contained — it owns its own arguments, classification logic, and output format.

## Picker

| Template | When to fire | Dependency | Default args |
|---|---|---|---|
| [status](status.md) | "quick pulse", no descriptor (always fires in fan-out) | None — brain-only | — |
| [tasks](tasks.md) | "anything overdue", "task health", "tasks for project X" | None | scan all tasks |
| [calendar](calendar.md) | "what's on my schedule", "today/tomorrow/week" | Calendar MCP | today |
| [slack](slack.md) | "anyone mention me", "DMs", "channels" | Slack MCP | since:yesterday |
| [email](email.md) | "inbox", "what's pending in mail" | Email MCP | unread |

## Fan-out order

When the dispatcher fires multiple templates (no descriptor or "everything"), sections appear in the merged report in this order: **Status → Tasks → Calendar → Slack → Email**. Templates whose dependency is missing emit a one-line skip note and don't take a section.

## Adding a new template

1. Drop a new `.md` file in this folder following the same skeleton as the existing templates: frontmatter-free, `## Arguments` / `## What to do` / `## Report shape`.
2. Add a row to the picker above and a row to the table in `../SKILL.md`.
3. Add the keyword(s) the dispatcher should match to the classification logic in `../SKILL.md` step 1.
