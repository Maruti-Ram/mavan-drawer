#!/usr/bin/env node
// Emits lab/manifest.json (what the lab loads) and dist/icons.json (a build artefact).
// Every master in tools/masters.mjs is built; lab pages read the 24 master.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { bbox, anatomy } from './geometry.mjs';
import { opticalBearings } from './optical.mjs';
import { MASTERS, STROKES, FILLED_WEIGHT, strokeOf, weightOf } from './masters.mjs';
import { parseSheet } from './queue.mjs';

const r2 = (n) => Math.round(n * 100) / 100;

function buildMaster(canvas) {
  const dir = join('src/icons', String(canvas));
  const names = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => f.replace('.svg', '')).sort() : [];
  const icons = Object.fromEntries(names.map((n) => {
    const src = readFileSync(join(dir, `${n}.svg`), 'utf8');
    const clean = src.replace(/<!--[\s\S]*?-->/g, '');
    const els = [...clean.matchAll(/<path([^>]*)\bd="([^"]+)"([^>]*)>/g)];
    // Shape-filled drawings mark their areas fill="currentColor"; those carry no stroke.
    const areas = els.filter((m) => /\bfill="currentColor"/.test(m[1])).map((m) => m[2]);
    const lines = els.filter((m) => !/\bfill="currentColor"/.test(m[1]));
    const paths = lines.map((m) => m[2]);
    const mark = /<!--\s*keyline:\s*mark\s*-->/.test(src);
    // Search words kept beside the name: <!-- tags: long sweep --> on check-4.
    // Declared optical shift (C14): how far the ink sits off the box centre on purpose.
    const shift = (src.match(/<!--\s*optical:\s*([-\d.]+)\s+([-\d.]+)\s*-->/)?.slice(1) ?? [0, 0]).map(Number);
    const tags = src.match(/<!--\s*tags:\s*([^>]*?)\s*-->/)?.[1].split(',').map((t) => t.trim()).filter(Boolean) ?? [];
    // The body as drawn, for the Library page to render without re-deriving attributes.
    const body = clean.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();

    // Ink bounds and side bearings — the SVG equivalent of a typeface's side
    // bearings. Consumers use these to align optical edges instead of box edges.
    // The root's own stroke-width is authoritative (lint checks it); a shape-filled
    // drawing keeps the master's outline stroke for its leftover lines.
    const sw = Number(clean.match(/<svg\b[^>]*\bstroke-width="([\d.]+)"/)?.[1] ?? weightOf(n, canvas));
    // A path may carry its own weight: a numeral in a line-heavy filled drawing keeps the
    // outline weight beside heavier rails (C32, `<!-- glyph: numeral -->`), and so does a line
    // badge on a line-heavy base (C33, `<!-- badge: line -->`); lint checks both.
    const widths = lines.map((m) => Number(`${m[1]} ${m[3]}`.match(/\sstroke-width="([\d.]+)"/)?.[1] ?? sw));
    const own = widths.some((w) => w !== sw);
    // A stroke grows its centreline box by half its own stroke; a filled area is its own box.
    const boxes = paths.map((d, i) => { const s = bbox([d]), h = widths[i] / 2; return { x0: s.x0 - h, y0: s.y0 - h, x1: s.x1 + h, y1: s.y1 + h }; });
    if (areas.length) boxes.push(bbox(areas));
    const b = boxes.reduce((u, v) => ({ x0: Math.min(u.x0, v.x0), y0: Math.min(u.y0, v.y0), x1: Math.max(u.x1, v.x1), y1: Math.max(u.y1, v.y1) }),
      { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
    const ink = { x: r2(b.x0), y: r2(b.y0), w: r2(b.x1 - b.x0), h: r2(b.y1 - b.y0) };
    const bearing = {
      left: ink.x, top: ink.y,
      right: r2(canvas - (ink.x + ink.w)), bottom: r2(canvas - (ink.y + ink.h)),
    };
    // Optical bearings model strokes only; shape-filled drawings get geometric ones for now.
    const optical = paths.length && !areas.length ? opticalBearings(paths, own ? widths : sw, canvas)
      : Object.fromEntries(Object.entries(bearing).map(([k, v]) => [k, { geometric: v, recession: 0, optical: v }]));
    // Anatomy: the mark as a fraction of its container, and the void inside a glyph
    // mark. Absolute numbers (ink, bearings) cannot see either — a mark can hold a
    // perfect ink box and still sit small in its ring, or leave a hollow middle.
    const { container, mark: markBox, ratio, gap } = anatomy(paths, sw);
    // `widths` (one per path) only where a path draws at its own weight, so every other entry is unchanged
    return [n, { paths, areas, body, mark, tags, shift, stroke: sw, ...(own ? { widths } : {}), ink, bearing, optical,
      container, markBox, ratio, gap }];
  }));
  return { names, icons };
}

const built = Object.fromEntries(Object.keys(MASTERS).map((m) => [m, buildMaster(Number(m))]));

// The drawing order, so the Library can show progress against it.
//   - [x] 12. `arrow-right` · Arrows & Direction · variant of `arrow` — mvp · approved 2026-09-17
// Parsed by tools/queue.mjs's own parser, so the manifest and the commands cannot read the
// sheet differently. `mvp` is the MVP mark (a token at the start of the note, kept out of
// `note`); `date` is the `approved YYYY-MM-DD` in the note, else null.
const queue = parseSheet(readFileSync('research/queue.md', 'utf8')).rows.map((r) => ({
  n: r.n, name: r.name, section: r.section, category: r.category, base: r.base, note: r.note,
  status: r.status, mvp: r.mvp, date: r.date }));

mkdirSync('lab', { recursive: true });
mkdirSync('dist', { recursive: true });
// `stroke` is the 24 master's, kept for the lab pages that still read one scalar;
// `strokes` is the per-master map they should read instead (plans/stroke-16.md card 6).
writeFileSync('lab/manifest.json', JSON.stringify({ stroke: strokeOf(24), strokes: STROKES, filledWeight: FILLED_WEIGHT, ...built[24], masters: built, queue }, null, 2));
writeFileSync('dist/icons.json', JSON.stringify(Object.fromEntries(Object.entries(built).map(([m, b]) => [m, b.icons]))));

// Standalone metrics file — small, and the thing a consumer's <Icon> needs to
// compensate optically without parsing any path data.
const metrics = Object.fromEntries(Object.entries(built).map(([m, { names, icons }]) => [m,
  Object.fromEntries(names.map((n) => [n, {
    ink: icons[n].ink,
    shift: icons[n].shift,                   // declared optical offset from the box centre (C14)
    bearing: icons[n].bearing,               // geometric — where ink stops
    optical: icons[n].optical,               // tuned — where ink *reads* as stopping
    container: icons[n].container,           // the silhouette's ink diameter, when there is one
    ratio: icons[n].ratio,                   // mark ink box ÷ container — what absolute numbers hide
    gap: icons[n].gap,                       // a glyph mark's dot-to-body void, and it ÷ the dot
  }]))]));
writeFileSync('dist/metrics.json', JSON.stringify(metrics, null, 2));

console.log(`built ${Object.entries(built).map(([m, b]) => `${m}: ${b.names.length}`).join(' · ')} → lab/manifest.json, dist/icons.json, dist/metrics.json`);
