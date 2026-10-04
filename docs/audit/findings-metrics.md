# Findings — metrics truthfulness (F12)

Audit card **1.12** (`plans/set-and-rules-audit.md:438`). Axis **F12, honest metrics**.
`dist/metrics.json` is the product's differentiator (`CLAUDE.md:263-267`): a customer subtracts its
bearings as negative margins so that `padding` and `gap` become literally true. A wrong bearing is
a wrong layout, by that much, on every page that uses the icon.

**Pinned tree `5933041`, measured from the archived pin.** `git archive 5933041` was extracted into
the session scratchpad and `node tools/build.mjs` run there. The rebuilt `lab/manifest.json` is
byte-identical to the one committed at the pin, so the `dist/metrics.json` checked here is exactly
what the pinned build publishes: 485 concepts × 3 masters × 2 styles = **2,910 entries**.
`node tools/lint.mjs` at the end of this work: **2,910 drawings · 2,848 clean · 62 warned · 0
failed** — the baseline. `npm run build` and `npm run check` were never run in the repo; nothing in
`src/icons/`, `dist/`, `lab/`, `research/`, the docs or `tools/` outside `tools/audit/` was touched.

**Independently checked.** A fresh reviewer (Fable) who had not seen my scripts re-measured about
80 of this document's numbers and about 60 of its citations with its own library — its own parser,
and an exact ink edge for straight runs and circular arcs. Every headline held, every citation was
right, and it reproduced the faithfulness proof on all 7,528 non-null sides. It also found numbers
that did not reproduce: a mislabelled box dimension, a second published copy of the geometric
bearing I had not compared, counts taken on a too-coarse edge or on mismatched scanline grids, a
shift band, a twin count taken on a different stability test, quantiles, an unstated enclosure test,
a mirror-pair count, and the `gap` of `globe` and `language-2`, which my first tool never compared.
The tool was rebuilt on an exact edge, every figure below is re-measured with it, and this version
carries all those corrections. Where the reviewer's figures and mine still differ, both are given
with the definition that separates them (§3.3, §3.4, §5, §7, §11.3). I dispute one judgement: that
the build's displaced scanline grid is the main cause of §3.3's misreadings — measured, it explains
59 of the 152 sides and 1.27 of the 6.41 units (§3.3).

**The question this card answers:** *is every number `dist/metrics.json` publishes true to the
drawing it describes, and true to what the docs say it means?*

---

## What a customer would see

The **ink box and the geometric bearings** (where ink stops) are honest: all 2,910 entries are
within about a hundredth of a unit (0.0101) of the exact drawing, half-stroke and round caps
included — though each side's geometric bearing is published twice, and the two copies disagree by
0.01 on 59 sides.

The **optical bearings** (where ink reads as stopping) — the part the product sells — are not:

- **Every shape-filled drawing, 1,026 of them, publishes no optical correction.** Beside a label,
  the filled `plus-circle` sits 0.71 px further away than the outline `plus-circle` at 24 px
  (1.42 px at 48), although the two have the same silhouette. Worst: 1.02 units (2.03 px at 48).
- **On 635 entries the optical number is a knife-edge reading.** Move the drawing by two
  thousandths of a unit — nothing a screen can show — and it changes by more than 0.05, by up to
  1.29. The exact mirror images `menu-arrow-left` and `menu-arrow-right` publish top bearings
  0.31 apart.
- **A line-heavy filled twin can read up to 1.63 units further in than its outline**, with an
  identical ink box: toggling `italic` to `italic-filled` jumps the icon 1.62 px at 24.
- **`paintbrush-4` publishes `null`** at 24 and 20.

The descriptive fields are worse than the spacing ones: `container` is false on 81 entries and
missing on 348, `gap` describes a non-glyph on 31 entries and is missing on 57 glyphs, and `shift`
cannot say where 177 off-centre drawings sit. **The README's "13.7–16.2px" was never measured**,
and at the pin `padding: 12px` renders **14.00–24.05 px** of visual padding at 24 px.

---

## 0. Method, and how to read a number

**The instrument.** `tools/audit/metrics-check.mjs` (new; audit-only, imported by nothing in lint,
build or the lab) recomputes every field from the SVG, **independently of `tools/geometry.mjs` and
`tools/optical.mjs`**: its own path parser; SVG 1.1 F.6.5 arc centres with F.6.2's out-of-range
rules (a zero-length arc is omitted, a radius too short for its chord is scaled up); arc and Bézier
extremes solved, not sampled. **The ink edge on a scanline is exact** for straight runs and
circular arcs — a stroke's ink is bounded by two lines (or two circles) half a stroke either side of
its centreline, plus its round caps — and sampled only on elliptical arcs, every 0.0005 unit. Ink is
the set's own declared paint: a stroke inks every point within half its width of its centreline
(that *is* round cap + round join, declared on all 2,910 roots); an area inks the inside of its
outline, where a shape drawn inside another shape is a hole, not ink (SVG's even-odd fill). **27
tests** in `metrics-check.test.mjs`. It never touches `raster.mjs`, so that file's known `classify`
defect (`raster.mjs:257`, plan "Known instrument defects") cannot reach any figure here.

**Precision, in one line:** boxes solved; edges exact (elliptical arcs to under 1e-7); a step
counts as exactly one stroke when it is within 1e-6 of it; the stability probe slides the grid by
0.002 and treats edges within 0.02 of each other as tied.

**The census it rests on** (2,910 files, 7,500 `<path>`s): only `M L H V A Z` and relative `l h v`;
**18,133 arcs** — 18,126 drawn and 7 with identical endpoints, which SVG omits — of which **312 are
elliptical**, and all unrotated; **zero Béziers**. Every root is `fill="none" stroke="currentColor"
stroke-linecap="round" stroke-linejoin="round"`; every viewBox is `0 0 n n`; all **1,579** area
paths are `fill="currentColor" fill-rule="evenodd" stroke="none"` with those attributes before `d`
(so the build's attribute regex, `build.mjs:19-22`, classifies every one correctly); **no** path
carries its own `stroke-width` or a `transform`. 342 concepts are shape-filled at every master
(1,026 files), 138 of them with leftover strokes (414 files); 143 are line-heavy (429 files).

**The optical model is taken as specified, not re-invented.** `tools/optical.mjs:41-68` is the
specification: on scanlines every 0.25, the outermost ink; then the mean, over every inked scanline,
of how far each recedes from the extreme — counting only the run contiguous with the extreme, each
scanline capped at one stroke, the run ended by any step larger than one stroke — and
`optical = geometric + 0.75 × recession`. `modelRecession` restates it. **Proof it is faithful:**
fed the build's own samples, it reproduces the published recession on **all 7,528 non-null sides of
the 1,884 stroke-only drawings** (the 8 sides of the two `null` entries all publish 0). Every
disagreement below is therefore *the drawing's true edge against the build's reading of it*, never
two different models.

**Terms used throughout.** The **exact model** is that specification applied to the true edge, a
step within 1e-6 of one stroke continuing the run (the specification says "larger than",
`optical.mjs:53`). The **stability range** of a side is the lowest-to-highest optical bearing over
every combination of three changes no eye could see: the scanline grid slid by −0.002, 0 or +0.002;
a step of exactly one stroke read as continuing or as breaking; and the run started from any
scanline within 0.02 of the outermost edge. **p90** is the value 90% of sides stay at or under;
quantiles interpolate between neighbouring values.

**Units to pixels.** The file is in master units and says so nowhere; it carries no unit and no
scale. The only statement of the rule is `docs/01:26-28` ("At render size 24 one unit is one CSS
pixel"). Customers choose their own size (`CLAUDE.md:192`) and only 24 and 48 are crisp from the 24
master (`CLAUDE.md:312`). This document assumes:

| render size | master | 1 unit is |
|---|---|---|
| 16 px | 16 | 1 px |
| 20 px | 20 | 1 px |
| 24 px | 24 | 1 px |
| 32 px | 24 | 1.33 px |
| 48 px | 24 | 2 px |

A customer who renders the 16 master at 32 doubles its numbers instead.

**Three kinds, never in one line:** **(1)** a published number disagrees with the drawing;
**(2)** the code disagrees with a doc's statement of what the number means; **(3)** the number is
computed as specified but the specification is wrong for a customer.

**Where each figure comes from.** Build the pin — `git archive 5933041 | tar -x -C <pin>` and
`(cd <pin> && node tools/build.mjs)` — then:

| Figures in | Command |
|---|---|
| §1, the summary block | `node tools/audit/metrics-check.mjs <pin>/src/icons <pin>/dist/metrics.json` |
| §0 census and faithfulness | `node tools/audit/metrics-probe.mjs <pin> census faithful` |
| §1, the per-master table | `… metrics-probe.mjs <pin> fields` |
| §2, §7, §11.3 | `… boxes` |
| §3.1, §3.2 | `… optical` |
| §3.3 | `… edges` |
| §3.4 | `… knife mirror` |
| §3.5 | `… twins` |
| §4 | `… shift` |
| §5 | `… container` |
| §6 | `… gap` |
| §8 | `… padding` |
| §10, exposure | `… exposure` |
| the single-drawing examples in §2, §3.2–§3.4, §5–§7 and §11.1 | `… examples` |

The `faithful`, `edges`, `boxes` and `padding` sections import the pin's own `tools/geometry.mjs`
and `tools/optical.mjs` on purpose: they ask what the build itself computes. All sections together
take about 20 seconds.

---

## 1. Every field, measured

The verifier's own summary at the pin:

```
2910 drawings checked against …/pin/dist/metrics.json
ink/bearing: max |published - exact| 0.0101 units; entries not equal to one correct 2-dp rounding: 71; sides whose optical.geometric differs from bearing: 59 (49 entries)
optical: null published 2 · shape-filled with recession forced to 0 1026 (understated > 0.01 on 4084 sides)
optical, stroke-only drawings: |published - exact model| > 0.01 on 152 sides (108 entries)
optical model: stability range > 0.05 on 1162 sides (635 entries)
shift: declared and drawn differ by > 0.01 on 12 · undeclared, ink off-centre by > 0.005 on 177
container: published 438 · not a closed ring enclosing the rest 81 · null on a shape-filled drawing whose outline twin has one 348
gap: published 64 · on a drawing without a glyph: dot note 31 · whose "dot" is not a dot 6 · glyph: dot declared, gap null 57
```

| Field | What it claims (where) | True? | Worst error — units → px | Entries affected |
|---|---|---|---|---|
| `ink` x · y · w · h | the ink box (`build.mjs:31-43`; `CLAUDE.md:263`) | **yes**, to 0.0101 | 0.0101 → 0.01 px at 16–24, 0.02 at 48 | 8 not one correct 2-dp rounding (§7) |
| `bearing` l · t · r · b | "geometric — where ink stops" (`build.mjs:88`) | **yes**, to 0.0101 | same | 69 not one correct rounding; 49 symmetric drawings published 0.01 asymmetric (§7) |
| `optical.*.geometric` | the same number as `bearing` | **no**: differs from `bearing` by 0.01 on 59 sides; `null` on 8 | 0.01 → 0.02 px at 48 | 49 entries (§7) · `paintbrush-4` at 24 and 20 (§3.2) |
| `optical.*.recession` | mean recession of the edge (`optical.mjs:46-68`) | **no** on 1,136 entries | 1.36 (0.75 × it is the optical error) | 1,026 forced to 0 · 108 misread · 2 empty |
| `optical.*.optical` | "where ink *reads* as stopping" (`build.mjs:89`; `CLAUDE.md:264`) | **no** | 1.02 understated (shape-filled); 0.55 misread (stroke); `null` ×2 | 1,026 · 108 · 2 — and a knife-edge on 635 (§3.4) |
| `shift` | "declared optical offset from the box centre (C14)" (`build.mjs:87`; `docs/07:54`) | equals its note on all 270 declared; equals the drawn offset within 0.005 on 211, within 0.01 on 258 | 0.45 (`info-2` at 24) declared but not drawn; 5.0 drawn but not declared | 12 · 177 (§4) |
| `container` | "the silhouette's ink diameter, when there is one" (`build.mjs:90`) | the 357 genuine ones, to 0.005 | no spacing use | 81 false · 348 missing (§5) |
| `ratio` | "mark ink box ÷ container" (`build.mjs:91`; `docs/08:226`) | where the container is genuine, to 0.0054 | no spacing use | follows `container` |
| `gap` | "a glyph mark's dot-to-body void, and it ÷ the dot" (`build.mjs:92`; `docs/08:227`) | on every declared glyph that publishes one (33), to 0.005 | no spacing use; readings off by up to 0.13 | 31 non-glyph (the 6 false dots among them) · 57 missing · 5 off by more than 0.01 (§6) |

`dist/icons.json` and `lab/manifest.json` carry the same values (plus `markBox`, which `ratio` is
taken from, and `stroke`, which equals the root `stroke-width` on all 2,910).

**Per master and style** (every count is entries unless it says sides; off-centre is a distance,
√(dx² + dy²)):

| master | style | entries | ink/bearing max err | optical understated, median / max | stroke misread > 0.01: sides / entries, max | knife-edge > 0.05: sides / entries, widest | `shift` declared ≠ drawn / off-centre undeclared (max) | `container` published / false / missing | `gap` published / non-glyph / false dot / declared-null |
|---|---|---|---|---|---|---|---|---|---|
| 24 | outline | 485 | 0.0100 | — | 36 / 27, 0.08 | 173 / 92, 1.03 | 2 / 28 (5.00) | 133 / 16 / — | 21 / 10 / 2 / 4 |
| 24 | line-filled | 143 | 0.0069 | — | 3 / 2, 0.03 | 62 / 27, 1.27 | 0 / 11 (0.11) | 8 / 7 / — | 1 / 1 / 0 / 0 |
| 24 | shape-filled | 342 | 0.0080 | 0.26 / 1.02 | — | 139 / 77, 0.92 | 2 / 17 (5.00) | 5 / 4 / 116 | 0 / 0 / 0 / 15 |
| 20 | outline | 485 | 0.0066 | — | 44 / 29, 0.53 | 195 / 109, 0.99 | 2 / 27 (4.00) | 133 / 16 / — | 20 / 9 / 2 / 4 |
| 20 | line-filled | 143 | 0.0073 | — | 3 / 3, 0.03 | 51 / 26, 1.29 | 0 / 15 (0.25) | 8 / 7 / — | 1 / 1 / 0 / 0 |
| 20 | shape-filled | 342 | 0.0066 | 0.26 / 1.00 | — | 159 / 90, 0.99 | 2 / 15 (4.00) | 5 / 4 / 116 | 0 / 0 / 0 / 15 |
| 16 | outline | 485 | 0.0101 | — | 62 / 43, 0.55 | 175 / 99, 0.72 | 2 / 31 (3.50) | 133 / 16 / — | 20 / 9 / 2 / 4 |
| 16 | line-filled | 143 | 0.0079 | — | 4 / 4, 0.04 | 62 / 30, 1.02 | 0 / 14 (0.13) | 8 / 7 / — | 1 / 1 / 0 / 0 |
| 16 | shape-filled | 342 | 0.0070 | 0.20 / 0.83 | — | 146 / 85, 0.72 | 2 / 19 (3.50) | 5 / 4 / 116 | 0 / 0 / 0 / 15 |

---

## 2. Does the metric describe what ships?

**The box does.** The shipped format is outlined fills (`CLAUDE.md:186`), and it is not built yet:
`build.mjs` emits the stroked source (`docs/09:44`). For round caps and round joins the outline of a
stroke is exactly its centreline swept by a disc of half the width, so the outlined shape's box is
the centreline box grown by half the width on every side — which is what `build.mjs:39` computes.
The recomputation agrees to 0.0101 on all 2,910. The half-stroke and the caps are in:
`M3.75 12h16.5` at 24 gives ink 3 → 21, `M1.625 8h12.75` at 16 gives 1 → 15 (CLAUDE.md's rule 1;
pinned in the tests). How far an arc-approximating outliner would move those edges is
`[needs measuring]` — no outliner exists.

**Twins hold their geometric bearings.** Of 1,455 outline/filled pairs, 54 publish geometric
bearings 0.02 or more apart, and **all 54 carry a `grows:` note**. (A strict "more than 0.01" test
on two-decimal numbers is decided by floating-point noise: it flags 85 pairs, 31 of them without a
note.) Their optical bearings do not hold (§3.1, §3.5).

**(2)** `CLAUDE.md:254` calls `geometry.mjs` "**exact** arc bboxes" and `geometry.mjs:1` "true arc
extents"; `bbox()` samples every arc at 64 points (`geometry.mjs:43`). Measured against the exact
centreline box: off by at most **0.0056** (`rotate-ccw` at 24, x1 20.1244 for 20.1300) — 0.011 px
at 48. Harmless, but `references-fluent.md:60` leans on the same "exact" wording.

**(2)** The README's two examples of the optical pass hold at the pin: `arrow-right` is asymmetric
(recession 0.05 at the shaft end, 1.11 at the head) and `plus` gets almost none (0.03 every side)
(`README.md:67-68`). Its "`plus` has 3 units of bearing, `chevron` has 5" is already corrected in
`stale-statements.md:192`; measured here the same: `plus` 4.5, `plus-large` 3, `chevron-down` 5
left and right, 8.79 / 7.78 top and bottom.

---

## 3. The optical bearing

### 3.1 Shape-filled drawings publish no optical correction

**What a customer sees.** A filled icon sits further from its label than its outline twin, by up
to a pixel at its own size and two at 48 — although the two share one silhouette, one ink box and
one geometric bearing. `plus-circle` publishes 2.71 on every side, `plus-circle-filled` 2.00;
applied to the drawing, the model reads **2.70** for both. `plus-circle-filled`'s left edge is the
outline's, scanline for scanline (pinned in the tests).

**(1) The number disagrees with the drawing.** `build.mjs:49-50` sends any drawing with an area
path to a branch that copies the geometric bearing and writes `recession: 0`. On the drawing, the
exact model understates the optical bearing by more than 0.01 on **4,084 of the 4,104
shape-filled sides**, on every one of the 1,026 entries. The other 20 sides, all at 16, recede
0.011–0.013, so their correction falls within the 0.01 threshold.

| master | sides | understated by: median · p90 · max | sides over 0.5 | worst in px |
|---|---|---|---|---|
| 24 | 1,368 | 0.26 · 0.83 · **1.02** (`key-3-filled` top) | 469 | 1.02 at 24 · 1.35 at 32 · **2.03 at 48** |
| 20 | 1,368 | 0.26 · 0.80 · **1.00** (`cart-2-filled` left) | 485 | 1.00 at 20 |
| 16 | 1,368 | 0.20 · 0.64 · **0.83** (`home-filled` left) | 412 | 0.83 at 16 |

Seen as twins — what a customer toggling outline/filled gets — 4,076 of the 4,084 sides can be
compared (the other 8 are `paintbrush-4-filled`'s at 24 and 20, whose twin publishes `null`). On all
4,076 the outline twin has the same geometric bearing, and the published optical bearings differ by
median **0.29 · 0.31 · 0.235**, max **1.02 · 1.00 · 0.83**. `key-3` at 24: outline 3.27 / 3.20 /
4.02 / 3.26, filled 3 / 3 / 3 / 3. `home` at 16: 2.83 / 2.83 / 2.75 / 2.13 against 2 / 2 / 2 / 2.

**(2) The code disagrees with the docs.** `CLAUDE.md:263-264` and `README.md:52-53` promise optical
bearings per icon; `build.mjs:48` says shape-filled drawings "get geometric ones for now". On record
at `docs/09:43` since September and in `enforcement-gap.md:368` and `stale-statements.md:191`.

The count: **1,028** entries publish recession 0 on all four sides — 1,026 forced by `build.mjs:50`
plus the 2 `paintbrush-4` entries of §3.2, whose empty profile also yields 0. This agrees with
`enforcement-gap.md:368` and `stale-statements.md:268`.

### 3.2 `paintbrush-4` publishes `null`

**What a customer sees.** At 24 and 20 every optical side is `null`. A margin computed from it is
either an error or, coerced to 0, no correction at all: the icon sits **3.20–4.00 units** further
from its neighbour than the model intends — 4.00 px at 24, **8.0 px at 48**.

**(1)** The drawing carries `A7 7 0 0 1 3.75 19.5` from 3.75, 19.5 to itself. SVG 1.1 F.6.2 omits
such an arc. `sampleArc` divides by zero on it and returns `NaN` points (`geometry.mjs:103-112`).
`bbox` ignores them — its comparisons fail on `NaN` — so `ink` and `bearing` are right (3 / 3 / 3 /
3); `opticalBearings` takes `Math.min` over them (`optical.mjs:71-78`), every side becomes `NaN`,
and JSON writes `null`. True values (exact model, stable to 0.02): **3.23 / 3.95 / 4.00 / 3.26** at
24 and **3.20 / 3.95 / 3.97 / 3.20** at 20 — the build's own `optical.mjs`, run on the drawing with
that arc removed, reads the same 3.23 / 3.95 / 4 / 3.26 at 24. At 16 the arc is not zero-length and
the published entry is right (2.17 / 2.78 / 2.8 / 2.19). Seven files carry an arc with identical
endpoints — `chart-pie-3-filled` × 3, `paintbrush-4` × 2, `paintbrush-4-filled` × 2 — but only the
two stroked entries reach the model; the others are area files, which never do (§3.1). Already
recorded at `enforcement-gap.md:369` and `stale-statements.md:164`; their file count differs, see
§11.

### 3.3 Stroke drawings: does the build read the edge it measures?

**What a customer sees.** Almost always, nothing. On the 6,810 stroke-only sides whose reading is
stable, the published optical bearing is within 0.01 of the exact model on **6,693** and within
0.037 on all of them.

**(1)** But **152 sides on 108 entries** differ from the exact model by more than 0.01, and **22
sides on 17 entries by more than 0.05**. At 24: 39 sides on 29 entries, max **0.08**
(`users-level` top). At 20: 47 on 32, max **0.53** (`users-level` left: published 2.25, exact
2.78; also `megaphone-2`, `paintbrush-7`). At 16: 66 on 47, max **0.55** (`paintbrush-5` left:
published 2.10, exact 2.65 — 0.55 px at 16; also `compose-2/-3/-4`, `files-4`, `images-4`, `key`,
`paintbrush-3`, `sort-numeric-ascending`, `sort-numeric-ascending-3`, `thumbs-up`, `users-level`,
`users-3-level`). The counts are the same whether a step within 1e-6 or within 1e-3 of one stroke
counts as a tie. The first version of this card read the edge from points 0.01 apart and found
143 / 102 and 20 / 15; the sides between the two readings sit on §3.4's knife-edge, so read the
counts as 143–152 and 20–22.

Two mechanisms, both measured:

- **The build's grid is displaced.** The build anchors its scanlines at the ink box it computes
  from its own samples (`optical.mjs:83`; 64 samples to an arc, `geometry.mjs:43`). On 210 of 3,768
  drawing-axes the end the grid starts from sits inside the true edge, by up to 0.0044 (`message-5`
  at 16), and every scanline moves with it, so one that should touch a cap's tangent point misses
  it. Counting the far end too — which decides whether the last tangent scanline exists — 231 axes
  are displaced by more than a millionth of a unit (348 by any amount at all), by up to 0.0056
  (`rotate-ccw` at 24). Read the true edge on the build's own grid and the
  published value comes back (to 0.01) on **59 of the 152 sides — but on only 1 of the 22 large
  ones**. It is the same mechanism as §3.4's second bullet.
- **The build misreads the edge at the same scanline.** It reads each scanline from its sample
  points, not from the curve: points 0.25 apart on straight runs (`geometry.mjs:44`) and 64 to an
  arc. At 16 a straight stroke's points land on the eighth grid while the scanlines run on
  quarters, so the edge reads 0.0126 short — `compose-4`'s frame wall at 16 reads 13.987 for
  14.000, enough to hand "outermost edge" to the pen head (§3.4). And an arc's last point is
  recomputed through cos and sin (`geometry.mjs:128-131`), so a point that should sit exactly half a
  stroke from a scanline can land a millionth of a millionth of a unit further away, and the code
  drops it (`optical.mjs:31`): `paintbrush-5` at 16 loses its head's tangent at y = 9.0 and reads
  5.24 where the ink reaches 4.50. At the build's own scanline positions, **21,747 of 412,750
  readings (5.3%)** are off by more than 0.013, **1,492** by more than 0.05, and **52 scanlines on
  24 drawings** are inked in one reading and empty in the other.

Summed over the 152 sides, the grid part comes to 1.27 units and the reading part to 5.23, against a
total disagreement of 6.41 (the two can partly cancel). Errors this small would cost almost nothing
on their own; they cost up to 0.55 because the model is discontinuous (§3.4): **18 of the 22 large
disagreements lie inside the true edge's stability range, 3 within 0.01 of it**, and the last
(`thumbs-up` right at 16) 0.013 outside it.

*Counting note.* The first version reported 602 scanlines on 228 drawings inked in one reading and
not the other: it compared the build's readings with the true edge on a grid anchored at the true
edge, index by index. At identical positions it is 52 on 24. The reviewer's total of 412,230
readings leaves out `paintbrush-4` at 24 and 20, whose build samples include `NaN` — 520 readings.

**(2)** `optical.mjs:12-14`: "the ink edge per scanline is exact, not approximated". It is
approximated, as measured above.

### 3.4 Is the model itself consistent? — the knife-edge

**What a customer sees.** Two drawings that read alike get optical bearings a pixel apart, for
reasons no eye can see. `menu-arrow-left` and `menu-arrow-right` at 24 are exact mirror images
(every coordinate reflects); their top and bottom optical bearings are **7.09 and 6.78**. In a
menu aligned by optical top, one sits 0.31 px off at 24, 0.62 px at 48.

**(3) Computed as specified; the specification is unstable.** **1,162 of 11,640 sides on 635 of
2,910 entries** have a stability range over 0.05 (374 sides on 196 entries at 24, 405 on 225 at 20,
383 on 214 at 16). Widest: **1.29** — `italic-filled` left at 20 reads anywhere from 5.03 to 6.31,
published 6.30; the largest move a single perturbation makes to the published reading, a slid
grid, is 1.28. At 24 **1.27** (`filter-2-filled` left, 4.57–5.85, published 5.85 — **2.55 px at
48**); at 16 1.02 (`filter-2-filled` left). Which reading gets published is decided by
floating-point noise and scan order. Each perturbation alone:

| what moves the answer | sides moving > 0.05 | entries | worst |
|---|---|---|---|
| the scanline grid slid by 0.002 | 880 | 500 | 1.28, `italic-filled` left at 20 |
| the run started at another extreme within 0.02 | 307 | 205 | 0.89, `paintbrush-3-filled` right at 24 |
| a step of exactly one stroke read as breaking | 81 | 48 | 1.25, `filter-2-filled` left at 24 |

Why, in the code:

- **A hard threshold** (`optical.mjs:53, 62`): the run stops at the first step larger than one
  stroke. A drawing on the quarter grid produces steps of *exactly* one stroke. `hash-2`'s slanted
  bars run 1 across for 6 down, so their top edge steps exactly 1.500 per 0.25 scanline — the
  threshold itself. Published 4.87 (the run continues); a hair the other way gives 4.52.
- **A grid that starts at the ink's own edge** (`optical.mjs:83`). Empty scanlines are skipped
  (`optical.mjs:36`), so whether a scanline happens to touch a cap's tangent decides whether a gap
  between two parts is bridged. `menu-arrow-left`'s arrowhead bend is written with 2-dp tangent
  points (5.47 for 5.4697), which moves the arc's centre and its ink edge 0.0007 off the quarter
  grid; its scanlines miss a tangent its mirror image hits, and the run crosses into the arrowhead
  in one and not the other.
- **First of the ties** (`optical.mjs:55-57`): when two edges are equally outermost, the first in
  scan order wins, and a mirror image reverses the order.

Among the set's exact mirror pairs — 52 left–right name pairs (156 entry pairs, 138 of them
stroke-only) and 30 top–bottom (90, 72) — only `menu-arrow-left/-right` publish optical bearings
more than 0.05 apart. Read on its own mirror image, a drawing changes by more than 0.05 on **161
entries** (max 0.89, `paintbrush-3-filled` right at 24). Scan order alone — the same grid read
backwards — accounts for 121 of them (66 among stroke-only drawings). The grid re-anchoring at the
other edge, measured directly — the grid started from the far edge and read forwards — accounts
for 39 (24); taken as the remainder of the total after scan order, side by side, it is 44 (25),
because the two causes can add or cancel on one side. The reviewer counts 164 by mirroring the geometry instead of reading
the original from its far edge; the two methods are equal in exact arithmetic.

**(2)** `CLAUDE.md:265-266` and `README.md:56-57`: subtract the bearing "and every spacing value in
their product becomes literally true". True of the geometric bearing. Not of an optical bearing that
a hair's movement changes by a pixel.

### 3.5 Line-heavy twins jump when toggled

**What a customer sees.** Toggle `italic` to `italic-filled` — a pressed state — and, with optical
bearings applied, the icon jumps **1.62 px at 24** (3.2 px at 48) relative to its label, though both
have the identical ink box.

**(3)** On sides where both twins read stably, **301 sides differ by more than 0.25** (73 concepts
at 24, 6 at 20, 50 at 16); max **1.63** (`rotate-ccw-7-filled` bottom at 24). The typical twin moves
little — median 0.18 · 0.09 · 0.14, p90 0.47 · 0.21 · 0.34, max 1.63 · 0.85 · 1.26 — and in the
expected direction (a heavier line has rounder ends). The tail has a different cause:
`optical.mjs:52-53` sets the cap and the break at one stroke of the drawing's **own** weight, so a
2.5 filled line bridges steps the 1.5 outline breaks at. `italic`'s left recession is 0.03 as an
outline and 2.18 filled.

Measured alternative, on the same stable sides: judging a line-heavy filled drawing at its master's
outline stroke brings the twin difference (exact model) from median 0.18 / p90 0.47 / max 1.63 to
**0.05 / 0.11 / 0.61** at 24 (0.09 / 0.21 / 0.86 → 0.03 / 0.09 / 0.65 at 20; 0.14 / 0.34 / 1.26 →
0.05 / 0.12 / 0.79 at 16), and moves the published value of 127 · 119 · 121 entries by more than
0.01. Whether a heavier twin *should* read further in at all is an eye question (§12).

---

## 4. `shift`

**What a customer sees** depends on how it is used, and no doc says. C14 says only that the build
writes it "next to the true ink box" (`docs/07:54`). A customer who centres icons by `ink` and
re-applies `shift` as the deliberate offset would push `info-2` 0.45 off-centre (0.9 px at 48) and
pull `volume-none`'s speaker 5 units out of the place C28 holds it in (10 px at 48).

**(2)** **12 entries** — `info-2`, `info-3` and their filled twins at every master — publish
`[-0.45, 0]` · `[-0.39, 0]` · `[-0.39, 0]` and `[0, -0.35]` · `[0, -0.27]` · `[0, -0.25]` while their
ink box is exactly centred. The published shift equals its note on all 270 declared entries; what
disagrees is the meaning — `build.mjs:87` calls it the offset "from the box centre", and on these 12
the note moves a *mark inside a centred ring*. Of the other declared entries, 211 match their
drawing to 0.005 and 47 by 0.0054–0.0098: 44 chevron entries (40 of them filled) and `play`,
`play-2`, `play-3` at 16 — a 2-dp note on a centre that needs 3.

**(3)** **177 entries** publish `[0, 0]` while their ink sits off-centre by more than 0.005: **12**
are C28 level members, off-centre by design and declared only by `anchor:` (`volume-low` −2.5 ·
−2.0 · −1.75, `volume-none` −5.0 · −4.0 · −3.5, both styles); **165** others, 70 of them between 0.1
and 0.5 (`gear-3` and `gear-3-filled` at 24 sit on the band's lower edge, 0.100, and are not
counted). The largest are 0.5 (`watch-2` at every master, `volume-off` at 16) and
`map-pin-4` at 24, 0.345 low. The field cannot tell a deliberate offset from an accidental one.
Whether those 165 are deliberate is card 1.11's question, not this one's.

---

## 5. `container` and `ratio`

**What a customer sees** in a layout: nothing — no doc gives them a spacing use. They are the
product's own descriptive claims, and they are published.

**(2)** Both groups below are computed exactly as `anatomy()` and `build.mjs:54` specify; what is
wrong is the specification's idea of a container, against the meaning `build.mjs:90` ("the
silhouette's ink diameter, when there is one") and `docs/08:223` ("splits a stroked drawing into
silhouette and mark") give the field.

**False — 81 entries, 27 names × 3 masters.** `anatomy()` calls a path the container when its box
equals the whole drawing's (`geometry.mjs:174-178`). On 23 names that path is **open**: `x`,
`x-large`, `x-small` and their filled twins (one diagonal of the x is the "container": 13 · 16 · 10
at 24, ratio 1 × 1), `at-sign`, `at-sign-2` (+ filled), `chart-bar-3` (+ filled),
`compose-2/-3/-4`, `gauge` (+ filled), `key-2/-3/-4-filled`, `volume-off`, `volume-x-filled`,
`wand`. On 4 it is **closed, but ink lies outside it**: `megaphone-2`, `pencil-4`, `pin-4`,
`pin-6`.

**Missing — 348 entries (116 shape-filled names × 3).** Their outline twin has a genuine container
(a closed path enclosing the rest) and the filled entry publishes `null`, because `build.mjs:54`
hands `anatomy()` the stroked leftovers only. Counting any published twin number it is 375, as
`enforcement-gap.md:368` says (reproduced exactly). Whether the filled drawing has *one* outer shape
around everything else depends on how "around" is tested:

| how "around the rest" is tested | one outer shape around the other parts | one shape, nothing inside | split |
|---|---|---|---|
| box: the outer shape's box is the whole drawing's | 227 | 9 | 112 |
| **ring (this card):** every other part inside the outer shape, or on its edge to 1e-6 | **210** | 9 | 129 |
| strict: a part on the edge counts as outside | 192 | 9 | 147 |

The 9 are `book-open-2-filled`, `folder-3-filled` and `send-filled`, where the outline's inner line
became a notch in the edge: a silhouette with no mark. The reviewer, testing against a ring sampled
every 0.05, gets 215 single and 133 split: it counts those 9 as single, and loses 4 drawings that
touch the edge exactly at a pole — `globe-2-filled` and `language-3-filled` at 24 and 20 — which a
sampled ring misses by about 0.00003. For the 210 the filled outer shape's diameter equals the
twin's to 0.003. What a container is when the silhouette splits, or has nothing inside it, is
Maruti's to define (§12).

**True:** the 357 genuine containers match the exact recomputation to 0.005, their ratios to 0.0054.
No outline drawing hides a ring and a mark in one `<path>` (402 single-path drawings checked).

---

## 6. `gap`

**What a customer sees** in a layout: nothing. On every declared glyph that publishes a gap (33
entries) the number is right to 0.005 (`info` at 24: void 1, dot 2.5, ratio 0.4).

**(2)** The build's "dot" is whatever passes a syntax test, `M A A Z` (`geometry.mjs:151`), inside a
container holding exactly one such path. `build.mjs:92` and `docs/08:227` define the field as a
glyph's dot-to-body void, and the code publishes it on **31 entries of 11 names that carry no glyph
note**: `image`'s sun-to-mountain 4.29, `wallet-2` 1.5, `wand` 8.08, `gauge`'s hub, which overlaps
its needle (published −1.17 to −2.48), and **6 entries where the "dot" is not a dot** — `globe` and
`language-2`, whose 20-unit meridian ellipse passes the syntax test (gap −1.5, part 20). It
publishes **`null` on 57 entries that declare `glyph: dot`**: 45 shape-filled (the dot is a knockout
the stroked-only anatomy never sees) and 12 outline (`alert-circle-3/-4`, `alert-triangle-3/-4`),
whose dot is a short bar (`M11 17h2`) rather than two arcs.

**(1)** The readings themselves: **5 entries are off by more than 0.01**, because the build's points
miss the nearest approach. `globe` and `language-2` at 16 publish −1.12 where the meridian actually
crosses the equator (−1.25, **0.13** off); `gauge` at 16 −1.17 for −1.25 (0.079), at 20 0.029 off,
`gauge-filled` at 24 0.019 off.

---

## 7. Rounding, and a geometric bearing published twice

**What a customer sees:** nothing — at most 0.02 px at 48. But a customer who reads `bearing` and
one who reads `optical.*.geometric` get different numbers for the same side.

**(1)** 71 entries differ from one correct 2-dp rounding of the exact box: 8 in `ink`, from arc
sampling (`rotate-ccw` at 24 publishes w 17.87; the exact width is 17.88), and 69 in `bearing`,
mostly because right and bottom are taken from already-rounded `ink` values (`build.mjs:44-47`). The
visible symptom: **49 symmetric drawings publish a 0.01 asymmetry** — `bell-filled` at 24, left 4,
right 3.99, where both are 3.9958.

**(1)** Each side's geometric bearing appears twice, in `bearing` and in `optical.*.geometric`
(computed separately, `optical.mjs:87-91`), and the two copies **disagree by 0.01 on 59 sides of 49
entries** — `attachment-4-filled` at 24, bottom: `bearing` 2.03, `optical.geometric` 2.04, exact
2.0363. `optical.geometric` is the correct rounding on 57 of the 59, `bearing` on 2. On 8 more sides
(`paintbrush-4` at 24 and 20) `optical.geometric` is `null` (§3.2); the reviewer's 67 sides are
these 59 plus those 8.

---

## 8. "13.7–16.2px of visual padding" — never measured

`CLAUDE.md:266`: *"Without it the same CSS renders 13.7–16.2px of visual padding depending on the
icon."* `README.md:55`: *"`padding: 12px; gap: 8px` renders as 13.7–16.2px and 9.7–12.2px."* So the
claim is that optical bearings at 24 span 1.7–4.2 units.

**The range was never measured.** The sentence is in the first commit (`b226ad9`, 2026-09-17),
whose `src/icons/` was empty. The only drawings that existed then, the 10 in
`src/_legacy-stroke-2/`, give **14.0–18.1 px** on their left and right sides under the pinned
`optical.mjs` (unchanged since that commit).

**At the pin, `padding: 12px` renders 14.00–24.05 px at 24 px** (12 + every published optical
bearing at the 24 master; the exact model gives 14.01–24.05). Without the deliberately off-centre
C28 levels, published: 14.00–23.28. The middle 90% of left and right sides: published 14.00–19.46
(median 15.16), exact model 14.18–19.48 (median 15.23). The spread is **10.05 px, four times the
claimed 2.5**, and the lower bound cannot be reached: no drawing's optical bearing is below its
geometric one, and none at 24 stands closer than 2.00 to the canvas edge. At 20: 14.00–22.07; at 16:
12.99–20.08. The gap clause fares the same: 8 px renders 10.00–20.05 at 24.

---

## 9. Proposed fixes — not applied

`build.mjs` is not touched in this build. F1, F2, F6, F7's first half and F8 repair numbers against
the model and the docs as they stand. **F3, F4 and F5 change what a number means, so each waits on a
ruling in §12** — they are listed so the cost is known, not proposed as fixes.

| # | Defect | Cause | Proposed change | Entries it changes |
|---|---|---|---|---|
| F1 | §3.1 shape-filled recession 0 | `build.mjs:48-50` | Run the same model on the shipped ink of every drawing: an area contributes its outermost boundary crossing per scanline, a stroke its swept disc, with the root `stroke-width` as now. | **1,026** (1,024 by > 0.01; 4,084 sides). Inherits §3.4's knife-edge until §12 rules on it |
| F2 | §3.2 `paintbrush-4` `null` | `geometry.mjs:103-112` · `optical.mjs:71-78` | Drop non-finite points in `opticalBearings`, or omit an arc whose endpoints are identical as SVG F.6.2 does. Prefer the first: `samplePath` also feeds lint, and changing it there moves lint on 7 files by `[needs measuring]`. | **2** |
| F3 | §3.3, §3.4 misread edges and knife-edges | `optical.mjs:21-39, 53, 55-57, 62, 83` | **Conditional on §12's third question.** If the model's premise stands: read the edge from the curve, fix the scanline grid to the canvas rather than the ink edge, resolve ties symmetrically, and replace the hard break with a weight that changes smoothly with the step. Done when no entry moves by > 0.01 under this card's stability probe and every mirror pair agrees. | A model change, so every optical entry is recomputed: **635** move by > 0.05 by construction; the rest `[needs measuring]` until the replacement is specified |
| F4 | §3.5 twin jumps | `optical.mjs:52-53` | **Conditional on §12's second question.** Take the cap and the break from the master's outline stroke, not the file's own weight. | **367** line-heavy entries move by > 0.01 (127 · 119 · 121); twin max 1.63 → 0.61 at 24 |
| F5 | §4 `shift` | `build.mjs:26, 87` | Publish the drawn ink-centre offset beside the declared one, and say whether a declaration moves the whole ink or a mark inside a ring. **Carrying C28's anchor offsets in `shift` is a shipping decision for Maruti** (§12): it changes what the field tells customers. | **12** corrected · **177** gain a non-zero drawn offset |
| F6 | §7 rounding and the two geometric copies | `build.mjs:43-47` · `geometry.mjs:43` | Derive right and bottom from the unrounded box and round last; take arc extremes exactly; write one geometric bearing and reuse it. | **71** entries by 0.01; the two copies agree on all 59 sides |
| F7 | §5 `container` | `geometry.mjs:174-178` · `build.mjs:54` | Require the container to be closed and to enclose the rest; ask the same of a filled drawing's outer area shape. | **81** → `null`; **210** gain a number; the 129 split and the 9 one-shape wait on §12 |
| F8 | §6 `gap` | `geometry.mjs:151, 186-196` · `build.mjs:54` | Publish only where `glyph: dot` is declared, find the dot by shape (a small circle, or the bar the note names), measure the filled twin's dot-to-body strip, and take the nearest approach from the curve. | **31** → `null` (the 6 false dots among them); **57** gain a number; 5 readings corrected |

---

## 10. The judged list — ranked by customer-visible pixels

Exposure is the sum, over what Reach counts, of the error in master units at the master's own size
— a rough count of the pixels the defect puts on customers' pages across the set. Per row: 1 each
side's understatement; 2 each side's stability range; 3 each twin difference; 4 each `null` side's
true bearing (coerced to 0, a customer loses all of it); 5 each misread; 6 each drawn offset, 6b each
declared-minus-drawn; 7 each field's distance from its exact value (0.92 against a correct
rounding instead); 7b each pair's difference.

| Rank | Finding | Kind | Reach | Worst | Exposure |
|---|---|---|---|---|---|
| 1 | Shape-filled drawings publish no optical correction; a filled icon sits further from its label than its outline twin | (1) | 1,026 entries, 4,084 sides | 1.02 units → **2.03 px at 48** | 1,450 |
| 1b | — the docs promise optical bearings for every icon | (2) | `CLAUDE.md:263-264`, `README.md:52-53` | — | — |
| 2 | The optical number is a knife-edge: a hair's move changes it; mirror images disagree (`menu-arrow-left/-right` 0.31) | (3) | 635 entries, 1,162 sides | 1.29 units; 1.27 at 24 → **2.55 px at 48** | 329 |
| 3 | Line-heavy twins with one ink box read up to 1.63 apart; toggling a state jumps the icon | (3) | 301 stable sides on 129 concept-masters | 1.63 units → **3.26 px at 48** | 127 |
| 4 | `paintbrush-4` publishes `null` | (1) | 2 entries | 4.00 units → **8.0 px at 48**, or a broken calculation | 29 |
| 5 | The build misreads stroke edges at sampling resolution and lands on the far side of a knife-edge | (1) | 108 entries, 152 sides (17 entries over 0.05) | 0.55 units → 0.55 px at 16 | 6.4 |
| 5b | — `optical.mjs:12-14` calls its edge "exact, not approximated" | (2) | 5.3% of scanline readings off by > 0.013 | — | — |
| 6 | `shift` cannot say where 177 off-centre drawings sit, C28 anchors included — costs pixels only if a customer re-applies it | (3) | 177 entries | 5.0 units → 10 px at 48, conditional | 57 |
| 6b | `shift` reads as moving the ink on 12 entries whose ink box is centred | (2) | 12 entries | 0.45 → 0.9 px at 48, conditional | 4.2 |
| 7 | Double rounding; 49 symmetric drawings published 0.01 asymmetric | (1) | 71 entries, 92 fields | 0.0101 → 0.02 px at 48 | 0.57 |
| 7b | Each side's geometric bearing published twice, 0.01 apart | (1) | 49 entries, 59 sides (+ 8 `null`) | 0.01 → 0.02 px at 48 | 0.59 |
| 8 | `container` false on 81, missing on 348; `ratio` follows | (2) | 429 entries | no spacing use | — |
| 9 | `gap` readings off by up to 0.13 | (1) | 5 entries | no spacing use | — |
| 9b | `gap` published on 31 non-glyphs (the 6 false dots among them), missing on 57 declared glyphs | (2) | 88 entries | no spacing use | — |
| 10 | "13.7–16.2px", never measured | (2) | `CLAUDE.md:266`, `README.md:55` | measured 14.00–24.05 px | — |

**Systemic or one-off.** 1, 2, 3, 5, 7, 7b and 8 are systemic — each is one line of code applied to
every drawing of its kind. 4 is one icon; 9 is three names (`gauge`, `globe`, `language-2`). 6 is
systemic in definition and touches one family (C28) by design.

---

## 11. For wave 5 to reconcile

Two audit documents measured these quantities too. Both values, both sources; none is picked.

1. **"A container that is the mark."** `enforcement-gap.md:370` and `stale-statements.md:163`:
   **45 entries, 15 names**, by the criterion *ratio ≥ 0.99 on both axes* — reproduced exactly at
   the pin. This card: **81 entries, 27 names**, by the criterion *the container path is not closed,
   or ink lies outside it*. They share 7 names (21 entries: the six `x` files and
   `volume-x-filled`). The 8 names only in the first — `globe`, `globe-2`, `grid-2`, `language-2`,
   `language-3`, `table`, `table-2`, `target-2` — are closed rings enclosing everything else, whose
   inner lines span the ring so the ratio reads 1. The 20 names only here have open or leaky shells
   with ratios below 0.99.
2. **The zero-length arc.** `stale-statements.md:164` and `enforcement-gap.md:369`: **9 files,
   2 concepts**. This card: **7 files** whose arc has identical endpoints. By those documents' own
   note, the arc in `paintbrush-4` and `paintbrush-4-filled` at 16 is 0.001 long. Both count 2
   published `null` entries.
3. **Twin ink-box equality** (already on the plan's wave-5 list: 1,100 of 1,455 in card 1.8 against
   96.3% in card 2.1). This card measures the same quantity several ways, and the figure is a
   function of the tolerance, of whether the box is compared as a tuple or edge by edge, and of
   rounding before comparing. Exact boxes equal within 1e-6: **921** as an (x, y, w, h) tuple,
   **924** edge by edge; within 0.001: **1,159 / 1,183**; within 0.005: **1,306 / 1,318** (the
   reviewer's run: 1,304 / 1,318 — pairs exactly 0.005 apart, decided by floating-point noise);
   within 0.0101: **1,397 / 1,401** (96.0% / 96.3%). Published 2-dp ink boxes identical: **1,299**
   (89.3%); published geometric bearings within 0.01: **1,401** (96.3%, the other 54 all carrying
   `grows:`).

**Agreements, so wave 5 need not re-check them:** 1,028 entries with recession 0 on all sides
(`enforcement-gap.md:368`, `stale-statements.md:268`); 375 filled entries with a `null` container
whose twin publishes one (`enforcement-gap.md:368`); `paintbrush-4`'s two `null` entries
(`enforcement-gap.md:369`); `plus` 4.5 and `chevron-down` 5 / 8.79 / 7.78 (`stale-statements.md:192`).

---

## 12. What only Maruti's eye can settle

Questions no measurement here can close. The first three need a surface built in wave 4; the last
three are definitions or shipping decisions.

- **Should a filled drawing read as stopping where its outline twin does?** The model says yes for
  a shared silhouette; F1 rests on it. Surface: twins side by side beside a label, at 24 and 48.
- **Should a heavier line read further in?** F4 waits on this. Surface: the same, with `italic`,
  `rotate-ccw-7` and `check` toggled.
- **Is the model's premise right — that a jump of one stroke is a counter and not an edge?** F3
  waits on this. The knife-edge cases, read at real size: `hash-2`, `menu-arrow-left/-right`,
  `italic-filled`, `filter-2-filled`.
- **`alpha` 0.75 — how much of a recession is charged at all** (`optical.mjs:70`; open item 3 at
  `CLAUDE.md:241`). Every optical number moves with it. The code says it "matches the corrections
  designers make by hand" (`optical.mjs:43-44`); it has never been set against the eye in this
  project.
- **What is a container when the filled silhouette splits into several shapes (129 entries), or
  when the inner line has become a notch in the edge (9)?** F7's open part.
- **Shipping:** should `shift` tell customers about C28's deliberate offsets (F5)? It changes what
  the field means to everyone who reads it.

---

## Gate

- `node tools/lint.mjs | tail -1` → **2,910 drawings · 2,848 clean · 62 warned · 0 failed.**
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → **182 pass, 0 fail**: the
  133 of the baseline, this card's 28 (27 in `metrics-check.test.mjs`, 1 in
  `metrics-probe.test.mjs`), and 21 in `tools/audit/notes.test.mjs`, from card 1.13.
- `git status --short dist lab` → nothing from this card (the `lab/drafts/current.js` change was in
  the working tree before it started).
- **Files:** this document, `tools/audit/metrics-check.mjs`, `tools/audit/metrics-check.test.mjs`,
  `tools/audit/metrics-probe.mjs`, `tools/audit/metrics-probe.test.mjs`.
