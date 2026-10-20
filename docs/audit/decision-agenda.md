# The decision agenda — card 5.2

**37 decisions for Maruti in one ranked list, and 14 technical calls Claude will make unless Maruti
objects.** Every proposal the audit made — the register's index (`findings-register.md:758-920`) and the
cards' own lists — merged where two ask the same question; docs/09's six pending rulings are folded in:
cut weight AG-23 · container radius AG-11 · chevron shifts AG-31 · variant cap and tags AG-22 · badges
past 22 AG-35 · D23 AG-36. **Nine expire at launch** (C9 locks names and numbers): AG-25, AG-27, AG-28,
AG-30, AG-32, AG-33, AG-34, AG-35 and part of AG-22. **Six rules bind every drawing** and head the list
(AG-1 to AG-6). After them the most drawings are touched by **`alpha`** (AG-7, 1,882) — the share of an
icon's thin edge that its published optical margin charges, so it looks evenly spaced beside a label,
never judged by eye; by **the slacks** (AG-8, 1,726) — lint lets a drawing sit up to half a unit off its
keyline or off centre without saying so, a number no document chose; and by **the filled bearings** (AG-9,
1,026). **How to use it:** rule one sitting at a time (§2). Sittings A and C need no page and can be done
today; B can be ruled on paper, with optional looks. Each decision gives what you will see, the options, a
recommendation and why, what it moves, where to look, and any figure behind it that did not reproduce.

Pinned tree `5933041` (485 concepts, 2,910 drawings; lint 2,848 clean · 62 warned · 0 failed). Nothing
here is newly measured; every number cites the line that holds it. Nothing changes until you rule.

---

## 1. How to read it

**The unit is drawings** (one file: one master, one style; 485 concepts × 6 = 2,910). Each decision's
count is taken, in this order of preference, from: the register's `drawings` column; a card's own count of
files or metrics entries (each is one drawing); a card's count of pairs × 2 (a pair is two drawings); a
card's per-master concept counts summed × 2 (each concept's outline and filled file at that master), marked
**×2 by master**; a card's count of concepts × 6 — every file of those concepts, the eye-only list's
convention — marked **×6**. Both conversions are upper bounds, and each decision's body shows its sum. A decision that answers several findings takes the largest; their union was
never counted. The table also shows each reach in its card's own unit.

- **Every drawing** — a rule that binds all 2,910 by construction (the register lists these apart,
  `findings-register.md:40-45`). Ranked first.
- **Counted** — largest first. Where two cards counted one population (⇄), the smaller ranks; both are
  shown, neither is picked.
- **Nothing shipped** — the decision is about queued icons, a scope list or a page. Ranked last.

Ties go to what expires at launch, then to what other decisions wait on, then to a ruling docs/09 or the
plan already named.

**Each decision:** what you will see · the options · **the recommendation and why** (Claude's view; you
decide) · **moves** — drawings touched, then what is redrawn by hand and what the tools recompute
(`parameter-map.md`) · **look at** — the eye-only item and page, or "no look needed" · **folds** — every id
it answers (where an id is split, the half is named) · **first** — what must be decided before it, always
in an earlier sitting or earlier in the same one · **launch** — whether C9 makes it expire · **did not
reproduce** — any figure behind it that `reprint-map.md` could not print again (that map is under a
closing check; its line numbers are today's).

**Where the waiting rulings went.** docs/09's six (`docs/09-rule-audit.md:93`): 1 AG-23 · 2 AG-11 · 3 AG-31
· 4 AG-22 · 5 AG-35 · 6 AG-36. The plan's five that expire at launch (`plans/set-and-rules-audit.md:177-187`):
`help` AG-28 · `login` AG-27 · the badge zone AG-35 · `checkbox` AG-32 · the `trash` / `check-circle` gaps
AG-34. docs/09 §4's five missing rules: container radius AG-11 · detail budget AG-19 · one filled-cut policy
AG-23 · the mark inside its container AG-13 · the modifier zone AG-35.

---

## 2. The ranked list, and the sittings

| # | Decision | Drawings | Reach, card's own unit | Launch | Sitting |
|---|---|---|---|---|---|
| AG-1 | Hold the keyline, or the share of the canvas? | every drawing | the keyline table (R-F6-01) | — | B |
| AG-2 | The gap rule: 1.5 units, or a clear pixel? | every drawing | 941 drawings at the floor (R-F8-05) | — | H |
| AG-3 | The angle rule: write the angles the set uses | every drawing | 17,091 segments (R-F4-08) | — | B |
| AG-4 | The grid rule: a third exception for computed corners | every drawing | 1,888 drawings behind the hatch (R-F7-02) | — | B |
| AG-5 | What stops an approval | every drawing | 2,910 linted, 62 warned, 0 failed (R-X-10) | — | B |
| AG-6 | The shipped format: build the outliner, or change the promise | every drawing | every shipped icon (R-X-42) | — | C |
| AG-7 | `alpha`: how much optical margin is charged | 1,882 | 1,882 stroke drawings (R-F12-12) | — | H |
| AG-8 | The slacks: centring, keyline, pair box, gap | 1,726 | 1,726 drawings (R-F2-06) | — | D |
| AG-9 | The filled bearings, and two premises of the optical model | 1,026 | 1,026 entries (R-F12-01) | — | H |
| AG-10 | Where ink meets ink: the junction rule | 985 ⇄ 1,084 | 985 files ⇄ 1,084 drawings (R-F9-03) | — | H |
| AG-11 | The container radius | 968 (×2 by master) | 167 · 163 · 154 outline concepts (`parameter-map.md:64`) | — | G |
| AG-12 | Marks grow into the 16: keep it? | 816 | 136 mark concepts (R-F6-02) | — | D |
| AG-13 | The mark inside its container, 24 → 16 | 726 ×6 | 121 container concepts (R-F6-05) | — | G |
| AG-14 | Sizes nobody wrote: mark sizes, shared boxes | 390 | 65 concepts, 390 files (R-F2-25) | — | D |
| AG-15 | What a filled twin keeps beyond its box | 288 (pairs ×2) | 144 pairs in 51 concepts (R-F13-13) | — | F |
| AG-16 | How far an eye pick may overrule the measured shift | 270 | 270 files (R-F2-10) | — | E |
| AG-17 | Write down seven conventions the drawings keep | 258 ×6 | 43 concepts (R-F5-09) | — | B |
| AG-18 | When weight changes: hold the box or the angle? | 240 | 40 chevrons ⇄ 120 pairs (R-F13-14) | — | F |
| AG-19 | Restraint: the detail rule and the parallel-stroke cap | 228 (×2 by master) | 43 · 39 · 32 concepts at 24 · 20 · 16 (R-F11-01) | — | F |
| AG-20 | Must a shared part stay shared at every master? | 180 ⇄ 228 ×6 | 30 concepts ⇄ 38 (R-F3-04; `reprint-map.md:1089`) | — | F |
| AG-21 | What `shift` and `container` tell customers | 166 ⇄ 177 | 166 ⇄ 177 entries (R-F12-15) | — | C |
| AG-22 | Numbered variants: a word each, and a cap? | 138 | 23 concepts, 138 files (R-X-01) | partly | D |
| AG-23 | The filled cut | 130 (at 24 only) | 130 files with a cut at 24 (R-F13-17) | — | E |
| AG-24 | C27: does a figure number promise the same head? | 120 ×6 | 20 concepts (R-F3-03) | — | F |
| AG-25 | May a number mark a filled-only difference? | 108 ×6 | 7 groups, 18 concepts (R-X-13; `reprint-map.md:993`) | yes | D |
| AG-26 | The letterform icons: record the sort family and `italic` | 60 | 60 drawings (R-F8-01) | — | E |
| AG-27 | `login` / `logout` numbering | 48 ×6 | 8 concepts (R-X-05) | yes | A |
| AG-28 | `help` → `help-circle` | 42 | 7 concepts, 42 files (R-X-07) | yes | A |
| AG-29 | Lines that could sit crisp at 16 | 19 + 18 | 19 filled concepts at 16 · 18 at 20 (R-F7-07) | — | D |
| AG-30 | Container `-small`s: does each read smaller? | 36 ×6 | 6 smalls in 6 families (R-F2-26) | yes | D |
| AG-31 | Chevron shifts: one value per shape? | 36 | 36 files (R-F2-35) | — | E |
| AG-32 | `checkbox`'s numbers follow the check | 18 | 3 concepts, 18 files (R-X-04) | yes | A |
| AG-33 | `language-2` / `-3`: two names for one drawing | 12 ⇄ 24 | 12 ⇄ 24 files (R-X-06) | yes | A |
| AG-34 | The `trash` and `check-circle` numbering gaps | 6 | 1 concept renamed, 6 files (`findings-families.md:613-614`) | yes | A |
| AG-35 | The badge zone (may a badge cross 22?) | nothing shipped | at least 38 queued names ⇄ 110 queued rows (R-F5-10) | yes | G |
| AG-36 | D23 revisions and the sheet's scope | nothing shipped | 1 queued row (R-X-08) | — | C |
| AG-37 | The customer page: rules and text sizes | nothing shipped | — | — | I |

**The sittings** — one batch each, in this order. Within a sitting, rule in the order listed; every
"first" a decision names is in an earlier sitting or earlier in its own.

| Sitting | Decisions, in order | Pages it needs | Without a page? |
|---|---|---|---|
| **A — Names that lock at launch** | AG-27 · AG-28 · AG-32 · AG-33 · AG-34 | none | **yes — today** |
| **B — Rules on paper** | AG-1 · AG-3 · AG-4 · AG-5 · AG-17 | none to rule. Optional: NS-2 (not built) for AG-1; BO-7 (board) and LI-1 (Library) for AG-3's two sub-questions; PS-3 (primitive sheets) for AG-4's dot. AG-17 rows d–f want the Library at 16, FI-3 (figure rows) and BO-5 (board) | **yes, on paper** — hold AG-17 rows d–f if you want those looks first |
| **C — What ships, and what is in scope** | AG-6 · AG-21 · AG-36 | none (PO-1 – PO-4 in the Polaris Figma file, optional) | **yes — today** |
| **D — The wall** | AG-8 · AG-12 · AG-14 · AG-22 · AG-25 · AG-29 · AG-30 | the wall; figure rows (FI-7, FI-14, FI-15 for AG-8; AG-30's families); exceptions sheet (XS-1 for AG-14); primitive sheets `#layout`, `#twins` (AG-25); a board for BO-9 (AG-29) and for WA-5's clean comparison (AG-12) | no |
| **E — Exceptions and optical sheets** | AG-16 · AG-31 · AG-26 · AG-23 | exceptions sheet; optical sheet (needs the drawing board free); the wall and FI-4 for AG-23 | no |
| **F — Figure rows and primitive sheets** | AG-15 · AG-18 · AG-19 · AG-20 · AG-24 | figure rows; primitive sheets; the wall (WA-19, WA-6); exceptions sheet (XS-3); a board (BO-10) | no |
| **G — The board, a second drawing first** | AG-11 · AG-13 · AG-35 | the board through the icon skill; figure rows (FI-1, FI-2, FI-6, FI-8, FI-9); primitive sheets (PS-6) and the wall's named row (NS-10, not built yet — CL-13) for the badge's mark size | no |
| **H — Pages not built yet** | AG-2 · AG-10 · AG-9 with AG-7 | the air sheets (NS-1, NS-3, NS-5, NS-12) and the bearings-beside-text page (NS-4, NS-6, NS-8), built by CL-13; the wall (WA-13); the Library (LI-2, for the junction rule's `plug-6`) | no — CL-13 first |
| **I — Last** | AG-37 | none (NS-13 optional) | after the rest |

---

## 3. Maruti's decisions, ranked

### Band 1 — rules that bind every drawing

#### AG-1 · Should an icon hold its keyline, or its share of the canvas?
**You will see** a square icon beside a circle icon read 0.900 : 1 at 24, 0.875 at 20 and 0.857 at 16 —
every drawing sits exactly on its keyline, and the pair still changes relative size by 5% between masters,
because the margin is 2 · 2 · 1. No drawing is at fault; it is one line of `tools/masters.mjs` (R-F6-01,
`findings-register.md:354`).
- **Options.** (a) Keep the keylines and write down the policy the drawings already follow: *hold the
  keyline, the detail and the corner tier; let the share of the canvas, the mark-to-container proportion
  and the angle give* (R-F6-10, `:358`). (b) Change the margin table so the share holds. (c) Spend the
  margin, as Fluent does (Fluent T4, `references-fluent.md:306`) — refused by two reference cards because
  our published bearings are a contract (Fluent R1, `:331-335`; Nucleo R2, `references-nucleo.md:616-619`).
- **Recommendation: (a).** Default to the rules: the swing is the specification, not drift
  (`findings-scaling.md:38-45`). Writing the policy down turns an accident into a decision.
- **Moves.** Every drawing (R-F6-01, R-F6-06). (a) redraws nothing. (b) redraws the files that touch the
  bound and those held to a keyline — 412 · 454 · 454 and 574 · 576 · 576 per master
  (`parameter-map.md:145`); the tools recompute the margin error and the keyline match.
- **Look at** NS-2, a square-keyline and a circle-keyline icon stacked at 24 · 20 · 16 — surface needed
  (`eye-only.md:698`), only if you doubt (a).
- **Folds** scaling S1, R-F6-01, R-F6-06, R-F6-10, Fluent T4 (margin half). **First** nothing.
  **Launch** no.
- **Did not reproduce.** "280 of 287 on their keyline to within 0.005" is a one-point curve test; exact to
  0.005 it is 269 (`reprint-map.md:1027`). "Two thirds of a pixel at 16 for a square icon": against
  proportion the square costs 0.00 px at 16 and −1.00 at 20; the 0.67 px is the circle's (`:1038`).
  Neither moves the recommendation.

#### AG-2 · The gap rule: 1.5 units, or a clear pixel of air?
**You will see** a gap drawn at exactly the floor read as a clear line of background only 41.5% of the
time at 16 (67.9% at 24, 65.1% at 20); the rest is a grey seam, because 1.5 of air holds a clear pixel at
only 5 of the 8 positions it can take against the pixel grid (R-F8-05, `findings-register.md:427`). 1.5 is
still the right number — the smallest grid-legal width that clears a 45° channel; the rule is missing its
alignment half (`findings-air.md:429-430`). The reasons written for it do not hold: docs/03's weight axis is
dead, the "survives a 16px render" comment is wrong, docs/08's 0.88 test is refuted (R-F8-07, R-F8-08,
`findings-register.md:429-430`).
- **Options.** (a) Leave it. (b) Keep 1.5 and add an alignment clause for new drawings — *a gap's wall
  sits on a pixel line at the master's own size*. (c) Rewrite the rule as *the air holds one whole pixel*
  (1.0 for an aligned straight gap, 1.414 at 45°, 1.5 the one safe constant); C19's glyph gap stops being
  an exception (`findings-air.md:460-475`) — but on the shipped set 1,017 of 2,545 spans fail it, in 647
  drawings, 321 of them fixable by a quarter-unit nudge (`findings-air.md:486-489`). (d) Lower the floor,
  or let the air follow the master as Nucleo's does — redraws nothing (`parameter-map.md:388-394`).
- **Recommendation: (b),** card 1.7's own reading: free on new drawings, it fixes the reason the rule
  gives, and leaves the 2,910 alone. Take the cheap part now — the 42 spans in 8 concepts that leave no
  light pixel and the 83 near-welds (`findings-air.md:499-501`) — on the wall. Answer NS-3 first: what grey
  reads as background decides how much the clause is worth.
- **Moves.** Every drawing (R-F8-07); 941 carry a reading at the floor (R-F8-05). (b) redraws none; (c) as
  above; raising the floor to 1.75 would redraw 357 · 397 · 369 (`parameter-map.md:383`).
- **Look at** NS-3, then NS-1 and NS-12 — surfaces needed (`eye-only.md:712`, `:685`, `:789`); WA-13 on the
  wall for the eight concepts (`:176`).
- **Folds** R-F8-05, -06, -07, -09, -22, -23, -24, -25, -26, -27, -33; severity §4.3 row 1 (the floor stays
  a warning until this is ruled — its measuring holes are CL-5); Nucleo T3; stale-statements 1.8;
  rule-register F1. **First** NS-3, a look in this sitting. **Launch** no.
- **Did not reproduce.** `book-2`'s ribbon "leaves no white pixel at all" — it holds a pure-background
  pixel at every master (`reprint-map.md:1050`); `book-2` stays among the eight for its other span.

#### AG-3 · The angle rule: write down the angles the set actually uses?
**You will see** 82.49% of straight lines exactly on 0/45/90 and most of the rest deliberate (R-F4-15,
`findings-register.md:299`) — while docs/01 §3 lists 0/45/90 plus 30 and 60, two angles the grid cannot
build (0 segments in 2,910 drawings; R-F4-11, `:288`), and treats a 45° leg that ends on an arc as a break
(379 segments, all within 0.064 px; R-F4-09, `:286`). Bare defaults that leave the axis: 46 by more than
0.5° and 29 by more than 2° (card 1.3) ⇄ 29 by more than 0.5° at 24 (card 1.14) (R-F4-12, `:289`); about
17 have no grant anywhere (R-F4-23, `:278`). Lint checks no angle (R-F4-08, `:285`).
- **Options.** (a) Rewrite §3 as *0/45/90, or a run and a rise on the grid, declared in the file* (C30's
  own form, R-8); name the near-miss band; record the 16's angle give as C7's cost, as C10 already does;
  and have the ~17 silent defaults declare their run and rise. (b) Keep §3 and redraw toward it
  `[needs measuring]`. (c) Leave it.
- **Recommendation: (a).** It describes what the set does and makes each off-axis angle a declared
  decision; every one of the 17 was approved by eye. **20 / 70** (`compass` ×3, `cursor`, `cursor-3`,
  `cursor-click`, `send`): record it as those icons' own declared grant — `cursor-click` adds its note —
  not as a fourth permitted pair; seven icons of three objects are their convention, not the set's.
  **30 and 60** become run and rise (7:4, 3:4 as used, `findings-angles.md:673-677`).
- **Moves.** Every drawing (R-F4-08). (a) redraws none, unless BO-7 sends 20 / 70 to 22.5 (seven
  concepts). No check recomputes — an angle check waits for this rule (`findings-angles.md:690-692`).
- **Look at** no look needed for the rule; BO-7 for 20 / 70 and LI-1 for 30 / 60 if you doubt them
  (`eye-only.md:596`, `:487`).
- **Folds** R-8, angles §7a-1, -2, -3, -4, -6, -8; R-F4-02, -05, -06, -08, -09, -10, -11, -12, -15, -16,
  -22, -23, R-F6-04; stale-statements 1.5, 3b.1; docs/09:24's verdict. **First** nothing. **Launch** no.
- **Did not reproduce.** 20 / 70 "held within 0.08°": 152 of the seven concepts' 162 segments are, the
  farthest 0.25° (`reprint-map.md:1011`). Concepts that declare a degree figure: 183 ⇄ 193 (R-F4-10); 193
  counts all three spellings (`reprint-map.md:1023`).

#### AG-4 · The grid rule: a third exception for computed corners?
**You will see** nothing today, and that is the problem: any comment turns lint's off-grid warning into a
"documented exception", every file has one, so the warning never fires. Behind it 1,888 drawings put a
straight-line coordinate off the grid — mostly corners computed as a tangent point or an intersection,
which §3 does not allow (R-F7-02, `findings-register.md:388`; R-F7-15). "Every decimal carries a comment"
is kept by no file (R-F7-03, `:389`); docs/09:28 called it dead in September.
- **Options.** (a) R-1: §3 gains a third exception — *a vertex computed as a tangent or an intersection
  may sit off the grid at the master's decimal ceiling* — and the per-decimal rule is dropped; then lint
  narrows its hatch from any comment to a declared note (CL-6), after the residue is measured. (b) Keep the
  rule and pull those corners to the grid `[needs measuring]`. (c) Leave the hatch.
- **Recommendation: (a),** in R-1's order — exception, measure, then narrow (`severity-proposal.md:117`).
  It writes down what two thirds of the set does and costs no drawing. **The repeated dot** at 20 and 16
  needs off-grid radii (r 0.6 and 1.35 at 20; 0.45, 0.575 and 1.2 at 16; R-F4-01,
  `findings-register.md:271`): declare it — the ⌀3 → ⌀2.7 → ⌀2.4 step was drawn by eye. If you would
  rather move it, ⌀2.5 at 20 is legal; at 16 the card's ⌀2.375 is not (it needs r 0.5625), the legal
  neighbours are ⌀2.25 and ⌀2.5 (`reprint-map.md:998`).
- **Moves.** Every drawing (R-F7-03); 1,888 sit behind the hatch, 1,967 counting arc values (R-F7-02).
  (a) redraws none; the residue after the exception is `[needs measuring]`. The dot: 80 circles in 24
  files — the card's "80 files" counted circles (`reprint-map.md:985`).
- **Look at** no look needed for the rule; PS-3 for the dot (`eye-only.md:400`).
- **Folds** R-1, R-F4-01, R-F7-01, -02, -03, -15, primitives item 6, severity §4.4 row 4, §4.5 row 1,
  §7-5; docs/09:28. **First** nothing (CL-6 waits on it). **Launch** no.

#### AG-5 · What stops an approval?
**You will see** a gate that fails a drawing on errors only: every geometric rule — gaps, bends, keylines,
centring, families, the pair box — is a warning; 2,910 linted, 62 warned, 0 failed (R-X-10,
`findings-register.md:662`). The sort family's 60 warnings came in through `approve` that way, so
`npm run check` now carries a permanent floor of 62 and the next real warning is invisible (R-X-03, `:650`).
- **Options.** (a) A committed warning baseline: `check` fails when the set of warnings changes, so an
  approval that adds one needs its note or a visible baseline line in its commit (severity §2,
  `severity-proposal.md:29-52`); then four rules that fire on no drawing today become errors — the pair
  box with `grows:` as its escape, every icon a pair, the size step, no size without a default
  (`:86-96`); and a pre-commit hook runs `check` (`:153-163`). (b) Keep today's gate.
- **Recommendation: (a).** It makes every geometric rule blocking without re-grading any and costs the
  2,848 clean drawings nothing. It is yours, not Claude's, because it changes what `approve` lets through,
  and the severity proposal is not actioned until you rule (`severity-proposal.md:4-5`). The floor, bends,
  keylines and centring stay warnings until AG-2, AG-8 and AG-11.
- **Moves.** Every drawing (R-X-10). Redraws none; the four promotions fire on zero drawings at the pin.
- **Look at** no look needed. **Folds** severity §2, §4.2 rows 1–4, §4.3 row 5, §6 (hook half), §7-1,
  §7-2, §7-7; R-X-03 (process half), R-X-10, R-X-41 (process half), R-X-44 (hook half), R-F13-12 (grading
  half). **First** nothing. **Launch** no.

#### AG-6 · The shipped format: build the outliner, or change the promise?
**You will see** the Settled table promise customers "outlined fills only — the stroked source stays
private" (`CLAUDE.md:186`), while no outliner, package or export exists and `dist/icons.json` ships the
stroked paths (R-X-42, `findings-register.md:687`).
- **Options.** (a) Keep the promise; run the outliner as its own build, plan first. (b) Change the Settled
  row and ship strokes.
- **Recommendation: (a).** The promise rests on the business model — we do not control render size — and
  nothing has shipped (0.0.1, private).
- **Moves.** Every shipped icon (R-X-42). The build recomputes all of them; nothing is redrawn; the
  outliner's own cost is `[needs measuring]`.
- **Look at** no look needed — a scope call. **Folds** R-X-42; docs/09:44. **First** nothing.
  **Launch** not a C9 lock, but it must exist before release.

### Band 2 — counted, largest first

#### AG-7 · `alpha`: how much optical margin do the published bearings charge?
**You will see** the margin that decides how far an icon sits from its label set by one number, 0.75,
never judged by eye; a quarter step either way moves 1,385 of the 1,882 stroke drawings by more than a
tenth of a unit (R-F12-12, `findings-register.md:563`).
- **Options.** 0.5 · 0.625 · 0.75 · 0.875 · 1, judged beside text at 24 and 48 on the top movers (OC-5).
- **Recommendation: no value — it is the eye's.** Keep 0.75 until judged, and judge it on the same page and
  in the same sitting as AG-9's first question: any `alpha` other than the one that makes outline and
  filled agree widens that gap (`findings-optical.md:674-679`).
- **Moves.** 1,882 drawings' published bearings, recomputed by the build; nothing redrawn.
- **Look at** NS-4 — surface needed (`eye-only.md:720`). **Folds** OC-5, R-F12-12; `CLAUDE.md` open item 3.
  **First** judged together with AG-9. **Launch** not a C9 lock; settle it before the metrics first ship.

#### AG-8 · The slacks: how far may a drawing sit from its rule without saying so?
**You will see** lint let a drawing sit up to half a unit off its keyline and off centre — numbers nobody
chose; at 16 that is 4% of the square (R-F2-06, `findings-register.md:202`). `map-pin` spends the whole
keyline slack, which is why its mark-to-container ratio is the worst in the set (R-F2-04, `:193`). Three
icons sit off centre on purpose and nothing can say so: `alert-triangle`'s lift (wearing an `optical:`
note), `volume-off` at 16, `watch-2` (R-F2-05, R-F2-20). And two rules say "exact" where the check allows
0.01: the pair box — "to 2 dp, no tolerance" (`CLAUDE.md:200`) — has 301 pairs on 142 concepts inside that
band (R-F13-12, `findings-register.md:592`); the gap floor, "a literal 1.5", passes 45 ⇄ 43 drawings at 1.49 (R-F8-12, `findings-register.md:434`),
`users` at 24 among them (R-F13-27).
- **Options.** *Centring:* (a) half a grid step (0.125 · 0.125 · 0.0625) undeclared, plus a new note for
  "placed here on purpose" that lint holds exactly (OC-4 with OC-2) — 38 drawings in 13 concepts declare,
  none is redrawn; (b) 0.01 — 152 declare (`findings-optical.md:663-672`); (c) keep ±0.5. R-10's other
  option, widening `optical:` to cover placements, keeps three meanings under one word. *Keyline:* (a) 0.01,
  as `box:` is held, with `map-pin` and `map-pin-2` declaring a box or sitting on the keyline; (b) keep
  ±0.5. *Pair box:* (a) write "within 0.01", what lint has always held (card 1.8: "say 0.01 and mean it",
  `findings-filled.md:601-605`); (b) make lint exact. *Gap:* (a) write the 0.01 into §6 as the measuring
  tolerance of a two-decimal reading; (b) drop it and re-read the 45 ⇄ 43 drawings (ledger R-9).
- **Recommendation: (a) for all four.** An agreed deviation gets a note lint reads and checks — your
  standing rule — and declaring is when the 110 off-centre drawings nobody has judged get judged. The two
  0.01s are how the checks read a two-decimal number, and every drawing inside them was approved by eye;
  they are here, not in Claude's list, because writing them widens two Settled rows.
- **Moves.** 1,726 drawings under the keyline check (R-F2-06). Off centre: 164 by lint's reading after the
  declared shift (R-F2-08, `findings-register.md:204`); on the published box 166 (card 1.11) ⇄ 177 (card
  1.12), both counting the 12 anchored (R-F2-09, `findings-register.md:205`). The pair box, two figures
  never picked: 1,100 of 1,455 exact (card 1.8) ⇄ 1,401 within 0.01 (cards 2.4, 2.1, 1.12) (R-F13-12).
  Redrawn: none. To declare at a 0.01 keyline: `[needs measuring]`; 18 keyline-held concepts are not exact
  to 0.005 at some master (`reprint-map.md:1037`).
- **Look at** WA-9 on the wall (`eye-only.md:138`); FI-7, FI-14, FI-15 for the three placed icons
  (`:302`, `:349`, `:356`).
- **Folds** OC-2, OC-4, R-9 (slack half), R-10, severity §4.3 rows 3–4, §4.4 rows 1–2, R-F2-04, -05, -06,
  -08, -09 (centring half), -20, R-F8-12, R-F13-12 (wording half), R-F13-27, ledger L-7, L-9, scaling D2.
  **First** nothing. **Launch** no.

#### AG-9 · The filled bearings, and two premises of the optical model
**You will see** (1) a filled `plus-circle` sit 0.71 px further from its label than its outline twin at
24 px (1.42 px at 48), with the same silhouette — every shape-filled drawing publishes no optical
correction, though the docs promise bearings for every icon (R-F12-01, `findings-register.md:545`;
R-F12-10); (2) a drawing moved by two thousandths of a unit change its published margin by up to 1.29
units, and the exact mirror images `menu-arrow-left` / `-right` publish top margins 0.31 apart (R-F12-13,
`:564`); (3) toggling `italic` to `italic-filled` move the icon 1.62 px at 24 though the box is the same
(R-F12-14, `:565`).
- **Options.** (1) A filled drawing reads as stopping where its outline does: run the same model on its ink
  (metrics F1) — or let each style keep its own reading. (2) Keep the premise that a jump of one stroke is
  a counter, and steady the reading (metrics F3) — or change the model. (3) Take the cap and break from the
  outline stroke so a heavier line does not read further in (metrics F4: 367 line-heavy entries move; the
  twin gap 1.63 → 0.61 at 24, `findings-metrics.md:552`) — or let each style read its own.
- **Recommendation: F1, F3 and F4.** A style toggle should not move the icon beside its label, and mirror
  images should publish mirror margins. F1 is the model's own premise for a shared silhouette and what the
  docs already promise — but it rests on what the eye sees (`findings-metrics.md:631-634`), so it is yours.
- **Moves.** 1,026 drawings (R-F12-01); F1 recomputes 1,026 entries, F3 every optical entry, F4 367;
  nothing redrawn.
- **Look at** NS-6, then NS-8 — surfaces needed (`eye-only.md:738`, `:756`).
- **Folds** metrics F1, F3, F4; R-F12-01, -02, -09, -10, -13, -14. **First** judged together with AG-7.
  **Launch** not a C9 lock; before the metrics ship.

#### AG-10 · Where ink meets ink: write the junction rule down?
**You will see** a stroke that ends on another land exactly on the other's centreline 95.0% of the time,
at every master (1,847 of 1,944) — a rule nobody wrote (R-F9-05, `findings-register.md:483`). Lint
exempts 98.8% of junctions and reads the rest as gaps (R-F9-03, `:474`). 63 junctions break the habit;
35 concept-styles change junction kind between masters (R-F9-07); `plug-6`'s prongs poke 0.195 past the
body at 24 (R-F9-01).
- **Options.** (a) Write the rule — land on the centreline; never stop short, never run through — and
  judge the 63 exceptions as character or drift. (b) Leave practice unwritten.
- **Recommendation: (a);** it ratifies what the set does. **`trash`'s two warnings** at 20 and 16: C22 and
  docs/09:31 read them as a covered junction, card 1.7 as genuine near-misses — both readings stand
  (R-F8-16, `:438`). The pixels show no light pixel in that "air" (`reprint-map.md:1191-1194`); if WA-13
  says the tab reads joined on purpose, CL-4 records it as a junction, as C22 already says.
- **Moves.** 985 drawings (card 1.13: a pair lint reads as joined) ⇄ 1,084 (card 1.7: pairs it drops)
  (R-F9-03). (a) redraws none until the 63 are judged.
- **Look at** NS-5 — surface needed (`eye-only.md:728`); LI-2 for `plug-6` (`:495`); WA-13 for `trash`.
- **Folds** R-F9-01, -02, -03, -05, -06, -07, -08, -09, -10, R-F8-16; ledger L-2. **First** AG-2, earlier
  in this sitting. **Launch** no.

#### AG-11 · The container radius *(docs/09 ruling 2)*
**You will see** containers already agree on three corner radii — the container 2.5 · 2 · 1.5, the detail
1.5 · 1.25 · 1, the bend at half the line — on 93.4–93.8% of container corners (`findings-corners.md:762`),
while docs/01 §5 lists three numbers at 24 only, calls the detail radius a "bend" (C10 says 0.75), and still
says the 20 and 16 values will be "recorded once they settle" (R-F2-12, R-F2-13,
`findings-register.md:208-209`). At 16 one tier step is half a pixel (R-F2-27).
- **Options.** (a) Keep 2.5 · 2 · 1.5 and write four values per master — container, detail, bend
  (= `bendMin`), sharp — each with its job (card 1.2's 1–3; Fluent T3 as the precedent for naming steps by
  role, method only). (b) Lower the container tier toward the references' (about one stroke): 381 · 357 · 330
  outline corners in the 89 · 86 · 74 concepts wholly on the tier are retyped, mostly by script, plus
  281 · 259 · 237 filled contours (`parameter-map.md:240-244`). (c) Fewer tiers at 16.
- **Recommendation: (a).** The rule already exists in the drawings; writing it down is the ruling. Then the
  off-tier families, one board each: `pin-2/-4/-5`, `wand`, `wand-2` and `wrench` ×3 onto a tier together
  (FI-8); `rotate-ccw-9`'s "Maruti to confirm" judged beside other small containers at 16 (BO-3) — a rule
  only if more than that one icon needs it; `alert-triangle`'s r2 apex at 16 kept as that family's recorded
  exception, not a fourth tier (FI-6); the numbered siblings whose tier differs — `play` ×3, `message` ×7,
  `chart-bar`, `pin` — variant or drift (FI-2). Do not reopen the bend tier (§11a-6).
- **Moves.** 167 · 163 · 154 outline concepts with a rounded container corner at 24 · 20 · 16
  (`parameter-map.md:64`), each with its filled twin at that master: (167 + 163 + 154) × 2 = 968 drawings,
  an upper bound; the register counts none (`[needs measuring]`). (a) redraws none; the 58 · 58 · 54
  concepts already off the tier are a decision each (`:251`).
- **Look at** BO-1 (tier-1 containers redrawn at tier 2), BO-2, BO-3 on the board (`eye-only.md:540`,
  `:552`, `:562`); FI-2, FI-6, FI-8, FI-9 on the figure rows.
- **Folds** docs/09 §6 ruling 2, corners §11a-1 to -6, Fluent T3, Nucleo T4, scaling S3, severity §4.4
  row 3, R-F2-01, -02, -03, -12, -13, -14, -15, -16, -27, -28, -32, R-F4-19, stale-statements 3b.3,
  docs/09:23. **First** nothing (CL-5's radius check reads it). **Launch** no.
- **Two figures, never picked:** container corners on the tier 61.8 · 61.4 · 58.6% (card 1.2, snapped to a
  sixteenth) ⇄ 61.1 · 61.1 · 58.3% (card 2.3, two decimals) (R-F2-16, `findings-register.md:212`).
  **Did not reproduce:** card 1.2's table reprints at a 0.02 snap, not the 0.025 it states
  (`reprint-map.md:1000`); the `pin` / `wand` / `wrench` "7 concepts" is a hand-picked group (`:1273`).

#### AG-12 · Marks grow into the 16 — keep it?
**You will see** a `plus` or an `x` take a bigger share of the canvas at 16 than at 24 — median +15.0%,
worst +27.3% (`x-small`), against +5.0% for keyline icons; at 16 the default `plus` fills the mark ceiling
exactly (R-F6-02, `findings-register.md:355`). C8 itself holds to 0.000 in 114 of 114 cells.
- **Options.** (a) Keep it, and say in C8 that small marks fill more on purpose. (b) Hold a mark's share
  instead — the 136 mark concepts redrawn at 20 and 16.
- **Recommendation: (a).** C8 is the best-kept rule in the set, and "small icons fill more" is docs/01's own
  argument. The wall cannot separate the growth from the thinner line, so a clean comparison needs a board.
- **Moves.** 816 drawings (R-F6-02). (a) none; (b) `[needs measuring]`.
- **Look at** WA-5 (`eye-only.md:97`). **Folds** scaling S4, R-F6-02. **First** AG-1 (sitting B).
  **Launch** no.

#### AG-13 · The mark inside its container, 24 → 16 *(docs/09 §4's missing rule)*
**You will see** a mark inside a ring take a smaller share of it at 16 — mean −4.7% over 121 containers,
worst −25.9% (`map-pin`); 10 hold the inset absolutely, 12 proportionally, 39 between (card 1.4) ⇄ the
plus in its ring at 0.700 → 0.593 → 0.542 of the free plus (card 1.1) (R-F6-05,
`findings-register.md:364`).
- **Options.** (a) An absolute inset. (b) A proportional one. (c) Per icon, as C18 says today — the mark
  is shortened, not shrunk.
- **Recommendation: (c),** written down as the rule; revisit only if FI-1 shows a ringed mark no longer
  reads as itself at 16.
- **Moves.** 121 container concepts × 6 = 726 drawings, an upper bound; the register counts none. (c) redraws none; (a) and
  (b) `[needs measuring]`.
- **Look at** FI-1 on the figure rows and BO-4 (`plus-circle` drawn three ways) (`eye-only.md:250`, `:572`).
- **Folds** R-F6-05, docs/09 §4, docs/08 §6.1. **First** nothing. **Launch** no.

#### AG-14 · Sizes nobody wrote down: name them?
**You will see** `grid` beside `grid-3`, `filter` beside `filter-2`, `chart-bar` beside `chart-bar-2` read
as two sizes in one family — `keyline: mark` drawings have no size rule (R-F2-25,
`findings-register.md:227`); and `camera`, `desktop`, `briefcase`, `folder`, `heart` all stand 20 × 18, each
by its own `box:` note — three keylines nobody named (R-F2-19, R-F2-36). `box:` drifts worse than what it
escapes: 9 of 56 more than 12%, up to 33.1% (R-F2-17).
- **Options.** R-3: numbered variants of one object share one keyline class. R-2: a mark's longest side is
  a whole number at 24 (124 of 136 already), and 18 or 15 unless a C-row gives the family its own ladder
  (69 of 136) (`exceptions-ledger.md:731-732`). R-4: the folder box (20 × 18 · 16 × 14 · 14 × 12) and the
  sort box (18 × 15 · 16 × 13.5 · 14 × 12) become named keylines; `box:` stays for the 22 one-offs (`:733`).
- **Recommendation:** R-3 and R-4 yes, after the wall; R-2's whole-number half yes, its 18-or-15 ladder
  deferred to XS-1 — with only 69 of 136 marks on it, it would be a new constraint, not a description.
- **Moves.** 390 drawings (R-F2-25); 338 on `box:` (R-F2-18). R-4 moves 210 drawings off `box:` (R-F2-19)
  and redraws none; R-3 redraws a family only if the wall shows two sizes.
- **Look at** WA-8, WA-12 on the wall, XS-1 on the exceptions sheet (`eye-only.md:127`, `:168`, `:435`).
- **Folds** R-2, R-3, R-4, scaling S5, scaling E3, R-F2-17, -18, -19, -25, -36, R-F6-08, stale-statements
  3b.12, ledger L-3, L-5. **First** AG-1 (sitting B) and AG-8 (earlier in this sitting). **Launch** no.

#### AG-15 · What must a filled twin keep beyond its box?
**You will see** the pair rule hold only the outer box, so a filled twin can keep the box exactly and still
draw `code`'s slash at another angle (2.79° apart at 16, on the icon C30 was written for; R-F13-05), taper
`trash-5`'s wall at 4.561° against C22's 4 (R-F13-07), thicken a ring by a whole unit (`search`,
`database`, `map-pin-4` — three answers for what a ring does when it fills; R-F13-03, R-F13-21), come out
lighter than its outline (`globe-2`, 29% at 16; R-F13-30), or split into pieces where a cut runs edge to
edge (`table` 1 → 6, 144 pairs in 51 concepts; R-F13-13, `findings-register.md:593`).
- **Options and recommendation, line by line.** (1) The twin keeps every angle its outline declares —
  yes; redraw `code`'s filled slash and `trash-5-filled` at 20 (FI-12). (2) A cut may split the silhouette
  — yes; name it in the outer-edge rule as C23's exception (XS-3). (3) A ring that fills — judge `search` on
  FI-11: if the heavy lens reads right, record it as the magnifier's own construction (one family is not a
  rule); if not, the ring keeps the outline weight. (4) A twin lighter than its outline — no rule until
  WA-19 says one is needed. (5) The filled style's own corners — no rule: r0.5 is the commonest of several
  values (549 of 1,387 corners, card 1.8 ⇄ 613 of 1,396 beside 0.75 ×306 and 0.25 ×121, card 1.2; R-F13-20,
  `findings-register.md:600`), and C23 records it for one icon.
- **Moves.** 144 pairs × 2 = 288 drawings; the register counts 1 (`trash-5-filled` at 20, R-F13-07).
  (1) redraws those two; (3) the `search` family only if FI-11 says so.
- **Look at** FI-12, FI-11, XS-3, WA-19 (`eye-only.md:337`, `:329`, `:454`, `:234`).
- **Folds** angles §7a-7 (`code` half), R-F13-03, -04, -05, -07, -13, -20, -21, -30, -32. **First**
  nothing. **Launch** no.
- **Did not reproduce.** `globe` goes 1 → 6 pieces, not 9 (`globe-2` is 1 → 9) (`reprint-map.md:1079`);
  `search`'s punch is one unit tighter at 24 but 0.5 and 0.75 at 20 and 16 (`:1084`).

#### AG-16 · How far may an eye pick overrule the measured shift?
**You will see** lint move its centring target by whatever an `optical:` note declares, unchecked; a probe
five units off passed (R-F2-10, `findings-register.md:206`). Every shipped chevron sits within 0.16 of
C15's measure and `play` within 0.06 (`findings-optical.md:622-638`).
- **Options.** (a) Warn when a declared shift sits more than 0.25 from C15's measure (OC-1, R-6) — all 234
  chevron and `play` files pass today. (b) Another margin. (c) No bound.
- **Recommendation: (a),** and one sentence for the eye: a pick beyond the margin stands when its file says
  why. The checks are box-centred by your ruling (`CLAUDE.md:197`) and carry no note, so the margin leaves
  them alone — but they are its counter-case: their measure says 0.45–0.65. Keep the 16 shifts as measured,
  not rounded to the grid (OP-1): C18 rounded one icon, and one icon is not a rule.
- **Moves.** 270 drawings — every declared shift (R-F2-10, R-F7-14); nothing redrawn.
- **Look at** OP-1 on the optical sheet, with the board free (`eye-only.md:508`).
- **Folds** R-6, OC-1 (rule half), severity §4.5 row 3, §5 row 2, §7-6, R-F2-10, -21, R-F7-14, ledger L-6.
  **First** AG-8 (sitting D: `alert-triangle` moves to the placed note). **Launch** no.

#### AG-17 · Write down seven conventions the drawings already keep
**You will see** nothing change in any drawing; each line turns a habit the set keeps into a sentence in
docs/07 or docs/01, so the next icon follows it on purpose. Strike any line you disagree with.

| | Convention | Evidence | Look first |
|---|---|---|---|
| a | C10's third case: a light filled file bends its strokes at the outline radius | 36 bends in 33 drawings, 11 concepts (R-F13-35, `findings-register.md:608`; `reprint-map.md:990`) | — |
| b | The filled twin carries the outline's shift, because C12 holds the box (OC-7) | 135 of 135 filled twins (`findings-optical.md:688`; R-F2-11) | — |
| c | C17 restated: a repeated element's gap is agreed per family and declared | "spaced by its own thickness" holds only for `more-horizontal`, `more-vertical`, `grid-3` at 24 and 20; the ratio runs 0.50 to 5.00 (R-F4-14) | — |
| d | C16 amended: the medium head through objects; the narrow head (8 · 7 · 6) for sorts beside glyphs; `refresh` / `rotate-ccw` keep their own (P4) | 17 concepts break the sentence as written (R-F4-03) | the two heads at 16 (Library) |
| e | The through rule: 1.5 of air where an arrow or tool meets its object, a literal; a composite's base may be drawn smaller when the modifier needs room, and its note says by how much (P3) | 7 of 18 at exactly 1.500 (R-F5-09); 8 concepts with a smaller base (R-F5-11) | FI-3 |
| f | The beside construction recorded as `volume`'s own, not a general rule (P2); `volume-minus` / `-plus` named in C28 as controls beside the speaker | one family (R-F5-12); 12 drawings in no rule (R-F5-08) | BO-5 |
| g | The 20 × 16 landscape box is one drawing, like the ring and the rounded square | 8 concepts, exact (R-F3-05) | — |

- **Recommendation: adopt all seven** — each describes the set, none redraws a drawing.
- **Moves.** 43 composites (R-F5-09) × 6 = 258 drawings, an upper bound; 33 drawings (R-F13-35); 12 (R-F5-08); the rest
  `[needs measuring]` or none.
- **Look at** FI-3, BO-5 (`eye-only.md:271`, `:581`); the heads have no page — the Library at 16.
- **Folds** OC-7, P2, P3, P4, primitives item 5, R-F2-11, R-F3-05, R-F4-03, -14, R-F5-08, -09, -11, -12
  (beside half), R-F13-35, stale-statements 1.6. **First** nothing. **Launch** no.
- **Did not reproduce.** Row a's "36 drawings — 12 concepts × 3 masters" counted bends as drawings: 36
  bends in 33 drawings, 11 concepts (`reprint-map.md:990`).

#### AG-18 · When the weight changes, hold the box or the angle?
**You will see** the filled flat chevron keep its outline's box exactly while its legs sit up to 2.813°
flatter at 24; at 16 the outline bent marks kept their box and their legs moved — the classic chevron
45° → 45.5°, up to 1.87° on `check-circle-small` (`parameter-map.md:204`); and for `chevron-*-2` the filled
bend hits C10's 2× cap, so the angle gives up to 5.626° (R-F13-14, R-F13-15,
`findings-register.md:594-595`). The cost is 0.236 px at 24 and 0.159 px at 16 (`findings-filled.md:597`;
`reprint-map.md:1086`). The plan asked for this to be a decision, not an accident
(`parameter-map.md:178-187`).
- **Options.** (a) Hold the box, let the angle give — today's practice — and write C10's cap clause: when
  the bend reaches 2× it stops and the angle gives. (b) Hold the angle and let the box give, as Central
  does; the pair-box rule breaks for those marks.
- **Recommendation: (a).** The box is what customers lay out by; the cost is a quarter pixel or less.
  `rotate-ccw-10`'s filled bend runs past the cap (r4.5 · 3.75 · 2.875 against 2.5 · 2 · 2; R-F13-08): bring
  it under, or record it in its file. The classic chevron's filled leg at 16 kept its old angle (0.583°,
  R-F13-06): leave it, by analogy with your 2026-09-20 ruling on the 16 filled corners — close C7's
  left-behinds set-wide or not at all (docs/09:45). That ruling was about corners, not angles, and card 1.3
  recommends closing this one (angles §7a-7, `findings-angles.md:687-689`); the choice is yours.
- **Moves.** 40 chevrons (card 1.8) ⇄ 120 pairs (card 2.4) (R-F13-14) — 40 × 6 = 240 drawings, and 120 × 2 = 240; 36 drawings at the cap (R-F13-15). (a) redraws only `rotate-ccw-10`'s filled files if brought under;
  (b) `[needs measuring]`.
- **Look at** PS-1, primitive sheet `#chevron`, and BO-10 on the board (`eye-only.md:373`, `:620`).
- **Folds** R-F13-06, -08, -14, -15, primitives item 2, angles §7a-7 (chevron half), the parameter map's
  fork; R-F13-02's wording is CL-8. **First** nothing. **Launch** no. **Not an option here:** `FILLED_WEIGHT`
  itself — fixed with the stroke (`plans/set-and-rules-audit.md:244`) — so "+0.5 at 24" (BO-6) is a look,
  not a ruling.
- **Did not reproduce.** Chevron variants 1 and 3 "held within ±0.25°": 1.302° at 16 (`reprint-map.md:987`);
  the classic chevron's "0.03 px" is 0.061 (`:1021`).

#### AG-19 · Restraint: the detail rule, and the parallel-stroke cap
**You will see** 453 of 485 outline concepts keep the same number of parts from 24 to 16, 30 shed and 2
gain (R-F11-02, `findings-register.md:520`); when a run of repeated parts cannot hold its spacing the set
drops a member rather than squeezing — 69 parts across 970 steps, stated nowhere (R-F11-03). docs/01's "no
more than 3 parallel strokes" was never checked: 43 concepts hold a stack of 4 or more at 24, nine of them
fitting neither docs/01 nor docs/09's reword (R-F11-01, `:514`).
- **Options.** (a) Adopt card 2.1's two sentences — *a part is dropped when rescaling would take its
  thinnest side below about one stroke at the new master; a run that cannot hold its spacing drops a member
  rather than compressing* (FD-3) — measured in line length, not parts (R-F11-04); and reword the cap as
  docs/09 proposed, naming the nine. (b) Leave both unwritten.
- **Recommendation: (a)** — it describes what the set does. Look at the concepts that gain corners at 16
  before writing "never gained".
- **Moves.** 43 concepts at 24 · 39 at 20 · 32 at 16 hold a stack (R-F11-01): (43 + 39 + 32) × 2 = 228
  drawings, each with its filled twin — an upper bound; 30
  concepts shed (card 1.4) ⇄ 3–6% of concepts differ (card 2.3) (R-F11-02). Redraws none.
- **Look at** WA-6, FI-5 (`eye-only.md:110`, `:286`). **Folds** FD-3, Nucleo T6, R-F11-01 to -05, mass M-4,
  docs/09 §4's detail budget. **First** nothing. **Launch** no.
- **Did not reproduce.** "Six concepts gain radii at 16": 16 do (`reprint-map.md:1007`).

#### AG-20 · Must a part that two icons share stay shared at every master?
**You will see** `checkbox` and `check-circle` share one tick byte for byte at 24 and 20 and split at 16;
the door of `home` / `store` / `building`, the star of `sparkle-2` / `-3` and `wand`, the knob, the hook and
the shackle drift at one master; `clipboard` and `clipboard-2` share a box but not a body (R-F3-01, R-F3-04,
R-F3-06, `findings-register.md:255-258`). Nothing says a shared part must stay shared.
- **Options.** (a) Yes, as a warning — never an error — naming both files and the drift in pixels at 16
  (P7): the first check of the primitive-drift linter, `CLAUDE.md`'s open item 5. (b) No rule.
- **Recommendation: (a),** with the check defined before anything is redrawn: as written — "shared at some
  master, not at all three" — it flags 209 outline and 139 filled concept pairs, not the three the card
  expected (`reprint-map.md:999`); most will be legitimate redraws at a smaller master. You see that list
  first. The near-miss checks follow as tooling (CL-10).
- **Moves.** 30 concepts in 9 parts (card 1.9) ⇄ 38 under one counting rule (`reprint-map.md:1089`; both
  stand, `:1199`) — 30 × 6 = 180 ⇄ 38 × 6 = 228 drawings, upper bounds; the register counts none. Redraws none until the list is judged.
- **Look at** PS-2, every instance overlaid, and PS-5 for the stars (`eye-only.md:385`, `:414`).
- **Folds** P7, FD-1 (rule half), primitives items 1 and 13, primitive-drift check 1, SF T3 (rule half),
  R-F3-01, -04, -06. **First** nothing. **Launch** no.
- **Did not reproduce.** "Largest drift 0.625 u (0.42 px), none visible": counted another way,
  `microphone-5`'s cradle drifts 1.008 u, 0.67 px at 24 (`reprint-map.md:1090`) — whether that shows is
  PS-2's question.

#### AG-21 · What `shift` and `container` tell customers
**You will see** `shift [0,0]` published for drawings whose ink is not centred — 166 (card 1.11) ⇄ 177
(card 1.12), C28's deliberate offsets among them; a customer who re-applies it lands up to 10 px off at 48
(R-F12-15, `findings-register.md:566`). On 12 entries `shift` reads as moving the ink when only a mark in a
ring moved (R-F12-08); `container` has no meaning when a filled silhouette splits (R-F12-17).
- **Options.** (a) Publish the drawn ink-centre offset beside the declared one, and say whether a
  declaration moves the whole ink or a mark in a ring (metrics F5); a container is a closed shape enclosing
  the rest, published as null when the filled silhouette splits or notches (F7's open half). (b) Leave them.
- **Recommendation: (a).** The field should say where the ink is; null is honest where there is no
  container. CL-7 applies F7's settled half — a container must be closed and enclose the rest — at the
  same time.
- **Moves.** 166 ⇄ 177 drawings (R-F12-15); 129 + 9 split or notched (R-F12-17). Recomputed by the build.
- **Look at** no look needed — a shipping call. **Folds** metrics F5, F7 (open half), R-F2-09 (published
  half), R-F12-08, -15, -17. **First** nothing. **Launch** not a C9 lock; before the metrics ship.

#### AG-22 · Numbered variants: a word for each, and a cap? *(docs/09 ruling 4)*
**You will see** 23 concepts whose search words stand against C9's style word — 14 same-tag pairs
(`sparkle-2/-3/-4`, `chart-pie`, `home-2/-3` …) and two descending sorts tagged "ascending" (R-X-01,
`findings-register.md:648`); 102 files with no tags, so searching "add" finds no `plus` (R-X-02); queued
names like `check-circle-dashed` and `chart-bar-stacked` where a style word could become a name (R-X-38).
- **Options.** *Words:* (a) every numbered shape gets a word of its own, from its file's prose, before
  launch (FM-2), reading C9 as asking that of numbered shapes; the bare marks are found by a small
  use-name table instead ("add → plus", CL-11). *Cap:* (a) no number yet — settle each queued style-word
  name before it is drawn (a number and a tag if it is a shape of its base, a word if it is an icon of its
  own) and revisit when the queue's 110 relatives land (FM-7); (b) a cap now.
- **Recommendation: (a) and (a).** A cap number cannot tell a different job from a different mood, which is
  the whole question (`findings-families.md:644-654`).
- **Moves.** 138 drawings (R-X-01); 102 (R-X-02); 24 (R-X-40); nothing redrawn.
- **Look at** WA-11 — can a customer tell each same-tag pair apart? (`eye-only.md:159`).
- **Folds** FM-2, FM-7, R-X-01, -02 (rule half), -38, -40, R-F4-20, docs/09 §6 ruling 4, docs/09 §5 item 3,
  families E-3. **First** nothing. **Launch** partly: the queued style-word names lock when they ship; tags
  do not.

#### AG-23 · The filled cut *(docs/09 ruling 1)*
**You will see** in a filled ring the tick of `check-circle` cut 1.5 wide, swapping in place with
`x-circle`'s 2.0 — the lightest cut in the set beside a heavier partner (R-F13-28,
`findings-register.md:615`). Cut widths at 24 run to ten values around three modes — minus 2.5, plus / x /
glyphs 2, check 1.5 (R-F13-17).
- **Options.** (a) Bring the tick's cut up to the medium cut that plus and x use — docs/09:22's
  recommendation, so swap partners no longer differ in cut. (b) A cut is one line wide, floored
  at 1.5: plus, x and glyph cuts come down. **And** the ink a cut leaves: which line is its floor — the
  outline's 1.25 or the filled line's 2 at 16? That is exactly what R-F13-34 leaves open: on the outline
  basis the thinnest reading, 1.13, still falls under; on the filled basis 9 of 13 measurable drawings do.
- **Recommendation: (a),** because C18 already calls the tick's 1.5 "for now" (docs/09:22). SF T6 is taken
  as a method only — measure each cut against the mark it cuts — not Apple's 1.035. For the ink a cut
  leaves: the outline line, as a warning — it is the weight the shape-filled style's lines keep.
- **Moves.** 130 files with a cut at 24, 20 and 16 not counted (R-F13-17). (a) redraws the tick cuts,
  `[needs measuring]`; (b) the 2 and 2.5 cuts — 33 and 30 files at 24 (`reprint-map.md:1075`). Record too
  that 0.88 stands for the medium cut's half, 0.875, at 20, where two decimals cannot write it: 31 + 18
  drawings carry it (R-F7-04, `findings-register.md:390`); the 18 at 16 are retyped exactly by CL-14.
- **Look at** XS-5 — exceptions sheet group 15, then the wall, filled, light and dark (`eye-only.md:470`);
  FI-4 for the filled check's lean (`:279`).
- **Folds** docs/09 §6 ruling 1, SF T6, Fluent T1, primitives item 9, R-F7-04 (20 half), R-F13-16, -17,
  -19, -28, -33, -34 (T1 half), stale-statements 3b.2, rule-register F9. **First** nothing — whether white
  at 16 stays 1.5 is settled (§6), so this does not wait for AG-2. **Launch** no.
- **Did not reproduce — and it moves the case.** "Only the tick fills in": with the raster defect bypassed,
  `plus-circle` also leaves no fully clear pixel at 20 or 16 (`reprint-map.md:1108-1109`), so (a) rests on
  consistency between partners, not on clear pixels. Also: "38 at 20 and 29 at 16 between or beyond the
  modes" is 78 and 95 (`:1077`); "no cut at 16 thinner than 1.2× the line" — 20 readings are (`:1078`); the
  filled check is up to 11.1% more lopsided than its outline among the card's eight, 16.7% over every check
  (`:991`).

#### AG-24 · C27: does a figure number promise the same head?
**You will see** `users-2` drawn with `user`'s head (⌀8 at 24), not `user-2`'s (⌀10); `user-2`, `-3`, `-4`
share one head; head sizes follow the arrangement, never the figure number (R-F3-03,
`findings-register.md:249`). The Settled row's "the number names the figure and travels with the object"
reads as a geometric promise. C27 still lists `users-heads`, retired 53 seconds after it was written (R-X-15).
- **Options.** (a) Naming: reword C27 so the number names the figure, not its geometry; strike
  `users-heads`; add what the drawings keep — the arrangement word names the box (FM-4). (b) Identity:
  redraw the groups so each carries its figure's head.
- **Recommendation: (a).** The 2026-09-23 renumbering reads as naming, and (a) redraws nothing. `user-4`
  standing on the square where `user` … `user-3` stand on the portrait is a separate look (FI-13).
- **Moves.** 20 concepts × 6 = 120 drawings, an upper bound; the register counts none.
- **Look at** FI-13 on the figures page (`eye-only.md:342`); the rule itself needs no look.
- **Folds** primitives item 11, FM-4, R-F3-03, R-X-15, R-F2-29, families E-2. **First** nothing.
  **Launch** no.

#### AG-25 · May a number mark a difference that exists only in the filled style?
**You will see** nine groups, 22 concepts, whose outline is identical to another's at all three masters —
`ban` / `ban-2`, the four `layout-*` threes, `building-3` / `-4`, `compass` / `compass-3` — differing only in
how they fill; `ban` and `ban-2`'s filled twins differ by 61% of ink (R-X-13, `findings-register.md:665`;
R-F13-29). Four decisions used this rule; it is written nowhere.
- **Options.** (a) Yes — write it into C9, with a `fill:` tag so the Library shows one icon with three
  fills (primitives item 3). (b) No — the outlines must differ, or one name goes.
- **Recommendation: (a)** — the working rule of four decisions and 22 concepts. The two globe / language
  pairs are identical filled too, so they are not covered either way (AG-33).
- **Moves.** The rule covers 18 concepts — the nine groups less the two globe / language pairs, which are
  identical filled too: 22 − 4 = 18 (`reprint-map.md:993`); 18 × 6 = 108 drawings. 98 drawings are identical
  under two names at 16 (R-F10-02, `findings-register.md:501`). (a) redraws none.
- **Look at** WA-10 (`eye-only.md:148`). **Folds** R-X-13, R-F10-02, R-F13-29, severity §4.4 row 6,
  primitives item 3, stale-statements 1.7, rule-register G7, mass M-8. **First** nothing. **Launch** yes —
  (b) retires a name, which is free only before launch.

#### AG-26 · The letterform icons: record the sort family and `italic` as drawn?
**You will see** the twelve `sort-alpha-*` / `sort-numeric-*` letterforms lean 21.09° and 15.04° and the
A's crossbar overlap its legs; they carry 60 of the set's 62 warned drawings, came through `approve` with no
note and no C-row, and no note can declare an overlap (R-F8-01, `findings-register.md:418`; R-X-03;
R-F4-04). `italic` leans 74.4–75.7° with 4.50 of ink drift; C30 pre-authorised it and no C-row records it
(R-F4-13).
- **Options.** (a) A C-row for the sort letterforms as drawn and one for `italic`; Claude adds a note for a
  deliberate overlap (R-7). (b) Redraw the crossbar to stop short like a letter, and the angles to run and
  rise.
- **Recommendation: (a)** — you approved them by eye; the rules should say so. Look at the crossbar first:
  touching or stopping short is a letterform choice no rule makes.
- **Moves.** 60 drawings (R-F8-01, R-X-03, R-X-41); (a) redraws none. CL-3 clears 12 warning lines first.
- **Look at** XS-2, exceptions sheet group 10 (`eye-only.md:443`).
- **Folds** R-7, angles §7a-5, severity §4.4 row 5, R-F4-04, -13, R-F8-01, -28, R-F9-04, R-X-03 (C-row
  half), R-X-41 (C-row half), stale-statements 4.1. **First** AG-3 (sitting B). **Launch** no.
- **Dated note, 2026-10-20.** The `sort-numeric` 9 was redrawn for balance (Maruti; `plans/sort-family.md`).
  Its straight tail is gone, so the 15.04° above no longer describes it: the new 9 stands upright
  (lean +0.3 · +0.3 · −0.9°). The six icons carry `glyph: numeral` (CL-3, done) and lint clean. The sort
  letterforms' warned drawings are now the `sort-alpha` ones only; the set has 38 warned drawings.

#### AG-27 · `login` and `logout`: keep their numbers?
**You will see** four doors shared exactly but cross-paired — `login`'s door is `logout-3`'s (R-X-05,
`findings-register.md:652`). The drawings follow a rule nobody wrote: `login-n` and `logout-n` share depth
and arrow direction and swap the door's side (R-X-11).
- **Options.** (a) Keep the numbers, and record the pairing as a C-row for this family (P6). (b) Renumber
  so `login-n` and `logout-n` carry the same door (primitives item 12) — one `queue.mjs rename` today,
  impossible after launch.
- **Recommendation: (a).** A sign-in button that swaps `login` for `logout` keeps its arrow; the C-row
  amends C9's reading for this family only, as C27 did for figures.
- **Moves.** 8 concepts × 6 = 48 drawings; the register counts none; nothing redrawn either way.
- **Look at** no look needed (`lab/figures.html?object=login&group=logout&words=` shows the doors).
  **Folds** P6, primitives item 12, R-X-05, -11. **First** nothing. **Launch** yes.

#### AG-28 · `help` → `help-circle`, and `info` → `info-circle`
**You will see** `alert-circle`, `check-circle`, `x-circle`, `plus-circle` and `minus-circle` name their ring;
`help` and `info` do not, and `help-square` and `info-square` are queued — the day they ship, bare `help` is
ambiguous (R-X-07, `findings-register.md:654`).
- **Options.** (a) `help-circle` and `info-circle` (P5). (b) `question-circle` — the spelling that shares a
  word, *question*, with all three reference sets — and `info-circle` (PL-8). (c) Keep the bare names; live
  Polaris says bare `info`.
- **Recommendation: (a).** Our convention names the ring; no reference spells `help-circle`, so it is our
  choice, not the market's. `ban`, `clock`, `globe`, `target`, `compass` keep their names — their ring is
  the object.
- **Moves.** 42 drawings, 7 concepts, renamed by `queue.mjs rename`; nothing redrawn.
- **Look at** no look needed. **Folds** P5, PL-8, R-X-07, stale-statements G6, docs/09:26. **First**
  nothing. **Launch** yes — free until launch.

#### AG-29 · Lines that could sit crisp at 16: move them?
**You will see** in 19 line-heavy filled concepts at 16 (18 at 20) a 2.0 line on a half pixel — the worst
landing, 50 · 100 · 50% — where a whole-number centreline would be crisp: 13.5% of that filled length
(R-F7-07, `findings-register.md:399`). `chart-bar`, `menu-3` and the sort pairs are symmetric pairs that
could sit crisp at 5.375 / 10.625 (R-F7-10, `:402`). `menu`'s centrelines are your 2026-09-20 choice
(C17, option B).
- **Options.** (a) Move the filled 2.0 lines to whole numbers — a position, not a weight — and the
  symmetric outline pairs to crisp positions. (b) Keep C17's centrelines.
- **Recommendation: look first.** If WA-15 shows the half-pixel lines soft, take (a) for the filled lines —
  the largest avoidable crispness cost the audit found; move the outline pairs only if BO-9 shows a gain.
  The other soft placements are fixed when each icon is next touched, not by decree (R-F7-08).
- **Moves.** 19 + 18 filled drawings (one per concept at 16 and at 20; the register counts none); 9
  outline drawings (R-F7-10).
- **Look at** WA-15, BO-9 (`eye-only.md:198`, `:611`). **Folds** grid G-2, G-3, G-4, R-F7-07, -08, -10.
  **First** nothing. **Launch** no.

#### AG-30 · Container `-small`s: does each read as a smaller icon?
**You will see** a container's `-small` step its mark by 0.5–1.0 of a unit at 16; `x-circle-small`
(1.0 · 0.5 · 0.5) and the `check-circle-3` / `-4` smalls (0.72 / 0.78 at 16) step less than the
`info-small` you retired for being "a single pixel" (1.0) (R-F2-26, `findings-register.md:228`).
- **Options.** (a) Keep each that reads smaller at 16. (b) Retire any that does not — the whole family, as
  `info-small` went (FM-5).
- **Recommendation:** look first; retire what does not read smaller. It is free before launch, not after.
- **Moves.** 6 smalls in 6 families: 6 × 6 = 36 drawings; the register counts none; retiring deletes files,
  redraws nothing.
- **Look at** WA-16 and the figure rows it names (`eye-only.md:207`). **Folds** FM-5, R-F2-26, families E-1.
  **First** nothing. **Launch** yes.

#### AG-31 · Chevron shifts: one value per shape? *(docs/09 ruling 3)*
**You will see** the flat chevron pointing up shifted 0.40 where its three turned siblings take 0.55, and
the steep one pointing down 0.61 against 0.65 — about a tenth of a pixel at 16 (R-F2-35,
`findings-register.md:234`). They are C14's eye picks; C15's measure gives one magnitude per shape.
- **Options.** (a) One magnitude per shape, the measured value as the tagged row (docs/09:41). (b) Keep the
  picks and record them in C14 as eye picks.
- **Recommendation: (a)** — the four directions are one drawing turned, and docs/09 already called the
  spread scatter, not design. (b) is fine if the sheet shows the odd member reads better; then C14 says so.
- **Moves.** 36 drawings (R-F2-35); only notes change, nothing is redrawn.
- **Look at** OP-2, optical sheet, with the board free (`eye-only.md:516`). **Folds** OC-6, R-F2-35,
  docs/09:41, docs/09 §6 ruling 3. **First** AG-16, earlier in this sitting. **Launch** no.

#### AG-32 · `checkbox`'s numbers follow the check
**You will see** `checkbox-2`, `-3`, `-4` carry `check-circle`'s `-3`, `-4` and `-small` ticks, against C9's
composite clause — a composite is numbered after the shape it uses (R-X-04, `findings-register.md:651`).
The clause is written only in docs/07, not in `CLAUDE.md` or the icon skill (R-X-14).
- **Options.** (a) Rename `checkbox-2` → `-3`, `-3` → `-4`, `-4` → `-small`; `checkbox-2` left unused beside
  `check-circle-2` (FM-1(a)). (b) Drop the composite clause; `check-circle`'s own numbering loses its reason.
- **Recommendation: (a),** and write the clause where drawing sessions read it.
- **Moves.** 18 drawings renamed, 3 concepts; nothing redrawn.
- **Look at** no look needed. **Folds** FM-1, R-X-04, -14. **First** nothing. **Launch** yes.

#### AG-33 · `language-2` and `language-3`: two names for one drawing
**You will see** `language-2` and `language-3` are `globe` and `globe-2` under a second name, identical at
all three masters in both styles (R-X-06, `findings-register.md:653`; R-X-12).
- **Options.** (a) Retire the two names; "language, translate" join `globe`'s tags (primitives item 4,
  SF T8). (b) Keep them, and say in C9 that a number may also mark a different name (FM-6).
- **Recommendation: (a).** Default to the rules: C9 says a number marks a different drawing, and C29
  retired four `-3`s on weaker evidence; a tag finds the globe for "translate". (b) widens C9 for one pair.
- **Moves.** 12 drawings (card 1.1, the alias files) ⇄ 24 (card 1.10, all four concepts) (R-X-06);
  retired by `queue.mjs drop`; nothing redrawn.
- **Look at** no look needed. **Folds** FM-6, primitives item 4, SF T8 (naming half), R-X-06, -12.
  **First** nothing: AG-25 does not reach these two pairs whatever it decides, because they are identical
  in the filled style too. **Launch** yes.

#### AG-34 · The numbering gaps: `trash` 2–4, `check-circle` 2
**You will see** customers would get `trash` and `trash-5` with nothing between, and no `check-circle-2`
(R-X-39, `findings-register.md:718`).
- **Options.** `trash`: close it (`trash-5` → `trash-2`, one concept, 6 files) or keep it (C22 holds the
  numbers in case an interior returns). `check-circle`: keep 2 empty with a dated note pointing at C9's
  composite clause, or draw the long sweep in the ring.
- **Recommendation:** close `trash` — C4's four interiors were "four ways to say the same thing" and nothing
  on the sheet wants them back; keep `check-circle-2` empty, its note naming the clause — and `checkbox-2`
  with it if AG-32 (a) is taken (FM-3, `findings-families.md:613-621`).
- **Moves.** 6 drawings renamed (one concept); nothing redrawn.
- **Look at** no look needed. **Folds** FM-3, R-X-39. **First** AG-32, earlier in this sitting.
  **Launch** yes.

### Band 3 — nothing shipped

#### AG-35 · The badge zone *(docs/09 ruling 5: may a badge cross 22?)*
**You will see** no shipped icon with a corner badge, at least 38 queued ones that need one (`file-plus`,
`user-plus`, `bell-plus` …), and only docs/05's badge rules — written for stroke 2 and a "live area" docs/01
says does not exist (R-F5-10, `findings-register.md:338`; R-F5-04).
- **Options (P1).** (a) Position: bottom-right, outer edges **on** the drawing bound (22 · 18 · 15), never
  past it — so a badge does not cross 22. (b) Size: start from 8 · 6 · 5 (the `volume` marks; docs/05's 8
  at 24) and let the first badge settle it. (c) Air: 1.5 · 1.5 · 1.5 all round, the base cut back by hand
  (docs/05's strategy A) — or by an automatic clip at build time (strategy B, docs/05's default; SF T4).
  (d) Filled form: a line glyph at the outline weight, or a solid disc with the glyph cut.
- **Recommendation:** (a)–(c) with hand cut-back — a badge in the margin would make the published bearings
  lie, and docs/05 itself says an auto-clip leaves flat ends where round caps belong. (d) is the eye's.
  Draw first the 29 that Polaris also draws (PL-7). Strike the `user-search` row rather than the rule
  against `<object>-search` (R-F5-02). Retire docs/05's "three variants per base" test, which 30 queued
  bases fail and nothing ever applied; docs/06's evidence rule is what sets scope (R-F5-01). Then docs/05
  §2–4 is rewritten from this ruling (CL-8).
- **Moves.** Nothing shipped (R-F5-04). Queued: at least 38 names (card 1.9) ⇄ 110 rows that are a variant
  of a shipped base (card 1.10) (R-F5-10).
- **Look at** BO-12 (corners; `user-plus` inside and past 22) and BO-11 (filled form) — the first
  `file-plus` drawn on the board (`eye-only.md:640`, `:630`); PS-6 and NS-10 for the mark size.
- **Folds** P1, P8 (ruling half), PL-7, Fluent T4 (badge half), T5, SF T4, T5, severity §4.4 row 7, R-F5-01,
  -02, -03, -04, -05, -06, -07, -10, -12 (badge half), docs/09 §6 ruling 5, docs/09:38. **First** AG-1
  (sitting B). **Launch** yes (the plan's list).
- **Did not reproduce.** "At least 38" is a hand selection: the card's own search finds 73 candidates and
  kept 38 (`reprint-map.md:1304`).

#### AG-36 · D23 revisions and the sheet's scope *(docs/09 ruling 6)*
**You will see** doc 06's eight D23 revisions, waiting since September on a dead pointer, read the same on
the live Polaris page; the four additions are already drawn (`references-polaris.md:21-31`).
- **Options and recommendation (PL-1 to PL-6).** Accept the four additions — `home`, `checkbox`, `save`,
  `chevrons-up-down`. Cut `caret-left` / `-right` (no set draws them, not on the sheet); keep `caret-up` /
  `-down` queued last, dropped if one product's vote must name a screen (PO-4). Accept `close` = `x` and
  `copy` = `duplicate`; search finds the other words (CL-11). Take none of the 13 open slots from live
  Polaris — keep doc 06's list as a reserve. Rule D23 now; refresh `ranked.md` later as its own small build,
  once the synonym table knows the 46 new names. Drop `atm`, whose only vote is gone.
- **Moves.** Nothing shipped (R-X-08 is a queued row); one row dropped; nothing redrawn.
- **Look at** PO-1 to PO-4 in the live Polaris file, if you want the four node questions
  (`eye-only.md:661-677`); otherwise no look needed.
- **Folds** PL-1 to PL-6 (PL-3's search half is CL-11), docs/09 §6 ruling 6, R-X-08, -22, -34, -35, -36,
  -37, -48 (scope half). **First** nothing. **Launch** no.

#### AG-37 · The customer page: publish the rules, and each master's text size
**You will see** a page shipped with the set — canvas, keylines, stroke and gap per master, which detail
dies first, the badge zone — beside the metrics; sets without one are criticised as hard to extend
(`references-field.md:463-472`). The 16's lighter line was chosen to sit beside 16 px text; the 24's and
20's pairings are written nowhere (R-X-53, `findings-register.md:698`).
- **Options.** (a) Publish once this agenda's rules are written (FD-2), and state the 24 and 20 text sizes
  (FD-6). (b) Keep the rules internal.
- **Recommendation: (a).** The stroked source stays private either way.
- **Moves.** Nothing shipped.
- **Look at** NS-13 if you want each master beside text (`eye-only.md:796`); otherwise no look needed.
- **Folds** FD-2, FD-6, R-X-53 (pairing half). **First** the rest of this agenda — sitting I, last.
  **Launch** no.

---

## 4. Claude will do these unless Maruti objects

Technical calls: how a check is coded, a tool, a published number brought back to its own documented
promise, a stale count. None changes how an icon looks, what a rule says or what stops an approval —
anything that would is on the list above (the gate AG-5, the slacks AG-8, the filled bearings AG-9). Any
item that touches a file in `src/icons` goes through `queue.mjs`.

| # | What | Folds |
|---|---|---|
| CL-1 | **Cross-master errors** (a master missing; a concept not at all three) **and the false greens** (a symlinked run, a truncated pipe in `approve`, area paths in outline files, a malformed `optical:`, a misspelt key) — each catches a broken file or a broken run, never a drawing judgement. The audit's "delete 16 and lint reports 1,940, all clean" runs 1,903 clean, 37 warned, exit 0 (`reprint-map.md:1110`) — the hole stands | severity §5 rows 3–6, §7-3; R-F6-03, R-X-29 |
| CL-2 | `geometry.test.mjs` into `check` — a failing geometry test is a tool fault, not a drawing | severity §6 (tests half), §7-4; R-X-44 (tests half) |
| CL-3 | `glyph: numeral` on the six `sort-numeric-*`, which C19 already authorises — 12 warning lines go. **Done 2026-10-20**, with the 9's redraw: all 36 files carry it and lint clean | severity §6b, §7-4b; R-F8-02 |
| CL-4 | **Notes held to their drawings:** `gap:` to 0.01 and naming its air (`sort` at 16 → 1.38); `volume-off-filled` declares its junction and its 1.25 channel as you ruled on 2026-09-28 (`plans/facing-gap.md`; C22's "noted in its file" and the ledger's "declared nowhere" both stand until then); `microphone-5`'s box at 20 and 16 from its own prose; `trash`'s tab as a junction if AG-10 says so | R-5, severity §5 row 7, scaling D1; R-F2-23, R-F8-04, -13, -14, -29 |
| CL-5 | **Lint's blind spots:** the knockout check on the 414 shape-filled files with strokes; the zero-length arc; unjudged `facing:self` readings; two holes in one filled drawing; a measure for wedge counters, after which the concepts holding one under 1.5 — nine (card 1.8) ⇄ 18 (`reprint-map.md:1073`) — come to you as drawings; the radius check on area paths, as a warning (1,026 drawings); the container check finding its container by shape; the gap message. New readings come to you as drawings | R-9 (§5c half), severity §4.3 row 1 (measuring half), row 2; R-F2-07, R-F8-03, -21, -31, -32, R-F13-25, R-X-43 |
| CL-6 | **Narrow the off-grid hatch** after AG-4, the residue measured first; an off-grid radius becomes an error once AG-4 has declared the dot | severity §4.5 row 2, §5 row 1; primitive-drift check 4 |
| CL-7 | **Metrics brought back to the docs' own promise:** `paintbrush-4`'s null (F2), the double rounding (F6), `container` false on 81 and closed-and-enclosing as the test (F7's settled half), `gap` published for glyphs only (F8); then the README's "13.7–16.2px" and "literally true" corrected | metrics F2, F6, F7 (settled half), F8; R-F12-03 to -07, -11, -16, R-X-32 |
| CL-8 | **Card 1.16's straight corrections,** one commit per document, after the sittings so each rule changes everywhere at once: stale counts and pointers, C7's Fluent citation, C12's "under 1°", C22's `search` sentence, docs/01's "2-unit" and "shift up 0.5", C6's "proposals" flag (after AG-1), the Polaris key first (PL-9), the README rewritten from `CLAUDE.md`, the retired `filled: 'outline'` labels, docs/09:53's archival, docs/05 §2–4 after AG-35, and C22 / C23 saying their 1.5 of white rests on the eye. **Stale-statements 2b.4** — restate the px-of-ink figures with their method — is listed by card 1.16 among its rulings; it is here because it changes how evidence is written down, not a rule, a drawing or anything shipped: in card 1.16's words, "the evidence behind C7 and docs/08 §3.1 — not their conclusions" (`stale-statements.md:472`) | stale-statements §6 straight corrections and 2b.4; scaling S2, grid G-8, P8 (rewrite half), PL-9; R-F2-22, -33, -34, R-F3-02, R-F4-07, -21, R-F7-05, R-F8-10, -11, -15, -17 to -20, R-F13-02, -18, -22, -26, -31, R-X-16 to -21, -24 to -28, -46, -47, -48 (counts half), -53 (citation half) |
| CL-9 | Lint's internal ids renamed so they stop reading like docs/01 sections; the 19 hand-spelled master lists read from `masters.mjs`; `masters.mjs`'s gap comment rewritten after AG-2 | R-X-23, R-X-45, R-F8-08 (comment) |
| CL-10 | **The primitive-drift linter's tooling** after AG-20: near misses by shape and by parameter (`package-2` / `-3`; `rotate-ccw`'s 4.250 / 4.257 / 3.507 heads), circle radii that nearly match; the base map as data; closure by counting a part's boxes; silhouette overlap in the pair check; the approval-step line; cross-master ratios and ink bands as the standing method; pair censuses cut by what holds each side; the parameter-change table for the next change | primitive-drift checks 2, 2b, 3; primitives item 7; SF T1, T2, T3 (tool half), T7; FD-1 (tooling half); Nucleo T1, T2, T7; Untitled take; Central take; R-F3-07, R-F4-18 |
| CL-11 | **Search:** a small use-name table (add → `plus`, close → `x`, duplicate → `copy`) | SF T8 (search half); R-X-02 (search half); PL-3 (search half) |
| CL-12 | **Audit instruments:** `raster.mjs`'s classify, `pixelgrid.mjs`, `congruence.mjs`'s ring direction, `figma.mjs`'s `measure.ink`, a shared `refs/common.mjs`; the Fluent copy-page catalogue copied out of `/private/tmp`; a per-corner reading of the three filled-corner rows two cards dispute | R-X-30, -49 to -52; R-F13-09 to -11 |
| CL-13 | **The pages the sittings need:** the air sheets (NS-1, -3, -5, -9, -12), the bearings-beside-text page (NS-4, -6, -8), the stacked column (NS-2), the scaled-20 test (NS-7, FD-5), the wall's named row, highlight lists and search; the optical sheet's true apex; the tier names "constraint" and "guideline" once AG-5 is ruled | FD-4, FD-5; OC-1 (instrument half), R-X-31 |
| CL-14 | **Records in a drawing's own file, not rules:** `play`'s derivation (needs the board free); `arrow-*-4`'s fill-and-stroke; `thumbs-up`'s gap-held tip; `paintbrush`'s bellies; `ban-3`'s and `x`'s stale notes; the 18 cuts at 16 retyped to their exact eighth (a 0.005 move); `more-horizontal`'s 0.9 gap declared after AG-17 (c) | OC-3; primitives item 10; R-F2-30, -31, R-F4-24, R-F7-04 (16 half), R-F13-24 |

---

## 5. Looks with no ruling attached

Kind-(3) findings no card turned into a proposal. Each is a look on the eye-only list; if the eye objects,
that icon or family comes back as its own decision — never as a rule from one drawing.

| Look | What | Recommendation |
|---|---|---|
| WA-1 | Twenty at 16, squinted — does each name itself? (R-F10-01) | a pair that blurs comes back as a drawing |
| WA-2 | Generic, or one character held throughout? (R-F10-03; FD-1's drift half is AG-20) | eye only |
| WA-3 | Marks and objects as two weights (R-F1-02, R-F1-03; mass M-1, M-2) | no rule, no change |
| WA-4 | The filled row uneven by nature (R-F1-05; M-5) | no rule unless the eye objects |
| WA-7 | Stair-stepped diagonals at 1× (R-F7-09; grid G-7) | C7's accepted cost |
| WA-14, OP-3 | 218 drawings lopsided by mass (R-F2-24) | no widening of C14 to objects; a family that reads off is its own decision |
| WA-17 | The crowded line (R-F1-06; M-3) | leave; the wands' sparks are a recorded decision |
| WA-18 | Six outer edges on a half pixel at 16 (R-F7-11; grid G-9) | decided shapes |
| FI-10 | `keyboard`, `keyboard-2`, `watch` re-proportioned at each master (R-F6-09; scaling E4) | leave; `keyboard-2`'s drift is 4.2%, not 19% (`reprint-map.md:1034`) |
| PS-4 | The glyph dot ⌀2 at 20 and 16 (R-F4-17; primitives item 8) | leave; at 16 the detail dots split ⌀1.5 / 1.75 / 2, so the clash is at 20 only (`reprint-map.md:984`) |
| XS-4 | `volume-off-filled`'s bar at 16 (R-F8-30) | you kept it on 2026-09-28 from the numbers; this is the first look by eye |
| BO-8 | A solid compass needle at 16 (Nucleo) | try one drawing, no rule |
| BO-13 | A `battery` level, when drawn (R-F5-13) | the first board decides |
| NS-11 | `play` shrinks where every mark grows (R-F6-07; scaling E1) | look on the named row |
| — | The 16 a quarter darker (R-F1-04; M-6, scaling E2); `plus` / `minus` on the midline (R-F7-06; G-1); 2× softness and the 16 narrowly softest (R-F7-12, R-F7-13; G-5, G-6) | already ruled or accepted; no look needed |

---

## 6. Not on the agenda — settled or already ruled

- **The stroke spec and what is fixed with it** — 1.5 · 1.5 · 1.25, cap inset, `bendMin`, the grid and
  `FILLED_WEIGHT` 2.5 · 2 · 2 (`plans/set-and-rules-audit.md:227-244`). BO-6 ("is the filled step right at
  24?") is a look you may have, not a ruling.
- **White holds 1.5 at 16** (Maruti, 2026-09-28; `CLAUDE.md:189`). The audit re-asks it — Fluent T2 would
  cut one line wide, 1.25 at 16 — and finds that the rule rests on your eye, not on a render: a cut and a
  drawn line give the same pixels (R-F8-11), and the same literal 1.5 is one line wide at 24 and 20 and 1.2
  lines at 16 (R-F13-18, R-F13-31). Listed so it is not lost; NS-9 (`eye-only.md:763`) is the look if you
  ever want it. Saying in C22 / C23 that it rests on the eye is CL-8.
- **The Corrections table** (`plans/set-and-rules-audit.md:157-175`) — never reinstated.
- **The 16 filled corners left at the 1.5-era offset** — "leave it", 2026-09-20 (docs/09:45). The audit
  adds only the population, four figures never picked: 12 files (card 1.2) ⇄ 12 concepts, 45 pairs (card
  1.16) ⇄ 13 concepts, 50 corners (card 2.5) ⇄ 97 corners on 37 concepts (card 1.8), which reprints as 41
  under its own definition (`reprint-map.md:1069`) (R-F13-01, R-F13-23).
- **Checks stay box-centred** (C14, `CLAUDE.md:197`).
- **Is 20 a master?** Answered: a master, by three definitions (`judging-standard.md:117-127`); FD-5's test
  (CL-13) reopens nothing. Fluent T6 and Nucleo T5 confirm, and change nothing.
- **Closed already:** the plan's F1 instrument line (R-F1-01; mass M-7); the audit's own id collisions
  (R-X-33 — the register's ids are the ones read).

---

## 7. Every proposal id, and where it went

One home each; where an id is split, both halves are named and each decision's Folds line names its half.

| Source | Ids → where |
|---|---|
| Ledger (`exceptions-ledger.md:730-739`) | R-1 AG-4 · R-2, R-3, R-4 AG-14 · R-5 CL-4 · R-6 AG-16 · R-7 AG-26 · R-8 AG-3 · R-9 AG-8 (slack half), CL-5 (§5c half) · R-10 AG-8 |
| Metrics (`findings-metrics.md:547-556`) | F1, F3, F4 AG-9 · F5 AG-21 · F7 CL-7 (settled half), AG-21 (open half) · F2, F6, F8 CL-7 |
| Grammar (`findings-grammar.md:602-669`) | P1 AG-35 · P2, P3, P4 AG-17 · P5 AG-28 · P6 AG-27 · P7 AG-20 · P8 AG-35 (ruling half), CL-8 (rewrite half) |
| Optical (`findings-optical.md:622-691`) | OC-1 AG-16 (rule half), CL-13 (instrument half) · OC-2, OC-4 AG-8 · OC-3 CL-14 · OC-5 AG-7 · OC-6 AG-31 · OC-7 AG-17 |
| Families (`findings-families.md:591-654`) | FM-1 AG-32 · FM-2, FM-7 AG-22 · FM-3 AG-34 · FM-4 AG-24 · FM-5 AG-30 · FM-6 AG-33 |
| Polaris (`references-polaris.md:518-569`) | PL-1, PL-2, PL-4, PL-5, PL-6 AG-36 · PL-3 AG-36 (ruling half), CL-11 (search half) · PL-7 AG-35 · PL-8 AG-28 · PL-9 CL-8 |
| Field (`references-field.md:454-512`) | FD-1 AG-20 (rule half), CL-10 (tooling half) · FD-2, FD-6 AG-37 · FD-3 AG-19 · FD-4, FD-5 CL-13 |
| Severity (`severity-proposal.md`) | §2 AG-5 · §4.2 rows 1–4 AG-5 · §4.3 row 1 AG-2 (stays-a-warning half), CL-5 (measuring half) · row 2 CL-5 · rows 3–4 AG-8 · row 5 AG-5 · §4.4 rows 1–2 AG-8 · row 3 AG-11 · row 4 AG-4 · row 5 AG-26 · row 6 AG-25 · row 7 AG-35 · §4.5 row 1 AG-4 · row 2 CL-6 · row 3 AG-16 · §5 row 1 CL-6 · row 2 AG-16 · rows 3–6 CL-1 · row 7 CL-4 · §6 AG-5 (hook half), CL-2 (tests half) · §6b CL-3 · §7-1, §7-2 AG-5 · §7-3 CL-1 · §7-4 CL-2 · §7-4b CL-3 · §7-5 AG-4 · §7-6 AG-16 · §7-7 AG-5 |
| Angles (`findings-angles.md:666-692`) | §7a-1, -2, -3, -4, -6, -8 AG-3 · §7a-5 AG-26 · §7a-7 AG-18 (chevron half), AG-15 (`code` half) |
| Corners (`findings-corners.md:762-780`) | §11a-1 to -6 AG-11 |
| Primitives (`findings-primitives.md:881-977`, `:1051-1068`) | items 1, 13 AG-20 · 2 AG-18 · 3 AG-25 · 4 AG-33 · 5 AG-17 · 6 AG-4 · 7 CL-10 · 8 §5 (PS-4) · 9 AG-23 · 10 CL-14 · 11 AG-24 · 12 AG-27 · drift check 1 AG-20 · checks 2, 2b, 3 CL-10 · check 4 CL-6 |
| Scaling (`findings-scaling.md:451-524`) | S1 AG-1 · S2 CL-8 · S3 AG-11 · S4 AG-12 · S5 AG-14 · D1 CL-4 · D2 AG-8 · E1, E2, E4 §5 · E3 AG-14 |
| Mass, grid (`findings-mass.md:464-480`, `findings-grid.md:359-377`) | M-1, M-2, M-3, M-5, M-6 §5 · M-4 AG-19 · M-7 §6 · M-8 AG-25 · G-1, G-5, G-6, G-7, G-9 §5 · G-2, G-3, G-4 AG-29 · G-8 CL-8 |
| Fluent (`references-fluent.md:284-327`) | T1 AG-23 · T2 §6 · T3 AG-11 · T4 AG-1 (margin half), AG-35 (badge half) · T5 AG-35 · T6 §6 |
| SF Symbols (`references-sf.md:782-825`) | T1, T2, T7 CL-10 · T3 AG-20 (rule half), CL-10 (tool half) · T4, T5 AG-35 · T6 AG-23 · T8 AG-33 (naming half), CL-11 (search half) |
| Nucleo (`references-nucleo.md:574-607`) | T1, T2, T7 CL-10 · T3 AG-2 · T4 AG-11 · T5 §6 · T6 AG-19 |
| Central, Untitled | Central take CL-10 · Untitled take CL-10 |
| docs/09 §6 (`docs/09-rule-audit.md:93`) | 1 AG-23 · 2 AG-11 · 3 AG-31 · 4 AG-22 · 5 AG-35 · 6 AG-36 |
| Stale-statements §6 rulings (`stale-statements.md:459-473`) | 1.5 / 3b.1 AG-3 · 1.6 AG-17 · 1.7 AG-25 · 1.8 AG-2 · 3b.2 AG-23 · 3b.3 AG-11 · 3b.12 AG-14 · 4.1 AG-26 · 2b.4 CL-8 (why: §4) · G6 AG-28 |
| A register row answered together | R-X-09, the foundations never frozen (`findings-register.md:661`) — no ruling of its own; its five missing rules are AG-11, AG-13, AG-19, AG-23, AG-35 (§1) |

---

## 8. Handover

| to | what |
|---|---|
| **Maruti** | §2's sittings, A first. Each ruling is recorded by the main session in the docs it changes, one topic per commit |
| **the main session** | apply each ruling with its CL items as one sweep per topic; OP-1 / OP-2 and CL-14's `play` row need the board free; sitting G's boards run through the icon skill, one variable per board |
| **CL-13** | the pages sitting H waits on — the air sheets, the bearings page — and the wall's named row |
| **5.1, the fresh reviewer** | the ⇄ figures carried here unpicked (AG-3, AG-8, AG-10, AG-13, AG-19, AG-18, AG-20, AG-21, AG-33, AG-11, CL-5, §6); the ×6 and pairs ×2 conversions in §1, each an upper bound, not a count; every "did not reproduce" line against `reprint-map.md` once its closing check lands |

## Gate

- `node tools/lint.mjs` in the repository, before and after: `2910 drawings · 2848 clean · 62 warned · 0
  failed`, byte-identical.
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs`: 783 tests, 783 pass, 0 fail (others' tests land in
  parallel; none added here — nothing was measured).
- `shasum lab/manifest.json` begins `161c9314cdf8`.
- One file: this document. No tool, no new count; the ×6 and ×2 figures are conversions of cited counts,
  marked as such.

---

*Written for card 5.2 of `plans/set-and-rules-audit.md`. Companions: `findings-register.md` (every finding
and its source), `eye-only.md` (the looks), `parameter-map.md` (what a change costs), `reprint-map.md` (what
reprints).*
