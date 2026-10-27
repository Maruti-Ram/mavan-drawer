# Mavan Drawer {{version}}

{{icons}} icons, each drawn in two styles (outline and filled) at three sizes (24, 20 and 16). With their variants (`check-2`, `check-small` and so on) that is {{names}} names, and every name comes as outline and filled at all three sizes: six SVG files per name.

The 20 and the 16 are not shrunken copies of the 24. Each size is drawn separately, for that size.

This README is in the download folder, in `@mavan/icons` (the SVG files and JSON data) and in `@mavan/icons-react` (the React components).

## In the download

```
mavan-drawer-{{version}}/
  svg/24/  svg/20/  svg/16/      every name as <name>.svg and <name>-filled.svg
  icons.json                     the path data of every name at every size
  metrics.json                   ink box and bearings per size and name
  meta.json                      category, tags and variants per name
  README.md  LICENSE.md  CHANGELOG.md
  mavan-icons-{{version}}.tgz          the @mavan/icons npm package
  mavan-icons-react-{{version}}.tgz    the @mavan/icons-react npm package
```

In `@mavan/icons`, `svg/` and the three JSON files sit at the root of the package.

## Install

```
npm install ./mavan-icons-{{version}}.tgz
npm install ./mavan-icons-react-{{version}}.tgz
```

Install the one you use, or both. `@mavan/icons-react` does not need `@mavan/icons`.

Keep the `.tgz` files beside your code and commit them to a private repository, so every install gets the same files (LICENSE.md says why not a public one). To update, install the newer `.tgz` the same way. Installing by name from the npm registry is not available.

## Use in React

```jsx
import { Check, CheckFilled, Icon } from '@mavan/icons-react';

<Check size={16} />                       // the 16 master, drawn for 16 px
<CheckFilled size={20} />                 // the filled twin
<Icon name="check" size={24} />           // any name by string; "check-filled" for the filled twin
<Check size={16} optical />               // negative margins from metrics.json: padding is true to the ink
<Check size={16} title="Done" />          // a label: role="img" with a <title>; without it the icon is aria-hidden
```

- One component per name and style. The kebab-case name becomes PascalCase and `-filled` becomes a `Filled` suffix: `check-2-small` is `Check2Small`, `check-2-small-filled` is `Check2SmallFilled`.
- A few component names are also global names in the browser or in Node, `Map`, `File`, `Image`, `Text`, `Window`, `Option`, `Lock` and `Keyboard` among them. Importing one shadows the global in that file (`new Map()` would then build an icon), so rename it on import: `import { Map as MapIcon } from '@mavan/icons-react'`.
- `size` is a number in pixels, default 24. The component picks the master for that size by the rule in [Which size is drawn](#which-size-is-drawn).
- `optical` is a boolean, default false. It applies the icon's optical bearings from `metrics.json` as negative margins; see [Padding that is true to the ink](#padding-that-is-true-to-the-ink).
- `title` is an optional string. With it the icon is `role="img"` and carries a `<title>`. Without it the icon is `aria-hidden`. Every icon carries `focusable="false"`.
- Every other prop (`className`, `style`, event handlers, `ref`) goes to the `<svg>`, except `width`, `height` and `viewBox`, which follow `size`, and children, which are ignored.
- Colour is `currentColor` throughout: the icon takes the text colour, so set `color` in CSS.
- There is no runtime dependency. React is a peer dependency.
- Importing `Check` bundles only the `Check` drawings. `Icon` takes a name as a string, so it pulls in the whole set; use it for names that come from data (a config, a CMS) and import the component everywhere else. A name that is not in the set renders nothing.
- TypeScript types ship: `IconName` is every name, outline and `-filled`, and `IconProps` is the props every component takes (`size`, `optical`, `title` and the `<svg>` props); `Icon` takes those and `name`.

```tsx
import { Icon } from '@mavan/icons-react';
import type { IconName, IconProps } from '@mavan/icons-react';
```

## Use the SVG files

Every file is an outlined fill: each line of the drawing has been turned into a solid shape, so the file renders the same everywhere and holds no stroke. Do not set `stroke` or `stroke-width` on it. Colour comes from `fill="currentColor"` on the root, so inline the markup and the icon takes the surrounding text colour. Loaded as an `<img>` or a CSS background it cannot see your page's colour and draws in the browser's default.

Each file has a `viewBox` and no width or height. Set the size in your markup or CSS. Pick the folder by the rule below.

The files are in `svg/24/`, `svg/20/` and `svg/16/` (in `@mavan/icons`, at the package root): `check.svg` is the outline and `check-filled.svg` the filled twin.

## Which size is drawn

Three sizes are drawn for every name: 24, 20 and 16. The rule is **the master at or below the size, scaled up**:

| You show the icon at | Master used |
|---|---|
| 16 to 19 px | 16 |
| 20 to 23 px | 20 |
| 24 px and above | 24 |

That is 16 for 16 to 19 px, 20 for 20 to 23 px, and 24 at and above 24 px, however large. Below 16 px the 16 master is scaled down, there being nothing smaller. A larger master is never scaled down to a smaller size: its line would thin and its gaps close, which is what the smaller masters exist to avoid.

The React components do this for you from `size`. If you use the SVG files directly, pick the folder the same way: `svg/16/` for 16 to 19 px, `svg/20/` for 20 to 23 px, `svg/24/` for 24 px and above.

## Padding that is true to the ink

Every icon has empty space between the edge of its box and the ink, and the amount differs from icon to icon. `metrics.json` records it for every name at every master: the **ink box** (the smallest rectangle around what is drawn), the **geometric bearings** (the distance from each edge of the box to the ink, where the ink stops) and the **optical bearings** (the same distance as the eye reads it, where the ink reads as stopping: a circle touches its box at one point and reads as starting further in than its geometry says). CSS measures from the box, not from the ink, so the same CSS gives different results for different icons: at 24 px a `plus` has 4.5 px of space on every side and a `circle` has 2, so `padding: 12px` puts the ink 16.5 px from a button's edge for one and 14 px for the other. Subtract the optical bearing as a negative margin (at 24 the `circle`'s is 2.71, the `plus`'s 4.52) and `padding` and `gap` become true to the ink. The numbers are in the master's units, so multiply by size ÷ master (an icon shown at 22 px uses the 20 master, so multiply by 22 ÷ 20). The `optical` prop in React does this for you.

## The JSON files

- `icons.json`: the path data of every name at every master, for code that draws icons itself.
- `metrics.json`: per master and name, the ink box, the geometric bearings and the optical bearings, in the master's units.
- `meta.json`: what each name is. At the top, `name` (`mavan-drawer`), `version`, `built` (the date this box was made) and `counts` (icons, base concepts, variants, families). Then `icons`, one entry per name, in the set's own order:
  - `name`: the name you type, `check-2-small`.
  - `category`: the product category, such as `UI & Layout`.
  - `variantOf`: the name this one is a variant of (`check-2` → `check`), or null for a base concept. A variant may name another variant (`clipboard-check-2` → `clipboard-check`).
  - `family`: the base concept at the root of that chain (`clipboard`); a base concept names itself.
  - `tags`: the search words, a list; see [Names and search](#names-and-search).
  - `styles` and `masters`: which styles (`outline`, `filled`) and which sizes (24, 20, 16) the name has. Every name has both styles at all three sizes; the fields are there so your code need not assume it.
  - `mvp`: true for the icons marked as the core of the set, the ones drawn first. A shortlist, nothing more.
  - `approved`: the date the drawing was approved into the set, which CHANGELOG.md is built from.

  Then `families`, one entry per base concept: `base`, `category` and `variants`, every name whose chain leads to it.

## Outline and filled

Each icon's two styles are drawn together as a pair, and the filled twin has the outline's outer edge, so swapping one for the other does not move the icon in a layout. The exception is the icons whose filled twin thickens lines that stand on their own: stacks of lines and rows of dots (the menus, `list-bullet`, `more-horizontal`), the double chevrons (`chevrons-down`) and the lone bar of `minus`. Their filled box is a little larger than the outline's, by at most 1.5 units at 24 and 1 at 16 (`chevrons-down-2`); `metrics.json` has the box of each style.

Filled is not a background behind the outline. An icon with a shape to fill (a circle, a folder, a bell) fills it. An icon that is only lines (a plus, a check, an arrow) has nothing to fill, so its filled twin is the same drawing with a heavier line. Three key labels are the same drawing in both styles on purpose: `alt`, `escape` and `delete-forward-2` are only letters (ALT, ESC, DEL), and a letter keeps the outline's line when filled, because a heavier one would close up the space inside it.

Some names draw alike on purpose: a few variants have another name's outline and differ only when filled (`ban-2` and `compass-3` have their base's, `building-4` has `building-3`'s, and the `-2` and `-3` of `layout-header`, `layout-footer`, `layout-sidebar` and `layout-sidebar-right` have their base's), and a few are drawn as another name at 16, where the detail that sets them apart has no room (`camera-5` as `camera`, `files-5` as `files`, `help-circle-2` as `help-circle`, `microphone-5` as `microphone-2`).

## Names and search

A name is `<object>[-<modifier>][-<n>][-<size>][-filled]`, object first: `calendar-clock`, never `clock-calendar`.

- `-2`, `-3` and so on are other drawn shapes for the same idea (`check`, `check-2`). A composite that uses one takes its number: `check-circle-2` uses `check-2`.
- `-small` and `-large` are separate drawings with a smaller or larger mark on the same canvas. They are not for choosing a pixel size; for that, use `size`.
- `-filled` is the filled twin of any name.

From 1.0.0 on, a name never changes. A name retired later is marked deprecated, not renamed.

To search, use `tags` in `meta.json`. Most names carry search words, and on a numbered shape they name what sets it apart from the base (`check-2`: `steep`); a name with no tags is found by its name alone.

## Licence

LICENSE.md, beside this file, says what you may and may not do with Mavan Drawer. Read it before you put the files in a repository or hand them to anyone.
