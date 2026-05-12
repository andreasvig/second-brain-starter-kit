# tasks — task health

Reads every task file, groups by priority, sorts by due date, flags health issues.

## Arguments

- (none) — scan all tasks
- `[project-slug]` — filter to a specific project (e.g. `ape`, `translation`)

## What to do

### 1. Read all task files

Read all `.md` files in `agent_brain/tasks/`. Parse frontmatter for: `status`, `priority`, `due`, `owner`, `project`, `updated`.

### 2. Filter and classify

**Active tasks** (status: `open` or `in-progress`):
- Group by priority: P0 first, then P1, P2, P3.
- Within each priority, sort by due date (earliest first, undated last).

**Health flags**:
- **Overdue** — due date past, status not `done`/`dropped`.
- **Stale** — `updated` more than 3 days ago, status `open` or `in-progress`.
- **Blocked without explanation** — status `blocked` but body has no explanation.
- **P0/P1 without due date** — high-priority tasks should have deadlines.
- **Done recently** — completed in last 7 days (from `agent_brain/tasks/archive/`).

## Report shape

```
### Tasks

**P0 — Today** (X):
- [task] — [one-line context] [flags: OVERDUE / STALE]

**P1 — This Week** (X):
- [task] — [one-line context] [flags]

**Health**:
- Overdue: X | Stale: X | Blocked: X
- Completed this week: X

**Needs Attention**:
- [specific task]: [what's wrong and suggested action]
```

If filtered by project, only show tasks for that project.
