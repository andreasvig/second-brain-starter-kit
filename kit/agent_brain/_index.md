---
type: index
updated: {{TODAY}}
---

# Brain Index

Master map of `agent_brain/`. Entry point for navigation and retrieval. Keep this updated when pages are created or removed.

## Organization principle

The brain is **opinion-first, not catalog-first**. Pages exist because they serve a decision, a draft, or a take — not to index every fact in the world. Project pages, decision pages, and people pages each carry your position alongside the facts.

The exception is the **hub layer** at `agent_brain/references/` — thin navigational indexes for large topics that answer "what do we know about X?" without duplicating the opinion that lives elsewhere. See [[understanding/standards/topic-hubs|topic-hubs standard]] for rules.

## Two layers of "projects"

- **`agent_brain/projects/`** — *knowledge* about each project: status, features, people, decisions, notes.
- **`workspace/`** at vault root (peer of `agent_brain/`) — *the active work itself*: code, drafts, video assets, anything you're building. One folder per project. Cross-link to the brain page. See `workspace/README.md`.

When you want to understand a project, start here. When you want to work on it, go to `workspace/`.

## About you

`agent_brain/about_user/` — your personal/context model. Lifestyle, working style, goals, worries, learning priorities, voice. Add pages as they become useful.

## Projects

(empty — created during setup or as you ingest material)

## People

(empty — created during setup or as people are mentioned)

## References

> **Hub-first ingestion order**: any new fact entering the brain → (1) hub placement → (2) linking search → (3) lateral linking. See [[understanding/standards/topic-hubs|Topic Hubs Standard]].

(empty — first hub gets created during setup if you've already accumulated 3+ scattered references on a topic, OR see `references/_example-hub.md` for the format)

## Understanding

- `understanding/decisions/` — durable decision records
- `understanding/playbooks/` — repeatable procedures you've articulated
- `understanding/patterns/` — recurring patterns in your domain worth naming
- `understanding/standards/` — conventions you've committed to
  - [[understanding/standards/topic-hubs|Topic Hubs Standard]]
  - [[understanding/standards/lateral-linking|Lateral Linking Standard]]
  - [[understanding/standards/skill-authoring|Skill Authoring Standard]]
  - [[understanding/standards/obsidian-config|Obsidian Config Standard]] (if using Obsidian)
- `understanding/unknowns/` — important open questions

## Tasks

- `tasks/` — active tasks
- `tasks/archive/` — done/dropped

(empty)
