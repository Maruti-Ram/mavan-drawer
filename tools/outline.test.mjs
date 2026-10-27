// Tests for the outliner (plans/shipping.md card 1.1): the proof's sample of 16 converts exactly, a ring keeps its
// hole, a file with two weights keeps both, the five files the proof got wrong are right, and the output carries
// nothing but the geometry. `node --test tools/outline.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { check, clean, load, outline, parseSource } from './outline.mjs';

const SAMPLE = ['24/check', '24/plus', '24/circle', '24/plus-circle', '24/search', '24/cloud', '16/search', '16/plus-circle',
  '24/check-filled', '20/chevron-down-filled', '24/plus-circle-filled', '24/alert-circle-filled', '24/bank-filled',
  '24/currency-convert-filled', '24/circle-dashed', '16/pound'];
const WRONG_IN_THE_PROOF = ['16/headphones-3-filled', '20/headphones-3-filled', '16/book-open-2', '20/pen-tool-2', '20/battery-charging'];
// PathOps' other edge cases met on the way: a stem on a ring's centreline (headphones-3), bars leaving a square's
// side where a cap touches it (select-object), two heads whose tiny source arcs sit on ill-conditioned circles
// (users-3-level-filled), a conic split off its circle (power-filled)
const EDGE_CASES = ['24/headphones-3', '20/headphones-3', '24/select-object', '20/select-object', '20/users-3-level-filled', '24/power-filled'];

const read = (rel) => readFileSync(new URL(`../src/icons/${rel}.svg`, import.meta.url), 'utf8');
const master = (rel) => Number(rel.split('/')[0]);
const pathD = (svg) => [...svg.matchAll(/<path\b[^>]*\sd="([^"]*)"/g)].map((m) => m[1]);
const fmt = (b) => `${b.x},${b.y} ${b.w}×${b.h}`;

/** Whether the outlined SVG's ink covers the point, read by Skia under the written fill rule. */
async function covers(svg, x, y) {
  const ck = await load();
  for (const tag of svg.match(/<path\b[^>]*>/g)) {
    const p = ck.Path.MakeFromSVGString(tag.match(/\sd="([^"]*)"/)[1]);
    p.setFillType(/fill-rule="evenodd"/.test(tag) ? ck.FillType.EvenOdd : ck.FillType.Winding);
    const hit = p.contains(x, y); p.delete(); if (hit) return true;
  }
  return false;
}

test('the sample of 16 converts with 0 wrong pixels and the source ink box to 2 dp', async () => {
  for (const rel of SAMPLE) {
    const text = read(rel), out = await outline(text, { master: master(rel) });
    const r = await check(text, out, { master: master(rel) });
    assert.equal(r.wrong, 0, `${rel}: ${r.wrong} wrong pixel(s), largest difference ${r.max}`);
    assert.ok(r.exact, `${rel}: ink ${fmt(r.source)} → ${fmt(r.result)}`);
  }
});

test('the five files the proof got wrong convert exactly', async () => {
  for (const rel of WRONG_IN_THE_PROOF) {
    const text = read(rel), out = await outline(text), r = await check(text, out);
    assert.equal(r.wrong, 0, `${rel}: ${r.wrong} wrong pixel(s)`);
    assert.ok(r.exact, `${rel}: ink ${fmt(r.source)} → ${fmt(r.result)}`);
  }
});

test('the PathOps edge cases met on the way convert exactly', async () => {
  for (const rel of EDGE_CASES) {
    const text = read(rel), out = await outline(text), r = await check(text, out);
    assert.equal(r.wrong, 0, `${rel}: ${r.wrong} wrong pixel(s)`);
    assert.ok(r.exact, `${rel}: ink ${fmt(r.source)} → ${fmt(r.result)}`);
  }
});

test('a ring keeps its hole', async () => {
  const out = await outline(read('24/circle'), { master: 24 });
  assert.equal(pathD(out).length, 1, 'one path');
  assert.equal((pathD(out)[0].match(/M/g) || []).length, 2, 'two contours: the outer edge and the hole');
  assert.ok(await covers(out, 12, 2.4), 'the middle of the stroke is ink');
  assert.ok(!(await covers(out, 12, 12)), 'the centre is white');
  assert.ok(!(await covers(out, 12, 3.9)), 'just inside the stroke is white');
});

test('a closed circle no wider than its pen is a solid dot', async () => {
  const text = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.25 12A0.75 0.75 0 1 0 12.75 12A0.75 0.75 0 1 0 11.25 12Z"/></svg>';
  const out = await outline(text, { master: 24 });
  assert.equal((pathD(out)[0].match(/M/g) || []).length, 1, 'one contour, no pinhole');
  assert.ok(await covers(out, 12, 12));
  const r = await check(text, out, { master: 24 });
  assert.equal(r.wrong, 0); assert.ok(r.exact, fmt(r.result));
});

test('a path at its own weight keeps it beside the root weight', async () => {
  // a line-heavy filled file at 2.5 with a C33 line badge at 1.5
  const text = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<!-- badge: line --><path d="M4 6H14"/><path stroke-width="1.5" d="M4 16H14"/></svg>';
  const out = await outline(text, { master: 24 });
  assert.ok(await covers(out, 9, 6 + 1.1), 'the 2.5 line reaches 1.25 from its centreline');
  assert.ok(!(await covers(out, 9, 16 + 1.1)), 'the 1.5 line stops at 0.75');
  assert.ok(await covers(out, 9, 16 + 0.6));
  const r = await check(text, out, { master: 24 });
  assert.equal(r.wrong, 0); assert.ok(r.exact, fmt(r.result));
  // and the shipped one
  const real = read('24/passkey-2-filled'), realOut = await outline(real, { master: 24 }), rr = await check(real, realOut, { master: 24 });
  assert.equal(rr.wrong, 0); assert.ok(rr.exact, fmt(rr.result));
});

test('the output is geometry alone: no comment, stroke attribute, transform, id or 4-dp number', async () => {
  for (const rel of ['24/check', '24/alert-circle-filled', '24/passkey-2-filled', '16/pound', '24/currency-convert-filled']) {
    const out = await outline(read(rel), { master: master(rel) });
    assert.match(out, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 (24|16) (24|16)" fill="currentColor">(<path fill-rule="evenodd" d="[^"]+"\/>)+<\/svg>\n$/, rel);
    assert.doesNotMatch(out, /<!--|stroke|transform|<g\b|\sid=/, rel);
    assert.doesNotMatch(out, /\d\.\d{4}/, `${rel}: a number over 3 dp`);
    for (const d of pathD(out)) assert.doesNotMatch(d, /[a-z]/, `${rel}: a relative command or an exponent`);
  }
});

test('the source must be what the set draws', async () => {
  await assert.rejects(outline('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="round"><path d="M4 4L8 8"/></svg>'), /round caps/);
  await assert.rejects(outline(read('24/check'), { master: 16 }), /master 16/);
  assert.throws(() => parseSource('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="2" height="2"/></svg>'), /<rect/);
});

test('clean writes 3 dp, splits arcs over 90° and never writes -0', () => {
  assert.equal(clean('M0.00049 -0.0001L3.12345 4H4'), 'M0 0L3.123 4H4');
  assert.equal(clean('M2 12A10 10 0 0 1 22 12'), 'M2 12A10 10 0 0 1 12 2A10 10 0 0 1 22 12');
  assert.equal(clean('M1 1L1 5L5 5Z'), 'M1 1V5H5Z');
});

test('clean leaves out the steps 3 dp cannot see and writes a flat curve as its chord', () => {
  assert.equal(clean('M1 1H7.9961H7.9962V3Z'), 'M1 1H7.996V3Z', 'a line that rounds to nothing');
  assert.equal(clean('M0 0A1 1 0 0 1 0.0001 0.0001L5 5'), 'M0 0L5 5', 'an arc whose ends round together');
  assert.equal(clean('M0 0L1 1Q1.0001 1.0004 1.0002 1.0001L5 5'), 'M0 0L1 1L5 5', "a degenerate conic's quad");
  assert.equal(clean('M6.238 17.186Q6.237 17.185 6.236 17.184A1 1 0 0 1 7 18'), 'M6.238 17.186L6.236 17.184A1 1 0 0 1 7 18', "crown-4's sliver of a circle");
  assert.equal(clean('M1 1L1.0001 1ZM2 2H4V4Z'), 'M2 2H4V4Z', 'a subpath of nothing');
  assert.equal(clean('M0 0Q5 5 10 0'), 'M0 0Q5 5 10 0', 'a real curve stays');
  assert.equal(clean('M0 0C0 0.002 10 0.002 10 0'), 'M0 0C0 0.002 10 0.002 10 0', 'a shallow curve 0.002 off its chord stays');
});

test('the polish: no zero-length step and no stray curve where the source has none', async () => {
  // archive held `H…H` repeats once rounded; crown-4 a sliver quad; 16/chevrons-down-2 a degenerate conic's quads
  for (const rel of ['24/archive', '24/crown-4', '16/chevrons-down-2']) {
    const text = read(rel), out = await outline(text, { master: master(rel) });
    const d = pathD(out)[0];
    assert.doesNotMatch(d, /[QC]/, `${rel}: a curve in the output`);
    let at = null, zero = 0;
    for (const m of d.matchAll(/([MLHVAZ])([^MLHVAZ]*)/g)) {
      const n = m[2].trim().split(/[\s,]+|(?=-)/).filter(Boolean).map(Number);
      const e = m[1] === 'H' ? [n[0], at[1]] : m[1] === 'V' ? [at[0], n[0]] : m[1] === 'Z' ? at : [n.at(-2), n.at(-1)];
      if (m[1] !== 'M' && m[1] !== 'Z' && e[0] === at[0] && e[1] === at[1]) zero++;
      at = e;
    }
    assert.equal(zero, 0, `${rel}: ${zero} zero-length step(s)`);
    const r = await check(text, out, { master: master(rel) });
    assert.equal(r.wrong, 0, `${rel}: ${r.wrong} wrong pixel(s)`);
    assert.ok(r.exact, `${rel}: ink ${fmt(r.source)} → ${fmt(r.result)}`);
  }
});
