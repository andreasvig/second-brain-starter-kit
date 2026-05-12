---
summary: "Notes on running the kit in agents other than Claude Code: Cursor, Codex, OpenCode, plain markdown."
---

# Adapters — running in non-Claude-Code agents

The kit is built first against Claude Code. The brain itself (markdown + frontmatter + wikilinks) is universal — these notes cover what changes when your harness is something else.

## Cursor

Cursor uses `.cursor/rules/` files for instructions auto-loaded into context.

To run the kit in Cursor:

1. **Don't expect slash commands.** Cursor doesn't have a slash-command registry. Skills under `.claude/skills/` become *named procedures* — invoke them by saying "run the learn procedure" or "follow `.claude/skills/morning-brief/SKILL.md`".
2. **Optional: copy high-leverage skill instructions into `.cursor/rules/`.** This auto-loads the procedure into Cursor's context every session. Good candidates: the constitution stub (CLAUDE.md content) and any skill you invoke daily.
3. **The PreCompact hook doesn't apply.** Cursor's compaction model is different. Manually run `/learn` (i.e. ask Cursor to follow the learn procedure) before long sessions get truncated.
4. **Edit `.claude/constitution/harness.md`** — replace the Claude Code section with Cursor-specific notes if you've made customisations.

## Codex

OpenAI's Codex CLI handles markdown instructions natively.

1. Skills are named procedures. Invoke verbally.
2. The codebase-style ingest pattern Codex prefers (reading code first) maps onto our `/ingest` flow.
3. PreCompact hook doesn't apply.
4. Memory model is harness-specific — adapt `learning-aggressiveness.md`'s "memory" references to your tool.

## OpenCode

OpenCode is more bare-bones. The brain still works as plain markdown; skills become procedures invoked verbally.

1. No slash commands.
2. No hooks.
3. No skill auto-discovery — paste skill content into your conversation when you want to invoke it.

## Plain markdown + your editor (no agent CLI)

The brain still works as a personal wiki. You lose the agent loop:

- No automatic ingestion from `raw/`.
- No automatic consolidation (`/remsleep`).
- No automatic morning briefing.
- No outbound message helpers.

You don't lose:

- The structure (it's good organisation regardless).
- The hub-first paradigm (you do it manually).
- The constitution as readable design doc.
- The templates as starting points for new pages.

Many people start here and add an agent CLI later. The brain content carries forward.

## Translating skill instructions

If your harness wants explicit prompts rather than markdown procedures, paste a SKILL.md's content into a system prompt or rule file. The instructions are designed to be agent-agnostic — they describe *what* to do, not *how to wire it up in a specific harness*.

Where you find harness-specific bits (e.g. "use the `/compact` command", "touch `artifacts/.last-learn` for the PreCompact hook"), translate to your harness's equivalent or skip.
