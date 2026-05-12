---
summary: "How the morning / mid-day / substantial-work consolidation skills are designed to work, and when to use which."
---

# Daily rhythm

Three touchpoints keep the system oriented. Each has a different cost and trigger; running one doesn't imply running the others.

| Skill | When | Cost | Scope |
|---|---|---|---|
| `/morning-brief` | When you want orientation (typically morning) | ~30s, MCP calls | `/check` fan-out + chosen rituals |
| `/check` | Mid-day, ad-hoc | varies | Default: status + every connected stream. `/check status` = brain-only pulse; `/check tasks`/`calendar`/`slack`/`email` = one stream |
| `/remsleep` | When consolidation feels overdue | Minutes, multi-agent | Cleanup, replay, synthesis, sweep, rollup, lint, reflection |

## Morning

`/morning-brief` is a **phased dispatcher**. With no descriptor it runs every enabled phase in order; pass a phase name to run just that phase.

**Phases**:

- **`briefing`** — calendar + tasks + slack + email via `/check`, plus remsleep follow-up, recent changes since last brief, upcoming-24h preview. Always runs. Light rituals (gratitude, daily curiosity, habit check-in, project pulse, tracked-people pulse, weekly review nudge, self-reflection nudge) live as inline blocks here, gated on config flags.
- **`research`** *(optional)* — pull from a user-defined external research source (S3 bucket, API, daily report). Skeleton — fill in during setup if you have one.
- **`feeds`** *(optional)* — ingest user-defined newsletters / RSS / substacks / podcasts / YouTube channels. The list lives in `agent_brain/about_user/feeds.md` (not config.yaml — it's a structured data file you can edit directly or grow by saying *"add X to my feeds"*).
- **`news`** *(optional)* — scan-and-draft for a topical post in your domain (AI, finance, climate, real estate, your industry). Reads feed content, syncs against your durable positions, proposes 2–5 candidates, drafts the top pick. The kit ships a generic skeleton; you customize domain + voice + output format during setup.

Single-phase invocation:

- `/morning-brief briefing` — just the orientation report
- `/morning-brief feeds` — just feed ingestion
- `/morning-brief news` — just the editorial flow (auto-runs research + feeds first if enabled)
- `/morning-brief research [date]` — pull a specific day's research

Adding a new phase is dropping a new `.md` file in `phases/` plus a config flag.

## Mid-day

`/check` is the read-only inspection skill. Two common shapes:

- **`/check status`** — brain-only fast pulse (tasks-by-priority + last 5 changelog entries). No MCP calls, under 20 lines, runs in <5s.
- **`/check`** with no descriptor — fans out across status + every connected stream (calendar, slack, email if configured). One report, much lighter than `/morning-brief` but more than the brain-only pulse.

You can also target a single stream: `/check tasks`, `/check calendar tomorrow`, `/check slack since:2026-05-01`. Read-only by design — never creates tasks, sends messages, or marks-as-read.

The assistant offers `/check status` proactively when:
- You return after a gap of ~2+ hours in the same session
- A chunk of work just completed and the next step isn't obvious
- You ask something that implies re-orienting ("what's on my plate?", "where are we?")

If `/morning-brief` or `/remsleep` ran in the last ~2 hours, the offer is skipped.

## Consolidation

`/remsleep` is multi-phase, multi-agent. **Workflow suggestion, not a schedule** — run it when consolidation feels overdue. Often at the end of a productive day, or less frequently if recent sessions were light. With no descriptor it runs the full consolidation/reporting set: cleanup, replay, synthesis, sweep, rollup, lint, and (if enabled) reflection. Each run windows from the last `/remsleep` run (fallback: 7 days).

| Phase | Does | Output |
|---|---|---|
| Cleanup | Process unprocessed transcripts, fix broken links, reconcile `_index.md`, flag stale tasks, enumerate `/learn` output since last remsleep | Light tactical fixes |
| Replay | Read conversation log + changelog since last remsleep. Extract decisions, themes, shifts | Brain updates |
| Synthesis | Create knowledge pages, find long-range connections, promote `/learn` output, detect skill candidates | New durable pages |
| Mechanical sweep | Hub reconciliation, lateral-linking back-fill | Graph maintenance |
| Rollup | Compile activity since the last `/remsleep` run into a progress report | `artifacts/reports/rollup-YYYY-MM-DD.md` |
| Lint | Deep brain health check across links, frontmatter, orphans, stale hubs, and content quality | Fixes + review flags |
| Reflection | (Gated on `self_reflection: true`) Generate 3–5 targeted questions about the user's patterns and priorities | `agent_brain/about_user/reflections/questions.md` |

This is the heavier pass that keeps the brain from drifting. Do not run it reflexively after quiet days; run it when there is enough new work to consolidate.

## When to skip

- **Skip `/morning-brief`** on a session you don't need orientation for — short tactical work, an in-progress task, or any time the value of the brief doesn't justify the ~30s.
- **Skip `/check status`** if you ran `/morning-brief` recently and nothing material has changed.
- **Skip `/remsleep`** after quiet or tactical days. Run it after substantial work, especially when decisions, new source material, project movement, or several `/learn` updates accumulated.
