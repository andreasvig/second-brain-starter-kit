---
name: prep
description: "Gathers wiki context on attendees and open threads for a specific person or meeting, then produces concise talking points."
---

# /prep — Pre-Meeting Briefing

> Standalone skill. Gathers context for a specific meeting, person, or topic and produces talking points.

<!-- Config: adapt these during setup -->
<!-- timezone: {{TIMEZONE}} -->
<!-- calendar_tool: google-calendar | outlook | none -->

## Arguments

- `[person name]` — prep for a meeting with this person
- `[meeting title]` — prep for a specific meeting
- `next` — prep for the next upcoming meeting on the calendar

## What to do

### Step 1: Identify the meeting

If argument is a person: find their wiki page, check calendar for upcoming meetings with them.
If argument is a meeting title: find it on the calendar, identify attendees.
If argument is `next`: check calendar for the next event, identify attendees.

### Step 2: Gather context (parallel)

For each attendee, read in parallel:
- Their person page (if exists) — role, what they care about, how to work with them
- Recent meeting pages involving them — what was discussed last time
- Open tasks involving them — action items, blockers, pending decisions

Also read:
- Relevant project pages (if the meeting is about a specific project)
- Any knowledge pages related to the meeting topic

### Step 3: Identify open threads

What's unresolved between you and these people?
- Action items from previous meetings (check task files)
- Decisions pending their input
- Blockers they own or are affected by
- What's changed since you last met

### Step 4: Generate talking points

Write a concise briefing (under 30 lines):

```
## Prep: [Meeting/Person] — [date]

### Who
[Attendees with one-line role/context from their wiki pages]

### Open Threads
[Unresolved items between you — action items, pending decisions, blockers]

### Context
[Recent changes relevant to this meeting — project updates, wiki changes]

### Talking Points
1. [Specific, actionable point]
2. [Specific, actionable point]
3. ...

### Watch For
[Things to pay attention to — concerns, sensitivities, opportunities]
```

Save the brief to `artifacts/briefs/YYYY-MM-DD-slug.md`.

Keep it practical. The goal is to walk into the meeting prepared, not to summarize everything ever discussed.
