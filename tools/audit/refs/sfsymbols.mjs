#!/usr/bin/env node
// tools/audit/refs/sfsymbols.mjs — SF Symbols reference extractor (plan card 0.3).
//
// WHAT IT DOES.  Pulls glyph outlines out of the SF Symbols app's own font
// (SFSymbolsFallback.otf, a one-axis variable font: weight 1–1000, three weight
// MASTERS at wght 1 · 400 · 1000, nine named weights between them, and three scale
// glyphs — small, medium, large — stored per symbol) and writes the same normalised
// record nucleo.mjs writes, under research/references/sfsymbols/. It also reads the
// app's own metadata (base_symbols_map.json: Apple's base → derivative grammar, as data)
// and the 26 loose template .svg files (the three drawn masters, with their guides).
//
// SF Symbols is the closest structural analogue to our own system anywhere: three
// hand-drawn masters, and everything between them DERIVED. `derive` measures how.
//
// LICENSING.  Apple's artwork. Everything this writes goes under research/references/
// (gitignored: internal comparison only, never commit or ship); the writer refuses any
// other destination. Nothing here may be copied into src/icons/.
//
// EVERY MEASUREMENT IS RECORDED TWICE: as a share of its own canvas and as a multiple of
// its own stroke (nucleo.mjs dual()). A glyph has no stroke property — the weight IS the
// stroke — so the stroke used is the ring thickness of the circle glyph (U+100000) at
// that weight and scale: measured from the font, not assumed (`weights`).
//
// WHAT A SYMBOL'S NAME IS NOT: the font stores no symbol names in a readable table (the
// Apple-specific tables syls / symp / syot are opaque). Glyphs are keyed by code point
// (U+100000 and up). `names` recovers the link by rendering every name with AppKit and
// matching the bitmap to the font's glyphs; each match carries a confidence. The sample
// below uses code points, and its names were checked by eye on a contact sheet.
//
//   node tools/audit/refs/sfsymbols.mjs                      extract the default sample
//   node tools/audit/refs/sfsymbols.mjs extract --cps 0x100000,0x10017c --weights all
//   node tools/audit/refs/sfsymbols.mjs derive 0x10004c      are the weights drawn, or derived?
//   node tools/audit/refs/sfsymbols.mjs weights              the stroke each weight actually has
//   node tools/audit/refs/sfsymbols.mjs basemap              the shape of Apple's modifier grammar
//   node tools/audit/refs/sfsymbols.mjs templates            the 26 loose .svg templates
//   node tools/audit/refs/sfsymbols.mjs names                resolve symbol names to code points
//   node tools/audit/refs/sfsymbols.mjs --help

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  REPO, REF_ROOT, SCHEMA, r, assertDual, formatPath, normalisePath, bboxOf, measure, writeJson,
  assertInRefRoot, isMain, parseArgs, csv, parseXml, recordToSvg,
} from './nucleo.mjs';

const APP = '/Applications/SF Symbols.app/Contents';
export const FONT = `${APP}/Resources/Fonts/SFSymbolsFallback.otf`;
const META_DIR = `${APP}/Resources/Metadata`;
const RES_DIR = `${APP}/Resources`;
const COREGLYPHS = '/System/Library/CoreServices/CoreGlyphs.bundle/Contents/Resources';
const OUT_DIR = path.join(REF_ROOT, 'sfsymbols');
export const REFERENCE_RING = 0x100000;       // `circle`: the glyph whose ring thickness defines "the stroke" at each weight

// ═══════════════════════════════════════════════════════════════════════════
// python3 + fontTools (the only way to read a CFF2 variable font here)
// ═══════════════════════════════════════════════════════════════════════════

function py(code, payload, maxBuffer = 1 << 30) {
  const run = spawnSync('python3', ['-W', 'ignore', '-c', code], { input: JSON.stringify(payload ?? {}), encoding: 'utf8', maxBuffer });
  if (run.status !== 0) throw new Error(`python3 failed: ${(run.stderr || '').split('\n').filter(Boolean).slice(-6).join(' | ')}`);
  return JSON.parse(run.stdout);
}

const PY_FONT = String.raw`
import sys, json
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
job = json.load(sys.stdin)
f = TTFont(job['font'])
cm = f.getBestCmap()
fv = f['fvar']
vs = f['CFF2'].cff.topDictIndex[0].VarStore.otVarStore
os2 = f['OS/2']
meta = {
  'upem': f['head'].unitsPerEm, 'capHeight': os2.sCapHeight, 'xHeight': os2.sxHeight,
  'ascender': f['hhea'].ascent, 'descender': f['hhea'].descent, 'numGlyphs': f['maxp'].numGlyphs,
  'axes': [{'tag': a.axisTag, 'min': a.minValue, 'default': a.defaultValue, 'max': a.maxValue} for a in fv.axes],
  'instances': [{'name': f['name'].getDebugName(i.subfamilyNameID), 'coords': dict(i.coordinates)} for i in fv.instances],
  'regions': [[[a.StartCoord, a.PeakCoord, a.EndCoord] for a in reg.VarRegionAxis] for reg in vs.VarRegionList.Region],
  'puaSymbols': sum(1 for k in cm if k >= 0x100000),
  'avar': 'avar' in f, 'opaqueTables': [t for t in ('syls', 'symp', 'syot') if t in f],
}
if job['mode'] == 'meta':
    print(json.dumps(meta)); sys.exit(0)
def flat(value):
    out = []
    for op, args in value:
        if op == 'moveTo': out.append(['M', args[0][0], args[0][1]])
        elif op == 'lineTo': out.append(['L', args[0][0], args[0][1]])
        elif op == 'curveTo' and len(args) == 3: out.append(['C'] + [v for p in args for v in p])
        elif op == 'qCurveTo' and len(args) == 2: out.append(['Q'] + [v for p in args for v in p])
        elif op == 'closePath': out.append(['Z'])
        elif op == 'endPath': pass
        else: raise ValueError('unsupported pen op ' + op + ' with ' + str(len(args)) + ' points')
    return out
sets = {}
out = []
for cp in job['cps']:
    base = cm.get(cp)
    if base is None:
        out.append({'cp': cp, 'missing': True}); continue
    stem = base.rsplit('.', 1)[0]
    for sc in job['scales']:
        gname = stem + '.' + sc
        for w in job['weights']:
            key = repr(w['wght'])
            gs = sets.get(key)
            if gs is None:
                gs = sets[key] = f.getGlyphSet(location={'wght': w['wght']})
            if gname not in gs:
                out.append({'cp': cp, 'glyph': gname, 'scale': sc, 'weight': w['name'], 'wght': w['wght'], 'missing': True}); continue
            g = gs[gname]
            pen = RecordingPen(); g.draw(pen)
            out.append({'cp': cp, 'glyph': gname, 'scale': sc, 'weight': w['name'], 'wght': w['wght'], 'advance': g.width, 'ops': flat(pen.value)})
print(json.dumps({'meta': meta, 'glyphs': out}))
`;

const PY_VERIFY = String.raw`
import sys, json, warnings
warnings.filterwarnings('ignore')
import numpy as np
import skia
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
job = json.load(sys.stdin)
f = TTFont(job['font']); cm = f.getBestCmap()
sets = {}
def render(svg, W, H, scale):
    data = skia.Data.MakeWithCopy(svg.encode('utf8'))          # MemoryStream(bytes) does not copy: keep the Data alive
    dom = skia.SVGDOM.MakeFromStream(skia.MemoryStream(data))
    dom.setContainerSize(skia.Size(W, H))
    surf = skia.Surface(int(W * scale), int(H * scale))
    c = surf.getCanvas(); c.clear(skia.ColorWHITE); c.scale(scale, scale)
    dom.render(c)
    return surf.makeImageSnapshot().toarray()[:, :, :3].astype(float).mean(axis=2)
out = []
for it in job['items']:
    key = repr(it['wght'])
    gs = sets.get(key) or sets.setdefault(key, f.getGlyphSet(location={'wght': it['wght']}))
    g = gs[it['glyph']]
    pen = SVGPathPen(gs); g.draw(pen)
    bp = BoundsPen(gs); g.draw(bp)
    W, H, y0 = it['canvas'][0], it['canvas'][1], it['y0']
    # straight from the font: y flipped into the record frame by a transform, not by arithmetic on the numbers
    ref = '<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="0 0 %s %s"><g transform="matrix(1 0 0 -1 0 %s)"><path d="%s" fill="#000"/></g></svg>' % (W, H, W, H, y0, pen.getCommands())
    scale = 0.25
    A = render(ref, W, H, scale); B = render(it['svg'], W, H, scale)
    ink = float((A < 200).sum()); diff = float((np.abs(A - B) > 64).sum())
    b = bp.bounds
    out.append({'id': it['id'], 'ink_px': ink, 'differing_px': diff,
                'bounds_font': [b[0], y0 - b[3], b[2], y0 - b[1]], 'advance': g.width})
print(json.dumps(out))
`;

const PY_PLISTS = String.raw`
import sys, json, plistlib
job = json.load(sys.stdin)
def load(fn):
    with open(fn, 'rb') as fh: return plistlib.load(fh)
order = load(job['coreglyphs'] + '/symbol_order.plist')
app = load(job['meta'] + '/name_availability.plist')['symbols']
sysn = load(job['coreglyphs'] + '/name_availability.plist')['symbols']
info = load(job['app'] + '/Info.plist')
ver = load(job['app'] + '/version.plist')
names = list(order) + sorted((set(app) | set(sysn)) - set(order))
print(json.dumps({'names': names, 'inOrder': len(order), 'appNames': len(app), 'sysNames': len(sysn),
  'appVersion': info.get('CFBundleShortVersionString'), 'appBuild': info.get('CFBundleVersion'), 'coreGlyphsVersion': ver.get('CFBundleShortVersionString')}))
`;

// name → code point, by shape. Renders are cropped to their ink box and compared after a
// small blur (so a half-pixel of edge does not decide a match); aspect ratio is penalised.
const PY_MATCH = String.raw`
import sys, os, json, warnings
warnings.filterwarnings('ignore')
import numpy as np
np.seterr(all='ignore')
import skia
from PIL import Image
from scipy.ndimage import gaussian_filter
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
job = json.load(sys.stdin)
N, FIT, SIGMA = 64, 58, 1.2
def rasterise(ops, b):
    x0, y0, x1, y1 = b
    s = FIT / max(x1 - x0, y1 - y0)
    surf = skia.Surface(N, N); c = surf.getCanvas(); c.clear(skia.ColorTRANSPARENT)
    p = skia.Path()
    for op, args in ops:
        if op == 'moveTo': p.moveTo(*args[0])
        elif op == 'lineTo': p.lineTo(*args[0])
        elif op == 'curveTo': p.cubicTo(*args[0], *args[1], *args[2])
        elif op == 'qCurveTo': p.quadTo(*args[0], *args[1])
        elif op == 'closePath': p.close()
    p.setFillType(skia.PathFillType.kWinding)
    m = skia.Matrix(); m.setScale(s, -s); m.postTranslate(N / 2 - s * (x0 + x1) / 2, N / 2 + s * (y0 + y1) / 2)
    p.transform(m)
    c.drawPath(p, skia.Paint(AntiAlias=True, Color=skia.ColorBLACK))
    return surf.makeImageSnapshot().toarray()[:, :, 3].astype(np.float64) / 255.0
def from_png(fn):
    a = np.array(Image.open(fn).convert('RGBA'))[:, :, 3]
    ys, xs = np.where(a > 24)
    if len(xs) == 0: return None, None
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    crop = Image.fromarray(a[y0:y1, x0:x1]); w, h = crop.size
    s = FIT / max(w, h); nw, nh = max(1, round(w * s)), max(1, round(h * s))
    crop = crop.resize((nw, nh), Image.LANCZOS)
    out = Image.new('L', (N, N), 0); out.paste(crop, ((N - nw) // 2, (N - nh) // 2))
    return np.array(out, dtype=np.float64) / 255.0, w / h
f = TTFont(job['font']); cm = f.getBestCmap(); gs = f.getGlyphSet(location={'wght': 400})
cps = sorted(k for k in cm if k >= 0x100000)
G = np.zeros((len(cps), N * N)); GA = np.zeros(len(cps))
for i, cp in enumerate(cps):
    g = gs[cm[cp]]; rp = RecordingPen(); g.draw(rp); bp = BoundsPen(gs); g.draw(bp)
    if bp.bounds is None: continue
    G[i] = gaussian_filter(rasterise(rp.value, bp.bounds), SIGMA).ravel()
    GA[i] = (bp.bounds[2] - bp.bounds[0]) / max(1e-9, (bp.bounds[3] - bp.bounds[1]))
names = job['names']
P = np.zeros((len(names), N * N)); PA = np.zeros(len(names)); ok = np.zeros(len(names), bool)
for i, n in enumerate(names):
    fn = os.path.join(job['pngs'], n + '.png')
    if not os.path.exists(fn): continue
    a, asp = from_png(fn)
    if a is None: continue
    P[i] = gaussian_filter(a, SIGMA).ravel(); PA[i] = asp; ok[i] = True
Pn = P / np.maximum(np.linalg.norm(P, axis=1, keepdims=True), 1e-12)
Gn = G / np.maximum(np.linalg.norm(G, axis=1, keepdims=True), 1e-12)
res = {}
for lo in range(0, len(names), 400):
    S = Pn[lo:lo + 400] @ Gn.T
    for k in range(S.shape[0]):
        i = lo + k
        if not ok[i]: continue
        score = S[k] - 0.5 * np.abs(np.log((GA + 1e-9) / (PA[i] + 1e-9)))
        top = np.argsort(-score)[:8]
        best = float(score[top[0]])
        ties = [int(cps[j]) for j in top if score[j] >= best - 5e-4]
        rest = [float(score[j]) for j in top if score[j] < best - 5e-4]
        nxt = max(rest) if rest else None
        res[names[i]] = {'cp': min(ties), 'score': round(best, 4), 'ties': sorted(ties), 'nextDistinct': None if nxt is None else round(nxt, 4)}
print(json.dumps({'matches': res, 'glyphs': len(cps), 'rendered': int(ok.sum())}))
`;

// AppKit renders each name at 100 pt, regular, medium — the same weight and scale as the font's default glyphs.
const SWIFT_RENDER = String.raw`
import AppKit
import Foundation
let args = CommandLine.arguments
let outDir = args[1]
let names = try! String(contentsOfFile: args[2], encoding: .utf8).split(separator: "\n").map(String.init)
let S = 256
var ok = 0, miss = 0
var missing: [String] = []
for n in names {
    guard let base = NSImage(systemSymbolName: n, accessibilityDescription: nil) else { miss += 1; missing.append(n); continue }
    let cfg = NSImage.SymbolConfiguration(pointSize: 100, weight: .regular, scale: .medium)
    guard let img = base.withSymbolConfiguration(cfg) else { miss += 1; missing.append(n); continue }
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: S, pixelsHigh: S, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSColor.clear.set(); NSRect(x: 0, y: 0, width: S, height: S).fill()
    let tinted = img.copy() as! NSImage
    tinted.lockFocus(); NSColor.black.set(); NSRect(origin: .zero, size: tinted.size).fill(using: .sourceAtop); tinted.unlockFocus()
    let sz = img.size
    tinted.draw(in: NSRect(x: (CGFloat(S) - sz.width) / 2, y: (CGFloat(S) - sz.height) / 2, width: sz.width, height: sz.height))
    NSGraphicsContext.restoreGraphicsState()
    try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: outDir + "/" + n + ".png"))
    ok += 1
}
print("rendered \(ok) missing \(miss)")
if !missing.isEmpty { try! missing.joined(separator: "\n").write(toFile: outDir + "/_missing.txt", atomically: true, encoding: .utf8) }
`;

// ═══════════════════════════════════════════════════════════════════════════
// font facts, weights and scales
// ═══════════════════════════════════════════════════════════════════════════

let FONT_META = null;
export function fontMeta() {
  if (!FONT_META) FONT_META = py(PY_FONT, { mode: 'meta', font: FONT });
  return FONT_META;
}

/** The nine named weights, read from the font's fvar (not recalled), plus the axis minimum (the drawn Ultralight master). */
export function namedWeights() {
  const m = fontMeta();
  const w = m.instances.map((i) => ({ name: i.name.toLowerCase(), wght: i.coords.wght }));
  return w;
}
export const SCALES = ['small', 'medium', 'large'];

/** weights spec → [{name, wght}]. 'masters' = the three drawn masters; 'all' = nine named + the axis-min master; numbers allowed. */
export function resolveWeights(spec) {
  const named = namedWeights();
  const ax = fontMeta().axes[0];
  const master = { name: 'wght-min', wght: ax.min }, regular = named.find((x) => x.name === 'regular'), black = { name: 'black', wght: ax.max };
  if (!spec || spec === 'masters') return [master, { name: 'regular', wght: ax.default }, black];
  if (spec === 'all') return [master, ...named];
  if (spec === 'named') return named;
  return csv(spec).map((s) => {
    const hit = named.find((x) => x.name === s.toLowerCase());
    if (hit) return hit;
    if (s === 'wght-min') return master;
    const n = Number(s.replace(/^wght=?/, ''));
    if (!Number.isFinite(n)) throw new Error(`unknown weight "${s}" (use ${named.map((x) => x.name).join(', ')}, wght-min, masters, all, or a number)`);
    return { name: `wght${n}`, wght: n };
  });
}
export const resolveScales = (spec) => (!spec || spec === 'all' ? SCALES : csv(spec));

/** Fetch outlines. Returns glyph objects with ops in FONT units, y up. */
export function glyphs(cps, weights, scales) {
  const out = [];
  for (let i = 0; i < cps.length; i += 150) {
    const res = py(PY_FONT, { mode: 'glyphs', font: FONT, cps: cps.slice(i, i + 150), weights, scales });
    out.push(...res.glyphs);
  }
  return out;
}

/** y-up font ops → y-down segments in the record's frame (origin top-left of the em box, centred on capHeight/2). */
function toSegs(ops, y0) {
  return ops.map((o) => (o[0] === 'Z' ? ['Z'] : [o[0], ...o.slice(1).map((v, i) => (i % 2 ? y0 - v : v))]));
}
const frameY0 = () => fontMeta().capHeight / 2 + fontMeta().upem / 2;

// ── the stroke each weight really has: ring thickness of the circle glyph ──
const STROKE_CACHE = new Map();
function ringThickness(ops) {
  // two contours; outer and inner bbox → (ΔW + ΔH) / 4
  const contours = [];
  let cur = null;
  for (const o of ops) {
    if (o[0] === 'M') { cur = [o]; contours.push(cur); } else if (cur) cur.push(o);
  }
  const boxes = contours.map((c) => bboxOf(c)).filter(Boolean).sort((a, b) => (b.x1 - b.x0) - (a.x1 - a.x0));
  if (boxes.length < 2) return null;
  const [o, i] = boxes;
  return ((o.x1 - o.x0) - (i.x1 - i.x0)) / 4 + ((o.y1 - o.y0) - (i.y1 - i.y0)) / 4;
}
export function strokeOf(wght, scale) {
  const key = `${wght}|${scale}`;
  if (!STROKE_CACHE.has(key)) {
    const g = glyphs([REFERENCE_RING], [{ name: 'ring', wght }], [scale])[0];
    STROKE_CACHE.set(key, ringThickness(g.ops));
  }
  return STROKE_CACHE.get(key);
}

// ═══════════════════════════════════════════════════════════════════════════
// records
// ═══════════════════════════════════════════════════════════════════════════

const hex = (cp) => `U+${cp.toString(16).toUpperCase()}`;
const parseCp = (s) => Number(String(s).replace(/^U\+/i, '0x'));

function loadNames() {
  const f = path.join(OUT_DIR, 'names.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

/** outline / filled from the name grammar (a `fill` token), as Apple's own base → derivative map spells it. null when the name is unknown. */
const styleOfName = (name) => (/^uni[0-9A-F]{4,6}$/.test(name) ? null : /(^|\.)fill(\.|$)/.test(name) ? 'filled' : 'outline');

export function glyphRecord(g, sym) {
  const m = fontMeta();
  const y0 = frameY0();
  const segs = toSegs(g.ops, y0);
  const stroke = strokeOf(g.wght, g.scale);
  const contours = g.ops.filter((o) => o[0] === 'M').length;
  const name = sym?.name || `uni${g.cp.toString(16).toUpperCase()}`;
  const set = `${g.weight}/${g.scale}`;
  const rec = {
    schema: SCHEMA,
    source: 'sfsymbols',
    page: null,
    family: 'SF Symbols',
    set,
    group: set,
    name,
    aliases: [],
    id: `sfsymbols:${hex(g.cp)}:${g.weight}:${g.scale}`,
    variant: { weight: g.weight, wght: g.wght, scale: g.scale },
    style: styleOfName(name),
    master: g.scale,
    grid: g.scale,
    canvas: [r(g.advance, 3), m.upem],                    // [advance width at this weight and scale, em]
    strokeWidth: 0,                                        // an outlined glyph has no stroke property: see strokeBasis
    strokeCap: null,
    strokeJoin: null,
    strokeBasis: { value: r(stroke, 3), from: `calibration:${hex(REFERENCE_RING)} circle ring at wght ${g.wght}, ${g.scale}` },
    paths: [{
      d: formatPath(segs, 3), prim: 'glyph', paint: 'fill', fill: '#000', winding: 'NONZERO', stroke: null, role: 'primary', contours,
    }],
    meta: {
      units: 'font units (2048 per em); y down; origin = top-left of the em box, which is centred on capHeight/2 (so a symbol centred on the cap-height midline is centred in the box)',
      sf: {
        cp: g.cp, u: hex(g.cp), glyph: g.glyph, scale: g.scale, wght: g.wght, weight: g.weight, advance: g.advance,
        upem: m.upem, capHeight: m.capHeight, frameY0: y0, contours,
        nameSource: sym?.name ? (sym.source || 'given') : 'none (the font stores no names)',
        ...(sym?.confidence ? { nameConfidence: sym.confidence, nameScore: sym.score, nameTies: sym.ties?.map(hex) } : {}),
      },
      inkBasis: 'path bbox (exact: curves by derivative roots)',
      canvasNote: 'large-scale glyphs are taller than the em box, so their margins are negative; that is the font, not an error',
    },
  };
  rec.measure = measure(rec);
  const bad = assertDual(rec.measure);
  if (bad.length) throw new Error(`measure not dual: ${bad.join(', ')}`);
  return rec;
}

/** The bounded wave-0 sample: the plus family (base, circle, square) + circle + heart, at the three drawn masters × all three scales. */
export const SAMPLE = {
  symbols: [
    { cp: 0x100000, name: 'circle' }, { cp: 0x10017c, name: 'plus' }, { cp: 0x10004c, name: 'plus.circle' },
    { cp: 0x1000dc, name: 'plus.square' }, { cp: 0x1002b4, name: 'heart' },
  ].map((s) => ({ ...s, source: 'checked by eye on a contact sheet + shape-matched (names)' })),
  weights: 'masters',
  scales: 'all',
};

export function extract({ symbols, weights, scales }) {
  const ws = Array.isArray(weights) ? weights : resolveWeights(weights);
  const sc = Array.isArray(scales) ? scales : resolveScales(scales);
  const bySym = new Map(symbols.map((s) => [s.cp, s]));
  const raw = glyphs(symbols.map((s) => s.cp), ws, sc);
  const records = [];
  for (const g of raw) {
    if (g.missing) { records.push({ schema: SCHEMA, source: 'sfsymbols', id: `sfsymbols:${hex(g.cp)}`, error: `no glyph ${g.glyph || ''}` }); continue; }
    try { records.push(glyphRecord(g, bySym.get(g.cp))); } catch (e) { records.push({ schema: SCHEMA, source: 'sfsymbols', id: `sfsymbols:${hex(g.cp)}:${g.weight}:${g.scale}`, error: String(e.message) }); }
  }
  return records;
}

// ═══════════════════════════════════════════════════════════════════════════
// verify — the extracted records against the font itself
// ═══════════════════════════════════════════════════════════════════════════
// For every record: (1) the glyph is drawn straight from the font with a y-flip TRANSFORM
// (no arithmetic on the numbers) and the record's own SVG is drawn from the extracted
// `d`; the two bitmaps are compared. (2) The record's ink box is compared with fontTools'
// BoundsPen for the same glyph at the same weight. (3) The advance in the record's
// canvas is the font's advance at that weight.
export function verifyRecords(records) {
  const y0 = frameY0();
  const items = records.filter((x) => !x.error).map((x) => ({
    id: x.id, glyph: x.meta.sf.glyph, wght: x.meta.sf.wght, canvas: x.canvas, y0, svg: recordToSvg(x),
  }));
  const res = py(PY_VERIFY, { font: FONT, items });
  const rows = res.map((v, i) => {
    const rec = records.filter((x) => !x.error)[i];
    const b = bboxOf(normalisePath(rec.paths[0].d));
    const bf = v.bounds_font;
    const dev = Math.max(Math.abs(b.x0 - bf[0]), Math.abs(b.y0 - bf[1]), Math.abs(b.x1 - bf[2]), Math.abs(b.y1 - bf[3]));
    return { id: v.id, pixelsDiffer: v.differing_px, ink: v.ink_px, boundsDeviation: r(dev, 4), advanceMatches: Math.abs(rec.canvas[0] - v.advance) < 0.002 };
  });
  return rows;
}

// ═══════════════════════════════════════════════════════════════════════════
// weights — the stroke each weight really has
// ═══════════════════════════════════════════════════════════════════════════

/** Thickness of the bars of the `plus` glyph (U+10017C): a second, independent reading of the weight's stroke. */
function plusBarThickness(ops) {
  const b = bboxOf(ops);
  const cx = (b.x0 + b.x1) / 2;
  const xs = ops.filter((o) => o[0] === 'M' || o[0] === 'L').map((o) => o[1]).concat(ops.filter((o) => o[0] === 'C').map((o) => o[5]));
  const near = xs.map((x) => Math.abs(x - cx)).filter((d) => d > 0.5).sort((a, c) => a - c);
  return near.length ? near[0] * 2 : null;
}

export function weightsTable() {
  const m = fontMeta();
  const ax = m.axes[0];
  const ws = resolveWeights('all');
  const rows = [];
  for (const w of ws) {
    const n = w.wght >= ax.default ? (w.wght - ax.default) / (ax.max - ax.default) : (w.wght - ax.default) / (ax.default - ax.min);
    const row = { weight: w.name, wght: w.wght, normalised: r(n, 4) };
    for (const sc of SCALES) {
      const ring = strokeOf(w.wght, sc);
      const plus = plusBarThickness(glyphs([0x10017c], [w], [sc])[0].ops);
      row[sc] = { ring: r(ring, 2), plusBar: plus == null ? null : r(plus, 2), ringOfEm: r(ring / m.upem, 5) };
    }
    rows.push(row);
  }
  return { upem: m.upem, axis: ax, masters: m.regions, rows };
}

// The nine weights also ship as nine STATIC fonts (SF-Pro-Text-<Weight>.otf, installed with the SF fonts).
// They are Apple's own per-weight cut of the same symbols — the independent witness for "derived".
const PY_STATIC = String.raw`
import sys, json, os, warnings
warnings.filterwarnings('ignore')
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
job = json.load(sys.stdin)
vf = TTFont(job['font']); vcm = vf.getBestCmap()
def flat(gs, name):
    rp = RecordingPen(); gs[name].draw(rp)
    pts = []; sig = []
    for op, args in rp.value:
        sig.append(op[0])
        for a in args: pts.extend(a)
    return pts, ''.join(sig), gs[name].width
out = []
for w in job['weights']:
    fn = job['dir'] + '/SF-Pro-Text-' + w['name'].capitalize() + '.otf'
    if not os.path.exists(fn):
        out.append({'weight': w['name'], 'status': 'font missing'}); continue
    st = TTFont(fn); scm = st.getBestCmap(); sgs = st.getGlyphSet(); vgs = vf.getGlyphSet(location={'wght': w['wght']})
    diffs = []; struct = 0; absent = 0; advdiff = 0
    for cp in job['cps']:
        g = scm.get(cp)
        if g is None: absent += 1; continue
        a, sa, wa = flat(vgs, vcm[cp]); b, sb, wb = flat(sgs, g)
        if sa != sb or len(a) != len(b): struct += 1; continue
        diffs.append(max(abs(x - y) for x, y in zip(a, b)))
        advdiff = max(advdiff, abs(wa - wb))
    diffs.sort()
    n = len(diffs)
    out.append({'weight': w['name'], 'status': 'ok', 'comparedPointForPoint': n, 'withinOneUnit': sum(1 for d in diffs if d <= 1), 'withinTwoUnits': sum(1 for d in diffs if d <= 2),
                'overTwoUnits': sum(1 for d in diffs if d > 2), 'medianDifference': round(diffs[n // 2], 3) if n else None,
                'differentPointStructure': struct, 'absentFromStaticFont': absent, 'maxAdvanceDifference': round(advdiff, 3)})
print(json.dumps(out))
`;

export function staticCheck(cps) {
  const dir = '/Library/Fonts';
  if (!fs.existsSync(`${dir}/SF-Pro-Text-Regular.otf`)) return null;
  const named = namedWeights();
  return py(PY_STATIC, { font: FONT, dir, cps, weights: named });
}

// ═══════════════════════════════════════════════════════════════════════════
// derive — are the nine weights drawn, or derived?
// ═══════════════════════════════════════════════════════════════════════════

const flatten = (ops) => ops.flatMap((o) => o.slice(1));
const sig = (ops) => ops.map((o) => o[0]).join('');
const maxDiff = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) d = Math.max(d, Math.abs(a[i] - b[i])); return d; };

function lsq(Pa, Pb) {   // corresponding flat coordinate arrays [x0,y0,x1,y1,…] → best uniform scale+translation of B onto A, and a non-uniform one
  const n = Pa.length / 2;
  const mean = (P, k) => { let s = 0; for (let i = k; i < P.length; i += 2) s += P[i]; return s / n; };
  const [max, may, mbx, mby] = [mean(Pa, 0), mean(Pa, 1), mean(Pb, 0), mean(Pb, 1)];
  let num = 0, den = 0, nx = 0, dx = 0, ny = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const ax = Pa[2 * i] - max, ay = Pa[2 * i + 1] - may, bx = Pb[2 * i] - mbx, by = Pb[2 * i + 1] - mby;
    num += ax * bx + ay * by; den += bx * bx + by * by; nx += ax * bx; dx += bx * bx; ny += ay * by; dy += by * by;
  }
  const s = num / den, tx = max - s * mbx, ty = may - s * mby;
  const sx = nx / dx, sy = ny / dy;
  let uni = 0, non = 0;
  for (let i = 0; i < n; i++) {
    uni = Math.max(uni, Math.hypot(s * Pb[2 * i] + tx - Pa[2 * i], s * Pb[2 * i + 1] + ty - Pa[2 * i + 1]));
    non = Math.max(non, Math.hypot(sx * (Pb[2 * i] - mbx) + max - Pa[2 * i], sy * (Pb[2 * i + 1] - mby) + may - Pa[2 * i + 1]));
  }
  return { s, uniformResidual: uni, sx, sy, nonUniformResidual: non };
}

export function derive(cp, rawAll = null) {
  const m = fontMeta();
  const ax = m.axes[0];
  const ws = resolveWeights('all');                 // wght-min + nine named
  const raw = rawAll ? rawAll.filter((g) => g.cp === cp) : glyphs([cp], ws, SCALES);
  const get = (w, sc) => raw.find((g) => g.weight === w && g.scale === sc);
  const res = { cp: hex(cp), upem: m.upem, masters: { 'wght-min': ax.min, regular: ax.default, black: ax.max } };

  // 1. structure: do all 30 outlines have the same pen sequence (point-for-point compatible)?
  const sigs = new Set(raw.map((g) => sig(g.ops)));
  res.sameStructure = { distinctSequences: sigs.size, outlines: raw.length, contours: raw[0].ops.filter((o) => o[0] === 'M').length, segments: raw[0].ops.length };

  // 2. are any two of the 27 (9 weights x 3 scales) the same outline?
  const nine = ws.filter((w) => w.name !== 'wght-min');
  const keys = []; const vecs = [];
  for (const sc of SCALES) for (const w of nine) { keys.push(`${w.name}/${sc}`); vecs.push(flatten(get(w.name, sc).ops)); }
  const identical = [];
  let minPair = Infinity, minPairKey = null;
  for (let i = 0; i < vecs.length; i++) for (let j = i + 1; j < vecs.length; j++) {
    const d = maxDiff(vecs[i], vecs[j]);
    if (d < 1e-6) identical.push(`${keys[i]} = ${keys[j]}`);
    if (d < minPair) { minPair = d; minPairKey = `${keys[i]} vs ${keys[j]}`; }
  }
  res.distinct = { outlines: vecs.length, identicalPairs: identical, closestPair: { pair: minPairKey, maxCoordinateDifference: r(minPair, 3) } };

  // the 3x3 the brief asks about: three scales x three weights (ultralight/regular/black)
  const trio = ['ultralight', 'regular', 'black'];
  const grid = [];
  for (const sc of SCALES) for (const w of trio) grid.push({ k: `${w}/${sc}`, v: flatten(get(w, sc).ops) });
  let minTrio = Infinity;
  for (let i = 0; i < grid.length; i++) for (let j = i + 1; j < grid.length; j++) minTrio = Math.min(minTrio, maxDiff(grid[i].v, grid[j].v));
  res.nine = { outlines: grid.map((x) => x.k), identicalPairs: grid.flatMap((a, i) => grid.slice(i + 1).filter((b) => maxDiff(a.v, b.v) < 1e-6).map((b) => `${a.k} = ${b.k}`)), closestPairMaxDiff: r(minTrio, 3) };

  // 3. weights are interpolations between the three masters? predict each weight from regular + the master on its side
  const interp = [];
  for (const sc of SCALES) {
    const P0 = flatten(get('regular', sc).ops), Pmin = flatten(get('wght-min', sc).ops), Pmax = flatten(get('black', sc).ops);
    for (const w of nine) {
      if (w.name === 'regular') continue;
      const t = w.wght > ax.default ? (w.wght - ax.default) / (ax.max - ax.default) : (ax.default - w.wght) / (ax.default - ax.min);
      const Pm = w.wght > ax.default ? Pmax : Pmin;
      const P = flatten(get(w.name, sc).ops);
      const pred = P0.map((v, i) => v + t * (Pm[i] - v));
      interp.push({ scale: sc, weight: w.name, wght: w.wght, t: r(t, 4), maxResidual: r(maxDiff(P, pred), 4), maxDeparture: r(maxDiff(P, P0), 2) });
    }
  }
  res.interpolation = { rows: interp, worstResidual: Math.max(...interp.map((x) => x.maxResidual)), unit: 'font units' };

  // 4. scale glyphs: is each a uniform scaling of the one below? and does the stroke scale with it?
  const scaleRows = [];
  for (const w of ['wght-min', 'regular', 'black']) {
    for (const [a, b] of [['small', 'medium'], ['medium', 'large']]) {
      const A = flatten(get(w, a).ops), B = flatten(get(w, b).ops);
      const fit = lsq(B, A);                         // map the smaller onto the larger
      const strokeRatio = strokeOf(ws.find((x) => x.name === w).wght, b) / strokeOf(ws.find((x) => x.name === w).wght, a);
      scaleRows.push({ weight: w, from: a, to: b, shapeScale: r(fit.s, 4), strokeRatio: r(strokeRatio, 4), uniformResidual: r(fit.uniformResidual, 2), nonUniformSx: r(fit.sx, 4), nonUniformSy: r(fit.sy, 4), nonUniformResidual: r(fit.nonUniformResidual, 2) });
    }
  }
  res.scales = scaleRows;
  res.staticFonts = rawAll ? undefined : staticCheck([cp]);          // Apple's own per-weight cuts (medium scale only)
  return res;
}

/** derive() over many symbols at once (one font read): do the conclusions hold beyond one symbol? */
export function deriveSweep(n) {
  const all = py(String.raw`
import sys, json
from fontTools.ttLib import TTFont
cm = TTFont(json.load(sys.stdin)['font']).getBestCmap()
print(json.dumps(sorted(k for k in cm if k >= 0x100000)))`, { font: FONT });
  const step = Math.max(1, Math.floor(all.length / n));
  const cps = all.filter((_, i) => i % step === 0).slice(0, n);
  const ws = resolveWeights('all');
  const raw = glyphs(cps, ws, SCALES);
  const rows = cps.map((cp) => derive(cp, raw));
  const statics = staticCheck(cps);
  const med = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
  const sc = (w, a, b, k) => rows.map((x) => x.scales.find((y) => y.weight === w && y.from === a && y.to === b)[k]);
  return {
    symbols: rows.length, spread: `every ${step}th code point of ${all.length}`,
    withIdenticalOutlinePair: rows.filter((x) => x.distinct.identicalPairs.length).length,
    withIdenticalPairInThe3x3: rows.filter((x) => x.nine.identicalPairs.length).length,
    pensIncompatible: rows.filter((x) => x.sameStructure.distinctSequences > 1).length,
    staticFonts: statics,
    worstInterpolationResidual: Math.max(...rows.map((x) => x.interpolation.worstResidual)),
    closestPairMaxDiff: { min: Math.min(...rows.map((x) => x.distinct.closestPair.maxCoordinateDifference)), median: med(rows.map((x) => x.distinct.closestPair.maxCoordinateDifference)) },
    scale: ['wght-min', 'regular', 'black'].flatMap((w) => [['small', 'medium'], ['medium', 'large']].map(([a, b]) => ({
      weight: w, from: a, to: b, medianShapeScale: r(med(sc(w, a, b, 'shapeScale')), 4), medianStrokeRatio: r(med(sc(w, a, b, 'strokeRatio')), 4),
      medianUniformResidual: r(med(sc(w, a, b, 'uniformResidual')), 2), medianNonUniformResidual: r(med(sc(w, a, b, 'nonUniformResidual')), 2),
    }))),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// basemap — Apple's modifier grammar, published as data
// ═══════════════════════════════════════════════════════════════════════════

export function baseMap() {
  const M = JSON.parse(fs.readFileSync(path.join(META_DIR, 'base_symbols_map.json'), 'utf8'));
  const bases = Object.keys(M);
  const ders = bases.flatMap((b) => M[b].map((d) => ({ base: b, name: d })));
  const sizes = {};
  for (const b of bases) sizes[M[b].length] = (sizes[M[b].length] || 0) + 1;
  const fam = bases.map((b) => [b, M[b].length]).sort((a, c) => c[1] - a[1] || a[0].localeCompare(c[0]));
  const baseSet = new Set(bases), derSet = new Set(ders.map((d) => d.name));
  const suffix = {}, token = {}, odd = [];
  for (const d of ders) {
    if (d.name.startsWith(d.base + '.')) {
      const s = d.name.slice(d.base.length + 1);
      suffix[s] = (suffix[s] || 0) + 1;
      for (const t of s.split('.')) token[t] = (token[t] || 0) + 1;
    } else odd.push(d);
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const depth = {};
  for (const b of bases) { const k = b.split('.').length; depth[k] = (depth[k] || 0) + 1; }
  return {
    source: path.join(META_DIR, 'base_symbols_map.json'),
    bases: bases.length, derivatives: ders.length, distinctDerivatives: derSet.size,
    derivativesPerBase: { mean: r(ders.length / bases.length, 3), max: fam[0][1], histogram: sizes },
    singletonBases: sizes[1] || 0,
    largestFamilies: fam.slice(0, 15),
    derivativeAlsoABase: [...derSet].filter((x) => baseSet.has(x)).length,
    derivativeUnderTwoBases: ders.length - derSet.size,
    startWithBaseDot: ders.length - odd.length,
    notStartingWithBase: odd,
    topSuffixes: top(suffix, 25),
    topModifierTokens: top(token, 25),
    distinctSuffixes: Object.keys(suffix).length,
    distinctTokens: Object.keys(token).length,
    baseNameDepth: depth,
    map: M,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// templates — the 26 loose .svg files: three drawn masters and their guides
// ═══════════════════════════════════════════════════════════════════════════

export function templates() {
  const files = fs.readdirSync(RES_DIR).filter((f) => f.endsWith('.svg')).sort();
  const m = fontMeta();
  const recs = [], summary = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(RES_DIR, file), 'utf8');
    const tree = parseXml(text.replace(/<!DOCTYPE[^>]*>/, ''));
    const svg = tree.children.find((c) => c.name === 'svg');
    const find = (n, id) => { for (const c of n.children) { if (c.attrs.id === id) return c; const h = find(c, id); if (h) return h; } return null; };
    const symbols = find(svg, 'Symbols'), guides = find(svg, 'Guides');
    const writer = text.match(/template writer version: "(\d+)"/)?.[1] ?? null;
    const font = text.match(/font version: "([^"]*)"/)?.[1] ?? null;
    const generated = text.match(/Generated from ([\w.]+)/)?.[1] ?? null;
    const ver = text.match(/Template v\.([\d.]+)/)?.[1] ?? null;
    const lines = {};
    const walkLines = (n) => { for (const c of n.children) { if (c.name === 'line' && c.attrs.id) lines[c.attrs.id] = c.attrs; else walkLines(c); } };
    if (guides) walkLines(guides);
    const num = (v) => Number(v);
    const masters = [];
    for (const g of symbols?.children ?? []) {
      const mm = /^(\w+)-([SML])$/.exec(g.attrs.id || '');
      if (!mm) continue;
      const tm = /matrix\(1 0 0 1 ([\d.-]+) ([\d.-]+)\)/.exec(g.attrs.transform || '');
      const tx = num(tm[1]), ty = num(tm[2]);
      const left = lines[`left-margin-${g.attrs.id}`] ? num(lines[`left-margin-${g.attrs.id}`].x1) - tx : null;
      const right = lines[`right-margin-${g.attrs.id}`] ? num(lines[`right-margin-${g.attrs.id}`].x1) - tx : null;
      const base = lines[`Baseline-${mm[2]}`] ? num(lines[`Baseline-${mm[2]}`].y1) : ty;
      const cap = lines[`Capline-${mm[2]}`] ? num(lines[`Capline-${mm[2]}`].y1) : null;
      masters.push({ id: g.attrs.id, master: mm[1], scale: mm[2], tx, ty, left, right, baseline: base, capline: cap, layers: g.children.filter((c) => c.name === 'path') });
    }
    for (const mm of masters) {
      // template units are points at 100 pt: 1 unit = em/100. y is down from the baseline, so a point's y above the baseline is negative.
      const unit = m.upem / 100;
      const em = 100;
      const y0 = m.capHeight / 2 / unit + em / 2;           // same frame as the font records: top of the em box, centred on capHeight/2
      const advance = mm.right != null && mm.left != null ? mm.right - mm.left : null;
      const paths = mm.layers.map((p) => {
        const cls = p.attrs.class || '';
        const kind = /monochrome-0/.test(cls) ? 'clear-behind' : /monochrome-2/.test(cls) ? 'clear-behind (inner)' : 'ink';
        const d = p.attrs.d;
        const segs = normaliseTemplate(d, mm.left ?? 0, y0);
        return { d: formatPath(segs, 4), prim: 'path', paint: 'fill', fill: kind === 'ink' ? '#000' : '#fff', winding: 'NONZERO', stroke: null, role: kind === 'ink' ? 'primary' : 'clear-behind', opacity: kind === 'ink' ? 1 : 0, cls };
      });
      const wght = { Ultralight: m.axes[0].min, Regular: m.axes[0].default, Black: m.axes[0].max }[mm.master];
      const strokeFont = wght == null ? null : strokeOf(wght, mm.scale === 'S' ? 'small' : mm.scale === 'M' ? 'medium' : 'large');
      const stroke = strokeFont == null ? null : strokeFont / unit;
      const setName = 'template masters (Resources/*.svg)';
      const rec = {
        schema: SCHEMA, source: 'sfsymbols', page: null, family: 'SF Symbols', set: setName, group: setName, name: file.replace(/\.svg$/, ''), aliases: [],
        id: `sfsymbols:template:${file.replace(/\.svg$/, '')}:${mm.id}`, variant: { master: mm.master, scale: mm.scale }, style: null, master: mm.id, grid: mm.scale,
        canvas: [advance == null ? null : r(advance, 4), em], strokeWidth: 0, strokeCap: null, strokeJoin: null,
        strokeBasis: { value: stroke == null ? null : r(stroke, 4), from: 'calibration:font circle ring at this master, in template units (1 unit = em/100)' },
        paths,
        meta: {
          units: 'template units = points at 100 pt (em = 100); y down; origin = top-left of the em box centred on capHeight/2',
          template: { file, writerVersion: writer, fontVersion: font, templateVersion: ver, generatedFrom: generated, pointSize: 100, master: mm.id,
            guides: { baseline: 0, capline: mm.capline == null ? null : r(mm.baseline - mm.capline, 3), leftMargin: 0, rightMargin: advance == null ? null : r(advance, 4) },
            layers: mm.layers.map((p) => p.attrs.class) },
        },
      };
      if (advance != null) { rec.measure = measure(rec); const bad = assertDual(rec.measure); if (bad.length) throw new Error(bad.join(', ')); }
      recs.push(rec);
    }
    summary.push({ file, writer, font, templateVersion: ver, masters: masters.map((x) => x.id).join(' '), layers: masters[0]?.layers.length ?? 0 });
  }
  return { records: recs, summary };
}

/** template path data (y down from the baseline, x from the master's own origin) → segments in the record frame */
function normaliseTemplate(d, leftMargin, y0) {
  const segs = normalisePath(d);
  return segs.map((s) => (s[0] === 'Z' ? s : s[0] === 'A' ? s : [s[0], ...s.slice(1).map((v, i) => (i % 2 ? y0 + v : v - leftMargin))]));
}
// ═══════════════════════════════════════════════════════════════════════════
// names — symbol name → code point, by shape
// ═══════════════════════════════════════════════════════════════════════════

export function resolveNames({ limit } = {}) {
  const lists = py(PY_PLISTS, { coreglyphs: COREGLYPHS, meta: META_DIR, app: APP });
  const names = limit ? lists.names.slice(0, limit) : lists.names;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sfsymbols-names-'));
  try {
    fs.writeFileSync(path.join(tmp, 'names.txt'), names.join('\n'));
    fs.writeFileSync(path.join(tmp, 'render.swift'), SWIFT_RENDER);
    fs.mkdirSync(path.join(tmp, 'png'));
    const sw = spawnSync('swift', [path.join(tmp, 'render.swift'), path.join(tmp, 'png'), path.join(tmp, 'names.txt')], { encoding: 'utf8', maxBuffer: 1 << 26 });
    if (sw.status !== 0) throw new Error(`swift render failed (needs Xcode command line tools): ${(sw.stderr || '').split('\n').slice(-4).join(' | ')}`);
    const missing = fs.existsSync(path.join(tmp, 'png', '_missing.txt')) ? fs.readFileSync(path.join(tmp, 'png', '_missing.txt'), 'utf8').split('\n').filter(Boolean) : [];
    const mt = py(PY_MATCH, { font: FONT, names, pngs: path.join(tmp, 'png') });
    const out = {};
    for (const [n, v] of Object.entries(mt.matches)) {
      let conf = 'doubtful';
      const gap = v.nextDistinct == null ? 1 : v.score - v.nextDistinct;
      if (v.score >= 0.97 && gap >= 0.03) conf = v.ties.length > 1 ? 'tied' : 'sure';
      else if (v.score >= 0.95) conf = 'likely';
      out[n] = { cp: v.cp, score: v.score, ties: v.ties, gap: r(gap, 4), confidence: conf };
    }
    const byCp = new Map();
    for (const [n, v] of Object.entries(out)) for (const c of v.ties) (byCp.get(c) || byCp.set(c, []).get(c)).push(n);
    const counts = {};
    for (const v of Object.values(out)) counts[v.confidence] = (counts[v.confidence] || 0) + 1;
    return {
      generatedAt: new Date().toISOString(), method: 'AppKit NSImage(systemSymbolName:) at 100 pt regular medium → ink-cropped, 64 px, blurred → cosine vs every font glyph at wght 400 medium, aspect-penalised',
      appVersion: lists.appVersion, coreGlyphsVersion: lists.coreGlyphsVersion, namesTried: names.length, unrenderable: missing.length, glyphsInFont: mt.glyphs,
      confidenceCounts: counts, unrenderableNames: missing.slice(0, 50),
      note: 'ties = code points whose outline is identical at the matching resolution (localised / hierarchical variants of one drawing); cp is the lowest. Geometry is certain for sure and tied; the LABEL is ambiguous for tied.',
      names: out,
    };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════

const HELP = `sfsymbols.mjs — SF Symbols reference extractor (writes only under research/references/sfsymbols/)

  extract [--sample | --cps 0x100000,U+10017C | --names plus,heart.fill | --range 0x100000-0x100040 | --all]
          [--weights masters|all|named|ultralight,regular,black|400] [--scales all|small,medium] [--limit N]
          [--run NAME] [--shard N (records per file, default 2000)] [--dry]
      → <out>/<run>.json   normalised records (default run: sample)
  verify [--cps …]          the records against the font itself (pixels, ink box, advance)
  derive <cp|name> | --sweep N   drawn or derived? 27 outlines of one symbol (or N symbols): identical pairs, interpolation law, scale law
  weights                   the stroke each weight really has (ring + plus-bar readings), per scale
  basemap                   shape of base_symbols_map.json, the modifier grammar as counts
  templates                 the loose Resources/*.svg templates → masters + guides as records
  names [--limit N]         resolve every symbol name to a code point (needs swift; ~1 min) → names.json
  --help`;

function pickSymbols(o) {
  const names = loadNames();
  const syms = [];
  const add = (cp, name, extra) => syms.push({ cp, name: name || undefined, ...extra });
  if (o.cps) csv(o.cps).forEach((s) => add(parseCp(s)));
  if (o.range) { const [a, b] = o.range.split('-').map(parseCp); for (let c = a; c <= b; c++) add(c); }
  if (o.names) {
    if (!names) throw new Error('--names needs research/references/sfsymbols/names.json: run `names` first');
    for (const n of csv(o.names)) {
      const hit = names.names[n];
      if (!hit) throw new Error(`name not resolved: ${n}`);
      if (hit.confidence === 'doubtful' && !o['allow-doubtful']) throw new Error(`${n}: only a doubtful shape match (score ${hit.score}); look at it, then pass --allow-doubtful`);
      add(hit.cp, n, { source: 'names.json', confidence: hit.confidence, score: hit.score, ties: hit.ties });
    }
  }
  return labelSymbols(syms);
}

/** Give unnamed code points the name names.json resolved for them (anything but `doubtful`; the confidence travels in meta.sf), if it exists. */
function labelSymbols(syms) {
  const names = loadNames();
  if (!names) return syms;
  const rev = new Map();
  for (const [n, v] of Object.entries(names.names)) {
    if (v.confidence === 'doubtful') continue;
    if (!rev.has(v.cp) || n.length < rev.get(v.cp).name.length) rev.set(v.cp, { name: n, ...v });
  }
  for (const s of syms) if (!s.name && rev.has(s.cp)) { const v = rev.get(s.cp); s.name = v.name; s.source = 'names.json'; s.confidence = v.confidence; s.score = v.score; s.ties = v.ties; }
  return syms;
}

export async function main(argv) {
  const sub = ['extract', 'derive', 'weights', 'basemap', 'templates', 'names', 'verify'].includes(argv[0]) ? argv.shift() : 'extract';
  const o = parseArgs(argv, new Set(['cps', 'names', 'range', 'weights', 'scales', 'limit', 'run', 'out', 'shard', 'sweep']));
  if (o.help) return console.log(HELP);
  const outDir = assertInRefRoot(o.out || OUT_DIR);
  const rel = (f) => path.relative(REPO, f);

  if (sub === 'weights') {
    const t = weightsTable();
    writeJson(path.join(outDir, 'weights.json'), t);
    console.log(`upem ${t.upem}; weight axis ${t.axis.min}–${t.axis.max} (default ${t.axis.default}); weight masters (variation-store peaks) at ${JSON.stringify(t.masters.map((x) => x[0][1]))} in normalised coordinates`);
    console.table(t.rows.map((x) => ({ weight: x.weight, wght: x.wght, n: x.normalised, 'ring S': x.small.ring, 'ring M': x.medium.ring, 'ring L': x.large.ring, 'plus bar M': x.medium.plusBar, 'ring M % em': r(x.medium.ringOfEm * 100, 2) })));
    return console.log(`→ ${rel(path.join(outDir, 'weights.json'))}`);
  }

  if (sub === 'basemap') {
    const b = baseMap();
    writeJson(path.join(outDir, 'basemap.json'), b);
    console.log(`${b.bases} base symbols · ${b.derivatives} derivatives (${b.distinctDerivatives} distinct) · ${b.derivativesPerBase.mean} per base on average, ${b.derivativesPerBase.max} at most · ${b.singletonBases} bases (${r((b.singletonBases / b.bases) * 100, 1)}%) have exactly one derivative`);
    console.log(`a derivative is also a base: ${b.derivativeAlsoABase} · a derivative sits under two bases: ${b.derivativeUnderTwoBases} · name starts "<base>.": ${b.startWithBaseDot} of ${b.derivatives} (${r((b.startWithBaseDot / b.derivatives) * 100, 1)}%) · distinct suffixes ${b.distinctSuffixes}, distinct modifier tokens ${b.distinctTokens}`);
    console.log('derivatives per base (family size → bases):', JSON.stringify(b.derivativesPerBase.histogram));
    console.log('largest families:', b.largestFamilies.map(([n, k]) => `${n} ${k}`).join(' · '));
    console.log('commonest suffixes:', b.topSuffixes.slice(0, 14).map(([n, k]) => `.${n} ${k}`).join(' · '));
    console.log('commonest modifier tokens:', b.topModifierTokens.slice(0, 16).map(([n, k]) => `${n} ${k}`).join(' · '));
    console.log(`${b.notStartingWithBase.length} derivatives do not start with their base's name (a modifier lands INSIDE the name), e.g.`, b.notStartingWithBase.slice(0, 4).map((x) => `${x.base} → ${x.name}`).join(' ; '));
    return console.log(`→ ${rel(path.join(outDir, 'basemap.json'))}`);
  }

  if (sub === 'templates') {
    const t = templates();
    writeJson(path.join(outDir, 'templates.json'), { schema: SCHEMA, source: 'sfsymbols', generatedAt: new Date().toISOString(), records: t.records, summary: t.summary });
    console.table(t.summary);
    return console.log(`${t.records.length} master records from ${t.summary.length} files → ${rel(path.join(outDir, 'templates.json'))}`);
  }

  if (sub === 'names') {
    const n = resolveNames({ limit: o.limit ? Number(o.limit) : undefined });
    writeJson(path.join(outDir, 'names.json'), n);
    console.log(`${n.namesTried} names tried · ${n.unrenderable} not renderable · ${n.glyphsInFont} glyphs in font · confidence`, n.confidenceCounts);
    return console.log(`→ ${rel(path.join(outDir, 'names.json'))}`);
  }

  if (sub === 'verify') {
    const names = loadNames();
    let symbols = SAMPLE.symbols;
    if (o.cps) symbols = csv(o.cps).map((c) => ({ cp: parseCp(c) }));
    const ws = o.weights || (o.cps ? 'all' : SAMPLE.weights), sc = o.scales || 'all';
    const records = extract({ symbols, weights: ws, scales: sc });
    const rows = verifyRecords(records);
    const bad = rows.filter((x) => x.pixelsDiffer > 0 || x.boundsDeviation > 0.01 || !x.advanceMatches);
    console.log(`${rows.length} drawings · pixels differing: ${rows.filter((x) => x.pixelsDiffer > 0).length} drawings (worst ${Math.max(...rows.map((x) => x.pixelsDiffer))} px of ${Math.max(...rows.map((x) => x.ink))}) · worst ink-box deviation vs fontTools BoundsPen ${Math.max(...rows.map((x) => x.boundsDeviation))} font units · advance mismatches ${rows.filter((x) => !x.advanceMatches).length}`);
    bad.slice(0, 10).forEach((x) => console.log('  CHECK', JSON.stringify(x)));
    return;
  }

  if (sub === 'derive' && o.sweep) {
    const sw = deriveSweep(Number(o.sweep));
    writeJson(path.join(outDir, `derive-sweep-${sw.symbols}.json`), sw);
    console.log(`${sw.symbols} symbols (${sw.spread}): pen sequences incompatible in ${sw.pensIncompatible} · symbols with two identical outlines among the 27: ${sw.withIdenticalOutlinePair} · in the 3×3: ${sw.withIdenticalPairInThe3x3} · worst interpolation residual ${sw.worstInterpolationResidual} font units · closest pair of outlines differs by ≥ ${sw.closestPairMaxDiff.min} (median ${sw.closestPairMaxDiff.median}) units`);
    console.table(sw.scale);
    if (sw.staticFonts) { console.log('versus Apple\'s nine static SF-Pro-Text-<Weight>.otf fonts (medium scale, same symbols):'); console.table(sw.staticFonts); }
    return console.log(`→ ${rel(path.join(outDir, `derive-sweep-${sw.symbols}.json`))}`);
  }
  if (sub === 'derive') {
    const names = loadNames();
    const arg = o._[0];
    if (!arg) return console.error('derive <code point | name>');
    const cp = /^(0x|U\+)/i.test(arg) ? parseCp(arg) : names?.names[arg]?.cp;
    if (cp == null) return console.error(`cannot resolve ${arg} (use a code point like 0x10004c, or run \`names\` first)`);
    const d = derive(cp);
    writeJson(path.join(outDir, `derive-${hex(cp)}.json`), d);
    console.log(`${d.cp}: ${d.sameStructure.outlines} outlines (wght-min + 9 named weights × 3 scales) share ${d.sameStructure.distinctSequences} pen sequence(s): ${d.sameStructure.contours} contours, ${d.sameStructure.segments} segments`);
    console.log(`27 outlines (9 weights × 3 scales): identical pairs = ${d.distinct.identicalPairs.length}; closest pair ${d.distinct.closestPair.pair} differs by ≤ ${d.distinct.closestPair.maxCoordinateDifference} font units`);
    console.log(`3×3 (ultralight/regular/black × small/medium/large): identical pairs = ${d.nine.identicalPairs.length}; closest pair differs by ${d.nine.closestPairMaxDiff} units`);
    console.log(`weights as interpolation of the masters (regular → wght-min / black): worst residual ${d.interpolation.worstResidual} units over ${d.interpolation.rows.length} outlines`);
    console.table(d.interpolation.rows.filter((x) => x.scale === 'medium'));
    console.table(d.scales);
    if (d.staticFonts) console.table(d.staticFonts);
    return console.log(`→ ${rel(path.join(outDir, `derive-${hex(cp)}.json`))}`);
  }

  // extract
  let symbols;
  if (o.all) {
    const cpAll = py(String.raw`
import sys, json
from fontTools.ttLib import TTFont
cm = TTFont(json.load(sys.stdin)['font']).getBestCmap()
print(json.dumps(sorted(k for k in cm if k >= 0x100000)))`, { font: FONT });
    symbols = labelSymbols(cpAll.map((cp) => ({ cp })));
  } else if (o.cps || o.names || o.range) symbols = pickSymbols(o);
  else symbols = SAMPLE.symbols;
  if (o.limit) symbols = symbols.slice(0, Number(o.limit));
  const sample = !(o.cps || o.names || o.range || o.all);
  const weights = o.weights || (sample ? SAMPLE.weights : 'masters');
  const scales = o.scales || (sample ? SAMPLE.scales : 'all');
  const per = resolveWeights(weights).length * resolveScales(scales).length;      // drawings per symbol
  const run = o.run || (o.all ? 'all' : sample ? 'sample' : 'selection');
  const total = symbols.length * per;
  const t0 = Date.now();
  if (o.dry) return console.log(`dry run: ${symbols.length} symbols × ${resolveWeights(weights).length} weights × ${resolveScales(scales).length} scales = ${total} drawings`);
  const shard = o.shard ? Number(o.shard) : 2000;                 // records per file
  const step = Math.max(1, Math.floor(shard / per));              // symbols per file
  const dest = total > shard ? path.join(outDir, run) : null;
  const meta = { schema: SCHEMA, source: 'sfsymbols', generatedAt: new Date().toISOString(), font: FONT, selection: { symbols: symbols.length, weights, scales } };
  const parts = [], tab = {};
  let failed = 0, count = 0;
  for (let i = 0; i < symbols.length; i += step) {
    const records = extract({ symbols: symbols.slice(i, i + step), weights, scales });
    for (const x of records) {
      if (x.error) { failed++; if (failed <= 5) console.error('  FAILED', x.id, x.error); continue; }
      if (total <= 400) { const k = `${x.name} · ${x.variant.weight}`; tab[k] = (tab[k] || 0) + 1; }
    }
    count += records.length;
    const file = dest ? path.join(dest, `part-${String(parts.length + 1).padStart(4, '0')}.json`) : path.join(outDir, `${run}.json`);
    writeJson(file, { ...meta, part: parts.length + 1, count: records.length, records });
    parts.push(file);
    if (dest) console.error(`  ${count}/${total}`);
  }
  if (dest) writeJson(path.join(dest, 'index.json'), { ...meta, count, parts: parts.map((f) => path.basename(f)) });
  console.log(`${count} drawings (${failed} failed) in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${dest ? `${rel(dest)}/ (${parts.length} parts + index.json)` : rel(parts[0])}`);
  if (total <= 400) console.table(tab);
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => { console.error(e.stack || e); process.exit(1); });
}
