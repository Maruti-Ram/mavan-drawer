---
name: icon
description: Draw, review and approve Mavan Drawer icons one at a time. Use whenever the user says "next icon", "let's do/draw <name>", "go with B", "approve", "lock it", asks what is on the board, or otherwise works on an icon in this repo. Resumes from research/queue.md (the sheet) and lab/drafts/current.js (the board), so a fresh session needs no hand-over.
---

# Icon loop

State lives in two files, never in the conversation:

- `research/queue.md` is **the sheet**: every icon, its order and its status (`[ ]` · `[~]` in review · `[x]` approved). The Library's **Sheet** view (`lab/library.html`) shows it.
- `lab/drafts/current.js` is **the board**: the icon under review and its candidates.

`node tools/queue.mjs` is the only thing that edits the sheet. The SessionStart hook prints `node tools/queue.mjs status`. If that output isn't in context, run it first.

Read CLAUDE.md's geometry and "Settled" table before drawing. Those decisions are closed.

## 1. Pick the icon

- **The user names an icon** ("let's do bell"): use that name, object-first (`calendar-plus`, never `add-calendar`).
- **"next icon", "continue", "carry on"**: if the board holds an icon that isn't approved yet, **resume it**. Show the board and restate its open question. Otherwise take `node tools/queue.mjs next`.
- **Several icons at once**: do them one after another, in the order given.

## 2. Start it

```bash
node tools/queue.mjs start <name>
```

This marks the icon in review and writes its references to `lab/refs/current.js`. If the name isn't on the sheet, it adds it:
- a size name (`bell-small`) goes under its default;
- anything else goes at the end, in "E · Added on request".

Tell the user in one line when a name was added. Don't ask first.

## 3. Draft the candidates

Overwrite `lab/drafts/current.js`. There are **no per-icon lab files**. Format:

```js
export default {
  concept: '<name>',
  keyline: 'mark',            // only for marks (arrows, chevrons, plus…); silhouettes omit it
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
  - *Shape icons* use `{ fill: [evenodd d…], stroke: [1.5 lines] }`. The filled outer edge equals the outline's outer edge.
- **Candidates.** Give 2–4, and mark one "(recommended)". The first line of the file comments why the decision matters.
- **Geometry** (CLAUDE.md):
  - Round caps reach half a stroke past each endpoint.
  - Keep a gap of at least 1.5 between stroke edges. If a detail can't keep that gap, remove the detail.
  - Stay on the quarter grid, with at most 2 decimal places. Comment every decimal that corrects something.
- **Size families (C8).** If the icon has `-large` / `-small` versions, each size is **3 · 2.5 · 2** units from the next, at 24 · 20 · 16. A large version may reach the margin edge.
- **Consistency.** Check against approved relatives first (`src/icons/24/`, `node tools/queue.mjs show <name>`). Reuse their lengths, radii and weights unless the question is about changing them.

## 4. Show it

1. Start the `lab` preview (use `lab-4175` if another session holds port 4174).
2. Open `/lab/icon.html` and **reload** it; it caches the draft.
3. Check the console for errors.
4. Take a screenshot of Construction, and of Compare (Style → Outline) when the choice is about size or proportion.
5. Tell the user, in plain words: the options with their numbers, your recommendation and why, and exactly what to look at.

**Refined, not comical.** Never review an icon alone: judge it at 16 next to the approved set (the Library's At 16 strip).

## 5. Iterate

Feedback like "shorter", "try a rounder one" or "more options" means editing the candidates in `current.js`, then reloading and showing the board again. Keep the rejected options on the board only while they help the comparison.

## 6. Approve: write, tick and commit without being asked

The user approves with words like "go with B", "approve", "lock it", "this one", "all three as sizes". Do all of the following immediately. **Never ask whether to save, lock or commit.** The approval is the instruction.

```bash
node tools/queue.mjs approve B                                  # one candidate → <concept>
node tools/queue.mjs approve M L=<name>-large S=<name>-small    # a size family
```

The command:
1. writes `src/icons/{24,20,16}/<file>.svg` and `-filled.svg`;
2. runs `npm run check`;
3. if the check passes, ticks the sheet with today's date, adding rows for new sizes;
4. rebuilds the manifest;
5. prints the file list to commit.

If lint fails, nothing is ticked. Fix the draft and approve again.

Then commit, **one icon per commit**:

```bash
git add <files it printed>
git commit -m "Add <name>" -m "<one line: the choice and its numbers>"   # end with the session's attribution trailer
```

Commit on the current branch without asking. Don't push.

If the approval also settled a **rule** (a new size step, a naming convention, a weight):
- record it in `docs/07-character.md` (next C-number) and in `tools/masters.mjs` / `tools/lint.mjs` if it can be checked;
- commit those files with the icon.

Update CLAUDE.md only for settled rules. Never write a "resume here" note: the sheet and the board are the resume point.

## 7. Move on

Right after the commit:
1. `node tools/queue.mjs next`
2. `start` that icon
3. draft it and show it, unless the user said to stop.

End with the new board and its question, so the user can answer straight away. If the user stops mid-review, leave the board as it is: the next session resumes it.

## Don'ts

- Don't hand-edit `src/icons/` or the sheet's checkboxes. `queue.mjs` owns both, apart from fixing a file that lint rejected.
- Don't reorder the sheet, or change doc 04's D23 revisions, unless the user asks.
- Don't edit licensed references into the repo. `research/references/` and `lab/refs/` are gitignored.
