---
template: journal
summary: "User's own personal writing — journal, diary, freewrite. Land in agent_brain/about_user/journal/ and extract voice samples + recurring themes."
---

# journal.md — personal journal entry

Fires when the source is the user's own personal writing — a journal entry, diary, freewrite, "morning pages"-style brain dump. Distinct from `self-reflection.md` (which is recorded/spoken thinking out loud) and from `article.md` (which is external content).

## Output

1. **Preserve the entry** at `agent_brain/about_user/journal/YYYY-MM-DD-<slug>.md` with light frontmatter:
   ```yaml
   ---
   type: journal
   date: YYYY-MM-DD
   tags: [journal]
   ---
   ```
   Either the full text (if short and durable) or a summary with the raw kept in `raw/`.

2. **Voice sample** at `agent_brain/about_user/voice-samples/journal-YYYY-MM-DD.md`. One paragraph excerpting the writing's most characteristic voice (sentence rhythm, vocabulary, hedge style, signature phrases). The agent uses these when drafting in the user's voice.

3. **Theme tagging**: scan for recurring themes (work, relationships, health, money, a specific person, a specific project). For each that surfaces, ensure the corresponding `agent_brain/about_user/` or person/project page gets a one-line note linking back to this journal entry.

## What to *not* extract

- **Don't** auto-create takes / positions / opinions from journal entries unless the user explicitly asks. Journal voice is exploratory; turning it into stated positions is presumptuous.
- **Don't** mine for action items unless they're explicitly framed as commitments (*"I will X"* — yes; *"maybe I should X"* — no).

## Provenance

The journal entry IS its own provenance — it's authored by the user. Link voice samples and any theme-tagged updates back to `agent_brain/about_user/journal/YYYY-MM-DD-<slug>.md`.

## Notes

- Sensitivity bias: when in doubt, leave it in the journal entry rather than promoting to a public-feeling brain page.
- Hub-update typically doesn't fire here; journals rarely introduce external entities.
- Tracking + provenance handled by `SKILL.md`.
