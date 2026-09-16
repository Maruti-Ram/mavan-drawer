# Character — the visual language (O1, in progress)

Explored in `lab/character.html` against Polaris, Nucleo UI and Central Icons
(`node tools/refs.mjs` builds the licensed references locally; they are gitignored).

## Decided

| # | Decision | Why |
|---|---|---|
| C1 | **No sharp icons.** Round caps and round joins everywhere. | User direction. All three references agree. |
| C2 | **Professional, modern, refined — not friendly or comical.** The "Soft" draft (stroke 2, radius 3, bulbous shapes) was rejected. | User direction. |
| C3 | **Trash:** wide Central-style body hanging from the lid, 4° taper, flat tab handle, two short (4-unit) ribs. | Chosen from the trash explorer. Tall ribs read busy; dots and slots read as faces. |

| C4 | **Trash family:** `trash` (ribs), `trash-2` (rim band), `trash-3` (slot), `trash-4` (two dots). All four use the tab handle and the C3 body. | User picked all four interiors. |
| C5 | **Numbered variants are allowed** (`trash-2`, `trash-3`): the same object with a different interior, offered as a choice. The unnumbered name is the default. | Customers pick a style. This adds to the `<object>-<modifier>` rule; it does not replace it. |
| C6 | **Three masters: 24, 20, 16.** Keylines at 20 keep a 2-unit margin (circle ⌀16, square 14); at 16, a 1-unit margin (circle ⌀14, square 12). The 20 and 16 keylines are proposals until the first icons are approved. | User direction. |
| C7 | **Stroke 1.5 at every master.** | User decision. Foundations §3–§6 re-derived around the quarter grid. |

The C3 pattern (wide container, restrained short interior marks, flat handle)
is the reference for other containers: bags, boxes, archive.

## Open

- **Stroke weight.** Proposal: 1.5 at every master (6.3% · 7.5% · 9.4% of the canvas), as Polaris, Central and Font Awesome do. Both are shown in the lab with a toggle.
  2 is the settled value in CLAUDE.md; changing it moves the 16 master and the
  min-gap rule too.
- **Corner radius.** Refined uses 2.5 for containers and 1.5 for bends.
- **Angle exceptions.** Tapers (≤10°) and 30° hexagons are drawn but not yet
  allowed by `01-foundations.md`.
- **User icon:** the half-ellipse shoulders with a gently bowed base are
  pending review.
