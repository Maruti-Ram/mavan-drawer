# Findings — the pixel grid at 16 (F7)

Card 1.6 of `plans/set-and-rules-audit.md`; the companion of `docs/audit/findings-mass.md`. Measured against **commit `5933041`**: 485 concepts × 3 masters × 2 styles = **2,910 drawings** (lint baseline at the pin: 2,910 · 2,848 clean · 62 warned · 0 failed). Written 2026-10-04.

**Nothing in the set, the rules, lint, the sheet or the board was changed.** This file and `findings-mass.md` are the only things written.

**Independently checked.** A fresh reviewer (Sonnet) who had not seen my scripts re-measured 28 numeric claims from the two documents (14 from this one) and the tables around them; all reproduce except a floating-point tie at a band edge, now stated in §3.2. Its corrections to my wording are made: `plug-3`'s cause, the `diagonalShare` account, "run" versus "run edge", the band-table definitions, 4.5 rather than 4.6 points.

How to read it: the short answer is §0; §2 is the key that turns a score into pixels; the census and the bands are §3; the other masters §4; what the instrument cannot see §5; the judged list is §6; the appendices hold every score for every drawing.

**Method in one paragraph.** A *landing score* comes from `pixelgrid.edgeLanding` / `blurScore` (`tools/audit/pixelgrid.mjs`) and is pure path geometry — no sampling, so no rate: for each straight axis-aligned run and each curve extreme it takes the ink edge (centreline ± half the stroke), measures how far that edge sits from the nearest whole device-pixel line, and averages by ink length, scaled so **0 = every edge on a pixel line and 1 = every edge on a pixel centre**. Every drawing is scored **at its own master's size, one device pixel per unit (1×)**: 24 at 24 px, 20 at 20, 16 at 16 — the plan's question is "crisp at 16". Pixel profiles in §2 are `rowProfile` at rate 32 on probe lines. `diagonalShare` is reported as the instrument gives it. Beside the instrument I measured three things the instrument does not give — the **solid-pixel share** (does a straight line have a fully inked pixel?), the **darkest pixel across a line**, and where each centreline sits — from the same path data with an analytic pixel profile that I checked against the rasteriser on 48 test lines (largest difference 0.0000). Chromium was used as a cross-check on the pixel profiles (§2). Kinds of finding follow the plan: **(1)** a drawing disagrees with a stated rule, **(2)** a rule disagrees with another rule or the docs, **(3)** a drawing is fine by every rule and still looks different, and no rule covers it. Every finding is tagged **one-off** or **systemic**.

---

## 0. The short version

**Where an edge lands on the 16 px grid is settled by one piece of arithmetic: a 1.25 stroke is not a whole number of pixels, so no straight line can sit crisp on both of its edges.** The best a straight 1.25 line can score is **0.25**; the worst, **0.75**. The set's scores sit between those two walls, with a few that rest on curves going outside them.

- **Who can be scored.** Of 485 outlines at 16, **312** have a straight axis-aligned run and under half their straight length diagonal. 16 more have no straight run and are scored on curve extremes alone; **153** are diagonal-heavy (chevrons, checks, arrowheads, triangles); 4 have no axis-aligned edge at all (`x`, `x-small`, `x-large`, `arrow-up-right-3`). **173 of 485 (36%) are outside what the instrument can judge** (§5). Ranked without that filter, the first 14 places are all diagonal-heavy drawings and the first scorable one is 15th.
- **Wave 0's figures hold exactly:** 312 scorable, floor **0.189**, median **0.285**, max **0.750**, and the landing score is computed from path data, never from the `raster.mjs` rasteriser whose bug was reported against area drawings (§1.1).
- **What the four bands look like** (312 scorable outlines): **A, under 0.30 — 172 drawings (55%):** every straight line has one fully inked pixel with at most a quarter-grey shadow beside it; a hard, dark line. **B, 0.30–0.50 — 100 (32%):** some lines hard, some with no solid pixel; one icon holds lines of visibly different sharpness. **C, 0.50–0.70 — 31 (10%):** most straight lines have no solid pixel, two pixels of 50–88% grey; the icon reads washed out beside a hard neighbour (the arrows: a pale shaft on a dark head). **D, 0.70 and over — 9 (3%):** no straight line has a fully inked pixel anywhere; pale, slightly wider bars.
- **The 0.70–0.75 band, by name:** `plus`, `plus-small`, `plus-large`, `minus`, `minus-small`, `minus-large`, `chart-bar`, `menu-3` (all exactly 0.750) and `plug-3` (0.704). **What the eight at 0.750 share:** every straight line in them sits on a **whole-number centreline**, so both ink edges are three-eighths of a pixel off a pixel line. For the plus and minus that is the canvas midline — symmetry forces it (docs/01:174-178). For `chart-bar` (bars at 4 and 12) and `menu-3` (5 and 11), and for the `sort` family just under the band, it is **not** forced: a symmetric pair can sit on x.375 / x.625. **`plug-3` is a different case:** five of its six straight runs sit on x.125 / x.875 (edges half and a quarter pixel off), and only its stem is on the midline.
- **It is a cost already accepted and now sized.** 11.0% of all straight outline length at 16 sits on the canvas midline (10.6% at 24, 11.4% at 20), and none of it has a solid pixel at any master. Another **9.2% of straight length is soft off the midline** by placement (§3.3) — that part nothing forces.
- **Is 16 the worst master? Not by the instrument, narrowly yes by a solid pixel.** At 24 and 20 (stroke 1.5) the instrument returns exactly 0.500 for every straight run — all 314 and 312 scorable outlines — so it cannot rank them. By the share of straight length with no fully inked pixel, the order is 24: 15.6% · 20: 16.9% · 16: **20.2%**; mean darkest pixel (pooled over all straight length) 0.961 · 0.958 · **0.936**. The 16 is last by 4.5 points of length — less than the gap *inside* the 16 master, between its crispest and softest drawings (§4).
- **On a 2× screen the order flips for the best case.** The 24 and 20 strokes are exactly 3 device pixels: 79.5% and 74.2% of their straight length lands perfectly crisp, almost all the rest worst-case. The 16 stroke is 2.5 device pixels: **none** of its straight length can be crisp, every run has a half-device-pixel edge. That is C7's accepted cost (docs/01:273-280), measured.
- **The filled style is crisper at 16** (scorable median 0.211 against 0.285; 76% in band A against 55%) because its outer edges are shape edges on whole pixels, and **the filled twin of each of the eight outlines at 0.750, and of the arrows, is perfectly crisp** (score 0.000: a 2.0 line on a whole number; `plug-3`'s twin scores 0.608). The one place filled is worse: **19 line-heavy filled concepts at 16 (18 at 20) have 2.0 lines on half-numbers** — the worst possible score, 1.0 — an item `docs/08:409` already records and nothing has actioned (§3.6).
- **Outer edges mostly land.** 370 of 485 outlines (76%) have all four outer ink edges on pixel lines: 276 of 288 silhouette-keyline icons (96%), 48 of 56 declared-box icons, but only 42 of 136 marks.
- **Rules.** Nothing enforces crispness; lint checks the *grid* (eighths at 16), not what the edges do. Findings are kind (3) except one kind (2): a wording gap between docs/07 C7 and docs/01 (§6, G-8).

---

## 1. What a score is, and what it rests on

| Quantity | Definition | Instrument |
|---|---|---|
| **Landing score** | ink-length-weighted mean of (distance of each axis-aligned ink edge from the nearest whole pixel line, in device pixels) × 2. 0 = all on pixel lines, 1 = all on pixel centres. An *edge* is a straight axis-aligned run offset by ± half the stroke, or a curve's horizontal / vertical extreme weighted by the stretch within a quarter pixel of it. | `pixelgrid.blurScore(file, px).blur` |
| **Straight-runs-only score** | the same over straight runs alone. | `blurScore().straightOnly` |
| **Judgeable (J)** | at least one straight axis-aligned run, and `diagonalShare` < 0.5. Reproduces wave 0's 312. | `blurScore().runCount`, `.diagonalShare` |
| D · A · N | **D** diagonal-heavy (`diagonalShare` ≥ 0.5); **A** no straight run, scored on curve extremes alone; **N** no axis-aligned edge at all (score undefined). | same |
| **Solid-pixel share** | share of straight stroke-run length whose cross-section contains a **fully inked pixel**. Per run: pixels covered by `[centreline − w/2, centreline + w/2]`, in device pixels; solid if any pixel is 100%. *Mine, from path data; matches the rasteriser on 48 test lines, largest difference 0.0000.* | not in the instrument |
| **Darkest pixel across a line** | the highest single-pixel coverage across a straight run (1.0 = a solid pixel; 0.625 = the midline case at 16). Per drawing: the length-weighted mean over its runs (the bands table averages those per-drawing values); §4.2 pools all straight run length at a master instead. *Mine.* | not in the instrument |
| **Half-tone share** | share of the drawing's ink that sits in part-covered pixels. Appendices only, not used to rank (see §5). | `blurScore().halfToneShare` (bypass, §1.1) |
| **Centreline position** | the fractional part of each straight run's centreline coordinate, length-weighted. *Mine.* | not in the instrument |

Strokes are 1.5 at 24 and 20, 1.25 at 16 (`tools/masters.mjs:10`). Filled drawings carry line-heavy strokes at 2.5 · 2 · 2 and shape icons' strokes at the outline weight; shape edges (area paths) are scored as single edges.

### 1.1 The `raster.mjs` bug, and why it does not touch the scores

A sibling agent reported that `raster.mjs:257` (as read on 2026-10-04) drops an area path's horizontal edges and `classify` (`raster.mjs:325-358`) then uses the same list to decide whether a box is uniform, so a box straddling a filled shape's horizontal boundary reads 0 or 1 where the truth is between. **I reproduced it independently** with a filled rectangle whose top and bottom edges sit at y = 2.375 and 13.625 (closed form: area 135, rows 2 and 13 at 0.625): `rasterise` gives rows at 1.000 and `inkArea` gives 144.0. Details, the scope across all 2,910 files, and Chromium's arbitration are in `findings-mass.md` §1.1; in short, 270 of 1,026 shape-filled files change ink by more than 0.05 px² (up to 10 px²), and no outline or line-heavy filled file changes at all.

**What it means for this card.**

- **The landing scores, `straightOnly`, edge counts and `diagonalShare` do not use the rasteriser.** They are computed from the path data alone (`edgeLanding`); `blurScore` calls `rasterise` only for `halfToneShare`. I recomputed the landing score for all 2,910 files from `edgeLanding` with no `rasterise` call: the largest difference from `blurScore().blur` is 0.00005, the rounding of the stored values. That proves independence from the rasteriser, not correctness of the definition; for that, a reviewer who had not seen these scripts re-implemented the documented definition from scratch and agrees on every headline number (312, 0.189, 0.285, 0.750, the bands) and on all but 25 of 2,886 scorable scores, by at most 0.065 (the arc-extreme noise below). Every crispness figure stated by wave 0 therefore stands, and each reproduces.
- **`halfToneShare` is the one quantity here that does go through it.** It is reported in the appendices, measured with the brute-force bypass (`findings-mass.md` appendix C); 296 files changed, largest change 0.286, all shape-filled.
- The pixel profiles in §2 are stroked lines (unaffected) and were also checked against Chromium.

**Two smaller instrument defects.**

- `diagonalShare` (`pixelgrid.mjs`, `flattenRuns`) restarts a fragment after every arc, so a closing `Z` joins the last fragment back to *that fragment's* start — the last arc's end — not to the start of the subpath. When the last command before `Z` is an arc the closing segment is dropped (21 of the 32 outlines at 16 whose reported share differs from a count of every straight segment); otherwise a spurious chord is counted in its place (the other 11). A model of that behaviour reproduces the reported share on all 485 outlines at 16. Four outline drawings change side of the 0.5 line: `alert-triangle` and `alert-triangle-3` (segment dropped) would be diagonal-heavy; `compose-2` and `compose-3` (spurious chord) would be scorable. The scorable count (312), floor, median and max are identical either way. The appendices report `diagonalShare` as the instrument gives it.
- `arcExtremes` (`pixelgrid.mjs`, `within`) keeps or drops an arc's own start or end extreme on floating-point noise: the same quarter arc translated by 0.001 or 0.003 gains or loses that edge. Against an independent re-implementation of the documented definition, 25 of 2,886 scores differ by 0.0001–0.065 (largest `20/paintbrush-4-filled`); at 16 outline the three that differ are `home-2`, `home-3` and `info-2`, by at most 0.0033. No headline number or band moves. So "pure path geometry" is exact in the definition and soft at the fourth decimal in a few arcs.

---

## 2. The key: what a line looks like at 16

One horizontal line, the rasteriser's pixel coverage across it (exact geometry, rate 32) beside what **Chromium** paints for the same SVG (a 16 px canvas, `drawImage`, read back — measured in the Browser pane). Centre column of the line.

| Master, stroke | Centreline | Where it sits | Pixel coverages across the line — exact geometry (rate 32) | Chromium (Skia), measured | Instrument score |
|---|---|---|---|---|---:|
| 16 px, stroke 1.25 | y = 8 | on a whole number (so is the canvas midline: 12 · 10 · 8) | 62.5% · 62.5% | 50.2% · 75.3% | 0.750 |
| 16 px, stroke 1.25 | y = 8.125 | between | 50% · 75% | 50.2% · 75.3% | 0.750 |
| 16 px, stroke 1.25 | y = 8.25 | between | 37.5% · 87.5% | 25.1% · 100% | 0.500 |
| 16 px, stroke 1.25 | y = 8.375 | the C7 construction | 25% · 100% | 25.1% · 100% | 0.250 |
| 16 px, stroke 1.25 | y = 8.5 | on a pixel centre | 12.5% · 100% · 12.5% | 100% · 25.1% | 0.250 |
| 16 px, stroke 1.25 | y = 8.625 | the C7 construction | 100% · 25% | 100% · 25.1% | 0.250 |
| 16 px, stroke 1.25 | y = 8.75 | between | 87.5% · 37.5% | 75.3% · 50.2% | 0.500 |
| 16 px, stroke 1.25 | y = 8.875 | between | 75% · 50% | 75.3% · 50.2% | 0.750 |
| 24 px, stroke 1.5 | y = 12 | on a whole number (so is the canvas midline: 12 · 10 · 8) | 75% · 75% | 75.3% · 75.3% | 0.500 |
| 24 px, stroke 1.5 | y = 12.25 | the quarter grid | 50% · 100% | 50.2% · 100% | 0.500 |
| 24 px, stroke 1.5 | y = 12.5 | on a pixel centre | 25% · 100% · 25% | 25.1% · 100% · 25.1% | 0.500 |
| 24 px, stroke 1.5 | y = 12.75 | the quarter grid | 100% · 50% | 100% · 50.2% | 0.500 |
| 20 px, stroke 1.5 | y = 10 | on a whole number (so is the canvas midline: 12 · 10 · 8) | 75% · 75% | 75.3% · 75.3% | 0.500 |
| 20 px, stroke 1.5 | y = 10.25 | the quarter grid | 50% · 100% | 50.2% · 100% | 0.500 |
| 20 px, stroke 1.5 | y = 10.5 | on a pixel centre | 25% · 100% · 25% | 25.1% · 100% · 25.1% | 0.500 |
| 20 px, stroke 1.5 | y = 10.75 | the quarter grid | 100% · 50% | 100% · 50.2% | 0.500 |

How to read it.

- **The C7 construction (x.375 / x.625)** gives one fully inked pixel and a quarter-grey shadow on one side: a hard, dark 1 px line. That is what band A is made of.
- **On a whole number — including the canvas midline —** a 1.25 line is two pixels of 62.5%. **No pixel is fully inked.** The line is paler than its neighbours and about 2 px wide. Chromium paints a *horizontal* midline line as 50% + 75% because its anti-aliasing is quantised to quarters vertically; a *vertical* one it paints as the exact 62.4% pair (measured: `x = 8` → 62.4% · 62.4%; `x = 8.375` → 25.1% · 100%). So a `plus` shows one of each. Either way the darkest pixel is 75% or less.
- **At 1.5 (24, 20) the score is 0.500 wherever the line sits.** The two edges are 1.5 apart, so their distances from a pixel line always add to 0.5. The profiles differ a great deal — 75% · 75% against 25% · 100% · 25% — and the score cannot see it (§4).
- A 45° stroke is a different animal. At 1.25 its darkest pixel per row is:

| Perpendicular offset of the line (units) | Darkest pixel in each row (interior rows) | Pixels touched per row |
|---:|---:|---:|
| 0.000 | 0.99 | 3 |
| 0.125 | 0.97 | 3 |
| 0.250 | 0.94 | 3 |
| 0.375 | 0.88 | 4 |
| 0.500 | 0.81 | 4 |
| 0.625 | 0.88 | 4 |
| 0.750 | 0.94 | 3 |
| 0.875 | 0.97 | 3 |

  and the shipped diagonals measure `chevron-down` 0.95–0.96, `check` 0.92–0.99, `x` 0.99–0.99 (darkest pixel per row; fully inked pixels: none). Diagonals are dark, stair-stepped lines that touch three or four pixels per row — not the soft ones.

---

## 3. The landing census at 16

### 3.1 Who can be scored

| Style | Master | J — judgeable | D — diagonal-heavy (≥ 50% of straight length is not axis-aligned) | A — arcs only, scored on curve extremes alone | N — no axis-aligned edge at all |
|---|---:|---:|---:|---:|---:|
| outline | 24 | 314 | 151 | 16 | 4 |
| outline | 20 | 312 | 153 | 16 | 4 |
| outline | 16 | 312 | 153 | 16 | 4 |
| filled | 24 | 318 | 152 | 11 | 4 |
| filled | 20 | 318 | 152 | 11 | 4 |
| filled | 16 | 313 | 157 | 11 | 4 |

**J** is the set the scores below describe. At 16 outline that is 312 of 485. Without the filter the picture is wrong: the top of an unfiltered outline ranking (scores 0.76–0.93) is `chevron-down-2-small`, `chevron-left-2-small`, `chevron-right-2-small`, `chevron-down-3-large`, `chevron-up-2-small`, `chevrons-up-down-4`, the three `chevron-*-3-large`, `check-2`, `check-small`, `puzzle-5`, `play-2`, `play-3` — fourteen drawings with no real straight edge to judge: chevrons and checks scored on a single curve extreme, `puzzle-5` on its curves, `play-2` and `play-3` on rounded corners. The first scorable drawing is fifteenth.

### 3.2 The census and the four bands

All masters, at each master's own size:

| Style | Master (own size) | Drawings | No axis-aligned edge at all | Judgeable (straight run, diagonal < 50%) | score min | p25 | median | p75 | max | straight-runs-only score: min / median / max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| outline | 24 | 485 | 4 | 314 | 0.433 | 0.480 | **0.488** | 0.495 | 0.569 | 0.500 / 0.500 / 0.500 |
| outline | 20 | 485 | 4 | 312 | 0.387 | 0.470 | **0.482** | 0.492 | 0.542 | 0.500 / 0.500 / 0.500 |
| outline | 16 | 485 | 4 | 312 | 0.189 | 0.242 | **0.285** | 0.400 | 0.750 | 0.250 / 0.282 / 0.750 |
| filled | 24 | 485 | 4 | 318 | 0.000 | 0.219 | **0.307** | 0.463 | 0.663 | 0.000 / 0.327 / 1.000 |
| filled | 20 | 485 | 4 | 318 | 0.000 | 0.134 | **0.264** | 0.366 | 0.960 | 0.000 / 0.250 / 1.000 |
| filled | 16 | 485 | 4 | 313 | 0.000 | 0.098 | **0.211** | 0.294 | 0.750 | 0.000 / 0.218 / 0.774 |

Bands for the scorable set at 16, with what is in them (the means are taken over the band's drawings, each drawing counting once):

| Style | Band | Score | Drawings | Share of judgeable | Solid-pixel share (mean over the band’s drawings of each drawing’s own share) | Darkest pixel across a line (mean over the band’s drawings) | Share of stroked line that is curve (mean; drawings with no stroked path left out) | Spread through the band |
|---|---|---|---:|---:|---:|---:|---:|---|
| outline | A | 0.00–0.30 | 172 | 55% | 97% | 0.99 | 0.35 | `cart-4`, `toggle-on`, `layout-sidebar-right-2`, `cash`, `maximize-2` |
| outline | B | 0.30–0.50 | 100 | 32% | 59% | 0.86 | 0.45 | `grid-6`, `refresh`, `user`, `text-4`, `rotate-ccw-11` |
| outline | C | 0.50–0.70 | 31 | 10% | 14% | 0.73 | 0.22 | `list-bullet-3`, `sliders-4`, `sort-descending`, `arrow-left`, `arrow-up-3` |
| outline | D | 0.70–0.75+ | 9 | 3% | 0% | 0.64 | 0.03 | `plug-3`, `menu-3`, `minus-large`, `plus`, `plus-small` |
| filled | A | 0.00–0.30 | 238 | 76% | 89% | 0.96 | 0.23 | `at-sign-filled`, `save-filled`, `lock-filled`, `layout-sidebar-right-4-filled`, `building-4-filled` |
| filled | B | 0.30–0.50 | 51 | 16% | 69% | 0.89 | 0.25 | `plug-4-filled`, `database-3-filled`, `sort-numeric-descending-2-filled`, `sliders-4-filled`, `list-bullet-2-filled` |
| filled | C | 0.50–0.70 | 23 | 7% | 62% | 0.89 | 0.19 | `list-bullet-3-filled`, `refresh-2-filled`, `text-2-filled`, `menu-arrow-left-filled`, `rotate-ccw-10-filled` |
| filled | D | 0.70–0.75+ | 1 | 0% | 100% | 1.00 | 0.00 | `hash-filled` |

Bands are taken on the score rounded to four decimals, so a drawing at exactly 0.5 goes to the upper band: `list-bullet-3` is 0.49999999999999978 in floating point and 0.5 exactly, and is counted in C (strictly `<` would give B 101 and C 30).

**What a viewer sees at 16 px, band by band** (from the pixel profiles in §2 and from rendered rows at 8×; the wall is where Maruti's eye checks it):

- **A — under 0.30 (172 outlines, 55%).** *Every straight line is a hard, dark pixel with at most a faint shadow.* A drawing here averages a solid pixel on 97% of its straight stroke length, darkest pixel 0.99. `archive`, `folder`, `file`, `mail`, `lock` — the containers.
- **B — 0.30–0.50 (100, 32%).** *A hard outline with a few paler interior lines.* Solid share 59% on average, darkest pixel 0.86. In `alert-circle` the ring is hard and the `!` stem, which sits on the midline, is a grey column; `book-open`'s spine and `bug`'s body line are the same.
- **C — 0.50–0.70 (31, 10%).** *Most straight lines have no solid pixel: two pixels at 50–88%.* Solid share 14% on average, darkest pixel 0.73. The arrows are the clear case — a pale 2 px shaft joined to a black head.
- **D — 0.70 and over (9, 3%).** *Every straight line is a pale double-width bar.* Solid share 0%, darkest pixel 0.64. In a row, a `plus` or `minus` is visibly lighter than the `x` or `check` beside it, whose strokes measure 0.99 and 0.92–0.99 at their darkest.

Filled, scorable set (313): 238 in A (76%), 51 in B, 23 in C, 1 in D (`hash-filled`, 0.750 — a shape edge three-eighths off a pixel line, but with a solid core). The filled style is crisper because its outer edges are shape edges on whole pixels, not strokes.

### 3.3 The 0.70–0.75 band, by name, and everything near it

Every outline at 16 scoring 0.65 or more, with its filled twin. **J** = scorable; **D** = diagonal-heavy (its score is real but rests on a curve extreme, not on a straight line); the straight-runs-only score is the honest one for J.

| Drawing | Score | J / D / A / N | Straight-runs-only score | Diagonal share | Straight-run edges (two per stroked segment) | Worst edge | Score of its filled twin |
|---|---:|---|---:|---:|---:|---|---:|
| `chevron-down-2-small` | 0.930 | D | — | 100% | 0 | curve y=10.535 (off 0.465) | 0.927 |
| `chevron-left-2-small` | 0.910 | D | — | 100% | 0 | curve x=5.455 (off 0.455) | 0.907 |
| `chevron-right-2-small` | 0.910 | D | — | 100% | 0 | curve x=10.545 (off 0.455) | 0.907 |
| `chevron-down-3-large` | 0.885 | D | — | 100% | 0 | curve y=12.5576 (off 0.442) | 0.886 |
| `chevron-up-2-small` | 0.870 | D | — | 100% | 0 | curve y=5.565 (off 0.435) | 0.873 |
| `chevrons-up-down-4` | 0.850 | D | — | 100% | 0 | curve y=13.575 (off 0.425) | 0.847 |
| `chevron-left-3-large` | 0.805 | D | — | 100% | 0 | curve x=3.4024 (off 0.402) | 0.806 |
| `chevron-right-3-large` | 0.805 | D | — | 100% | 0 | curve x=12.5976 (off 0.402) | 0.806 |
| `chevron-up-3-large` | 0.805 | D | — | 100% | 0 | curve y=3.4024 (off 0.402) | 0.806 |
| `check-2` | 0.802 | D | — | 100% | 0 | curve y=12.5992 (off 0.401) | 0.798 |
| `check-small` | 0.802 | D | — | 100% | 0 | curve y=11.5992 (off 0.401) | 0.798 |
| `puzzle-5` | 0.776 | D | — | 100% | 0 | curve y=5.507 (off 0.493) | 0.730 |
| `play-2` | 0.765 | D | 0.740 | 100% | 2 | curve y=2.505 (off 0.495) | 1.000 |
| `play-3` | 0.758 | D | 0.720 | 100% | 2 | curve y=3.5049 (off 0.495) | 0.984 |
| `chart-bar` | 0.750 | J | 0.750 | 0% | 6 | run x=7.375 (off 0.375) | 0.000 |
| `menu-3` | 0.750 | J | 0.750 | 0% | 4 | run y=4.375 (off 0.375) | 0.000 |
| `minus` | 0.750 | J | 0.750 | 0% | 2 | run y=7.375 (off 0.375) | 0.000 |
| `minus-large` | 0.750 | J | 0.750 | 0% | 2 | run y=7.375 (off 0.375) | 0.000 |
| `minus-small` | 0.750 | J | 0.750 | 0% | 2 | run y=7.375 (off 0.375) | 0.000 |
| `plus` | 0.750 | J | 0.750 | 0% | 4 | run x=7.375 (off 0.375) | 0.000 |
| `plus-large` | 0.750 | J | 0.750 | 0% | 4 | run x=7.375 (off 0.375) | 0.000 |
| `plus-small` | 0.750 | J | 0.750 | 0% | 4 | run x=7.375 (off 0.375) | 0.000 |
| `plug-3` | 0.704 | J | 0.750 | 0% | 12 | run y=4.5 (off 0.500) | 0.608 |
| `arrow-down-3` | 0.699 | J | 0.750 | 45% | 2 | run x=7.375 (off 0.375) | 0.000 |
| `arrow-left-3` | 0.699 | J | 0.750 | 45% | 2 | run y=7.375 (off 0.375) | 0.000 |
| `arrow-right-3` | 0.699 | J | 0.750 | 45% | 2 | run y=7.375 (off 0.375) | 0.000 |
| `arrow-up-3` | 0.699 | J | 0.750 | 45% | 2 | run x=7.375 (off 0.375) | 0.000 |
| `arrow-down` | 0.698 | J | 0.750 | 44% | 2 | run x=7.375 (off 0.375) | 0.001 |
| `arrow-left` | 0.698 | J | 0.750 | 44% | 2 | run y=7.375 (off 0.375) | 0.001 |
| `arrow-right` | 0.698 | J | 0.750 | 44% | 2 | run y=7.375 (off 0.375) | 0.001 |
| `arrow-up` | 0.698 | J | 0.750 | 44% | 2 | run x=7.375 (off 0.375) | 0.001 |
| `sort` | 0.698 | J | 0.750 | 44% | 4 | run x=4.375 (off 0.375) | 0.001 |
| `arrow-down-2` | 0.698 | D | 0.750 | 54% | 2 | run x=7.375 (off 0.375) | 0.001 |
| `arrow-left-2` | 0.698 | D | 0.750 | 54% | 2 | run y=7.375 (off 0.375) | 0.001 |
| `arrow-right-2` | 0.698 | D | 0.750 | 54% | 2 | run y=7.375 (off 0.375) | 0.001 |
| `arrow-up-2` | 0.698 | D | 0.750 | 54% | 2 | run x=7.375 (off 0.375) | 0.001 |
| `sort-2` | 0.683 | D | 0.750 | 50% | 4 | run x=4.375 (off 0.375) | 0.001 |
| `chevron-down-small` | 0.662 | D | — | 100% | 0 | curve y=10.6692 (off 0.331) | 0.658 |
| `chevron-left-small` | 0.662 | D | — | 100% | 0 | curve x=5.3308 (off 0.331) | 0.658 |
| `chevron-right-small` | 0.662 | D | — | 100% | 0 | curve x=10.6692 (off 0.331) | 0.658 |
| `chevron-up-small` | 0.662 | D | — | 100% | 0 | curve y=5.3308 (off 0.331) | 0.658 |
| `rotate-ccw` | 0.657 | J | 0.750 | 28% | 4 | run x=3.5 (off 0.500) | 0.446 |
| `rotate-ccw-2` | 0.657 | J | 0.750 | 28% | 4 | run x=3.5 (off 0.500) | 0.446 |
| `rotate-ccw-3` | 0.657 | J | 0.750 | 28% | 4 | run x=3.5 (off 0.500) | 0.384 |
| `sort-ascending` | 0.650 | J | 0.678 | 31% | 8 | run x=9.375 (off 0.375) | 0.118 |

- **Exactly 0.750 (8):** `plus`, `plus-small`, `plus-large`, `minus`, `minus-small`, `minus-large`, `chart-bar`, `menu-3`. Every straight run in each sits on a whole number. **`plug-3` (0.704) is not the same:** its straight runs are at 5.125, 4.875, 11.125, 6.125 and 9.875 (x.125 / x.875) plus a stem at 8; its straight-runs-only 0.750 comes from the x.125 pattern, whose edges are 0.5 and 0.25 off.
- **0.698–0.699 (the arrows and `sort`).** `arrow-up`, `-down`, `-left`, `-right` and their `-3` forms, `sort` (J); `arrow-*-2` and `sort-2` (D). Their *shaft* is on the midline (straight-runs-only 0.750); the arrowhead's rounded corner pulls the whole-drawing score a hair under 0.70. Same cause, one hair outside the band.
- **`play-2`, `play-3`** score 0.765 and 0.758 — above the ceiling a straight line can reach — because they are diagonal-heavy and the score is a curve extreme.
- **Their filled twins** score **0.000–0.001** (`plus`, `minus`, `chart-bar`, `menu-3`, the arrows, `sort`); `plug-3`'s twin scores 0.608. A 2.0 line centred on a whole number is two solid pixels. Toggling outline → filled takes the `plus`'s darkest pixel from 62.5% to 100%.

**What the soft straight lines at 16 have in common.** The 20.2% of straight outline length with no fully inked pixel breaks down by where the centreline sits:

| Where the centreline of a soft straight run sits (16 outline) | Segments | Length (units) | Share of all straight length | Share of the soft length | Concepts |
|---|---:|---:|---:|---:|---:|
| on the canvas midline (y or x = 8) | 143 | 844 | 11.0% | 55% | 124 |
| on another whole number | 25 | 175 | 2.3% | 11% | 16 |
| on x.125 or x.875 | 129 | 361 | 4.7% | 23% | 51 |
| on x.25 or x.75 | 27 | 120 | 1.6% | 8% | 16 |
| off the eighth grid | 9 | 47 | 0.6% | 3% | 9 |
| **all soft runs** | 333 | 1547 | **20.2%** | 100% | — |

**11.0 points are the midline** — forced by symmetry, accepted in the docs (docs/01:174-178). **9.2 points are soft off the midline**, by placement: `x.125` / `x.875` (4.7 points: 51 concepts, among them `plug-*`, `rotate-ccw-*`, `sort-alpha-*`, `cart-*`, `clipboard-*`, `home`, `grid`), another whole number (2.3: `chart-bar`'s bars at 4 and 12, `menu-3` at 5 and 11, `sort` at 5 and 11 and the other `sort-*` drawings, `file-text`, `rotate-ccw-6`), `x.25` / `x.75` (1.6), and 0.6 off the eighth grid. The eighth grid allows all of it (lint checks 3 dp, multiples of 0.125); nothing says an interior line must sit on x.375 / x.625.

### 3.4 Where the centrelines sit

Fractional part of each straight run's centreline, as a share of straight outline length:

| Master | Straight run length (units) | canvas midline | whole number | x.125 | x.25 | x.375 | x.5 | x.625 | x.75 | x.875 | off the eighth grid |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 24 | 11721 | 10.6% | 4.8% | · | 39.6% | · | 4.5% | · | 39.8% | · | 0.7% |
| 20 | 8639 | 11.4% | 5.5% | · | 38.2% | · | 8.1% | · | 36.0% | · | 0.7% |
| 16 | 7676 | 11.0% | 2.3% | 2.2% | 0.8% | 38.3% | 3.8% | 37.7% | 0.8% | 2.5% | 0.7% |

At 16, **76.0%** of straight length sits on x.375 or x.625, the C7 construction. The same arithmetic one master up: at 24 and 20, 79.4% and 74.2% sit on x.25 / x.75, where one edge lands on a pixel line.

### 3.5 Outer edges

A different question from the lines inside a drawing: does the silhouette's own edge sit on a pixel line? C7: *"Outer edges stay on their pixel."* All four outer ink edges (left, right, top, bottom of the ink box), by kind, drawings with every one on a pixel line:

| Style | Master | silhouette-keyline icons | declared-box icons | anchored (level family) | marks | all |
|---|---:|---:|---:|---:|---:|---:|
| outline | 24 | 276 / 287 | 36 / 57 | 5 / 5 | 20 / 136 | **337 / 485** |
| outline | 20 | 277 / 288 | 35 / 56 | 5 / 5 | 20 / 136 | **337 / 485** |
| outline | 16 | 276 / 288 | 48 / 56 | 4 / 5 | 42 / 136 | **370 / 485** |
| filled | 24 | 276 / 287 | 36 / 57 | 5 / 5 | 25 / 136 | **342 / 485** |
| filled | 20 | 277 / 288 | 35 / 56 | 5 / 5 | 24 / 136 | **341 / 485** |
| filled | 16 | 276 / 288 | 48 / 56 | 4 / 5 | 49 / 136 | **377 / 485** |

At 16, **96% of silhouette-keyline icons** (276 of 288) and 86% of declared-box icons have all four outer edges on pixel lines; marks do not — only 42 of 136 (31%), because a mark centred in the canvas has its edges on a pixel line only when its width is an even integer (`chevron-down` is 10.5 wide). Six non-mark outlines have an outer edge on a half pixel at 16: `keyboard-2` (x 1.00–15.00, y 1.50–14.50); `map-pin` (x 3.00–13.00, y 1.00–14.50); `map-pin-2` (x 3.00–13.00, y 1.00–14.50); `sort-3` (x 1.00–15.00, y 3.50–12.50); `volume-low` (x 1.00–11.50, y 3.00–13.00); `volume-off` (x 1.50–13.50, y 2.00–14.00). Each is a decided shape (an odd box dimension kept centred, or a pointed tip); I did not look for more.

### 3.6 The filled style

The filled twin of a line icon uses a 2.0 stroke at 16 and 20 and 2.5 at 24. Fluent's guidance, recorded at `docs/08-refinement.md:409`, is that the grid depends on the stroke: 1.5 → x.25 / x.75, **2.0 → whole numbers**, which is crisp (two solid pixels). Lint applies x.25 / x.75 to everything (`docs/08:409`: "including our 2.0 filled cuts where whole numbers are correct"). C17's decision of 2026-09-20 kept the menu lines on their 1.5-era centrelines at 16. The Fluent rule is on record as an item "worth inheriting", with the trigger "next time filled weights are touched"; it has not been ruled on. Measured, weight-2 straight runs in the filled files:

| Master | Filled line weight | Run length (units) | On a whole number — score 0, crisp (concepts) | In between (concepts) | On a half-number — score 1.0, worst (concepts) |
|---:|---:|---:|---:|---:|---:|
| 20 | 2 | 1433 | 65.6% (65) | 19.9% (19) | 14.5% (18) |
| 16 | 2 | 1194 | 71.4% (71) | 15.1% (14) | 13.5% (19) |

On a whole number the line is two solid pixels (score 0); on a half-number it is 50% · 100% · 50% — three pixels, every edge on a pixel centre, the worst possible score of 1.0. At 16 that is 13.5% of the 2.0 length in **19 concepts**: `filter-2`, `grid-4`, `list-bullet`, `list-bullet-2`, `menu`, `menu-2`, `menu-arrow-left`, `menu-arrow-right`, `refresh-2`, `rotate-ccw-10`, `rotate-ccw-5`, `rotate-ccw-7`, `rotate-ccw-8`, `sliders-2`, `sliders-4`, `sort-3`, `sort-ascending`, `sort-descending`, `text-2`. At 20, 14.5% in 18 concepts. At 24 the filled line is 2.5 and scores exactly 0.500 on every run, by the same half-integer arithmetic as the 1.5 outline.

Top scores in the filled style at 16 (every drawing ≥ 0.65, with its outline twin):

| Drawing | Score | J / D / A / N | Straight-runs-only score | Diagonal share | Straight-run edges (two per stroked segment) | Worst edge | Score of its outline twin |
|---|---:|---|---:|---:|---:|---|---:|
| `play-2` | 1.000 | D | 1.000 | 100% | 1 | run x=3.5 (off 0.500) | 0.765 |
| `play-3` | 0.984 | D | 0.980 | 100% | 1 | curve y=3.5 (off 0.500) | 0.758 |
| `chevron-down-2-small` | 0.927 | D | — | 100% | 0 | curve y=10.5367 (off 0.463) | 0.930 |
| `chevron-left-2-small` | 0.907 | D | — | 100% | 0 | curve x=5.4533 (off 0.453) | 0.910 |
| `chevron-right-2-small` | 0.907 | D | — | 100% | 0 | curve x=10.5467 (off 0.453) | 0.910 |
| `chevron-down-3-large` | 0.886 | D | — | 100% | 0 | curve y=12.5569 (off 0.443) | 0.885 |
| `chevron-up-2-small` | 0.873 | D | — | 100% | 0 | curve y=5.5633 (off 0.437) | 0.870 |
| `play` | 0.863 | D | 0.820 | 100% | 1 | curve y=2.5 (off 0.500) | 0.612 |
| `chevrons-up-down-4` | 0.847 | D | — | 100% | 0 | curve y=2.4233 (off 0.423) | 0.850 |
| `chevron-left-3-large` | 0.806 | D | — | 100% | 0 | curve x=3.4031 (off 0.403) | 0.805 |
| `chevron-right-3-large` | 0.806 | D | — | 100% | 0 | curve x=12.5969 (off 0.403) | 0.805 |
| `chevron-up-3-large` | 0.806 | D | — | 100% | 0 | curve y=3.4031 (off 0.403) | 0.805 |
| `check-2` | 0.798 | D | — | 100% | 0 | curve y=12.6008 (off 0.399) | 0.802 |
| `check-small` | 0.798 | D | — | 100% | 0 | curve y=11.6008 (off 0.399) | 0.802 |
| `gear-2` | 0.795 | D | — | 100% | 0 | curve y=10.5 (off 0.500) | 0.625 |
| `hash-2` | 0.750 | D | 0.750 | 50% | 4 | run y=4.625 (off 0.375) | 0.250 |
| `hash-3` | 0.750 | D | 0.750 | 52% | 4 | run y=4.625 (off 0.375) | 0.250 |
| `hash` | 0.750 | J | 0.750 | 0% | 8 | run x=4.625 (off 0.375) | 0.250 |
| `puzzle-5` | 0.730 | D | — | 100% | 0 | curve y=10.493 (off 0.493) | 0.776 |
| `rotate-ccw-7` | 0.703 | D | 1.000 | 69% | 2 | run y=4.5 (off 0.500) | 0.327 |
| `rotate-ccw-10` | 0.695 | J | 0.774 | 31% | 6 | run y=10.5 (off 0.500) | 0.441 |
| `filter-2` | 0.667 | J | 0.667 | 0% | 6 | run y=2.5 (off 0.500) | 0.417 |
| `menu` | 0.667 | J | 0.667 | 0% | 6 | run y=2.5 (off 0.500) | 0.417 |
| `chevron-down-small` | 0.658 | D | — | 100% | 0 | curve y=10.6708 (off 0.329) | 0.662 |
| `chevron-left-small` | 0.658 | D | — | 100% | 0 | curve x=5.3292 (off 0.329) | 0.662 |
| `chevron-right-small` | 0.658 | D | — | 100% | 0 | curve x=10.6708 (off 0.329) | 0.662 |
| `chevron-up-small` | 0.658 | D | — | 100% | 0 | curve y=5.3292 (off 0.329) | 0.662 |

The chevrons and `play` are diagonal-heavy and rest on a curve extreme. The scorable ones above 0.65 are `hash` (0.750), `rotate-ccw-10`, `filter-2`, `menu`.

---

## 4. Is the 16 master the worst?

### 4.1 The instrument cannot tell at 24 and 20

At stroke 1.5 on one device pixel per unit, the two ink edges of any straight run sit 1.5 apart, so their distances from a pixel line always add to exactly 0.5 whatever the position. The census shows it: in the table of §3.2, *straight-runs-only score: min / median / max* is **0.500 / 0.500 / 0.500 for all 314 scorable outlines at 24 and all 312 at 20**. The whole-drawing score varies only a little (24: 0.433–0.569; 20: 0.387–0.542) because curves are weighted differently. At 16 the same column runs 0.250 to 0.750. **The landing score is a statement about the 16 master only.** The profiles it hides are in §2: at 1.5 a line on a whole number is 75% · 75%, on a quarter 50% · 100%, on a half 25% · 100% · 25%.

### 4.2 By a fully inked pixel: narrowly, yes

| Style | Master | Drawings with a straight stroke run | Run length (units) | With a fully inked pixel | Without one | Drawings containing such a run | Mean darkest pixel across a line (pooled over all straight length) | Run length on the canvas midline | of which without a fully inked pixel |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| outline | 24 | 364 | 11721 | 84.4% | 15.6% | 150 | 0.961 | 10.6% (128 drawings) | 100% |
| outline | 20 | 364 | 8639 | 83.1% | 16.9% | 173 | 0.958 | 11.4% (126 drawings) | 100% |
| outline | 16 | 363 | 7676 | 79.8% | 20.2% | 189 | 0.936 | 11.0% (124 drawings) | 100% |
| filled | 24 | 193 | 3286 | 85.1% | 14.9% | 55 | 0.964 | 24.5% (89 drawings) | 31% |
| filled | 20 | 193 | 2632 | 88.3% | 11.7% | 61 | 0.971 | 26.3% (91 drawings) | 30% |
| filled | 16 | 193 | 2261 | 84.9% | 15.1% | 58 | 0.952 | 25.9% (90 drawings) | 29% |

Outline, straight stroke runs at each master's own size:

- **No fully inked pixel:** 24 — 15.6% of length, 150 drawings contain such a run; 20 — 16.9%, 173; **16 — 20.2%, 189 (of 363)**.
- **Mean darkest pixel across a line:** 0.961 · 0.958 · **0.936**.
- **On the midline, soft in every case:** 10.6% · 11.4% · 11.0% of length, 128 · 126 · 124 drawings. The midline cost is the same at every master (75% · 75% at 24 and 20, 62.5% · 62.5% at 16).
- The 16 is last by **4.5 points of straight length** against the 24 (20.15% against 15.64%), and 0.026 of darkest pixel. The midline costs the same at every master; the extra at 16 sits in `x.125` / `x.875` (4.7 points) and `x.25` / `x.75` (1.6) placements, which have a solid pixel at 1.5 and not at 1.25.

For scale: inside the 16 master the mean solid-pixel share runs from 97% (band A) to 0% (band D); the 4.5-point gap to the 24 is small against that. Whether 20.2% against 15.6% is visible is an eye question; the wall (card 4.1) should show the 16 beside the 24 at the same size.

### 4.3 On a 2× screen

The same runs at two device pixels per unit. Per-run score = distance of each of its two edges from a device-pixel line, added.

| Master | Shown at | Stroke in device px | Mean per-run score | Perfect (0) | (0, 0.25] | (0.25, 0.5] | (0.5, 0.75] | > 0.75 |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 24 | 1× (24 px) | 1.5 | 0.500 | · | · | 100.0% | · | · |
| 24 | 2× (48 px) | 3 | 0.201 | 79.5% | 0.4% | 0.2% | 0.1% | 19.9% |
| 20 | 1× (20 px) | 1.5 | 0.500 | · | · | 100.0% | · | · |
| 20 | 2× (40 px) | 3 | 0.254 | 74.2% | 0.3% | 0.2% | 0.1% | 25.2% |
| 16 | 1× (16 px) | 1.25 | 0.345 | · | 79.8% | 1.9% | 18.3% | · |
| 16 | 2× (32 px) | 2.5 | 0.500 | · | · | 100.0% | · | · |

At 2× the 24 and 20 strokes are exactly 3 device pixels, so a line is either perfectly crisp (79.5% of the 24's length; 74.2% of the 20's: everything on x.25 / x.75) or sits on half-pixel edges (almost all the rest: 19.9% and 25.2%: the midline, other whole numbers and x.5). The 16 stroke is 2.5 device pixels: **every straight run scores exactly 0.500** and none is perfect. `docs/01:273-280` states this in words ("1.25 is 2.5 device pixels and still cannot land clean on both edges"); this is the size of it. A solid-pixel measure is meaningless at 2×: every stroke is at least 2.5 device pixels, so every line contains a fully inked one.

---

## 5. What the instrument cannot see

- **173 of 485 outlines at 16 (36%)** are not scorable: 153 diagonal-heavy, 16 arcs-only, 4 with no axis-aligned edge. That includes the chevrons, checks, `x`, arrowheads, triangles and `play`. A 45° edge cannot land on a pixel line anywhere along its length — C7's recorded cost: *"diagonals lose most"* (docs/07 C7). What the probe in §2 adds is that diagonals are **not** soft: their darkest pixel per row is 0.81–0.99, and the shipped chevron, check and `x` measure 0.92–0.99. They fail differently — a staircase, three or four pixels wide per row — and there is no instrument for it.
- **Rings and curves** score by their extremes only (top, bottom, left, right: 4 points); the rest of a circle's edge is partial coverage by nature.
- **The scores are for 1× and for one stroke at a time.** Overlapping strokes, caps and joins are not modelled; the pixel profile is a straight line's cross-section.
- **Half-tone share does not rank crispness.** At 16 outline its median is 0.79 (10th percentile 0.42) and the top tenth of drawings sit at 1.00, because curved ink is partial by nature: it measures how round a drawing is as much as how soft. It is in the appendices because it was asked for.

---

## 6. Judged list

**G-1 · kind (3) · systemic · accepted trade, now sized.** *A `plus` or `minus` at 16 is two pale pixels, not one hard one:* darkest pixel 0.625 (Chromium: 0.50 + 0.75 on the horizontal bar) against 0.99 for an `x` beside it. 11.0% of all straight outline length at 16, 143 runs in **124 drawings**, sits on the canvas midline (10.6% at 24, 11.4% at 20; `docs/08:84` counted 109 runs in 26 concepts when there were 95 icons). All of it is soft. The docs already rule it: docs/01:174-178 ("for a mark, symmetry beats crispness"), docs/08:376-380 ("unfixable for `plus`/`minus`/arrows", Fluent's advice "not to retrofit"). **Recommendation: leave it; do not reopen.** The new information is the size, and that the filled twin is perfectly crisp (so the style toggle changes the darkest pixel from 62.5% to 100%).

**G-2 · kind (3) · one-off ×4 families · decide per family.** *The 0.70–0.75 band is not all forced.* The eight at exactly 0.750 are all-whole-number lines; `plug-3` (0.704) is not (its runs sit on x.125 / x.875). Only the `plus` and `minus` families (six drawings) sit wholly on the midline, where symmetry forces it. `chart-bar` (outer bars at 4 and 12), `menu-3` (5 and 11) and the `sort` family (5 and 11) are symmetric *pairs*, and a pair can sit crisp: 5.375 and 10.625 are symmetric about 8. For the `menu` family this was a recorded decision — C17, 2026-09-20: *"at 16 the lines stay on the centrelines they had at 1.5"* — whose crispness cost was not measured then; this is the measurement.

**G-3 · kind (3) · systemic · by placement.** *9.2% of straight outline length at 16 is soft and not on the midline* (703 units; §3.3): `x.125` / `x.875` 4.7 points in 51 concepts, other whole numbers 2.3 in 16, `x.25` / `x.75` 1.6 in 16, 0.6 off the grid. Lint passes all of it (the eighth grid), no rule asks for x.375 / x.625 in the interior, and each is a free choice. Not a defect to fix by decree; a placement question the next time an affected drawing is touched, with the families named in §3.3.

**G-4 · kind (3) · systemic · hand to the filled card (1.8) and the rule register.** *Filled 2.0 lines land on half-numbers in 19 concepts at 16 and 18 at 20:* `menu`, `menu-2`, `menu-arrow-left/right`, `list-bullet`, `list-bullet-2`, `text-2`, `filter-2`, `sort-3`, `sort-ascending/descending`, `sliders-2/4`, `grid-4`, `refresh-2`, `rotate-ccw-5/7/8/10`. Each of those lines scores the worst possible 1.0 (50% · 100% · 50%) where a whole-number centreline would score 0. `docs/08:409` records Fluent's rule (2.0 → whole numbers) as an item to inherit "next time filled weights are touched"; lint passes any quarter or eighth; C17 held the 1.5-era centrelines. No stated rule is broken, so it is kind (3), but it is the largest *avoidable* crispness cost the card found: **13.5% of the filled line-heavy length at 16 (14.5% at 20)** is on the worst possible position, and the fix is a position, not a weight.

**G-5 · kind (3) · instrument.** *The landing score cannot rank 24 or 20:* exactly 0.500 on every straight run at stroke 1.5. It needs a companion, and the solid-pixel share is the cheapest (the pixel profile of a line from its centreline and weight; analytic; no sampling). By it the 16 is narrowly last (20.2% against 15.6% and 16.9%; darkest pixel 0.936 against 0.961 and 0.958). **Not a case for changing the 16 stroke**: the stroke is not under audit, and the gap between masters is smaller than the gap inside the 16.

**G-6 · kind (3) · systemic · accepted, measured.** *On a 2× screen the 16 can never be crisp and the 24 and 20 mostly can.* 100% of the 16's straight length scores exactly 0.500; 79.5% (24) and 74.2% (20) is perfect, and almost all the rest is worst-case. This is the cost C7 and docs/01 accepted in words; now it has a size.

**G-7 · kind (3) · systemic · no instrument.** *A third of the outlines (173 of 485) are outside the landing score,* including every chevron, check and arrowhead. The probe shows they are dark (darkest pixel 0.81–0.99) but stair-stepped. If the wall (card 4.1) is the place to judge, show them beside the hard containers at real size and ask whether the staircase reads.

**G-8 · kind (2) · one-off · wording.** `docs/07` C7 says *"so 16 centrelines sit on x.375 / x.625"* without the midline exception docs/01:174-178 states. Measured: 76.0% of straight length does (§3.4); 11.0% is the midline. The C7 row should carry the exception, or point to docs/01.

**G-9 · kind (3) · one-off ×6 · eye.** *Six non-mark outlines have an outer edge on a half pixel at 16:* `keyboard-2` (x 1.00–15.00, y 1.50–14.50); `map-pin` (x 3.00–13.00, y 1.00–14.50); `map-pin-2` (x 3.00–13.00, y 1.00–14.50); `sort-3` (x 1.00–15.00, y 3.50–12.50); `volume-low` (x 1.00–11.50, y 3.00–13.00); `volume-off` (x 1.50–13.50, y 2.00–14.00). Decided shapes (odd dimensions kept centred, pointed tips). The only question is whether any reads soft at the silhouette; the eye decides.

---

## 7. Noticed in passing

- **Three instrument defects** (§1.1): the `raster.mjs` area bug (reproduced; the landing scores are unaffected), `diagonalShare`'s wrong closing segment after an arc (four drawings change side; the statistics do not), and `arcExtremes` keeping or dropping an arc's end extreme on rounding noise (25 scores move by up to 0.065; no band or headline moves).
- **Seven files contain a zero-length arc** (`paintbrush-4` and its filled twin at 24 and 20, `chart-pie-3-filled` at all three masters); no number here changes. A candidate for lint.
- **C7's arithmetic holds exactly.** "Cannot sit clean on both edges" and "a line on the canvas centre peaks at 62.5%" are both what §2 measures (the second in exact geometry; Chromium's horizontal lines peak at 75%).
- **Identical drawings under different names** (14 sets; see `findings-mass.md` §7) score identically here, so a pair is counted twice in every census row (for example `globe` and `language-2`).

---

## Appendix A1. Every outline at 16

Scores are stored to four decimals and shown to three, so in 72 of the 1,693 defined scores the third decimal differs by 0.001 from rounding the exact value. Columns: **score** (landing score, blank where undefined) · **judge** J / D / A / N (§1) · **straight-only** · **diagonal %** (`diagonalShare`, as the instrument gives it) · **curve %** (share of centreline length that is arc) · **run edges** (the instrument's `runCount`: two per stroked straight segment ≥ 0.5 long, one per straight edge of a filled shape) · **edges** · **half-tone %** · **darkest px** (mean across straight stroke runs; — if none) · **solid-run %** (share of straight stroke length with a fully inked pixel) · **worst edge** (kind, axis = coordinate, distance from a pixel line, ink length in pixels).

| concept | score | judge | straight-only | diagonal % | curve % | run edges | edges | half-tone % | darkest px | solid-run % | worst edge (kind axis=coord, off, ink length px) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `alert-circle` | 0.321 | J | 0.750 | 0 | 93 | 2 | 20 | 100 | 0.63 | 0 | run x=7.375, 0.375, 3.25 |
| `alert-circle-2` | 0.261 | D | 0.750 | 90 | 86 | 2 | 20 | 100 | 0.75 | 0 | run y=5.5, 0.500, 0.75 |
| `alert-circle-3` | 0.370 | J | 0.750 | 0 | 89 | 4 | 16 | 100 | 0.63 | 0 | run x=7.375, 0.375, 3.25 |
| `alert-circle-4` | 0.314 | D | 0.750 | 72 | 82 | 4 | 16 | 100 | 0.75 | 0 | run y=10.5, 0.500, 1.75 |
| `alert-triangle` | 0.248 | J | 0.340 | 45 | 29 | 4 | 22 | 82 | 0.93 | 82 | run x=7.375, 0.375, 2.13 |
| `alert-triangle-2` | 0.202 | D | 0.262 | 57 | 28 | 4 | 22 | 83 | 0.99 | 95 | run y=4.625, 0.375, 0.50 |
| `alert-triangle-3` | 0.288 | J | 0.336 | 41 | 24 | 6 | 18 | 79 | 0.94 | 83 | run x=7.375, 0.375, 2.38 |
| `alert-triangle-4` | 0.236 | D | 0.260 | 54 | 23 | 6 | 18 | 79 | 0.99 | 96 | run y=4.625, 0.375, 0.50 |
| `archive` | 0.234 | J | 0.250 | 0 | 21 | 16 | 40 | 41 | 1.00 | 100 | run y=3.25, 0.250, 8.75 |
| `arrow-down` | 0.698 | J | 0.750 | 44 | 5 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-down-2` | 0.698 | D | 0.750 | 54 | 4 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-down-3` | 0.699 | J | 0.750 | 45 | 4 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-down-4` | 0.458 | D | 0.566 | 52 | 16 | 4 | 7 | 100 | 0.78 | 0 | run x=7.375, 0.375, 4.67 |
| `arrow-left` | 0.698 | J | 0.750 | 44 | 5 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-left-2` | 0.698 | D | 0.750 | 54 | 4 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-left-3` | 0.699 | J | 0.750 | 45 | 4 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-left-4` | 0.458 | D | 0.566 | 52 | 16 | 4 | 7 | 100 | 0.78 | 0 | run y=7.375, 0.375, 4.67 |
| `arrow-right` | 0.698 | J | 0.750 | 44 | 5 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-right-2` | 0.698 | D | 0.750 | 54 | 4 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-right-3` | 0.699 | J | 0.750 | 45 | 4 | 2 | 3 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `arrow-right-4` | 0.458 | D | 0.566 | 52 | 16 | 4 | 7 | 100 | 0.78 | 0 | run y=7.375, 0.375, 4.67 |
| `arrow-up` | 0.698 | J | 0.750 | 44 | 5 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-up-2` | 0.698 | D | 0.750 | 54 | 4 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-up-3` | 0.699 | J | 0.750 | 45 | 4 | 2 | 3 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `arrow-up-4` | 0.458 | D | 0.566 | 52 | 16 | 4 | 7 | 100 | 0.78 | 0 | run x=7.375, 0.375, 4.67 |
| `arrow-up-right` | 0.228 | D | 0.250 | 59 | 5 | 4 | 6 | 67 | 1.00 | 100 | run y=4.25, 0.250, 4.13 |
| `arrow-up-right-2` | 0.235 | J | 0.250 | 49 | 4 | 4 | 6 | 60 | 1.00 | 100 | run y=4.25, 0.250, 6.25 |
| `arrow-up-right-3` | — | N | — | 100 | 4 | 0 | 0 | 96 | — | — | — |
| `arrow-up-right-4` | 0.265 | D | 0.250 | 64 | 16 | 4 | 10 | 75 | 1.00 | 100 | curve y=9.3661, 0.366, 1.61 |
| `arrow-up-right-5` | 0.228 | D | 0.250 | 53 | 5 | 4 | 6 | 62 | 1.00 | 100 | run y=5.25, 0.250, 4.13 |
| `at-sign` | 0.267 | J | 0.250 | 0 | 96 | 2 | 34 | 96 | 1.00 | 100 | curve y=10.625, 0.375, 2.31 |
| `at-sign-2` | 0.285 | J | 0.250 | 0 | 94 | 2 | 32 | 86 | 1.00 | 100 | curve y=11.5529, 0.447, 2.22 |
| `attachment` | 0.243 | J | 0.250 | 0 | 52 | 6 | 18 | 63 | 1.00 | 100 | run x=4.25, 0.250, 6.38 |
| `attachment-2` | 0.244 | J | 0.250 | 0 | 57 | 8 | 26 | 63 | 1.00 | 100 | run x=7.25, 0.250, 5.25 |
| `attachment-3` | 0.388 | D | — | 100 | 45 | 0 | 8 | 98 | — | — | curve y=13.6391, 0.361, 2.57 |
| `attachment-4` | 0.275 | D | — | 100 | 50 | 0 | 12 | 97 | — | — | curve x=11.7034, 0.297, 2.12 |
| `ban` | 0.238 | D | — | 100 | 76 | 0 | 12 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `ban-2` | 0.238 | D | — | 100 | 76 | 0 | 12 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `ban-3` | 0.238 | D | — | 100 | 86 | 0 | 12 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `bell` | 0.277 | J | 0.250 | — | 74 | 2 | 10 | 77 | 1.00 | 100 | curve x=10.625, 0.375, 1.16 |
| `bell-2` | 0.238 | J | 0.250 | — | 74 | 2 | 14 | 76 | 1.00 | 100 | curve x=10.625, 0.375, 1.16 |
| `bell-3` | 0.331 | J | 0.250 | — | 75 | 2 | 10 | 82 | 1.00 | 100 | curve x=12.5, 0.500, 1.51 |
| `bold` | 0.262 | J | 0.250 | 0 | 44 | 8 | 20 | 51 | 1.00 | 100 | curve x=9.625, 0.375, 1.96 |
| `book` | 0.240 | J | 0.250 | 0 | 16 | 12 | 32 | 31 | 1.00 | 100 | run x=11.75, 0.250, 10.75 |
| `book-2` | 0.290 | J | 0.306 | 7 | 14 | 14 | 34 | 42 | 0.97 | 89 | run x=7.5, 0.500, 6.00 |
| `book-3` | 0.239 | J | 0.250 | 0 | 18 | 12 | 32 | 36 | 1.00 | 100 | run x=11.75, 0.250, 10.75 |
| `book-4` | 0.238 | J | 0.250 | 0 | 12 | 10 | 26 | 33 | 1.00 | 100 | run x=5.75, 0.250, 12.75 |
| `book-open` | 0.324 | J | 0.372 | 0 | 42 | 18 | 42 | 69 | 0.91 | 76 | run x=7.375, 0.375, 6.75 |
| `book-open-2` | 0.324 | J | 0.372 | 0 | 42 | 14 | 38 | 62 | 0.91 | 76 | run x=7.375, 0.375, 6.75 |
| `briefcase` | 0.254 | J | 0.265 | 0 | 20 | 18 | 42 | 36 | 0.99 | 97 | run x=7.375, 0.375, 1.50 |
| `bug` | 0.325 | J | 0.366 | 32 | 31 | 16 | 36 | 74 | 0.91 | 77 | run x=7.375, 0.375, 7.00 |
| `bug-2` | 0.356 | J | 0.366 | 0 | 54 | 16 | 52 | 72 | 0.91 | 77 | curve y=7.5, 0.500, 1.35 |
| `building` | 0.282 | J | 0.250 | 0 | 23 | 14 | 62 | 37 | 1.00 | 100 | run x=4.25, 0.250, 10.75 |
| `building-2` | 0.238 | J | 0.250 | 0 | 17 | 18 | 42 | 36 | 1.00 | 100 | run x=4.25, 0.250, 10.75 |
| `building-3` | 0.273 | J | 0.250 | 0 | 12 | 14 | 44 | 37 | 1.00 | 100 | curve y=5.5, 0.500, 1.26 |
| `building-4` | 0.273 | J | 0.250 | 0 | 12 | 14 | 44 | 37 | 1.00 | 100 | curve y=5.5, 0.500, 1.26 |
| `calendar` | 0.242 | J | 0.250 | 0 | 18 | 14 | 30 | 36 | 1.00 | 100 | run y=8.25, 0.250, 10.75 |
| `calendar-2` | 0.241 | J | 0.250 | 0 | 21 | 14 | 30 | 41 | 1.00 | 100 | run y=5.25, 0.250, 7.75 |
| `calendar-3` | 0.255 | J | 0.250 | 0 | 20 | 14 | 36 | 36 | 1.00 | 100 | run y=8.25, 0.250, 10.75 |
| `camera` | 0.240 | J | 0.250 | 14 | 48 | 12 | 44 | 63 | 1.00 | 100 | curve y=5.25, 0.250, 1.08 |
| `camera-2` | 0.256 | J | 0.250 | 16 | 46 | 12 | 44 | 50 | 1.00 | 100 | curve y=6.25, 0.250, 1.08 |
| `camera-3` | 0.250 | J | 0.250 | 0 | 48 | 12 | 56 | 43 | 1.00 | 100 | run y=12.75, 0.250, 9.75 |
| `camera-4` | 0.274 | J | 0.250 | 0 | 48 | 10 | 54 | 43 | 1.00 | 100 | curve x=8.375, 0.375, 0.91 |
| `camera-5` | 0.240 | J | 0.250 | 14 | 48 | 12 | 44 | 63 | 1.00 | 100 | curve y=5.25, 0.250, 1.08 |
| `camera-6` | 0.222 | J | 0.250 | 0 | 37 | 8 | 42 | 48 | 1.00 | 100 | run y=3.25, 0.250, 9.75 |
| `cart` | 0.308 | J | 0.381 | 5 | 28 | 10 | 38 | 59 | 0.93 | 74 | run y=7.5, 0.500, 6.94 |
| `cart-2` | 0.313 | J | 0.377 | 0 | 26 | 12 | 40 | 56 | 0.94 | 75 | run y=7.5, 0.500, 7.75 |
| `cart-3` | 0.294 | J | 0.367 | 10 | 26 | 10 | 34 | 57 | 0.94 | 77 | run y=7.5, 0.500, 6.07 |
| `cart-4` | 0.189 | J | 0.250 | 6 | 31 | 10 | 38 | 54 | 1.00 | 100 | run y=4.25, 0.250, 7.75 |
| `cart-5` | 0.202 | J | 0.250 | 5 | 25 | 14 | 42 | 47 | 1.00 | 100 | run y=5.75, 0.250, 8.75 |
| `cash` | 0.261 | J | 0.250 | 0 | 24 | 10 | 32 | 36 | 1.00 | 100 | curve y=8.5, 0.500, 1.36 |
| `chart-bar` | 0.750 | J | 0.750 | 0 | 0 | 6 | 6 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `chart-bar-2` | 0.543 | J | 0.543 | 0 | 0 | 8 | 8 | 73 | 0.78 | 41 | run x=7.375, 0.375, 7.75 |
| `chart-bar-3` | 0.402 | J | 0.414 | 0 | 5 | 8 | 12 | 57 | 0.88 | 67 | run x=10.375, 0.375, 6.75 |
| `chart-bar-4` | 0.434 | J | 0.461 | 0 | 11 | 20 | 32 | 55 | 0.89 | 58 | run x=10.5, 0.500, 7.75 |
| `chart-bar-5` | 0.284 | J | 0.300 | 0 | 20 | 12 | 28 | 49 | 0.97 | 80 | run x=10.375, 0.375, 5.25 |
| `chart-pie` | 0.479 | J | 0.750 | 0 | 73 | 4 | 16 | 100 | 0.63 | 0 | run y=7.375, 0.375, 6.38 |
| `chart-pie-2` | 0.247 | J | 0.250 | 0 | 61 | 8 | 24 | 67 | 1.00 | 100 | run x=7.25, 0.250, 5.00 |
| `chart-pie-3` | 0.531 | J | 0.750 | 0 | 68 | 6 | 18 | 100 | 0.63 | 0 | run x=7.375, 0.375, 6.38 |
| `check` | 0.198 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve y=12.0992, 0.099, 1.61 |
| `check-2` | 0.802 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve y=12.5992, 0.401, 1.61 |
| `check-2-small` | 0.301 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=11.8497, 0.150, 1.61 |
| `check-3` | 0.055 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve y=13.0274, 0.027, 1.61 |
| `check-3-small` | 0.040 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=12.02, 0.020, 1.61 |
| `check-4` | 0.116 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=13.0581, 0.058, 1.61 |
| `check-4-small` | 0.127 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=12.0635, 0.064, 1.61 |
| `check-circle` | 0.262 | D | — | 100 | 87 | 0 | 13 | 100 | — | — | curve y=10.3493, 0.349, 1.61 |
| `check-circle-3` | 0.273 | D | — | 100 | 86 | 0 | 13 | 100 | — | — | curve y=10.5511, 0.449, 1.61 |
| `check-circle-3-small` | 0.250 | D | — | 100 | 89 | 0 | 13 | 98 | — | — | curve y=13.75, 0.250, 3.40 |
| `check-circle-4` | 0.269 | D | — | 100 | 87 | 0 | 13 | 100 | — | — | curve y=10.5879, 0.412, 1.61 |
| `check-circle-4-small` | 0.252 | D | — | 100 | 89 | 0 | 13 | 98 | — | — | curve y=10.2541, 0.254, 1.61 |
| `check-circle-small` | 0.229 | D | — | 100 | 89 | 0 | 13 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `check-small` | 0.802 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=11.5992, 0.401, 1.61 |
| `checkbox` | 0.248 | J | 0.250 | 17 | 22 | 8 | 25 | 47 | 1.00 | 100 | curve y=10.3061, 0.306, 1.61 |
| `checkbox-2` | 0.252 | J | 0.250 | 18 | 22 | 8 | 25 | 48 | 1.00 | 100 | curve y=10.6139, 0.386, 1.61 |
| `checkbox-3` | 0.247 | J | 0.250 | 18 | 22 | 8 | 25 | 48 | 1.00 | 100 | curve y=10.7266, 0.273, 1.61 |
| `checkbox-4` | 0.237 | J | 0.250 | 14 | 22 | 8 | 25 | 46 | 1.00 | 100 | run y=3.25, 0.250, 7.75 |
| `chevron-down` | 0.458 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=11.2292, 0.229, 1.61 |
| `chevron-down-2` | 0.302 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=10.849, 0.151, 1.52 |
| `chevron-down-2-large` | 0.557 | D | — | 100 | 5 | 0 | 1 | 100 | — | — | curve y=11.2784, 0.278, 1.53 |
| `chevron-down-2-small` | 0.930 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve y=10.535, 0.465, 1.59 |
| `chevron-down-3` | 0.306 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=11.8468, 0.153, 1.61 |
| `chevron-down-3-large` | 0.885 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=12.5576, 0.442, 1.61 |
| `chevron-down-3-small` | 0.274 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve y=11.1371, 0.137, 1.61 |
| `chevron-down-large` | 0.402 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=11.7991, 0.201, 1.61 |
| `chevron-down-small` | 0.662 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve y=10.6692, 0.331, 1.61 |
| `chevron-left` | 0.458 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve x=4.7708, 0.229, 1.61 |
| `chevron-left-2` | 0.302 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=5.151, 0.151, 1.52 |
| `chevron-left-2-large` | 0.557 | D | — | 100 | 5 | 0 | 1 | 100 | — | — | curve x=4.7216, 0.278, 1.53 |
| `chevron-left-2-small` | 0.910 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve x=5.455, 0.455, 1.59 |
| `chevron-left-3` | 0.246 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve x=4.1232, 0.123, 1.61 |
| `chevron-left-3-large` | 0.805 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=3.4024, 0.402, 1.61 |
| `chevron-left-3-small` | 0.334 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve x=4.8329, 0.167, 1.61 |
| `chevron-left-large` | 0.402 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=4.2009, 0.201, 1.61 |
| `chevron-left-small` | 0.662 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve x=5.3308, 0.331, 1.61 |
| `chevron-right` | 0.458 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve x=11.2292, 0.229, 1.61 |
| `chevron-right-2` | 0.302 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=10.849, 0.151, 1.52 |
| `chevron-right-2-large` | 0.557 | D | — | 100 | 5 | 0 | 1 | 100 | — | — | curve x=11.2784, 0.278, 1.53 |
| `chevron-right-2-small` | 0.910 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve x=10.545, 0.455, 1.59 |
| `chevron-right-3` | 0.246 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve x=11.8768, 0.123, 1.61 |
| `chevron-right-3-large` | 0.805 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=12.5976, 0.402, 1.61 |
| `chevron-right-3-small` | 0.334 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve x=11.1671, 0.167, 1.61 |
| `chevron-right-large` | 0.402 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve x=11.7991, 0.201, 1.61 |
| `chevron-right-small` | 0.662 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve x=10.6692, 0.331, 1.61 |
| `chevron-up` | 0.458 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=4.7708, 0.229, 1.61 |
| `chevron-up-2` | 0.522 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=5.261, 0.261, 1.52 |
| `chevron-up-2-large` | 0.297 | D | — | 100 | 5 | 0 | 1 | 100 | — | — | curve y=4.8516, 0.148, 1.53 |
| `chevron-up-2-small` | 0.870 | D | — | 100 | 7 | 0 | 1 | 100 | — | — | curve y=5.565, 0.435, 1.59 |
| `chevron-up-3` | 0.246 | D | — | 100 | 8 | 0 | 1 | 100 | — | — | curve y=4.1232, 0.123, 1.61 |
| `chevron-up-3-large` | 0.805 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=3.4024, 0.402, 1.61 |
| `chevron-up-3-small` | 0.334 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve y=4.8329, 0.167, 1.61 |
| `chevron-up-large` | 0.402 | D | — | 100 | 6 | 0 | 1 | 100 | — | — | curve y=4.2009, 0.201, 1.61 |
| `chevron-up-small` | 0.662 | D | — | 100 | 10 | 0 | 1 | 100 | — | — | curve y=5.3308, 0.331, 1.61 |
| `chevrons-up-down` | 0.622 | D | — | 100 | 10 | 0 | 2 | 100 | — | — | curve y=13.6892, 0.311, 1.61 |
| `chevrons-up-down-2` | 0.372 | D | — | 100 | 10 | 0 | 2 | 100 | — | — | curve y=13.8142, 0.186, 1.61 |
| `chevrons-up-down-3` | 0.350 | D | — | 100 | 7 | 0 | 2 | 100 | — | — | curve y=13.825, 0.175, 1.59 |
| `chevrons-up-down-4` | 0.850 | D | — | 100 | 7 | 0 | 2 | 100 | — | — | curve y=13.575, 0.425, 1.59 |
| `clipboard` | 0.309 | J | 0.304 | 0 | 33 | 18 | 50 | 49 | 0.97 | 89 | run x=10.5, 0.500, 1.75 |
| `clipboard-2` | 0.299 | J | 0.280 | 0 | 39 | 16 | 46 | 52 | 0.98 | 94 | curve x=10.5, 0.500, 1.13 |
| `clipboard-3` | 0.228 | J | 0.250 | 0 | 32 | 18 | 50 | 46 | 1.00 | 100 | run y=12.75, 0.250, 7.75 |
| `clipboard-4` | 0.315 | J | 0.312 | 0 | 36 | 18 | 50 | 51 | 0.97 | 88 | run x=10.5, 0.500, 1.75 |
| `clock` | 0.336 | J | 0.750 | 41 | 88 | 2 | 14 | 100 | 0.63 | 0 | run x=7.375, 0.375, 3.38 |
| `code` | 0.018 | D | — | 100 | 9 | 0 | 2 | 93 | — | — | curve x=13.9911, 0.009, 1.61 |
| `code-2` | 0.018 | D | — | 100 | 11 | 0 | 2 | 100 | — | — | curve x=13.9911, 0.009, 1.61 |
| `compass` | 0.331 | D | — | 100 | 77 | 0 | 16 | 100 | — | — | curve x=4.6283, 0.372, 1.61 |
| `compass-2` | 0.317 | D | — | 100 | 83 | 0 | 16 | 100 | — | — | curve y=10.6652, 0.335, 1.61 |
| `compass-3` | 0.331 | D | — | 100 | 77 | 0 | 16 | 100 | — | — | curve x=4.6283, 0.372, 1.61 |
| `compose` | 0.219 | D | 0.250 | 64 | 24 | 12 | 30 | 73 | 1.00 | 100 | curve y=3.2502, 0.250, 0.59 |
| `compose-2` | 0.292 | D | 0.306 | 51 | 21 | 12 | 30 | 67 | 0.97 | 89 | run x=5.5, 0.500, 1.38 |
| `compose-3` | 0.270 | D | 0.250 | 53 | 22 | 8 | 26 | 67 | 1.00 | 100 | curve x=5.4995, 0.499, 1.61 |
| `compose-4` | 0.294 | J | 0.306 | 50 | 23 | 12 | 30 | 67 | 0.97 | 89 | run x=5.5, 0.500, 1.38 |
| `copy` | 0.235 | J | 0.250 | 0 | 34 | 12 | 32 | 46 | 1.00 | 100 | run y=7.25, 0.250, 3.75 |
| `copy-2` | 0.238 | J | 0.250 | 0 | 29 | 12 | 32 | 42 | 1.00 | 100 | run x=11.75, 0.250, 6.75 |
| `copy-3` | 0.239 | J | 0.250 | 0 | 25 | 12 | 32 | 39 | 1.00 | 100 | run y=6.25, 0.250, 6.75 |
| `credit-card` | 0.243 | J | 0.250 | 0 | 17 | 12 | 28 | 32 | 1.00 | 100 | run y=7.25, 0.250, 12.75 |
| `credit-card-2` | 0.243 | J | 0.250 | 0 | 17 | 12 | 28 | 32 | 1.00 | 100 | run y=7.25, 0.250, 12.75 |
| `credit-card-3` | 0.255 | J | 0.250 | 0 | 18 | 12 | 34 | 34 | 1.00 | 100 | curve x=9.5, 0.500, 0.63 |
| `cursor` | 0.234 | D | — | 100 | 22 | 0 | 8 | 96 | — | — | curve y=9.2949, 0.295, 1.61 |
| `cursor-2` | 0.416 | D | — | 100 | 20 | 0 | 8 | 92 | — | — | curve y=12.4766, 0.477, 1.61 |
| `cursor-3` | 0.001 | D | — | 100 | 16 | 0 | 4 | 90 | — | — | curve y=14.0008, 0.001, 1.61 |
| `cursor-click` | 0.500 | D | 0.500 | 84 | 22 | 4 | 8 | 100 | 0.88 | 0 | curve x=6.5003, 0.500, 1.61 |
| `database` | 0.231 | J | 0.250 | 0 | 67 | 4 | 20 | 59 | 1.00 | 100 | run x=4.25, 0.250, 9.75 |
| `database-2` | 0.317 | J | 0.250 | 0 | 69 | 4 | 28 | 73 | 1.00 | 100 | curve y=4.5, 0.500, 4.55 |
| `database-3` | 0.232 | J | 0.250 | 0 | 75 | 4 | 20 | 64 | 1.00 | 100 | run x=3.25, 0.250, 7.75 |
| `desktop` | 0.276 | J | 0.291 | 0 | 20 | 12 | 28 | 41 | 0.97 | 92 | run x=7.375, 0.375, 3.00 |
| `desktop-2` | 0.241 | J | 0.250 | 0 | 22 | 10 | 26 | 38 | 1.00 | 100 | run y=3.25, 0.250, 9.75 |
| `desktop-3` | 0.270 | J | 0.280 | 0 | 16 | 14 | 30 | 36 | 0.98 | 94 | run x=7.375, 0.375, 3.00 |
| `desktop-4` | 0.279 | J | 0.296 | 0 | 22 | 12 | 28 | 43 | 0.97 | 91 | run x=7.375, 0.375, 3.00 |
| `desktop-5` | 0.285 | J | 0.300 | 0 | 19 | 12 | 28 | 41 | 0.96 | 90 | run x=7.375, 0.375, 4.00 |
| `desktop-6` | 0.243 | J | 0.250 | 0 | 24 | 14 | 38 | 36 | 1.00 | 100 | run y=3.25, 0.250, 9.75 |
| `export` | 0.363 | J | 0.430 | 28 | 26 | 12 | 29 | 73 | 0.86 | 64 | run x=7.375, 0.375, 7.63 |
| `external-link` | 0.233 | J | 0.250 | 27 | 21 | 12 | 26 | 54 | 1.00 | 100 | run x=3.25, 0.250, 4.75 |
| `external-link-2` | 0.231 | J | 0.250 | 32 | 23 | 12 | 26 | 58 | 1.00 | 100 | run y=3.25, 0.250, 4.13 |
| `eye` | 0.258 | A | — | — | 100 | 0 | 20 | 85 | — | — | curve y=10.25, 0.250, 2.14 |
| `face-neutral` | 0.242 | J | 0.250 | 0 | 85 | 6 | 18 | 90 | 1.00 | 100 | run y=11.25, 0.250, 4.75 |
| `face-sad` | 0.244 | J | 0.250 | 0 | 95 | 4 | 18 | 97 | 1.00 | 100 | curve y=10.2729, 0.273, 2.36 |
| `face-smile` | 0.238 | J | 0.250 | 0 | 95 | 4 | 18 | 97 | 1.00 | 100 | curve y=13.75, 0.250, 3.40 |
| `file` | 0.295 | J | 0.299 | 15 | 19 | 12 | 28 | 50 | 0.98 | 80 | run x=7.625, 0.375, 3.13 |
| `file-text` | 0.326 | J | 0.335 | 14 | 18 | 14 | 30 | 54 | 0.95 | 74 | run x=7.625, 0.375, 3.13 |
| `file-text-2` | 0.291 | J | 0.293 | 14 | 17 | 16 | 32 | 51 | 0.98 | 83 | run x=7.625, 0.375, 3.13 |
| `files` | 0.245 | J | 0.250 | 12 | 24 | 16 | 36 | 45 | 1.00 | 100 | run x=7.25, 0.250, 6.75 |
| `files-2` | 0.247 | J | 0.250 | 24 | 19 | 16 | 32 | 51 | 1.00 | 100 | run x=4.25, 0.250, 6.75 |
| `files-3` | 0.245 | J | 0.250 | 13 | 24 | 16 | 36 | 47 | 1.00 | 100 | run x=7.25, 0.250, 6.75 |
| `files-4` | 0.280 | J | 0.287 | 12 | 22 | 14 | 38 | 49 | 0.98 | 85 | run x=9.625, 0.375, 3.13 |
| `files-5` | 0.245 | J | 0.250 | 12 | 24 | 16 | 36 | 45 | 1.00 | 100 | run x=7.25, 0.250, 6.75 |
| `filter` | 0.237 | J | 0.250 | 18 | 22 | 8 | 20 | 57 | 1.00 | 100 | run y=3.25, 0.250, 8.75 |
| `filter-2` | 0.417 | J | 0.417 | 0 | 0 | 6 | 6 | 59 | 0.88 | 67 | run y=7.375, 0.375, 6.75 |
| `filter-3` | 0.225 | J | 0.250 | 20 | 29 | 8 | 28 | 61 | 1.00 | 100 | run y=3.25, 0.250, 7.75 |
| `filter-4` | 0.235 | J | 0.250 | 32 | 23 | 6 | 18 | 64 | 1.00 | 100 | curve x=5.75, 0.250, 0.98 |
| `flag` | 0.220 | J | 0.250 | 19 | 10 | 6 | 11 | 43 | 1.00 | 100 | run x=4.25, 0.250, 12.75 |
| `flag-2` | 0.322 | J | 0.250 | 0 | 53 | 4 | 28 | 65 | 1.00 | 100 | curve y=3.5, 0.500, 1.21 |
| `flag-3` | 0.250 | J | 0.250 | 0 | 52 | 4 | 12 | 60 | 1.00 | 100 | curve y=3.5, 0.500, 0.29 |
| `flag-4` | 0.331 | J | 0.343 | 0 | 17 | 12 | 24 | 45 | 0.95 | 81 | run y=8.5, 0.500, 3.13 |
| `folder` | 0.240 | J | 0.250 | 6 | 25 | 10 | 26 | 41 | 1.00 | 100 | run y=12.75, 0.250, 9.75 |
| `folder-2` | 0.241 | J | 0.250 | 12 | 22 | 12 | 28 | 42 | 1.00 | 100 | run y=12.75, 0.250, 9.75 |
| `folder-3` | 0.240 | J | 0.250 | 13 | 23 | 12 | 28 | 45 | 1.00 | 100 | run y=12.75, 0.250, 9.75 |
| `gauge` | 0.319 | D | — | 100 | 91 | 0 | 14 | 98 | — | — | curve x=2.25, 0.250, 1.70 |
| `gear` | 0.490 | D | — | 67 | 100 | 0 | 44 | 95 | — | — | curve y=9.5, 0.500, 1.76 |
| `gear-2` | 0.625 | D | — | 100 | 100 | 0 | 36 | 94 | — | — | curve y=10.5, 0.500, 2.25 |
| `gear-3` | 0.433 | D | 0.750 | 78 | 50 | 4 | 16 | 86 | 0.63 | 0 | run x=7.375, 0.375, 4.63 |
| `globe` | 0.395 | J | 0.750 | 0 | 84 | 2 | 26 | 87 | 0.63 | 0 | run y=7.375, 0.375, 12.75 |
| `globe-2` | 0.235 | A | — | — | 100 | 0 | 36 | 77 | — | — | curve y=13.75, 0.250, 3.40 |
| `grid` | 0.437 | J | 0.500 | 0 | 37 | 32 | 96 | 87 | 0.88 | 50 | run x=5.5, 0.500, 2.00 |
| `grid-2` | 0.425 | J | 0.455 | 0 | 15 | 12 | 28 | 56 | 0.85 | 59 | run x=7.375, 0.375, 10.75 |
| `grid-3` | 0.533 | A | — | — | 100 | 0 | 54 | 71 | — | — | curve y=11.35, 0.350, 1.58 |
| `grid-4` | 0.583 | J | 0.583 | 0 | 0 | 72 | 72 | 70 | 0.83 | 33 | run y=3.5, 0.500, 1.25 |
| `grid-5` | 0.440 | J | 0.500 | 0 | 51 | 24 | 84 | 90 | 0.88 | 50 | run x=5.5, 0.500, 2.00 |
| `grid-6` | 0.304 | J | 0.320 | 0 | 16 | 12 | 28 | 39 | 0.95 | 86 | run y=7.375, 0.375, 6.75 |
| `grid-7` | 0.192 | J | 0.250 | 0 | 34 | 32 | 96 | 77 | 1.00 | 100 | run y=3.25, 0.250, 2.25 |
| `hash` | 0.250 | J | 0.250 | 0 | 0 | 8 | 8 | 31 | 1.00 | 100 | run x=6.25, 0.250, 10.75 |
| `hash-2` | 0.250 | D | 0.250 | 50 | 0 | 4 | 4 | 54 | 1.00 | 100 | run y=6.25, 0.250, 10.75 |
| `hash-3` | 0.250 | D | 0.250 | 52 | 0 | 4 | 4 | 57 | 1.00 | 100 | run y=6.25, 0.250, 10.00 |
| `heart` | 0.215 | D | — | 100 | 62 | 0 | 15 | 100 | — | — | curve x=13.75, 0.250, 1.16 |
| `heart-2` | 0.145 | D | 0.250 | 77 | 15 | 8 | 20 | 83 | 1.00 | 100 | run x=13.75, 0.250, 2.12 |
| `help` | 0.249 | A | — | — | 100 | 0 | 24 | 100 | — | — | curve x=10.5004, 0.500, 2.25 |
| `help-2` | 0.249 | A | — | — | 100 | 0 | 24 | 100 | — | — | curve x=10.5004, 0.500, 2.25 |
| `help-3` | 0.230 | D | — | 100 | 98 | 0 | 22 | 100 | — | — | curve y=5.2875, 0.287, 1.45 |
| `help-4` | 0.353 | J | 0.750 | 42 | 90 | 2 | 25 | 100 | 0.75 | 0 | run y=5.5, 0.500, 2.50 |
| `home` | 0.410 | J | 0.436 | 32 | 21 | 16 | 34 | 71 | 0.91 | 63 | run x=11.5, 0.500, 4.29 |
| `home-2` | 0.237 | J | 0.250 | 18 | 24 | 12 | 32 | 54 | 1.00 | 100 | curve y=3.25, 0.250, 0.48 |
| `home-3` | 0.234 | J | 0.250 | 21 | 20 | 8 | 20 | 60 | 1.00 | 100 | curve y=3.25, 0.250, 0.48 |
| `image` | 0.227 | J | 0.250 | 26 | 24 | 8 | 32 | 51 | 1.00 | 100 | run y=3.25, 0.250, 7.75 |
| `image-2` | 0.233 | J | 0.250 | 23 | 29 | 8 | 36 | 49 | 1.00 | 100 | run y=3.25, 0.250, 7.75 |
| `image-3` | 0.227 | J | 0.250 | 26 | 24 | 8 | 32 | 51 | 1.00 | 100 | run y=4.25, 0.250, 9.75 |
| `images` | 0.251 | J | 0.250 | 19 | 27 | 12 | 34 | 50 | 1.00 | 100 | curve y=7.5392, 0.461, 0.59 |
| `images-2` | 0.251 | J | 0.250 | 19 | 27 | 12 | 34 | 50 | 1.00 | 100 | curve y=10.5392, 0.461, 0.59 |
| `images-3` | 0.251 | J | 0.250 | 19 | 27 | 12 | 34 | 50 | 1.00 | 100 | curve y=10.5392, 0.461, 0.59 |
| `images-4` | 0.239 | J | 0.250 | 22 | 30 | 10 | 36 | 52 | 1.00 | 100 | run y=4.25, 0.250, 5.75 |
| `info` | 0.321 | J | 0.750 | 0 | 93 | 2 | 20 | 100 | 0.63 | 0 | run x=7.375, 0.375, 3.25 |
| `info-2` | 0.319 | J | 0.432 | 0 | 92 | 4 | 23 | 95 | 0.91 | 0 | run y=8.5, 0.500, 1.25 |
| `info-3` | 0.328 | J | 0.689 | 0 | 88 | 6 | 26 | 100 | 0.73 | 12 | run y=11.5, 0.500, 2.75 |
| `italic` | 0.250 | D | 0.250 | 58 | 0 | 4 | 4 | 76 | 1.00 | 100 | run y=3.25, 0.250, 4.00 |
| `key` | 0.373 | J | 0.426 | 0 | 29 | 14 | 30 | 62 | 0.87 | 65 | run y=7.375, 0.375, 8.00 |
| `key-2` | 0.223 | D | — | 100 | 59 | 0 | 12 | 100 | — | — | curve y=12.75, 0.250, 2.14 |
| `key-3` | 0.215 | D | 0.250 | 83 | 44 | 4 | 16 | 94 | 1.00 | 100 | curve x=3.25, 0.250, 1.89 |
| `key-4` | 0.223 | D | — | 100 | 52 | 0 | 12 | 100 | — | — | curve y=12.75, 0.250, 2.14 |
| `key-5` | 0.431 | J | 0.590 | 0 | 56 | 6 | 18 | 91 | 0.74 | 32 | run y=7.375, 0.375, 8.00 |
| `key-6` | 0.431 | J | 0.590 | 0 | 56 | 6 | 18 | 91 | 0.74 | 32 | run x=7.375, 0.375, 8.00 |
| `keyboard` | 0.242 | J | 0.250 | 0 | 20 | 18 | 34 | 45 | 1.00 | 100 | run y=4.25, 0.250, 9.75 |
| `keyboard-2` | 0.595 | J | 0.604 | 0 | 23 | 22 | 42 | 86 | 0.82 | 29 | run y=4.5, 0.500, 9.75 |
| `language` | 0.326 | D | 0.287 | 54 | 27 | 6 | 7 | 76 | 0.98 | 85 | curve y=7.447, 0.447, 1.61 |
| `language-2` | 0.395 | J | 0.750 | 0 | 84 | 2 | 26 | 87 | 0.63 | 0 | run y=7.375, 0.375, 12.75 |
| `language-3` | 0.235 | A | — | — | 100 | 0 | 36 | 77 | — | — | curve y=13.75, 0.250, 3.40 |
| `layout-footer` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=8.75, 0.250, 10.75 |
| `layout-footer-2` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=8.75, 0.250, 10.75 |
| `layout-footer-3` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=8.75, 0.250, 10.75 |
| `layout-footer-4` | 0.241 | J | 0.250 | 0 | 28 | 14 | 38 | 40 | 1.00 | 100 | run y=9.75, 0.250, 8.75 |
| `layout-header` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=7.25, 0.250, 10.75 |
| `layout-header-2` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=7.25, 0.250, 10.75 |
| `layout-header-3` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run y=7.25, 0.250, 10.75 |
| `layout-header-4` | 0.241 | J | 0.250 | 0 | 28 | 14 | 38 | 40 | 1.00 | 100 | run y=6.25, 0.250, 8.75 |
| `layout-sidebar` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=7.25, 0.250, 10.75 |
| `layout-sidebar-2` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=7.25, 0.250, 10.75 |
| `layout-sidebar-3` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=7.25, 0.250, 10.75 |
| `layout-sidebar-4` | 0.241 | J | 0.250 | 0 | 28 | 14 | 38 | 40 | 1.00 | 100 | run x=6.25, 0.250, 8.75 |
| `layout-sidebar-right` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=8.75, 0.250, 10.75 |
| `layout-sidebar-right-2` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=8.75, 0.250, 10.75 |
| `layout-sidebar-right-3` | 0.242 | J | 0.250 | 0 | 18 | 10 | 26 | 33 | 1.00 | 100 | run x=8.75, 0.250, 10.75 |
| `layout-sidebar-right-4` | 0.241 | J | 0.250 | 0 | 28 | 14 | 38 | 40 | 1.00 | 100 | run x=9.75, 0.250, 8.75 |
| `lightbulb` | 0.255 | J | 0.250 | 31 | 55 | 4 | 18 | 82 | 1.00 | 100 | curve y=12.25, 0.250, 1.40 |
| `lightbulb-2` | 0.392 | J | 0.472 | 0 | 60 | 6 | 20 | 87 | 0.89 | 56 | run y=9.5, 0.500, 6.00 |
| `lightbulb-3` | 0.321 | D | 0.439 | 53 | 52 | 4 | 16 | 91 | 0.86 | 62 | run x=7.375, 0.375, 2.88 |
| `lightbulb-4` | 0.234 | D | 0.250 | 64 | 57 | 2 | 14 | 90 | 1.00 | 100 | run y=13.75, 0.250, 4.75 |
| `link` | 0.404 | D | — | 100 | 76 | 0 | 12 | 100 | — | — | curve y=10.5642, 0.436, 2.71 |
| `link-2` | 0.230 | D | — | 100 | 64 | 0 | 8 | 100 | — | — | curve x=2.2501, 0.250, 2.57 |
| `link-3` | 0.363 | J | 0.578 | 0 | 79 | 10 | 22 | 100 | 0.75 | 34 | run y=7.375, 0.375, 4.75 |
| `list-bullet` | 0.453 | J | 0.417 | 0 | 19 | 6 | 24 | 61 | 0.88 | 67 | run y=7.375, 0.375, 6.75 |
| `list-bullet-2` | 0.467 | J | 0.417 | 0 | 37 | 6 | 24 | 61 | 0.88 | 67 | run y=7.375, 0.375, 6.25 |
| `list-bullet-3` | 0.500 | J | 0.500 | 0 | 68 | 4 | 28 | 100 | 0.88 | 0 | curve y=6.5, 0.500, 2.14 |
| `list-ordered` | 0.345 | J | 0.368 | 17 | 14 | 10 | 14 | 66 | 0.91 | 76 | run y=7.375, 0.375, 5.25 |
| `lock` | 0.253 | J | 0.273 | 0 | 38 | 14 | 36 | 53 | 0.98 | 95 | run x=7.375, 0.375, 1.25 |
| `lock-2` | 0.220 | J | 0.250 | 0 | 42 | 12 | 40 | 53 | 1.00 | 100 | run y=8.25, 0.250, 5.75 |
| `lock-3` | 0.262 | J | 0.354 | 0 | 85 | 6 | 24 | 92 | 0.92 | 79 | run x=7.375, 0.375, 1.25 |
| `lock-4` | 0.255 | J | 0.281 | 0 | 52 | 14 | 36 | 66 | 0.98 | 94 | run x=7.375, 0.375, 1.25 |
| `lock-5` | 0.260 | J | 0.283 | 0 | 41 | 14 | 42 | 55 | 0.97 | 93 | run x=7.375, 0.375, 1.88 |
| `lock-6` | 0.263 | J | 0.294 | 0 | 54 | 14 | 42 | 68 | 0.97 | 91 | run x=7.375, 0.375, 1.88 |
| `login` | 0.429 | J | 0.469 | 31 | 18 | 8 | 17 | 76 | 0.84 | 56 | run y=7.375, 0.375, 8.00 |
| `login-2` | 0.362 | J | 0.410 | 32 | 18 | 8 | 17 | 71 | 0.88 | 68 | run y=7.375, 0.375, 5.75 |
| `login-3` | 0.429 | J | 0.469 | 31 | 18 | 8 | 17 | 76 | 0.84 | 56 | run y=7.375, 0.375, 8.00 |
| `login-4` | 0.362 | J | 0.410 | 32 | 18 | 8 | 17 | 71 | 0.88 | 68 | run y=7.375, 0.375, 5.75 |
| `logout` | 0.411 | J | 0.469 | 31 | 18 | 8 | 17 | 76 | 0.84 | 56 | run y=7.375, 0.375, 8.00 |
| `logout-2` | 0.362 | J | 0.410 | 32 | 18 | 8 | 17 | 71 | 0.88 | 68 | run y=7.375, 0.375, 5.75 |
| `logout-3` | 0.411 | J | 0.469 | 31 | 18 | 8 | 17 | 76 | 0.84 | 56 | run y=7.375, 0.375, 8.00 |
| `logout-4` | 0.362 | J | 0.410 | 32 | 18 | 8 | 17 | 71 | 0.88 | 68 | run y=7.375, 0.375, 5.75 |
| `mail` | 0.241 | J | 0.250 | 28 | 21 | 8 | 26 | 52 | 1.00 | 100 | curve y=7.7191, 0.281, 1.38 |
| `mail-2` | 0.239 | J | 0.250 | 29 | 19 | 8 | 26 | 48 | 1.00 | 100 | run y=4.25, 0.250, 9.75 |
| `mail-3` | 0.239 | J | 0.250 | 27 | 20 | 8 | 26 | 50 | 1.00 | 100 | curve y=6.6943, 0.306, 0.42 |
| `map-pin` | 0.211 | D | — | 100 | 70 | 0 | 18 | 100 | — | — | curve y=2.25, 0.250, 2.75 |
| `map-pin-2` | 0.211 | A | — | — | 100 | 0 | 18 | 100 | — | — | curve y=2.25, 0.250, 2.75 |
| `map-pin-3` | 0.449 | D | — | 100 | 82 | 0 | 26 | 100 | — | — | curve x=12.5, 0.500, 1.51 |
| `map-pin-4` | 0.261 | D | — | 100 | 80 | 0 | 20 | 100 | — | — | curve y=13.553, 0.447, 0.98 |
| `map-pin-5` | 0.478 | J | 0.750 | 0 | 85 | 2 | 20 | 100 | 0.63 | 0 | curve x=10.5, 0.500, 1.13 |
| `maximize` | 0.229 | J | 0.250 | 0 | 49 | 16 | 32 | 73 | 1.00 | 100 | run y=3.25, 0.250, 1.25 |
| `maximize-2` | 0.300 | J | 0.250 | 0 | 23 | 16 | 24 | 69 | 1.00 | 100 | run y=2.75, 0.250, 1.63 |
| `maximize-3` | 0.223 | J | 0.250 | 0 | 26 | 16 | 32 | 55 | 1.00 | 100 | run y=3.25, 0.250, 2.25 |
| `maximize-4` | 0.228 | J | 0.250 | 40 | 7 | 8 | 12 | 53 | 1.00 | 100 | run y=3.25, 0.250, 4.13 |
| `maximize-5` | 0.478 | J | 0.487 | 0 | 43 | 24 | 56 | 83 | 0.88 | 53 | run y=5.5, 0.500, 2.25 |
| `megaphone` | 0.498 | D | — | 100 | 19 | 0 | 6 | 100 | — | — | curve x=3.4422, 0.442, 0.59 |
| `megaphone-2` | 0.251 | J | 0.294 | 36 | 21 | 14 | 34 | 61 | 0.98 | 91 | run x=3.5, 0.500, 2.00 |
| `megaphone-3` | 0.284 | J | 0.376 | 34 | 33 | 10 | 24 | 74 | 0.94 | 75 | run x=4.5, 0.500, 4.00 |
| `menu` | 0.417 | J | 0.417 | 0 | 0 | 6 | 6 | 55 | 0.88 | 67 | run y=7.375, 0.375, 10.75 |
| `menu-2` | 0.515 | J | 0.515 | 0 | 0 | 6 | 6 | 72 | 0.80 | 47 | run y=7.375, 0.375, 10.75 |
| `menu-3` | 0.750 | J | 0.750 | 0 | 0 | 4 | 4 | 100 | 0.63 | 0 | run y=4.375, 0.375, 10.75 |
| `menu-4` | 0.500 | J | 0.500 | 0 | 0 | 4 | 4 | 100 | 0.88 | 0 | run y=3.625, 0.375, 10.75 |
| `menu-arrow-left` | 0.400 | J | 0.417 | 19 | 4 | 6 | 7 | 66 | 0.88 | 67 | run y=7.375, 0.375, 6.25 |
| `menu-arrow-right` | 0.400 | J | 0.417 | 19 | 4 | 6 | 7 | 66 | 0.88 | 67 | run y=7.375, 0.375, 6.25 |
| `message` | 0.230 | J | 0.250 | 17 | 24 | 8 | 22 | 42 | 1.00 | 100 | run x=3.25, 0.250, 8.63 |
| `message-2` | 0.283 | J | 0.283 | 18 | 35 | 10 | 32 | 54 | 0.98 | 93 | run x=4.5, 0.500, 1.38 |
| `message-3` | 0.237 | J | 0.250 | 0 | 75 | 4 | 20 | 81 | 1.00 | 100 | run y=13.75, 0.250, 5.38 |
| `message-4` | 0.259 | J | 0.250 | 8 | 29 | 12 | 34 | 47 | 1.00 | 100 | curve x=4.5, 0.500, 0.29 |
| `message-5` | 0.229 | J | 0.250 | 0 | 94 | 4 | 14 | 92 | 1.00 | 100 | curve x=13.7499, 0.250, 3.40 |
| `message-6` | 0.233 | J | 0.250 | 26 | 62 | 6 | 28 | 69 | 1.00 | 100 | run y=4.25, 0.250, 7.00 |
| `message-7` | 0.268 | J | 0.279 | 27 | 57 | 8 | 30 | 69 | 0.99 | 88 | curve x=5.625, 0.375, 1.61 |
| `microphone` | 0.289 | J | 0.359 | 0 | 62 | 10 | 28 | 78 | 0.92 | 78 | run x=7.375, 0.375, 3.00 |
| `microphone-2` | 0.285 | J | 0.341 | 0 | 58 | 12 | 30 | 76 | 0.93 | 82 | run x=7.375, 0.375, 3.00 |
| `microphone-3` | 0.285 | J | 0.341 | 0 | 58 | 10 | 28 | 72 | 0.93 | 82 | run x=7.375, 0.375, 3.00 |
| `microphone-4` | 0.277 | J | 0.309 | 0 | 35 | 12 | 32 | 55 | 0.96 | 88 | run x=7.375, 0.375, 3.00 |
| `microphone-5` | 0.285 | J | 0.341 | 0 | 58 | 12 | 30 | 76 | 0.93 | 82 | run x=7.375, 0.375, 3.00 |
| `minus` | 0.750 | J | 0.750 | 0 | 0 | 2 | 2 | 100 | 0.63 | 0 | run y=7.375, 0.375, 10.75 |
| `minus-circle` | 0.375 | J | 0.750 | 0 | 88 | 2 | 14 | 100 | 0.63 | 0 | run y=7.375, 0.375, 5.25 |
| `minus-circle-small` | 0.355 | J | 0.750 | 0 | 90 | 2 | 14 | 100 | 0.63 | 0 | run y=7.375, 0.375, 4.25 |
| `minus-large` | 0.750 | J | 0.750 | 0 | 0 | 2 | 2 | 100 | 0.63 | 0 | run y=7.375, 0.375, 12.75 |
| `minus-small` | 0.750 | J | 0.750 | 0 | 0 | 2 | 2 | 100 | 0.63 | 0 | run y=7.375, 0.375, 8.75 |
| `moon` | 0.296 | A | — | — | 100 | 0 | 12 | 100 | — | — | curve x=7.3341, 0.334, 2.80 |
| `more-horizontal` | 0.467 | A | — | — | 100 | 0 | 18 | 71 | — | — | curve x=11.35, 0.350, 0.79 |
| `more-vertical` | 0.467 | A | — | — | 100 | 0 | 18 | 71 | — | — | curve y=11.35, 0.350, 0.79 |
| `package` | 0.277 | J | 0.283 | 30 | 9 | 14 | 22 | 46 | 0.97 | 93 | run x=7.375, 0.375, 2.75 |
| `package-2` | 0.365 | D | 0.443 | 69 | 12 | 6 | 14 | 84 | 0.86 | 61 | run x=7.375, 0.375, 5.49 |
| `package-3` | 0.396 | D | 0.439 | 76 | 9 | 6 | 10 | 87 | 0.86 | 62 | run x=7.375, 0.375, 5.54 |
| `paintbrush` | 0.241 | J | 0.250 | 0 | 24 | 20 | 48 | 46 | 1.00 | 100 | run y=8.25, 0.250, 8.75 |
| `paintbrush-2` | 0.223 | D | 0.250 | 91 | 38 | 4 | 16 | 75 | 1.00 | 100 | run x=3.25, 0.250, 1.38 |
| `paintbrush-3` | 0.356 | D | 0.250 | 70 | 29 | 6 | 20 | 82 | 1.00 | 100 | curve y=10.5, 0.500, 0.77 |
| `paintbrush-4` | 0.387 | D | — | 100 | 51 | 0 | 15 | 97 | — | — | curve y=8.558, 0.442, 0.51 |
| `paintbrush-5` | 0.272 | D | 0.250 | 82 | 76 | 4 | 18 | 80 | 1.00 | 100 | curve x=5.665, 0.335, 0.33 |
| `paintbrush-6` | 0.411 | D | — | 100 | 59 | 0 | 12 | 100 | — | — | curve x=8.5, 0.500, 1.13 |
| `paintbrush-7` | 0.355 | D | 0.250 | 88 | 46 | 4 | 24 | 92 | 1.00 | 100 | curve y=9.5, 0.500, 1.07 |
| `paintbrush-8` | 0.325 | D | 0.250 | 90 | 38 | 4 | 10 | 85 | 1.00 | 100 | curve x=9.713, 0.287, 0.98 |
| `pencil` | 0.074 | D | — | 100 | 13 | 0 | 6 | 100 | — | — | curve y=3.2502, 0.250, 0.59 |
| `pencil-2` | 0.191 | D | 0.250 | 97 | 16 | 4 | 10 | 95 | 1.00 | 100 | run x=3.25, 0.250, 1.38 |
| `pencil-3` | 0.171 | D | 0.250 | 96 | 12 | 4 | 10 | 86 | 1.00 | 100 | curve y=3.2502, 0.250, 0.59 |
| `pencil-4` | 0.203 | D | 0.250 | 87 | 11 | 6 | 12 | 88 | 1.00 | 100 | curve y=3.2502, 0.250, 0.59 |
| `phone` | 0.221 | J | 0.250 | 40 | 91 | 4 | 26 | 87 | 1.00 | 100 | curve x=7.25, 0.250, 1.04 |
| `pin` | 0.295 | J | 0.339 | 17 | 23 | 10 | 32 | 63 | 0.93 | 82 | run x=7.375, 0.375, 4.00 |
| `pin-2` | 0.276 | J | 0.337 | 20 | 30 | 18 | 50 | 73 | 0.93 | 83 | run x=7.375, 0.375, 4.00 |
| `pin-3` | 0.320 | J | 0.397 | 33 | 27 | 10 | 32 | 73 | 0.89 | 71 | run x=7.375, 0.375, 5.00 |
| `pin-4` | 0.276 | D | 0.250 | 78 | 32 | 4 | 24 | 83 | 1.00 | 100 | curve x=8.5607, 0.439, 0.20 |
| `pin-5` | 0.251 | D | 0.250 | 72 | 27 | 8 | 28 | 75 | 1.00 | 100 | curve x=9.75, 0.250, 0.98 |
| `pin-6` | 0.228 | D | 0.250 | 81 | 21 | 4 | 18 | 91 | 1.00 | 100 | curve y=12.6893, 0.311, 0.20 |
| `play` | 0.612 | D | 0.560 | 100 | 21 | 2 | 10 | 100 | 0.84 | 0 | curve y=2.505, 0.495, 0.91 |
| `play-2` | 0.765 | D | 0.740 | 100 | 32 | 2 | 12 | 100 | 0.76 | 0 | curve y=2.505, 0.495, 1.11 |
| `play-3` | 0.758 | D | 0.720 | 100 | 17 | 2 | 6 | 100 | 0.77 | 0 | curve y=3.5049, 0.495, 0.67 |
| `plug` | 0.581 | J | 0.703 | 0 | 48 | 12 | 26 | 95 | 0.75 | 9 | run y=4.5, 0.500, 6.75 |
| `plug-2` | 0.525 | J | 0.585 | 0 | 32 | 14 | 30 | 78 | 0.82 | 33 | run y=4.5, 0.500, 6.75 |
| `plug-3` | 0.704 | J | 0.750 | 0 | 28 | 12 | 18 | 100 | 0.73 | 0 | run y=4.5, 0.500, 8.75 |
| `plug-4` | 0.370 | J | 0.436 | 0 | 44 | 10 | 24 | 75 | 0.91 | 63 | run x=5.5, 0.500, 4.00 |
| `plug-5` | 0.581 | J | 0.703 | 0 | 48 | 12 | 26 | 95 | 0.75 | 9 | run x=11.5, 0.500, 6.75 |
| `plug-6` | 0.457 | D | — | 100 | 46 | 0 | 8 | 96 | — | — | curve x=4.3789, 0.379, 2.84 |
| `plug-7` | 0.533 | J | 0.627 | 0 | 47 | 14 | 32 | 90 | 0.80 | 25 | run y=4.5, 0.500, 6.75 |
| `plus` | 0.750 | J | 0.750 | 0 | 0 | 4 | 4 | 100 | 0.63 | 0 | run x=7.375, 0.375, 10.75 |
| `plus-circle` | 0.455 | J | 0.750 | 0 | 79 | 4 | 16 | 100 | 0.63 | 0 | run x=7.375, 0.375, 5.25 |
| `plus-circle-small` | 0.429 | J | 0.750 | 0 | 82 | 4 | 16 | 100 | 0.63 | 0 | run x=7.375, 0.375, 4.25 |
| `plus-large` | 0.750 | J | 0.750 | 0 | 0 | 4 | 4 | 100 | 0.63 | 0 | run x=7.375, 0.375, 12.75 |
| `plus-small` | 0.750 | J | 0.750 | 0 | 0 | 4 | 4 | 100 | 0.63 | 0 | run x=7.375, 0.375, 8.75 |
| `presentation` | 0.283 | J | 0.292 | 19 | 10 | 10 | 18 | 46 | 0.97 | 92 | run x=7.375, 0.375, 3.00 |
| `presentation-2` | 0.231 | J | 0.250 | 38 | 19 | 8 | 26 | 59 | 1.00 | 100 | run y=2.25, 0.250, 9.75 |
| `printer` | 0.229 | J | 0.250 | 0 | 28 | 24 | 64 | 48 | 1.00 | 100 | run y=5.25, 0.250, 9.75 |
| `printer-2` | 0.221 | J | 0.250 | 0 | 29 | 20 | 58 | 47 | 1.00 | 100 | run y=5.25, 0.250, 9.75 |
| `puzzle` | 0.299 | J | 0.250 | 0 | 74 | 4 | 36 | 71 | 1.00 | 100 | curve x=8.375, 0.375, 2.20 |
| `puzzle-2` | 0.442 | J | 0.250 | 0 | 83 | 6 | 54 | 88 | 1.00 | 100 | curve y=4.5, 0.500, 1.04 |
| `puzzle-3` | 0.489 | J | 0.250 | 0 | 92 | 8 | 64 | 97 | 1.00 | 100 | curve y=4.5, 0.500, 1.04 |
| `puzzle-4` | 0.432 | J | 0.411 | 0 | 45 | 12 | 46 | 65 | 0.92 | 68 | run y=5.5, 0.500, 5.90 |
| `puzzle-5` | 0.776 | D | — | 100 | 94 | 0 | 48 | 100 | — | — | curve y=5.507, 0.493, 1.42 |
| `refresh` | 0.341 | J | 0.250 | 28 | 54 | 8 | 16 | 65 | 1.00 | 100 | curve y=2.6019, 0.398, 3.30 |
| `refresh-2` | 0.255 | J | 0.250 | 27 | 54 | 8 | 16 | 62 | 1.00 | 100 | curve y=1.7186, 0.281, 3.56 |
| `refresh-3` | 0.341 | J | 0.250 | 28 | 54 | 8 | 16 | 65 | 1.00 | 100 | curve x=2.6019, 0.398, 3.30 |
| `rotate-ccw` | 0.657 | J | 0.750 | 28 | 73 | 4 | 12 | 93 | 0.75 | 0 | run x=3.5, 0.500, 3.38 |
| `rotate-ccw-10` | 0.441 | J | 0.479 | 36 | 31 | 8 | 17 | 81 | 0.89 | 54 | run y=10.5, 0.500, 5.50 |
| `rotate-ccw-11` | 0.500 | J | 0.512 | 20 | 21 | 8 | 19 | 75 | 0.84 | 48 | run y=9.5, 0.500, 5.50 |
| `rotate-ccw-2` | 0.657 | J | 0.750 | 28 | 72 | 4 | 12 | 93 | 0.75 | 0 | run x=3.5, 0.500, 3.38 |
| `rotate-ccw-3` | 0.657 | J | 0.750 | 28 | 68 | 4 | 12 | 92 | 0.75 | 0 | run x=3.5, 0.500, 3.38 |
| `rotate-ccw-4` | 0.440 | J | 0.482 | 13 | 53 | 12 | 32 | 75 | 0.88 | 51 | run x=3.5, 0.500, 3.38 |
| `rotate-ccw-5` | 0.247 | J | 0.250 | 23 | 27 | 8 | 25 | 54 | 1.00 | 100 | run y=12.75, 0.250, 7.75 |
| `rotate-ccw-6` | 0.507 | J | 0.553 | 18 | 32 | 8 | 29 | 79 | 0.80 | 39 | run y=9.5, 0.500, 4.88 |
| `rotate-ccw-7` | 0.327 | D | 0.250 | 72 | 59 | 2 | 7 | 86 | 1.00 | 100 | curve x=12.625, 0.375, 1.91 |
| `rotate-ccw-8` | 0.417 | J | 0.427 | 30 | 18 | 8 | 17 | 72 | 0.91 | 65 | run y=10.5, 0.500, 5.50 |
| `rotate-ccw-9` | 0.432 | J | 0.425 | 34 | 39 | 12 | 33 | 78 | 0.91 | 65 | run y=8.5, 0.500, 2.25 |
| `save` | 0.256 | J | 0.250 | 6 | 22 | 20 | 48 | 37 | 1.00 | 100 | run y=12.75, 0.250, 7.75 |
| `search` | 0.500 | D | — | 100 | 88 | 0 | 12 | 95 | — | — | curve y=12.5, 0.500, 3.25 |
| `search-2` | 0.500 | D | — | 100 | 92 | 0 | 12 | 98 | — | — | curve y=13.5, 0.500, 3.40 |
| `search-3` | 0.230 | D | — | 100 | 81 | 0 | 12 | 97 | — | — | curve y=9.75, 0.250, 2.57 |
| `send` | 0.000 | D | — | 100 | 15 | 0 | 4 | 91 | — | — | curve x=2.0001, 0.000, 1.61 |
| `shield` | 0.241 | J | 0.250 | 7 | 49 | 8 | 16 | 61 | 1.00 | 100 | run x=11.75, 0.250, 5.82 |
| `shield-2` | 0.234 | J | 0.250 | 12 | 66 | 4 | 12 | 78 | 1.00 | 100 | run x=11.75, 0.250, 5.39 |
| `sliders` | 0.228 | J | 0.250 | 0 | 63 | 8 | 32 | 70 | 1.00 | 100 | curve y=5.75, 0.250, 1.61 |
| `sliders-2` | 0.526 | J | 0.526 | 0 | 0 | 12 | 12 | 88 | 0.83 | 17 | run y=4.375, 0.375, 10.75 |
| `sliders-3` | 0.228 | J | 0.250 | 0 | 63 | 8 | 32 | 70 | 1.00 | 100 | curve y=7.75, 0.250, 1.61 |
| `sliders-4` | 0.526 | J | 0.526 | 0 | 0 | 12 | 12 | 88 | 0.83 | 17 | run x=4.375, 0.375, 10.75 |
| `sliders-5` | 0.228 | J | 0.250 | 0 | 63 | 4 | 28 | 70 | 1.00 | 100 | curve y=5.75, 0.250, 1.61 |
| `sort` | 0.698 | J | 0.750 | 44 | 5 | 4 | 6 | 100 | 0.63 | 0 | run x=4.375, 0.375, 10.75 |
| `sort-2` | 0.683 | D | 0.750 | 50 | 6 | 4 | 6 | 100 | 0.63 | 0 | run x=4.375, 0.375, 8.25 |
| `sort-3` | 0.566 | D | 0.500 | 51 | 8 | 6 | 8 | 89 | 0.81 | 50 | curve y=3.4998, 0.500, 1.61 |
| `sort-alpha-ascending` | 0.517 | J | 0.557 | 48 | 6 | 8 | 10 | 85 | 0.78 | 39 | run y=4.5, 0.500, 2.00 |
| `sort-alpha-ascending-2` | 0.370 | J | 0.384 | 39 | 4 | 12 | 13 | 73 | 0.91 | 73 | run y=4.5, 0.500, 2.00 |
| `sort-alpha-ascending-3` | 0.370 | J | 0.384 | 39 | 4 | 12 | 13 | 69 | 0.91 | 73 | run y=4.5, 0.500, 2.00 |
| `sort-alpha-descending` | 0.535 | J | 0.557 | 48 | 6 | 8 | 10 | 83 | 0.78 | 39 | run y=12.5, 0.500, 2.00 |
| `sort-alpha-descending-2` | 0.389 | J | 0.384 | 39 | 4 | 12 | 13 | 71 | 0.91 | 73 | run y=12.5, 0.500, 2.00 |
| `sort-alpha-descending-3` | 0.389 | J | 0.384 | 39 | 4 | 12 | 13 | 67 | 0.91 | 73 | run y=12.5, 0.500, 2.00 |
| `sort-ascending` | 0.650 | J | 0.678 | 31 | 4 | 8 | 9 | 95 | 0.68 | 14 | run x=9.375, 0.375, 10.75 |
| `sort-descending` | 0.581 | J | 0.605 | 31 | 4 | 8 | 9 | 87 | 0.73 | 29 | run x=9.375, 0.375, 10.75 |
| `sort-numeric-ascending` | 0.483 | J | 0.672 | 39 | 46 | 6 | 35 | 83 | 0.68 | 16 | curve x=4.5, 0.500, 0.95 |
| `sort-numeric-ascending-2` | 0.336 | J | 0.390 | 18 | 52 | 10 | 38 | 62 | 0.90 | 72 | run y=7.375, 0.375, 3.50 |
| `sort-numeric-ascending-3` | 0.357 | J | 0.390 | 18 | 52 | 10 | 38 | 65 | 0.90 | 72 | curve x=4.5, 0.500, 0.95 |
| `sort-numeric-descending` | 0.502 | J | 0.672 | 39 | 46 | 6 | 35 | 87 | 0.68 | 16 | curve y=5.5, 0.500, 1.89 |
| `sort-numeric-descending-2` | 0.357 | J | 0.390 | 18 | 52 | 10 | 38 | 67 | 0.90 | 72 | curve y=5.5, 0.500, 1.89 |
| `sort-numeric-descending-3` | 0.378 | J | 0.390 | 18 | 52 | 10 | 38 | 69 | 0.90 | 72 | curve y=5.5, 0.500, 1.89 |
| `sparkle` | 0.000 | D | — | 100 | 46 | 0 | 4 | 100 | — | — | curve y=0.9999, 0.000, 1.61 |
| `sparkle-2` | 0.000 | D | — | 100 | 37 | 0 | 4 | 74 | — | — | curve y=3.9999, 0.000, 1.61 |
| `sparkle-3` | 0.000 | D | — | 100 | 32 | 0 | 4 | 91 | — | — | curve y=2.9999, 0.000, 1.61 |
| `sparkle-4` | 0.527 | D | — | 100 | 46 | 0 | 10 | 100 | — | — | curve y=2.4999, 0.500, 1.61 |
| `star` | 0.258 | D | — | 100 | 16 | 0 | 6 | 96 | — | — | curve y=14.719, 0.281, 0.66 |
| `store` | 0.233 | J | 0.250 | 0 | 38 | 18 | 48 | 50 | 1.00 | 100 | run y=3.25, 0.250, 8.75 |
| `store-2` | 0.260 | J | 0.282 | 0 | 35 | 22 | 52 | 53 | 0.98 | 87 | run x=5.625, 0.375, 2.75 |
| `sun` | 0.411 | D | 0.750 | 50 | 60 | 8 | 20 | 100 | 0.63 | 0 | run x=7.375, 0.375, 1.25 |
| `table` | 0.322 | J | 0.335 | 0 | 13 | 14 | 30 | 37 | 0.94 | 83 | run x=7.375, 0.375, 10.75 |
| `table-2` | 0.334 | J | 0.352 | 0 | 15 | 12 | 28 | 42 | 0.92 | 80 | run x=7.375, 0.375, 10.75 |
| `target` | 0.209 | A | — | — | 100 | 0 | 30 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `target-2` | 0.443 | J | 0.750 | 0 | 81 | 8 | 26 | 100 | 0.63 | 0 | run y=7.375, 0.375, 2.50 |
| `target-3` | 0.435 | J | 0.750 | 0 | 80 | 8 | 26 | 100 | 0.63 | 0 | run y=7.375, 0.375, 2.00 |
| `text` | 0.427 | J | 0.453 | 0 | 7 | 10 | 14 | 56 | 0.85 | 59 | run x=7.375, 0.375, 10.75 |
| `text-2` | 0.447 | J | 0.447 | 0 | 0 | 6 | 6 | 60 | 0.85 | 61 | run y=7.375, 0.375, 10.75 |
| `text-3` | 0.373 | J | 0.373 | 0 | 0 | 6 | 6 | 47 | 0.91 | 75 | run x=7.375, 0.375, 7.00 |
| `text-4` | 0.427 | J | 0.453 | 0 | 7 | 10 | 14 | 56 | 0.85 | 59 | run x=7.375, 0.375, 10.75 |
| `thumbs-up` | 0.267 | J | 0.286 | 17 | 39 | 16 | 54 | 61 | 0.98 | 93 | run x=9.475, 0.475, 1.63 |
| `thumbs-up-2` | 0.238 | J | 0.250 | 10 | 31 | 14 | 41 | 47 | 1.00 | 100 | curve y=7.25, 0.250, 1.38 |
| `toggle-on` | 0.237 | J | 0.250 | 0 | 73 | 4 | 22 | 76 | 1.00 | 100 | run y=5.25, 0.250, 6.00 |
| `toggle-on-2` | 0.233 | J | 0.250 | 0 | 88 | 4 | 22 | 92 | 1.00 | 100 | curve y=11.75, 0.250, 2.75 |
| `trash` | 0.254 | J | 0.281 | 37 | 14 | 12 | 24 | 64 | 0.98 | 94 | run x=7.375, 0.375, 1.50 |
| `trash-5` | 0.250 | J | 0.250 | 27 | 18 | 10 | 28 | 60 | 1.00 | 100 | curve y=9.375, 0.375, 1.26 |
| `upload` | 0.411 | J | 0.469 | 31 | 18 | 8 | 17 | 76 | 0.84 | 56 | run x=7.375, 0.375, 8.00 |
| `upload-2` | 0.391 | J | 0.449 | 33 | 18 | 8 | 17 | 75 | 0.85 | 60 | run x=7.375, 0.375, 6.75 |
| `upload-3` | 0.398 | J | 0.448 | 29 | 17 | 8 | 17 | 73 | 0.85 | 60 | run x=7.375, 0.375, 8.00 |
| `user` | 0.376 | J | 0.250 | 0 | 77 | 6 | 34 | 83 | 1.00 | 100 | curve y=7.5, 0.500, 1.59 |
| `user-2` | 0.354 | J | 0.250 | — | 82 | 2 | 26 | 87 | 1.00 | 100 | curve y=8.5, 0.500, 3.18 |
| `user-3` | 0.230 | J | 0.250 | 0 | 73 | 6 | 26 | 80 | 1.00 | 100 | run y=10.25, 0.250, 3.75 |
| `user-4` | 0.217 | A | — | — | 100 | 0 | 12 | 100 | — | — | curve y=6.75, 0.250, 1.89 |
| `users` | 0.397 | J | 0.393 | 0 | 83 | 4 | 42 | 93 | 0.93 | 71 | run y=9.5, 0.500, 2.00 |
| `users-2` | 0.357 | J | 0.250 | 0 | 88 | 2 | 32 | 92 | 1.00 | 100 | curve x=8.5, 0.500, 1.13 |
| `users-2-behind` | 0.424 | J | 0.250 | 0 | 89 | 2 | 42 | 93 | 1.00 | 100 | curve x=8.5, 0.500, 1.13 |
| `users-2-level` | 0.334 | J | 0.250 | 0 | 83 | 4 | 46 | 87 | 1.00 | 100 | curve y=7.5, 0.500, 2.14 |
| `users-2-wide` | 0.270 | J | 0.250 | 0 | 83 | 4 | 50 | 89 | 1.00 | 100 | curve y=7.5, 0.500, 2.02 |
| `users-3` | 0.351 | J | 0.250 | 0 | 82 | 8 | 36 | 93 | 1.00 | 100 | curve x=8.5, 0.500, 1.13 |
| `users-3-behind` | 0.385 | J | 0.250 | 0 | 72 | 10 | 46 | 83 | 1.00 | 100 | curve x=8.5, 0.500, 1.13 |
| `users-3-level` | 0.213 | J | 0.250 | 0 | 77 | 10 | 42 | 93 | 1.00 | 100 | run y=10.25, 0.250, 2.75 |
| `users-3-wide` | 0.211 | J | 0.250 | 0 | 80 | 10 | 46 | 93 | 1.00 | 100 | run y=10.25, 0.250, 2.75 |
| `users-4` | 0.401 | A | — | — | 100 | 0 | 20 | 100 | — | — | curve y=10.5, 0.500, 2.94 |
| `users-4-behind` | 0.217 | A | — | — | 100 | 0 | 12 | 100 | — | — | curve y=6.75, 0.250, 1.89 |
| `users-4-level` | 0.305 | A | — | — | 100 | 0 | 20 | 100 | — | — | curve x=12.5, 0.500, 1.13 |
| `users-4-wide` | 0.405 | A | — | — | 100 | 0 | 26 | 100 | — | — | curve y=8.5, 0.500, 2.25 |
| `users-behind` | 0.362 | J | 0.250 | 0 | 86 | 4 | 50 | 91 | 1.00 | 100 | curve y=8.5, 0.500, 1.42 |
| `users-level` | 0.324 | J | 0.408 | 0 | 72 | 8 | 52 | 88 | 0.92 | 68 | run y=8.5, 0.500, 2.00 |
| `users-wide` | 0.305 | J | 0.314 | 0 | 72 | 8 | 56 | 85 | 0.97 | 87 | curve y=7.5, 0.500, 2.02 |
| `volume` | 0.268 | J | 0.250 | 26 | 53 | 8 | 26 | 73 | 1.00 | 100 | curve x=11.5, 0.500, 2.89 |
| `volume-low` | 0.273 | J | 0.250 | 26 | 39 | 8 | 24 | 63 | 1.00 | 100 | curve x=11.5, 0.500, 2.89 |
| `volume-minus` | 0.292 | J | 0.359 | 21 | 24 | 10 | 24 | 62 | 0.92 | 78 | run y=7.375, 0.375, 3.75 |
| `volume-none` | 0.207 | J | 0.250 | 26 | 28 | 8 | 22 | 55 | 1.00 | 100 | curve y=9.75, 0.250, 0.98 |
| `volume-off` | 0.207 | D | 0.250 | 60 | 18 | 8 | 22 | 69 | 1.00 | 100 | curve y=9.75, 0.250, 0.98 |
| `volume-plus` | 0.286 | J | 0.339 | 18 | 22 | 12 | 26 | 57 | 0.93 | 82 | run y=7.375, 0.375, 3.75 |
| `volume-x` | 0.207 | D | 0.250 | 53 | 20 | 8 | 22 | 69 | 1.00 | 100 | curve y=9.75, 0.250, 0.98 |
| `wallet` | 0.253 | J | 0.250 | 0 | 35 | 16 | 46 | 48 | 1.00 | 100 | curve x=9.5, 0.500, 2.02 |
| `wallet-2` | 0.260 | J | 0.250 | 0 | 27 | 12 | 34 | 42 | 1.00 | 100 | curve x=9.5, 0.500, 2.02 |
| `wallet-3` | 0.255 | J | 0.250 | 0 | 25 | 10 | 36 | 38 | 1.00 | 100 | curve y=8.625, 0.375, 1.26 |
| `wand` | 0.193 | D | — | 100 | 14 | 0 | 14 | 84 | — | — | curve y=10.375, 0.375, 1.45 |
| `wand-2` | 0.501 | D | — | 100 | 21 | 0 | 14 | 62 | — | — | curve y=7.495, 0.495, 1.08 |
| `wand-3` | 0.500 | D | — | 100 | 16 | 0 | 6 | 73 | — | — | curve y=3.533, 0.467, 1.61 |
| `watch` | 0.198 | D | 0.250 | 84 | 67 | 4 | 24 | 91 | 1.00 | 100 | curve y=10.75, 0.250, 2.36 |
| `watch-2` | 0.237 | J | 0.270 | 0 | 38 | 22 | 54 | 59 | 0.99 | 96 | run y=7.375, 0.375, 1.00 |
| `watch-3` | 0.219 | J | 0.250 | 29 | 34 | 12 | 36 | 55 | 1.00 | 100 | run y=5.25, 0.250, 5.75 |
| `wrench` | 0.166 | D | — | 100 | 37 | 0 | 16 | 96 | — | — | curve x=2.26, 0.260, 0.59 |
| `wrench-2` | 0.166 | D | — | 100 | 42 | 0 | 16 | 96 | — | — | curve x=3.26, 0.260, 0.59 |
| `wrench-3` | 0.204 | D | — | 100 | 45 | 0 | 8 | 100 | — | — | curve x=2.26, 0.260, 0.59 |
| `x` | — | N | — | 100 | 0 | 0 | 0 | 100 | — | — | — |
| `x-circle` | 0.238 | D | — | 100 | 77 | 0 | 12 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `x-circle-small` | 0.238 | D | — | 100 | 79 | 0 | 12 | 100 | — | — | curve y=13.75, 0.250, 3.40 |
| `x-large` | — | N | — | 100 | 0 | 0 | 0 | 100 | — | — | — |
| `x-small` | — | N | — | 100 | 0 | 0 | 0 | 100 | — | — | — |


## Appendix A2. Every filled drawing at 16

Same columns. For filled shapes the straight-run columns (darkest px, solid-run %) cover only the stroke paths; shape (area) edges are scored in the landing score but have no "solid pixel" notion.

| concept | score | judge | straight-only | diagonal % | curve % | run edges | edges | half-tone % | darkest px | solid-run % | worst edge (kind axis=coord, off, ink length px) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `alert-circle-2` | 0.097 | D | 0.240 | 92 | — | 1 | 20 | 31 | — | — | curve x=9.1328, 0.133, 1.36 |
| `alert-circle-3` | 0.197 | J | 0.243 | 0 | — | 4 | 18 | 28 | — | — | curve x=6.5937, 0.406, 1.36 |
| `alert-circle-4` | 0.196 | D | 0.248 | 76 | — | 3 | 18 | 32 | — | — | curve x=6.5937, 0.406, 1.36 |
| `alert-circle` | 0.116 | J | 0.250 | 0 | — | 2 | 16 | 28 | — | — | curve y=8.7863, 0.214, 1.36 |
| `alert-triangle-2` | 0.085 | D | 0.049 | 56 | — | 2 | 19 | 28 | — | — | run y=4.5, 0.500, 0.50 |
| `alert-triangle-3` | 0.269 | J | 0.175 | 43 | — | 5 | 23 | 28 | — | — | curve y=4.5, 0.500, 1.36 |
| `alert-triangle-4` | 0.251 | D | 0.186 | 53 | — | 4 | 21 | 30 | — | — | curve x=6.5, 0.500, 1.36 |
| `alert-triangle` | 0.120 | J | 0.069 | 45 | — | 3 | 21 | 25 | — | — | curve y=4.5, 0.500, 1.36 |
| `archive` | 0.217 | J | 0.245 | 0 | — | 10 | 32 | 27 | — | — | run y=9.5, 0.500, 2.50 |
| `arrow-down-2` | 0.001 | D | 0.000 | 52 | 7 | 2 | 3 | 40 | 1.00 | 100 | curve y=13.9958, 0.004, 2.02 |
| `arrow-down-3` | 0.000 | J | 0.000 | 42 | 7 | 2 | 3 | 33 | 1.00 | 100 | curve y=13.9984, 0.002, 2.02 |
| `arrow-down-4` | 0.509 | D | 0.571 | 59 | 16 | 5 | 11 | 42 | 0.78 | 0 | run x=7.375, 0.375, 4.67 |
| `arrow-down` | 0.001 | J | 0.000 | 39 | 9 | 2 | 3 | 37 | 1.00 | 100 | curve y=13.9958, 0.004, 2.02 |
| `arrow-left-2` | 0.001 | D | 0.000 | 52 | 7 | 2 | 3 | 40 | 1.00 | 100 | curve x=2.0042, 0.004, 2.02 |
| `arrow-left-3` | 0.000 | J | 0.000 | 42 | 7 | 2 | 3 | 33 | 1.00 | 100 | curve x=2.0016, 0.002, 2.02 |
| `arrow-left-4` | 0.509 | D | 0.571 | 59 | 16 | 5 | 11 | 42 | 0.78 | 0 | run y=7.375, 0.375, 4.67 |
| `arrow-left` | 0.001 | J | 0.000 | 39 | 9 | 2 | 3 | 37 | 1.00 | 100 | curve x=2.0042, 0.004, 2.02 |
| `arrow-right-2` | 0.001 | D | 0.000 | 52 | 7 | 2 | 3 | 40 | 1.00 | 100 | curve x=13.9958, 0.004, 2.02 |
| `arrow-right-3` | 0.000 | J | 0.000 | 42 | 7 | 2 | 3 | 33 | 1.00 | 100 | curve x=13.9984, 0.002, 2.02 |
| `arrow-right-4` | 0.509 | D | 0.571 | 59 | 16 | 5 | 11 | 42 | 0.78 | 0 | run y=7.375, 0.375, 4.67 |
| `arrow-right` | 0.001 | J | 0.000 | 39 | 9 | 2 | 3 | 37 | 1.00 | 100 | curve x=13.9958, 0.004, 2.02 |
| `arrow-up-2` | 0.001 | D | 0.000 | 52 | 7 | 2 | 3 | 40 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `arrow-up-3` | 0.000 | J | 0.000 | 42 | 7 | 2 | 3 | 33 | 1.00 | 100 | curve y=2.0016, 0.002, 2.02 |
| `arrow-up-4` | 0.509 | D | 0.571 | 59 | 16 | 5 | 11 | 42 | 0.78 | 0 | run x=7.375, 0.375, 4.67 |
| `arrow-up` | 0.001 | J | 0.000 | 39 | 9 | 2 | 3 | 37 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `arrow-up-right-2` | 0.000 | D | 0.000 | 52 | 7 | 4 | 6 | 41 | 1.00 | 100 | run y=3, 0.000, 5.13 |
| `arrow-up-right-3` | — | N | — | 100 | 6 | 0 | 0 | 63 | — | — | — |
| `arrow-up-right-4` | 0.426 | D | 0.417 | 55 | 16 | 6 | 18 | 41 | 1.00 | 100 | curve x=12.375, 0.375, 1.16 |
| `arrow-up-right-5` | 0.000 | D | 0.000 | 57 | 10 | 4 | 6 | 46 | 1.00 | 100 | run y=4, 0.000, 3.00 |
| `arrow-up-right` | 0.000 | D | 0.000 | 65 | 9 | 4 | 6 | 48 | 1.00 | 100 | run y=3, 0.000, 3.00 |
| `at-sign-2` | 0.007 | J | 0.000 | 0 | 95 | 2 | 30 | 55 | 1.00 | 100 | curve y=12.0445, 0.044, 2.44 |
| `at-sign` | 0.000 | J | 0.000 | 0 | 97 | 2 | 34 | 53 | 1.00 | 100 | curve y=15, 0.000, 3.18 |
| `attachment-2` | 0.121 | J | 0.148 | 0 | 54 | 6 | 18 | 37 | 1.00 | 100 | run x=11.25, 0.250, 4.88 |
| `attachment-3` | 0.341 | D | — | 100 | 44 | 0 | 8 | 62 | — | — | curve x=12.4597, 0.460, 2.37 |
| `attachment-4` | 0.117 | D | — | 100 | 46 | 0 | 8 | 62 | — | — | curve x=12.2184, 0.218, 2.44 |
| `attachment` | 0.000 | J | 0.000 | 0 | 53 | 6 | 18 | 30 | 1.00 | 100 | run x=3, 0.000, 6.00 |
| `ban-2` | 0.052 | D | — | 100 | — | 0 | 10 | 42 | — | — | curve x=12.0971, 0.097, 1.36 |
| `ban-3` | 0.020 | D | — | 100 | — | 0 | 10 | 35 | — | — | curve x=11.0371, 0.037, 1.36 |
| `ban` | 0.000 | D | — | 100 | 76 | 0 | 12 | 58 | — | — | curve y=15, 0.000, 3.75 |
| `bell-2` | 0.252 | J | 0.500 | — | 100 | 1 | 14 | 27 | — | — | curve y=11.25, 0.250, 1.16 |
| `bell-3` | 0.595 | J | 0.500 | — | 100 | 1 | 10 | 28 | — | — | curve x=12.5, 0.500, 1.51 |
| `bell` | 0.308 | J | 0.500 | — | 100 | 1 | 10 | 29 | — | — | curve y=13.7498, 0.250, 1.37 |
| `bold` | 0.175 | J | 0.189 | 0 | — | 9 | 23 | 27 | — | — | run y=8.5, 0.500, 2.00 |
| `book-2` | 0.190 | J | 0.169 | 3 | — | 10 | 35 | 24 | — | — | curve y=7.2893, 0.289, 0.59 |
| `book-3` | 0.128 | J | 0.117 | 0 | — | 9 | 33 | 13 | — | — | run y=5.5, 0.500, 2.50 |
| `book-4` | 0.207 | J | 0.232 | 0 | — | 8 | 24 | 26 | — | — | run x=5.625, 0.375, 13.00 |
| `book` | 0.202 | J | 0.193 | 0 | — | 10 | 34 | 26 | — | — | curve y=10.5, 0.500, 0.59 |
| `book-open-2` | 0.017 | J | 0.000 | 0 | — | 8 | 22 | 15 | — | — | curve y=10.75, 0.250, 0.72 |
| `book-open` | 0.000 | J | 0.000 | 0 | — | 8 | 24 | 16 | — | — | run x=7, 0.000, 8.35 |
| `briefcase` | 0.289 | J | 0.311 | 0 | 33 | 15 | 46 | 22 | 1.00 | 100 | run y=9.5, 0.500, 5.50 |
| `bug-2` | 0.346 | J | 0.322 | 0 | 72 | 10 | 34 | 43 | 1.00 | 100 | run y=2.5, 0.500, 4.24 |
| `bug` | 0.294 | J | 0.322 | 29 | 0 | 10 | 18 | 44 | 1.00 | 100 | run y=2.5, 0.500, 4.24 |
| `building-2` | 0.210 | J | 0.131 | 0 | — | 12 | 36 | 16 | — | — | run y=5.5, 0.500, 1.50 |
| `building-3` | 0.245 | J | 0.212 | 19 | 7 | 10 | 36 | 15 | 1.00 | 100 | curve y=5.5, 0.500, 1.26 |
| `building-4` | 0.300 | J | 0.279 | 24 | 0 | 9 | 35 | 16 | 1.00 | 100 | run x=11.5, 0.500, 7.75 |
| `building` | 0.192 | J | 0.082 | 0 | — | 8 | 44 | 20 | — | — | run x=7.25, 0.250, 3.63 |
| `calendar-2` | 0.151 | J | 0.155 | 0 | 0 | 10 | 24 | 16 | 1.00 | 100 | run y=8.5, 0.500, 4.75 |
| `calendar-3` | 0.242 | J | 0.257 | 0 | 0 | 10 | 32 | 21 | 1.00 | 100 | run y=8.5, 0.500, 11.00 |
| `calendar` | 0.222 | J | 0.257 | 0 | 0 | 10 | 26 | 18 | 1.00 | 100 | run y=8.5, 0.500, 11.00 |
| `camera-2` | 0.111 | J | 0.000 | 16 | — | 6 | 22 | 20 | — | — | curve y=10.25, 0.250, 2.14 |
| `camera-3` | 0.099 | J | 0.000 | 0 | — | 6 | 28 | 15 | — | — | curve y=11.25, 0.250, 2.14 |
| `camera-4` | 0.120 | J | 0.000 | 0 | — | 5 | 27 | 15 | — | — | curve x=8.375, 0.375, 0.91 |
| `camera-5` | 0.138 | J | 0.000 | 14 | — | 6 | 28 | 19 | — | — | curve y=9.5, 0.500, 1.76 |
| `camera-6` | 0.000 | J | 0.000 | 0 | — | 4 | 24 | 8 | — | — | run y=2, 0.000, 9.75 |
| `camera` | 0.138 | J | 0.000 | 14 | — | 6 | 28 | 19 | — | — | curve y=9.5, 0.500, 1.76 |
| `cart-2` | 0.248 | J | 0.305 | 21 | 19 | 10 | 34 | 30 | 1.00 | 100 | run y=7.5, 0.500, 8.38 |
| `cart-3` | 0.218 | J | 0.289 | 25 | 21 | 9 | 31 | 32 | 1.00 | 100 | run y=7.5, 0.500, 6.70 |
| `cart-4` | 0.065 | J | 0.084 | 4 | 21 | 8 | 30 | 22 | 1.00 | 100 | run x=5.25, 0.250, 4.75 |
| `cart-5` | 0.190 | J | 0.252 | 21 | 21 | 11 | 37 | 46 | 1.00 | 100 | run y=5.75, 0.250, 9.75 |
| `cart` | 0.244 | J | 0.306 | 24 | 21 | 9 | 33 | 32 | 1.00 | 100 | run y=7.5, 0.500, 7.56 |
| `cash` | 0.230 | J | 0.217 | 0 | 0 | 6 | 20 | 15 | 1.00 | 100 | curve y=8.5, 0.500, 1.36 |
| `chart-bar-2` | 0.000 | J | 0.000 | 0 | 0 | 8 | 8 | 28 | 1.00 | 100 | run y=12, 0.000, 10.00 |
| `chart-bar-3` | 0.000 | J | 0.000 | 0 | 6 | 8 | 10 | 22 | 1.00 | 100 | run x=2, 0.000, 9.00 |
| `chart-bar-4` | 0.362 | J | 0.452 | 0 | — | 12 | 36 | 26 | — | — | run x=9.5, 0.500, 9.50 |
| `chart-bar-5` | 0.202 | J | 0.159 | 0 | — | 8 | 28 | 16 | — | — | run x=10.5, 0.500, 5.00 |
| `chart-bar` | 0.000 | J | 0.000 | 0 | 0 | 6 | 6 | 18 | 1.00 | 100 | run x=7, 0.000, 10.00 |
| `chart-pie-2` | 0.350 | J | 0.500 | 0 | — | 4 | 24 | 26 | — | — | run x=8.75, 0.250, 5.00 |
| `chart-pie-3` | 0.457 | J | 0.502 | 0 | — | 6 | 24 | 32 | — | — | run x=6.5, 0.500, 6.01 |
| `chart-pie` | 0.418 | J | 0.524 | 0 | — | 4 | 20 | 30 | — | — | run y=9.5, 0.500, 6.88 |
| `check-2` | 0.798 | D | — | 100 | 11 | 0 | 1 | 67 | — | — | curve y=12.6008, 0.399, 2.02 |
| `check-2-small` | 0.298 | D | — | 100 | 14 | 0 | 1 | 68 | — | — | curve y=11.8508, 0.149, 2.02 |
| `check-3` | 0.049 | D | — | 100 | 12 | 0 | 1 | 68 | — | — | curve y=13.0244, 0.024, 2.02 |
| `check-3-small` | 0.051 | D | — | 100 | 15 | 0 | 1 | 67 | — | — | curve y=12.0255, 0.025, 2.02 |
| `check-4` | 0.124 | D | — | 100 | 11 | 0 | 1 | 67 | — | — | curve y=13.0619, 0.062, 2.02 |
| `check-4-small` | 0.121 | D | — | 100 | 14 | 0 | 1 | 70 | — | — | curve y=12.0607, 0.061, 2.02 |
| `check-circle-3` | 0.196 | D | — | 100 | — | 0 | 11 | 33 | — | — | curve y=5.4917, 0.492, 1.26 |
| `check-circle-3-small` | 0.174 | D | — | 100 | — | 0 | 11 | 32 | — | — | curve y=7.5995, 0.401, 1.26 |
| `check-circle-4` | 0.149 | D | — | 100 | — | 0 | 11 | 32 | — | — | curve y=5.4617, 0.462, 1.26 |
| `check-circle-4-small` | 0.154 | D | — | 100 | — | 0 | 11 | 32 | — | — | curve x=10.6875, 0.313, 1.26 |
| `check-circle` | 0.203 | D | — | 100 | — | 0 | 11 | 34 | — | — | curve y=7.5987, 0.401, 1.26 |
| `check-circle-small` | 0.099 | D | — | 100 | — | 0 | 11 | 30 | — | — | curve y=7.5687, 0.431, 1.26 |
| `check` | 0.202 | D | — | 100 | 11 | 0 | 1 | 67 | — | — | curve y=12.1008, 0.101, 2.02 |
| `check-small` | 0.798 | D | — | 100 | 14 | 0 | 1 | 68 | — | — | curve y=11.6008, 0.399, 2.02 |
| `checkbox-2` | 0.104 | J | 0.000 | 28 | — | 4 | 17 | 17 | — | — | curve y=7.5134, 0.487, 1.26 |
| `checkbox-3` | 0.067 | J | 0.000 | 28 | — | 4 | 17 | 18 | — | — | curve y=5.29, 0.290, 1.26 |
| `checkbox-4` | 0.047 | J | 0.000 | 22 | — | 4 | 17 | 14 | — | — | curve y=7.5687, 0.431, 1.26 |
| `checkbox` | 0.088 | J | 0.000 | 26 | — | 4 | 17 | 17 | — | — | curve y=7.5577, 0.442, 1.26 |
| `chevron-down-2` | 0.300 | D | — | 100 | 20 | 0 | 2 | 70 | — | — | curve y=10.8499, 0.150, 2.47 |
| `chevron-down-2-large` | 0.573 | D | — | 100 | 17 | 0 | 2 | 75 | — | — | curve y=11.2863, 0.286, 2.47 |
| `chevron-down-2-small` | 0.927 | D | — | 100 | 26 | 0 | 2 | 63 | — | — | curve y=10.5367, 0.463, 2.47 |
| `chevron-down-3` | 0.319 | D | — | 100 | 15 | 0 | 2 | 66 | — | — | curve y=11.8403, 0.160, 2.04 |
| `chevron-down-3-large` | 0.886 | D | — | 100 | 12 | 0 | 2 | 61 | — | — | curve y=12.5569, 0.443, 2.05 |
| `chevron-down-3-small` | 0.287 | D | — | 100 | 19 | 0 | 2 | 74 | — | — | curve y=11.1438, 0.144, 2.04 |
| `chevron-down` | 0.442 | D | — | 100 | 18 | 0 | 2 | 62 | — | — | curve y=11.2208, 0.221, 2.19 |
| `chevron-down-large` | 0.418 | D | — | 100 | 15 | 0 | 2 | 68 | — | — | curve y=11.7908, 0.209, 2.19 |
| `chevron-down-small` | 0.658 | D | — | 100 | 24 | 0 | 2 | 70 | — | — | curve y=10.6708, 0.329, 2.19 |
| `chevron-left-2` | 0.300 | D | — | 100 | 20 | 0 | 2 | 70 | — | — | curve x=5.1501, 0.150, 2.47 |
| `chevron-left-2-large` | 0.573 | D | — | 100 | 17 | 0 | 2 | 75 | — | — | curve x=4.7137, 0.286, 2.47 |
| `chevron-left-2-small` | 0.907 | D | — | 100 | 26 | 0 | 2 | 63 | — | — | curve x=5.4533, 0.453, 2.47 |
| `chevron-left-3` | 0.259 | D | — | 100 | 15 | 0 | 2 | 66 | — | — | curve x=4.1297, 0.130, 2.04 |
| `chevron-left-3-large` | 0.806 | D | — | 100 | 12 | 0 | 2 | 61 | — | — | curve x=3.4031, 0.403, 2.05 |
| `chevron-left-3-small` | 0.347 | D | — | 100 | 19 | 0 | 2 | 74 | — | — | curve x=4.8262, 0.174, 2.04 |
| `chevron-left` | 0.442 | D | — | 100 | 18 | 0 | 2 | 62 | — | — | curve x=4.7792, 0.221, 2.19 |
| `chevron-left-large` | 0.418 | D | — | 100 | 15 | 0 | 2 | 68 | — | — | curve x=4.2092, 0.209, 2.19 |
| `chevron-left-small` | 0.658 | D | — | 100 | 24 | 0 | 2 | 70 | — | — | curve x=5.3292, 0.329, 2.19 |
| `chevron-right-2` | 0.300 | D | — | 100 | 20 | 0 | 2 | 70 | — | — | curve x=10.8499, 0.150, 2.47 |
| `chevron-right-2-large` | 0.573 | D | — | 100 | 17 | 0 | 2 | 75 | — | — | curve x=11.2863, 0.286, 2.47 |
| `chevron-right-2-small` | 0.907 | D | — | 100 | 26 | 0 | 2 | 63 | — | — | curve x=10.5467, 0.453, 2.47 |
| `chevron-right-3` | 0.259 | D | — | 100 | 15 | 0 | 2 | 66 | — | — | curve x=11.8703, 0.130, 2.04 |
| `chevron-right-3-large` | 0.806 | D | — | 100 | 12 | 0 | 2 | 61 | — | — | curve x=12.5969, 0.403, 2.05 |
| `chevron-right-3-small` | 0.347 | D | — | 100 | 19 | 0 | 2 | 74 | — | — | curve x=11.1738, 0.174, 2.04 |
| `chevron-right` | 0.442 | D | — | 100 | 18 | 0 | 2 | 62 | — | — | curve x=11.2208, 0.221, 2.19 |
| `chevron-right-large` | 0.418 | D | — | 100 | 15 | 0 | 2 | 68 | — | — | curve x=11.7908, 0.209, 2.19 |
| `chevron-right-small` | 0.658 | D | — | 100 | 24 | 0 | 2 | 70 | — | — | curve x=10.6708, 0.329, 2.19 |
| `chevron-up-2` | 0.520 | D | — | 100 | 20 | 0 | 2 | 62 | — | — | curve y=5.2601, 0.260, 2.47 |
| `chevron-up-2-large` | 0.313 | D | — | 100 | 17 | 0 | 2 | 62 | — | — | curve y=4.8437, 0.156, 2.47 |
| `chevron-up-2-small` | 0.873 | D | — | 100 | 26 | 0 | 2 | 63 | — | — | curve y=5.5633, 0.437, 2.47 |
| `chevron-up-3` | 0.259 | D | — | 100 | 15 | 0 | 2 | 66 | — | — | curve y=4.1297, 0.130, 2.04 |
| `chevron-up-3-large` | 0.806 | D | — | 100 | 12 | 0 | 2 | 61 | — | — | curve y=3.4031, 0.403, 2.05 |
| `chevron-up-3-small` | 0.347 | D | — | 100 | 19 | 0 | 2 | 74 | — | — | curve y=4.8262, 0.174, 2.04 |
| `chevron-up` | 0.442 | D | — | 100 | 18 | 0 | 2 | 62 | — | — | curve y=4.7792, 0.221, 2.19 |
| `chevron-up-large` | 0.418 | D | — | 100 | 15 | 0 | 2 | 68 | — | — | curve y=4.2092, 0.209, 2.19 |
| `chevron-up-small` | 0.658 | D | — | 100 | 24 | 0 | 2 | 70 | — | — | curve y=5.3292, 0.329, 2.19 |
| `chevrons-up-down-2` | 0.368 | D | — | 100 | 24 | 0 | 4 | 71 | — | — | curve y=4.1842, 0.184, 0.55 |
| `chevrons-up-down-3` | 0.347 | D | — | 100 | 26 | 0 | 4 | 63 | — | — | curve y=2.1733, 0.173, 2.47 |
| `chevrons-up-down-4` | 0.847 | D | — | 100 | 26 | 0 | 4 | 73 | — | — | curve y=2.4233, 0.423, 2.47 |
| `chevrons-up-down` | 0.618 | D | — | 100 | 24 | 0 | 4 | 71 | — | — | curve y=4.3092, 0.309, 0.55 |
| `clipboard-2` | 0.212 | J | 0.133 | 0 | 72 | 13 | 42 | 14 | 0.88 | 50 | curve x=10.5, 0.500, 1.13 |
| `clipboard-3` | 0.143 | J | 0.162 | 0 | 41 | 16 | 44 | 12 | 1.00 | 100 | run y=5.75, 0.250, 2.75 |
| `clipboard-4` | 0.252 | J | 0.238 | 0 | 47 | 16 | 44 | 15 | 0.88 | 50 | run x=10.5, 0.500, 1.75 |
| `clipboard` | 0.237 | J | 0.218 | 0 | 47 | 16 | 44 | 13 | 0.88 | 50 | run x=10.5, 0.500, 1.75 |
| `clock` | 0.148 | J | 0.240 | 39 | — | 2 | 13 | 31 | — | — | curve x=10.3271, 0.327, 1.36 |
| `code-2` | 0.018 | D | — | 100 | 34 | 0 | 4 | 66 | — | — | curve x=13.9913, 0.009, 2.27 |
| `code` | 0.018 | D | — | 100 | 28 | 0 | 4 | 60 | — | — | curve x=13.9913, 0.009, 2.27 |
| `compass-2` | 0.317 | D | — | 100 | 100 | 0 | 16 | 86 | — | — | curve x=5.3357, 0.336, 1.61 |
| `compass-3` | 0.241 | D | — | 100 | — | 0 | 10 | 42 | — | — | curve x=4.3783, 0.378, 1.76 |
| `compass` | 0.223 | D | — | 100 | — | 0 | 10 | 37 | — | — | curve y=11.3713, 0.371, 1.61 |
| `compose-2` | 0.128 | D | 0.111 | 53 | — | 8 | 24 | 32 | — | — | run x=5.5, 0.500, 1.63 |
| `compose-3` | 0.103 | D | 0.000 | 60 | — | 4 | 18 | 32 | — | — | curve y=10.4996, 0.500, 1.61 |
| `compose-4` | 0.124 | D | 0.111 | 52 | — | 8 | 25 | 32 | — | — | run x=5.5, 0.500, 1.63 |
| `compose` | 0.232 | D | 0.153 | 59 | — | 8 | 24 | 49 | — | — | run y=12.5, 0.500, 1.63 |
| `copy-2` | 0.251 | J | 0.250 | 0 | — | 8 | 26 | 19 | — | — | run x=4.5, 0.500, 6.75 |
| `copy-3` | 0.195 | J | 0.138 | 0 | — | 8 | 26 | 15 | — | — | run y=3.5, 0.500, 3.75 |
| `copy` | 0.251 | J | 0.250 | 0 | — | 8 | 26 | 21 | — | — | run x=3.5, 0.500, 3.75 |
| `credit-card-2` | 0.257 | J | 0.275 | 0 | — | 8 | 30 | 20 | — | — | run y=7.5, 0.500, 13.00 |
| `credit-card-3` | 0.277 | J | 0.269 | 0 | — | 8 | 36 | 21 | — | — | run y=7.5, 0.500, 13.00 |
| `credit-card` | 0.257 | J | 0.275 | 0 | — | 8 | 30 | 20 | — | — | run y=7.5, 0.500, 13.00 |
| `cursor-2` | 0.318 | D | — | 100 | — | 0 | 6 | 31 | — | — | curve y=12.477, 0.477, 1.61 |
| `cursor-3` | 0.001 | D | — | 100 | — | 0 | 4 | 28 | — | — | curve x=2.0007, 0.001, 1.61 |
| `cursor-click` | 0.500 | D | 0.500 | 84 | 0 | 4 | 8 | 53 | 0.88 | 0 | curve x=6.5003, 0.500, 1.61 |
| `cursor` | 0.116 | D | — | 100 | — | 0 | 6 | 33 | — | — | curve y=11.8266, 0.173, 1.61 |
| `database-2` | 0.276 | J | 0.000 | 0 | — | 2 | 20 | 34 | — | — | curve x=11.5004, 0.500, 1.26 |
| `database-3` | 0.332 | J | 0.000 | 0 | — | 2 | 20 | 42 | — | — | curve x=3.5149, 0.485, 1.26 |
| `database` | 0.311 | J | 0.000 | 0 | — | 2 | 20 | 35 | — | — | curve x=4.5214, 0.479, 1.26 |
| `desktop-2` | 0.051 | J | 0.062 | 0 | 0 | 6 | 14 | 9 | 1.00 | 100 | run y=12.75, 0.250, 4.75 |
| `desktop-3` | 0.271 | J | 0.307 | 0 | 0 | 10 | 26 | 20 | 0.85 | 61 | run y=6.5, 0.500, 13.00 |
| `desktop-4` | 0.141 | J | 0.170 | 0 | 0 | 8 | 16 | 13 | 0.85 | 61 | run x=7.375, 0.375, 3.00 |
| `desktop-5` | 0.147 | J | 0.173 | 0 | 0 | 8 | 16 | 10 | 0.83 | 54 | run x=7.375, 0.375, 4.00 |
| `desktop-6` | 0.081 | J | 0.087 | 0 | — | 10 | 28 | 8 | — | — | run y=10.375, 0.375, 4.00 |
| `desktop` | 0.130 | J | 0.154 | 0 | 0 | 8 | 16 | 10 | 0.85 | 61 | run x=7.375, 0.375, 3.00 |
| `export` | 0.332 | J | 0.398 | 25 | 6 | 9 | 25 | 56 | 0.63 | 0 | curve y=12.453, 0.453, 2.12 |
| `external-link-2` | 0.127 | J | 0.152 | 33 | 6 | 8 | 20 | 38 | 1.00 | 100 | run y=3.25, 0.250, 4.13 |
| `external-link` | 0.116 | J | 0.133 | 35 | 6 | 8 | 20 | 37 | 1.00 | 100 | run y=3.25, 0.250, 4.13 |
| `eye` | 0.243 | A | — | — | — | 0 | 20 | 46 | — | — | curve y=10.375, 0.375, 2.20 |
| `face-neutral` | 0.400 | J | 0.750 | 0 | — | 6 | 30 | 40 | — | — | run y=11.5, 0.500, 4.75 |
| `face-sad` | 0.371 | J | 0.750 | 0 | — | 4 | 28 | 41 | — | — | run x=5.5, 0.500, 1.25 |
| `face-smile` | 0.308 | J | 0.750 | 0 | — | 4 | 28 | 45 | — | — | run x=5.5, 0.500, 1.25 |
| `file` | 0.211 | J | 0.189 | 10 | — | 8 | 24 | 13 | — | — | run x=7.5, 0.500, 3.25 |
| `file-text-2` | 0.269 | J | 0.241 | 9 | — | 12 | 40 | 26 | — | — | run x=7.5, 0.500, 3.25 |
| `file-text` | 0.240 | J | 0.228 | 9 | — | 10 | 32 | 16 | — | — | run x=7.5, 0.500, 3.25 |
| `files-2` | 0.273 | J | 0.219 | 26 | — | 10 | 33 | 31 | — | — | run x=11.5, 0.500, 2.25 |
| `files-3` | 0.255 | J | 0.244 | 7 | — | 10 | 33 | 30 | — | — | run x=4.5, 0.500, 3.75 |
| `files-4` | 0.310 | J | 0.298 | 6 | — | 10 | 34 | 18 | — | — | run x=3.5, 0.500, 9.75 |
| `files-5` | 0.284 | J | 0.234 | 6 | — | 10 | 33 | 29 | — | — | run x=4.5, 0.500, 3.75 |
| `files` | 0.284 | J | 0.234 | 6 | — | 10 | 33 | 29 | — | — | run x=4.5, 0.500, 3.75 |
| `filter-2` | 0.667 | J | 0.667 | 0 | 0 | 6 | 6 | 47 | 1.00 | 100 | run y=2.5, 0.500, 10.00 |
| `filter-3` | 0.172 | J | 0.220 | 20 | — | 4 | 16 | 16 | — | — | run x=10.25, 0.250, 3.84 |
| `filter-4` | 0.193 | J | 0.224 | 32 | — | 3 | 11 | 21 | — | — | curve x=5.75, 0.250, 0.98 |
| `filter` | 0.200 | J | 0.229 | 18 | — | 4 | 12 | 18 | — | — | run x=10.25, 0.250, 4.55 |
| `flag-2` | 0.288 | J | 0.323 | 0 | 0 | 4 | 16 | 22 | 1.00 | 100 | run x=3.625, 0.375, 7.75 |
| `flag-3` | 0.334 | J | 0.323 | 0 | 0 | 4 | 10 | 20 | 1.00 | 100 | run x=3.625, 0.375, 7.75 |
| `flag-4` | 0.328 | J | 0.345 | 9 | 0 | 8 | 16 | 12 | 1.00 | 100 | run y=8.5, 0.500, 3.13 |
| `flag` | 0.230 | J | 0.259 | 15 | 0 | 5 | 9 | 13 | 1.00 | 100 | run x=3.625, 0.375, 9.00 |
| `folder-2` | 0.088 | J | 0.105 | 22 | — | 8 | 22 | 12 | — | — | run y=7.5, 0.500, 3.34 |
| `folder-3` | 0.041 | J | 0.000 | 22 | — | 5 | 18 | 11 | — | — | curve y=7.5, 0.500, 0.63 |
| `folder` | 0.000 | J | 0.000 | 6 | — | 5 | 13 | 7 | — | — | run y=14, 0.000, 9.50 |
| `gauge` | 0.242 | D | — | 100 | 91 | 0 | 18 | 58 | — | — | curve y=11.5, 0.500, 1.76 |
| `gear-2` | 0.795 | D | — | 100 | — | 0 | 10 | 34 | — | — | curve y=10.5, 0.500, 2.25 |
| `gear-3` | 0.556 | D | 0.750 | 80 | 0 | 4 | 46 | 76 | 0.63 | 0 | curve y=2.491, 0.491, 0.49 |
| `gear` | 0.627 | D | — | 67 | — | 0 | 18 | 36 | — | — | curve x=14.562, 0.438, 0.49 |
| `globe-2` | 0.547 | A | — | — | — | 0 | 20 | 83 | — | — | curve x=6.381, 0.381, 5.97 |
| `globe` | 0.167 | J | 0.250 | 0 | — | 6 | 16 | 57 | — | — | curve y=13.4088, 0.409, 1.04 |
| `grid-2` | 0.277 | J | 0.309 | 0 | — | 16 | 48 | 17 | — | — | run x=7.25, 0.250, 4.25 |
| `grid-3` | 0.367 | A | — | — | 100 | 0 | 54 | 73 | — | — | curve y=9.45, 0.450, 1.73 |
| `grid-4` | 0.333 | J | 0.333 | 0 | 0 | 72 | 72 | 56 | 1.00 | 100 | run x=7.5, 0.500, 1.00 |
| `grid-5` | 0.250 | J | 0.250 | 0 | — | 12 | 42 | 48 | — | — | curve y=6.75, 0.250, 2.20 |
| `grid-6` | 0.238 | J | 0.259 | 0 | — | 12 | 36 | 16 | — | — | run x=7.5, 0.500, 4.25 |
| `grid-7` | 0.000 | J | 0.000 | 0 | — | 16 | 48 | 44 | — | — | run y=2, 0.000, 2.25 |
| `grid` | 0.250 | J | 0.250 | 0 | — | 16 | 48 | 47 | — | — | run x=6.75, 0.250, 2.00 |
| `hash-2` | 0.750 | D | 0.750 | 50 | 0 | 4 | 4 | 53 | 1.00 | 100 | run y=4.625, 0.375, 10.00 |
| `hash-3` | 0.750 | D | 0.750 | 52 | 0 | 4 | 4 | 51 | 1.00 | 100 | run y=4.625, 0.375, 9.25 |
| `hash` | 0.750 | J | 0.750 | 0 | 0 | 8 | 8 | 53 | 1.00 | 100 | run x=4.625, 0.375, 10.00 |
| `heart-2` | 0.000 | D | 0.000 | 77 | — | 4 | 14 | 20 | — | — | curve x=1, 0.000, 0.98 |
| `heart` | 0.000 | D | — | 100 | — | 0 | 6 | 26 | — | — | curve y=14, 0.000, 0.99 |
| `help-2` | 0.212 | A | — | — | — | 0 | 22 | 36 | — | — | curve x=5.5662, 0.434, 1.36 |
| `help-3` | 0.106 | D | — | 100 | — | 0 | 20 | 33 | — | — | curve x=8.3104, 0.310, 1.16 |
| `help-4` | 0.167 | D | 0.250 | 52 | — | 2 | 18 | 35 | — | — | curve y=6.5363, 0.464, 1.36 |
| `help` | 0.212 | A | — | — | — | 0 | 22 | 36 | — | — | curve x=5.5662, 0.434, 1.36 |
| `home-2` | 0.109 | J | 0.133 | 16 | — | 7 | 18 | 15 | — | — | run x=7.25, 0.250, 3.63 |
| `home-3` | 0.107 | J | 0.110 | 19 | — | 5 | 18 | 16 | — | — | run y=11.5, 0.500, 2.50 |
| `home` | 0.288 | J | 0.335 | 21 | — | 9 | 22 | 27 | — | — | run x=12.75, 0.250, 3.66 |
| `image-2` | 0.120 | J | 0.000 | 40 | — | 4 | 27 | 24 | — | — | curve x=2.6182, 0.382, 0.84 |
| `image-3` | 0.070 | J | 0.000 | 46 | — | 4 | 24 | 24 | — | — | curve x=14.3818, 0.382, 0.84 |
| `image` | 0.083 | J | 0.000 | 43 | — | 4 | 22 | 21 | — | — | curve y=13.3818, 0.382, 0.84 |
| `images-2` | 0.249 | J | 0.122 | 37 | — | 8 | 30 | 31 | — | — | run x=12.5, 0.500, 1.75 |
| `images-3` | 0.249 | J | 0.122 | 37 | — | 8 | 30 | 31 | — | — | run y=3.5, 0.500, 1.75 |
| `images-4` | 0.262 | J | 0.184 | 40 | — | 6 | 24 | 28 | — | — | run x=3.5, 0.500, 5.75 |
| `images` | 0.249 | J | 0.122 | 37 | — | 8 | 30 | 31 | — | — | run x=3.5, 0.500, 1.75 |
| `info-2` | 0.259 | J | 0.589 | 0 | — | 4 | 20 | 33 | — | — | run x=7.49, 0.490, 2.12 |
| `info-3` | 0.123 | J | 0.495 | 0 | — | 3 | 20 | 34 | — | — | run y=11.63, 0.370, 2.50 |
| `info` | 0.116 | J | 0.250 | 0 | — | 2 | 16 | 28 | — | — | curve y=7.2137, 0.214, 1.36 |
| `italic` | 0.000 | D | 0.000 | 60 | 0 | 4 | 4 | 45 | 1.00 | 100 | run y=2, 0.000, 3.44 |
| `key-2` | 0.000 | D | — | 100 | 0 | 0 | 12 | 66 | — | — | curve y=14, 0.000, 2.66 |
| `key-3` | 0.000 | D | 0.000 | 83 | 0 | 2 | 14 | 67 | — | — | curve x=2, 0.000, 2.47 |
| `key-4` | 0.000 | D | — | 100 | 0 | 0 | 12 | 60 | — | — | curve y=14, 0.000, 2.66 |
| `key-5` | 0.354 | J | 0.590 | 0 | 0 | 6 | 18 | 62 | 0.74 | 32 | run y=7.375, 0.375, 8.00 |
| `key-6` | 0.354 | J | 0.590 | 0 | 0 | 6 | 18 | 62 | 0.74 | 32 | run x=7.375, 0.375, 8.00 |
| `key` | 0.285 | J | 0.402 | 0 | 0 | 10 | 24 | 37 | 0.74 | 32 | run y=7.375, 0.375, 8.00 |
| `keyboard-2` | 0.589 | J | 0.621 | 0 | 50 | 10 | 52 | 33 | 0.67 | 0 | run y=4.5, 0.500, 9.75 |
| `keyboard` | 0.239 | J | 0.095 | 0 | — | 6 | 44 | 22 | — | — | run y=8.5, 0.500, 3.63 |
| `language-2` | 0.167 | J | 0.250 | 0 | — | 6 | 16 | 57 | — | — | curve y=13.4088, 0.409, 1.04 |
| `language-3` | 0.547 | A | — | — | — | 0 | 20 | 83 | — | — | curve x=6.381, 0.381, 5.97 |
| `language` | 0.268 | J | 0.243 | 48 | 29 | 6 | 7 | 51 | 1.00 | 100 | curve y=7.721, 0.279, 2.02 |
| `layout-footer-2` | 0.224 | J | 0.242 | 0 | 21 | 10 | 22 | 18 | 1.00 | 100 | run y=8.75, 0.250, 12.00 |
| `layout-footer-3` | 0.114 | J | 0.112 | 0 | 27 | 10 | 22 | 11 | 1.00 | 100 | run y=12.75, 0.250, 7.75 |
| `layout-footer-4` | 0.227 | J | 0.250 | 0 | 25 | 10 | 26 | 26 | 1.00 | 100 | run y=9.75, 0.250, 8.75 |
| `layout-footer` | 0.198 | J | 0.229 | 0 | — | 8 | 24 | 13 | — | — | run y=8.5, 0.500, 11.00 |
| `layout-header-2` | 0.224 | J | 0.242 | 0 | 21 | 10 | 22 | 18 | 1.00 | 100 | run y=7.25, 0.250, 12.00 |
| `layout-header-3` | 0.114 | J | 0.112 | 0 | 27 | 10 | 22 | 11 | 1.00 | 100 | run y=3.25, 0.250, 7.75 |
| `layout-header-4` | 0.227 | J | 0.250 | 0 | 25 | 10 | 26 | 26 | 1.00 | 100 | run y=6.25, 0.250, 8.75 |
| `layout-header` | 0.198 | J | 0.229 | 0 | — | 8 | 24 | 13 | — | — | run y=7.5, 0.500, 11.00 |
| `layout-sidebar-2` | 0.224 | J | 0.242 | 0 | 21 | 10 | 22 | 18 | 1.00 | 100 | run x=7.25, 0.250, 12.00 |
| `layout-sidebar-3` | 0.114 | J | 0.112 | 0 | 27 | 10 | 22 | 11 | 1.00 | 100 | run x=3.25, 0.250, 7.75 |
| `layout-sidebar-4` | 0.227 | J | 0.250 | 0 | 25 | 10 | 26 | 26 | 1.00 | 100 | run x=6.25, 0.250, 8.75 |
| `layout-sidebar` | 0.198 | J | 0.229 | 0 | — | 8 | 24 | 13 | — | — | run x=7.5, 0.500, 11.00 |
| `layout-sidebar-right-2` | 0.224 | J | 0.242 | 0 | 21 | 10 | 22 | 18 | 1.00 | 100 | run x=8.75, 0.250, 12.00 |
| `layout-sidebar-right-3` | 0.114 | J | 0.112 | 0 | 27 | 10 | 22 | 11 | 1.00 | 100 | run x=12.75, 0.250, 7.75 |
| `layout-sidebar-right-4` | 0.227 | J | 0.250 | 0 | 25 | 10 | 26 | 26 | 1.00 | 100 | run x=9.75, 0.250, 8.75 |
| `layout-sidebar-right` | 0.198 | J | 0.229 | 0 | — | 8 | 24 | 13 | — | — | run x=8.5, 0.500, 11.00 |
| `lightbulb-2` | 0.344 | J | 0.464 | 0 | 0 | 5 | 13 | 28 | 1.00 | 100 | run y=9.5, 0.500, 6.00 |
| `lightbulb-3` | 0.315 | J | 0.378 | 26 | 0 | 5 | 21 | 30 | 1.00 | 100 | curve y=9.5, 0.500, 0.59 |
| `lightbulb-4` | 0.210 | J | 0.333 | 31 | 0 | 3 | 11 | 24 | 1.00 | 100 | curve y=12.25, 0.250, 0.73 |
| `lightbulb` | 0.207 | J | 0.317 | 31 | 0 | 3 | 11 | 23 | 1.00 | 100 | curve y=12.25, 0.250, 1.40 |
| `link-2` | 0.000 | D | — | 100 | 66 | 0 | 8 | 58 | — | — | curve x=0.9998, 0.000, 3.01 |
| `link-3` | 0.000 | J | 0.000 | 0 | 87 | 2 | 14 | 54 | 1.00 | 100 | run y=7, 0.000, 4.00 |
| `link` | 0.062 | D | — | 100 | 73 | 0 | 12 | 61 | — | — | curve y=4.9055, 0.095, 2.71 |
| `list-bullet-2` | 0.499 | J | 0.667 | 0 | 34 | 6 | 24 | 58 | 1.00 | 100 | run y=2.5, 0.500, 5.50 |
| `list-bullet-3` | 0.500 | J | 0.500 | 0 | 0 | 4 | 16 | 65 | 0.88 | 0 | curve y=6.5, 0.500, 2.14 |
| `list-bullet` | 0.609 | J | 0.667 | 0 | 21 | 6 | 24 | 53 | 1.00 | 100 | run y=2.5, 0.500, 6.00 |
| `list-ordered` | 0.511 | J | 0.532 | 12 | 29 | 10 | 32 | 60 | 1.00 | 100 | run y=2.5, 0.500, 4.50 |
| `lock-2` | 0.098 | J | 0.108 | 0 | 51 | 8 | 28 | 22 | 1.00 | 100 | run x=6.25, 0.250, 3.63 |
| `lock-3` | 0.205 | J | 0.293 | 0 | 61 | 6 | 24 | 37 | 1.00 | 100 | run x=6.25, 0.250, 2.38 |
| `lock-4` | 0.174 | J | 0.162 | 0 | 51 | 10 | 30 | 34 | 1.00 | 100 | run x=6.25, 0.250, 3.63 |
| `lock-5` | 0.132 | J | 0.110 | 0 | 59 | 10 | 30 | 24 | 1.00 | 100 | curve y=8.7496, 0.250, 1.45 |
| `lock-6` | 0.146 | J | 0.139 | 0 | 59 | 10 | 30 | 32 | 1.00 | 100 | curve y=8.7496, 0.250, 1.45 |
| `lock` | 0.157 | J | 0.130 | 0 | 51 | 10 | 30 | 26 | 1.00 | 100 | run x=6.25, 0.250, 3.63 |
| `login-2` | 0.000 | J | 0.000 | 28 | 18 | 8 | 17 | 35 | 1.00 | 100 | curve x=8.9958, 0.004, 2.02 |
| `login-3` | 0.052 | J | 0.000 | 29 | 19 | 8 | 17 | 33 | 1.00 | 100 | curve x=5.5042, 0.496, 2.02 |
| `login-4` | 0.000 | J | 0.000 | 28 | 18 | 8 | 17 | 35 | 1.00 | 100 | curve x=7.0042, 0.004, 2.02 |
| `login` | 0.052 | J | 0.000 | 29 | 19 | 8 | 17 | 33 | 1.00 | 100 | curve x=10.4958, 0.496, 2.02 |
| `logout-2` | 0.000 | J | 0.000 | 28 | 18 | 8 | 17 | 35 | 1.00 | 100 | curve x=13.9958, 0.004, 2.02 |
| `logout-3` | 0.000 | J | 0.000 | 29 | 19 | 8 | 17 | 37 | 1.00 | 100 | curve x=2.0042, 0.004, 2.02 |
| `logout-4` | 0.000 | J | 0.000 | 28 | 18 | 8 | 17 | 35 | 1.00 | 100 | curve x=2.0042, 0.004, 2.02 |
| `logout` | 0.000 | J | 0.000 | 29 | 19 | 8 | 17 | 37 | 1.00 | 100 | curve x=13.9958, 0.004, 2.02 |
| `mail-2` | 0.070 | J | 0.000 | 47 | — | 4 | 16 | 21 | — | — | curve x=1.5163, 0.484, 1.02 |
| `mail-3` | 0.056 | J | 0.000 | 44 | — | 4 | 16 | 19 | — | — | curve x=2.5442, 0.456, 0.93 |
| `mail` | 0.077 | J | 0.000 | 46 | — | 4 | 16 | 22 | — | — | curve x=1.5316, 0.468, 0.95 |
| `map-pin-2` | 0.000 | A | — | — | — | 0 | 9 | 28 | — | — | curve y=1, 0.000, 3.18 |
| `map-pin-3` | 0.321 | D | — | 100 | 100 | 0 | 19 | 51 | — | — | curve x=12.5, 0.500, 1.51 |
| `map-pin-4` | 0.107 | D | — | 100 | — | 0 | 11 | 30 | — | — | curve y=13.553, 0.447, 0.98 |
| `map-pin-5` | 0.474 | J | 0.750 | 0 | 78 | 2 | 14 | 79 | 0.63 | 0 | curve x=10.5, 0.500, 1.13 |
| `map-pin` | 0.151 | D | — | 100 | — | 0 | 11 | 31 | — | — | curve y=14.5, 0.500, 1.28 |
| `maximize-2` | 0.500 | J | 0.500 | 0 | 61 | 16 | 24 | 52 | 1.00 | 100 | curve x=2.75, 0.250, 1.01 |
| `maximize-3` | 0.000 | J | 0.000 | 0 | 34 | 16 | 24 | 59 | 1.00 | 100 | run y=2, 0.000, 1.50 |
| `maximize-4` | 0.000 | J | 0.000 | 41 | 13 | 8 | 12 | 37 | 1.00 | 100 | run y=2, 0.000, 3.00 |
| `maximize-5` | 0.474 | J | 0.483 | 0 | 49 | 20 | 44 | 54 | 1.00 | 100 | run y=5.5, 0.500, 2.25 |
| `maximize` | 0.000 | J | 0.000 | 0 | 50 | 16 | 32 | 51 | 1.00 | 100 | curve x=2, 0.000, 1.04 |
| `megaphone-2` | 0.150 | J | 0.160 | 36 | 40 | 10 | 24 | 23 | 0.89 | 58 | run x=3.5, 0.500, 2.00 |
| `megaphone-3` | 0.225 | J | 0.301 | 34 | 58 | 6 | 14 | 39 | 0.75 | 0 | run x=4.5, 0.500, 4.00 |
| `megaphone` | 0.454 | D | — | 100 | 0 | 0 | 4 | 38 | — | — | curve y=13.5579, 0.442, 1.83 |
| `menu-2` | 0.444 | J | 0.444 | 0 | 0 | 6 | 6 | 38 | 1.00 | 100 | run y=2.5, 0.500, 4.00 |
| `menu-3` | 0.000 | J | 0.000 | 0 | 0 | 4 | 4 | 18 | 1.00 | 100 | run y=4, 0.000, 10.00 |
| `menu-4` | 0.500 | J | 0.500 | 0 | 0 | 4 | 4 | 57 | 1.00 | 100 | run y=3.25, 0.250, 10.00 |
| `menu-arrow-left` | 0.629 | J | 0.667 | 11 | 8 | 6 | 7 | 55 | 1.00 | 100 | run y=2.5, 0.500, 5.50 |
| `menu-arrow-right` | 0.629 | J | 0.667 | 11 | 8 | 6 | 7 | 55 | 1.00 | 100 | run y=2.5, 0.500, 5.50 |
| `menu` | 0.667 | J | 0.667 | 0 | 0 | 6 | 6 | 42 | 1.00 | 100 | run y=2.5, 0.500, 10.00 |
| `message-2` | 0.099 | J | 0.065 | 18 | — | 5 | 17 | 11 | — | — | run x=4.5, 0.500, 1.38 |
| `message-3` | 0.000 | J | 0.000 | 0 | — | 2 | 10 | 17 | — | — | run y=15, 0.000, 5.38 |
| `message-4` | 0.207 | J | 0.195 | 6 | — | 8 | 32 | 26 | — | — | curve x=4.5, 0.500, 0.29 |
| `message-5` | 0.000 | J | 0.000 | 0 | — | 2 | 8 | 20 | — | — | curve x=14.9998, 0.000, 3.75 |
| `message-6` | 0.033 | J | 0.034 | 26 | — | 3 | 15 | 16 | — | — | curve x=4.875, 0.125, 1.61 |
| `message-7` | 0.095 | J | 0.087 | 27 | — | 4 | 16 | 14 | — | — | curve x=5.625, 0.375, 1.61 |
| `message` | 0.000 | J | 0.000 | 17 | — | 4 | 12 | 9 | — | — | curve y=14.0002, 0.000, 1.61 |
| `microphone-2` | 0.223 | J | 0.290 | 0 | 62 | 10 | 22 | 58 | 0.87 | 65 | run x=7.375, 0.375, 3.00 |
| `microphone-3` | 0.223 | J | 0.290 | 0 | 62 | 8 | 20 | 55 | 0.87 | 65 | run x=7.375, 0.375, 3.00 |
| `microphone-4` | 0.226 | J | 0.274 | 0 | 21 | 10 | 24 | 40 | 0.93 | 83 | run x=7.375, 0.375, 3.00 |
| `microphone-5` | 0.223 | J | 0.290 | 0 | 62 | 10 | 22 | 58 | 0.87 | 65 | run x=7.375, 0.375, 3.00 |
| `microphone` | 0.219 | J | 0.301 | 0 | 71 | 8 | 20 | 59 | 0.80 | 48 | run x=7.375, 0.375, 3.00 |
| `minus-circle` | 0.094 | J | 0.000 | 0 | — | 2 | 14 | 26 | — | — | curve x=11.5, 0.500, 1.45 |
| `minus-circle-small` | 0.000 | J | 0.000 | 0 | — | 2 | 14 | 24 | — | — | run y=7, 0.000, 4.00 |
| `minus` | 0.000 | J | 0.000 | 0 | 0 | 2 | 2 | 14 | 1.00 | 100 | run y=7, 0.000, 10.00 |
| `minus-large` | 0.000 | J | 0.000 | 0 | 0 | 2 | 2 | 12 | 1.00 | 100 | run y=7, 0.000, 12.00 |
| `minus-small` | 0.000 | J | 0.000 | 0 | 0 | 2 | 2 | 16 | 1.00 | 100 | run y=7, 0.000, 8.00 |
| `moon` | 0.202 | A | — | — | — | 0 | 8 | 30 | — | — | curve x=7.3036, 0.304, 2.80 |
| `more-horizontal` | 0.633 | A | — | — | 100 | 0 | 18 | 60 | — | — | curve y=9.45, 0.450, 1.73 |
| `more-vertical` | 0.633 | A | — | — | 100 | 0 | 18 | 60 | — | — | curve x=9.45, 0.450, 1.73 |
| `package-2` | 0.289 | D | 0.203 | 69 | — | 4 | 18 | 39 | — | — | curve y=12.402, 0.402, 0.59 |
| `package-3` | 0.361 | D | 0.202 | 76 | — | 4 | 19 | 42 | — | — | curve y=3.5112, 0.489, 1.18 |
| `package` | 0.290 | J | 0.271 | 12 | — | 12 | 42 | 29 | — | — | run y=11.5, 0.500, 1.25 |
| `paintbrush-2` | 0.216 | D | 0.000 | 91 | 0 | 2 | 12 | 51 | — | — | curve y=7.308, 0.308, 0.49 |
| `paintbrush-3` | 0.253 | D | 0.202 | 70 | 0 | 4 | 16 | 60 | 1.00 | 100 | curve y=7.683, 0.317, 0.49 |
| `paintbrush-4` | 0.378 | D | — | 100 | 0 | 0 | 10 | 60 | — | — | curve y=8.558, 0.442, 0.51 |
| `paintbrush-5` | 0.102 | D | 0.000 | 82 | 100 | 2 | 14 | 56 | — | — | curve y=7.308, 0.308, 0.49 |
| `paintbrush-6` | 0.586 | D | — | 100 | 23 | 0 | 12 | 65 | — | — | curve x=8.5, 0.500, 1.13 |
| `paintbrush-7` | 0.307 | D | 0.000 | 88 | 40 | 2 | 16 | 69 | — | — | curve y=9.5, 0.500, 1.07 |
| `paintbrush-8` | 0.170 | D | 0.000 | 90 | 0 | 2 | 10 | 48 | — | — | curve x=9.713, 0.287, 0.98 |
| `paintbrush` | 0.266 | J | 0.302 | 0 | — | 17 | 37 | 30 | — | — | run y=8.5, 0.500, 10.00 |
| `pencil-2` | 0.000 | D | 0.000 | 95 | — | 2 | 6 | 55 | — | — | curve y=1.9996, 0.000, 2.04 |
| `pencil-3` | 0.000 | D | 0.000 | 94 | — | 2 | 6 | 33 | — | — | curve x=13.9999, 0.000, 1.83 |
| `pencil-4` | 0.132 | D | 0.186 | 83 | 0 | 4 | 8 | 54 | 1.00 | 100 | run y=12.75, 0.250, 4.75 |
| `pencil` | 0.001 | D | — | 100 | — | 0 | 4 | 58 | — | — | curve x=2.0004, 0.000, 1.61 |
| `phone` | 0.054 | J | 0.000 | 40 | — | 2 | 12 | 32 | — | — | curve x=7.25, 0.250, 1.04 |
| `pin-2` | 0.152 | J | 0.247 | 22 | 0 | 8 | 24 | 30 | 0.63 | 0 | run x=7.375, 0.375, 4.00 |
| `pin-3` | 0.230 | J | 0.342 | 33 | 0 | 6 | 18 | 29 | 0.63 | 0 | run x=7.375, 0.375, 5.00 |
| `pin-4` | 0.140 | D | 0.000 | 76 | 0 | 2 | 12 | 28 | — | — | curve y=8.6895, 0.310, 1.69 |
| `pin-5` | 0.094 | D | 0.000 | 72 | 0 | 4 | 12 | 28 | — | — | curve y=12.1895, 0.190, 1.69 |
| `pin-6` | 0.048 | D | 0.000 | 81 | 0 | 2 | 8 | 38 | — | — | curve x=2.0605, 0.060, 1.69 |
| `pin` | 0.168 | J | 0.227 | 17 | 0 | 6 | 16 | 23 | 0.63 | 0 | run x=7.375, 0.375, 4.00 |
| `play-2` | 1.000 | D | 1.000 | 100 | — | 1 | 4 | 24 | — | — | run x=3.5, 0.500, 6.75 |
| `play-3` | 0.984 | D | 0.980 | 100 | — | 1 | 9 | 28 | — | — | curve y=3.5, 0.500, 0.80 |
| `play` | 0.863 | D | 0.820 | 100 | — | 1 | 4 | 22 | — | — | curve y=2.5, 0.500, 0.92 |
| `plug-2` | 0.537 | J | 0.621 | 0 | 0 | 10 | 18 | 28 | 0.71 | 0 | run y=4.5, 0.500, 6.75 |
| `plug-3` | 0.608 | J | 0.646 | 0 | 0 | 11 | 14 | 48 | 0.73 | 0 | run y=4.5, 0.500, 8.75 |
| `plug-4` | 0.304 | J | 0.407 | 0 | 0 | 7 | 14 | 24 | 0.75 | 0 | run x=5.5, 0.500, 4.00 |
| `plug-5` | 0.612 | J | 0.763 | 0 | 0 | 9 | 16 | 36 | 0.71 | 0 | run x=11.5, 0.500, 6.75 |
| `plug-6` | 0.336 | D | — | 100 | 0 | 0 | 4 | 37 | — | — | curve x=13.2499, 0.250, 1.83 |
| `plug-7` | 0.543 | J | 0.660 | 0 | 11 | 11 | 22 | 36 | 0.80 | 27 | run y=4.5, 0.500, 6.75 |
| `plug` | 0.612 | J | 0.763 | 0 | 0 | 9 | 16 | 36 | 0.71 | 0 | run y=4.5, 0.500, 6.75 |
| `plus-circle` | 0.190 | J | 0.250 | 0 | — | 8 | 18 | 32 | — | — | curve x=11.2863, 0.286, 1.36 |
| `plus-circle-small` | 0.155 | J | 0.250 | 0 | — | 8 | 18 | 28 | — | — | curve y=5.2137, 0.214, 1.36 |
| `plus` | 0.000 | J | 0.000 | 0 | 0 | 4 | 4 | 15 | 1.00 | 100 | run x=7, 0.000, 10.00 |
| `plus-large` | 0.000 | J | 0.000 | 0 | 0 | 4 | 4 | 13 | 1.00 | 100 | run x=7, 0.000, 12.00 |
| `plus-small` | 0.000 | J | 0.000 | 0 | 0 | 4 | 4 | 18 | 1.00 | 100 | run x=7, 0.000, 8.00 |
| `presentation-2` | 0.058 | J | 0.000 | 45 | 0 | 4 | 18 | 27 | — | — | curve x=3.6437, 0.356, 1.26 |
| `presentation` | 0.293 | J | 0.312 | 17 | 0 | 8 | 12 | 16 | 0.93 | 81 | run y=2.625, 0.375, 12.00 |
| `printer-2` | 0.115 | J | 0.144 | 0 | — | 20 | 50 | 18 | — | — | run y=2.25, 0.250, 4.75 |
| `printer` | 0.195 | J | 0.228 | 0 | — | 20 | 48 | 23 | — | — | run y=2.25, 0.250, 4.75 |
| `puzzle-2` | 0.375 | J | 0.000 | 0 | — | 3 | 27 | 21 | — | — | curve y=4.5, 0.500, 1.04 |
| `puzzle-3` | 0.425 | J | 0.000 | 0 | — | 4 | 36 | 25 | — | — | curve y=4.5, 0.500, 1.04 |
| `puzzle-4` | 0.313 | J | 0.189 | 0 | — | 9 | 40 | 23 | — | — | run x=7.5, 0.500, 2.23 |
| `puzzle-5` | 0.730 | D | — | 100 | — | 0 | 35 | 27 | — | — | curve y=10.493, 0.493, 1.18 |
| `puzzle` | 0.255 | J | 0.000 | 0 | — | 2 | 18 | 13 | — | — | curve x=3.6251, 0.375, 2.20 |
| `refresh-2` | 0.531 | J | 0.500 | 28 | 55 | 8 | 16 | 49 | 1.00 | 100 | run y=5.5, 0.500, 3.50 |
| `refresh-3` | 0.434 | J | 0.250 | 29 | 55 | 8 | 16 | 51 | 1.00 | 100 | curve x=2.5805, 0.419, 3.31 |
| `refresh` | 0.434 | J | 0.250 | 29 | 55 | 8 | 16 | 51 | 1.00 | 100 | curve y=13.4195, 0.419, 3.31 |
| `rotate-ccw-10` | 0.695 | J | 0.774 | 31 | 35 | 6 | 15 | 50 | 1.00 | 100 | run y=10.5, 0.500, 5.13 |
| `rotate-ccw-11` | 0.467 | J | 0.467 | 18 | 11 | 7 | 18 | 44 | 0.79 | 45 | run y=9.5, 0.500, 5.50 |
| `rotate-ccw-2` | 0.446 | J | 0.280 | 29 | 74 | 4 | 12 | 60 | 1.00 | 100 | curve x=13.6477, 0.352, 3.30 |
| `rotate-ccw-3` | 0.384 | J | 0.280 | 29 | 71 | 4 | 10 | 60 | 1.00 | 100 | curve x=13.6477, 0.352, 3.30 |
| `rotate-ccw-4` | 0.377 | J | 0.450 | 13 | 57 | 8 | 20 | 49 | 0.75 | 0 | run x=3.5, 0.500, 3.38 |
| `rotate-ccw-5` | 0.206 | J | 0.184 | 18 | 24 | 8 | 25 | 29 | 1.00 | 100 | run y=4.5, 0.500, 4.12 |
| `rotate-ccw-6` | 0.516 | J | 0.568 | 18 | 15 | 6 | 19 | 51 | 0.74 | 31 | run y=9.5, 0.500, 4.88 |
| `rotate-ccw-7` | 0.703 | D | 1.000 | 69 | 65 | 2 | 7 | 58 | 1.00 | 100 | run y=4.5, 0.500, 2.19 |
| `rotate-ccw-8` | 0.648 | J | 0.679 | 27 | 23 | 6 | 13 | 48 | 1.00 | 100 | run y=10.5, 0.500, 5.13 |
| `rotate-ccw-9` | 0.407 | J | 0.385 | 34 | 38 | 8 | 21 | 50 | 1.00 | 100 | run y=8.5, 0.500, 2.25 |
| `rotate-ccw` | 0.446 | J | 0.280 | 29 | 75 | 4 | 12 | 59 | 1.00 | 100 | curve y=13.6478, 0.352, 3.30 |
| `save` | 0.052 | J | 0.063 | 6 | — | 12 | 28 | 9 | — | — | run y=12.75, 0.250, 4.00 |
| `search-2` | 0.493 | D | — | 100 | — | 0 | 16 | 56 | — | — | curve y=13.5, 0.500, 3.40 |
| `search-3` | 0.038 | D | — | 100 | — | 0 | 16 | 57 | — | — | curve x=8.1887, 0.189, 1.26 |
| `search` | 0.494 | D | — | 100 | — | 0 | 18 | 59 | — | — | curve y=12.5, 0.500, 3.25 |
| `send` | 0.062 | D | — | 100 | — | 0 | 8 | 43 | — | — | curve x=7.1137, 0.114, 0.57 |
| `shield-2` | 0.000 | J | 0.000 | 12 | — | 2 | 6 | 17 | — | — | curve x=13, 0.000, 2.08 |
| `shield` | 0.000 | J | 0.000 | 7 | — | 4 | 8 | 12 | — | — | run x=13, 0.000, 5.82 |
| `sliders-2` | 0.420 | J | 0.420 | 0 | 0 | 12 | 12 | 45 | 1.00 | 100 | run x=4.5, 0.500, 1.50 |
| `sliders-3` | 0.176 | J | 0.250 | 0 | 0 | 4 | 16 | 43 | 1.00 | 100 | run x=3.875, 0.125, 10.75 |
| `sliders-4` | 0.420 | J | 0.420 | 0 | 0 | 12 | 12 | 45 | 1.00 | 100 | run y=4.5, 0.500, 1.50 |
| `sliders-5` | 0.152 | J | 0.250 | 0 | 0 | 4 | 16 | 43 | 1.00 | 100 | run y=3.875, 0.125, 7.00 |
| `sliders` | 0.176 | J | 0.250 | 0 | 0 | 4 | 16 | 43 | 1.00 | 100 | run y=3.875, 0.125, 10.75 |
| `sort-2` | 0.001 | J | 0.000 | 46 | 10 | 4 | 6 | 45 | 1.00 | 100 | curve y=1.0042, 0.004, 2.02 |
| `sort-3` | 0.601 | J | 0.455 | 39 | 26 | 6 | 10 | 62 | 1.00 | 100 | run y=3.5, 0.500, 2.75 |
| `sort-alpha-ascending-2` | 0.337 | D | 0.364 | 51 | 0 | 12 | 30 | 68 | 0.88 | 67 | run y=4.5, 0.500, 0.90 |
| `sort-alpha-ascending-3` | 0.327 | D | 0.364 | 51 | 0 | 12 | 30 | 64 | 0.88 | 67 | run y=4.5, 0.500, 0.90 |
| `sort-alpha-ascending` | 0.460 | D | 0.559 | 55 | 6 | 8 | 27 | 80 | 0.63 | 0 | run y=4.5, 0.500, 0.90 |
| `sort-alpha-descending-2` | 0.337 | D | 0.352 | 51 | 0 | 12 | 30 | 72 | 0.88 | 67 | run y=7.375, 0.375, 3.50 |
| `sort-alpha-descending-3` | 0.327 | D | 0.352 | 51 | 0 | 12 | 30 | 68 | 0.88 | 67 | run y=7.375, 0.375, 3.50 |
| `sort-alpha-descending` | 0.460 | D | 0.547 | 55 | 6 | 8 | 27 | 84 | 0.63 | 0 | run x=11.375, 0.375, 10.75 |
| `sort-ascending` | 0.118 | J | 0.125 | 29 | 7 | 8 | 9 | 46 | 1.00 | 100 | run y=7.5, 0.500, 2.00 |
| `sort-descending` | 0.236 | J | 0.250 | 29 | 7 | 8 | 9 | 44 | 1.00 | 100 | run y=2.5, 0.500, 3.50 |
| `sort` | 0.001 | J | 0.000 | 39 | 9 | 4 | 6 | 37 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `sort-numeric-ascending-2` | 0.336 | J | 0.390 | 16 | 0 | 10 | 38 | 62 | 0.88 | 67 | run y=7.375, 0.375, 3.50 |
| `sort-numeric-ascending-3` | 0.357 | J | 0.390 | 16 | 0 | 10 | 38 | 65 | 0.88 | 67 | curve x=4.5, 0.500, 0.95 |
| `sort-numeric-ascending` | 0.483 | J | 0.672 | 36 | 5 | 6 | 35 | 83 | 0.63 | 0 | curve x=4.5, 0.500, 0.95 |
| `sort-numeric-descending-2` | 0.357 | J | 0.390 | 16 | 0 | 10 | 38 | 67 | 0.88 | 67 | curve y=5.5, 0.500, 1.89 |
| `sort-numeric-descending-3` | 0.378 | J | 0.390 | 16 | 0 | 10 | 38 | 69 | 0.88 | 67 | curve y=5.5, 0.500, 1.89 |
| `sort-numeric-descending` | 0.502 | J | 0.672 | 36 | 5 | 6 | 35 | 87 | 0.63 | 0 | curve y=5.5, 0.500, 1.89 |
| `sparkle-2` | 0.000 | D | — | 100 | — | 0 | 8 | 37 | — | — | curve y=3.9999, 0.000, 1.61 |
| `sparkle-3` | 0.000 | D | — | 100 | — | 0 | 12 | 51 | — | — | curve y=2.9999, 0.000, 1.61 |
| `sparkle-4` | 0.382 | D | — | 100 | — | 0 | 14 | 39 | — | — | curve x=13.5002, 0.500, 1.61 |
| `sparkle` | 0.000 | D | — | 100 | — | 0 | 4 | 29 | — | — | curve y=0.9998, 0.000, 1.61 |
| `star` | 0.473 | D | — | 100 | — | 0 | 4 | 25 | — | — | curve y=1.281, 0.281, 1.44 |
| `store-2` | 0.274 | J | 0.299 | 0 | 49 | 18 | 44 | 44 | 0.96 | 69 | run x=5.625, 0.375, 2.75 |
| `store` | 0.192 | J | 0.190 | 0 | — | 11 | 30 | 24 | — | — | run y=8.75, 0.250, 8.75 |
| `sun` | 0.378 | D | 0.750 | 50 | 0 | 8 | 14 | 68 | 0.63 | 0 | run x=7.375, 0.375, 1.25 |
| `table-2` | 0.277 | J | 0.309 | 0 | — | 16 | 48 | 19 | — | — | run y=7.5, 0.500, 4.25 |
| `table` | 0.331 | J | 0.371 | 0 | — | 24 | 72 | 46 | — | — | run y=5.625, 0.375, 4.25 |
| `target-2` | 0.314 | J | 0.500 | 0 | — | 8 | 44 | 38 | — | — | curve x=13.75, 0.250, 1.26 |
| `target-3` | 0.415 | J | 0.750 | 0 | 0 | 8 | 20 | 42 | 0.63 | 0 | run y=7.375, 0.375, 2.00 |
| `target` | 0.236 | A | — | — | — | 0 | 24 | 50 | — | — | curve y=10.625, 0.375, 2.31 |
| `text-2` | 0.600 | J | 0.600 | 0 | 0 | 6 | 6 | 41 | 1.00 | 100 | run y=2.5, 0.500, 10.00 |
| `text-3` | 0.000 | J | 0.000 | 0 | 0 | 6 | 6 | 14 | 1.00 | 100 | run y=2, 0.000, 10.00 |
| `text-4` | 0.000 | J | 0.000 | 0 | 15 | 6 | 10 | 26 | 1.00 | 100 | run x=7, 0.000, 10.00 |
| `text` | 0.000 | J | 0.000 | 0 | 15 | 6 | 10 | 26 | 1.00 | 100 | run x=7, 0.000, 10.00 |
| `thumbs-up-2` | 0.205 | J | 0.245 | 2 | — | 9 | 27 | 28 | — | — | run x=4.625, 0.375, 7.00 |
| `thumbs-up` | 0.213 | J | 0.253 | 5 | — | 9 | 27 | 28 | — | — | run x=4.625, 0.375, 7.00 |
| `toggle-on-2` | 0.137 | J | 0.250 | 0 | 62 | 4 | 16 | 30 | 1.00 | 100 | run y=6.25, 0.250, 2.33 |
| `toggle-on` | 0.279 | J | 0.000 | 0 | — | 2 | 14 | 39 | — | — | curve y=10.5, 0.500, 2.25 |
| `trash-5` | 0.294 | J | 0.350 | 22 | — | 12 | 34 | 33 | — | — | run y=7.5, 0.500, 8.75 |
| `trash` | 0.225 | J | 0.253 | 31 | — | 14 | 36 | 26 | — | — | run y=4.75, 0.250, 8.75 |
| `upload-2` | 0.001 | J | 0.000 | 29 | 19 | 8 | 17 | 36 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `upload-3` | 0.000 | J | 0.000 | 26 | 17 | 8 | 17 | 34 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `upload` | 0.000 | J | 0.000 | 29 | 19 | 8 | 17 | 37 | 1.00 | 100 | curve y=2.0042, 0.004, 2.02 |
| `user-2` | 0.237 | J | 0.000 | — | — | 1 | 15 | 31 | — | — | curve y=8.5, 0.500, 3.18 |
| `user-3` | 0.000 | J | 0.000 | 0 | — | 4 | 18 | 24 | — | — | run y=15, 0.000, 8.75 |
| `user-4` | 0.000 | J | 0.000 | — | — | 1 | 11 | 31 | — | — | run y=14, 0.000, 10.75 |
| `user` | 0.279 | J | 0.000 | 0 | — | 3 | 17 | 25 | — | — | curve y=7.5, 0.500, 1.59 |
| `users-2-behind` | 0.352 | J | 0.000 | 0 | — | 1 | 30 | 40 | — | — | curve x=8.5, 0.500, 1.13 |
| `users-2` | 0.271 | J | 0.000 | 0 | — | 1 | 25 | 42 | — | — | curve x=8.5, 0.500, 1.13 |
| `users-2-level` | 0.245 | J | 0.000 | 0 | — | 2 | 34 | 44 | — | — | curve y=7.5, 0.500, 2.14 |
| `users-2-wide` | 0.248 | J | 0.000 | 0 | — | 2 | 26 | 48 | — | — | curve y=7.5, 0.500, 2.02 |
| `users-3-behind` | 0.295 | J | 0.086 | 0 | — | 8 | 37 | 34 | — | — | run x=11.5, 0.500, 1.75 |
| `users-3` | 0.225 | J | 0.049 | 0 | — | 7 | 34 | 41 | — | — | curve x=8.5, 0.500, 1.13 |
| `users-3-level` | 0.128 | J | 0.041 | 0 | — | 8 | 36 | 46 | — | — | run x=10.5, 0.500, 0.75 |
| `users-3-wide` | 0.056 | J | 0.041 | 0 | — | 8 | 35 | 47 | — | — | run x=10.5, 0.500, 0.75 |
| `users-4-behind` | 0.068 | J | 0.000 | 0 | — | 1 | 19 | 38 | — | — | curve y=7.478, 0.478, 0.09 |
| `users-4` | 0.257 | J | 0.000 | 0 | — | 2 | 27 | 43 | — | — | curve y=10.5, 0.500, 2.94 |
| `users-4-level` | 0.292 | J | 0.000 | 0 | — | 2 | 29 | 44 | — | — | curve x=12.5, 0.500, 1.13 |
| `users-4-wide` | 0.331 | J | 0.459 | 0 | — | 2 | 22 | 46 | — | — | run y=12.5, 0.500, 4.88 |
| `users-behind` | 0.331 | J | 0.000 | 0 | — | 2 | 32 | 39 | — | — | curve y=8.5, 0.500, 1.42 |
| `users` | 0.402 | J | 0.286 | 0 | — | 2 | 29 | 43 | — | — | run y=9.5, 0.500, 2.00 |
| `users-level` | 0.323 | J | 0.316 | 0 | — | 4 | 33 | 49 | — | — | run y=8.5, 0.500, 2.00 |
| `users-wide` | 0.259 | J | 0.127 | 0 | — | 4 | 33 | 47 | — | — | curve y=7.5, 0.500, 2.02 |
| `volume` | 0.162 | J | 0.000 | 26 | 100 | 4 | 16 | 43 | — | — | curve x=11.5, 0.500, 2.89 |
| `volume-low` | 0.142 | J | 0.000 | 26 | 100 | 4 | 14 | 31 | — | — | curve x=11.5, 0.500, 2.89 |
| `volume-minus` | 0.181 | J | 0.268 | 21 | 0 | 6 | 14 | 30 | 0.63 | 0 | run y=7.375, 0.375, 3.75 |
| `volume-none` | 0.000 | J | 0.000 | 26 | — | 4 | 12 | 22 | — | — | curve y=2.9998, 0.000, 1.61 |
| `volume-off` | 0.112 | D | 0.000 | 72 | 0 | 3 | 15 | 61 | — | — | curve x=10.6619, 0.338, 1.16 |
| `volume-plus` | 0.195 | J | 0.264 | 18 | 0 | 8 | 16 | 28 | 0.81 | 50 | run y=7.375, 0.375, 3.75 |
| `volume-x` | 0.000 | D | 0.000 | 53 | 0 | 4 | 12 | 39 | — | — | curve y=2.9998, 0.000, 1.61 |
| `wallet-2` | 0.085 | J | 0.057 | 0 | — | 7 | 22 | 9 | — | — | run y=7.25, 0.250, 1.75 |
| `wallet-3` | 0.215 | J | 0.197 | 0 | 20 | 7 | 25 | 18 | 1.00 | 100 | curve y=8.625, 0.375, 1.26 |
| `wallet` | 0.155 | J | 0.114 | 0 | — | 13 | 42 | 12 | — | — | curve x=9.5, 0.500, 2.02 |
| `wand-2` | 0.332 | D | — | 100 | — | 0 | 14 | 63 | — | — | curve x=9.429, 0.429, 0.49 |
| `wand-3` | 0.387 | D | — | 100 | 0 | 0 | 8 | 73 | — | — | curve x=9.468, 0.468, 0.49 |
| `wand` | 0.273 | D | — | 100 | — | 0 | 18 | 63 | — | — | curve x=6.5, 0.500, 1.16 |
| `watch-2` | 0.171 | J | 0.189 | 14 | 0 | 18 | 34 | 28 | 0.63 | 0 | run y=7.375, 0.375, 1.00 |
| `watch-3` | 0.073 | J | 0.057 | 48 | — | 12 | 24 | 23 | — | — | run y=2.25, 0.250, 1.03 |
| `watch` | 0.194 | D | 0.250 | 80 | — | 4 | 10 | 49 | — | — | run y=2.25, 0.250, 1.03 |
| `wrench-2` | 0.113 | D | — | 100 | — | 0 | 12 | 34 | — | — | curve x=10.671, 0.329, 0.49 |
| `wrench-3` | 0.054 | D | — | 100 | — | 0 | 8 | 40 | — | — | curve x=12.085, 0.085, 0.49 |
| `wrench` | 0.113 | D | — | 100 | — | 0 | 12 | 36 | — | — | curve x=11.671, 0.329, 0.49 |
| `x-circle` | 0.145 | D | — | 100 | — | 0 | 14 | 37 | — | — | curve x=10.8271, 0.173, 1.36 |
| `x-circle-small` | 0.355 | D | — | 100 | — | 0 | 14 | 38 | — | — | curve x=10.5771, 0.423, 1.36 |
| `x` | — | N | — | 100 | 0 | 0 | 0 | 61 | — | — | — |
| `x-large` | — | N | — | 100 | 0 | 0 | 0 | 61 | — | — | — |
| `x-small` | — | N | — | 100 | 0 | 0 | 0 | 59 | — | — | — |


## Appendix B. 24 and 20 — every drawing

Landing score at each master's own size, and for outlines the solid-run share. At 24 and 20 the outline score is not informative (§4.1); the solid-run % is.

| concept | O24 score | O24 solid-run % | O20 score | O20 solid-run % | F24 score | F20 score |
|---|---:|---:|---:|---:|---:|---:|
| `alert-circle` | 0.487 | 0 | 0.483 | 0 | 0.108 | 0.208 |
| `alert-circle-2` | 0.484 | 0 | 0.479 | 100 | 0.221 | 0.215 |
| `alert-circle-3` | 0.487 | 0 | 0.481 | 25 | 0.064 | 0.232 |
| `alert-circle-4` | 0.483 | 0 | 0.477 | 100 | 0.158 | 0.264 |
| `alert-triangle` | 0.470 | 68 | 0.397 | 76 | 0.106 | 0.090 |
| `alert-triangle-2` | 0.464 | 100 | 0.385 | 100 | 0.252 | 0.124 |
| `alert-triangle-3` | 0.469 | 69 | 0.449 | 79 | 0.126 | 0.192 |
| `alert-triangle-4` | 0.462 | 100 | 0.443 | 100 | 0.268 | 0.234 |
| `archive` | 0.487 | 100 | 0.474 | 69 | 0.436 | 0.369 |
| `arrow-down` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-down-2` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-down-3` | 0.530 | 0 | 0.501 | 0 | 0.541 | 0.041 |
| `arrow-down-4` | 0.472 | 0 | 0.601 | 53 | 0.459 | 0.577 |
| `arrow-left` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-left-2` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-left-3` | 0.530 | 0 | 0.501 | 0 | 0.541 | 0.041 |
| `arrow-left-4` | 0.472 | 0 | 0.601 | 53 | 0.459 | 0.577 |
| `arrow-right` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-right-2` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-right-3` | 0.530 | 0 | 0.501 | 0 | 0.541 | 0.041 |
| `arrow-right-4` | 0.472 | 0 | 0.601 | 53 | 0.459 | 0.577 |
| `arrow-up` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-up-2` | 0.530 | 0 | 0.500 | 0 | 0.541 | 0.041 |
| `arrow-up-3` | 0.530 | 0 | 0.501 | 0 | 0.541 | 0.041 |
| `arrow-up-4` | 0.472 | 0 | 0.601 | 53 | 0.459 | 0.577 |
| `arrow-up-right` | 0.539 | 100 | 0.500 | 0 | 0.565 | 0.500 |
| `arrow-up-right-2` | 0.526 | 100 | 0.500 | 0 | 0.540 | 0.500 |
| `arrow-up-right-3` | — | — | — | — | — | — |
| `arrow-up-right-4` | 0.588 | 100 | 0.576 | 0 | 0.565 | 0.410 |
| `arrow-up-right-5` | 0.461 | 100 | 0.544 | 100 | 0.435 | 1.000 |
| `at-sign` | 0.505 | 100 | 0.495 | 100 | 0.493 | 0.440 |
| `at-sign-2` | 0.474 | 100 | 0.473 | 100 | 0.458 | 0.053 |
| `attachment` | 0.500 | 100 | 0.486 | 100 | 0.492 | 0.000 |
| `attachment-2` | 0.500 | 100 | 0.488 | 100 | 0.492 | 0.257 |
| `attachment-3` | 0.484 | — | 0.464 | — | 0.428 | 0.310 |
| `attachment-4` | 0.464 | — | 0.490 | — | 0.505 | 0.235 |
| `ban` | 0.480 | — | 0.474 | — | 0.464 | 0.000 |
| `ban-2` | 0.480 | — | 0.474 | — | 0.148 | 0.098 |
| `ban-3` | 0.480 | — | 0.474 | — | 0.093 | 0.128 |
| `bell` | 0.488 | 100 | 0.481 | 100 | 0.119 | 0.117 |
| `bell-2` | 0.495 | 100 | 0.493 | 100 | 0.663 | 0.170 |
| `bell-3` | 0.489 | 100 | 0.489 | 100 | 0.121 | 0.184 |
| `bold` | 0.497 | 100 | 0.492 | 100 | 0.204 | 0.264 |
| `book` | 0.490 | 100 | 0.480 | 100 | 0.268 | 0.352 |
| `book-2` | 0.490 | 100 | 0.481 | 100 | 0.275 | 0.351 |
| `book-3` | 0.489 | 100 | 0.478 | 100 | 0.221 | 0.321 |
| `book-4` | 0.489 | 100 | 0.480 | 100 | 0.232 | 0.220 |
| `book-open` | 0.483 | 72 | 0.474 | 70 | 0.000 | 0.000 |
| `book-open-2` | 0.483 | 72 | 0.468 | 69 | 0.020 | 0.028 |
| `briefcase` | 0.492 | 97 | 0.488 | 70 | 0.278 | 0.298 |
| `bug` | 0.499 | 71 | 0.480 | 74 | 0.431 | 0.343 |
| `bug-2` | 0.497 | 71 | 0.478 | 74 | 0.443 | 0.370 |
| `building` | 0.446 | 100 | 0.439 | 100 | 0.208 | 0.090 |
| `building-2` | 0.485 | 88 | 0.479 | 97 | 0.287 | 0.142 |
| `building-3` | 0.489 | 100 | 0.512 | 100 | 0.465 | 0.372 |
| `building-4` | 0.489 | 100 | 0.512 | 100 | 0.426 | 0.385 |
| `calendar` | 0.491 | 100 | 0.486 | 91 | 0.237 | 0.248 |
| `calendar-2` | 0.489 | 100 | 0.484 | 90 | 0.186 | 0.194 |
| `calendar-3` | 0.468 | 100 | 0.457 | 91 | 0.220 | 0.226 |
| `camera` | 0.484 | 100 | 0.455 | 100 | 0.171 | 0.123 |
| `camera-2` | 0.482 | 100 | 0.451 | 100 | 0.181 | 0.133 |
| `camera-3` | 0.476 | 100 | 0.474 | 100 | 0.221 | 0.133 |
| `camera-4` | 0.481 | 100 | 0.471 | 100 | 0.132 | 0.115 |
| `camera-5` | 0.486 | 100 | 0.460 | 100 | 0.184 | 0.147 |
| `camera-6` | 0.462 | 100 | 0.449 | 100 | 0.104 | 0.100 |
| `cart` | 0.463 | 100 | 0.485 | 81 | 0.395 | 0.349 |
| `cart-2` | 0.468 | 100 | 0.480 | 83 | 0.407 | 0.339 |
| `cart-3` | 0.457 | 100 | 0.482 | 81 | 0.384 | 0.351 |
| `cart-4` | 0.490 | 100 | 0.484 | 82 | 0.263 | 0.308 |
| `cart-5` | 0.467 | 100 | 0.487 | 83 | 0.391 | 0.364 |
| `cash` | 0.491 | 100 | 0.485 | 100 | 0.238 | 0.214 |
| `chart-bar` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `chart-bar-2` | 0.500 | 38 | 0.500 | 40 | 0.500 | 0.000 |
| `chart-bar-3` | 0.496 | 100 | 0.492 | 59 | 0.488 | 0.000 |
| `chart-bar-4` | 0.478 | 100 | 0.464 | 57 | 0.352 | 0.290 |
| `chart-bar-5` | 0.491 | 71 | 0.486 | 72 | 0.247 | 0.202 |
| `chart-pie` | 0.494 | 0 | 0.491 | 0 | 0.482 | 0.460 |
| `chart-pie-2` | 0.492 | 100 | 0.488 | 100 | 0.317 | 0.297 |
| `chart-pie-3` | 0.492 | 0 | 0.489 | 0 | 0.510 | 0.485 |
| `check` | 0.801 | — | 0.301 | — | 0.805 | 0.298 |
| `check-2` | 0.199 | — | 0.699 | — | 0.195 | 0.702 |
| `check-2-small` | 0.301 | — | 0.699 | — | 0.305 | 0.702 |
| `check-3` | 0.941 | — | 0.431 | — | 0.937 | 0.424 |
| `check-3-small` | 0.569 | — | 0.931 | — | 0.564 | 0.924 |
| `check-4` | 0.392 | — | 0.119 | — | 0.400 | 0.127 |
| `check-4-small` | 0.881 | — | 0.392 | — | 0.877 | 0.396 |
| `check-circle` | 0.493 | — | 0.473 | — | 0.147 | 0.129 |
| `check-circle-3` | 0.461 | — | 0.451 | — | 0.089 | 0.114 |
| `check-circle-3-small` | 0.488 | — | 0.500 | — | 0.153 | 0.197 |
| `check-circle-4` | 0.462 | — | 0.460 | — | 0.071 | 0.112 |
| `check-circle-4-small` | 0.495 | — | 0.490 | — | 0.109 | 0.125 |
| `check-circle-small` | 0.461 | — | 0.486 | — | 0.105 | 0.193 |
| `check-small` | 0.801 | — | 0.199 | — | 0.805 | 0.202 |
| `checkbox` | 0.492 | 100 | 0.482 | 100 | 0.058 | 0.059 |
| `checkbox-2` | 0.482 | 100 | 0.473 | 100 | 0.035 | 0.052 |
| `checkbox-3` | 0.482 | 100 | 0.477 | 100 | 0.028 | 0.051 |
| `checkbox-4` | 0.482 | 100 | 0.486 | 100 | 0.041 | 0.088 |
| `chevron-down` | 0.439 | — | 0.701 | — | 0.472 | 0.707 |
| `chevron-down-2` | 0.549 | — | 0.277 | — | 0.520 | 0.286 |
| `chevron-down-2-large` | 0.617 | — | 0.549 | — | 0.542 | 0.547 |
| `chevron-down-2-small` | 0.251 | — | 0.603 | — | 0.417 | 0.587 |
| `chevron-down-3` | 0.254 | — | 0.814 | — | 0.278 | 0.834 |
| `chevron-down-3-large` | 0.514 | — | 0.554 | — | 0.531 | 0.574 |
| `chevron-down-3-small` | 0.006 | — | 0.874 | — | 0.088 | 0.888 |
| `chevron-down-large` | 0.139 | — | 0.739 | — | 0.356 | 0.722 |
| `chevron-down-small` | 0.739 | — | 0.101 | — | 0.596 | 0.098 |
| `chevron-left` | 0.439 | — | 0.701 | — | 0.472 | 0.707 |
| `chevron-left-2` | 0.549 | — | 0.277 | — | 0.520 | 0.286 |
| `chevron-left-2-large` | 0.617 | — | 0.549 | — | 0.542 | 0.547 |
| `chevron-left-2-small` | 0.251 | — | 0.603 | — | 0.417 | 0.587 |
| `chevron-left-3` | 0.334 | — | 0.894 | — | 0.348 | 0.914 |
| `chevron-left-3-large` | 0.614 | — | 0.634 | — | 0.623 | 0.654 |
| `chevron-left-3-small` | 0.074 | — | 0.934 | — | 0.114 | 0.948 |
| `chevron-left-large` | 0.139 | — | 0.739 | — | 0.356 | 0.722 |
| `chevron-left-small` | 0.739 | — | 0.101 | — | 0.596 | 0.098 |
| `chevron-right` | 0.439 | — | 0.701 | — | 0.472 | 0.707 |
| `chevron-right-2` | 0.549 | — | 0.277 | — | 0.520 | 0.286 |
| `chevron-right-2-large` | 0.617 | — | 0.549 | — | 0.542 | 0.547 |
| `chevron-right-2-small` | 0.251 | — | 0.603 | — | 0.417 | 0.587 |
| `chevron-right-3` | 0.334 | — | 0.894 | — | 0.348 | 0.914 |
| `chevron-right-3-large` | 0.614 | — | 0.634 | — | 0.623 | 0.654 |
| `chevron-right-3-small` | 0.074 | — | 0.934 | — | 0.114 | 0.948 |
| `chevron-right-large` | 0.139 | — | 0.739 | — | 0.356 | 0.722 |
| `chevron-right-small` | 0.739 | — | 0.101 | — | 0.596 | 0.098 |
| `chevron-up` | 0.439 | — | 0.701 | — | 0.472 | 0.707 |
| `chevron-up-2` | 0.849 | — | 0.037 | — | 0.616 | 0.046 |
| `chevron-up-2-large` | 0.257 | — | 0.849 | — | 0.427 | 0.847 |
| `chevron-up-2-small` | 0.011 | — | 0.823 | — | 0.339 | 0.807 |
| `chevron-up-3` | 0.334 | — | 0.894 | — | 0.348 | 0.914 |
| `chevron-up-3-large` | 0.614 | — | 0.634 | — | 0.623 | 0.654 |
| `chevron-up-3-small` | 0.074 | — | 0.934 | — | 0.114 | 0.948 |
| `chevron-up-large` | 0.139 | — | 0.739 | — | 0.356 | 0.722 |
| `chevron-up-small` | 0.739 | — | 0.101 | — | 0.596 | 0.098 |
| `chevrons-up-down` | 0.141 | — | 0.379 | — | 0.357 | 0.382 |
| `chevrons-up-down-2` | 0.859 | — | 0.879 | — | 0.643 | 0.882 |
| `chevrons-up-down-3` | 0.171 | — | 0.177 | — | 0.392 | 0.193 |
| `chevrons-up-down-4` | 0.829 | — | 0.323 | — | 0.609 | 0.307 |
| `clipboard` | 0.487 | 100 | 0.465 | 100 | 0.297 | 0.321 |
| `clipboard-2` | 0.485 | 100 | 0.469 | 100 | 0.354 | 0.351 |
| `clipboard-3` | 0.502 | 100 | 0.492 | 100 | 0.287 | 0.341 |
| `clipboard-4` | 0.486 | 100 | 0.462 | 100 | 0.311 | 0.341 |
| `clock` | 0.485 | 0 | 0.480 | 0 | 0.082 | 0.103 |
| `code` | 0.121 | — | 0.121 | — | 0.352 | 0.118 |
| `code-2` | 0.121 | — | 0.121 | — | 0.352 | 0.118 |
| `compass` | 0.529 | — | 0.395 | — | 0.319 | 0.039 |
| `compass-2` | 0.508 | — | 0.423 | — | 0.510 | 0.419 |
| `compass-3` | 0.529 | — | 0.395 | — | 0.219 | 0.019 |
| `compose` | 0.488 | 100 | 0.475 | 100 | 0.122 | 0.133 |
| `compose-2` | 0.473 | 100 | 0.457 | 100 | 0.118 | 0.126 |
| `compose-3` | 0.462 | 100 | 0.442 | 100 | 0.089 | 0.110 |
| `compose-4` | 0.475 | 100 | 0.463 | 100 | 0.117 | 0.126 |
| `copy` | 0.485 | 100 | 0.474 | 100 | 0.259 | 0.218 |
| `copy-2` | 0.486 | 100 | 0.478 | 100 | 0.215 | 0.159 |
| `copy-3` | 0.488 | 100 | 0.481 | 100 | 0.218 | 0.170 |
| `credit-card` | 0.491 | 100 | 0.487 | 100 | 0.236 | 0.239 |
| `credit-card-2` | 0.491 | 100 | 0.487 | 100 | 0.236 | 0.239 |
| `credit-card-3` | 0.503 | 100 | 0.488 | 100 | 0.269 | 0.270 |
| `cursor` | 0.014 | — | 0.472 | — | 0.007 | 0.324 |
| `cursor-2` | 0.060 | — | 0.379 | — | 0.021 | 0.194 |
| `cursor-3` | 0.009 | — | 0.009 | — | 0.003 | 0.003 |
| `cursor-click` | 0.396 | 100 | 0.383 | 100 | 0.397 | 0.384 |
| `database` | 0.471 | 100 | 0.463 | 100 | 0.307 | 0.271 |
| `database-2` | 0.481 | 100 | 0.467 | 100 | 0.248 | 0.248 |
| `database-3` | 0.465 | 100 | 0.464 | 100 | 0.363 | 0.299 |
| `desktop` | 0.489 | 93 | 0.484 | 93 | 0.153 | 0.145 |
| `desktop-2` | 0.488 | 100 | 0.483 | 100 | 0.112 | 0.105 |
| `desktop-3` | 0.492 | 94 | 0.488 | 95 | 0.282 | 0.282 |
| `desktop-4` | 0.488 | 92 | 0.483 | 92 | 0.161 | 0.156 |
| `desktop-5` | 0.490 | 93 | 0.485 | 91 | 0.145 | 0.152 |
| `desktop-6` | 0.487 | 100 | 0.480 | 100 | 0.168 | 0.167 |
| `export` | 0.475 | 62 | 0.463 | 60 | 0.271 | 0.263 |
| `external-link` | 0.481 | 100 | 0.470 | 100 | 0.183 | 0.212 |
| `external-link-2` | 0.479 | 100 | 0.466 | 100 | 0.165 | 0.229 |
| `eye` | 0.474 | — | 0.416 | — | 0.500 | 0.192 |
| `face-neutral` | 0.487 | 100 | 0.483 | 31 | 0.341 | 0.302 |
| `face-sad` | 0.486 | 100 | 0.475 | 100 | 0.268 | 0.349 |
| `face-smile` | 0.485 | 100 | 0.487 | 100 | 0.243 | 0.277 |
| `file` | 0.495 | 100 | 0.494 | 100 | 0.189 | 0.213 |
| `file-text` | 0.496 | 74 | 0.495 | 80 | 0.289 | 0.281 |
| `file-text-2` | 0.496 | 71 | 0.495 | 85 | 0.296 | 0.274 |
| `files` | 0.494 | 100 | 0.474 | 100 | 0.312 | 0.223 |
| `files-2` | 0.497 | 100 | 0.476 | 100 | 0.271 | 0.187 |
| `files-3` | 0.494 | 100 | 0.473 | 100 | 0.284 | 0.234 |
| `files-4` | 0.496 | 100 | 0.495 | 100 | 0.288 | 0.290 |
| `files-5` | 0.495 | 100 | 0.475 | 100 | 0.340 | 0.237 |
| `filter` | 0.486 | 100 | 0.457 | 100 | 0.407 | 0.412 |
| `filter-2` | 0.500 | 67 | 0.500 | 67 | 0.500 | 0.667 |
| `filter-3` | 0.473 | 100 | 0.463 | 100 | 0.319 | 0.379 |
| `filter-4` | 0.483 | 100 | 0.449 | 100 | 0.389 | 0.392 |
| `flag` | 0.487 | 100 | 0.482 | 100 | 0.306 | 0.315 |
| `flag-2` | 0.488 | 100 | 0.460 | 100 | 0.331 | 0.424 |
| `flag-3` | 0.488 | 100 | 0.486 | 100 | 0.333 | 0.520 |
| `flag-4` | 0.484 | 100 | 0.474 | 100 | 0.287 | 0.357 |
| `folder` | 0.487 | 100 | 0.482 | 100 | 0.000 | 0.000 |
| `folder-2` | 0.489 | 100 | 0.484 | 100 | 0.087 | 0.123 |
| `folder-3` | 0.488 | 100 | 0.483 | 100 | 0.042 | 0.061 |
| `gauge` | 0.568 | — | 0.482 | — | 0.471 | 0.319 |
| `gear` | 0.520 | 100 | 0.574 | 100 | 0.753 | 0.567 |
| `gear-2` | 0.628 | — | 0.634 | — | 0.658 | 0.653 |
| `gear-3` | 0.500 | 0 | 0.500 | 0 | 0.493 | 0.436 |
| `globe` | 0.487 | 0 | 0.480 | 0 | 0.022 | 0.147 |
| `globe-2` | 0.480 | — | 0.470 | — | 0.363 | 0.206 |
| `grid` | 0.500 | 100 | 0.500 | 100 | 0.500 | 0.500 |
| `grid-2` | 0.492 | 58 | 0.489 | 58 | 0.283 | 0.284 |
| `grid-3` | 1.000 | — | 0.433 | — | 0.000 | 0.400 |
| `grid-4` | 0.500 | 100 | 0.500 | 67 | 0.500 | 0.500 |
| `grid-5` | 0.500 | 100 | 0.500 | 100 | 0.500 | 0.500 |
| `grid-6` | 0.492 | 86 | 0.488 | 86 | 0.250 | 0.258 |
| `grid-7` | 0.433 | 100 | 0.387 | 100 | 0.000 | 0.000 |
| `hash` | 0.500 | 0 | 0.500 | 100 | 0.500 | 0.500 |
| `hash-2` | 0.500 | 0 | 0.500 | 100 | 0.500 | 0.500 |
| `hash-3` | 0.500 | 0 | 0.500 | 100 | 0.500 | 0.500 |
| `heart` | 0.404 | — | 0.447 | — | 0.000 | 0.000 |
| `heart-2` | 0.500 | 100 | 0.500 | 100 | 0.000 | 0.000 |
| `help` | 0.481 | — | 0.406 | — | 0.186 | 0.165 |
| `help-2` | 0.479 | — | 0.408 | — | 0.368 | 0.138 |
| `help-3` | 0.486 | — | 0.402 | — | 0.252 | 0.151 |
| `help-4` | 0.488 | 100 | 0.457 | 0 | 0.308 | 0.161 |
| `home` | 0.481 | 100 | 0.500 | 100 | 0.275 | 0.322 |
| `home-2` | 0.474 | 100 | 0.479 | 100 | 0.238 | 0.022 |
| `home-3` | 0.474 | 100 | 0.464 | 100 | 0.116 | 0.181 |
| `image` | 0.487 | 100 | 0.483 | 100 | 0.125 | 0.125 |
| `image-2` | 0.483 | 100 | 0.490 | 100 | 0.138 | 0.174 |
| `image-3` | 0.487 | 100 | 0.490 | 100 | 0.104 | 0.136 |
| `images` | 0.463 | 100 | 0.479 | 100 | 0.245 | 0.205 |
| `images-2` | 0.463 | 100 | 0.479 | 100 | 0.245 | 0.205 |
| `images-3` | 0.463 | 100 | 0.479 | 100 | 0.245 | 0.205 |
| `images-4` | 0.487 | 100 | 0.483 | 100 | 0.246 | 0.222 |
| `info` | 0.487 | 0 | 0.483 | 0 | 0.108 | 0.208 |
| `info-2` | 0.481 | 100 | 0.531 | 100 | 0.368 | 0.378 |
| `info-3` | 0.486 | 88 | 0.474 | 86 | 0.308 | 0.259 |
| `italic` | 0.500 | 100 | 0.500 | 100 | 0.500 | 0.000 |
| `key` | 0.481 | 56 | 0.473 | 49 | 0.273 | 0.282 |
| `key-2` | 0.461 | — | 0.442 | — | 0.000 | 0.000 |
| `key-3` | 0.455 | 100 | 0.435 | 100 | 0.000 | 0.000 |
| `key-4` | 0.461 | — | 0.442 | — | 0.000 | 0.000 |
| `key-5` | 0.481 | 33 | 0.473 | 32 | 0.295 | 0.289 |
| `key-6` | 0.481 | 33 | 0.473 | 32 | 0.295 | 0.289 |
| `keyboard` | 0.488 | 100 | 0.500 | 100 | 0.185 | 0.484 |
| `keyboard-2` | 0.488 | 94 | 0.502 | 95 | 0.224 | 0.488 |
| `language` | 0.478 | 100 | 0.509 | 48 | 0.516 | 0.265 |
| `language-2` | 0.487 | 0 | 0.480 | 0 | 0.022 | 0.147 |
| `language-3` | 0.480 | — | 0.470 | — | 0.363 | 0.206 |
| `layout-footer` | 0.491 | 100 | 0.486 | 100 | 0.201 | 0.204 |
| `layout-footer-2` | 0.491 | 100 | 0.486 | 100 | 0.460 | 0.368 |
| `layout-footer-3` | 0.491 | 100 | 0.486 | 100 | 0.227 | 0.318 |
| `layout-footer-4` | 0.482 | 100 | 0.470 | 100 | 0.303 | 0.289 |
| `layout-header` | 0.491 | 100 | 0.486 | 100 | 0.201 | 0.204 |
| `layout-header-2` | 0.491 | 100 | 0.486 | 100 | 0.460 | 0.368 |
| `layout-header-3` | 0.491 | 100 | 0.486 | 100 | 0.227 | 0.318 |
| `layout-header-4` | 0.482 | 100 | 0.470 | 100 | 0.303 | 0.289 |
| `layout-sidebar` | 0.491 | 100 | 0.486 | 100 | 0.201 | 0.204 |
| `layout-sidebar-2` | 0.491 | 100 | 0.486 | 100 | 0.460 | 0.368 |
| `layout-sidebar-3` | 0.491 | 100 | 0.486 | 100 | 0.227 | 0.318 |
| `layout-sidebar-4` | 0.482 | 100 | 0.470 | 100 | 0.303 | 0.289 |
| `layout-sidebar-right` | 0.491 | 100 | 0.486 | 100 | 0.201 | 0.204 |
| `layout-sidebar-right-2` | 0.491 | 100 | 0.486 | 100 | 0.460 | 0.368 |
| `layout-sidebar-right-3` | 0.491 | 100 | 0.486 | 100 | 0.227 | 0.318 |
| `layout-sidebar-right-4` | 0.482 | 100 | 0.470 | 100 | 0.303 | 0.289 |
| `lightbulb` | 0.473 | 100 | 0.460 | 100 | 0.211 | 0.189 |
| `lightbulb-2` | 0.493 | 100 | 0.452 | 100 | 0.279 | 0.223 |
| `lightbulb-3` | 0.485 | 55 | 0.484 | 58 | 0.306 | 0.301 |
| `lightbulb-4` | 0.482 | 100 | 0.479 | 100 | 0.224 | 0.220 |
| `link` | 0.480 | — | 0.448 | — | 0.423 | 0.244 |
| `link-2` | 0.461 | — | 0.454 | — | 0.426 | 0.005 |
| `link-3` | 0.485 | 56 | 0.478 | 50 | 0.470 | 0.000 |
| `list-bullet` | 0.565 | 67 | 0.521 | 67 | 0.419 | 0.619 |
| `list-bullet-2` | 0.540 | 67 | 0.500 | 0 | 0.452 | 0.171 |
| `list-bullet-3` | 0.477 | 100 | 0.470 | 100 | 0.422 | 0.393 |
| `list-ordered` | 0.491 | 72 | 0.494 | 75 | 0.492 | 0.602 |
| `lock` | 0.485 | 70 | 0.479 | 68 | 0.253 | 0.242 |
| `lock-2` | 0.486 | 74 | 0.479 | 71 | 0.247 | 0.256 |
| `lock-3` | 0.479 | 0 | 0.474 | 0 | 0.300 | 0.349 |
| `lock-4` | 0.484 | 57 | 0.478 | 56 | 0.290 | 0.271 |
| `lock-5` | 0.492 | 82 | 0.480 | 80 | 0.388 | 0.243 |
| `lock-6` | 0.493 | 74 | 0.480 | 73 | 0.449 | 0.272 |
| `login` | 0.477 | 53 | 0.467 | 53 | 0.459 | 0.043 |
| `login-2` | 0.477 | 70 | 0.467 | 68 | 0.459 | 0.000 |
| `login-3` | 0.477 | 53 | 0.467 | 53 | 0.459 | 0.043 |
| `login-4` | 0.477 | 70 | 0.467 | 68 | 0.459 | 0.000 |
| `logout` | 0.477 | 53 | 0.467 | 53 | 0.459 | 0.000 |
| `logout-2` | 0.477 | 70 | 0.467 | 68 | 0.459 | 0.000 |
| `logout-3` | 0.477 | 53 | 0.467 | 53 | 0.459 | 0.000 |
| `logout-4` | 0.477 | 70 | 0.467 | 68 | 0.459 | 0.000 |
| `mail` | 0.488 | 100 | 0.481 | 100 | 0.058 | 0.116 |
| `mail-2` | 0.485 | 100 | 0.480 | 100 | 0.037 | 0.093 |
| `mail-3` | 0.483 | 100 | 0.483 | 100 | 0.041 | 0.098 |
| `map-pin` | 0.456 | — | 0.437 | — | 0.000 | 0.000 |
| `map-pin-2` | 0.456 | — | 0.447 | — | 0.000 | 0.000 |
| `map-pin-3` | 0.512 | — | 0.453 | — | 0.382 | 0.398 |
| `map-pin-4` | 0.461 | — | 0.437 | — | 0.000 | 0.000 |
| `map-pin-5` | 0.443 | 0 | 0.421 | 0 | 0.345 | 0.326 |
| `maximize` | 0.473 | 100 | 0.458 | 100 | 0.429 | 0.000 |
| `maximize-2` | 0.569 | 100 | 0.500 | 100 | 0.655 | 0.500 |
| `maximize-3` | 0.475 | 100 | 0.455 | 100 | 0.426 | 0.000 |
| `maximize-4` | 0.461 | 100 | 0.456 | 100 | 0.435 | 0.000 |
| `maximize-5` | 0.519 | 100 | 0.534 | 100 | 0.632 | 0.618 |
| `megaphone` | 0.405 | — | 0.500 | — | 0.362 | 0.500 |
| `megaphone-2` | 0.452 | 100 | 0.450 | 100 | 0.440 | 0.464 |
| `megaphone-3` | 0.474 | 61 | 0.406 | 100 | 0.530 | 0.191 |
| `menu` | 0.500 | 67 | 0.500 | 67 | 0.500 | 0.667 |
| `menu-2` | 0.500 | 49 | 0.500 | 48 | 0.500 | 0.465 |
| `menu-3` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `menu-4` | 0.500 | 100 | 0.500 | 100 | 0.500 | 0.500 |
| `menu-arrow-left` | 0.518 | 67 | 0.500 | 67 | 0.525 | 0.659 |
| `menu-arrow-right` | 0.518 | 67 | 0.500 | 67 | 0.525 | 0.659 |
| `message` | 0.480 | 100 | 0.481 | 100 | 0.000 | 0.000 |
| `message-2` | 0.480 | 100 | 0.478 | 96 | 0.000 | 0.020 |
| `message-3` | 0.483 | 100 | 0.476 | 100 | 0.000 | 0.000 |
| `message-4` | 0.485 | 100 | 0.472 | 81 | 0.193 | 0.327 |
| `message-5` | 0.468 | 100 | 0.481 | 100 | 0.001 | 0.145 |
| `message-6` | 0.470 | 100 | 0.484 | 100 | 0.043 | 0.000 |
| `message-7` | 0.477 | 100 | 0.472 | 100 | 0.000 | 0.051 |
| `microphone` | 0.491 | 85 | 0.500 | 80 | 0.367 | 0.582 |
| `microphone-2` | 0.493 | 84 | 0.489 | 79 | 0.381 | 0.380 |
| `microphone-3` | 0.491 | 84 | 0.500 | 79 | 0.365 | 0.583 |
| `microphone-4` | 0.493 | 91 | 0.500 | 87 | 0.404 | 0.564 |
| `microphone-5` | 0.481 | 88 | 0.471 | 83 | 0.315 | 0.315 |
| `minus` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `minus-circle` | 0.487 | 0 | 0.482 | 0 | 0.288 | 0.042 |
| `minus-circle-small` | 0.486 | 0 | 0.481 | 0 | 0.231 | 0.044 |
| `minus-large` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `minus-small` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `moon` | 0.490 | — | 0.477 | — | 0.119 | 0.154 |
| `more-horizontal` | 1.000 | — | 0.567 | — | 0.000 | 0.600 |
| `more-vertical` | 1.000 | — | 0.567 | — | 0.000 | 0.600 |
| `package` | 0.495 | 95 | 0.493 | 94 | 0.278 | 0.296 |
| `package-2` | 0.452 | 62 | 0.410 | 61 | 0.266 | 0.280 |
| `package-3` | 0.472 | 62 | 0.431 | 62 | 0.305 | 0.304 |
| `paintbrush` | 0.490 | 100 | 0.482 | 100 | 0.302 | 0.302 |
| `paintbrush-2` | 0.460 | 100 | 0.443 | 100 | 0.234 | 0.368 |
| `paintbrush-3` | 0.471 | 100 | 0.480 | 100 | 0.446 | 0.396 |
| `paintbrush-4` | 0.356 | — | 0.381 | — | 0.066 | 0.273 |
| `paintbrush-5` | 0.430 | 100 | 0.421 | 100 | 0.000 | 0.000 |
| `paintbrush-6` | 0.340 | — | 0.346 | — | 0.089 | 0.311 |
| `paintbrush-7` | 0.451 | 100 | 0.467 | 100 | 0.400 | 0.357 |
| `paintbrush-8` | 0.457 | 100 | 0.451 | 100 | 0.234 | 0.257 |
| `pencil` | 0.234 | — | 0.176 | — | 0.004 | 0.006 |
| `pencil-2` | 0.415 | 100 | 0.383 | 100 | 0.001 | 0.004 |
| `pencil-3` | 0.405 | 100 | 0.354 | 100 | 0.001 | 0.003 |
| `pencil-4` | 0.448 | 100 | 0.416 | 100 | 0.309 | 0.276 |
| `phone` | 0.474 | 100 | 0.425 | 100 | 0.174 | 0.000 |
| `pin` | 0.468 | 85 | 0.452 | 83 | 0.108 | 0.114 |
| `pin-2` | 0.455 | 84 | 0.448 | 84 | 0.100 | 0.094 |
| `pin-3` | 0.453 | 74 | 0.441 | 71 | 0.168 | 0.175 |
| `pin-4` | 0.428 | 100 | 0.407 | 100 | 0.171 | 0.595 |
| `pin-5` | 0.514 | 100 | 0.441 | 100 | 0.223 | 0.121 |
| `pin-6` | 0.464 | 100 | 0.408 | 100 | 0.138 | 0.055 |
| `play` | 0.474 | 100 | 0.530 | 100 | 0.082 | 0.645 |
| `play-2` | 0.487 | 100 | 0.526 | 100 | 0.338 | 0.839 |
| `play-3` | 0.408 | 100 | 0.565 | 100 | 0.179 | 0.763 |
| `plug` | 0.487 | 51 | 0.479 | 83 | 0.329 | 0.348 |
| `plug-2` | 0.490 | 65 | 0.483 | 87 | 0.354 | 0.367 |
| `plug-3` | 0.505 | 63 | 0.508 | 88 | 0.593 | 0.596 |
| `plug-4` | 0.495 | 65 | 0.493 | 100 | 0.454 | 0.432 |
| `plug-5` | 0.487 | 51 | 0.479 | 83 | 0.329 | 0.348 |
| `plug-6` | 0.546 | — | 0.500 | — | 0.677 | 0.541 |
| `plug-7` | 0.486 | 62 | 0.477 | 90 | 0.356 | 0.367 |
| `plus` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `plus-circle` | 0.490 | 0 | 0.486 | 0 | 0.101 | 0.127 |
| `plus-circle-small` | 0.489 | 0 | 0.485 | 0 | 0.056 | 0.241 |
| `plus-large` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `plus-small` | 0.500 | 0 | 0.500 | 0 | 0.500 | 0.000 |
| `presentation` | 0.494 | 91 | 0.491 | 90 | 0.326 | 0.330 |
| `presentation-2` | 0.488 | 100 | 0.473 | 100 | 0.065 | 0.045 |
| `printer` | 0.476 | 100 | 0.461 | 100 | 0.430 | 0.426 |
| `printer-2` | 0.462 | 100 | 0.448 | 100 | 0.281 | 0.271 |
| `puzzle` | 0.486 | 100 | 0.478 | 100 | 0.299 | 0.210 |
| `puzzle-2` | 0.482 | 100 | 0.476 | 100 | 0.351 | 0.379 |
| `puzzle-3` | 0.486 | 100 | 0.457 | 100 | 0.344 | 0.456 |
| `puzzle-4` | 0.488 | 100 | 0.479 | 100 | 0.306 | 0.316 |
| `puzzle-5` | 0.426 | — | 0.370 | — | 0.195 | 0.374 |
| `refresh` | 0.494 | 100 | 0.487 | 50 | 0.466 | 0.332 |
| `refresh-2` | 0.504 | 100 | 0.485 | 50 | 0.484 | 0.236 |
| `refresh-3` | 0.498 | 100 | 0.481 | 100 | 0.472 | 0.422 |
| `rotate-ccw` | 0.493 | 100 | 0.486 | 50 | 0.471 | 0.516 |
| `rotate-ccw-10` | 0.511 | 100 | 0.514 | 71 | 0.513 | 0.435 |
| `rotate-ccw-11` | 0.499 | 100 | 0.494 | 73 | 0.420 | 0.346 |
| `rotate-ccw-2` | 0.493 | 100 | 0.486 | 50 | 0.471 | 0.516 |
| `rotate-ccw-3` | 0.494 | 100 | 0.485 | 50 | 0.469 | 0.556 |
| `rotate-ccw-4` | 0.484 | 100 | 0.494 | 71 | 0.257 | 0.491 |
| `rotate-ccw-5` | 0.481 | 100 | 0.486 | 79 | 0.467 | 0.019 |
| `rotate-ccw-6` | 0.497 | 61 | 0.488 | 98 | 0.470 | 0.343 |
| `rotate-ccw-7` | 0.504 | 100 | 0.513 | 0 | 0.507 | 0.218 |
| `rotate-ccw-8` | 0.507 | 100 | 0.508 | 69 | 0.505 | 0.378 |
| `rotate-ccw-9` | 0.508 | 100 | 0.468 | 69 | 0.511 | 0.259 |
| `save` | 0.488 | 100 | 0.490 | 100 | 0.343 | 0.189 |
| `search` | 0.500 | — | 0.464 | — | 0.489 | 0.039 |
| `search-2` | 0.476 | — | 0.468 | — | 0.458 | 0.060 |
| `search-3` | 0.500 | — | 0.500 | — | 0.492 | 0.510 |
| `send` | 0.001 | — | 0.001 | — | 0.186 | 0.228 |
| `shield` | 0.478 | 100 | 0.471 | 100 | 0.000 | 0.000 |
| `shield-2` | 0.471 | 100 | 0.474 | 100 | 0.000 | 0.000 |
| `sliders` | 0.500 | 100 | 0.451 | 100 | 0.500 | 0.367 |
| `sliders-2` | 0.500 | 0 | 0.500 | 28 | 0.500 | 0.286 |
| `sliders-3` | 0.465 | 0 | 0.500 | 67 | 0.385 | 0.500 |
| `sliders-4` | 0.500 | 21 | 0.500 | 73 | 0.500 | 0.362 |
| `sliders-5` | 0.500 | 100 | 0.451 | 100 | 0.500 | 0.333 |
| `sort` | 0.530 | 0 | 0.500 | 100 | 0.541 | 0.960 |
| `sort-2` | 0.462 | 0 | 0.458 | 100 | 0.449 | 0.900 |
| `sort-3` | 0.498 | 51 | 0.561 | 50 | 0.498 | 0.580 |
| `sort-alpha-ascending` | 0.534 | 44 | 0.500 | 81 | 0.533 | 0.440 |
| `sort-alpha-ascending-2` | 0.517 | 81 | 0.500 | 63 | 0.519 | 0.438 |
| `sort-alpha-ascending-3` | 0.517 | 81 | 0.500 | 63 | 0.517 | 0.438 |
| `sort-alpha-descending` | 0.517 | 44 | 0.500 | 81 | 0.519 | 0.489 |
| `sort-alpha-descending-2` | 0.500 | 81 | 0.500 | 63 | 0.504 | 0.489 |
| `sort-alpha-descending-3` | 0.500 | 81 | 0.500 | 63 | 0.504 | 0.489 |
| `sort-ascending` | 0.517 | 70 | 0.500 | 70 | 0.525 | 0.434 |
| `sort-descending` | 0.517 | 70 | 0.500 | 100 | 0.525 | 0.500 |
| `sort-numeric-ascending` | 0.520 | 16 | 0.469 | 100 | 0.520 | 0.469 |
| `sort-numeric-ascending-2` | 0.506 | 72 | 0.468 | 71 | 0.506 | 0.468 |
| `sort-numeric-ascending-3` | 0.506 | 72 | 0.468 | 71 | 0.506 | 0.468 |
| `sort-numeric-descending` | 0.520 | 16 | 0.469 | 100 | 0.520 | 0.469 |
| `sort-numeric-descending-2` | 0.506 | 72 | 0.468 | 71 | 0.506 | 0.468 |
| `sort-numeric-descending-3` | 0.506 | 72 | 0.468 | 71 | 0.506 | 0.468 |
| `sparkle` | 0.000 | — | 0.000 | — | 0.000 | 0.003 |
| `sparkle-2` | 0.000 | — | 0.000 | — | 0.002 | 0.002 |
| `sparkle-3` | 0.500 | — | 0.000 | — | 0.205 | 0.295 |
| `sparkle-4` | 0.761 | — | 0.761 | — | 0.553 | 0.552 |
| `star` | 0.571 | — | 0.599 | — | 0.497 | 0.582 |
| `store` | 0.483 | 100 | 0.486 | 100 | 0.338 | 0.158 |
| `store-2` | 0.484 | 100 | 0.487 | 88 | 0.468 | 0.334 |
| `sun` | 0.500 | 0 | 0.542 | 0 | 0.500 | 0.735 |
| `table` | 0.494 | 83 | 0.490 | 48 | 0.335 | 0.338 |
| `table-2` | 0.492 | 79 | 0.489 | 79 | 0.283 | 0.284 |
| `target` | 0.542 | — | 0.487 | — | 0.392 | 0.322 |
| `target-2` | 0.539 | 0 | 0.509 | 0 | 0.454 | 0.470 |
| `target-3` | 0.561 | 0 | 0.527 | 0 | 0.579 | 0.535 |
| `text` | 0.480 | 60 | 0.473 | 60 | 0.469 | 0.000 |
| `text-2` | 0.500 | 61 | 0.500 | 61 | 0.500 | 0.603 |
| `text-3` | 0.500 | 69 | 0.500 | 74 | 0.500 | 0.000 |
| `text-4` | 0.524 | 62 | 0.500 | 0 | 0.537 | 0.298 |
| `thumbs-up` | 0.480 | 92 | 0.477 | 78 | 0.226 | 0.282 |
| `thumbs-up-2` | 0.493 | 93 | 0.471 | 74 | 0.208 | 0.327 |
| `toggle-on` | 0.480 | 100 | 0.474 | 100 | 0.287 | 0.301 |
| `toggle-on-2` | 0.475 | 100 | 0.465 | 100 | 0.301 | 0.262 |
| `trash` | 0.500 | 100 | 0.481 | 100 | 0.416 | 0.327 |
| `trash-5` | 0.500 | 100 | 0.482 | 100 | 0.356 | 0.343 |
| `upload` | 0.477 | 53 | 0.467 | 53 | 0.459 | 0.000 |
| `upload-2` | 0.475 | 60 | 0.465 | 57 | 0.457 | 0.000 |
| `upload-3` | 0.480 | 59 | 0.471 | 59 | 0.464 | 0.000 |
| `user` | 0.467 | 100 | 0.450 | 100 | 0.114 | 0.116 |
| `user-2` | 0.470 | 100 | 0.443 | 100 | 0.224 | 0.222 |
| `user-3` | 0.483 | 100 | 0.475 | 100 | 0.199 | 0.190 |
| `user-4` | 0.456 | — | 0.478 | — | 0.000 | 0.235 |
| `users` | 0.465 | 100 | 0.465 | 100 | 0.321 | 0.392 |
| `users-2` | 0.462 | 100 | 0.442 | 100 | 0.250 | 0.368 |
| `users-2-behind` | 0.463 | 100 | 0.453 | 100 | 0.346 | 0.408 |
| `users-2-level` | 0.456 | 100 | 0.451 | 100 | 0.123 | 0.267 |
| `users-2-wide` | 0.458 | 100 | 0.497 | 100 | 0.168 | 0.471 |
| `users-3` | 0.486 | 100 | 0.502 | 100 | 0.232 | 0.325 |
| `users-3-behind` | 0.492 | 100 | 0.500 | 100 | 0.340 | 0.338 |
| `users-3-level` | 0.474 | 100 | 0.497 | 100 | 0.310 | 0.406 |
| `users-3-wide` | 0.466 | 100 | 0.447 | 100 | 0.277 | 0.258 |
| `users-4` | 0.512 | — | 0.504 | — | 0.229 | 0.331 |
| `users-4-behind` | 0.500 | — | 0.493 | — | 0.354 | 0.206 |
| `users-4-level` | 0.474 | — | 0.488 | — | 0.089 | 0.249 |
| `users-4-wide` | 0.500 | — | 0.488 | — | 0.486 | 0.325 |
| `users-behind` | 0.469 | 100 | 0.466 | 100 | 0.383 | 0.362 |
| `users-level` | 0.462 | 100 | 0.420 | 100 | 0.387 | 0.307 |
| `users-wide` | 0.449 | 100 | 0.463 | 100 | 0.225 | 0.430 |
| `volume` | 0.474 | 100 | 0.462 | 100 | 0.155 | 0.168 |
| `volume-low` | 0.474 | 100 | 0.460 | 100 | 0.078 | 0.086 |
| `volume-minus` | 0.479 | 79 | 0.467 | 79 | 0.146 | 0.135 |
| `volume-none` | 0.475 | 100 | 0.460 | 100 | 0.000 | 0.000 |
| `volume-off` | 0.475 | 100 | 0.460 | 100 | 0.036 | 0.078 |
| `volume-plus` | 0.482 | 65 | 0.472 | 65 | 0.226 | 0.213 |
| `volume-x` | 0.475 | 100 | 0.460 | 100 | 0.000 | 0.000 |
| `wallet` | 0.477 | 100 | 0.480 | 88 | 0.246 | 0.227 |
| `wallet-2` | 0.491 | 100 | 0.489 | 85 | 0.147 | 0.098 |
| `wallet-3` | 0.490 | 100 | 0.485 | 100 | 0.220 | 0.220 |
| `wand` | 0.308 | — | 0.308 | — | 0.286 | 0.347 |
| `wand-2` | 0.576 | — | 0.620 | — | 0.284 | 0.453 |
| `wand-3` | 0.860 | — | 0.420 | — | 0.497 | 0.364 |
| `watch` | 0.482 | 64 | 0.413 | 68 | 0.171 | 0.254 |
| `watch-2` | 0.472 | 98 | 0.454 | 97 | 0.261 | 0.225 |
| `watch-3` | 0.488 | 93 | 0.450 | 96 | 0.154 | 0.206 |
| `wrench` | 0.306 | — | 0.450 | — | 0.020 | 0.140 |
| `wrench-2` | 0.306 | — | 0.450 | — | 0.020 | 0.140 |
| `wrench-3` | 0.554 | — | 0.394 | — | 0.020 | 0.048 |
| `x` | — | — | — | — | — | — |
| `x-circle` | 0.480 | — | 0.474 | — | 0.193 | 0.264 |
| `x-circle-small` | 0.480 | — | 0.474 | — | 0.200 | 0.062 |
| `x-large` | — | — | — | — | — | — |
| `x-small` | — | — | — | — | — | — |


## Appendix C. Reproducing this

- `pixelgrid.edgeLanding(file, px)` and `blurScore(file, px, {rate: 32})`, with `px` equal to the master's canvas (24, 20, 16). Judgeable = `runCount > 0 && (diagonalShare ?? 0) < 0.5`.
- Profile table: `pixelgrid.probe([{d: 'M2 y H(canvas−2)', kind: 'stroke', weight}], canvas)` then `rowProfile(ctx, canvas, {rate: 32, window: [canvas/2−2, canvas/2+2]})`; Chromium: the same SVG painted black on white into a canvas of the master's size with `drawImage`, centre column read with `getImageData`.
- Solid-pixel profile of a straight run with centreline `c` and weight `w` at `s` device pixels per unit: coverage of device pixel `k` = overlap of `[k, k+1]` with `[(c−w/2)·s, (c+w/2)·s]`; solid if any is ≥ 0.999; darkest = the maximum. Runs are the straight axis-aligned segments of each stroked path (`M`, `L`, `H`, `V`, closing `Z`), at least 0.5 long.
- Centreline position: the fractional part of `c` (`y` for horizontal runs, `x` for vertical).
- Outer edges: the ink box edges (polyline bounding box ± half the stroke) against whole numbers.
- Bands: lower edge inclusive, on the score rounded to four decimals (so 0.5 exactly is in the upper band).
- `diagonalShare` and every count are as the instrument reports them; the independent recomputation of the landing score used `edgeLanding` only.
- `node --test tools/audit/*.test.mjs` still passes (115) — nothing in `tools/audit/` was edited.
