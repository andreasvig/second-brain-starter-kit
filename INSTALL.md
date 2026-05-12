# Install

Two paths. Path 1 is the recommended setup — Claude Code + Obsidian. Path 2 is the agnostic "I'll use my own tools" route.

The bootstrap is a copy step, then a single sentence to your agent. **You don't need to read the docs first** — the agent reads them and walks you through everything.

## Path 1 — Claude Code + Obsidian (recommended)

### Prerequisites

1. **Obsidian** — free markdown editor. Download: <https://obsidian.md>.
2. **Claude Code** — Anthropic's agent CLI. Install: <https://claude.com/claude-code>.

### Obsidian plugins (do these once Obsidian is open)

1. **Show Hidden Files** (community plugin by polyipseity) — required to see `.claude/` and `.obsidian/` in the file tree.
2. **Templates** (built-in core plugin) — enable, point at `.claude/templates/`.
3. **Obsidian CLI** (optional, accelerates retrieval) — see <https://github.com/Yakitrak/obsidian-cli> or your preferred fork.

### Pick a vault folder name

The example below uses `my-second-brain`, but the folder name shows up in your shell prompt, Obsidian sidebar, and any git remote — pick something you'll be comfortable seeing daily. Common patterns:

- `<assistant-name>/` if you've already got one in mind (`jarvis/`, `hermes/`, `athena/`)
- `<your-name>-brain/` (e.g. `kira-brain/`)
- `vault/` or `brain/` if you want a generic anchor

Don't overthink it — your agent will offer to rename during Stage 1 of setup once you've picked an assistant name.

### Bootstrap

```bash
# 1. Clone or download the kit
git clone <repo-url> your-second-brain-kit
cd your-second-brain-kit

# 2. Pick a vault location (a new directory; or an existing Obsidian vault)
VAULT=~/vaults/my-second-brain
mkdir -p "$VAULT"

# 3. Copy the kit/ contents into the vault
cp -R kit/. "$VAULT/"

# 4. Rename the CLAUDE.md template to live
mv "$VAULT/CLAUDE.md.template" "$VAULT/CLAUDE.md"

# 5. Open Obsidian, point it at the vault, enable Show Hidden Files
# 6. Open Claude Code in the vault directory
cd "$VAULT"
claude
```

### Recommended Claude Code config

Before the first conversation, set up the status bar to show context size. Performance and cost both degrade past ~300–400k tokens, so you want to see the gauge at all times.

```
/statusline
```

Configure it to display context size (along with anything else you find useful — model, branch, cwd). Anthropic's `/statusline` setup walks you through this.

**Rule of thumb**:
- Below 300k — keep working.
- 300–400k — start thinking about `/learn` then `/compact`.
- Above 400k — do it now.

### First conversation

Tell Claude:

> Read `interview/setup.md` and walk me through setup.

That's it. The agent reads the interview file, the docs in `docs/`, and the constitution — then walks you through 10 stages (5 minutes each, pause-resumable). Stages 1–3 are enough for a usable system; later stages deepen it.

If you have to pause and resume later, just say "continue setup" in a fresh session.

## Path 2 — Plain markdown + your editor of choice

The brain is just markdown files with frontmatter and `[[wikilinks]]`. It works without Obsidian, and skills are markdown procedures that work with any agent CLI that can read+write files.

### Prerequisites

1. **Any markdown editor** — VS Code, Cursor, Sublime, vim, your terminal.
2. **An agent CLI** — Claude Code (best support), Cursor (good support), Codex, OpenCode, or another agent that can read+write files in the working directory.

### Bootstrap

```bash
# Same as Path 1, steps 1-4
git clone <repo-url> your-second-brain-kit
cd your-second-brain-kit
VAULT=~/work/my-second-brain
mkdir -p "$VAULT"
cp -R kit/. "$VAULT/"
mv "$VAULT/CLAUDE.md.template" "$VAULT/CLAUDE.md"

# Optional: delete the .obsidian/ folder if you're not using Obsidian
rm -rf "$VAULT/.obsidian"

# Optional: delete the Obsidian-specific standard
rm "$VAULT/agent_brain/understanding/standards/obsidian-config.md"
```

### Harness adjustments

- **Cursor**: see `docs/adapters.md` — copy high-leverage skill instructions into `.cursor/rules/`.
- **Codex / OpenCode / other**: skills become *named procedures* you invoke verbally ("run the learn procedure"). The PreCompact hook in `.claude/settings.json` doesn't apply.
- See `.claude/constitution/harness.md` for harness-specific behavior.

### Context size

Whatever agent CLI you use, find the equivalent of "show context size in the status bar" and turn it on. Aim to stay below 300–400k tokens — past that, performance and per-request cost both degrade. Run the equivalents of `/learn` + `/compact` when the gauge climbs.

## What you lose without Obsidian

- Graph view (visual brain navigation).
- Backlinks pane (which pages link to this one).
- Templater plugin convenience.
- The `obsidian` CLI accelerator.

You don't lose:

- The brain structure itself.
- The hub-first paradigm.
- Any skill (they all work on plain markdown).
- Cross-linking — `[[wikilinks]]` are still searchable text.

## What you lose without Claude Code

- Slash commands (`/morning-brief` becomes "run the morning-brief procedure").
- The PreCompact hook that nudges `/learn`.
- Built-in MCP server integration for calendar / Slack / email.

You don't lose:

- The skill instructions themselves (they're plain markdown).
- Any file in the brain.
- The constitution, templates, or aggressiveness dials.

## Verify the install

After bootstrap, you should have:

```
$VAULT/
├── CLAUDE.md
├── .claude/
│   ├── constitution/
│   ├── skills/
│   └── templates/
├── .obsidian/        (if Obsidian)
├── agent_brain/
├── artifacts/
├── docs/             (the agent reads these — you don't have to)
├── interview/        (gets trashed after Phase 2)
├── raw/
└── workspace/        (your active work projects)
```

Open the vault in your editor; you should see the structure. Start your agent CLI in the vault directory; the agent should read `CLAUDE.md` automatically.

## Companion tools (optional, experimental)

> **Heads up — these are POC-stage, not part of the kit, and not fully complete.** Try them once you're used to the regular second brain setup (a week or two). Your agent will set a reminder during setup so you don't have to remember.

Two external repos compose well with the brain but aren't installed by the bootstrap above:

- **[meeting-recorder](https://github.com/tonton-golio/meeting-recorder)** — macOS menu-bar app (Apple Silicon, macOS 14+). Records mic + system audio, transcribes on-device via Whisper, identifies speakers via FluidAudio, and writes **Obsidian-compatible markdown** with frontmatter and wikilinks. Drop the output into your vault's `raw/` folder and `/ingest` it like any other source. Replaces "remember to take notes" with "record the call, the brain has it tomorrow."

- **[interviewer_voice2voice](https://github.com/tonton-golio/interviewer_voice2voice)** — voice-to-voice interview agent (xAI realtime API, Python + Node). Briefed by a markdown file with a background-info folder for retrieval; live transcript downloadable as markdown. Useful for any structured interview you'd rather *talk through* than type: stakeholder discovery, user research, your own thinking-out-loud journaling.

When you're ready, follow the install instructions in each repo. Both are independent macOS/CLI installs — they don't modify your vault.

## Troubleshooting

- **Skills don't appear in Claude Code** — see `agent_brain/understanding/standards/skill-authoring.md` for the discovery checklist.
- **Obsidian doesn't show `.claude/`** — install Show Hidden Files plugin (Path 1 step 1).
- **The agent doesn't follow the constitution** — check that `CLAUDE.md` was renamed from `CLAUDE.md.template` and is in the vault root.
- **The agent doesn't know what `interview/setup.md` is** — make sure it's still there at vault root. Phase 2 of the setup deletes it; if you tried to resume after Phase 2, the agent should already have everything it needs.

More: `docs/06-troubleshooting.md`.
