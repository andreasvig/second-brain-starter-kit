# calendar — schedule scan

Scans the user's calendar, classifies events, surfaces attendee context, flags `/prep`-worthy meetings.

<!-- Config: adapt these during setup -->
<!-- timezone: {{TIMEZONE}} -->
<!-- calendar_tool: google-calendar | outlook | none -->
<!-- hiring: false -->

## Arguments

- `today` — today's events (default)
- `tomorrow` — tomorrow's events
- `week` — this week's events
- `YYYY-MM-DD` — specific date

## What to do

### 1. Read calendar

Use the calendar MCP tool to fetch events for the requested time range. Timezone: `{{TIMEZONE}}`.

If no calendar tool is configured or authentication has expired, tell the user how to set up the Google Calendar or Outlook MCP server. Don't pretend the day is empty.

### 2. Classify events

For each event, classify as one of:
- **Stakeholder meeting** — attendees with wiki person pages
- **Team sync** — recurring team meetings
- **External** — meetings with people outside the org
- **Interview** — candidate interviews (if `hiring` flag is true)
- **Focus time** — blocked time, no-meeting blocks
- **Other** — company-wide events, socials

### 3. Surface context

For stakeholder meetings and team syncs:
- Note if attendees have pages in `agent_brain/people/` (link them).
- Note if there are open tasks or action items related to attendees.
- Suggest `/prep` for important meetings.

For interviews (if `hiring`):
- Check if candidate has a wiki page.
- If yes: note their stage and signals.
- If no: flag as needing a wiki page.

## Report shape

```
### Calendar — [date range]

[Time] [Title] — [attendee context] [flags]
[Time] [Title] — [attendee context] [flags]
...

**Prep needed**: [meetings that would benefit from /prep]
**Heavy day**: [flag if >5 meetings or <1hr focus time]
```

Compact — feeds into the merged `/check` or `/morning-brief` report, not a standalone wall.
