---
type: knowledge
summary: "Every content spoke (post, page, project, pattern) gets a `## Related` section linking 2–4 sibling spokes with one-line glosses. Lateral links come AFTER hub placement, never instead of it."
state: stable
updated: {{TODAY}}
tags: [standards, brain-architecture, graph, hub-first]
---

# Lateral Linking Standard

## Order of operations (read this first)

Lateral linking **never substitutes for hub placement**. The order is:

1. Hub placement (see [[topic-hubs]])
2. Linking search (search the brain for back-link candidates)
3. Lateral linking (this standard)

A spoke without a hub anchor is a leaf without a tree. Lateral edges connect spokes that *already share* a hub-anchored topic. If you find yourself reaching for a lateral link to give a spoke "somewhere to point", you skipped step 1 — go back and add the hub entry first.

## The principle

Hubs (`agent_brain/references/`) answer **"what do we know about X?"** — they catalog. Lateral links between spokes answer **"what's the thread of X over time?"** — they narrate. A brain with only hubs has a star topology; a brain with hubs *and* dense spoke-to-spoke linking has a real network where threads, contradictions, and continuations are navigable.

Without lateral linking:
- Content pages only point UP to hubs/decisions, never SIDEWAYS to predecessors
- The "thread" of a topic over time exists only inside summary lines, not as a navigable sub-graph
- The graph view is dominated by aggregators (changelog, hubs); the real semantic network is invisible

## Where this applies

Every content **spoke** needs a `## Related` section. "Spoke" means: any page that's *content* rather than *catalog*:

- Project pages in `agent_brain/projects/`
- Pattern, playbook, standard pages in `agent_brain/understanding/`
- Decision records
- Person pages in `agent_brain/people/`
- Posts and content artifacts in any project subfolder

**Does NOT apply to**:
- Hubs themselves (they have `## Related` for hub-to-hub navigation, not spoke-to-spoke)
- `_index.md` files (they ARE the navigation layer)
- Tasks (they link OUT to projects/people; nothing links TO tasks; a Related section is overkill)
- Changelog and chronological artifacts (write-only logs)

## Format

`## Related` heading at the bottom of the page. 2–4 wikilinks, one per line, each with a one-line gloss explaining the relationship from this page's perspective:

```markdown
## Related

- [[wikilink|short title]] — earlier datapoint in the same thread
- [[wikilink|short title]] — first surface of the take this page promotes
- [[wikilink|short title]] — contradicts the take here; worth re-reading together
```

**Rules**:
- **Always have the section, even when sparse.** If only 1 sibling exists, link 1. If zero, write "First surface — no priors yet." The discipline of always-having-the-section is what creates the discipline of always *thinking* about siblings.
- **One-line gloss is mandatory.** Bare wikilinks are link-bait. The gloss tells the reader why they'd click.
- **Symmetric back-linking.** When you add page B to page A's `## Related`, also add page A to page B's. Graph value is bidirectional.

## How to find candidates

When writing or retrofitting a spoke, scan in this order — strongest signal first:

1. **Same take being illustrated** — if both pages illustrate the same decision/standard, they're siblings.
2. **Same hub touched** — if both added entries to the same `references/<hub>`, they share theme.
3. **Same entity named** — if both name a specific model/person/company/paper, that's direct continuity.
4. **Same contrarian frame** — if both close with the same editorial reframe, they're a thread.

Stop at 4 candidates per page. More becomes noise.

## When to add it

- **For every new spoke**: lateral linking happens at creation time.
- **For older spokes without Related sections**: end-of-day consolidation retrofits one chunk per night until done.
- **Mechanical execute** — no voice gate. Lateral linking is graph maintenance; doesn't touch editorial voice.

## Goal

3–4 cross-spoke links per spoke — enough to make threads visually distinct in the graph view without flooding.

## Related

- [[topic-hubs]] — vertical axis: hub format and catalog discipline
- [[skill-authoring]] — sibling standard governing skill page shape
