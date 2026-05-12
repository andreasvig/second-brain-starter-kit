# /remsleep phases

The dispatcher in `../SKILL.md` decides which phases to fire based on descriptor + config flags. Each phase is self-contained — its own agent, logic, output.

Replaces the old `/remsleep` (4-phase pipeline) + `/weekly` + `/lint-wiki` trio. One entry point.

## Picker

| Phase | What it does | Default | Agent | Gating |
|---|---|---|---|---|
| [cleanup](cleanup.md) | Process transcripts, fix broken links, reconcile index, flag stale tasks, enumerate `/learn` since last remsleep | yes | sonnet | — |
| [replay](replay.md) | Read conversation + changelog + meetings since last remsleep, extract decisions/themes/shifts | yes | opus | — |
| [synthesis](synthesis.md) | Create knowledge pages, long-range links, themes, `/learn` promotion, skill-candidate detection. Must produce or explicitly pass | yes | opus | — |
| [sweep](sweep.md) | Hub reconciliation, linking search, lateral back-fill. Mechanical execute, hub-first paradigm | yes | opus | — |
| [rollup](rollup.md) | Progress report covering activity since the last `/remsleep` run (fallback: 7 days) → `artifacts/reports/rollup-YYYY-MM-DD.md`. No day-of-week gating. | yes | opus | — |
| [lint](lint.md) | Deep brain health check via 5–8 parallel scouts (frontmatter / link integrity / orphans / staleness / content quality / cross-refs / naming / hub health) | yes | opus + scouts | — |
| [reflection](reflection.md) | 3–5 targeted reflection questions written to `reflections/questions.md`. Sequential after replay/synthesis/sweep | yes | opus | `self_reflection: true` |

## How the dispatcher fires phases

`/remsleep` (no descriptor) — run the full consolidation/reporting set after substantial work:

- **Parallel** — cleanup, replay, synthesis, sweep, rollup, and lint.
- **Sequential** — reflection runs after replay/synthesis/sweep (gated on `self_reflection`).
- **No day-of-week special behavior** — `/remsleep` is user-invoked, not a scheduler.

`/remsleep quiet` — same as default but skip the interactive report.

## Parallelism

Default phases (cleanup, replay, synthesis, sweep, rollup, lint) run in parallel. Reflection is the only sequential phase — it reads the others' output to write good questions.

```
parallel: cleanup, replay, synthesis, sweep, rollup, lint
sequential: reflection (gated on self_reflection)
```

## Adding a new phase

1. Drop a new `.md` file in this folder following the same skeleton: frontmatter (phase / default / agent / gating) + `## What to do` + `## Output`.
2. Add a row to the picker above and the table in `../SKILL.md`.
3. Decide whether it belongs in the default full set and document any gating in the phase frontmatter.
