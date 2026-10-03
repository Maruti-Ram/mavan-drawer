# The sort family, levelled

**Decided 2026-10-03 (Maruti):** every member of the sort family stands in the box shipped
`sort` already declares — **18×15 · 16×13.5 · 14×12**. Nothing in the family is taller or
shorter than anything else in it.

## What changes for the customer

Today a toolbar that shows `sort`, `sort-3` and an alphabetical variant side by side shows three
different sizes: shipped `sort` is 15 tall at 24, `sort-3` is 11.52, and a letter pair at its
locked size would be 18. After this they are all 15, and a header that switches between them
does not jump.

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
| 1 | Settle how the chevron icons fill 15 — bars spread, chevrons spread, or both | `lab/drafts/current.js` | Maruti picks a construction; it lints clean | strongest | — |
| 2 | Re-solve `A` and `Z` at 6.75 (24) and 6.0 (20), outline + filled | `lab/drafts/batch/glyph-a-15.js`, `glyph-z-15.js` | ink box exact, filled box equals outline, counters measured and compared with the locked 16 | strongest | — |
| 3 | Re-solve `0` and `9` the same way | `lab/drafts/batch/glyph-0-15.js`, `glyph-9-15.js` | as card 2 | strongest | — |
| 4 | Revise `sort-3` to the family box | `src/icons/*/sort-3*.svg` | lints clean; `npm run check` unchanged elsewhere | strongest | 1 |
| 5 | `sort-ascending-2` / `sort-descending-2` in the family box | `lab/drafts/current.js` | lints clean | strongest | 1, and the A/B-vs-C/D board |
| 6 | `sort-alpha-ascending` / `-descending` | `lab/drafts/batch/sort-alpha-*.js` | lints clean; letters sit in the same slot the bars use | strongest | 2 |
| 7 | `sort-numeric-ascending` / `-descending` | `lab/drafts/batch/sort-numeric-*.js` | as card 6 | strongest | 3 |
| 8 | Reviewer pass: all nine side by side at 16 in the Library's At 16 strip | — | a fresh agent confirms one height, one mark, one language | strongest | 4–7 |

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

- [ ] 1 · how the chevron icons fill 15
- [ ] 2 · A and Z re-solved
- [ ] 3 · 0 and 9 re-solved
- [ ] 4 · sort-3 revised
- [ ] 5 · sort-ascending-2 / sort-descending-2
- [ ] 6 · sort-alpha-ascending / -descending
- [ ] 7 · sort-numeric-ascending / -descending
- [ ] 8 · reviewer pass
