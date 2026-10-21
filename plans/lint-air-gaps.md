# Plan: two gaps in lint's air measurement (2026-10-20)

Status: **landed** — written 2026-10-20 in a side session, committed 2026-10-21 on Maruti's "lets go commit".
Ruled 2026-10-21 (Maruti): the floor at 16 is **1.25**, the line weight, as built; the four filled question marks
(`help-circle`, `-2`, `-3`, `-4`) are **redrawn to hold C19's 1** — a board for the main session, which owns
`src/icons/`. Still open: the three filled id-cards at 16 (a `gap: 1` note, or a redraw).

- [x] Gap 1 reproduced: a copy of `alert-circle-filled` with the dot moved up passes lint silent
- [x] Gap 1 measured: `holeGap` in `tools/geometry.mjs`, read by lint §5f, warns on the copy, prints an info line
- [x] Gap 2 reproduced on a bolt, or shown not to reproduce, with the numbers — it does not reproduce
- [x] Gap 2 census: the true throat of every shipped closed shape and hole, beside what lint reads — nothing missed
- [x] `node --test tools/geometry.test.mjs` passes, with a test per gap (156 tests)
- [x] `npm run check` on the shipped set: every drawing whose lines changed listed, old and new (below)
- [x] CLAUDE.md Tools row for `tools/geometry.mjs`, `docs/01-foundations.md` §6, and `plans/` updated in one change
- [x] Fresh reviewer agent (Opus) has checked the result against this plan — four fixes taken (a `gap:` note could raise the 16 floor; a 1.3 reading kept a stale note alive at 16; the numeral floor clashed with C19; stale wording), the Settled/doc 07 wording prepared below
- [x] Maruti's nod → commit (Maruti, 2026-10-21: "lets go commit"); two commits: the new check, then the bolt test

## What changes, in plain words

While two agents drafted `alert-octagon` and `zap` on 2026-10-20, each found a place where lint says
nothing and they had to measure by hand. A drawing under the 1.5 floor could pass `draft-check` clean.
A clean lint is not a correct drawing (doc 08 §10), but lint should at least see what it claims to see.

**Gap 1 — the disc left between two holes.** In `alert-circle-filled` the "!" is a bar slot and a dot
hole cut from one evenodd disc. The air *inside* each hole is read (§5f, §5i), and the material one
hole's two sides leave between themselves is read (§5c, `materialGap`), but **nothing reads the disc
between the slot and the dot**. Reproduced: with the dot moved up so 0.49 of disc is left at 20, and
0.25 at 24, lint prints only its usual two notes. Without the `glyph: dot` note the shipped 1.0 should
warn against 1.5 and does not either. The fix is a sibling of `materialGap` that pairs every hole with
every other hole of the same evenodd path, square-on and at the closest approach, through solid
material only. Lint §5f prints the reading as an info line ("material between two cut-outs …") and
warns under C19's 1 with `glyph: dot` (the dot to its body is exactly the pair C19 names), else the
master's line weight (1.5 · 1.5 · 1.25) lowered by the file's agreed gap where it has one — see "The
floor" under Results for why the line weight and not 1.5 at 16. Under `glyph: numeral` two holes of one
path are two numerals and keep that ordinary floor (C19: numeral to numeral stays 1.5).

**Gap 2 — the diagonal pinch at a bolt's inner corner.** The zap draft's notes say the tightest white
in a Z-bolt is "at each inner corner, across the waist to the far long edge", 1.65 at 16 for A, and
that a narrower bolt holds only 1.10 there while lint reads 2.09 square-on. **This does not reproduce.**
The true throat of a white region is a saddle of its inside-distance field: the level at which two
pools of white, each with its own widest circle, first join. Read off a 0.02 grid for the A bolt as
drawn and for 19 narrower bolts (8×14 and under, half-lean 0.25 · 0.5 · 1, step 2 … 3.5), the grid
throat and `facingGap`'s reading agree to within 0.02 in every case (A: 2.07 grid, 2.09 lint), and lint
warned exactly where the throat was under 1.5 (1.19 and 1.45 at step 2). The chord the generator
measured — from the inner corner's round to the far long edge's line — runs through the step's own
ink, not through white; the white it crosses is the pointed end of the arm, which is the inside of a
corner and is rightly not a gap. The two inner-corner rounds face each other diagonally, and that is
the real waist; `facingGap` reads it exactly as two bulges. A throat chord always has a common normal
at both ends (a circle inside the white cannot touch a convex corner of the white), which is why
square-on at both ends, with the bulge case read exactly, covers it. A census of every shipped closed
shape and hole with the same grid (`scratch census.mjs`) is the proof across the set; its result is
recorded below. **No new measure for gap 2 unless the census finds a throat lint misses.**

## Cards

| # | Scope | Files owned | Done when | Model |
|---|---|---|---|---|
| 1 | Reproductions (both gaps) and the census | scratchpad only | the numbers in this plan | Fable (this session) |
| 2 | `holeGap` in geometry; lint §5f reads it | `tools/geometry.mjs`, `tools/lint.mjs` | repro warns; info line printed | Fable (this session) |
| 3 | Tests: one per gap | `tools/geometry.test.mjs` | `node --test` passes | Fable (this session) |
| 4 | Shipped-set diff: lint before vs after, every changed line | none (report) | list in this plan | Sonnet agent |
| 5 | Docs: CLAUDE.md Tools row, docs/01 §6, this plan | `CLAUDE.md`, `docs/01-foundations.md`, `plans/lint-air-gaps.md` | one sentence each | this session |
| 6 | Review against the plan | none | reviewer's findings answered | Opus/Fable agent |

Cards 2–3 run together here; 4 runs once 2 is in; 5 and 6 after 4.

## How the combined result is proven

- Both reproductions: lint's lines before and after, quoted in the report.
- `node --test tools/geometry.test.mjs` passes.
- `npm run check`: the full set lints; every drawing whose lines changed is listed with old and new
  line. Expected: a new info line on every filled file with two or more holes in one shape, and no new
  warning unless a shipped drawing really has under 1.5 (or 1 under a glyph note) of material between
  two holes — any such case is investigated, not waved through.

## Results

### Gap 1 — before and after

Lint on a copy of `alert-circle-filled` at 20 with the dot moved up 0.5 (`13.62` → `13.12`):

- before: `✓ 20 alert-circle-filled` with only the grid note and the keyline note; nothing about the disc
- after: `warn 0.58 of material between two cut-outs of one shape at 10,11.83 — C19 glyph gap needs 1`
  (0.58, not the 0.49 a ruler on the numbers gives: the slot's end is an r 0.88 arc over a 1.75 chord,
  whose centre sits 0.09 inside, so the slot ends at 11.54 — the measure is exact)

The shipped files now print an info line: `material between two cut-outs 1 at 12,15` (24),
`1.08 at 10,12.08` (20), `1.08 at 8,9.33` (16). Without the `glyph: dot` note the shipped 24 warns
`1 of material … — §6 needs 1.5`, as it should.

### The floor — a decision for Maruti

What the material between two holes stands for differs by drawing, and lint cannot tell from the
geometry. In a knockout it is the **outline's air**: `alert-circle`'s dot to its bar, `id-card`'s head
to its shoulders. In a plate with cells cut out it is the **outline's line**: `window-2-filled`'s tick
between its two tab cells and `video-2-filled`'s bar between two sprocket holes are both **1.25 at
16**, the line weight, and both are correct drawings. The floor is therefore the thinnest either
reading allows: the master's line weight (1.5 · 1.5 · 1.25), a file's agreed `gap:`, or C19's 1 under
a `glyph:` note. At 24 and 20 that is §6's 1.5 exactly; only at 16 is it 1.25 instead of 1.5.
**Alternative:** hold material to 1.5 at every master like white. That flags `window-2-filled` and
`video-2-filled` at 16, both drawn to the rule for lines, so it is not recommended.

### Shipped set — every drawing whose lint lines changed (4,380 drawings; 2 warned before, 14 after, 0 failed)

**220 drawings** change: each gains the info line `material between two cut-outs N at x,y` (75 at
24, 71 at 20, 62 at 16 gain the line and nothing else). Every reading under 1.3 that does not warn is
in a `glyph: dot` file (floor 1: the `alert-*`, `info-circle*`, `help-circle-3` twins at 0.99–1.13) or
is one of the two 1.25 lines at 16 above.

**12 drawings gain a warning.** Before, each was `✓` with no air line; after, each is `!` with:

| Drawing | New line | What it is |
|---|---|---|
| 24 `help-circle-filled` | `0.77 of material between two cut-outs of one shape at 12,15.12 — C19 glyph gap needs 1` | the `?`'s terminal to its dot |
| 24 `help-circle-2-filled` | `0.92 … at 12,15.04 — C19 glyph gap needs 1` | same |
| 24 `help-circle-4-filled` | `0.75 … at 12,15.13 — C19 glyph gap needs 1` | same |
| 20 `help-circle-2-filled` | `0.91 … at 10,12.55 — C19 glyph gap needs 1` | same |
| 20 `help-circle-4-filled` | `0.92 … at 10.01,12.29 — C19 glyph gap needs 1` | same |
| 16 `help-circle-filled` | `0.87 … at 8,9.57 — C19 glyph gap needs 1` | same |
| 16 `help-circle-2-filled` | `0.87 … at 8,9.57 — C19 glyph gap needs 1` | same |
| 16 `help-circle-3-filled` | `0.92 … at 8.01,9.41 — C19 glyph gap needs 1` | same |
| 16 `help-circle-4-filled` | `0.92 … at 8.01,9.29 — C19 glyph gap needs 1` | same |
| 16 `id-card-filled` | `1 of material … at 6,8.75 — the 16 line weight needs 1.25` | head to shoulders |
| 16 `id-card-2-filled` | `1 … at 8,10.75 — the 16 line weight needs 1.25` | same |
| 16 `id-card-3-filled` | `1 … at 6,10.75 — the 16 line weight needs 1.25` | same |

**The help-circles (9 drawings, 4 concepts).** The outline twins hold C19's 1 between the `?` and its
dot (at 24, `help-circle`: terminal cap at 13.73 + 0.75 = 14.48, dot top at 16.75 − 1.25 = 15.5, air
1.02). The filled twin cuts the `?` wider than the outline's stroke (C18: 2 at 24 against 1.5), and the
dot hole is the dot's full size, so the disc left between them is 0.25 less: **0.77**. That is the
case the measure exists for — 5c's principle "a knockout may not be cut wider than the counter it sits
in", across two holes. Maruti decides: redraw the filled `?`s (lower terminal or narrower cut) to hold
1, or accept them as drawn. Nothing has been changed in `src/icons/`.

**The id-cards (3 drawings at 16).** The outline carries `<!-- gap: 1 -->` for the head-to-shoulders
air, agreed 2026-10-19, and its note says the filled twin "needs no note" because there the 1 is card,
not air. Lint now reads that card. The honest fix is the same note on the three filled 16 files — the
exception then lives on every file that uses it — and lint prints `agreed gap 1 — smallest measured 1`
there. Maruti's call, since it is a note on a shipped file; the main session owns `src/icons/`.

### Gap 2 — the census of every shipped closed shape and hole

Every closed outline shape and every filled hole in the shipped set, about 1,100 per master, read on a 0.04
grid for its true throat: the narrowest white where two pools of white meet. Each is set beside what lint
warns.

- **24:** nine shapes come under 1.75, none under 1.47, and lint is right to be silent on all nine.
- **20 and 16:** nine drawings read 1.46: `phone`, `store`, `-2`, `-2-filled`, `package-3-filled`,
  `translate-2-filled`, `vault-2-filled`. Each is drawn at exactly 1.5. Lint's square-on reading gives
  1.5 or 1.49 there. Re-read on a 0.01 grid they come to 1.49–1.50, so the gap was the coarse grid
  reading short, not a throat lint misses.

**Result: no shipped drawing has a throat lint does not read.** Gap 2 needs no new measure, and none was
built. Its test pins the bolt's waist reading instead.
