---
summary: "Common breakage and how to fix it: skill discovery, MCP auth, Obsidian quirks, hook failures, brain drift."
---

# Troubleshooting

## Skills don't appear in Claude Code

Check in this order:

1. **Folder structure** — is it `.claude/skills/<name>/SKILL.md` (uppercase)? Loose `.md` files directly in `.claude/skills/` are silently ignored.
2. **Frontmatter** — does the SKILL.md have `name:` and `description:`?
3. **YAML safety** — is the `description` quoted if it contains `#`, `:`, or leading `-`? Unquoted `#` truncates the description silently.
4. **Built-in collision** — names like `status`, `resume`, `init` are shadowed by built-in slash commands. Rename to `check-status`, `resume-handover`, etc.
5. **Hot reload** — Claude Code watches the skill directory. If a skill still doesn't appear, restart Claude Code.

Full reference: `agent_brain/understanding/standards/skill-authoring.md`.

## Obsidian doesn't show `.claude/` or `.obsidian/`

- Install the **Show Hidden Files** community plugin (by polyipseity) and enable it.
- Without this plugin, Obsidian hides any folder starting with `.` from the file tree.

## MCP server auth hangs

Symptom: running `/mcp` after OAuth shows "press enter" and never proceeds.

Workaround: `Ctrl+C` and restart Claude Code. The OAuth completed; the prompt was stuck. No re-auth needed.

## PreCompact hook keeps warning

Symptom: every time you `/compact`, the hook nudges you to `/learn`.

The hook checks for `artifacts/.last-learn` modified within the last 30 minutes. If you don't want the nudge:

- Run `/learn` first (touches the file).
- OR remove the hook from `.claude/settings.json`.
- OR replace the warning with `exit 0` to silence it.

## The agent doesn't follow the constitution

- **CLAUDE.md missing** — was `CLAUDE.md.template` renamed to `CLAUDE.md` after install? Check the vault root.
- **CLAUDE.md doesn't reference the constitution** — should have lines like "Read `.claude/constitution/identity.md` and `.claude/constitution/guide.md`". If not, the agent isn't loading the rules.
- **Constitution file missing** — check that all referenced files in `guide.md` actually exist in `.claude/constitution/`.

## The brain feels disorganised

This is the natural state after 2–4 weeks of use without `/remsleep`. The fix:

1. Run `/remsleep` — finds orphans, broken links, stale dates, missing cross-references, promotes pages, reconciles hubs, and back-fills lateral links.
2. Review the `### Lint` and `### Needs attention` sections in the report.
3. Manually scan `agent_brain/_index.md` for sections that have grown beyond a screen — split into sub-pages.
4. Check hubs in `agent_brain/references/` for `last-reconciled` dates — sweep the stale ones.

If you've never run `/remsleep`, try it now. It's the maintenance pass the rest of the system depends on.

## Hub bloat

Symptom: a hub has crossed ~30 entries and is hard to scan.

Fix: split. Pick a sub-axis (frontier vs workhorse, by-provider, by-domain). The original hub becomes a meta-hub with ~10 lines of orienting prose plus links to the sub-hubs. Existing wikilinks pointing to the original keep working.

See `agent_brain/understanding/standards/topic-hubs.md` "Sub-hub splits" for the full procedure.

## `needs-review` pile-up

Symptom: many pages have `state: needs-review` and feel uncurated.

`/learn` writes pages as `needs-review`. `/remsleep` Phase 3 promotes them to `stable`. If `/remsleep` hasn't run in a while:

1. Run `/remsleep` once — synthesis will batch-review `/learn` output since the last remsleep run.
2. For older `needs-review` pages, ask the assistant to do a "stable promotion sweep" — review each, promote or trash.

## Lost context after compaction

Symptom: `/compact` ran without `/learn` first and you've lost thread.

Recovery options (in order of usefulness):

1. **Check `artifacts/handovers/latest.md`** — if you ran `/handover` first, the task state is there. `/resume-handover`.
2. **Check the conversation summary** — Claude Code shows it after compaction. Often enough to re-orient.
3. **Read the changelog** — `artifacts/_changelog.md` shows what landed in the brain recently.
4. **Re-read the task** — `agent_brain/tasks/<active-task>.md` carries persistent context.

For next time: when context is filling, the assistant should suggest `/learn` and `/handover` proactively. If it's not suggesting, something is wrong with `context-continuity.md` — re-read it.

## Where to file issues

If something's broken in the kit itself (not your customisations), open an issue at the kit's GitHub. Include:

- Which path you installed (Path 1 or Path 2)
- Your agent CLI (Claude Code / Cursor / other)
- The exact behaviour you're seeing
- What you've tried
