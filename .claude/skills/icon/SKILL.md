---
name: icon
description: Draw, review and approve Mavan Drawer icons one at a time. Use whenever the user says "next icon", "let's do/draw <name>", "go with B", "approve", "lock it", asks what is on the board, or otherwise works on an icon in this repo. Resumes from research/queue.md (the sheet) and lab/drafts/current.js (the board), so a fresh session needs no hand-over.
---

# Icon loop

State lives in two files, never in the conversation:

- `research/queue.md` is **the sheet**: every icon, its order and its status (`[ ]` · `[~]` in review · `[x]` approved). The Library's **Sheet** view (`lab/library.html`) shows it.
- `lab/drafts/current.js` is **the board**: the icon under review and its candidates. It holds **one** icon.
- `lab/drafts/batch/<name>.js` is **a batch**, and only exists when Maruti asks to review several icons together: up to five boards side by side, opened with `/lab/icon.html?icon=<name>`. The board itself still holds one icon.

`node tools/queue.mjs` is the only thing that edits the sheet. The SessionStart hook prints `node tools/queue.mjs status`. If that output isn't in context, run it first.

Read CLAUDE.md's geometry and "Settled" table before drawing. Those decisions are closed.

## 1. Pick the icon

- **The user names an icon** ("let's do bell"): use that name, object-first (`calendar-plus`, never `add-calendar`).
- **"next icon", "continue", "carry on"**: if the board holds an icon that isn't approved yet, **resume it**. Show the board and restate its open question. Otherwise take `node tools/queue.mjs next`.
- **Several icons at once**: do them one after another, in the order given — unless Maruti asks to review them **together**, which is the batch (up to five).

## 2. Start it

```bash
node tools/queue.mjs start <name>              # the board
node tools/queue.mjs start <name> --batch      # beside the board, for a batch of up to five
```

This marks the icon in review and writes its references to `lab/refs/current.js` — or, with `--batch`, to `lab/refs/batch/<name>.js`, leaving the board and its references alone. If the name isn't on the sheet, it adds it:
- a size name (`bell-small`) goes under its default;
- anything else goes at the end, in "E · Added on request".

Tell the user in one line when a name was added. Don't ask first.

## 3. Draft the candidates

Overwrite `lab/drafts/current.js` — or, in a batch, write `lab/drafts/batch/<name>.js` in the same format. There are **no per-icon lab pages**. Format:

```js
export default {
  concept: '<name>',
  keyline: 'mark',            // only for marks (arrows, chevrons, plus…); silhouettes omit it
  box: { 24: [20, 18], 20: [16, 14], 16: [14, 12] },   // only when the icon keeps an agreed ink
                              // box of its own instead of a keyline (folder); never with `keyline`
  grows: { 24: [0, 0, .5, .5], 20: [...], 16: [...] }, // L R T B, filled file only: how far the
                              // filled ink is agreed to stand proud of the outline's box (C17
                              // repeated elements thicken in place and cannot keep it)
  question: '<the one decision the user is making>',
  candidates: [
    { id: 'A', label: 'Short name', note: 'numbers + why (recommended)',
      masters: { 24: ['M… stroke d'], 20: [...], 16: [...] },
      filled:  { 24: { weight: 2.5, stroke: [...] }, 20: { weight: 2, stroke: [...] }, 16: { weight: 2, stroke: [...] } } },
  ],
};
```

- **Filled style.** Every candidate carries all three masters in **both** styles. Pick the form by icon type:
  - *Line-heavy icons* (nothing to fill) use `{ weight, stroke }` at `FILLED_WEIGHT` (2.5 · 2 · 2). Pull each end in by half the added weight, so the ink box matches the outline.
  - *Shape icons* use `{ fill: [evenodd d…], stroke: [lines at the outline weight] }` — 1.5 at 24 and 20, **1.25 at 16**. The filled outer edge equals the outline's outer edge.
- **Candidates.** Give 2–4 — or ten when Maruti asks for ten — and mark one "(recommended)". The first line of the file comments why the decision matters.
- **Geometry** (CLAUDE.md):
  - Round caps reach half a stroke past each endpoint — 0.75 at 24 and 20, **0.625 at 16** (a 16
    master's ink ends sit at the endpoint ± 0.625, not ± 0.75). A **diagonal** open end at 16 moves
    out 0.125 on **both** axes, not just along the line, to keep its cap's two outward extremes
    (2026-09-20).
  - Keep a gap of at least 1.5 between stroke edges, at every master — a literal 1.5, not "one
    stroke-width" (the 16 stroke is 1.25). If a detail can't keep that gap, remove the detail.
  - Stay on the quarter grid at 24 and 20 (`.25` / `.5` / `.75`, 2 decimal places). **At 16, draw
    on the eighth grid instead** — centrelines on `x.375` / `x.625` so outer edges stay on whole
    pixels — with at most 3 decimal places. Comment every decimal that corrects something.
- **Agreed box.** `box` (on the board, or on one candidate — the candidate wins, like `keyline` and
  `tags`) is written into both files as `<!-- box: 20x18 -->` for that master. Lint then holds the
  drawing to that ink size as an **error** rather than asking it to match a keyline.
- **Agreed growth.** `grows` follows the same precedence and is written into the **filled** file
  only, as `<!-- grows: 0 0 0.5 0.5 -->`. Declare it when the filled twin cannot keep the outline's
  ink box — C17 repeated elements (menu lines, dots) thicken in place. Lint checks the number
  against the drawings, so a wrong note is an error, not a licence.
- **Agreed gap.** `gap` — `{ 24: 1, 20: 1 }` for both files, or `{ filled: { 24: 1 } }` /
  `{ outline: { … } }` to scope it to one style — is written as `<!-- gap: 1 -->` and replaces §6's
  1.5 for that file's proximity checks only. Declare it when Maruti approves a drawing that comes
  closer to itself than 1.5 (`attachment-4-filled`: 1.04 at 24, 1.0 at 20). Round it down to what
  the drawing really holds; lint errors on a note it cannot read, one that is not below 1.5, and
  one the drawing no longer needs.
- **Level family (C28).** Each member other than the full one carries `anchor: 'volume'` (on the
  candidate; a board-level `anchor` works too, and a candidate's `anchor: null` opts out). It is
  written into both files as `<!-- anchor: volume -->`, and lint holds that member's ink inside the
  full member's box at the same master and style, sharing its left or right edge (the body stays
  in place), instead of asking it to be centred on a keyline.
  Name what each candidate ships as with a board-level `set: { V2: 'volume', V1: 'volume-low' }`:
  a bare id in `draft-check` and in `approve` ships under its `set` name (an explicit `id=file`
  wins), and `draft-check` lints the anchor candidate beside each member (else the shipped
  `volume`). Approve the full member and its members in one command
  (`approve --icon volume V2 V1 V0 …`), or after the full member has shipped — `approve` refuses,
  before writing anything, a member whose anchor is neither in the command nor shipped, and its
  `--dry-run` takes the anchor from the same two places. Lint errors on a note it cannot read, one
  naming its own file, a missing, inkless or itself-anchored anchor, ink outside the anchor's box,
  ink that shares neither its left nor its right edge, and `anchor` with `box` or `keyline: mark`. The note declares
  membership, so it stays even when a member fills the full member's own box (info line).
- **Size families (C8).** If the icon has `-large` / `-small` versions, each size is **3 · 2.5 · 2** units from the next, at 24 · 20 · 16. A large version may reach the margin edge.
- **Consistency.** Check against approved relatives first (`src/icons/24/`, `node tools/queue.mjs show <name>`). Reuse their lengths, radii and weights unless the question is about changing them.

**Check the draft before showing it:**

```bash
node tools/draft-check.mjs lab/drafts/current.js          # or lab/drafts/batch/<name>.js
```

It builds the same six files per candidate that `approve` would write, lints them in a temp
directory with the whole of `npm run check` — root weight, grid, keyline, gaps, the C8 family and
the filled-vs-outline ink box — and prints both ink boxes per master. It writes nothing into the
repo, so it is safe while an icon is on the board. Fix what it reports before Maruti sees the board.

## 4. Show it

1. Start the `lab` preview (use `lab-4175` if another session holds port 4174).
2. Open `/lab/icon.html` and **reload** it; it caches the draft. A batch icon is `/lab/icon.html?icon=<name>` — the header's **Icon** menu lists every board, and `,` / `.` step between them. After writing a batch draft run `node tools/queue.mjs batch` so it appears there.
3. Check the console for errors.
4. Take a screenshot of Construction, and of Compare (Style → Outline) when the choice is about size or proportion.
5. When the icon belongs to a family of shipped icons (circles, squares…), add `family: ['plus-circle', …]` to the board (small candidates carry `size: 'small'`) and show `/lab/family-sheet.html`: every candidate beside those icons at 24 · 20 · 16, a 4× row with the first family icon's mark box as guides, and in-text use.
   For a group on a figure (C27), give the draft a `set: { A: 'users-3', … }` naming what each candidate ships as; `/lab/figures.html` then shows those candidates in place beside every shipped figure and group, outline and filled.
6. Tell the user, in plain words: the options with their numbers, your recommendation and why, and exactly what to look at.

**Refined, not comical.** Never review an icon alone: judge it at 16 next to the approved set (the Library's At 16 strip).

## Optical placement (C14, C15)

"Optical balance" always means: the mark reads **optically balanced in its canvas against all four edges at once** (top, bottom, left, right) at 24, 20 and 16. It does not mean geometrically even gaps. **Choose the axes per icon from its shape**: a mark weighted equally left and right (chevron-down) is judged only up–down; one balanced top–bottom (play) only left–right; one lopsided both ways (check) on both together; one symmetric both ways (plus, x) needs no sheet. The tool detects this and prints which axes it judges; say so to the user. Once an axis has been picked it is **locked**: a follow-up sheet uses `--axes x` or `--axes y` to vary only the other axis, keeping the locked shift in every row. Always use the template, never a chat widget or the Construction board:

```bash
node tools/optical-sheet.mjs check check-small check-2 check-2-small --ids C,Cs,W,Ws   # size variants follow their default
```

Then open `/lab/optical-shift.html` (reload it). Each shape gets its own positions around its recommendation on its judged axes (±0.1 ±0.2 for one axis, a ±0.1 grid for two; `--xs` / `--ys` / `--axes` override), plus the box centre and the shipped position. Every row shows the mark inside its canvas outline at each master, then the UI contexts. The shipped and recommended rows are tagged. The recommendation is measured for single-bend marks (end-triangle offset × 0.5 on each axis; an axis the default already ships keeps its value). Other shapes need `--rec <shape>=<x>:<y>`. Tell the user which measure each number comes from, and never copy a value from another icon. When the user picks, approve the row ids with `queue.mjs approve <id>=<file> …` (ids read like `Cr45u20`), then commit.

## 5. Iterate

Feedback like "shorter", "try a rounder one" or "more options" means editing the candidates in `current.js` (or that icon's batch draft), then reloading and showing the board again. Keep the rejected options on the board only while they help the comparison.

## 6. Approve: write, tick and commit without being asked

The user approves with words like "go with B", "approve", "lock it", "this one", "all three as sizes". Do all of the following immediately. **Never ask whether to save, lock or commit.** The approval is the instruction.

```bash
node tools/queue.mjs approve B                                  # one candidate → <concept>
node tools/queue.mjs approve M L=<name>-large S=<name>-small    # a size family
node tools/queue.mjs approve --icon <name> B                    # a batch icon, from batch/<name>.js
node tools/queue.mjs approve B --dry-run                        # lint it all, write nothing
```

The command:
1. writes `src/icons/{24,20,16}/<file>.svg` and `-filled.svg`;
2. runs `npm run check`;
3. if the check passes, ticks the sheet with today's date, adding rows for new sizes;
4. rebuilds the manifest;
5. with `--icon`, deletes that batch draft and its references and rebuilds the batch index;
6. prints the file list to commit.

If lint fails, nothing is ticked. Fix the draft and approve again.

Then commit, **one icon per commit**:

```bash
git add <files it printed>
git commit -m "Add <name>" -m "<one line: the choice and its numbers>"   # end with the session's attribution trailer
```

Commit on the current branch without asking. Don't push.

If the approval agreed a **deviation** from a rule for this icon, teach lint that decision in the
same piece of work — a note the file declares and lint verifies (`box`, `keyline: mark`, `glyph`) —
so the deviation is held to its own number instead of leaving a warning that buries real ones.

If the approval also settled a **rule** (a new size step, a naming convention, a weight):
- record it in `docs/07-character.md` (next C-number) and in `tools/masters.mjs` / `tools/lint.mjs` if it can be checked;
- commit those files with the icon.

Update CLAUDE.md only for settled rules. Never write a "resume here" note: the sheet and the board are the resume point.

## 7. Move on

Right after the commit:
1. `node tools/queue.mjs next` — in a batch, the next icon is whatever is still in `lab/drafts/batch/`, which `approve --icon` prints
2. `start` that icon
3. draft it and show it, unless the user said to stop.

End with the new board and its question, so the user can answer straight away. If the user stops mid-review, leave the board as it is: the next session resumes it.

## Don'ts

- Don't hand-edit `src/icons/` or the sheet's checkboxes. `queue.mjs` owns both, apart from fixing a file that lint rejected.
- Don't reorder the sheet, or change doc 04's D23 revisions, unless the user asks.
- Don't edit licensed references into the repo. `research/references/` and `lab/refs/` are gitignored.
