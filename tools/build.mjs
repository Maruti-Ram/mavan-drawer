#!/usr/bin/env node
// Emits lab/manifest.json (what the lab loads) and dist/icons.json (a build artefact).
// Every master in tools/masters.mjs is built; lab pages read the 24 master.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { bbox } from './geometry.mjs';
import { opticalBearings } from './optical.mjs';
import { MASTERS, STROKE, FILLED_WEIGHT, weightOf } from './masters.mjs';

const r2 = (n) => Math.round(n * 100) / 100;

function buildMaster(canvas) {
  const dir = join('src/icons', String(canvas));
  const names = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => f.replace('.svg', '')).sort() : [];
  const icons = Object.fromEntries(names.map((n) => {
    const src = readFileSync(join(dir, `${n}.svg`), 'utf8');
    const clean = src.replace(/<!--[\s\S]*?-->/g, '');
    const els = [...clean.matchAll(/<path([^>]*)\bd="([^"]+)"/g)];
    // Shape-filled drawings mark their areas fill="currentColor"; those carry no stroke.
    const areas = els.filter((m) => /\bfill="currentColor"/.test(m[1])).map((m) => m[2]);
    const paths = els.filter((m) => !/\bfill="currentColor"/.test(m[1])).map((m) => m[2]);
    const mark = /<!--\s*keyline:\s*mark\s*-->/.test(src);
    // Search words kept beside the name: <!-- tags: long sweep --> on check-2.
    const tags = src.match(/<!--\s*tags:\s*([^>]*?)\s*-->/)?.[1].split(',').map((t) => t.trim()).filter(Boolean) ?? [];
    // The body as drawn, for the Library page to render without re-deriving attributes.
    const body = clean.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();

    // Ink bounds and side bearings — the SVG equivalent of a typeface's side
    // bearings. Consumers use these to align optical edges instead of box edges.
    // The root's own stroke-width is authoritative (lint checks it); a shape-filled
    // drawing keeps 1.5 for its leftover lines.
    const sw = Number(clean.match(/<svg\b[^>]*\bstroke-width="([\d.]+)"/)?.[1] ?? weightOf(n, canvas));
    const h = sw / 2;
    // A stroke grows its centreline box by half a stroke; a filled area is its own box.
    const boxes = [];
    if (paths.length) { const s = bbox(paths); boxes.push({ x0: s.x0 - h, y0: s.y0 - h, x1: s.x1 + h, y1: s.y1 + h }); }
    if (areas.length) boxes.push(bbox(areas));
    const b = boxes.reduce((u, v) => ({ x0: Math.min(u.x0, v.x0), y0: Math.min(u.y0, v.y0), x1: Math.max(u.x1, v.x1), y1: Math.max(u.y1, v.y1) }),
      { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
    const ink = { x: r2(b.x0), y: r2(b.y0), w: r2(b.x1 - b.x0), h: r2(b.y1 - b.y0) };
    const bearing = {
      left: ink.x, top: ink.y,
      right: r2(canvas - (ink.x + ink.w)), bottom: r2(canvas - (ink.y + ink.h)),
    };
    // Optical bearings model strokes only; shape-filled drawings get geometric ones for now.
    const optical = paths.length && !areas.length ? opticalBearings(paths, sw, canvas)
      : Object.fromEntries(Object.entries(bearing).map(([k, v]) => [k, { geometric: v, recession: 0, optical: v }]));
    return [n, { paths, areas, body, mark, tags, stroke: sw, ink, bearing, optical }];
  }));
  return { names, icons };
}

const built = Object.fromEntries(Object.keys(MASTERS).map((m) => [m, buildMaster(Number(m))]));

// The drawing order, so the Library can show progress against it.
//   - [x] 12. `arrow-right` · Arrows & Direction · variant of `arrow`
const queue = [];
let section = '';
for (const line of readFileSync('research/queue.md', 'utf8').split('\n')) {
  const h = line.match(/^## (.+)/);
  if (h) { section = h[1].trim(); continue; }
  const q = line.match(/^- \[([ x~])\] (\d+)\. `([^`]+)`(?: · ([^·]+?))?(?: · variant of `([^`]+)`)?(?: — (.+))?\s*$/);
  if (q) queue.push({ n: +q[2], name: q[3], section, category: q[4]?.trim() ?? null, base: q[5] ?? null, note: q[6] ?? null,
    status: { ' ': 'todo', '~': 'review', x: 'done' }[q[1]] });
}

mkdirSync('lab', { recursive: true });
mkdirSync('dist', { recursive: true });
writeFileSync('lab/manifest.json', JSON.stringify({ stroke: STROKE, filledWeight: FILLED_WEIGHT, ...built[24], masters: built, queue }, null, 2));
writeFileSync('dist/icons.json', JSON.stringify(Object.fromEntries(Object.entries(built).map(([m, b]) => [m, b.icons]))));

// Standalone metrics file — small, and the thing a consumer's <Icon> needs to
// compensate optically without parsing any path data.
const metrics = Object.fromEntries(Object.entries(built).map(([m, { names, icons }]) => [m,
  Object.fromEntries(names.map((n) => [n, {
    ink: icons[n].ink,
    bearing: icons[n].bearing,               // geometric — where ink stops
    optical: icons[n].optical,               // tuned — where ink *reads* as stopping
  }]))]));
writeFileSync('dist/metrics.json', JSON.stringify(metrics, null, 2));

console.log(`built ${Object.entries(built).map(([m, b]) => `${m}: ${b.names.length}`).join(' · ')} → lab/manifest.json, dist/icons.json, dist/metrics.json`);
