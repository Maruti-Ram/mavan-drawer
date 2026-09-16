#!/usr/bin/env node
// Ranks icon concepts by how many of three shipped sets include them.
// Reads research/sources/*.json (snapshots) and research/synonyms.mjs.
// Emits research/audit.json, research/audit.csv, research/ranked.md.
import { readFileSync, writeFileSync } from 'node:fs';
import {
  CATEGORIES, CONCEPTS, PLATFORM, NOT_VARIANT, BRAND_PREFIX, LUCIDE_ALIAS_IGNORE, D23,
} from '../research/synonyms.mjs';

const CUT = 500;
const load = (f) => JSON.parse(readFileSync(`research/sources/${f}.json`, 'utf8'));
const words = (s) => s.trim().split(/\s+/).filter(Boolean);
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

// Generic normalisation — see the header of research/synonyms.mjs.
function normalise(raw) {
  let t = raw.split('-').filter((x) => x && !/^\d+$/.test(x));
  t = t.map((x) => (/^\d+x\d+$/.test(x) ? x : x.replace(/(\D)\d+$/, '$1')));
  t = t.map((x) => ({ slash: 'off', xmark: 'x' }[x] ?? x));
  if (t.length > 1 && t.at(-1) === 'small') t.pop();
  if (t.length > 1 && (t[0] === 'circle' || t[0] === 'square')) t = [...t.slice(1), t[0]];
  return t.join('-');
}

// ── synonym table ──────────────────────────────────────────────────────────
const category = {};                 // canonical → category
const alias = {};                    // normalised alias → canonical
const rawAlias = {};                 // "source:raw" → canonical
const claim = (map, key, c) => {
  if (map[key] && map[key] !== c) throw new Error(`alias "${key}" claimed by ${map[key]} and ${c}`);
  map[key] = c;
};
for (const [cat, block] of Object.entries(CONCEPTS)) {
  for (const line of block.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const [c, ...as] = words(line);
    if (category[c]) throw new Error(`concept "${c}" listed twice`);
    category[c] = cat;
    claim(alias, c, c);
    for (const a of as) a.includes(':') ? claim(rawAlias, a, c) : claim(alias, a, c);
  }
}
const platform = new Set(words(PLATFORM));

const resolve = (source, raw) => rawAlias[`${source}:${raw}`] ?? alias[normalise(raw)] ?? normalise(raw);

// ── sources ────────────────────────────────────────────────────────────────
const hits = { P: {}, N: {}, L: {}, U: {} };          // source → concept → [raw names]
const hit = (s, c, raw) => ((hits[s][c] ??= []).includes(raw) || hits[s][c].push(raw));

for (const r of load('polaris')) { const raw = kebab(r.name); hit('P', resolve('polaris', raw), raw); }
for (const r of load('nucleo')) hit('N', resolve('nucleo', r.name), r.name);
const lucideCat = {};
for (const r of load('lucide')) {
  // Deprecated aliases are lookups only: they may land the icon on a listed
  // concept (`house` via `home`), never mint a row of their own.
  const own = resolve('lucide', r.name);
  const via = r.aliases.filter((a) => !LUCIDE_ALIAS_IGNORE.includes(a))
    .map((a) => resolve('lucide', a)).filter((c) => category[c]);
  for (const c of new Set(category[own] || !via.length ? [own, ...via] : via)) {
    hit('L', c, r.name);
    lucideCat[c] ??= r.categories;
  }
}
// Feather: the 287-icon set Lucide forked from. A tie-breaker only, like the
// Nucleo UI family — it separates Lucide's original core from its long tail.
const feather = new Set(load('feather').map((n) => rawAlias[`feather:${n}`] ?? resolve('lucide', n)));
const nucleoUiCat = {};
for (const r of load('nucleo-ui')) {
  const c = resolve('nucleo', r.name);
  hit('U', c, r.name);
  nucleoUiCat[c] ??= r.category;
}

// Category inference for concepts the table does not list.
const FROM_NUCLEO = {
  'Arrows': 'arrows', 'UI/Layout': 'ui', 'Filtering/Sorting': 'ui', 'Loaders': 'ui', 'Files': 'files',
  'Users': 'users', 'Security': 'users', 'Communication': 'comms', 'Time': 'time',
  'Bookmarks/Favorites': 'status', 'Signs/Symbols': 'status', 'Editing': 'editing', 'Charts': 'data',
  'Business/Finance': 'commerce', 'Shopping': 'commerce', 'Sound/Music': 'media',
  'Photography/Video': 'media', 'Maps/Location': 'maps', 'Technology/Devices': 'devices',
  'Design/Development': 'design',
};
const FROM_LUCIDE = {
  arrows: 'arrows', layout: 'ui', navigation: 'ui', cursors: 'ui', files: 'files', account: 'users',
  people: 'users', security: 'users', communication: 'comms', mail: 'comms', social: 'comms',
  notifications: 'status', time: 'time', text: 'editing', charts: 'data', finance: 'commerce',
  shopping: 'commerce', multimedia: 'media', photography: 'media', devices: 'devices',
  connectivity: 'devices', development: 'dev', design: 'design', shapes: 'design', tools: 'design',
};
const byBase = {};
for (const [c, cat] of Object.entries(category)) byBase[c] ??= cat;
function inferCategory(c) {
  if (category[c]) return category[c];
  if (c.startsWith(BRAND_PREFIX)) return 'brands';
  // A modifier variant inherits its base's category: calendar-sync → time.
  for (let t = c.split('-'); t.length > 1;) { t.pop(); if (byBase[t.join('-')]) return byBase[t.join('-')]; }
  // Lucide tags loosely (chevrons-up is also `gaming`), so a Lucide tag
  // decides only by majority — except that all-Tier-3 tags veto Nucleo, which
  // files chess pieces under Business.
  const lc = lucideCat[c] ?? [];
  const mapped = lc.map((x) => FROM_LUCIDE[x]).filter(Boolean);
  if (lc.length && !mapped.length) return 'other';
  if (nucleoUiCat[c]) return FROM_NUCLEO[nucleoUiCat[c]] ?? 'other';
  return mapped.length * 2 >= lc.length ? mapped[0] ?? 'other' : 'other';
}

// ── d23 ────────────────────────────────────────────────────────────────────
const d23 = {};                                      // canonical → the name doc 04 uses
for (const [cat, list] of Object.entries(D23)) {
  for (const w of words(list)) {
    const [name, c = name] = w.split(':');
    (d23[c] ??= []).push(name);
    if (!category[c]) throw new Error(`D23 "${name}" → "${c}" is not in the concept table`);
    if (category[c] !== cat) console.warn(`note: D23 files ${name} under ${cat}, audit under ${category[c]}`);
  }
}

// ── rank ───────────────────────────────────────────────────────────────────
const all = new Set([...Object.keys(hits.P), ...Object.keys(hits.N), ...Object.keys(hits.L), ...Object.keys(d23)]);
const rows = [...all].map((c) => {
  const has = (s) => (hits[s][c] ? 1 : 0);
  const cat = platform.has(c) ? 'platform' : inferCategory(c);
  return {
    concept: c, category: cat, tier: CATEGORIES[cat].tier,
    votes: has('P') + has('N') + has('L'), P: has('P'), N: has('N'), L: has('L'), nucleoUI: has('U'), feather: +feather.has(c),
    d23: d23[c] ?? null,
    names: { polaris: hits.P[c] ?? [], nucleo: hits.N[c] ?? [], lucide: hits.L[c] ?? [] },
  };
});

// Variant-of: the longest other concept this one extends (`calendar-plus` →
// `calendar`). A base inherits its variants' votes as `family`: if every set
// draws shield-check, the shield geometry has to exist whether or not a bare
// `shield` ships (see the cut-back rule in docs/05-modifiers.md).
const known = new Map(rows.filter((r) => r.votes).map((r) => [r.concept, r]));
// Shopify-only and Tier 3 variants do not vouch for a base: label-printer says
// nothing about labels, music-note-sparkle nothing about music.
const vouches = (r) => r.tier === 1 || r.tier === 2;
const notVariant = new Set(words(NOT_VARIANT));
for (const r of rows.filter((x) => !notVariant.has(x.concept))) {
  const t = r.concept.split('-');
  for (let n = t.length - 1; n > 0 && !r.variantOf; n--) {
    if (known.has(t.slice(0, n).join('-'))) r.variantOf = t.slice(0, n).join('-');
  }
}
for (const r of rows) r.family = { P: r.P, N: r.N, L: r.L };
for (const r of rows.filter(vouches)) {
  for (let b = r.variantOf; b; b = known.get(b)?.variantOf) {
    const f = known.get(b).family;
    f.P |= r.P; f.N |= r.N; f.L |= r.L;
  }
}
for (const r of rows) r.score = r.variantOf ? r.votes : r.family.P + r.family.N + r.family.L;

// Evidence: two sets agree, or a curated set chose it alone (Polaris for a real
// product, Nucleo Essential, Feather). A Lucide-only concept is not evidence —
// Lucide draws 1,800 things. Open slots are reported, not filled by alphabet.
for (const r of rows) r.evidence = r.score >= 2 || !!(r.P || r.N || r.feather);

// Order: Tier 3 last whatever its votes (docs/04-scope.md: on demand only).
// Then score; then Polaris, because a real product needed it; then bases
// before modifier variants; then Nucleo's curation; then Feather; then whether
// Nucleo's 4,600-name UI family drew it at all. Name is the last resort.
const ranked = rows.filter((r) => r.tier > 0).sort((a, b) =>
  (a.tier === 3) - (b.tier === 3) || b.evidence - a.evidence || b.score - a.score || b.votes - a.votes ||
  b.P - a.P || !!a.variantOf - !!b.variantOf || b.N - a.N || b.feather - a.feather || b.nucleoUI - a.nucleoUI ||
  a.tier - b.tier || a.concept.localeCompare(b.concept));
ranked.forEach((r, i) => { r.rank = i + 1; r.top = r.rank <= CUT && r.evidence && r.tier < 3; });

// ── emit ───────────────────────────────────────────────────────────────────
const excluded = rows.filter((r) => r.tier === 0).sort((a, b) => a.concept.localeCompare(b.concept));
writeFileSync('research/audit.json', JSON.stringify({ cut: CUT, ranked, excluded }, null, 1));

const csv = [['rank', 'concept', 'category', 'tier', 'score', 'votes', 'polaris', 'nucleo', 'lucide', 'nucleo_ui', 'feather', 'd23', 'variant_of', 'polaris_names', 'nucleo_names', 'lucide_names']]
  .concat(ranked.map((r) => [r.rank, r.concept, r.category, r.tier, r.score, r.votes, r.P, r.N, r.L, r.nucleoUI, r.feather,
    r.d23?.join(' ') ?? '', r.variantOf ?? '', r.names.polaris.join(' '), r.names.nucleo.join(' '), r.names.lucide.join(' ')]));
writeFileSync('research/audit.csv', csv.map((row) => row.join(',')).join('\n') + '\n');

const top = ranked.filter((r) => r.top);
const count = (xs, f) => xs.filter(f).length;
const sets = (r) => `${r.P ? 'P' : '·'}${r.N ? 'N' : '·'}${r.L ? 'L' : '·'}${r.feather ? 'f' : ''}`;
// Sets that draw only a concept's modifier variants, credited to the base.
const fam = (r) => (r.score > r.votes ? ` +${['P', 'N', 'L'].filter((k) => r.family[k] && !r[k]).join('').toLowerCase()}` : '');
const tick = (r) => `${r.concept} \`${sets(r)}${fam(r)}\``;
const open = ranked.filter((r) => r.tier < 3 && !r.evidence && !r.variantOf && r.nucleoUI);
const tier3 = ranked.filter((r) => r.tier === 3 && r.score >= 2);
const d23out = ranked.filter((r) => r.d23 && !r.top);

let md = `<!-- generated by tools/audit.mjs — do not edit. Change research/synonyms.mjs and rerun. -->
# Ranked concepts — the first ${CUT}

**Sets:** \`P\` Polaris · \`N\` Nucleo Essential · \`L\` Lucide · \`f\` also in Feather (tie-breaker only).
\`+pnl\` means that set draws only this concept's modifier variants, and the base is credited with them.
**Bold** = in D23. *Italic* = a modifier variant of a concept in the list.

Evidence-backed concepts: **${top.length}**${top.length < CUT ? ` — **${CUT - top.length} slots open** (see the end)` : ''}.

| category | 3/3 | 2/3 | 1/3 | total | of which D23 |
|---|--:|--:|--:|--:|--:|
${Object.entries(CATEGORIES).filter(([, m]) => m.tier === 1 || m.tier === 2).map(([k, m]) => {
  const xs = top.filter((r) => r.category === k);
  return `| ${m.label} | ${[3, 2, 1].map((v) => count(xs, (r) => r.score === v)).join(' | ')} | **${xs.length}** | ${count(xs, (r) => r.d23)} |`;
}).join('\n')}
| **all** | ${[3, 2, 1].map((v) => count(top, (r) => r.score === v)).join(' | ')} | **${top.length}** | ${count(top, (r) => r.d23)} |

`;
for (const [cat, meta] of Object.entries(CATEGORIES)) {
  const xs = top.filter((r) => r.category === cat);
  if (!xs.length) continue;
  md += `## ${meta.label} — ${xs.length}\n\n| # | concept | score | sets | D23 name |\n|--:|---|:-:|---|---|\n`;
  for (const r of xs) {
    const name = r.d23 ? `**${r.concept}**` : r.variantOf ? `*${r.concept}*` : r.concept;
    md += `| ${r.rank} | ${name} | ${r.score} | \`${sets(r)}${fam(r)}\` | ${r.d23 && r.d23.join() !== r.concept ? r.d23.join(', ') : ''} |\n`;
  }
  md += '\n';
}
md += `## D23 concepts outside the ${top.length}\n\n${d23out.map((r) => `- ${tick(r)} — D23 \`${r.d23.join(', ')}\`, rank ${r.rank}`).join('\n')}\n\n`;
md += `## Open-slot candidates\n\nTier 1–2 bases that only Lucide draws but Nucleo's full UI family also has. Not evidence — pick by product need.\n\n`;
for (const [cat, meta] of Object.entries(CATEGORIES)) {
  const xs = open.filter((r) => r.category === cat);
  if (xs.length) md += `- **${meta.label}:** ${xs.map((r) => r.concept).join(', ')}\n`;
}
md += `\n## Held back: Tier 3 with two or more sets (${tier3.length})\n\n${tier3.map(tick).join(' · ')}\n`;
md += `\n## Excluded (${excluded.length})\n\n**Shopify-specific:** ${excluded.filter((r) => r.category === 'platform').map((r) => r.concept).join(', ')}\n\n**Logos:** ${excluded.filter((r) => r.category === 'brands').map((r) => r.concept).join(', ')}\n`;
writeFileSync('research/ranked.md', md);

const band = (xs) => [3, 2, 1].map((v) => `${v}/3=${count(xs, (r) => r.score === v)}`).join('  ');
console.log(`concepts: ${rows.length} (${ranked.length} ranked, ${excluded.length} excluded as logos/platform)`);
console.log(`evidence-backed tier 1–2: ${top.length} (${band(top)}); ${CUT - top.length} open slots`);
console.log(`D23: ${count(top, (r) => r.d23)}/${count(ranked, (r) => r.d23)} inside; tier 3 held back: ${tier3.length}`);
console.log('→ research/audit.json, research/audit.csv, research/ranked.md');
