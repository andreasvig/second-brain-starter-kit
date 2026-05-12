---
phase: replay
default: true
agent: opus
---

# replay — processing the work window

Read the conversation log + changelog + meetings processed **since the last remsleep run**.

## Scope window

The window is `[last_remsleep_date, today]`, inclusive of both ends. Compute `last_remsleep_date` as:

1. The most recent date-stamped file in `artifacts/remsleep/YYYY-MM-DD.md` excluding today's report if already written, OR
2. The most recent `## [YYYY-MM-DD] remsleep | Brain consolidation` entry in `artifacts/_changelog.md` (or the older `End-of-day consolidation` label if present).

If neither exists, default to "yesterday" so a fresh vault still gets a sensible window.

Why since-last-remsleep, not since-yesterday: remsleep doesn't run every day. A Sunday remsleep + a quiet Monday + a heavy Tuesday + a Wednesday remsleep means Tuesday gets missed under "today only" scoping. The window must close the actual gap.

## What to do

Extract over the window:

- Decisions made → update brain pages
- Topics that came up repeatedly → need brain pages?
- Shifts in priorities, timelines, understanding
- Missed action items → create tasks
- New context about people or projects → update pages

## Output

Themes, decisions, brain updates over the window. State the window explicitly in the report (e.g. "Window: 2026-05-04 → 2026-05-06, 3 days").
