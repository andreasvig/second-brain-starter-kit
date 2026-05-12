# Learning Aggressiveness — Soft Settings

How eager the assistant should be about (a) ingesting new knowledge into the brain and (b) learning the user's patterns. Generated from the setup interview; edit any time.

## Two global knobs

### Ingestion aggressiveness — `{{INGESTION_AGGRESSIVENESS}}`

How eager to be about adding new things to the brain when durable signal surfaces in conversation, meetings, or sources.

- **Auto** — Capture every durable insight. Promote freely from `/learn` output. Default during normal work.
- **Ask** — Capture clear-signal items; for judgment calls, propose and wait for a yes.
- **Off** — Don't auto-capture. Only write to the brain when the user explicitly says "remember this" / "add to brain".

### Self-learning aggressiveness — `{{SELF_LEARNING_AGGRESSIVENESS}}`

How eager to be about observing and codifying the user's own patterns — writing style, code style, decision shape, communication voice, etc. Different from ingestion: this is about learning *how the user works*, not capturing *what they're working on*.

- **Auto** — Observe + write to brain/memory + report what landed.
- **Ask** — Observe + propose + the user approves before writing.
- **Off** — Don't observe patterns; only act when explicitly told.

## Per-domain overrides (advanced)

The two globals apply unless a per-domain override is set below. Use overrides when you're protective about a specific area — e.g., you want the assistant to auto-learn writing style but ask before changing your code style.

```yaml
# Uncomment + edit any line to override the global self-learning setting for that domain.
# Each value is one of: auto | ask | off

# code_style: ask
# comms_style: ask
# decision_style: auto
# people_patterns: ask
# process_patterns: auto
# tooling_preferences: auto
```

If a line is commented out, the global setting applies.

## What each domain means

- **code_style** — naming, formatting, design patterns, comment density, test discipline. Captured in `agent_brain/understanding/standards/code-style.md` (created on first observation).
- **comms_style** — voice, register, hedging, signature phrases, channel-specific tone. Captured in `agent_brain/about_user/voice.md` or per-channel pages.
- **decision_style** — how the user weighs tradeoffs, decision frameworks they reach for, what triggers a re-decide. Captured in `agent_brain/understanding/patterns/decision-shape.md`.
- **people_patterns** — preferred meeting cadence, communication norms with specific people, what to surface in `/prep`. Captured per-person.
- **process_patterns** — repeatable procedures the user articulates while working. Captured in `agent_brain/understanding/playbooks/`.
- **tooling_preferences** — keyboard, editor, terminal, CLI tool preferences. Captured in `agent_brain/about_user/tooling.md`.

## How skills read these settings

- **`/learn`** — for each preservation candidate, gate-check ingestion-aggressiveness. `auto` = save freely (and note that most material was likely already captured mid-conversation); `ask` = propose; `off` = skip unless explicitly named.
- **`/remsleep` Phase 3 (synthesis)** — for new pattern detection, gate-check self-learning-aggressiveness. Per-domain overrides take precedence.
- **`/ingest`** — gate-check ingestion-aggressiveness for the "extract durable knowledge" step. Applies to whichever template the source classifies into (meeting, article, journal, export, etc.).
- **`/morning-brief` feeds phase** — gate-checks ingestion-aggressiveness for the auto-ingest pass. When `Auto`, items from feeds whose `auto_ingest` is `lens-filtered` or `aggressive` get promoted to brain pages via `/ingest`. When `Ask` or `Off`, items only stage to `raw/feeds/` and the `auto_ingest` field is ignored.
- **Web research auto-ingest** — after a WebSearch/WebFetch session whose synthesis crosses the substance threshold (≥`auto_ingest_research_min_words` words **or** ≥`auto_ingest_research_min_sources` sources), the assistant runs the full ingestion path (`raw/research/<date>/<topic>.md` snapshot → hub placement → linking search → lateral links → `_index.md` → `_changelog.md`) without prompting. Under `Ask`, propose the ingestion plan first. Under `Off`, never auto-fire.
- **In-conversation learning auto-ingest** — when the user states a durable fact mid-conversation (person joining a project, decision rationale, deadline, opinion worth citing), capture it to the relevant brain page during the conversation, not deferred to `/learn` or `/remsleep`. Under `Ask`, surface the candidate inline and write on confirmation. Under `Off`, hold for `/learn`. Conflicts: when a new fact contradicts an existing brain page, **do not overwrite** — add the new fact alongside the old with a `> Conflict noted YYYY-MM-DD: ...` line for `/remsleep` to resolve.
- **Mid-conversation observation** — when the assistant notices a pattern (style, decision, preference) worth capturing, gate-check self-learning-aggressiveness for that domain. Durable facts about the user's own working style go to auto-memory (`~/.claude/projects/.../memory/`), not the brain — the two systems stay separate.

## Tunables

These knobs shape the auto-ingest behaviour. Edit any time:

```yaml
auto_ingest_research_min_words: 200    # synthesis below this word count is treated as a quick lookup, no ingestion
auto_ingest_research_min_sources: 3    # research with fewer distinct sources is treated as a single-source check
```

A research session qualifies when **either** threshold is met (OR, not AND). Cumulative web research targeting the same hub within a single conversation rolls up into one ingestion rather than firing per WebSearch call.

## Default if not set

If the setup wasn't run or these values are missing, default to **Ask** for both globals. Conservative bias: better to over-propose than to silently shape the brain in ways the user didn't agree to.

## Changing your mind

These are soft settings. Edit at any time. The skills read this file fresh each invocation.
