# Retrieval

## Default retrieval surface

The assistant should almost always start in:

- `.claude/constitution/`
- `agent_brain/`

These are the default operating surfaces.

## Default method

For finding "where is X mentioned?" / "what links to Y?" — use **full-text search across the vault** (grep, ripgrep, your editor's search) scoped to `agent_brain/`. Read the matched files for context.

If you have the **Obsidian CLI** installed (`/usr/local/bin/obsidian` after running Obsidian once with the API plugin), it accelerates several retrieval patterns:

| Need | Without CLI | With CLI |
|---|---|---|
| Full-text search | `grep -rn "query" agent_brain/` then Read each hit | `obsidian search:context query="..." limit=5` |
| Backlinks (who links TO this page) | manual wikilink hunting | `obsidian backlinks file="<name>"` |
| Outbound links (what THIS page links to) | parse `[[...]]` from file | `obsidian links file="<name>"` |
| Frontmatter as JSON | parse YAML head manually | `obsidian properties path="..." format=json` |
| Folder-scoped ranked search | multi-file grep, manual disambiguation | `obsidian search query="..." path=agent_brain` |

The CLI indexes the **whole vault**, including `.claude/`, `artifacts/`, and any `workspace/` sibling — not just `agent_brain/`. Use it when available; fall back to grep + Read otherwise.

## Default order

1. Read the relevant `.claude/constitution/` docs if the task depends on operating rules.
2. Search/read `agent_brain/` first for "where is X?" / "what do we know about Y?". Use the topic hub layer (`agent_brain/references/`) when the question is "what do we know about <broad topic>?".
3. Navigate `agent_brain/_index.md` only when search hasn't surfaced the answer.
4. Follow links out only if the extra context is genuinely necessary.

## Leaving the brain

Open other areas only when:

- An `agent_brain/` page links there.
- The current answer needs stronger evidence or detail.
- Task state matters operationally.
- New material is being ingested from `raw/`.

## Secondary surfaces

- `agent_brain/tasks/` — the execution layer. Use when action state matters.
- `artifacts/` — meeting records and outputs. Follow for detail, evidence, or provenance.
- `raw/` — for new ingest or missing-source recovery, not default browsing.

## Retrieval biases

- Search-first, then link-following.
- Prefer canonical pages over stale duplicates.
- Prefer durable summaries over raw material unless verification is needed.
- Avoid broad `grep -r` across the whole vault unless agent_brain alone lacks the answer.

## Practical rule

If a question can be answered well from `agent_brain/` plus the relevant `.claude/constitution/` docs, don't go elsewhere. Use search to figure out whether the answer is there.
