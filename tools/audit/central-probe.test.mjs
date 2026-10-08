// tools/audit/central-probe.test.mjs — synthetic fixtures only: hand-built records, a tiny fake pin and a tiny
// fake reference directory made with mkdtempSync. No pin, no research/, no network.
// Run: node --test tools/audit/central-probe.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  repeatedNames, rawDumps, endKind, pairCensus, sampleBoxes, radiusRelation, offByConcept, loadConcepts, frameCount, alwaysBreaking, modalOffset,
} from './central-probe.mjs';

const PROBE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'central-probe.mjs');
const made = [];
const tmp = (tag) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), tag)); made.push(d); return d; };
test.after(() => { for (const d of made) fs.rmSync(d, { recursive: true, force: true }); });
const near = (a, b, t = 1e-6) => assert.ok(Math.abs(a - b) <= t, `${a} vs ${b}`);

// ── reference-side fixtures (the record shape figma.mjs ingest writes) ──
const stroke = (d, weight = 2) => ({ d, paint: 'stroke', node: { type: 'VECTOR' }, cornerRadiusProp: 0,
  stroke: { weight, align: 'CENTER', cap: 'ROUND', join: 'ROUND', miterLimit: 4 } });
const fill = (d) => ({ d, paint: 'fill', node: { type: 'VECTOR' }, cornerRadiusProp: 0, stroke: null });
const ink = (x0, y0, x1, y1) => ({ ink: { x: { abs: x0 }, y: { abs: y0 }, w: { abs: x1 - x0 }, h: { abs: y1 - y0 } } });
const rec = (filled, s, rad, join, paths, box, flags = {}) => ({ variant: { filled, stroke: s, radius: rad, join }, canvas: [24, 24], paths, measure: ink(...box), meta: { flags } });
const asConcept = (id, name, records) => ({ id, name, group: 'G', by: new Map(records.map((r) => [`${r.variant.filled}|${r.variant.stroke}|${r.variant.radius}|${r.variant.join}`, r])) });

test('repeatedNames finds names that occur twice inside one group, and only there', () => {
  const rows = [['A', 'images-4', '', '1:1'], ['A', 'images-4', '', '1:2'], ['B', 'images-4', '', '1:3'], ['A', 'x', '', '1:4']];
  assert.deepEqual(repeatedNames(rows), [{ key: 'A/images-4', ids: ['1:1', '1:2'] }]);
  assert.deepEqual(repeatedNames([['A', 'x', '', '1']]), []);
});

test('frameCount counts groups, not sets', () => {
  assert.equal(frameCount([['A', 'x'], ['A', 'y'], ['A', 'y'], ['B', 'z']]), 2);
  assert.equal(frameCount([]), 0);
});

test('alwaysBreaking keeps icons whose EVERY verified pair breaks, worst side first', () => {
  const C = [
    { name: 'some', pairs: [{}, {}], bad: 1, worst: 1.5 },
    { name: 'every-small', pairs: [{}, {}], bad: 2, worst: 0.3 },
    { name: 'none', pairs: [{}], bad: 0, worst: 0 },
    { name: 'every-big', pairs: [{}], bad: 1, worst: 0.9 },
  ];
  assert.deepEqual(alwaysBreaking(C).map((c) => c.name), ['every-big', 'every-small']);
});

test('modalOffset finds the commonest off-by, measured, not assumed', () => {
  const off = [0.125, 0.125, 0.125, -0.125, 0.5].map((d) => ({ d }));
  assert.deepEqual(modalOffset(off), { d: 0.125, n: 3 });
  assert.deepEqual(modalOffset([0.25, 0.25, 0.5, 0.5, -0.25, -0.25].map((d) => ({ d }))), { d: 0.25, n: 2 });   // tie: smaller |d|, then positive
  assert.equal(modalOffset([]), null);
});

test('endKind reads the open ends: slanted, square-on, or none', () => {
  assert.equal(endKind(rec('off', '2', '0', 'round', [stroke('M 4 4 L 20 20')], [3, 3, 21, 21])), 'diagonal-ended');
  assert.equal(endKind(rec('off', '2', '0', 'round', [stroke('M 4 12 L 20 12')], [3, 11, 21, 13])), 'axis-ended only');
  assert.equal(endKind(rec('off', '2', '0', 'round', [stroke('M 4 4 L 20 4 L 20 20 L 4 20 Z')], [3, 3, 21, 21])), 'no open ends');
});

// one concept whose filled X is cut flat (box bigger by 0.25 a side), one that holds, one rotated (left out)
function concepts() {
  const X = [];
  const cross = [], held = [], rot = [], nudge = [];
  for (const s of ['2', '1.5', '1']) {
    const h = Number(s) / 2;
    cross.push(rec('off', s, '0', 'round', [stroke('M 6 6 L 18 18', Number(s))], [6 - h, 6 - h, 18 + h, 18 + h]));
    cross.push(rec('on', s, '0', 'round', [fill(`M ${5.75 - h} ${5.75 - h} L ${18.25 + h} ${5.75 - h} L ${18.25 + h} ${18.25 + h} L ${5.75 - h} ${18.25 + h} Z`)], [5.75 - h, 5.75 - h, 18.25 + h, 18.25 + h]));
    held.push(rec('off', s, '0', 'round', [stroke('M 4 12 L 20 12', Number(s))], [4 - h, 12 - h, 20 + h, 12 + h]));
    held.push(rec('on', s, '0', 'round', [fill(`M ${4 - h} ${12 - h} L ${20 + h} ${12 - h} L ${20 + h} ${12 + h} L ${4 - h} ${12 + h} Z`)], [4 - h, 12 - h, 20 + h, 12 + h]));
    rot.push(rec('off', s, '0', 'round', [stroke('M 4 12 L 20 12', Number(s))], [4 - h, 12 - h, 20 + h, 12 + h], { rotated: true }));
    // each side 0.007 further out: the four sides hold to 0.01, the width (0.014) does not
    nudge.push(rec('off', s, '0', 'round', [stroke('M 4 12 L 20 12', Number(s))], [4 - h, 12 - h, 20 + h, 12 + h]));
    nudge.push(rec('on', s, '0', 'round', [fill(`M ${3.993 - h} ${12 - h} L ${20.007 + h} ${12 - h} L ${20.007 + h} ${12 + h} L ${3.993 - h} ${12 + h} Z`)], [3.993 - h, 12 - h, 20.007 + h, 12 + h]));
    rot.push(rec('on', s, '0', 'round', [fill('M 0 0 L 1 0 L 1 1 Z')], [0, 0, 1, 1]));
  }
  X.push(asConcept('G/cross-large#0', 'cross-large', cross), asConcept('G/bar#1', 'bar', held), asConcept('G/rot#2', 'rot', rot), asConcept('G/nudge#3', 'nudge', nudge));
  return X;
}

test('pairCensus: only verified pairs count; an always-breaking icon is found with its worst side', () => {
  const C = pairCensus(concepts());
  assert.deepEqual(C.map((c) => c.name), ['cross-large', 'bar', 'nudge']);      // the rotated one has no verified pair
  assert.deepEqual(alwaysBreaking(C).map((c) => c.name), ['cross-large']);
  assert.equal(C[2].bad, 0);
  const x = C[0], b = C[1];
  assert.equal(x.pairs.length, 3); assert.equal(x.bad, 3); near(x.worst, 0.25); assert.equal(x.kind, 'diagonal-ended');
  assert.equal(b.bad, 0); assert.equal(b.kind, 'axis-ended only');
});

test('sampleBoxes compares the sample on the render bounds (x, y, width, height) and on verified boxes', () => {
  const T = sampleBoxes(concepts(), ['G|cross-large', 'G|bar', 'G|rot', 'G|nudge', 'G|cross-large']);
  assert.equal(T.concepts, 4); assert.equal(T.pairs, 12);
  assert.equal(T.render, 3);                 // only the bar keeps x, y, width and height; nudge's width moves 0.014
  assert.equal(T.verifiedPairs, 9); assert.equal(T.verified, 6);   // on the four sides nudge holds
});

function fakeRefs() {
  const dir = tmp('central-probe-refs-');
  const fig = path.join(dir, 'central', 'figma'); fs.mkdirSync(path.join(fig, 'raw'), { recursive: true });
  fs.writeFileSync(path.join(fig, 'catalogue.json'), JSON.stringify({ page: { id: '7:118', name: 'Icons' }, rows: [['A', 'a', '', 1, 30, '', 24, 24, '1:1'], ['B', 'b', '', 1, 30, '', 24, 24, '1:2'], ['B', 'b', '', 1, 30, '', 24, 24, '1:3']] }));
  const [x, bar] = concepts();
  fs.writeFileSync(path.join(fig, 'g--cross-large--1.json'), JSON.stringify({ group: 'G', name: 'cross-large', records: [...x.by.values()] }));
  fs.writeFileSync(path.join(fig, 'g--bar--2.json'), JSON.stringify({ group: 'G', name: 'bar', records: [...bar.by.values()] }));
  fs.writeFileSync(path.join(fig, 'raw', 'central-extract-0-3-aa.json'), JSON.stringify({ from: 0, to: 3, enumerated: 3, picked: ['A|a', 'B|b', 'B|b'], errors: [{ at: 2, name: 'b', error: 'in get_vectorPaths: Network: invalid loop' }] }));
  fs.writeFileSync(path.join(fig, 'raw', 'central-extract-0-1-bb.json'), JSON.stringify({ from: 0, to: 1, enumerated: 3, picked: ['G|cross-large'] }));
  return dir;
}

test('rawDumps tells full reads from samples and keeps their errors; loadConcepts keys by order', () => {
  const refs = fakeRefs();
  const D = rawDumps(refs, 'central');
  assert.equal(D.filter((d) => d.full).length, 1);
  assert.deepEqual(D.find((d) => d.full).errors.map((e) => e.name), ['b']);
  assert.deepEqual(D.filter((d) => !d.full).map((d) => d.picked), [['G|cross-large']]);
  const C = loadConcepts(refs);
  assert.equal(C.length, 2); assert.equal(C[0].id, 'G/bar#0'); assert.equal(C[1].id, 'G/cross-large#1'); assert.equal(C[1].by.size, 6);
});

// ── our side: a fake pin with one shape-filled pair whose filled corner is consistent and one that is 0.25 too round ──
const SVG = (m, sw, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
const area = (d) => `  <path d="${d}" stroke="none" fill="currentColor"/>`;
const rr = (x, y, w, h, r) => `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
function fakePin(shapes = [['good', 0], ['round', 0.25]], { twice = false } = {}) {
  const dir = tmp('central-probe-pin-');
  for (const m of [24, 20, 16]) {
    const d = path.join(dir, 'src', 'icons', String(m)); fs.mkdirSync(d, { recursive: true });
    const w = m === 16 ? 1.25 : 1.5, h = w / 2;
    for (const [n, extra] of shapes) {
      const outline = `  <path d="${rr(4, 4, 12, 12, 2.5)}"/>`;
      fs.writeFileSync(path.join(d, `${n}.svg`), SVG(m, w, twice ? `${outline}\n${outline}` : outline));
      fs.writeFileSync(path.join(d, `${n}-filled.svg`), SVG(m, w, area(rr(4 - h, 4 - h, 12 + w, 12 + w, 2.5 + h + extra))));
    }
    fs.writeFileSync(path.join(d, 'line.svg'), SVG(m, w, '  <path d="M4 8h8"/>'));            // line-heavy: not a shape-filled pair
    fs.writeFileSync(path.join(d, 'line-filled.svg'), SVG(m, 2, '  <path d="M4.25 8h7.5"/>'));
  }
  return dir;
}

test('radiusRelation: filled radius = outline radius + half the stroke, matched by place', () => {
  const pin = fakePin();
  for (const [m, h] of [[24, 0.75], [16, 0.625]]) {
    const R = radiusRelation(pin, m);
    assert.equal(R.pairs, 2);                       // `line` is line-heavy and is skipped
    assert.equal(R.corners, 8); assert.equal(R.matched, 8); assert.equal(R.ok, 4);
    assert.equal(R.off.length, 4);
    for (const x of R.off) { assert.equal(x.n, 'round'); near(x.d, 0.25, 1e-3); near(x.outline, 2.5, 1e-3); near(x.expected, 2.5 + h, 1e-3); near(x.filled, 2.75 + h, 1e-3); }
    assert.deepEqual(offByConcept(R.off).map(([n, xs]) => [n, xs.length]), [['round', 4]]);
  }
});

test('radiusRelation matches each filled corner once', () => {
  // the outline draws its rounded square twice: eight outline corners, four filled ones — four matches, not eight
  const R = radiusRelation(fakePin([['twice', 0]], { twice: true }), 24);
  assert.equal(R.corners, 8); assert.equal(R.matched, 4); assert.equal(R.ok, 4);
});

test('CLI: a section heading appears; an unknown section or a missing pin exits 2', () => {
  const pin = fakePin(), refs = fakeRefs();
  const out = execFileSync(process.execPath, [PROBE, pin, 's5', 's11', '--refs', refs], { encoding: 'utf8' });
  assert.match(out, /## §5 /);
  assert.match(out, /\| 24 \| 2 \| 8 \| 4 \(50\.0%\) \| 4 corners in 1 concepts \|/);
  assert.match(out, /## §11 [\s\S]*B\/b ×2/);
  const s1 = execFileSync(process.execPath, [PROBE, pin, 's1', '--refs', refs], { encoding: 'utf8' });
  assert.match(s1, /2 category frames/);
  const s7 = execFileSync(process.execPath, [PROBE, pin, 's7', '--refs', refs], { encoding: 'utf8' });
  assert.match(s7, /icons with at least one verified pair: 2; every pair breaks in 1 — slanted-ended 1, the other 0/);
  assert.match(s7, /the 1, worst side first: cross-large 0\.25\n/);
  assert.match(s7, /cross-large: breaks in 3 of 3 verified pairs, by up to 0\.25 a side/);
  assert.match(s7, /the earlier 1-icon sample .*: outer box equal to 0\.01 in 0 of 3 pairs/);
  // s9 on a pin whose commonest offset at 16 is +0.25 (two twins, eight corners), with one twin at +0.5
  const pin9 = fakePin([['round', 0.25], ['round-b', 0.25], ['big', 0.5]]);
  const s9 = execFileSync(process.execPath, [PROBE, pin9, 's9', '--refs', refs], { encoding: 'utf8' });
  assert.match(s9, /#1 At 16, 2 shape-filled twins have a corner radius 0\.25 larger .*: round, round-b \(8 corners\)/);
  assert.match(s9, /#4 off the relation by different amounts at 24: big .*; round .*; round-b/);
  const s5 = execFileSync(process.execPath, [PROBE, pin9, 's5', '--refs', refs], { encoding: 'utf8' });
  assert.match(s5, /At 16, 8 of the 12 are off by exactly \+0\.250 \(the commonest offset\), in `round`, `round-b` \(2 concepts\)\. The other 4: \+0\.500 \(`big`\)/); assert.match(s1, /`b` — Figma raised "in get_vectorPaths: Network: invalid loop"/); assert.match(s1, /reading it cost 1 bridge calls/);
  assert.equal(spawnSync(process.execPath, [PROBE, pin, 'nope', '--refs', refs]).status, 2);
  assert.equal(spawnSync(process.execPath, [PROBE, path.join(pin, 'missing')]).status, 2);
  assert.equal(spawnSync(process.execPath, [PROBE, pin, '--bogus']).status, 2);
});
