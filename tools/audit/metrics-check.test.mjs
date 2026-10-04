// Tests for tools/audit/metrics-check.mjs (card 1.12, F12 honest metrics).
//
// Two kinds of case. Closed forms that can be checked on paper — a capped line, a
// quarter arc, a semicircle's apex, an ellipse's extents, a cubic's extreme —
// because a verifier that is plausibly wrong is worse than none (docs/08 §10.4).
// And the set's own drawings, inlined from the pinned tree 5933041 so the numbers
// docs/audit/findings-metrics.md rests on are pinned here too. Where a number has
// no closed form it is pinned to an independent source, named in the test.

import test from 'node:test';
import assert from 'node:assert/strict';
import { opticalBearings } from '../optical.mjs';
import {
  readSvg, parseD, arcSegment, segBox, centrelineBox, inkBoxOf, sideProfiles, strokeSlice, modelRecession,
  opticalOf, stability, mirrorCheck, shellOf, isDotPath, dotGapOf, filledContainerOf, checkOne, summarize,
  styleOf, geometryKey, SIDES,
} from './metrics-check.mjs';

const svg = (canvas, stroke, body, notes = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${notes}${body}</svg>`;
const near = (got, want, tol, what) =>
  assert.ok(Math.abs(got - want) <= tol, `${what}: got ${got}, want ${want} +/- ${tol}`);
const AREA = 'fill="currentColor" fill-rule="evenodd" stroke="none"';
/** A published entry with every side as given — what build.mjs would have written. */
const pubOf = (icon, { optical = null, recession = 0, container = null, ratio = null, gap = null, shift = [0, 0] } = {}) => {
  const b = inkBoxOf(icon), c = icon.canvas, r = (n) => Math.round(n * 100) / 100;
  const bearing = { left: r(b.x0), top: r(b.y0), right: r(c - b.x1), bottom: r(c - b.y1) };
  return { ink: { x: r(b.x0), y: r(b.y0), w: r(b.x1 - b.x0), h: r(b.y1 - b.y0) }, shift, bearing, container, ratio, gap,
    optical: Object.fromEntries(SIDES.map((s) => [s, { geometric: bearing[s], recession, optical: optical ?? bearing[s] }])) };
};

// ── the path grammar ───────────────────────────────────────────────────────

test('parser: relative commands, implicit lineto after M, packed arc flags', () => {
  const { subpaths } = parseD('m2 3 4 0v2h-1l-1 1z');
  assert.equal(subpaths.length, 1);
  const segs = subpaths[0].segs;
  assert.deepEqual(segs[0].b, [6, 3]);                 // implicit lineto after m is relative
  assert.deepEqual(segs[1].b, [6, 5]);
  assert.deepEqual(segs.at(-1).b, [2, 3]);             // z closes back to the start
  assert.equal(subpaths[0].closed, true);
  // flags written with no separator: A.5.5 0 1012 3 = rx .5 ry .5 rot 0 fA 1 fS 0 x 12 y 3
  const a = parseD('M11 3A.5.5 0 1012 3').subpaths[0].segs[0];
  assert.equal(a.k, 'A');
  near(a.rx, 0.5, 1e-12, 'rx'); near(Math.abs(a.dt), Math.PI, 1e-9, 'a semicircle sweep');
});

test('parser: a command after Z starts a new subpath at the closed one\'s start', () => {
  const { subpaths } = parseD('M1 1H5V5ZL3 9');
  assert.equal(subpaths.length, 2);
  assert.deepEqual(subpaths[1].segs[0].a, [1, 1]);
  assert.deepEqual(subpaths[1].segs[0].b, [3, 9]);
});

test('arcs: SVG F.6.2 — identical endpoints are omitted, zero radius is a line, short radius scales', () => {
  assert.equal(arcSegment(3.75, 19.5, 7, 7, 0, 0, 1, 3.75, 19.5), null);      // paintbrush-4's arc
  assert.equal(arcSegment(0, 0, 0, 5, 0, 0, 1, 4, 0).k, 'L');
  const s = arcSegment(0, 0, 1, 1, 0, 0, 1, 4, 0);                           // r 1 cannot span 4
  near(s.rx, 2, 1e-12, 'radius scaled up to half the chord');
});

// ── exact boxes ────────────────────────────────────────────────────────────

test('box: a semicircle bulges past its endpoints; a quarter arc does not', () => {
  const b = segBox(parseD('M2 12A10 10 0 0 1 22 12').subpaths[0].segs[0]);   // over the top
  near(b.y0, 2, 1e-12, 'apex'); near(b.y1, 12, 1e-12, 'chord');
  const quarter = segBox(parseD('M2 12A10 10 0 0 1 12 2').subpaths[0].segs[0]);
  assert.deepEqual([quarter.x0, quarter.y0, quarter.x1, quarter.y1], [2, 2, 12, 12]);
});

test('box: an elliptical arc reaches its own semi-axes (globe\'s meridian half)', () => {
  // centre (12,12), rx 3.75, ry 9.25, the left half: x from 8.25 to 12, y from 2.75 to 21.25
  const b = centrelineBox(parseD('M12 2.75A3.75 9.25 0 1 0 12 21.25'));
  near(b.x0, 8.25, 1e-12, 'left extreme'); near(b.x1, 12, 1e-12, 'ends');
  near(b.y0, 2.75, 1e-12, 'top'); near(b.y1, 21.25, 1e-12, 'bottom');
});

test('box: a cubic\'s extreme comes from its derivative, not its control points', () => {
  // (0,0) (0,4) (4,4) (4,0): y peaks at t = 0.5 with y = 3, while the hull reaches 4
  const b = centrelineBox(parseD('M0 0C0 4 4 4 4 0'));
  near(b.y1, 3, 1e-12, 'true apex'); near(b.x1, 4, 1e-12, 'end');
});

test('ink box: round caps reach half a stroke past the endpoint (CLAUDE.md rule 1)', () => {
  const b = inkBoxOf(readSvg(svg(24, 1.5, '<path d="M3.75 12h16.5"/>')));
  assert.deepEqual([b.x0, b.y0, b.x1, b.y1], [3, 11.25, 21, 12.75]);
  const c = inkBoxOf(readSvg(svg(16, 1.25, '<path d="M1.625 8h12.75"/>')));
  assert.deepEqual([c.x0, c.x1], [1, 15]);
});

test('paint is read from attributes in any order: fill after d is still an area', () => {
  const icon = readSvg(svg(24, 1.5, '<path d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z" stroke="none" fill="currentColor"/>'));
  assert.equal(icon.areas.length, 1); assert.equal(icon.strokes.length, 0);
  const b = inkBoxOf(icon);
  assert.deepEqual([b.x0, b.x1], [2, 22]);                  // an area is its own box, not grown
});

// ── the exact edge ─────────────────────────────────────────────────────────

test('edge: a straight stroke\'s slice is its two offset lines and its round caps', () => {
  const seg = parseD('M4 4L20 20').subpaths[0].segs[0], r = 0.75;
  // at y = 12 the centreline is at x = 12; the offset lines sit r·√2 either side
  const e = strokeSlice(seg, r, 12, true);
  near(e[0], 12 - r * Math.SQRT2, 1e-12, 'left offset line'); near(e[1], 12 + r * Math.SQRT2, 1e-12, 'right offset line');
  // at y = 3.5, inside the start cap only: the disc at (4,4) of radius 0.75
  const c = strokeSlice(seg, r, 3.5, true);
  near(c[0], 4 - Math.sqrt(r * r - 0.25), 1e-12, 'cap, left');
});

test('edge: an elliptical arc\'s swept edge matches a brute-force union of discs', () => {
  const seg = parseD('M12 2.75A3.75 9.25 0 1 0 12 21.25').subpaths[0].segs[0], r = 0.75;
  for (const y of [3, 6.5, 12, 17.25, 21.5]) {
    let lo = Infinity;
    for (let i = 0; i <= 200000; i++) {
      const t = seg.t0 + (seg.dt * i) / 200000, px = seg.cx + seg.rx * Math.cos(t), py = seg.cy + seg.ry * Math.sin(t);
      const d = Math.abs(py - y); if (d <= r) lo = Math.min(lo, px - Math.sqrt(r * r - d * d));
    }
    near(strokeSlice(seg, r, y, true)[0], lo, 2e-6, `left edge at y = ${y}`);
  }
});

// ── the optical model ──────────────────────────────────────────────────────

test('modelRecession restates optical.mjs:46-68 — a hand-worked profile', () => {
  // left side, far = 0. Run: 0.5 (+0.5), 1 (+1), then a step of 2 > 1.5 ends it. 1.5 / 4.
  near(modelRecession([0, 0.5, 1, 3], 0, 1.5), 0.375, 1e-12, 'mean over every inked scanline');
  // a step of exactly one stroke continues (the spec says "larger than"); 2.25 caps at 1.5
  near(modelRecession([0, 1.5, 2.25], 0, 1.5), 1, 1e-12, 'tie continues');
  near(modelRecession([0, 1.5, 2.25], 0, 1.5, { tie: 'break' }), 0, 1e-12, 'tie broken');
  // the run can be started elsewhere: from index 3 (value 3) the step to 1 breaks it at once
  near(modelRecession([0, 0.5, 1, 3], 0, 1.5, { start: 3 }), 0, 1e-12, 'start elsewhere');
});

const PLUS_CIRCLE = svg(24, 1.5, '<path d="M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z"/><path d="M12 7.5v9"/><path d="M7.5 12h9"/>');
const PLUS_CIRCLE_FILLED = svg(24, 1.5, `<path ${AREA} d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12ZM11 11L11 7.5A1 1 0 0 1 13 7.5L13 11L16.5 11A1 1 0 0 1 16.5 13L13 13L13 16.5A1 1 0 0 1 11 16.5L11 13L7.5 13A1 1 0 0 1 7.5 11Z"/>`);

test('reproduces docs/09:43: plus-circle optical.left 2.71 — and the filled twin is the same edge', () => {
  const o = opticalOf(readSvg(PLUS_CIRCLE)), f = opticalOf(readSvg(PLUS_CIRCLE_FILLED));
  near(o.left.optical, 2.71, 0.0101, 'outline, as published');
  near(f.left.optical, o.left.optical, 1e-9, 'filled twin under the same model');   // the build publishes 2.00
  const po = sideProfiles(readSvg(PLUS_CIRCLE)).left, pf = sideProfiles(readSvg(PLUS_CIRCLE_FILLED)).left;
  assert.equal(po.length, pf.length);
  po.forEach((v, i) => near(pf[i], v, 1e-9, `scanline ${i}`));
});

test('checkOne: the shape-filled twin\'s published recession 0 is 0.70 short; ink and bearing exact', () => {
  const icon = readSvg(PLUS_CIRCLE_FILLED);
  const r = checkOne(icon, pubOf(icon));
  assert.equal(r.diff.ink, 0); assert.equal(r.diff.bearing, 0); assert.equal(r.diff.twoGeometrics, 0);
  near(r.diff.optical.left.optical, -0.70, 0.01, 'published minus exact');
});

const HASH_2 = svg(24, 1.5, '<path d="M10 5.25L7.75 18.75"/><path d="M16.25 5.25L14 18.75"/><path d="M5.25 9H18.75"/><path d="M5.25 15H18.75"/>');
const MENU_ARROW_LEFT = svg(24, 1.5, '<path d="M7.5 9.44L5.47 11.47A0.75 0.75 0 0 0 5.47 12.53L7.5 14.56"/><path d="M10.75 7.5h8"/><path d="M10.75 12h8"/><path d="M10.75 16.5h8"/>');
const COMPOSE_4_16 = svg(16, 1.25, '<path d="M7.375 2.625L4.125 2.625A1.5 1.5 0 0 0 2.625 4.125L2.625 11.875A1.5 1.5 0 0 0 4.125 13.375L11.875 13.375A1.5 1.5 0 0 0 13.375 11.875L13.375 8.625"/><path d="M6.75 9.875A0.625 0.625 0 0 1 6.125 9.25L6.125 7.875L10.961 3.039A1.414 1.414 0 0 1 12.961 3.039A1.414 1.414 0 0 1 12.961 5.039L8.125 9.875Z"/><path d="M9.928 4.072L11.928 6.072"/>');

test('stability, tie branch: hash-2\'s slant steps exactly one stroke per scanline; its top flips by 0.35', () => {
  const icon = readSvg(HASH_2), st = stability(icon);
  near(opticalOf(icon).top.optical, 4.874, 0.001, 'ties continue (the published 4.87)');
  near(st.top.byTie, 0.35, 0.005, 'reading the tie the other way');
  assert.ok(st.top.hi - st.top.lo > 0.34, `range ${st.top.lo}..${st.top.hi}`);
  assert.ok(st.left.hi - st.left.lo < 0.02, `left range ${st.left.lo}..${st.left.hi}`);
});

test('stability, slide branch: menu-arrow-left\'s top moves 0.32 when the grid slides 0.002', () => {
  const st = stability(readSvg(MENU_ARROW_LEFT));
  near(st.top.bySlide, 0.319, 0.002, 'slide alone'); near(st.top.byTie, 0, 1e-6, 'tie'); near(st.top.byStart, 0, 1e-6, 'start');
});

test('stability, start branch: compose-4 at 16 has two outermost edges 0.0012 apart', () => {
  const st = stability(readSvg(COMPOSE_4_16));
  near(st.right.byStart, 0.199, 0.002, 'run started at the other extreme');
  assert.ok(st.right.bySlide < 0.01 && st.right.byTie < 1e-9, 'and nothing else moves it');
});

test('mirror: menu-arrow-left read on its mirror\'s grid gives a top 0.31 lower; plus-circle none', () => {
  const m = mirrorCheck(readSvg(MENU_ARROW_LEFT));
  near(m.top.total, -0.308, 0.002, 'top-side reading of the left–right mirror');
  near(m.left.total, 0, 1e-9, 'a left–right mirror leaves left and right alone');
  const p = mirrorCheck(readSvg(PLUS_CIRCLE));
  for (const s of SIDES) near(p[s].total, 0, 1e-9, s);
});

test('mirror pairs: geometryKey finds a reflected drawing and refuses a heavier twin', () => {
  const a = readSvg(svg(24, 1.5, '<path d="M15 6l-6 6 6 6"/>')), b = readSvg(svg(24, 1.5, '<path d="M9 6l6 6-6 6"/>'));
  assert.equal(geometryKey(a, 'lr'), geometryKey(b));
  const heavy = readSvg(svg(24, 2.5, '<path d="M9 6l6 6-6 6"/>'));
  assert.notEqual(geometryKey(a, 'lr'), geometryKey(heavy));
});

test('paintbrush-4: the omitted zero-length arc leaves a finite optical bearing (published null)', () => {
  const body = (arc) => `<path d="M4.83 20.17A0.75 0.75 0 0 1 4.5 20.25A0.75 0.75 0 0 1 3.75 19.5${arc}A7 7 0 0 1 5.45 14.93A2.75 2.75 0 0 1 7.53 13.97A2.75 2.75 0 0 1 8.3 14.08A0.75 0.75 0 0 0 8.51 14.11A0.75 0.75 0 0 0 9.04 13.89L10.97 11.97L12.03 13.03L10.23 14.83A0.75 0.75 0 0 0 10.01 15.36A0.75 0.75 0 0 0 10.07 15.66A2.75 2.75 0 0 1 10.28 16.72A2.75 2.75 0 0 1 7.63 19.47A7 7 0 0 0 4.83 20.17Z"/><path d="M11.5 12.5L20.25 3.75"/>`;
  const icon = readSvg(svg(24, 1.5, body('A7 7 0 0 1 3.75 19.5')));
  assert.equal(icon.strokes[0].omitted, 1);
  const o = opticalOf(icon);
  near(o.left.geometric, 3, 1e-9, 'geometric');
  // Independent source: the build's own optical.mjs, on the same drawing with the
  // zero-length arc taken out — which SVG F.6.2 says changes nothing. It reads 3.23.
  const ds = [...svg(24, 1.5, body('')).matchAll(/\bd="([^"]+)"/g)].map((m) => m[1]);
  const build = opticalBearings(ds, 1.5, 24);
  for (const s of SIDES) near(o[s].optical, build[s].optical, 0.006, `${s} against the build's model`);
});

// ── anatomy ────────────────────────────────────────────────────────────────

test('container: plus-circle\'s ring encloses its mark; bare x\'s "shell" is an open diagonal', () => {
  const pc = shellOf(readSvg(PLUS_CIRCLE));
  assert.equal(pc.closed, true); assert.equal(pc.encloses, true); near(pc.container, 20, 1e-9, 'ring diameter');
  near(pc.mark.w / pc.container, 0.525, 1e-9, 'ratio as published (0.53)');
  const x = shellOf(readSvg(svg(24, 1.5, '<path d="M6.25 6.25l11.5 11.5"/><path d="M17.75 6.25l-11.5 11.5"/>')));
  assert.equal(x.shell, 0); assert.equal(x.closed, false); assert.equal(x.encloses, false);
  near(x.container, 13, 1e-9, 'what the build publishes as a container');
});

test('container: pin-4\'s head is closed, but its needle runs outside it', () => {
  const pin4 = shellOf(readSvg(svg(24, 1.5, '<path d="M20.04 9.96L19.21 10.79A1 1 0 0 1 17.79 10.79L17.25 10.25L15.71 11.79A5 5 0 0 0 14.25 15.32L14.25 18.84A1 1 0 0 1 13.96 19.54L13.71 19.79A1 1 0 0 1 12.29 19.79L4.21 11.71A1 1 0 0 1 4.21 10.29L4.46 10.04A1 1 0 0 1 5.16 9.75L8.68 9.75A5 5 0 0 0 12.21 8.29L13.75 6.75L13.21 6.21A1 1 0 0 1 13.21 4.79L14.04 3.96A1 1 0 0 1 15.46 3.96L20.04 8.54A1 1 0 0 1 20.04 9.96Z"/><path d="M8.25 15.75L4.75 19.25"/>')));
  assert.equal(pin4.shell, 0); assert.equal(pin4.closed, true); assert.equal(pin4.encloses, false);
  assert.ok(pin4.outside > 0 && pin4.inside > 0, 'the needle starts inside and leaves');
});

test('container: the filled disc encloses its knocked-out plus; a lone shape is alone', () => {
  const f = filledContainerOf(readSvg(PLUS_CIRCLE_FILLED));
  near(f.container, 20, 1e-9, 'disc'); assert.equal(f.encloses.ring, true); assert.equal(f.alone, undefined);
  const lone = filledContainerOf(readSvg(svg(24, 1.5, `<path ${AREA} d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z"/>`)));
  assert.equal(lone.alone, true); assert.equal(lone.mark, null);
});

test('dot: a two-arc circle is a dot; globe\'s two-arc meridian ellipse and a ring are not', () => {
  const dot = readSvg(svg(24, 1.5, '<path d="M11.5 7.5A0.5 0.5 0 1 0 12.5 7.5A0.5 0.5 0 1 0 11.5 7.5Z"/>')).strokes[0];
  const meridian = readSvg(svg(24, 1.5, '<path d="M12 2.75A3.75 9.25 0 1 0 12 21.25A3.75 9.25 0 1 0 12 2.75Z"/>')).strokes[0];
  const ring = readSvg(PLUS_CIRCLE).strokes[0];
  assert.equal(isDotPath(dot), true); assert.equal(isDotPath(meridian), false); assert.equal(isDotPath(ring), false);
  assert.equal(meridian.syntaxDot, true);                    // ...which geometry.mjs:151 calls a dot
});

test('gap: info at 24 — dot 2.5 floating 1 above the stem, as published', () => {
  const icon = readSvg(svg(24, 1.5, '<path d="M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z"/><path d="M11.5 7.5A0.5 0.5 0 1 0 12.5 7.5A0.5 0.5 0 1 0 11.5 7.5Z"/><path d="M12 10.5V17"/>'));
  const g = dotGapOf(icon, shellOf(icon).shell);
  near(g.size, 1, 1e-6, 'void'); near(g.part, 2.5, 1e-9, 'dot'); near(g.ratio, 0.4, 1e-6, 'ratio'); assert.equal(g.realDot, true);
});

test('gap: globe at 16 — the build\'s "dot" is the meridian; it crosses the equator, so −1.25', () => {
  const icon = readSvg(svg(16, 1.25, '<path d="M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z"/><path d="M8 1.625A2.625 6.375 0 1 0 8 14.375A2.625 6.375 0 1 0 8 1.625Z"/><path d="M1.625 8L14.375 8"/>'));
  const g = dotGapOf(icon, shellOf(icon).shell);
  near(g.size, -1.25, 1e-9, 'centrelines cross: no gap, minus one stroke'); assert.equal(g.realDot, false);
});

// ── the counts the CLI prints ──────────────────────────────────────────────

test('shift: checkOne compares the published shift with the drawn ink centre', () => {
  const shifted = readSvg(svg(24, 1.5, '<path d="M6 9.5l6 6 6-6"/>', '<!-- optical: 0 0.5 -->'));
  const r = checkOne(shifted, pubOf(shifted, { shift: [0, 0.5] }));
  near(r.centre.dy, 0.5, 1e-9, 'the chevron is drawn 0.5 low'); near(r.diff.shift.dy, 0, 1e-9, 'and says so');
  const silent = checkOne(shifted, pubOf(shifted));                     // published [0, 0]
  near(silent.diff.shift.dy, -0.5, 1e-9, 'a [0,0] shift on a drawing 0.5 off');
});

test('summarize: style, twin lookup and thresholds, on a three-drawing set', () => {
  const row = (master, name, text, pubOpts) => { const icon = readSvg(text); return { master, name, style: styleOf(icon, name), notes: icon.notes, ...checkOne(icon, pubOf(icon, pubOpts)) }; };
  const o = row(24, 'plus-circle', PLUS_CIRCLE, { optical: 2.71, recession: 0.94, container: 20, ratio: { w: 0.53, h: 0.53 } });
  const f = row(24, 'plus-circle-filled', PLUS_CIRCLE_FILLED, {});
  const x = row(24, 'x', svg(24, 1.5, '<path d="M6.25 6.25l11.5 11.5"/><path d="M17.75 6.25l-11.5 11.5"/>'), { optical: 6.33, recession: 1.1, container: 13, ratio: { w: 1, h: 1 } });
  assert.deepEqual([o.style, f.style, x.style], ['outline', 'shape-filled', 'outline']);
  const S = summarize([o, f, x]);
  assert.equal(S.forcedZero, 1); assert.equal(S.understatedSides, 4);
  assert.equal(S.container.published, 2); assert.equal(S.container.notRing, 1);   // the x
  assert.equal(S.container.missing, 1);                                          // the filled twin of a real ring
  assert.equal(S.strokeMisread.sides, 0);                                        // 2.71 and 6.33 are within 0.01
});
