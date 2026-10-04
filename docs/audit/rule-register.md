# The rule register — card 1.14

Every rule in the system: where it is stated, **what it was derived from and from how many
drawings**, whether it still holds at 485 concepts, what it contradicts, what it is silent about.

**Pinned to `5933041` (2026-10-04): 485 concepts · 2,910 drawings.** Lint at the pin: 2,910 · 2,848
clean · 62 warned · 0 failed. Every number was measured this session or carries a `path:line`.
Nothing was edited.

**The note census at the pin**, since half the register depends on it. Files carrying each declared
note, and the concepts they cover: `tags:` 2,808 / 468 · `keyline: mark` 816 / 136 · `box:` 338 / 57
· `optical:` 270 / 45 · `glyph:` 96 / 16 (90 files `dot` on 15 concepts, 6 files `numeral` on
`list-ordered` alone) · `grows:` 54 / 18 · `anchor:` 30 / 5 · `gap:` 10 / 6. **212 of 485 concepts
carry at least one note other than `tags:`; 273 carry none.** The three keyline opt-outs
(`keyline: mark`, `box:`, `anchor:`) are mutually exclusive — lint errors on any pair — but the
others co-occur freely: `keyline: mark` + `optical:` on 39 concepts, + `grows:` on 18,
`box:` + `optical:` + `glyph: dot` on 4, `box:` + `gap:` on 3.

**How to read it.** Each group is a table of five columns — the rule, every place it is stated, its
derivation, whether it holds, and its kind — followed by *Conflicts and silences*, which names only
the rules that have one. A rule with nothing to say there is not listed again.

**Kind.** **P** = principle: derived from many drawings, a survey or a measured scan, and holds
across the set. **1→** = one icon promoted: derived from one drawing or a single board. The
distinction is the point of this card, so the derivation column always says which drawings.

---

## The two facts that frame everything below

**1. The constitution was written before any icon existed.** The repository's first commit is
`b226ad9`, dated **2026-09-17**. C1 (round caps), C2 (refined not comical), C6 (three masters
24·20·16) and C7's original stroke decision are all dated **2026-09-16** — one day earlier.
`git rev-list -1 --before="2026-09-16 23:59:59"` returns nothing. The canvas, the masters, the
keylines, the stroke and the character were chosen from **zero drawings**.

That is not a criticism — somebody has to choose first. It is the reason the derivation column
matters: those four rules have had 2,910 drawings of evidence since and have never been re-derived
against them, except C7, which was (2026-09-20, and amended).

**2. Eleven of the thirty C-rows were decided on the set's first day, when five sixths of it was a
directional mark.** C8 through C18 are all dated **2026-09-17**. Measured composition of
`src/icons/24` at the last commit of each decision day:

| | concepts | `keyline: mark` | agreed `box:` | held to a silhouette keyline |
|---|---|---|---|---|
| 2026-09-17 — C8…C18 decided | 93 | **77 (83%)** | 0 | 16 |
| 2026-09-19 — docs/09 measured here | 114 | 77 (68%) | 0 | 37 |
| 2026-09-20 — C7 amended | 190 | 84 (44%) | 12 | 94 |
| **2026-10-04 — the pin** | **485** | **136 (28%)** | **57** | **292** |

The set's composition has **inverted**. `docs/09:61` put it in one line — *"the rules were derived
from 106 marks and circles and then stretched onto containers"* — and named the five rules that
were missing: container corner radius · detail budget per master · one filled-cut policy · how a
mark's share of its container holds from 24 to 16 · the modifier zone.

**docs/09's recommendation was to pause the queue for a stress batch of ten hard containers —
`calendar`, `user`, `gear`, `bell`, `lock`, `mail`, `image`, `home`, `eye`, `chart-bar` — settle
the five, then resume. All ten shipped. None of the five was written.** Verified at the pin: each
of the ten has a file in `src/icons/24/`; `docs/07:76` still lists container radius under **Open**;
`docs/01:317-318` still says the radii at 20 and 16 will be *"recorded here once they settle"* and
records none.

That is the register's headline. Everything below is detail.

---

## A — The artefact: what a file is

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| A1 | Three drawn masters, 24 · 20 · 16, each hand-drawn on its own canvas, not scaled | `CLAUDE.md:187`, `docs/01:9-11`, `docs/07:46` (C6), `masters.mjs:30-46` | **0 drawings** — user direction 2026-09-16, before the first commit. C6 adds *"the 20 and 16 keylines are proposals until the first icons are approved"* | holds, and the proviso has expired (485 approved at all three) | P |
| A2 | `viewBox` equals the master's canvas | `docs/01:394`, `lint.mjs:33` | the canvas decision | holds — error | P |
| A3 | The root attribute set is fixed: `fill="none"`, `stroke="currentColor"`, round cap and join, the master's weight, no `width`/`height` | `docs/01:384-397`, `lint.mjs:31-39` | 0 drawings; the file form was specified with the foundations | holds — error, and the one rule that is genuinely airtight | P |
| A4 | Stroke attributes on the root, never on a path | `docs/01:397`, `lint.mjs:281` | as A3 | holds — error | P |
| A5 | `<path>` only: no `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `use`, `defs`, `style` | `docs/01:401-403`, `lint.mjs:41` | *"so the linter has one thing to parse"* — a tooling argument, 0 drawings | holds — error. `CLAUDE.md:230` open item 4 proposes relaxing it; `docs/09:55` says close the item (files are generated now) | P |
| A6 | No `transform`, `id`, `class`, `style`, `fill-rule`, `clip-path`, `opacity` | `docs/01:398`, `lint.mjs:42` | as A5 | holds — error, with one carve-out: the area path form `fill="currentColor" fill-rule="evenodd" stroke="none"` (`lint.mjs:40`) | P |
| A7 | One path per discrete stroke run, **container first, details after** | `docs/01:399-400` | 0 drawings | **unverified** — and `lint.mjs:332-335` depends on it to split container from inner mark | P |
| A8 | Shipped format: **outlined fills only**; the stroked source stays private | `CLAUDE.md:183` | the business model (we do not control render size) | **not built.** No outliner, no package, no export; `dist/icons.json` carries stroked paths. On record `docs/09:44` | P |
| A9 | Every icon ships as outline + filled, drawn in one sitting and approved as a pair | `CLAUDE.md:184`, `docs/03:74-75`, `docs/07:53` | user decision 2026-09-17, at 93 concepts | holds — 1,455 pairs, 0 missing twins. Warning only (`lint.mjs:185`) | P |
| A10 | Sizes × styles is a full grid: no gaps | `docs/07:53` (C13) | user decision 2026-09-17, reasoned from product use (*"a style is chosen product-wide, a size per placement"*) — **0 drawings of evidence** | holds as far as checked; nothing checks that every decided size exists | P |

**Conflicts and silences.** A5/A6 are the only rules in the system that are both completely stated
and completely enforced. A7 is the opposite shape: stated, unenforced, and silently relied on by a
check — list the mark first and C8's container comparison reads the wrong boxes with no complaint.
A8 is the one rule whose non-existence the customer would see first: everything the project calls
"shipped format" is unwritten code.

---

## B — Size, keyline and placement

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| B1 | Canvas 24; margin 2 at 24 and 20, 1 at 16; **there is no live area** — the largest keyline *is* the drawing bound | `docs/01:30-51`, `:98`, `masters.mjs:32-44` | 0 drawings. Calibrated against four published sets' canvas-to-keyline ratios (`docs/01:56-61`) — a reference *ratio*, not our drawings | holds — margin crossing is an error | P |
| B2 | Six keylines per master: square, circle, portrait, landscape, diagonal, mark | `docs/01:78-97`, `masters.mjs:33,38,43` | 0 drawings; the circle/square pre-correction is a classical argument, not measured here | holds for the 287 concepts held to one. `diagonal` is **unused** (`docs/09:55` says remove it) | P |
| B3 | Nothing crosses 22 except a modifier badge | `docs/01:68-70` | Fluent's badge running to 23 of 24 — **one reference observation, zero of our drawings** | **untested** — zero badge composites ship | 1→ |
| B4 | A directional mark opts out of the silhouette keylines with `<!-- keyline: mark -->` and answers only to the mark ceiling and centring | `docs/01:105-115`, `masters.mjs:56-57`, `lint.mjs:322-338` | the 77 marks shipped on day one | holds — **136 concepts / 816 files** at the pin | P |
| B5 | An icon whose proportion is settled by eye may declare its own ink box, `<!-- box: WxH -->`, held to 0.01 as an error | `docs/01:117-130`, `lint.mjs:65-70,339-350` | **one icon** — `folder`, 2026-09-20, because the landscape keyline drifts 1.25 → 1.33 → 1.4 wide-to-tall as the masters shrink | **57 concepts / 338 files.** The mechanism outgrew its derivation by 57× and the underlying keyline drift (`docs/09:46`) was never fixed | 1→ |
| B6 | A level family's members declare `<!-- anchor: NAME -->` and keep the full member's canvas position | `docs/01:132-140`, `docs/07:68` (C28), `lint.mjs:567-615` | **one family** — `volume`, 2026-09-26, after a measured survey of nine libraries (`research/references/volume-levels/`) | 5 concepts / 30 files. Derivation is strong (nine sets), application is one family | 1→ |
| B7 | A bent mark's outline ink is centred to **2 dp, no tolerance**; its filled ink box equals the outline's to 2 dp | `docs/07:50` (C10), `:52` (C12), `CLAUDE.md:208` | the check and chevron families, 2026-09-17 | **not enforced** — `lint.mjs:361` allows ±0.5. `docs/09:40` flagged it in September; still ±0.5 | P |
| B8 | An open pointing mark moves toward its point by a per-shape anchor picked by eye at 24, scaled to other masters by ink height | `docs/07:54` (C14), `CLAUDE.md:210` | chevron down / up / left / right — **three shapes, one family**, judged 2026-09-17 on a position sheet in five UI contexts. Checks and arrows were measured and deliberately left box-centred | **45 concepts / 270 files, 94 distinct pairs — and the scaling claim HOLDS.** Tested against `shift24 × (ink extent at that master ÷ ink extent at 24)`: **81 of 90 outline files at 20 and 16 match within 0.05**, 80 within 0.02, and all 72 chevron tests within **0.007**. The nine misses are the four `alert-triangle` files at 20 and 16 (declared a constant −0.5; predicted −0.395 and −0.342) and `info-2` at 16 (declared −0.39, predicted −0.315). Every filled twin repeats its outline's value exactly | 1→ |
| B9 | How a shift is decided: measure (end triangle × 0.5), judge each shape on its own range, always on the optical sheet, the eye decides, balanced against all four edges on the axes the shape is lopsided on | `docs/07:55` (C15), `CLAUDE.md:211-216`, `SKILL.md:130-138` | user direction 2026-09-17, written **after** a copied 0.5 and a one-grid-for-all sheet were caught. Calibrated on three chevron shapes | holds as method. Nothing verifies a shipped shift was derived this way | P |
| B10 | Size variants step 3 · 2.5 · 2 (12.5% of the canvas) at 24 · 20 · 16; `-large` may reach the margin edge | `docs/07:48` (C8), `masters.mjs:52-57`, `lint.mjs:537-556` | `plus`, `minus`, `x`, `check`, `chevron-down` — **five mark families, day one**. Replaced an earlier cap after *"large equalled the default at 16"* | holds — checked as a warning | P |
| B11 | A container's `-small`/`-large` keeps the container on its keyline and changes only the inner mark, by a clearance chosen per icon, not by `SIZE_STEP` | `docs/07:58` (C18), `docs/07:48` | `check-circle`, then `x-circle`, `plus-circle`, `minus-circle` — four containers, 2026-09-17 | holds. The inner-mark check runs on outline files only (`lint.mjs:332`) | P |
| B12 | Only the sizes with a use case ship — `check` has default + small, *"a large tick has no job"* | `docs/07:48`, `CLAUDE.md:206` | one icon's use cases, reasoned | holds; nothing checks it | P |

**Conflicts and silences.**

- **B5's mechanism has swallowed B2's rule.** 57 concepts now opt out of keyline matching with an
  agreed box, each a per-icon decision recorded only in that file. docs/01:126 is explicit that it
  *"is a decision about one icon … not a new keyline"* — but 57 of them, in 57 distinct strings, is
  a keyline system by accretion. `docs/09:46` identified the repeatable pattern underneath (the
  landscape/portrait keylines drift in proportion from 24 to 16, because each master drops the same
  4 units from both sides, while twelve reference sets hold 1.07–1.23) and said *"if `mail`, `image`
  or `card` want the same fix, that is the repeatable pattern that would justify a rule."* They did.
  No rule was written. **This is a decision Maruti owes, and it is the biggest one in group B.**
- **B5 is silent across masters and across the pair.** Measured: `microphone-5` and
  `microphone-5-filled` declare `box: 14x20` at **24 only**; their 20 and 16 fall back to the
  keyline match and nothing says the story is incoherent. Every other box note is consistent across
  all three masters and both styles (0 pair disagreements measured), so this is one-off, not
  systemic — but the silence is systemic.
- **B7 is the clearest case in the register of a rule stating no tolerance and a check inventing
  one.** `enforcement-gap.md` §2.2 has the cost measured: **164 drawings sit more than 0.01 off the
  canvas centre, 80 over 0.10, 20 over 0.25, and 8 at exactly lint's 0.50 limit** (`watch-2` at all
  three masters in both styles, `volume-off` at 16 in both).
- **B8's "94 distinct values" is not evidence against C14 — it is C14 working.** The audit plan's
  reconnaissance read 94 pairs for 45 concepts as a sign the scaling claim had broken down
  (`plans/set-and-rules-audit.md:119-124`). Measured, 81 of 90 files are exactly what scaling by ink
  height produces, and the chevrons — the family C14 was derived from — match to 0.007. **Only two
  concepts deviate**, both knowable by name: `alert-triangle` ×4 holds a constant −0.5 at every
  master instead of scaling, and `info-2` at 16 is 0.075 wide of the prediction. A two-icon
  question for card 1.11, not a systemic one. Correcting that suspicion is exactly what verifying
  rather than rediscovering is for.
- **B3 is undecided and free today.** Zero composites ship, so the badge ruling (`docs/09:38`) can
  be taken at no redraw cost. It gets dearer with every container, because `docs/05:117-120`'s one
  genuinely free optimisation is *keep the bottom-right quadrant sparse from the start* — and 485
  concepts were drawn without it.

---

## C — The line

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| C-1 | Outline stroke **1.5 · 1.5 · 1.25** (24 · 20 · 16) | `CLAUDE.md:189`, `docs/01:207-224`, `docs/07:47` (C7), `masters.mjs:10` | **Original: 0 drawings** (2026-09-16, one day before the first commit). **Amended 2026-09-20 at 190 concepts** on a blind pick plus **eight true redraws**, with the 16×16 raster, the half-tone control and the reopening test the row had set itself. The amendment is the best-derived decision in the register | holds — 827 outline files per master at the stated weight; error on any other | P |
| C-2 | Filled line weight **2.5 · 2 · 2** for a line-heavy icon; every other icon fills its shapes and keeps the **outline** weight for leftover lines | `CLAUDE.md:184`, `docs/01:226-233`, `masters.mjs:20` | locked 2026-09-17 at 93 concepts, from a weight-share argument (*"every master lands near 10–12.5% of its canvas"*) | holds — **143 concepts line-heavy, 342 light**, the same 143 at all three masters, 0 mixed | P |
| C-3 | Round caps and joins everywhere, no exceptions | `docs/01:280-284`, `docs/07:40` (C1) | 0 drawings; *"all three references agree"* | holds — error | P |
| C-4 | A round cap reaches **weight / 2** past the path endpoint: 0.75 · 0.75 · 0.625. A 45° open end moves out 0.125 on **both** axes | `docs/01:286-304`, `CLAUDE.md:262-269`, `SKILL.md:64-67` | arithmetic, not drawings. The diagonal corollary was measured by the reviewer and `convert-16.mjs` on 2026-09-20 | holds. *"Getting this wrong by a stroke is the most common error in icon sets"* (`docs/01:295`) — and nothing checks it directly | P |
| C-5 | The filled ink box equals the outline's; an agreed difference is declared `<!-- grows: L R T B -->` and verified against both drawings | `docs/01:235-254`, `lint.mjs:159-196` | a census of **all 351 shipped pairs** on the day the check landed (2026-09-20): 33 differed, **0 unexplained** | **holds, and docs/09:40's open item is closed.** 1,455 pairs; **18 concepts / 54 pairs differ, every one declared, none stale, all agreeing with the drawings to 0.011**; lint prints 54 "agreed growth" notes, 0 "ink box differs" warnings and 0 missing twins. Seven of the 18 are new since docs/09 (`chart-bar`, `filter-2`, `grid-3`, `grid-4`, `list-bullet`, `list-bullet-2`, `text-2`) | P |
| C-6 | Repeated elements (dots, menu lines, grids) are spaced by their **own thickness** and thicken **in place** when filled | `docs/07:57` (C17), `CLAUDE.md:184` | `menu` ×6 and the `more` dots — **one family plus two icons**, 2026-09-17, from boards of spacings | holds for those. Extended by a dated note 2026-09-20 (at 16 the lines keep their 1.5-era centrelines, so the air is 3.25 / 4.75 / 6.25, *not* this row's 3 / 4.5 / 6) | 1→ |
| C-7 | **No weight axis.** Opinionated defaults; customers do not adjust the stroke | `CLAUDE.md:186` | a product decision | holds. **It invalidates `docs/03:34-37`'s justification for the gap floor** — see F1 | P |
| C-8 | The filled style may taper a grip where the outline stays monoline; **the two ends are the rule, the flare rate is not** | `docs/07:60` (C20) | **one icon** — `search`, 2026-09-18, from four filled treatments measured for mass | one icon. Scoped honestly in the row itself | 1→ |

**Conflicts and silences.**

- **C-1's evidence sentence cites a figure that is wrong.** `docs/07:47` says *"Fluent uses 1.5 at
  12, 16, 20, 24 and 28 — exactly as we do … which puts the largest deployed set on our side of the
  fork"*, citing `research/references/fluent-guidelines.md`'s stroke table; `docs/08:375` repeats it
  as *"Fluent agrees with us."* Our reference file records a **single** stroke row where Fluent's
  own table has **two columns** (Regular and Filled) — our row is a column slip. **C-1's conclusion
  survives** (it was re-derived on Maruti's blind pick over eight redraws, and the canvas-share
  ratio it turned on holds), but the citation is false and points the wrong way. Card 2.1 has since
  calibrated Fluent's Regular ladder from its shipped geometry — **1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5**
  at 12 · 16 · 20 · 24 · 28 · 32 · 48, with Filled exactly +0.5 at every size
  (`docs/audit/references-fluent.md:87-101`). **At 16 Fluent draws 1.0, 6.25% of its canvas, where
  we draw 1.25, 7.81%** — so the largest deployed set is on the *other* side of the fork C7 named
  for itself. Logged in `stale-statements.md` §1.1; the C7 row and docs/08 §6.2 and §8 need the
  sentence replaced, not the decision.
- **C-5 is the one rule in the register whose check is stricter than its prose and right to be.**
  docs/01:253-254's census is the derivation; the check that enforces it treats a note the drawings
  contradict as an **error**. That pattern — *a declared deviation held to its own number* — is the
  best mechanism in the system and the model for everything in `severity-proposal.md`.
- **C-6's own numbers were superseded by a dated note inside the same row.** A reader who takes
  C17's "gap 3 / 4.5 / 6" at face value will draw the 16 master wrong. The row says so, 400 words
  in.

---

## D — The grid

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| D1 | Quarter grid at 24 and 20, **eighth grid at 16**; derived from the master's stroke so it flips with it | `docs/01:156-172`, `CLAUDE.md:271`, `masters.mjs:66-84` | arithmetic: a container's outer edge lands on a whole pixel only when its centreline sits at edge ∓ stroke/2 | **the rule holds; the check is dead.** 1,967 of 2,910 drawings (67.6%) hold an off-grid coordinate — 27,029 occurrences — every one printed as "documented exception" | P |
| D2 | Maximum 2 decimal places at 24 and 20, **3 at 16** | `docs/01:187-189`, `masters.mjs:80` | as D1 | holds — error, and it fires | P |
| D3 | Container edges sit on `.25` / `.75` | `docs/01:163-164`, `CLAUDE.md:272` | as D1 | **unchecked as a distinct rule** (D1's hatch covers it) | P |
| D4 | A symmetric mark may sit on the canvas midline: *"for a mark, symmetry beats crispness"* | `docs/01:174-178` | reasoned, then measured: `docs/08:84-85` found **109 runs across 26 concepts** on the centre axis, all soft by design | holds, and `docs/08:376-380` books it as not to be chased | P |
| D5 | Anything off the grid *"requires a comment in the source file saying what it corrects"* | `docs/01:184-185`, `:376-377` | 0 drawings | **superseded in practice.** `docs/09:28`: *"Break right — declared `optical:` / `glyph:` comments replaced it. Drop the literal rule; stop lint treating any comment as a pass."* Unactioned | P |
| D6 | **Every decimal in a path carries a comment saying what it corrects** | `CLAUDE.md:272`, `docs/02:101` | 0 drawings | **no file does it, and no file ever did.** All 2,910 carry a construction description; 2,808 carry `tags:`; none annotates a decimal | P |

**Conflicts and silences.** D1 and D6 together are the largest dead letter in the rulebook, and
docs/09 called it correctly fourteen days and 2,226 drawings ago. The repair is *not* to start
annotating 27,029 numbers; it is to say what the project actually does — arcs round to the master's
ceiling, a deliberate offset is a declared note — and to make the hatch the note rather than any
comment. `enforcement-gap.md` §2.1 has the measurement; `severity-proposal.md` has the proposal.

---

## E — Corners, radii and angles

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| E1 | Container 2.5 · bend or detail 1.5 · hard corner 0, **and no value in between**: *"Three options is a system; seven is a mood"* | `docs/01:308-321`, `CLAUDE.md:275` | **"Proposed from the Refined specimens in `lab/character.html`"** — specimens, not drawings. `docs/01:316` says *"confirmed as the first containers are approved"* | **never confirmed. docs/09:23's verdict holds; its "one real break" is now about 30 concepts** — see below. docs/07:76 still lists container radius as **Open** | P (unconfirmed) |
| E2 | The radii at 20 and 16 are set per icon while drawing and *"recorded here once they settle"* | `docs/01:317-318` | — | **the doc owes the set.** Nothing is recorded; hundreds of containers have shipped. The per-icon values live scattered in C22–C29 and in file comments | P |
| E3 | A bent mark's corner is an arc of radius **half the weight**: 0.75 · 0.75 · 0.625 outline, 1.25 · 1 · 1 filled | `docs/07:50` (C10), `masters.mjs:24-28`, `CLAUDE.md:204`, `lint.mjs:364-377` | user pick 2026-09-17 from **six** candidate bends (sharp · hint · gentle · gentle even · soft · rounder), on the check and chevron families; construction studied from Central | holds as a rule. The check reads the **declared** `A` radius of a **stroke** path only, so a chamfer, a bezier corner and every corner in the 1,026 shape-filled drawings are unseen | P |
| E4 | Angles default to **0 / 45 / 90**; 30 and 60 where the subject demands, justified in the file | `docs/01:191-192` | 0 drawings | **the exception list is now the rule.** `docs/09:25` found *"44 names leave it"* at 114 concepts and verdicted *"rule sound — every default obeys it; leaving it is what makes a numbered variant"* — but two defaults already did not (`trash` 4°, `code` 73°) | P |
| E5 | The named per-icon angle grants | `docs/07:77-78`, `docs/07:70` (C30), `docs/09:25` | **one icon or one family each**, every grant dated and scoped by name | ~20 grants covering roughly 50 concepts, at angles 4°, 8.5°, 11.8°, 13.3°, 26.57°, 31.1°, 33.4°, 36.9°, 61°, 73° — **none of which is 30 or 60**. No instrument checked any of them: *"every figure here was measured by hand"* (`docs/09:25`), *"Lint does not check angles"* (`docs/01:201`, `docs/07:70`) | 1→ ×20 |
| E6 | `code`'s slash declares **its run and rise, not a degree** — *"no corollary is drawn for drawn characters as a class"* | `docs/07:70` (C30), `docs/01:194-201` | one icon, 2026-09-29, user-ruled scope *"asked directly"* | holds, and is the model for how a grant should be written | 1→ |
| E7 | `search`'s taper is drawn as the external tangents between a root circle and a tip circle | `docs/07:60` (C20) | one icon | 1→ | 1→ |
| E8 | Concentric radius: outer = inner + the distance between the shapes | `docs/08:411` — listed as a **Fluent item worth inheriting**, trigger *"first stacked shapes"* | one reference | **not adopted, and the trigger has long since fired** — stacked shapes ship throughout | — |

**Conflicts and silences.**

- **E1 is the oldest unconfirmed rule in the system and it governs the largest part of the set.**
  It was *proposed* from specimens with zero drawings and the five missing container rules all hang
  off it. `docs/07:76` has had it under **Open** since 2026-09-16 while 485 concepts shipped.
  Measured at the pin (`tools/audit/radii.mjs` over the 485 outline files at 24: 1,536 corners):
  **radii 0, 1.5 and 2.5 account for 996 corners (64.8%); adding C10's 0.75 bend makes 1,332
  (86.7%).** The residue is a real vocabulary, not noise — 1.0 on 16 concepts (the `grid` and `pin`
  families, `wand`, `camera`, `maximize`, `wallet`), 1.25 on the `files` and `wrench` families, 2.0
  on 8 corners — plus four off-quarter values that no rule allows: **0.772 (`heart`), 0.805
  (`shield`, `shield-2`), 1.727 (`wrench`, `wrench-2`)**. On the container corners themselves, the
  strict test gives 70 concepts at 24: **60 at 2.5, 5 at 1.5** (`book-4`, `book-open`, `book-open-2`,
  `building`, `building-2`) and 5 mixed within one drawing (`book`, `book-2`, `book-3` at
  [1.5, 1.5, 2, 1.5]; `lock-6` at [2.5, 5.5, 5.5, 2.5]; `wallet-3` at [2.5, 2.5, 2.5, 2]). The
  looser test gives **103 concepts at 2.5 against 30 at 1.5**. So docs/09:23's *"one real break"*
  — `trash`, confirmed at 1.5 · 1.25 · 1.0 where the family is 2.5 · 2.0 · 1.5 — **is now a
  30-concept pattern**, and three drawings mix radii inside one container. Card 1.2 owns the full
  census; the ruling is Maruti's, and it has got five times larger since docs/09 asked for it.
- **E4/E5 is the register's clearest example of one-icon-promoted at scale — and docs/09's verdict
  on it is now refuted.** The *form* of each grant is exemplary: dated, named, scoped, measured,
  never generalised (C30 refuses a corollary in so many words). The *aggregate* no longer describes
  the set. Measured (`tools/audit/angles.mjs`, 2,556 straight segments, tolerance 0.5° off the
  nearest of 0/45/90): **121 concepts at 24 carry a segment outside it (381 segments), and 157 at
  16** — docs/09:25 recorded *"44 names"* at 114 concepts. The 38 extra at 16 are 45° legs lying
  0.5–1.87° off, which is C10's conversion working as C7 describes.

  The refutation is in the defaults. docs/09:25 verdicted *"Rule sound — every **default** obeys it;
  leaving it is what makes a numbered variant. Two default exceptions: `trash`'s 4° taper and
  `code`'s 73° slash — both user picks."* Measured at the pin: **29 of the 121 are defaults** — no
  number, no size word: `alert-triangle`, `code`, `compass`, `cursor`, `cursor-click`, `gear`,
  `heart`, `italic`, `language`, `lightbulb`, `list-ordered`, `mail`, `map-pin`, `megaphone`,
  `pencil`, `play`, `send`, `shield`, `sparkle`, `star`, `thumbs-up`, `trash`, `wand`, `watch`,
  `wrench`, and the four `sort-*-ascending`/`-descending`. Of those, roughly seventeen have **no
  grant anywhere** — `compass`, `cursor`, `cursor-click`, `heart`, `italic`, `list-ordered`, `play`,
  `send`, `shield`, `star`, `thumbs-up`, `wand`, `wrench` and the four `sort-*`.

  `italic` is the sharpest case: C30 (`docs/07:70`) names it by name — *"the next drawn character —
  `italic`, a numeral, another letterform — is its own decision on its own evidence"* — and `italic`
  shipped (commit `2942846`) with no C-row and no note. The honest repair is to state the rule as
  *the set's angles are 0/45/90 plus this enumerated list*, enumerate it from the measurement, and
  give `angles.mjs` the list to hold. This is a **type-(1) finding at scale: 17 default drawings
  disagree with a stated rule, nothing checks it, and every one of them was approved by eye.**
- **E8 is a reference finding that passed the transfer test and was never taken.** Worth one line
  in the decision agenda rather than a rediscovery.

---

## F — Negative space: the rule Maruti is most suspicious of

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| F1 | **Minimum gap 1.5, a literal, at every master and in both styles** — deliberately *not* a fraction of the stroke | `docs/01:325-347`, `CLAUDE.md:189, 274`, `masters.mjs:59-64`, `SKILL.md:68-69` | see below — **the weakest derivation of any rule that governs this much of the set** | holds as the floor; all 62 warnings in the set are against it, 60 of them approved deviations. docs/09:30's one closed case is confirmed to the digit: `file-text-2` at 16 measures **1.625** | P |
| F2 | **In a filled drawing, white is a gap too**: a punched line, a band between filled parts, a notch, a shape-to-line gap all hold 1.5 — at 16 wider than the 1.25 line, *because a white line reads thinner than a drawn one* | `docs/01:332-336`, `CLAUDE.md:189`, `docs/07:62,64` dated notes, `plans/facing-gap.md` | Maruti's ruling 2026-09-28 at 440 concepts, on a plan with measurements: the first `facingGap` run found 23 warnings on 21 drawings, every one re-measured by a fresh reviewer, three redrawn the same day | **the best-derived gap decision in the system** — and the newest | P |
| F3 | **The glyph gap: 1 unit** for the inside of one character — dot to body, the character's own opening, the strip a filled knockout leaves between two parts of the same character, and a numeral's own opening | `docs/07:59` (C19), `docs/01:338-342`, `masters.mjs:86-106`, `CLAUDE.md:199` | the strongest derivation of any carve-out: a measured void ratio (44% of an 8-unit glyph at 16), a 16×16 raster test, a **scan of all 92 then-approved icons / 133 path pairs** finding 0 under 1.5 and 6 between 1.5 and 1.75 — all of them glyphs, and three reference values | holds. Extended four times (own opening 2026-09-18 · filled knockout 2026-09-20 · numerals 2026-09-26), each extension measured and dated. **16 concepts / 96 files** declare it | P |
| F4 | A per-file agreed floor, `<!-- gap: N -->`, which may only ever **lower** 1.5 and self-expires when the drawing no longer needs it | `CLAUDE.md:282`, `docs/07:79`, `lint.mjs:94-111, 230-239, 504-515` | **one icon** — `attachment-4-filled`, 2026-09-20 | **10 files / 6 concepts**, values down to 0.375 (`volume-off-filled` at 16 — a quarter of the floor). `docs/07:79` still lists only `attachment-4-filled` and the two `alert-triangle`s | 1→ |
| F5 | No enclosed shape smaller than 1.5 units across | `docs/01:350` | a corollary of F1, 0 drawings | **in code since 2026-09-18** (`selfGap`, 170° turn gate, derived and written up at `docs/08:300-310`), extended 2026-09-28 (`facingGap`). Named blind spots remain (`docs/08:340-343, 352-354`) | P |
| F6 | **No more than 3 parallel strokes in one run.** *"Four is a texture, not an icon"* | `docs/01:351` | 0 drawings | **never in code** (`docs/08:316`), and measured for the first time this session: **43 concepts hold a stack of 4 or more at 24** (40 at four; `chart-bar-5`, `file-text-2` and `files-5` at five), 39 at 20, 32 at 16. In **34 of the 43** two of the stack are opposite walls, so the interior marks are 2 or 3 — **nothing exceeds docs/09:24's reword** (*"at most 3 interior marks between walls"*), and the largest pure line run is still 3 (`menu`, `list-bullet`). But **nine stacks are neither walls-plus-marks** and the reword does not classify them: four open strokes in `attachment-2`, `attachment-4`, `chart-bar-3`, `plug-3`, `store`, `store-2`, and four closed edges in `grid`, `grid-5`, `grid-7` | P |
| F7 | When a detail cannot fit, **remove the detail** — never thin the stroke locally | `docs/01:352-354`, `CLAUDE.md:269`, `SKILL.md:69` | 0 drawings. Demonstrated since: `trash` at 16 drops to one rib (C22), `file-text` at 16 to one line (C24) | holds, and is the rule the drawings obey most visibly | P |
| F8 | A hole punched in a solid obeys a **3-unit** minimum, not 1.5 | `docs/03:60-62` | 0 drawings; written for the stroke-2 era | **broken everywhere, the break is right, and docs/09's premise is now partly refuted.** Measured cut widths: `check-circle` 1.50 at every master · `plus-circle` 2.00 / 1.75 / 1.75 · `x-circle` 2.01 / 1.76 / 1.76 · `minus-circle` 2.50 / 2.00 / 2.00. docs/09:22 said *"no cut fills in: every knock-out keeps fully clear pixels at every master"* — but **at 24 and 20 `check-circle` leaves 0 fully clear pixels** (4 at coverage ≤ 0.05) where the other three leave 8 to 28, and at 16 it leaves 4 against x 8, plus 4, minus 8. So its verdict — reword as *"a cut is never lighter than its swap partners"* and bring `check-circle` up to the medium cut — is now a **legibility** argument, not only a consistency one. Unactioned | 1→ |
| F9 | Filled cut weights: C18's medium cut 2 · 1.75 · 1.75 for the `info` family; `file-text` punches at the outline's own 1.5 — *"a number taken for this icon, not a corollary"* | `docs/07:58` (C18), `:64` (C24) | one family and one icon | `docs/09:42` measured the spread: **minus 2.5 · plus/x/glyphs 2 · checks 1.5**, *"visible between swap partners"*. One of docs/09's six pending rulings | 1→ |
| F10 | A shape bounded by strokes that meet at their ends is a **counter**, measured by the largest circle that fits inside it | `docs/07:63` (C23) | **one icon** — `file`, 2026-09-19; the pair measure demanded a chamfer 65% of the body's width | holds as a measure; *"Lint cannot see this either way"* (C23 says so). `facingGap` still excludes a wedge opening wider than ~6° | 1→ |
| F11 | Touching paths are skipped, and crossing paths are exempt | `lint.mjs:394, 401` | implementation | stated nowhere. `docs/08:355` records the cost | — |

**Conflicts and silences (beyond F1, below).**

- **Nothing says whether a filled twin may change an angle or a radius.** C10/C12 hold the ink
  *box*; measured, `trash`'s taper reads 4.23 / 4.29 / 4.00° on the filled contour against
  4.02 / 3.98 / 4.00° on the outline, and `code`'s slash 75.53 / 73.74 / 75.96° filled against
  73.14 / 72.26 / 73.18° outline. Both drawings are agreed. The silence is systemic — it is the
  same question `docs/09:45`'s 16 filled corners raise (12 concepts, 45 corners, Maruti's "leave
  it") seen from the angle side.
- **The boundary between F2 and F3 is a judgement with no test.** F2 says white holds 1.5; F3 says
  the inside of one character holds 1. Whether a given strip of disc is *inside a character* is
  exactly what a drawer decides and lint cannot: the note declares it, and the note is the whole
  check.
- **F11 is undeclared.** Two paths that cross are exempt from every gap check between them, and two
  that come within 0.1 are read as joined. Neither number is in any document.
- **`gap:` has no vocabulary for an overlap**, which is why the set's largest approved deviation is
  undeclarable (`enforcement-gap.md` §2.4).
- **No rule covers the material between two *different* holes in one filled drawing** — 0.92
  measured in `help-4-filled` at 16, named as uncovered at `docs/08:340-341` and still uncovered.

### F1's derivation, in full, because it decides the most

The floor is stated four times and derived once. What the record actually contains:

1. **`docs/03:34-37`** — the original argument: *"This only holds because §6 of the foundations
   mandates a 2-unit minimum gap … The min-gap rule is what makes the weight axis free. That is why
   it is non-negotiable."* **The weight axis was retired** (`CLAUDE.md:186`). The stated reason the
   rule is non-negotiable no longer exists, and the sentence still says "2-unit".
2. **`docs/01:325-347`** — the live argument: 1.5 is *"the smallest gap that still reads as a gap
   rather than a smudge"* at 16px. Zero drawings cited.
3. **`docs/08:107-120`** — the only measurement. And it says the opposite twice: the separating
   pixel row *"reads 100% clear background at a 0.88 gap just as at 1.5 … the extra 0.6 bought no
   separation at all"*; and **every reference measured sits at or below 1.0** — Fluent 1, Central
   1.0, Nucleo 0.82, Polaris 0.55. The verdict was *"leave it for now. The scan (§3.5) shows it
   binds almost nothing"*, where the scan is **92 approved icons, 133 path pairs**.
4. **`docs/07:59` and `docs/08:136`** then record that the 0.88 test *"passed on phase, not
   principle"* — which is the honest objection to it, and is why C19 floored at 1 rather than 0.55.

So: the floor that governs 2,910 drawings rests on a reasoned sentence with no drawings behind it,
plus a scan of **19% of the current set** that found it binding nothing, plus a refuted raster test
whose refutation is recorded in the same repo. `lab/refs/gap.html` — the sheet the 0.88 claim rests
on — contains no measuring code.

**The scan was never re-run.** Today the floor binds: 6 concepts with a `gap:` note down to 0.375,
12 `sort-*` concepts breaching it with 60 warnings declared "expected", and `trash`'s two C22
warnings. That is the opposite of *binds almost nothing*.

**F1 is therefore the register's one rule marked P whose evidence does not support P.** It is not
wrong — F2's 2026-09-28 ruling is a real, measured, Maruti-made decision that white holds 1.5 — but
the general floor at three masters has never been derived from this set. Card 1.7 owes that
derivation; this card's job is to say plainly that it does not exist.

---

## G — Naming and families

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| G1 | `<object>[-<modifier>][-<n>][-<size>][-filled]`, object first, *"each part more superficial than the one before"* | `docs/07:49` (C9), `CLAUDE.md:195`, `docs/03:160-176`, `docs/05:142-143` | user decision 2026-09-17 at 93 concepts, reasoned from how names sort and read | holds | P |
| G2 | A shape variant is a **number**, never a word; its style word is a `tags:` note the build and the Library search read | `docs/07:49` (C9) | as G1 | holds in the names. **102 files carry no `tags:` note** — the 17 concepts `plus`, `minus`, `x`, their sizes and circles, and `more-horizontal`/`-vertical`. Searching "add" finds no `plus` | P |
| G3 | Numbers are never reused or renumbered **once the set has shipped**; until then a retirement's gap may be closed, and each renumber is recorded in docs/07 | `docs/07:49` (C9) | as G1; amended by dated notes 2026-09-23 (C27) and 2026-10-03 (the four layout families) | holds, and the amendments are recorded exactly as the rule asks. Two deliberate gaps stand: `trash` (2, 3, 4) and `check-circle` (2), both awaiting Maruti | P |
| G4 | **Figure families:** the number names the figure and travels with the object (`user-2` ↔ `users-2`); other arrangements take a word | `docs/07:67` (C27), `CLAUDE.md:195` | one family — `user`/`users`, 2026-09-23, after `users-6` *"said nothing"* | holds for that family; it amends G1 for figure families only, and says so | 1→ |
| G5 | **Level families take words, not numbers** (`volume-low`, `-none`, `-x`, `-off`) | `docs/07:68` (C28), `CLAUDE.md:201` | one family, after a nine-library survey | holds | 1→ |
| G6 | Name the drawing, not the use | `docs/03:171-173` | 0 drawings | **break judged right** (`docs/09:26`): `search`, `menu`, `ban`, `more-horizontal` are market names, tags cover the rest. **One inconsistency still open before release:** `alert-circle` / `check-circle` / `x-circle` name their ring, `help` does not (`help-circle`) | P |
| G7 | A number marks a **different drawing**, never a size or style | `docs/07:49` (C9) | as G1 | **contradicted in 22 concepts** — see below | P |

### G7: the unwritten rule that a number may mark a filled-only difference

Measured at the pin, twice — whitespace-normalised path text, and `canonical()` from
`tools/audit/congruence.mjs`: **nine groups, 22 concepts, ship an outline drawing identical to
another concept's at all three masters.** No two files are *byte*-identical; the comments differ.
**Only `globe`/`language-2` and `globe-2`/`language-3` are identical in the filled twin too** — those
two are complete aliases, and the other seven groups differ only in the cut.

| Group | Declared where |
|---|---|
| `ban` = `ban-2` | `docs/07:61` (C21) — the three answers to a struck-through container differ only in the filled cut, and the row explains the cost |
| `layout-footer` = `-2` = `-3` (and the same for `-header`, `-sidebar`, `-sidebar-right`) | `docs/07:69` (C29) — *"`-2` the same outline with only the band solid in filled; `-3` the page solid and the band open in filled"* |
| `globe` = `language-2`, `globe-2` = `language-3` | `docs/07:78` — *"`language-2` / `language-3` are `globe` / `globe-2` under a second name"* |
| `building-3` = `building-4` | the file's own comment only: *"F's outline, filled another way"* |
| `compass` = `compass-3` | the file's own comment only: *"round 1's B filled turned white-on-dark"* |

All nine are deliberate. None is a defect. But **C9 says a number marks a different drawing**, and
in 22 concepts it does not — it marks a different *cut*. The question returns one master down:
**five further pairs are identical outlines at 16 only** — `camera`/`camera-5`, `files`/`files-5`,
`help`/`help-2`, `microphone-2`/`microphone-5`, `text`/`text-4` — which is C29's own objection
(*"one drawing at two masters out of three"*) at one master instead of two. There is a real working rule here, used
across four separate families by four separate decisions, and it is written down nowhere:

> **A number may mark a difference that is visible only in the filled style.**

Note the sharp edge. C29's own stated reason for retiring the old `-3` was that it *"was
byte-identical to its `-2` at 20 and 16, so four names were one drawing at two masters out of
three"* — i.e. the test applied was **is the filled drawing different?**, not **is the outline
different?** That test is defensible and it is not the test C9 states. **One ruling from Maruti
closes this, and it also decides whether `building-4` and `compass-3` — the two whose
justification lives only in a file comment — want a line in docs/07.**

---

## H — Modifiers: a whole document, never exercised

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| H1 | Five tests, all of which must pass before a modifier variant is drawn | `docs/05:12-25` | reasoned governance | **untested** | P |
| H2 | Never stacked modifiers, never state that colour conveys, never `<object>-search` | `docs/05:27-31` | reasoned | untested | P |
| H3 | Anchor **(16, 16)**, glyph 8 units (12→20), glyph stroke = the base's, clear zone **r6**, clearance 1.5 | `docs/05:35-61` | **one reference drawing** (Fluent's `calendar-add`) and arithmetic. `docs/05:37` says in its own words: *"Written for the old 2-unit stroke"* | **never drawn.** At the pin the only composite-looking names are `menu-arrow-left`/`-right` (a C17 menu style) and the four `volume-*` members (a C28 level family) | 1→ |
| H4 | Cut-back: **B auto-clip as the default, A hand-redraw where B looks wrong, C scale-down rejected outright** | `docs/05:87-114` | Fluent's `calendar` 8 subpaths → `calendar-add` 4, shared verbatim 1 — **one reference pair** | untested; no build step exists | 1→ |
| H5 | Ship these eight: plus, minus, check, x, arrow, clock, star, slash | `docs/05:124-140` | reasoned | untested | P |
| H6 | The slash is the exception: a full-canvas 45° stroke, its own 2-unit clearance channel, named `-off` | `docs/05:69-77`, amended by `docs/07:61` (C21) | `docs/05` 0 drawings; **C21 replaced the direction decision from five candidates on one ring, 2026-09-19** — and fixed `\`, not `/` | C21 holds and is inherited by every later struck-through icon. docs/05's version (`M4 4l16 16`, a 2-unit channel) is superseded and still written | 1→ |
| H7 | A modifier variant enters the library when someone can name the screen it appears on; a healthy v1 ships 60–80 | `docs/05:147-153`, `docs/04:87-89` | reasoned | untested | P |
| H8 | Fluent's quantified modifier rules — inset max 1px, filled regardless of the parent's style, cut 11 / modifier 9 at 16 and 20, 13 / 11 at 24 | `docs/08:408` | one reference, booked with the trigger *"before the first composite"* | not adopted; the trigger has not fired | — |

**Conflicts and silences.** docs/05 is the only rule document in the repo with **zero conformance
evidence** — no check, no drawing. Its geometry is written for a stroke the project abandoned, it
uses the term *live area* that `docs/01:42` says does not exist, and its clear zone *"stays inside
the live area and never touches trim"* contradicts `docs/01:68-70`'s *badges may run to 23*. Three
of docs/09's pending rulings and two of the five missing rules sit inside it.

The good news is in the "untested" column. **Nothing has to be redrawn to settle any of it**, and
every container that ships without a sparse bottom-right quadrant (`docs/05:116-120`) makes the
eventual cut-back dearer. This is the cheapest decision in the register and the one that gets
expensive fastest.

---

## I — Process: the rules about rules

| # | Rule | Stated at | Derived from | At 485 | Kind |
|---|---|---|---|---|---|
| I1 | **C0: the intent is balance, refined symbols, consistency, character. No row outranks it.** When a rule and the intent disagree, the intent is right and the rule has been carried outside its range — say so with the measurement, widen the range once, in writing, scoped to what was measured | `docs/07:6-34`, memory *rules-serve-the-drawing* | written **because of** the strain the first five containers put on the rules (`docs/09:32`), and because C24 promoted one icon's arithmetic to a corollary and had to be withdrawn | **holds, and it is the most used rule in the register.** The table itself names C19, C22 and C23 as cases of it working | P |
| I2 | An icon is **never** reviewed alone — judged at 16 in a grid beside twenty others | `CLAUDE.md:287`, `docs/02:67-69`, `SKILL.md:128` | `docs/09:33`: *"Rule right — every fault in doc 08 was found in real pixels beside the set"* | holds | P |
| I3 | An agreed deviation is **taught to lint in the same piece of work**, as a note lint verifies | `SKILL.md:174-177`, memory *teach-lint-agreed-exceptions* | the `box:` / `grows:` / `gap:` / `anchor:` mechanisms, each built with its first deviation | **holds four times, broken three ways on one family.** The 12 `sort-*` concepts' 60 warnings carry no note; for 12 of the 72 warning lines the note **exists in the draft and was dropped at approval** (`glyph: numeral`, probed: injecting it clears all 12); for the overlapping paths **no note kind can express it** (negative edge gaps, and `parseGapNote` takes only a positive number). `trash`'s two could be declared today and are not | P |
| I4 | An approval that settles a rule gets the next C-number in docs/07 and lands in `masters.mjs` / lint | `SKILL.md:179-181`, `CLAUDE.md:70-73` | the practice of C1–C30 | **holds for C1–C30; broken for the sort family**, whose approval settled a real set-wide finding (*"no family in this set keeps one ink box"*) recorded only in `plans/sort-family.md:9-14` | P |
| I5 | **A rule lives in one place and is changed everywhere at once.** A stale doc is a bug | `CLAUDE.md:48-52` | process | **the most broken rule in the register** — see `docs/audit/stale-statements.md` | P |
| I6 | **Measure, never recall.** An unmeasured number is written `[needs measuring]` | `CLAUDE.md:44-47` | process | holds in the newer documents (docs/08, the plans) and not in the older ones | P |
| I7 | One icon per commit | `CLAUDE.md:286`, `docs/02:99` | 0 drawings | `docs/09:29`: *"Break right — a family is one decision. The working rule is one board per commit."* Unactioned in the doc | P |
| I8 | **Draw the 15 hardest first, then freeze the foundations** | `docs/04:75-79` | reasoned, and `docs/09:32` judged it *"the rule was right — each of the five containers forced a new rule or carve-out"* | **never done.** The set went 93 → 485 with the foundations open. See the framing section | P |
| I9 | A clean lint is not a correct drawing | `CLAUDE.md:46`, `docs/08:436` | both bad `help` passes lint clean and were caught by eye in seconds (`docs/08:14-16`) | holds, and `enforcement-gap.md` quantifies how true it is | P |

---

**Conflicts and silences.** I1 and I5 are the two rules this whole audit exists to serve, and they
pull against each other in practice: C0 says the drawing wins, I5 says the rulebook must then be
updated everywhere at once, and **nothing in the toolchain or the loop makes the second happen.**
The three places it has failed are all recorded above — the sort family (I3, I4), the five missing
container rules (I8), and the stale-statement list (I5). The silence worth naming: **nothing says
what to do when a drawing is approved over a warning that no note can express.** The skill's answer
(I3) assumes a note always exists. `docs/09:81` proposed the one mechanism that would hold I5 — a
staleness check in `npm run check` — and it was never built.

---

## What this card adds to `docs/09-rule-audit.md`

docs/09 was written on 2026-09-20 against 114 names / 684 drawings. Verified at 485 concepts — the
full row-by-row re-measurement is in `docs/audit/stale-statements.md` §3b.

- **Ten of its twelve §1 verdicts still hold, two are refuted, and one is closed.**
  **Refuted:** §1's angle row — *"every default obeys it … two default exceptions"* — against **29
  defaults** that leave 0/45/90, about 17 of them with no grant anywhere; and §1's punched-hole row
  — *"every knock-out keeps fully clear pixels at every master"* — against `check-circle`, which
  leaves **0** fully clear pixels at 24 and 20. **Closed:** §2's pair-box item, which landed and is
  now clean on all 1,455 pairs. Two verdicts are confirmed to the digit (`file-text-2` at 16 =
  1.625; the filled cut weights 2.5 / 2 / 2 / 1.5), and three hold with a much larger scope than
  docs/09 could see (radii, identical outlines, the keyline drift).
- **Almost nothing in it has been acted on.** The only item carried out is C7's amendment, which
  docs/09:12 already records. Its §6 order — docs pass, lint pass, the six rulings, the Overviews
  page, the stress batch, the container rules — is where it was, with 371 more concepts behind it.
- **Its §4 "main gap" has grown by a factor of four.** Five missing rules at 114 concepts; five
  missing rules at 485, with all ten of the recommended stress-batch containers shipped.
- **Its §2 conflicts are all still live**, except the pair-box check, which landed and is now the
  model mechanism (C-5 above).
- **Three of its risks are now measurable and worse:** `ban`/`ban-2` identical outlines is nine
  groups and 22 concepts (G7); *"variant numbers mean different things per family"* is unchanged
  and now spans C21, C27, C28, C29 and G7; *"32 concepts became 114 names / 684 files"* is now
  **485 names / 2,910 files**, and the ratio it warned about — *"at that ratio the queue reaches
  ~10,000 drawings"* — is on track: `research/queue.md` holds **834** rows.

### What only Maruti's eye can settle

- **The container radius** (E1/E2) — and with it the four other missing container rules. Every
  measurement card feeds it; none can decide it.
- **Whether a number may mark a filled-only difference** (G7) — one ruling, 22 concepts.
- **Whether the badge may cross 22** (B3, H3) — free today, dearer with every container.
- **The gap floor at three masters** (F1) — the evidence says it binds nothing and every reference
  sits lower; Maruti's own 2026-09-28 ruling says white holds 1.5 because a white line reads
  thinner. Those two are not in conflict, but only the eye can say where between them the general
  floor belongs.
- **The filled cut weights** (F9) — *"visible between swap partners"* is a judgement at 16px.
- **Whether a break improved the icon** — C0, every time. The sort family and `trash` are the two
  live cases where lint says one thing and the eye has already said another.

---

**Where the measurement lives.** This card inventories the rules; it does not own the censuses
behind them. The radius vocabulary is card 1.2 (`docs/audit/findings-corners.md`), the angles card
1.3 (`findings-angles.md`), the 24-to-16 behaviour card 1.4 (`findings-scaling.md`), the shared
primitives card 1.1 (`findings-primitives.md`), the filled style card 1.8 (`findings-filled.md`),
and the Fluent comparison card 2.1 (`references-fluent.md`). Where a number here came from one of
them it says so.

---

*Written for card 1.14 of `plans/set-and-rules-audit.md`. Companions:
`docs/audit/enforcement-gap.md` (what is checked and what is not),
`docs/audit/severity-proposal.md` (what should block),
`docs/audit/stale-statements.md` (the exact edits I5 owes).*
