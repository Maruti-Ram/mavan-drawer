#!/usr/bin/env node
// The drawing queue as a command, so any session can pick up where the last
// one stopped. research/queue.md is the sheet; lab/drafts/current.js is the
// icon on the board. Nothing else holds state.
//
//   node tools/queue.mjs status               what is approved, what is on the board, what is next
//   node tools/queue.mjs next                 the next icon to draw (first not approved)
//   node tools/queue.mjs show <name>          one queue row, and which files exist for it
//   node tools/queue.mjs start <name>         mark it in review and load its references; a name
//                                             not on the sheet is added (a size under its default,
//                                             anything else at the end, in "E · Added on request")
//   node tools/queue.mjs drop <name>…        retire a name: delete its files (every master, both
//                                             styles) and remove its row from the sheet
//   node tools/queue.mjs approve <id>=<file> [<id>=<file>…]
//                                             write the board's candidates to src/icons,
//                                             lint, tick the sheet. `approve B` alone
//                                             writes candidate B as the concept name.
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { MASTERS, sizeBase, sizeOf, strokeOf } from './masters.mjs';

const QUEUE = 'research/queue.md';
const ADDED = 'E · Added on request';
const DRAFT = 'lab/drafts/current.js';
const ROW = /^- \[([ x~])\] (\d+)\. `([^`]+)`(?: · ([^·—]+?))?(?: · variant of `([^`]+)`)?(?: — (.+))?\s*$/;
const MARK = { todo: ' ', review: '~', done: 'x' };
const STATUS = { ' ': 'todo', '~': 'review', x: 'done' };
const today = () => new Date().toLocaleDateString('en-CA');   // YYYY-MM-DD, local
const masters = Object.keys(MASTERS).map(Number).sort((a, b) => b - a);

function readQueue() {
  const lines = readFileSync(QUEUE, 'utf8').split('\n');
  const rows = [];
  let section = '';
  lines.forEach((line, i) => {
    const h = line.match(/^## (.+)/);
    if (h) { section = h[1].trim(); return; }
    const m = line.match(ROW);
    if (m) rows.push({ i, status: STATUS[m[1]], n: +m[2], name: m[3], category: m[4]?.trim() ?? null, base: m[5] ?? null, note: m[6] ?? null, section });
  });
  return { lines, rows };
}
const format = (r) => `- [${MARK[r.status]}] ${r.n}. \`${r.name}\``
  + (r.category ? ` · ${r.category}` : '') + (r.base ? ` · variant of \`${r.base}\`` : '') + (r.note ? ` — ${r.note}` : '');
const save = (q) => writeFileSync(QUEUE, q.lines.join('\n'));
const find = (q, name) => q.rows.find((r) => r.name === name);

async function draft() {
  if (!existsSync(DRAFT)) return null;
  // Cache-bust: the file changes between calls in one process only in tests, but be safe.
  return (await import(`${pathToFileURL(DRAFT).href}?t=${Date.now()}`)).default;
}
const files = (name) => masters.flatMap((m) => [name, `${name}-filled`].map((f) => `src/icons/${m}/${f}.svg`)).filter(existsSync);
const next = (q) => q.rows.find((r) => r.status !== 'done' && !r.base) ?? null;
const label = (r) => `#${r.n} ${r.name}`;
const die = (msg) => { console.error(msg); process.exit(1); };

// ─── status ────────────────────────────────────────────────────────────────
async function status() {
  const q = readQueue();
  const done = q.rows.filter((r) => r.status === 'done');
  const d = await draft();
  const board = d && find(q, d.concept);
  const after = q.rows.find((r) => r.status !== 'done' && !r.base && r.name !== d?.concept);
  const dirty = spawnSync('git', ['status', '--porcelain', '--', 'src/icons', QUEUE], { encoding: 'utf8' }).stdout.trim();

  const out = [
    'Mavan Drawer · icon queue (research/queue.md is the sheet; Library → Sheet shows it)',
    `Approved ${done.length} of ${q.rows.length}` + (done.length ? ` · latest: ${done.slice(-3).map((r) => r.name).join(', ')}` : ''),
  ];
  if (d) {
    out.push(`On the board (lab/drafts/current.js): ${board ? label(board) : d.concept} · ${board?.status ?? 'not in queue'}`
      + ` · candidates ${d.candidates.map((c) => c.id).join(', ')}`);
    if (d.question) out.push(`  Open question: ${d.question}`);
    if (board?.status === 'done') out.push('  (already approved: the board is stale, start the next icon)');
  } else out.push('On the board: nothing');
  out.push(after ? `Next after that: ${label(after)} (${after.section})` : 'Queue complete after the board.');
  if (dirty) out.push(`Uncommitted sheet/icon changes:\n${dirty.split('\n').map((l) => `  ${l}`).join('\n')}`);
  out.push('Workflow: the `icon` skill (.claude/skills/icon). "next icon" or "let\'s do <name>" starts one; an approval is written, ticked and committed without being asked.');
  console.log(out.join('\n'));
}

// ─── show / next / start ───────────────────────────────────────────────────
function show(name) {
  const q = readQueue();
  const r = find(q, name);
  if (!r) {
    const near = q.rows.filter((x) => x.name.includes(name) || name.includes(x.name)).slice(0, 8).map((x) => x.name);
    die(`${name} is not in the queue.${near.length ? ` Close: ${near.join(', ')}` : ''}`);
  }
  const variants = q.rows.filter((x) => x.base === name && sizeBase(x.name) === name).map((x) => x.name);
  console.log(JSON.stringify({ ...r, i: undefined, files: files(name), variants }, null, 2));
}

// A name the sheet does not have yet. A size of an existing icon goes under
// its default; anything else goes at the end, numbered after the last row.
function add(q, name) {
  const base = sizeOf(name) && find(q, sizeBase(name));
  const row = { status: 'todo', name, note: `added ${today()}` };
  if (base) {
    const last = Math.max(base.i, ...q.rows.filter((r) => r.base === base.name && sizeBase(r.name) === base.name).map((r) => r.i));
    const category = base.category;
    q.lines.splice(last + 1, 0, format({ ...row, n: base.n, category, base: base.name }));
  } else {
    const n = Math.max(...q.rows.map((r) => r.n)) + 1;
    while (q.lines.length && q.lines.at(-1).trim() === '') q.lines.pop();
    if (!q.lines.some((l) => l.trim() === `## ${ADDED}`))
      q.lines.push('', `## ${ADDED}`, '', 'Icons asked for while drawing, in the order they were asked. Not in the audit ranking.', '');
    q.lines.push(format({ ...row, n }), '');
  }
  save(q);
  console.log(`${name} was not on the sheet — added ${base ? `under ${base.name}` : `at the end (${ADDED})`}.`);
  return readQueue();
}

function start(name) {
  let q = readQueue();
  if (!find(q, name)) q = add(q, name);
  const r = find(q, name);
  if (r.status === 'done') console.log(`${label(r)} is already approved; re-opening it for review leaves the files until a new approval.`);
  if (r.status === 'todo') { r.status = 'review'; q.lines[r.i] = format(r); save(q); }
  const refs = spawnSync('node', ['tools/refs.mjs', sizeBase(name)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  console.log(`${label(r)} · ${r.section}${r.category ? ` · ${r.category}` : ''}${r.base ? ` · variant of ${r.base}` : ''} → in review`);
  console.log((refs.stdout || refs.stderr).trim());
  console.log(`Now write ${DRAFT} (concept: '${name}') with the candidates, then open lab/icon.html.`);
}

// ─── approve ───────────────────────────────────────────────────────────────
// tags: search words kept beside the name (check-2 → "long sweep"); build.mjs reads them.
// optical: [dx, dy] the ink is deliberately moved off the box centre (C14); lint and build read it.
// glyph: dot — the mark is one character whose dot is detached (i, ?, !); its dot-to-body
// gap floors at GLYPH_GAP rather than MIN_GAP (C19). Lint reads it.
// box: [w, h] — the agreed ink size for this master, in its units, when the icon keeps a box
// of its own instead of a keyline (folder). Lint holds the drawing to it and errors if it drifts.
const svg = (m, weight, keyline, note, fill, stroke, tags = [], optical = null, glyph = null, box = null) => [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">`,
  ...(keyline ? [`  <!-- keyline: ${keyline} -->`] : []),
  ...(tags.length ? [`  <!-- tags: ${tags.join(', ')} -->`] : []),
  ...(box ? [`  <!-- box: ${box[0]}x${box[1]} -->`] : []),
  ...(glyph ? [`  <!-- glyph: ${glyph} -->`] : []),
  ...(optical ? [`  <!-- optical: ${optical.join(' ')} -->`] : []),
  ...(note ? [`  <!-- ${note.replace(/--/g, '—')} -->`] : []),
  ...fill.map((d) => `  <path fill="currentColor" fill-rule="evenodd" stroke="none" d="${d}"/>`),
  ...stroke.map((d) => `  <path d="${d}"/>`),
  '</svg>', '',
].join('\n');

async function approve(args) {
  const d = await draft() ?? die(`No draft in ${DRAFT}.`);
  if (!args.length) die('Say which candidate: approve <id> or approve <id>=<file-name> …');
  // A sheet can span concepts (chevron-up, -left, -right): each file belongs to the one it extends.
  const concepts = d.concepts ?? [d.concept];
  const conceptOf = (file) => concepts.find((k) => sizeBase(file) === sizeBase(k) || file.startsWith(`${k}-`));
  const plan = args.map((a) => {
    const [id, file = d.concept] = a.split('=');
    const c = d.candidates.find((x) => x.id === id) ?? die(`No candidate "${id}" on the board (have: ${d.candidates.map((x) => x.id).join(', ')}).`);
    const concept = conceptOf(file) ?? die(`${file} is not a variant of ${concepts.join(' / ')}.`);
    return { c, file, concept };
  });

  const written = [];
  for (const { c, file } of plan) {
    const keyline = c.keyline ?? d.keyline ?? null;
    const tags = c.tags ?? d.tags ?? [];
    const glyph = c.glyph ?? d.glyph ?? null;
    const box = c.box ?? d.box ?? null;              // { 24: [w, h], 20: […], 16: […] }
    for (const m of masters) {
      const o = c.masters?.[m] ?? die(`${c.id} has no ${m} master.`);
      const f = c.filled?.[m];
      if (c.filled === 'outline' || !f) die(`${c.id} has no filled drawing at ${m} (filled: 'outline' is retired — give it a weight or fill).`);
      const note = [c.label, c.note].filter(Boolean).join(': ');
      // The outline stroke is the master's own (masters.mjs): 1.5 at 24 and 20,
      // and whatever STROKES says at 16. A filled drawing declares its weight;
      // a shape-filled one has none, and its leftover lines keep the outline stroke.
      const sw = strokeOf(m);
      writeFileSync(`src/icons/${m}/${file}.svg`, svg(m, sw, keyline, note, [], o, tags, c.optical?.[m], glyph, box?.[m]));
      const fw = f.weight ?? sw;
      writeFileSync(`src/icons/${m}/${file}-filled.svg`, svg(m, fw, keyline,
        `${c.label}, filled` + (f.fill?.length ? `: shapes filled${f.stroke?.length ? `, lines stay ${sw}` : ''}` : `: weight ${fw}, ends pulled in ${(fw - sw) / 2} so the ink box matches the outline`),
        f.fill ?? [], f.stroke ?? [], tags, c.optical?.[m], glyph, box?.[m]));
      written.push(`src/icons/${m}/${file}.svg`, `src/icons/${m}/${file}-filled.svg`);
    }
  }

  const check = spawnSync('npm', ['run', 'check', '--silent'], { encoding: 'utf8' });
  const report = check.stdout.split('\n').filter((l) => plan.some(({ file }) => l.includes(` ${file}`)) || /warn|error|drawings/.test(l));
  console.log(report.join('\n'));
  if (check.status !== 0) die('Lint failed: the files are written but the sheet is NOT ticked. Fix the draft and approve again.');

  // Tick the sheet: update rows that exist, then add a row for each new
  // size/variant file directly under the concept and its earlier variants.
  const stamp = `approved ${today()}`;
  const stamped = (note) => [note?.replace(/\s*·?\s*approved \d{4}-\d{2}-\d{2}/, '').trim(), stamp].filter(Boolean).join(' · ');
  const q = readQueue();
  for (const k of new Set(plan.map((p) => p.concept))) if (!find(q, k)) die(`${k} is not in the queue.`);
  for (const { file } of plan) {
    const r = find(q, file);
    if (r) { r.status = 'done'; r.note = stamped(r.note); q.lines[r.i] = format(r); }
  }
  // New size/variant rows go under their concept and its earlier variants; later concepts first,
  // so inserting lines never moves a concept still to be handled.
  const byConcept = Map.groupBy(plan.filter(({ file }) => !find(q, file)), (p) => p.concept);
  for (const [k, ps] of [...byConcept].sort((a, b) => find(q, b[0]).i - find(q, a[0]).i)) {
    const base = find(q, k);
    // Only size rows sit under the concept; other variants (minus-square) keep their own place.
    const last = Math.max(base.i, ...q.rows.filter((r) => r.base === k && sizeBase(r.name).replace(/-\d+$/, '') === k).map((r) => r.i));
    q.lines.splice(last + 1, 0, ...ps.map(({ c, file }) => format({ status: 'done', name: file, base: k, note: stamped(c.label), n: base.n, category: base.category })));
  }
  save(q);
  spawnSync('npm', ['run', 'build', '--silent'], { stdio: 'ignore' });

  console.log(`\nTicked in ${QUEUE}: ${plan.map(({ file }) => file).join(', ')} (${stamp}).`);
  console.log(`Commit: ${[...written, QUEUE, 'lab/manifest.json'].join(' ')}`);
  const nx = next(readQueue());
  console.log(nx ? `Next: ${label(nx)} (${nx.section}) — run: node tools/queue.mjs start ${nx.name}` : 'Queue complete.');
}

// ─── drop ──────────────────────────────────────────────────────────────────
// Retire a name the set is not shipping after all: its files go, its row goes.
// A concept with variants still on the sheet is refused — drop the variants first.
function drop(names) {
  const q = readQueue();
  const gone = [];
  for (const name of names) {
    const r = find(q, name) ?? die(`${name} is not in the queue.`);
    const kids = q.rows.filter((x) => x.base === name && !names.includes(x.name));
    if (kids.length) die(`${name} still has ${kids.map((k) => k.name).join(', ')} on the sheet — drop those too.`);
    for (const m of masters) for (const f of [`${name}.svg`, `${name}-filled.svg`]) {
      const file = `src/icons/${m}/${f}`;
      if (existsSync(file)) { unlinkSync(file); gone.push(file); }
    }
    q.lines.splice(r.i, 1);
    for (const x of q.rows) if (x.i > r.i) x.i -= 1;                 // rows after it shift up
    q.rows.splice(q.rows.indexOf(r), 1);
    console.log(`${label(r)} dropped from the sheet`);
  }
  save(q);
  spawnSync('npm', ['run', 'build', '--silent'], { stdio: 'ignore' });
  console.log(`Deleted ${gone.length} files:\n  ${gone.join('\n  ')}`);
  console.log(`Commit: ${[...gone, QUEUE, 'lab/manifest.json'].join(' ')}`);
}

// ─── dispatch ──────────────────────────────────────────────────────────────
const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'status' || !cmd) await status();
else if (cmd === 'next') { const r = next(readQueue()); console.log(r ? `${r.name}\t#${r.n}\t${r.section}` : ''); }
else if (cmd === 'show') show(rest[0] ?? die('show <name>'));
else if (cmd === 'start') start(rest[0] ?? die('start <name>'));
else if (cmd === 'drop') drop(rest.length ? rest : die('drop <name>…'));
else if (cmd === 'approve') await approve(rest);
else die(`Unknown command ${cmd}. Use status | next | show | start | approve | drop.`);
