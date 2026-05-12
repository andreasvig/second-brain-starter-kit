---
phase: reflection
default: true
agent: opus
gated_on: self_reflection
sequential: true
---

# reflection — lucid dreaming

Runs **after** `replay`, `synthesis`, and `sweep` complete (needs their outputs).

Only runs if `self_reflection: true` in `.claude/constitution/config.yaml`.

## Contract: chat is the source of truth

The user only ever reads the chat. They do not read `questions.md` or this phase's report file. Therefore:

- **Render each question's full text + context + options + your lean directly in the chat report.** Not a pointer, not a summary, not a count. The full prose.
- Make each question self-contained — a reader who hasn't seen any other phase's output should still understand what's being asked and why.
- The `questions.md` file is durable bookkeeping for cross-session continuity (so the next `/morning-brief` can re-surface unanswered questions). It is *not* where the user reads them.

## What to do

With everything known about the user — goals, worries, working style, recent conversations, brain state:

- What patterns are emerging they might not see?
- What's being avoided or deferred?
- Gap between stated priorities and actual time spent?

**Write 3–5 targeted questions** to `agent_brain/about_user/reflections/questions.md` (replace the previous question set), AND render them in full in the chat report per the contract above.

**Question shape** is configured by the user during setup (Stage 7c) and stored in `.claude/constitution/conversation-style.md`. Read that file before drafting questions and follow the chosen shape (multi-paragraph + lettered options + lean, terse one-paragraph, mixed, or custom).

Each question: specific, explains why it matters, probes something conversation alone won't surface.

## Output

3–5 questions written to `agent_brain/about_user/reflections/questions.md` (bookkeeping) AND rendered in full in the orchestrator's chat report (the user-facing surface).
