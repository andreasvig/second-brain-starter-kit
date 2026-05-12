---
phase: sweep
default: true
agent: opus
---

# sweep — graph maintenance

Mechanical execute, no voice gate, high volume OK. Hub-first paradigm.

**Order matters** — per the [[agent_brain/understanding/standards/topic-hubs|topic-hubs standard]] and the [[agent_brain/understanding/standards/lateral-linking|lateral-linking standard]], hub work happens before lateral-linking back-fill. A spoke without a hub anchor is a leaf without a tree.

## Step 1 — Hub reconciliation (do first)

Scan the last ~7 days of activity (changelog, meetings processed, sources ingested) for models / people / companies / papers / concepts that aren't yet on the relevant hub in `agent_brain/references/`. Use search (Obsidian CLI if available, otherwise `grep -rln`) to check whether the entity is already catalogued. **Add entries directly** — hub adds are mechanical execute. Flag descriptions that materially shape the user's voice (an opinionated take embedded in the entry blurb) for review.

Also:

- **Sub-hub split check** — for any hub past ~25–30 entries or with a sub-tier of 5+ obvious members, flag a candidate split (see topic-hubs "Sub-hub splits"). Propose the split structure; don't auto-execute the split during /remsleep.
- **`last-reconciled` sweep** — check dates on existing hubs; flag any >14 days old.
- **New hub candidates** — if you spot a cluster of 3+ items that don't fit any existing hub, build the hub (be liberal). Use the standard's entry format and frontmatter; add the hub to `_index.md` under References.

## Step 2 — Linking search (do second)

For each new hub entry from Step 1, search the brain for pages that should back-link. Insert wikilinks. Mechanical execute.

## Step 3 — Lateral-linking back-fill (do last, only on hub-anchored content)

One chunk per remsleep run until done. Pick **1–2 archive pages** (long-form notes, post archives, project pages) that don't yet have a `## Related` section. For each, **first verify the page's facts are hub-anchored** (every named model/person/company should already have a hub entry — if not, return to Step 1 for that fact before doing lateral work). Then scan ~10–15 thematic siblings using the lateral-linking standard's signals (same hub touched / same entity / same theme / same contrarian frame). Add a `## Related` section with 2–4 wikilinks + one-line gloss each. Then back-link symmetrically — open each sibling, add this page to its `## Related` (create section if absent).

**Why this order matters**: lateral edges between un-anchored spokes don't make a navigable graph, they make a tangle. The hub layer is what makes the brain beat raw search; lateral links earn their keep only on hub-anchored content.

## Output

Hub additions, hubs reconciled, lateral-linking back-fill counts.
