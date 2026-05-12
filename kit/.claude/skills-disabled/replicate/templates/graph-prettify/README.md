# Graph prettify template

**Trigger.** "prettify this diagram", "polish the graph", "make this diagram presentation-ready", "render the diagram in [style]", or after a `/draw-diagrams` build when the user says "now make it pretty / nicer / final / cinematic / cyberpunk / etc".

**Purpose.** Take a `/draw-diagrams` rendered PNG (hand-drawn Excalidraw style) and produce a polished, styled version that **preserves structure exactly** — every box, ellipse, diamond, arrow, and label stays in place — while applying a chosen visual style. The model also draws **thematic icons** inside each shape based on the diagram's intent (provided by the caller), turning abstract boxes into illustrated stages.

This is a **chain template** — input is always an output from `/draw-diagrams`.

## Style picker — pick one

Each style is a complete visual system with its own file. Pick one based on the audience and tone, or ask the user which:

| Style | Vibe | Best for | File |
|---|---|---|---|
| **clean-vector** (default) | Modern flat-design, Inter typeface, drop shadows | Slack posts, internal docs, default presentation polish | [clean-vector.md](clean-vector.md) |
| **isometric** | Glassmorphic 3D panels at 30°, Untitled UI / Stripe website vibes | Product / engineering decks, premium tech aesthetic | [isometric.md](isometric.md) |
| **notebook** | Moleskine bullet-journal, watercolor washes, hand-lettered | Personal reflections, storytelling, casual blog / LinkedIn | [notebook.md](notebook.md) |
| **cyberpunk** | Blade Runner UI, neon panels, glowing wireframe icons, scanlines | YouTube AI content, futuristic narratives, club energy | [cyberpunk.md](cyberpunk.md) |
| **brutalist** | 1980s Swiss design, heavy black + signal red, woodcut silhouettes | Editorial content, bold statements, magazine-spread vibes | [brutalist.md](brutalist.md) |
| **storybook** | Beatrix Potter watercolor, mouse / fox / owl characters, organic cloud-shapes | Whimsical explainers, onboarding, kids / family audiences | [storybook.md](storybook.md) |

If the user doesn't name a style, default to **clean-vector** for technical/internal output, **cyberpunk** for futuristic / tech narratives, **storybook** for explainers. Ask if unsure.

## Model

`google/nano-banana-pro` (Gemini 3 Pro Image, "Nano Banana 2"). Verified 2026-05-01 on the `pipeline` test diagram across all 6 styles — all preserved labels verbatim and the 4-stage left-to-right structure. See `model-repository.md` for the full schema entry. ~30s per render at 2K.

## Inputs

The chain expects two artifacts from `/draw-diagrams`:

| Artifact | Path pattern | Purpose |
|---|---|---|
| Rendered PNG | `<out-dir>/<slug>.png` | The image fed to nano-banana-pro as `image_input` |
| Build script | `<out-dir>/<slug>.build.mjs` | Read this to extract **labels verbatim** AND understand the diagram's intent (from comments + box types) |

Extract labels:

```bash
grep -oE "label: *['\"][^'\"]+['\"]" <out-dir>/<slug>.build.mjs | sed -E "s/label: *['\"]([^'\"]+)['\"]/\1/" | sort -u
```

Extract title (if any) — read the `new Diagram({ ... title: '...' })` argument or scan for `d.title('...')`. Read the build script's top comments for intent.

## Fixed params

```json
{
  "image_input": ["<UPLOADED_URL>"],
  "output_format": "png"
}
```

`aspect_ratio` defaults to `match_input_image` — don't override. `resolution` defaults to `2K` — fine.

## The composed prompt

The full prompt is assembled per call from three sources: caller-provided intent + style block + preservation block. Template:

```
{INTENT}

Re-render the source diagram in {STYLE_NAME} style:

{STYLE_VISUAL_IDENTITY_BLOCK}

ICONS: {STYLE_ICON_DIRECTIVES} The labels in the diagram are: {QUOTED_LABELS_LIST}. Draw a thematic icon inside each shape that visually represents what that label does in the workflow.

LAYOUT: {STRUCTURAL_DESCRIPTION} — keep all shapes in the same arrangement and order as the source.

Title "{TITLE}" at top in {STYLE_TYPOGRAPHY}.

PALETTE: {STYLE_PALETTE_BLOCK}.

Background: {STYLE_BACKGROUND}.

Keep all labels verbatim ({QUOTED_LABELS_LIST}) and the title. Keep shapes in the same order/arrangement. Do not add or remove any shape, arrow, or label. Do not redraw the diagram from scratch.
```

**Caller-provided slots** (per render):
- `{INTENT}` — one-paragraph narrative describing what the diagram represents and what each stage does. The richer this is, the better the icons. Example: *"This diagram represents a content production pipeline — four sequential stages where a person researches a topic, writes a draft, has it reviewed, and finally publishes it."*
- `{QUOTED_LABELS_LIST}` — `"research", "write", "review", "publish"` (extracted via grep above).
- `{STRUCTURAL_DESCRIPTION}` — e.g. *"four boxes in a horizontal row, three arrows connecting them left-to-right"*.
- `{TITLE}` — extracted from the build script.

**Style slots** (from the chosen style's `.md` file):
- `{STYLE_NAME}` — e.g. *isometric*, *cyberpunk*
- `{STYLE_VISUAL_IDENTITY_BLOCK}` — copy verbatim from style file
- `{STYLE_ICON_DIRECTIVES}` — copy verbatim
- `{STYLE_TYPOGRAPHY}` — copy verbatim
- `{STYLE_PALETTE_BLOCK}` — copy verbatim
- `{STYLE_BACKGROUND}` — copy verbatim

## Workflow

1. **Locate source files**: `<slug>.png` and `<slug>.build.mjs`.
2. **Extract labels + title + intent** from the build script. Read top comments for intent; if missing, infer from the diagram's pattern (agent topology / pipeline / hub-and-spoke / etc).
3. **Pick style**: ask the user, or default per the picker table.
4. **Read the style file** at `templates/graph-prettify/<style>.md`.
5. **Compose the prompt** by filling slots — caller fills `{INTENT}` / `{QUOTED_LABELS_LIST}` / `{STRUCTURAL_DESCRIPTION}` / `{TITLE}`; style file provides the rest.
6. **Upload PNG** to Replicate files API.
7. **Fire `google/nano-banana-pro`** with the composed prompt + uploaded URL + `output_format: png`.
8. **Poll** every 12s — typical generation ~30s.
9. **Download** to `<out-dir>/<slug>-<style>.png` and write sidecar `.json`.
10. **Vision check** against the 7-item list in `/draw-diagrams` SKILL.md — coverage, labels verbatim, arrow direction, layout. If any check fails, the prompt didn't preserve enough — re-run with a more explicit "do not change" list, or pick a less aggressive style.

## Output naming

`<slug>-<style>.png` next to the original — e.g. `pipeline-clean-vector.png`, `pipeline-cyberpunk.png`. Sidecar JSON with the same prefix.

## Worked example — pipeline.png × cyberpunk

*Source*: a `pipeline.png` + `pipeline.build.mjs` produced by `/draw-diagrams`.

*Caller fills*:
- INTENT: *"This diagram represents a content production pipeline — four sequential stages where a person researches a topic, writes a draft, has it reviewed, and finally publishes it. The flow goes strictly left-to-right."*
- QUOTED_LABELS_LIST: `"research", "write", "review", "publish"`
- STRUCTURAL_DESCRIPTION: *"four boxes in a horizontal row, three arrows connecting them left-to-right"*
- TITLE: *"Daily research pipeline"*

*Style*: read `cyberpunk.md`, paste its blocks into the scaffold.

*Fire* `google/nano-banana-pro` → ~30s → download → `pipeline-cyberpunk.png`.

Verified outputs from this run live next to the source and can be opened to see what each style looks like applied to the same diagram. They double as exemplars for new style additions.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Diagram redrawn from scratch (boxes in different positions) | Style was too creative for preservation. Drop the style block's "organic shapes" / "cloud-shape" language; keep rigid rectangles. Or switch to `clean-vector`. |
| Labels paraphrased or missing | Labels weren't quoted verbatim in the prompt. Re-extract via grep, paste in quotes. |
| Model added a fancy title or watermark | Add to the prompt: "Do not add explanatory text, logos, watermarks, or annotations." Re-run. |
| Icons feel off / generic | INTENT was too thin. Rewrite as 2–3 sentences explaining what each stage does, not just what they're called. The model picks better thematic icons with more semantic context. |
| `google/nano-banana-pro` 404s | Slug drifted. Check Replicate, fall back to `openai/gpt-image-2` with the same prompt; flag that preservation may degrade. |
| Colors changed unexpectedly (e.g. semantic role coding ignored) | Add explicit role-coding to the INTENT — "the orange box is the trigger, the blue is the agent core, purple are tools" — nano-banana-pro respects role notes when stated. |
| Style looks watered-down | The style file's visual identity wasn't pasted in full. Most style blocks lose distinctiveness if you trim them. Paste verbatim. |
| Output went JPG by accident | `output_format` defaulted to `jpg`; explicitly pass `"output_format": "png"`. |

## Adding a new style

Drop a new `<style>.md` in this folder using the structure of any existing style file (Vibe / Best for / Visual identity / Icon directives / Palette / Typography / Background / Reference). Add a row to the style picker table above. Keep style files **opinionated** — a style is a complete visual system, not a parameter dial.

## When NOT to use this template

- Source diagram has a structural bug (overlap, wrong arrows). **Fix in `/draw-diagrams` first**, then prettify.
- The user wants a different *layout*, not different *rendering*. Edit the `.build.mjs`, not the prettify pass.
- Source is already vector-clean (e.g. a Mermaid SVG). nano-banana-pro is for raster sources.
