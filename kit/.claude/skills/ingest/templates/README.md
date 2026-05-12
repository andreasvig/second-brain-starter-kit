---
type: index
summary: "Picker for ingest templates. /ingest reads this to choose which template to apply to a given raw source."
---

# Ingest templates

Each file in this folder is one ingestion template. `/ingest` classifies the source and picks one of these. To add a new template, drop a `<name>.md` file here and add a row to the table below.

## When each template fires

| Template | Fires when | Output home |
|---|---|---|
| [`meeting.md`](meeting.md) | Multi-person dialogue transcript with speakers | `artifacts/meetings/YYYY-MM-DD-slug.md` |
| [`self-reflection.md`](self-reflection.md) | Solo recording, user thinking out loud, reflective tone | Distributed: `agent_brain/about_user/`, memory, person pages — no artifact |
| [`article.md`](article.md) | External written content — article, blog post, paper, podcast/talk transcript without dialogue | Hub entry + `agent_brain/references/`; optional `artifacts/` snapshot |
| [`research.md`](research.md) | Assistant-generated WebSearch/WebFetch synthesis — multi-source research the assistant produced in conversation | `raw/research/YYYY-MM-DD/<topic>.md` + hub entries; fires automatically under `ingestion_aggressiveness: Auto` once threshold met |
| [`journal.md`](journal.md) | User's own personal writing — journal, diary, freewrite | `agent_brain/about_user/journal/` + voice samples |
| [`export.md`](export.md) | Bulk multi-record export — LinkedIn CSV, Twitter dump, email-to-self stream | Bulk-process; outputs vary by record type |
| [`general.md`](general.md) | Anything else — strategy doc, org chart, technical RFC, Slack thread, random doc | Wiki update + optional `artifacts/` snapshot |

## Picker logic (used by /ingest)

1. **Audio file?** → don't use this skill. Run `/transcribe` first; it produces a text transcript in `raw/`, then call `/ingest` on the transcript.
2. **Multiple speakers in dialogue?** → `meeting.md`.
3. **Solo voice / first-person / user reflecting?** → `self-reflection.md`.
4. **Bulk multi-record file (CSV, JSONL, archive of many short items)?** → `export.md`.
5. **Assistant's own multi-source web research synthesis** (no single external author — the chat answer IS the source)? → `research.md`.
6. **Externally-authored content the user is consuming?** → `article.md`.
7. **User's own personal writing (journal, diary, freewrite)?** → `journal.md`.
8. **None of the above?** → `general.md` (covers strategy / org / tech / comms / misc — sub-classifies inside).

`research.md` vs `article.md`: if the assistant produced the synthesis from multiple sources during this conversation, use `research.md`. If the user dropped one URL/document for you to read and summarise, use `article.md`. When ambiguous, prefer `research.md` — multi-source is more durable.

If two fit, pick the more specific one. If genuinely ambiguous, ask the user.

## Adding a new template

When the user repeatedly ingests a kind of source that doesn't fit cleanly into any existing template (e.g. *"I keep ingesting research papers and `article.md` is too generic"*), promote it to its own template:

1. Create `templates/<name>.md` describing: when it fires, where outputs land, what frontmatter to write, what to extract, special handling.
2. Add a row to the table above.
3. Add a clause to the picker logic if the trigger isn't obvious from name alone.

Conventions:
- Lower-case kebab-case filenames matching the row in the table.
- Each template is one self-contained markdown file. No nested folders.
- Hub-update + provenance + tracking are handled by the dispatcher (`SKILL.md`); templates only describe **what's special about this source type**.
