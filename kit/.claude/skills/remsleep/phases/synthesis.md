---
phase: synthesis
default: true
agent: opus
---

# synthesis — deep consolidation

Interpretive work only — no mechanical sweeps here. Mechanical work lives in the `sweep` phase.

## What to do

- **Create knowledge pages** proactively in `agent_brain/understanding/` (decisions/playbooks/patterns/standards/unknowns). Create them when real patterns exist.
- **Long-range connections**: find pages that should link but don't. Insert `[[wiki-links]]`. Cap at ~10 link-adds for synthesis-level connections; bulk lateral-linking belongs in `sweep`.
- **Spot emerging themes**: what's getting attention vs. fading?
- **Check knowledge pages** for staleness. Classify into false-now / true-then-false-now / still-true. Flag substantive content for human review; don't auto-edit.
- **Detect repeated workflows**: if the user has manually done the same multi-step procedure 3+ times recently (changelog + conversation evidence), surface as a candidate skill in the report. Don't auto-create — flag with a short description of the pattern. Vault-specific skills go in `.claude/skills/`.
- **Review `/learn` output since the last remsleep run** (using `cleanup`'s inventory — same since-last-remsleep window):
  - For pages marked `state: needs-review` created by `/learn` in the window: if content is substantive, well-linked, and reads as durable, **promote to `state: stable`**. If thin, unclear, or speculative, leave as-is and flag in "Needs attention".
  - If multiple `/learn` runs in the window touched overlapping topics (two new pages on adjacent subjects, or the same page edited twice), flag potential duplicates for user review — **do NOT auto-merge**. `/learn` provenance (`> Source: conversation YYYY-MM-DD`) is load-bearing and wrong merges mask history.
  - Skim memory entries added in the window against the rest of `MEMORY.md` for near-duplicates or direct contradictions with existing entries. Flag overlaps — don't auto-edit memory.

## Must produce or explicitly pass

Output must include at least one of: a page created, a page promoted, a page flagged stale, a duplicate flagged, a skill candidate flagged, or a theme insight surfaced. If nothing — close with `synthesis: pass — <one-line reason>` (e.g., "low-signal window, mostly mechanical execution"). The pass is honest; silently producing nothing is the failure mode this phase exists to prevent. Don't let mechanical edits in `sweep` disguise an empty synthesis.

## Output

Pages created/promoted, connections added, themes, skill candidates, `/learn` review — OR an explicit pass with reason.
