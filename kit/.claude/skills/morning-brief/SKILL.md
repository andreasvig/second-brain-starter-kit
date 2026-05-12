---
name: morning-brief
description: "Proactive ingestion + briefing dispatcher. Run on demand — no fixed cadence; the 'morning' name reflects a typical use case, not a schedule. Default fans out across all enabled phases — briefing (calendar/tasks/slack/email via /check + remsleep follow-up + upcoming + chosen rituals), research (pull from a user-defined external research source), feeds (user-defined newsletters/RSS/etc.), news (scan a domain, knowledge-sync, propose, draft). Each run windows from the last `/morning-brief` run (fallback: 7 days). Pass a phase name to run just that phase. Phases live in phases/."
---

# /morning-brief — Proactive ingestion + briefing dispatcher

> Main skill. The entry point for proactive ingestion. The vision: `/morning-brief` is where the assistant goes out of its way to ingest info from sources you've defined — newsletters, podcasts, AI news, calendar, slack — and gives you one merged briefing. Run it whenever you want orientation; the name is a workflow suggestion, not a clock.

## How it works

User calls `/morning-brief` with either no descriptor (run every enabled phase in order) or a descriptor like `/morning-brief news`, `/morning-brief feeds`, `/morning-brief research`. The dispatcher classifies the descriptor, runs the matching phase(s), and returns the merged output.

Phases live in `phases/`:

| Phase | What it does | Gating |
|---|---|---|
| `briefing` | Calendar + tasks + slack + email via `/check` + remsleep follow-up + upcoming (next 24h) + chosen rituals | None — always runs in fan-out |
| `research` | Pulls from a user-defined external research source (S3 bucket, API, scraped page, cron-output dump). Empty placeholder — user fills in during setup if they have a research feed | Config flag `daily_research: true` |
| `feeds` | Ingests user-defined newsletters/RSS/substacks/podcasts/YouTube channels listed in `agent_brain/about_user/feeds.md` | Config flag `feeds: true` |
| `news` | Scan-and-draft pattern for a topical post (e.g., daily AI news to a Slack channel, daily real-estate digest, daily industry commentary). User customizes domain + voice + output during setup | Config flag `news_scan: true` |

## Procedure

### 1. Classify the descriptor

- **No descriptor** → run every enabled phase in order: `briefing` → `research` → `feeds` → `news`. Skip phases whose config flag is false.
- **Single phase name** (`briefing`, `research`, `feeds`, `news`) → run just that phase, passing the rest of the descriptor as its argument (e.g., `/morning-brief research 2026-04-15` → research phase with date `2026-04-15`).
- **Free-form descriptor** → infer the closest phase. "give me the brief" → fan out. "news of the day" → `news`. "fetch newsletters" → `feeds`. "pull today's research" → `research`.

### 2. Resolve the time window

Find the last `/morning-brief` run by reading `artifacts/_changelog.md` for the most recent `## [YYYY-MM-DD] morning-brief |` entry. Window all source reads (changelog, recent activity, slack/email backfill, etc.) to `[last_run, now]`. Fallback: last 7 days if no prior run is found. Phases inherit this window unless they explicitly redefine their own.

### 3. Apply user cadence preferences

Some users post on weekdays only (the `news` phase often shouldn't draft on weekends). This is a *user preference* captured in setup, not a hard cadence assumption built into the skill. Default: weekend skips `news` drafting (still runs scan + knowledge-sync if configured for it).

Single-phase invocation overrides defaults: `/morning-brief news` on a Saturday still drafts if explicitly asked.

### 4. Resolve dependencies

When firing single phases, some phases auto-trigger their prerequisites:

- `news` auto-triggers `research` (if `daily_research: true`) and `feeds` (if `feeds: true`) before running, so its scan has cross-source context.
- `feeds` and `research` are independent — calling either standalone runs only that phase.
- `briefing` is independent — purely orientation, doesn't need other phases.

### 5. Fire phases

Read the phase files from `phases/`. Each phase owns its own logic, output, and edge cases. Run them in fan-out order; phases later in the chain see earlier phases' content already in context (research and feeds seed news).

### 6. Merge the output

When fanning out, present sections in order: **Briefing**, **Research**, **Feeds**, **News**. Skipped phases get a one-line note ("research skipped — `daily_research: false`" or "research skipped — weekend").

When firing a single phase, the output is just that phase's report — no wrapper sections.

### 7. Log the run

Append to `artifacts/_changelog.md` so the next `/morning-brief` can window from this run:

```
## [YYYY-MM-DD] morning-brief | <one-line summary of phases that ran and headline takeaway>
```

Always log, even on single-phase invocations and even when phases were skipped — the windowing depends on this entry.

## Notes

- The phase pattern matches `/check` (templates/) and `/ingest` (templates/) — same registry-with-dispatcher shape, just named "phases" because each is a stage in the dispatcher's sequential fan-out.
- **Adding a new phase**: drop a new `.md` file in `phases/`, add a row to the table above and to `phases/README.md`, add a config flag if optional, add a descriptor keyword to step 1's classification.
- **Adding a feed** (newsletter, RSS, podcast): edit `agent_brain/about_user/feeds.md` — that's the registry the `feeds` phase reads. Don't hardcode URLs in `news.md`.
- **Customising the news phase**: the kit ships a generic skeleton. During setup or later, the user fills in their domain (AI? real estate? politics?), voice (defined in `identity.md` / `about_user/`), and output format (Slack post? LinkedIn? email digest?).
- Config flags live in `.claude/constitution/config.yaml`: `news_scan`, `daily_research`, `feeds`, plus `self_reflection` (read by `briefing` for the reflection nudge) and the lighter ritual flags (`gratitude`, `daily_curiosity`, etc.) which `briefing` reads.
