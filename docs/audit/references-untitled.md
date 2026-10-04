# Reference: Untitled UI — outline against solid, one size, nothing else changing

Card 2.4 of `plans/set-and-rules-audit.md`. Measured 2026-10-04 against our pinned tree `5933041`
(485 concepts, 1,455 outline/filled pairs). Third-party geometry: everything read here lives under
`research/references/untitled/figma/` (gitignored, internal comparison, never shipped). This file holds
measurements and conclusions only — no path data.

How to reproduce: `node tools/audit/refs/untitled-pairs.mjs --ours --png` (about 40 s; reads the ingested
Untitled UI records and, read-only, `src/icons`). It prints the measurements below (not the sums and shares worked out from them, which are plain arithmetic on its lines) and writes
`research/references/untitled/figma/analysis/report.txt`. Shared geometry: `tools/audit/refs/pairgeom.mjs`.
Our-set half: `tools/audit/refs/untitled-ours.mjs`.

---

## The short answer

**Untitled UI's outline and solid share their outer ink box in 1,087 of 1,170 pairs (92.9%) — not the "26 of 26" the
first sample suggested.** (The ink box is the smallest rectangle around all the ink of a drawing.) The other 83 pairs
break it, by up to 3 units, and 43 of those 83 are one thing: an icon with a small badge (a plus, a check, a lock…)
that the solid draws differently from the outline. The 26 were the commonest concepts — plus, check, folder, user — and
none carries a badge; a random 26 of the 1,170 would all hold in only 14.5% of draws.

**The question that decides our zero tolerance: is Untitled's record a better method, or fewer slanted-ended marks to fail on? Neither.**

- It does not have fewer. 606 of its 1,170 pairs (51.8%) have an outline with at least one stroke ending on a slant.
  Ours: 237 of 485 (48.9%). Central: 886 of 1,926 (46.0%). All three sit within six points of each other.
- It does not have a better method. In 264 of its pairs (22.6%) the solid *is* the line drawing — the same strokes at the
  same weight, turned into filled shapes — and in 36 more (3.1%) it is that drawing plus a little fill, so nothing is redrawn
  and nothing can disagree. And I found no pair in which a stroke changes weight between the two styles, which is exactly the move that makes the box and the leg angle fight in our
  line-heavy marks.
- Where Untitled does redraw, the sides held by a slanted end keep their place in 234 of 258 cases (90.7%). Ours keep it in
  935 of 935.

**So our zero tolerance is achieved, not aspirational** — 1,401 of our 1,455 pairs hold to 0.01 on all four sides, and the
other 54 are the 18 concepts that declare a `grows:` note (0 undeclared). What it costs us is the leg angle: 48 of our 120
chevron pairs move more than half a degree, up to 2.81° (section 8). Untitled cannot tell us whether that price is right,
because it never pays it.

---

## 1. Sample, and why this one

| | |
|---|---|
| Source | Figma page `Untitled UI` (`15713:69155`), sections Line Icons and Solid Icons |
| Read | the whole page: 1,187 concepts, 2,359 drawings, 24×24, every stroke weight 2, round caps, round joins, centred |
| Pairs | 1,170 concepts with exactly one outline and one solid. Set aside: 15 solid-only (the `-alt` family and `help-hexagon`), 1 outline-only (`heart-hand`, whose path carries a NaN the extractor cut), 1 duplicated name (`help-octagon`, two outlines for one solid) |
| Why all of it, not a sample | reading the whole page cost 8 bridge calls; a sample could only add sampling error — and the earlier 26 shows how a small one misleads |

**The instrument was checked before it was used.** The ink box is computed here from the path and the stroke
(centreline box grown by half the weight, exact for round caps and joins), independent of Figma. Against Figma's own render
bounds it agrees on all four sides for 2,359 of 2,359 drawings (worst difference 0.0037). A second, independent
re-derivation (`tools/audit/refs/independent-check.py`: Python, no code shared with the JS tools, Figma's render bounds only) gives the same 1,087 of 1,170, and the same 606
slanted-ended pairs.

**Lengths, normalised** (the plan's rule for crossing systems: a length means nothing across sets until it is also a share of the canvas and a multiple of its own
stroke). Untitled's canvas is 24 and its stroke 2, so divide a length in units by 24 for its share of the canvas and by 2 for its multiple of the stroke. The largest
box break, 3.0, is 12.5% of the canvas and 1.5 strokes; the usual badge shift of 1.0 is 4.2% and 0.5 stroke; the cut of 2.0 is 8.3% and exactly 1 stroke; the container
corners 4.8 (outline) and 4.16 (solid) are 20.0% and 17.3% of the canvas, 2.4 and 2.08 strokes. For us (canvas 24, stroke 1.5) the same 1.0 would be 4.2% and 0.67 stroke.
Every comparison across sets in this file is a rate or an angle, which need no conversion.

**Classes of pair** come from rasterising both drawings at 32 px per unit and comparing the ink: **A identical** (the two
inks overlap to 0.999 or better), **B near** (0.90–0.999), **C redrawn** (below 0.90).

## 2. The box record at scale

| Outer box equal to within | pairs | of 1,170 |
|---|---|---|
| 0.0005 | 990 | 84.6% |
| 0.001 | 1,031 | 88.1% |
| **0.01 (our tolerance)** | **1,087** | **92.9%** |
| 0.05 | 1,096 | 93.7% |
| 0.5 | 1,113 | 95.1% |
| 1.0 | 1,162 | 99.3% |
| worst: 3.0 (`cloud-lightning`), 2.5 (`file-code-02`) | 1,170 | 100% |

Counted by side rather than by pair: 4,541 of 4,680 sides hold (97.0%). By size, the 83 breaks are 49 over 0.9, 23 between
0.1 and 0.9, 11 between 0.01 and 0.1. The 139 failing sides split left 23 · top 27 · **right 49 · bottom 40** — the right and
bottom edges, where a badge usually sits — and the solid reaches further out than the outline on 79 of them (56.8%) and stays
inside on 60.

## 3. Three kinds of pair — and how line-only marks are handled

| Class | pairs | share | box holds |
|---|---|---|---|
| A — solid ink = outline ink | 264 | 22.6% | 264 of 264 |
| B — near-identical | 36 | 3.1% | 36 of 36 |
| C — redrawn | 870 | 74.4% | 787 of 870 (90.5%) |

**Silhouette congruence** — both drawings with gaps up to 3.2 closed and enclosed areas filled, then the overlap of the two
outlines of the shapes (at 16 px per unit): over 0.999 for **838 of 1,170 (71.6%)** — all 264 class A, 34 of 36 class B, 540 of
870 class C; 0.99–0.999 for 38; 0.95–0.99 for 199 (58 of the 62 squarer-corner icons of section 7 sit in this band, 2 in 0.90–0.95
and 2 at or below 0.90; the other 141 differ by small shapes); 0.90–0.95 for 34; **0.90 or below for 61** (38 of those still hold the box). The low end is mostly open outlines —
a person bust, an open arc, a cup — whose line drawing encloses nothing, so there is no silhouette to match; for those the ink
box is the stricter outer-edge test.

**Line-only marks** (arrows, chevrons, plus, minus, x, check, menus, dots, brackets, links, the magnifier, the globe's
lines…) are class A: the solid is the same drawing as the outline, the stroke turned into fills with round ends, at the same
weight 2. 574 of 575 mostly-kept paths in class A measure exactly one stroke of ink (background 1.0 from the centreline
on both sides). **That is why the box holds there: there is nothing to hold.** For these 264 pairs (300 with the near-identical ones) the two styles are
not two drawings; a viewer cannot tell Line from Solid. Our locked rule (line-heavy marks go heavier, 2.5 · 2 · 2) exists to
avoid exactly that, and it is the choice that puts the box and the leg angle in conflict.

## 4. Slanted ends — the table that answers the question

Every open stroke end was read for its direction; "slanted" means more than 1° off horizontal or vertical.

**4a. How common they are** (any slanted open end in the outline):

| set | drawings with one | of | share |
|---|---|---|---|
| Untitled UI (pairs) | 606 | 1,170 | 51.8% |
| Ours (concepts, 24) | 237 | 485 | 48.9% |
| Central (concepts) | 886 | 1,926 | 46.0% |

Untitled outlines hold 6,482 open ends in all; 2,251 (34.7%) are slanted. Among ours, 110 of the 143 line-heavy concepts
are slanted-ended (76.9%).

**4b. Whether the box survives, side by side, by what holds the side in the outline** (a side is "held by a slanted end" when a
round cap on a slanted stroke is what reaches the edge of the ink box):

| | sides held by a slanted end | box equal to 0.01 |
|---|---|---|
| Untitled — identical pairs (A) | 301 | 301 (100%) — by identity |
| Untitled — near pairs (B) | 14 | 14 (100%) — by identity |
| Untitled — redrawn pairs (C) | 258 | 234 (90.7%) |
| **Untitled — all** | **573** | **549 (95.8%)** |
| **Ours — line-heavy pairs** | 636 | 636 (100%) |
| **Ours — shape-filled pairs** | 299 | 299 (100%) |
| **Ours — all** | **935** | **935 (100%)** |

For comparison, the other sides in Untitled's redrawn pairs: square-on ends 618 of 649 (95.2%), contours and bends 2,489 of
2,573 (96.7%). So slanted ends are the weakest class in Untitled, by four to six points.

**We carry proportionally more of the hard case, not less:** slanted-end sides are 573 of Untitled's 4,680 sides (12.2%) and 935
of our 5,820 (16.1%).

**4c. The 24 slanted-end sides that break** (Untitled): `package-{check,search,x}`, `file-{check,download,x}-01/02`,
`calendar-check-02`, `credit-card-{download,refresh,search}`, `download-cloud-01/02`, `check-square-broken`,
`cloud-lightning`, and the pen-tool family (`pen-tool-01/02` and `pen-tool-minus/plus`). All but `cloud-lightning` and the two
nibs `pen-tool-01/02` are a badge: the outline draws the bare mark at the edge of the box; the solid draws the badge (mostly as
a disc with the mark cut out) up to a unit or two further out.
**None is a weight-change conflict.** The conflict that fights our rule does not occur in Untitled: I found no stroke that
changes weight.

**4d. The verdict.** Untitled's record on slanted ends is lower than ours (95.8% against 100%), and more than half of it
(315 of 573 sides) is identity. It is not evidence that zero tolerance is achievable under a weight change. Our own set is.

## 5. Where Untitled's pairs break

83 pairs. The first group is tagged by a name pattern after looking at the contact sheets (`analysis/breaks-1.png`: the 42
largest in order; `breaks-2.png`: the rest; outline blue, solid red, both dark); the next two are tagged by name patterns
too; the last is whatever is left.

| group | pairs | what the eye sees |
|---|---|---|
| a small badge on a base: file / calendar / credit-card / package / clock + plus, check, x, lock, heart, attachment, download, search, refresh; pen-tool ±; cloud + arrow; `chart-breakout-*`; `check-square-broken`; `file-code-02` | 43 | the badge sits up to 1 unit (2 for the cloud and credit-card marks, 2.5 for `file-code-02`) further out in the solid, mostly as a disc with the mark cut out; the outline has the bare mark |
| a 3D box, gem or shield vertex (`package`, `container`, `cube-01/02`, `diamond-01/02`, `shield-03`) | 7 | the diamonds are 0.94–0.95 narrower on each side in the solid; the boxes, `cube-01` and `shield-03` have their bottom vertex 0.62–0.63 higher; `cube-02` is 0.62 shorter at top and bottom |
| bars and pies (`bar-chart-10/11/12`, `horizontal-bar-chart-01/02/03`, `coins-stacked-03`, `pie-chart-01/03/04`) | 10 | the three bar charts are 1 wider on each side in the solid; the horizontal bar charts are 0.5 shorter at top and bottom; `coins-stacked-03` 0.5 at the bottom; the pies 0.03–0.19 |
| the rest, all 23, with the worst side: `cloud-lightning` 3.00, `coins-hand` 1.00, `server-02` 1.00, `speaker-02` 1.00, `cloud-snowing-01` 1.00, `pen-tool-02` 0.76, `download-04` and `upload-04` 0.65, `pen-tool-01` 0.34, `sticker-circle` 0.34, the four `arrow-circle-broken-*` 0.19, `announcement-03` 0.10, `youtube`, `phone-call-02`, `thumbs-up`, `settings-02` 0.05, `microscope`, `rocket-01` 0.04, `laptop-02` 0.03, `car-02` 0.01 | 23 | 14 are over 0.1, 9 under 0.1 |

The badge pattern is `BADGE` in `untitled-pairs.mjs`. "Not a badge" does not mean unexplained; it means not a badge.

## 6. What the solid keeps and what it cuts

For every outline stroke path I took its centreline and looked at the solid there: *kept* if the centreline is ink in the
solid, *cut* if it is air. A kept path's nearest background is half a stroke away when the solid's outer edge sits on the
outline's outer edge; a cut path's air is as wide as the cut.

| | paths | result |
|---|---|---|
| class A, kept | 575 | 574 exactly one stroke (2.0 ± 0.1); 1 at 2.5 |
| class B, kept | 120 | 119 exactly one stroke |
| class C, kept | 1,329 | 1,289 (97.0%) exactly one stroke; 22 read wider than 2.1 — strokes that are the edge of a filled shape (chart bars, the lid of a trash can, a diamond), where the nearest background is further than half a stroke; 18 read narrower than 1.9 |
| class C, **cut** | 473 | **394 (83.3%) are cut exactly one stroke wide** (2.0 ± 0.1); 79 read otherwise (dots, tips, halos around a badge) |

Reading: Untitled builds the solid out of the line drawing's own band. What stays keeps the weight; what goes is cut at the
weight. I found no thickened line. The cut is **one number with the line** (1×); with one stroke weight in the whole set it
cannot say what the cut should be when the line gets lighter (see Central, which does).

## 7. Corners against the derived expectation

The expectation (ours in C23, and Central's practice): the filled outer corner radius is the outline's centreline radius plus
half the stroke. Test: push every outline corner out by half the stroke and look for a corner at that place, with the same
turn, in the solid. Untitled's corners are smoothed (a squircle-style curve): the harness flags 1,107 of 1,168 outline centreline corners (94.8%)
and 1,882 of 2,382 solid-contour corners (79.0%) as not circular. Radii here are therefore the equivalent circle (tangent length
÷ tan(turn/2)), comparable with each other, not with our circular arcs.

| | corners | found in the solid | radius = centreline + half stroke to 0.05 |
|---|---|---|---|
| class A (the solid *is* the outlined line) | 135 | 131 (97.0%) | 109 (83.2% of found; 127 to 0.15, all 131 to 0.5) |
| class C, all turns | 2,769 | 1,917 (69.2%) | 1,330 (69.4% of found) |
| class C, 90° corners | 1,820 | 1,331 (73.1%) | 1,063 (79.9% of found) |
| class C, other turns | 949 | 586 | 267 (45.6% of found) |

It is a convention, not a rule, in Untitled. Where the outline's corner is 3.2, the solid's is 4.2 in 270 of 281 cases (96.1%).
Where the outline's corner is 4.8, the solid's is 5.8 in 537 of 781 (68.8%) — but in 234 (30.0%) it is 4.16 instead, in 62
icons (35 of them have "square" in the name): the solid draws a squarer corner than the outline's own outer edge, by 1.6 units
of radius. The solid appears to carry one container corner (about 4.16–4.2) whatever the outline draws. The box cannot see this;
the eye might (section 10).

## 8. Our set, the same questions (`src/icons`, read-only)

| | |
|---|---|
| Pairs holding the outer box to 0.01 | 1,401 of 1,455 (96.3%) — 467 of 485 at each of 24, 20, 16 |
| The other 54 | 18 concepts, each differing at all three masters (0.5 at 24, 0.25 at 20, 0.25 or 0.375 at 16), every one of the 54 files carrying a `<!-- grows: -->` note in its filled file; undeclared breaks: 0. They are the repeated-element stacks, the lone bars and the dots: `chart-bar`, `filter-2`, `grid-3`, `grid-4`, `list-bullet`, `list-bullet-2`, `menu`, `menu-2`, `menu-3`, `menu-4`, `menu-arrow-left`, `menu-arrow-right`, `minus`, `minus-large`, `minus-small`, `more-horizontal`, `more-vertical`, `text-2` |
| Line-heavy concepts (filled = a heavier stroke, no area) | 143 at 24, 429 pairs across the three masters |
| Slanted-end sides in line-heavy pairs | 636 of 636 equal to 0.01 (axis-end sides 593 of 665 and contour sides 349 of 415 carry the 54 declared exceptions) |

**What the price is — the chevron leg angle.** 40 chevron concepts × 3 masters = 120 pairs. The mean angle of the slanted legs
moves more than 0.5° in 48, more than 1° in 28, more than 2° in 10, at most 2.813°:

| family | 24 | 20 | 16 |
|---|---|---|---|
| classic 45° (`chevron-*`) | 0 of 12, max 0.07° | 0 of 12, max 0.05° | 8 of 12, max 0.65° |
| flat ~34° (`chevron-*-2`) | **12 of 12, max 2.81°** | 8 of 12, max 0.67° | **12 of 12, 1.39–1.92°** |
| steep ~52° (`chevron-*-3`) | 0 of 12 | 0 of 12 | 0 of 12 |
| `chevrons-up-down*` | 2 of 4, max 2.81° | 2 of 4, max 0.67° | 4 of 4, max 1.85° |

32 of the 48 are the flat family. The mechanism is geometry, not drawing: in a V whose two ends and whose tip all reach the
box in the same axis, holding the box and the angle needs the weight to stay the same; the filled bend can grow up to 2× the
C10 minimum to compensate, and the flat family hits that cap (C12 says so).

## 9. Findings about us — three kinds, kept apart

**Kind 1 — a drawing disagrees with a rule as stated.**

| # | finding | evidence | tag |
|---|---|---|---|
| 1 | The 12 flat chevrons at 16 (`chevron-{up,down,left,right}-2`, `-2-small`, `-2-large`) have filled legs flatter than their outlines by 1.39° (`-2-large`), 1.85° (`-2-small`) and 1.92° (plain). C12 says their filled legs sit "under 1° at 20 and 16". C12 was written 2026-09-17; the 16 stroke moved to 1.25 on 2026-09-20 (C7) and the sentence was not revisited. | `untitled-pairs.mjs --ours`, report section 7 (chevron table) | systemic — one family, one master |

**Kind 2 — a rule disagrees with another rule or with the docs.**

| # | finding | evidence | tag |
|---|---|---|---|
| 1 | The Settled row "Exact placement (C10, C12)" states two things together — the filled box equals the outline's with no tolerance, and filled bends grow to keep the leg angle. They cannot both hold for the flat chevron. C12's full text carves the flat family out in words, at 24 only ("up to ~3° flatter at 24"); the Settled row does not carve it out, and the carve-out is too small at 16 (kind 1, finding 1). | `CLAUDE.md:200`, `docs/07` C12, section 8 | systemic — the flat family: 32 of its 36 pairs move more than 0.5° |

**Kind 3 — fine by every rule and still looks wrong.** None established in this card. This card made no eye pass over our
drawings; the questions that need one are in section 10.

## 10. What only Maruti's eye can settle

1. **Does a 1.4–1.9° flatter filled leg read as the same chevron beside its outline at real 16 px?** No instrument answers
   this; it decides whether the flat family needs a different compromise than "box exact, angle gives".
2. **Does a badge keep one form across the two styles?** Untitled's answer is a bare mark in the line style and a disc with a
   cut mark in the solid, and its box cannot hold. Ours holds the box (it is a rule), but whether the badge's *form* should be
   the same in both styles is a design call, and card 1.9 owns the modifier grammar.
3. **Is a squarer solid corner than the line's outer edge (Untitled's 4.16 against 5.8) a flaw or a feature?** It is invisible
   to every box rule we have. It is the same question as the container-radius ruling.
4. **Does a quarter of a set whose Line and Solid are the same drawing matter to a customer?** We have already decided it
   does (heavier stroke); this is recorded only so the decision is not lost.

## 11. Instruments, data notes, how to reproduce this

- `heart-hand` has no solid twin and its extraction raised a NaN; the ingest cut that path. It is excluded from every figure.
- Counts here (1,170 pairs) differ from `figma.mjs summary` (1,171 pairs, 1,084 holds) in two ways: `help-octagon` is set
  aside here rather than paired twice, and the harness compares a box by x, y, width and height while this compares the four
  sides. Re-run the harness's way over the same records and 1,084 comes back exactly; a pair whose left and right edges each move
  0.007 in opposite directions breaks the width test and holds the side test.
- "Badge" is an eye-read tag by name (section 5); "slanted" uses a 1° threshold; "held" uses 0.01 here (our lint's tolerance for
  the pair) and 0.02 in the Central work (Figma rounds to four decimals, so 0.02 is 200 times the rounding noise).
- Instruments built for this card and left in `tools/audit/refs/`: `pairgeom.mjs` (analytic ink box, rasteriser, distance
  transform, corner runs with place) with `pairgeom.test.mjs` (18 tests on synthetic geometry, each a number checkable by hand;
  `node --test tools/audit/refs/pairgeom.test.mjs`), `untitled-pairs.mjs`, `untitled-ours.mjs`, and `independent-check.py`
  (three headline numbers re-derived with no shared code). They read third-party records and our icons; they write only under
  `research/references/`.

---

## Take / refuse / why

Every finding run through the transfer test (`plans/set-and-rules-audit.md`): (1) it answers a question we already have;
(2) their constraint matches ours on that question; (3) it is a method, not a value; (4) we can check it.

**Take — one method, zero numbers.**

> **Cut every outline-against-filled census by what holds each side of the ink box, and report the hold rate per class.**
> Classes: held by a slanted end · by a square-on end · by a contour or bend. Never report a bare pass/fail.

In plain words: when a pair of drawings fails the "same outer edge" rule, first ask *which part of the drawing holds that edge* — a stroke ending on a slant, a stroke
ending square-on, or a contour — and count the failures inside each of those, instead of counting how many pairs fail.

| test | |
|---|---|
| (1) our question | Is zero tolerance on slanted-ended line-heavy marks achievable (axis F13), and where do the 48 chevron angle failures come from? A single pass rate cannot say; this cut did. |
| (2) constraint | The method needs only two parallel drawings of one concept and a box rule — which is our situation. (The *finding* it produced about Untitled fails (2) — see below — which is why only the method is taken.) |
| (3) method or value | Method. No Untitled number crosses. |
| (4) checkable | Done: section 4b ran it on both sets, `untitled-pairs.mjs --ours`. |

**Refuse — seen and rejected, because:**

| finding | why |
|---|---|
| "26 of 26 pairs share the outer box" as corroboration of outer-edge equality | the 26 were the commonest concepts with no badge; at scale 92.9%, and 43 of the 83 breaks are modifier badges. Fails (3): a sample number. |
| Untitled's near-perfect record on slanted ends | fails (2): no stroke changes weight there, so the box-versus-angle conflict never arises; 55% of its slanted-end sides hold by identity. It is no evidence about our rule. |
| Solid = the outlined line, for line-only marks | fails (2): it gives Line and Solid the same drawing for 25.6% of the set; our locked rule exists to prevent that. Settled; not reopened. |
| Cut width = one line (1×), measured 83.3% | not a second take: `references-fluent.md` (card 2.1) takes the one-stroke knockout as its method (its T2) and Fluent, which draws seven sizes, is the right witness for our 16 question. Untitled agrees at its one size and adds nothing: with one weight in the set it cannot say what a cut should be when the line is lighter — our 16 master has a 1.25 line against a 1.5 floor. |
| The disc-with-cut-mark badge in the solid | fails (1) and (4) here: Untitled does not hold it (43 of its 83 breaks), and our badge form belongs to card 1.9. |
| The corner radii (4.8 outline / 4.16 solid; 3.2 / 4.2) and 79.9% agreement | values; also fails (2): smoothed squircle corners, not our circular arcs. The *test* that produced the agreement figure is an instrument built here (`cornerRuns` + `offsetVertex` in `pairgeom.mjs`); it is reported in `references-central.md` §5 and §9, where it was applied to our own pairs, and is not a second take from Untitled. |
| Stroke 2, round caps and joins, 60% smoothing, 24×24 | values. |
