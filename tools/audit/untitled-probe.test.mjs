// tools/audit/untitled-probe.test.mjs — synthetic fixtures only: hand-built records, a tiny fake pin and a tiny
// fake reference directory made with mkdtempSync. No pin, no research/, no network.
// Run: node --test tools/audit/untitled-probe.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  badgePattern, sideDefiners, slantedBreaks, boxTests, recordCensus, rawDumps, nanPaths, pairsOf, diagEnds,
  oursPairs, chevronRows, sideTable, loadConcepts, fromAxis, famOf, sizeOf, legAngles, flatBySize, boxBreaks, slantedAt24,
  badgeSplit, harnessCount,
} from './untitled-probe.mjs';
import { iconFromSource } from './angles.mjs';

const PROBE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'untitled-probe.mjs');
const made = [];
const tmp = (tag) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), tag)); made.push(d); return d; };
test.after(() => { for (const d of made) fs.rmSync(d, { recursive: true, force: true }); });
const near = (a, b, t = 1e-6) => assert.ok(Math.abs(a - b) <= t, `${a} vs ${b}`);

// ── reference-side fixtures (the record shape figma.mjs ingest writes) ──
const stroke = (d, weight = 2) => ({ d, paint: 'stroke', node: { type: 'VECTOR' }, cornerRadiusProp: 0, cornerSmoothingProp: 0.6,
  stroke: { weight, align: 'CENTER', cap: 'ROUND', join: 'ROUND', miterLimit: 4 } });
const fill = (d) => ({ d, paint: 'fill', node: { type: 'VECTOR' }, cornerRadiusProp: 0, cornerSmoothingProp: 0.6, stroke: null });
const box = (x0, y0, x1, y1) => ({ ink: { x: { abs: x0 }, y: { abs: y0 }, w: { abs: x1 - x0 }, h: { abs: y1 - y0 } } });
const rec = (style, paths, ink) => ({ style, canvas: [24, 24], paths, measure: ink ? box(...ink) : {}, meta: { pageId: '1:2', flags: {} } });

test('famOf and sizeOf read the chevron family and size from the name', () => {
  assert.equal(famOf('chevron-down-2'), 'flat'); assert.equal(famOf('chevron-left-2-large'), 'flat');
  assert.equal(famOf('chevron-up-3'), 'steep'); assert.equal(famOf('chevron-right-3-small'), 'steep');
  assert.equal(famOf('chevron-down'), 'classic'); assert.equal(famOf('chevron-down-small'), 'classic');
  assert.equal(famOf('chevrons-up-down-2'), 'chevrons-up-down');
  assert.equal(sizeOf('chevron-down-2-large'), 'large'); assert.equal(sizeOf('chevron-down-2-small'), 'small'); assert.equal(sizeOf('chevron-down-2'), 'plain');
});

test('flatBySize maps the flat chevrons at 16 to their sizes, and only those', () => {
  const cr = [
    { fam: 'flat', m: 16, size: 'large', d: 1.39 }, { fam: 'flat', m: 16, size: 'small', d: 1.85 }, { fam: 'flat', m: 16, size: 'plain', d: 1.923 },
    { fam: 'flat', m: 24, size: 'large', d: 2.8 }, { fam: 'steep', m: 16, size: 'large', d: 0.1 },
  ];
  assert.deepEqual(flatBySize(cr), { n: 3, large: '1.39', small: '1.85', plain: '1.92' });
});

test('boxBreaks counts the differing pairs, and the ones without a grows: note', () => {
  const rows = [{ n: 'a', box: 0.5, grows: true }, { n: 'a', box: 0.25, grows: false }, { n: 'd', box: 0.375, grows: true }, { n: 'b', box: 0, grows: false }, { n: 'c', box: 0.005, grows: true }];
  const B = boxBreaks(rows);
  assert.equal(B.all.length, 3); assert.equal(B.undeclared.length, 1); assert.equal(B.undeclared[0].box, 0.25); assert.deepEqual([...B.concepts], ['a', 'd']);
});

test('slantedAt24 counts master 24 only', () => {
  const rows = [{ m: 24, diag: 2 }, { m: 24, diag: 0 }, { m: 20, diag: 2 }, { m: 16, diag: 1 }];
  const S = slantedAt24(rows);
  assert.equal(S.R24.length, 2); assert.equal(S.diag24, 1);
});

test('badgeSplit: tagged names are the badges, the rest are not', () => {
  const S = badgeSplit(['file-x-01', 'cloud-lightning', 'pen-tool-plus'], /^(file-x-\d+|pen-tool-(minus|plus))$/);
  assert.deepEqual(S.badge, ['file-x-01', 'pen-tool-plus']); assert.deepEqual(S.not, ['cloud-lightning']);
});

test('harnessCount pairs every outline with the one solid, so a name with two outlines counts twice', () => {
  const C = [
    { records: [rec('outline', [], [3, 3, 21, 21]), rec('outline', [], [3, 3, 21, 21]), rec('filled', [], [3, 3, 21, 21])] },   // 2 pairs, both hold
    { records: [rec('outline', [], [3, 3, 21, 21]), rec('filled', [], [2.993, 3, 21.007, 21])] },                                 // sides hold, width does not
    { records: [rec('filled', [], [3, 3, 21, 21])] },                                                                             // solid only: no pair
    { records: [rec('outline', [], [3, 3, 21, 21]), rec('filled', [], [3, 3, 21, 21]), rec('filled', [], [3, 3, 21, 21])] },    // two solids: skipped
  ];
  assert.deepEqual(harnessCount(C), { n: 3, hold: 2 });
});

test('legAngles keeps straight pieces 5..85 degrees from horizontal and at least 0.5 long', () => {
  const ic = iconFromSource(SVG(24, 1.5, '  <path d="M4 4l4 4"/>\n  <path d="M12 4v6"/>\n  <path d="M14 4h6"/>\n  <path d="M16 12l0.2 0.2"/>'), { file: 'l.svg' });
  assert.deepEqual(legAngles(ic).map((a) => Math.round(a * 1000) / 1000), [45]);
});

test('BADGE is read out of the source text it lives in', () => {
  const re = badgePattern("const X = 1;\nconst BADGE = /^(file-(plus|x)-\\d+|clock-plus)$/;\nconst Y = 2;");
  assert.equal(re.test('file-plus-01'), true);
  assert.equal(re.test('clock-plus'), true);
  assert.equal(re.test('file-heart-01'), false);
  assert.throws(() => badgePattern('const NOTBADGE = /x/;'), /BADGE/);
});

test('fromAxis measures the angle to the nearer axis', () => {
  near(fromAxis([1, 0]), 0); near(fromAxis([0, 1]), 0); near(fromAxis([1, 1]), 45); near(fromAxis([2, 1]), Math.atan(0.5) * 180 / Math.PI);
  near(fromAxis([1, 2]), Math.atan(0.5) * 180 / Math.PI); near(fromAxis([-3, 1]), Math.atan(1 / 3) * 180 / Math.PI);
});

test('sideDefiners: a slanted line is held by its slanted caps, a level line by square-on caps', () => {
  const diag = rec('outline', [stroke('M 4 4 L 20 20')]);
  const d = sideDefiners(diag, { x0: 3, y0: 3, x1: 21, y1: 21 });
  assert.deepEqual(d, { left: 'diagCap', top: 'diagCap', right: 'diagCap', bottom: 'diagCap' });
  const level = rec('outline', [stroke('M 4 12 L 20 12')]);
  const l = sideDefiners(level, { x0: 3, y0: 11, x1: 21, y1: 13 });
  assert.equal(l.left, 'axisCap'); assert.equal(l.right, 'axisCap');
  // a side reached by both a slanted cap and a square-on cap counts as slanted
  const both = rec('outline', [stroke('M 4 4 L 12 12'), stroke('M 4 20 L 20 20')]);
  assert.equal(sideDefiners(both, { x0: 3, y0: 3, x1: 21, y1: 21 }).left, 'diagCap');
  assert.equal(sideDefiners(both, { x0: 3, y0: 3, x1: 21, y1: 21 }).right, 'axisCap');
  const ring = rec('outline', [stroke('M 4 4 L 20 4 L 20 20 L 4 20 Z')]);
  assert.deepEqual(sideDefiners(ring, { x0: 3, y0: 3, x1: 21, y1: 21 }), { left: 'curve/edge', top: 'curve/edge', right: 'curve/edge', bottom: 'curve/edge' });
});

test('slantedBreaks lists only slanted-end sides the solid does not keep to 0.01', () => {
  // outline: one slanted stroke, box 3..21 both ways; solid: a filled square reaching one unit lower
  const P = [{ key: 'G/x-01', name: 'x-01', o: rec('outline', [stroke('M 4 4 L 20 20')]), s: rec('filled', [fill('M 3 3 L 21 3 L 21 22 L 3 22 Z')]) },
    { key: 'G/same', name: 'same', o: rec('outline', [stroke('M 4 4 L 20 20')]), s: rec('filled', [fill('M 3 3 L 21 3 L 21 21 L 3 21 Z')]) }];
  const br = slantedBreaks(P);
  assert.equal(br.length, 1);
  assert.equal(br[0].name, 'x-01'); assert.equal(br[0].side, 'bottom'); near(br[0].d, 1);
});

test('boxTests: opposite 0.007 moves hold the side test and break the width test', () => {
  const a = { x0: 0, y0: 0, x1: 10, y1: 10 };
  const t = boxTests(a, { x0: -0.007, y0: 0, x1: 10.007, y1: 10 });
  assert.equal(t.sides, true); assert.equal(t.xywh, false);
  const u = boxTests(a, { x0: 0.02, y0: 0, x1: 10.02, y1: 10 });
  assert.equal(u.sides, false); assert.equal(u.xywh, false);
  assert.deepEqual(boxTests(a, a), { d: { left: 0, top: 0, right: 0, bottom: 0 }, sides: true, xywh: true });
});

test('pairsOf sets aside solid-only, outline-only and duplicated names', () => {
  const C = [
    { group: 'G', name: 'a', records: [rec('outline', []), rec('filled', [])] },
    { group: 'G', name: 'b-alt', records: [rec('filled', [])] },
    { group: 'G', name: 'c', records: [rec('outline', [])] },
    { group: 'G', name: 'd', records: [rec('outline', []), rec('outline', []), rec('filled', [])] },
  ];
  const P = pairsOf(C);
  assert.deepEqual(P.pairs.map((p) => p.name), ['a']);
  assert.deepEqual(P.solidOnly, ['G/b-alt']); assert.deepEqual(P.outlineOnly, ['G/c']);
  assert.deepEqual(P.multi, [{ key: 'G/d', outlines: 2, solids: 1 }]);
});

test('recordCensus counts canvases, stroke attributes and corner smoothing', () => {
  const T = recordCensus([{ records: [rec('outline', [stroke('M 0 0 L 1 1'), stroke('M 2 2 L 3 3')]), rec('filled', [fill('M 0 0 L 1 0 L 1 1 Z')])] }]);
  assert.equal(T.drawings, 2); assert.deepEqual(T.canvas, { '24x24': 2 });
  assert.equal(T.strokePaths, 2); assert.equal(T.strokeDrawings, 1);
  assert.deepEqual(T.weight, { 2: 2 }); assert.deepEqual(T.cap, { ROUND: 2 }); assert.deepEqual(T.align, { CENTER: 2 });
  assert.deepEqual(T.smoothing, { 0.6: 3 }); assert.deepEqual(T.page, { '1:2': 2 });
});

// a fake reference directory: two concepts, one full raw dump with a NaN path, one sample dump
function fakeRefs() {
  const dir = tmp('untitled-probe-refs-');
  const fig = path.join(dir, 'untitled', 'figma'); fs.mkdirSync(path.join(fig, 'raw'), { recursive: true });
  const concept = (name, records) => ({ group: 'G', name, records });
  fs.writeFileSync(path.join(fig, 'g--a.json'), JSON.stringify(concept('a', [rec('outline', [stroke('M 4 4 L 20 20')], [3, 3, 21, 21]), rec('filled', [fill('M 3 3 L 21 3 L 21 21 L 3 21 Z')], [3, 3, 21, 21])])));
  fs.writeFileSync(path.join(fig, 'g--h.json'), JSON.stringify(concept('h', [rec('outline', [stroke('M 4 12 L 20 12')], [3, 11, 21, 13])])));
  fs.writeFileSync(path.join(fig, 'catalogue.json'), JSON.stringify({ rows: [] }));
  const drawing = (ds) => ({ nodes: [{ paths: ds.map((d) => ({ d })) }] });
  fs.writeFileSync(path.join(fig, 'raw', 'untitled-extract-0-2-aa.json'), JSON.stringify({ from: 0, to: 2, enumerated: 2, picked: ['G|a', 'G|h'], page: { id: '1:2', name: 'Fake' },
    concepts: [{ group: 'G', name: 'h', items: [{ style: 'outline', drawings: [drawing(['M 4 12 L 20 12'])] }, { style: 'filled', drawings: [drawing(['M 0 0 L 1 1', 'M 7 19 L NaN NaN'])] }] }] }));
  fs.writeFileSync(path.join(fig, 'raw', 'untitled-extract-0-1-bb.json'), JSON.stringify({ from: 0, to: 1, enumerated: 2, picked: ['G|a'], page: { id: '1:2', name: 'Fake' }, concepts: [] }));
  return dir;
}

test('rawDumps tells full reads from samples; nanPaths finds the NaN path and the record the ingest cut', () => {
  const refs = fakeRefs();
  const D = rawDumps(refs, 'untitled');
  assert.equal(D.filter((d) => d.full).length, 1);
  assert.deepEqual(D.filter((d) => !d.full).map((d) => d.picked), [['G|a']]);
  const N = nanPaths(D, loadConcepts(refs, 'untitled'));
  assert.equal(N.length, 1);
  assert.equal(N[0].key, 'G/h'); assert.equal(N[0].style, 'filled'); assert.equal(N[0].raw, 2); assert.equal(N[0].ingested, null);
});

// ── our side: a fake pin ──
const SVG = (m, sw, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
const area = (d) => `  <path d="${d}" stroke="none" fill="currentColor"/>`;
function fakePin() {
  const dir = tmp('untitled-probe-pin-');
  const W = { 24: [1.5, 2.5], 20: [1.5, 2], 16: [1.25, 2] };
  for (const m of [24, 20, 16]) {
    const d = path.join(dir, 'src', 'icons', String(m)); fs.mkdirSync(d, { recursive: true });
    const [wo, wf] = W[m], ho = wo / 2, hf = wf / 2;
    // a level bar, line-heavy: ends pulled in so the ends hold, the thickness grows (like `minus`); filled file declares it
    fs.writeFileSync(path.join(d, 'bar.svg'), SVG(m, wo, `  <path d="M${3 + ho} 8h${m - 6 - wo}"/>`));
    fs.writeFileSync(path.join(d, 'bar-filled.svg'), SVG(m, wf, `  <!-- grows: 0 0.5 0 0.5 -->\n  <path d="M${3 + hf} 8h${m - 6 - wf}"/>`));
    // a shape-filled square whose filled contour sits exactly on the outline's outer edge
    fs.writeFileSync(path.join(d, 'box.svg'), SVG(m, wo, '  <path d="M4 4h8v8H4z"/>'));
    fs.writeFileSync(path.join(d, 'box-filled.svg'), SVG(m, wo, area(`M${4 - ho} ${4 - ho}h${8 + wo}v${8 + wo}H${4 - ho}z`)));
    // a chevron whose filled legs are flatter
    fs.writeFileSync(path.join(d, 'chevron-x.svg'), SVG(m, wo, '  <path d="M4 6l4 3 4-3"/>'));
    fs.writeFileSync(path.join(d, 'chevron-x-filled.svg'), SVG(m, wf, '  <path d="M4.5 6.5l3.5 2.5 3.5-3"/>'));   // legs 35.5° and 40.6°
  }
  return dir;
}

// three flat chevrons whose filled legs move by different amounts, at every master
function flatPin() {
  const dir = tmp('untitled-probe-pin-');
  const filled = { '-2-large': 'M4.5 6.5l3.5 2.5 3.5-2.5', '-2-small': 'M4.5 6.5l3.5 2.5 3.5-3', '-2': 'M4.5 6.5l3.5 3 3.5-3' };
  for (const m of [24, 20, 16]) {
    const d = path.join(dir, 'src', 'icons', String(m)); fs.mkdirSync(d, { recursive: true });
    for (const [suf, fd] of Object.entries(filled)) {
      fs.writeFileSync(path.join(d, `chevron-x${suf}.svg`), SVG(m, 1.5, '  <path d="M4 6l4 3 4-3"/>'));
      fs.writeFileSync(path.join(d, `chevron-x${suf}-filled.svg`), SVG(m, 2.5, `  <path d="${fd}"/>`));
    }
  }
  return dir;
}

test('diagEnds counts slanted and square-on open ends', () => {
  const v = iconFromSource(SVG(24, 1.5, '  <path d="M4 6l4 3 4-3"/>'), { file: 'v.svg' });
  assert.deepEqual(diagEnds(v), { diag: 2, axis: 0 });
  const h = iconFromSource(SVG(24, 1.5, '  <path d="M4 6h8"/>'), { file: 'h.svg' });
  assert.deepEqual(diagEnds(h), { diag: 0, axis: 2 });
  const ring = iconFromSource(SVG(24, 1.5, '  <path d="M4 4h8v8H4z"/>'), { file: 'r.svg' });
  assert.deepEqual(diagEnds(ring), { diag: 0, axis: 0 });
});

test('oursPairs reads the pin: box differences, line-heavy, grows notes', () => {
  const pin = fakePin();
  const { names, rows, missing } = oursPairs(pin);
  assert.deepEqual(names, ['bar', 'box', 'chevron-x']); assert.equal(missing.length, 0); assert.equal(rows.length, 9);
  const at = (m, n) => rows.find((r) => r.m === m && r.n === n);
  near(at(24, 'bar').box, 0.5); near(at(20, 'bar').box, 0.25); near(at(16, 'bar').box, 0.375);
  assert.equal(at(24, 'bar').lineHeavy, true); assert.equal(at(24, 'bar').grows, true);
  near(at(24, 'box').box, 0); assert.equal(at(24, 'box').lineHeavy, false); assert.equal(at(24, 'box').grows, false);
  assert.equal(at(24, 'chevron-x').diag, 2); assert.equal(at(24, 'bar').diag, 0);
  const T = sideTable(rows);
  assert.equal(T['line-heavy | capAxis'].n, 12);         // a level bar: its caps reach all four sides, three masters
  assert.equal(T['line-heavy | capAxis'].hold, 6);       // its ends hold, its thickness does not
  assert.equal(T['line-heavy | capDiag'].n, 9);          // the chevron: slanted caps hold left, right and top; the bend holds the bottom
  assert.equal(T['shape-filled | curve/edge'].hold, 12); // the square holds all round
});

test('chevronRows: the mean leg angle of outline against filled', () => {
  const pin = fakePin();
  const cr = chevronRows(pin, ['bar', 'box', 'chevron-x']);
  assert.equal(cr.length, 3);
  const deg = (r) => r * 180 / Math.PI;
  const want = Math.abs(deg(Math.atan(3 / 4)) - (deg(Math.atan(2.5 / 3.5)) + deg(Math.atan(3 / 3.5))) / 2);   // mean of the legs, not the steeper one
  for (const r of cr) { assert.equal(r.fam, 'classic'); assert.equal(r.size, 'plain'); near(r.d, want, 1e-6); }
});

test('CLI: a section heading appears; an unknown section or a missing pin exits 2', () => {
  const pin = fakePin(), refs = fakeRefs();
  const out = execFileSync(process.execPath, [PROBE, pin, 's8', 's11', '--refs', refs], { encoding: 'utf8' });
  assert.match(out, /## §8 Our set/);
  assert.match(out, /\| Pairs holding the outer box to 0\.01 \| 3 of 9 \(33\.3%\) — 1 of 3 at each of 24, 20, 16 \|/);
  assert.match(out, /\| classic 45° \(`chevron-\*`\) \| 1 of 1, 1\.20–1\.20° \|/);
  assert.match(out, /## §11 /);
  // s9: large / small / plain go to the right labels (legs 36.87° against 35.54°, 38.07° and 40.60°)
  const s9 = execFileSync(process.execPath, [PROBE, flatPin(), 's9', '--refs', refs], { encoding: 'utf8' });
  assert.match(s9, /the 3 flat chevrons at 16 have filled legs flatter than their outlines by 1\.33° \(`-2-large`\), 1\.20° \(`-2-small`\) and 3\.73° \(plain\)/);
  assert.match(s9, /the flat family: 9 of its 9 pairs move more than 0\.5°/);
  assert.equal(spawnSync(process.execPath, [PROBE, pin, 'nope', '--refs', refs]).status, 2);
  assert.equal(spawnSync(process.execPath, [PROBE, path.join(pin, 'missing')]).status, 2);
  assert.equal(spawnSync(process.execPath, [PROBE, pin, '--bogus']).status, 2);
});
