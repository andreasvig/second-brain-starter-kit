---
template: general
summary: "Fallback for sources that don't fit a specific template — strategy docs, org charts, technical RFCs, Slack threads, random docs. Sub-classifies and routes flexibly."
---

# general.md — fallback for misc

Fires when none of the more specific templates fit. Covers:

- Strategy / planning docs (timelines, OKRs, roadmaps)
- Organizational docs (org charts, team structure, process docs)
- Technical docs (architecture, API specs, RFCs)
- Communication exports (Slack threads, email chains)
- Random notes that don't classify cleanly

## Sub-classification

Read the source thoroughly first, then pick a sub-handling:

- **Stable, reusable knowledge** → update existing wiki pages directly (project, person, knowledge). Prefer updating over creating new.
- **Point-in-time / bulky / audit-style** → create an artifact at `artifacts/<category>/YYYY-MM-DD-<slug>.md`. Categories: `briefs/`, `reports/`, `meetings/` for misc, or a new subfolder if a new category emerges.
- **Both** → wiki page summary + artifact for the bulky version. Link them.
- **Action items embedded in the source** → create task files (`agent_brain/tasks/<slug>.md`), `source: ingest`, link back.

## Decision rubric

| If the source is... | Default destination |
|---|---|
| Strategy / planning doc | Project page update + artifact snapshot if dense |
| Org chart / team structure | Person pages updated + a `agent_brain/about_user/team.md`-style page if many |
| Technical / architecture | Knowledge page or project page; artifact for diagrams or specs the user will reference repeatedly |
| Slack thread / email chain | Update relevant person and project pages with the surfaced context; artifact only if the thread is a long argument worth preserving |
| Personal notes (brainstorm dumps, voice memos as text) | Same as `self-reflection.md` — distribute, don't aggregate into an artifact |

When in doubt, lean toward fewer pages with denser content over many stubs.

## Frontmatter (for artifacts)

```yaml
---
type: artifact
category: <briefs|reports|meetings|other>
summary: "<one-line take>"
date: YYYY-MM-DD
tags: [<topic-tags>]
---
```

## Notes

- **Read the full source.** Skim-classification often misses the actual durable content.
- **Don't create new pages prematurely.** Updating an existing project/person/knowledge page is almost always better.
- **Promote to a dedicated template if a pattern repeats.** If you find yourself ingesting "strategy docs" three times in a row and `general.md`'s flexibility is fighting you, propose creating `templates/strategy.md`.
- Hub-update + provenance + tracking handled by `SKILL.md`.
