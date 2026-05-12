---
name: draw-diagrams
description: Create hand-drawn-style diagrams as editable .excalidraw files (with PNG previews). Use when the user wants to (1) draw a diagram, architecture, flowchart, or system, (2) visualize agent topology, pipelines, data flow, hub-and-spoke, or before/after comparisons, or (3) produce any boxes-and-arrows visual the user wants to edit afterward in Excalidraw. Styles: engineering-whiteboard, academic, cartoon-simple.
---

# /draw-diagrams — Iterative Excalidraw diagrams

> Utility skill (ships disabled). Activate with *"activate draw-diagrams"*.

Produce diagrams that are editable afterward in Excalidraw (web, desktop, or Obsidian plugin).

## When to use

- System architecture, data flow, agent topology
- Before/after or workflow-vs-agent comparisons
- Flowcharts (with decisions and start/end nodes)
- Hub-and-spoke / capability maps
- Pipelines / sequential stages
- Anything boxes-and-arrows where the user wants to **edit the result by hand** afterward

## When NOT to use

- Photo-real or AI-generated visual concepts → `/replicate`
- Pure text explanations
- Diagrams where the user explicitly wants Mermaid/PlantUML code-as-diagram with no manual editing

## Preflight

```bash
which excalidraw_export rsvg-convert
# missing → npm install -g excalidraw_export && brew install librsvg
```

The CLI (`lib/draw.mjs`) checks for both before each build/render and prints the install command if missing.

## Output convention

| Use case | Output dir |
|---|---|
| One-off / standalone | `artifacts/diagrams/YYYY-MM-DD-<slug>/` (default) |
| Bundled into a project | `workspace/<project>/<slug>/assets/` (pass `--out=...`) |

Each output dir is self-contained:

```
<slug>.build.mjs       # source of truth — re-runnable, hand-editable
<slug>.excalidraw      # Excalidraw JSON (open this in Excalidraw to edit)
<slug>.png             # rendered preview
```

Re-running overwrites — no timestamped clutter.

## CLI

```bash
node .claude/skills/draw-diagrams/lib/draw.mjs <command>
```

| Command | What it does |
|---|---|
| `new <slug> [--style=...] [--out=...]` | Scaffold an output folder + starter `.build.mjs` |
| `build <path>` | Run `.build.mjs` then render `.png`. Path can be a folder, a `.build.mjs`, or a `.excalidraw` |
| `render <path>` | Render an existing `.excalidraw` to `.png` (no rebuild) |
| `test` | Run all `tests/*.build.mjs` and confirm each renders to a non-zero PNG |
| `styles` | List available styles |

The `build` command's path resolution is the lever that makes iteration fast: edit the `.build.mjs`, then `node .../draw.mjs build <folder>` rebuilds + re-renders in one shot.

## Builder API (`lib/builder.mjs`)

```js
import { Diagram } from '<path-to>/lib/builder.mjs';

const d = new Diagram({ style: 'engineering-whiteboard', title: 'My system' });

const a = d.box     ({ label: 'cron',         type: 'trigger', x: 80,  y: 200, w: 200, h: 80 });
const b = d.box     ({ label: 'agent',        type: 'core',    x: 380, y: 180, w: 280, h: 120 });
const t = d.box     ({ label: 'tool',         type: 'tool',    x: 760, y: 200, w: 200, h: 80 });

const start = d.ellipse({ label: 'start',     type: 'trigger', x: 80,  y: 80,  w: 180, h: 60 });
const decide = d.diamond({ label: 'go?',                       x: 200, y: 200, w: 200, h: 120 });

d.connect(a, b);
d.connect(b, t, { label: 'invoke' });
d.connect(decide, t, { dashed: true, label: 'yes' });

d.text({ text: 'free-floating note',  x: 80, y: 30, w: 400, h: 30, size: 14 });

d.write(new URL('./my-system.excalidraw', import.meta.url).pathname);
```

| Method | Returns | Purpose |
|---|---|---|
| `box({...})` | shape | Rectangle. Standard nodes. |
| `ellipse({...})` | shape | Oval. Start/end terminators in flowcharts. |
| `diamond({...})` | shape | Diamond. Decisions in flowcharts. |
| `connect(from, to, opts)` | arrow | Edge with auto-clipped endpoints + optional label |
| `text({...})` | text | Free-floating annotation |
| `title(text, opts)` | text | Top-of-canvas title |
| `write(path)` | path | Serialize to `.excalidraw` JSON |

`type` controls colour from the style palette: `trigger | core | tool | storage | output | decision | neutral`.

## Styles

Three built-in styles. Canonical definitions live in `lib/builder.mjs` — the `STYLES` const is the single source of truth (palette, font, roughness, sizes). A JSDoc block above it explains when each style fits.

- **engineering-whiteboard** (default) — Virgil hand-drawn, soft pastel category fills, roughness 1
- **academic** — Helvetica, monochrome with single accent, roughness 0
- **cartoon-simple** — Virgil, bold colors, roughness 2, big text

Add a new style by appending an entry to `STYLES`. No other file needs updating.

## Shape semantics — picking the right pattern

| Concept | Pattern | Primitives |
|---|---|---|
| Agent with tools | Core in middle, tools fan out to one side | `box(core)` + N × `box(tool)` + `connect()` |
| Pipeline | Horizontal chain, left-to-right | `box(...)` × N + sequential `connect()` |
| Before/after | Two columns side-by-side, same vertical band | Free `text()` headers + two box clusters |
| Hub-and-spoke | One center, N spokes radiating | `box(core)` + N × `box(...)` + `connect(hub, spoke)` |
| Decision flow | Start ellipse → boxes → diamonds → end ellipse | `ellipse()` + `box()` + `diamond()` |
| Fan-in / convergence | Many sources → one sink | N × `connect(source, sink)` (auto-distributes on sink edge) |
| Cycle / feedback loop | Closed ring of boxes | `connect()` calls forming a loop |

For fan-out and fan-in, the builder distributes arrows along the source/target edge automatically — you don't need to handcraft exit positions.

## The flow

### 1. Parse the description

Read what the user wants. Identify:

- **Nodes** — boxes. Type? (`trigger`, `core`, `tool`, `storage`, `output`, `decision`, `neutral`)
- **Edges** — connections. Direction? Labeled? Dashed (optional/conditional) or solid?
- **Hierarchy / pattern** — fan-out, convergence, hub-and-spoke, linear pipeline, before/after columns, flowchart with decisions
- **Layout intent** — left-right (good for 16:9 video frames) or top-down (good for vertical scroll)

Write the parsed list down as the spec to check against in step 6.

### 2. Pick a style

Default `engineering-whiteboard`. Override only when the use case calls for academic formality or cartoon friendliness.

### 3. Scaffold

```bash
node .claude/skills/draw-diagrams/lib/draw.mjs new <slug> [--style=...] [--out=...]
```

This creates the folder and a starter `.build.mjs`. Edit the file: replace the placeholder boxes with the real nodes and connections.

### 4. Build + render

```bash
node .claude/skills/draw-diagrams/lib/draw.mjs build <path-to-folder>
```

One command runs the build script, then renders the `.excalidraw` to `.png`.

### 5. Read the PNG

Use the `Read` tool on the PNG. You will see the rendered diagram.

### 6. Vision check (do not skip — this is the failure mode)

After every render, walk this list against the rendered PNG. Each item is a yes/no — answer honestly. If any answer is "no", edit `<slug>.build.mjs` and re-run `build`.

1. **Coverage** — Does every node from the spec (step 1) have a shape on the canvas? Every connection an arrow in the right direction?
2. **Text inside shapes** — Is the text *visually centered* in each shape (not just bbox-centered — actually look at where the glyphs sit)? No clipping at edges?
3. **Text outside shapes** — Free `text()` calls and arrow labels: any of them overlap a shape edge, an arrow shaft, or another text element?
4. **Arrows reach their target** — Arrowheads land on the target's edge (not inside the box, not floating in space, not on an unrelated shape)?
5. **Arrows don't cross confusingly** — In fan-out groups, do exit points distribute along the source's edge (builder does this automatically)? Any two arrows that cross at an angle that could look like a single bent arrow?
6. **Layout** — All shapes inside the rendered viewBox (~50px padding on edges)? Visual hierarchy matches conceptual hierarchy?
7. **Style consistency** — Colors, font, roughness, stroke widths uniform with the requested style?

**Stopping condition**: all 7 answers are "yes", OR after 5 iterations show the user the current state and ask whether to keep iterating, accept as-is, or take a different approach (switch styles, change layout, simplify).

**Anti-pattern to watch for**: claiming the diagram is fine after only checking that the PNG file exists. The structural test (`draw test`) catches NaN coords and missing baselines, but not visual overlap. You must read the PNG with the `Read` tool and answer each item above.

### 7. Output

Final deliverables in the output folder. Hand off the PNG path and remind the user the `.excalidraw` is editable.

## Tests

```bash
node .claude/skills/draw-diagrams/lib/draw.mjs test
```

Runs all `tests/*.build.mjs` and validates each rendered diagram:

1. **Structural** — every element has finite x/y/w/h, every text has a `baseline`, every arrow has finite points
2. **Spec match** — if the build script exports `const spec = { shapes, connections }`, actual counts must match
3. **Render** — PNG is produced and non-trivially sized (≥ 1KB)

Each test build script declares its expected shape/arrow counts via `export const spec`. Renaming a `box` to `ellipse` or dropping a `connect` will fail the test. SVG output is content-hash cached in `/tmp/draw-diagrams-cache/` so reruns of unchanged diagrams skip the slow `excalidraw_export` step.

The test set doubles as a **visual gallery** — the rendered PNGs in `tests/` are exemplars of each diagram type × style.

Add a new test by dropping another `<name>.build.mjs` in `tests/` with a `spec` export. The runner picks it up automatically.

## Common gotchas

See `references/excalidraw-format.md` for full detail. Highlights:

- **Text elements MUST have `baseline`** or SVG export emits `y="NaN"`. The text helper sets it automatically.
- **Don't use `containerId`** for code-generated text — it causes double-positioning under excalidraw_export. The builder always emits free-floating text inside shapes.
- **Arrow points must clip to box edges**, not shape centers — otherwise arrowheads draw inside target shapes. `connect()` does this automatically.
- **`excalidraw_export`'s viewBox can be off** by tens of pixels — keep ~50px padding around your layout.
- **`qlmanage` pads to square**, don't use it. `rsvg-convert` respects viewBox.

## File structure

```
.claude/skills/draw-diagrams/                # the skill itself — code + docs only
├── SKILL.md                                 # this file
├── lib/
│   ├── builder.mjs                          # Diagram class + STYLES (canonical)
│   └── draw.mjs                             # CLI — new/build/render/test/styles
└── references/
    └── excalidraw-format.md                 # gotchas + element schema

artifacts/draw-diagrams/                     # generated diagrams (out of the skill)
├── examples/
│   └── <slug>/
│       ├── <slug>.build.mjs
│       ├── <slug>.excalidraw
│       └── <slug>.png
└── tests/                                   # `draw test` runs all *.build.mjs here
```
