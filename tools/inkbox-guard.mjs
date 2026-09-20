#!/usr/bin/env node
// Guard for plans/stroke-16.md: converting the 16 master to a 1.25 stroke must not move or
// resize a single icon. Snapshot the ink boxes before, compare after.
//
//   node tools/inkbox-guard.mjs snapshot    write plans/stroke-16.inkbox.json from the current build
//   node tools/inkbox-guard.mjs             rebuild, compare every 16 drawing, exit 1 on any drift
//
// One allowance, found on the proof sheet: a BENT MARK (chevron, check, arrow head) cannot hold
// its angle, its width, the C10 bend and its height at once when the line gets lighter — the
// tighter bend lifts the point. It may give up to 0.1 on ONE axis (the bend's); its size on the
// other axis, which is the family number lint's C8 check reads, stays exact. Every file that
// uses the allowance is listed, so it cannot hide anything.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parsePath, isDot, bbox } from './geometry.mjs';

const SNAP = 'plans/stroke-16.inkbox.json';
const MASTER = 16, EXACT = 0.011, BEND = 0.1;

spawnSync('npm', ['run', 'build', '--silent'], { stdio: 'ignore' });
const icons = JSON.parse(readFileSync('lab/manifest.json', 'utf8')).masters[MASTER].icons;
const hasBend = (i) => i.paths.some((d) => !isDot(d) && parsePath(d).some(({ cmd }) => cmd.toUpperCase() === 'A'));

if (process.argv[2] === 'snapshot') {
  const snap = Object.fromEntries(Object.entries(icons).map(([n, i]) => [n, i.ink]));
  writeFileSync(SNAP, JSON.stringify(snap, null, 1));
  console.log(`snapshot: ${Object.keys(snap).length} drawings at ${MASTER} → ${SNAP}`);
  process.exit(0);
}

const snap = JSON.parse(readFileSync(SNAP, 'utf8'));
const drift = [], allowed = [], thinned = [], gone = [], added = Object.keys(icons).filter((n) => !(n in snap));
for (const [n, was] of Object.entries(snap)) {
  const i = icons[n];
  if (!i) { gone.push(n); continue; }
  const d = { x: i.ink.x - was.x, y: i.ink.y - was.y, w: i.ink.w - was.w, h: i.ink.h - was.h };
  const off = Object.entries(d).filter(([, v]) => Math.abs(v) > EXACT);
  if (!off.length) continue;
  // Lines whose own SIDES are the icon's top and bottom ink edges (minus; the menu stacks, which keep
  // their centrelines so the filled twin thickens in place - C17): the height thins by exactly the stroke
  // change (1.5 -> 1.25: 0.125 off each side) and nothing can hold it. Width and centre must hold.
  const spans = i.paths.map((p) => bbox([p])), top = Math.min(...spans.map((b) => b.y0)), bot = Math.max(...spans.map((b) => b.y1));
  const flat = i.paths.every((p, k) => (spans[k].y0 > top + EXACT && spans[k].y1 < bot - EXACT) || /^M[\d. ]+[hH][\d. -]+$/.test(p.trim()));
  if (flat && Math.abs(d.x) <= EXACT && Math.abs(d.w) <= EXACT && Math.abs(d.y - 0.125) <= EXACT && Math.abs(d.h + 0.25) <= EXACT) { thinned.push(n); continue; }
  const axes = new Set(off.map(([k]) => (k === 'x' || k === 'w' ? 'x' : 'y')));
  const ok = i.mark && hasBend(i) && axes.size === 1 && off.every(([, v]) => Math.abs(v) <= BEND);
  (ok ? allowed : drift).push(`${n}: ${off.map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v.toFixed(3)}`).join('  ')}`);
}

console.log(`${Object.keys(snap).length} drawings at ${MASTER} · ${Object.keys(snap).length - drift.length - allowed.length - thinned.length - gone.length} identical`
  + ` · ${thinned.length} line stacks thinned by the stroke itself`
  + ` · ${allowed.length} bent marks inside the ${BEND} allowance · ${drift.length} drifted`);
if (thinned.length) console.log(`\nminus and the menu stacks, 0.25 shorter and nothing else: ${thinned.join(', ')}`);
if (allowed.length) console.log(`\nbent-mark allowance used:\n  ${allowed.join('\n  ')}`);
if (added.length) console.log(`\nnot in the snapshot (new since): ${added.join(', ')}`);
if (gone.length) console.log(`\nmissing since the snapshot: ${gone.join(', ')}`);
if (drift.length) console.log(`\nDRIFT — these changed size or place:\n  ${drift.join('\n  ')}`);
process.exit(drift.length || gone.length ? 1 : 0);
