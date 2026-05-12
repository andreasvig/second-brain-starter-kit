# briefing — quick orientation report

Compact (under 50 lines) report covering: schedule, urgent items, task health, remsleep follow-up, recent wiki changes (since last brief), upcoming (next 24h), plus chosen rituals.

Run on demand — the name reflects a typical use case (daily start-of-day), not a required cadence.

## Arguments

None.

## What to do

### 1. Gather

Invoke `/check` with no descriptor. The dispatcher fans out across every available template (status, tasks, calendar, slack, email — whichever are connected) in parallel and returns a merged report. Templates whose dependency is missing emit a one-line skip note; that's expected, not an error.

### 2. Remsleep follow-up

Check the latest `/remsleep` run (regardless of when it ran) by reading the most recent file in `artifacts/remsleep/`. If it exists:

- Surface the reflection questions in chat — render the full text + context + lean directly. The `agent_brain/about_user/reflections/questions.md` file is durable bookkeeping; the chat is the source of truth.
- Note any items flagged as "needs attention".

### 3. Recent wiki changes (since last brief)

Read entries from `artifacts/_changelog.md` newer than the last `/morning-brief` run timestamp (resolved by the dispatcher in step 2 of `SKILL.md`). Fallback: last 7 days if no prior run was logged. Summarize concisely — count + top themes, not a dump.

### 4. Upcoming (next 24h)

Check calendar for the next 24 hours. Flag meetings that need `/prep` or have no wiki context on attendees.

---

## Ritual blocks — uncomment + personalize the ones the user chose at setup

Light rituals live inline here. Setup (Phase 2) uncomments + personalizes the ones the user picked in interview group 9. The rest stay commented for future opt-in.

Heavy rituals became phases (some inside `/morning-brief`, some inside `/remsleep`) — `news.md`, `research.md`, and the reporting phase inside `/remsleep`. Don't duplicate them here.

<!--
### Ritual: Self-reflection nudge (if `self_reflection: true`)

Check `.claude/constitution/config.yaml`. If `self_reflection: true`:
- Look at `agent_brain/about_user/reflections/` for the last recorded self-reflection date.
- If it's been 14+ days (or no session yet), surface a brief nudge with a concrete prompt — e.g. "think out loud about [a current project or worry] for 10 minutes; drop the recording in `raw/meetings/`."

Skip if no nudge is due.
-->

<!--
### Ritual: Daily curiosity prompt (if `daily_curiosity: true`)

Check `.claude/constitution/config.yaml`. If `daily_curiosity: true`:
- Surface one open question for the user to noodle on while making coffee.
- Source: `agent_brain/about_user/curiosity-prompts.md` (a list the user maintains) or generate one based on recent brain activity.
- Keep it to one paragraph max.
-->

<!--
### Ritual: Gratitude / journal note (if `gratitude: true`)

Check `.claude/constitution/config.yaml`. If `gratitude: true`:
- Surface a 3-line journal prompt — e.g. "three things from yesterday worth noting."
- Capture the user's response (when they reply) to `agent_brain/about_user/journal/YYYY-MM-DD.md`.
-->

<!--
### Ritual: Project pulse (if `project_pulse: true`)

Check `.claude/constitution/config.yaml`. If `project_pulse: true`:
- Pick one active project (rotate through them — track which was last surfaced).
- One-paragraph status: latest changelog entries touching this project, open tasks, anything blocked.
- Goal is one project gets daily mind-share without cycling through all of them.
-->

<!--
### Ritual: Habit check-in (if `habit_checkin: true`)

Check `.claude/constitution/config.yaml`. If `habit_checkin: true`:
- Read `agent_brain/about_user/habits/` (a folder with one page per tracked habit).
- For each habit, surface: last logged date, current streak / cadence, today's check-in.
- Light touch — not a guilt trip; a mirror.
-->

<!--
### Ritual: Tracked-people pulse (if `tracked_people_pulse: true`)

Check `.claude/constitution/config.yaml`. If `tracked_people_pulse: true`:
- Scan `agent_brain/people/`. For each tracked person, check the last `updated:` date.
- If anyone hasn't been touched in N days (configurable, default 21), surface: who, last context, suggested ping.
- Keep to 1–2 names; don't dump the full list.
-->

<!--
### Ritual: Weekly review nudge (if `weekly_review: true` and today is the chosen day)

Check `.claude/constitution/config.yaml`. If `weekly_review: true` and today matches the configured day:
- Don't run the full weekly review inline — reporting is part of `/remsleep`.
- Surface a one-line nudge: "Today's your weekly review day. Run `/remsleep` when enough work has accumulated and you're ready for the full consolidation report."
-->

---

## Output

Write a concise briefing (under 50 lines). Structure:

```
## Morning Brief — [date]

### Today's Schedule
[from /check calendar]

### Needs Attention
[urgent items from Slack, email, overdue tasks, remsleep "needs attention"]

### Tasks
[from /check tasks — P0/P1, overdue, stale]

### Remsleep Questions  (only if self_reflection: true and a recent remsleep produced questions)
[render each question's full text + context + lean directly here, not just a pointer to questions.md]

### Rituals
[one line per active ritual — what's running, or "skipped (config off)"]

### FYI
[non-urgent updates, wiki changes]

### Upcoming (next 24h)
[preview of next 24h schedule, prep needed]
```

Keep it scannable. Bold the actions, not the context.
