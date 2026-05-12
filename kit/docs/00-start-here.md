---
summary: "Front door for the Second Brain starter kit. New user lands here, learns what to do next. Pitch + how-to-use + where-to-look-next."
---

# Start here

You've installed the kit. Here's what to do next.

You **don't have to read this file** to use the system — the agent reads `docs/` for you and explains things in plain language when you ask. This doc exists if you'd rather skim it once than ask the agent everything.

---

## 1. If you haven't run the setup interview yet

In your agent CLI (Claude Code or equivalent), say:

> Read `interview/setup.md` and walk me through setup.

That's the bootstrap. The agent runs a 10-stage interview (~5 minutes per stage, pause-resumable any time by saying *"continue setup"*). Stages 1–3 are enough for a usable system; later stages deepen it.

If something looks broken after you copied the kit into your vault, see `INSTALL.md` (in the kit repo) or ask the agent.

---

## 2. Day-to-day

Once setup is done, the operating rhythm is short:

- **Orientation** — `/morning-brief`. Calendar, tasks, what changed since the last brief, plus any rituals you picked at setup (gratitude, news scan, self-review nudge, etc.). The "morning" name is a typical-use hint, not a required cadence — run it whenever you want orientation.
- **During the day** — just talk to the agent. It'll suggest the right command at the right moment.
- **Pausing a long task** — `/handover`. In your next session, `/resume-handover` rehydrates it.
- **Capturing durable knowledge before context fills up** — `/learn`. Run before `/compact`.
- **After substantial work** — `/remsleep`. Multi-phase consolidation: cleanup, replay, synthesis, mechanical sweeps, rollup report, lint audit, optional reflection questions. Workflow suggestion, not a schedule.

Watch your context-size gauge in the status bar. Past ~300k tokens, run `/learn` then `/compact`. Past 400k, do it now.

More detail: `docs/03-daily-rhythm.md`.

---

## 3. Training wheels

Fresh installs ship with **training wheels on**. Every assistant response ends with one rotating tip about how to use this system — there are 30 tips, cycling through. The first ten cover first-week basics; later tips introduce maintenance, customization, and optional tools. After you've seen enough, tell the assistant *"turn off training wheels"* and it'll stop.

Want to read them all in one go? See `docs/tips.md`.

---

## 4. If you forget how something works

Ask the agent. It reads `docs/` and answers in plain language. You shouldn't have to read these files unless you want to.

But if you *do* want to read them, here's the map:

| File | What it covers |
|---|---|
| `01-how-it-works.md` | Architecture overview — the brain, the skills, the hooks |
| `02-how-the-brain-grows.md` | Hub-first paradigm + lateral linking + aggressiveness dials. **Load-bearing.** |
| `03-daily-rhythm.md` | The operating rhythm — morning, during work, after substantial work |
| `04-skills-catalog.md` | Every skill that ships, what it does, when it fires |
| `05-customising.md` | How the system evolves — every "no, do it this way" lands somewhere |
| `06-troubleshooting.md` | When things break |
| `tips.md` | The full training-wheels tip list |
| `adapters.md` | Using a non-Claude-Code agent CLI (Cursor, Codex, OpenCode) |

---

## What this kit actually is

A markdown editor (Obsidian recommended) on one screen. An agent CLI (Claude Code recommended) in a terminal on the other. You talk to the agent; it edits your wiki; the editor renders changes in real time.

Your wiki becomes the single source of truth for whatever you point it at:
- **Project pages** — work, side projects, trips, renovations, learning goals
- **People pages** — colleagues, family, friends, mentors — what they care about, what's going on, how to be useful
- **Meeting / conversation notes** — structured, linked to the people and projects involved, action items extracted
- **Task tracking** — prioritised, due-dated, linked to projects and people
- **Habit and routine tracking** — runs, reading, meditation, whatever you want to build
- **Concept and reference pages** — cross-cutting knowledge that compounds naturally as you live and work

Everything is markdown files in a folder. No vendor lock-in, no database, no subscription beyond your agent CLI. You own your data.

### Why breadth matters

The strength of a second brain is using it for as many parts of your work and life as possible. The cross-pollination is the point:

- A side project teaching you something that feeds back into your day job.
- A recurring problem you fix in one area helping you fix it the next time it shows up elsewhere.
- The assistant knowing about a doctor's appointment, a trip, *and* a work deadline so it can scope timelines that actually work.

The brain compounds because everything links — projects to people, decisions to rationales, today's question to last quarter's answer. Keeping work and personal life in separate notebooks defeats this. Pick the slice of your life you want help with, but if in doubt, lean wide.

### Not a fixed shape

The kit is a starting shape, not a hard harness. If you want the assistant to act differently, your brain structured differently, or the system scoped narrower — tell it, and you can work on it together. See `docs/05-customising.md`.

### Why this works

Humans abandon wikis because the maintenance burden is relentless. AI doesn't get bored. The wiki compounds — every source ingested, every meeting processed, every question answered leaves structured knowledge behind. Cross-references are already there. Contradictions get flagged. Synthesis keeps getting richer.

Six months from now, preparing for any conversation is *"run `/prep`."* Remembering the promise you made a friend three months ago is a conversation, not an archaeological dig. Onboarding a collaborator, briefing a new partner, picking up a dropped project — it's already there.

---

## Where to go next

- **Just start using it.** Ingest a meaningful conversation, journal entry, or project doc — drop it in `raw/`, then say *"ingest this"*.
- Add a project to `workspace/<slug>/` and tell the agent. It'll create the matching brain page.
- Connect a calendar / Slack / email if those matter (re-run the setup interview's stage 10 or just tell the agent).
- Read `docs/02-how-the-brain-grows.md` — the one doc actually worth reading cover-to-cover. Explains the hub-first paradigm that makes the system retrievable as it grows.

---

*Built on Andrej Karpathy's [LLM wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).*
