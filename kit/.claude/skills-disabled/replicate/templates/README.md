# Replicate templates — index

> Reusable, opinionated recipes for specific creative outputs the user makes often enough that the model choice, params, prompt scaffold, and post-processing should be memorised — not re-derived each time. Companion to `SKILL.md`.

## How to use

1. **Match the request to a template** — when the user says e.g. "shoot it cinematic" or "prettify this diagram", pull the matching file below instead of re-deriving from `model-repository.md`.
2. **Fill the placeholders** — each template has `[FIELDS]` for what varies per call. Most templates also include a controlled vocab table for each placeholder.
3. **Honor the post-processing step** — templates codify format conversions (e.g. WebP → JPG for the web, label-extraction for diagram prettify) that the generic flow skips.
4. **If a template's model goes stale** — Replicate slugs change. Swap to the new workhorse and update the template; keep templates in sync with `model-repository.md`.

## Available templates

| File | Use case | Model | Trigger |
|---|---|---|---|
| [cinematic-photography.md](cinematic-photography.md) | Film-look photos — generate from scratch OR transform an existing photo into cinematic | `openai/gpt-image-2` (T2I) · `google/nano-banana-pro` (edit existing) | "shoot it cinematic", "make this photo cinematic", "film-look portrait" |
| [graph-prettify/](graph-prettify/README.md) | Polish a `/draw-diagrams` Excalidraw output into a styled, presentation-ready figure while preserving structure. **6 styles** — clean-vector / isometric / notebook / cyberpunk / brutalist / storybook | `google/nano-banana-pro` | "prettify this diagram", "polish the graph", "render it cyberpunk / cinematic / brutalist", after a `/draw-diagrams` build |

## Adding a new template

Drop a new `<slug>.md` in this folder using the skeleton below, then add a row to the table above. Keep templates **opinionated** — if the user has a third way they sometimes do X, that's a second template, not branching inside the first.

```markdown
# [Name] template

**Trigger.** What the user says that should match this. Concrete phrases.

**Purpose.** What it's for and when to use it (vs. falling back to defaults).

**Model.** `owner/slug` (workhorse / cheap / specialty). One-line basis for the pick.

**Reference assets** (if any). Local paths + remote URLs.

**Fixed params.** JSON block with values that never vary across calls.

**Prompt scaffold.** Code block with [PLACEHOLDERS].

**Filling the placeholders.** Tables / lists with controlled vocab — what you can say in each slot.

**Post-processing.** What to do with the output before reporting (format convert, crop, sidecar fields, naming).

**Example end-to-end.** One worked call from request → final file.
```

Templates that compose with another skill (chain templates) — see `graph-prettify/` as the reference impl. The chain template README documents inputs, fixed params, the composed prompt, and a worked example end-to-end.
