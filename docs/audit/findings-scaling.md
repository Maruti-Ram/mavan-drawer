# Findings — scaling 24 → 20 → 16 (F6)

Card 1.4 of `plans/set-and-rules-audit.md`. **Pinned to `5933041`: 485 concepts × 3 masters ×
2 styles = 2,910 files.** Lint at the end of this card: **2,910 drawings · 2,848 clean · 62 warned ·
0 failed** — identical to the baseline; nothing was changed.

Instruments: `tools/audit/{congruence,radii,angles,mass}.mjs` (wave 0), `tools/geometry.mjs`,
`tools/masters.mjs`. Ink boxes use lint's own definition (`tools/lint.mjs:306-316`: a stroked
centreline grown by half its weight, a filled area as drawn), so every box below is the number lint
prints. Ink area is `mass.density` at rate 32. Angles are `anglesOf` at tolerance 0.5°. Nothing
re-derives `docs/08 §6.1` or §8; where a finding is already on an agenda it says so and moves on.

---

## 1. The answer, in one page

**What is held from 24 to 16, over all 485 concepts:**

| Held | Population | §|
|---|---|---|
| Its keyline, exactly | **280 of 287** keyline-held concepts sit on their own keyline to within 0.005; 95.5% of all keyline-held drawings are exact at every master | 3 |
| The detail count | **453 of 485** outline concepts keep the same subpath count; 30 shed, 2 gain | 6 |
| The aspect ratio | **282 of 485** hold w/h within 2% | 10 |
| The radius tier | **89 of 89** concepts at container radius 2.5 go 2 at 20 and 1.5 at 16. No exceptions | 7 |
| The outline↔filled pair | **481 of 485** concepts have identical progressions in both styles | 9 |

**What gives:**

| Gives | How much | §|
|---|---|---|
| **The share of the canvas** | **0 of 485** concepts hold it within 2%. 1 within 5%. 117 spread more than 10% | 2 |
| The proportion between two keylines | a square icon beside a circle icon reads 0.900 : 1 at 24, 0.875 at 20, **0.857 at 16** — a 5.0% swing | 2 |
| The mark inside its container | mean **−4.7%** 24→16 over 121 container concepts; worst −25.9% (`map-pin`) | 4 |
| A mark's share of its canvas | median **+15.0%** 24→16 over 136 mark concepts; worst +27.3% (`x-small`) | 5 |
| The angle of an intended 45° leg | mean deviation 0.011° at 24 → **0.034° at 16**, and 87 fewer legs stay inside half a degree | 8 |
| The apparent darkness | ink per unit of canvas rises **+23.6%** median from 24 to 16 (outline) | 6 |

**The policy the drawings actually follow:** *hold the keyline, the detail and the corner tier; let
the share of the canvas, the mark-to-container proportion and the angle give.* Nobody wrote that
down. It is what 485 concepts do.

**The sting:** the first lines of those two tables cannot both be satisfied. The keyline table is
not proportional, so **holding your keyline makes holding your share of the canvas impossible.**
That is why the score is 280 of 287 on one and 0 of 485 on the other. The drift `docs/08 §6.1` asks
about is not drift. It is the specification.

---

## 2. The root cause: the margin, and therefore the keyline table

`tools/masters.mjs:32,37,42` — the drawing bound is `[2, 22]` at 24, `[2, 18]` at 20, `[1, 15]` at
16. The margin is **2 · 2 · 1**, absolute at each master, decided as such in C6
(`docs/07-character.md:46`) and `docs/01-foundations.md:101-102` ("16 keeps only one unit of margin,
because small icons have to fill more of their box to read at all").

As a share of the canvas:

| | 24 | 20 | 16 |
|---|---|---|---|
| margin, units | 2 | 2 | 1 |
| margin ÷ canvas | 8.33% | **10.00%** | **6.25%** |
| drawing bound ÷ canvas | 83.3% | **80.0%** | **87.5%** |

The 20 master gives away the most of its square and the 16 master the least. Everything else
follows from that one line. Against a straight proportional reduction:

| Keyline | 24 | 20 | 16 | 24→20 | vs prop. | 24→16 | vs prop. | 20→16 | vs prop. |
|---|---|---|---|---|---|---|---|---|---|
| Circle | ⌀20 | ⌀16 | ⌀14 | 0.800 | **−4.0%** | 0.700 | **+5.0%** | 0.875 | **+9.4%** |
| Square | 18 | 14 | 12 | 0.778 | **−6.7%** | 0.667 | **0.0%** | 0.857 | +7.1% |
| Portrait | 16×20 | 12×16 | 10×14 | w .750 / h .800 | w −10.0 / h −4.0 | w .625 / h .700 | w −6.3 / h +5.0 | w .833 / h .875 | +4.2 / +9.4 |
| Landscape | 20×16 | 16×12 | 14×10 | mirror of portrait | | | | | |
| Mark ceiling | 18 | 14 | 12 | 0.778 | −6.7% | 0.667 | 0.0% | 0.857 | +7.1% |

**There are two curves in that table, not one.** As the largest ink dimension over the canvas:

- circle · portrait · landscape · diagonal: **0.833 → 0.800 → 0.875** = **−4.0% then +5.0%**
- square · mark ceiling: **0.750 → 0.700 → 0.750** = **−6.7% then 0.0%**

And the drawings follow their own keyline's curve to the decimal: of 287 keyline-held outline
concepts, **280 sit on their own curve** within 1 percentage point. The other 7 spend part of
lint's ±0.5 slack — `map-pin`, `map-pin-2` (portrait, −7.0%/+1.3%), `megaphone`, `pin-4`, `pin-5`,
`pin-6` (square), `puzzle-5` (circle).

The consequence is set-level. **The relative size of a square icon and a circle icon changes
between masters:**

| | 24 | 20 | 16 |
|---|---|---|---|
| square : circle | 18:20 = **0.900** | 14:16 = **0.875** | 12:14 = **0.857** |

123 concepts are held to the square and 78 to the circle. At 24 a square icon is 10% smaller than a
circle icon; at 16 it is 14.3% smaller. **A 5.0% swing in the proportion between the set's two
commonest shapes, for which no drawing is responsible.**

Trajectory shape of the share of canvas, all 485 outline concepts:

| Shape | n |
|---|---|
| dips at 20, rises at 16 | 211 |
| dips at 20, back to 24's share at 16 | 152 |
| rises at both | 111 |
| falls | 10 |
| flat at 20, rises at 16 | 1 |
| **flat at all three** | **0** |

Median share change by régime:

| Régime | n | 24→20 | 24→16 |
|---|---|---|---|
| `keyline` | 287 | **−3.96%** | **+5.04%** |
| `box:` | 57 | −3.96% | +5.04% |
| `anchor:` | 5 | −3.96% | +5.04% |
| `keyline: mark` | 136 | **+3.22%** | **+15.04%** |

---

## 3. Is 20 a master or a scale?

**A master. The number is 1.6%.**

Every concept and style compared whole-drawing against the same drawing at another master, up to
translation and uniform scale (`congruence.congruentUpToScale`, trivial circle/line matches
stripped):

| | 24→20 | 24→16 | 20→16 |
|---|---|---|---|
| The whole drawing is the other resized (residual ≤ 0.005, non-trivial) | **16 of 970 — 1.6%** | 17 — 1.8% | 17 — 1.8% |
| Within a twentieth of a unit (residual ≤ 0.05) | 24 — 2.5% | 52 — 5.4% | 53 — 5.5% |
| Different path count | 16 | 36 | 23 |
| Structurally incomparable at all | 110 | 152 | 124 |
| Median residual, in units of the source canvas | **0.482** | 0.621 | 0.338 |

A median residual of 0.48 units at 24→20 is a third of a stroke width. Three further facts make it
structural rather than statistical:

1. **The grid forbids a mechanical scale.** Of the 57,126 coordinates in the 24 outline masters,
   only **33.5%** land on the 20 master's quarter grid when multiplied by 0.8333, and **47.1%** on
   the 16 master's eighth grid at 0.6667. A mechanical reduction would put two thirds of the 20
   master off its own grid (`docs/01-foundations.md §3`).
2. **The ink box is not scaled either.** Median w ratio 24→20 **0.800** against nominal 0.8333;
   24→16 **0.700** against 0.6667; 20→16 **0.868** against 0.800 — the keyline table's numbers, not
   the canvas ratio's.
3. **The 16 exact matches are exact for a reason that is not scaling.** `ban`, `ban-2`,
   `chart-pie-3` take factor **0.784** = 14.5 ÷ 18.5, the ratio of the circle keyline's *centreline*
   diameters (20−1.5 at 24, 16−1.5 at 20). The rest are the `plus` / `minus` / `x` size families at
   factors 0.878 to **1.000**. `x-small-filled` is the limiting case: `M8.25 8.25l7.5 7.5` at 24 and
   `M6.25 6.25l7.5 7.5` at 20 — **the same drawing, moved two units.**

Among the drawings that genuinely are one shape at two sizes (residual ≤ 0.125), the fitted factor
runs median **0.863** at 24→20 (nominal 0.833), **0.765** at 24→16 (0.667) and **0.879** at 20→16
(0.800) — every step larger than proportional, consistent with §2.

**A correction to reconnaissance.** Wave 0 read the shared container ring as 0.784 at 24→20 (6%
smaller than proportional) and 0.689 at 24→16 (3.4% bigger), and called the direction reversed.
Both numbers are right and both are *centreline* diameters of the circle keyline: 14.5/18.5 =
0.7838 and 12.75/18.5 = 0.6892, with the 16 figure carrying the 1.25 stroke. On ink — the quantity
the rules are written in — the ring runs 0.800 and 0.700, i.e. −4.0% and +5.0%. **The reversal is
real, but it is the keyline table's, not the ring's,** and it is one of two curves (§2), not one.

---

## 4. The mark inside its container — `docs/08 §6.1` re-measured at 485

**Definition.** A true container: the first stroked path's ink box spans ≥60% of the file's ink box
on both axes (the `radii.mjs` `bigFrac` threshold) and the remaining paths' ink box sits inside it.
**121 of 485 concepts** qualify at all three masters — not "every container icon" (`docs/08:254`).
Lint's cruder test (`lint.mjs:345-348`: first path is the container, no containment check) accepts
319 and returns ratios above 1 for things like `users-3-level` (2.5), so it is not a measure of
this.

**docs/08's six, with its own measure (mark ink width ÷ container ink diameter):**

| icon | 24 | 20 | 16 | measured now | in docs/08 |
|---|---|---|---|---|---|
| `plus-circle` | 0.525 | 0.500 | 0.464 | **−11.6%** | −13% |
| `minus-circle` | 0.525 | 0.500 | 0.464 | **−11.6%** | −13% |
| `x-circle` | 0.450 | 0.406 | 0.393 | **−12.7%** | −13% |
| `check-circle` | 0.514 | 0.488 | 0.470 | **−8.6%** | −8% |
| `info` (height) | 0.575 | 0.563 | 0.536 | **−6.8%** | −5% |
| `help` (height) | 0.600 | 0.625 | 0.571 | **−4.8%** | −5% |

§6.1's numbers reproduce. Its generality does not:

| 24→16 drift band | concepts | share |
|---|---|---|
| worse than −15% | 13 | 10.7% |
| −15% to −8% | 24 | 19.8% |
| −8% to −3% | 21 | 17.4% |
| **−3% to +3% (held)** | **51** | **42.1%** |
| +3% to +8% | 5 | 4.1% |
| +8% to +15% | 7 | 5.8% |

Mean **−4.7%**, median **−0.9%**. Monotonic shrink 48, monotonic growth 7, held within 3% 51. The
drift is a **tail, not a trend** — and `docs/08`'s six were the worst-affected family in the set.

**The mechanism §6.1 does not name: the inset is drawn near-absolute.** Over the 66 container
concepts with a non-zero inset at all three masters:

| | 24 | 20 | 16 |
|---|---|---|---|
| inset, units (median) | 4.00 | 3.25 | 3.00 |
| inset ÷ canvas (median) | 0.167 | 0.163 | **0.188** |
| inset ratio from 24 (median) | — | 0.824 (prop. 0.833) | **0.760 (prop. 0.667)** |
| vs proportional (median) | — | −1.2% | **+14.0%** |

At 16 the inset is 14% more than proportional (mean +15.7%): the container shrinks on the keyline,
the inset does not shrink with it, and the mark pays the difference. `plus-circle` is the clean
arithmetic — container 20 / 16 / 14, inset 4.75 / 4.00 / 3.75 where proportion asks 3.96 / 3.17,
mark 10.5 / 8.0 / 6.5 where proportion asks 8.75 / 7.0.

**And there is no policy.** Of the 66: **10 hold the inset absolutely** (ratio 1 ±8% — the four
`alert-triangle`s, `camera-5`, `camera-6`, `folder-3`, `pencil`, `pencil-2`, `pencil-3`), **12 hold
it proportionally** (`ban`, `ban-2`, `camera-3`, `camera-4`, the four `checkbox`es, `face-neutral`,
`face-smile`, `gear-2`, `target`), **39 sit between**, 5 outside both. Each was picked by eye for
its own drawing, which is C18 working as written.

`MIN_GAP` is not the cause: the median inset at 16 is 3.0 units, twice the floor. This is taste,
not clearance.

---

## 5. The marks are a separate system, pointing the other way

136 concepts declare `keyline: mark`. Median share of canvas rises **+3.22%** at 20 and **+15.04%**
at 16, against the keyline population's −3.96% then +5.04%.

The cause is C8 (`docs/07-character.md:48`): the step is **3 · 2.5 · 2** units, absolute per master,
on a base picked per master. `plus` ships at 15 / 13.5 / 12 units of ink — shares 0.625 / 0.675 /
**0.750**. At 16 the default `plus` is exactly the mark ceiling (12) and `plus-large` at 14 is
exactly the drawing bound; at 24 the three sizes are 12 / 15 / 18 inside a 20-unit bound with room
to spare.

| name | 24 | 20 | 16 | share 24→16 |
|---|---|---|---|---|
| `plus-large` | 18 | 16 | 14 | **+16.7%** |
| `plus` | 15 | 13.5 | 12 | **+20.0%** |
| `plus-small` | 12 | 11 | 10 | **+25.0%** |
| `x-small` | 10 | 9.5 | 8.5 | **+27.3%** |

The smaller the variant the more it grows, so C8's three sizes converge as the master shrinks:
`plus-small` is 67% of `plus-large` at 24 and 71% at 16. Lint verifies the step — **102 of 120
size-step comparisons are exact to 0.005**, and the 18 that are not are the six `*-circle-small`
container families C18 exempts by design — and nothing verifies the base.

**Eight marks go the other way**, against 128 that rise: `play-3` **−15.6%**, `play` and `play-2`
**−8.3%**, `rotate-ccw`/`-2`/`-3` −4.3%, `rotate-ccw-4` −2.1%, `list-bullet` −0.3%. `play`'s own
file comment records the ink as "16x18 · 12x13 · 10x11" and the point angle as "60.8° · 58.7° ·
59.7°": it held the *angle* and let the box give, where the rest of the set holds the box. `play` at
20 is 75% × 72% of its 24 drawing against a nominal 83%. The largest contrary case in the set.

---

## 6. Detail budget, and apparent darkness

**Detail.** 453 of 485 outline concepts keep their subpath count. 30 shed, always monotonically,
and most of the loss falls between 24 and 20:

`book-4` 3/3/2 · `building` 11/6/6 · `building-2` 8/6/4 · `building-3` 13/6/6 · `building-4`
13/6/6 · `chart-bar-3` 4/4/3 · `chart-bar-5` 4/4/3 · `compass` 3/3/2 · `compass-3` 3/3/2 ·
`database` 4/3/3 · `database-3` 4/3/3 · `file-text` 4/4/3 · `file-text-2` 5/4/4 · `files-5` 5/4/3 ·
`gear-3` 19/16/13 · `images` 4/3/3 · `images-2` 4/3/3 · `images-3` 4/3/3 · `images-4` 4/4/3 ·
`keyboard` 7/6/6 · `keyboard-2` 8/7/7 · `microphone` 4/4/3 · `sliders-2` 9/9/6 · `sliders-3` 9/9/6 ·
`trash` 5/5/4 · `trash-5` 5/5/4 · `users-4-behind` 4/4/3 · `wallet-2` 3/2/2 · `watch` 4/4/3 ·
`watch-3` 4/4/3.

**Two gain**, both at 16, both with the path count unchanged — a path splits into one more subpath:
`wand` 5/5/6 (3 paths throughout) and `wand-2` 5/5/6 (2 paths throughout). Confirms wave 0.

Set totals: 1,409 → 1,375 → 1,352 outline subpaths; 6,874 → 6,752 → 6,713 path commands. **The
detail budget falls 4.0% from 24 to 16 while the ink box grows 5%.** Median subpaths is 3 at every
master; the maximum falls 19 → 16 → 13 (`gear-3`). Filled: 1,419 → 1,387 → 1,363, 33 shedders.

**Darkness.** True ink area over canvas² (`mass.density`, rate 32):

| | 24 | 20 | 16 |
|---|---|---|---|
| outline, median | 0.1585 | 0.1719 | **0.1908** |
| outline, mean | 0.1531 | 0.1675 | 0.1882 |
| filled, median | 0.2969 | 0.2579 | 0.2944 |

Median ratio, outline: 24→20 **1.096**, 24→16 **1.236**, 20→16 **1.129**. The 16 outline carries a
quarter more ink per unit of canvas than the 24.

Most of that is the stroke spec, which is fixed. Stroke ÷ canvas is 0.0625 / 0.0750 / 0.0781,
ratios 1.200 / 1.250 / 1.042. Dividing it out leaves the *geometric* contribution: **0.913 / 0.989
/ 1.084** — path length per unit of canvas falls 8.7% at 20 and returns to parity at 16. So the 16
master's extra darkness is C7 (settled) and the 20 master's lightness is the keyline table (§2).
Whether it reads as one weight is card 1.5 (F1); the number is here because this axis produced it.

---

## 7. Radii — the one tier table that is obeyed, and the three laws inside it

Measured corner radii (`radii.mjs`, centreline for stroked paths), commonest values by role:

| role | 24 | 20 | 16 |
|---|---|---|---|
| container | **2.5** ×360 · 3.25 ×260 · 1.5 ×180 | **2** ×430 · 2.75 ×242 · 1.25 ×94 | **1.5** ×333 · 2.125 ×232 · 1 ×104 |
| bend | **0.75** ×157 · 1.25 ×73 | **0.75** ×157 · 1 ×73 | **0.625** ×160 · 1 ×111 |
| detail | 0.75 ×281 · **1.5** ×213 · 0.5 ×137 | 0.75 ×259 · **2** ×225 · 0.5 ×204 | 0.625 ×240 · **1.5** ×188 · 1 ×161 |

(The 3.25 / 2.75 / 2.125 rows are filled files' outer contours — 2.5 + 0.75, 2 + 0.75, 1.5 + 0.625
— exactly C23's stated relation.)

**Perfect obedience.** Of the 150 concepts with a container-role radius at all three masters the
commonest triple is `2.5 / 2 / 1.5` with 89 members, and **all 89 concepts whose 24 radius is 2.5
go to 2 then 1.5. Zero exceptions.** Median ratios 0.800 / 0.600 / 0.750.

But the three tiers obey **three different laws**:

| tier | 24 | 20 | 16 | 24→20 | 24→16 | behaviour |
|---|---|---|---|---|---|---|
| container | 2.5 | 2 | 1.5 | 0.800 | **0.600** | **tighter than proportional** (−4.0%, −10.0%) |
| detail | 1.5 | 1.25 | 1 | 0.833 | **0.667** | exactly proportional |
| bend | 0.75 | 0.75 | 0.625 | 1.000 | 0.833 | **looser** — follows the stroke, by C10 |

The bend tier is derived from the stroke (`bendMin = weight / 2`) and is fixed with it. The detail
tier is proportional. **Only the container tier is a free choice, and it is the one that is not
proportional:** at 16 the corner is 10% tighter relative to its canvas than at 24, while the ink box
is 5% wider. The 16 drawing is bigger *and* squarer — plausibly right for 16px, and undecided.
Feeds the open container-radius ruling (`docs/09-rule-audit.md` §6); card 1.2 owns the census.

---

## 8. Angles — what the eighth grid costs, and where

Only the segments *intended* to be on 0/45/90 (deviation ≤ 0.5°), so the deliberate off-grid angles
do not swamp the measure:

| | on-grid segments | mean deviation | of which 45°: n | 45° mean deviation |
|---|---|---|---|---|
| outline 24 | 2,175 | 0.0024° | 474 | 0.011° |
| outline 20 | 2,157 | 0.0025° | 470 | 0.011° |
| **outline 16** | **2,077** | **0.0064°** | **387** | **0.034°** |
| filled 24 | 2,720 | 0.0036° | 571 | 0.017° |
| filled 20 | 2,671 | 0.0030° | 564 | 0.014° |
| filled 16 | 2,678 | **0.0020°** | 574 | **0.009°** |

1. **The tax is 2.7× on the mean, 3.1× on the 45s, and it moves legs out of the bucket entirely:**
   474 intended-45° legs at 24 against **387 at 16** — 87 fewer, because they now miss by more than
   half a degree. Set-wide, outline segments beyond 0.5° run 381 at 24 (14.9%), 377 at 20 (14.9%),
   **458 at 16 (18.1%)**.
2. **It belongs to the 1.25 stroke, not to the 16 canvas.** The filled files at 16 are drawn at
   weight 2, so their half-stroke is a whole unit and they stay on quarter-compatible values — and
   their on-grid mean deviation at 16 (0.0020°) is the **lowest of all six cells**, below 24's own.
   Same canvas, same grid rule, opposite result. The variable is the weight.

A cost already decided and paid: `plans/stroke-16.md` records the conversion and the largest shift
(1.87° on `check-circle-small`), and C10 states that at 16 "the ink box is still held exactly and
the leg angle gives instead". Recorded here to size it, not to reopen it. The biggest growths 24→16
are drawings whose angles were never on the grid — `lightbulb` 8.13° → 19.23°, `lightbulb-3`/`-4`
11.59° → 22.12°, `map-pin` 6.75° → 13.85°, `sparkle-4` 15.95° → 20.56° — which card 1.3 owns.

---

## 9. The filled style inherits the policy and decides nothing

**481 of 485 concepts have an identical 24→16 share progression in both styles.** Four differ, all
C17 repeated elements with a declared `grows:` note:

| concept | outline | filled | outline Δ24→16 | filled Δ24→16 |
|---|---|---|---|---|
| `grid-3` | 15×15 / 13.5×13.5 / 11.5×11.5 | 16×16 / 14×14 / 12×12 | +15.0% | +12.4% |
| `grid-4` | 15×15 / 13.5×13.5 / 11.5×11.5 | 16×16 / 14×14 / 12×12 | +15.0% | +12.4% |
| `more-horizontal` | 15×3 / 13.5×2.7 / 11.5×2.4 | 16×4 / 14×3.2 / 12×2.9 | +15.0% | +12.4% |
| `more-vertical` | 3×15 / 2.7×13.5 / 2.4×11.5 | 4×16 / 3.2×14 / 2.9×12 | +15.0% | +12.4% |

"Filled outer edge = outline outer edge" transmits the entire scaling policy to the second style for
free. It is the strongest cross-master constraint in the system and the only one lint treats as an
error rather than a warning.

---

## 10. The classes, with populations

Each of the 485 outline concepts by **which quantity its 24→20→16 progression holds** — keyline
(same named keyline at all three, **K**), aspect within 2% (**A**), detail count (**D**),
mark/container within 3% (**M**). Share of canvas is not in the key because **no concept holds it**.

| Class | Holds | n | What it is |
|---|---|---|---|
| **1. Keyline-locked, whole** | K A D | **155** | the backbone: on its keyline, proportion and parts held, inherits that keyline's non-proportional curve |
| **2. Keyline-locked, mark held too** | K A D M | **29** | class 1 plus the mark-to-container ratio within 3% |
| **3. Keyline-locked, mark drifts** | K D | **77** | keyline and detail held; the inner mark gives |
| **4. Free mark** | D | **112** | `keyline: mark` and `box:` drawings keeping their parts and nothing else — the C8 population, share +15% median |
| **5. Proportion-first** | A D | **80** | not on a keyline; aspect and parts held |
| **6. Keyline-locked, detail sheds** | K A / K | **26** | `building`, `gear-3`, `sliders-2`, `trash` — the keyline holds and the detail is spent |
| **7. Aspect only** | A | **3** | holds its proportion and nothing else |
| **8. Nothing measurable** | — | **3** | `keyboard`, `keyboard-2`, `watch` — `box:`, aspect drifts 19–22%, detail sheds; they still track the bound curve |

Raw `holds` tally: `KAD` 184 · `D` 112 · `AD` 80 · `KD` 77 · `KA` 15 · `K` 11 · `A` 3 · nothing 3.
(Classes 1/2 merge M in and class 6 splits out of KAD/KA, so the two tallies differ by
construction.)

**The régimes are stable.** Exactly **one** concept changes régime between masters: `microphone-5`,
`box: 14x18` at 24 only, keyline-held at 20 and 16 — already on record in
`plans/set-and-rules-audit.md`. Twenty-eight concepts change which keyline their ink box
*coincidentally* matches, but all 28 are `mark` or `box` drawings lint never holds to a keyline.

### Where a concept is inconsistent with its own family

113 families have two or more members. The 24→16 share change agrees within 1 percentage point in
**79**, within 3pp in **81**, differs by more than 5pp in **27** and by more than 10pp in **5**.
Seventeen families contain more than one régime. The worst:

| family | spread | the split |
|---|---|---|
| `filter` | **20.0pp** | `filter`, `-3`, `-4` on the square keyline at 18/14/12 (0.0%); **`filter-2`** a mark at 15×10.5 / 13.5×10.5 / 12×10.25 (+20.0%) |
| `text` | **20.0pp** | `text`, `text-3` at 0.0%; **`text-2`, `text-4`** at +20.0% — all four `keyline: mark` |
| `grid` | **15.0pp** | five grids on the square keyline (0.0%); **`grid-3`, `grid-4`** marks at 15/13.5/11.5 (+15.0%) |
| `map-pin` | **12.4pp** | `map-pin-4` `box:` (−7.3%); `map-pin`, `-2` portrait on the ±0.5 slack (+1.3%); `map-pin-3`, `-5` circle (+5.0%) |
| `x` | 10.2pp | C8's step: `x-large` +17.1%, `x` +21.0%, `x-small` +27.3% |
| `play` | 7.3pp | `play-3` −15.6% against `play`, `play-2` −8.3% — and the family against the other 128 marks at +15% |

`filter`, `text` and `grid` are the pointed ones: inside one numbered family, one member is drawn 12
of 16 units wide at the 16 master and its sibling 11.5, one on a keyline and the other on the mark
ceiling. Numbered variants are meant to differ in *shape* (C5/C9), not in how much canvas they
occupy.

### `box:` — the escape hatch drifts worse than what it escapes

`docs/01-foundations.md:127-130` records why `box:` exists: the landscape keyline "went 1.25 → 1.33
→ 1.4 wide-to-tall as the masters shrank and the folder read squashed at 20 and 16". That is a 12.0%
aspect drift in the table, and it is real — portrait runs 0.800 / 0.750 / 0.714, landscape 1.250 /
1.333 / 1.400.

Of the 56 concepts declaring `box:` at all three masters, **only 7 hold their aspect within 2%**.
Median spread 5.0%. **Nine drift more than the 12% they were written to escape:**

| concept | boxes | aspect | spread |
|---|---|---|---|
| `attachment-2` | 11×20 / 10.5×16 / 10.25×14 | 0.550 / 0.656 / 0.732 | **33.1%** |
| `attachment` | 11×20 / 10×16 / 10×14 | 0.550 / 0.625 / 0.714 | **29.9%** |
| `watch` | 14×20 / 10×16 / 8×14 | 0.700 / 0.625 / 0.571 | **22.5%** |
| `keyboard` | 20×12 / 16×11 / 14×10 | 1.667 / 1.455 / 1.400 | 19.0% |
| `link-3` | 20×12 / 16×10 / 14×10 | 1.667 / 1.600 / 1.400 | 19.0% |
| `key-5` | 20×10 / 16×8 / 14×6 | 2.000 / 2.000 / 2.333 | 16.7% |
| `key-6` | 10×20 / 8×16 / 6×14 | 0.500 / 0.500 / 0.429 | 16.7% |
| `watch-2` | 15×20 / 11×16 / 9×14 | 0.750 / 0.688 / 0.643 | 16.7% |
| `key` | 20×10 / 16×8 / 14×8 | 2.000 / 2.000 / 1.750 | 14.3% |

---

## 11. The judged list

Three kinds kept apart. Every number from a run in this card.

### Kind 2 — a rule disagrees with another rule, or with the docs

**S1 · systemic · the keyline table makes one apparent size impossible across masters.**
The margin is 2 · 2 · 1 (C6), so the drawing bound is 83.3% / 80.0% / 87.5% of its canvas, and the
circle and square keylines run on two different curves (−4.0%/+5.0% and −6.7%/0.0%). **0 of 485
concepts hold their share of the canvas within 2%** and 280 of 287 keyline-held concepts hold their
keyline exactly — the two are mutually exclusive. The visible cost: square : circle reads 0.900 at
24, 0.875 at 20, **0.857 at 16**, a 5.0% swing across 123 and 78 concepts. This is F2 as much as
F6. Nothing in lint reads two masters of one icon, so it has never been visible. **This is the
finding on this card.** No drawing is at fault — every drawing is obedient. It is one line of
`tools/masters.mjs`, and it costs two thirds of a pixel at 16 and a whole pixel at 20 for a
square-keyline icon.

**S2 · systemic · C6 still calls the 20 and 16 keylines "proposals".**
`docs/07-character.md:46` — "The 20 and 16 keylines are proposals until the first icons are
approved"; `docs/01-foundations.md:102` repeats it. 485 concepts are approved and 2,910 drawings are
drawn to them. The flag is stale and the table is load-bearing for every number in §2. Card 1.16
owns the edit; it is named here because the flag sits on the exact table this card judges.

**S3 · systemic · the radius tier table contains three scaling laws and only one is a choice.**
Container 2.5/2/1.5 is 10% tighter than proportional at 16; detail 1.5/1.25/1 is exactly
proportional; bend 0.75/0.75/0.625 follows the stroke by C10. Obedience is total (89 of 89), so
this is the rule's shape, not the drawings'. Feeds the open container-radius ruling,
`docs/09-rule-audit.md` §6.

**S4 · systemic · C8's absolute step makes marks grow into the small masters.**
Step 3 · 2.5 · 2 on a per-master base gives the 136 mark concepts a median **+15.0%** share gain
from 24 to 16, worst +27.3%, against the keyline population's +5.0%. At 16 the default `plus` fills
the mark ceiling exactly and `plus-large` fills the drawing bound. Lint verifies the step (102 of
120 exact; the 18 others are C18 containers) and nothing verifies the base. The three sizes also
converge, 67% → 71%.

**S5 · systemic · `box:` drifts worse than the keyline it escapes, because it has no rule.**
`docs/01:127-130` justifies `box:` by a 12% keyline aspect drift; 9 of 56 `box:` concepts drift more
than that, to 33.1% (`attachment-2`), and only 7 hold within 2%. `docs/09-rule-audit.md` §4 already
lists "mark share of container 24→16" as a missing rule; this is its sibling and is not on that
list.

### Kind 1 — a drawing disagrees with a stated rule

**D1 · one-off · `microphone-5` declares `box:` at one master only.** `box: 14x18` at 24,
keyline-held at 20 and 16; its own prose says "14 · 12 · 10 wide". The only régime change in the
set. Already noted in `plans/set-and-rules-audit.md`; confirmed unique here.

**D2 · one-off · `map-pin` and `map-pin-2` spend lint's whole ±0.5 keyline slack at both small
masters.** 16×20 / 12×**15.5** / 10×**13.5** against portrait 16×20 / 12×16 / 10×14. They pass, and
that half unit is what makes their mark/container ratio the worst in the set (−25.9%). Only 7 of 287
keyline-held concepts use the slack at all; 95.5% are exact. **The ±0.5 tolerance is behaving as an
undeclared `box:`.** Either the drawing is right and should say so with a note, or it should sit on
the keyline.

*No drawing breaks a stated cross-master rule, because there is no stated cross-master rule.*
`tools/lint.mjs` never compares two masters of one icon, so every number in this document is
unchecked by anything in the build.

### Kind 3 — fine by every rule and possibly still wrong

**E1 · one-off · the `play` family runs against its whole population.** `play-3` **−15.6%**,
`play`/`play-2` **−8.3%** share from 24 to 16, against +15.0% median for the other 128 marks. Ink
16×18 / 12×13 / 10×11 — the 20 drawing is 75% × 72% of the 24 where nominal is 83%. Its file comment
shows why: it held the point angle (60.8° / 58.7° / 59.7°) and let the box give. Every rule is
satisfied. In a 16px row beside `chevron-right` (+12.5%) and `arrow-right` (+20.0%), a play triangle
does the opposite of the neighbours it exists to sit next to.

**E2 · systemic · the 16 master is a quarter darker per unit of canvas.** Outline ink ÷ canvas²
median 0.159 / 0.172 / **0.191**; ratio 24→16 **1.236**. Decomposed, the stroke contributes 1.25 and
the geometry 0.989 — C7 (settled) plus §2's +5%, not a drawing fault. Card 1.5 (F1) judges it; any
change to §2 moves it.

**E3 · one-off · `filter-2`, `text-2`, `text-4`, `grid-3`, `grid-4` occupy a different amount of
canvas from their own siblings.** 15–20 percentage points of share change apart inside one numbered
family, one member on a keyline and the other on the mark ceiling.

**E4 · one-off · `keyboard`, `keyboard-2`, `watch` hold nothing measurable.** `box:` régime, aspect
drifting 19.0 / 19.0 / 22.5%, detail shedding (7/6/6, 8/7/7, 4/4/3). They track the bound curve and
break no rule. Three drawings re-proportioned by eye at each master.

---

## 12. What only Maruti's eye can settle, and the surface that would settle it

| Question | Why no tool can settle it | The surface |
|---|---|---|
| **Should an icon hold its share of the canvas, or its keyline?** (S1) | Both are defensible; it is a judgement about what "the same size" means at three masters | **The wall** (card 4.1) at real 16px, a square-keyline icon next to a circle-keyline icon, and the same pair stacked at 20 and 24. Add a toggle that redraws the 20 master at a 1.5 margin so the two curves can be compared by eye |
| **Is the 16 master's +5% and the 20 master's −4% right, or is 20 simply small?** (S1) | The 20 master is the one nobody looks at — few products render at 20 | The same twenty icons at 24, 20 and 16, each at its own render size, in one column |
| **Should the mark-to-container inset be absolute, proportional, or neither?** (§4) | 10 hold it absolutely, 12 proportionally, 39 between; no measurement says which reads better at 16px | The 121 container concepts at real 16px, sorted by inset ÷ canvas, with all three policies drawn for `plus-circle` |
| **Does the container radius going 10% tighter at 16 read as crisper or as a different icon?** (S3) | Tighter corners at small size is standard type practice and may be exactly right | `lab/figures.html`-style rows for the 89 radius-2.5 concepts at 24 / 20 / 16 plus real 16px |
| **Should C8's marks grow +15% into the 16 master?** (S4) | It is docs/01's "small icons must fill more" argument applied to marks, where nobody applied it deliberately | The `plus` / `minus` / `x` size grid at real 16px beside a keyline icon |
| **Is `play` wrong, or is everything else wrong?** (E1) | It held the angle; the set holds the box. Central held the angle too (`plans/set-and-rules-audit.md`, `folder-1` probe) | A media-control row — `play`, `pause`, `skip-*`, `chevron-right`, `arrow-right` — at real 16px |

---

## Appendix — the full table, 485 concepts

Outline files. `régime` is which rule lint holds the file to. `share` is the largest ink dimension ÷
canvas. `Δ20` / `Δ16` are that share's change from 24, in percentage points of itself. `ink area` is
true ink in square units of that master's canvas (`mass.density`, rate 32); `density` is ink area ÷
canvas². `mark/cont` and `inset` are blank unless the drawing is a true container (§4). `mean ∠dev`
is the mean deviation of every straight segment from 0/45/90 in degrees, including the deliberate
exceptions. `holds` — **K** keyline, **A** aspect within 2%, **D** detail count, **M**
mark/container within 3%.

| concept | régime | keyline | ink 24 | ink 20 | ink 16 | share 24/20/16 | Δ20 | Δ16 | subpaths | ink area 24/20/16 | density 24/20/16 | mark/cont 24/20/16 | inset 24/20/16 | mean ∠dev 24/20/16 | holds |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `alert-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 103.59 / 79.97 / 58.55 | 0.180 / 0.200 / 0.229 | 0.575 / 0.563 / 0.536 | 4.25 / 3.5 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `alert-circle-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 107.51 / 81.41 / 60.16 | 0.187 / 0.204 / 0.235 | 0.575 / 0.563 / 0.536 | 4.25 / 3.5 / 3.25 | 2.960 / 2.139 / 4.470 | KAD |
| `alert-circle-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 104.2 / 80.83 / 58.82 | 0.181 / 0.202 / 0.230 | 0.575 / 0.563 / 0.527 | 4.25 / 3.5 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `alert-circle-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 108.38 / 82.27 / 60.43 | 0.188 / 0.206 / 0.236 | 0.575 / 0.563 / 0.536 | 4.25 / 3.5 / 3.25 | 2.057 / 1.604 / 3.352 | KAD |
| `alert-triangle` | box | — | 20×19 | 16×15 | 14×13 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 102.86 / 76.97 / 56.29 | 0.179 / 0.192 / 0.220 | 0.575 / 0.484 / 0.455 | 3 / 3 / 3 | 8.315 / 8.037 / 8.707 | D |
| `alert-triangle-2` | box | — | 20×19 | 16×15 | 14×13 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 106.78 / 77.24 / 57.15 | 0.185 / 0.193 / 0.223 | 0.575 / 0.453 / 0.455 | 3 / 3 / 3 | 7.023 / 7.115 / 8.041 | D |
| `alert-triangle-3` | box | — | 20×19 | 16×15 | 14×13 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 103.46 / 77.83 / 56.88 | 0.180 / 0.195 / 0.222 | 0.575 / 0.484 / 0.455 | 3 / 3 / 3 | 6.652 / 6.429 / 6.966 | D |
| `alert-triangle-4` | box | — | 20×19 | 16×15 | 14×13 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 107.65 / 78.1 / 57.42 | 0.187 / 0.195 / 0.224 | 0.575 / 0.453 / 0.455 | 3 / 3 / 3 | 5.927 / 6.098 / 6.893 | D |
| `archive` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 118.51 / 89.06 / 64.09 | 0.206 / 0.223 / 0.250 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `arrow-down` | mark | — | 10×15 | 9×13.5 | 8×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 38.77 / 34.39 / 25.84 | 0.067 / 0.086 / 0.101 | — | — | 0.000 / 0.000 / 0.470 | AD |
| `arrow-down-2` | mark | — | 14×15 | 12×13.5 | 11×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.27 / 40.77 / 31.15 | 0.082 / 0.102 / 0.122 | — | — | 0.000 / 0.000 / 0.316 | D |
| `arrow-down-3` | mark | — | 11.5×15 | 10.5×13.5 | 9×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 39.41 / 35.34 / 26.05 | 0.068 / 0.088 / 0.102 | — | — | 6.948 / 6.919 / 5.943 | D |
| `arrow-down-4` | mark | — | 10×15 | 9.01×13.5 | 8×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.21 / 41.81 / 31.33 | 0.082 / 0.105 / 0.122 | — | — | 7.496 / 7.485 / 7.672 | AD |
| `arrow-left` | mark | — | 15×10 | 13.5×9 | 12×8 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 38.77 / 34.39 / 25.84 | 0.067 / 0.086 / 0.101 | — | — | 0.000 / 0.000 / 0.470 | AD |
| `arrow-left-2` | mark | — | 15×14 | 13.5×12 | 12×11 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.27 / 40.77 / 31.15 | 0.082 / 0.102 / 0.122 | — | — | 0.000 / 0.000 / 0.316 | D |
| `arrow-left-3` | mark | — | 15×11.5 | 13.5×10.5 | 12×9 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 39.41 / 35.34 / 26.05 | 0.068 / 0.088 / 0.102 | — | — | 6.948 / 6.919 / 5.943 | D |
| `arrow-left-4` | mark | — | 15×10 | 13.5×9.01 | 12×8 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.21 / 41.81 / 31.33 | 0.082 / 0.105 / 0.122 | — | — | 7.496 / 7.485 / 7.672 | AD |
| `arrow-right` | mark | — | 15×10 | 13.5×9 | 12×8 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 38.77 / 34.39 / 25.84 | 0.067 / 0.086 / 0.101 | — | — | 0.000 / 0.000 / 0.470 | AD |
| `arrow-right-2` | mark | — | 15×14 | 13.5×12 | 12×11 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.27 / 40.77 / 31.15 | 0.082 / 0.102 / 0.122 | — | — | 0.000 / 0.000 / 0.316 | D |
| `arrow-right-3` | mark | — | 15×11.5 | 13.5×10.5 | 12×9 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 39.41 / 35.34 / 26.05 | 0.068 / 0.088 / 0.102 | — | — | 6.948 / 6.919 / 5.943 | D |
| `arrow-right-4` | mark | — | 15×10 | 13.5×9.01 | 12×8 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.21 / 41.81 / 31.33 | 0.082 / 0.105 / 0.122 | — | — | 7.496 / 7.485 / 7.672 | AD |
| `arrow-up` | mark | — | 10×15 | 9×13.5 | 8×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 38.77 / 34.39 / 25.84 | 0.067 / 0.086 / 0.101 | — | — | 0.000 / 0.000 / 0.470 | AD |
| `arrow-up-2` | mark | — | 14×15 | 12×13.5 | 11×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.27 / 40.77 / 31.15 | 0.082 / 0.102 / 0.122 | — | — | 0.000 / 0.000 / 0.316 | D |
| `arrow-up-3` | mark | — | 11.5×15 | 10.5×13.5 | 9×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 39.41 / 35.34 / 26.05 | 0.068 / 0.088 / 0.102 | — | — | 6.948 / 6.919 / 5.943 | D |
| `arrow-up-4` | mark | — | 10×15 | 9.01×13.5 | 8×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 47.21 / 41.81 / 31.33 | 0.082 / 0.105 / 0.122 | — | — | 7.496 / 7.485 / 7.672 | AD |
| `arrow-up-right` | mark | — | 13×13 | 11.5×11.5 | 10×10 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 2/2/2 | 42.12 / 36.73 / 27.47 | 0.073 / 0.092 / 0.107 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `arrow-up-right-2` | mark | — | 13×13 | 11.5×11.5 | 10×10 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 2/2/2 | 50.37 / 43.48 / 32.78 | 0.087 / 0.109 / 0.128 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `arrow-up-right-3` | mark | — | 13×13 | 11.5×11.5 | 10×10 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 2/2/2 | 40.71 / 36.01 / 26.68 | 0.071 / 0.090 / 0.104 | — | — | 6.987 / 6.904 / 5.932 | AD |
| `arrow-up-right-4` | mark | — | 13×13 | 11.5×11.5 | 10×10 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 2/2/2 | 48.22 / 42.4 / 31.54 | 0.084 / 0.106 / 0.123 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `arrow-up-right-5` | mark | — | 10×10 | 9×9 | 8×8 | 0.417 / 0.450 / 0.500 | +7.9 | +19.9 | 2/2/2 | 35.84 / 31.49 / 23.9 | 0.062 / 0.079 / 0.093 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `at-sign` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 122.5 / 94.2 / 68.82 | 0.213 / 0.235 / 0.269 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `at-sign-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 128.92 / 99.33 / 71.46 | 0.224 / 0.248 / 0.279 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `attachment` | box | — | 11×20 | 10×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 82.77 / 65.73 / 49.25 | 0.144 / 0.164 / 0.192 | — | — | 0.000 / 0.000 / 0.000 | D |
| `attachment-2` | box | — | 11×20 | 10.5×16 | 10.25×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 109.21 / 86.19 / 62.81 | 0.190 / 0.215 / 0.245 | — | — | 0.000 / 0.000 / 0.000 | D |
| `attachment-3` | keyline | circle | 19.85×19.77 | 15.89×15.71 | 13.89×13.83 | 0.827 / 0.795 / 0.868 | -3.9 | +5.0 | 1/1/1 | 93.9 / 72.17 / 52.21 | 0.163 / 0.180 / 0.204 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `attachment-4` | keyline | circle | 19.96×19.85 | 15.9×15.83 | 13.99×13.95 | 0.832 / 0.795 / 0.874 | -4.4 | +5.0 | 1/1/1 | 118.48 / 91.73 / 68.64 | 0.206 / 0.229 / 0.268 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `ban` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 112.31 / 87.52 / 64.56 | 0.195 / 0.219 / 0.252 | 0.729 / 0.735 / 0.733 | 2.71 / 2.12 / 1.87 | 0.000 / 0.000 / 0.000 | KADM |
| `ban-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 112.31 / 87.52 / 64.56 | 0.195 / 0.219 / 0.252 | 0.729 / 0.735 / 0.733 | 2.71 / 2.12 / 1.87 | 0.000 / 0.000 / 0.000 | KADM |
| `ban-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 106.7 / 82.29 / 59.65 | 0.185 / 0.206 / 0.233 | 0.499 / 0.459 / 0.423 | 5.01 / 4.33 / 4.04 | 0.000 / 0.000 / 0.000 | KAD |
| `bell` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 83.52 / 61.31 / 43.61 | 0.145 / 0.153 / 0.170 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `bell-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 80.38 / 58.93 / 41.22 | 0.140 / 0.147 / 0.161 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `bell-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 84.89 / 62.41 / 44.34 | 0.147 / 0.156 / 0.173 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `bold` | mark | — | 12×18 | 10×14 | 8×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 85.19 / 66.07 / 45.22 | 0.148 / 0.165 / 0.177 | — | — | 0.000 / 0.000 / 0.000 | D |
| `book` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 134.04 / 99.36 / 71.45 | 0.233 / 0.248 / 0.279 | 0.900 / 0.891 / 0.893 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `book-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 141.11 / 107.18 / 78.09 | 0.245 / 0.268 / 0.305 | 0.900 / 0.891 / 0.893 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `book-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 126.06 / 93.62 / 65.49 | 0.219 / 0.234 / 0.256 | 0.800 / 0.750 / 0.714 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KD |
| `book-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/2 | 130.66 / 95.31 / 65.98 | 0.227 / 0.238 / 0.258 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KM |
| `book-open` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 108.9 / 80.07 / 58.38 | 0.189 / 0.200 / 0.228 | 0.650 / 0.594 / 0.571 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KD |
| `book-open-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.7 / 78.63 / 57.68 | 0.187 / 0.197 / 0.225 | 0.650 / 0.594 / 0.571 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KD |
| `briefcase` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 133.9 / 102.15 / 74.92 | 0.232 / 0.255 / 0.293 | — | — | 0.000 / 0.000 / 0.000 | D |
| `bug` | keyline | circle | 20×19.5 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 9/9/9 | 140.16 / 107.95 / 76.61 | 0.243 / 0.270 / 0.299 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `bug-2` | keyline | circle | 20×19.5 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 9/9/9 | 145.59 / 111.93 / 79.19 | 0.253 / 0.280 / 0.309 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `building` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 11/6/6 | 141.09 / 99.3 / 69.46 | 0.245 / 0.248 / 0.271 | 0.850 / 0.813 / 0.804 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | K |
| `building-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 8/6/4 | 139.04 / 98.24 / 69.25 | 0.241 / 0.246 / 0.271 | 0.838 / 0.797 / 0.795 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | K |
| `building-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 13/6/6 | 151.15 / 101.82 / 72.72 | 0.262 / 0.255 / 0.284 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `building-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 13/6/6 | 151.15 / 101.82 / 72.72 | 0.262 / 0.255 / 0.284 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `calendar` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 114.58 / 85.88 / 62.08 | 0.199 / 0.215 / 0.242 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `calendar-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 107.34 / 80.14 / 57.38 | 0.186 / 0.200 / 0.224 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `calendar-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/5 | 121.64 / 92.94 / 63.84 | 0.211 / 0.232 / 0.249 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `camera` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 124.38 / 93.21 / 71.12 | 0.216 / 0.233 / 0.278 | 0.400 / 0.375 / 0.429 | 4 / 3 / 3 | 0.000 / 0.000 / 0.000 | D |
| `camera-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 118.38 / 87.21 / 60.21 | 0.206 / 0.218 / 0.235 | 0.400 / 0.375 / 0.321 | 3 / 3 / 2.75 | 0.000 / 0.000 / 0.000 | KD |
| `camera-3` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 125.98 / 94.52 / 66.42 | 0.219 / 0.236 / 0.259 | 0.400 / 0.375 / 0.321 | 4 / 3 / 2.75 | 0.000 / 0.000 / 0.000 | D |
| `camera-4` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 126.62 / 94.52 / 66.42 | 0.220 / 0.236 / 0.259 | 0.400 / 0.375 / 0.321 | 4 / 3 / 2.75 | 0.000 / 0.000 / 0.000 | D |
| `camera-5` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 133.82 / 102.62 / 71.12 | 0.232 / 0.257 / 0.278 | 0.500 / 0.500 / 0.429 | 3 / 3 / 3 | 0.000 / 0.000 / 0.000 | D |
| `camera-6` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 132.35 / 100.25 / 69.51 | 0.230 / 0.251 / 0.272 | 0.550 / 0.500 / 0.500 | 3 / 3 / 3 | 0.000 / 0.000 / 0.000 | D |
| `cart` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 95.61 / 70.1 / 48.85 | 0.166 / 0.175 / 0.191 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `cart-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 102.04 / 73.62 / 51.98 | 0.177 / 0.184 / 0.203 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `cart-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 94.51 / 69.49 / 48.38 | 0.164 / 0.174 / 0.189 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `cart-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 94.28 / 74.57 / 43.39 | 0.164 / 0.186 / 0.170 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `cart-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/5 | 102.6 / 75.21 / 52.77 | 0.178 / 0.188 / 0.206 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `cash` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 131.5 / 85.44 / 59.49 | 0.228 / 0.214 / 0.232 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `chart-bar` | mark | — | 13.5×18 | 11.5×14 | 9.25×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 58.54 / 45.04 / 32.77 | 0.102 / 0.113 / 0.128 | — | — | 0.000 / 0.000 / 0.000 | D |
| `chart-bar-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 71.55 / 53.55 / 37.44 | 0.124 / 0.134 / 0.146 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `chart-bar-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/3 | 91.58 / 67 / 41.92 | 0.159 / 0.167 / 0.164 | 0.722 / 0.679 / 0.667 | 1.75 / 0.25 / 1 | 0.000 / 0.000 / 0.000 | KA |
| `chart-bar-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 120.09 / 88.59 / 64.23 | 0.208 / 0.221 / 0.251 | 0.722 / 0.714 / 0.750 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KAD |
| `chart-bar-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/3 | 125.98 / 95.4 / 62.69 | 0.219 / 0.239 / 0.245 | 0.639 / 0.571 / 0.542 | 3.25 / 3 / 2.75 | 0.000 / 0.000 / 0.000 | KA |
| `chart-pie` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.07 / 82.09 / 59.84 | 0.186 / 0.205 / 0.234 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `chart-pie-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 118.76 / 87.91 / 63.74 | 0.206 / 0.220 / 0.249 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `chart-pie-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 124.25 / 96.37 / 70.85 | 0.216 / 0.241 / 0.277 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `check` | mark | — | 16×11.19 | 14×9.69 | 12×8.19 | 0.667 / 0.700 / 0.750 | +4.9 | +12.4 | 1/1/1 | 32.09 / 27.84 / 20.02 | 0.056 / 0.070 / 0.078 | — | — | 0.000 / 0.000 / 0.474 | D |
| `check-2` | mark | — | 16×12.19 | 14×10.69 | 12×9.19 | 0.667 / 0.700 / 0.750 | +4.9 | +12.4 | 1/1/1 | 32.09 / 27.84 / 20.02 | 0.056 / 0.070 / 0.078 | — | — | 0.000 / 0.000 / 0.585 | AD |
| `check-2-small` | mark | — | 13×9.69 | 11.5×8.69 | 10×7.69 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 1/1/1 | 25.72 / 22.53 / 16.48 | 0.045 / 0.056 / 0.064 | — | — | 0.000 / 0.000 / 0.750 | D |
| `check-3` | mark | — | 16×13.06 | 14×11.56 | 12×10.06 | 0.667 / 0.700 / 0.750 | +4.9 | +12.4 | 1/1/1 | 35.66 / 30.88 / 22.37 | 0.062 / 0.077 / 0.087 | — | — | 5.908 / 5.728 / 6.475 | D |
| `check-3-small` | mark | — | 13×10.56 | 11.5×9.06 | 10×8.04 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 1/1/1 | 28.48 / 24.72 / 18.33 | 0.049 / 0.062 / 0.072 | — | — | 5.810 / 5.702 / 6.677 | D |
| `check-4` | mark | — | 16×13.61 | 14×12.11 | 12×10.12 | 0.667 / 0.700 / 0.750 | +4.9 | +12.4 | 1/1/1 | 35.29 / 30.76 / 21.78 | 0.061 / 0.077 / 0.085 | — | — | 3.887 / 4.069 / 3.872 | D |
| `check-4-small` | mark | — | 13×11.11 | 11.5×9.61 | 10×8.12 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 1/1/1 | 28.36 / 24.6 / 17.79 | 0.049 / 0.061 / 0.069 | — | — | 4.070 / 3.797 / 3.814 | D |
| `check-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.08 / 82.99 / 60.54 | 0.186 / 0.207 / 0.236 | 0.514 / 0.488 / 0.470 | 4.86 / 4.1 / 3.71 | 0.065 / 0.101 / 1.095 | KAD |
| `check-circle-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.92 / 83.5 / 60.81 | 0.187 / 0.209 / 0.238 | 0.488 / 0.465 / 0.444 | 5.12 / 4.28 / 3.89 | 5.917 / 5.656 / 6.612 | KAD |
| `check-circle-3-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 104.3 / 80.68 / 59.36 | 0.181 / 0.202 / 0.232 | 0.412 / 0.391 / 0.393 | 5.88 / 4.87 / 4.25 | 5.968 / 5.597 / 6.555 | KAD |
| `check-circle-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.43 / 83.17 / 60.64 | 0.187 / 0.208 / 0.237 | 0.481 / 0.458 / 0.444 | 5.19 / 4.34 / 3.89 | 3.957 / 4.149 / 4.437 | KAD |
| `check-circle-4-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 103.84 / 80.53 / 59.13 | 0.180 / 0.201 / 0.231 | 0.405 / 0.386 / 0.389 | 5.95 / 4.91 / 4.28 | 3.883 / 4.118 / 4.559 | KAD |
| `check-circle-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 103.55 / 80.38 / 58.98 | 0.180 / 0.201 / 0.230 | 0.430 / 0.411 / 0.407 | 5.7 / 4.71 / 4.15 | 0.086 / 0.000 / 1.321 | KAD |
| `check-small` | mark | — | 13×9.19 | 11.5×8.19 | 10×7.19 | 0.542 / 0.575 / 0.625 | +6.1 | +15.3 | 1/1/1 | 25.72 / 22.53 / 16.49 | 0.045 / 0.056 / 0.064 | — | — | 0.000 / 0.000 / 0.639 | AD |
| `checkbox` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 112.47 / 84.55 / 60.77 | 0.195 / 0.211 / 0.237 | 0.571 / 0.557 / 0.542 | 3.86 / 3.1 / 2.75 | 0.022 / 0.034 / 0.004 | KAD |
| `checkbox-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 113.32 / 85.06 / 61.68 | 0.197 / 0.213 / 0.241 | 0.542 / 0.531 / 0.542 | 4.12 / 3.28 / 2.75 | 1.972 / 1.885 / 1.969 | KADM |
| `checkbox-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 112.83 / 84.74 / 61.58 | 0.196 / 0.212 / 0.241 | 0.534 / 0.523 / 0.542 | 4.19 / 3.34 / 2.75 | 1.319 / 1.383 / 1.296 | KADM |
| `checkbox-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 108.95 / 81.94 / 59.41 | 0.189 / 0.205 / 0.232 | 0.478 / 0.470 / 0.475 | 4.7 / 3.71 / 3.15 | 0.029 / 0.000 / 0.440 | KADM |
| `chevron-down` | mark | — | 14×7.43 | 12×6.44 | 10.5×5.69 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 27.72 / 23.6 / 17.35 | 0.048 / 0.059 / 0.068 | — | — | 0.050 / 0.000 / 0.496 | D |
| `chevron-down-2` | mark | — | 16×6.35 | 13.5×5.35 | 12×4.85 | 0.667 / 0.675 / 0.750 | +1.2 | +12.4 | 1/1/1 | 28.01 / 23.22 / 17.46 | 0.049 / 0.058 / 0.068 | — | — | 10.370 / 11.310 / 10.205 | AD |
| `chevron-down-2-large` | mark | — | 19×7.34 | 16×6.35 | 14×5.59 | 0.792 / 0.800 / 0.875 | +1.0 | +10.5 | 1/1/1 | 33.4 / 28.01 / 20.57 | 0.058 / 0.070 / 0.080 | — | — | 10.570 / 10.370 / 9.920 | D |
| `chevron-down-2-small` | mark | — | 13×5.34 | 11×4.59 | 10×4.33 | 0.542 / 0.550 / 0.625 | +1.5 | +15.3 | 1/1/1 | 22.59 / 18.84 / 14.65 | 0.039 / 0.047 / 0.057 | — | — | 10.182 / 10.643 / 8.591 | D |
| `chevron-down-3` | mark | — | 14×9.03 | 12×7.78 | 10.5×6.79 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 31.37 / 26.56 / 19.45 | 0.054 / 0.066 / 0.076 | — | — | 6.983 / 7.118 / 7.038 | AD |
| `chevron-down-3-large` | mark | — | 17×11.03 | 14.5×9.29 | 12.5×8.04 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 38.88 / 32.45 / 23.44 | 0.068 / 0.081 / 0.092 | — | — | 7.228 / 6.762 / 6.907 | AD |
| `chevron-down-3-small` | mark | — | 11×7.05 | 9.5×6.06 | 8.5×5.53 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 23.93 / 20.2 / 15.41 | 0.042 / 0.051 / 0.060 | — | — | 6.660 / 6.389 / 7.190 | AD |
| `chevron-down-large` | mark | — | 17×8.94 | 14.5×7.69 | 12.5×6.69 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 34.22 / 28.91 / 20.89 | 0.059 / 0.072 / 0.082 | — | — | 0.000 / 0.000 / 0.401 | AD |
| `chevron-down-small` | mark | — | 11×5.93 | 9.5×5.19 | 8.5×4.69 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 21.35 / 18.28 / 13.81 | 0.037 / 0.046 / 0.054 | — | — | 0.068 / 0.000 / 0.651 | D |
| `chevron-left` | mark | — | 7.43×14 | 6.44×12 | 5.69×10.5 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 27.72 / 23.6 / 17.35 | 0.048 / 0.059 / 0.068 | — | — | 0.050 / 0.000 / 0.496 | D |
| `chevron-left-2` | mark | — | 6.35×16 | 5.35×13.5 | 4.85×12 | 0.667 / 0.675 / 0.750 | +1.2 | +12.4 | 1/1/1 | 28.01 / 23.22 / 17.46 | 0.049 / 0.058 / 0.068 | — | — | 10.370 / 11.310 / 10.205 | AD |
| `chevron-left-2-large` | mark | — | 7.34×19 | 6.35×16 | 5.59×14 | 0.792 / 0.800 / 0.875 | +1.0 | +10.5 | 1/1/1 | 33.4 / 28.01 / 20.57 | 0.058 / 0.070 / 0.080 | — | — | 10.570 / 10.370 / 9.920 | D |
| `chevron-left-2-small` | mark | — | 5.34×13 | 4.59×11 | 4.33×10 | 0.542 / 0.550 / 0.625 | +1.5 | +15.3 | 1/1/1 | 22.59 / 18.84 / 14.66 | 0.039 / 0.047 / 0.057 | — | — | 10.182 / 10.643 / 8.591 | D |
| `chevron-left-3` | mark | — | 9.03×14 | 7.78×12 | 6.79×10.5 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 31.38 / 26.57 / 19.44 | 0.054 / 0.066 / 0.076 | — | — | 6.983 / 7.118 / 7.038 | AD |
| `chevron-left-3-large` | mark | — | 11.03×17 | 9.29×14.5 | 8.04×12.5 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 38.87 / 32.45 / 23.45 | 0.067 / 0.081 / 0.092 | — | — | 7.228 / 6.762 / 6.907 | AD |
| `chevron-left-3-small` | mark | — | 7.05×11 | 6.06×9.5 | 5.53×8.5 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 23.93 / 20.2 / 15.41 | 0.042 / 0.050 / 0.060 | — | — | 6.660 / 6.389 / 7.190 | AD |
| `chevron-left-large` | mark | — | 8.94×17 | 7.69×14.5 | 6.69×12.5 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 34.22 / 28.91 / 20.89 | 0.059 / 0.072 / 0.082 | — | — | 0.000 / 0.000 / 0.401 | AD |
| `chevron-left-small` | mark | — | 5.93×11 | 5.19×9.5 | 4.69×8.5 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 21.35 / 18.28 / 13.81 | 0.037 / 0.046 / 0.054 | — | — | 0.068 / 0.000 / 0.651 | D |
| `chevron-right` | mark | — | 7.43×14 | 6.44×12 | 5.69×10.5 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 27.72 / 23.6 / 17.35 | 0.048 / 0.059 / 0.068 | — | — | 0.050 / 0.000 / 0.496 | D |
| `chevron-right-2` | mark | — | 6.35×16 | 5.35×13.5 | 4.85×12 | 0.667 / 0.675 / 0.750 | +1.2 | +12.4 | 1/1/1 | 28.01 / 23.22 / 17.46 | 0.049 / 0.058 / 0.068 | — | — | 10.370 / 11.310 / 10.205 | AD |
| `chevron-right-2-large` | mark | — | 7.34×19 | 6.35×16 | 5.59×14 | 0.792 / 0.800 / 0.875 | +1.0 | +10.5 | 1/1/1 | 33.4 / 28.01 / 20.57 | 0.058 / 0.070 / 0.080 | — | — | 10.570 / 10.370 / 9.920 | D |
| `chevron-right-2-small` | mark | — | 5.34×13 | 4.59×11 | 4.33×10 | 0.542 / 0.550 / 0.625 | +1.5 | +15.3 | 1/1/1 | 22.59 / 18.84 / 14.66 | 0.039 / 0.047 / 0.057 | — | — | 10.182 / 10.643 / 8.591 | D |
| `chevron-right-3` | mark | — | 9.03×14 | 7.78×12 | 6.79×10.5 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 31.38 / 26.57 / 19.44 | 0.054 / 0.066 / 0.076 | — | — | 6.983 / 7.118 / 7.038 | AD |
| `chevron-right-3-large` | mark | — | 11.03×17 | 9.29×14.5 | 8.04×12.5 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 38.87 / 32.45 / 23.45 | 0.067 / 0.081 / 0.092 | — | — | 7.228 / 6.762 / 6.907 | AD |
| `chevron-right-3-small` | mark | — | 7.05×11 | 6.06×9.5 | 5.53×8.5 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 23.93 / 20.2 / 15.41 | 0.042 / 0.050 / 0.060 | — | — | 6.660 / 6.389 / 7.190 | AD |
| `chevron-right-large` | mark | — | 8.94×17 | 7.69×14.5 | 6.69×12.5 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 34.22 / 28.91 / 20.89 | 0.059 / 0.072 / 0.082 | — | — | 0.000 / 0.000 / 0.401 | AD |
| `chevron-right-small` | mark | — | 5.93×11 | 5.19×9.5 | 4.69×8.5 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 21.35 / 18.28 / 13.81 | 0.037 / 0.046 / 0.054 | — | — | 0.068 / 0.000 / 0.651 | D |
| `chevron-up` | mark | — | 14×7.43 | 12×6.44 | 10.5×5.69 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 27.72 / 23.6 / 17.35 | 0.048 / 0.059 / 0.068 | — | — | 0.050 / 0.000 / 0.496 | D |
| `chevron-up-2` | mark | — | 16×6.35 | 13.5×5.35 | 12×4.85 | 0.667 / 0.675 / 0.750 | +1.2 | +12.4 | 1/1/1 | 28 / 23.22 / 17.46 | 0.049 / 0.058 / 0.068 | — | — | 10.370 / 11.310 / 10.205 | AD |
| `chevron-up-2-large` | mark | — | 19×7.34 | 16×6.35 | 14×5.59 | 0.792 / 0.800 / 0.875 | +1.0 | +10.5 | 1/1/1 | 33.41 / 28 / 20.57 | 0.058 / 0.070 / 0.080 | — | — | 10.570 / 10.370 / 9.920 | D |
| `chevron-up-2-small` | mark | — | 13×5.34 | 11×4.59 | 10×4.33 | 0.542 / 0.550 / 0.625 | +1.5 | +15.3 | 1/1/1 | 22.59 / 18.84 / 14.66 | 0.039 / 0.047 / 0.057 | — | — | 10.182 / 10.643 / 8.591 | D |
| `chevron-up-3` | mark | — | 14×9.03 | 12×7.78 | 10.5×6.79 | 0.583 / 0.600 / 0.656 | +2.9 | +12.5 | 1/1/1 | 31.38 / 26.57 / 19.44 | 0.054 / 0.066 / 0.076 | — | — | 6.983 / 7.118 / 7.038 | AD |
| `chevron-up-3-large` | mark | — | 17×11.03 | 14.5×9.29 | 12.5×8.04 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 38.87 / 32.45 / 23.45 | 0.067 / 0.081 / 0.092 | — | — | 7.228 / 6.762 / 6.907 | AD |
| `chevron-up-3-small` | mark | — | 11×7.05 | 9.5×6.06 | 8.5×5.53 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 23.93 / 20.2 / 15.41 | 0.042 / 0.050 / 0.060 | — | — | 6.660 / 6.389 / 7.190 | AD |
| `chevron-up-large` | mark | — | 17×8.94 | 14.5×7.69 | 12.5×6.69 | 0.708 / 0.725 / 0.781 | +2.4 | +10.3 | 1/1/1 | 34.22 / 28.91 / 20.89 | 0.059 / 0.072 / 0.082 | — | — | 0.000 / 0.000 / 0.401 | AD |
| `chevron-up-small` | mark | — | 11×5.93 | 9.5×5.19 | 8.5×4.69 | 0.458 / 0.475 / 0.531 | +3.7 | +15.9 | 1/1/1 | 21.35 / 18.28 / 13.81 | 0.037 / 0.046 / 0.054 | — | — | 0.068 / 0.000 / 0.651 | D |
| `chevrons-up-down` | mark | — | 11×13.86 | 9.5×12.38 | 8.5×11.38 | 0.578 / 0.619 / 0.711 | +7.1 | +23.0 | 2/2/2 | 42.79 / 36.11 / 27.71 | 0.074 / 0.090 / 0.108 | — | — | 0.068 / 0.000 / 0.651 | D |
| `chevrons-up-down-2` | mark | — | 11×14.86 | 9.5×12.88 | 8.5×11.63 | 0.619 / 0.644 / 0.727 | +4.0 | +17.4 | 2/2/2 | 42.79 / 36.11 / 27.71 | 0.074 / 0.090 / 0.108 | — | — | 0.068 / 0.000 / 0.651 | AD |
| `chevrons-up-down-3` | mark | — | 13×14.17 | 11×12.18 | 10×11.65 | 0.590 / 0.609 / 0.728 | +3.2 | +23.4 | 2/2/2 | 45.16 / 37.68 / 29.32 | 0.078 / 0.094 / 0.115 | — | — | 10.182 / 10.643 / 8.591 | D |
| `chevrons-up-down-4` | mark | — | 13×13.17 | 11×11.68 | 10×11.15 | 0.549 / 0.584 / 0.697 | +6.4 | +27.0 | 2/2/2 | 45.16 / 37.68 / 29.32 | 0.078 / 0.094 / 0.115 | — | — | 10.182 / 10.643 / 8.591 | D |
| `clipboard` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 103.78 / 77.18 / 58.44 | 0.180 / 0.193 / 0.228 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `clipboard-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 105.02 / 76.36 / 57.94 | 0.182 / 0.191 / 0.226 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `clipboard-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 105.28 / 78.68 / 59.69 | 0.183 / 0.197 / 0.233 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `clipboard-4` | box | — | 16×18 | 12×14 | 10×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 97.78 / 71.18 / 53.44 | 0.170 / 0.178 / 0.209 | — | — | 0.000 / 0.000 / 0.000 | D |
| `clock` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 102.93 / 81.14 / 58.44 | 0.179 / 0.203 / 0.228 | 0.487 / 0.500 / 0.446 | 3.75 / 3 / 3 | 0.000 / 0.000 / 0.000 | KAD |
| `code` | mark | square | 17.88×18 | 13.88×14 | 11.98×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 61.65 / 42.9 / 30.41 | 0.107 / 0.107 / 0.119 | — | — | 3.372 / 3.549 / 3.364 | AD |
| `code-2` | mark | — | 17.88×10 | 13.88×8.5 | 11.98×7.5 | 0.745 / 0.694 / 0.749 | -6.8 | +0.5 | 2/2/2 | 38.2 / 31.92 / 24.05 | 0.066 / 0.080 / 0.094 | — | — | 0.000 / 0.000 / 0.000 | D |
| `compass` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/2 | 137.7 / 102.88 / 71.56 | 0.239 / 0.257 / 0.280 | 0.538 / 0.497 / 0.482 | 4.62 / 4.03 / 3.63 | 15.967 / 15.986 / 20.011 | KA |
| `compass-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 120.67 / 90.35 / 66.05 | 0.209 / 0.226 / 0.258 | 0.432 / 0.388 / 0.381 | 5.68 / 4.9 / 4.33 | 19.994 / 20.042 / 20.012 | KAD |
| `compass-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/2 | 137.7 / 102.88 / 71.56 | 0.239 / 0.257 / 0.280 | 0.538 / 0.497 / 0.482 | 4.62 / 4.03 / 3.63 | 15.967 / 15.986 / 20.011 | KA |
| `compose` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 119.62 / 83.83 / 58.55 | 0.208 / 0.210 / 0.229 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `compose-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 129.52 / 93.74 / 66.77 | 0.225 / 0.234 / 0.261 | 0.722 / 0.714 / 0.708 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `compose-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 128.92 / 93.36 / 66.43 | 0.224 / 0.233 / 0.260 | 0.722 / 0.714 / 0.708 | 0 / 0 / 0 | 2.986 / 2.955 / 3.002 | KADM |
| `compose-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 129.83 / 93.87 / 66.94 | 0.225 / 0.235 / 0.261 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `copy` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 98.72 / 65.85 / 44.09 | 0.171 / 0.165 / 0.172 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `copy-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.72 / 74.85 / 51.59 | 0.187 / 0.187 / 0.202 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `copy-3` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 116.72 / 83.85 / 59.09 | 0.203 / 0.210 / 0.231 | — | — | 0.000 / 0.000 / 0.000 | D |
| `credit-card` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 125.08 / 94.88 / 68.95 | 0.217 / 0.237 / 0.269 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `credit-card-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 125.08 / 94.88 / 68.95 | 0.217 / 0.237 / 0.269 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `credit-card-3` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 132.14 / 99.04 / 69.78 | 0.229 / 0.248 / 0.273 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `cursor` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 85.59 / 63.59 / 45.43 | 0.149 / 0.159 / 0.177 | — | — | 5.757 / 5.735 / 5.716 | AD |
| `cursor-2` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 91.43 / 67.87 / 48.47 | 0.159 / 0.170 / 0.189 | — | — | 4.304 / 4.275 / 4.292 | AD |
| `cursor-3` | mark | square | 18.01×18.01 | 14.01×14.01 | 12×12 | 0.750 / 0.701 / 0.750 | -6.5 | +0.0 | 1/1/1 | 77.12 / 58.44 / 41.85 | 0.134 / 0.146 / 0.163 | — | — | 20.005 / 19.944 / 19.999 | AD |
| `cursor-click` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 66.68 / 48.09 / 33.64 | 0.116 / 0.120 / 0.131 | — | — | 11.409 / 11.367 / 11.433 | AD |
| `database` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/3/3 | 149.9 / 95.86 / 68.16 | 0.260 / 0.240 / 0.266 | — | — | 0.000 / 0.000 / 0.000 | K |
| `database-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 129.02 / 95.04 / 67.81 | 0.224 / 0.238 / 0.265 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `database-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/3/3 | 158.77 / 101.48 / 72.85 | 0.276 / 0.254 / 0.285 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `desktop` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 103.33 / 79.13 / 57.39 | 0.179 / 0.198 / 0.224 | — | — | 0.000 / 0.000 / 0.000 | D |
| `desktop-2` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 99.58 / 76.88 / 55.2 | 0.173 / 0.192 / 0.216 | — | — | 0.000 / 0.000 / 0.000 | D |
| `desktop-3` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 128.83 / 98.63 / 71.77 | 0.224 / 0.247 / 0.280 | — | — | 0.000 / 0.000 / 0.000 | D |
| `desktop-4` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 97.33 / 73.13 / 52.39 | 0.169 / 0.183 / 0.205 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `desktop-5` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 109.33 / 83.63 / 61.14 | 0.190 / 0.209 / 0.239 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `desktop-6` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 110.26 / 84.46 / 62.13 | 0.191 / 0.211 / 0.243 | — | — | 0.000 / 0.000 / 0.000 | D |
| `export` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 96.72 / 71.9 / 51.82 | 0.168 / 0.180 / 0.202 | — | — | 0.000 / 0.000 / 0.176 | KAD |
| `external-link` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 103.64 / 72.08 / 50.36 | 0.180 / 0.180 / 0.197 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `external-link-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 98.17 / 66.08 / 45.36 | 0.170 / 0.165 / 0.177 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `eye` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 109.16 / 78.84 / 54.07 | 0.190 / 0.197 / 0.211 | 0.425 / 0.375 / 0.321 | 3.75 / 3 / 2.75 |  /  /  | KD |
| `face-neutral` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 108.21 / 85.59 / 62.87 | 0.188 / 0.214 / 0.246 | 0.450 / 0.438 / 0.429 | 5.5 / 4.25 / 3.75 | 0.000 / 0.000 / 0.000 | KAD |
| `face-sad` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 109.69 / 86.6 / 63.52 | 0.190 / 0.217 / 0.248 | 0.450 / 0.438 / 0.500 | 5.5 / 4.25 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `face-smile` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 116.6 / 92.05 / 67.66 | 0.202 / 0.230 / 0.264 | 0.558 / 0.546 / 0.554 | 4.25 / 3.51 / 3 | 0.000 / 0.000 / 0.000 | KADM |
| `file` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 102.41 / 77.45 / 55.77 | 0.178 / 0.194 / 0.218 | 0.375 / 0.406 / 0.384 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `file-text` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/3 | 131.44 / 94.48 / 60.45 | 0.228 / 0.236 / 0.236 | 0.787 / 0.797 / 0.688 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | K |
| `file-text-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 5/4/4 | 136.95 / 90.35 / 63.24 | 0.238 / 0.226 / 0.247 | 0.838 / 0.797 / 0.795 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | K |
| `files` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 115.63 / 79.45 / 54.96 | 0.201 / 0.199 / 0.215 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `files-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 112.69 / 77.54 / 53.59 | 0.196 / 0.194 / 0.209 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `files-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 111.88 / 77.2 / 53.09 | 0.194 / 0.193 / 0.207 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `files-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 133.12 / 102.51 / 75.09 | 0.231 / 0.256 / 0.293 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `files-5` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 5/4/3 | 135.66 / 83.46 / 54.96 | 0.236 / 0.209 / 0.215 | — | — | 0.000 / 0.000 / 0.000 | K |
| `filter` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 84.34 / 64.22 / 46.38 | 0.146 / 0.161 / 0.181 | — | — | 0.000 / 0.025 / 0.000 | KAD |
| `filter-2` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 3/3/3 | 43.54 / 39.04 / 29.02 | 0.076 / 0.098 / 0.113 | — | — | 0.000 / 0.000 / 0.000 | D |
| `filter-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 82.92 / 63.15 / 45.79 | 0.144 / 0.158 / 0.179 | — | — | 0.000 / 0.027 / 0.003 | KAD |
| `filter-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 82.59 / 62.47 / 44.88 | 0.143 / 0.156 / 0.175 | — | — | 0.000 / 0.025 / 0.000 | KAD |
| `flag` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 90.32 / 68.07 / 49.19 | 0.157 / 0.170 / 0.192 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `flag-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 84.27 / 63.71 / 45.96 | 0.146 / 0.159 / 0.180 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `flag-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 82.36 / 62.27 / 44.97 | 0.143 / 0.156 / 0.176 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `flag-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 86.73 / 65.35 / 47.11 | 0.151 / 0.163 / 0.184 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `folder` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 96.59 / 73.91 / 53.93 | 0.168 / 0.185 / 0.211 | — | — | 0.000 / 0.000 / 0.000 | D |
| `folder-2` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 106.89 / 81.96 / 60.54 | 0.186 / 0.205 / 0.236 | 0.450 / 0.469 / 0.495 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | D |
| `folder-3` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 104.4 / 79.47 / 58.5 | 0.181 / 0.199 / 0.229 | 0.300 / 0.281 / 0.298 | 2 / 2 / 2 | 0.000 / 0.000 / 0.000 | DM |
| `gauge` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 75.25 / 55.33 / 39.95 | 0.131 / 0.138 / 0.156 | 0.287 / 0.281 / 0.277 | 4.5 / 2.75 / 1.75 | 0.000 / 0.000 / 0.000 | KD |
| `gear` | box | — | 18.62×20 | 14.94×16 | 13.12×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 135.97 / 101.32 / 72.69 | 0.236 / 0.253 / 0.284 | 0.425 / 0.406 / 0.393 | 5.06 / 4.22 / 3.81 | 10.050 / 9.830 / 10.015 | AD |
| `gear-2` | box | — | 20×18.52 | 16×15.04 | 14×13.18 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 126.61 / 96.29 / 68.66 | 0.220 / 0.241 / 0.268 | 0.350 / 0.406 / 0.357 | 5.76 / 4.27 / 4.09 | 11.557 / 11.456 / 12.080 | ADM |
| `gear-3` | box | circle | 19.9×19.8 | 16×16 | 13.81×13.62 | 0.829 / 0.800 / 0.863 | -3.5 | +4.1 | 19/16/13 | 135.98 / 98.98 / 68.95 | 0.236 / 0.247 / 0.269 | — | — | 10.973 / 9.919 / 10.832 | A |
| `globe` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 160.76 / 122.92 / 90.64 | 0.279 / 0.307 / 0.354 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `globe-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 182.89 / 138.07 / 102.15 | 0.318 / 0.345 / 0.399 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 |  /  /  | KADM |
| `grid` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 133.69 / 88.25 / 63.59 | 0.232 / 0.221 / 0.248 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `grid-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 135.32 / 100.62 / 72.72 | 0.235 / 0.252 / 0.284 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `grid-3` | mark | — | 15×15 | 13.5×13.5 | 11.5×11.5 | 0.625 / 0.675 / 0.719 | +8.0 | +15.0 | 9/9/9 | 63.56 / 51.51 / 40.7 | 0.110 / 0.129 / 0.159 | — | — |  /  /  | AD |
| `grid-4` | mark | — | 15×15 | 13.5×13.5 | 11.5×11.5 | 0.625 / 0.675 / 0.719 | +8.0 | +15.0 | 9/9/9 | 76.61 / 76.61 / 53.3 | 0.133 / 0.192 / 0.208 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `grid-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 128.54 / 85.05 / 61.47 | 0.223 / 0.213 / 0.240 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `grid-6` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 128.57 / 95.74 / 69.28 | 0.223 / 0.239 / 0.271 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `grid-7` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 145.69 / 100.25 / 68.59 | 0.253 / 0.251 / 0.268 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `hash` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 4/4/4 | 79.05 / 70.05 / 52.44 | 0.137 / 0.175 / 0.205 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `hash-2` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 4/4/4 | 79.48 / 70.42 / 52.71 | 0.138 / 0.176 / 0.206 | — | — | 4.731 / 4.731 / 4.623 | AD |
| `hash-3` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 4/4/4 | 76.48 / 67.42 / 50.84 | 0.133 / 0.169 / 0.199 | — | — | 4.731 / 4.731 / 4.623 | AD |
| `heart` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 82.77 / 64.09 / 47.17 | 0.144 / 0.160 / 0.184 | — | — | 0.551 / 0.471 / 0.217 | D |
| `heart-2` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 86.86 / 66.23 / 48.15 | 0.151 / 0.166 / 0.188 | — | — | 0.000 / 0.000 / 0.000 | D |
| `help` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 115.63 / 89.26 / 64.51 | 0.201 / 0.223 / 0.252 | 0.600 / 0.625 / 0.571 | 4 / 3 / 3 |  /  /  | KAD |
| `help-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 113.46 / 88.69 / 64.51 | 0.197 / 0.222 / 0.252 | 0.600 / 0.625 / 0.571 | 4 / 3 / 3 |  /  /  | KAD |
| `help-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 113.48 / 89 / 62.33 | 0.197 / 0.223 / 0.243 | 0.600 / 0.625 / 0.559 | 3.99 / 2.99 / 3.04 | 0.147 / 0.000 / 1.866 | KAD |
| `help-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 116.71 / 89.98 / 64.78 | 0.203 / 0.225 / 0.253 | 0.600 / 0.594 / 0.536 | 4 / 3.25 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `home` | keyline | square | 18×18 | 14×13.99 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 100.39 / 76.22 / 54.56 | 0.174 / 0.191 / 0.213 | 0.403 / 0.446 / 0.438 | 0 / 0 / 0 | 0.000 / 0.011 / 0.000 | KAD |
| `home-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 103.56 / 78.98 / 56.4 | 0.180 / 0.197 / 0.220 | 0.403 / 0.446 / 0.438 | 0 / 0 / 0 | 2.036 / 2.033 / 2.033 | KAD |
| `home-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 92.25 / 70.34 / 50.27 | 0.160 / 0.176 / 0.196 | 0.333 / 0.357 / 0.333 | 3.75 / 3.5 / 2.75 | 2.715 / 2.710 / 2.711 | KADM |
| `image` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 124.37 / 92.85 / 67.38 | 0.216 / 0.232 / 0.263 | 0.847 / 0.857 / 0.875 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KAD |
| `image-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 128.3 / 95.53 / 68.95 | 0.223 / 0.239 / 0.269 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `image-3` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 124.89 / 93.9 / 67.38 | 0.217 / 0.235 / 0.263 | 0.787 / 0.781 / 0.786 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KDM |
| `images` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/3/3 | 133.76 / 86.64 / 59.94 | 0.232 / 0.217 / 0.234 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `images-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/3/3 | 133.76 / 86.64 / 59.94 | 0.232 / 0.217 / 0.234 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `images-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/3/3 | 133.76 / 86.64 / 59.94 | 0.232 / 0.217 / 0.234 | — | — | 0.000 / 0.000 / 0.000 | KA |
| `images-4` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/3 | 133.41 / 95.72 / 64.97 | 0.232 / 0.239 / 0.254 | — | — | 0.000 / 0.000 / 0.000 | K |
| `info` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 103.59 / 79.97 / 58.55 | 0.180 / 0.200 / 0.229 | 0.575 / 0.563 / 0.536 | 4.25 / 3.5 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `info-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 106.11 / 82.1 / 60.53 | 0.184 / 0.205 / 0.236 | 0.575 / 0.563 / 0.536 | 4.25 / 3.5 / 3.25 | 0.000 / 0.000 / 0.000 | KAD |
| `info-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 110.4 / 85.6 / 63.21 | 0.192 / 0.214 / 0.247 | 0.575 / 0.563 / 0.536 | 3.9 / 3.23 / 3 | 0.000 / 0.000 / 0.000 | KAD |
| `italic` | box | — | 12×18 | 10×14 | 8×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 44.83 / 35.67 / 24.72 | 0.078 / 0.089 / 0.097 | — | — | 5.085 / 5.214 / 4.783 | D |
| `key` | box | — | 20×10 | 16×8 | 14×8 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 63.34 / 47.76 / 39.73 | 0.110 / 0.119 / 0.155 | — | — | 0.000 / 0.000 / 0.000 | D |
| `key-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 70.62 / 51.88 / 38.07 | 0.123 / 0.130 / 0.149 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `key-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 64.87 / 49.03 / 35.71 | 0.113 / 0.123 / 0.139 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `key-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 74.92 / 55.67 / 41.33 | 0.130 / 0.139 / 0.161 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `key-5` | box | — | 20×10 | 16×8 | 14×6 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 61.86 / 47.55 / 32.88 | 0.107 / 0.119 / 0.128 | — | — | 0.000 / 0.000 / 0.000 | D |
| `key-6` | box | — | 10×20 | 8×16 | 6×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 61.86 / 47.55 / 32.88 | 0.107 / 0.119 / 0.128 | — | — | 0.000 / 0.000 / 0.000 | D |
| `keyboard` | box | — | 20×12 | 16×11 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 7/6/6 | 107.64 / 85.43 / 64.05 | 0.187 / 0.214 / 0.250 | 0.700 / 0.625 / 0.607 | 3 / 3 / 2.75 | 0.000 / 0.000 / 0.000 | — |
| `keyboard-2` | box | — | 20×18 | 16×15 | 14×13 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 8/7/7 | 121.16 / 94.77 / 69.8 | 0.210 / 0.237 / 0.273 | — | — | 0.000 / 0.000 / 0.000 | — |
| `language` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 6/6/6 | 81.46 / 63.63 / 45.25 | 0.141 / 0.159 / 0.177 | — | — | 5.998 / 5.996 / 6.000 | KAD |
| `language-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 160.76 / 122.92 / 90.64 | 0.279 / 0.307 / 0.354 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `language-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 182.89 / 138.07 / 102.15 | 0.318 / 0.345 / 0.399 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 |  /  /  | KADM |
| `layout-footer` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-footer-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-footer-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-footer-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 108.16 / 79.78 / 56.63 | 0.188 / 0.199 / 0.221 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `layout-header` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-header-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-header-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-header-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 108.16 / 79.78 / 56.63 | 0.188 / 0.199 / 0.221 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `layout-sidebar` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 108.16 / 79.78 / 56.63 | 0.188 / 0.199 / 0.221 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `layout-sidebar-right` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-right-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-right-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 115.07 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `layout-sidebar-right-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 108.16 / 79.78 / 56.63 | 0.188 / 0.199 / 0.221 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `lightbulb` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 82.74 / 60.46 / 44.76 | 0.144 / 0.151 / 0.175 | — | — | 4.065 / 4.065 / 9.615 | KD |
| `lightbulb-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 86.69 / 61.48 / 45.03 | 0.150 / 0.154 / 0.176 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lightbulb-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 85.05 / 62.75 / 45.44 | 0.148 / 0.157 / 0.177 | — | — | 5.795 / 6.318 / 11.060 | KD |
| `lightbulb-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 75.41 / 56.12 / 40.61 | 0.131 / 0.140 / 0.159 | — | — | 7.727 / 8.424 / 14.746 | KD |
| `link` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 91.97 / 69.86 / 50.03 | 0.160 / 0.175 / 0.195 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `link-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 90.74 / 70.51 / 51.12 | 0.158 / 0.176 / 0.200 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `link-3` | box | — | 20×12 | 16×10 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 81.75 / 63.35 / 47.15 | 0.142 / 0.158 / 0.184 | — | — | 0.000 / 0.000 / 0.000 | D |
| `list-bullet` | mark | — | 17.5×11 | 13.75×11 | 11.63×10.75 | 0.729 / 0.688 / 0.727 | -5.6 | -0.3 | 6/6/6 | 68.74 / 52.99 / 36.26 | 0.119 / 0.132 / 0.142 | — | — | 0.000 / 0.000 / 0.000 | D |
| `list-bullet-2` | mark | — | 17.5×14 | 13.75×12.7 | 11.75×11.4 | 0.729 / 0.688 / 0.734 | -5.6 | +0.7 | 6/6/6 | 75.97 / 56.2 / 40.7 | 0.132 / 0.141 / 0.159 | — | — | 0.000 / 0.000 / 0.000 | D |
| `list-bullet-3` | mark | — | 18×12.5 | 14×12.5 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 66.49 / 54.49 / 39.86 | 0.115 / 0.136 / 0.156 | — | — | 0.000 / 0.000 / 0.000 | D |
| `list-ordered` | mark | — | 17.99×14.5 | 13.99×14 | 11.94×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/5 | 79.3 / 61.3 / 43.87 | 0.138 / 0.153 / 0.171 | — | — | 0.293 / 0.293 / 0.752 | D |
| `lock` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 101.92 / 76.78 / 55.16 | 0.177 / 0.192 / 0.215 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lock-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 104.22 / 77.67 / 55.52 | 0.181 / 0.194 / 0.217 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lock-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 92.95 / 70.87 / 50.58 | 0.161 / 0.177 / 0.198 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lock-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 98.06 / 74.19 / 53.29 | 0.170 / 0.185 / 0.208 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lock-5` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 106.33 / 79.8 / 57.31 | 0.185 / 0.200 / 0.224 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `lock-6` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 102.47 / 77.21 / 55.44 | 0.178 / 0.193 / 0.217 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `login` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 75.56 / 57.59 / 42.34 | 0.131 / 0.144 / 0.165 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `login-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 74.06 / 57.59 / 42.03 | 0.129 / 0.144 / 0.164 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `login-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 75.56 / 57.59 / 42.34 | 0.131 / 0.144 / 0.165 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `login-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 74.06 / 57.59 / 42.03 | 0.129 / 0.144 / 0.164 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `logout` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 75.56 / 57.59 / 42.34 | 0.131 / 0.144 / 0.165 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `logout-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 74.06 / 57.59 / 42.03 | 0.129 / 0.144 / 0.164 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `logout-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 75.56 / 57.59 / 42.34 | 0.131 / 0.144 / 0.165 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `logout-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 74.06 / 57.59 / 42.03 | 0.129 / 0.144 / 0.164 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `mail` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 121.42 / 91.76 / 66.68 | 0.211 / 0.229 / 0.260 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 5.141 / 5.377 / 5.409 | KDM |
| `mail-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 120.22 / 90.62 / 65.8 | 0.209 / 0.227 / 0.257 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 7.206 / 6.916 / 6.811 | KDM |
| `mail-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 118.93 / 89.17 / 64.37 | 0.206 / 0.223 / 0.251 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 4.166 / 4.130 / 4.292 | KADM |
| `map-pin` | keyline | portrait | 16×20 | 12×15.5 | 10×13.5 | 0.833 / 0.775 / 0.844 | -7.0 | +1.3 | 2/2/2 | 106.06 / 77.39 / 51.08 | 0.184 / 0.193 / 0.200 | 0.400 / 0.387 / 0.296 | 4 / 3 / 3 | 6.753 / 10.781 / 13.854 | KD |
| `map-pin-2` | keyline | portrait | 16×20 | 12×15.5 | 10×13.5 | 0.833 / 0.775 / 0.844 | -7.0 | +1.3 | 2/2/2 | 107.33 / 78.26 / 51.68 | 0.186 / 0.196 / 0.202 | 0.400 / 0.387 / 0.296 | 4 / 3 / 3 |  /  /  | KD |
| `map-pin-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 115.45 / 86.37 / 62.41 | 0.200 / 0.216 / 0.244 | — | — | 4.686 / 8.130 / 8.773 | KAD |
| `map-pin-4` | box | — | 16×18.69 | 12×13.86 | 10×11.55 | 0.779 / 0.693 / 0.722 | -11.0 | -7.3 | 2/2/2 | 103.11 / 73.6 / 47.29 | 0.179 / 0.184 / 0.185 | 0.428 / 0.433 / 0.346 | 4 / 3 / 3 | 0.062 / 0.000 / 0.000 | AD |
| `map-pin-5` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 98.21 / 73 / 51.92 | 0.171 / 0.182 / 0.203 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `maximize` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 54.62 / 40.91 / 29.22 | 0.095 / 0.102 / 0.114 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `maximize-2` | mark | — | 15×15 | 12.5×12.5 | 10.5×10.5 | 0.625 / 0.625 / 0.656 | +0.0 | +5.0 | 4/4/4 | 47.11 / 38.11 / 26.09 | 0.082 / 0.095 / 0.102 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `maximize-3` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 69.2 / 51.84 / 35.29 | 0.120 / 0.130 / 0.138 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `maximize-4` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 64.35 / 51.47 / 38.01 | 0.112 / 0.129 / 0.148 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `maximize-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/5 | 85.04 / 59.98 / 46.37 | 0.148 / 0.150 / 0.181 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `megaphone` | keyline | square | 17.75×18.37 | 13.78×14.47 | 11.7×12.3 | 0.765 / 0.724 / 0.769 | -5.4 | +0.5 | 2/2/2 | 77.65 / 59.61 / 42.12 | 0.135 / 0.149 / 0.165 | — | — | 5.282 / 5.312 / 5.272 | KAD |
| `megaphone-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 101.74 / 76.21 / 54.48 | 0.177 / 0.191 / 0.213 | 0.300 / 0.313 / 0.304 | 0 / 0 / 0 | 4.097 / 4.097 / 4.097 | KDM |
| `megaphone-3` | keyline | landscape | 20×16 | 15.99×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 87.9 / 66.35 / 46.16 | 0.153 / 0.166 / 0.180 | — | — | 5.267 / 5.267 / 5.267 | KD |
| `menu` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 3/3/3 | 66.04 / 59.29 / 44.02 | 0.115 / 0.148 / 0.172 | — | — | 0.000 / 0.000 / 0.000 | D |
| `menu-2` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 3/3/3 | 45.04 / 39.79 / 29.02 | 0.078 / 0.099 / 0.113 | — | — | 0.000 / 0.000 / 0.000 | D |
| `menu-3` | mark | — | 15×7.5 | 13.5×7.5 | 12×7.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 33.52 / 29.77 / 21.84 | 0.058 / 0.074 / 0.085 | — | — | 0.000 / 0.000 / 0.000 | D |
| `menu-4` | mark | — | 15×9 | 13.5×9 | 12×8.75 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 44.02 / 39.52 / 29.34 | 0.076 / 0.099 / 0.115 | — | — | 0.000 / 0.000 / 0.000 | D |
| `menu-arrow-left` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 4/4/4 | 53.45 / 46.82 / 35.02 | 0.093 / 0.117 / 0.137 | — | — | 0.000 / 0.000 / 0.550 | D |
| `menu-arrow-right` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 4/4/4 | 53.45 / 46.82 / 35.02 | 0.093 / 0.117 / 0.137 | — | — | 0.000 / 0.000 / 0.550 | D |
| `message` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 90.04 / 67.91 / 48.67 | 0.156 / 0.170 / 0.190 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `message-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 87.47 / 65.83 / 47.33 | 0.152 / 0.165 / 0.185 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `message-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 92.17 / 72.18 / 52.98 | 0.160 / 0.180 / 0.207 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `message-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 112.87 / 84.79 / 60.24 | 0.196 / 0.212 / 0.235 | 0.556 / 0.536 / 0.500 | 4 / 3.25 / 2.88 | 0.000 / 0.000 / 0.000 | KAD |
| `message-5` | keyline | circle | 20×20 | 16×16 | 13.99×13.99 | 0.833 / 0.800 / 0.874 | -4.0 | +4.9 | 1/1/1 | 90.12 / 70.59 / 51.17 | 0.156 / 0.176 / 0.200 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `message-6` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 80.37 / 61.31 / 44.39 | 0.140 / 0.153 / 0.173 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `message-7` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 82.34 / 62.58 / 44.9 | 0.143 / 0.156 / 0.175 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `microphone` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/3 | 91.17 / 68.76 / 46.29 | 0.158 / 0.172 / 0.181 | — | — | 0.000 / 0.000 / 0.000 | K |
| `microphone-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 99.07 / 72.75 / 49.56 | 0.172 / 0.182 / 0.194 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `microphone-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 90.66 / 68.25 / 49.73 | 0.157 / 0.171 / 0.194 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `microphone-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 90.78 / 67.94 / 49.35 | 0.158 / 0.170 / 0.193 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `microphone-5` | box | — | 14×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 100.37 / 74.25 / 49.56 | 0.174 / 0.186 / 0.194 | — | — | 0.000 / 0.000 / 0.000 | D |
| `minus` | mark | — | 15×1.5 | 13.5×1.5 | 12×1.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 1/1/1 | 22.01 / 19.76 / 14.67 | 0.038 / 0.049 / 0.057 | — | — | 0.000 / 0.000 / 0.000 | D |
| `minus-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 102.43 / 79.82 / 57.9 | 0.178 / 0.200 / 0.226 | 0.525 / 0.500 / 0.464 | 4.75 / 4 / 3.75 | 0.000 / 0.000 / 0.000 | KAD |
| `minus-circle-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 100.18 / 78.32 / 56.65 | 0.174 / 0.196 / 0.221 | 0.450 / 0.438 / 0.393 | 5.5 / 4.5 / 4.25 | 0.000 / 0.000 / 0.000 | KAD |
| `minus-large` | mark | — | 18×1.5 | 16×1.5 | 14×1.25 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 1/1/1 | 26.51 / 23.51 / 17.17 | 0.046 / 0.059 / 0.067 | — | — | 0.000 / 0.000 / 0.000 | D |
| `minus-small` | mark | — | 12×1.5 | 11×1.5 | 10×1.25 | 0.500 / 0.550 / 0.625 | +10.0 | +25.0 | 1/1/1 | 17.51 / 16.01 / 12.17 | 0.030 / 0.040 / 0.048 | — | — | 0.000 / 0.000 / 0.000 | D |
| `moon` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 94.88 / 73.63 / 54.29 | 0.165 / 0.184 / 0.212 | — | — |  /  /  | KAD |
| `more-horizontal` | mark | — | 15×3 | 13.5×2.7 | 11.5×2.4 | 0.625 / 0.675 / 0.719 | +8.0 | +15.0 | 3/3/3 | 21.19 / 17.17 / 13.56 | 0.037 / 0.043 / 0.053 | — | — |  /  /  | D |
| `more-vertical` | mark | — | 3×15 | 2.7×13.5 | 2.4×11.5 | 0.625 / 0.675 / 0.719 | +8.0 | +15.0 | 3/3/3 | 21.19 / 17.17 / 13.56 | 0.037 / 0.043 / 0.053 | — | — |  /  /  | D |
| `package` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 120.22 / 89.75 / 64.22 | 0.209 / 0.224 / 0.251 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `package-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 114.07 / 85.05 / 61 | 0.198 / 0.213 / 0.238 | — | — | 12.311 / 12.298 / 12.291 | KAD |
| `package-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 139.43 / 107.52 / 79.09 | 0.242 / 0.269 / 0.309 | — | — | 10.483 / 10.506 / 10.500 | KAD |
| `paintbrush` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 122.52 / 90.91 / 64.77 | 0.213 / 0.227 / 0.253 | 0.800 / 0.750 / 0.714 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KD |
| `paintbrush-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 57.45 / 45.1 / 31.9 | 0.100 / 0.113 / 0.125 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `paintbrush-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 69.8 / 52.62 / 37.91 | 0.121 / 0.132 / 0.148 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `paintbrush-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 57.32 / 43.6 / 31.39 | 0.100 / 0.109 / 0.123 | — | — | 0.037 / 0.000 / 0.007 | KAD |
| `paintbrush-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 66.01 / 50.45 / 35.63 | 0.115 / 0.126 / 0.139 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `paintbrush-6` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 76.17 / 58.19 / 41.94 | 0.132 / 0.145 / 0.164 | — | — | 0.000 / 0.000 / 0.006 | KAD |
| `paintbrush-7` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 72.49 / 54.88 / 38.9 | 0.126 / 0.137 / 0.152 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `paintbrush-8` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 60.96 / 47.11 / 34.02 | 0.106 / 0.118 / 0.133 | — | — | 0.000 / 0.000 / 0.005 | KAD |
| `pencil` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 75.67 / 56.7 / 41.33 | 0.131 / 0.142 / 0.161 | 0.250 / 0.268 / 0.271 | 1.68 / 1.78 / 1.62 | 4.977 / 4.925 / 5.003 | KAD |
| `pencil-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 76.58 / 57.21 / 41.84 | 0.133 / 0.143 / 0.163 | 0.250 / 0.268 / 0.271 | 1.42 / 1.64 / 1.45 | 0.000 / 0.000 / 0.000 | KAD |
| `pencil-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 77.8 / 57.83 / 42.28 | 0.135 / 0.145 / 0.165 | 0.278 / 0.286 / 0.292 | 1.68 / 1.78 / 1.62 | 0.000 / 0.000 / 0.000 | KAD |
| `pencil-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 91.53 / 67.46 / 48.84 | 0.159 / 0.169 / 0.191 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `phone` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 1/1/1 | 85.92 / 63.76 / 46 | 0.149 / 0.159 / 0.180 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `pin` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 80.59 / 60.22 / 43.68 | 0.140 / 0.151 / 0.171 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `pin-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 89.28 / 70.63 / 51.33 | 0.155 / 0.177 / 0.201 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `pin-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 84.58 / 61.52 / 44.82 | 0.147 / 0.154 / 0.175 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `pin-4` | keyline | square | 17.92×17.92 | 14.17×14.17 | 12×12 | 0.747 / 0.709 / 0.750 | -5.1 | +0.4 | 2/2/2 | 85.5 / 67.52 / 48.16 | 0.148 / 0.169 / 0.188 | 0.279 / 0.300 / 0.302 | 0.84 / 0.59 / 0.44 | 0.000 / 0.000 / 0.000 | KAD |
| `pin-5` | keyline | square | 17.59×17.59 | 14.09×14.09 | 12.06×12.06 | 0.733 / 0.705 / 0.754 | -3.8 | +2.9 | 2/2/2 | 78.09 / 59.53 / 43.13 | 0.136 / 0.149 / 0.168 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `pin-6` | keyline | square | 17.71×17.71 | 14.07×14.07 | 11.9×11.9 | 0.738 / 0.704 / 0.744 | -4.6 | +0.8 | 2/2/2 | 80.64 / 62.77 / 44.83 | 0.140 / 0.157 / 0.175 | 0.282 / 0.302 / 0.305 | 0.84 / 0.59 / 0.44 | 0.000 / 0.000 / 0.000 | KAD |
| `play` | mark | — | 16×18 | 12×13 | 10×11 | 0.750 / 0.650 / 0.688 | -13.3 | -8.3 | 1/1/1 | 74.38 / 52.81 / 37 | 0.129 / 0.132 / 0.145 | — | — | 9.726 / 10.428 / 10.115 | D |
| `play-2` | mark | — | 16×18 | 12×13 | 10×11 | 0.750 / 0.650 / 0.688 | -13.3 | -8.3 | 1/1/1 | 74.14 / 52.62 / 36.88 | 0.129 / 0.132 / 0.144 | — | — | 9.210 / 10.012 / 9.701 | D |
| `play-3` | mark | — | 14×16 | 10×11 | 8×9 | 0.667 / 0.550 / 0.563 | -17.5 | -15.6 | 1/1/1 | 64.89 / 43.25 / 29.01 | 0.113 / 0.108 / 0.113 | — | — | 9.614 / 10.170 / 9.614 | D |
| `plug` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 81.76 / 60.67 / 43.77 | 0.142 / 0.152 / 0.171 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plug-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 85.31 / 62.91 / 45.47 | 0.148 / 0.157 / 0.178 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plug-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 5/5/5 | 80.65 / 59.23 / 42.72 | 0.140 / 0.148 / 0.167 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plug-4` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 87.24 / 66.14 / 47.67 | 0.151 / 0.165 / 0.186 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plug-5` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 81.76 / 60.67 / 43.77 | 0.142 / 0.152 / 0.171 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plug-6` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 85.6 / 65.99 / 45.98 | 0.149 / 0.165 / 0.180 | — | — | 1.530 / 1.437 / 1.610 | KAD |
| `plug-7` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 91.67 / 67.74 / 48.7 | 0.159 / 0.169 / 0.190 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `plus` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 2/2/2 | 41.77 / 37.27 / 27.78 | 0.073 / 0.093 / 0.109 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `plus-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 115.45 / 89.08 / 64.13 | 0.200 / 0.223 / 0.251 | 0.525 / 0.500 / 0.464 | 4.75 / 4 / 3.75 | 0.000 / 0.000 / 0.000 | KAD |
| `plus-circle-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 110.95 / 86.08 / 61.63 | 0.193 / 0.215 / 0.241 | 0.450 / 0.438 / 0.393 | 5.5 / 4.5 / 4.25 | 0.000 / 0.000 / 0.000 | KAD |
| `plus-large` | mark | square | 18×18 | 16×16 | 14×14 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 2/2/2 | 50.77 / 44.77 / 32.78 | 0.088 / 0.112 / 0.128 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `plus-small` | mark | — | 12×12 | 11×11 | 10×10 | 0.500 / 0.550 / 0.625 | +10.0 | +25.0 | 2/2/2 | 32.77 / 29.77 / 22.78 | 0.057 / 0.074 / 0.089 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `presentation` | box | — | 20×18 | 16×14 | 14×12 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 5/5/5 | 109.02 / 82.98 / 59.3 | 0.189 / 0.207 / 0.232 | — | — | 0.000 / 0.000 / 0.000 | D |
| `presentation-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 132.92 / 103.79 / 77.18 | 0.231 / 0.259 / 0.301 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `printer` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 142.29 / 108.56 / 80.44 | 0.247 / 0.271 / 0.314 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `printer-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 130.87 / 102.82 / 75.29 | 0.227 / 0.257 / 0.294 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `puzzle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 96.53 / 73.49 / 55.09 | 0.168 / 0.184 / 0.215 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `puzzle-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 104.79 / 82.09 / 58.1 | 0.182 / 0.205 / 0.227 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `puzzle-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 113.14 / 82.72 / 60.78 | 0.196 / 0.207 / 0.237 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `puzzle-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 131.31 / 101.1 / 75.27 | 0.228 / 0.253 / 0.294 | 0.775 / 0.766 / 0.768 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `puzzle-5` | keyline | circle | 19.94×19.94 | 15.78×15.78 | 13.69×13.69 | 0.831 / 0.789 / 0.856 | -5.1 | +3.0 | 1/1/1 | 111.73 / 93.42 / 63.49 | 0.194 / 0.234 / 0.248 | — | — | 0.000 / 0.675 / 0.000 | KAD |
| `refresh` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 98.02 / 72.73 / 51.72 | 0.170 / 0.182 / 0.202 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `refresh-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 111.12 / 85.74 / 62.65 | 0.193 / 0.214 / 0.245 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `refresh-3` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 98.81 / 72.66 / 51.72 | 0.172 / 0.182 / 0.202 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw` | mark | square | 17.87×17.88 | 13.58×13.58 | 11.4×11.4 | 0.745 / 0.679 / 0.713 | -8.9 | -4.3 | 2/2/2 | 87.3 / 63.76 / 44.61 | 0.152 / 0.159 / 0.174 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-10` | mark | square | 18×17.79 | 14×13.76 | 12×11.95 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 63.55 / 49.56 / 35.94 | 0.110 / 0.124 / 0.140 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-11` | mark | square | 18×17.79 | 14×13.97 | 12×11.92 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 80.44 / 60.86 / 43.41 | 0.140 / 0.152 / 0.170 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-2` | mark | square | 17.88×17.88 | 13.57×13.58 | 11.4×11.4 | 0.745 / 0.679 / 0.713 | -8.9 | -4.3 | 2/2/2 | 77.73 / 58.44 / 41.7 | 0.135 / 0.146 / 0.163 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-3` | mark | square | 17.88×17.88 | 13.57×13.58 | 11.4×11.4 | 0.745 / 0.679 / 0.713 | -8.9 | -4.3 | 2/2/2 | 68.16 / 51.57 / 37.01 | 0.118 / 0.129 / 0.145 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-4` | mark | square | 17.88×18 | 13.57×13.75 | 11.4×11.75 | 0.750 / 0.688 / 0.734 | -8.3 | -2.1 | 3/3/3 | 105.58 / 74.69 / 52.22 | 0.183 / 0.187 / 0.204 | — | — | 0.000 / 0.000 / 0.000 | D |
| `rotate-ccw-5` | mark | square | 18×17.79 | 14×13.76 | 12×11.95 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 91.32 / 68.27 / 49.65 | 0.159 / 0.171 / 0.194 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-6` | mark | square | 18×17.76 | 14×13.97 | 12×11.92 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 102.49 / 73.73 / 52.45 | 0.178 / 0.184 / 0.205 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-7` | mark | — | 17.48×17.79 | 13.44×13.76 | 11.7×11.95 | 0.741 / 0.688 / 0.747 | -7.2 | +0.8 | 2/2/2 | 50.4 / 39.06 / 28.93 | 0.087 / 0.098 / 0.113 | — | — | 0.000 / 0.077 / 0.000 | AD |
| `rotate-ccw-8` | mark | square | 18×17.79 | 14×13.76 | 12×11.95 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 64.31 / 49.83 / 35.89 | 0.112 / 0.125 / 0.140 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `rotate-ccw-9` | mark | square | 18×17.79 | 14×13.76 | 12×11.95 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 83.18 / 57.07 / 41.19 | 0.144 / 0.143 / 0.161 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `save` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 137.09 / 98.66 / 72.74 | 0.238 / 0.247 / 0.284 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `search` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 75.28 / 56.66 / 41.29 | 0.131 / 0.142 / 0.161 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `search-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 79.66 / 59.6 / 43.62 | 0.138 / 0.149 / 0.170 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `search-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 69.44 / 52.32 / 37.66 | 0.121 / 0.131 / 0.147 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `send` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 87.28 / 64.07 / 45.43 | 0.152 / 0.160 / 0.177 | — | — | 15.998 / 16.026 / 15.999 | AD |
| `shield` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 84.44 / 64.27 / 46.45 | 0.147 / 0.161 / 0.181 | — | — | 7.439 / 7.449 / 7.328 | KD |
| `shield-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 82.65 / 63.09 / 45.47 | 0.143 / 0.158 / 0.178 | — | — | 11.158 / 11.174 / 10.992 | KD |
| `sliders` | mark | — | 18×15 | 14×12 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 6/6/6 | 77.66 / 59.22 / 46.43 | 0.135 / 0.148 / 0.181 | — | — | 0.000 / 0.000 / 0.000 | D |
| `sliders-2` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 9/9/6 | 83.36 / 56.36 / 51.47 | 0.145 / 0.141 / 0.201 | — | — | 0.000 / 0.000 / 0.000 | A |
| `sliders-3` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 9/9/6 | 116.48 / 84.11 / 46.43 | 0.202 / 0.210 / 0.181 | — | — | 0.000 / 0.000 / 0.000 | A |
| `sliders-4` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 6/6/6 | 98.32 / 73.57 / 51.47 | 0.171 / 0.184 / 0.201 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `sliders-5` | mark | — | 18×15 | 14×12 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 78.05 / 59.59 / 46.7 | 0.136 / 0.149 / 0.182 | — | — | 0.000 / 0.000 / 0.000 | D |
| `sort` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 4/4/4 | 77.54 / 68.79 / 51.68 | 0.135 / 0.172 / 0.202 | — | — | 0.000 / 0.000 / 0.470 | D |
| `sort-2` | box | square | 18×18 | 16×16 | 14×14 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 4/4/4 | 69.29 / 61.29 / 45.43 | 0.120 / 0.153 / 0.177 | — | — | 0.000 / 0.000 / 0.470 | AD |
| `sort-3` | box | — | 18×11.52 | 16×11.02 | 14×9 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 5/5/5 | 56.87 / 49.24 / 35.54 | 0.099 / 0.123 / 0.139 | — | — | 0.000 / 0.000 / 0.286 | D |
| `sort-alpha-ascending` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 5/5/5 | 79.75 / 72.34 / 53.96 | 0.138 / 0.181 / 0.211 | — | — | 5.449 / 4.867 / 4.497 | D |
| `sort-alpha-ascending-2` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 71.9 / 65.48 / 48.57 | 0.125 / 0.164 / 0.190 | — | — | 5.449 / 4.867 / 4.386 | D |
| `sort-alpha-ascending-3` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 71.9 / 65.48 / 48.57 | 0.125 / 0.164 / 0.190 | — | — | 5.449 / 4.867 / 4.386 | D |
| `sort-alpha-descending` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 5/5/5 | 79.75 / 72.34 / 53.96 | 0.138 / 0.181 / 0.211 | — | — | 5.449 / 4.867 / 4.497 | D |
| `sort-alpha-descending-2` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 71.9 / 65.48 / 48.57 | 0.125 / 0.164 / 0.190 | — | — | 5.449 / 4.867 / 4.386 | D |
| `sort-alpha-descending-3` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 71.9 / 65.48 / 48.57 | 0.125 / 0.164 / 0.190 | — | — | 5.449 / 4.867 / 4.386 | D |
| `sort-ascending` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 5/5/5 | 60.93 / 54.3 / 39.85 | 0.106 / 0.136 / 0.156 | — | — | 0.000 / 0.000 / 0.235 | AD |
| `sort-descending` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 5/5/5 | 60.93 / 54.3 / 39.85 | 0.106 / 0.136 / 0.156 | — | — | 0.000 / 0.000 / 0.235 | AD |
| `sort-numeric-ascending` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 5/5/5 | 75.05 / 64.7 / 47.74 | 0.130 / 0.162 / 0.186 | — | — | 2.505 / 2.507 / 2.666 | D |
| `sort-numeric-ascending-2` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 67.19 / 57.84 / 42.35 | 0.117 / 0.145 / 0.165 | — | — | 2.505 / 2.507 / 2.499 | D |
| `sort-numeric-ascending-3` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 67.19 / 57.84 / 42.35 | 0.117 / 0.145 / 0.165 | — | — | 2.505 / 2.507 / 2.499 | D |
| `sort-numeric-descending` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 5/5/5 | 75.05 / 64.7 / 47.74 | 0.130 / 0.162 / 0.186 | — | — | 2.505 / 2.507 / 2.666 | D |
| `sort-numeric-descending-2` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 67.19 / 57.84 / 42.35 | 0.117 / 0.145 / 0.165 | — | — | 2.505 / 2.507 / 2.499 | D |
| `sort-numeric-descending-3` | box | — | 18×15 | 16×13.5 | 14×12 | 0.750 / 0.800 / 0.875 | +6.7 | +16.7 | 6/6/6 | 67.19 / 57.84 / 42.35 | 0.117 / 0.145 / 0.165 | — | — | 2.505 / 2.507 / 2.499 | D |
| `sparkle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 88.16 / 69.38 / 50.49 | 0.153 / 0.173 / 0.197 | — | — | 13.303 / 11.808 / 13.399 | KAD |
| `sparkle-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 90.29 / 71.68 / 49.96 | 0.157 / 0.179 / 0.195 | — | — | 12.168 / 13.910 / 14.145 | KAD |
| `sparkle-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 98.26 / 75.94 / 54.59 | 0.171 / 0.190 / 0.213 | — | — | 15.796 / 16.839 / 16.084 | KAD |
| `sparkle-4` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 95.42 / 73.04 / 50.56 | 0.166 / 0.183 / 0.198 | — | — | 14.841 / 16.790 / 16.040 | KAD |
| `star` | box | — | 20×19.16 | 16×15.36 | 14×13.44 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 1/1/1 | 97.28 / 75.87 / 55.69 | 0.169 / 0.190 / 0.218 | — | — | 11.392 / 11.399 / 11.392 | AD |
| `store` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 136.31 / 101.51 / 71.77 | 0.237 / 0.254 / 0.280 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `store-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/5 | 142.8 / 106.49 / 75.84 | 0.248 / 0.266 / 0.296 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `sun` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 9/9/9 | 79.85 / 57.91 / 41.07 | 0.139 / 0.145 / 0.160 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `table` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 155.57 / 114.87 / 83.03 | 0.270 / 0.287 / 0.324 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `table-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 135.32 / 100.62 / 72.72 | 0.235 / 0.252 / 0.284 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `target` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 141.32 / 110.89 / 79.74 | 0.245 / 0.277 / 0.311 | 0.575 / 0.594 / 0.571 | 4.25 / 3.25 / 3 |  /  /  | KADM |
| `target-2` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 6/6/6 | 115.7 / 90.97 / 66.42 | 0.201 / 0.227 / 0.259 | 1.000 / 1.000 / 1.000 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | KADM |
| `target-3` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 6/6/6 | 83.95 / 65.42 / 48.3 | 0.146 / 0.164 / 0.189 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `text` | mark | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 67.05 / 51.3 / 36.48 | 0.116 / 0.128 / 0.143 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `text-2` | mark | — | 15×10.5 | 13.5×10.5 | 12×10.25 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 3/3/3 | 57.04 / 51.04 / 37.77 | 0.099 / 0.128 / 0.148 | — | — | 0.000 / 0.000 / 0.000 | D |
| `text-3` | mark | — | 15×18 | 13.5×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 61.78 / 52.03 / 37.93 | 0.107 / 0.130 / 0.148 | — | — | 0.000 / 0.000 / 0.000 | D |
| `text-4` | mark | — | 15×15 | 13.5×13.5 | 12×12 | 0.625 / 0.675 / 0.750 | +8.0 | +20.0 | 3/3/3 | 58.05 / 49.8 / 36.48 | 0.101 / 0.125 / 0.143 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `thumbs-up` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 101.4 / 75.72 / 54.4 | 0.176 / 0.189 / 0.212 | — | — | 2.045 / 2.048 / 2.048 | KAD |
| `thumbs-up-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 101.75 / 76 / 54.62 | 0.177 / 0.190 / 0.213 | 0.667 / 0.679 / 0.667 | 0 / 0 / 0 | 2.304 / 2.304 / 2.305 | KADM |
| `toggle-on` | box | — | 20×12 | 16×10 | 14×8 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 90.03 / 70.7 / 49.72 | 0.156 / 0.177 / 0.194 | — | — | 0.000 / 0.000 / 0.000 | D |
| `toggle-on-2` | box | — | 20×14 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 86.33 / 67.73 / 47.76 | 0.150 / 0.169 / 0.187 | — | — | 0.000 / 0.000 / 0.000 | D |
| `trash` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/4 | 107.73 / 80.64 / 55.07 | 0.187 / 0.202 / 0.215 | — | — | 0.893 / 0.884 / 0.999 | KA |
| `trash-5` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/4 | 103.35 / 76.28 / 50.11 | 0.179 / 0.191 / 0.196 | — | — | 0.894 / 0.881 / 1.143 | KA |
| `upload` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 75.56 / 57.59 / 42.34 | 0.131 / 0.144 / 0.165 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `upload-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 71.06 / 55.34 / 40.78 | 0.123 / 0.138 / 0.159 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `upload-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 3/3/3 | 81.56 / 62.09 / 44.84 | 0.142 / 0.155 / 0.175 | — | — | 0.000 / 0.000 / 0.235 | KAD |
| `user` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 89.85 / 65.36 / 46.47 | 0.156 / 0.163 / 0.182 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `user-2` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 93.84 / 69.33 / 47.92 | 0.163 / 0.173 / 0.187 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `user-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 79.42 / 59.27 / 40.04 | 0.138 / 0.148 / 0.156 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `user-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 72.25 / 53.89 / 36.4 | 0.125 / 0.135 / 0.142 | — | — |  /  /  | KAD |
| `users` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 107.11 / 73.05 / 53.46 | 0.186 / 0.183 / 0.209 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-2` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 108.65 / 73.56 / 53.26 | 0.189 / 0.184 / 0.208 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-2-behind` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 107.2 / 77.13 / 54.55 | 0.186 / 0.193 / 0.213 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-2-level` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 116.55 / 78.98 / 54.2 | 0.202 / 0.197 / 0.212 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `users-2-wide` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 114.05 / 78.9 / 54.12 | 0.198 / 0.197 / 0.211 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `users-3` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 94.14 / 67.21 / 45.17 | 0.163 / 0.168 / 0.176 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-3-behind` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 96.64 / 67.83 / 47.59 | 0.168 / 0.170 / 0.186 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-3-level` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 93.63 / 65.38 / 40.33 | 0.163 / 0.163 / 0.158 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `users-3-wide` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 92.94 / 66.1 / 44.26 | 0.161 / 0.165 / 0.173 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `users-4` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 90.94 / 66.14 / 46.13 | 0.158 / 0.165 / 0.180 | — | — |  /  /  | KAD |
| `users-4-behind` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/3 | 89.32 / 68.09 / 42.36 | 0.155 / 0.170 / 0.165 | — | — |  /  /  | KA |
| `users-4-level` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 92.94 / 65.14 / 42.94 | 0.161 / 0.163 / 0.168 | — | — |  /  /  | KD |
| `users-4-wide` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 90.16 / 68.18 / 47.72 | 0.157 / 0.170 / 0.186 | — | — |  /  /  | KD |
| `users-behind` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 4/4/4 | 106.39 / 74.9 / 56.53 | 0.185 / 0.187 / 0.221 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `users-level` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 109.88 / 76.12 / 51.75 | 0.191 / 0.190 / 0.202 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `users-wide` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 109.72 / 79.08 / 55.06 | 0.190 / 0.198 / 0.215 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `volume` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 99.29 / 73.47 / 50.95 | 0.172 / 0.184 / 0.199 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `volume-low` | anchor | — | 15×16 | 12×12 | 10.5×10 | 0.667 / 0.600 / 0.656 | -10.0 | -1.6 | 2/2/2 | 74.13 / 54.95 / 38.11 | 0.129 / 0.137 / 0.149 | — | — | 0.000 / 0.000 / 0.000 | D |
| `volume-minus` | anchor | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 72.17 / 53.24 / 37.3 | 0.125 / 0.133 / 0.146 | — | — | 0.000 / 0.000 / 0.000 | D |
| `volume-none` | anchor | — | 10×16 | 8×12 | 7×10 | 0.667 / 0.600 / 0.625 | -10.0 | -6.3 | 1/1/1 | 60.65 / 44.73 / 31.38 | 0.105 / 0.112 / 0.123 | — | — | 0.000 / 0.000 / 0.000 | D |
| `volume-off` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 2/2/2 | 91.45 / 67.09 / 47.74 | 0.159 / 0.168 / 0.186 | — | — | 0.000 / 0.000 / 0.000 | KAD |
| `volume-plus` | anchor | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 81.43 / 59.5 / 41.66 | 0.141 / 0.149 / 0.163 | — | — | 0.000 / 0.000 / 0.000 | D |
| `volume-x` | anchor | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 89.21 / 64.9 / 45.63 | 0.155 / 0.162 / 0.178 | — | — | 0.000 / 0.000 / 0.000 | D |
| `wallet` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 2/2/2 | 107.98 / 81.84 / 58.15 | 0.187 / 0.205 / 0.227 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `wallet-2` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/2/2 | 126.31 / 86.05 / 61.57 | 0.219 / 0.215 / 0.241 | 0.450 / 0.406 / 0.393 | 0 / 0 / 0 | 0.000 / 0.000 / 0.000 | K |
| `wallet-3` | keyline | landscape | 20×16 | 16×12 | 14×10 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 117.18 / 87.69 / 61.35 | 0.203 / 0.219 / 0.240 | — | — | 0.000 / 0.000 / 0.000 | KD |
| `wand` | keyline | square | 18×18 | 14×14 | 12×12 | 0.750 / 0.700 / 0.750 | -6.7 | +0.0 | 5/5/6 | 101.31 / 78.52 / 56.17 | 0.176 / 0.196 / 0.219 | — | — | 7.159 / 10.534 / 8.906 | KA |
| `wand-2` | keyline | square | 17.77×17.93 | 13.84×13.96 | 11.86×11.97 | 0.747 / 0.698 / 0.748 | -6.6 | +0.1 | 5/5/6 | 73.57 / 53.89 / 39.82 | 0.128 / 0.135 / 0.156 | — | — | 7.127 / 7.133 / 6.711 | KA |
| `wand-3` | keyline | square | 17.77×17.93 | 13.84×13.96 | 11.86×11.97 | 0.747 / 0.698 / 0.748 | -6.6 | +0.1 | 3/3/3 | 50.68 / 36.01 / 25.88 | 0.088 / 0.090 / 0.101 | — | — | 10.358 / 10.375 / 10.367 | KAD |
| `watch` | box | — | 14×20 | 10×16 | 8×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/3 | 101.51 / 70.33 / 46.16 | 0.176 / 0.176 / 0.180 | — | — | 4.333 / 4.233 / 5.681 | — |
| `watch-2` | box | — | 15×20 | 11×16 | 9×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/4 | 98.97 / 71.02 / 48.22 | 0.172 / 0.178 / 0.188 | — | — | 0.000 / 0.000 / 0.000 | D |
| `watch-3` | keyline | portrait | 16×20 | 12×16 | 10×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 4/4/3 | 115.31 / 81.97 / 52.9 | 0.200 / 0.205 / 0.207 | — | — | 2.865 / 2.834 / 3.410 | K |
| `wrench` | keyline | circle | 19.98×19.98 | 15.98×15.98 | 13.98×13.98 | 0.833 / 0.799 / 0.874 | -4.1 | +4.9 | 1/1/1 | 94.15 / 74.85 / 54.78 | 0.163 / 0.187 / 0.214 | — | — | 0.262 / 0.419 / 0.658 | KAD |
| `wrench-2` | box | square | 17.98×17.98 | 13.98×13.98 | 11.98×11.98 | 0.749 / 0.699 / 0.749 | -6.7 | +0.0 | 1/1/1 | 85.65 / 66.35 / 47.66 | 0.149 / 0.166 / 0.186 | — | — | 0.262 / 0.419 / 0.658 | AD |
| `wrench-3` | keyline | circle | 19.98×19.98 | 15.98×15.98 | 13.98×13.98 | 0.833 / 0.799 / 0.874 | -4.1 | +4.9 | 1/1/1 | 94.86 / 75.41 / 55.19 | 0.165 / 0.189 / 0.216 | — | — | 0.220 / 0.493 / 0.650 | KAD |
| `x` | mark | — | 13×13 | 12×12 | 10.5×10.5 | 0.542 / 0.600 / 0.656 | +10.7 | +21.0 | 2/2/2 | 49.49 / 45.3 / 33.84 | 0.086 / 0.113 / 0.132 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `x-circle` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 119.91 / 90.57 / 66.13 | 0.208 / 0.226 / 0.258 | 0.450 / 0.406 / 0.393 | 5.5 / 4.75 / 4.25 | 0.000 / 0.000 / 0.000 | KAD |
| `x-circle-small` | keyline | circle | 20×20 | 16×16 | 14×14 | 0.833 / 0.800 / 0.875 | -4.0 | +5.0 | 3/3/3 | 115.72 / 88.48 / 64.34 | 0.201 / 0.221 / 0.251 | 0.400 / 0.375 / 0.357 | 6 / 5 / 4.5 | 0.000 / 0.000 / 0.000 | KAD |
| `x-large` | mark | — | 16×16 | 14.5×14.5 | 12.5×12.5 | 0.667 / 0.725 / 0.781 | +8.7 | +17.1 | 2/2/2 | 62.05 / 55.77 / 40.96 | 0.108 / 0.139 / 0.160 | — | — | 0.000 / 0.000 / 0.000 | AD |
| `x-small` | mark | — | 10×10 | 9.5×9.5 | 8.5×8.5 | 0.417 / 0.475 / 0.531 | +13.9 | +27.3 | 2/2/2 | 36.93 / 34.83 / 26.71 | 0.064 / 0.087 / 0.104 | — | — | 0.000 / 0.000 / 0.000 | AD |
