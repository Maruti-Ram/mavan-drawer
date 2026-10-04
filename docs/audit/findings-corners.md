# Findings — corners and radii (card 1.2, axis F2)

Measured 2026-10-04 against the pinned tree **`5933041`** — 485 concepts, 2,910 drawings.
Instrument: `tools/audit/radii.mjs` (wave 0), plus a literal census of the typed `rx` values.
Every number below was produced this session. Nothing is recalled, nothing is estimated.

**Reproduce:** `node tools/audit/radii.mjs` for the set-wide census; the per-concept tables came
from a scratchpad dump of `radiiOf()` over `listIcons()` (10,965 corners), plus `grep` over the
typed `A` literals in `src/icons/`.

**Checked by a fresh reviewer.** An agent that did none of this work re-verified eight corner
claims independently — reading the SVG source with its own path parser rather than re-running the
instrument. It found **one FAIL and one PARTIAL**, both now fixed in place and visible:

- `watch-3` and `pencil` were reported as drawing the filled corner tighter than the relation.
  **Both were wrong; both are withdrawn** (C-3, C-4), and section 7.2 now adjudicates all nine
  flagged concepts from source. The cause was a pairing artifact, recorded as C-3a.
- "Zero lying literals in the set" was true for corners and false set-wide.
  Section 1.3 is now scoped and the exceptions are measured.
- The other six claims passed, including the 12-file count in 7.1, which the reviewer reproduced
  exactly and extended.

**A wave-0 statement this card refutes.** The reconnaissance recorded *"four concepts go the
OPPOSITE way on the filled container corner: `pencil`/`-3`/`-4` are 0.75/0.5/0.375 tighter than
outline-plus-half-stroke; `watch-3` at 24 is a full 1.0 tighter."* **Measured from the typed
literals, none of the four does** (section 7.2). Do not carry that statement into the register.

**What the instrument sees.** 10,965 corners: 9,236 fillets and 1,729 sharp. 5,453 on stroked
centrelines, 5,512 on filled area contours. `tools/lint.mjs:364-376` reads only the typed `rx`/`ry`
on stroked paths and only as a lower bound, so it sees about half of these and judges none of them
against a vocabulary.

**What it cannot see.** A shape with no straight runs has no corners — a ring, a dot, a lens, a
bowl. That is deliberate and it is `docs/09-rule-audit.md:23`'s own distinction. So the circle
families (`check-circle`, `plus-circle`, `x-circle`, `help`, `info`, `alert-circle`) contribute
almost nothing to this axis, and 582 corners (5.3%) are classed `ambiguous` rather than guessed at.

---

## 1. The vocabulary, as drawn

### 1.1 Outline files, stroked centrelines, container role — the rule's own subject

Radii snapped to the nearest sixteenth where the measurement is within 0.025 (composite-arc fit
noise; see section 8.1). Percentages are of that master's column.

| Master | corners | tier 1 | tier 2 | tier 3 | on one of the three | distinct values |
|---|---|---|---|---|---|---|
| 24 | 617 | **2.5** x 381 (61.8%) | **1.5** x 111 (18.0%) | **0.75** x 87 (14.1%) | 579 (93.8%) | 12 |
| 20 | 581 | **2** x 357 (61.4%) | **1.25** x 101 (17.4%) | **0.75** x 87 (15.0%) | 545 (93.8%) | 10 |
| 16 | 563 | **1.5** x 330 (58.6%) | **1** x 107 (19.0%) | **0.625** x 89 (15.8%) | 526 (93.4%) | 10 |

The proportions are the same at all three masters to within 3 points. 1,761 corners in all.

### 1.2 All corners, all roles, both styles — the full radius histogram

| Master | commonest fourteen measured radii |
|---|---|
| 24 | 2.5x360 · 3.25x260 · 1.5x178 · 0.75x91 · 2.25x89 · 0.5x65 · 1x16 · 1.75x14 · 3.248x10 · 2x10 · 2.502x8 · 2.75x7 · 0.748x6 · 1.499x5 |
| 20 | 2x430 · 2.75x242 · 1.25x94 · 0.75x86 · 1.5x75 · 0.5x61 · 1.75x22 · 1x18 · 2.753x8 · 2.001x8 · 1.497x8 · 0.748x7 · 1.994x6 · 6.5x5 |
| 16 | 1.5x323 · 2.125x224 · 1x100 · 0.625x88 · 1.625x86 · 1.25x74 · 0.5x51 · 2.25x24 · 0.75x14 · 1.375x12 · 2.124x8 · 1.5x8 · 0.625x7 · 0.875x6 |

The second-commonest value at every master is **tier 1 plus half the outline stroke** — 3.25, 2.75,
2.125. That is the filled twin's outer contour, and it is the single strongest regularity in the
whole census (section 7).

### 1.3 The typed literals — what the drawer actually wrote

| Master | arcs in outline files | distinct `rx` | commonest |
|---|---|---|---|
| 24 | 2,489 | 75 | 0.75x557 · 2.5x540 · 1.5x398 · 1x151 · 9.25x128 |
| 20 | 2,440 | 65 | 2x560 · 0.75x540 · 1.25x356 · 7.25x128 · 1.75x103 |
| 16 | 2,432 | 75 | 1.5x561 · 0.625x483 · 1x344 · 6.375x128 · 0.75x117 |

**Zero Bezier commands in all 2,910 files. 30-32 arcs per master are elliptical (`rx != ry`);
all the rest are circular.** 8,547 single-arc **corners** carry a typed `rx`, and **all 8,547 match
the radius drawn, exactly** (largest discrepancy 7.8e-16, i.e. float noise) — so on the population
this card is about, a typed corner radius is design intent and can be read as such.

**Scoped, because the wider claim is false.** Outside the corner population there *are* arcs whose
typed `rx` a renderer silently enlarges: an arc cannot be narrower than half its own chord, and some
full-circle and semicircle constructions type an `rx` rounded to 2 dp that falls a hair short.
Measured two ways — **117 arcs in 27 concepts** counting exact semicircles only (the fresh
reviewer's independent SVG F.6.6 implementation) and **165 arcs in 77 files, 31 concepts** counting
every arc (this card's own check, which also catches elliptical and near-degenerate cases). The
count depends entirely on the filter; the mechanism does not. `src/icons/24/link.svg` types
`A4.24 4.24` across a chord of 8.4994, which needs 4.24972 — short by **0.00972 units**, a scale-up
of x1.0023. `src/icons/24/attachment-3.svg` types `A2.29 2.29` where 2.2981 is needed. The
concepts: `attachment-3` `attachment-4` `ban-2` `check-circle-3` `-3-small` `-4` `check-circle-small`
`checkbox-2` `-3` `-4` `clock` `database` `-2` `-3` `external-link` `-2` `face-sad` `face-smile`
`globe` `globe-2` `help-3` `help-4` `language-2` `-3` `link` `link-2` `moon` `watch` `watch-3`
`x-circle` `x-circle-small`.
This is the same mechanism as the near-miss angles (`docs/audit/findings-angles.md` 2.1) — 2-dp
rounding of a computed value, licensed by `docs/01-foundations.md:185-188` — and at 0.01 units it is
invisible. It is recorded because "zero lying literals in the set" would have been overstated.
Also found: **7 zero-length arcs**, which the spec tells a renderer to omit — `chart-pie-3-filled`
at all three masters, `paintbrush-4` and `paintbrush-4-filled` at 24 and 20.

---

## 2. The three tiers are locked to three different things

| Tier | 24 | 20 | 16 | share of canvas | multiple of that master's stroke |
|---|---|---|---|---|---|
| 1 | 2.5 | 2 | 1.5 | 10.417% · 10% · 9.375% | 1.667x · 1.333x · **1.2x** |
| 2 | 1.5 | 1.25 | 1 | **6.25% · 6.25% · 6.25%** | 1x · 0.833x · 0.8x |
| 3 | 0.75 | 0.75 | 0.625 | 3.125% · 3.75% · 3.906% | **0.5x · 0.5x · 0.5x** |

- **Tier 2 is exactly canvas-locked** — one sixteenth of the canvas at every master, to the digit.
- **Tier 3 is exactly stroke-locked** — half the stroke at every master. It *is* `bendMin`
  (`tools/masters.mjs:28`, `bendMin = weight / 2`), so C10's mark-bend floor and the set's
  tightest container corner are the same number.
- **Tier 1 is locked to neither.** It loses 10% of its canvas share and **28% of its
  stroke-relative weight** from 24 to 16. Canvas-locked it would be 2.083 at 20 and 1.667 at 16;
  stroke-locked it would be 2.5 at 20 and 2.083 at 16. It is 2 and 1.5.

**Reference calibration** (from the brief's wave-0 measurement, not re-derived here): IBM,
Salesforce and Material all set radius = stroke, i.e. 1.0x. **Our tier 2 at 24 is exactly that
number.** Our tier 1 is 1.67x at 24 falling to 1.2x at 16 — so at 16 our primary container corner
has converged most of the way onto the industry single radius, and at 24 it is two thirds rounder.

---

## 3. Does each tier have a job?

Yes, and **the drawings already name them.** `grep` over the 24 masters' comments: 52 files say
"container radius", 26 say "detail radius", 5 say "bend radius", 2 cite "C10's minimum". Where the
value follows the phrase it is tier 1 for "container radius" (50 of 51 occurrences) and
`1.5 · 1.25 · 1` for "detail radius" (every occurrence) — i.e. tier 2. The vocabulary is in daily
use in the source files; `docs/01-foundations.md:308-321` records it incompletely.

### 3.1 Structural evidence — role and part size

Outline files, stroked paths, all roles, fillets on a tier. "Part min-dim" is the smaller side of
the bounding box of the subpath the corner belongs to, in that master's units.

| Master | tier | n | role mix | part min-dim: p25 / median / p75 |
|---|---|---|---|---|
| 24 | 1 (2.5) | 495 | container 381 · detail 84 · bend 21 | 11.5 / **14.5** / 16.5 |
| 24 | 2 (1.5) | 291 | detail 136 · container 111 · bend 32 | 5 / **10.5** / 14.5 |
| 24 | 3 (0.75) | 337 | **bend 145** · detail 103 · container 88 | 5 / **8.5** / 14.5 |
| 20 | 1 (2) | 494 | container 357 · detail 96 · bend 22 | 7.5 / **10.5** / 12.5 |
| 20 | 2 (1.25) | 285 | detail 137 · container 101 · bend 31 | 3.73 / **8.5** / 12.28 |
| 20 | 3 (0.75) | 385 | detail 152 · **bend 145** · container 87 | 4 / **6.28** / 10.42 |
| 16 | 1 (1.5) | 490 | container 330 · detail 117 · bend 21 | 6.75 / **8.75** / 10.75 |
| 16 | 2 (1) | 292 | detail 143 · container 107 · bend 32 | 3.6 / **7** / 10.65 |
| 16 | 3 (0.625) | 346 | **bend 148** · detail 108 · container 89 | 3.6 / **5.75** / 8.75 |

Part size falls monotonically from tier 1 to tier 3 at every master, but the quartiles overlap
heavily — size alone does not pick the tier. **Role does:** tier 1 is 77% container at 24, tier 3
is dominated by bends at all three masters.

### 3.2 The three jobs, in one sentence each

Read off the concepts that use one tier and nothing else at 24:

| Tier | Job | Concepts that use it alone (24) |
|---|---|---|
| 1 — 2.5 | **A card.** A rectangle whose inside is a surface — a screen, a page, a panel, a card face. | 89: `calendar` `clipboard` `credit-card` `desktop` `file` `image` `mail` `table` `keyboard` `layout-*` `wallet` `watch` `checkbox` `briefcase` `archive` `copy` `files` `presentation` `puzzle` `save` and the rest |
| 2 — 1.5 | **An object.** The silhouette of a thing whose outline is its own form, not a frame. | 18: `book-4` `book-open` `book-open-2` `building` `building-2/-3/-4` `message-3` `package-2/-3` `paintbrush` `pin` `pin-6` `play` `plug-4` `store` `store-2` `trash` |
| 3 — 0.75 | **A tip.** A corner that must still read as a point. Identical to C10's mark bend. | 20: `cursor` `cursor-2/-3` `heart` `heart-2` `map-pin` `map-pin-3/-4` `send` `sparkle` `sparkle-2/-3/-4` `star` `lightbulb` `pencil-2` `play-3` `chart-bar-4` `message-5/-6` |

The mixed signatures confirm the reading rather than muddy it: `camera` `folder` `home`
`thumbs-up` take a card body (tier 1) plus an object part (tier 2); `filter` `megaphone` `pencil`
`volume-none` take an object body plus a tip; `message` `message-2` `compose-4` take a card plus a
tip (the bubble's tail); `compose` `compose-2` `compose-3` use all three.

Tier signature of the 167 concepts with a rounded container corner at 24:

| Signature | n | |
|---|---|---|
| tier 1 only | 89 | cards |
| tier 3 only | 20 | pointed / organic silhouettes |
| tier 2 only | 18 | non-card objects |
| tier 1 + 2 | 11 | `camera` `camera-2` `camera-5` `folder` `folder-2` `folder-3` `home` `home-2` `home-3` `thumbs-up` `thumbs-up-2` |
| tier 2 + 3 | 9 | `filter` `filter-4` `megaphone` x3 `pencil` `pencil-3` `pencil-4` `volume-none` |
| tier 1 + 3 | 4 | `compose-4` `filter-3` `message` `message-2` |
| all three | 3 | `compose` `compose-2` `compose-3` |
| off-tier only | 7 | `pin-2` `pin-4` `pin-5` `shield-2` `wand` `wrench` `wrench-2` |
| off-tier + a tier | 6 | `book` `book-2` `book-3` `lock-6` `shield` `message-7` |

**89 of 167 (53.3%) use only 2.5; 78 (46.7%) use something other than 2.5 somewhere.**

### 3.3 A fourth value the doc already has: 0

**1,729 sharp corners.** 981 on filled area paths, 748 on stroked paths; 628 of those are in
outline files, across 62 concepts. **124 of them are container-role corners in 21 concepts:**

| Concept | sharp container corners (24 + 20 + 16) |
|---|---|
| `package` | 12 |
| `compose` `compose-2` `compose-3` `compose-4` `file` `file-text` `file-text-2` `files-4` `home` `pencil` `pencil-2` `pencil-3` `pencil-4` `save` `wrench` `wrench-2` | 6 each |
| `files` `files-2` `files-3` `files-5` | 4 each (24 and 20 only) |

Every one is structurally motivated — `file`'s chamfer meeting its body (C23 says that chamfer is
"the one construction in the set where the 0/45/90 grid lands exactly"), `home`'s eaves,
`package`'s box seams, `pencil`'s tip, `wrench`'s jaw. So the vocabulary in use is **four values
per master**: tier 1, tier 2, tier 3, sharp.

---

## 4. Off-tier values — the full list, judged

Outline files, stroked paths, container role, snapped. 38 corners at 24 · 36 at 20 · 37 at 16.
Two groups, and they are not the same kind of thing.

### 4.1 Not corners at all — a body curve the instrument catches because the subpath is big and closed

| Concept | 24 | 20 | 16 | What it is |
|---|---|---|---|---|
| `shield` `shield-2` | 9 | 6.5 | 5.5 | The belly arc. The file says so: *"one belly arc of radius 9 · 6.5 · 5.5 that turns the side through 68 degrees"*. |
| `message-7` | 4.5 | 3.25 | 2.625 | The bubble's body curve. |
| `lock-6` | 5.5 | — | — | The shackle. |
| `plug-6` | — | 5.75 | 4.625 | The body curve. |

Eight corners at 24, six at 20, six at 16. **Not findings.** Rings, lenses, bowls and belly arcs
are shapes, not corners — `docs/09-rule-audit.md:23`'s own words. The same class, outside the
container role, accounts for the long tail in 1.2: `chart-pie` 9.25/7.25/6.375, `lightbulb`
7.25/5.25/4.375, `map-pin` 7.25/5.25/4.375, `message` 9.25/7.25/6.375, `user-3` 4/3/2.5.

### 4.2 Genuine intermediate corner radii — 11 concepts

| Concept | 24 | 20 | 16 | Internal logic | Judged |
|---|---|---|---|---|---|
| `book` `book-2` `book-3` | **2** + t2 | **1.75** + t2 | **1.5** + t2 | The file: *"Corners 1.5 · 1.25 · 1 (book-open's). Curl radius 2 · 1.75 · 1.5"*. The page curl is **the body corner + 0.5 at every master**, declared. | **Decision.** A curl is not a corner; the +0.5 is consistent and documented. The value lands on tier 1 at 16 by coincidence. |
| `wrench` `wrench-2` | 1.25, **1.73** | 1, 1.5 | 0.875, 1.375 | The socket jaw and the neck. Free-form mechanism geometry. | **Decision**, but off-vocabulary. 1.73 at 24 is a composite fit (8.1); the typed values are 1.25 and 1.75. |
| `wrench-3` | — | 1 | 0.875 | Same family, one fewer master. | As above. |
| `pin-2` `pin-4` `pin-5` | **1** x4/2/6 | 1 | 0.75 | The pin's shaft shoulders. 1 / 1 / 0.75 — **the value does not change from 24 to 20**. | **Drift, systemic in the `pin` family.** Tier 2 would be 1.5 / 1.25 / 1; tier 3 would be 0.75 / 0.75 / 0.625. `pin` and `pin-6` use tier 2 for the same shoulder. Five siblings, two answers. |
| `wand` `wand-2` | 1 | 1 | 0.75 | Same pattern as `pin-2`. | Same drift. |
| `thumbs-up` `thumbs-up-2` | 1.5 (tip) | **1.5** | **1.375** | The file: *"tip radius 1.5 · 1.5 · 1.375 so the thumb is 3 · 3 · 2.75 wide on the line at the tip ... the air inside the tip is 1.5 · 1.5 · 1.5, the floor exactly"*. | **Decision, and a good one.** The tip radius is held nearly constant because the thing it controls is the 1.5 gap floor inside the thumb, not a proportion. Canvas share rises 6.25% to 7.5% to 8.6% — a deliberate consequence. |
| `alert-triangle` x4 | t1 | t1 | **2** (apex) | At 16 the apex alone steps one radius ABOVE tier 1. The file: *"At 16 only, the point takes one radius step more (2 on the line, feet stay 1.5): with 1.5 everywhere the bar was 2.875 against a 2.0 dot and read as a colon in real pixels; at 3.375 it reads as '!'"*. | **Break right, rule wrong.** It bought 0.5 units — half a pixel at 16 — of exclamation-mark bar, and turned a colon back into a "!". `docs/01:320` says "do not use radius values between these"; this is a value *outside* them that is plainly correct. |
| `heart` | 0.772 | — | — | Composite fit of two r0.75 arcs. | **Artifact**, not a deviation (8.1). |
| `shield` `shield-2` | 0.8125 | 0.8125 | 0.625 | Composite fit of two r0.75 / r0.625 arcs at the tip. The file declares *"Tip round 0.75 · 0.75 · 0.625 (C10's minimum at each master)"*, and the filled twin's single arc measures exactly 1.5 = 0.75 + 0.75, which proves it. | **Artifact.** The tip is tier 3 as declared. |

Outside the container role the same two intermediate values recur: `bug` `bug-2` at 2 / 1.5 / 1.25,
the `files` family at 1.25 / 1 / 0.75, `grid` `grid-5` `grid-7` at 1 / 0.75 / 0.75,
`maximize-5` at 1 / 0.75 / 0.75, `wallet` at 1 / 1 / 0.875, `wallet-3` at 2 / 1.5 / 1.375,
`users-behind` at 1.5 / 1.25 / 0.875, and the `cart` family picking up 1 at 20 and 0.75 at 16.

**The pattern across all of them: the off-tier values cluster at 1 and 1.75 at 24, and the
commonest failure is holding the 24 value at 20 instead of stepping with the tier.**

---

## 5. Behaviour from 24 to 16

The tiers scale. **Individual concepts mostly do too, and the exceptions are nameable.**

Outline files, stroked paths, all roles, fillets, comparing the set of radius values per master:

| | n |
|---|---|
| Concepts with at least one fillet | 363 |
| Tier signature **identical** at 24, 20 and 16 | **286 (78.8%)** |
| Signature changes | 74 |
| A master has no fillet at all (`users`, `users-2-behind`, `users-wide`) | 3 |

Of the 74 that change, 42 are the 4.1 class — a free body curve scaled proportionally, which is
not a vocabulary question. **The 32 that are a real radius decision changing between masters:**

| Concept(s) | 24 | 20 | 16 | Reading |
|---|---|---|---|---|
| `rotate-ccw-9` | t1 **2.5** | t1 **2** | t2 **1** | **The one open question already written into a drawing.** Its own comment: *"container radius 1.5 on a square this small read as a circle, so it takes the detail radius (**Maruti to confirm**)"*. Verified in `src/icons/16/rotate-ccw-9.svg` — the square's four corners are `A1 1`. |
| `help-4` | t2 1.5 | t2 1.25 | **t3 0.625** | A two-tier drop at 16. The question mark's shoulder goes from 1.0x the stroke to 0.5x. |
| `users-behind` | t2 1.5 | t2 1.25 | **0.875** | Off-tier at 16 only; tier 2 there is 1. |
| `grid` `grid-5` `grid-7` | 1 | 0.75 | 0.75 | Holds 0.75 at 20 and 16 instead of stepping to 0.625. |
| `wand` `wand-2` `pin-2` `pin-4` | 1 | 1 | 0.75 | Holds the 24 value at 20. |
| `wallet` | 1 + t1 | 1 + t1 | 0.875 + t1 | Holds at 20, lands off-tier at 16. |
| `camera-3` `camera-4` | t1 only | t1 only | t1 + t2 + 0.75 | **Gain** two radii at 16 where 24 and 20 have one. |
| `clipboard-2` | t1 only | t1 only | t1 + t2 | Gains tier 2 at 16. |
| `cart` `cart-3` `cart-4` `cart-5` | t2 | t2 + 1 | t2 + 0.75 | Gain a radius at 20 and again at 16. |
| `thumbs-up` `thumbs-up-2` | t2 + t1 | plus 1.5 | plus 1.375 | The tip, declared (4.2). |
| `maximize-5` | 1 + t1 | t3 + t1 | 0.75 + t1 | 1 to 0.75 to 0.75. |
| `key-3` | t2 1.5 | **1.5** | t2 1 | Holds 1.5 at 20 where tier 2 is 1.25. |
| `book` x3, `wrench` x3, `shield` x2, `alert-triangle` x4 | | | | Covered in 4.2. |

**The shape of it:** 24 and 20 drift together and 16 is where a concept breaks ranks. Six concepts
*gain* radii at 16 (`camera-3`, `camera-4`, `clipboard-2`, and the four `cart`s gain at 20 as well)
— detail appearing at the smallest master, which is the opposite of the F11 expectation that
detail dies first. Worth a look on the wall.

---

## 6. Nested radii — the question does not arise in the outline style

| | n |
|---|---|
| Outline drawings with two or more **closed, rounded** subpaths | **12 of 1,107** — `chart-pie-2`, `grid`, `grid-5`, `grid-7` |
| Of those, **nested** (one strictly inside the other) | **0** |

**The set never draws a rounded closed shape inside another rounded closed shape in the outline
style.** Fluent's concentric rule (outer = inner + distance; confirmed from their source as
1.5 + 2.5 = 4) therefore has **no subject in our outline drawings** and cannot be adopted or
rejected on our own evidence. It is not what we do, because we do not do this.

Where a rounded thing *does* sit inside a rounded thing it is a **knockout in a filled drawing**:
146 solid-plus-hole pairs in 37 concepts. The relationship between the solid's outer corner and the
hole's corner is governed by nothing. Measured:

| Concept | master | solid r | hole r | difference |
|---|---|---|---|---|
| `file` `file-text` `file-text-2` | 24 / 20 / 16 | 3.25 / 2.75 / 2.25 | 0.75 / 0.5 / 0.25 | 2.5 / 2.25 / 2 |
| `files` `files-2` `files-3` `files-5` | 24 / 20 / 16 | 3.25 / 2.75 / 2.125 | 0.5 / 0.25 / 0.25 | 2.75 / 2.5 / 1.875 |
| `book` `book-2` `book-3` | 24 / 20 / 16 | 2.75 / 2.5 / 2.125 | 0.75 / 0.5 / 0.375 | 2 / 2 / 1.75 |
| `checkbox` x4 | 24 / 20 / 16 | 3.25 / 2.75 / 2.125 | **1.5 / 1.5 / 1.5** | 1.75 / 1.25 / **0.625** |
| `compose` | 24 / 20 / 16 | 3.25 / 3 / 2.75 | 1.5 / 1.5 / 1.25 | 1.75 / 1.5 / 1.5 |
| `alert-triangle-2` `alert-triangle-4` | 24 / 20 / 16 | 3.25 / 2.75 / 2.625 | 1 / 0.875 / 0.875 | 2.25 / 1.875 / 1.75 |

The difference takes **15 distinct values from 0 to 6** across the 146 pairs. The outlier is the
`checkbox` family: its hole holds **exactly 1.5 at all three masters** while the solid scales
3.25 to 2.75 to 2.125, so at 16 the hole's corner is **71% of the solid's** against 46% at 24.
Nothing says that is wrong; nothing says it is right either.

**The only rule we have on this is C22's trash counter** — *"inset 0.75 all round"*, which is a
concentric offset rule for one icon. It is not generalised, and card 1.8 owns the filled style.

---

## 7. Filled against outline

The relation C23 states — **filled outer radius = outline centreline radius + half the outline
stroke** — holds everywhere this card was able to adjudicate corner by corner.

**A warning about method first, because this card got it wrong once.** No set-wide *statistic* on
this relation is trustworthy, and three different pairings all mislead:

| Pairing | Result | Why it misleads |
|---|---|---|
| Nearest filled radius to each outline radius | 374 of 409 concept x master pairs agree | Matches an outline body corner to a filled cut-mouth easing |
| Modal container-role radius per style | 376 of 409 (91.9%) | The filled file often has more 0.5 easings than body corners, so the mode is the easing; and `radiiOf` labels some true body corners `ambiguous`, which drops them |
| Multiset containment of typed literals, whole file | 1,749 of 2,145 outline arc literals have their `+ half-stroke` counterpart (81.5%); 396 do not, in 147 concepts | Cannot tell "the filled redrew this corner" from "the filled has no corner there, because a cut removed it" |
| Vertex pairing on the corner's apex | only 46 pairs matched | Wrong geometry: offsetting two legs outward by *h* moves their vertex by *h* / sin(theta/2), so the apex is **not** preserved |

**The only reliable test is to pair each filled corner with the outline corner at the same
outer-edge position** — outline vertex pushed out by half the stroke — and that has to be done per
corner. The fresh reviewer did exactly that for the 16-master population (7.1) and this card did it
by hand from source for the nine concepts that every statistic above flagged (7.2).

What survives as a set-wide figure:

| Test | Result |
|---|---|
| Outline `rx` values at 16 whose filled twin carries `rx + 0.625` | 550 |
| Filled-only convex fillets with no outline counterpart (cut-mouth easings) | 1,396 — commonest 0.5x613, 0.75x306, 0.25x121 |
| 16-master filled files carrying the correct `2.125` for a tier-1 corner | 129 |

### 7.1 The C7 left-behind corner — docs/09's open count, now closed

`docs/09-rule-audit.md` records this as a Maruti decision ("leave it"), and says *"43 of the 117
filled files at 16 are shape-filled and were not all checked"*. Measured by literal:

- **129 filled files at 16 carry `rx` 2.125** — the correct outer value for a tier-1 (1.5) corner.
- **27 carry `rx` 2.25** — the 1.5-era value. Of those, **12 are files whose outline body corner is
  1.5**, so their outer corner sits 0.125 proud of the current relation:
  `calendar` `calendar-2` `calendar-3` `credit-card` `credit-card-2` `credit-card-3`
  `file` `file-text` `file-text-2` `folder` `folder-2` `folder-3`.
  (The remaining 15 carry 2.25 for an element whose outline corner is not 1.5, so 2.25 is correct
  there: `bug` `bug-2` `camera-2` `camera-3` `camera-4` `language` `list-bullet-3` `paintbrush-7`
  `puzzle-2` `puzzle-3` `puzzle-4` `puzzle-5` `users-2-behind` `users-2-level` `users-behind`.)

**The answer is 12 concepts, 12 files, and they are the `file` / `folder` / `calendar` /
`credit-card` families.** Not 43. The decision on record stands; the population is now known, so
closing it set-wide is a 12-file job, not an unbounded one.

**Scope of that count, because card 1.8 reports a larger one.** This is a *corner* count: 16-master
filled files whose typed body-corner literal is 2.25 where 1.5 + 0.625 = 2.125 is derived.
`docs/audit/findings-filled.md` measures *edges* 0.125 proud of their derived position and reports
69 corners in 23 concepts. The two are not in conflict — the broader figure includes concepts whose
proud edge is not the tier-1 body corner, and concepts at 24 and 20. Use 12 for "how many 16-master
body corners would a set-wide fix redraw"; use card 1.8's figure for "how much of the filled style
sits proud of its derivation".

### 7.2 Every concept the statistics flagged, adjudicated from source — all nine are consistent

An earlier draft of this card reported `pencil` / `-3` / `-4` and `watch-3` as drawing the filled
corner tighter than the relation. **Both findings were wrong and are withdrawn.** They came from the
modal pairing in the table above. Read off the typed literals, every concept the statistics flagged
obeys C23 exactly:

| Concept | outline arcs (24 / 20 / 16) | filled area arcs | Verdict |
|---|---|---|---|
| `watch-3` | 2.5 x4, 1.5 x4 / 2 x4, 1.25 x4 / 1.5 x4, 1 x4 | 3.25 x4 **(= 2.5 + 0.75)**, 2.25 x4 **(= 1.5 + 0.75)** / 2.75, 2 / 2.125, 1.625 | **Consistent at all three masters.** The case takes 3.25 and the straps 2.25; the earlier draft paired the case's outline 2.5 with the strap's filled 2.25. |
| `watch-2` | 2.5 x4, 1.5 x4 | 3.25 x4, 2.25 x4 | **Consistent.** Same structure. |
| `pencil` `pencil-3` `pencil-4` | 1.5 x2, 0.75 / 1.25 x2, 0.75 / 1 x2, 0.625 | 2.25 x2 **(= 1.5 + 0.75)**, 1.5 **(= 0.75 + 0.75)** / 2 x2, 1.5 / 1.625 x2, 1.25 | **Consistent.** The filled 1.5 is the *tip* grown from 0.75, not the body grown from 1.5. |
| `mail` | 2.5 x4, 3 | 3.25 x4, 3.75 **(= 3 + 0.75)** | **Consistent.** |
| `store` | 1.5 x6, 3 x3 | 2.25 x4, 3.75 x3 | **Consistent.** |
| `save` | 2.5 x3, 1.5 x4 | 3.25 x3 | **Consistent** on the body; its 1.5 corners are cut away in the filled twin, which is why containment flags it. |
| `archive` | 2.5 x2, 1.5 x4 | 3.25 x2, 2.25 x2 | **Consistent.** |
| `layout-footer-4` | 2.5 x4, 1.5 x2 | 3.25 x2, 2.5 x2, 2.25 x2 | **Consistent.** |
| `maximize-5` | 2.5 x4, 1 x4 | 1.75 x4 **(= 1 + 0.75)** | **Consistent.** Its four corner brackets stay **stroked paths, unchanged**, in the filled file; only the inner square becomes an area. The 2.5 in the filled file is that same stroke, not an outer contour. |

**So this card finds no concept that draws its filled outer corner tighter or looser than
outline + half the stroke, other than the 12 files at 16 in 7.1.** The relation is the most
reliable thing in the whole corner census.

### 7.3 One undocumented filled construction

**Exactly 15 files** — `arrow-down-4`, `arrow-left-4`, `arrow-right-4`, `arrow-up-4`,
`arrow-up-right-4`, at all three masters — publish the same `d` **twice**, once as an area path and
once as a stroked path. It is the only place in the set where a path is both filled and stroked.
The construction is correct (C16: *"its filled style fills the triangle and keeps 1.5 lines"*) and
the visible outer corner is 0.75 + 0.75 = 1.5, the relation held. **Card 1.8 found the same 15
files and the same 5 concepts independently** (`docs/audit/findings-filled.md`), by a different
measure — two instruments agreeing on a construction neither was looking for. But it means the filled triangle
is the **centreline** polygon, not the outer contour, and any tool that reads area paths alone will
report these five concepts as 0.75 instead of 1.5. `tools/audit/radii.mjs` does exactly that; so
would anything we build on it.

---

## 8. Quality of the fillets themselves

### 8.1 Composite corners — a corner built from more than one arc

**649 of 9,236 fillets (7.0%)** are not a single circular arc, so their radius is a least-squares
fit rather than a typed value. 211 at 24 · 218 at 20 · 220 at 16; 435 filled, 214 outline;
50 concepts. 323 of them fit within 0.1 of a tier.

**This is the main source of false positives in any radius audit, including this one.** Two r0.75
arcs meeting at a point fit as r0.8125 (+8%). Every "off-tier" value in 4.2 marked *artifact* is
this. The worst case the brief flagged — `shield` / `shield-2` at 16 fitting **0.6185** against
`bendMin` 0.625 — is 0.0065 under the floor and is the fit of two declared `A0.625` arcs. **Not a
break.**

32 composite fits land under their file's `bendMin`, in 6 concepts: `wand-2` (as low as **0.124**
at 16, the tightest reading in the set), `wrench`, `wrench-2`, `wrench-3` (0.37-0.50, typed as
`A0.5`), and the two `shield`s. All are filled-area details, not mark bends, so C10 does not apply
— and the instrument's own census says so: `913 corners in other roles sit under their file's
bendMin ({area: 911, stroke: 2}) — not C10's case`.

### 8.2 C10's floor, where lint can see it

`node tools/audit/radii.mjs` gives
**1,094 mark bends · 0 under half the stroke · 681 exactly on it.**
C10 is fully obeyed wherever it applies. 681 of 1,094 bends sit precisely on the floor, which is
what makes tier 3 and `bendMin` the same thing in practice as well as in arithmetic.

### 8.3 Fillets that are not quite fillets

| | n | concepts | worst |
|---|---|---|---|
| Meets a leg more than 1 degree off tangent | 357 | 57 | `camera-5` at 180 degrees (a reflex tuck, by construction) |
| Lopsided — the two tangent lengths differ by more than 0.01 | 158 | 37 | `paintbrush-2-filled` at 24, **5.611** units apart on an r3.749 corner |
| Reflex — the fillet goes the long way round | 46 | 10 | `camera-5`, `chart-pie`, `chart-pie-2`, `users-3*`, `wallet-3`, `watch-filled` |
| Classed `ambiguous` | 582 (5.3%) | — | |

The `paintbrush` family dominates the lopsided list (`-2`, `-3`, `-5`, `-7`, `-8` at 24 and 20).
A tangent-length difference of 5.6 units on a 3.75 radius means the curve is not a corner rounding
at all — it is a brush belly that happens to sit between two straights. **Measurement note, not a
drawing finding**, but it is the set's clearest example of the instrument reaching its limit.

---

## 9. Families

### 9.1 Numbered siblings that use different radius values — 16 families

| Family | The split |
|---|---|
| `play` | `play-3` tier 3 · `play` tier 2 · `play-2` tier 1 — **the same triangle at all three tiers across three variants** |
| `message` | `message-5`/`-6` t3 · `message-3` t2 · `message-4` t1 · `message`/`-2` t3+t1 · `message-7` t3+r4.5 — five answers in seven members |
| `chart-bar` | `chart-bar-4` tier 3 · `chart-bar-5` tier 1 |
| `pin` | `pin`/`pin-6` tier 2 · `pin-2`/`-4`/`-5` **r1** |
| `package` | `package` sharp+t1 · `package-2`/`-3` tier 2 |
| `filter` | `filter`/`filter-4` t3+t2 · `filter-3` t3+**t1** |
| `camera` | `camera-3`/`-4`/`-6` t1 · `camera`/`-2`/`-5` t2+t1 |
| `home` | `home` sharp+t2+t1 · `home-2`/`-3` t2+t1 |
| `book` | `book`/`-2`/`-3` t2+curl · `book-4` t2 only |
| `pencil` | `pencil`/`-3`/`-4` sharp+t3+t2 · `pencil-2` sharp+t3 |
| `compose` | `compose-4` sharp+t3+t1 · `compose`/`-2`/`-3` sharp+t3+t2+t1 |
| `shield` | `shield` adds tier 1 shoulders; `shield-2` has none |
| `lock` | `lock-5` t1 · `lock-6` t1 + r5.5 |
| `wrench` | `wrench`/`-2` sharp+1.25+1.75 · `wrench-3` no container corner |
| `keyboard` | `keyboard` t1 · `keyboard-2` no container corner at 24 |
| `plug` | `plug-4` t2 · `plug-6` no container corner at 24 |

Most of these are legitimate — a variant is *supposed* to be a different drawing, and C9 says the
number names a shape variant. But `play`, `message`, `chart-bar` and `pin` are cases where the
**same object** takes a **different tier** in different variants, which is the thing a reader
would notice in a grid of twenty.

### 9.2 Size variants — a clean pass

31 size-variant concepts have a fillet (seven `check*-small`, 24 `chevron-*-small`/`-large`).
**All 31 carry exactly the same radius as their base — r0.75 at 24, i.e. C10's bend.** C8's size
step never touches a corner radius, and C18's "keep the container, shrink only the inner mark" is
untestable on this axis because every size-varying container is a circle.

---

## 10. In pixels

One master unit = one pixel when a drawing is rendered at its own master size. A 90-degree corner
of radius r eats r off each leg; the arc's nearest point sits r(sqrt2 - 1) inside the sharp vertex.
Against the square keyline (18 · 14 · 12):

| Master | side | tier | r | eats | arc depth | straight run left | r / stroke |
|---|---|---|---|---|---|---|---|
| 24 | 18 | 1 | 2.5 | 2.5 px | 1.036 px | 13 of 18 (72.2%) | 1.667x |
| 24 | 18 | 2 | 1.5 | 1.5 px | 0.621 px | 15 of 18 (83.3%) | 1x |
| 24 | 18 | 3 | 0.75 | 0.75 px | 0.311 px | 16.5 of 18 (91.7%) | 0.5x |
| 20 | 14 | 1 | 2 | 2 px | 0.828 px | 10 of 14 (71.4%) | 1.333x |
| 20 | 14 | 2 | 1.25 | 1.25 px | 0.518 px | 11.5 of 14 (82.1%) | 0.833x |
| 20 | 14 | 3 | 0.75 | 0.75 px | 0.311 px | 12.5 of 14 (89.3%) | 0.5x |
| 16 | 12 | 1 | 1.5 | 1.5 px | 0.621 px | 9 of 12 (75%) | 1.2x |
| 16 | 12 | 2 | 1 | 1 px | 0.414 px | 10 of 12 (83.3%) | 0.8x |
| 16 | 12 | 3 | 0.625 | 0.625 px | 0.259 px | 10.75 of 12 (89.6%) | 0.5x |

**What one tier step is worth, in pixels:**

| Master | tier 1 to tier 2 | tier 2 to tier 3 |
|---|---|---|
| 24 | 1 px of edge eaten, arc 0.414 px deeper | 0.75 px, 0.311 px |
| 20 | 0.75 px, 0.311 px | 0.5 px, 0.207 px |
| 16 | **0.5 px, 0.207 px** | **0.375 px, 0.155 px** |

**This is the judgement on the whole axis.** At 24 the three tiers are a real, visible system — a
full pixel of difference between neighbours, and tier 1 eats more than a quarter of an 18-unit
side. At 16 the whole three-tier spread is **0.875 px of tangent and 0.36 px of arc depth**, and
one step is half a pixel. On a 1x screen the difference between a tier-1 and a tier-2 container
corner at 16 is one pixel's worth of grey. **The vocabulary earns its keep at 24 and 20 and is
close to invisible at 16** — which is also why `rotate-ccw-9` could drop a tier at 16 and the
drawer was unsure enough to write "Maruti to confirm".

---

## 10a. The full roll-up — every concept with a container-role corner

170 concepts, grouped by family. Values are the measured radii on the **outline** file's stroked
paths, snapped to the nearest sixteenth where the measurement is within 0.025 of it (composite-arc
fit noise, section 8.1). A dash means that master has no container-role corner — usually because
the part fell below the instrument's 60%-of-ink-box threshold, not because the drawing changed
(see section 5). "Same tiers at all three?" compares the tier signature, so a concept that steps
2.5 -> 2 -> 1.5 reads yes.

Three concepts appear here that section 1.1's count of 167 excludes — `keyboard-2`, `plug-6` and
`wrench-3`. They have **no container-role corner at 24 at all**, only at 20 and 16, because at 24
the part that carries the corner falls below the instrument's 60%-of-ink-box threshold. Their
drawings do not change between masters; the classification does.

| concept | 24 | 20 | 16 | tier signature at 24 | same tiers at all three? |
|---|---|---|---|---|---|
| `alert-triangle` | 2.5 | 2 | 1.5 / 2 | t1 | **no** |
| `alert-triangle-2` | 2.5 | 2 | 1.5 / 2 | t1 | **no** |
| `alert-triangle-3` | 2.5 | 2 | 1.5 / 2 | t1 | **no** |
| `alert-triangle-4` | 2.5 | 2 | 1.5 / 2 | t1 | **no** |
| `archive` | 2.5 | 2 | 1.5 | t1 | yes |
| `book` | 1.5 / 2 | 1.25 / 1.75 | 1 / 1.5 | t2+2 | **no** |
| `book-2` | 1.5 / 2 | 1.25 / 1.75 | 1 / 1.5 | t2+2 | **no** |
| `book-3` | 1.5 / 2 | 1.25 / 1.75 | 1 / 1.5 | t2+2 | **no** |
| `book-4` | 1.5 | 1.25 | 1 | t2 | yes |
| `book-open` | 1.5 | 1.25 | 1 | t2 | yes |
| `book-open-2` | 1.5 | 1.25 | 1 | t2 | yes |
| `briefcase` | 2.5 | 2 | 1.5 | t1 | yes |
| `building` | 1.5 | 1.25 | 1 | t2 | yes |
| `building-2` | 1.5 | 1.25 | 1 | t2 | yes |
| `building-3` | 1.5 | 1.25 | 1 | t2 | yes |
| `building-4` | 1.5 | 1.25 | 1 | t2 | yes |
| `calendar` | 2.5 | 2 | 1.5 | t1 | yes |
| `calendar-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `calendar-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `camera` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `camera-2` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `camera-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `camera-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `camera-5` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `camera-6` | 2.5 | 2 | 1.5 | t1 | yes |
| `cash` | 2.5 | 2 | 1.5 | t1 | yes |
| `chart-bar-4` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `chart-bar-5` | 2.5 | 2 | 1.5 | t1 | yes |
| `checkbox` | 2.5 | 2 | 1.5 | t1 | yes |
| `checkbox-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `checkbox-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `checkbox-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `clipboard` | 2.5 | 2 | 1.5 | t1 | yes |
| `clipboard-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `clipboard-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `clipboard-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `compose` | 0.75 / 1.5 / 2.5 + 2x sharp | 0.75 / 2 + 2x sharp | 0.625 / 1 / 1.5 + 2x sharp | t3+t2+t1+sharp | **no** |
| `compose-2` | 0.75 / 1.5 / 2.5 + 2x sharp | 0.75 / 2 + 2x sharp | 0.625 / 1 / 1.5 + 2x sharp | t3+t2+t1+sharp | **no** |
| `compose-3` | 0.75 / 1.5 / 2.5 + 2x sharp | 0.75 / 2 + 2x sharp | 0.625 / 1 / 1.5 + 2x sharp | t3+t2+t1+sharp | **no** |
| `compose-4` | 0.75 / 2.5 + 2x sharp | 0.75 / 2 + 2x sharp | 0.625 / 1.5 + 2x sharp | t3+t1+sharp | yes |
| `copy` | 2.5 | 2 | — | t1 | **no** |
| `copy-2` | 2.5 | 2 | — | t1 | **no** |
| `copy-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `credit-card` | 2.5 | 2 | 1.5 | t1 | yes |
| `credit-card-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `credit-card-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `cursor` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `cursor-2` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `cursor-3` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `desktop` | 2.5 | 2 | 1.5 | t1 | yes |
| `desktop-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `desktop-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `desktop-4` | 2.5 | 2 | — | t1 | **no** |
| `desktop-5` | 2.5 | 2 | 1.5 | t1 | yes |
| `desktop-6` | 2.5 | 2 | 1.5 | t1 | yes |
| `external-link` | 2.5 | 2 | 1.5 | t1 | yes |
| `external-link-2` | 2.5 | 2 | — | t1 | **no** |
| `file` | 2.5 + 2x sharp | 2 + 2x sharp | 1.5 + 2x sharp | t1+sharp | yes |
| `file-text` | 2.5 + 2x sharp | 2 + 2x sharp | 1.5 + 2x sharp | t1+sharp | yes |
| `file-text-2` | 2.5 + 2x sharp | 2 + 2x sharp | 1.5 + 2x sharp | t1+sharp | yes |
| `files` | 2.5 + 2x sharp | 2 + 2x sharp | — | t1+sharp | **no** |
| `files-2` | 2.5 + 2x sharp | 2 + 2x sharp | — | t1+sharp | **no** |
| `files-3` | 2.5 + 2x sharp | 2 + 2x sharp | — | t1+sharp | **no** |
| `files-4` | 2.5 + 2x sharp | 2 + 2x sharp | 1.5 + 2x sharp | t1+sharp | yes |
| `files-5` | 2.5 + 2x sharp | 2 + 2x sharp | — | t1+sharp | **no** |
| `filter` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `filter-3` | 0.75 / 2.5 | 0.75 / 2 | 0.625 / 1.5 | t3+t1 | yes |
| `filter-4` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `folder` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `folder-2` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `folder-3` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `grid-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `grid-6` | 2.5 | 2 | 1.5 | t1 | yes |
| `heart` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `heart-2` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `home` | 1.5 / 2.5 + 2x sharp | 1.25 / 2 + 2x sharp | 1 / 1.5 + 2x sharp | t2+t1+sharp | yes |
| `home-2` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `home-3` | 1.5 / 2.5 | 1.25 / 2 | 1 / 1.5 | t2+t1 | yes |
| `image` | 2.5 | 2 | 1.5 | t1 | yes |
| `image-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `image-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `images` | 2.5 | 2 | 1.5 | t1 | yes |
| `images-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `images-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `images-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `keyboard` | 2.5 | 2 | 1.5 | t1 | yes |
| `keyboard-2` | — | 2 | 1.5 | - | **no** |
| `layout-footer` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-footer-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-footer-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-header` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-header-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-header-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar-right` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar-right-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `layout-sidebar-right-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `lightbulb` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `lock-5` | 2.5 | — | — | t1 | **no** |
| `lock-6` | 2.5 / 5.5 | — | — | t1+5.5 | **no** |
| `mail` | 2.5 | 2 | 1.5 | t1 | yes |
| `mail-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `mail-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `map-pin` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `map-pin-3` | 0.75 | — | — | t3 | **no** |
| `map-pin-4` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `megaphone` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `megaphone-2` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `megaphone-3` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `message` | 0.75 / 2.5 | 0.75 / 2 | 0.625 / 1.5 | t3+t1 | yes |
| `message-2` | 0.75 / 2.5 | 0.75 / 2 | 0.625 / 1.5 | t3+t1 | yes |
| `message-3` | 1.5 | 1.25 | 1 | t2 | yes |
| `message-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `message-5` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `message-6` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `message-7` | 0.75 / 4.5 | 0.75 / 3.25 | 0.625 / 2.625 | t3+4.5 | **no** |
| `package` | 2.5 + 4x sharp | 2 + 4x sharp | 1.5 + 4x sharp | t1+sharp | yes |
| `package-2` | 1.5 | 1.25 | 1 | t2 | yes |
| `package-3` | 1.5 | 1.25 | 1 | t2 | yes |
| `paintbrush` | 1.5 | 1.25 | 1 | t2 | yes |
| `pencil` | 0.75 / 1.5 + 2x sharp | 0.75 + 2x sharp | 0.625 / 1 + 2x sharp | t3+t2+sharp | **no** |
| `pencil-2` | 0.75 + 2x sharp | 0.75 + 2x sharp | 0.625 + 2x sharp | t3+sharp | yes |
| `pencil-3` | 0.75 / 1.5 + 2x sharp | 0.75 / 1.25 + 2x sharp | 0.625 / 1 + 2x sharp | t3+t2+sharp | yes |
| `pencil-4` | 0.75 / 1.5 + 2x sharp | 0.75 + 2x sharp | 0.625 / 1 + 2x sharp | t3+t2+sharp | **no** |
| `pin` | 1.5 | 1.25 | 1 | t2 | yes |
| `pin-2` | 1 | 1 | 0.75 | 1 | **no** |
| `pin-4` | 1 | 1 | 0.75 | 1 | **no** |
| `pin-5` | 1 | — | 0.75 | 1 | **no** |
| `pin-6` | 1.5 | 1.25 | 0.75 / 1 | t2 | **no** |
| `play` | 1.5 | 1.25 | 1 | t2 | yes |
| `play-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `play-3` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `plug-4` | 1.5 | 1.25 | 1 | t2 | yes |
| `plug-6` | — | 1.25 / 5.75 | 1 / 4.625 | - | **no** |
| `presentation` | 2.5 | 2 | 1.5 | t1 | yes |
| `presentation-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `puzzle` | 2.5 | 2 | 1.5 | t1 | yes |
| `puzzle-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `puzzle-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `puzzle-4` | 2.5 | 2 | 1.5 | t1 | yes |
| `puzzle-5` | 2.5 | — | — | t1 | **no** |
| `rotate-ccw-5` | 2.5 | 2 | 1.5 | t1 | yes |
| `save` | 2.5 + 2x sharp | 2 + 2x sharp | 1.5 + 2x sharp | t1+sharp | yes |
| `send` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `shield` | 0.8125 / 2.5 / 9 | 0.8125 / 2 / 6.5 | 0.625 / 1.5 / 5.5 | 0.8125+t1+9 | **no** |
| `shield-2` | 0.8125 / 9 | 0.8125 / 6.5 | 0.625 / 5.5 | 0.8125+9 | **no** |
| `sparkle` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `sparkle-2` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `sparkle-3` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `sparkle-4` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `star` | 0.75 | 0.75 | 0.625 | t3 | yes |
| `store` | 1.5 | 1.25 | — | t2 | **no** |
| `store-2` | 1.5 | 1.25 | — | t2 | **no** |
| `table` | 2.5 | 2 | 1.5 | t1 | yes |
| `table-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `thumbs-up` | 1.5 / 2.5 | 1.5 / 2 | 1.375 / 1.5 | t2+t1 | **no** |
| `thumbs-up-2` | 1.5 / 2.5 | 1.25 / 1.5 / 2 | 1 / 1.375 / 1.5 | t2+t1 | **no** |
| `trash` | 1.5 | 1.25 | 1 | t2 | yes |
| `volume-none` | 0.75 / 1.5 | 0.75 / 1.25 | 0.625 / 1 | t3+t2 | yes |
| `wallet` | 2.5 | 2 | 1.5 | t1 | yes |
| `wallet-2` | 2.5 | 2 | 1.5 | t1 | yes |
| `wallet-3` | 2.5 | 2 | 1.5 | t1 | yes |
| `wand` | 1 | 1 | 0.75 | 1 | **no** |
| `watch-2` | 2.5 | — | — | t1 | **no** |
| `watch-3` | 2.5 | — | — | t1 | **no** |
| `wrench` | 1.25 / 1.75 + 2x sharp | 1 / 1.5 + 2x sharp | 0.875 / 1.375 + 2x sharp | 1.25+1.75+sharp | **no** |
| `wrench-2` | 1.25 / 1.75 + 2x sharp | 1 / 1.5 + 2x sharp | 0.875 / 1.375 + 2x sharp | 1.25+1.75+sharp | **no** |
| `wrench-3` | — | 1 | 0.875 | - | **no** |

## 11. Judged list

Three kinds, kept apart. **S** = systemic, **O** = one-off.

### (1) A drawing disagrees with a stated rule

| # | Finding | Tag | Verdict |
|---|---|---|---|
| C-1 | **`alert-triangle` x4 at 16: the apex is r2, one step ABOVE tier 1.** `docs/01:320` — "do not use radius values between these". | **O** (4 names, one decision) | **Break right.** It bought half a pixel of "!" bar and stopped the glyph reading as a colon. The file argues it in full. The rule should admit a fourth value or say when a container may step out. |
| C-2 | **`pin-2` `pin-4` `pin-5` `wand` `wand-2` at r1 / 1 / 0.75**, and `wrench` x3 at 1.25 / 1 / 0.875 with a 1.75 neck. Off every tier, and the 24 value is held at 20. | **S** (7 concepts) | **Drift, not decision.** No file argues for 1. `pin` and `pin-6` use tier 2 for the same shoulder. Rounding 1 to 1.5 at 24 costs 0.5 px of edge; this is the one group where the eye should decide and then the whole family should follow. |
| ~~C-3~~ | ~~`pencil` `pencil-3` `pencil-4`: the filled body corner is tighter than outline + half the stroke~~ | — | **WITHDRAWN.** Caught by the fresh reviewer and confirmed from source: the filled 1.5 / 1.5 / 1.25 is the **tip** grown from 0.75 / 0.75 / 0.625, and the body's 2.25 / 2 / 1.625 is present and correct. See 7.2. |
| ~~C-4~~ | ~~`watch-3` at 24: the filled corner is a full 1.0 tighter than the relation~~ | — | **WITHDRAWN.** `24/watch-3-filled.svg` carries `A3.25` x4 on the case (= 2.5 + 0.75) and `A2.25` x4 on the straps (= 1.5 + 0.75). Consistent at all three masters. The earlier draft paired the case's outline radius with the strap's filled radius. See 7.2. |
| C-3a | **No reliable set-wide statistic exists for the filled-vs-outline corner relation**, and three plausible pairings each produce false positives — nearest-value, modal-per-style, and whole-file literal containment (7). The relation has to be adjudicated per corner, at the outer-edge position. | **S** (a method finding, not a drawing finding) | This is what produced the two withdrawn findings above. It also bears on card 1.8, which measures the same relation set-wide, and on any future lint check: a check built on `radiiOf`'s `container` role alone will flag `watch-3`, `pencil` and seven others that are correct. |
| C-5 | **12 files at 16 carry the 1.5-era outer corner 2.25 instead of 2.125** — independently reproduced by the fresh reviewer, which also found that the other 15 files carrying `A2.25` at 16 pair with an outline `r1.625` corner and are therefore correct — the `file`/`folder`/`calendar`/`credit-card` families. | **S** (12 files) | **On record and ruled: leave it** (`docs/09`, Maruti 2026-09-20). This audit's contribution is the exact population: 12, not "43 ... not all checked". |
| C-6 | **16 families use different radius values between numbered siblings**, and in four of them the *same object* takes a different tier: `play` (t3/t2/t1 across three variants), `message` (five answers in seven), `chart-bar` (t3 vs t1), `pin` (t2 vs r1). | **S** | A numbered variant is allowed to be a different drawing (C9). But a different *corner tier* on the same object is not a variant, it is an inconsistency — 1 px at 24 between `play` and `play-2`. Eye-only. |

### (2) A rule disagrees with another rule or the docs

| # | Finding | Tag |
|---|---|---|
| C-7 | **`docs/01:308-321` lists three radii — 2.5 / 1.5 / 0 — and names the second "Bend or secondary detail". C10 gives a bend half the weight: 0.75. So section 5 and C10 disagree about what a bend takes**, and the drawings follow C10 (681 of 1,094 bends sit exactly on `bendMin`; zero below it). The word "bend" in section 5 is simply wrong; the drawings' own comments call that value **"the detail radius"** (26 files at 24, always `1.5 · 1.25 · 1`). | **S** |
| C-8 | **Section 5 is missing a whole tier and is stated at 24 only.** The vocabulary in use is four values at each master — tier 1, tier 2, tier 3 (= `bendMin`), sharp — and 93.4-93.8% of container corners land on one of the three non-zero ones. Section 5 says "Radii at 20 and 16 are set per icon while drawing and recorded here once they settle." They settled: 2 / 1.25 / 0.75 and 1.5 / 1 / 0.625. Nothing records it. | **S** |
| C-9 | **The three tiers are locked to three different quantities** — tier 2 to the canvas (6.25% exactly, all masters), tier 3 to the stroke (0.5x, all masters), tier 1 to neither (10.4% to 9.4%, 1.67x to 1.2x). Three tiers, three derivations, no doc stating any of them. | **S** |
| C-10 | **`docs/01:320` "Do not use radius values between these. Three options is a system; seven is a mood."** The census finds 12 distinct snapped container values at 24 and 75 distinct typed `rx` values across all outline files. Most of the tail is body curves (4.1), which the rule never meant to cover — but the rule as written is broken by the set and by the set's own best drawings. | **S** |
| C-11 | **No rule governs a corner inside a corner**, and C22's trash counter ("inset 0.75 all round") is the only concentric statement in the repo. In the filled style 146 solid-plus-hole pairs in 37 concepts take 15 different solid-minus-hole differences. | **S** |
| C-12 | **Lint cannot see most of this.** `tools/lint.mjs:364-376` reads the typed `rx` on stroked paths as a lower bound only, and it is a **warning**. It has no upper bound, no vocabulary, no cross-master check, and it strips area paths before the loop, so it is blind to 5,512 of 10,965 corners including every filled outer contour. | **S** |

### (3) Fine by every rule and still worth the eye

| # | Finding | Tag |
|---|---|---|
| C-13 | **`rotate-ccw-9` at 16 drops from tier 1 to tier 2 and the file says "Maruti to confirm".** It is the only unresolved radius question written into a shipped drawing. Its reason — *"container radius 1.5 on a square this small read as a circle"* — is a general claim about small containers at 16, not about one icon. If it is right, it is a rule: *below some side length, a container takes the detail radius*. The square is 4.25 units wide at 16. | **O** now, **S** if confirmed |
| C-14 | **At 16 one tier step is half a pixel.** The three-tier spread at 16 is 0.875 px of tangent and 0.36 px of arc depth. Whether the set needs three container radii at 16 at all is an eye question, and the answer changes what `rotate-ccw-9` means. | **S** |
| C-15 | **Six concepts gain radii at 16 that 24 does not have** — `camera-3`, `camera-4`, `clipboard-2`, and `cart`/`cart-3`/`cart-4`/`cart-5` (which gain at 20 too). Detail appearing at the smallest master is the opposite of what F11 expects. | **S** |
| C-16 | **`thumbs-up`'s tip radius is held nearly constant across masters (1.5 / 1.5 / 1.375)** because what it controls is the 1.5 gap floor inside the thumb, not a proportion. This is a *gap* rule wearing a radius, and it is the cleanest example in the set of a radius derived from section 6 rather than from section 5. If it generalises, it is a rule. | **O** now |
| C-17 | **`paintbrush` x5 at 24 and 20 have fillets whose two tangent lengths differ by up to 5.6 units on an r3.75 corner.** Geometrically these are brush bellies, not corners. Flagged so the next reader does not take the number for a radius. | **O** |

---

## 11a. What this card feeds into the container-radius ruling

`docs/09-rule-audit.md` section 6 lists **container radius** as one of six rulings waiting on
Maruti, and section 4 names it one of the five missing rules that "decide whether icon 300 looks
like icon 30". This card's contribution is that **the rule already exists in the drawings** and the
ruling is narrower than it looked.

**Recommendation, in one sentence each.**

1. **Write down the three tiers.** They are in use, they hold on 93.4-93.8% of container corners,
   and the drawings' own comments already name two of them. `docs/01-foundations.md` section 5
   should state four values per master — card 2.5 · object 1.5 · tip 0.75 (= `bendMin`) · sharp 0,
   with the 20 and 16 columns filled in — and should stop calling tier 2 a "bend", which collides
   with C10.
2. **State what each tier is for, not just its number.** The jobs in 3.2 are readable off the set
   without ambiguity, and a rule with a job attached is one a drawer can apply to icon 300.
3. **Leave tier 1 at 2.5 unless the wall says otherwise.** It is 1.67x the stroke at 24 against the
   references' 1.0x, which is a real difference and a deliberate one, and 89 concepts depend on it.
   But note in the parameter map (card 3.3) that tier 1 is the only tier locked to nothing — if it
   ever moves, 2 and 1.5 do not follow from it by any stated arithmetic.
4. **Rule on `rotate-ccw-9` and make the answer general.** It is the one shipped drawing carrying
   an unresolved radius question, and its reason is a claim about every small container at 16, not
   about one icon. Settle "below what side length does a container take the detail radius" and the
   finding becomes a rule.
5. **Decide the `pin` / `wand` / `wrench` group together** (7 concepts at r1 / 1 / 0.75), and then
   make the whole family follow. One board, three masters.
6. **Do not reopen tier 3.** It is `bendMin`, it is obeyed on 1,094 of 1,094 mark bends, and 681 of
   them sit exactly on it. Changing it changes C10.

## 12. What only Maruti's eye can settle, and where

| Question | Surface |
|---|---|
| **Is tier 1 right at 2.5?** Ours is 1.67x the stroke at 24 against the references' 1.0x. Tier 2 *is* their number. | A wall of the 89 tier-1 concepts at 24 and at real 16px, beside the same drawings at tier 2 — one variable per board. |
| **Does a container radius survive at 16 at all,** given half a pixel per step? And is `rotate-ccw-9` right that a small square must drop a tier? | `lab/audit-wall.html` (card 4.1) at real 16px, plus a side-by-side of `rotate-ccw-9` at tier 1 and tier 2. |
| **`play` / `play-2` / `play-3` at three different tiers; `message` at five.** Variant, or inconsistency? | A primitive sheet (card 4.2) with every triangle and every bubble overlaid. |
| **Should `pin-2/-4/-5` and `wand` move to a tier?** | The `pin` family in one row at three masters. |
| **Is `alert-triangle`'s r2 apex at 16 a one-off, or the start of "an acute container corner takes one step more"?** The only other acute containers are `home`'s roof and the triangles. | The four `alert-triangle`s beside `home` at 16. |
| **Does the `checkbox` hole-at-1.5 rule hold at 16,** where it is 71% of the solid's corner against 46% at 24? | Belongs to card 1.8; noted here because it is the one nested-radius regularity in the set. |

---

## 13. Numbers this card could not measure

- **[needs measuring]** — whether any of the 4.2 drift cases (`pin-2`, `wand`, `wrench`) would look
  better on a tier. That is a drawing question, not a measurement; it needs a board.
- **[needs measuring]** — the reference radii as a share of canvas and as a multiple of their own
  stroke, from their own files. The brief supplies IBM / Salesforce / Material at radius = stroke;
  that enters the register only when wave 2 confirms it from source
  (`plans/set-and-rules-audit.md`, transfer test point 4).
- **Not measured here by design:** the knockout weight, the cut-mouth easing vocabulary
  (0.5 x 613, 0.75 x 306, 0.25 x 121 across the three masters), and the `checkbox` hole relation.
  Card 1.8 owns the filled style; this card hands those three over with the counts above.
