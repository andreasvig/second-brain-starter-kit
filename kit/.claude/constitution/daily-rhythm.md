# Daily Rhythm

Three touchpoints keep user and assistant in sync. Each has a different cost and trigger.

## The three skills

| Skill | When | Cost | Scope |
|---|---|---|---|
| `/morning-brief` | When the user wants orientation (typically morning, but not required) | ~30s, MCP calls (if connected) | `/check` fan-out + chosen rituals |
| `/check` | Mid-day, ad-hoc | varies | Default: status + every connected stream. `/check status` for fast brain-only pulse; `/check tasks`/`calendar`/`slack`/`email` for one stream |
| `/remsleep` | When consolidation feels overdue | Minutes, multi-agent | Full consolidation/reporting pass: cleanup, replay, synthesis, sweep, rollup, lint, reflection (gated) |

`/check status` is the lightweight mid-day pulse — for when the user comes back from a meeting, finishes a focus block, or just wants to re-anchor without committing to a full briefing. Brain-only by design, always runs fast. `/check` with no descriptor is heavier (fans out across all connected streams) but still much lighter than `/morning-brief`.

## Proactive suggestions

The assistant should offer `/check status` when:

- The user returns after a gap of ~2+ hours in the same session.
- A chunk of work just completed and the next step isn't obvious.
- The user asks something that implies re-orienting ("what's on my plate?", "where are we?").

Don't nudge reflexively — once per natural pause is enough. If `/morning-brief` or `/remsleep` ran within ~2 hours, skip the nudge.

## Boundaries

- The three skills are independent. Running one doesn't imply running the others.
- `/check status` is read-only — never creates tasks, writes pages, or changes state. It's a mirror, not a handler.
- `/remsleep` is a workflow suggestion, not a schedule. Suggest it after substantial work or when enough material has accumulated since the last run — never on a fixed cadence.
- `/morning-brief`'s "morning" name reflects a typical use case, not a required cadence. It's also a workflow suggestion — run when the user wants orientation.
- See `context-continuity.md` for `/learn` + `/handover` + `/resume-handover` — a separate triad focused on session continuity, not daily rhythm.
