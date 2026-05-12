# Contributing

Thanks for looking. A few notes before you file or PR.

## What this repo is

A personal dogfooding project. The maintainer uses it daily; the roadmap reflects what they need, not a community-driven prioritisation. That's not a *"go away"* — it just means: be patient with response times, and treat the kit as a starting shape you can fork.

## Reporting bugs

Open an issue. Useful to include:

- Which agent CLI you're using (Claude Code, Cursor, OpenCode, etc.)
- Whether Obsidian is installed
- Whether you finished setup (Stages 1–3 are enough; later stages bring more)
- A copy-paste of what you did and what happened
- The relevant constitution / skill / standard file if you suspect the rule is wrong

If something's just unclear in the docs, that's also a bug — file it.

## Proposing changes

For anything beyond a typo fix, **open an issue first** so we can discuss. PRs without prior discussion may be closed.

Areas where contributions are most welcome:

- Skill improvements that compose with existing patterns
- Adapters for other agent CLIs (Cursor, Codex, OpenCode) — see `kit/docs/adapters.md`
- New ingest templates (drop into `kit/.claude/skills/ingest/templates/`, add a row to `templates/README.md`)
- New training-wheels tips (edit `kit/docs/tips.md`, follow the rotation rules)

Areas to think twice about:

- Wholesale rewrites of the constitution. It's the load-bearing surface; small targeted PRs land faster.
- New "core" skills. The kit ships eight; the bar for adding a ninth is high.
- Changing the hub-first paradigm. It's the thing that makes the brain stay navigable past 100 pages — diverge in your own fork before proposing here.

## Where to read first

- `README.md` + `INSTALL.md` — what + how
- `kit/docs/01-how-it-works.md` — architecture
- `kit/docs/05-customising.md` — how the system evolves
- `kit/agent_brain/understanding/standards/skill-authoring.md` — if you're writing a skill
- `kit/agent_brain/understanding/standards/topic-hubs.md` — if you're touching the brain shape

## Style

- Markdown only; the kit is markdown-defined, no JS/TS/Python in this repo.
- Keep prose tight. The agent reads everything you write — words have a token cost at runtime.
- One concern per file. Don't pile rules from multiple constitution files into one.

## Code of conduct

Be kind. Disagreements happen; ad-hominems don't.
