// Tests for tools/audit/sf-probe.mjs — synthetic fixtures only (hand-built names, maps, outlines, templates,
// a tiny fake pin and fake reference / metadata folders). Run: node --test tools/audit/sf-probe.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  roles, signature, grammar, modifierClass, flatContours, outerBox, cbox, exactBounds, rawContours,
  sameUpToTranslation, sameUpToScale, contourReuse, ringWall, templateLayers, samplePath, haloOffset,
  ourParents, readStrings, readPlist, readAnyStrings, fx, pyRound, percentile, precedence, boxGrows,
  inPlace, scaledCopy, placeShares, cornerOffsets, sameAdvance, onTopTally, pcDoc, HALO_BAND, REGULAR_STROKE, inHaloBand,
  ENC_ENDS, isContainerName, LOCALE_SUFFIXES, isLocaleVariant, ALIAS_LOCALE, releaseYear, FIRST_YEAR, YEARS, WALL_SCALES,
} from './sf-probe.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROBE = path.join(HERE, 'sf-probe.mjs');
const K = 0.5523;
/** a circle as four cubics (font ops, y up), centre (cx, cy), radius r, counter-clockwise when ccw */
const circleOps = (cx, cy, r, ccw = false) => {
  const k = K * r;
  const pts = ccw
    ? [['M', cx + r, cy], ['C', cx + r, cy - k, cx + k, cy - r, cx, cy - r], ['C', cx - k, cy - r, cx - r, cy - k, cx - r, cy], ['C', cx - r, cy + k, cx - k, cy + r, cx, cy + r], ['C', cx + k, cy + r, cx + r, cy + k, cx + r, cy]]
    : [['M', cx + r, cy], ['C', cx + r, cy + k, cx + k, cy + r, cx, cy + r], ['C', cx - k, cy + r, cx - r, cy + k, cx - r, cy], ['C', cx - r, cy - k, cx - k, cy - r, cx, cy - r], ['C', cx + k, cy - r, cx + r, cy - k, cx + r, cy]];
  return [...pts, ['Z']];
};
const squareOps = (x0, y0, s) => [['M', x0, y0], ['L', x0 + s, y0], ['L', x0 + s, y0 + s], ['L', x0, y0 + s], ['Z']];

test('roles and signature: the card\'s token grammar', () => {
  assert.equal(signature(roles('circle.fill')), 'ENCL.FILL');
  assert.equal(signature(roles('badge.plus.fill')), 'BADGE.GLYPH.FILL');
  assert.equal(signature(roles('fill.badge.person.plus')), 'FILL.BADGE.GLYPH');       // glyph words collapse to one GLYPH
  assert.equal(signature(roles('badge.person.crop')), 'BADGE.GLYPH.QUAL');            // a qualifier word ends the glyph
  assert.equal(signature(roles('slash.circle')), 'SLASH.ENCL');
  assert.equal(signature(roles('arrow.trianglehead.clockwise.rotate.90')), 'ROT.ROT.ROT.ROT.ROT');
  assert.equal(signature(roles('badge.arrow.up')), 'BADGE.GLYPH');                   // arrow after a badge is a glyph word
  assert.deepEqual(roles('ring'), [['OTHER', 'ring']]);
  assert.deepEqual(roles('badge.plus.slash.ring').map(([r]) => r), ['BADGE', 'GLYPH', 'SLASH', 'OTHER']);   // a slash ends the badge's glyph words
  assert.deepEqual(roles('rectangle.stack.fill').map(([r]) => r), ['ENCL', 'QUAL', 'FILL']);
});

test('grammar and modifierClass: only <base>.<suffix> derivatives are rows; classes as §3.1', () => {
  const g = grammar({ bell: ['bell.fill', 'bell.slash', 'bell.badge.plus'], 'arrow.down.to.line.compact': ['arrow.down.to.line.circle'] });
  assert.equal(g.rows.length, 3);
  assert.equal(g.der2base.get('arrow.down.to.line.circle'), 'arrow.down.to.line.compact');
  assert.equal(modifierClass('FILL'), 'fill');
  assert.equal(modifierClass('ENCL.FILL'), 'enclosure+fill');
  assert.equal(modifierClass('BADGE.GLYPH.FILL'), 'badge+fill');
  assert.equal(modifierClass('SLASH.FILL.ENCL'), 'slash+fill+enclosure');
  assert.equal(modifierClass('FILL.BADGE.GLYPH'), 'fill+badge');
  assert.equal(modifierClass('ROT.ROT'), 'rotate-arrow');
  assert.equal(modifierClass('QUAL'), 'other:QUAL');
});

test('outline geometry: flattened contours, the largest contour\'s box, the ink box, exact bounds', () => {
  const ops = [...circleOps(1000, 1000, 1020), ...circleOps(1000, 1000, 850, true), ...squareOps(900, 900, 100)];
  assert.equal(flatContours(ops, 6).length, 3);
  assert.equal(flatContours(ops, 6)[0].length, 1 + 4 * 6);
  const b = outerBox(ops, 6);
  assert.deepEqual(b.map(Math.round), [-20, -20, 2020, 2020]);
  assert.deepEqual(cbox(ops).map(Math.round), [-20, -20, 2020, 2020]);
  const e = exactBounds(ops);
  assert.ok(Math.abs(e[2] - e[0] - 2040) < 1e-6);
  const w = ringWall([...circleOps(1000, 1000, 1020), ...circleOps(1000, 1000, 850, true)]);
  assert.ok(Math.abs(w.wall - 170) < 1e-6 && Math.abs(w.outer - 2040) < 1e-6);
});

test('outerBox: the largest contour by box area, width × height', () => {
  const rect = (x0, y0, x1, y1) => [['M', x0, y0], ['L', x1, y0], ['L', x1, y1], ['L', x0, y1], ['Z']];
  assert.deepEqual(outerBox([...rect(0, 500, 100, 1500), ...rect(0, 0, 300, 200)]), [0, 500, 100, 1500]);   // 100 × 1000 beats 300 × 200
  assert.deepEqual(outerBox([...rect(0, 0, 300, 200), ...rect(400, 500, 500, 1500)]), [400, 500, 500, 1500]);
});

test('contour reuse: translation, scale, reversal and a miss', () => {
  const a = rawContours(squareOps(0, 0, 100))[0];
  assert.ok(sameUpToTranslation(a, rawContours(squareOps(50, 20, 100))[0]));
  assert.ok(sameUpToTranslation(a, [...rawContours(squareOps(50, 20, 100))[0]].reverse()));
  assert.equal(sameUpToTranslation(a, rawContours(squareOps(0, 0, 110))[0]), null);
  const s = sameUpToScale(a, rawContours(squareOps(10, 10, 200))[0]);
  assert.ok(s && Math.abs(s.s - 2) < 1e-9);
  const tri = [['M', 0, 0], ['L', 40, 0], ['L', 0, 30], ['Z']];
  const r = contourReuse([...squareOps(0, 0, 100), ...squareOps(300, 0, 50), ...tri], [...squareOps(10, 0, 100), ...circleOps(0, 0, 40)]);
  assert.deepEqual(r.map((x) => x && x.kind), ['T', 'S', null]);
});

test('templates: layers of one master, svgpathtools-style sampling, the halo offset', () => {
  const ring = (r) => `M${50 - r} 50C${50 - r} ${50 - K * r} ${50 - K * r} ${50 - r} 50 ${50 - r}C${50 + K * r} ${50 - r} ${50 + r} ${50 - K * r} ${50 + r} 50C${50 + r} ${50 + K * r} ${50 + K * r} ${50 + r} 50 ${50 + r}C${50 - K * r} ${50 + r} ${50 - r} ${50 + K * r} ${50 - r} 50Z`;
  const text = `<svg><g id="Regular-S"><path class="monochrome-0 x" d="${ring(25)}"/><path class="monochrome-1 y" d="${ring(20)}"/></g><g id="Black-S"><path class="monochrome-0" d="M0 0h1"/></g></svg>`;
  const L = templateLayers(text, 'Regular-S');
  assert.equal(L.length, 2);
  assert.match(L[0][0], /monochrome-0/);
  assert.equal(templateLayers(text, 'Black-S').length, 1);
  const pts = samplePath(ring(20));
  assert.equal(pts.length, Math.max(50, Math.floor((2 * Math.PI * 20) / 0.15)));
  const off = haloOffset(L[0][1], L[1][1]);
  assert.ok(Math.abs(off.median - 5) < 0.05, `median ${off.median}`);
  assert.equal(samplePath('M0 0L1 0').length, 50);
  assert.equal(samplePath('M0 0L10 0L10 10Z').length, Math.floor((20 + Math.SQRT2 * 10) / 0.15));   // the closing line counts
  const ringAt = (cx, r) => `M${cx - r} 50C${cx - r} ${50 - K * r} ${cx - K * r} ${50 - r} ${cx} ${50 - r}C${cx + K * r} ${50 - r} ${cx + r} ${50 - K * r} ${cx + r} 50C${cx + r} ${50 + K * r} ${cx + K * r} ${50 + r} ${cx} ${50 + r}C${cx - K * r} ${50 + r} ${cx - r} ${50 + K * r} ${cx - r} 50Z`;
  const shifted = haloOffset(ringAt(51, 25), ringAt(50, 20));          // offset runs 4 … 6 round the ring: the median, not the minimum
  assert.ok(Math.abs(shifted.median - 5) < 0.1 && shifted.min < 4.1, JSON.stringify(shifted));
});

test('ourParents: C9 numbers, C8 sizes, modifier-style names, roots and two-prefix names', () => {
  const names = ['check', 'check-2', 'check-small', 'check-2-small', 'check-circle', 'users', 'users-2', 'users-2-behind', 'orphan-3', 'zeta'];
  const { kinds, parent, amb } = ourParents(names);
  assert.equal(kinds.get('check-2'), 'number'); assert.equal(parent.get('check-2'), 'check');
  assert.equal(kinds.get('check-small'), 'size');
  assert.equal(kinds.get('check-2-small'), 'size+number');
  assert.equal(kinds.get('check-circle'), 'modifier');
  assert.equal(kinds.get('users-2-behind'), 'modifier'); assert.equal(parent.get('users-2-behind'), 'users-2');
  assert.equal(kinds.get('orphan-3'), 'number-orphan');
  assert.equal(kinds.get('zeta'), 'root');
  assert.deepEqual(amb, [['users-2-behind', ['users', 'users-2']]]);
  const big = ourParents(['check', 'check-large', 'check-2', 'check-2-large']).kinds;            // the other size word
  assert.equal(big.get('check-large'), 'size'); assert.equal(big.get('check-2-large'), 'size+number');
});

test('the card\'s word lists, member by member: grammar roles, container endings, locale suffixes, release years, wall scales', () => {
  for (const t of ['circle', 'square', 'rectangle', 'capsule', 'diamond', 'triangle', 'hexagon', 'seal', 'shield', 'bubble', 'app', 'icloud', 'viewfinder']) {
    assert.deepEqual(roles(t), [['ENCL', t]], t); assert.deepEqual(roles(`badge.${t}`)[1], ['ENCL', t], `badge.${t}`);
  }
  for (const t of ['portrait', 'stack', 'on', 'crop', 'video']) { assert.deepEqual(roles(t), [['QUAL', t]], t); assert.deepEqual(roles(`badge.${t}`)[1], ['QUAL', t]); }
  for (const t of ['dotted', 'inverse', 'half', 'filled']) { assert.deepEqual(roles(t), [['STYLE', t]], t); assert.deepEqual(roles(`badge.${t}`)[1], ['STYLE', t]); }
  assert.deepEqual(roles('fill'), [['FILL', 'fill']]);                                     // STYLE lists fill too, but the FILL test comes first
  for (const t of ['arrow', 'trianglehead', 'clockwise', 'counterclockwise', 'rotate', '90', '2']) assert.deepEqual(roles(t), [['ROT', t]], t);
  assert.deepEqual(roles('badge.arrow'), [['BADGE', 'badge'], ['GLYPH', 'arrow']]);         // after a badge a rotation word is the badge's glyph
  assert.deepEqual(roles('ring'), [['OTHER', 'ring']]);
  assert.deepEqual(ENC_ENDS, ['.circle', '.square', '.rectangle', '.diamond', '.capsule', '.shield', '.app', '.seal', '.hexagon', '.triangle', '.bubble']);
  for (const e of ENC_ENDS) { assert.ok(isContainerName(`x${e}`), e); assert.ok(!isContainerName(`x${e}.fill`), `${e}.fill`); }
  assert.ok(!isContainerName('x.icloud') && !isContainerName('x.viewfinder'), 'two grammar containers are not §3.4 endings');
  const loc = ['ar', 'he', 'hi', 'ja', 'ko', 'th', 'zh', 'rtl', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'si', 'sat', 'mni'];
  assert.equal(LOCALE_SUFFIXES.size, 20);
  for (const l of loc) assert.ok(isLocaleVariant(`globe.fill.${l}`), l);
  assert.ok(!isLocaleVariant('globe.ltr') && !isLocaleVariant('globe.fill') && !isLocaleVariant('globe.ar.fill'));
  for (const l of ['ar', 'he', 'hi', 'ja', 'ko', 'th', 'zh', 'rtl', 'ltr']) assert.ok(ALIAS_LOCALE.test(`x.${l}`), l);
  for (const k of ['x.bn', 'x.sat', 'x.ar.fill', 'xar', 'x.far']) assert.ok(!ALIAS_LOCALE.test(k), k);
  assert.equal(releaseYear(2019.5), 2019); assert.equal(releaseYear(2019), 2019); assert.equal(releaseYear(2020.9), 2020);
  assert.equal(FIRST_YEAR, 2019); assert.deepEqual(YEARS, [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]);
  assert.deepEqual(WALL_SCALES, ['small', 'medium', 'large']);
});

test('files: text .strings, XML plist through plutil, and the binary/text switch', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-probe-files-'));
  fs.writeFileSync(path.join(dir, 'a.strings'), '"old.name" = "new.name";\n/* c */\n"x" = "y";\n');
  assert.deepEqual(readStrings(path.join(dir, 'a.strings')), { 'old.name': 'new.name', x: 'y' });
  assert.deepEqual(readAnyStrings(path.join(dir, 'a.strings')), { 'old.name': 'new.name', x: 'y' });
  fs.writeFileSync(path.join(dir, 'b.plist'), '<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict><key>symbols</key><dict><key>a</key><string>2019</string></dict></dict></plist>');
  if (process.platform === 'darwin') assert.deepEqual(readPlist(path.join(dir, 'b.plist')), { symbols: { a: '2019' } });
  fs.rmSync(dir, { recursive: true, force: true });
});

test('python formatting and numpy percentile', () => {
  assert.equal(fx(2.675, 2), '2.67'); assert.equal(fx(0.125, 2), '0.12'); assert.equal(fx(2.5, 0), '2'); assert.equal(fx(93.45, 1), (93.45).toFixed(1));
  assert.equal(pyRound(0.125, 2), 0.12); assert.equal(pyRound(39.754, 2), 39.75);
  assert.equal(percentile([1, 2, 3, 4], 25), 1.75);
});

test('CLI: data sections on a fake pin and fake records; unknown section and missing pin exit 2', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-probe-'));
  const pin = path.join(root, 'pin'), refs = path.join(root, 'refs');
  for (const m of [24, 20, 16]) {
    fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
    for (const n of ['check', 'check-2', 'check-circle']) for (const s of ['', '-filled']) fs.writeFileSync(path.join(pin, 'src/icons', String(m), `${n}${s}.svg`), '<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>');
  }
  fs.mkdirSync(path.join(refs, 'sfsymbols'), { recursive: true });
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'basemap.json'), JSON.stringify({ map: { bell: ['bell.fill'], heart: ['heart.fill'], plus: ['plus.circle', 'plus.circle.fill', 'plus.square'] } }));
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'names.json'), JSON.stringify({ names: {} }));
  const run = (...a) => spawnSync(process.execPath, [PROBE, ...a, '--refs', refs, '--app', root, '--coreglyphs', root, '--no-font'], { encoding: 'utf8' });
  const ok = run(pin, 's2.1', 's4.2');
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /## §2\.1 The shape of the relation/);
  assert.match(ok.stdout, /\| bases \| 2 \(66\.7%\) \| 0 \(0\.0%\) \| 1 \(33\.3%\) \| 0 \(0\.0%\) \| 0 \(0\.0%\) \|/);
  assert.match(ok.stdout, /\| numbered shape variants \(-2 …\) \| 1 \|/);
  assert.match(ok.stdout, /modifier-style names \(a shorter concept is a prefix\) \| \*\*1\*\* \|/);
  const bad = run(pin, 'nope');
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /unknown section: nope/);
  assert.equal(run(path.join(root, 'missing')).status, 2);
  fs.rmSync(root, { recursive: true, force: true });
});

// ── the data sections on a small synthetic world (Apple's files as XML plists and text .strings) ──
const plist = (obj) => {
  const enc = (v) => Array.isArray(v) ? `<array>${v.map(enc).join('')}</array>` : typeof v === 'object' ? `<dict>${Object.entries(v).map(([k, x]) => `<key>${k}</key>${enc(x)}`).join('')}</dict>` : `<string>${v}</string>`;
  return `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0">${enc(obj)}</plist>`;
};
const strings = (o) => Object.entries(o).map(([k, v]) => `"${k}" = "${v}";`).join('\n') + '\n';
function sfWorld() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-world-'));
  const pin = path.join(root, 'pin'), refs = path.join(root, 'refs'), app = path.join(root, 'app'), cg = path.join(root, 'cg');
  for (const m of [24, 20, 16]) fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
  const icon = (n, body) => fs.writeFileSync(path.join(pin, 'src/icons/24', `${n}.svg`), `<svg viewBox="0 0 24 24" stroke-width="1.5">${body}</svg>`);
  icon('check', '<path d="M4 12L9 17L20 6"/>');
  icon('check-circle', '<path d="M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z"/><path d="M8 12L10 14L16 8"/>');
  const M = {
    bell: ['bell.fill', 'bell.slash', 'bell.slash.fill', 'bell.badge.plus', 'bell.fill.badge.plus'],
    plus: ['plus.circle', 'plus.circle.fill', 'plus.square', 'plus.square.fill', 'plus.circle.badge.xmark'],
    heart: ['heart.fill'],
    star: ['star.fill', 'star.circle', 'star.fill.circle', 'star.slash', 'star.square', 'star.rectangle', 'star.bubble', 'star.app', 'star.shield', 'star.ring'],
    'arrow.down.compact': ['arrow.down.circle'],
  };
  fs.mkdirSync(path.join(refs, 'sfsymbols'), { recursive: true });
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'basemap.json'), JSON.stringify({ map: M }));
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'names.json'), JSON.stringify({ appVersion: '27.0', names: {} }));
  fs.mkdirSync(path.join(app, 'Metadata'), { recursive: true }); fs.mkdirSync(cg, { recursive: true });
  fs.writeFileSync(path.join(app, 'Metadata', 'base_symbols_map.json'), JSON.stringify(M));
  fs.writeFileSync(path.join(app, 'Metadata', 'legacy_aliases.strings'), strings({ 'bag.badge.plus.fill': 'bag.fill.badge.plus', 'volume': 'speaker' }));
  fs.writeFileSync(path.join(app, 'Metadata', 'layerset_availability.plist'), plist({ symbols: { bell: { hierarchical: '2019' } } }));
  fs.writeFileSync(path.join(app, 'Metadata', 'symbol_categories.plist'), plist({ bell: ['a', 'b'], heart: ['a'] }));
  fs.writeFileSync(path.join(app, 'Metadata', 'categories.plist'), plist([{ key: 'all' }, { key: 'draw' }]));
  fs.writeFileSync(path.join(app, 'Metadata', 'symbol_search.plist'), plist({ bell: ['ring', 'alarm', 'x'] }));
  fs.writeFileSync(path.join(cg, 'nofill_to_fill.strings'), strings({ bell: 'bell.fill', 'plus.circle': 'plus.circle.fill', 'plus.square': 'plus.square.fill', 'zzz': 'zzz.fill', 'globe.ar': 'globe.fill.ar', 'globe.rtl': 'globe.fill.rtl', 'bell.slash': 'bell.slash.fill', heart: 'heart' }));   // the last: a base declared as its own twin
  fs.writeFileSync(path.join(cg, 'name_aliases.strings'), strings({ 'circle.plus': 'plus.circle', 'old.bell': 'bell', 'gone.thing': 'nowhere', 'x.ar': 'y.ar' }));
  fs.writeFileSync(path.join(cg, 'symbol_restrictions.strings'), strings({ applelogo: 'x' }));
  fs.writeFileSync(path.join(cg, 'semantic_to_descriptive_name.strings'), strings({ add: 'plus', search: 'magnifyingglass' }));
  const av = { bell: '2019', 'bell.fill': '2019', 'bell.slash': '2020', 'bell.slash.fill': '2020.1', 'bell.badge.plus': '2019', 'bell.fill.badge.plus': '2021',
    plus: '2019', 'plus.circle': '2019', 'plus.circle.fill': '2019', 'plus.square': '2022', 'plus.square.fill': '2022', 'plus.circle.badge.xmark': '2023',
    heart: '2019', 'heart.fill': '2019.1', star: '2024', 'star.fill': '2024', 'star.circle': '2024', 'star.fill.circle': '2025', 'star.slash': '2024', 'star.square': '2024',
    'star.rectangle': '2024', 'star.bubble': '2026', 'star.app': '2024', 'star.shield': '2024', 'star.ring': '2024', 'arrow.down.compact': '2020', 'arrow.down.circle': '2020' };
  fs.writeFileSync(path.join(cg, 'name_availability.plist'), plist({ symbols: av }));
  fs.writeFileSync(path.join(cg, 'symbol_order.plist'), plist(['bell', 'heart', 'plus']));
  fs.writeFileSync(path.join(cg, 'legacy_flippable.plist'), plist(['arrow.left']));
  fs.writeFileSync(path.join(app, 'badge.plus.svg'), '<svg><g id="Regular-S"><path class="monochrome-0 a" d="M0 0h10v10h-10Z"/><path class="monochrome-1 b" d="M2 2h6v6h-6Z"/><path class="monochrome-2 c" d="M4 4h2v2h-2Z"/></g></svg>');
  const run = (...sections) => spawnSync(process.execPath, [PROBE, pin, ...sections, '--refs', refs, '--app', app, '--coreglyphs', cg, '--no-font'], { encoding: 'utf8' });
  return { root, pin, run };
}

test('precedence and boxGrows: the §2.4 matrix and the §3.1 growth threshold', () => {
  const { rows } = grammar({ plus: ['plus.circle.fill', 'plus.square.fill'], star: ['star.fill.circle'] });
  const p = precedence(rows);
  assert.equal(p('ENCL', 'FILL'), 2); assert.equal(p('FILL', 'ENCL'), 1); assert.equal(p('SLASH', 'FILL'), 0);
  assert.equal(boxGrows([100, 100], [102, 100]), false);
  assert.equal(boxGrows([100, 100], [102.1, 100]), true);
  assert.equal(boxGrows([100, 100], [100, 103]), true);
});

test('data sections on a synthetic world: every aggregation the document prints', { skip: process.platform !== 'darwin' && 'plutil is macOS-only' }, () => {
  const W = sfWorld();
  const r = W.run('s1', 's2.1', 's2.3', 's2.4', 's2.5', 's3.3-6', 's5', 's8');
  assert.equal(r.status, 0, r.stderr);
  const o = r.stdout;
  assert.match(o, /Of the 8 declared pairs, 1 are X with its own X\.fill; 3 are two derivatives of the same base; 3 involve a name not in the map; 1 are two separate bases/);
  assert.match(o, /\| bases \| 2 \(40\.0%\) \| 0 \(0\.0%\) \| 0 \(0\.0%\) \| 2 \(40\.0%\) \| 1 \(20\.0%\) \|/);        // star's 10 derivatives sit in 10+
  assert.match(o, /Five patterns cover 16 of 21 \(76\.2%\); ten cover 21 \(100\.0%\)/);
  assert.match(o, /\| enclosure → fill \| 2 \| 1 \|/);
  assert.match(o, /\| badge → fill \| 0 \| 1 \|/);
  assert.match(o, /9 of 22 derivatives \(41%\) arrived in a later release than their base \(8 by whole year\)/);
  assert.match(o, /check-circle's check is 9\.50 wide against the free check's 17\.50/);
  assert.match(o, /declares 8 pairs, or 6 once the 2 locale and direction variants/);
  assert.match(o, /of the 18 names in the base map that carry no fill token, 22\.2% \(4\) have a declared fill twin and 14 do not/);
  assert.match(o, /Renames: 4 old names still resolve, 1 of them pure reorders/);
  assert.match(o, /\| CoreGlyphs\/semantic_to_descriptive_name\.strings \| [^|]+ \| \*\*2\*\* entries \| add→plus, search→magnifyingglass \|/);   // organize is not there: left out
  fs.rmSync(W.root, { recursive: true, force: true });
});

test('raster records: in place, scaled copy, redrawn, and the corner offsets (the card\'s aggregation)', () => {
  const r = (kept, dx, sb) => ({ kept, dx, dy: 0, scaled_best: sb });
  assert.equal(inPlace(r(0.8, 8)), true); assert.equal(inPlace(r(0.79, 0)), false); assert.equal(inPlace(r(0.9, 9)), false);
  assert.equal(scaledCopy(r(0.1, 0, { s: 0.9, f: 0.75 })), true); assert.equal(scaledCopy(r(0.1, 0, { s: 0.97, f: 0.9 })), false); assert.equal(scaledCopy(r(0.1, 0, { s: 0.9, f: 0.7 })), false);
  const s = placeShares([r(0.9, 0), r(0.9, 0, { s: 0.5, f: 0.9 }), r(0.1, 0, { s: 0.5, f: 0.9 }), r(0.1, 0)]);
  assert.deepEqual(s, { n: 4, inPlace: 0.5, scaled: 0.25, redrawn: 0.25, scaledN: 1 });
  const o = cornerOffsets({ badge_d: 1000, base_box: [2000, 1000], centre_u: 0.95, centre_v: 0.8 });
  assert.ok(Math.abs(o.across - 0.2) < 1e-9 && Math.abs(o.down - 0.4) < 1e-9);
  assert.ok(Math.abs(cornerOffsets({ badge_d: 1000, base_box: [2000, 1000], centre_u: 0.1, centre_v: 0.3 }).across - 0.4) < 1e-9);
});

test('r3.* sections on synthetic records: shares, the cut percentiles and the badge quadrants', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-rec-'));
  const pin = path.join(root, 'pin'), refs = path.join(root, 'refs'), dir = path.join(refs, 'sfsymbols', 'card-2.2');
  for (const m of [24, 20, 16]) fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
  fs.mkdirSync(path.join(dir, 'sf2'), { recursive: true });
  const w = (f, rows) => fs.writeFileSync(path.join(dir, f), rows.map((x) => JSON.stringify(x)).join('\n') + '\n');
  w('sf2/regcensus.jsonl', [
    { base: 'bell', der: 'bell.badge.plus', kept: 0.9, dx: 0, dy: 0 }, { base: 'lock', der: 'lock.badge.plus', kept: 0.5, dx: 0, dy: 0 },
    { base: 'plus', der: 'plus.circle', kept: 0.2, dx: 0, dy: 0, scaled_best: { s: 0.6, f: 0.8 } }, { base: 'x', der: 'x.circle', kept: 0.2, dx: 0, dy: 0 },
  ]);
  w('sf2/cut.jsonl', [1.0, 1.02, 1.04, 1.06, 1.08].map((ratio, i) => ({ x: `m${i}.circle`, ratio, in_strokes: 0.9 })).concat([{ x: 'solid.circle', ratio: 1.2, in_strokes: 2 }, { x: 'skip.circle', skip: 'tiny' }]));
  w('sf2/fill.jsonl', [{ x: 'a.circle', iou: 0.995, area_ratio: 1, same_box: [0, 0] }, { x: 'b', iou: 0.96, area_ratio: 0.9, same_box: [3, 0] }]);
  w('sf2/badge.jsonl', [
    { base: 'a', der: 'a.badge.plus', badge_d: 1016, badge_d_em: 0.496, badge_d_strokes: 5.98, badge_d_over_base_long: 0.5, reg_f: 0.8, centre_u: 0.9, centre_v: 0.9, base_box: [2000, 2000], union_growth: [0.2, 0.1], trim_min: 135, trim_min_strokes: 0.79, base_removed: 0.2, glyph_box: [1, 1], glyph_ext_over_d: 0.6, glyph_thick_strokes: 0.7 },
    { base: 'b', der: 'b.badge', badge_d: 694, badge_d_em: 0.339, badge_d_strokes: 4.08, badge_d_over_base_long: 0.3, reg_f: 0.9, centre_u: 0.2, centre_v: 0.8, base_box: [2000, 2000], union_growth: [0, 0], trim_min: 129, trim_min_strokes: 0.76, base_removed: 0.1 },
    { base: 'c', der: 'c.badge.plus', badge_d: 1016, badge_d_em: 0.496, badge_d_strokes: 5.98, badge_d_over_base_long: 0.5, reg_f: 0.3, centre_u: 0.9, centre_v: 0.9, base_box: [2000, 2000], union_growth: [0.2, 0.1], trim_min: 135, base_removed: 0.2 },
  ]);
  fs.writeFileSync(path.join(dir, 'sf2/corner.json'), JSON.stringify([{ rank: 1 }, { rank: 3 }]));
  const run = spawnSync(process.execPath, [PROBE, pin, 'r3.1', 'r3.4', 'r3.6', '--refs', refs, '--app', root, '--coreglyphs', root, '--no-font'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const o = run.stdout;
  assert.match(o, /\| badge \| 2 \| 50\.0% \| 0 \| 50\.0% \|/);
  assert.match(o, /\| enclosure \| 2 \| 0\.0% \| 50\.0% \| 50\.0% \|/);
  assert.match(o, /scaled copies among the enclosures: 1 of 2/);
  assert.match(o, /7 X\.circle ↔ X\.circle\.fill pairs; 6 measurable; 5 line-like \(thickness ≤ 1\.3 ring walls\), 1 solid/);
  assert.match(o, /\| p5 1\.004 \| p25 1\.020 \| p50 1\.040 \| p75 1\.060 \| p95 1\.076 \|/);
  assert.match(o, /\| container outline → container fill \| 1 \| 100\.0% \|/);
  assert.match(o, /3 badge derivatives; 3 with a round badge found; 2 registered against their base/);
  assert.match(o, /\| share of 2 \| 50\.0% \(1\) \| 50\.0% \(1\) \| 0\.0% \(0\) \| 0\.0% \(0\) \|/);
  assert.match(o, /1: 50\.0%, 2: 0\.0%, 3: 50\.0%, 4: 0\.0% of 2/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('§3.1 / §3.2 helpers: the 1-unit advance band, the on-top tally, the full-share format, the named parameters', () => {
  assert.equal(sameAdvance(2398, 2399), true); assert.equal(sameAdvance(2398, 2399.01), false); assert.equal(sameAdvance(2398, 2397), true);
  const t = onTopTally([['circle', [{ w: 2040, h: 2040 }, { w: 2040, h: 2040 }, { w: 2040, h: 2039 }]], ['square', [{ w: 1841, h: 1841 }]]]);
  assert.equal(t.tot, 4); assert.equal(t.onTop, 3);
  assert.deepEqual(t.rows.map((r) => [r.tok, r.n, r.distinct, r.box, r.share]), [['circle', 3, 2, '2,040 × 2,040', 2 / 3], ['square', 1, 1, '1,841 × 1,841', 1]]);
  assert.equal(pcDoc(1), '100%'); assert.equal(pcDoc(0.9999), '100.0%'); assert.equal(pcDoc(0.5), '50.0%');
  assert.deepEqual(HALO_BAND, [5.69, 5.72]); assert.equal(REGULAR_STROKE, 170);
  assert.equal(inHaloBand(5.69), true); assert.equal(inHaloBand(5.72), true); assert.equal(inHaloBand(5.6899), false); assert.equal(inHaloBand(5.7201), false);
});

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
test('edges inside the helpers: scale-match floors, the 3-point minimum, the master at offset 0, a skewed halo median', () => {
  const tri = rawContours([['M', 0, 0], ['L', 40, 0], ['L', 0, 30], ['Z']])[0];
  const scaled = (k) => rawContours([['M', 5, 5], ['L', 5 + 40 * k, 5], ['L', 5, 5 + 30 * k], ['Z']])[0];
  assert.ok(sameUpToScale(tri, scaled(2)), 'a three-point contour is enough');
  assert.equal(sameUpToScale(tri.slice(0, 2), scaled(2).slice(0, 2)), null, 'two points are not');
  assert.equal(sameUpToScale(tri, scaled(0.05)), null, 'a scale of 0.05 is refused');
  assert.ok(sameUpToScale(tri, scaled(0.06)), 'a scale of 0.06 is accepted');
  assert.ok(sameUpToScale(tri, scaled(0.053)), 'so is 0.053');
  assert.equal(templateLayers('id="Regular-S"><path class="monochrome-1 b" d="M0 0h1"/></g>', 'Regular-S').length, 1);
  assert.equal(scaledCopy({ kept: 0, dx: 0, dy: 0, scaled_best: { s: 1.042, f: 0.8 } }), true);
  assert.equal(scaledCopy({ kept: 0, dx: 0, dy: 0, scaled_best: { s: 1.039, f: 0.8 } }), false);
  const o = cornerOffsets({ badge_d: 1000, base_box: [1000, 1000], centre_u: 0.52, centre_v: 0.4 });
  near(o.across, 0.96); near(o.down, 0.8);
  near(cornerOffsets({ badge_d: 1000, base_box: [1000, 1000], centre_u: 0.4, centre_v: 0.52 }).down, 0.96);
  const skew = haloOffset('M-5 1L5 1M-0.5 100L0.5 100', 'M0 0L0.01 0');   // most of the halo at ~1–5, a few points at 100
  assert.ok(skew.median < 6 && skew.max > 99, JSON.stringify(skew));
});

// ── every no-font section on a richer synthetic world: metadata, templates and the card's raster records with
//    values on both sides of every band the probe prints a count against, and medians that are not means. The
//    expected output was produced by this probe and read by hand against the fixture before it was frozen. ──
/**
 * A stand-in font for the rich SF world (`--font-json`): rectangles, a ring, and containers whose right side bulges out
 * by `w`, the bulge's far edge reached a third of the way along its curve — so a 6-piece flattening finds it and a 4- or
 * 8-piece one falls short (4 pieces: 0.949 w, 8 pieces: 0.989 w).
 */
function sfFont(names, M) {
  const rect = (x0, y0, x1, y1) => [['M', x0, y0], ['L', x1, y0], ['L', x1, y1], ['L', x0, y1], ['Z']];
  const cont = (x0, side, w) => [['M', x0, 0], ['L', x0 + side, 0], ['C', x0 + side + 2.25 * w, side / 3, x0 + side, (2 * side) / 3, x0 + side, side], ['L', x0, side], ['Z']];
  const bump = (x0, y0, w, h) => [['M', x0, y0], ['C', x0 + 2.25 * w, y0 + h / 3, x0, y0 + (2 * h) / 3, x0, y0 + h], ['Z']];
  const K = 0.5523, circ = (cx, cy, r) => [['M', cx - r, cy], ['C', cx - r, cy + K * r, cx - K * r, cy + r, cx, cy + r], ['C', cx + K * r, cy + r, cx + r, cy + K * r, cx + r, cy],
    ['C', cx + r, cy - K * r, cx + K * r, cy - r, cx, cy - r], ['C', cx - K * r, cy - r, cx - r, cy - K * r, cx - r, cy], ['Z']];
  const SC = { small: 0.9, medium: 1, large: 1.1 }, WT = { 1: 0.5, 400: 1, 1000: 1.5 };
  const A = rect(100, 0, 1100, 800), B = rect(300, 300, 500, 600), plain = { ops: [...A, ...B], advance: 1200 };   // two contours, neither a scaled copy of the other
  const C3 = rect(700, 100, 800, 250);                                                                                    // a derivative's own third contour
  const moved = (ops, dx, dy = 0) => ops.map((o) => (o[0] === 'Z' ? o : [o[0], ...o.slice(1).map((v, i) => v + (i % 2 ? dy : dx))]));
  const nudged = (d) => [['M', 110, 0], ['L', 1110, 0], ['L', 1110 + d, 800], ['L', 110, 800], ['Z']];   // A moved 10 across, one corner d further
  const pure = new Set(Object.values(M).flat().filter((d) => /\.(circle|square|capsule|hexagon)(\.fill)?$/.test(d) && d.split('.').length <= 3));
  const sampleDer = new Set(['bell.fill', 'bell.badge', 'bell.slash', 'plus.circle', 'plus.square', 'checkmark.circle', 'person.badge.plus', 'person.fill', 'person.circle', 'lock.fill', 'lock.slash', 'lock.badge.clock', 'xmark.circle', 'heart.fill']);
  const over = {
    // §3.1: growth against the base's 1000 × 800 (the 1-dp rounding, then > 2) and the layout width (within 1)
    'd.badge.plus': { ops: [...A, ...B, ...rect(1100, 0, 1102.04, 10)], advance: 1201 },        // 2.04 rounds to 2.0: not grown
    'f.badge.up': { ops: [...A, ...B, ...rect(1100, 0, 1102.06, 10)], advance: 1202 },          // 2.06 rounds to 2.1: grown; width moved by 2
    'f.trianglebadge.exclamationmark': { ops: [...A, ...B, ...rect(97.94, 0, 100, 10)], advance: 1200 },   // grown 2.06 to the left
    'e.badge.checkmark': { ops: [...A, ...B, ...bump(1100, 0, 2.06, 30)], advance: 1200 },     // 2.06 at the curve's far edge, 2.04 in 8 pieces: not grown
    'e.fill': { ops: [...A, ...B], advance: 1202 },
    'c.slash': { ops: [...A, ...B, ...rect(500, 800, 510, 802.04)], advance: 1200 },              // taller by 2.04: rounds to 2.0, not grown
    'b.fill': { ops: [...A, ...B, ['M', 600, 800], ['Q', 620, 803, 640, 800], ['Z']], advance: 1200 },   // a quadratic whose control point, at 803, is a corner of the box: grown
    'f.badge.arrow.down': { ops: [...A, ...B, ...rect(500, 800, 510, 802.06)], advance: 1200 },   // taller by 2.06: rounds to 2.1, grown
    // the declared-limits reuse line: 14 pairs, two base contours each
    'bell.fill': { ops: [...moved(A, 10), ...B, ...C3], advance: 1200 },                                // both by translation
    heart: { ops: [['M', 100, 0], ['L', 1100, 0], ['C', 1100, 300, 1100, 500, 1100, 800], ['L', 100, 800], ['Z'], ['M', 300, 300], ['Q', 400, 200, 500, 300], ['L', 400, 600], ['Z']], advance: 1200 },
    'heart.fill': { ops: [['M', 100, 0], ['L', 1100, 0], ['C', 1150, 300, 1150, 500, 1100, 800], ['L', 100, 800], ['Z'], ['M', 300, 300], ['Q', 400, 260, 500, 300], ['L', 400, 600], ['Z'], ...C3], advance: 1200 },   // the same points, other control points: no match
    'bell.badge': { ops: [...nudged(1.6), ...B, ...C3], advance: 1200 },                                // A by scale only (residual 0.956), B in place
    'bell.slash': { ops: [...nudged(1.7), ...B, ...C3], advance: 1200 },                                // A missed (residual 1.016), B in place
    'plus.circle': { ops: [...A, ...rect(350, 350, 450, 500), ...C3], advance: 1200 },                  // B at half size: by scale
    'plus.square': { ops: [...rect(0, 0, 10, 10)], advance: 1200 },                              // nothing kept
    'person.badge.plus': { ops: [['M', 100, 0], ['L', 1100, 0], ['L', 600, 1000], ['Z'], ...B, ...C3], advance: 1200 },   // A redrawn with three corners
  };
  const glyph = (n, sc, w) => {
    const s = SC[sc], k = WT[w];
    if (n === 'circle') { const R = { small: 700.2, medium: 800.2, large: 900.2 }[sc], wall = { small: 153, medium: 170, large: 186.5 }[sc]; return { ops: [...circ(1000, 700, R), ...circ(1000, 700, R - wall)], advance: 2000 }; }
    if (pure.has(n)) {
      // a2.circle bulges 40.2, a fifth of a unit more than the other circles: the same box once rounded to whole units; sides of
      // 1000.2 and left edges at 100.3 / 120.5 are whole units only after rounding too (120.5 to even: 120)
      const tok = n.split('.')[1], wb = { 'f.circle': 60, 'f.square': 20, 'a2.circle': 40.2 }[n] ?? (tok === 'square' ? 0 : 40), x0 = n === 'e.circle.fill' ? 120.5 : 100.3;
      return { ops: [...cont(x0, 1000.2 * s, wb * k), ...rect(400, 400, 600, 600)], advance: n === 'b.circle' ? 1310 : 1300 };
    }
    // the 14 declared-limits pairs: a derivative carries a third contour, so which side is the base changes the count
    if (sampleDer.has(n)) return over[n] ?? { ops: [...A, ...B, ...C3], advance: 1200 };
    return over[n] ?? plain;
  };
  const glyphs = [];
  for (const [n, v] of Object.entries(names)) for (const sc of ['small', 'medium', 'large']) for (const w of [1, 400, 1000]) {
    if (n === 'd.square.fill' && sc === 'large' && w === 1000) continue;                       // one cell the font lacks
    if (n === 'f.circle' && sc === 'small' && w === 1) continue;                                // and one where the circles share a single box
    glyphs.push({ cp: v.cp, glyph: `${n}.${sc}`, scale: sc, weight: `w${w}`, wght: w, ...glyph(n, sc, w) });
  }
  const meta = { upem: 2048, capHeight: 1450, numGlyphs: 20700, puaSymbols: 6900, axes: [{ tag: 'wght', min: 1, default: 400, max: 1000 }],
    instances: [{ name: 'Ultralight', coords: { wght: 39.7531 } }, { name: 'Regular', coords: { wght: 400 } }, { name: 'Black', coords: { wght: 1000 } }] };
  return { meta, strokes: { '1|medium': 39.7549, '400|medium': 170.044, '1000|medium': 356.125 }, glyphs };
}

function richSfWorld() {
  const plist = (obj) => {
    const enc = (v) => Array.isArray(v) ? `<array>${v.map(enc).join('')}</array>` : typeof v === 'object' ? `<dict>${Object.entries(v).map(([k, x]) => `<key>${k}</key>${enc(x)}`).join('')}</dict>` : `<string>${v}</string>`;
    return `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0">${enc(obj)}</plist>`;
  };
  const strings = (o) => Object.entries(o).map(([k, v]) => `"${k}" = "${v}";`).join('\n') + '\n';
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sf-rich-'));
  const pin = path.join(root, 'pin'), refs = path.join(root, 'refs'), app = path.join(root, 'app'), cg = path.join(root, 'cg');
  for (const m of [24, 20, 16]) fs.mkdirSync(path.join(pin, 'src/icons', String(m)), { recursive: true });
  const icon = (n, body) => { for (const m of [24, 20, 16]) for (const sfx of ['', '-filled']) fs.writeFileSync(path.join(pin, 'src/icons', String(m), `${n}${sfx}.svg`), `<svg viewBox="0 0 24 24" stroke-width="1.5">${body}</svg>`); };
  icon('check', '<path d="M4 12L9 17L20 6"/>');
  icon('check-2', '<path d="M4 12L9 17L20 6"/>');
  icon('check-small', '<path d="M6 12L9 15L18 6"/>');
  icon('check-2-small', '<path d="M6 12L9 15L18 6"/>');
  icon('check-circle', '<path d="M2.75 12A9.25 9.25 0 1 0 21.25 12A9.25 9.25 0 1 0 2.75 12Z"/><path d="M8 12L10.25 14.25L16 8.5"/>');
  icon('pin', '<path d="M4 20h16"/>'); icon('tin-2', '<path d="M4 20h16"/>'); fs.writeFileSync(path.join(pin, 'src/icons/24', 'notes.txt'), 'not a drawing');
  icon('users', '<path d="M4 20h16"/>'); icon('users-2', '<path d="M4 20h16"/>'); icon('users-2-behind', '<path d="M4 20h16"/>'); icon('orphan-3', '<path d="M4 20h16"/>');
  const M = {
    a1: ['a1.fill'], a2: ['a2.circle'], b: ['b.fill', 'b.circle'], c: ['c.fill', 'c.slash', 'c.slash.fill'],
    d: ['d.square', 'd.square.fill', 'd.badge.plus', 'd.badge.plus.fill'],
    e: ['e.fill', 'e.circle', 'e.circle.fill', 'e.rectangle.stack', 'e.badge.checkmark', 'e.fill.badge.checkmark', 'e.slash.circle', 'e.inverse', 'e.arrow.trianglehead.clockwise.rotate.90'],
    f: ['f.fill', 'f.circle', 'f.circle.fill', 'f.square', 'f.capsule', 'f.hexagon', 'f.badge.up', 'f.badge.arrow.down', 'f.trianglebadge.exclamationmark', 'f.ring'],
    'g.up': ['g.up.fill'], 'h.compact': ['h.circle', 'h.fill.badge.plus'],
    k: ['k.badge.forward.circle', 'k.circle.badge.xmark', 'k.dotted', 'k.2'],
    m: ['m.arrow.trianglehead.counterclockwise.2.rotate.90.fill'], n: ['n.circle.badge.plus.fill', 'n.square.on.square'],
  };
  // one more family: point releases inside a year, a later QUAL and STYLE word, a rotation stacked with a container,
  // a six-token suffix and a locale alias that is itself in the map (kept out of the confidence cycle below)
  const M2 = { r: ['r.rtl', 'r.portrait', 'r.video', 'r.half', 'r.arrow.clockwise.circle', 'r.square.on.square.badge.plus.fill', 'r.slash.circle.badge.plus', 'r.arrow.badge.arrow', 'r.slash', 'r.circle.slash'], q: ['q.fill'], q2: ['q2.circle', 'q2.fill'] };
  fs.mkdirSync(path.join(refs, 'sfsymbols', 'card-2.2', 'sf2'), { recursive: true }); fs.mkdirSync(path.join(refs, 'sfsymbols', 'card-2.2', 'sf'), { recursive: true });
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'basemap.json'), JSON.stringify({ map: { ...M, ...M2 } }));
  const all = [...Object.keys(M), ...Object.values(M).flat()];
  const names = Object.fromEntries(all.map((n, i) => [n, { cp: 0x100000 + i, confidence: ['sure', 'likely', 'tied'][i % 3] }]));
  names['e.inverse'].confidence = 'doubtful'; delete names['k.dotted']; names['zz.9'] = { cp: 0x10ffff, confidence: 'doubtful' }; names['wave.3'] = { cp: 0x10fffe, confidence: 'sure' };
  const sample = ['bell', 'bell.fill', 'bell.badge', 'bell.slash', 'plus', 'plus.circle', 'plus.square', 'checkmark', 'checkmark.circle', 'person', 'person.badge.plus', 'person.fill', 'person.circle',
    'lock', 'lock.fill', 'lock.slash', 'lock.badge.clock', 'xmark', 'xmark.circle', 'heart', 'heart.fill', 'circle'];
  const boxes = ['.circle', '.square', '.rectangle', '.diamond', '.capsule', '.shield', '.app', '.seal', '.hexagon', '.triangle', '.bubble'].flatMap((e) => [`box${e}`, `box${e}.fill`]);
  [...Object.keys(M2), ...Object.values(M2).flat(), ...sample, ...boxes, 'clock.2h', 'tv.2x2'].forEach((n, i) => { names[n] = { cp: 0x101000 + i, confidence: 'sure' }; });   // 2h, 2x2: digit-led, not numbers
  names['r.slash'].confidence = 'doubtful';                                       // a slash whose name did not resolve
  fs.writeFileSync(path.join(refs, 'sfsymbols', 'names.json'), JSON.stringify({ appVersion: '27.0', names }));
  fs.mkdirSync(path.join(app, 'Metadata'), { recursive: true }); fs.mkdirSync(cg, { recursive: true });
  fs.writeFileSync(path.join(app, 'Metadata', 'base_symbols_map.json'), JSON.stringify({ ...M, ...M2 }));
  fs.writeFileSync(path.join(app, 'Metadata', 'legacy_aliases.strings'), strings({ 'bag.badge.plus.fill': 'bag.fill.badge.plus', 'cart.badge.minus.fill': 'cart.fill.badge.minus', volume: 'speaker', 'x.fill.badgeplus': 'x.fill', 'tag.old': 'tag.fill' }));
  fs.writeFileSync(path.join(app, 'Metadata', 'layerset_availability.plist'), plist({ symbols: { b: { hierarchical: '2019' }, c: { multicolor: '2020' } } }));
  fs.writeFileSync(path.join(app, 'Metadata', 'symbol_categories.plist'), plist({ b: ['a', 'b', 'c'], c: ['a'] }));
  fs.writeFileSync(path.join(app, 'Metadata', 'categories.plist'), plist([{ key: 'all' }, { key: 'draw' }, { key: 'x' }]));
  fs.writeFileSync(path.join(app, 'Metadata', 'symbol_search.plist'), plist({ b: ['ring', 'alarm'], c: ['x'] }).replace('</plist>', `${' '.repeat(3000 - Buffer.byteLength(plist({ b: ['ring', 'alarm'], c: ['x'] })))}</plist>`));   // 3000 bytes: 2.9 KB
  fs.writeFileSync(path.join(app, 'Metadata', 'name_aliases.strings'), strings({ unused: 'x' }));
  fs.writeFileSync(path.join(cg, 'nofill_to_fill.strings'), strings({ a1: 'a1.fill', b: 'b.fill', 'e.circle': 'e.circle.fill', 'f.circle': 'f.circle.fill', 'd.square': 'd.square.fill', 'c.slash': 'c.slash.fill', zzz: 'zzz.fill', a2: 'a2', 'globe.ar': 'globe.fill.ar', 'globe.sat': 'globe.fill.sat', 'globe.rtl': 'globe.fill.rtl', 'globe.ltr': 'globe.fill.ltr', 'x.up': 'x.up.fill', 'tv.2x2': 'tv.2x2.fill',
    ...Object.fromEntries(['he', 'hi', 'ja', 'ko', 'th', 'zh', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'si', 'mni'].map((l) => [`globe.${l}`, `globe.fill.${l}`])),
    ...Object.fromEntries(['.circle', '.square', '.rectangle', '.diamond', '.capsule', '.shield', '.app', '.seal', '.hexagon', '.triangle', '.bubble'].map((e) => [`box${e}`, `box${e}.fill`])) }));
  fs.writeFileSync(path.join(cg, 'name_aliases.strings'), strings({ 'circle.b': 'b.circle', 'old.c': 'c', 'old.c2': 'c', 'gone.thing': 'nowhere', 'x.ar': 'y.ar', 'q.ltr': 'q', 'slash.c': 'c.slash',
    'x.he': 'y', 'x.hi': 'y', 'x.ja': 'y', 'x.ko': 'y', 'x.th': 'y', 'x.zh': 'y', 'x.rtl': 'y', 'r.rtl': 'r' }));
  fs.writeFileSync(path.join(cg, 'semantic_to_descriptive_name.strings'), strings({ add: 'plus', search: 'magnifyingglass', organize: 'folder', share: 'square.and.arrow.up' }));
  const yrs = { a1: '2019', 'a1.fill': '2019', a2: '2019', 'a2.circle': '2019.1', b: '2020', 'b.fill': '2020', 'b.circle': '2021', c: '2019', 'c.fill': '2019', 'c.slash': '2019', 'c.slash.fill': '2018',
    d: '2022', 'd.square': '2022', 'd.square.fill': '2022.2', 'd.badge.plus': '2023', 'd.badge.plus.fill': '2023', e: '2019', 'e.fill': '2019', 'e.circle': '2019', 'e.circle.fill': '2019', 'e.rectangle.stack': '2020',
    'e.badge.checkmark': '2020', 'e.fill.badge.checkmark': '2021', 'e.slash.circle': '2019', 'e.inverse': '2019', 'e.arrow.trianglehead.clockwise.rotate.90': '2024', f: '2024', 'f.fill': '2024', 'f.circle': '2024',
    'f.circle.fill': '2024', 'f.square': '2024', 'f.capsule': '2025', 'f.hexagon': '2024', 'f.badge.up': '2024', 'f.badge.arrow.down': '2025', 'f.trianglebadge.exclamationmark': '2026', 'f.ring': '2024',
    'g.up': '2020', 'g.up.fill': '2019', 'h.compact': '2020', 'h.circle': '2020', 'h.fill.badge.plus': '2021', k: '2021.6', 'k.badge.forward.circle': '2021.7', 'k.circle.badge.xmark': '2022', 'k.dotted': '2023',
    m: '2024', 'm.arrow.trianglehead.counterclockwise.2.rotate.90.fill': '2024', n: '2019', 'n.circle.badge.plus.fill': '2019', 'n.square.on.square': '2019',
    r: '2019.2', 'r.rtl': '2019.5', 'r.portrait': '2019.4', 'r.video': '2020', 'r.half': '2020.3', 'r.arrow.clockwise.circle': '2021', 'r.square.on.square.badge.plus.fill': '2022', 'r.slash.circle.badge.plus': '2023', 'r.arrow.badge.arrow': '2019.3', 'r.slash': '2020', q: '2021', 'q.fill': '2021', q2: '2022', 'q2.circle': '2022', 'q2.fill': '2022', 'r.circle.slash': '2023' };
  fs.writeFileSync(path.join(cg, 'name_availability.plist'), plist({ symbols: yrs }));
  const pad = (text, n) => text.replace('</plist>', `${' '.repeat(n - Buffer.byteLength(text))}</plist>`);   // exact byte sizes for the KB column
  fs.writeFileSync(path.join(cg, 'symbol_order.plist'), pad(plist(['a1', 'b', 'c', 'd']), 1024));
  fs.writeFileSync(path.join(cg, 'legacy_flippable.plist'), pad(plist(['arrow.left', 'arrow.right']), 1100));
  fs.writeFileSync(path.join(cg, 'symbol_restrictions.strings'), strings({ applelogo: 'x', applewatch: 'y' }) + ' '.repeat(1023 - Buffer.byteLength(strings({ applelogo: 'x', applewatch: 'y' }))));
  // templates: concentric rings, halo radius r + offset
  const K = 0.5523, ring = (r) => `M${50 - r} 50C${50 - r} ${50 - K * r} ${50 - K * r} ${50 - r} 50 ${50 - r}C${50 + K * r} ${50 - r} ${50 + r} ${50 - K * r} ${50 + r} 50C${50 + r} ${50 + K * r} ${50 + K * r} ${50 + r} 50 ${50 + r}C${50 - K * r} ${50 + r} ${50 - r} ${50 + K * r} ${50 - r} 50Z`;
  const master = (id, off, layers = 3) => `<g id="${id}"><path class="monochrome-0 a" d="${ring(20 + off)}"/>` + (layers >= 2 ? `<path class="monochrome-1 b" d="${ring(20)}"/>` : '') + (layers >= 3 ? `<path class="monochrome-2 c" d="M48 48h4v4h-4Z"/>` : '') + (layers >= 4 ? `<path class="monochrome-3 d" d="M40 40h1v1h-1Z"/>` : '') + '</g>';
  const tpl = (f, body) => fs.writeFileSync(path.join(app, f), `<svg>${body}</svg>`);
  tpl('badge.plus.svg', master('Ultralight-S', 3.1) + master('Regular-S', 5.7).replace('</g>', `<path class="monochrome-0 z" d="${ring(30)}"/><path class="monochrome-1 z" d="${ring(15)}"/></g>`) + master('Black-S', 6.35));
  tpl('badge.a.svg', master('Regular-S', 5.686)); tpl('badge.b.svg', master('Regular-S', 5.692, 2)); tpl('badge.c.svg', master('Regular-S', 5.718, 4));   // b and c: the two ends of the band's medians
  tpl('badge.d.svg', master('Regular-S', 5.724)); tpl('badge.e.svg', '<g id="Regular-S"><path class="monochrome-1 b" d="M0 0h1"/></g>'); tpl('trianglebadge.x.svg', master('Regular-S', 5.705));
  const qring = (r) => `M${50 - r} 50Q${50 - r} ${50 - r} 50 ${50 - r}Q${50 + r} ${50 - r} ${50 + r} 50Q${50 + r} ${50 + r} 50 ${50 + r}Q${50 - r} ${50 + r} ${50 - r} 50Z`;
  tpl('badge.q.svg', `<g id="Regular-S"><path class="monochrome-0 a" d="${qring(25.7)}"/><path class="monochrome-1 b" d="${qring(20)}"/></g>`);
  tpl('badge.f.svg', `<g id="Regular-S"><path class="monochrome-0 a" d="${ring(25.7)}"/><path class="monochrome-1 b" d="${ring(20)}"/><path class="monochrome-1 g" d="${ring(12)}"/></g>`);   // the badge layer is the first monochrome-1
  // the card's raster records
  const R = path.join(refs, 'sfsymbols', 'card-2.2');
  const jl = (f, rows) => fs.writeFileSync(path.join(R, f), rows.map((x) => JSON.stringify(x)).join('\n') + '\n');
  const reg = (base, der, kept, dx, dy, sb) => ({ base, der, kept, dx, dy, ...(sb ? { scaled_best: sb } : {}) });
  jl('sf2/regcensus.jsonl', [
    reg('d', 'd.badge.plus', 0.8, 8, -8), reg('e', 'e.badge.checkmark', 0.7999, 0, 0), reg('f', 'f.badge.up', 0.9, 8.01, 0), reg('f', 'f.badge.arrow.down', 0.95, 0, -8.01),
    reg('a2', 'a2.circle', 0.3, 0, 0, { s: 0.95, f: 0.75 }), reg('b', 'b.circle', 0.3, 0, 0, { s: 0.95, f: 0.749 }), reg('e', 'e.circle', 0.3, 0, 0, { s: 1.03, f: 0.9 }), reg('f', 'f.circle', 0.85, 0, 0, { s: 0.5, f: 0.9 }),
    reg('a1', 'a1.fill', 0.5, 0, 0), reg('b', 'b.fill', 0.81, 1, 1), reg('c', 'c.slash', 0.9, 0, 0), reg('c', 'c.slash.fill', 0.1, 0, 0), reg('d', 'd.badge.plus.fill', 0.9, 0, 0),
    reg('e', 'e.fill.badge.checkmark', 0.2, 0, 0), reg('e', 'e.arrow.trianglehead.clockwise.rotate.90', 0.1, 0, 0), reg('e', 'e.circle.fill', 0.9, 0, 0), reg('f', 'f.ring', 0.1, 0, 0),
    reg('h.compact', 'h.circle', 0.5, 0, 0), { base: 'x', der: 'x.circle', error: 'boom' },
  ]);
  const fr = (x, iou, area_ratio, same_box) => ({ x, xf: `${x}.fill`, iou, area_ratio, same_box });
  jl('sf2/fill.jsonl', [fr('a.circle', 0.99, 1, [0, 0]), fr('b.circle', 0.9899, 0.9699, [2, 0]), fr('c.square', 0.995, 0.97, [2.01, 0]), fr('d.rectangle', 0.95, 1.03, [0, -2]), fr('e', 0.9499, 1.0301, [0, 0]),
    fr('f', 0.95, 1.0, [0, 2.01]), fr('g', 0.99, 0.5, null), fr('h.app', 0.8, 1.2, [0, 0]), { x: 'zz', error: 'x' },
    ...['diamond', 'capsule', 'shield', 'seal', 'hexagon', 'triangle', 'bubble'].map((e, i) => fr(`r.${e}`, 0.96 + i / 100, 1, [0, 0]))]);
  const cr = (x, ratio, in_strokes, t_in = 100, t_hole = 103) => ({ x: `${x}.circle`, xf: `${x}.circle.fill`, ratio, in_strokes, t_in, t_hole });
  jl('sf2/cut.jsonl', [cr('figure.a', 1.0, 1.3), cr('figure.b', 1.02, 1.0), cr('figure.c', 1.03, 0.9), cr('figure.d', 1.035, 0.8), cr('figure.e', 1.2, 0.7),
    cr('arrow.a', 1.04, 1.0), cr('arrow.b', 1.05, 1.0), cr('arrow.c', 1.06, 1.0), cr('arrow.d', 1.07, 1.0), cr('lock', 1.0, 1.3001), cr('person', 1.1, 2.5),
    cr('checkmark', 1.03, 0.9, 154.8, 159.8), cr('plus', 1.04, 1.0, 168.0, 174.0), cr('xmark', 1.04, 0.95, 158.4, 165.5), { x: 'skip.circle', xf: 'skip.circle.fill', skip: 'tiny' }, cr('checkmark', 1.05, 0.9, 150, 160)]);
  const sl = (o) => ({ base: 'b', der: 'b.slash', direction: '\\', angle_from_horizontal: 45, slash_thick: 154.2, slash_thick_strokes: 0.91, slash_len_over_base_diag: 0.95, trim_min: 116.7, base_removed: 0.2, sig: 'SLASH', ...o });
  jl('sf2/slash.jsonl', [sl({}), sl({ direction: null }), sl({ direction: '/', angle_from_horizontal: 135, slash_thick: 95 }), sl({ angle_from_horizontal: 45.5, slash_thick: 154 }), sl({ angle_from_horizontal: 45.51, slash_thick: 156 }),
    sl({ angle_from_horizontal: 44.5, slash_thick: 153.9 }), sl({ slash_thick: 156.1, trim_min: 119.5, base_removed: 0.6 }), sl({ slash_thick: 90, sig: 'SLASH.ENCL', trim_min: 116, slash_len_over_base_diag: 0.7 }),
    sl({ slash_thick: 102, sig: 'SLASH.FILL', trim_min: 130, slash_len_over_base_diag: 1.1 }), sl({ slash_thick: 89.9, sig: 'SLASH.ENCL', trim_min: 0, base_removed: 0.1 }), sl({ slash_thick: 102.1, trim_min: 200, base_removed: 0.15 }), { base: 'z', der: 'z.slash', error: 'x' }]);
  const bd = (o) => ({ base: 'p', der: 'p.badge.plus', badge_d: 1016, badge_d_em: 0.496, badge_d_strokes: 5.98, badge_d_over_base_long: 0.46, reg_f: 0.8,  centre_u: 0.94, centre_v: 0.84, base_box: [2000, 1800], union_growth: [0.2, 0.08],
    trim_min: 135, trim_min_strokes: 0.79, base_removed: 0.18, glyph_box: [600, 600], glyph_ext_over_d: 0.63, glyph_thick_strokes: 0.73, ...o });
  jl('sf2/badge.jsonl', [bd({}), bd({ badge_d: null }), bd({ reg_f: 0.5, badge_d: 1015, centre_u: 0.5, trim_min: 127.5, glyph_thick_strokes: 0.62 }), bd({ reg_f: 0.4999 }), bd({ badge_d: 1025, centre_u: 0.4999, centre_v: 0.5, trim_min: 127.4, union_growth: [0.01, 0.01], glyph_thick_strokes: 0.66 }),
    bd({ badge_d: 1035, centre_v: 0.4999, trim_min: 142.5, union_growth: [0.0101, 0], badge_d_over_base_long: 0.49, glyph_ext_over_d: 0.68, glyph_thick_strokes: 0.8 }), bd({ glyph_box: null, badge_d: 694, badge_d_em: 0.339, centre_u: 1.0001, trim_min: 142.6, base_removed: 0.33, union_growth: [0, 0.0101] }),
    bd({ glyph_box: null, badge_d: 685, badge_d_em: 0.334, centre_u: -0.0001, trim_min: 132.5, glyph_thick_strokes: null }), bd({ glyph_box: null, badge_d: 705, centre_v: 1.0, trim_min: 137.5, trim_min_strokes: 0.81 }), bd({ centre_u: 1.0, trim_min_strokes: 2.4, glyph_thick_strokes: 0.69 }), bd({ centre_v: 1.05, trim_min_strokes: 0.7, glyph_thick_strokes: 0.77 }), bd({ trim_min: 210, trim_min_strokes: 1.24, glyph_thick_strokes: 0.71 }),
    bd({ badge_d: 684, centre_u: 0.0, centre_v: 0.0, glyph_ext_over_d: 0.43, glyph_thick_strokes: null, base_removed: 0.13, badge_d_over_base_long: 0.39 }), bd({ badge_d: 695, glyph_box: null, glyph_ext_over_d: 0.7, badge_d_over_base_long: 0.51 }), bd({ centre_v: 0.3, glyph_thick_strokes: null }), { base: 'q', der: 'q.badge', error: 'x' }]);
  fs.writeFileSync(path.join(R, 'sf2/corner.json'), JSON.stringify([1, 2, 3, 3, 4, 3, 1].map((rank) => ({ rank }))));
  const deep = [];
  const st = { 1: 39.75, 400: 170, 1000: 356 };
  for (const w of [1, 400, 1000]) {
    const k = w === 1 ? 0.6 : w === 400 ? 1 : 1.2;
    deep.push({ kind: 'badge', base: 'star', der: 'star.badge', wght: w, stroke: st[w], badge_d: 1000, badge_d_em: 0.49, badge_d_strokes: 5, reg_f: 0.9, centre_u: 0.8, centre_v: 0.2, union_growth: [0, 0], trim_min: null, trim_min_strokes: null, base_removed: 0.1 });   // air not measured
    deep.push({ kind: 'badge', base: 'cloud', der: 'cloud.badge', wght: w, stroke: st[w], badge_d: 819, badge_d_em: 0.4, badge_d_strokes: 4.8, reg_f: 0.9, centre_u: 0.8, centre_v: 0.2, union_growth: [0, 0], trim_min: 131, trim_min_strokes: 0.77, base_removed: 0.1 });
    deep.push({ kind: 'badge', base: 'tray', der: 'tray.badge.plus', wght: w, stroke: st[w] + 0.125, badge_d: 1200, badge_d_em: 0.4001, badge_d_strokes: 7, reg_f: 0.9, centre_u: 0.8, centre_v: 0.8, union_growth: [0.1, 0.1], trim_min: 137, trim_min_strokes: 0.8, base_removed: 0.2 });
    deep.push({ kind: 'badge', base: 'bell', der: 'bell.badge', wght: w, stroke: st[w], badge_d: 690 * k, badge_d_em: 0.33 * k, badge_d_strokes: 4, reg_f: 0.86, centre_u: 0.76, centre_v: 0.16, union_growth: [0, 0], trim_min: 129 * k, trim_min_strokes: 0.76, base_removed: 0.15 });
    const btm = { 1: [70.8, 69.2, 75, 71], 400: [134, 136, 135, 129.5], 1000: [162.1, 120, 165, 163] }[w];
    [['person', 'person.badge.plus'], ['lock', 'lock.badge.clock'], ['video', 'video.badge.plus'], ['photo', 'photo.badge.plus']].forEach(([b, d], i) =>
      deep.push({ kind: 'badge', base: b, der: d, wght: w, stroke: st[w], badge_d: { 1: [900, 946, 990, 1000], 400: [1010, 1016, 1020, 1030], 1000: [1090, 1090, 1091, 1089] }[w][i], badge_d_em: { 1: 0.462, 400: 0.496, 1000: 0.532 }[w], badge_d_strokes: 5.98, reg_f: [0.8, 0.76, 0.84, 0.85][i], centre_u: [0.99, 0.94, 0.03, 0.97][i], centre_v: [0.91, 0.84, 0.86, 0.83][i], union_growth: [[0.28, 0.18], [0.31, 0.1], [0.17, 0.17], [0.18, 0.1]][i], trim_min: btm[i], trim_min_strokes: +(btm[i] / st[w]).toFixed(2), base_removed: [0.21, 0.24, 0.16, 0.19][i] }));
    const bars = { 1: [43.9, 43.9, 42.4, 42.4, 42.4], 400: [154.2, 155.6, 154.2, 156, 154.2], 1000: [183.8, 182.4, 182.4, 182.4, 182.4] }[w];
    const airs = { 1: [82, 80, 85, 79, 90], 400: [118.8, 116, 120, 128, 133], 1000: [152, 150, 160, 151, 149] }[w];
    // the slash records carry a stroke off the badges' (the first a half unit, the rest a quarter: which record names the
    // weight's stroke shows); photo's slash air was not measured
    ['bell', 'lock', 'video', 'person', 'photo'].forEach((b, i) => deep.push({ kind: 'slash', base: b, der: `${b}.slash`, wght: w, stroke: st[w] + (i ? 0.25 : 0.5), reg_f: [0.8, 0.77, 0.89, 0.64, 0.82][i], direction: '\\', angle_from_horizontal: 45, slash_thick: bars[i], slash_thick_strokes: +(bars[i] / st[w]).toFixed(2), slash_len_over_base_diag: [0.96, 1.08, 0.99, 1.08, 1.0][i], trim_min: b === 'photo' ? null : airs[i], trim_min_strokes: b === 'photo' ? null : +(airs[i] / st[w]).toFixed(2), base_removed: [0.17, 0.24, 0.12, 0.38, 0.29][i] }));
    for (const [m, thick] of [['checkmark', 154.8], ['plus', 168], ['xmark', 158.4], ['lock', 221], ['person', 222.1], ['checkmark', 140]])
      deep.push({ kind: 'enclosure', base: m, der: `${m}.circle`, wght: w, stroke: st[w], container_wall: 170 * k, wall_over_stroke: 1, mark_box: [914, 904], base_box: [1723, 1500], thick_ratio: 0.83, mark_thick: thick * k, air_mark_to_wall_strokes: 1.52 });
    if (w === 400) for (const [b, iou] of [['bell', 0.929], ['lock', 1.0]]) deep.push({ kind: 'fill', base: b, der: `${b}.fill`, wght: w, stroke: 170, sil_iou: iou, sil_area_ratio: iou, sil_edge_dev_p95_strokes: 1.39, holes: 0 });
  }
  fs.writeFileSync(path.join(R, 'sf/deep.json'), JSON.stringify(deep));
  const font = path.join(root, 'font.json');
  fs.writeFileSync(font, JSON.stringify(sfFont(names, { ...M, ...M2 })));
  const run = (...a) => spawnSync(process.execPath, [PROBE, pin, ...a, '--refs', refs, '--app', app, '--coreglyphs', cg, '--font-json', font], { encoding: 'utf8' });
  return { root, pin, refs, run };
}
const SF_WORLD_EXPECTED = "\n## The short answer \u2014 the figures that reprint\n1. 15 bases \u2192 53 derivatives; 42 outline \u2192 filled pairs; 15 aliases\n2. 0 of 53 under two parents; 96.2% spelled <base>.<suffix>; 20% of the bases (3 of 15) have exactly one derivative, their .fill\n3. 25 role patterns in 51 names; five cover 54.9%, ten 70.6%\n4. 9 of the 32 tokens already in 2019; bases 6 (2019) \u2192 15\n7. order: enclosure\u2192fill 5:0, slash\u2192fill 1:0, slash\u2192enclosure 2:1, fill vs badge 3:1, enclosure vs badge 4:1; 2 of 5 legacy renames moved fill\n5 \u2013 6. the container boxes reprint in s3.2; the halo in s3.7; the badge, slash and base-kept figures are raster: [not reprintable]\n8. of our 11 concepts, 4 have a parent the filename states (2 numbered, 2 sized), 3 are roots, 2 are modifier-style names; 12 notes\n\n## Sample, and why this one\nNames: 115 names resolved to glyphs \u2014 sure 79 \u00b7 tied 16 \u00b7 likely 17 \u00b7 doubtful 3\nPairs: the 53 base\u2192derivative pairs; 50 have both names resolved (94.3%); 48 of those are spelled <base>.<suffix>\n(Deep sample: 26 hand-picked pairs, identified by eye on contact sheets \u2014 a pick, not a census.)\nFont: 6,900 glyphs (symbol code points; 20,700 glyph outlines with the scale variants), weight axis 1\u20131,000 (default 400), 2048 units per em; named Ultralight at wght 39.75\nUnits: at Regular and Medium the stroke (ring of the circle glyph) is 170.04 units = 8.3% of the em; at the lightest master 39.75, at the heaviest 356.12\nOur side: 11 concepts \u00d7 3 masters \u00d7 2 styles = 66 drawings\n\nDeclared limits:\n- for 14 base\u2192derivative pairs, 22 of 28 base contours matched a derivative contour (control points, within 0.75 units by translation or 1 unit by scale)\n- base map *use* by the app: [needs measuring \u2014 closed-source] (the document says so)\n\n## Instruments \u2014 two checks that the method reads true\n[raster stage not re-run by a committed tool: (a) the slash bar read by the ridge method against a perpendicular profile, on bell.slash and the five slashes, at three weights \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n(b) badge.plus template, Regular small: clear ring 5.700 per 100 em (5.700 across, 5.700 down; the median outline-to-outline offset is 5.701); disc 40.00 (40.00 across); first-layer radius 25.70 \u2212 badge radius 20.00 = 5.700\n    Black: template 6.350 (disc 40.00); Ultralight: template 3.100 (disc 40.00)\n[raster stage not re-run by a committed tool: (b) the font side \u2014 the same ring and disc read from the font by the card's raster method on person.badge.plus and four more badge pairs, at Regular, Black and the named Ultralight \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\n## \u00a71 What Apple declares as data\n| File | Size | Holds | Declares (the measured part) |\n| Metadata/base_symbols_map.json | <1 KB | 15 bases \u2192 53 derivatives | |\n| CoreGlyphs/nofill_to_fill.strings | 1 KB | 42 pairs | |\n| CoreGlyphs/name_aliases.strings | <1 KB | 15 entries | 1 of the 15 old names in the current map; 6 entries point at a name that is (5 distinct) |\n| Metadata/legacy_aliases.strings | <1 KB | 5 entries | 2 move `fill` before a badge |\n| CoreGlyphs/name_availability.plist | 3 KB | 67 symbols, 18 release tags | whole-year tags: 2018 1 \u00b7 2019 16 \u00b7 2020 9 \u00b7 2021 6 \u00b7 2022 7 \u00b7 2023 5 \u00b7 2024 11 \u00b7 2025 2 \u00b7 2026 1 |\n| Metadata/layerset_availability.plist | <1 KB | 2 symbols | |\n| Metadata/symbol_categories.plist + categories.plist | <1 KB | 2 symbols \u00b7 3 categories \u00b7 2.00 per symbol | |\n| Metadata/symbol_search.plist | 3 KB | 2 symbols \u00b7 1.50 terms | |\n| CoreGlyphs/symbol_restrictions.strings | <1 KB | 2 symbols | |\n| CoreGlyphs/semantic_to_descriptive_name.strings | <1 KB | **4** entries | add\u2192plus, organize\u2192folder, search\u2192magnifyingglass |\n| CoreGlyphs/symbol_order.plist | 1 KB | 4 symbols | |\n| CoreGlyphs/legacy_flippable.plist | 1 KB | 2 symbols | |\nOf the 42 declared pairs, 2 are X with its own X.fill; 4 are two derivatives of the same base; 35 involve a name not in the map; 1 are two separate bases\nThe use-name table: 4 entries\nRenames: 15 old names still resolve, 2 of them pure reorders of the same words\nTemplates: 9 loose badge templates; 1 to 5 layers at Regular-S (4 with 3, 2 with 2, 1 with 4, 1 with 1, 1 with 5)\n\n## \u00a72.1 The shape of the relation\n15 bases \u00b7 53 derivatives \u00b7 0 under two parents \u00b7 0 derivatives that are themselves bases \u00b7 mean 3.53 per base, max 10 (f)\n| derivatives per base | 1 | 2 | 3 | 4\u20139 | 10+ |\n| bases | 5 (33.3%) | 4 (26.7%) | 1 (6.7%) | 3 (20.0%) | 2 (13.3%) |\n3 of the 5 single-derivative bases have <base>.fill as their only derivative; 8 bases have a <base>.fill\n13 (86.7%) have some derivative with a fill token; 2 have none (a fill token anywhere in the derivative's name; 12 counting <base>.<suffix> suffixes only)\n51 of 53 derivatives (96.2%) are named <base>.<suffix>; 2 are not\n9 of 15 bases (60.0%) take any container, 8 (53.3%) take circle, 6 (40.0%) a badge, 3 (20.0%) a slash\n\n## \u00a72.2 What the 58 tokens do\n51 base-prefixed derivatives\n| Role | Tokens | Uses |\n| style \u2014 fill | 1: fill 17 | 17 |\n| enclosure shape | 5: circle 14 \u00b7 square 7 \u00b7 rectangle 1 \u00b7 capsule 1 \u00b7 hexagon 1 | 24 |\n| enclosure qualifier | 4: on 2 \u00b7 stack 1 \u00b7 portrait 1 \u00b7 video 1 | 5 |\n| badge | 2: badge 12 \u00b7 trianglebadge 1 | 13 |\n| badge glyph | 8: plus 5 \u00b7 checkmark 2 \u00b7 arrow 2 \u00b7 up 1 \u00b7 down 1 \u00b7 exclamationmark 1 \u00b7 forward 1 \u00b7 xmark 1 | 14 |\n| negation \u2014 slash | 1: slash 6 | 6 |\n| rotation compound | 7: arrow 4 \u00b7 trianglehead 2 \u00b7 clockwise 2 \u00b7 rotate 2 \u00b7 90 2 \u00b7 2 2 \u00b7 counterclockwise 1 | 15 uses in 5 names |\n| style words (rare) | 3: inverse 1 \u00b7 dotted 1 \u00b7 half 1 | 3 |\n| other | 2: ring 1 \u00b7 rtl 1 | 2 |\ntotal distinct tokens 33 (a token in two roles: arrow); distinct token strings 32\ndirection words inside badge glyphs (up, down, forward): 3 uses\n\n## \u00a72.3 The grammar \u2014 coverage and stacking\nRole patterns in the 51 names: 25\n| Pattern | Names |\n| enclosure | 9 |\n| fill | 8 |\n| badge.glyph | 5 |\n| enclosure.fill | 3 |\n| style | 3 |\n| slash | 2 |\n| other (`ring`) | 2 |\n| qual | 2 |\n| slash.fill | 1 |\n| badge.glyph.fill | 1 |\nFive patterns cover 28 of 51 (54.9%); ten cover 36 (70.6%)\nOperator kinds per name: none 15 (29.4%), one 27 (52.9%), two 8 (15.7%), three 1\nTokens per suffix: 1 in 27 (52.9%), 2 in 11 (21.6%), 3 in 8 (15.7%), 4\u20136 in 5\nOne operator and a style: 82.4% of the vocabulary\n\n## \u00a72.4 Is the suffix order fixed?\n| Pair | A before B | B before A |\n| enclosure \u2192 fill | 5 | 0 |\n| slash \u2192 fill | 1 | 0 |\n| slash \u2192 enclosure | 2 | 1 |\n| enclosure \u2192 qualifier | 3 | 0 |\n| badge \u2192 fill | 3 | 1 |\n| enclosure vs badge | 4 | 1 |\n2 of Apple's 5 legacy renames moved fill in front of the badge\n\n## \u00a72.5 Closed grammar, growing lexicon\n| Release | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 |\n| tokens first seen | 9 | 5 | 2 | 1 | 1 | 8 | 2 | 2 |\n| bases first shipped | 6 | 3 | 2 | 2 | 0 | 2 | 0 | 0 |\n2019 enclosure shapes: 2 of 5; later: rectangle 2020, capsule 2025, hexagon 2024\nbadge: badge 2019, trianglebadge 2026; slash: slash 2018; fill: fill 2018\nbadge glyph words first seen: 2019 1 \u00b7 2020 1 \u00b7 2021 1 \u00b7 2022 1 \u00b7 2024 1 \u00b7 2025 1 \u00b7 2026 1\nminor words: stack 2020, video 2020, dotted 2023, half 2020, ring 2024, rtl 2019; rotation compound: arrow 2019, clockwise 2021, 2 2024, 90 2024, counterclockwise 2024, rotate 2024, trianglehead 2024\n26 of 52 derivatives (50%) arrived in a later release than their base (20 by whole year)\n\n## \u00a73.1 The population answer: is the base kept, scaled, or redrawn?\n48 base\u2192derivative pairs (of 50 with both names resolved), regular weight, medium scale\n| Modifier | n | Base in place | Scaled copy | Redrawn | Ink box grows | Layout width unchanged |\n| badge | 6 | (r3.1) | (r3.1) | (r3.1) | 50.0% | 83.3% |\n| badge + fill | 1 | (r3.1) | (r3.1) | (r3.1) | 0.0% | 100% |\n| slash | 1 | (r3.1) | (r3.1) | (r3.1) | 0.0% | 100% |\n| slash + fill | 1 | (r3.1) | (r3.1) | (r3.1) | 0.0% | 100% |\n| fill | 8 | (r3.1) | (r3.1) | (r3.1) | 12.5% | 87.5% |\n| enclosure | 9 | (r3.1) | (r3.1) | (r3.1) | 100% | 0.0% |\n| enclosure + fill | 3 | (r3.1) | (r3.1) | (r3.1) | 100% | 0.0% |\n| rotation compound | 5 | (r3.1) | (r3.1) | (r3.1) | 0.0% | 100% |\n| fill + badge | 1 | (r3.1) | (r3.1) | (r3.1) | 0.0% | 100% |\n| other combinations | 13 | \u2014 | \u2014 | \u2014 | \u2014 | \u2014 |\n[raster stage not re-run by a committed tool: base in place / scaled copy / redrawn (boundary correlation, \u226580% of ink within 8 units; scaled at \u226575% boundary match) \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\n## \u00a73.1 base in place / scaled / redrawn \u2014 from the card's raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run\n19 registration records, 1 errors; 17 spelled <base>.<suffix>\n| Modifier | n | Base in place | Scaled copy | Redrawn |\n| badge | 4 | 25.0% | 0 | 75.0% |\n| badge + fill | 1 | 100.0% | 0 | 0.0% |\n| slash | 1 | 100.0% | 0 | 0.0% |\n| slash + fill | 1 | 0.0% | 0 | 100.0% |\n| fill | 2 | 50.0% | 0 | 50.0% |\n| enclosure | 4 | 25.0% | 25.0% | 50.0% |\n| enclosure + fill | 1 | 100.0% | 0 | 0.0% |\n| rotation compound | 1 | 0.0% | 0 | 100.0% |\n| fill + badge | 1 | 0.0% | 0 | 100.0% |\nscaled copies among the enclosures: 1 of 4 (25.0%)\n\n## \u00a73.2 The container is one drawing\n| Container | Uses | Distinct outer boxes | Commonest box | Share on it |\n| circle | 7 | 2 | 1,040 \u00d7 1,000 | 86% |\n| square | 3 | 2 | 1,000 \u00d7 1,000 | 67% |\n| capsule | 1 | 1 | 1,040 \u00d7 1,000 | 100% |\n| hexagon | 1 | 1 | 1,040 \u00d7 1,000 | 100% |\n10 of 12 container derivatives (83.3%) sit on their token's commonest outer box\nNine cells (three weight masters \u00d7 three scale glyphs), distinct outer boxes of the circle (and the square):\n  large 1: circle 7 uses, 2 boxes (1119\u00d71100 6, 1129\u00d71100 1); square 2 (1100\u00d71100 2, 1110\u00d71100 1)\n  large 1000: circle 7 uses, 2 boxes (1157\u00d71100 6, 1186\u00d71100 1); square 2 (1100\u00d71100 1, 1129\u00d71100 1)\n  large 400: circle 7 uses, 2 boxes (1138\u00d71100 6, 1157\u00d71100 1); square 2 (1100\u00d71100 2, 1119\u00d71100 1)\n  medium 1: circle 7 uses, 2 boxes (1019\u00d71000 6, 1029\u00d71000 1); square 2 (1000\u00d71000 2, 1010\u00d71000 1)\n  medium 1000: circle 7 uses, 2 boxes (1057\u00d71000 6, 1086\u00d71000 1); square 2 (1000\u00d71000 2, 1029\u00d71000 1)\n  medium 400: circle 7 uses, 2 boxes (1038\u00d71000 6, 1057\u00d71000 1); square 2 (1000\u00d71000 2, 1019\u00d71000 1)\n  small 1: circle 6 uses, 1 box (919\u00d7900 6); square 2 (900\u00d7900 2, 910\u00d7900 1)\n  small 1000: circle 7 uses, 2 boxes (957\u00d7900 6, 986\u00d7900 1); square 2 (900\u00d7900 2, 929\u00d7900 1)\n  small 400: circle 7 uses, 2 boxes (938\u00d7900 6, 957\u00d7900 1); square 2 (900\u00d7900 2, 919\u00d7900 1)\nExact bounds: circles 1040 \u00d7 1000 in 6, 1060 \u00d7 1000 in 1; squares 1000 \u00d7 1000 in 2, 1020 \u00d7 1000 in 1\nCircle left edge x: 100 in 6, 120 in 1 (offsets from the common edge: +20); layout width: 1300 in 6, 1310 in 1\nLayout width per container (distinct values): circle 1300\u00d76/1310\u00d71; square 1300\u00d73; capsule 1300\u00d71; hexagon 1300\u00d71\nOur side: cited from findings-primitives.md \u00a72.1 (card 1.1) \u2014 40 outline and 40 filled concepts, one ring per master.\n\n## \u00a73.3 \u2013 3.6, 3.8, 3.9 \u2014 the counts that are data; the rest needs the raster\n[raster stage not re-run by a committed tool: \u00a73.3 the six enclosure pairs (container wall, mark long side and thickness against the standalone mark and the ring wall, air to the wall), the scaled-copy count among the enclosures, the solid-content count among the X.circle pairs \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\u00a73.3 our side: check-circle's check is 9.50 wide against the free check's 17.50 (ink box of the mark path at 24, stroke included)\n\u00a73.4: declared pairs with both names resolved 18 \u2014 container outline \u2192 container fill 14, every other pair 4; X.circle \u2194 X.circle.fill pairs that exist: 2\n[raster stage not re-run by a committed tool: \u00a73.4 silhouette overlap by class, the smaller / larger / same-box shares, the deep-pair overlaps, the line-like mark count and the knockout-to-mark ratio with its percentiles, the three marks' cut widths \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\u00a73.5: slash derivatives with both names resolved: 5\n[raster stage not re-run by a committed tool: \u00a73.5 slashes found, direction and angle, bar weight and its two values, length, air, base ink removed \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\u00a73.6: badge derivatives with both names resolved: 12\n[raster stage not re-run by a committed tool: \u00a73.6 round badges found and registered, disc sizes, centre and corner shares, distances from the corner, box growth, emptiest-corner rank, air, ink removed, glyph size \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n[raster stage not re-run by a committed tool: \u00a73.8 the three-weight table (except the stroke row: see `sample`) and \u00a73.9 the 20 deep pairs at Regular \u2014 needs python3 + skia-python / scipy (user-site installs on this machine) or a JS port of sf_pair.py / sf_meas.py; the arithmetic over the card's saved per-pair records reprints in the r3.* sections]\n\n## \u00a73.4 fill: the outer edge and the cut \u2014 from the card's raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run\n| Pairs | n | Overlap \u2265 0.99 | Overlap \u2265 0.95 |\n| container outline \u2192 container fill | 12 | 50.0% | 91.7% |\n| every other pair | 3 | 33.3% | 66.7% |\n| all | 15 | 46.7% | 86.7% |\nfilled twin smaller than the outline's silhouette by more than 3% in 13.3%, larger in 13.3%; ink box identical to within 2 units in 86%\nthe cut: 16 X.circle \u2194 X.circle.fill pairs; 15 measurable; 13 line-like (thickness \u2264 1.3 ring walls), 2 solid\n| knockout \u00f7 the mark's outline width | p5 1.012 | p25 1.030 | p50 1.040 | p75 1.050 | p95 1.122 |\nby the first word of the name (groups of 5 or more; a reading of \"figure, arrow, chevron \u2026\"): figure 5 (median 1.03)\ncheckmark, plus, xmark cut at 159.8 \u00b7 174.0 \u00b7 165.5 units against outline marks of 154.8 \u00b7 168.0 \u00b7 158.4 (ratios 1.03 \u00b7 1.04 \u00b7 1.04)\n\n## \u00a73.5 slash \u2014 from the card's raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run\n10 slashes found in the 11 slash derivatives; direction \\ in 9, / in 1; within 0.5\u00b0 of 45: 8\nweight: 154 \u2013 156 units in 3 of 10 (30%), 0.91 stroke; 90 \u2013 102 in 3, of which inside a container: 1; median 128.0\nlength \u00f7 base diagonal: median 0.95 (p10 \u2013 p90 0.93 \u2013 0.96)\nair: median 116.7 units (p25 \u2013 p75 116.7 \u2013 119.5; 0.69 stroke; 5.7% em)\nbase ink removed: 20.0% median (p10 \u2013 p90 14.5% \u2013 24.0%)\n\n## \u00a73.6 badge \u2014 from the card's raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run\n15 badge derivatives; 14 with a round badge found; 13 registered against their base\nwith a glyph: 7 of 9 at 1020 (10-unit), median 1016 units = 0.496 em = 5.98 strokes; plain dot: 2 of 4 at 700 (median 694, 0.417 em)\nby diameter alone: 1020 in 7 of 13, 690 \u2013 700 in 3; together 10 (76.9%)\ndisc \u00f7 base long side: p10 \u2013 p90 0.46 \u2013 0.48, median 0.46\n| Centre of the badge in the base's box | RB | LB | RT | LT |\n| share of 13 | 61.5% (8) | 15.4% (2) | 15.4% (2) | 7.7% (1) |\nfrom the nearest corner, in badge radii (a reading): RB across 0.24, down 0.57; LB across 0.98, down 1.30\ncentre inside the base's box in 76.9%\nink box grows in 92.3% (median +20.0% wide, +8.0% tall)\nthe chosen corner ranks (1 = emptiest) 1: 28.6%, 2: 14.3%, 3: 42.9%, 4: 14.3% of 7\nair: median 135.0 units, p5 \u2013 p95 127.5 \u2013 169.6 (0.79 stroke, 6.6% em); rounded to 5, 6 of 13 (46%) are 135 and 10 (76.9%) are 130 \u2013 140\nbase ink removed: median 18.0%, p10 \u2013 p90 18.0% \u2013 18.0%\nglyph: 0.59 \u2013 0.64 (median 0.63) of the disc, 0.71 stroke thick at the median\n\n## \u00a73.3, \u00a73.8, \u00a73.9 the 26 deep pairs \u2014 from the card's raster records (research/references/sfsymbols/card-2.2); the raster itself not re-run\n\u00a73.3 enclosures at Regular: | pair | wall | mark long side \u00f7 standalone | thickness \u00f7 standalone | \u00f7 ring wall | air (strokes) |\n| checkmark \u2192 checkmark.circle | 170 = 1.00 stroke | 0.53 | 0.83 | 0.91 | 1.52 |\n| plus \u2192 plus.circle | 170 = 1.00 stroke | 0.53 | 0.83 | 0.99 | 1.52 |\n| xmark \u2192 xmark.circle | 170 = 1.00 stroke | 0.53 | 0.83 | 0.93 | 1.52 |\n| lock \u2192 lock.circle | 170 = 1.00 stroke | 0.53 | 0.83 | 1.30 | 1.52 |\n| person \u2192 person.circle | 170 = 1.00 stroke | 0.53 | solid | solid | 1.52 |\n| checkmark \u2192 checkmark.circle | 170 = 1.00 stroke | 0.53 | 0.83 | 0.82 | 1.52 |\n\u00a73.8 across the three weights:\n  wght 1 (stroke 39.75): badge air 75.0 \u00b7 1.89 \u00b7 0.037 (units \u00b7 strokes \u00b7 em); slash air 81.0 \u00b7 2.04; slash bar 42.4 \u2013 43.9; disc 990 (0.462 em); mark \u00f7 ring wall 0.91 \u00b7 0.99 \u00b7 0.93\n  wght 400 (stroke 170): badge air 134.0 \u00b7 0.79 \u00b7 0.065 (units \u00b7 strokes \u00b7 em); slash air 119.4 \u00b7 0.70; slash bar 154.2 \u2013 156.0; disc 1020 (0.496 em); mark \u00f7 ring wall 0.91 \u00b7 0.99 \u00b7 0.93\n  wght 1000 (stroke 356): badge air 154.8 \u00b7 0.43 \u00b7 0.076 (units \u00b7 strokes \u00b7 em); slash air 151.5 \u00b7 0.43; slash bar 182.4 \u2013 183.8; disc 1090 (0.532 em); mark \u00f7 ring wall 0.91 \u00b7 0.99 \u00b7 0.93\n  slash bar in strokes: 1.05 \u2013 1.09 \u2192 0.90 \u2013 0.91 \u2192 0.51 \u2013 0.52\n  lightest \u2192 heaviest: the stroke \u00d78.9, the badge air \u00d72.1, the slash bar \u00d74.3 on median bars (\u00d74.2 on mean bars), the badge disc \u00d71.10\n\u00a73.9 fills at Regular: | pair | overlap | area ratio | edge deviation p95 (strokes) | holes |\n| bell \u2192 bell.fill | 0.929 | 0.929 | 1.39 | 0 |\n| lock \u2192 lock.fill | 1.000 | 1.000 | 1.39 | 0 |\n\u00a73.9 slashes at Regular: | pair | base kept | direction \u00b7 angle | bar | bar \u00f7 base diagonal | air | removed |\n| bell \u2192 bell.slash | 0.80 | \\ \u00b7 45.0\u00b0 | 154 = 0.91 stroke | 0.96 | 119 = 0.70 stroke | 17% |\n| lock \u2192 lock.slash | 0.77 | \\ \u00b7 45.0\u00b0 | 156 = 0.92 stroke | 1.08 | 116 = 0.68 stroke | 24% |\n| video \u2192 video.slash | 0.89 | \\ \u00b7 45.0\u00b0 | 154 = 0.91 stroke | 0.99 | 120 = 0.71 stroke | 12% |\n| person \u2192 person.slash | 0.64 | \\ \u00b7 45.0\u00b0 | 156 = 0.92 stroke | 1.08 | 128 = 0.75 stroke | 38% |\n| photo \u2192 photo.slash | 0.82 | \\ \u00b7 45.0\u00b0 | 154 = 0.91 stroke | 1.00 | \u2014 | 29% |\n\u00a73.9 badges at Regular: | pair | base kept | disc | centre (across, down) | box grows (wide \u00b7 tall) | air | removed |\n| star \u2192 star.badge | 0.90 | 5.00 strokes = 0.490 em | (0.80, 0.20) | +0% \u00b7 +0% | \u2014 | 10% |\n| cloud \u2192 cloud.badge | 0.90 | 4.80 strokes = 0.400 em | (0.80, 0.20) | +0% \u00b7 +0% | 131 = 0.77 stroke | 10% |\n| tray \u2192 tray.badge.plus | 0.90 | 7.00 strokes = 0.400 em | (0.80, 0.80) | +10% \u00b7 +10% | 137 = 0.80 stroke | 20% |\n| bell \u2192 bell.badge | 0.86 | 4.00 strokes = 0.330 em | (0.76, 0.16) | +0% \u00b7 +0% | 129 = 0.76 stroke | 15% |\n| person \u2192 person.badge.plus | 0.80 | 5.98 strokes = 0.496 em | (0.99, 0.91) | +28% \u00b7 +18% | 134 = 0.79 stroke | 21% |\n| lock \u2192 lock.badge.clock | 0.76 | 5.98 strokes = 0.496 em | (0.94, 0.84) | +31% \u00b7 +10% | 136 = 0.80 stroke | 24% |\n| video \u2192 video.badge.plus | 0.84 | 5.98 strokes = 0.496 em | (0.03, 0.86) | +17% \u00b7 +17% | 135 = 0.79 stroke | 16% |\n| photo \u2192 photo.badge.plus | 0.85 | 5.98 strokes = 0.496 em | (0.97, 0.83) | +18% \u00b7 +10% | 130 = 0.76 stroke | 19% |\n\n## \u00a73.7 The cut is a layer \u2014 the 26 templates\n9 templates at Regular-S; 5 with the same clear offset, median 5.69 \u2013 5.72 per 100 em\n  differs: badge.a median 5.69, 5.7 \u2013 5.7\n  differs: badge.d median 5.73, 5.7 \u2013 5.7\n  differs: badge.e (no monochrome-0 / -1 pair)\n  differs: badge.q median 5.87, 5.7 \u2013 6.0\nlayers: 4 have 3, 2 have 2, 1 have 4, 1 have 1, 1 have 5\n\n## \u00a74.2 What our names already say\n| | Concepts |\n| numbered shape variants (-2 \u2026) | 2 |\n| sized variants (-small, -large), with and without a number | 2 (1 + 1) |\n| roots (no shorter concept is a prefix) | 3 |\n| modifier-style names (a shorter concept is a prefix) | **2** |\nthe 2: check-circle, users-2-behind\nnames with two candidate prefixes: 1 (users-2-behind)\nparent certain from the name: 4 of 11 (36%); a note in each file: 2 \u00d7 6 = 12 (three masters \u00d7 two styles)\n\n## \u00a75 Findings \u2014 K5, the pair count\nnofill_to_fill.strings (SF Symbols 27.0) declares 42 pairs, or 22 once the 20 locale and direction variants (.ar, .hi, .rtl and 17 more suffixes) are set aside\n(K1 \u2013 K4 and K6 rest on \u00a73's raster figures: [not reprintable] there.)\n\n## \u00a78 Seen and not carried\nof the 49 names in the base map that carry no fill token, 12.2% (6) have a declared fill twin and 43 do not\nnumbered names (a pure-digit token): 5 (the 40 commonest contexts were read by eye \u2014 a judgement)\n10 of the 15 aliases carry a locale or direction suffix; in the base map: 1\nthe plain circle's wall: 153.0 \u00b7 170.0 \u00b7 186.5 units at small \u00b7 medium \u00b7 large (Regular), 10.9 \u00b7 10.6 \u00b7 10.4% of its own width of 1,400 \u00b7 1,600 \u00b7 1,800\n\n## \u00a79 Take / refuse \u2014 the figures it repeats\nT2: Apple 96.2% by name; ours 36% by C9 and C8, 2 judgments for the rest\nR6: X.fill.badge.G vs X.badge.G.fill 1 : 3; 8 names stack two operators\nR7: 87.8% of the base map's non-fill names (43 of 49) have no declared fill twin\nR8: 15 aliases\n(T3, T4, R4 repeat \u00a73.2, \u00a73.7 and \u00a78; T5 \u2013 T7, R1 \u2013 R3, R5 repeat raster figures.)";

test('CLI: every section on the rich synthetic world, outlines from the stand-in font, matches the frozen output; missing records are named', { skip: process.platform !== 'darwin' && 'plutil is macOS-only' }, () => {
  const W = richSfWorld();
  const r = W.run();
  assert.equal(r.status, 0, r.stderr);
  const have = r.stdout.split('\n').slice(1).join('\n').trimEnd().split('\n'), want = SF_WORLD_EXPECTED.split('\n');
  for (let i = 0; i < Math.max(want.length, have.length); i++) assert.equal(have[i], want[i], `line ${i + 2} differs`);
  // a records folder without the fill, cut, badge and corner records: r3.4 and r3.6 name what they lack and print nothing else
  const R = path.join(W.refs, 'sfsymbols', 'card-2.2', 'sf2');
  fs.rmSync(path.join(R, 'fill.jsonl')); fs.rmSync(path.join(R, 'cut.jsonl')); fs.rmSync(path.join(R, 'corner.json')); fs.rmSync(path.join(R, 'badge.jsonl'));
  const m = W.run('r3.4', 'r3.6');
  assert.equal(m.status, 0, m.stderr);
  const lines = m.stdout.split('\n').filter((l) => l && !l.startsWith('#') && !l.startsWith('## '));
  assert.deepEqual(lines, ['[records missing under --refs: fill, cut]', '[records missing under --refs: badge, corner]']);
  fs.rmSync(W.root, { recursive: true, force: true });
});
