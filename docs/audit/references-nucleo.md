# Nucleo — what a professional team holds and lets go when it draws one concept at another grid

Wave 2, card 2.3 of `plans/set-and-rules-audit.md`. Measured 2026-10-04 against the pinned tree
`5933041` and Nucleo's local library (`data.sqlite3` plus 64,933 SVG files). Nothing in the set,
the rules, lint, the sheet or the board was touched.

**The one question this card answers.** Nucleo is the only reference where one team draws sibling
families at several grids (Fluent draws seven sizes, but of one family) — Core 24/32/48, UI 12/18,
Sharp 24, Pixel 24, Micro Bold 20. That makes it the control group for our three masters. When that
team draws the same concept at a second grid, what does it keep, what does it let go, and what does
the same measurement say about 24 · 20 · 16?

**Licence.** Nucleo's artwork. All derived data sits under `research/references/nucleo/card-2.3/`
(gitignored). This document holds measurements and concept names only — no path, no coordinates.

**What the eye sees, in one breath.** Put the same Nucleo icon at two sizes side by side. The *line*
is the same thickness in both. The bigger one has more room between its parts, (in Core) rounder
corners and often a little more detail; the smaller one fills more of its box and has lost a dot or
a line. Put ours side by side and the room between parts is the same on all three, the corners
shrink with the canvas (2.5, 2, 1.5), and it is the *line* that thins at 16. Same size of change,
opposite thing held still.

---

## The short answer

1. **They hold the stroke in pixels in every family (UI holds its container radius too) and let the
   rest follow the grid.** Core's line is 2.0 px at 24, 32 and 48 (100% of 9,567 drawings); UI's is
   1.5 px at 12 and 18 (99–100% of 4,764). Redraw the same concept at the next grid and the ink
   grows with the canvas (×1.36 for ×1.33; ×1.45 for ×1.5), the **air grows with it** (×1.25 for
   ×1.33; ×1.50 for ×1.5; ×1.49 for UI's ×1.5), and the corner radius grows **faster** than the
   canvas in Core (2 → 3 → 5 px) and not at all in UI (2 → 2). The stroke share of the canvas
   therefore falls 8.3 → 6.3 → 4.2% in Core and rises 8.3 → 12.5% in UI.
2. **We hold the air and nearly the stroke, and let the rest follow.** Between our masters the same
   concept keeps its tightest air at ×1.00 – 1.02 (1.5 px at all three), its stroke at ×1.0 then
   ×1.2, while ink and radius follow the canvas and the margin is set per master (2 · 2 · 1). It is
   the opposite choice of currency from Nucleo's, and it was never stated as one.
3. **Radius does not track stroke.** The only cell where radius equals stroke is Core 24 (2 = 2).
   Core 32 is 1.5×, Core 48 2.5×, UI 18 and 12 both 1.33×, Micro Bold 1.5×. What each grid has is
   *one* radius, used by 66 – 86% of its rounded container corners. Ours: 2.5 · 2 · 1.5 — 1.67×,
   1.33×, 1.2× — on 59 – 62% (card 1.2's count).
4. **The practical air floor is a share of the grid, not a multiple of the stroke** (Core to within
   half a point, UI more loosely). The 10th percentile of the tightest clear air per drawing is
   **1.0 · 1.2 · 2.0 px** in Core (4.2 · 3.8 · 4.2% of the canvas — the same share at three grids —
   and 0.50 · 0.60 · 1.00 of the stroke) and 1.0 · 0.8 px in UI. Ours is a hard 1.5 px at every
   master (6.2 · 7.5 · 9.4% of the canvas, 1.0 · 1.0 · 1.2 strokes).
5. **Detail follows the grid, and they redraw for it far more often than we do.** The bigger grid
   carries more parts in 17 – 41% of concepts (UI 12 → 18: 17%; Core 24 → 48: 41%) and fewer in
   3 – 5%; between our 24 and 16, 6.2% shed and none gain. On the ink itself, a bigger Core grid
   carries more than 5% extra ink in 17% (24 → 32) and 27% (32 → 48) of concepts.
6. **The 57.5% "redrawn" is a property of the test, not a redraw rate.** The repo's verdict (wave 0)
   calls **42.5%** of Core 24 → 32 "redrawn" with no change of family or style, 55.4% of Core 32 → 48
   and 20.8% of UI 18 → 12. Across Core 24 → UI 18 — the same ×1.33 step as Core 24 → 32 — it says
   57.5%, so changing family and style adds about 15 points to the size step. The line it draws is
   one stroke, and a constant stroke is a smaller part of a bigger canvas (8.3% of Core 24, 4.2% of
   Core 48, 12.5% of UI 12), so the share climbs with the grid. Measured on the ink instead,
   **57 – 80% of size-only pairs are unchanged to within 2% of their ink, and a third to a half of the
   ink, pooled over pairs, is simply moved by a quarter to one stroke.** The real redraws are detail:
   added on the bigger grid, shed on the smaller.
7. **Our 24 → 16 is the same size of change as their UI 18 → 12.** Unchanged within 2% of ink:
   ours 82%, theirs 80%; changed by more than 10%: ours 11%, theirs 10%. Our 24 → 20 and 20 → 16 are
   far smaller (94% and 96% unchanged). Whether that is discipline or too little redrawing is the
   eye's call (§7).
8. **Where this does not transfer:** their stroke policy (it is our fixed input), their margins
   (they spend the canvas edge; we publish bearings), Core's square caps and mitred corners (we
   draw no sharp icons), and the cross-family Core ↔ UI pair as a size test (it changes style too).
   Recorded in §9.

---

## Sample, and why this one

| | |
|---|---|
| Source | Nucleo's local library: `data.sqlite3` + 64,933 `.svg` (wave 0 extractor `tools/audit/refs/nucleo.mjs`, unchanged) |
| Families | **64,019 drawings** in the five families (Core 27,880 · UI 23,714 · Sharp 5,030 · Pixel 4,809 · Micro Bold 2,586); the other 914 are free sets outside them |
| Distinct | **44,396** once repeats are set aside: the same drawing is filed in several sets (15,719 family × grid × style × name keys occur more than once; **99.2%** of those are the same drawing) |
| Style measured | the stroked style: Nucleo's `outline` (Micro Bold files its bold-stroked drawings under `glyph`; I read them as stroked). Their filled and two-tone styles are not measured here. |
| Concepts | Core **3,184** at all three grids · UI **1,251** at both · **1,593** shared by Core 24 and UI 18 |
| Our side | the whole pinned set, outline files only: **485 concepts × 3 masters = 1,455 drawings**, run through the same scripts |

**Why Nucleo is a control group, and where it is not.**

| Our constraint | Nucleo | Matches? |
|---|---|---|
| no weight axis | the paid families have none: one stroke per family. `stroke_max` is set on 1,429 icons (2.2%), in three sets (Arcade 377; UI Essential 512 and Core Essential 540, the last two inside the family counts used here) | yes |
| three hand-drawn masters, 24/20/16 | eight grids in five families, drawn by one team; steps ×1.33 · ×1.5 · ×2.0 (Core), ×1.5 (UI) against our ×1.2 · ×1.25 · ×1.5 | yes — the closest there is |
| two styles drawn as a pair | stroked and filled at every grid | yes (the filled style is not measured here) |
| no control over render size | each grid is sold for 1:1 use; the SVG scales | partly |
| outlined fills shipped from a private stroked source | they ship the strokes | no — matters only for stroke-versus-area questions; none is asked here |
| we publish optical metrics | they do not | no — matters for margin questions: for us the margin is a contract |

## Instruments

| Measure | How |
|---|---|
| stroke, canvas, ink box, margins | `extractRecord` (`nucleo.mjs`): the modal stroke of a drawing; ink = path bbox grown by half the stroke (exact for round caps and joins, **a lower bound for the square caps and mitres Core 24 uses in 58.5% and 97.5% of drawings** — Core's margins are therefore upper bounds: by a fraction of a pixel at a diagonal end, more at a sharp mitre) |
| keyline | the commonest outer diameter (2r + stroke) among full circles that span ≥60% of the canvas — a probe, with *n* shown |
| corner radius | `tools/audit/radii.mjs` `cornersOf`, then the repo's own role test (container = big, enclosed, convex; bend = corner in an open line; detail = the rest). *Container corners* include sharp ones (radius 0); *rounded* means radius > 0 |
| air | for every pair of distinct stroked sub-paths that do not touch or cross, the shortest distance between centrelines minus the stroke; per drawing, the smallest value that is **at least 0.5 px** — "the tightest air you can see" |
| detail | parts (drawn elements), sub-paths and path segments per drawing |
| *part by part* | elements matched first by place (same position in unit canvas, within 1.5 strokes), then by shape (best uniform fit) — §4.4 |
| *one concept at two grids* | **ink-level comparison**: both drawings sampled in unit canvas — along the centreline of every stroked part, and along the outline of every solid part (a dot, a small filled shape); our outline files have no solid parts; each point is *held* (≤0.25 stroke from the other drawing's ink), *nudged* (0.25 – 1 stroke) or *gone* (>1 stroke). One stroke is the smaller grid's own. Independent of how a drawing is cut into elements. |
| the repo's verdict | `compareRecords` in `nucleo.mjs` (scaled copy · same shape own weight · re-tuned · redrawn), run on within-family chains |

**Declared limits.**

- I compared drawings **part by part** (matching elements by place, then by shape; §4.4). A part's
  existence depends on how the icon is cut into elements (a `polyline` against a `path`): across
  families the part view and the ink view agree (54.0% and 54.7% of pairs differ), within UI 18 → 12
  the part view reports 30.0% against 19.7%. No headline rests on the part view; the ink-level
  comparison, which does not depend on the cut, carries the claims.
- Air is measured between **distinct** sub-paths. A counter inside one path (the mouth of a `C`) is
  not read. Pairs under 0.5 px are treated as joins.
- The keyline probe has few circles at Core 48 (*n* = 3) and Sharp (13): shown, not leaned on.
- The first drawing per name stands for its repeats (99.2% identical).
- Free sets, the two-tone and filled styles, `corner_custom` (917 icons) and `stroke_max` are not
  measured.

---

## 1. Stroke, keyline and margin

| Family · grid | Drawings | Stroke px (at modal) | % of canvas | Circle keyline ⌀ (n) | Stroke ÷ keyline | Typical ink long side | Modal min margin | Touch the edge (≤0.5) | Outer edge on whole px |
|---|---|---|---|---|---|---|---|---|---|
| Core 24 | 3,185 | **2.0** (100%) | 8.33% | 22 (32) | 9.1% | 22 · 91.7% | 1 (38%) | 41% | 68% |
| Core 32 | 3,187 | **2.0** (100%) | 6.25% | 30 (21) | 6.7% | 30 · 93.8% | 1 (44%) | 28% | 73% |
| Core 48 | 3,195 | **2.0** (100%) | 4.17% | 44 (3) | 4.5% | 44 · 91.7% | 2 (44%) | 0.3% | 76% |
| UI 18 | 3,507 | **1.5** (100%) | 8.33% | 16 (126) | 9.4% | 16 · 88.9% | 1 (37%) | 31% | 42% |
| UI 12 | 1,257 | **1.5** (99%) | 12.5% | 12 (21) | 12.5% | 12 · 100% | 0 (66%) | **97%** | 34% |
| Micro Bold 20 | 1,828 | 2.0 (100%) | 10.0% | 16 (58) | 12.5% | 16 · 80.0% | 2 (72%) | 0.5% | 75% |
| Sharp 24 | 3,562 | 2.0 (99%) | 8.33% | 18 (13) | 11.1% | 22 · 91.7% | 1 (51%) | 20% | 73% |
| Pixel 24 | 3,332 | 2.0 (100%) | 8.33% | — | — | 22 · 91.7% | 1 (52%) | 20% | 99% |
| **Ours 24** | 485 | 1.5 (100%) | 6.25% | 20 | 7.5% | 18 · 75.0% | 2 (42%) | 0% | 70% |
| **Ours 20** | 485 | 1.5 (100%) | 7.50% | 16 | 9.4% | 14 · 70.0% | 2 (46%) | 0% | 70% |
| **Ours 16** | 485 | 1.25 (100%) | 7.81% | 14 | 8.9% | 12 · 75.0% | 1 (46%) | 0% | 76% |

(Our keylines are the rings' outer ink edge, 2r + stroke = 18.5 + 1.5, 14.5 + 1.5, 12.75 + 1.25.)

**Live area** — the canvas minus twice the modal margin — is 22 · 30 · 44 px in Core (92 · 94 ·
92%), 16 and 12 in UI (89 · 100%), 16 in Micro Bold (80%), 22 in Sharp and Pixel (92%); in Core, UI
and Micro Bold it equals the keyline probe. Ours is 20 · 16 · 14 (83 · 80 · 88%), set by a margin of
2 · 2 · 1 that is absolute at each master.

What the eye sees. A Nucleo icon fills the box: 92 – 94% of it in Core at every grid, 89% then 100%
in UI, and at UI 12 nearly every drawing (97%) touches the canvas edge. Ours stands in from the edge
at 70 – 75% for a typical drawing and 80 – 87.5% for the ring. Nucleo agrees with Fluent here
(`references-fluent.md` T4) at the smaller grids: **the margin is spent, not protected** (97% of UI
12 and 41% of Core 24 touch the canvas edge). At Core 48 (0.3%) and Micro Bold (0.5%) nearly none
do, though those icons still fill 92% and 80% of the box. That is a policy difference, not a
measurement gap.

What the numbers say about the stroke. Within a family the stroke is **a constant in pixels** — two
values (2.0 and 1.5) cover all eight grids. Compared as a share of the keyline, the range across
grids is Core 4.5 – 9.1% (4.6 points), UI 9.4 – 12.5% (3.1 points). **Ours is 7.5 – 9.4% (1.9
points), the narrowest of the three** — the result of drawing a smaller ring and a lighter stroke
together, not of holding either constant.

On the grid they draw to: the outer edge lands on whole pixels in 68 – 76% of Core drawings and 70 –
76% of ours. UI lands whole in only 34 – 42%: its quarter-pixel centrelines put the *outer* edge on
whole pixels at 18 and on half pixels at 12 (`square-warning`: 2.0 and 16.0, then 0.5 and 11.5).

---

## 2. Corner radius — does it track the stroke?

Container-role corners, rounded ones (radius > 0), centreline radius:

| Family · grid | Corners | Modal radius | Share on it | Radii to cover 90% | ÷ stroke | ÷ canvas | Sharp share of container corners | Open-line bends that are sharp |
|---|---|---|---|---|---|---|---|---|
| Core 24 | 2,174 | **2.0** | 86.2% | 2 | **1.00** | 8.3% | 40.7% | 71% |
| Core 32 | 2,395 | **3.0** | 85.6% | 3 | 1.50 | 9.4% | 41.2% | 69% |
| Core 48 | 2,455 | **5.0** | 74.6% | 4 | 2.50 | 10.4% | 43.0% | 66% |
| UI 18 | 3,900 | **2.0** | 75.5% | 2 | 1.33 | 11.1% | 6.2% | 48% |
| UI 12 | 1,496 | **2.0** | 69.1% | 4 | 1.33 | 16.7% | 5.6% | 65% |
| Micro Bold 20 | 1,583 | 3.0 | 66.0% | 4 | 1.50 | 15.0% | 7.4% | 55% |
| Sharp 24 | 26 | — | — | — | — | — | **99.4%** | 96% |
| Pixel 24 | 0 | — | — | — | — | — | 100% | 100% |
| **Ours 24** | 617 | 2.5 | 61.8% | 3 | 1.67 | 10.4% | 6.7% | 10% |
| **Ours 20** | 581 | 2.0 | 61.4% | 3 | 1.33 | 10.0% | 7.0% | 10% |
| **Ours 16** | 563 | 1.5 | 58.6% | 3 | 1.20 | 9.4% | 6.0% | 9% |

(Our share on the modal value is card 1.2's count of the same corners (`findings-corners.md` §1.1, radii snapped to the
nearest sixteenth within 0.025); my own two-decimal count gives 61.1 · 61.1 · 58.3%. Verified from
source on one concept across all five grids, `square-warning`: Core 24 `rx = 2`, Core 32 `rx = 3`,
Core 48 a corner of 5, UI 18 and UI 12 both a corner of 2.)

**No, it does not.** Radius equals stroke in one cell of six (Core 24); across the others it is
1.33×, 1.5× and 2.5×. It tracks the **grid** in Core (2 → 3 → 5 for 24 → 32 → 48: steps of ×1.5,
×1.67 against grid steps of ×1.33, ×1.5) and **holds in pixels in UI** (2 at both 18 and 12). As a
share of the canvas it rises as the canvas grows in Core (8.3 → 10.4%) and as it shrinks in UI (11.1
→ 16.7%): no constant share either. The "radius = stroke" convention the brief for this card cites
for IBM, Salesforce and Material is therefore not what this team does at any grid but Core's
smallest. **Ours (1.67× · 1.33× · 1.2×, 10.4 · 10.0 · 9.4% of the canvas) sits inside their span,
and is the flattest of the three in canvas share.**

Three more readings.

- **Each family's grid has one radius.** 86% of Core 24's and Core 32's rounded container corners,
  and 76% of UI 18's, sit on the modal value; two or three radii reach 90%. Ours: 59 – 62% on the
  modal value, three radii to 90%. Card 1.2 measures the same thing against our three tiers (93.8%
  on one of the three); the point here is that a production family is *more* concentrated than we
  are.
- **Core is a mixed-corner family**: 41 – 43% of its container corners are square (radius 0) at every
  grid, and 66 – 71% of its open-line bends are mitres. UI is 6% and ours is 6 – 7%. Corner policy
  is a **family** decision at Nucleo — Sharp (99.4% square) and Pixel (100%) are separate families
  of the same concepts, not options. That is how ours is decided too (O1, no sharp icons).
- **Bends.** UI rounds an open bend by the *join* (round join on a centreline corner, so the centreline
  radius reads 0 in 48 – 65%); we draw an arc of half the weight (C10) in 90%. Different construction,
  same outcome on the screen; not a disagreement.

---

## 3. Air — what is the practical floor, and what does it follow?

Per drawing, the tightest clear air (≥0.5 px) between distinct stroked parts:

| Family · grid | Drawings | px at p5 · p10 · p25 · p50 | Strokes at p10 · p50 | Canvas share at p10 · p50 | Below one stroke |
|---|---|---|---|---|---|
| Core 24 | 2,742 | 0.93 · **1.00** · 1.50 · 2.00 | 0.50 · 1.00 | 4.2% · 8.3% | 39% |
| Core 32 | 2,836 | 1.00 · **1.20** · 1.97 · 2.00 | 0.60 · 1.00 | 3.8% · 6.2% | 27% |
| Core 48 | 2,941 | 1.53 · **2.00** · 2.80 · 3.00 | 1.00 · 1.50 | 4.2% · 6.2% | 8% |
| UI 18 | 5,792 | 0.76 · **1.00** · 1.00 · 1.50 | 0.67 · 1.00 | 5.5% · 8.3% | 48% |
| UI 12 | 943 | 0.75 · **0.81** · 1.00 · 1.00 | 0.54 · 0.67 | 6.7% · 8.3% | 72% |
| Micro Bold 20 | 1,232 | 0.99 · 1.00 · 1.25 · 1.50 | 0.50 · 0.75 | 5.0% · 7.5% | 58% |
| Sharp 24 | 2,997 | 1.00 · 1.24 · 2.00 · 2.00 | 0.65 · 1.00 | 5.2% · 8.3% | 21% |
| Pixel 24 | 3,321 | 0.82 · 0.82 · 0.82 · 0.82 | 0.41 · 0.41 | 3.4% · 3.4% | 96% |
| **Ours 24** | 298 | 1.50 · **1.50** · 1.50 · 1.75 | 1.00 · 1.17 | 6.2% · 7.3% | 4% |
| **Ours 20** | 297 | 1.50 · **1.50** · 1.50 · 1.52 | 1.00 · 1.02 | 7.5% · 7.6% | 4% |
| **Ours 16** | 296 | 1.50 · **1.50** · 1.50 · 1.75 | 1.20 · 1.40 | 9.4% · 10.9% | 4% |

Read the three bold columns together. In **pixels**, Core's floor grows with the grid (1.0 → 1.2 →
2.0); in **strokes** it climbs 0.5 → 0.6 → 1.0 because the stroke stands still; in **canvas share**
it is flat at 3.8 – 4.2%. A floor that is flat in canvas share and not in strokes is a floor that
**follows the grid.** UI does the same, more loosely (1.0 → 0.8 px for 18 → 12; 5.5 → 6.7%).
Ours is the only set where the floor is flat in *pixels* — a literal 1.5 at the 5th, 10th and 25th
percentile alike — so it climbs in canvas share (6.2 → 7.5 → 9.4%) and in strokes (1.0 → 1.0 → 1.2)
as the master shrinks. Only 4% of our drawings go below one stroke; 8 – 72% of the Nucleo families'
do (Pixel: 96%).

**The same concept at two grids** (§4.1 gives the full pairing) says the same thing without a
population in between:

| Same concept | Grid × | Air floor × | Pairs where the air is bigger · equal · smaller at the bigger grid |
|---|---|---|---|
| Core 24 → 32 | 1.33 | **1.25** | 58% · 30% · 12% (n = 2,736) |
| Core 32 → 48 | 1.50 | **1.50** | 86% · 6% · 9% (n = 2,831) |
| Core 24 → 48 | 2.00 | **1.82** | 90% · 4% · 7% (n = 2,738) |
| UI 12 → 18 | 1.50 | **1.49** | 73% · 20% · 7% (n = 905) |
| **Ours 20 → 24** | 1.20 | **1.00** | 43% · 54% · 2% (n = 297) |
| **Ours 16 → 20** | 1.25 | **1.00** | 26% · 49% · 24% (n = 296) |
| **Ours 16 → 24** | 1.50 | **1.02** | 47% · 35% · 18% (n = 296) |

**A spot check on the smallest air a glyph carries** — the dot to its stem in the exclamation,
question and info icons (the C19 "glyph gap"), 8 – 11 concepts per cell:

| | Core 24 | Core 32 | UI 18 | UI 12 | Sharp 24 | Pixel 24 | **Ours 24 · 20 · 16** |
|---|---|---|---|---|---|---|---|
| dot-to-stem air, median px | 1.50 | 2.00 | 1.17 | 0.75 | 2.00 | 0.82 | **1.06 · 1.04 · 1.00** |
| in strokes | 0.75 | 1.00 | 0.78 | 0.50 | 1.00 | 0.41 | **0.71 · 0.69 · 0.80** |

Our C19 glyph floor of 1 unit sits in the band the professionals use (0.5 – 1.0 stroke) at all three
masters. And of the six cells checked, the only one where the number is **0.82 is Pixel** (3,147 of
its 3,321 drawings sit at 0.82 – 0.83 on the air measure above), which looks like pixel-grid
geometry — 2√2 − 2 = 0.83, the gap a 2-px diagonal step leaves — rather than a chosen air [not
checked against the drawings]. `docs/08 §3.4` quotes "Nucleo 0.82" beside Polaris 0.55; if that was
taken from Pixel, it describes a pixel-art family and not the sets it is compared with (K1, §6).

---

## 4. One concept at two grids: what is held, what is let go

### 4.1 Ratios to the grid — the method that reads hold and give directly

For the same concept, ratio of each dimension at the bigger grid to the smaller. **1.0 means held in
pixels; the grid ratio means scaled with the canvas.**

| Same concept | Grid ratio | Stroke | Ink long side | Air floor | Container radius |
|---|---|---|---|---|---|
| Core 24 → 32 | 1.33 | **1.00** | 1.36 | 1.25 | 1.50 (n = 623) |
| Core 32 → 48 | 1.50 | **1.00** | 1.45 | 1.50 | 1.67 (n = 693) |
| Core 24 → 48 | 2.00 | **1.00** | 1.96 | 1.82 | 2.50 (n = 616) |
| UI 12 → 18 | 1.50 | **1.00** | 1.33 | 1.49 | **1.00** (n = 372; equal in 78%) |
| **Ours 20 → 24** | 1.20 | **1.00** | 1.25 | **1.00** | 1.25 (n = 160) |
| **Ours 16 → 20** | 1.25 | 1.20 | 1.14 | **1.00** | 1.33 (n = 153) |
| **Ours 16 → 24** | 1.50 | 1.20 | 1.43 | **1.02** | 1.67 (n = 151) |

Read down the "Stroke" column and across the "Air" column. **Nucleo holds the stroke and scales the
air; we hold the air (and the stroke, but for the step to 16) and let ink and radius follow the
grid.** Ink follows the grid in both. UI's smaller ink ratio (1.33 for 1.5) is its 12-grid drawing
filling the whole box (100% against 89%).

### 4.2 The ink itself — held, nudged, gone

Larger grid → smaller grid, ink sampled in unit canvas, one stroke of the smaller grid as the
tolerance. *Held* ≤0.25 stroke, *nudged* 0.25 – 1, *gone* >1 stroke from any ink in the other drawing.

| Chain | Pairs | Ink held | Nudged | Unchanged (≤2% of ink unmatched) | Minor (2 – 10%) | Changed (>10%) | Bigger grid has >5% ink the smaller lacks | Smaller has >5% the bigger lacks | Held ink, smaller ÷ larger (canvas share) |
|---|---|---|---|---|---|---|---|---|---|
| Core 32 → 24 | 3,184 | 51% | 46% | **75%** | 15% | 10% | 17% | 4% | ×0.958 |
| Core 48 → 32 | 3,186 | 63% | 33% | 63% | 19% | 18% | 27% | 11% | ×1.009 |
| Core 48 → 24 | 3,184 | 47% | 48% | 57% | 22% | 21% | 32% | 9% | ×0.967 |
| UI 18 → 12 | 1,251 | 46% | 52% | **80%** | 10% | 10% | 12% | 6% | ×1.094 |
| *Core 24 → UI 18 (style changes too)* | 1,593 | 43% | 48% | 45% | 17% | 38% | 41% | 38% | ×0.968 |
| **Ours 24 → 20** | 485 | 43% | 56% | 94% | 5% | 1% | 3% | 1% | ×0.930 |
| **Ours 20 → 16** | 485 | 54% | 46% | 96% | 3% | 1% | 2% | 1% | ×1.082 |
| **Ours 24 → 16** | 485 | 69% | 28% | **82%** | 7% | 11% | 13% | 10% | ×1.003 |

What stays. 95 – 98% of the larger grid's ink is within one stroke of the smaller grid's, and **46 –
63% sits within a quarter-stroke**: that is the hold. The rest is nudged by 0.25 – 1 stroke — the
drawing is redrawn on the new grid rather than scaled. (Whether the nudges land the ink on whole and
half pixels is not shown: UI's outer edges are on whole pixels in only 34 – 42% of drawings, §1.)

What goes. Detail. In Core the bigger grid carries ≥5% extra ink in 17% (24 → 32), 27% (32 → 48) and
32% (24 → 48) of concepts, against 4 – 11% the other way. UI 18 → 12 sheds in 12% and adds in 6%.
Unmatched stretches are short: 74 – 92% of the dropped or added runs are under three strokes long —
an interior tick, a dot, a short bar — and 1 – 5% are ten strokes or more.

Our own 24 → 16 sits where UI 18 → 12 does (82% unchanged against 80%; 11% changed against 10%). Our
24 → 20 and 20 → 16 stay close to the 24 in ink (94% and 96% unchanged); they hold the ink within
one stroke of the 24 while drawing it smaller in canvas share (×0.930 for 20, then ×1.082 back up
for 16). That is not a rescale: card 1.4 §3 finds 16 of 970 whole drawings to be the other master
resized at 24 → 20 (17 at 24 → 16 and at 20 → 16), with a median residual of a third of a stroke at
24 → 20. *Within a stroke everywhere* and *a pure rescale* are different claims.

### 4.3 The repo's "redrawn" verdict, and why 57.5% is not a redraw rate

`compareRecords` calls a pair *redrawn* when the worst point, after the best uniform fit, lies more
than one stroke from the other drawing. It is a test of alignment, not of intent. The same test on
chains where only the size changes:

| Chain | Pairs | Redrawn | Re-tuned | Scaled / same shape own weight | Worst gap, median |
|---|---|---|---|---|---|
| Core 24 → UI 18 (size **and** style) | 1,593 | **57.5%** | 40.4% | 2.1% | 1.19 strokes |
| Core 24 → Core 32 (every third concept) | 1,062 | **42.5%** | 54.2% | 3.3% | 0.86 |
| Core 32 → Core 48 (every third concept) | 1,062 | **55.4%** | 41.6% | 3.0% | 1.21 |
| UI 18 → UI 12 (all) | 1,251 | **20.8%** | 71.1% | 8.2% | 0.48 |

The line the verdict draws is one stroke, and a constant stroke is a smaller part of a bigger canvas
(8.3% of Core 24, 6.3% of Core 32, 4.2% of Core 48; 12.5% of UI 12), so the share "redrawn" climbs
with the grid: 20.8% where the line is 8.3 – 12.5% of the canvas (UI 18 → 12), 42.5% at the same ×1.33
step inside Core (8.3 → 6.3%), 55.4% at ×1.5 (6.3 → 4.2%). The cross-family 57.5% is the same ×1.33
step as the 42.5% with a change of family and style on top (square caps and mitres against round caps
and joins, §4.5): those add about 15 points (an approximation, since the 2.0 and 1.5 px strokes differ
too). **The 57.5% must not be read as "the redraw rate between sibling families", nor as the size step
alone.** A method note, not a finding: no repo document states the 57.5%; it was quoted in this
card's brief from wave 0's `compare --all-pairs`. Any later comparison that quotes it should name the
pair and the tolerance.

### 4.4 Part by part, as asked — and why it is not the headline

Both teams cut an icon into elements (lines, circles, polylines, paths). Core 24's elements were
matched to UI 18's, and UI 18's to UI 12's, first **by place** (the same position in unit canvas,
within 1.5 strokes), then **by shape** (the best uniform fit, so a part that moved or was resized can
still be found) for what was left. Every shared concept was run: 1,593 and 1,251. (For UI 18 → 12 the
stroke unit is the mean of the two grids' strokes in unit canvas.)

| | Core 24 → UI 18 | UI 18 → UI 12 |
|---|---|---|
| every part has a counterpart, none off by more than a stroke | 32.0% | 53.8% |
| … and a part is reshaped in place by more than a stroke | 9.5% | 9.8% |
| … and a part moved or was resized (needed the shape fit) | 4.6% | 5.8% |
| every part pure scaling (≤0.1 stroke) | 0% | 0.6% |
| **some part has no counterpart (dropped or added)** | **54.0%** | **30.0%** |
| matched parts | 4,907 | 4,005 |
| of them matched in place (not after a move) | 87.0% | 93.8% |
| a part's centre moves — median · p90, strokes | 0.37 · 1.26 | 0.35 · 0.79 |
| a part's own worst deviation — median · p90, strokes | 0.50 · 1.12 | 0.52 · 1.01 |
| part size as a share of canvas, other ÷ this — p10 · median · p90 | 0.80 · 0.97 · 1.33 | 0.81 · 1.10 · 1.50 |
| parts with no counterpart in the other drawing | 1,888 in A · 1,910 in B | 709 in A · 407 in B |
| … of which open lines · closed shapes · dots | A 60 · 24 · 16% · B 63 · 26 · 11% | A 49 · 35 · 17% · B 65 · 23 · 12% |

What this says that the ink bands do not: **the parts that vanish or appear are mostly open lines
(49 – 65%), then closed shapes (23 – 35%), then dots (11 – 17%)** — a redraw drops or adds strokes
more than it drops dots. And the parts that stay move by a median third of a stroke.

Why it is a second view and not the headline. A part with no counterpart is partly a different cut
(a `polyline` against a `path`); the ink does not care. At the same strictness — any pair with more
than 2% of its ink unmatched — the ink view says **54.7%** of Core ↔ UI pairs and **19.7%** of UI 18
→ 12; the part view says **54.0%** and **30.0%**. Across families the two agree; within UI the part
view reads ten points higher, which I take to be the cutting (a part can be split or joined with no
ink changing). At looser strictness the ink view reads 47.6% and 14.7% over 5%, 37.8% and 10.1% over
10%.

### 4.5 What the redraws look like

Twenty-eight pairs were looked at on overlay sheets (14 Core 24 ↔ UI 18, 7 UI 18 ↔ 12, 7 Core 32 ↔
48), drawn at random within the repo's verdict classes. They illustrate the numbers; they do not
replace them.

- **Between sibling families (Core ↔ UI).** The two scaled copies (`connections`, `border-top`) are
  identical. The re-tuned ones (`notification`, `arrow-trend-down`, `arrows-reduce-x`,
  `square-warning`, `bolt-slash`) keep their construction: the difference is **square caps and
  mitres in Core against round caps and joins in UI** (caps: Core 24 square 58.5% / mixed 39.1%, UI
  18 round 99.9%; joins: Core 24 mitre 97.5%, UI 18 round 99.7%) and a nudge of a fraction of a
  stroke. The redrawn ones (`folder-user`, `people-alert`, `bag-check`, `media-library`,
  `copies-plus`, `arrows-rotate-center`, `binary`) are **a different decision for the concept** — a
  solid figure in the folder against an outline, a filled disc with a tick against a plain tick on
  the bag, a different composition of the same parts — not a different size.
- **Down a grid in one family (UI 18 → 12).** Repeated things lose members (`remote-control-2`: five
  dots become three plus a bar; `scroll-text`: two text lines become one); a flag is simplified
  (`summit-flag`); a small outlined shape goes solid where its counter would close (`compass`'s needle).
  Population check: the count of solid (filled) parts rises at the smaller grid in 11% of UI
  concepts and falls in 9%; in Core 48 → 24, rises in 12% and falls in 4%. A tendency, not a rule.
- **Up a grid (Core 32 → 48).** More is drawn: `sperm` gains a neck, `file-replace` the fold of the
  page, `money-bills` its scalloped edge and two dashes, `flip-flop` becomes a pair. Mean parts per
  concept: 4.52 → 4.87 → 5.55 (24 → 32 → 48).

### 4.6 Detail by grid, for the same concept

| | Mean parts | Concepts with the same parts | Bigger grid has more | Bigger grid has fewer | Mean segments |
|---|---|---|---|---|---|
| Core 24 → 32 | 4.52 → 4.87 | 74.3% | **22.9%** | 2.8% | 16.4 → 18.1 |
| Core 32 → 48 | 4.87 → 5.55 | 65.1% | **30.4%** | 4.5% | 18.1 → 21.3 |
| Core 24 → 48 | 4.52 → 5.55 | 55.2% | **41.0%** | 3.8% | 16.4 → 21.3 |
| UI 12 → 18 | 3.53 → 3.77 | 79.4% | **17.0%** | 3.6% | 12.6 → 13.0 |
| **Ours 16 → 20** | 2.77 → 2.82 | 96.3% | 3.7% | 0 | 10.1 → 10.1 |
| **Ours 20 → 24** | 2.82 → 2.89 | 96.9% | 3.1% | 0 | 10.1 → 10.3 |
| **Ours 16 → 24** | 2.77 → 2.89 | 93.8% | **6.2%** | 0 | 10.1 → 10.3 |

(Parts are drawn elements; Nucleo draws with `circle`, `line`, `polyline` and `path`, we with `<path>`
only, so their count is slightly inflated against ours. Direction and rate are the point.) Same
direction in both: the bigger grid carries more. At the same ×1.5 step their rate is 2.7 times ours
(UI 12 → 18: 17.0%, against our 16 → 24: 6.2%) and at Core 32 → 48 it is 4.9 times.

---

## 5. What is held and what is let go — the list

| Held (constant in pixels) | Scaled with the grid | Let go |
|---|---|---|
| the stroke (2.0 or 1.5 — a family constant) | the ink (×1.33 – 1.96) | the number of parts (21 – 45% of concepts differ; 17 – 41% gain parts on the bigger grid) |
| (UI) the container radius (2) | the air floor (×1.25 – 1.82) | exact position: a third to a half of the ink moves by 0.25 – 1 stroke |
| margin at 1 px across two grids (Core 24, 32) | the container radius in Core (×1.5 – 2.5, faster than the grid) | the margin at the extremes (0 at UI 12, 2 at Core 48) |
| cap and join type within a family | | the share of canvas the ink takes (UI 12 fills it) |

| Ours: held | Ours: scaled | Ours: let go |
|---|---|---|
| the air (1.5 px, ×1.00 – 1.02) | the ink (×1.14 – 1.43) | 3 – 6% of concepts' parts |
| the stroke at 24/20 (1.5), then ×1.2 down at 16 | the container radius (×1.25 – 1.67, a little faster than the grid; card 1.4: 89 of 89 stay on their tier) | the share of canvas (ink 75 → 70 → 75%) |
| | | the margin (2 · 2 · 1, absolute) |

---

## 6. Findings, in the plan's three kinds

Nothing here is an edit. These are inputs to cards 1.4, 1.7, 1.16 and the decision agenda.

### Kind 2 — a statement disagrees with what was measured

**K1. `docs/08-refinement.md:114` — "Polaris runs 0.55, Nucleo 0.82".** The dot-to-stem air in
Nucleo's exclamation / question / info icons is 1.5 px (Core 24), 2.0 (Core 32), 1.17 (UI 18), 0.75
(UI 12), 2.0 (Sharp 24) — and 0.82 only in Pixel, where it looks like pixel-grid geometry. Whichever
sample the 0.82 came from is not recorded. **One-off, load-bearing** (it is one of the cross-checks
that justified C19's 1-unit glyph floor — which survives: the pros' band is 0.5 – 1.0 stroke and
ours is 0.7 – 0.8). [needs checking]

**K2. The plan and `CLAUDE.md` describe `stroke_max` as per-icon weight headroom.**
`plans/set-and-rules-audit.md:212` (the sources table) and `:380` (card 2.3's own line, "Nucleo →
`stroke_max` as weight headroom"), `CLAUDE.md:310` and `README.md:135` ("per-icon `stroke_max`
metadata"). Wave 0 and this card measured otherwise: it is set on 1,429 of 64,933 icons (2.2%), in
three sets — Arcade 377, UI Essential 512, Core Essential 540 — with one value per set and grid
(1.5 at UI 12 and 18, 2 at Core 24 and 32, 4 at Core 48 and Arcade). The card was run on the other
half of its title. Card 1.16 already records the README line (`stale-statements.md:197`).
**One-off**, a stale line in three files (four places).

### Kind 3 — fine by every rule, and nothing covers it

**K3. We hold the air; the team that draws several grids lets it follow the grid.** Our floor is a
literal 1.5 at every master (`tools/masters.mjs:60-64`), which is exactly what the rule says. Nothing
says what the air *should* do between masters, and what we do is the opposite of what Core and UI do
(×1.00 against ×1.25 – 1.50 for the same step). The consequence in our own numbers: the floor is
6.2% of the 24 canvas and **9.4% of the 16**. **Systemic** (every drawing). For card 1.7, which owns
the gap question; this card adds the only measured baseline from a team that draws several grids.

**K4. Our live area is not monotone across masters.** The typical drawing is 75.0% of the canvas at
24, 70.0% at 20 and 75.0% at 16 (ring: 83.3 · 80.0 · 87.5%); held ink is ×0.930 at 20 and ×1.082 back
at 16. Every keyline rule is satisfied — the margin is 2 · 2 · 1 by design (card 1.4 §2) — and nothing
says the sequence should rise, fall or stay. Core is non-monotone too (91.7 · 93.8 · 91.7%), so this
is not a defect by comparison; it is a thing nobody decided. **Systemic.** Eye-only.

**K5. Our detail budget differs by master in 3 – 6% of concepts, theirs in 21 – 45%.** No rule asks
for a number. The plan already records that 30 concepts lose paths from 24 to 16. Whether the 16 and
20 are *too* faithful to the 24 (or the adjacent Nucleo grids too eager) is not decidable from counts.
**Systemic.** For the wall (card 4.1) and F11.

### Kind 1 — a drawing disagrees with a stated rule

**None found by this card.** The container-corner comparison (59 – 62% on the modal radius; 93.8% on
one of three tiers) is card 1.2's. The 4% of our drawings under one stroke of air are, at each master,
the 11 C19 glyph concepts (`alert-circle`, `alert-triangle`, `help`, `info` and their numbered
siblings, floored at 1 unit by C19), plus a few where two sub-paths come nearer than a stroke —
`plug-3` (1.25) and `wallet-2` (1.49) at 24, `trash` at 20 (0.99) and at 16 (0.75) — which are card
1.7's to read.

---

## 7. What only Maruti's eye can settle

Each with the surface to settle it on. None is a measurement question.

1. **Should the air follow the master?** A 16 with 1.0 px of air where the 24 has 1.5 is the Nucleo
   move (×0.67); today it is 1.5. Same concept, three versions, at real 16 in **the Library's At 16
   strip** (outline and filled), then on **the wall** (card 4.1) against a Nucleo UI 12 row.
2. **Should a smaller master fill more of its canvas?** UI 12 fills it all; Core holds 92 – 94%;
   ours falls to 70% at 20. The margin is a published contract for us, so this is a scope question,
   and it is the second place (after Fluent, `references-fluent.md` T4) a reference says "spend it".
3. **Do the 20 and 16 shed enough?** 6.2% of our concepts differ in parts between 24 and 16; UI 18 → 12
   differs in 20.6%. Look at the concepts with the most parts — `gear-3`, `building`, `sliders-2`,
   `trash` — at real 16 in a row of twenty.
4. **Does a smaller solid read better than a smaller outline at the smallest master?** The compass
   needle goes solid at UI 12; we have never turned a small outlined counter solid. A look.

---

## 8. How to reproduce this

Scripts and outputs are kept beside the data at `research/references/nucleo/card-2.3/` (gitignored).
`README.md` there lists the order.

```
node nuc_census.mjs "Nucleo Core" nuc/Nucleo_Core.jsonl --gapEvery 1     # per-drawing summary, one family (12 s)
python3 nuc_load.py && python3 nuc_tabA.py                              # stroke, caps, joins per family and grid
python3 nuc_final_tables.py          # §1: stroke, keyline, margin
python3 nuc_final_tables2.py         # §2 corners, §3 air, §4.6 detail
python3 nuc_tabD.py && python3 nuc_tabE2.py                             # the longer forms of §2 and §3
node nuc_dotgap.mjs && node ours_dotgap.mjs                             # §3 glyph spot check
node our_census.mjs ours/ours.jsonl                                      # our side, same summary
node nuc_ink.mjs "Nucleo UI:18" "Nucleo UI:12" nuc/ink_ui18_ui12.jsonl   # §4.2 (also Core pairs, and --ours 24 20 etc.)
python3 chain_tab.py                                                     # the §4.2 table
node nuc_verdicts.mjs "Nucleo Core:24" "Nucleo Core:32" out.jsonl --every 3   # §4.3
node nuc_pairs.mjs "Nucleo Core:24" "Nucleo UI:18" out.jsonl && python3 nuc_pairs_an.py out.jsonl:label   # §4.4, part by part
```

**Independently re-derived** (a second method, not the same script run twice):

- the stroke, by regex over the `.svg` text — `stroke-width="2"` in 97.8% / 99.9% / 100% of the
  attributes in Core 24 / 32 / 48 (the rest are `0`, the width of a filled dot) and `1.5` in 95.1% /
  96.1% of UI 12 / 18's;
- the modal corner radius per grid, with `svgpathtools` over every third drawing's paths, taking each
  quarter-turn curve between two straight lines and reading its radius from the chord: Core 24
  **2.0** (59% of 1,997 corners), Core 32 **3.0** (54% of 2,262), Core 48 **5.0** (42% of 2,518),
  UI 18 **2.0** (53% of 2,371), UI 12 **2.0** (58% of 774);
- the ink bands, re-implemented with `svgpathtools` and a KD-tree on 24 random pairs (12 of
  UI 18 → 12, 12 of Core 32 → 48): the held, nudged and gone shares differ from the main
  instrument's by a median of 0.9 points (UI) and 0.5 points (Core) and by at most 2.8 and 1.4
  points, except one pair (`follow-obj-right`, 21.6 points) where `svgpathtools` ignores the
  rotation on a `<rect>` that the main extractor applies.

**Not independently checked** — for the fresh reviewer (card 5.1) to re-derive without my scripts:
the dot-to-stem values (8 – 11 concepts per cell), which depend on my dot test (a part whose longest
side plus its stroke is at most 1.7 strokes), and the air floor, which depends on my 0.5 px
visibility threshold. Our-side figures are from this card's own run; where card 1.2, 1.4 or 2.1
measured the same quantity, the reviewer should reconcile rather than pick.

---

## 9. Take / refuse / why

Every item run through the four tests of `plans/set-and-rules-audit.md` § *The transfer test*:
**(1)** it answers a question we already have; **(2)** their constraint matches ours on that
question; **(3)** it is a method, not a value; **(4)** we can check it, or book it eye-only. See the
constraint table at the top for where (2) holds.

**The one method this card takes from Nucleo, and the zero numbers.** *When a concept exists at two
grids, report every dimension as a ratio to the grid ratio over the same concepts (1.0 means held in
pixels, the grid ratio means scaled with the canvas), and compare the ink itself in bands of one
stroke — held, nudged, gone — instead of calling a pair "scaled" or "redrawn".* It gives hold and
give directly, it does not depend on how a drawing is cut into elements, it is stable across chains
(the repo's verdict is not), and it was run on our three masters in the same sitting.

### Take — the method, never the number

**T1. Ratios to the grid, per dimension, same concepts.** (1) F6 "what is held, what gives" — Maruti's
stated top axis — and the open question *is 20 a master or a scale?* (2) matches: several hand-drawn
grids, one team, no weight axis. (3) a method. (4) checkable, and checked: §4.1 and §4.2 are the
result on ours. **Take.** The findings it produces for us are K3 and K4.

**T2. Ink bands (held ≤0.25 stroke · nudged ≤1 · gone) in place of the scaled/re-tuned/redrawn
verdict.** (1) F6; card 1.4. (2) matches. (3) a method that gets round a limit of our own wave-0
tool (§4.3: the same test labels 21 – 55% of size-only pairs "redrawn", in the order of the stroke's
share of the canvas). (4) checked. **Take, and retire the verdict as the headline of any cross-grid
comparison.**

**T3. The air floor as the 10th percentile of the tightest clear air per drawing, per master.** (1) F8,
card 1.7, the gap question Maruti is most suspicious of. (2) matches: stroke-relative and
canvas-relative figures both exist. (3) a method that derives a floor from a set instead of
declaring it. (4) checked: ours reads 1.50 at p5, p10 and p25 — a floor in the literal sense. **Take.**
It does not say what the floor should be.

**T4. Corner radius by role: modal radius, the share of corners on it, and the number of radii that
reach 90%, per master.** (1) F2 and the open container-radius ruling (`docs/09 §4`, pending ruling 2).
(2) matches. (3) a method. (4) checked with `radii.mjs`. **Take.** What it shows for the ruling:
*one radius per master used by 66 – 86% of rounded container corners* is what a production family
looks like; ours is at 59 – 62%. Which radius is the ruling's, and Maruti's.

**T5. The keyline measured from the set, and stroke ÷ keyline as the cross-grid invariant.** (1) F2.
(2) matches. (3) a method: the commonest full-circle outer diameter. (4) checked: ours 7.5 · 9.4 ·
8.9%, the narrowest range of the three families (1.9 points). **Take.**

**T6. Detail as the share of concepts that gain or lose parts between adjacent grids, with direction.**
(1) F11 (restraint, detail budget per master; `docs/09 §4`). (2) matches. (3) a method. (4) checked.
**Take.**

**T7. Use a within-family chain as the control, and treat a cross-family pair as confounded.** (1) F6
(how to read wave 0's 57.5%). (2) matches. (3) a method of measurement design. (4) done. **Take**,
as a note on how any later cross-grid comparison is built.

### Refuse — recorded as *seen and rejected, because X*

**R1. Holding the stroke constant in pixels as a policy.** **Fails test (1):** the stroke system is a
fixed input (C7; `plans/set-and-rules-audit.md` § *Fixed input*) and is not under audit. For the
record: we already hold it at 24 and 20; Nucleo also holds it at the grid where we step down
(UI 12 stays at 1.5, a 12.5% line). *Seen and rejected, because the stroke is settled.*

**R2. Their margin and keyline (92 – 94% of the canvas).** **Fails test (2):** we publish bearings
that customers subtract as negative margins, so our margin is a contract; theirs is not. The same
finding as Fluent's (`references-fluent.md` R1). *Seen and rejected, because our metrics are a
contract and theirs are not.* The scope question is booked eye-only (§7 item 2).

**R3. Core's square caps, mitred corners and square containers (41 – 43%).** **Fails test (1):** O1,
"no sharp icons", is settled. *Seen and rejected, because the question is closed.* The family-level
decision itself (Sharp and Pixel are separate families of the same concepts) agrees with how ours is
made.

**R4. Their numbers: 2.0 / 1.5 stroke; radius 2 / 3 / 5; air 1.0 / 1.2 / 2.0 px; margin 1 / 1 / 2.**
**Fails test (3):** values. The transfer test forbids taking one. *Seen and rejected as numbers*;
they appear here as evidence only.

**R5. The cross-family Core 24 ↔ UI 18 pair as a test of size.** **Fails test (2):** it changes the
caps, the joins, the badge convention and the composition at the same time. *Seen and rejected,
because it confounds size with style.* Used once, as a labelled row.

**R6. The Pixel and Sharp families' policies** (99% of edges on whole pixels; 99% square corners).
**Fails test (1):** no question of ours is answered. *Seen and rejected, because we have no pixel-art
or square-cornered style.*

**R7. The filled, two-tone and free styles; `stroke_max`; `corner_custom`.** **Fails test (1)** for
the first three: no open question needs them, and they were not measured here. **Fails test (2)**
for `stroke_max`: it is a weight axis, on three sets (377 + 512 + 540 icons). `corner_custom` (917
icons) was not looked at. [needs measuring] *Seen and rejected.*

**R8. Their dot-to-stem air as a target (1.5 · 2.0 · 1.17 · 0.75 px).** **Fails test (3).** It
corroborates C19's 1-unit floor (ours 0.7 – 0.8 stroke; theirs 0.5 – 1.0) and that is all it is for.

### Why, in one paragraph

A professional team that draws several grids does not scale a drawing; it **redraws it on the new
grid** — a third to a half of the ink, pooled over pairs, moves by a quarter to one stroke — keeps
the line in pixels in every family (UI holds its container radius too), lets the ink, the air and,
in Core, the corners follow the canvas, then adds detail on the bigger grid and sheds it on the
smaller. Our three masters make the same size of change as their UI 18 → 12 (82% against 80%
unchanged), but with the opposite currency: we hold the air at 1.5 px and let the line step down at
16, they hold the line and let the air follow. Which is better is a look. What this card hands back
is the method to see it — ratios to the grid and ink bands — and the plain fact that what they hold
in pixels is the line (and, in UI, the container radius), while what we hold in pixels is the air.
