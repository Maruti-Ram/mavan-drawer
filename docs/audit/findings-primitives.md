# Findings — shared primitives

Audit card **1.1** (`plans/set-and-rules-audit.md:316`). Axes **F4** (a closed vocabulary) and
**F3** (the armature). **This card closes `CLAUDE.md` open item 5** — the primitive-drift question
now has an instrument and a measurement.

**Pinned tree: `5933041`.** 485 concepts × 3 masters × 2 styles = 2,910 files, 7,500 `<path>`
elements, **8,305 subpaths**. `node tools/lint.mjs` at the end of this work: **2,910 drawings ·
2,848 clean · 62 warned · 0 failed** — identical to the baseline. Nothing in `src/icons/`,
`tools/`, `lab/`, `research/` or the other docs was touched.

**The question this card answers:** *is every shared shape in this set actually one drawing?*

---

## 0. Method, and how to read a number

**The unit is the subpath**, not the file and not the `<path>` element. A `<path>` may hold several
closed shapes (a filled evenodd cut-out carries its holes in one `d`), and the shared part is the
subpath. `congruence.mjs`'s `subpathsOfPath` resolves relative commands that carry over from the
previous subpath, so this is not a string split on `M`.

**Same shape** means: the two centrelines are the same curve, blind to notation, start vertex,
traversal direction, subpath order and numeric noise below 3 dp; sensitive to position, size,
mirroring and rotation. Mirroring deliberately counts as different — `chevron-left` is
`chevron-right` flipped and they are separate drawings with their own C14 shifts.

**What a deviation is worth in pixels.** Every residual below is also given in **px@16**: what the
distance becomes when the drawing is rendered 16 px wide.

| master | 1 unit at a 16 px render |
|---|---|
| 24 | 0.667 px |
| 20 | 0.800 px |
| 16 | 1.000 px |

A 0.25-unit error at 24 is 0.17 px and invisible; the same 0.25 at 16 is a quarter of a pixel, and
that is the difference between a crisp edge and a grey one.

**Read a residual as a residual, not a difference.** `congruentUpToTranslation` fits the best offset
first, so a 20.25-long line against a 20.27-long one reports 0.01, not 0.02 — the fit splits the
error between the two ends.

**Outer ink edge, not centreline.** Comparing an outline drawing with its filled twin on centrelines
is meaningless, because the weight differs. Every size below is the **outer ink edge** — centreline
± half that file's own stroke, and the shape edge itself for a shape-filled path. It is the only
measure under which the two styles are comparable, and it is the measure C12 ("filled ink box ==
outline's") is written in.

**Instruments used, all from `tools/audit/` (wave 0), none modified:** `congruence.mjs`
(`canonical`, `congruentUpToTranslation`, `congruentUpToScale`, `classify`, `prepare`,
`scaleTrivial`, `subpathsOfPath`). Throwaway loaders and census scripts were written in the session
scratchpad and are not part of the repo.

**One measuring correction made in this card.** `congruence.mjs`'s `ring` flag calls any closed run
of equal-radius arcs a ring. Two same-radius arcs traversed out and back form a **lens**, not a
circle: `paintbrush-5`'s spindle handle is two r 40.75 / 23 / 22.25 arcs on a 12.73 chord. The
census below additionally requires a circle's bbox to equal 2r, which puts those 6 subpaths in
their own class. `congruence.mjs` is unchanged and was not wrong — `ring` means "closed and all on
one circle", which the lens is; the misuse was mine. Wave 0's circle-radius counts (37 / 28 / 41)
include the lens at 24; corrected they are **36 / 28 / 42**.

---

## 1. The vocabulary, counted

### 1.1 Distinct parts, per master and style

`classify(mode: 'translation', tol 0.01)` over every subpath. "Distinct parts" = congruence classes;
"used once" = classes with a single member; "reuse" = 1 − classes/subpaths.

| master | style | subpaths | distinct parts | used once | reuse |
|---|---|---|---|---|---|
| 24 | outline | 1,409 | **650** | 464 | 53.9% |
| 24 | filled | 1,419 | **765** | 572 | 46.1% |
| 20 | outline | 1,375 | **627** | 439 | 54.4% |
| 20 | filled | 1,387 | **748** | 550 | 46.1% |
| 16 | outline | 1,352 | **624** | 444 | 53.8% |
| 16 | filled | 1,363 | **747** | 547 | 45.2% |

Pooled across both styles:

| master | subpaths | distinct parts | used once | reuse |
|---|---|---|---|---|
| 24 | 2,828 | **1,254** | 877 | 55.7% |
| 20 | 2,762 | **1,226** | 857 | 55.6% |
| 16 | 2,715 | **1,234** | 857 | 54.5% |

Whole set, all masters and styles pooled: 8,305 subpaths → **3,472 classes**, 2,496 used once.

At the `<path>` level, 7,500 paths carry **3,595** distinct (shape, master) pairs — so **3,905
paths, 52%, redraw something the set already contains**. Reproduces wave 0 exactly. Pooling masters
as well gives **3,400** distinct shapes, so 195 (shape, master) pairs collapse: see §1.3.

### 1.2 The reuse is real, and it is concentrated

The sixteen largest classes in the whole-set pool account for **900 of 8,305 subpaths (10.8%)**,
sized 92 · 90 · 75 · 61 · 55 · 54 · 52 · 52 · 49 · 48 · 47 · 47 · 46 · 45 · 44 · 43 members, each
drawn by 13–42 different concepts. The two largest identifiable ones are the container ring (90
members, 40 concepts, 24 filled) and the arrowhead (45 members, 34 concepts, 16 outline).

### 1.3 162 shapes are drawn at identical **absolute** size at more than one master

A shape that is literally the same size at 24 and at 20 has not been scaled for its master.

| masters | shapes |
|---|---|
| 24 + 20 | 62 |
| 20 + 16 | 18 |
| 24 + 16 | 16 |
| 24 + 20 + 16 | 66 |

By kind: 99 straight lines · 27 circles · 14 rounded-rect-ish · 11 other · 8 bends · 2 arcs · 1
polyline. The lines and tiny circles are mostly legitimate — a 1.5-long tick or a ⌀2 dot can
reasonably hold its absolute size at three masters, and §2.3 shows that it often does.

The 36 non-line, non-circle cases split into two kinds, and **neither is drift**:

- **Floor-bound shapes.** A rounded bar whose short side is the 1.5 gap/ink floor cannot shrink, so
  it holds its absolute size at every master. 6 × 1.5 appears in `archive`, `home-3`, `book-3`,
  `file-text`, `file-text-2`, `keyboard-2` and two more at **all three** masters; 4 × 1.5 in seven
  concepts; 3 × 1.5 in `building-2`, `book-4`, `files-5`, `target-2`. `grid-4`'s nine 1.5 × 1.5
  cells are identical at 24 and 20 (36 subpaths across the four files). The floor is quietly
  creating a shared vocabulary — a good thing, and nothing says so.
- **Coincidences of two separate decisions.** A `bend` of 14.5 × 4.846 is both `chevron-*-2` at 24
  **and** `chevron-*-2-large` at 20, because C8's step (3 at 24, 2.5 at 20) lands them on one
  number. `code`'s chevron at 24 (leg 4.554) is the main arrowhead's size at 20 (leg 4.554).
  `rotate-ccw-6`'s head at 24 (leg 3.507) is the other `rotate-ccw`s' head at 20 (leg 3.507).

### 1.4 Is 20 a master or a resize? — **a master.** And so is 16

The plan asks this directly (`plans/set-and-rules-audit.md:270-272`): *"if the 20 drawings are
mechanically 24 × 0.833 we have two masters and a resize."* Measured, part by part.

For every concept and style, each subpath was paired with the subpath at the same path index at the
other master and tested with `congruentUpToScale`. Classes `scaleTrivial` flags — straight runs and
bare circles, where "is it a scaled copy" is vacuous because every circle is a scaled circle — are
stripped, as `congruence.mjs`'s header insists.

| comparison | pairs | scale-trivial (stripped) | non-trivial | the smaller part IS the larger resized | a different drawing | distinct scale factors |
|---|---|---|---|---|---|---|
| 24 → 20 | 2,762 | 1,252 | **1,510** | **57 (3.8%)** | **1,453 (96.2%)** | 13, from 0.578 to 1.000 |
| 24 → 16 | 2,713 | 1,223 | **1,490** | **74 (5.0%)** | **1,416 (95.0%)** | 19, from 0.600 to 1.000 |

A pure resize would be ×0.833 to 20 and ×0.667 to 16, on every part, with one factor. Instead
**96% of the non-trivial parts at 20 are redrawn**, and the handful that do scale use thirteen
different factors. **20 is a drawn master, and so is 16.** The three-master claim in the Settled
table holds, with a number behind it for the first time.

---

## 2. Primitives, one by one

### 2.1 The container ring — one drawing, zero drift

Full circles reaching the container range, centred on the canvas:

| master | style | concepts | centreline r | centre | outer ink edge | residual to representative |
|---|---|---|---|---|---|---|
| 24 | outline | **40** | 9.25 | 12, 12 | 10 | **0** |
| 24 | filled | **37** | 10 | 12, 12 | 10 | **0** |
| 20 | outline | **40** | 7.25 | 10, 10 | 8 | **0** |
| 20 | filled | **37** | 8 | 10, 10 | 8 | **0** |
| 16 | outline | **40** | 6.375 | 8, 8 | 7 | **0** |
| 16 | filled | **37** | 7 | 8, 8 | 7 | **0** |

Exact congruence against `plus-circle`'s ring at all three masters: `check-circle`, `x-circle`,
`ban`, `info`, `clock`, `globe`, `target` — **IDENTICAL, scale ×1, residual 0, offset [0, 0]** in
all 21 comparisons. The outline class carries `alert-circle` ×4, `ban` ×3, `check-circle` ×6,
`chart-pie-3`, `clock`, `compass` ×3, `face-*` ×3, `globe` ×2, `help` ×4, `info` ×3, `language` ×2,
`minus-circle` ×2, `plus-circle` ×2, `target` ×2, `x-circle` ×2.

The three concepts outside the **filled** class of 37 are all correct, and all three hold the same
outer ink edge of 10 / 8 / 7:

| concept | filled construction | centreline r @24 | outer edge |
|---|---|---|---|
| `ban-filled` | line-heavy (2.5 / 2 / 2), ring stays a stroke | 8.75 | 10 ✓ |
| `compass-2-filled` | light (1.5 / 1.5 / 1.25), ring stays a stroke | 9.25 | 10 ✓ |
| `chart-pie-3-filled` | three filled slices built on r 10 arcs | — | 10 ✓ |

So the statement is stronger than wave 0's: **the container ring is one circle at every master and
in both styles, measured where it counts — at its outer ink edge, 10 / 8 / 7. 40 outline concepts
and 40 filled concepts carry it and not one of them deviates.** (Wave 0 recorded 41 outline + 37
filled; the exact-radius classes measured here are 40 and 37, and the three filled concepts in the
table below bring the filled total to 40 at the outer edge.) The centreline differs only by the
weight rule, which is arithmetic.

Across masters the ring is deliberately *not* a scale of itself. Its share of canvas runs
**83.3% → 80.0% → 87.5%** — non-monotonic, because it is the circle keyline (⌀20 / ⌀16 / ⌀14,
`tools/masters.mjs:31–44`), not a ratio. Card **1.4** owns that; it is recorded here because it is
the one place the ring "changes".

### 2.2 The rounded square — a second clean container

| master | style | concepts | outer ink box | corner radius |
|---|---|---|---|---|
| 24 | outline | **26** | 18 × 18 | 2.5 |
| 20 | outline | **26** | 14 × 14 | 2.0 |
| 16 | outline | **26** | 12 × 12 | 1.5 |
| 24 | filled | 5 | 18 × 18 | 3.25 |
| 20 | filled | 5 | 14 × 14 | 2.75 |
| 16 | filled | 5 | 12 × 12 | 2.125 |

Members at 24 outline include `chart-bar-5`, `checkbox` ×4, `grid-2`, `grid-6`, `image` ×2,
`layout-footer` ×4, `layout-header` ×4, `layout-sidebar` ×4, `layout-sidebar-right` ×4 — 26
concepts on one path, zero residual.

**The filled corner radius is derived, not chosen:** 2.5 + 0.75 = 3.25 · 2 + 0.75 = 2.75 ·
1.5 + 0.625 = 2.125 — *centreline radius + half the stroke*, at all three masters. That is exactly
the rule reconnaissance found Central using (`plans/set-and-rules-audit.md:215`). We already do it
and no doc of ours says so. Only 5 concepts reach the filled class because the other 21 fill their
square differently (a region, a cut) — §3.4 and card **1.8**.

### 2.3 The dot — the loosest primitive in the set

Full circles below the container threshold, by **outer ink diameter**:

| master | style | dots | distinct ⌀ |
|---|---|---|---|
| 24 | outline | 158 | **13** |
| 24 | filled | 168 | **16** |
| 20 | outline | 135 | **12** |
| 20 | filled | 144 | **14** |
| 16 | outline | 137 | **15** |
| 16 | filled | 148 | **17** |

Outline, by diameter, 24 → 20 → 16:

| ⌀ @24 | concepts at 24 | ⌀ @20 | ⌀ @16 |
|---|---|---|---|
| 2 | 6 — `building`, `building-3`, `building-4`, `camera-6`, `list-bullet`, `printer-2` | 2 | **1.5 / 1.75 / 2** — splits three ways |
| 2.5 | 13 — `alert-circle` ×2, `alert-triangle` ×2, `help` ×4, `info` ×3, `sparkle-4`, `wand` | **2** — merges with the ⌀2 group | 2 |
| 3 | 30 | 2.5, and 2.7 for six | 2 / 2.4 / 2.5 |
| 4.5 | 7 — `cart-4`, `sort-numeric-*` ×6 | 4 | 3.5 |
| 5 | 1 — `list-bullet-3` | 5 | 4.5 |
| 6 | 5 — `sliders`, `sliders-3`, `sliders-5`, `users-wide`, `users-3-wide` | 5 | 5 / 4 |
| 7 | 7 — `cash`, `gear-2`, `users`, `users-2-wide`, `users-4-wide`, `users-behind`, `users-level` | 5 / 3 / 6.5 | 5 / 4 / 1.75 |
| 7.5 | 2 — `grid-5`, `users-3` | 5.5 / 6 | 4.75 / 5 |
| 8 | 13 — `camera` ×4, `camera-6`, `map-pin` ×4, `user`, `users-2`, `users-2-level`, `users-3-level` | 6 | 4 / 4.5 / 5 |
| 8.5 | 3 — `eye`, `gear`, `sun` | 6 / 6.5 / 7 | 4.5 / 5.5 / 6 |
| 9 | 5 — `at-sign`, `users-2-behind`, `users-3-behind`, `users-4`, `users-4-level` | 7 | 5 / 6 |
| 10 | 8 — `at-sign-2`, `camera-5`, `key-5`, `key-6`, `user-2`, `user-3`, `user-4`, `users-4-behind` | 8 | 6 |
| 11 | 2 — `key-2`, `key-4` | 8 | 7 |

**(a) A distinction the 24 master makes is lost at 20 and 16.** The **glyph dot** — the detached
dot of a character, C19's own case (`info` i, `help` ?, `alert-circle` !, `alert-triangle` !) — is
⌀2.5 at 24 and **⌀2 at 20 and at 16**, which is exactly the plain *detail* dot (`building`'s
windows, `printer-2`'s light, `list-bullet`'s bullet). At 24 the two are different elements with
different sizes; at 20 and 16 they are the same circle. Share of canvas: 10.4% → 10.0% → 12.5%.
**Systemic, 13 concepts.**

**(b) One concept moves 18 points of canvas share, and it is not drift.** `cash`'s mark is ⌀7
(29.2% of canvas) at 24, ⌀3 (15.0%) at 20, ⌀1.75 (10.9%) at 16. The file's note explains: the mark
is a *ring* at 24 and becomes a *dot* at the smaller masters because "at 20 and 16 the interior is
only 6 · 4.75 tall". The detail died, which is the rule working. Listed because the census cannot
tell a ring that became a dot from a dot that changed size — and nor can a reader of the numbers.

**(c) Five circle radii break their master's grid, all from one decision.**

| master | grid | off-grid radii | concepts |
|---|---|---|---|
| 24 | 0.25 | **none** | — |
| 20 | 0.25 | 0.6 (40 files), 1.35 (filled) | `grid-3`, `list-bullet-2`, `more-horizontal`, `more-vertical`, `target-2`, `target-3` |
| 16 | 0.125 | 0.45 (filled), 0.575 (40 files), 1.2 (filled) | the same six |

All five come from one choice: the C17 repeated-element dot, ⌀3 → ⌀2.7 → ⌀2.4 of ink. ⌀2.7 needs
r 0.6 at stroke 1.5; ⌀2.4 needs r 0.575 at stroke 1.25. Neither is on its master's grid, and
neither are the dot centres (`more-horizontal` at 20: centres 4.6 / 10 / 15.4; at 16: 3.45 / 8 /
12.55). The 24 master has **zero** off-grid radii. **Systemic, 80 files, confined to 6 concepts.**

Distinct circle radii, all circles, per master: **36 at 24 · 28 at 20 · 42 at 16**, with **6 / 3 /
10** radii used exactly once.

### 2.4 The plus and the minus — one bar, exactly, everywhere

Outer ink span, and C8's size step:

| concept | 24 | 20 | 16 | step @24 | step @20 | step @16 |
|---|---|---|---|---|---|---|
| `plus-small` | 12.0 | 11.0 | 10.0 | | | |
| `plus` | **15.0** | **13.5** | **12.0** | 3 ✓ | 2.5 ✓ | 2 ✓ |
| `plus-large` | 18.0 | 16.0 | 14.0 | 3 ✓ | 2.5 ✓ | 2 ✓ |
| `plus-circle` | 10.5 | 8.0 | 6.5 | | | |
| `plus-circle-small` | 9.0 | 7.0 | 5.5 | | | |

C8's step (3 · 2.5 · 2) holds **exactly**, both directions, at all three masters.

`congruentUpToTranslation` on the bar, 18 comparisons:

| pair | 24 | 20 | 16 |
|---|---|---|---|
| `minus` vs `plus`'s horizontal | IDENTICAL | IDENTICAL | IDENTICAL |
| `minus-small` vs `plus-small`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `minus-large` vs `plus-large`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `minus-circle` vs `plus-circle`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `minus-circle-small` vs `plus-circle-small`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `minus` vs `plus`'s horizontal, **filled** | IDENTICAL | IDENTICAL | IDENTICAL |

**Eighteen of eighteen identical, residual 0.** The minus is literally the plus's bar — the
best-behaved primitive in the set.

### 2.5 The x and the slash

Outer ink span (a round cap on a 45° line extends half a stroke in each axis):

| concept | 24 | 20 | 16 | step @24 | step @20 | step @16 |
|---|---|---|---|---|---|---|
| `x-small` | 10.0 | 9.5 | 8.5 | | | |
| `x` | **13.0** | **12.0** | **10.5** | 3 ✓ | 2.5 ✓ | 2 ✓ |
| `x-large` | 16.0 | 14.5 | 12.5 | 3 ✓ | 2.5 ✓ | 2 ✓ |
| `x-circle` | 9.0 | 6.5 | 5.5 | | | |
| `x-circle-small` | 8.0 | 6.0 | 5.0 | | | |

C8 holds exactly here too. `x`'s own file note says the x sits "about 1.5 inside the plus box";
measured it is **2.0 / 1.5 / 1.5** inside — right at 20 and 16, 0.5 out at 24.

| pair | 24 | 20 | 16 |
|---|---|---|---|
| `ban`'s slash vs `ban-2`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `volume-x`'s arm vs `x-circle-small`'s | IDENTICAL | IDENTICAL | IDENTICAL |
| `ban-3`'s slash vs `x-small`'s arm | off 0.0141 u = **0.009 px@16** | off 1.527 u = 1.22 px | off 1.824 u = 1.82 px |

Wave 0 flagged `ban-3` / `x-small` as a drift candidate. **It is a coincidence, not a shared
part** — 0.0141 apart at 24 and more than a unit and a half apart at 20 and 16. `ban-3`'s own note
gives its half-length as "6 / 4.125 / 3.125"; measured from the centre along the slash it is
**5.9965 / 4.1295 / 3.3022** — right to 0.004 at 24 and 20, and **0.177 units (0.177 px@16) wrong
at 16**. The 16 was redrawn in the stroke-16 conversion and the prose was not. One-off; prose, not
a declared note, so no check could have caught it.

`ban`'s slash runs centre-to-centre on the ring: half-length 9.249 against a ring centreline radius
of 9.25, so the slash's cap sits on top of the ring. That is **contact grammar (F9), card 1.7** —
no rule exists.

### 2.6 The chevron — the most disciplined primitive, and C10's cap is the one thing that gives

36 chevron concepts (3 shape variants × 3 sizes × 4 directions). Classified by (leg length, bend
radius, turn), the 36 collapse to **9 shapes at every master in both styles** — one per
variant × size, shared by all four directions. (At 20 and 16 filled the raw count reads 10 because
two classes differ only in which leg the canonical traversal names first: the shapes are mirrors,
0.009 units apart in leg length.)

**Outline bend radius: 0.75 / 0.75 / 0.625 on all 36 at all three masters. Exactly `bendMin`. Zero
deviation across 108 drawings.**

`chevron-down` (the other three directions are identical):

| master | variant | size | outline turn | filled turn | Δ turn | filled R | R ÷ filled `bendMin` |
|---|---|---|---|---|---|---|---|
| 24 | 1 classic | small | 89.864° | 90.000° | +0.136 | 1.97 | 1.58× |
| 24 | 1 | default | 89.900° | 89.868° | −0.032 | 1.97 | 1.58× |
| 24 | 1 | large | 90.000° | 90.000° | 0 | 1.97 | 1.58× |
| 24 | **2** | small | 69.636° | 64.010° | **−5.626** | 2.5 | **2.00× cap** |
| 24 | **2** | default | 69.260° | 65.052° | **−4.208** | 2.5 | **2.00× cap** |
| 24 | **2** | large | 68.860° | 65.638° | **−3.222** | 2.5 | **2.00× cap** |
| 24 | 3 | small | 76.680° | 76.902° | +0.222 | 1.34 | 1.07× |
| 24 | 3 | default | 76.034° | 76.052° | +0.018 | 1.33 | 1.06× |
| 24 | 3 | large | 75.544° | 75.522° | −0.022 | 1.30 | 1.04× |
| 20 | 1 | small | 90.000° | 90.000° | 0 | 1.35 | 1.35× |
| 20 | 1 | default | 90.000° | 90.000° | 0 | 1.36 | 1.36× |
| 20 | 1 | large | 90.000° | 89.892° | −0.108 | 1.35 | 1.35× |
| 20 | **2** | small | 68.714° | 67.380° | **−1.334** | 2.0 | **2.00× cap** |
| 20 | **2** | default | 67.380° | 66.066° | **−1.314** | 2.0 | **2.00× cap** |
| 20 | **2** | large | 69.260° | 68.498° | −0.762 | 2.0 | **2.00× cap** |
| 20 | 3 | small | 77.222° | 77.206° | −0.016 | 1.05 | 1.05× |
| 20 | 3 | default | 75.764° | 75.558° | −0.206 | 1.05 | 1.05× |
| 20 | 3 | large | 76.476° | 76.380° | −0.096 | 1.05 | 1.05× |
| 16 | 1 | small | **88.698°** | 90.000° | +1.302 | 1.35 | 1.35× |
| 16 | 1 | default | **89.008°** | 89.826° | +0.818 | 1.35 | 1.35× |
| 16 | 1 | large | **89.198°** | 89.866° | +0.668 | 1.35 | 1.35× |
| 16 | **2** | small | 72.818° | 69.120° | **−3.698** | 2.0 | **2.00× cap** |
| 16 | **2** | default | 69.590° | 65.744° | **−3.846** | 2.0 | **2.00× cap** |
| 16 | **2** | large | 70.160° | 67.380° | **−2.780** | 2.0 | **2.00× cap** |
| 16 | 3 | small | 75.620° | 75.700° | +0.080 | 1.03 | 1.03× |
| 16 | 3 | default | 75.924° | 76.130° | +0.206 | 1.04 | 1.04× |
| 16 | 3 | large | 76.186° | 76.270° | +0.084 | 1.05 | 1.05× |

Three readings:

- **C10's promise is kept where it can be.** C10 says the filled bend "grows (≤ 2× minimum) to keep
  the leg angle". For variants 1 and 3 it grows to 1.03–1.97 and the angle is held within ±0.25°.
  Variant **3**'s radius lands on three slightly different numbers per master (1.30 / 1.33 / 1.34 at
  24) — that is **derived**, not drift: hold the angle and the radius is whatever that requires.
- **For variant 2 the cap binds at all three masters** — 2.5 = 2 × 1.25 at 24, 2.0 = 2 × 1.0 at 20
  and 16 — and the angle gives instead, by up to **5.626°**. On a 6.48-unit leg that moves the leg
  tip about 0.32 units, 0.21 px@16. 12 of 36 chevron concepts, 36 filled drawings. **Systemic, and
  a finding against the RULE:** C10 promises the angle is held and the radius grows; the cap makes
  that impossible, and nothing records which one gave. Nothing in lint or the docs says the cap was
  reached.
- **At 16 the classic chevron's three sizes sit at three different angles** — 88.698 / 89.008 /
  89.198 — where at 24 they were 89.864 / 89.900 / 90.000 and at 20 all three were exactly 90.
  `CLAUDE.md` records the mechanism (the 16 conversion held the ink box and let the angle give,
  45° → 45.5°). The largest here is half of 90 − 88.698 = **0.651° per leg**, on
  `chevron-down-small`.

`chevrons-up-down` is **not** built from the chevron. Its two chevrons are 9.5 × 4.429 at 24 where
`chevron-up` is 12.5 × 5.929, and they are not a scaled copy either — the bend radius stays 0.75
while the legs shrink, so the proportion changes. Defensible (two chevrons must share one canvas)
but it adds 8 more chevron drawings per master per style outside the 9-class family. Its *small*
sizes do share: `chevrons-up-down-2`'s chevron is `chevron-down-small`'s and
`chevrons-up-down-3`/`-4`'s is `chevron-down-2-small`'s, exactly.

### 2.7 The arrowhead — one head, 21 concepts, plus a tail of 24 others

Symmetric V bends outside the chevron concepts, grouped by (leg, bend radius, turn), ignoring
direction. 24 outline: 106 heads in **25** distinct drawings:

| leg | R | turn | files | concepts | who |
|---|---|---|---|---|---|
| **5.261** | 0.75 | 90° | **24** | **21** | `arrow-down/left/right/up`, `code-2`, `export`, `login` ×4, `logout` ×4, `sort`, `sort-2`, `sort-ascending`, `sort-descending`, `upload` ×3 |
| 5.250 | 0.75 | 90° | 10 | 7 | `arrow-up-right`, `arrow-up-right-5`, `external-link`, `external-link-2`, `maximize-4`, `refresh-2`, `refresh-3` |
| 2.000 | 2.50 | 90° | 8 | 2 | `maximize`, `maximize-5` |
| **4.250** | 0.75 | 90° | 6 | 5 | `refresh`, `rotate-ccw`, `rotate-ccw-2`, `rotate-ccw-3`, `rotate-ccw-4` |
| **4.257** | 0.75 | 90° | 6 | 6 | `rotate-ccw-5`, `-7`, `-8`, `-9`, `-10`, `-11` |
| 3.847 | 0.75 | 90° | 6 | 5 | `sort-3`, `sort-alpha-*` ×2, `sort-numeric-*` ×2 |
| 5.098 | 0.75 | 41.3° | 6 | 6 | `sort-alpha-*` ×6 — the A–Z bracket, not an arrowhead |
| 8.089 | 0.75 | 90° | 4 | 4 | `arrow-*-2` ×4 |
| 5.550 | 0.75 | 69.2° | 4 | 4 | `arrow-*-3` ×4 |
| 4.500 | 1.50 | 90° | 4 | 4 | `file`, `file-text`, `file-text-2`, `files-4` |
| 3.750 | 1.25 | 90° | 4 | 4 | `files`, `files-2`, `files-3`, `files-5` |
| 2.750 | 0.75 | 90° | 4 | 1 | `maximize-2` |
| 4.000 | 1.50 | 90° | 4 | 1 | `maximize-3` |
| 8.500 | 2.50 | 90° | 3 | 3 | `images`, `images-2`, `images-3` |
| 4.554 | 0.75 | 90° | 2 | 1 | `code` |
| 2.871 | 0.75 | 90° | 2 | 2 | `menu-arrow-left`, `menu-arrow-right` |
| 8.000 | 0.75 | 90° | 1 | 1 | `arrow-up-right-2` |
| 5.553 | 0.75 | 69.0° | 1 | 1 | `arrow-up-right-3` |
| **3.507** | 0.75 | 90° | 1 | 1 | `rotate-ccw-6` |
| 15.000 | 1.50 | 90° | 1 | 1 | `chart-bar-3` |
| 7.500 | 2.50 | 90° | 1 | 1 | `copy` |
| 8.199 | 0.75 | 60.0° | 1 | 1 | `language` |
| 9.424 | 1.50 | 46.8° | 1 | 1 | `mail-2` (envelope flap) |
| 8.822 | 1.50 | 65.0° | 1 | 1 | `mail-3` |
| 8.934 | 3.00 | 59.2° | 1 | 1 | `mail` |

20 outline: 106 heads, **28** classes, the big one at leg 4.554 in 20 concepts (22 files). 24
filled: 85 heads, **25** classes, the big one at leg 4.059 / R 1.25 in 19 concepts (21 files).

Near-duplicate pairs inside what should be one family:

| pair | master | Δ leg | px@16 |
|---|---|---|---|
| 5.261 (21 concepts) vs 5.250 (7 concepts) | 24 | 0.011 | **0.007** |
| 4.250 (`refresh`, `rotate-ccw`…`-4`) vs 4.257 (`rotate-ccw-5`…`-11`) | 24 | 0.007 | **0.005** |
| 4.554 (20 concepts) vs 4.500 (6 concepts) | 20 | 0.054 | **0.043** |
| 3.500 (`refresh`, `rotate-ccw`…`-4`) vs 3.507 (`rotate-ccw-5`, `-8`, `-9`, `-10`) | 20 | 0.007 | **0.006** |

The 5.261 / 5.250 split is defensible: the axis-aligned arrow's head legs are at 45° and land on
the quarter grid in x and y (5.261 = 3.72 √2), while the diagonal arrow's legs are axis-aligned and
land on the quarter grid directly (5.250). Two constructions of one idea.

The **`rotate-ccw` family is not defensible as a construction, only as history**: eleven concepts
draw the same arrowhead at **three** different leg lengths at 24, in **two orientations**:

| concepts | leg | leg angles | note |
|---|---|---|---|
| `refresh`, `rotate-ccw`, `rotate-ccw-2`, `-3`, `-4` | 4.250 | 90° / 0° — axis-aligned V | |
| `rotate-ccw-5`, `-7`, `-8`, `-9`, `-10`, `-11` | **4.257** | 135° / 45° — the same V turned 45° | **0.007 longer than the same head unturned** |
| `rotate-ccw-6` | 3.507 | 135° / 45° | a third length |

A rotation does not change a leg's length, so 4.257 against 4.250 is a real discrepancy, created by
rounding the turned version's endpoints. Nothing is visible at 0.005 px@16. What is costly is that
there is no single number to change. **Systemic within one family; nil in visual effect.**

**And no congruence check can see it.** `congruentUpToTranslation` is rotation-sensitive by design
(`chevron-left` must not be `chevron-right`), so the two orientations compare as "not the same
structure", residual ∞. This drift is visible only in a **parameter** census — part type, leg
length, bend radius, turn — which is why §8's proposed linter needs both kinds of check.

### 2.8 The badge — zero instances

`docs/09-rule-audit.md:38` records an open ruling: may a modifier badge cross 22? Doc 01 says yes,
doc 05 says it stays inside the live area, doc 01 also says there is no live area, and lint has no
badge exemption. **The set contains no corner-badge icon at all.** The only two-object names in 485
concepts are `menu-arrow-left` / `menu-arrow-right` and `volume-plus` / `-minus` / `-x`, and all
five put the second element beside the first at full size, not in a corner. `volume-x`'s x is
`x-circle-small`'s x exactly (§2.5).

The badge primitive cannot drift, because it does not exist — so the open ruling costs nothing
today while blocking a whole class (`calendar-plus`, `file-plus`, `user-plus`…). Card **1.9** owns
the modifier grammar; this is the measurement it needs: **the modifier-zone census is empty.**

### 2.9 Bend radius across the whole set

Every bend whose legs actually turn (turn ≥ 10°), by radius:

| master | style | bends | distinct radii | radii (count) |
|---|---|---|---|---|
| 24 | outline | 196 | 9 | **0.75** (143), 1.25 (4), 1.5 (22), 2.5 (21), 2.75, 3, 3.5 (2), 4.5, 5 |
| 24 | filled | 149 | 12 | 0.75 (12), **1.25** (69), 1.30/1.33/1.34 (12), 1.5 (4), 1.93 (2), 1.96 (4), 1.97 (16), 2 (6), 2.5 (22), 4.5 (2) |
| 20 | outline | 196 | 7 | **0.75** (143), 1 (4), 1.25 (22), 2 (22), 2.25, 2.5 (2), 4 (2) |
| 20 | filled | 149 | 10 | 0.75 (12), **1** (69), 1.05 (12), 1.25 (4), 1.35 (18), 1.36 (4), 1.75 (6), 2 (22), 3.75, 4 |
| 16 | outline | 197 | 8 | **0.625** (143), 0.75 (4), 1 (22), 1.5 (21), 1.75, 2 (4), 3.25, 3.5 |
| 16 | filled | 149 | 13 | 0.625 (12), **1** (73), 1.03/1.04/1.05 (12), 1.125 (6), 1.35 (16), 1.49 (2), 1.5 (6), 1.53 (4), 2 (16), 2.875, 3.5 |

143 of 196 outline bends at 24 sit exactly on `bendMin`. **No bend anywhere in the set is below the
minimum for the weight it is drawn at** — checked against each file's real stroke.

**But a rule statement is wrong.** `CLAUDE.md`'s C10 row and `tools/masters.mjs:26–27` both state
`bendMin` as two cases: "outline 0.75 · 0.75 · 0.625, filled 1.25 · 1 · 1". The set has **three**.
A *light* filled file (shapes fill, lines keep the outline weight) bends its strokes at the
**outline** radius, and 36 drawings do — 12 concepts × 3 masters: `export`, `external-link`,
`external-link-2`, `rotate-ccw-4`, `rotate-ccw-6`, `rotate-ccw-9`, `rotate-ccw-11`,
`sort-alpha-ascending`, `sort-alpha-descending`, `sort-numeric-ascending`,
`sort-numeric-descending` (+1), at 0.75 / 0.75 / 0.625.

Scale: at the pin, **143 of 485 concepts are line-heavy and 342 are light** (none mixed across
masters), and **429 of 1,455 filled files carry no shape-filled path at all** — exactly 143 × 3.
So the third case is not a corner: two thirds of the filled set is a light file whose strokes bend
at the outline radius.

`lint.mjs:211` already gets this right — `STROKE = areas.length ? strokeOf(canvas) : weightOf(...)`,
so a shape-filled file is measured at the outline weight. **Kind 2: the rule as written disagrees
with the rule as enforced, and the enforced one is right.** The fix is one sentence: `bendMin` is
half the weight *of the stroke that bends*, and the "filled 1.25 · 1 · 1" row applies to line-heavy
filled files only. Hand to card **1.16**.

Also derived and correct: the filled *corner bracket* radius reduces by half the added weight —
`maximize` 2.5 → 2 at 24, 2 → 1.75 at 20, 1.5 → 1.125 at 16. The rule works.

### 2.10 C17's repeated elements — the general statement and its own example disagree

`CLAUDE.md`: "*Repeated elements* (C17: dots, menu lines) are spaced by their own thickness (menu:
fixed gap 3 at 24 and 20; …)". Measured:

| concept | master | element | ink thickness | edge gap | gap ÷ thickness |
|---|---|---|---|---|---|
| `more-horizontal`, `more-vertical`, `grid-3` | 24 | dot | 3 | **3** | 1.00 ✓ |
| " | 20 | dot | 2.7 | **2.7** | 1.00 ✓ |
| " | 16 | dot | 2.4 | **2.15** | **0.90** |
| `list-bullet-2` | 24 / 20 / 16 | dot | 3 / 2.7 / 2.4 | 2.5 / 2.3 / 2.1 | 0.83 / 0.85 / 0.88 |
| `list-bullet` | 24 / 20 / 16 | dot | 2 / 2 / 1.75 | 2.5 / 2.5 / 2.75 | 1.25 / 1.25 / 1.57 |
| `list-bullet-3` | 24 / 20 / 16 | dot | 5 / 5 / 4.5 | 2.5 / 2.5 / 3 | 0.50 / 0.50 / 0.67 |
| `menu`, `menu-2` | 24 / 20 | line | 1.5 | **3** | **2.00** |
| `menu`, `menu-2` | 16 | line | 1.25 | **3.25** | **2.60** |
| `menu-3` | 24 / 20 / 16 | line | 1.5 / 1.5 / 1.25 | 4.5 / 4.5 / 4.75 | 3.00 / 3.00 / 3.80 |
| `menu-4` | 24 / 20 / 16 | line | 1.5 / 1.5 / 1.25 | 6 / 6 / 6.25 | 4.00 / 4.00 / 5.00 |

`CLAUDE.md`'s **menu** numbers reproduce exactly (3 at 24 and 20; 3.25 / 4.75 / 6.25 at 16). C17's
**general** statement — "spaced by their own thickness" — holds for **3 concepts at 2 of 3 masters**
and for nothing else. The ratio across the C17 family runs from **0.50 to 5.00**.

**Kind 2 finding.** The general rule is a description of one drawing (`more-horizontal` at 24)
promoted to a rule; the set's own members never obeyed it. `more-horizontal`'s file note says so
plainly: *"the gap equals the dot at 24 and 20, 0.9 of it at 16 so the filled row fits 12"* — an
agreed deviation recorded in prose, with no `<!-- gap: N -->` for lint to read.

---

## 3. Assemblies — is the mark inside the container the mark outside it?

### 3.1 The container is shared, exactly

Tested in §2.1: 21 of 21 comparisons IDENTICAL at all three masters, residual 0.

### 3.2 The mark is **not** the free-standing mark, and that is a decision, not drift

Outer ink span of the mark, free vs in the ring:

| mark | free @24 | in ring @24 | ratio | free @20 | in ring @20 | ratio | free @16 | in ring @16 | ratio |
|---|---|---|---|---|---|---|---|---|---|
| plus | 15.0 | 10.5 | **0.700** | 13.5 | 8.0 | **0.593** | 12.0 | 6.5 | **0.542** |
| x | 13.0 | 9.0 | **0.692** | 12.0 | 6.5 | **0.542** | 10.5 | 5.5 | **0.524** |
| check (ink width) | 16.0 | 10.28 | 0.643 | 14.0 | 7.8 | 0.557 | — | — | — |

The ratio falls by **0.16 (plus) and 0.17 (x)** from 24 to 16 — a 23–24% relative shrink of the
mark against its free-standing twin. At 24 plus and x shrink by almost the same factor (0.700 vs
0.692); by 20 they have diverged (0.593 vs 0.542). **Systemic.** This is the 13% mark/container
drift on `docs/08`'s open agenda (§6.1), measured here on three marks; card **1.4** judges it.

The plus, the minus and the x are scale-congruent free-to-ring (they are straight lines, so that is
vacuous — `scaleTrivial` flags it). **The check is not:** `check-circle`'s check against `check` is
different, and not a scale either, at all three masters. Its leg ratio (long : short) — the thing
that makes it our check — is not held:

| concept | 24 outline | 20 outline | 24 filled |
|---|---|---|---|
| `check` | 2.386 | 2.297 | 2.444 |
| `check-small` | 2.515 | 2.620 | 2.628 |
| `check-circle` | **2.515** | 2.681 | (filled is a cut) |
| `check-circle-small` | 2.609 | 2.828 | — |
| `check-2` | 3.525 | 3.632 | **3.875** |
| `check-2-small` | 3.227 | 3.538 | 3.580 |
| `check-3` | 2.089 | 2.202 | 2.302 |
| `check-4` | 2.391 | 2.503 | 2.657 |

`check-circle`'s leg ratio at 24 is **2.515 — exactly `check-small`'s**, so the ring's check carries
the small check's proportion, not the default check's. Within one tagged variant the ratio moves up
to **9%** between default and small (`check-2`: 3.525 vs 3.227). And the filled twin is always
*more* asymmetric than its outline, worst **+9.9%** on `check-2` (3.525 → 3.875), because the ends
pull in by half the added weight and that takes proportionally more off the short leg. The last of
those is pure arithmetic from the filled rule — **a finding against the RULE**, which guarantees the
ink box and says nothing about the proportion inside it.

### 3.3 The checkbox's check **was** the ring's check — until 16

| pair | 24 | 20 | 16 |
|---|---|---|---|
| `checkbox` vs `check-circle` | **IDENTICAL** | **IDENTICAL** | off 0.106 u = **0.106 px** |
| `checkbox-2` vs `check-circle-3` | **IDENTICAL** | **IDENTICAL** | off 0.172 u = **0.172 px** |
| `checkbox-3` vs `check-circle-4` | **IDENTICAL** | **IDENTICAL** | off 0.258 u = **0.258 px** |
| `checkbox-4` vs `check-circle-small` | **IDENTICAL** | **IDENTICAL** | **IDENTICAL** |

At 24 both files carry the same string, byte for byte:
`M7.61 12.46L9.81 14.65A0.75 0.75 0 0 0 10.87 14.65L16.39 9.13`. At 16 they are two drawings:

```
16/checkbox.svg      M5.375 8.31  L6.562 9.498 A0.625 … L10.625 6.319   ink 5.25 wide
16/check-circle.svg  M5.335 8.205 L6.593 9.53  A0.625 … L10.665 6.285   ink 5.33 wide
```

`checkbox`'s endpoints are on the eighth grid; `check-circle`'s are not. **One shared check became
three drawings at 16 — the master where a quarter of a pixel is a quarter of a pixel.** Systemic
(3 of 4 pairs), caused by the two files being converted independently.

### 3.4 Nine groups of concepts ship identical outline geometry at all three masters

22 concepts, 9 distinct outline drawings — **13 redundant outline drawings** in the shipped set.

| group | styles identical | what differs |
|---|---|---|
| `globe` = `language-2` | **outline and filled** | nothing — `language-2`'s note: "all six files identical to globe … a second name for the same drawing (a search alias)" |
| `globe-2` = `language-3` | **outline and filled** | nothing |
| `ban` = `ban-2` | outline only | filled: `ban-filled` line-heavy (2.5), `ban-2-filled` a disc with the slash cut out |
| `building-3` = `building-4` | outline only | filled: wing beside vs wing behind |
| `compass` = `compass-3` | outline only | filled: split by a disc strip vs north solid / south outlined |
| `layout-footer` = `-2` = `-3` | outline only | filled: divider cut / solid footer / solid page |
| `layout-header` = `-2` = `-3` | outline only | as above |
| `layout-sidebar` = `-2` = `-3` | outline only | as above |
| `layout-sidebar-right` = `-2` = `-3` | outline only | as above |

Every one is **declared in the drawing's own prose** — `layout-footer-2`: "Outline is A's";
`building-4`: "F's outline, filled another way"; `compass-3`: "Outline: B from round 1, byte for
byte". They are deliberate. Two separate findings fall out, of different kinds:

- **Kind 2, systemic.** The set has invented a second sort of numbered variant — *the filled-style
  variant*: one outline, two or three filled treatments, numbered. **17 concepts sharing 7 outline
  drawings.** C9 says shape variants are numbered and their style word is a tag; the Settled table
  says the two styles are "drawn together per icon and approved as a pair". Neither names this
  case. There is no rule for it and no tag for it, so nothing tells a customer that
  `layout-footer`, `-2` and `-3` are one outline icon with three fills.
- **Kind 1, one-off ×2.** `globe`/`language-2` and `globe-2`/`language-3` are byte-identical in
  **both** styles — 12 files that are not drawings but search aliases. C9 built the tag mechanism
  for exactly this (`<!-- tags: translate, globe, world, international -->` is already on
  `language-2`). Shipping a duplicate file where a tag would do costs 12 of 2,910 files and two of
  485 concept slots.

Separately, **8 filled files are byte-identical to their own outline twin** (only the root
`stroke-width` differs): `grid-3`, `grid-4`, `more-horizontal`, `more-vertical`, at 24 and 20 only;
at 16 they diverge. Reproduces wave 0; belongs to card **1.8**.

---

## 4. Objects — is a document the same document, a folder the same folder, a person the same person?

### 4.1 The folder

| master | body outer ink box | `folder` body | `folder-2` body | `folder-3` body |
|---|---|---|---|---|
| 24 | 18.5 × 16.5, box[2.75, 3.75, 21.25, 20.25] | own drawing | **identical to `folder-3`** | **identical to `folder-2`** |
| 20 | 14.5 × 12.5, box[2.75, 3.75, 17.25, 16.25] | own drawing | **identical** | **identical** |
| 16 | 12.75 × 10.75, box[1.625, 2.625, 14.375, 13.375] | own drawing | **identical** | **identical** |

All three folders have **the same body bounding box at every master**, but `folder`'s body is a
different *path* from `folder-2`'s and `folder-3`'s: `folder` carries the tab inside the body
outline, while `folder-2` and `folder-3` draw a plain body plus a separate tab line. `folder-2` and
`folder-3` share that body **exactly, residual 0, at all three masters**, and differ only in the
tab's length:

| master | `folder-2` tab | `folder-3` tab |
|---|---|---|
| 24 | 7.5 × 2 | 4.5 × 2 |
| 20 | 6 × 2 | 3 × 2 |
| 16 | 5.677 × 2 | 2.927 × 2 |

So the folder is **two** drawings, not three, and the bbox is held across all three. Note the 16
tab lengths are off the eighth grid (5.677, 2.927) where 24 and 20 are on the quarter grid — the
same 16-conversion signature as §3.3.

### 4.2 The document / page

19 concepts (`file`, `file-text`, `file-text-2`, `files`×5, `clipboard`×4, `copy`×3, `save`,
`archive`, `presentation`×2). All their subpaths classified in translation mode:

| master | subpaths | classes | classes shared by 2+ concepts |
|---|---|---|---|
| 24 outline | 57 | 37 | 9 |
| 16 outline | 53 | 37 | 7 |

**There are exactly two page drawings, and both are shared exactly (residual 0) at every master:**

| page | sheet | fold notch | concepts |
|---|---|---|---|
| full | 14.5 × 18.5 @24 · 8.75 × 12.75 @16 | bend 6 × 6 @24 · 4.125 × 4.125 @16 | `file`, `file-text`, `file-text-2`, `files-4` |
| small | 11.5 × 15.5 @24 · 5.75 × 9.75 @16 | bend 5 × 5 @24 · 3 × 3 @16 | `files`, `files-2`, `files-3`, `files-5` |

So the page *is* one drawing within each of the two families, and the back sheet of `files` and
`files-5` is also shared exactly (bend 9 × 13 @24, 4.25 × 8.25 @16). `file-text` and
`file-text-2`'s rule lines are shared exactly (8.5 × 0 @24); at 16 `archive` joins that class.

**But the `clipboard` and `copy` families do not reuse either page.** `copy`, `copy-2` and `copy-3`
share **nothing** with the file/files pages. Two near misses:

| pair | 24 | 16 |
|---|---|---|
| `clipboard` vs `clipboard-2` body | off 0.500 u = **0.333 px** | off 0.250 u = **0.250 px** |
| `archive` vs `files-5` | off 0.500 u = 0.333 px | — |

`clipboard` and `clipboard-2` have the **identical body bounding box** at every master
(14.5 × 17 at 24, box[4.75, 4.25, 19.25, 21.25]) and two different body paths inside it.
`clipboard-4` shares `clipboard`'s clip exactly (6.5 × 4). **One-off, two concepts** — the sort of
pair the near-miss check in §8 exists for.

### 4.3 The person — C27's claim does not carry into the geometry

`CLAUDE.md`'s Settled table, C27: *"the number names the figure and travels with the object —
`user-2` ↔ `users-2`"*. Head **ink** diameter, measured:

| concept | 24 | 20 | 16 |
|---|---|---|---|
| `user` | **8** | 6 | **5** |
| `user-2` | 10 | 8 | 6 |
| `user-3` | 10 | 8 | 6 |
| `user-4` | 10 | 8 | 6 |
| `users` | 7 | 5 | **5** |
| `users-2` | **8** | 6 | **5** |
| `users-3` | 7.5 | 6 | **5** |
| `users-4` | 9 | 7 | 6 |
| `users-behind` | 7 | 5 | **5** |
| `users-2-behind` | 9 | 7 | **5** |
| `users-wide` | 6 | 5 | 4 |
| `users-2-wide` | 7 | 5 | 4 |
| `users-level` | 7 | 5 | 4 |
| `users-2-level` | 8 | 5.5 | 4.5 |

- **`users-2` is drawn with `user`'s head, not `user-2`'s.** ⌀8 against ⌀10 at 24 — and `users-2`'s
  head circle is in the *same congruence class as `user`'s*, residual 0.
- **`user-2`, `user-3` and `user-4` all share one head** (⌀10 / 8 / 6, residual 0) — three figure
  numbers, one figure head. `users-4-behind` is in that class too.
- The head sizes group by **arrangement** — how many figures and how they sit — never by the figure
  number. At 24 the fourteen concepts above take **six** head sizes; `users-2-level`'s ⌀8 at 24 and
  ⌀4.5 at 16 appear nowhere else.
- **At 16 the distinction collapses.** One class of ⌀3.75 centreline (⌀5 ink) holds **10 subpaths
  across 9 concepts** — `user`, `users`, `users-2`, `users-2-behind`, `users-3`, `users-3-behind`,
  `users-4-level`, `users-4-wide`, `users-behind`. At 24 `user` (⌀8) and `users` (⌀7) are different
  heads; at 16 they are the same circle.

**So the answer to "is a person the same person across the figure families" is no.** Whether that
is a defect depends on something only Maruti can say: does C27 claim *geometric* identity, or only
that the number names the figure for **naming** purposes? The renumbering record (doc 07, figure
families, 2026-09-23) reads as a naming decision. Either way the Settled table's wording — "the
number names the figure and travels with the object" — reads as a geometric promise and the
drawings do not keep it. **Kind 2, systemic, 20 concepts.**

The within-family near misses here are the tightest in the set: `users-3-behind` vs
`users-3-level` at 16, **0.0132 u = 0.013 px** on the same ⌀2.75 head (wave 0's finding, confirmed);
`users-level` vs `users-wide` at 16, 0.0576 u; and five more between 0.300 and 0.333 u.

### 4.4 The arrow — the best-reused object in the set

25 concepts (`arrow-*` ×5, `login` ×4, `logout` ×4, `upload` ×3, `export`, `external-link` ×2,
`send`, `sort` ×5):

| master | subpaths | classes | classes shared by 2+ concepts |
|---|---|---|---|
| 24 outline | 77 | 33 | **16** |
| 16 outline | 77 | 34 | **19** |

Nearly half the arrow vocabulary is shared, and **reuse improves at 16** (19 of 34 against 16 of
33). Shaft and head, all residual 0:

| part | size @24 | files | concepts |
|---|---|---|---|
| vertical shaft | 0 × 13.5 | 8 | `arrow-down`, `arrow-up`, `sort`, `sort-ascending`, `sort-descending`, `upload`, `upload-3` |
| up head | 8.5 × 3.939 | 8 | `arrow-up`, `export`, `sort`, `sort-2`, `sort-ascending`, `upload`, `upload-2`, `upload-3` |
| horizontal shaft | 13.5 × 0 | 6 | `arrow-left`, `arrow-right`, `login`, `login-3`, `logout`, `logout-3` |
| left head | 3.939 × 8.5 | 5 | `arrow-left`, `login-3`, `login-4`, `logout-3`, `logout-4` |
| right head | 3.939 × 8.5 | 5 | `arrow-right`, `login`, `login-2`, `logout`, `logout-2` |
| down head | 8.5 × 3.939 | 4 | `arrow-down`, `sort`, `sort-2`, `sort-descending` |
| diagonal head | 6 × 6 | 3 | `arrow-up-right`, `external-link`, `external-link-2` |

**The login/logout doors are shared exactly — but cross-paired by number**, which is a naming
finding, not a drawing one:

| door shape @24 | shared by |
|---|---|
| other 4.5 × 16.5 | `login` **and `logout-3`** |
| other 4.5 × 16.5 | `login-3` **and `logout`** |
| other 6.5 × 16.5 | `login-2` **and `logout-4`** |
| other 6.5 × 16.5 | `login-4` **and `logout-2`** |

`login` shares its door with `logout-3`, not with `logout`. By C9's own logic — a number names a
shape variant — `login-n` and `logout-n` ought to be the same door. **One-off naming finding, 8
concepts; hand to card 1.10 (families) and 1.14.**

Near misses between different concepts: `external-link` vs `external-link-2` 0.1768 u = 0.118 px at
24; `arrow-down` vs `export` 0.125 u; `sort-2` vs `upload-2` 0.125 u; `sort-ascending` vs `sort-3`
0.375–0.500 u (three pairs).

---

## 5. What rises at 16 — and what does not

Wave 0 recorded "near misses: 361 at 24, 378 at 20, **545 at 16** — rising as the master shrinks,
which is backwards". **That rise is an artefact of the measuring band, not a property of the set.**

`classify`'s `near` default is **0.5 drawing units at every master**. A unit is 1/24 of the canvas
at 24 and 1/16 at 16, so a fixed 0.5-unit band catches a band 1.5× wider, proportionally, at 16
than at 24. Re-run with the band held at the same **share of canvas** (0.5 at 24 → 0.4167 at 20 →
0.3333 at 16, i.e. 2.08% of the canvas everywhere):

| master | style | subpaths | band | near misses | same family | across families | per 100 subpaths |
|---|---|---|---|---|---|---|---|
| 24 | outline | 1,409 | 0.500 | **361** | 67 | 294 | 25.6 |
| 20 | outline | 1,375 | 0.417 | **287** | 47 | 240 | 20.9 |
| 16 | outline | 1,352 | 0.333 | **308** | 40 | 268 | 22.8 |
| 24 | filled | 1,419 | 0.500 | **237** | 33 | 204 | 16.7 |
| 20 | filled | 1,387 | 0.417 | **207** | 48 | 159 | 14.9 |
| 16 | filled | 1,363 | 0.333 | **186** | 24 | 162 | 13.6 |

Proportionally the 16 master has **fewer** near misses than 24 in both styles, and fewer
within-family ones — 40 vs 67 outline, 24 vs 33 filled. The distinct-part count is flat
(1,254 / 1,226 / 1,234). So:

> **The 16 master's vocabulary is not larger or looser than 24's. What is true is narrower and
> still worth a ruling: the 16 master's grid is twice as fine, and the parts it does split apart
> split by amounts that matter — a near miss at 16 is measured in whole fractions of a pixel, where
> the same near miss at 24 is two-thirds of that.**

The one count that genuinely rises is the **circle radius vocabulary**: 36 at 24 · 28 at 20 ·
**42 at 16**, with 6 / 3 / 10 radii used exactly once. On its own grid the 16 master uses 42 of 56
legal values (75%) where 24 uses 36 of 40 (90%) — so 16 is less saturated but holds **six more
distinct circle sizes in a canvas two-thirds the size**. And all five off-grid radii in the set are
at 20 and 16; the 24 master has none (§2.3c).

**The within-family drift list at 16 outline** — the 40 pairs above, nearest first, as the
primitive-drift linter would report them:

| residual | px@16 | pair |
|---|---|---|
| 0.0132 | 0.013 | `users-3-behind` vs `users-3-level` — the same r 1.375 head |
| 0.0250 | 0.025 | `package-2` vs `package-3` |
| 0.0576 | 0.058 | `users-level` vs `users-wide` |
| 0.0884 | 0.088 | `paintbrush-3` vs `paintbrush-7` |
| 0.1004 | 0.100 | `sparkle-2` vs `sparkle-4` |
| 0.1250 | 0.125 | `alert-triangle-3` vs `alert-triangle` |
| 0.1250 | 0.125 | `chart-bar-2` vs `chart-bar-5` |
| 0.1250 | 0.125 | `lock-3` vs `lock-5` |
| 0.1739 | 0.174 | `paintbrush-2` vs `paintbrush-5` |
| 0.1768 | 0.177 | `check-circle-4-small` vs `check-circle-3-small` |
| 0.1964 | 0.196 | `grid-5` vs `grid-7` |
| 0.2055 | 0.206 | `check-circle-3` vs `check-circle-4` |
| 0.2130 | 0.213 | `language` against itself (two paths in one file) |
| 0.2500 | 0.250 | `chart-bar-2` vs `chart-bar-5`; `database-2` vs `database` ×3; `clipboard-2` vs `clipboard` |
| 0.2792 | 0.279 | `pencil-3` vs `pencil-4` |
| 0.2843 | 0.284 | `check-circle-3-small` vs `check-circle-small` |
| 0.2874 | 0.287 | `checkbox-2` vs `checkbox-3` |
| 0.300–0.333 | 0.300–0.333 | `users-*` ×5 · `gear-3` against itself ×9 · `key-2` vs `key-3` · `pencil-3` vs `pencil` · `camera-6` vs `camera-2` · `gear-2` vs `gear` · `at-sign` vs `at-sign-2` |

At 16 filled the same list runs 24 pairs, 0.030 to 0.332: `arrow-up-right-5` vs `-4` (0.030),
`alert-triangle-3` vs `alert-triangle` (0.075), `alert-triangle-2` vs `-4` (0.092), `sparkle-2` vs
`-4` (0.092), `lock-3` vs `lock-5` (0.125), `compose-2` vs `compose-4` (0.173), `pencil-4` vs
`pencil-2` (0.173), `alert-circle-2` vs `-4` (0.181), `grid-5` vs `grid-7` (0.196), `table-2` vs
`table` ×2 (0.208), `check-circle-4` vs `-3` (0.224), `chart-bar-2` vs `chart-bar` ×2 (0.250),
`wallet-2` vs `wallet` (0.260), `compass` vs `compass-3` (0.278), `database-2` vs `database`
(0.300), `key-2` vs `key-3` (0.319), `pencil` vs `pencil-3` (0.328), `compose-4` vs `compose`
(0.332).

`gear-3` appearing nine times against *itself* is the clearest single case: its own teeth are
0.304 units apart from one another at 16, where they should be one tooth rotated.

---

## 6. Judged list — what stuck out

Thirteen items. Everything else above is coverage. Items **1, 2, 3, 5 and 11** move the most of
the set. Each is tagged **one-off** or **systemic**, and labelled by kind: **(1)** a drawing disagrees with a stated rule · **(2)** a rule disagrees with
another rule or the docs · **(3)** a drawing is fine by every rule and still looks wrong, and no
rule covers it.

1. **The shared check broke at 16. (1) · systemic.** `checkbox` and `check-circle` carried one check
   path, byte for byte, at 24 and 20. At 16 three of the four pairs are two drawings, up to
   **0.258 px** apart at the size where a quarter-pixel is a quarter-pixel (§3.3). No rule was
   broken — nothing says a shared part must stay shared, which is why this is the finding that
   earns the primitive-drift linter. **Recommendation:** make that the linter's first check — *two
   files that share a path at one master must share it at all three*, as an error. It costs nothing
   today except these three pairs.

2. **C10's 2× cap binds on a third of the chevrons and nobody is told. (2) · systemic.** For
   `chevron-*-2` the filled bend hits 2 × `bendMin` at all three masters and the leg angle gives
   instead, by up to **5.626°** (0.21 px@16 at the leg tip) — 12 concepts, 36 drawings (§2.6). C10
   says the radius grows *to keep the leg angle*; with a cap it cannot. **Recommendation:** C10
   should say which gives when the cap is reached, and lint should print the cap as an info line
   the way it prints `gap:`. Variant 2 is also the one place the outline and filled chevrons may
   read as different shapes — **Maruti's eye settles that**, on an overlay of the nine chevron
   shapes at 16, outline over filled.

3. **Thirteen redundant outline drawings, and no name for what they are. (2) · systemic.** 22
   concepts ship 9 distinct outline drawings (§3.4). Seven groups — 17 concepts — are
   *filled-style variants*: one outline, two or three fills, numbered. C9 has no slot for this and
   no tag for it. **Recommendation:** give it a name and a tag (a `fill:` note beside the existing
   `tags:`) so a customer sees that `layout-footer`, `-2` and `-3` are one icon with three fills,
   and so lint can verify the outlines really are identical rather than nearly so.

4. **Two concepts are files where a tag would do. (1) · one-off ×2.** `globe`/`language-2` and
   `globe-2`/`language-3` are byte-identical in both styles, declared as aliases in their own
   notes — 12 files, 2 of 485 concept slots. **Recommendation:** retire `language-2` and
   `language-3`, move "language, translate" onto `globe`/`globe-2`'s `tags:`. Same class of problem
   as doc 06's proposed `close`=`x` and `copy`=`duplicate` merges, which are already waiting on a
   ruling — fold it in there (card **5.2**).

5. **C17 was written from one drawing and no drawing obeys it. (2) · systemic.** "Repeated elements
   are spaced by their own thickness." Measured across the family the ratio runs **0.50 to 5.00**
   (§2.10). It is true for `more-horizontal`, `more-vertical` and `grid-3` at 24 and 20 and for
   nothing else; `CLAUDE.md`'s own parenthesis gives menu's gap as 3 on a 1.5 line, which is 2×.
   **Recommendation:** C17 should state what it actually governs — *a repeated element's gap is
   agreed per family and declared* — and the six off-grid dot concepts should carry a declared note
   rather than prose. This is the standing rule *teach lint agreed exceptions* applied to the one
   place it was not.

6. **Five circle radii break their master's grid; all five come from one dot. (1) · systemic, 80
   files, 6 concepts.** r 0.6 and 1.35 at 20; r 0.45, 0.575 and 1.2 at 16; **none at 24** (§2.3c).
   The cause is the C17 dot stepping ⌀3 → ⌀2.7 → ⌀2.4 of ink, which needs an off-grid radius at
   both smaller masters. The files carry comments, so `lint.mjs:216`'s "any comment is a documented
   exception" escape silences the grid warning — already on the agenda
   (`plans/set-and-rules-audit.md:104`). **Recommendation:** pick the dot from the grid (⌀2.5 at 20
   and ⌀2.375 at 16 are both legal) or declare the exception. **Maruti's eye decides whether ⌀2.5
   at 20 reads as the same dot** — the surface is a `more-horizontal` row at real pixels, 2.7
   against 2.5.

7. **`rotate-ccw`'s eleven concepts draw one arrowhead at three lengths, in two orientations.
   (3) · systemic within one family.** 4.250 (axis-aligned, five concepts) · 4.257 (the same V
   turned 45°, six concepts) · 3.507 (`rotate-ccw-6`) at 24, and the same pattern at 20 (§2.7). A
   rotation does not lengthen a leg, so the 0.007 is a real discrepancy from rounding the turned
   endpoints. The visual cost is **0.005 px@16** — nothing. The real cost is that there is no
   single number to change, which is exactly what a closed vocabulary buys. **And no shape-
   congruence check can find it**, because congruence is rotation-sensitive by design: this needs a
   *parameter* census (§8, check 2b).

8. **The glyph dot stops being its own size at 20. (3) · systemic, 13 concepts.** ⌀2.5 at 24 — a
   distinct element with C19's own gap rule — becomes ⌀2 at 20 and 16, the same circle as
   `building`'s window (§2.3a). Nothing is broken; the set simply has one fewer distinction at the
   two smaller masters than at 24. **Recommendation: Maruti's eye.** The surface is a row of `info`,
   `help`, `alert-circle` beside `building`, `printer-2`, `list-bullet` at real pixels at 16 — if
   the dots should read differently, the 16 glyph dot needs its own size.

9. **The filled check reads more asymmetric than the outline check, by up to 10%. (2) · systemic.**
   `check-2`: leg ratio 3.525 outline → 3.875 filled at 24 (§3.2). This is arithmetic from the
   filled rule — the ends pull in by half the added weight, which takes proportionally more off the
   short leg — and the rule guarantees the ink box, not the proportion inside it. docs/09's pending
   ruling on **check cut weight** (`docs/09-rule-audit.md:93`) is the place for it. **Maruti's eye
   settles it**, on the eight check variants at 16, outline beside filled.

10. **`ban-3`'s note is 0.177 units wrong at 16. (1) · one-off.** The note says half-length
    "6 / 4.125 / 3.125"; measured, **5.9965 / 4.1295 / 3.3022** (§2.5). The 24 and 20 are right to
    0.004; the 16 was redrawn in the stroke-16 conversion and the prose was not. Costs nothing
    visually; costs the next person who trusts the note. Hand to card **1.16**.

11. **C27's figure number does not carry the figure. (2) · systemic, 20 concepts.** `users-2` is
    drawn with **`user`'s** head (⌀8 ink at 24, same congruence class, residual 0), not `user-2`'s
    (⌀10). `user-2`, `user-3` and `user-4` share **one** head. The head sizes group by arrangement,
    never by the figure number, and at 16 nine concepts collapse onto one ⌀5 head (§4.3). The
    Settled table says "the number names the figure and travels with the object", which reads as a
    geometric promise. **Only Maruti can say whether C27 meant geometric identity or only naming** —
    the renumbering record (doc 07, 2026-09-23) reads as naming. Either way the wording needs to
    say which. **Surface:** `lab/figures.html` already puts every figure beside its group at
    24 / 20 / 16 and real pixels — it is the right page, it just needs the head sizes printed on it.

12. **`login`'s door is `logout-3`'s, not `logout`'s. (1) · one-off, 8 concepts.** The four
    login/logout doors are shared **exactly** (residual 0) but cross-paired: `login`↔`logout-3`,
    `login-3`↔`logout`, `login-2`↔`logout-4`, `login-4`↔`logout-2` (§4.4). By C9's own logic a
    number names a shape variant, so `login-n` and `logout-n` should be the same door.
    **Recommendation:** renumber one of the two families — `queue.mjs rename` exists for exactly
    this, nothing has shipped, and C9 allows closing a gap before release. Cheap now, impossible
    later.

13. **`clipboard` and `clipboard-2` share a bounding box but not a body. (3) · one-off.** Identical
    body box at every master (14.5 × 17 at 24), two different paths inside it, 0.500 u = **0.333 px**
    apart at 24 and 0.250 u at 16 (§4.2). Neither is wrong by any rule; it is the clearest instance
    of "two drawings where the set clearly wanted one".

### Where the set is simply good

Worth saying plainly, because several primitives have **zero** drift and that is rare:

- **The container ring** — 41 outline and 40 filled concepts, one circle, residual 0, at all three
  masters, measured at the outer ink edge (§2.1).
- **The rounded square** — 26 outline concepts on one path, and its filled radius is *derived*
  (centreline + half the stroke) at all three masters: the rule professional sets use, which our
  docs never claimed (§2.2).
- **The minus is the plus's bar** — 18 of 18 comparisons identical, including both size variants,
  both containers and the filled style (§2.4).
- **C8's size step** — 3 · 2.5 · 2 holds **exactly** on `plus`, `minus` and `x`, both directions,
  all three masters (§2.4, §2.5).
- **The outline mark bend** — 143 of 196 bends at 24 sit exactly on `bendMin`, and **no bend
  anywhere in the set is below the minimum for the weight it is actually drawn at** (§2.9).
- **The chevron** — 36 concepts collapse to 9 shapes at every master in both styles; the four
  directions genuinely are one drawing turned (§2.6).
- **The arrowhead** — one head in 21 concepts at 24 outline, 20 at 20, 19 at 24 filled (§2.7).
- **The page is two drawings, both shared exactly** — a full sheet in `file`, `file-text`,
  `file-text-2`, `files-4` and a small sheet in `files`, `files-2`, `files-3`, `files-5`, fold
  notch included, residual 0 at every master (§4.2).
- **The arrow is the best-reused object in the set** — 16 of 33 classes shared by two or more
  concepts at 24, and **19 of 34 at 16**: reuse *improves* at the small master (§4.4).
- **20 and 16 are drawn masters, not resizes.** 96.2% of non-trivial parts are redrawn from 24 to
  20 and 95.0% from 24 to 16, and the few that do scale use 13 and 19 different factors (§1.4).
  The plan's open question (`plans/set-and-rules-audit.md:270-272`) is answered, and the
  three-master claim in the Settled table now has a number behind it.

---

## 7. What only Maruti's eye can settle, and where

| question | surface |
|---|---|
| Does the filled `chevron-*-2` read as the same shape as its outline, now that the cap moved the angle 5.6°? | the nine chevron shapes at 16, outline overlaid on filled — card **4.2**'s primitive sheet |
| Should the glyph dot be its own size at 20 and 16, or is ⌀2 right? | `info`, `help`, `alert-circle` beside `building`, `printer-2`, `list-bullet`, real pixels at 16 |
| Is an on-grid repeated dot (⌀2.5 at 20, ⌀2.375 at 16) the same dot? | a `more-horizontal` row at real pixels, 2.7 against 2.5 |
| Does the filled check's extra asymmetry read, or is it invisible? | the eight check variants at 16, outline beside filled |
| Does the mark in the ring still read as the same mark when it is 0.52 of the free mark at 16 against 0.70 at 24? | `plus`/`plus-circle`, `x`/`x-circle`, `check`/`check-circle` at real pixels, three masters in a row |
| Are `layout-footer`, `-2`, `-3` three icons or one icon with three fills? | the four layout families, filled, at 16 — card **4.2** |

---

## 8. Handover — what this card measured but does not own

| finding | belongs to |
|---|---|
| Container-ring canvas share 83.3% → 80.0% → 87.5%, non-monotonic | **1.4** scaling (F6), and docs/09's container-radius ruling |
| Mark-to-free-mark ratio 0.700 → 0.593 → 0.542 (plus), 0.692 → 0.542 → 0.524 (x) | **1.4** — docs/08 §6.1's 13% drift, measured |
| Radius census, nested radii, the 217 subpaths at 24 with more than one corner radius | **1.2** corners |
| Chevron leg angles 45° → 45.5° and the three-angles-at-16 split | **1.3** angles |
| `ban`'s slash ending on the ring centreline; the ring/slash overlap | **1.7** air and contact (F9 — no rule exists) |
| `more-horizontal`'s declared 0.9-of-the-dot gap at 16, in prose not a note | **1.7**, **1.13** exceptions ledger |
| 8 filled files byte-identical to their outline twin at 24 and 20 | **1.8** filled style |
| The empty modifier-zone census (no badge icons exist) | **1.9** modifier grammar |
| `bendMin`'s missing third case in `CLAUDE.md` and `tools/masters.mjs:26–27` | **1.16** stale statements |
| `ban-3`'s stale half-length note; `x`'s "about 1.5 inside the plus box" (measured 2.0 at 24) | **1.16** |
| C9 has no name for the filled-style variant; C17's general statement is false | **1.14** rule register, **1.15** stated vs enforced |
| `lint.mjs:216`'s comment escape hiding the off-grid dot radii | **3.5** severity proposal (already recorded) |
| Retire `language-2` / `language-3` in favour of tags | **5.2** decision agenda, with doc 06's D23 merges |
| "Is 20 a master or a scale?" — answered: a master, 96.2% of non-trivial parts redrawn (§1.4) | **3.1** judging standard; closes the plan's own open question |
| C27's wording promises geometric identity the figures do not have (§4.3) | **1.10** families, **1.14** rule register; the ruling itself belongs on **5.2** |
| `login` / `logout` door numbering is cross-paired (§4.4) | **1.10** families; `queue.mjs rename` is the tool |
| `clipboard` / `clipboard-2` same box, different body (§4.2) | **1.13** exceptions ledger |
| `folder`'s 16 tab lengths off the eighth grid (5.677, 2.927) where 24 and 20 are on the quarter grid (§4.1) | **1.6** pixel grid |

**New checks this card proposes for the primitive-drift linter (`CLAUDE.md` open item 5), in order
of value:**

1. **Shared-part persistence.** Two files that share a subpath exactly at one master must share it
   at all three. Error. Today it catches exactly the three `checkbox`/`check-circle` pairs at 16.
2. **Within-family near miss, by shape.** Two subpaths in concepts with the same stem, congruent
   within 0.05 units but not identical. Warning, naming both files and the residual in px@16.
   Measured today: **4 pairs** — `package-2`/`package-3` at 20 (0.040 u) and at 16 (0.025 u),
   `users-3-behind`/`users-3-level` at 16 (0.013 u), `arrow-up-right-5`/`arrow-up-right-4` filled
   at 16 (0.030 u). Widen the band to 2% of canvas and it is 259 pairs across the six buckets, of
   which 40 at 16 outline are listed in §5.
2b. **Within-family near miss, by parameter.** Same part type (circle, line, bend), same family,
   with a radius / length / leg / turn within 0.05 and not equal. Warning. This is the check that
   catches `rotate-ccw`'s 4.250 / 4.257 / 3.507 arrowheads and the arrowhead's 5.261 / 5.250 split
   — neither of which any congruence check can see, because they are the same shape at a different
   rotation. It needs a part classifier on top of `congruence.mjs`.
3. **Primitive-set membership.** A full circle whose radius is within 0.125 of a radius used
   elsewhere at that master but not equal to it. Warning. This is the "r 8.5 where every other
   circle is r 9" check `CLAUDE.md` open item 5 describes.
4. **Off-grid radius.** An arc radius off its master's grid, as an error a comment cannot silence.
   Today 80 files, 6 concepts, all the same dot.

**A note on comparing masters with these instruments.** `classify`'s `near` and `tol` are in
drawing units, which are not comparable between masters. Any cross-master count must scale the band
by `master / 24` (§5) or it over-reports the smaller master by exactly that factor. Worth a line in
`congruence.mjs`'s header for the next card that uses it.
