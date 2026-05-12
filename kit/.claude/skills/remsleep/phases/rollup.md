---
phase: rollup
default: true
agent: opus
---

# rollup — progress report

Aggregate recent activity into a concise progress report — the durable, portable since-last-run snapshot of tasks/projects/risks/learning. Replaces the standalone `/weekly` skill (now retired); integrated into remsleep so every full pass includes reporting.

Runs as part of every `/remsleep` full pass. No day-of-week gating, no cadence assumption — the phase simply windows from the last `/remsleep` run.

## What to do

### Step 1 — Gather the activity since last remsleep

**Time range**: from the last `/remsleep` run (read the most recent `## [YYYY-MM-DD] remsleep |` entry in `artifacts/_changelog.md`) through now. Fallback: last 7 days if no prior run is found.

**Read**:
- `artifacts/_changelog.md` — all entries in the time range
- `agent_brain/tasks/` — tasks created, completed, or status-changed in the window
- `agent_brain/tasks/archive/` — archived in the window
- Active project pages — status changes (compare frontmatter `updated` dates)
- `artifacts/remsleep/` — remsleep reports from the window
- Risk register (if exists) — any changes in the window

### Step 2 — Compile sections

- **Tasks**: Completed, still open P0/P1, created, overdue.
- **Project Progress**: What moved forward, key decisions, blockers.
- **Hiring Pipeline** *(only if `hiring: true` in config.yaml)*: Candidates advanced/rejected, interviews conducted, pipeline state.
- **Risks & Strategy**: Risk register changes, milestone proximity.
- **Learning**: New patterns or standards pages created in `agent_brain/understanding/`.

### Step 3 — Write the report

Output to `artifacts/reports/rollup-YYYY-MM-DD.md`:

```markdown
---
type: report
date: YYYY-MM-DD
period: "YYYY-MM-DD to YYYY-MM-DD"
updated: YYYY-MM-DD
tags: [report, rollup]
---

# Rollup — YYYY-MM-DD

## Summary
[3-5 bullet points: headline takeaways]

## Tasks
[Completed, open P0/P1, overdue]

## Projects
[Progress, decisions, blockers]

## Hiring                ← only if hiring flag is true

## Risks

## Learning

## Up Next
[What's coming: deadlines, priorities]
```

### Step 4 — Update tracking

The orchestrator appends to `artifacts/_changelog.md` after the phase returns.

## Notes

- Synthesize, don't dump. "3 tasks overdue, all on the same project" beats listing 3 tasks.
- Use the since-last-remsleep window unless the user asks for a different one.

## Output

Path to the rollup report file + 3–5 line summary for the orchestrator's chat report.
