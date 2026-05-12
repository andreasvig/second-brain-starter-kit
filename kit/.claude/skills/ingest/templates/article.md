---
template: article
summary: "External written content — article, blog post, paper, podcast/talk transcript. Hub placement is the primary output; optional artifact snapshot for long-form."
---

# article.md — external content

Fires when the source is something the user is *consuming* (not authoring): an article, blog post, paper, white paper, talk transcript, podcast transcript without dialogue, newsletter clipping.

## Primary output: hub placement

The most important thing is that any named entities (models, people, companies, frameworks, papers, products) land in the right `agent_brain/references/` hubs with one-sentence opinionated descriptions. This is the load-bearing step for retrievability.

For each named entity:

1. Find the relevant hub. Add an entry:
   ```
   - **<Name>** (<provider/origin>, <YYYY-MM>) — <one-sentence opinionated description, including the user's likely take if inferable> · [[link to source artifact or raw]]
   ```
2. If no hub fits, create one.

## Optional output: artifact snapshot

For long-form pieces (>1500 words, or anything the user seems to be saving for reference), create `artifacts/articles/YYYY-MM-DD-<slug>.md`:

```yaml
---
type: article
summary: "<one-line take>"
source_url: "<URL if known>"
author: "<author>"
date_published: YYYY-MM-DD
date_ingested: YYYY-MM-DD
tags: [article, <topic>]
---
```

Body:
- **TL;DR** (3–5 bullets, the user's likely take, not a neutral summary)
- **Key facts / claims** (with page references if it's a paper)
- **What this means for the user** — connect to projects, prior takes, open questions
- **Related** — wikilinks to other pages this touches

For short pieces (newsletters, blog snippets, single takes), skip the artifact and just do hub placement + linking.

## Take extraction

If the article surfaces a position the user might want to adopt (or contradict), surface it. Don't auto-write it as the user's take, but flag it: *"This article argues X. Does this align with your view? Want me to add to your `ai-takes.md` (or equivalent)?"*

## Notes

- **Don't summarize for the sake of summarizing.** The artifact only earns its keep if there's a derived insight or future-reference value.
- **Hubs first, summary later.** If you only have time for one, do hub placement.
- Provenance + tracking are handled by `SKILL.md`.
