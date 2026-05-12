#!/usr/bin/env node
// draw — CLI for /draw-diagrams.
//
// Subcommands:
//   new <slug> [--style=<style>] [--out=<dir>]   Scaffold a build script
//   build <path>                                  Run build script + render PNG
//   render <path>                                 Render an .excalidraw to PNG
//   test                                          Run all tests/*.build.mjs
//   styles                                        List available styles
//
// Path resolution for build/render:
//   <path> is a .excalidraw file  → render it to .png next to it
//   <path> is a .build.mjs file   → run it (writes .excalidraw), then render
//   <path> is a directory         → find <basename>.build.mjs inside, run+render
//
// Output convention (for `new`): artifacts/diagrams/YYYY-MM-DD-<slug>/
// Override via --out=<dir> (e.g. workspace/<project>/<slug>/assets/).

import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync, unlinkSync, readFileSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, basename, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

import { STYLES } from './builder.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR  = dirname(SCRIPT_DIR);
const PROJECT_ROOT = process.env.CLAUDE_PROJECT_DIR
  || resolve(SKILL_DIR, '../../..');

const today = () => new Date().toISOString().slice(0, 10);
const log = (msg) => console.log(msg);
const die = (msg, code = 1) => { console.error(msg); process.exit(code); };

// ---------------------------------------------------------------------------
// preflight
// ---------------------------------------------------------------------------

function checkTool(cmd, install) {
  const r = spawnSync('which', [cmd], { stdio: 'pipe' });
  if (r.status !== 0) die(`missing tool: ${cmd}\n  install: ${install}`);
}

function preflight() {
  checkTool('excalidraw_export', 'npm install -g excalidraw_export');
  checkTool('rsvg-convert',      'brew install librsvg');
}

// ---------------------------------------------------------------------------
// parsing
// ---------------------------------------------------------------------------

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (const a of args) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=', 2);
      flags[k] = v ?? true;
    } else positional.push(a);
  }
  return { flags, positional };
}

// ---------------------------------------------------------------------------
// render pipeline (.excalidraw → SVG → PNG)
// SVG export is cached by content hash — repeat renders of an unchanged
// .excalidraw skip the slow excalidraw_export step.
// ---------------------------------------------------------------------------

const CACHE_DIR = join(tmpdir(), 'draw-diagrams-cache');

function svgCachePath(excContent) {
  const hash = createHash('sha1').update(excContent).digest('hex').slice(0, 16);
  return join(CACHE_DIR, `${hash}.svg`);
}

function renderExcalidrawToPng(excPath) {
  if (!existsSync(excPath)) die(`not found: ${excPath}`);
  const excContent = readFileSync(excPath);
  const svg = `${excPath}.svg`;
  const cached = svgCachePath(excContent);

  if (existsSync(cached)) {
    copyFileSync(cached, svg);
  } else {
    spawnSync('excalidraw_export', [excPath], { stdio: 'pipe' });
    if (!existsSync(svg)) die(`SVG not produced: ${svg}`);
    mkdirSync(CACHE_DIR, { recursive: true });
    copyFileSync(svg, cached);
  }

  const png = excPath.replace(/\.excalidraw$/, '.png');
  const r = spawnSync('rsvg-convert', ['-z', '1.5', svg, '-o', png], { stdio: 'pipe' });
  unlinkSync(svg);
  if (r.status !== 0) die(`rsvg-convert failed: ${r.stderr.toString()}`);
  return png;
}

// ---------------------------------------------------------------------------
// build pipeline (.build.mjs → .excalidraw)
// ---------------------------------------------------------------------------

async function importBuildScript(buildPath) {
  if (!existsSync(buildPath)) die(`not found: ${buildPath}`);
  const url = `${fileURLToPath(import.meta.url).startsWith('/') ? 'file://' : ''}${resolve(buildPath)}`;
  return await import(url);
}

function findBuildScript(dir) {
  const candidates = readdirSync(dir).filter(f => f.endsWith('.build.mjs'));
  if (candidates.length === 0) die(`no .build.mjs found in ${dir}`);
  if (candidates.length > 1) die(`multiple .build.mjs found in ${dir}: ${candidates.join(', ')}`);
  return join(dir, candidates[0]);
}

function excalidrawForBuildScript(buildPath) {
  const base = basename(buildPath).replace(/\.build\.mjs$/, '');
  return join(dirname(buildPath), `${base}.excalidraw`);
}

// ---------------------------------------------------------------------------
// structural validation — used by `test`
// ---------------------------------------------------------------------------

const SHAPE_TYPES = new Set(['rectangle', 'ellipse', 'diamond']);

function validateStructure(excPath, spec) {
  const exc = JSON.parse(readFileSync(excPath, 'utf8'));
  const elements = exc.elements;
  const arrows = elements.filter(e => e.type === 'arrow');
  const shapes = elements.filter(e => SHAPE_TYPES.has(e.type));
  const texts  = elements.filter(e => e.type === 'text');

  for (const el of elements) {
    for (const k of ['x', 'y', 'width', 'height']) {
      if (!Number.isFinite(el[k])) {
        throw new Error(`element ${el.id} has non-finite ${k}=${el[k]}`);
      }
    }
  }
  for (const t of texts) {
    if (typeof t.baseline !== 'number') {
      throw new Error(`text ${t.id} missing baseline (would render y="NaN")`);
    }
  }
  for (const a of arrows) {
    if (!Array.isArray(a.points) || a.points.length < 2) {
      throw new Error(`arrow ${a.id} has malformed points`);
    }
    for (const [px, py] of a.points) {
      if (!Number.isFinite(px) || !Number.isFinite(py)) {
        throw new Error(`arrow ${a.id} has non-finite point [${px}, ${py}]`);
      }
    }
  }

  if (spec) {
    if (typeof spec.shapes === 'number' && shapes.length !== spec.shapes) {
      throw new Error(`shape count: expected ${spec.shapes}, got ${shapes.length}`);
    }
    if (typeof spec.connections === 'number' && arrows.length !== spec.connections) {
      throw new Error(`connection count: expected ${spec.connections}, got ${arrows.length}`);
    }
  }
  return { shapes: shapes.length, arrows: arrows.length, texts: texts.length };
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

async function cmdNew(args) {
  const { flags, positional } = parseFlags(args);
  const slug = positional[0];
  if (!slug) die('usage: draw new <slug> [--style=<style>] [--out=<dir>]');
  const style = flags.style || 'engineering-whiteboard';
  if (!STYLES[style]) die(`unknown style: ${style}. available: ${Object.keys(STYLES).join(', ')}`);

  const outDir = flags.out
    ? resolve(PROJECT_ROOT, flags.out)
    : join(PROJECT_ROOT, 'artifacts', 'diagrams', `${today()}-${slug}`);

  mkdirSync(outDir, { recursive: true });
  const builderPath = relative(outDir, join(SKILL_DIR, 'lib', 'builder.mjs'));
  const buildScriptPath = join(outDir, `${slug}.build.mjs`);

  if (existsSync(buildScriptPath)) die(`already exists: ${buildScriptPath}`);

  const scaffold = `// ${slug} diagram. Edit this script, then:
//   node ${relative(PROJECT_ROOT, join(SKILL_DIR, 'lib', 'draw.mjs'))} build ${relative(PROJECT_ROOT, outDir)}

import { Diagram } from '${builderPath}';

const d = new Diagram({
  style: '${style}',
  title: '${slug}',
});

const a = d.box({ label: 'A', type: 'trigger', x: 80,  y: 120, w: 200, h: 80 });
const b = d.box({ label: 'B', type: 'core',    x: 380, y: 120, w: 200, h: 80 });
d.connect(a, b);

const out = new URL('./${slug}.excalidraw', import.meta.url);
d.write(out.pathname);
console.log(\`wrote \${out.pathname}\`);
`;
  writeFileSync(buildScriptPath, scaffold);
  log(`scaffolded: ${relative(PROJECT_ROOT, buildScriptPath)}`);
  log(`next: edit it, then run: node ${relative(PROJECT_ROOT, join(SKILL_DIR, 'lib', 'draw.mjs'))} build ${relative(PROJECT_ROOT, outDir)}`);
}

async function cmdBuild(args) {
  preflight();
  const path = args[0];
  if (!path) die('usage: draw build <path-to-build.mjs-or-folder-or-excalidraw>');

  const abs = resolve(path);
  let buildPath, excPath;

  if (abs.endsWith('.excalidraw')) {
    excPath = abs;
  } else if (abs.endsWith('.build.mjs')) {
    buildPath = abs;
    excPath = excalidrawForBuildScript(buildPath);
  } else if (existsSync(abs) && statSync(abs).isDirectory()) {
    buildPath = findBuildScript(abs);
    excPath = excalidrawForBuildScript(buildPath);
  } else {
    die(`unrecognized path: ${path}`);
  }

  if (buildPath) {
    log(`build: ${relative(PROJECT_ROOT, buildPath)}`);
    await importBuildScript(buildPath);
  }
  log(`render: ${relative(PROJECT_ROOT, excPath)}`);
  const png = renderExcalidrawToPng(excPath);
  log(`done: ${relative(PROJECT_ROOT, png)}`);
}

function cmdRender(args) {
  preflight();
  const path = args[0];
  if (!path) die('usage: draw render <path-to-excalidraw>');
  const png = renderExcalidrawToPng(resolve(path));
  log(png);
}

async function cmdTest(args) {
  preflight();
  const testsDir = join(PROJECT_ROOT, 'artifacts', 'draw-diagrams', 'tests');
  if (!existsSync(testsDir)) die(`no tests directory: ${testsDir}`);
  const buildScripts = readdirSync(testsDir)
    .filter(f => f.endsWith('.build.mjs'))
    .sort();
  if (buildScripts.length === 0) die('no tests found');

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const f of buildScripts) {
    const buildPath = join(testsDir, f);
    const excPath = excalidrawForBuildScript(buildPath);
    const pngPath = excPath.replace(/\.excalidraw$/, '.png');
    process.stdout.write(`  ${f.padEnd(36)} `);
    try {
      const mod = await importBuildScript(buildPath);
      renderExcalidrawToPng(excPath);
      const counts = validateStructure(excPath, mod.spec);
      const size = statSync(pngPath).size;
      if (size < 1000) throw new Error(`PNG suspiciously small (${size} bytes)`);
      const specTag = mod.spec ? '' : ' [no spec]';
      log(`✓ ${counts.shapes}s/${counts.arrows}a (${(size / 1024).toFixed(1)} KB)${specTag}`);
      passed++;
    } catch (err) {
      log(`✗ ${err.message}`);
      failed++;
      failures.push({ file: f, err: err.message });
    }
  }

  log('');
  log(`${passed}/${buildScripts.length} passed`);
  if (failed > 0) {
    for (const { file, err } of failures) log(`  FAIL ${file}: ${err}`);
    process.exit(1);
  }
}

function cmdStyles() {
  log('available styles:');
  for (const name of Object.keys(STYLES)) {
    const s = STYLES[name];
    log(`  ${name.padEnd(24)} font=${s.fontFamily === 1 ? 'Virgil' : s.fontFamily === 2 ? 'Helvetica' : 'Cascadia'} roughness=${s.roughness} rounded=${s.rounded}`);
  }
}

// ---------------------------------------------------------------------------
// entry
// ---------------------------------------------------------------------------

const [cmd, ...rest] = process.argv.slice(2);

const commands = {
  new:     cmdNew,
  build:   cmdBuild,
  render:  cmdRender,
  test:    cmdTest,
  styles:  cmdStyles,
};

if (!cmd || !commands[cmd]) {
  log('usage: draw <command> [args]');
  log('');
  log('commands:');
  log('  new <slug> [--style=<style>] [--out=<dir>]   Scaffold a build script');
  log('  build <path>                                  Run build script + render PNG');
  log('  render <path>                                 Render .excalidraw to PNG');
  log('  test                                          Run all tests/*.build.mjs');
  log('  styles                                        List available styles');
  process.exit(cmd ? 1 : 0);
}

await commands[cmd](rest);
