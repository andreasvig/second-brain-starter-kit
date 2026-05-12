# Knowledgebase

## Canonical model

- `agent_brain/` is the single canonical durable knowledgebase.
- `agent_brain/tasks/` is the execution layer, inside the brain.
- `artifacts/` holds outputs and meeting records.
- `raw/` is a strict inbox.
- `.claude/constitution/` is the behavior and rule layer, not a store of user-specific facts.

## Top-level structure

The durable brain is organized around:

- `agent_brain/about_user/` — the user's personal/context model, learning goals, strategic worries
- `agent_brain/projects/` — work and workstreams
- `agent_brain/people/` — anyone in the user's life worth tracking; flatten team/stakeholder/family/friend split with tags
- `agent_brain/understanding/` — reusable cross-cutting synthesis (decisions, playbooks, patterns, standards, unknowns)
- `agent_brain/references/` — topic hubs (navigational; see `understanding/standards/topic-hubs.md`)
- `agent_brain/tasks/` — execution layer (active; archived under `tasks/archive/`)

## About-user

`agent_brain/about_user/` is the home for:

- Role context, working style
- Personal goals, learning priorities, worries
- Strategic lenses (concerns that should colour every conversation)
- `reflections/` — self-reflection outputs and any targeted questions surfaced by consolidation

## Understanding area

`agent_brain/understanding/` is organized by type:

- `decisions/` — durable decision records or decision frameworks worth reusing
- `playbooks/` — repeatable procedures the user articulates ("how I do X")
- `patterns/` — recurring patterns in the user's domain worth naming
- `standards/` — conventions the user or assistant has committed to
- `unknowns/` — important open questions worth tracking

Subfolders ship empty. Populate through use. Don't force structure where none has emerged.

## Page placement

- Keep user-specific personal/context material in `about_user/`.
- Keep reusable operating knowledge in `understanding/`.
- Meetings stay in `artifacts/meetings/`; only durable outputs move into the brain.
- `workspace/` (peer of vault root) stays free-form and link-driven for code projects and working files; not a forced mini-schema.
- `people/` can be flat or split (`team/`, `stakeholders/`, `family/`, etc.) — tags handle the rest.

## Hub layer (`agent_brain/references/`)

Topic hubs are single-page indexes for big topics. Hub-first ingestion order: any new fact entering the brain → (1) hub placement → (2) linking search → (3) lateral linking. See `agent_brain/understanding/standards/topic-hubs.md` for the standard, and `agent_brain/understanding/standards/lateral-linking.md` for spoke-to-spoke discipline.

## Instruction and template boundary

- `.claude/constitution/` describes how the assistant behaves, not who the user is.
- Templates encode page shape and metadata, not user-specific defaults.
- When a template needs local context, prefer neutral fields over hardcoded names, roles, or locations.

## Working material

- Temporary working notes are allowed inside `agent_brain/` when they help work move.
- Promote, merge, or delete them once the durable understanding is clearer.

## Frontmatter

All `agent_brain/` pages should include at minimum:

- `type`
- `summary`
- `state` (`needs-review` | `stable` | `canonical`)
- `updated`

Type-specific fields per page type (see `writing.md` and the templates).

## Naming

- Lowercase-hyphen: `project-name.md`, `firstname-lastname.md`.
- Favor navigability and link integrity over churn.

## Templates

- Don't force formal templates for every knowledge type.
- Let structure emerge unless inconsistency starts harming navigability or trust.
- Use frontmatter sparingly — identity, state, and fields that materially help filtering.
- Prefer body sections for links and nuanced notes.

## Canonical pages

- One strong home for the truth whenever possible.
- Use short local summaries plus links elsewhere rather than large duplicate sections.
- `canonical` is rare, not default.

## Links

- Wiki references: `[[page-name]]` or `[[page-name|Display]]`.
- For non-wiki files that must stay traversable, link them as vault paths (e.g., `[[raw/meetings/2026-01-15-retro.md]]`).
- External URLs in frontmatter (e.g., `github_url`), not inline.

## Source provenance

Any content derived from `raw/` must keep a clickable source trail:

- Direct-to-brain: add `> Source: [[raw/...]]` near the derived section, or a `## Sources` block if multiple.
- Artifact output: put `> Source: [[raw/...]]` near the top.
- When both exist, link them to each other.
- Don't leave provenance as bare text when a clickable link is possible.
