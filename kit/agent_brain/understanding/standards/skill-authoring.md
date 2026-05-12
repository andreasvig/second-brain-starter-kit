---
type: knowledge
summary: "How to write a skill so Claude Code (or another harness) discovers it and the slash command registers."
state: stable
updated: {{TODAY}}
tags: [standards, skills]
---

# Skill Authoring Standard

Rules for creating a new skill in `.claude/skills/`. Applies every time the system evolves.

## File layout

Skills must be **folder-based**, not flat:

```
.claude/skills/
├── learn/
│   └── SKILL.md          ✅ correct
├── morning-brief.md       ❌ won't register as a slash command
```

- Folder name becomes the slash command: `.claude/skills/foo/` → `/foo`.
- Required file inside the folder: `SKILL.md` (uppercase).
- Additional files (scripts, references, assets) can live alongside `SKILL.md`.

## Frontmatter

```yaml
---
name: foo
description: Use when [trigger]. [What it does in one or two sentences — Claude reads this to decide when to invoke.]
---
```

- `description` is the most important field. Claude uses it to decide *when* to load the skill.
- `name` is optional (defaults to folder name) but worth including explicitly.
- Name: lowercase, numbers, hyphens only. Max 64 chars.

### YAML safety in `description`

If the `description` contains YAML-special characters, wrap it in double quotes. Unquoted `#` starts a YAML comment and silently truncates the description.

```yaml
# broken — description truncated at "team's"
description: Draft daily update for the team's #updates Slack channel.

# correct
description: "Draft daily update for the team's #updates Slack channel."
```

Also quote when the description contains `:`, leading `-`, or line breaks.

### Avoid colliding with built-in slash commands

Claude Code ships with built-in slash commands that take priority over custom skills. A custom skill named `status` or `resume` will load but be unreachable — the built-in shadows it.

High-collision-risk names to avoid: `status`, `resume`, `init`, `review`, `help`, `clear`, `compact`, `config`, `model`, `cost`, `memory`, `agents`, `mcp`, `hooks`, `context`, `todos`. When in doubt, type `/<name>` in a fresh session and check.

If a collision is discovered after the fact, rename with a descriptive prefix (`/resume-handover` not `/resume2`, `/check` not `/status2`). `/check` (with `templates/{status,tasks,calendar,slack,email}.md`) is the canonical "read-only inspection" dispatcher — when adding a new read-only stream, drop a template into `/check`, don't create a new top-level `/check-foo` skill.

### The `personal-` prefix

When a skill is tied to a specific account, identity, or persona (rather than a generic helper), prefix the name with `personal-` so the scope is obvious in the slash menu. Generic helpers stay un-prefixed.

## Hot-reload

Claude Code watches skill directories during a session. Adding / editing / removing a skill takes effect immediately — no restart needed.

## When a new skill doesn't appear

Check in this order:
1. Folder structure: is it `foo/SKILL.md`? (Loose `.md` files directly in `.claude/skills/` are silently ignored.)
2. Frontmatter: does it have `name:` and `description:`?
3. `description` YAML-safe? (Quote it if it contains `#`, `:`, leading `-`.)
4. Name collides with a built-in?
5. Name convention: lowercase-hyphen only?

## Where skills live

- **Vault-specific** (references `agent_brain/`, constitution, your projects) → `.claude/skills/` inside the vault.
- **Portable / general-purpose** (works across projects) → `~/.claude/skills/` globally.

Default new skills to vault-local. Only promote to global if the skill has no vault dependencies.

## In other harnesses

- **Cursor**: copy the SKILL.md instructions into `.cursor/rules/<name>.md` for auto-loading.
- **Other CLIs**: skills become *named procedures* you invoke verbally ("run the learn procedure").
