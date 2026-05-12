---
template: export
summary: "Bulk multi-record export — LinkedIn CSV, Twitter/X dump, email-to-self stream, Hacker News favorites, comment archive. Process records in bulk; outputs vary by record type."
---

# export.md — bulk multi-record export

Fires when the source is a single file containing many independent records — typically a data export from another platform.

Common shapes:
- LinkedIn post export (CSV with one post per row)
- Twitter/X archive (JSON or HTML with one tweet per item)
- Email-to-self stream (mbox or list of single-line entries)
- Bookmark export (Pocket, Pinboard, Hacker News favorites)
- Goodreads/Letterboxd-style activity export

## Procedure

### 1. Read the structure

Detect the format. Sniff the first few records. Confirm with the user before bulk-processing if the structure is ambiguous.

### 2. Decide bulk strategy

Two paths depending on volume:

- **Small (<50 records)**: process each record individually, with full hub-update and linking pass per record.
- **Large (50+ records)**: process in batches. Pull bulk-level patterns (recurring themes, named entities by frequency, time-range patterns) BEFORE doing per-record placement. The bulk-level patterns inform what hubs to create or seed.

### 3. Decide per-record output home

Each record goes somewhere — but the destination depends on what the export contains:

| Export type | Per-record destination |
|---|---|
| User's own LinkedIn / Twitter / blog posts | `agent_brain/about_user/voice-samples/<source>/<date>-<slug>.md` (extract voice) + `agent_brain/about_user/positions/` if a clear position is stated |
| Bookmarks / favorites | A reading-list page in `agent_brain/about_user/reading/<source>.md` (one line per bookmark with link + one-line take) — not full pages per bookmark |
| Email-to-self / notes-to-self | `agent_brain/about_user/notes/<date>.md` aggregated by day, OR distributed to person/project pages if the note clearly addresses one |
| Activity logs (books read, films watched, etc.) | A single hub page in `agent_brain/references/<topic>.md` with each item as a row |

When in doubt: aggregate into one page rather than producing dozens of stubs.

### 4. Hub placement (mandatory, runs once after bulk)

After the bulk records are placed:

1. Run hub-update over the whole export. Any external entity named in any record gets a hub entry (single sweep, not per-record).
2. Linking search: find pages that should reference the new hub entries.
3. Update hub `last-reconciled:` dates.

### 5. Voice extraction (if export contains user-authored content)

For exports of the user's own writing (LinkedIn posts, blog, tweets):

1. Sample 5–10 representative items.
2. Write `agent_brain/about_user/voice-samples/<source>-summary.md` describing observed voice patterns: sentence rhythm, characteristic phrases, hedging style, structural beats, vocabulary, what's noticeably absent.
3. The agent uses this when drafting in the user's voice.

## Output report

```
## Ingested: <export-filename>

**Template**: export
**Records processed**: N
**Aggregated to**: [[<page>]]
**Voice samples extracted**: N (see [[voice-samples/...]])
**Hubs touched**: [[hub1]], [[hub2]]
**Tasks created**: N (only if explicit commitments surfaced)
```

## Notes

- **Don't create N stub pages.** A 500-row export shouldn't produce 500 brain pages — that's noise. Aggregate or extract patterns instead.
- **Confirm shape before bulk-processing** if the user's intent isn't obvious. *"This LinkedIn export has 312 posts. Want me to extract voice patterns and ingest the most-engaged 20 individually, or aggregate everything into a single voice-sample summary?"* — that kind of question.
- Provenance + tracking handled by `SKILL.md`.
