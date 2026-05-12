---
type: knowledge
summary: "User-defined ingestion feeds — newsletters, RSS, substacks, podcasts, YouTube channels, S3 dumps. Read by /morning-brief feeds phase, consumed by /morning-brief news. Add a feed by saying 'add X to my feeds' or by editing this file."
state: stable
updated:
tags: [feeds, morning-brief, ingestion]
---

# Feeds

Pull-based content sources the assistant ingests as part of the daily `/morning-brief` flow. The `feeds` phase fetches everything in this file and stages it to `raw/feeds/YYYY-MM-DD/`. The `news` phase consumes that staged content as its scan layer.

> Empty by default — fill this in during setup (Stage 9 covers feed selection by domain) or any time by saying *"add the X newsletter to my feeds"*.

Sources are grouped by **tier**, which signals editorial weight in the news phase:

- **Tier A — canonical**: always hit. Where stories first surface in your domain.
- **Tier B — daily-signal**: high-leverage breadth. Curators and aggregators that reframe / surface things Tier A misses.
- **Tier C — community & research**: deep scan. Slow signal but catches surprises (research papers, OSS, niche reports).

## Source priorities

Default: prefer official/primary sources for facts, expert commentary for interpretation, and broad summaries for discovery. Replace this during setup if the user wants a different weighting, e.g. speed-first, official-only, expert-heavy, or broad-scan.

## Active feeds

### Tier A — canonical (always hit)

(none yet — add your domain's primary sources)

### Tier B — daily-signal (broad coverage)

(none yet — add curators, aggregators, mainstream coverage)

### Tier C — community & research (deep scan)

(none yet — add research feeds, community blogs, niche signals)

## Field reference

When adding a feed, use this structure:

```yaml
- name: <Display name>
  type: <rss | scrape | s3 | youtube | podcast | manual>
  url: <feed URL or fetch endpoint>
  tier: <A | B | C>
  cadence: <daily | weekly | irregular>
  bring_into_context: <true | false>      # true = read body fully; false = title + link only
  auto_ingest: <off | lens-filtered | aggressive>  # default off — see below
  notes: "Why this is tracked + what to look for"
```

`manual` type is for sources without automated fetch (e.g. a private LinkedIn feed) — the user pastes content when the assistant prompts.

`auto_ingest` controls what happens to items the `feeds` phase fetches. It only fires when the global `ingestion_aggressiveness` in `.claude/constitution/learning-aggressiveness.md` is `Auto`:

- **off** (default) — stage the content to `raw/feeds/` and stop. Use for noisy or low-signal feeds where most items aren't worth a brain page.
- **lens-filtered** — stage everything, then run a relevance check against the strategic lens + active project summaries; items that match get auto-promoted to brain pages via `/ingest`. Good middle ground for high-volume sources like HN where some items are gold and most aren't.
- **aggressive** — stage everything, then auto-ingest every item without filtering. Reserve for high-signal curated sources (a paid newsletter, a research dump) where every issue is worth a page.

If `ingestion_aggressiveness` is `Ask` or `Off`, the `auto_ingest` field is ignored — items only stage to `raw/`. Same behaviour as before this field existed, so back-compat is preserved for feeds added before this knob existed.

## How it composes with other phases

- The `feeds` phase fetches everything in this file and stages it under `raw/feeds/YYYY-MM-DD/`. It runs before `news` so news can read feed content from context.
- The `news` phase reads staged feed content as its candidate-scan layer. Tier A is always weighted; Tier B and C add breadth and depth.
- For one-off ingestion of a feed item into the brain (e.g. an article worth a hub entry), use `/ingest raw/feeds/YYYY-MM-DD/<feed-slug>/<file>.md` — the `article` template will do hub placement + linking search.

## Common starting points by domain

If you're not sure where to start, here are typical Tier A + B feeds by domain. Mix newsletters, podcasts, YouTube, and scrape targets — variety beats stacking five things of the same shape.

- **AI / tech**
  - *Newsletters*: Stratechery (Ben Thompson), The Pragmatic Engineer (Gergely Orosz), Lenny's Newsletter, Import AI (Jack Clark), The Rundown AI, Forward Future, Astral Codex Ten (Scott Alexander), One Useful Thing (Ethan Mollick).
  - *Podcasts*: Acquired, Latent Space, Lex Fridman, Hard Fork, The Pragmatic Engineer Podcast.
  - *YouTube*: Two Minute Papers, Yannic Kilcher, AI Explained, Fireship.
  - *Scrape*: OpenRouter (`https://openrouter.ai/models`), Artificial Analysis (`https://artificialanalysis.ai/`), Hugging Face, Hacker News, TechCrunch AI.
- **Finance / markets**
  - *Newsletters*: Matt Levine's Money Stuff, The Diff (Byrne Hobart), Net Interest (Marc Rubinstein), Axios Markets, FT Alphaville.
  - *Podcasts*: Odd Lots, Capital Allocators, Acquired.
- **Climate / energy**
  - *Newsletters*: Heatmap, Volts (David Roberts), Canary Media, The Trellis, Sparklines.
  - *Podcasts*: Volts, Catalyst with Shayle Kann.
- **Health / longevity**
  - *Newsletters*: Ground Truths (Eric Topol), Peter Attia's email, Stat News Morning Rounds.
  - *Podcasts*: The Drive (Peter Attia), Huberman Lab.
- **Politics / policy**
  - *Newsletters*: Politico Playbook, Punchbowl News, Axios AM, Slow Boring (Matt Yglesias), Persuasion.
  - *Podcasts*: The Daily, Ezra Klein Show, Pod Save America.
- **Real estate** — local MLS feed, Redfin/Zillow market reports, Marginal Revolution housing posts.
- **Your industry** — tell the assistant what you currently read, it'll wire it in.

Pick 3–5 outlets to start; you can add and remove later. For paywalled / login-gated newsletters where RSS isn't published, use `type: manual` — the assistant prompts you to paste the issue when it runs the feeds phase.

## Adding a new feed

When you say *"add the X newsletter to my feeds"*:

1. The assistant determines the type (RSS preferred — most newsletters publish RSS even if they don't advertise it).
2. The assistant determines the tier based on what role the source plays in your domain.
3. A structured entry gets appended to the right tier section above.
4. Confirm before the next morning-brief run.

## Archived feeds

> Feeds tried and dropped. Useful as a record of "we tested this, here's why it didn't earn a slot."

(none yet)
