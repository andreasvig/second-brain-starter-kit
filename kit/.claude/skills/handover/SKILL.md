---
name: handover
description: "Use before /compact when the conversation has substantial in-flight task state that the next session needs to continue cleanly. Writes a detailed handover doc (goal, what's been tried, current state, next step, open questions, files touched, gotchas) to artifacts/handovers/. The next session uses /resume-handover to rehydrate."
---

# /handover — Capture task state before compaction

> Companion to `/learn` and `/compact`. While `/learn` preserves *durable knowledge* and `/compact` flattens *conversation detail*, `/handover` captures *task state* — the in-flight context the next session needs to continue without losing momentum.

## When to run

- Before `/compact` on a session where you're mid-task and the next session needs to pick up cleanly.
- When a long session has produced a lot of tactical detail (failed attempts, design choices, half-finished work) that would be muddied by compaction.
- When you want to pause a task and come back to it tomorrow.

## When NOT to run

- Pure-knowledge sessions — use `/learn` instead. Handover is for *task state*, not durable facts.
- Trivially small tasks — a 5-message conversation doesn't need a handover.
- When the task is genuinely done — no need to hand off completed work.

## Bias

Be specific. Failed attempts and dead ends are *especially* valuable — they prevent the next session from re-running them. Don't pad sections that have nothing meaningful; write "None" instead.

## Procedure

### 1. Identify the task

What is the user actually working on right now? If unclear, ask. The handover is anchored to one specific task.

Pick a short slug (kebab-case, 2–4 words) for the filename, e.g. `convert-vault-skills`, `api-debug`.

### 2. Write the handover document

Write to BOTH locations:
- `artifacts/handovers/YYYY-MM-DD-HHMM-{{slug}}.md` — timestamped archive
- `artifacts/handovers/latest.md` — overwritten each time; this is what `/resume-handover` reads

Use this structure:

```markdown
---
type: handover
task: {{short task name}}
slug: {{slug}}
created: YYYY-MM-DD HH:MM
status: in-progress
---

# Handover: {{task name}}

## Goal
What we're trying to accomplish, in 1–3 sentences. Include success criteria if known.

## Context
Why this task matters, what triggered it, who's involved. Link to brain pages where relevant ([[wikilinks]]).

## What we tried
Chronological list of approaches with outcomes:
- **Approach 1**: what we did → result (worked / failed / partial — why)
- **Approach 2**: ...

## Current state
Situation right now. What's working, what's broken, what's half-finished.

## Next step
The single most important next action. Concrete enough to execute without re-deciding.

## Open questions
Things we don't know yet, decisions we deferred, things to check with the user.

## Files touched
- `path/to/file.ext` — what we changed and why
- `path/to/another.ext` — ...

## Gotchas
Non-obvious things the next session will trip on if they don't know:
- Constraints, hidden state, environment quirks, things the user prefers a specific way.
```

### 3. Tell the user

```
Handover written: artifacts/handovers/{{filename}}
Also overwrote: artifacts/handovers/latest.md

Next: type /compact, then /resume-handover to rehydrate.
```

## Notes

- The handover is *temporary scratch*, not durable brain. Don't try to extract knowledge here — that's `/learn`'s job. If something durable surfaces while writing, mention it in the report so the user can run `/learn` separately.
- Old handovers accumulate in `artifacts/handovers/`. Treat them as task history; the user can prune anytime.
- If a handover already exists for the same task and is recent (<24h), update it in place rather than starting over — preserve the prior "What we tried" history and add new entries.
