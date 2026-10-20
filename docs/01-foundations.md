# Foundations

The geometric constitution of the library. Every icon obeys this or it does not ship.

---

## 1. The canvas

**Three drawn masters: 24, 20 and 16.** Each is drawn by hand on its own canvas,
not scaled from another. 24 is drawn first; 20 and 16 are redrawn from it with
less detail.

```
src/icons/24/  viewBox="0 0 24 24"
src/icons/20/  viewBox="0 0 20 20"
src/icons/16/  viewBox="0 0 16 16"
```

The numbers for every master live in one place, `tools/masters.mjs`; the linter,
the build and the lab all read it.

24 is the right master because it divides cleanly (2, 3, 4, 6, 8, 12), it is the
most common UI icon size on the web, and it leaves enough room for detail without
tempting you into detail that dies at 16px.

**Units are not pixels.** A unit is a unit. At render size 24 one unit is one
CSS pixel; at 16 it is 0.667. The grid rules below are written so the icon is
crisp at the *master* size, which is where crispness matters most.

### The canvas is a layout box, not a drawing bound

```
┌────────────────────────────┐  24 × 24   canvas — the box a consumer reserves
│  ┌──────────────────────┐  │
│  │                      │  │  20 × 20   the circle keyline (see §2)
│  │                      │  │            = the outer bound for normal shapes
│  │                      │  │
│  └──────────────────────┘  │  2 units   margin, shipped inside the asset
└────────────────────────────┘
```

**There is no separate "live area".** The outer drawing bound *is* the largest
keyline — the circle at ⌀20. Naming it twice invents a layer that does not exist.
Two numbers is the whole structure: the **canvas**, and the **keylines**.

The 2 units between them are not a drawing rule. They are **margin, shipped inside
the asset**, and they exist because the canvas is what gets aligned and spaced —
not what gets drawn in. Ship icons that fill their box and every consumer has to
add the same padding by hand; some will forget, some will use 4, and the set will
look different in every product. Margin has to be part of the asset or it is not
part of the system.

Everyone lands in the same place, because it is calibrated against text rather
than chosen:

| Library | Canvas | Largest keyline | Ratio |
|---------|--------|-----------------|-------|
| Font Awesome 7 | 20 | ⌀16 | 80% |
| Shopify Polaris | 20 | 16 | 80% |
| Material · Fluent | 24 | ⌀20 | 83% |
| This library | 24 | ⌀20 | 83% |

An icon whose ink filled a 24px box reads much heavier than the 16px text beside
it. At 20/24 it matches.

### What may reach the margin edge

**Nothing crosses the margin edge — 22 · 18 · 15 at 24 · 20 · 16.** Lint errors on
any ink past it. Two rules let a drawing run past the keyline it would otherwise
keep, out to that edge: a `-large` mark (C8), and a **modifier badge** (C33). A
badge sits on its base's bottom-right corner and may stand past the base's box up
to the margin edge, never beyond it. The base keeps its own position, and the
composite declares its box (`calendar-repeat`: `<!-- box: 19x19 -->` · `15x15` ·
`13x13`). The geometry is in `05-modifiers.md` §2's dated note.

*Changed 2026-10-18 (C33). This section said badges may cross 22, after Fluent's,
which runs to 23 of 24 — into the margin. Ours stops at the margin edge, because the
margin is spacing shipped inside the asset (above), not room to draw in.*

## 2. Keylines

Different shapes need different dimensions to look the *same* size. A circle that
measures 20 across looks smaller than a square that measures 20 across, because
the square has more mass in the corners. Keylines are the pre-corrected sizes.

| Keyline    | Outer dimensions | Use for                                  |
|------------|------------------|------------------------------------------|
| Square     | 18 × 18          | squares, rounded rects, boxy silhouettes |
| Circle     | ⌀ 20             | circles, discs, round silhouettes        |
| Portrait   | 16 × 20          | tall shapes — documents, phones, bookmarks |
| Landscape  | 20 × 16          | wide shapes — cards, calendars, images   |
| Diagonal   | 20 × 20 bounding | 45° shapes — arrows, slashes             |
| **Mark**   | ≤ 18 × 18        | directional marks — chevrons, carets, minus |

All keylines are centred on the canvas midpoint.

### Keylines at 20 and 16

| Keyline   | 24 master | 20 master | 16 master |
|-----------|-----------|-----------|-----------|
| Square    | 18 × 18   | 14 × 14   | 12 × 12   |
| Circle    | ⌀ 20      | ⌀ 16      | ⌀ 14      |
| Portrait  | 16 × 20   | 12 × 16   | 10 × 14   |
| Landscape | 20 × 16   | 16 × 12   | 14 × 10   |
| Mark      | ≤ 18      | ≤ 14      | ≤ 12      |
| Margin    | 2         | 2         | 1         |

20 matches Font Awesome's 20 grid (circle 16, square 14). 16 keeps only one unit
of margin, because small icons have to fill more of their box to read at all —
Nucleo's 12 grid does the same. The 20 and 16 rows are proposals until the first
icons have been approved at those sizes.

**Mark** is the escape hatch, and it is deliberately awkward to use. A chevron is
not a silhouette of an object; it is a direction, and forcing it to fill 18 × 18
would make it shout. Marks have no minimum size — only a ceiling and a centring
requirement. A file opts in explicitly:

```svg
<!-- keyline: mark -->
```

If you find yourself reaching for `mark` on something that depicts an object,
you have the wrong keyline, not the wrong rule.

**An agreed box.** An icon whose proportion is settled by eye may declare the ink
size it was approved at, in that master's units:

```svg
<!-- box: 20x18 -->
```

Lint then holds the drawing to that size — to 0.01, as an error, not a warning —
instead of asking it to match a keyline. Everything else still applies: the margin,
the centring, the grid. It is a decision about one icon, recorded in the file, not a
new keyline; a file may declare `box` or `keyline: mark`, never both. First used by
`folder` (20 × 18 · 16 × 14 · 14 × 12, 2026-09-20): the landscape keyline went
1.25 → 1.33 → 1.4 wide-to-tall as the masters shrank and the folder read squashed at
20 and 16, where the agreed box holds 1.11 · 1.14 · 1.17.

**A level family (C28).** Every member of a family that shows an amount going down
keeps the full member's canvas position, so only the full member (`volume`) is centred
on a keyline; the levels and `volume-x` (`volume-low`, `volume-none`, `volume-x`) declare
`<!-- anchor: volume -->`. `volume-off` is a state, not a level: it is centred like any icon and
carries no note.
Lint then holds their ink inside the full member's box, sharing its left or right edge
(the body has not moved) — same master, same style, as an error — instead of asking them
to be centred or to match a keyline; the margin, grid and gaps still apply, and `anchor`
goes with neither `box` nor `keyline: mark`.

**A composite that keeps its base's place (C33).** A modifier badge sits on its base's
bottom-right corner and the base keeps its own canvas position, so on a short base the whole
icon sits off the canvas centre (`password-lock`: `password`'s field in place, the composite
2.5 · 2 · 1.5 below centre, 2026-10-20). Such a composite declares its base:

```svg
<!-- base: password -->
```

Lint then holds it to the base's place instead of the centre — same master, same style, as an
error: its ink must hold the base's box and share its left and top edges (the corner away
from the bottom-right badge). The margin, grid, gaps and its declared `box` still apply; `base` goes
with neither `anchor` nor `keyline: mark`.

**These are outer dimensions — they include the stroke.** At 24, a stroked
circle that should hit the ⌀20 keyline has a *centreline* radius of 9.25,
because the 1.5-unit stroke adds 0.75 on each side. At 16, the same logic on
the ⌀14 keyline gives a centreline radius of 6.375 — the 1.25-unit stroke adds
0.625 on each side (C7). Every ring file at 16 uses this: `M1.625 8A6.375
6.375 …` (`src/icons/16/alert-circle.svg` and the rest of the ring family).
See §4.

Use a keyline as the ceiling, not a quota. A minus sign does not need to fill
18 × 18. But nothing should exceed its keyline, and the dominant mass of most
icons should reach it.

---

## 3. The coordinate grid

**All coordinates land on the quarter grid** — integers, `.25`, `.5` or `.75` —
**at 24 and 20.** The 16 master is the one exception: see the callout below.

The reason is the stroke (§4). A 1.5 stroke centred on `x.25` or `x.75` has
both edges on integers — `3.75` spans 3 → 4.5, and `20.25` spans 19.5 → 21 — so
the *outer* edge of a container lands exactly on a pixel boundary. Container
edges therefore sit on `.25` / `.75`.

**At 16 the grid is one step finer.** The 16 master's stroke is 1.25 (§4, C7),
so a centreline on the quarter grid no longer puts the outer edge on a pixel.
Centred on `x.375` / `x.625` instead — an **eighth grid** — it does: the
12-unit square keyline's left wall sits at `2.625` (outer edge `2.625 − 0.625 =
2`) and its right wall at `13.375` (outer edge `13.375 + 0.625 = 14`), on the
same logic as the quarter-grid case above. This applies to the 16 master only;
24 and 20 keep the quarter grid.

**Symmetric marks may sit on the canvas midline** (`12`, `10`, `8`). At 24, a
plus centred on x=12 has its edges on 11.25 and 12.75, which is soft by a
quarter pixel on each side. At 16, the same plus centred on x=8 (stroke 1.25)
has its edges on 7.375 and 8.625, soft by three-eighths of a pixel — but
symmetric either way. For a mark, symmetry beats crispness.

Permitted exceptions, in order of preference (24 and 20; see above for 16):

1. **Arc-derived decimals** — the endpoint of a circular arc rarely lands on the
   quarter grid. Round to **2 decimal places**, never more.
2. **Optical corrections** — anything else off the quarter grid. Requires a
   comment in the source file saying what it corrects.

**Maximum precision at 24 and 20: 2 decimal places. At 16: 3**, to reach the
eighth grid above. The linter enforces both. Beyond that you are storing float
error, not design intent.

Angles default to **0°, 45°, 90°**. 30° and 60° are allowed when the subject
demands it (a hexagon, a chart line) and must be justified in the source file.

**`code`'s slash is a per-icon exception** (C30), not a third entry on this
list. Its two ends sit on the grid and span its mark box, so the angle is
whatever falls out — 73.14° · 72.26° · 73.18°, from a run × rise of 5 × 16.5 ·
4 × 12.5 · 3.25 × 10.75 — and the source file justifies it with **the run and
rise, not a degree figure**, because a fixed degree would push the endpoints off
the grid. **No corollary is drawn from it:** the next drawn character — `italic`,
a numeral, another letterform — is its own decision on its own evidence. Lint
does not check angles at all.

---

## 4. The stroke system

### Weight: 1.5 at 24 and 20, 1.25 at 16 (C7)

Everything in the library is drawn as a **stroke**, not a fill, at the master.
Fills are a derived style (see `03-variants.md`), not a drawing technique.

```
stroke-width="1.5"    (24 and 20) or "1.25" (16)
stroke-linecap="round"
stroke-linejoin="round"
fill="none"
stroke="currentColor"
```

| Master | Stroke | Share of the canvas | Filled line weight | Share |
|--------|--------|---------------------|--------------------|-------|
| 24     | 1.5    | 6.3%                | **2.5**            | 10.4% |
| 20     | 1.5    | 7.5%                | **2**              | 10%   |
| 16     | 1.25   | 7.8%                | **2**              | 12.5% |

**Filled line weight (locked 2026-09-17).** A *line-heavy* icon (`plus`,
`check`, arrows, chevrons — nothing encloses an area) has nothing to fill, so
its filled style is the same lines at the weight above. Never a background. The
ink box stays identical to the outline's, so each end pulls in by half the
added weight (`M5.25 12h13.5` at 1.5 → `M5.75 12h12.5` at 2.5). Every other icon
fills its shapes and keeps its **outline weight** for any leftover line — 1.5
at 24 and 20, 1.25 at 16. Numbers live in `tools/masters.mjs` (`FILLED_WEIGHT`,
`strokeOf`); lint enforces them on `*-filled.svg`. One exception (C32,
2026-10-17): a **numeral** inside a line-heavy icon (`repeat-once`'s 1) keeps
the outline weight in the filled file, declared `<!-- glyph: numeral -->`, its
path carrying `stroke-width` at that weight; gaps are measured with each path's
own weight. Letters follow it since 2026-10-20 (`translate`'s A and 文),
declared `<!-- glyph: letter -->` — the weight only, not C19's floor of 1.
A second (C33, 2026-10-19): a **line badge** on a line-heavy base
(`passkey-2`'s key) does the same, declared `<!-- badge: line -->`, its air to
the base held at 1.5.

**Lint compares the pair (added 2026-09-20).** Every icon ships as
`<name>.svg` and `<name>-filled.svg` at each master, and the two are meant to
occupy the same ink box. Until now every check read one file alone, so nothing
ever held them to it. Lint now measures both boxes the same way it measures one
— a line grown by half its own stroke, a filled area taken as drawn — and warns
on the filled file when any side differs by more than 0.01, naming the four
sides and both boxes.

Some differences are agreed rather than wrong: a repeated element thickens in
place (C17's dots and menu lines), and a lone bar cannot get heavier without
getting taller (`minus`). Those declare the difference, in the same spirit as
`box:` above — `<!-- grows: L R T B -->` on the filled file, four signed numbers
in that master's units saying how far the filled ink stands **proud** of the
outline's on the left, right, top and bottom; negative means pulled inside. The
note silences the warning only while the drawings measure what it says: a note
that disagrees with them, one lint cannot read, or one sitting in an outline
file is an **error**. It can never hide a mistake.

Measured across all 351 shipped pairs on the day the check landed: 33 differ,
all of them C17 repeated elements or `minus`, none of them anything else.

**16 draws a lighter line than 24 and 20 (C7, amended 2026-09-20).** Until
then, the library held one physical weight at every master, so the smaller
masters were proportionally heavier for free — 6.3% · 7.5% · 9.4% of the
canvas. Measured at 16×16, that read as roughly 50% more ink than a reference
that scales one 24 drawing down (`docs/08-refinement.md` §3.1), and the user's
blind pick on eight true redraws preferred a 16 master a touch lighter: 1.25,
7.8% of the canvas — still heavier than 24 and 20, just not by a jump to 9.4%.
24 and 20 keep one physical weight between them; 16 is now its own.

### Why 1.5 at 24 and 20, and not 2

Decided 2026-09-16 after a side-by-side in `lab/character.html`. 2 is the
pixel-perfect answer — an integer stroke has integer edges — but it reads heavy
and friendly. The library's character is refined and professional
(`docs/07-character.md`), and 1.5 is the weight of that character. The 16
master's own weight, 1.25, was picked the same way — see the callout above.

The cost is crispness at 1×: neither a 1.5 nor a 1.25 stroke can have both
edges on integers. The quarter grid (§3), or the eighth grid at 16, puts the
edge that matters — the outside of a container — on a pixel boundary. On a 2×
(retina) screen 1.5 is exact, a whole 3 device pixels; 1.25 is 2.5 device
pixels and still cannot land clean on both edges there — the price of the
lighter 16 line, accepted with the C7 amendment.

### Caps and joins: round

Round caps and joins, everywhere, no exceptions (`07-character.md` C1). A
terminal's visual end is predictable: exactly `stroke-width / 2` past the path
endpoint.

**The round-cap rule:** a path endpoint sits `stroke-width / 2` *inside* the
extent you actually want — `0.75` at 24 and 20, `0.625` at 16.

> At 24, to draw a horizontal line that visually spans the 18-unit square
> keyline (3 → 21), the path is `M3.75 12h16.5` — endpoints at 3.75 and 20.25,
> caps extending to 3 and 21. At 16, the same line spanning the 12-unit square
> keyline (2 → 14) is `M2.625 8h10.75` — endpoints at 2.625 and 13.375 (the
> eighth grid, §3), caps extending to 2 and 14.

Getting this wrong by a stroke is the most common error in icon sets.

**Dated note, 2026-09-20 — a diagonal end needs both axes.** The example above
is orthogonal: the endpoint only has to move along the line to hold the cap
where it was. A 45°-diagonal endpoint's cap is a full circle, so it has two
outward extremes — one on x, one on y — and holding both means moving the
endpoint out 0.125 on **both** axes, not 0.125 along the diagonal. That lands
the cap 0.052 further along the diagonal than the old 1.5 line reached
(measured by the reviewer and `tools/convert-16.mjs`, 2026-09-20). Ink boxes
are unaffected.

---

## 5. Corners and radii

| Element                        | Centreline radius at 24 |
|--------------------------------|-------------------------|
| Primary container (card, box)  | 2.5                     |
| Bend or secondary detail       | 1.5                     |
| Hard corner (deliberate)       | 0                       |

Proposed from the Refined specimens in `lab/character.html`; confirmed as the
first containers are approved. Radii at 20 and 16 are set per icon while drawing
and recorded here once they settle.

Do not use radius values between these. Three options is a system; seven is a
mood.

---

## 6. Negative space — the rule that decides whether the set survives at 16px

**Minimum gap between any two stroke edges: a literal 1.5 units, at every
master.** At 24 and 20 that is also one stroke width, since the stroke there
is 1.5; at 16 the stroke is 1.25 (C7), so the floor is wider than the stroke
by design, not "one stroke width" any more.

**In a filled drawing, white is a gap too** (2026-09-28): a line or detail punched out of a
filled shape, a band separating two filled parts, a notch in the outline and the space between
a shape and a line all hold 1.5 of white at every master — at 16 that is wider than the 1.25 line
it replaces, because a white line reads thinner than a drawn one (C18, C22). Lint §5f measures
these and the air inside a closed path; an agreed exception is declared with `<!-- gap: N -->`.

One carve-out, declared per file and checked by lint: **C19's glyph gap of 1 unit**
for the inside of one character — a dot to its body (`<!-- glyph: dot -->`), a `?`'s
mouth, and a numeral's own opening such as the mouth of a 2 (`<!-- glyph: numeral -->`,
2026-09-26). The gap between a character and anything else stays 1.5
(`07-character.md` C19). A letter's own openings are not covered: `<!-- glyph: letter -->`
(C32) keeps a letter's weight, not this floor.

The same at every master, and at the 16 master that is 1.5px — the smallest gap
that still reads as a gap rather than a smudge. Anything
tighter fills in, and an icon that fills in at 16px is a broken icon no matter
how good it looks at 96.

Corollaries:
- **No enclosed shape smaller than 1.5 units across** (inner dimension). A ring is one: a circle
  drawn as a stroke leaves a hole 2r − w across inside it (a key's bow, a ring badge, a keyhole),
  and lint §5f holds that hole to 1.5, or to the file's agreed gap (2026-10-20). A circle whose
  radius is at most half its stroke is a dot: it draws solid and has no hole.
- **Arms that cross keep 1.5 at their tips** (2026-10-20). Where two strokes cross and two
  neighbouring arms meet at under 86°, measured tip to tip, the wedge between them fills in at 16
  unless the arms reach far enough apart: the shorter arm's cap centre, r from the crossing, and the
  point r along its neighbour stand 1.5 apart, edge to edge ("tip air at equal reach"; `password-2`'s
  asterisk holds 2.25 · 1.5 · 1.5). Lint §5 measures it, and §5h the same arms where a filled twin
  traces them as one shape, as warnings. Right-angle crossings (plus, x, #), arrowheads, single-path
  bends and T-joins are not judged, nor an overhang whose cap sits inside its neighbour's ink. A
  file's agreed `gap:` applies; a character's own arms take C19's 1 under `glyph:`; a C33 badge's
  arms keep 1.5 whatever the file's `gap:` says.
- **No more than 3 parallel strokes** in one run. Four is a texture, not an icon.
- When a detail cannot fit at a 2-unit gap, **remove the detail**. Do not shrink
  the stroke locally — varying stroke weight within a set is the fastest way to
  make it look amateur.

This rule will feel punishing. It is the rule that separates icon sets that hold
up from ones that only photograph well.

---

## 7. Optical corrections

The grid is a starting point, not a verdict. Your eye overrules it — but only
after the grid has been tried.

- **Circles overshoot.** A circle sits on the ⌀20 keyline, not the 18 square, for
  exactly this reason. Already handled by §2.
- **Diagonals look thin.** A 45° stroke presents less width to the eye than an
  orthogonal one. Round caps and joins mostly compensate. Do not thicken it.
- **Horizontals look heavier than verticals.** Real, but below the threshold that
  matters at 1.5 units. Ignore.
- **Visual centre is above geometric centre.** For icons with a clear top and
  bottom (a pin, a flag, a droplet), shifting mass up by 0.5 units often reads
  as better centred. Use sparingly and comment it.

Any optical correction that breaks the integer grid must carry a comment in the
source file explaining what it is correcting. An uncommented decimal is a bug.

---

## 8. What a compliant source file looks like

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5.25v13.5"/>
  <path d="M5.25 12h13.5"/>
</svg>
```

Fixed for every icon in the library:

- `viewBox` equal to the master's canvas — `0 0 24 24`, `0 0 20 20` or `0 0 16 16`
- `fill="none"` and `stroke="currentColor"` — colour is the consumer's problem
- stroke attributes on the **root**, never on individual paths — bar two: a C32
  numeral or letter in a line-heavy filled file carries `stroke-width` at the outline
  weight (`<!-- glyph: numeral | letter -->`), and so does a C33 line badge on a line-heavy base (`<!-- badge: line -->`)
- **no** `width` / `height` on the root — the consumer sizes it
- **no** `<g>`, no `transform`, no `id`, no `class`, no inline `style`
- one `<path>` per discrete stroke run, in drawing order (container first,
  details after)
- **no** `<circle>` / `<rect>` / `<line>` elements — normalise everything to
  `<path>` so the linter has one thing to parse and the build has one thing to
  transform

The linter (`node tools/lint.mjs`) checks all of this mechanically.
