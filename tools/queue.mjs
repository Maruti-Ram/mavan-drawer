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
//
// A BATCH: when Maruti wants to review several icons together, up to five sit in
// lab/drafts/batch/<name>.js beside the board, and lab/icon.html opens one with
// ?icon=<name>. The board itself still holds exactly one icon.
//
//   node tools/queue.mjs start <name> --batch mark it in review and write its references to
//                                             lab/refs/batch/<name>.js — current.js untouched
//   node tools/queue.mjs batch                rebuild lab/drafts/batch/index.json from the
//                                             drafts present (start and approve do this too)
//   node tools/queue.mjs approve --icon <name> <id>[=<file>]…
//                                             approve from lab/drafts/batch/<name>.js; on success
//                                             the batch draft and its references are deleted
//   node tools/queue.mjs approve --dry-run …  lint the same six files per candidate in a temp
//                                             directory (tools/draft-check.mjs) and write nothing
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { MASTERS, sizeBase, sizeOf } from './masters.mjs';
import { candidateFiles } from './draft-svg.mjs';

const QUEUE = 'research/queue.md';
const ADDED = 'E · Added on request';
const DRAFT = 'lab/drafts/current.js';
const BATCH_DIR = 'lab/drafts/batch';
const BATCH_INDEX = `${BATCH_DIR}/index.json`;
const batchDraft = (name) => `${BATCH_DIR}/${name}.js`;
const batchRefs = (name) => `lab/refs/batch/${name}.js`;
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

async function draft(path = DRAFT) {
  if (!existsSync(path)) return null;
  // Cache-bust: the file changes between calls in one process only in tests, but be safe.
  return (await import(`${pathToFileURL(path).href}?t=${Date.now()}`)).default;
}

// ─── the batch index ───────────────────────────────────────────────────────
// lab/drafts/batch/index.json is not state: it is a listing of the drafts that are
// there, rebuilt from the files themselves, so the lab pages can offer an Icon menu
// without reading the sheet. Deleting it loses nothing — the menu then shows the
// board alone until this runs again.
async function batchNames() {
  if (!existsSync(BATCH_DIR)) return [];
  return readdirSync(BATCH_DIR).filter((f) => f.endsWith('.js') && !f.startsWith('_')).map((f) => f.replace(/\.js$/, '')).sort();
}
async function rebuildIndex(quiet = false) {
  const q = readQueue();
  const board = await draft();
  const icons = [];
  for (const name of await batchNames()) {
    let d = null;
    try { d = await draft(batchDraft(name)); } catch (e) { console.error(`  ${batchDraft(name)} did not load: ${e.message}`); }
    icons.push({
      name, concept: d?.concept ?? name,
      candidates: d?.candidates?.length ?? 0,
      ids: d?.candidates?.map((c) => c.id) ?? [],
      status: find(q, d?.concept ?? name)?.status ?? null,
    });
  }
  // The sheet's order, so stepping through the batch follows the queue; names not on the sheet go last.
  const order = (i) => find(q, i.concept)?.n ?? Infinity;
  icons.sort((a, b) => order(a) - order(b));
  const index = {
    generated: today(),
    board: board ? { name: board.concept, candidates: board.candidates?.length ?? 0, status: find(q, board.concept)?.status ?? null } : null,
    icons,
  };
  // An empty batch still writes its (empty) index: the lab pages fetch it, and a missing
  // file is a 404 in a console that is supposed to stay clean.
  mkdirSync(BATCH_DIR, { recursive: true }); writeFileSync(BATCH_INDEX, `${JSON.stringify(index, null, 2)}\n`);
  if (!quiet) console.log(icons.length
    ? `Batch of ${icons.length} → ${BATCH_INDEX}\n${icons.map((b) => `  ${b.name} · ${b.candidates} candidates (${b.ids.join(' ')}) · ${b.status ?? 'not in queue'} · /lab/icon.html?icon=${b.name}`).join('\n')}`
    : `No batch drafts in ${BATCH_DIR}/ — the board is the only icon.`);
  return index;
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
  for (const name of await batchNames()) {
    const bd = await draft(batchDraft(name)).catch(() => null);
    const row = find(q, bd?.concept ?? name);
    out.push(`  Batch (${batchDraft(name)}): ${row ? label(row) : name} · ${row?.status ?? 'not in queue'}`
      + ` · candidates ${bd?.candidates?.map((c) => c.id).join(', ') ?? 'none'} · /lab/icon.html?icon=${name}`);
  }
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

// `--batch` puts the icon beside the board instead of on it: the sheet is marked the same
// way, but the references go to lab/refs/batch/<name>.js and neither current.js nor
// refs/current.js is touched, so an icon already under review stays where it is.
async function start(name, isBatch = false) {
  let q = readQueue();
  if (!find(q, name)) q = add(q, name);
  const r = find(q, name);
  if (r.status === 'done') console.log(`${label(r)} is already approved; re-opening it for review leaves the files until a new approval.`);
  if (r.status === 'todo') { r.status = 'review'; q.lines[r.i] = format(r); save(q); }
  const out = isBatch ? ['--out', batchRefs(name)] : [];
  const refs = spawnSync('node', ['tools/refs.mjs', sizeBase(name), ...out], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  console.log(`${label(r)} · ${r.section}${r.category ? ` · ${r.category}` : ''}${r.base ? ` · variant of ${r.base}` : ''} → in review`);
  console.log((refs.stdout || refs.stderr).trim());
  if (!isBatch) return console.log(`Now write ${DRAFT} (concept: '${name}') with the candidates, then open lab/icon.html.`);
  console.log(`Now write ${batchDraft(name)} (concept: '${name}') with the candidates, check it with`);
  console.log(`  node tools/draft-check.mjs ${batchDraft(name)}`);
  console.log(`then run \`node tools/queue.mjs batch\` to list it and open /lab/icon.html?icon=${name}.`);
  await rebuildIndex(true);
}

// ─── approve ───────────────────────────────────────────────────────────────
// The SVG text itself is written by tools/draft-svg.mjs, shared with
// tools/draft-check.mjs so a dry check and a real approval can never drift.

async function approve(args) {
  // `--icon <name>` takes the candidates from a batch draft instead of the board;
  // `--dry-run` lints them in a temp directory and writes nothing at all.
  const iconAt = args.indexOf('--icon');
  const icon = iconAt < 0 ? null : args[iconAt + 1] ?? die('approve --icon <name> <id>…');
  const dry = args.includes('--dry-run');
  args = args.filter((a, i) => !a.startsWith('--') && !(iconAt >= 0 && i === iconAt + 1));

  const path = icon ? batchDraft(icon) : DRAFT;
  const d = await draft(path) ?? die(`No draft in ${path}.`);
  if (!args.length) die('Say which candidate: approve <id> or approve <id>=<file-name> …');
  // A sheet can span concepts (chevron-up, -left, -right): each file belongs to the one it extends.
  const concepts = d.concepts ?? [d.concept];
  const conceptOf = (file) => concepts.find((k) => sizeBase(file) === sizeBase(k) || file.startsWith(`${k}-`));
  const plan = args.map((a) => {
    const [id, file = d.concept] = a.split('=');
    const c = d.candidates.find((x) => x.id === id) ?? die(`No candidate "${id}" in ${path} (have: ${d.candidates.map((x) => x.id).join(', ')}).`);
    const concept = conceptOf(file) ?? die(`${file} is not a variant of ${concepts.join(' / ')}.`);
    return { c, file, concept };
  });

  if (dry) return dryRun(path, plan, icon);

  const written = [];
  for (const { c, file } of plan) {
    let out;
    try { out = candidateFiles(d, c, file); } catch (e) { die(e.message); }
    for (const { master, file: f, src } of out) {
      writeFileSync(`src/icons/${master}/${f}`, src);
      written.push(`src/icons/${master}/${f}`);
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

  // An approved batch icon leaves the batch: its draft and its references go, and the
  // index is rebuilt from what is left. The deleted draft and the index are part of the
  // same commit — the refs are gitignored, so they are not.
  const removed = [];
  if (icon) {
    for (const f of [batchDraft(icon), batchRefs(icon)]) if (existsSync(f)) { rmSync(f); removed.push(f); }
    await rebuildIndex(true);
    if (existsSync(BATCH_INDEX)) removed.push(BATCH_INDEX);
  }

  console.log(`\nTicked in ${QUEUE}: ${plan.map(({ file }) => file).join(', ')} (${stamp}).`);
  if (icon) console.log(`Off the batch: ${removed.join(', ')}`);
  console.log(`Commit: ${[...written, QUEUE, 'lab/manifest.json', ...removed.filter((f) => !f.startsWith('lab/refs/'))].join(' ')}`);
  if (icon) {
    const left = await batchNames();
    console.log(left.length ? `Still in the batch: ${left.join(', ')}` : 'The batch is empty.');
  }
  const nx = next(readQueue());
  console.log(nx ? `Next: ${label(nx)} (${nx.section}) — run: node tools/queue.mjs start ${nx.name}` : 'Queue complete.');
}

// ─── approve --dry-run ─────────────────────────────────────────────────────
// The whole of approve, proved without a single write: draft-check.mjs builds the same
// six files per candidate from the same tools/draft-svg.mjs and lints them in os.tmpdir.
// What the sheet WOULD say is printed, not saved.
function dryRun(path, plan, icon) {
  const args = plan.map(({ c, file }) => `${c.id}=${file}`);
  console.log(`Dry run · ${path} · nothing will be written\n`);
  const check = spawnSync('node', ['tools/draft-check.mjs', path, ...args], { stdio: 'inherit' });
  const q = readQueue();
  console.log('\nOn a real approve this would write:');
  for (const { file } of plan) for (const m of masters) console.log(`  src/icons/${m}/${file}.svg  src/icons/${m}/${file}-filled.svg`);
  console.log(`and tick in ${QUEUE}: ${plan.map(({ file }) => `${file} (${find(q, file) ? 'existing row' : 'new row'})`).join(', ')}.`);
  if (icon) console.log(`and delete ${batchDraft(icon)} + ${batchRefs(icon)}, then rebuild ${BATCH_INDEX}.`);
  if (check.status !== 0) die('\nLint failed on the draft — fix it before approving.');
  console.log('\nLint is clean. Run the same command without --dry-run to approve.');
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
else if (cmd === 'start') await start(rest.find((a) => !a.startsWith('--')) ?? die('start <name> [--batch]'), rest.includes('--batch'));
else if (cmd === 'batch') await rebuildIndex();
else if (cmd === 'drop') drop(rest.length ? rest : die('drop <name>…'));
else if (cmd === 'approve') await approve(rest);
else die(`Unknown command ${cmd}. Use status | next | show | start | batch | approve | drop.`);
