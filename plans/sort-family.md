# The sort family, levelled

**WITHDRAWN 2026-10-03.** The premise of this plan was wrong and Maruti ruled against it after
seeing what it cost. It is kept, struck through, so nobody reopens it without the measurements.

~~Every member of the sort family stands in the box shipped `sort` already declares —
18×15 · 16×13.5 · 14×12.~~

**No family in this set keeps one ink box.** Measured at 24: `menu` runs 10.5 · 10.5 · 7.5 · 9.0
tall across its own variants, `chevron-up` 7.43 · 6.35 · 9.03, `list-bullet` 11.0 · 14.0 · 12.5 ·
14.5, `arrow-up` 10 · 14 · 11.5 · 10 wide. The sort family was never level either — `sort-2` is
18 tall against `sort`'s 15. What a family shares is the dimension its mark's own structure
fixes (arrows all hold 15 tall and vary in width; menu holds 15 wide and varies in height), not
a box. `sort-3` standing 11.52 was never an inconsistency to fix.

Maruti, on seeing the character icons beside the chevron ones: *"its fine that the character and
the number ones look bigger than the chevron."*

**What the error cost, and how it was settled.** The locked letterforms were re-solved from 8.25
to 6.75 of ink at 24 only to fit a box that did not need to exist. The A's counter now measures
1.24 against §6's 1.5 where the locked drawing was clear; the 9's closed from 2.5 to 1.5; the
Z's 20 diagonal lies 1.54° shallower. Redrawing the eight character icons at the locked letter
sizes would have restored all three and made those icons 18 · 14 · 12 tall.

**CLOSED 2026-10-03.** Maruti looked at the family together in the Library and kept the drawings
as they ship: *"the balance of how i see the icons and their sizes look good and balanced."* So
the three numbers above stand as the drawings' own, not as defects waiting to be fixed, and the
warnings they raise in `npm run check` are expected. Do not redraw the character icons to chase
them. The letterforms as locked still live in `lab/drafts/archive/glyph-{a,z,0,9}.js`, and their
re-solved versions in `glyph-{a,z,0,9}-15.js`, if the question is ever genuinely reopened.

**Dated note, 2026-10-20 — the outline A's warning was a false positive, now gone.** Lint read the
A's bar and legs as two strokes 0.46 apart (edge gap −1.04: they overlap). The bar's ends now sit
on the leg centrelines, as `translate`'s A does, and the bar is drawn in the legs' path. The ink
is the same shape: rendered as one shape, 0 pixels change at 24, 20 and 16 (1×, 2×, 8×). The 18
outline warnings are gone. The filled A's counter warnings (1.24 · 0.9 · 0.85) stand as above;
that counter is the same triangle as the outline A's.

## What changes for the customer

~~Today a toolbar that shows `sort`, `sort-3` and an alphabetical variant side by side shows
three different sizes. After this they are all 15.~~ **Withdrawn:** three different sizes is what
this set does everywhere, and Maruti confirmed it reads correctly — the character icons standing
taller than the chevron ones is the content being bigger, not a fault.

## The decisions already made

| | |
|---|---|
| The lines, in the unsorted state | medium, long, short — the one order no sorted list can produce. Both sorted states are wedges; this is a bulge |
| The chevron | 45° — what `chevron-up` and `chevron-down` actually ship at (44.95 · 45 · 45.5) |
| Direction | lives in the content (the lines, or the letters), not in the mark — the chevron pair stays constant so it keeps meaning "this column is sortable". **Unconfirmed:** the board holding A/B against C/D is still open |
| The family box | 18×15 · 16×13.5 · 14×12 |
| The letters | 6.75 · 6.0 · 5.25 of ink, stacked with 1.5 of air, which fills the box exactly. **The 16 master is the locked drawing untouched**; only 24 and 20 are re-solved |

## The work

| # | Card | Owns | Done when | Model | Depends on |
|---|---|---|---|---|---|
| 1 | ~~Settle how the chevron icons fill 15~~ — **withdrawn.** Three constructions were drawn and all three failed: spreading the lines put 5.25 of air between them at 24 so they read as three marks rather than a list (Maruti: *"i dont want to spread out those lines"*), and opening the chevrons alone took the channel to 7.62 at 24 against a shipped 4.14 — past the 6.25 that the chevron board had already called the point where the pair stops reading as one control | — | — | — | — |
| 2 | Re-solve `A` and `Z` at 6.75 (24) and 6.0 (20), outline + filled | `lab/drafts/batch/glyph-a-15.js`, `glyph-z-15.js` | ink box exact, filled box equals outline, counters measured and compared with the locked 16 | strongest | — |
| 3 | Re-solve `0` and `9` the same way | `lab/drafts/batch/glyph-0-15.js`, `glyph-9-15.js` | as card 2 | strongest | — |
| 4 | ~~Revise `sort-3` to the family box~~ — withdrawn with card 1 | `src/icons/*/sort-3*.svg` | lints clean; `npm run check` unchanged elsewhere | strongest | 1 |
| 5 | ~~`sort-ascending-2` / `sort-descending-2` in the family box~~ — withdrawn with card 1 | `lab/drafts/current.js` | lints clean | strongest | 1, and the A/B-vs-C/D board |
| 6 | `sort-alpha-ascending` / `-descending` | `lab/drafts/batch/sort-alpha-*.js` | lints clean; letters sit in the same slot the bars use | strongest | 2 |
| 7 | `sort-numeric-ascending` / `-descending` | `lab/drafts/batch/sort-numeric-*.js` | as card 6 | strongest | 3 |
| 8 | ~~Reviewer pass: all nine side by side at 16 in the Library's At 16 strip~~ — withdrawn with card 1 | — | a fresh agent confirms one height, one mark, one language | strongest | 4–7 |

Cards 2 and 3 run beside card 1. Cards 6 and 7 run beside each other once their letters land.

## How the whole thing is proven

`npm run check` with no new warnings; every member measures 18×15 · 16×13.5 · 14×12 with the
filled box equal to the outline's; the nine looked at together at real 16 px, and a fresh
reviewer that did not draw them checks them against this plan.

## Open question this plan does not answer

The chevron pair against solid triangles (G against H on the old sort board) is still undecided
and is deliberately kept out: every drawing here uses the open 45° pair, so that choice can be
made once, later, across the whole family at once.

## Status

- [x] 1 · how the chevron icons fill 15 — **withdrawn**, all three constructions damaged the icon
- [x] 2 · A and Z re-solved
- [x] 3 · 0 and 9 re-solved
- [x] 4 · sort-3 revised — **withdrawn**; sort-3 stands as locked, 18x11.52 · 16x11.02 · 14x9
- [x] 5 · sort-ascending-2 / sort-descending-2 — **withdrawn** with card 1
- [x] 6 · sort-alpha-ascending / -descending, and their -2 / -3 lines variants
- [x] 7 · sort-numeric-ascending / -descending, and their -2 / -3 lines variants
- [x] 8 · reviewer pass — **withdrawn**; the Library's At 16 strip served instead
