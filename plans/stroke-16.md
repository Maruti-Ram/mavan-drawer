# Plan — the 16 master moves to a 1.25 stroke

Status: **landed** — converted, reviewed, decided and committed · written 2026-09-20, converted 2026-09-20

**Start here (fresh session):** this build is closed. The 16 master draws at 1.25; every decision is in the
Status list and "What the conversion found". Two follow-ups are open and neither blocks drawing: lint's
knockout check over-measures `help-4-filled` (it assumes the cut is centred on the outline), and lint's
`polyGap` should carry real subpath breaks. `folder` (#30) is off hold. Re-run the proof at any time:
`node tools/inkbox-guard.mjs`, `npm run check`, `node --test tools/geometry.test.mjs`.

## What changes, in plain words

Icons drawn for 16px get a slightly lighter line: **1.25 instead of 1.5**. The 20 and 24 masters stay
at 1.5. Every 16 icon keeps **exactly the size and position it has today** — only the line gets
lighter, so it sits better beside 16px text. The share of the canvas the line takes becomes
6.3% · 7.5% · 7.8% (24 · 20 · 16) instead of 6.3% · 7.5% · 9.4%: still a touch heavier as icons get
smaller, no longer a jump.

Why now: Maruti's blind pick on `lab/refs/stroke16.html` (2026-09-20) leaned 1.25, and C7's own test
for reopening — *a reference that draws a separate 16 master and still goes lighter* — is met by the
Cursor set (16 grid at 1.25, 24 grid at 1.5). Measured on our own drawings: `help` at 16 drops from
71.2 px of ink to 60.7 (Central: 47.2).

## What it costs (measured or derived, so nothing surprises us later)

- **Retina crispness.** 1.5 is exactly 3 device pixels on a retina screen; 1.25 is 2.5 and cannot land
  cleanly on both edges. Fully solid pixels for `trash` at retina: 214 → 144. Accepted as the price of
  the lighter line; shown again on the proof sheet.
- **Centred lines get a little greyer on ordinary screens.** A line on the canvas centre (plus, minus,
  arrows, menu) peaks at 62.5% ink per pixel instead of 75%. `[needs measuring]` on the proof sheet.
- **A third decimal at 16.** To keep a container's outside edge exactly on a pixel, its centreline
  must sit on x.375 / x.625. So the 16 master works on an eighth grid with 3 decimals; 24 and 20 keep
  the quarter grid and 2 decimals. (Claude's call — it is what keeps the edges clean.)

## What the proof found (2026-09-20, `lab/refs/stroke16-proof.html`)

- 7 of the 8 redrawn icons keep their ink box **exactly**. The exception is every **bent mark**:
  `chevron-down` keeps its width (10.5) and its 45° legs, but the tighter bend (0.625) and thinner
  line make its ink 5.61 tall against 5.69. Holding the height instead would bend the legs to 45.5°.
  Angle and width were held; the mark is set 0.035 lower so its centre stays on the declared 8.38.
  **The guard in card 3 therefore allows bent marks 0.1 on the bend's axis, and nothing else.**
- `file-text-2`'s bottom gap goes 1.25 → 1.625: legal, warning gone. `help`'s counter opens 2 → 2.5
  and its mouth 1.45 → 1.91. `trash`'s lid rises 0.375 (tab-to-lid air stays 1.5), so the body is taller.
- Ink at 16×16: `help` 71.2 → 60.9, `trash` 63.3 → 54.5, `search` 46.4 → 40.7 (−12 to −15%).
  Retina solid pixels: `trash` 214 → 165, `chevron-down` 71 → 38 — diagonals lose the most crispness.

## What does *not* change

- Sizes, keylines, size steps (C8), optical shifts (C14) — the ink box of every 16 icon stays identical
  to 2 decimals. This is checked mechanically, file by file.
- The gap floor stays **1.5 at every master**. Thinner lines simply leave more air: `file-text-2`'s
  short gap at 16 (1.25) becomes a legal 1.5 and its lint warning goes.
- Filled files at 16 — **if Q1 is answered "keep 2"**, the 74 line-icon filled files are not touched.
  **Corrected by the proof:** a few shape-filled files *do* change, because their cut-outs follow an
  outline that moved — the `help` family (bowl centreline 1.75 → 1.875), `trash` / `trash-5` (the
  handle's counter: a 1.5 tab and a 1.5 lid can no longer both hold their old place), and any icon
  with an interior curve (`globe`). Listed and re-cut in card 4.

## Side effects worth a look (Maruti's eye, on the proof sheet)

- **`trash` at 16 and its second rib — measured on the proof: still no.** Two ribs leave 1.41 of air
  to each wall against the 1.5 floor (0.09 short per side), and in real pixels the two short ribs read
  as a pair of eyes (C3's old warning). Shown on the proof sheet, section 5, for Maruti's eye.
- Glyph dots (`info`, `help`, `alert-circle`) keep their size (2), so the dot-to-stem contrast at 16
  (1.6×) moves close to the 24 master's (1.67×).

## Questions for Maruti — one batch, each with a recommendation

1. **Filled line icons at 16 (plus, check, chevrons, arrows): keep the filled weight at 2, or drop to
   1.75?** Section 4 of the test sheet shows both. *Recommend keep 2:* outline-to-filled contrast at 16
   becomes 1.6×, matching 24's 1.67× (today 16 is the weakest at 1.33×), and no filled file changes.
2. **`folder` on the board: pick its tab now, or hold it?** *Recommend hold* until the new 16 lands, so
   its 16 master is drawn once. No new approvals until then — each one is another file to convert.
3. **`trash` second rib at 16:** look at it on the proof sheet, decide there. No answer needed now.

## How the 114 get converted (census 2026-09-20, from `lab/manifest.json`)

No icon goes back on the board. The 24 and 20 masters, every name, every size and every filled line
icon are untouched. Four construction rules do the work, the same ones the proof used:

1. an **outer edge** keeps its pixel → its centreline moves out 0.125;
2. an **open stroke** keeps its ink end → its endpoint moves out 0.125 (on each axis for a diagonal);
3. **corner radii** keep their centreline value (1 · 1.5); **mark bends** take C10's weight ÷ 2 = 0.625;
4. **interior centrelines stay put**, so every gap gains 0.25.

| Group | n | How | Who |
|---|--:|---|---|
| Straight-line marks — `plus` `minus` `x` ×3 sizes, `menu` ×4 | 13 | rule 2 | script |
| Dot rows — `more-horizontal` / `-vertical` | 2 | dot radius +0.125, same ink | script |
| Single-bend marks — 36 chevrons, 8 checks | 44 | sharp skeleton recovered from the shipped path, ends by rule 2, bend re-cut at 0.625 | script |
| Shaft + head — 12 arrows, 2 `menu-arrow` | 14 | both of the above | script |
| Ring + straight marks — `plus/minus/x-circle` (+small), `clock`, `ban-2/-3`, `ban`, `alert-circle-3`, `search`, `search-2` | 13 | ring r 6.25 → 6.375, marks by rule 2 | script |
| Ring + check — the six `check-circle` | 6 | ring + the bend routine | script |
| Ring + dot + stem — `info`, `alert-circle`, `globe`? | 3 | script, `globe` checked by hand | script + eye |
| **By hand** — `help` ×4, `info-2`, `info-3`, `alert-circle-2/-4`, `globe-2`, `search-3`, `arrow-*-4` ×4, `file` `file-text` `file-text-2`, `trash` `trash-5` | 19 | drawn like the proof's eight | main session |

**Changed since the proof: bent marks hold their ink box exactly, and the leg angle gives instead.**
The proof held the chevron's 45° and let its height lose 0.08. That cannot stand: the filled twin is
not being touched, and C10/C12 require filled box = outline box to 2 dp. C12 already set the
precedent (filled flat chevrons sit up to 3° flatter to hold the box). Holding the box costs the
classic chevron about half a degree at 16 — measured per file and listed by the converter. So the
guard's bent-mark allowance should end up **unused**; it stays only as a tripwire.

**Shape-filled files that must be re-cut** (their cut-outs follow an interior line that moved, not
just an end): the four `help`, `info-2` / `info-3` (flag bend), `trash` / `trash-5` (handle counter),
and whatever else the converter reports — it lists every shape-filled file whose outline interior
moved by more than an end extension.

**What Maruti reviews — one sheet, not 114 boards** (`lab/refs/stroke16-review.html`): the At 16
strip before and after; every family in a row at 10× with today's drawing ghosted underneath; real
pixels for the 19 hand-drawn ones; the list of angle changes; guard and lint results at the top.

**Order:** (a) tools made per-master with 16 still at 1.5, proven by an identical lint report →
(b) converter + hand batch written into the working tree, stroke flipped to 1.25 → (c) guard, lint,
tests → (d) review sheet → Maruti → (e) one commit for tools + rules + the converted set, because
they are only consistent together; lab surfaces after.

## What the conversion found (2026-09-20)

Measured this session by `tools/convert-16.mjs`, `tools/inkbox-guard.mjs` and lint.

- **Guard:** 228 drawings at 16 · 219 identical · 9 are 0.25 shorter and nothing else — `minus` ×3 and the
  six menu stacks, whose top and bottom ink edges are the sides of a line. The guard names them; its
  bent-mark allowance is unused, as intended.
- **Lint:** 684 drawings · 681 clean · 3 warned · 0 failed. `file-text-2`'s warning is gone. `trash` at 16
  still warns (handle to body 0.5 → 0.75), `trash` at 20 is unchanged, and **one is new: `help-4-filled`** —
  lint's knockout check assumes the cut is centred on the outline, and the outline moved 0.125 under a cut
  that was deliberately left alone. The filled drawing is byte-identical apart from its root attribute.
  Follow-up: make that check measure the knockout itself.
- **Lint fix made on the way:** the pair-gap check measured sample point to sample point and read `info-3`'s
  stem, standing on its bar, as "0.13 apart" once the bar sat on the eighth grid. It now measures point to
  segment. Only other effect: `trash` at 20 reads 2.49 instead of 2.5.
- **Angles cost more than "about half a degree".** Classic chevron 45° → 45.5°, but the largest leg change is
  1.87° (`check-circle-small`), then 1.55° (`check-circle-4-small`), 1.49° (the four `arrow-*-3`,
  `check-circle`), 1.38° (`menu-arrow-*`). Full table on the review sheet, section "Angle changes".
- **Not in the census: all 40 shape-filled files at 16 carried root `stroke-width="1.5"`.** Lint ties that
  root to the master's outline stroke, so all 40 now say 1.25. In 36 it is inert (every path is a fill); the
  four `arrow-*-4-filled` really stroke their head and shaft and were redrawn with their outlines.
- **Filled re-cuts, fewer than planned.** Re-cut: `trash-filled`, `trash-5-filled` (lid, tab counter and body
  follow the new outer ink) and the four `arrow-*-4-filled`. **Not** re-cut: the `help` / `info` / `alert`
  / `globe` knockouts. Checked one by one: the lighter outline sits inside the shipped cut everywhere (the
  outline's outer ink did not move), and re-centring the cut on the new skeleton would push each terminal
  0.125 closer to its dot (0.87 → 0.75 of material in `help-4-filled`). Question 2 on the sheet.
- **`menu` (×4) and `menu-arrow-*` — decided, option B (Maruti, 2026-09-20):** the lines stay on the
  centrelines they had at 1.5 and only get thinner, so the filled twin still thickens in place (C17). The
  stack is 0.25 shorter; air between lines at 16 is 3.25 (`menu`, `menu-2`, the menu-arrows), 4.75
  (`menu-3`), 6.25 (`menu-4`). The converter's first pass had moved the outer lines out to hold the box.
- **After the fresh review (card 8):** `trash`'s wall joins were re-cut at 3 dp so they are tangent (the
  proof's 2 dp left a 0.28° kink), `trash-filled` followed; `trash-5`'s dot keeps its 1.5 of ink like every
  other dot (r 0.125 + stroke); two wrong doc statements fixed (16 ring radius, the list of re-cut filled
  files). Left as they are and shown to Maruti: `help` / `help-2`'s hook ends 0.17 earlier (the approved
  proof drawing); every diagonal cap reaches 0.052 further along its diagonal (rule 2 on both axes);
  `check-circle`'s tick tip runs 0.08–0.11 past its filled cut-out (0.03–0.06 before). Later: `polyGap`
  in lint should carry real subpath breaks instead of its 0.55-unit hop guard; `convert-16.mjs` only
  refuses a re-run when no outline is left at 1.5.
- **Hand batch, judgement calls:** `help-3`'s tail runs 46.9° (was 45°) so its terminal stays on the axis and
  the dot gap stays 1; the `arrow-*-4` heads keep their whole ink outline, sides 29.66° (was 30.02°);
  `trash-5` keeps 1.5 of air under the lid, so its body top rises 0.5; the `alert-circle-2/-4` wedge keeps a
  2-wide shoulder and narrows to 1.25, sides 6.7° off vertical (was 4.9°); `file*` keep the proof's fold
  skeleton (8.25 / 5.75), which sets the chamfer's outer edge 0.04 inside the filled twin's.
- **Comments:** every converted file got one added line stating what changed and, where its prose cites a
  16 figure that is no longer true, the measured new figure — "supersedes the 16 figures above".

## Work breakdown

| # | Card | Files owned | Done when | Model | Needs |
|---|---|---|---|---|---|
| 1 | **Proof: redraw 8 hard cases at true 1.25** — `plus`, `chevron-down`, `check-circle`, `info`, `help`, `trash` (one rib and two), `file-text-2`, `search`. Real construction on the eighth grid, not the scaled preview. | `lab/refs/stroke16-proof.html` + a scratch data file (gitignored) | Sheet shows shipped vs redrawn, blind, beside text, beside the 20 master, real pixels at 1× and 2×; every redrawn ink box equals today's | strongest (drawing judgement) | nod on this plan |
| 2 | **Per-master stroke in the tools** — `STROKE` becomes 24/20/16 = 1.5/1.5/1.25 in `tools/masters.mjs`; lint's root check, bend check (C10 → 0.625 at 16), gap and self-gap checks, eighth-grid + 3-decimal allowance at 16 only; `queue.mjs` writes the right weight; build unchanged (reads the root). | `tools/masters.mjs`, `tools/lint.mjs`, `tools/queue.mjs`, `tools/geometry.test.mjs` | Tests pass; 24 and 20 lint exactly as before (listed diff = none) | strong builder | card 1 approved by Maruti |
| 3 | **Ink-box guard** — a one-off script that snapshots today's 16 ink boxes from `dist/metrics.json` and fails if any converted file differs by more than 0.01. | `tools/` scratch script + snapshot in scratchpad | Runs green on the unconverted set | Sonnet | — (can run alongside 1) |
| 4 | **Convert the 114 outline files at 16.** Script handles rings, straight lines and rounded boxes (ends and walls move out 0.125); bent marks, glyphs, `globe`, `search`, `trash`, `file*` are redrawn by hand to keep C10/C12 exact. Written through `queue.mjs`, not by hand-editing. | `src/icons/16/*.svg` (main session only) | Card 3 green on all 114; `npm run check` 0 failed, warnings ≤ today's 3; At 16 strip before/after screenshot | strongest for the hand-drawn, Sonnet for the scripted batch | cards 2, 3 |
| 5 | **Filled files at 16** — only if Q1 = 1.75: 74 line-heavy filled files re-weighted, ends pulled to match. | `src/icons/16/*-filled.svg` | same guard as card 4 | Sonnet | card 4, Q1 |
| 6 | **Lab surfaces** — board header, Library subtitle, family sheet, optical-shift sheet and the older pages that hard-code 1.5 read the weight from `masters.mjs` instead. | `lab/*.html` | No hard-coded 1.5 left for a 16 master; clean console; nothing shifts | strong builder | card 2 |
| 7 | **Rules, everywhere at once** — CLAUDE.md Settled table + geometry block, `docs/01-foundations.md` §3–§4, `docs/07-character.md` C7 (amended, with the evidence above) and C10, `docs/08-refinement.md` §6.2, the icon skill. | those docs | A sweep for "1.5 at every master" / "every master" finds no stale statement | Sonnet sweep, strongest review | card 4 |
| 8 | **Fresh review** — an agent that built none of it checks the result against this plan. | — | Report with evidence; failures not rounded up | strongest | all |

## Parallel map

- **Wave 1:** card 1 and card 3 together. → *Maruti looks at the proof sheet. This is the only gate.*
- **Wave 2:** card 2.
- **Wave 3:** card 4 (scripted batch and hand-drawn batch side by side, separate file lists), card 6.
- **Wave 4:** card 5 if needed, card 7, then card 8.

Commits: one for the tools + rule (cards 2, 7), one for the converted set (cards 4, 5), one for the lab
(card 6). Nothing pushed.

## How the whole thing is proven

1. Ink-box guard green on all 114 (and 228 if card 5 runs).
2. `npm run check`: 0 failed; the `file-text-2` warning gone; the two `trash` warnings unchanged or gone.
3. Geometry tests pass.
4. At 16 strip, before and after, side by side; beside-text rows from the test sheet rebuilt on the
   real files; checked light and dark, and on a phone.
5. Reviewer agent's report.

## Status

- [x] Q2: hold `folder`, no new approvals until the new 16 lands
- [x] Q1: filled line weight at 16 **stays 2** (Maruti, 2026-09-20) — card 5 is dropped; only the shape-filled files whose outline moved are re-cut, in card 4
- [x] Menu at 16: **option B**, lines stay put and only get thinner (Maruti, 2026-09-20)
- [x] Q3: `trash` at 16 **stays one rib** (Maruti, 2026-09-20, on the review sheet)
- [x] 1 Proof sheet — `lab/refs/stroke16-proof.html` + `stroke16-proof.js`
- [x] 3 Ink-box guard — `node tools/inkbox-guard.mjs`, snapshot of all 228 drawings in `plans/stroke-16.inkbox.json`; green on today's set, and proven to fail on a deliberate 0.25 change to `plus`
- [x] Maruti approves the proof — "the 1.25 outline wins at 16px" (2026-09-20). Decision recorded in `docs/07-character.md` C7 and CLAUDE.md's Settled table, both marked *in transition*; every other statement of the rule flips in the conversion commit (card 7)
- [x] 2 Tools — per-master `STROKES` / `strokeOf` / `bendMin` / `gridOf`; lint report byte-identical at 1.5, then flipped; 17 tests pass
- [x] 4 Convert 114 outlines — 95 by `tools/convert-16.mjs`, 19 by hand, + 40 shape-filled roots, 6 filled re-cuts; guard and lint as above. **Uncommitted until Maruti has seen the sheet**
- [–] 5 Filled — not needed (Q1 = keep 2)
- [x] 6 Lab surfaces — family sheet, optical-shift, slot-test, optical, alignment, Library subtitle; checked in the browser, clean console
- [x] 7 Rules everywhere — CLAUDE.md, docs 01 · 07 · 08 · 09, the icon skill; re-swept after the fresh review
- [x] 8 Fresh review — no blocker in the drawings; its fix list is worked through above
- [x] Filled cut-outs at 16 **stay as approved** (Maruti, 2026-09-20) — 1.75 wide beside the 1.25 line
- [x] Maruti's go-ahead to commit (2026-09-20) — tools + rules + converted set in one commit, lab pages in the next; `folder` comes off hold
