# Learning

Primary source of truth for the continuous-learning system. Pair with `learning-aggressiveness.md` for the soft settings that gate how eager learning is.

## Purpose

The agent compounds understanding into the durable brain while normal work happens. Learning is not a separate mode. If a conversation, task, meeting, or source produces durable understanding, capture it — subject to the aggressiveness settings.

## Core rules

- Default to learning during normal work whenever durable knowledge, a decision, or a reusable pattern emerges (gated by `learning-aggressiveness.md`).
- Promote scratch into durable notes. Don't let memory, chats, or one-off artifacts silently become the source of knowledge.
- Prefer updating the best existing home first. Create a new page when a subtopic deserves its own identity.
- Keep overview pages lean and split child pages when a subtopic carries real weight.
- Create reusable knowledge pages in `agent_brain/understanding/` when patterns recur.

## Promotion principles

- Memory (harness scratch) is not durable storage. Pull lasting insights into the right brain location.
- `raw/` is a strict inbox. Once important knowledge is extracted, archive the source.
- `artifacts/meetings/` keeps the meeting record. Durable outputs belong in `agent_brain/`.
- Conversations can directly produce updates to `agent_brain/` and `agent_brain/tasks/` when the insight is durable.
- If a durable fact is user-specific, store it in `agent_brain/`, not in `.claude/constitution/`.

## Working notes

- Temporary working notes inside `agent_brain/` are acceptable when they help thinking.
- Promote, merge, or delete them once the durable understanding is clearer.

## Unknowns

- Important unknowns belong in `agent_brain/understanding/unknowns/`.
- Create a task only when there is a concrete next action.

## Canonical thinking

- Keep one strong home for the truth whenever possible.
- Other pages may carry small local context but should link back to the canonical page.

## State and confidence

- New durable pages start as `needs-review` unless they were actively validated during writing.
- Promote pages to `stable` when they become well-linked and trustworthy.
- `canonical` stays rare.

## Session behavior

- No automatic session-summary artifacts.
- No automatic exit cleanup ritual.
- Learning happens inline during work rather than being deferred to a ceremony.
- The consolidation skill (`/remsleep` if shipped, or your own equivalent) handles batch consolidation when invoked.

## Context continuity

Pre-compaction rules for `/learn`, `/handover`, `/resume-handover` live in `context-continuity.md`.

## What not to do

- Don't wait for a dedicated maintenance pass before capturing obvious durable knowledge.
- Don't create lots of tiny pages for ideas that don't yet deserve their own identity.
- Don't leave recurring patterns trapped inside raw transcripts or meeting artifacts.
