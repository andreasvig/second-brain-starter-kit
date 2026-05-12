# /morning-brief phases

The dispatcher in `../SKILL.md` classifies the descriptor and runs one or more of these phases. Each phase is self-contained — its own arguments, logic, output.

## Picker

| Phase | What it does | Gating | Default args |
|---|---|---|---|
| [briefing](briefing.md) | Calendar + tasks + slack + email via `/check` + remsleep follow-up + tomorrow + chosen rituals | None — always runs in fan-out | — |
| [research](research.md) | Pulls from a user-defined external research source. Empty skeleton — fill in during setup | `daily_research: true` | today |
| [feeds](feeds.md) | Ingests feeds from `agent_brain/about_user/feeds.md` | `feeds: true` | latest |
| [news](news.md) | Scan-and-draft for a topical post (domain + voice + output format are user-defined) | `news_scan: true` | weekday: full draft mode; weekend: scan-only |

## Fan-out order

`/morning-brief` (no descriptor) runs phases in this order:

1. **briefing** — quick orientation for the day
2. **research** — pull external research source (if configured)
3. **feeds** — pull user-defined newsletters/RSS into context
4. **news** — scan, sync, propose, draft (uses research + feeds context if those ran)

The order matters: news depends on research and feeds being in context first, so it can cross-check sources.

## Single-phase invocation

- `/morning-brief briefing` — just the briefing.
- `/morning-brief news` — just the news flow. Auto-runs research + feeds first if their gating flags are true.
- `/morning-brief feeds` — just feed ingestion.
- `/morning-brief research` — just pull the research source.

## Adding a new phase

1. Drop a new `.md` file in this folder following the same skeleton: `## Arguments` / `## What to do` / `## Output`.
2. Add a row to the picker above and the table in `../SKILL.md`.
3. Add a descriptor keyword to the dispatcher's classification logic in `../SKILL.md` step 1.
4. Decide gating: a config flag in `.claude/constitution/config.yaml` if it's optional, none if it's universal.

## Why phases instead of inline ritual blocks

Earlier kit versions kept morning rituals as commented-out blocks inside `morning-brief/SKILL.md` (uncomment what you picked at setup). That worked for light rituals but became unwieldy for heavier ones (news scan, research pulls). The phase pattern moves heavy rituals into self-contained files; light rituals (gratitude, daily curiosity, project pulse, habit check-in, stakeholder pulse) stay as inline blocks within `briefing.md` because they're 5-10 lines each and don't earn separate files yet. If a light ritual grows, promote it to its own phase.
