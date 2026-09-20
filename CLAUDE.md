# Mavan Drawer — working context

A commercial icon library. Read this before touching anything; it records
decisions that are **settled** and the reasoning that is expensive to rediscover.

## How we work — Maruti and Claude

Maruti is a designer, not a developer. **Maruti decides what an icon looks like and what the set
stands for; the eye makes the final pick** (C0, C15). Claude is the lead engineer and the project
manager: it owns the tools, lint, build, lab pages, docs and the queue, makes every technical
decision there without asking, checks its own work, and owns the mistakes.

What goes to Maruti, always: a visual choice, a new or widened rule, a change of scope or order,
anything that ships to customers. What never does: file formats, tool design, how a check is coded.
Claude explains those choices in a sentence instead of asking Maruti to make them.

### Hard rules

- **Plain language.** Lead with what the eye will see ("the tick reads thinner than the cross"),
  then the number that shows it. A technical term gets one sentence of explanation. Rule numbers
  (C18) are references, not explanations.
- **Nothing gets drawn or built on a fuzzy picture.** A board carries **one** question. If the
  question is not clear, keep talking until it is. Questions come in one batch, each with a
  recommendation.
- **Measure, never recall.** No number is stated unless it was measured this session or cited from
  a file in the repo. An unmeasured number is written `[needs measuring]`. A clean lint is not a
  correct drawing (doc 08 §10).
- **A rule lives in one place and is changed everywhere at once.** When a decision changes, the
  same commit updates every place that states it — the Settled table, `docs/07-character.md`,
  `docs/01-foundations.md`, `tools/masters.mjs`, lint, the icon skill. A stale doc is a bug.
- **Git:** an approval is committed without asking (the icon skill). Tool and docs work is
  committed once Maruti has agreed the change, one topic per commit. Never push, branch, open a
  PR or rewrite history unless Maruti says so.

### Standing directives

1. **Orchestrate by default.** Substantive work that is not the drawing itself is delegated to
   subagents, workflows or agent teams, whichever fits. This is a standing opt-in; never ask per
   task. The reason: the main conversation must stay small and sharp so it does not lose the thread.
2. **Keep the main session clean.** The main thread holds the board, the decisions and the results.
   Reference measuring, censuses across `src/icons/`, doc sweeps, reading lab pages and tool
   building happen inside subagents, which report conclusions, not file dumps.
3. **Plan, then fan out.** Work that can run at the same time does. The natural split here: while
   one icon is under review, agents measure references and relatives for the **next** ones.
4. **Pick the model per task,** and say which model each agent got.

   | Kind of work | Model |
   |---|---|
   | Taste and judgement: drawing candidates, judging at 16 in the set, writing or widening a rule, reviewing a result, hard geometry bugs | the strongest model |
   | Building from a clear spec: a lint check, a lab panel, a build step, a fix with a known cause | a strong builder model |
   | Checklists and lookups: measuring references, censuses of radii / gaps / ratios, browser checks, doc sweeps for stale statements | Sonnet |
   | Mechanical chores: renames, regenerating files, format conversions | Haiku |

   A vague brief or a result that needs judging moves up a tier. Nothing moves down to save tokens.
5. **One owner per file.** The board (`lab/drafts/current.js`), the sheet (`research/queue.md`),
   `src/icons/` and `lab/manifest.json` belong to the main session and `queue.mjs` alone — no agent
   writes them, and only one icon is on the board at a time. Agents own named files and prefer new
   files; Claude merges. Parallel tool work may use worktrees.
6. **Verify before saying done.** The default, by kind of work:
   - *An icon:* `npm run check` with no new warnings; filled ink box equals the outline's; the board
     reloaded with a clean console; looked at in **real pixels at 16** and in the Library's At 16
     strip beside the set, outline and filled; relatives checked for shared lengths, radii and cuts.
   - *A tool or lint change:* `node --test tools/geometry.test.mjs` passes; all shipped drawings still
     lint the same unless the change meant otherwise, and every drawing whose result changed is listed.
   - *A lab page:* clean console, nothing shifts when a control toggles, light and dark.
   - A fresh reviewer agent that did not do the work checks the result against the plan or the rule.
   - Failures are reported with their evidence. Never rounded up to "done".
7. **Report like a PM.** What shipped, what is in flight, what is blocked and why, what Maruti needs
   to decide. Short.

### Builds that are not an icon

The icon loop is its own plan (the `icon` skill). Anything else of size — the shipping pipeline, a
lint overhaul, a docs rewrite, a new lab surface — starts with a plan document, not code:

1. **Brainstorm until confident,** asking about what Maruti or the customer will see, not about the
   technique.
2. **Test the unknowns first** with a throwaway proof (doc 08: half a session once went to a stale
   module cache, not the feature).
3. **Write `plans/<build-name>.md`:** what changes for Maruti or the customer in plain words; the
   work as cards (scope, files owned, how we know it is done, model, depends on); the waves that
   can run in parallel; how the combined result is proven; status checkboxes. The plan is the only
   progress log for that build — it does not replace the sheet and the board for icons.
4. **Get Maruti's nod, then fan out.**

## Picking up

**Open builds live in `plans/`.** Before starting or approving any icon, read every plan there whose
Status has unticked boxes — it says what is in flight and what is on hold (2026-09-20: none open;
`plans/stroke-16.md` is closed — the 16 master draws at 1.25 (C7) and the plan records how the 114 were
converted and what was decided on the way).
`docs/09-rule-audit.md` is the open agenda for the rules themselves.

**Resume point = the sheet + the board, never a note.** `research/queue.md` is the sheet (status per icon;
Library → **Sheet** view shows it) and `lab/drafts/current.js` is the board. A SessionStart hook prints
`node tools/queue.mjs status`; the **`icon` skill** (`.claude/skills/icon`) runs the loop: "next icon" /
"let's do <name>" → `queue.mjs start` (adds unlisted names) → draft → show; an approval → `queue.mjs
approve` (writes, lints, ticks) → commit, **without asking** → next icon. **Size rule (C8):** `-large` /
`-small` step 3 · 2.5 · 2 units from the default; `-large` may reach the margin edge; lint checks families. File pair per master:
`<name>.svg` (stroke 1.5 at 24 and 20, 1.25 at 16) + `<name>-filled.svg`; lint enforces the filled weight.
**Library (built 2026-09-17):** `lab/library.html` (`/lab/` redirects there). The grid shows **one
representative icon** (24 master) per concept; clicking opens a right panel with all three masters
and their metrics (ink, centring, geometric/optical bearings, copy SVG). Outline/Filled switch (F),
search (/), Show Approved | Whole queue, sections rail with progress, and an "At 16" strip. It reads
`lab/manifest.json`, which `npm run build` now fills with each file's `body` and the parsed `queue`.
Board layout, for reference: iterations sit in a full-height left sidebar that collapses
to a strip (**[**, ↑ ↓ to step). It lists every candidate in `current.js`; the one you click goes on
the board, and "more iterations" means adding candidates there. A sticky header holds the glyph,
Stroke, Overlay and theme controls. The Construction panel is a grid: **sizes run down (24/20/16), styles across (Outline | Filled)**,
so each outline sits beside its filled twin. Draft format: `masters: {24: [stroke d…]}` is the outline;
`filled: {24: {fill: [d…], stroke: [d…]}}` (each fill entry is one evenodd shape with its holes) or
`filled: 'outline'` for line-only icons. In context has a **Filled switch (F)** that swaps the style in place on the same rows; Compare has a Style dropdown (Outline / Filled / Both). The boards have a
Layers menu (each guide and keyline switched separately), True size / Fit, and **Inspect**
(rulers, Figma-style distances, click to pin, ink box, mass centre). Nothing may shift when
Inspect toggles: the stats block has a fixed 2×2 + one-line shape. Then come the In context
panel and references in a collapsible right sidebar (**R**).

**Drawing workflow.** `research/queue.md` is the order and checklist (487 icons; marks →
circles → core containers → audit rank). There is **one drawing board**, `lab/icon.html`, with
two tabs: **Construction** (grid + keyline build-up, actual sizes, in context) and **Compare**
(references and our iterations in rows at 96 · 48 · 24 · 20 · 16, like the trash explorer). It
always shows the icon in `lab/drafts/current.js`; `node tools/refs.mjs <name>` writes that icon's
references to `lab/refs/current.js` (gitignored). When the user approves an option: `node tools/queue.mjs approve <id>[=<file>]…`
(writes `src/icons/{24,20,16}/`, runs `npm run check`, ticks the sheet), commit, then
`queue.mjs start` the next icon and overwrite `current.js`. **No per-icon lab files.** Central references are captured from the
centralicons.com browser tab (site controls: Stroke / Corner menus) into
`research/references/central/<name>.json`.

Serve the lab with the `lab-4175` launch config if another session holds 4174.

**Visual language (O1)** — decisions C1–C8 in `docs/07-character.md`: no sharp icons; refined
and professional, not comical; three masters 24/20/16; stroke 1.5 at 24 and 20, **1.25 at 16**
(C7); trash family
(`trash` + `trash-5`, tab handle; C4's interiors dropped, `-2`/`-3`/`-4` left unused); numbered variants allowed; -large/-small size variants on a fixed step. Still open there: container radius,
angle exceptions, the user icon. Specimens live in `lab/character.html` (`node tools/refs.mjs`
with no argument builds its reference rows).

**Refinement assessment (2026-09-18)** — `docs/08-refinement.md`: why our marks read less refined than the
references, every number that was measured, what C19 settled, and the **open agenda** — the undecided 13%
mark/container drift from 24 to 16, the two unenforced §6 corollaries, the gap rule's holes (counters inside
one path and *all* shape-filled files go unchecked), and the Fluent items worth inheriting. Read it before
reopening stroke weight, `MIN_GAP` or the optical machinery — §8 lists what was already ruled out and why.

**Audit** — done: `docs/06-audit.md`, `research/ranked.md`. The user has **not** yet ruled on
the D23 revisions it proposes (add `home`, `checkbox`, `save`, `chevrons-up-down`…; cut
`caret-left/right`; merge `close`=`x`, `copy`=`duplicate`; 13 open slots) — do not edit doc 04
until they do. The audit used the Polaris *archive*; the user's Figma Polaris frame
(file `XewrhAKrNGVZtikkpI5am9`, node `15643:27748`) is newer (~490 icons) and should be
re-audited. To change the ranking edit `research/synonyms.mjs` and `npm run audit`. To refresh
Polaris use the **git trees API** — the contents API silently stops at 1,000 entries.

**Moved aside:** `src/_legacy-stroke-2/` holds the 10 pre-decision stroke-2 icons.

## Run

```bash
npm run check    # build metrics + lint all icons (exits 1 on failure)
npm run lab      # dev server on 4174 → /lab/
npm run audit    # re-rank the ~500 from research/sources snapshots
```

## Settled — do not relitigate without being asked

| Decision | Value |
|---|---|
| Source of truth | hand-authored SVG in `src/icons/24/`, **not** Figma |
| Authoring format | **strokes** (typable, lintable, 10× smaller) |
| Shipped format | **outlined fills only** — the stroked source stays private |
| Styles | outline + filled, **drawn together per icon** and approved as a pair (user decision 2026-09-17). Separate drawings; filled outer edge = outline outer edge. **Filled rule (locked 2026-09-17):** *line-heavy* icons (plus, check, arrows, chevrons — nothing to fill) show weight by a **heavier stroke — 2.5 at 24, 2 at 20 and 16** (`FILLED_WEIGHT`), never a background; ink box stays identical, so ends pull in by half the added weight. *Repeated elements* (C17: dots, menu lines) are spaced by their own thickness (menu: fixed gap 3 at 24 and 20; **at 16 the lines hold their 1.5-era centrelines instead, so the gap is 3.25 for `menu`/`menu-2`/`menu-arrow-*`, 4.75 for `menu-3`, 6.25 for `menu-4`** — decided 2026-09-20) and thicken in place, so their filled version is slightly larger than the outline. *Every other* icon fills its shapes (plus-circle fills the circle) and its **strokes stay at the outline weight — 1.5 at 24 and 20, 1.25 at 16**. Duotone deferred. |
| Weight axis | **none.** Opinionated defaults; customers do not adjust stroke. |
| Stroke | **1.5 at 24 and 20 · 1.25 at 16** (user decision 2026-09-20, C7 amended; blind pick + eight true redraws, carried out in `plans/stroke-16.md`). Filled line weight at 16 stays 2. 219 of 228 drawings at 16 keep their ink box exactly; nine — `minus` ×3 and six menu stacks — are 0.25 shorter and nothing else, because their ink ends are the sides of a line (`tools/inkbox-guard.mjs`; dated note, 2026-09-20). 16 centrelines sit on x.375 / x.625 (eighth grid, 3 dp, that master only); gap floor stays a **literal 1.5 at every master** — no longer "one stroke-width" at 16, since the 16 stroke is now 1.25. |
| Canvas | 24 |
| Masters | **24 · 20 · 16** — three drawn masters (user direction, 2026-09-16; supersedes "drop 20") |
| Business model | sold to many customers → we do not control render size |
| Naming (C9) | `<object>[-<modifier>][-<n>][-<size>][-filled]`; shape variants are numbered (`check-2`), their style word is a **tag** (`<!-- tags: long sweep -->`, candidate `tags: [...]` on the board) that the build and Library search read. Numbers never change. |
| Mark bends (C10) | a bent mark's corner is an arc of radius **half the weight** — outline 0.75 · 0.75 · 0.625 (24 · 20 · 16), filled 1.25 · 1 · 1 (`bendMin`) — the tightest even-width bend; lint warns below it. At 16 the ink box is still held exactly and the leg angle gives instead (classic chevron 45° → 45.5°, largest shift 1.87° on `check-circle-small`; measured by `tools/convert-16.mjs`, 2026-09-20) |
| Sizes (C8, C13, C18) | ship only the sizes with a use case (`check`: default + small); every shipped style then gets all of them — styles × sizes is a full grid. **Containers** (`check-circle-small`) keep the container and shrink only the inner mark |
| Optical placement (C14) | open pointing marks move toward their point by a per-shape anchor picked by eye at default 24 (chevron down: classic 0.5 · steep 0.61 · flat 0.55; up/left/right, same drawings flipped or turned: classic 0.5 · steep 0.65 · flat 0.4 up, 0.55 left/right; checks stay box-centred — audited 2026-09-17), scaled by ink height for other sizes/masters; declared as `<!-- optical: dx dy -->`, checked by lint, written to metrics as `shift`. Symmetric marks stay on the box centre. |
| Deciding a shift (C15) | **measure, don't copy**: each shape's recommendation = end-triangle offset × 0.5 (not ink mass); positions around each shape's own recommendation, plus box centre and shipped (never one grid for all shapes); always shown on `/lab/optical-shift.html` via `tools/optical-sheet.mjs`, with shipped + recommended tagged; the eye makes the final pick; **balanced in the canvas against all four edges** (optically, not geometrically even), on **the axes the shape is lopsided on** — chevron up–down only, play left–right only, check both; symmetry is detected by the tool; each position shown inside its canvas outline |
| Glyph gap (C19) | a mark that is **one character with a detached dot** (`info` i, `help` ?, `alert-circle` !) floors its **dot-to-body** space at **1 unit** (`GLYPH_GAP`), not §6's 1.5. Declared `<!-- glyph: dot -->`; lint enforces it on that pair only. Everything else — dot-to-container, repeated elements (C17), parallel runs — keeps `MIN_GAP` 1.5. §6 was written for line marks and runs; in a glyph it leaves a hollow middle, worst at 16 |
| Exact placement (C10, C12) | bent marks: outline ink centred to 2 dp; filled ink box == outline's to 2 dp, no tolerance. Chevron filled bends grow (≤ 2× minimum) to keep the leg angle |

## The geometry

```
masters    24 · 20 · 16, each drawn by hand      (numbers: tools/masters.mjs)
keylines   24: circle ⌀20 · square 18 · portrait 16×20 · landscape 20×16 · mark ≤18
           20: circle ⌀16 · square 14 · mark ≤14 · 16: circle ⌀14 · square 12 · mark ≤12
sizes      -small / default / -large marks step 3 · 2.5 · 2 (12.5%); -large may reach the margin edge
stroke     1.5 · 1.5 · 1.25 (6.3% · 7.5% · 7.8%)  ← C7 amended 2026-09-20, carried out in plans/stroke-16.md
filled     line-heavy icons: 2.5 · 2 · 2 (10.4% · 10% · 12.5%) — shape icons fill, strokes stay at
           the master's outline weight (1.5 · 1.5 · 1.25)
grid       quarter units, 2 dp max, at 24 and 20 · eighth units, 3 dp max, at 16 only (centrelines
           on x.375/x.625, so outer edges stay whole) · container edges on .25/.75 · angles 0/45/90
radius     container 2.5 · bend/detail 1.5 (at 24; proposed) · mark corners = weight / 2 (C10)
min gap    a literal 1.5 between any two stroke edges, at every master — no longer "one
           stroke-width" at 16, since the 16 stroke is 1.25
```

**There is no "live area."** The circle keyline IS the outer drawing bound. The
2 units between it and the canvas are margin shipped inside the asset — a
spacing decision, not a drawing rule. Do not reintroduce a third layer.

### Two rules that are easy to get wrong

1. **Round caps extend half a stroke past the path endpoint.** At 24 and 20 (stroke
   1.5, half = 0.75), to span the 18-unit square keyline (3→21) the path is
   `M3.75 12h16.5`. At 16 (stroke 1.25, half = 0.625) the same line's endpoints sit
   0.625 inside the extent, not 0.75. Off-by-one here is the commonest defect in
   icon sets.
2. **Min gap is a literal 1.5, not "one stroke-width."** That equivalence only
   holds at 24 and 20; at 16 the stroke is 1.25 but the gap floor still holds at
   1.5. This is what survives 16px and what lets the filled style exist without
   shapes welding shut. When a detail cannot hold the gap, **remove the detail**
   — that is the rule working, not failing.

## Open — in dependency order

1. **Visual language.** Four candidates + a lever rig in `lab/language.html`.
   **Blocks everything downstream.** Do not start drawing the set before this.
2. **Master size** (24 vs 16 primary) — downstream of (1).
3. Tune optical `alpha` (currently 0.75 in `tools/optical.mjs`).
4. Possibly relax the `<path>`-only lint rule so `<rect>`/`<circle>` can be
   hand-written — Nucleo uses basic shapes throughout and they are far more
   editable.
5. Primitive-drift linter — flag shapes that are *nearly* a shared primitive
   (r8.5 where every other circle is r9). Highest-leverage tool for family
   consistency. Not built.

## Tools

| File | Does |
|---|---|
| `tools/lint.mjs` | enforces `docs/01-foundations.md`; exits 1 |
| `tools/geometry.mjs` | path parser, **exact** arc bboxes, line-sampled proximity |
| `tools/optical.mjs` | optical side bearings computed from the outline |
| `tools/build.mjs` | emits `dist/icons.json`, `dist/metrics.json`, `lab/manifest.json` |
| `tools/queue.mjs` | the sheet as a command: `status` · `next` · `show` · `start` · `approve` |
| `tools/audit.mjs` | ranks concepts across Polaris / Nucleo / Lucide → `research/ranked.md` |
| `tools/optical-sheet.mjs` | **optical placement (C14) template**: `node tools/optical-sheet.mjs <shape>… [--rec <shape>=<x>:<y>] [--xs …] [--ys …]` measures each shape's (x, y) recommendation (end-triangle offset × 0.5) and writes a grid of positions around it to the board; view on **`/lab/optical-shift.html`** (plain sheet: the mark in its canvas outline at 24 · 20 · 16, menu row, inline, 40 square/circle, 32 · 28 buttons; shipped and recommended rows tagged) |

`dist/metrics.json` is the differentiator: per-icon ink box, **geometric**
bearings (where ink stops) and **optical** bearings (where it reads as stopping).
Consumers subtract them as negative margins so `padding` and `gap` become
literally true. Without it the same CSS renders 13.7–16.2px of visual padding
depending on the icon.

## Conventions

- Naming: `<object>-<modifier>`, object first — `calendar-plus`, never `add-calendar`
- Every decimal in a path carries a comment saying what it corrects
- `<!-- keyline: mark -->` opts an icon out of silhouette keylines
- One icon per commit
- **An icon is never reviewed alone** — only in a grid at 16px next to twenty others

## Facts verified from source (do not re-derive)

- Polaris (archive): 463 outline bases + 72 filled = 535 SVGs, all 20×20, **zero strokes**; 118 concepts are Shopify-only
- Geist: 16×16, zero strokes
- Fluent: 7 sizes × 2 styles; filled shares base geometry **verbatim**; a modifier
  **cuts the base back** (calendar 8 subpaths → calendar-add 4)
- SF Symbols: typographic grid (baseline + cap height), **3 drawn masters → 9
  weights**, 2,664 outline/fill pairs
- Font Awesome: **variable-width viewBoxes** (448 vs 512) — glyphs, not squares
- Nucleo: 7 grids × 2 styles, 64k icons, per-icon `stroke_max` metadata
- Nucleo "UI Essential" (set 10) is **221 names**; its 1,024 rows are names × grids × styles
- Only **24 and 48** are pixel-crisp from a 24 master; 16/20/32 are not
