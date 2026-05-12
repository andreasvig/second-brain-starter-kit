---
type: knowledge
summary: "Recommended Obsidian settings if you choose Obsidian as your editor — link format, hidden files, ignore filters."
state: stable
updated: {{TODAY}}
tags: [standards, obsidian]
---

# Obsidian Config Standard

If you chose Obsidian at setup, these are the deliberate settings for this vault. Skip this file entirely if you're using a different editor — the brain works fine as plain markdown.

## Links (Settings → Files & Links)

| Setting | Value | Why |
|---|---|---|
| **Use [[Wikilinks]]** | ON | Better backlinks pane, graph view, search. The kit was written using `[[wikilinks]]`. |
| **Automatically update internal links** | ON | Renames don't break links. Critical for a long-lived brain. |
| **New link format** | Shortest path when possible | Cleaner wikilinks (`[[jane-doe]]` vs full path). |
| **Detect all file extensions** | ON | Required so Obsidian sees skill files, YAML, config files. |

**Note**: the general advice "use relative markdown links, not wikilinks" applies to **code repositories** (where docs need to render on GitHub). This vault is Obsidian-first — opposite tradeoff. Most agent CLIs handle both formats.

## Hidden files

- Install the **Show Hidden Files** community plugin (by polyipseity) and enable it. Without it, Obsidian hides `.claude/` and `.obsidian/` from the file tree.

## Excluded files (`.obsidian/app.json` → `userIgnoreFilters`)

The kit ships with these patterns excluded — keeps code-repo noise and OS metadata out of search:

```json
[
  "/node_modules/",
  "/\\.git/",
  "/dist/",
  "/build/",
  "/__pycache__/",
  "/\\.venv/",
  "/venv/",
  "/\\.next/",
  "/\\.DS_Store$/",
  "/Thumbs\\.db$/"
]
```

## Templates folder

- Location: `.claude/templates/`
- Obsidian's built-in Templates plugin: enabled. Point it at `.claude/templates/` if it asks.

## Optional: Obsidian CLI

The Obsidian CLI (community plugin + `npm install -g obsidian-cli` or equivalent) gives you `obsidian search`, `obsidian backlinks`, `obsidian links` from the terminal. The assistant uses these when available — see `.claude/constitution/retrieval.md`. If you don't install it, the assistant falls back to grep + Read.
