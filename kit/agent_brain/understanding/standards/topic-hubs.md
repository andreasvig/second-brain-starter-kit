---
type: knowledge
summary: "How to build and maintain navigational topic hubs in agent_brain/references/. Covers the hub-first paradigm, entry format, creation triggers, sub-hub splits, freshness signals, and retirement rules."
state: stable
updated: {{TODAY}}
tags: [standard, hubs, references, hub-first]
---

# Topic Hubs Standard

Topic hubs live in `agent_brain/references/` and answer "what do we know about X?" → load one hub → pick entry → follow link.

## The hub-first paradigm

> The hub layer is what makes the brain beat raw search. Lateral links are decoration without a hub anchor.

**Order of operations for any new fact entering the brain**:

1. **Hub placement first** — find the topic hub the fact belongs on; add an entry. If no hub fits, *create one* (see "When to create a new hub" below). The hub entry is canonical.
2. **Linking search** — search the brain for pages that should back-link to this entry; insert wikilinks there.
3. **Lateral linking** — `## Related` / spoke-to-spoke wikilinks come **after** hub placement, not in lieu of it. See `lateral-linking.md`.

A fact that lands in a content page without a corresponding hub entry is half-ingested. A spoke without a hub anchor is a leaf without a tree. Lateral edges between un-anchored spokes don't make a navigable graph — they make a tangle.

This applies to every ingestion path: `/learn`, `/ingest` (any template), `/remsleep`, ad-hoc research.

## What a hub is

- **Navigational, not encyclopedic.** Entries link out to where the actual detail lives.
- **Opinionated groupings are fine.** Grouping by tier ("frontier / cheap-at-scale / legacy") reflects real takes.
- **Thin content, not thin signal.** Each entry carries a short opinionated description — enough to answer "what is this?" without clicking out.

## Entry format

```
- **<Name>** (<provider/origin>, <YYYY-MM or year>) — <one-sentence opinionated description> · [[link1]] · [[link2]]
```

Pick 1–3 most-useful links per entry. Description should answer "what's the story with this?" — opinionated beats neutral.

**Source links don't have to be user-output.** Internal wiki-links (post archives, takes, project pages) are best, but when an entry surfaces in research and the user hasn't written about it yet, an external link (vendor blog, paper URL, HuggingFace) is correct. Hubs reflect what exists in the topic space, not just what the user has touched.

## Frontmatter

```yaml
---
type: reference
summary: "<one-line>"
state: stable | needs-review
updated: <YYYY-MM-DD>           # last entry-level touch
last-reconciled: <YYYY-MM-DD>   # last completeness sweep
tags: [hub, <topic>]
---
```

`last-reconciled` is the freshness signal. `updated` changes when any entry is touched; `last-reconciled` only when the hub is deliberately swept. An old `last-reconciled` tells the reader "this may be stale — consider a search as backup."

## Mandatory "Known gaps" section

Every hub ends with:

```markdown
## Known gaps

- [what's probably missing and why]
- [areas the brain is still thin on]
```

If genuinely no gaps: `- None known as of <date>.` The point is **explicit honesty about coverage** so readers don't trust an incomplete hub as complete. Missing this section is a failure mode.

## When to create a new hub

**Be liberal.** Plenty of hubs + plenty of links is the goal, not a conservative set. If you catch yourself thinking "this doesn't fit anywhere" for a new entry, that's the signal.

The threshold is **dial-aware** — it depends on `ingestion_aggressiveness` in `.claude/constitution/learning-aggressiveness.md`:

- **Under `Ask` / `Off`** — default rule: any topic with **3+ scattered references** across the brain is a candidate hub. The 3-reference threshold filters one-off mentions from genuine clusters.
- **Under `Auto`** — relaxed: create a hub on the **first substantive mention** if no existing hub fits. Empty stubs with one entry are acceptable; the `## Known gaps` section signals that coverage is thin. `/remsleep` sweeps these later — pages start as `state: needs-review` and either accrete entries (graduate to `stable`) or get merged/retired if they stay solitary.

The Auto threshold is intentional: a missing hub is the failure mode that breaks navigation. Under Auto, the assistant errs toward over-creation and lets the maintenance pass clean up.

When creating:
1. Use the entry format + frontmatter above (or copy `.claude/templates/wiki-hub.md`).
2. Add a line to `agent_brain/_index.md` under `## References → Topic hubs`.
3. Log the creation in `artifacts/_changelog.md`.
4. New hubs created under Auto start as `state: needs-review` so `/remsleep` can audit them.

## Update discipline (critical)

**Any time the brain ingests external information — research, talks, papers, meetings — the hub layer must absorb it first** (see "The hub-first paradigm" above).

Three-step update path, in order:

1. **Hub placement** — put the new entity on the relevant hub(s). Cross-list if it sits across two. If no hub fits, create one before continuing.
2. **Linking search** — search the brain for other pages that should link to the new entry. Insert wikilinks. Keeps the graph dense.
3. **Lateral linking** — only after 1+2, add `## Related` references on the spokes that touch this fact. Lateral edges connect spokes that already share a hub anchor — never substitute for hub placement.

Skills that must apply this discipline:
- **`/learn`** — hub placement first for any new fact surfaced in conversation.
- **`/ingest`** — hub placement first for entities named in the source, regardless of which template the source classifies into.
- **`/remsleep`** — hub reconciliation comes before lateral-linking back-fill. Flag stale `last-reconciled` dates.

## Verify before adding

Before adding an entity to a hub, **verify it isn't already there**. Search the hub file (or use `obsidian backlinks file="<hub>"` if the CLI is installed). Sub-agent and quick-scan workflows tend to over-claim coverage; a 30-second verify saves duplicate entries.

## Sub-hub splits

When a single hub grows past a certain size, navigation latency creeps back. Split into sub-hubs **when any of**:

- Total entries pass **~25–30**
- Any single sub-tier has **5+ entries** with a clear conceptual boundary (e.g. "frontier" vs "workhorse")
- The hub's `## Known gaps` section is naming sub-domains warranting their own coverage

### Naming convention

`<topic>-<sub-axis>.md` — flat naming, no folders. Examples:
- `llms.md` → `llms-frontier.md` + `llms-workhorse.md`
- `image-models.md` → `image-models-generation.md` + `image-models-classification.md`

Sub-axis should match the user's editorial groupings, not provider/license. The whole point of hubs is opinionated navigation.

### Meta-hub pattern

The original hub stays as a **meta-hub**: ~10 lines of orienting prose + links to the sub-hubs + Legacy section if cross-tier. Preserves all existing wikilinks pointing to the original (don't break the graph) while letting catalog work happen on lean sub-hubs.

```markdown
# LLMs

Meta-hub. Detail lives on the sub-hubs below — split when entry count crossed 27.

- [[llms-frontier|Frontier LLMs]] — closed + open-weights at the intelligence ceiling
- [[llms-workhorse|Workhorse LLMs]] — cheap-at-scale models, embeddings

## Legacy / historical reference
... (Legacy entries stay on the meta-hub if cross-tier)

## Related
... (cross-hub navigation stays here)
```

### Update `_index.md`

When you split, add the sub-hubs under the original entry in `_index.md` (indented bullets). Don't remove the parent — `_index.md` should still point at the meta-hub as the entry point.

### When NOT to split

- Hub has <25 entries even with concentrated sub-tiers — don't split prematurely.
- Sub-tiers are weakly defined or shifting — let them stabilize first.
- The hub already serves a single coherent question well — splitting just to reduce length is wrong.

## Retirement

Move an entry to a `## Legacy` section within the same hub when **any two** of:

- It's no longer offered by the provider.
- It's no longer SOTA or relevant in its tier.
- It hasn't appeared in fresh material for 6+ months.

**Don't delete.** Legacy entries preserve history.

## Related

- [[lateral-linking]] — horizontal axis: spoke-to-spoke `## Related` discipline
- [[skill-authoring]] — sibling standard governing skill page shape
