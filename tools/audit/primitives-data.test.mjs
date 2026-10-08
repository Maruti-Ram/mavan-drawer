// Tests for tools/audit/primitives-data.mjs (card 4.2). Synthetic drawings written to a temporary
// directory first — every measure, anchor and class rule is held on a case small enough to know the
// answer by hand. Then the archived pin (git archive of 5933041's src/icons into a temporary directory;
// skipped if the commit is not in this clone), where the page's headline figures must come out as the
// cards state them, and the differences from the cards must be exactly the ones the page lists.

import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { congruentUpToTranslation } from './congruence.mjs';
import { centrelineBox, parseD } from './metrics-check.mjs';
import {
  AGAINST, PANELS, bendAnchor, bendOf, build, buildPanel, circleOf, compose, digestOf, partsOf, pxAt16, readSet,
  residual, rotateAbout, transformD,
} from './primitives-data.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const TOOL = join(HERE, 'primitives-data.mjs');
const PIN = '5933041';
const W = { 24: 1.5, 20: 1.5, 16: 1.25 }, FW = { 24: 2.5, 20: 2, 16: 2 };

const close = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const boxOf = (d) => { const b = centrelineBox(parseD(d)); return [b.x0, b.y0, b.x1, b.y1].map((n) => Math.round(n * 1e4) / 1e4); };

/** One SVG: line paths at `w`, area paths filled. */
function svg(m, lines = [], areas = [], w = W[m]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`
    + lines.map((d) => `<path d="${d}"/>`).join('')
    + areas.map((d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`).join('') + '</svg>';
}
/** A pin directory: files[name] = { 24: text, 20: text, 16: text } (a missing master is left out). */
const dirs = [];
function pinOf(files) {
  const dir = mkdtempSync(join(tmpdir(), 'primitives-'));
  dirs.push(dir);
  for (const m of [24, 20, 16]) {
    mkdirSync(join(dir, 'src', 'icons', String(m)), { recursive: true });
    for (const [name, by] of Object.entries(files)) if (by[m]) writeFileSync(join(dir, 'src', 'icons', String(m), `${name}.svg`), by[m]);
  }
  return dir;
}
/** The same drawing at every master (enough for most rules here). */
const every = (fn) => ({ 24: fn(24), 20: fn(20), 16: fn(16) });
after(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

// ── geometry ──────────────────────────────────────────────────────────────────────────────────────

test('bendOf reads leg, bend radius and turn the way card 1.1 prints them', () => {
  // A right-angle V pointing down: legs at 45°, bend R 0.75 (an arrowhead at 24).
  const v = bendOf('M6 9L11.47 14.47A0.75 0.75 0 0 0 12.53 14.47L18 9');
  assert.ok(close(v.R, 0.75));
  assert.ok(close(v.turn, 90, 1e-3), `turn ${v.turn}`);
  assert.ok(close(v.leg, Math.hypot(5.47, 5.47), 1e-9));
  assert.ok(v.dir[1] > 0 && Math.abs(v.dir[0]) < 1e-9, 'it points down');
  assert.ok(close(v.apex[0], 12, 1e-9), 'the apex is the arc\'s midpoint');
  // A sharp bracket reads as its acute angle, as the card's 41.3° does; a U reads 0 and is no bend.
  const bracket = bendOf('M8 20L11.6 7.3A0.75 0.75 0 0 1 12.4 7.3L16 20');
  assert.ok(bracket.turn > 10 && bracket.turn < 45, `bracket ${bracket.turn}`);
  assert.ok(bendOf('M8 20L8 10A4 4 0 0 1 16 10L16 20').turn < 1e-6, 'two parallel legs');
  assert.equal(bendOf('M3 12h18'), null);
  const lop = bendOf('M6 9L11.47 14.47A0.75 0.75 0 0 0 12.53 14.47L14.53 12.47');
  assert.ok(close(lop.leg, (Math.hypot(5.47, 5.47) + Math.hypot(2, 2)) / 2, 1e-9), 'leg is the mean of two unequal legs');
  assert.equal(bendOf('M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z'), null);
});

test('circleOf keeps a full circle however it is cut and walked, and refuses a lens', () => {
  for (const d of ['M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z', 'M12 2.75A9.25 9.25 0 1 1 12 21.25A9.25 9.25 0 1 1 12 2.75Z']) {
    const c = circleOf(d);
    assert.ok(c && close(c.r, 9.25) && close(c.cx, 12) && close(c.cy, 12), d);
  }
  // Two equal arcs out and back — paintbrush-5's spindle, which card 1.1 §0 keeps out of the circles —
  // and two large arcs on two centres, which only the box test (2r) refuses.
  assert.equal(circleOf('M8 12A6 6 0 0 1 16 12A6 6 0 0 1 8 12Z'), null);
  assert.equal(circleOf('M8 12A6 6 0 1 1 16 12A6 6 0 1 1 8 12Z'), null);
});

test('transformD: quarter turns are exact, four make a whole turn, a mirror flips each arc\'s sweep', () => {
  const d = 'M6 9L11.47 14.47A0.75 0.75 0 0 0 12.53 14.47L18 9';
  const R = rotateAbout(90, 12, 12);
  assert.ok(R.every((n) => Number.isInteger(n)), `a quarter turn is integers: ${R}`);
  let t = d;
  for (let i = 0; i < 4; i++) t = transformD(t, R);
  assert.equal(residual(d, t).dev, 0);
  assert.deepEqual(boxOf(t), boxOf(d));
  const half = transformD(d, compose(R, R));
  assert.ok(bendOf(half).dir[1] < 0, 'half a turn points it up');
  const mirror = transformD('M3 3A3 3 0 0 1 9 3', [1, 0, 0, -1, 0, 24]);
  assert.match(mirror, /A3 3 0 1 0 9 21/, 'sweep 1 → 0 under a mirror (a half turn carries large-arc 1)');
  assert.throws(() => transformD(d, [2, 0, 0, 2, 0, 0]), /rigid/);
});

test('residual works round the ring-direction defect: congruentUpToTranslation alone cannot', () => {
  const cw = 'M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z';
  const ccw = 'M6.25 3.75A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z';
  assert.equal(congruentUpToTranslation(cw, ccw).maxDeviation, Infinity, 'the known defect (plans/set-and-rules-audit.md)');
  assert.equal(residual(cw, ccw).dev, 0);
  // and a real near miss stays a near miss: one side 0.25 longer
  const longer = 'M6.25 3.75H18A2.5 2.5 0 0 1 20.5 6.25V17.75A2.5 2.5 0 0 1 18 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z';
  const near = residual(cw, longer).dev;
  assert.ok(near > 0.1 && near < 0.25, `the best fit spreads a 0.25 error over the drawing: ${near}`);
});

test('bendAnchor turns any head to point up with its apex on the anchor', () => {
  const head = 'M17.75 6.25L17.75 11.5A0.75 0.75 0 0 1 17 12.25L11.75 12.25';      // a diagonal head, pointing down-right
  const b = bendOf(head);
  const t = transformD(head, bendAnchor(b, -90, [12, 12]));
  const b2 = bendOf(t);
  assert.ok(close(b2.apex[0], 12, 1e-5) && close(b2.apex[1], 12, 1e-5), `apex ${b2.apex}`);
  assert.ok(b2.dir[1] < 0 && Math.abs(b2.dir[0]) < 1e-5, 'points up');
  assert.ok(close(b2.leg, b.leg, 1e-5) && close(b2.turn, b.turn, 1e-4), 'a turn changes neither leg nor angle');
});

test('pxAt16 is units × 16 / master (findings-primitives.md §0)', () => {
  assert.equal(pxAt16(0.5, 24), 1 / 3);
  assert.equal(pxAt16(0.167, 16), 0.167);
  assert.equal(pxAt16(null, 20), null);
});

// ── panels on synthetic sets ──────────────────────────────────────────────────────────────────────

const DOOR = 'M9.75 20.25L9.75 16A1.5 1.5 0 0 1 11.25 14.5L12.75 14.5A1.5 1.5 0 0 1 14.25 16L14.25 20.25';
const DOOR_SHORT = 'M9.75 21.25L9.75 17.75A1.5 1.5 0 0 1 11.25 16.25L12.75 16.25A1.5 1.5 0 0 1 14.25 17.75L14.25 21.25'; // building's at 24
const shift = (d, dx, dy) => transformD(d, [1, 0, 0, 1, dx, dy]);

test('a shared part: residual against the reference, best-fit anchor onto it, classes by shape', () => {
  const dir = pinOf({
    a: { 24: svg(24, ['M3 3h18', DOOR]) },
    b: { 24: svg(24, [shift(DOOR, 2, -1)]) },                 // the same door, moved
    c: { 24: svg(24, [DOOR_SHORT]) },                         // 0.75 shorter legs
    'a-filled': { 24: svg(24, [], [DOOR.replace(/L14.25 20.25$/, 'L14.25 20.25Z')]) },
  });
  const spec = { id: 't', kind: 'residual', ref: 'a', rows: [{ name: 'a' }, { name: 'b' }, { name: 'c' }], refPart: (ic) => ic.parts.find((p) => bendOf(p.d) == null && p.d.includes('A')) };
  const P = buildPanel(spec, readSet(dir));
  const inst = P.data[24].outline.instances;
  const by = Object.fromEntries(inst.map((i) => [P.rows[i.r].name, i]));
  assert.equal(by.a.v, 0); assert.equal(by.a.self, true);
  assert.equal(by.b.v, 0, 'moved, not changed');
  assert.equal(by.c.v, 0.5, 'the residual card 1.9 gives building\'s door at 24');
  assert.equal(by.b.a, 'fit');
  assert.deepEqual(boxOf(by.b.td), boxOf(DOOR), 'the fit puts the moved door back on the reference');
  assert.deepEqual(P.data[24].outline.classes.map((c) => c.n), [2, 1]);
  assert.equal(P.data[24].outline.classes[0].label, 'A');
  assert.equal(by.b.c, by.a.c); assert.notEqual(by.c.c, by.a.c);
  // a filled twin builds the part another way: found by where it stands, never compared across constructions
  assert.equal(P.data[24].filled.instances.length, 1);
  assert.equal(P.data[24].outline.instances.length, 3);
});

test('a 0.05 near miss is its own class; another weight is never compared; one frame holds both styles; classes run by size, ties by row', () => {
  const NEAR = DOOR.replace('M9.75 20.25', 'M9.75 20.35').replace('L14.25 20.25', 'L14.25 20.35');     // legs 0.1 longer
  const LOW = DOOR.replace('M9.75 20.25', 'M9.75 19.65').replace('L14.25 20.25', 'L14.25 19.65');      // legs 0.6 shorter
  const files = {
    g: { 24: svg(24, [LOW]) }, a: { 24: svg(24, [DOOR]) }, b: { 24: svg(24, [DOOR]) }, c: { 24: svg(24, [NEAR]) }, d: { 24: svg(24, [DOOR_SHORT]) }, e: { 24: svg(24, [DOOR_SHORT]) }, f: { 24: svg(24, [DOOR]) },
    'a-filled': { 24: svg(24, [DOOR], [], 2.5) },             // a line-heavy filled door, 1.25 wider each side
    'b-filled': { 24: svg(24, [DOOR], [], 1.5) },             // the same path at the light weight: another way of drawing
  };
  const spec = { id: 't', kind: 'residual', ref: 'a', rows: ['g', 'c', 'd', 'a', 'e', 'b', 'f'].map((name) => ({ name })), refPart: (ic) => ic.parts[0] };
  const P = buildPanel(spec, readSet(pinOf(files)));
  const S = P.data[24].outline;
  const of = (n, st = S) => st.instances.find((i) => P.rows[i.r].name === n);
  assert.ok(of('c').v > 0.01 && of('c').v < 0.1, `near miss ${of('c').v}`);
  assert.notEqual(of('c').c, of('a').c, 'a 0.05 near miss is not the same drawing');
  // rows run g c d a e b f: the commonest class is A though it is met fourth, and of the two
  // one-member classes the one met first (g) is C
  assert.deepEqual(S.classes.map((c) => [c.label, c.n, P.rows[c.rep].name]), [['A', 3, 'a'], ['B', 2, 'd'], ['C', 1, 'g'], ['D', 1, 'c']], 'biggest first, ties by row');
  const F = P.data[24].filled;
  assert.equal(of('b', F).v, null);
  assert.equal(of('b', F).why, 'drawn another way', 'a 1.5 line is not compared with a 2.5 line');
  // the frame: both styles' ink, squared, one unit of air — the filled door is 1.25 wider each side
  const ink = [9.75 - 1.25, 14.5 - 1.25, 14.25 + 1.25, 20.25 + 1.25];
  const side = Math.max(ink[2] - ink[0], ink[3] - ink[1]) + 2;
  assert.deepEqual(P.data[24].frame, [(ink[0] + ink[2]) / 2 - side / 2, (ink[1] + ink[3]) / 2 - side / 2, side, side]);
});

test('ties between classes go by the row they are first met in, also past ten rows', () => {
  const NEAR = DOOR.replace('M9.75 20.25', 'M9.75 20.35').replace('L14.25 20.25', 'L14.25 20.35');
  const LOW = DOOR.replace('M9.75 20.25', 'M9.75 19.65').replace('L14.25 20.25', 'L14.25 19.65');
  const names = Array.from({ length: 11 }, (_, i) => `r${i}`);
  const files = Object.fromEntries(names.map((n, i) => [n, { 24: svg(24, [i === 2 ? LOW : i === 10 ? NEAR : DOOR]) }]));
  const P = buildPanel({ id: 't', kind: 'residual', ref: 'r0', rows: names.map((name) => ({ name })), refPart: (ic) => ic.parts[0] }, readSet(pinOf(files)));
  // classify's own order would put instance "10" before "2" (it compares ids as text)
  assert.deepEqual(P.data[24].outline.classes.map((c) => [c.n, P.rows[c.rep].name]), [[9, 'r0'], [1, 'r2'], [1, 'r10']]);
});

test('the square panel puts one square walked both ways in one class, and keeps a turned rectangle out', () => {
  const cw = 'M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z';
  const ccw = 'M6.25 3.75A2.5 2.5 0 0 0 3.75 6.25V17.75A2.5 2.5 0 0 0 6.25 20.25H17.75A2.5 2.5 0 0 0 20.25 17.75V6.25A2.5 2.5 0 0 0 17.75 3.75Z';
  const turned = 'M4.04 17.84L17.84 4.04A1 1 0 0 1 19.25 4.04L19.96 4.75A1 1 0 0 1 19.96 6.16L6.16 19.96A1 1 0 0 1 4.75 19.96L4.04 19.25A1 1 0 0 1 4.04 17.84Z';
  const off = transformD(cw, [1, 0, 0, 1, 0.5, 0]);
  const P = buildPanel(PANELS.find((p) => p.id === 'square'), readSet(pinOf({ checkbox: { 24: svg(24, [cw]) }, 'layout-sidebar-right': { 24: svg(24, [ccw]) }, wand: { 24: svg(24, [turned]) }, aside: { 24: svg(24, [off]) } })));
  assert.deepEqual(P.rows.map((r) => r.name).sort(), ['checkbox', 'layout-sidebar-right']);
  assert.deepEqual(P.data[24].outline.classes.map((c) => c.n), [2]);
  assert.equal(P.data[24].outline.instances.find((i) => P.rows[i.r].name === 'layout-sidebar-right').v, 0);
});

test('the ring panel: the container ring only, at its outer ink edge, in both constructions', () => {
  const ring = { 24: 'M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z', 20: 'M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z', 16: 'M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z' };
  const disc = { 24: 'M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z', 20: 'M2 10A8 8 0 1 0 18 10A8 8 0 1 0 2 10Z', 16: 'M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8Z' };
  const P = buildPanel(PANELS.find((p) => p.id === 'ring'), readSet(pinOf({
    'plus-circle': every((m) => svg(m, [ring[m]])),
    'plus-circle-filled': every((m) => svg(m, [], [disc[m]])),
    clock: every((m) => svg(m, [ring[m], `M${m / 2} ${m / 2}h2`])),
    // a line-heavy filled ring: centreline r 8.75 at 2.5 is the container at its OUTER edge (ban-filled)
    'ban-filled': { 24: svg(24, ['M3.25 12A8.75 8.75 0 1 0 20.75 12A8.75 8.75 0 1 0 3.25 12Z'], [], FW[24]) },
    // and a ring whose centreline is the container's is not: its ink stands 0.75 outside
    halo: { 24: svg(24, ['M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z']) },
    // the container's size, off the canvas centre: not the container
    aside: { 24: svg(24, ['M3.75 12A9.25 9.25 0 1 0 22.25 12A9.25 9.25 0 1 0 3.75 12Z']) },
    target: { 24: svg(24, ['M4.75 12A7.25 7.25 0 1 0 19.25 12A7.25 7.25 0 1 0 4.75 12Z']) },   // a ring, but not the container's
  })));
  assert.deepEqual(P.rows.map((r) => [r.name, r.group]), [['clock', 'A'], ['plus-circle', 'A'], ['ban', null]], 'a filled-only carrier sorts last, with no 24 outline class');
  for (const m of [24, 20, 16]) {
    assert.equal(P.data[m].outline.instances.length, 2, `${m}`);
    assert.ok(P.data[m].outline.instances.every((i) => i.v === 0));
    assert.deepEqual(P.data[m].filled.instances.map((i) => `${P.rows[i.r].name} ${i.k}`).sort(), m === 24 ? ['ban s', 'plus-circle a'] : ['plus-circle a']);
  }
});

test('the dot panel classes by ink diameter, smallest first, and stops below 0.575 of the container', () => {
  const dot = (cx, r) => `M${cx - r} 12A${r} ${r} 0 1 0 ${cx + r} 12A${r} ${r} 0 1 0 ${cx - r} 12Z`;
  const P = buildPanel(PANELS.find((p) => p.id === 'dot'), readSet(pinOf({
    info: { 24: svg(24, [dot(12, 0.5)]) },                    // ⌀2.5
    building: { 24: svg(24, [dot(6, 0.25), dot(9, 0.25)]) },  // ⌀2 ×2
    key: { 24: svg(24, [dot(12, 4.75)]) },                    // ⌀11 — inside the census
    gauge: { 24: svg(24, [dot(12, 5)]) },                     // ⌀11.5 — the first size out
    help: { 24: svg(24, [dot(4, 0.5), dot(8, 0.5)]) },        // two more ⌀2.5: the commonest size is not the smallest
  })));
  assert.deepEqual(P.data[24].outline.classes.map((c) => [c.label, c.n, c.rows]), [['⌀2', 2, 1], ['⌀2.5', 3, 2], ['⌀11', 1, 1]], 'smallest first, never commonest first');
  assert.deepEqual(P.rows.map((r) => [r.name, r.group]), [['building', '⌀2'], ['help', '⌀2.5'], ['info', '⌀2.5'], ['key', '⌀11']], 'rows follow the 24 classes');
  const i = P.data[24].outline.instances.find((x) => P.rows[x.r].name === 'info');
  assert.deepEqual(boxOf(i.td), [11.5, 11.5, 12.5, 12.5].map((n) => n), 'centred on the canvas centre');
});

test('the chevron panel turns each direction about the canvas centre, so one drawing turned is one class', () => {
  const down = { 24: 'M6 9L11.47 14.47A0.75 0.75 0 0 0 12.53 14.47L18 9' };
  const R = (deg) => ({ 24: transformD(down[24], rotateAbout(deg, 12, 12)) });
  const P = buildPanel(PANELS.find((p) => p.id === 'chevron'), readSet(pinOf({
    'chevron-down': { 24: svg(24, [down[24]]) },
    'chevron-up': { 24: svg(24, [R(180)[24]]) },
    'chevron-left': { 24: svg(24, [R(90)[24]]) },
    'chevron-right': { 24: svg(24, [R(-90)[24]]) },
    'chevron-down-filled': { 24: svg(24, ['M6.5 9.5L11.12 14.12A1.25 1.25 0 0 0 12.88 14.12L17.5 9.5'], [], FW[24]) },
  })));
  const S = P.data[24].outline;
  assert.equal(S.classes.length, 1);
  assert.equal(S.classes[0].n, 4);
  for (const it of S.instances) assert.deepEqual(boxOf(it.td), boxOf(down[24]), P.rows[it.r].name);
  assert.deepEqual(S.instances.find((i) => P.rows[i.r].name === 'chevron-up').m, [-1, 0, 0, -1, 24, 24]);
  assert.equal(P.data[24].filled.instances.length, 1);
  assert.ok(close(P.data[24].filled.instances[0].bend.R, 1.25));
});

test('the layout panel turns header, sidebar and sidebar-right back onto the footer exactly (C29)', () => {
  const sq = 'M6.25 3.75H17.75A2.5 2.5 0 0 1 20.25 6.25V17.75A2.5 2.5 0 0 1 17.75 20.25H6.25A2.5 2.5 0 0 1 3.75 17.75V6.25A2.5 2.5 0 0 1 6.25 3.75Z';
  const footer = [sq, 'M3.75 14.25H20.25', 'M6.75 17.25h3'];   // the short mark makes it lopsided, so a half turn is not a mirror
  const map = (ds, M) => ds.map((d) => transformD(d, M));
  const sidebar = map(footer, rotateAbout(90, 12, 12));
  const P = buildPanel(PANELS.find((p) => p.id === 'layout'), readSet(pinOf({
    'layout-footer': { 24: svg(24, footer) },
    'layout-header': { 24: svg(24, map(footer, [1, 0, 0, -1, 0, 24])) },
    'layout-sidebar': { 24: svg(24, sidebar) },
    'layout-sidebar-right': { 24: svg(24, map(sidebar, [-1, 0, 0, 1, 24, 0])) },
  })));
  const S = P.data[24].outline;
  assert.equal(S.instances.length, 4);
  assert.ok(S.instances.every((i) => i.v === 0), JSON.stringify(S.instances.map((i) => [P.rows[i.r].name, i.v])));
  assert.deepEqual(S.classes.map((c) => c.n), [4]);
  // a header drawn the wrong way round (turned, not mirrored) is caught
  const P2 = buildPanel(PANELS.find((p) => p.id === 'layout'), readSet(pinOf({
    'layout-footer': { 24: svg(24, footer) },
    'layout-header': { 24: svg(24, map(footer, rotateAbout(90, 12, 12))) },
  })));
  assert.ok(P2.data[24].outline.instances.find((i) => P2.rows[i.r].name === 'layout-header').v > 0);
});

test('plus: the mark is found as two crossing bars, and moved to the canvas centre', () => {
  const P = buildPanel(PANELS.find((p) => p.id === 'plus'), readSet(pinOf({
    plus: { 24: svg(24, ['M12 4.5v15', 'M4.5 12h15']) },
    'volume-plus': { 24: svg(24, ['M2.75 9.25h6', 'M14.75 12h6.5', 'M18 8.75v6.5']) },
  })));
  const vp = P.data[24].outline.instances.find((i) => P.rows[i.r].name === 'volume-plus');
  assert.deepEqual(boxOf(vp.td), [8.75, 8.75, 15.25, 15.25]);
  assert.equal(vp.a, 'centre');
});

test('every card line on a panel has a reader, and agreement is computed, never assumed', () => {
  for (const p of PANELS) for (const line of AGAINST[p.id] ?? []) {
    assert.equal(typeof line[0], 'function', p.id);
    assert.ok(line[1] && line[2], p.id);
    assert.ok(line[3] === null || typeof line[3] === 'string', `${p.id}: expect is a string or null`);
  }
  assert.ok(PANELS.every((p) => AGAINST[p.id]), 'every panel says what the cards state about it');
});

test('build and the command line: pin and command recorded, digest of the icons, one file written', () => {
  const dir = pinOf({ 'plus-circle': every((m) => svg(m, [m === 24 ? 'M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z' : m === 20 ? 'M2.75 10A7.25 7.25 0 1 0 17.25 10A7.25 7.25 0 1 0 2.75 10Z' : 'M1.625 8A6.375 6.375 0 1 0 14.375 8A6.375 6.375 0 1 0 1.625 8Z'])) });
  const before = digestOf(dir);
  const out = join(dir, 'out.json');
  const r = spawnSync(process.execPath, [TOOL, dir, '--out', out, '--commit', 'abc1234'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const j = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(j.pin, 'abc1234');
  assert.match(j.generator, /tools\/audit\/primitives-data\.mjs/);
  assert.equal(j.iconsDigest, before);
  assert.equal(j.panels.length, PANELS.length);
  const ring = j.panels.find((p) => p.id === 'ring');
  assert.deepEqual(ring.against.map((a) => a.agrees), [false, false, true, false], 'one icon is not 40, but its residual is 0');
  writeFileSync(join(dir, 'src/icons/24/plus-circle.svg'), svg(24, ['M3 12h18']));
  assert.notEqual(digestOf(dir), before, 'the digest moves with the drawings');
  assert.equal(spawnSync(process.execPath, [TOOL], { encoding: 'utf8' }).status, 2, 'no pin directory is a usage error');
  assert.equal(partsOf(svg(24, ['M3 12h18M12 3v18'])).length, 2, 'a path\'s subpaths are separate parts');
});

// ── the pin ───────────────────────────────────────────────────────────────────────────────────────

const haveCommit = () => spawnSync('git', ['-C', REPO, 'cat-file', '-e', `${PIN}^{commit}`]).status === 0;
let pinData = null;
function realPin() {
  if (!pinData) {
    const dir = mkdtempSync(join(tmpdir(), 'primitives-pin-'));
    dirs.push(dir);
    execFileSync('sh', ['-c', `git -C "${REPO}" archive ${PIN} src/icons | tar -x -C "${dir}"`]);
    pinData = build(dir);
  }
  return pinData;
}
const panel = (id) => realPin().panels.find((p) => p.id === id);
const v = (p, name, m, s = 'outline') => p.masters[m][s].instances.find((i) => p.rows[i.r].name === name)?.v ?? null;

test('the pin: the cards\' headline figures come back', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const ring = panel('ring');
  assert.deepEqual([24, 20, 16].map((m) => ring.masters[m].outline.instances.length), [40, 40, 40], 'findings-primitives.md:160');
  const chk = panel('check');
  assert.deepEqual(['checkbox', 'checkbox-2', 'checkbox-3', 'checkbox-4'].map((n) => [24, 20, 16].map((m) => v(chk, n, m))),
    [[0, 0, 0.106], [0, 0, 0.172], [0, 0, 0.258], [0, 0, 0]], 'findings-primitives.md:599-602');
  const door = panel('door');
  assert.deepEqual([24, 20, 16].map((m) => v(door, 'building', m)), [0.5, 0.167, 0], 'findings-grammar.md:426');
  assert.deepEqual([24, 20, 16].map((m) => v(panel('star'), 'sparkle-2', m)), [0, 0.278, 0], 'findings-grammar.md:427');
  assert.deepEqual([24, 20, 16].map((m) => v(panel('shackle'), 'lock-5', m)), [0.625, 0, 0.125], 'findings-grammar.md:432');
  const head = panel('arrowhead');
  assert.deepEqual([head.masters[24].outline.instances.length, head.masters[24].outline.classes.length], [106, 25], 'findings-primitives.md:405');
  assert.deepEqual([head.masters[20].outline.instances.length, head.masters[20].outline.classes.length], [106, 28], 'findings-primitives.md:436');
  assert.deepEqual([24, 20, 16].map((m) => panel('chevron').masters[m].outline.classes.length), [9, 9, 9], 'findings-primitives.md:337');
  assert.deepEqual([24, 20, 16].map((m) => panel('landscape').masters[m].outline.instances.filter((i) => i.v === 0).length), [8, 9, 11], 'findings-grammar.md:434');
  assert.equal(panel('badge').rows.length, 0);
});

test('the pin: the page differs from the cards in exactly the four places it lists', (t) => {
  if (!haveCommit()) { t.skip(`commit ${PIN} is not in this clone`); return; }
  const diffs = realPin().panels.flatMap((p) => p.against.filter((a) => a.agrees === false).map((a) => `${p.id}: ${a.measured}`));
  assert.deepEqual(diffs, [
    'ring: 40 · 40 · 40',
    'square: 24 · 24 · 24',
    'dot: 178 dots · 18 diameters | 155 dots · 15 diameters | 151 dots · 19 diameters',
    'dot: 11 at ⌀2, 2 at ⌀2.5 (sparkle-4, wand)',
  ]);
  const agree = realPin().panels.flatMap((p) => p.against.filter((a) => a.agrees));
  assert.ok(agree.length >= 50, `${agree.length} lines agree`);
});
