# Fluent — what it holds and what it lets go, from 12 up to 48

Wave 2, card 2.1 of `plans/set-and-rules-audit.md`. Measured 2026-10-04 against the pinned
tree `5933041`. Nothing in the set, the rules, lint, the sheet or the board was touched; lint
at the end reads **2,910 drawings · 2,848 clean · 62 warned · 0 failed** — the pin baseline,
byte for byte.

**The one question this card answers.** Fluent draws the same icon at seven sizes. What does it
keep identical, what does it let change, and in what order does it let go as the canvas shrinks?
No set publishes a rule for the last part. This card derives one from the drawings.

---

## The short answer

**Fluent and we spend opposite currencies.**

Fluent treats the **margin as money**. It spends it — all of it, down to the canvas edge — to
keep three things that never move: *ink never thinner than one stroke*, *a knockout exactly one
stroke wide*, *the angle on 0/45/90*. Only when the margin is gone does it drop a part, and the
part it drops is the one that would have ended up about one stroke thin at the new size.

We treat the **margin as a wall**. In 2,910 drawings not one reaches the canvas edge and not one
stands past the circle keyline. What we spend instead is the **angle at 16** (10.6% of our
on-axis concepts tilt, up to 1.87°) and the **part** — we drop a member of a run rather than
compress it.

Neither is wrong. But it is the choice the set is built on, and until now it was an accident
rather than a decision.

---

## Sample, and why this one

| | |
|---|---|
| Source | Figma file `rdI0uXVzp89fOZpYcQV6mo` *a.1. Microsoft Fluent system iconography*, page `1124:9833` "System icons" |
| Population | **2,608 component sets** enumerated (catalogue run, 2026-10-04). Sizes per concept: **237** at one · 770 at two · 632 at three · 291 at four · 190 at five · 386 at six · **102 at all seven** |
| Sample | **all 102 concepts that exist at all seven sizes**, plus an **even spread of 100** across the 1,499 that exist at three to six, taken in page order |
| Measured | **202 concepts · 2,510 drawings** — 1,223 Regular, 1,234 Filled, 39 Light, 14 themeless. Every concept carries every size its own variant axis declares (checked: 0 short) |
| Our side | the whole pinned set — **485 concepts × 3 masters × 2 styles = 2,910 drawings** |

Why this split. The 102 seven-size concepts are the only place the whole curve is visible. On
their own they are an elite — the most-used icons, the most attention. The even 100 from the
three-to-six band test whether the curve is a property of the system or of its favourites. It is
the system's: every hold/give figure below moves by less than two points between the two groups.

**Provenance note.** The run guide `tools/audit/refs/figma-extract.md` points its `fluent` row at
page `15711:27742` inside the Central file — that page is a **copy**. This card used the
authoritative file. Both enumerate 2,608 sets with an identical set of 2,606 distinct names, so
no figure here depends on which one is read. The pointer should still be corrected.

## Instruments

Every number below comes from a run made this session. Nothing is recalled.

| Measure | Instrument |
|---|---|
| geometry out of Figma | `tools/audit/refs/figma.mjs` v4, `script install` + `script run fluent --names …` in six chunks, then `ingest`. The `fluent` page id was patched in the installed copy at run time to `1124:9833`; no file in `tools/` was changed |
| ink box · margin · subpath boxes | `tools/geometry.mjs` `bbox`, `subpathsOf` (exact arc boxes) |
| corner radii | `tools/audit/radii.mjs` `radiiOf` — handles `C`/`S`/`Q`/`T`/`A`, role-tags each corner |
| angles | `tools/audit/angles.mjs` `anglesOf`, ranked by `dev` (never `fromHorizontal`) |
| air between ink edges | `tools/geometry.mjs` `facingGap`, kinds `cut` · `notch` · `separation` · `line`; `cap` scaled to `canvas/24 × 2.5` so a 48 drawing is not read with a 24 drawing's window |
| thinnest ink | `tools/geometry.mjs` `materialGap` |

Scripts and the sample list are kept beside the data at
`research/references/fluent/figma/card-2.1/` (gitignored, licensed third-party geometry, never
copied into a tracked file). `measure.mjs` → `per-drawing.json`; `gaps.mjs` → `gaps.json`;
`an1`–`an9` print the tables.

**Three approximations, declared.**

1. Fluent's fills are `NONZERO`; `facingGap` and `materialGap` apply even-odd. Holes are drawn
   in reverse winding, so the two agree for every ring topology — but that is reasoning, not a
   proof I ran.
2. The harness's stroke calibration gives **one weight per size**, read off `Subtract`/`Add` —
   that is the *Regular* weight. Filled rows therefore carry the Regular weight as their
   `strokeBasis`. Where a filled figure is normalised below, it is normalised against the Filled
   weight from their own table, which this card re-measured independently (see §1).
3. The cross-size part matcher pairs subpaths on normalised centre and size. **53 of 128** Fluent
   orphans are restructuring or zero-area leftovers, not deaths — `Eye` at 28 carries a subpath
   0.00 thin, `Window Wrench` at 24 one 0.03 thin, `Hand` at 24 two 0.09 thin. Those are excluded
   as implausible and named rather than averaged in. 75 plausible deaths remain.

---

## 1. The stroke table, re-measured

Their own Creation-Strokes frame is already on record. This card confirms it from the shipped
geometry rather than the document.

| | 12 | 16 | 20 | 24 | 28 | 32 | 48 |
|---|---|---|---|---|---|---|---|
| Regular, calibrated from `Subtract`/`Add` | 1 | 1 | 1 | 1.5 | 1.5 | 2 | 2.5 |
| as a share of canvas | 8.33% | **6.25%** | 5.00% | **6.25%** | 5.36% | **6.25%** | 5.21% |
| Filled − Regular, from the ink box of line-only glyphs | +0.5 | +0.5 | +0.5 | +0.5 | +0.5 | +0.5 | +0.5 |

The Filled delta is measured, not quoted: for `Add`, `Dismiss` and `Checkmark` — glyphs whose box
is set by a cap, not a tip — the filled ink box stands **0.25–0.28 proud on every side at every
one of the seven sizes**, which is exactly half of +0.5. Ours for comparison: 1.5 · 1.5 · 1.25 at
24 · 20 · 16, i.e. **6.25% · 7.50% · 7.81%** of canvas.

Three of their sizes — 16, 24, 32 — sit at exactly 6.25% of canvas. The other four are lighter
(5.00–5.36%) or, at 12 only, heavier (8.33%). So their weight is not a constant share; it is a
**four-step ladder of whole and half units** (1 · 1.5 · 2 · 2.5) laid over seven canvases, and the
canvas share is whatever falls out.

---

## 2. The hold/give table

Everything measured twice, as the plan requires: in their own units, as a share of their canvas,
and as a multiple of their own line.

| What | Held? | Measured, 12 → 48 | In their own line |
|---|---|---|---|
| **Thinnest ink** (`materialGap`) | **held, exactly** | 1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50 | **1.00× at all seven sizes.** 42–64% land exactly on the stroke; 6–25% go thinner |
| **Knockout width** (`facingGap` kind `cut`, Filled) | **held, exactly** | 1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50 | **1.00× the Regular line at all seven.** 55–94% exactly on it. Never the Filled weight (0.67–0.83×) |
| **Angle** | **held** | of 121 concepts on-axis (max dev ≤ 0.5°) at their biggest size, still on-axis at **100% / 96.6% / 95.0% / 94.1% / 95.7% / 100% / 100%** — no trend by size | — |
| **Mark inside a circle container** | **held** | `Add Circle` and `Subtract Circle` read **50.00% at every one of the seven sizes**. `Arrow Circle Down/Up` 50.3–50.7% at 16–48. `Question Circle` 53.8–60.0%, `Chevron Circle` 41.0–54.4% | — |
| **Circle keyline** (from 9 circle-container concepts) | **held as a size** | 10 · 14 · 16 · 20 · 24 · 28 · 40 | — |
| **Separation from a glyph edge** (kind `separation`, Regular) | **held at the small sizes** | 1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46 — a literal 1 unit from 12 to 24, then it grows | 1.00× · 0.95× · 1.00× · 0.67× · 0.98× · 0.75× · 0.98× |
| **Topology** (subpath count) | **held nearly everywhere** | a part is lost in **1.5% / 2.3% / 1.3% / 2.0% / 4.3% / 10.4%** of the steps 48→32, 32→28, 28→24, 24→20, 20→16, 16→12 | — |
| **Margin** | **spent** | median min-margin 1 · 1 · 2 · 2 · 2 · 2 · 4. Under 1 unit in **39.3% / 29.9% / 6.8% / 6.1% / 3.1% / 2.6% / 0%** of drawings. **At the canvas edge** (margin 0) in 9 at 12, 19 at 16, 5 at 20, 4 at 24, none above | — |
| **Keyline as a ceiling** | **not a ceiling at all** | **20.1–37.6% of drawings stand past the circle keyline**, at every size, with no trend. 37.3–42.9% land exactly on it | — |
| **Ink box as a share of canvas** | **floats** | median largest dimension 83.3% · 87.5% · 80.0% · 83.3% · 85.7% · 87.5% · 83.3% — not monotone; it is the keyline divided by the canvas | — |
| **Path structure** | **redrawn every time** | **2 of 904** adjacent-size pairs is a pure rescale (ink box within 0.02 of `big × k`), and both are at the bottom of the ladder. Only **33.7%** of their 16/20/24 trios hold the exact command count | — |
| **Filled outer box = outline's** | **held 4 times in 5** | identical in **75.5% / 81.8% / 83.8% / 80.0% / 83.9% / 82.1% / 83.2%**; it grows in 11–22%, shrinks in 3–12% | — |

Their own guidelines corroborate the two that are stated: *"Cut out — … slash cutouts should
follow the size of the stroke"* and *"Do not scale icons — If there isn't an icon size that you
need, design it!"* They publish **no rule about which detail dies**; the nearest text is
*"simplified shapes"* and *"Consider the detail when plotting the cutout."* So §3 is new.

---

## 3. The detail-death order — the card's headline

Read off 2,510 drawings, this is the order in which Fluent lets go. It is a **priority list**,
not a size table: each line is surrendered only once the line above it has nothing left to give.

1. **The margin goes first, and it goes a long way.** It is already being eaten at 28 (3.1% of
   drawings inside 1 unit), heavily at 16 (29.9%) and 12 (39.3%), and 19 drawings at 16 touch the
   canvas edge outright. Nothing else in the system yields this early or this far.
2. **Then the path structure.** Continuous, at every step, at every size — not a response to
   smallness but the normal way a size is made. Two pure rescales in 904 pairs.
3. **Then a part is dropped.** 1.3–2.3% of steps from 48 down to 24; 4.3% at 20→16;
   **10.4% at 16→12**. The elbow is at 12, not 16.
4. **The ratio, the angle, the ink floor and the knockout hold throughout.** They are what the
   margin was spent on.

**Which part dies.** Of the 75 plausible deaths, the dying part's thinnest side — rescaled to the
size it would have had to live at — has a **median of 1.50 units, which is 1.50 of that size's
stroke**. By the size it died at: **1.56× at 12** (n=40) and **0.83× at 16** (n=12); the 23 at 20 and above are
dominated by the zero-area leftovers named above and should not be read as deaths. Among all orphans, 21.1%
would have come in under one stroke against 6.9% of the parts that survived — a three-fold
enrichment.

Named, so it is a drawing and not a statistic:

The table gives what was measured — how many parts went and how thin they were. What each part
*depicts* was not looked at and is not claimed. Where a drawing is restructured the matcher finds
more unpaired parts than the net drop in subpaths; both numbers are given so neither is read as
the other.

| concept | step | parts lost, and their thin side | would have been |
|---|---|---|---|
| `Globe` | 16→12 | 10 subpaths → 7; nine of the 16-master parts find no counterpart (the whole drawing is restructured), the four thinnest at 1.60 (10.0% of canvas) | 1.20 at 12 = **1.2 strokes** |
| `Bot` | 16→12 | 6 → 4; two at 1.50 thin (9.4%) | 1.13 at 12 = **1.13 strokes** |
| `Tooltip Quote` | 16→12 | 7 → 6; two at 1.00 thin (6.3%), one at 7.00 | 0.75 at 12 = **0.75 strokes** |
| `Guest` | 16→12 | 7 → 5; one at 1.00 thin (6.3%), one at 4.00 | 0.75 at 12 = **0.75 strokes** |
| `Globe Off` | 20→16 | 9 → 8; one at 1.08 thin (5.4%) | 0.87 at 16 = **0.87 strokes** |
| `Emoji Meme` | 20→16 | 10 → 8; two at 1.00 thin (5.0%) | 0.80 at 16 = **0.80 strokes** |
| `Archive Clock` | 20→16 | 5 → 4; one at 1.00 thin (5.0%) | 0.80 at 16 = **0.80 strokes** |

**Our own set gives the same rule, tighter.** Of 69 deaths across 970 steps, the dying part's
thinnest side is **exactly 1.50 units in 26 of them and 2.00 in a further 19** — 45 of 69 at one
stroke or 1.33 strokes — **and the median is 1.67 units = 1.11 of the smaller master's stroke**
(p75 1.44). 75.4% of our dying parts would have come in under 1.5 strokes, against 31.6% of the
parts that survived.

> **The rule, derived from two independent sets:** a part is dropped when rescaling would take its
> thinnest dimension below roughly **one stroke width at the new master**. Fluent will push to
> 0.75 strokes before giving up; we give up at 0.96–1.11.

And ours says one thing more, which Fluent's does not. Look at what our dying parts *are*:
`sliders-2` loses six parts at 20→16, `building` five at 24→20, `building-2` two and two,
`gear-3` three and three, plus `trash`, `chart-bar-3`, `microphone`, `book-4`, `keyboard`,
`images`, `database`, `watch`, `compass`. Every one of those names is a family whose drawing
carries a **run of repeated elements**, and 26 of the 69 dying parts are **exactly 1.50 thin** at
the master above with 19 more at 2.00. (That the dying member is the rib, the window or the bar is
the obvious reading of the names and the counts; it is not something this card put under the
rulers. Card 4.1's wall will show it.) So:

> **Our unwritten rule, now written:** when a run of repeated parts can no longer hold its
> spacing, we **drop a member rather than compress the run**. The member dropped is one stroke
> thick at the master above and would have had to be drawn at 1.20–1.25.

Nothing states this. Lint does not know it. It is the single most consequential undeclared rule
this card found, and it is ours, not theirs.

---

## 4. Where the curve bends

Their stroke steps 1 → 1.5 → 2 → 2.5 in bands. **The geometry steps with it, not smoothly.**

- The **ink floor** and the **knockout** are 1.00× the stroke at every size, so both step at the
  band edges: 1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5. They do not interpolate.
- The **margin** is its own ladder of whole units — 1 · 1 · 2 · 2 · 2 · 2 · 4 — and it changes at
  16→20 and 32→48, which are *not* the stroke's band edges. Two ladders, out of phase.
- The **ink-box canvas share** therefore zig-zags: 83.3 · 87.5 · 80.0 · 83.3 · 85.7 · 87.5 · 83.3%.
  It is not a design target; it is `keyline ÷ canvas` with both ladders in it.
- The **separation** is flat at a literal 1 unit from 12 through 24 — four canvases, one number —
  and only then follows the stroke up.

So: **nothing in their geometry is held as a ratio.** Every held quantity is a whole or half unit
on an absolute ladder, and the ratios are consequences. That is the method, and it is the opposite
of how our docs tend to reason ("6.3% · 7.5% · 7.8% of the canvas").

**One correction to their own keyline story.** Their bare `Circle` concept measures 12 at 16 and
would have made the circle keyline look like 12 there. It is drawn to the *square* keyline. Every
genuine circle-container concept — `Add Circle`, `Dismiss Circle`, `Subtract Circle`,
`Question Circle`, `Chevron Circle`, `Arrow Circle Down/Up/Left/Right`, `Number Circle 2`,
`Record` — reads **14 at 16**, confirmed independently from the extractor's own render bounds.

---

## 5. Us against them, normalised

Only 16, 20 and 24 — the span we actually draw. Fluent restricted to the same three.

| Measure | Fluent | Ours | Reading |
|---|---|---|---|
| **median min-margin, 24 / 20 / 16** | 2 · 2 · 1 | 3 · 3 · 2 | **we hold one extra unit at every shared master** |
| same, as canvas share | 8.3% · 10.0% · 6.25% | 12.5% · 15.0% · 12.5% | ours is 1.3–2.0× theirs |
| **drawings at the canvas edge** | 4 at 24, 5 at 20, 19 at 16 | **0 of 2,910** | their margin is money, ours is a wall |
| **past the circle keyline** | 34.4% · 35.6% · 20.1% | **0.0% · 0.0% · 0.0%** | their keyline is a starting shape, ours a ceiling |
| **reaching neither keyline** | 5.2% · 3.2% · 4.4% | **21.9% · 19.4% · 12.0%** | 3–6× as many of our drawings land short |
| median largest ink dimension | 83.3% · 80.0% · 87.5% | 75.0% · 70.0% · 75.0% | **theirs reads 8–13 points bigger in the same square** |
| **ink-box canvas share, spread inside one concept** | med 7.50%, p90 8.74% | med 7.50%, p90 12.50% | same middle; our tail is 1.4× wider |
| **pure rescales** | 1 of 384 | 1 of 970 | both redraw. 20 is a master, not a scale |
| **exact command count across the trio** | 33.7% | **89.1%** | they restructure, we move coordinates |
| **a part dropped per step** | 2.0% (24→20) · 4.3% (20→16) | 3.1% · 3.7% | we shed at 24→20 about as often as they do at 20→16 |
| **on-axis concepts still on-axis** | 94.1% · 95.0% · 96.6% | 100% · 99.7% · **89.4%** | **16 is the only master in either set where the angle is what gives** (max 1.87°, p90 0.62°) |
| **thinnest ink, in its own line** | 1.00× · 1.00× · 1.00× | 1.00× by construction (outline); filled 3.00× · 1.96× · 1.38× | same floor, reached differently |
| **knockout width, in its own line** | 1.00× · 1.00× · 1.00× | **1.00× · 1.00× · 1.20×** | identical at 24 and 20; **16 is ours alone** |
| **separation, absolute** | 1.00 · 1.00 · 0.95 | 1.50 · 1.50 · 1.50 | we hold 50% more air |
| **separation, in its own line** | 0.67× · 1.00× · 0.95× | 1.00× · 1.00× · **1.20×** | **1.26× theirs at 16, not 2×** — see §7 |
| **commonest contour corner** | 0.75 · 0.50 · 0.50 | 1.50 · 1.50 · 1.25 | **our tightest corner is 2–2.5× theirs** |
| **largest common contour corner** | 3.25 · 3.00 · 2.50 | 3.25 · 2.75 · 2.125 | the big corners agree at 24 exactly |
| **three commonest radius steps, ratio** | 1 : 0.78 : 0.33 (24) · 1 : 0.75 : 0.25 (20) · 1 : 0.60 : 0.20 (16) | 1 : 0.60 : 0.30 (2.5 / 1.5 / 0.75 at 24) | **we already have their ratio** |

Two readings worth stating in plain words.

**On apparent size.** We and Fluent publish the *same* keyline table at 24, 20 and 16 — circle 20
/ 16 / 14, square 18 / 14 / 12, identical. Yet the typical Fluent drawing reads 8–13 points bigger
in its square. The whole difference is drawing practice, not rules: a third of theirs stands past
the circle keyline and almost none lands short, while none of ours stands past it and a fifth
lands short. Their own guidelines even say why they allow the overshoot — *"Circles and other
non-square shapes need to be higher and wider to be optically balanced with squares"* and
*"Keeping square shapes 1 px smaller than the margins can seem weird, but goes a long way for
balance."* That sentence is the reason our 24 → 20 / 18 is right, which we had as a number with no
reason attached.

**On the corner.** A quarter of their corners read a contour radius of exactly half the line —
0.75 at 24, 0.50 at 16 — and a quarter of ours read a *centreline* radius of exactly half the line
(0.75 · 0.75 · 0.625, `bendMin`, C10), 26–29% of all our corners. Two sets, independently, put
their commonest corner at half the weight. That is a strong independent defence of C10's
derivation. But the resulting shapes are not the same: on the outside theirs turns at 0.75 at 24
where ours turns at 1.50. **Their small corners are twice as tight as ours.**

---

## 6. Take / refuse / why

Every item run through the four tests of `plans/set-and-rules-audit.md` § *The transfer test*.
Our constraints: no control over render size · no weight axis · three hand-drawn masters at
24/20/16 · two styles drawn as a pair · outlined fills shipped from a private stroked source · we
publish optical metrics.

### Take — the method, never the number

**T1. The ink floor is derived from the line, not chosen.** *No ink thinner than one stroke width.*
— (1) answers card 1.7 / F8 and the open gap question. (2) a drawing-discipline rule, independent
of render size, weight axis and style count. (3) a method: derive the floor from the line.
(4) checkable today — `materialGap` measures it and did. Held exactly at all seven of their sizes.
**We already hold it by construction in the outline** (a centreline stroked at the master's weight
cannot be thinner than it) **and we have no rule for it in the filled style** — see K3 below.

**T2. The knockout is one stroke wide.** — (1) answers C22's open 16 question directly. (2) they
ship outlined fills with knockouts exactly as we do. (3) a method. (4) `facingGap` kind `cut`
measured it: 1.00× their Regular line at every size, 55–94% exactly. Ours is 1.00× at 24 and 20
and **1.20× at 16**. Taking the method would make our 16 knockout 1.25 instead of 1.5. **The rule
change is one line; the look is Maruti's.**

**T3. Three named radius steps, keyed to the role of the shape.** Their guidelines name
*large / medium / small* — *"Medium radius — used for smaller, secondary shapes … Small is used for
extra small details & most acute angles."* — and the drawings bear it out: three steps at a ratio
of **1 : 0.6–0.78 : 0.20–0.33** at every size. (1) answers the open container-radius ruling and
docs/09 §4. (2) matches. (3) a method (a named scale by role, not one global radius). (4) checkable
— `radii.mjs` already role-tags corners. **Our own set already runs 2.5 / 1.5 / 0.75 at 24 =
1 : 0.6 : 0.3.** So this is not a change; it is the precedent the container-radius ruling can be
settled against instead of by argument.

**T4. The margin is a budget, and it is the first thing spent.** — (1) answers F2 and the
"there is no live area" statement. (2) matches. (3) a method: declare the margin spendable and
declare what it may be spent on. (4) checkable. **This is the one place their answer is the direct
opposite of our settled rule**, and it is the largest single difference in apparent size. It is a
question for Maruti, not a change: one unit of margin at the median is the difference between our
16 drawings sitting at 12 and sitting at 14.

**T5. The badge has its own weight rule, which deliberately breaks the size ladder.** From their
guidelines — *"filled modifiers break the scaling stroke rule, no matter what the style is …
Strokes for filled modifiers should be 1px width for all small sizes"* and *"We use solid modifiers
to make them as legible as possible"* — and confirmed by measurement: **every drawing in the sample
whose margin falls to zero at 16, 20 or 24 is a badge compound** — `Agents Add`, `Calendar Person`,
`Call Add`, `Folder Add`, `Document One Page Add`, `Globe Arrow Up`, `Mail Data Bar`,
`Panel Left Text Dismiss`, `Slide Topic Add`, `Mail Unread`, `Emoji Meme`, `Play Circle Sparkle`,
`Clear Formatting`, `Archive Clock`, `Earth Leaf`, `Layer Diagonal Person`. (1) answers F5 and the
open modifier-zone ruling. (2) matches. (3) a method: the badge's legibility outranks weight
consistency, and the margin is where it is paid for. (4) checkable once card 1.9 has the modifier
census. **Hand to card 1.9.**

**T6. "Do not scale icons."** — confirms rather than changes. 1 of 384 of their 16/20/24 pairs and
1 of 970 of ours is a pure rescale; median ink-box error 0.5–1.33 units. **Our 20 is a master, not
a scale**, and the plan's open question on that can be closed.

### Refuse — recorded as *seen and rejected, because X*

**R1. Their keyline as guidance rather than a bound.** 20–38% of their drawings stand past the
circle keyline at every size. **Fails test (2)**: they draw seven sizes for platforms they control
and publish no per-icon metrics; a soft keyline costs them nothing. We publish optical bearings
that customers subtract as negative margins, so a bound that a third of the set exceeds makes
`padding` and `gap` lie — the exact thing `dist/metrics.json` exists to prevent. Also **fails (3)**:
"exceed it when the drawing wants to" is not a method anyone can verify. *Seen and rejected,
because our metrics are a contract and theirs are not.*

**R2. Their filled-box policy — the box grows by half the added weight.** Measured: 0.25–0.28 per
side on capped line glyphs at all seven sizes; identical boxes in only 75–84% of pairs. **Fails
test (2)**: their Filled is +0.5 on a 1.0–2.5 base; ours is +1.0 at 24 and +0.75 at 16 on a
1.25–1.5 base, a contrast C7 set deliberately. Half of our +1.0 would be 0.5 proud per side at 24
— twice their growth and visible. *Seen and rejected, because our added weight is twice theirs, so
half of it is not the same decision.* Worth recording that **ours is the stricter of the two**:
96.3% of our pairs hold an identical box against their 75–84%, and our 18 exceptions are the agreed
C17 repeated-element families plus `minus` — 54 files, matching the plan's 2026-09-20 census exactly.

**R3. Their separation floor.** Median 1.00 unit pooled, p25 0.73 — but the bottom decile runs
0.09–0.31 and it is **not noise**: the same value appears in both the outline and the filled twin
of `Agents Add` (0.23 at 24), `Archive Clock` (0.09 at 28), `Comment Add` (0.10 at 28),
`Folder Add` (0.09 at 28), `Cloud Sync` (0.16 at 28), `Desktop Arrow Right`, `Document Error`,
`Document Sync`, `Clear Formatting`, `Earth Leaf`. All badge-to-base contacts. **Fails test (4)**:
a floor an order of magnitude below its own median on one named class is not a floor. **Fails (3)**:
their own document says 1px and the drawings say otherwise above 24. *Seen and rejected as a
number.* It still earns its place as evidence for card 1.7: **no reference holds anything like 1.5
of air relative to its own line**, and where a badge meets a base Fluent lets the air collapse to
nearly nothing rather than shrink or move the badge. That is a priority choice, and it is the
opposite of ours.

**R4. Their commonest corner — contour radius exactly half the weight.** That is what you get from
a sharp centreline corner with a round join, which C10 explicitly rules out ("the inner corner
stays a notch and the corner reads heavier"). **Fails test (1)**: answers nothing open. **Fails
test (2)/(4)**: read off an outlined fill, I cannot tell whether the inner side of that corner is a
notch or a drawn arc, and C10 is a rule about the inner side. *Seen and rejected, because the
measurement cannot reach the thing the rule is about.*

---

## 7. What this card corrects in our own documents

Kept strictly in the plan's three kinds. None of these is an edit — they are for card 1.16 and the
decision agenda.

### Kind 2 — our rule disagrees with the source it cites

**K1. `docs/07-character.md:47` (C7's evidence column) — systemic.**
It states: *"Fluent uses 1.5 at 12, 16, 20, 24 and 28 — exactly as we do
(`research/references/fluent-guidelines.md`, stroke table), which puts the largest deployed set on
our side of the fork."*
**That is false, and it is false in the direction that matters.** Fluent's Regular stroke is
**1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5** at 12 · 16 · 20 · 24 · 28 · 32 · 48 — 1.5 at two of its seven
sizes, and **never at 12, 16 or 20**. The 1.5 the sentence saw at the small sizes is their *Filled*
weight. At 16 Fluent draws **1.0 (6.25% of canvas)** where we draw 1.25 (7.81%). So the largest
deployed set is on the *other* side of that fork.
Tagged **systemic** because this sentence is the stated reason C7 gives for not reopening on a
lighter reference, and it reverses the fact. It does not reopen the stroke — the stroke is settled
and this card measured around it — but the citation must not stand.

**K2. `docs/08-refinement.md:113` — one-off, load-bearing.**
It states: *"Fluent's cut-out/separation is 1px (1 at sizes 12–32, 1.5 only at 48)."*
Measured, separation (Regular): **1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46**; the Filled twins read within 0.05 of those. Measured, punched-line
width: **1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50**. Right for 12–24 on both readings; wrong
at 28, 32 and 48, where it is one band low. The sentence also runs two different quantities
together — *how far a cut sits from the glyph edge* and *how wide the cut itself is* — which their
own guidelines keep apart (*"The shape should be 1px size … from the edge of the glyph"* against
*"slash cutouts should follow the size of the stroke"*).

**K3. `plans/set-and-rules-audit.md`, § *Consequence for the reference work* — systemic.**
The worked example reads: *"Fluent draws 1.5 at 16, so its separation is 0.67 of its own stroke,
while ours is 1.5 on a 1.25 line — 1.2 strokes. Stroke-relative, we are close to twice as generous
as Fluent."* It inherits K1 and K2. Corrected and measured:

| at 16 | separation | its own line | ratio |
|---|---|---|---|
| Fluent Regular | 0.95 | 1.00 | **0.95×** |
| Fluent Filled | 0.96 | 1.50 | 0.64× |
| ours, outline | 1.50 | 1.25 | **1.20×** |

**We are 1.26× as generous as Fluent relative to our own line, not ~2×.** In absolute units and as
a canvas share, 1.5×. The suspicion survives — we do hold more air than the largest deployed set,
at every master — but at about 60% of the size the plan assumed. Tagged **systemic** because it is
the premise of the headline gap question.

**K4. `tools/audit/refs/figma-extract.md`, the `fluent` row — one-off.** It points at page
`15711:27742` in the Central file, which is a copy. The authoritative source is file
`rdI0uXVzp89fOZpYcQV6mo`, page `1124:9833` "System icons". Both enumerate 2,608 sets and the same
2,606 names, so no figure changes; the extractor cannot reach the authoritative page without a
page-id patch, which this card applied at run time. For whoever lifts the shared vocabulary into
`refs/common.mjs` in wave 1.

### Kind 3 — fine by every rule, and nothing covers it

**K5. The material a knockout leaves in our filled drawings at 16 — systemic within its class.**
`materialGap` on our filled files reads median **4.50 at 24, 2.94 at 20, 1.72 at 16**, minimum
**1.13**. Against the right basis — a shape-filled drawing keeps the outline weight, so 1.5 · 1.5 ·
1.25 — that is 3.00× · 1.96× · **1.38×** the line, and it holds. Against `FILLED_WEIGHT` 2 it does
not: 9 of the 13 measurable drawings at 16 leave material thinner than the filled line weight.
**No rule of ours says which basis governs the material a knockout leaves.** Fluent's answer is
unambiguous — one stroke, at every size — because it has one weight per size per style. We have
two, and we have never said which one the knockout answers to. For card 1.8 (F13).

**K6. Our own detail-death rule is undeclared — systemic.** §3: when a run of repeated parts can
no longer hold its spacing we drop a member rather than compress the run, and the member dropped
is one stroke thick (1.50) at the master above. 69 parts across 970 steps, concentrated in
`sliders-2`, `building`, `building-2`, `gear-3`, `trash`, `keyboard`, `images`, `chart-bar-3`,
`microphone`, `book-4`, `database`, `watch`, `compass`. Consistent, deliberate-looking, and stated
nowhere. For card 1.13 (the exceptions ledger) and the rule register.

### Kind 1 — a drawing disagrees with a stated rule

None found by this card. The 67 air readings below 1.5 that `facingGap` returns on our set are the
12 `sort-alpha-*` / `sort-numeric-*` concepts, `volume-off`, `attachment-4`, `list-ordered` and
`database-2` — all already on the record in `plans/sort-family.md` and the six `gap:` notes. The
instrument reproducing exactly the known breaches, and no others, is the cross-check that it is
reading our set correctly.

---

## 8. What only Maruti's eye can settle

Each with the surface to settle it on. None of these is a measurement question.

1. **Does 1.25 of white read as separated as 1.5, at 16 px?** This is T2's whole consequence. If
   yes, our 16 knockout drops to 1.25 and we match the only set that draws seven sizes. Settle it
   in the Library's **At 16** strip, filled, light and dark — the same way the stroke-16 blind pick
   was made.
2. **One unit of margin at 16 — our drawings at 14 instead of 12.** T4. It is the difference
   between reading the same size as Fluent and reading 12 points smaller. Settle it on **the wall**
   (card 4.1), twenty at real 16 px, ours against a Fluent row.
3. **Does our 16 corner read refined, or just soft?** Their commonest contour corner at 16 is 0.50;
   ours is 1.25 — two and a half times rounder. doc 08's whole complaint was that our marks read
   *less* refined; this measurement says our corners are the **rounder** of the two. Worth looking
   at before anything else in doc 08's agenda is reopened.
4. **Does 1.87° off 45 show at 16?** We are the only one of the two sets that lets the angle give,
   and only at 16. The number is small; whether it reads is not mine to say.
5. **Should the margin be spendable at all, and if so by what?** Fluent spends it on badges. We
   have never spent it on anything. That is a scope question, and it is the first item of T4.

---

## 9. How to reproduce this

```
node tools/audit/refs/figma.mjs script install        # patch the fluent SRC entry to
                                                      # pageId '1124:9833', pageName 'System icons'
#   paste into figma_execute with fileKey rdI0uXVzp89fOZpYcQV6mo, timeout 30000
node tools/audit/refs/figma.mjs script run fluent --catalogue
node tools/audit/refs/figma.mjs ingest <host-saved tool-result>
#   then the six chunks in research/references/fluent/figma/card-2.1/chunks.txt, ingested in order
node research/references/fluent/figma/card-2.1/measure.mjs     # per-drawing.json
node research/references/fluent/figma/card-2.1/gaps.mjs        # gaps.json  (~110 s)
node research/references/fluent/figma/card-2.1/an{1..9}.mjs    # every table above
```

The sample list is `card-2.1/fluent-sample.json`. `measure.mjs` reads `src/icons/` directly, so
our side of every comparison is measured by the same code path as theirs — which is the point of
doing it this way rather than reading `dist/metrics.json`.

**Not independently checked.** Card 1.4 (`findings-scaling.md`) owns our own 24→20→16 behaviour and
measured it separately. Our-side figures here are from this card's own run. Where the two
disagree, the fresh reviewer (card 5.1) should reconcile them rather than pick one.
