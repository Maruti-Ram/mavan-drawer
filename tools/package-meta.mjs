// The package's index: meta.json, the file in the customer's box that says what each icon is
// (plans/shipping.md, card 1.3).
//
//   node tools/package-meta.mjs [--out dist/meta.json]
//
// It reads the sheet (research/queue.md, through parseSheet, the one reader of its grammar) and
// the files in src/icons/{24,20,16}. Only approved rows ship; rows in review or not started are
// left out and counted. Nothing else on the sheet or in src/icons/ is touched.
//
// WHAT meta.json HOLDS
//
//   { "name": "mavan-drawer", "version": "0.0.1", "built": "2026-10-26",
//     "counts":   { "icons": 1310, "concepts": 458, "variants": 852, "families": 458 },
//     "icons":    [ { name, category, section, variantOf, family, tags, mvp, styles, masters, approved }, … ],
//     "families": [ { base, category, variants: ["check-small", "check-2", …] }, … ] }
//
// "icons" is one entry per approved row, in sheet order:
//   name       the file name the customer types (`check-2-small`)
//   category   the product category from the sheet (`UI & Layout`), null where the sheet has none yet
//   section    the sheet's section heading the row sits under (`A · Marks`) — drawing order, not a category
//   variantOf  the sheet's own `variant of`, null for a base concept. A few variants name another
//              variant (`clipboard-check-2` → `clipboard-check`, itself a variant of `clipboard`)
//   family     the base concept at the root of that chain (`clipboard`); a base concept names itself
//   tags       the search words in the 24 outline file's <!-- tags: … --> (the filled twin carries the same)
//   mvp        true when the sheet marks the row mvp
//   styles     which styles exist on disk: "outline" (<name>.svg), "filled" (<name>-filled.svg)
//   masters    which drawn masters exist on disk, of 24, 20, 16
//   approved   the approval date from the sheet's note, null if the note carries none
//
// "families" is one entry per base concept that ships, in sheet order, each with every variant
// whose chain leads to it, in sheet order (empty for a concept with no variants). A variant is in
// exactly one family.
//
// WHAT IT PRINTS
//   the counts; then two plain lists for Maruti to clear before 1.0 — the approved rows with no
//   category (his call) and the approved icons whose 24 outline carries no tags (the drawer's).
//   Both are lists, not failures: the exit code stays 0.
//
// WHEN IT FAILS (exit 1, nothing written)
//   an approved row with a file missing at some master or style — the box would then be short —
//   and a variant whose chain does not reach a shipped base concept.
//
// Re-running changes nothing but "built": every list keeps the sheet's order.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseSheet } from './queue.mjs';

const MASTERS = [24, 20, 16];
const STYLES = { outline: '', filled: '-filled' };
const file = (m, name, suffix) => `src/icons/${m}/${name}${suffix}.svg`;
const TAGS = /<!--\s*tags:\s*([^>]*?)\s*-->/;   // the same reading as tools/build.mjs
const tagsOf = (src) => src.match(TAGS)?.[1].split(',').map((t) => t.trim()).filter(Boolean) ?? [];

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const OUT = outAt >= 0 ? args[outAt + 1] : 'dist/meta.json';
if (!OUT) { console.error('--out needs a path'); process.exit(1); }

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const { rows } = parseSheet(readFileSync('research/queue.md', 'utf8'));
const shipped = rows.filter((r) => r.status === 'done');
const leftOut = rows.filter((r) => r.status !== 'done');
const byName = new Map(shipped.map((r) => [r.name, r]));

const problems = [];
const missing = [];

// The base concept at the root of a variant chain, or null when the chain leaves the shipped rows.
function rootOf(r) {
  const seen = new Set();
  let at = r;
  while (at.base) {
    if (seen.has(at.name)) return null;            // a loop
    seen.add(at.name);
    at = byName.get(at.base);
    if (!at) return null;
  }
  return at.name;
}

const icons = shipped.map((r) => {
  const styles = Object.keys(STYLES).filter((s) => MASTERS.some((m) => existsSync(file(m, r.name, STYLES[s]))));
  const masters = MASTERS.filter((m) => Object.values(STYLES).some((x) => existsSync(file(m, r.name, x))));
  const gaps = MASTERS.flatMap((m) => Object.entries(STYLES)
    .filter(([, x]) => !existsSync(file(m, r.name, x))).map(([s]) => `${m} ${s}`));
  if (gaps.length) missing.push(`${r.name}: no ${gaps.join(', ')}`);
  const outline24 = file(24, r.name, '');
  const tags = existsSync(outline24) ? tagsOf(readFileSync(outline24, 'utf8')) : [];
  const family = rootOf(r);
  if (!family) problems.push(`${r.name}: variant of \`${r.base}\`, which does not lead to a shipped base concept`);
  return { name: r.name, category: r.category, section: r.section, variantOf: r.base, family,
    tags, mvp: r.mvp, styles, masters, approved: r.date };
});

const families = shipped.filter((r) => !r.base).map((r) => ({ base: r.name, category: r.category, variants: [] }));
const familyOf = new Map(families.map((f) => [f.base, f]));
for (const i of icons) if (i.variantOf && i.family) familyOf.get(i.family).variants.push(i.name);

// Duplicate names would ship two entries under one file name.
const dupes = [...new Set(shipped.map((r) => r.name).filter((n, k, a) => a.indexOf(n) !== k))];
for (const d of dupes) problems.push(`${d}: on the sheet more than once`);

const variants = icons.filter((i) => i.variantOf).length;
const noCategory = shipped.filter((r) => !r.category);
const untagged = icons.filter((i) => i.tags.length === 0);
const tally = (s) => leftOut.filter((r) => r.status === s).length;

console.log(`meta.json — ${pkg.name} ${pkg.version}`);
console.log(`  ${icons.length} icons shipped (${families.length} base concepts, ${variants} variants), ${families.length} families`);
console.log(`  ${leftOut.length} rows left out (${tally('review')} in review, ${tally('todo')} not started)`);
console.log(`  ${missing.length} approved rows with a missing file`);

if (missing.length || problems.length) {
  if (missing.length) console.error(`\nApproved rows the box would be short of (${missing.length}):\n${missing.map((m) => `  ${m}`).join('\n')}`);
  if (problems.length) console.error(`\nSheet problems (${problems.length}):\n${problems.map((m) => `  ${m}`).join('\n')}`);
  console.error(`\nNothing written to ${OUT}.`);
  process.exit(1);
}

const meta = {
  name: pkg.name, version: pkg.version, built: new Date().toLocaleDateString('en-CA'),
  counts: { icons: icons.length, concepts: families.length, variants, families: families.length },
  icons, families,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`  → ${OUT}`);

console.log(`\nApproved rows with no category (${noCategory.length}) — Maruti's call:`);
console.log(noCategory.length ? noCategory.map((r) => `  ${r.name}${r.base ? ` (variant of ${r.base})` : ''}`).join('\n') : '  none');
console.log(`\nApproved icons whose 24 outline carries no tags (${untagged.length}) — the drawer's:`);
console.log(untagged.length ? untagged.map((i) => `  ${i.name}`).join('\n') : '  none');
