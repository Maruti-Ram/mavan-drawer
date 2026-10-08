# The findings register — card 3.2

**Every deviation the audit found, in one place, grouped by axis, each tagged one-off or
systemic, with the icons named and the document and line that measured it.** This is the second
of the four things the audit promised (the plan's "What changes for Maruti"), and the list wave 5's
decision agenda (card 5.2) ranks. It collects; it does not re-judge. Every figure below is restated
from one of the audit documents in `docs/audit/` and cites where that document holds it;
`tools/audit/register-check.mjs` holds the restatements to their sources — what that check does
and does not prove is in §0b.

**Pinned tree `5933041`** — 485 concepts, 2,910 drawings, lint 2,848 clean · 62 warned · 0 failed.
Nothing in the set, the rules, lint, the sheet or the board was touched. Three files belong to this
card: this document, `tools/audit/register-check.mjs`, `tools/audit/register-check.test.mjs`.

## What Maruti will see

- **263 findings in 34 tables:** **38 where a drawing (or a queued row) disagrees with a stated
  rule**, **138 where a rule disagrees with another rule or with the docs**, **87 where every rule is
  satisfied and something still looks wrong, or no rule covers it**. These are counts of findings,
  not of drawings. By axis: F1 6 · F2 36 · F3 7 · F4 24 · F5 13 · F6 10 · F7 15 · F8 33 · F9 10 ·
  F10 3 · F11 5 · F12 17 · F13 32 · not on any axis 52. Beside them: 3 rows two cards disagree on
  (R-F13-09 … -11, not yet findings), 1 open ruling (R-X-39), and 26 lines in §15 on what holds.
- **The five that reach the most drawings** — ranked by the `drawings` column, the one unit every
  card can be read in (a drawing is one file: one master, one style). Only rows whose card counted
  a population of drawings, files or metrics entries are ranked; a finding filed under two kinds is
  ranked once; ties go in document order.
  1. **The off-grid check is dead** — any comment turns the warning into a "documented exception",
     and 1,888 drawings put a straight-segment coordinate off the grid behind it (R-F7-02; its
     second reading, no rule for a tangent or intersection vertex, is R-F7-15). Counting arc values,
     which the rule allows, 1,967 drawings hold an off-grid value.
  2. **`alpha` was never set against the eye.** An *optical bearing* is the margin we publish so an
     icon looks evenly spaced beside a label; `alpha` (0.75) is how much of an icon's thin edge that
     margin charges. It sets the optical bearing of 1,882 stroke drawings, and a quarter step either
     way would move 1,385 of them by more than a tenth of a unit (R-F12-12).
  3. **The keyline tolerance no document chose** — lint holds 1,726 drawings to their keyline at
     ±0.5 on each side, 4% of the square at 16 (R-F2-06).
  4. and 5. **The filled drawings' corners and margins** — lint never checks a corner radius in the
     1,026 shape-filled drawings (R-F2-07), and those same 1,026 publish no optical correction, so a
     filled icon sits up to 2.03 px further from its label than its outline twin at 48 px (R-F12-01).

  **Every drawing, by construction — not ranked against these:** the gap floor's derivation does
  not hold (R-F8-07); the gate fails nothing geometric — 2,910 linted, 62 warned, 0 failed (R-X-10);
  the shipped format was never built — the Settled table promises "outlined fills only",
  `dist/icons.json` ships the stroked source (R-X-42); lint checks no angle (R-F4-08) and reads no
  two masters of one icon (R-F6-03). Seven more rows describe a property of the whole set (R-F1-03,
  R-F6-01, R-F6-06, R-F7-03, R-F7-12, R-F7-13, R-F8-06); the checker lists all twelve.
- **Most of the set is good, and §15 says where.** The size step, the container ring, the minus as
  the plus's bar and the figure arrangements hold exactly; the pair box holds every pair within 0.01
  or by a declared note; the chevron is nine shapes at every master. The slips cluster in apparent
  size (F2 — tolerances and boxes), the air rule (F8), the filled style (F13), and the gate and the
  names (X).

---

## 0. How to read a row

**Three kinds, never mixed in one table** — the plan's definitions. **(1)** a drawing disagrees with
a stated rule; a queued row of the sheet that breaks a stated rule before it is drawn is marked
**"(1) in the sheet"** · **(2)** a rule disagrees with another rule or with the docs, including a tool
that disagrees with its own stated claim · **(3)** a drawing is fine by every rule and still looks
wrong, and no rule covers it. Each axis section holds up to three tables, one per kind, headed
`Kind (n)`.

Some cards defined their kinds differently: card 1.12's kind (1) is "a published number disagrees
with the drawing"; the ledger's kind (3) is "nothing covers it". Every row here is filed by the
plan's definitions, and where that moves a finding from its card's kind the row says so and the
table below records it. Where a card listed one finding under two kinds, it is two rows here.

| row | the card's kind | here | why |
|---|---|---|---|
| R-F2-05 | (1) "agreed, undeclared" for `watch-2` and `volume-off` (card 1.11) | (1), `volume-off` only | `watch-2` breaks no rule — lint passes exactly 0.50 and C10/C12 bind bent marks only; it is in R-F2-08 |
| R-F2-23 | (1), D1 (card 1.4) | (1), moved from (2) | follows its card |
| R-F3-01 | (1) (card 1.1) · (3) (card 1.9) | (3) | card 1.1 itself says "no rule was broken" |
| R-F9-01 · R-F9-02 | (1) (card 1.7) | (3) | no junction rule exists to break (F9) |
| R-F12-01 … R-F12-05 | (1) by card 1.12's definition · (2) (card 1.15) | (2) | the build against its documented promise |
| R-F13-02 | (1) (cards 2.4, 1.3) · (2) (card 1.8) | (2) | the drawings are right; C12's sentence is wrong — card 1.3's own verdict is "fix the doc" |
| R-F13-09 … R-F13-11 | (1) (card 2.5) | not adjudicated | card 1.2's per-corner reading and the plan's corrections table say none does; both readings carried |
| R-F13-30 | (1) (card 1.8) | (3) | no rule says a filled drawing must be heavier |
| R-F4-07 · R-F4-21 | (1) (card 1.1) | (2) | the drawing is right and only its file's prose is wrong — as R-F13-02 |
| R-X-09 | (2) (card 1.15 §4) | (2), moved from (1) | no drawing disagrees; the process and the docs do |
| R-X-41 | — | (2), moved from (3) | a process silence; no drawing looks wrong |
| R-X-39 | "open, not a disagreement" (card 1.10) | open ruling, moved from (3) | not a deviation |
| R-F5-01 · R-F5-02 · R-X-08 | (1) | (1) in the sheet | queued rows, not drawings |

One finding, two kinds, two rows: R-F7-02 (2) and R-F7-15 (3) — ledger L-1; R-F2-19 (2) and R-F2-36
(3) — L-5; R-F8-01 (1) and R-F8-28 (3) — L-8; R-F8-13 (2) and R-F8-30 (3) — L-10; R-F8-04 (1) and
R-F8-29 (2) — the note and the lint hole that lets it stand; R-F9-03 (2, card 1.7) and R-F9-10 (3,
the ledger's L-2); R-F4-12 (2) and R-F4-23 (1) — card 1.14's two halves; R-F13-17 (2, card 1.8) and
R-F13-33 (3, SF K6); R-F13-18 (2, card 1.8) and R-F13-34 (3, Fluent K5).

**One-off / systemic — one rule, applied to every row.** *Systemic* = a pattern, a cause or a rule
that reaches more than one concept family, so one ruling moves every drawing it touches; the wording
of a rule, check or tool that judges many families counts. *One-off* = one concept or one family (a
numbered run, a size family, or a pair the set draws as one — `login`/`logout`, `globe`/`language`,
the figure family of C27, the chevrons), or a statement that governs no drawing (a stale count, a
pointer, a reference figure, a plan line); *one-off ×n* when the card judged several families each
on its own. The cards tagged by their own lights; the register's cell follows this rule, so it can
differ from a card's tag. The differences found: R-F3-03 (card 1.1: systemic) · R-F4-04, R-F4-05,
R-F4-19, R-F4-20, R-F13-06 (card 1.3: S) · R-F4-18, R-F13-15, R-F13-16 (card 1.1: systemic) · R-F5-03
(SF K4: one-off) · R-F5-08 (card 1.16: systemic) · R-F8-08 (card 1.7: systemic) · R-F8-12 (card 1.7:
one-off) · R-F8-20 (card 2.1: systemic) · R-F13-02, R-F13-14 (card 1.8: systemic) · R-X-16 (cards 2.1,
1.16: systemic).

**Reach and drawings — two columns.** *Reach* is the count the measuring card states for the
population the row is about, in the card's own unit (concepts, files, entries, pairs, segments,
spans, corners …) and named as such; where two cards count one population it carries both, ⇄. A
count written in words is the card's word; where a card counts nothing but names its icons, the
cell names them; `none (…)` and `[needs measuring]` as below. *Drawings* is the same population in
drawings, only where a card stated it in drawings, files or `dist/metrics.json` entries (a file and
an entry are each one drawing); never converted from concepts or pairs — a sum (`31 + 18 drawings`)
only of populations the card counted apart. Four other forms: `every drawing (…)` — the row is about
something that holds for the whole set by construction (a rule, a check, a published field, the
shipped format, or a property measured over every drawing), so it is listed apart rather than ranked
against measured reaches; `see R-…` — the second row of one finding filed under two kinds, counted
once under the row it names; `none (…)` — the row is about a document, a comment, a tool or a
queued row and no drawing is in question; `[needs measuring]` — drawings are in question and no card
counted them. The ranking above reads this column (a ⇄ cell by its smaller figure, ties in document
order) and is reprinted by the checker. Rows sit in id order; ids are references, not ranks.

**Sources** name every card that measured the quantity: `path:line`, or for the plan, which other
cards will keep editing, an *anchor* — `plans/set-and-rules-audit.md "Pinned tree"` names the one
line holding that text, so it survives lines being added above it. Where two cards measured one
quantity by different definitions the row begins **⇄** and carries both figures with their
definitions; the plan forbids picking (its reconcile list, "Wave 5 must reconcile, never pick").

**Proposals** are the ids the cards already made: the ledger's R-n; the metrics fixes, written
*metrics F1…F8* to keep them apart from the axes; the grammar's P-n; optical OC-n; families FM-n;
Polaris PL-n; the field's FD-n; the severity proposal's rows (*sev §4.4 row 1*, *sev §7-5* …); the
angles and corners recommendations by section (*angles §7a-n*, *corners §11a-n*); card 1.1's
judged items with a recommendation (*primitives item n*) and its drift checks (*primitive-drift
check n*); and the reference cards' takes (*Fluent T1…T6*, *SF T1…T8*, *Nucleo T1…T7*, *Central
take*, *Untitled take*). §16 indexes every id back to its rows. The M-, G- and S- labels card 3.1
cites are finding labels, one row each — §16 maps them too.

**Ids** are `R-F<axis>-<nn>`, or `R-X-<nn>` for the section that sits on no axis (names, the
sheet, the docs, the gate, the instruments). They are references, not rankings; a row keeps its id
when it changes kind or table.

## 0b. What the checker proves, and what it does not

`node tools/audit/register-check.mjs docs/audit/findings-register.md` reads every table with a
`sources` column. **It proves:** every citation resolves — the file exists, the line is inside it, an
anchor matches exactly one line; every number in a row's measured cells (what the eye sees, icons,
reach, drawings) appears *exactly* — 1.957 is not 1.96 — on a cited line or within three lines of
one, and not merely inside an icon name, rule id, section mark, date or path; each table holds one
kind and it matches its heading; ids are well formed and unique; every `drawings` cell takes one of
the forms in §0, and a `see R-…` names a row that carries a count; every `reach` cell holds a count,
names its icons, or says `[needs measuring]` or `none (…)`; and the §16 index is the exact inverse of
the rows' proposals cells. **It does not prove:** that the words around a
number say what the source says — negation, direction, sign, "up to", "at 24 only"; which number
belongs to which claim, or which master to which value (a row that swaps 24 and 16 passes); that
the kind or the scope is right; that both sides of a ⇄ row are present; that nothing is missing; or
that a figure is the right one of several the window holds (a nearby 1,888 passes for 1,967); or
whether a row belongs on the every-drawing line. Those are a reader's job — card 5.1's. It checks
counts written in words not at all, and §15 only for citations and numbers.

---

## F1 — One apparent weight

Instrument: ink area ÷ canvas (`tools/audit/mass.mjs`). No rule or check in the repo speaks about
ink quantity (`docs/audit/findings-mass.md:27`), so there is **no kind (1) table** here.

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F1-01 | (2) | The plan named F1's instrument as ink ÷ bbox, which ranks a `minus` as the densest icon in the set (98%); the right key for a row of icons is share of canvas. The plan's axes table now says so | the whole set | none (a plan line) | none (a plan line) | one-off | docs/audit/findings-mass.md:476 · plans/set-and-rules-audit.md "ink area ÷ canvas" | — |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F1-02 | (3) | Marks and objects are two weights at 16: marks sit at a median 11.1% of the canvas, objects at 21.7% (2.0×); the same 2.2× in the filled row. By keyline, not by fault | 136 marks against 288 silhouette objects | 136 + 288 concepts | [needs measuring] | systemic | docs/audit/findings-mass.md:466 · docs/audit/findings-mass.md:22 | — (the wall, card 4.1) |
| R-F1-03 | (3) | A `globe-2` beside a `check` reads as a dark ball beside a thin tick: 102.2 against 20.0 px² (5.1×). The line is the same 1.25 on both; the globe has 6.6× the line. The 16 outline row runs 8.4× from lightest to darkest, 21.1× pooled over all 2,910 drawings. Lucide draws the same spread. Recommendation: no rule, no change | `minus-small` 12.2 px² to `globe-2` 102.2 px² | 485 outlines at 16 (8.4×); 2,910 drawings pooled (21.1×) | every drawing (a spread across the set) | systemic | docs/audit/findings-mass.md:464 · docs/audit/findings-mass.md:20 · docs/audit/findings-mass.md:376 | — |
| R-F1-04 | (3) | ⇄ The 16 master is a quarter darker per unit of canvas than the 24, by construction (C7). Card 1.5: median +24% ink per canvas 24→16 (+10% at 20), order intact (rank correlation 0.967), 447 of 485 concepts within ±20% of the median ratio. Card 1.4: ink ÷ canvas² median 0.159 / 0.172 / 0.191, ratio 1.236. Outliers worth a glance: `x-small` ×1.63, `minus-small` and `plus-small` ×1.56, `grid-4` ×1.57, `x` ×1.54 | every outline | 447 of 485 concepts (card 1.5) | [needs measuring] | systemic | docs/audit/findings-mass.md:474 · docs/audit/findings-mass.md:442 · docs/audit/findings-scaling.md:513 | — |
| R-F1-05 | (3) | The filled row is not level by construction: 38% of it sits near its median and 22% is Dense — discs and cards at 52–64% of the canvas beside marks with a median of 16%. Within a disc family the members agree; the question is whether the filled *style* wants to be that uneven | the filled row | 108 Dense drawings in the 16 filled row | 108 drawings | systemic | docs/audit/findings-mass.md:472 · docs/audit/findings-mass.md:143 | — (card 1.8, F13) |
| R-F1-06 | (3) | Crowded line: the two globes, the three wands and `paintbrush-5` are the only drawings heavy for their line — 12–24% of the line lies on top of other line, and the wands hold the darkest local patch in the set. Each is a recorded decision in its own file | `globe` `globe-2` `wand` `wand-2` `wand-3` `paintbrush-5` | 8 drawings at 16 | 8 drawings | one-off ×3 | docs/audit/findings-mass.md:468 · docs/audit/findings-mass.md:24 | — (look first, real 16) |

---

## F2 — One apparent size

Keyline conformance, corner radius, optical placement and the tolerances that hold them.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F2-01 | (1) | Sixteen numbered families use different radius values between siblings, and in four the *same object* takes a different tier: `play` t3/t2/t1 across three variants, `message` five answers in seven, `chart-bar` t3 against t1, `pin` t2 against r1 — 1 px at 24 between `play` and `play-2`. Card 1.2 calls it eye-only and makes no recommendation | `play` ×3 `message` ×7 `chart-bar` `pin` and 12 more families | 16 families | [needs measuring] | systemic | docs/audit/findings-corners.md:728 · docs/audit/findings-corners.md:456 | — (eye-only, card 1.2 C-6) |
| R-F2-02 | (1) | `pin-2` `pin-4` `pin-5` `wand` `wand-2` take a shoulder radius off every tier at r1 / 1 / 0.75 and hold the 24 value at 20; `wrench` ×3 sit at 1.25 / 1 / 0.875 with a 1.75 neck, which does step at 20. `pin` and `pin-6` use tier 2 for the same shoulder. C-2 calls the group "drift, not decision" and counts 7 concepts while naming one more; the card's own table calls the wrench "Decision, but off-vocabulary" | `pin-2` `pin-4` `pin-5` `wand` `wand-2` `wrench` `wrench-2` `wrench-3` | 7 concepts by C-2's count, which names one more | [needs measuring] | systemic | docs/audit/findings-corners.md:723 · docs/audit/findings-corners.md:226 · docs/audit/findings-corners.md:777 | corners §11a-5 |
| R-F2-03 | (1) | `alert-triangle` ×4 at 16 puts its apex at r2, one step above tier 1, where docs/01:320 says no value between the tiers. It bought half a pixel of "!" bar and stopped the glyph reading as a colon; the file argues it. Break right — the rule should admit a fourth value or say when a container may step out | `alert-triangle` ×4 at 16 | 4 names at 16 | [needs measuring] | one-off | docs/audit/findings-corners.md:722 | corners §11a-1 |
| R-F2-04 | (1) | `map-pin` and `map-pin-2` spend lint's whole ±0.5 keyline slack at both small masters — 16×20 / 12×15.5 / 10×13.5 against portrait 16×20 / 12×16 / 10×14 — and that half unit is what makes their mark/container ratio the worst in the set (−25.9%). Only 7 of 287 keyline-held concepts use the slack at all. The tolerance is behaving as an undeclared `box:` | `map-pin` `map-pin-2` | `map-pin` · `map-pin-2` | [needs measuring] | one-off | docs/audit/findings-scaling.md:493-499 | — (declare a box, or sit on the keyline) |
| R-F2-05 | (1) | `volume-off` at 16 sits exactly 0.50 off centre, placed on whole pixels by eye, against C28's "centred as its own icon" — and no note can declare it, so it passes on lint's ±0.5 slack. (Narrowed: `watch-2`'s 0.50 breaks no rule and is carried by R-F2-08) | `volume-off` at 16, both styles | 2 files | 2 drawings | one-off | docs/audit/exceptions-ledger.md:739 · docs/audit/findings-optical.md:594 | R-10 · OC-2 |
| R-F2-23 | (1) | `microphone-5` and its filled twin declare `box: 14x20` at 24 only; at 20 and 16 they fall back to the keyline, the only régime change in the set. Card 1.4 files it as kind 1 and wrote the string as `14x18`; the file, the ledger, the rule register and card 1.16 read `14x20`. (Moved from kind (2): see §0) | `microphone-5` | 1 concept | [needs measuring] | one-off | docs/audit/findings-scaling.md:487-489 · docs/audit/exceptions-ledger.md:757 · docs/audit/rule-register.md:118 | — |
| R-F2-32 | (1) | Measured and not judged by card 1.2: off-tier radii outside the container role, against docs/01:320's "do not use radius values between these" — `bug` `bug-2` at 2 / 1.5 / 1.25, the `files` family at 1.25 / 1 / 0.75, `grid` `grid-5` `grid-7` at 1 / 0.75 / 0.75, `maximize-5` at 1 / 0.75 / 0.75, `wallet` at 1 / 1 / 0.875, `wallet-3` at 2 / 1.5 / 1.375, `users-behind` at 1.5 / 1.25 / 0.875; `key-3` holds 1.5 at 20 where tier 2 is 1.25. (`help-4`'s two-tier drop at 16 lands on tier 3, 0.625, so it breaks nothing here) | `bug` `bug-2` `files` family `grid` `grid-5` `grid-7` `maximize-5` `wallet` `wallet-3` `users-behind` `key-3` | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-corners.md:235-238 · docs/audit/findings-corners.md:259-274 | — (not judged by its card) |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F2-06 | (2) | Keyline conformance is held at ±0.5 on each dimension, a number no document chose (docs/01 gives a direction, not a tolerance). At 16 that is 4% of the 12-unit square. The check runs on 1,726 of 2,910 drawings (59%) and at the pin 0 drawings report "no keyline match" | every keyline-held drawing | 1,726 drawings | 1,726 drawings | systemic | docs/audit/enforcement-gap.md:331 | sev §4.3 row 3 · sev §4.4 row 2 |
| R-F2-07 | (2) | Lint reads only the typed `rx` on stroked paths, as a lower bound, as a warning — no upper bound, no vocabulary, no cross-master check — and strips area paths first, so it is blind to 5,512 of 10,965 corners including every filled outer contour: the corners of the 1,026 shape-filled drawings are never radius-checked | every corner | 5,512 of 10,965 corners | 1,026 drawings | systemic | docs/audit/findings-corners.md:739 · docs/audit/enforcement-gap.md:339-340 | sev §4.3 row 2 |
| R-F2-08 | (2) | C10/C12 say a bent mark is centred to 2 dp, no tolerance; lint tests every drawing at ±0.5. Measured after the declared shift: 164 drawings sit more than 0.01 off the canvas centre, 80 more than 0.10, 20 more than 0.25, 8 at exactly 0.50 — `watch-2` at every master in both styles and `volume-off` at 16. `watch-2`'s crown stands proud of a centred body and breaks no rule: lint passes exactly 0.50, and C10/C12 bind bent marks only | `watch-2`, `volume-off` and the rest of the 164 | 164 drawings | 164 drawings | systemic | docs/audit/enforcement-gap.md:332 · docs/audit/enforcement-gap.md:105-110 · docs/audit/rule-register.md:123 · docs/audit/exceptions-ledger.md:708 · docs/audit/findings-optical.md:357-361 | sev §4.3 row 4 · sev §4.4 row 1 · OC-4 |
| R-F2-09 | (2) | ⇄ Drawings that publish `shift [0,0]` with their ink box off centre, on a tolerance nobody chose. Card 1.11: 154 (166 with the 12 anchored), none over 0.5, 68 of the 154 between 0.1 and 0.5, 44 with a reason written in the file, 110 nobody has judged; a half-grid-step tolerance would ask 38 (13 concepts) to declare themselves — on the build's 2 dp box, larger axis. Card 1.12: 177 = 12 + 165 on the solved box, by distance, 70 between 0.1 and 0.5. The box alone separates them: on the solved box the count is 177 either way; the eleven between 166 and 177 are check twins whose offset rounds away | the 154 at `docs/audit/findings-optical.md` §2 | 154 drawings (card 1.11) ⇄ 177 drawings (card 1.12) | 154 drawings (card 1.11) ⇄ 177 drawings (card 1.12) | systemic | docs/audit/findings-optical.md:590 · docs/audit/findings-optical.md:698 · docs/audit/findings-metrics.md:578 | sev §4.3 row 4 · sev §4.4 row 1 · OC-4 · metrics F5 |
| R-F2-10 | (2) | The `optical:` note is taken on trust: lint moves the centring target by the declared amount, unchecked. Card 1.15 probed `optical: -5 0` on a line 5 units off centre and it was accepted silently (the plan, the ledger and sev §5 row 2 quote a 3-unit case, which is the ledger's hypothetical). A bound at 0.25 from C15's measure would pass all 234 chevron and `play` files today | every declared shift | 270 files | 270 drawings | systemic | docs/audit/findings-optical.md:588 · docs/audit/enforcement-gap.md:96-98 · docs/audit/exceptions-ledger.md:707 | R-6 · OC-1 · sev §4.5 row 3 · sev §5 row 2 · sev §7-6 |
| R-F2-11 | (2) | The filled twin carries the outline's shift while its own measure differs by one sheet step or more on 100 of the 108 single-bend pairs — the chevrons, 36 concepts × 3 masters — at most 0.10. C12 wins, and nothing says so | every filled chevron | 108 single-bend pairs | none (a sentence; OC-7 changes no drawing) | one-off | docs/audit/findings-optical.md:595 · docs/audit/findings-optical.md:493-496 | OC-7 |
| R-F2-12 | (2) | Section 5 of docs/01 lists three radii — 2.5 / 1.5 / 0 — and calls the second "bend or secondary detail"; C10 gives a bend half the weight, 0.75. The drawings follow C10 (681 of 1,094 bends sit exactly on `bendMin`, zero below) and their own comments call 1.5 "the detail radius" (26 files at 24, always 1.5 · 1.25 · 1) | every bend and every detail corner | 1,094 bends | none (a docs/01 §5 edit) | systemic | docs/audit/findings-corners.md:734 | corners §11a-1 · Fluent T3 |
| R-F2-13 | (2) | Section 5 is missing a tier and is stated at 24 only, with no job given for any tier. The vocabulary in use is four values at each master — tier 1, tier 2, tier 3 (= `bendMin`), sharp — and 93.4–93.8% of container corners land on one of the three non-zero ones. The 20 and 16 values settled long ago, 2 / 1.25 / 0.75 and 1.5 / 1 / 0.625, and docs/01 still says they will be "recorded here once they settle" | every container corner | 1,761 container corners | none (a docs/01 §5 edit) | systemic | docs/audit/findings-corners.md:735 · docs/audit/findings-corners.md:53 · docs/audit/findings-corners.md:767-768 · docs/audit/rule-register.md:204 · docs/audit/stale-statements.md:152 | corners §11a-1 · corners §11a-2 · sev §4.4 row 3 · Fluent T3 · Nucleo T4 |
| R-F2-14 | (2) | The three radius tiers are locked to three different quantities — tier 2 to the canvas (6.25% exactly, all masters), tier 3 to the stroke (0.5×, all masters), tier 1 to neither (10.4% to 9.4% of canvas, 1.67× to 1.2× the stroke). Three derivations, no doc stating any. Card 1.4: the container radius 2.5 / 2 / 1.5 is 10% tighter than proportional at 16, obeyed 89 of 89 | the 89 tier-1 concepts and every bend | 89 tier-1 concepts (card 1.4) | none (no document states the derivations) | systemic | docs/audit/findings-corners.md:736 · docs/audit/findings-scaling.md:468-470 | corners §11a-3 · sev §4.4 row 3 |
| R-F2-15 | (2) | ⇄ docs/01:320 says "three options is a system; seven is a mood". Card 1.2 counts 12 distinct snapped container values at 24 and 75 distinct typed `rx` values across all outline files. Card 1.14 at 24: radii 0, 1.5 and 2.5 account for 996 of 1,536 corners (64.8%), 1,332 (86.7%) with C10's 0.75; on container corners the strict test gives 60 concepts at 2.5, 5 at 1.5 and 5 mixed within one drawing, the looser 103 at 2.5 against 30 at 1.5. Card 1.14 reads three values as off-quarter radii no rule allows (0.772 `heart`, 0.805 `shield` `shield-2`, 1.727 `wrench` `wrench-2`); card 1.2 reads the same three as composite fits of on-quarter typed arcs — `heart` "Artifact", `shield` "the tip is tier 3 as declared" (0.8125), `wrench` typed 1.25 and 1.75. docs/09's "one real break" (`trash`) is a 30-concept pattern | `trash` `book-4` `book-open` `building` and the 1.5 containers | 30 concepts at 1.5 (card 1.14) ⇄ 12 container values over 617 corners at 24 (card 1.2) | [needs measuring] | systemic | docs/audit/findings-corners.md:737 · docs/audit/findings-corners.md:49 · docs/audit/findings-corners.md:226 · docs/audit/findings-corners.md:232-233 · docs/audit/rule-register.md:214-229 · docs/audit/stale-statements.md:319 | corners §11a-1 · sev §4.4 row 3 · Nucleo T4 |
| R-F2-16 | (2) | ⇄ Share of container corners on the modal tier at 24 · 20 · 16. Card 1.2: 61.8 · 61.4 · 58.6%, radii snapped to the nearest sixteenth. Card 2.3: 61.1 · 61.1 · 58.3%, a two-decimal count of the same corners. Both reprint; the plan lists the pair | container corners | 617 · 581 · 563 container corners | none (two figures for one share) | systemic | docs/audit/references-field.md:526 · docs/audit/findings-corners.md:49-51 · plans/set-and-rules-audit.md "container-radius share" | Nucleo T4 |
| R-F2-17 | (2) | `box:` was justified (docs/01:127-130) by a 12% keyline aspect drift and called "not a new keyline"; 9 of 56 `box:` concepts drift more than that, to 33.1% (`attachment-2`), and only 7 hold within 2%. The escape has no rule and drifts worse than what it escapes | `attachment-2` and the `box:` concepts | 56 concepts | [needs measuring] | systemic | docs/audit/findings-scaling.md:481 | R-4 |
| R-F2-18 | (2) | ⇄ The `box:` mechanism has swallowed the keyline rule: card 1.14 counts 57 concepts opting out with an agreed box in 57 distinct strings — a keyline system by accretion — where docs/01:126 calls each "a decision about one icon". Card 1.13 counts 59 distinct strings (one, `10x14`, shared between two masters) and finds card 1.16's 57 strings, also taken at the pin, does not reproduce; the plan's 57 is the pre-pin count | the `box:` concepts | 57 concepts | 338 drawings | systemic | docs/audit/rule-register.md:110 · docs/audit/exceptions-ledger.md:756 · docs/audit/exceptions-ledger.md:260 · docs/audit/stale-statements.md:149 | R-4 |
| R-F2-19 | (2) | ⇄ Three shared boxes exist in all but name — the folder box (20 × 18), the sort box (18 × 15) and the alert box — and carry 35 concepts in 210 files: `camera` `desktop` `briefcase` `folder` `heart` all stand 20 × 18. No document names any of them. The ledger's group L-5 says three; its proposal R-4 promotes two (the folder and sort boxes) | `folder` `camera` `desktop` `briefcase` `heart` and the rest of the 35 | 210 files | 210 drawings | systemic | docs/audit/exceptions-ledger.md:285-287 · docs/audit/exceptions-ledger.md:706 · docs/audit/exceptions-ledger.md:733 | R-4 |
| R-F2-20 | (2) | Two concepts use `optical:` for something C14 does not describe: `alert-triangle` ×4 is a construction lift (−0.5 at every master, putting the point on the margin) and `info-2`/`-3` move a mark inside a fixed ring; the build publishes both as `shift` | `alert-triangle` ×4 `info-2` `info-3` | 36 drawings | 36 drawings | systemic | docs/audit/findings-optical.md:591 · docs/audit/rule-register.md:127 | OC-2 |
| R-F2-21 | (2) | `play`'s shift is in its file (`play.svg:5`) but the *measure* behind it is recorded nowhere: 0.95 · 0.80 · 0.90 matches the triangle's centroid × 0.5 to the sheet's 0.05 step (raw 0.96 · 0.81 · 0.92), an inference from the numbers, not a record | `play` ×3 | 18 drawings | 18 drawings | one-off | docs/audit/findings-optical.md:593 · docs/audit/findings-optical.md:45-60 | OC-3 |
| R-F2-22 | (2) | C6 still calls the 20 and 16 keylines "proposals until the first icons are approved" (docs/07:46, docs/01:102); 485 concepts are approved and 2,910 drawings drawn to them | every drawing | none (a doc flag) | none (a doc flag) | systemic | docs/audit/findings-scaling.md:462 · docs/audit/stale-statements.md:150 · docs/audit/enforcement-gap.md:366 | — (a straight edit) |
| R-F2-33 | (2) | docs/01 §7 still advises "shifting mass up by 0.5 units" for a pin, a flag or a droplet, which C14/C15 replaced with a measured per-shape anchor — and C15 says "a value is never carried over from another icon". `map-pin` ships no `optical:` note at all (45 concepts carry one; the pin family is not among them) | `map-pin` | none (a docs/01 §7 bullet) | none (a docs/01 §7 bullet) | one-off | docs/audit/stale-statements.md:74-82 | — (card 1.16's edit) |
| R-F2-34 | (2) | C18's mass statements for `info-2` and `info-3` do not match card 1.11's measure: `info-2`'s mark sits +0.12 · +0.15 · +0.11 right of centre after the shift where C18 says it was "moved left 0.45 · 0.39 · 0.39 so its mass is centred"; `info-3` sits +0.33 · +0.69 · +0.48 low where C18 says the lift brings 0.94 to 0.59 at 24, a figure C18 itself calls stale. Two measures — centreline mass of the mark against an unstated whole-icon or ink-area measure | `info-2` `info-3` | `info-2` · `info-3` | [needs measuring] | one-off | docs/audit/findings-optical.md:702-703 | — |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F2-24 | (3) | 218 of 485 outlines at 24 are lopsided by mass by half a unit or more and nothing has looked at them — `login`'s door-and-arrow, the flags, `text`, `home`, `user`, `heart`, `map-pin`. A list for the eye, not a rule; the screen also ranks the arrows Maruti already judged and left centred | `login` `text` `home` `user` `heart` `map-pin` and the rest of §3.3 | 218 outlines at 24 | 218 drawings | systemic | docs/audit/findings-optical.md:589 · docs/audit/findings-optical.md:413 | — (optical sheet, one family at a time) |
| R-F2-25 | (3) | `keyline: mark` opts a drawing out of the silhouette keylines, and the size inside it is a rule nobody wrote: 390 files (65 concepts) have a size no rule names, and six families split mark against keyline — `grid` beside `grid-3`, `filter` beside `filter-2`, `chart-bar` beside `chart-bar-2` read as two sizes | `grid` `grid-3` `filter` `filter-2` `chart-bar` `chart-bar-2` and the rest of the 65 | 390 files | 390 drawings | systemic | docs/audit/exceptions-ledger.md:704 | R-2 · R-3 |
| R-F2-26 | (3) | A container's `-small` steps its mark by 2.5%–7.0% of the canvas, and at 16 by 0.5–1.0 of a unit. The weakest — `x-circle-small` 1.0 · 0.5 · 0.5, `check-circle-3` / `-4` 0.72 / 0.78 at 16 — step less than the `info-small` retired for being "a single pixel" (1.0). C18 says "chosen per icon" | `x-circle-small` `check-circle-3` `check-circle-4` and 3 more smalls | 6 families | [needs measuring] | systemic | docs/audit/findings-families.md:529 | FM-5 (E-1) |
| R-F2-27 | (3) | At 16 one radius-tier step is half a pixel: the three-tier spread is 0.875 px of tangent and 0.36 px of arc depth. Whether the set needs three container radii at 16 at all is the eye's, and the answer changes what `rotate-ccw-9` means | every container at 16 | 563 container corners at 16 | [needs measuring] | systemic | docs/audit/findings-corners.md:746 · docs/audit/findings-corners.md:51 | corners §11a-4 |
| R-F2-28 | (3) | `rotate-ccw-9` at 16 drops from tier 1 to tier 2 and its file says "Maruti to confirm" — the only unresolved radius question written into a shipped drawing. Its reason ("container radius 1.5 on a square this small read as a circle") is a claim about every small container at 16; the square is 4.25 units wide | `rotate-ccw-9` at 16 | 1 concept at 16 | [needs measuring] | one-off | docs/audit/findings-corners.md:745 | corners §11a-4 |
| R-F2-29 | (3) | `user-4` stands on the square where `user`, `user-2` and `user-3` stand on the portrait. Fine by every keyline; the arrangement words fix the box across all four figures, the figure number does not | `user-4` | 1 concept | [needs measuring] | one-off | docs/audit/findings-families.md:541 | — (E-2) |
| R-F2-30 | (3) | `thumbs-up` and `thumbs-up-2` hold the tip radius nearly constant across masters (1.5 / 1.5 / 1.375) because it controls the 1.5 gap floor inside the thumb, not a proportion — a gap rule wearing a radius. If it generalises, it is a rule | `thumbs-up` `thumbs-up-2` | `thumbs-up` · `thumbs-up-2` | [needs measuring] | one-off | docs/audit/findings-corners.md:748 · docs/audit/findings-corners.md:230 | — |
| R-F2-31 | (3) | `paintbrush` ×5 at 24 and 20 have fillets whose two tangent lengths differ by up to 5.6 units on an r3.75 corner — brush bellies, not corners. Flagged so the number is not read as a radius | `paintbrush` ×5 | 5 concepts at 24 and 20 | none (a measurement note) | one-off | docs/audit/findings-corners.md:749 | — |
| R-F2-35 | (3) | The flat and steep chevrons' odd member: the flat chevron pointing up ships a shift of 0.40 where its three siblings ship 0.55 (0.15 at 24, 0.11 at 16 — about a tenth of a pixel), and the steep one pointing down 0.61 where its siblings ship 0.65 (0.04). These are C14's recorded eye picks; C15's measure gives one magnitude per shape (0.50 · 0.40 · 0.65) and the picks sit ±0.15 around it. Eye picks, no rule broken — docs/09 already lists "symmetrise chevron shifts" among the six pending rulings | the flat and steep chevrons | 36 files (18 on each shape) | 36 drawings | one-off | docs/audit/findings-optical.md:592 · docs/audit/findings-optical.md:478-488 | OC-6 |
| R-F2-36 | (3) | The ledger's second reading of R-F2-19: `camera`, `desktop`, `briefcase`, `folder` and `heart` all stand 20 × 18, each by its own `box:` note — fine by every rule, and a keyline in all but name; no rule says when a shared box becomes a keyline | `folder` `camera` `desktop` `briefcase` `heart` and the rest of the 35 | 210 files on the shared boxes | see R-F2-19 (one finding, two kinds) | systemic | docs/audit/exceptions-ledger.md:303 · docs/audit/exceptions-ledger.md:706 | R-4 |

---

## F3 — The armature

The same object recurring as one drawing: shared parts, shared bodies, shared boxes. Naming
consequences of the same measurements (C9, C27 as names) are in X.

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F3-02 | (2) | ⇄ "No family in this set keeps one ink box" (`plans/sort-family.md`) is false of the set. Card 1.10: 51 of 107 numbered runs keep one 2 dp box exactly at all three masters (definition A), 53 within lint's ±0.01 (definition B); true of 56 runs under A or 54 under B. Card 1.16 found 53 of 107 at 24, which is B. The two definitions differ on `cursor` (24, 20) and `home` (20) alone, by at most 0.0132 units | the 107 numbered runs | 393 concepts in 107 runs | none (a stale headline) | one-off | docs/audit/findings-families.md:521 · docs/audit/findings-families.md:660-661 · docs/audit/stale-statements.md:345-386 · plans/set-and-rules-audit.md "No family in this set keeps one ink box" | — (a stale statement, card 1.16) |
| R-F3-03 | (2) | C27's figure number does not carry the figure into the geometry: `users-2` is drawn with `user`'s head (⌀8 ink at 24, residual 0), not `user-2`'s (⌀10); `user-2`, `user-3` and `user-4` share one head; the head sizes group by arrangement, never by figure number, and at 16 nine concepts collapse onto one ⌀5 head. The Settled table's "the number names the figure and travels with the object" reads as a geometric promise | `users-2` `user-2` `user-3` `user-4` and 16 more | 20 concepts | [needs measuring] | one-off | docs/audit/findings-primitives.md:959 · docs/audit/findings-primitives.md:714 | — (Maruti: identity or naming?) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F3-01 | (3) | ⇄ The shared check broke at 16. `checkbox` and `check-circle` carried one check path, byte for byte, at 24 and 20; at 16 three of the four pairs are two drawings, up to 0.258 px apart (card 1.1, best-fit residual 0.106 · 0.172 · 0.258); `checkbox-4` / `check-circle-small` stays identical. Card 1.9 reads the first pair as 6.5 against 6.58 wide — the file's own declared 0.08. Nothing says a shared part must stay shared, which is what earns the primitive-drift linter. (Card 1.1 tags it kind 1 while saying "no rule was broken"; card 1.9 files it kind 3; here (3), see §0) | `checkbox`/`check-circle` · `checkbox-2`/`check-circle-3` · `checkbox-3`/`check-circle-4` at 16 | 3 of 4 pairs at 16 | [needs measuring] | systemic | docs/audit/findings-primitives.md:881 · docs/audit/findings-primitives.md:598-602 · docs/audit/findings-primitives.md:612-614 · docs/audit/findings-grammar.md:679 · docs/audit/findings-families.md:671 | P7 · primitives item 1 · primitive-drift check 1 · SF T3 |
| R-F3-04 | (3) | ⇄ Shared parts break at one master and nothing says they may not: 30 concepts in 9 parts — the door in `home`, `store`, `building`; the star in `sparkle-2`, `sparkle-3` and `wand`; the knob in `sliders`; the hook in `cart`; the cradle, the shackle — with the largest residual 0.625 u (0.42 px, the shackle at 24), most under 0.333, none visible. Card 1.9 also lists 7 body pairs identical at one master only; card 1.14's whole-outline list has 5 pairs identical at 16 only — bodies and files are different counts | `home` `store` `building` `sparkle-2` `sparkle-3` `wand` `sliders` `cart` `microphone` `lock` `refresh-3` and relatives | 30 concepts in 9 parts (card 1.9) ⇄ 5 whole-outline pairs at 16 (card 1.14) | [needs measuring] | systemic | docs/audit/findings-grammar.md:529 · docs/audit/findings-grammar.md:678 · docs/audit/rule-register.md:358 | P7 · SF T3 |
| R-F3-05 | (3) | ⇄ A third clean container exists and is unnamed: the 20×16 landscape box (radius 2.5) is one drawing in `credit-card` ×3, `desktop-5`, `image-3`, `mail` ×2, `wallet-2` — exact, like the ring and the rounded square. The keyline table names it; no doc says it is one drawing. The square's carriers at 24: 24 by card 1.9, 26 by card 1.1 | `credit-card` ×3 `desktop-5` `image-3` `mail` `mail-2` `wallet-2` | 8 concepts at 24 | none (naming a primitive; the drawings are exact) | systemic | docs/audit/findings-grammar.md:562 · docs/audit/findings-grammar.md:682 · docs/audit/findings-primitives.md:988 | — (card 4.2's primitive sheet) |
| R-F3-06 | (3) | `clipboard` and `clipboard-2` share a bounding box at every master (14.5 × 17 at 24) but not a body: two different paths inside it, 0.500 u = 0.333 px apart at 24 and 0.250 u at 16. The clearest "two drawings where the set wanted one" | `clipboard` `clipboard-2` | `clipboard` · `clipboard-2` | [needs measuring] | one-off | docs/audit/findings-primitives.md:977 | — |
| R-F3-07 | (3) | Near misses inside a family: two parts congruent within 0.05 units but not identical — `package-2`/`package-3` at 20 (0.040 u) and 16 (0.025 u), `users-3-behind`/`users-3-level` at 16 (0.013 u), `arrow-up-right-5`/`-4` filled at 16 (0.030 u); widened to 2% of the canvas, 259 pairs. Invisible each, and the kind of drift that accumulates when nothing checks it | `package-2` `package-3` `users-3-behind` `users-3-level` `arrow-up-right-4` `arrow-up-right-5` | 4 pairs within 0.05 u; 259 pairs at a 2% band | [needs measuring] | systemic | docs/audit/findings-primitives.md:1052-1058 | primitive-drift check 2 |

---

## F4 — A closed vocabulary

Parts and angles as a finite list: the dot, the arrowhead, the repeated element, the angle set.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F4-01 | (1) | Five circle radii break their master's grid, all from one dot: r 0.6 and 1.35 at 20, r 0.45, 0.575 and 1.2 at 16, none at 24 — the C17 dot stepping ⌀3 → ⌀2.7 → ⌀2.4 of ink needs an off-grid radius at both smaller masters. The files carry comments, so lint's comment hatch silences the grid warning. Card 1.1 counts "80 files", more than six concepts hold at two masters — `[needs checking]` | `grid-3` `list-bullet-2` `more-horizontal` `more-vertical` `target-2` `target-3` | 6 concepts | [needs measuring] | systemic | docs/audit/findings-primitives.md:921 · docs/audit/findings-primitives.md:262-270 | R-1 · primitives item 6 · primitive-drift check 4 (eye: ⌀2.5 at 20?) |
| R-F4-02 | (1) | A 20 / 70 degree convention runs through 7 concepts at all three masters, held to 0.08 degrees, built as a degree target with off-grid endpoints — 152 segments, not on §3's list of permitted angles, and it carries the set's two largest ink drifts (`send` and `cursor-3` at 5.46 units). Six of the seven files declare it one at a time; `cursor-click` declares nothing and drifts 3.37 | `compass` ×3 `cursor` `cursor-3` `cursor-click` `send` | 7 concepts | [needs measuring] | systemic | docs/audit/findings-angles.md:624 · docs/audit/findings-angles.md:633 · docs/audit/findings-angles.md:236 | angles §7a-4 · R-8 |
| R-F4-03 | (1) | C16's "the only head used in composites" is broken by 17 concepts: five sort arrows carry a narrow head (8 · 7 · 6) — `sort-3` and the four `sort-alpha`/`sort-numeric` arrows — and the twelve `refresh`/`rotate-ccw` arrows three lengths of their own. `sort-ascending`/`-descending` carry the medium head, as C16 says | `sort-3` the four `sort-alpha-*`/`sort-numeric-*` arrows and the `refresh` / `rotate-ccw` family | 17 concepts | [needs measuring] | systemic | docs/audit/findings-grammar.md:536 · docs/audit/findings-grammar.md:355-358 | P4 · SF T3 |
| R-F4-04 | (1) | The `sort-alpha` (6 concepts) and `sort-numeric` (6 concepts) letterforms are off axis by 21.09 and 15.04 degrees and declare nothing; four of the twelve are bare defaults. The same twelve carry the 60 lint warnings (gap warnings, §6) that `plans/sort-family.md` calls "expected", with no C-row in docs/07 | `sort-alpha-*` ×6 `sort-numeric-*` ×6 | 12 concepts | [needs measuring] | one-off | docs/audit/findings-angles.md:631 | angles §7a-5 · R-7 |
| R-F4-05 | (1) | `wrench` / `wrench-2` / `wrench-3` carry an undeclared 1.1–3.6 degree taper at all three masters — a third wall taper in the set, like `trash`'s licensed 4 degrees, with no C-row; the files declare only "45 deg". Tiny in pixels (0.19 units) | `wrench` `wrench-2` `wrench-3` | 3 concepts | [needs measuring] | one-off | docs/audit/findings-angles.md:630 | R-8 |
| R-F4-06 | (1) | `list-ordered`, a bare default, leans at 39.7–42.9 degrees and declares nothing in its file, though C19's dated note discusses the numeral's diagonal; the file is where C30 says the justification lives | `list-ordered` | `list-ordered` | [needs measuring] | one-off | docs/audit/findings-angles.md:632 | R-8 |
| R-F4-22 | (1) | 16 concepts are more than 2° off axis, declare nothing in their files and sit in no other row — `shield-2` 22.35°, `lightbulb-3`/`-4` 22.12°, `megaphone-2` 18.43°, `alert-triangle-3` 17.42°, `chevrons-up-down-3`/`-4` 12.99°, `map-pin-3` 8.78°, six check variants 6.90–8.24° (C11 licenses the angle; the files do not state it), `alert-circle-4` 6.70°, `help-4` 2.29° — against docs/01 §3's "must be justified in the source file". Card 1.3 lists 34 such concepts; the rest are in R-F4-02, -04, -05, -06, R-F13-04 and R-F13-07 | `shield-2` `lightbulb-3` `lightbulb-4` `megaphone-2` `alert-triangle-3` `chevrons-up-down-3` `chevrons-up-down-4` `map-pin-3` the six `check-*-3`/`-4` variants `alert-circle-4` `help-4` | sixteen concepts (card 1.3's list holds 34 by its heading; its table names one more) | [needs measuring] | systemic | docs/audit/findings-angles.md:380-400 · docs/audit/exceptions-ledger.md:737 | R-8 |
| R-F4-23 | (1) | Card 1.14's half of R-F4-12: of the 29 bare defaults off axis at 24, roughly 17 have no grant anywhere — `compass`, `cursor`, `cursor-click`, `heart`, `italic`, `list-ordered`, `play`, `send`, `shield`, `star`, `thumbs-up`, `wand`, `wrench` and the four `sort-*` — "a type-(1) finding at scale: 17 default drawings disagree with a stated rule, nothing checks it, and every one of them was approved by eye" | the 17 named | 17 concepts at 24 | [needs measuring] | systemic | docs/audit/rule-register.md:230-247 · docs/audit/rule-register.md:252-253 | angles §7a-6 |
| R-F4-24 | (1) | `more-horizontal`'s dots at 16 sit 0.9 of a dot apart, where C17 spaces repeated elements by their own thickness. The file says so in prose — "the gap equals the dot at 24 and 20, 0.9 of it at 16 so the filled row fits 12" — an agreed deviation with no note lint can read | `more-horizontal` at 16 | `more-horizontal` | [needs measuring] | one-off | docs/audit/findings-primitives.md:543-546 | primitives item 5 (declare it) |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F4-08 | (2) | Lint does not check angles at all (docs/01:201 and C30 say so in terms). Every angle figure in the audit was unenforced. Card 1.3 says "the three licensed exceptions are held by prose", counting C-rows; docs/07 holds about 20 per-icon grants over about 50 concepts, and docs/01 §3 names none of them | every straight segment | 17,091 segments | every drawing (lint checks no angle) | systemic | docs/audit/findings-angles.md:643 · docs/audit/findings-angles.md:4 · docs/audit/enforcement-gap.md:265-266 · docs/audit/stale-statements.md:84-90 | R-8 · angles §7a-8 |
| R-F4-09 | (2) | §3 has no category for the near-miss, so 379 segments read as rule breaks when they are §3's own permitted exception working: all 379 are nearest 45, none has both endpoints on the grid, 252 miss by exactly 0.010, and the whole band displaces at most 0.064 px | the 45° legs that end on an arc | 379 segments | [needs measuring] | systemic | docs/audit/findings-angles.md:641 | angles §7a-1 |
| R-F4-10 | (2) | ⇄ C30 says a drawn character declares its run and rise, not a degree figure; the set's working convention is "declare the degrees, and the run and rise where they are clean". Card 1.3 counts 183 concepts declaring a degree figure in its judged list and 193 in its census — one document, two figures for one quantity, as the ledger notes | `code` and every file with a degree note | 183 concepts ⇄ 193 concepts (both card 1.3) | none (a comment convention) | systemic | docs/audit/findings-angles.md:642 · docs/audit/findings-angles.md:372 · docs/audit/exceptions-ledger.md:758 | R-8 |
| R-F4-11 | (2) | §3 permits 30 and 60 degrees; its own grid cannot produce either. Zero segments in 2,910 drawings sit at exactly 30.000 or 60.000 (closest 0.0014); 316 segments in 21 concepts sit within 0.5 of one, reached two ways — grid ratio 7:4 (29.74) in `gear` and `play-3`, off-grid decimals in `star`, `gear-3`, `wand-2` | `gear` `play-3` `star` `gear-3` `wand-2` and the rest of the 21 | 21 concepts | [needs measuring] | systemic | docs/audit/findings-angles.md:639 | angles §7a-3 |
| R-F4-12 | (2) | ⇄ docs/09:24 says "every default obeys it; leaving it is what makes a numbered variant". Card 1.3, at any master: 46 bare defaults leave 0/45/90 by more than 0.5 degrees and 29 by more than 2; numbered variants are off axis 35.69% of the time against defaults' 31.90%. Card 1.14, at 24 outline, tolerance 0.5°: 121 concepts carry an off-axis segment, 29 of them defaults. Card 1.3's 29 (> 2°) and card 1.14's 29 (> 0.5°, at 24) are different tests. Card 1.14's kind (1) half is R-F4-23 | `compass` `cursor` `heart` `italic` `list-ordered` `play` `send` `shield` `star` `thumbs-up` `wand` `wrench` and the four `sort-*` | 46 defaults > 0.5° · 29 > 2° (card 1.3) ⇄ 29 defaults > 0.5° at 24 (card 1.14) | [needs measuring] | systemic | docs/audit/findings-angles.md:640 · docs/audit/rule-register.md:230-250 · docs/audit/stale-statements.md:317 | angles §7a-6 |
| R-F4-13 | (2) | ⇄ `italic` shipped with a 74.4–75.7 degree lean and 4.50 units of ink drift (the third-largest in the set); C30 pre-authorised it as "its own decision on its own evidence" and no C-row records that decision. Card 1.3 reads the file as declaring "12.8° 14.4° 15° 20.6°"; card 1.14 reads it as shipping "with no C-row and no note" | `italic` | 1 concept | [needs measuring] | one-off | docs/audit/findings-angles.md:644 · docs/audit/rule-register.md:248-250 | angles §7a-5 |
| R-F4-14 | (2) | ⇄ C17 "repeated elements are spaced by their own thickness" and no drawing obeys it: measured across the family the ratio runs 0.50 to 5.00; true for `more-horizontal`, `more-vertical`, `grid-3` at 24 and 20 and nothing else; CLAUDE.md's own parenthesis gives menu's gap as 3 on a 1.5 line, which is 2×. C17's own numbers (3 / 4.5 / 6) are superseded by a dated note inside the row (3.25 / 4.75 / 6.25 at 16). Card 1.1 says C17 was written from one drawing (`more-horizontal` at 24); card 1.14 says from `menu` ×6 and the `more` dots | the `menu` family, the `more` dots and the grids | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-primitives.md:912 · docs/audit/findings-primitives.md:541-543 · docs/audit/rule-register.md:151 · docs/audit/rule-register.md:174 · docs/audit/stale-statements.md:387-394 | primitives item 5 (restate C17 as "agreed per family and declared") |
| R-F4-07 | (2) | `ban-3`'s note is 0.177 units wrong at 16: it says half-length "6 / 4.125 / 3.125"; measured 5.9965 / 4.1295 / 3.3022. The 16 was redrawn in the stroke-16 conversion and the prose was not — the drawing is right, its note is not. (Moved from kind (1): see §0) | `ban-3` at 16 | 1 concept at 16 | [needs measuring] | one-off | docs/audit/findings-primitives.md:954 | — (card 1.16) |
| R-F4-21 | (2) | `x`'s own note says the x sits "about 1.5 inside the plus box"; measured it is 2.0 / 1.5 / 1.5 inside — right at 20 and 16, 0.5 out at 24. C8 holds exactly; only the note is off. (Moved from kind (1): see §0) | `x` | `x` | [needs measuring] | one-off | docs/audit/findings-primitives.md:315-316 · docs/audit/findings-primitives.md:1038 | — (card 1.1's hand-off to card 1.16) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F4-15 | (3) | 82.49% of straight segments sit exactly on 0/45/90 and 2,464 of the rest (84%) are deliberate; what the set lacks is a *vocabulary*: the list in use is 0/45/90, then 20/70, 15/75, 26.57 (1:2), 33.69 (3:2), 36.87 (3:4), 53.13 (4:3), 63.43 (2:1), 71.57 (3:1), 80.54 (6:1), plus per-subject angles (`star` 72, `shield` 68, `watch` 8.5 off upright, `trash` 4, `code` 73) | every off-axis concept | 2,464 segments | [needs measuring] | systemic | docs/audit/findings-angles.md:650 | angles §7a-3 |
| R-F4-16 | (3) | Only 232 of 2,464 off-axis segments (9.4%) are on a small whole-number run:rise; the other 2,232 aim at a degree and pay in off-grid endpoints — a decision about the grid, not about any one drawing | the off-axis set | 2,232 segments | [needs measuring] | systemic | docs/audit/findings-angles.md:651 | angles §7a-3 |
| R-F4-17 | (3) | The glyph dot stops being its own size at 20: ⌀2.5 at 24 — a distinct element with C19's own gap rule — becomes ⌀2 at 20 and 16, the same circle as `building`'s window. One fewer distinction at the two smaller masters | `info` `help` `alert-circle` and their siblings | 13 concepts | [needs measuring] | systemic | docs/audit/findings-primitives.md:940 | primitives item 8 (eye, real 16 beside `building`, `printer-2`) |
| R-F4-18 | (3) | `rotate-ccw`'s eleven concepts draw one arrowhead at three lengths in two orientations: 4.250 (axis-aligned), 4.257 (the same V turned 45°) and 3.507 (`rotate-ccw-6`) at 24. The 0.007 is rounding of turned endpoints; the visual cost is 0.005 px at 16; the real cost is that there is no single number to change | `rotate-ccw` … `rotate-ccw-10` | eleven concepts | [needs measuring] | one-off | docs/audit/findings-primitives.md:931-938 | primitive-drift check 2b · SF T3 |
| R-F4-19 | (3) | `play`, `play-2`, `play-3` declare three different angle sets (58.7–60.8 / 60.0–62.4 / 59.5–61.2) and `megaphone`, `-2`, `-3` two (18.4–71.6 / 26.6) — the angle twin of the corners' `play` tier finding | `play` ×3 `megaphone` ×3 | 6 concepts | [needs measuring] | one-off ×2 | docs/audit/findings-angles.md:652 | — |
| R-F4-20 | (3) | `sparkle`, `-2`, `-3`, `-4` declare four different point half-angles (26.79 / 28.5 / 27.29 / 23.06) and use eight distinct run:rise ratios between them — four variants, four geometries, no stated relationship | `sparkle` ×4 | 4 concepts | [needs measuring] | one-off | docs/audit/findings-angles.md:653 | — |

---

## F5 — A grammar for combination

Modifier position, size, air and cut-back; what a level family or a figure family promises.

### Kind (1) — a drawing disagrees with a stated rule

Both rows are rows of the sheet, not drawings — queued icons that break a stated rule before they
are drawn. They are marked "(1) in the sheet".

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F5-01 | (1) in the sheet | The sheet breaks docs/05's own entry test — "ship at least three modifier variants of that base" — in 30 places: 34 bases are queued, 30 have one or two variants, 23 exactly one. Either the test goes or the rows do | the queued composites | 30 bases | none (queued rows) | systemic | docs/audit/findings-grammar.md:568 | — (either the test goes or the rows do) |
| R-F5-02 | (1) in the sheet | `user-search` is queued (row 434) against docs/05:31, "never `<object>-search`" | `user-search` | 1 planned | none (a queued row) | one-off | docs/audit/findings-grammar.md:566 | P1 (strike the row or the rule) |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F5-03 | (2) | `docs/05` disagrees with C7, C21, docs/01 and the drawings on six counts: clearance "1.5 (one stroke)" (C7 made the two differ at 16 — 1 stroke at 24 and 20, 1.2 strokes at 16); the slash's 2-unit channel against the drawn 2 · 1.75 · 1.75 and 1.5 · 1.5 · 1.25; "live area" against docs/01:42; the zone inside the live area against badges to 23 (docs/01:68); strategy C "rejected outright" against `external-link` ×2 and `compose` shrinking their box; anchor and sizes written for stroke 2. Its slash (`M4 4l16 16`) is superseded by C21 and still written | `external-link` ×2 `compose` `ban` `volume-off` | none wrong (one document) | none (one document) | systemic | docs/audit/findings-grammar.md:544 · docs/audit/references-sf.md:651 · docs/audit/rule-register.md:380-398 · docs/audit/stale-statements.md:302-303 | P8 · SF T4 |
| R-F5-04 | (2) | May a badge cross 22? docs/01:68-70 says badges may run to 23 of 24; docs/05:59-61 says the clear zone "stays inside the live area and never touches trim"; docs/01:42 says there is no live area; lint has no badge exemption. Undecided since September and free today: zero *badge* composites ship (78 composites of other kinds do), and every container drawn without a sparse bottom-right quadrant makes the cut-back dearer | none yet | 0 badge composites | none (0 badge composites) | systemic | docs/audit/enforcement-gap.md:359 · docs/audit/rule-register.md:97 · docs/audit/rule-register.md:135 · docs/audit/findings-grammar.md:676 | P1 · sev §4.4 row 7 · Fluent T4 · Fluent T5 |
| R-F5-05 | (2) | docs/05 §3 (how to cut a base round a badge) and C18 (how a container takes a mark) never meet: docs/05's modifier set has no enclosure, and the `-circle` marks are drawn by C18 — the mark redrawn shorter inside a fixed ring. Which governs a drawing with both a container and a badge is unwritten. Apple redraws 88% of its 744 enclosures and scales about one in ten | `check-circle` and its relatives, tomorrow's `user-plus` | 0 badge composites | none (0 badge composites) | systemic | docs/audit/references-sf.md:631-639 · docs/audit/rule-register.md:97 | P1 |
| R-F5-06 | (2) | docs/05 §2 fixes the badge anchor at bottom-right "always"; docs/09 §5 item 4 offers top-right. Apple's 259 measured badges: bottom-right 54.1%, bottom-left 24.3%, top-right 16.2%, top-left 5.4% — "per base". Three sources, three answers | none yet | 0 badge composites | none (0 badge composites) | systemic | docs/audit/references-sf.md:641 · docs/audit/rule-register.md:97 | P1 |
| R-F5-07 | (2) | docs/05 §1 says modifiers destroy "roughly a quarter of the base", backed by Fluent's subpath counts (8 → 4), not ink. Measured on ink in Apple: median 18% (badge) and 22% (slash), p90 34% and 57% — right order, wrong shape | none yet | none (a sentence) | none (a sentence) | one-off | docs/audit/references-sf.md:646 | SF T5 |
| R-F5-08 | (2) | C28's member list omits two shipped, anchored members: five concepts carry `<!-- anchor: volume -->` — `volume-low`, `volume-none`, `volume-x`, `volume-minus`, `volume-plus` (30 files) — and the last two, approved the day C28 was written, appear in no rule document. They are controls, neither a level nor a state; C28 has no category for them, yet lint holds them to its rule | `volume-minus` `volume-plus` | 12 files | 12 drawings | one-off | docs/audit/stale-statements.md:100 · docs/audit/exceptions-ledger.md:713 · docs/audit/findings-families.md:668 | — (a ruling: what are they?) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F5-09 | (3) | The through kind keeps an unwritten rule to the thousandth and the beside kind has none: 7 of 18 composites with an arrow or tool crossing the object hold exactly 1.500 · 1.500 · 1.500 of air where the modifier meets the base and 6 more 1.505 · 1.505 · 1.578; the 25 beside composites run 1.6–4.5 at 24 | `login` `logout` `upload` `export` and the 43 composites | 43 concepts | [needs measuring] | systemic | docs/audit/findings-grammar.md:533 · docs/audit/findings-grammar.md:158 | P2 · P3 |
| R-F5-10 | (3) | ⇄ The corner badge has no grammar and at least 38 icons are queued to need one; 0 shipped. `docs/05` is the only rule document never exercised; its anchor, zone and sizes are for stroke 2 and a live area; the three references cut the base back and let the badge spend the margin, and we have never spent the margin in 47 composites. Four counts of what is queued: card 1.9, at least 38 corner-badge · 19 strike · 21 enclosure, by a name's last word, checked by hand; card 1.10, 110 rows `variant of` a shipped base, by the sheet's own column; card 1.17, live Polaris draws 29 of the 38, and separately 38 live Polaris names carry a badge word | `file-plus` `user-plus` `bell-plus` … | 38 planned (card 1.9) ⇄ 110 queued rows (card 1.10) | none (queued rows; 0 shipped) | systemic | docs/audit/findings-grammar.md:524-528 · docs/audit/findings-families.md:666 · docs/audit/references-polaris.md:551 · docs/audit/references-polaris.md:581 | P1 · PL-7 · Fluent T4 · Fluent T5 · SF T4 |
| R-F5-11 | (3) | A composite's base may be a smaller redraw of the object, or may not — nothing says: `external-link`'s box 15 / 14, `compose`'s 16, `images`' frame 15 (against the 18 square), `cursor-click`'s cursor 12.25 (against 18). Four bases redrawn smaller, none a scaled copy, none named a variant; doc 05 forbids it for badges and is silent for everything else | `external-link` ×2 `compose` `images` `cursor-click` | 8 concepts | [needs measuring] | systemic | docs/audit/findings-grammar.md:557 | P3 · SF T5 |
| R-F5-12 | (3) | A mark beside an object is a size of its own: `volume-plus` is the sixth plus size at 24 (8, where the smallest shipped plus is 9); the arrow in a door is 15 · 11 · 9.25 — "what the box leaves". Nothing says whether a modifier is a shipped mark size or a fraction of its object | `volume-plus` `volume-minus` `volume-x` | 3 concepts | [needs measuring] | systemic | docs/audit/findings-grammar.md:540 | P1 · P2 |
| R-F5-13 | (3) | C28 is silent on a level that is a fill or a bar inside a body, and eight queued names would meet it — `battery` ×4, `signal`, `wifi`, `loader`, `progress-bar`; 19 `-off` / `toggle-off` / `eye-closed` rows are states, `volume-off`'s kind. Nothing is drawn, so nothing is wrong; the first battery board decides | `battery` ×4 `signal` `wifi` `loader` `progress-bar` | 0 shipped, 8 queued | none (queued rows) | systemic | docs/audit/findings-families.md:551 | — (not proposed, by design) |

---

## F6 — Behaviour across sizes

What is held and what gives from 24 to 16. Nothing in the shipping toolchain reads two masters of
one icon (R-F6-03), so every row here was unchecked by anything in the build.

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F6-01 | (2) | **The keyline table makes one apparent size impossible across masters.** The margin is 2 · 2 · 1, so the drawing bound is 83.3% / 80.0% / 87.5% of its canvas and the circle and square keylines run on two different curves. 0 of 485 concepts hold their share of the canvas within 2% while 280 of 287 keyline-held concepts hold their keyline exactly — the two are mutually exclusive. A square icon beside a circle icon reads 0.900 : 1 at 24, 0.875 at 20, 0.857 at 16, a 5.0% swing across 123 and 78 concepts. No drawing is at fault; it is one line of `tools/masters.mjs` | every keyline-held drawing | 0 of 485 concepts hold their share; 280 of 287 hold their keyline | every drawing (the keyline table) | systemic | docs/audit/findings-scaling.md:451-460 · docs/audit/findings-scaling.md:31-32 | — (the wall, with a 1.5-margin toggle) |
| R-F6-02 | (2) | C8's absolute step makes marks grow into the small masters: a step of 3 · 2.5 · 2 on a per-master base gives the 136 mark concepts a median +15.0% share gain from 24 to 16, worst +27.3%, against the keyline population's +5.0%. At 16 the default `plus` fills the mark ceiling exactly and `plus-large` the drawing bound. Lint verifies the step (102 of 120 exact; the 18 others are C18 containers) and nothing verifies the base | `plus` `plus-large` `x-small` and the 136 marks | 136 concepts | 816 drawings | systemic | docs/audit/findings-scaling.md:474-480 · docs/audit/findings-scaling.md:34 · docs/audit/rule-register.md:98 | — (eye: the size grid at real 16) |
| R-F6-03 | (2) | Lint cannot see a missing master or an extra file: every check looks up `${master}/${file}`, so delete `src/icons/16` and lint reports 1,940 drawings, all clean, exit 0; a tree with no `src/icons` prints 0 drawings and exits 0. A missing *style* is caught, as a warning, by the pair check. Axis F6 has no instrument in the shipping toolchain | every concept | 0 drawings missing today | every drawing (no check reads two masters) | systemic | docs/audit/enforcement-gap.md:119-140 · docs/audit/severity-proposal.md:145 | sev §5 row 3 · sev §7-3 |
| R-F6-04 | (2) | The angle of an intended 45° leg gives at 16, in the outline: mean deviation 0.011° at 24 → 0.034° at 16, and 87 fewer legs stay inside half a degree (the filled 16 holds 0.009°). C10 records the mechanism and its "largest change 1.87 degrees on `check-circle-small`" reproduces exactly (population B: 149 segments, 105 at 16, max drift 0.177 units); docs/01 §3 does not say its angles give at 16 | every 45° mark at 16 | 149 segments | [needs measuring] | systemic | docs/audit/findings-scaling.md:35 · docs/audit/findings-scaling.md:333-338 · docs/audit/findings-angles.md:670 | angles §7a-2 |
| R-F6-10 | (2) | The policy the drawings actually follow across masters — hold the keyline, the detail and the corner tier; let the share of the canvas, the mark-to-container proportion and the angle give — is written nowhere. Card 1.4: "Nobody wrote that down. It is what 485 concepts do"; card 3.1 carries it as F6's gap | every concept | none (an unwritten policy) | none (an unwritten policy) | systemic | docs/audit/findings-scaling.md:38-40 · docs/audit/judging-standard.md:56 | — (state it, or choose another) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F6-05 | (3) | ⇄ The mark inside its container drifts: mean −4.7% from 24 to 16 over 121 container concepts, worst −25.9% (`map-pin`); 10 hold the inset absolutely, 12 proportionally, 39 between. Card 1.1 reads the same drawings as the mark-to-free-mark ratio: 0.700 → 0.593 → 0.542 (`plus`), 0.692 → 0.542 → 0.524 (`x`) — docs/08 §6.1's drift, measured. docs/09 §4 lists it as a missing rule | `plus-circle` `x-circle` `map-pin` and the 121 containers | 121 container concepts (card 1.4) | [needs measuring] | systemic | docs/audit/findings-scaling.md:33 · docs/audit/findings-scaling.md:534 · docs/audit/findings-primitives.md:1030 | Nucleo T1 (eye: three policies drawn for `plus-circle`) |
| R-F6-06 | (3) | The live area is not monotone across masters: the typical drawing is 75.0% of the canvas at 24, 70.0% at 20 and 75.0% at 16 (ring 83.3 · 80.0 · 87.5%); held ink is ×0.930 at 20 and ×1.082 back at 16. Every keyline rule is satisfied; nothing says the sequence should rise, fall or stay | every drawing | 485 drawings per master (card 2.3) | every drawing (485 per master) | systemic | docs/audit/references-nucleo.md:476 · docs/audit/references-nucleo.md:134-136 · docs/audit/findings-primitives.md:1029 | Nucleo T1 (eye-only) |
| R-F6-07 | (3) | The `play` family runs against its whole population: `play-3` −15.6%, `play`/`play-2` −8.3% share from 24 to 16, against +15.0% median for the other 128 marks; ink 16×18 / 12×13 / 10×11. Its file held the point angle (60.8° / 58.7° / 59.7°) and let the box give. Beside `chevron-right` (+12.5%) and `arrow-right` (+20.0%) a play triangle does the opposite of its neighbours | `play` `play-2` `play-3` | 3 concepts | [needs measuring] | one-off | docs/audit/findings-scaling.md:506-512 | — (eye: a media-control row at real 16) |
| R-F6-08 | (3) | `filter-2`, `text-2`, `text-4`, `grid-3`, `grid-4` occupy a different amount of canvas from their own siblings — 15–20 percentage points of share change apart inside one numbered family, one member on a keyline and the other on the mark ceiling | `filter-2` `text-2` `text-4` `grid-3` `grid-4` | 5 concepts | [needs measuring] | one-off ×3 | docs/audit/findings-scaling.md:518 | R-3 |
| R-F6-09 | (3) | `keyboard`, `keyboard-2`, `watch` hold nothing measurable across masters: `box:` régime, aspect drifting 19.0 / 19.0 / 22.5%, detail shedding (7/6/6, 8/7/7, 4/4/3). Three drawings re-proportioned by eye at each master, breaking no rule | `keyboard` `keyboard-2` `watch` | 3 concepts | [needs measuring] | one-off ×2 | docs/audit/findings-scaling.md:522 | — |

---

## F7 — Crisp where it is used

Where edges land on the pixel grid at 16, and the grid rule that is meant to put them there. A
**pixel phase** is where an edge falls inside a pixel at 1×: on the line between two pixels the edge
is hard; a quarter or a half in, the pixel goes grey.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F7-01 | (1) | The 16 tab lengths of `folder-2` (5.677) and `folder-3` (2.927) sit off the eighth grid where the 24 and 20 are on the quarter grid — hidden by the comment hatch like every other off-grid value. (Card 1.1's handover line calls them `folder`'s; its §4.1 table puts them on `-2` and `-3`) | `folder-2` `folder-3` at 16 | `folder-2` · `folder-3` | [needs measuring] | one-off | docs/audit/findings-primitives.md:670-678 · docs/audit/findings-primitives.md:1046 | R-1 |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F7-02 | (2) | **The off-grid check is dead across the whole set.** `lint.mjs:216` turns an off-grid warning into a "documented exception" when the file has *any* comment; every one of the 2,910 files has one, so the warning branch fires 0 times. Behind it 1,888 drawings (64.9%) put a straight-segment coordinate off the grid — the case docs/01 §3 does not allow. Of the 27,029 off-grid values, 14,285 are arc parameters or arc endpoints, which §3 allows; counting those too, 1,967 drawings hold an off-grid value. docs/09:28 ruled the literal rule dead in September; unactioned | `gear-3-filled` at 24 (165 values) and the rest of the 1,888 | 1,888 drawings (card 3.5); 1,967 counting arc values (cards 1.13, 1.15) | 1,888 drawings | systemic | docs/audit/severity-proposal.md:117 · docs/audit/enforcement-gap.md:54-87 · docs/audit/exceptions-ledger.md:702 · docs/audit/exceptions-ledger.md:755 · docs/audit/rule-register.md:184 | R-1 · sev §4.4 row 4 · sev §4.5 row 2 · sev §5 row 1 · sev §7-5 |
| R-F7-03 | (2) | ⇄ "Every decimal in a path carries a comment saying what it corrects" (CLAUDE.md:272, docs/01:184-185, 376-377). Card 1.14: no file does it and no file ever did — all 2,910 carry a construction description instead, which is what silences the grid check, and none annotates a decimal. Card 1.15: per-decimal coverage is `[needs measuring]` and cannot be checked mechanically; by keyword proxy 493 of the 1,967 off-grid drawings say something about why. Card 1.13 reads 518 with its own word list | every file | 2,910 files read (card 1.14) ⇄ 493 of 1,967 say why (card 1.15) ⇄ 518 of 1,967 (card 1.13) | every drawing (2,910 files read) | systemic | docs/audit/rule-register.md:189 · docs/audit/enforcement-gap.md:74-78 · docs/audit/exceptions-ledger.md:751 · docs/audit/severity-proposal.md:126 | sev §4.5 row 1 · sev §7-5 · R-1 |
| R-F7-04 | (2) | ⇄ docs/01:187's 2 dp at 24 and 20 against C18's 1.75 medium cut, whose half (0.875) cannot be written at 2 dp and is written 0.88 — in 31 filled files at 20 and 18 at 16, none at 24. At 16 the C7 grid change made it writable exactly and nobody went back: `plus-circle-filled` at 16 still uses 7.13 and 8.88 where 7.125 and 8.875 are legal. docs/09:39 called it harmless in pixels | `plus-circle-filled` `x-circle-filled` and the 1.75 cuts | 31 files at 20 · 18 at 16 | 31 + 18 drawings | systemic | docs/audit/enforcement-gap.md:360 · docs/audit/stale-statements.md:330 | — (18 files fixable at 16 with no rule change) |
| R-F7-05 | (2) | C7's row says "16 centrelines sit on x.375 / x.625" without the midline exception docs/01:174-178 states. Measured: 76.0% of straight length does; 11.0% is the midline | `plus` `minus` and every symmetric mark | none (a wording gap) | none (a wording gap) | one-off | docs/audit/findings-grid.md:373 | — (one sentence in C7) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F7-15 | (3) | The ledger's second reading of R-F7-02: a vertex derived from a tangent or an intersection has no rule at all — docs/01 §3 has two exceptions and neither is it. The order matters: write the third exception before narrowing the hatch, because 1,888 drawings sit behind the hatch — the same drawings as R-F7-02, so this row is not ranked again | every tangent- or intersection-derived vertex | up to 1,888 drawings (a ceiling: any off-grid straight coordinate; the residue after a tangent exception is [needs measuring]) | see R-F7-02 (one finding, two kinds) | systemic | docs/audit/exceptions-ledger.md:170-178 · docs/audit/exceptions-ledger.md:702 · docs/audit/severity-proposal.md:117 | R-1 · sev §4.4 row 4 |
| R-F7-06 | (3) | A `plus` or `minus` at 16 is two pale pixels, not one hard one: darkest pixel 0.625 against 0.99 for an `x` beside it. 11.0% of all straight outline length at 16 — 143 runs in 124 drawings — sits on the canvas midline (10.6% at 24, 11.4% at 20), all of it soft, and the docs already rule it ("for a mark, symmetry beats crispness"). The filled twin is perfectly crisp. Recommendation: leave it | `plus` `minus` and their sizes, `chart-bar`, `menu-3` | 124 drawings | 124 drawings | systemic | docs/audit/findings-grid.md:359 · docs/audit/findings-grid.md:23 | — (do not reopen) |
| R-F7-07 | (3) | Filled 2.0 lines land on half-numbers in 19 line-heavy concepts at 16 (18 at 20), the worst possible landing (50% · 100% · 50%) where a whole-number centreline would be perfect: 13.5% of the filled line-heavy length at 16 (14.5% at 20). docs/08:409 records Fluent's rule (2.0 → whole numbers) as an item to inherit; C17 held the 1.5-era centrelines. The largest *avoidable* crispness cost found, and the fix is a position, not a weight | `menu` `menu-2` `menu-arrow-left/right` `list-bullet` `list-bullet-2` `text-2` `filter-2` `sort-3` `sort-ascending/descending` `sliders-2/4` `grid-4` `refresh-2` `rotate-ccw-5/7/8/10` | 19 concepts at 16 · 18 at 20 | [needs measuring] | systemic | docs/audit/findings-grid.md:365 · docs/audit/findings-grid.md:258 | — (card 1.8; the rule register) |
| R-F7-08 | (3) | 9.2% of straight outline length at 16 is soft and *not* on the midline (703 units): x.125 / x.875 placements 4.7 points in 51 concepts, other whole numbers 2.3 in 16, x.25 / x.75 1.6 in 16, 0.6 off the grid in 9. Lint passes all of it (the eighth grid); no rule asks for x.375 / x.625 in the interior | the concepts of §3.3 | 51 · 16 · 16 · 9 concepts by placement (overlapping) | [needs measuring] | systemic | docs/audit/findings-grid.md:363 · docs/audit/findings-grid.md:221-226 | — (a placement question when each is next touched) |
| R-F7-09 | (3) | A third of the outlines (173 of 485) are outside the landing score — every chevron, check and arrowhead. The probe shows them dark (darkest pixel 0.81–0.99) but stair-stepped | chevrons, checks, arrowheads, triangles | 173 outlines at 16 | 173 drawings | systemic | docs/audit/findings-grid.md:371 · docs/audit/findings-grid.md:19 | — (the wall, beside the hard containers) |
| R-F7-10 | (3) | The 0.70–0.75 band is not all forced: `plus`, `plus-small`, `plus-large`, `minus`, `minus-small`, `minus-large`, `chart-bar`, `menu-3` all score exactly 0.750 and `plug-3` 0.704. Only the `plus` and `minus` families sit wholly on the midline; `chart-bar` (outer bars at 4 and 12), `menu-3` (5 and 11) and the `sort` family are symmetric *pairs* that could sit crisp at 5.375 and 10.625. For `menu` this was a recorded decision (C17) whose crispness cost was not measured then | `chart-bar` `menu-3` the `sort` family `plug-3` | 9 drawings | 9 drawings | one-off ×4 | docs/audit/findings-grid.md:361 · docs/audit/findings-grid.md:21-22 | — (decide per family) |
| R-F7-11 | (3) | Six non-mark outlines have an outer edge on a half pixel at 16 — decided shapes (odd dimensions kept centred, pointed tips). The only question is whether any reads soft at the silhouette | `keyboard-2` `map-pin` `map-pin-2` `sort-3` `volume-low` `volume-off` | `keyboard-2` · `map-pin` · `map-pin-2` · `sort-3` · `volume-low` · `volume-off` | [needs measuring] | one-off ×6 | docs/audit/findings-grid.md:375 | — (eye) |
| R-F7-12 | (3) | On a 2× screen the 16 can never be crisp and the 24 and 20 mostly can: 100% of the 16's straight length scores exactly 0.500, while 79.5% (24) and 74.2% (20) is perfect. C7's accepted cost, now with a size | every outline at 16 | [needs measuring] | every drawing (outlines at 16) | systemic | docs/audit/findings-grid.md:369 · docs/audit/findings-grid.md:25 | — (accepted) |
| R-F7-13 | (3) | By a solid pixel the 16 is narrowly the softest master — 20.2% of straight length with no fully inked pixel against 15.6% (24) and 16.9% (20); mean darkest pixel 0.936 against 0.961 and 0.958 — but the gap between masters is smaller than the gap inside the 16. Not a case for changing the stroke. (The landing score itself cannot rank 24 or 20: it reads exactly 0.500 on every straight run at stroke 1.5 — see R-X-49) | every master | [needs measuring] | every drawing (every master) | systemic | docs/audit/findings-grid.md:367 · docs/audit/findings-grid.md:24 | — |
| R-F7-14 | (3) | ⇄ The declared shifts and the grid: card 1.11 finds 12 · 12 · 13 of 90 declared files per master with all ink-box edges on the grid — the chevrons' boxes are off-grid by construction; card 1.13 counts the values: 39 of 45 shifts at 16 off the eighth grid, 78 of 90 at 24 and 20 off the quarter grid. Should the 16 shifts be rounded the way C18 rounded `info-3`'s 16 shift — to the quarter grid, for that icon alone? | the 45 `optical:` concepts | 12 · 12 · 13 of 90 files on grid (card 1.11) ⇄ 39 of 45 · 78 of 90 values off grid (card 1.13) | 270 drawings (every file with a declared shift) | systemic | docs/audit/findings-optical.md:704 · docs/audit/exceptions-ledger.md:333-385 | — (the optical sheet at real 16) |

---

## F8 — Air that reads even

The gap floor re-derived (card 1.7), its exceptions (card 1.13) and the references that bear on it.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F8-01 | (1) | ⇄ The `sort-alpha-*` A's crossbar stops 0.495 / 0.575 / 0.337 short of the diagonals and the inks overlap by 1.04 / 0.96 / 0.93, so §6's overlap reading fires on all six concepts at every master (18 readings), and every one of the 36 `sort-alpha` files warns; the shortfall is whatever the grid gave (it scales with the canvas, not the stroke) and renders identically to an exact junction (maxDelta 0.000). Their filled cuts bottom at 0.845 at 16 and read 0.70–0.99 — the worst-reading breaches in the set. No `gap:` note, no C-row; `plans/sort-family.md` calls them "expected". With `sort-numeric-*` the family carries 60 of the set's 62 warned drawings and arrived through `approve` unchecked. Warning lines: the ledger counts 74 at the pin (72 on the sort family, 2 on `trash`); cards 1.15, 3.5 and 1.16 say "12 of the 72 warning lines in the set" — consistent if their 72 means the sort family alone | `sort-alpha-*` ×6 (and `sort-numeric-*` ×6) | 60 drawings (card 1.13); 18 overlap readings (card 1.7) | 60 drawings | one-off | docs/audit/findings-air.md:805-812 · docs/audit/exceptions-ledger.md:543-546 · docs/audit/exceptions-ledger.md:709 · docs/audit/exceptions-ledger.md:753 · docs/audit/enforcement-gap.md:167-216 | R-7 · sev §4.4 row 5 · angles §7a-5 |
| R-F8-02 | (1) | `glyph: numeral` is missing on the six `sort-numeric-*` concepts: the draft declared it, the approval dropped it, and C19's numeral carve-out (written for `list-ordered`) was never applied to the six numeral icons that need it. Injected in memory, 12 of the warning lines clear (the 24 filled-numeric lines stay, because §5f's area kinds do not read the note). A straight fix, not a ruling | `sort-numeric-*` ×6 | 36 files | 36 drawings | one-off | docs/audit/exceptions-ledger.md:712 · docs/audit/exceptions-ledger.md:523 · docs/audit/severity-proposal.md:165-178 · docs/audit/stale-statements.md:345-386 | sev §6b · sev §7-4b |
| R-F8-03 | (1) | Concepts that hold an enclosed counter under 1.5 in the filled drawing, undeclared and unwarned: `watch` 0.384 at 20 and 0.834 at 16, `watch-2` 1.188, `language` 0.852–0.986, `megaphone-2` 1.188 / 1.375, `save` 1.313 / 1.375, `bold` 1.438, the six `sort-alpha-*` 0.527–0.797. Card 1.8 says "nine concepts" and names more (its own table lists twelve). `facingGap` cannot read a wedge counter by design, so C23's measure is nobody's job | `watch` `watch-2` `language` `megaphone-2` `save` `bold` and the six `sort-alpha-*` | nine concepts (card 1.8's count; its table names more) | [needs measuring] | systemic | docs/audit/findings-filled.md:626 · docs/audit/findings-filled.md:311 | sev §4.3 row 1 (a measure for the wedge counter) |
| R-F8-04 | (1) | `sort` at 16 declares `gap: 1` against a measured 1.38, where the skill says "round it down to what the drawing really holds" (SKILL.md:86). Why lint lets it stand is R-F8-29 | `sort` at 16 | 1 file | 1 drawing | one-off | docs/audit/exceptions-ledger.md:734 · docs/audit/enforcement-gap.md:345 · docs/audit/severity-proposal.md:149 | R-5 |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F8-05 | (2) | **The gap rule is missing its alignment clause.** 1.5 of air holds a clear pixel at 5 of 8 pixel phases. Measured on the set, axial spans at the floor deliver a clear pixel 84.0% / 82.2% / 51.1% of the time at 24 / 20 / 16; across all spans at the floor 67.9% / 65.1% / 41.5%. The number is right — the grid-legal minimum for a 45° channel, 1.414 — the rule is half-written. 941 of 2,910 drawings carry a reading within 0.01 of the floor | every drawing with air at the floor | 498 · 524 · 484 spans at the floor | 941 drawings | systemic | docs/audit/findings-air.md:731 · docs/audit/findings-air.md:237-243 · docs/audit/findings-air.md:372-374 | — (the ladder sheet; card 1.7's eye table) |
| R-F8-06 | (2) | C7 and section 6 pull against each other and nobody recorded the trade: a 1.25 stroke cannot put both edges on a whole pixel; C7 chose the outer one, which puts the air's wall a quarter off. At 16 the commonest air phase is 0.25 (26.9%) — the one phase at which 1.5 cannot hold a pixel | every 16 drawing | 1,066 axial air spans at 16 | every drawing (at 16, by construction) | systemic | docs/audit/findings-air.md:735 · docs/audit/findings-air.md:175 · docs/audit/findings-air.md:202 | — |
| R-F8-07 | (2) | F1's derivation does not support it. The floor is stated four times and derived once: docs/03:34-37's reason (it makes the weight axis free) is dead with the axis; docs/01:325-347 cites zero drawings; docs/08's only measurement — "a 0.88 gap reads as clear as 1.5" — is itself refuted (1.08 is clear, 0.88 is not; the plan's corrections table), and the scan behind "leave it" was 92 approved icons — 19% of the current set — never re-run. Today the floor binds 6 concepts with a `gap:` note down to 0.375, 12 `sort-*` concepts with 60 warnings, and `trash`'s two | the whole set | 2,910 drawings governed | every drawing (the floor governs all) | systemic | docs/audit/rule-register.md:294-327 · docs/audit/stale-statements.md:116-125 · docs/audit/enforcement-gap.md:363 · plans/set-and-rules-audit.md "A 0.88 gap reads as clear as 1.5" | sev §4.3 row 1 · Nucleo T3 (card 1.7's derivation; Maruti's ruling) |
| R-F8-08 | (2) | `tools/masters.mjs:60-64`'s stated rationale is false: "the floor is what survives a 16px render" — 1.5 fails at three of eight phases, including the set's most common one at 16 | — | none (a code comment) | none (a code comment) | one-off | docs/audit/findings-air.md:742 | — |
| R-F8-09 | (2) | `GLYPH_GAP`'s own comment states the correct general rule — "one whole unit, which is one pixel at every master's own size, the smallest gap that still holds a clear pixel row" — scoped to 96 files as an exception | the 16 glyph concepts | 96 files | 96 drawings | systemic | docs/audit/findings-air.md:739 · docs/audit/findings-air.md:453 | — |
| R-F8-10 | (2) | docs/08 §3.4 ("a 0.88 gap reads as clear as 1.5") is still cited and still wrong: a 0.88 band has 0 of 8 clear phases, a 1.5 band 5 of 8. Wave 0 refuted it; C19 in doc 07 is honest ("passed on phase"); §3.4 is not | — | none (a doc section) | none (a doc section) | one-off | docs/audit/findings-air.md:744 · plans/set-and-rules-audit.md "A 0.88 gap reads as clear as 1.5" | — (card 1.16) |
| R-F8-11 | (2) | The 1.5-for-white rule is not a rasterisation finding: knockouts, bands and parallel runs give byte-identical pixel tables. C18 / C22 / C23 rest on the eye, which is legitimate, but they read as if measured | every filled cut | about 61 icons cut 1.5 at 16 | [needs measuring] | systemic | docs/audit/findings-air.md:748 · docs/audit/findings-air.md:455 · docs/audit/findings-air.md:96 | Fluent T2 (the pairing sheet: a cut at 1.25 and 1.5 beside a drawn line) |
| R-F8-12 | (2) | ⇄ The effective gap floor is 1.485, not 1.5: the tools round to 2 dp and lint tests `< floor − 0.01`, so 1.486 passes as 1.49. Card 1.7: 48 readings in 45 drawings and 34 concepts inside that undeclared 0.015 tolerance. Card 1.13: 44 readings / 43 files / 32 concepts counting every check lint runs (the review's own script read 21 readings / 17 files from §5f alone — the same population counted at a different point in lint's order) | `users` at 24 (1.49) and the 1.49 band | 45 drawings (card 1.7) ⇄ 43 files (card 1.13) | 45 drawings (card 1.7) ⇄ 43 drawings (card 1.13) | systemic | docs/audit/findings-air.md:763 · docs/audit/exceptions-ledger.md:710 · docs/audit/exceptions-ledger.md:752 | R-9 |
| R-F8-13 | (2) | `gap: N` is one number for two gaps: `volume-off-filled`'s note (0.7 · 0.75 · 0.375) covers a 0.39 bar-stub junction and, by accident, a 1.25 channel; doc 07 records only the channel. 10 files carry a `gap:` note; 8 agreed, 2 unverified. The pixels' reading of the junction is R-F8-30 | `volume-off-filled` ×3 `sort` ×2 `attachment-4-filled` ×2 `alert-triangle-2/-4` at 16 `database-2-filled` | 10 files | 10 drawings | systemic | docs/audit/exceptions-ledger.md:711 · docs/audit/exceptions-ledger.md:762 | R-5 |
| R-F8-14 | (2) | ⇄ `volume-off`'s 1.25 channel at 16: C22's dated note says it is "noted in its file (C28)"; card 1.13 and card 1.9 both find it declared nowhere — the file's `gap:` note (0.7 · 0.75 · 0.375) covers the bar-stub junction, which is under 1.5 at all three masters, while the channel is under 1.5 at 16 only; C28 states no such exception. `plans/facing-gap.md` is the primary record of Maruti's 2026-09-28 ruling | `volume-off-filled` at 16 | 1 file | 1 drawing | one-off | docs/audit/findings-grammar.md:683 · docs/audit/exceptions-ledger.md:762 · docs/audit/exceptions-ledger.md:439 · plans/set-and-rules-audit.md "`volume-off`'s 1.25 channel" | R-5 |
| R-F8-15 | (2) | The `gap:` lists are short: CLAUDE.md:285 names `attachment-4-filled` at 24 and 20 and docs/07:79 adds the two `alert-triangle`s at 16; the set carries 10 files on 6 concepts — `sort` and `sort-filled` at 16 (1), `database-2-filled` at 24 (1.48), `volume-off-filled` at 0.7 · 0.75 · 0.375 — and the lowest is a quarter of the floor | the 6 `gap:` concepts | 10 files | none (two document lists) | one-off | docs/audit/stale-statements.md:146-147 · docs/audit/rule-register.md:266 | — (list all ten, or point at a census) |
| R-F8-16 | (2) | ⇄ `trash`'s two warnings at 20 and 16 (edge gaps 0.99 and 0.75 between the tab legs): C22 and docs/09:31 call them a known lint false positive — a covered junction read as air — and card 1.7 calls them genuine near-misses. Two documents, opposite readings of the same two lines; the fix docs/09 owed to lint is two weeks old and both could be declared as `gap:` today | `trash` at 20 and 16 | 2 files | 2 drawings | one-off | docs/audit/exceptions-ledger.md:754 · docs/audit/enforcement-gap.md:361 · docs/audit/stale-statements.md:323 · plans/set-and-rules-audit.md "`trash`'s two warnings" | — (wave 5 decides) |
| R-F8-17 | (2) | docs/01 §6 says "when a detail cannot fit at a 2-unit gap, remove the detail", three lines under a rule that says 1.5; flagged on 2026-09-18 and still unactioned | — | none (a doc line) | none (a doc line) | one-off | docs/audit/stale-statements.md:64-72 | — (a straight edit) |
| R-F8-18 | (2) | `docs/08:114`'s "Nucleo 0.82" does not reproduce: Nucleo's dot-to-stem air is 1.5 px (Core 24), 2.0 (Core 32), 1.17 (UI 18), 0.75 (UI 12), 2.0 (Sharp 24) — 0.82 only in Pixel. One of the cross-checks behind C19's 1-unit glyph floor, which survives (the pros' band is 0.5–1.0 stroke, ours 0.7–0.8). [needs checking] | the C19 glyphs | none (a reference figure) | none (a reference figure) | one-off | docs/audit/references-nucleo.md:451-457 | — |
| R-F8-19 | (2) | ⇄ `docs/08:113`'s Fluent separation "1px (1 at 12–32, 1.5 at 48)" is a band low above 24 and runs two quantities together. Card 2.1 from the Figma file: separation 1.00 · 0.95 · 1.00 · 1.00 · 1.50 · 1.50 · 2.46 and punched-line width 1.00 · 1.00 · 1.00 · 1.50 · 1.50 · 2.00 · 2.50 at 12 … 48 — one stroke at every size. The field report restated the stale sentence on the repo's authority | — | none (a reference figure) | none (a reference figure) | one-off | docs/audit/references-fluent.md:389 · docs/audit/stale-statements.md:43-52 · docs/audit/references-field.md:419 | — (card 1.7 takes the measured rows) |
| R-F8-20 | (2) | The plan's worked example (Fluent separation 0.67 of its stroke, ours 1.2 — "close to twice as generous") inherits the stroke slip. Measured at 16: Fluent Regular 0.95 of a 1.00 line (0.95×), ours 1.50 on 1.25 (1.20×) — 1.26× as generous relative to our own line, 1.5× in absolute units. The suspicion survives at about 60% of the size the plan assumed | — | none (a plan paragraph) | none (a plan paragraph) | one-off | docs/audit/references-fluent.md:398-409 · docs/audit/references-field.md:416 | — |
| R-F8-21 | (2) | Four holes in lint, found by porting it: a NaN from a zero-length arc defeats both of section 5's tests silently (`paintbrush-4` at 24 and 20; the same degenerate arc is in 7 paths including `chart-pie-3-filled` at all three masters); 21 `facing:self` readings are judged by nothing; §5c never runs on the 414 shape-filled drawings that also carry strokes; the `read5b` double-warning skip has never fired. Nothing wrong today | `paintbrush-4` `chart-pie-3-filled` | 414 drawings (the §5c hole) | 414 drawings | systemic | docs/audit/findings-air.md:758 · docs/audit/findings-air.md:384 · docs/audit/findings-air.md:399 | R-9 |
| R-F8-29 | (2) | A `gap:` note is not held to the drawing the way `box:` and `grows:` are: lint checks only that *something* in the file is under 1.5, so a probe with `gap: 0.5` over a measured 1.0 passes, and `sort` at 16 ships `gap: 1` over 1.38 (R-F8-04). The skill states the rule; nothing checks it | every file with a `gap:` note | 10 files | 10 drawings | systemic | docs/audit/enforcement-gap.md:345 · docs/audit/severity-proposal.md:149 · docs/audit/exceptions-ledger.md:711 | R-5 · sev §5 row 7 |
| R-F8-31 | (2) | No rule covers the material between two *different* holes in one filled drawing, and `materialGap` reads only holes and islands inside a hole: it excludes the outermost shape, two different holes, boundary neighbours under 0.5 apart and tapers sharper than 20°. Measured, 0.92 in `help-4-filled` at 16, named as uncovered at docs/08:340-341 | `help-4-filled` at 16 | `help-4-filled` | [needs measuring] | systemic | docs/audit/enforcement-gap.md:347 · docs/audit/enforcement-gap.md:286 · docs/audit/rule-register.md:291-292 | — |
| R-F8-32 | (2) | Lint's gap warning prints a centreline distance as what §6 needs — "paths 1/2 are 0.46 apart — §6 needs 3 (edge gap −1.04 < 1.5)". §6 needs 1.5 of *edge* gap; the parenthesis says it, the headline does not | every gap warning | none (a message) | none (a message) | one-off | docs/audit/enforcement-gap.md:348 · docs/audit/findings-air.md:414-416 | — |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F8-22 | (3) | The floor overcharges the axial case by half a unit: 57.2% of the set's air channels are axial, where an aligned 1.0 renders *better* than an unaligned 1.5 — a clear row against a 25% grey seam — and returns 0.5 units of drawing space | every axial channel | 1,455 axial spans under 2.0 | [needs measuring] | systemic | docs/audit/findings-air.md:780 · docs/audit/findings-air.md:150 · docs/audit/findings-air.md:267 | — (eye: the three constructions of §3c, then `menu`, `file-text`, `calendar` both ways) |
| R-F8-23 | (3) | We hold the air at ×1.00–1.02 between masters (1.5 px at all three) where the team that draws several grids lets it follow the grid (×1.25–1.50 for the same step); the floor is 6.2% of the 24 canvas and 9.4% of the 16. Nothing says what the air *should* do between masters | every drawing | 297 · 296 · 296 same-concept pairs (card 2.3) | [needs measuring] | systemic | docs/audit/references-nucleo.md:469-475 · docs/audit/references-nucleo.md:32-36 · docs/audit/references-nucleo.md:250-252 | Nucleo T1 · Nucleo T3 (eye: one concept at three versions at real 16) |
| R-F8-24 | (3) | 53.7% of the set's air is in a diagonal channel, where "a clear pixel row" cannot apply; no rule has ever said what governs diagonal air. The derivation gives 1.414 at 45°, and 1.5 happens to clear it | every diagonal channel | 3,909 diagonal spans of 7,284 | [needs measuring] | systemic | docs/audit/findings-air.md:785 · docs/audit/findings-air.md:124 · docs/audit/findings-air.md:201-203 | — |
| R-F8-25 | (3) | Curvature is unpriced: a cap-to-cap or glyph-mouth gap reads 0.45× as dark as a straight run of the same width, on synthetic probes; the floor charges them the same | every glyph mouth and cap-to-cap gap | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-air.md:783 · docs/audit/findings-air.md:96 | — (eye: a cap-to-cap sweep beside a parallel-run sweep) |
| R-F8-26 | (3) | 42 air spans leave no pixel lighter than solid ink and 35 of them pass lint — a pixel is 1 × 1 and the rule measures one dimension. 8 concepts, plus 83 near-welds at 0.70–0.995 | `book-2` `bug` `bug-2` `desktop-6` `gear-3` `key-4` `trash` `watch-2` | 42 spans in 8 concepts | [needs measuring] | systemic | docs/audit/findings-air.md:772 · docs/audit/findings-air.md:278 | — (the wall, 1× and 2×) |
| R-F8-27 | (3) | `book-2`'s file says the ribbon holds "1.5 clear inside"; at every master that 1.5 falls across two partly-inked pixel columns and leaves no white pixel at all. `desktop-6`'s file says "1.5 · 1.5 · 1.5 of air" between the stand legs; the channel reads under 30% grey and contains no background pixel. Both lint clean | `book-2` `desktop-6` | `book-2` · `desktop-6` | [needs measuring] | one-off ×2 | docs/audit/findings-air.md:775 | — (eye) |
| R-F8-28 | (3) | The ledger's second reading of R-F8-01: is the A's crossbar meant to touch its legs or to stop short, the way a letterform would? It is a letterform decision with no rule and no note kind for an overlap; 18 live warnings hang on it, and today's numbers are grid residue rather than a chosen value | `sort-alpha-*` | 18 warnings | see R-F8-01 (one finding, two kinds) | one-off | docs/audit/exceptions-ledger.md:567-568 · docs/audit/findings-air.md:834 | R-7 (eye: Library At 16 beside `bold`, `italic`, `sort-numeric-*`) |
| R-F8-30 | (3) | The ledger's second reading of R-F8-13: `volume-off-filled`'s bar-stub junction at 16, declared 0.375, reads 0.637 on the pixels — "a genuine near-weld, and the only note in the set covering something the pixels confirm is bad". Whether the bar reads as broken there is the eye's | `volume-off-filled` at 16 | 1 file | 1 drawing | one-off | docs/audit/exceptions-ledger.md:476-480 · docs/audit/findings-air.md:454 | — (eye) |
| R-F8-33 | (3) | What lightness counts as "reads as background"? The ladder is measured — 1.0 → 0.5 grey, 1.25 → 0.375, 1.5 → 0.25, 1.75 → 0.125, 1.875 → clear — and a number has to be picked on it before any floor can be derived | every gap | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-air.md:829 | — (the ladder drawn out at real 16, greys labelled) |

---

## F9 — Contact grammar

Where ink touches ink. No rule exists at all; lint's coverage of the territory is 1.2%
(`docs/audit/findings-air.md:548`). Card 1.7 lists `plug-6` and `clipboard-2` under its kind (1); with
no junction rule to break, they sit here as kind (3) (§0).

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F9-03 | (2) | ⇄ `lint.mjs:394` and `:401` between them exempt 98.8% of the set's junctions — crossing paths are exempt entirely, paths within 0.1 are read as joined — and no rule anywhere states a junction convention. The rule that exists fires where it should not, and the rule the set follows does not exist. Card 1.13: 985 files have a pair lint reads as joined, 128 a crossing pair. Card 1.7's own port: 1,743 of 7,554 stroked-path pairs dropped, across 1,084 drawings. The ledger files this kind (3); card 1.7 kind (2) — both rows are here (R-F9-10) | every join in the set | 985 files (card 1.13) ⇄ 1,084 drawings (card 1.7) | 985 drawings (card 1.13) ⇄ 1,084 drawings (card 1.7) | systemic | docs/audit/findings-air.md:755 · docs/audit/findings-air.md:563-565 · docs/audit/exceptions-ledger.md:703 · docs/audit/enforcement-gap.md:335-336 · docs/audit/rule-register.md:287 | — (card 1.7's contact census is the sheet) |
| R-F9-04 | (2) | Section 6's floor is written for air and lint applies it to ink: on 18 path pairs lint computes a *negative* edge gap (−1.04 / −0.96 / −0.93 on the six `sort-alpha-*`) and prints "§6 needs 3 (edge gap −1.04 < 1.5)" — a quantity with no meaning once the inks overlap. `parseGapNote` takes only a positive number below 1.5, so the deviation cannot be declared | `sort-alpha-*` ×6 | 18 path pairs | [needs measuring] | systemic | docs/audit/findings-air.md:751 · docs/audit/findings-air.md:408-416 · docs/audit/enforcement-gap.md:202-205 | R-7 · sev §4.4 row 5 |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F9-01 | (3) | `plug-6`'s prongs overshoot the body outline by 0.195 / 0.119 / 0.023–0.028 — the only non-tangential junction in the set putting measurable ink *outside* another path: 0.125 of a pixel at 24. No rule forbids it and nothing measures it | `plug-6` | 3 prongs × 3 masters | [needs measuring] | one-off | docs/audit/findings-air.md:813 | — (eye: character or defect?) |
| R-F9-02 | (3) | `clipboard-2` stops 0.011 short at 24 and runs 0.121 / 0.033 past at 20 / 16 — invisible, but its junction *kind* is not the same across its three masters | `clipboard-2` | `clipboard-2` | [needs measuring] | one-off | docs/audit/findings-air.md:816 | — |
| R-F9-05 | (3) | The implicit rule — a junction lands on the other stroke's centreline — is followed 95.0% of the time at every master (1,847 of 1,944 junctions); only the eye can say whether the 63 structural exceptions are character or drift | the 63 exceptions of card 1.7 §8 | 1,944 junctions | [needs measuring] | systemic | docs/audit/findings-air.md:833 · docs/audit/findings-air.md:609 | — (ratify practice, or not) |
| R-F9-06 | (3) | `plug-3`'s four abutments sit at exactly edge gap 0.000, and the 108 grazes generally: two ink edges 0 apart are a hard warning when the paths are far enough apart to be measured and invisible when they are not. The threshold is `0.1` in `lint.mjs:401`, with no recorded reason | `plug-3` and the 108 grazes | 108 grazes | [needs measuring] | systemic | docs/audit/findings-air.md:798 · docs/audit/findings-air.md:674 | — |
| R-F9-07 | (3) | 35 of 970 concept × style groups change their contact grammar across masters: `clipboard-2` butts at 24 and overshoots at 16; `compass` has two junctions at 24 and 20 and none at 16; `sliders-2` has none at 24 and 20 and three crossings at 16 | `clipboard-2` `compass` `sliders-2` and the rest of the 35 | 35 groups | [needs measuring] | systemic | docs/audit/findings-air.md:792 · docs/audit/findings-air.md:700 | — |
| R-F9-08 | (3) | Three masters of one icon disagree about the same junction: `lock-5` overshoots by 0.75 · 0.5 · 0.375 (0.50 · 0.33 · 0.30 of its own stroke), `gauge` by 0.75 · 0.5 · 0.625; of the 17 concepts in bands 3 and 4, 6 scale with the canvas, 2 with the stroke, 9 with neither, 0 are constant | `lock-5` `gauge` and the rest of the 10 band-4 families | 10 concept families in band 4; 17 concepts in bands 3–4 | [needs measuring] | systemic | docs/audit/findings-air.md:788 · docs/audit/findings-air.md:630 · docs/audit/findings-air.md:663-666 | — |
| R-F9-09 | (3) | The filled style manufactures contacts the outline does not have: `reach` grows with `FILLED_WEIGHT`, so 19 junctions exist only in the filled file and 0 only in the outline | 6 concepts of card 1.7 §12 | 6 concepts | [needs measuring] | systemic | docs/audit/findings-air.md:795 | — (card 1.8) |
| R-F9-10 | (3) | The ledger's reading of R-F9-03: every join in the set is unjudged — no rule says where ink may touch ink, and axis F9 is where to decide what a join is | every join in the set | 985 files (card 1.13) | see R-F9-03 (one finding, two kinds) | systemic | docs/audit/exceptions-ledger.md:703 | — (card 1.7's contact census) |

---

## F10 — Silhouette legibility

Eye-only. No instrument produced a verdict; these rows exist so the agenda carries the question.

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F10-01 | (3) | The circle-with-a-mark families are where the risk sits: pairs that mean opposite things differ only by the glyph inside a ring that is identical at 16. Blurred at 1.0 px and ranked by cosine similarity (1.0 = the same picture): `info` / `alert-circle` 0.9970, `x-circle-small` / `plus-circle-small` 0.9940, `help-3` / `alert-circle-2` 0.9916; filled, `plus-circle-small` / `x-circle-small` 0.9982. A shortlist to look at, not evidence | `info` `alert-circle` `x-circle-small` `plus-circle-small` `help-3` `alert-circle-2` `minus-circle` `check-circle-small` | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-mass.md:488-503 | — (the wall, "Twenty at 16") |
| R-F10-02 | (3) | ⇄ Pairs of different names drawn identically at 16 — 22 outline pairs and 7 filled (card 1.5) — so the eye is asked to tell apart things that are not different. Card 1.5 counts 14 sets of names sharing byte-identical path data at one or more masters (43 master × style groups, 98 files); card 1.14 counts 9 groups / 22 concepts identical at all three masters and 5 pairs at 16 only; card 1.10 counts 2 whole-icon pairs at 3 masters, 5 at 16 only, 15 outline-only pairs and 9 Library twin groups of 22 names — sets, pairs and groups are different counts of one fact | `globe`/`language-2` `camera`/`camera-5` `help`/`help-2` `text`/`text-4` and the rest of card 1.5 §7 | 98 files (card 1.5) ⇄ 22 concepts (card 1.14) | 98 drawings | systemic | docs/audit/findings-mass.md:501 · docs/audit/findings-mass.md:517 · docs/audit/rule-register.md:343 · docs/audit/rule-register.md:358 · docs/audit/findings-families.md:663 | — (see R-X-13) |
| R-F10-03 | (3) | *Generic* and *sameness at a glance* are the field's first and eighth failure modes — generic, overused, dated (12 of 53 statements), blurry (11), inconsistent (10) — and no rule of ours can see either. Booked eye-only; card 2.6 measured no drawing | the whole set | [needs measuring] | [needs measuring] | systemic | docs/audit/references-field.md:421 · docs/audit/references-field.md:21-25 · docs/audit/references-field.md:407 | FD-1 (the wall; the drift half) |

---

## F11 — Restraint

The detail budget per master, and which detail dies first.

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F11-01 | (2) | "No more than 3 parallel strokes in one run" (docs/01:351) has never been in code and was measured for the first time this audit: 43 concepts hold a stack of 4 or more at 24 (40 at four; `chart-bar-5`, `file-text-2`, `files-5` at five), 39 at 20, 32 at 16. In 34 of the 43 two of the stack are opposite walls, so nothing exceeds docs/09's reword ("at most 3 interior marks between walls") — but nine stacks are neither walls-plus-marks and the reword does not classify them: four open strokes in `attachment-2`, `attachment-4`, `chart-bar-3`, `plug-3`, `store`, `store-2`; four closed edges in `grid`, `grid-5`, `grid-7` | `chart-bar-5` `file-text-2` `files-5` `attachment-2` `attachment-4` `chart-bar-3` `plug-3` `store` `store-2` `grid` `grid-5` `grid-7` | 43 concepts at 24 · 39 at 20 · 32 at 16 | [needs measuring] | systemic | docs/audit/rule-register.md:268 · docs/audit/stale-statements.md:320 · docs/audit/enforcement-gap.md:268 | — (the reword is still owed) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F11-02 | (3) | ⇄ The detail budget differs by master far less than the references': 453 of 485 outline concepts keep the same subpath count from 24 to 16, 30 shed and 2 gain (card 1.4); 3–6% of concepts differ against Nucleo's 21–45% between adjacent grids (card 2.3). Whether the 20 and 16 are *too* faithful to the 24 is not decidable from counts | `gear-3` `building` `sliders-2` `trash` | 30 concepts shed (card 1.4) ⇄ 3–6% of concepts differ (card 2.3) | [needs measuring] | systemic | docs/audit/findings-scaling.md:22 · docs/audit/references-nucleo.md:482 | FD-3 · Nucleo T6 (the wall) |
| R-F11-03 | (3) | Our own detail-death rule is undeclared: when a run of repeated parts can no longer hold its spacing we drop a member rather than compress the run, and the member dropped is one stroke thick (1.50) at the master above — 69 parts across 970 steps, concentrated in `sliders-2`, `building`, `building-2`, `gear-3`, `trash`, `keyboard`, `images`, `chart-bar-3`, `microphone`, `book-4`, `database`, `watch`, `compass`. Consistent, deliberate-looking, stated nowhere | `sliders-2` `building` `building-2` `gear-3` `trash` `keyboard` `images` `chart-bar-3` `microphone` `book-4` `database` `watch` `compass` | 69 parts across 970 steps | [needs measuring] | systemic | docs/audit/references-fluent.md:432 · docs/audit/references-fluent.md:137 | FD-3 |
| R-F11-04 | (3) | Parts do not predict weight: rank correlation of ink with path count 0.34 (outline), −0.23 (filled); with line length 0.99 / 0.77; median ink is flat from 2 to 6 paths. If a detail-budget rule is drafted, measure it in line length or ink, not paths | the whole set | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-mass.md:470 · docs/audit/findings-mass.md:23 | FD-3 (the measure) |
| R-F11-05 | (3) | Concepts gain radii at 16 that 24 does not have — `camera-3`, `camera-4`, `clipboard-2`, and `cart` / `cart-3` / `cart-4` / `cart-5` (which gain at 20 too). Card 1.2 says "six concepts" and names seven. Detail appearing at the smallest master is the opposite of what F11 expects | `camera-3` `camera-4` `clipboard-2` `cart` `cart-3` `cart-4` `cart-5` | six concepts (card 1.2's count; it names seven) | [needs measuring] | systemic | docs/audit/findings-corners.md:747 | Nucleo T6 |

---

## F12 — Honest metrics

`dist/metrics.json` is the product's differentiator. The ink box and the geometric bearings are
true to 0.0101 (`docs/audit/findings-metrics.md:37-38`); the optical bearings are not. An **optical
bearing** is the margin we publish so an icon *looks* evenly spaced beside a label — the geometric
bearing pulled in where the ink is thin at the edge (a chevron's point, a circle's flank). **`alpha`**
(0.75, `tools/optical.mjs`) is how much of that thinness the build charges: 0 publishes the geometric
edge, 1 the whole recession. Every fix is proposed, not applied (metrics F1–F8).

Card 1.12 filed five of these rows as kind (1), by its own definition — "a published number disagrees
with the drawing" (`docs/audit/findings-metrics.md:123`). By the plan's definitions that is the build
disagreeing with its documented promise, a tool against its stated claim: kind (2), as card 1.15
files them. They sit in the kind (2) table and say so.

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F12-01 | (2) | ⇄ **Every shape-filled drawing publishes no optical correction**: 1,026 entries, 4,084 sides. Beside a label the filled `plus-circle` sits 0.71 px further away than the outline `plus-circle` at 24 px (1.42 px at 48), with the same silhouette; worst 1.02 units → 2.03 px at 48. Card 1.15 counts 1,028 entries with recession 0 on all sides; the two agree — 1,026 forced by `build.mjs:50` plus the two `paintbrush-4` entries whose empty profile also yields 0. (Card 1.12's kind (1)) | every shape-filled twin | 1,026 entries (card 1.12) ⇄ 1,028 entries (card 1.15) | 1,026 drawings | systemic | docs/audit/findings-metrics.md:571 · docs/audit/findings-metrics.md:42-46 · docs/audit/findings-metrics.md:259-262 · docs/audit/enforcement-gap.md:368 | metrics F1 |
| R-F12-02 | (2) | The build misreads stroke edges at sampling resolution and lands on the far side of a knife-edge: 108 entries, 152 sides (17 entries over 0.05), worst 0.55 units. (Card 1.12's kind (1)) | the 108 of card 1.12 §3.3 | 108 entries | 108 drawings | systemic | docs/audit/findings-metrics.md:576 | metrics F3 (conditional) |
| R-F12-03 | (2) | Double rounding: 49 symmetric drawings are published 0.01 asymmetric (71 entries, 92 fields), and each side's geometric bearing is published twice, 0.01 apart on 59 sides. (Card 1.12's kind (1)) | 49 symmetric drawings | 71 entries | 71 drawings | systemic | docs/audit/findings-metrics.md:580-581 | metrics F6 |
| R-F12-04 | (2) | `gap` readings are off by up to 0.13 on 5 entries — three names, `gauge`, `globe`, `language-2`. (Card 1.12's kind (1)) | `gauge` `globe` `language-2` | 5 entries | 5 drawings | systemic | docs/audit/findings-metrics.md:583 · docs/audit/findings-metrics.md:587-589 | metrics F8 |
| R-F12-05 | (2) | ⇄ `paintbrush-4` publishes `geometric: null, optical: null` at 24 and 20: `opticalBearings` returns null on a zero-length arc (`A7 7 0 0 1 3.75 19.5`, start = end). Card 1.12 counts 7 files whose arc has identical endpoints; cards 1.15 and 1.16 count 9 files, 2 concepts — the arc in `paintbrush-4` at 16 is 0.001 long. A customer who coerces null to 0 puts the icon 3.20–4.00 units further from its neighbour — 8.0 px at 48. (Card 1.12's kind (1)) | `paintbrush-4` (`paintbrush-4-filled`, `chart-pie-3-filled` carry the arc) | 2 entries | 2 drawings | one-off | docs/audit/findings-metrics.md:575 · docs/audit/findings-metrics.md:266-268 · docs/audit/findings-metrics.md:605-607 · docs/audit/stale-statements.md:164 · docs/audit/enforcement-gap.md:369 | metrics F2 |
| R-F12-06 | (2) | ⇄ `container` is false on 81 entries and missing on 348 (`ratio` follows): 429 entries (card 1.12); card 1.15 counts 375 filled entries publishing `container: null` where the twin publishes one, which card 1.12 records as an agreement. "A container that *is* the mark" — cards 1.15 and 1.16: 45 entries, 15 names, by ratio ≥ 0.99 on both axes; card 1.12: 81 entries, 27 names, by *the container path is not closed, or ink lies outside it*; they share 7 names (21 entries: the six `x` files and `volume-x-filled`) | `x` and its sizes and twins, `globe`, `globe-2`, `grid-2`, `table`, `table-2`, `target-2`, `volume-x-filled` | 429 entries (card 1.12); a container that is the mark: 81 entries (card 1.12) ⇄ 45 entries (cards 1.15, 1.16) | 429 drawings | systemic | docs/audit/findings-metrics.md:582 · docs/audit/findings-metrics.md:597-604 · docs/audit/findings-metrics.md:619-621 · docs/audit/enforcement-gap.md:368-370 · docs/audit/stale-statements.md:163 | metrics F7 |
| R-F12-07 | (2) | `gap` is published on 31 non-glyphs (the 6 false dots among them) and missing on 57 declared glyphs: 88 entries | the `glyph: dot` concepts | 88 entries | 88 drawings | systemic | docs/audit/findings-metrics.md:584 | metrics F8 |
| R-F12-08 | (2) | `shift` reads as moving the ink on 12 entries whose ink box is centred — `info-2`'s and `info-3`'s mark moved inside a fixed ring | `info-2` `info-3` | 12 entries | 12 drawings | one-off ×2 | docs/audit/findings-metrics.md:579 | metrics F5 |
| R-F12-09 | (2) | `optical.mjs:12-14` calls its edge "exact, not approximated"; 5.3% of scanline readings are off by more than 0.013 | — | none (a code claim) | none (a code claim) | one-off | docs/audit/findings-metrics.md:577 | metrics F3 |
| R-F12-10 | (2) | The docs promise optical bearings for every icon (CLAUDE.md:263-264, README.md:52-53) — 342 of 485 filled files per master publish `recession: 0` | — | none (a doc claim) | none (a doc claim) | one-off | docs/audit/findings-metrics.md:572 · docs/audit/stale-statements.md:189-192 | metrics F1 |
| R-F12-11 | (2) | The README's "13.7–16.2px of visual padding" was never measured; at the pin `padding: 12px` renders 14.00–24.05 px of visual padding at 24 px | — | none (a doc claim) | none (a doc claim) | one-off | docs/audit/findings-metrics.md:585 · docs/audit/findings-metrics.md:57-59 | — (card 1.16) |
| R-F12-16 | (2) | CLAUDE.md:265-266 says a consumer who subtracts the bearings makes "`padding` and `gap` become literally true"; README.md:56-57, "every spacing value in their product becomes literally true". True of the geometric bearing; not of an optical bearing that a hair's movement changes by a pixel (R-F12-13) | — | none (a doc claim) | none (a doc claim) | one-off | docs/audit/findings-metrics.md:384-386 | — |
| R-F12-17 | (2) | Nothing says what a `container` is when the filled silhouette splits into several shapes, or when the inner line has become a notch in the edge — the open half of metrics F7 | the split and notched filled drawings | 129 entries split · 9 notched, by the ring test (box 112, strict 147) | 129 + 9 drawings (the ring test) | systemic | docs/audit/findings-metrics.md:642-643 · docs/audit/findings-metrics.md:459-463 | metrics F7 |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F12-12 | (3) | **`alpha` 0.75 has never been set against the eye**, and it is not a corner of the set: a quarter step either way moves the published optical bearing of 1,385 of the 1,882 stroke drawings by more than a tenth of a unit (376 concepts; largest 0.55 units); an eighth step moves 976. The code says it "matches the corrections designers make by hand" | every stroke drawing | 1,882 drawings | 1,882 drawings | systemic | docs/audit/findings-optical.md:587 · docs/audit/findings-optical.md:80-84 · docs/audit/findings-metrics.md:626-646 | OC-5 |
| R-F12-13 | (3) | The optical number is a knife-edge on 635 entries (1,162 sides): move the drawing by two thousandths of a unit and it changes by more than 0.05, by up to 1.29 (1.27 at 24 → 2.55 px at 48); the exact mirror images `menu-arrow-left` and `menu-arrow-right` publish top bearings 0.31 apart | `menu-arrow-left` `menu-arrow-right` `hash-2` `italic-filled` `filter-2-filled` | 635 entries | 635 drawings | systemic | docs/audit/findings-metrics.md:573 · docs/audit/findings-metrics.md:42-50 | metrics F3 (conditional) |
| R-F12-14 | (3) | Line-heavy twins with one ink box read up to 1.63 units apart: toggling `italic` to `italic-filled` jumps the icon 1.62 px at 24 — 301 stable sides on 129 concept-masters | `italic` `rotate-ccw-7` `check` | 301 sides on 129 concept-masters | [needs measuring] | systemic | docs/audit/findings-metrics.md:574 · docs/audit/findings-metrics.md:52-53 | metrics F4 (conditional) |
| R-F12-15 | (3) | ⇄ `shift` cannot say where the off-centre drawings sit, C28 anchors included — 5.0 units → 10 px at 48 if a customer re-applies it. Card 1.12: 177 entries, on the solved box by distance; card 1.11: 166 = 12 + 154 on the build's 2 dp box by the larger axis. On the solved box the count is 177 either way; the box alone separates the two | the C28 members and the 154 of R-F2-09 | 177 entries (card 1.12) ⇄ 166 drawings (card 1.11) | 177 drawings (card 1.12) ⇄ 166 drawings (card 1.11) | systemic | docs/audit/findings-metrics.md:578 · docs/audit/findings-optical.md:698 | metrics F5 (a shipping decision) |

---

## F13 — The filled style

Every place the filled drawing and its outline twin disagree beyond the ink box (card 1.8), with
the corners, angles and reference findings that bear on the pair.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F13-01 | (1) | ⇄ The filled twins at 16 that kept the 1.5-era corner. Card 1.2: 12 files carry the outer corner 2.25 instead of 2.125 (the other 15 files with `A2.25` at 16 pair with an outline `r1.625` and are correct). Card 1.16: 45 corner pairs in 12 concepts still carry the +0.125 of contour radius; 565 of 645 match exactly. Card 2.5: 13 shape-filled twins, 50 corners — it adds `archive`, whose corners card 1.2's own table reads as consistent — a radius 0.125 larger than outline centreline + 0.625, putting a corner's diagonal midpoint 0.05 inside the outline's edge. Card 1.8: 97 corners on 37 concepts at the 1.5-era offset. On record and ruled "leave it" (Maruti, 2026-09-20); the contribution is the exact population | `calendar` ×3 `credit-card` ×3 `file` `file-text` `file-text-2` `folder` ×3 (`archive`: card 2.5 only) | 12 files at 16 (card 1.2) ⇄ 12 concepts (card 1.16) ⇄ 13 concepts (card 2.5) ⇄ 37 concepts (card 1.8) | 12 drawings | systemic | docs/audit/findings-corners.md:727 · docs/audit/findings-corners.md:388 · docs/audit/stale-statements.md:327 · docs/audit/references-central.md:287 · docs/audit/findings-filled.md:655-658 | SF T7 (on record, not reopened) |
| R-F13-03 | (1) | Six shape-filled concepts thicken a ring to `FILLED_WEIGHT` where the rule says strokes keep the outline weight: `search`'s lens wall is 2.5 · 2.0 · 2.0 against 1.5 · 1.5 · 1.25. A whole construction with no rule | `search` `search-2` `search-3` `database` `database-3` `map-pin-4` | six concepts | [needs measuring] | systemic | docs/audit/findings-filled.md:624 · docs/audit/findings-filled.md:463 | — (eye: `search` beside `plus-circle-filled`, `ban-filled`) |
| R-F13-04 | (1) | ⇄ `search`'s filled handle is a taper, not a bar: 1.980 at the lens end → 3.5 at the tip against a uniform 1.5 outline, its edges 7.795° / 5.399° / 7.167° / 5.332° off the 45° they offset — the largest angle divergence in the set (card 1.8). Card 1.3 reads the three `search` filled files as off axis where the outlines obey (dev 10.19 / 14.44 / 7.17) | `search` `search-2` `search-3` | 3 concepts | [needs measuring] | one-off | docs/audit/findings-filled.md:625 · docs/audit/findings-angles.md:629 | — (eye) |
| R-F13-05 | (1) | `code`'s filled slash is at 75.53 / 73.74 / 75.96 against the outline's 73.14 / 72.26 / 73.18, on a different run and rise (4×15.5 against 5×16.5 at 24), up to 2.79 degrees apart at 16 — on the one icon C30 was written for. C30 declares the outline's run and rise and is silent on the filled twin; the set-wide silence is R-F13-32 | `code` | `code` | [needs measuring] | one-off | docs/audit/findings-angles.md:625 · docs/audit/rule-register.md:277-280 | angles §7a-7 |
| R-F13-06 | (1) | The classic `chevron-down` at 16: outline 45.496°, filled 44.913°, 0.583 degrees apart, where at 20 they are identical to 3 dp. The outline's leg was re-derived to hold the ink box in the C7 conversion; the filled twin kept the old angle. Invisible (0.03 px over a 6-unit leg), unintended. Card 1.3 measured `chevron-down` and tags the whole chevron family at 16 | the classic chevron family at 16 | [needs measuring] | [needs measuring] | one-off | docs/audit/findings-angles.md:626 | angles §7a-7 · Untitled take |
| R-F13-07 | (1) | `trash-5-filled` at 20 tapers at 4.561 degrees against C22's declared 4; the twelve outline tapers measure 3.964–4.023 and are exact. 0.14 px of drift, filled only | `trash-5-filled` at 20 | 1 file | 1 drawing | one-off | docs/audit/findings-angles.md:628 | — |
| R-F13-08 | (1) | `rotate-ccw-10`'s filled bend exceeds C12's 2× cap: r4.5 · 3.75 · 2.875 against a cap of 2.5 · 2 · 2 | `rotate-ccw-10` | `rotate-ccw-10` | [needs measuring] | one-off | docs/audit/findings-filled.md:627 | — |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F13-02 | (2) | ⇄ C12 says the flat chevron's filled legs sit "under 1° at 20 and 16" flatter than the outline; written 2026-09-17, before the 16 stroke moved on 2026-09-20, and not revisited. Three cards measure it three ways. Card 2.4: the 12 flat chevrons at 16 are flatter by 1.39° (`-2-large`), 1.85° (`-2-small`) and 1.92° (plain), tagged systemic, one family, one master. Card 1.8: 1.957° (`chevron-*-2`) and 1.850° (`-2-small`, `-3`, `chevrons-up-down-3/-4`), tagged systemic, 40 chevron concepts. Card 1.3: 1.96 at 16, tagged one sentence in C12, filed in its kind (1) table with the verdict "fix the doc, not the drawing" — the drawings and their own file comments are right (`chevron-down-2-small` declares 2.8° at 24 and measures 2.813). (Cards 2.4 and 1.3 file it kind (1); card 1.8 kind (2); here (2), see §0) | `chevron-{up,down,left,right}-2` `-2-small` `-2-large` at 16 | 12 flat pairs at 16 (card 2.4) ⇄ 40 chevron concepts (card 1.8) | none (C12's sentence) | one-off | docs/audit/references-untitled.md:231 · docs/audit/findings-filled.md:634 · docs/audit/findings-angles.md:627 | Untitled take (fix C12's sentence) |
| R-F13-12 | (2) | ⇄ The pair box: "equal to 2 dp, no tolerance" is in fact a 0.01 tolerance that 301 pairs on 142 concepts use (largest 0.005). Our box holds 1,100 of 1,455 pairs exactly, 54 declared, 0 undeclared (card 1.8); 1,401 of 1,455 (96.3%) within 0.01, the other 54 all carrying `grows:` (cards 2.4 and 2.1); card 1.12 measures it six ways — exact as a tuple 921, edge by edge 924, within 0.001: 1,159 / 1,183, within 0.005: 1,306 / 1,318, within 0.0101: 1,397 / 1,401, published 2 dp boxes identical 1,299 (89.3%). Card 1.8 calls the rule mis-stated, not broken: say 0.01 and mean it; card 1.15 reads "to 2 dp" as the 0.01 itself and agrees with lint | every pair | 301 pairs on 142 concepts in the band | [needs measuring] | systemic | docs/audit/findings-filled.md:637 · docs/audit/findings-filled.md:583 · docs/audit/references-untitled.md:206 · docs/audit/references-fluent.md:345 · docs/audit/findings-metrics.md:609-616 · docs/audit/enforcement-gap.md:333 · plans/set-and-rules-audit.md "filled/outline box equality" | sev §4.2 row 1 · sev §7-2 (promote, with `grows:` as the escape) |
| R-F13-13 | (2) | The outer-edge rule and C23's separation rule contradict each other for any cut that runs edge to edge: the filled drawing is in more pieces than the outline in 144 pairs / 51 concepts and fewer in 228 / 80 — `table` goes from one piece to six, `grid-2` 1→4, `globe` 1→9. The outer-edge rule should name the exception rather than be quietly contradicted 144 times | `table` `grid-2` `globe` and the rest of the 51 | 144 pairs in 51 concepts | [needs measuring] | systemic | docs/audit/findings-filled.md:638 · docs/audit/findings-filled.md:428 | — (eye: does the rule bind a knockout that separates the shape?) |
| R-F13-14 | (2) | ⇄ The box is held, the angle gives — and the Settled row states both "no tolerance" and "filled bends grow to keep the leg angle", which cannot both hold for the flat chevron. C12 says exact: exact in 8 of 40 chevrons at 24, 14 at 20, 0 at 16 (card 1.8); 48 of 120 chevron pairs move more than 0.5°, 28 more than 1°, 10 more than 2°, at most 2.813° (card 2.4). The weight step decides it — +0.5 at 20 holds 14 / 40, +0.75 at 16 holds 0 / 40, +1.0 at 24 holds 8 / 40 — and +0.5 is Fluent's step at every size | the 40 chevron concepts | 40 chevrons (card 1.8) ⇄ 120 pairs (card 2.4) | [needs measuring] | one-off | docs/audit/findings-filled.md:635 · docs/audit/findings-filled.md:583-590 · docs/audit/references-untitled.md:237 · docs/audit/references-untitled.md:211-222 | Untitled take (eye: four icons at both weight steps) |
| R-F13-15 | (2) | C10's 2× cap binds on a third of the chevrons and nobody is told: for `chevron-*-2` the filled bend hits 2 × `bendMin` at all three masters and the leg angle gives instead, by up to 5.626° at the cap (0.21 px at 16 at the leg tip) — 12 concepts, 36 drawings. C10 says the radius grows *to keep the leg angle*; with a cap it cannot | `chevron-*-2` ×12 | 12 concepts, 36 drawings | 36 drawings | one-off | docs/audit/findings-primitives.md:889-891 · docs/audit/findings-primitives.md:335 | primitives item 2 · Untitled take (C10 should say which gives; lint prints the cap) |
| R-F13-16 | (2) | The filled check reads more asymmetric than the outline check, by up to 10%: `check-2`'s leg ratio 3.525 outline → 3.875 filled at 24. Arithmetic from the filled rule — the ends pull in by half the added weight, which takes proportionally more off the short leg — and the rule guarantees the ink box, not the proportion inside it | the eight check variants | eight check variants (filled measured at 24) | [needs measuring] | one-off | docs/audit/findings-primitives.md:947 | — (docs/09's check-cut ruling; eye at 16) |
| R-F13-17 | (2) | docs/09:42's three cut weights (minus 2.5 · plus/x/glyphs 2 · checks 1.5 — confirmed exactly at 24) are three modes of a ten-value vocabulary at 24, 17 values at 20, 16 at 16: 198 of 231 readings at 24 sit on the three modes, 33 between or beyond. This is the population the pending cut-weight ruling needs. (Card 1.8's half; SF's half is R-F13-33) | every filled cut | 130 files with a cut at 24 (20 and 16 not counted) | [needs measuring] | systemic | docs/audit/findings-filled.md:640 · docs/audit/findings-filled.md:335-337 · docs/audit/findings-filled.md:357-358 · docs/audit/stale-statements.md:326 | SF T6 (docs/09 pending ruling 1) |
| R-F13-18 | (2) | The same literal 1.5 cut means "one line wide" at 24 and 20 and "1.2 lines wide" at 16 (modal ratio 1.0 / 1.0 / 1.2). (Card 1.8's half; Fluent's half — which basis governs what a knockout leaves — is R-F13-34) | every filled cut at 16 | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-filled.md:641 | Fluent T2 |
| R-F13-19 | (2) | ⇄ docs/03:60-62's "a hole punched in a solid obeys a 3-unit minimum" is broken everywhere and the break is right — measured cut widths `check-circle` 1.50 at every master, `plus-circle` 2.00 / 1.75 / 1.75, `x-circle` 2.01 / 1.76 / 1.76, `minus-circle` 2.50 / 2.00 / 2.00 — and docs/09:22's premise "every knock-out keeps fully clear pixels at every master" is partly refuted. Card 1.14: at 24 and 20 `check-circle` leaves 0 fully clear pixels (4 at coverage ≤ 0.05) where the other three leave 8 to 28; at 16, check 4, x 8, plus 4, minus 8. Card 2.2 quotes docs/09's own figures for 16 — the tick 6 clear pixels against plus 10 (docs/09 had cross 8 and minus 12 too) — which card 1.16 cannot reproduce at any threshold. The lab's Filled header still echoes the 3-unit rule | `check-circle` `plus-circle` `x-circle` `minus-circle` | 4 concepts | [needs measuring] | systemic | docs/audit/rule-register.md:270 · docs/audit/references-sf.md:701-702 · docs/audit/stale-statements.md:318 · docs/audit/stale-statements.md:300 | SF T6 (docs/09 pending ruling 1: bring the tick's cut up) |
| R-F13-20 | (2) | ⇄ No rule names the filled style's own corner vocabulary, and C23 records r0.5 as a feature of one icon. Card 1.8: 1,387 filled corners on 125 concepts have no outline counterpart, r0.5 used 549 times. Card 1.2: 1,396 filled-only convex fillets (cut-mouth easings), 0.5 ×613, 0.75 ×306, 0.25 ×121. Nor does a rule govern a corner inside a corner: 146 solid-plus-hole pairs in 37 concepts take 15 different solid-minus-hole differences | the 125 concepts of card 1.8 §3.3 | 1,387 corners on 125 concepts (card 1.8) ⇄ 1,396 fillets (card 1.2) | [needs measuring] | systemic | docs/audit/findings-filled.md:642 · docs/audit/findings-corners.md:344 · docs/audit/findings-corners.md:738 | — |
| R-F13-21 | (2) | Three answers coexist for "what does a ring do when it fills": a solid disc (`list-bullet-3`, documented), a ring thickened to `FILLED_WEIGHT` with a smaller counter (`search` ×3, `database` ×2, `map-pin-4`, undocumented), or line-heavy (`ban`, `at-sign` ×2, correct). Nothing chooses | `list-bullet-3` `search` ×3 `database` ×2 `map-pin-4` `ban` `at-sign` ×2 | [needs measuring] | [needs measuring] | systemic | docs/audit/findings-filled.md:643 · docs/audit/findings-filled.md:463 | — |
| R-F13-22 | (2) | C22 says "`search-filled` punches the lens counter at the outline's inner radius"; the outline's inner radius at 24 is 6.25 and the file punches 5.25 — one unit out, at all three masters | `search-filled` | `search-filled` | [needs measuring] | one-off | docs/audit/findings-filled.md:636 | — (card 1.16) |
| R-F13-23 | (2) | ⇄ C23's radius table (container 2.5 · 2 · 1.5 on the centreline, outer 3.25 · 2.75 · 2.25) was derived with a 0.75 half-stroke at every master; since C7 the 16 half-stroke is 0.625, so the derivation gives 2.125 at 16, not 2.25. The table was kept, and C7 records that the shape-filled files at 16 "changed only their root `stroke-width` label". Two deliberate decisions that jointly make R-F13-01 — 13 concepts and 50 corners by card 2.5, 12 concepts and 45 pairs by card 1.16 | the 16 filled containers | 13 concepts (card 2.5) ⇄ 12 concepts (card 1.16) | [needs measuring] | systemic | docs/audit/references-central.md:296 · docs/audit/references-central.md:287 · docs/audit/stale-statements.md:327 | — (on record) |
| R-F13-24 | (2) | No rule names the "fill the shape *and* keep its stroke" construction: `arrow-*-4`, 5 concepts / 15 files. One-off today, a choice tomorrow | `arrow-*-4` ×5 | 15 files | 15 drawings | one-off | docs/audit/findings-filled.md:644 | — |
| R-F13-25 | (2) | The §5c knockout check does not run on a shape-filled file that also carries strokes (`lint.mjs:459` needs `ds.length === 0`): 414 files, 138 concepts — cards 1.13, 1.15 and 1.16 agree. A cut that leaves too little material is caught on `help-4-filled` and missed on `volume-low-filled`, because the latter keeps a wave as a stroke. docs/08:354 counted one reading in 354 | `volume-low-filled` and the 138 mixed concepts | 414 files | 414 drawings | systemic | docs/audit/exceptions-ledger.md:705 · docs/audit/enforcement-gap.md:287 · docs/audit/stale-statements.md:156 | R-9 · sev §4.3 row 1 |
| R-F13-26 | (2) | ⇄ `grows:` — CLAUDE.md:279-280 says "none yet noted"; 18 concepts / 54 files carry the note, every one matching its drawing, 13 distinct strings; lint prints 54 "agreed growth" notes and 0 "ink box differs" warnings. Card 1.13 corrects card 1.8's sentence that every value is half the weight step: at 16 thirteen concepts declare 0.375 and five (`grid-3`, `grid-4`, `more-horizontal`, `more-vertical`, `list-bullet-2`) declare 0.25 | `chart-bar` `filter-2` `grid-3` `grid-4` `list-bullet` `list-bullet-2` `menu` ×4 `menu-arrow-*` `minus` `minus-small` `minus-large` `more-*` `text-2` | 54 files | none (a doc claim; all 54 notes hold) | one-off | docs/audit/findings-filled.md:639 · docs/audit/stale-statements.md:145 · docs/audit/exceptions-ledger.md:760 | — (a straight edit; `grows:` is the model note) |
| R-F13-32 | (2) | Nothing says whether a filled twin may change an angle or a radius. C10/C12 hold the ink *box*; measured, `trash`'s taper reads 4.23 / 4.29 / 4.00° on the filled contour against 4.02 / 3.98 / 4.00° on the outline, and `code`'s slash 75.53 / 73.74 / 75.96° filled against 73.14 / 72.26 / 73.18° outline. Both drawings are agreed; the silence is set-wide — the same question as docs/09:45's 16 filled corners, seen from the angle side | `trash` `code` | `trash` · `code` | [needs measuring] | systemic | docs/audit/rule-register.md:277-282 | — |
| R-F13-35 | (2) | CLAUDE.md's C10 row states `bendMin` as two cases — outline 0.75 · 0.75 · 0.625, filled 1.25 · 1 · 1 — and the set has three: a *light* filled file, where shapes fill and lines keep the outline weight, bends its strokes at the outline radius. 36 drawings do, 12 concepts × 3 masters — `export`, `external-link`, `external-link-2`, four `rotate-ccw-*`, the four `sort-*-ascending/descending` and one more. Card 1.1 names `tools/masters.mjs:26-27` too; at the pin its comment already limits the filled value to a line-heavy file | `export` `external-link` `external-link-2` `rotate-ccw-4` `rotate-ccw-6` `rotate-ccw-9` `rotate-ccw-11` the four `sort-*` | 36 drawings, 12 concepts | 36 drawings | systemic | docs/audit/findings-primitives.md:498-505 · tools/masters.mjs:24-27 | — (state the third case in the C10 row) |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-F13-27 | (3) | Filling closes air the outline had in 204 pairs (14%); `24/users` lands at 1.49, exactly 0.01 inside lint's threshold | `users` at 24 and the rest of the 204 | 204 pairs | [needs measuring] | systemic | docs/audit/findings-filled.md:652 · docs/audit/findings-filled.md:378 | — |
| R-F13-28 | (3) | `check-circle`'s 1.5 cut is still the lightest cut in the set and still swaps in place with `x-circle`'s 2.0 — 1.5 against 1.75–2 on the swap partner at all three masters; docs/09:19's reword is unactioned at 485 icons | `check-circle` and its swap partners | `check-circle` · `x-circle` | [needs measuring] | systemic | docs/audit/findings-filled.md:653 | SF T6 (docs/09 pending ruling 1) |
| R-F13-29 | (3) | `ban` and `ban-2` are byte-identical outline drawings whose filled twins differ by 61% of ink (175.13 against 281.26 at 24) and by construction class; both IoU 1.000 against their outline. One outline, two names, and it ships | `ban` `ban-2` | `ban` · `ban-2` | [needs measuring] | one-off | docs/audit/findings-filled.md:650 · docs/audit/findings-filled.md:535 | — (eye: the family sheet at 16; see R-X-13) |
| R-F13-30 | (3) | Two filled drawings are lighter than their outline: `globe-2` / `language-3` 0.954 · 0.747 · 0.710 (29% less ink at 16, and zero enclosed white where the outline has four counters); `globe` / `language-2` 1.010 at 20, 0.982 at 16. Card 1.8 lists the first under kind (1) while noting that no rule says a filled drawing must be heavier; it sits here as kind (3) for that reason | `globe-2` `language-3` `globe` `language-2` | `globe-2` · `language-3` · `globe` · `language-2` | [needs measuring] | one-off | docs/audit/findings-filled.md:628 · docs/audit/findings-filled.md:651 | — (eye: the wall sorted by ink, filled under outline) |
| R-F13-31 | (3) | Does a white line read thinner than a drawn one? C18's finding, which C22 and C23 rest on; the pixels are identical and the claim is perceptual. About 61 icons already cut 1.5 at 16, 9 were redrawn for it in September | the 1.5 cuts at 16 | about 61 icons | [needs measuring] | systemic | docs/audit/findings-air.md:828 | Fluent T2 (a pairing sheet, real 16 px, light and dark) |
| R-F13-33 | (3) | SF's half of R-F13-17: no rule says what a filled cut is derived from. Apple's is one — the knockout is the mark's own outline weight × 1.035 (p5–p95 1.00–1.06, n = 320), the same for check, plus and x; ours is set per mark class, and docs/09 §2 already says the difference between swap partners is visible | every filled cut | [needs measuring] | [needs measuring] | systemic | docs/audit/references-sf.md:666-672 | SF T6 (docs/09 pending ruling 1) |
| R-F13-34 | (3) | Fluent's half of R-F13-18: the material a knockout leaves at 16 reads median 1.72 — 1.38× the 1.25 outline line, which holds — and minimum 1.13; against `FILLED_WEIGHT` 2 it does not, 9 of the 13 measurable drawings leave less. No rule of ours says which basis governs the material a knockout leaves; Fluent has one weight per size and so no question | every filled cut at 16 | 9 of 13 measurable drawings at 16 | 9 drawings | systemic | docs/audit/references-fluent.md:421-427 | Fluent T1 · Fluent T2 (eye: does 1.25 of white read as separated as 1.5?) |

### Not adjudicated — two cards disagree on whether there is a deviation

Card 2.5 paired filled and outline corners set-wide with `central-axes.mjs --ours` and marked these
"not judged whether agreed". Card 1.2 adjudicated every concept its own pairing flagged from the
typed arcs, found **no** concept that draws its filled outer corner tighter or looser than outline +
half the stroke other than the 12 files at 16 (R-F13-01), and says no set-wide statistic for that
relation is reliable. The plan's corrections table settles "four concepts draw the filled corner
tighter" as **none does**. These are not kind (1); they wait for a per-corner reading.

| id | what the two cards say | icons | reach (card's unit) | drawings | sources | proposals |
|---|---|---|---|---|---|---|
| R-F13-09 | Card 2.5: the filled twin has a sharp corner (0) where the outline rounds at 1.5 (24) or 1.25 (20) and the relation expects 0.75 or 0.5. Card 1.2: none drawn tighter or looser by its per-corner reading; no reliable set-wide statistic | `clipboard` `clipboard-3` `clipboard-4` | 3 concepts (card 2.5) | [needs measuring] | docs/audit/references-central.md:288 · docs/audit/findings-corners.md:392 · docs/audit/findings-corners.md:726 · plans/set-and-rules-audit.md "Four concepts draw the filled corner tighter" | SF T7 |
| R-F13-10 | Card 2.5: filled corner 4.75 (24) / 4.25 (20) where 3.25 / 2.75 is expected (+1.5). Card 1.2: as above | `copy-2` `copy-3` | `copy-2` · `copy-3` | [needs measuring] | docs/audit/references-central.md:289 · docs/audit/findings-corners.md:392 · docs/audit/findings-corners.md:726 | SF T7 |
| R-F13-11 | Card 2.5: `archive` and `thumbs-up` 0.25 under the relation at 24 (0.5 where 0.75 is expected); `heart`, `shield`, `shield-2`, `wand-2` under by less than 0.08, the size of a curve fit. Card 1.2 reads `archive` from its typed arcs as "Consistent" (filled 3.25 ×2, 2.25 ×2 against outline 2.5 ×2, 1.5 ×4) — the corners it lists, not necessarily card 2.5's; it does not name `thumbs-up` | `archive` `thumbs-up` | `archive` · `thumbs-up` | [needs measuring] | docs/audit/references-central.md:290 · docs/audit/findings-corners.md:388 · docs/audit/findings-corners.md:392 | SF T7 |

---

## X — Not on any axis

Names and numbering (C9, C27), the sheet and its scope (Polaris), the documents, the gate, the
process rules and the audit's own instruments.

### Kind (1) — a drawing disagrees with a stated rule

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-X-01 | (1) | 23 concepts' search words stand against C9's style word: 14 same-tag pairs in 10 runs (22 concepts) plus `key-5`, which has no word of its own; the 6 shapes with no word and the 2 descending sorts tagged "ascending" are inside those. Tags are comments; the Library and `dist/icons.json` carry them; lint cannot see them | `sort-alpha-descending-2` `sort-alpha-descending-3` `key-5` `sparkle-2/-3/-4` and the 14 pairs | 23 concepts, 138 files | 138 drawings | systemic | docs/audit/findings-families.md:526 · docs/audit/findings-families.md:158 · docs/audit/findings-families.md:170-171 | FM-2 |
| R-X-02 | (1) | ⇄ 102 files carry no `tags:` note at all — the 17 concepts `plus`, `minus`, `x`, their sizes and circles, and `more-horizontal` / `more-vertical`. Read literally, C9 says the style word is "written into every file", and searching "add" finds no `plus` (cards 1.14, 1.15). Card 1.10 reads C9 as asking for a word on numbered shapes only — "coverage is complete where C9 asks for it" — so the same 17 are no breach. Same count, two readings; FM-2 (words for numbered shapes) does not cover them | `plus` `minus` `x` and their sizes and circles, `more-horizontal` `more-vertical` | 17 concepts, 102 files | 102 drawings | systemic | docs/audit/enforcement-gap.md:284 · docs/audit/rule-register.md:333 · docs/audit/findings-families.md:163-165 · docs/audit/findings-families.md:664 | SF T8 (a use-name table: add → plus) |
| R-X-03 | (1) | The sort family's 60 warnings arrived through `approve` — which aborts on errors only — with none of the three things the process requires: no note (SKILL.md:174-177), no C-row (SKILL.md:179-181), and the plan's own proof ("no new warnings") unmet. `npm run check` now has a permanent floor of 62 warnings, so the next real warning is invisible | `sort-alpha-*` ×6 `sort-numeric-*` ×6 | 60 drawings | 60 drawings | one-off | docs/audit/enforcement-gap.md:167-216 · docs/audit/rule-register.md:406-407 · docs/audit/stale-statements.md:345-386 · docs/audit/exceptions-ledger.md:709 | sev §2 · sev §7-1 (the warning baseline) · R-7 |
| R-X-04 | (1) | `checkbox-2`, `-3`, `-4` carry `check-circle`'s ticks `-3`, `-4` and `-small`, against C9's composite clause (a composite is numbered after the shape it uses) and C18 (a smaller mark is a size, not a number). The commit that added them misdescribes them; each file's own comment names the ring's number | `checkbox-2` `checkbox-3` `checkbox-4` | 3 concepts, 18 files | 18 drawings | one-off | docs/audit/findings-families.md:533 · docs/audit/findings-families.md:190 | FM-1 |
| R-X-05 | (1) | ⇄ `login`'s door is `logout-3`'s, not `logout`'s: the four doors are shared exactly (residual 0) but cross-paired — `login`↔`logout-3`, `login-3`↔`logout`, `login-2`↔`logout-4`, `login-4`↔`logout-2`. Card 1.1 reads C9 as "a number names a shape, so `login-n` and `logout-n` should be the same door" and recommends renumbering; card 1.9 reads the drawings' own rule (R-X-11) and recommends keeping. Free until launch | `login` … `login-4` `logout` … `logout-4` | 8 concepts | [needs measuring] | one-off | docs/audit/findings-primitives.md:969 · docs/audit/findings-grammar.md:677 · docs/audit/findings-grammar.md:554 | P6 (keep) · primitives item 12 (renumber) |
| R-X-06 | (1) | ⇄ `globe` / `language-2` and `globe-2` / `language-3` carry identical path data in both styles (card 1.1 says byte-identical; cards 1.14 and 1.16 note the comments differ), declared as aliases in their own notes. Card 1.1 counts the alias files — 12 files, 2 of 485 concept slots where a tag would do — and recommends retiring the two names; card 1.10 counts all four concepts — 24 files — against C9's "a number marks a different drawing" (R-X-12), and recommends keeping them and saying in C9 that a number may also mark a different name | `globe` `language-2` `globe-2` `language-3` | 12 files (card 1.1) ⇄ 24 files (card 1.10) | 12 drawings (card 1.1) ⇄ 24 drawings (card 1.10) | one-off | docs/audit/findings-primitives.md:905-907 · docs/audit/findings-families.md:536 · docs/audit/findings-families.md:638-642 | FM-6 · primitives item 4 · SF T8 |
| R-X-07 | (1) | `help` and `info` do not name their ring where `alert-circle`, `check-circle`, `x-circle`, `plus-circle`, `minus-circle` do; `help-square` (row 455) and `info-square` (456) are queued and make the bare names ambiguous the day they ship. C9 locks names at launch. Card 1.16 counts the `help` half alone: 4 concepts, 24 files, "one inconsistency to fix before release" | `help` ×4 `info` ×3 | 7 concepts, 42 files | 42 drawings | systemic | docs/audit/findings-grammar.md:550-551 · docs/audit/stale-statements.md:473 | P5 · PL-8 |
| R-X-08 | (1) in the sheet | `atm` is queued (#277) on a vote that has gone: its only vote was the archive's `AtmWithdrawal`; live Polaris has no ATM, so docs/06:32-34's evidence rule is no longer met | `atm` | 1 queued row | none (a queued row) | one-off | docs/audit/references-polaris.md:459-461 | PL-6 |

### Kind (2) — a rule disagrees with another rule or the docs

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-X-09 | (2) | The foundations were never frozen: docs/04:75-79 says draw the hardest first, then freeze; docs/09 named ten stress-batch containers and the five rules to settle from them. All ten shipped, none of the five was written, and the set's composition inverted — 77 of 93 concepts were marks (83%) when C8–C18 were decided; 136 of 485 (28%) are at the pin. No drawing disagrees; the process and the docs do. (Moved from kind (1): see §0) | `calendar` `user` `gear` `bell` `lock` `mail` `image` `home` `eye` `chart-bar` | [needs measuring] | [needs measuring] | systemic | docs/audit/rule-register.md:46-66 · docs/audit/enforcement-gap.md:291-321 | — (docs/09 §6's order; the five rules) |
| R-X-10 | (2) | **docs/01 claims a guarantee the gate does not give.** "Every icon obeys this or it does not ship" and "the linter checks all of this mechanically" — but `lint.mjs:648,652` fails a drawing on errors only, and every geometric rule (gaps, bends, keylines, centring, families, the pair box) is a warning. 2,910 drawings · 62 warned · 0 failed, exit 0. The gate protects the declarations, not the drawing | every drawing | 2,910 drawings linted | every drawing (the gate judges all) | systemic | docs/audit/enforcement-gap.md:4 · docs/audit/enforcement-gap.md:21-50 · docs/audit/stale-statements.md:54-62 · docs/audit/severity-proposal.md:13-27 | sev §2 · sev §7-1 |
| R-X-11 | (2) | `login`/`logout` numbers pair by depth and handedness, not by door shape: `login-n` ↔ `logout-n` share depth and arrow direction and swap the door's side; `login-3` is `login` flipped whole. A consistent rule the drawings follow and no doc states; C9 as written says otherwise | `login` … `logout-4` | 8 concepts | [needs measuring] | one-off | docs/audit/findings-grammar.md:554 · docs/audit/findings-grammar.md:494 | P6 |
| R-X-12 | (2) | `language-2` and `language-3` are `globe` and `globe-2` under a second name, identical at three masters in both styles (4 concepts, 24 files), recorded at docs/07:78 — while C9 says a number marks a different drawing and C29 retired four `-3`s for being one drawing at two masters | `language-2` `language-3` `globe` `globe-2` | 4 concepts, 24 files | 24 drawings | one-off | docs/audit/findings-families.md:536 | FM-6 · SF T8 |
| R-X-13 | (2) | **A number may mark a filled-only difference** — a working rule used by four separate decisions and written nowhere. Nine groups, 22 concepts, ship an outline identical to another concept's at all three masters (`ban`/`ban-2`; the four `layout-*` triples; `globe`/`language-2`, `globe-2`/`language-3`; `building-3`/`-4`; `compass`/`compass-3`); five more pairs are identical outlines at 16 only. Card 1.14 says "in 22 concepts it marks a different cut", but by its own table the two globe pairs are complete aliases, identical in the filled twin too; the cut differs in the other seven groups, which card 1.1 counts as 17 *filled-style variants* with no C9 slot and no tag. `building-4` and `compass-3` are explained only in file comments | `ban` `ban-2` `layout-footer/-2/-3` `layout-header/-2/-3` `layout-sidebar/-2/-3` `layout-sidebar-right/-2/-3` `building-3` `building-4` `compass` `compass-3` | 9 groups, 22 concepts | [needs measuring] | systemic | docs/audit/rule-register.md:340-372 · docs/audit/stale-statements.md:105-114 · docs/audit/findings-primitives.md:636-638 · docs/audit/findings-primitives.md:898 | sev §4.4 row 6 · primitives item 3 (a `fill:` tag) |
| R-X-14 | (2) | C9's composite clause is written in one place only: docs/07:49 holds both of C9's numbering sentences; the Settled table's C9 row (CLAUDE.md:193) has neither and the icon skill never mentions C9 — against CLAUDE.md's own "a rule is changed everywhere at once" | the composites | none (a rule's location) | none (a rule's location) | systemic | docs/audit/findings-families.md:543 | FM-1 |
| R-X-15 | (2) | C27 lists an arrangement, `users-heads`, retired 53 seconds after it was written (commit `279ff1c`); it is the only dashed cell `lab/figures.html` can show | `users-heads` | 0 drawings | none (a retired name) | one-off | docs/audit/findings-families.md:554 · docs/audit/findings-families.md:378 | FM-4 |
| R-X-16 | (2) | ⇄ **C7's evidence sentence cites a figure that is wrong.** `docs/07:47` says Fluent uses 1.5 at 12, 16, 20, 24 and 28 "exactly as we do"; Fluent's Regular stroke is 1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5 at 12 … 48 — our reference row is a slip across its Regular and Filled columns, confirmed three ways (the Figma table, the shipped geometry, 183 shipped SVGs). At 16 Fluent draws 1.0 (6.25% of its canvas) where we draw 1.25 (7.81%): the largest deployed set is on the *other* side of the fork C7 named. The decision stands (the blind pick and eight redraws); the citation must not | — | none (a false citation) | none (a false citation in two rule documents) | one-off | docs/audit/references-fluent.md:376-388 · docs/audit/stale-statements.md:31-41 · docs/audit/rule-register.md:157-169 · docs/audit/references-field.md:415 | — (card 1.16's edit) |
| R-X-17 | (2) | ⇄ `CLAUDE.md:308` quotes "2,664 outline/fill pairs" for SF Symbols; the app's own file declares 2,906, or 2,508 without the 398 locale and direction variants; the 2,664 reproduces from no filter tried, and card 1.16 marks the sentence as holding. [needs checking] against a named release | — | none (a reference fact) | none (a reference fact) | one-off | docs/audit/references-sf.md:658-664 · docs/audit/references-field.md:530 · plans/set-and-rules-audit.md "SF Symbols' pair count" | — |
| R-X-18 | (2) | `CLAUDE.md:310` says Nucleo carries per-icon `stroke_max` metadata; it is one constant per set and grid, set on 1,429 of 64,933 icons (2.2%) in three sets. The plan (two lines) and the README repeat it; the field report leaned on the stale claim | — | none (a reference fact) | none (a reference fact) | one-off | docs/audit/references-nucleo.md:458-465 · docs/audit/references-field.md:417 | — (card 1.16) |
| R-X-19 | (2) | ⇄ `CLAUDE.md:305` says Fluent's filled twin shares the base geometry verbatim; it holds for 1,109 of 1,293 pairs (85.8%) and fails on 184 pairs across 43 concepts where filled is +0.5 thicker (card 1.16); card 2.1 reads 75–84% of pairs from the Figma records; the field report 76 / 80 / 84 / 80% of 25 pairs at 16 / 20 / 24 / 32 from rasterised SVGs — three populations, one band | — | none (a reference fact) | none (a reference fact) | one-off | docs/audit/references-field.md:418 · docs/audit/references-field.md:527 · docs/audit/stale-statements.md:197 | — |
| R-X-20 | (2) | ⇄ The Polaris pointer doc 06's D23 rulings wait on is dead: `CLAUDE.md:162-168` names the right file (`XewrhAKrNGVZtikkpI5am9`) and a node (`15643:27748`) that is not in it. Card 1.16's proposed fix names `rdI0uXVzp89fOZpYcQV6mo`, which is the Fluent file (six pages, no Polaris page); the live Polaris is a page in the first file, `15721:27960` "Polarris icons" — 490 names drawn 499 times, every drawing 20×20 | — | none (a pointer) | none (a pointer) | one-off | docs/audit/references-polaris.md:465 · docs/audit/references-polaris.md:577 · docs/audit/stale-statements.md:127-139 · plans/set-and-rules-audit.md "the live Polaris is file" | PL-9 (fix the key before the pointer) |
| R-X-21 | (2) | ⇄ Polaris's size is stated four ways and each is true of a different source: 499 (the live page's drawings — README, docs/04), 463 bases + 72 filled = 535 files (the archive — CLAUDE.md:303, docs/06:15), ~490 (the live page's names — CLAUDE.md:166); docs/06:142-143 says CLAUDE.md's 499 does not match the archive, and CLAUDE.md no longer says 499. Six passages in four files | — | none (a count) | none (a count) | one-off | docs/audit/references-polaris.md:468 · docs/audit/references-polaris.md:575 | — (a source note) |
| R-X-22 | (2) | docs/06's `history` verdict leans on a premise the live page overtakes — "Polaris and Nucleo use a plain clock for history" — now that live Polaris also draws `clock-revert`. `history` is not on the sheet at the pin | `history` | none (a verdict in docs/06) | none (a verdict in docs/06) | one-off | docs/audit/references-polaris.md:472 · docs/audit/references-polaris.md:317 | — (eye: the node beside our `clock`) |
| R-X-23 | (2) | Lint's internal check ids (§5, §5b, §5c, §5f) read like docs/01 sections and are cited as if they were — in `CLAUDE.md` ×5, docs/08, the icon skill and `plans/facing-gap.md` — while docs/01 has §1–§8 only and its §5 is *Corners and radii*. No printed warning cites them; every warning in the run cites §6, which exists | — | none (a numbering collision) | none (a numbering collision) | one-off | docs/audit/stale-statements.md:396-407 · docs/audit/enforcement-gap.md:365 · plans/set-and-rules-audit.md "lint cites doc sections that don't exist" | — (rename the ids, or add the sections) |
| R-X-24 | (2) | ⇄ Stale counts and pointers that have moved — card 1.16's entries 2.1–2.21, less 2.18 (C9's "nothing has shipped", still true) and 2.21 (a product bug, carried as R-F12-05): the sheet is "487 icons" — card 1.17 reads 834 rows at the pin, 485 approved + 349 queued + 0 in review; card 1.16 read them at HEAD, 485 done, 348 todo, 1 in review; `grows:` "33, none yet noted" (18 concepts / 54 files, all noted); `anchor:` "first `volume-low`, `-none`, `-x`" (5 concepts / 30 files); `box:` "first used by `folder`" (57 concepts / 338 files); the 20 and 16 keylines "proposals"; docs/08's "95 of 561 approved · 570 drawings" snapshot; docs/09's 684 drawings and 572 rows; docs/04's "122 bases … 488 drawings … around 180"; `inkbox-guard`'s "219 of 228" (true of the conversion, 742 drawings "new since"); docs/09:43's bare-`x` container (15 concepts, 45 entries) | — | none (documents) | none (documents) | one-off | docs/audit/stale-statements.md:140-167 · docs/audit/references-polaris.md:580 | — (straight edits, one commit per document) |
| R-X-25 | (2) | The plans, the lab prose and the README: `README.md` has one commit and about twenty stale rows (stroke 2 at 24, "min gap one stroke-width", "4→20" for the 18 keyline — the arithmetic docs/01 calls the commonest error in icon sets); the lab still offers the retired `filled: 'outline'` in visible UI, `keylines.html` a "live area" and a diamond keyline; `plans/stroke-16.md` holds two figures for one quantity (`help` 71.2 → 60.7 against 60.9; an independent rasteriser 75.0 → 64.5) with no browser or method recorded anywhere; `plans/facing-gap.md` reads as current with 13 tests where there are 18. The range holds more items than are named here | — | none (documents) | none (documents) | one-off | docs/audit/stale-statements.md:168-254 | — (rewrite the README from CLAUDE.md; retire the labels) |
| R-X-26 | (2) | Dead text describing a system that no longer exists: docs/03's weight axis (Light 1.5 · Regular 2 · Bold 2.5) and "ship the 24 master only"; docs/02's five-step pipeline with a 2-unit stroke and `templates/grid-24.svg` (the directory does not exist); docs/05's modifier geometry for stroke 2 and a live area; docs/05's slash superseded by C21; docs/09's "Dead" list, whose archival was never done (the six lab pages exist, four stating retired rules) | — | none (documents) | none (documents) | one-off | docs/audit/stale-statements.md:294-308 | — (retire in the same sweep) |
| R-X-27 | (2) | ⇄ docs/09's verdicts re-measured at 485: two are refuted (angles — R-F4-12; punched holes — R-F13-19), one is closed (the pair-box notes, now 18 concepts / 54 pairs all declared), two confirmed to the digit (`file-text-2` at 16 = 1.625; the cut weights 2.5 / 2 / 2 / 1.5), one stale at 16 (`minus-filled` grows 1.0 · 0.5 · 0.75, where docs/09:27 says 1 · 0.5 · 0.5), and the rest hold with a larger scope (radii 5×, identical outlines 11×, the keyline drift against 86 concepts). Almost nothing in it has been acted on | — | none (a document) | none (a document) | one-off | docs/audit/stale-statements.md:309-339 · docs/audit/exceptions-ledger.md:761 · docs/audit/rule-register.md:427-452 | — |
| R-X-28 | (2) | `docs/08:287` and `:319` cite `docs/01-foundations.md:243` and `:245` for the §6 corollaries; they now sit at `docs/01:350` and `:352` | — | none (two pointers) | none (two pointers) | one-off | docs/audit/enforcement-gap.md:364 · docs/audit/stale-statements.md:154 | — (cite the section) |
| R-X-29 | (2) | The gate can report a false green, none hypothetical: a symlinked invocation prints nothing and exits 0; piped stdout can be truncated — 2 of 6 piped runs were cut short, one delivered 162,529 of 515,024 bytes — and `queue.mjs:270-272` reads lint's stdout through a pipe to build the approval report; an area-form path inside an *outline* file is invisible to every check (0 such paths ship). Also: `optical: - .` parses to NaN and disables the centring check; a misspelt note key is a silent no-op; the element and attribute deny-lists are closed lists, so `fill=` on a plain path, `<title>`, `<mask>`, `<text>` all pass; and a missing `<svg>` root returns that error alone and discards every note error already found | — | none today (latent) | none (latent; 0 today) | systemic | docs/audit/enforcement-gap.md:141-166 · docs/audit/enforcement-gap.md:88-118 · docs/audit/severity-proposal.md:146-148 | sev §5 row 4 · sev §5 row 5 · sev §5 row 6 |
| R-X-30 | (2) | ⇄ `tools/audit/raster.mjs`'s `classify` is unsound for filled shapes: it drops an area path's horizontal edges and reuses the list for its box test, so `rasterise` prints 0.00 where the truth is 0.50. It changes ink for 270 of the 1,026 shape-filled drawings (up to 10 px², 6.7% of the true ink) and no outline or line-heavy figure. Card 1.5 says it was bypassed and every published figure re-verified; card 1.7 says cards 1.5 and 1.6 "rest on it". Fix known, not applied | the 342 shape-filled concepts | 270 of 1,026 shape-filled drawings misread | none (an audit tool) | systemic | docs/audit/findings-mass.md:29 · docs/audit/findings-air.md:766-767 · plans/set-and-rules-audit.md "`raster.mjs:257` `classify`" | — (the plan's instrument list) |
| R-X-31 | (2) | `optical-sheet.mjs:135-137` places a bend's apex at the chord midpoint pushed toward the ends' midpoint — the arc's true midpoint only for equal legs. On the 48 check drawings (leg ratio 1.97–4.52) it sits 0.06–0.19 off the true apex and 16 of 48 recommendations move one 0.05 step; chevrons are unaffected (0 of 216). The sheet is the lab's and is not changed in this build | the check shapes | 48 check drawings; 16 recommendations move | none (a lab tool) | one-off | docs/audit/findings-optical.md:722 · plans/set-and-rules-audit.md "`optical-sheet.mjs:134-139` `triangleOffset`" | OC-1 (check against the true apex) |
| R-X-32 | (2) | The build's 2 dp box rounds `x` and `w` separately, so a published right edge can read 14.01 where the ink ends at 14.0 (`list-bullet` at 16: 2.38 + 11.63 = 14.01) and a centre can sit 0.005 from the true centre; ten of the 154 off-centre drawings differ by ≥ 0.005 for this reason | `list-bullet` at 16 | ten drawings | ten drawings | systemic | docs/audit/findings-optical.md:723 · plans/set-and-rules-audit.md "`build.mjs:43` rounds" | metrics F6 |
| R-X-33 | (2) | The audit's own id systems collide: `enforcement-gap.md` calls `tags:` "G7" and repeated elements "C5a" where the rule register's G7 is a different rule and repeated elements are C-6; a reader following one into the other lands on the wrong row | — | none (the audit's own documents) | none (the audit's own documents) | one-off | docs/audit/exceptions-ledger.md:764 | — (wave 5 reads the register's ids) |
| R-X-41 | (2) | Nothing says what to do when a drawing is approved over a warning that no note can express. The skill's answer assumes a note always exists; `gap:` has no vocabulary for an overlap; the one mechanism that would hold "a rule lives in one place" — a staleness check in `npm run check` — was proposed at docs/09:81 and never built. A process silence: no drawing looks wrong because of it. (Moved from kind (3): see §0) | the sort family today | 60 drawings today | 60 drawings | systemic | docs/audit/rule-register.md:419-425 · docs/audit/severity-proposal.md:153-163 · docs/audit/exceptions-ledger.md:736 | sev §2 · R-7 · sev §6 |
| R-X-42 | (2) | **The shipped format is not built.** The Settled table says customers get "outlined fills only — the stroked source stays private". No outliner, no package and no export exist; `dist/icons.json` ships the stroked paths. The business model the rule rests on — we do not control render size — is the reason it matters | every shipped icon | [needs measuring] | every drawing (every shipped icon) | systemic | docs/audit/rule-register.md:79 · docs/audit/enforcement-gap.md:279 | — (build the outliner, or change the Settled row) |
| R-X-43 | (2) | C8/C18's container check rests on a stated convention nothing enforces and an implementation choice nobody states. It takes the first path in a file as the container (`lint.mjs:332-335`) — docs/01's "container first, details after" drawing order, which nothing checks; list the mark first and it compares the wrong boxes, silently. And it never computes the inner mark for a filled file, so the inner-mark check runs on outlines only — stated nowhere | every container drawing | [needs measuring] | [needs measuring] | systemic | docs/audit/enforcement-gap.md:341-342 · docs/audit/enforcement-gap.md:278 · docs/audit/rule-register.md:78 | — |
| R-X-44 | (2) | The process gate CLAUDE.md asks for ("verify before saying done") has no machinery: `tools/geometry.test.mjs` (95 tests, all passing) is reachable from no `package.json` script — there is no `test` script at all — and there are no git hooks and no CI. A geometry bug would silently change every reading in the run | — | none (tooling) | none (tooling) | systemic | docs/audit/severity-proposal.md:155-161 | sev §6 · sev §7-4 |
| R-X-45 | (2) | The masters are spelled out by hand outside `tools/masters.mjs` — `[24, 20, 16]`, `24 · 20 · 16` — in 19 places in 10 files (the icon skill, seven lab pages, `draft-check.mjs`, `optical-sheet.mjs`), a floor rather than a total, against CLAUDE.md's "a rule lives in one place". Adding or changing a master means finding all of them | — | 19 occurrences in 10 files | none (code and pages) | systemic | docs/audit/parameter-map.md:334-337 · docs/audit/parameter-map.md:441 | — (card 3.3's change list) |
| R-X-46 | (2) | ⇄ The icon skill. Card 1.16 found it clean — every number, flag, path and command still matching `masters.mjs`, `lint.mjs`, `queue.mjs` and the lab pages. Card 1.13 finds `SKILL.md:75` still stating the dead per-decimal comment rule, and its list of the notes an approval teaches lint (`SKILL.md:174-177`) naming `box`, `keyline: mark` and `glyph` but not `gap`, `grows`, `anchor` or `optical` | — | none (a document) | none (a document) | one-off | docs/audit/stale-statements.md:170-175 · docs/audit/exceptions-ledger.md:165-169 · docs/audit/exceptions-ledger.md:494-497 | — |
| R-X-47 | (2) | Stale statements outside every roll-up above: `plans/sort-family.md` says "the eight character icons" (12 shipped) and states the family box 18×15 · 16×13.5 · 14×12, which holds for 13 of 17 `sort*` concepts; docs/06:16 says Nucleo Essential "221 + 181 names" (182); docs/06:113's "221 names × 2 grids × outline/filled" gives 884, not its 1,024; docs/08:262 still reads "Hold C7: 1.5 at every master"; docs/08:423-424 says 20 and 16 match Fluent's +0.5 filled step — at 16 it is +0.75 | — | none (documents) | none (documents) | one-off | docs/audit/stale-statements.md:278-288 | — (card 1.16's list) |
| R-X-48 | (2) | ⇄ Two Polaris counts in CLAUDE.md and docs/06 that the live source moves: "118 Shopify-only" — the archive's 118 concepts plus 13 logos make 131 excluded, the live page 110; "13 open slots" — 13 on the archive (487 pass), 0 on the live names (508 pass, cut at 500). And a stale total the live source does not move: docs/04:52's "Total: 122 bases" — 122 names are 120 concepts (docs/06:49 already says 120), 114 in the first 500 on both sources | — | none (counts in two documents) | none (counts in two documents) | one-off | docs/audit/references-polaris.md:576-579 | PL-4 · PL-5 |
| R-X-49 | (2) | Three defects in `tools/audit/pixelgrid.mjs`, the audit's grid instrument: `blurScore` is a constant 0.500 on every straight run at stroke 1.5, so the landing score cannot rank 24 or 20 at all; `diagonalShare` restarts a fragment after every arc, so a closing `Z` goes to the last arc's end and four drawings change side of the 0.5 line; `arcExtremes` keeps or drops an arc's end extreme on rounding noise, moving 25 scores by up to 0.065. No band or headline moves | — | 4 drawings change side; 25 scores move | none (an audit tool) | one-off | docs/audit/findings-grid.md:367 · docs/audit/findings-grid.md:381 · plans/set-and-rules-audit.md "`pixelgrid.mjs` `blurScore`" | — (the plan's instrument list) |
| R-X-50 | (2) | CLAUDE.md calls `geometry.mjs` "exact arc bboxes" and the file says "true arc extents"; `bbox()` samples every arc at 64 points and sits up to 0.0056 inside the true edge (`rotate-ccw` at 24) — 0.011 px at 48. Harmless, but a box quoted to better than 0.01 needs the solved box, and `references-fluent.md` leans on the same "exact" wording | — | none (a code claim) | none (a code claim) | one-off | docs/audit/findings-metrics.md:216-219 · plans/set-and-rules-audit.md "`geometry.mjs` `bbox()`" | — |
| R-X-51 | (2) | The reference extractors carry two defects: `figma.mjs`'s `measure.ink` (Figma's render bounds) is wrong on rotated or flipped nodes — 1,032 Central drawings flagged — and `figma-extract.md`'s `fluent` row points at a copy page in the Central file, not the authoritative Fluent file (both enumerate 2,608 sets, so no figure changes) | — | 1,032 Central drawings flagged | none (an audit tool) | one-off | docs/audit/references-fluent.md:414-419 · plans/set-and-rules-audit.md "`figma.mjs` `measure.ink`" | — (the plan's instrument list) |
| R-X-52 | (2) | `congruence.mjs`'s `congruentUpToTranslation` reports "different segment structure" for one ring traversed the other way round (`layout-sidebar-right` against `checkbox`), where `canonical().shape` and `classify` call them identical; card 1.9 re-ran its count on canonical `d` and missed none of 694 | — | none (an audit tool) | none (an audit tool) | one-off | plans/set-and-rules-audit.md "`congruence.mjs` `congruentUpToTranslation`" | — (the plan's instrument list) |
| R-X-53 | (2) | The phrase about 16px text in C7's evidence column (docs/07:47) describes Cursor's pick — 1.25 beside 16 px type — not ours. Ours: the plan chose the 16's lighter line to sit better beside 16px text (`plans/stroke-16.md:15`), while the comparison sheet offered 13 / 14 / 16 px with 14 selected by default; the 24 and 20 text pairings are written nowhere this card could find | — | none (a citation in docs/07) | none (a citation in docs/07) | one-off | docs/audit/references-field.md:505-511 | FD-6 |

### Kind (3) — fine by every rule and still looks wrong

| id | kind | what the eye sees | icons | reach (card's unit) | drawings | scope | sources | proposals |
|---|---|---|---|---|---|---|---|---|
| R-X-34 | (3) | Nothing says how a new source's names enter the synonym table: 46 live Polaris concepts have no row (22 of them the entrants); 23 land in Tier 3, 21 purely by default, among them names that read as variants of table concepts (`person-list`, `page-list`, `page-report`, `chat-new`, `paste`); no document says who keeps the table current | 46 live concepts | 46 Polaris concepts | none (the synonym table) | systemic | docs/audit/references-polaris.md:477 | PL-5 |
| R-X-35 | (3) | A cut at 500 with no rule for too much evidence: 508 concepts pass the evidence rule on the live names; the last 8 fall by rank alone — seven queued rows and one drawn (`volume-off`) — and docs/06 only has a rule for a shortfall | `volume-off` and 7 queued rows | 8 rows | [needs measuring] | systemic | docs/audit/references-polaris.md:481 | PL-4 · PL-5 |
| R-X-36 | (3) | One product's vocabulary passes as evidence, and the Shopify filter matches whole names only: 19 of the 22 entrants are Polaris-only; a name that only *starts with* a listed Shopify-only name is not excluded — live 3, archive 0 (`catalog-product`, `order-batches`, `measurement-volume-list`) | `catalog-product` `order-batches` `measurement-volume-list` | 22 entrants | none (no entrant is on the sheet) | systemic | docs/audit/references-polaris.md:483 | PL-4 |
| R-X-37 | (3) | A second vote can be a spelling coincidence: Polaris's `bolt` (a lightning bolt, or Lucide's nut?) is the one measured case; a vote that is not a drawing would pass every rule | `bolt` / `zap` | 1 measured case | none (an entrant) | one-off | docs/audit/references-polaris.md:490 | — (eye: node `15721:28074`) |
| R-X-38 | (3) | C9 does not say where a style word becomes a name: `check-circle-dashed`, `rotate-ccw-dotted`, `chart-bar-horizontal`, `chart-bar-stacked` and three more are queued — a reading of five words; under another list the question reaches nine more names | `check-circle-dashed` `rotate-ccw-dotted` `chart-bar-horizontal` `chart-bar-stacked` | 0 shipped, 7 queued | none (queued rows) | systemic | docs/audit/findings-families.md:556 | FM-7 |
| R-X-40 | (3) | The four `users-4*` carry none of the group's words and never name `user-4`; the 12 other `users*` carry *team · group · people · members*, and 8 of them name their figure. No rule asks for either | `users-4` `users-4-behind` `users-4-wide` `users-4-level` | 4 concepts, 24 files | 24 drawings | one-off | docs/audit/findings-families.md:539 | FM-2 |

### Open rulings — not deviations

Its card says "open, not a disagreement": a ruling waiting, like the five decisions that expire at
launch. Carried here so the agenda has it; counted in no kind.

| id | what is waiting | icons | reach (card's unit) | drawings | sources | proposals |
|---|---|---|---|---|---|---|
| R-X-39 | Two numbering gaps wait for a ruling — `trash` 2 · 3 · 4 and `check-circle` 2 — recorded in at least three places each; the clock stops at launch (C9). 1 concept would be renamed | `trash` `trash-5` `check-circle` | 2 runs, 4 numbers | [needs measuring] | docs/audit/findings-families.md:548-550 · docs/audit/findings-families.md:106 | FM-3 |

---

## 15. What is not a deviation

One line each, so the register is honest about what holds. Every figure is the measuring card's;
where two cards count one thing, both are given.

| what holds | measured | sources |
|---|---|---|
| C8's size step | the 19 mark families hold 3 · 2.5 · 2 in 114 of 114 cells (204 steps), 0.000, outline and filled; no default over the ceiling | docs/audit/findings-families.md:562 · docs/audit/findings-families.md:17 |
| Containers keep the ring | 36 of 36 comparisons; lint's reading and the exact one agree on 390 files | docs/audit/findings-families.md:564 |
| The grid is full | 2,910 of 2,910; no size without a default; no orphan; 485 of 485 names obey C9's order of parts | docs/audit/findings-families.md:565 |
| ⇄ The container ring | one circle, residual 0, at all three masters, measured at the outer ink edge — 40 outline and 40 filled concepts in card 1.1's body (wave 0 recorded 41 + 37), 41 outline in its summary line | docs/audit/findings-primitives.md:183-185 · docs/audit/findings-primitives.md:986 |
| ⇄ The rounded square | one path, its filled radius *derived* (centreline + half the stroke) at all three masters — 26 outline concepts by card 1.1, 24 carriers at 24 by card 1.9 | docs/audit/findings-primitives.md:988 · docs/audit/findings-grammar.md:682 |
| The minus is the plus's bar | 18 of 18 comparisons identical, including both size variants, both containers and the filled style | docs/audit/findings-primitives.md:991 |
| The outline mark bend | 143 of 196 bends at 24 sit exactly on `bendMin`; no bend anywhere is below the minimum for the weight it is drawn at; 1,094 of 1,094 obey it (corners §11a-6: do not reopen tier 3) | docs/audit/findings-primitives.md:995 · docs/audit/findings-corners.md:779 |
| The chevron | 36 concepts collapse to 9 shapes at every master in both styles; every declared shift within 0.16 of the sheet's measure, every size variant within 0.01, every filled twin equal to its outline | docs/audit/findings-primitives.md:997 · docs/audit/findings-optical.md:597 |
| ⇄ C14's per-master scaling | 81 of 90 outline files at 20 and 16 within 0.05 of what scaling by ink height gives, all 72 chevron tests within 0.007. The misses: card 1.13 counts 8 `alert-triangle` outline files (4 concepts × 2 masters); card 1.14's sentence says "four files", counting concepts | docs/audit/rule-register.md:102 · docs/audit/exceptions-ledger.md:759 · plans/set-and-rules-audit.md "C14's per-master shift scaling has broken down" |
| The arrowhead | one head in 21 concepts at 24 outline, 20 at 20, 19 at 24 filled | docs/audit/findings-primitives.md:999 |
| The page | two drawings, both shared exactly, fold notch included, residual 0 at every master | docs/audit/findings-primitives.md:1000 |
| The arrow is the best-reused object | 16 of 33 classes shared by two or more concepts at 24, 19 of 34 at 16 — reuse improves at the small master | docs/audit/findings-primitives.md:1003-1004 |
| ⇄ 20 and 16 are drawn masters, not resizes | 96.2% of non-trivial parts redrawn 24→20 and 95.0% 24→16 (card 1.1); 16 of 970 drawings are a resize after the best uniform fit (card 1.4) against 1 of 970 by card 2.1's instrument — two definitions, one answer (Fluent T6: "do not scale icons" confirms it) | docs/audit/findings-primitives.md:1005 · docs/audit/references-field.md:525 |
| The through grammar | exactly 1.500 at the contact in 7 of 18 and 1.505 / 1.578 in 6 more, filled twins the same | docs/audit/findings-grammar.md:574 |
| The speaker, the pencil tip, the stack offset, the bound | the speaker 7 of 7, residual 0; the pencil tip one coordinate string in 5 + 2 files per master; the stack offset 3 · 3 · 3 in 9 of 12 stacks; 47 composites, smallest "to bound" 0 | docs/audit/findings-grammar.md:576-581 |
| The figure arrangements and `volume` | the arrangement word fixes the box in 16 of 16; the speaker is identical and in place in 30 of 30 anchored cells, one wave costs 5 · 4 · 3.5 | docs/audit/findings-families.md:568-569 |
| Keylines, radius tiers, pair progressions | 280 of 287 keyline-held concepts exact to within 0.005; 89 of 89 container-radius concepts go 2.5 → 2 → 1.5; 481 of 485 concepts have identical progressions in both styles | docs/audit/findings-scaling.md:21-25 |
| The stroke is level at 16 | ink ÷ (line length × stroke) is 1.01 in the median drawing; only 8 of 485 fall below 0.90 | docs/audit/findings-mass.md:19 |
| Outer edges land | 370 of 485 outlines (76%) have all four outer ink edges on pixel lines; 276 of 288 silhouette-keyline icons (96%) | docs/audit/findings-grid.md:27 |
| The angle discipline | 82.49% of straight segments sit exactly on 0/45/90 | docs/audit/findings-angles.md:650 |
| The pair box and `grows:` | 1,455 pairs; 18 concepts / 54 pairs differ, every one declared, none stale, all agreeing with the drawings to 0.011; `grows:` is the model note; the 8 filled files byte-identical to their outline at 24 and 20 are not an escape | docs/audit/rule-register.md:150 · docs/audit/exceptions-ledger.md:715 · plans/set-and-rules-audit.md "filled files are byte-identical to their outline twin" |
| Four errors could be promoted today | sev §4.2's four promotions — the pair box, every icon ships as a pair, the size step, a size with no default — fire on zero drawings at the pin | docs/audit/severity-proposal.md:88-96 |
| Nothing is silently under the gap floor | of the 188 readings below 1.5, every one is a warning (74), a declared note holding its lowered floor (66) or inside lint's tolerance (48); zero hidden by a filter | docs/audit/findings-air.md:818 |
| The 62 warnings are known | the 12 `sort-alpha-*` / `sort-numeric-*` names (60 drawings) plus `trash` at 20 and 16 | plans/set-and-rules-audit.md "Lint baseline at the pin" |
| The ink box and geometric bearings | all 2,910 entries within 0.0101 of the exact drawing, half-stroke and round caps included | docs/audit/findings-metrics.md:37-38 |
| Polaris and D23 | the catalogue on disk equals the live page; all eight D23 revisions read the same on the live page as on the archive; the four additions are already drawn | docs/audit/references-polaris.md:493 · docs/audit/references-polaris.md:518 |

---

## 16. Proposal index

Every proposal id a card has made, and the rows it answers. The checker requires this table to be
the exact inverse of the rows' proposals cells, so an id named in a row is listed here with that row
and nowhere else. Rows marked ⇄ carry two figures; the id's own card holds the recommendation.

| id | made by | answers |
|---|---|---|
| R-1 | ledger §4 | R-F4-01 · R-F7-01 · R-F7-02 · R-F7-03 · R-F7-15 |
| R-2 | ledger §4 | R-F2-25 |
| R-3 | ledger §4 | R-F2-25 · R-F6-08 |
| R-4 | ledger §4 | R-F2-17 · R-F2-18 · R-F2-19 · R-F2-36 |
| R-5 | ledger §4 | R-F8-04 · R-F8-13 · R-F8-14 · R-F8-29 |
| R-6 | ledger §4 | R-F2-10 |
| R-7 | ledger §4 | R-F4-04 · R-F8-01 · R-F8-28 · R-F9-04 · R-X-03 · R-X-41 |
| R-8 | ledger §4 | R-F4-02 · R-F4-05 · R-F4-06 · R-F4-08 · R-F4-10 · R-F4-22 |
| R-9 | ledger §4 | R-F8-12 · R-F8-21 · R-F13-25 |
| R-10 | ledger §4 | R-F2-05 |
| metrics F1 | metrics §9 | R-F12-01 · R-F12-10 |
| metrics F2 | metrics §9 | R-F12-05 |
| metrics F3 | metrics §9 | R-F12-02 · R-F12-09 · R-F12-13 |
| metrics F4 | metrics §9 | R-F12-14 |
| metrics F5 | metrics §9 | R-F2-09 · R-F12-08 · R-F12-15 |
| metrics F6 | metrics §9 | R-F12-03 · R-X-32 |
| metrics F7 | metrics §9 | R-F12-06 · R-F12-17 |
| metrics F8 | metrics §9 | R-F12-04 · R-F12-07 |
| P1 | grammar §5 | R-F5-02 · R-F5-04 · R-F5-05 · R-F5-06 · R-F5-10 · R-F5-12 |
| P2 | grammar §5 | R-F5-09 · R-F5-12 |
| P3 | grammar §5 | R-F5-09 · R-F5-11 |
| P4 | grammar §5 | R-F4-03 |
| P5 | grammar §5 | R-X-07 |
| P6 | grammar §5 | R-X-05 · R-X-11 |
| P7 | grammar §5 | R-F3-01 · R-F3-04 |
| P8 | grammar §5 | R-F5-03 |
| PL-1 | Polaris §8 | the D23 revisions — no deviation row; see §15 (Polaris and D23) |
| PL-2 | Polaris §8 | the D23 revisions — no deviation row; see §15 (Polaris and D23) |
| PL-3 | Polaris §8 | the D23 revisions — no deviation row; see §15 (Polaris and D23) |
| PL-4 | Polaris §8 | R-X-35 · R-X-36 · R-X-48 |
| PL-5 | Polaris §8 | R-X-34 · R-X-35 · R-X-48 |
| PL-6 | Polaris §8 | R-X-08 |
| PL-7 | Polaris §8 | R-F5-10 |
| PL-8 | Polaris §8 | R-X-07 |
| PL-9 | Polaris §8 | R-X-20 |
| OC-1 | optical | R-F2-10 · R-X-31 |
| OC-2 | optical | R-F2-05 · R-F2-20 |
| OC-3 | optical | R-F2-21 |
| OC-4 | optical | R-F2-08 · R-F2-09 |
| OC-5 | optical | R-F12-12 |
| OC-6 | optical | R-F2-35 |
| OC-7 | optical | R-F2-11 |
| FM-1 | families §9 | R-X-04 · R-X-14 |
| FM-2 | families §9 | R-X-01 · R-X-40 |
| FM-3 | families §9 | R-X-39 |
| FM-4 | families §9 | R-X-15 |
| FM-5 | families §9 | R-F2-26 |
| FM-6 | families §9 | R-X-06 · R-X-12 |
| FM-7 | families §9 | R-X-38 |
| FD-1 | field §8 | R-F10-03 |
| FD-2 | field §8 | no deviation row — a scope decision (publish the rules) |
| FD-3 | field §8 | R-F11-02 · R-F11-03 · R-F11-04 |
| FD-4 | field §8 | no deviation row — names for the severity grades |
| FD-5 | field §8 | no deviation row — a lab surface for the 20 |
| FD-6 | field §8 | R-X-53 |
| sev §2 | severity | R-X-03 · R-X-10 · R-X-41 |
| sev §4.2 row 1 | severity | R-F13-12 |
| sev §4.2 row 2 | severity | no deviation row — fires on zero drawings (§15) |
| sev §4.2 row 3 | severity | no deviation row — fires on zero drawings (§15) |
| sev §4.2 row 4 | severity | no deviation row — fires on zero drawings (§15) |
| sev §4.3 row 1 | severity | R-F8-03 · R-F8-07 · R-F13-25 |
| sev §4.3 row 2 | severity | R-F2-07 |
| sev §4.3 row 3 | severity | R-F2-06 |
| sev §4.3 row 4 | severity | R-F2-08 · R-F2-09 |
| sev §4.3 row 5 | severity | no deviation row — the mark ceiling stays a warning |
| sev §4.4 row 1 | severity | R-F2-08 · R-F2-09 |
| sev §4.4 row 2 | severity | R-F2-06 |
| sev §4.4 row 3 | severity | R-F2-13 · R-F2-14 · R-F2-15 |
| sev §4.4 row 4 | severity | R-F7-02 · R-F7-15 |
| sev §4.4 row 5 | severity | R-F8-01 · R-F9-04 |
| sev §4.4 row 6 | severity | R-X-13 |
| sev §4.4 row 7 | severity | R-F5-04 |
| sev §4.5 row 1 | severity | R-F7-03 |
| sev §4.5 row 2 | severity | R-F7-02 |
| sev §4.5 row 3 | severity | R-F2-10 |
| sev §5 row 1 | severity | R-F7-02 |
| sev §5 row 2 | severity | R-F2-10 |
| sev §5 row 3 | severity | R-F6-03 |
| sev §5 row 4 | severity | R-X-29 |
| sev §5 row 5 | severity | R-X-29 |
| sev §5 row 6 | severity | R-X-29 |
| sev §5 row 7 | severity | R-F8-29 |
| sev §6 | severity | R-X-41 · R-X-44 |
| sev §6b | severity | R-F8-02 |
| sev §7-1 | severity | R-X-03 · R-X-10 |
| sev §7-2 | severity | R-F13-12 |
| sev §7-3 | severity | R-F6-03 |
| sev §7-4 | severity | R-X-44 |
| sev §7-4b | severity | R-F8-02 |
| sev §7-5 | severity | R-F7-02 · R-F7-03 |
| sev §7-6 | severity | R-F2-10 |
| sev §7-7 | severity | no row of its own — leave the floor, bends, keylines and centring as warnings until §4.4 is decided |
| angles §7a-1 | angles §7a | R-F4-09 |
| angles §7a-2 | angles §7a | R-F6-04 |
| angles §7a-3 | angles §7a | R-F4-11 · R-F4-15 · R-F4-16 |
| angles §7a-4 | angles §7a | R-F4-02 |
| angles §7a-5 | angles §7a | R-F4-04 · R-F4-13 · R-F8-01 |
| angles §7a-6 | angles §7a | R-F4-12 · R-F4-23 |
| angles §7a-7 | angles §7a | R-F13-05 · R-F13-06 |
| angles §7a-8 | angles §7a | R-F4-08 |
| corners §11a-1 | corners §11a | R-F2-03 · R-F2-12 · R-F2-13 · R-F2-15 |
| corners §11a-2 | corners §11a | R-F2-13 |
| corners §11a-3 | corners §11a | R-F2-14 |
| corners §11a-4 | corners §11a | R-F2-27 · R-F2-28 |
| corners §11a-5 | corners §11a | R-F2-02 |
| corners §11a-6 | corners §11a | no deviation row — do not reopen tier 3 (§15, the outline mark bend) |
| primitives item 1 | primitives, judged list | R-F3-01 |
| primitives item 2 | primitives, judged list | R-F13-15 |
| primitives item 3 | primitives, judged list | R-X-13 |
| primitives item 4 | primitives, judged list | R-X-06 |
| primitives item 5 | primitives, judged list | R-F4-14 · R-F4-24 |
| primitives item 6 | primitives, judged list | R-F4-01 |
| primitives item 8 | primitives, judged list | R-F4-17 |
| primitives item 12 | primitives, judged list | R-X-05 |
| primitive-drift check 1 | primitives §8 | R-F3-01 |
| primitive-drift check 2 | primitives §8 | R-F3-07 |
| primitive-drift check 2b | primitives §8 | R-F4-18 |
| primitive-drift check 3 | primitives §8 | no deviation row — a set-wide check for circle radii that nearly match (CLAUDE.md open item 5) |
| primitive-drift check 4 | primitives §8 | R-F4-01 |
| Fluent T1 | Fluent, takes | R-F13-34 |
| Fluent T2 | Fluent, takes | R-F8-11 · R-F13-18 · R-F13-31 · R-F13-34 |
| Fluent T3 | Fluent, takes | R-F2-12 · R-F2-13 |
| Fluent T4 | Fluent, takes | R-F5-04 · R-F5-10 |
| Fluent T5 | Fluent, takes | R-F5-04 · R-F5-10 |
| Fluent T6 | Fluent, takes | no deviation row — confirms the 20 and 16 are masters (§15) |
| SF T1 | SF Symbols, takes | no deviation row — a base map kept as data; an F4 axis gap, not a finding |
| SF T2 | SF Symbols, takes | no deviation row — derive the base relation from the name; an F4 axis gap |
| SF T3 | SF Symbols, takes | R-F3-01 · R-F3-04 · R-F4-03 · R-F4-18 |
| SF T4 | SF Symbols, takes | R-F5-03 · R-F5-10 |
| SF T5 | SF Symbols, takes | R-F5-07 · R-F5-11 |
| SF T6 | SF Symbols, takes | R-F13-17 · R-F13-19 · R-F13-28 · R-F13-33 |
| SF T7 | SF Symbols, takes | R-F13-01 · R-F13-09 · R-F13-10 · R-F13-11 |
| SF T8 | SF Symbols, takes | R-X-02 · R-X-06 · R-X-12 |
| Nucleo T1 | Nucleo, takes | R-F6-05 · R-F6-06 · R-F8-23 |
| Nucleo T2 | Nucleo, takes | no deviation row — compare ink in bands, a measuring method |
| Nucleo T3 | Nucleo, takes | R-F8-07 · R-F8-23 |
| Nucleo T4 | Nucleo, takes | R-F2-13 · R-F2-15 · R-F2-16 |
| Nucleo T5 | Nucleo, takes | no deviation row — keyline measured from the set; confirms ours |
| Nucleo T6 | Nucleo, takes | R-F11-02 · R-F11-05 |
| Nucleo T7 | Nucleo, takes | no deviation row — a note on measurement design |
| Central take | Central, take | no deviation row — a table format for a parameter change (card 3.3) |
| Untitled take | Untitled, take | R-F13-02 · R-F13-06 · R-F13-14 · R-F13-15 |

**Finding labels card 3.1 cites as if they were proposals** (`docs/audit/judging-standard.md:144`
calls them "proposal ids"). Each names one finding, and each is one row here:

| label | card | row |
|---|---|---|
| M-1 … M-8 | mass (1.5) | M-1 R-F1-03 · M-2 R-F1-02 · M-3 R-F1-06 · M-4 R-F11-04 · M-5 R-F1-05 · M-6 R-F1-04 · M-7 R-F1-01 · M-8 R-F10-02 |
| G-1 … G-9 | grid (1.6) | G-1 R-F7-06 · G-2 R-F7-10 · G-3 R-F7-08 · G-4 R-F7-07 · G-5 R-F7-13 and R-X-49 · G-6 R-F7-12 · G-7 R-F7-09 · G-8 R-F7-05 · G-9 R-F7-11 |
| S1 … S5 | scaling (1.4) | S1 R-F6-01 · S2 R-F2-22 · S3 R-F2-14 · S4 R-F6-02 · S5 R-F2-17 |

**Five decisions that expire at launch** (the plan's RESUME block, "Five decisions that expire at
launch"): `help` → `help-circle` (R-X-07), `login`'s numbering (R-X-05 / R-X-11), the badge zone
(R-F5-10), `checkbox`'s numbers (R-X-04) and the `trash` / `check-circle` gaps (R-X-39). All are
free today.

---

## 17. Handover

| finding | belongs to |
|---|---|
| Every row, ranked by the drawings column, with docs/09 §6's six pending rulings folded in | **5.2** the decision agenda |
| The ⇄ rows — two figures, two definitions, no pick — and the three not-adjudicated rows (R-F13-09 … -11) | **5.1** the fresh reviewer, **5.2** |
| The kind (3) rows with no instrument (F10, R-F2-24, R-F2-35, R-F8-26, R-F8-33, R-F13-31) | **4.4** the eye-only list; **4.1** the wall |
| The stale-statement roll-ups (R-X-24 … R-X-28, R-X-47) and every "card 1.16" proposal cell | **1.16**'s list as Maruti rules on it |
| The reclassifications in §0 (card kinds read by the plan's definitions) | each measuring card's author, if disputed |
| The instrument rows (R-X-30, R-X-31, R-X-49 … R-X-52) | the plan's "Known instrument defects" (main session) |
| `[needs checking]` — card 1.1's "80 files" (R-F4-01), the SF pair count (R-X-17), Nucleo's 0.82 (R-F8-18) | the measuring card |

## 18. How to reprint

| what | command |
|---|---|
| every citation, number, kind, cell and index entry in this document | `node tools/audit/register-check.mjs docs/audit/findings-register.md` — prints `rows · citations · index · failures`, the row counts by kind and by section, and the rows ranked by drawings (top five); exits 1 on any failure |
| the same, against the cited documents as they stood at a commit | `… --at <commit>` — reads every cited file with `git show <commit>:<path>`; use it once the cited documents have moved on |
| the full ranking, and the rows on the every-drawing line | `… --rank 70` |
| the same as JSON | `… --json` |
| the tests | `node --test tools/audit/register-check.test.mjs` — synthetic fixtures only; no test reads the shipped register or any real document, so a later edit to the plan cannot turn the suite red |
| any figure in a row | the row's `sources` cell names the document and line; that document's own "How to reprint" names the tool command |

Nothing here is measured afresh. A number no document holds is written `[needs measuring]`;
three figures carry their card's `[needs checking]` (R-F4-01, R-F8-18, R-X-17).

## 19. What changed in this revision

The first draft was checked by a fresh reviewer (52 corrections in eight passes, each re-read against
its source); this revision applies them. In short: wrong facts fixed in place (among them R-F2-10's
probe, R-F2-21's "recorded nowhere", R-F7-14's quarter grid, R-F12-01's two `paintbrush-4` entries,
R-F2-18's pre-pin 57, R-F9-04's lint message, R-F3-01's pairs, R-F4-01's concepts, R-F4-03's heads,
R-F7-01's folders, R-F5-04's "badge", R-X-13's aliases, R-X-24's sheet at the pin); the filled-corner
rows R-F13-09 … -11 taken out of kind (1) (§0); every "drawings touched" cell split into a reach in
the card's unit and a drawings count, the set-size figures replaced by the cards' own counts or
`[needs measuring]`, and the headline five recomputed from the drawings column; one scope rule
applied to every row; the kinds and second rows of §0; both figures carried on every ⇄ row the
reviewer named; 37 rows added (A8's unbuilt shipped format R-X-42, the lint holes R-X-43, R-F8-29,
R-F8-31, R-F8-32, the process gate R-X-44, the hard-coded masters R-X-45, the icon skill R-X-46, the
stale statements R-X-47, the Polaris counts R-X-48, the instruments R-X-49 … R-X-52, the field's
R-X-53, and in the axes R-F2-32 … R-F2-36, R-F3-07, R-F4-21 … R-F4-24, R-F6-10, R-F7-15, R-F8-28 …
R-F8-33, R-F9-10, R-F12-16, R-F12-17, R-F13-32 … R-F13-35); §16 rebuilt as the checked inverse of the
proposals cells, with the reference cards' takes added; and the checker's suite cut loose from every
real document's line positions. The closing check then moved the whole-set rows (R-F8-07, R-X-10 and
ten more) off the ranking onto an "every drawing" line, counted each two-kind finding once (`see
R-…`), refiled R-F4-07 and R-F4-21 as kind (2), and corrected R-X-48, R-F13-35, R-F2-32, R-F4-22,
R-F12-06, R-F12-16, R-F12-17, R-F2-07, R-X-53 and the drawings counts of R-F1-05, R-F7-04, R-X-32 and
R-F13-34.

## Gate

- `node tools/lint.mjs | tail -1` → `2910 drawings · 2848 clean · 62 warned · 0 failed`,
  byte-identical to the capture taken before this revision's first read.
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → 752 tests · 752 pass · 0 fail ·
  0 skipped at the last run (others were adding theirs in parallel; 28 are this card's, all on
  synthetic fixtures).
- `node tools/audit/register-check.mjs docs/audit/findings-register.md` → `rows 293 (263 in 34 kind
  tables, 30 elsewhere) · citations 630 · index 142 · failures 0`, in the working tree and with
  `--at HEAD` (`da9d788`); with eight lines inserted above the plan's reconcile list it still reads
  0 failures (the first draft's check read 21).
- `shasum lab/manifest.json` → `161c9314cdf8…`, unchanged.
- Files: `docs/audit/findings-register.md`, `tools/audit/register-check.mjs`,
  `tools/audit/register-check.test.mjs`.

---

*Written for card 3.2 of `plans/set-and-rules-audit.md`. Companions: the audit documents it cites;
`docs/audit/rule-register.md` (the rules), `docs/audit/exceptions-ledger.md` (the notes),
`docs/audit/severity-proposal.md` (what should block).*
