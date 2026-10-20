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

**Dated note, 2026-10-20 — the 9 redrawn for balance, not for lint.** Maruti, on the 9 beside the
0: *"the 9 feels off beside the 0 as it feels lighter and not balanced."* Measured on the shipped
pair at 24 · 20 · 16: the 9 carried 79 · 77 · 79 per cent of the 0's ink, stood 1 · 1 · 0.75
narrower, and shared the 0's left edge, so its centre sat 0.50 · 0.52 · 0.39 left of the 0's. Kept
fixed: the 0 (the locked letterform: re-solved for this box at 24 and 20, untouched at 16), the 9's height and place, and a hole that may close to C19's 1.
Three boards, all in `lab/drafts/archive/`:
- `sort-numeric-9.js`: four kinds of 9 beside the shipped one. **D**, an oval bowl as wide as the 0
  with a curved tail, was picked. The bigger round bowl that held a 1.5 hole closed its tail onto
  the bowl at 20 and 16.
- `sort-numeric-9-round2.js`: one variant of D per lever. **D2**, a touch narrower (5 · 4.5 · 4), was
  picked. Its tail leaned the 9 like italic: the long axis of its ink stood +11.9 · +12.8 · +13.3° off
  upright, against the shipped 9's +2.0 · +3.6 · +3.0° and the 0's 0°.
- `sort-numeric-9-round3.js`: upright tails on D2's bowl. **E4** shipped: the right side drops straight
  for 1.25 · 1 · 0.875, as the 0's side does, then one round turn ends in a level foot. Its lean is
  +0.3 · +0.3 · −0.9°, its ink 98.5 · 96.4 · 99.2 per cent of the 0's, and its hole 2 × 1.5 · 1.5 × 1 · 1.5 × 1.

The space between the tail's foot and the bowl is 0.93 · 0.63 · 0.61, against the shipped 0.77 · 0.53
· 0.52. The height bounds it at 20 and 16: the 9 is 6 · 5.25 tall, and three strokes down its middle (the
bowl's top and bottom, then the foot) take 4.5 · 3.75, which leaves 1.5 for the hole (1) and the gap under the bowl
(0.5) together; the tip's air, read on the slant, comes out a little more. It is under C19's floor of 1 at every
master, and Maruti agreed it for this 9 (2026-10-20; C19's dated note). The same 9 is in all six icons, moved the way the shipped 9 moved.
The 16 master's 9 is therefore no longer the locked drawing; its 0 still is. All six icons declare
`<!-- glyph: numeral -->` (C19), and their warnings, all from the old 9's 1.0 hole, are gone.

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
