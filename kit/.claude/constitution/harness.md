# Harness

Harness-specific operating rules. The constitution above this file is universal — runs in any agent CLI that can read+write files. This file holds the bits tied to a specific harness.

The kit is built first against **Claude Code**. If you're running it in a different agent, edit this file to match your harness.

## Claude Code (default)

### Slash commands

Skills in `.claude/skills/<name>/SKILL.md` register as `/<name>` slash commands. The folder name becomes the slash command. Required file inside: `SKILL.md` (uppercase).

See `agent_brain/understanding/standards/skill-authoring.md` for full rules (frontmatter, YAML safety, built-in collisions).

### PreCompact hook

`.claude/settings.json` ships with a hook that nudges `/learn` before compaction:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f \"$CLAUDE_PROJECT_DIR/artifacts/.last-learn\" ] && [ $(find \"$CLAUDE_PROJECT_DIR/artifacts/.last-learn\" -mmin -30 2>/dev/null | wc -l) -gt 0 ]; then exit 0; else echo '⚠️  Consider running /learn first to preserve durable knowledge before compaction.' >&2; exit 0; fi"
          }
        ]
      }
    ]
  }
}
```

The hook checks `artifacts/.last-learn` — if `/learn` ran in the last 30 minutes, compaction proceeds silently. Otherwise the user gets a warning.

### MCP tools

Skills referencing calendar / email / Slack assume MCP servers are connected at the harness level. Without them, those skills degrade to "no MCP" mode (use as much brain-only context as possible, prompt the user for the rest).

## Cursor

Cursor uses `.cursor/rules/` for instructions. To run this kit in Cursor:

1. Don't expect slash commands — Cursor doesn't have them. The skills under `.claude/skills/` become *documented procedures* the user invokes by name ("run the learn procedure").
2. Copy the highest-leverage skill instructions into `.cursor/rules/` if you want them auto-loaded into context.
3. The PreCompact hook doesn't apply.

## OpenCode / Codex / other CLIs

Skills under `.claude/skills/` are markdown — readable by any agent. The pattern: tell your agent "follow the procedure in `.claude/skills/<name>/SKILL.md`". Hook-based behaviors (PreCompact) don't apply unless your harness has an equivalent.

## Plain markdown + your editor (no agent CLI)

The brain still works as a personal wiki. You lose the agent loop (no auto-ingest, no auto-consolidation), but the structure remains valuable. See `INSTALL.md` Path 2.
