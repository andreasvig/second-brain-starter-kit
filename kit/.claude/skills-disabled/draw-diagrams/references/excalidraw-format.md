# Excalidraw format — gotchas and lessons learned

What I've learned the hard way about generating `.excalidraw` files programmatically. Update this file when new gotchas surface.

## File structure

Top-level shape:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ ... ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": null
  },
  "files": {}
}
```

The `elements` array holds all shapes. `appState` is global canvas state. `files` is for embedded images (usually empty for diagrams).

## Required fields per element

Every element needs these or excalidraw_export crashes / produces malformed SVG:

- `id` (unique string)
- `type` (`"rectangle"`, `"text"`, `"arrow"`, `"line"`, `"ellipse"`, etc.)
- `x`, `y`, `width`, `height` (numbers)
- `angle` (usually 0)
- `strokeColor`, `backgroundColor` (hex strings; `"transparent"` works for fill)
- `fillStyle` (`"solid"` | `"hachure"` | `"cross-hatch"`)
- `strokeWidth` (1 / 2 / 3)
- `strokeStyle` (`"solid"` | `"dashed"` | `"dotted"`)
- `roughness` (0 = clean, 1 = sketch, 2 = rough)
- `opacity` (0–100)
- `groupIds` (array, usually `[]`)
- `frameId` (usually `null`)
- `roundness` (`null` for sharp; `{ "type": 3 }` for rounded rect; `{ "type": 2 }` for arrow)
- `seed`, `version`, `versionNonce` (numbers; any unique values work for new elements)
- `isDeleted` (`false`)
- `boundElements` (array)
- `updated` (number; any value)
- `link` (`null`)
- `locked` (`false`)

## Text elements — the baseline gotcha

**Text elements MUST include a `baseline` field** or excalidraw_export emits SVG with `y="NaN"` and all text lines collapse onto each other.

```json
{
  "type": "text",
  "fontSize": 16,
  "baseline": 17,        // <-- REQUIRED. Approximately fontSize * 1.05.
  "fontFamily": 1,       // 1 = Virgil (hand-drawn), 2 = Helvetica, 3 = Cascadia
  "text": "Hello\nWorld",
  "originalText": "Hello\nWorld",  // same as `text` for a freshly authored element
  "textAlign": "center",
  "verticalAlign": "middle",
  "lineHeight": 1.25,
  "containerId": null    // or the id of a rectangle this text is bound inside
}
```

`originalText` and `text` should be the same when generating from scratch. Excalidraw uses `originalText` to re-wrap when the container resizes; `text` holds the currently-displayed wrapped value.

## Text inside a shape — visual centre ≠ bbox centre

Even with `containerId: null` and manually-placed coords, text still doesn't sit centered inside a shape. excalidraw_export places the *last* line's baseline at `y = baseline` within the text bbox and stacks earlier lines into negative y (relative to the bbox). The visual centre of the rendered glyphs is therefore HIGHER than the bbox centre.

`Diagram.box()` compensates by computing a `visualMiddleOffset` and shifting the text element's y up:

```js
// fontSize·(0.725 - 0.625·(lineCount - 1)) — empirical, derived from
// ascent ~0.85·size, descent ~0.2·size, lineHeight 1.25.
const offset = fontSize * (0.725 - 0.625 * (lineCount - 1));
text.y = innerCentreY - offset;
```

Without this, single-line labels sit ~12px too high and 2-line labels sit ~18px too high inside their boxes.

## Text inside a shape — DON'T use `containerId`

Intuitive approach (broken): bind text to its container shape via `containerId` + matching `boundElements` on the shape, set the text's coords to the shape center.

The problem: excalidraw_export's tspan auto-centering applies an additional vertical offset on top of your coords. Result is double-positioning — text lands against the top edge, with negative `y="-63"` etc. in the SVG.

**Fix: don't use `containerId` for text generated from code.** Make the text a free-floating element with `containerId: null` and place it manually inside the shape. excalidraw_export then uses your coords directly.

```js
// In Diagram.box() — text is independent of the rect
const txt = textElement({ ... containerId: null });    // free-floating
this.elements.push(rectElement, txt);
```

Trade-off: when the user opens the .excalidraw and resizes the box in Excalidraw, the text won't auto-follow. Acceptable for v1; can be improved with editor-side rebinding later.

The `Diagram.box()` / `.ellipse()` / `.diamond()` helpers in `lib/builder.mjs` apply this fix automatically.

## Arrows

```json
{
  "type": "arrow",
  "x": 100, "y": 100,
  "width": 200, "height": 50,
  "points": [[0, 0], [200, 50]],     // relative to x,y; first point should be [0,0]
  "lastCommittedPoint": null,
  "startBinding": { "elementId": "<box-id>", "focus": 0, "gap": 4 },
  "endBinding":   { "elementId": "<box-id>", "focus": 0, "gap": 4 },
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "roundness": { "type": 2 },
  "elbowed": false
}
```

`points` are relative to the element's `x`, `y`. First point is conventionally `[0, 0]`.

`startBinding` / `endBinding` link the arrow to source/target boxes — when the boxes move in Excalidraw, the arrow follows. `focus: 0` means "center"; `gap: 4` is the visual gap between the arrowhead and the box edge.

**Clip arrow points to box edges, not centers.** Bindings only animate the arrow during interactive editing in the Excalidraw GUI. excalidraw_export renders the raw `points` array as-is. If you set the points to go from center-to-center, the arrowhead lands inside the target shape, drawing over the label.

Clip the line to each shape's bounding rectangle before producing `points`:

```js
const dx = targetCenterX - sourceCenterX;
const dy = targetCenterY - sourceCenterY;
const [exitDx, exitDy]   = clipToRect( dx,  dy, sourceW, sourceH);
const [enterDx, enterDy] = clipToRect(-dx, -dy, targetW, targetH);
const startX = sourceCenterX + exitDx;
const endX   = targetCenterX + enterDx;
// ... arrow.x = startX, points = [[0,0], [endX-startX, endY-startY]]
```

`Diagram.connect()` in `lib/builder.mjs` does this automatically. The bounding-rect clip is approximate for ellipses/diamonds (the actual edge sits inside the bbox at non-axis angles) but the visual error is small.

## Multiple arrows from one source — defer placement to a finalize pass

Computing arrow start/end at `connect()` time is wrong when the same source has N outgoing arrows. Center-to-edge clipping puts all N exits at nearly the same point, so arrows overlap on the way out.

`Diagram` records each `connect()` call and resolves arrow geometry in `_finalize()` (called from `write()`). The pass groups arrows by `(source, primary-edge)` and `(target, primary-edge)`, then distributes exit/enter offsets along each edge across the central 60% (0.2..0.8 of edge length, sorted by perpendicular position of the other endpoint). N parallel arrows from one source spread out instead of stacking.

Edge labels are also positioned in `_finalize()` — perpendicular to the final arrow direction, offset by ~14px from the shaft midpoint. Without the perpendicular offset, labels on diagonal arrows overlap the line itself.

## viewBox quirks

`excalidraw_export` computes the SVG `viewBox` from the bounding box of all elements. Two things to watch:

- **The bounding-box computation can be slightly off** — particularly on the right/bottom edges. Add ~50px padding around your layout to avoid clipping.
- **For PNG rendering, use `rsvg-convert`, NOT `qlmanage`.** `qlmanage` pads thumbnails to a square, which messes up wide diagrams. `rsvg-convert -z 1.5 input.svg -o output.png` respects the viewBox correctly.

## Font families

Excalidraw uses numeric font family IDs:

- `1` — Virgil (hand-drawn). Default. Good for engineering-whiteboard / cartoon styles.
- `2` — Helvetica (clean). Good for academic / formal styles.
- `3` — Cascadia (monospace). Use for code labels.

Other IDs may exist in newer Excalidraw versions but these three cover most needs.

## Roundness types

- `null` — sharp rectangle / line
- `{ "type": 2 }` — arrows and lines (sharp corners)
- `{ "type": 3 }` — rectangles with rounded corners

Other types exist for more specialized shapes. When in doubt, leave `null`.

## Roughness levels

- `0` — clean, no jitter (looks like a normal vector diagram)
- `1` — sketch (default; mild hand-drawn jitter)
- `2` — rough (heavy jitter, very informal)

For a polished engineering aesthetic use `1`. For an academic clean look use `0`. For a friendly cartoon use `2`.
