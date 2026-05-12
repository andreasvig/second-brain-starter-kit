---
name: remsleep
description: "On-demand brain consolidation dispatcher. Workflow suggestion, not a schedule — invoke when consolidation feels overdue (e.g., after substantial work, end of a productive day, or less frequently). Each run windows from the last `/remsleep` run (fallback: 7 days) and always fires the full set: cleanup (Sonnet), replay/synthesis/sweep/rollup/lint (Opus, parallel), reflection (Opus, sequential, gated on self_reflection). Replaces the older /weekly and /lint-wiki skills as one unified consolidation action."
---

# /remsleep — Brain consolidation dispatcher

> Main skill. Multi-agent, phased dispatcher. Workflow suggestion: run after substantial work has accumulated. Not a daily ritual — invoke when consolidation feels overdue. Phase names borrow from sleep biology (cleanup, replay, synthesize, sweep, report, audit, reflect) for memorability, not because the skill needs to run while you sleep.

<!-- Config: adapt these during setup -->
<!-- timezone: {{TIMEZONE}} -->
<!-- user_folder: {{USER_NAME}} -->

## How it works

The user calls `/remsleep` after substantial work has been done — often at the end of a productive day, or less frequently if the recent sessions were light. Run the full consolidation/reporting set.

Phases live in `phases/` — one self-contained file each. See `phases/README.md` for the picker.

| Phase | What it does | Default | Gating |
|---|---|---|---|
| `cleanup` | Process transcripts, fix broken links, reconcile index, flag stale tasks, enumerate `/learn` output since last remsleep | yes | — |
| `replay` | Decisions, themes, shifts, missed action items since last remsleep | yes | — |
| `synthesis` | Knowledge pages, long-range links, `/learn` promotion, skill-candidate detection. Must produce or explicitly pass | yes | — |
| `sweep` | Hub reconciliation → linking search → lateral back-fill (hub-first paradigm) | yes | — |
| `rollup` | Progress report covering activity since the last `/remsleep` run (fallback: 7 days) → `artifacts/reports/rollup-YYYY-MM-DD.md`. No day-of-week gating. | yes | — |
| `lint` | Deep brain health check via 5–8 parallel scouts | yes | — |
| `reflection` | 3–5 targeted questions for the user | yes | `self_reflection: true` |

## Procedure

### 1. Interpret the request

- Default behavior is always the full consolidation/reporting set.
- `quiet` means run the full set but skip the interactive report.
- If the user asks for audit, rollup, cleanup, synthesis, or reflection in the context of remsleep, keep `/remsleep` unified: run the full set and emphasize the requested section in the merged report.

### 2. Pick phases (fan-out mode)

Default `/remsleep` always runs the full set:

- `cleanup`, `replay`, `synthesis`, `sweep`, `rollup`, and `lint`.
- `reflection` also runs if `self_reflection: true`.

Do not add day-of-week special behavior. The skill is user-invoked, not a daily scheduler.

### 3. Fire phases

Spawn subagents per the phase frontmatter:

- `cleanup` → Sonnet (fast, mechanical)
- `replay`, `synthesis`, `sweep`, `rollup`, `lint` → Opus (`lint` internally spawns 5–8 scout agents)
- `reflection` → Opus, **sequential — runs after replay/synthesis/sweep complete** (it reads their output)

```
parallel: cleanup, replay, synthesis, sweep, rollup, lint
sequential: reflection (after replay + synthesis + sweep return)
```

Each phase reads its own `phases/<name>.md` and produces its own output section.

### 4. Cleanup → synthesis hand-off

`cleanup` produces the `/learn` inventory since the last remsleep run (pages created/updated, tasks created, memory entries). `synthesis` reviews it for promotion / duplicate-flagging / memory-overlap detection. Both phases also have direct access to `_changelog.md`, so the hand-off is a coordination convention, not a hard data dependency.

### 5. Merge the output

Collect outputs and write the report to `artifacts/remsleep/YYYY-MM-DD.md` (unless `quiet`):

```
## Remsleep — [date]

### Cleanup
[Fixes, flags]

### Work window
[Themes, decisions, shifts]

### Knowledge
[Pages created, connections, emerging themes, /learn page promotions]

### Sweep
[Hub additions, linking search, lateral back-fill counts]

### Rollup
[Headline takeaways + path to rollup report]

### Lint
[Auto-fixes summary + items flagged for review + brain stats]

### Questions for you   (only if self_reflection: true)
[Render each of the 3–5 reflection questions in full here — context + options + lean. Do NOT abbreviate to a pointer ("see questions.md") or a one-line summary. The chat is the source of truth; questions.md is durable bookkeeping for cross-session continuity, not where the user reads them.]

### Needs attention
[Items requiring human judgment]
```

Append to `artifacts/_changelog.md`:

```
## [YYYY-MM-DD] remsleep | Brain consolidation
[Brief summary of consolidation, rollup, lint findings, and any reflection questions]
```

## Why phases instead of in-file Phase 1/2/3a/3b/4

Same dispatcher pattern as `/morning-brief`, `/check`, `/ingest`. Each phase is self-contained, edits to one phase don't touch others, adding a phase is dropping a file. The split also lets `/weekly` and `/lint-wiki` collapse in cleanly as phases rather than separate slash commands.

## Why synthesis and sweep are split

Phase 3 used to carry both interpretive synthesis and mechanical sweeps. With finite token budget per phase, mechanical work crowds out interpretive work. `synthesis` is now isolated and **must produce or explicitly pass with a one-line reason**; `sweep` is isolated and biases to execute, high volume OK. Don't let mechanical edits disguise an empty synthesis.

## Notes

- Think first, act second. One important insight beats 50 checkboxes.
- Additive — never deletes brain content.
- Knowledge pages should be concise — key insight + links.
- Questions should make the user think, not make them work.
- Adding a new phase: drop a new `.md` file in `phases/`, add a row to the table above and to `phases/README.md`, and document default membership + gating in the phase frontmatter.
