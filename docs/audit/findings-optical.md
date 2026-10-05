# Findings — optical correction as a system (F2)

Audit card **1.11** (`plans/set-and-rules-audit.md:498-500`). Axis **F2, one apparent size** — the part
of it that is about *where* a drawing sits: an open pointing mark reads as sitting toward its open
side, so C14 moves it toward its point by a measured, declared amount (`docs/07:54-55`,
`CLAUDE.md:197-198`). The card's question: *is that system applied to the whole set, and where is
it not?*

**Pinned tree `5933041`, measured from an archived copy.** `git archive 5933041` was extracted into
the session scratchpad and `node tools/build.mjs` run there; the rebuilt `lab/manifest.json` is
byte-identical to the one committed at the pin (`shasum` 161c9314…), so every ink box and `shift`
below is exactly what the pinned build publishes. 485 concepts × 3 masters × 2 styles = **2,910
drawings**. `node tools/lint.mjs` in the repo at the end: **2,910 drawings · 2,848 clean · 62 warned ·
0 failed** — the baseline, byte-identical to the run captured before the card started. Nothing
outside `tools/audit/optical-probe*.mjs` and this file was written; `tools/optical-sheet.mjs` was
run only inside the archived copy (it writes the board).

**Settled, cited, not reopened.** C14's per-master scaling **holds** — 81 of 90 outline files at 20
and 16 within 0.05 of `shift24 × (ink extent ÷ ink extent at 24)`, all 72 chevron tests within 0.007;
the nine misses are the `alert-triangle` files at 20 and 16 and `info-2` at 16 (`rule-register.md:102`,
`:127-134`; `plans/set-and-rules-audit.md:135`). §1 and §4 below say *why* those two concepts do
not scale; they do not re-measure the scaling. C14 and C15 themselves are settled: measure, don't
copy — the end triangle × 0.5, balanced against all four edges, on the axes the shape is lopsided
on, the eye deciding (`docs/07:55`). This card applies that system to the set.

**Independently checked.** A fresh reviewer who had not seen this card's scripts re-measured 58 of
its figures with its own and found them to agree — the census, the chevron rows, the 81 of 90, the
bands, the alpha counts, the twelve anchors, `watch-2`, `volume-off` at 16 — and read every citation
true. It found eight things to correct, all applied here after re-measuring each: the sheet's
end-triangle apex is exact only for equal legs, so the checks' figures are given twice (§3.1, §0);
the solved-box count of card 1.12 is 177 under either definition and this card's first 168 was its
own rounding (§7); `list-bullet` at 16 sits on the mark ceiling and the build's 2 dp box had hidden
it (§2); `play`'s match to its centroid is to the sheet's 0.05 step, an inference, not a record (§1,
OC-3); the largest declared drawing on the mass screen is `play`, not `alert-triangle` (§3.3); the
off-centre drawings have a measurable *description* each, a stated *reason* in 44 — not a "cause"
in every case (§2, OC-4; the closing check then evened the hand-read list: `pin-5` and `pin-6` state
the reason `pin-4` does, `map-pin-2` only points at a sibling); OC-1's margin has a counter-case on
record, the checks (OC-1); and two small counts (§2, §3.1). The reviewer also found four mutations
of the tool its tests did not catch; four tests were added that do, and two more at the closing
check pin the keyline-edge tolerance and the mirror tolerance (`optical-probe.test.mjs`). Nothing it
questioned was changed before being re-measured; no correction is disputed.

---

## What Maruti would see

Walk the Library's At 16 strip with this in mind and the system is **exactly where it was written
for, and nowhere else**: 45 of 485 concepts carry a shift, 36 of them chevrons. The chevrons are
in good order — every one of the 36 sits within 0.16 of what the sheet's own measure says, 27 of
them within 0.06, and the nine that sit 0.12–0.16 wide are the flat shape's down, left and right,
whose eye correction C15 records in its own calibration note. The three `play` triangles look like
the same idea carried to a closed triangle — the triangle's centre × 0.5, rounded to the sheet's
0.05 step, gives **0.95 · 0.80 · 0.90** (raw 0.96 · 0.81 · 0.92), which is what shipped — but nothing
records that derivation; it is an inference from the numbers. The four
`alert-triangle`s are not an optical correction at all: a constant half-unit lift at every master
that puts the point on the margin and the base on the square containers' line; it wears the
`optical:` note because that is the only note that moves lint's centring target.

Then look at what carries **no** shift. 154 drawings publish `shift [0,0]` with their ink box off
the canvas centre. **Every one has a measurable description; 44 have a stated reason; the other 110
are consequences nobody has judged.** The descriptions: 90 sit with one edge on a keyline and the
far side short of it (a pin whose tip stops 0.5 above the keyline's foot) — which is how the keyline
check is satisfied, not why the far side fell short; 36 are within half a grid step; 12 have a part
standing proud of a centred body (`watch-2`'s crown, exactly 0.5); 12 are placements the file's
prose records (`volume-off` at 16, moved to whole pixels); 4 have a centred body whose teeth or
arrowhead set the box. The 44 with a reason written down are `watch-2`, `volume-off`, `map-pin-4`,
`map-pin`, `list-bullet` and `-2`, `gear-3`, and `pin-4`, `-5` and `-6`. The largest offset is **half a
unit — half a pixel at 16** (`volume-off` at 16, `watch-2` at every master); 116 of the 154 are
within half a grid step and would not be visible.

**Which icons should carry a shift and do not?** By C15's own measure, only the eight check shapes
(48 drawings), which it would move 0.20–0.65 right and up to 0.35 up — and Maruti ruled on
2026-09-17, after seeing that day's sheet, that checks stay box-centred (`docs/07:54`; the 16
masters were redrawn on 2026-09-20, so today's 16 figures are not the ones seen then). Nothing else in
the set is a shape the measure is defined on. For everything else — objects lopsided by mass — the
screen in §3.3 ranks 218 of 485 outlines at 24 as lopsided by half a unit or more, headed by
`login`'s door-and-arrow, the flags, `text`, the arrows (judged by eye and left centred), `home`,
`user`, `heart`, `map-pin`. That is a list for the eye, not a rule; the screen also ranks the arrows
Maruti already judged, which is the measure disagreeing with the eye, not the eye being wrong.

And **`alpha` 0.75**: a quarter step either way moves the published optical bearing of **1,385 of the
1,882 stroke drawings** by more than a tenth of a unit (376 concepts; largest 0.55 units); an eighth
step moves 976. It is the whole stroke set, not a corner of it, and it has never been set against
the eye (`findings-metrics.md:626-646`).

---

## 0. Method, and how to read a number

**The instrument.** `tools/audit/optical-probe.mjs` (new; audit-only, imported by nothing in lint,
build or the lab) reads the archived pin's `dist/icons.json` (the build's own paths, areas, ink box
and `shift`) and every file's notes and prose, and prints one section per section below. Its tests
are `tools/audit/optical-probe.test.mjs` (15, on inline fixtures copied from committed drawings).

**C15's measure is the sheet's, restated.** `tools/optical-sheet.mjs:128-142` defines the
recommendation for a single-bend mark: the triangle through its two ends and its bend apex, that
triangle's centre's offset from the ink-box centre, times **K = 0.5** (`:51`), rounded to 0.05. The
sheet cannot be imported — it is a command that writes `lab/drafts/current.js` when it loads — so
the probe restates `triangleOffset` and `mirrors` (`:145-150`, which axes a shape is lopsided on)
line for line, and its `sheet` section runs the pin's own sheet inside the archived copy and
compares: **44 of 44 single-bend concepts agree**, the triangle to 0.005 and the recommendation
exactly (§1). The measure is defined on one open bend drawn as `M L A L` and nothing else; where
this document applies a *screen* to a shape the measure does not cover, it says so in the line.
One caveat, found by the review: the sheet's apex is the chord midpoint pushed by the arc's sag
along the line toward the ends' midpoint (`optical-sheet.mjs:135-137`), which is the arc's midpoint
only when the two legs are equal. On the chevrons the two agree to 0.0006; on the checks (leg ratio
1.97–4.52) the sheet's apex sits 0.06–0.19 from the true one — up to 0.036 off the arc itself — and
**16 of 48** check recommendations change by one 0.05 step (§3.1). The probe gives both
(`bendGeometry`, `triangleOffsetTrue`); the sheet is not changed in this build (Handover).

**Units and signs.** An offset is the ink-box centre minus the canvas centre, in that master's
units, `+` right and `+` down (SVG's signs, the note's signs). The ink box is the build's: 2 dp,
arc-sampled; `bbox()` can sit up to 0.0056 inside a true arc edge (plan, "Known instrument
defects"), which is why off-centre bands start at 0.005 and why card 1.12's solved-box count differs
from this card's by eleven entries (§7). One unit of a master is one pixel at that master's own
size; rendered at 16 px, a 24-master unit is 0.667 px and a 20-master unit 0.8 px. "Half a grid
step" is 0.125 at 24 and 20 and 0.0625 at 16 (`tools/masters.mjs`, `gridOf`).

**The mass screen** (§3.3) is the stroke centreline's centroid weighted by length, outline files
only — for an even stroke, its ink's mass centre up to the caps. It never touches `raster.mjs`. It
is a **screen for shapes lopsided by mass, not C15's measure**: C15 says in so many words that
*"ink or line mass is not the measure: the chevrons' mass sat ~0 off centre, yet they needed 0.5"*
(`docs/07:55`), and the screen reproduces that (the declared 45 sit at a median 0.09 on it).

**Three kinds, never in one line.** **(1)** a drawing disagrees with a stated rule; **(2)** a rule
disagrees with another rule, a doc or the code that enforces it; **(3)** a drawing is fine by every
rule and may still look wrong, and no rule covers it.

**Where each figure comes from.** Build the pin — `P=<dir>; git archive 5933041 | tar -x -C $P &&
(cd $P && node tools/build.mjs)` — then `node tools/audit/optical-probe.mjs $P <section>`:

| Figures in | Section |
|---|---|
| §1 census, grid lines, the info rows | `census` |
| §1 proof against the sheet (runs the pin's sheet in the pin; refuses a directory holding `.git`) | `sheet` |
| §2 | `offcentre`, and `prose` for the full comment of every concept in the population, with the reason read from it |
| §3.1, §3.2 | `should` |
| §3.3 | `screen` |
| §4 | `consistency` |
| §5 | `alpha` |
| §6 | `r10` |
| §7 | `reconcile` |

All sections but `sheet` together take about 25 seconds; `sheet` spawns one process.

---

## 1. Census at the pin — every `optical:` note

**45 concepts · 270 files · 94 distinct `dx dy` pairs** (the plan's reconnaissance figures hold at
the pin, `plans/set-and-rules-audit.md:270-277`). Every pair is single-axis: 132 files move on x
only, 138 on y only, none on both, none `0 0`. **The filled twin repeats its outline's note on all
135 of 135 concept-masters**, and the build publishes the note as `shift` unchanged on all 270
(`build.mjs:26`, `:87`). By geometry the 45 are **36 single-bend marks** (the chevrons: three
shapes × four directions × three sizes), **7 closed triangles** (`play` ×3, `alert-triangle` ×4) and
**2 glyphs inside a ring** (`info-2`, `info-3`). Where each value is recorded outside the drawing —
C14 for the chevrons, C18 for `info-2`/`-3`, *the file only* for `alert-triangle` and `play` — is
the ledger's table (`exceptions-ledger.md:333-385`, §2.5), not repeated here.

**How each declared value relates to C15's measure, per drawing.** The measure is taken on the
drawing itself at its own master (its own triangle × 0.5, to 0.05); `declared − measured` is the
eye's correction. A size variant is also shown as the sheet would recommend it — the family
default's measure at 24 scaled by ink extent — because that is the convention the sheet uses and
the one the shipped values follow (§4).

| Concept (shape) | Declared 24 · 20 · 16 | Own measure 24 · 20 · 16 | Declared − measured |
|---|---|---|---|
| `chevron-down` / `-up` / `-left` / `-right` (classic) | 0.50 · 0.43 · 0.38 | 0.50 · 0.40 · 0.35 | 0 · +0.03 · +0.03 |
| classic `-small` | 0.40 · 0.35 · 0.32 | 0.35 · 0.30 · 0.30 | +0.05 · +0.05 · +0.02 |
| classic `-large` | 0.60 · 0.52 · 0.45 | 0.60 · 0.50 · 0.45 | 0 · +0.02 · 0 |
| `chevron-down-2` / `-left-2` / `-right-2` (flat) | 0.55 · 0.46 · 0.42 | 0.40 · 0.30 · 0.30 | **+0.15 · +0.16 · +0.12** |
| flat `-small`, down / left / right | 0.46 · 0.40 · 0.37–0.38 | 0.30 · 0.25 · 0.25 | **+0.16 · +0.15 · +0.12–0.13** |
| flat `-large`, down / left / right | 0.64 · 0.55 · 0.48 | 0.50 · 0.40 · 0.35 | **+0.14 · +0.15 · +0.13** |
| `chevron-up-2` (flat up) | 0.40 · 0.34 · 0.31 | 0.40 · 0.30 · 0.30 | 0 · +0.04 · +0.01 |
| flat up `-small` / `-large` | 0.34 · 0.29 · 0.27 / 0.46 · 0.40 · 0.35 | 0.30 · 0.25 · 0.25 / 0.50 · 0.40 · 0.35 | +0.04 · +0.04 · +0.02 / −0.04 · 0 · 0 |
| `chevron-down-3` (steep down) | 0.61 · 0.52 · 0.46 | 0.65 · 0.50 · 0.45 | −0.04 · +0.02 · +0.01 |
| steep down `-small` / `-large` | 0.47 · 0.41 · 0.37 / 0.74 · 0.63 · 0.54 | 0.45 · 0.40 · 0.35 / 0.80 · 0.65 · 0.55 | +0.02 · +0.01 · +0.02 / −0.06 · −0.02 · −0.01 |
| `chevron-up-3` / `-left-3` / `-right-3` (steep) | 0.65 · 0.56 · 0.49 | 0.65 · 0.50 · 0.45 | 0 · +0.06 · +0.04 |
| steep `-small` / `-large`, up / left / right | 0.51 · 0.44 · 0.40 / 0.79 · 0.67 · 0.58 | 0.45 · 0.40 · 0.35 / 0.80 · 0.65 · 0.55 | +0.06 · +0.04 · +0.05 / −0.01 · +0.02 · +0.03 |
| `play` (closed triangle — no C15 measure; screen: the triangle's centroid × 0.5) | 0.95 · 0.71 · 0.59 | 0.95 · 0.65 · 0.55 | **0.00** · +0.06 · +0.04 |
| `play-2` | 0.80 · 0.60 · 0.50 | 0.80 · 0.55 · 0.50 | **0.00** · +0.05 · 0 |
| `play-3` | 0.90 · 0.64 · 0.51 | 0.90 · 0.60 · 0.45 | **0.00** · +0.04 · +0.06 |
| `alert-triangle` ×4 (closed triangle; same screen) | −0.50 · −0.50 · −0.50 | −1.00 · −0.80 · −0.65 | +0.50 · +0.30 · +0.15 |
| `info-2` (glyph in a ring) | −0.45 · −0.39 · −0.39 | C15 undefined; C18 records the derivation | — |
| `info-3` | −0.35 · −0.27 · −0.25 | C15 undefined; C18 records the derivation | — |

Chevron values are magnitudes (the sign follows the direction: down and right `+`, up and left
`−`); the down, left and right members of each shape and size carry identical values, the up member
of the flat and steep shapes does not (§4). The full 45-row table, with signs, prints from `census`.

**What the table says, in three sentences.** The chevrons follow their measure: 27 of 36 within
0.06 of it, and the nine at 0.12–0.16 are the flat shape pointing down, left and right at all three
sizes — the eye correction C15 itself records (*"flat 0.4 (0.55, so the eye corrects it)"*,
`docs/07:55`), carried to the sizes by ink extent. **`play`'s three values are consistent with the
C15 idea applied to a closed triangle** — the triangle's own centroid against the box centre, × 0.5,
is 0.963 · 0.806 · 0.919 at 24, which the sheet's 0.05 step rounds to 0.95 · 0.80 · 0.90 — then
scaled by ink width to 20 and 16 (C14's convention: ratios 0.747 · 0.621 against ink ratios 0.750 ·
0.625, §4). That is an inference from the numbers, not a record: the file says only *"optical →
0.95 / → 0.71 / → 0.59 at 24 / 20 / 16 (C14, C15)"* (`src/icons/24/play.svg:5`), the approval commit
*"each at its measured optical shift toward the point"* (`5ac8340`), the batch draft that the shift
was *"set later on the optical-shift sheet"*, and no sheet run is on record.
**`alert-triangle`'s −0.5 is not derived from any measure**: the triangle's centroid would ask for
−1.00 · −0.80 · −0.65, and the file explains the half unit as a construction — *"standing half a unit
high in the canvas: the rounded point touches the top margin the way alert-circle does, the flat base
sits on the same line as our square containers"* (`src/icons/24/alert-triangle.svg:6`) — the same
half unit at every master because the margin and the containers' base line are the same at every
master. That is why it is the register's "miss" against C14's scaling: it was never a scaled shift.

**Kinds.** `play`: **(2)** — C15 says a shift comes from *"a stated measure"* and the measure is
stated nowhere; the centroid derivation fits the numbers but is inferred. `alert-triangle`: **(2)** — the note's documented meaning
(*"open pointing marks move toward their point"*, `docs/07:54`) and its use here (a container
placed by construction) are two different things wearing one note; the build then publishes it as
`shift`, which card 1.12 §4 reads as a deliberate optical offset (`findings-metrics.md:410-430`).
`info-2`/`info-3`: C18 derives both from mass (*"moved left 0.45 so its mass is centred"*; *"mass sits
0.94 low box-centred, the lift brings that to 0.59"*, `docs/07:58`) and says `info-3`'s justification
is **stale** since the C19 re-cut. Measured here on the mark alone (the paths after the ring, by the
centreline screen): `info-2`'s mark mass sits **+0.12 · +0.15 · +0.11** right of the canvas centre
as shipped; `info-3`'s **+0.33 · +0.69 · +0.48** low. A different measure from C18's (§7); the same
direction of remark.

**The declared values and the grid.** The ledger (`exceptions-ledger.md:333-385`, §2.5(a)) measured
39 of 45 shifts at 16 off the eighth grid and asked whether C18's quarter-grid reasoning reaches
them. A note records a *centre*, and the grid rule binds *coordinates*. Measured: of the 90 declared
files per master, only **12 at 24, 12 at 20 and 13 at 16** have all four ink-box edges on the
master's grid; the declared value is itself on the grid in 16 · 8 · 12. The chevrons' legs end at
coordinates like 9.54 (a 45° leg meeting a C10 bend), so their boxes, and therefore their centres,
are off the grid by construction. The off-grid note is a consequence of the off-grid drawing, which
is the grid card's territory (`findings-grid.md`), not the shift's.

---

## 2. The drawings that publish `shift [0,0]` with their ink off centre

Card 1.12 counted **177** such entries — 12 C28 level members and 165 others — and handed the
question *whether the 165 are deliberate* to this card (`findings-metrics.md:410-430`). Under this
card's definition (the build's 2 dp box, the larger axis offset > 0.005) the population is **166 =
12 anchored + 154**; the eleven entries between the two counts are check twins whose solved offset
is 0.00505–0.00666 — just over the threshold on the solved box, rounded away by the build's 2 dp
box — and `megaphone` at 20 accounts for the band difference (70 against 68, card 1.12 measuring
the offset as a distance) — §7 names each. Everything below is on the 154 and the 12.

**The 154, in bands.** 86 within 0.1 of centre · 58 in (0.1, 0.25] · **10 in (0.25, 0.5]** · none over
0.5. By master 50 · 48 · 56; 80 outline, 74 filled (a twin almost always follows its outline);
**31 concepts**. **116 of the 154 are within half a grid step** of centre (0.125 · 0.125 · 0.0625);
the 38 beyond it belong to 13 concepts: `attachment-2`, `bug`, `bug-2`, `gear-3`, `list-bullet`,
`list-bullet-2`, `map-pin`, `map-pin-2`, `map-pin-4`, `pin-4`, `rotate-ccw-4`, `volume-off`,
`watch-2`.

**How each came to be off, measured — a description, not a verdict.** Five mechanical tests run in
order and the first that holds names the description: how the box came to be off centre, not
whether anyone chose it. The file's prose is read last and only for what the tests cannot see (the
filled twin inherits its outline's prose — the pair is drawn together). Separately from the
description, each file's prose was read for a **stated reason**, by one rule: *a reason is stated
when the file's own prose names a constraint the placement serves — edges on whole pixels, a keyline
edge or its tolerance, a part's job, C17's one-sided growth, a tooth on top; recording the offset
("Box 0.25 right of centre … as B"), saying "centred" of a box that is not, or pointing at a sibling
("same box … as A") does not count.* The order of the descriptions: a part standing
proud (removing exactly one part leaves the rest centred within 0.01) · a centred body (the largest
part is centred within 0.01, the others set the box) · one edge on a keyline with the far side short
of it (an edge within 0.015 of a keyline edge — the build's box is 2 dp) · within half a grid step
on both axes · a placement the prose records · nothing.

| Description | Entries | Concepts | Offset, units | px at the master's own size | px rendered at 16 | ≤ 0.125 | Prose hint | Reason stated |
|---|---|---|---|---|---|---|---|---|
| One edge on the keyline, the other side short | **90** | 20 | 0.015 – 0.25 | 0.01 – 0.25 | 0.01 – 0.25 | 72 | 24 | 16 |
| Under half a grid step (18 with an edge snapped to the grid; 18 whose extent is an arc or tangent extreme, so no edge is on the grid) | **36** | 7 | 0.010 – 0.085 | 0.01 – 0.09 | 0.01 – 0.07 | 36 | 18 | 12 |
| A placement the prose records | **12** | 4 | 0.060 – 0.50 | 0.06 – 0.50 | 0.06 – 0.50 | 4 | 12 | 8 |
| A part standing proud of a centred body | **12** | 4 | 0.060 – 0.50 | 0.06 – 0.50 | 0.04 – 0.50 | 6 | 6 | 6 |
| Body centred, teeth or arrowhead set the box | **4** | 3 | 0.10 – 0.19 | 0.10 – 0.19 | 0.07 – 0.19 | 3 | 2 | 2 |
| **Nothing** | **0** | 0 | — | — | — | — | — | — |

Two cautions on reading this table. **The keyline-edge description is not a reason.** An edge on a
keyline edge is how the keyline check is satisfied: **1,694 of the 1,726** keyline-matched files
(no `keyline: mark`, `box:` or `anchor:` note) have one, and the description holds on **106 of the
154** regardless of bucket order; 66 of the 90 in that bucket have no prose about their placement at
all. It says where the box's edges are, not why the far side fell short. **The zero in the last row
is a property of the order**, not a finding that every drawing was judged: the half-step bucket
catches anything small, and placement words match in 76 of the 154. The "prose hint" column is that
text screen (words such as *shifted*, *right of centre*, *whole pixels*, *off the case centre*) and
it over-matches — `map-pin`'s hit is about its ring, `rotate-ccw-9`'s about its sweep. What was
judged is in the last column: a **reason** for the offset, read file by file from the prose by the
rule above (the tool's `STATED_REASON`; the `prose` section prints every comment to check it
against). A reason is stated for **44 of the 154**, in 10 concepts — `watch-2` ×6 (the crown),
`volume-off` ×2 (whole pixels), `map-pin-4` ×6 (head centre on a whole pixel), `map-pin` ×4 (the
keyline's height tolerance), `list-bullet` ×3 and `list-bullet-2` ×3 (C17's one-sided growth),
`gear-3` ×4 (a tooth on top), `pin-4` ×4, `pin-5` ×6 and `pin-6` ×6 (*"those flat edges were moved …
until their outer edges sit on whole pixels"*, the same sentence in all three files). The other
**110** carry a description and no judgement on record: `attachment-2` ×4 records *"Box 0.25 right
of centre at 20, 0.125 at 16, as B"* and gives no reason; `map-pin-2` ×4 says only *"Same box, head,
ring and tip radius as A"*; `bug` ×2 and `bug-2` ×2 say *"circle keyline, centred"* of a box that is
not; the `rotate-ccw` family, `wand-2`/`-3` and `megaphone` say *"centred"* or *"box-centred"*;
`attachment-3`/`-4` and `list-ordered` say nothing about their placement.

**The 26 at 0.25 or more — all of them, with the cause:**

- **`watch-2` ×6 — +0.50 at every master, both styles — a part standing proud.** The crown, a one-unit
  stub (`M18.25 12H19.25`), stands exactly 1.00 past the case; the case and straps without it are
  centred at 12 · 10 · 8 to the thousandth. The file says so: *"ink box 15x20 · 11x16 · 9x14 (agreed
  box, 0.5 off the case centre, as D)"* (`src/icons/24/watch-2.svg:4`); its `box:` note records the
  size, not that the box is off centre. The mass centre sits only +0.10 · +0.09 · +0.09 right, so the
  eye sees a centred watch with a crown. 0.5 px at 16, 0.33 px for the 24 rendered at 16.
- **`volume-off` ×2 at 16 — −0.50 — a placement the prose describes**, in full: *"at 16 an odd 7-wide
  speaker cannot be centred without putting its left and back edges on half pixels, so it moves 3
  instead of 3.5: edges on whole pixels (x 4 and 11) and the ink centre 0.5 left of 8 … measured, the
  ink's mass centre sits at x 7.8 with 3 … and 3 reads balanced at real size"*
  (`src/icons/16/volume-off.svg:3`). Measured: the speaker's ink runs 4 → 11 (7 wide, whole pixels;
  centred it would run 4.5 → 11.5), the whole ink box 1.5 → 13.5, the centreline mass centre 7.85.
  At 24 and 20 the pair is centred exactly. §6 has the rest.
- **`map-pin-4` ×2 at 24 — +0.345 — a placement the prose describes:** *"Ring 8 · 6 · 4 on the head
  centre, which sits on a whole pixel (ring and sides crisp)"* (`src/icons/24/map-pin-4.svg`). An
  agreed box 16×18.69 whose head centre is held on a whole pixel cannot also be centred; at 16 the
  same drawing sits −0.225 with its top on the 12 keyline.
- **`bug` ×2, `bug-2` ×2 at 24 — +0.25 — bottom edge on the 20 keyline, the dome 0.5 short of its
  top.** The prose says *"Ink 20x19.5 · 16x16 · 14x14, circle keyline, centred"*
  (`src/icons/24/bug.svg`): the body is on the circle keyline; the 19.5 box is not centred.
- **`list-bullet`, `list-bullet-2` at 24 — +0.25 — right edge on the 18 keyline, the left 0.5 short;
  and the prose explains it as C17:** *"the filled twin fills the mark box centred; the outline sits
  inside it, right of centre by half the dot's growth (centre x 12.25 · 10.125 · 8.188), because a dot
  grows from its centre while a line end pulls in — the growth is one-sided and only one of the two
  styles can sit on the axis"* (`src/icons/24/list-bullet.svg`). The same at 20 and 16 (+0.125 ·
  +0.1875 — the build's 2 dp box reads +0.195, because it rounds x and w separately — and +0.125),
  the 16 sitting on the mark ceiling's right edge. This is the one place in the set where an
  outline is deliberately off centre **so that its filled twin is on it**.
- **`attachment-2` ×2 at 20 — +0.25 — a placement the prose describes:** *"Box 0.25 right of centre
  at 20, 0.125 at 16, as B"* (`src/icons/24/attachment-2.svg`); the file gives no reason beyond the
  sibling.
- **`map-pin` ×2 and `map-pin-2` ×2 at 20 and 16 — −0.25 — top edge on the portrait keyline, the tip
  0.5 short of its foot.** The prose records the height, not the placement: *"ink 16x20 · 12x15.5 ·
  10x13.5 (20 and 16 use the keyline's 0.5 tolerance on height so the pin does not grow pointier as
  the keyline gets taller)"* (`src/icons/24/map-pin.svg`). The head stays on the keyline top; the
  half unit the pin gave up is all at the tip.

**The 90 on a keyline edge** are, beyond the pins, bugs and bullets above, the `rotate-ccw` family
at every master (eight of its concepts; the arrowhead's foot on the keyline, the arc's crown
0.03–0.25 short), `attachment-3`/`-4` (an edge on the keyline, 0.04–0.15 short), `wand-3`,
`list-ordered` at 16, `list-bullet` at 16 (the mark ceiling's right edge, +0.1875), and
`gear-3-filled` at 16 and 24 (a tooth on the keyline top, a valley at the bottom — the file says
*"the box sits 0.1 · 0.19 above the canvas centre (a tooth on top, a valley at the bottom; inside
lint's 0.5)"*, `src/icons/24/gear-3.svg`). None exceeds 0.25; 72 of the 90 are 0.125 or less. The
**36 under half a grid step** are `megaphone`, `wand-2`, `pin-5`, `pin-6`, `rotate-ccw`,
`rotate-ccw-2`, `rotate-ccw-3` — half with an edge snapped to the grid, half with a box whose edge is
an arc or tangent extreme and lands where it lands; none over 0.085. The **4 body-centred** are
`gear-3` at 24 and 16 (the rim centred, 18 and 12 teeth set the box) and `rotate-ccw-8`/`-10-filled`
at 20. The **12 proud** are `watch-2` ×6 and `rotate-ccw`/`-2`/`-3` at 24, both styles, where the
arrowhead stands 0.12 past the rest (offset 0.06). The **12 whose prose records the placement** are
`volume-off` ×2, `map-pin-4` ×2, `attachment-2` ×4 and `pin-4` ×4 (0.06–0.13; *"those flat edges
were moved … until their outer edges sit on whole pixels"*, `src/icons/24/pin-4.svg`) — of which
`attachment-2` records the offset and no reason. The build's 2 dp box misreads ten of the 154 by
0.005–0.0075 (it rounds x and w separately): `pin-4` at 24 is +0.125 / −0.125, not +0.12 / −0.13;
`gear-3` at 16 is 0 / −0.192; the full list prints from `offcentre`.

**The 12 in level families** are what C28 says they are: `volume-low` −2.50 · −2.00 · −1.75 and
`volume-none` −5.00 · −4.00 · −3.50, both styles, declared only by `anchor: volume`
(`docs/07:68`). The body stays in place; the `shift` field cannot say so — card 1.12's F5
(`findings-metrics.md:541-558`).

**Kinds.** The drawings are fine by every rule. The only centring rule with a number is C10/C12's
*2 dp, no tolerance* for **bent marks** (`docs/07:50`, `:52`), none of these is one, and lint's
±0.5 (`lint.mjs:361`) passes them all. What is missing is the rule: the tolerance for everything
that is not a bent mark is a number the code chose and no one decided, which the ledger files as
L-7 (`exceptions-ledger.md:633-660`, `:708`). **Kind (2)** — the rule's, not the drawings'. No note
kind can declare any of the 154, the 44 with a stated reason included. What this card adds to L-7
is the cost table: a tolerance of **half a grid step** would pass 116 and ask 38 drawings in 13
concepts to declare themselves; a tolerance of 0.01 would ask 152 (`pin-6` ×2 at 16 sit at exactly
0.010).

---

## 3. Which icons should carry a shift and do not

### 3.1 By C15's measure — the shapes it is defined on

The measure is defined on one open bend (`M L A L`, one path). At the pin that is **264 drawings in
44 concepts**: the 36 chevron concepts (216 drawings, all declared) and the **8 check concepts**
(`check`, `check-small`, `check-2`, `-2-small`, `-3`, `-3-small`, `-4`, `-4-small`: 48 drawings,
none declared). By the sheet's measure, at 24 outline: `check` +0.45 right / −0.10 up, `check-2`
+0.65 / −0.35, `check-3` +0.40 / −0.05, `check-4` +0.40 / −0.25, their smalls +0.30–0.50 right /
0.05–0.25 up; over all 48 drawings **+0.20 to +0.65 right and −0.35 to +0.05 on the vertical**,
and **45 of the 48 would move 0.25 or more, 5 would move 0.5 or more** (`check-2` at 24 and 20 in
both styles, and `check-2-small` at 24 outline). Those are the sheet's figures. Its apex is exact
only for equal legs (§0), and the checks' legs are not (ratio 1.97–4.52): with the arc's true
midpoint **16 of the 48 recommendations change by one 0.05 step — 44 would move 0.25 or more and 4
would move 0.5 or more** (`check-2` at 24 and 20, both styles; `check-2-small` at 24 falls to
+0.45), the range over the 48 being +0.20 to +0.65 right and 0 to 0.35 up; the chevrons are
unaffected (0 of 216). In pixels at 16: 0.20–0.45 either way.

**All 48 are covered by a recorded decision.** C14: *"Checks stay box-centred on both axes (user
decision 2026-09-17, after an audit)"*, with the reasoning — *"8 of 9 stroked references (Nucleo,
Lucide, Central) centre the check, its line weight sits within 0.3 of centre, and only the
end-triangle measure disagreed, which also called every reference crooked … Box-centred reads fine;
confirmed against full line-weight and end-triangle corrections side by side"* (`docs/07:54`), and
the commit that removed their shifts, `c61d9ed`. (The 16 masters were redrawn on 2026-09-20 for
the 1.25 stroke, `plans/stroke-16.md`, so the 16 figures above are not the ones on that day's
sheet; the 24 and 20 are.) So the answer to the card's question, on the
method's own terms, is **none**: every drawing C15's measure would move either carries a note or
carries Maruti's decision not to. The check is also the one shape on record where the measure and
the eye part company — worth remembering when OC-1 proposes binding lint to the measure.

### 3.2 Shapes the measure does not cover

- **Arrows** (an open bend plus a shaft; 25 concepts). C15 has no measure for them, and C14 records
  the eye's answer: *"Arrows stay box-centred (arrow-up, -2, -3 and -4 judged on the sheet from up
  0.2 to down 0.4; user pick 2026-09-17)"* (`docs/07:54`). On the mass screen they are among the most
  lopsided drawings in the set (§3.3, 2.18–2.43 toward the head) — the clearest evidence the screen
  is not the eye's measure.
- **Closed triangles** (`play` ×3 declared with values consistent with the triangle's own centroid
  × 0.5, §1 — an inference; `alert-triangle` ×4 declared by construction). No other closed triangle
  ships.
- **Menus and menu-arrows**: *"Menu styles stay box-centred (menu-2, menu-3, menu-arrow-left/right
  judged on the sheet, 2026-09-17)"* (`docs/07:54`).
- **Everything else** — objects — has neither a measure nor a decision. §3.3.

### 3.3 The mass screen — for the eye, not a rule

The centreline mass centre against the ink-box centre, outline files, on the axes each drawing is
lopsided on (`mirrors`; 48 drawings mirror both ways and score 0). Distribution of the larger axis:

| Master | Outlines | Median | p90 | Max | ≥ 0.5 | ≥ 1 |
|---|---|---|---|---|---|---|
| 24 | 485 | 0.47 | 1.85 | 3.93 | **218** | 132 |
| 20 | 485 | 0.35 | 1.45 | 2.67 | 200 | 103 |
| 16 | 485 | 0.36 | 1.23 | 2.30 | 198 | 80 |

The declared 45 sit at a median 0.09 on this screen (max 1.94, `play`; then `alert-triangle` 1.86,
`play-3` 1.85, `alert-triangle-3` 1.82 — the closed triangles, whose mass sits toward the base):
the screen cannot see what C15 corrects, as C15 says. The top of the list at 24, with what was drawn
(`corrected` = the box centre's offset from the canvas centre, i.e. the shift actually taken):

| Concept | Mirrors L–R / T–B | Mass − box (x, y) | Corrected | On record |
|---|---|---|---|---|
| `login-3` / `login` | n / y | −3.93 / +3.93, 0 | 0, 0 | — (door and arrow; card 1.9 §2.6) |
| `chart-bar-2` | n / n | −0.56, +3.21 | 0, 0 | — |
| `paintbrush-3`, `paintbrush-7` | n / n | −0.69, +3.05 · −0.48, +2.85 | 0, 0 | — |
| `sort-numeric-ascending-3` / `-descending-3` | n / n | −2.91, ±0.1–0.4 | 0, 0 | C17 territory, `plans/sort-family.md` |
| `flag`, `flag-2`, `flag-3`, `flag-4` | n / n | −1.06…−1.50, −2.44…−2.91 | 0, 0 | — |
| `text` | y / n | 0, −2.87 | 0, 0 | — |
| `volume-minus` | n / y | −2.78, 0 | 0, 0 | C28 anchor |
| `login-2` / `login-4`, `logout` ×4 | n / y | ±2.72 · ±1.56–1.58, 0 | 0, 0 | — |
| `arrow-up/-down/-left/-right` and `-2`, `-3` | one axis | 2.18 – 2.43 toward the head | 0, 0 | **judged, left centred** (`docs/07:54`) |
| `wand-3`, `filter-4`, `rotate-ccw-3` | n / n | +2.34, −2.26 · +0.06, −2.31 · +0.58, −2.30 | ≈ 0 | — |
| `home`, `home-2`, `home-3` | y / n | 0, +1.48…+1.97 | 0, 0 | — |
| `map-pin-5`, `map-pin-3`, `map-pin`, `map-pin-2`, `map-pin-4` | y / n | 0, +2.01 · +1.41 · −1.15 · −0.95 · −0.85 | 0 · 0 · 0 · 0 · +0.34 | — |
| `user`, `user-2` | y / n | 0, +1.58 · +1.54 | 0, 0 | — (`user-3` −0.50, `user-4` −0.12) |
| `heart`, `heart-2` | y / n | 0, −1.47 · −1.58 | 0, 0 | — |
| `lock`, `lock-2` | y / n | 0, +1.18 · +1.30 | 0, 0 | — |
| `key`, `key-5`, `key-6` | n / n | −1.99, +0.15 · −1.46, +0.16 · +0.16, −1.46 | 0, 0 | — |
| `lightbulb-4`, `lightbulb-3` | y / n | 0, −1.00 · −0.84 | 0, 0 | — |
| `send` | n / n | +1.10, −1.10 | 0, 0 | — |
| `bell`, `bell-2`, `bell-3` | y / n | 0, +0.13 · −0.12 · −0.05 | 0, 0 | not lopsided on this screen |
| `megaphone`, `-2`, `-3` | n / n | −0.55, +0.64 · +0.53, +0.98 · −0.31, −0.48 | ≈ 0 | — |

Ninety-five families have at least one member at ≥ 0.5 on this screen at 24; the full ranking
prints from `screen`. Two cautions travel with it. First, the sign: on a chevron the triangle's
centre sits toward the open side and the mark moves *away* from it, toward the point; carried to a
`map-pin`, whose mass sits 1.15 high in its box, that analogy would move the pin *down* toward its
point — while the superseded sentence at `docs/01:372-374` says *"shifting mass up by 0.5 units"*
for *"a pin, a flag, a droplet"* (`stale-statements.md:74-82` already lists it). The two point in
opposite directions, and only the eye can say which, if either, is right. Second, the arrows: the
screen ranks them above every object, and Maruti judged them and left them centred. Whatever the
eye does with this list, the screen's number is not the recommendation; the sheet's rows are.

**Kind.** (3) throughout — nothing here breaks a rule, and no rule covers an object lopsided by mass.

---

## 4. Consistency — the same shape, the same shift?

**Turned and mirrored siblings.** The same drawing turned four ways:

| Shape | down · up · left · right at 24 | 20 | 16 |
|---|---|---|---|
| classic (`chevron-*`), all three sizes | 0.50 · 0.50 · 0.50 · 0.50 | 0.43 ×4 | 0.38 ×4 |
| flat (`-2`) | **0.55 · 0.40 · 0.55 · 0.55** | 0.46 · 0.34 · 0.46 · 0.46 | 0.42 · 0.31 · 0.42 · 0.42 |
| flat `-small` / `-large` | 0.46 · 0.34 · 0.46 · 0.46 / 0.64 · 0.46 · 0.64 · 0.64 | 0.40 · 0.29 … / 0.55 · 0.40 … | 0.37–0.38 · 0.27 … / 0.48 · 0.35 … |
| steep (`-3`) | **0.61 · 0.65 · 0.65 · 0.65** | 0.52 · 0.56 · 0.56 · 0.56 | 0.46 · 0.49 · 0.49 · 0.49 |
| steep `-small` / `-large` | 0.47 · 0.51 · 0.51 · 0.51 / 0.74 · 0.79 · 0.79 · 0.79 | 0.41 · 0.44 … / 0.63 · 0.67 … | 0.37 · 0.40 … / 0.54 · 0.58 … |

The classic shape is one magnitude turned four ways. The flat shape's **up** member carries 0.40
against 0.55 (0.15 at 24; 0.11 at 16, about a tenth of a pixel), the steep shape's **down** member
0.61 against 0.65 (0.04). These are C14's recorded picks — *"up classic 0.5 · flat 0.4 · steep 0.65;
left and right classic 0.5 · flat 0.55 · steep 0.65 (user picks 2026-09-17)"* (`docs/07:54`) — and
docs/09 has already filed the asymmetry (*"By-eye scatter of ~0.15 px, not design. One magnitude per
shape would be more honest"*, `docs/09:41`) and listed **"symmetrise chevron shifts"** among the six
rulings waiting on Maruti (`docs/09:93`). This card adds only the measure: the turned drawings are
one triangle, so C15's measure gives one magnitude per shape (0.50 · 0.40 · 0.65), and the picks
sit ±0.15 around it. The odd member is 18 files on each shape (3 sizes × 2 styles × 3 masters), 36
in all. **Kind (3)** — eye picks, no rule broken; a pending ruling, not a new one.

**Size variants.** The sheet's convention — a `-small` or `-large` carries the default's value
scaled by its ink extent at the same master, stored to 2 dp — holds on **72 of 72** size-variant
outline files within 0.01. Consistent.

**Outline and filled twin.** The filled twin declares the outline's value on **135 of 135**
concept-masters (the ledger measured the same). Its *own* C15 measure would differ: the heavier
line changes the box and the bend, and on **100 of 108** single-bend pairs the filled twin's own
recommendation is one sheet step (0.05) or more from the outline's — at most **0.10** (every chevron
at 24 and the smalls at 16: outline 0.50, filled 0.40, and so on). The convention resolves the
difference in favour of **C12** (the filled ink box equals the outline's, `docs/07:52`), which a
twin carrying its own measure would break. Nothing writes that convention down; it is consistent,
and it is a silence. **Kind (2) silence**, no cost today.

**The other families.** `alert-triangle` ×4: one constant −0.50 at every master against ink-extent
ratios 1.000 · 0.789 · 0.684 — consistent within the family and deliberately not scaled (§1).
`play` ×3: each shape its own value (0.95 · 0.80 · 0.90 — C15's "each shape on its own range"),
each scaled across masters by ink width (ratios 0.747 · 0.621 against 0.750 · 0.625; 0.750 · 0.625
exactly; 0.711 · 0.567 against 0.714 · 0.571). `info-2`: −0.45 · −0.39 · −0.39 — ratios 1.000 ·
0.867 · 0.867 against ink 0.800 · 0.700, so the 16 repeats the 20 rather than scaling (the
register's "0.075 wide", `rule-register.md:102`); C18 records the three as picked *"from centred …
stem on centre"* (`docs/07:58`), a per-master eye pick, not a scaling. `info-3`: −0.35 · −0.27 ·
−0.25, the 16 rounded to the quarter grid as C18 says.

---

## 5. `alpha` 0.75 — what the published bearings do at other values

`tools/optical.mjs:70` charges **0.75** of a side's mean recession as optical bearing; the comment
says it *"matches the corrections designers make by hand"* (`:42-44`); `CLAUDE.md:241` lists tuning
it as open item 3; card 1.12 found it has never been set against the eye in this project
(`findings-metrics.md:626-646`). A side's bearing moves by **|α − 0.75| × its recession**, so the
question is how much recession the set carries. Measured with the pin's own `opticalBearings`
(recession identical to the published value on every side):

- **1,884** stroke-only drawings publish an optical bearing; 2 of them (`paintbrush-4` at 24 and
  20) publish `null` and cannot move (card 1.12 §3.2, `findings-metrics.md:265-282`). The **1,026
  shape-filled** drawings publish recession 0 and do not move at any α (card 1.12 §3.1,
  `:231-263`) — so any change to α widens the outline-against-filled gap that card found, on
  every pair.
- Largest recession per drawing: **median 0.85 · p90 1.31 · max 2.18**. More than half the stroke
  drawings have a side that recedes by more than half a stroke.

| α | A side moves > 0.1 when its recession exceeds | Drawings | Concepts | By master 24 · 20 · 16 | Sides | Largest move |
|---|---|---|---|---|---|---|
| 0.5 or 1 | 0.400 | **1,385** of 1,882 | 376 | 472 · 464 · 449 | 3,966 | 0.55 units |
| 0.625 or 0.875 | 0.800 | **976** | 297 | 361 · 356 · 259 | 2,635 | 0.27 units |

The twenty drawings whose bearings would move most — all line-heavy **filled** twins at 24, whose
heavier round caps recede furthest: `italic-filled` (left 2.18: bearing 7.09 at α 0.5 · 7.63 at 0.75
· 8.18 at 1), `rotate-ccw-7-filled` (bottom 2.18), `attachment-4-filled` (right 2.14), the eight
`check*-filled` (top 1.95–2.08), `arrow-up-right-filled` and `-3-filled` (left 1.95), the four
`chevron-*-3-large-filled` (1.88), `hash-3-filled` (1.85), `filter-2-filled` (1.80),
`arrow-up-right-5-filled` (1.79). The full concept lists (376 and 297) print from `alpha`.

**Kind.** (3), and a measured question for the eye: the value is not wrong by any rule, and no
rule or sheet exists to set it. `[surface needed]` — the Library panel shows the bearings at 0.75
only.

---

## 6. R-10 — `volume-off` at 16 — and `watch-2`: which kind each is

The ledger's R-10 asks whether `volume-off`'s half unit at 16 should be declared, and names
`watch-2`'s exact 0.50 at every master as the next question of the same kind
(`exceptions-ledger.md:739`, §2.14 at `:633-660`). Measured:

**`volume-off` at 16, both styles.** Ink 1.5 → 13.5 × 2 → 14 (12×12, the C21 bar's square), centre
7.5 — **−0.50**; at 24 and 20 the ink is 18×18 and 14×14 centred to the thousandth. No part stands
proud; no edge is on a keyline; an exactly centred box would sit on the grid (x 2 → 14), so this is
not rounding. The speaker alone runs **4 → 11** — 7 wide, both edges on whole pixels; centred it
would run 4.5 → 11.5, both on half pixels. The centreline mass centre is **7.85**, 0.15 left of the
canvas centre (the prose's own figure, 7.8, is a different mass measure, §7). Everything the file
says is true of the drawing. **Kind: a whole-pixel placement of the body, judged by eye at real
size, written in prose, carried on lint's slack** — (1) against C28's *"centred as its own icon"*
as written (`docs/07:68`), agreed on the board (the ledger's verdict, `:633-660`). It is **not** an
optical correction in C14's sense: nothing points, the mass is on the lighter side by design, and
the reason is the pixel grid. Of R-10's two options, declaring it `optical: -0.5 0` would record a
pointing-mark correction that is not one; a note for a whole-pixel placement would say what the
drawing is. OC-2 carries this.

**`watch-2` at 24 · 20 · 16, both styles.** Ink 15×20 · 11×16 · 9×14 (`box:` declared), centre
**+0.50** at every master. The crown — a one-unit stub at the case's mid-height — stands exactly
1.00 past the case; the case and straps are centred at 12 · 10 · 8. The mass centre is +0.10 · +0.09 ·
+0.09. The file: *"agreed box, 0.5 off the case centre, as D"* (`src/icons/24/watch-2.svg:4`).
**Kind: a part standing proud of a centred body** — the body in place, the modifier outside it, the
same idea C28 states for level families (*"one body identical and in place"*) and that card 1.9's
badge grammar will need for a badge on the drawing bound (`findings-grammar.md:597-620`, P1). No
note can declare it: `box:` records the size, `anchor:` is scoped to level families, `optical:`
means a pointing mark moved toward its point. Both drawings pass because 0.50 is not *more than*
0.50 (`lint.mjs:361`; `enforcement-gap.md:88-118` found the eight drawings resting on the limit —
these are they).

---

## Judged list — ranked by how many drawings each touches

| # | What sticks out | Drawings | Kind | Where it already lives |
|---|---|---|---|---|
| 1 | **`alpha` 0.75 has never been set against the eye**, and it is not a corner: a quarter step moves 1,385 of 1,882 stroke drawings' bearings by more than 0.1 (§5) | 1,882 | (3) | `findings-metrics.md:626-646`; `CLAUDE.md:241` |
| 2 | **The `optical:` note is taken on trust** — lint moves the target by the declared amount, unchecked (`lint.mjs:319-321`). This card supplies what a bound would check against: the sheet's measure on single-bend marks reproduces every shipped chevron within 0.16 and the triangle's centroid matches `play` to the 0.05 step; a bound at 0.25 would pass all 234 of those files today, would need a construction kind for `alert-triangle`'s 24 (§1), and has the checks as a counter-case (OC-1) | 270 | (2) | `exceptions-ledger.md:333-385`; `severity-proposal.md:122-128` row 3; `enforcement-gap.md:88-118` |
| 3 | **218 of 485 outlines are lopsided by mass by half a unit or more and nothing has looked at them** — the screen's list for the eye (§3.3), with the caution that it also ranks the arrows Maruti left centred | 218 outlines at 24 | (3) | new; `docs/01:372-374` points the other way and is already listed stale |
| 4 | **154 drawings sit off centre on a tolerance nobody chose**, every one with a measurable description, 44 with a stated reason, 110 consequences nobody has judged, none over 0.5; a half-grid-step tolerance would pass 116 and ask 38 (13 concepts) to declare themselves (§2) | 154 | (2) missing rule | `exceptions-ledger.md:708` L-7; `severity-proposal.md:108-120` rows 1–2 |
| 5 | **Two concepts use `optical:` for something C14 does not describe**: `alert-triangle` ×4 (a construction lift, −0.5 at every master) and `info-2`/`-3` (a mark moved inside a fixed ring); the build publishes both as `shift` (§1) | 36 | (2) | `findings-metrics.md:410-430` (the 12 info entries); `rule-register.md:102` (the nine misses) |
| 6 | **The flat and steep chevrons' odd member** — flat up 0.40 against 0.55, steep down 0.61 against 0.65 — the measure gives one magnitude per shape (§4) | 36 | (3) | `docs/09:41`, `:93` — a ruling already waiting |
| 7 | **`play`'s measure is recorded nowhere**; the values match the triangle's centroid × 0.5 to the sheet's 0.05 step, an inference (§1) | 18 | (2) | `src/icons/24/play.svg:5`; commit `5ac8340` |
| 8 | **`watch-2`'s crown and `volume-off`'s pixel placement have no note that can declare them** and rest on exactly 0.50 (§6) | 8 | (1) agreed, undeclared | `exceptions-ledger.md:739` R-10 |
| 9 | **The filled twin carries the outline's shift while its own measure differs by up to 0.10** on 100 of 108 pairs — C12 wins, and nothing says so (§4) | 108 pairs | (2) silence | — |

**Where the set is simply good.** The chevrons: 36 concepts, 216 files, every value within 0.16 of
the sheet's measure, every size variant within 0.01 of the convention, every filled twin equal to
its outline, every per-master value within the register's 0.007. The method C15 describes is the
method that was used, and it left a trail a tool can follow.

---

## What only Maruti's eye can settle, and where

| Question | Surface |
|---|---|
| Should any of the mass-lopsided objects move — `login`/`logout`, the flags, `text`, `home`, `user`, `heart`, `map-pin`, `lock`, `key`, `send`, `lightbulb` — and in which direction (§3.3's two signs)? | `node tools/optical-sheet.mjs <name> --rec <name>=<x>:<y>` on `/lab/optical-shift.html` (the sheet needs `--rec` for a shape it cannot measure, `SKILL.md:138`); candidates from §3.3's table, one family per sheet |
| `alpha`: how much of a recession the eye charges — 0.5, 0.625, 0.75, 0.875 or 1 — judged beside a label at 24 and 48, on the top movers of §5 | `[surface needed]` — a sheet showing one icon beside text at each α, bearings applied; the Library panel shows 0.75 only |
| The flat and steep chevrons' odd member: one magnitude per shape, or the picks as they stand? | `node tools/optical-sheet.mjs chevron-up-2 chevron-down-3` with rows at the sibling's value, `/lab/optical-shift.html` — docs/09's pending ruling |
| Does `watch-2` read centred with its crown standing proud, as the mass centre (+0.10) suggests, or does the eye want the box centred? | the Library's At 16 strip, `watch-2` beside `watch`, `watch-3` and the squares |
| `volume-off` at 16: the whole-pixel speaker 0.5 left, or the centred box on half pixels — the file says the first was judged *"balanced at real size"*; the eye confirms or not | `/lab/figures.html?object=volume` or the At 16 strip, real pixels, beside `volume`, `volume-x` |
| `alert-triangle`: does the half-unit lift read as the sign sitting right, or as high? (its centroid sits 2.04 units low in its box at 24) | the At 16 strip beside `alert-circle` and the square containers |

---

## Proposals for Maruti to rule on

**These are proposals with a recommendation each; nothing in the set, the rules or lint changes
until Maruti rules. They go to the wave-5 decision agenda (5.2).**

**OC-1 — Bind the `optical:` note to the measure it claims.** *Evidence:* §1, §3.1; the ledger's §2.5
and severity §4.5 row 3 ask for a bound and leave the margin open. *Recommendation:* lint warns when
a declared shift sits more than **0.25** from C15's measure for that drawing — the sheet's
`triangleOffset` for a single-bend mark, the triangle's own centroid × 0.5 for a closed triangle
(which `play`'s values match to the nearest 0.05) — scaled by the sheet's own convention for sizes
and masters.
Today that passes all 216 chevron files (largest eye correction 0.16) and all 18 `play` files
(largest 0.06) and would have flagged a copied value or a slip of a tenth. It cannot judge
`alert-triangle` (OC-2) or a glyph in a ring (`info-2`/`-3`, which C18 derives from mass and the
sheet's `--hold`); those need a measure of their own or an exemption named in the file. The measure
it checks against should be the true-apex one (§0): on the chevrons the two agree, on an unequal
bend they do not. **The margin has a counter-case on record, and it is Maruti's to set.** The
largest eye correction in the set is not a chevron's 0.16 — it is the checks: Maruti's 0 against the
measure's 0.45–0.65 (C14, 2026-09-17). A bound at 0.25 would have flagged that decision had it been
declared as a shift; it caps what C15 leaves to the eye. 0.25 is one visible quarter pixel at native
size and wider than every correction on a *declared* shift; whether the eye may overrule the measure
by more than that — and how it then says so in the file — is the ruling, not the number.

**OC-2 — A note for a drawing placed on purpose, and `optical:` kept for what C14 says it means.**
*Evidence:* §1 (`alert-triangle`'s construction lift wears `optical:`), §6 (`volume-off` at 16 and
`watch-2` have no note at all and rest on the slack), §2 (13 drawings describe a placement in prose
that lint cannot read). *Recommendation:* one declared note for *"this drawing sits here on
purpose"* — the form is Claude's to design, roughly `<!-- placed: dx dy — reason -->` — which lint
holds **exactly**, as it holds `box:` and `anchor:` (no ±0.5 around it), and which the build
publishes as something other than `shift` so card 1.12's F5 is not made worse. `alert-triangle`
would move from `optical: 0 -0.5` to it; `volume-off` at 16 (R-10) and `watch-2` would gain it.
This is R-10's second option, widened from one drawing to the kind, which is why it is Maruti's.
The alternative — widen `optical:` to cover construction placements — keeps three meanings under one
word and leaves the centring check at ±0.5 around whatever is declared.

**OC-3 — Record how `play`'s shift was derived, where `play`'s value lives.** *Evidence:* §1 —
0.95 · 0.80 · 0.90 are consistent with the triangle's centroid × 0.5 to the sheet's 0.05 step (raw
0.96 · 0.81 · 0.92); the batch draft says the shift was *"set later on the optical-shift sheet"* and
no sheet run is on record, so the derivation is an inference, not a record. *Recommendation:* confirm
it on a sheet row (`node tools/optical-sheet.mjs play --rec play=0.96:0`) and record the measure in
`play`'s three files or a note scoped to them — one family is not a rule, and this is one family.
**Separate, open:** whether C15 should gain a general clause (*for a closed triangle the measure is
its own centroid*) so that OC-1 can check closed triangles at all. Today `play` is the only closed
triangle with a measured shift (`alert-triangle`'s lift is a construction, OC-2), so the clause would
be written for one icon; the question is listed, not recommended.

**OC-4 — The centring tolerance for icons that are not bent marks (L-7), with this card's cost
table.** *Evidence:* §2 — none of the 154 is over 0.5; 116 are within half a grid step; the 38
beyond belong to 13 concepts, every one with a measurable description (a keyline edge held, a proud
part, a pixel placement) and 44 of the 154 with a reason written in the file. *Recommendation:*
**half a grid step** (0.125 · 0.125 · 0.0625) as the undeclared tolerance, with OC-2's note for
anything wider — which asks 38 drawings in 13 concepts to declare themselves and nothing to be
redrawn; declaring is also the moment the 110 offsets nobody has judged get judged. A 0.01
tolerance would ask 152 (`pin-6` ×2 at 16 sit at exactly 0.010) and would make the 90 keyline-edge
drawings declare something that is a consequence of their box, which nobody has yet judged. The
ledger's L-7 and severity §4.4 rows 1–2 hold the decision; this adds the numbers.

**OC-5 — Set `alpha` by eye, on a surface, before the metrics ship.** *Evidence:* §5 — 1,385 of 1,882
stroke drawings move by more than 0.1 at a quarter step; the shape-filled 1,026 do not move at all.
*Recommendation:* build the surface (wave 4) and judge the top movers beside text at 24 and 48 at
0.5 · 0.625 · 0.75 · 0.875 · 1, **together with** card 1.12's F1 (whether a filled drawing should read
as stopping where its outline does), because any α other than the one that makes the two agree
widens that gap. No value is recommended here; it is the eye's.

**OC-6 — Fold docs/09's "symmetrise chevron shifts" with the measure.** *Evidence:* §4 — the turned
drawings are one triangle; the measure gives one magnitude per shape (0.50 · 0.40 · 0.65); the picks
differ by 0.15 (flat up) and 0.04 (steep down), 0.11 and 0.03 px at 16. *Recommendation:* settle it
on the sheet as docs/09 already asks, with the measured magnitude as the tagged row; if the eye
keeps the odd member, record it as an eye pick in C14 so the asymmetry stops reading as drift. Not a
new ruling — a pending one with its number attached.

**OC-7 — Write down the twin convention.** *Evidence:* §4 — 135 of 135 filled twins carry the
outline's shift; their own measure differs by up to 0.10. *Recommendation:* one sentence in C15 or
C12: *the filled twin carries the outline's shift, because C12 holds the box.* No drawing changes.

---

## 7. For wave 5 to reconcile — never pick

| Quantity | This card | Elsewhere |
|---|---|---|
| Drawings publishing `shift [0,0]` with their ink off centre | **166** = 12 anchored + **154**; **68** of the 154 in (0.1, 0.5] — the build's 2 dp box, the larger axis offset > 0.005 (§2) | card 1.12 §4: **177** = 12 + **165**, **70** in (0.1, 0.5] — `metrics-check.mjs`'s solved box, the unrounded offset as a distance √(dx²+dy²) (`findings-metrics.md:410-430`; `metrics-probe.mjs:375,380`). Both reproduce from `reconcile`: on the solved box it is **177 either way**, per axis or as a distance (0 entries differ); the eleven between 166 and 177 are check twins whose solved offset is 0.00505–0.00666, which the build's 2 dp box rounds to 0.000–0.005 and drops; this card's first run rounded the solved offset to 3 dp before the threshold and dropped nine of them too (168). The band is 68 on either box per axis; `megaphone`/`-filled` at 20 (−0.079, −0.075) enter it by distance only, hence 70 |
| Drawings off centre after their declared shift | reproduced exactly: **164** > 0.01 · 80 > 0.10 · 20 > 0.25 · 8 = 0.50 · 0 > 0.50, on 2,880 non-anchored drawings, lint's 2 dp reading | `enforcement-gap.md:88-118`; `exceptions-ledger.md:633-660`. A different population from the row above: it includes the 270 declared files and excludes nothing else |
| The "two-icon question" | `alert-triangle`: a construction lift, −0.5 at every master by design (§1); `info-2`: per-master eye picks recorded in C18, the 16 repeating the 20 (§4) | `rule-register.md:102`, `:127-134`: *"only two concepts deviate"* — the same two; this card gives the why |
| `volume-off` at 16, mass centre | centreline centroid **7.85** (0.15 left of centre) | the file's prose: **7.8**, *"the ink's mass centre"* (`src/icons/16/volume-off.svg:3`) — the board's Inspect measure, which counts ink area, not centreline length |
| `info-2`'s mass after the shift | the mark's centreline mass **+0.12 · +0.15 · +0.11** right of centre (§1) | C18: *"moved left 0.45 · 0.39 · 0.39 so its mass is centred"* (`docs/07:58`) — a whole-icon or ink-area measure, not stated |
| `info-3`'s mass after the lift | **+0.33 · +0.69 · +0.48** low (mark only, centreline) | C18: *"0.94 low box-centred, and the lift brings that to 0.59"* at 24, and C18 itself says the figure is stale since the C19 re-cut |
| The declared values and the grid | 12 · 12 · 13 of 90 declared files per master have all ink-box edges on the grid; the chevrons' boxes are off-grid by construction (§1) | `exceptions-ledger.md:333-385` §2.5(a): 39 of 45 shifts at 16 off the eighth grid, 78 of 90 at 24 and 20 off the quarter grid — the values; this card measured the boxes |
| The chevrons against C14's scaling | not re-measured; the census shows each master's declared value within 0.06 of the drawing's own measure | `rule-register.md:102`: 81 of 90 within 0.05, chevrons within 0.007 |
| Checks: the measure against the decision | C15's measure would move the 48 check drawings +0.20…+0.65 right, −0.35…+0.05 on the vertical (§3.1) | `docs/07:54`: *"up shifts (0.2 · 0.35 · 0.05 · 0.3) were picked, then withdrawn"* — the earlier sheet's picks, up–down only |

---

## Handover — what this card measured but does not own

| Finding | Belongs to |
|---|---|
| OC-1…OC-7 as decisions; OC-2 beside R-10, OC-4 beside L-7, OC-6 beside docs/09's pending ruling | **5.2** decision agenda |
| The eye list of mass-lopsided objects (§3.3) and the `alpha` surface | **4.4** eye-only list; **4.1** the wall; a new sheet for α `[surface needed]` |
| The measure a lint bound would use (`triangleOffset` restated, the closed-triangle centroid) and the 0.25 margin | **3.5** severity (`severity-proposal.md:122-128` row 3), and whoever owns lint after the rulings |
| `play`'s unrecorded measure; the twin convention; `alert-triangle`'s lift described as a construction | **1.16** stale/incomplete statements — the exact C14/C15 edits, once OC-2/3/7 are ruled |
| The chevrons' off-grid boxes (12 · 12 · 13 of 90 on grid) | **1.6** the pixel grid (`findings-grid.md`) — already its subject; this card only measured the declared files |
| `list-bullet`'s outline placed off centre so the filled twin sits on it — C17's one-sided growth | **1.8** the filled style (`findings-filled.md`), **1.13** `grows:` (§2.6) |
| `watch-2`'s proud crown as a body-in-place case; the badge on the bound | **1.9** P1 badge zone (`findings-grammar.md:597-620`); **1.10** families |
| `info-3`'s stale justification (C18 says so) — a C15 sheet with `--hold 1` | the icon loop, when Maruti asks; recorded here only |
| **An instrument defect for the plan's list:** `optical-sheet.mjs:135-137` places the bend's apex at the chord midpoint pushed along the line toward the ends' midpoint, which is the arc's midpoint only for equal legs. On the checks (leg ratio 1.97–4.52) it sits 0.06–0.19 off the true apex and up to 0.036 off the arc; 16 of 48 recommendations move one 0.05 step. Chevrons unaffected (0 of 216, apex within 0.0006). The probe's `bendGeometry` has the true apex; the sheet is not changed in this build | the plan's "Known instrument defects" (main session); the sheet's owner, when C15's picks are next made |
| The build's 2 dp box rounds `x` and `w` separately, so an edge computed as `x + w` can sit 0.0075 from the true edge and a centre 0.005 from the true centre: `list-bullet` at 16 reads 2.38 + 11.63 = 14.01 for a true 14.0; ten of the 154 differ by ≥ 0.005 (§2) | **1.12** metrics (the published `ink` box is the product's) |
| Nothing in this card's area was left `[needs measuring]`. One thing it could not do: judge any of it — every shift on record was picked by eye, and the eye is not in the archive | — |

---

## How to reprint

```
P=/tmp/pin-5933041; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
node tools/audit/optical-probe.mjs $P census        # §1 table, grid lines, info rows
node tools/audit/optical-probe.mjs $P sheet         # §1 proof: 44 of 44 agree (runs the PIN's sheet, in the pin)
node tools/audit/optical-probe.mjs $P offcentre     # §2 causes, bands, the 26 ≥ 0.25, the 12 anchored
node tools/audit/optical-probe.mjs $P prose         # §2 the full comment of every concept in the population, with STATED_REASON
node tools/audit/optical-probe.mjs $P should        # §3.1 the 48 checks, sheet apex and true apex; §3.2 the closed triangles
node tools/audit/optical-probe.mjs $P screen        # §3.3 the mass screen
node tools/audit/optical-probe.mjs $P consistency   # §4
node tools/audit/optical-probe.mjs $P alpha         # §5
node tools/audit/optical-probe.mjs $P r10           # §6
node tools/audit/optical-probe.mjs $P reconcile     # §7 the other cards' counts, under their definitions
node --test tools/audit/optical-probe.test.mjs      # 15 tests
```

`node tools/audit/optical-probe.mjs $P` with no section runs everything but `sheet`. The tool
refuses to run `sheet` in a directory that holds a `.git`, so it cannot write the repo's board.

---

## Gate

- `node tools/lint.mjs | tail -1` in the repo → **2,910 drawings · 2,848 clean · 62 warned · 0 failed**,
  byte-identical to the run captured before this card started.
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → this card's **15 pass** (10,
  plus the four the review asked for and the two the closing check asked for), and every other audit
  test file passes (angles 16 · congruence 34 · families 27 · mass 25 · metrics-check 27 ·
  metrics-probe 1 · notes 21 · pixelgrid 23 · radii 17 · refs/pairgeom 18). At the time of this run
  card 1.17's untracked `polaris-scope.test.mjs` fails 13 of its 67; that card was being edited
  alongside, its files (`polaris-scope*.mjs`, `references-polaris.md`) appear in `git status` with
  card 1.10's (`families*.mjs`, `findings-families.md`), and nothing in this card's files is involved.
- `git status --short` shows, from this card, only this document, `tools/audit/optical-probe.mjs`
  and `tools/audit/optical-probe.test.mjs`; the drawing session's `lab/drafts/current.js` and
  `research/queue.md` were already modified before the card started and were not touched.
- **Files:** this document, `tools/audit/optical-probe.mjs`, `tools/audit/optical-probe.test.mjs`.
