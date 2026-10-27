# Plan: the shipping pipeline (2026-10-26)

Status: **nodded 2026-10-26** (both open recommendations taken: tarballs in the download, a local `v1.0.0` tag). **Wave 1 built and closed 2026-10-26; stopped there on Maruti's word** ("stop after wave 1", credits). **Wave 2 built and closed 2026-10-27**, in a cloud session on the branch `claude/focused-noether-4uv2b2` (Maruti: "run wave 2", then stop); **Wave 3 started 2026-10-27** on Maruti's word ("start wave 3 in cloud"): 3.1 and 3.2 done; `stack-3` retired and the tags cleaned on his rulings; 3.3 (the 1.0.0 cut) needs his nod on the looked-at box and the licence and names rulings in the wave 2 report under Results.

**The `mavan` npm org (1.4) was created by Maruti on 2026-10-27** (free plan; npm's confirmation, "mavan was created with a default team called Developers"), so `@mavan` is ours. The size rule (2.4) and the sheet rulings (1.3) were settled 2026-10-26 on his word, "go with the best recommended approaches": every row has a category, ten rows became variants (icons 458 → 448), and the three badge rows left the round label. Brainstormed 2026-10-26 (seven questions, all answered —
see below); the one unknown, turning a stroke into an outlined fill, proven the same day in
`plans/proof-outline/`; reviewed by a fresh agent the same day (numbers re-measured, owners fixed).

- [x] 1.1 The outliner — merged 2026-10-26 (Fable; reviewed by a fresh Opus agent with an independent renderer, one leak fixed on review): `tools/outline.mjs`, 0 wrong pixels in 7,860 files
- [x] 1.2 Metrics made correct — merged 2026-10-26 (Fable, reviewed by a fresh Fable agent, second pass on its two findings); the ⌘ reading is an open question for Maruti, under Results
- [x] 1.3 The package's index — built 2026-10-26 (Opus): `node tools/package-meta.mjs` → `dist/meta.json`, 1310 entries = the sheet's 1310 approved rows, 458 families; the sheet's findings are under Results
- [x] 1.4 The name on npm — the `mavan` org created by Maruti 2026-10-27 (free plan; his screenshot of npm's confirmation stands as the proof, since `npm org ls` needs his login)
- [x] 2.1 The box: `@mavan/icons` — built 2026-10-27 (Opus; reviewed by a fresh Fable agent with a release run of its own): `npm run release`, 7,860 outlined files = 2 × 3 × 1,310 rows, zip and tarball open
- [x] 2.2 The React package: `@mavan/icons-react` — built 2026-10-27 (Opus; reviewed by a fresh Fable agent with a release and checks of its own): every icon renders at 16 · 20 · 24 from the tarball, 0 differing pixels against the box in Chromium, no stroked source in it
- [x] 2.3 The licence and the README — drafted 2026-10-27 (Sonnet; reviewed by a fresh Fable agent, nine edits): `packages/templates/`, 24 `[Maruti]` decisions listed under Results
- [x] 2.4 The size rule, picked by eye — board built 2026-10-26 (Opus): `/lab/size-rule.html`; **picked 2026-10-26: the master at or below the size, scaled up** (Maruti, taking the recommendation); recorded in CLAUDE.md Settled and docs/01 §9
- [x] 3.1 Installed and looked at, as a customer — 2026-10-27 (Sonnet): every icon, both styles, 16 · 20 · 24 at 1× and 2× in Chromium against the lab's drawing; the only real differences are the lab's pinholes (hollow dots the box draws solid) — Maruti to look in his own Chrome
- [x] 3.2 Fresh review — 2026-10-27 (Fable, on a release of its own): checklist lines 1–4 ticked; 5 (the licence's 24 `[Maruti]`) and 6 (`names.lock`) fail as expected until 3.3 — the lock and the licence gate both proven to work
- [ ] 3.3 1.0.0 cut: names frozen, tarballs built, decisions recorded
- [ ] Next pass, not this one: a tags pass, with the lint rule that keeps other sets' names and workshop words out of tags (Maruti, 2026-10-27) · Figma components and assets (Maruti, 2026-10-26) · the shop and token
      delivery · PNG, font, PDF (never, unless a customer asks)

## What changes for Maruti and the customer

Today the icons exist only as this repo's stroked source. After this build:

- **The customer downloads one folder.** Inside: `svg/24/`, `svg/20/`, `svg/16/`, each holding every
  icon as `check.svg` and `check-filled.svg`, drawn as **outlined fills** — each line turned into a
  solid shape of the same ink, so it renders the same in every app and nothing in it can be restyled
  or broken. Beside them: `icons.json` (every path per size, for code that draws icons itself),
  `metrics.json` (where each icon's ink stops and where it *reads* as stopping), `meta.json`
  (category, search words, variants and sizes per icon), a README that states the size rule, a
  LICENSE, and two installable npm files (tarballs) for `@mavan/icons` and `@mavan/icons-react`.
- **The developer writes `<Icon name="check" size={16} />`** and gets the 16 drawing, not a shrunken
  24. With `optical` switched on, a button's padding is true to the ink, not to the icon's box — the
  thing no other set ships.
- **Maruti runs one command**, `npm run release`, and gets that folder, versioned, from the sheet's
  approved rows. Nothing by hand, nothing from Figma.
- **The stroked source stays here.** The repo has no remote today and the box never carries a stroke.
- **1.0.0 freezes every name and number** (C9, the naming rule: once shipped, `check-2` is `check-2`
  for ever). The sheet's rows become permanent the moment the first customer installs; a later
  retirement is a deprecation, never a rename.

## Facts this rests on (measured 2026-10-26, 14:03)

The counts grow as icons are approved in other sessions (four were approved while this plan was
written); the release takes the sheet's count on the day, never a number from this file.

- The sheet: **1310 rows, all approved**; 852 of them variants of **458** base concepts; 105 marked
  mvp; 19 category values, and **34 rows carry none** (to fill before 1.0). `parseSheet` in
  `tools/queue.mjs:85` gives every row `{status, n, name, category, base, mvp, note, date, section}`.
- Files: **2620 per master** (1310 outline + 1310 filled), three masters. `src/icons/` is 10.0 MB;
  `dist/icons.json` 8.9 MB; `dist/metrics.json` 6.3 MB (sizes measured earlier the same day).
- Search words: `<!-- tags: -->` is in both twins of every icon but 24 (24 outline files and their 24
  filled twins are untagged); 1850 distinct words across the set.
- Both metrics bugs in `docs/09-rule-audit.md` are still present: every shape-filled file (982 of
  1306 filled at 24 when measured) gets **zero** optical recession (`plus-circle` 0.94 → optical 2.71;
  `plus-circle-filled` 0 → 2, same silhouette); `anatomy()` reports a container for the bare `x`
  (13 · 16 · 10 for `x`, `-large`, `-small`; `plus` gives null, correctly).
- `dist/icons.json`'s ink box disagrees with the exact ink at 2 dp in 35–37 files (`pound`, `euro`
  among them: curves boxed by their control points, not their true extremes). Found by the proof.
- npm: `mavan-drawer`, `mavan-icons` free; the scopes `@mavan` and `@mavan-drawer` unclaimed by the
  registry's own report (the npm website refused the check).
- The survey of ten sets (Nucleo, Untitled UI, Streamline, Iconly, Phosphor, Lucide, Heroicons,
  Tabler, Fluent, Radix): every paid set ships clean SVGs, a React package, a Figma library or plugin,
  a seat-based licence that forbids resale, and updates. None sells per-size drawn masters (Fluent and
  Heroicons do it, free) and none ships optical metrics.

### The proof (`plans/proof-outline/`, 2026-10-26, Opus)

Terms used below: a *stroker* turns a line of a given weight into the shape of its ink; *Skia* is the
drawing engine inside Chrome, available to Node as `canvaskit-wasm`, and its *PathOps* merges shapes;
the *raster gate* draws the result and the source as pixels and counts the ones that differ.

No installed tool converts a stroke exactly: Inkscape, FontForge, rsvg and resvg are not on this Mac;
`svg-outline-stroke` traces a bitmap; Skia's own stroker, paper.js and maker.js all miss. What is exact
is **our own stroker plus Skia's PathOps**: every line and circular arc is offset into its own outline —
a line stays a line, an arc stays an arc, caps and joins round — PathOps unions the pieces, and each
piece is written back as a true SVG arc, 3 dp, no `transform`, `<g>` or ids. Run on every file (7,860
by the end of the run):

| Measure | Result |
|---|---|
| Ink box against the exact ink | 12 files off by more than 0.005; worst 0.006 on the sample (`16/pound`) |
| Wrong pixels against the exact reference | **5 of 7,860** (`16/` and `20/headphones-3-filled`, `16/book-open-2`, `20/pen-tool-2`, `20/battery-charging`) — stroker edge cases, not dead ends |
| Curves | true arcs (M L H V A Z); 2.4× the points, 2.8× the bytes of the source |
| Speed | 0.50 ms per file; 3.9 s for the set |
| Not exact | 224 files with a stroked elliptical arc or cubic curve (`$`, `£`, `€`, `map-pin-5`): no exact offset exists; Skia's stroker at its finest setting (precision 256) gets within 0.0013 |

Two side findings. Skia and resvg draw a **pinhole** — an empty pixel at the centre — in a dot whose
radius is under half its stroke (`more-horizontal-filled`, `drag-handle-filled`, `list-bullet-2-filled`;
367 files carry 1,488 such arcs). The outlined files draw them solid, as drawn, so the box is safe;
whether the lab shows pinholes in Chrome is [needs checking in a real browser] (card 3.1). And the
curve ink-box error above (card 1.2).

## Questions for Maruti — answered 2026-10-26

| Q | Question | Recommendation | Answer |
|---|---|---|---|
| 1 | What is in the box? | SVG outlined fills in `24/ 20/ 16/` with filled twins, React package, metrics. No PNG, font, PDF | taken |
| 2 | How does a customer pick a size? | the component picks the master for the size and never scales a larger master down; the README says the same | taken — thresholds picked by eye in 2.4 |
| 3 | Do the metrics ship? | yes, inside the React package, applied by the component; the two doc 09 bugs fixed first | taken |
| 4 | What ships in 1.0? | everything the sheet has approved, variants included, searchable by tag | **"this"** — everything approved |
| 5 | A Figma library? | yes, generated from the same files, as the second wave | **npm is primary; Figma components and assets are the next pass, after this one** |
| 6 | What stays private? | the stroked source and the repo; one-time purchase, lifetime updates, per-seat tiers, no resale | taken — price and tiers are Maruti's, outside this plan |
| 7 | The product's name in code | `@mavan/icons` + `@mavan/icons-react` if free (they are) | taken |

Two questions still open, answered with the nod:

- **How a customer installs the npm packages.** Private packages on npm's registry need every customer
  to hold an npm account inside our org. Recommendation for 1.0: **tarballs inside the download**
  (`npm install ./mavan-icons-1.0.0.tgz`, which the customer commits beside their code); a token-gated
  registry is the shop's problem, next pass.
- **A git tag on the 1.0.0 commit.** The hard rule forbids pushing, branching, PRs and rewriting
  history; a tag is none of those but is not granted either. Recommendation: tag `v1.0.0` locally, as
  the mark the next release diffs against. Without the nod, 3.3 commits and does not tag.

## Cards

Models: hard geometry and anything judged → Fable (Opus when Fable is at its limit); building from a
clear spec → Opus; lookups and browser checks → Sonnet. No agent writes `src/icons/`, the sheet, the
board, or the repo's `package.json` — Claude in the main session adds the one dependency (1.1) and the
`release` script (2.1) itself. Each card owns its files; `tools/build.mjs` belongs to 1.2 alone,
`tools/release.mjs` to 2.1, and the README and LICENSE templates to 2.3, which 2.1 only copies.

### Wave 1 — the parts that must be exact (parallel)

- [ ] **1.1 The outliner.** *Owns:* `tools/outline.mjs`, `tools/outline.test.mjs`; reads
  `plans/proof-outline/exact.mjs` and `cleanup.mjs` and retires the proof folder when done. Lift the
  proof into a tool: one function, stroked SVG text in → outlined-fill SVG text out, every path at its
  own weight (the per-path widths of a `glyph` or `badge`), already-filled areas passed through
  untouched, the raster gate built in. Fix the 5 wrong files; set the curve fallback to precision 256.
  *Done when:* every file in `src/icons/` converts with 0 wrong pixels against the exact reference and
  an ink box equal to the source's to 2 dp; the 224 curve files are listed with their worst error; the
  test runs the sample of 16; `npm run check` unchanged. *Model:* Fable (the 5 failures are hard
  geometry; Opus at Fable's limit). *Depends on:* nothing.
- [ ] **1.2 Metrics made correct.** *Owns:* `tools/optical.mjs`, `tools/geometry.mjs` (`bbox` for
  curves, `anatomy`), `tools/build.mjs`, `tools/geometry.test.mjs`. Shape-filled files get real optical
  recession; the bare `x` reports no container; curves are boxed by their true extremes. *Done when:*
  (1) every filled file whose ink box equals its outline twin's has optical bearings within 0.05 of the
  twin's on every side, and the files outside that are listed with their numbers; (2) `container` is
  null for `x`, `x-large`, `x-small` and unchanged for every icon that has a ring; (3) `icons.json`'s
  ink box equals the exact ink to 2 dp in every file; (4) `node --test` passes and the lint output on
  `src/icons/` is byte-identical except the lines this card lists. *Model:* Fable. *Depends on:* nothing.
- [ ] **1.3 The package's index.** *Owns:* `tools/package-meta.mjs`. From the sheet and the files:
  per icon, `name, category, section, variantOf, tags, mvp, styles, masters`, and the set's version;
  variants grouped under their base. Also prints the rows with no category (34 today) and the untagged
  icons (24 today) for Maruti to fill before 1.0 — the categories are his call, the tags the drawer's.
  *Done when:* `meta.json` round-trips every approved row and the two lists are printed. *Model:* Opus.
  *Depends on:* nothing.
- [x] **1.4 The name on npm.** *Owner:* Maruti. Create the `mavan` npm org (or user) so `@mavan` is
  ours. Claude cannot do this: it needs his account. *Done when:* `npm org ls mavan` answers.

### Wave 2 — the box (depend on 1)

- [x] **2.1 The box: `@mavan/icons`.** *Owns:* `tools/release.mjs`, `packages/icons/` (generated,
  gitignored but for its `package.json` template). `npm run release` runs check, outlines every
  approved file (1.1), writes `svg/24|20|16/<name>.svg` and `-filled.svg`, `icons.json`,
  `metrics.json` (1.2), `meta.json` (1.3), copies README and LICENSE from 2.3's templates, writes
  `CHANGELOG.md` from the sheet's approval dates, then `npm pack` → `mavan-icons-<version>.tgz`, and
  zips the lot. Refuses to run on a dirty tree, a failing check, or — after 1.0 — a sheet whose names
  differ from `packages/names.lock`. *Done when:* the folder matches the layout above, every file in it
  is an outlined fill (lint's stroke checks find zero strokes), the file count is 2 × 3 × the sheet's
  approved rows, and the zip opens. *Model:* Opus. *Depends on:* 1.1, 1.2, 1.3, 2.3.
- [x] **2.2 The React package: `@mavan/icons-react`.** *Owns:* `tools/gen-react.mjs`,
  `packages/icons-react/`. One `<Icon name size optical />` and one generated component per icon and
  style (`Check`, `CheckFilled`), so an app bundles only the icons it uses, with no runtime
  dependency. Picks the master by the size rule 2.4 settles; `optical` applies `metrics.json`'s
  bearings as negative margins so `padding` is true to the ink; `currentColor` throughout (the icon
  takes the text colour); TypeScript types for every name. *Done when:* a throwaway app renders every
  icon at 16 · 20 · 24 from the package and the bytes it ships are the outlined fills, not the stroked
  source. *Model:* Opus. *Depends on:* 2.1, 2.4.
- [x] **2.3 The licence and the README.** *Owns:* `packages/templates/LICENSE.md`,
  `packages/templates/README.md`. A draft licence: one-time purchase, lifetime updates, seat tiers
  left as `[Maruti]`, no resale or repackaging, no redistribution of the files on their own. **Maruti
  reads it and takes it to whoever he trusts for legal wording; Claude drafts, never settles, a
  licence.** README: the size rule, the metrics in one paragraph, the folder layout. *Done when:* both
  files exist, every `[Maruti]` is listed, and the README's size rule is 2.4's pick word for word.
  *Model:* Sonnet drafts, Fable reviews. *Depends on:* 2.4.
- [ ] **2.4 The size rule, picked by eye.** *Owns:* `tools/size-sheet.mjs`, `lab/size-rule.html`. One
  board, one question: at the sizes between masters (17–19, 21–23) and above 24, does the master below
  scaled up or the master above scaled down read better? The sheet shows twenty icons at every size
  from 14 to 32 both ways, real pixels. **Maruti picks**; the pick becomes the component's thresholds,
  the README's rule, and a Settled row in `CLAUDE.md` with a section in `docs/01-foundations.md`
  (its home — written in 3.3, in one commit). Recommendation to start from: the master at or below
  the size, scaled up; 24 at and above 24. *Model:* Opus builds, Maruti decides. *Depends on:*
  nothing (runs in wave 1).

### Wave 3 — prove

- [x] **3.1 Installed and looked at, as a customer.** *Owns:* `plans/proof-install/`. A throwaway
  project installs both tarballs from the zip, renders every icon at 16 · 20 · 24 outline and filled
  in the browser pane, and compares each against the lab's rendering of the stroked source pixel for
  pixel in Chrome; also settles the pinhole question (do dots under half a stroke show a hole in Chrome
  at 1× and 2×?). *Done when:* zero pixel differences, or every difference listed with its icon and a
  screenshot. *Model:* Sonnet. *Depends on:* 2.1, 2.2.
- [x] **3.2 Fresh review.** An agent that did none of the work checks the box against this plan, as a
  checklist: every approved row present at three masters and two styles; no stroke in any shipped
  file; a metrics entry for every icon; the README's size rule equals 2.4's pick; the LICENSE carries
  no unfilled `[Maruti]`; `names.lock` lists every approved name. *Done when:* every line is ticked or
  its failure named. *Model:* Fable. *Depends on:* 3.1.
- [ ] **3.3 1.0.0.** Maruti's nod on the looked-at box → `packages/names.lock` written, version
  1.0.0, tarballs built, and the decisions recorded in one commit: a **Shipping** row in `CLAUDE.md`'s
  Settled table (the box, the size rule, the licence terms, `names.lock`), the size rule in
  `docs/01-foundations.md`, and `docs/09-rule-audit.md`'s "shipped format unbuilt" line closed. Tagged
  `v1.0.0` only with the nod above. Nothing is pushed or published anywhere by Claude.

## How the combined result is proven

- `npm run check` and `node --test tools/geometry.test.mjs tools/outline.test.mjs` pass; the lint
  output on `src/icons/` is byte-identical before and after, except the lines 1.2 lists.
- Every file in the box is an outlined fill with 0 wrong pixels against the exact reference and an ink
  box equal to the source's to 2 dp; the count of files equals 2 × 3 × the sheet's approved rows.
- The customer's view (3.1) renders pixel-identical to the lab's, or the differences are on record.
- A fresh reviewer (3.2) ticks the checklist against this document.

## Next pass (recorded, not planned)

Figma components and assets generated from the same files (Maruti, 2026-10-26: "once this pass is
done"). The shop: licence keys, seat counts, a token-gated registry so `npm install @mavan/icons`
works without a tarball. A public showcase page from the Library.

## Results

### Card 3.2 (2026-10-27)

A fresh Fable agent that did none of the work, on a real release of its own (no flags, 260 s) at
a2c3cfa, the commit before the tag sweep. Card 3.2's checklist:

| Line | Result |
|---|---|
| 1 · every approved row at three masters and two styles | **ticked** — 1,309 rows (`stack-3` retired), 2,618 files per master in the folder, the tarball, the zip; 2,618 React components + `Icon`; names exact both ways |
| 2 · no stroke in any shipped file | **ticked** — 0 in the SVGs, `icons.json`, `metrics.json`, the React code; 0 of 15,892 stroked centrelines in the box |
| 3 · a metrics entry for every icon | **ticked** — 2,618 per master, each `ink`, `bearing`, `optical` only; the README's worked example true |
| 4 · the README's size rule = 2.4's pick | **ticked** — word for word; React picks 16 at 15–19.99, 20 at 20–23, 24 from 24 |
| 5 · the LICENSE carries no `[Maruti]` | **fails, as expected** — 24 open; at 1.0.0 the release refuses them |
| 6 · `names.lock` lists every approved name | **fails, as expected** — written by 3.3; in the reviewer's clone `--lock` wrote exactly the 1,309 names, and with a settled licence a 1.0.0 build passed every gate |

Also confirmed: README and box agree both ways (no `section`; nothing names `stack-3`); 231 tests pass;
`npm run check` 7854 · 0 failed; card 3.1's pinhole reading reproduced to the pixel (`more-horizontal-filled`
centre 55 in the lab against 0 in the box at 1×). Its findings: the README's "draw alike on purpose" list
missed `camera-off-5`, `microphone-off-5` (the off states, at 16) and `battery-filled` = `battery-full-filled`
— added the same day; `text-4` and `dollar-circle-2` stay off it while Maruti reworks them. The tag sweep
it saw in flight was committed after it (9a3461e). **Nothing found that blocks 1.0.0 on the pipeline's
side.**

### What 1.0.0 (card 3.3) needs from Maruti

1. **The licence** — the 24 `[Maruti]` decisions settled with his adviser; the release refuses a 1.0.0
   while any remains.
2. **`text-4` and `dollar-circle-2`** — his rework, or ship them as they are; their names freeze either way.
3. ~~**The `mavan` npm org** reserved (card 1.4).~~ **Done 2026-10-27.**
4. **His look at the dots** — in his own Chrome, the Library's `select-2` or `more-horizontal-filled`
   zoomed: solid or rings? Customers get solid either way.
5. **His nod on the looked-at box** → 3.3: `npm run release -- --lock`, version 1.0.0, the Shipping row in
   CLAUDE.md's Settled table and docs/01 in one commit, a local `v1.0.0` tag (nodded 2026-10-26).


### Card 3.1 (2026-10-27)

`plans/proof-install/` (Sonnet; rerun: `npm run release`, then `node plans/proof-install/run.mjs`, about
9 minutes). A real release first (no flags: 7,860 files, every gate, 267 s), the zip unzipped and both
tarballs installed into a throwaway app exactly as the README says — its install lines and React lines
work as written. Then every name, outline and filled, at 16 · 20 · 24, at 1× and 2× (15,720 icon
drawings a side, 31.2 M pixels), the customer's React component against the stroked source drawn the
way the Library draws it, in Chromium 153, one page per kind at the same positions. Controls (the lab
twice, React twice, React against the installed `.svg`, inline against `<img>`): **0 differing pixels**
— so the React package and the shipped files draw identically.

| Customer against the lab | Pixels |
|---|---|
| identical | 30,265,499 (96.9%) |
| differ by 1–127 of 255 — edge smoothing of a stroke against its outlined fill | 963,165 |
| **differ by more than 127** (the 1.1 gate's "wrong") | **1,736**, in 276 drawings of 119 names |

The 1,736, by cause (every one listed in `out/compare.json`, a crop each in `out/diffs/`, the worst on
`plans/proof-install/diffs.png`):
- **Pinholes, 1,701 pixels, 95 names:** every one lighter in the lab, at the centre of a dot drawn as a
  stroked circle smaller than its pen (or inside a thin loop). The box draws them solid.
- **One junction pixel, 35 pixels in 25 drawings** (`eye-filled`, `lock-4-filled`, `refresh`…, 1–2 each,
  largest 188, none black against white). Drawn 16× larger both ways, the two agree to 8 of 255, and in
  23 of 25 the box's pixel is the nearer to the truth: the stroke renderer's rounding, not missing ink.

**The pinhole question, settled for Chromium:** in its default renderer **the lab draws every dot smaller
than its pen as a ring** — the dot's centre is lighter by a third or more for 474 of the set's 729 such
dots at 1× and 651 at 2×, fully empty (255) for 97 at 2×, and empty for all of them drawn at 4× and 8×.
`more-horizontal-filled` at 24: centre 55 in the lab, 0 in the box at 1×; 188 against 0 at 2×. The box
draws every one solid, as the drawing means (a circle smaller than its pen paints a full disc). So
**customers get solid dots; the Library may have been showing Maruti rings** — the `i` and `!` dots of
`info-circle`, `alert-circle`, `help-circle`, the dotted frame of `select-2`, the bullets, grids, loaders,
drag handles, and the keys and windows of `calculator`, `server`, `building`. With Chromium's GPU path
(emulated here, no GPU) the rings mostly close at 2× and some remain at 1×: it depends on the renderer,
so only Maruti's own Chrome can say what he saw.

Not covered here: Firefox and Safari (not on this machine), the scaled sizes between masters by eye, a
real Vite or Next.js app, and `--gate`.


### Wave 2 report (2026-10-27)

**Shipped to the branch** `claude/focused-noether-4uv2b2` (pushed; not merged, not tagged, nothing
published): `npm run release` now builds the whole box from the sheet — the download folder, the zip,
and the two npm tarballs `@mavan/icons` and `@mavan/icons-react` — with the README and a licence draft
inside. On the last full run: 7,860 outlined files (2 styles × 3 masters × 1,310 names), no stroke
anywhere, none of the stroked source in the box or the React package; the box's tarball 2.95 MB, the
React tarball 3.0 MB, the zip 11.75 MB with both tarballs inside (8.7 MB before the React one); a release takes about 4½ minutes on this 4-core machine (most of it
the check and the outliner). In React, `<Check size={16} />` draws the 16 master; an app that uses only
`Check` carries about 2 KB of it.

**Failed or fell short, with what was done:** two review findings on 2.1 (a README that could name a
missing tarball; a cleanup test that could cut a curve short) and three on 2.2 (a stray `name` prop in
the types, the build tool's path printed in the shipped code, a stale proof constant) — all fixed and
re-proven the same day. Left as is: a JavaScript caller who passes `size` as a string gets the 16 master
(the README says it is a number; TypeScript rejects anything else). Not proven here, for card 3.1:
Firefox and Safari, a real Next.js and Vite app, Jest, a screen reader, the scaled sizes between masters
by eye, and the pinhole dots.

**For Maruti — to decide or look at (none blocks wave 2; most must be settled before 1.0.0):**
1. **Reserve the `mavan` npm org** (1.4). **Done 2026-10-27, by Maruti.** The packages build as `@mavan/…` without it, but the name is
   not ours until it is reserved.
2. **The licence:** 24 `[Maruti]` decisions (card 2.3 Results), to settle with your legal adviser. One is
   a business call: allow the whole set inside one product (the `Icon`-by-name component bundles it, and
   a public website's bundle then carries every icon as shapes)?
3. **Identical drawings under different names.** The 7,860 files hold 7,796 different drawings: 116 files
   in 52 groups are byte-identical to another name's file at the same master. Some look deliberate (a
   variant that merges with its base at 16: `camera-5`, `files-5`, `help-circle-2`, `text-4`,
   `microphone-2` = `-5`; `battery-filled` = `battery-full-filled`; a keycap's filled twin equal to its
   outline: `alt`, `escape`, `delete-forward-2`). Some are the same drawing under two names at every
   master: `ban-2` = `ban`, `building-3` = `building-4`, `compass-3` = `compass`, and the outline of
   `layout-header`, `-footer`, `-sidebar`, `-sidebar-right` = their `-2` = their `-3` (only the filled
   twins differ); `categories-2` = `stack-3` at 24. Once 1.0 ships, every name is permanent — a ruling
   per group (keep, redraw, or retire before 1.0) is wanted.
   **Ruled 2026-10-27** after a board of the pairs (each at 24 · 20 · 16, outline and filled, real pixels):
   **retire `stack-3`** (it was `categories-2` at 24); **`text-4` and `dollar-circle-2` held untouched** —
   Maruti has his own ideas for them; `microphone-5` kept. The other 14 families are deliberate and on
   record (shared outlines filled differently, C21 and C29; merges at 16 where a detail cannot keep its
   air), and the README now says so in two sentences.
4. **Text customers will read in `meta.json`:** tags "square keyline" (`phone`, `phone-off`), "diamond_shine"
   (`gem-shine`), "material blur_on" (`filters-3`, another set's icon id); 24 icons with no tags; and the
   `section` field ("D · The rest, by audit rank", "E · Added on request"). Recommendation: fix the four
   tags, tag the 24, and leave `section` out of the box.
   **Ruled 2026-10-27:** `section` leaves the box (done, below). The tags: Maruti reads the full list of
   proposed changes first (`plans/shipping-tags.md`) — a sweep found **300 tags on 134 icons naming other
   icon sets** (lucide, nucleo, material, sf symbols…), which would ship competitors' names to customers.
   **Applied 2026-10-27** (Maruti: "lock and approve whatever we have"; a proper tags pass comes later, as
   its own pass): 181 icons, 1,086 files, tags lines only — 342 words out (other sets' names and ids, the
   products a drawing was seen in, our workshop words, battery's "empty"), 127 in (every icon now has
   search words; `stack-3`'s cards, deck, pile on `categories-2`); `text-4` and `dollar-circle-2` untouched.
   Checked line by line against the list by a fresh Sonnet agent: 0 mismatches. The lint rule that would
   keep source names out of tags (the list's call 7) waits for the tags pass.
5. **Two lines of `CLAUDE.md` are stale** (a docs change, for your nod): the "13.7–16.2px of visual
   padding" figure was never measured (`plans/set-and-rules-audit.md` card 1.12), so the box README does
   not use it; the `grows:` census reads 97 files on 33 concepts, today 171 files on 59 names.
6. **Wave 3** when you want it: 3.1 installs both tarballs as a customer would and looks at every icon in
   a real browser (and settles the pinholes), 3.2 a fresh review, 3.3 the 1.0.0 cut.

### Card 2.2 (2026-10-27)

`tools/gen-react.mjs` (Opus) turns the box into `@mavan/icons-react`; the release runs it and packs it.
It reads only `packages/icons/` — the outlined `svg/` files byte for byte, `metrics.json`'s optical
bearings, `meta.json`'s names — never `src/icons/` or `dist/`, and refuses a short box, a file not in the
shipped form, a name that is no identifier or collides, or the word "stroke" in the code it writes. The
package: one component per name and style (2,620, `Check`, `CheckFilled`) and `Icon` by name; types
`IconName` and `IconProps`; nothing else exported. `size` picks the master by the settled rule (16 below
20, 20 below 24, 24 from 24); `optical` sets negative margins from the optical bearings × size ÷ master;
`title` makes it a named image, otherwise it is hidden from screen readers; `currentColor` throughout.
ESM and CommonJS, React 18 or 19 as a peer, no dependencies, `"private": true`. The proof app is
`plans/proof-react/` (scripts committed, its installs and `out/` ignored).

Measured (the builder's proof, then the reviewer's own release and checks):

| Measure | Result |
|---|---|
| Package | 5,251 files, 17.9 MB unpacked; tarball about 3.0 MB; one module per name, median 2.9 KB |
| Server rendering | every component at 16 · 20 · 24 and nine sizes between, ESM and CJS, React 18.0, 18.3, 19.0, 19.3: 649,808 renders, each the box file's path byte for byte at the rule's master; 0 React warnings |
| The size rule at its edges | 12, 15, 17, 19, 19.99 → 16 · 20, 21, 23, 23.5 → 20 · 24, 25, 32, 48 → 24 |
| Chromium, every icon at 16 · 20 · 24 | **0 differing pixels** against the box's own `.svg` files (6.2 M pixels per comparison); the reviewer's own grids at 1× and 2×: 0 of 4.6 M |
| `optical` | every laid-out box within 0.03 px of size − (left + right) × size ÷ master (Chromium lays out on a 1/64 px grid) |
| Colour, labels, refs | every icon takes the text colour; untitled icons hidden from the accessibility tree, titled ones named images; `ref` reaches the `<svg>` |
| The stroked source | **0** of 11,939 stroked centrelines in the package or in any of five bundles; no "stroke" in its code |
| An app that imports only `Check` | 1,986 B of package code minified (1,013 gzipped), three drawings; `Icon` by name: 8.07 MB (1.40 MB gzipped), all 7,860 |
| Bundlers | esbuild, webpack 5 and Rollup 4 build and run it; it renders in a React Server Component without `'use client'` |
| TypeScript | five setups; a wrong name, a wrong prop or a missing `Icon` name is an error |
| Contact sheets | every outline icon at 16, 1× and 2× (`plans/proof-react/out/`): 1,310 inked, none blank, none outside its box — looked at by the reviewer and the main session |

The README's "Use in React" was brought in line with the package after the build (eight of the names
that shadow a global; `focusable="false"`; `width`, `height` and `viewBox` follow `size`; an unknown name
renders nothing). Review findings (fresh Fable agent), none blocking: `IconProps` let a stray `name`
through to the `<svg>`; every shipped code file named the repo's tool in its header; the proof's list of
global names was stale — **all three fixed the same day**: `IconProps` omits `name` (a
`@ts-expect-error` proves it in all five TypeScript setups), the header names only the package (0 repo
paths anywhere in the package), the proof reads the names from the README; 9 of 5,251 files changed,
tarball 3,019,756 B, the proof 37 of 37 again, 230 tests pass. Left as is: no runtime guard on `size` for JavaScript callers.


### Card 2.1 (2026-10-27)

`npm run release` (`tools/release.mjs`, Opus) builds the box from the sheet's approved rows: the
outliner over every file, `packages/icons/` as the npm package, `npm pack`, the download folder and
the zip under `dist/release/`. `packages/icons/package.template.json` is committed; the version
comes from the root `package.json` alone (0.0.1), and `"private": true` makes npm itself refuse an
accidental publish (packing and installing the tarball still work). `npm run release -- --gate` adds
the raster gate; `-- --lock` writes `packages/names.lock` for 3.3; `--allow-dirty`, `--skip-check`
and `--templates` are for working on the tool, and a run with any of them is named `-dev`.

Measured on the reviewer's own run (a clean commit in a scratch clone, no dev flags):

| Measure | Result |
|---|---|
| Check before the build | 7860 drawings · 7604 clean · 256 warned · 0 failed (the baseline) |
| Files | 2,620 per master, **7,860 = 2 × 3 × 1,310** approved rows (counted with `parseSheet`) |
| Strokes in the box | **0** stroked paths, 0 stroke attributes; every file one evenodd path on `<svg xmlns viewBox fill="currentColor">` |
| Source leaking | 0 of the 19,072 stroked centrelines in `dist/icons.json` appear in any shipped path or in the box's `icons.json`; no comment, note, `src/`, `tools/` or private data anywhere |
| Ink box | equal to the source's exact ink to 2 dp in every file (worst 0.0026) |
| Download folder | 21.6 MB: `svg/` 8.7 MB, `icons.json` 7.9 MB, `metrics.json` 1.3 MB, `meta.json` 0.7 MB |
| Tarball | `mavan-icons-0.0.1.tgz`, 2.95 MB, 7,867 entries; installs, and `@mavan/icons/svg/24/check.svg`, `/icons.json`, `/metrics.json`, `/meta.json` resolve |
| Zip | `mavan-drawer-0.0.1.zip`, 8.7 MB, 7,872 entries; `unzip -t` and Python's `zipfile` open it |
| Time | 278 s: check 161, outlining 111, pack 4, zip 2 |
| Refusals | each refused with nothing zipped: a dirty tree, a stray `{{…}}` in a template, a sheet row with no files, a failing check, `--lock` below 1.0.0, a 1.0.0 still carrying `[Maruti]` |
| Tests | 224 pass (`geometry`, `outline`, and 8 new in `release.test.mjs`) |

What ships beside the SVGs: `icons.json` is built from the outlined files (`dist/icons.json` holds the
stroked source and is never copied); `metrics.json` keeps only `ink`, `bearing` and `optical` per
master and name — the design measures lint uses (`shift`, `container`, `ratio`, `gap`, `recession`)
stay private, since whatever ships at 1.0 becomes a promise; `meta.json` is card 1.3's, less `section` (the sheet's drawing order; Maruti, 2026-10-27: "leave section out" — the release drops it and gate d refuses one);
`CHANGELOG.md` lists this first build by category, one line per family, and after 1.0 lists only the
names a release adds to `names.lock`. The README and LICENSE come from card 2.3 with the three numbers
filled; the release warns while the licence's 24 `[Maruti]` marks remain and refuses them at 1.0.0.

**The outliner polish** card 1.1 left (`clean()` in `tools/outline.mjs`): files with zero-length
steps 262 → 0, files with stray curves 22 → 4 (the four are curves PathOps hands back that fit no
known circle — `24/shield-off-2-filled`, `16/at-sign-2-filled`, `16/fingerprint`, `16/map-pin-off-4`;
correct and raster-clean, their fix belongs in `snap()`). Proven by the full `outline.mjs --check`
over all 7,860 files after the change: **0 wrong pixels**, every ink box equal to 2 dp (91 min on 4
cores).

Review findings (fresh Fable agent), none blocking the card:
1. The README names the React tarball, but a release without card 2.2's tool would skip it and still
   pass — the release should refuse a README that names a tarball it did not build. **Fixed the same
   day** (611bb55): `unbuiltTarballs` in `tools/release.mjs` refuses, dev runs included, naming the
   tarball and the README's lines (19, 28); a release without card 2.2's tool now stops there.
2. `clean()`'s flatness test measured a curve's control point against the chord's whole line, not the
   segment, so a curve that doubles back along its chord could be cut short. No drawing in the set
   does it (the full check is clean), but it is unsafe in general. **Fixed the same day** (611bb55):
   measured to the segment; `M0 0Q10 0 1 0L1 5` keeps its curve. All 7,860 shipped files are
   byte-identical before and after (diffed against the reviewer's run), so the full check above still
   holds; 225 tests pass.
3. For Maruti and the drawer before 1.0 — text that reaches customers in `meta.json`: `phone` and
   `phone-off` carry the tag "square keyline" (our own drawing vocabulary); `gem-shine` carries
   "diamond_shine" and `filters-3` "material blur_on" (another set's icon ids); `section` ships values
   like "D · The rest, by audit rank" and "E · Added on request".
4. `meta.json`'s `built` is the day the box was made, so two releases of the same sheet on different
   days differ by that one field.
5. Card 1.2's, for the record: in 289 entries `bearing` and the optical reading's geometric part differ
   by 0.01 (2-dp rounding of the same edge, `16/alt` bottom 4.62 against 4.63).

### Card 2.3 (2026-10-27)

`packages/templates/README.md` (126 lines) and `LICENSE.md` (127 lines), drafted by Sonnet, reviewed by a
fresh Fable agent who made nine edits (below). The release fills exactly three placeholders — `{{version}}`,
`{{icons}}` (base concepts), `{{names}}` (every shipped name) — and refuses any other `{{…}}`. The README
carries the size rule word for word ("the master at or below the size, scaled up", "24 at and above 24",
with 16–19 · 20–23 · 24+ and nothing scaled down), the metrics in one paragraph, the folder layout, the
React API card 2.2 builds to, and the JSON fields. Its only numbers are placeholders, master sizes, the
rule's thresholds and the worked example measured from `dist/metrics.json` this session (at 24 `plus`
bears 4.5 on every side, `circle` 2; optical 4.52 and 2.71).

Review edits: the global-name aliasing (`import { Map as MapIcon }` — nine names shadow a browser or Node
global: `Map`, `File`, `Image`, `Text`, `Window`, `Option`, `Lock`, `Clipboard`, `Navigation`); every
meta.json field described plainly; "every name carries tags" softened (24 icons carry none today); the
filled-grows sentence made true (59 names, 171 files, at most 1.5 at 24 and 1 at 16); the bearing to
subtract named as the optical one; in the licence, a clause that contradicted `Icon`-by-name (which
bundles the whole set) reworded, and three decisions the draft had taken silently given `[Maruti` markers.
The main session then made `IconProps` the props every component takes (`Icon` adds `name`).

**The licence's 24 `[Maruti]` decisions** (all in LICENSE.md; the README has none), each with the
draft's recommendation. Claude drafts; Maruti settles with his legal adviser. The release refuses a
1.0.0 that still carries any of them.

1. Top notice: a draft, not in force — settle with the adviser, answer every note, delete the notice.
2. Licence version and date — number it 1.0, keep old versions on file.
3. Licensor's legal name, address, contact — the entity taking the money and owning the copyright.
4. Terms of later versions — a customer keeps the terms bought under for the versions they have.
5. What "lifetime" means — the product's lifetime, with notice if it stops; customers keep what they have.
6. What counts as an update — new versions of Mavan Drawer only; a new product is priced on its own.
7. What a seat is — one person doing design or development work with the icons, by person.
8. Who needs a seat, moving one — contractors need their own; a seat moves when someone leaves.
9. A developer who only builds or runs the code — no seat for building, running, deploying; machines never.
10. The tiers — names, seats per tier and price of extra seats go with the price list.
11. Where the files may be kept — private repositories and tools limited to seat holders.
12. The whole set inside one product — allow it (the `Icon` API bundles it); forbid handing icons on as
    files or a library. **A business call:** a public website's bundle then carries the whole set as
    outlined shapes; if Maruti restricts that, the README's `Icon` guidance changes with it.
13. Source or design files handed to a client — only as part of that product.
14. Open-source projects — public source must not contain the icons; a built release may.
15. Logos and trademarks — not allowed.
16. Machine learning — no training, fine-tuning, evaluation or datasets; use in a product's interface allowed.
17. Modifications — recolour, resize, adjust allowed; a changed icon stays under the licence.
18. Transferring a licence — not transferable; ask the adviser about the sale of a business.
19. Ownership — the icons stay Maruti's; the adviser words the copyright notice.
20. Refunds — a fixed window in days, ending once downloaded and used (consumer law: the adviser).
21. Termination on breach — written notice and time to fix; none for resale or redistribution.
22. Warranty — the adviser's wording; intent "as is"; no non-infringement promise until the adviser says how.
23. Limit of liability — the adviser's wording; intent: no indirect loss, capped at the price paid.
24. Governing law and disputes — the licensor's country; the adviser on consumer law and "worldwide" (§3).

Found on the way, for the main session (docs, not this card): CLAUDE.md's "13.7–16.2px of visual
padding" (its `metrics.json` paragraph, also the root README) is marked never measured in
`plans/set-and-rules-audit.md` card 1.12, so the box README does not cite it; CLAUDE.md's `grows:` census
(97 files on 33 concepts) is stale against today's 171 files on 59 names.

### Card 1.3 (2026-10-26)

`meta.json` holds one entry per approved row (1310, measured against the sheet's `- [x]` rows), 458
families covering every name once, 852 variants, 0 missing files, byte-identical on a re-run. Six
things the index found on the sheet, for Maruti's rulings before 1.0 (categories are his):

1. **34 rows have no category**, 13 of them variants of uncategorised bases (`layout-sidebar`,
   `sort-numeric`, `wheelchair` families) — filling the bases clears most of the list.
2. **Seven numbered names have no `variant of`** and so count as icons of their own against the
   "a `-2` is never an icon" rule: `info-circle-2`, `info-circle-3`, `help-circle-4`, `sort-3`,
   `sort-alpha-ascending-2`, `plane-2`, `plane-3`.
3. **"V3 Other badges" sits in the category column** of `calendar-clock`, `file-clock`,
   `shield-pending` — a variant-round label, not a product category.
4. **16 variants carry a category different from their base's** (`link-off` Editing & Text under
   `link` Files & Folders; `gear-nodes` Development & Infra under `gear` UI & Layout). Some may be on
   purpose.
5. **62 variants name another variant as their base** (`clipboard-check-2` → `clipboard-check` →
   `clipboard`); the index keeps the direct base as `variantOf` and the root as `family`.
6. **24 icons carry no tags** (the plus, minus and x families and their `-circle` / `-square`
   forms, `more-*`, `map`, `folder-open`, `-2`, `receipt-refund`) — the drawer's to fill.

### Card 1.2 (2026-10-26)

Three defects fixed in `tools/geometry.mjs`, `optical.mjs`, `build.mjs`, measured on the whole set
against main at 98f9bff8; 205 tests pass; lint exit 0 with 31 lines changed, all the 2-dp size or
centre of files whose arc extreme the old 64-point sampling missed, no verdict changed.

1. **A filled shape is read as ink to its edge**, scanline by scanline (a scanline on a flat edge
   reads it end to end; tangents with 1e-4 tolerance), so a solid silhouette recedes as its outline
   does: `plus-circle-filled` 2.0 → 2.70 beside `plus-circle`'s 2.71; `archive-filled` 3.87 beside
   3.84; `atm-filled` 2.82 = 2.82; `user` twins 4.33 = 4.33. Of 2,904 shape-filled pairs with equal
   boxes, 541 still differ by more than 0.05: 516 are genuine silhouette differences (`user-4-filled`'s
   open bowl 3.02 against the flat 3.93), 25 are ties where two features reach the same extreme and
   the walk starts from a different scanline (`skip-back`'s bar and triangle).
2. **A container must bend:** a single straight stroke is no longer read as a ring. `x`, `x-large`,
   `x-small` → null (were 13 · 16 · 10), with the C21 bars (`phone-off`, `volume-off`, `clipboard-off-*`…)
   and the shafts of `key-2/3/4-filled`, `user-x-filled` and their kind: 75 → null; `reset`, `replay-2`
   and twins gain 19.98 at 24, right (their arc shell spans the whole box, as at 20 and 16 already).
   Every real ring unchanged.
3. **Ink boxes are exact:** arcs and curves boxed by where they turn back, not by samples or control
   points. 32 boxes moved by 0.01 (`euro`, `orbit`, `status`, the `rotate-*` and `signal-*` filled
   files, `caret-up-2` at 16…) — the culprit was arc sampling, not the curves. `label-important-filled`
   was found 0.005 past the margin by it and redrawn (notch arcs r1.74 ending at 2.54, both readers on
   x 2.000; commits aab410d8, 98f9bff8).

**Side effect, on record:** the optical bearings of 385 outline files moved — 338 by 0.05 or less (the
scanlines now start on the exact ink edge), 47 by more, max 1.04, each traced to a hidden defect of the
old reading: a sampled arc miss (`command`, `pound-filled` 24, `scale`, `bank` 20…), a tangent missed by
float dust and read asymmetrically (`more-horizontal`/`-vertical` 3.4/3.49 → 3.47/3.47, `cpu`), or a
step within 0.01 of one stroke that now bridges deterministically (`baht` 1.5021, `lock-3`, `indent-3`,
`users-level` 1.5000). The scanline start is snapped to 1e-4 so float dust cannot move it; anchoring
to the canvas grid was tried and rejected (242 files would move against 47).

**Open for Maruti's eye — the ⌘ reading.** The model has always let a step of exactly one stroke
bridge (`> stroke` in the old code); `command` read 4.67 only because its sampled box sat 0.0007 off,
and it now reads 5.06, bridging from the loops' bottom tangent to the stem. The reviewer's eye reads
⌘'s edge as the two loops, with the stem in a notch 4.5 deep and 3 tall, a counter like the plus's,
and would rather 4.67. Breaking at one stroke instead moves 113 outline files and parts every filled
twin whose C22 band sits one stroke from a flat outline edge (`archive-filled` would read 3.06 against
3.84). It is one constant (`JUMP`, `tools/optical.mjs`) either way; the comment there names both
readings. Not blocking: a board of `command` beside `plus` and `archive` when the optical model is
next tuned (CLAUDE.md Open item 3).

### Card 1.1 (2026-10-26)

`tools/outline.mjs`: `await outline(svgText, { master })` returns the outlined-fill SVG the box ships —
every stroked path offset exactly by our own pen (a line stays a line, an arc stays an arc, round
caps and joins), merged by Skia's PathOps, written back as true arcs at 3 dp; filled areas pass
through; a `glyph` or `badge` path keeps its own weight; the root is `<svg xmlns viewBox
fill="currentColor">` with one evenodd path and no comment, stroke, transform, group or id. `await
check(src, out)` is the raster gate (the exact reference against Skia's rendering); the CLI converts
one file or runs `--check [names…]` over the set on all cores.

Full run, 7,860 files: **0 wrong pixels; every ink box equal to the source's exact ink to 2 dp;** the
224 curve-fallback files (Skia's stroker at precision 256) worst 0.0013 at the edge
(`24/currency-convert`); 12 files whose corner arc misses tangency by up to 0.0086 because of the
drawing's own 2-dp rounding (`20/gear`, `20/automation`, `24/bookmarks-4`), invisible at any raster.
The proof's five wrong files were four PathOps weaknesses fixed generally (near-coincident circles
snapped to a registry, coincident arcs split at the same angles, zero-width inner contours dropped
under 0.02, the arc writer rebuilt on point tests); no name is special-cased. Conversion is 7 ms a
file; the exact reference in `check` is the slow part (about 0.3 s a file, 18 min for the set on 14
workers).

Review (Opus, independent renderer resvg, 38 files at 24 · 48 · 96 px against its own flattened
reference): no pixel differs by 96/255 or more anywhere, worst antialiased edges on `pound`
(71/255); hygiene clean on all 7,860 outputs; rings keep their holes, dots stay solid. **One bug
found and fixed before the commit:** the Skia surfaces were freed with `.delete()`, which leaves
their pixel buffers, so one process grew to 2.1 GB and died near its 900th file; `.dispose()` keeps
it flat (150 MB over 400 conversions, measured). Noted for card 2.1's polish, not blocking: 262
outputs carry zero-length segments after rounding (`H7.996H7.996`), 22 carry stray `Q` segments
without a curve fallback, `16/chevrons-down-2` has degenerate joins — dropping zero-length segments
in `clean()` fixes the first two; and a future `fill="currentColor"` path without `stroke="none"`
would have its stroke dropped silently (every one of the 4,645 today carries it).

Also seen in review, for the record: resvg, like Skia, leaves a pinhole in a dot drawn smaller than
its pen (`16/calculator`, `16/more-horizontal-filled` in the stroked source); the outlined output is
solid. Card 3.1's Chrome check still stands.
