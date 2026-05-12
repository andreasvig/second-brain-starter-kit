---
name: resume-handover
description: "Use after /compact to rehydrate task context from the most recent handover document. Reads artifacts/handovers/latest.md, summarizes goal and next step, checks freshness, and confirms readiness to continue. Also use at the start of a new session to pick up an in-flight task."
---

# /resume-handover — Pick up from a handover

> Companion to `/handover`. After `/compact` flattens the conversation, `/resume-handover` loads the handover doc so the new session has full task context.

## When to run

- After `/compact`, when the prior session ran `/handover` first.
- At the start of a new session when picking up an in-flight task from a previous day.
- Any time the user wants to reload the most recent task handover.

## Procedure

### 1. Read the latest handover

Read `artifacts/handovers/latest.md`.

If the file doesn't exist, tell the user:
```
No handover found at artifacts/handovers/latest.md. Either run /handover first in a prior session, or just describe what you want to work on.
```
Then stop.

### 2. Check freshness

Look at the `created:` timestamp in the frontmatter.

- **<24h old**: proceed normally.
- **24h–7d old**: flag with "⚠️ This handover is from {{date}} — about {{N}} hours old. State may have shifted. Want me to verify the current file state before continuing?"
- **>7d old**: stronger flag — "This handover is from {{date}}, over a week old. I'd recommend skimming it together rather than treating it as ground truth. Want to walk through it first?"

### 3. Summarize and confirm

Give the user a tight 3-line summary, then ask to continue:

```
**Task**: {{task name from frontmatter}}
**Where we left off**: {{1-line distillation of "Current state"}}
**Next step**: {{the next step from the doc}}

Ready to continue, or has anything changed?
```

### 4. Continue

Once the user confirms, execute the next step. Treat the handover as load-bearing context — don't re-ask things it already answers (goals, constraints, what was tried, why approaches were rejected).

## Notes

- `/resume-handover` is read-only. It does NOT modify the handover doc. If progress is made and another pause is needed, the user runs `/handover` again.
- To resume an *older* handover instead of the latest, ask the user to point you at the file by name and read that instead.
- The handover is task-state, not durable knowledge. Don't promote anything from it into the brain — that's `/learn`'s job.
- If the handover lists open questions the user can answer right now, surface 1–2 of them in your readiness check.
