# Plan: the air between an arrowhead's legs and its shaft (2026-10-24)

Status: **closed but for the redraw list** — written 2026-10-24 in a side session started from the Design Tools
round; the check committed the same day on Maruti's "commit", and the floor ruled the same day: **1, C37** (Maruti:
"do whatever is needed", taken as the plan's two recommendations). The drawings already under it stay as approved
and are listed below, worst first, for the icon loop to redraw when each family is next touched.

- [x] Throwaway probe: how heads are drawn across `src/icons/`, and that one reading finds them all (below)
- [x] `headAir` in `tools/geometry.mjs`, with tests in `tools/geometry.test.mjs`
- [x] Lint §5l reads it, as a **warning** only, each path at its own weight, outline and filled
- [x] Census: every shipped drawing it flags, with numbers
- [x] `node --test tools/geometry.test.mjs` passes; `npm run check` has no new errors; every drawing whose
      lint lines changed is listed
- [x] A floor proposed to Maruti from the census, in plain words
- [x] Fresh reviewer agent (Fable) has checked the result against this plan — findings and answers below
- [x] Committed as built, warning at 1.5 (Maruti, 2026-10-24: "commit")
- [x] Maruti's ruling on the floor → the constant, docs/01 §6, CLAUDE.md, this plan in one change → commit
      (2026-10-24: 1, C37 — `HEAD_GAP` in `tools/masters.mjs`, lint §5l, docs/01 §6, doc 07 C37, CLAUDE.md
      Settled table, geometry block and Tools row, the icon skill)
- [ ] Deferred: the redraw list below — the icon loop's, one family at a time, Maruti's eye on each

## What changes, in plain words

An arrowhead's two legs leave a small wedge of white on each side of the shaft, between the leg and the
shaft. When the legs are short, or the line is heavy, that wedge closes up at 16 and the head reads as a
solid tip, or as a smudge. Lint has never measured it:

- §5 reads two paths that touch or cross as **joined by design** and measures nothing between them. A shaft
  ends inside its head's point, so the head and the shaft are always "joined".
- `armTipGap` (the crossing arms of §5 and §5h) reads only junctions whose arms go all the way round. An
  arrowhead's arms all sit on one side of its point, so it is left out — by design, since its "tip air at
  equal reach" is the wrong picture for a head (Maruti, 2026-10-20; docs/01 §6).

So on 2026-10-24 the `rotation` and `flip-*` boards had heads with −0.34 to 0.25 of air between leg and arc
and still passed `draft-check` clean, and shipped icons already sit under §6's 1.5 there (rotate-ccw filled
0.83 · 0.90 · 0.67, measured by hand when it was approved).

After this change lint prints a warning when a head's leg comes closer to its shaft than the floor, with the
place and the number, in every outline and filled drawing. The floor itself is Maruti's (below).

## The measure

**A head** is a point of one open stroked path — a corner whose two legs both run straight out to a round
cap — opening under 120°. A C10 bend at the point (the corner arc of radius half the weight) is read as the
sharp corner it rounds.

**Its shaft** is another open stroke — another path, or another subpath of the same `d` — that reaches the
point inside the head's ink (its centreline no farther than half the heavier weight from the sharp corner, or
from the bend's arc where it rounds that corner) and leaves it **between the two legs**. A straight shaft
(`arrow-right`), a 45° run off an arc (`rotate-ccw`), an arc arriving on its own, and a line that runs on
through the point and out the far side (`gift-card-2`'s ribbon through its bow, 1.5) all count; the whole of
that stroke is the shaft, so an arc that curls back toward a leg is read where it comes nearest. The rule is
geometric: any such point is a "head", whatever it draws. In the set every one is an arrowhead except that bow.

**The air** at each leg is the distance from the leg's cap centre to the nearest point of the shaft's
centreline, less half of each path's own weight — the white at the mouth of the wedge, which is the widest
the wedge's white gets before it opens out. It is exactly the drawer's "head counter" (rotate-ccw's comment:
2.04 · 1.51 · 1.58). It is read only where the wedge closes: where a leg's nearest point on the shaft is the
shaft's own end at the point, the two part at 90° or more and there is nothing to close. Negative air means
the leg's cap overlaps the shaft's ink: the wedge is shut and the head reads as a solid tip.

Distances are exact (segments, and circular arcs as arcs; anything else flattened to 1e-4).

**Not read, by design** (found by the probe; each listed so it is not mistaken for coverage):

- a **half head** drawn in one stroke with its shaft (`transfer-2`'s harpoon). Its point is a single-path
  bend, and in one stroke it cannot be told from a numeral's flag or a letter's corner (`list-ordered`'s 1,
  `sort-alpha`'s Z, `won`'s W). `transfer-2-filled` at 16 holds 0.63 there. A follow-up for Maruti.
- a **V on a line from outside** (bluetooth, yen, the antennas of `tv`): the stroke at the point leaves it
  outside the legs, so there is no head.
- a **knocked-out arrow** (`import-filled`: the arrow is white cut out of the tray): the solid between barb
  and shaft is a knockout's material, §5c's reading.

## Cards

| # | Scope | Files owned | Done when | Model |
|---|---|---|---|---|
| 1 | Throwaway probe of how heads are drawn | scratchpad only | the scope above | Opus (this session) |
| 2 | `headAir` in geometry, tests | `tools/geometry.mjs`, `tools/geometry.test.mjs` | `node --test` passes; matches the hand-measured precedents | Opus (this session) |
| 3 | Lint §5l, warning only | `tools/lint.mjs` | warns on a copy of a tight head; no new errors on the set | Opus (this session) |
| 4 | Census: lint before vs after on the shipped set, every changed line | none (report) | list below | Opus (this session) |
| 5 | Floor proposal | this plan | Maruti can rule from it | Opus (this session) |
| 6 | Review against this plan | none | findings answered | Fable, else Opus (fresh agent) |
| 7 | On Maruti's ruling: constant, docs/01 §6, CLAUDE.md Tools row and Settled table | `tools/masters.mjs`, `docs/01-foundations.md`, `CLAUDE.md` | one change, one commit | this session |

The code is built in a scratch copy of `tools/` and copied in only once it is whole, so the main session's
`draft-check` never runs a half-built lint. `npm run check` writes `lab/manifest.json`, which the main session
owns while 29 boards are in review, so the set is linted with `node tools/lint.mjs` (the half of `npm run
check` that judges) and the build half is left alone.

## How the combined result is proven

- The hand-measured precedents read the same: rotate-ccw outline 2.04 · 1.51 · 1.58, filled 0.82 · 0.90 ·
  0.67 (its comment rounds the 24 to 0.83); rotate-ccw-6 outline 0.97 · 1.05 at 20 and 16; expand-horizontal outline 1.28 · 1.03 · 0.95, filled
  −0.22 · 0.28 · −0.18.
- Tests: a classic head, a head on an arc, a wide head, a shaft running through, a point rounded on a
  container radius, a V on a line from outside, a chevron and a harpoon (not read), a leg whose nearest point
  is the point itself (not read), each path at its own weight, and lint's line with and without a `gap:` note.
- `node --test tools/geometry.test.mjs` passes; `node tools/lint.mjs` before and after on the shipped set,
  every changed line listed; no new error.

## Results

### The probe (card 1)

Every sharp corner of an open stroke (after `skeleton`), opening under 135°, with another stroke reaching it,
across all 6,258 shipped drawings: 1,363 such corners. 1,125 are arrowheads in the plan's sense (two capped
legs, a stroke ending at the point between them). The rest are not heads, and the rules above leave them out:
217 where the stroke leaves the point outside the legs (bluetooth, yen, `tv`'s antennas, `gift-card`'s bow),
16 where a leg ends in a turn rather than a cap (`map-pinned`, `package-shield-2`: corners of a larger
shape), and 3 where a closed path runs through a corner (`book` at 16, its spine). The other 2 are
`gift-card-2`'s ribbon running down through its bow's Λ, which the measure reads (1.5, on the floor). So
`headAir` gives 1,127 readings; the heads open at 88.7–91.1° (the classic head, 1,097) or 107.7–111.1°
(`arrow-*-3`, 30). No head was missed: every
arrow-like name with no reading is a chevron alone, a solid caret, a harpoon in one stroke (`transfer-2`),
a corner bracket (`maximize`), or a knocked-out arrow (`import-filled`).

### The measure (cards 2–3)

- The hand-measured precedents read the same: rotate-ccw outline **2.04 · 1.505 · 1.58**, filled **0.82 ·
  0.9 · 0.67**; rotate-ccw-6 outline 1.51 · **0.97 · 1.05**; expand-horizontal outline **1.28 · 1.03 · 0.95**,
  filled **−0.22 · 0.28 · −0.18**. (The drawer's 1.51 at 20 is 1.505; its 0.83 filled at 24 is 0.82.)
- `node --test tools/geometry.test.mjs`: **187 pass** (179 before, 8 new), in the repo after the copy.
- `node tools/lint.mjs` on the shipped set, old tools against new, run side by side on the same files, in the
  repo at HEAD fd842e2d (after the Design Tools approval chain): 6,576 drawings, **0 failed** both; warned
  **22 → 424**. Exactly 402 drawings changed, and each changed by one or more added arrowhead lines and nothing
  else — no line removed, no other line added. (Before the chain, at cdec5ca0: 6,258 drawings, 22 → 422, 400.) `sort-filled` at 16 (gap 1) holds its note exactly at the heads (1.0) and keeps
  "agreed gap 1 — smallest measured 1"; `sort` at 16 keeps "smallest measured 1.38" (its heads read 2.13);
  the six `sort-alpha-*-filled` hold their own notes.
- `node --test tools/audit/*.test.mjs`: 774 / 776, the same two failures before and after. Both are
  `exceptions-data`'s `patchLint`, which has not fitted lint since §5j (99bdba79, 2026-10-21: "expected the
  CROSS skip once, found 0"); §5l adds one more 0.01-slack comparison, so it now stops one step earlier ("found
  11"). A follow-up for that audit instrument, not this check.
- `npm run check`'s build half writes `lab/manifest.json`, which the main session owns, so only its lint half
  was run here; build reads nothing this change touches.

### Census: every shipped head (card 4)

872 drawings on 147 concepts have a head (at fd842e2d). The tightest head per drawing:

| | shut (≤ 0) | 0–0.5 | 0.5–1 | 1–1.25 | 1.25–1.5 | ≥ 1.5 | drawings |
|---|---|---|---|---|---|---|---|
| outline 24 | 0 | 4 | 6 | 11 | 6 | 120 | 147 |
| outline 20 | 4 | 17 | 13 | 8 | 0 | 105 | 147 |
| outline 16 | 1 | 19 | 16 | 7 | 0 | 103 | 146 |
| filled 24 | 20 | 12 | 13 | 62 | 1 | 36 | 144 |
| filled 20 | 25 | 9 | 17 | 6 | 12 | 75 | 144 |
| filled 16 | 26 | 17 | 68 | 7 | 0 | 26 | 144 |

(Each band includes its top: the classic filled head at 16, exactly 1.0, sits in 0.5–1.)

Two of today's Design Tools drawings joined it. `select-2`'s bracket head on its diagonal reads **1.51 · 0.8 ·
0.7** in outline (0.695 at 16) — it shipped today, passing `draft-check` through this very blind spot (its filled twin draws
the arrow as shapes, so has no stroked head). `eyedropper` reads a "head" at 10.38 · 7.16 · 5.46: its tip is a
corner of the pipette with the drip line leaving between its sides — the rule is geometric, and the white is
real, if never tight.

What lint flags today, at §6's 1.5 or the file's `gap:` note: **402 drawings on 119 concepts**. Every one,
grouped where concepts share their numbers; **bold** is under the floor, plain passes, – has no head:

| Concepts | Outline 24 · 20 · 16 | Filled 24 · 20 · 16 |
|---|---|---|
| `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up`, `arrows-swap-2`, `arrows-swap`, `collapse-2`, `corner-down-left-2`, `corner-down-left`, `corner-down-right-2`, `corner-down-right`, `corner-left-down-2`, `corner-left-down`, `corner-left-up-2`, `corner-left-up`, `corner-right-down-2`, `corner-right-down`, `corner-right-up-2`, `corner-right-up`, `corner-up-left-2`, `corner-up-left`, `corner-up-right-2`, `corner-up-right`, `download-2`, `download-3`, `download`, `expand-2`, `login-2`, `login-3`, `login-4`, `login`, `logout-2`, `logout-3`, `logout-4`, `logout`, `merge`, `redo-2`, `redo-3`, `sort-2`, `sort-ascending`, `sort-descending`, `transfer`, `undo-2`, `undo-3`, `upload-2`, `upload-3`, `upload` | 2.75 · 2.25 · 2.13 | **1.25** · 1.5 · **1** |
| `arrow-down-left`, `arrow-down-right`, `arrow-up-left`, `arrow-up-right-5`, `arrow-up-right`, `maximize-4`, `trending-down-2`, `trending-down`, `trending-up-2`, `trending-up` | 2.74 · 2.21 · 2.11 | **1.04** · **1.36** · **0.83** |
| `move-2`, `move`, `viewport-narrow-3`, `viewport-narrow`, `viewport-short-3`, `viewport-short`, `viewport-tall-3`, `viewport-tall`, `viewport-wide-3`, `viewport-wide` | **1.2** · **0.5** · **0.4** | **-0.3** · **-0.25** · **-0.72** |
| `repeat-2`, `repeat-3`, `repeat`, `repeat-once`, `replay`, `reset-3`, `shuffle` | 1.75 · **0.75** · **0.75** | **0.25** · **0** · **-0.37** |
| `redo`, `rotate-ccw-2`, `rotate-ccw-3`, `rotate-ccw`, `rotate-cw`, `undo` | 2.04 · 1.51 · 1.58 | **0.82** · **0.9** · **0.67** |
| `collapse`, `collapse-horizontal`, `expand`, `expand-horizontal` | **1.28** · **1.03** · **0.95** | **-0.22** · **0.28** · **-0.18** |
| `rotate-ccw-10`, `rotate-ccw-5`, `rotate-ccw-7`, `rotate-ccw-8` | 2.04 · 1.51 · 1.58 | **0.54** · **0.76** · **0.45** |
| `calendar-repeat`, `subscription-2`, `subscription` | **0.25** · **-0.25** · **0.13** | **0.25** · **-0.25** · **0.13** |
| `indent-3`, `outdent-3` | **0.75** · **0.75** · **1** | **-0.25** · **0.25** · **0.25** |
| `sort-alpha-ascending`, `sort-alpha-descending` | 1.75 · **1.25** · **1.13** | 1.75 (gap 1.17) · 1.25 (gap 0.93) · 1.13 (gap 0.88) |
| `sort-numeric-ascending`, `sort-numeric-descending` | 1.75 · **1.25** · **1.13** | 1.75 · **1.25** · **1.13** |
| `calendar-repeat-2` | **1.25** · **0.5** · **0.75** | **1.25** · **0.5** · **0.75** |
| `currency-convert` | **1** · **0.5** · **0.5** | **-0.5** · **-0.25** · **-0.62** |
| `minimize-4` | 2.74 · 2.21 · 1.58 | **1.04** · **1.36** · **0.3** |
| `receipt-refund` | **0.5** · **0** · **0** | **0.5** · **0** · **0** |
| `refresh` | 2.04 · 1.51 · 1.58 | **0.83** · **0.9** · **0.65** |
| `refresh-2` | 2.74 · 2.21 · 2.11 | 1.54 · 1.61 · **1.18** |
| `refresh-3` | 2.74 · 1.86 · 1.58 | 1.54 · **1.25** · **0.65** |
| `replace` | **1** · **0.5** · **0.25** | **1** · **0.5** · **0.25** |
| `replace-2` | 1.68 · 1.68 · 1.55 | **0.54** · **1.13** · **0.48** |
| `replace-3` | **1** · **0.5** · **0.25** | **0** · **0** · **-0.5** |
| `replay-2` | **1.35** · **0.42** · **0.36** | **1.35** · **0.42** · **0.36** |
| `reset` | 1.75 · **0.75** · **0.75** | 1.75 · **0.75** · **0.75** |
| `reset-2` | **1.4** · **0.47** · **0.47** | **-0.02** · **-0.25** · **-0.51** |
| `rotate-ccw-11` | 2.04 · **0.97** · **1.05** | 2.04 · **0.97** · **1.05** |
| `rotate-ccw-6` | 1.51 · **0.97** · **1.05** | 1.51 · **0.97** · **1.05** |
| `select-2` | 1.51 · **0.8** · **0.7** | – · – · – |
| `shuffle-2` | 2.04 · 1.51 · 1.58 | **0.33** · **0.65** · **0.3** |
| `sort` | 2.75 · 2.25 · 2.13 (gap 1) | **1.25** · 1.5 · 1 (gap 1) |
| `split` | 3.27 · 1.86 · 1.58 | 1.57 · **1** · **0.3** |
| `split-2` | 2.75 · 1.75 · 1.5 | **1.25** · **1** · **0.38** |
| `transfer-3` | 2.75 · 1.5 · **1.25** | **1.25** · **0.75** · **0.13** |
| `translate` | **1** · **0.5** · **0.25** | **-0.5** · **-0.25** · **-0.87** |

### What the eye sees

Fifteen shipped heads from −0.72 to 2.13, rasterised from their outlines in real pixels — the 16 master at
16 px and at 32 px (2× screens), coverage-sampled 8 × 8 per pixel — are in
`/private/tmp/claude-501/-Users-maruti-avantsa-a-1--Claude-Workspace-Mavan-Drawer/21060f28-88a4-474f-8037-e9ead378ad6f/scratchpad/strip/`
(`ladder16-zoom.png` at 16 px, `ladder16-2x-zoom.png` at 32 px, `ladder16.png` both at real size):

- **1 and over:** the head still reads as an arrowhead. Filled, it is a solid triangle that keeps its point
  (`arrow-right-filled`, 1.0); outline, the legs stand open beside the shaft (`arrow-right`, 2.13).
- **Between 0 and 1:** the wedge is a grey pixel or two inside the head. A filled head reads as a solid wedge
  (`refresh-filled`, 0.65 — approved knowing it "closes to a solid wedge at 16"). An outline head goes dark:
  at 16 px it is a blot at the end of a lighter line (`move` 0.40, `replace` 0.25, `expand` 0.95). At 32 px
  the same outline heads still read as small open heads.
- **0 and under:** the caps swallow the wedge. At 32 px the heads turn into round knobs and domes — the point
  is gone (`move-filled` −0.72, `expand-filled` −0.18).

### The floor — for Maruti

**Recommended: 1, at every master, outline and filled.** It is where a head still reads as an arrowhead at
16 px, and the set's own classic filled head at 16 sits exactly on it (the head every composite uses:
2.75 · 2.25 · 2.13 outline, 1.25 · 1.5 · 1.0 filled). It is also C19's floor for white inside one mark (a dot
to its body, a 2's mouth), which is what a head's wedge is. At 1 lint flags **231 drawings on 66 concepts**:
the small heads (`move`, the eight `viewport-*`, `expand`/`collapse` ×4, `repeat`/`shuffle`/`replay`/`reset`
×9, `subscription`/`calendar-repeat` ×4, `translate`, `currency-convert`, `replace` ×3, `indent-3`,
`outdent-3`, `receipt-refund`, `transfer-3`, `split` ×2, and today's `select-2` at 20 and 16), the filled
rotate/refresh/undo/redo heads (0.45–0.97), and the diagonal arrows' filled 16 (0.83).

Not recommended:
- **1.5, §6 as written:** 402 drawings on 119 concepts (after the files' own `gap:` notes), among them every classic filled arrow (1.25 · 1.5 ·
  1.0). The filled rule makes that structural — a heavier line in the same ink box gives up 1.1–1.5 of the
  outline's air — so holding 1.5 would mean redrawing the classic filled head and the ~50 composites that use it.
- **Shut or at least 1** (a fully closed head allowed as a solid tip): 155 drawings. The shut heads are the
  ones that lose their point at 32 px.

**And the drawings already under it** (Maruti's second call): they were approved with these numbers in their
comments. Recommended: leave them as they are and keep them as a redraw list, worst first — the shut heads
(knobs) and the outline blots under 0.5 — while lint keeps warning on them, as `plans/lint-currency-fixes.md`
keeps its tight spots. The other way is to write the floor into each as a per-file note; that is a new note
and a new rule, so only on your word.

On the ruling: a `HEAD_GAP` constant beside `MIN_GAP` in `tools/masters.mjs`, §5l floored at the lower of it
and the file's `gap:` note, and docs/01 §6, CLAUDE.md and this plan changed in the same commit.

### Review (card 6)

A fresh agent (Fable) reviewed the scratch tools against this plan, with its own probes. It found no wrong
reading in the set: 1,127 heads, none reported twice; no head drawn as two separate legs (the 72 places three
strokes share an end are three-spoke junctions — `gear-3`, `chart-pie-3`, `gift`, `presentation`); 602 warning
lines on the 400 drawings, one per head under the floor; the `gap:` note and badge wiring as §5j's. Taken:

- **A point rounded on a container radius was missed.** "Reaches the point" was tested only against the sharp
  corner the bend rounds, which a 2.5 radius leaves 1.04 off the drawn arc, so a stroke ending on the arc was
  not a shaft. Now the arc's own nearest point is tried too, with a test. None in the set: the census is
  byte-identical with and without it, run on the same files.
- **The plan said a shaft running through the point is not read; the code reads it** (`gift-card-2`'s bow,
  1.5 at 24 and 20). The plan now says it is read, and that any point with a stroke leaving between its legs
  counts as a head, whatever it draws (a chart's axes with a trend line from their corner would read too).
- Comments: §5d's list of the checks a `gap:` note governs now names §5j and §5l. CLAUDE.md and docs/01 are
  edited in the working tree ahead of the tools: they go in one commit with them.

## Ruling (2026-10-24)

Maruti, on the floor and the shipped drawings under it: "do whatever is needed" — taken as the two
recommendations above, and said so in the report.

- **The floor is 1** (C37, `HEAD_GAP` beside `MIN_GAP` in `tools/masters.mjs`), at every master, outline and
  filled. Lint §5l floors at it, or at the file's `gap:` note where that is lower (a note above 1 does not raise
  it); a C33 badge's own head keeps 1. A head reading feeds §5d's "is the note needed" only under 1, where the
  note does the work.
- **The drawings already under it stay as approved**, with lint warning on each, and are the redraw list below.
  None is redrawn here: a redraw is a drawing, and the eye picks it (C0, C15).

Checked at 5e9b28bb, the committed lint against this one run side by side on the same 6,612 drawings: 0 failed
both; warned **424 → 253** (22 + the 231 below). 402 drawings changed and nothing else did: 604 head lines at
§6's 1.5 went, 384 at C37's 1 came, 171 drawings went clean — the classic filled arrows among them — and the
80 "agreed gap" lines are unchanged. Geometry tests 187, audit tests 778, all pass.

### The redraw list — 231 drawings on 66 concepts, worst first

**Bold** is under C37's 1; plain holds it; – has no head. Measured at fd842e2d.

| Concepts | Outline 24 · 20 · 16 | Filled 24 · 20 · 16 |
|---|---|---|
| `translate` | 1 · **0.5** · **0.25** | **-0.5** · **-0.25** · **-0.87** |
| `move-2`, `move`, `viewport-narrow-3`, `viewport-narrow`, `viewport-short-3`, `viewport-short`, `viewport-tall-3`, `viewport-tall`, `viewport-wide-3`, `viewport-wide` | 1.2 · **0.5** · **0.4** | **-0.3** · **-0.25** · **-0.72** |
| `currency-convert` | 1 · **0.5** · **0.5** | **-0.5** · **-0.25** · **-0.62** |
| `reset-2` | 1.4 · **0.47** · **0.47** | **-0.02** · **-0.25** · **-0.51** |
| `replace-3` | 1 · **0.5** · **0.25** | **0** · **0** · **-0.5** |
| `repeat-2`, `repeat-3`, `repeat`, `repeat-once`, `replay`, `reset-3`, `shuffle` | 1.75 · **0.75** · **0.75** | **0.25** · **0** · **-0.37** |
| `calendar-repeat`, `subscription-2`, `subscription` | **0.25** · **-0.25** · **0.13** | **0.25** · **-0.25** · **0.13** |
| `indent-3`, `outdent-3` | **0.75** · **0.75** · 1 | **-0.25** · **0.25** · **0.25** |
| `collapse`, `collapse-horizontal`, `expand`, `expand-horizontal` | 1.28 · 1.03 · **0.95** | **-0.22** · **0.28** · **-0.18** |
| `receipt-refund` | **0.5** · **0** · **0** | **0.5** · **0** · **0** |
| `transfer-3` | 2.75 · 1.5 · 1.25 | 1.25 · **0.75** · **0.13** |
| `replace` | 1 · **0.5** · **0.25** | 1 · **0.5** · **0.25** |
| `minimize-4` | 2.74 · 2.21 · 1.58 | 1.04 · 1.36 · **0.3** |
| `shuffle-2` | 2.04 · 1.51 · 1.58 | **0.33** · **0.65** · **0.3** |
| `split` | 3.27 · 1.86 · 1.58 | 1.57 · 1 · **0.3** |
| `replay-2` | 1.35 · **0.42** · **0.36** | 1.35 · **0.42** · **0.36** |
| `split-2` | 2.75 · 1.75 · 1.5 | 1.25 · 1 · **0.38** |
| `rotate-ccw-10`, `rotate-ccw-5`, `rotate-ccw-7`, `rotate-ccw-8` | 2.04 · 1.51 · 1.58 | **0.54** · **0.76** · **0.45** |
| `replace-2` | 1.68 · 1.68 · 1.55 | **0.54** · 1.13 · **0.48** |
| `calendar-repeat-2` | 1.25 · **0.5** · **0.75** | 1.25 · **0.5** · **0.75** |
| `refresh` | 2.04 · 1.51 · 1.58 | **0.83** · **0.9** · **0.65** |
| `refresh-3` | 2.74 · 1.86 · 1.58 | 1.54 · 1.25 · **0.65** |
| `redo`, `rotate-ccw-2`, `rotate-ccw-3`, `rotate-ccw`, `rotate-cw`, `undo` | 2.04 · 1.51 · 1.58 | **0.82** · **0.9** · **0.67** |
| `select-2` | 1.51 · **0.8** · **0.7** | – · – · – |
| `reset` | 1.75 · **0.75** · **0.75** | 1.75 · **0.75** · **0.75** |
| `arrow-down-left`, `arrow-down-right`, `arrow-up-left`, `arrow-up-right-5`, `arrow-up-right`, `maximize-4`, `trending-down-2`, `trending-down`, `trending-up-2`, `trending-up` | 2.74 · 2.21 · 2.11 | 1.04 · 1.36 · **0.83** |
| `rotate-ccw-11` | 2.04 · **0.97** · 1.05 | 2.04 · **0.97** · 1.05 |
| `rotate-ccw-6` | 1.51 · **0.97** · 1.05 | 1.51 · **0.97** · 1.05 |

Lint cannot read a head drawn as filled shapes, so these are on the list by hand (measured with the
transform drawer's `counter.mjs` on the centrelines the fills trace, 2026-10-24): `rotation-filled` and
`rotation-cw-filled` carry `rotate-ccw-filled`'s and `rotate-cw-filled`'s head, **0.82** · **0.9** · **0.67** —
redraw them with that family's filled head. Their outline heads hold 2.04 · 1.51 · 1.58.
`rotation-360-3-filled` at 16 ships with its head at **0.75**, declared as the file's `gap` (Maruti, 2026-10-24: a
tilted loop that fits the 12 box gets no further than 0.89), so lint prints it as an info line, not a warning — it
belongs on this list too.
