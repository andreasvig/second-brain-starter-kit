// Excalidraw diagram builder — reusable helpers for /draw-diagrams.
//
// Style definitions live alongside the class so the module is self-contained.
// Connections are deferred — arrow start/end coords are computed in _finalize()
// once all calls are known, so multiple arrows from the same source distribute
// evenly along its edge instead of all leaving from the same point.

import { writeFileSync } from 'node:fs';

// ============================================================================
// Style definitions
// ----------------------------------------------------------------------------
// Each style is a complete look-and-feel preset: font, roughness, rounding,
// strokeWidth, sizes, and per-node-type palette (fill + stroke).
//
// engineering-whiteboard (default)
//   "engineer at a whiteboard". Virgil hand-drawn font, soft pastel category
//   fills, roughness 1. Use for technical architectures that should feel
//   approachable but credible.
//
// academic
//   Journal-paper aesthetic. Helvetica, sharp corners, roughness 0, monochrome
//   except a single blue accent for the central node. Use when hand-drawn would
//   feel unprofessional. Color carries meaning, never decoration.
//
// cartoon-simple
//   Friendly explainer look. Virgil, bold colors, roughness 2, big text and
//   thick strokes. Use for non-technical audiences or onboarding decks.
//
// Adding a style: append a new entry below. Required keys: fontFamily,
// roughness, rounded, sizes {title,label,annotation}, strokeWidth, and a
// palette covering trigger / core / tool / storage / output / decision /
// neutral. Font IDs: 1=Virgil, 2=Helvetica, 3=Cascadia.
// ============================================================================

export const STYLES = {
  'engineering-whiteboard': {
    fontFamily: 1,
    roughness: 1,
    rounded: true,
    sizes: { title: 26, label: 16, annotation: 13 },
    strokeWidth: 2,
    palette: {
      trigger: { fill: '#fff4e6', stroke: '#e8590c' },
      core:    { fill: '#e7f5ff', stroke: '#1971c2' },
      tool:    { fill: '#f3f0ff', stroke: '#5f3dc4' },
      storage: { fill: '#ebfbee', stroke: '#2f9e44' },
      output:  { fill: '#fff5f5', stroke: '#c92a2a' },
      decision:{ fill: '#fff9db', stroke: '#f59f00' },
      neutral: { fill: '#ffffff', stroke: '#1e1e1e' },
    },
  },

  'academic': {
    fontFamily: 2,
    roughness: 0,
    rounded: false,
    sizes: { title: 24, label: 14, annotation: 12 },
    strokeWidth: 1,
    palette: {
      trigger: { fill: '#ffffff', stroke: '#1e1e1e' },
      core:    { fill: '#f8f9fa', stroke: '#1c7ed6' },
      tool:    { fill: '#ffffff', stroke: '#1e1e1e' },
      storage: { fill: '#ffffff', stroke: '#1e1e1e' },
      output:  { fill: '#ffffff', stroke: '#1e1e1e' },
      decision:{ fill: '#ffffff', stroke: '#1e1e1e' },
      neutral: { fill: '#ffffff', stroke: '#1e1e1e' },
    },
  },

  'cartoon-simple': {
    fontFamily: 1,
    roughness: 2,
    rounded: true,
    sizes: { title: 32, label: 20, annotation: 16 },
    strokeWidth: 3,
    palette: {
      trigger: { fill: '#ffec99', stroke: '#f08c00' },
      core:    { fill: '#a5d8ff', stroke: '#1864ab' },
      tool:    { fill: '#d0bfff', stroke: '#5f3dc4' },
      storage: { fill: '#b2f2bb', stroke: '#2f9e44' },
      output:  { fill: '#ffc9c9', stroke: '#c92a2a' },
      decision:{ fill: '#ffec99', stroke: '#f08c00' },
      neutral: { fill: '#ffd8a8', stroke: '#d9480f' },
    },
  },
};

// ============================================================================
// Element factories
// ============================================================================

const baseElement = {
  angle: 0,
  fillStyle: 'solid',
  strokeStyle: 'solid',
  opacity: 100,
  groupIds: [],
  frameId: null,
  isDeleted: false,
  boundElements: [],
  updated: 1,
  link: null,
  locked: false,
  seed: 1,
  version: 1,
  versionNonce: 1,
};

function shapeElement({ id, type, x, y, w, h, fill, stroke, strokeWidth, roughness, rounded }) {
  return {
    ...baseElement,
    id,
    type,
    x, y,
    width: w,
    height: h,
    backgroundColor: fill,
    strokeColor: stroke,
    strokeWidth,
    roughness,
    roundness: rounded && type === 'rectangle' ? { type: 3 } : null,
  };
}

function textElement({ id, x, y, w, h, text, size, fontFamily, align = 'center' }) {
  return {
    ...baseElement,
    id,
    type: 'text',
    x, y,
    width: w,
    height: h,
    fontSize: size,
    fontFamily,
    text,
    textAlign: align,
    verticalAlign: 'middle',
    containerId: null,
    originalText: text,
    lineHeight: 1.25,
    strokeColor: '#1e1e1e',
    backgroundColor: 'transparent',
    strokeWidth: 1,
    roughness: 1,
    roundness: null,
    baseline: Math.round(size * 1.05),
  };
}

// Inner usable area for label placement, accounting for shape geometry.
function innerBox(shape, x, y, w, h) {
  if (shape === 'diamond') return { ix: x + w * 0.15, iy: y + h * 0.25, iw: w * 0.7, ih: h * 0.5 };
  if (shape === 'ellipse') return { ix: x + w * 0.075, iy: y + h * 0.15, iw: w * 0.85, ih: h * 0.7 };
  return { ix: x, iy: y, iw: w, ih: h };
}

// excalidraw_export places the LAST text line's baseline at y=baseline within
// the bbox and stacks earlier lines into negative y. The visual centre is NOT
// the bbox centre; this offset compensates so the visual centre lands on the
// shape centre. Empirically derived from ascent ~0.85·size, descent ~0.2·size,
// lineHeight 1.25.
function visualMiddleOffset(fontSize, lineCount) {
  return fontSize * (0.725 - 0.625 * (lineCount - 1));
}

// ============================================================================
// Edge-routing helpers (used during finalize)
// ============================================================================

// Which edge of `from` faces `to`? right / left / top / bottom.
function primaryEdge(from, to) {
  const fcx = from.x + from.width / 2;
  const fcy = from.y + from.height / 2;
  const tcx = to.x + to.width / 2;
  const tcy = to.y + to.height / 2;
  const dx = tcx - fcx;
  const dy = tcy - fcy;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
  return dy >= 0 ? 'bottom' : 'top';
}

// Point at fractional position t (0..1) along the named edge of a shape.
function edgePoint(shape, edge, t) {
  const { x, y, width: w, height: h } = shape;
  if (edge === 'right') return { x: x + w, y: y + h * t };
  if (edge === 'left')  return { x: x,     y: y + h * t };
  if (edge === 'top')   return { x: x + w * t, y: y };
  return                       { x: x + w * t, y: y + h };
}

// Sort by perpendicular position of the *other* endpoint, then assign offsets
// evenly across the central 60% of the edge so multiple arrows fan out cleanly.
function distributeAlongEdge(group, side) {
  const offsetField = side === 'from' ? 'fromOffset' : 'toOffset';
  if (group.length === 1) {
    group[0][offsetField] = 0.5;
    return;
  }
  const edgeField = side === 'from' ? 'fromEdge' : 'toEdge';
  const edge = group[0][edgeField];
  const isHorizontal = edge === 'right' || edge === 'left';
  group.sort((a, b) => {
    const oa = side === 'from' ? a.to : a.from;
    const ob = side === 'from' ? b.to : b.from;
    const pa = isHorizontal ? (oa.y + oa.height / 2) : (oa.x + oa.width / 2);
    const pb = isHorizontal ? (ob.y + ob.height / 2) : (ob.x + ob.width / 2);
    return pa - pb;
  });
  const lo = 0.2, hi = 0.8;
  for (let i = 0; i < group.length; i++) {
    group[i][offsetField] = lo + ((hi - lo) * i) / (group.length - 1);
  }
}

// ============================================================================
// Diagram class — main public API
// ============================================================================

export class Diagram {
  constructor({ style = 'engineering-whiteboard', title = null, viewBackgroundColor = '#ffffff' } = {}) {
    if (!STYLES[style]) {
      throw new Error(`unknown style: ${style}. available: ${Object.keys(STYLES).join(', ')}`);
    }
    this.style = STYLES[style];
    this.styleName = style;
    this.elements = [];
    this._connections = [];
    this.viewBackgroundColor = viewBackgroundColor;
    this._idCounter = 0;
    this._finalized = false;
    if (title) this.title(title);
  }

  _nextId(prefix = 'el') {
    return `${prefix}-${++this._idCounter}`;
  }

  // Place a labeled shape (rectangle, ellipse, or diamond). `evidence` adds a
  // smaller mono-font snippet under the main label — useful for technical
  // diagrams where you want to show real event names, sample JSON, etc.
  _shape(shapeType, { label, type = 'neutral', x, y, w, h, fill = null, stroke = null, size = null, evidence = null }) {
    const palette = this.style.palette[type] || this.style.palette.neutral;
    const id = this._nextId(shapeType);

    const shape = shapeElement({
      id, type: shapeType, x, y, w, h,
      fill: fill ?? palette.fill,
      stroke: stroke ?? palette.stroke,
      strokeWidth: this.style.strokeWidth,
      roughness: this.style.roughness,
      rounded: this.style.rounded,
    });
    this.elements.push(shape);

    const { ix, iy, iw, ih } = innerBox(shapeType, x, y, w, h);

    if (label) {
      const fontSize = size ?? this.style.sizes.label;
      const lines = label.split('\n');
      const lineH = fontSize * 1.25;
      const longestLine = Math.max(...lines.map(l => l.length));
      const txtW = Math.min(w * 0.95, longestLine * (fontSize * 0.55));
      const txtH = lines.length * lineH;
      const labelShift = evidence ? -fontSize * 0.6 : 0;

      const txt = textElement({
        id: this._nextId('txt'),
        x: ix + (iw - txtW) / 2,
        y: iy + ih / 2 - visualMiddleOffset(fontSize, lines.length) + labelShift,
        w: txtW,
        h: txtH,
        text: label,
        size: fontSize,
        fontFamily: this.style.fontFamily,
      });
      this.elements.push(txt);
    }

    if (evidence) {
      const evSize = Math.round(this.style.sizes.annotation * 0.95);
      const evLines = evidence.split('\n');
      const evLineH = evSize * 1.25;
      const evLongest = Math.max(...evLines.map(l => l.length));
      const evW = Math.min(w * 0.9, evLongest * (evSize * 0.6));
      const evH = evLines.length * evLineH;
      const labelHeight = label ? (label.split('\n').length * (size ?? this.style.sizes.label) * 1.25) : 0;

      const evTxt = textElement({
        id: this._nextId('ev'),
        x: ix + (iw - evW) / 2,
        y: iy + ih / 2 + labelHeight * 0.25 - visualMiddleOffset(evSize, evLines.length),
        w: evW,
        h: evH,
        text: evidence,
        size: evSize,
        fontFamily: 3, // Cascadia mono
      });
      this.elements.push(evTxt);
    }

    return shape;
  }

  box(opts)     { return this._shape('rectangle', opts); }
  ellipse(opts) { return this._shape('ellipse', opts); }
  diamond(opts) { return this._shape('diamond', { type: 'decision', ...opts }); }

  // Connect two shapes. Arrow start/end are deferred to _finalize() so multiple
  // arrows leaving the same source distribute along its edge.
  connect(from, to, { dashed = false, label = null } = {}) {
    const arrow = {
      ...baseElement,
      id: this._nextId('arr'),
      type: 'arrow',
      x: 0, y: 0,
      width: 0, height: 0,
      points: [[0, 0], [1, 1]],
      lastCommittedPoint: null,
      startBinding: { elementId: from.id, focus: 0, gap: 4 },
      endBinding:   { elementId: to.id,   focus: 0, gap: 4 },
      startArrowhead: null,
      endArrowhead: 'arrow',
      strokeStyle: dashed ? 'dashed' : 'solid',
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      strokeWidth: this.style.strokeWidth,
      roughness: this.style.roughness,
      roundness: { type: 2 },
      elbowed: false,
    };
    this.elements.push(arrow);

    let labelEl = null;
    if (label) {
      const size = this.style.sizes.annotation;
      const txtW = Math.max(60, label.length * size * 0.55);
      labelEl = textElement({
        id: this._nextId('arrlbl'),
        x: 0, y: 0,
        w: txtW,
        h: size * 1.4,
        text: label,
        size,
        fontFamily: this.style.fontFamily,
        align: 'center',
      });
      this.elements.push(labelEl);
    }

    this._connections.push({ from, to, arrow, labelEl });
    return arrow;
  }

  text({ text, x, y, w = 200, h = 30, size = null, align = 'left' }) {
    const finalSize = size ?? this.style.sizes.annotation;
    const txt = textElement({
      id: this._nextId('txt'),
      x, y, w, h,
      text,
      size: finalSize,
      fontFamily: this.style.fontFamily,
      align,
    });
    this.elements.push(txt);
    return txt;
  }

  title(text, { x = 80, y = 30, w = 800, h = 40 } = {}) {
    const txt = textElement({
      id: this._nextId('title'),
      x, y, w, h,
      text,
      size: this.style.sizes.title,
      fontFamily: this.style.fontFamily,
      align: 'left',
    });
    this.elements.push(txt);
    return txt;
  }

  // Group connections by (source, source-edge) and (target, target-edge), then
  // distribute exit/enter offsets along each edge. Computes final arrow coords
  // and offsets edge labels perpendicular to the arrow shaft.
  _finalize() {
    if (this._finalized) return;
    this._finalized = true;

    for (const c of this._connections) {
      c.fromEdge = primaryEdge(c.from, c.to);
      c.toEdge   = primaryEdge(c.to, c.from);
    }

    const fromGroups = new Map();
    const toGroups = new Map();
    for (const c of this._connections) {
      const fk = `${c.from.id}:${c.fromEdge}`;
      const tk = `${c.to.id}:${c.toEdge}`;
      if (!fromGroups.has(fk)) fromGroups.set(fk, []);
      if (!toGroups.has(tk))   toGroups.set(tk, []);
      fromGroups.get(fk).push(c);
      toGroups.get(tk).push(c);
    }
    for (const g of fromGroups.values()) distributeAlongEdge(g, 'from');
    for (const g of toGroups.values())   distributeAlongEdge(g, 'to');

    const gap = 4;
    for (const c of this._connections) {
      const start = edgePoint(c.from, c.fromEdge, c.fromOffset);
      const end   = edgePoint(c.to,   c.toEdge,   c.toOffset);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy);
      const endX = len > gap ? end.x - (dx / len) * gap : end.x;
      const endY = len > gap ? end.y - (dy / len) * gap : end.y;

      c.arrow.x = start.x;
      c.arrow.y = start.y;
      c.arrow.points = [[0, 0], [endX - start.x, endY - start.y]];
      c.arrow.width  = Math.abs(endX - start.x);
      c.arrow.height = Math.abs(endY - start.y);

      if (c.labelEl) {
        const ndx = endX - start.x;
        const ndy = endY - start.y;
        const nlen = Math.hypot(ndx, ndy) || 1;
        // Perpendicular unit vector, rotated 90° anti-clockwise from arrow direction.
        const nx = -ndy / nlen;
        const ny =  ndx / nlen;
        const off = 14;
        const midX = (start.x + endX) / 2;
        const midY = (start.y + endY) / 2;
        c.labelEl.x = midX + nx * off - c.labelEl.width / 2;
        c.labelEl.y = midY + ny * off - c.labelEl.height / 2;
      }
    }
  }

  write(path) {
    this._finalize();
    const file = {
      type: 'excalidraw',
      version: 2,
      source: 'https://excalidraw.com',
      elements: this.elements,
      appState: {
        viewBackgroundColor: this.viewBackgroundColor,
        gridSize: null,
      },
      files: {},
    };
    writeFileSync(path, JSON.stringify(file, null, 2));
    return path;
  }
}
