---
summary: "How the brain grows over time: hub-first ingestion, lateral linking, compounding through use, and the soft settings that govern aggressiveness."
---

# How the brain grows

This is the load-bearing doc. Read it before you've used the system for a week, and again at month two. The whole point of the kit is that the brain compounds — and *how* it compounds is the difference between a useful long-lived knowledge base and a tangle of orphaned notes.

## The compounding loop

Every interaction can grow the brain. The skills define when growth happens:

- **`/learn`** — captures durable knowledge from a conversation before context is lost
- **`/ingest`** — extract knowledge from any raw source. Classifies (meeting, article, journal, export, etc.) and applies the matching template from `templates/`.
- **`/transcribe`** — turn audio into a transcript in `raw/`, then chain into `/ingest`.
- **`/remsleep`** — substantial-work consolidation: promotes new pages, reconciles hubs, surfaces patterns, reports, and audits
- **Inline updates** — the assistant can update existing pages mid-conversation when something durable surfaces

Each one writes structured, cross-linked markdown. Six months in, the brain has hundreds of pages, thousands of links, and answers questions that would have taken hours of search.

But it only compounds if the structure stays navigable. That's where the hub-first paradigm comes in.

## The hub-first paradigm

> The hub layer is what makes the brain beat raw search. Lateral links are decoration without a hub anchor.

When a new fact enters the brain — a model name in a paper, a person mentioned in a meeting, a tool you started using — there are three steps, in order:

### Step 1 — Hub placement (canonical)

Find the **topic hub** the fact belongs on, in `agent_brain/references/`. Add an entry. The hub entry is canonical: it's the answer to "what's the story with this thing?".

If no existing hub fits, **create one**. Be liberal — any topic with 3+ scattered references in the brain is a candidate.

### Step 2 — Linking search

Search the brain for pages that should back-link to the new entry. If an existing project, decision, or note should reference it, add the link. This keeps the graph dense.

### Step 3 — Lateral linking

Add `## Related` sections on the spokes (content pages) that touch this fact. Lateral edges connect spokes that *already share* a hub anchor. Never use lateral linking as a substitute for hub placement.

**A spoke without a hub anchor is a leaf without a tree.** Lateral links between un-anchored spokes don't make a navigable graph — they make a tangle.

This applies to every ingestion path: `/learn`, `/ingest` (any template), `/remsleep` Phase 3, ad-hoc research mid-conversation. The skills enforce it.

See `agent_brain/understanding/standards/topic-hubs.md` and `agent_brain/understanding/standards/lateral-linking.md` for the full standards.

## What hubs look like

A hub is a single-page index for a big topic — *"what do we know about X?"* → load this hub → pick entry → follow link.

```markdown
# Image Models

Navigational hub for text-to-image and image-editing models.

## Frontier tier

- **Acme Image 5** (Acme Labs, 2026-04) — current frontier; strong prompt
  adherence, good coherence on complex scenes · [[projects/acme-eval]]
- ...

## Workhorse tier

- ...

## Known gaps

- No coverage of inpainting-specific models yet — would warrant a sub-hub
  if accumulation continues.

## Related

- [[references/video-models]]
- [[references/model-providers]]
```

Notes:
- **Opinionated groupings** — frontier / workhorse / legacy reflects real takes. That's a feature.
- **Thin content, not thin signal** — each entry has a one-sentence opinionated description.
- **Mandatory `## Known gaps`** — explicit honesty about what's missing.
- **`last-reconciled` frontmatter** — freshness signal for completeness sweeps.

## When a hub gets too big

**Split at ~25–30 entries** OR when a clear sub-tier has 5+ entries. The original becomes a **meta-hub** — ~10 lines of orienting prose plus links to the sub-hubs. This preserves all existing wikilinks (the graph doesn't break) while letting catalog work happen on lean sub-hubs.

Example: `llms.md` → `llms-frontier.md` + `llms-workhorse.md`. The meta-hub stays as the entry point.

## The soft settings — `learning-aggressiveness.md`

How eagerly the assistant captures new knowledge and learns your patterns is controlled by `.claude/constitution/learning-aggressiveness.md`. Two global knobs:

- **Ingestion aggressiveness** — `auto` / `ask` / `off`. Governs how much the assistant proposes brain updates from durable signal in conversations and sources.
- **Self-learning aggressiveness** — `auto` / `ask` / `off`. Governs how much the assistant observes and codifies *your* patterns (writing style, code style, decisions, preferences).

Per-domain overrides let you tune specific areas. Example: `comms_style: ask` says "don't auto-codify my voice — always ask before adding examples to the references". Useful when you're protective about a specific area.

Personas at `personas/*.yaml` ship sensible defaults for common roles (researcher, coder, communicator, manager, generalist). Use one as a starting point at setup.

## The consolidation pass

`/remsleep` runs when substantial work has happened — often at the end of a productive day, or less frequently if recent sessions were light. It does maintenance the inline flow can't:

- **Promotes `/learn` output** — pages written under time pressure as `needs-review` get reviewed and either promoted to `stable` or flagged.
- **Reconciles hubs** — scans recent activity for entities that aren't yet on a hub. Adds them. Flags hubs whose `last-reconciled` is >14 days old.
- **Lateral-linking back-fill** — picks 1–2 spokes per run without `## Related` sections and adds them.
- **Surfaces patterns** — if you've done the same multi-step procedure 3+ times, surfaces it as a candidate skill.
- **Reflection questions** — if `self_reflection: true`, generates 3–5 targeted questions for you.

This is the heavier discipline that keeps the brain from drifting. Quiet days do not need it; multi-week gaps after substantial work compound into mess.

## Compounding through correction

Every "no, do it this way" should land somewhere the assistant will read again:

- **A specific fact about you** → `agent_brain/about_user/` page
- **A working preference** → `.claude/projects/.../memory/` (auto-memory)
- **A reusable rule** → `agent_brain/understanding/standards/`
- **A repeated procedure** → `agent_brain/understanding/playbooks/`
- **A pattern across domains** → `agent_brain/understanding/patterns/`

Don't let corrections evaporate at the end of a conversation. The whole point of the system is that it remembers so you don't have to repeat yourself.

## The honest failure modes

Worth naming, so you can spot them:

- **Hub debt** — facts ingested without hub placement. Symptom: lots of orphan-ish content pages that don't show up when you search the relevant topic.
- **Lateral debt** — content pages without `## Related`. Symptom: graph view is dominated by hub-spoke edges; threads of a topic over time aren't visible.
- **Page sprawl** — too many tiny pages instead of consolidating. Symptom: `_index.md` is unreadable.
- **`needs-review` pile-up** — `/learn` ran lots of times, but `/remsleep` didn't promote. Symptom: the brain has 30+ `needs-review` pages of varying quality.
- **Stale hubs** — `last-reconciled` >14 days. Symptom: when you ask about a topic, the hub feels incomplete.

The consolidation pass catches most of these, and its lint phase catches the rest. They're recoverable as long as you spot them within a few weeks; ignored for months, they become a mess.

## Related

- `agent_brain/understanding/standards/topic-hubs.md` — full hub standard
- `agent_brain/understanding/standards/lateral-linking.md` — full lateral-linking standard
- `kit/.claude/constitution/learning.md` — when to compound
- `kit/.claude/constitution/learning-aggressiveness.md` — soft settings
