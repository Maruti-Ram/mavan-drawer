# Card 3.1: the box, installed as a customer and looked at in Chromium

`plans/shipping.md` card 3.1. A throwaway project installs both tarballs from the unzipped download, draws every
icon (1,310 names, outline and filled, at 24 · 20 · 16) in Chromium and compares each, pixel for pixel, with the
stroked source drawn the way the lab draws it. It also settles the pinhole question.

Everything generated is under `plans/proof-install/out/` (gitignored). The only committed outputs are these scripts,
this file and, when there are differences to show, `diffs.png`.

## Rerun

```
npm run release                       # no flags, about 4½ minutes; the tree must be clean. Writes dist/release/mavan-drawer-<v>.zip
node plans/proof-install/run.mjs      # setup, shoot, compare, pinhole, others: about 15 minutes on a 4-core machine
```

`run.mjs` takes step names to run only some of them, in this order: `setup shoot compare pinhole others`
(`node plans/proof-install/run.mjs compare pinhole others` reads the saved screenshots again). `PROOF_SCALES=1` limits
compare and pinhole to the 1× screenshots, for working on the scripts.

`PROOF_RASTER=gpu node plans/proof-install/run.mjs shoot compare pinhole` repeats the browser steps with
Chromium's GPU rasterisation switched on over SwiftShader (a software Vulkan; there is no GPU on this machine), into
`out/shots-gpu/`, `out/*-gpu.json`, `out/diffs-gpu/` and `out/pinhole-gpu/`. It is exploratory: its control (the same page
drawn twice) was 0 in the last run but not in an earlier trial (176 pixels in 39 icons), and its stroke-against-fill
differences are quantised edge steps, so read it as an indication only.

Needs Node 22, the pre-installed Chromium and Playwright (`require('playwright')`), `unzip` and network for npm.
No `playwright install`; no Firefox or WebKit.

## The steps

| Script | What it does | Writes |
|---|---|---|
| `setup.mjs` | unzips `dist/release/mavan-drawer-<v>.zip` to `out/download/`; makes `out/app/` and installs both tarballs from the unzipped folder with `react@19.3.0 react-dom@19.3.0 esbuild@0.28.2`; runs the README's own install lines, as written, in `out/readme-app/` (both) and `out/react-only-app/` (the React one alone) | `out/setup.json` |
| `shoot.mjs` | bundles `entry.jsx` with the app's own esbuild, serves it, and for every device scale (1×, 2×), master (24, 20, 16) and kind draws all 2,620 files in one 64-column grid and saves the page | `out/shots/<s>x/<m>-<kind>.png`, `out/shoot.json`, `out/console.json` |
| `compare.mjs` | pixel for pixel, as the 1.1 raster gate counts: different = more than 127 of 255. Also the smaller differences, the controls, every icon with a difference, its cause, and crops | `out/compare.json`, `out/per-icon-react-vs-lab.tsv`, `out/diffs/`, `diffs.png` |
| `pinhole.mjs` | the dots Skia may leave a hole in, measured in those same pages and at 1×, 2×, 4×, 8× size | `out/pinhole.json`, `out/pinhole/` |
| `others.mjs` | for each difference that is not a pinhole: who is right? the icon drawn 16 times larger both ways, the same patch of it read | `out/others.json` |

Kinds drawn (each alone on its page, all at the same positions, because the same SVG rasterised at a different
page position antialiases differently):

- `lab` — the stroked source as `lab/library.html` puts it on the page: the page's own `svg` template (read out of
  the page, not copied) filled from `lab/manifest.json`, set with `innerHTML`, under the page's CSS
  `svg{display:block;overflow:visible}`. `compare.mjs` first proves the manifest holds the body of every source file.
- `react` — the component from the installed `@mavan/icons-react`, `<Check size={S} />`.
- `svg` — the installed `@mavan/icons/svg/<S>/<name>.svg`, inlined.
- `img` — the same file as an `<img>` from a `blob:` URL of its exact bytes (2,620 parallel image requests overrun
  Chromium's limit).
- `lab2`, `react2` — the same pages again: the controls, which must give 0 differences.

Black on white; no colour test here (card 2.2 proved `currentColor`).

## Reading the results

- `out/compare.json` → `summary`: pixels equal, different by 1–32, 33–127 and over 127 (the 1.1 gate's "different pixel"),
  the controls, and the icons over 127 split into pinholes and the rest. Every icon with a difference is in
  `differences` with its counts, its worst pixel and its crop (`out/diffs/<s>x/<master>-<name>.png`: stroked source ·
  installed box · difference in red); `diffs.png` is the worst of them on one sheet.
  `out/per-icon-react-vs-lab.tsv` has the count of different pixels for every icon, master and scale.
- `out/pinhole.json`: the census of dots under half their stroke, the pixel at each dot's centre in the lab's drawing and
  in the box, and the named files at 1× · 2× · 4× · 8×. Crops in `out/pinhole/`.
- `out/console.json`: the console of every page; it must be empty.
