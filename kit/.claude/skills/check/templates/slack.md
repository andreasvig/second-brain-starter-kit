# slack — channels and DMs scan

Scans Slack for messages needing response or wiki capture. Read-only — never sends.

<!-- Config: adapt these during setup -->
<!-- slack_user_id: {{SLACK_USER_ID}} -->
<!-- primary_channels: {{CHANNEL_LIST}} -->
<!-- team_members: {{TEAM_MEMBER_NAMES}} -->

## Arguments

- `since:yesterday` — messages since yesterday (default)
- `since:YYYY-MM-DD` — messages since a specific date

## What to do

### 1. Check primary channels

Read recent messages from each configured primary channel. For each message, classify:

- **Needs response** — you were @mentioned, asked a question, or assigned something
- **FYI important** — decisions made, status changes, relevant updates from team members
- **FYI low priority** — general chatter, bot messages, automated notifications
- **Wiki-worthy knowledge** — facts, data, decisions, or context that should be captured in the brain

### 2. Check DMs

Check direct messages for unread from team members and stakeholders.

### 3. Extract wiki knowledge

If any messages contain information that should be in the brain (decisions, data points, stakeholder opinions, project updates), note them for capture. Don't update the brain directly from this template — flag for the user or the calling skill (`/morning-brief`, `/remsleep`) to handle.

## Report shape

```
### Slack

**Needs Response**:
- [#channel or DM] [person]: [summary] — [urgency]

**Important Updates**:
- [#channel] [summary]

**Wiki-Worthy**:
- [what to capture] → [which page]
```

Read-only — never send messages on the user's behalf without explicit approval.
