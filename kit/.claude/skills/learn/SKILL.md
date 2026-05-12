---
name: learn
description: "Use before /compact, or any time this conversation has produced durable knowledge that shouldn't be lost. Scans the session, classifies preservation candidates into brain updates, understanding pages, tasks, memory, and skill candidates. Writes with provenance, then marks .last-learn so the PreCompact hook knows /learn ran recently."
---

# /learn — Distill the current conversation

> Main skill. Lightweight, synchronous consolidation of **this conversation only**. Smaller and more focused than `/remsleep`.

## When to run

- **Before `/compact`** — always. Compaction flattens detail; `/learn` preserves it first.
- After a conversation that produced substantial new context (meetings, ingests, deep discussion, architectural decisions).
- Any time something important has emerged and you want it captured now, not during `/remsleep`.

## Bias

Dial-aware. Read `ingestion_aggressiveness` from `.claude/constitution/learning-aggressiveness.md`:

- **Under `Auto`** — bias is **for saving**. Most durable material should already have been captured mid-conversation by the auto-ingest path (see `learning-aggressiveness.md` → "In-conversation learning auto-ingest" and "Web research auto-ingest"). `/learn` still runs pre-compact as a safety net with a lower bar — it sweeps anything the mid-conversation path missed and reports "most material already captured during conversation." Promotion/demotion of borderline pages is handled downstream by `/remsleep`.
- **Under `Ask` / `Off`** — bias is **against saving**, not for it. If nothing is genuinely durable, say so and skip. Do not pad the brain. This is the conservative default that was the only mode before Auto became dial-aware.

## Procedure

### 1. Review

Scan the conversation from start to now. Classify preservation candidates into these buckets:

**Brain updates** (`agent_brain/`)
- New facts about people, projects, stakeholders
- Decisions with rationale
- Status changes (feature done, project blocked, new deadline)
- Context that should live on a person/project page

**Understanding** (`agent_brain/understanding/`)
- Playbooks — repeatable procedures articulated this session
- Patterns — recurring approaches worth naming
- Standards — conventions the user or assistant committed to
- Unknowns — open questions that recurred

**Tasks** (`agent_brain/tasks/`)
- Commitments the user made ("I'll do X next week")
- Follow-ups the assistant agreed to
- Action items with clear next step

**Memory** (`~/.claude/projects/.../memory/`)
- User's working style, preferences, corrections
- Feedback ("stop doing X", "do it this way")
- Cross-session relationship context
- Follow the auto-memory type conventions (user / feedback / project / reference)

**Skill candidates**
- Workflows done (or requested) 3+ times manually
- Flag in the report only — do NOT auto-create

### 2. Filter

For each candidate, ask:
- **Durable?** Will it matter next week? If no, skip.
- **Already captured?** Does a page or memory already hold this? If yes, update that — don't duplicate.
- **Specific?** Vague takeaways belong nowhere.

### 3. Write

- Update existing pages first. Create new only when content clearly deserves its own identity.
- Every write gets provenance: `> Source: conversation YYYY-MM-DD`.
- Tasks: `source: manual`, today's date, link to relevant brain pages.
- Memory entries: follow the type conventions; keep the `MEMORY.md` index in sync.

### 4. Log

Append to `artifacts/_changelog.md`:

```
## [YYYY-MM-DD] enrich | /learn — [one-line topic]

- Updated: [[page1]], [[page2]]
- Created: [[new-page]]
- Tasks: N
- Memory: N
- Skill candidates flagged: N
```

### 5. Mark the session

Touch the freshness marker so the PreCompact hook knows `/learn` ran recently:

```bash
touch "$CLAUDE_PROJECT_DIR/artifacts/.last-learn"
```

### 6. Report

```
## /learn report — [date]

**Preserved**:
- Brain: X updates, Y new pages
- Tasks: N created
- Memory: N entries
- Skill candidates flagged: N

**Skipped** (considered, not durable): [one-line note, e.g., "general discussion on config settings — decision is in changelog, nothing to preserve"]

You're clear to /compact.
```

## Relationship to /remsleep

- `/learn` — synchronous, conversation-scoped, on-demand (especially pre-compact).
- `/remsleep` — multi-agent consolidation after substantial work. Reviews the window since the last remsleep run, does broader synthesis/maintenance/reporting, and may generate reflection questions if enabled.
- Intentional hand-off, not duplicate output: `/learn` captures durable conversation material quickly; `/remsleep` later reviews `/learn` output for promotion, overlap, and synthesis. `/learn` does NOT produce reflection questions; that's `/remsleep`'s job.

## Notes

- Don't summarize the conversation. Extract *durable* knowledge from it.
- Stay link-first. Connect new content to existing pages.
- New pages start as `state: needs-review`.
- If nothing is worth saving, the report is one line: "Nothing durable. Compact freely."
