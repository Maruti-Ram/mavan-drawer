#!/usr/bin/env node
// The size rule (plans/shipping.md card 2.4) as a sheet: which master draws an icon at a size the
// set has no master for. lab/size-rule.html shows twenty icons at every size from 14 to 32 px, each
// drawn two ways — the master at or below the size scaled up, and the master above scaled down —
// at true size and magnified to the pixel. This writes the page's data, lab/size-rule.js, so the set
// is changed here and never by editing the page.
//
//   node tools/size-sheet.mjs [names…] [--sizes 14-32]
//
//   e.g. node tools/size-sheet.mjs                       the default spread below
//        node tools/size-sheet.mjs check plus gear       just these
//        node tools/size-sheet.mjs --sizes 16-24
//
// Every name must ship at 24 · 20 · 16 with its filled twin (lab/manifest.json; run `npm run build`
// first if an icon was approved since); a name that does not is reported and the command fails,
// so the sheet never shows a hole.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'lab', 'size-rule.js');
const MASTERS = [16, 20, 24];

// A spread: line marks, a ring, containers, a figure, dense drawings, a glyph, repeated elements.
// `settings` is not in the set; `gear` stands for it.
const DEFAULT = ['check', 'plus', 'x', 'chevron-down', 'arrow-right', 'circle', 'search', 'user', 'mail',
  'folder', 'trash', 'gear', 'calendar', 'bell', 'home', 'lock', 'menu', 'more-horizontal', 'alert-circle', 'play'];

const args = process.argv.slice(2);
let sizes = [14, 32];
const names = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--sizes') {
    const m = String(args[++i] ?? '').match(/^(\d+)-(\d+)$/);
    if (!m || +m[1] > +m[2]) { console.error('--sizes takes a range, e.g. 14-32'); process.exit(2); }
    sizes = [+m[1], +m[2]];
  } else if (args[i].startsWith('--')) { console.error(`unknown option ${args[i]}`); process.exit(2); }
  else names.push(args[i]);
}
const set = names.length ? names : DEFAULT;

const man = JSON.parse(readFileSync(join(ROOT, 'lab', 'manifest.json'), 'utf8'));
const missing = set.flatMap((n) => MASTERS.flatMap((m) => [n, `${n}-filled`]
  .filter((f) => !man.masters?.[m]?.icons?.[f]).map((f) => `${f} at ${m}`)));
if (missing.length) {
  console.error(`not in lab/manifest.json: ${missing.join(', ')}\n(npm run build refreshes it)`);
  process.exit(1);
}
const dupes = set.filter((n, i) => set.indexOf(n) !== i);
if (dupes.length) { console.error(`listed twice: ${[...new Set(dupes)].join(', ')}`); process.exit(1); }

const list = Array.from({ length: sizes[1] - sizes[0] + 1 }, (_, i) => sizes[0] + i);
const data = { names: set, sizes: list, masters: MASTERS };
writeFileSync(OUT, `// Written by tools/size-sheet.mjs — do not edit; rerun it with other names instead.\nexport default ${JSON.stringify(data, null, 2)};\n`);
console.log(`lab/size-rule.js: ${set.length} icons × ${list.length} sizes (${list[0]}–${list.at(-1)} px)`);
