# The eye-only list — card 4.4

**80 questions no tool can settle, each with the page to settle it on and the controls to set** —
from every "what only the eye can settle" section in the 24 card documents
(`plans/set-and-rules-audit.md:22`), the judging standard, the parameter map, the register's 87
kind-(3) rows (`findings-register.md:17-18`, `56b928b`), docs/09's six pending rulings and the plan's *is 20 a
master or a scale?* By surface: **the wall 19 · figure rows 15 · primitive sheets 6 · exceptions
sheet 5 · Library 2 · optical sheet 3 · the drawing board 13** (a second drawing comes first) **·
the live Polaris file 4 · surface needed 13.** What was asked there but is a decision, not a look,
is in §10, so nothing is dropped. **Most of the biggest questions have no page yet.** Ranked by
drawings touched (a concept counted as six; uncounted items aside), the twelve largest are the
wall's four whole-set looks (WA-1 – WA-4), the container radius (BO-1, board) and seven questions in
§9 (NS-1 – NS-7): the air floor, keyline or share, the background ladder, `alpha`, the junction
rule, the filled bearings and the 20.

Pinned tree `5933041` (485 concepts, 2,910 drawings). Nothing here is newly measured. Register rows are
cited by id (R-F1-02), as committed in `56b928b`; `node tools/audit/register-check.mjs
docs/audit/findings-register.md` prints the count by kind.

---

## How to use this list

Sit at one page and work down its items. Each item opens with what to look at and the two answers it
can have, then:

- **Set up** — the exact controls, as the page labels them.
- **Raised by** — every card that asked it (`path:line`), and the register rows it answers.
- **Touches** — how many drawings the answer moves, in the raising card's own unit.
- **Measured** — what a tool already settled, so the eye is asked only what is left.
- **Decides** — the proposal id, if a card made one. Every answer goes to the decision agenda (card 5.2).

**Order.** Within a surface, items run by drawings touched, a concept counted as six drawings (the
register's convention, `findings-register.md:51-53`), and a count stated per master or per style taken
as stated. Items whose source gives no count in drawings or concepts, and items about icons not yet
drawn, come last.

**Two warnings.** Where a card named the Library's At 16 strip, this list sends you to the wall
instead: the strip draws every icon as a vector at 16 CSS px in name order, with no 1× / 2× switch and
nothing to sort or highlight (`lab/library.html:237-240`, `:410-415`) — on a retina screen it shows
the 2× picture. And `lab/family-sheet.html` and `/lab/optical-shift.html` read the drawing board, not
shipped icons (`lab/family-sheet.html:46-48`; `lab/optical-shift.html:49`), so a question that named
the family sheet for shipped icons is sent to the figure rows below.

---

## 1. The wall — `lab/audit-wall.html`

The whole set at real pixels, rows of twenty. **Names are hidden and there is no search:** click a cell
and the side panel shows its name and numbers. Controls: **View** (`16 master · 16 px`, `20 master ·
20 px`, `24 master · 24 px`, `24 master forced to 16 px`) · **1× / 2×** · **Outline | Filled | Both**
(`F`) · **Squint** (`Off`, `1 px`, `1.5 px`, `2 px`, `2.5 px`; `S`) · **Sort** (`Ink mass`,
`Squint peak`, `Stroke count`, `Family`, `Name`, `Highlighted list first`; `Reverse`) · **Highlight**
(13 lists, each labelled with its source; `Fade the rest`) · **Flag** (`X`) with `Copy list` · theme.

**WA-1 · Twenty at 16, squinted: does every icon still name itself?** Yes → silhouette legibility
holds and nothing changes. No → the pairs that blur into one picture (add / close, alert / info) need
a redraw or lose a name.
*Set up* `View 16 master · 16 px` · `1×` then `2×` · `Outline` then `Filled` · `Squint 1.5 px` and
`Off` · `Sort Squint peak`; then `Highlight Look-alike seed pairs` with `Sort Highlighted list first`.
`X` flags an icon you cannot name. Card 1.5's "twenty random" mode was not built; the flags stand in for
its nearest-neighbour list (`lab/audit-data/wall.json`, `hosted`).
*Raised by* `findings-mass.md:482-511` · `references-field.md:436-437` · `judging-standard.md:83-89` ·
`enforcement-gap.md:381` · R-F10-01, R-F10-03 (sameness). *Touches* the whole set. *Measured* after a
1 px blur the closest pair across families is `info` / `alert-circle` at 0.9970 (1.0 = the same
picture); the closest overall, `users-2-wide` / `users-wide` at 0.9988, are one family meant to
differ by one figure — a shortlist, not evidence (`findings-mass.md:486-491`); 22 outline and 7
filled pairs are the same drawing at 16 (`:501`). *Decides* no id.

**WA-2 · Does the set read as generic, or as one character held throughout?** Character → nothing to
do. Generic → the field's first failure mode; start redrawing with what reads most like every other set.
*Set up* **First, the main session runs `node tools/refs.mjs`** (no argument; it writes the licensed
reference rows locally, never committed). Then `View 16` · `1×` · `Outline` then `Filled` · `Sort
Family`, beside `lab/character.html`'s reference rows (Polaris, Nucleo UI, Central).
*Raised by* `references-field.md:430-432` · R-F10-03 (generic). *Touches* the whole set. *Measured*
generic, overused, dated is the field's first failure mode, 12 of 53 statements
(`references-field.md:24-26`); no instrument exists and card 1.5 declined a verdict
(`findings-mass.md:484`). *Decides* no id (FD-1 for the drift half).

**WA-3 · In a 16 px row, do marks and objects read as one weight?** One weight → no rule, no change.
The marks drop out → the lever is `-large` marks, not the stroke.
*Set up* `View 16` · `1×` · `Sort Ink mass` · `Highlight Marks`; then `Squint 1.5 px`; then `Filled`.
*Raised by* `findings-mass.md:464` (M-1), `:466` (M-2) · `enforcement-gap.md:378-379` ·
`judging-standard.md:11-17` · R-F1-02, R-F1-03. *Touches* every concept — 136 marks against 288
objects (`findings-mass.md:22`). *Measured* the stroke is level, ink ÷ (line × stroke) 1.01 in the
median drawing (`:19`); marks sit at a median 11.1% of the canvas, objects at 21.7% (`:22`). *Decides*
M-1, M-2 (card 1.5's recommendations).

**WA-4 · Should the filled style be this uneven?** Yes → a disc is a disc; nothing changes. No → a
rule on how much of the canvas a filled shape may cover.
*Set up* `Filled` · `Sort Ink mass` · `Highlight Dense` · `View 16`; then `Both` to see each under its
outline.
*Raised by* `findings-mass.md:472` (M-5) · R-F1-05. *Touches* every filled drawing — 1,455 pairs
(`plans/set-and-rules-audit.md:96`). *Measured* 38% of the filled row sits near its median and 22% is
Dense — solid discs and cards (`findings-mass.md:26`). *Decides* no id (card 1.8's ground).

**WA-5 · The marks grow into the 16 — right, or heavy?** Right → small icons must fill more; write
it into C8. Heavy → hold the mark's share of the canvas instead.
*Set up* `Highlight Marks` · `Sort Ink mass` · `View 16 master · 16 px`, `1×`: do the most-grown marks
read heavy beside the objects? **What the wall cannot show:** the mark at 16 *without* the growth.
`24 master forced to 16 px` also draws a 1 px line (the page says so), so the eye cannot separate the
growth from the thinner line. The clean comparison — the 16 marks drawn at the 24's share with the
1.25 line — needs a board.
*Raised by* `findings-scaling.md:536` (S4), `:513-516` (E2) · `findings-mass.md:474` (M-6) ·
`parameter-map.md:150-151` · R-F1-04. *Touches* 136 mark concepts (`findings-scaling.md:34`).
*Measured* a mark's share of its canvas grows a median +15.0% from 24 to 16, worst +27.3% `x-small`
(`findings-scaling.md:34`); by ink per canvas `x-small` ×1.63, `minus-small` and `plus-small` ×1.56,
`x` ×1.54 (`findings-mass.md:474`). *Decides* S4.

**WA-6 · Have the 20 and 16 shed enough detail?** Enough → the 16 is as faithful as it should be.
Too little → the busiest icons drop parts earlier, under FD-3's detail rule.
*Set up* `Highlight Detail shed between masters` · `Sort Stroke count` · `View 24`, `20`, `16` in turn.
*Raised by* `references-nucleo.md:508-510` · R-F11-02, R-F11-03. *Touches* 30 concepts shed and 2 gain
(`findings-scaling.md:22`). *Measured* 453 of 485 outline concepts keep their subpath count 24 → 16
(`findings-scaling.md:22`); Nucleo's UI 18 → 12 differs in 20.6% (`references-nucleo.md:508`).
*Decides* FD-3.

**WA-7 · At 1×, do the stair-stepped diagonals and the half-soft icons read as faults?** No → the
cost C7 accepted in words stands. Yes → a placement rule for diagonals and interior lines.
*Set up* `View 16` · `1×` (not 2×) · `Outline` · `Squint Off` · `Sort Family`. No list holds the
diagonal-heavy outlines; the chevron, check and arrow families sit together under `Family`.
*Raised by* `findings-grid.md:371` (G-7) · `references-field.md:443-444` · R-F7-09. *Touches* 173
outlines at 16 (`findings-grid.md:350`). *Measured* those 173 are dark — darkest pixel 0.81–0.99 —
but stair-stepped (`:350`); 100 of 312 scorable outlines mix hard lines and lines with no solid pixel
(`:21`). *Decides* no id.

**WA-8 · Does `grid-3` read smaller than `grid`, `filter-2` than `filter`, `chart-bar` than
`chart-bar-2`?** No → nothing. Yes → numbered variants of one object share one keyline class.
*Set up* `Highlight Families split between a mark and a keyline` · `Sort Highlighted list first` ·
each `View`.
*Raised by* `exceptions-ledger.md:773-774` · `findings-scaling.md:518-520` (E3) · R-F2-25, R-F6-08.
*Touches* 6 families (`exceptions-ledger.md:732`) — 27 concepts on the wall's list
(`lab/audit-data/wall.json`, `split-families`). *Measured* from 24 to 16, `filter-2`, `text-2`,
`text-4`, `grid-3` and `grid-4` change their share of the canvas 15–20 points more than their own
siblings — `filter-2` +20.0% against its siblings' 0.0% (`findings-scaling.md:409-411`, `:518-520`).
*Decides* R-3.

**WA-9 · The off-centre drawings nobody has judged — does each read centred?** Yes → a stated
tolerance passes them. No → declare the offset or redraw.
*Set up* `Highlight Off centre, nobody has judged` · `Sort Highlighted list first` · each `View`;
click a cell for its description.
*Raised by* `findings-optical.md:590` · `judging-standard.md:24` · `severity-proposal.md:105`.
*Touches* 154 drawings by card 1.11 (the build's 2 dp box, larger axis) and 165 by card 1.12 (the
solved box, as a distance) — two definitions, neither picked (`findings-optical.md:698`).
*Measured* 44 state a reason and 110 nobody has judged; none is more than 0.5 off
(`findings-optical.md:59-60`, `:590`). *Decides* OC-4.

**WA-10 · May a number mark a difference that exists only in the filled style?** Yes → write G7
down; `ban` / `ban-2` and the `layout-*` threes stay. No → their outlines must differ, or one name
goes.
*Set up* `Highlight Same drawing, two names` · `Style Both` · `View 16` · `1×`; then
`lab/audit-primitives.html#layout` and `#twins`, `F`.
*Raised by* `rule-register.md:457` · `findings-filled.md:677-678` · `findings-primitives.md:1021` ·
`findings-mass.md:501`, `:517` · R-F10-02, R-F13-29. *Touches* 22 concepts (`rule-register.md:457`).
*Measured* nine groups ship an outline identical to another concept's at all three masters; only the
two globe / language pairs are identical filled too (`rule-register.md:342-346`); `ban` and `ban-2`'s
filled twins differ by 61% of ink (`findings-filled.md:650`). *Decides* G7; FM-6 (the naming half).

**WA-11 · The same-tag pairs: can a customer tell each pair apart?** Yes → each needs its own words.
No → fewer numbers.
*Set up* `Highlight Same-tag pairs` · `Sort Highlighted list first` · `View 16` · `Squint 1.5 px` on
and off.
*Raised by* `findings-families.md:581` (E-3) · `findings-angles.md:653` · `docs/09-rule-audit.md:93`
(ruling 4, its look) · R-F4-20. *Touches* 14 pairs (`findings-families.md:581`) — 22 concepts on the
wall's list (`lab/audit-data/wall.json`, `same-tags`). *Measured* `sparkle`, `-2`, `-3`, `-4` use four
point half-angles, 26.79 / 28.5 / 27.29 / 23.06 (`findings-angles.md:653`). *Decides* FM-2, FM-7.

**WA-12 · Does the 20 × 18 folder box read as the same size as the square and the landscape?** Yes
→ R-4 names it a keyline. No → the box gives.
*Set up* `Highlight The 20 × 18 folder box` (one row: `calendar`, `folder`, `camera`, `desktop`,
`briefcase`, `heart`, `mail`) · `Sort Highlighted list first` · `View 16`, then `24`.
*Raised by* `exceptions-ledger.md:770-772` · R-F2-36. *Touches* 18 concepts at 24, 17 at 20
(`exceptions-ledger.md:280`). *Measured* the box stands in eighteen concepts and no document
(`exceptions-ledger.md:706`). *Decides* R-4.

**WA-13 · The eight concepts whose air leaves no light pixel — does each still read?** Yes → accept.
No → redraw that channel.
*Set up* `View 16` · `1×` then `2×` · `Style Both` · `Sort Name`. No list holds them and the wall has
no search: in name order, click cells until the panel shows `book-2`, `bug`, `bug-2`, `desktop-6`,
`gear-3`, `key-4`, `trash`, `watch-2`. Then the exceptions sheet, group 11, for `trash`'s two warnings
in colour.
*Raised by* `findings-air.md:832` · `rule-register.md:464-465` and `enforcement-gap.md:382-383`
(`trash`) · R-F8-26, R-F8-27. *Touches* 8 concepts (`findings-air.md:281-282`). *Measured* 42 spans
leave nothing lighter than solid ink and 35 pass lint; 83 more read 0.70–0.995 grey
(`findings-air.md:278-284`). `trash`'s warnings are a lint false positive by C22 and docs/09, genuine
near-misses by card 1.7 — both stand (`plans/set-and-rules-audit.md:107-108`). *Decides* no id.

**WA-14 · Do the mass-lopsided objects read off centre — and which way?** Centred → nothing moves.
Off → that family goes to the optical sheet (OP-3). Mind the sign: the chevron logic would move a pin
*down* toward its point, the superseded docs/01 sentence moves it *up*.
*Set up* `View 24 master · 24 px` (the list was measured there, outline), then `16` · `Highlight
Mass-lopsided objects` · `Sort Highlighted list first`.
*Raised by* `findings-optical.md:608`, `:413-462` · R-F2-24. *Touches* the 45 outlines the list
lights — §3.3's table (`findings-optical.md:429-450`; `lab/audit-data/wall.json`, `lopsided`) — out
of 218 the screen flags at 24 (`findings-optical.md:420`). *Measured* the screen also ranks the
arrows, which Maruti judged and left centred (`:439`, `:453-460`). *Decides* no id until OP-3.

**WA-15 · Do the filled 2.0 lines that sit on half pixels read soft?** No → keep C17's centrelines.
Yes → move those lines to whole numbers — a position, not a weight; it reopens C17's 2026-09-20 menu
decision, so it is Maruti's, and the alternative is drawn on the board first.
*Set up* `View 16` · `1×` · `Filled` · `Sort Family`; the `menu`, `list-bullet`, `sliders` and
`rotate-ccw` families.
*Raised by* `findings-grid.md:365` (G-4) · R-F7-07. *Touches* 19 filled drawings at 16 and 18 at 20
(`findings-grid.md:365`). *Measured* 13.5% of the filled line-heavy length at 16 sits on the worst
possible position, where a whole-number centreline would score 0 (`:365`). *Decides* no id.

**WA-16 · Does each container `-small` read as a smaller icon?** Yes → keep. No → retire it by the
reasoning that retired `info-small`.
*Set up* `Highlight Container smalls` (all six pairs) · `Sort Highlighted list first` · `View 16` ·
`Outline` then `Filled`. Each family at 24 · 20 · 16 and real 16 px: `lab/figures.html` with
`?object=check-circle&group=check-circle&words=small`, then the same for `plus-circle`, `minus-circle`
and `x-circle` (the weakest small).
*Raised by* `findings-families.md:579` (E-1) · R-F2-26. *Touches* the six `-small` concepts
(`findings-families.md:529`). *Measured* the small steps its mark by 0.5–1.0 of a unit at 16; the
weakest, `x-circle-small` and `check-circle-3` / `-4`, step less than the retired `info-small`
(`:529-531`). *Decides* FM-5.

**WA-17 · The crowded line — detail, or a blot?** Detail → leave it (the wands' solid sparks are a
recorded decision). Blot → redraw.
*Set up* `Highlight Crowded line` · `Sort Ink mass` · `View 16` · `1×` · `Squint 1.5 px` on and off.
*Raised by* `findings-mass.md:468` (M-3) · R-F1-06. *Touches* 8 drawings (`findings-mass.md:468`).
*Measured* 12–24% of their line lies on top of other line; the wands hold the darkest local patch in
the set (`findings-mass.md:24`). *Decides* no id.

**WA-18 · The six outlines with an outer edge on a half pixel — does any silhouette read soft?** No
→ nothing. Yes → move that edge to a whole pixel.
*Set up* `View 16` · `1×` · `Outline` · `Sort Name`; no list holds them — click cells until the panel
shows `keyboard-2`, `map-pin`, `map-pin-2`, `sort-3`, `volume-low`, `volume-off` (FI-15 covers
`volume-off`'s placement).
*Raised by* `findings-grid.md:375` (G-9) · R-F7-11. *Touches* 6 drawings (`findings-grid.md:375`).
*Measured* each is a decided shape — odd dimensions kept centred, pointed tips (`:375`). *Decides* no
id.

**WA-19 · May a filled drawing be lighter than its outline?** Yes → nothing. No → a rule, and the
globe pair is redrawn.
*Set up* `Style Both` · `Sort Ink mass` · `Highlight Crowded line` (both globes and their `language`
aliases are in it) · `View 16`.
*Raised by* `findings-filled.md:675-676` · R-F13-30. *Touches* two filled drawings and their aliases.
*Measured* `globe-2-filled` at 16 has 29% less ink than its outline and no enclosed white where the
outline has four counters (`findings-filled.md:651`). *Decides* no id.

---

## 2. Figure rows — `lab/figures.html?object=…&group=…&words=…`

Built for the figure families, it takes any shipped family: one row for `object` and each numbered
`object-n`, columns for the figure, `group[-n]` and `group[-n]-<word>`, each at 24 · 20 · 16 at 1×
and then at real 16 px, 1× and 2×; `F` switches to filled (`lab/figures.html:110-113`, `:175-178`).

**FI-1 · Does the mark inside a ring still read as the same mark at 16?** Yes → "shortened, not
shrunk" stays a per-mark choice. No → one share for every ringed mark (then BO-4 picks the policy).
*Set up* `?object=plus&group=plus-circle&words=`, `?object=x&group=x-circle&words=`,
`?object=check&group=check-circle&words=` · Outline, then `F`.
*Raised by* `findings-primitives.md:1020` · `references-sf.md:704-707` · R-F6-05 (the mark half).
*Touches* 31 concepts that enclose a mark (`findings-grammar.md:220`). *Measured* two definitions:
the mark inside its container drifts −4.7% on average from 24 to 16 over 121 containers
(`findings-scaling.md:33`); as a share of the free mark it runs 0.700 → 0.593 → 0.542 for the plus
and 0.692 → 0.542 → 0.524 for the x (`findings-primitives.md:1030`). *Decides* no id.

**FI-2 · `play` at three corner tiers and three angle sets, `message` at five tiers — variants, or
drift?** Variants → each number keeps its own character, tagged. Drift → one tier and one angle set
per object.
*Set up* `?object=play&group=play&words=`, `?object=message&group=message&words=`,
`?object=megaphone&group=megaphone&words=`. (Card 1.2 asked for a triangle-and-bubble primitive sheet;
the primitive sheets have no such panel.)
*Raised by* `findings-corners.md:788` · `findings-angles.md:652` · R-F4-19. *Touches* the three plays
and three megaphones (`findings-angles.md:652`) and the `message` family (`findings-corners.md:788`),
which has seven concepts in the live Library. *Measured* the plays declare 58.7–60.8 / 60.0–62.4 / 59.5–61.2
degrees (`findings-angles.md:652`). *Decides* no id.

**FI-3 · Does `cursor-click`'s small cursor read as `cursor`?** Yes → a composite's base may be a
smaller redraw; write it down. No → the base keeps its object's size.
*Set up* `?object=cursor&group=cursor&words=click`; then `external-link`, `compose`, `images` the same
way.
*Raised by* `findings-grammar.md:592` · R-F5-11. *Touches* 8 concepts (`findings-grammar.md:557`).
*Measured* four bases are redrawn smaller and none is a scaled copy; `cursor-click`'s cursor is 12.25
against 18 (`findings-grammar.md:557-558`). *Decides* P3.

**FI-4 · Does the filled check's extra lean read, or is it invisible?** Invisible → nothing. It reads
→ the filled rule needs a clause for the short leg.
*Set up* `?object=check&group=check&words=small` · Outline, then `F`, at real 16 px.
*Raised by* `findings-primitives.md:1019`. *Touches* eight check variants (`:1019`). *Measured* the
filled twin is always more asymmetric than its outline, worst +9.9% on `check-2`
(`findings-primitives.md:590`). *Decides* no id.

**FI-5 · Seven concepts gain corners at 16 that the 24 does not have — right?** Yes → the small master
needed them. No → FD-3's "detail is dropped, never gained".
*Set up* `?object=cart&group=cart&words=`, `?object=camera&group=camera&words=`,
`?object=clipboard&group=clipboard&words=`; compare the 24 and 16 cells.
*Raised by* `findings-corners.md:747` (C-15) · R-F11-05. *Touches* seven concepts — `camera-3`,
`camera-4`, `clipboard-2` and the four carts — which the source counts as "six"
(`findings-corners.md:747`, `:277-278`). *Measured* each gains radii at 16; the carts gain at 20 too
(`:277-278`). *Decides* FD-3.

**FI-6 · `alert-triangle`'s rounder apex at 16 — a one-off, or "an acute container corner takes one
step more"?** One-off → nothing. A rule → write it.
*Set up* `?object=alert-triangle&group=alert-triangle&words=`, then `?object=home&group=home&words=`.
*Raised by* `findings-corners.md:790`. *Touches* the four `alert-triangle`s; the only other acute
containers are `home`'s roof and the triangles (`:790`). *Measured* nothing beyond the radius
(r2 at 16, `:790`). *Decides* no id.

**FI-7 · Does `alert-triangle`'s half-unit lift read as the sign sitting right, or as high?** Right →
record it as a construction lift (it wears `optical:` today). High → drop the lift.
*Set up* the same rows as FI-6, beside `?object=alert-circle&group=alert-circle&words=`.
*Raised by* `findings-optical.md:613`. *Touches* the four `alert-triangle`s. *Measured* the triangle's
centroid sits 2.04 units low in its box at 24 (`:613`); the lift is −0.5 at every master by design
(`:591`). *Decides* OC-2.

**FI-8 · Should `pin-2`, `-4`, `-5` and `wand` move onto a radius tier?** Yes → tier 2 like `pin` and
`pin-6`. No → record the off-tier shoulder as theirs.
*Set up* `?object=pin&group=pin&words=`, `?object=wand&group=wand&words=`.
*Raised by* `findings-corners.md:789`. *Touches* 4 concepts (`:789`). *Measured* their shoulders run
1 · 1 · 0.75 — the 24 value held at 20 — where `pin` and `pin-6` use tier 2 (`findings-corners.md:228`).
*Decides* no id.

**FI-9 · Does `checkbox`'s 1.5 hole hold at 16?** Yes → it is the set's one nested-radius rule;
write it. No → the hole follows the solid.
*Set up* `?object=checkbox&group=checkbox&words=` · `F`.
*Raised by* `findings-corners.md:791`. *Touches* the four `checkbox` concepts in the live Library.
*Measured* the hole is 71% of the solid's corner at 16 against 46% at 24 (`:791`). *Decides* no id.

**FI-10 · `keyboard`, `keyboard-2`, `watch` — one icon at three sizes?** Yes → leave them. No → hold
the box.
*Set up* `?object=keyboard&group=keyboard&words=`, `?object=watch&group=watch&words=`.
*Raised by* `findings-scaling.md:522-524` (E4) · R-F6-09. *Touches* 3 concepts (`:522`). *Measured*
aspect drifting 19.0 / 19.0 / 22.5%, details 7/6/6, 8/7/7, 4/4/3 (`findings-scaling.md:522-523`).
*Decides* no id.

**FI-11 · `search`'s heavy lens and swelling handle — the drawing you want?** Yes → write down the
third answer to "what a ring does when it fills". No → the ring keeps the outline weight.
*Set up* `?object=search&group=search&words=` · `F`; then the wall, `Filled`, `Sort Family`, to see it
among `plus-circle` and `ban`.
*Raised by* `findings-filled.md:670-674`, `:643`. *Touches* 3 concepts (`:673`). *Measured* the ring is
a whole unit thicker than the rule and the handle reaches 2.33× the line (`findings-filled.md:671-672`).
*Decides* no id.

**FI-12 · Does `code`'s filled slash match its outline?** Yes → nothing. No → redraw the filled slash.
*Set up* `?object=code&group=code&words=` · Outline, then `F`.
*Raised by* `findings-angles.md:701`. *Touches* `code`, `code-2`. *Measured* 2.79 degrees apart at 16,
on the one icon with a written angle rule (`:701`). *Decides* no id.

**FI-13 · Does `user-4` read as the same family as `user` … `user-3`?** Yes → nothing. No → `user-4`
moves to the portrait.
*Set up* `lab/figures.html` as it opens (`user` · `users`), the `user-4` row, real pixels 1× and 2×,
`F`.
*Raised by* `findings-families.md:580` (E-2) · R-F2-29. *Touches* 1 concept. *Measured* `user-4` is
18 × 18 on the square; the others are 16 × 20 on the portrait (`:580`). *Decides* no id.

**FI-14 · Does `watch-2` read centred with its crown standing proud?** Yes → keep the box off centre
and declare it. No → centre the box.
*Set up* `?object=watch&group=watch&words=`.
*Raised by* `findings-optical.md:611`. *Touches* 1 concept. *Measured* its mass centre sits +0.10
(`:611`); no note can declare it and it rests on exactly 0.50 (`findings-optical.md:594`). *Decides*
OC-2.

**FI-15 · `volume-off` at 16: the whole-pixel speaker 0.5 left, or a centred box on half pixels?**
The left placement reads balanced, as its file says → R-10 gives it a note. The centred box reads
better → redraw it on half pixels.
*Set up* `?object=volume&group=volume&words=low,none,x,off` · real 16 px 1× and 2× · Outline, then `F`.
*Raised by* `findings-optical.md:612` · `exceptions-ledger.md:739` · R-F7-11 (its edge). *Touches* 1
concept. *Measured* 0.50 off centre, passing only on lint's ±0.5 (`exceptions-ledger.md:708`).
*Decides* R-10, OC-2.

---

## 3. Primitive sheets — `lab/audit-primitives.html`

One panel per shared part (`#chevron`, `#dot`, `#star` …; `↑ ↓` step), every instance overlaid at
24, 20 and 16. **View** menu: Frame (`Fit to the part` / `Whole canvas`) and Draw (`Ink and
centreline` / `Ink only` / `Centreline only`); `F` for filled; each instance row shows 24 · 20 · 16 and
real 16 px at 1× and 2× (`lab/audit-primitives.html:289-300`, `:479`).

**PS-1 · Does the filled chevron read as the same chevron as its outline?** Yes → keep "the box is
exact, the angle gives" for the filled twin. No → the fork turns the other way: hold the angle and let
the box give, the choice the parameter map leaves to Maruti. (The same fork at 16 in the outline is
BO-10.)
*Set up* `#chevron` · `Draw Ink only` · `Frame Fit to the part` · `F` on and off; read the real 16 px
cells at 1×.
*Raised by* `findings-angles.md:700` · `findings-primitives.md:1016` · `references-untitled.md:244-245`
· `references-central.md:302-303`, `:307-308` · `parameter-map.md:178-187`. *Touches* 36 concepts, 216
files (`findings-optical.md:597`). *Measured* none of 40 chevrons holds its leg angle in the filled
twin at 16; the worst is 2.813° at 24 (`findings-filled.md:586-590`); the classic chevron's difference
at 16 is 0.583°, 0.03 px (`findings-angles.md:700`). *Decides* the fork (no id).

**PS-2 · Shared parts drift by under half a pixel — invisible?** Invisible → nothing is redrawn and
P7's persistence check stops it growing. Visible → redraw to one part.
*Set up* the nine parts' panels — `#door`, `#star`, `#check`, `#knob`, `#hook`, `#cradle`, `#shackle`,
`#diagonal`, `#landscape` · `Draw Ink and centreline` · `Frame Whole canvas`; click a class chip to
isolate it. `clipboard` / `clipboard-2` have no panel:
`lab/figures.html?object=clipboard&group=clipboard&words=`; nor do R-F3-07's near misses —
`package-2` / `-3` (`?object=package&group=package&words=`), `users-3-behind` / `-level` (the figures
page as it opens), `arrow-up-right-4` / `-5` (`?object=arrow-up-right&group=arrow-up-right&words=`).
*Raised by* `references-field.md:433-435` · `judging-standard.md:32` · R-F3-01, R-F3-04, R-F3-06,
R-F3-07. *Touches* 30
concepts in 9 parts (`findings-grammar.md:529-531`). *Measured* the largest drift is the shackle's
0.625 u = 0.42 px at 24, then the three frames 0.556 off the landscape container
(`findings-grammar.md:436`); most are under 0.333 (`:529-531`); `clipboard` and `clipboard-2` sit
0.333 px apart at 24 (`findings-primitives.md:977`). *Decides* P7, FD-1.

**PS-3 · Is the on-grid repeated dot the same dot?** Yes → take ⌀2.5 at 20 and ⌀2.375 at 16 from the
grid. No → declare the off-grid dot as an exception.
*Set up* `#dot`; the `more-horizontal` rows, real 16 px and 20.
*Raised by* `findings-primitives.md:1018`, `:926-928`. *Touches* 80 files, 6 concepts
(`findings-primitives.md:921-922`). *Measured* five off-grid radii, all from one dot stepping ⌀3 →
⌀2.7 → ⌀2.4 (`:921-923`). *Decides* no id.

**PS-4 · Should the glyph dot keep its own size at 20 and 16?** Yes → back to a distinct dot. No → ⌀2,
`building`'s window, is right.
*Set up* `#dot`; the 20 and 16 rows for `info`, `help`, `alert-circle` beside `building`, `printer-2`,
`list-bullet`.
*Raised by* `findings-primitives.md:1017` · R-F4-17. *Touches* 13 concepts (`findings-primitives.md:940`).
*Measured* ⌀2.5 at 24 becomes ⌀2 at 20 and 16 (`:940-941`). *Decides* no id.

**PS-5 · Do the three companion stars read as one star?** Yes → nothing. No → one star, one size
ladder.
*Set up* `#star` · the 20 and 16 rows, real pixels.
*Raised by* `findings-grammar.md:591`. *Touches* 3 concepts. *Measured* 7 · 5.5 · 4.5 against 7 · 6 ·
5 and 7 · 5.5 · 5 (`:591`). *Decides* no id.

**PS-6 · Does `volume-plus`'s plus read as the set's plus?** Yes → a modifier is a shipped mark size.
No → a modifier is a fraction of its object.
*Set up* `#plus` ("one or six?").
*Raised by* R-F5-12. *Touches* 3 concepts (`findings-grammar.md:540`). *Measured* it is the sixth plus
size at 24 — 8, where the smallest shipped plus is 9 (`findings-grammar.md:540`). *Decides* P1(b), P2.

---

## 4. Exceptions sheet — `lab/audit-exceptions.html`

The ledger's 20 groups (`plans/set-and-rules-audit.md:557`) in the left rail (`[` folds it; `,` `.`
step), each group's verdict and its "For the eye" names in the header, every note beside its drawing
at real 16 px, 1× and 2×; `F` for filled; `/` searches the open group's names and note text; a card
opens every file of that icon.

**XS-1 · Is a mark whose longest side is 18 still a mark?** Yes → R-2's ladder (18 or 15). No → it is
a silhouette and takes a keyline.
*Set up* group 2 "keyline: mark" · Show `By longest side at 24` · the 18 group; the header names
`cursor`, `send`, `maximize`, `text`.
*Raised by* `exceptions-ledger.md:775-776` · `severity-proposal.md:106` · R-F2-25. *Touches* thirty-two
concepts (`exceptions-ledger.md:775`). *Measured* 124 of 136 marks have a whole-number longest side at
24 and 69 are 18 or 15 (`:731`). *Decides* R-2.

**XS-2 · The sort letterforms: does the A's crossbar touch its legs or stop short, and do the twelve
get their own C-row?** Touch → the sort family keeps its overlap and an overlap note declares it. Stop
short → redraw the crossbar.
*Set up* group 10 "The sort family warnings" (every warned drawing, the paths in colour); then the
wall, `Sort Family`, where the twelve sit together (no view puts them beside `code` and `italic`, as
card 1.3 asked; NS-10's named row would).
*Raised by* `findings-angles.md:699` · `findings-air.md:834` · `rule-register.md:464-465` ·
`enforcement-gap.md:382-383` · R-F8-28. *Touches* 60 drawings, 12 concepts (`findings-angles.md:699`).
*Measured* 18 live warnings hang on the crossbar, and its numbers are grid residue, not a chosen value
(`findings-air.md:834`). *Decides* R-7.

**XS-3 · Does `table-filled` — six pieces where its outline is one — still read as the outline's
silhouette at 16?** Yes → the outer-edge rule holds in the eye; name the knockout that splits a shape
as an exception. No → `table-filled` is redrawn.
*Set up* group 1 "The free-text comment" · `/` then `table` · click the `table-filled` card for every
file · `F`.
*Raised by* `findings-filled.md:683-685`. *Touches* 1 concept. *Measured* `table` goes from one piece
to six (`findings-filled.md:684`). *Decides* no id. (Card 1.12's "what is a container when the filled
silhouette splits" is a definition, in §10.)

**XS-4 · Does `volume-off-filled`'s bar read as broken at 16?** No → the 2026-09-28 "keep as is"
stands, now judged by eye. Yes → close the junction.
*Set up* the panel "Asked of this sheet first" · `Show it in real pixels`.
*Raised by* `exceptions-ledger.md:777-781` · R-F8-30. *Touches* 1 concept. *Measured* 0.39 of white at each of
two junctions (`exceptions-ledger.md:777-778`); the junction pixel reads 0.637 — neither ink nor air
(`findings-air.md:454`). *Decides* no id.

**XS-5 · One cut-weight policy: by role, or one line wide?** By role → a cut is 1.5 / 2 / 2.5 by what
it cuts. One line wide → a cut is the line, floored at 1.5 — what the set already does at 24 and 20.
This is docs/09's pending check-cut-weight ruling; whether the 16 cut is 1.25 or 1.5 is NS-9.
*Set up* group 15 "Filled-cut and pair choices held by prose" · `F`; then the wall, `Highlight
Container smalls`, `Filled`, `View 16`, light and dark.
*Raised by* `findings-filled.md:679-682` · `references-sf.md:701-703` · `references-central.md:304-306`
· `rule-register.md:463` · `docs/09-rule-audit.md:22`, `:42`, `:93` (ruling 1) · R-F13-28, R-F13-33. *Touches*
every cut — ten widths at 24, seventeen at 20, sixteen at 16 (`findings-filled.md:334-335`); not
counted in drawings. *Measured* `check-circle`'s 1.5 cut is the lightest in the set and swaps in place
with `x-circle`'s 2.0 (`findings-filled.md:653`). *Decides* docs/09 ruling 1.

---

## 5. Library — `lab/library.html`

`/` to search, click for the detail panel (all three masters, enlarged, with metrics), `F` for filled.

**LI-1 · Do `gear`'s grid-built 29.74° and `star`'s off-grid near-30° read as the same angle?** Yes
→ the grid's run-and-rise construction is enough, and "30 and 60" on the allowed list can become run
and rise. No → `star`'s construction is needed; keep 30 and 60 and write how they are built.
*Set up* `gear`, then `star`, at 24 in the detail panel; then the wall, `View 16`.
*Raised by* `findings-angles.md:702`. *Touches* 21 concepts, 316 segments within 0.5 of 30 or 60
(`findings-angles.md:639`). *Measured* zero segments sit at exactly 30.000 or 60.000; `gear` uses the
7 : 4 ratio, `star` off-grid decimals (`:639`). *Decides* angles §7a-3.

**LI-2 · `plug-6`'s prong overshoot at 24 — character or defect?** Character → keep. Defect → trim it.
*Set up* `plug-6` in the detail panel at 24; then the wall at 16.
*Raised by* `findings-air.md:835` · R-F9-01. *Touches* 1 concept. *Measured* 0.195 of extra ink on the body's
outside edge, the set's only one (`:835`). *Decides* no id.

---

## 6. Optical sheet — `/lab/optical-shift.html`

**It needs the main session.** `node tools/optical-sheet.mjs <shape>… [--rec <shape>=<x>:<y>]`
writes the sheet to the drawing board, `lab/drafts/current.js` (`tools/optical-sheet.mjs:234`), which
the live drawing session owns. Run it when the board is free.

**OP-1 · Should the 16 shifts be rounded to the eighth grid, as C18 did for `info-3`?** Yes → one
value per shape, on the grid. No → keep the measured values.
*Set up* one shape on the sheet at real 16 px; exceptions sheet group 4 lists each declared shift.
*Raised by* `exceptions-ledger.md:782-783` · R-F7-14. *Touches* the 39 shifts at 16 that sit off the
eighth grid, of 45 (`exceptions-ledger.md:782`). *Measured* a different count of a different thing:
12 · 12 · 13 of 90 declared files per master have every ink-box edge on the grid
(`findings-optical.md:704`). *Decides* no id.

**OP-2 · The flat and steep chevrons' odd member: one magnitude per shape, or the picks as they
stand?** One magnitude → symmetrise. The picks → record them in C14 as eye picks.
*Set up* `node tools/optical-sheet.mjs chevron-up-2 chevron-down-3`, with rows at the sibling's value.
*Raised by* `findings-optical.md:610` · `docs/09-rule-audit.md:41`, `:93` (ruling 3) · R-F2-35.
*Touches* 36
drawings (`findings-optical.md:592`). *Measured* flat up 0.40 against 0.55, steep down 0.61 against
0.65; the measure gives one magnitude per shape (`:592`). *Decides* OC-6, docs/09 ruling 3.

**OP-3 · For each family WA-14 flags: which position reads balanced?** A position off the box centre
reads better → declare that shift. The centred box reads best → nothing moves.
*Set up* `node tools/optical-sheet.mjs <name> --rec <name>=<x>:<y>`, one family per sheet, candidates
from the lopsided table (`findings-optical.md:429-450`).
*Raised by* `findings-optical.md:608`. *Touches* only what WA-14 flags, of the 45 outlines it lights.
*Measured* the screen's number is not the recommendation; the sheet's rows are
(`findings-optical.md:459-460`). *Decides* no id.

---

## 7. The drawing board — `lab/icon.html`, a second drawing first

Each of these compares the shipped drawing with one that does not exist yet. The board's Compare tab
(rows at 96 · 48 · 24 · 20 · 16, Style dropdown) and In context panel show them once drawn. The board
belongs to the live drawing session: these run through the icon skill, one variable per board.

**BO-1 · Is the container radius right at 2.5?** Ours is 1.67× the stroke at 24 where the references
sit at 1.0×; tier 2 *is* their number. Keep 2.5 → write the three tiers down. Lower → every
container corner is redrawn.
*Set up* a board of tier-1 containers redrawn at tier 2, both styles. The wall has no tier-1 list.
*Raised by* `findings-corners.md:786` · `docs/09-rule-audit.md:23`, `:93` (ruling 2) ·
`rule-register.md:455-456` · `references-untitled.md:249-250` · `parameter-map.md:167-173`.
*Touches* 167 concepts with a rounded container corner at 24 — 89 entirely on the tier, 58 off it, 20
mixed (`parameter-map.md:64`); 381 · 357 · 330 corners and 281 · 259 · 237 filled contours
(`:170-171`). *Measured* 61.8 · 61.4 · 58.6% of container corners sit on the tier by card 1.2's count
(`findings-corners.md:49-51`) and 61.1 · 61.1 · 58.3% by card 2.3's (`references-nucleo.md:184`).
*Decides* docs/09 ruling 2.

**BO-2 · At 16, is the container corner right — or too soft, or too tight?** Right → keep the 16 tier.
Too soft (Fluent's reading: ours is the rounder) → tighten the 16 corners. Too tight (the 16 is already
10% tighter than the 24's proportion) → back to proportional.
*Set up* the wall, `View 16`, `1×`, for the set; then one container at 16 drawn with the shipped,
a tighter and a proportional corner. A Fluent row at real 16 needs a surface (local, licensed).
*Raised by* `references-fluent.md:460-463` · `findings-scaling.md:535` (S3). *Touches* 154 concepts
with a rounded container corner at 16 (`parameter-map.md:64`). *Measured* our commonest 16 contour
corner is 1.25 against Fluent's 0.50 (`references-fluent.md:460-461`); the 16 radius runs 10% tighter
than proportional (`findings-scaling.md:535`). *Decides* S3.

**BO-3 · Do three container tiers still read as three at 16 — and does `rotate-ccw-9` rightly drop a
tier?** Three → keep them. One → fewer tiers at 16, and `rotate-ccw-9`'s reason becomes a rule for
small containers.
*Set up* the wall, `View 16`, `1×`; the board for `rotate-ccw-9` at tier 1 beside tier 2.
*Raised by* `findings-corners.md:787`, `:745-746` · R-F2-27, R-F2-28. *Touches* 154 concepts with a
rounded container corner at 16 (`parameter-map.md:64`). *Measured* one tier step at 16 is half a pixel,
and all three tiers together span 0.875 px of tangent and 0.36 px of arc depth
(`findings-corners.md:746`); `rotate-ccw-9`'s square is 4.25 units wide (`:745`). *Decides* docs/09
ruling 2.

**BO-4 · The mark inside its container: an absolute inset, a proportional one, or neither?** Absolute
→ the inset is fixed in units at every master. Proportional → it scales with the container. Neither →
per icon, as today.
*Set up* `plus-circle` drawn three ways on one board. Card 1.4 also asked for the 121 containers
sorted by inset ÷ canvas; the wall has no such sort.
*Raised by* `findings-scaling.md:534` · `docs/09-rule-audit.md:62-63` · R-F6-05. *Touches* 121
container concepts (`findings-scaling.md:534`). *Measured* 10 hold the inset absolutely, 12
proportionally, 39 between (`:534`). *Decides* no id (docs/09 §4's missing rule).

**BO-5 · Is 2 of air right for a mark beside an object, or 1.5 as the through kind holds?** 2 → P2
records it for the `volume` family. 1.5 → one air for every modifier.
*Set up* `volume-x` redrawn at 1.5 beside the shipped 2, at 16.
*Raised by* `findings-grammar.md:593` · R-F5-09. *Touches* 25 beside composites
(`findings-grammar.md:534-535`). *Measured* the through kind holds 1.500 in 7 of 18; the beside kind
runs 1.6–4.5 at 24 (`:533-535`). *Decides* P2, P3.

**BO-6 · Is the filled weight step right at 24?** +1.0 bends the flat chevron's leg 2.81°; +0.5 is the
step at which our 20 holds its angles. Keep +1.0, or step +0.5.
*Set up* `chevron-down-2`, `chevron-down-3`, `check`, `arrow-down` at both steps; Compare, Style
dropdown, rows 48 and 24.
*Raised by* `findings-filled.md:665-669` · `parameter-map.md:140`. *Touches* 143 files per master
(`parameter-map.md:138`). *Measured* 8 of 40 chevrons hold the angle at +1.0 (24), 14 of 40 at +0.5
(20) (`findings-filled.md:588-590`). *Decides* no id.

**BO-7 · Does 20 / 70 become a permitted angle pair?** Yes → add it to the list. No → redraw toward
22.5, which the grid can build.
*Set up* `compass`, `cursor`, `send` at 24 · 20 · 16 and real 16, beside a 22.5 version.
*Raised by* `findings-angles.md:698` · R-F4-15, R-F4-16 (the vocabulary it belongs to). *Touches* seven
concepts (`:698`). *Measured* 82.49% of straight segments sit on 0 / 45 / 90 and 84% of the rest are
deliberate; only 232 of 2,464 off-axis segments use a small whole-number run and rise
(`findings-angles.md:650-651`). *Decides* angles §7a-3.

**BO-8 · Does a small solid read better than a small outline at 16?** Nucleo turns the compass
needle solid at its smallest size; we never have. Better → small counters may go solid at 16. Not
better → keep them outlined.
*Set up* `compass` with a solid needle at 16, beside the shipped.
*Raised by* `references-nucleo.md:511-512`. *Touches* one concept first. *Measured* nothing.
*Decides* no id.

**BO-9 · The symmetric pairs that could sit crisp — move them?** The crisp pair reads better → move
them. No visible gain → leave them.
*Set up* `chart-bar` and `menu-3` (outer lines at 4 / 12 and 5 / 11) and `sort` / `sort-2` redrawn on
5.375 / 10.625 beside the shipped, real 16 px, 1×. The `plus` and `minus` stay: symmetry pins them to
the midline (`findings-grid.md:361`).
*Raised by* `findings-grid.md:361` (G-2) · R-F7-10. *Touches* four outlines at 16. *Measured*
`chart-bar` and `menu-3` score 0.750, the worst band (`findings-grid.md:22`); `sort` 0.698 and `sort-2`
0.683 (`:198`, `:203`). *Decides* no id; `menu`'s centrelines are C17's 2026-09-20 decision.

**BO-10 · At 16 the outline held its box and let the leg angle give — up to 1.87° on
`check-circle-small`. Does it show?** No → keep "hold the box" (ours since 2026-09-20). Yes → the fork
turns: at 16, hold the angle and let the box give.
*Set up* `check-circle-small` and the classic `chevron-down` at 16 redrawn holding 45°, beside the
shipped, outline, real 16 px 1× and 2×.
*Raised by* `references-fluent.md:464-465` · `parameter-map.md:178-187` (the fork). *Touches* 10.6%
of our on-axis concepts (`references-fluent.md:24-25`); not counted in drawings. *Measured* the angle
gives only at 16 in either set, max 1.87°, p90 0.62° (`references-fluent.md:245`); the classic chevron
goes 45° → 45.5° (`parameter-map.md:181`). *Decides* the fork (no id).

**BO-11 · A badge in the filled style: a line glyph at the outline weight, or a solid disc with the
glyph cut?** Line glyph → the badge follows the parent's style. Solid disc → legible in either style,
the references' answer.
*Set up* the first `file-plus` drawn both ways, filled, In context; then the wall beside `file`,
`file-text`, `volume-x`. The `#badge` primitive sheet is empty — the set has no badge.
*Raised by* `findings-grammar.md:589` · `references-untitled.md:246-248` · `judging-standard.md:142` ·
R-F5-10. *Touches* at least 38 queued icons, 0 shipped (`findings-grammar.md:524`). *Measured* the
three references with badges all cut the base back (`findings-grammar.md:526-527`). *Decides* P1,
PL-7.

**BO-12 · Where does the badge sit: which corner, and may it hang past 22?** Bottom-right (ours) or
top-right (docs/09 §5); inside the box (the base shrinks) or past 22 (the base keeps its size).
*Set up* a plus, a dot and a check badge on `calendar`, `user`, `bell`, `folder` in all four corners at
16; `user-plus` drawn inside and past 22.
*Raised by* `references-sf.md:692-697` · `rule-register.md:458` · `docs/09-rule-audit.md:38`, `:93`
(ruling 5). *Touches* at least 38 queued icons (`findings-grammar.md:524`). *Measured* Apple has no
single corner (54 / 24 / 16 / 5) and its badge grows the ink box in 97.7% (`references-sf.md:692-695`).
*Decides* P1, docs/09 ruling 5.

**BO-13 · When the first `battery` is drawn: is a level that is a fill or a bar inside a body still a
C28 level?** Yes → C28 covers it, body identical and in place. No → it needs its own rule.
*Set up* the first `battery` board, its levels beside `volume`'s.
*Raised by* `findings-families.md:551-553` · R-F5-13. *Touches* 0 shipped, 8 queued
(`findings-families.md:551`). *Measured* nothing is drawn (`:553`). *Decides* no id.

---

## 8. The live Polaris file — Figma `XewrhAKrNGVZtikkpI5am9`, page `15721:27960`

Reference drawings that a scope vote hangs on. Open the file in Figma; one agent at a time per file.

**PO-1 · Is Polaris's `bolt` a lightning bolt (our `zap`) or Lucide's nut?** Bolt → the vote counts
for `zap`. Nut → it does not. *Set up* node `15721:28074`, twin `:28076`. *Raised by*
`references-polaris.md:505` · R-X-37. *Touches* one vote on one row. *Measured* only the name matches
(`references-polaris.md:490`).

**PO-2 · Does `clock-revert` change `history`'s keep-by-judgement verdict?** It is a history drawing →
`history` gains a vote. It is not → the verdict stands. *Set up* node `15721:28307`, beside our `clock`.
*Raised by* `references-polaris.md:504`. *Touches* `history`'s row. *Measured* nothing beyond the name.

**PO-3 · Is `page-report` the D23 `report`?** Yes → `report` gets its second vote. No → it stays "weak,
Lucide only". *Set up* node `15721:29133`. *Raised by* `references-polaris.md:506`. *Touches* the
`report` row. *Measured* nothing beyond the name (`:506`).

**PO-4 · Do `caret-up` and `caret-down` earn their rows on one product's evidence?** Yes → keep them.
No → cut them. *Set up* nodes `15721:28134`, `:28132`. *Raised by* `references-polaris.md:507`.
*Touches* queued #264 and #263. *Measured* Polaris is their only vote (`:507`). *Decides* with docs/09's
D23 ruling (PL-1 … PL-3).

---

## 9. Surface needed

No page shows these yet. Each says what the surface would have to show.

**NS-1 · Where does the air floor belong at each master?** Keep 1.5 everywhere → nothing changes.
An aligned 1.0, or air that follows the master as Nucleo's does → the rule is rewritten; lowering the
floor redraws no drawing (`parameter-map.md:158`). Settle NS-3 first.
*Surface:* card 1.7's three constructions side by side at real 16 px; `menu`, `file-text`, `calendar`
redrawn both ways (board); one concept at three versions beside a Nucleo UI 12 row.
*Raised by* `findings-air.md:830` · `references-nucleo.md:502-504` · `rule-register.md:459-462` ·
`parameter-map.md:161-163` · `references-sf.md:698-700` (a badge's halo) · `severity-proposal.md:102`
· R-F8-22, R-F8-23, R-F8-24. *Touches* every drawing (`references-nucleo.md:473`). *Measured* 941 of
2,910 drawings carry an air reading within 0.01 of 1.5 (`findings-air.md:372-374`), and 885 sit at
1.5 in the floor sweep (`:363-364`); at the floor a clear pixel row appears 67.9 / 65.1 /
41.5% of the time at 24 / 20 / 16 (`findings-air.md:241-243`); an aligned 1.0 renders better than an
unaligned 1.5 (`:830`). *Decides* no id (the alignment clause, `findings-air.md:462`).

**NS-2 · Should an icon hold its keyline, or its share of the canvas?** Keyline (today) → a square
icon shrinks against a circle icon from 24 to 16, and that is accepted. Share → the margin table
changes and the 20 and 16 are redrawn.
*Surface:* a square-keyline and a circle-keyline icon side by side, stacked at 24, 20 and 16 each at
its own size in one column; a toggle that redraws the 20 at a 1.5 margin; a Fluent row at real 16
(Fluent spends one more unit of margin at 16). The wall shows each view separately but no stacked
column and no toggle.
*Raised by* `findings-scaling.md:532-533` (S1) · `references-fluent.md:457-459`, `:466-467` (whether
the margin may be spent at all — a scope decision) · `references-nucleo.md:505-507` ·
`enforcement-gap.md:380` · R-F6-06. *Touches* every concept (`findings-scaling.md:453-454`); the
keylines hold 574 · 576 · 576 files per master (`parameter-map.md:145`). *Measured* 0 of 485 concepts
hold their share and 280 of 287 hold their keyline; square : circle reads 0.900 at 24 and 0.857 at 16
(`findings-scaling.md:451-457`). *Decides* S1.

**NS-3 · What lightness reads as background?** A grey of 0.25 reads as background → the 1.5 floor is
enough. Only a clear pixel does → the floor widens or gains an alignment clause. NS-1 is derived from
this answer.
*Surface:* the measured ladder drawn out, every eighth from 0.875 to 2.0, at real 16 px, each grey
labelled. *Raised by* `findings-air.md:829` · R-F8-33. *Touches* the 1,911 drawings with an air reading
(`findings-air.md:376`). *Measured* 1.0 → 0.5 grey, 1.25 → 0.375, 1.5 → 0.25, 1.75 → 0.125, 1.875 →
clear (`:829`).

**NS-4 · `alpha`: how much of a recession does the eye charge?** 0.75 matches the eye → the bearings
stand. Another value → every stroke drawing's optical bearing is republished.
*Surface:* one icon beside a text label at α 0.5, 0.625, 0.75, 0.875 and 1, bearings applied, at 24
and 48, on the top movers. *Raised by* `findings-optical.md:609` · `findings-metrics.md:638-641` ·
`parameter-map.md:175` · R-F12-12. *Touches* 1,385 of 1,882 stroke drawings' bearings at a quarter
step (`findings-optical.md:80-82`). *Measured* it has never been set against the eye (`:82`).
*Decides* OC-5.

**NS-5 · A junction lands on the line — write it as a rule? And are the 63 exceptions character or
drift?** Write it → the 63 are named as exceptions or redrawn. Leave it → the practice stays unwritten.
*Surface:* the 63 structural exceptions, each junction marked, outline and filled, at three masters.
The exceptions sheet's group 18 shows every pair lint skips, not these 63.
*Raised by* `findings-air.md:833` · `exceptions-ledger.md:784-785` · R-F9-02, R-F9-05, R-F9-06,
R-F9-07, R-F9-08, R-F9-09, R-F9-10. *Touches* 1,332 drawings with a junction (`findings-air.md:527-528`). *Measured*
95.0% of junctions land exactly on the other centreline, the same share at every master
(`findings-air.md:585`, `:609`); 985 drawings have a join lint skips (`exceptions-ledger.md:784`).
*Decides* no id (L-2, R-7).

**NS-6 · Should a filled icon read as stopping where its outline does — and a heavier line read
further in?** Yes → metrics F1 gives the filled drawing its outline's correction. No → each style keeps
its own. Judged together with NS-4.
*Surface:* NS-4's page, twins side by side beside a label at 24 and 48, with `italic`, `rotate-ccw-7`,
`check` toggled. *Raised by* `findings-metrics.md:631-634` · R-F12-14. *Touches* 1,026 shape-filled
entries with no correction (`findings-metrics.md:44`). *Measured* a filled `plus-circle` sits 0.71 px
further from its label than its outline at 24 px; `italic` → `italic-filled` jumps 1.62 px (`:44-52`).
*Decides* metrics F1, F4.

**NS-7 · Is 20 a master or a scale — what does drawing the 20 buy?** The drawn 20 reads better beside
its text → the three masters have their evidence. No visible difference → the 20's cost is unpaid; the
parameter map prices it (the three-master row is not reopened).
*Surface:* the drawn 20 (stroke 1.5) beside the 24 scaled by 0.833 (stroke 1.25), each in a line of the
text it sits with, 1× and 2×. The wall's `24 master forced to 16 px` view is the same test one size
down. *Raised by* `references-field.md:438-439`, `:493-501` (FD-5) · `judging-standard.md:117-127` ·
`plans/set-and-rules-audit.md:463-465`. *Touches* the 970 drawings at 20 (`findings-scaling.md:128`).
*Measured* 16 of 970 are the 24 resized (`:128`). *Decides* FD-5.

**NS-8 · Is the optical model's premise right — that a jump of one stroke is a counter, not an
edge?** Right → metrics F3 steadies the reading. Wrong → the model changes.
*Surface:* NS-4's page at real size with `hash-2`, `menu-arrow-left` / `-right`, `italic-filled`,
`filter-2-filled`. *Raised by* `findings-metrics.md:635-637` · R-F12-13. *Touches* 635 knife-edge
entries (`findings-metrics.md:47`). *Measured* exact mirror images publish top bearings 0.31 apart
(`:48-49`). *Decides* metrics F3.

**NS-9 · Does a white line read thinner than a drawn one — should a cut at 16 be 1.25 or hold 1.5?**
Thinner → keep 1.5 at 16 (C22, C23). The same → 1.25 at 16, Fluent's knockout. XS-5 is the policy the
answer feeds.
*Surface:* each cut at 1.25 and at 1.5 beside a drawn line of the same width, real 16 px, light and
dark. *Raised by* `findings-air.md:828` · `references-fluent.md:453-456` · `references-central.md:304-306`
· `parameter-map.md:162-163` · R-F13-31, R-F13-27, R-F13-34. *Touches* about 61 icons that cut 1.5 at 16
(`findings-air.md:828`). *Measured* a knockout and a parallel run give byte-identical pixels, so the
claim is perceptual (`findings-air.md:455`); filling closes air in 204 pairs (`findings-filled.md:652`).
*Decides* no id (Fluent T2).

**NS-10 · Does the door arrow read as the same arrow beside `arrow-right` in a 16 px toolbar?** Yes
→ keep 9.25, "what the box leaves". No → a modifier arrow takes a shipped arrow size.
*Surface:* a free row of named icons at real 16 px — here `login`, `logout`, `upload`, `export`,
`arrow-right`, `arrow-up`. The wall has no named row; `lab/figures.html?object=login&group=logout&words=`
shows the doors without the arrows. *Raised by* `findings-grammar.md:590` · R-F5-12. *Touches* 8
concepts — the four `login`s and four `logout`s (`findings-grammar.md:554`). *Measured* the door arrow
is 9.25, 0.77 of `arrow-right` (`:590`). *Decides* P1(b), P2.

**NS-11 · Is `play` wrong, or is everything else?** It held its angle and let its box shrink at 16,
where every other mark grows. `play` is right → leave it. `play` is wrong → it holds the box like the
other marks.
*Surface:* NS-10's named row with a media-control row — `play`, `pause`, `skip-*`, `chevron-right`,
`arrow-right`. *Raised by* `findings-scaling.md:537`, `:506-511` (E1) · R-F6-07. *Touches* 3
concepts. *Measured* `play-3` −15.6%, `play` / `play-2` −8.3% of share 24 → 16, against +15.0% median
for the other marks (`findings-scaling.md:506-508`). *Decides* no id.

**NS-12 · Is the curvature discount worth taking?** Worth it → the floor lets a cap-to-cap gap run
narrower than a parallel run. Not worth it → one floor for both.
*Surface:* a cap-to-cap pair swept 0.875 → 1.5 beside a parallel run swept 1.0 → 2.0, matched on
darkest pixel, at real 16 px. *Raised by* `findings-air.md:831` · R-F8-25. *Touches* every glyph mouth
and cap-to-cap gap; not counted in drawings. *Measured* such a gap reads 0.45× as dark as a straight
run of the same width (`findings-air.md:783`).

**NS-13 · Which text size is each master drawn beside?** One stated size per master → it goes into
docs/07. Left unstated → as today for the 24 and the 20.
*Surface:* each master beside candidate text sizes; the board's In context panel shows only the board's
icon. NS-7's page could carry it. *Raised by* `references-field.md:440-442` (FD-6). *Touches* no
drawing directly. *Measured* the 16's lighter line was chosen to sit beside 16 px text
(`references-field.md:440-441`). *Decides* FD-6.

---

## 10. Asked, but not a look — handed to the agenda

Each sat in an eye section or a kind-(3) row, and is answered by a decision, a definition, or nothing
yet.

| asked at | what it is | goes to |
|---|---|---|
| `references-polaris.md:503`, `:508`, `:509`; R-X-34, R-X-35, R-X-36 | one product's vocabulary as scope; 500 as size or ceiling; `help-circle` or `question-circle` | PL-4, PL-5, P5 / PL-8 |
| `findings-metrics.md:642-643` | what a container is when the filled silhouette splits into several shapes, or a line becomes a notch — a definition (`:628-629`) | metrics F7; the look at `table` is XS-3 |
| `findings-metrics.md:644-645`; R-F12-15 | should `shift` tell customers about C28's offsets | metrics F5, a shipping decision |
| `references-fluent.md:466-467` | may the margin be spent at all | scope; the look is NS-2 |
| `references-untitled.md:251-252` | a set whose line and solid are one drawing | already decided (heavier stroke) |
| `enforcement-gap.md:384-386` | is a number a principle or one icon's arithmetic | standing judgement (C24) |
| `findings-angles.md:654` (A-21) | which drift figure the register quotes | the register |
| `findings-corners.md:748-749`; R-F2-30, R-F2-31 | `thumbs-up`'s gap-held radius; `paintbrush`'s brush bellies | a note, not a look |
| R-F3-05 | the 20 × 16 landscape box is one drawing and unnamed | a naming; its drift look is PS-2 |
| R-F4-18; `findings-primitives.md:931-938` | `rotate-ccw`'s three arrowhead lengths, 0.005 px apart at 16 | the primitive-drift check |
| R-F7-06, R-F7-08, R-F7-12, R-F7-13 (G-1, G-3, G-6, G-5) | midline softness; soft placements; 2× at 16; 16 narrowly softest | already ruled, or decided when next touched |
| R-F11-04 (M-4) | measure a detail budget in line length | FD-3's measure |
| R-X-38, R-X-40; `docs/09-rule-audit.md:93` ruling 4 (the cap) | style words as names; `users-4` words; the variant cap | FM-7, FM-2 |
| R-F7-15 | a vertex from a tangent or an intersection has no grid rule | R-1, severity §4.4 |
| `docs/09-rule-audit.md:93` ruling 6 | the D23 revisions | PL-1 … PL-3; the looks are PO-1 … PO-4 |
| `severity-proposal.md:103-104` | the bend minimum; the keyline tolerance | grading decisions |
| `parameter-map.md:131-175`, Part 2 | "eye:" re-decisions if a number changes | conditional; the standing ones are NS-1, NS-2, NS-4, NS-9, BO-1, BO-6, WA-5, PS-1, BO-10 |

---

## 11. Where every card's question went

| source | its questions → item |
|---|---|
| `exceptions-ledger.md` §6 | :770 → WA-12 · :773 → WA-8 · :775 → XS-1 · :777 → XS-4 · :782 → OP-1 · :784 → NS-5 |
| `findings-angles.md` §7(3), §8 | A-17, A-18 → BO-7 · A-19 → FI-2 · A-20 → WA-11 · A-21 → §10 · :698 → BO-7 · :699 → XS-2 · :700 → PS-1 · :701 → FI-12 · :702 → LI-1 |
| `findings-air.md` eye section | :828 → NS-9 · :829 → NS-3 · :830 → NS-1 · :831 → NS-12 · :832 → WA-13 · :833 → NS-5 · :834 → XS-2 · :835 → LI-2 |
| `findings-corners.md` §11(3), §12 | C-13, C-14 → BO-3 · C-15 → FI-5 · C-16, C-17 → §10 · :786 → BO-1 · :787 → BO-3 · :788 → FI-2 · :789 → FI-8 · :790 → FI-6 · :791 → FI-9 |
| `findings-grammar.md` §4 | :589 → BO-11 · :590 → NS-10 · :591 → PS-5 · :592 → FI-3 · :593 → BO-5 |
| `findings-filled.md` §8 | 1 → BO-6 · 2 → FI-11 · 3 → WA-19 · 4 → WA-10 · 5 → XS-5 · 6 → XS-3 |
| `findings-families.md` §7, §8 | E-1 → WA-16 · E-2 → FI-13 · E-3 → WA-11 · item 10 → BO-13 |
| `findings-optical.md` §3.3, eye section | §3.3 → WA-14, OP-3 · :608 → WA-14, OP-3 · :609 → NS-4 · :610 → OP-2 · :611 → FI-14 · :612 → FI-15 · :613 → FI-7 |
| `findings-metrics.md` §12 | :631, :633 → NS-6 · :635 → NS-8 · :638 → NS-4 · :642 → §10 (the look is XS-3) · :644 → §10 |
| `findings-grid.md` §6 | G-1, G-3, G-5, G-6 → §10 · G-2 → BO-9 · G-4 → WA-15 · G-7 → WA-7 · G-9 → WA-18 |
| `findings-mass.md` §5, §6 | M-1, M-2 → WA-3 · M-3 → WA-17 · M-4 → §10 · M-5 → WA-4 · M-6 → WA-5 · M-7 → the wall sorts on share · M-8, §6 → WA-1, WA-10 |
| `findings-primitives.md` §7 | :1016 → PS-1 · :1017 → PS-4 · :1018 → PS-3 · :1019 → FI-4 · :1020 → FI-1 · :1021 → WA-10 |
| `findings-scaling.md` §11(3), §12 | E1 → NS-11 · E2 → WA-5 · E3 → WA-8 · E4 → FI-10 · :532, :533 → NS-2 · :534 → BO-4 · :535 → BO-2 · :536 → WA-5 · :537 → NS-11 |
| `references-fluent.md` §8 | 1 → NS-9 · 2 → NS-2 · 3 → BO-2 · 4 → BO-10 · 5 → NS-2 and §10 |
| `references-untitled.md` §10 | 1 → PS-1 · 2 → BO-11 · 3 → BO-1 · 4 → §10 |
| `references-central.md` §10 | 1 → PS-1 · 2 → XS-5, NS-9 · 3 → PS-1 |
| `references-nucleo.md` §7 | 1 → NS-1 · 2 → NS-2 · 3 → WA-6 · 4 → BO-8 |
| `references-sf.md` §6 | 1, 2 → BO-12 · 3 → NS-1 · 4 → XS-5 · 5 → FI-1 |
| `references-field.md` §7 | 1 → WA-2 · 2 → PS-2 · 3 → WA-1 · 4 → NS-7 · 5 → NS-13 · 6 → WA-7 |
| `references-polaris.md` §7 | :503, :508, :509 → §10 · :504 → PO-2 · :505 → PO-1 · :506 → PO-3 · :507 → PO-4 |
| `rule-register.md` eye section | :455 → BO-1 · :457 → WA-10 · :458 → BO-12 · :459 → NS-1 · :463 → XS-5 · :464 → XS-2, WA-13 |
| `enforcement-gap.md` §7 | :378 → WA-3 · :380 → NS-2 · :381 → WA-1 · :382 → XS-2, WA-13 · :384 → §10 |
| `severity-proposal.md` §4.3 | :102 → NS-1 · :103, :104 → §10 · :105 → WA-9 · :106 → XS-1 |
| `judging-standard.md` | F1 → WA-3 · F10 → WA-1 · the handover at :142 → NS-2, BO-1, BO-11, NS-9, WA-13, NS-5, NS-4, WA-1 · the 20 question → NS-7 |
| `parameter-map.md` | the fork → PS-1, BO-10 · :140 → BO-6 · :147 → NS-2, BO-4 · :150 → WA-5 · :161 → NS-1, NS-9 · :173 → BO-1 · :175 → NS-4 · the rest → §10 |
| docs/09's six rulings (`docs/09-rule-audit.md:93`) | 1 cut weight → XS-5 · 2 container radius → BO-1, BO-3 · 3 chevron shifts → OP-2 · 4 variant cap and tags → WA-11 and §10 · 5 badges past 22 → BO-12 · 6 D23 → PO-1 … PO-4 and §10 |
| the register's 87 kind-(3) rows | each is cited by id in the item it answers, or in §10 |

---

## Handover

| to | what |
|---|---|
| **5.2** the decision agenda | the 80 items as the "sheet to look at" for each ruling; §10's rows as decisions without a look |
| **the main session** | OP-1 … OP-3 need the board free (the optical sheet writes it); BO-1 … BO-13 need drafts through the icon skill; WA-2 needs `node tools/refs.mjs` run first |
| **a wave-4 follow-up, if Maruti wants one** | one control and four lists on the wall would turn seven partial set-ups into whole ones: a free row of named icons (NS-10, NS-11, BO-7's first look), and highlight lists for the eight no-light-pixel concepts (WA-13), the diagonal-heavy outlines (WA-7), the six half-pixel edges (WA-18) and the tier-1 containers (BO-1). A search box would spare the cell-clicking in WA-13 and WA-18. The largest gaps are the air sheets (NS-1, NS-3, NS-9, NS-12) and the bearings-beside-text page (NS-4, NS-6, NS-8) |
| **5.1** the reviewer | the figures shown here with two definitions and not picked: off centre 154 / 165 (WA-9); the mark inside its container −4.7% / 0.700 → 0.542 (FI-1); container corners on the tier 61.8 / 61.1% (BO-1); the floor's reach 941 within 0.01 / 885 at 1.5 (NS-1); the 16 shifts (OP-1); `trash`'s two warnings (WA-13) |

## Gate

- `node tools/lint.mjs` in the repository, before and after, byte-identical: `2910 drawings · 2848
  clean · 62 warned · 0 failed`.
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs`: 0 fail at every run (649 pass at
  the start; other cards' tests land in parallel). No test added; nothing was measured.
- Every `path:line` here resolves, and every figure in a *Touches* or *Measured* clause sits on or
  beside its cited line — checked with the register's own number reader
  (`tools/audit/register-check.mjs`, `extractRowNumbers`) by a scratch script, not committed.
- `shasum lab/manifest.json` begins `161c9314cdf8`.
- Surfaces were read in their HTML and checked in a browser tab of this card's own on the running lab
  server; the tab is closed and the one stored setting it changed (`exc-group`) is restored.
- **Files:** this document only.
