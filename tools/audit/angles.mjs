// Angles — every straight segment in a drawing, and how far it sits from 0/45/90.
//
// WHY THIS EXISTS. Nothing in the toolchain measures the angle of a straight
// segment. `docs/01-foundations.md:191,200-201` states "angles 0/45/90" and
// `docs/09-rule-audit.md:24` records that every figure in its angle row "was
// measured by hand". So the rule is stated, broken in named places on purpose
// (`trash`'s 4° taper, `code`'s 73° slash, C30), and unaudited everywhere else.
//
// AUDIT ONLY. Nothing in `tools/` outside `tools/audit/` imports this, and it
// imports `geometry.mjs` / `masters.mjs` read-only. It writes nothing.
//
// This module is also the LOWER LAYER both audit instruments share: it owns the
// path decomposition (`piecesOf`) and the SVG reader (`readIcon`), and
// `radii.mjs` imports them from here. The path *tokenizer* is `parsePath` from
// `tools/geometry.mjs` — reused, never re-written.
//
// CONVENTIONS, stated once because every number below depends on them.
//
//   `angle`           the segment's orientation as an UNDIRECTED line, in
//                     [0, 180), measured the way a designer reads a drawing:
//                     anticlockwise from the horizontal with **y up**. SVG's y
//                     runs down, so the sign of dy is flipped first. A `/`
//                     reads 73.14°, a `\` reads 106.86°.
//   `fromHorizontal`  the same line's acute angle to the horizontal, [0, 90].
//   `fromVertical`    90 − fromHorizontal.
//   `nearest`, `dev`  the nearest of 0/45/90 to `fromHorizontal`, and the gap.
//
//   Both readings are reported because the repo quotes angles both ways:
//   C30 gives `code`'s slash as 73.14° (from the horizontal) while C22 gives
//   `trash`'s taper as 4° and `plans/stroke-16.md:163` gives `help-3`'s tail as
//   46.9° — both measured from the VERTICAL. One number alone cannot reproduce
//   the doc, so the tool reports the pair and names which is which.
//
//   `offset`          length × sin(dev) — what the deviation actually buys, in
//                     the master's own units. A 4° lean over 12.1 units is
//                     0.84 units of drift; 4° over 1 unit is 0.07 and invisible.
//                     Degrees alone rank a drawing's angles wrongly.

import { pathToFileURL } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parsePath } from '../geometry.mjs';
import { strokeOf, weightOf } from '../masters.mjs';

const DEG = 180 / Math.PI;
const EPS = 1e-9;

// ── path decomposition ─────────────────────────────────────────────────────
// `parsePath` gives commands; this gives GEOMETRY: one piece per drawn curve or
// straight run, in order, grouped into subpaths, with arcs converted from
// endpoint to centre form (SVG spec F.6.5) so their true radius and sweep are
// available rather than the `rx`/`ry` that happen to be typed in the file.

/** Endpoint -> centre parameterization of an SVG elliptical arc (spec F.6.5). */
export function arcParams(x1, y1, rx, ry, rotDeg, fA, fS, x2, y2) {
  if (!rx || !ry) return null;                    // degenerate: it is a line
  const given = [Math.abs(rx), Math.abs(ry)];
  rx = given[0]; ry = given[1];
  const phi = (rotDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;

  // The radii are scaled up when they are too small to span the two endpoints.
  // This is why a literal cannot be trusted: `A5 5 … 20 0` draws r10, not r5.
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  let scaled = false;
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; scaled = true; }

  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (fA !== fS ? 1 : -1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

  const ang = (ux, uy, vx, vy) => {
    const dot = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const t = Math.acos(Math.min(1, Math.max(-1, dot)));
    return ux * vy - uy * vx < 0 ? -t : t;
  };
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  const theta1 = ang(1, 0, ux, uy);
  let dtheta = ang(ux, uy, vx, vy);
  if (!fS && dtheta > 0) dtheta -= 2 * Math.PI;
  if (fS && dtheta < 0) dtheta += 2 * Math.PI;

  return { cx, cy, rx, ry, phi, theta1, dtheta, scaled, given,
           circular: Math.abs(rx - ry) < 1e-9, sweepDeg: Math.abs(dtheta) * DEG };
}

/** A point on a parameterized arc, t in [0, 1] along its sweep. */
export function arcPoint(p, t) {
  const th = p.theta1 + p.dtheta * t;
  const px = Math.cos(th) * p.rx, py = Math.sin(th) * p.ry;
  const cos = Math.cos(p.phi), sin = Math.sin(p.phi);
  return [cos * px - sin * py + p.cx, sin * px + cos * py + p.cy];
}

const bez = (pts, t) => {
  let p = pts.map((q) => q.slice());
  while (p.length > 1) {
    const next = [];
    for (let i = 0; i + 1 < p.length; i++)
      next.push([p[i][0] + (p[i + 1][0] - p[i][0]) * t, p[i][1] + (p[i + 1][1] - p[i][1]) * t]);
    p = next;
  }
  return p[0];
};

/** A point on any piece, t in [0, 1]. */
export function pointOn(piece, t) {
  if (piece.type === 'line')
    return [piece.from[0] + (piece.to[0] - piece.from[0]) * t,
            piece.from[1] + (piece.to[1] - piece.from[1]) * t];
  if (piece.type === 'arc') return arcPoint(piece.arc, t);
  return bez([piece.from, ...piece.ctrl, piece.to], t);
}

/** `n` points along a piece, endpoints included. */
export const samplesOf = (piece, n = 48) =>
  Array.from({ length: n + 1 }, (_, i) => pointOn(piece, i / n));

/** Unit tangent of a piece, pointing along the drawing direction, at its start
 *  (`end` = 0) or its end (`end` = 1). A finite difference, so it works the same
 *  for a line, an arc and a Bezier without three special cases. */
export function tangentOf(piece, end) {
  const h = 1e-5;
  const [a, b] = end ? [pointOn(piece, 1 - h), pointOn(piece, 1)]
                     : [pointOn(piece, 0), pointOn(piece, h)];
  const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy);
  return m < EPS ? [0, 0] : [dx / m, dy / m];
}

/**
 * Decompose `d` into drawn pieces and subpaths.
 *
 * Returns `{ pieces, subs }`.
 *   piece  { sub, type: 'line'|'arc'|'cubic'|'quad', from, to, closing,
 *            arc?, ctrl?, literal? }
 *   sub    { index, start, closed, pieces: [indices] }
 *
 * Zero-length pieces are dropped (a `Z` that returns to a point the path is
 * already on is not a drawn segment, and every closed shape in this set ends
 * that way). Relative commands, repeated argument groups, and the smooth
 * forms `S`/`T` are all handled, so the decomposition is a general SVG one —
 * not one that only works on the files we happen to ship.
 */
export function piecesOf(d) {
  const pieces = [], subs = [];
  let cx = 0, cy = 0, sx = 0, sy = 0, sub = -1;
  let prevCtrl = null, prevKind = null;        // for S / T reflection

  const push = (p) => { pieces.push({ sub, ...p }); if (sub >= 0) subs[sub].pieces.push(pieces.length - 1); };
  const line = (x1, y1, x2, y2, closing = false) => {
    if (Math.hypot(x2 - x1, y2 - y1) < EPS) return;
    push({ type: 'line', from: [x1, y1], to: [x2, y2], closing });
  };

  for (const { cmd, args } of parsePath(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();

    if (up === 'Z') {
      line(cx, cy, sx, sy, true);
      if (sub >= 0) subs[sub].closed = true;
      cx = sx; cy = sy; prevCtrl = null; prevKind = null;
      continue;
    }
    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[up];
    if (!step) continue;

    for (let k = 0; k + step <= args.length; k += step) {
      const a = args.slice(k, k + step);
      if (up === 'M') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : [a[0], a[1]];
        if (k === 0) { sub = subs.length; subs.push({ index: sub, start: [x, y], closed: false, pieces: [] }); sx = x; sy = y; }
        else line(cx, cy, x, y);           // a second pair after M is an implicit L
        cx = x; cy = y; prevCtrl = null; prevKind = null;
      } else if (up === 'L') {
        const [x, y] = rel ? [cx + a[0], cy + a[1]] : [a[0], a[1]];
        line(cx, cy, x, y); cx = x; cy = y; prevCtrl = null; prevKind = null;
      } else if (up === 'H') {
        const x = rel ? cx + a[0] : a[0];
        line(cx, cy, x, cy); cx = x; prevCtrl = null; prevKind = null;
      } else if (up === 'V') {
        const y = rel ? cy + a[0] : a[0];
        line(cx, cy, cx, y); cy = y; prevCtrl = null; prevKind = null;
      } else if (up === 'C' || up === 'S' || up === 'Q' || up === 'T') {
        const abs = (i) => (rel ? [cx + a[i], cy + a[i + 1]] : [a[i], a[i + 1]]);
        let ctrl, to, type;
        if (up === 'C') { ctrl = [abs(0), abs(2)]; to = abs(4); type = 'cubic'; }
        else if (up === 'S') {
          const r = prevKind === 'cubic' ? [2 * cx - prevCtrl[0], 2 * cy - prevCtrl[1]] : [cx, cy];
          ctrl = [r, abs(0)]; to = abs(2); type = 'cubic';
        } else if (up === 'Q') { ctrl = [abs(0)]; to = abs(2); type = 'quad'; }
        else {
          const r = prevKind === 'quad' ? [2 * cx - prevCtrl[0], 2 * cy - prevCtrl[1]] : [cx, cy];
          ctrl = [r]; to = abs(0); type = 'quad';
        }
        push({ type, from: [cx, cy], to, ctrl, closing: false });
        prevCtrl = ctrl[ctrl.length - 1]; prevKind = type;
        cx = to[0]; cy = to[1];
      } else if (up === 'A') {
        const [rx, ry, rot, fa, fs] = a;
        const [x, y] = rel ? [cx + a[5], cy + a[6]] : [a[5], a[6]];
        const arc = arcParams(cx, cy, rx, ry, rot, fa, fs, x, y);
        if (arc) push({ type: 'arc', from: [cx, cy], to: [x, y], arc, literal: [Math.abs(rx), Math.abs(ry)], closing: false });
        else line(cx, cy, x, y);
        cx = x; cy = y; prevCtrl = null; prevKind = null;
      }
    }
  }
  return { pieces, subs };
}

// ── angles ─────────────────────────────────────────────────────────────────

const LEGAL = [0, 45, 90];

/** The orientation readings for one run and rise. See the header for conventions. */
export function angleOf(dx, dy) {
  let angle = Math.atan2(-dy, dx) * DEG;        // y flipped: a designer's reading
  angle = ((angle % 180) + 180) % 180;          // undirected line, [0, 180)
  const fromHorizontal = Math.min(angle, 180 - angle);
  let nearest = LEGAL[0];
  for (const c of LEGAL) if (Math.abs(c - fromHorizontal) < Math.abs(nearest - fromHorizontal)) nearest = c;
  return { angle, fromHorizontal, fromVertical: 90 - fromHorizontal,
           nearest, dev: Math.abs(fromHorizontal - nearest) };
}

/**
 * Every straight segment in one `d`, with its angle.
 *
 * `{ from, to, angle, length }` as specified, plus `dx`/`dy` (the run and rise
 * C30 says a file should declare instead of a degree figure), the two acute
 * readings, the nearest legal angle, the deviation, and `offset` — what that
 * deviation displaces over the segment's own length.
 */
export function segmentsOf(d, { minLength = 1e-6 } = {}) {
  const { pieces } = piecesOf(d);
  const out = [];
  for (const p of pieces) {
    if (p.type !== 'line') continue;
    const dx = p.to[0] - p.from[0], dy = p.to[1] - p.from[1];
    const length = Math.hypot(dx, dy);
    if (length < minLength) continue;
    const a = angleOf(dx, dy);
    out.push({ from: p.from, to: p.to, dx, dy, length, ...a,
               offset: length * Math.sin((a.dev * Math.PI) / 180),
               sub: p.sub, closing: p.closing });
  }
  return out;
}

// ── reading icon files ─────────────────────────────────────────────────────
// Shared by both instruments. A drawing is `src/icons/<master>/<name>.svg`:
// stroked centrelines, plus — in a `-filled` file — area paths that carry the
// icon's OUTER contour. The area paths are the ones `tools/lint.mjs` cannot
// measure a corner on at all, so they are kept and labelled, never skipped.

const PATH = /<path\b([^>]*)\/>/g;
const D_ATTR = /\bd="([^"]+)"/;

/** Build an icon record from SVG source, without touching the filesystem. */
export function iconFromSource(src, { file = 'unknown.svg', master = null, path = null } = {}) {
  const vb = src.match(/viewBox="0 0 (\d+(?:\.\d+)?) /);
  const canvas = master ?? (vb ? Number(vb[1]) : null);
  if (!canvas) throw new Error(`${file}: no viewBox and no master given`);
  const name = basename(file).replace(/\.svg$/, '');

  const paths = [];
  for (const m of src.matchAll(PATH)) {
    const attrs = m[1];
    const d = attrs.match(D_ATTR)?.[1];
    if (!d) continue;
    // An AREA path paints a shape and draws no line: lint's own test, written
    // attribute-order-independently so a reformatted file still reads right.
    const area = /stroke="none"/.test(attrs) && /fill="currentColor"/.test(attrs);
    paths.push({ index: paths.length, d, style: area ? 'area' : 'stroke' });
  }
  const hasAreas = paths.some((p) => p.style === 'area');
  // lint.mjs:207-210: a shape-filled file paints its areas and keeps the
  // master's OUTLINE weight for whatever lines are left, so the presence of
  // areas decides the weight, not the file name.
  const stroke = hasAreas ? strokeOf(canvas) : weightOf(name, canvas);
  return { path, file: basename(file), name, master: canvas, filled: /-filled$/.test(name),
           paths, hasAreas, stroke, halfStroke: stroke / 2,
           // What to subtract from an AREA contour radius to get back to the
           // centreline radius the outline twin was drawn at: half the OUTLINE
           // weight at this master (C23's "outer 3.25" is 2.5 + 1.5/2).
           outlineHalf: strokeOf(canvas) / 2, src };
}

/** Read one drawing off disk. */
export function readIcon(p) {
  return iconFromSource(readFileSync(p, 'utf8'), { file: basename(p), path: p });
}

const toIcon = (x) => (typeof x === 'string' ? readIcon(x) : x);

/** Every shipped drawing, newest-master-first order irrelevant. */
export function listIcons(root = 'src/icons', { masters = [24, 20, 16], filled = null } = {}) {
  const out = [];
  for (const m of masters) {
    let names;
    try { names = readdirSync(join(root, String(m))); } catch { continue; }
    for (const f of names.sort()) {
      if (!f.endsWith('.svg')) continue;
      const isFilled = /-filled\.svg$/.test(f);
      if (filled === true && !isFilled) continue;
      if (filled === false && isFilled) continue;
      out.push(join(root, String(m), f));
    }
  }
  return out;
}

// ── per-file and set-wide ──────────────────────────────────────────────────

/**
 * Every straight segment in one drawing, with its deviation from 0/45/90.
 *
 * `tolerance` is in degrees and is deliberately a parameter, not a constant:
 * coordinates are quantised to the master's grid (a quarter at 24 and 20, an
 * eighth at 16), so an INTENDED 45° does not always land on 45.000 — the
 * classic chevron measures 44.95° at 24. Anything at or under `tolerance` is
 * read as "on the grid's 45"; anything above it is a real deviation and lands
 * in `off`.
 */
export function anglesOf(file, { tolerance = 0.5, minLength = 0.1 } = {}) {
  const icon = toIcon(file);
  const segments = [];
  for (const p of icon.paths)
    for (const s of segmentsOf(p.d, { minLength }))
      segments.push({ ...s, path: p.index, style: p.style,
                      file: icon.file, name: icon.name, master: icon.master });
  const off = segments.filter((s) => s.dev > tolerance).sort((a, b) => b.dev - a.dev);
  return { file: icon.file, name: icon.name, master: icon.master, tolerance,
           segments, off,
           worst: off[0] ?? null,
           byNearest: tally(segments.map((s) => s.nearest)) };
}

const tally = (xs) => xs.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
const r = (n, k = 3) => Math.round(n * 10 ** k) / 10 ** k;

/**
 * The distribution of straight-segment angles across many drawings, and the
 * list of every deviation beyond tolerance, worst first. That list is the
 * finding; the distribution says how unusual each entry is.
 */
export function census(files, { tolerance = 0.5, minLength = 0.1, buckets = [0.01, 0.1, 0.5, 1, 2, 5, 10, 15, 22.5] } = {}) {
  const per = files.map((f) => anglesOf(f, { tolerance, minLength }));
  const all = per.flatMap((p) => p.segments);
  const off = all.filter((s) => s.dev > tolerance).sort((a, b) => b.dev - a.dev);

  const hist = {};
  for (const b of buckets) hist[`<=${b}`] = 0;
  hist[`>${buckets.at(-1)}`] = 0;
  for (const s of all) {
    const b = buckets.find((x) => s.dev <= x);
    hist[b === undefined ? `>${buckets.at(-1)}` : `<=${b}`]++;
  }

  const byConcept = {};
  for (const s of off) {
    const concept = s.name.replace(/-filled$/, '');
    (byConcept[concept] ??= []).push(s);
  }
  const byAngle = {};
  for (const s of off) {
    const k = String(r(s.fromHorizontal, 2));
    (byAngle[k] ??= { fromHorizontal: r(s.fromHorizontal, 3), count: 0, files: new Set() });
    byAngle[k].count++; byAngle[k].files.add(s.file);
  }

  return {
    files: files.length, drawings: per.length, segments: all.length, tolerance,
    byNearest: tally(all.map((s) => s.nearest)),
    byMaster: Object.fromEntries([24, 20, 16].map((m) => {
      const seg = all.filter((s) => s.master === m);
      return [m, { segments: seg.length, off: seg.filter((s) => s.dev > tolerance).length }];
    })),
    byStyle: Object.fromEntries(['stroke', 'area'].map((st) => {
      const seg = all.filter((s) => s.style === st);
      return [st, { segments: seg.length, off: seg.filter((s) => s.dev > tolerance).length }];
    })),
    devHistogram: hist,
    off,
    offConcepts: Object.keys(byConcept).sort(),
    byConcept,
    byAngle: Object.fromEntries(Object.entries(byAngle)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([k, v]) => [k, { ...v, files: [...v.files].sort() }])),
    per,
  };
}

// ── CLI (reporting only; writes nothing) ───────────────────────────────────

// `pathToFileURL`, not a template: this repo's path contains a space, which
// `import.meta.url` percent-encodes and a hand-built `file://` string does not.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const tol = Number(args.find((a) => a.startsWith('--tol='))?.slice(6) ?? 0.5);
  const minLength = Number(args.find((a) => a.startsWith('--min='))?.slice(6) ?? 0.1);
  const top = Number(args.find((a) => a.startsWith('--top='))?.slice(6) ?? 40);
  const files = args.filter((a) => !a.startsWith('--'));
  const list = files.length ? files : listIcons();
  const c = census(list, { tolerance: tol, minLength });
  if (args.includes('--json')) { console.log(JSON.stringify(c, null, 2)); }
  else {
    console.log(`${c.drawings} drawings · ${c.segments} straight segments · tolerance ${tol}° · min length ${minLength}`);
    console.log(`nearest legal angle: ${Object.entries(c.byNearest).map(([k, v]) => `${k}° ${v}`).join(' · ')}`);
    console.log(`deviation: ${Object.entries(c.devHistogram).map(([k, v]) => `${k}° ${v}`).join(' · ')}`);
    console.log(`\n${c.off.length} segments beyond ${tol}°, in ${c.offConcepts.length} concepts. Worst ${Math.min(top, c.off.length)}:`);
    console.log('  dev°   angle°  fromVert°  len   offset  file  (path, run × rise)');
    for (const s of c.off.slice(0, top))
      console.log(`  ${r(s.dev, 2).toString().padStart(5)}  ${r(s.fromHorizontal, 2).toString().padStart(6)}  ${r(s.fromVertical, 2).toString().padStart(8)}  ${r(s.length, 2).toString().padStart(5)}  ${r(s.offset, 2).toString().padStart(5)}  ${s.master}/${s.file} p${s.path} ${r(Math.abs(s.dx), 3)} × ${r(Math.abs(s.dy), 3)}`);
    console.log(`\nby angle, commonest first:`);
    for (const [k, v] of Object.entries(c.byAngle).slice(0, 20))
      console.log(`  ${k.padStart(7)}°  ×${String(v.count).padStart(4)}  ${v.files.slice(0, 6).join(' ')}${v.files.length > 6 ? ` +${v.files.length - 6}` : ''}`);
  }
}
