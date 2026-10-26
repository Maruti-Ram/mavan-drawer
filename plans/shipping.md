# Plan: the shipping pipeline (2026-10-26)

Status: **nodded 2026-10-26** (both open recommendations taken: tarballs in the download, a local `v1.0.0` tag); wave 1 in build. Brainstormed 2026-10-26 (seven questions, all answered —
see below); the one unknown, turning a stroke into an outlined fill, proven the same day in
`plans/proof-outline/`; reviewed by a fresh agent the same day (numbers re-measured, owners fixed).

- [ ] 1.1 The outliner
- [ ] 1.2 Metrics made correct
- [x] 1.3 The package's index — built 2026-10-26 (Opus): `node tools/package-meta.mjs` → `dist/meta.json`, 1310 entries = the sheet's 1310 approved rows, 458 families; the sheet's findings are under Results
- [ ] 1.4 The name on npm (Maruti)
- [ ] 2.1 The box: `@mavan/icons`
- [ ] 2.2 The React package: `@mavan/icons-react`
- [ ] 2.3 The licence and the README
- [ ] 2.4 The size rule, picked by eye
- [ ] 3.1 Installed and looked at, as a customer
- [ ] 3.2 Fresh review
- [ ] 3.3 1.0.0 cut: names frozen, tarballs built, decisions recorded
- [ ] Next pass, not this one: Figma components and assets (Maruti, 2026-10-26) · the shop and token
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
- [ ] **1.4 The name on npm.** *Owner:* Maruti. Create the `mavan` npm org (or user) so `@mavan` is
  ours. Claude cannot do this: it needs his account. *Done when:* `npm org ls mavan` answers.

### Wave 2 — the box (depend on 1)

- [ ] **2.1 The box: `@mavan/icons`.** *Owns:* `tools/release.mjs`, `packages/icons/` (generated,
  gitignored but for its `package.json` template). `npm run release` runs check, outlines every
  approved file (1.1), writes `svg/24|20|16/<name>.svg` and `-filled.svg`, `icons.json`,
  `metrics.json` (1.2), `meta.json` (1.3), copies README and LICENSE from 2.3's templates, writes
  `CHANGELOG.md` from the sheet's approval dates, then `npm pack` → `mavan-icons-<version>.tgz`, and
  zips the lot. Refuses to run on a dirty tree, a failing check, or — after 1.0 — a sheet whose names
  differ from `packages/names.lock`. *Done when:* the folder matches the layout above, every file in it
  is an outlined fill (lint's stroke checks find zero strokes), the file count is 2 × 3 × the sheet's
  approved rows, and the zip opens. *Model:* Opus. *Depends on:* 1.1, 1.2, 1.3, 2.3.
- [ ] **2.2 The React package: `@mavan/icons-react`.** *Owns:* `tools/gen-react.mjs`,
  `packages/icons-react/`. One `<Icon name size optical />` and one generated component per icon and
  style (`Check`, `CheckFilled`), so an app bundles only the icons it uses, with no runtime
  dependency. Picks the master by the size rule 2.4 settles; `optical` applies `metrics.json`'s
  bearings as negative margins so `padding` is true to the ink; `currentColor` throughout (the icon
  takes the text colour); TypeScript types for every name. *Done when:* a throwaway app renders every
  icon at 16 · 20 · 24 from the package and the bytes it ships are the outlined fills, not the stroked
  source. *Model:* Opus. *Depends on:* 2.1, 2.4.
- [ ] **2.3 The licence and the README.** *Owns:* `packages/templates/LICENSE.md`,
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

- [ ] **3.1 Installed and looked at, as a customer.** *Owns:* `plans/proof-install/`. A throwaway
  project installs both tarballs from the zip, renders every icon at 16 · 20 · 24 outline and filled
  in the browser pane, and compares each against the lab's rendering of the stroked source pixel for
  pixel in Chrome; also settles the pinhole question (do dots under half a stroke show a hole in Chrome
  at 1× and 2×?). *Done when:* zero pixel differences, or every difference listed with its icon and a
  screenshot. *Model:* Sonnet. *Depends on:* 2.1, 2.2.
- [ ] **3.2 Fresh review.** An agent that did none of the work checks the box against this plan, as a
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
