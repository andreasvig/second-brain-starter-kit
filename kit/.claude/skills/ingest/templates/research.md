---
template: research
summary: "Assistant-generated WebSearch/WebFetch synthesis. Captures the assistant's own multi-source research into raw/research/ + opinion-first hub entries. Fires automatically under ingestion_aggressiveness: Auto once the substance threshold is crossed."
---

# research.md — assistant-generated web research

Fires when the source is the **assistant's own synthesis** of a multi-source web research session (WebSearch + WebFetch calls), not an externally-authored piece the user is consuming. The classic trigger: the user asks a question, the assistant runs 3+ searches, and the answer in chat is a substantive synthesis worth preserving.

Mirrors `article.md` shape — the hub entry is the load-bearing output — but the source is the assistant's research notes, not a single URL.

## When this template fires

Two pathways:

### Automatic (under `ingestion_aggressiveness: Auto`)

After a research session whose synthesis crosses the substance threshold defined in `.claude/constitution/learning-aggressiveness.md` (default: ≥200 words **or** ≥3 distinct sources), the assistant calls `/ingest research` directly without prompting the user.

Below threshold ("what's the capital of Finland?" — 1 source, ~5 words of synthesis): no ingestion, the answer just appears in chat.

Cumulative research targeting the same hub within a single conversation **rolls up into one ingestion** rather than firing per WebSearch call. Distinct topics in the same conversation each get their own ingestion.

### Manual

User explicitly says *"ingest that research"* or `/ingest research` is invoked against an existing `raw/research/...` file.

## Primary output: hub placement

For every named entity (model, person, company, framework, paper, product, concept) surfaced by the research, add to the relevant `agent_brain/references/` hub:

```
- **<Name>** (<provider/origin>, <YYYY-MM>) — <one-sentence opinionated description, including the user's likely take if inferable> · [[link to raw/research snapshot]] · [<external URL>](...)
```

**Be liberal about creating new hubs under Auto.** The standard rule ("3+ scattered references") is relaxed to "create on first substantive mention if no hub fits" — see `agent_brain/understanding/standards/topic-hubs.md`. Empty stubs with one entry and a `## Known gaps` section are acceptable; `/remsleep` will sweep them later.

New hub pages start as `state: needs-review`.

## Secondary output: raw snapshot

Write the research synthesis to `raw/research/YYYY-MM-DD/<topic-slug>.md`:

```yaml
---
type: research
summary: "<one-line take on what the research found>"
topic: "<topic-slug>"
queries: ["query 1", "query 2", ...]
sources:
  - url: <URL 1>
    title: <title>
  - url: <URL 2>
    title: <title>
  # one entry per WebFetch / cited result
date_researched: YYYY-MM-DD
triggered_by: "<short note on what prompted the research — user's question, in-flow follow-up, etc.>"
tags: [research, <topic>]
---
```

Body:
- **TL;DR** (3–5 bullets — the assistant's synthesis, opinionated where signal warrants)
- **Key findings** (the substantive content from chat, lightly reformatted)
- **Source notes** (which source said what — anchors for later citation)
- **Open questions** (anything the research didn't resolve — fodder for follow-up)

This file is the provenance anchor. Hub entries link back to it. `/remsleep` can re-derive context if hubs feel thin.

## Conflicts with existing brain content

If the research surfaces a fact that **contradicts** an existing brain page (a hub entry, a take, a project note), **do not overwrite the existing content**. Instead:

1. Add the new fact alongside the old.
2. Mark it with `> Conflict noted YYYY-MM-DD: <one-line summary of the disagreement>`.
3. Leave resolution to `/remsleep`, which sweeps `state: needs-review` and conflict markers.

Silent overwrites destroy provenance and confuse the user when they re-read the page.

## Relationship to `article.md`

- `article.md` — user is **consuming** external content (a blog post, paper, podcast transcript). Source is one URL or document.
- `research.md` — assistant is **producing** synthesis from multiple sources during a conversation. The chat answer IS the source.

If genuinely ambiguous (the user dropped a single URL and asked "what is this and what else is out there?"), prefer `research.md` — the multi-source synthesis is the more useful artifact.

## Notes

- **Don't ingest below threshold.** Quick lookups are not durable knowledge.
- **Hubs first, snapshot second.** If the hub layer is right, the snapshot is recoverable; if the hub is missing, the snapshot may never be re-found.
- **One entity per hub entry.** Resist the temptation to lump "GPT-5, Gemini 3, and Claude 5" into one bullet — each model gets its own entry.
- Provenance + tracking are handled by `SKILL.md`.
