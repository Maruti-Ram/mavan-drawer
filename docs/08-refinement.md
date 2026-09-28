# Refinement assessment — 2026-09-18

Why our marks read less refined than the references, what was measured, what was
decided, and what is still open. Written to be picked up cold in a new session.

Everything below is measured from this repo or from a named reference file, not
recalled. Where a number came from a reference it says so; references are input, never
rules (`research/references/` is gitignored — licensed, never committed or shipped).

---

## 1. How this came about

`help` (#21, a `?` in the info circle) was drawn badly twice before it was drawn well.
Both bad passes **lint clean** with centred ink boxes. Both were caught by eye in
seconds by the user:

- *"the curl looks crooked"* — the tail arc could not reach the axis in the height
  available, so the terminal stopped 0.93 · 0.72 · 0.52 right of the bowl's centre and
  the dot followed it. Reads as a mistake, not a decision.
- *"the coil in 16px looks stuffed"* — the bowl fell to r 1 with a counter of 0.5 units
  of white, a third of a stroke.

What fixed it was not more precision. It was **measuring one ratio** off Polaris
(bowl⌀/circle⌀ = 0.393, ours was 0.30) and **rasterising at 16×16** to look at pixels.

**The diagnosis: these were proportion failures, not precision failures.** Every metric
the project owns is absolute — ink box, geometric bearings, optical bearings, centring,
inter-path gaps — and none of them can see either fault.

---

## 2. What landed (all committed, tree clean)

| commit | what |
|---|---|
| `3c7f883` | **C19: the glyph gap** — rule + lint + `queue.mjs` declaration |
| `2f154f8` | `help` (Polaris bowl) |
| `ec9e827` | `help-2` (coil) |
| `fc3fc03` | `help-3` (hook) |
| `af0cdae` | **Re-cut the info family onto the C19 glyph gap** |
| `9bf26d7` | **Ratio and void metrics, and real pixels on the board** |

State: **95 of 561 approved · 570 drawings · 0 warnings · 0 failures.**
Next in the queue: **#22 `alert-circle`**.

---

## 3. The evidence

### 3.1 Our 16 master carries ~50% more ink than Central's

Total ink, rasterised at exactly 16×16 (`lab/refs/px16.html`):

| | total ink | ring wall |
|---|---|---|
| **ours · `help` 16 master** | **71.2 px** | 2.25 px |
| ours · `help` 24 master scaled to 16 | 48.4 px | 1.00 px |
| central · `questionmark-circle` | 47.2 px | 1.46 px |
| central · `questionmark-circle-2` | 41.4 px | 1.50 px |

**It is not blur.** Half-tone pixels (the ones that read as soft) are unchanged by
stroke weight: our 16 master measures 79 at stroke 1.5, 80 at 1.25, 80 at 1.0. It is
purely weight.

**Cause:** Central ships **one 24 drawing** and scales it, so at 16px its stroke is
6.25% of the canvas (1.0px). We draw a separate 16 master at 16 units with stroke 1.5 —
**9.4%** of the canvas. CLAUDE.md's geometry block already states this as a benefit
("smaller masters are heavier for free"); at 16 that is the thing being seen.

**But this is a fork, not a defect** — settled as **C7** in `docs/07-character.md`, 2026-09-18. See §6.2.

### 3.2 A stroke on the canvas centre axis never fills a pixel

Fluent: *"Creating a center line dividing down the middle will create a blurry line."*
True for our stroke too (`minus` 24 at 24px, `lab/refs/ctr.html`):

| bar position | pixel profile | peak | fully-inked px |
|---|---|---|---|
| y=12 (centre axis, **as shipped**) | 75% / 75% | 75% | **0** |
| y=12.25 | 50% / 100% | 100% | 1 |
| y=12.5 | 25% / 100% / 25% | 100% | 1 |

**109 runs across 26 concepts** sit on the centre axis: `plus`, `minus`, all 16 arrows,
`menu`, `menu-2`, `menu-arrow-*`, `plus-circle`, `minus-circle`, `info`, `info-3`.

### 3.3 Marks shrink relative to their ring as the master shrinks

Mark ink width ÷ container ink diameter:

| icon | 24 | 20 | 16 | drift |
|---|---|---|---|---|
| `plus-circle` | 0.53 | 0.50 | 0.46 | **−13%** |
| `minus-circle` | 0.53 | 0.50 | 0.46 | **−13%** |
| `x-circle` | 0.45 | 0.41 | 0.39 | **−13%** |
| `check-circle` | 0.51 | 0.49 | 0.47 | −8% |
| `info` (height) | 0.57 | 0.56 | 0.54 | −5% |
| `help` (height) | 0.60 | 0.63 | 0.57 | −5% |

Nobody decided this. C18 sizes inner marks "by eye to the check"; C8's step rule governs
*size variants*, not masters. Nothing held the ratio across 24 → 16, so it drifted.

**Combined with §3.1 the 16 master gets squeezed from both ends: the mark is ~10%
smaller inside its ring and the stroke is 50% heavier relative to the canvas.**

### 3.4 The glyph gap cost 44% of the 16 glyph

At the old 1.5 gap, dot (2) + gap (1.5) took **3.5 of an 8-unit glyph**. Rasterised at
16×16 (`lab/refs/gap.html`), the separating pixel row reads **100% clear background at a
0.88 gap just as at 1.5** — outline and filled, light and dark. The extra 0.6 bought no
separation at all.

Cross-checks: **Fluent's cut-out/separation is 1px** (1 at sizes 12–32, 1.5 only at 48).
**Central's `questionmark-circle-2` uses exactly 1.0.** Polaris runs 0.55, Nucleo 0.82.

### 3.5 The gap rule binds almost nothing else

Scan of all 92 then-approved icons: **133 separate-path pairs, 0 under 1.5, only 6
between 1.5 and 1.75** — and all 6 were glyph marks or mark-in-container pairs. A
carve-out for glyphs costs the other 127 nothing.

---

## 4. Decisions taken

### C19 — the glyph gap (`docs/07-character.md`, commit `3c7f883`)

A mark that is **one character with a detached dot** (`info`'s i, `help`'s ?, later
`alert-*`'s !) floors its **dot-to-body** space at **1 unit** (`GLYPH_GAP` in
`tools/masters.mjs`), not §6's one stroke width. Declared per file as
`<!-- glyph: dot -->`, written by `queue.mjs approve` from a candidate's `glyph`.

Applies to **that pair only** — never the dot's clearance to a container, never repeated
elements (C17 has its own rule), never parallel runs. Floored at 1 rather than Polaris'
0.55 because below one unit the clear pixel row depends on where the gap falls on the
grid; the 0.88 test passed on phase, not principle.

Also fixed a latent bug: `isDot` matched *any* two-arc path, so an open bowl-into-tuck
was classified as a dot and **its bend radius skipped the C10 check**. `isDot` now
requires the path to close.

### The info family re-cut (commit `af0cdae`)

C18 had set the dot 2 · 1.75 · 1.75 above the stem, chosen as *"more than the 1.5
minimum, so the dot reads as a dot, not a broken line"*. Measured, that void was
0.80–0.91 of the dot's own size against `help`'s 0.41–0.54 — two conventions in one
section, with four `alert-*` icons behind them.

All three re-cut to a 1 gap. Void/dot **0.80 → 0.40** at 24, **0.88 → 0.50** at 20 and
16. Stem grows 5.5 · 3.75 · 2.25 → **6.5 · 4.5 · 3**.

**Dot, body foot and every ink box untouched**, so all three optical declarations
validate exactly as approved. Two knock-ons recorded in doc 07:
- `info-3`'s 16 flag-to-bar gap returns to 1.5, withdrawing a C18 exception lint could
  never see (it skips touching paths).
- **`info-3`'s optical lift is now justified by a stale mass measurement.** The declared
  shift still validates because the ink box did not move, but raising the flag raised the
  mass the lift was correcting for. Wants re-deriving on a C15 sheet, by eye. *Not done.*

### `help` · `help-2` · `help-3` (commits `2f154f8` … `fc3fc03`)

All three share: circle, glyph box **12 · 10 · 8**, dot 2.5 · 2 · 2, terminal on the
axis with the dot directly below, counter never under one stroke. They differ only in
the tail (Polaris tuck / coil / straight 45°).

**They no longer all share one 16 — settled 2026-09-18.** `help-3` took its own (commit
`657fddf`); `help` and `help-2` keep the shared bowl. The two rulings were made on different
grounds, and both are recorded below.

**Corrected 2026-09-18.** This was first recorded as *"a C10-legal tuck would need a 0.57
radius; there is exactly one legal 16 drawing"*. Both halves are wrong. The 0.57 came from
forcing the **mark's** ink box onto the canvas centre; lint centres the whole ink box, which
on a container icon is the ring — shipped `help`'s 16 mark sits at **8.08**. Searched properly,
**31 legal 16 drawings exist**, including tucks at r1 – r1.5 and a straight 45° tail 1.15 long.

What actually forces the shared 16 is a different pair of rules. C19 makes the **dot** hold
MIN_GAP 1.5 to the ring, which pins the dot centre at y ≤ 11 and so the terminal at y ≤ 8.25.
An r1.75 bowl's foot already sits at 8.25, so it has no room to grow a tail; and dropping to
r1.5 to make room takes the **counter from 2 to 1.5** — one clear pixel instead of two at 16.
So a distinct 16 per shape is *available*, at the cost of half the bowl's counter. That is a
judgement at real pixels, not a geometric impossibility, and it is **undecided**.

The trap worth remembering: the first search constrained the glyph against the ring and forgot
the dot. It produced a drawing that measured well on every reported number and failed lint on
the one gap nobody had measured.

**`help-3` took the trade (user, 2026-09-18).** Its 24 and 20 are a bowl into a straight 45°
tangent tail, and its 16 had no tail at all — at the size where it is most likely to be read,
the hook had no hook and the three were one icon. Its 16 is now its own construction: bowl
r1.5 centred (7.75, 6.25) swept 180°, straight tangent tail 1.15 long onto the axis at
(8, 8.12), dot at 10.87. Counter 2 → 1.5, and in exchange the mouth opens 1.45 → 1.71. The
mark's **narrowest** white barely moves (1.45 → 1.49); it relocates from the mouth to the
counter. Filled at C18's medium cut 1.75, leaving 1.24 — legal only because C19 governs the
inside of a character; under MIN_GAP only a 1.5 cut fitted, which would have been a
deviation.

**`help-2` cannot take it: its 16 has no legal drawing at all (measured 2026-09-18).** The
coil is 240° of bowl into a reverse arc of the *same radius* turning 60°, which is what makes
it a coil rather than a hook. At 16:

| | |
|---|---|
| full coil, r1.5 | mouth closes to **0.97** — under C19's 1.0 |
| full coil, r1.25 | mouth **0.56**; no legal drawing at this radius at all |
| truncated curls | legal, but a 30° curl of r1.5 bows **0.051 units** off a straight tail — a twentieth of a pixel at 16 |
| truncated curls, centred | **zero legal drawings** |

The last row is the one that decides it, and it is the 0.57 trap again in a new place. Only
the *full* 60° curl is self-centring, because only then does the terminal land directly below
the bowl centre. A truncated curl has to move the bowl left to keep the terminal on the axis:
the best of them (r1.5, 210° bowl, 30° curl) passes `npm run check` clean and sits with its
mark at x 6.9, margins **2.9 against 5.1**. Lint centres the whole ink box — the ring on a
container icon — so it cannot see a mark hanging 1.1 off centre.

So `help-2`'s shared 16 is no longer an accident of an unexamined claim. At 16 a coil closes
its own mouth, and what survives of it is invisible.

---

## 5. Tooling built (commit `9bf26d7`)

`anatomy()` in `tools/geometry.mjs` — one shared measure, so lint, build and the lab stop
re-deriving it and getting it wrong differently. It splits a stroked drawing into
silhouette and mark and returns:

- **`ratio`** — mark ink box ÷ container ink diameter.
- **`gap`** — a glyph's dot-to-body void, and that ÷ the dot's own size.

It also now owns `isDot`, which lint had duplicated.

Surfaced in three places: `dist/metrics.json` and `lab/manifest.json`; the Library's
metrics panel (two new rows per master); and **live on the Construction board**, computed
from the draft, because a draft has no metrics file yet and that is exactly when the
number is needed.

**Real-pixel strip on the board** — each master rasterised at its own size, one unit to
one pixel, magnified 6× with smoothing off. The stats block keeps its fixed shape: 2×2
plus **two** one-line rows, both present in idle and hover, so nothing moves when Inspect
toggles.

Two incidental fixes required to get there:
- **`tools/serve.mjs` replaces `python3 -m http.server`.** http.server sends no
  `Cache-Control`, so browsers pinned `tools/*.mjs` across edits and **the board could
  silently run stale tool code** — not a new problem, and not only today's.
- The lab's two module imports are now dynamic with a cache-buster, because some preview
  hosts pin a static import by URL for the whole session regardless of headers.

---

## 6. Open decisions — the actual agenda

### 6.1 The mark/container ratio drift (§3.3)

**Question:** is the 13% shrink from 24 to 16 intended? It affects every container icon.

Recommendation: no, hold the ratio across masters. Counter-argument: the 16 master exists
partly to be drawn differently, and a fixed ratio may fight legibility at 16. Needs a
sheet with the pixel view live, not arithmetic.

### 6.2 Stroke weight at the small masters (§3.1) — **closed 2026-09-18, reopened and amended 2026-09-20**

**Hold C7: 1.5 at every master.** Written into `docs/07-character.md` as C7 with its evidence
(the 16×16 ink comparison, the fork, the Fluent stroke table, the half-tone control), so §3.1
above is a *recorded consequence*, not an open defect. Nothing to do. *(This was the ruling as of
2026-09-18; see below for what changed.)*

**Superseded 2026-09-20.** C7 was reopened on the test it set for itself — a reference that draws
a separate 16 master and still goes lighter — and the Cursor set meets it (16 grid at 1.25, 24 at
1.5). The 16 master now draws at **1.25**; 24 and 20 stay at 1.5 (`docs/07-character.md` C7,
`plans/stroke-16.md`). §3.1's ink comparison above is unchanged as a record of the *old* 16
master; it is not a description of the current drawing.

Not closed by this, and still open in §9: Fluent's filled weight (+0.5 against our +1.0 at 24)
and its "the filled version may be slightly smaller" against C10/C12.

### 6.3 `MIN_GAP` 1.5 in general

**Question:** Fluent's separation is **1px** at sizes 12–32, ours is 1.5 everywhere. C19
carved out glyphs only. Does the general floor want revisiting?

Recommendation: leave it for now. The scan (§3.5) shows it binds almost nothing, so the
cost is low and the risk of loosening it is real (`more-*` dots, menu runs are where it
earns its keep).

### 6.4 The unenforced §6 corollaries — **enclosed shapes DONE 2026-09-18**

`docs/01-foundations.md:243` states *"no enclosed shape smaller than 1.5 units across"*
and *"no more than 3 parallel strokes in one run"*.

**The first is now in code.** `selfGap` in `tools/geometry.mjs`, wired into lint, ten
tests in `tools/geometry.test.mjs`. The thing that made it hard is that neither distance
nor arc length separates a legal bend from an illegal counter — a C10 corner at the
minimum radius brings its own tangent points 1.06 apart, and a 90° corner can span as much
path as a closing bowl. **Turn** separates them: a bend turns 45°, 90°, at most 135° and
leaves, so a pair of points is judged only once the path between them has turned past the
gate. Turn accumulates signed (a bowl into a reverse tuck unwinds), and a closed path is
not judged against itself at all: going the short way round its widest pair is its own
diameter, which is a radius, not a counter.

**The gate is 170°, not 180° — corrected 2026-09-18.** At 180 the measure missed the very
shape it was built for. A half-circle bowl ends on a 45° diagonal, where the 2 dp grid rule
rounds 1.0607 to 1.06 and the sweep comes out at **175.96°**; `help-3`'s proposed 16 — an
r1.5 bowl plus a straight tangent tail — therefore turned *under* the gate, and its counter,
its mouth and its filled knockout were all unjudged while lint printed it clean. Two fixes
went in together: the polyline's chord directions lag the true tangents by half a segment
at each end, which was costing every measured sweep a few degrees (`help` 16 read 241°,
not 245°), and the gate dropped to 170 — 35° of margin over the widest legal bend, 6° under
the tightest half-bowl. Judging a pair 170° apart reads their chord rather than the full
diameter, so a counter can read ~0.01 tight, inside lint's existing tolerance. The 576 stay
clean, and an over-cut `help-3` knockout fires as it should.

Across all 576 drawings it reported four, all question marks at the 16 master and nothing
else — which settled **C19's extension to the glyph mouth** (doc 07). `help-4`'s first 16
measured 0.30 there and had shipped lint-clean that morning.

**The second corollary — no more than 3 parallel strokes in one run — is still not in code.**
Nothing approved breaks it (`menu` is the widest run at three), so it binds nothing today.

Also still open: `docs/01-foundations.md:245` says *"when a detail cannot fit at a **2-unit**
gap"* three lines under a rule that says 1.5 — stale wording from the stroke-2 era.

### 6.5 Holes in what the gap rule actually covers

- **Counters inside a single path are unchecked** — one path, so the pair loop never sees
  them.
- **Shape-filled files are unchecked entirely** — their geometry is in `areas`, not `ds`,
  so the loop has nothing to iterate. Every filled circle icon gets no gap check at all.
  **Dated note, 2026-09-20 — one part of this is covered, and now measured properly.** Lint §5c
  checks what a knockout leaves standing between two parts of itself (the mouth of a filled `?`,
  `info-3`'s flag-to-bar, the panels a globe's cut leaves as islands), against the same floor the
  outline's mouth gets. It first inferred that from the outline twin — cut width = twice the
  furthest the knockout strays from the outline's centreline — which is only true while the cut is
  centred on the outline; when the 16 outlines moved 0.125 under cut-outs that were left as
  approved (C7), an unchanged `help-4-filled` read 0.91 and warned. `materialGap`
  (`tools/geometry.mjs`) now measures the filled drawing alone, and lint prints the reading.
  The glyph floor for these strips is C19's, extended to the filled twin on 2026-09-20 (doc 07).
  Measured at 16: `help-4-filled` leaves **1.13**, `help` / `help-2` / `help-3` 1.23, `info-3` 1.25
  (all against C19's 1); `globe-2` 1.97 and `globe` 2.82 (against 1.5). For the `help` family at 24
  and 20, where nothing moved, old and new agree to 0.01–0.08; `info-3` and the globes had no
  reading at all before. **Still uncovered:** the material between two *different* holes (a filled
  glyph's terminal to its dot — 0.92 in `help-4-filled` at 16, measured 2026-09-20), a hole to the
  shape's outer edge, a wedge of material tapering by more than 20° (read as the inside of a bend,
  the same blind side as `selfGap`'s 170° gate), and shape-filled files that also carry strokes.
- **Dated note, 2026-09-28 — the first two holes are closed, as warnings.** Lint §5f (`facingGap` in
  `tools/geometry.mjs`, `plans/facing-gap.md`) measures air between two ink edges that face each other
  square-on (within 3°), wherever §5 and §5b cannot: inside a closed stroked path (and between subpaths of
  one `d`), and every gap in a shape-filled file — a cut's own width, a notch in the outer edge, a band
  between two filled parts, a shape to a line. Square-on at both ends is what keeps a bend's inside, a
  ring's hole and a rounded end from reading as gaps. First run over 2,586 drawings: 23 warnings on 21,
  every one re-measured by a fresh reviewer; `paintbrush`'s collar (1.22 at 16), `external-link`'s notch
  (1.28, a rounding slip) and `puzzle-4-filled`'s fillet sliver (0.84) were redrawn the same day.
  **Still uncovered:** a wedge of air opening wider than ~6° (C23's triangular counters stay the drawer's),
  two sharp corners pointing at each other, air under 0.02, and §5c's material check on filled files that
  also carry strokes (one reading in 354, `cash-filled` 3.92).
- Touching paths are skipped (`min > 0.1`), which is why C18's flag-to-bar exception was
  invisible.

---

## 7. Ranked build list, with status

| # | item | status |
|---|---|---|
| 1 | Ratio metrics | **done** (`9bf26d7`) |
| 2 | Real pixels in the review loop | **done** (`9bf26d7`) |
| 3 | A counter minimum, actually checked | **done** (`5ed8f2b`) — `selfGap`, see §6.4 |
| 4 | Void/mass ratio | **done** (`9bf26d7`) |
| 5 | The blur test (Fluent's) | **open** — cheap, additive |
| 6 | Primitive-drift linter | **open** — on CLAUDE.md's list already; this session used bowl radii 2.25 / 2.5 / 2.75 / 3 / 3.5 with nothing checking they related to anything |

---

## 8. What not to chase (so it is not re-litigated)

- **Central's lighter weight** — §6.2. Fluent agrees with us.
- **Centre-line crispness** — real (§3.2) but unfixable for `plus`/`minus`/arrows without
  breaking C14's "symmetric marks stay on the box centre". Fluent's own advice is to
  avoid it in *new* metaphors, not to retrofit. Note a **2.0 stroke centred on an even
  canvas is perfectly crisp** (two solid pixels), which is why Fluent's 2px rule says
  whole numbers.
- **More optical-shift machinery** — C14/C15 and the shift sheet are elaborate and were
  not the problem. `help`'s off-axis dot looked like a shift question; the fix was to
  change the tail so the terminal landed on the axis. Construction, not placement.
- **More candidates per icon** — five were put on the board twice; three were picked from
  both times, and the winners came from measuring a reference, not from breadth.

---

## 9. Reference material captured (gitignored)

- `research/references/central/help.json` — Central's three question marks at stroke 1.5.
  `questionmark-circle`: circle r 9.25 and dot centre (12, 16.5) **identical to ours**,
  but the mark is **5.25 ink wide against our 7.0** and its dot is a *filled* circle
  r 1 (ink ⌀2.0) where ours is ⌀2.5. Dot gap exactly 1.5.
  `questionmark-circle-2`: the squared construction — flat top, tight corners, straight
  diagonal, short vertical stem, terminal on the axis at (12, 13.25), dot at (12, 16),
  **gap 1.0**. Lightest icon in the comparison at 41.4 px of ink. **A candidate for
  `help-4`; the user flagged this shape as one they liked.**
- `research/references/fluent-guidelines.md` — read off the Figma desktop bridge from
  `rdI0uXVzp89fOZpYcQV6mo`, page "Guidelines". Stroke table, the per-stroke-width grid
  rule, centre lines, cut-outs, filled rules, the balance and blur tests, off-states,
  and the modifier size chart.

### Fluent items worth inheriting, each with a natural trigger

| item | trigger |
|---|---|
| **Modifier rules**, quantified — bottom-right, may sit in the padding but inset max 1px, filled regardless of the parent's style; chart: 16 → cut 11 / modifier 9; 20 → 11/9; 24 → 13/11 | before the first composite (`calendar-plus`, `file-check`) |
| **Grid depends on stroke width** — 1px → `.5`, 1.5px → `.25/.75`, 2px → **whole numbers**. We encode only `.25/.75` and lint applies it to everything, including our 2.0 filled cuts where whole numbers are correct. Our 1.75 medium cut is not on their table at all | next time filled weights are touched |
| **Off-state template** — slash top-left to bottom-right, full length, stopping at the margins; slash cut-outs follow the stroke size rather than the 1px default | before `eye-off` / `bell-off` |
| **Concentric radius** — outer = inner + distance between shapes (worked example 1.5 + 2.5 = 4) | first stacked shapes |

### Confirmed by Fluent, no change needed

Centred strokes; rounded caps and joins everywhere; shapes that can close get filled with
inner shapes knocked out; *"the stroke shouldn't change thickness when filling in
shapes"*; even distribution over even margins; the circle balance test (our C15 optical
sheet already does it).

### Where Fluent contradicts us

- Separation **1px**, not one stroke width (§6.3).
- Filled thickens by **+0.5**; our `FILLED_WEIGHT` adds +1.0 at 24 (20 and 16 already
  match at +0.5).
- *"The filled version may be slightly smaller"* to stop it feeling heavy. C10/C12 require
  the filled ink box to equal the outline's to 2 dp, no tolerance.

---

## 10. Process lessons

1. **Measure a reference's ratios before drawing, not after.** The second `help` pass
   worked because Polaris' bowl⌀/circle⌀ = 0.393 was computed first.
2. **Look at real pixels at the master's own size.** Every fault caught by eye this
   session was invisible in the vector view and obvious in a magnified raster.
3. **A clean lint is not a correct drawing.** Both bad passes were lint clean.
4. **Do not trust a hand-rolled measure.** The bowl-mouth measure was written twice and
   wrong twice; both times the numbers looked plausible.
5. **Check the tool before blaming the code.** Roughly half of step 2's time went to a
   stale-module cache, not to the feature.

---

## 11. Immediate next step

**#22 `alert-circle`** — the same body-plus-detached-dot glyph as `info` and `help`, so
it inherits C19 directly, and it is the first of four (`alert-circle` #22,
`alert-triangle` #46, `alert-octagon` #140, `alert-square` #284).

Both new measures are live on the board before anything is drawn. The closest parked item
is §6.1, the ratio drift, which the Library now shows for any family.
