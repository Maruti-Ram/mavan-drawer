# Reference extractors — Nucleo and SF Symbols (plan card 0.3)

Two extractors that turn licensed third-party icon sets into one normalised JSON record per drawing,
so the audit tools can measure them. `figma.mjs` (same directory) does the Figma-hosted sets; its
record shape is the shape used here, so one reader serves all sources.

**Licensing fence.** Everything is written under `research/references/` (gitignored: internal comparison
only). Both writers refuse any other destination. Nothing from there may be copied into `src/icons/`.
We measure these sets to calibrate our method; we never adopt their values.

| file | does |
|---|---|
| `nucleo.mjs` | Nucleo's local library (sqlite + 64,933 svg) → records. Also holds the **shared record vocabulary** (`dual`, `measure`, `normalisePath`, `bboxOf`, `recordToSvg` …) that `sfsymbols.mjs` imports. |
| `sfsymbols.mjs` | SF Symbols' own font (CFF2 variable, python3 + fontTools) + Apple's metadata + the 26 loose template svgs → records. |

Needs: node 24 (`node:sqlite`); python3 with fontTools (SF extraction) and, for `verify` / `names` only, numpy · scipy ·
Pillow · skia-python · svgpathtools; `swift` (only for `sfsymbols.mjs names`). No npm dependencies.

## Run

```
node tools/audit/refs/nucleo.mjs                     # the default sample (47 drawings) → nucleo/sample.json
node tools/audit/refs/nucleo.mjs extract --names heart,bell --sets 10,11 --run mine
node tools/audit/refs/nucleo.mjs extract --family "Nucleo Core" --grids 24 --every 50   # an even spread
node tools/audit/refs/nucleo.mjs extract --all [--dry]    # wave 2: 64,933 drawings, sharded 2,000 per file
node tools/audit/refs/nucleo.mjs census              # stroke_max, strokes per family, element counts → nucleo/census.json
node tools/audit/refs/nucleo.mjs verify --sample --summary      # extracted geometry vs the .svg files themselves
node tools/audit/refs/nucleo.mjs compare bell heart  # Core 24/32/48 vs UI 12/18: scaled copy or redrawn?
node tools/audit/refs/nucleo.mjs compare --census | --all-pairs   # the same over every shared concept

node tools/audit/refs/sfsymbols.mjs                  # the default sample (45 drawings) → sfsymbols/sample.json
node tools/audit/refs/sfsymbols.mjs extract --cps 0x10004c,0x1002b4 --weights all --scales all
node tools/audit/refs/sfsymbols.mjs extract --names heart.fill,plus.circle --weights regular    # needs `names` first
node tools/audit/refs/sfsymbols.mjs verify           # records vs the font (pixels, ink box, advance)
node tools/audit/refs/sfsymbols.mjs derive 0x10004c | derive --sweep 300   # drawn or derived? (also vs Apple's static SF-Pro-Text-<Weight>.otf, if installed)
node tools/audit/refs/sfsymbols.mjs weights          # the stroke each weight really has → sfsymbols/weights.json
node tools/audit/refs/sfsymbols.mjs basemap          # Apple's base → derivative grammar, as counts → sfsymbols/basemap.json
node tools/audit/refs/sfsymbols.mjs templates        # the 26 loose svgs: three masters + guides → sfsymbols/templates.json
node tools/audit/refs/sfsymbols.mjs names            # name → code point by shape (~40 s) → sfsymbols/names.json
```

The sample is a parameter, not code: `--names`, `--sets`, `--family`, `--grids`, `--klass`, `--ids`, `--every N`,
`--limit N`, `--all` for Nucleo; `--cps`, `--range`, `--names`, `--weights`, `--scales`, `--all` for SF.
`--help` prints the full list.

## What a record is

Schema id `mdx-ref/1`, the same as `figma.mjs`:

```
{ schema, source, page, family, set, group, name, aliases, id, variant{}, style, master, grid,
  canvas[w,h], strokeWidth, strokeCap, strokeJoin, strokeBasis{value, from},
  paths[{ d, prim, paint, fill, winding, stroke{weight,cap,join,miterLimit,…}, bbox{x,y,w,h}, dCubic?, … }],
  measure{ stroke, ink{x,y,w,h}, margins{left,top,right,bottom}, centreOffset, radii[], strokeMax? },
  meta{} }
```

- **Every measurement is recorded twice**, as `{ abs, canvas, stroke }`: the source's own units, a share of its own
  canvas (x-lengths by width, y by height, direction-free lengths by the shorter side), and a multiple of its own
  stroke. `nucleo.mjs assertDual()` rejects a `measure` that holds a bare number. Raw path coordinates are source
  units; `scaledPaths(rec, 'canvas' | 'stroke')` gives them in either relative form.
- `strokeBasis.from` says where "its own stroke" came from: `measured` (a painted stroke), `calibration:siblings …`
  (Nucleo filled icons: modal stroke of the set at that grid), `calibration:U+100000 circle ring …` (SF: the glyph has
  no stroke property, so the ring thickness of the circle glyph at that weight and scale stands in). `null` means the
  multiples are `null`, never guessed.
- `d` is absolute `M L C Q A Z`. Arcs are kept exact (radii are measurable); `dCubic` carries the same path with arcs as
  cubics for readers that cannot take `A`.
- Nucleo `meta.nucleo` keeps the database row (`strokeMax`, `cornerCustom`, tags, set, ids); `meta.effects` counts
  clip/mask/filter/gradient, which are **not** applied (210 of 64,933 drawings).
- SF canvas is `[advance width at that weight and scale, 2048 (the em)]`; y runs down from the top of an em box centred on
  the cap-height midline. Large-scale glyphs are taller than the em, so their margins are negative.

## Things that will bite

- **Nucleo `size` is not a pixel size** — it is the svg markup's byte length. `grid` and the file's `viewBox` agree on
  64,932 of 64,933 drawings (the exception: set 6 id 821, grid 30, viewBox 24×25).
- **Nucleo `style` follows Nucleo's `klass`, not the paint.** Micro Bold files its bold-stroked drawings under `glyph`
  (→ `style: filled`); decide fill vs stroke from `paths[].paint`, as `figma.mjs` does.
- **Nucleo `stroke_max` is set on 1,429 of 64,933 icons**, three sets only, one value per (set, grid): see `census.json`.
- **Precision matters.** Nucleo draws some dots as 0.0001-long lines with square caps; their orientation lives in the
  fifth decimal. Paths are written at 6 decimals for that reason.
- **skia-python's `MemoryStream(bytes)` does not copy the bytes** — a temporary is freed mid-parse and `SVGDOM` returns
  `None` for no visible reason. Use `skia.Data.MakeWithCopy`.
- **SF Symbols names are not in the font.** The Apple tables `syls` / `symp` / `syot` are opaque; glyphs are keyed by
  code point. `names` recovers the link by shape; each name carries `confidence` (`sure` · `tied` = identical drawing under
  several code points · `likely` · `doubtful`). Treat `doubtful` as unresolved.
- `svgpathtools.svg2paths` returns elements regrouped by type, not in document order; `verify` walks the XML itself.

## What has been checked

`verify` on the sample and on whole sets (attributes, Hausdorff distance to svgpathtools' reading of the original file,
pixels against skia's render of the original file); `node tools/audit/refs/nucleo.mjs extract --all --dry` reads all
64,933 files without a failure; `sfsymbols.mjs verify` compares records with the font drawn through a y-flip transform.
