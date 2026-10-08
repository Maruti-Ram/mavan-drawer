#!/usr/bin/env node
// WALL DATA — card 4.1 of the set-and-rules audit (`plans/set-and-rules-audit.md`, wave 4). Writes the numbers
// `lab/audit-wall.html` sorts and highlights by: one record per concept, per master, per style.
// AUDIT ONLY: nothing in lint, build, queue or the lab's other pages imports this. It reads an archived pin and
// writes one file, `lab/audit-data/wall.json` (or `--out`).
//
//   P=<scratch>/pin; mkdir -p $P && git archive 5933041 | tar -x -C $P && (cd $P && node tools/build.mjs)
//   node tools/audit/wall-data.mjs $P                       # writes lab/audit-data/wall.json
//   node tools/audit/wall-data.mjs $P --out /tmp/wall.json   # anywhere else
//   node tools/audit/wall-data.mjs $P --check docs/audit/findings-mass.md --out /tmp/wall.json
//                                                            # also holds every row of card 1.5's appendix A to this run
//
// WHAT EACH NUMBER IS — the page prints these definitions; they are written once, here (DEFINITIONS).
//   ink     the inked area in that master's square units, at the master's own size (one unit = one pixel), so it is
//           also "pixels of ink". Card 1.5's measure (docs/audit/findings-mass.md §1): exact geometry by the audit's
//           rasteriser, supersampled at rate 32, through card 1.5's BYPASS (§1.1, appendix C) — every sample point
//           tested with `region.covered()`, never `region.classify`, whose defect drops a filled shape's horizontal
//           edges (plan, "Known instrument defects"). `bfRasterise` below is that appendix's code, unchanged.
//   share   ink ÷ canvas² — "how dark is this icon in a row". Not ink ÷ bbox, which ranks a `minus` the densest icon
//           in the set (card 1.5 M-7). A share does not change with render size, so the 24 master drawn at 16 px
//           carries the 24 master's share.
//   squint  the darkest patch after a blur: the drawing rasterised at the size it is shown (bypass, rate 32),
//           blurred with a separable Gaussian, σ 1.5 px, 11 taps, nothing outside the tile, then the maximum.
//           Card 1.5's construct (§1, §2.4) at the 16 master; at 20, 24 and "24 at 16 px" it is the same recipe at
//           that render size — this tool's extension, not a figure card 1.5 published.
//   strokes the number of subpaths in the file — every `M`/`m` starts one — over all its paths. Card 1.4's "detail
//           count" (docs/audit/findings-scaling.md:256). In a filled drawing a cut-out is a subpath too.
//   paths   the number of <path> elements.
//   kind    from the outline file's own note, as card 1.5 reads it: `keyline: mark` → mark; else `box:` → box; else
//           `anchor:` → anchor; else silhouette.
//   band    card 1.5's bands (§2.2): ink as a multiple of its row's median (that master and style) — Hairline < 0.5 ·
//           Light < 0.75 · Level < 1.25 · Full < 1.5 · Dense ≥ 1.5.
//   family  card 1.10's partition (`families.mjs` foldGrammar with unfoldCircles): 128 stems — size and number taken
//           off, the four directions of arrow and chevron folded, `plus-` / `minus-` / `x-circle` kept apart from
//           their marks as C18 keeps a container's sizes (docs/audit/findings-families.md:73-90).
//   hash    FNV-1a (32 bit) of the file's `d` strings joined with "|", so the page can tell a concept redrawn after
//           the pin from the drawing these numbers were taken on.
//
// LISTS — the highlight menu. Each one is either computed here from a card's own definition (and the count printed
// against the count the card published) or typed from the card's document with its line numbers. Nothing here
// judges: a list says where a card asked the eye to look.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { iconFromText, regionOf } from './raster.mjs';
import { foldGrammar, pathsOf, setFromTexts, sizeReport, tagsReport } from './families.mjs';

export const PIN = '5933041';
export const MASTERS = [24, 20, 16];
export const STYLES = ['outline', 'filled'];
export const RATE = 32;
export const SIGMA = 1.5;
/** The views the page offers: each master at its own size, and the 24 master forced to 16 px. */
export const VIEWS = [
  { id: '16', master: 16, px: 16, label: '16 master · 16 px' },
  { id: '20', master: 20, px: 20, label: '20 master · 20 px' },
  { id: '24', master: 24, px: 24, label: '24 master · 24 px' },
  { id: '24@16', master: 24, px: 16, label: '24 master forced to 16 px' },
];
export const BAND_EDGES = [['Hairline', 0.5], ['Light', 0.75], ['Level', 1.25], ['Full', 1.5], ['Dense', Infinity]];

const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;
const r5 = (n) => Math.round(n * 1e5) / 1e5;
const sortStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// ── measuring ───────────────────────────────────────────────────────────────────────────────────────────

/** Card 1.5's bypass, `docs/audit/findings-mass.md` appendix C, verbatim: coverage of every pixel of a `px`-square
 *  render, each sample tested with `reg.covered()`. It never calls `reg.classify`. */
export function bfRasterise(reg, { px, rate, canvas = reg.canvas }) {
  const unit = canvas / px, r = rate / unit;            // samples per canvas unit
  const cov = new Float64Array(px * px), { x0, y0, x1, y1 } = reg.bbox;
  for (let j = 0; j < px; j++) {
    const by0 = j * unit, by1 = (j + 1) * unit;
    if (by1 < y0 - 1e-9 || by0 > y1 + 1e-9) continue;   // pixel row outside the ink box
    const j0 = Math.ceil(by0 * r - 0.5), j1 = Math.ceil(by1 * r - 0.5);
    for (let i = 0; i < px; i++) {
      const bx0 = i * unit, bx1 = (i + 1) * unit;
      if (bx1 < x0 - 1e-9 || bx0 > x1 + 1e-9) continue;
      const i0 = Math.ceil(bx0 * r - 0.5), i1 = Math.ceil(bx1 * r - 0.5);
      let hit = 0, n = 0;
      for (let b = j0; b < j1; b++) for (let a = i0; a < i1; a++) { n++; if (reg.covered((a + 0.5) / r, (b + 0.5) / r)) hit++; }
      cov[j * px + i] = n ? hit / n : 0;
    }
  }
  return { cov, px, rate, canvas };
}

/** A normalised Gaussian reaching 3σ either side, rounded up (σ 1.5 → 5 either side, 11 taps): card 1.5 §2.4. */
export function gaussianKernel(sigma) {
  const rad = Math.ceil(3 * sigma - 1e-9);
  const k = Array.from({ length: 2 * rad + 1 }, (_, i) => Math.exp(-((i - rad) ** 2) / (2 * sigma * sigma)));
  const s = k.reduce((a, b) => a + b, 0);
  return k.map((v) => v / s);
}

/** The squint peak: separable blur with nothing outside the tile (zero padding), then the maximum. */
export function squintPeak(cov, px, sigma = SIGMA) {
  const k = gaussianKernel(sigma), rad = (k.length - 1) / 2;
  const h = new Float64Array(px * px), v = new Float64Array(px * px);
  for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) {
    let s = 0;
    for (let t = -rad; t <= rad; t++) { const xx = x + t; if (xx >= 0 && xx < px) s += k[t + rad] * cov[y * px + xx]; }
    h[y * px + x] = s;
  }
  let max = 0;
  for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) {
    let s = 0;
    for (let t = -rad; t <= rad; t++) { const yy = y + t; if (yy >= 0 && yy < px) s += k[t + rad] * h[yy * px + x]; }
    v[y * px + x] = s;
    if (s > max) max = s;
  }
  return max;
}

/** Subpaths in one `d`: every moveto starts one. */
export const subpathsOf = (d) => (d.match(/[Mm]/g) ?? []).length;

/** Card 1.5's kind, read from a file's notes. */
export function kindOf(text) {
  if (/<!--\s*keyline:\s*mark\s*-->/.test(text)) return 'mark';
  if (/<!--\s*box:/.test(text)) return 'box';
  if (/<!--\s*anchor:/.test(text)) return 'anchor';
  return 'silhouette';
}

/** FNV-1a, 32 bit, over UTF-16 code units — the page computes the same on the manifest's `body`. */
export function fnv1a(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
/** A file's drawing, as a hash of its `d` strings (comments, attributes and whitespace between tags ignored). */
export const drawingHash = (text) => fnv1a(pathsOf(text).join('|'));

/** Everything the wall needs from one file. `px16` adds the squint at 16 px (the 24 master forced to 16). */
export function measureFile(text, { label = '<text>', px16 = false, rate = RATE, sigma = SIGMA } = {}) {
  const icon = iconFromText(text, label);
  const reg = regionOf(icon);
  const own = bfRasterise(reg, { px: icon.canvas, rate });
  const ink = own.cov.reduce((a, b) => a + b, 0);                 // px = canvas: one pixel is one square unit
  const ds = pathsOf(text);
  const out = {
    canvas: icon.canvas,
    ink, share: ink / (icon.canvas * icon.canvas),
    squint: squintPeak(own.cov, icon.canvas, sigma),
    strokes: ds.reduce((n, d) => n + subpathsOf(d), 0),
    paths: ds.length,
    kind: kindOf(text),
    hash: drawingHash(text),
  };
  if (px16) out.squint16 = squintPeak(bfRasterise(reg, { px: 16, rate }).cov, 16, sigma);
  return out;
}

// ── rows ────────────────────────────────────────────────────────────────────────────────────────────────

/** The row median — for an even count, the mean of the two middle values. */
export function median(values) {
  const v = [...values].sort((a, b) => a - b), n = v.length;
  if (!n) return null;
  return n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2;
}
/** Card 1.5's band of one ink figure against its row median. */
export function bandOf(ink, med) {
  const ratio = ink / med;
  return BAND_EDGES.find(([, edge]) => ratio < edge)[0];
}

/** Names that share one drawing at one master and style: card 1.5 §7's "identical path data". */
export function identicalGroups(set) {
  const out = {};
  for (const m of MASTERS) for (const style of STYLES) {
    const by = new Map();
    for (const n of set.names) {
      const f = set.files.get(`${m}/${n}${style === 'filled' ? '-filled' : ''}`);
      if (!f) continue;
      const sig = pathsOf(f.text).join('|');
      if (!by.has(sig)) by.set(sig, []);
      by.get(sig).push(n);
    }
    out[`${m}/${style}`] = [...by.values()].filter((g) => g.length > 1).map((g) => g.sort(sortStr)).sort((a, b) => sortStr(a[0], b[0]));
  }
  return out;
}
/** The 14-sets / 43-groups / 98-files summary card 1.5 §7 prints, from `identicalGroups`. */
export function identicalSummary(groups) {
  const all = Object.values(groups).flat();
  const parent = new Map(), find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  for (const g of all) for (const n of g) if (!parent.has(n)) parent.set(n, n);
  for (const g of all) for (const n of g.slice(1)) parent.set(find(n), find(g[0]));
  const sets = new Set([...parent.keys()].map(find));
  return { sets: sets.size, groups: all.length, files: all.reduce((n, g) => n + g.length, 0) };
}

// ── the lists the highlight menu offers ─────────────────────────────────────────────────────────────────

/** Typed from the cards' documents, with the lines they come from. Every name is checked against the pin. */
export const TYPED_LISTS = [
  {
    id: 'crowded', card: '1.5', label: 'Crowded line — the eight drawings darker than their line',
    source: 'docs/audit/findings-mass.md:347-360 (§3.4); M-3 at :468',
    question: 'Look at them at real 16 in a row of neighbours before touching anything (M-3). Measured on the outline.',
    byStyle: { outline: [['wand-2', 'globe-2', 'language-3', 'wand-3', 'paintbrush-5', 'wand', 'globe', 'language-2']] },
  },
  {
    id: 'lopsided', card: '1.11', label: 'Mass-lopsided objects — centred box, mass well off it',
    source: 'docs/audit/findings-optical.md:429-450 (§3.3, outline at 24; the arrows, judged and left centred, and the bells, not lopsided, left out); question at :608',
    question: 'In a row, do any of these read off centre — and which way? Measured on the outline. Moving one is the optical sheet\'s job, not the wall\'s (§3.3).',
    byStyle: { outline: [['login-3', 'login'], ['chart-bar-2'], ['paintbrush-3', 'paintbrush-7'], ['sort-numeric-ascending-3', 'sort-numeric-descending-3'],
      ['flag', 'flag-2', 'flag-3', 'flag-4'], ['text'], ['volume-minus'], ['login-2', 'login-4', 'logout', 'logout-2', 'logout-3', 'logout-4'],
      ['wand-3', 'filter-4', 'rotate-ccw-3'], ['home', 'home-2', 'home-3'], ['map-pin-5', 'map-pin-3', 'map-pin', 'map-pin-2', 'map-pin-4'],
      ['user', 'user-2'], ['heart', 'heart-2'], ['lock', 'lock-2'], ['key', 'key-5', 'key-6'], ['lightbulb-4', 'lightbulb-3'], ['send'],
      ['megaphone', 'megaphone-2', 'megaphone-3']] },
  },
  {
    id: 'folder-box', card: '1.13', label: 'The 20 × 18 folder box, between a square and a landscape',
    source: 'docs/audit/exceptions-ledger.md:770-772 (§6; the row it asks for); the 18 concepts on the box at :278',
    question: 'Does a 20 × 18 box read as the same size as the 18 square (calendar) and the 20 × 16 landscape (mail)? (F2)',
    groups: [['calendar', 'folder', 'camera', 'desktop', 'briefcase', 'heart', 'mail']],
  },
  {
    id: 'split-families', card: '1.13', label: 'Families split between a mark and a keyline',
    source: 'docs/audit/exceptions-ledger.md:234-241 (the F2 symptom); question at :773',
    question: 'Does grid-3 read smaller than grid, filter-2 than filter, chart-bar than chart-bar-2? One row per family (F2).',
    groups: [['grid', 'grid-2', 'grid-5', 'grid-6', 'grid-7', 'grid-3', 'grid-4'], ['filter', 'filter-3', 'filter-4', 'filter-2'],
      ['chart-bar-2', 'chart-bar-3', 'chart-bar-4', 'chart-bar-5', 'chart-bar'], ['maximize-5', 'maximize', 'maximize-3', 'maximize-4', 'maximize-2'],
      ['refresh-2', 'refresh', 'refresh-3'], ['sort', 'sort-ascending', 'sort-descending']],
  },
  {
    id: 'seed', card: '1.5', label: 'Look-alike seed pairs at 16 — closest pictures after a blur',
    source: 'docs/audit/findings-mass.md:488-501 (§6)',
    question: 'Twenty at 16, squinted: can each pair still be told apart? An uncalibrated shortlist, not evidence (§6).',
    byStyle: {
      outline: [['users-2-wide', 'users-wide'], ['info', 'alert-circle'], ['x-circle-small', 'plus-circle-small'], ['help-3', 'alert-circle-2'],
        ['x-circle', 'compass-2'], ['users-2-behind', 'users-behind'], ['minus-circle', 'check-circle-small'], ['volume-plus', 'volume-x'],
        ['plus-circle', 'compass-2'], ['face-sad', 'face-neutral']],
      filled: [['users-2-wide', 'users-wide'], ['plus-circle-small', 'x-circle-small'], ['help-3', 'alert-circle-2'], ['info', 'alert-circle'],
        ['check-circle-small', 'minus-circle-small'], ['clock', 'alert-circle-2']],
    },
  },
];

/** Lists computed here, each from a card's own definition or a card's own committed tool. */
export function computedLists(set, rows, { optional = {} } = {}) {
  const lists = [];
  // Card 1.5 §2.2 — the two ends of every row.
  for (const [id, band, label, question] of [
    ['dense', 'Dense', 'Dense — at least 1.5× the row\'s median ink', 'Do the darkest drawings stand out of a 16 px row (F1)?'],
    ['hairline', 'Hairline', 'Hairline — under half the row\'s median ink', 'Do the lightest drawings drop out of a 16 px row (F1)?'],
  ]) {
    const perView = {};
    for (const v of VIEWS) for (const style of STYLES) {
      perView[`${v.id}/${style}`] = [set.names.filter((n) => rows[n][style][String(v.master)].band === band)];
    }
    lists.push({ id, card: '1.5', label, source: 'docs/audit/findings-mass.md:136-143 (§2.2): bands are multiples of that master and style\'s median', question, perView });
  }
  // Card 1.5 §2.3 and M-2 — the marks.
  const marksPer = {};
  for (const v of VIEWS) for (const style of STYLES) marksPer[`${v.id}/${style}`] = [set.names.filter((n) => rows[n].outline[String(v.master)].kind === 'mark')];
  lists.push({ id: 'marks', card: '1.5', label: 'Marks — `keyline: mark` drawings (the lighter population)',
    source: 'docs/audit/findings-mass.md:170-199 (§2.3); M-2 at :466',
    question: 'Rows that mix a chevron or a plus with a folder or a calendar: are marks and objects one weight (M-2)?', perView: marksPer });
  // Card 1.5 §7 — the same drawing under two names, at the master and style on show.
  const ident = identicalGroups(set), identPer = {};
  for (const v of VIEWS) for (const style of STYLES) identPer[`${v.id}/${style}`] = ident[`${v.master}/${style}`];
  lists.push({ id: 'identical', card: '1.5', label: 'Same drawing, two names — at the master on show',
    source: 'docs/audit/findings-mass.md:517 (§7); recomputed here at every master and style',
    question: 'The eye is asked to tell apart names that are not different drawings (§6, §7).', perView: identPer,
    summary: identicalSummary(ident) });
  // Card 1.10 E-3 — the same-tag pairs, from families.mjs's own `tagsReport`.
  const tags = tagsReport(set, set.names);
  lists.push({ id: 'same-tags', card: '1.10', label: 'Same-tag pairs — two numbered shapes with the same search words',
    source: 'docs/audit/findings-families.md:581 (E-3), §1.3; recomputed by families.mjs tagsReport',
    question: 'Can a customer tell each pair apart? If yes they need words; if not, fewer numbers (E-3).',
    groups: tags.identical.map((x) => [x.a, x.b]) });
  // Card 1.10 E-1 — the container families' default and small, from families.mjs's own `sizeReport`.
  const sizes = sizeReport(set, set.names);
  lists.push({ id: 'container-smalls', card: '1.10', label: 'Container smalls — each ring beside its -small',
    source: 'docs/audit/findings-families.md:579 (E-1), §2.2; recomputed by families.mjs sizeReport',
    question: 'At 16, does each -small read as a smaller icon, outline and filled (E-1)?',
    groups: sizes.containers.map((f) => [f.base, `${f.base}-small`]) });
  // Card 1.4 §6 — the concepts whose outline loses (or gains) a subpath between masters.
  const shed = shedDetail(set.names, rows);
  lists.push({ id: 'shed', card: '1.4', label: 'Detail shed between masters — the outlines whose stroke count changes',
    source: 'docs/audit/findings-scaling.md:256-268 (§6: 30 shed, 2 gain); recomputed from the stroke counts here',
    question: 'At 16 in a row of twenty, have these shed enough — or too much — beside the ones that kept every part? (references-nucleo.md:508)',
    groups: [[...shed.shed, ...shed.gain]],
    notes: Object.fromEntries([...shed.shed, ...shed.gain].map((n) => [n, `outline subpaths 24 · 20 · 16: ${MASTERS.map((m) => rows[n].outline[String(m)].strokes).join(' · ')}`])),
    summary: { shed: shed.shed.length, gain: shed.gain.length } });
  for (const l of Object.values(optional)) lists.push(l);
  return lists;
}

/** Card 1.4's detail count across masters: `shed` loses a subpath somewhere from 24 to 16, `gain` adds one. */
export function shedDetail(names, rows) {
  const shed = [], gain = [];
  for (const n of names) {
    const s = MASTERS.map((m) => rows[n].outline[String(m)]?.strokes);
    if (s.some((v) => v == null) || (s[0] === s[1] && s[1] === s[2])) continue;
    (s[2] > s[0] || s[1] > s[0] ? gain : shed).push(n);
  }
  return { shed, gain };
}

/** Card 1.11's off-centre drawings with no judgement on record, from optical-probe.mjs's own classifier: shift [0,0]
 *  published, ink centre more than 0.005 off the canvas centre, not a C28 anchor, no STATED_REASON. Needs the pin built
 *  (dist/icons.json). Per master and style, so the wall lights a concept only where that drawing is the one off centre. */
export async function offcentreList(pin) {
  const { readPin, classifyOffcentre } = await import('./optical-probe.mjs');
  const { pop, classed } = classifyOffcentre(readPin(pin));
  const unjudged = classed.filter((c) => !c.reason);
  const perView = {}, notes = {};
  for (const v of VIEWS) for (const style of STYLES) {
    const here = unjudged.filter((c) => c.i.master === v.master && c.i.style === style);
    perView[`${v.id}/${style}`] = [[...new Set(here.map((c) => c.i.concept))].sort(sortStr)];
    for (const c of here) notes[`${v.id}/${style}/${c.i.concept}`] = `ink centre ${c.off[0] >= 0 ? '+' : ''}${c.off[0]}, ${c.off[1] >= 0 ? '+' : ''}${c.off[1]} off the canvas centre · ${c.cause}`;
  }
  return {
    id: 'offcentre', card: '1.11', label: 'Off centre, nobody has judged — no shift declared, no reason in the file',
    source: 'docs/audit/findings-optical.md:59-62 and :283-293 (§2: 154 off centre, 44 with a stated reason, 110 not); recomputed by optical-probe.mjs classifyOffcentre',
    question: 'Each is described (a keyline edge held, a part standing proud, grid rounding) but nobody has said it reads right. Does it, in a row?',
    perView, notes,
    summary: { offCentre: classed.length, anchored: pop.length - classed.length, stated: classed.length - unjudged.length, unjudged: unjudged.length },
  };
}

/** Eye questions in the card documents that this page can host, and how. Typed from the documents; the lists above
 *  carry their own questions. */
export const HOSTED = [
  { source: 'docs/audit/findings-mass.md:482-511', question: 'F10 — twenty at 16, squinted, still distinct?', how: 'rows of twenty, names hidden, Squint; Sort by squint peak; highlight the seed pairs. Two of §6\'s modes are not built: "twenty random", and flagged names listed "with the nearest neighbour" — the Flag list and the seed partners in the panel stand in for them' },
  { source: 'docs/audit/findings-mass.md:466 (M-2)', question: 'Do marks and objects read as two weights?', how: 'highlight Marks, sort by ink mass' },
  { source: 'docs/audit/findings-mass.md:472 (M-5), :518; findings-filled.md:675', question: 'Is the filled row uneven, and may a filled drawing be lighter than its outline (globe-2-filled at 0.71× its outline at 16)?', how: 'Style: Both, sorted by ink mass' },
  { source: 'docs/audit/findings-mass.md:474 (M-6)', question: 'x-small, minus-small, plus-small, x and grid-4 gain most ink at 16 — do they read heavy?', how: 'View 16 against 24 forced to 16, sorted by ink mass' },
  { source: 'docs/audit/exceptions-ledger.md:770-773', question: 'F2 — does the 20 × 18 box, and each split family, read as one size?', how: 'highlight the folder box or the split families, Sort: highlighted list first' },
  { source: 'docs/audit/findings-families.md:579-581 (E-1, E-3)', question: 'Container smalls and same-tag pairs side by side', how: 'Sort: family, or highlighted list first' },
  { source: 'docs/audit/findings-families.md:580 (E-2)', question: 'Does user-4 read as the same family as user … user-3?', how: 'Sort: family (the figures page is the named surface)' },
  { source: 'docs/audit/references-field.md:430-437', question: 'Does the set read generic; one hand; sameness at a squint?', how: 'the whole set, Outline and Filled, Squint, Sort: family — the reference rows are lab/character.html\'s' },
  { source: 'docs/audit/references-field.md:443; findings-grid.md:371-375', question: 'Crispness at 1×: do the softest outlines read stair-stepped?', how: 'Pixels: 1×, view 16' },
  { source: 'docs/audit/findings-optical.md:608, :611-613', question: 'Mass-lopsided objects; watch-2, volume-off and alert-triangle placement', how: 'highlight Mass-lopsided or Off centre; the moves themselves belong to the optical sheet' },
  { source: 'docs/audit/references-nucleo.md:508; findings-scaling.md:256', question: 'Do the 20 and 16 shed enough detail?', how: 'highlight Detail shed, views 24 · 20 · 16' },
];

/** Every name a list carries must exist in the set; a list typed from a document that names a missing concept is
 *  a typing slip or a stale document, and the tool refuses it rather than ship an empty highlight. */
export function checkListNames(lists, names) {
  const have = new Set(names), missing = [];
  for (const l of lists) {
    const groups = [...(l.groups ?? []), ...Object.values(l.byStyle ?? {}).flat(), ...Object.values(l.perView ?? {}).flat()];
    for (const g of groups) for (const n of g) if (!have.has(n)) missing.push(`${l.id}: ${n}`);
  }
  return missing;
}

// ── the whole file ──────────────────────────────────────────────────────────────────────────────────────

/** A set read from a pin directory: `{ files: Map('24/plus' → { text }), names }` (families.mjs's shape). */
export function loadPin(pin) {
  const texts = {};
  for (const m of MASTERS) {
    const d = join(pin, 'src/icons', String(m));
    if (!existsSync(d)) throw new Error(`${d}: no such directory — is ${pin} a built pin?`);
    for (const f of readdirSync(d).filter((x) => x.endsWith('.svg'))) texts[`${m}/${f.slice(0, -4)}`] = readFileSync(join(d, f), 'utf8');
  }
  return setFromTexts(texts, { pin });
}

/** Measures every file of `set` and assembles the JSON the page reads. */
export function buildWall(set, { commit = PIN, generated = new Date().toISOString().slice(0, 10), command, optional, progress, typed = TYPED_LISTS } = {}) {
  const rows = {};
  let done = 0;
  for (const n of set.names) {
    rows[n] = { outline: {}, filled: {} };
    for (const style of STYLES) for (const m of MASTERS) {
      const key = `${m}/${n}${style === 'filled' ? '-filled' : ''}`;
      const f = set.files.get(key);
      if (!f) { rows[n][style][String(m)] = null; continue; }
      rows[n][style][String(m)] = measureFile(f.text, { label: key, px16: m === 24 });
      if (progress) progress(++done);
    }
  }
  // Kind is read from the outline file and holds for both styles (card 1.5 §1).
  for (const n of set.names) for (const m of MASTERS) {
    const k = rows[n].outline[String(m)]?.kind;
    if (rows[n].filled[String(m)] && k) rows[n].filled[String(m)].kind = k;
  }
  const medians = {};
  for (const style of STYLES) for (const m of MASTERS) {
    const vals = set.names.map((n) => rows[n][style][String(m)]?.ink).filter((v) => v != null);
    const med = median(vals);
    medians[`${m}/${style}`] = med;
    for (const n of set.names) { const r = rows[n][style][String(m)]; if (r) r.band = bandOf(r.ink, med); }
  }
  const lists = [...typed, ...computedLists(set, rows, { optional })];
  const missing = checkListNames(lists, set.names);
  if (missing.length) throw new Error(`lists name concepts the pin does not have:\n  ${missing.join('\n  ')}`);

  const out = (r, withSq16) => (r ? {
    ink: r2(r.ink), share: r5(r.share), squint: r3(r.squint), strokes: r.strokes, paths: r.paths, kind: r.kind, band: r.band, hash: r.hash,
    ...(withSq16 ? { squint16: r3(r.squint16) } : {}),
  } : null);
  const families = new Map();
  for (const n of set.names) { const f = foldGrammar(n, { unfoldCircles: true }); if (!families.has(f)) families.set(f, []); families.get(f).push(n); }
  const wall = {
    card: '4.1',
    about: 'Data for lab/audit-wall.html. Every number is taken on the pinned tree, not the live set.',
    pin: { commit, concepts: set.names.length, files: set.files.size, fingerprint: fnv1a(set.names.flatMap((n) => MASTERS.flatMap((m) => STYLES.map((s) => rows[n][s][String(m)]?.hash ?? '-'))).join('')) },
    generator: command ?? 'node tools/audit/wall-data.mjs <pin-dir>',
    pinCommand: `git archive ${commit} | tar -x -C <pin-dir> && (cd <pin-dir> && node tools/build.mjs)`,
    generated,
    rate: RATE, sigma: SIGMA,
    definitions: DEFINITIONS,
    hosted: HOSTED,
    views: VIEWS,
    bands: BAND_EDGES.map(([name, edge]) => ({ name, below: Number.isFinite(edge) ? edge : null })),
    medians: Object.fromEntries(Object.entries(medians).map(([k, v]) => [k, r2(v)])),
    families: Object.fromEntries([...families].sort((a, b) => sortStr(a[0], b[0]))),
    lists,
    concepts: set.names.map((n) => ({
      name: n,
      family: foldGrammar(n, { unfoldCircles: true }),
      outline: Object.fromEntries(MASTERS.map((m) => [String(m), out(rows[n].outline[String(m)], m === 24)])),
      filled: Object.fromEntries(MASTERS.map((m) => [String(m), out(rows[n].filled[String(m)], m === 24)])),
    })),
  };
  // The unrounded measurements ride along for `checkAgainstMass`, out of the JSON (not enumerable).
  Object.defineProperty(wall, 'raw', { value: rows, enumerable: false });
  return wall;
}

export const DEFINITIONS = {
  ink: 'Ink: the inked area at the master\'s own size, in pixels (one unit = one pixel). Exact geometry, supersampled at rate 32, through card 1.5\'s bypass (docs/audit/findings-mass.md §1, §1.1).',
  share: 'Ink mass: ink ÷ canvas² — how dark the icon is in a row. Not ink ÷ its own box, which ranks a minus the densest icon in the set (card 1.5 M-7). Render size does not change it, so "24 at 16 px" sorts by the 24 master\'s share.',
  squint: 'Squint peak: the darkest patch after a σ 1.5 px blur of the drawing at the size shown (0 = no ink, 1 = solid). Card 1.5\'s construct at the 16 master (§2.4); at 20, 24 and 24-at-16 it is the same recipe at that size, measured by this tool.',
  strokes: 'Stroke count: subpaths — every M in the path data starts one — over all the file\'s paths. Card 1.4\'s "detail count" (docs/audit/findings-scaling.md:256). A cut-out in a filled drawing counts as one.',
  paths: 'Paths: the number of <path> elements in the file.',
  family: 'Family: card 1.10\'s partition (tools/audit/families.mjs): size and number taken off, the four directions of arrow and chevron folded, plus/minus/x-circle kept apart from their marks — 128 stems.',
  kind: 'Kind: from the outline file\'s note, as card 1.5 reads it — keyline: mark → mark; box: → box; anchor: → anchor; else silhouette.',
  band: 'Band: card 1.5\'s, ink as a multiple of its row\'s median (that master and style): Hairline < 0.5 · Light < 0.75 · Level < 1.25 · Full < 1.5 · Dense ≥ 1.5.',
};

// ── holding a run to card 1.5's appendix A ──────────────────────────────────────────────────────────────

const BAND_ABBR = { Hairline: 'H', Light: 'L', Level: 'Lv', Full: 'F', Dense: 'D' };
/** Parses card 1.5's appendix A and compares every row with `wall`: shares to 1 dp of a percent, px² to 1 dp, bands,
 *  squint to 2 dp. Returns `{ rows, columns: { name: { agree, differ: [...] } } }`. */
export function checkAgainstMass(docText, wall) {
  const by = new Map(wall.concepts.map((c) => [c.name, c]));
  const cols = ['O24', 'O20', 'O16', 'O16px', 'F24', 'F20', 'F16', 'F16px', 'bandO16', 'bandF16', 'squintO16', 'squintF16', 'kind'];
  const res = Object.fromEntries(cols.map((c) => [c, { agree: 0, differ: [] }]));
  let rows = 0;
  const a = docText.indexOf('## Appendix A'), b = docText.indexOf('## Appendix B');
  const section = a >= 0 ? docText.slice(a, b > a ? b : undefined) : docText;
  const raw = wall.raw;
  for (const line of section.split('\n')) {
    const m = line.match(/^\| `([^`]+)` \| (\w+) \|(.*)\|\s*$/);
    if (!m) continue;
    const c = by.get(m[1]);
    if (!c) continue;
    rows++;
    const cells = m[3].split('|').map((s) => s.trim());
    // Unrounded where the run kept them, so a figure is rounded once, as the card rounded it.
    const R = raw?.[c.name] ?? c;
    const pct = (r) => (r.share * 100).toFixed(1), px = (r) => r.ink.toFixed(1);
    const mine = {
      O24: pct(R.outline['24']), O20: pct(R.outline['20']), O16: pct(R.outline['16']), O16px: px(R.outline['16']),
      F24: pct(R.filled['24']), F20: pct(R.filled['20']), F16: pct(R.filled['16']), F16px: px(R.filled['16']),
      bandO16: BAND_ABBR[R.outline['16'].band], bandF16: BAND_ABBR[R.filled['16'].band],
      squintO16: R.outline['16'].squint.toFixed(2), squintF16: R.filled['16'].squint.toFixed(2), kind: c.outline['16'].kind,
    };
    const theirs = {
      O24: cells[0], O20: cells[1], O16: cells[2], O16px: cells[3], F24: cells[4], F20: cells[5], F16: cells[6], F16px: cells[7],
      bandO16: cells[9], bandF16: cells[10], squintO16: cells[11], squintF16: cells[12], kind: m[2],
    };
    // A printed difference is a TIE when the unrounded value sits within a hair of the half-way point between the two
    // printed figures — the same number rounded the other way: within 0.01 of one unit of the last printed place.
    const rawOf = {
      O24: R.outline['24'].share * 100, O20: R.outline['20'].share * 100, O16: R.outline['16'].share * 100, O16px: R.outline['16'].ink,
      F24: R.filled['24'].share * 100, F20: R.filled['20'].share * 100, F16: R.filled['16'].share * 100, F16px: R.filled['16'].ink,
      squintO16: R.outline['16'].squint, squintF16: R.filled['16'].squint,
    };
    for (const k of cols) {
      if (mine[k] === theirs[k]) { res[k].agree++; continue; }
      const t = Number(theirs[k]), mm = Number(mine[k]), dp = (theirs[k].split('.')[1] ?? '').length;
      const tie = k in rawOf && Number.isFinite(t) && Math.abs(t - mm) <= 10 ** -dp + 1e-9 && Math.abs(rawOf[k] - (t + mm) / 2) <= 0.01 * 10 ** -dp;
      (tie ? (res[k].ties ??= []) : res[k].differ).push(`${c.name}: card 1.5 ${theirs[k]} · here ${mine[k]}${k in rawOf ? ` (unrounded ${rawOf[k].toFixed(dp + 3)})` : ''}`);
    }
  }
  return { rows, columns: res };
}

// ── command line ────────────────────────────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');

async function main(argv) {
  const args = { pin: null, out: join(REPO, 'lab/audit-data/wall.json'), check: null, commit: PIN };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = resolve(argv[++i]);
    else if (a === '--check') args.check = resolve(argv[++i]);
    else if (a === '--commit') args.commit = argv[++i];
    else if (!args.pin) args.pin = resolve(a);
    else throw new Error(`unexpected argument ${a}`);
  }
  if (!args.pin) { console.error('usage: node tools/audit/wall-data.mjs <pin-dir> [--out file] [--check docs/audit/findings-mass.md] [--commit sha]'); process.exit(2); }
  if (existsSync(join(args.pin, '.git'))) throw new Error(`${args.pin} holds a .git — point this at an archived pin, not a working tree`);
  const set = loadPin(args.pin);
  const total = set.files.size;
  const t0 = Date.now();
  if (!existsSync(join(args.pin, 'dist/icons.json'))) throw new Error(`${args.pin}/dist/icons.json is missing — build the pin first (node tools/build.mjs inside it)`);
  const offcentre = await offcentreList(args.pin);
  const wall = buildWall(set, {
    commit: args.commit,
    optional: { offcentre },
    command: `node tools/audit/wall-data.mjs <pin-dir>${args.out === join(REPO, 'lab/audit-data/wall.json') ? '' : ' --out <file>'}`,
    progress: (k) => { if (k % 250 === 0 || k === total) process.stderr.write(`\r  measured ${k} of ${total} files`); },
  });
  process.stderr.write(`  (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, `${JSON.stringify(wall)}\n`);

  // What a reader can hold against the documents.
  const c = (n) => wall.concepts.find((x) => x.name === n);
  const bandCount = (style, m) => Object.fromEntries(BAND_EDGES.map(([b]) => [b, wall.concepts.filter((x) => x[style][m]?.band === b).length]));
  const kinds = (m) => Object.fromEntries(['mark', 'silhouette', 'box', 'anchor'].map((k) => [k, wall.concepts.filter((x) => x.outline[m]?.kind === k).length]));
  const totals = (style) => MASTERS.map((m) => wall.concepts.reduce((s, x) => s + (x[style][String(m)]?.strokes ?? 0), 0));
  const list = (id) => wall.lists.find((l) => l.id === id);
  console.log(`wrote ${args.out} — ${wall.pin.concepts} concepts, ${wall.pin.files} files, pin ${wall.pin.commit}, fingerprint ${wall.pin.fingerprint}`);
  console.log('reproduces (document → this run):');
  console.log(`  16 outline lightest minus-small 12.17 px² → ${c('minus-small').outline['16'].ink}; heaviest globe-2 102.15 → ${c('globe-2').outline['16'].ink}   (findings-mass.md:99-100)`);
  console.log(`  16 filled heaviest message-3 163.90 px² → ${c('message-3').filled['16'].ink}; 24 archive-filled 245.58 (bypass) → ${c('archive').filled['24'].ink}   (findings-mass.md:96, :76)`);
  console.log(`  help, 24 master shown at 16 px: 51.39 px² → ${r2(c('help').outline['24'].share * 256)}   (findings-mass.md:49)`);
  console.log(`  row medians px²: 16 outline 48.8 · 16 filled 75.2 · 24 outline 91.3 · 20 outline 68.8 → ${wall.medians['16/outline']} · ${wall.medians['16/filled']} · ${wall.medians['24/outline']} · ${wall.medians['20/outline']}   (findings-mass.md:136-141)`);
  for (const [style, m, doc] of [['outline', '16', '53 · 58 · 262 · 95 · 17'], ['filled', '16', '56 · 86 · 184 · 51 · 108'], ['outline', '24', '73 · 50 · 253 · 87 · 22'], ['filled', '24', '112 · 66 · 140 · 67 · 100']]) {
    console.log(`  bands ${m} ${style} H·L·Lv·F·D ${doc} → ${Object.values(bandCount(style, m)).join(' · ')}   (findings-mass.md:136-141)`);
  }
  console.log(`  kinds at 24 mark·silhouette·box·anchor 136 · 287 · 57 · 5 → ${Object.values(kinds('24')).join(' · ')}; at 16 136 · 288 · 56 · 5 → ${Object.values(kinds('16')).join(' · ')}   (findings-mass.md:170-199)`);
  console.log(`  subpaths, outline 24 → 20 → 16: 1,409 → 1,375 → 1,352 → ${totals('outline').join(' → ')}; filled 1,419 → 1,387 → 1,363 → ${totals('filled').join(' → ')}   (findings-scaling.md:270-273)`);
  const s = list('identical').summary;
  console.log(`  same drawing, two names: 14 sets · 43 groups · 98 files → ${s.sets} · ${s.groups} · ${s.files}   (findings-mass.md:517)`);
  console.log(`  same-tag pairs: 14 → ${list('same-tags').groups.length}   (findings-families.md:581)`);
  console.log(`  container families with a -small: 6 → ${list('container-smalls').groups.length}   (findings-families.md:579)`);
  console.log(`  families (card 1.10's partition): 128 stems → ${Object.keys(wall.families).length}   (findings-families.md:88)`);
  const sh = list('shed').summary, oc = list('offcentre').summary;
  console.log(`  detail shed between masters: 30 shed · 2 gain → ${sh.shed} · ${sh.gain}   (findings-scaling.md:256-268)`);
  console.log(`  off centre with shift [0,0]: 154 · stated reason 44 · nobody has judged 110 → ${oc.offCentre} · ${oc.stated} · ${oc.unjudged}   (findings-optical.md:59-61)`);

  if (args.check) {
    const r = checkAgainstMass(readFileSync(args.check, 'utf8'), wall);
    console.log(`card 1.5 appendix A, ${r.rows} rows held to this run:`);
    for (const [k, v] of Object.entries(r.columns)) {
      console.log(`  ${k.padEnd(10)} ${v.agree} agree${v.ties?.length ? ` · ${v.ties.length} rounding ties (${v.ties.join('; ')})` : ''}${v.differ.length ? ` · ${v.differ.length} DIFFER: ${v.differ.join('; ')}` : ''}`);
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack ?? e); process.exit(1); });
}
