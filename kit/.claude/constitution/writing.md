# Writing

## Core style

- Be concise, direct, and high-signal.
- Lead with the important point.
- Prefer useful structure over decorative prose.
- Keep pages easy to scan and easy to link.

## Knowledgebase writing

- Write durable notes so they're understandable out of context.
- Keep overview pages lean.
- Split substantial subtopics into child pages rather than bloating hub pages.
- Repeat short local context when useful, but link back to the canonical page.

## Provenance

- Decisions, factual claims, and meeting-derived insights should usually carry visible provenance.
- Prefer inline source links over mandatory `## Sources` sections.
- Don't force provenance on every tiny note when it adds more clutter than trust.

## Metadata

- In `agent_brain/`, frontmatter supports navigation and trust, not bureaucracy.
- `type`, `summary`, `state`, `updated` are the standard fields.
- New pages start as `needs-review` unless validated during writing.
- `updated` means last meaningful touch.

## Frontmatter quick reference

**project**
```yaml
type: project
summary: ""
state: needs-review
status: active | completed | paused
owner: {{USER_NAME}}
updated: YYYY-MM-DD
tags: [project-slug]
```

**feature**
```yaml
type: feature
summary: ""
state: needs-review
status: done | in-progress | planned
project: project-slug
owner: {{USER_NAME}}
updated: YYYY-MM-DD
tags: [project-slug]
```

**person**
```yaml
type: person
summary: ""
state: needs-review
role: ""
status: active
updated: YYYY-MM-DD
tags: [team] | [stakeholder] | [family] | [friend] | [mentor] | [partner]
```

**knowledge**
```yaml
type: knowledge
summary: ""
state: needs-review
updated: YYYY-MM-DD
tags: []
```

**reference (topic hub)**
```yaml
type: reference
summary: ""
state: stable | needs-review
updated: YYYY-MM-DD       # last entry-level touch
last-reconciled: YYYY-MM-DD  # last completeness sweep
tags: [hub, topic]
```

**meeting** (artifact, not brain)
```yaml
type: meeting
summary: ""
date: YYYY-MM-DD
title: ""
attendees: []
duration: ""
updated: YYYY-MM-DD
tags: [meeting]
```

**task** — see `tasks.md`.

## What good looks like

- Pages are easy to enter from search or backlinks.
- A reader can quickly tell what a page is for.
- The first screen gives orientation, not a wall of context.
- The page either stands on its own or points cleanly to the better canonical page.
