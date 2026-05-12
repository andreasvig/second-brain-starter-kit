# news — daily scan-and-draft for a topical post

Generic pattern for a daily editorial flow: scan a domain, sync new findings against the user's durable positions, propose 2–5 candidate stories, draft one in the user's voice, optionally post.

> Kit-agnostic skeleton. The user customizes during setup or first run: which domain, which voice (defined in `identity.md` / `about_user/`), which output format (Slack post, LinkedIn, email digest, blog draft).

## What this phase is for

Many knowledge workers post daily commentary in their domain — AI engineers post about model launches, finance writers post about market moves, real-estate agents post about local listings, climate folks post about policy. This phase codifies that flow:

1. **Scan** — read what the feeds phase pulled (canonical sources for the domain).
2. **Sync** — update the brain's durable opinions/positions/references against today's findings.
3. **Propose** — surface 2–5 candidate stories.
4. **Draft** — write the top pick in the user's voice.
5. **Post** (optional) — send to the configured channel.

The primary value is the daily knowledge-sync against the user's brain, not the post itself. Even when the user chooses not to post, the sync still runs.

## Arguments

- (no argument) — propose 2–5 candidates and draft the top one
- `[topic]` — focus candidates on a theme
- `just-candidates` — list candidates only, don't draft
- `scan-only` (or `no-post`) — run the scan + knowledge sync only; don't propose a draft
- `weekend-scan` — scan + knowledge sync only, also skips `research` phase

## What to do

**Learning-first**: Steps 1–3 run unconditionally on every invocation. Steps 4+ only run if the user decides to post.

### Step 1: Gather candidates

**Source of truth**: candidate sources live in `agent_brain/about_user/feeds.md`, grouped by tier (A=canonical, B=daily-signal, C=deep). The `feeds` phase fetches all of them daily and stages content to `raw/feeds/YYYY-MM-DD/`. This phase consumes that staged content — don't re-fetch.

If `feeds: true` and the `feeds` phase ran earlier in the fan-out:

1. Read `agent_brain/about_user/feeds.md` to know which feeds are active and what tier each is.
2. Read the staged content from `raw/feeds/$(date)/<feed-slug>/`.
3. Apply tier-based weighting: Tier A always, Tier B for breadth, Tier C for topic-focused runs.

If `feeds: false` (or feeds didn't run): fall back to fetching the Tier A sources from `feeds.md` inline via WebFetch. Don't try to fetch Tier B/C inline — that's what the feeds phase exists for.

**Second-hop fetches happen here**: once a candidate emerges, do additional WebFetches on primary sources (the press release, the paper, the original announcement). Primary-source depth separates "news summary" from "informed take."

### Step 2: Prime on current knowledge

Load the user's durable positions / references / past output before interpreting the scan. Where these live depends on the user — common patterns:

- `agent_brain/about_user/takes.md` (or similar) — durable opinions/positions in the domain
- `agent_brain/references/<domain>-stack.md` — what the user uses / tracks / has shipped
- `agent_brain/projects/content-creation/<post-archive>/_index.md` — last N posts (avoid repetition, spot continuations)

If the user has a `research` phase, its output is already in context (cross-source signal — the research feed often catches things the public scan missed, or vice versa).

### Step 3: Knowledge sync

The brain catches up on the space before the user sees candidates. Two lanes:

- **Execute** — mechanical catalog work, just do it: hub additions for new entities, linking back-fill, reference updates that don't need editorial judgment.
- **Propose** — anything that touches the user's voice or commitments: new positions, retirement of old positions, public stack changes, structural reorganizations.

Run the execute lane *before* showing candidates so the user evaluates picks against an already-current brain. The "Knowledge sync — done" block should describe edits that have actually landed on disk.

The kit's `topic-hubs.md` standard governs this — hub-first ingestion, then linking search, then lateral linking. See `agent_brain/understanding/standards/topic-hubs.md`.

### Step 4: Filter candidates for the user's audience

The post goes to a specific audience (Slack channel, LinkedIn followers, mailing list). Apply audience-specific filters — the user defines these during setup. Generic version:

- What's relevant to the audience's day-to-day
- What's interesting to the user (not just "newsworthy")
- What overlaps with the user's recurring themes / takes

### Step 5: Rank and draft

Skip if `scan-only` / `no-post` / `weekend-scan`.

Propose 2–5 candidates with one-line hooks each, then draft the top one in the user's voice. The voice is captured in `identity.md` and `about_user/`.

### Step 6: Post (optional)

If the user confirms the draft, post to the configured channel (Slack MCP, email, LinkedIn API, or paste-to-send if no automation). Sign per the kit's communications standard.

### Step 7: Archive

Save the post to `agent_brain/projects/content-creation/<post-type>/YYYY-MM-DD-<slug>.md` with frontmatter (date, channel, headline, permalink) and back-link the post to any hubs / takes / references touched in step 3.

### Step 8: Log

Append to `artifacts/_changelog.md`. Include any references touched ("hub updated: [[name]]", "take refined: [[take]]") so `/remsleep` and future retrieval see what moved.

## Customizing during setup

When the user picks "news scan" in stage 9 of the interview, fill in:

- **Domain** — what they post about. Affects tier-A feed selection in `feeds.md`.
- **Audience** — who reads the posts. Affects the filter in step 4.
- **Voice** — how they sound. Lives in `identity.md` (archetype, push-back stance) + the language standard. Reference here, don't re-define.
- **Output format** — post structure (length, opening line, forbidden patterns). Add concrete rules to this file.
- **Channel** — Slack channel ID, LinkedIn API setup, email recipient, or "paste-to-send".
- **Cadence** — daily? weekday-only? when?

## Notes

- **Primary value is the learning, not the post.** If the scan finds something durable, that's success — even if there's no post.
- **Resolve, don't defer.** Sync proposals must be resolved before the draft goes out. If the user defers, treat as a no-for-today.
- This phase is gated by `news_scan: true` in `.claude/constitution/config.yaml`.
