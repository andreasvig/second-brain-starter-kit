# Tasks

## Role of `agent_brain/tasks/`

- The user's execution layer, living inside the durable brain.
- Both the user and the assistant can edit it.
- Active task files live under `agent_brain/tasks/`.
- Done and dropped tasks are archived under `agent_brain/tasks/archive/`.

## Task frontmatter

```yaml
type: task
summary: ""
status: open | in-progress | blocked | done | dropped
priority: p0 | p1 | p2 | p3
due: YYYY-MM-DD       # optional — only real deadlines
owner: {{USER_NAME}}
project: project-slug # optional
category: feature | review | learning | admin | other
source: manual | meeting | ingest | remsleep | lint
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [task]
```

Priority mapping:

- **P0** — today, do now
- **P1** — this week
- **P2** — this month
- **P3** — backlog

## Relationship to the brain

- Tasks should usually link to the relevant `agent_brain/` page or pages.
- Important `agent_brain/` pages should point back to active tasks when navigation benefits.
- Tasks hold execution state. The brain holds durable understanding.

## Creation rules

- Create a task when there's a real action to take, not just an interesting unknown.
- Unknowns belong in `agent_brain/understanding/unknowns/` by default.
- Create both a knowledge page and a task only when uncertainty has a concrete next step and urgency.

## Editing rules

- Preserve useful task history unless there's a clear reason to rewrite.
- Keep task context linked to the relevant durable pages so execution doesn't drift from understanding.

## Lifecycle

Tasks flow: **open** → **in-progress** → **done** (or **dropped** / **blocked**).

- The assistant creates tasks from meetings, raw-source ingest, consolidation scans, or on request.
- The morning briefing surfaces P0/P1 tasks and flags overdue items.
- Consolidation flags stale tasks (unchanged 3+ days) and suggests priority adjustments.
