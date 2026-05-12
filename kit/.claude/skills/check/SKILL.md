---
name: check
description: "Read-only inspection skill. Default scans every available stream (brain status, task health, calendar, slack, email — whichever are installed and connected); pass a descriptor to scan only one. Composed by /morning-brief and /remsleep, also invoked directly."
---

# /check — Read-only inspection across the brain and connected tools

> Core skill. Replaces the older `/check-status`, `/check-tasks`, `/check-calendar`, `/check-slack`, `/check-email` family. Same coverage, one entry point. Read-only — never writes, replies, or changes state.

## How it works

The user calls `/check` with either no descriptor (scan everything available) or a descriptor like `/check tasks`, `/check calendar tomorrow`, `/check slack since:2026-05-01`. The dispatcher classifies the descriptor, fires the matching template(s), and merges the output into one report.

Templates live in `templates/`:

| Template | What it covers | Dependency |
|---|---|---|
| `status` | Brain-only pulse: tasks-by-priority + last 5 changelog entries | None |
| `tasks` | Deep task health — overdue, stale, blocked-without-explanation, P0/P1 missing dates | None |
| `calendar` | Calendar scan, classify events, surface attendee context, flag /prep-worthy | Calendar MCP |
| `slack` | DMs, mentions, primary-channel scan, classify by urgency, flag wiki-worthy | Slack MCP |
| `email` | Inbox triage, filter automated noise, surface human emails needing response | Email MCP |

## Procedure

### 1. Classify the descriptor

- **No descriptor** → fire `status` + every other template whose dependency is installed/authenticated. This is the "everything I can see" mode.
- **Single keyword match** (`tasks`, `calendar`, `slack`, `email`, `status`) → fire just that template, passing the rest of the descriptor as its argument (e.g. `/check calendar tomorrow` → calendar template with `tomorrow`).
- **Free-form descriptor** → infer the closest template. Examples:
  - "what's on my schedule" → `calendar`
  - "did anyone mention me" → `slack`
  - "what's in my inbox" → `email`
  - "anything overdue" → `tasks`
  - "quick pulse" → `status`
  - "everything" → fan out (same as no descriptor)
- If the descriptor is ambiguous or matches more than one template, fan out to those templates and merge.

### 2. Check dependencies

For each MCP-backed template (`calendar`, `slack`, `email`), check whether the corresponding MCP is installed and authenticated. If not:
- In fan-out mode: emit a one-line "skipped — `<template>` not connected" and continue.
- In single-template mode: tell the user how to authenticate, don't pretend the data is empty.

The optional check skills' presence is determined by `.claude/skills/<name>/` (active) vs `.claude/skills-disabled/<name>/` (paused). If a template's source skill is disabled, treat it as unavailable.

### 3. Fire templates

Read the template files from `templates/`. Each template owns its own classification logic, output schema, and edge cases. Run them in parallel when fanning out.

### 4. Merge the report

When fanning out, present sections in this order: **Status**, **Tasks**, **Calendar**, **Slack**, **Email**. Skip any section that returned nothing or was unavailable. End with a one-line summary of what was skipped and why, so the user knows the gaps.

When firing a single template, the report is just that template's output — no wrapper sections.

### 5. Read-only — always

This skill never replies to messages, never sends, never marks-as-read, never writes brain pages. If a template surfaces something brain-worthy (a fact to capture, a person without a page), flag it for the user or for the calling skill (`/morning-brief`, `/remsleep`) — don't act on it from `/check`.

## Notes

- `/check` is the dispatcher; the actual logic lives in `templates/`. Adding a new check (e.g. `/check linear`) is a new template file plus a row in this table.
- For the full briefing experience (calendar + slack + email + tasks + news + reflection), use `/morning-brief`, which composes `/check` plus other skills.
- Named `/check` (not `/status`) to avoid collision with Claude Code's built-in `/status`.
