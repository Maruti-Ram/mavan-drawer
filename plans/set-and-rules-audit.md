# Set and rules audit

Status: **wave 0 done; waves 1 and 2 done except cards 1.10, 1.11, 1.17 and 2.6; then waves 3–5.**
Everything done is committed.
Nothing in the set, the rules, lint, the sheet or the board changes in this build. Audit tools and
audit documents only, committed separately.

Started 2026-10-04.

---

## RESUME HERE

**Read this block, then the Scope section, then the open cards. Do not re-derive anything in
"What reconnaissance already established" or in the corrections list below.**

**Done and committed** (9 commits, `9ea987a`..`02d5f36`, plus the plan update after them, on
`main`, not pushed): the plan · 8 instruments + a rasteriser in `tools/audit/` (wave 0's five, then
`notes.mjs`, `metrics-check.mjs`, `metrics-probe.mjs`) · 5 reference extractors in
`tools/audit/refs/` · **20 findings documents in `docs/audit/`, 14,630 lines.**
`node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → **182 pass.**
`git diff 5933041 HEAD` across `src/icons`, lint, geometry, masters, build, queue, `research/`,
`lab/`, docs 01–09, `CLAUDE.md`, `README.md`, `package.json` → **empty.** The gate is unmoved:
`node tools/lint.mjs` output is byte-identical to the pin's.

**Next, in this order** (Maruti agreed the grouping; the first group ran on Maruti's go, 2026-10-05):
1. ~~**1.13 exceptions ledger · 1.12 metrics truthfulness · 1.9 modifier grammar**~~ — **done
   2026-10-05** (`cfd52b0` tools, `02d5f36` documents). Each was re-measured by a fresh reviewer
   that had not seen the author's scripts, corrected, and checked a second time. What they hand
   wave 3: the ledger's rule proposals R-1..R-10 (`exceptions-ledger.md` §4); the metrics fixes
   F1–F8, three of them waiting on rulings (`findings-metrics.md` §9, §12); the grammar proposals
   P1–P8 (`findings-grammar.md` §5). Each card's own eye questions: ledger §6, metrics §12,
   grammar §4.
2. **1.11 optical · 1.10 families · 1.17 Polaris** — narrow, self-contained, none blocks wave 3.
3. **Wave 3** (the four registers; 3.5 is already done) → **wave 4** (surfaces) → **wave 5**
   (fresh reviewer + the one ranked decision agenda).

**How a card is run** — the method that held for 1.13, 1.12 and 1.9 (2026-10-05). Follow it for
every remaining card; it is what caught 16 wrong figures in one card and two unmeasured ones in
another before they reached Maruti.
1. **Capture the gate first:** `node tools/lint.mjs` → a scratch file (the end must be byte-identical
   to it); `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` (182 pass at `a748f9d`);
   `shasum lab/manifest.json`; `git diff --quiet 5933041 HEAD -- src/icons` and `git status --short
   src/icons` — if the working tree has moved, every agent measures from
   `git archive 5933041 src/icons` instead.
2. **One author agent per card, in parallel.** Model: strongest = Fable, strong builder = Opus,
   checklists = Sonnet; a vague brief or a result that needs judging moves up a tier. The brief:
   the card, the pin, the files it owns (new audit tools allowed under `tools/audit/`, never
   imported by lint or build), a scratch directory, **never `npm run build` or `npm run check` in
   the repo** (they rewrite `lab/manifest.json` and `dist/` — build the pin in scratch from
   `git archive 5933041`), measure-never-recall, the three kinds kept apart, plain language, a "For
   wave 5 to reconcile" section, cite earlier audit documents rather than repeat them, report in
   under 300 words.
3. **A fresh reviewer per card** (strongest), which did none of the work: re-measures at least 40
   figures with its own scripts, not the author's; reads every citation; challenges each verdict
   against Maruti's standing views (one icon is not a rule; references are input, never values;
   a proposal is Maruti's to rule on); asks whether a tool's tests would catch a regression.
4. **Corrections go back to the author**, who re-measures each before changing it and disputes with
   evidence; then **the same reviewer runs a closing check** on the fixes and on every figure that
   is new since. A dispute over a single fact is settled in the main session against the file.
5. **If the harness refuses an agent's write** to a report file ("Subagents should return findings
   as text"), the agent returns the whole document in one ````markdown block; the main session
   extracts it from the agent's transcript with a script — never reading the transcript into
   context — writes it, and diffs. Small residual fixes the main session makes itself, after
   re-running the figure.
6. **Every figure must reprint from a committed tool.** Scratch scripts vanish with the session;
   fold them into the card's tool (as `metrics-probe.mjs` does) and map each section to a command.
7. **Close:** the gate again, then three commits — tools · documents · this plan (tick the cards,
   update this block).

**Card 2.6 is a special case:** the field research was done by two agents whose reports exist only
in the originating session's transcript, not on disk. `docs/audit/references-field.md` must be
written from what is summarised in this plan and in the other reference documents — the praise
vocabulary, the ranked failure modes, and Atlassian as the counter-case to hand-drawing a small
master. Do not re-run the web research; it cost two long agent runs.

**Wave 5 must reconcile, never pick**, where two cards measured one quantity:
- filled/outline box equality — 1,100 of 1,455 exact (card 1.8) against 96.3% (card 2.1)
- the 16 filled-corner offset — 7 concepts/10 pairs, then 37/97, now 13 concepts/50 corners
- container-radius share — 61.8 · 61.4 · 58.6% (card 1.2) against 61.1 · 61.1 · 58.3% (card 2.3)
- SF Symbols' pair count — `CLAUDE.md:308` says 2,664; the app declares 2,906, or 2,508 without
  locale and direction variants; `stale-statements.md:197` marks the same sentence as holding
- the Fluent card's own-side figures came from its own run, not card 1.4's
- twin box equality is measured six ways in `findings-metrics.md` §11.3 — 921 to 1,401 of 1,455,
  by tolerance, by tuple against edge by edge, by rounding first. Reconcile the first item above
  by naming each figure's definition, not by choosing one
- `volume-off`'s 1.25 channel: C22's dated note says it is "noted in its file"; the ledger and the
  grammar card both find it declared nowhere — its `gap:` note covers the bar-stub junction
- `trash`'s two warnings: C22 and `docs/09:31` call them a lint false positive; `findings-air.md`
  calls them genuine near-misses
- each card of the 2026-10-05 group keeps its own list: `exceptions-ledger.md` §5,
  `findings-metrics.md` §11, `findings-grammar.md` §6

**Known instrument defects — do not trust these without the stated workaround:**
- `raster.mjs:257` `classify` drops an area path's horizontal edges and then reuses that list for
  its box-uniformity test, so `rasterise` can return 0.00 where the truth is 0.50. **Exposure: any
  `rasterise` / `inkArea` / `inkPixels` / `density` / `census` / `halfToneShare` figure on a file
  with an area path (342 shape-filled concepts × 3 masters). Outline and line-heavy filled figures
  are unaffected — verified on all 2,910 files.** Fix, not applied: keep the horizontal edges in a
  separate list used only by the straddle test. Card 1.5/1.6 bypassed it; every published figure
  was re-verified and none moved.
- `pixelgrid.mjs` `blurScore` is a constant **0.500** on every straight run at stroke 1.5, so it
  cannot rank 24 or 20 at all. It discriminates only at 16.
- `pixelgrid.mjs` `diagonalShare` restarts a fragment after every arc, so a closing `Z` goes to the
  last arc's end. Four outlines change side of the 0.5 line.
- `figma.mjs` `measure.ink` (Figma render bounds) is wrong on rotated or flipped nodes — 1,032
  Central drawings flagged. **Use the path, not `measure.ink`.** Central's `cornerRadius` can also
  live only as a node property while `d` stays sharp (23% of its radius 1–3 outlines), and its
  concept names are not unique — key on id.
- `figma-extract.md`'s fluent row points at the **copy** in `XewrhAKrNGVZtikkpI5am9`. The
  authoritative file is **`rdI0uXVzp89fOZpYcQV6mo`** ("a.1. Microsoft Fluent system iconography"):
  pages `1124:9833` System icons, `11947:5` Guidelines, `11972:5` Creation tools.
- The shared record vocabulary lives in `refs/nucleo.mjs` and is duplicated in `refs/figma.mjs`.
  It should move to `refs/common.mjs`.
- `congruence.mjs` `congruentUpToTranslation` reports "different segment structure" for one ring
  traversed the other way round (`layout-sidebar-right` against `checkbox`), while
  `canonical().shape` and `classify` call them identical. **Use those for pairwise counts.** Card
  1.9 re-ran its count on canonical `d` and missed none of 694.
- `geometry.mjs` `bbox()` samples each arc at 64 points and can sit up to 0.0056 inside the true
  edge (`rotate-ccw` at 24), against `CLAUDE.md`'s "exact arc bboxes". A box quoted to better than
  0.01 needs `metrics-check.mjs`'s solved box.

**Corrections made during the build — these are settled; do not reinstate them:**
| Claimed | Actually |
|---|---|
| Fluent uses 1.5 at 12–28 (`docs/07:47`, `fluent-guidelines.md:5-8`) | Regular is **1 · 1 · 1 · 1.5 · 1.5 · 2 · 2.5**; our row is a slip across two columns. Confirmed three ways |
| A 0.88 gap reads as clear as 1.5 (`docs/08 §3.4`) | **False.** 1.08 is clear, 0.88 is not. The sheet it rests on has no measuring code |
| Nucleo's `stroke_max` is per-drawing weight headroom | One constant per set and grid, on 2.2% of icons, in three free sets |
| Untitled UI holds the filled box 26 of 26 | **92.9%** at census. The 26 were the commonest concepts and none has a badge |
| Nucleo redraws 98% / 57.5% across grids | A property of the test. Within a family: 20.8%–55.4% |
| Near misses rise at 16 (361 → 378 → 545) | A measuring-band artefact. Held constant: 361 / 287 / 308 |
| The radius tiers scale cleanly | **Three different laws** — tier 2 canvas-locked, tier 3 stroke-locked, tier 1 neither |
| Four concepts draw the filled corner tighter | **None does.** No reliable set-wide statistic exists for that relation |
| lint cites doc sections that don't exist | Its **warnings** all cite §6, which exists. `§5b`/`§5c`/`§5f` appear in **CLAUDE.md ×5, docs/01, 07, 08 and SKILL.md**, and name nothing |
| C14's per-master shift scaling has broken down | **It holds** — 81 of 90 files within 0.05, chevrons within 0.007. A two-icon question |
| `ban-3` vs `x-small` is shared-part drift | Coincidence. But `ban-3`'s own note is 0.177 wrong at 16 |
| `moon`'s short arc radius is a one-off | **117–165 arcs** type an `rx` too short to span their own chord |

**Three decisions that expire at launch** (C9 locks names and numbers at release), ranked by cost
of delay, all free today: `help` → `help-circle` · `login`'s door is `logout-3`'s, not `logout`'s ·
the badge zone, while zero composites ship. Card 1.9 measured all three: the facts are in
`findings-grammar.md` §1.5 and §2.6; the recommendations are P1 (badge zone), P5 (`help` →
`help-circle`, with `info` → `info-circle`) and P6 (keep `login`'s numbering and write the pairing
rule down — which conflicts with `findings-primitives.md` item 12's renumber; listed in its §6).

**Note:** `CLAUDE.md:90-95` still says "2026-09-28: none open" and does not list this plan. That is
already an entry in `stale-statements.md`; it is not edited, per Maruti's Q4 answer. A fresh session
following CLAUDE.md's own instruction — read every plan in `plans/` with unticked boxes — will
still find this file.

**Pinned tree: `5933041` ("Add table and table-2", 2026-10-04) — 485 concepts, 2,910 drawings.**
Every number in every register cites this commit. The main session keeps adding icons; the audit
reports against the frozen tree and says so.

Lint baseline at the pin: **2,910 drawings · 2,848 clean · 62 warned · 0 failed.** The 62 are the
12 `sort-alpha-*` / `sort-numeric-*` names (60 drawings) plus `trash` at 20 and 16. If this
baseline moves, the build changed something it should not have.

---

## What changes for Maruti

Today you can tell whether an icon is finished, one icon at a time, by eye and by a lint run.
You cannot tell whether the **set** is good, or whether the **rules** are the right rules. This
build gives you four things you do not have:

1. **A judging standard.** The axes a set like ours is actually judged on, each with what good
   looks like, how it is measured, and where we stand — calibrated against five professional
   sets rather than against opinion.
2. **A findings register.** Every deviation, measured, grouped by axis, icons named, tagged
   one-off or systemic.
3. **A rule register.** Every rule, everywhere it is stated, what it was derived from and from
   how many drawings, what it is silent about, what it clashes with.
4. **A parameter map.** Which numbers are free choices and which are derived from them — and
   what it costs to change one, with the stroke-16 change as the worked example.

Plus the lab surfaces to judge the parts only your eye can settle, and one decision agenda,
ordered by how much of the set each ruling moves.

**Nothing in the set changes until you have been through that agenda.**

---

## Fixed input — the stroke spec (Maruti, 2026-10-04)

**The stroke system is settled and is not under audit:** 1.5 at 24 and 20, **1.25 at 16**
(`STROKES`, `tools/masters.mjs:10`; C7 as amended 2026-09-20). Confirmed shipped across 485
concepts: **485 outline files per master** carry that weight, plus the 342 shape-filled twins that
keep the outline weight — 827 files per master in total — while the 143 line-heavy filled twins
carry `FILLED_WEIGHT`. The audit measures and judges **around** this spec, never toward a 2 px
alternative.

Everything derived from it is fixed with it, and is therefore not an open parameter:

| Derived | 24 | 20 | 16 |
|---|---|---|---|
| Cap inset (`weight / 2`) | 0.75 | 0.75 | 0.625 |
| Mark-bend radius, outline (`bendMin`) | 0.75 | 0.75 | 0.625 |
| Mark-bend radius, filled | 1.25 | 1 | 1 |
| Grid step / decimals | 0.25 / 2 dp | 0.25 / 2 dp | 0.125 / 3 dp |
| Filled line weight (`FILLED_WEIGHT`) | 2.5 | 2 | 2 |

**What this does NOT fix.** `MIN_GAP` was deliberately made a literal 1.5 rather than a
derivation from the stroke (`tools/masters.mjs:60-64`). So locking the stroke leaves the gap
question entirely open — which matters, because it is the question Maruti is most suspicious of.
Also still open: container radius, margin and keyline sizes, detail budget, the modifier zone,
and the filled-cut policy.

**Consequence for the reference work — normalise, or the comparison lies.** Central draws at
stroke 2 on a 24 canvas (8.3% of canvas) against our 6.3%; Untitled UI and most line sets sit
heavier than us too. Absolute numbers therefore cannot cross between systems: "their radius is 2,
ours is 2.5" says nothing. Every reference measurement is recorded **twice** —

1. **as a share of its canvas** — answers *how round / how open does it look*;
2. **as a multiple of its own stroke** — answers *what did they decide relative to their own line*.

Worked example of why this is not pedantry. `docs/08:112` records the separations in absolute
units: Fluent 1 · Central 1.0 · Nucleo 0.82 · Polaris 0.55, against our 1.5 — we look about 1.5×
generous. But `docs/07:47` records that Fluent draws **1.5 at 16**, so its separation is **0.67 of
its own stroke**, while ours is 1.5 on a 1.25 line — **1.2 strokes**. Stroke-relative, we are
close to **twice** as generous as Fluent, not 1.5×. That arithmetic comes from two figures already
cited in our docs and must be confirmed against the Fluent file itself (card 2.1) before it enters
a register.

The stroke-16 change stays in the plan as the **worked example** for the parameter map (3.3) —
it is the best record we have of what one parameter change really costs. It is a record, not a
proposal.

---

## What reconnaissance already established

> **Dated note — these figures predate the pin.** This section was measured on 2026-10-04 before
> the tree was frozen, when the set stood at 480–481 concepts / 2,880–2,886 drawings. The pin is
> `5933041` at **485 concepts / 2,910 drawings**, baseline **2,848 clean · 62 warned · 0 failed**.
> The counts below are left as taken, because they record when each thing was found; proportions
> hold, absolute totals do not. **Every wave-1 and wave-2 figure is measured at the pin.** The
> build's proof criterion is the pinned baseline, not any number in this section.

Measured this session, before the plan was written. These are the facts the plan is built on.

### The gate is weaker than we believed

- `lint.mjs:648-652` exits 1 **on ERROR only**. Every geometric rule — bends, gaps, keylines,
  centring, families, filled-vs-outline pairs — is a WARNING and blocks nothing.
  Today: 2,886 drawings · 2,824 clean · **62 warned · 0 failed**, exit 0.
- `docs/01-foundations.md:3,405` claims "obeys this or it does not ship" and "checks all of this
  mechanically."
- From a directory with no `src/icons`, lint prints "0 drawings" and exits 0 (`lint.mjs:199,623-626,652`).
- `npm run check` is `build && lint`; `build.mjs` validates nothing about drawings.
- `geometry.test.mjs` (95 tests) and `inkbox-guard.mjs` are **outside** `check`. No git hooks.

### The grid rule is not enforced

- `lint.mjs:216` — `hasComment = /<!--/.test(src)`. **Any** HTML comment anywhere in a file turns
  its off-grid warning into a silent "documented exception" note.
- Result: **1,952 of 2,880 drawings (68%) sit off their master's grid**, across **26,897**
  individual coordinates. `gear-3-filled` at 24 carries 165.
- `CLAUDE.md:272` and `docs/01:376-377` state the rule as *a comment saying what each correction
  fixes*. Nothing checks that.

### Keylines cover 60% of the set; the rest opts out

- `keyline: mark` on **136 concepts** (816 files); `box: W×H` on **56** (332 files, 57 distinct
  strings, none shared between masters); `anchor:` on 5. No file carries two of them.
- **192 of 480 concepts (40%) do not use the silhouette keyline system.**
- The 136 are the marks: chevron 36, arrow 21, rotate 11, check 8, menu 6, sliders 5.
- **1,184 of 2,886 files skip the keyline match**; 1,702 are held to it.

### Optical correction is 45 icons, not a system

- `optical:` on **45 of 480 concepts** (270 files) — every chevron, `alert-triangle` ×4,
  `play` ×3, `info-2`, `info-3`. Nothing else in the set.
- **94 distinct dx/dy pairs** for 45 concepts across 3 masters. C14 says the shift is *scaled by
  ink height* for other masters; 94 distinct values says otherwise. Every pair is single-axis.
- `lint.mjs:319-321,361` moves the centring target by the declared amount, **unchecked**. A probe
  with `optical: 3 0` silenced a 3-unit offset.

### The gap rule's premise expired

- `docs/08:107` — rasterised at 16×16, the separating pixel row is **100% clear at a 0.88 gap just
  as at 1.5**. "The extra 0.6 bought no separation at all."
- `docs/08:112` — **Fluent 1px · Central 1.0 · Nucleo 0.82 · Polaris 0.55.** Every reference at or
  below 1.0. We hold 1.5.
- `docs/08:116` — the scan that justified keeping it: **92 then-approved icons**, 0 under 1.5.
- `docs/08:280` — the verdict: *"leave it for now. The scan (§3.5) shows it binds almost nothing."*
- **The set is now 481.** The scan was never re-run. Today it binds: **6 concepts carry `gap:`
  notes**, values 1 · 1.25 · 1.48 · 0.75 · 0.7 · **0.375** (`volume-off-filled` at 16 — a quarter
  of the floor); and **12 `sort-*` concepts breach it with 60 warnings** that `plans/sort-family.md`
  declares "expected", carrying no `gap:` note and **no C-row in docs/07**.

### Five axes have no instrument

`geometry.mjs` cannot measure: shape congruence (so the primitive-drift question has no tool at
all), corner radius of a drawn corner, the angle of a straight segment, ink area, or where an edge
lands on the pixel grid. Those are the instruments the corners, angles, mass, crispness and shared-
primitive axes need. **This is why there is a wave 0.**

### Our own metrics are wrong on a third of the set

- `build.mjs:49-50` gives every shape-filled drawing `recession: 0`. **1,014 of 2,886 entries.**
  `plus-circle` optical.left reads 2.71; `plus-circle-filled`, same silhouette, reads 2.0.
- `container` and `ratio` are null for every shape-filled drawing (`build.mjs:54`).
- Bare `x`, `x-large`, `x-small` report container 13 / 16 / 10 with ratio 1×1.
- On record at `docs/09:43`, unfixed. This is the differentiator (`CLAUDE.md:249-253`).

### docs/09 is already a rule audit

`docs/09-rule-audit.md` holds §1 twelve broken-rule verdicts, §2 eleven rule-vs-rule conflicts,
§3 document triage, §4 **five named missing rules**, §5 nine borrowed items, §6 an order ending in
**six rulings already waiting on Maruti**: check cut weight · container radius · chevron-shift
symmetry · variant cap and shared style tags · badges crossing 22 · D23 revisions.

Almost all of it is unactioned. **Strand B's job is therefore not to discover. It is to verify
docs/09 still holds at 481 icons, extend it to what it does not cover, and force it to a decision.**

docs/09 §4's five missing rules map onto five of the foundations axes below: container radius (F2),
detail budget per master (F11), mark share of container 24→16 (F6), the modifier zone (F5), one
filled-cut policy (F13).

### Documents that are stale

- `CLAUDE.md:279-280` `grows:` — "none yet noted". Actual: **54 files, 18 concepts, all noted.**
- `CLAUDE.md:285` `gap:` — "Today: `attachment-4-filled` at 24 and 20". Actual: **10 files, 6 concepts.**
- `CLAUDE.md` anchor — "first `volume-low`, `-none`, `-x`". Actual: **5 concepts**, incl.
  `volume-minus`, `volume-plus`.
- `CLAUDE.md:162-168` — the Polaris Figma frame for the D23 re-audit, *file `XewrhAKrNGVZtikkpI5am9`,
  node `15643:27748`*. **That node is not in the file.** Its four pages are ❖ Icons, Microsoft
  FLuent, Untitled UI, Cover. doc 06's open D23 rulings are waiting on something that is not there.
- `docs/01:127-130` — `box:` "first used by `folder`". Actual: 56 concepts.
- `docs/01:352` — stale "2-unit gap" wording.
- `CLAUDE.md:125` — "487 icons"; the sheet has 833 rows.
- `CLAUDE.md:90-95` "none open" does not mention `plans/sort-family.md` (created 2026-10-03).
  Narrow: it has no unticked boxes, but it holds three things recorded nowhere else — the 60
  "expected" warnings, two undecided design questions, and the finding *"no family in this set
  keeps one ink box"*.

### The set, as measured

- **481 concepts × 3 masters × 2 styles = 2,886 files.** Zero missing, zero orphans, all well-formed.
- Only `<svg>` and `<path>`. **Zero** `<rect>`, `<circle>`, `<line>`, `<g>`, `<ellipse>`, `<polyline>`.
- Root attributes uniform except filled `stroke-width`: **142 concepts** line-heavy (2.5/2/2),
  338 light (1.5/1.5/1.25). Same 142 at all three masters, no mixed.
- Paths per 24 outline: min 1 (82 files) · median 3 · max 19 (`gear-3`).
- **30 concepts lose paths from 24 to 16; none gain.** `building` 11/6/6, `gear-3` 19/16/13.
- **8 filled files are byte-identical to their outline twin** — `grid-3`, `grid-4`,
  `more-horizontal`, `more-vertical` at 24 and 20. Only root `stroke-width` differs. At 16 they diverge.
- `microphone-5` declares `box:` at 24 only; its prose says "14 · 12 · 10 wide".

### References — all five verified measurable

| Source | Access confirmed | The one question it answers best |
|---|---|---|
| **Nucleo** | `data.sqlite3` + **64,933 SVGs on disk**, per-icon `grid` and `corner_custom`. 5 families: Core 24/32/48 · UI 12/18 · Sharp 24 · Pixel 24 · Micro Bold 20 | Grid discipline across sibling families. **Correction (card 2.3): `stroke_max` is NOT per-drawing weight headroom** — it is one constant per set and grid, set on 1,429 of 64,933 icons (2.2%) in three free sets only, and `size` is markup byte length, not a pixel size. A per-drawing headroom number is still worth having; it is ours to invent, computable from `facingGap`/`selfGap`, not Nucleo's to lend |
| **SF Symbols** | `SFSymbolsFallback.otf` 41 MB, 3 masters × 9 weights; `fontTools 4.60.2` present; `base_symbols_map.json` | Whether a set declares a closed vocabulary, and in what shape |
| **Fluent** | Figma page "Microsoft FLuent", **2,609 component sets** | The hold/give curve across sizes — F6, our top axis |
| **Untitled UI** | Figma page, sections **Line Icons** / **Solid Icons** | Outline↔filled isolated, no multi-size confound |
| **Central** | Figma page "❖ Icons", 38 category frames, ~3,000 component sets | What a parameter change costs when professionals redraw for it |
| **Polaris** | Figma page "Polarris icons" — **499 components, each 20×20**, flat vectors. Added by Maruti 2026-10-04 | Unblocks doc 06's D23 rulings, which have been waiting on a Polaris re-audit. **The pointer in `CLAUDE.md:162-168` (node `15643:27748`) is dead; this page is the live source** |

Central probe, measured on `folder-1` (**one icon — a hypothesis, not a rule**): 30 variants on
four axes (`filled` on/off · `stroke` 2/1.5/1 · `radius` 0/1/2/3 · `join` square/round),
**27 distinct geometries** — genuinely redrawn, not restyled. Outer ink edge held at **20×17,
margin 2, at every stroke weight**, centreline moved to hold it. Filled box = outline's outer box.
**Filled corner radius = centreline radius + half the stroke** — derived, not chosen. Fold notch
holds its 2:3 slope and moves its point.

Note the fork: Central **held the angle and moved the point**; our stroke-16 **held the ink box and
let the angle give** (chevron 45° → 45.5°). Different constraints, both defensible — but it should
be a decision, not an accident.

---

## The transfer test

A reference finding may enter the decision agenda only if it passes all four. Anything that fails
is recorded as *seen and rejected, because X*, the way `docs/08 §8` already does it.

1. **It answers a question we already have** — an axis below, or an open agenda item. References
   do not get to add questions.
2. **Their constraint matches ours on that question.** Ours are unusual: we do not control render
   size; no weight axis; three hand-drawn masters; two styles drawn as a pair; outlined fills
   shipped from a private stroked source; we publish optical metrics.
3. **It is a method, not a value.** We never take their number — we take how it was derived and
   how it is verified.
4. **We can check it**, or we book it explicitly as eye-only with a lab surface to judge it on.

---

## The axes

The judging standard this build produces. Each gets: what good looks like · how it is measured ·
where we stand · one-off or systemic.

Framing: **almost every rule we have is about one drawing alone in its square.** "Best set I have
seen" is overwhelmingly a judgement about relationships *between* drawings. We do have relationship
rules — C8, C17, C27, C28 — but each was written for one family as that family was drawn. Nothing
says the circle in `plus-circle` is the circle in `x-circle`. That is `CLAUDE.md` open item 5, never built.

| # | Axis | Instrument | Status |
|---|---|---|---|
| F1 | **One apparent weight** — same darkness, not same number | **ink area ÷ canvas**, plus the darkest-patch reading; per-angle coverage. *Not* ink ÷ bbox — that ranks a `minus` as the densest icon in the set at 98% (card 1.5) | built (wave 0) |
| F2 | **One apparent size** — a circle and a square with one box read as two sizes | keyline conformance + optical extent | partly exists |
| F3 | **The armature** — the same coordinates recurring across hundreds of icons | coordinate clustering across the set | tool needed |
| F4 | **A closed vocabulary** — a finite, enumerated list of parts | shape congruence up to translation | **tool needed; none exists** |
| F5 | **A grammar for combination** — modifier position, size, cut-back, every time | modifier-zone census | tool needed |
| F6 | **Behaviour across sizes** — what is held, what gives | cross-master ratio diff | **nothing reads two masters today** |
| F7 | **Crisp where it is used** — edges on the pixel grid at 16 | edge-to-whole-unit landing | tool needed |
| F8 | **Air that reads even** — counters, knockouts, bands, runs | `facingGap` + rasterised read | exists, partial |
| F9 | **Contact grammar** — when ink *touches* ink: join, butt, or stop short | contact census | **no rule exists at all** |
| F10 | **Silhouette legibility** — twenty at 16, squinted, still distinct | lab surface | eye-only |
| F11 | **Restraint** — detail budget, and which detail dies first | path/command census per master | partly measured |
| F12 | **Honest metrics** — our published bearings are true | metrics verification | **wrong on 1,014 entries** |
| F13 | **The filled style** — outer-edge equality, knockout weight, repeated elements | pair census | exists, box only |

Merged from Maruti's list: *shared primitives*, *modifier grammar* and *the objects themselves* are
the same failure at three scales — part (F4), assembly (F5), object (F3). The *exceptions ledger* is
not an axis; it is the **instrument** — the symptom readout for the other thirteen.

Added: **F9 contact grammar**, **F12 metrics truthfulness**, and one question to settle —
**is 20 a master or a scale?** If the 20 drawings are mechanically 24 × 0.833 we have two masters
and a resize, which changes what the three-master claim means.

---

## Cards

Each: scope · files owned · how we know it is done · model · depends on.
**No card writes to `src/icons/`, `tools/lint.mjs`, `tools/geometry.mjs`, `research/queue.md`,
`lab/drafts/` or `lab/manifest.json`.** New audit files only.

### Wave 0 — pin and instrument (blocking)

- [x] **0.1 Pin the tree.** The set moved four times during reconnaissance (`italic`, `moon`,
  `table`, `table-2`). **Pinned to `5933041`** — 485 concepts, 2,910 drawings, lint 2,848 clean ·
  62 warned · 0 failed. Recorded at the head of this file. Drawing continues in parallel.
  *Owns:* `plans/set-and-rules-audit.md` (this file). *Model:* main session. **Done 2026-10-04.**

- [x] **0.2 The missing instruments. Done 2026-10-04.** Built: `congruence.mjs` (920 lines),
  `radii.mjs` (487), `angles.mjs` (425), `raster.mjs`, `mass.mjs`, `pixelgrid.mjs`, with tests.
  **115 tests pass, 0 fail.** Lint byte-identical to the pin. Every stated number reproduced except
  two that were refuted — see "What wave 0 refuted" below. Original scope follows.
  *Owns:* `tools/audit/` — new directory, audit-only, never imported by lint.
  `congruence.mjs` (shape equality up to translation, then up to translation+scale) ·
  `radii.mjs` (corner radius of a drawn corner, strokes and areas) ·
  `angles.mjs` (every straight segment's angle) ·
  `mass.mjs` (true ink area, not bbox) ·
  `pixelgrid.mjs` (where each edge lands at 16, and the half-tone it produces).
  *Done:* `node --test tools/audit/*.test.mjs` passes; each tool reproduces a number already known
  from a doc (e.g. `radii` finds `trash`'s 1.5 where the rule says 2.5, `docs/09:23`).
  *Model:* strong builder. *Depends on:* 0.1.

- [x] **0.3 Reference extractors. Done 2026-10-04.** Built: `refs/figma.mjs` (Central, Fluent,
  Untitled UI, Polaris), `refs/nucleo.mjs` (1,432 lines), `refs/sfsymbols.mjs` (992), with run
  guides. Shared schema `mdx-ref/1`; every measurement stored as `{abs, canvas, stroke}`. Proved by
  Hausdorff distance and pixel comparison against independent renders — 2,636 of 2,642 Nucleo
  Essential drawings pixel-identical. All output under `research/references/` (gitignored); the
  writers refuse any destination outside it. Full extraction deferred to wave 2 as planned.
  *Cleanup owed:* the shared vocabulary lives in `nucleo.mjs` and is duplicated in `figma.mjs`; it
  should move to `refs/common.mjs` in wave 1. Original scope follows.
  *Owns:* `tools/audit/refs/{nucleo,sfsymbols,fluent,untitled,central}.mjs`.
  *Done:* each writes a normalised JSON of geometry our own tools can read. *Model:* strong builder.
  *Depends on:* 0.1.

### Wave 1 — measure us (parallel)

- [x] **1.1 Shared primitives (F4, F3).** Is the circle in every `-circle` icon the same circle?
  The arrowhead, plus, chevron, dot, badge, the slash of `ban`. Congruence classes across 2,886 files.
  *Owns:* `docs/audit/findings-primitives.md`. *Model:* strongest (judging drift vs intent).
  *Depends on:* 0.2. **Closes `CLAUDE.md` open item 5.**
- [x] **1.2 Corners and radii (F2).** Radius census: container vs detail vs mark-bend, per master,
  and how radius behaves 24→16. Nested radii. *Owns:* `docs/audit/findings-corners.md`.
  *Model:* Sonnet measure, strongest judge. *Depends on:* 0.2. **Feeds the open container-radius ruling.**
- [x] **1.3 Angles (F-angles).** Every deviation from 0/45/90 and what it bought.
  *Owns:* `docs/audit/findings-angles.md`. *Model:* Sonnet. *Depends on:* 0.2.
- [x] **1.4 Scaling 24→16 (F6).** What is held and what gives. The 13% mark/container drift
  (`docs/08 §6.1`) re-measured at 481 icons. *Owns:* `docs/audit/findings-scaling.md`.
  *Model:* strongest. *Depends on:* 0.2. **Maruti's stated top axis.**
- [x] **1.5 Mass and silhouette (F1, F10).** Ink area spread; does every icon read with the same
  darkness in a 16px row. *Owns:* `docs/audit/findings-mass.md`. *Model:* Sonnet measure, eye to settle.
- [x] **1.6 The pixel grid at 16 (F7).** Where edges and centrelines actually land; which icons are
  blurry and why. *Owns:* `docs/audit/findings-grid.md`. *Model:* Sonnet. *Depends on:* 0.2.
- [x] **1.7 Air and contact (F8, F9).** The gap question re-derived from first principles: what is
  it protecting against, and does one constant do that job at three masters — or does it need to
  differ for parallel runs, facing edges, knockouts, and counters inside a glyph? Plus the contact
  census: where ink touches ink, and what we do there (no rule exists).
  *Owns:* `docs/audit/findings-air.md`. *Model:* strongest. **Maruti's headline suspicion.**
- [x] **1.8 The filled style (F13).** Every place filled and outline disagree beyond the box.
  *Owns:* `docs/audit/findings-filled.md`. *Model:* strongest.
- [x] **1.9 Modifier grammar and objects (F5, F3).** Where a plus/x/check/badge sits, its size, how
  it is cut out, whether the base is cut back. Is a document, a folder, a person, an arrow one
  drawing wherever it appears. *Owns:* `docs/audit/findings-grammar.md`. *Model:* strongest.
  **Done 2026-10-05.** 78 composites, no corner badge, at least 38 queued badge icons with no
  grammar; the arrow-or-pencil-through-object kind holds about 1.5 of air in 13 of 18, written
  nowhere; nine shared parts drift at one master across 30 concepts. Proposals P1–P8.
- [ ] **1.10 Families and completeness.** Numbered, size, level, figure; styles × sizes grid.
  *Owns:* `docs/audit/findings-families.md`. *Model:* Sonnet.
- [ ] **1.11 Optical correction as a system (F2).** 45 of 480 concepts, 94 distinct pairs. Does
  C14's scaling claim hold? Which icons *should* carry a shift and do not?
  *Owns:* `docs/audit/findings-optical.md`. *Model:* strongest.
- [x] **1.12 Metrics truthfulness (F12).** Verify every published bearing. The 1,014 fake recessions,
  the null containers, the bare-`x` container. *Owns:* `docs/audit/findings-metrics.md`. *Model:* strong builder.
  **Done 2026-10-05.** Ink box and geometric bearings true to 0.0101; optical bearings not — 1,026
  shape-filled entries uncorrected, 635 on a knife-edge, `paintbrush-4` null; "13.7–16.2px" was
  never measured. Every figure reprints from `tools/audit/metrics-probe.mjs`.
- [x] **1.13 The exceptions ledger.** Census done. Turn it into the ledger and judge each group:
  genuine agreed exception, or a missing rule wearing a note.
  *Owns:* `docs/audit/exceptions-ledger.md`. *Model:* strongest. **Done 2026-10-05.** 20 groups;
  the instrument is `tools/audit/notes.mjs`, which wave 4's exceptions sheet (4.3) reads. Proposals
  R-1..R-10.
- [x] **1.14 The rule register.** Every rule · every place stated · derived from how many drawings ·
  still holds at 481? · contradicts what · silent about what. Built on the rule-inventory sweep and
  **verifying docs/09 rather than repeating it**.
  *Owns:* `docs/audit/rule-register.md`. *Model:* strongest.
- [x] **1.15 Stated vs enforced.** Every rule a doc states that no check enforces; every check
  stricter than anything we decided; where lint and the docs disagree, which one is right.
  *Owns:* `docs/audit/enforcement-gap.md`. *Model:* strongest.
- [x] **1.16 Stale statements (Q4).** Every statement in CLAUDE.md, the docs and the plans that no
  longer matches the set, with the correct measured value and the exact edit — **as a list Maruti
  rules on. Nothing is edited.** Known starting set: the `grows:` / `gap:` / anchor convention
  lines, the dead Polaris node that doc 06's D23 rulings wait on, `box:` "first used by `folder`",
  the "2-unit gap" wording, the icon count, docs/08's superseded do-not-reopen entry, and lint's
  citations of `§5b` / `§5c` / `§5f` — section numbers that **do not exist** in docs/01, which has
  §1–§8 only. *Owns:* `docs/audit/stale-statements.md`. *Model:* Sonnet measure, strongest judge.
- [ ] **1.17 Polaris, for the D23 scope rulings.** Added 2026-10-04 when Maruti supplied the live
  source. doc 06 proposes adding `home`, `checkbox`, `save`, `chevrons-up-down`, cutting
  `caret-left/right`, merging `close`=`x` and `copy`=`duplicate`, and names 13 open slots — all of
  it blocked since CLAUDE.md's pointer (node `15643:27748`) died. **The live source is file
  `XewrhAKrNGVZtikkpI5am9`, page `15721:27960` "Polarris icons" — 499 COMPONENT nodes, all 20×20.**
  This is a scope question, not a drawing one: compare against `research/queue.md`'s 834 rows and
  `research/ranked.md`, and re-run `tools/audit.mjs` in a scratch copy (it reproduces byte-identical,
  verified). *Owns:* `docs/audit/references-polaris.md`. *Model:* Sonnet.
  *Bridge note:* only one agent at a time per Figma file; pass `fileKey` and never `figma_navigate`.

### Wave 2 — measure them (parallel with wave 1)

- [x] **2.1 Fluent → the hold/give curve across sizes.** *Model:* strongest. *Depends on:* 0.3.
- [x] **2.2 SF Symbols → closed vocabulary, and drawn vs derived across masters.** *Model:* strongest.
- [x] **2.3 Nucleo → grid discipline across five sibling families. Done.** `stroke_max` turned out not to be
  per-drawing headroom (see the table above). *Model:* Sonnet measure, strongest judge.
- [x] **2.4 Untitled UI → outline↔filled isolated.** *Model:* Sonnet.
- [x] **2.5 Central → the cost curve of a parameter change, across a sample of its component sets.** *Model:* Sonnet measure, strongest judge.
- [ ] **2.6 The field → the vocabulary of praise and the failure modes.** *Running.* *Model:* Sonnet ×2.
  *Owns:* `docs/audit/references.md` (one document, one section per source, each with
  **take / refuse / why**, every finding passed through the transfer test).

### Wave 3 — synthesise (depends on 1 + 2)

- [ ] **3.1 The judging standard.** The axes, each with what good looks like, how it is measured,
  where we stand — short enough to actually read. *Owns:* `docs/audit/judging-standard.md`. *Model:* strongest.
- [ ] **3.2 The findings register.** Every deviation, measured, grouped by axis, icons named, tagged
  one-off or systemic. Three kinds kept strictly apart and never mixed in one line:
  (1) a drawing disagrees with a stated rule; (2) a rule disagrees with another rule or the docs;
  (3) a drawing is fine by every rule and still looks wrong, and no rule covers it.
  *Owns:* `docs/audit/findings-register.md`. *Model:* strongest.
- [ ] **3.3 The parameter map.** Free choices vs derived values; change one → what recomputes, what
  is redrawn, what your eye must re-decide. Stroke-16 as the worked example.
  *Owns:* `docs/audit/parameter-map.md`. *Model:* strongest.
- [ ] **3.4 What a new set costs.** Change the radius / the weight / add a 32 master → here is the
  work, in order. *Owns:* same file, second half. *Model:* strongest.
- [x] **3.5 The severity proposal (Q2).** For every rule: should it hard-stop a drawing, stay a
  warning, or be a note — and why. The problem it answers: today only note syntax, root attributes,
  banned elements, decimals, margin, declared-box mismatch and anchor violations are errors.
  **Every geometric rule is advisory.** Also covers the three structural holes found in
  reconnaissance: the off-grid check silenced by any comment (`lint.mjs:216`), the unvalidated
  `optical:` escape, and the vacuous pass on an empty directory. **Proposal only — lint is not
  touched.** *Owns:* `docs/audit/severity-proposal.md`. *Model:* strongest. *Depends on:* 1.15.

### Wave 4 — surfaces (depends on 1)

Because a document cannot settle what only the eye can.

- [ ] **4.1 The wall.** The whole set at real 16px, sorted by ink mass · by stroke count · by family.
  *Owns:* `lab/audit-wall.html`. Reuses the `library.html` manifest pattern.
- [ ] **4.2 Primitive sheets.** One per shared primitive, every instance overlaid.
  *Owns:* `lab/audit-primitives.html`. Reuses the `figures.html` row pattern.
- [ ] **4.3 The exceptions sheet.** Every note in the set, grouped, each with its drawing.
  *Owns:* `lab/audit-exceptions.html`.
- [ ] **4.4 The eye-only list.** What no tool can settle, each pointing at the surface to settle it on.
  *Owns:* `docs/audit/eye-only.md`.
  *Model for wave 4:* strong builder; the list itself strongest.

### Wave 5 — prove

- [ ] **5.1 Fresh reviewer.** An agent that did none of the work checks every finding against the
  drawing or the file it names, and every number against the tool that produced it. Failures
  reported with evidence, never rounded up to "done".
- [ ] **5.2 The decision agenda.** One batch, ordered by how much of the set each ruling moves, each
  with a recommendation and the sheet to look at. **Folds in docs/09's six pending rulings rather
  than competing with them.** *Owns:* `docs/audit/decision-agenda.md`. *Model:* strongest.

---

## How the combined result is proven

- Every number in every register cites the tool run or the `path:line` that produced it. An
  unmeasured number is written `[needs measuring]` — never estimated.
- `node --test tools/audit/*.test.mjs` passes; each new instrument reproduces at least one number
  already known from a doc.
- `node tools/lint.mjs` at the end is byte-identical to the baseline captured at the start:
  **2,910 drawings · 2,848 clean · 62 warned · 0 failed** (the pinned baseline at `5933041`; see
  the head of this file). If it is not, this build changed
  something it should not have.
- `git status` shows no modification under `src/icons/`, `tools/lint.mjs`, `tools/geometry.mjs`,
  `research/queue.md`, `lab/drafts/` or `lab/manifest.json`.
- A fresh reviewer agent that did none of the work signs off (5.1).
- Audit tools and audit docs are committed separately, one topic per commit.

---

## Scope, as Maruti settled it — 2026-10-04

- [x] **Q1 — one decision list.** docs/09's six pending rulings (check cut weight · container
  radius · chevron-shift symmetry · variant cap and shared style tags · badges crossing 22 · D23
  revisions) are **folded into the audit's agenda** and the whole lot is ranked by how many icons
  each decision touches. One ordered list, not two. → card 5.2.
- [x] **Q2 — propose a severity model, change nothing.** The audit says which rules should hard-stop
  a drawing, which stay warnings, which are notes. Lint is not touched in this build. → card 3.5.
- [x] **Q3 — measure everything, judge the outliers.** Every axis runs mechanically over all 2,910
  drawings; hand judgement is spent only on what sticks out. Each wave-1 card therefore delivers
  **a full measurement table plus a short judged list**, never 485 verdicts.
- [x] **Q4 — list the stale statements, edit nothing.** Each wrong statement, the correct measured
  value, and the exact edit — as a document Maruti rules on. No doc is changed by this build,
  including the dead Polaris pointer. → card 1.16.
- Surface order: **the wall first** (Claude's call) — apparent weight and silhouette legibility can
  only be settled there.
