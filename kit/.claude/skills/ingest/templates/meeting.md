---
template: meeting
summary: "Multi-person dialogue transcript. Produces a meeting artifact, extracts decisions and action items, updates person/project pages, creates tasks."
---

# meeting.md — multi-person discussion

Fires when the source is a transcript with multiple speakers in dialogue (recorded meeting, recorded call, recorded interview).

## Output

Create a meeting artifact at `artifacts/meetings/YYYY-MM-DD-slug.md`:

```yaml
---
type: meeting
summary: ""
date: YYYY-MM-DD
title: "Meeting Title"
attendees: [Person1, Person2]
duration: "X min"
updated: YYYY-MM-DD
tags: [meeting]
---
```

Put `> Source: [[raw/<path>]]` near the top.

## Body sections

1. **Summary** — 3–5 bullets covering the discussion's main points
2. **Decisions made** — explicit decisions (or "none recorded")
3. **Action items** — who, what, when (each becomes a task — see step below)
4. **Notable quotes / context** (optional) — anything worth preserving verbatim
5. **Sources** — link back to the raw transcript

## What to extract beyond the artifact

- **Person pages** (`agent_brain/people/<slug>.md`): new context about what each attendee is working on, cares about, or said. One sentence each, with a back-link to the meeting artifact.
- **Project pages**: status updates, decisions, new information surfaced.
- **Knowledge / understanding pages**: cross-cutting takeaways that aren't tied to one project.
- **Tasks** (`agent_brain/tasks/<slug>.md`): one file per action item. Set `source: meeting`, link to the meeting artifact, set priority based on urgency.

## Cross-linking

The meeting artifact should link to every person, project, and task it touches. Each updated wiki page should have a source link or a back-link to the meeting artifact.

## Notes

- If the transcript turns out to be a solo voice memo (no dialogue), switch to `self-reflection.md` instead.
- If the meeting was personally sensitive, treat it like a self-reflection: distribute insights to memory and person pages, do **not** create a meeting artifact.
- Hub-update + provenance + tracking are handled by `SKILL.md` after this template runs.
