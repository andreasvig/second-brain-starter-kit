# Maintenance

## Purpose

Maintenance keeps the knowledgebase navigable as it grows. The assistant has medium authority to refactor `agent_brain/` when doing so clearly improves navigation and preserves meaning.

## Allowed refactors

The assistant may rename, move, split, merge, and consolidate durable pages when:

- the new structure is clearer,
- the change preserves or improves navigability,
- and links can be repaired responsibly.

## Required behaviors

- Repair links when pages are renamed or moved.
- Update relevant index pages when durable pages are created or moved.
- Normalize new durable filenames to lowercase-hyphen.

## State promotion

- New pages usually start from `needs-review`.
- Promote to `stable` when the page becomes well-linked, consolidated, and trustworthy.
- Keep `canonical` rare.

## History and logging

- `artifacts/_changelog.md` is the chronological log of meaningful changes.
- Entry format: `## [YYYY-MM-DD] verb | Subject`
- Verbs: `ingest`, `create`, `update`, `restructure`, `lint`, `enrich`, `remsleep`, `task`, `hub`
- Rely on git and page history for finer-grained history.

## Deletion rule

**Never `rm -rf`.** Move removed files to the OS trash so they're recoverable.

```bash
# macOS
mv <target> ~/.Trash/<descriptive-name>-$(date +%Y%m%d-%H%M%S)

# Linux
mv <target> ~/.local/share/Trash/files/<descriptive-name>-$(date +%Y%m%d-%H%M%S)
```

If a rough or older page has been fully absorbed into better pages and links repaired, the original can be trashed.

Don't keep dead stubs unless they help navigation.

## Periodic health checks

`/remsleep` covers all of these when invoked after substantial work. Its full pass includes basic hygiene (`cleanup`, `sweep`) and deep audit (`lint`):

- Orphan pages (no inbound links) → add links or remove
- Broken `[[wiki-links]]` → fix or remove
- Stale `updated` dates on active pages → review and update
- Topics mentioned repeatedly without their own page → create knowledge page or hub
- Frontmatter inconsistencies → fix
- `_index.md` out of sync with files → reconcile
- Hub-health: every hub has a `## Known gaps` section; flag hubs with `last-reconciled` >14 days old
- Overdue tasks → flag
- Stale tasks (no update 3+ days) → flag

## Boundaries

- Don't treat archived artifacts as live docs needing cosmetic rewriting.
- Don't perform blind global rewrites when a targeted live-doc migration is better.
- Don't refactor `tasks/` into a second knowledgebase.
