---
template: self-reflection
summary: "Solo recording / writing where the user is thinking out loud. Distribute insights to memory, person pages, project pages, about_user/ — do not create a meeting artifact."
---

# self-reflection.md — solo voice / writing thinking out loud

Fires when the source is the user reflecting alone — either an audio transcript with one voice (theirs), or a written freewrite that reads as personal reflection rather than journaling for posterity.

These are personal and often sensitive. Do **not** create a meeting artifact. Distribute insights to where they belong.

## What to extract

1. **Working style / preferences / patterns** → save to memory (auto-memory `feedback` or `user` types).
2. **Stakeholder insights / relationship dynamics** → update relevant `agent_brain/people/<slug>.md`.
3. **Project / strategic thinking** → update relevant `agent_brain/projects/<slug>/<slug>.md` or knowledge pages.
4. **Leadership / management reflections** → update leadership-related pages if they exist.
5. **Worries, frustrations, vulnerabilities** → store the *actionable* part in memory (e.g. *"avoid asking X about Y until Z"*); do not create durable wiki pages capturing the user's emotional state verbatim.

## Optional: about_user note

If the reflection introduces a new theme worth surfacing (a recurring concern, a new strategic lens), drop a short page in `agent_brain/about_user/reflections/YYYY-MM-DD-<topic>.md`. Keep it brief — the goal is to mark "this came up" so future sessions can connect.

## Provenance

Each updated wiki page gets a `> Source: [[raw/<path>]]` link near the section it informed. Memory entries can reference the source date in their description.

## Notes

- Sensitivity bias: when in doubt, lean toward memory rather than wiki. Memory is private to the user; wiki pages are visible whenever any future session opens them.
- Hub-update only fires here when the reflection introduces a **new external entity** (rare). Internal reflections about the user themselves don't need hub updates.
- Tracking + provenance are still handled by `SKILL.md`.
