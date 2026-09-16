# Workflow — where icons actually get made

## The short answer

**Hand-authored SVG is the source of truth. Figma is optional, and only for
sketching.**

Not because Figma is bad — because for *this specific artefact* the thing you are
producing is ~40 characters of path data, and Figma is a lossy, unreviewable
container for path data.

## Why not Figma as the source of truth

| Problem | What it costs you |
|---|---|
| Export normalises strokes into outlined fills, or emits `stroke` plus transforms | You lose the ability to change weight as a variable. The whole variant system in `03-variants.md` dies. |
| Exported path data carries float noise (`11.9999998`) | Your "integer grid" is a fiction the moment anyone exports |
| Exports add `<g>`, `transform`, `clip-path`, `id`, `fill-rule` | Every icon needs a cleanup pass, which is manual, which means it will not happen consistently |
| Diffs are binary | You cannot code-review an icon change. You cannot see that someone moved a terminal by 0.5 units. |
| Grid compliance is by eye | No plugin enforces §6 min-gap or §3 precision. A script does, perfectly, on every commit. |

The disqualifying one is the diff. An icon library is a *system*, and systems
decay through small unreviewed drift. Text SVG in git gives you `-M4 12h16`
`+M4 12h15` in a pull request. That is the difference between a library and a
folder of files.

## Why not skip Figma entirely

You shouldn't, for two things it is genuinely better at:

1. **Silhouette exploration.** Deciding whether "archive" is a box, a tray, or a
   drawer is a visual question, best answered by drawing six of them fast and
   badly. Path data is a terrible medium for "fast and badly".
2. **Collaborators who don't write path data.** If a designer is contributing,
   Figma is their surface. The handoff is a sketch, not a file.

## The pipeline

```
   ┌─────────────┐
   │  1. SKETCH  │   Figma, iPad, paper. On the keyline template.
   │             │   Output: a silhouette decision. Not a file.
   └──────┬──────┘
          │
   ┌──────▼──────┐
   │  2. AUTHOR  │   Hand-write the SVG. Integers, 2-unit stroke,
   │             │   one path per run. src/icons/24/<name>.svg
   └──────┬──────┘
          │
   ┌──────▼──────┐
   │  3. LINT    │   node tools/lint.mjs
   │             │   Mechanical: grid, precision, trim, attributes.
   └──────┬──────┘
          │
   ┌──────▼──────┐
   │  4. REVIEW  │   node tools/serve.mjs → the lab
   │             │   Optical: 16px legibility, weight in context,
   │             │   consistency against neighbours.
   └──────┬──────┘
          │
   ┌──────▼──────┐
   │  5. BUILD   │   node tools/build.mjs
   │             │   Emits sprite / React / web font / whatever ships.
   └─────────────┘
```

Step 4 is the one people skip and the one that matters. **An icon is never
approved alone.** It is approved sitting in a grid next to twenty others at 16px.
Consistency is a property of the set, and you cannot see it one icon at a time.

## Authoring by hand is not as hard as it sounds

The entire vocabulary you need:

```
M x y      move to (absolute)         M4 12
L x y      line to (absolute)         L20 12
h dx       horizontal line (relative) h16
v dy       vertical line (relative)   v16
A rx ry rot large sweep x y    arc    a2 2 0 0 1 2-2
Z          close path
```

Circles are two arcs or one `a` with the same start/end. Everything in this
library is built from `M`, `h`, `v`, `l`, `a`, `Z`. That is six commands. You will
have it memorised in a week, and then you will be faster than you were in Figma,
because you will be typing the shape instead of nudging it.

## If you do use Figma

- Import `templates/grid-24.svg` as the frame background.
- Draw with **strokes**, never outlined shapes. Never "Outline stroke".
- Turn on snapping to a 1px grid. Set nudge to 1, big-nudge to 2.
- Export is a *reference*, not an artefact. Read the path data, then retype it
  clean into `src/icons/24/`. Retyping is not waste — it is the review pass.

## Contribution rules

1. One icon per commit. Named `icon(name): add|revise — reason`.
2. Lint must pass. No exceptions, no `--force`.
3. Every decimal in a path carries a comment saying what it corrects.
4. New icon ships with a screenshot of the lab's 16px grid, so the reviewer sees
   it in context and not in isolation.
