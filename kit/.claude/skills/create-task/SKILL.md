---
name: create-task
description: "Create a properly structured task file with complete frontmatter, wiki-links, and tracking updates."
---

# /create-task — Standardized task creation

Create a properly structured task file with complete frontmatter, wiki-links, and tracking updates.

**Argument**: task description in natural language.

## Procedure

### 1. Parse the input

Extract:
- **Summary**: the task (imperative form)
- **Priority**: if specified (P0/P1/P2/P3). Default: P2.
- **Owner**: if specified. Default: the user.
- **Project**: infer from context. If ambiguous, ask.
- **Category**: infer from content.
- **Due date**: if specified or inferable from priority.

### 2. Generate the slug

Convert summary to lowercase-hyphen slug. Check `agent_brain/tasks/` for collisions.

### 3. Create the task file

Write to `agent_brain/tasks/{slug}.md`:

```yaml
---
type: task
summary: "{summary}"
status: open
priority: {p0|p1|p2|p3}
due: {YYYY-MM-DD or omit}
owner: {Name}
project: {project-slug}
category: {category}
source: manual
created: {today}
updated: {today}
tags: [task, {category}]
---
```

Body: add context, link to relevant wiki pages with `[[wiki-links]]`.

### 4. Update tracking

Append to `artifacts/_changelog.md`: `## [YYYY-MM-DD] task | Created [[{slug}]] — {summary}`

### 5. Confirm

```
Created: agent_brain/tasks/{slug}.md
Priority: P{N} | Owner: {Name} | Due: {date or "none"}
```

## Notes

- One task per file. No checklists inside task files.
- Check existing files before creating duplicates.
