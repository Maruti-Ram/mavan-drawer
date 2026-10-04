# Findings — modifier grammar and objects

Audit card **1.9** (`plans/set-and-rules-audit.md:430`). Axes **F5** (a grammar for combination) and
**F3** (the armature — the same object recurring as one drawing). Two scales of one question: *is a
shared thing drawn once?* — at the scale of the assembly (a base plus a modifier) and at the scale
of the object (a door, a page, a star, a dot).

**Pinned tree: `5933041`.** Measured from the working tree: `git status --short src/icons` was empty
and `git diff --quiet 5933041 HEAD -- src/icons` true before the first measurement and after the last.
`node tools/lint.mjs` at the end: **2,910 drawings · 2,848 clean · 62 warned · 0 failed** — the
baseline. Nothing in `src/icons/`, `tools/`, `lab/`, `research/`, docs 01–09, `CLAUDE.md` or the
plan was touched; this file is the only write.

**Independently checked.** A fresh reviewer (Fable) who had not seen my scripts re-measured 62 claims
with its own (`scratchpad/review-1.9/`): 44 held, 16 were wrong, 2 were unsupported. What held: the
through kind's air and stand-offs, the `volume` marks, the sort family, `wand`, `code`, `ban`, the
enclosure table, the door, star, check, knob and hook breaks, the speaker, the pencil strings, §2.2
and §2.6 entirely, the family census and most citations. What was wrong is corrected in this
version: a beside count of 24 for 25 (and every total built on it), a through-kind summary that
rounded 1.505 and 1.578 into "1.5 in 14 of 18", cursor and ray sizes given from centrelines rather
than ink, a diagonal shaft given by its x-extent, a shared-part count of six where the table had
eight (nine now, with the landscape container), the microphone's near-shared part called a capsule
when it is the cradle, two citation slips (card 1.1's square count, card 1.4's population), two
sheet counts, and an uncited claim about Lucide and Tabler. The claim that `volume-off`'s 1.25
channel is declared is withdrawn to §6; P1 and P2 are rescoped to what one family can support. I
dispute none of its corrections; every number it questioned was re-measured before it was changed.

**The headline, in plain words.** The set has **no corner badge at all** — not one icon puts a small
plus, check or clock on the corner of an object — so the badge grammar `docs/05-modifiers.md`
prescribes has never been drawn, and its numbers are for a stroke the project abandoned. What the
set *does* have is **78 composites of four other kinds**: a mark standing *beside* an object (25),
an arrow or tool passing *through* an open or cut object (18), a bar *struck* across an object (4),
and a mark *inside* a container (31 of the 121 containers). Those were measured one by one. The
through kind follows one unwritten rule to the thousandth — **1.5 of air where the modifier meets
the base, at every master**: exactly 1.500 in seven of eighteen, 1.505 · 1.505 · 1.578 in six more,
the rest standing off by design — and the beside kind follows none. At the object scale, the clean
primitives card 1.1 found (ring, square, page, arrowhead) stay clean; the new finding is a class of
**shared parts that are one drawing at one master and two at another** — the door in `home`,
`store` and `building`, the star in `sparkle` and `wand`, the knob in `sliders`, the hook in
`cart` — with no rule anywhere that says a shared part must stay shared.

---

## 0. Method, and how to read a number

**Unit and measure** as in `docs/audit/findings-primitives.md` §0: the **subpath** is the unit; every
size is the **outer ink edge** (centreline ± half that file's own stroke, or the shape edge of an
area path); a congruence figure is a **residual** (best-fit offset first), not a difference. The
stroke a file's lines carry follows `tools/lint.mjs:206-211` exactly: a file with an area path keeps
the master's outline stroke, any other `-filled` file carries `FILLED_WEIGHT`.

| master | 1 unit at a 16 px render |
|---|---|
| 24 | 0.667 px |
| 20 | 0.800 px |
| 16 | 1.000 px |

**Air.** The tightest ink-edge to ink-edge distance between two groups of paths in one file —
the centreline-to-centreline minimum minus the stroke — built the way `lint.mjs` `polyGap` builds it
(samples every 0.25 along straights and every degree along arcs, segments only between neighbouring
samples). **Negative air is overlap**; −1.5 at 24 means one path's centreline lies on the other's.
Against a filled solid the figure is the stroke's edge to the solid's edge (half a stroke subtracted).

**Where the modifier sits.** Its ink-box centre as an offset from the canvas centre (`dx, dy`), and
**to bound**: how far its nearest edge stays inside the drawing bound (`tools/masters.mjs` `bound`:
2→22 · 2→18 · 1→15). Zero means an edge sits *on* the bound; negative would mean it crosses — the
thing `docs/01:66-70` allows modifier badges alone to do.

**What a composite is, and how the list was derived.** From names *and* from geometry. Geometry
first: every outline subpath at each master was put through `congruence.mjs` `classify` (translation
mode, tolerance 0.01), and every class spanning two or more **families** (a family is the object
stem: `login`, `sort-alpha`, `volume`, `users`…) was listed. Straight lines and bare circles are
*trivial* — any two lines of one length match — so they are counted, not read. **26 concepts outside
the mark families carry a non-trivial part of a mark family exactly** (an arrowhead, a chevron, a
star): `chevrons-up-down` ×4, `code-2`, `export`, `external-link` ×2, `login` ×4, `logout` ×4,
`maximize-4`, `refresh-3`, `sort`, `sort-2`, `sort-ascending`, `sort-descending`, `upload` ×3,
`wand`. That is the geometry-derived core (`refresh-3` is in it because its head is `arrow-up-right`'s at
24, but a circular arrow — an arc with a head — is one object, not a base plus a modifier, so it is
placed in no kind; its head returns in §2.3 and §2.4). Names add the composites whose mark is made of lines
(`volume-plus/-minus/-x`, `ban` ×3, `volume-off`, `cursor-click`), whose mark is a drawing of its
own (`menu-arrow-*`, `code`, `sort-3`, the twelve `sort-alpha/numeric-*`), or whose "modifier" is a
tool (`compose` ×4). Four kinds, with their populations:

| kind | what it is | concepts | drawings |
|---|---|---|---|
| **beside** | a mark stands next to the object at full size; nothing overlaps | 25 | 150 |
| **through** | an arrow or a pencil crosses the object's edge; the object is open or cut where it passes | 18 | 108 |
| **strike** | the C21 bar across the object | 4 | 24 |
| **enclosure** | a mark inside a container (cards 1.1 §3 and 1.4 §4 own the inset; sizes repeated here so the table is complete) | 31 | 186 |
| **corner badge** | a small glyph on the corner of an object — `docs/05`'s whole subject | **0** | **0** |

Eight more concepts are two marks sharing one canvas with no base (`sort`, `sort-2`, `code-2`,
`maximize-4`, `chevrons-up-down` ×4); they are listed where the parts are identified and not
measured as composites. Instruments: `tools/audit/congruence.mjs` (`canonical`,
`congruentUpToTranslation`, `congruentUpToScale`, `scaleTrivial`, `classify`, `subpathsOfPath`) and
`tools/geometry.mjs` (`parsePath`, `samplePath`, `bbox`, `isDot`), imported read-only. A mirror test
flips a path about the canvas centre and asks again (`congruence.mjs` is mirror-sensitive by
design). **One instrument caveat.** `congruentUpToTranslation` reports *different segment structure*
for the same closed rounded square traversed the other way (`checkbox` against `layout-sidebar-right`
at 24: residual ∞; `canonical().shape` calls them identical, and so does `classify`; re-emitted through
`canonical().d` first, the same compare returns 0). Every exact and mirror count in this document
uses canonical shapes, as `classify` does. The one column that used the raw compare — the `near`
column of §2.4's 127 pairs — was re-run on canonical `d` and had missed nothing (0 of the 694
non-trivial parts without an exact twin gained a near match). Scratch scripts and their outputs live in the session scratchpad under `1.9/` (`lib.mjs`,
`composites.mjs` → `partA.md` / `partB.md`, `objects.mjs` → `objects-*.md`, four probes); none is in
the repo.

---

## 1. F5 — the modifier grammar as drawn

### 1.1 Beside — a mark next to the object (25 concepts)

Sizes are outer ink, **24 · 20 · 16**. "Share" is the modifier's long side over the base's long side
at 24. Air is modifier-to-base, outline; "filled air" is the same in the filled twin (a line-heavy
twin at 2.5 · 2 · 2, or a line modifier against a solid base).

| concept | modifier, and what it is | modifier ink w × h | share | centre dx, dy @24 | to bound | air (px@16) | filled air | what the base loses |
|---|---|---|---|---|---|---|---|---|
| `volume-plus` | a plus of two 6.5 · 4.5 · 3.75 lines — **a plus size that exists nowhere else** (§1.8) | 8×8 · 6×6 · 5×5 | 0.50 | +6, 0 | **0 · 0 · 0** (right edge on the bound) | **2 · 2 · 2** (1.33 · 1.6 · 2) | 2 · 2 · 2 | the two waves (C28 level) |
| `volume-minus` | the plus's bar | 8×1.5 · 6×1.5 · 5×1.25 | 0.50 | +6, 0 | 0 · 0 · 0 | 2 · 2 · 2 | 2 · 2 · 2 | the waves |
| `volume-x` | `x-circle-small`'s x exactly (card 1.1 §2.5) | 8×8 · 6×6 · 5×5 | 0.50 | +6, 0 | 0 · 0 · 0 | 2 · 2 · 2 | 2 · 2 · 2 | the waves |
| `menu-arrow-left` / `-right` | a chevron drawn for this icon only (leg 2.871 at 24, card 1.1 §2.7; no chevron in the set has it) | 3.75×6.62 · 3.25×5.62 · 3×5.12 | 0.63 | ∓5.62, 0 | 2.5 · 1.25 · 1 | 2.28 · 2.35 · 2.11 (1.52 · 1.88 · 2.11) | 2.1 · 2.1 · 1.77 | the menu lines shortened **15 → 9.5 · 13.5 → 8.5 · 12 → 7.5** (37%) |
| `sort-ascending` | `arrow-up`, head and shaft exactly | 10×15 · 9×13.5 · 8×12 | 1.43 | +2.5, 0 | 2.5 · 1.25 · 1 | 1.96 · 1.75 · 1.71 | 1.5 · 1.5 · 1.5 | nothing (three lines, ragged) |
| `sort-descending` | `arrow-down` exactly | 10×15 · 9×13.5 · 8×12 | 1.43 | +2.5, 0 | 2.5 · 1.25 · 1 | 1.76 · 1.51 · 1.52 | 1.5 · 1.5 · 1.5 | nothing |
| `sort-3` | two chevrons of the **narrow head** (leg 3.847; = the `sort-alpha/numeric` arrowhead, §1.8) | 8×11.52 · 7×11.02 · 6×9 | 1.10 | +5, 0 | 1 · 0 · 0 | 2.14 · 2.29 · 2.0 | 2.25 · 2.34 · 2.08 | nothing |
| `sort-alpha-ascending` / `-descending` | an arrow with the **narrow head 8 · 7 · 6 wide** beside an A and a Z | 8×15 · 7×13.5 · 6×12 | 1.00 | +5, 0 | 1 · 0 · 0 | 3.99 / 4.22 · 3.44 / 3.58 · 3.38 / 3.48 | 4 / 4.22 · 3.44 / 3.58 · 3.38 / 3.48 | nothing |
| `sort-numeric-ascending` / `-descending` | the same narrow arrow beside a 0 and a 9 | 8×15 · 7×13.5 · 6×12 | 1.00 | +5, 0 | 1 · 0 · 0 | 4.5 · 4 · 3.75 | n/a — the 9's tail is a line touching its own solid bowl | nothing |
| `sort-alpha-*-2` / `-3` (4) | the letters themselves beside three ragged lines (no arrow) | 6.5×15 · 6×13.5 · 5.25×12 | 1.43 | ±5.75, 0 | 1 · 0 · 0 | 3.53 / 3.24 / 3.53 / 3.51 (asc-2 / asc-3 / desc-2 / desc-3) · 2.77 · 2.72 / 2.51 / 2.72 / 2.51 | same | nothing |
| `sort-numeric-*-2` / `-3` (4) | the numerals beside three lines | 5.5×15 · 5×13.5 · 4.25×12 | 1.43 | ±6.25, 0 | 1 · 0 · 0 | 4.16 / 4.0 / 4.04 / 4.0 · 3.74 / 3.5 / 3.51 / 3.5 · 3.34 / 3.25 / 3.3 / 3.25 | n/a | nothing |
| `wand` | `sparkle-2`'s star at 24, `sparkle-3`'s at 20, its own at 16 (§2.3) plus the r0.5 glyph dot | star 7 · 5.5 · 4.5; group 16.25×9.75 · 14×9.75 · 12×8.38 | 0.90 | +0.88, −4.12 | 1 · 1 · 1 | 1.6 · 1.6 · 1.51 | star is a cut (card 1.8) | nothing (the rod is its own object) |
| `wand-2` | a solid five-point star with a r0.75 dot hole — its own drawing | 7.68×7.38 · 6.26×6.02 · 5.29×5.09 | 0.78 | +5.03, −5.34 | 0.97 · 0.94 · 1.05 | 3 · 2.51 · 2.25 | cut | nothing |
| `wand-3` | the same star | 7.68×7.38 · 6.26×6.02 · 5.29×5.09 | 0.83 | +4.93, −5.24 | 1.07 · 1.04 · 1.01 | 3.01 · 2.51 · 2.25 | 3.01 · 2.51 · 2.25 | nothing |
| `cursor-click` | three rays, each 2.5 · 2 · 1.5 long, around a cursor that is **its own drawing** (12.25 · 8.76 · 7.5 ink against `cursor`'s 18 · 14 · 12, and not a resize of it: `congruentUpToScale` finds no match) | 8×8 · 7.5×7.5 · 6.38×6.38 | 0.65 | −5, −5 | 1 · 1 · 1 | 1.76 · 1.75 · 1.75 | 1.75 · 1.75 · 1.75 | the cursor is redrawn smaller |
| `code` | two chevrons of their own (leg 4.554 at 24, card 1.1 §2.7) either side of the C30 slash | pair 17.88×9 · 13.88×6 · 11.98×5 | 0.99 | 0, 0 | 1.06 · 1.06 · 1.01 | 1.96 · 1.86 · 1.8 | 1.77 · 1.76 · 1.64 | nothing |

Three readings:

- **Where the mark sits is decided by the object, not by a zone.** The `volume` marks are centred
  on the speaker's mid-height and their right edge sits exactly on the drawing bound (to bound 0 at
  all three masters); the `menu-arrow` chevron sits in the column the shortened lines free; the
  `sort` arrows take the right half of a box the glyphs take the left half of. **Not one modifier in
  the set sits in a corner, and not one crosses the bound** — the margin `docs/01:68-70` reserves for
  badges has never been spent (the smallest "to bound" in all 47 beside/through/strike composites is
  0, never negative).
- **The air beside has no value.** At 24 it runs **1.6, 1.76, 1.96, 2, 2.14, 2.28, 3, 3.99, 4.22,
  4.5** across the kind (3.24–4.16 in the glyph-beside-lines rows). The two places it was *chosen* rather than left over — `volume-*` (its note:
  "2 · 2 · 2 clear of the speaker (floor 1.5)") and `menu-arrow-*` ("≥ 1.5 gap") — land at 2 and
  2.28. The sort family's 3.4–4.5 is a box split in two, not a clearance. **No rule says what air a
  mark beside an object takes** (kind 3).
- **The mark beside an object is sized to the object.** `volume-x`'s × is half the speaker's height
  (8 of 16 · 6 of 12 · 5 of 10 — exactly 0.5 at every master, the note's own rule), which happens to
  be `x-circle-small`'s x; the plus and minus take the same footprint, so `volume-plus` is a plus
  that exists nowhere else in the set (§1.8). The sort arrows are the full free arrow (15 · 13.5 ·
  12) with a narrower head. **Nothing says whether a mark beside an object should be one of the
  mark's shipped sizes or a fraction of the object** (kind 3).

### 1.2 Through — an arrow or a tool crossing the object (18 concepts)

"Opening" is the gap in the base's own line that the modifier passes through, measured end to end
of the open base path minus the stroke — for a bracket it is the whole mouth, for a cut edge it is
the notch.

| concept | base, ink | modifier, and what it is | modifier ink | share | air (px@16) | filled air | opening | what the base loses |
|---|---|---|---|---|---|---|---|---|
| `login`, `logout`, `login-3`, `logout-3` | a bracket door 6×18 · 4.5×14 · 4×12, returns 6 · 4.5 · 4 deep | `arrow-right` / `arrow-left`, head and shaft exactly | 15×10 · 11×9 · 9.25×8 — **full length at 24, 2.5 · 2.75 shorter than the free arrow at 20 · 16** | 0.83 · 0.79 · 0.77 | **1.5 · 1.5 · 1.5** (1 · 1.2 · 1.5) | 1.5 · 1.5 · 1.5 | the whole mouth 15 · 11 · 9.5 | nothing — the door is drawn open |
| `login-2`, `logout-2`, `login-4`, `logout-4` | door 8×18 · 6×14 · 5×12, returns 8 · 6 · 5 | the same heads | 10×10 · 8×9 · 7×8 | 0.56 · 0.64 · 0.67 | 5.18 / 5.76 · 3.76 / 3.7 · 3.28 / 3.05 | 4.38 / 5.36 · 3.37 / 3.51 · 2.66 / 2.84 | 15 · 11 · 9.5 | nothing; the arrow stops at the mouth |
| `upload`, `upload-3` | a tray 18×6 · 14×4.5 · 12×4 (`-3`: 18×8 · 14×6 · 12×5) — `login`'s bracket turned upright (same 18 width, 6 · 4.5 · 4 returns, 2.5 · 2 · 1.5 corners) | `arrow-up` exactly | 10×15 · 9×11 · 8×9.25 | 0.83 · 0.79 · 0.77 | **1.5 · 1.5 · 1.5** | 1.5 · 1.5 · 1.5 | 15 · 11 · 9.5 | nothing |
| `upload-2` | the same tray | `arrow-up`, shorter | 10×12 · 9×9.5 · 8×8 | 0.67 | 4.5 · 3 · 2.75 | 3.5 · 2.5 · 2 | 15 · 11 · 9.5 | nothing; the arrow stands on the rim |
| `export` | a closed card 18×9 · 14×7 · 12×6 | `arrow-up`'s head, shaft 13.25 · 9.25 · 7.63 | 10×14.75 · 9×10.75 · 8×8.88 | 0.82 · 0.77 · 0.74 | **1.5 · 1.5 · 1.5** | 1.51 · 1.51 · 1.56 (a slot in the solid) | **a notch 4.5 · 4.5 · 4.25 cut in the top edge** = 1.5 air + the shaft (1.5 · 1.5 · 1.25) + 1.5 air | 4.5 · 4.5 · 4.25 of its top line |
| `external-link` | a box **15×15 · 11×11 · 9×9 — 3 under the square keyline — pushed to the bottom-left** | `arrow-up-right`'s head exactly, shaft 13.48 · 9.24 · 8.40 along the diagonal (the free arrow's shaft is 15.95 · 13.83 · 12.12) | 11.25 · 8.25 · 7.38 square | 0.75 · 0.75 · 0.82 | **1.51 · 1.51 · 1.58** | 1.51 · 1.51 · 1.58 | **the top-right corner, 4.51 · 4.51 · 4.41 across** | its corner, and 3 of size |
| `external-link-2` | box 14 · 10 · 8, 4 under | the same head; shaft 13.83 at 24 (0.35 longer than `external-link`'s), 9.24 · 8.40 at 20 and 16 (the same) | 11.5 · 8.25 · 7.38 | 0.82 · 0.83 · 0.92 | 1.51 · 1.51 · 1.58 | 1.51 · 1.51 · 1.58 | 4.51 · 4.51 · 4.41 | its corner, and 4 of size |
| `compose` | box **16 · 12 · 10, 2 under, bottom-left** | `pencil-4`'s pencil: the tip and band are **the same coordinate string in `pencil`, `pencil-4`, `compose`, `compose-2`, `compose-3` at all three masters** (`grep`; 24: `16.81 4.19A1.5 1.5 0 0 1 18.93 4.19L19.81 5.07…`; 20: `…15.4 4.12L15.88 4.6…`; 16: `…12.496 2.918L13.082 3.504…`); the body slid up the axis and shortened (its note: 6.36 · 4.95 · 4.24; not re-measured) | 13.5 · 10.5 · 9 | 0.84 · 0.87 · 0.90 | **1.51 · 1.51 · 1.58** | the pencil is a solid in a channel cut 1.5 round it (card 1.8) | **the corner, 8.75 · 7.69 · 7.24 across** = pencil ink 5.74 · 4.68 · 4.08 + 2 × 1.51 / 1.58 | its corner, 2 of size, and the pencil's baseline |
| `compose-2`, `-3`, `-4` | box 18 · 14 · 12 (the full square) | `pencil-4`'s (-2), `pencil`'s (-3), `pencil-2`'s (-4) tip and band, string-identical as above | 13 · 10 · 8.5 | 0.72 · 0.71 · 0.71 | 1.51 · 1.51 · 1.58 | channel | 8.75 · 7.69 · 7.24 | its corner, the pencil's baseline |

**The through kind has one rule and keeps it.** Where the modifier meets the base — the arrow's
apex to the door's far wall, the arrow's tail above the tray's floor, the shaft through the card's
notch, the pencil through the box's corner — the air is **exactly 1.500 · 1.500 · 1.500 in seven**
(`login`, `logout`, `login-3`, `logout-3`, `upload`, `upload-3`, `export`), **1.505 · 1.505 · 1.578 in
six** (`external-link` ×2, `compose` ×4 — their notes say 1.51 and 1.58), and the other five stand
off by design (the `-2`/`-4` doors, `upload-2`). It is `MIN_GAP` as a literal, held at 16 where the line
is 1.25 — the same decision `CLAUDE.md`'s "min gap is a literal 1.5" makes for lines, applied to an
assembly, **and written nowhere as an assembly rule** (kind 3; `docs/05:57` says "1.5 units (one
stroke)", which was true at stroke 1.5 and is not at 16).

**The base is cut back by hand where it must be, and shrunk and cornered where the arrow needs
room.** `export` loses 4.5 of its top line; `external-link` and `compose` lose a corner. That is
`docs/05 §3`'s strategy **A** (hand redraw). But `external-link` draws its box 15 · 11 · 9 inside an 18
· 14 · 12 keyline and pushes it to the bottom-left, `compose` 16 · 12 · 10 — which is `docs/05 §3`'s
strategy **C, "shrink the base and corner it", written there as "rejected outright"**. The doc was
written for corner badges and the arrow here is not one; whether an arrow-through may shrink its
base is a question the rule does not answer (kind 2 against doc 05 as written, 3 concepts).

**The arrow inside a composite is "as long as the box leaves", not a size.** Arrows in composites
come in four straight lengths at 24 — 15 (door, tray, sort), 14.75 (export), 12 (upload-2), 10 (deep
door) — plus two diagonal arrows whose shafts run 13.48 (`external-link`) and 13.83 (`external-link-2`)
against the free `arrow-up-right`'s 15.95 — and the door arrow that is the free arrow's full 15 at 24 is 9.25
at 16, 0.77 of `arrow-right` (its note says so: "the wall and its 1.5 of air take 2.75 of the box").
No rule covers an arrow's length inside an object (kind 3, 18 concepts).

### 1.3 Strike — the C21 bar (4 concepts)

| concept | base | bar, ink square (centreline length) | to bound | air to base | filled | what the base loses |
|---|---|---|---|---|---|---|
| `ban`, `ban-2` | the ring 20 · 16 · 14 | 14.58 · 11.76 · 10.26 (18.5 · 14.51 · 12.74 — rim to rim on the ring's centreline, card 1.1 §2.5) | 2.71 · 2.12 · 1.87 | **−1.5 · −1.5 · −1.25**: the bar's cap centre sits on the ring's centreline (contact, F9) | `ban` thickens both to 2.5 · 2 · 2 (air −2.5 · −2 · −2); `ban-2` cuts the bar 2 · 1.75 · 1.75 wide, stopping 1.5 inside the rim (C21) | nothing — the ring is whole |
| `ban-3` | the ring | 9.98 · 7.34 · 5.92 (11.99 · 8.26 · 6.6) | 5.01 · 4.33 · 4.04 | 1.75 · 1.62 · 1.82 | cut | nothing; the bar is inset like a mark |
| `volume-off` | `volume`'s speaker **moved 5 · 4 · 3 right, residual 0** | 18 · 14 · 12 — the square keyline (23.33 · 17.68 · 15.2) | 1 · 1 · 0.5 | **−1.5 · −1.5 · −1.25**: the bar crosses the speaker | the bar is knocked out of the solid at its own width 1.5 · 1.5 · 1.25 and the bar outside ends where its centreline meets the edge (air **0.01**: touching) | nothing in outline; a 1.5 · 1.5 · 1.25 channel in the filled solid — the file's `gap:` note (0.7 · 0.75 · 0.375) covers the bar stub's junction with the solid, not this channel (§6) |

The direction is `\` in all four (C21). `docs/05:69-77` still prescribes `M4 4l16 16` — the same
direction — with "its own 2-unit clearance channel"; the drawn channels are 2 · 1.75 · 1.75
(`ban-2`'s cut, C18's medium cut) and 1.5 · 1.5 · 1.25 (`volume-off`). The doc's 2 was one stroke
at stroke 2; nothing drawn uses it (kind 2, rule-register H6).

**`volume-off` is not centred at 16.** Its ink runs x 1.5 → 13.5 (centre 7.5 against the canvas's 8),
0.5 to the left; at 24 and 20 it sits on the centre. C28 says a state *"is centred as its own icon"*;
the file's prose explains the choice (a 7-wide speaker put on whole pixels rather than centred on
half ones), no note declares it, and lint's ±0.5 centring tolerance passes it (kind 1, explained in
prose only; handed to card 1.13).

### 1.4 Enclosure — a mark inside a container (31 concepts; cards 1.1 §3 and 1.4 §4 own the judgement)

Mark ink w × h and its air to the container, 24 · 20 · 16. In every filled twin the mark is a cut
(card 1.8 §4.3 has the cut widths). `checkbox` is the one container whose mark is another
container's mark: its check is `check-circle`'s path at 24 and 20 and 0.106 off it at 16 (card 1.1
§3.3; here 6.5 wide against 6.58).

| concept | mark w × h | air to container |
|---|---|---|
| `checkbox` | 10.28×7.24 · 7.8×5.54 · 6.5×4.61 | 2.36 · 1.6 · 1.5 |
| `checkbox-2` | 9.76×7.9 · 7.44×6.05 · 6.5×5.23 | 2.62 · 1.78 · 1.5 |
| `checkbox-3` | 9.62×8.12 · 7.32×6.22 · 6.5×5.45 | 2.69 · 1.84 · 1.5 |
| `checkbox-4` | 8.6×6.09 · 6.58×4.69 · 5.7×4.08 | 3.2 · 2.21 · 1.9 |
| `alert-triangle` | 2.5×11.5 · 2×7.75 · 2×6.38 — the bar **8 · 4.75 · 3.375 against `alert-circle`'s 8 · 6 · 4.5**: the glyph is cut back 1.25 · 1.125 at 20 and 16 to clear the sloping sides (its note) | 1.5 · 1.5 · 1.5 |
| `alert-triangle-2` | 2.5×11.5 · 2×7.25 · 2×6.38 | 1.5 · 1.5 · **1.28** (agreed, `docs/07:79`) |
| `alert-triangle-3` | 3.5×11.5 · 3×7.75 · 3×6.38 | 1.5 · 1.5 · 1.5 |
| `alert-triangle-4` | 3.5×11.5 · 3×7.25 · 3×6.38 | 1.5 · 1.5 · **1.28** (agreed) |
| `alert-circle` / `-2` | 2.5×11.5 · 2×9 · 2×7.5 | 2.75 / 2.72 · 2 / 1.99 · 2 / 1.98 |
| `alert-circle-3` / `-4` | 3.5×11.5 · 3×9 · 3×7.38 / 3×7.5 | 2.65 · 1.93 · 2 / 1.88 |
| `help` / `-2` / `-3` / `-4` | 7.49×12 · 5.97×10 · 4.82×8 / 6.5×12 · 5.49×10 · 4.82×8 / 6.96×12.01 · 5.93×10.01 · 4.02×7.83 / 7×12 · 5.5×9.5 · 5×7.5 | 2.5 · 1.5 · 1.75 / same / 2.49 · 1.49 · 1.76 / 2.3 · 1.65 · 1.7 |
| `info` / `-2` / `-3` | 2.5×11.5 · 2×9 · 2×7.5 / 4×11.5 · 3.5×9 · 3.5×7.5 / 5×11.5 · 4.5×9 · 4×7.5 | 2.75 · 2 · 2 / 2.74 · 1.98 · 1.98 / 2.39 · 1.72 · 1.75 |
| `plus-circle` / `-small`, `minus-circle` / `-small` | 10.5 · 8 · 6.5 / 9 · 7 · 5.5 wide | 3.25 · 2.5 · 2.5 / 4 · 3 · 3 |
| `x-circle` / `-small` | 9 · 6.5 · 5.5 / 8 · 6 · 5 | 2.45 · 2.21 · 2.12 / 3.15 · 2.57 · 2.47 |
| `check-circle` / `-small` | 10.28×7.24 · 7.8×5.54 · 6.58×4.69 / 8.6×6.09 · 6.58×4.69 · 5.7×4.08 | 2.5 · 2.01 · 1.96 / 3.53 · 2.75 · 2.49 |
| `check-circle-3` / `-3-small` | 9.76×7.9 · 7.44×6.05 · 6.22×5.1 / 8.24×6.65 · 6.26×5.05 · 5.5×4.48 | 2.53 · 2.01 · 1.98 / 3.51 · 2.78 · 2.46 |
| `check-circle-4` / `-4-small` | 9.62×8.12 · 7.32×6.22 · 6.22×5.17 / 8.1×6.8 · 6.18×5.24 · 5.44×4.5 | 2.51 · 2 · 1.96 / 3.52 · 2.75 · 2.47 |

Card 1.4 §4 counts 121 containers and measured the inset over the 66 with a non-zero inset at all
three masters (median 4.00 · 3.25 · 3.00, 14% more than
proportional at 16, "taste, not clearance") and card 1.1 §3.2 the mark-to-free-mark ratio (0.70 →
0.54 for the plus). Nothing here changes either; the figures above are the per-icon rows behind
them.

### 1.5 Corner badge — zero, and what is waiting on it

**No concept in the 485 puts a glyph on the corner of an object.** By *construction* the nearest
things to `docs/05`'s badge are `compose` ×4 and `external-link` ×2: a mark over the top-right corner
with the base cut back 1.5 around it (§1.2). They are classed *through*, not *badge*, on two counts:
the modifier enters the base's interior — the pencil's point and the arrow's tail lie inside the
box, where a badge sits wholly outside the base's silhouette and overlaps only its corner — and it is
11.25–13.5 at 24, 72–84% of its base, where `docs/05`'s glyph is 8. By *size and placement* the
nearest things are the `volume` marks (8 · 6 · 5, right-middle, 2 of air) and `bell-2`, whose "dot" is
a dot *clapper* under the bell (⌀3 · 2.5 · 2, centred, 1.5 · 1.5 · 1.75 below the rim, the rim raised
0.5 at 24 to make room — its note; the body is `bell`'s at 20 and 16, residual 0, and a different
path at 24). Card 1.1 §2.8 recorded the empty census; this card confirms it after reading every
assembly.

What the sheet (`research/queue.md`, 349 rows not approved: 348 `[ ]` and `thumbs-down` `[~]`) is
waiting to draw, by the same four kinds plus the fifth. The census takes a name's last word as its
modifier (`-plus`, `-check`, `-off`, `-circle`…) and was checked by hand, so the badge row is a floor:

| kind | unshipped rows | names |
|---|---|---|
| **corner badge** (object + action glyph) | **at least 38** | `bell-plus`, `calendar-check`, `calendar-clock`, `cart-minus`, `cart-plus`, `clipboard-check`, `code-plus`, `credit-card-lock`, `credit-card-x`, `database-plus`, `desktop-download`, `eye-check`, `face-smile-plus`, `file-check`, `file-clock`, `file-down`, `file-heart`, `file-minus`, `file-plus`, `file-up`, `folder-down`, `folder-minus`, `folder-plus`, `folder-up`, `grid-circle-plus`, `image-plus`, `mail-follow-up`, `message-alert`, `message-user`, `note-plus`, `package-check`, `shield-check`, `user-check`, `user-lock`, `user-minus`, `user-plus`, `user-search`, `user-x` |
| strike (`-off`, `-closed`) | 19 | `bell-off`, `bookmark-off`, `bug-off`, `camera-off`, `clipboard-off`, `cloud-off`, `crosshair-off`, `eye-closed`, `eye-off`, `keyboard-off`, `link-off`, `map-pin-off`, `microphone-off`, `phone-off`, `shield-off`, `toggle-off`, `video-off`, `wifi-off`, `zap-off` |
| enclosure (`-circle`, `-square`) | 21 | `arrow-*-circle` ×4, `chevron-*-circle` ×4, `play-circle`, `pause-circle`, `stop-circle`, `user-circle`, `hash-circle`, `plus-square`, `minus-square`, `x-square`, `help-square`, `info-square`, `alert-square`, `activity-square`, `dotted-arrow-bottom-right-square` |

The by-name census is blind to a second **object** used as a badge. Read by hand, the other two-word
unshipped names add about twenty a badge grammar would also govern — `phone-incoming`, `-outgoing`,
`-missed`, `-forwarded`, `user-shield`, `user-exit`, `user-segment`, `file-attachment`,
`camera-flip`, `book-bookmark`, `shield-pending`, `credit-card-percent`, `receipt-refund`,
`message-pen`, `globe-pointer`, `window-key`, `window-pointer`, `image-sparkle`, `pen-sparkle`,
`star-sparkle` — and leave a dozen that are two objects side by side or an interior detail
(`heart-hand`, `user-laptop`, `pencil-ruler`, `wrench-screwdriver`, `file-signature`,
`battery-charging`, `scan-face`, `user-focus`, `message-smile`, `window-chart`, `check-double`,
`spell-check`). Whether each is a corner badge is a drawing decision, not a name's; what the count
says is that **it is at least 38 and could be near 60**.

So **at least 38 planned icons have no grammar to be drawn by**, 19 inherit C21 and only need the
channel width settled, and 21 inherit C18. The badge ruling is the one decision here that is free today and
not free after the first `file-plus` is approved — the plan's third "decision that expires at
launch" (`plans/set-and-rules-audit.md:82-84`), and `user-search` is already on the sheet against
`docs/05:31`'s "never `<object>-search`" (kind 1, in the sheet rather than in a drawing).

### 1.6 What `docs/05-modifiers.md` prescribes against what is drawn

The document's own words (`docs/05:37`): *"Written for the old 2-unit stroke."*

| `docs/05` says | where | the set does | kind |
|---|---|---|---|
| anchor **(16, 16)**, bottom-right, "never moves" | §2, l. 53 | no modifier is anchored to a corner. The beside marks centre on the object's mid-height (dy 0) with their right edge on the bound; the through arrows run through the object's centre | untested — no badge exists |
| glyph **8 units** (12→20) at 24; **5.5** at 16 | l. 54, 80-81 | the beside marks are **8 · 6 · 5** — the 24 agrees, the 16 does not (5 against 5.5); the ring marks 9–10.5 · 7–8 · 5.5–6.5 | untested as a badge; the one beside size matches at 24 only |
| glyph stroke **= the base's**, never lighter | l. 55 | every modifier is drawn at its file's stroke; in a shape-filled twin the line modifier keeps the outline weight beside a solid (`volume-x-filled`, `export-filled`) | holds, by default |
| clear zone **r6 at (16,16)**, no base stroke inside it; clearance **1.5 (one stroke)** | l. 56-59 | no zone is kept clear anywhere; the clearance where a modifier meets its base is **1.5 · 1.5 · 1.5** in the through kind — a literal, not "one stroke" (1.25 at 16) | the number survived, its derivation did not (kind 2 with C7) |
| the zone "stays inside the live area and never touches trim" | l. 59-60 | `docs/01:42` says there is no live area; `docs/01:68-70` lets badges run to 23. Drawn: nothing crosses the bound | kind 2 — `docs/09:38`, rule-register H3; unchanged |
| cut-back **B auto-clip** by default, **A** by hand where B looks wrong, **C scale-down rejected outright** | §3, l. 105-114 | every cut-back is **A** (`export`'s notch, `external-link`'s and `compose`'s corners, `menu-arrow`'s shortened lines, `alert-triangle`'s shorter bar); no build step clips anything; and `external-link` ×2 and `compose` **shrink and corner** the base — C | kind 2 against the doc as written, 3 concepts |
| slash `M4 4l16 16`, a 2-unit channel, named `-off` | l. 69-77 | `\` holds (C21); channels are 2 · 1.75 · 1.75 (`ban-2`) and 1.5 · 1.5 · 1.25 (`volume-off`); names `volume-off` ✓, `ban` ✗ (a market name, G6) | kind 2 — rule-register H6 |
| ship eight modifiers: plus, minus, check, x, arrow, clock, star, slash | §4 | drawn: plus, minus, x (beside, `volume`); arrow (through, 16 concepts); slash (strike, 4); check (inside a box, `checkbox`); **star** (`wand`: a sparkle, not a favourite mark); clock — none | untested as badges |
| `<object>-<modifier>`, never `<object>-search` | l. 142-143, 31 | names hold; `user-search` is on the sheet (row 434) | kind 1, in the sheet |
| "you will ship at least three modifier variants of that base" before drawing one | §1 test 5 | `docs/05 §4` counts `slash` as a modifier, so the `-off` rows count too: over the 38 + 19 named rows, **34 bases; 23 are queued with exactly one** (`code`, `database`, `desktop`, `face-smile`, `grid-circle`, `image`, `mail`, `note`, `package`, `bookmark`, `bug`, `camera`, `cloud`, `crosshair`, `keyboard`, `link`, `map-pin`, `microphone`, `phone`, `toggle`, `video`, `wifi`, `zap`), **7 with two** (`bell`, `calendar`, `cart`, `clipboard`, `credit-card`, `message`, `shield`), and four pass — `eye` 3, `file` 7, `folder` 4, `user` 6 | kind 1 against the doc's own test, in the sheet |

### 1.7 What the references do — method, never value (cited, not re-measured)

- **Fluent** (`docs/audit/references-fluent.md` T5, R3; `docs/08:408` H8): the badge is the one
  element that may enter the padding ("inset max 1px"), is **filled regardless of the parent's
  style**, and is sized by a chart — 16 → cut 11 / modifier 9, 20 → 11 / 9, 24 → 13 / 11 (the
  modifier is 45–56% of the canvas; `docs/05`'s 8 is 33%, our beside marks 33 · 30 · 31%). Where a
  badge meets its base Fluent lets the air collapse to 0.09–0.23 rather than move the badge; every
  drawing in its sample whose margin falls to zero is a badge compound.
- **SF Symbols** (`references-sf.md` §3.6-3.7): 242 of 246 badges are the **same disc**, hung on a
  corner; the base is **kept in place and cut back** (97%, a fifth of its ink removed at the median),
  and the cut is a **layer** — a hidden "clear-behind" shape that follows the badge's outline grown
  by one constant (135 units; 250 of 259 within 130–140).
- **Untitled UI** (`references-untitled.md` §5, §10): the outline draws the badge as a bare mark at
  the edge of the box; the solid draws a **disc with the mark cut out, up to 1 unit further out** —
  43 of its 83 outline/filled box breaks are badges.
- **Central**: no badge finding on record.

Common to all three, as **method**: the base is cut back around the badge, never merely overlapped;
the badge spends the margin; the badge's legibility outranks weight consistency (Fluent and
Untitled go solid). None of their numbers crosses (test 3 of the plan's transfer test), and the
first two fail test 2 against our published bearings (`dist/metrics.json` is a contract; a badge in
the margin makes `padding` lie — Fluent R1).

### 1.8 The mark sizes in play — one plus, or six?

Outer ink, by master, every place each mark is drawn in the set. Free sizes from card 1.1 §2.4-2.5
and C11/C12/C16; the rest from §1.1-1.4 above.

| mark | free (small · default · large) | inside a ring (default / small) | beside an object | through / in a box |
|---|---|---|---|---|
| plus @24 | 12 · 15 · 18 | 10.5 / 9 | **8** (`volume-plus`) | — |
| plus @20 | 11 · 13.5 · 16 | 8 / 7 | **6** | — |
| plus @16 | 10 · 12 · 14 | 6.5 / 5.5 | **5** | — |
| x @24 | 10 · 13 · 16 | 9 / 8 | 8 = the small ring's | — |
| x @20 | 9.5 · 12 · 14.5 | 6.5 / 6 | 6 = the small ring's | — |
| x @16 | 8.5 · 10.5 · 12.5 | 5.5 / 5 | 5 = the small ring's | — |
| check width @24 · 20 · 16 | 13 · 16 / 11.5 · 14 / 10 · 12 | 10.28 / 8.6 · 7.8 / 6.58 · 6.58 / 5.7 | — | in `checkbox`: the ring's 10.28 · 7.8 · **6.5** |
| arrow length @24 (head width) | 15 (10); `arrow-up-right` box 13 (head 7.5), shaft 15.95 | — | `sort*` 15 (10); `sort-alpha/numeric` 15 (**8**) | door / tray 15, `export` 14.75, `upload-2` 12, deep door 10 (all head 10); diagonal: `external-link` box 11.25, `external-link-2` 11.5, shafts 13.48 / 13.83 |
| arrow length @20 (head) | 13.5 (9); `arrow-up-right` box 11.5 (6.75), shaft 13.83 | — | 13.5 (9); 13.5 (**7**) | 11, 10.75, 9.5, 8; diagonal box 8.25, shaft 9.24 |
| arrow length @16 (head) | 12 (8); `arrow-up-right` box 10 (6), shaft 12.12 | — | 12 (8); 12 (**6**) | 9.25, 8.88, 8, 7; diagonal box 7.38, shaft 8.40 |
| chevron (height of a side chevron) @24 | 11 · 14 · 17 (C12) | — | `menu-arrow` 6.62, `code` 9, `code-2` 10 (= arrow head), `sort-3` 4.44 | — |
| the C21 bar, ink square @24 · 20 · 16 | — | `ban` 14.58 · 11.76 · 10.26, `ban-3` 9.98 · 7.34 · 5.92 | — | `volume-off` 18 · 14 · 12 |
| the "!" bar @24 · 20 · 16 | — | `alert-circle` 8 · 6 · 4.5 | — | `alert-triangle` 8 · **4.75 · 3.375** |
| the companion star | — | — | `wand` **7 · 5.5 · 4.5**; `sparkle-2` 7 · 6 · 5; `sparkle-3` 7 · 5.5 · 5; `sparkle-4` 6 · 5 · 4 | — |

**Six plus sizes at 24** (18, 15, 12, 10.5, 9, 8) and the sixth is one icon's. **Two arrowheads in
composites** — the medium head (10 · 9 · 8, C16's "the only head used in composites") in the doors,
trays, card, box and `sort`/`sort-2`/`sort-asc/desc`, and a **narrow head 8 · 7 · 6** in `sort-3` and
the four `sort-alpha/numeric` arrows; card 1.1 §2.7 adds the `refresh`/`rotate-ccw` family's three
further leg lengths (4.25 · 4.257 · 3.507 at 24). C16 lists `refresh` among its composites, so the
sentence is broken by **17 concepts** (kind 1): 5 sort + 12 rotate/refresh.

---

## 2. F3 — one object, one drawing?

### 2.1 Families, counted

485 concepts fall into **125 object stems: 105 families of two or more and 20 singletons**. 9 of
the 105 are mark families card 1.1 covered (`plus`, `minus`, `x`, `check`, `chevron`, `arrow`,
`arrow-up-right`, `sparkle`, `ban`), leaving **96 object families, 378 concepts**. For each family at
each master the **body** — the subpath with the largest outer ink box — was classified
(translation, tol 0.01, near band 0.5 · 0.417 · 0.333), and every subpath of every member was
pooled to count shared parts (`objects.mjs` → `objects-families.md`, `objects-summary.md`; the
category counts below are mechanical, `verify.mjs`).

| the body is… | families | concepts | who |
|---|---|---|---|
| **one drawing in every member at all three masters** | **19** | 65 | `alert-circle` 4, `alert-triangle` 4, `bug` 2, `calendar` 3, `check-circle` 6, `checkbox` 4, `compass` 3, `credit-card` 3, `face` 3, `file-text` 2, `globe` 2, `help` 4, `info` 3, `keyboard` 2, `menu` 4, `sort-alpha` 6, `sort-numeric` 6, `store` 2, `table` 2 |
| one drawing in all but one member at all three masters, the odd one a different construction by its tag | 12 | 48 | `volume` 7 (6 identical, `volume-off` a pure translation — effectively 7), `files` 5 (`files-4` is `file`'s full page), `images` 4 (`images-4` a side strip), `layout-footer/-header/-sidebar/-sidebar-right` 4 each (`-4` a detached band, C29), `book` 4 (`book-4` hardcover), `image` 3 (`-3` wide), `mail` 3 (`mail-3` square), `target` 3, `upload` 3 (`-3` deeper) |
| split two ways by design (two bodies, each shared) | 2 | 8 | `building` 2 + 2 (`-3`/`-4` the wider tower), `chevrons-up-down` 2 + 2 |
| **a different drawing in every member at every master** (C5 numbered variants) | 42 | 137 | `attachment` 4, `chart-bar` 5, `chart-pie` 3, `clipboard` 4, `copy` 3, `cursor` 3, `database` 3, `filter` 4, `flag` 4, `gear` 3, `link` 3, `list-bullet` 3, `login` 4, `logout` 4 (two doors up to mirroring, §2.6), `map-pin` 5, `maximize` 5, `megaphone` 3, `message` 7, `package` 3, `pencil` 4, `pin` 6, `play` 3, `puzzle` 5, `refresh` 3, `search` 3, `user` 4, `wallet` 3, `wand` 3, `watch` 3, `wrench` 3, and 12 pairs (`at-sign`, `book-open`, `code`, `external-link`, `heart`, `menu-arrow`, `presentation`, `printer`, `shield`, `thumbs-up`, `toggle-on`, `trash`) |
| **partly shared — and the sharing changes with the master** | 21 | 120 | `bell` 3, `camera` 6, `cart` 5, `compose` 4, `desktop` 6, `folder` 3, `grid` 7, `hash` 3, `home` 3, `key` 6, `language` 3, `lightbulb` 4, `lock` 6, `microphone` 5, `paintbrush` 8, `plug` 7, `rotate-ccw` 11, `sliders` 5, `sort` 5, `text` 4, `users` 16 |

So the plain answer to "is a calendar the same calendar, a face the same face, a check-circle the
same ring" is **yes, in 19 families exactly** — and to "is a lock the same lock" is **no, by design**:
a numbered variant is a different drawing (C5), and 42 families are made of nothing else. The F3
question therefore narrows to two things the census can see and the rules cannot: a body that is
shared *nearly* (§2.2), and a part that is shared at one master and not another (§2.3) — which is
where most of the 21 "partly shared" families sit.

### 2.2 Bodies that are nearly shared — intent or accident, by tag

Every body-to-body near miss in the 96 families (residual inside the band, not identical), with the
two members' own `tags:`. "Intent" when the tags name a different form; "accident" when they name
the same form.

| pair | master | residual (px@16) | what the tags say | verdict |
|---|---|---|---|---|
| `cart-3` ~ `cart` (hook, post and rail) | 20 | **0.208** (0.167) | *hook, taper* vs *hook, chamfer* — the same hook and post | **accident**: identical at 24 and 16, 0.208 off at 20 |
| `sliders-3` ~ `sliders` (the knob ring) | 20 | **0.333** (0.267) | *vertical, ring* vs *horizontal, ring* — the same ring | **accident**: the knob is one drawing at 24 and 16 (3 concepts) and 4.5 against 5 ink at 20 |
| `microphone` ~ `microphone-2` (the cradle — the 16-wide U under the capsule; the capsule itself is a different drawing, 1.342 · 0.671 off at 24 · 20, identical at 16) | 24 / 20 | 0.25 (0.167) / 0.125 (0.1) | *size-specific* vs *classic* | undecided — identical at 16; the tag claims a per-master choice. Maruti's call |
| `paintbrush-3` ~ `paintbrush-7` | 16 (24: 0.177) | 0.088 (0.088) | *round, stroke, line* vs *round, stroke, swash, curve* | intent (a different stroke), converging at 16 |
| `paintbrush-2` ~ `paintbrush-3` | 16 | 0.265 | *band, ferrule* vs *round, stroke, line* | intent (the 0.174 near miss between `paintbrush-2` and `paintbrush-5` is **handle to handle** — subpath 0, a 6.69 box, 0.195 on canonical `d`; their 7×7 bodies have no match) |
| `text-4` ~ `text` | 20 (16: identical) | 0.25 (0.2) | *capital, plus box* vs *capital* | the T is one drawing at 16 and 0.25 off at 20 — a pair already noted at 16 by rule-register G7 |
| `clipboard` ~ `clipboard-2` | 24 / 20 / 16 | 0.5 / 0.25 / 0.25 | *clip, paste, deep* vs *clip, paste, arch* | intent (card 1.1 §4.2, item 13 — "two drawings where the set clearly wanted one") |
| `database` ~ `database-2` | 24 / 16 | 0.5 / 0.25 | *three discs* vs *two discs, round* | intent — the cylinder is redrawn 0.5 · — · 0.25 shorter with the disc count |
| `grid` ~ `grid-7` | 24 / 20 / 16 | 0.393 / 0.393 / 0.196 | *four squares* vs *tight, large* | intent (larger tiles) |
| `key-2` ~ `key-3` | 20 / 16 | 0.346 / 0.319 | *classic* vs *teardrop* | intent |
| `pencil-3` ~ `pencil-4` | 20 / 16 | 0.279 / 0.279 | *wide, heavy* vs *baseline* | intent (a wider body) |
| `book` ~ `book-4` | 24 | 0.5 (0.333) | *curl, spine* vs *hardcover, title, label* | intent |
| `list-bullet-2` ~ `list-bullet` | 16 | 0.25 | *bold discs* vs *small discs* | intent (C17 dots) |
| `users-3` ~ `users-3-wide` | 24 / 20 | 0.333 | *pair, arcs* vs *whole head, wide* | intent (C27 arrangement); card 1.1 §4.3 owns the figures |

Two accidents, one undecided, eleven intended. Both accidents are a part that is **the same drawing
at two masters and a different one at the third** — which is §2.3's subject.

### 2.3 Shared parts that break at one master — the finding this card adds

Card 1.1 found one case (item 1): `checkbox`'s check is `check-circle`'s at 24 and 20 and three
drawings at 16. Read across families, it is a class, and it happens at every master, not only 16:

| the part | 24 | 20 | 16 |
|---|---|---|---|
| **the door** (an arch, `home` family's) | one drawing in **5 concepts, 3 families**: `home`, `home-2`, `store`, `store-2`, `building-2` (6×7.25 ink); `building`'s is 0.5 off (6×6.5) | one drawing in 4: `home`, `home-2`, `store`, `store-2` (5×6.25); **`building` and `building-2` 0.167 off** (5×6) | one drawing in 4: `home`, `home-2`, `building`, `building-2` (4×5.25); **`store` and `store-2` 0.167 off** (4×5) |
| **the companion star** (four points) | one drawing in 3: `sparkle-2`, `sparkle-3`, `wand` (7 ink) | `sparkle-3` = `wand` (5.5); **`sparkle-2` 0.278 off** (6) | `sparkle-2` = `sparkle-3` (5); **`wand` 0.278 off** (4.5) |
| **the check in a box and in a ring** | `checkbox-n` = `check-circle-n` exactly, 4 of 4 | 4 of 4 | **3 of 4 off: 0.106, 0.172, 0.258** (card 1.1 §3.3) |
| **the slider knob** | `sliders` = `sliders-3` = `sliders-5` | **`sliders-3` 0.333 off** | all three identical |
| **the cart's hook and post** | `cart` = `cart-3` | **0.208 off** | identical |
| **the microphone cradle** | `microphone` ~ `microphone-2` 0.25 | 0.125 | identical (and `microphone-5`'s joins at 20 and 16) |
| **the lock shackle** | `lock-3` ~ `lock-5` **0.625** | identical | 0.125 (card 1.1 §5) |
| **the diagonal arrowhead** | `refresh-3` = `arrow-up-right` | — | `refresh-3`'s is its own |
| **the landscape container** (20×16, §2.4) | one drawing in 8 concepts; `presentation-2`'s frame 0.556 off | **9** — `presentation-2` joins; `keyboard`, `keyboard-2` 0.556 off | **11** — `keyboard` and `keyboard-2` join (`briefcase`'s body stands off it at every master, 0.556 · 0.556 · 0.417, and is not counted) |

**Nine parts, 30 concepts, and none of the nine agrees at all three masters.** None is visible —
the largest is the shackle's 0.625 u at 24 (0.42 px), then the three frames 0.556 off the
landscape container (`presentation-2` at 24, `keyboard` and `keyboard-2` at 20; 0.37 · 0.44 px) and
`building`'s door at 0.5 (0.33 px); the rest sit between 0.106 and 0.333 — and none breaks a stated rule, because **nothing in
the repo says a part shared at one master must be shared at the others** (kind 3). The bodies that
become identical at a smaller master are the same mechanism seen from the other side: `camera-5`'s
body is `camera`'s at 16 only; `microphone-5`'s is `microphone`'s at 20 and 16; `text-4`'s is `text`'s
at 16; `paintbrush-2`'s is `paintbrush-4`'s at 16; `rotate-ccw-8`'s is `rotate-ccw-10`'s at 24 only;
`bell-2`'s is `bell`'s at 20 and 16 (declared in its note). Rule-register G7 lists five of these
pairs as whole outline files identical at 16; this list is of bodies, and is longer by two (§6).

### 2.4 Cross-family reuse — what one object takes from another

127 pairs were asked, at every master: of A's non-trivial subpaths, how many are B's exactly, how
many after a left–right flip, how many nearly, how many a resized copy (`objects-pairs.md`). The
findings that are not already in card 1.1:

| object | where it recurs | one drawing? |
|---|---|---|
| **the speaker** | `volume`, `-low`, `-none`, `-x`, `-plus`, `-minus`, `-off` | **yes, 7 of 7, residual 0 at all three masters**; `volume-off`'s is translated 5 · 4 · 3 (C28 holds exactly — the only object in the set whose sharing a lint check guards, `anchor:`) |
| **the pencil's tip and band** | `pencil`, `pencil-4`, `compose`, `-2`, `-3`; and `pencil-2`, `compose-4` | **yes, as a coordinate string** at all three masters (§1.2). The whole pencil path differs: `compose` slides the tip and shortens the body, so congruence sees a different shape. One drawing *derived*, not reused |
| **the arrowhead** | 16 composites (`login` ×4, `logout` ×4, `upload` ×3, `export`, `external-link` ×2, `maximize-4`, `code-2`) | yes — exact, `arrow-<dir>`'s medium head; the narrow head in the 5 sort arrows is the family's own (§1.8) |
| **the square 18 · 14 · 12** | `checkbox` ×4, `image` ×2, `table` ×2, `grid-2`, `grid-6`, `mail-3`, `chart-bar-5`, 12 `layout-*` | yes, 24 concepts in 10 families, exact (card 1.1 §2.2 counts 26 outline concepts on it; §6) — and **not** in `calendar` (18×16), `images` (15), `external-link` (15 / 14), `compose` (16): those are smaller or shorter boxes of their own |
| **the landscape container 20×16** | `credit-card` ×3, `desktop-5`, `image-3`, `mail`, `mail-2`, `wallet-2` | yes, 8 concepts in 5 families, exact (18.5×14.5 on the centreline, radius 2.5 — `mail`'s path) — a third clean container beside the ring and the square, not named anywhere; and it gains carriers as the master shrinks: `presentation-2` at 20 and 16, `keyboard` and `keyboard-2` at 16 (§2.3) |
| **the page and its fold** | `file`, `file-text`, `file-text-2`, `files-4` | yes (card 1.1 §4.2); and `files`' small page carries **`file`'s 20-master fold scaled ×0.833 at 24** (5×5 against 6×6) — the small page's fold notch is the next master's; the sheets themselves differ |
| **the figure** | `users*` from `user*` | **no**, 0 of 7 pairs share a part (card 1.1 §4.3 for the heads; the bodies too) |
| **the cursor** | `cursor-click` from `cursor` | **no** — a third cursor, 12.25 · 8.76 · 7.5 ink against 18 · 14 · 12, not a resize |
| **the image frame** | `images` ×3 from `image` | no — 15 · 11 · 9 against 18 · 14 · 12 with the radius kept, so not a resize; its note says "image's drawing brought down" |
| **the menu lines** | `menu-arrow-*` from `menu` | no — shortened 15 → 9.5 (§1.1) |
| **the chevron** | `code`, `menu-arrow`, `sort-3` | no — three chevrons of their own; `code-2`'s pair is `arrow-left`'s and `arrow-right`'s heads; `chevrons-up-down-2/-3` are `chevron-*-small` exactly (card 1.1 §2.6) |
| **the "!"** | `alert-triangle` ×4 from `alert-circle` ×4 | at 24 yes (bar 8, dot ⌀2.5, gap 1); at 20 and 16 the triangle's bar is cut back 1.25 · 1.125 (§1.4) |
| **the glyph dot r0.5** | `alert-circle` ×2, `alert-triangle` ×2, `help` ×4, `info` ×3, `sparkle-4`, `wand` | yes, 13 concepts in 6 families (`partA.md`, the 1×1 class) |
| **the detail dot r0.75** (⌀3 · 2.5 · 2) | `bell-2`, `calendar-3`, `cart` ×4, `credit-card-3`, `gauge`, `grid-3`, `image` ×3, `images` ×4, `list-bullet-2`, `lock-2/-5/-6`, `map-pin-3`, `more-*`, `target` ×3, `wallet-2/-3`, `wand-2/-3` | yes, **30 concepts in 16 families**, exact at 24 — the most-reused part in the set after the ring, and "image's and bell's dot" in the files' own notes |
| **the door** (`login`/`logout`) | 8 concepts | yes, up to mirroring: one 6-deep door and one 8-deep door, each drawn once and flipped (§2.6) |

Across all 24 outline subpaths, **98 classes span two or more families at 24 (99 at 20, 88 at 16),
39 of them non-trivial** (`partA.md` lists all 39); the cross-family *near misses* on non-trivial
parts are **7 at 24, 18 at 20, 28 at 16**, with the band scaled to the master (0.5 · 0.417 · 0.333,
as card 1.1 §5 requires, so this rise is not the measuring-band artefact the plan's corrections
table refutes) — the smaller the master, the more parts sit almost on top
of a part from another family (`code`'s chevron 0.086 from `menu-arrow`'s at 16; `briefcase`'s
body 0.139 from `desktop`'s; the four `arrow-<dir>` heads 0.28 from the four `chevron-<dir>-small`).

### 2.5 Stacks — where the sheet behind sits (the one repetition grammar that is a rule)

| stack | back sheet shows past the front (left, bottom) 24 · 20 · 16 | air front ↔ back |
|---|---|---|
| `images`, `files`, `files-5` | **3, 3 · 3, 3 · 3, 3** | 1.5 · 1.5 · 1.75 |
| `images-2`, `files-2` (offset up-right) | 5.5 · 5 · 4.5 | 1.5 · 1.5 · 1.75 |
| `images-3`, `files-3`, `copy-2`, `copy-3` (offset up-left) | 3 · 3 · 3 and 5.5 · 5 · 4.5 | 1.5 · 1.5 · 1.75 |
| `copy` | **4 · 4 · 4** and 6.5 · 6 · 5.5 | **2.5 · 2.5 · 2.76** |
| `images-4`, `files-4` (a strip behind) | 4 · 4 · 4 | 1.5 · 1.5 · 1.52 |

The offset is one number — 3 at every master, "the tightest the 1.5 gap allows (3 = 1.5 of air +
one stroke)", `images`' note — in 9 of 12 stacks; `copy`'s tag says *offset 4* and it stands at 4 with
2.5 of air, a decision recorded in its tag and nowhere else. The 3 is a derived value at 24 and 20
and holds as an absolute at 16, where the line is 1.25 and the air becomes 1.75: the same "literal
1.5" pattern as the through kind.

### 2.6 The doors — facts for the second expiring decision

| concept | door side | returns (ink) 24 · 20 · 16 | arrow points | arrow length | door ↔ arrow air |
|---|---|---|---|---|---|
| `login` | right | 6 · 4.5 · 4 | → (in) | 15 · 11 · 9.25 | 1.5 |
| `logout` | left | 6 · 4.5 · 4 | → (out) | 15 · 11 · 9.25 | 1.5 |
| `login-2` | right | 8 · 6 · 5 | → | 10 · 8 · 7 | 5.18 · 3.76 · 3.28 |
| `logout-2` | left | 8 · 6 · 5 | → | 10 · 8 · 7 | 5.76 · 3.7 · 3.05 |
| `login-3` | **left** | 6 · 4.5 · 4 | **←** (in) | 15 · 11 · 9.25 | 1.5 |
| `logout-3` | **right** | 6 · 4.5 · 4 | **←** (out) | 15 · 11 · 9.25 | 1.5 |
| `login-4` | left | 8 · 6 · 5 | ← | 10 · 8 · 7 | 5.18 · 3.76 · 3.28 |
| `logout-4` | right | 8 · 6 · 5 | ← | 10 · 8 · 7 | 5.76 · 3.7 · 3.05 |

Measured with `canonical` shapes at all three masters: `login`'s door **is** `logout-3`'s (same
side, same depth — card 1.1 §4.4's finding, confirmed), and `login`'s door **mirrored is** `logout`'s;
`login-3` is `login` flipped whole (door and arrow), `logout-3` is `logout` flipped whole; the same
for `-2`/`-4`. So there are **two doors** in the set (6-deep and 8-deep), each drawn once and
flipped, and the numbers pair like this: **`login-n` and `logout-n` share the door's depth and the
arrow's direction, and the door changes side** — n = 1, 2 arrows point right; n = 3, 4 arrows point
left; odd n shallow, even n deep. That is a consistent rule; it is just not "same number, same door
shape", which is how card 1.1 item 12 read C9 and why it recommended renumbering. Both readings are
set out in §5 for Maruti to rule on; nothing is decided here.

---

## 3. Judged list — what stuck out, ranked by how many icons each touches

Kinds, kept apart: **(1)** a drawing disagrees with a stated rule · **(2)** a rule disagrees with
another rule or the docs · **(3)** no rule covers it.

1. **The corner badge has no grammar, and at least 38 icons are queued to need one. (3) · systemic, at least 38
   planned + 0 shipped.** `docs/05` is the only rule document never exercised (rule-register §H);
   its anchor, zone and sizes are for stroke 2 and a live area `docs/01` says does not exist; the
   three references all cut the base back and let the badge spend the margin, and we have never
   spent the margin in 47 composites. §5 P1.
2. **Shared parts break at one master and nothing says they may not. (3) · systemic, 30 concepts
   in 9 parts (§2.3), plus 7 bodies identical at some masters only.** Largest residual 0.625 u
   (0.42 px, the shackle at 24), most under 0.333; none visible; all invisible to every rule. Extends card 1.1 item 1 (the check at 16)
   from one case to a class, and to 24 and 20. §5 P7.
3. **The through kind keeps an unwritten rule to the thousandth; the beside kind has none. (3) ·
   systemic, 43 concepts.** 7 of 18 through composites hold exactly 1.500 · 1.500 · 1.500 where the
   modifier meets the base and 6 more 1.505 · 1.505 · 1.578; the 25 beside composites run 1.6–4.5 at 24. §5 P2, P3.
4. **C16's "the only head used in composites" is broken by 17 concepts. (1) · systemic.** The five
   sort arrows carry a narrow head (8 · 7 · 6), the twelve `refresh`/`rotate-ccw` arrows three
   lengths of their own (card 1.1 §2.7). Either the sentence names the heads in use or the heads
   change. §5 P4.
5. **A mark beside an object is a size of its own. (3) · 3 concepts today, every badge tomorrow.**
   `volume-plus` is the sixth plus size at 24 (8, where the smallest shipped plus is 9); the arrow
   in a door is 15 · 11 · 9.25 — "what the box leaves" (§1.8). Nothing says whether a modifier is a
   shipped mark size or a fraction of its object. §5 P1(b), P2.
6. **`docs/05` disagrees with C7, C21, `docs/01` and the drawings on six counts. (2) · 0 drawings
   wrong, one document.** Clearance "1.5 (one stroke)" (C7 made the two differ at 16); the slash's
   2-unit channel (drawn 2 · 1.75 · 1.75 and 1.5 · 1.5 · 1.25); "live area" (`docs/01:42`); the zone
   inside the live area against badges to 23 (`docs/01:68`); strategy C "rejected outright" against
   `external-link` ×2 and `compose` shrinking and cornering their box; anchor and sizes for stroke 2.
   Rule-register H3/H6 record four of these; the C7 and strategy-C conflicts are new. §5 P8.
7. **`help` and `info` do not name their ring; `help-square` and `info-square` are queued. (1) ·
   7 concepts, 42 files, 2 queued.** `docs/09:26` named `help`; `info` ×3 has the same gap. The
   sheet's `help-square` (row 455) and `info-square` (456) make the bare name ambiguous the day they
   ship, and C9 locks names at launch. §5 P5.
8. **`login`/`logout` numbers pair by depth and handedness, not by door shape. (2) · 8 concepts.**
   Card 1.1 item 12 read C9 as "same number, same door" and recommended renumbering; measured, the
   drawings follow a different but consistent rule (§2.6) that no doc states. §5 P6.
9. **The base of a composite may be a smaller redraw of the object, or may not — nothing says. (3)
   · 8 concepts.** `external-link`'s box 15 / 14, `compose`'s 16, `images`' frame 15 (against the 18
   square), `cursor-click`'s cursor 12.25 (against 18): four bases redrawn smaller for their
   composite, none a scaled copy, none named a variant. Doc 05 forbids it for badges (strategy C)
   and is silent for everything else.
10. **A third clean container exists and is unnamed. (3) · 8 concepts.** The 20×16 landscape box
    (radius 2.5) is one drawing in `credit-card` ×3, `desktop-5`, `image-3`, `mail` ×2, `wallet-2`
    (§2.4) — exact, like the ring (40) and the square (24). The keyline table names it; no doc says
    it is one drawing, and card 1.1's "where the set is simply good" list stops at two.
11. **`user-search` is queued against `docs/05:31`. (1) · 1 planned.** "Never `<object>-search`":
    the sheet carries it at row 434.
12. **The sheet breaks `docs/05`'s own entry test in 30 places. (1) · 30 bases.** "Ship at least
    three modifier variants of that base" — with `slash` counted as the doc counts it, 34 bases are
    queued and 30 have one or two variants, 23 exactly one (§1.6). Either the test goes or the rows do.

### Where the set is simply good

- **The through grammar.** Exactly 1.500 at the contact in 7 of 18 and 1.505 / 1.578 in 6 more,
  filled twins the same — a rule followed before it was written (§1.2).
- **The speaker** — 7 of 7, residual 0, the one shared object a lint check guards (§2.4).
- **The pencil tip** — one coordinate string in 5 + 2 files per master (§1.2).
- **The arrowhead in composites** — `arrow-<dir>`'s own, exact, in 16 concepts (§2.4).
- **Nineteen families** whose body is one drawing in every member at every master (§2.1).
- **The stack offset** — 3 · 3 · 3 in 9 of 12 stacks, derived once and held (§2.5).
- **Nothing crosses the bound.** 47 composites, smallest "to bound" 0 (§1.1).

---

## 4. What only Maruti's eye can settle, and where

| question | surface |
|---|---|
| Should a badge be a line glyph at the outline weight (as `volume-x-filled`) or a solid disc with the glyph cut (Fluent, Untitled, SF)? | the first `file-plus` drawn both ways, filled, in the Library's At 16 strip beside `file`, `file-text`, `volume-x` |
| Does the door arrow at 9.25 (0.77 of `arrow-right`) read as the same arrow beside `arrow-right` in a 16 px toolbar? | `login`, `logout`, `upload`, `export` in a row with `arrow-right`, `arrow-up`, real pixels at 16 |
| Do the three companion stars (7 · 5.5 · 4.5 against 7 · 6 · 5 and 7 · 5.5 · 5) read as one star? | `wand`, `sparkle-2`, `sparkle-3` at 20 and 16, real pixels — card 4.2's primitive sheet |
| Does `cursor-click`'s small cursor read as `cursor`? | the two side by side at 16 |
| Is 2 of air (the `volume` marks) the right distance for a mark beside an object, or is the 1.5 the through kind uses? | `volume-x` redrawn at 1.5 beside the shipped 2, at 16 |

---

## 5. Proposals for Maruti to rule on

**These are proposals, not decisions. Each carries a recommendation and the evidence; nothing in the
set, the rules or lint changes until Maruti rules.**

**P1 — The badge zone (the decision that expires at launch).** At least 38 queued icons need it; 0 shipped
icons would change. *Evidence:* §1.5, §1.6, §1.7. *Recommendation:* decide four things before
`file-plus`, as one C-row and one declared note lint can verify (`<!-- modifier: plus br -->` or
similar, checked for position, size and air the way `anchor:` is checked):
(a) **position** — bottom-right, inherited from `docs/05` and the three references (no drawing of
ours puts a mark in a corner; the `volume` marks stand right-middle), the badge's outer edges **on
the drawing bound** (22 · 18 · 15), not past it; our bearings are a contract (`dist/metrics.json`)
and a badge in the margin makes `padding` lie — the one place the Fluent method fails our transfer
test (R1); (b) **size** — start from **8 · 6 · 5** ink, which is one family's number (the three `volume` marks,
beside, not at a corner) and `docs/05`'s 8 at 24 (not its 5.5 at 16), and let the eye settle it on
the first badge drawn (Fluent's 45–56% of canvas fails test 3 as a value); (c) **air** — **1.5 · 1.5 ·
1.5** all round, the through kind's literal, with the base **cut back by hand** (strategy A; no
auto-clip exists and none should be built for the 38 or more icons); (d) **filled form** — the eye's, §4 row 1.
Keep `docs/05 §1` (the five tests) and §5 (governance); strike `user-search` or the rule.

**P2 — Record the beside construction, scoped to `volume`.** 25 concepts; 2 of air where it was
chosen, 1.6–4.5 where it was left over. The only *mark beside an object* in the set is the `volume`
family — half the object's height, 2 of air, right edge on the bound, outline weight — three
concepts, one family, and one family is not a rule. *Recommendation:* record that construction as
`volume`'s own (a C-row scoped to the family, as C28 already is) and defer a general rule until a
second object carries a mark beside it; leave *a mark beside lines or glyphs* (the sort family,
`menu-arrow`, `code`) to C17's territory, where the box is split rather than cleared.

**P3 — Write the through rule down, and rule on the shrunken base.** 18 concepts follow "1.5 where
the modifier meets the base, the base cut by hand" and no doc says it. *Recommendation:* a C-row
stating it as a literal at every master (not "one stroke"), and a sentence saying whether a
composite's base may be drawn smaller than the object alone (`external-link` 15 / 14, `compose` 16,
`images` 15, `cursor-click` 12.25) — recommend **yes, when the modifier needs the room, and the note
says by how much**, which is what the four files already do.

**P4 — Amend C16's "the only head used in composites".** 17 concepts contradict it.
*Recommendation:* amend, not redraw: the medium head for an arrow **through an object**; the narrow
head (8 · 7 · 6) for the sort family **beside glyphs**; the `refresh`/`rotate-ccw` heads as that
family's own (card 1.1 item 7 owns their 4.25 / 4.257 split). The eye should see the narrow and
medium heads side by side at 16 once before the sentence is amended.

**P5 — `help` → `help-circle`, and `info` → `info-circle` with it.** 7 concepts, 42 files; `queue.mjs
rename` re-points the relatives. *Evidence:* `alert-circle`/`check-circle`/`x-circle`/`plus-circle`/
`minus-circle` name their ring; `alert-triangle` ×4 exists; `help-square`, `info-square` and
`alert-square` are queued (rows 455, 456, 284); C9 locks names at launch. *Recommendation:* rename
both now. `ban`, `clock`, `globe`, `target`, `compass`, `face-*` keep their names — their ring is the
object, not a container for a glyph.

**P6 — `login`/`logout` numbering: keep, and write the pairing rule.** *Facts:* §2.6 — two doors,
each drawn once and mirrored; `login-n` ↔ `logout-n` share depth and arrow direction and swap the
door's side; `login-3` is `login` flipped whole. *Two readings:* card 1.1 item 12's (C9: a number
names a shape, so `login-n` and `logout-n` should carry the same door shape — they carry mirror
images) and the drawings' (n names depth and handedness). *Recommendation:* keep the numbers — a
sign-in button that swaps `login` for `logout` keeps its arrow direction (how the major sets pair
theirs is `[needs measuring]`), and `-3`/`-4` give the left-handed convention a home — and record the
rule in docs/07 as a C-row so C9 is read as amended for this family (as C27 did for figures). If
Maruti reads C9 literally instead, `queue.mjs rename login-3=login-5 …` is one command today and
impossible after launch. Not decided here.

**P7 — Shared-part persistence as the primitive-drift linter's first check.** *Evidence:* §2.3 —
nine parts, 30 concepts, residuals 0.106–0.625, zero visible, zero caught. *Recommendation:* card 1.1
item 1's check — *two files that share a subpath exactly at one master must share it at all three*
— run as a **warning naming both files and the residual in px@16**, over parts and bodies alike;
today it would print the door (3 families), the star, the check, the knob, the hook, the cradle,
the shackle, `refresh-3`'s head and the landscape container's late frames. The fixes are eighth-grid nudges Maruti need not look at; the
check is the thing worth having.

**P8 — Retire `docs/05 §2–4`'s geometry; keep its governance.** *Evidence:* §1.6 — six conflicts,
four already in rule-register §H, two new (C7's "one stroke", strategy C). *Recommendation:* once
P1–P3 are ruled, rewrite §2–§4 from them in the current units and vocabulary (no live area, `\`,
literal 1.5, 1.25 at 16), and move the eight-modifier list to the sheet, which already carries it as
rows. Card 1.16 (stale statements) should carry the exact edits.

---

## 6. For wave 5 to reconcile — never pick

| quantity | this card | elsewhere |
|---|---|---|
| composites in the set | **78** (25 beside · 18 through · 4 strike · 31 enclosure), by base-plus-modifier geometry and names (§0) | card 1.1 §2.8: *"the only two-object names in 485 concepts are `menu-arrow-left/right` and `volume-plus/-minus/-x`"* — 5, by two-object **names**. Different definitions; wave 5 should state which the register uses |
| `login`/`logout` numbering | the numbers pair by door depth and arrow direction; the door changes side (§2.6); recommendation **keep** | card 1.1 item 12 and §4.4: *"cross-paired by number … ought to be the same door"*; recommendation **renumber** |
| bodies/files identical at one master only | **7 body pairs**: `camera`/`camera-5` @16, `microphone`/`microphone-2` @16, `microphone`/`microphone-5` @20 + 16, `text`/`text-4` @16, `paintbrush-2`/`paintbrush-4` @16, `rotate-ccw-8`/`-10` @24, `bell`/`bell-2` @20 + 16 (§2.3) | rule-register G7: **5 whole-outline pairs** identical at 16 only — `camera`/`camera-5`, `files`/`files-5`, `help`/`help-2`, `microphone-2`/`microphone-5`, `text`/`text-4`. `files`/`files-5` and `help`/`help-2` share their body at every master (this card), so they are whole-file identities at 16 with different interiors above; the body list and the file list measure different things |
| the `checkbox`/`check-circle` check at 16 | 6.5 against 6.58 wide (the file's own declared 0.08) | card 1.1 §3.3: residual **0.106** (best-fit, both axes) — the same drawings, two measures |
| `ban`'s slash against the ring | air **−1.5 · −1.5 · −1.25** (cap centre on the ring's centreline) | card 1.1 §2.5: half-length 9.249 against r 9.25 — "the cap sits on top of the ring". Consistent |
| the arrowhead vocabulary | two heads in composites + the `rotate` family's three (§1.8) | card 1.1 §2.7: 25 arrowhead classes at 24 outline. This card's count is of composites only |
| the square's carriers at 24 | **24** concepts in one `classify` class (§2.4) | card 1.1 §2.2: **26** outline concepts at 24. Not reconciled here |
| `volume-off`'s 1.25 filled channel | **declared nowhere**: the file's `gap:` note is 0.7 · 0.75 · 0.375 and covers the bar stub's junction with the solid, which is under 1.5 at all three masters; the channel is under 1.5 at 16 only (§1.3) | C22's dated note (`docs/07:62`): *"keeps its 1.25 channel as an agreed exception (C28, noted in its file)"*; card 1.13 §2.7 reads the note as this card does and names `plans/facing-gap.md:11-14, 59` as the record |

---

## 7. Handover — what this card measured but does not own

| finding | belongs to |
|---|---|
| P1–P8 as decisions | **5.2** decision agenda (fold P1 into docs/09's "badges crossing 22", P5 into its `help-circle` item, P6 beside card 1.1 item 12) |
| `docs/05`'s six conflicts and the exact edits (§1.6) | **1.16** stale statements |
| the shared-part persistence check and its catch list (§2.3) | the primitive-drift linter (`CLAUDE.md` open item 5), with card 1.1 §8 |
| `volume-off`'s filled bar touching the solid (air 0.01), `ban`'s cap on the ring | **1.7** contact grammar (F9), already recorded there |
| `alert-triangle-2/-4`'s 1.28 at 16 (declared, `docs/07:79`); `volume-off`'s undeclared 1.25 channel and its 0.5 off-centre at 16 (§1.3) | **1.13** exceptions ledger |
| the at-least-38 / 19 / 21 unshipped composites by kind (§1.5); `user-search`; the 30 under-populated bases | **1.10** families and completeness; **1.17** Polaris scope |
| the landscape 20×16 container as a third clean primitive (§2.4) | **1.1**'s "where the set is simply good"; **4.2** primitive sheets |
| `cursor-click`'s third cursor, `images`' smaller frame, `external-link`'s and `compose`'s smaller boxes (item 9) | **1.10**, and P3 |
| the beside-air spread and the arrow lengths in composites (§1.1, §1.2) | **3.2** findings register as kind-3 entries |
