# The parameter map — cards 3.3 and 3.4

**Pinned to `5933041` (2026-10-04): 485 concepts · 2,910 drawings.** Lint at the pin: 2,910 · 2,848
clean · 62 warned · 0 failed. Every count below was measured this session by
`tools/audit/parameter-reach.mjs` on the pin, or carries a `path:line` into a document that
measured it. Nothing in the set, the rules or lint was changed.

## What you will see

Nine numbers run this library. Four of them you chose and could change tomorrow with a line in
`tools/masters.mjs`: the **stroke** per master, the **filled line weight**, the **gap floor** and the
**glyph gap**. Four more are chosen and typed there too — the margin, the keylines, the mark
ceiling, and the size step (12.5% of the canvas in words, a literal in the file). One, the
**container radius**, is written only in the docs and checked by nothing. Everything
else — the bend radius, the cap inset, the grid, the decimal ceiling, a filled corner's radius, a
dot's radius — is arithmetic on those, and recomputes the moment one of them moves.

What does not recompute is the drawings. Part 1 says, for each number, how many drawings would
have to be touched by hand (the reach), what the tools would redo on their own, and what only your
eye can settle. The one time this library actually changed a number — the 16 stroke, 1.5 → 1.25,
on 2026-09-20 — is told as the map in action: 114 outlines redrawn, 95 by script and 19 by hand, 6
filled twins re-cut, 219 of 228 ink boxes held exactly, five decisions by eye, one day. Part 2
prices the four changes you are most likely to ask about: the container radius, the stroke (a
hypothetical — it is settled), a 32 master, and the gap floor.

---

## Part 1 — the map

### 1.1 Every number, where it lives, what holds it

**Free** = chosen; nothing computes it. **Derived** = arithmetic on a free number, with the formula.
"Enforced" names the lint line that fires, or *nothing*. "Reach" is the count at the pin from
`parameter-reach.mjs` (section in brackets) unless another card is cited.

**A. The canvas and the masters**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach at the pin |
|---|---|---|---|---|---|---|
| A1 | Canvas | 24 · 20 · 16 | **free** (C6, 2026-09-16, 0 drawings — `rule-register.md:72`) | `masters.mjs:30-46` (as the keys), `docs/01:9-16`, `docs/07:46`, `CLAUDE.md` Settled | `viewBox` error, `lint.mjs:33, 269-270` | every file: 970 per master |
| A2 | Margin / drawing bound | 2 · 2 · 1 (`bound` 2..22 · 2..18 · 1..15) | **free** — calibrated against four sets' canvas-to-keyline ratios, not our drawings (`docs/01:56-61`) | `masters.mjs:32, 37, 42`, `docs/01:30-51, :98`, `CLAUDE.md` geometry block | margin crossing is an **error**, `lint.mjs:313-314` | ink touches the bound in **412 · 454 · 454** drawings (12 of them `-large` at 20 and 16, 0 at 24) [keyline] |
| A3 | Keylines | square 18 · 14 · 12; circle 20 · 16 · 14; portrait 16×20 · 12×16 · 10×14; landscape 20×16 · 16×12 · 14×10; diagonal = circle | **free** (0 drawings; the circle/square pre-correction is a classical argument, `rule-register.md:96`) | `masters.mjs:33, 38, 43`, `docs/01:78-98`, `CLAUDE.md` geometry block | warning only, ±0.5 on the 2 dp box, `lint.mjs:352, 359` | held to a keyline **574 · 576 · 576** files; of those on a keyline to 0.01: square 234 · 234 · 236, circle 142 · 146 · 146, portrait 112 · 110 · 110, landscape 60 · 60 · 60; 0 fail lint's ±0.5 at any master; `diagonal` is never the only match [keyline] |
| A4 | Mark ceiling | 18 · 14 · 12 | **free** (docs/01: "deliberately awkward", `docs/01:105-115`) | `masters.mjs:34, 39, 44` | warning, `lint.mjs:338` | 272 `keyline: mark` files per master; **64 · 82 · 154** of them sit exactly at the ceiling [keyline] |
| A5 | `markMax` for `-large` | the bound's width, 20 · 16 · 14 | **derived**: `bound[1] − bound[0]` (`masters.mjs:56-57`) | `masters.mjs:56-57`, `docs/07:48` (C8) | same line as A4 | the 12 `-large` files that reach the bound at 20 and 16 |

**B. The line**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| B1 | Outline stroke `STROKES` | 1.5 · 1.5 · **1.25** | **free** — the best-derived of the free numbers: a blind pick plus eight true redraws, 2026-09-20 (`rule-register.md:146`; the white-holds-1.5 ruling and the glyph gap are drawing-derived too, `:264-265`). **Settled; not under audit** (`plans/set-and-rules-audit.md:227-232`) | `masters.mjs:10`, `docs/01:207-224`, `docs/07:47` (C7), `CLAUDE.md` Settled + geometry, `SKILL.md` | root `stroke-width` **error**, `lint.mjs:211-212, 268-270` | **827 files per master** (485 outline + 342 shape-filled) carry it; what it drags with it: **2,340 · 2,318 · 2,270** open ends (cap insets), **96 · 72 · 74** solid dots, **359 · 411 · 370** fillets at the outline bend radius as `radii.mjs` reads a corner (an arc joining two straight legs on tangent) — **492 · 563 · 508** typed `A` radii at it as lint reads them (`lint.mjs:372-376`: every arc in a non-dot stroke path, legs or not; `gear`'s teeth, `star`'s points and the `paintbrush` ferrules are the difference) — and at 16 **14,810 eighth-only coordinates in 797 of 970 files** [stroke, bend] |
| B2 | Filled line weight `FILLED_WEIGHT` | 2.5 · 2 · 2 | **free** (locked 2026-09-17 at 93 concepts from a canvas-share argument, `rule-register.md:147`; 16 kept at 2 on 2026-09-20 — `masters.mjs:13-20`) | `masters.mjs:20`, `docs/01:220-233`, `docs/07:47, :57` (C7, C17), `CLAUDE.md` Settled | root `stroke-width` **error** on line-heavy filled files | **143 files per master / 143 concepts** are line-heavy; **73** stroked fillets per master sit at the filled bend radius; **18 `grows:` files per master** (54 in all) on 18 concepts declare the growth it causes (`findings-filled.md:49-73`) [filled, bend] |
| B3 | Cap inset | 0.75 · 0.75 · 0.625 | **derived**: weight / 2 (`docs/01:286-287`) | `docs/01:280-304`, `CLAUDE.md` "two rules that are easy to get wrong", `SKILL.md` | **nothing** checks it directly (`rule-register.md:149`) | every open end in the 827 outline-weight files: 2,340 · 2,318 · 2,270 in 551 · 551 · 549 files (the 143 line-heavy filled twins' ends are B7's) [stroke] |
| B4 | Keyline centreline radius | 9.25 · 7.25 · 6.375 (circle) | **derived**: keyline / 2 − stroke / 2 (`docs/01:142-147`) | `docs/01:142-147` | through A3's keyline match | every ring on the circle keyline: 142 · 146 · 146 exact [keyline] |
| B5 | Dot radius | (d − stroke) / 2, e.g. 0.75 · 0.6 · 0.575 for `more-horizontal` | **derived** from the stroke and a free per-icon diameter d (C17) | `docs/07:57` (C17) | `isDot` only exempts it from the bend check, `lint.mjs:372`; the formula is unchecked | **96 · 72 · 74** solid dots in 49 · 45 · 46 files [stroke] |
| B6 | Canvas share of the line | 6.3% · 7.5% · 7.8% (filled 10.4% · 10% · 12.5%) | **derived**: stroke / canvas | `docs/01:220-224`, `docs/07:47`, `CLAUDE.md` geometry | — | descriptive |
| B7 | Line-heavy filled ends | pull in by (FILLED − 1.5) / 2 at 24: 0.5 | **derived**: the filled box equals the outline's, so each end sits FILLED / 2 inside the shared ink edge (`docs/01:226-231`) | `docs/01:229-231`, `CLAUDE.md` Settled | the pair check, 0.01, `lint.mjs:159-173` (warning; **error** when a `grows:` note disagrees) | 143 pairs per master; 1,401 of 1,455 pairs equal within 0.0101 (`findings-metrics.md:615-616`), the other 54 declared (`rule-register.md:150`) |

**C. Corners**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| C1 | Mark-bend radius `bendMin` | outline 0.75 · 0.75 · 0.625; filled 1.25 · 1 · 1 | **derived**: weight / 2 (`masters.mjs:28`), the value picked from six candidates (C10) | `masters.mjs:24-28`, `docs/07:50` (C10), `CLAUDE.md` Settled | warning, lower bound only, on the **typed** `A` radius of stroke paths, `lint.mjs:372-377` | role-bend fillets **364 · 362 · 368**, 0 under the floor, **226 · 226 · 229 exactly on it** (card 1.2 reads 1,094 · 0 · 681 — `findings-corners.md:433-436` — reproduced); typed `A` radii at the floor in non-dot stroke paths, lint's own reading: **565 · 636 · 581** in 282 · 287 · 280 files, of which 492 · 563 · 508 in files at the outline weight [bend] |
| C2 | Filled chevron bend | grows to ≤ 2× `bendMin` so the leg angle holds (classic 1.97 · 1.35 · 1.35) | **derived** by construction from the box and the angle (C12) | `docs/07:52` (C12) | nothing | 199 of 362 filled bends sit exactly on the floor, 160 between it and 2×, 3 above (`findings-filled.md:185-188`) |
| C3 | **Container radius** | 2.5 at 24; **2 · 1.5** at 20 and 16 by practice, written nowhere as a rule | **free — and still "proposed"** (`docs/01:316`), listed **Open** at `docs/07:76` since 2026-09-16; 20 and 16 "recorded here once they settle" and never recorded (`docs/01:317-318`) | `docs/01:308-321`, `CLAUDE.md` geometry ("proposed"), `docs/07:63, :65, :66` (C23, C25, C26 state 2.5 · 2 · 1.5 for one icon each) | **nothing** (`enforcement-gap.md:262-263`) | outline container corners **617 · 581 · 563**, on the tier **381 · 357 · 330** (card 1.2's figures exactly, `findings-corners.md:47-51`); outline concepts with a rounded container corner **167 · 163 · 154**, every corner on the tier **89 · 86 · 74**, none on it **58 · 58 · 54** (`book` ×5, `building` ×4 …), mixed **20 · 19 · 26**; filled outer contours on tier + half stroke **281 · 259 · 237** corners [radius] |
| C4 | Detail / secondary radius | 1.5 at 24; 1.25 · 1 by practice | **free** (same "proposed" table) | `docs/01:313`, C22 (trash bottom 1.5 · 1.25 · 1), C23 (fold 1.5 · 1.25 · 1) | nothing | detail-role corners on it **268 · 258 · 256** of 1,344 · 1,332 · 1,410 [radius]. Card 1.2: this tier is exactly canvas-locked (6.25% at all three), the container tier is locked to neither canvas nor stroke, the bend tier to the stroke (`findings-corners.md:103-115`) |
| C5 | Filled corner radius | outline centreline + half the **outline** stroke: 3.25 · 2.75 · 2.125 | **derived** (C23's table; Central holds it 94.7%, `references-central.md:31-34`) | `docs/07:63` (C23 — whose table says **2.25** at 16, the 1.5-era value) | nothing; the pair check sees the box only | consistent to 0.02 in 986 / 964 / 910 of 1,001 / 976 / 961 matched corners; at 16 the misses are **13 concepts / 50 corners** at +0.125 (`references-central.md:186-195`) |

**D. Air**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| D1 | **Gap floor `MIN_GAP`** | **1.5 at every master, both styles** | **free, deliberately a literal** — "the floor is what survives a 16px render, not a fraction of the line" (`masters.mjs:59-64`). Derivation: a reasoned sentence, a scan of 92 icons, and a refuted raster test — `rule-register.md:294-324` | `masters.mjs:64`, `docs/01:325-347`, `CLAUDE.md` Settled + geometry + "two rules", `docs/07:62, :63, :64` dated notes, `SKILL.md`, `plans/facing-gap.md` | **warnings only**: §5 pairs `lint.mjs:393-405`, §5b own counter `:429-440`, §5c knockout `:459-467`, §5f facing air `:483-502`; a `gap:` note must be below it (**error**, `:235-238`) | drawn **at** the floor (within 0.01): **473 · 487 · 408 readings in 301 · 312 · 274 drawings / 195 · 197 · 195 concepts**; tightest reading at the floor in **289 · 298 · 255** drawings; tightest in [1.49, 1.75) in **357 · 397 · 369**; under it **15 · 27 · 30** drawings, of which 12 · 25 · 25 carry no note — lint's 62, with 12 · 31 · 31 = 74 readings, lint's 74 lines [gap] |
| D2 | Glyph gap `GLYPH_GAP` | 1 | **free** ("one pixel at every master's own size", `masters.mjs:86-90`; derived from a void ratio, a raster test and a 133-pair scan — `rule-register.md:265`) | `masters.mjs:106`, `docs/07:59` (C19), `docs/01:338-342`, `CLAUDE.md` Settled | warning, on declared `glyph:` files only, `lint.mjs:395-396, 434-439, 461-466` | **32 files per master / 16 concepts**; readings that need the carve-out (in [1, 1.49)): **13 · 13 · 18**; 0 under 1 [glyph] |
| D3 | Agreed per-file gap `gap: N` | 0.375 · 0.7 · 0.75 · 1 ×4 · 1.25 ×2 · 1.48 | **free per file**, may only lower D1 | `CLAUDE.md` conventions (stale: names one file), `docs/07:79`, `lint.mjs:94-111` | **error** if unreadable, ≥ 1.5, or no longer needed, `:232-238, 509-515`; **not** held to what the drawing measures (`enforcement-gap.md:345`) | **3 · 2 · 5 files** (10 in all) on 6 concepts (`findings-air.md:454`); they are the 3 · 2 · 5 declared under-floor drawings in D1 |
| D4 | Centreline distance lint needs | floor + stroke: 3 · 3 · 2.75 | **derived** (`lint.mjs:397`) | `lint.mjs:397`, `docs/07:62` (C22's handle: 3.0, now 2.75 at 16) | through D1 | every §5 pair reading: 696 · 745 · 810 under the 2.5 cap [gap] |
| D5 | "No more than 3 parallel strokes" · "no enclosed shape under 1.5" · "remove the detail" | 3 · 1.5 · — | corollaries of D1, 0 drawings | `docs/01:349-354` (":352 still says 2-unit") | the second partly (§5b, §5f); the first **never** — 43 concepts hold a stack of 4+ at 24 (`rule-register.md:268`) | see the register |

**E. Placement**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| E1 | Optical anchors (C14) | chevron down classic 0.5 · steep 0.61 · flat 0.55; up 0.5 · 0.65 · 0.4; left/right 0.5 · 0.65 · 0.55 | **free, by eye at 24**, from C15's measure (end-triangle offset × **K = 0.5**, itself free) | `docs/07:54-55`, `CLAUDE.md` Settled | the declared value moves lint's centring target, **unchecked** (`enforcement-gap.md:88-117`) | 45 concepts; **90 files per master** (270 in all), 94 distinct pairs |
| E2 | Shift at 20 and 16 | the 24 anchor × ink height ratio | **derived** (C14) — holds in 81 of 90 files within 0.05 (`rule-register.md:102`) | `docs/07:54` | nothing | the 90 outline files at 20 and 16 (45 + 45); the nine misses are `alert-triangle` ×4 at 20/16 and `info-2` at 16 |
| E3 | Centring tolerance | ±0.5 | **code only**; C10/C12 say 2 dp, no tolerance, for bent marks | `lint.mjs:361` | warning | 164 drawings over 0.01 off, 8 at exactly 0.50 (`enforcement-gap.md:105-109`) |
| E4 | `box:` agreed sizes | 57 distinct strings | **free per icon** (B5 in the register: one icon's mechanism, now 57) | `docs/01:117-130` | **error** to 0.01, `lint.mjs:349-350` | 114 · 112 · 112 files [keyline] |

**F. Sizes and families**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| F1 | Size step `SIZE_STEP` | 3 · 2.5 · 2 | **derived** in words (12.5% of the canvas, C8) but typed as a literal | `masters.mjs:52`, `docs/07:48`, `CLAUDE.md` Settled + geometry | warning, `lint.mjs:553-555` | **80 files per master** (50 small, 30 large) in **19 mark families**; **6 container families** step by their own clearance (C18) instead [size] |
| F2 | C18 container clearances | 2.5 · 2 · 1.75 default, 3.5 · 2.75 · 2.25 small | **free per family** | `docs/07:58` | "smaller / larger than the default", `lint.mjs:549-550` | the 6 container families |
| F3 | C17 repeated-element spacing | menu gap 3 · 3 · **3.25** (`-3` 4.75, `-4` 6.25 at 16); dots gap ≈ dot | **free**, then frozen at 16 by the 2026-09-20 "option B" (lines keep their 1.5-era centrelines) | `docs/07:57`, `CLAUDE.md` Settled | only the resulting `grows:` box difference | 18 concepts / 54 files |

**G. The grid**

| # | Number | Value | Free or derived | Stated at | Enforced | Reach |
|---|---|---|---|---|---|---|
| G1 | Grid step `gridOf` | 0.25 · 0.25 · **0.125** | **derived**: quarter when (stroke / 2) × 4 is whole, else eighth (`masters.mjs:66-84`) | `masters.mjs:79-84`, `docs/01:156-172`, `CLAUDE.md` geometry | off-grid is a warning that **any comment silences** — fires 0 times at the pin (`enforcement-gap.md:54-69`) | on grid **48,536 · 46,537 · 46,096** of 57,126 · 55,811 · 55,261 coordinates (85.0% · 83.4% · 83.4%); off **8,590 · 9,274 · 9,165** in 646 · 662 · 659 drawings, all printed "documented" [grid] |
| G2 | Decimal ceiling `decimalsOf` | 2 · 2 · **3** | **derived** from G1 | `masters.mjs:80`, `docs/01:187-189` | **error**, `lint.mjs:294` | 0 over the ceiling [grid] |
| G3 | 16 centrelines on x.375 / x.625 | — | **derived**: edge ∓ 0.625 | `docs/01:166-172`, `CLAUDE.md` Settled | through G1 | **14,810 coordinates on the eighth grid and not the quarter, in 797 of 970 files at 16** — the footprint of B1's 1.25 today [stroke, grid] |

**H. Numbers that live only in code or in a plan**

| # | Number | Value | Where | What depends on it |
|---|---|---|---|---|
| H1 | Keyline match tolerance | ±0.5 | `lint.mjs:352` | 574 · 576 · 576 files; inert today (0 misses) |
| H2 | Pair / box tolerance | 0.01 | `lint.mjs:169, 349` | 1,455 pairs; 338 box files |
| H3 | Touching, crossing | `min <= 0.1`; `crosses()` exempt | `lint.mjs:394, 401` | 1,544 pairs skipped as touching, 199 as crossing (`findings-air.md:337-338`) |
| H4 | `selfGap` turn gate · `facingGap` arrival window, bulge ceiling and cap · `materialGap` window · bend tolerance | 170° · `ARRIVE` 3°, `BULGE = FACING` 10° between two bulges, cap 1.75 · `FACING` 10° · 0.005 | `geometry.mjs:525-526, :534`; `:361, :399`; `lint.mjs:375` | every §5b / §5c / §5f reading; the cap is why no air census can reuse §5f unraised (`enforcement-gap.md:346`) — this card raises it to 2.5 |
| H5 | Optical `alpha` | 0.75 | `tools/optical.mjs:70`; `CLAUDE.md` open item 3 | every published optical bearing: 2,910 entries × 4 sides. "Never set against the eye in this project" (`findings-metrics.md:638-641`) |
| H6 | Build rounding | 2 dp, `x` and `w` separately | `build.mjs:10, 43` | 71 published entries differ from a correct rounding (`findings-metrics.md:505-517`) |
| H7 | Modifier geometry | anchor (16, 16), glyph 8, clear zone r6, clearance 1.5 | `docs/05:35-61` — "written for the old 2-unit stroke" (`docs/05:37`) | **0 drawings**; never exercised (`rule-register.md:380`) |

### 1.2 The dependency picture — change X, and then what

Read each line as: *this free number* → *what the tools redo on their own* → *what has to be redrawn
by hand (counted at the pin)* → *what only the eye can re-decide*.

```
STROKES[m]  (B1)
 ├─ recomputes: bendMin → lint §4b floor · gridOf / decimalsOf → lint §3 · lint's root check ·
 │              queue.mjs's writer · manifest.strokes · cap inset · keyline centreline radius ·
 │              dot radius · build's metrics, once the files have moved
 ├─ redrawn:    827 files at that master — every open end (2,340 · 2,318 · 2,270), every solid
 │              dot (96 · 72 · 74), every outline-weight bend (359 · 411 · 370 fillets; 492 · 563 ·
 │              508 typed radii, counting arcs with no straight legs), every container
 │              wall on a keyline (edge ∓ stroke/2); and the shape-filled twins whose cut-outs
 │              follow an interior line that moved. NOT the 143 line-heavy filled twins: their
 │              ends sit FILLED/2 inside an ink edge that does not move
 ├─ eye:        the weight itself · the filled contrast (B2) · repeated-element spacing (F3) ·
 │              which details survive (D5) · whether cut-outs follow (C5) · the FORK (below)
 └─ does NOT touch: MIN_GAP, GLYPH_GAP, FILLED_WEIGHT, keylines, margin, SIZE_STEP, the
                container radius — each is its own literal

FILLED_WEIGHT[m]  (B2)
 ├─ recomputes: lint's root check on 143 files · filled bendMin (73 corners per master)
 ├─ redrawn:    143 files per master — ends pull in by half the change; C17's 54 `grows:` files
 │              re-declare (growth = half the weight step, findings-filled.md:73)
 └─ eye:        contrast 1.67× · 1.33× · 1.6× (C7) · whether a thickened dot row still holds D1

MASTERS[m].bound / keylines / mark  (A2–A4)
 ├─ recomputes: the margin error · markMax · lint's keyline match · the ratio drift the build's
 │              `ratio` reports
 ├─ redrawn:    bound → 412 · 454 · 454 files touch it; keylines → 574 · 576 · 576 held files
 │              (548 · 550 · 552 of them on a keyline to 0.01); mark → 64 · 82 · 154 at the ceiling
 └─ eye:        one apparent size (F2 axis) · the 13% mark/container drift, re-measured as a
                mean of −4.7% over 121 containers, median −0.9% (findings-scaling.md:185-194)

SIZE_STEP[m]  (F1) → lint C8 → 80 files / 19 mark families per master → eye: whether -large
                still reads as the same mark

MIN_GAP  (D1)
 ├─ recomputes: the four floors (§5, §5b, §5c, §5f) · D4 · the validity of every `gap:` note
 ├─ redrawn:    RAISED to 1.75: every drawing whose tightest reading lies in [1.49, 1.75) —
 │              357 · 397 · 369 (599 · 683 · 650 readings warn, today 15 · 33 · 39);
 │              to 2: 387 · 468 · 494 drawings (698 · 834 · 920 readings).
 │              LOWERED to 1.25: 0 drawings; 8 · 33 · 34 readings still warn; the three `gap:`
 │              notes at 1.25 and 1.48 become errors ("not below MIN_GAP") and are deleted;
 │              to 1: 7 · 13 · 14 readings still warn (the sort overlaps and the 0.7 / 0.75 / 0.375)
 └─ eye:        whether 1.25 of air reads as air at 16 — card 1.7: at the floor a clear pixel
                row is delivered 41.5% of the time at 16 (findings-air.md:239-243) · whether
                white in a filled shape keeps 1.5 (Maruti, 2026-09-28) · the FORK (below)

GLYPH_GAP  (D2) → lint on 32 declared files per master → 13 · 13 · 18 readings depend on it

container radius  (C3)  — no code reads it
 ├─ recomputes: nothing. The filled outer contour follows by +half stroke only because the
 │              drawer re-cuts it (C5 is a rule, not a function)
 ├─ redrawn:    381 · 357 · 330 outline container corners on the tier (in 89 · 86 · 74 concepts
 │              entirely on it) + 281 · 259 · 237 filled contours; the 58 · 58 · 54 concepts
 │              already off the tier (`book`, `building` …) are a decision each
 └─ eye:        the radius itself (docs/09's pending ruling) · whether tier 2 follows · the FORK

alpha 0.75  (H5) → build → every optical bearing → eye: never judged
```

**The fork, named.** When a number changes, a bent or pointed shape cannot keep its box, its
angle and its bend at once. Two answers exist: **hold the angle and move the point** (Central,
61.2% of its moved slanted pieces keep the angle to 0.05°, `references-central.md:27-30`) or
**hold the box and let the angle give** (ours since 2026-09-20: the classic chevron 45° → 45.5°,
largest 1.87°, `plans/stroke-16.md:138-140`). Central shows no priority between the two
(`references-central.md:44-48`). Ours is a stated priority, chosen because the filled twin was not
being touched and C10/C12 hold filled box = outline box (`plans/stroke-16.md:97-102`). The plan
put it in one line: *it should be a decision, not an accident* (`plans/set-and-rules-audit.md:411-413`).
Part 2 names the fork for each change. **Each fork is Maruti's decision**: this card names it and
prices it, it does not take it.

---

## The worked example — the 16 stroke, 1.5 → 1.25 (2026-09-20)

The one parameter change this library has made, read as the map above. Record:
`plans/stroke-16.md`; snapshot `plans/stroke-16.inkbox.json` (228 ink boxes); the commit
`032b1c4` ("C7: the 16 master draws at stroke 1.25"), measured this session with
`git diff --name-only 032b1c4^ 032b1c4`.

| | What happened | Where it is written |
|---|---|---|
| **The change** | one literal: `STROKES[16]` 1.5 → 1.25. Decided by Maruti's blind pick on `lab/refs/stroke16.html`, confirmed on eight true redraws (`plus`, `chevron-down`, `check-circle`, `info`, `help`, `trash`, `file-text-2`, `search`) | `plans/stroke-16.md:19-22, :35-45, :175` |
| **Recomputed by the tools** | `bendMin(16)` 0.75 → 0.625 · `gridOf(16)` 0.25 → 0.125 · `decimalsOf(16)` 2 → 3 · lint's root check · `queue.mjs`'s writer · keyline centreline radius 6.25 → 6.375 · cap inset 0.75 → 0.625 · canvas share 9.4% → 7.8% · the metrics of 228 entries, re-read from the files. Tools changed: `masters.mjs`, `lint.mjs`, `queue.mjs`, `build.mjs`, `optical-sheet.mjs`, `geometry.test.mjs`; two written for it, `convert-16.mjs` and `inkbox-guard.mjs` | `plans/stroke-16.md:176, :212`; the commit's file list |
| **Redrawn** | **154 of the 228 files at 16; 0 at 24 or 20.** 114 outlines — **95 by script** in seven groups (straight marks 13, dot rows 2, single-bend marks 44, shaft + head 14, ring + marks 13, ring + check 6, ring + dot + stem 3) and **19 by hand** (`help` ×4, `info-2`, `info-3`, `alert-circle-2/-4`, `globe-2`, `search-3`, `arrow-*-4` ×4, `file`, `file-text`, `file-text-2`, `trash`, `trash-5`). 40 shape-filled files changed their root label; **6 bodies were re-cut** (`trash-filled`, `trash-5-filled`, the four `arrow-*-4-filled`), 34 changed nothing drawn. **0 of the 74 line-heavy filled files** (Q1: the filled weight stays 2) | `plans/stroke-16.md:86-95, :141-148, :206, :213`; file count and the six bodies measured from the commit this session |
| **What held** | the ink box of **219 of 228** drawings to 2 dp; **9** (`minus` ×3, the six menu stacks) 0.25 shorter because their ink ends are the sides of a line; every keyline, size step and optical shift unchanged | `plans/stroke-16.md:121-124`, `inkbox.json` |
| **What gave** | the leg angle: classic chevron 45° → 45.5°; `check-circle-small` 1.87°, `check-circle-4-small` 1.55°, `arrow-*-3` and `check-circle` 1.49°, `menu-arrow-*` 1.38°. Every gap gained 0.25 (`file-text-2`'s 1.25 → 1.625, its warning gone). Air inside the menu stacks 3 → 3.25 / 4.75 / 6.25 | `plans/stroke-16.md:138-140, :42, :151-154` |
| **What lint said** | 684 · 681 clean · 3 warned → one new warning (`help-4-filled`) was lint's own assumption, fixed the same day (`materialGap`: measure the filled drawing itself); then 682 · 2 warned (`trash` at 20 and 16) | `plans/stroke-16.md:125-134` |
| **The eye decided** (five) | the weight · the filled line weight stays 2 (contrast 1.33× → 1.6×) · menu lines stay on their centrelines and only get thinner (option B) · `trash` keeps one rib at 16 (two leave 1.41 to each wall) · the glyph cut-outs stay as approved, 1.75 beside a 1.25 line | `plans/stroke-16.md:205-208, :218` |
| **Accepted costs** | retina solid pixels `trash` 214 → 165, `chevron-down` 71 → 38; a centred line peaks at 62.5% per pixel instead of 75%; a third decimal at 16 | `plans/stroke-16.md:26-33, :44-45`; today: 20.2% of the straight-run length in 16 outlines has no fully inked pixel, against 15.6% at 24 — 189 of 363 drawings carry such a run at 16, 150 of 364 at 24 (`findings-grid.md:315-317`) |
| **Docs changed in the same commit** | `CLAUDE.md`, docs 01 · 07 · 08 · 09, the icon skill, the plan, the built `lab/manifest.json` — **17 non-icon files** beside the 154 drawings (171 in the commit) | the commit's file list; one false sentence survived (C7's Fluent citation, `rule-register.md:157-169`) |
| **Still on the books** | the shape-filled twins at 16 that kept 1.5-era radii: **13 concepts / 50 corners** at +0.125 (`references-central.md:192-195`) or **37 concepts / 97 corners** at the retired 0.75 offset (`findings-filled.md:230-237`) — two cards, two definitions, for wave 5; C23's table still says outer 2.25 at 16 where the derivation gives 2.125 (`references-central.md:296`); 157 concepts at 16 carry a segment off 0/45/90 against 121 at 24, the 38 extra being 45° legs 0.5–1.87° off (`rule-register.md:233-236`); and the conversion's footprint has grown with the set — **14,810 eighth-only coordinates in 797 of 970 files** at 16 today, against 114 converted files then [stroke] |
| **Duration** | written, proven, converted, reviewed and committed on one day | `plans/stroke-16.md:3` |

**What the example teaches the map.** (1) A free number's reach is *every file at that master
drawn at it* — 100% of the outlines, no exceptions, and the script covered 83% of them only
because the set was then 44% marks (`rule-register.md:49`); it is 28% marks now. (2) The
derived numbers really did recompute — nothing about bends, grids or decimals was re-decided.
(3) The literals really did hold — `MIN_GAP` stayed 1.5 and every gap simply gained 0.25, which is
what `masters.mjs:59-64` promised. (4) The fork had to be chosen twice: the proof held the angle,
the conversion reversed it. (5) The costs that outlived the day are the ones no rule derived: the
filled radii that were "deliberately left alone" and a table in C23 nobody recomputed.

---

## Part 2 — what a new set costs

Each change: the work in order · the drawings it touches, counted at the pin · what is mechanical,
what is redrawn, what the eye re-decides · what the stroke-16 record says about the cost · the
fork. None of these is proposed. (b) is a hypothetical by the plan's own instruction.

### (a) The container radius — 2.5 · 2 · 1.5 → something else

1. **Decide the three values**, and the law they follow. Card 1.2 measured that the container tier
   follows neither the canvas (it would be 2.083 at 20, 1.667 at 16) nor the stroke (2.5, 2.083);
   the detail tier is exactly canvas-locked and the bend tier exactly stroke-locked
   (`findings-corners.md:103-115`). Choosing a law first would make 20 and 16 derived instead of
   two more free choices.
2. **Write it where C3 says it is missing**: `docs/01:310-318` (fill the 20 and 16 columns), the
   `CLAUDE.md` geometry block ("proposed"), `docs/07:76` (close the Open item), and C23 · C25 ·
   C26, which state 2.5 · 2 · 1.5 for one icon each. Nothing in `masters.mjs` holds it today; the
   first line of code that reads it would be new.
3. **Mechanical** — the corners already on the tier: **381 · 357 · 330 outline container corners**
   in the **89 · 86 · 74 concepts whose every corner is on it**. On a rounded rectangle the ink box
   holds by construction (the tangent points slide along the edges), so this is a retype of the
   `A` radius and its two tangent points per corner. The filled outer contour follows at the new
   radius + half the outline stroke (C5): **281 · 259 · 237** contours. `convert-16.mjs`'s rule 3
   is the precedent for scripting it.
4. **Redrawn by hand** — the straight run that the corner eats: at 24 a 12-wide body with corners
   from 2.5 to 3 loses 1 of flat run. Where an interior detail stands on that run (file's fold,
   trash's rib, the `layout-*` band, `calendar`'s header) the detail's clearance moves with it;
   lint sees that only as a gap (D1). `[needs measuring]` how many of the 89 · 86 · 74 carry an
   interior detail within 1.5 of a corner.
5. **The eye decides** — (i) the **58 · 58 · 54 concepts already off the tier** (`book` ×5,
   `building` ×4, `trash` at 1.5 · 1.25 · 1 …): each left the tier for a reason recorded in its row
   or its file, and each is a ruling whether it follows; (ii) the **20 · 19 · 26 mixed** drawings
   (`camera`, `compose` ×4, `book` ×3 …) that carry two radii in one container; (iii) whether the
   detail tier (C4) follows — card 1.2: "2 and 1.5 do not follow it by any stated arithmetic"
   (`findings-corners.md:770-780`); (iv) the two soft members `message-6` / `message-7` (C26).
6. **What the record says it costs.** No container radius has ever been changed set-wide here
   (the mark-bend radius did move, 0.75 → 0.625 at 16, with the stroke — C10). Central's
   radius axis is the nearest record: moving radius 0 → 3 leaves **32.8%** of its icons unchanged
   and redraws **53.9%** (`references-central.md:39-42`) — but Central's axis spans 0 to 1.5
   strokes, where ours would move a quarter or half a unit. The 2026-09-20 conversion is the
   better analogue for the mechanical part: 95 of 114 files by a four-rule script.
7. **The fork.** On a rounded rectangle there is none: the box holds. At a **sharp apex** — the
   `alert-triangle` family (its apex is already 2 at 16, `findings-corners.md:231`), `map-pin`,
   the `message` tails — a larger corner retreats the tip by r(√2 − 1) per unit for a 90° V
   (`references-central.md:221-225`; Central's apex-held sides keep the box only 27.5% of the
   time). Decide before drawing: hold the box and move the vertex out, or let the tip retreat and
   re-centre. Our C10 precedent holds the box.

### (b) The stroke weight — hypothetical; the spec is fixed

Costed only because it is the one change with a measured record. Nothing here reopens C7.

1. **Pick the weight by eye** on real pixels beside text — the 2026-09-20 method: a blind pick,
   then eight true redraws on the eighth grid, not a scaled preview (`plans/stroke-16.md:175`).
2. **Change one line** (`masters.mjs:10`). The tools recompute `bendMin`, the grid, the decimal
   ceiling, the root check, the writer and the cap inset on their own.
3. **Snapshot the ink boxes** first (`inkbox-guard.mjs snapshot`), because the proof of the
   change is that nothing moves.
4. **Mechanical — the scripted batch.** The four construction rules (outer edge keeps its pixel ·
   open stroke keeps its ink end · radii keep their centreline value, mark bends take weight / 2 ·
   interior centrelines stay put; `plans/stroke-16.md:80-84`) converted **95 of 114** outlines in
   2026-09-20's set. Today's reach at a master: **827 files** at the outline weight — **485
   outlines and 342 shape-filled twins**, 138 of which carry strokes; **2,340 · 2,318 · 2,270 open
   ends** move by half the change on each axis they run along; **96 · 72 · 74 dots** take a new
   radius; **359 · 411 · 370 outline-weight fillets — 492 · 563 · 508 typed radii once the arcs with no
   straight legs are counted** — are re-cut at the new weight / 2; and at 16
   **14,810 eighth-only coordinates** would re-grid if the stroke went back to a whole-quarter
   half.
5. **Redrawn by hand** — what the script refused: glyphs, globes, grips, files, cans — 19 of 114
   (17%) when the set was 44% marks. The set is 28% marks now and 292 concepts are object
   silhouettes held to a keyline (`rule-register.md:50`); the hand share at today's composition is
   `[needs measuring]` — a dry run of `convert-16.mjs --out` on the pin would give it. **0 of the
   143 line-heavy filled twins** move (their ends sit FILLED / 2 inside a fixed ink edge) unless
   B2 moves with B1.
6. **The shape-filled twins** — only those whose cut-out follows an interior line that moved: 6 of
   40 on the day (15%), 34 relabelled only. The cost that was *not* paid then is the cost still
   on the books: 13 concepts / 50 corners (card 2.5) or 37 / 97 (card 1.8).
7. **The eye decides** — five rulings on the day (the weight · the filled weight · repeated
   elements · which details survive · whether cut-outs follow), one review sheet, not 114 boards
   (`plans/stroke-16.md:109-111`).
8. **What it cost**: one day; 154 files at one master; 17 non-icon files; two new tools; one
   lint fix forced by the change (`materialGap`); a decision reversed between proof and
   conversion; and a false sentence left in a rule row.
9. **The fork** — *this is the change the fork was named for.* Hold the box and let the angle give
   (chosen; chevrons 45° → 45.5°, up to 1.87°), or hold the angle and move the point (Central,
   61.2%). Central's 90th percentile angle change is 3.18°, ours 2.81° at the worst chevron pair
   (`references-central.md:46-48`); only a pair of chevrons at real size settles how much reads as
   a different mark (`references-central.md:302-303`).

### (c) Adding a 32 master

Not a conversion: **970 new drawings**, none existing redrawn, plus every place that enumerates
the masters. In order:

1. **Decide the free numbers at 32** — each is a choice, none is derived from 24:
   the stroke (Fluent draws **2 at 32**, 6.25% of its canvas, the same share as our 24 at 1.5 —
   `references-fluent.md:92-95`; a weight with a whole half keeps the quarter grid, `masters.mjs:79`);
   the filled weight (Fluent: +0.5 at every size, `:96`; ours steps 2.5 · 2 · 2); the margin and
   keylines (ours are absolute 2 · 2 · 1, so the keyline share floats 83.3 · 80.0 · 87.5%,
   `findings-scaling.md:62`; Fluent's circle is 28 at 32 and its median min-margin 2,
   `references-fluent.md:121, :124`); the mark ceiling; `SIZE_STEP` (12.5% → 4); the container
   radius at 32 (C3 — undecided at the three we have); which text size it sits beside (FD-6:
   not stated for 24 or 20 either, `references-field.md:493-512`). Card 1.2's first
   recommendation — write the tiers per master and say what each is for
   (`findings-corners.md:762-768`) — read upward: a law per number (canvas-locked, stroke-locked,
   absolute) would make most of these derived. Which law, if any, is Maruti's call.
2. **Add the entry** to `masters.mjs`: `STROKES[32]`, `FILLED_WEIGHT[32]`, `MASTERS[32]` (bound,
   five keylines, mark), `SIZE_STEP[32]`. Build, lint, queue and draft-svg iterate `MASTERS`
   (`build.mjs:61`, `lint.mjs:623`, `queue.mjs:55`, `draft-svg.mjs:35`), so they pick it up. **Lint
   reports a master with no folder as 0 jobs, silently, and ignores a folder not in `MASTERS`**
   (`enforcement-gap.md:119-135`) — so the folder and the entry must land together, and nothing
   will say if one is missing.
3. **Fix the places that spell the masters out** — grep this session for `[24, 20, 16]` /
   `24 · 20 · 16` / `24/20/16`: **19 occurrences in 10 files** outside `masters.mjs` at the pin —
   the icon skill, seven lab pages (`icon`, `library`, `figures`, `family-sheet`, `glyph-sheet`,
   `optical-shift`, `slot-test`), `draft-check.mjs`, `optical-sheet.mjs`. **A floor, not a total:**
   the pattern misses lists spelled another way, such as `lab/icon.html:897`
   (`CONTEXT = { 24: …, 20: …, 16: … }`) and `:918` (`SIZES = [96, 48, 24, 20, 16]`). Reprint:
   `grep -rn -E '\[ *24 *, *20 *, *16 *\]|24 ?· ?20 ?· ?16|24/20/16' tools/*.mjs lab/*.html .claude/skills/icon/SKILL.md | grep -v tools/audit`.
   Plus the docs: `docs/01` §1, §2 (the keyline table has three columns), §4 (the stroke table),
   the `CLAUDE.md` geometry block and Settled rows, and every C-row that states a per-master
   triple (C6 · C7 · C8 · C10 · C12 · C16 · C17 · C18 · C22 · C23 · C25 · C26 at least).
4. **The loop changes.** `queue.mjs approve` writes all masters of a candidate at once
   (`queue.mjs:257-267`); the sheet has one status per icon, not per master. A fourth master
   either joins every future approval (each board carries a 32 candidate) or the sheet grows a
   per-master column — a decision about the loop before the first drawing.
5. **Draw 970 files**: 485 outlines + 485 filled; of these **80** are C8 size families (the step at
   32), **90** carry an optical shift (derived from the 24 anchor by ink height — then the eye),
   **114** a `box:` (57 concepts need a 32 value each), **18** `grows:`, **10** anchored, **32**
   glyph. Detail goes the other way from 24 → 16: Fluent loses 1.3–2.3% of parts per step going
   down between 32 and 24 (`references-fluent.md:123`), so going up adds about that; Nucleo redraws
   42.5% of concepts between its Core 24 and 32 (`references-nucleo.md:335-337`).
6. **Mechanical**: the lint and build plumbing, the derived numbers, the shift scaling, the
   filled twins of line-heavy marks (ends by arithmetic). **Redrawn**: everything else — 970 files.
   **The eye**: every number in step 1, and then every drawing, in a grid at 32 beside the 24.
7. **What the record says it costs.** The 16 master's *conversion* took a day for 114 outlines
   with 83% scripted. A new master is not a conversion; it is the queue again at one size — the
   485 concepts took 2026-09-17 to 2026-10-04 at three masters per approval. Atlassian trialled a
   hand-drawn second size and dropped it as "too restrictive" (`references-field.md:171-175`); its
   conclusion is refused (their renderer, their one master); its test — the drawn size beside the
   scaled one, beside text — is card 2.6's FD-5 (`references-field.md:493-500`). Whether to run it
   on a 32 before drawing 970 files is Maruti's call.
8. **The fork** is not about angles here: it is which **law** each number follows up the ladder.
   Our record going down is mixed — margin absolute, detail radius canvas-locked, bend radius
   stroke-locked, container radius neither, size step canvas-locked (card 1.2, card 1.4). Picking
   one law per number at 32 is the decision; drawing first and reading the law off the drawings
   afterwards is how the three we have ended up with three laws.

### (d) The gap floor `MIN_GAP` — the question Maruti is most suspicious of

Measured by this card's tool, mirroring lint's four measures reading by reading (so the counts are
lint's counts, not a different census — card 1.7's span census is the other definition; both are
listed for wave 5 below).

1. **Decide what the floor is for.** Card 1.7 re-derived it: the unit is one device pixel at the
   master's own size, so 1.5 is "the right single constant" as the tightest grid-legal value that
   clears a 45° channel (1.414) — and the reasoning in `masters.mjs:59-64` is wrong, the rule is
   "missing its alignment clause", and at 16 the floor delivers a clear pixel row only 41.5% of the
   time (`findings-air.md:142-145, :239-243, :424-430`). Any change starts from that card.
2. **Raise it** (to 1.75 or 2) — nothing recomputes but the four floors and the validity of the
   `gap:` notes. The redraw is every drawing whose tightest reading now sits between the old
   floor and the new one: **357 · 397 · 369 drawings** at 1.75 (**599 · 683 · 650** readings would
   warn where 15 · 33 · 39 do today); **387 · 468 · 494** at 2. By kind at 24 the binding readings
   are pairs 358, filled separations 109, cut-outs 52, shape-to-line 38, counters 14, self-facing
   17, notches 10 — the repeated elements and the knockouts first. Each is C22's rule in action:
   the element moves, or the element goes.
3. **Lower it** (to 1.25 or 1) — **0 drawings must change.** Lint's warnings fall from 15 · 33 · 39
   readings to 8 · 33 · 34 at 1.25 and 7 · 13 · 14 at 1 (the `sort-alpha` overlaps at −1.04 / −0.96
   / −0.93 and the declared 0.375 · 0.7 · 0.75 remain under any floor). Three `gap:` notes
   (1.25 ×2, 1.48) become lint **errors** at 1.25 ("not below MIN_GAP") and are deleted; at 1 so
   do the four at 1. The about 61 icons that already cut their filled white at 1.5 at 16, and the
   eight that were widened to it on 2026-09-28 (`plans/facing-gap.md:86-87, :16-19`), stay as
   drawn — lowering a floor redraws nothing.
4. **Mechanical**: the number, the note validity, the `need` distance. **Redrawn**: on a raise,
   the counts above; on a lowering, none. **The eye**: whether 1.25 of air reads as air at real
   16 px (card 1.7's ladder: 1.0 → 0.5 grey, 1.25 → 0.375, 1.5 → 0.25, `findings-air.md:824-835`);
   whether white inside a filled shape keeps 1.5 regardless (Maruti's 2026-09-28 ruling, C22);
   whether the floor should differ by kind — card 1.7's verdict: one constant is right by master
   and by situation, wrong by channel angle and phase (`findings-air.md:424-430`).
5. **What the record says.** The 2026-09-20 conversion is the one time the floor's *neighbours*
   moved: the stroke thinned and every gap gained 0.25 for free, `file-text-2`'s warning went,
   and `MIN_GAP` was not touched. That is the literal doing what `masters.mjs` says it is for. The
   other record is the 2026-09-28 ruling that white holds 1.5 at 16: 23 warnings on 21 drawings
   from the first `facingGap` run, 3 redrawn the same day, 8 filled-16 cuts widened later
   (`plans/facing-gap.md`; `rule-register.md:264`).
6. **The fork** — a raise forces it on every binding drawing: **hold the ink box and let the detail
   go** (C22's rib, C24's second line: the set's precedent) or **hold the detail and let the box
   grow** (forbidden by the keyline — the box is the slot). Card 1.7 found a third answer that no
   rule names: hold both and **align the gap to the pixel grid**, which returns half a unit
   (`findings-air.md:164-173`). Whether it becomes a rule is Maruti's.

---

## For wave 5 to reconcile — never pick

| Quantity | This card | Another card |
|---|---|---|
| Drawings drawn at the floor | 301 · 312 · 274 drawings carry a reading within 0.01 of 1.5 (887); tightest at the floor 289 · 298 · 255 (842) — lint's reading set, cap 2.5 | `findings-air.md:370-382`: 941 drawings carry such a reading; 889 have their tightest at 1.5; 1,485 of 7,333 readings — every air span, uncapped |
| What a floor of 1.25 would warn on | 8 · 33 · 34 readings below 1.24 (lint's −0.01 line) | `findings-air.md:349-355`: < 1.25 → 124 readings / 103 drawings / 28 concepts (all spans) |
| The 16 filled-corner offset | — | 13 concepts / 50 corners (`references-central.md:192-195`) · 37 concepts / 97 corners (`findings-filled.md:230-237`) · 12 files / 12 concepts at 2.25 (`findings-corners.md:361`) |
| Container-radius share | 381 of 617 · 357 of 581 · 330 of 563 outline corners (61.8 · 61.4 · 58.6%), reproducing card 1.2 | card 2.3: 61.1 · 61.1 · 58.3% (`plans/set-and-rules-audit.md:98`) |
| Concepts held to a silhouette keyline | 574 · 576 · 576 files = 287 · 288 · 288 concepts | `rule-register.md:50`: 292 at the pin; `findings-scaling.md:111-114`: 287 |
| Dots | 96 · 72 · 74 solid dots (two-arc circle with r ≤ stroke / 2) | `isDot` alone (`geometry.mjs:151`) also matches every two-arc ring: 216 · 191 · 190 paths |
| Places that enumerate the masters | 19 occurrences in 10 files by one grep at the pin — a floor (step c.3) | no document holds it |

---

## Handover

- **Reading the map.** A number with *nothing* in the Enforced column is held by the drawer's
  hand and the audit's instruments only. Three carry this much of the set: the container radius
  (C3), the cap inset (B3), the bend check on area paths (C1 — 1,026 shape-filled drawings
  unseen, `enforcement-gap.md:340`).
- **Nothing here is a proposal.** The rulings the map waits on are already on the agenda: the
  container radius (docs/09 and card 1.2), the gap floor (card 1.7), the filled cut weights
  (card 1.8), `alpha` (card 1.12). Part 2 prices them; card 5.2 orders them.
- **What this card found that no card held**: the per-master counts of what a stroke drags with
  it (open ends, dots, bends, the eighth-grid footprint); that lint's 62 warned drawings and 74
  lines reproduce from a census that mirrors its four measures; the what-if counts for the floor;
  the 19 hard-coded master lists.
- **Instrument notes.** `facingGap` was run with `cap` 2.5 (lint uses 1.75), so "clear" above
  means "under 2.5 and over 2.0"; readings over 2.5 are not looked for. Keyline and bound matches
  use 0.01 because `bbox` can sit 0.0056 inside a true arc edge. Filled container corners are
  converted to the centreline only for outer contours; a punched inner contour's corner is counted
  but not placed on a tier (the `radius` print says so). `radii.mjs`'s `ambiguous` role is
  reported, never folded in: 171 · 215 · 190 corners.

## How to reprint

Build the pin: `P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)`.
Then, from the repo:

| Section of this document | Command |
|---|---|
| the whole map (every count tagged [section]) | `node tools/audit/parameter-reach.mjs $P` · `--json` for the record |
| B1, B3, B5, G3 — files at the stroke, open ends, dots, eighth-only | `node tools/audit/parameter-reach.mjs $P stroke` |
| B2 — line-heavy / shape-filled | `… filled` |
| C1 — corners at `bendMin` | `… bend` |
| C3, C4 — container and detail corners, tiers, concepts | `… radius` |
| D1, D4 and Part 2 (d) — readings, at-floor, bands, what-if | `… gap` (`--cap`, `--band` to widen) |
| D2 — glyph files and readings | `… glyph` |
| A2–A4, E4 — bound, keylines, mark ceiling, opt-outs | `… keyline` |
| F1 — size families | `… size` |
| G1, G2 — grid | `… grid` |
| the stroke-16 file counts | `git diff --name-only 032b1c4^ 032b1c4 -- src/icons/16 \| wc -l` (154); `\| grep -c -- -filled.svg` (40); `git diff --name-only 032b1c4^ 032b1c4 -- src/icons/24 src/icons/20 \| wc -l` (0) |
| the hard-coded master lists | the grep in Part 2 (c) step 3 |
| the tests | `node --test tools/audit/parameter-reach.test.mjs` (16, on a synthetic pin in a temp dir plus three identities on the shipped set) |

## Gate

`node tools/lint.mjs` at the end of this card: byte-identical to the capture at its start — 2,910
drawings · 2,848 clean · 62 warned · 0 failed. `shasum lab/manifest.json` still `161c9314cdf8…`.
`node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` at the last run of this card (after
the fresh review): 560 tests · 559 pass · 0 fail · 1 skipped by another author's guard (308 at the
start of waves 3–4; other authors' tests land beside these 16 in parallel, so the total moves). The
16 here were checked by mutation: six single-line relaxations of the tool (radius snap 0.025 → 0.3,
bend tolerance 0.005 → 0.5, keyline tolerance 0.01 → 0.5, a dot's threshold stroke / 2 → stroke,
the 1.25 what-if without lint's −0.01, `facingGap` at lint's own cap) each fail exactly one test on
the synthetic pin. `src/icons` untouched.

---

*Written for cards 3.3 and 3.4 of `plans/set-and-rules-audit.md`. Companions:
`docs/audit/rule-register.md` (every rule, where stated, derived from what),
`docs/audit/enforcement-gap.md` (what is checked), `docs/audit/findings-corners.md`,
`findings-air.md`, `findings-filled.md`, `findings-scaling.md`, `findings-grid.md` (the censuses),
`references-central.md` (the cost curve), `references-field.md` (FD-5), `plans/stroke-16.md` (the record).*
