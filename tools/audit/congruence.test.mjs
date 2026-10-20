// node --test tools/audit/congruence.test.mjs
//
// Two halves. The synthetic half pins the behaviour down — what must be seen
// as the same shape, what must NOT be, and what the instrument refuses. The
// real-set half reproduces facts already written down in the repo, because a
// measuring tool that cannot reproduce a known number is not measuring.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canonical, classify, congruentUpToScale, congruentUpToTranslation,
  normalise, scaleTrivial, subpathsOfPath, supports, UnsupportedPathError, TOL,
} from './congruence.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ICONS = join(ROOT, 'src', 'icons');
const haveSet = existsSync(join(ICONS, '24'));
const ds = (m, n) => [...readFileSync(join(ICONS, String(m), `${n}.svg`), 'utf8')
  .matchAll(/\sd="([^"]+)"/g)].map((x) => x[1]);
const key = (d) => canonical(d).key;

// ── what must read as ONE shape ────────────────────────────────────────────

test('absolute and relative spell the same line', () => {
  assert.equal(key('M3.75 12H20.25'), key('M3.75 12h16.5'));
  assert.equal(key('M12 5.75V18.25'), key('M12 5.75v12.5'));
  assert.equal(key('M2 2L8 2L8 6'), key('M2 2l6 0l0 4'));
});

test('a ring started at a different one of its own vertices', () => {
  // The same square, the M landing on each corner in turn.
  const a = 'M2 2L8 2L8 8L2 8Z';
  const b = 'M8 2L8 8L2 8L2 2Z';
  const c = 'M8 8L2 8L2 2L8 2Z';
  const d = 'M2 8L2 2L8 2L8 8Z';
  assert.equal(key(b), key(a));
  assert.equal(key(c), key(a));
  assert.equal(key(d), key(a));
});

test('the same circle cut at a different point', () => {
  // The set does this for real: of its 1,184 full circles at 5933041, 1,166
  // are cut left/right and 18 top/bottom, and 1,123 are walked one way round
  // against 61 the other. A tool that called those different circles would
  // report drift between icons that share one drawing exactly.
  const topBottom = 'M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z';
  const leftRight = 'M21 12A9 9 0 1 1 3 12A9 9 0 1 1 21 12Z';
  const quarters = 'M12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21A9 9 0 0 1 3 12A9 9 0 0 1 12 3Z';
  assert.equal(key(leftRight), key(topBottom));
  assert.equal(key(quarters), key(topBottom));
});

test('a ring traversed both ways round', () => {
  assert.equal(key('M12 3A9 9 0 1 0 12 21A9 9 0 1 0 12 3Z'),
    key('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z'));
  assert.equal(key('M2 8L8 8L8 2L2 2Z'), key('M2 2L2 8L8 8L8 2Z'));
});

test('an open run written backwards', () => {
  assert.equal(key('M20.25 12H3.75'), key('M3.75 12H20.25'));
  assert.equal(key('M9 16.5L13.5 12L9 7.5'), key('M9 7.5L13.5 12L9 16.5'));
});

test('the order the subpaths are written in', () => {
  assert.equal(key('M2 8H6M2 2H6'), key('M2 2H6M2 8H6'));
});

test('a straight run cut into pieces', () => {
  assert.equal(key('M3 12L10 12L20.25 12'), key('M3 12H20.25'));
  // Doubling back is NOT a run — it is a different drawing.
  assert.notEqual(key('M3 12L20.25 12L10 12'), key('M3 12H20.25'));
});

test('an arc cut into pieces on the same circle', () => {
  // Two quarter arcs on one circle are one semicircle.
  assert.equal(key('M3 12A9 9 0 0 1 12 3A9 9 0 0 1 21 12'), key('M3 12A9 9 0 1 1 21 12'));
  // Two arcs on circles 0.01 apart stay two arcs — that is a near miss, and a
  // near miss is a finding, not something to weld shut.
  assert.notEqual(key('M3 12A9 9 0 0 1 12 3A9.01 9.01 0 0 1 21 12'), key('M3 12A9 9 0 1 1 21 12'));
});

test('segments that draw nothing', () => {
  assert.equal(key('M2 2H6L6 2'), key('M2 2H6'));             // a repeated point
  assert.equal(key('M2 2A0 0 0 0 1 6 2'), key('M2 2H6'));     // zero radius renders as a line
  assert.equal(key('M2 2H6V2Z'), key('M2 2H6L2 2Z'));         // Z's closing line, written out
  // But a `Z` that does have length is a stroke, and is kept: this one draws
  // out to (6,2) and back, which is not the same drawing as going out alone.
  assert.notEqual(key('M2 2H6Z'), key('M2 2H6'));
});

test('numeric noise, to the stated precision', () => {
  assert.equal(key('M3 12H20.25'), key('M3 12H20.2501'));
  assert.notEqual(key('M3 12H20.25'), key('M3 12H20.26'));
});

// ── what must NOT read as one shape ───────────────────────────────────────

test('a shape and its mirror are NOT congruent — and must not be', () => {
  // Deliberate. In this set `chevron-left` is `chevron-right` flipped, and
  // they are separate drawings carrying their own optical shifts (C14). If
  // these functions folded mirrors together, a primitive census would report
  // one chevron class where the set has two drawings to keep in step. A
  // caller who wants mirror classes flips one `d` itself and asks again.
  const shape = 'M2 2L8 2L8 6Z';
  const mirror = 'M8 2L2 2L2 6Z';
  assert.notEqual(key(shape), key(mirror));
  assert.equal(congruentUpToTranslation(shape, mirror).same, false);
  assert.equal(congruentUpToScale(shape, mirror).same, false);
  // The flipped chevron, which is the real case in the set.
  assert.equal(congruentUpToTranslation('M9 7.5L13.5 12L9 16.5', 'M15 7.5L10.5 12L15 16.5').same, false);
});

test('a half-turned copy is NOT congruent', () => {
  // A scale of -1 is a half-turn, not a resize, so it is rejected.
  const a = 'M2 2L8 2L8 6Z';
  const turned = 'M8 6L2 6L2 2Z';
  assert.equal(congruentUpToScale(a, turned).same, false);
});

test('position and size are differences, in the function that cares', () => {
  const a = 'M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z';
  const moved = 'M12 7A9 9 0 1 1 12 25A9 9 0 1 1 12 7Z';
  const smaller = 'M12 6A6 6 0 1 1 12 18A6 6 0 1 1 12 6Z';
  assert.notEqual(key(a), key(moved));                                  // canonical keeps position
  assert.equal(canonical(a).shape, canonical(moved).shape);             // shape drops it
  assert.equal(congruentUpToTranslation(a, moved).same, true);
  assert.equal(congruentUpToTranslation(a, smaller).same, false);
  assert.equal(congruentUpToScale(a, smaller).same, true);
});

// ── the numbers a caller reads ────────────────────────────────────────────

test('the offset is exact when the move is exact', () => {
  const r = congruentUpToTranslation('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z',
    'M12 7A9 9 0 1 1 12 25A9 9 0 1 1 12 7Z');
  assert.equal(r.same, true);
  assert.deepEqual(r.offset, [0, 4]);
  assert.equal(r.maxDeviation, 0);
});

test('the scale is exact when the resize is exact', () => {
  const r = congruentUpToScale('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z',
    'M8 2A6 6 0 1 1 8 14A6 6 0 1 1 8 2Z');
  assert.equal(r.same, true);
  // `scale` is rounded to 9 decimals to kill float dust, so 2/3 reads back as
  // 0.666666667 rather than 0.6666666666666666.
  assert.ok(Math.abs(r.scale - 1 / 1.5) < 1e-9, `got ${r.scale}`);
  assert.equal(r.maxDeviation, 0);
  // Read the pair as B = scale·A + offset. Resizing a 24 drawing about the
  // canvas centre to fit a 16 canvas needs NO offset: (8,8) = ⅔·(12,12).
  assert.deepEqual(r.offset, [0, 0]);
  // Move it off centre and the offset shows up.
  const r2 = congruentUpToScale('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z',
    'M9 3A6 6 0 1 1 9 15A6 6 0 1 1 9 3Z');
  assert.equal(r2.same, true);
  assert.deepEqual(r2.offset, [1, 1]);
});

test('0.005 out is the same shape; 0.02 out is a near miss', () => {
  // One vertex of a three-point chevron moved. The offset is a BEST FIT, so it
  // absorbs part of the error: moving one of three points by δ leaves a
  // residual of 2δ/3, not δ. Hence 0.005 reads as 0.00333 and 0.02 as 0.01333.
  const base = 'M9 7.5L13.5 12L9 16.5';
  const off005 = congruentUpToTranslation(base, 'M9 7.5L13.505 12L9 16.5');
  assert.equal(off005.same, true);
  assert.ok(Math.abs(off005.maxDeviation - 0.005 * 2 / 3) < 1e-9, `got ${off005.maxDeviation}`);

  const off02 = congruentUpToTranslation(base, 'M9 7.5L13.52 12L9 16.5');
  assert.equal(off02.same, false, 'fails the 0.01 tolerance');
  assert.equal(off02.near, true, 'but lands inside the 0.5 near band — a drift finding');
  assert.ok(Math.abs(off02.maxDeviation - 0.02 * 2 / 3) < 1e-9, `got ${off02.maxDeviation}`);
  assert.ok(off02.maxDeviation > TOL);
});

test('a length error shows as half of itself, because the fit splits it', () => {
  // Stated here so nobody reads maxDeviation as "how much longer".
  const r = congruentUpToTranslation('M3 12H20.25', 'M3 12H20.35');
  assert.ok(Math.abs(r.maxDeviation - 0.05) < 1e-9, `got ${r.maxDeviation}`);
  assert.deepEqual(r.offset, [0.05, 0]);
});

test('a structural mismatch says so instead of guessing', () => {
  const r = congruentUpToTranslation('M2 2H6', 'M2 2H6M2 8H6');
  assert.equal(r.same, false);
  assert.equal(r.maxDeviation, Infinity);
  assert.match(r.reason, /subpath count 1 vs 2/);
  const r2 = congruentUpToTranslation('M2 2L8 2L8 6Z', 'M2 2A4 4 0 0 1 8 6');
  assert.equal(r2.same, false);
  assert.ok(r2.reason);
});

// ── refusing rather than guessing ─────────────────────────────────────────

test('refuses a command it does not know', () => {
  assert.throws(() => canonical('M2 2X6 6'), UnsupportedPathError);
  assert.throws(() => canonical('M2 2X6 6'), /unknown path command "X"/);
  assert.equal(supports('M2 2X6 6'), false);
});

test('refuses a malformed argument list', () => {
  assert.throws(() => canonical('M2 2L8'), /not a multiple of 2/);
  assert.throws(() => canonical('M2 2A9 9 0 1 1 12'), /not a multiple of 7/);
});

test('refuses a path that does not start with a move', () => {
  assert.throws(() => canonical('L8 2'), /starts with "L", not M/);
  assert.throws(() => canonical(''), /empty path/);
  assert.throws(() => canonical(undefined), /empty path/);
});

test('handles the curve commands it is given, including the shorthands', () => {
  // The set has no Bezier at all (measured at 5933041: A 18133 · M 8305 ·
  // L 8159 · H 4294 · Z 3906 · V 3745 · h 204 · l 36 · v 24). Supported
  // anyway, so an imported reference set does not have to be refused.
  assert.ok(supports('M2 2C4 2 6 4 6 6'));
  assert.equal(key('M2 2C4 2 6 4 6 6S8 10 10 10'), key('M2 2C4 2 6 4 6 6C6 8 8 10 10 10'));
  assert.equal(key('M2 2Q4 2 6 6T10 10'), key('M2 2Q4 2 6 6Q8 10 10 10'));
  assert.equal(congruentUpToTranslation('M2 2C4 2 6 4 6 6', 'M2 5C4 5 6 7 6 9').same, true);
});

// ── the pieces a census is built from ─────────────────────────────────────

test('subpathsOfPath carries the current point across a subpath break', () => {
  // A string split on "M" cannot do this: the second subpath's `h` is relative
  // to where the first one left off.
  assert.deepEqual(subpathsOfPath('M2 2h4m0 6h4'), ['M2 2L6 2', 'M6 8L10 8']);
});

test('normalise reports what it found', () => {
  const n = normalise('M2 2H6V8H2Z');
  assert.equal(n.subpaths.length, 1);
  assert.equal(n.subpaths[0].closed, true);
  assert.equal(n.subpaths[0].ring, true);
  const o = normalise('M2 2H6V8');
  assert.equal(o.subpaths[0].closed, false);
  assert.equal(o.subpaths[0].ring, false);
});

// ── classify ──────────────────────────────────────────────────────────────

test('classify groups the same drawing wherever it is', () => {
  const sq = (x, y) => `M${x} ${y}L${x + 6} ${y}L${x + 6} ${y + 6}L${x} ${y + 6}Z`;
  const res = classify([
    { id: 'a', d: sq(2, 2) },
    { id: 'b', d: sq(10, 2) },                                 // moved
    { id: 'c', d: `M${8} ${2}L${8} ${8}L${2} ${8}L${2} ${2}Z` }, // same square, other way round
    { id: 'd', d: 'M2 2H6' },                                    // on its own
  ]);
  const squares = res.groups.find((g) => g.size === 3);
  assert.deepEqual(squares.members, ['a', 'b', 'c']);
  assert.equal(squares.representative, 'a');
  assert.equal(squares.maxDeviation, 0);
  assert.equal(res.stats.singletons, 1);
  assert.equal(res.groups.length, 2);
});

test('classify reports the near misses, nearest first', () => {
  const res = classify([
    { id: 'exact', d: 'M9 7.5L13.5 12L9 16.5' },
    { id: 'off-0.3', d: 'M9 7.5L13.8 12L9 16.5' },
    { id: 'off-0.06', d: 'M9 7.5L13.56 12L9 16.5' },
    { id: 'miles-away', d: 'M9 7.5L30 12L9 16.5' },
  ], { near: 0.5 });
  const ids = res.nearMisses.map((n) => [n.a, n.b].sort().join(' vs '));
  assert.ok(ids.includes('exact vs off-0.06'), JSON.stringify(ids));
  assert.ok(ids.includes('exact vs off-0.3'), JSON.stringify(ids));
  assert.ok(!ids.some((s) => s.includes('miles-away')), 'past the near band is not a finding');
  // nearest first: the tightest near miss is the likeliest accident
  assert.deepEqual(res.nearMisses.map((n) => n.maxDeviation),
    [...res.nearMisses.map((n) => n.maxDeviation)].sort((a, b) => a - b));
});

test('classify in scale mode collapses a family drawn at three sizes', () => {
  const ring = (c, r) => `M${c} ${c - r}A${r} ${r} 0 1 1 ${c} ${c + r}A${r} ${r} 0 1 1 ${c} ${c - r}Z`;
  const res = classify([
    { id: '24', d: ring(12, 9) }, { id: '20', d: ring(10, 7.5) }, { id: '16', d: ring(8, 6) },
  ], { mode: 'scale' });
  assert.equal(res.groups.length, 1);
  assert.equal(res.groups[0].size, 3);
  // The representative is the lexicographically smallest id — here '16' — and
  // the scales are measured FROM it, so they run up, not down.
  assert.equal(res.groups[0].representative, '16');
  assert.deepEqual(res.groups[0].scales, [1, 1.25, 1.5]);
});

test('scale mode admits when "same" means nothing', () => {
  // Every circle is a scaled circle and every horizontal line is a scaled
  // horizontal line, so these matches carry no information. Unflagged, they
  // would be read as drift findings: on the real set the three biggest
  // scale-mode classes over the 24 and 16 outline subpaths are exactly this,
  // holding 463, 380 and 319 members (measured at 5933041).
  assert.equal(scaleTrivial('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z'), true);   // bare circle
  assert.equal(scaleTrivial('M3 12H20.25'), true);                             // straight run
  assert.equal(scaleTrivial('M9 7.5L13.5 12L9 16.5'), false);                  // a chevron has an angle
  assert.equal(scaleTrivial('M2 2H6M2 8H6'), false);                           // a gap against a length
  const r = congruentUpToScale('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z',
    'M4 2A2 2 0 1 1 4 6A2 2 0 1 1 4 2Z');
  assert.equal(r.same, true);
  assert.equal(r.trivial, true, 'the container ring vs a dot: both circles, nothing learned');
  // Translation mode has no such hole — there "same" always means same shape.
  assert.equal(congruentUpToTranslation('M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z',
    'M4 2A2 2 0 1 1 4 6A2 2 0 1 1 4 2Z').same, false);
  const cls = classify([
    { id: 'big', d: 'M12 3A9 9 0 1 1 12 21A9 9 0 1 1 12 3Z' },
    { id: 'small', d: 'M4 2A2 2 0 1 1 4 6A2 2 0 1 1 4 2Z' },
  ], { mode: 'scale' });
  assert.equal(cls.groups[0].size, 2);
  assert.equal(cls.groups[0].trivial, true);
});

test('classify lists what it refused instead of throwing', () => {
  const res = classify([{ id: 'ok', d: 'M2 2H6' }, { id: 'bad', d: 'M2 2X6 6' }]);
  assert.equal(res.groups.length, 1);
  assert.deepEqual(res.unsupported, [{ id: 'bad', reason: 'unknown path command "X"' }]);
  assert.equal(res.stats.classified, 1);
});

// ── reproducing what the repo already says ────────────────────────────────

test('(a) ban and ban-2 ship identical outlines — docs/09:57', { skip: !haveSet }, () => {
  for (const m of [24, 20, 16]) {
    const a = ds(m, 'ban'), b = ds(m, 'ban-2');
    assert.equal(a.length, b.length, `${m}: path counts`);
    for (let i = 0; i < a.length; i++) {
      const r = congruentUpToTranslation(a[i], b[i]);
      assert.equal(r.same, true, `${m} path ${i}`);
      assert.equal(r.maxDeviation, 0);
      assert.deepEqual(r.offset, [0, 0], 'identical, not merely congruent');
    }
    // The other half of the fact, which docs/09 does not state: the FILLED
    // twins are not identical at all. ban-filled keeps a hollow ring plus the
    // bar (2 paths); ban-2-filled is one composed shape (1 path).
    assert.notEqual(ds(m, 'ban-filled').length, ds(m, 'ban-2-filled').length);
  }
});

test('(b) grid-3/grid-4/more-* filled == outline at 24 and 20, not at 16',
  { skip: !haveSet }, () => {
    for (const n of ['grid-3', 'grid-4', 'more-horizontal', 'more-vertical']) {
      for (const m of [24, 20]) {
        const o = ds(m, n), f = ds(m, `${n}-filled`);
        assert.equal(o.length, f.length, `${n} ${m}`);
        for (let i = 0; i < o.length; i++) {
          const r = congruentUpToTranslation(o[i], f[i]);
          assert.equal(r.same, true, `${n} ${m} path ${i}`);
          assert.equal(r.maxDeviation, 0);
        }
      }
      // At 16 they diverge: C17 repeated elements thicken in place, so the
      // filled dot has a smaller radius and a shifted centre.
      const o = ds(16, n), f = ds(16, `${n}-filled`);
      const worst = Math.max(...o.map((d, i) => congruentUpToTranslation(d, f[i]).maxDeviation));
      assert.ok(worst > TOL, `${n} 16 should differ, got ${worst}`);
    }
  });

test('(c) the volume family reproduces lint\'s "N of M paths identical"',
  { skip: !haveSet }, () => {
    // Exactly lint's 30 note lines (tools/lint.mjs:612), read from a lint run
    // at 5933041: the same five counts at every master and in both styles.
    const expected = { 'volume-low': [2, 2], 'volume-minus': [1, 2], 'volume-none': [1, 1], 'volume-plus': [1, 3], 'volume-x': [1, 3] };
    for (const m of [24, 20, 16]) {
      for (const [n, [same, total]] of Object.entries(expected)) {
        for (const style of ['', '-filled']) {
          const anchor = ds(m, `volume${style}`), mine = ds(m, `${n}${style}`);
          assert.equal(mine.length, total, `${m} ${n}${style} path count`);
          const hits = mine.filter((d) => anchor.some((a) => congruentUpToTranslation(a, d).same));
          assert.equal(hits.length, same, `${m} ${n}${style} shared paths`);
          // C28: the body stays in place. Every shared path is shared AT the
          // same coordinates, which is why lint's string equality happens to
          // get this family right.
          for (const d of hits) {
            const r = anchor.map((a) => congruentUpToTranslation(a, d)).find((x) => x.same);
            assert.deepEqual(r.offset, [0, 0], `${m} ${n}${style} shares a MOVED path`);
          }
        }
      }
    }
  });

test('(d) the container ring across masters — and why "congruent up to scale" is the wrong question for it',
  { skip: !haveSet }, () => {
    const ringOf = (m, n) => {
      for (const d of ds(m, n)) {
        for (const sd of subpathsOfPath(d)) {
          const c = canonical(sd);
          if (c.subpaths[0].closed && /^Z A/.test(c.subpaths[0].tagKey)) return sd;
        }
      }
      return null;
    };
    for (const n of ['plus-circle', 'x-circle', 'alert-circle', 'check-circle', 'ban', 'info-circle', 'help-circle']) {
      const a = ringOf(24, n), b = ringOf(16, n);
      assert.ok(a && b, `${n}: no all-arc ring at both masters`);
      const r = congruentUpToScale(a, b);
      assert.equal(r.same, true, `${n}: 24 ring vs 16 ring`);
      assert.equal(r.maxDeviation, 0);
      // …but `same` here is vacuous and the tool says so: a bare ring is one
      // circle, and EVERY circle is a scaled circle. Do not read this line as
      // "the ring survives the master change" — it would pass against a dot.
      assert.equal(r.trivial, true);
      // The factor is the finding, not the match. 6.375 / 9.25 = 0.689, where
      // a proportional shrink would be 16/24 = 0.667: the ring at 16 is 3.4%
      // bigger than proportional. And it does not follow one law — 24→20 goes
      // the other way (7.25/9.25 = 0.784 against 20/24 = 0.833, 6% SMALLER).
      assert.equal(r.scale, 0.689189189, `${n}: scale`);
      assert.ok(r.scale > 16 / 24, 'the 16 ring is bigger than proportional');
      const twenty = congruentUpToScale(a, ringOf(20, n));
      assert.equal(twenty.scale, 0.783783784, `${n}: 24 -> 20 scale`);
      assert.ok(twenty.scale < 20 / 24, 'the 20 ring is smaller than proportional');
    }
    // What the ring IS, measured up to TRANSLATION, where "same" means
    // something: at each master every one of these icons carries the exact
    // same ring, residual 0. That is the real shared-primitive result.
    for (const m of [24, 20, 16]) {
      const base = ringOf(m, 'plus-circle');
      for (const n of ['x-circle', 'alert-circle', 'check-circle', 'ban', 'info-circle', 'help-circle']) {
        const r = congruentUpToTranslation(base, ringOf(m, n));
        assert.equal(r.same, true, `${m} ${n}: ring differs from plus-circle's`);
        assert.deepEqual(r.offset, [0, 0], `${m} ${n}: ring is in a different place`);
      }
    }
  });

test('the whole set parses — nothing is refused', { skip: !haveSet }, () => {
  let paths = 0, elements = 0, refused = [];
  for (const m of [24, 20, 16]) {
    for (const f of readdirSync(join(ICONS, String(m)))) {
      if (!f.endsWith('.svg')) continue;
      elements += readFileSync(join(ICONS, String(m), f), 'utf8').match(/<path\b/g)?.length ?? 0;
      for (const d of ds(m, f.replace(/\.svg$/, ''))) {
        paths++;
        try { canonical(d); } catch (e) { refused.push(`${m}/${f}: ${e.reason}`); }
      }
    }
  }
  assert.deepEqual(refused, []);
  // This reads the live set, which grows with every approval, so a fixed count cannot stand here
  // (7,500 at 5933041; 7,476 after sitting A's renames, 078e783; 11,998 on 2026-10-20). What it
  // guards is that the walk read the whole set: one `d` for every <path>, counted apart.
  assert.ok(paths > 0, 'the set was read');
  assert.equal(paths, elements, 'one d per <path> element');
});
