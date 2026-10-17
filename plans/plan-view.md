# The Plan view

Status: **built and proven 2026-10-17**; every card ticked. A fresh reviewer (Fable) passed all nine checks; the Library header now counts icons too. Follow-ups, not started: the variant badge counts undrawn variants as well (plan wording; may read as drawn).

- [x] 1.1 Sheet grammar: `mvp` on a row · `queue.mjs add` · `queue.mjs mvp` · `next` takes MVP first
- [x] 1.2 Dates and the flag in the manifest
- [x] 2.1 Two write routes on the lab server
- [x] 2.2 The Plan view in the Library
- [x] 3.1 Seed the MVP
- [x] 3.2 Docs and the skill
- [x] 4 Prove it

---

## What changes for Maruti

A **Plan** view in the Library (`lab/library.html`, beside Sheet) that answers three questions at a
glance and lets you act on them:

1. **What is drawn and what is left** — **one tile per icon, where an icon is a concept**: `thumbs-up`,
   `thumbs-up-2`, their smalls and their filled twins are one tile, not five (Maruti, 2026-10-17). A drawn
   tile shows the default drawing at 16 with a small count of its variants (Maruti, 2026-10-17: show the
   number, never count them as icons); an undrawn one shows the name
   in a dashed tile. Grouped by category (Arrows, UI & Layout, Files…), with a count per group. A filter:
   All · MVP · Left. Every number on the page counts concepts, never rows or files.
2. **Which icons are the MVP** — a star on each tile you click on or off. It is saved into the sheet
   itself, so "next icon" takes the undrawn MVP icons first, then the rest in audit order.
3. **How far there is to go** — a strip at the top: icons drawn / left for the whole set and for the
   MVP, and an estimate in drawing days from the sheet's own approval dates (how many concepts were
   approved per day so far; the median of those days). No number is typed in by hand.

And **a box to add a name**: type `bell-off`, press Enter, and it is a row on the sheet (in "E · Added on
request", object first, as `calendar-plus`). The page writes through the lab server, which runs
`queue.mjs` — the only thing that edits the sheet stays the only thing that edits the sheet.

**Still the sheet file.** `research/queue.md` is the one source of truth; the page reads it through
`lab/manifest.json` and writes it only through `queue.mjs`. No second list anywhere.

## Facts this rests on (measured 2026-10-17)

- Sheet: 833 rows, 485 done, 0 in review, 348 to draw (all in section D). 358 of the rows are icons
  (concepts, not a size or shape variant); 143 of those are done (corrected in wave 1, see below).
- Approvals per drawing day, base concepts only, 13 days: 19 · 8 · 5 · 21 · 19 · 5 · 27 · 2 · 14 · 10 ·
  14 · 6 · 1 — median **8 a day** (after wave 1's parser fix; the first count read 30 and 6 on two days and a
  median of 10, because 11 drawn variants counted as icons). All rows: median 17.
- The audit's proposed shipping list (D23, bold in `research/ranked.md`): **114 names — 72 drawn, 41 on
  the sheet undrawn, 1 not on the sheet (`sidebar`; the sheet has `layout-sidebar`)**. The set of
  concepts all three reference sets ship is a different 126. Keys are concept names, never the D23
  rename column (`close` for `x`, …).
- A row is `- [ ] N. \`name\` · Category · variant of \`base\` — note … approved DATE`. Anything else
  after the name makes the parser skip the row silently; `format()` drops any field it does not know.
  A token **inside the note** survives today. `tools/build.mjs:70` carries its own copy of the regex.
- `queue.mjs next` = the first row in file order that is not done and not a variant.
- `tools/serve.mjs` is a 35-line static server, no routes, never reads a body. A throwaway copy with
  one POST route that spawns a child with an argument array (no shell) passed `foo; rm -rf x` through
  intact — proved on port 4199, then killed.
- `queue.mjs` has no add-only command: `start` adds a name but also marks it in review and writes refs.

**Settled 2026-10-17 (Maruti):** an icon is a concept. Variants (`-2`, `-small`, filled) belong to it and
are never counted on their own — so today the set reads **358 icons, 143 drawn, 215 left** (the hook's
"485 of 834" counts rows; the plan first said 369 / 154 — a parser bug counted 11 drawn variants with no
category as icons, fixed in wave 1). At the median of 8 concepts a drawing day: the 41 undrawn MVP icons are about
5 drawing days, the 215 left about 27.

## Questions for Maruti (answer with the nod)

| | Question | Recommendation |
|---|---|---|
| Q1 | Seed the MVP from the audit's proposed list (114; 72 already drawn) or from the 126 all three references share? | **The 114** — standing unless Maruti says 126 before wave 3. |
| Q2 | `sidebar` is on that list but not on the sheet — add it, or count `layout-sidebar` as it? | **Settled:** count `layout-sidebar` as it (Maruti: "same thing"; the name stays in the layout family, C29). |

## Cards

### Wave 1 — the sheet and the tools (blocking)

- [ ] **1.1 Sheet grammar and commands.** *Owns:* `tools/queue.mjs`, `tools/build.mjs` (the regex copy
  only), a new `tools/queue.test.mjs`. The `mvp` flag is a token at the start of the note (`— mvp ·
  …`), parsed to `r.mvp`, re-emitted by `format()`, kept by `stamped()`. New commands: `add <name>…`
  (a row, no board, no refs; a size name goes under its default, anything else to section E — the same
  placement `start` uses) and `mvp <name>… on|off`. `next` returns the first undrawn base with `mvp`,
  else today's rule. `status` leads with icons (concepts) drawn / left, then MVP drawn / left, and says "rows" when it
  gives the row count. Every existing row round-trips byte-identical
  through parse → format (the test asserts it on the live sheet). *Done when:* the test passes, `npm run
  check` output is unchanged, the sheet diff after `mvp x on; mvp x off` is empty. *Model:* Opus.
- [ ] **1.2 Manifest.** *Owns:* `tools/build.mjs` (the queue block). Each row gains `mvp` and `date`
  (parsed from `approved YYYY-MM-DD`). *Depends on:* 1.1. *Model:* Opus (same agent as 1.1).

### Wave 2 — the server and the page (parallel; depend on 1)

- [ ] **2.1 Write routes.** *Owns:* `tools/serve.mjs`. `POST /api/queue/add {name}` and `POST
  /api/queue/mvp {name, on}`: body capped at 10 KB, JSON, name must match `/^[a-z0-9-]+$/`, spawn
  `node tools/queue.mjs …` with an argument array and no shell, then `node tools/build.mjs`; reply with
  the command's stdout and exit code; anything else is 400. GET behaviour unchanged. *Done when:* curl
  proves both routes and a rejected name; a static GET still serves. *Model:* Opus.
- [ ] **2.2 The Plan view.** *Owns:* `lab/library.html` (a new view beside Sheet, its CSS and JS).
  Tiles by category; filter All · MVP · Left; star toggle calling 2.1 and re-reading the manifest;
  the add box; the strip (icons drawn / left, MVP drawn / left, estimate from the concepts' `date`s, method shown
  on hover) — every count is of concepts, variants folded into their tile. Nothing shifts when a filter or the theme toggles; light and dark; keyboard: `P` opens the
  view. *Done when:* clean console; the counts equal `queue.mjs status`; a toggle round-trips to the
  sheet and back. *Model:* Fable (a page Maruti will live in).

### Wave 3 — fill and record (depend on 2)

- [ ] **3.1 Seed.** `queue.mjs mvp … on` for the list Q1 picks, run by the main session; one commit.
  *Model:* main session.
- [ ] **3.2 Docs and the skill.** CLAUDE.md's Library paragraph and Tools table (`queue.mjs` row), the
  icon skill §1 ("next icon" = next undrawn MVP first), `queue.mjs`'s header comment. *Model:* Sonnet.

### Wave 4 — prove

- [ ] **4** A fresh reviewer (Fable) checks: the sheet round-trip, `next` on a sheet with and without
  MVP rows, both routes with a bad name, the page's counts against `status`, a toggle end to end in the
  browser, lint byte-identical before and after. Failures reported with evidence.

## How the combined result is proven

`node tools/lint.mjs` byte-identical before and after · `node --test tools/geometry.test.mjs
tools/queue.test.mjs` pass · the Plan view's numbers equal `node tools/queue.mjs status` · clicking a
star changes one line of `research/queue.md` and nothing else · "next icon" after seeding starts an
MVP icon.
