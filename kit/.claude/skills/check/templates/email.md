# email — inbox triage

Filters automated noise, surfaces human emails needing response, flags wiki gaps. Read-only — never replies, marks as read, or moves messages.

<!-- Config: adapt these during setup -->
<!-- email: {{EMAIL_ADDRESS}} -->
<!-- noise_senders: {{AUTOMATED_SENDERS_TO_FILTER}} -->
<!-- important_senders: {{KEY_PEOPLE_EMAILS}} -->

## Arguments

- `unread` — unread messages only (default)
- `today` — all messages from today
- `since:YYYY-MM-DD` — messages since a specific date

## What to do

### 1. Read inbox

Use the email MCP tool to fetch messages matching the argument filter.

If no email tool is configured, tell the user how to set up a Gmail or Outlook MCP server. Don't pretend the inbox is empty.

### 2. Filter noise

- **Noise** (skip the list, keep the count): automated notifications from tools — project trackers, CI/CD, calendar updates, marketing.
- **Human messages**: emails from real people — colleagues, stakeholders, external contacts.

### 3. Classify human messages

- **Needs response** — someone asked you something, requested action, or is waiting on you
- **Wiki gap** — notification about something that should be in the brain but isn't (a candidate, contract, project update the brain doesn't reflect)
- **Actionable notification** — automated message that requires follow-up (document shared for review, approval needed)
- **FYI** — informational, no action needed

## Report shape

```
### Email

**Needs Response** (X):
- [sender]: [subject] — [what they need]

**Wiki Gaps** (X):
- [what's missing] → [which brain page needs updating]

**Noise filtered**: X automated messages skipped
```

Read-only — cannot mark as read, delete, move, or reply without explicit approval.
