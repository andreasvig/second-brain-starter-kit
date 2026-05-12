---
name: ingest
description: "Process any raw source — meeting transcript, article, journal, export, audio transcript, generic doc — from raw/ into brain pages and/or artifacts with provenance. Classifies the input, picks a template from templates/, applies it. Hub-first ingestion + linking search are mandatory regardless of template."
---

# /ingest — Process anything in raw/ into the brain

Universal ingest. Classifies the input, picks a template from `templates/`, runs it.

**Argument**: path to a file in `raw/`. If not provided, list unprocessed sources from `raw/` (cross-checked against `artifacts/_ingest-log.md`) and ask the user which to process.

## Procedure

### 1. Read the source thoroughly

Read the full file before deciding anything. Note: file shape, content style, who's speaking, what kind of writing it is.

### 2. Classify and pick a template

Pick **one** template from `templates/` based on the source's nature. See `templates/README.md` for the full picker; quick decision tree:

- **Multiple voices in dialogue** (transcript with speakers) → `meeting.md`
- **Solo recording — user thinking out loud** (no other speakers, reflective tone) → `self-reflection.md`
- **Assistant's own multi-source web research synthesis** (no single external author — the chat answer IS the source) → `research.md`
- **External written content** — article, blog post, paper, podcast transcript without dialogue → `article.md`
- **User's own personal writing** — journal entry, diary, freewrite → `journal.md`
- **Bulk multi-record export** — LinkedIn CSV, Twitter dump, email-to-self stream, comment archive → `export.md`
- **Anything else** — strategy doc, org chart, technical RFC, Slack thread, random doc → `general.md`

If two templates seem to fit, pick the more specific one. If genuinely ambiguous, ask the user.

### 3. Apply the template

Read the picked template file in `templates/<name>.md`. It tells you:
- Where outputs land (artifact path, brain page locations)
- What frontmatter to write
- What to extract (decisions, action items, voice samples, etc.)
- Any template-specific handling

Follow it.

### 4. Hub-update (mandatory, regardless of template)

For any model / person / company / paper / framework / concept named in the source that doesn't yet have a brain page or hub entry:

1. **Add it to the relevant hub in `agent_brain/references/`.** Entry format:
   ```
   - **<Name>** (<provider/origin>, <YYYY-MM>) — <one-sentence opinionated description> · [[link]]
   ```
2. **No hub fits?** Create one. Use `.claude/templates/wiki-hub.md`. Add a line to `agent_brain/_index.md` under `## References → Topic hubs`.
3. **Linking search**: search the brain for other pages that should reference this entity. Insert wikilinks. The graph stays dense only if every new entity gets backlinks.
4. Bump the relevant hub's `updated:` date.

This step is **mandatory** for any source that introduces named entities. Skipping it is how the brain becomes a search-only experience.

### 5. Provenance (mandatory)

Every brain page or artifact created from `raw/` must include a clickable source link:
- Wiki page: source link near the derived section, or a `## Sources` block.
- Artifact: source near the top of the artifact.
- Both: link the wiki page to the artifact when the artifact carries useful detail beyond the wiki summary.

Format: `> Source: [[raw/...]]`

### 6. Update tracking

1. Append to `artifacts/_ingest-log.md`: source path → destination(s) + template used.
2. Append to `artifacts/_changelog.md`:
   ```
   ## [YYYY-MM-DD] ingest | [Brief description]

   Template: <name>. [What was extracted, where it went.]
   ```
3. Update `agent_brain/_index.md` if new pages or hubs were created.

### 7. Report

```
## Ingested: [filename]

**Template**: <name>
**Destination**: [wiki page(s), artifact(s), or both]
**Knowledge extracted:**
- Updated [[page-1]] — added X
- Created [[new-page]] — reason
- Created [[artifacts/...]] — reason
- Created N task(s)
**Hubs touched:**
- [[agent_brain/references/hub-name]] — added X, Y
- Created [[agent_brain/references/new-hub]] (if applicable)
```

## When invoked automatically

Under `ingestion_aggressiveness: Auto` (see `.claude/constitution/learning-aggressiveness.md`), `/ingest` fires **without user prompt** in two cases:

1. **Web research synthesis crosses the substance threshold.** After a WebSearch/WebFetch session whose answer crosses ≥`auto_ingest_research_min_words` words **or** ≥`auto_ingest_research_min_sources` sources (defaults 200/3, both in `learning-aggressiveness.md`), call `/ingest` directly with the `research` template. The assistant writes the synthesis to `raw/research/YYYY-MM-DD/<topic>.md` first, then invokes `/ingest` on that file.
2. **Feeds phase auto-ingest pass.** When the `feeds` phase of `/morning-brief` flags items via `auto_ingest: lens-filtered` or `aggressive` (see `phases/feeds.md` step 4), it calls `/ingest` on each per-item raw file with the `article` template.

Under `Ask`: propose the ingestion plan first; wait for confirmation. Under `Off`: do not fire automatically — the user must invoke `/ingest` explicitly.

The auto-fire path runs the same steps 1–7 below. The only difference is the lack of a prompt before step 1.

Cumulative research targeting the same hub within a single conversation **rolls up into one ingestion** rather than firing per WebSearch call. Track which hub a research session targets; if a follow-up search lands on the same hub, append to the existing `raw/research/YYYY-MM-DD/<topic>.md` rather than creating a sibling file.

## Notes

- **Read the full source before extracting.** Context matters.
- **Be concise in wiki updates.** `raw/` has the immutable record.
- **A bulky analysis may belong in `artifacts/`** with only the durable conclusions promoted to `agent_brain/`.
- **Audio**: this skill takes text. For audio, use `/transcribe` first — it produces a transcript file in `raw/`, then call `/ingest` on it.
- **Adding a new template**: drop `templates/<name>.md` and add a row in `templates/README.md`. The skill picks it up automatically.
