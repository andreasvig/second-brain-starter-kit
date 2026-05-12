---
summary: "Catalog of all shipped skills, grouped by tier — what each does and when to invoke it. This file is the single source of truth for tier assignment (core vs optional vs utility) — all skills live flat at .claude/skills/<name>/ on disk because Claude Code only discovers skills one level deep."
---

# Skills catalog

Two tiers shipped today. Core ships always; Optional installs based on which tools you use. Utility is reserved for future generic skills (image gen, diagrams, slides, video). Disabled skills live at `.claude/skills-disabled/<name>/` (outside the discovery tree).

## Core (always installed) — 8 skills

The minimum viable system. Every user needs these.

### Daily rhythm

- **`/morning-brief`** — proactive ingestion + briefing dispatcher. Workflow suggestion, not a schedule — the "morning" name reflects a typical use case, not a required cadence. Each run windows from the last `/morning-brief` run (fallback: 7 days). Default fans out across every enabled phase: `briefing` (calendar/tasks/slack/email via `/check` + remsleep follow-up + upcoming-24h + chosen light rituals), `research` (pull from a user-defined research source), `feeds` (ingest user-defined newsletters/RSS/podcasts/etc.), `news` (scan-and-draft for a topical post in the user's domain). Pass a phase name to run just that phase: `/morning-brief feeds`, `/morning-brief news`, etc. Phases live in `.claude/skills/morning-brief/phases/`; add a new ingestion stream by dropping a file there. The `feeds` phase reads `agent_brain/about_user/feeds.md` — that's the registry, not config.yaml.
- **`/check`** — read-only inspection dispatcher. Default fans out across every available stream (status + tasks + calendar + slack + email — whichever are connected). Pass a descriptor for one stream: `/check status` (brain-only pulse, under 20 lines, no MCP), `/check tasks`, `/check calendar tomorrow`, `/check slack`, `/check email`. Templates live in `.claude/skills/check/templates/`; add a new stream by dropping a file there.
- **`/remsleep`** — on-demand consolidation dispatcher. Workflow suggestion, not a schedule — run when consolidation feels overdue (often after substantial work or at the end of a productive day). It runs the full report set: cleanup, replay, synthesis, sweep, rollup, lint audit, and reflection if enabled. Phases live in `.claude/skills/remsleep/phases/`; add a new phase by dropping a file there and documenting whether it belongs in the default full set.

### Tasks

- **`/create-task`** — create a new task file with complete frontmatter, wiki-linked body, and a changelog entry. Triggered by "add a task", "track this", "remind me to".

### Knowledge

- **`/ingest`** — process any raw source from `raw/` into brain pages and/or artifacts with provenance. Classifies the source and picks one of the templates in `templates/` (meeting, self-reflection, article, journal, export, general); applies hub-update + linking search regardless of template. Add new templates by dropping a file in `templates/` and updating the picker.

> Note: deep brain audit and progress rollup are no longer separate skills (the old `/lint-wiki` and `/weekly` commands) — they're phases inside `/remsleep`. The user-facing action is one command.

### Context continuity (bridges `/compact`)

- **`/learn`** — pre-compact knowledge distillation. Scans the session, classifies preservation candidates into brain updates, understanding pages, tasks, memory, and skill candidates. Writes with provenance, marks `.last-learn`.
- **`/handover`** — pre-compact task-state capture. Writes a detailed handover doc (goal, what's been tried, current state, next step, gotchas) for the next session to pick up.
- **`/resume-handover`** — post-compact rehydration. Reads `artifacts/handovers/latest.md`, summarizes goal and next step, checks freshness, confirms readiness.

## Optional (most users want) — 2 skills

Installed by default; the setup interview gates each on whether the relevant tool is connected. Connection-gated read-only checks (calendar, slack, email) are not separate skills — they're templates inside `/check` that fire when their MCP is connected and skip otherwise. Wire up the corresponding MCP and they light up automatically.

### Meetings & audio

- **`/prep`** — pre-meeting briefing. Gathers brain context on attendees and open threads, produces an under-30-line brief saved to `artifacts/briefs/`.
- **`/transcribe`** — audio → text transcript in `raw/`. Takes a recording, matches it to a calendar event for attendee context if possible, transcribes, saves the transcript, then offers to chain into `/ingest` for processing into the brain. (For text transcripts that already exist, skip this and call `/ingest` directly — it'll classify as a meeting and use the meeting template.)

## Utility (ship disabled, activate on demand) — 2 shipped

Generic creative-output skills. Ship at `.claude/skills-disabled/<name>/` so they don't clutter the slash-command picker until the user wants them. Activate with *"activate <name>"* — the agent moves the folder into `.claude/skills/<name>/` and the slash command lights up.

- **`/draw-diagrams`** — produce hand-drawn-style architecture/flowchart/pipeline diagrams as editable `.excalidraw` files (with PNG previews). Three styles (engineering-whiteboard / academic / cartoon-simple). The Excalidraw output is editable afterward; `.png` is the preview. Requires `npm install -g excalidraw_export && brew install librsvg` before first build. Chain partner of `/replicate` graph-prettify templates.
- **`/replicate`** — generic wrapper for any Replicate model via curl + REST (text-to-image, image edit, text-to-video, image-to-video, TTS, music, upscale). Picks workhorse vs cheap tier automatically based on batch size; routes to opinionated templates when one matches (`cinematic-photography`, `graph-prettify` 6-style picker). Requires `REPLICATE_API_TOKEN` in `.env` at vault root.

Drop your own utility skills into the same folder shape as you build them — see `agent_brain/understanding/standards/skill-authoring.md` for the format.

## Adding your own

The pattern: do the same procedure 3+ times manually → write a SKILL.md → let the assistant handle it. See `agent_brain/understanding/standards/skill-authoring.md` for the format.

Skills hot-reload — adding/editing one in Claude Code takes effect immediately.
