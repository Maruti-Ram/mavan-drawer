# Findings — apparent weight (F1) and silhouette legibility (F10)

Card 1.5 of `plans/set-and-rules-audit.md`. Measured against **commit `5933041`**: 485 concepts × 3 masters × 2 styles = **2,910 drawings** (lint baseline at the pin: 2,910 · 2,848 clean · 62 warned · 0 failed). Written 2026-10-04.

**Nothing in the set, the rules, lint, the sheet or the board was changed.** This file and `docs/audit/findings-grid.md` are the only things written.

**Independently checked.** A fresh reviewer (Sonnet) who had not seen my scripts re-measured 28 numeric claims from both documents by brute force, and separately with its own numpy rasteriser (own path parser, own arc flattening): all reproduce; the one deviation was a floating-point tie at a band edge (now stated in the grid document). It also found faults in my wording — a wrong cause for `plug-3`, an incomplete account of the `diagonalShare` defect, a relative change measured against the wrong base, one stale table cell — all corrected in this version.

How to read it: the short answer is §0; the evidence is the tables in §2–§4; the judged list is §5; the part only Maruti's eye can settle is §6; appendix A holds the full census, one row per concept.

**Method in one paragraph.** Every ink figure is exact geometry — the audit's own rasteriser geometry (`tools/audit/raster.mjs`), supersampled at **rate 32** (1,024 samples per pixel; rate 64 differs from it by a mean 0.04 px² and at most 0.49 px² over all 2,910 drawings), not a browser render, so two-decimal px² figures are good to about ±0.01 at the 16 master (a stricter run puts `globe-2` at 102.14, not 102.15) and 24-master figures to about ±0.1. **Measured with a bypass, not with `raster.mjs`'s own area and pixel functions:** a bug reported against `classify` was reproduced here and changes 270 filled drawings (§1.1). Outline figures are identical either way. A "px²" is a square unit of that master's own canvas; at the master's own size one unit is one pixel, so it is also "pixels of ink". A cross-check against Chromium on 122 drawings (every 24th file; 41 at 16, 40 at 20, 41 at 24) puts Chromium's total ink at a median −0.7% of these figures (5th to 95th percentile −4.2% to +2.2%; worst −8.8%, on `16/x`); the mean pixel differs by 0.008 of full coverage and the worst single pixel by 0.31. That is less than the "~5% under" quoted for the docs' own renders (`help` 24 scaled to 16: 48.4 there, 51.4 here), so that render path ran lower than this one. Geometry is the reference throughout. Definitions of everything derived are in §1. Kinds of finding follow the plan: **(1)** a drawing disagrees with a stated rule, **(2)** a rule disagrees with another rule or the docs, **(3)** a drawing is fine by every rule and still looks different, and no rule covers it. Every finding is tagged **one-off** or **systemic**.

---

## 0. The short version

**Does a 16px row read with one weight? The stroke does. The ink does not — and in a set built like this it cannot.**

- **The stroke is level.** Every outline at 16 is drawn at 1.25, and nothing hides a heavier line: ink ÷ (line length × stroke) is 1.01 in the median drawing, and only 8 of 485 fall below 0.90 (§3.4).
- **The ink is not.** The 16 outline row runs from 12.2 px² (`minus-small`, 4.8% of the canvas) to 102.2 px² (`globe-2`, 39.9%): **8.4×**. Pooled over all 2,910 drawings it is 3.0% to 64.0%, **21.1×** — wave 0's figures reproduce exactly.
- **At a squint the row is kinder than the ink.** The darkest patch of each icon, after a 1.5 px blur, varies **1.6×** from the 10th to the 90th percentile (the icon at the 90th percentile divided by the one at the 10th: 1.0× would be a perfectly level row); total ink varies **2.9×**. The blur width is my choice; the result holds from 1.0 to 2.5 (§2.4).
- **Where the spread comes from: two populations.** 136 *marks* (a stroke, a few dots) have a median 11.1% of the canvas; 288 *silhouette-keyline objects* have 21.7%. **Inside the objects the row is level**: 82% sit within ±25% of their own median. Of the variance in ink share, 74% is *footprint* (how much of the cell the drawing claims) and 26% is *packing* (how densely it fills its own box).
- **More parts, or too dark?** Not parts. Ink follows line length (rank correlation **0.99** — 1.0 means the two lists are in the same order, 0 means unrelated) and barely follows path count (**0.34**; the median is flat from 2 to 6 paths). The Dense band — 17 drawings, 15 distinct — is heavy because the concept needs that much line: every one of the 15 draws **0.83–1.16×** the line Lucide spends on the same concept (§3.2). Over 97 concepts we can match to Lucide, our line is a median 0.92× theirs, and the order of concepts by line needed correlates **0.92** (§3.5).
- **Where the drawing, not the concept, is the cause** is a short list (§3.4): the two globes (`globe`, `globe-2`, each also filed under `language-2` / `language-3`), the three wands (`wand`, `wand-2`, `wand-3`) and `paintbrush-5`. In them 12–24% of the line lies on top of other line, and the wands hold the darkest local patch in the set. Each is a decision recorded in its own file's note, not a slip.
- **Across masters the order holds** (rank correlation 0.967, 24→16) and the 16 carries a median **24% more ink per canvas** than the 24 (the 20, 10% more) — what the stroke arithmetic predicts (C7). Nothing moves more than one band (§4).
- **The filled row is not level, by nature.** Only 38% of it sits near its median; 22% is Dense (113–164 px², 44–64% of the canvas) — solid discs and cards, up to 3.1× their own outlines (§3.6).
- **No rule or check in the repo speaks about ink quantity**, so nothing here is kind (1). Almost every finding is kind (3). The recommendation is to **not** add a rule that levels ink; see §5.
- **F10 (twenty at 16, squinted, still distinct) is eye-only** (§6). I give the eye a seed list and the exact surface; I do not call a verdict.
- **An instrument bug was reproduced and bypassed while this was being written** (§1.1). It changes ink for 270 of the 1,026 shape-filled drawings (up to 10 px², up to 6.7% of the true ink) and for **no** outline or line-heavy filled drawing. Every wave-0 figure already reported (the 3.04–64.02% range, the 8.4× outline row, `minus-small` 12.17 px², `globe-2` 102.15 px², `message-3-filled` 64.02%) is unchanged.

---

## 1. What was measured, exactly

| Quantity | Definition and instrument | Rate |
|---|---|---|
| **Ink** (px²) | exact inked area of the drawing in that master's units, by the **bypass** (appendix C): the same sample points as `mass.density(file, {rate:32}).area`, every one tested with `region.covered()`. It equals `density().area` on all 1,884 stroke-only files and differs on 270 shape-filled ones (§1.1). Stroke ink and fill ink were also split by building a second region from only the stroke paths and only the area paths (`raster.region`). | 32 |
| **Share of canvas** | ink ÷ canvas² — `density().ofCanvas`. This is the number a row of icons shows, because a row gives every icon the same square. | 32 |
| **Packing** | ink ÷ ink-box area — `density().ofBbox`. Ink box = polyline bounding box ± half the stroke (exact for round caps; agrees with the grid-walked `inkBox` to within one sample step, 0.022 on a 30-drawing sample). **Not a darkness measure for marks**: a `minus` scores 98% and is the "densest" icon in the set (§5, M-7). | 32 |
| **Line length** | centreline length of every stroked path, arcs flattened to chords within 1e-4 (`raster.flatten`). | — |
| **Ink ÷ (line × stroke)** | stroke-only ink ÷ Σ(length × weight). 1.0 = every unit of line adds new ink; below it, line lies on other line. (A lone line with round caps scores a little above 1.) | 32 |
| **Squint peak** | the drawing rasterised at 16 px (bypass), blurred with a separable Gaussian σ = 1.5 px (11 taps, white outside the tile), maximum of the result. *My construct, not an instrument: σ is a choice, not a calibrated eye.* | 32 |
| **Densest 3×3** | maximum over all 3×3-pixel windows of the mean bypass coverage at 16 px. 1.0 = a solid knot. | 32 |
| **Kind** | read from the file's own note: `keyline: mark` → *mark*; else `box:` → *box*; else `anchor:` → *anchor*; else *silhouette* (it is matched against a silhouette keyline). | — |
| **Sibling** | same stem (a trailing `-<n>` and `-small` / `-large` removed) and same size class, byte-identical twins excluded. | — |
| **Band** | multiples of that row's own median ink: Hairline < 0.5× · Light 0.5–0.75× · Level 0.75–1.25× · Full 1.25–1.5× · Dense ≥ 1.5×. The names and the ±25% width of Level are mine. | — |
| **Lucide** | `research/references/lucide` (188 of 189 local files; `images.svg` carries a fill), stroke 2 on 24. Same rasteriser, same rate; circles, rects and lines turned into arcs and lines, 32 Bézier commands flattened to 32 chords each. **Compared by line length per canvas (length ÷ canvas), never by ink**, because Lucide's stroke is 2 and ours is 1.25–1.5. One reference, one independent drawer — a sanity check on "concept or drawing", not a rule source. | 32 |

Reproduced from the wave-0 report before anything else was trusted: min 3.04%, median 20.09%, max 64.02% (`24/minus-small`, `16/message-3-filled`), 21.1× spread; 16 outline lightest `minus-small` 12.17 px², heaviest `language-3` / `globe-2` 102.15 px², then `globe` / `language-2` 90.64, `table` 83.03, `printer` 80.44, `target` 79.74, `bug-2` 79.19. `docs/08-refinement.md` §3.1's `help` numbers also reproduce once the Chromium discount is allowed for: `help` 24 scaled to 16 is 51.39 px² here (docs: 48.4); `help` 16 at 1.25 is 64.51 here (docs/07 C7: 60.9).

---

### 1.1 A bug in `raster.mjs`, and what it did to these numbers

**Reported by a sibling agent; reproduced here independently on 2026-10-04** (line numbers are for `raster.mjs` as read that day, md5 `cf73aa36…`, untracked). `raster.mjs:257` leaves an area path's horizontal edges out of its edge list — correct for the even-odd ray cast, which they never cross. `classify` (`raster.mjs:325-358`) then uses the *same* list to decide whether a box is uniform. A box that straddles a filled shape's horizontal boundary, away from any vertical or curved edge, is therefore called uniform and settled by its centre alone: 0 or 1 where the truth is anything between. `rasterise` and `inkArea` both go through it. `covered()`, the point test, does not, and neither does any stroked path (a stroke segment bounds its own box, horizontal or not).

Minimal reproduction, closed forms worked by hand, `rasterise` at 16 px, rate 32. "Bypass" is a brute-force rasteriser that tests every sample point with `covered()` and never calls `classify` (appendix C):

| Case | Closed form | `rasterise` / `inkArea` | Bypass |
|---|---|---|---|
| filled rectangle, y 2.375 → 13.625 | rows 2 and 13 = 0.625; area 135 | rows 2 and 13 = **1.000**; area **144.0** (+9.0) | 0.625; 135.0 |
| filled rectangle, y 2.375 → 13.375 | row 2 = 0.625, row 13 = 0.375; area 132 | **1.000** and **0.000**; area 132.0 (errors cancel) | 0.625, 0.375; 132.0 |
| filled rectangle, y 2.5 → 13.5 | rows 2 and 13 = 0.5; area 132 | **1.000** and **0.000**; area 132.0 (cancel) | 0.5, 0.5; 132.0 |
| filled rectangle, y 2 → 14 (edges on pixel lines) | rows 2 and 13 = 1; area 144 | exact | exact |
| a 1.25 stroke at y 8.375 (control) | rows 7, 8 = 0.25, 1.00 | exact | exact |
| rounded rectangle, top edge y 2.375 | row 2 = 0.625 along the straight run; area 131.566 | **1.000**; area **137.590** (+6.0) | 0.625; 131.590 |

So "`inkArea` is right only by cancellation" is right: it is exact when a shape's top and bottom edges share a fractional part, and wrong otherwise.

**Scope across the set.** Every one of the 2,910 files re-measured with the bypass at rate 32 — the same sample points as the original run, so the difference is purely the bug — and again at rate 64:

| Drawings | Files | Area paths? | Ink changed by > 0.05 px² | by > 0.5 px² | Largest change |
|---|---:|---|---:|---:|---|
| outline (stroke only) | 1,455 | no | **0** | 0 | 0.000 |
| filled, line-heavy (stroke only) | 429 | no | **0** | 0 | 0.000 |
| filled, shape (has area paths) | 1,026 | yes | **270** | 227 | 10.0 px² (`24/archive-filled`, 235.58 → 245.58, and `24/trash-5-filled`); 6.7% of the true ink (`16/table-filled`, 95.60 → 89.60) |

394 of the 1,026 shape-filled files contain the trigger — a straight horizontal edge at a non-integer y; 270 of those are wrong by more than 0.05 px², 124 are right (errors cancel); not one file without the trigger changed. By master: 24 — 99 files changed; 20 — 78; 16 — 93. At 16, `rasterise` mis-scores 579 pixels in 96 of the 342 shape-filled files; the largest single error is 0.500 (a pixel that is half ink reads 0 or 1).

**Stable to the sampling rate.** At rate 64 the corrected 16 filled median is 75.15 px² (75.17 at 32), its band counts are identical (56 · 86 · 184 · 51 · 108), and the pooled minimum, median and maximum are 3.041% · 20.087% · 64.020% (3.040 · 20.088 · 64.022 at 32). Over all 2,910 files rate 64 differs from rate 32 by a mean 0.04 px² and at most 0.49.

**A second rasteriser agrees.** The reviewer's own numpy rasteriser agrees with the bypass over all 2,910 files to a mean 0.0006 px² and at most 0.023 px² (`24/link-2-filled`), and reproduces the 270 and the 0-of-1,884.

**Independent arbitration.** For the 24 shape-filled files the bug moves most (7–10 px²), Chromium's ink agrees with the bypass to −0.7% … +0.8% (mean pixel difference 0.003–0.007) and disagrees with `classify` by 2.1–7.1% (0.015–0.024). In the 122-drawing sample the worst single-pixel difference falls from 0.498 to 0.308 once the bypass is used; the ink-difference distribution is unchanged (only 9 of the 122 have area paths).

**What it touched in this card, and what it did not.**

- *Affected, re-measured, and stated corrected throughout:* ink for shape-filled drawings and everything derived from it (the filled rows of the census, bands, kinds, path-count and fill tables, drift); the squint peak (69 of 970 16-master drawings, largest change 0.062) and densest 3×3 (5, largest 0.049); the half-tone share (296 files); the filled seed pairs.
- *Not affected:* every outline figure and every line-heavy filled figure (0 of 1,884 files change); every crispness figure in card 1.6 — landing scores come from path geometry (`edgeLanding`), and recomputed here with no rasteriser at all they match `blurScore` to 5e-5, the rounding of the stored values.
- `tools/audit/raster.mjs` was **not edited**. The bypass is 20 lines and lives in appendix C.

**Wave-0 figures already reported, stated against measured** (bypass, rate 32):

| Stated | Measured | |
|---|---|---|
| density range min 3.04%, median 20.09%, max 64.02% | 3.04% (`24/minus-small`, 17.51 px²) · 20.09% · 64.02% (`16/message-3-filled`, 163.90 px²) | holds |
| 21.1× spread | 21.06× | holds |
| 16 outline row spread 8.4× | 8.39× | holds |
| `minus-small` 12.17 px² / 4.75% | 12.17 / 4.75% | holds |
| `language-3`, `globe-2` 102.15 px² / 39.90% | 102.15 / 39.90% | holds |
| `language-2`, `globe` 90.64; `table` 83.03; `printer` 80.44; `target` 79.74; `bug-2` 79.19 | 90.64; 83.03; 80.44; 79.74; 79.19 | holds |
| next lightest: `more-horizontal` / `more-vertical` 13.56; the four `chevron-*-small` 13.81 | 13.56; 13.81 | holds |
| 16 filled heaviest `message-3-filled`, 64.02%; spread 8.6× | 64.02%; 8.56× | holds |
| crispness: 312 judgeable; floor 0.189; median 0.285; max 0.750 | 312; 0.189; 0.285; 0.750 | holds (raster-independent) |
| the 0.70–0.75 band: "plus ×3, minus ×3, chart-bar, menu-3, plug-3, play-2/3, the arrows, all at exactly 0.750" | exactly 0.750: plus ×3, minus ×3, `chart-bar`, `menu-3`. `plug-3` is 0.704, the arrows 0.698–0.699; `play-2` / `play-3` score 0.765 / 0.758 (diagonal-heavy, scored on a curve extreme) | membership holds; "exactly" is true of 8 of them |

Only this card's own filled figures moved (the 16 filled median 75.37 → 75.17 px², the Dense count 110 → 108, and similar; each is stated corrected below).

**A second, smaller instrument defect, found while proving the crispness figures independent (and described correctly only after the reviewer's pass).** `diagonalShare` (`pixelgrid.mjs`, `flattenRuns`) restarts a fragment after every arc, so a closing `Z` joins the last fragment back to *that fragment's* start — the last arc's end — not to the start of the subpath. Two errors follow. When the last command before `Z` is an arc, the closing segment is dropped (21 of the 32 outlines at 16 whose reported share differs from a count of every straight segment). Otherwise a spurious chord is counted in its place (the other 11). A model of that behaviour reproduces the reported `diagonalShare` on all 485 outlines at 16. Four outline drawings change side of the 0.5 line: `alert-triangle` and `alert-triangle-3` (segment dropped) would be diagonal-heavy; `compose-2` and `compose-3` (spurious chord) would be scorable; two filled ones also. The scorable count (312), floor (0.189), median (0.285) and max (0.750) are identical either way. Card 1.6 reports `diagonalShare` as the instrument gives it and says so.

---

## 2. The census

### 2.1 Ink by master and style

All 2,910 drawings. Percent of the canvas unless marked.

| Master | Style | Lightest, % of canvas | p5 | p25 | Median (ink in px²) | p75 | p95 | Heaviest | Heaviest ÷ lightest | p90 ÷ p10 |
|---|---|---|---:|---:|---:|---:|---:|---|---:|---:|
| 24 | outline | 3.0 (`minus-small`) | 4.9 | 11.7 | **15.9** (91.3 px²) | 19.4 | 23.6 | 31.8 (`language-3`) | 10.4× | 3.45× |
| 20 | outline | 4.0 (`minus-small`) | 5.9 | 13.3 | **17.2** (68.8 px²) | 21.0 | 25.3 | 34.5 (`language-3`) | 8.6× | 2.95× |
| 16 | outline | 4.8 (`minus-small`) | 6.8 | 14.9 | **19.1** (48.8 px²) | 23.6 | 28.0 | 39.9 (`language-3`) | 8.4× | 2.89× |
| 24 | filled | 5.0 (`minus-small-filled`) | 7.6 | 16.4 | **29.7** (171.0 px²) | 43.2 | 50.6 | 58.1 (`message-3-filled`) | 11.7× | 5.01× |
| 20 | filled | 5.3 (`minus-small-filled`) | 7.5 | 16.5 | **25.8** (103.1 px²) | 37.4 | 46.0 | 53.5 (`message-3-filled`) | 10.1× | 4.32× |
| 16 | filled | 7.5 (`minus-small-filled`) | 10.3 | 20.0 | **29.4** (75.2 px²) | 42.4 | 54.2 | 64.0 (`message-3-filled`) | 8.6× | 3.76× |

*Pooled:* all 2,910 drawings together: lightest 3.0% (`24/minus-small`), median 20.1%, heaviest 64.0% (`16/message-3-filled`), 21.1×.

Read across: the **outline row spread falls as the master shrinks** (10.4× → 8.6× → 8.4×) while its *median rises* (15.9% → 17.2% → 19.1%) — the 16 is a heavier, tighter row, as C7 intended. The **filled row** is a different animal: its median is nearly double the outline's at 24 (29.7% against 15.9%) and its p90÷p10 is 3.8–5.0×, against 2.9–3.5× for outlines.

### 2.2 The bands

Bands are multiples of the row's own median, so they mean "heavier or lighter than its neighbours in a row of that master and style".

| Master | Style | Row median | Hairline (<0.5×) | Light (≥0.5 to <0.75×) | Level (≥0.75 to <1.25×) | Full (≥1.25 to <1.5×) | Dense (≥1.5×) |
|---|---|---:|---:|---:|---:|---:|---:|
| 24 | outline | 91.3 px² (15.9%) | 73 (15%) | 50 (10%) | 253 (52%) | 87 (18%) | 22 (5%) |
| 20 | outline | 68.8 px² (17.2%) | 53 (11%) | 59 (12%) | 266 (55%) | 94 (19%) | 13 (3%) |
| 16 | outline | 48.8 px² (19.1%) | 53 (11%) | 58 (12%) | 262 (54%) | 95 (20%) | 17 (4%) |
| 24 | filled | 171.0 px² (29.7%) | 112 (23%) | 66 (14%) | 140 (29%) | 67 (14%) | 100 (21%) |
| 20 | filled | 103.1 px² (25.8%) | 76 (16%) | 89 (18%) | 158 (33%) | 60 (12%) | 102 (21%) |
| 16 | filled | 75.2 px² (29.4%) | 56 (12%) | 86 (18%) | 184 (38%) | 51 (11%) | 108 (22%) |

What the 16 outline and filled rows look like band by band:

| Style | Band | Edges (px²) | Actual range at 16 | n | mark / silhouette / box / anchor | Spread through the band |
|---|---|---:|---|---:|---:|---|
| outline | Hairline | 0.0–24.4 | 12.2–24.0 px² (4.8–9.4%) | 53 | 53 / 0 / 0 / 0 | `minus-small`, `check-2-small`, `chevron-left-3`, `menu-3`, `code-2` |
| outline | Light | 24.4–36.6 | 24.7–36.5 px² (9.7–14.3%) | 58 | 46 / 7 / 4 / 1 | `italic`, `play-3`, `arrow-up-right-4`, `maximize-3`, `text` |
| outline | Level | 36.6–61.0 | 36.9–61.0 px² (14.4–23.8%) | 262 | 37 / 183 / 38 / 4 | `play-2`, `bell-3`, `toggle-on`, `wrench`, `package-2` |
| outline | Full | 61.0–73.3 | 61.1–72.9 px² (23.9–28.5%) | 95 | 0 / 82 / 13 / 0 | `desktop-5`, `info-3`, `mail-2`, `gear-2`, `database-3` |
| outline | Dense | 73.3+ | 74.9–102.2 px² (29.3–39.9%) | 17 | 0 / 16 / 1 / 0 | `briefcase`, `store-2`, `package-3`, `printer`, `globe-2` |
| filled | Hairline | 0.0–37.6 | 19.2–36.6 px² (7.5–14.3%) | 56 | 54 / 1 / 1 / 0 | `minus-small`, `check-small`, `check-3-small`, `arrow-up-right-5`, `italic` |
| filled | Light | 37.6–56.4 | 37.8–56.2 px² (14.8–22.0%) | 86 | 50 / 19 / 16 / 1 | `paintbrush-4`, `plus`, `play-3`, `volume-none`, `sliders-3` |
| filled | Level | 56.4–94.0 | 56.5–93.8 px² (22.1–36.6%) | 184 | 32 / 136 / 12 / 4 | `sliders-5`, `megaphone-3`, `attachment`, `gear-3`, `map-pin-3` |
| filled | Full | 94.0–112.8 | 94.6–112.2 px² (36.9–43.8%) | 51 | 0 / 46 / 5 / 0 | `trash`, `at-sign-2`, `file-text-2`, `book-open-2`, `mail` |
| filled | Dense | 112.8+ | 112.9–163.9 px² (44.1–64.0%) | 108 | 0 / 86 / 22 / 0 | `briefcase`, `shield-2`, `camera-5`, `folder-3`, `message-3` |

What the eye sees at 16 (my reading of real-pixel renders, 1× and 6×; the wall in §6 is where Maruti's eye checks it):

- **Hairline** (outline 53 drawings, all marks): a lone small mark — a tick, a chevron, a minus, three dots. Reads like punctuation beside a word.
- **Light** (58; 46 marks): a mark with a little more — a plus, an arrow, a short list — or a sparse object.
- **Level** (262; 54% of the row): a container with one to three details. This is the body of the set, and it reads as one weight.
- **Full** (95): a container with several internal lines. Still reads open.
- **Dense** (17): a container packed with line. In the rendered row the two globes and the table are visibly the darkest blocks.

How wide "Level" should be is a judgement. Within ±25% of the median: **54%** of the 16 outline row; within ±33%: 68%; within ±50%: 86%. For the 288 silhouette-keyline objects alone it is 82%, 92% and 98%.

### 2.3 Two populations: marks and objects

| Style | Master | Kind | n | p10 | p25 | median | p75 | p90 | p90 ÷ p10 | within ±25% of own median |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| outline | 16 | mark | 136 | 6.0 | 7.8 | **11.1** | 14.5 | 18.1 | 3.01× | 38% |
| outline | 16 | silhouette | 288 | 16.4 | 18.1 | **21.7** | 24.7 | 27.2 | 1.66× | 82% |
| outline | 16 | box | 56 | 16.5 | 18.6 | **21.0** | 23.8 | 27.2 | 1.64× | 75% |
| outline | 16 | anchor | 5 | 13.2 | 14.6 | **14.9** | 16.3 | 17.2 | 1.30× | 100% |
| outline | 20 | mark | 136 | 5.0 | 7.0 | **9.4** | 13.0 | 16.0 | 3.16× | 39% |
| outline | 20 | silhouette | 288 | 14.4 | 16.5 | **19.7** | 21.9 | 24.7 | 1.71× | 78% |
| outline | 20 | box | 56 | 14.5 | 16.3 | **18.1** | 21.0 | 24.4 | 1.68× | 71% |
| outline | 20 | anchor | 5 | 12.0 | 13.3 | **13.7** | 14.9 | 15.7 | 1.30× | 100% |
| outline | 24 | mark | 136 | 4.2 | 5.6 | **7.6** | 11.3 | 14.2 | 3.42× | 39% |
| outline | 24 | silhouette | 287 | 13.3 | 15.6 | **18.4** | 20.4 | 23.2 | 1.75× | 76% |
| outline | 24 | box | 57 | 11.7 | 13.0 | **17.0** | 18.9 | 22.1 | 1.90× | 58% |
| outline | 24 | anchor | 5 | 11.3 | 12.5 | **12.9** | 14.1 | 14.9 | 1.32× | 100% |
| filled | 16 | mark | 136 | 8.9 | 12.0 | **16.0** | 21.6 | 27.7 | 3.11× | 45% |
| filled | 16 | silhouette | 288 | 23.5 | 28.3 | **35.0** | 44.7 | 52.9 | 2.25× | 51% |
| filled | 16 | box | 56 | 16.5 | 21.2 | **34.2** | 46.9 | 51.4 | 3.11× | 27% |
| filled | 16 | anchor | 5 | 20.9 | 22.3 | **22.6** | 24.0 | 24.9 | 1.19× | 100% |
| filled | 20 | mark | 136 | 6.4 | 9.1 | **12.1** | 16.6 | 22.3 | 3.47× | 43% |
| filled | 20 | silhouette | 288 | 18.5 | 25.4 | **30.9** | 39.7 | 44.4 | 2.40× | 52% |
| filled | 20 | box | 56 | 15.1 | 16.7 | **31.3** | 39.7 | 45.2 | 2.98× | 27% |
| filled | 20 | anchor | 5 | 19.3 | 20.5 | **21.0** | 22.1 | 22.9 | 1.19× | 100% |
| filled | 24 | mark | 136 | 6.5 | 8.9 | **11.4** | 17.1 | 23.7 | 3.67× | 40% |
| filled | 24 | silhouette | 287 | 20.1 | 28.2 | **36.8** | 46.7 | 49.8 | 2.48× | 49% |
| filled | 24 | box | 57 | 12.8 | 15.2 | **31.5** | 44.7 | 50.9 | 3.98× | 21% |
| filled | 24 | anchor | 5 | 21.4 | 22.6 | **22.9** | 24.2 | 25.0 | 1.17× | 100% |

A mark is light **by nature**, not by anything it did wrong: it is one stroke, and shorter than the box it is allowed (a `chevron-down` at 16 is 10.5 × 5.7 inside a 12 × 12 mark cap; a `minus` is 12 × 1.25). At 16 outline the marks' median is **11.1%** against the objects' **21.7%** — 2.0×. The filled row keeps the same gap (16.0% against 35.0%, 2.2×), because line-heavy filled marks thicken to 2.0 while the objects fill solid.

### 2.4 Three ways to say "weight", and which one is level

| Style | What is being compared at 16 | min | p10 | median | p90 | max | max ÷ min | p90 ÷ p10 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| outline | stroke weight (px, from the file) | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.00× | 1.00× |
| outline | darkest patch at a squint (σ 1.5 px) | 0.261 | 0.348 | 0.468 | 0.546 | 0.699 | 2.68× | 1.57× |
| outline | densest 3×3 patch | 0.42 | 0.52 | 0.66 | 0.77 | 0.98 | 2.35× | 1.49× |
| outline | total ink, px² | 12.2 | 23.4 | 48.8 | 67.8 | 102.2 | 8.39× | 2.89× |
| filled | stroke weight (px, from the file) | — | — | — | — | — | — | — |
| filled | darkest patch at a squint (σ 1.5 px) | 0.358 | 0.520 | 0.837 | 0.987 | 1.000 | 2.79× | 1.90× |
| filled | densest 3×3 patch | 0.66 | 0.76 | 1.00 | 1.00 | 1.00 | 1.51× | 1.32× |
| filled | total ink, px² | 19.2 | 34.3 | 75.2 | 128.9 | 163.9 | 8.56× | 3.76× |

Plain reading: *stroke* is level because the rule fixes it. *The darkest local patch at a squint* is nearly level — p90÷p10 of 1.57× — because the gap floor (1.5) and the stroke (1.25) hold parallel strokes to at most 1.25 ÷ (1.25 + 1.5) = 45% ink. *Total ink* is not level, 2.89×, because drawings differ in how much line they carry. The squint number is only moderately sensitive to the blur width I picked (the kernel reaches 3σ either side, rounded up):

| Blur σ (px) | Kernel taps | outline: max ÷ min | outline: p90 ÷ p10 | outline: rank corr. with ink | filled: max ÷ min | filled: p90 ÷ p10 |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 3 either side | 2.25× | 1.44× | 0.20 | 1.73× | 1.45× |
| **1.5** | **5 either side** | **2.68×** | **1.57×** | **0.30** | **2.79×** | **1.90×** |
| 2 | 6 either side | 2.93× | 1.64× | 0.43 | 3.77× | 2.20× |
| 2.5 | 8 either side | 3.58× | 1.77× | 0.57 | 5.05× | 2.47× |

As the blur widens the squint number converges on total ink, as it must. At any width up to 2.5 px the outline row is more level at a squint than in total ink (2.89×).

*Not measured:* per-angle coverage, the plan's second F1 instrument — whether horizontals, verticals and diagonals of equal width read equally heavy is an eye question and none of this addresses it.

---

## 3. Why a drawing is heavy

### 3.1 Footprint, line, packing — and not parts

Ink share of the canvas = (how big the drawing's box is) × (how much of that box is ink). Taking logs, the variance of one splits exactly into the two:

| Style | Master | carried by footprint (ink-box area ÷ canvas) | carried by packing (ink ÷ ink-box area) |
|---|---:|---:|---:|
| outline | 24 | 82% | 18% |
| outline | 20 | 75% | 25% |
| outline | 16 | 74% | 26% |
| filled | 24 | 57% | 43% |
| filled | 20 | 53% | 47% |
| filled | 16 | 54% | 46% |

For outlines, **three quarters of the spread is footprint** — mostly marks (a 12 × 1.25 bar claims 6% of the cell) against objects (a 14 × 14 container claims 77%) — and a quarter is how densely the box is filled. The filled row is half and half, because a solid fill is the densest packing there is.

Does ink track *parts*? Rank correlation (1.00 = same order, 0 = unrelated):

| Style | Master | ink vs path count | ink vs subpath count | ink vs line length (centreline + outline of fills) | ink vs ink-box area | packing (ink ÷ box) vs path count |
|---|---:|---:|---:|---:|---:|---:|
| outline | 24 | 0.37 | 0.36 | 0.99 | 0.70 | 0.29 |
| outline | 20 | 0.36 | 0.35 | 0.99 | 0.67 | 0.22 |
| outline | 16 | 0.34 | 0.33 | 0.99 | 0.66 | 0.19 |
| filled | 24 | -0.19 | 0.14 | 0.81 | 0.70 | -0.30 |
| filled | 20 | -0.21 | 0.13 | 0.80 | 0.64 | -0.32 |
| filled | 16 | -0.23 | 0.10 | 0.77 | 0.62 | -0.36 |

Outline ink follows **line length at 0.99** — it is, to a good approximation, stroke × line. It follows path count at only 0.34 (16) and the filled row at −0.23: more paths, less ink, because a filled icon that is one solid silhouette is heavy, and one built from several small pieces is not. Median ink at 16 by number of paths in the file:

| Style | Paths in the file | n | p10 | median | p90 | min | max |
|---|---|---:|---:|---:|---:|---:|---:|
| outline | 1 | 83 | 14.7 | **21.8** | 54.7 | 12.2 | 68.6 |
| outline | 2 | 156 | 27.6 | **49.7** | 64.6 | 21.8 | 75.3 |
| outline | 3 | 128 | 37.9 | **55.1** | 71.5 | 13.6 | 102.2 |
| outline | 4 | 77 | 35.5 | **51.7** | 69.5 | 26.1 | 83.0 |
| outline | 5–6 | 34 | 40.1 | **48.4** | 68.5 | 35.5 | 75.8 |
| outline | 7–9 | 6 | 40.9 | **61.5** | 77.9 | 40.7 | 79.2 |
| outline | 10+ | 1 | 68.9 | **68.9** | 68.9 | 68.9 | 68.9 |
| filled | 1 | 170 | 26.1 | **99.5** | 141.1 | 19.2 | 163.9 |
| filled | 2 | 142 | 38.7 | **84.2** | 120.0 | 25.9 | 138.9 |
| filled | 3 | 79 | 44.7 | **62.6** | 112.2 | 19.8 | 146.8 |
| filled | 4 | 64 | 46.4 | **71.2** | 89.0 | 33.2 | 110.3 |
| filled | 5–6 | 25 | 42.3 | **56.9** | 80.4 | 42.3 | 120.7 |
| filled | 7–9 | 5 | 54.2 | **73.4** | 97.2 | 50.7 | 98.3 |

Flat from 2 paths to 6. A detail budget stated in paths (F11) would not level weight; a budget in line length would.

Is line wasted on overlap? Stroke-only ink ÷ (line length × stroke), outlines:

| Master | min | p10 | median | p90 | max | drawings below 0.90 |
|---:|---:|---:|---:|---:|---:|---:|
| 24 | 0.85 | 0.97 | 1.01 | 1.08 | 1.23 | 7 |
| 20 | 0.79 | 0.96 | 1.01 | 1.09 | 1.39 | 7 |
| 16 | 0.76 | 0.96 | 1.01 | 1.09 | 1.32 | 8 |

The median is 1.01: line adds new ink almost everywhere, so the **only** way a drawing can be darker than its line is to bunch line onto itself, and only 7–8 drawings per master do (§3.4).

### 3.2 The heaviest: 17 Dense drawings, 15 distinct

16 outline, at or above 1.5× the row median (73.3 px²). Identical path data is shown with ≡. "Siblings" are the same-stem, same-size numbered variants. "Lucide line vs ours" is our centreline length at 24 ÷ Lucide's for the same concept (1.00 = the same amount of line).

| Drawing (≡ identical path data) | Ink px² (% canvas) | Ink box | Paths | Line length | Siblings: n, ink vs their median | Our line ÷ Lucide’s, 24 (Lucide file) | Ink ÷ (line × stroke) | Densest 3×3 | Verdict |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `globe-2` ≡ `language-3` | 102.2 (39.9%) | 14×14 | 3 | 98.5 | 1: ×1.13 | globe: ×1.13 | 0.83 | 0.69 | Mildly the drawing: tilted-ellipse equator (its note); crowded (0.83) |
| `globe` ≡ `language-2` | 90.6 (35.4%) | 14×14 | 3 | 82.0 | 1: ×0.89 | globe: ×0.94 | 0.88 | 0.69 | Concept: Lucide’s own globe is as crowded (0.91) |
| `table` | 83.0 (32.4%) | 12×12 | 4 | 72.7 | 1: ×1.14 | table: ×0.91 | 0.91 | 0.66 | Concept |
| `printer` | 80.4 (31.4%) | 14×14 | 3 | 66.8 | 1: ×1.07 | printer: ×0.92 | 0.96 | 0.66 | Concept |
| `target` | 79.7 (31.1%) | 14×14 | 3 | 63.6 | 2: ×1.39 | target: ×0.83 | 1.00 | 0.50 | Variant: keeps the rings its siblings drop |
| `bug-2` | 79.2 (30.9%) | 14×14 | 9 | 65.6 | 1: ×1.03 | bug: ×1.00 | 0.97 | 0.68 | Concept (nine paths) |
| `package-3` | 79.1 (30.9%) | 14×14 | 4 | 67.5 | 2: ×1.26 | package: ×0.97 | 0.94 | 0.79 | Variant |
| `book-2` | 78.1 (30.5%) | 10×14 | 3 | 66.6 | 3: ×1.18 | book: ×1.15 | 0.94 | 0.79 | Mildly the drawing (+15% line) |
| `presentation-2` | 77.2 (30.1%) | 14×14 | 4 | 61.5 | 1: ×1.30 | presentation: ×1.16 | 1.00 | 0.71 | Mildly the drawing (+16% line) |
| `bug` | 76.6 (29.9%) | 14×14 | 9 | 64.0 | 1: ×0.97 | bug: ×0.98 | 0.96 | 0.68 | Concept |
| `store-2` | 75.8 (29.6%) | 12×12 | 5 | 65.8 | 1: ×1.06 | store: ×0.98 | 0.92 | 0.71 | Concept |
| `printer-2` | 75.3 (29.4%) | 14×14 | 4 | 62.6 | 1: ×0.94 | printer: ×0.85 | 0.96 | 0.66 | Concept |
| `puzzle-4` | 75.3 (29.4%) | 14×14 | 2 | 61.5 | 4: ×1.27 | puzzle: ×0.95 | 0.98 | 0.66 | Variant |
| `files-4` | 75.1 (29.3%) | 14×14 | 3 | 60.9 | 4: ×1.38 | files: ×1.03 | 0.99 | 0.77 | Variant |
| `briefcase` | 74.9 (29.3%) | 14×12 | 4 | 62.6 | — | briefcase: ×0.86 | 0.96 | 0.71 | Concept: no siblings; 14% under Lucide |

**Verdicts.** None of the 15 is out of line with another drawer: all sit at 0.83–1.16× Lucide's line for the same concept. Three are slightly more the drawing's doing than the concept's.

- **Concept — nothing to fix (8):** `globe` (Lucide's own globe is as crowded: 0.91 ink ÷ line), `table`, `printer`, `printer-2`, `bug`, `bug-2`, `store-2`, `briefcase`.
- **Heavier numbered variant, at the reference's level (4):** `target`, `package-3`, `puzzle-4`, `files-4` carry 1.26–1.39× their siblings' ink and 0.83–1.03× Lucide's line. They are the member of the family that keeps the detail the others drop. A variant is meant to differ; whether the extra weight earns its place is the eye's.
- **Mildly the drawing (3):** `globe-2` (+13% over Lucide's `globe` and over our `globe`: its equator is an ellipse, "Nucleo's construction" per its note), `book-2` (+15%, ×1.18 its siblings), `presentation-2` (+16%, ×1.30). Still within 1.16× — a nudge, not an outlier.

### 3.3 The lightest: 53 Hairline drawings, 25 distinct, all marks

| Drawing (same ink = same drawing, flipped or turned) | Ink px² (% canvas) | Kind | Siblings: n, ink vs their median | Our line ÷ Lucide’s, 24 (Lucide file) |
|---|---:|---|---:|---:|
| `minus-small` | 12.2 (4.8%) | mark | — | — |
| `more-horizontal`, `more-vertical` | 13.6 (5.3%) | mark | — | — |
| `chevron-down-small`, `chevron-left-small`, `chevron-right-small`, `chevron-up-small` | 13.8 (5.4%) | mark | 2: ×0.92 | — |
| `chevron-down-2-small`, `chevron-up-2-small`, `chevron-left-2-small`, `chevron-right-2-small` | 14.7 (5.7%) | mark | 2: ×1.00 | — |
| `minus` | 14.7 (5.7%) | mark | — | minus: ×0.96 |
| `chevron-down-3-small`, `chevron-left-3-small`, `chevron-right-3-small`, `chevron-up-3-small` | 15.4 (6.0%) | mark | 2: ×1.08 | — |
| `check-2-small` | 16.5 (6.4%) | mark | 3: ×0.93 | — |
| `check-small` | 16.5 (6.4%) | mark | 3: ×0.93 | — |
| `minus-large` | 17.2 (6.7%) | mark | — | — |
| `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up` | 17.3 (6.8%) | mark | 2: ×0.94 | — |
| `chevron-up-2`, `chevron-down-2`, `chevron-left-2`, `chevron-right-2` | 17.5 (6.8%) | mark | 2: ×0.95 | — |
| `check-4-small` | 17.8 (6.9%) | mark | 3: ×1.08 | — |
| `check-3-small` | 18.3 (7.2%) | mark | 3: ×1.11 | — |
| `chevron-left-3`, `chevron-right-3`, `chevron-up-3`, `chevron-down-3` | 19.4 (7.6%) | mark | 2: ×1.12 | — |
| `check-2` | 20.0 (7.8%) | mark | 3: ×0.92 | check: ×0.89 |
| `check` | 20.0 (7.8%) | mark | 3: ×0.92 | check: ×0.89 |
| `chevron-down-2-large`, `chevron-left-2-large`, `chevron-right-2-large`, `chevron-up-2-large` | 20.6 (8.0%) | mark | 2: ×0.93 | — |
| `chevron-down-large`, `chevron-left-large`, `chevron-right-large`, `chevron-up-large` | 20.9 (8.2%) | mark | 2: ×0.95 | — |
| `check-4` | 21.8 (8.5%) | mark | 3: ×1.09 | check: ×0.99 |
| `menu-3` | 21.8 (8.5%) | mark | 3: ×0.74 | — |
| `check-3` | 22.4 (8.7%) | mark | 3: ×1.12 | check: ×1.00 |
| `plus-small` | 22.8 (8.9%) | mark | — | — |
| `chevron-down-3-large`, `chevron-left-3-large`, `chevron-right-3-large`, `chevron-up-3-large` | 23.4 (9.2%) | mark | 2: ×1.13 | — |
| `arrow-up-right-5` | 23.9 (9.3%) | mark | 4: ×0.81 | — |
| `code-2` | 24.0 (9.4%) | mark | 1: ×0.79 | — |

**Verdict: concept and size, never the drawing.** All 53 are `keyline: mark` glyphs — a single stroke (chevron, check, minus), a plus, or three dots. Siblings agree within ×0.74–1.13. Where Lucide has the same mark at default size the line is level: `minus` ×0.96, `check` ×0.89, `check-4` ×0.99, `check-3` ×1.00. These are light because a single stroke is little ink, and a `-small` is, by C8, a further 2 units shorter at 16.

### 3.4 Where the drawing is the cause: crowded line

A drawing is **crowded** when its line lies on top of other line (ink ÷ (line × stroke) below 0.90) or when it forms a solid knot (a 3×3 pixel window ≥ 0.90 inked).

| Drawing | Ink px² at 16 | Ink ÷ (line × stroke), 16 | 20 | 24 | Densest 3×3 patch, 16 | Squint peak, 16 |
|---|---:|---:|---:|---:|---:|---:|
| `wand-2` | 39.8 | 0.76 | 0.79 | 0.86 | 0.98 | 0.69 |
| `globe-2` | 102.2 | 0.83 | 0.82 | 0.85 | 0.69 | 0.60 |
| `language-3` | 102.2 | 0.83 | 0.82 | 0.85 | 0.69 | 0.60 |
| `wand-3` | 25.9 | 0.83 | 0.82 | 0.90 | 0.95 | 0.65 |
| `paintbrush-5` | 35.6 | 0.84 | 0.85 | 0.85 | 0.78 | 0.56 |
| `wand` | 56.2 | 0.87 | 0.91 | 0.90 | 0.97 | 0.70 |
| `globe` | 90.6 | 0.88 | 0.88 | 0.90 | 0.69 | 0.55 |
| `language-2` | 90.6 | 0.88 | 0.88 | 0.90 | 0.69 | 0.55 |

- **`globe-2` / `language-3`, `globe` / `language-2`** — the globe family is crowded in every set (Lucide's `globe` scores 0.91 on the same measure), but ours is more so, and `globe-2` is the heaviest drawing in the set: a ring, a meridian ellipse and a tilted equator ellipse inside 14 units. Crowding is also why its filled twin is *lighter* than its outline (§7). **Decision on record:** `globe-2`'s note — "Nucleo's construction: the equator drawn as a horizontal ellipse".
- **`wand`, `wand-2`, `wand-3`** — the only drawings with a densest 3×3 at or above 0.90 (0.95–0.98), and the darkest three at a squint of the whole set (0.65–0.70). The cause is the sparks: each is drawn **solid by decision** — `wand`'s note reads "the round join inks its tips, so it is solid in both styles". At 16 `wand` is also cluttered (a banded rod and three sparks inside 12 units). Line length does not settle whether the wands are heavy for their concept, because the concept is ambiguous: our `wand` is 0.92× Lucide's `wand-sparkles` (the nearest like-for-like, an outlined wand with sparks) and 2.90× Lucide's plain `wand` (a single stick with ray strokes).
- **`paintbrush-5`** — 0.84–0.85 at all three masters. Its handle is "a slim solid that swells between two points" made of two arcs (note), 2 units wide at its fullest at 16 under a 1.25 stroke, so the lens inks solid. A recorded decision.

The other 18 drawings with a densest 3×3 of 0.85–0.88 (the `arrow-up-right` and `external-link` arrowheads, `refresh`, `files`, `sort-alpha-*`, `maximize-4`, `presentation`, `volume-off`) are mostly corners and crossings: two 1.25 strokes meeting at 90° ink a solid 2×2 block and its neighbours. A junction, not a fault, and not counted here.

### 3.5 The baseline: is 8.4× a lot?

Same measure, a stroke-2 outline set on the same 24 grid. Lucide's heaviest are sheet, globe, building-complex, target, table, earth, layout-grid, printer, save, database, briefcase, computer; its lightest are minus, chevron-down, chevron-left, chevron-right, chevron-up, ellipsis-vertical, ellipsis, check — **the same concepts** that are heaviest and lightest here (`globe`, `target`, `table`, `printer`, `save`, `database`, `briefcase` at the top; `minus`, the chevrons, `ellipsis`, `check` at the bottom).

| Set | n | lightest % | p10 | median | p90 | heaviest % | heaviest ÷ lightest | p90 ÷ p10 | stroke |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Lucide (188 local files, 24 grid) | 188 | 5.4 | 14.1 | 25.2 | 33.2 | 40.5 | 7.5× | 2.36× | 2 on 24 (8.3%) |
| ours, 24 outline | 485 | 3.0 | 6.5 | 15.9 | 22.4 | 31.8 | 10.4× | 3.45× | 1.5 on 24 (6.3%) |
| ours, 16 outline | 485 | 4.8 | 9.2 | 19.1 | 26.5 | 39.9 | 8.4× | 2.89× | 1.25 on 16 (7.8%) |

That table mixes different icon populations, so the fair comparison is stroke-free and like-for-like: line length per canvas on the **97 concepts present in both** (full list in appendix B).

| On the 97 matched concepts | lightest | median | heaviest | max ÷ min | p90 ÷ p10 |
|---|---:|---:|---:|---:|---:|
| ours, 24 master | 0.56 | 2.81 | 4.97 | 8.84× | 2.49× |
| ours, 16 master | 0.67 | 2.75 | 5.13 | 7.63× | 2.27× |
| Lucide, 24 grid | 0.58 | 3.05 | 5.29 | 9.07× | 2.64× |

*(Line length ÷ canvas; 1.0 means the centreline is as long as the canvas is wide.)* Our spread is no wider than Lucide's for the same concepts. The rank correlation of concepts by line needed is **0.92** (24 master) and **0.90** (16 master). At 24, our line ÷ Lucide's has a median **0.92** (10th to 90th percentile 0.80–1.04); 69 of 97 concepts are within ±15% of 1.00, 25 are lighter, and only 3 are heavier: `volume` 1.27 (C28 — two waves where Lucide's `volume-1` has one), `lightbulb` 1.27, `user` 1.26. I checked every pair by eye in a ours-beside-Lucide sheet: they are the same concept, with two caveats — `wand` has two Lucide candidates (§3.4), and `volume` is deliberately a different drawing.

**So the 8.4× is the concepts' spread, not ours.** Any constant-stroke outline set of globes and chevrons has it.

### 3.6 The filled row

Heaviest 22 families at 16 filled, with the family's range and how much of the ink is fill:

| Family (drawings in it) | Heaviest member | Ink px² (% canvas) | Range across the family, px² | Share of ink that is fill | vs its outline twin | Kind | Verdict |
|---|---|---:|---:|---:|---:|---|---|
| `message` (7) | `message-3` | 163.9 (64.0%) | 97.0–163.9 | 100% | ×3.09 | silhouette | Variant: the solid member of a family spanning 97.0–163.9 px² |
| `camera` (6) | `camera-6` | 148.4 (58.0%) | 105.2–148.4 | 100% | ×2.13 | box | Variant: the solid member of a family spanning 105.2–148.4 px² |
| `files` (5) | `files-4` | 146.8 (57.3%) | 78.0–146.8 | 100% | ×1.95 | silhouette | Variant: the solid member of a family spanning 78.0–146.8 px² |
| `desktop` (6) | `desktop-5` | 146.7 (57.3%) | 103.5–146.7 | 93% | ×2.40 | silhouette | Variant: the solid member of a family spanning 103.5–146.7 px² |
| `folder` (3) | `folder` | 146.7 (57.3%) | 134.4–146.7 | 100% | ×2.72 | box | Concept: a solid shape; the 3 members agree within 8% |
| `check-circle` (6) | `check-circle-small` | 143.8 (56.2%) | 141.7–143.8 | 100% | ×2.44 | silhouette | Concept: a solid shape; the 6 members agree within 1% |
| `alert-circle` (4) | `alert-circle` | 143.5 (56.0%) | 141.3–143.5 | 100% | ×2.45 | silhouette | Concept: a solid shape; the 4 members agree within 2% |
| `info` (3) | `info` | 143.5 (56.0%) | 138.0–143.5 | 100% | ×2.45 | silhouette | Concept: a solid shape; the 3 members agree within 4% |
| `minus-circle` (2) | `minus-circle-small` | 142.8 (55.8%) | 140.8–142.8 | 100% | ×2.52 | silhouette | Concept: a solid shape; the 2 members agree within 1% |
| `clock` (1) | `clock` | 142.3 (55.6%) | 142.3–142.3 | 100% | ×2.43 | silhouette | Concept: one drawing, a solid shape |
| `ban` (3) | `ban-3` | 140.9 (55.0%) | 95.4–140.9 | 100% | ×2.36 | silhouette | Variant: the solid member of a family spanning 95.4–140.9 px² |
| `help` (4) | `help-3` | 138.9 (54.3%) | 135.3–138.9 | 100% | ×2.23 | silhouette | Concept: a solid shape; the 4 members agree within 3% |
| `plus-circle` (2) | `plus-circle-small` | 138.8 (54.2%) | 135.3–138.8 | 100% | ×2.25 | silhouette | Concept: a solid shape; the 2 members agree within 3% |
| `target` (3) | `target-2` | 135.6 (53.0%) | 83.4–135.6 | 100% | ×2.04 | silhouette | Variant: the solid member of a family spanning 83.4–135.6 px² |
| `puzzle` (5) | `puzzle-4` | 135.6 (53.0%) | 122.9–135.6 | 100% | ×1.80 | silhouette | Concept: a solid shape; the 5 members agree within 9% |
| `x-circle` (2) | `x-circle-small` | 135.4 (52.9%) | 132.9–135.4 | 100% | ×2.10 | silhouette | Concept: a solid shape; the 2 members agree within 2% |
| `face-neutral` (1) | `face-neutral` | 134.0 (52.4%) | 134.0–134.0 | 100% | ×2.13 | silhouette | Concept: one drawing, a solid shape |
| `presentation` (2) | `presentation-2` | 133.4 (52.1%) | 120.7–133.4 | 90% | ×1.73 | silhouette | Concept: a solid shape; the 2 members agree within 9% |
| `face-sad` (1) | `face-sad` | 133.1 (52.0%) | 133.1–133.1 | 100% | ×2.10 | silhouette | Concept: one drawing, a solid shape |
| `wallet` (3) | `wallet-2` | 132.0 (51.6%) | 112.0–132.0 | 100% | ×2.14 | silhouette | Concept: a solid shape; the 3 members agree within 15% |
| `printer` (2) | `printer-2` | 131.6 (51.4%) | 114.2–131.6 | 100% | ×1.75 | silhouette | Concept: a solid shape; the 2 members agree within 13% |
| `building` (4) | `building-4` | 131.5 (51.4%) | 123.8–131.5 | 92% | ×1.81 | silhouette | Concept: a solid shape; the 4 members agree within 6% |

The Dense band of the filled row is 108 drawings (22%): every disc-with-a-glyph family (`check-circle`, `alert-circle`, `info`, `minus-circle`, `plus-circle`, `x-circle`, `help`, `clock`, `face-*`) sits at 133–144 px² (52–56% of the canvas) — a solid 14-diameter disc is 153.9 px² before the glyph is cut — and the members of each family are within a few percent of each other. **Concept, not drawing.** `message-3` (64.0%) and `message-5` are solid chat bubbles; `camera-6`, `files-4`, `desktop-5`, `folder` are solid cards. The families whose range is wide (`message`, `camera`, `files`, `desktop`, `ban`, `target`) are numbered variants of which the heavy one is the solid construction; the verdict column says which. At the other end the filled Hairline band (56 drawings) is 54 marks plus `wand-3-filled` and `italic-filled` — the line-heavy marks thicken to 2.0 and stay light. Their ink is **1.7–3.1× their own outlines**:

| Master | line-heavy filled (n) | min | median | max | shape-filled (n) | min | median | max |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 24 | 143 | 1.23 | 1.55 | 1.78 | 342 | 0.95 | 1.98 | 3.63 |
| 20 | 143 | 1.01 | 1.28 | 1.41 | 342 | 0.75 | 1.62 | 2.96 |
| 16 | 143 | 1.19 | 1.49 | 1.66 | 342 | 0.71 | 1.64 | 3.09 |

A filled row of mixed icons will therefore never read with one weight: a disc beside a `minus` is 143.5 against 23.2 px² — **6.2×** — and the rule behind it is the filled style itself (CLAUDE.md, Settled table, "Styles": shapes fill, line-heavy icons thicken). The filled twin of a line-heavy icon is 1.19–1.66× its outline at 16 (median 1.49); of a shape-filled icon 0.71–3.09× (median 1.64). Whether that spread is the filled style's intent belongs to card 1.8.

---

## 4. Across the three masters

Ratio of ink share, master ÷ the 24 master, per concept:

| Style | Ratio of ink share | min | p5 | p25 | median | p75 | p95 | max | concepts within ±20% of the median (of 485) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| outline | 20 ÷ 24 | 0.89 | 0.99 | 1.07 | **1.10** | 1.14 | 1.28 | 1.44 | 481 |
| outline | 16 ÷ 24 | 0.90 | 1.07 | 1.19 | **1.24** | 1.31 | 1.49 | 1.63 | 447 |
| filled | 20 ÷ 24 | 0.75 | 0.80 | 0.86 | **0.91** | 0.99 | 1.08 | 1.31 | 463 |
| filled | 16 ÷ 24 | 0.78 | 0.87 | 0.98 | **1.08** | 1.25 | 1.44 | 1.56 | 342 |

The 16 outline carries a median 24% more ink per canvas than the 24 and the 20 carries 10% more. Stroke arithmetic alone says 1.20× and 1.25× (stroke ÷ canvas: 6.25%, 7.5%, 7.8%); the 20 comes in under because its square keyline is 70% of the canvas against 75% at 24 and 16. **447 of 485 concepts sit within ±20% of the 16's median ratio (1.236, shown as 1.24)**; 481 of 485 at the 20.

Does the order hold?

| Style | Rank correlation 24 vs 20 | Rank correlation 24 vs 16 | Band, 24 → 20: same / one step / two or more | Band, 24 → 16: same / one step / two or more |
|---|---:|---:|---:|---:|
| outline | 0.985 | 0.967 | 425 / 60 / 0 | 403 / 82 / 0 |
| filled | 0.989 | 0.975 | 395 / 90 / 0 | 330 / 152 / 3 |

Yes. At 16 outline, 403 of 485 concepts sit in the *same band* as at 24 and 82 move one step; **none moves two**. The filled style is less stable (152 move one step; `gear-2`, `keyboard` and `printer` move two).

The concepts that drift most (outline, 16 ÷ 24):

- **Heavier at 16:** `x-small` ×1.63 (6.4→10.4%, 2→2 paths); `grid-4` ×1.57 (13.3→20.8%, 9→9 paths); `minus-small` ×1.56 (3.0→4.8%, 1→1 paths); `plus-small` ×1.56 (5.7→8.9%, 2→2 paths); `x` ×1.54 (8.6→13.2%, 2→2 paths); `sort-alpha-descending` ×1.52 (13.8→21.1%, 5→5 paths); `sort-alpha-ascending` ×1.52 (13.8→21.1%, 5→5 paths); `sort-alpha-descending-3` ×1.52 (12.5→19.0%, 6→6 paths). The small marks gain because the glyph shrinks by C8's step while the stroke cannot; `grid-4` is a field of dots, whose 16 radii were grown to keep their ink (C17, dated 2026-09-20). I did not look into `sort-alpha-*`.
- **Lighter or level at 16:** `sliders-3` ×0.90 (20.2→18.1%, 9→6 paths); `files-5` ×0.91 (23.6→21.5%, 5→3 paths); `users-3-level` ×0.97 (16.3→15.8%, 4→4 paths); `copy` ×1.00 (17.1→17.2%, 2→2 paths); `play-3` ×1.01 (11.3→11.3%, 1→1 paths); `images` ×1.01 (23.2→23.4%, 4→3 paths); `images-2` ×1.01 (23.2→23.4%, 4→3 paths); `images-3` ×1.01 (23.2→23.4%, 4→3 paths). These are drawings that lose parts at 16 (`sliders-3` 9→6 paths, `files-5` 5→3, `images` 4→3).

No concept's density reverses: the lowest ratio in the set is 0.90.

---

## 5. Judged list

**M-1 · kind (3) · systemic · concept — do not level it.** *A `globe-2` beside a `check` reads as a dark ball beside a thin tick:* 102.2 against 20.0 px² (5.1×). The line is the same 1.25 on both; the globe has 6.6× the line (98.5 against 15.0 units). Lucide draws the same concepts with the same spread (line per canvas 9.1× against our 8.8×; 0.92 rank correlation). A rule that tried to level ink would mean drawing a thinner globe or a longer tick, and breaks the keylines. **Recommendation: no rule; no change.** If Maruti's eye objects, the lever is the size variants (`-large` marks), not the stroke.

**M-2 · kind (3) · systemic · settle on the wall.** *Marks and objects are two weights.* Median 11.1% against 21.7% at 16 (2.0×); the same 2.2× in the filled row. By keyline, not by fault. The wall (card 4.1) should show rows that mix a chevron or a plus with a folder or a calendar, because the eye's answer on *those* rows decides whether `-large` marks, or heavier marks, are wanted.

**M-3 · kind (3) · one-off ×3 families · eye, then Maruti.** *Crowded line:* the two globes, the three wands, `paintbrush-5` (§3.4). 8 drawings; the only heavy-for-its-line drawings in the set. The wands' solid sparks are a recorded decision; the globes' crowding is shared with the reference. Look at them at real 16 in a row of eight neighbours before touching anything.

**M-4 · kind (3) · systemic · hand to the detail-budget card (F11).** *Parts do not predict weight.* Rank correlation of ink with path count 0.34 (outline), −0.23 (filled); with line length 0.99 / 0.77. Median ink is flat from 2 to 6 paths. If a "detail budget per master" rule is drafted (docs/09 §4), measure it in line length or ink, not paths.

**M-5 · kind (3) · systemic · hand to card 1.8.** *The filled row is not level by construction:* 38% Level, 22% Dense — discs and cards at 52–64% of the canvas beside marks with a median of 16%. Within a disc family the members agree to a few percent, so no filled drawing is wrong against its relatives; the question is whether the filled *style* wants to be that uneven.

**M-6 · kind (3) · systemic, by construction · nothing to fix.** *The 16 is heavier than the 24:* median +24% ink per canvas (+10% at 20), the order intact (0.967), no concept more than one band away. This is C7's stated outcome ("the small master is still a touch heavier"), now measured. **One-off** outliers worth a glance: `x-small` ×1.63, `minus-small` and `plus-small` ×1.56, `x` ×1.54 (the stroke cannot shrink with the glyph), `grid-4` ×1.57.

**M-7 · kind (2) · one-off · note for waves 3–4.** The plan lists F1's instrument as "ink area ÷ bbox" (`plans/set-and-rules-audit.md:251`). That number (`ofBbox`) ranks a `minus` as the densest icon in the set (98%). For a row of icons the right sort key is share of canvas (`ofCanvas`, ink in px²), as the instrument's own header says. The wall should sort on that.

**M-8 · passing note · see §7.** Fourteen sets of names carry identical path data; five coincide at 16 only.

---

## 6. F10 — silhouette legibility is eye-only

*Can twenty icons at 16 px, squinted, still be told apart?* That is recognition, not ink. Nothing in the repo measures it, no number in this document answers it, and I do not call a verdict. I looked at rendered rows of 20 myself and saw nothing alarming; that is my reading of a screenshot, not the eye the question belongs to.

**What I can give the eye is a seed.** I rasterised every 16 master (bypass, rate 32), blurred it at σ 1.0 px, and ranked cross-stem pairs by cosine similarity (1.0 = the same picture), one row per distinct pair of stems. It is uncalibrated — any two icons built on a ring score high because of the ring — so it is a *shortlist to look at*, not evidence. The closest outline pairs:

| Cosine | Pair (outline, 16) |
|---:|---|
| 0.9988 | `users-2-wide` / `users-wide` (one family, C27 — meant to differ by one figure) |
| 0.9970 | `info` / `alert-circle` |
| 0.9940 | `x-circle-small` / `plus-circle-small` |
| 0.9916 | `help-3` / `alert-circle-2` |
| 0.9910 | `x-circle` / `compass-2` |
| 0.9897 | `users-2-behind` / `users-behind` (one family, C27 — meant to differ by one figure) |
| 0.9893 | `minus-circle` / `check-circle-small` |
| 0.9890 | `volume-plus` / `volume-x` |
| 0.9885 | `plus-circle` / `compass-2` |
| 0.9883 | `face-sad` / `face-neutral` |

Filled is the same story: `users-2-wide` / `users-wide` 0.9990, `plus-circle-small` / `x-circle-small` 0.9982, `help-3` / `alert-circle-2` 0.9980, `info` / `alert-circle` 0.9979, `check-circle-small` / `minus-circle-small` 0.9973, `clock` / `alert-circle-2` 0.9967. The risk sits in the **circle-with-a-mark families** — the pairs that mean opposite things (add / close, alert / info) differ only by the glyph inside a ring that is identical at 16. Separately, **22 outline pairs and 7 filled pairs are the same drawing at 16** (§7): the eye is being asked to tell apart things that are not different.

**The surface that settles it** is the wall, `lab/audit-wall.html` (card 4.1), in a mode I would call **Twenty at 16**:

1. Twenty drawings in one row at **real 16 px** — one CSS pixel per drawing pixel, no smoothing between them — plus a 2× toggle, icon colour = body text, on both lab backgrounds. **Names hidden.**
2. A **squint control**: a blur from 0 to 2.5 px, default 1.5 (the width used for the squint number in this document, so the two can be compared).
3. **Outline | Filled** (F) and a master switch (24 · 20 · 16), because the answer differs by master and style.
4. Draw modes: (a) twenty random from the whole set; (b) one family — all circle-with-a-mark icons together; (c) the seed pairs above side by side; (d) the **whole set sorted by ink** (px², Appendix A) and by squint number, in rows of twenty — the same surface that settles whether a 16px row reads level (F1).
5. The judgement is Maruti's. He clicks any icon he cannot name or would confuse; the page lists them with the nearest neighbour so the list can be pasted back.

The data this document supplies for it: Appendix A (ink px², band, squint peak, per drawing) and the seed pairs above. The cosine list for all 117,370 pairs per style is reproducible with the recipe in appendix C.

---

## 7. Noticed in passing (belongs to other cards)

- **Identical drawings under different names — card 1.10 / 1.1.** 14 sets of names share byte-identical path data at one or more masters (43 master × style groups, 98 files). *Pure aliases at every master and style:* `globe` ≡ `language-2`, `globe-2` ≡ `language-3`. *Outline-only, all masters:* `ban` ≡ `ban-2`, `building-3` ≡ `building-4`, `compass` ≡ `compass-3`, and the four `layout-*` regions (`layout-footer`, `-header`, `-sidebar`, `-sidebar-right`, each `` / `-2` / `-3`) — by C29, the outline is shared and only the filled treatment differs. *Both styles, at 16 only:* `camera` ≡ `camera-5`, `files` ≡ `files-5`, `help` ≡ `help-2`, `microphone-2` ≡ `microphone-5`, `text` ≡ `text-4` — the "four names for one picture at two masters" problem Maruti cut for the layout links on 2026-10-03 (docs/07 C29), alive for five more pairs. Every ranking above lists such a pair once.
- **A filled twin lighter than its outline — card 1.8.** `globe-2-filled` and `language-3-filled` carry 0.71× their outlines' ink at 16 (`globe`, `language-2`: 0.98×). The filled globe is a disc with bands cut out of it.
- **The plan's F1 instrument — see M-7.**
- **Seven files contain a zero-length arc** (an `A` whose end point is its start point): `paintbrush-4` and `paintbrush-4-filled` at 24 and 20 (`A7 7 0 0 1 3.75 19.5`, starting and ending at 3.75 19.5), and `chart-pie-3-filled` at 24, 20 and 16 (found by the independent reviewer). SVG omits such an arc and `raster.mjs` happens to do the same; no number here changes. A candidate for lint.

---

## Appendix A. The full census — one row per concept

All 485 concepts. **O / F** = outline / filled; **24 · 20 · 16** = master; ink as % of the master's canvas; **px²** = ink at 16. **O16÷O24** = ink-share ratio. **Band** = H Hairline · L Light · Lv Level · F Full · D Dense, relative to the 16 outline or 16 filled row median (48.8 px² · 75.2 px²). **Kind** from the file note. **Squint** = peak after σ 1.5 px blur, 0–1. The last column names other concepts whose 16 outline has identical path data.

| concept | kind | O24 | O20 | O16 | O16 px² | F24 | F20 | F16 | F16 px² | O16÷O24 | band O16 | band F16 | squint O16 | squint F16 | O16 = (same path data) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---:|---:|---|
| `alert-circle` | silhouette | 18.0 | 20.0 | 22.9 | 58.6 | 50.9 | 47.0 | 56.0 | 143.5 | 1.27 | Lv | D | 0.34 | 0.96 |  |
| `alert-circle-2` | silhouette | 18.7 | 20.4 | 23.5 | 60.2 | 50.1 | 46.5 | 55.4 | 141.9 | 1.26 | Lv | D | 0.35 | 0.96 |  |
| `alert-circle-3` | silhouette | 18.1 | 20.2 | 23.0 | 58.8 | 50.7 | 46.7 | 55.6 | 142.4 | 1.27 | Lv | D | 0.35 | 0.96 |  |
| `alert-circle-4` | silhouette | 18.8 | 20.6 | 23.6 | 60.4 | 49.9 | 46.3 | 55.2 | 141.3 | 1.25 | Lv | D | 0.36 | 0.95 |  |
| `alert-triangle` | box | 17.9 | 19.2 | 22.0 | 56.3 | 40.4 | 37.8 | 44.7 | 114.3 | 1.23 | Lv | D | 0.38 | 0.93 |  |
| `alert-triangle-2` | box | 18.5 | 19.3 | 22.3 | 57.2 | 39.6 | 37.7 | 44.3 | 113.4 | 1.20 | Lv | D | 0.40 | 0.93 |  |
| `alert-triangle-3` | box | 18.0 | 19.5 | 22.2 | 56.9 | 40.2 | 37.5 | 44.2 | 113.1 | 1.24 | Lv | D | 0.38 | 0.91 |  |
| `alert-triangle-4` | box | 18.7 | 19.5 | 22.4 | 57.4 | 39.4 | 37.4 | 43.8 | 112.2 | 1.20 | Lv | F | 0.40 | 0.91 |  |
| `archive` | silhouette | 20.6 | 22.3 | 25.0 | 64.1 | 42.6 | 35.1 | 39.7 | 101.7 | 1.22 | F | F | 0.51 | 0.89 |  |
| `arrow-down` | mark | 6.7 | 8.6 | 10.1 | 25.8 | 10.3 | 10.9 | 14.8 | 37.9 | 1.50 | L | L | 0.54 | 0.75 |  |
| `arrow-down-2` | mark | 8.2 | 10.2 | 12.2 | 31.2 | 12.7 | 13.1 | 18.1 | 46.4 | 1.48 | L | L | 0.55 | 0.76 |  |
| `arrow-down-3` | mark | 6.8 | 8.8 | 10.2 | 26.0 | 10.6 | 11.3 | 15.1 | 38.7 | 1.49 | L | L | 0.51 | 0.73 |  |
| `arrow-down-4` | mark | 8.2 | 10.5 | 12.2 | 31.3 | 11.9 | 14.3 | 17.5 | 44.7 | 1.49 | L | L | 0.46 | 0.90 |  |
| `arrow-left` | mark | 6.7 | 8.6 | 10.1 | 25.8 | 10.3 | 10.9 | 14.8 | 37.9 | 1.50 | L | L | 0.54 | 0.75 |  |
| `arrow-left-2` | mark | 8.2 | 10.2 | 12.2 | 31.2 | 12.7 | 13.1 | 18.1 | 46.4 | 1.48 | L | L | 0.55 | 0.76 |  |
| `arrow-left-3` | mark | 6.8 | 8.8 | 10.2 | 26.0 | 10.6 | 11.3 | 15.1 | 38.7 | 1.49 | L | L | 0.51 | 0.73 |  |
| `arrow-left-4` | mark | 8.2 | 10.5 | 12.2 | 31.3 | 11.9 | 14.3 | 17.5 | 44.7 | 1.49 | L | L | 0.46 | 0.90 |  |
| `arrow-right` | mark | 6.7 | 8.6 | 10.1 | 25.8 | 10.3 | 10.9 | 14.8 | 37.9 | 1.50 | L | L | 0.54 | 0.75 |  |
| `arrow-right-2` | mark | 8.2 | 10.2 | 12.2 | 31.2 | 12.7 | 13.1 | 18.1 | 46.4 | 1.48 | L | L | 0.55 | 0.76 |  |
| `arrow-right-3` | mark | 6.8 | 8.8 | 10.2 | 26.0 | 10.6 | 11.3 | 15.1 | 38.7 | 1.49 | L | L | 0.51 | 0.73 |  |
| `arrow-right-4` | mark | 8.2 | 10.5 | 12.2 | 31.3 | 11.9 | 14.3 | 17.5 | 44.7 | 1.49 | L | L | 0.46 | 0.90 |  |
| `arrow-up` | mark | 6.7 | 8.6 | 10.1 | 25.8 | 10.3 | 10.9 | 14.8 | 37.9 | 1.50 | L | L | 0.54 | 0.75 |  |
| `arrow-up-2` | mark | 8.2 | 10.2 | 12.2 | 31.2 | 12.7 | 13.1 | 18.1 | 46.4 | 1.48 | L | L | 0.55 | 0.76 |  |
| `arrow-up-3` | mark | 6.8 | 8.8 | 10.2 | 26.0 | 10.6 | 11.3 | 15.1 | 38.7 | 1.49 | L | L | 0.51 | 0.73 |  |
| `arrow-up-4` | mark | 8.2 | 10.5 | 12.2 | 31.3 | 11.9 | 14.3 | 17.5 | 44.7 | 1.49 | L | L | 0.46 | 0.90 |  |
| `arrow-up-right` | mark | 7.3 | 9.2 | 10.7 | 27.5 | 10.8 | 11.5 | 15.1 | 38.8 | 1.47 | L | L | 0.55 | 0.77 |  |
| `arrow-up-right-2` | mark | 8.7 | 10.9 | 12.8 | 32.8 | 13.2 | 13.8 | 18.5 | 47.3 | 1.46 | L | L | 0.55 | 0.78 |  |
| `arrow-up-right-3` | mark | 7.1 | 9.0 | 10.4 | 26.7 | 11.4 | 11.8 | 16.0 | 40.9 | 1.47 | L | L | 0.53 | 0.72 |  |
| `arrow-up-right-4` | mark | 8.4 | 10.6 | 12.3 | 31.5 | 10.5 | 12.8 | 15.2 | 39.0 | 1.47 | L | L | 0.52 | 0.86 |  |
| `arrow-up-right-5` | mark | 6.2 | 7.9 | 9.3 | 23.9 | 8.9 | 9.7 | 12.9 | 33.1 | 1.50 | H | H | 0.55 | 0.77 |  |
| `at-sign` | silhouette | 21.3 | 23.5 | 26.9 | 68.8 | 32.4 | 29.6 | 38.6 | 98.8 | 1.26 | F | F | 0.48 | 0.71 |  |
| `at-sign-2` | silhouette | 22.4 | 24.8 | 27.9 | 71.5 | 33.9 | 31.1 | 38.7 | 99.1 | 1.25 | F | F | 0.48 | 0.70 |  |
| `attachment` | box | 14.4 | 16.4 | 19.2 | 49.2 | 22.6 | 21.2 | 29.1 | 74.6 | 1.34 | Lv | Lv | 0.39 | 0.58 |  |
| `attachment-2` | box | 19.0 | 21.5 | 24.5 | 62.8 | 23.3 | 21.7 | 29.2 | 74.6 | 1.29 | F | Lv | 0.46 | 0.58 |  |
| `attachment-3` | silhouette | 16.3 | 18.0 | 20.4 | 52.2 | 26.3 | 23.5 | 31.0 | 79.4 | 1.25 | Lv | Lv | 0.39 | 0.62 |  |
| `attachment-4` | silhouette | 20.6 | 22.9 | 26.8 | 68.6 | 33.1 | 29.9 | 32.1 | 82.1 | 1.30 | F | Lv | 0.49 | 0.60 |  |
| `ban` | silhouette | 19.5 | 21.9 | 25.2 | 64.6 | 30.3 | 28.0 | 37.3 | 95.4 | 1.29 | F | F | 0.46 | 0.68 | ban-2 |
| `ban-2` | silhouette | 19.5 | 21.9 | 25.2 | 64.6 | 48.8 | 44.8 | 53.0 | 135.6 | 1.29 | F | D | 0.46 | 0.94 | ban |
| `ban-3` | silhouette | 18.5 | 20.6 | 23.3 | 59.7 | 49.9 | 46.1 | 55.0 | 140.9 | 1.26 | Lv | D | 0.34 | 0.95 |  |
| `bell` | silhouette | 14.5 | 15.3 | 17.0 | 43.6 | 35.6 | 29.7 | 32.9 | 84.2 | 1.17 | Lv | Lv | 0.40 | 0.99 |  |
| `bell-2` | silhouette | 14.0 | 14.7 | 16.1 | 41.2 | 34.1 | 29.1 | 32.0 | 81.8 | 1.15 | Lv | Lv | 0.40 | 0.99 |  |
| `bell-3` | silhouette | 14.7 | 15.6 | 17.3 | 44.3 | 38.7 | 32.2 | 35.7 | 91.3 | 1.18 | Lv | Lv | 0.39 | 0.99 |  |
| `bold` | mark | 14.8 | 16.5 | 17.7 | 45.2 | 25.0 | 24.1 | 25.2 | 64.5 | 1.19 | Lv | Lv | 0.47 | 0.68 |  |
| `book` | silhouette | 23.3 | 24.8 | 27.9 | 71.4 | 45.5 | 38.6 | 43.2 | 110.5 | 1.20 | F | F | 0.56 | 0.94 |  |
| `book-2` | silhouette | 24.5 | 26.8 | 30.5 | 78.1 | 43.3 | 35.8 | 39.9 | 102.0 | 1.25 | D | F | 0.56 | 0.87 |  |
| `book-3` | silhouette | 21.9 | 23.4 | 25.6 | 65.5 | 47.2 | 40.5 | 46.5 | 119.1 | 1.17 | F | D | 0.50 | 0.97 |  |
| `book-4` | silhouette | 22.7 | 23.8 | 25.8 | 66.0 | 47.8 | 40.1 | 45.5 | 116.5 | 1.14 | F | D | 0.51 | 0.94 |  |
| `book-open` | silhouette | 18.9 | 20.0 | 22.8 | 58.4 | 43.4 | 35.1 | 41.6 | 106.5 | 1.21 | Lv | F | 0.48 | 0.94 |  |
| `book-open-2` | silhouette | 18.7 | 19.7 | 22.5 | 57.7 | 43.3 | 35.1 | 42.4 | 108.6 | 1.20 | Lv | F | 0.48 | 0.95 |  |
| `briefcase` | box | 23.2 | 25.5 | 29.3 | 74.9 | 47.6 | 39.1 | 44.1 | 112.9 | 1.26 | D | D | 0.52 | 0.85 |  |
| `bug` | silhouette | 24.3 | 27.0 | 29.9 | 76.6 | 36.3 | 35.0 | 37.4 | 95.7 | 1.23 | D | F | 0.52 | 0.83 |  |
| `bug-2` | silhouette | 25.3 | 28.0 | 30.9 | 79.2 | 37.2 | 36.0 | 38.4 | 98.3 | 1.22 | D | F | 0.52 | 0.83 |  |
| `building` | silhouette | 24.5 | 24.8 | 27.1 | 69.5 | 47.3 | 41.8 | 48.7 | 124.7 | 1.11 | F | D | 0.55 | 0.90 |  |
| `building-2` | silhouette | 24.1 | 24.6 | 27.1 | 69.3 | 47.7 | 42.0 | 48.3 | 123.8 | 1.12 | F | D | 0.55 | 0.90 |  |
| `building-3` | silhouette | 26.2 | 25.5 | 28.4 | 72.7 | 42.5 | 40.2 | 49.0 | 125.3 | 1.08 | F | D | 0.47 | 0.88 | building-4 |
| `building-4` | silhouette | 26.2 | 25.5 | 28.4 | 72.7 | 46.0 | 43.3 | 51.4 | 131.5 | 1.08 | F | D | 0.47 | 0.88 | building-3 |
| `calendar` | silhouette | 19.9 | 21.5 | 24.2 | 62.1 | 44.7 | 36.5 | 39.9 | 102.1 | 1.22 | F | F | 0.49 | 0.93 |  |
| `calendar-2` | silhouette | 18.6 | 20.0 | 22.4 | 57.4 | 46.7 | 39.1 | 43.5 | 111.4 | 1.20 | Lv | F | 0.45 | 0.93 |  |
| `calendar-3` | silhouette | 21.1 | 23.2 | 24.9 | 63.8 | 43.4 | 34.7 | 39.2 | 100.4 | 1.18 | F | F | 0.50 | 0.92 |  |
| `camera` | box | 21.6 | 23.3 | 27.8 | 71.1 | 51.3 | 44.8 | 49.9 | 127.9 | 1.29 | F | D | 0.42 | 0.89 | camera-5 |
| `camera-2` | silhouette | 20.6 | 21.8 | 23.5 | 60.2 | 44.3 | 36.8 | 41.1 | 105.2 | 1.14 | Lv | F | 0.48 | 0.91 |  |
| `camera-3` | box | 21.9 | 23.6 | 25.9 | 66.4 | 50.7 | 44.4 | 51.4 | 131.6 | 1.19 | F | D | 0.46 | 0.91 |  |
| `camera-4` | box | 22.0 | 23.6 | 25.9 | 66.4 | 50.4 | 43.3 | 49.8 | 127.6 | 1.18 | F | D | 0.47 | 0.92 |  |
| `camera-5` | box | 23.2 | 25.7 | 27.8 | 71.1 | 50.1 | 43.0 | 49.9 | 127.9 | 1.20 | F | D | 0.42 | 0.89 | camera |
| `camera-6` | box | 23.0 | 25.1 | 27.2 | 69.5 | 55.1 | 48.3 | 58.0 | 148.4 | 1.18 | F | D | 0.46 | 0.96 |  |
| `cart` | silhouette | 16.6 | 17.5 | 19.1 | 48.9 | 25.4 | 21.7 | 24.7 | 63.2 | 1.15 | Lv | Lv | 0.51 | 0.86 |  |
| `cart-2` | silhouette | 17.7 | 18.4 | 20.3 | 52.0 | 27.0 | 22.8 | 26.1 | 66.9 | 1.15 | Lv | Lv | 0.51 | 0.86 |  |
| `cart-3` | silhouette | 16.4 | 17.4 | 18.9 | 48.4 | 24.0 | 21.2 | 24.0 | 61.4 | 1.15 | Lv | Lv | 0.51 | 0.86 |  |
| `cart-4` | silhouette | 16.4 | 18.6 | 17.0 | 43.4 | 28.9 | 25.9 | 29.9 | 76.4 | 1.04 | Lv | Lv | 0.44 | 0.98 |  |
| `cart-5` | silhouette | 17.8 | 18.8 | 20.6 | 52.8 | 26.2 | 22.4 | 24.7 | 63.3 | 1.16 | Lv | Lv | 0.54 | 0.69 |  |
| `cash` | silhouette | 22.8 | 21.4 | 23.2 | 59.5 | 42.9 | 37.0 | 42.4 | 108.6 | 1.02 | Lv | F | 0.45 | 0.96 |  |
| `chart-bar` | mark | 10.2 | 11.3 | 12.8 | 32.8 | 16.7 | 14.9 | 20.1 | 51.5 | 1.26 | L | L | 0.33 | 0.53 |  |
| `chart-bar-2` | silhouette | 12.4 | 13.4 | 14.6 | 37.4 | 19.0 | 16.9 | 21.7 | 55.6 | 1.18 | Lv | L | 0.33 | 0.52 |  |
| `chart-bar-3` | silhouette | 15.9 | 16.7 | 16.4 | 41.9 | 24.4 | 21.2 | 24.5 | 62.6 | 1.03 | Lv | Lv | 0.37 | 0.56 |  |
| `chart-bar-4` | silhouette | 20.8 | 22.1 | 25.1 | 64.2 | 33.7 | 26.7 | 30.1 | 77.0 | 1.20 | F | Lv | 0.49 | 0.71 |  |
| `chart-bar-5` | silhouette | 21.9 | 23.9 | 24.5 | 62.7 | 48.9 | 41.0 | 49.1 | 125.7 | 1.12 | F | D | 0.37 | 0.95 |  |
| `chart-pie` | silhouette | 18.6 | 20.5 | 23.4 | 59.8 | 48.9 | 43.6 | 51.0 | 130.5 | 1.26 | Lv | D | 0.41 | 0.93 |  |
| `chart-pie-2` | silhouette | 20.6 | 22.0 | 24.9 | 63.7 | 43.7 | 37.9 | 44.2 | 113.1 | 1.21 | F | D | 0.46 | 0.98 |  |
| `chart-pie-3` | silhouette | 21.6 | 24.1 | 27.7 | 70.8 | 46.6 | 41.1 | 47.7 | 122.0 | 1.28 | F | D | 0.47 | 0.91 |  |
| `check` | mark | 5.6 | 7.0 | 7.8 | 20.0 | 8.9 | 9.1 | 12.0 | 30.6 | 1.40 | H | H | 0.37 | 0.55 |  |
| `check-2` | mark | 5.6 | 7.0 | 7.8 | 20.0 | 8.9 | 9.1 | 12.0 | 30.7 | 1.40 | H | H | 0.35 | 0.54 |  |
| `check-2-small` | mark | 4.5 | 5.6 | 6.4 | 16.5 | 7.1 | 7.3 | 9.8 | 25.0 | 1.44 | H | H | 0.36 | 0.52 |  |
| `check-3` | mark | 6.2 | 7.7 | 8.7 | 22.4 | 9.8 | 10.0 | 13.3 | 33.9 | 1.41 | H | H | 0.38 | 0.55 |  |
| `check-3-small` | mark | 4.9 | 6.2 | 7.2 | 18.3 | 7.7 | 8.0 | 10.7 | 27.5 | 1.45 | H | H | 0.38 | 0.55 |  |
| `check-4` | mark | 6.1 | 7.7 | 8.5 | 21.8 | 9.7 | 10.0 | 13.0 | 33.2 | 1.39 | H | H | 0.38 | 0.55 |  |
| `check-4-small` | mark | 4.9 | 6.1 | 6.9 | 17.8 | 7.7 | 7.9 | 10.5 | 26.8 | 1.41 | H | H | 0.38 | 0.55 |  |
| `check-circle` | silhouette | 18.6 | 20.7 | 23.6 | 60.5 | 51.1 | 46.6 | 55.5 | 142.0 | 1.27 | Lv | D | 0.35 | 0.96 |  |
| `check-circle-3` | silhouette | 18.7 | 20.9 | 23.8 | 60.8 | 50.9 | 46.5 | 55.4 | 141.7 | 1.27 | Lv | D | 0.36 | 0.96 |  |
| `check-circle-3-small` | silhouette | 18.1 | 20.2 | 23.2 | 59.4 | 51.6 | 47.2 | 56.0 | 143.4 | 1.28 | Lv | D | 0.35 | 0.96 |  |
| `check-circle-4` | silhouette | 18.7 | 20.8 | 23.7 | 60.6 | 51.0 | 46.6 | 55.4 | 141.9 | 1.27 | Lv | D | 0.35 | 0.96 |  |
| `check-circle-4-small` | silhouette | 18.0 | 20.1 | 23.1 | 59.1 | 51.7 | 47.2 | 56.1 | 143.7 | 1.28 | Lv | D | 0.34 | 0.96 |  |
| `check-circle-small` | silhouette | 18.0 | 20.1 | 23.0 | 59.0 | 51.7 | 47.3 | 56.2 | 143.8 | 1.28 | Lv | D | 0.34 | 0.96 |  |
| `check-small` | mark | 4.5 | 5.6 | 6.4 | 16.5 | 7.1 | 7.3 | 9.8 | 25.0 | 1.44 | H | H | 0.36 | 0.54 |  |
| `checkbox` | silhouette | 19.5 | 21.1 | 23.7 | 60.8 | 51.2 | 43.7 | 50.1 | 128.3 | 1.22 | Lv | D | 0.37 | 0.94 |  |
| `checkbox-2` | silhouette | 19.7 | 21.3 | 24.1 | 61.7 | 51.1 | 43.6 | 49.7 | 127.2 | 1.22 | F | D | 0.38 | 0.94 |  |
| `checkbox-3` | silhouette | 19.6 | 21.2 | 24.1 | 61.6 | 51.2 | 43.7 | 49.7 | 127.3 | 1.23 | F | D | 0.38 | 0.95 |  |
| `checkbox-4` | silhouette | 18.9 | 20.5 | 23.2 | 59.4 | 51.8 | 44.4 | 50.8 | 130.0 | 1.23 | Lv | D | 0.36 | 0.94 |  |
| `chevron-down` | mark | 4.8 | 5.9 | 6.8 | 17.3 | 7.5 | 7.5 | 10.2 | 26.1 | 1.41 | H | H | 0.37 | 0.54 |  |
| `chevron-down-2` | mark | 4.9 | 5.8 | 6.8 | 17.5 | 7.6 | 7.5 | 10.3 | 26.4 | 1.40 | H | H | 0.35 | 0.51 |  |
| `chevron-down-2-large` | mark | 5.8 | 7.0 | 8.0 | 20.6 | 9.2 | 9.1 | 12.3 | 31.4 | 1.39 | H | H | 0.34 | 0.51 |  |
| `chevron-down-2-small` | mark | 3.9 | 4.7 | 5.7 | 14.7 | 6.1 | 6.0 | 8.5 | 21.9 | 1.46 | H | H | 0.34 | 0.49 |  |
| `chevron-down-3` | mark | 5.4 | 6.6 | 7.6 | 19.4 | 8.5 | 8.6 | 11.4 | 29.2 | 1.39 | H | H | 0.37 | 0.56 |  |
| `chevron-down-3-large` | mark | 6.8 | 8.1 | 9.2 | 23.4 | 10.7 | 10.5 | 13.9 | 35.6 | 1.36 | H | H | 0.38 | 0.56 |  |
| `chevron-down-3-small` | mark | 4.2 | 5.1 | 6.0 | 15.4 | 6.4 | 6.4 | 8.9 | 22.8 | 1.45 | H | H | 0.38 | 0.56 |  |
| `chevron-down-large` | mark | 5.9 | 7.2 | 8.2 | 20.9 | 9.4 | 9.3 | 12.3 | 31.5 | 1.37 | H | H | 0.36 | 0.52 |  |
| `chevron-down-small` | mark | 3.7 | 4.6 | 5.4 | 13.8 | 5.7 | 5.8 | 7.9 | 20.3 | 1.46 | H | H | 0.35 | 0.52 |  |
| `chevron-left` | mark | 4.8 | 5.9 | 6.8 | 17.3 | 7.5 | 7.5 | 10.2 | 26.1 | 1.41 | H | H | 0.37 | 0.54 |  |
| `chevron-left-2` | mark | 4.9 | 5.8 | 6.8 | 17.5 | 7.6 | 7.5 | 10.3 | 26.4 | 1.40 | H | H | 0.35 | 0.51 |  |
| `chevron-left-2-large` | mark | 5.8 | 7.0 | 8.0 | 20.6 | 9.2 | 9.1 | 12.3 | 31.4 | 1.39 | H | H | 0.34 | 0.51 |  |
| `chevron-left-2-small` | mark | 3.9 | 4.7 | 5.7 | 14.7 | 6.1 | 6.0 | 8.6 | 21.9 | 1.46 | H | H | 0.34 | 0.49 |  |
| `chevron-left-3` | mark | 5.4 | 6.6 | 7.6 | 19.4 | 8.5 | 8.5 | 11.4 | 29.2 | 1.39 | H | H | 0.38 | 0.56 |  |
| `chevron-left-3-large` | mark | 6.7 | 8.1 | 9.2 | 23.4 | 10.7 | 10.5 | 13.9 | 35.6 | 1.36 | H | H | 0.38 | 0.56 |  |
| `chevron-left-3-small` | mark | 4.2 | 5.0 | 6.0 | 15.4 | 6.4 | 6.4 | 8.9 | 22.8 | 1.45 | H | H | 0.38 | 0.56 |  |
| `chevron-left-large` | mark | 5.9 | 7.2 | 8.2 | 20.9 | 9.4 | 9.3 | 12.3 | 31.5 | 1.37 | H | H | 0.36 | 0.52 |  |
| `chevron-left-small` | mark | 3.7 | 4.6 | 5.4 | 13.8 | 5.7 | 5.8 | 7.9 | 20.3 | 1.46 | H | H | 0.35 | 0.52 |  |
| `chevron-right` | mark | 4.8 | 5.9 | 6.8 | 17.3 | 7.5 | 7.5 | 10.2 | 26.1 | 1.41 | H | H | 0.37 | 0.54 |  |
| `chevron-right-2` | mark | 4.9 | 5.8 | 6.8 | 17.5 | 7.6 | 7.5 | 10.3 | 26.4 | 1.40 | H | H | 0.35 | 0.51 |  |
| `chevron-right-2-large` | mark | 5.8 | 7.0 | 8.0 | 20.6 | 9.2 | 9.1 | 12.3 | 31.4 | 1.39 | H | H | 0.34 | 0.51 |  |
| `chevron-right-2-small` | mark | 3.9 | 4.7 | 5.7 | 14.7 | 6.1 | 6.0 | 8.6 | 21.9 | 1.46 | H | H | 0.34 | 0.49 |  |
| `chevron-right-3` | mark | 5.4 | 6.6 | 7.6 | 19.4 | 8.5 | 8.5 | 11.4 | 29.2 | 1.39 | H | H | 0.38 | 0.56 |  |
| `chevron-right-3-large` | mark | 6.7 | 8.1 | 9.2 | 23.4 | 10.7 | 10.5 | 13.9 | 35.6 | 1.36 | H | H | 0.38 | 0.56 |  |
| `chevron-right-3-small` | mark | 4.2 | 5.0 | 6.0 | 15.4 | 6.4 | 6.4 | 8.9 | 22.8 | 1.45 | H | H | 0.38 | 0.56 |  |
| `chevron-right-large` | mark | 5.9 | 7.2 | 8.2 | 20.9 | 9.4 | 9.3 | 12.3 | 31.5 | 1.37 | H | H | 0.36 | 0.52 |  |
| `chevron-right-small` | mark | 3.7 | 4.6 | 5.4 | 13.8 | 5.7 | 5.8 | 7.9 | 20.3 | 1.46 | H | H | 0.35 | 0.52 |  |
| `chevron-up` | mark | 4.8 | 5.9 | 6.8 | 17.3 | 7.5 | 7.5 | 10.2 | 26.1 | 1.41 | H | H | 0.37 | 0.54 |  |
| `chevron-up-2` | mark | 4.9 | 5.8 | 6.8 | 17.5 | 7.6 | 7.5 | 10.3 | 26.4 | 1.40 | H | H | 0.35 | 0.50 |  |
| `chevron-up-2-large` | mark | 5.8 | 7.0 | 8.0 | 20.6 | 9.2 | 9.1 | 12.3 | 31.4 | 1.39 | H | H | 0.34 | 0.51 |  |
| `chevron-up-2-small` | mark | 3.9 | 4.7 | 5.7 | 14.7 | 6.1 | 6.0 | 8.5 | 21.9 | 1.46 | H | H | 0.34 | 0.50 |  |
| `chevron-up-3` | mark | 5.4 | 6.6 | 7.6 | 19.4 | 8.5 | 8.5 | 11.4 | 29.2 | 1.39 | H | H | 0.38 | 0.56 |  |
| `chevron-up-3-large` | mark | 6.7 | 8.1 | 9.2 | 23.4 | 10.7 | 10.5 | 13.9 | 35.6 | 1.36 | H | H | 0.38 | 0.56 |  |
| `chevron-up-3-small` | mark | 4.2 | 5.0 | 6.0 | 15.4 | 6.4 | 6.4 | 8.9 | 22.8 | 1.45 | H | H | 0.38 | 0.56 |  |
| `chevron-up-large` | mark | 5.9 | 7.2 | 8.2 | 20.9 | 9.4 | 9.3 | 12.3 | 31.5 | 1.37 | H | H | 0.36 | 0.52 |  |
| `chevron-up-small` | mark | 3.7 | 4.6 | 5.4 | 13.8 | 5.7 | 5.8 | 7.9 | 20.3 | 1.46 | H | H | 0.35 | 0.52 |  |
| `chevrons-up-down` | mark | 7.4 | 9.0 | 10.8 | 27.7 | 11.4 | 11.6 | 16.0 | 40.9 | 1.46 | L | L | 0.36 | 0.52 |  |
| `chevrons-up-down-2` | mark | 7.4 | 9.0 | 10.8 | 27.7 | 11.4 | 11.6 | 16.0 | 40.9 | 1.46 | L | L | 0.36 | 0.52 |  |
| `chevrons-up-down-3` | mark | 7.8 | 9.4 | 11.5 | 29.3 | 12.2 | 12.1 | 17.1 | 43.8 | 1.46 | L | L | 0.35 | 0.51 |  |
| `chevrons-up-down-4` | mark | 7.8 | 9.4 | 11.5 | 29.3 | 12.2 | 12.1 | 17.1 | 43.8 | 1.46 | L | L | 0.34 | 0.49 |  |
| `clipboard` | silhouette | 18.0 | 19.3 | 22.8 | 58.4 | 49.4 | 42.3 | 48.4 | 123.9 | 1.27 | Lv | D | 0.51 | 1.00 |  |
| `clipboard-2` | silhouette | 18.2 | 19.1 | 22.6 | 57.9 | 48.6 | 42.0 | 48.2 | 123.4 | 1.24 | Lv | D | 0.52 | 1.00 |  |
| `clipboard-3` | silhouette | 18.3 | 19.7 | 23.3 | 59.7 | 49.4 | 42.4 | 48.6 | 124.4 | 1.28 | Lv | D | 0.50 | 0.99 |  |
| `clipboard-4` | box | 17.0 | 17.8 | 20.9 | 53.4 | 43.9 | 36.3 | 40.6 | 103.9 | 1.23 | Lv | F | 0.51 | 0.99 |  |
| `clock` | silhouette | 17.9 | 20.3 | 22.8 | 58.4 | 50.7 | 46.4 | 55.6 | 142.3 | 1.28 | Lv | D | 0.34 | 0.96 |  |
| `code` | mark | 10.7 | 10.7 | 11.9 | 30.4 | 16.7 | 13.7 | 17.4 | 44.5 | 1.11 | L | L | 0.34 | 0.51 |  |
| `code-2` | mark | 6.6 | 8.0 | 9.4 | 24.0 | 10.2 | 10.2 | 13.6 | 34.9 | 1.42 | H | H | 0.37 | 0.53 |  |
| `compass` | silhouette | 23.9 | 25.7 | 28.0 | 71.6 | 44.4 | 42.5 | 48.5 | 124.1 | 1.17 | F | D | 0.46 | 0.86 | compass-3 |
| `compass-2` | silhouette | 20.9 | 22.6 | 25.8 | 66.0 | 23.5 | 23.7 | 27.3 | 69.8 | 1.23 | F | Lv | 0.49 | 0.69 |  |
| `compass-3` | silhouette | 23.9 | 25.7 | 28.0 | 71.6 | 43.9 | 40.8 | 48.0 | 122.8 | 1.17 | F | D | 0.46 | 0.83 | compass |
| `compose` | silhouette | 20.8 | 21.0 | 22.9 | 58.6 | 36.3 | 27.7 | 28.9 | 73.9 | 1.10 | Lv | Lv | 0.56 | 0.80 |  |
| `compose-2` | silhouette | 22.5 | 23.4 | 26.1 | 66.8 | 44.2 | 35.8 | 39.0 | 100.0 | 1.16 | F | F | 0.56 | 0.78 |  |
| `compose-3` | silhouette | 22.4 | 23.3 | 25.9 | 66.4 | 44.3 | 35.9 | 39.2 | 100.4 | 1.16 | F | F | 0.56 | 0.78 |  |
| `compose-4` | silhouette | 22.5 | 23.5 | 26.1 | 66.9 | 44.3 | 35.9 | 39.2 | 100.3 | 1.16 | F | F | 0.56 | 0.79 |  |
| `copy` | silhouette | 17.1 | 16.5 | 17.2 | 44.1 | 37.7 | 28.4 | 29.8 | 76.4 | 1.00 | Lv | Lv | 0.36 | 0.98 |  |
| `copy-2` | silhouette | 18.7 | 18.7 | 20.2 | 51.6 | 43.3 | 34.3 | 36.1 | 92.4 | 1.08 | Lv | Lv | 0.40 | 0.98 |  |
| `copy-3` | box | 20.3 | 21.0 | 23.1 | 59.1 | 49.7 | 41.5 | 46.9 | 120.1 | 1.14 | Lv | D | 0.40 | 1.00 |  |
| `credit-card` | silhouette | 21.7 | 23.7 | 26.9 | 69.0 | 47.5 | 39.0 | 42.8 | 109.7 | 1.24 | F | F | 0.50 | 0.92 |  |
| `credit-card-2` | silhouette | 21.7 | 23.7 | 26.9 | 69.0 | 47.5 | 39.0 | 42.8 | 109.7 | 1.24 | F | F | 0.50 | 0.92 |  |
| `credit-card-3` | silhouette | 22.9 | 24.8 | 27.3 | 69.8 | 46.3 | 37.9 | 42.6 | 109.1 | 1.19 | F | F | 0.50 | 0.89 |  |
| `cursor` | mark | 14.9 | 15.9 | 17.7 | 45.4 | 28.9 | 26.5 | 30.4 | 77.7 | 1.19 | Lv | Lv | 0.47 | 0.97 |  |
| `cursor-2` | mark | 15.9 | 17.0 | 18.9 | 48.5 | 32.7 | 29.6 | 33.9 | 86.9 | 1.19 | Lv | Lv | 0.47 | 0.98 |  |
| `cursor-3` | mark | 13.4 | 14.6 | 16.3 | 41.8 | 26.7 | 24.9 | 28.3 | 72.6 | 1.22 | Lv | Lv | 0.45 | 0.96 |  |
| `cursor-click` | mark | 11.6 | 12.0 | 13.1 | 33.6 | 16.6 | 14.8 | 16.5 | 42.2 | 1.14 | L | L | 0.46 | 0.84 |  |
| `database` | silhouette | 26.0 | 24.0 | 26.6 | 68.2 | 41.6 | 38.2 | 43.3 | 110.8 | 1.02 | F | F | 0.51 | 0.89 |  |
| `database-2` | silhouette | 22.4 | 23.8 | 26.5 | 67.8 | 44.3 | 37.6 | 42.8 | 109.6 | 1.18 | F | F | 0.50 | 0.86 |  |
| `database-3` | silhouette | 27.6 | 25.4 | 28.5 | 72.9 | 40.6 | 37.1 | 41.8 | 106.9 | 1.03 | F | F | 0.52 | 0.79 |  |
| `desktop` | box | 17.9 | 19.8 | 22.4 | 57.4 | 49.9 | 45.4 | 51.4 | 131.5 | 1.25 | Lv | D | 0.52 | 1.00 |  |
| `desktop-2` | box | 17.3 | 19.2 | 21.6 | 55.2 | 49.3 | 44.9 | 50.5 | 129.3 | 1.25 | Lv | D | 0.39 | 1.00 |  |
| `desktop-3` | box | 22.4 | 24.7 | 28.0 | 71.8 | 44.7 | 39.4 | 43.1 | 110.3 | 1.25 | F | F | 0.53 | 0.86 |  |
| `desktop-4` | silhouette | 16.9 | 18.3 | 20.5 | 52.4 | 43.0 | 37.4 | 40.4 | 103.5 | 1.21 | Lv | F | 0.52 | 0.99 |  |
| `desktop-5` | silhouette | 19.0 | 20.9 | 23.9 | 61.1 | 56.9 | 49.8 | 57.3 | 146.7 | 1.26 | F | D | 0.47 | 1.00 |  |
| `desktop-6` | box | 19.1 | 21.1 | 24.3 | 62.1 | 51.8 | 47.3 | 54.2 | 138.9 | 1.27 | F | D | 0.59 | 1.00 |  |
| `export` | silhouette | 16.8 | 18.0 | 20.2 | 51.8 | 27.9 | 25.0 | 28.3 | 72.5 | 1.21 | Lv | Lv | 0.54 | 0.79 |  |
| `external-link` | silhouette | 18.0 | 18.0 | 19.7 | 50.4 | 35.6 | 28.4 | 29.0 | 74.2 | 1.09 | Lv | Lv | 0.55 | 0.82 |  |
| `external-link-2` | silhouette | 17.0 | 16.5 | 17.7 | 45.4 | 31.5 | 24.8 | 24.8 | 63.4 | 1.04 | Lv | Lv | 0.55 | 0.82 |  |
| `eye` | silhouette | 19.0 | 19.7 | 21.1 | 54.1 | 35.9 | 30.5 | 34.6 | 88.5 | 1.11 | Lv | Lv | 0.48 | 0.82 |  |
| `face-neutral` | silhouette | 18.8 | 21.4 | 24.6 | 62.9 | 49.3 | 44.9 | 52.4 | 134.0 | 1.31 | F | D | 0.36 | 0.88 |  |
| `face-sad` | silhouette | 19.0 | 21.7 | 24.8 | 63.5 | 48.9 | 44.8 | 52.0 | 133.1 | 1.30 | F | D | 0.35 | 0.89 |  |
| `face-smile` | silhouette | 20.2 | 23.0 | 26.4 | 67.7 | 47.3 | 43.3 | 49.8 | 127.4 | 1.31 | F | D | 0.41 | 0.83 |  |
| `file` | silhouette | 17.8 | 19.4 | 21.8 | 55.8 | 47.4 | 38.9 | 44.2 | 113.2 | 1.23 | Lv | D | 0.55 | 1.00 |  |
| `file-text` | silhouette | 22.8 | 23.6 | 23.6 | 60.4 | 42.4 | 34.7 | 42.1 | 107.7 | 1.03 | Lv | F | 0.55 | 0.91 |  |
| `file-text-2` | silhouette | 23.8 | 22.6 | 24.7 | 63.2 | 41.4 | 35.7 | 40.8 | 104.4 | 1.04 | F | F | 0.55 | 0.88 |  |
| `files` | silhouette | 20.1 | 19.9 | 21.5 | 55.0 | 38.2 | 29.7 | 31.3 | 80.2 | 1.07 | Lv | Lv | 0.56 | 0.96 | files-5 |
| `files-2` | silhouette | 19.6 | 19.4 | 20.9 | 53.6 | 38.7 | 30.3 | 32.3 | 82.7 | 1.07 | Lv | Lv | 0.56 | 0.96 |  |
| `files-3` | silhouette | 19.4 | 19.3 | 20.7 | 53.1 | 37.6 | 29.1 | 30.5 | 78.0 | 1.07 | Lv | Lv | 0.56 | 0.96 |  |
| `files-4` | silhouette | 23.1 | 25.6 | 29.3 | 75.1 | 55.5 | 48.3 | 57.3 | 146.8 | 1.27 | D | D | 0.55 | 1.00 |  |
| `files-5` | silhouette | 23.6 | 20.9 | 21.5 | 55.0 | 34.8 | 28.7 | 31.3 | 80.2 | 0.91 | Lv | Lv | 0.56 | 0.96 | files |
| `filter` | silhouette | 14.6 | 16.1 | 18.1 | 46.4 | 29.5 | 28.2 | 32.6 | 83.4 | 1.24 | Lv | Lv | 0.42 | 0.97 |  |
| `filter-2` | mark | 7.6 | 9.8 | 11.3 | 29.0 | 12.3 | 12.9 | 17.8 | 45.5 | 1.50 | L | L | 0.32 | 0.50 |  |
| `filter-3` | silhouette | 14.4 | 15.8 | 17.9 | 45.8 | 32.3 | 30.2 | 34.3 | 87.9 | 1.24 | Lv | Lv | 0.42 | 0.98 |  |
| `filter-4` | silhouette | 14.3 | 15.6 | 17.5 | 44.9 | 28.9 | 27.3 | 31.2 | 79.9 | 1.22 | Lv | Lv | 0.45 | 0.97 |  |
| `flag` | silhouette | 15.7 | 17.0 | 19.2 | 49.2 | 32.5 | 29.8 | 34.3 | 87.8 | 1.23 | Lv | Lv | 0.46 | 0.99 |  |
| `flag-2` | silhouette | 14.6 | 15.9 | 18.0 | 46.0 | 30.2 | 28.0 | 33.0 | 84.6 | 1.23 | Lv | Lv | 0.47 | 0.99 |  |
| `flag-3` | silhouette | 14.3 | 15.6 | 17.6 | 45.0 | 30.0 | 27.9 | 32.9 | 84.1 | 1.23 | Lv | Lv | 0.46 | 0.99 |  |
| `flag-4` | silhouette | 15.1 | 16.3 | 18.4 | 47.1 | 30.9 | 28.2 | 33.2 | 84.9 | 1.22 | Lv | Lv | 0.46 | 0.98 |  |
| `folder` | box | 16.8 | 18.5 | 21.1 | 53.9 | 56.6 | 49.4 | 57.3 | 146.7 | 1.26 | Lv | D | 0.36 | 1.00 |  |
| `folder-2` | box | 18.6 | 20.5 | 23.6 | 60.5 | 53.9 | 46.1 | 52.5 | 134.4 | 1.27 | Lv | D | 0.47 | 1.00 |  |
| `folder-3` | box | 18.1 | 19.9 | 22.9 | 58.5 | 54.8 | 47.3 | 54.2 | 138.7 | 1.26 | Lv | D | 0.45 | 1.00 |  |
| `gauge` | silhouette | 13.1 | 13.8 | 15.6 | 39.9 | 20.5 | 17.9 | 23.4 | 59.8 | 1.19 | Lv | Lv | 0.37 | 0.52 |  |
| `gear` | box | 23.6 | 25.3 | 28.4 | 72.7 | 33.4 | 33.5 | 41.7 | 106.7 | 1.20 | F | F | 0.43 | 0.79 |  |
| `gear-2` | box | 22.0 | 24.1 | 26.8 | 68.7 | 35.7 | 35.8 | 44.9 | 114.9 | 1.22 | F | D | 0.45 | 0.83 |  |
| `gear-3` | box | 23.6 | 24.7 | 26.9 | 68.9 | 29.7 | 28.1 | 32.5 | 83.2 | 1.14 | F | Lv | 0.54 | 0.68 |  |
| `globe` | silhouette | 27.9 | 30.7 | 35.4 | 90.6 | 35.4 | 31.0 | 34.8 | 89.0 | 1.27 | D | Lv | 0.55 | 0.61 | language-2 |
| `globe-2` | silhouette | 31.8 | 34.5 | 39.9 | 102.2 | 30.3 | 25.8 | 28.3 | 72.4 | 1.26 | D | Lv | 0.60 | 0.49 | language-3 |
| `grid` | silhouette | 23.2 | 22.1 | 24.8 | 63.6 | 37.2 | 28.3 | 32.7 | 83.8 | 1.07 | F | Lv | 0.48 | 0.76 |  |
| `grid-2` | silhouette | 23.5 | 25.2 | 28.4 | 72.7 | 45.6 | 37.3 | 41.3 | 105.8 | 1.21 | F | F | 0.51 | 0.84 |  |
| `grid-3` | mark | 11.0 | 12.9 | 15.9 | 40.7 | 19.7 | 18.1 | 23.2 | 59.5 | 1.44 | Lv | Lv | 0.28 | 0.39 |  |
| `grid-4` | mark | 13.3 | 19.2 | 20.8 | 53.3 | 22.9 | 25.7 | 28.7 | 73.4 | 1.57 | Lv | Lv | 0.35 | 0.47 |  |
| `grid-5` | silhouette | 22.3 | 21.3 | 24.0 | 61.5 | 35.6 | 27.2 | 31.5 | 80.6 | 1.08 | F | Lv | 0.48 | 0.76 |  |
| `grid-6` | silhouette | 22.3 | 23.9 | 27.1 | 69.3 | 47.2 | 39.1 | 43.7 | 112.0 | 1.21 | F | F | 0.47 | 0.89 |  |
| `grid-7` | silhouette | 25.3 | 25.1 | 26.8 | 68.6 | 42.6 | 34.1 | 36.5 | 93.5 | 1.06 | F | Lv | 0.47 | 0.81 |  |
| `hash` | mark | 13.7 | 17.5 | 20.5 | 52.4 | 20.8 | 22.2 | 29.9 | 76.6 | 1.49 | Lv | Lv | 0.53 | 0.72 |  |
| `hash-2` | mark | 13.8 | 17.6 | 20.6 | 52.7 | 20.9 | 22.3 | 30.0 | 76.9 | 1.49 | Lv | Lv | 0.53 | 0.72 |  |
| `hash-3` | mark | 13.3 | 16.9 | 19.9 | 50.8 | 20.0 | 21.3 | 28.9 | 73.9 | 1.50 | Lv | Lv | 0.53 | 0.72 |  |
| `heart` | box | 14.4 | 16.0 | 18.4 | 47.2 | 43.3 | 39.2 | 45.2 | 115.6 | 1.28 | Lv | D | 0.37 | 1.00 |  |
| `heart-2` | box | 15.1 | 16.6 | 18.8 | 48.2 | 43.5 | 39.7 | 45.7 | 117.0 | 1.25 | Lv | D | 0.37 | 1.00 |  |
| `help` | silhouette | 20.1 | 22.3 | 25.2 | 64.5 | 48.1 | 44.2 | 52.9 | 135.3 | 1.26 | F | D | 0.41 | 0.95 | help-2 |
| `help-2` | silhouette | 19.7 | 22.2 | 25.2 | 64.5 | 48.6 | 44.4 | 52.9 | 135.3 | 1.28 | F | D | 0.41 | 0.95 | help |
| `help-3` | silhouette | 19.7 | 22.3 | 24.3 | 62.3 | 48.6 | 44.3 | 54.3 | 138.9 | 1.24 | F | D | 0.39 | 0.96 |  |
| `help-4` | silhouette | 20.3 | 22.5 | 25.3 | 64.8 | 47.8 | 44.1 | 53.1 | 135.9 | 1.25 | F | D | 0.44 | 0.95 |  |
| `home` | silhouette | 17.4 | 19.1 | 21.3 | 54.6 | 34.9 | 31.1 | 36.3 | 93.0 | 1.22 | Lv | Lv | 0.55 | 0.98 |  |
| `home-2` | silhouette | 18.0 | 19.7 | 22.0 | 56.4 | 43.6 | 38.2 | 44.3 | 113.5 | 1.23 | Lv | D | 0.54 | 0.99 |  |
| `home-3` | silhouette | 16.0 | 17.6 | 19.6 | 50.3 | 45.0 | 38.8 | 44.5 | 114.0 | 1.23 | Lv | D | 0.40 | 0.98 |  |
| `image` | silhouette | 21.6 | 23.2 | 26.3 | 67.4 | 48.0 | 40.0 | 45.1 | 115.3 | 1.22 | F | D | 0.52 | 0.94 |  |
| `image-2` | silhouette | 22.3 | 23.9 | 26.9 | 69.0 | 47.3 | 39.3 | 44.2 | 113.2 | 1.21 | F | D | 0.53 | 0.94 |  |
| `image-3` | silhouette | 21.7 | 23.5 | 26.3 | 67.4 | 47.2 | 38.7 | 43.4 | 111.1 | 1.21 | F | F | 0.52 | 0.88 |  |
| `images` | silhouette | 23.2 | 21.7 | 23.4 | 59.9 | 38.3 | 30.7 | 32.7 | 83.8 | 1.01 | Lv | Lv | 0.54 | 0.91 |  |
| `images-2` | silhouette | 23.2 | 21.7 | 23.4 | 59.9 | 38.3 | 30.7 | 32.7 | 83.8 | 1.01 | Lv | Lv | 0.53 | 0.91 |  |
| `images-3` | silhouette | 23.2 | 21.7 | 23.4 | 59.9 | 38.3 | 30.7 | 32.7 | 83.8 | 1.01 | Lv | Lv | 0.53 | 0.91 |  |
| `images-4` | silhouette | 23.2 | 23.9 | 25.4 | 65.0 | 43.2 | 34.9 | 39.9 | 102.0 | 1.10 | F | F | 0.53 | 0.94 |  |
| `info` | silhouette | 18.0 | 20.0 | 22.9 | 58.6 | 50.9 | 47.0 | 56.0 | 143.5 | 1.27 | Lv | D | 0.34 | 0.96 |  |
| `info-2` | silhouette | 18.4 | 20.5 | 23.6 | 60.5 | 50.3 | 46.4 | 55.1 | 141.1 | 1.28 | Lv | D | 0.35 | 0.94 |  |
| `info-3` | silhouette | 19.2 | 21.4 | 24.7 | 63.2 | 49.4 | 45.4 | 53.9 | 138.0 | 1.29 | F | D | 0.40 | 0.95 |  |
| `italic` | box | 7.8 | 8.9 | 9.7 | 24.7 | 12.1 | 11.4 | 14.3 | 36.6 | 1.24 | L | H | 0.42 | 0.59 |  |
| `key` | box | 11.0 | 11.9 | 15.5 | 39.7 | 14.4 | 14.6 | 21.6 | 55.2 | 1.41 | Lv | L | 0.46 | 0.77 |  |
| `key-2` | silhouette | 12.3 | 13.0 | 14.9 | 38.1 | 19.8 | 17.1 | 18.3 | 46.9 | 1.21 | Lv | L | 0.47 | 0.61 |  |
| `key-3` | silhouette | 11.3 | 12.3 | 13.9 | 35.7 | 15.3 | 13.8 | 16.7 | 42.8 | 1.24 | L | L | 0.47 | 0.69 |  |
| `key-4` | silhouette | 13.0 | 13.9 | 16.1 | 41.3 | 21.1 | 18.6 | 20.5 | 52.4 | 1.24 | Lv | L | 0.56 | 0.69 |  |
| `key-5` | box | 10.7 | 11.9 | 12.8 | 32.9 | 15.2 | 16.0 | 15.4 | 39.4 | 1.20 | L | L | 0.45 | 0.66 |  |
| `key-6` | box | 10.7 | 11.9 | 12.8 | 32.9 | 15.2 | 16.0 | 15.4 | 39.4 | 1.20 | L | L | 0.45 | 0.66 |  |
| `keyboard` | box | 18.7 | 21.4 | 25.0 | 64.0 | 35.4 | 37.7 | 47.0 | 120.4 | 1.34 | F | D | 0.39 | 0.83 |  |
| `keyboard-2` | box | 21.0 | 23.7 | 27.3 | 69.8 | 37.7 | 40.1 | 49.3 | 126.1 | 1.30 | F | D | 0.48 | 0.82 |  |
| `language` | silhouette | 14.1 | 15.9 | 17.7 | 45.2 | 21.9 | 20.0 | 26.3 | 67.4 | 1.25 | Lv | Lv | 0.54 | 0.71 |  |
| `language-2` | silhouette | 27.9 | 30.7 | 35.4 | 90.6 | 35.4 | 31.0 | 34.8 | 89.0 | 1.27 | D | Lv | 0.55 | 0.61 | globe |
| `language-3` | silhouette | 31.8 | 34.5 | 39.9 | 102.2 | 30.3 | 25.8 | 28.3 | 72.4 | 1.26 | D | Lv | 0.60 | 0.49 | globe-2 |
| `layout-footer` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 50.0 | 42.1 | 47.6 | 121.9 | 1.22 | F | D | 0.47 | 0.97 | layout-footer-2 layout-footer-3 |
| `layout-footer-2` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 31.5 | 30.4 | 34.5 | 88.2 | 1.22 | F | Lv | 0.47 | 0.92 | layout-footer-3 layout-footer |
| `layout-footer-3` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 43.2 | 38.6 | 44.7 | 114.3 | 1.22 | F | D | 0.47 | 0.99 | layout-footer-2 layout-footer |
| `layout-footer-4` | silhouette | 18.8 | 19.9 | 22.1 | 56.6 | 26.3 | 25.3 | 28.5 | 72.9 | 1.18 | Lv | Lv | 0.44 | 0.83 |  |
| `layout-header` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 50.0 | 42.1 | 47.6 | 121.9 | 1.22 | F | D | 0.47 | 0.97 | layout-header-2 layout-header-3 |
| `layout-header-2` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 31.5 | 30.4 | 34.5 | 88.2 | 1.22 | F | Lv | 0.47 | 0.92 | layout-header-3 layout-header |
| `layout-header-3` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 43.2 | 38.6 | 44.7 | 114.3 | 1.22 | F | D | 0.47 | 0.99 | layout-header-2 layout-header |
| `layout-header-4` | silhouette | 18.8 | 19.9 | 22.1 | 56.6 | 26.3 | 25.3 | 28.5 | 72.9 | 1.18 | Lv | Lv | 0.44 | 0.83 |  |
| `layout-sidebar` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 50.0 | 42.1 | 47.6 | 121.9 | 1.22 | F | D | 0.47 | 0.97 | layout-sidebar-2 layout-sidebar-3 |
| `layout-sidebar-2` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 31.5 | 30.4 | 34.5 | 88.2 | 1.22 | F | Lv | 0.47 | 0.92 | layout-sidebar-3 layout-sidebar |
| `layout-sidebar-3` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 43.2 | 38.6 | 44.7 | 114.3 | 1.22 | F | D | 0.47 | 0.99 | layout-sidebar-2 layout-sidebar |
| `layout-sidebar-4` | silhouette | 18.8 | 19.9 | 22.1 | 56.6 | 26.3 | 25.3 | 28.5 | 72.9 | 1.18 | Lv | Lv | 0.44 | 0.83 |  |
| `layout-sidebar-right` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 50.0 | 42.1 | 47.6 | 121.9 | 1.22 | F | D | 0.47 | 0.97 | layout-sidebar-right-2 layout-sidebar-right-3 |
| `layout-sidebar-right-2` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 31.5 | 30.4 | 34.5 | 88.2 | 1.22 | F | Lv | 0.47 | 0.92 | layout-sidebar-right-3 layout-sidebar-right |
| `layout-sidebar-right-3` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 43.2 | 38.6 | 44.7 | 114.3 | 1.22 | F | D | 0.47 | 0.99 | layout-sidebar-right-2 layout-sidebar-right |
| `layout-sidebar-right-4` | silhouette | 18.8 | 19.9 | 22.1 | 56.6 | 26.3 | 25.3 | 28.5 | 72.9 | 1.18 | Lv | Lv | 0.44 | 0.83 |  |
| `lightbulb` | silhouette | 14.4 | 15.1 | 17.5 | 44.8 | 38.9 | 32.3 | 37.5 | 96.0 | 1.22 | Lv | F | 0.43 | 1.00 |  |
| `lightbulb-2` | silhouette | 15.0 | 15.4 | 17.6 | 45.0 | 35.8 | 28.6 | 32.4 | 82.9 | 1.17 | Lv | Lv | 0.42 | 0.99 |  |
| `lightbulb-3` | silhouette | 14.8 | 15.7 | 17.7 | 45.4 | 37.6 | 31.1 | 35.7 | 91.5 | 1.20 | Lv | Lv | 0.34 | 0.89 |  |
| `lightbulb-4` | silhouette | 13.1 | 14.0 | 15.9 | 40.6 | 39.3 | 32.7 | 38.0 | 97.2 | 1.21 | Lv | F | 0.33 | 1.00 |  |
| `link` | silhouette | 16.0 | 17.5 | 19.5 | 50.0 | 23.2 | 21.3 | 25.9 | 66.3 | 1.22 | Lv | Lv | 0.38 | 0.54 |  |
| `link-2` | silhouette | 15.8 | 17.6 | 20.0 | 51.1 | 24.7 | 22.5 | 29.8 | 76.2 | 1.27 | Lv | Lv | 0.33 | 0.52 |  |
| `link-3` | box | 14.2 | 15.8 | 18.4 | 47.1 | 22.0 | 20.2 | 27.2 | 69.7 | 1.30 | Lv | Lv | 0.33 | 0.53 |  |
| `list-bullet` | mark | 11.9 | 13.2 | 14.2 | 36.3 | 20.6 | 18.0 | 23.5 | 60.2 | 1.19 | L | Lv | 0.32 | 0.50 |  |
| `list-bullet-2` | mark | 13.2 | 14.1 | 15.9 | 40.7 | 22.1 | 18.9 | 24.3 | 62.3 | 1.21 | Lv | Lv | 0.32 | 0.50 |  |
| `list-bullet-3` | mark | 11.5 | 13.6 | 15.6 | 39.9 | 12.6 | 15.2 | 18.0 | 46.2 | 1.35 | Lv | L | 0.47 | 0.66 |  |
| `list-ordered` | mark | 13.8 | 15.3 | 17.1 | 43.9 | 19.8 | 18.2 | 22.2 | 56.9 | 1.24 | Lv | Lv | 0.49 | 0.49 |  |
| `lock` | silhouette | 17.7 | 19.2 | 21.5 | 55.2 | 33.6 | 30.4 | 35.0 | 89.7 | 1.22 | Lv | Lv | 0.46 | 0.89 |  |
| `lock-2` | silhouette | 18.1 | 19.4 | 21.7 | 55.5 | 33.2 | 30.1 | 35.1 | 89.8 | 1.20 | Lv | Lv | 0.46 | 0.89 |  |
| `lock-3` | silhouette | 16.1 | 17.7 | 19.8 | 50.6 | 37.5 | 31.6 | 34.6 | 88.7 | 1.22 | Lv | Lv | 0.47 | 0.88 |  |
| `lock-4` | silhouette | 17.0 | 18.5 | 20.8 | 53.3 | 31.5 | 28.7 | 33.3 | 85.2 | 1.22 | Lv | Lv | 0.46 | 0.88 |  |
| `lock-5` | silhouette | 18.5 | 20.0 | 22.4 | 57.3 | 38.5 | 34.1 | 37.2 | 95.2 | 1.21 | Lv | F | 0.46 | 0.87 |  |
| `lock-6` | silhouette | 17.8 | 19.3 | 21.7 | 55.4 | 36.4 | 32.5 | 35.4 | 90.7 | 1.22 | Lv | Lv | 0.46 | 0.87 |  |
| `login` | silhouette | 13.1 | 14.4 | 16.5 | 42.3 | 19.7 | 18.0 | 23.5 | 60.1 | 1.26 | Lv | Lv | 0.55 | 0.76 |  |
| `login-2` | silhouette | 12.9 | 14.4 | 16.4 | 42.0 | 19.7 | 18.2 | 23.9 | 61.1 | 1.28 | Lv | Lv | 0.54 | 0.75 |  |
| `login-3` | silhouette | 13.1 | 14.4 | 16.5 | 42.3 | 19.7 | 18.0 | 23.5 | 60.1 | 1.26 | Lv | Lv | 0.55 | 0.76 |  |
| `login-4` | silhouette | 12.9 | 14.4 | 16.4 | 42.0 | 19.7 | 18.2 | 23.9 | 61.1 | 1.28 | Lv | Lv | 0.54 | 0.75 |  |
| `logout` | silhouette | 13.1 | 14.4 | 16.5 | 42.3 | 19.7 | 18.0 | 23.5 | 60.1 | 1.26 | Lv | Lv | 0.54 | 0.75 |  |
| `logout-2` | silhouette | 12.9 | 14.4 | 16.4 | 42.0 | 19.7 | 18.2 | 23.9 | 61.1 | 1.28 | Lv | Lv | 0.54 | 0.75 |  |
| `logout-3` | silhouette | 13.1 | 14.4 | 16.5 | 42.3 | 19.7 | 18.0 | 23.5 | 60.1 | 1.26 | Lv | Lv | 0.54 | 0.75 |  |
| `logout-4` | silhouette | 12.9 | 14.4 | 16.4 | 42.0 | 19.7 | 18.2 | 23.9 | 61.1 | 1.28 | Lv | Lv | 0.54 | 0.75 |  |
| `mail` | silhouette | 21.1 | 22.9 | 26.0 | 66.7 | 48.0 | 39.6 | 43.8 | 112.2 | 1.24 | F | F | 0.52 | 0.90 |  |
| `mail-2` | silhouette | 20.9 | 22.7 | 25.7 | 65.8 | 48.3 | 39.9 | 44.3 | 113.5 | 1.23 | F | D | 0.52 | 0.93 |  |
| `mail-3` | silhouette | 20.6 | 22.3 | 25.1 | 64.4 | 49.1 | 41.2 | 46.4 | 118.8 | 1.22 | F | D | 0.52 | 0.97 |  |
| `map-pin` | silhouette | 18.4 | 19.3 | 20.0 | 51.1 | 30.1 | 25.4 | 31.5 | 80.7 | 1.08 | Lv | Lv | 0.50 | 0.88 |  |
| `map-pin-2` | silhouette | 18.6 | 19.6 | 20.2 | 51.7 | 33.1 | 27.9 | 34.6 | 88.5 | 1.08 | Lv | Lv | 0.50 | 0.93 |  |
| `map-pin-3` | silhouette | 20.0 | 21.6 | 24.4 | 62.4 | 35.7 | 31.6 | 36.6 | 93.8 | 1.22 | F | Lv | 0.41 | 0.88 |  |
| `map-pin-4` | box | 17.9 | 18.4 | 18.5 | 47.3 | 28.5 | 23.0 | 27.8 | 71.0 | 1.03 | Lv | Lv | 0.50 | 0.80 |  |
| `map-pin-5` | silhouette | 17.1 | 18.3 | 20.3 | 51.9 | 20.5 | 20.0 | 22.2 | 56.8 | 1.19 | Lv | Lv | 0.47 | 0.73 |  |
| `maximize` | mark | 9.5 | 10.2 | 11.4 | 29.2 | 14.1 | 12.7 | 15.9 | 40.8 | 1.20 | L | L | 0.33 | 0.47 |  |
| `maximize-2` | mark | 8.2 | 9.5 | 10.2 | 26.1 | 11.2 | 11.3 | 13.0 | 33.2 | 1.25 | L | H | 0.30 | 0.41 |  |
| `maximize-3` | mark | 12.0 | 13.0 | 13.8 | 35.3 | 18.1 | 16.3 | 19.2 | 49.2 | 1.15 | L | L | 0.35 | 0.51 |  |
| `maximize-4` | mark | 11.2 | 12.9 | 14.8 | 38.0 | 15.7 | 15.6 | 19.7 | 50.5 | 1.33 | Lv | L | 0.54 | 0.76 |  |
| `maximize-5` | silhouette | 14.8 | 15.0 | 18.1 | 46.4 | 17.5 | 16.0 | 20.5 | 52.6 | 1.23 | Lv | L | 0.44 | 0.75 |  |
| `megaphone` | silhouette | 13.5 | 14.9 | 16.5 | 42.1 | 26.9 | 24.2 | 26.7 | 68.2 | 1.22 | Lv | Lv | 0.50 | 0.94 |  |
| `megaphone-2` | silhouette | 17.7 | 19.1 | 21.3 | 54.5 | 36.5 | 31.7 | 35.0 | 89.7 | 1.20 | Lv | Lv | 0.56 | 0.97 |  |
| `megaphone-3` | silhouette | 15.3 | 16.6 | 18.0 | 46.2 | 28.3 | 25.6 | 25.5 | 65.4 | 1.18 | Lv | Lv | 0.51 | 0.92 |  |
| `menu` | mark | 11.5 | 14.8 | 17.2 | 44.0 | 18.8 | 19.6 | 27.1 | 69.5 | 1.50 | Lv | Lv | 0.32 | 0.51 |  |
| `menu-2` | mark | 7.8 | 9.9 | 11.3 | 29.0 | 12.8 | 13.1 | 17.8 | 45.5 | 1.45 | L | L | 0.31 | 0.50 |  |
| `menu-3` | mark | 5.8 | 7.4 | 8.5 | 21.8 | 9.5 | 9.8 | 13.4 | 34.3 | 1.47 | H | H | 0.30 | 0.48 |  |
| `menu-4` | mark | 7.6 | 9.9 | 11.5 | 29.3 | 12.6 | 13.1 | 18.1 | 46.3 | 1.50 | L | L | 0.31 | 0.48 |  |
| `menu-arrow-left` | mark | 9.3 | 11.7 | 13.7 | 35.0 | 14.5 | 15.0 | 20.6 | 52.7 | 1.47 | L | L | 0.34 | 0.50 |  |
| `menu-arrow-right` | mark | 9.3 | 11.7 | 13.7 | 35.0 | 14.5 | 15.0 | 20.6 | 52.7 | 1.47 | L | L | 0.34 | 0.50 |  |
| `message` | silhouette | 15.6 | 17.0 | 19.0 | 48.7 | 45.3 | 39.9 | 44.7 | 114.5 | 1.22 | Lv | D | 0.44 | 1.00 |  |
| `message-2` | silhouette | 15.2 | 16.5 | 18.5 | 47.3 | 45.0 | 39.5 | 44.4 | 113.6 | 1.22 | Lv | D | 0.42 | 1.00 |  |
| `message-3` | silhouette | 16.0 | 18.0 | 20.7 | 53.0 | 58.1 | 53.5 | 64.0 | 163.9 | 1.29 | Lv | D | 0.37 | 1.00 |  |
| `message-4` | silhouette | 19.6 | 21.2 | 23.5 | 60.2 | 42.9 | 36.0 | 41.8 | 106.9 | 1.20 | Lv | F | 0.42 | 0.90 |  |
| `message-5` | silhouette | 15.6 | 17.6 | 20.0 | 51.2 | 55.9 | 51.6 | 60.9 | 156.0 | 1.28 | Lv | D | 0.36 | 1.00 |  |
| `message-6` | silhouette | 14.0 | 15.3 | 17.3 | 44.4 | 39.1 | 34.3 | 37.9 | 97.0 | 1.24 | Lv | F | 0.42 | 0.99 |  |
| `message-7` | silhouette | 14.3 | 15.6 | 17.5 | 44.9 | 42.4 | 37.7 | 42.3 | 108.4 | 1.23 | Lv | F | 0.42 | 1.00 |  |
| `microphone` | silhouette | 15.8 | 17.2 | 18.1 | 46.3 | 19.9 | 20.0 | 21.1 | 54.1 | 1.14 | Lv | L | 0.48 | 0.79 |  |
| `microphone-2` | silhouette | 17.2 | 18.2 | 19.4 | 49.6 | 24.5 | 22.6 | 22.4 | 57.3 | 1.13 | Lv | Lv | 0.48 | 0.79 | microphone-5 |
| `microphone-3` | silhouette | 15.7 | 17.1 | 19.4 | 49.7 | 19.8 | 19.9 | 22.5 | 57.5 | 1.23 | Lv | Lv | 0.49 | 0.80 |  |
| `microphone-4` | silhouette | 15.8 | 17.0 | 19.3 | 49.4 | 19.9 | 19.8 | 22.3 | 57.1 | 1.22 | Lv | Lv | 0.48 | 0.79 |  |
| `microphone-5` | silhouette | 17.4 | 18.6 | 19.4 | 49.6 | 26.0 | 23.3 | 22.4 | 57.3 | 1.11 | Lv | Lv | 0.48 | 0.79 | microphone-2 |
| `minus` | mark | 3.8 | 4.9 | 5.7 | 14.7 | 6.3 | 6.5 | 9.0 | 23.2 | 1.50 | H | H | 0.30 | 0.48 |  |
| `minus-circle` | silhouette | 17.8 | 20.0 | 22.6 | 57.9 | 49.8 | 46.2 | 55.0 | 140.8 | 1.27 | Lv | D | 0.33 | 0.94 |  |
| `minus-circle-small` | silhouette | 17.4 | 19.6 | 22.1 | 56.6 | 50.4 | 46.7 | 55.8 | 142.8 | 1.27 | Lv | D | 0.32 | 0.94 |  |
| `minus-large` | mark | 4.6 | 5.9 | 6.7 | 17.2 | 7.6 | 7.8 | 10.6 | 27.2 | 1.46 | H | H | 0.30 | 0.48 |  |
| `minus-small` | mark | 3.0 | 4.0 | 4.8 | 12.2 | 5.0 | 5.3 | 7.5 | 19.2 | 1.56 | H | H | 0.30 | 0.48 |  |
| `moon` | silhouette | 16.5 | 18.4 | 21.2 | 54.3 | 39.6 | 37.4 | 44.6 | 114.1 | 1.29 | Lv | D | 0.46 | 0.99 |  |
| `more-horizontal` | mark | 3.7 | 4.3 | 5.3 | 13.6 | 6.6 | 6.0 | 7.7 | 19.8 | 1.44 | H | H | 0.26 | 0.36 |  |
| `more-vertical` | mark | 3.7 | 4.3 | 5.3 | 13.6 | 6.6 | 6.0 | 7.7 | 19.8 | 1.44 | H | H | 0.26 | 0.36 |  |
| `package` | silhouette | 20.9 | 22.4 | 25.1 | 64.2 | 46.8 | 37.5 | 41.5 | 106.4 | 1.20 | F | F | 0.57 | 0.97 |  |
| `package-2` | silhouette | 19.8 | 21.3 | 23.8 | 61.0 | 37.7 | 32.0 | 36.1 | 92.5 | 1.20 | Lv | Lv | 0.51 | 0.84 |  |
| `package-3` | silhouette | 24.2 | 26.9 | 30.9 | 79.1 | 42.6 | 38.1 | 44.5 | 113.9 | 1.28 | D | D | 0.53 | 0.86 |  |
| `paintbrush` | silhouette | 21.3 | 22.7 | 25.3 | 64.8 | 35.6 | 29.5 | 33.7 | 86.3 | 1.19 | F | Lv | 0.50 | 0.83 |  |
| `paintbrush-2` | silhouette | 10.0 | 11.3 | 12.5 | 31.9 | 13.0 | 13.9 | 15.1 | 38.6 | 1.25 | L | L | 0.55 | 0.82 |  |
| `paintbrush-3` | silhouette | 12.1 | 13.2 | 14.8 | 37.9 | 14.0 | 14.5 | 16.6 | 42.4 | 1.22 | Lv | L | 0.55 | 0.77 |  |
| `paintbrush-4` | silhouette | 10.0 | 10.9 | 12.3 | 31.4 | 12.8 | 13.1 | 14.8 | 37.8 | 1.23 | L | L | 0.53 | 0.79 |  |
| `paintbrush-5` | silhouette | 11.5 | 12.6 | 13.9 | 35.6 | 13.9 | 14.6 | 16.1 | 41.2 | 1.21 | L | L | 0.56 | 0.80 |  |
| `paintbrush-6` | silhouette | 13.2 | 14.5 | 16.4 | 41.9 | 17.1 | 17.9 | 20.1 | 51.5 | 1.24 | Lv | L | 0.54 | 0.86 |  |
| `paintbrush-7` | silhouette | 12.6 | 13.7 | 15.2 | 38.9 | 14.4 | 15.1 | 16.6 | 42.5 | 1.21 | Lv | L | 0.56 | 0.74 |  |
| `paintbrush-8` | silhouette | 10.6 | 11.8 | 13.3 | 34.0 | 14.9 | 15.7 | 18.0 | 46.2 | 1.26 | L | L | 0.49 | 0.87 |  |
| `pencil` | silhouette | 13.1 | 14.2 | 16.1 | 41.3 | 20.1 | 17.9 | 20.4 | 52.3 | 1.23 | Lv | L | 0.56 | 0.82 |  |
| `pencil-2` | silhouette | 13.3 | 14.3 | 16.3 | 41.8 | 20.5 | 18.2 | 20.9 | 53.5 | 1.23 | Lv | L | 0.56 | 0.82 |  |
| `pencil-3` | silhouette | 13.5 | 14.5 | 16.5 | 42.3 | 22.4 | 19.2 | 22.1 | 56.7 | 1.22 | Lv | Lv | 0.55 | 0.85 |  |
| `pencil-4` | silhouette | 15.9 | 16.9 | 19.1 | 48.8 | 23.0 | 20.7 | 23.6 | 60.3 | 1.20 | Lv | Lv | 0.56 | 0.82 |  |
| `phone` | silhouette | 14.9 | 15.9 | 18.0 | 46.0 | 25.9 | 23.7 | 27.7 | 70.9 | 1.20 | Lv | Lv | 0.44 | 0.85 |  |
| `pin` | silhouette | 14.0 | 15.1 | 17.1 | 43.7 | 27.8 | 24.7 | 29.4 | 75.4 | 1.22 | Lv | Lv | 0.45 | 0.97 |  |
| `pin-2` | silhouette | 15.5 | 17.7 | 20.1 | 51.3 | 28.6 | 29.6 | 31.4 | 80.3 | 1.29 | Lv | Lv | 0.46 | 0.94 |  |
| `pin-3` | silhouette | 14.7 | 15.4 | 17.5 | 44.8 | 26.4 | 24.1 | 26.3 | 67.3 | 1.19 | Lv | Lv | 0.46 | 0.94 |  |
| `pin-4` | silhouette | 14.8 | 16.9 | 18.8 | 48.2 | 27.5 | 26.8 | 29.8 | 76.2 | 1.27 | Lv | Lv | 0.45 | 0.95 |  |
| `pin-5` | silhouette | 13.6 | 14.9 | 16.8 | 43.1 | 22.4 | 22.0 | 24.0 | 61.3 | 1.24 | Lv | Lv | 0.48 | 0.93 |  |
| `pin-6` | silhouette | 14.0 | 15.7 | 17.5 | 44.8 | 28.0 | 27.7 | 29.6 | 75.7 | 1.25 | Lv | Lv | 0.45 | 0.96 |  |
| `play` | mark | 12.9 | 13.2 | 14.5 | 37.0 | 32.0 | 25.8 | 28.2 | 72.2 | 1.12 | Lv | Lv | 0.39 | 0.98 |  |
| `play-2` | mark | 12.9 | 13.2 | 14.4 | 36.9 | 34.2 | 27.5 | 29.8 | 76.3 | 1.12 | Lv | Lv | 0.36 | 0.99 |  |
| `play-3` | mark | 11.3 | 10.8 | 11.3 | 29.0 | 23.7 | 17.8 | 18.4 | 47.0 | 1.01 | L | L | 0.41 | 0.93 |  |
| `plug` | silhouette | 14.2 | 15.2 | 17.1 | 43.8 | 30.2 | 25.3 | 29.4 | 75.2 | 1.20 | Lv | Lv | 0.46 | 0.98 |  |
| `plug-2` | silhouette | 14.8 | 15.7 | 17.8 | 45.5 | 32.9 | 27.3 | 31.6 | 81.0 | 1.20 | Lv | Lv | 0.46 | 0.99 |  |
| `plug-3` | silhouette | 14.0 | 14.8 | 16.7 | 42.7 | 26.9 | 22.1 | 25.4 | 65.0 | 1.19 | Lv | Lv | 0.49 | 0.96 |  |
| `plug-4` | silhouette | 15.1 | 16.5 | 18.6 | 47.7 | 37.9 | 33.5 | 38.2 | 97.8 | 1.23 | Lv | F | 0.45 | 1.00 |  |
| `plug-5` | silhouette | 14.2 | 15.2 | 17.1 | 43.8 | 30.2 | 25.3 | 29.4 | 75.2 | 1.20 | Lv | Lv | 0.46 | 0.98 |  |
| `plug-6` | silhouette | 14.9 | 16.5 | 18.0 | 46.0 | 31.1 | 30.4 | 31.7 | 81.3 | 1.21 | Lv | Lv | 0.46 | 0.99 |  |
| `plug-7` | silhouette | 15.9 | 16.9 | 19.0 | 48.7 | 31.9 | 27.1 | 31.3 | 80.1 | 1.20 | Lv | Lv | 0.46 | 0.98 |  |
| `plus` | mark | 7.3 | 9.3 | 10.9 | 27.8 | 11.5 | 12.1 | 16.5 | 42.3 | 1.50 | L | L | 0.51 | 0.73 |  |
| `plus-circle` | silhouette | 20.0 | 22.3 | 25.1 | 64.1 | 47.9 | 44.3 | 52.9 | 135.3 | 1.25 | F | D | 0.48 | 0.88 |  |
| `plus-circle-small` | silhouette | 19.3 | 21.5 | 24.1 | 61.6 | 48.9 | 45.2 | 54.2 | 138.8 | 1.25 | F | D | 0.45 | 0.90 |  |
| `plus-large` | mark | 8.8 | 11.2 | 12.8 | 32.8 | 14.1 | 14.6 | 19.7 | 50.3 | 1.45 | L | L | 0.51 | 0.73 |  |
| `plus-small` | mark | 5.7 | 7.4 | 8.9 | 22.8 | 8.9 | 9.6 | 13.4 | 34.3 | 1.56 | H | H | 0.51 | 0.73 |  |
| `presentation` | box | 18.9 | 20.7 | 23.2 | 59.3 | 44.7 | 39.8 | 47.2 | 120.7 | 1.22 | Lv | D | 0.64 | 1.00 |  |
| `presentation-2` | silhouette | 23.1 | 25.9 | 30.1 | 77.2 | 49.8 | 45.6 | 52.1 | 133.4 | 1.31 | D | D | 0.53 | 0.89 |  |
| `printer` | silhouette | 24.7 | 27.1 | 31.4 | 80.4 | 36.8 | 34.7 | 44.6 | 114.2 | 1.27 | D | D | 0.49 | 0.92 |  |
| `printer-2` | silhouette | 22.7 | 25.7 | 29.4 | 75.3 | 41.8 | 40.0 | 51.4 | 131.6 | 1.29 | D | D | 0.49 | 0.99 |  |
| `puzzle` | silhouette | 16.8 | 18.4 | 21.5 | 55.1 | 47.6 | 43.0 | 50.4 | 129.0 | 1.28 | Lv | D | 0.40 | 1.00 |  |
| `puzzle-2` | silhouette | 18.2 | 20.5 | 22.7 | 58.1 | 48.6 | 42.1 | 50.3 | 128.8 | 1.25 | Lv | D | 0.41 | 1.00 |  |
| `puzzle-3` | silhouette | 19.6 | 20.7 | 23.7 | 60.8 | 47.3 | 41.2 | 49.0 | 125.5 | 1.21 | Lv | D | 0.43 | 1.00 |  |
| `puzzle-4` | silhouette | 22.8 | 25.3 | 29.4 | 75.3 | 50.0 | 44.7 | 53.0 | 135.6 | 1.29 | D | D | 0.48 | 0.98 |  |
| `puzzle-5` | silhouette | 19.4 | 23.4 | 24.8 | 63.5 | 45.9 | 43.4 | 48.0 | 122.9 | 1.28 | F | D | 0.41 | 0.98 |  |
| `refresh` | mark | 17.0 | 18.2 | 20.2 | 51.7 | 25.9 | 22.6 | 28.5 | 72.8 | 1.19 | Lv | Lv | 0.55 | 0.76 |  |
| `refresh-2` | silhouette | 19.3 | 21.4 | 24.5 | 62.6 | 29.7 | 27.0 | 35.4 | 90.5 | 1.27 | F | Lv | 0.55 | 0.76 |  |
| `refresh-3` | mark | 17.2 | 18.2 | 20.2 | 51.7 | 25.8 | 22.6 | 28.5 | 72.8 | 1.18 | Lv | Lv | 0.55 | 0.76 |  |
| `rotate-ccw` | mark | 15.2 | 15.9 | 17.4 | 44.6 | 23.4 | 20.1 | 25.0 | 64.0 | 1.15 | Lv | Lv | 0.55 | 0.75 |  |
| `rotate-ccw-10` | mark | 11.0 | 12.4 | 14.0 | 35.9 | 16.9 | 15.7 | 20.4 | 52.2 | 1.27 | L | L | 0.55 | 0.74 |  |
| `rotate-ccw-11` | mark | 14.0 | 15.2 | 17.0 | 43.4 | 22.8 | 21.0 | 22.4 | 57.3 | 1.21 | Lv | Lv | 0.52 | 0.85 |  |
| `rotate-ccw-2` | mark | 13.5 | 14.6 | 16.3 | 41.7 | 21.1 | 18.7 | 24.2 | 62.0 | 1.21 | Lv | Lv | 0.54 | 0.75 |  |
| `rotate-ccw-3` | mark | 11.8 | 12.9 | 14.5 | 37.0 | 18.5 | 16.5 | 21.5 | 55.1 | 1.22 | Lv | L | 0.54 | 0.75 |  |
| `rotate-ccw-4` | mark | 18.3 | 18.7 | 20.4 | 52.2 | 31.2 | 24.9 | 26.1 | 66.9 | 1.11 | Lv | Lv | 0.55 | 0.90 |  |
| `rotate-ccw-5` | mark | 15.9 | 17.1 | 19.4 | 49.7 | 24.8 | 21.8 | 28.8 | 73.7 | 1.22 | Lv | Lv | 0.54 | 0.75 |  |
| `rotate-ccw-6` | mark | 17.8 | 18.4 | 20.5 | 52.4 | 28.6 | 23.9 | 25.4 | 65.0 | 1.15 | Lv | Lv | 0.52 | 0.85 |  |
| `rotate-ccw-7` | mark | 8.8 | 9.8 | 11.3 | 28.9 | 13.5 | 12.4 | 16.7 | 42.6 | 1.29 | L | L | 0.55 | 0.73 |  |
| `rotate-ccw-8` | mark | 11.2 | 12.5 | 14.0 | 35.9 | 17.1 | 15.8 | 20.3 | 51.8 | 1.26 | L | L | 0.55 | 0.75 |  |
| `rotate-ccw-9` | mark | 14.4 | 14.3 | 16.1 | 41.2 | 23.8 | 17.9 | 19.6 | 50.1 | 1.11 | Lv | L | 0.56 | 0.85 |  |
| `save` | silhouette | 23.8 | 24.7 | 28.4 | 72.7 | 46.0 | 42.7 | 48.4 | 123.9 | 1.19 | F | D | 0.53 | 0.98 |  |
| `search` | silhouette | 13.1 | 14.2 | 16.1 | 41.3 | 20.8 | 18.6 | 24.0 | 61.4 | 1.23 | Lv | Lv | 0.43 | 0.64 |  |
| `search-2` | silhouette | 13.8 | 14.9 | 17.0 | 43.6 | 21.9 | 19.5 | 25.4 | 65.2 | 1.23 | Lv | Lv | 0.43 | 0.64 |  |
| `search-3` | silhouette | 12.1 | 13.1 | 14.7 | 37.7 | 19.2 | 17.2 | 21.7 | 55.6 | 1.22 | Lv | L | 0.44 | 0.62 |  |
| `send` | mark | 15.2 | 16.0 | 17.7 | 45.4 | 23.6 | 22.5 | 25.3 | 64.8 | 1.17 | Lv | Lv | 0.46 | 0.81 |  |
| `shield` | silhouette | 14.7 | 16.1 | 18.1 | 46.4 | 47.9 | 41.8 | 48.0 | 122.8 | 1.24 | Lv | D | 0.36 | 1.00 |  |
| `shield-2` | silhouette | 14.3 | 15.8 | 17.8 | 45.5 | 46.9 | 41.0 | 47.0 | 120.3 | 1.24 | Lv | D | 0.34 | 1.00 |  |
| `sliders` | mark | 13.5 | 14.8 | 18.1 | 46.4 | 15.9 | 16.4 | 22.0 | 56.2 | 1.35 | Lv | L | 0.49 | 0.77 |  |
| `sliders-2` | mark | 14.5 | 14.1 | 20.1 | 51.5 | 22.0 | 17.6 | 29.7 | 75.9 | 1.39 | Lv | Lv | 0.44 | 0.60 |  |
| `sliders-3` | mark | 20.2 | 21.0 | 18.1 | 46.4 | 23.9 | 22.3 | 22.0 | 56.2 | 0.90 | Lv | L | 0.49 | 0.77 |  |
| `sliders-4` | mark | 17.1 | 18.4 | 20.1 | 51.5 | 26.6 | 23.5 | 29.7 | 75.9 | 1.18 | Lv | Lv | 0.44 | 0.60 |  |
| `sliders-5` | mark | 13.6 | 14.9 | 18.2 | 46.7 | 16.0 | 16.5 | 22.1 | 56.5 | 1.35 | Lv | Lv | 0.49 | 0.76 |  |
| `sort` | box | 13.5 | 17.2 | 20.2 | 51.7 | 20.5 | 21.9 | 29.6 | 75.8 | 1.50 | Lv | Lv | 0.54 | 0.76 |  |
| `sort-2` | box | 12.0 | 15.3 | 17.7 | 45.4 | 18.1 | 19.4 | 25.7 | 65.8 | 1.48 | Lv | Lv | 0.54 | 0.75 |  |
| `sort-3` | box | 9.9 | 12.3 | 13.9 | 35.5 | 15.2 | 15.7 | 20.5 | 52.4 | 1.41 | L | L | 0.34 | 0.53 |  |
| `sort-alpha-ascending` | box | 13.8 | 18.1 | 21.1 | 54.0 | 14.1 | 18.4 | 21.4 | 54.9 | 1.52 | Lv | L | 0.55 | 0.58 |  |
| `sort-alpha-ascending-2` | box | 12.5 | 16.4 | 19.0 | 48.6 | 12.8 | 16.7 | 19.3 | 49.5 | 1.52 | Lv | L | 0.54 | 0.58 |  |
| `sort-alpha-ascending-3` | box | 12.5 | 16.4 | 19.0 | 48.6 | 12.8 | 16.7 | 19.3 | 49.5 | 1.52 | Lv | L | 0.55 | 0.58 |  |
| `sort-alpha-descending` | box | 13.8 | 18.1 | 21.1 | 54.0 | 14.1 | 18.4 | 21.4 | 54.9 | 1.52 | Lv | L | 0.54 | 0.58 |  |
| `sort-alpha-descending-2` | box | 12.5 | 16.4 | 19.0 | 48.6 | 12.8 | 16.7 | 19.3 | 49.5 | 1.52 | Lv | L | 0.54 | 0.58 |  |
| `sort-alpha-descending-3` | box | 12.5 | 16.4 | 19.0 | 48.6 | 12.8 | 16.7 | 19.3 | 49.5 | 1.52 | Lv | L | 0.54 | 0.58 |  |
| `sort-ascending` | mark | 10.6 | 13.6 | 15.6 | 39.9 | 16.4 | 17.4 | 23.2 | 59.3 | 1.47 | Lv | Lv | 0.54 | 0.75 |  |
| `sort-descending` | mark | 10.6 | 13.6 | 15.6 | 39.9 | 16.4 | 17.4 | 23.2 | 59.3 | 1.47 | Lv | Lv | 0.54 | 0.75 |  |
| `sort-numeric-ascending` | box | 13.0 | 16.2 | 18.6 | 47.7 | 13.0 | 16.2 | 18.6 | 47.7 | 1.43 | Lv | L | 0.52 | 0.52 |  |
| `sort-numeric-ascending-2` | box | 11.7 | 14.5 | 16.5 | 42.3 | 11.7 | 14.5 | 16.5 | 42.3 | 1.42 | Lv | L | 0.48 | 0.48 |  |
| `sort-numeric-ascending-3` | box | 11.7 | 14.5 | 16.5 | 42.3 | 11.7 | 14.5 | 16.5 | 42.3 | 1.42 | Lv | L | 0.48 | 0.48 |  |
| `sort-numeric-descending` | box | 13.0 | 16.2 | 18.6 | 47.7 | 13.0 | 16.2 | 18.6 | 47.7 | 1.43 | Lv | L | 0.52 | 0.52 |  |
| `sort-numeric-descending-2` | box | 11.7 | 14.5 | 16.5 | 42.3 | 11.7 | 14.5 | 16.5 | 42.3 | 1.42 | Lv | L | 0.48 | 0.48 |  |
| `sort-numeric-descending-3` | box | 11.7 | 14.5 | 16.5 | 42.3 | 11.7 | 14.5 | 16.5 | 42.3 | 1.42 | Lv | L | 0.48 | 0.48 |  |
| `sparkle` | silhouette | 15.3 | 17.3 | 19.7 | 50.5 | 25.9 | 25.8 | 30.8 | 78.8 | 1.29 | Lv | Lv | 0.47 | 0.96 |  |
| `sparkle-2` | silhouette | 15.7 | 17.9 | 19.5 | 50.0 | 21.6 | 23.2 | 25.9 | 66.3 | 1.24 | Lv | Lv | 0.52 | 0.94 |  |
| `sparkle-3` | silhouette | 17.1 | 19.0 | 21.3 | 54.6 | 22.4 | 23.6 | 26.3 | 67.3 | 1.25 | Lv | Lv | 0.52 | 0.90 |  |
| `sparkle-4` | silhouette | 16.6 | 18.3 | 19.8 | 50.6 | 24.0 | 23.4 | 25.4 | 65.1 | 1.19 | Lv | Lv | 0.48 | 0.91 |  |
| `star` | box | 16.9 | 19.0 | 21.8 | 55.7 | 36.1 | 35.1 | 41.5 | 106.3 | 1.29 | Lv | F | 0.43 | 0.99 |  |
| `store` | silhouette | 23.7 | 25.4 | 28.0 | 71.8 | 42.4 | 35.7 | 40.1 | 102.7 | 1.18 | F | F | 0.55 | 0.90 |  |
| `store-2` | silhouette | 24.8 | 26.6 | 29.6 | 75.8 | 35.2 | 30.7 | 33.4 | 85.5 | 1.19 | D | Lv | 0.55 | 0.79 |  |
| `sun` | silhouette | 13.9 | 14.5 | 16.0 | 41.1 | 18.0 | 17.6 | 19.8 | 50.7 | 1.16 | Lv | L | 0.40 | 0.83 |  |
| `table` | silhouette | 27.0 | 28.7 | 32.4 | 83.0 | 41.2 | 32.5 | 35.0 | 89.6 | 1.20 | D | Lv | 0.56 | 0.68 |  |
| `table-2` | silhouette | 23.5 | 25.2 | 28.4 | 72.7 | 45.6 | 37.3 | 41.3 | 105.8 | 1.21 | F | F | 0.54 | 0.89 |  |
| `target` | silhouette | 24.5 | 27.7 | 31.1 | 79.7 | 45.1 | 39.6 | 46.5 | 119.0 | 1.27 | D | D | 0.42 | 0.69 |  |
| `target-2` | silhouette | 20.1 | 22.7 | 25.9 | 66.4 | 49.7 | 44.8 | 53.0 | 135.6 | 1.29 | F | D | 0.44 | 0.90 |  |
| `target-3` | silhouette | 14.6 | 16.4 | 18.9 | 48.3 | 30.2 | 27.7 | 32.6 | 83.4 | 1.29 | Lv | Lv | 0.41 | 0.85 |  |
| `text` | mark | 11.6 | 12.8 | 14.3 | 36.5 | 17.3 | 15.9 | 20.0 | 51.1 | 1.22 | L | L | 0.45 | 0.66 | text-4 |
| `text-2` | mark | 9.9 | 12.8 | 14.8 | 37.8 | 16.2 | 16.9 | 23.2 | 59.5 | 1.49 | Lv | Lv | 0.32 | 0.51 |  |
| `text-3` | mark | 10.7 | 13.0 | 14.8 | 37.9 | 17.2 | 17.0 | 22.8 | 58.4 | 1.38 | Lv | Lv | 0.45 | 0.65 |  |
| `text-4` | mark | 10.1 | 12.5 | 14.3 | 36.5 | 14.7 | 15.4 | 20.0 | 51.1 | 1.41 | L | L | 0.45 | 0.66 | text |
| `thumbs-up` | silhouette | 17.6 | 18.9 | 21.2 | 54.4 | 38.3 | 33.4 | 37.6 | 96.2 | 1.21 | Lv | F | 0.50 | 0.98 |  |
| `thumbs-up-2` | silhouette | 17.7 | 19.0 | 21.3 | 54.6 | 38.1 | 33.1 | 37.2 | 95.3 | 1.21 | Lv | F | 0.51 | 0.98 |  |
| `toggle-on` | box | 15.6 | 17.7 | 19.4 | 49.7 | 25.3 | 25.0 | 30.7 | 78.6 | 1.24 | Lv | Lv | 0.49 | 0.97 |  |
| `toggle-on-2` | box | 15.0 | 16.9 | 18.7 | 47.8 | 31.5 | 32.8 | 35.9 | 91.9 | 1.24 | Lv | Lv | 0.47 | 0.99 |  |
| `trash` | silhouette | 18.7 | 20.2 | 21.5 | 55.1 | 37.4 | 32.7 | 36.9 | 94.6 | 1.15 | Lv | F | 0.52 | 0.88 |  |
| `trash-5` | silhouette | 17.9 | 19.1 | 19.6 | 50.1 | 34.4 | 29.1 | 32.8 | 83.9 | 1.09 | Lv | Lv | 0.51 | 0.87 |  |
| `upload` | silhouette | 13.1 | 14.4 | 16.5 | 42.3 | 19.7 | 18.0 | 23.5 | 60.1 | 1.26 | Lv | Lv | 0.54 | 0.75 |  |
| `upload-2` | silhouette | 12.3 | 13.8 | 15.9 | 40.8 | 18.8 | 17.5 | 23.1 | 59.1 | 1.29 | Lv | Lv | 0.54 | 0.75 |  |
| `upload-3` | silhouette | 14.2 | 15.5 | 17.5 | 44.8 | 21.4 | 19.5 | 25.0 | 64.1 | 1.24 | Lv | Lv | 0.54 | 0.75 |  |
| `user` | silhouette | 15.6 | 16.3 | 18.2 | 46.5 | 32.7 | 28.3 | 32.3 | 82.8 | 1.16 | Lv | Lv | 0.45 | 0.98 |  |
| `user-2` | silhouette | 16.3 | 17.3 | 18.7 | 47.9 | 32.5 | 28.3 | 31.8 | 81.5 | 1.15 | Lv | Lv | 0.40 | 0.95 |  |
| `user-3` | silhouette | 13.8 | 14.8 | 15.6 | 40.0 | 35.5 | 30.5 | 32.8 | 83.9 | 1.13 | Lv | Lv | 0.39 | 0.94 |  |
| `user-4` | silhouette | 12.5 | 13.5 | 14.2 | 36.4 | 28.9 | 24.6 | 27.1 | 69.4 | 1.13 | L | Lv | 0.40 | 0.84 |  |
| `users` | silhouette | 18.6 | 18.3 | 20.9 | 53.5 | 31.3 | 25.5 | 28.9 | 74.0 | 1.12 | Lv | Lv | 0.46 | 0.83 |  |
| `users-2` | silhouette | 18.9 | 18.4 | 20.8 | 53.3 | 30.8 | 24.6 | 28.5 | 72.9 | 1.10 | Lv | Lv | 0.46 | 0.81 |  |
| `users-2-behind` | silhouette | 18.6 | 19.3 | 21.3 | 54.5 | 31.7 | 27.0 | 30.8 | 78.8 | 1.14 | Lv | Lv | 0.46 | 0.89 |  |
| `users-2-level` | silhouette | 20.2 | 19.7 | 21.2 | 54.2 | 34.1 | 26.5 | 27.9 | 71.5 | 1.05 | Lv | Lv | 0.48 | 0.78 |  |
| `users-2-wide` | silhouette | 19.8 | 19.7 | 21.1 | 54.1 | 31.2 | 25.9 | 27.2 | 69.7 | 1.07 | Lv | Lv | 0.48 | 0.77 |  |
| `users-3` | silhouette | 16.3 | 16.8 | 17.6 | 45.2 | 33.1 | 27.4 | 28.3 | 72.5 | 1.08 | Lv | Lv | 0.46 | 0.78 |  |
| `users-3-behind` | silhouette | 16.8 | 17.0 | 18.6 | 47.6 | 34.8 | 28.4 | 31.5 | 80.6 | 1.11 | Lv | Lv | 0.46 | 0.89 |  |
| `users-3-level` | silhouette | 16.3 | 16.3 | 15.8 | 40.3 | 33.5 | 26.8 | 26.2 | 67.1 | 0.97 | Lv | Lv | 0.47 | 0.78 |  |
| `users-3-wide` | silhouette | 16.1 | 16.5 | 17.3 | 44.3 | 32.1 | 26.5 | 27.7 | 71.0 | 1.07 | Lv | Lv | 0.46 | 0.78 |  |
| `users-4` | silhouette | 15.8 | 16.5 | 18.0 | 46.1 | 30.1 | 26.0 | 28.3 | 72.3 | 1.14 | Lv | Lv | 0.40 | 0.84 |  |
| `users-4-behind` | silhouette | 15.5 | 17.0 | 16.5 | 42.4 | 31.3 | 27.9 | 28.8 | 73.7 | 1.07 | Lv | Lv | 0.41 | 0.84 |  |
| `users-4-level` | silhouette | 16.1 | 16.3 | 16.8 | 42.9 | 31.2 | 25.5 | 26.0 | 66.6 | 1.04 | Lv | Lv | 0.47 | 0.75 |  |
| `users-4-wide` | silhouette | 15.7 | 17.0 | 18.6 | 47.7 | 27.6 | 24.8 | 27.4 | 70.1 | 1.19 | Lv | Lv | 0.47 | 0.75 |  |
| `users-behind` | silhouette | 18.5 | 18.7 | 22.1 | 56.5 | 32.7 | 27.6 | 32.2 | 82.5 | 1.20 | Lv | Lv | 0.46 | 0.89 |  |
| `users-level` | silhouette | 19.1 | 19.0 | 20.2 | 51.8 | 32.2 | 26.1 | 27.7 | 71.0 | 1.06 | Lv | Lv | 0.48 | 0.83 |  |
| `users-wide` | silhouette | 19.0 | 19.8 | 21.5 | 55.1 | 30.8 | 25.6 | 28.2 | 72.3 | 1.13 | Lv | Lv | 0.47 | 0.79 |  |
| `volume` | silhouette | 17.2 | 18.4 | 19.9 | 50.9 | 27.3 | 25.6 | 27.6 | 70.8 | 1.15 | Lv | Lv | 0.45 | 0.95 |  |
| `volume-low` | anchor | 12.9 | 13.7 | 14.9 | 38.1 | 22.9 | 21.0 | 22.6 | 57.9 | 1.16 | Lv | Lv | 0.45 | 0.95 |  |
| `volume-minus` | anchor | 12.5 | 13.3 | 14.6 | 37.3 | 22.6 | 20.5 | 22.3 | 57.1 | 1.16 | Lv | Lv | 0.44 | 0.95 |  |
| `volume-none` | anchor | 10.5 | 11.2 | 12.3 | 31.4 | 20.6 | 18.4 | 20.0 | 51.2 | 1.16 | L | L | 0.44 | 0.95 |  |
| `volume-off` | silhouette | 15.9 | 16.8 | 18.6 | 47.7 | 20.0 | 17.5 | 19.2 | 49.3 | 1.17 | Lv | L | 0.63 | 0.72 |  |
| `volume-plus` | anchor | 14.1 | 14.9 | 16.3 | 41.7 | 24.2 | 22.1 | 24.0 | 61.5 | 1.15 | Lv | Lv | 0.44 | 0.95 |  |
| `volume-x` | anchor | 15.5 | 16.2 | 17.8 | 45.6 | 25.5 | 23.5 | 25.6 | 65.4 | 1.15 | Lv | Lv | 0.50 | 0.95 |  |
| `wallet` | silhouette | 18.7 | 20.5 | 22.7 | 58.2 | 49.9 | 42.4 | 48.8 | 125.0 | 1.21 | Lv | D | 0.54 | 1.00 |  |
| `wallet-2` | silhouette | 21.9 | 21.5 | 24.1 | 61.6 | 49.6 | 44.4 | 51.6 | 132.0 | 1.10 | F | D | 0.55 | 1.00 |  |
| `wallet-3` | silhouette | 20.3 | 21.9 | 24.0 | 61.4 | 44.1 | 38.7 | 43.8 | 112.0 | 1.18 | F | F | 0.51 | 0.98 |  |
| `wand` | silhouette | 17.6 | 19.6 | 21.9 | 56.2 | 21.6 | 23.3 | 26.5 | 67.8 | 1.25 | Lv | Lv | 0.70 | 0.82 |  |
| `wand-2` | silhouette | 12.8 | 13.5 | 15.6 | 39.8 | 13.8 | 13.8 | 15.6 | 40.0 | 1.22 | Lv | L | 0.69 | 0.70 |  |
| `wand-3` | silhouette | 8.8 | 9.0 | 10.1 | 25.9 | 8.8 | 9.0 | 10.1 | 25.9 | 1.15 | L | H | 0.65 | 0.65 |  |
| `watch` | box | 17.6 | 17.6 | 18.0 | 46.2 | 29.8 | 24.3 | 27.3 | 69.9 | 1.02 | Lv | Lv | 0.52 | 0.97 |  |
| `watch-2` | box | 17.2 | 17.8 | 18.8 | 48.2 | 37.7 | 29.7 | 30.4 | 77.8 | 1.10 | Lv | Lv | 0.54 | 0.98 |  |
| `watch-3` | silhouette | 20.0 | 20.5 | 20.7 | 52.9 | 40.1 | 33.0 | 36.5 | 93.5 | 1.03 | Lv | Lv | 0.52 | 0.99 |  |
| `wrench` | silhouette | 16.3 | 18.7 | 21.4 | 54.8 | 25.0 | 27.9 | 34.0 | 87.1 | 1.31 | Lv | Lv | 0.48 | 0.94 |  |
| `wrench-2` | box | 14.9 | 16.6 | 18.6 | 47.7 | 22.7 | 24.7 | 29.6 | 75.8 | 1.25 | Lv | Lv | 0.48 | 0.94 |  |
| `wrench-3` | silhouette | 16.5 | 18.9 | 21.6 | 55.2 | 24.9 | 27.9 | 34.1 | 87.3 | 1.31 | Lv | Lv | 0.49 | 0.94 |  |
| `x` | mark | 8.6 | 11.3 | 13.2 | 33.8 | 13.5 | 14.8 | 19.8 | 50.6 | 1.54 | L | L | 0.52 | 0.72 |  |
| `x-circle` | silhouette | 20.8 | 22.6 | 25.8 | 66.1 | 46.7 | 43.8 | 51.9 | 132.9 | 1.24 | F | D | 0.50 | 0.87 |  |
| `x-circle-small` | silhouette | 20.1 | 22.1 | 25.1 | 64.3 | 47.7 | 44.4 | 52.9 | 135.4 | 1.25 | F | D | 0.49 | 0.88 |  |
| `x-large` | mark | 10.8 | 13.9 | 16.0 | 41.0 | 17.2 | 18.3 | 24.2 | 62.0 | 1.49 | Lv | Lv | 0.52 | 0.72 |  |
| `x-small` | mark | 6.4 | 8.7 | 10.4 | 26.7 | 9.8 | 11.2 | 15.3 | 39.2 | 1.63 | L | L | 0.52 | 0.72 |  |


## Appendix B. The 97 concepts matched to Lucide

Line length ÷ canvas (1.0 = centreline as long as the canvas is wide), outline. Alias map hand-written; every pair is the same concept (`home` ↔ `house`, `gear` ↔ `cog`, `desktop` ↔ `monitor`, `alert-circle` ↔ `circle-alert`, `help` ↔ `circle-question-mark`, …). Sorted by ours ÷ Lucide at 24.

| our concept | Lucide file | our line ÷ canvas (24) | Lucide line ÷ canvas | ours ÷ Lucide | our line ÷ canvas (16) | ours(16) ÷ Lucide |
|---|---|---:|---:|---:|---:|---:|
| `volume` | volume-1 | 2.66 | 2.09 | 1.27 | 2.43 | 1.16 |
| `lightbulb` | lightbulb | 2.25 | 1.78 | 1.27 | 2.18 | 1.23 |
| `user` | user | 2.50 | 1.99 | 1.26 | 2.32 | 1.17 |
| `building` | building | 3.78 | 3.41 | 1.11 | 3.39 | 1.00 |
| `book` | book | 3.89 | 3.60 | 1.08 | 3.78 | 1.05 |
| `moon` | moon | 2.67 | 2.49 | 1.07 | 2.76 | 1.11 |
| `sun` | sun | 1.83 | 1.71 | 1.07 | 1.56 | 0.91 |
| `users` | users | 2.88 | 2.73 | 1.05 | 2.55 | 0.93 |
| `gauge` | gauge | 2.08 | 1.98 | 1.05 | 1.98 | 1.00 |
| `compass` | compass | 3.90 | 3.72 | 1.05 | 3.58 | 0.96 |
| `alert-triangle` | triangle-alert | 2.80 | 2.70 | 1.04 | 2.74 | 1.01 |
| `eye` | eye | 3.03 | 2.96 | 1.03 | 2.70 | 0.91 |
| `chevron-down` | chevron-down | 0.72 | 0.71 | 1.02 | 0.81 | 1.14 |
| `alert-circle` | circle-alert | 2.82 | 2.79 | 1.01 | 2.85 | 1.02 |
| `info` | info | 2.82 | 2.79 | 1.01 | 2.85 | 1.02 |
| `plug` | plug | 2.29 | 2.28 | 1.01 | 2.21 | 0.97 |
| `help` | circle-question-mark | 3.16 | 3.16 | 1.00 | 3.15 | 1.00 |
| `database` | database | 4.51 | 4.51 | 1.00 | 3.67 | 0.81 |
| `x-circle` | circle-x | 3.31 | 3.33 | 0.99 | 3.25 | 0.98 |
| `camera` | camera | 3.46 | 3.50 | 0.99 | 3.55 | 1.01 |
| `presentation` | presentation | 3.12 | 3.18 | 0.98 | 3.07 | 0.97 |
| `bug` | bug | 4.05 | 4.14 | 0.98 | 4.00 | 0.97 |
| `list-ordered` | list-ordered | 2.00 | 2.05 | 0.98 | 1.94 | 0.95 |
| `microphone` | mic | 2.50 | 2.58 | 0.97 | 2.26 | 0.88 |
| `sliders` | sliders-horizontal | 2.18 | 2.25 | 0.97 | 2.35 | 1.04 |
| `credit-card` | credit-card | 3.49 | 3.61 | 0.97 | 3.46 | 0.96 |
| `plus-circle` | circle-plus | 3.17 | 3.28 | 0.97 | 3.16 | 0.96 |
| `minus` | minus | 0.56 | 0.58 | 0.96 | 0.67 | 1.15 |
| `plus` | plus | 1.13 | 1.17 | 0.96 | 1.34 | 1.15 |
| `chart-pie` | chart-pie | 2.94 | 3.06 | 0.96 | 2.94 | 0.96 |
| `x` | x | 1.36 | 1.41 | 0.96 | 1.64 | 1.16 |
| `shield` | shield | 2.35 | 2.45 | 0.96 | 2.32 | 0.95 |
| `map-pin` | map-pin | 2.95 | 3.08 | 0.96 | 2.55 | 0.83 |
| `link` | link | 2.45 | 2.56 | 0.96 | 2.38 | 0.93 |
| `flag` | flag | 2.52 | 2.64 | 0.95 | 2.48 | 0.94 |
| `star` | star | 2.71 | 2.85 | 0.95 | 2.79 | 0.98 |
| `external-link` | external-link | 2.81 | 2.96 | 0.95 | 2.42 | 0.82 |
| `minus-circle` | circle-minus | 2.80 | 2.95 | 0.95 | 2.83 | 0.96 |
| `check-circle` | circle-check | 2.93 | 3.09 | 0.95 | 2.96 | 0.96 |
| `globe` | globe | 4.97 | 5.29 | 0.94 | 5.13 | 0.97 |
| `watch` | watch | 2.93 | 3.12 | 0.94 | 2.50 | 0.80 |
| `folder` | folder | 2.68 | 2.87 | 0.94 | 2.70 | 0.94 |
| `heart` | heart | 2.30 | 2.46 | 0.93 | 2.36 | 0.96 |
| `ban` | ban | 3.19 | 3.45 | 0.92 | 3.30 | 0.96 |
| `printer` | printer | 4.08 | 4.42 | 0.92 | 4.18 | 0.95 |
| `refresh` | refresh-cw | 2.67 | 2.90 | 0.92 | 2.52 | 0.87 |
| `clock` | clock | 2.81 | 3.05 | 0.92 | 2.86 | 0.94 |
| `wand` | wand-sparkles | 3.12 | 3.40 | 0.92 | 3.24 | 0.95 |
| `bell` | bell | 2.29 | 2.49 | 0.92 | 2.14 | 0.86 |
| `store` | store | 3.94 | 4.30 | 0.92 | 3.77 | 0.88 |
| `file-text` | file-text | 3.65 | 3.99 | 0.91 | 3.08 | 0.77 |
| `rotate-ccw` | rotate-ccw | 2.40 | 2.63 | 0.91 | 2.20 | 0.84 |
| `play` | play | 2.07 | 2.26 | 0.91 | 1.85 | 0.82 |
| `save` | save | 3.94 | 4.33 | 0.91 | 3.79 | 0.87 |
| `table` | table | 4.63 | 5.11 | 0.91 | 4.54 | 0.89 |
| `file` | file | 2.94 | 3.24 | 0.91 | 2.90 | 0.90 |
| `bold` | bold | 2.50 | 2.76 | 0.90 | 2.41 | 0.87 |
| `desktop` | monitor | 2.88 | 3.19 | 0.90 | 2.89 | 0.90 |
| `mail` | mail | 3.44 | 3.83 | 0.90 | 3.42 | 0.89 |
| `files` | files | 3.26 | 3.63 | 0.90 | 2.80 | 0.77 |
| `at-sign` | at-sign | 3.52 | 3.92 | 0.90 | 3.56 | 0.91 |
| `clipboard` | clipboard | 2.94 | 3.29 | 0.90 | 3.00 | 0.91 |
| `search` | search | 2.10 | 2.35 | 0.89 | 2.07 | 0.88 |
| `upload` | upload | 2.02 | 2.27 | 0.89 | 2.02 | 0.89 |
| `check` | check | 0.84 | 0.94 | 0.89 | 0.94 | 1.00 |
| `sparkle` | sparkle | 2.45 | 2.75 | 0.89 | 2.52 | 0.92 |
| `lock` | lock | 2.84 | 3.26 | 0.87 | 2.77 | 0.85 |
| `briefcase` | briefcase | 3.85 | 4.45 | 0.86 | 3.91 | 0.88 |
| `gear` | cog | 3.78 | 4.37 | 0.86 | 3.63 | 0.83 |
| `wrench` | wrench | 2.62 | 3.03 | 0.86 | 2.74 | 0.90 |
| `archive` | archive | 3.30 | 3.86 | 0.86 | 3.22 | 0.83 |
| `book-open` | book-open | 3.09 | 3.63 | 0.85 | 3.00 | 0.83 |
| `grid` | layout-grid | 3.71 | 4.38 | 0.85 | 3.18 | 0.73 |
| `calendar` | calendar | 3.26 | 3.86 | 0.84 | 3.20 | 0.83 |
| `menu` | menu | 1.69 | 2.00 | 0.84 | 2.02 | 1.01 |
| `thumbs-up` | thumbs-up | 2.91 | 3.45 | 0.84 | 2.83 | 0.82 |
| `image` | image | 3.55 | 4.23 | 0.84 | 3.46 | 0.82 |
| `target` | target | 3.93 | 4.71 | 0.83 | 3.98 | 0.84 |
| `italic` | italic | 1.21 | 1.46 | 0.83 | 1.19 | 0.82 |
| `phone` | phone | 2.39 | 2.90 | 0.82 | 2.30 | 0.79 |
| `keyboard` | keyboard | 2.70 | 3.28 | 0.82 | 2.89 | 0.88 |
| `pin` | pin | 2.25 | 2.74 | 0.82 | 2.19 | 0.80 |
| `package` | package | 3.45 | 4.22 | 0.82 | 3.34 | 0.79 |
| `pencil` | pencil | 2.18 | 2.68 | 0.81 | 2.14 | 0.80 |
| `arrow-up-right` | arrow-up-right | 1.15 | 1.42 | 0.81 | 1.33 | 0.94 |
| `home` | house | 2.90 | 3.59 | 0.81 | 2.86 | 0.80 |
| `trash` | trash | 2.97 | 3.69 | 0.80 | 2.79 | 0.76 |
| `hash` | hash | 2.25 | 2.84 | 0.79 | 2.69 | 0.95 |
| `copy` | copy | 2.69 | 3.42 | 0.79 | 2.14 | 0.63 |
| `more-horizontal` | ellipsis | 0.59 | 0.79 | 0.75 | 0.68 | 0.86 |
| `more-vertical` | ellipsis-vertical | 0.59 | 0.79 | 0.75 | 0.68 | 0.86 |
| `send` | send | 2.43 | 3.25 | 0.75 | 2.28 | 0.70 |
| `arrow-down` | arrow-down | 1.05 | 1.41 | 0.75 | 1.26 | 0.89 |
| `wallet` | wallet | 3.06 | 4.15 | 0.74 | 2.98 | 0.72 |
| `key` | key | 1.78 | 2.53 | 0.70 | 2.01 | 0.79 |
| `puzzle` | puzzle | 2.68 | 3.90 | 0.69 | 2.75 | 0.71 |
| `megaphone` | megaphone | 2.16 | 3.50 | 0.62 | 2.11 | 0.60 |


## Appendix C. Reproducing this

Every figure above came from these calls; the throwaway scripts lived in the session scratchpad and are not part of the repo.

- `readIcon(file)`, `regionOf(icon)`, `region.bbox`, `region.covered(x, y)`, `flatten(d)` from `tools/audit/raster.mjs`. **Ink** = the bypass below at `rate: 32` (rate 64 for the convergence check); it equals `mass.density(file, {rate: 32}).area` on every stroke-only file. Ink box = `region.bbox`. Line length = Σ chord lengths from `flatten(d)`. Stroke-only and area-only ink: the bypass on a region built from just those paths (`raster.region`).
- Squint peak: the bypass at `px: 16, rate: 32`, then a separable Gaussian blur (σ = 1.5, 11 taps, zero padding), maximum. Densest 3×3: the maximum over the 14 × 14 windows of the mean coverage.
- Kind: regex on the file for `<!-- keyline: mark -->`, `<!-- box:`, `<!-- anchor:`.
- Identical drawings: the concatenated `d` strings compared per master and style.
- Chromium cross-check: the SVG painted black on white into a 16 / 20 / 24 px canvas with `drawImage`, read back with `getImageData`; coverage = 1 − red/255. 122 drawings (every 24th file from offset 5), plus the 24 shape-filled files the bug changes most.
- Lucide: each `.svg` in `research/references/lucide`, shapes to `M L A Z`, rate 32, stroke 2; line length by the same `flatten`.
- Seed pairs: the bypass at 16 px, rate 32, blur σ 1.0, cosine of the 256-vectors, same-stem pairs and cosine ≥ 0.9999 removed, one row per distinct pair of stems (a stem drops `-<n>`, `-small`, `-large` and a trailing direction).
- **The bypass** (all areas, pixel coverages, squint peaks, 3×3 patches and seed pairs above). It never calls `region.classify`:

```js
export function bfRasterise(reg, { px, rate, canvas = reg.canvas }) {
  const unit = canvas / px, r = rate / unit;            // samples per canvas unit
  const cov = new Float64Array(px * px), { x0, y0, x1, y1 } = reg.bbox;
  for (let j = 0; j < px; j++) {
    const by0 = j * unit, by1 = (j + 1) * unit;
    if (by1 < y0 - 1e-9 || by0 > y1 + 1e-9) continue;   // pixel row outside the ink box
    const j0 = Math.ceil(by0 * r - 0.5), j1 = Math.ceil(by1 * r - 0.5);
    for (let i = 0; i < px; i++) {
      const bx0 = i * unit, bx1 = (i + 1) * unit;
      if (bx1 < x0 - 1e-9 || bx0 > x1 + 1e-9) continue;
      const i0 = Math.ceil(bx0 * r - 0.5), i1 = Math.ceil(bx1 * r - 0.5);
      let hit = 0, n = 0;
      for (let b = j0; b < j1; b++) for (let a = i0; a < i1; a++) { n++; if (reg.covered((a + 0.5) / r, (b + 0.5) / r)) hit++; }
      cov[j * px + i] = n ? hit / n : 0;
    }
  }
  return { cov, px, rate, canvas };
}
// ink area in units² = the sum of bfRasterise(reg, { px: canvas, rate }).cov
```

  `reg` comes from `regionOf(readIcon(file))`. It reproduces every closed form in §1.1 and, at rate 32, `inkArea` exactly on all 1,884 files that have no area path.
- `node --test tools/audit/*.test.mjs` still passes (115) — nothing in `tools/audit/` was edited.
