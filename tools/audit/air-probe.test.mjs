// Tests for tools/audit/air-probe.mjs (card 1.7, docs/audit/findings-air.md).
// Synthetic fixtures only: hand-built paths and SVG texts, and a tiny fake pin in a temp
// directory. Nothing under src/icons or research/ is read.

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { region } from './raster.mjs';
import { iconFromSource } from './angles.mjs';
import { lintSource } from '../lint.mjs';
import {
  sampleBox, readAir, SITUATIONS, sweep, floorsOf, anyClearPixel, phasesClearAt, holdsWholePixel, verdict,
  airSpansOf, airMinOf, censusFile, isGapFamily, lintWithMeasured, elementsOf, measurePair, junctionsOf,
  contactCensus, junctionProbe, probeSet, lintPairDrops, partsOf, loadPin, gapCensus, lintRun, gapProof,
  diagSweep, airRead, airSpans,
} from './air-probe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = (m, w) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">`;
const svg = (m, w, ...paths) => `${ROOT(m, w)}\n${paths.map((d) => (d.startsWith('<') ? `  ${d}` : `  <path d="${d}"/>`)).join('\n')}\n</svg>\n`;
const area = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;
const drawing = (master, file, src) => ({ master, file, name: file.replace(/\.svg$/, ''), src });

test('sampleBox reads a filled shape soundly where raster.mjs classify does not (defect A1)', () => {
  const reg = region([{ d: 'M2 2.5H14V7.5H2Z', kind: 'area' }]);
  assert.equal(sampleBox(reg, 3, 7, 4, 8, 32), 0.5);
  assert.equal(sampleBox(reg, 3, 7.2, 4, 8, 64), 0.375);
  assert.equal(sampleBox(reg, 3, 3, 4, 4, 16), 1);
});

test('holdsWholePixel and verdict: axis, phase and the whole-pixel test', () => {
  assert.equal(holdsWholePixel(0, 1.5), true);
  assert.equal(holdsWholePixel(0.25, 1.5), false);
  assert.equal(holdsWholePixel(0.625, 1.5), true);
  assert.equal(holdsWholePixel(0, 0.88), false);
  const v = verdict([5, 11.25], [5, 12.75]);
  assert.deepEqual([v.axis, v.width, v.phase, v.wholePixel], ['vertical', 1.5, 0.25, false]);
  const h = verdict([7, 3], [8.5, 3]);
  assert.deepEqual([h.axis, h.width, h.phase, h.wholePixel], ['horizontal', 1.5, 0, true]);
  assert.equal(verdict([0, 0], [1, 1]).axis, 'diagonal');
  const late = verdict([5, 11.625], [5, 13.125]);                   // lower wall at 11.625: phase 0.625, and 12..13 fits
  assert.deepEqual([late.phase, late.wholePixel], [0.625, true]);
  assert.equal(verdict([11.75, 4], [13.25, 4]).phase, 0.75);
});

test('readAir: a 1.5 band is clear at phase 0, grey 0.25 at phase 0.25, and welds at no gap above zero', () => {
  const at = (g, ph, sit = 'parallel-run') => { const top = 7 + ph, c = SITUATIONS[sit](16, g, top); return readAir(c.paths, 16, 16, c.band, c.win); };
  assert.equal(at(1.5, 0).clearRow, true);
  assert.equal(at(1.5, 0.25).lightest, 0.25);
  assert.equal(at(1, 0.5).lightest, 0.5);
  assert.equal(at(0.125, 0.5).weld, false);
  assert.equal(at(1.5, 0.25, 'knockout').lightest, 0.25);           // a knockout reads like a run
  const caps = sweep({ situations: { 'facing-caps': SITUATIONS['facing-caps'] }, masters: [16], gaps: [1.5] });
  assert.equal(floorsOf(caps, 'facing-caps', 16).worst(1.5), 0.089);
  const mouth = sweep({ situations: { 'glyph-mouth': SITUATIONS['glyph-mouth'] }, masters: [16], gaps: [1, 1.5] });
  assert.deepEqual([floorsOf(mouth, 'glyph-mouth', 16).worst(1), floorsOf(mouth, 'glyph-mouth', 16).worst(1.5)], [0.311, 0.145]);   // an unevenly lit row reads by its darkest pixel
});

test('sweep + floorsOf: best-phase and every-phase floors of a parallel run', () => {
  const rows = sweep({ situations: { 'parallel-run': SITUATIONS['parallel-run'] }, masters: [16], gaps: [0.875, 1, 1.5, 1.75, 1.875, 2] });
  const f = floorsOf(rows, 'parallel-run', 16);
  assert.equal(f.best, 1);
  assert.equal(f.every, 1.875);
  assert.equal(f.clear(1.5), 5);
  assert.equal(f.worst(1.5), 0.25);
});

test('anyClearPixel: a 45-degree channel needs about sqrt(2); an axial one 1 at the right phase', () => {
  assert.equal(anyClearPixel(16, 1.0, 45, 0), false);
  assert.equal([0, 0.25, 0.5].some((o) => anyClearPixel(16, 1.5, 45, o)), true);
  assert.equal(anyClearPixel(16, 1.0, 0, 0.5), true);               // walls land on whole pixels (8 and 9)
  assert.equal(anyClearPixel(16, 1.0, 0, 0.375), false);
});

test('diagSweep: an axial channel clears at 1.0 by luck and 2.0 for certain; 45 degrees at 1.438 either way', () => {
  const D = diagSweep({ angles: [0, 45] });
  assert.deepEqual(D.map((x) => [x.deg, x.best, x.every, x.theory]), [[0, 1, 2, 1], [45, 1.438, 1.438, 1.414]]);
});

test('phasesClearAt: the 2x render clears a 1.0 gap at every phase, the 1x render at one', () => {
  assert.equal(phasesClearAt(1, 32), 8);
  assert.equal(phasesClearAt(1, 16), 1);
});

const RUN24 = svg(24, 1.5, 'M4 10.25H20', 'M4 13.25H20');           // 1.5 of air, walls on 11 and 12.5
test('airSpansOf: one pair span, at the ink edges, with its phase', () => {
  const rows = airSpansOf(drawing(24, 'two-lines.svg', RUN24));
  const pairs = rows.filter((r) => r.kind === 'pair');
  assert.equal(pairs.length, 1);
  assert.deepEqual([pairs[0].axis, pairs[0].width, pairs[0].phase, pairs[0].wholePixel], ['vertical', 1.5, 0, true]);
  const moved = airSpansOf(drawing(24, 'two-lines.svg', svg(24, 1.5, 'M4 10.5H20', 'M4 13.5H20'))).find((r) => r.kind === 'pair');
  assert.deepEqual([moved.phase, moved.wholePixel], [0.25, false]);
  const filled = airSpansOf(drawing(24, 'slot-filled.svg', svg(24, 1.5, area('M3 3H21V21H3ZM6 11.25H18V12.75H6Z'))));
  assert.ok(filled.some((r) => r.kind === 'facing-cut' && r.width === 1.5), 'a 1.5 cut reads as facing-cut 1.5');
});

test('airMinOf: an aligned 1.5 band holds a clear pixel, a quarter-off one does not', () => {
  const s = airSpansOf(drawing(24, 'a.svg', RUN24)).find((r) => r.kind === 'pair');
  const reg = region([{ d: 'M4 10.25H20', kind: 'stroke', weight: 1.5 }, { d: 'M4 13.25H20', kind: 'stroke', weight: 1.5 }]);
  assert.equal(airMinOf(reg, s).airMin, 0);
  const t = airSpansOf(drawing(24, 'b.svg', svg(24, 1.5, 'M4 10.5H20', 'M4 13.5H20'))).find((r) => r.kind === 'pair');
  const reg2 = region([{ d: 'M4 10.5H20', kind: 'stroke', weight: 1.5 }, { d: 'M4 13.5H20', kind: 'stroke', weight: 1.5 }]);
  assert.equal(airMinOf(reg2, t).airMin, 0.25);
  const ink = region([{ d: 'M6 11H7V13H6Z', kind: 'area' }]);           // column 6 inked, column 5 clear
  const r = airMinOf(ink, { p: [5.6, 11], q: [5.6, 12.5], width: 1.5, master: 24 });
  assert.deepEqual([r.airMin, r.airAt], [0, [5, 11]]);
});

test('airRead keeps every span under 2.0 (and only those) and reads each one\'s pixels', () => {
  const d = drawing(24, 'r.svg', svg(24, 1.5, 'M4 6.25H20', 'M4 9.25H20', 'M4 12.5H20', 'M4 16.5H20'));   // air 1.5, 1.75, 2.5
  const R = airRead(airSpans([d]), [d]);
  assert.deepEqual(R.map((r) => r.width).sort(), [1.5, 1.75]);
  assert.ok(R.every((r) => typeof r.airMin === 'number'));
});

test('airMinOf reads the open segment only: a pixel the span merely ends on is not read', () => {
  const ink = region([{ d: 'M5 5H7V6H5Z', kind: 'area' }]);           // pixels (5,5) and (6,5) solid, (7,5) clear
  assert.equal(airMinOf(ink, { p: [5, 5.5], q: [7, 5.5], width: 2, master: 24 }).airMin, 1);
});

test('censusFile: lint\'s readings kept, its skips recorded, its warnings reproduced', () => {
  // lint's `crosses` wants a proper crossing of the SAMPLED polylines (step 0.25), so the plus crosses off a sample
  const src = svg(24, 1.5, 'M4 10.25H20', 'M4 12.75H20', 'M12.1 4V8', 'M10 6.1H14', 'M4 20H8', 'M8 20V22', 'M16 14V20A1.25 1.25 0 0 0 18.5 20V14');
  const c = censusFile(24, 'test.svg', src);
  const kinds = c.rows.map((r) => r.kind);
  assert.ok(kinds.includes('pair-crossing'), 'the plus crosses');
  assert.ok(kinds.includes('pair-touching'), 'the corner touches');
  const near = c.rows.find((r) => r.kind === 'pair' && r.pathA === 1 && r.pathB === 2);
  assert.equal(near.value, 1);
  assert.equal(near.lintWouldWarn, true);
  assert.deepEqual(c.warnings, lintSource(24, 'test.svg', src).warnings.filter(isGapFamily));
  assert.ok(c.rows.some((r) => r.kind === 'facing' && r.sub === 'self' && r.suppressedBy === 'dot-or-open-single-subpath'), 'the U\'s mouth is left to 5b');
  const cut = svg(24, 1.5, area('M3 3H21V21H3ZM6 11.275H18V12.725H6Z'));       // a 1.45 cut: under lint's 1.49
  const cr = censusFile(24, 'cut-filled.svg', cut).rows.find((r) => r.sub === 'cut');
  assert.deepEqual([cr.value, cr.lintWouldWarn], [1.45, true]);
  assert.deepEqual(censusFile(24, 'cut-filled.svg', cut).warnings, lintSource(24, 'cut-filled.svg', cut).warnings.filter(isGapFamily));
  // §5f's second filter ("5b read this neck"): skip a facing reading only when 5b's own reading is no wider
  const kept = censusFile(24, 'k.svg', svg(24, 1.5, 'M8 4V16A1.75 1.75 0 0 0 11.5 16V4M14 4H20')).rows.find((r) => r.sub === 'self');
  assert.deepEqual([kept.value, kept.read5b, kept.suppressedBy], [1, 1.99, null]);
  const skipped = censusFile(24, 's.svg', svg(24, 1.5, 'M6 4V16A3 3 0 0 0 12 16V4M15 4V16A1.5 1.5 0 0 0 18 16V4')).rows.find((r) => r.sub === 'self');
  assert.deepEqual([skipped.value, skipped.read5b, skipped.suppressedBy], [1.5, 1.49, 'read5b']);
  const nan = censusFile(24, 'nan.svg', svg(24, 1.5, 'M4 4H8A1 1 0 0 1 8 4V10', 'M8 10H12'));
  const row = nan.rows.find((r) => r.unmeasurable);
  assert.ok(row && row.value === null, 'a zero-length arc gives an unmeasurable pair');
  const shaped = svg(24, 1.5, area('M3 3H21V21H3ZM6 11.25H18V12.75H6Z'), 'M12 1V2');
  assert.notDeepEqual(censusFile(24, 's-filled.svg', shaped, { trap: true }).rows.map((r) => r.value), censusFile(24, 's-filled.svg', shaped).rows.map((r) => r.value));
});

test('lintWithMeasured: the in-memory lint copy returns measured[] equal to the port\'s', async () => {
  const lint = await lintWithMeasured();
  const src = svg(24, 1.5, 'M4 10.25H20', 'M4 13.25H20', 'M4 17H20');
  assert.deepEqual(lint.lintSource(24, 'm.svg', src).measured, censusFile(24, 'm.svg', src).measured);
  assert.ok(lint.lintSource(24, 'm.svg', src).measured.length >= 2);
});

test('gapCensus, lintRun and gapProof: the port agrees with lint on a small set, and the trap is caught', async () => {
  const set = [
    drawing(24, 'near.svg', svg(24, 1.5, '<!-- keyline: mark -->', 'M4 10.25H20', 'M4 12.75H20')),   // exactly one warning
    drawing(24, 'near-filled.svg', svg(24, 2.5, 'M4 10.25H20', 'M4 14.25H20')),   // 1.5 of air at weight 2.5
    drawing(24, 'cut-filled.svg', svg(24, 1.5, area('M3 3H21V21H3ZM6 11.5H18V12.5H6Z'), 'M8 0.15H16')),   // 2.1 of air (unread); 1.6 under the trap
    drawing(24, 'cut.svg', svg(24, 1.5, 'M3 3H21V21H3Z')),
  ];
  const C = gapCensus(set), L = lintRun(set);
  assert.equal(C.files.length, 4);
  assert.deepEqual(C.rows.filter((r) => r.lintWouldWarn).map((r) => `${r.file} ${r.kind}${r.sub ? `:${r.sub}` : ''}`), ['near pair', 'cut-filled facing:cut']);
  assert.equal(L.drawings, 4);
  const res = [...L.results.values()];
  assert.equal(L.results.get('24/near.svg').warnings.length, 1);
  assert.deepEqual([L.failed, L.warned, L.clean, L.lines], [res.filter((r) => r.errors.length).length, res.filter((r) => !r.errors.length && r.warnings.length).length,
    res.filter((r) => !r.errors.length && !r.warnings.length).length, res.reduce((a, r) => a + r.warnings.length, 0)]);
  assert.equal(L.warned, 2);
  const P = await gapProof(set, C, L);
  assert.deepEqual([P.warnEq, P.measEq, P.files], [4, 4, 4]);
  assert.deepEqual([P.tried, P.caught], [1, 1]);
});

const contacts = (src, master = 24, file = 'c.svg') => {
  const icon = iconFromSource(src, { file, master });
  const els = elementsOf(icon), out = [];
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
    const m = measurePair(els[i], els[j]);
    if (m) out.push(...junctionsOf(els[i], els[j], m, master).map((x) => ({ ...x, a: els[i].id, b: els[j].id, name: file.slice(0, -4), master })));
  }
  return out;
};
test('junctionsOf: lands on, stops short, runs through, crosses, and reads a filled shape by depth', () => {
  const on = contacts(svg(24, 1.5, 'M4 12H20', 'M12 12V20'));
  assert.deepEqual(on.map((c) => [c.cls, c.overshoot]), [['T-on', 0]]);
  const short = contacts(svg(24, 1.5, 'M4 12H20', 'M12 12.5V20'));
  assert.deepEqual(short.map((c) => [c.cls, c.overshoot, c.metric]), [['T-short', -0.5, 'centreline']]);
  // the original census also files the overshooting end, which lies beside the bar, as a graze
  const far = contacts(svg(24, 1.5, 'M4 12H20', 'M12 13V20'));        // 1.0 short: still inside reach 1.5
  assert.deepEqual(far.map((c) => [c.cls, c.overshoot]), [['T-short', -1]]);
  const thru = contacts(svg(24, 1.5, 'M4 12H20', 'M12 11.5V20'));
  assert.deepEqual(thru.map((c) => [c.cls, c.overshoot]), [['T-through', 0.5], ['graze', -0.5]]);
  const plus = contacts(svg(24, 1.5, 'M4 12H20', 'M12 4V20'));
  assert.deepEqual(plus.map((c) => c.cls), ['cross']);
  assert.equal(plus[0].ambiguous, false);                          // shorter leg 8, past canvas/8 = 3
  const nearLeg = contacts(svg(24, 1.5, 'M4 12H20', 'M12 9.5V20'));   // shorter leg 2.5: past reach 1.5, under 3
  assert.deepEqual(nearLeg.map((c) => [c.cls, c.ambiguous]), [['cross', true]]);
  const midLeg = contacts(svg(24, 1.5, 'M4 12H20', 'M12 8V20'));      // shorter leg 4: a plain cross
  assert.deepEqual(midLeg.map((c) => [c.cls, c.ambiguous]), [['cross', false]]);
  const kiss = contacts(svg(24, 1.5, 'M4 12H10', 'M11.5 12H18'));    // caps exactly reach apart: dmin = reach
  assert.deepEqual(kiss.map((c) => [c.cls, c.dmin, c.reach]), [['graze', 1.5, 1.5]]);
  const depth = contacts(svg(24, 1.5, area('M4 4H20V12H4Z'), 'M12 11.25V20'), 24, 'd-filled.svg');
  assert.deepEqual(depth.filter((c) => c.metric === 'area-depth').map((c) => [c.cls, c.overshoot]), [['T-through', 0.75]]);
});

test('contactCensus, probeSet and junctionProbe: a through T shows, an exact T does not', () => {
  const set = [drawing(24, 'on.svg', svg(24, 1.5, 'M4 12H20', 'M12 12V20')), drawing(24, 'thru.svg', svg(24, 1.5, 'M4 12H20', 'M12 11.25V20'))];
  const C = contactCensus(set);
  assert.equal(C.failures.length, 0);
  assert.deepEqual(C.perFile.map((f) => f.grammar), ['T-on', 'T-through+graze']);
  const P = probeSet(C.primary);
  assert.deepEqual(P.map((p) => p.tag), ['T-through', 'control']);
  // a lid with a wall standing on it 1.5 in from its end: one junction, and the two caps seen again as a secondary
  const lid = contactCensus([drawing(24, 'lid.svg', svg(24, 1.5, 'M3.75 6.75H20.25', 'M5.25 6.75V18'))]);
  assert.deepEqual([lid.primary.length, lid.secondary.length, lid.perFile[0].contacts, lid.perFile[0].grammar], [1, 1, 1, 'T-on']);
  // probeSet spreads its controls: one every floor(n / 40) of the exact T-ons, in census order
  const many = [...Array.from({ length: 100 }, (_, i) => ({ cls: 'T-on', metric: 'centreline', overshoot: 0, who: 'A', i })), { cls: 'T-short', metric: 'centreline', overshoot: -0.5, who: 'A' }];
  const ps = probeSet(many);
  assert.equal(ps.filter((p) => p.tag === 'control').length, 50);
  assert.deepEqual(ps.filter((p) => p.tag === 'control').slice(0, 3).map((p) => p.i), [0, 2, 4]);
  const byName = Object.fromEntries(set.map((d) => [d.name, d.src]));
  assert.equal(junctionProbe(P.find((p) => p.tag === 'control'), byName.on).maxD, 0);
  assert.ok(junctionProbe(P.find((p) => p.tag === 'T-through'), byName.thru).maxD > 0.1);
});

test('lintPairDrops counts lint\'s crossing and touching skips', () => {
  const d = lintPairDrops([drawing(24, 'p.svg', svg(24, 1.5, 'M4 12.1H20', 'M12.1 4V20', 'M4 20H8', 'M8 20V22'))]);
  assert.deepEqual([d.pairs, d.crossing, d.touching, d.measured], [6, 1, 1, 4]);
  const close = lintPairDrops([drawing(24, 'c.svg', svg(24, 1.5, 'M4 12H10', 'M10.07 12H16'))]);   // 0.07 apart
  assert.deepEqual([close.touching, close.measured], [1, 0]);
  assert.equal(partsOf('x-filled.svg', svg(24, 1.5, area('M3 3H6V6Z'), 'M1 1H2'), 24).stroke, 1.5);
  assert.equal(partsOf('x-filled.svg', svg(24, 2.5, 'M1 1H2'), 24).stroke, 2.5);
});

test('CLI: sections print their headings on a fake pin; an unknown section and a missing pin exit 2', () => {
  const dir = mkdtempSync(join(tmpdir(), 'air-probe-'));
  try {
    for (const m of [24, 20, 16]) {
      mkdirSync(join(dir, 'src/icons', String(m)), { recursive: true });
      const w = m === 16 ? 1.25 : 1.5, c = m / 2;
      writeFileSync(join(dir, 'src/icons', String(m), 'bar.svg'), svg(m, w, `M3 ${c}H${m - 3}`, `M${c} ${c}V${m - 3}`, `M3 ${c - 3}H${m - 3}`));
      writeFileSync(join(dir, 'src/icons', String(m), 'bar-filled.svg'), svg(m, m === 24 ? 2.5 : 2, `M3 ${c}H${m - 3}`, `M${c} ${c}V${m - 3}`, `M3 ${c - 3}H${m - 3}`));
    }
    assert.equal(loadPin(dir).length, 6);
    const probe = join(HERE, 'air-probe.mjs');
    const ok = spawnSync('node', [probe, dir, 's0', 's3c', 's4a', 'p2'], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    for (const h of ['## §0 ', '## §3c ', '## §4a ', '## Part two']) assert.ok(ok.stdout.includes(h), `missing ${h}`);
    assert.match(ok.stdout, /primary junctions 6 /);
    const bad = spawnSync('node', [probe, dir, 'nope'], { encoding: 'utf8' });
    assert.equal(bad.status, 2);
    assert.match(bad.stderr, /unknown section/);
    assert.equal(spawnSync('node', [probe, join(dir, 'missing')], { encoding: 'utf8' }).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
