# Your Second Brain — Starter Kit

An AI-maintained knowledge base that tracks your work, projects, people, hobbies, and decisions — so you can focus on living instead of remembering.

## What it feels like

Drop a meeting transcript in `raw/`, say *"ingest this"* — your wiki gets the decisions, action items, and people pages linked together. Say *"/morning-brief"* the next day — you get the relevant context for what's ahead. Six months in, *"/prep coffee with Sam"* pulls everything that matters: open threads, recent context, shared history, what you promised last time.

The wiki is the source of truth. The assistant maintains it for you.

## The idea

Humans abandon wikis because the maintenance burden is relentless. AI doesn't get bored. The wiki compounds — every source ingested, every meeting processed, every question answered leaves structured knowledge behind. Cross-references are already there. Contradictions get flagged. Synthesis keeps getting richer.

Six months from now, preparing for any conversation is a one-line command. Remembering the promise you made a friend three months ago is a conversation, not an archaeological dig. The system learns how you live and work.

> Built on the [LLM wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) Karpathy described.

## What you get

- A **personalised AI assistant** with a name, personality, and stance you choose at setup.
- A **structured wiki** (`agent_brain/`) the assistant maintains for you — projects, people, decisions, habits, knowledge.
- **Daily rhythm skills** — morning brief, mid-day status, end-of-day consolidation.
- **Knowledge skills** — process meetings, ingest sources, distill conversations, capture handovers.
- **Aggressiveness dials** — soft settings for how eager the assistant is about adding things to the brain and learning your patterns.
- **Hub-first paradigm** — the brain stays navigable as it grows past 100 pages.

## What you need

| Required | Recommended | Optional |
|---|---|---|
| A markdown editor | [Obsidian](https://obsidian.md) (free) | Calendar / email / Slack MCP servers |
| An agent CLI | [Claude Code](https://claude.com/claude-code) | The Obsidian CLI for fast retrieval |
| 30 minutes for setup | | |

The kit is built first against Claude Code + Obsidian. It works in plain markdown with any agent CLI — see `INSTALL.md` Path 2.

## Get started

1. **Install** — clone or download this repo, then follow `INSTALL.md`.
2. **Setup** — once the kit is copied to your vault, your agent reads `interview/setup.md` and walks you through a staged interview (~50 minutes total, but you can pause after any section).
3. **First run** — try `/morning-brief`, ingest your first source, see what your assistant does.
4. **Iterate** — every "no, do it this way" becomes a rule. The system learns how you work.

## Repository layout

```
your-second-brain-kit/
├── README.md                  this file
├── INSTALL.md                 prerequisites + two install paths
├── LICENSE                    MIT
└── kit/                       what gets copied into your vault
    ├── CLAUDE.md.template     lean entry point with placeholders
    ├── .claude/               constitution, skills, templates, harness config
    ├── .obsidian/             Obsidian preset (skip if not using Obsidian)
    ├── agent_brain/           your durable wiki (mostly empty seed)
    ├── artifacts/             generated outputs (changelog, ingest log, etc.)
    ├── docs/                  how the system works — the agent reads these for you
    ├── interview/             the staged setup interview
    ├── raw/                   raw source inbox
    └── workspace/             your active work projects (code, drafts, assets)
```

## Status

v1 — I'm using this daily. Expect rough edges; file issues when you find them. Contributions welcome — see `CONTRIBUTING.md`.

## License

MIT — see `LICENSE`.
