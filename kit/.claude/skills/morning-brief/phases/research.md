# research — pull from a user-defined external research source

> Skeleton phase. The kit ships this empty — the user fills it in during setup if they have a research feed (an autonomous research agent that produces daily artifacts, an industry report email, an API endpoint that returns daily data, etc.).

This phase exists for the case where the user has a separate system that produces research / context artifacts they want pulled into the morning-brief flow. Examples:

- An autonomous research agent (e.g., a podcast/research bot that runs nightly and dumps to S3)
- A daily industry brief delivered via email
- A scheduled API call that returns daily market data
- A scraper output that drops to a local folder

If the user doesn't have one of these, this phase stays unused (`daily_research: false`) and the kit's morning-brief skips it.

## Arguments

- (no argument) — pull today's research
- `YYYY-MM-DD` — pull a specific past day

## What to do

The kit doesn't know what your research source looks like — fill in the steps below during setup or the first time you invoke `/morning-brief research`.

### 1. Resolve the date

Use today's date in the user's timezone unless an argument was provided.

### 2. Load credentials (if needed)

If the source needs API keys or AWS credentials, source `.env` or read `.claude/secrets/` (whichever pattern the user picked). Don't echo secrets to stdout.

### 3. Fetch the artifacts

Branch by source type:

- **S3 bucket** — `aws s3 ls "s3://<bucket>/<prefix>/$DATE/"` then `aws s3 cp` each file to `raw/research/$DATE/`.
- **API** — `curl` the endpoint with the right headers, save response to `raw/research/$DATE/response.json` (or whatever format).
- **Email** — use the email MCP to fetch messages from a specific sender/folder dated today.
- **Scraped page** — WebFetch + extraction, save to `raw/research/$DATE/<slug>.md`.
- **Local folder** — `ls` the folder for files dated today, copy what's relevant.

If the source has nothing for today (gap day, before drop time, weekend), tell the user — don't silently fall back to yesterday.

### 4. Read into context

Use the Read tool on each artifact. Don't summarize them away — the full contents go into context so they can be cross-referenced in conversation or by the `news` phase.

### 5. Output

```
## Research — YYYY-MM-DD ingested

**Source**: [name of research source]
**Topics covered**:
- [bullet 1]
- [bullet 2]

All N artifacts loaded into context. Ready to discuss, cross-reference, or feed into the news phase.
```

## When this phase fires

- **Default fan-out** — if `daily_research: true`, this phase runs after `briefing` and before `news`.
- **On demand** — `/morning-brief research` for today, `/morning-brief research 2026-04-15` for a specific past day.
- **Auto-triggered by news phase** — if `/morning-brief news` runs and `daily_research: true`, the news phase invokes this phase first.

## Customizing for your source

Edit this file to match your source's specifics. Replace the generic branch logic in step 3 with the actual fetch command, paths, and credential handling. The skeleton above is a guide, not a runtime contract — once customized, this becomes a concrete phase that runs reliably each morning.

If you don't have a research source: leave `daily_research: false` in `.claude/constitution/config.yaml` and ignore this phase. You can come back to it later.
