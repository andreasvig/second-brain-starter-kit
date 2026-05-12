# feeds — ingest user-defined newsletters and feeds

Pulls the latest content from feeds the user has registered in `agent_brain/about_user/feeds.md` (RSS, newsletter URLs, substacks, YouTube channels, podcasts, S3 dumps — anything pull-based). Loads into context so downstream phases (notably `news`) can cross-reference; optionally summarizes per-feed.

> The kit ships an empty `feeds.md` placeholder. The user populates it during setup (Stage 9 covers feed selection by domain) or later by saying *"add the X newsletter to my feeds"*.

## Arguments

- (no argument) — pull every active feed's latest content
- `[feed-name]` — pull just one feed (e.g., `feeds Stratechery`)
- `since:YYYY-MM-DD` — pull content published since a date (skip already-seen)

## Feed registry

Feeds are listed in `agent_brain/about_user/feeds.md`. Each entry:

```yaml
- name: Stratechery
  type: rss                  # rss | scrape | s3 | youtube | podcast | manual
  url: https://stratechery.com/feed/
  tier: A                    # A=canonical (always hit) | B=daily-signal | C=deep
  cadence: weekly            # daily | weekly | irregular
  bring_into_context: true   # if true, full content is read; if false, only headline + link surfaces
  auto_ingest: lens-filtered # off | lens-filtered | aggressive — see step 4
  notes: "Why this is tracked + what to look for"
```

`auto_ingest` controls whether fetched items get auto-promoted to brain pages via `/ingest`:

- **off** (default for new feeds) — stage to `raw/` only. Use for noisy or low-signal feeds.
- **lens-filtered** — run a relevance check against the strategic lens + active projects; items that match get auto-ingested.
- **aggressive** — auto-ingest every fetched item. Reserve for high-signal feeds (curated newsletter, research dump) where every issue is worth a page.

Auto-ingest is also globally gated by `ingestion_aggressiveness` in `.claude/constitution/learning-aggressiveness.md` — see step 4.

## What to do

### 1. Read the feed registry

Read `agent_brain/about_user/feeds.md`. Parse each entry. If the file doesn't exist or has zero feeds, output a one-line nudge ("No feeds configured. Say *'add X to my feeds'* to start.") and exit.

### 2. For each feed, fetch the latest

Branch by `type`:

- **rss** — fetch the feed URL, parse XML, take the latest entry (or all entries since the last run if a `since:` arg was given).
- **scrape** — WebFetch the URL, extract the latest issue/post (newsletter sites usually have a "latest issue" landing). Also covers list-style pages where the page itself IS the content (e.g., `huggingface.co/models` trending list, `github.com/trending`).
- **s3** — `aws s3 ls` the bucket prefix, take the most recent object.
- **youtube** — fetch the channel's RSS (`https://www.youtube.com/feeds/videos.xml?channel_id=<ID>`), take the latest video. Do NOT auto-transcribe — surface title + description; user can call `/transcribe` if they want the audio.
- **podcast** — fetch RSS, take the latest episode. Same surface-only behavior; `/transcribe` for audio.
- **manual** — no automated fetch. Note the feed in the report ("LinkedIn — paste highlights when ready") so the user can paste content into the conversation; the rest of the flow treats pasted content the same as fetched content.

If `bring_into_context: true`, fetch the body and read into context. If `false`, just capture title + URL + date.

### 3. Stage raw content

Save fetched content to `raw/feeds/YYYY-MM-DD/<feed-slug>/`. Lets the user re-read without re-fetching, and gives `/ingest` something concrete to operate on if the user wants the content turned into brain pages.

### 4. Auto-ingest pass (conditional)

This step makes the `ingestion_aggressiveness` dial actually do something for feeds. Without it, everything just sits in `raw/` and the dial is dead code.

**Global gate.** Read `.claude/constitution/learning-aggressiveness.md` and find `ingestion_aggressiveness`. If it's `Ask` or `Off`, skip this entire step — the staging from step 3 is the only outcome. If it's `Auto`, continue.

**Per-feed branch.** For each feed processed in step 2, read its `auto_ingest` field:

- `off` (or missing) — skip this feed for auto-ingest. Items remain staged only.
- `lens-filtered` — run the relevance check below; ingest items that match.
- `aggressive` — ingest every fetched item from this feed without filtering.

**Relevance check (`lens-filtered` only).** Compose one classification call per feed (batched across all of that feed's items, not one call per item — keep it cheap):

- Read the strategic lens from `.claude/constitution/identity.md` → `## Strategic lens`.
- Read the active project slugs and one-line `summary:` from each `agent_brain/projects/<slug>/<slug>.md`.
- For each item, supply title, source, points/score if available, and any short blurb.
- Ask: *"Does this item meaningfully relate to the strategic lens or any active project? Yes / no / one-line reason."*

Items answered yes are flagged for ingestion. Items answered no remain staged only — capture the one-line reason for the report.

**Ingest loop.** For each flagged item:

1. If the staged file is a list snapshot (e.g. HN front page, OpenRouter model list), WebFetch the individual item URL to get the body. Save to `raw/feeds/YYYY-MM-DD/<feed-slug>/<item-slug>.md` with frontmatter (`source`, `url`, `fetched`, `feed`, `feed_tier`).
2. Call `/ingest raw/feeds/YYYY-MM-DD/<feed-slug>/<item-slug>.md`. The `article` template handles hub placement, linking search, and lateral linking — do not reimplement that flow here.
3. Capture the resulting brain page path for the run report.

If any single item's ingestion fails, log the reason and continue — don't abort the whole pass.

### 5. Output

```
## Feeds — [date]

**Pulled** (N):
- [Stratechery] "Title of latest" (date) — read into context
- [HN AI tag] 3 new front-page posts since yesterday — titles + links surfaced
- [AI Engineer podcast] "Episode title" (date) — surface-only, run /transcribe to ingest audio

**Auto-ingested** (M):
- [HN] "Title" → agent_brain/references/<hub>.md (created)
- [HN] "Other title" → agent_brain/references/<hub>.md (linked to existing)

**Staged only — lens rejected** (K):
- [HN] "Off-lens title" — reason: "no overlap with strategic lens or active projects"

**Skipped** (already seen since last run): N
**Errors** (feeds that failed): [name + reason]
```

When contributing back to the morning-brief changelog entry, include the auto-ingest count so the rollup is honest: `feeds (HN: 10 staged, 3 auto-ingested)` rather than just `feeds (HN: 10)`.

If invoked from the dispatcher fan-out, return control to the dispatcher — the news phase that runs next can cross-reference feed content against its own scan.

If invoked directly (`/morning-brief feeds`), end the report and let the user direct what to do with the content.

## Composition with other phases

- The `news` phase reads feed content from context when proposing candidates. Tier A feeds are weighted as the canonical source; Tier B/C add breadth and depth.
- `/ingest` is the right tool if the user wants to turn feed content into brain pages — `/ingest raw/feeds/YYYY-MM-DD/<slug>/<file>.md` and the `article` template will do hub placement + linking search.

## Adding a new feed

When the user says *"add the X newsletter to my feeds"*:

1. Determine the type (RSS preferred — most newsletters publish RSS even if they don't advertise it; check `/feed`, `/rss`, `/atom`).
2. Determine the tier: A if it's where stories first surface in the user's domain; B if it's a curator/aggregator; C if it's research/community.
3. Append a structured entry to `agent_brain/about_user/feeds.md` under the right tier section.
4. Confirm with the user before the next morning-brief run.

When the user says *"drop X"* or *"that feed isn't useful"*:

1. Move the entry to the `## Archived feeds` section at the bottom (don't delete — useful for "we tried this for a month and it didn't earn its slot").
