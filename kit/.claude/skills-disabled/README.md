---
type: index
summary: "Skills that exist in the vault but aren't currently active. Recoverable any time — say 'activate <skill>' to move it back into rotation."
---

# Disabled skills

Skills here are *available but not currently active*. They were either set aside during setup (Stage 10) or disabled later because the user didn't need them.

This folder lives **outside** `.claude/skills/` on purpose — Claude Code only discovers skills directly under `.claude/skills/<name>/SKILL.md`, so anything parked here is invisible to the slash-command picker until it's moved back.

## How activation works

- **Activate**: tell the agent *"activate <skill-name>"*. The agent moves the folder from `.claude/skills-disabled/<name>/` to `.claude/skills/<name>/` and the skill becomes available as a slash command.
- **Deactivate**: tell the agent *"deactivate <skill-name>"*. The agent moves the folder from `.claude/skills/<name>/` to here.

Both are reversible — no skill content is lost.

## Why this folder exists (vs trashing)

Trashed skills are gone from the vault and only recoverable via your OS's Trash or by re-cloning the kit. Disabled skills stay in the vault, ready to flip back on with one sentence to the agent. This is the right home for "maybe later" — `~/.Trash/` is the right home for "definitely not".

The training-wheels tips for optional skills will continue to fire while they're disabled, suggesting activation if the skill sounds useful.

## Which skills are "optional" vs "core"

Tier metadata lives in `docs/04-skills-catalog.md` — that's the single source of truth for which skills are core (always-on, never disable) vs optional (the user picks). The folder layout is flat by necessity (Claude Code's discovery requires it), so the catalog is where you check tier.
