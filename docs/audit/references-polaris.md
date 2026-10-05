# Reference: Polaris — which concepts a product set this size needs, and what the live page does to the D23 rulings

Audit card **1.17** (`plans/set-and-rules-audit.md:525`). A scope question, not a drawing one. Measured 2026-10-05 against
our pinned tree `5933041` (485 concepts) and the sheet at that commit; the audit tool was run in a scratch copy of HEAD
`4cced8d`. Third-party content: this file holds icon **names**, counts and conclusions only — no drawing, no path data and
no geometry of any Polaris icon was read. Nothing in `src/icons/`, `tools/` outside `tools/audit/`, `lab/`, `research/`,
docs 01–09, `CLAUDE.md` or the plans was touched, and `docs/04` and `docs/06` are exactly as they were. The three new
files are this document, `tools/audit/polaris-scope.mjs` and its test. A fresh reviewer re-measured 64 of its figures
and found them right; this revision applies its seven corrections (C1–C7) and the gaps it found in the tests.

**What this changes for Maruti.** The D23 rulings that have waited on a Polaris re-audit can be made now, and the live
page gives no reason to rule differently from the archive: every one of the eight revisions reads the same on both
(§3). What the live page does change is the ranking behind them: 22 concepts enter the first 500 — four of them bases,
18 of them modifier variants (17 of a concept already in the list, one of the Shopify-only `order`, which the list
leaves out) — 9 leave, and the synonym table does not yet know 46 of the new names, so 21 of them are parked in Tier 3
by the rule's default and two more by a prefix or a category (§2). There is also one wrong file key waiting in the edit
that card 1.16 proposes for `CLAUDE.md`, and the Fluent file it names holds no Polaris page at all (§0.4, §5).

## The short answer

1. **The pointer was half right.** `CLAUDE.md:166` names the right file (`XewrhAKrNGVZtikkpI5am9`) and a dead node
   (`15643:27748`). The live Polaris is a **page** in that file — `15721:27960`, "Polarris icons" — holding **490
   names drawn 499 times** (nine have a filled twin), every drawing 20×20. The list the 2026-10-04 run saved on disk
   still matches the page exactly (§0).
2. **The live page is not the archive the audit used.** 423 names carry over; 40 left and 67 arrived. By the audit's own
   counting rule the archive holds **418 concepts** (118 Shopify-only, 13 logos) and the live page **446** (110
   Shopify-only, no logos) (§1).
3. **For D23, nothing moves.** The four additions — `home`, `checkbox`, `save`, `chevrons-up-down` — are **already
   drawn** at the pin (3, 4, 1 and 4 sheet rows), and live Polaris still draws all four (as `home`, `checkbox`, `save`,
   `select`), each 3/3 before and after. Polaris still draws only the two vertical carets, and neither `caret-left` nor
   `caret-right` is on the sheet. Polaris names the two merged icons `x` and `duplicate`, and the sheet carries `x` and
   `copy`. Polaris draws **none** of the 13 open slots (§3).
4. **Re-running the ranking on the live names fills it.** 508 concepts now pass the evidence rule against a cut of 500,
   so the open slots go from 13 to 0. 22 concepts enter the first 500 (19 on Polaris's vote alone; 18 of the 22 are modifier
   variants — 17 of a concept already in the list, `order-batches` of the Shopify-only `order`, which the list leaves out)
   and 9 leave (8 by the cut alone; `atm` because its only vote is gone). 46 of the 51 concepts that gain a Polaris vote
   have no row in `research/synonyms.mjs`, and 23 of them land in Tier 3: 21 by the rule's default, `bag` by Nucleo UI's
   category and `measurement-volume-list` by a Tier-3 prefix (§2).
5. **Two facts for card 1.9.** Live Polaris names its help icon `question-circle` and its info icon `info`, no ring
   named; and it draws **29 of the 38** queued badge composites (§4).
6. **A wrong key is waiting.** `docs/audit/stale-statements.md:133` proposes pointing `CLAUDE.md` at file
   `rdI0uXVzp89fOZpYcQV6mo`. On the six other lines of the tracked tree that quote it — including `stale-statements.md:37` —
   that key is the **Fluent** file, and that file's page list (six pages, measured 2026-10-05) holds no Polaris page. The
   Polaris page is in `XewrhAKrNGVZtikkpI5am9` (§0.4, §5).

**Words used here.** A **name** is one entry on a page or in the archive, a filled twin folded into its base — the live Polaris
page has 490 names. A **concept** is one icon idea as `research/synonyms.mjs` sees it, whatever each set calls it (Polaris
`person-add` and our `user-plus` are one concept); the audit's rule turns those 490 names into 446 concepts. A **vote** is
one per set — Polaris, Nucleo, Lucide — that draws it; the **score** is the votes with modifier variants crediting their base
("3/3" = all three sets). The **first 500** is the cut at the end of `research/ranked.md`. **Tier** is doc 04's: 1–2 ranked,
3 on demand only, 0 excluded. **Shopify-only** means listed in the table's `PLATFORM`. In every table, `P·N·L` is the three
votes, `v` votes, `s` score, `t` tier, `r` rank, `#n` the sheet's own number for a row.

**Three kinds, kept apart** (card 3.2, `plans/set-and-rules-audit.md:551-554`, which every card inherits through "How a card
is run" step 2, `:51`): **(1)** a drawing or the sheet disagrees with a stated rule or decision · **(2)** a rule or decision
disagrees with another, or with the docs · **(3)** fine by every rule and still wrong, and no rule covers it. They are never
mixed in one line (§6).

---

## 0. Method and sources

| Source | Read how | What it gave |
|---|---|---|
| **The live page** — file `XewrhAKrNGVZtikkpI5am9` ("central+icon+system+v1.35"), page `15721:27960` | the figma-console bridge, one read-only snippet (`polaris-scope.mjs script list`), captured 2026-10-05T05:00:24.999Z | 499 `COMPONENT` nodes, all in one `SECTION` (`15721:27967`); no component sets, instances, frames, groups or text on the page; every component 20×20; the checksum computed inside Figma equals the one recomputed from the saved rows (`efd17834`) |
| **The catalogue on disk** — `research/references/polaris/figma/catalogue.json` (gitignored), the 2026-10-04 `--catalogue` run | read | 490 names (its own word for them is "concepts"), 499 drawings |
| **The pages of the file** | `script pages`, 2026-10-05T05:08:53Z | five: `❖  Icons` · `Microsoft FLuent` · `Untitled UI` · `Polarris icons` (`15721:27960`) · `Cover` |
| **The pages of the Fluent file** — `rdI0uXVzp89fOZpYcQV6mo` ("a.1. Microsoft Fluent system iconography") | one read-only call, `return figma.root.children.map(p => ({id: p.id, name: p.name}))` with that fileKey, run by the main session at 2026-10-05T06:01Z and reported to this card (not run by this card); the tool prints the call (`script fluent-pages`) and reads the saved answer (`bridge --pages-fluent`) | six: Cover `12064:575` · Intro & Changelog `13:2` · a separator `12562:207` (no name) · System icons `1124:9833` · Creation tools `11972:5` · Guidelines `11947:5` — **no Polaris page** (§0.4) |
| **The archive** — `research/sources/polaris.json` (tracked) | read | 463 names, 72 flagged filled → 535 files (`docs/06-audit.md:15`) |
| **The counting rule** — `tools/audit.mjs:50` and `research/synonyms.mjs` | copied into the tool; a test fails if the copy and the original stop being the same text; §2 also checks it against the real tool's own output | `kebab` the name, `resolve('polaris', raw)`, one concept per distinct result |
| **The sheet at the pin** — `git show 5933041:research/queue.md` and `git ls-tree 5933041 src/icons/24/` | read | 834 rows: 485 approved, 349 queued, 0 in review; 485 names drawn in the tree; the approved rows and the tree are the same set |
| **The re-rank** | `git archive HEAD \| tar -x` into a scratch directory, `node tools/audit.mjs` run there twice | §2 |

**The bridge check, and its result.** `bridge` §0.2 compares the live list with the catalogue name by name, in page order,
and on first-node id, item count and canvas: **the catalogue still matches the live page** — the same 490 names in the same
order, the same first-node id for all 490, no difference in item count or canvas, 0 field differences, 499 drawings on
both sides. The live list used throughout is therefore the catalogue's list (the tool accepts either as `--live`). Only
read-only snippets ran; no node was created, changed or selected; `figma_navigate` and `loadAllPagesAsync` were not
called by this card. **One thing was not re-measured:** a lookup of the dead id `15643:27748` (`getNodeByIdAsync`) timed out twice after
10 seconds (05:07 and 05:08Z) and was not tried a third time; the cause was not investigated, and the rule against loading
every page of this file (`tools/audit/refs/figma-extract.md:27`) says why not to push. That the node is gone rests on card
1.16 (`stale-statements.md:132-133`) and the plan (`plans/set-and-rules-audit.md:327-329`); the page list above is
consistent with it — none of the five page ids begins `15643:`.

**§0.4 The Fluent file has no Polaris page.** `docs/audit/stale-statements.md:133` says the live Polaris source is file
`rdI0uXVzp89fOZpYcQV6mo`. That file's own page list — read on 2026-10-05T06:01Z by the main session with the one-liner in the
table above, run against that fileKey — has **six pages: Cover `12064:575`, Intro & Changelog `13:2`, a separator `12562:207`,
System icons `1124:9833`, Creation tools `11972:5`, Guidelines `11947:5`.** No name contains "Polaris" or "Polarris", and the
page `15721:27960` is not among them. `bridge` §0.4 prints the report from the saved answer (the tool cannot repeat the
measurement without Figma open; the one-liner is in the tool so that it can be run again).

**The transfer test** (`plans/set-and-rules-audit.md:374-386`). Polaris answers one question: *which concepts does a product
set this size actually need* — the open scope agenda (docs/06's D23 revisions; `docs/09-rule-audit.md:93`). **Test 1** yes, it
is an open agenda item. **Test 2** for scope only: our unusual constraints are about rendering and drawing, not about which
concepts exist — but Polaris is **one product** (`docs/06-audit.md:168`), and `docs/06-audit.md:168-171` already says its
one-vote concepts are Shopify-flavoured. **Test 3** this card takes a set of names and a way of counting them, never a size, a weight
or a radius. **Test 4** every figure reprints from the tool (§11) — except the Fluent file's page list (§0.4), which the tool
prints from a saved answer that this card did not produce. *Seen and refused:* every Polaris value — its 20×20
canvas, its count of filled twins, its names as our names.

---

## 1. Live against archive — which names came, which went (tool `names`)

### 1.1 How many, by the audit's counting rule

| | archive | live page |
|---|---|---|
| names (outline bases; a filled twin folded into its base) | 463 | 490 |
| names with a filled twin | 72 | 9 |
| drawings (names + twins) | 535 | 499 |
| **concepts** after the rule | **418** | **446** |
| of which Shopify-only | 118 | 110 |
| of which logos | 13 | 0 |
| concepts the ranking can use (tiers 1–3) | 287 | 336 |

The 118 is the figure `docs/06-audit.md:139` and `CLAUDE.md:303` give; the archive's 463 bases and 535 files are
`docs/06-audit.md:15`'s. Several names fold into one concept — the currency families, the histogram family — so 463 names
are 418 concepts and 490 names are 446 (45 and 44 names that another name already reaches). The filled twins changed more
than the names did: the archive drew 72, the live page 9, and **only `star` is a twin on both sides**; eight of the nine
(`alert-octagon`, `bolt`, `check-circle`, `hide`, `keyboard`, `plus-circle`, `profile`, `question-circle`) are twins the
archive did not have, and two of the archive's twinned names are not on the live page at all.

### 1.2 Names

**423 names are the same on both sides; 40 are only in the archive; 67 only on the live page.** Sorted by what the audit's
rule does with them:

| | archive-only (40) | live-only (67) |
|---|---|---|
| **respelled** — the name changed, the rule lands both on one concept; no effect on the ranking | 13 | 13 |
| **folded** — the concept survives under a name both sides share; this was an extra spelling | 4 | 3 |
| **gone** / **new** — the concept has no name on the other side | 23 | 51 |

**Respelled** (13 archive names, 11 concepts):

| concept the rule gives both | archive | live |
|---|---|---|
| `arrow-up-right` | `arrow-diagonal` | `arrow-up-right` |
| `chevron-{down,left,right,up}-circle` | `circle-chevron-{down,left,right,up}` | `chevron-{down,left,right,up}-circle` |
| `arrow-{down,left,right,up}-circle` | `circle-{down,left,right,up}` | `arrow-{down,left,right,up}-circle` |
| `columns` | `layout-column1` · `layout-columns2` · `layout-columns3` | `layout-column-1` · `layout-columns-2` · `layout-columns-3` |
| `rows` | `layout-rows2` | `layout-rows-2` |

**Folded.** Archive side: `check-small` → `check`, `external-small` → `external-link` (live `external`), `icon-name-set` →
`icons`, `x-small` → `x`. Live side — a live name the rule merges into a concept that already had a Polaris name: the live
`alert-octagon` joins `alert-diamond` (one concept, `alert-octagon`), `grid` joins `apps`, `table` joins `data-table`. The
live page now draws both an octagon and a diamond, a grid and an apps icon, a table and a data table; the table has always
said each pair is one concept.

**Gone (23 concepts):** 13 logos (`logo-criteo`, `-facebook`, `-google`, `-instagram`, `-meta`, `-pinterest`, `-snapchat`,
`-tiktok`, `-tumblr`, `-twitch`, `-vimeo`, `-x`, `-youtube`); 8 Shopify-only (`catalog`, `finance`, `globe-eu`, `inbound`,
`make-payment`, `outbound`, `sidekick`, `skeleton`); and two others — `atm` (archive `atm-withdrawal`) and `sparkle`
(archive `magic`).

**New (51 concepts), none of them Shopify-only by the table.** Five are table concepts that Nucleo or Lucide already
drew: `download`, `unlock`, `map`, `rocket`, `git-branch`. The other **46 have no row in `research/synonyms.mjs`**:
`alert-location`, `bag`, `bolt`, `business-entity`, `calendar-compare`, `calendar-list`, `catalog-product`, `chat-new`,
`circle`, `circle-dashed` (the rule files it as `dashed-circle`), `clock-revert`, `discount-add`, `enabled`, `eraser`,
`eye-dropper-list`, `file-list`, `filter-active`, `foreground`, `git-commit`, `git-repository`, `globe-europe`,
`globe-lines`, `globe-list`, `hashtag-list`, `image-none`, `in-progress`, `incomplete`, `inheritance`, `link-list`,
`measurement-size-list`, `measurement-volume-list`, `measurement-weight-list`, `order-batches`, `page-list`,
`page-report`, `paste`, `person-list`, `pin-remove`, `plus-circle-down`, `plus-circle-up`, `receivables`, `search-add`,
`star-list`, `table-masonry`, `three-d-environment`, `work-list`.

**Leads on renames the table does not know** (names only; shares a whole word; not facts): `catalog` → `catalog-product`;
`globe-eu` → `globe-europe` (the live page also has `globe-lines` and `globe-list`). Two of the 23 gone concepts have a
lead at all; the other 21 have none.

---

## 2. The re-rank (tool `rerank`)

### 2.1 The scratch copy reproduces `research/`

HEAD was copied with `git archive HEAD | tar -x` into a scratch directory and `node tools/audit.mjs` run there with the
archive. The three files it writes — `research/ranked.md`, `research/audit.csv`, `research/audit.json` — are
**byte-identical** to the working tree's and to HEAD's. The audit's inputs (`tools/audit.mjs`, `research/synonyms.mjs`,
`research/sources/`) are identical at the pin and at HEAD. Then `research/sources/polaris.json` in the copy was replaced by
490 records of the same shape (`name`, `filled`, `keywords` empty) built from the live names, and the tool run again. The
tool's matcher and the real tool's own P flags agree on all 418 archive concepts and all 446 live ones. And on the archive
run the tool reproduces **eight of `docs/06`'s counts to the unit** — 487 evidence-backed concepts (126 · 226 · 135), 13 open
slots, Arrows + UI 114 of 487, Tier 2 161, 145 variants, 29 held back, 118 Shopify-only, D23 114 of 120 in
(`docs/06-audit.md:40-49, 97, 117, 132, 139`).

### 2.2 The first 500

| | archive (as shipped) | live names |
|---|---|---|
| evidence-backed tier 1–2 concepts, no cut | 487 | **508** |
| inside the cut of 500 | 487 | 500 |
| open slots | 13 | **0** |
| inside the cut, scoring 3/3 · 2/3 · 1/3 | 126 · 226 · 135 | 129 · 228 · 143 |
| Arrows + UI & Layout | 114 of 487 (23.4%) | 119 of 500 (23.8%) |
| Tier 2 · modifier variants | 161 of 487 · 145 of 487 | 163 of 500 · 155 of 500 |
| held back (Tier 3 with two or more sets) | 29 | 30 (`git-commit` joins) |
| excluded | 131 = 118 + 13 logos | 110 |

In `ranked.md` itself, line by line: **511 lines removed, 524 added**, and 451 of the removed lines come back with only
their rank number changed. 16 of its 17 sections that carry a count change size (`Editing & Text`, 28, is the one that
does not); the category sections move by at most 6 (UI & Layout 58 → 64), then Time & Calendar and Maps & Location,
10 → 13 each. The pool of open-slot candidates at its foot goes 62 → 60: `dashed-circle` and `eraser` leave it because
Polaris is now a second vote.

### 2.3 Who changes tier or vote count

**No concept present in both runs changes tier or category (0).** Votes change for 74 concepts, and only because Polaris
is gained or lost: **23 lose a Polaris vote and 51 gain one** (net +28); no concept that stays Polaris-drawn changes votes,
score or evidence.

| | by tier |
|---|---|
| lose Polaris (23) | tier 0 ×21 · tier 1 ×1 (`sparkle`) · tier 2 ×1 (`atm`) |
| gain Polaris (51) | tier 1 ×17 · tier 2 ×11 · tier 3 ×23 |

- **`sparkle` (drawn, #99) slips from 3/3 to 2/3**, rank 88 → 290, still inside; **`atm` (queued, #277) is left with no vote**.
  The other 21 losers are the 13 logos and 8 Shopify-only concepts, all tier 0 and never ranked.
- **Six queued rows rise** because a third or second vote arrives from Polaris: `download` (#191) rank 250 → 21, `unlock`
  (#199) 258 → 62, `map` (#210) 269 → 73, `rocket` (#244) 303 → 99, `circle` (#333) 436 → 162, `git-branch` (#338) 441 → 163.
  Three more concepts that are not on the sheet gain a second vote and come inside the 500: `dashed-circle` (rank 491, out
  → 166), `eraser` (526, out → 180), `bolt` (732, out → 204).
- **42 of the 51 gain a first vote** — no other set draws them. By tier the 51 split 17 · 11 · **23** (tiers 1 · 2 · 3).
- No drawn row gains; the only drawn row that loses is `sparkle`.

### 2.4 In and out of the first 500

**22 enter and 9 leave** (net 13).

- **Enter (22):** 3 gain Polaris as a second vote — `dashed-circle`, `eraser`, `bolt`. 19 have Polaris as their **only**
  vote: `catalog-product` and 18 modifier variants — `star-list`, `calendar-compare`, `calendar-list`, `clock-revert`,
  `eye-dropper-list`, `file-list`, `filter-active`, `image-none`, `link-list`, `pin-remove`, `plus-circle-down`,
  `plus-circle-up`, `search-add`, `table-masonry`, `globe-europe`, `globe-lines`, `globe-list`, `order-batches`. Four of
  the 22 are not variants (the three above and `catalog-product`). **None of the 22 is on the sheet.**
- **What the 18 variants sit on.** 17 sit on a base that is itself inside the first 500. **`order-batches` does not: its
  base is `order`, which is Shopify-only (tier 0) and left out of the ranking** — the audit makes a name a variant of the
  longest shorter concept that has any votes, ranked or not (`tools/audit.mjs:130-144`). **`catalog-product` comes in by
  the same door:** its name starts with the Shopify-only `catalog`, but `PLATFORM` matches whole names, so a name that
  merely starts with a listed one is not excluded. Counted over the whole ranking, such names are **0 in the archive run
  and 3 in the live run**: `catalog-product`, `order-batches`, and `measurement-volume-list`, which lands in Tier 3 and
  stays outside the 500. What this means for the Shopify filter is §6 item 7.
- **Leave (9):** `atm` (no vote left, queued #277) and eight that are cut by rank alone, still evidence-backed:
  `video-off` (live rank 501), `camera-off` (502), `cloud-off` (503), `volume-off` (504), `wifi-off` (505), `phone-forwarded`
  (506), `phone-missed` (507), `refresh-ccw` (508). They are **sheet rows #480 to #487**, the last eight of section D (the
  audit ranking, #46 to #487; section E, added on request, starts at #488); `volume-off` is drawn, the other seven queued.

### 2.5 The D23 column

D23's 122 names resolve to 120 concepts; **114 sit inside the first 500 in both runs**, the same six outside (`history`,
`badge`, `list-filter`, `file-chart`, `caret-left`, `caret-right`), and no category's D23 count changes. Polaris draws 88
of D23's 120 concepts in the archive and 89 on the live page. **Three D23 concepts change their votes:** `sparkle` 3/3 →
2/3; `download` and `unlock` 2/3 → 3/3. The rank number of 105 of the 120 moves, because 22 concepts enter above them —
which is not a change in their evidence. The D23 concepts in the 500 on one vote or less are the five doc 06 names, before
and after: `caret-up`, `caret-down` (Polaris), `stopwatch` (Nucleo), `trending-up`, `trending-down` (Lucide, kept by
Feather).

### 2.6 What the table does not know

The re-rank uses `research/synonyms.mjs` as it is. **46 of the 51 new live concepts are not in it.** `tools/audit.mjs` places
a concept it does not know in this order (`inferCategory`, `:92-105`): the table concept its name starts with; Lucide's
category tags when it has some and none maps (Tier 3); Nucleo UI's category; Lucide's tags by majority; and, with nothing to
go on, Tier 3. The 46 split **20 by the start of the name · 3 by Nucleo UI's category (`dashed-circle`, `eraser`, `bag`) · 2
by Lucide's tags (`circle`, `bolt`) · 21 by nothing, the default**. Result: 23 of the 46 are placed in Tier 1 or 2, and **23
land in Tier 3 — 21 by the rule's default alone, `bag` by a Nucleo UI category the rule does not map, and
`measurement-volume-list` by the start of its name, because `measurement-volume` is a table concept that is itself Tier 3.**
The 21 held back by the default, not by a decision: `git-commit`, `alert-location`, `business-entity`, `chat-new`,
`discount-add`, `enabled`, `foreground`, `git-repository`, `hashtag-list`, `in-progress`, `incomplete`, `inheritance`,
`measurement-size-list`, `measurement-weight-list`, `page-list`, `page-report`, `paste`, `person-list`, `receivables`,
`three-d-environment`, `work-list`. So those 21 arrivals are the rule's default standing in for a decision the table has not
been asked to make, and the category the other 25 placed names were given is inferred from a name or a tag. The 22
entrants are not the default: they are the evidence rule working as written (one curated set suffices) on names it had not
seen — though the category of each is inferred from the start of its name or a tag.

One spelling collision, found by asking which live names another set already files under a different concept: **`bolt`**
is a concept of its own here (Polaris and Lucide both spell it `bolt`) and `zap` there (the table maps Nucleo's `bolt` to
`zap`). Lucide's `bolt` carries the tags *nut, screw, settings* (`research/sources/lucide.json`), Nucleo's *lightning,
power* (`research/sources/nucleo.json`); the two votes `bolt` collects agree on a spelling, not necessarily on a drawing.
Which one Polaris drew is `[needs measuring]` — names only here. It is the only such collision among the 51.

---

## 3. The D23 revisions, as facts (tool `d23`)

### 3.1 The sheet at the pin

834 rows: 485 approved, 349 queued, 0 in review. 485 names are drawn in the tree and they are the same set as the approved
rows. "Drawn" below means in the tree at `5933041`; the sheet has moved since (card 1.16 records `thumbs-down` in review at
HEAD, `stale-statements.md:144`).

### 3.2 The eight revisions

Before = as shipped in `research/ranked.md`; after = the scratch re-rank on the live names.

| revision | archive Polaris draws it as | live Polaris draws it as | before | after | sheet at the pin |
|---|---|---|---|---|---|
| add `home` | `home` | `home` | 1·1·1 v3 s3 t1 r32 | 1·1·1 v3 s3 t1 r33 | **drawn** #40, 2026-09-20 — 3 rows, 3 shipped |
| add `checkbox` | `checkbox` | `checkbox` | 1·1·1 v3 s3 t1 r12 | 1·1·1 v3 s3 t1 r12 | **drawn** #51, 2026-09-23 — 4 rows, 4 shipped |
| add `save` | `save` | `save` | 1·1·1 v3 s3 t1 r51 | 1·1·1 v3 s3 t1 r52 | **drawn** #70, 2026-09-23 — 1 row, 1 shipped |
| add `chevrons-up-down` | `select` | `select` | 1·1·1 v3 s3 t1 r76 | 1·1·1 v3 s3 t1 r79 | **drawn** #87, 2026-09-26 — 4 rows, 4 shipped |
| cut `caret-left` | — | — | 0·0·0 v0 s0 t1 r1472 out | 0·0·0 v0 s0 t1 r1490 out | absent |
| cut `caret-right` | — | — | 0·0·0 v0 s0 t1 r1473 out | 0·0·0 v0 s0 t1 r1491 out | absent |
| merge `close` = `x` | `x`, `x-small` | `x` | 1·1·1 v3 s3 t1 r64 | 1·1·1 v3 s3 t1 r66 | **drawn** #3, 2026-09-17 — 4 rows, 3 shipped (`x-square` is queued) |
| merge `copy` = `duplicate` | `duplicate` | `duplicate` | 1·0·1 v2 s2 t1 r132 | 1·0·1 v2 s2 t1 r135 | **drawn** #124, 2026-09-29 — 3 rows, 3 shipped |

Plainly, which revisions the sheet has **already overtaken**: the four additions, all drawn (their numbers are the
rows' own: 40 · 51 · 70 · 87); the two cuts, because neither caret is on the sheet; and both merges, because the sheet
carries `x` and `copy` and has no row called `close` or `duplicate`. Nothing is waiting to be drawn or removed for any of
the eight. The merges name by name: D23 spells them `close:x`, `x`, `copy`, `duplicate:copy`; no live Polaris name is
`close` or `copy`; `x` and `duplicate` are live names. The carets: live Polaris draws `caret-down` and `caret-up` only,
and the sheet has both queued (#263, #264); `caret-left` and `caret-right` have no row.

### 3.3 The 13 open slots

`docs/06-audit.md:126-128` — "chosen by judgement, not by the data".

| slot | in D23 as | Polaris, archive · live | votes P·N·L before → after | sheet at the pin |
|---|---|---|---|---|
| `history` | `history` | — · — | 0·0·1 r499 out → r519 out | absent |
| `badge` | `badge` | — · — | 0·0·1 r583 out → r602 out | absent |
| `list-filter` | `filter-data` | — · — | 0·0·1 r637 out → r656 out | absent |
| `file-chart` | `report` | — · — | 0·0·1 r1109 out → r1125 out | absent |
| `webhook` | | — · — | 0·0·1 r547 out → r566 out | absent |
| `signature` | | — · — | 0·0·1 r506 out → r526 out | absent |
| `list-todo` | | — · — | 0·0·1 r501 out → r521 out | absent |
| `chart-area` | | — · — | 0·0·1 r488 out → r509 out | absent |
| `folders` | | — · — | 0·0·1 r497 out → r517 out | absent |
| `trophy` | | — · — | 0·0·1 r510 out → r530 out | absent |
| `route` | | — · — | 0·0·1 r541 out → r560 out | absent |
| `focus` | | — · — | 0·0·1 r496 out → r516 out | absent |
| `router` | | — · — | 0·0·1 r542 out → r561 out | absent |

**Polaris draws none of the 13, in the archive or on the live page** (0 of 13); none is evidence-backed in the live run
and none is on the sheet. Under live names there is no slot to fill: 508 concepts already pass the rule, and a cut that
held every one of them plus the 13 picks would be **521** (archive: 487 + 13 = 500). Ten of the 13 sit in `ranked.md`'s
candidate pool before and after (the three outside it are `badge`, `list-filter` and `file-chart`, all D23 concepts). Live
names that share a whole word with a slot are leads only: `filter` and `filter-active` for `list-filter`; the `chart-*`
family for `file-chart` and `chart-area`; the other nine slots have none.

### 3.4 What else `docs/06` says about Polaris, against the live names

| claim | where | against the live names |
|---|---|---|
| "Polaris has only vertical carets" | `docs/06-audit.md:61` | **holds** — `caret-down`, `caret-up` |
| `caret-up`, `caret-down` are single-vote (Polaris) | `:67-68` | **holds** — 1·0·0 both |
| "Polaris calls it `Duplicate`" | `:54` | **holds** — live `duplicate`, no `copy` |
| "Polaris draws only the maximise/minimise pair" | `:73-74` | **holds** — `maximize`, `minimize`; `arrows-in-horizontal` and `arrows-out-horizontal` are also drawn |
| "Polaris has `shield-check` and `shield-person` but no bare `shield`" | `:30-31` | **holds** — `shield-check-mark`, `shield-none`, `shield-pending`, `shield-person` |
| "Polaris and Nucleo use a plain clock for history" | `:62` | **changed** — live `clock`, and `clock-revert`, which is new (archive: `clock` only). What it draws is not read here |
| "Its 1-vote concepts (`viewport-*`, `sandbox`, `channels`, `live`)" | `:168-169` | **holds** — all seven names are on the live page |

`docs/06-audit.md:81-87` says 39 concepts score 3/3 and are not in D23: live Polaris draws **39 of 39** (archive 39); at the
pin 31 of them are drawn and 8 queued (`clipboard-check`, `file-plus`, `file-minus`, `shield-check`, `arrow-up-circle`,
`-down-`, `-left-`, `-right-`). `:92-95` says Polaris backs 15 more at 2/3: live Polaris draws **15 of 15** (archive 15); 2
are drawn (`moon`, `sun`) and 13 queued. Both lists hold, name for name, under the live names.

---

## 4. Two facts from card 1.9 (tool `grammar`)

### 4.1 P5 — how Polaris names its help and info icons

| our name | Polaris, archive · live | Nucleo | Lucide |
|---|---|---|---|
| `help` | `question-circle` · `question-circle` (+ filled twin) | `alert-question`, `circle-question` | `circle-question-mark` |
| `info` | `info` · `info` | `alert-info`, `circle-info` | `info` |
| `alert-circle` | `alert-circle` · `alert-circle` | `circle-warning` | `circle-alert` |
| `check-circle` | `check-circle` (+ `status-active`) · same, + filled twin | `circle-check` | `circle-check-big`, `circle-check` |
| `x-circle` | `x-circle` · `x-circle` | `circle-xmark` | `circle-x` |
| `plus-circle` | `plus-circle` · `plus-circle` (+ filled twin) | `circle-plus` | `circle-plus` |
| `minus-circle` | `minus-circle` · `minus-circle` | `circle-minus` | `circle-minus` |
| `help-square` · `info-square` · `alert-square` | — · — | `square-question` · `square-info` · `square-warning` | — |

Live Polaris **names the ring in all six** of the ring-and-glyph icons it draws for alert, check, minus, plus, help and x —
and calls the help icon **`question-circle`**, not `help-circle`. `info` is bare. The audit's table lists six spellings of
`help` (`help`, `question-circle`, `help-circle`, `question-mark-circle`, `alert-question`, `circle-help`); **none of the
three sets spells it `help-circle`** — Polaris `question-circle`, Nucleo `circle-question`, Lucide `circle-question-mark`.
For `info` the three differ: Polaris and Lucide bare, Nucleo `circle-info`. Polaris names the ring in 19 live names — the
six above, the eight `arrow-`/`chevron-` rings, `pause-`, `play-` and `stop-circle`, and `plus-circle-up`/`-down` — and not
for `info`. Live Polaris draws none of the three queued neighbours P5 names: `help-square` (#455), `info-square` (#456) and
`alert-square` (#284) are all queued, with no Polaris counterpart. Its other `alert-*` names are `alert-bubble`,
`alert-diamond`, `alert-location`, `alert-octagon` (with a filled twin) and `alert-triangle`.

### 4.2 The at-least-38 queued badge composites

`findings-grammar.md:273` lists 38 queued corner-badge names; all 38 are queued at the pin (none drawn). **Live Polaris draws
29 of them** — the same 29 the archive drew — and does not draw 9.

- **Same name (4):** `calendar-check`, `clipboard-check`, `folder-down`, `folder-up`.
- **Under a name the audit's table equates with ours (25):** `calendar-clock` ← `calendar-time`, `cart-minus` ← `cart-down`,
  `cart-plus` ← `cart-up`, `code-plus` ← `code-add`, `credit-card-lock` ← `credit-card-secure`, `credit-card-x` ←
  `credit-card-cancel`, `database-plus` ← `database-add`, `eye-check` ← `eye-check-mark`, `file-clock` ← `page-clock`,
  `file-down` ← `page-down`, `file-heart` ← `page-heart`, `file-minus` ← `page-remove`, `file-plus` ← `page-add`,
  `file-up` ← `page-up`, `folder-minus` ← `folder-remove`, `folder-plus` ← `folder-add`, `image-plus` ← `image-add`,
  `mail-follow-up` ← `email-follow-up`, `message-alert` ← `alert-bubble`, `note-plus` ← `note-add`, `package-check` ←
  `package-fulfilled`, `shield-check` ← `shield-check-mark`, `user-lock` ← `person-lock`, `user-minus` ← `person-remove`,
  `user-plus` ← `person-add`. Two of these equations are the table's judgement rather than a spelling (`alert-bubble` as
  `message-alert`, `package-fulfilled` as `package-check`) and doc 06 names "a wrong merge" as the risk
  (`docs/06-audit.md:162-163`).
- **Not drawn by Polaris (9):** `bell-plus`, `desktop-download`, `face-smile-plus`, `file-check`, `grid-circle-plus`,
  `message-user`, `user-check`, `user-search`, `user-x`.

### 4.3 How many live Polaris names are composites of that kind

By the rule the tool states (a name ending in one of 22 modifier words and not a direction word's own `-up`/`-down`; the 22 are
the 38's own modifiers plus the spellings Polaris and the table use for the same ones) — **38 live names, of 490**.
They are `-add` ×10, `-remove` ×5, `-up` ×4, `-down` ×4, `-check` ×3, `-new` ×2, `-check-mark` ×2, and one each of `-time`,
`-cancel`, `-secure`, `-follow-up`, `-clock`, `-heart`, `-lock`, `-person`. **Only 15 are found by the 38's own words alone;
23 more are found only through Polaris's spellings** (`add`, `remove`, `new`, `check-mark`, `cancel`, `secure`, `time`,
`person`) — the count depends on the word list, and the tool prints every last word so it can be re-cut. Of the 29 live
names that match one of our 38, 27 are in the census; `alert-bubble` and `package-fulfilled` are not (their tail is not a
badge word). Eleven census names match none of our 38: `chat-new`, `discount-add`, `domain-new`, `paper-check`,
`pin-remove`, `plus-circle-down`, `plus-circle-up`, `product-add`, `product-remove`, `search-add`, `shield-person`; four of
them are Shopify-only by the table (`domain-new`, `paper-check`, `product-add`, `product-remove`). Names only: a name that
says "add" may or may not draw a corner badge. **"38 live names" and "38 queued names" are two different populations that
happen to be the same size.**

---

## 5. The stale pointer (tool `pointer`)

`CLAUDE.md:162-168`, the Audit paragraph, clause by clause against what this card measured:

| it says | today |
|---|---|
| "the user has **not** yet ruled on the D23 revisions … 13 open slots" | still true; §3 gives the eight revisions and the 13 as facts and none depends on which Polaris |
| "The audit used the Polaris *archive*" | true — 463 names (`research/sources/polaris.json`) |
| "the user's Figma Polaris frame (file `XewrhAKrNGVZtikkpI5am9`, node `15643:27748`)" | the **file** is right; the node is dead (card 1.16; §0); the Polaris is a **page** — `15721:27960` "Polarris icons" — in the same file |
| "is newer (~490 icons)" | 490 is the live page's count of **names**; its drawings are 499 (the audit's rule turns the 490 names into 446 concepts) |
| "and should be re-audited" | done here, in a scratch copy; nothing is edited |
| "To change the ranking edit `research/synonyms.mjs` and `npm run audit`" | still the way — and §2.6 is why the table needs rows before a live re-rank means anything |
| "To refresh Polaris use the **git trees API**" | that is how the *archive* is refreshed; the live source is read through the bridge (`tools/audit/refs/figma-extract.md`, and `script list` / `capture` in the tool) |

**The wrong key.** `docs/audit/stale-statements.md:133` — the "Correct" cell of §1.9 — reads: *the live source is file
**`rdI0uXVzp89fOZpYcQV6mo`**, page "Polarris icons" … a copy sits in `XewrhAKrNGVZtikkpI5am9`.* That key is the Fluent file —
"a.1. Microsoft Fluent system iconography". Every tracked line at HEAD that quotes it (`git grep` over the whole tree, this
card's three files left out) is **7 lines in 4 files**: Fluent's file on **6** — `docs/08-refinement.md:400`,
`references-fluent.md:37, :416, :476`, **`stale-statements.md:37`** (which calls it "Fluent's source table (file
`rdI0uXVzp89fOZpYcQV6mo`, page Guidelines…") and `plans/set-and-rules-audit.md:111` — and the Polaris source on **1**, line 133
itself. The Fluent file's own page list (§0.4) closes the question: it has
**six pages — Cover, Intro & Changelog, a separator, System icons, Creation tools, Guidelines — and no Polaris page**, so
the sentence is wrong about the file, not only about the key; there is no Polaris page in the Fluent file and no "copy"
in either direction. This card read the Polaris page in `XewrhAKrNGVZtikkpI5am9` (the capture's own file name, and the
catalogue's header); it is the page itself. If §1.9's edit were applied as written, `CLAUDE.md` would send a reader to
the Fluent library. The sentence to fix first is in `stale-statements.md`.

**What the live source changes in `CLAUDE.md`'s facts.** `CLAUDE.md:303` ("Polaris (archive): 463 outline bases + 72 filled =
535 SVGs … 118 concepts are Shopify-only") is a true statement about the archive and says so; the live page's figures are
490 names, 499 drawings, all 20×20, 110 Shopify-only concepts by the same table. `README.md:130` and `docs/04-scope.md:11` say
**499** and name no source: 499 is the live page's drawing count today, and not the archive's (535).

---

## 6. Judged list — what stuck out

Kinds, kept apart: **(1)** a drawing or the sheet disagrees with a stated rule or decision · **(2)** a rule or decision
disagrees with another, or with the docs · **(3)** fine by every rule and still wrong, and no rule covers it.

### Kind 1 — the sheet against a stated rule

1. **`atm` is queued (#277) on a vote that has gone.** Its only vote was Polaris's — the archive's `AtmWithdrawal`
   (P·N·L 1·0·0); live Polaris has no ATM. `docs/06-audit.md:32-34`'s rule — two sets agree, or one curated set chose it
   alone — is no longer met. 1 queued row. `sparkle` (drawn, #99) falls to 2/3 and still passes.

### Kind 2 — documents against each other

2. **`stale-statements.md` §1.9 names the Fluent file as the Polaris source** (line 133), against its own line 37, the plan
   and the Fluent reference, and against the Fluent file's own page list, which holds no Polaris page — §0.4, §5. 1 proposed
   edit, blocking, one line to fix.
3. **Polaris's size is stated four ways and each is true of a different source.** README and `docs/04`: 499 (the live
   page's drawings). `CLAUDE.md:303`, `docs/06:15`: 463 bases, 535 files (the archive). `CLAUDE.md:166`: ~490 (the live
   page's names). `docs/06-audit.md:142-143` says the "499 in CLAUDE.md does not match the archive" — `CLAUDE.md` no longer
   says 499, and the number belongs to the other source. Six passages in four files.
4. **`docs/06`'s `history` verdict leans on a premise the live page overtakes** — "Polaris and Nucleo use a plain clock for
   history" (`:62`) — now that live Polaris also draws `clock-revert`. Name only; what it draws is not read.

### Kind 3 — fine by every rule, no rule covers it

5. **Nothing says how a new source's names enter the synonym table.** 46 live concepts have no row (22 of them the
   entrants); 23 land in Tier 3, 21 of them purely by default — among them names that by their words alone look like variants
   of table concepts (`person-list`, `page-list`, `page-report`, `chat-new`, `paste`). `docs/06-audit.md:162-165` records the table
   as a judgement call and no document says who keeps it current. Touches 46 concepts.
6. **A cut at 500 with no rule for too much evidence.** 508 pass; the last 8 fall by rank alone — seven queued rows and one
   drawn (`volume-off`) — and `docs/06` only has a rule for a shortfall (open slots). Touches 8 rows.
7. **One product's vocabulary passes as evidence, and the Shopify filter is a hand list of whole names.** 19 of the 22
   entrants are Polaris-only. `PLATFORM` in `research/synonyms.mjs` matches whole names, so a name that only *starts with* a
   listed Shopify-only name is not excluded: **live 3, archive 0** — `catalog-product` (on `catalog`) and `order-batches` (on
   `order`) both enter the first 500 on Polaris's single vote, and `measurement-volume-list` (on `measurement-volume`) lands in
   Tier 3 (§2.4). Three more of the 23 Tier-3 arrivals read as Shopify commerce by their words alone — `discount-add`,
   `receivables`, `business-entity` — and are not listed either (a reading of names, not a measurement).
   (`docs/06-audit.md:168-171` already warns about 1-vote Polaris concepts; nothing acts on it.)
8. **A second vote can be a spelling coincidence.** `bolt` (§2.6) is the one measured case; a vote that is not a drawing
   would pass every rule.

**What held.** The scratch copy reproduces `research/` byte for byte and `docs/06`'s counts to the unit (§2.1). The
audit's rule is reproducible from outside the tool, name by name. The catalogue on disk equals the live page (§0). All
eight D23 revisions read the same on the live page as on the archive (§3.2).

---

## 7. What only Maruti can settle

| question | what to look at |
|---|---|
| Is one product's vocabulary scope? 19 of the 22 entrants are Polaris-only and 18 of them are variants (`star-list`, `calendar-list`, `file-list` …): do they get rows, and does doc 04's test — someone can name the screen — apply to them? | the 22 in §2.4; nothing to draw until named |
| Does `clock-revert` change `history`'s keep-by-judgement verdict (`docs/06-audit.md:62`)? | the drawing: page `15721:27960`, node `15721:28307`, beside our `clock` and a history sketch |
| Is Polaris's `bolt` a lightning bolt (our `zap`) or Lucide's nut? One vote hangs on it | node `15721:28074` and its twin `15721:28076` |
| Is `page-report` the D23 `report` (= `file-chart`, "weak, Lucide only") that doc 06 could not back? Names suggest it; nothing else does | node `15721:29133` |
| Do `caret-up` and `caret-down` (queued #264, #263; Polaris is their only vote) earn their rows if their only evidence is one product's? | nodes `15721:28134`, `15721:28132` |
| Is 500 a size or a ceiling? 508 are evidence-backed now | a decision, not a drawing |
| `help-circle` or `question-circle`? Both are ours to choose; no reference spells it `help-circle` | §4.1 |

---

## 8. Proposals for Maruti to rule on

**These are proposals, not decisions. Each carries a recommendation and the evidence; nothing in the set, the rules, lint,
the sheet or the docs changes until Maruti rules.** They go to the wave-5 decision agenda (card 5.2).

**PL-1 — The four additions are already drawn; recommend accepting them.** `home`, `checkbox`, `save`, `chevrons-up-down` are
drawn (#40, #51, #70, #87; 3, 4, 1, 4 rows) and live Polaris still draws all four, 3/3 before and after. *Recommendation:*
accept doc 06's additions; the only edit is to doc 04, which says D23 lacks them. Changes no drawing. *Evidence:* §3.2.

**PL-2 — The two carets.** Cut `caret-left` and `caret-right`: live Polaris still draws only the vertical pair, neither is
on the sheet, no set draws either, before or after. *Recommendation:* cut, as doc 06 proposes. Separately, `caret-up` and
`caret-down` stay queued (#264, #263) with Polaris as their only vote, still; recommend: leave them queued and draw them
last — the order is Maruti's call — and drop them if Maruti rules that one-product evidence needs a named screen (the
question in §7). *Evidence:* §3.2, §3.4.

**PL-3 — The two merges; recommend accepting both.** `close` = `x` and `copy` = `duplicate`: live Polaris names them `x` and
`duplicate`, one name each, and the sheet already carries `x` (#3) and `copy` (#124) with no row called `close` or `duplicate`.
*Recommendation:* accept; whether the Library finds `close` and `duplicate` by search is an engineering matter, not a
ruling. *Evidence:* §3.2.

**PL-4 — The 13 open slots: take none from the live Polaris.** It draws none of them; the 13 vanish under live names only
because 22 concepts enter (§2.4): 19 on Polaris's single vote, 18 of them modifier variants, and two (`catalog-product`,
`order-batches`) carried in by a Shopify-only name the list does not exclude (§6 item 7). *Recommendation:* keep doc 06's
list as a **reserve** and fill none of them from the re-rank; if Maruti wants data behind two of the slots, **`dashed-circle`
and `eraser`** are the only concepts from `ranked.md`'s old candidate pool that live Polaris backs (each Polaris + Lucide,
neither on the sheet). Holding every evidence-backed concept and the 13 picks would need a cut of 521 (§3.3), not 500.
*Evidence:* §2.4, §3.3.

**PL-5 — Rule D23 on either source; refresh the ranking later, as its own small build.** The eight revisions read the same
on both. The live re-rank is a lower bound until the table knows the 46 names (§2.6). *Recommendation:* make the D23 rulings
now; **do not regenerate `ranked.md` from the live names yet**; if Maruti wants the ranking refreshed, give the table rows
for the 46 first, re-run, and show Maruti the three changes that matter — the six queued rows that rise (#191, #199, #210,
#244, #333, #338), `atm`, and the cut. *Evidence:* §2.

**PL-6 — `atm` (queued #277).** Its only vote is gone. *Recommendation:* **drop it** from the sheet (`queue.mjs drop`) unless a
screen needs it — it no longer meets the evidence rule in `docs/06-audit.md:32-34`, and nothing else in the audit depends on it.
*Evidence:* §2.3, §6 item 1.

**PL-7 — Order the badge icons by evidence when their zone is settled.** Of the 38 queued badge composites live Polaris
draws 29, the same as the archive (§4.2). *Recommendation:* when card 1.9's P1 is ruled, draw the 29 first and treat the 9
Polaris does not draw (`bell-plus`, `desktop-download`, `face-smile-plus`, `file-check`, `grid-circle-plus`, `message-user`,
`user-check`, `user-search`, `user-x`) as later. A change of order only; no rule changes. *Evidence:* §4.2.

**PL-8 — `help` and `info`.** Polaris says `question-circle` and bare `info`; no set says `help-circle`; Polaris names the ring
for the other five (§4.1). *Recommendation:* rule P5 on our own convention — ring named, one name per concept, and the
sheet already queues `help-square` — and, since no reference backs `help-circle`, make it as our choice rather than as the
market's; if Maruti prefers a name with a source behind it, `question-circle` is the spelling all three sets share a word
with (`question`). `info-circle` has no support from Polaris (bare `info`) or Lucide (bare `info`); only Nucleo rings it.
*Evidence:* §4.1.

**PL-9 — Fix the key before the pointer.** *Recommendation:* when `stale-statements.md` §1.9's edit is applied, use file
`XewrhAKrNGVZtikkpI5am9`, page `15721:27960` "Polarris icons" (a page; 490 names, 499 drawings), and correct the
"Correct" cell of §1.9 first — it names the Fluent file, which has six pages and none of them Polaris (§0.4). Leave
`README.md:130` and `docs/04-scope.md:11` alone: their 499 is the live page's drawing count; a source note is all they
lack. *Evidence:* §0.4, §5.

---

## 9. For wave 5 to reconcile — never pick

| quantity | this card | elsewhere |
|---|---|---|
| Polaris's size | live page: **490 names, 499 drawings** (446 concepts by the rule); archive: **463 names, 535 files** (418 concepts) (§1.1) | `README.md:130`, `docs/04-scope.md:11`: "499", no source; `CLAUDE.md:303`, `docs/06-audit.md:15`: 463 + 72 = 535 (archive); `CLAUDE.md:166`: "~490"; `docs/06-audit.md:142-143`: "the 499 in CLAUDE.md does not match the archive" |
| "118 Shopify-only" | archive: 118 concepts in `PLATFORM` that Polaris draws, **plus 13 logos = 131** tier-0 concepts; live: 110 + 0 | `CLAUDE.md:303`, `docs/06-audit.md:139`: 118 (concepts, `PLATFORM` only); `research/ranked.md` "Excluded (131)" counts both |
| the live source's file key | `XewrhAKrNGVZtikkpI5am9`, page `15721:27960` (a page in that file); the Fluent file `rdI0uXVzp89fOZpYcQV6mo` has six pages and none is Polaris (§0.4) | `stale-statements.md:133`: `rdI0uXVzp89fOZpYcQV6mo` "with a copy in `XewrhAKrNGVZtikkpI5am9`"; `stale-statements.md:37`, `plans/set-and-rules-audit.md:111`, `references-fluent.md:37, :416, :476`, `docs/08-refinement.md:400`: that key is Fluent's (6 lines in 4 files) |
| evidence-backed concepts and open slots | archive 487 and 13 (reproduces `docs/06:40-47`); live names **508, cut at 500, 0 slots** | `docs/06-audit.md:40-44, 123`; `CLAUDE.md:162-165` ("13 open slots") |
| D23's size | 122 names → 120 concepts, 114 in the first 500 on both sources | `docs/06-audit.md:49`; `docs/04-scope.md:52` ("Total: 122 bases") |
| the sheet's rows | at the pin: 834 = 485 approved + **349 queued** + 0 in review | `stale-statements.md:144` (HEAD): 485 done, **348 todo, 1 in review** (`thumbs-down` has since gone into review) |
| queued badge composites | **38 queued names** (`findings-grammar.md:273`), 29 drawn by Polaris; separately **38 live names** carry a badge word (§4.3) | `findings-grammar.md:288-289`: "at least 38 planned icons"; two populations, same size |
| "~490 icons" | live names 490; live drawings 499 | `CLAUDE.md:166` |

---

## 10. Handover — what this card measured but does not own

| finding | belongs to |
|---|---|
| PL-1…PL-9 as decisions | **5.2** decision agenda; PL-1…PL-3 fold into the D23-revisions ruling (`docs/09-rule-audit.md:93`) |
| the wrong file key in `stale-statements.md:133`, and the Fluent file's page list with no Polaris page in it (§0.4) | **1.16** — the one-line fix, before wave 5 reads it |
| the 38 queued composites and Polaris's 29 | **1.9** (P1 badge zone, P5 naming) and **1.10** families |
| the 46 live names with no table row; `bolt`; the three names that start with a Shopify-only name (§6 item 7) | the synonym table (`research/synonyms.mjs`), a tool/data chore before any live re-rank is used |
| `clock-revert`, `page-report`, `bolt`, the two carets — need an eye | **4.4** the eye-only list (node ids in §7) |
| the cut at 500 with 508 evidence-backed | **5.2** decision agenda |
| `help` / `info` naming | **1.9** P5 |

---

## 11. How to reprint

Every figure above is printed by `tools/audit/polaris-scope.mjs`; one section per document section. `<scratch>` is any directory
outside the repository (the tool refuses a destination inside it). `LIVE` is a bridge capture or, with no Figma open, the
catalogue on disk (`research/references/polaris/figma/catalogue.json`, equal to the live page on 2026-10-05, §0). Run
with the catalogue as `LIVE`, every section of `names`, `rerank`, `d23`, `grammar` and `pointer` prints the same text as
with the capture, except that the one node id the catalogue does not hold (`bolt-filled`, §7) needs the capture.

| document section | command |
|---|---|
| capture the live page (needs Figma) | `node tools/audit/polaris-scope.mjs script list` — paste into `figma_execute` with `fileKey XewrhAKrNGVZtikkpI5am9`, `timeout 30000`; then `… capture <saved.txt> --out <scratch>/live-list.json`. The page list: `script pages`. The Fluent file's page list: `script fluent-pages` (the one-liner, with `fileKey rdI0uXVzp89fOZpYcQV6mo`) |
| §0 | `node tools/audit/polaris-scope.mjs bridge --live <scratch>/live-list.json --pages <scratch>/pages.json --pages-fluent <scratch>/pages-fluent.json` |
| §1 | `node tools/audit/polaris-scope.mjs names --live LIVE` |
| §2 | `node tools/audit/polaris-scope.mjs rerank --live LIVE --scratch <scratch>` (builds the scratch copy; reuses it while HEAD and the live names are unchanged; `--force` rebuilds) |
| §3 | `node tools/audit/polaris-scope.mjs d23 --live LIVE --scratch <scratch>` (`--all-d23` adds every D23 concept) |
| §4 | `node tools/audit/polaris-scope.mjs grammar --live LIVE --scratch <scratch>` |
| §5 | `node tools/audit/polaris-scope.mjs pointer --live LIVE --pages-fluent <scratch>/pages-fluent.json` |
| all | `node tools/audit/polaris-scope.mjs all --live LIVE --scratch <scratch> --pages <scratch>/pages.json --pages-fluent <scratch>/pages-fluent.json` |

`<scratch>/pages-fluent.json` is the answer of the Fluent page list (§0.4) in the shape `--pages-fluent` reads; with it the §0.4
and §5 lines reprint without Figma:

```json
{"kind":"polaris-pages/1","file":"a.1. Microsoft Fluent system iconography","fileKey":"rdI0uXVzp89fOZpYcQV6mo","at":"2026-10-05T06:01Z","by":"read-only listing run by the main session and reported to this card (not run by this card)","pages":[{"id":"12064:575","name":"Cover"},{"id":"13:2","name":"Intro & Changelog"},{"id":"12562:207","name":null,"note":"a separator"},{"id":"1124:9833","name":"System icons"},{"id":"11972:5","name":"Creation tools"},{"id":"11947:5","name":"Guidelines"}]}
```

The test (`node --test tools/audit/polaris-scope.test.mjs`) is built on synthetic fixtures only. Besides the unit tests it builds a
**fixture git repository** — a toy Polaris, Nucleo and Lucide, a small synonym table, two commits so that HEAD is not the pin,
a toy sheet, and the real `tools/audit.mjs` with only its cut made smaller — and runs sections `rerank`, `d23`, `grammar` and
`pointer` through the command line on it, so the assembly of §2–§5 is tested as it is used, against figures worked out by
hand from the fixture. A drift-guard group reads the tracked `tools/audit.mjs`, `research/synonyms.mjs`,
`research/sources/polaris.json`, `research/audit.json`, `docs/06-audit.md` and `CLAUDE.md` to catch the tool's copy of the
counting rule, the Lucide tag list and the placement order — and the counts the docs state — going stale.

## Gate

- `node tools/lint.mjs | tail -1` → **2,910 drawings · 2,848 clean · 62 warned · 0 failed**, and the whole output is byte-identical
  to the one captured before this card started. No icon was approved while it ran: HEAD is still `4cced8d` and
  `git diff 5933041 HEAD -- src/icons` is empty.
- `node --test tools/audit/*.test.mjs tools/audit/refs/*.test.mjs` → **292 pass, 0 fail**: the 182 of the baseline, this card's
  68 (`tools/audit/polaris-scope.test.mjs`) and 42 from `families.test.mjs` (27) and `optical-probe.test.mjs` (15), which two
  other cards added while this one ran.
- **Would the tests notice a regression?** 101 one-line mutations of `tools/audit/polaris-scope.mjs` — a swapped column, a wrong
  denominator, a dropped filter, a changed order — were made one at a time in a scratch copy, one per figure or rule that
  sections 0–5 print, including the reviewer's M5 (Arrows + UI counted as Arrows only). **All 101 are caught** by the test file.
  Two conditions that could never be false (a filter on rows `audit.json` never puts there, a clash test that was always
  true) were removed from the tool rather than tested. The harness lives in the scratch directory, not in the repo.
- `git status --short research/` → ` M research/queue.md` only: the drawing session's edit, already there when this card
  started, and its hash is unchanged since. Nothing was written under `src/icons/`, `lab/` (the manifest's hash is unchanged),
  `dist/`, `docs/01`–`09`, `CLAUDE.md` or `plans/`.
- **Files written:** this document, `tools/audit/polaris-scope.mjs`, `tools/audit/polaris-scope.test.mjs`. Outside the repo:
  the scratch directory (the live capture, the page lists, the scratch copy of HEAD and its two runs, the mutation harness).
