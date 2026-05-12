# Context Continuity

How the assistant preserves context across session boundaries. Three skills, one coherent workflow.

## The problem

Agent CLI sessions have a finite context window. When it fills, compaction flattens the conversation into a summary. That summary loses detail — failed approaches, half-finished reasoning, specific file paths, the exact phrasing of a decision. Without intervention, important signal is lost every time the window fills.

## The three skills

| Skill | Captures | Destination | When |
|---|---|---|---|
| `/learn` | Durable *knowledge* | `agent_brain/` + memory | Before compaction; when lasting insight emerges |
| `/handover` | Ephemeral *task state* | `artifacts/handovers/` | Before compaction when mid-task |
| `/resume-handover` | Rehydrate task state | reads `latest.md` | After compaction; new session on in-flight task |

**Key distinction**: `/learn` is for things that should live forever (facts, decisions, standards). `/handover` is for what the next session needs but the brain doesn't (failed attempts, current broken state, what was about to be tried).

## Canonical workflow

```
[long working session]
        │
        ├─→ /learn        (preserve durable knowledge)
        ├─→ /handover     (preserve task state if mid-task)
        ├─→ /compact      (compress context — harness command)
        └─→ /resume-handover  (next session picks up the handover)
```

Not every session needs all four. Short Q&A can skip straight to compaction. Pure-knowledge sessions need `/learn` but not `/handover`. Mid-task sessions with no new durable knowledge need `/handover` but not `/learn`.

## Downstream review

`/learn` writes under time pressure (pre-compact, conversation-scoped) and marks new pages `state: needs-review`. Consolidation (`/remsleep`) reviews `/learn` output since the last remsleep run: promotes solid pages to `stable`, flags thin ones, surfaces overlaps for the user. It does not auto-merge — `/learn` provenance is load-bearing.

This means `/learn` can lean into writing. Don't pre-emptively under-save to avoid cleanup later.

## Proactive suggestions

The assistant should **proactively suggest** these skills rather than wait for the user to remember.

### Suggest `/learn` when

- The user mentions context window filling.
- The user signals they might compact soon.
- A substantial new task is about to begin AND meaningful ground was already covered.
- A major line of work is about to close (feature shipped, decision finalized, big question answered).

**Heuristic**: if you can name 3+ specific things from this conversation worth saving, suggest `/learn`.

### Suggest `/handover` when

- The user is mid-task and signals they need to stop, compact, or come back later.
- The session has accumulated tactical detail (failed attempts, half-finished work) that compaction would muddy.
- A task is paused with a clear "next step" the next session needs.

**Heuristic**: if the next session would need more than 2 minutes of re-orientation, suggest `/handover`.

### Suggest both when

- Long session with both durable knowledge AND in-flight task state. Run `/learn` first, then `/handover`, then compact.

### Suggest `/resume-handover` when

- A new session opens and there's a recent handover in `artifacts/handovers/latest.md`.
- The user asks to "pick up where we left off" or similar.

## Phrasing

Suggestions are offers, not orders.

- *"Context has been substantial — want me to `/learn` before we move on?"*
- *"You're mid-task with a lot of tactical state. `/handover` before we compact?"*
- *"There's a handover from {{date}} at `artifacts/handovers/latest.md`. Resume it?"*

The user can always say no.

## What NOT to do

- Don't run `/learn` or `/handover` silently. Always suggest first.
- Don't treat them as equivalent. Knowledge → brain; task state → handover.
- Don't auto-trigger.
- Don't skip the suggestion to save a turn.

## If your harness doesn't have slash commands

The three skills are *procedures*, not just commands. If your agent CLI doesn't support slash commands, invoke them by saying e.g. "run the learn procedure now" — the assistant should follow the SKILL.md instructions in `.claude/skills/learn/`.
