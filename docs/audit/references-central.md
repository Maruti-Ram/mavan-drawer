# Reference: Central Icons — what a parameter change costs when professionals redraw for it

Card 2.5 of `plans/set-and-rules-audit.md`; feeds strand C (the parameter map, cards 3.3–3.4). Measured 2026-10-04 against
our pinned tree `5933041`. Third-party geometry: everything read here lives under `research/references/central/figma/`
(gitignored, internal comparison, never shipped). This file holds measurements and conclusions only — no path data.

How to reproduce: `node tools/audit/refs/central-axes.mjs --png --ours` (one to two minutes; reads the ingested Central records and,
read-only, `src/icons`). It prints the measurements below (not the sums and shares worked out from them, which are plain arithmetic on its lines) and writes
`research/references/central/figma/analysis/report.txt` (+ `sample64-stroke2-vs-1.png`). Shared geometry:
`tools/audit/refs/pairgeom.mjs`. Our-set half: `tools/audit/refs/untitled-ours.mjs` (`radiusRelation`).

---

## The short answer

Central draws every icon 30 times: filled off/on × stroke 2/1.5/1 × radius 0/1/2/3 × join square/round (radius 0 has both
joins, radius 1–3 only round: five pairs of eight). Hand-redrawn, not restyled: a concept's 30 variants hold a median of
**26 distinct drawings**. So it is a free experiment in what moves when one number changes. The five questions:

1. **"Hold the outer edge, move the centreline" — set-wide, or only containers? Set-wide as the majority, not as a rule, and
   it is *not* a container rule.** In 63.3% of 7,843 checked (icon × radius/join) triples the whole outer box holds while the
   line goes 2 → 1.5 → 1 and the centreline moves in; in 1.3% the centreline holds instead and the ink shrinks (the
   `chevron-bottom` type); 1.3% do not change; **34.1% do neither** — some sides held, some given, details redrawn. By what
   holds the side: square-on stroke ends keep their edge 91.8% of the time, closed contours 82.7%, the inside of open strokes
   78.9%, filled shapes 70.9%, **slanted stroke ends 61.2%**. By drawing: marks with only square-on ends hold the whole box
   75.0%, closed-only drawings (nearest to containers) 61.3% (+5.9% that do not change at all), slanted-ended marks 54.9%.
2. **"Hold the angle, move the point" — set-wide? No: 61.2%.** Of 15,988 slanted straight pieces whose ends move between
   stroke 2 and stroke 1, 61.2% keep their angle to 0.05° and 70.9% to half a degree. The other 6,198 (38.8%) change by more: 60.1% of
   those by more than a degree (median 1.33°, 90th percentile 5.25°). Over all moved pieces the change has median 0.001° (most are exact),
   75th percentile 0.77°, 90th 3.18°, 99th 12.5°. Where the outer box is held the angle is kept a little more often (65.5%).
3. **"Filled corner radius = centreline radius + half the stroke" — set-wide? Almost: 94.7%.** 65,816 of 69,521 matched
   corners (91.4% at radius 3, 99.0% at radius 0 with mitred joins). 66.9% of the 1,340 icons with a matched corner satisfy
   it at every corner; 57 fail at more than half. The radius axis value *is* the outline's centreline radius (modal share
   81–84% of 90° corners at axis 1, 73% at 2, 62–63% at 3, the same at all three strokes).
4. **Does the radius axis ever change the ink box? Yes — at a sharp tip.** Sides held by a flat edge keep their place 98.2%
   of the time and sides held by a ring or an arc 97.7%; **sides held by a sharp apex keep it only 27.5%** (1,504 sides):
   the rounded tip retreats, median 0.41, up to 1.73. Overall 14.9% of the 4,933 (icon × stroke) outline sets change their
   box somewhere along radius 0 → 3.
5. **What a one-number change costs.** Stroke 2 → 1: in 98.8% of icons the geometry is redrawn at every radius/join pair;
   of the on-curve points of icons whose command structure survives, 45.8% move by exactly the half-stroke change (0.5),
   3.6% by half of it, 26.5% hold, 24.0% move by something else. Radius 0 → 3: 32.8% of icons do not change at all, 13.3% change
   only a rounding property (the path stays sharp), 53.9% are redrawn.

**For our decision:** Central shows no priority between edge and angle. Where the outer box holds the angle is kept *more*
often (65.5%) than where it does not (55.5%): the two go together more often than they trade off, so no priority between
them is visible. Ours is a stated priority — box exact, angle gives. In size, Central's angle changes reach further than ours: its
90th percentile over moved pieces is 3.18°, our largest over chevron pairs is 2.81° (10 of 120 over 2°). That is context for the
choice, not a replacement for it.

---

## 1. Sample, and why this one — and how far to trust the read

| | |
|---|---|
| Source | Figma page `❖  Icons` (`7:118`): 37 category frames of component sets (a 38th holds 159 plain brand logos, not read) |
| Read | **1,926 of 1,927 sets × 30 variants = 57,780 drawings**, all 24×24. `burger` is unreadable: Figma raised "Network: invalid loop" reading its vector network |
| Why the whole set, not a sample | reading it cost 28 bridge calls; a sample would only add sampling error to a read that cost no more. The eye check uses a fixed even spread of 64 (every 30th concept in catalogue order, from the 16th), because nobody looks at 1,926 |
| Trusted ink box | mine, from the path **with node-level rounding put back**, and only where it agrees with Figma's render bounds to 0.01: **verified 53,842 (93.2%)**; rotated or flipped 1,032 (Figma's render bounds are wrong there; mine stands alone and is kept out of every hold/give figure); disputed 2,906 (5.0%), left out and counted. Disputed causes: per-vertex corner radius 1,548, caps or joins that differ along a path 951, small 256, a flipped render box 151 |
| Weights | 27,407 of 28,403 outline drawings (96.5%) paint every stroke at the axis weight; the rest keep a fixed-width detail |

**Two things the wave-0 reader cannot see** (they change how the radius axis must be read; the first reaches other cards):

- **Rounding can live only as a property.** A Figma vector can carry its corner rounding as `cornerRadius` while
  `vectorPaths` — and so every `d` in an ingested record — still describes the sharp polyline. `chevron-triangle-down-medium`
  reads `M 7 10 L 17 10 L 12 16 L 7 10 Z` at radius 0, 1, 2 and 3 alike, with `cornerRadius` 0 / 0.5 / 0.75 / 1 and a render box
  that shrinks from 6.0 to 7.13 on the left. **3,980 of the 17,334 radius 1–3 outline drawings (23.0%)** are like this. I put the
  rounding back (`roundSharp`) and checked it against Figma's render bounds: the rebuilt box agrees for 95.4% of the 8,227
  non-rotated drawings that carry a rounding property, against 90.0% without it.
- **Render bounds lie on flipped and rotated nodes.** `chevron-double-left` reads x −19…−6 in `measure.ink`; the drawing is at
  6…19. Any card using `measure.ink` on Central (or Fluent — not checked here) should use the path.

Both are data notes for the lead, not defects of this analysis; section 11 lists the rest.

**Lengths, normalised** (the plan's rule for crossing systems). Central's canvas is 24 and its stroke 2 / 1.5 / 1, so divide a length in units by 24 for its share of the
canvas and by the stroke for its multiple of the stroke. The apex retreat (median 0.41, worst 1.73) is 1.7% and 7.2% of the canvas, 0.21 and 0.87 of a stroke-2 line; the
half-stroke change of 0.5 is a quarter of the stroke-2 line; the radius axis values 1, 2, 3 are 4.2%, 8.3% and 12.5% of the canvas, 0.5, 1 and 1.5 strokes at stroke 2. Ours,
at 16: the 0.125 radius step is 0.8% of that canvas and 0.1 of the 1.25 stroke. Every comparison across sets in this file is a rate or an angle, which need no conversion.

## 2. What each axis does to the drawing

| axis | what changes |
|---|---|
| stroke, outline | redrawn at **every** one of the five radius/join pairs in 1,902 of 1,926 icons (98.8%); identical for all five in only 15 (the centreline never moves) |
| stroke, filled | redrawn at every pair in 1,836; identical for all five in 51 |
| radius, outline (stroke 2, round, 0 → 3) | nothing changes 632 (32.8%) · only the rounding property changes 256 (13.3%) · 2–4 distinct paths 1,038 (53.9%) |
| radius, filled | nothing changes 642 (33.3%) · paths change 1,282 (66.6%) · property only 2 |
| all 30 variants | median 26 distinct drawings; 283 icons have 30 of 30 distinct, 924 have 27 or more; 377 have fewer than 10 |

## 3. Stroke axis — which parts move, which hold, by how much

Reference is stroke 2; the question is what stroke 1.5 and stroke 1 do to the **outer ink box**, with the centreline free to
move. The change in the half-stroke is 0.25 at 1.5 and 0.5 at 1.

**3a. The whole drawing** (7,843 triples with all three boxes verified; 1,787 left out):

| result | triples | share |
|---|---|---|
| outer box held, centreline moved in | 4,962 | 63.3% |
| centreline held, ink shrinks | 105 | 1.3% |
| nothing changes (box and centreline both unchanged) | 103 | 1.3% |
| neither (mixed) | 2,673 | 34.1% |

By radius/join pair, "outer box held": radius 0 with mitred joins and butt or square caps 53.3% (789 of 1,480); the four round
pairs 64.1–67.5%. By the drawing's open ends (classified at stroke 2, radius 0, round):

| drawing | triples | box held | centreline held | no change | mixed |
|---|---|---|---|---|---|
| square-on ends only | 2,763 | 75.0% | 0.0% | 0.4% | 24.7% |
| no open ends (closed shapes) | 1,565 | 61.3% | 0.3% | 5.9% | 32.5% |
| slanted-ended | 3,515 | 54.9% | 2.9% | 0.0% | 42.2% |

**3b. Side by side — what holds each side of the box** (round-capped, round-joined, centre-aligned strokes only, so the ink
is the centreline ± half the weight; 4,439 triples = 17,756 sides; 2,827 triples left out for other cap/join/align):

| held by | sides | edge held at both 1.5 and 1 | centreline held (edge shrinks by half the change) | other |
|---|---|---|---|---|
| closed contour | 7,578 | 82.7% | 1.9% | 15.4% (371 where the edge *grows* as the line thins) |
| end of an open stroke, square-on | 4,596 | **91.8%** | 1.0% | 7.3% |
| inside of an open stroke | 2,768 | 78.9% | 5.6% | 15.6% |
| end of an open stroke, slanted | 2,030 | **61.2%** | 12.2% | 26.7% |
| filled shape in an outline | 784 | 70.9% | 0.0% | 29.1% |

Reading: the rule is not about containers. It is strongest on straight, square-on ends and weakest on slanted ends, where
one in eight designers holds the centreline instead (the ink shrinks) and a quarter do something else.

**3c. The points themselves** (stroke 2 → 1, radius 0, round, drawings whose command structure is identical: 1,233 icons,
35,790 on-curve coordinates, x and y counted separately): moves **0.5 (the whole change)** 45.8% · **holds** 26.5% · moves
0.25 3.6% · other under 0.5 12.2% · other over 0.5 11.8%. At radius 2: 46.8 / 24.4 / 3.7 / 13.3 / 11.9. So the signature of
"hold the edge" is nearly half the points moving by exactly the half-stroke change and a quarter not moving at all.

**3d. A look at 64 (every 30th from the 16th):** in 53 of 64 the stroke-1 drawing is, to within 5% of its ink, a thinner copy
nested inside the stroke-2 drawing. In 11 more than 5% of its ink falls outside (six over 10%: `ai-translate`,
`arrow-wall-2-up`, `paint-bucket`, `progress-100`, `layout-left`, `people-add-2`) — a different shape, not a lighter one.

**3e. Named exemplars** (outline, radius 0, round; ink box x0,y0,x1,y1 at stroke 2 · 1.5 · 1; the report prints them):

| icon | box at 2 · 1.5 · 1 | reading |
|---|---|---|
| `folder-1`, `heart`, `bell`, `plus-large`, `cross-large` | identical at all three (`folder-1`: 2,3,22,20) | edge held, centreline moved in |
| `chevron-bottom` | 3,8,21,18 · 3.25,8.25,20.75,17.75 · 3.5,8.5,20.5,17.5 | centreline held: the ink shrinks by the change on every side |
| `magic-wand` | 3,2.76,21.24,21 · 3,3.01,20.99,21 · 3,3.26,20.74,21 | two sides held, two shrink by the change |
| `chevron-triangle-down-small` | 8,10,16,16 · 8,10.25,16,15.75 · 8.5,10.5,15.5,15 | no one rule across the two lighter strokes: x holds at 1.5 and gives 0.5 at 1; the bottom gives 0.25, then 1.0 |
| `arrow-path-left` | 1,4,22,20 · 1.25,4.25,22.25,20.25 · 1.25,4,22,20 | the whole box slides 0.25 at 1.5; at 1 only the left side has moved |
| `draft-simple` | 2,2,22,22 · 2.25,2.25,21.75,21.75 · 3.25,3.25,20.75,20.75 | gives 1.25 on every side at stroke 1 — two and a half times the 0.5 change in the half-stroke |

## 4. Stroke axis — do slanted pieces keep their angle?

22,582 slanted straight pieces (more than 1° off horizontal or vertical) at stroke 2, in non-rotated drawings; 19,352 matched by
position to a piece at stroke 1; 3,364 did not move; **15,988 moved**.

| angle kept to | pieces | share of the moved |
|---|---|---|
| 0.05° | 9,790 | 61.2% |
| 0.5° | 11,336 | 70.9% |
| 1° | 12,260 | 76.7% |

Size of the change over all the moved pieces: median 0.001°, 75th percentile 0.77°, 90th 3.18°, 99th 12.53°. By whether the outer box held in that
triple: box held 7,081 moved pieces, angle kept to 0.05° 65.5% (to 0.5°: 75.6%); box not held 6,494, 55.5% (66.1%).
So "hold the angle, move the point" is what Central mostly does (61.2% exact) but not a rule. Of the 6,198 moved pieces that do not keep the
angle to 0.05°, 2,470 (39.9%) change by up to a degree and 3,728 (60.1%) by more, median change of those 1.33°, 90th percentile 5.25°; over all
moved pieces 29.1% change by more than half a degree.

## 5. Filled corner radius against the outline's

Every outline corner (a rounded one, or a sharp vertex that a round join turns into an arc) pushed out by half the stroke; the
filled twin at the same stroke, radius and join searched for a corner at that place with the same turn.

| pair | outline corners | found in the filled twin | filled = centreline + half stroke to 0.05 |
|---|---|---|---|
| radius 0, mitred | 19,630 | 79.3% | 99.0% |
| radius 0, round | 18,880 | 77.6% | 95.0% |
| radius 1 | 18,197 | 79.0% | 94.0% |
| radius 2 | 16,992 | 77.1% | 92.8% |
| radius 3 | 15,826 | 74.7% | 91.4% |
| **all** | **89,525** | **69,521 (77.7%)** | **65,816 (94.7%)** |

Where it fails (3,705 corners): the filled radius is larger than expected 2,303 times, smaller 1,402; in 216 it equals the
outline's *centreline* radius, i.e. the half stroke was not added. 1,340 icons have a matched corner; 896 (66.9%) obey the
relation at every matched corner, 444 fail somewhere, 57 fail at more than half. The 22% not found are corners the filled
twin does not have (punched out, merged, or placed elsewhere), so the figure is for corners that exist in both.

**Applied to our shape-filled pairs** (`radii.mjs` corners, same place-matching; a match is consistent if the filled radius is the
outline's centreline radius plus *or* minus half the outline stroke — plus for an outer contour, minus for a punched line):

| master | shape-filled pairs | matched corners | consistent to 0.02 | off |
|---|---|---|---|---|
| 24 | 342 | 1,001 | 986 (98.5%) | 15 corners in 10 concepts |
| 20 | 342 | 976 | 964 (98.8%) | 12 corners in 8 concepts |
| 16 | 342 | 961 | 910 (94.7%) | 51 corners in 13 concepts |

At 16, **50 of the 51 are off by exactly +0.125** (the filled corner is 0.125 larger than outline + half the 1.25 stroke), in `archive`,
`calendar`, `calendar-2`, `calendar-3`, `credit-card`, `credit-card-2`, `credit-card-3`, `file`, `file-text`, `file-text-2`,
`folder`, `folder-2`, `folder-3`. The one other is −0.125 (`folder`). That is `docs/09` §2's entry "16 filled corners sit 0.05 inside the
outline's" (found on `folder`, 2026-09-20; "on record, not a bug") — the measured scale is **13 concepts**, one cause (the 16 stroke moved to 1.25 and the twins kept the
1.5-era radii). At 24 and 20 the off corners are: `clipboard`, `clipboard-3`, `clipboard-4` (filled corner 0 where 0.75 is expected at 24, 0.5 at
20), `copy-2`, `copy-3` (+1.5: 4.75 where 3.25 is expected), `archive` and `thumbs-up` (−0.25), `heart`, `shield`, `shield-2`, `wand-2` (under 0.08,
curve-fit size).

## 6. Radius axis — does it ever change the ink box?

Reference radius 0 with round join; same stroke, same fill state; tolerance 0.02.

| | (icon × stroke) sets | box never changes | when it changes: median / 90th / worst side |
|---|---|---|---|
| outline | 4,933 | 4,200 (85.1%) | 0.38 / 0.91 / 1.73 |
| filled | 5,726 | 4,729 (82.6%) | 0.33 / 0.88 / 2.00 |

By what holds the side at radius 0 (outline):

| held by | sides | box never changes | when it changes |
|---|---|---|---|
| a flat edge square-on to the side | 10,262 | 98.2% | median 0.20, max 0.81 |
| a ring or an arc already | 7,966 | 97.7% | median 0.36, max 1.41 |
| **a sharp apex** (chevron tip, arrow point, triangle corner) | **1,504** | **27.5%** | **median 0.41, max 1.73** |

Of the 1,464 outline sides that change, 1,091 (74.5%) were held by an apex, 186 by a flat edge and 187 by a ring or arc. In the *filled* drawings the pointed
vertices are already small arcs at radius 0 (a round join), so they are counted as "ring or arc" there: of the 1,885 filled sides that change, 1,612 are that
kind, 253 flat, 20 apex.

Reading: rounding a corner costs the box mostly where a pointed vertex defines the side, and Central mostly lets it cost:
for a 90° V with 45° legs the tip retreats by r(√2 − 1) = 0.414 per unit of radius, which is what `chevron-bottom` shows
(10.00 → 9.59 → 9.17 → 8.76 across radius 0 → 3). In 27.5% of the apex sides the box did not change: the vertex was moved outward to compensate, or the rounding never reached that tip. That
is the other half of our C10: *we* fix the bend radius (half the weight) and hold the box; Central frees the radius and lets the
tip go.

## 7. Outline against filled (the same axes, one level over)

| | |
|---|---|
| Pairs (same stroke, radius, join) with both boxes verified | 25,092 (3,798 left out) |
| Outer box equal on all four sides to 0.01 | **22,874 (91.2%)** — the earlier 26-icon sample read 334 of 390 (85.6%), as given in the card brief |

Per side, by what holds the side in the outline: closed contour 96.3% of 28,944 · square-on end 98.0% of 15,368 · inside of an open
stroke 93.7% of 10,621 · **slanted end 92.7% of 7,000** · filled shape 97.8% of 2,947. By drawing:

| outline's open ends | icons | pairs equal | icons where *every* pair breaks |
|---|---|---|---|
| none (closed shapes) | 338 | 94.2% | 4 (1.2%) |
| square-on only | 657 | 94.5% | 18 (2.7%) |
| slanted | 836 | **87.2%** | **59 (7.1%)** |

So Central does give up the box more on slanted-ended marks — 12.8% of their pairs break against 5.8% of closed-only and 5.5% of square-on-only
ones, 2.2 and 2.3 times the rate — but not "precisely" there (the 338, 657 and 836 are the icons with at least one verified pair, 1,831 of 1,926;
the 886 in `references-untitled.md` §4a counts all 1,926): 59 of the
81 always-breaking icons are slanted-ended, and the other 22 have none (the list includes hands, medals and 3D boxes).
The clearest cluster is the cross family: `cross-large` and `cross-small`, the four diagonal arrows and `checkmark-2` are all in the
always-breaking list. In `cross-large` the filled X is cut flat across its ends where the outline X is round-capped, so the filled
box is 0.25 bigger on each side at the round join (0.46 at the mitred one); it breaks in 15 of 15 pairs, by up to 0.46 a side — the 0.91 quoted earlier is the width, two sides together.

**How line-only marks are handled.** At stroke 2, radius 0, round (1,068 icons whose outlines have round caps): the filled ink
equals the outline's (IoU 0.999 or better) in 260 (24.3%), is near it in 60 (5.6%), and is redrawn in 748 (70.0%). That is a similar split
to Untitled UI's (22.6 / 3.1 / 74.4): for about a quarter of these 1,068 icons (those with round-capped outlines) the filled twin is the line outlined
at the same weight, not a heavier line.

**What is cut, and how wide.** For every outline stroke the filled twin at the same stroke was sampled along the centreline:

| stroke | strokes mostly cut away | cut exactly one stroke wide (± 10%) | kept strokes whose edge is where the outline's outer edge is |
|---|---|---|---|
| 2 | 398 | 310 (77.9%) | 2,208 of 2,357 (93.7%) |
| 1.5 | 452 | 361 (79.9%) | 2,354 of 2,532 (93.0%) |
| 1 | 478 | 408 (85.4%) | 2,631 of 2,791 (94.3%) |

The cut **scales with the line**: one stroke wide at 2, at 1.5 and at 1. If it were a fixed width the ratio would grow as the line thins.

## 8. What Central's variant structure means for transfer test (2)

Central **declines to decide** stroke and radius: it offers three strokes and four radii as the customer's axes and draws every concept at all
of them. We decide both — one stroke per master, one radius vocabulary — and ship no axis. So:

- **Every Central number about *which value is right* is out.** They never say; the customer chooses.
- **Every Central number about *how a drawing responds when a free number changes* is in.** That dependency does not depend on who
  chooses the value, and our 24 → 16 stroke change (1.5 → 1.25 at one master) is the same act performed once.
- **What Central must do and we need not:** keep 30 variants interchangeable in one slot. That is why the outer edge is held for most
  drawings: the edge *is* the slot. Our slot is the keyline and the outline/filled pair, held by rule (1,401 of 1,455 pairs; the other 54 declared).
  Nothing in the data shows a rule or a check behind it; what the data shows is the 34% that hold neither.
- **What we must do and Central never does: change size.** Central never redraws for 16 or 20, so it cannot speak to F6 (what is held and
  what gives from 24 to 16). Everything here is one canvas.

## 9. Findings about us — three kinds, kept apart

**Kind 1 — a drawing disagrees with a rule as stated.** The rule is the Settled row for Styles: "filled outer edge = outline outer edge".
Where the outline's corner is a stroke offset, that means filled radius = centreline radius + half the outline stroke, which is what section 5 tests.

| # | finding | evidence | tag |
|---|---|---|---|
| 1 | At 16, 13 shape-filled twins have a corner radius 0.125 larger than the outline's outer corner (outline centreline + 0.625): `archive`, `calendar` ×3, `credit-card` ×3, `file`, `file-text`, `file-text-2`, `folder` ×3 (50 corners). A 0.125 difference in radius puts a corner's diagonal midpoint 0.05 inside the outline's edge. `docs/09` §2 records it as found on `folder` and "on record, not a bug"; the measured scale is 13 concepts. | section 5, `central-axes.mjs --ours` | systemic — one cause (the 16 stroke moved; the twins kept the 1.5-era radii) |
| 2 | `clipboard`, `clipboard-3`, `clipboard-4`: the filled twin has a sharp corner (0) where the outline rounds at 1.5 (24) or 1.25 (20) and the relation expects 0.75 (24) or 0.5 (20). | section 5 | one-off, ×3 (one drawing family) — not judged whether agreed |
| 3 | `copy-2`, `copy-3`: filled corner 4.75 (24) / 4.25 (20) where 3.25 / 2.75 is expected (+1.5). | section 5 | one-off, ×2 — not judged whether agreed |
| 4 | `archive`, `thumbs-up`: 0.25 under the relation at 24 (0.5 where 0.75 is expected). `heart`, `shield`, `shield-2`, `wand-2` are under 0.08, which is the size of a curve fit, not a finding. | section 5 | one-off |

**Kind 2 — a rule disagrees with another rule or with the docs.**

| # | finding | evidence | tag |
|---|---|---|---|
| 1 | C23's radius table (container 2.5 · 2 · 1.5 on the centreline, **outer 3.25 · 2.75 · 2.25**) was derived with a 0.75 half-stroke at every master. Since C7 the 16 outline stroke is 1.25 (half 0.625), so the derivation that produced the table gives 2.125 at 16, not 2.25. The table was kept, and C7 records that the 34 shape-filled files at 16 "changed only their root `stroke-width` label". The two decisions are individually deliberate and jointly make Kind 1, finding 1. | `docs/07` C7, C23; `docs/09` §2; section 5 | systemic — known; the new fact is the count |

**Kind 3 — fine by every rule and still looks wrong.** None established in this card (no eye pass over our drawings).

## 10. What only Maruti's eye can settle

1. **How much leg-angle change reads as a different chevron.** Central's moved diagonals: median 0.001°, 75th percentile 0.77°, 90th 3.18°.
   Ours: 48 of 120 chevron pairs over 0.5°, at most 2.813° (`references-untitled.md` §8). Only a pair of chevrons at real size settles the tolerance.
2. **Should the cut follow the line or hold a floor?** Central cuts exactly one stroke wide at every stroke (77.9–85.4% of cut strokes). Ours: a literal
   1.5 at every master (Maruti, 2026-09-28), which is 1.2× the 1.25 line at 16. This is the pending "check cut weight" ruling; it needs a lab sheet of
   the same filled drawing with a 1.25 cut and a 1.5 cut at real 16 px, because no number answers it.
3. **Does a tip that retreats as the corner softens (median 0.41 over the whole radius range 0 → 3 in Central) matter once the bend radius is fixed?** In ours it is fixed by C10,
   so only the question of whether *different* chevrons (bend 0.75 vs 1.97 in the filled) look like the same family remains — for the eye, at 16.

## 11. Instruments, data notes, how to reproduce this

- `burger` could not be read (Figma error); every count is of 1,926 icons.
- Names are not unique inside Central (two `images-4` in one group); every concept-level figure keys on group, name and order.
- The figures describe the drawings that could be verified (93.2%); the 5.0% left out as disputed are by construction the more intricate ones (per-vertex rounding, mixed caps), so
  the hold rates here are, if anything, kind to Central.
- Boxes: only verified boxes enter any hold/give figure. Rotated or flipped (1,032) and disputed (2,906) drawings are left out and counted; for the
  disputed, the cause is mostly per-vertex rounding (1,548) and mixed caps (951), which this model cannot reproduce.
- A side's "holder" is read from geometry at stroke 2 with a 0.01 reach; it is only meaningful for round-capped, round-joined, centre-aligned strokes
  (4,439 of 7,704 round-pair triples qualify, 2,827 do not, 438 had an unverified box).
- Tolerances: 0.02 for "held" in the stroke work (Figma rounds to four decimals, so 0.02 is 200 times the rounding noise), 0.01 for pair boxes, 0.05 for radii,
  1° for "slanted", 0.05° for "angle kept". The stroke-axis headline is stable to them: across hold tolerances 0.005 to 0.1 the whole box holds in 61.2% to 68.7% of
  triples and the "neither" class is 36.2% to 28.6%; across matching tolerances (vertex 0.08–0.3, turn 1–4°) the corner relation holds in 94.4% to 95.0% of matched corners.
- The corner matcher needs an outline and a filled twin with the same turn within 2° and a vertex within 0.15 of the expected one; the 22% unmatched are not failures.
- A tail of stroke weights in Central belongs to fixed-width details (996 outline drawings, 3.5%), not to the axis; the commonest off-axis weights are 0.25 (415 paths),
  0.5 (371), 0.75 (349) and 1.8 (301).
- An independent check with no shared code (`tools/audit/refs/independent-check.py`, Figma's render bounds only, non-rotated): the radius-0 round triples that hold the
  whole box at 1.5 and 1 are 1,253 of 1,844 (68.0%), against 1,135 of 1,651 (68.7%) on verified boxes here; slanted-ended icons 886 of 1,926 (46.0%) in both.
- Instruments built for this card and left in `tools/audit/refs/`: `pairgeom.mjs` (analytic and verified ink box, node rounding rebuilt, side holders, corner runs
  with place, the rasteriser and distance transform) with `pairgeom.test.mjs` (18 tests on synthetic geometry), `central-axes.mjs`, `untitled-ours.mjs`, `independent-check.py`. The place-matched corner test and the centreline band sampler
  are new audit instruments with no reference number in them; cards 1.2 and 1.8 can use them as they are.

---

## Take / refuse / why

Every finding run through the transfer test (`plans/set-and-rules-audit.md`): (1) it answers a question we already have;
(2) their constraint matches ours on that question; (3) it is a method, not a value; (4) we can check it.

**Take — one method, zero numbers.**

> **Read the dependency of a parameter change off paired drawings, as a table: one free number at a time; rows are the classes of element
> (closed contour · square-on end · slanted end · apex · filled shape); columns are *holds* · *moves by exactly the change* · *gives*;
> every cell with its sample size and its units of the change.** Use that table, not prose, as the format of the parameter map.

In plain words: for each number we might ever change (a stroke, a radius, a master), write down which parts of a drawing stay where they are, which follow the change
exactly, and which have to be redrawn — and say how many drawings each statement was read from.

| test | |
|---|---|
| (1) our question | Strand C: "change one number → what recomputes, what is redrawn, what your eye must re-decide", with stroke-16 as the worked example (card 3.3). The table is the missing format. |
| (2) constraint | Central's variants are hand-redrawn at a fixed canvas for each value of one number. Our stroke-16 conversion was the same act. The *values* do not transfer (they offer axes, we fix defaults — section 8); the *table* does not depend on who chooses the value. |
| (3) method or value | Method. No Central number crosses. |
| (4) checkable | Yes, on our own history: the 114 outline masters at 16 exist before and after commit `032b1c4` ("C7: the 16 master draws at stroke 1.25"), and `plans/stroke-16.md` records how they were converted (95 by `tools/convert-16.mjs`, 19 by hand). Running this table over those pairs is the check; **not run in this card** — `[needs measuring]`. |

**Refuse — seen and rejected, because:**

| finding | why |
|---|---|
| Offer stroke and radius as customer axes | fails (2): we ship no weight axis; the customer never adjusts stroke (Settled). |
| "Hold the outer edge, move the centreline" as a rule (63.3% of triples; 91.8% to 61.2% by side) | not a rule Central keeps (34.1% hold neither); and we already hold the box by rule and lint (1,401 of 1,455, 54 declared). Nothing to import. Fails (3): a rate, not a method. |
| "Hold the angle, move the point" (61.2% kept to 0.05°) | not a priority Central keeps either (the angle is kept slightly more often where the box is held, 65.5% against 55.5%), and the opposite of ours: box exact, angle gives (chevrons: up to 2.81°; 1.92° at 16). Both are defensible; which is right is the eye's call (section 10). Central's 90th percentile (3.18°) is not a target. |
| Filled radius = centreline + half the stroke (94.7%) | it is the derivation already behind our C23 radii table and the Settled "filled outer edge = outline outer edge". Central confirms the relation, with exceptions in a third of its icons; the useful thing is the *check* (an instrument built here, applied to ours in section 5), not a Central method. |
| The radius axis changes the box, mostly at tips (outline: 1,091 of the 1,464 changing sides are apex-held; 72.5% of apex sides change) | a geometric consequence (r(√2−1) per unit of radius), not a Central practice; C10 already fixes the bend and holds the box. A value in any case. |
| Cut one stroke wide at every stroke (77.9–85.4%) | not a second take: `references-fluent.md` (card 2.1) takes the one-stroke knockout as its method (its T2), and Fluent, which draws seven sizes, is the right witness for our 16 question. Central agrees at its one canvas size and adds only that the cut follows the line when the line changes; ours is a floor chosen so 16 px survives (Maruti, 2026-09-28; lint §5f), so the reason for the number differs. Held for the eye (section 10, item 2). |
| Rounding as a node property on a sharp skeleton (23.0% of radius 1–3 drawings) | fails (2): we draw arcs by hand and publish outlined fills from a private stroked source; a property that rounds a skeleton is how one generates a radius axis, which we do not ship. |
| The corner and stroke values themselves (stroke 2/1.5/1; radii 0–3; 24×24) | values. |
