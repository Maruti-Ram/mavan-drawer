# Figma reference extractor — how to run it

Harness: `tools/audit/refs/figma.mjs` (plan card 0.3, `plans/set-and-rules-audit.md`).
It reads four icon sets out of the Figma file `central+icon+system+v1.35`
(key `XewrhAKrNGVZtikkpI5am9`) through the figma-console desktop bridge and writes
normalised JSON under `research/references/<source>/figma/`.

**Licensed third-party geometry.** `research/references/` is gitignored for exactly
this reason. Nothing here writes anywhere else; nothing from it may be copied into
`src/icons/` or any tracked file. The harness's own test (`selftest`) uses geometry
it generates itself.

## The four pages

| source | page id | page name | what is on it | measured |
|---|---|---|---|---|
| `central` | `7:118` | `❖  Icons` (two spaces) | 37 category frames holding COMPONENT_SETs (a 38th, *Social Media & Brands*, holds 159 plain brand-logo COMPONENTs, not sets — not enumerated) | 1,927 sets × 30 variants = 57,810 drawings, all 24×24 |
| `fluent` | `15711:27742` | `Microsoft FLuent` | COMPONENT_SETs straight on the page (+ a `Placeholder` set, skipped) | 2,608 sets, 19,243 drawings, canvas = size (12 16 20 24 28 32 48) |
| `untitled` | `15713:69155` | `Untitled UI` | sections *Line Icons* and *Solid Icons*, 19 category frames each, COMPONENTs | 1,187 concepts (1,171 with both styles), 2,360 drawings, 24×24 |
| `polaris` | `15721:27960` | `Polarris icons` | one unnamed SECTION of COMPONENTs; a filled twin is the name + `-filled` | 490 concepts (9 with a twin: alert-octagon, bolt, check-circle, hide, keyboard, plus-circle, profile, question-circle, star), 499 drawings, 20×20 |

Counts come from `--catalogue` runs on 2026-10-04 (`research/references/<source>/figma/catalogue.json`).

## Rules for the bridge (learned the hard way)

- Read only. The extractor is handed `{root, mixed, fileKey}` and nothing else, so it cannot call `figma.create*`.
- One page at a time (`page.loadAsync()`); **never** `figma.loadAllPagesAsync()` — it times out on this file.
- `figma_execute` needs `timeout: 30000`. One agent on the bridge; calls strictly sequential; pace heavy lookups and retry once on a transient connection error.
- A result over ~100k characters is saved to disk by the host and only its path is shown. The extractor pads every answer past that limit on purpose, so a dump **never enters the conversation and is never retyped**. `ingest` reads that saved file as it is.

## Run it

```
node tools/audit/refs/figma.mjs selftest                       # mock-Figma test, no bridge needed
node tools/audit/refs/figma.mjs script install                 # paste into figma_execute ONCE per bridge session
node tools/audit/refs/figma.mjs script verify                  # paste to check the install; compare with the "expected:" line
node tools/audit/refs/figma.mjs script run central --sample-set    # paste into figma_execute (timeout 30000)
#   → the host answers "…saved to /…/tool-results/….txt"
node tools/audit/refs/figma.mjs ingest /…/tool-results/….txt   # normalise + write
node tools/audit/refs/figma.mjs summary all                    # canvas · stroke · filled twin · masters
node tools/audit/refs/figma.mjs probe folder-1                 # stated-vs-measured for the Central folder-1 claims
```

Selection (all are options of `script run <source>`; sample size and choice are parameters, not code):

| option | meaning |
|---|---|
| `--sample-set` / `--names a,b` | the built-in ~26 cross-source concepts (`SAMPLE` in the file) / exact names (an alias is used only if no concept has that name) |
| `--match REGEX` / `--group TEXT` | more concepts by name / restrict to a category |
| `--n N` | with no names: N concepts spread evenly over the whole source |
| `--variants all\|default\|"axis=v\|v;axis=v"` | which variants of a set to read |
| `--from I --limit K` | slice a long list; a dump that ran out of time says `partial` and where to continue |
| `--catalogue` | no geometry — every concept with variant count, axes, canvas |

Full extraction (wave 2): `node tools/audit/refs/figma.mjs plan <source> --chunk K` prints the chain of `script run … --from i --limit K` commands.
Measured on 2026-10-04: Central 26 concepts × 30 variants = 735 KB in one call, 63 concepts in 1.9 s; Fluent 26 concepts = 417 KB in 0.7 s. Keep a chunk to a few MB.
Ingest in any order, then `reingest <source|all>` rebuilds every normalised file from the saved raw dumps (also after any change to the normaliser — Figma is not needed again).
After editing the extractor, bump `EXTRACTOR_VERSION` and re-install — or patch the installed copy in place (`toString()` → `replace` → `(0, eval)`), then `script verify` must print the `expected:` hash.

## What it writes — `research/references/<source>/figma/`

| file | holds |
|---|---|
| `<group>--<name>--<id>.json` | one concept: every drawing as a record (schema `mdx-ref/1`) |
| `index.json` · `catalogue.json` | concepts extracted so far · every concept on the page |
| `calibration.json` | fill-only sources: the line weight per size, read off a bar glyph (`bar` = a minus's short side, `cross` = a plus's arm width; the second glyph is kept as a cross-check) |
| `raw/*.json` | each dump exactly as the extractor returned it (pad removed) |

The existing files in `research/references/{central,fluent,polaris}/` (read by name by `tools/refs.mjs`) are never touched.

A record: `source, page, group, name, aliases, variant{}, style, master, canvas[w,h], strokeWidth, strokeCap, strokeJoin, strokeBasis{value,from}, paths[], measure{}, meta{}`.

- `paths[]`: `d` in canvas coordinates (node transforms applied) · `local` as Figma reports it · `paint` (`stroke|fill|both|none`, from **visible paints**, not `strokeWeight`) · `node` x/y/w/h/transform · `stroke{weight,align,cap,join,miterLimit}` · `bbox` · `cornerRadiusProp`.
- **Every measurement is recorded twice** as `{abs, canvas, stroke}`: the source's own units, a share of its own canvas, a multiple of its own stroke (`ink`, `margins`, `radii`, per-path `bbox`, `stroke` itself). `strokeBasis.from` says where "its own stroke" came from: `measured` · `variant:stroke` (Central's filled twins) · `twin` (the outline sibling, Untitled's solids) · `calibration:<glyph>` (Fluent, Polaris) · `null` (then the multiple is null — never guessed).
- `measure.ink` is Figma's own render bounds (`inkSource: render`), with centreline ± half stroke kept beside it (`inkAnalytic`; it ignores caps and joins).
- `measure.radii[]`: every rounding, read from the Bézier handles. A run of curve pieces between two straight edges counts **once** — `corner` (r = the circle tangent to both edges where the run starts and ends; `smooth: true` when the pieces are not a circular arc, as in Untitled UI's smoothed corners), `cap` (parallel edges; r = half the width). Curves not between straight edges are `circle` or `arc` (a piece of a free curve, never a corner). Corner radius must be read this way, not from `cornerRadiusProp`: Central's filled variants report `cornerRadius = 0` with the rounding baked into the path (`cornerSmoothingProp` is kept beside it).

## Things that will bite

- `strokeWeight` is stale on fill-only nodes (Fluent, Untitled solids, Central filled variants all carry a number with no stroke paint). Trust paints.
- Central names carry search aliases (`folder-shield, folder-security` → name + 1 alias). Duplicate names exist inside one group (`images-4`); the id in the file name keeps them apart.
- Untitled UI pairs line and solid by *(category, name)* across its two sections; Polaris by the `-filled` suffix; Fluent by `Theme` at the same `Size`; Central by `filled` at the same stroke/radius/join.
- Central `radius`/`join` are crossed only partly: radius 0 has both joins, radius 1–3 only `round` (5 of 8 pairs).

## What has been checked (2026-10-04)

- `selftest` 13/13 on a mock tree; the same extraction run twice (v3 and v4 of the extractor, and Central as one call vs two chunks) returns identical geometry; `reingest` is byte-identical.
- The harness's canvas-space path box equals Figma's own `absoluteBoundingBox` for 1,619 of 1,620 sampled nodes (±0.01). The one exception is a 30°-rotated gear where Figma reports the bound of the rotated frame, not the drawing.
- `probe folder-1` re-measures the hand-measured Central claims from the extracted records; an independent script that reads only the raw dump agrees with it.
