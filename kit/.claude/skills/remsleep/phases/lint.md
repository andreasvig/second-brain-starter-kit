---
phase: lint
default: true
agent: opus
---

# lint — deep brain health check

Deep audit. Goes broader and deeper than the mechanical `cleanup` + `sweep` phases — inspects the whole brain for structural issues using parallel scout agents.

Replaces the standalone `/lint-wiki` skill. Same shape, integrated into the default remsleep full pass.

## What to do

Use parallel Agent calls to run multiple audit scouts simultaneously, then consolidate findings.

### Step 1 — Read structure

Read `agent_brain/_index.md` and `.claude/constitution/knowledgebase.md` + `.claude/constitution/writing.md` to understand the current schema and expected structure.

### Step 2 — Launch scout agents (parallel)

Spawn 5–8 Haiku agents in parallel, each checking one dimension:

**Scout 1: Frontmatter validator**
- Every brain page has YAML frontmatter
- Required fields present for each page type (per `.claude/constitution/writing.md`)
- Field values match allowed enums
- `updated` is a valid date

**Scout 2: Link integrity**
- All `[[wiki-links]]` resolve to existing pages
- No dead links pointing to deleted/renamed pages
- External URLs in frontmatter are properly formatted

**Scout 3: Orphan and coverage**
- Pages not linked from `_index.md` or any other page
- Entries in `_index.md` that point to nonexistent files
- Directories with files not represented in the index

**Scout 4: Staleness**
- Pages with `updated` date >30 days old that reference active projects
- Tasks past due date, still open
- Tasks unchanged >3 days, still open/in-progress
- Blocked tasks without explanation in body

**Scout 5: Content quality**
- Pages with only frontmatter and no body content
- Very short pages (<3 lines of body) that should have more detail
- Pages missing source attribution where applicable

**Scout 6: Cross-reference gaps**
- Pages about the same topic that don't link to each other
- People mentioned in meeting notes without links to their person pages
- Projects mentioned in task files without links to project pages

**Scout 7: Naming and conventions**
- File names follow lowercase-hyphen convention
- Folders match expected structure
- Tags follow documented conventions

**Scout 8: Hub health (`agent_brain/references/`)**
- Every hub has a `## Known gaps` section (mandatory; missing it is a failure mode)
- Every hub has `last-reconciled:` in frontmatter; flag any >14 days old for a sweep
- Every hub entry follows the standard's format
- No hub has zero entries (empty hubs are noise)
- Hubs untouched in >30 days → flag for retirement consideration

### Step 3 — Triage findings

Collect all scout results. Classify each finding:

- **Critical** — broken links, missing frontmatter, index out of sync
- **Warning** — stale pages, orphans, missing cross-references
- **Info** — minor convention issues, suggestions

### Step 4 — Fix and report

**Auto-fix** (do silently):
- Add missing pages to `_index.md`
- Remove dead entries from `_index.md`
- Add missing cross-reference links (mechanical, hub-anchored only)
- Fix obvious frontmatter issues (missing `updated` → today; missing `state` on brain page → `needs-review`)

**Flag for human**:
- Orphan pages that might need deletion
- Stale pages that might be obsolete
- Content quality issues requiring judgment
- Naming convention violations that would break existing links

## Output

```
## Lint — [date]

### Auto-Fixed
[list of what was fixed silently]

### Needs Your Input
[items requiring human judgment, with clear questions]

### Brain Stats
Pages: X | Tasks open: X | Overdue: X | Last changelog: [date]
```
