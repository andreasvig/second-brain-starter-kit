# status — brain-only pulse

Fast read-only dashboard. No MCP calls. Target: under 20 lines of output.

## Arguments

None.

## What to do

### 1. Tasks

Read all task files from `agent_brain/tasks/` where status is `open`, `in-progress`, or `blocked`.

- **P0 — Today:** list all. If none, note it.
- **P1 — This Week:** list all. Flag overdue.
- **Blocked:** list with blockers.
- **Recently Completed:** tasks marked `done` in the last 3 days (also check `agent_brain/tasks/archive/` if it exists).

### 2. Hiring pipeline (if `hiring` is enabled in `.claude/constitution/config.yaml`)

Read `agent_brain/_index.md` active pipeline section. Show candidates by stage.

### 3. Recent activity

Read last 5 entries from `artifacts/_changelog.md`.

## Report shape

```markdown
## Status — YYYY-MM-DD HH:MM

### Tasks
| Priority | Count | Overdue |
|----------|-------|---------|
| P0 | N | N |
| P1 | N | N |
| Blocked | N | — |

[List P0 and blocked tasks by name]

### Recent
[Last 3-5 changelog entries, one line each]
```

## Notes

- Brain-only. For calendar / slack / email, the dispatcher fires the corresponding template alongside this one.
- Read-only — never creates tasks, writes pages, or changes state.
