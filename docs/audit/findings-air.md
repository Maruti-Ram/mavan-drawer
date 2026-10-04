# Air and contact — findings (audit card 1.7)

**Pinned tree `5933041`.** 485 concepts x 3 masters x 2 styles = 2,910 drawings. Lint baseline at
the pin: 2,910 · 2,848 clean · 62 warned · 0 failed. Nothing in the set, the rules, lint, the docs
or the lab was changed by this card.

**What this card was asked.** Re-derive the gap rule from first principles: what is it protecting
against, and does one constant do that job at three masters? Then census contact — every place ink
touches ink, which no rule governs.

**Instruments.** `tools/audit/raster.mjs` (exact renderer; every figure carries its sampling rate),
`tools/geometry.mjs` (`selfGap`, `materialGap`, `facingGap`), and throwaways written for this card
in the session scratchpad: `airprobe.mjs` (synthetic situations x gap x phase, rendered),
`diagprobe.mjs` (the same against channel angle), `realphase.mjs` (every air span in the shipped
set, with its phase), `airread.mjs` (what each real span's pixels show), `cost.mjs`,
`aligncheck.mjs`, `blindspots.mjs`, `retina.mjs`, `dump.mjs`, `classify-bug.mjs`.

**Scope stated plainly.** Everything below is the **1x case** — each master shown at its own size,
which is the stated design target (`tools/masters.mjs:60-64`, "the floor is what survives a 16px
render"; C7's whole construction). Measured: at 2x a 1.0 gap is clear at every phase, at 3x a 0.75
gap is (`retina.mjs`). The whole question lives at 1x.

---

## 0. One instrument is wrong, and it had to be worked around

**Finding A1 — `tools/audit/raster.mjs`'s `classify` is unsound for filled shapes.** Kind (1),
**systemic**, against a wave-0 instrument, not against a drawing.

`region()` drops an area path's **horizontal** edges from its edge list (`tools/audit/raster.mjs:257`)
— correct for the even-odd ray cast, which a horizontal ray never crosses. But `classify` then uses
*that same list* to decide whether a boundary runs through a box. So a box straddling a filled
shape's horizontal boundary, whose x-range contains no vertical edge, is judged from its centre
alone and comes back `'empty'`.

Verified on a filled rectangle `M2 2.5H14V7.5H2Z` (`classify-bug.mjs`):

| probe | true | `classify` | `boxCoverage` | `reg.covered` sampled |
|---|---|---|---|---|
| box [3,4]x[7.2,8] | 0.375 | `empty` | **0** | 0.3750 (correct) |
| box [3,4]x[7,8] | 0.5 | `empty` | **0** | 0.5 (correct) |
| `rasterise` row 7, cols 3-13 | 0.50 each | — | **0.00 each** | — |

`inkArea` on the same rectangle returns exactly 60 (= 12 x 5) at every rate — but by
**cancellation**, not soundness: the cell above the boundary is called `full` (+0.5 too much) and the
cell below `empty` (-0.5). The errors cancel in a whole-unit area integral and do **not** cancel in a
per-pixel render.

Consequence: any rasterised number about a **filled** drawing taken through `rasterise`,
`rowProfile`, `blurScore`, `peakCoverage` or `mass.inkPixels` is suspect. Cards 1.5 and 1.6 depend on
exactly those. **Every figure in this document samples `reg.covered` directly and never
`boxCoverage`.** `reg.covered` was checked against hand arithmetic and is sound.

---

# Part one — the gap, re-derived

## 1. The unit is one device pixel, and the master is irrelevant

Each master is drawn to be shown at its own size, so **one canvas unit is one device pixel** at
24/24, 20/20 and 16/16 alike. Every piece of arithmetic below therefore holds identically at all
three masters, and the probe confirms it: the floors in section 3 come out as the same number at 24,
20 and 16 (`airprobe.mjs`, 27 situation x master rows, all identical).

So `tools/masters.mjs:60-64` was **right to make `MIN_GAP` a literal rather than a function of the
stroke** — but not for the reason it gives. It is a literal because the pixel is the unit and the
pixel does not change with the master. It is not a literal because "1.5 is what survives a 16px
render".

**Where 1.5 probably came from.** `1.5 / 24 x 16 = 1.0` **exactly**: a 1.5 gap on a 24 master is one
device pixel when the 24 drawing is shown at 16px. At 20 the same gap is 1.2 px; at the 16 master it
is 1.5 px. So the three masters hold **1.0 · 1.2 · 1.5 device pixels** at a 16px render and
**1.5 · 1.5 · 1.5** at their own sizes — one constant in units, three different numbers in the thing
the rule says it is about. The number reads as a 24-master conversion factor carried forward into
masters that no longer need it. (The arithmetic is exact; the history is not in the repo, so the
attribution is a reading, not a record.)

## 2. The mechanisms, separated and measured

The brief named three. Measured separately, at every master, by rendering:

| # | Mechanism | Does the 1.5 floor defend it? | Measured |
|---|---|---|---|
| M1 | **Welding shut** — the two inks merge with no lightening at all | **No — it is not a live mechanism** | At the master's own size the worst-phase lightest pixel in the air is **0.875 at a 0.125 gap**, 0.75 at 0.375, 0.5 at 0.875. Nothing welds at any gap above zero (`airprobe.mjs`, 3,888 rendered rows). Welding needs g = 0 |
| M2 | **Grey mush** — the air never reads as background | **Partly, and by luck** | The worst-phase lightest pixel falls by **0.125 for every 0.25 of extra air**, from 0.875 at a 0.125 gap to **0 at 1.875**: 0.5 at g = 0.875-1.0, 0.375 at 1.125-1.25, **0.25 at 1.375-1.5**, 0.125 at 1.625-1.75. The share of phases that give a fully clear pixel row is **g - 1**: 1/8 at g = 1.0, 3/8 at 1.25, **5/8 at 1.5**, 7/8 at 1.75, 8/8 at 1.875. Section 3 |
| M3 | **The filled style being possible at all** | **No difference at all** | A knockout from a solid (flank 5 units of ink each side), a band between two solids, shape-to-line air and two 1.25 strokes side by side give the **identical** table, row for row. Flank depth is irrelevant to the pixel |
| M4 | **(in no rule) the channel must hold a pixel in TWO dimensions** | **No — the rule cannot see it** | A pixel is 1 x 1. A channel 1.5 wide but a third of a unit long produces no light pixel whatever its width. **42 air spans in the shipped set leave no pixel lighter than solid ink; 35 of them are at or above 1.5 and pass lint.** Section 4c |

**M1 is dead.** The rule is not holding the set back from welding; it never was.
**M3 is dead too**, which is the surprise: C18's and C22's reasoning that a knocked-out white line
"reads thinner than a drawn one" is a *perceptual* claim, and it may well be true, but it is **not a
rasterisation fact** — the pixels are identical. That claim is now eye-only (last section).

## 3. The derived floors

### 3a. The seven situations — measured, and they do not differ

Probe: each situation built at each master, gap swept 0.125 -> 2.25 in eighths, phase swept over all
eight eighths of a pixel, rendered at px = master, rate 32 (`airprobe.mjs`).

| Situation (flank = ink depth each side of the air) | Worst-phase lightest at g = 1.5 | Phases clear at 1.5 | at 1.0 | Floor, best phase | Floor, every phase |
|---|---|---|---|---|---|
| parallel run, two outline strokes · flank 1.25 | 0.25 | 5/8 | 1/8 | **1.0** | **1.875** (eighth grid) / 2.0 |
| two facing edges, 2-unit overlap · flank 1.25 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |
| two round caps tip to tip · flank 1.25 | **0.089** | 5/8 | 1/8 | 1.0 | 1.875 |
| knockout from a filled shape · flank 5 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |
| counter inside a closed stroked path · flank 1.25 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |
| counter inside a glyph (a hook's mouth) · flank 1.25 | **0.145** | 5/8 | 1/8 | 1.0 | 1.875 |
| band between two filled parts · flank 5 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |
| shape-to-line air · flank 5 / 1.25 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |
| parallel run, filled line weight 2 · flank 2 | 0.25 | 5/8 | 1/8 | 1.0 | 1.875 |

Identical at 24 and 20. **The seven situations the brief asked about are not seven problems.** They
are one problem — how wide the air is and where it sits on the pixel grid — with two second-order
differences:

- **Curvature halves the darkness.** Where the walls curve away (two round caps, a glyph mouth) the
  darkest pixel at the same nominal gap is 0.089-0.145 against a straight run's 0.25, and 0.23-0.31
  against 0.5 at g = 1.0. A cap-to-cap gap reads about **0.45x** as dark as a parallel run of the
  same width. The floor charges them the same.
- **Length, not flank.** The flank (1.25 against 5 units of ink) changes nothing. What changes things
  is how far the channel runs — M4.

### 3b. The variable that actually matters: the channel's angle

A device pixel is an axis-aligned 1 x 1 square. The largest one that fits inside a strip of width w
running at angle t has side w / (|cos t| + |sin t|). So the width needed for one clear pixel is
**|cos t| + |sin t|** — 1.0 along an axis, **sqrt(2) = 1.414 at 45 degrees**. Measured, sweeping g in
sixteenths and phase in eighths at the 16 master (`diagprobe.mjs`):

| Channel angle off the axis | First clear pixel, best phase | First clear pixel, **every** phase | Theory |
|---|---|---|---|
| 0 / 90 (axial) | **1.0** | **2.0** | 1.000 |
| 15 / 75 | 1.25 | 1.313 | 1.225 |
| 22.5 / 67.5 | 1.313 | 1.438 | 1.307 |
| 30 / 60 | 1.375 | 1.5 | 1.366 |
| 45 | 1.438 | **1.438** | 1.414 |

Measurement tracks theory to within one sweep step throughout. Two consequences, neither of them
anywhere in the docs:

1. **1.5 is exactly the grid-legal minimum for a 45-degree channel.** sqrt(2) = 1.4142; the smallest
   value on the quarter grid (24, 20) **and** on the eighth grid (16) that clears it is **1.5**.
   1.375 does not. So the number 1.5 is defensible — it is the tightest grid-legal value that works
   at every angle the set uses. **That has never been the stated reason for it.**
2. **A diagonal channel is more forgiving of phase than an axial one.** An axial 1.5 band can be
   caught on the wrong phase for ever (it needs 2.0 for certainty); a 45-degree band of 1.438 is
   clear at every phase. The rule treats them identically and so gets the axial case wrong.

### 3c. Alignment is free at every master, and nobody asked for it

A stroke's ink edge lands on a whole pixel when its centreline sits at (whole -/+ half the stroke):

| Master | Stroke | Half | Centreline fractions that put an edge on a whole pixel | On the mandated grid? |
|---|---|---|---|---|
| 24 | 1.5 | 0.75 | .25 · .75 | yes — quarter grid |
| 20 | 1.5 | 0.75 | .25 · .75 | yes — quarter grid |
| 16 | 1.25 | 0.625 | .375 · .625 | yes — **the eighth grid C7 already mandates** |

A non-integer stroke can never put **both** its edges on whole pixels; it can always put **one**
there, and which one is a free choice. So "the wall facing the air lands on a whole pixel" costs
nothing at any master.

Verified by construction at 16 (`aligncheck.mjs`), two 1.25 strokes, **air exactly 1.0**:

| Construction | Air band | Pixel rows 6 / 7 / 8 |
|---|---|---|
| centrelines 6.375 / 8.625 -> walls on **7 and 8** | 7.0 .. 8.0 | 1.0 / **0.0** / 1.0 |
| centrelines 6.625 / 8.875 -> walls on 7.25 / 8.25 | 7.25 .. 8.25 | 1.0 / 0.25 / 0.75 |
| centrelines 6.5 / 8.75 -> walls on 7.125 / 8.125 | 7.125 .. 8.125 | 1.0 / 0.125 / 0.875 |

**An aligned 1.0 gap renders better than the set's typical 1.5 gap** — solid line, pure white row,
solid line — while giving back half a unit of drawing space. That is the whole of the argument.

### 3d. Where C7 and section 6 pull against each other

Kind (2), **systemic**. C7's goal was the **outer** edge on a whole pixel (silhouette crispness). For
a 1.25 stroke at 16 that forces the **inner** edge a quarter off — and the inner edges are the walls
of the air. Measured phase of every axial air span, as the fraction of the lower wall's coordinate:

| Master | 0 | 0.125 | 0.25 | 0.5 | 0.625 | 0.75 | other |
|---|---|---|---|---|---|---|---|
| 24 | 370 (30.5%) | — | 219 (18.0%) | 357 (29.4%) | 8 (0.7%) | 182 (15.0%) | 78 |
| 20 | 338 (30.9%) | — | 177 (16.2%) | 265 (24.2%) | — | 165 (15.1%) | 150 |
| **16** | 236 (22.1%) | **82 (7.7%)** | **287 (26.9%)** | 137 (12.9%) | 58 (5.4%) | 91 (8.5%) | 175 |

A 1.5 band is clear at phase 0, 0.5, 0.625, 0.75, 0.875 and **not** at 0.125, 0.25, 0.375. At 16 the
single largest bucket is **0.25 — the worst one.** C7 optimised the silhouette and, unavoidably for a
non-integer stroke, de-optimised the air. Nothing records the trade.

## 4. The full scan — every air span in 2,910 drawings

`realphase.mjs` ran lint's own loops (section 5 pair, 5b `selfGap`, 5f `facingGap`) over every file
with that file's own stroke, and kept the readings lint throws away. Section 5c (`materialGap`)
measures **material**, not air, and is out of scope here.

### 4a. Census

| | 24 | 20 | 16 | total |
|---|---|---|---|---|
| air spans measured | 2,624 | 2,383 | 2,277 | **7,284** |
| axial (a pixel row can cross) | 1,214 | 1,095 | 1,066 | 3,375 (46.3%) |
| **diagonal** (no pixel row crosses) | 1,410 | 1,288 | 1,211 | **3,909 (53.7%)** |
| spans drawn **exactly** at the floor, [1.5, 1.51) | 405 | 417 | 383 | **1,205 (16.5%)** |
| spans already >= 1.875 (the all-phase axial floor) | 65.7% | 57.8% | 52.9% | — |

Width distribution, all spans:

| master | <0.5 | 0.5-0.75 | 0.75-1 | 1-1.25 | 1.25-1.5 | **[1.5,1.51)** | 1.51-1.75 | 1.75-2 | 2-3 | >=3 |
|---|---|---|---|---|---|---|---|---|---|---|
| 24 | 0 | 1 | 0 | 28 | 83 | **405** | 125 | 84 | 329 | 1,569 |
| 20 | 0 | 0 | 18 | 30 | 96 | **417** | 176 | 131 | 345 | 1,170 |
| 16 | 1 | 1 | 21 | 26 | 78 | **383** | 221 | 220 | 382 | 944 |

Narrowest twelve spans in the whole set:

| width | master | kind | axis | file | note |
|---|---|---|---|---|---|
| 0.395 | 16 | shape-to-line | diagonal | `volume-off-filled` | `gap: 0.375` |
| 0.723 | 24 | shape-to-line | diagonal | `volume-off-filled` | `gap: 0.7` |
| 0.745 | 16 | pair | diagonal | `trash` | none — lint warns |
| 0.797 | 20 | shape-to-line | diagonal | `volume-off-filled` | `gap: 0.75` |
| 0.845 x6 | 16 | cut | diagonal | `sort-alpha-{ascending,descending}{,-2,-3}-filled` | none — lint warns |
| 0.897 x2 | 20 | cut | diagonal | `sort-alpha-ascending{-2,-3}-filled` | none — lint warns |

### 4b. What the floor actually delivers

`airread.mjs` rendered every span under 2.0 units at px = master, rate 16, and took **`airMin`** —
the lowest coverage of any device pixel the span's channel passes through. `airMin = 0` means a pixel
of pure background sits in the air; the gap reads. This generalises the clear-row test to diagonal
air, where no pixel row crosses the channel at all.

Agreement with the arithmetic verdict, for axial spans: **91.1% / 90.5% / 91.9%** at 24 / 20 / 16.
Every disagreement is a case where the arithmetic says a whole pixel fits but that pixel is inked by
something else in the drawing — which is M4, and is a finding, not noise.

The spans drawn at the floor, and whether they read:

| master | spans at 1.5 (+/-0.02) | produce a clear pixel | paid 0.5 units for a grey seam |
|---|---|---|---|
| 24 | 498 | 338 (**67.9%**) | 160 |
| 20 | 524 | 341 (**65.1%**) | 183 |
| **16** | 484 | 201 (**41.5%**) | **283** |

Axial only, by the arithmetic verdict: 84.0% / 82.2% / **51.1%**.

By kind, at 16, at the floor:

| kind | n | airMin = 0 | median airMin |
|---|---|---|---|
| band between two filled parts (`facing-separation`) | 100 | 64.0% | 0 |
| two separate stroked paths (`pair`) | 228 | 47.4% | 0.023 |
| shape-to-line (`facing-line`) | 14 | 42.9% | 0.184 |
| notch in the outer edge (`facing-notch`) | 15 | 40.0% | 0.227 |
| knockout / cut (`facing-cut`) | 50 | **16.0%** | 0.078 |
| counter inside a closed path (`facing-self`) | 58 | **13.8%** | 0.25 |
| an open path's own counter (`self`) | 19 | **5.3%** | 0.449 |

The spread is 5% to 64%. **One constant, nine times the delivery in one situation as in another.**
Note the direction: the *filled* kinds the facing-gap build worried about most (cuts, counters) are
the ones that read worst.

By channel angle, all spans under 2.0:

| channel angle off the axis | n | median width | width that angle needs (best phase) | airMin = 0 |
|---|---|---|---|---|
| 0-2 deg (axial) | 1,455 (57.2%) | 1.5 | 1.017 | 69.0% |
| 2-10 | 220 | 1.52 | 1.099 | 41.8% |
| 10-20 | 189 | 1.621 | 1.225 | 64.6% |
| 20-30 | 198 | 1.506 | 1.329 | 43.4% |
| 30-40 | 154 | 1.506 | 1.393 | 33.8% |
| 40-45 | 329 | 1.506 | 1.413 | 52.3% |

**No span in the set is in a channel whose best-phase floor exceeds 1.5** (0 of 498 / 524 / 484 at
the floor). So 1.5 is never *too small* for the angle. It is routinely too small for the **phase**,
and routinely 0.5 larger than the angle needs.

### 4c. The 42 spans that leave no light pixel at all

`airMin >= 0.995`: the channel produces nothing lighter than solid ink at the master's own size.

**35 of the 42 are at or above 1.5 and pass lint clean.** Eight concepts:
`book-2`, `bug`, `bug-2`, `desktop-6`, `gear-3`, `key-4`, `trash`, `watch-2`.
A further 83 spans read 0.70-0.995 (near-weld), across `gear-3`, the `key` family, `microphone-5`,
`cart-5`, `desktop-4`, `store-2`, `bug`, `bug-2` and the `sort-alpha-*` family.

Confirmed in pixels (`dump.mjs`, rate 16, px = master):

- **`book-2`** — its own file says the ribbon is *"3 · 3 · 2.75 wide on its centreline (1.5 clear
  inside)"*. At every master the 1.5 of air inside the ribbon falls across two partly-inked pixel
  columns and leaves **no white pixel at all** (airMin = 1 at 24, 20 and 16). Phase 0.125/0.5. The
  clearest single case in the set.
- **`desktop-6`** — its own file says *"Stand legs 3 · 3 · 2.75 apart (1.5 · 1.5 · 1.5 of air between
  them)"*. Rendered at 24px, the two pixel columns between the legs read under 30% coverage and no
  pixel in the channel is background. The geometric closest approach sits at y = 16.25, inside the
  bezel's own solid row — phase 0.25, the failing phase. Lint clean at all three masters.
- **`bug` / `bug-2`** at 20 and 16 — four vertical spans of exactly 1.5, all airMin = 1. The channel
  is 1.5 long and a fraction of a unit wide (the leg-to-body notch). Width was never the problem.

### 4d. The effective floor is 1.485, and nobody declared that

Kind (2), **one-off, small**. `selfGap` and `facingGap` return `gap` rounded to 2 dp
(`tools/geometry.mjs:313`), and lint compares `self.gap < floor - 0.01`. So a true span of 1.486
rounds to 1.49 and passes. The effective floor is **1.485**, a declared-nowhere tolerance of 0.015.
Six drawings sit inside that window: `attachment-filled`, `attachment-2-filled`, `database-filled`
at 24 (1.489), `paintbrush-6` and `paintbrush-6-filled` at 20 and 24 (1.486), and
`users-level` / `users-behind` / `users-3-level` / `users-3-behind` (1.487-1.488).

### 4e. The full gap census — lint's own readings, kept

Lint measures gaps in four loops and throws the readings away (they live in a local `measured[]`
that `lintSource` does not return). Those loops were ported and the readings kept, over all 2,910
drawings.

**The port is proven, not asserted.** It reproduces lint's captured baseline exactly: 62 warned
drawings, 74 warning lines, the same text drawing by drawing; its gap-family warnings equal
`lintSource`'s on **2910/2910** files; and its values equal lint's private `measured[]` array on
**2910/2910**, compared against a byte-copy of `lint.mjs` modified only to return it. A negative
control — deliberately using the filled weight on a shape-filled file, the error-prone line — is
caught on 305 of 414 such files, so the proof can see that mistake. Two independent ports were
written for this card (mine for the phase work, the census agent's for the readings) and their
per-kind row counts agree exactly: pair 5,809 · self 607 · facing-self 188 · cut 192 · notch 38 ·
separation 320 · line 130.

**9,078 rows; 7,333 of them readings** (the rest are the pairs lint skips, plus 2 unmeasurable).

| kind | 24 out | 24 fil | 20 out | 20 fil | 16 out | 16 fil | total |
|---|---|---|---|---|---|---|---|
| pair (section 5) | 1,672 | 496 | 1,409 | 491 | 1,280 | 461 | 5,809 |
| self (5b) | 143 | 61 | 137 | 61 | 144 | 61 | 607 |
| material (5c) | 0 | 19 | 0 | 17 | 0 | 13 | 49 |
| facing:self (5f) | 26 | 9 | 47 | 7 | 92 | 7 | 188 |
| facing:cut | 0 | 59 | 0 | 64 | 0 | 69 | 192 |
| facing:notch | 0 | 10 | 0 | 11 | 0 | 17 | 38 |
| facing:separation | 0 | 109 | 0 | 109 | 0 | 102 | 320 |
| facing:line | 0 | 39 | 0 | 47 | 0 | 44 | 130 |
| **pair-crossing — lint skips (`:394`)** | 38 | 14 | 41 | 28 | 59 | 19 | **199** |
| **pair-touching <= 0.1 — lint skips (`:401`)** | 412 | 121 | 404 | 107 | 382 | 118 | **1,544** |
| pair, NaN — lint never judges | 1 | 0 | 1 | 0 | 0 | 0 | 2 |

`facingGap` caps at 1.75 and ignores air under 0.02, so the facing rows are **censored above 1.75**
and their distribution means nothing there. It also returns only the narrowest air per path per kind.

### 4f. The candidate-floor table — the decision table

Each cell is **readings / distinct drawings / distinct concepts**, tested the way lint tests a
uniform floor (reading < F - 0.01), every kind read against the one F, notes ignored:

| kind | < 0.875 | < 1.0 | < 1.125 | < 1.25 | < 1.375 | < 1.5 | **today** (1.5 + exceptions) |
|---|---|---|---|---|---|---|---|
| pair | 19/19/7 | 19/19/7 | 52/51/19 | 53/52/19 | 57/55/20 | 59/56/20 | 20/20/7 |
| self | 0/0/0 | 0/0/0 | 8/8/2 | 8/8/2 | 8/8/2 | 8/8/2 | 0/0/0 |
| material | 0/0/0 | 0/0/0 | 0/0/0 | 4/4/4 | 5/5/5 | 5/5/5 | 0/0/0 |
| facing | 9/9/7 | 15/15/7 | 59/47/15 | 59/47/15 | 66/53/15 | 67/54/16 | 54/42/12 |
| **ALL** | **28/28/8** | **34/34/8** | 119/98/28 | 124/103/28 | 136/113/29 | **139/115/30** | **74/62/13** |

Read that bottom row carefully. **A uniform floor of 1.0 with no exceptions at all — no C19 glyph
carve-out, no `gap:` notes, no lint filters — would flag 34 readings on 34 drawings and 8 concepts.
Today's 1.5 with all three exception mechanisms flags 74 readings on 62 drawings and 13 concepts.**
A 1.0 floor is simpler, has no exceptions, and names fewer drawings — and every one it names is a
drawing the pixels agree about (`volume-off`, the `sort-alpha-*` family, `trash`).

Readings sitting **at** each candidate floor: 0.875 → 0 · **1.0 → 55 readings / 42 drawings / 16
concepts** · 1.125 → 1 · 1.25 → 2 · 1.375 → 2 · **1.5 → 1,304 readings / 885 drawings / 233
concepts**. Nothing in the set was ever drawn to any value between 1.0 and 1.5. The set has two
floors, and 1.0 is the one that produces the clear pixel.

### 4g. How much the floor is shaping the set

| | count | share |
|---|---|---|
| readings within 0.01 of 1.5 | 1,485 of 7,333 | 20% |
| … of them truly exact (within 0.001) | 1,260 | — |
| distinct drawings carrying one | **941 of 2,910** | **32%** |
| distinct concepts | 239 of 485 | 49% |
| drawings whose **tightest** reading is 1.5 | **889** | 31% of all · **47% of the 1,911 that have any reading** |
| drawings with **no gap reading at all** | **999** | 34% — arrows, chevrons, checks, `ban`, `book-open` |
| drawings with nothing closer than 1.75 | 1,694 | 58% |

Share of readings sitting at 1.5, by kind: pair 14% · self 5% · material 2% · **facing 74%**
(sub-kinds: separation 297, cut 149, self 102, line 65, notch 28). **Three quarters of the air in the
filled style is pinned at the floor** — the filled drawings are where the rule is doing the drawing.

### 4h. Four things lint cannot see (found by porting it)

Kind (2), **systemic**, all against lint rather than against a drawing. None changes a shipped
drawing today; each is a hole.

1. **A NaN defeats both of lint's tests silently.** `paintbrush-4` at 24 and 20: a zero-length arc
   gives `samplePath` 64 NaN samples, `Math.min` returns NaN, and both `min <= 0.1` and
   `min < need` are false — the pair is never judged. The same degenerate arc sits in **7 paths**:
   `paintbrush-4` stroked and `paintbrush-4-filled`'s areas at 24 and 20, and `chart-pie-3-filled`
   at all three masters. Harmless here (the true distance is 0, which lint would skip anyway).
2. **21 `facing:self` readings are judged by nothing.** Lint's "5b reads it" filter drops them and
   `selfGap` returns null for those paths, so neither check sees them: `cart-4` (24, 20),
   `sliders-3` (20), `camera-6`, `map-pin` / `-2` / `-4`, the `users-wide` / `users-level` family
   (16), and `database` / `database-3` at 16 (1.74). The smallest is 1.50, so nothing is wrong
   today.
3. **Lint never runs 5c on the 414 shape-filled drawings that also carry strokes.** One reading
   exists there (3.92). Already on record at `docs/08` section 6.5; now counted.
4. **The `read5b` double-warning skip in 5f has never fired on this set.** Dead code: of the 188
   facing-self rows, 87 are dropped by the first filter and 0 by the second.

**And one good-news finding: nothing is silently under its floor.** Of the 188 readings below 1.5,
every one is either a lint warning (74), a declared note holding its lowered floor (66), or inside
lint's 0.01 tolerance (48). **Zero readings are hidden by a lint filter.**

### 4i. Lint reports overlapping ink as a negative gap

Kind (2), **systemic**, and the bridge to part two. 18 pair readings in the set are **negative** —
the two strokes' ink overlaps, but they neither cross (so `:394` does not skip them) nor come within
0.1 of each other's centreline (so `:401` does not either). All 18 are the six `sort-alpha-*`
concepts: **-1.04 at 24 · -0.96 at 20 · -0.93 at 16** (centreline distances 0.46 · 0.54 · 0.32).

Lint prints these as *"paths 1/2 are 0.46 apart — section 6 needs 3 (edge gap -1.04 < 1.5)"*. That
is a **contact**, described as a gap of negative width. 18 of the 62 warned drawings' 74 warning
lines are this. The set's own `plans/sort-family.md` calls them "expected" — which they may be, but
what is expected is a *join*, and there is no rule about joins to appeal to.

## 5. Does one constant do the job?

**No. It does one job well, one by accident, and two not at all.**

| The question | Answer, measured |
|---|---|
| Does the floor need to differ **by master**? | **No.** One unit is one device pixel at every master's own size; the probe gives the identical floor at 24, 20 and 16. The existing literal is correct |
| Does it need to differ **by situation** (the seven)? | **No, not by those seven.** Parallel runs, facing edges, knockouts, counters, bands and shape-to-line air give identical pixel tables. Flank depth is irrelevant |
| Does it need to differ **by anything**? | **Yes — by the channel's ANGLE and its PHASE,** neither of which any rule mentions. Axial: 1.0 aligned, 2.0 unaligned. 45 degrees: 1.414 at any phase |
| Is 1.5 the wrong number? | **No. 1.5 is the right single constant** — the tightest grid-legal value that clears the 45-degree floor of 1.414. The *reasoning* for it is wrong, and it is missing its other half |
| What is the rule missing? | **The alignment clause.** 1.5 guarantees nothing without it, and delivers only 41.5% of the time at 16 |

Three statements in the repo are refuted or reduced by the above:

- `docs/08-refinement.md:108-111` (section 3.4) and C19's evidence (1) — *"100% clear background at a
  0.88 gap just as at 1.5"*. Wave 0 already refuted it. Measured here with the phase sweep: a 0.88
  band has **0 of 8** clear phases; a 1.5 band has 5 of 8. The claim is true of one phase and false
  as stated. C19 in doc 07 admits this ("passed on phase"); section 3.4 does not, and section 3.4 is
  what gets cited.
- `tools/masters.mjs:60-64` — *"the floor is what survives a 16px render"*. 1.5 does not survive a
  16px render at 3 of 8 phases, and at the 16 master it fails at the set's most common phase.
- `tools/masters.mjs:88-90`, on `GLYPH_GAP` — *"one whole unit, which is one pixel at every master's
  own size, the smallest gap that still holds a clear pixel row"*. **This is the correct general
  rule, written down for one exception.** It holds a clear pixel row only when aligned: of the 33
  C19 glyph dot-gaps in the shipped set, **10 produce a clear pixel** and 23 read 0.04-0.26 grey.
  Every one of the 10 is at phase 0; every failure is at phase 0.19-0.87.

## 6. The three exceptions, and the shape that needs none

### 6a. The exceptions, measured

| Exception | Where | What it says | What the pixels say |
|---|---|---|---|
| **C19 glyph gap = 1** | 96 files (90 `glyph: dot`, 6 `glyph: numeral`) | a character's inside floors at 1, not 1.5 | **Correct, and general.** 1.0 is the axial floor. 10 of 33 dot-gaps read clear; the other 23 are unaligned, not too narrow |
| **per-file `gap: N`** | 10 files, 6 concepts — `alert-triangle-2`, `alert-triangle-4`, `attachment-4`, `database-2`, `sort`, `volume-off`; values 0.375 · 0.7 · 0.75 · 1 (x4) · 1.25 (x2) · 1.48 | an agreed deviation for one file | Mixed. `database-2-filled` 1.485 reads **clear** — the note buys nothing a tolerance would not. `sort` / `sort-filled` at 16, note 1, read **clear**. `attachment-4-filled` reads 0.297-0.313. `volume-off-filled` at 16, note 0.375, reads **0.637** — a genuine near-weld, and the only note in the set covering something the pixels confirm is bad |
| **1.5 of white at 16 in a filled drawing** (C22 / C23 dated notes, 2026-09-28) | about 61 icons cut at 1.5 | white needs 1.5, not the 1.25 line | **Not a rasterisation fact.** A knockout and a parallel run give byte-identical pixel tables (3a). If white reads thinner than ink, it is a perceptual effect, and the rule rests on C18's eye, not on a render. Eye-only |

**Exceptions are evidence the rule is the wrong shape.** All three are symptoms of one missing
clause: the rule states a **width** when the thing it protects is a **pixel**.

### 6b. The shape that would need no exceptions

> **The air in a drawing holds one whole device pixel at the master's own size.**

Everything else is derived. Nothing is chosen:

| Derived consequence | Value |
|---|---|
| axial air, wall on a whole pixel | **1.0** — free on the existing grids (3c) |
| axial air, wall anywhere | 2.0 |
| air in a channel at angle t off the axis | **\|cos t\| + \|sin t\|** — 1.414 at 45 degrees |
| one safe constant for every angle, **given an aligned wall** | **1.5** — what the set already draws |
| C19's `GLYPH_GAP = 1` | stops being an exception; it is the axial floor |
| the 1.5-for-white rule | stops being a floor; becomes a perceptual decision, scoped as one |
| a 1.5 span 0.3 units long (`bug`, `desktop-6`, `book-2`) | **fails**, which today it does not |

It is lint-checkable without new geometry: `facingGap` and the pair loop already have the span's two
ends, so the band, its angle and its phase are all in hand. The two-dimensional test (M4) needs the
renderer, which exists.

### 6c. What it would cost

`cost.mjs`, over every span under 2.0 units:

| | count |
|---|---|
| spans failing "holds a whole clear pixel" | **1,017 of 2,545 (40.0%)** |
| drawings affected | **647 of 2,910 (22.2%)** |
| concepts affected | **229 of 485 (47.2%)** |
| of those, fixable by a **grid-legal nudge of <= 0.25** (slide one wall, no new geometry) | 321 drawings |
| needing more than that, or in a diagonal channel | 406 drawings |
| largest nudge needed, per master | 0.750 (24) · 0.934 (20) · 0.870 (16) |
| alternative: widen the air instead; most spans need <= 0.25 more | 24: 72/97 · 20: 80/117 · 16: 206/222 axial spans |

**That is far too much work to adopt as an error.** The honest reading is not "redraw 647 drawings"
but:

1. The rule as stated **cannot** be enforced to its own purpose without that bill, which is itself
   the finding.
2. The cheap, high-value subset is the **42 spans that leave no light pixel** (8 concepts) and the
   **83 near-welds** — drawings where the air does not work at all and lint says nothing.
3. The alignment clause costs nothing on **new** drawings. Adopted going forward it is free; adopted
   retrospectively it is 321 nudges.

---

# Part two — contact grammar

The gap rule governs ink **not** touching. Nothing in the repo governs ink touching. Measured with a
census built for this card (`contact-census.mjs`, 2,910 drawings, **0 parse failures**), which finds
every contact between two stroked paths, between two subpaths of one `d`, between a stroke and a
filled area, and between two areas, using the per-file weight rule from `lint.mjs:203-212` (verified
at the pin: **zero** files carry a per-path `stroke-width`, so one weight per file is exact).

**The discriminator has no free parameter**, which matters because the choice moves the headline:
**a crossing is a T when one path's round cap is buried in it** — the path's nearer endpoint sits
strictly inside `reach` (= the two half-strokes), so no separate leg emerges. Two other cuts were
tried and rejected, and the rejects are recorded: `near <= canvas/8` read `sliders-4`'s knob bar
(dead centre on its rail) as a stem overshooting by 2.25; `far <= near + reach` flipped the same
junctions onto the rail and reported an overshoot of 5 for a rail that plainly runs on. The 48
crossings whose shorter leg falls between `reach` and `canvas/8` are flagged ambiguous rather than
folded in, and `near`/`far` sit on every record so another cut can be taken without re-running.

**Two metrics, never mixed.** *centreline* — stroke against stroke, signed distance past the other
path's centreline. *area-depth* — stroke against filled area, signed depth past the area's boundary,
because an area has no centreline.

**3,036 primary junctions** (plus 76 secondary: the same junction seen again from the second cap
pair), in **1,332 of 2,910 drawings (45.8%)**. 1,578 drawings have no contact at all; **215 of 485
concepts are contact-free in all six files.** Busiest drawing: `gear-3` — 24 junctions at 24, 34 at
20, 18 at 16.

| class | metric | 24 | 20 | 16 | total |
|---|---|---|---|---|---|
| T-on | centreline | 622 | 617 | 608 | **1,847** |
| T-short | centreline | 23 | 21 | 21 | 65 |
| T-through | centreline | 9 | 10 | 13 | 32 |
| T-through | area-depth | 121 | 121 | 121 | **363** |
| T-on + T-short | area-depth | 22 | 22 | 22 | 66 |
| cross | centreline | 87 | 86 | 91 | 264 |
| cross | area-depth | 20 | 20 | 19 | 59 |
| corner | centreline | 35 | 38 | 39 | 112 |
| graze | centreline | 17 | 48 | 43 | 108 |
| overlap | centreline + area | 40 | 36 | 38 | 114 |
| other | centreline | 2 | 2 | 2 | 6 |

By element kind: stroke/stroke 2,530 · area/stroke 488 · area/area 18.

## 7. Lint's coverage of this territory is 1.2%

| Which branch sees the junction | path pairs | junctions |
|---|---|---|
| A — two subpaths of **one** `d`: never enters lint section 5 at all | 21 | 60 |
| B — skipped at `tools/lint.mjs:394`, "paths that cross … join by design" | 1,526 | **2,152** |
| C — skipped at `tools/lint.mjs:401`, `min <= 0.1` | 659 | **788** |
| **D — lint measures it** | **18** | **36** |
| total | 2,224 | 3,036 |

**3,000 of 3,036 junctions (98.8%) are examined by nothing.** And all 18 pairs in bucket D are the
six `sort-alpha-*` concepts — the ones lint then reports as a gap violation with a **negative** edge
gap (-1.037 at 24 · -0.963 at 20 · -0.933 at 16, from centreline distances 0.463 · 0.537 · 0.317).
**The only junctions lint sees are the 1.2% it describes wrongly.**

Counted again independently from lint's own loops (`blindspots.mjs`, a separate port): of 7,554
stroked-path pairs, **199 are dropped as crossing and 1,544 as touching — 1,743 (23.1%)** — across
1,084 of 2,910 drawings and 263 of 485 concepts. Those are pairs of separate stroked paths only;
subpath-to-subpath, stroke-to-area and area-to-area contacts never reach that loop at all.

**Reconciled, since two numbers circulate.** At this pin lint warns on **62 drawings carrying 74
warning lines** (54 from section 5f, 20 from section 5). Both independent ports agree. 18 of the 20
section-5 lines are these junctions; the other 2 are genuine near-misses on `trash` at 20 and 16.

**One suspicion checked and dismissed.** It was put to me that `lint.mjs:283` builds `ds` from every
`<path>`, so section 5 would be comparing a filled area's outer *contour* against a stroke's
*centreline*. It does not: `lint.mjs:278` strips the area paths before `ds` is built. Verified over
all 1,026 shape-filled files — **zero leaks**. (Fifteen files do carry a stroked path whose `d` is
byte-identical to one of their area paths — `arrow-{down,left,right,up,up-right}-4-filled` at all
three masters — so the same outline is both filled and stroked there. That belongs to card 1.8.)

## 8. The implicit rule — and it is followed to the bit

**1,944 stroke-to-stroke T-junctions:**

| | 24 | 20 | 16 | total | share |
|---|---|---|---|---|---|
| lands **on** the other centreline (abs overshoot <= 0.01) | 622 | 617 | 608 | **1,847** | **95.0%** |
| stops **short** | 23 | 21 | 21 | 65 | 3.3% |
| runs **through** | 9 | 10 | 13 | 32 | 1.6% |

The "on" share is the same at every master: **95.1% · 95.2% · 94.7%.** Four bands, by what the number
can be:

| band | 24 | 20 | 16 | total | ceiling |
|---|---|---|---|---|---|
| **1 — exactly 0.000** | 467 | 469 | 534 | **1,470** | 0 |
| 2 — <= 0.01, non-zero | 155 | 148 | 74 | 377 | 0.01 unit = **0.01 device pixel** |
| 3 — 0.01-0.25 | 12 | 10 | 12 | 34 | 0.195 |
| **4 — >= 0.25, structural** | 20 | 21 | 22 | **63** | 1.75 |

**Band 2 is construction residue, proved by hand rather than assumed.** 371 of its 377 junctions have
an arc at the junction and the other 2 are `package-3`'s 60° fold; **not one of the 377 values is a
multiple of the drawing grid**, so none was typed. Worked case: `arrow-down` at 24 — the chevron's
C10 bend is `A0.75 0.75` across a 1.06 chord at y 18.53, so its exact lowest point is
18.53 − √(0.75² − 0.53²) + 0.75 = **18.74934**, while the shaft ends at the typed **18.75**. The
shaft stands 0.00066 past the chevron's centreline *by construction*. Band 2 is "on".

> **The implicit rule, in two sentences a doc could carry:**
>
> **A junction lands on the line.** Where one stroke ends on another, its endpoint sits exactly on
> the other's centreline — 1,847 of 1,944 such junctions (95.0%), the same share at 24, 20 and 16,
> 1,470 of them to the bit and the other 377 within a hundredth of a pixel. Nothing stops short or
> runs past by more than **half a stroke**: the largest shortfall is 0.75 at 24, 0.575 at 20, 0.625
> at 16, and **not one of the 65 exceeds h**.
>
> **A filled file does not move its junctions.** Where a line meets a filled shape its endpoint reads
> exactly half a stroke inside the shape's edge — **0.75 · 0.75 · 0.625**. 341 of 429 such junctions
> measure that, and **317 of them (93.0%) sit at the identical coordinate as a T-on in the outline
> twin**: the line keeps its outline coordinate and the area's edge is that same centreline offset
> outward by h. Confirmed on `briefcase` — outline rim centreline y 6.75, handle ends at y 6.75,
> filled area's top edge y 6.00 = 6.75 − h.

Why it is the right rule geometrically: both strokes carry round caps, so an endpoint on the other
centreline puts its cap flush with the other stroke's far ink edge whenever the weights match. The
join closes with no nib and no notch, at any weight and any master, with no number to remember. It is
the cap-inset rule in `CLAUDE.md` ("round caps extend half a stroke past the path endpoint") applied
to a junction instead of to a keyline.

**This is more consistent than most of the set's written rules, and it is written nowhere.** A new
drawing could land a stem 0.75 past a bar and lint clean.

## 9. Does a junction show? Complete, not sampled

Every one of the **97 junctions with abs(overshoot) > 0.01, plus 41 exact-zero controls = 138
probes.** Each probe is a *difference*: the drawing as shipped against a synthetic twin whose
terminating endpoint is moved by −overshoot along its own outward direction, both built from the same
flattened polylines so arc flattening cancels. Rendered at the master's own size, 32 subsamples per
axis.

| maxDelta (1.0 = a whole pixel of ink) | T-short | T-through | control |
|---|---|---|---|
| **0 — nothing changes** | **65** | 11 | 41 |
| 0-0.02 | 0 | 11 | 0 |
| 0.02-0.05 | 0 | 5 | 0 |
| 0.05-0.10 | 0 | 1 | 0 |
| 0.10-0.25 | 0 | 1 | 0 |
| > 0.25 | 0 | 3 | 0 |

**117 of 138 change nothing at all.** Only five exceed 0.05, and three of those are the tangential
`at-sign` cases where the probe is not meaningful (approach angle 0.42-0.57°, perpendicular overshoot
0.014). **The one genuine case in the whole set is `plug-6`: 0.125 of a pixel at 24, 0.060 at 20,
0.004 at 16.**

**And the stop-short case is provable, not sampled.** A stroke's round cap extends h past its
endpoint; a contact requires the shortfall s <= reach = 2h; full coverage at the cap's shoulder needs
s <= h — and all 65 satisfy it. The probe returns 0.000 for every one. **No stop-short T in this set
can leave a seam.** A through-overshoot does show, in proportion to s, unless the other path's ink
swallows it: `gauge`'s needle ends 0.75 inside a stroked r0.75 dot (a solid disc) and reads 0.000;
`plug-6`'s prong pokes 0.195 past a body band and reads 0.125. Convergence check on `lock-3` at 24:
0.0078 (rate 16) → 0.0107 (32) → 0.0112 (64), so figures under about 0.01 are at the noise floor and
everything quoted above 0.05 is stable.

## 10. The exceptions have no rule

Bands 3 and 4 together: **97 junctions, no shared value and no scaling law.** Of the 17 concepts
present at more than one master, **6 read as a multiple of the canvas** (the `sort-alpha` six), **2 as
a multiple of the stroke** (`gauge` outline, `thumbs-up-2`), **9 as neither, and 0 as a constant**.
Band 4 lives in **10 concept families**: `sort-alpha-*` (36 of the 63), `lock-5` / `lock-6` (10),
`gauge` (8), `at-sign` / `at-sign-2` (3, all tangential), `language` filled at 16 (1.641 at 88°),
`clipboard-2`, `plug-6`, `lock-3`, `store` / `store-2`, `thumbs-up-2`.

As multiples of their own stroke, `lock-5`'s three masters read 0.50 · 0.33 · 0.30 and `gauge`'s
0.50 · 0.33 · 0.50. **Where the set leaves the centreline rule it leaves it by a different amount at
each master.**

## 11. Where ink touching is doing real work

- **The 1,847 T-on junctions are the set's construction** — every stem on a bar, every wall on a lid.
  `trash` at 24: both can walls and both tab legs land at overshoot **0.000** on the lid line's
  centreline.
- **C22's "known lint false positive", measured at last.** C22 says the `trash` tab legs "never share
  space — the lid's own 1.5 stroke covers the point where they meet". Measured: lid tip to can start
  is **1.5 apart at 24 with reach 1.5** (the caps kiss at exactly one point) and **1.0 apart at 20
  and 16** (the caps overlap by 0.5 and 0.25). The drawing is sound, and the three masters do it
  differently.
- **4 junctions where the two inks abut at exactly edge gap 0.000** — section 6's 1.5 floor driven to
  zero and saved only by touching: **`plug-3`** at 20 (two) and at 16 (two), `dmin` = `reach` exactly.
- **108 grazes** where the inks only just abut, i.e. an edge gap at or below zero in drawings lint
  passes clean: `at-sign` / `-2`, `clipboard-2` at 20, `gauge-filled` at 16, **`gear-3` at 20 — 12
  grazes, every spoke against the hub**, `italic-filled` at 16, the `key` / `key-5` / `key-6` family
  at 20, `language-filled` at 24 and 20.
- **26 true shared runs** (coincident to 0.002): `globe` ×3, `globe-2` ×6, `language-2` ×3,
  `language-3` ×6, `at-sign-2` ×4, `toggle-on` ×3, `database-2` ×1 — a meridian lying along a ring.
- **70 "overlaps" that are really tangencies** — 0.25-0.8 units of visual merge at tolerance 0.03
  that vanish at 0.002: `book`, `book-2`, `book-3`, `bold`, `database*`, `desktop-6`,
  `sort-numeric-*`, `thumbs-up`. Two internally tangent arcs of r9 and r3 stay within 0.03 for 0.52
  units, which is why they read as a run.
- **18 area-to-area welds**: `search`, `search-2`, `search-3` (lens plus handle), `wallet`, `trash`,
  `desktop-6` filled.
- **6 `other`**: `wand-2`, `wand-3` — two subpaths of one `d` approaching to 0.372-0.77.

## 12. Where the grammar is not the same across the set

**Across masters** (970 concept × style groups): **35 differ across 24 / 20 / 16 — 21 structurally
and 14 by a graze only.** `clipboard-2` is exactly the case the brief asked about: **T-short at 24,
T-through at 20 and 16.** Others: `compass` / `compass-3` (two T-ons at 24 and 20, **none at 16**),
`microphone` (two, two, one), `database` / `database-3` (9, 6, 6), **`sliders-2` (no contact at 24 or
20, three crossings at 16)**, `sliders-3` (6, 6, 4 outline), `gauge` filled (T-through at 24 and 20,
cross at 16), `plug-6` (T-through ×3, then T-on ×2 + T-through, then T-through ×3), `language` filled,
`wand` / `wand-2`, `gear-3` (24, 34, 18), `at-sign` / `at-sign-2` filled, `globe-2`, `language-3`.
Graze-only: `at-sign`, `at-sign-2`, `italic`, `key`, `key-5`, `key-6`, `lock-3`, `lock-5`, `lock-6`,
`plug-3`, `sliders-4`.

**Between outline and filled**: 582 of 1,455 concept × master pairs differ, but **571 are
shape-filled**, where a fill replaces the lines and a changed grammar is by design. The population
that matters is the **429 line-heavy pairs — the same drawing at a heavier stroke — and 418 of them
agree (97.4%).** Eleven disagree, in six concepts: `at-sign`, `at-sign-2`, `gauge` at 16, `italic` at
16, `language` at all three, `sliders-4` at 24.

**19 junctions exist only in the filled file; 0 only in the outline.** The cause is mechanical:
`reach` grows with `FILLED_WEIGHT` (1.5 → 2.5 at 24, 1.5 → 2 at 20, **1.25 → 2 at 16**), so any pair
standing 1.5-2.5 apart in the outline starts touching when filled. Worth stating as a consequence of
the filled rule: **the filled style manufactures contacts the outline does not have.**

---

# Judged list — short

Three kinds, kept apart. Each tagged **one-off** or **systemic**.

## Kind (2) — a rule disagrees with another rule, or with the docs

1. **The gap rule is missing its alignment clause.** *Systemic.* 1.5 of air holds a clear pixel at 5
   of 8 phases. Delivery measured, axial spans at the floor: **84.0% / 82.2% / 51.1%** at 24 / 20 / 16;
   across all spans at the floor, 67.9% / 65.1% / **41.5%**. The number is right (it is the grid-legal
   minimum for a 45° channel, 1.414); the rule is half-written. Sections 3, 4b.
2. **C7 and section 6 pull against each other, and nobody recorded the trade.** *Systemic.* A 1.25
   stroke cannot put both edges on a whole pixel; C7 chose the outer one, which puts the air's wall a
   quarter off. At 16 the commonest air phase is **0.25 (26.9%)** — the one phase at which 1.5 cannot
   hold a pixel. Section 3d.
3. **`GLYPH_GAP`'s own comment states the correct general rule.** *Systemic.* `tools/masters.mjs:88-90`
   — "one whole unit, which is one pixel at every master's own size, the smallest gap that still holds
   a clear pixel row". That is the derivation, scoped to 96 files as an exception. Sections 5, 6b.
4. **`tools/masters.mjs:60-64`'s stated rationale is false.** *Systemic.* "The floor is what survives a
   16px render" — 1.5 fails at three of eight phases, including the set's most common one at 16.
5. **`docs/08-refinement.md:108-111` (section 3.4) is still cited and still wrong.** *One-off, high
   leverage.* Wave 0 refuted it; this card measured the sweep that explains why — a 0.88 band has
   **0 of 8** clear phases, a 1.5 band 5 of 8. C19 in doc 07 is honest about it ("passed on phase");
   section 3.4 is not. Owed to card 1.16.
6. **The 1.5-for-white rule is not a rasterisation finding.** *Systemic.* Knockouts, bands and parallel
   runs give byte-identical pixel tables. C18 / C22 / C23 rest on the eye, which is legitimate — but
   they read as if measured. Sections 3a, 6a.
7. **Section 6's floor is written for air and lint applies it to ink.** *Systemic.* On 18 junctions lint
   computes a **negative** edge gap (−1.04 / −0.96 / −0.93 on the six `sort-alpha-*`) and prints
   "needs 1.5" — a quantity with no meaning once the inks overlap. The rule carries no range statement
   saying it stops at zero. Sections 4i, 7.
8. **`lint.mjs:394` and `:401` between them exempt 98.8% of the set's junctions,** and no rule anywhere
   states a junction convention. *Systemic.* The gap is two-sided: the rule that exists fires where it
   should not, and the rule the set actually follows does not exist. Sections 7, 8.
9. **Four holes in lint, found by porting it.** *Systemic, nothing wrong today.* A NaN from a
   zero-length arc defeats both of section 5's tests silently (`paintbrush-4` at 24 and 20; the same
   degenerate arc is in 7 paths, including `chart-pie-3-filled` at all three masters). 21 `facing:self`
   readings are judged by nothing. Section 5c never runs on the 414 shape-filled drawings that also
   carry strokes. The `read5b` double-warning skip has never fired. Section 4h.
10. **The effective gap floor is 1.485, not 1.5.** *One-off, small.* The tools round to 2 dp and lint
    tests `< floor − 0.01`, so 1.486 passes as 1.49. **48 readings in 45 drawings and 34 concepts** sit
    inside that undeclared 0.015 tolerance. Section 4d, and the full list in the census.
11. **`tools/audit/raster.mjs`'s `classify` is unsound for filled shapes.** *Systemic*, against a wave-0
    instrument. It reports `empty` for a half-inked box and `rasterise` prints 0.00 where the truth is
    0.50. Cards 1.5 and 1.6 rest on it. Section 0.

## Kind (3) — fine by every rule, and the drawing still does not work

12. **42 air spans leave no pixel lighter than solid ink; 35 of them pass lint.** *Systemic cause* (a
    pixel is 1 × 1 and the rule measures one dimension), **8 concepts**: `book-2`, `bug`, `bug-2`,
    `desktop-6`, `gear-3`, `key-4`, `trash`, `watch-2`. Plus 83 near-welds at 0.70–0.995. Section 4c.
13. **`book-2` and `desktop-6` are the two to look at.** *One-off each.* `book-2`'s file says the ribbon
    holds "1.5 clear inside"; at every master that 1.5 falls across two partly-inked pixel columns and
    leaves **no white pixel at all**. `desktop-6`'s file says "1.5 · 1.5 · 1.5 of air" between the stand
    legs; the channel reads under 30% grey at every master and contains no background pixel. Both lint
    clean. Section 4c.
14. **The floor overcharges the axial case by half a unit, 1,455 spans deep.** *Systemic.* 57.2% of the
    set's air channels are axial, where an aligned 1.0 renders **better** than an unaligned 1.5 — clear
    row against a 25% grey seam — and returns 0.5 units of drawing space. Section 3c.
15. **Curvature is unpriced.** *Systemic.* A cap-to-cap or glyph-mouth gap reads 0.45× as dark as a
    straight run of the same width; the floor charges them the same. Section 3a.
16. **53.7% of the set's air is in a diagonal channel, where "a clear pixel row" cannot apply.**
    *Systemic.* No rule has ever said what governs diagonal air. The derivation gives 1.414 at 45°, and
    1.5 happens to clear it. Sections 3b, 4a.
17. **Three masters of one icon disagree about the same junction.** *Systemic in form, 10 concepts in
    extent.* `lock-5` overshoots by 0.75 · 0.5 · 0.375 (0.50 · 0.33 · 0.30 of its own stroke); `gauge`
    by 0.75 · 0.5 · 0.625. Of the 17 concepts in bands 3 and 4, 6 scale with the canvas, 2 with the
    stroke, 9 with neither, **0 are constant**. Sections 9, 10.
18. **35 of 970 concept × style groups change their contact grammar across masters.** *Systemic.*
    `clipboard-2` butts at 24 and overshoots at 16; `compass` has two junctions at 24 and 20 and none at
    16; `sliders-2` has none at 24 and 20 and three crossings at 16. Section 12.
19. **The filled style manufactures contacts the outline does not have.** *Systemic cause, 6 concepts
    today.* `reach` grows with `FILLED_WEIGHT`, so **19 junctions exist only in the filled file and 0
    only in the outline**. Section 12.
20. **`plug-3`'s four abutments at exactly edge gap 0.000**, and the 108 grazes generally. *One-off for
    `plug-3`, systemic for the class.* The same geometric relation — two ink edges 0 apart — is a hard
    warning when the paths are far enough apart to be measured and invisible when they are not. The
    threshold is `0.1` in `lint.mjs:401`, with no recorded reason. Section 11.

## Kind (1) — a drawing disagrees with a stated rule

21. **`sort-alpha-*`, 6 concepts × 3 masters.** *Systemic within the family.* The A's crossbar stops
    0.495 / 0.575 / 0.337 short of the diagonals and the inks overlap by 1.04 / 0.96 / 0.93, so section 6
    fires on all 18. Measured cause: the crossbar sits on grid values while the legs are diagonals
    crossing at x 4.505 and 7.995, so **the shortfall is whatever the grid gave** — it scales with the
    canvas, not the stroke, which is the signature of a consequence rather than a decision. It renders
    identically to an exact junction (maxDelta 0.000 at all three masters). Their filled cuts also
    bottom at **0.845 at 16** and read 0.70–0.99 — the worst-reading breaches in the set. No `gap:`
    note, no C-row; `plans/sort-family.md` calls them "expected".
22. **`plug-6`.** *One-off, 3 prongs × 3 masters.* The prongs overshoot the body outline by 0.195 / 0.119
    / 0.023–0.028 — the only non-tangential junction in the set putting measurable ink *outside* another
    path: 0.125 of a pixel at 24. No rule forbids it and nothing measures it. Sections 9, 10.
23. **`clipboard-2`.** *One-off.* Stops 0.011 short at 24, runs 0.121 / 0.033 past at 20 / 16 —
    invisible, but its junction *kind* is not the same across its three masters.
24. **Nothing else.** No new air breach was found. **Nothing in the set is silently under its floor:**
    of the 188 readings below 1.5, every one is a lint warning (74), a declared note holding its lowered
    floor (66), or inside lint's tolerance (48). **Zero are hidden by a lint filter.** Section 4h.

---

# What only Maruti's eye can settle, and where

| Question | Why no tool can settle it | Surface |
|---|---|---|
| **Does a white line read thinner than a drawn one?** C18's finding, which C22 and C23 rest on. The pixels are identical; the claim is perceptual. | A renderer cannot tell ink from paper. | A sheet pairing each cut at 1.25 and 1.5 against a drawn line of the same width, at real 16px, light and dark. About 61 icons already cut 1.5 at 16; 9 were redrawn for it in September. |
| **What lightness counts as "reads as background"?** The ladder is measured: 1.0 → 0.5 grey, 1.25 → 0.375, 1.5 → 0.25, 1.75 → 0.125, 1.875 → clear. | A number has to be picked on this axis before any floor can be derived from it. | That ladder drawn out, every eighth from 0.875 to 2.0, at real 16px, greys labelled. |
| **Is an aligned 1.0 gap acceptable as the general floor?** It renders strictly better than today's typical 1.5 and returns 0.5 units of drawing space everywhere. | The gain is in drawing room, which is a design judgement. | The three constructions of section 3c side by side at real 16px, then `menu`, `file-text` and `calendar` redrawn both ways. |
| **Is the curvature discount worth taking?** A cap-to-cap gap could run about 0.6 narrower for the same darkest pixel. | Perceptual equivalence of a one-pixel speck against a long seam. | A cap-to-cap pair swept 0.875 → 1.5 beside a parallel run swept 1.0 → 2.0, matched on darkest pixel. |
| **The 8 concepts whose air leaves no light pixel** — `book-2`, `bug`, `bug-2`, `desktop-6`, `gear-3`, `key-4`, `trash`, `watch-2`. | The pixels only say the air is not working; whether each still reads is the eye's call. | Those 8 at real 16px, 1× and 2×, outline and filled, beside a known-good neighbour. The wall (card 4.1) covers it. |
| **Should "a junction lands on the line" become a written rule?** The set already does it 95.0% of the time at every master, so this ratifies practice rather than changing it. | Only the eye can say whether the 63 structural exceptions are character or drift. | The Library At 16 strip, outline and filled. |
| **Is the A's crossbar meant to touch its legs or to stop short, the way a letterform would?** 18 live lint warnings hang on it, and today's numbers are grid residue rather than a chosen value. | It is a letterform decision. | Library At 16 with the other letterform icons beside it — `bold`, `italic`, `sort-numeric-*` — plus `/lab/icon.html` Compare rows at 96 · 48 · 24 · 20 · 16. |
| **Is `plug-6`'s 0.195 prong overshoot at 24 character or defect?** An eighth of a pixel of extra ink on the body's outside edge, and the set's only one. | Taste. | Compare rows for `plug-6`, real pixels at 16. |

---

*Card 1.7. Every figure above was produced this session by the scripts named in the header and can be
reproduced from them; the two censuses were each written as an independent port of lint's own loops
and their per-kind row counts agree exactly. No figure is recalled. Nothing outside this file was
changed.*
