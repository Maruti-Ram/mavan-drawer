// Tests for wall-data.mjs (card 4.1). Synthetic fixtures only — no pin, no scratch paths.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { areaRegion, strokeRegion, rasterise } from './raster.mjs';
import { setFromTexts } from './families.mjs';
import {
  bfRasterise, gaussianKernel, squintPeak, subpathsOf, kindOf, fnv1a, drawingHash, measureFile, median, bandOf,
  identicalGroups, identicalSummary, shedDetail, checkListNames, buildWall, checkAgainstMass, TYPED_LISTS, HOSTED, VIEWS,
  DEFINITIONS, MASTERS, offcentreList,
} from './wall-data.mjs';

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} vs ${b} (tol ${tol})`);
const withCanvas = (reg, canvas) => ({ ...reg, canvas });
const svg = (m, body, sw = m === 16 ? 1.25 : 1.5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const area = (d) => `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`;

// ── the bypass: card 1.5 §1.1's closed forms ─────────────────────────────────────────────────────────────

test('bypass: a filled rectangle whose top and bottom edges fall mid-pixel (card 1.5 §1.1, first row)', () => {
  const reg = withCanvas(areaRegion(['M2 2.375H14V13.625H2Z']), 16);
  const { cov } = bfRasterise(reg, { px: 16, rate: 32 });
  near(cov[2 * 16 + 5], 0.625, 1e-9, 'row 2');
  near(cov[13 * 16 + 5], 0.625, 1e-9, 'row 13');
  near(cov[8 * 16 + 5], 1, 1e-9, 'inside');
  near(cov.reduce((a, b) => a + b, 0), 135, 1e-9, 'area');
});

test('bypass: edges with different fractions are each read, not cancelled (card 1.5 §1.1, second row)', () => {
  const reg = withCanvas(areaRegion(['M2 2.375H14V13.375H2Z']), 16);
  const { cov } = bfRasterise(reg, { px: 16, rate: 32 });
  near(cov[2 * 16 + 5], 0.625, 1e-9);
  near(cov[13 * 16 + 5], 0.375, 1e-9);
  near(cov.reduce((a, b) => a + b, 0), 132, 1e-9);
});

test('bypass: where raster.mjs\'s rasterise misreads a horizontal edge, the bypass does not', () => {
  // The plan's "Known instrument defects": rasterise settles a straddling box by its centre. The bypass must not.
  const reg = withCanvas(areaRegion(['M2 2.375H14V13.625H2Z']), 16);
  const by = bfRasterise(reg, { px: 16, rate: 32 }).cov[2 * 16 + 5];
  const rs = rasterise(reg, { px: 16, rate: 32 }).cov[2 * 16 + 5];
  near(by, 0.625, 1e-9);
  assert.notEqual(rs, by, 'if raster.mjs is fixed this test should be updated, not the bypass');
});

test('bypass: a 1.25 stroke at y 8.375 (the control row)', () => {
  const reg = withCanvas(strokeRegion(['M2 8.375H14'], 1.25), 16);
  const { cov } = bfRasterise(reg, { px: 16, rate: 32 });
  near(cov[7 * 16 + 6], 0.25, 1e-9);
  near(cov[8 * 16 + 6], 1, 1e-9);
  near(cov[9 * 16 + 6], 0, 1e-9);
});

test('bypass: a 24 canvas rendered at 16 px — one pixel is 1.5 units', () => {
  const reg = withCanvas(areaRegion(['M0 0H24V24H0Z']), 24);
  const { cov } = bfRasterise(reg, { px: 16, rate: 32 });
  assert.equal(cov.length, 256);
  for (const v of cov) near(v, 1, 1e-9);
  const half = withCanvas(areaRegion(['M0 0H24V12H0Z']), 24);
  const c2 = bfRasterise(half, { px: 16, rate: 32 }).cov;
  near(c2.reduce((a, b) => a + b, 0), 128, 1e-9, 'half the canvas is half the pixels');
});

// ── the squint ──────────────────────────────────────────────────────────────────────────────────────────

test('gaussianKernel: σ 1.5 reaches 5 either side (11 taps), is normalised and symmetric', () => {
  const k = gaussianKernel(1.5);
  assert.equal(k.length, 11);
  near(k.reduce((a, b) => a + b, 0), 1, 1e-12);
  for (let i = 0; i < 5; i++) near(k[i], k[10 - i], 1e-15);
  assert.ok(k[5] > k[4] && k[4] > k[0]);
  assert.equal(gaussianKernel(1).length, 7);
  assert.equal(gaussianKernel(2.5).length, 17);
});

test('squintPeak: solid stays 1 where the kernel fits, a lone pixel spreads, nothing is 0', () => {
  const px = 16, ones = new Float64Array(px * px).fill(1);
  near(squintPeak(ones, px), 1, 1e-12);
  const one = new Float64Array(px * px); one[8 * px + 8] = 1;
  const k = gaussianKernel(1.5);
  near(squintPeak(one, px), k[5] * k[5], 1e-12);
  assert.equal(squintPeak(new Float64Array(px * px), px), 0);
  // nothing outside the tile counts as ink, and the kernel is not re-normalised at the edge: a solid band five pixels
  // wide against the left edge peaks at its own middle (the five central weights), not at the edge
  const band = new Float64Array(px * px);
  for (let y = 0; y < px; y++) for (let x = 0; x < 5; x++) band[y * px + x] = 1;
  near(squintPeak(band, px), k[3] + k[4] + k[5] + k[6] + k[7], 1e-12);
});

// ── counting, kinds and hashes ──────────────────────────────────────────────────────────────────────────

test('subpathsOf: every moveto starts a subpath, relative or absolute', () => {
  assert.equal(subpathsOf('M2 2h4m0 6h4'), 2);
  assert.equal(subpathsOf('M1 1L2 2Z'), 1);
  assert.equal(subpathsOf('M0 0ZM1 1Z'), 2);
  assert.equal(subpathsOf('M1 8A7 7 0 1 0 15 8A7 7 0 1 0 1 8ZM7 7L9 9'), 2);
});

test('kindOf: mark before box before anchor, else silhouette (card 1.5 §1)', () => {
  assert.equal(kindOf('<!-- keyline: mark --><!-- box: 18x15 -->'), 'mark');
  assert.equal(kindOf('<!-- box: 18x15 -->'), 'box');
  assert.equal(kindOf('<!-- anchor: volume -->'), 'anchor');
  assert.equal(kindOf('<!-- a prose comment that mentions a box -->'), 'silhouette');
});

test('fnv1a: the published FNV-1a 32-bit vectors', () => {
  assert.equal(fnv1a(''), '811c9dc5');
  assert.equal(fnv1a('a'), 'e40c292c');
  assert.equal(fnv1a('foobar'), 'bf9cf968');
});

test('drawingHash: reads the d strings only — comments and paint attributes do not move it, a coordinate does', () => {
  const a = svg(16, '<!-- note --><path d="M2 8h12"/>');
  const b = svg(16, '<path stroke-width="1.25" d="M2 8h12"/>');
  const c = svg(16, '<path d="M2 8h11.875"/>');
  assert.equal(drawingHash(a), drawingHash(b));
  assert.notEqual(drawingHash(a), drawingHash(c));
  // the page hashes the manifest body the same way: the d strings joined with "|"
  assert.equal(drawingHash(svg(16, '<path d="M1 1h2"/> <path d="M3 3h4"/>')), fnv1a('M1 1h2|M3 3h4'));
});

test('measureFile: a round-capped line has length × weight plus one cap disc of ink', () => {
  const r = measureFile(svg(24, '<path d="M4 12H20"/>'), { px16: true });
  near(r.ink, 16 * 1.5 + Math.PI * 0.75 ** 2, 0.02);
  near(r.share, r.ink / 576, 1e-12);
  assert.equal(r.strokes, 1);
  assert.equal(r.paths, 1);
  assert.equal(r.kind, 'silhouette');
  assert.ok(r.squint > 0 && r.squint < 1);
  assert.ok(r.squint16 > 0 && r.squint16 < 1, 'the 24 master shown at 16 px gets its own squint');
  // … taken from a 16 px raster of the 24 drawing (the 1.5 line becomes 1 px), not from the 24 px one
  const reg = withCanvas(strokeRegion(['M4 12H20'], 1.5), 24);
  near(r.squint16, squintPeak(bfRasterise(reg, { px: 16, rate: 32 }).cov, 16), 1e-12);
  assert.ok(Math.abs(r.squint16 - r.squint) > 0.01, `${r.squint16} vs ${r.squint}`);
  assert.equal(measureFile(svg(16, '<path d="M4 8H12"/>')).squint16, undefined);
});

test('measureFile: a filled shape with a cut-out counts both subpaths and only the ring of ink — edges mid-pixel, so the bypass is what reads them', () => {
  const r = measureFile(svg(16, area('M2 2.375H14V13.625H2ZM5 5.5H11V10.5H5Z')));
  near(r.ink, 135 - 30, 1e-9);
  assert.equal(r.strokes, 2);
  assert.equal(r.paths, 1);
});

// ── rows and bands ──────────────────────────────────────────────────────────────────────────────────────

test('median: odd and even counts', () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([]), null);
});

test('bandOf: card 1.5\'s edges, each edge belonging to the band above it', () => {
  assert.equal(bandOf(0.4999, 1), 'Hairline');
  assert.equal(bandOf(0.5, 1), 'Light');
  assert.equal(bandOf(0.75, 1), 'Level');
  assert.equal(bandOf(1.2499, 1), 'Level');
  assert.equal(bandOf(1.25, 1), 'Full');
  assert.equal(bandOf(1.5, 1), 'Dense');
  assert.equal(bandOf(97.6, 48.8), 'Dense');
});

const tiny = () => {
  const t = {};
  for (const m of MASTERS) {
    const s = m / 24, c = m / 2;
    const plus = `M${c - 7 * s} ${c}h${14 * s}M${c} ${c - 7 * s}v${14 * s}`;
    const small = `M${c - 4 * s} ${c}h${8 * s}M${c} ${c - 4 * s}v${8 * s}`;
    const sq = `M${3 * s} ${3 * s}H${21 * s}V${21 * s}H${3 * s}Z`;
    t[`${m}/plus`] = svg(m, `<!-- keyline: mark --><!-- tags: add --><path d="${plus}"/>`);
    t[`${m}/plus-filled`] = svg(m, `<!-- tags: add --><path stroke-width="2" d="${plus}"/>`);   // no note: kind must come from the outline
    t[`${m}/plus-small`] = svg(m, `<!-- keyline: mark --><!-- tags: add --><path d="${small}"/>`);
    t[`${m}/plus-small-filled`] = svg(m, `<!-- keyline: mark --><!-- tags: add --><path stroke-width="2" d="${small}"/>`);
    t[`${m}/square`] = svg(m, `<path d="${sq}"/>`);
    t[`${m}/square-filled`] = svg(m, area(sq));
    // a container family (C18): a ring with a plus, and its -small with a smaller plus — card 1.10 keeps it apart from `plus`
    const ring = `M${c - 9 * s} ${c}A${9 * s} ${9 * s} 0 1 0 ${c + 9 * s} ${c}A${9 * s} ${9 * s} 0 1 0 ${c - 9 * s} ${c}Z`;
    const disc = (h) => `${ring}M${c - h * s} ${c - h * s}H${c + h * s}V${c + h * s}H${c - h * s}Z`;
    t[`${m}/plus-circle`] = svg(m, `<path d="${ring}"/><path d="M${c - 4 * s} ${c}h${8 * s}M${c} ${c - 4 * s}v${8 * s}"/>`);
    t[`${m}/plus-circle-filled`] = svg(m, area(disc(4)));
    t[`${m}/plus-circle-small`] = svg(m, `<path d="${ring}"/><path d="M${c - 2.5 * s} ${c}h${5 * s}M${c} ${c - 2.5 * s}v${5 * s}"/>`);
    t[`${m}/plus-circle-small-filled`] = svg(m, area(disc(2.5)));
    // square-2 is square's drawing under another name at 16 only, and shares its tags
    t[`${m}/square-2`] = svg(m, m === 16 ? `<path d="${sq}"/>` : `<path d="${sq}M${c} ${3 * s}V${21 * s}"/>`);
    t[`${m}/square-2-filled`] = svg(m, area(sq));
  }
  return setFromTexts(t);
};

test('identicalGroups / identicalSummary: the same d under two names, per master and style', () => {
  const set = tiny();
  const g = identicalGroups(set);
  assert.deepEqual(g['16/outline'], [['square', 'square-2']]);
  assert.deepEqual(g['24/outline'], []);
  assert.deepEqual(g['24/filled'], [['square', 'square-2']]);
  assert.deepEqual(identicalSummary(g), { sets: 1, groups: 4, files: 8 });
});

test('shedDetail: a concept that loses a subpath at a smaller master sheds; one that adds gains; a steady one is neither', () => {
  const row = (a, b, c) => ({ outline: { 24: { strokes: a }, 20: { strokes: b }, 16: { strokes: c } } });
  const rows = { a: row(3, 3, 3), b: row(4, 3, 3), c: row(5, 5, 6), d: row(2, 2, 1) };
  assert.deepEqual(shedDetail(['a', 'b', 'c', 'd'], rows), { shed: ['b', 'd'], gain: ['c'] });
});

test('checkListNames: a list naming a concept the set does not have is reported', () => {
  const lists = [{ id: 'x', groups: [['a', 'b']] }, { id: 'y', byStyle: { outline: [['a', 'zz']] } }, { id: 'z', perView: { '16/outline': [['q']] } }];
  assert.deepEqual(checkListNames(lists, ['a', 'b']), ['y: zz', 'z: q']);
});

// ── the whole file ──────────────────────────────────────────────────────────────────────────────────────

test('buildWall: records the pin and the command, every concept at every view, bands, lists; the raw rows stay out of the JSON', () => {
  const set = tiny();
  const w = buildWall(set, { commit: 'abc1234', generated: '2026-10-08', typed: [] });
  assert.equal(w.pin.commit, 'abc1234');
  assert.equal(w.pin.concepts, 6);
  assert.equal(w.pin.files, 36);
  assert.match(w.generator, /^node tools\/audit\/wall-data\.mjs /);
  assert.match(w.pinCommand, /git archive abc1234/);
  assert.equal(w.generated, '2026-10-08');
  assert.deepEqual(w.views.map((v) => v.id), ['16', '20', '24', '24@16']);
  assert.deepEqual(Object.keys(w.definitions).sort(), Object.keys(DEFINITIONS).sort());
  assert.equal(w.concepts.length, 6);
  for (const c of w.concepts) for (const style of ['outline', 'filled']) for (const m of ['24', '20', '16']) {
    const r = c[style][m];
    assert.ok(r.ink > 0 && r.share > 0 && r.squint > 0 && r.strokes >= 1 && r.paths >= 1, `${c.name} ${style} ${m}`);
    assert.ok(['Hairline', 'Light', 'Level', 'Full', 'Dense'].includes(r.band));
    assert.match(r.hash, /^[0-9a-f]{8}$/);
    assert.equal(m === '24' ? typeof r.squint16 : r.squint16, m === '24' ? 'number' : undefined);
  }
  const plus = w.concepts.find((c) => c.name === 'plus');
  assert.equal(plus.family, 'plus');
  assert.equal(w.concepts.find((c) => c.name === 'plus-small').family, 'plus', 'size taken off: one family');
  // card 1.10's partition, not card 1.9's: the ring keeps its own family (C18), so three stems, not two
  assert.equal(w.concepts.find((c) => c.name === 'plus-circle').family, 'plus-circle');
  assert.equal(w.concepts.find((c) => c.name === 'plus-circle-small').family, 'plus-circle');
  assert.deepEqual(Object.keys(w.families), ['plus', 'plus-circle', 'square']);
  assert.deepEqual(w.families['plus-circle'], ['plus-circle', 'plus-circle-small']);
  assert.equal(plus.outline['16'].kind, 'mark');
  assert.equal(plus.filled['16'].kind, 'mark', 'kind is read from the outline file and holds for the filled');
  assert.equal(w.concepts.find((c) => c.name === 'square').outline['24'].kind, 'silhouette');
  // the lists computed from the cards' definitions
  const list = (id) => w.lists.find((l) => l.id === id);
  assert.deepEqual(list('marks').perView['16/outline'], [['plus', 'plus-small']]);
  assert.deepEqual(list('identical').perView['24@16/filled'], [['square', 'square-2']], '24 forced to 16 shows the 24 master\'s groups');
  assert.deepEqual(list('identical').perView['16/outline'], [['square', 'square-2']]);
  assert.deepEqual(list('identical').perView['24@16/outline'], [], 'the 24 drawn at 16 px is still the 24 drawing: square-2 keeps its divider there');
  assert.ok(list('same-tags').groups.some((g) => g.includes('square') && g.includes('square-2')), 'square and square-2: a run whose two members carry the same (no) tags');
  assert.deepEqual(list('shed').groups, [['square-2']], 'square-2 drops its divider at 16');
  assert.deepEqual(list('container-smalls').groups, [['plus-circle', 'plus-circle-small']], 'card 1.10 E-1: the ring beside its -small');
  for (const id of ['dense', 'hairline']) for (const v of VIEWS) for (const s of ['outline', 'filled']) assert.ok(Array.isArray(list(id).perView[`${v.id}/${s}`][0]));
  // the unrounded measurements are carried for the check, never written
  assert.ok(w.raw.plus.outline['16'].ink > 0);
  assert.equal(JSON.parse(JSON.stringify(w)).raw, undefined);
});

test('buildWall: a typed list that names a concept the pin does not have is refused', () => {
  assert.throws(() => buildWall(tiny(), { generated: 'x', typed: [{ id: 't', groups: [['plus', 'not-a-concept']] }] }), /not-a-concept/);
});

test('buildWall: bands are read against the row median of that master and style', () => {
  const w = buildWall(tiny(), { generated: 'x', typed: [] });
  const at = (n) => w.concepts.find((c) => c.name === n).filled['16'];
  // a row of six at 16 filled: two plus marks at weight 2, two discs with a square cut, two solid 12 × 12 squares (144)
  const inks = ['plus', 'plus-small', 'plus-circle', 'plus-circle-small', 'square', 'square-2'].map((n) => at(n).ink).sort((a, b) => a - b);
  const med = (inks[2] + inks[3]) / 2;
  near(w.medians['16/filled'], med, 0.01);
  for (const n of ['plus', 'plus-small', 'plus-circle', 'plus-circle-small', 'square', 'square-2']) {
    const r = at(n).ink / med;
    const want = r < 0.5 ? 'Hairline' : r < 0.75 ? 'Light' : r < 1.25 ? 'Level' : r < 1.5 ? 'Full' : 'Dense';
    assert.equal(at(n).band, want, `${n}: ${at(n).ink} ÷ ${med}`);
  }
  assert.equal(at('plus-small').band, 'Hairline', 'a small mark beside discs and solid squares');
  const dense = w.lists.find((l) => l.id === 'dense').perView['16/filled'][0];
  assert.deepEqual(dense, ['plus-circle', 'plus-circle-small', 'square', 'square-2'].filter((n) => at(n).band === 'Dense'));
});

test('offcentreList: card 1.11\'s classifier on a built pin — an off-centre drawing with no reason is listed, a stated reason is not', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'wall-pin-'));
  try {
    const box = 'M3.75 3.75H19.25V20.25H3.75Z';                         // ink x 3 … 20: centre 11.5, half a unit left
    const icons = { 24: {}, 20: {}, 16: {} };
    for (const name of ['bug', 'watch-2']) {
      mkdirSync(join(dir, 'src/icons/24'), { recursive: true });
      writeFileSync(join(dir, 'src/icons/24', `${name}.svg`), svg(24, `<path d="${box}"/>`));
      icons[24][name] = { paths: [box], areas: [], stroke: 1.5, ink: { x: 3, y: 3, w: 17, h: 18 }, shift: [0, 0], tags: [] };
    }
    mkdirSync(join(dir, 'dist'));
    writeFileSync(join(dir, 'dist/icons.json'), JSON.stringify(icons));
    const l = await offcentreList(dir);
    assert.deepEqual(l.perView['24/outline'], [['bug']], 'watch-2 at 24 carries a stated reason (STATED_REASON)');
    assert.deepEqual(l.perView['24@16/outline'], [['bug']], 'the 24 forced to 16 is the 24 drawing');
    assert.deepEqual(l.perView['16/outline'], [[]]);
    assert.match(l.notes['24/outline/bug'], /-0\.5, \+0 off the canvas centre/);
    assert.deepEqual(l.summary, { offCentre: 2, anchored: 0, stated: 1, unjudged: 1 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('checkAgainstMass: reads appendix A only; agrees, calls a rounding tie a tie, and reports a real difference', () => {
  const wall = {
    concepts: [{ name: 'a', outline: { 16: { kind: 'mark' } }, filled: {} }, { name: 'b', outline: { 16: { kind: 'silhouette' } }, filled: {} }],
    raw: {
      a: { outline: { 24: { share: 0.0674981 }, 20: { share: 0.1 }, 16: { share: 0.2, ink: 51.2, squint: 0.355, band: 'Level' } },
        filled: { 24: { share: 0.3 }, 20: { share: 0.3 }, 16: { share: 0.4, ink: 102.4, squint: 0.9, band: 'Full' } } },
      b: { outline: { 24: { share: 0.1 }, 20: { share: 0.1 }, 16: { share: 0.2, ink: 51.2, squint: 0.4, band: 'Level' } },
        filled: { 24: { share: 0.3 }, 20: { share: 0.3 }, 16: { share: 0.4, ink: 102.4, squint: 0.9, band: 'Full' } } },
    },
  };
  const doc = [
    '| `a` | mark | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | H | H | 0.1 | 0.1 |  |',   // before appendix A: ignored
    '## Appendix A. The full census',
    '| `a` | mark | 6.8 | 10.0 | 20.0 | 51.2 | 30.0 | 30.0 | 40.0 | 102.4 | 2.96 | Lv | F | 0.36 | 0.90 |  |',
    '| `b` | silhouette | 10.0 | 10.0 | 20.0 | 51.2 | 30.0 | 30.0 | 40.0 | 102.4 | 2.00 | Lv | F | 0.45 | 0.90 |  |',
    '## Appendix B. Something else',
    '| `b` | x | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |  |',
  ].join('\n');
  const r = checkAgainstMass(doc, wall);
  assert.equal(r.rows, 2);
  assert.equal(r.columns.O24.agree, 1);
  assert.equal(r.columns.O24.ties.length, 1, '6.74981% printed 6.7 here and 6.8 there is a tie');
  assert.equal(r.columns.O24.differ.length, 0);
  assert.equal(r.columns.squintO16.ties.length, 1, '0.355 is a tie between 0.35 and 0.36');
  assert.equal(r.columns.squintO16.differ.length, 1, '0.40 against 0.45 is a real difference');
  assert.equal(r.columns.kind.agree, 2);
  assert.equal(r.columns.bandO16.agree, 2);
});

// ── the typed content ───────────────────────────────────────────────────────────────────────────────────

test('TYPED_LISTS: each carries an id, its card, a label, a question and a cited document line', () => {
  const ids = new Set();
  for (const l of TYPED_LISTS) {
    assert.ok(!ids.has(l.id), `duplicate id ${l.id}`); ids.add(l.id);
    assert.match(l.card, /^\d\.\d+$/);
    assert.ok(l.label && l.question);
    assert.match(l.source, /docs\/audit\/[\w-]+\.md:\d+/);
    const groups = l.groups ?? Object.values(l.byStyle ?? {}).flat();
    assert.ok(groups.length && groups.every((g) => g.length >= 1));
  }
  // card 1.5 §6: ten outline seed pairs and six filled
  const seed = TYPED_LISTS.find((l) => l.id === 'seed');
  assert.equal(seed.byStyle.outline.length, 10);
  assert.equal(seed.byStyle.filled.length, 6);
  // card 1.5 §3.4: eight crowded drawings
  assert.equal(TYPED_LISTS.find((l) => l.id === 'crowded').byStyle.outline[0].length, 8);
  assert.equal(TYPED_LISTS.find((l) => l.id === 'crowded').byStyle.filled, undefined, 'card 1.5 measured crowding on the outline only');
});

test('HOSTED: every hosted question cites a document line and says how the page hosts it', () => {
  for (const h of HOSTED) {
    assert.match(h.source, /docs\/audit\/[\w-]+\.md:\d+/);
    assert.ok(h.question && h.how);
  }
});

test('VIEWS: each master at its own size, and the 24 forced to 16 px', () => {
  assert.deepEqual(VIEWS.map((v) => [v.master, v.px]), [[16, 16], [20, 20], [24, 24], [24, 16]]);
});
