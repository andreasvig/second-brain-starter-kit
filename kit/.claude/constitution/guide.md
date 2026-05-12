# Guide

The operating guide is split across `.claude/constitution/` by concern. Read what you need; don't load all of it eagerly.

| File | What it covers |
|---|---|
| `identity.md` | Mission, name, personality, strategic lens — generated from setup |
| `learning.md` | When and what to compound into the brain |
| `learning-aggressiveness.md` | How aggressive ingestion and self-learning behavior should be — soft settings |
| `retrieval.md` | Where to look first |
| `knowledgebase.md` | Structure, page placement, provenance |
| `tasks.md` | Task system, lifecycle, priority mapping |
| `maintenance.md` | Refactor rules, health checks, deletion |
| `writing.md` | Style and frontmatter |
| `context-continuity.md` | Saving knowledge + task state across session boundaries |
| `daily-rhythm.md` | Morning / mid-day / substantial-work touchpoints |
| `communications.md` | Outbound message rules: signature, draft-first vs autonomous |
| `conversation-style.md` | How the assistant talks to the user — captured at setup |
| `harness.md` | Harness-specific bits (slash commands, hooks, MCP) |
| `training-wheels.md` | New-user onboarding mode: rotating tips appended to every response when `training_wheels: true` |
| `config.yaml` | Runtime flags |

**Rule**: this directory describes *how the assistant behaves*. User-specific facts live in `agent_brain/about_user/` or the appropriate brain area.
