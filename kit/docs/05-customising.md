---
summary: "How to evolve the kit: add skills, edit constitution, customise interview answers, change aggressiveness, build new rituals."
---

# Customising

> **This is not a hard harness.** If you want the assistant to do something a certain way, want your brain structured differently, or want to use the system for a narrower purpose than full second brain — explain how, and you can work on it together. Persistence beats remembering: when something should be different, edit the constitution / skill / standard so the change sticks across sessions.

Everything in the kit is editable. The interview is a starting point; the system improves through use.

## Edit the assistant's identity

`.claude/constitution/identity.md` — name, personality, mission, strategic lens, push-back stance. Edit any time.

If you want to change personality archetype mid-flight, just rewrite the relevant section. The assistant reads identity.md fresh each session.

## Edit the constitution

Each concern file in `.claude/constitution/` is its own document. When a "no, do it this way" emerges:

- A retrieval preference → edit `retrieval.md`
- A frontmatter convention → edit `writing.md`
- A new task workflow → edit `tasks.md`
- A communication rule → edit `communications.md`

The assistant proposes edits when patterns emerge; you approve before changes land.

## Change the aggressiveness dials

`.claude/constitution/learning-aggressiveness.md` — the soft settings.

To go more conservative:
- Set both globals to `ask`
- Set sensitive domains (`comms_style`, `people_patterns`) to `off`

To go more aggressive:
- Set both globals to `auto`
- Use per-domain `off` only for areas you're protective about

These are read fresh each invocation. Changing them is a single edit, no restart.

## Add a new skill

1. Decide if it's improvement-shaped (predict → calibrate, e.g. a habit tracker that learns your patterns) or report-shaped (visibility, e.g. a daily briefing). The framing changes the design.
2. Create `.claude/skills/<name>/SKILL.md` with the required frontmatter (see `agent_brain/understanding/standards/skill-authoring.md`).
3. Write the procedure: bullet steps the assistant should follow.
4. Test by invoking `/<name>` (Claude Code) or by saying "run the <name> procedure" (other harnesses).
5. Iterate: every "no, do it this way" becomes a rule in the SKILL.md.

## Add a morning ritual

1. Add a config flag in `.claude/constitution/config.yaml`:
   ```yaml
   gratitude: true
   ```
2. Add a ritual block in `.claude/skills/morning-brief/SKILL.md` (uncomment one of the example blocks, or add a new one):
   ```markdown
   ### Step N: Gratitude (if `gratitude: true`)
   Read .claude/constitution/config.yaml. If gratitude: true, prompt the user
   for three lines and save to agent_brain/about_user/journal/YYYY-MM-DD.md.
   ```
3. Heavy rituals (news scan, weekly review) get standalone skill files; lighter ones (curiosity, habit check-in, gratitude) live inline.

## Customise the interview

The interview at `interview/setup.md` is one document with stage markers. To rerun a stage, just tell the assistant "redo stage 4". The setup-progress file tracks what's been done; you can re-trigger any stage.

If you want to change archetypes, push-back stance, or any other style choice later, edit `.claude/constitution/identity.md` and `.claude/constitution/conversation-style.md` directly — no need to rerun setup.

## Customise the brain structure

`agent_brain/` ships with a sensible default tree (projects, people, about_user, understanding, references, tasks). Add subfolders as needed. Examples:

- A reading log → `agent_brain/reading/`
- A training journal → `agent_brain/training/`
- Recipe collection → `agent_brain/recipes/`

The constitution doesn't enforce a structure; it suggests one. Diverge when your domain warrants it.

## Schema evolution

The constitution is a living document. The natural cadence:

1. Notice a pattern (a frontmatter field used ad-hoc, a workflow done 3+ times, a convention forming).
2. Propose to codify it.
3. Approve.
4. Edit the relevant constitution file.
5. Existing pages get retrofitted lazily as they're touched (don't bulk-rewrite — let drift heal naturally).

The assistant should propose; you approve. Don't let the assistant unilaterally evolve the constitution.

## Versioning your kit

Once you've customised meaningfully, treat your vault as a private repo:

```bash
cd $VAULT
git init
echo "raw/*" >> .gitignore  # if you don't want to version your inputs
echo "artifacts/*" >> .gitignore  # if you don't want to version generated outputs
git add -A
git commit -m "initial: customised second brain"
```

Then push to a private remote. Version-control the constitution and skills; let the brain content live as plain markdown.
