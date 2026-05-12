---
summary: "Architecture overview: the four layers (raw, brain, artifacts, constitution), how they relate, and what the assistant maintains vs what stays user-owned."
---

# How it works

## Four layers

**Raw sources** (`raw/`) — immutable inputs. Meeting recordings, document exports, articles you saved, voice notes. Never modified after dropping them in. Read during ingest, or later only when following a source link from the brain.

**The brain** (`agent_brain/`) — your living knowledge base. Maintained by the assistant. Markdown + YAML frontmatter + `[[wikilinks]]`. Pages update over time as understanding deepens. **This is the default search surface for almost everything.** Includes `agent_brain/tasks/` for the execution layer and `agent_brain/references/` for navigational topic hubs.

**Artifacts** (`artifacts/`) — point-in-time generated outputs. Meeting notes, consolidation reports, prep briefs, progress rollups. Timestamped, not updated after creation. Linked from the brain when useful so the assistant can drill into detail without browsing artifacts broadly. Also holds `_changelog.md` and `_ingest-log.md`.

**The constitution** (`.claude/constitution/`) — assistant identity + operating rules, split across multiple files by concern. Co-evolved with you; the assistant doesn't modify unilaterally. See `kit/.claude/constitution/guide.md` for the index.

**`CLAUDE.md`** — lean entry point that tells the assistant to read `identity.md` and `guide.md`. Not a monolithic system manual — just a pointer.

## Default retrieval rule

Look in `agent_brain/` first. Only search `artifacts/` or `raw/` when:

- A brain page links there and you need more detail.
- The user explicitly asks for the underlying source or generated output.
- You're ingesting brand-new material from `raw/`.

## Ownership boundaries

**The assistant maintains**: everything under `agent_brain/` and `artifacts/`. Creates, updates, and cross-references brain pages. Writes generated outputs to artifacts.

**The assistant does NOT modify**: `raw/` (immutable sources), `.claude/templates/` (co-evolved), `.claude/constitution/` (co-evolved), `CLAUDE.md` (co-evolved), `.obsidian/`, `.claude/settings.json`.

**Your role**: curate sources, direct analysis, ask questions, make decisions, set priorities, approve judgment calls. The assistant does the bookkeeping.

## The constitution split

`.claude/constitution/` holds the assistant's operating behavior, split into concern-specific files plus a thin index stub:

| File | What it covers |
|---|---|
| `identity.md` | Mission, scope, defaults, strategic lenses, assistant name |
| `guide.md` | Stub — lists the other concern files |
| `learning.md` | When to compound knowledge into the brain |
| `learning-aggressiveness.md` | Soft settings for ingestion + self-learning |
| `retrieval.md` | Where to look first |
| `knowledgebase.md` | Structure, page placement, provenance |
| `tasks.md` | Task system and lifecycle |
| `maintenance.md` | Refactor rules, health checks |
| `writing.md` | Style and frontmatter |
| `context-continuity.md` | `/learn`, `/handover`, `/resume-handover` |
| `daily-rhythm.md` | `/morning-brief`, `/check`, `/remsleep` |
| `communications.md` | Outbound message rules |
| `conversation-style.md` | How the assistant talks to you |
| `harness.md` | Harness-specific (slash commands, hooks, MCP) |
| `config.yaml` | Runtime flags |

This is more maintainable than a monolith — find-where-to-edit speed is much higher, individual skills can point at a single concern, and you can edit one file without re-reading the whole manual.

## Skills — composed, not monolithic

Skills (`.claude/skills/<name>/SKILL.md`) are how the assistant performs tasks. They register as slash commands in Claude Code; in other harnesses they're named procedures.

Three tiers ship with the kit:

- **Core** (always installed) — `/learn`, `/handover`, `/resume-handover`, `/morning-brief`, `/remsleep`, `/check`, `/create-task`, `/ingest`. The minimum viable system. (`/remsleep` is a phased dispatcher — its `lint` and `rollup` phases replace what used to be standalone `/lint-wiki` and `/weekly` skills.)
- **Optional** (most users want) — `/prep`, `/transcribe`. Gated on which tools you use. Connection-gated read-only checks (calendar, slack, email) are templates inside `/check`, not separate skills.
- **Utility** (delete if not used) — `/replicate`, `/draw-diagrams`, `/slideshow`, `/remotion`, `/buzzsprout` (not yet shipped — see roadmap).

See `docs/04-skills-catalog.md` for what each skill does.

## Composition pattern

The kit uses a **dispatcher-with-templates** pattern for skills that group related capabilities:

- **`/check`** has `templates/{status,tasks,calendar,slack,email}.md` — read-only inspection across multiple streams.
- **`/ingest`** has `templates/{meeting,article,journal,export,self-reflection,general}.md` — process raw sources into the brain.
- **`/morning-brief`** has `phases/{briefing,research,feeds,news}.md` — daily proactive-ingestion flow.

`templates/` vs `phases/` is naming, not architecture: templates are parallel choices (the dispatcher picks one based on input), phases are sequential stages in a daily flow. Both keep the registry flat — the user sees one slash command per concern, the underlying capabilities stay maintainable as separate files.

`/morning-brief` calls `/check` for the briefing phase, plus its own research/feeds/news phases. This means main skills compose at one level of abstraction (call another skill), and detailed logic lives in templates/phases.

## Schema evolution

The constitution is a living document. As you use the system:

- A new page type used without a schema → codify it in `knowledgebase.md` or `writing.md`
- A workflow repeated manually 3+ times → build a slash command
- A frontmatter field added ad-hoc across pages → standardize it
- A convention emerges in practice → document it in the appropriate concern file
- A new ritual emerges → add a config flag and a block in `morning-brief/SKILL.md`

The assistant proposes schema changes; you approve before constitution files are modified.
