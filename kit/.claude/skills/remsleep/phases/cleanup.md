---
phase: cleanup
default: true
agent: sonnet
---

# cleanup — light sleep

Mechanical hygiene. Fast pass. Sonnet is enough.

## What to do

- Process unprocessed transcripts in `raw/meetings/` (compare against `artifacts/_ingest-log.md`).
- Fix broken `[[wiki-links]]`.
- Reconcile `agent_brain/_index.md` with files on disk.
- Flag overdue and stale tasks.
- **Enumerate `/learn` output since the last remsleep run**: scan `artifacts/_changelog.md` for entries tagged `enrich | /learn` since the most recent `## [YYYY-MM-DD] remsleep | Brain consolidation` entry (or the older `End-of-day consolidation` label if present), or since the most recent date-stamped file in `artifacts/remsleep/`. List pages created/updated, tasks created, memory entries added. Pass this inventory to the synthesis phase for review — don't act on it here.

## Output

Fixes made, issues flagged, `/learn` inventory since last remsleep (for synthesis). State the window explicitly (e.g. "Window: 2026-05-04 → 2026-05-06").
