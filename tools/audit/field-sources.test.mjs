// Tests for tools/audit/field-sources.mjs (card 2.6). Synthetic fixtures only: a tiny fake
// transcript, two tiny fake reports and a fake document are written to a temp directory. No real
// transcript, no scratch path, nothing in the repository is read or written.
// Run: node --test tools/audit/field-sources.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REPO, sha256, projectSlug, handbackMessage, extractReports, isInside, praiseAnchors, constructionAnchors,
  citedAnchors, quotedStrings, findQuote, failureModes, recountTally, constructionCounts, normaliseRow,
  normaliseTable, checkTranscription, checkDocument, CALIBRATION, CALIBRATION_KEYS, valueBacked, isThirdParty,
  reportQuotedSpans, sourceText, locateSay, movedCitations, QUOTE_WORD_CAP,
} from './field-sources.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOOL = join(HERE, 'field-sources.mjs');
const SESSION = 'sess-0000';
const AGENT = 'agent-aaaa';

const line = (o) => JSON.stringify(o);
const toolUse = (name, input, extra = {}) => line({ agentId: AGENT, sessionId: SESSION, type: 'assistant', message: { content: [{ type: 'tool_use', name, input }] }, ...extra });
const REPORT = '# Fake report\n\nThe final text, 2 lines.\n';

/** A transcript with a decoy handback, another tool carrying a `message`, junk, and the real final call. */
function fakeTranscript() {
  return [
    line({ agentId: AGENT, sessionId: SESSION, type: 'user', message: { content: 'go' } }),
    toolUse('SubagentHandback', { message: 'DRAFT — the wrong, earlier call' }),
    toolUse('SendMessage', { message: 'a message to another agent, not a handback' }),
    'this line is not JSON',
    toolUse('Bash', { command: 'echo' }),
    toolUse('SubagentHandback', { message: 'from a different agent' }, { agentId: 'agent-zzzz' }),
    toolUse('SubagentHandback', { message: REPORT }),
    line({ type: 'attachment' }),
  ].join('\n') + '\n';
}

function fixtureProjects(dir) {
  const sub = join(dir, 'projects', 'slug', SESSION, 'subagents');
  mkdirSync(sub, { recursive: true });
  writeFileSync(join(sub, `agent-${AGENT}.jsonl`), fakeTranscript());
  return join(dir, 'projects', 'slug');
}

const PRAISE = `# Fake survey
## A. Bottom line
1. **"Best" is mostly said as "consistent".** Independent voices agree.
2. **Ownership, not the grid.** Cursor: "Sets drift when nobody owns them."
## B. Set by set
**Phosphor.** One master. "My favourite open source icon set these days" (HN#1).
**Atlassian.** [V] 1.5px on 16. Hand-drawn 12 was "too restrictive".
- **Octicons** [V]: two sizes.
## C. Synthesis
### C1. Vocabulary of praise (grouped)
1. **Consistent**: the dominant word.
### C2. Failure modes, ranked
Counts: n=5 (HN 3; designers 2).
1. **Generic, "slop"**: 3 [HN 2, designers 1]. "too generic".
2. **Blur** 1 (HN#2). **Drift** 1 (HN#3).
### C3. Hand-tuned versus scaled
Claims.
### C4. People
1. Marek Minor, "The making of Cursor's icons". https://example.invalid/minor
2. Atlassian, "Behind the screens". https://example.invalid/atl
## D. Notes for the audit
- Cursor's 1.25 matches C7.
`;

const CONSTRUCTION = `# Fake calibration
## 1. Headline findings
1. **Repo correction.** Stroke is 1.0 at 16.
2. **Published strokes at the 16 canvas.**
   - 1.0: IBM, Salesforce (SLDS) 16 grid, Fluent shipped, Phosphor regular (on its 16 design grid).
   - 1.5: Octicons, Atlassian, Spectrum.
   - Nobody publishes 1.25 at 16.
7. **Filled twin keeps the outer ink box.**

   | System | Pairs with identical box |
   |---|---|
   | Material (fill 0 vs 1) | 100% (27 of 27) |
   | Polaris | 60% |

## 2. Per-system tables
### 2.1 Google Material
| Dimension | Value | Basis |
|---|---|---|
| Stroke | 2dp at weight 400 | S |
| Keylines as shipped | 24: 20 / 18 / 16×20 / 20×16 | F |
### 2.5 Atlassian
| Dimension | Value | Basis |
|---|---|---|
| Stroke | 1.5px. Legacy set was 2px on a 24 canvas. | S |
| Stroke at 12 | 12px icons are CSS downscales of the 16, so stroke becomes 1.125 (X). | X |
## 3. Cross-system comparison
### 3.1 Canvas and live area
| System | Result | Basis |
|---|---|---|
| Material | 24: 20/24 = 83.3% | S |
| Mavan | 83.3 / 80 / 87.5% | K |
### 3.5 Multi-size policy at a glance
| System | Policy | Drawings per concept | Basis |
|---|---|---|---|
| Material Symbols | Variable font | one, four optical instances | S |
| Fluent | Separate drawing per size | up to 7 | S |
| IBM Carbon | 32 master scaled | one | S |
| Octicons | Always 16 and 24 | two | S |
## 5. Contradictions between respected systems
| Topic | Position A | Position B |
|---|---|---|
| Stroke at 16 | 1.0: IBM | 1.5: Octicons |
| Redraw vs scale | Redraw: Octicons | Scale: IBM |
## 6. What I could not get
- nothing
`;

function tmp() { return mkdtempSync(join(tmpdir(), 'field-sources-')); }
const reportsOf = (praise = PRAISE, construction = CONSTRUCTION) => [
  { file: 'field-survey-praise.md', kind: 'praise', text: praise },
  { file: 'field-construction-systems.md', kind: 'construction', text: construction },
];

// ── extraction ──────────────────────────────────────────────────────────────────────────────

test('extraction takes the LAST SubagentHandback of that agent, not a draft, another tool, or another agent', () => {
  const { message, calls } = handbackMessage(fakeTranscript(), { agent: AGENT, session: SESSION });
  assert.equal(message, REPORT);
  assert.equal(calls, 2, 'the decoy and the final call are both handbacks of this agent');
  assert.throws(() => handbackMessage(toolUse('SendMessage', { message: 'x' }), { agent: AGENT }), /no SubagentHandback/);
  // without the agent filter the other agent's later call would not be taken either (the real one is last)
  assert.equal(handbackMessage(fakeTranscript()).message, REPORT);
  // and if the other agent's call came last, the agent filter is what protects us
  const swapped = fakeTranscript().replace(toolUse('SubagentHandback', { message: 'from a different agent' }, { agentId: 'agent-zzzz' }) + '\n', '') + toolUse('SubagentHandback', { message: 'from a different agent' }, { agentId: 'agent-zzzz' }) + '\n';
  assert.equal(handbackMessage(swapped).message, 'from a different agent', 'unfiltered, the last call of anyone wins');
  assert.equal(handbackMessage(swapped, { agent: AGENT }).message, REPORT, 'filtered by agent id, ours wins');
});

test('extract writes the report and verifies its sha256; a wrong recorded hash fails, --no-hash reports it', () => {
  const dir = tmp();
  try {
    const projectsDir = fixtureProjects(dir);
    const good = [{ file: 'fake.md', agent: AGENT, sha256: sha256(REPORT) }];
    const res = extractReports({ outDir: join(dir, 'out'), projectsDir, session: SESSION, reports: good });
    assert.equal(res[0].verified, true);
    assert.equal(readFileSync(join(dir, 'out', 'fake.md'), 'utf8'), REPORT);
    const bad = [{ file: 'fake.md', agent: AGENT, sha256: 'deadbeef'.repeat(8) }];
    assert.throws(() => extractReports({ outDir: join(dir, 'out2'), projectsDir, session: SESSION, reports: bad }), /does not match the recorded/);
    assert.ok(!existsSync(join(dir, 'out2', 'fake.md')), 'nothing is written on a mismatch');
    const unverified = extractReports({ outDir: join(dir, 'out3'), projectsDir, session: SESSION, reports: bad, verifyHash: false });
    assert.equal(unverified[0].verified, null);
    assert.equal(unverified[0].sha256, sha256(REPORT));
    assert.throws(() => extractReports({ outDir: join(dir, 'out4'), projectsDir, session: 'other', reports: good }), /transcript not found/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('extract refuses an out-dir inside the repository, before writing anything', () => {
  const dir = tmp();
  try {
    const projectsDir = fixtureProjects(dir);
    const good = [{ file: 'fake.md', agent: AGENT, sha256: sha256(REPORT) }];
    const inside = join(REPO, 'docs', 'audit', 'never-written-by-this-test');
    assert.throws(() => extractReports({ outDir: inside, projectsDir, session: SESSION, reports: good }), /refusing to write inside the repository/);
    assert.ok(!existsSync(inside));
    assert.throws(() => extractReports({ outDir: join(dir, 'x'), projectsDir, session: SESSION, reports: good, repo: dir }), /refusing/);
    assert.equal(isInside('/a/b/c', '/a/b'), true);
    assert.equal(isInside('/a/bc', '/a/b'), false);
    assert.equal(projectSlug('/Users/x y/Mavan_Drawer'), '-Users-x-y-Mavan-Drawer');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('CLI extract: writes to a temp dir, exits 0 on a hash match and 1 on a mismatch', () => {
  const dir = tmp();
  try {
    const projectsDir = fixtureProjects(dir);
    // the CLI verifies against the REAL recorded hashes, which the fixture cannot match → exit 1 …
    const r = spawnSync('node', [TOOL, 'extract', join(dir, 'out'), '--projects', projectsDir, '--session', SESSION], { encoding: 'utf8' });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /transcript not found|does not match/);
    // … and refuses the repo outright
    const r2 = spawnSync('node', [TOOL, 'extract', join(REPO, 'docs', 'audit', 'nope'), '--projects', projectsDir, '--session', SESSION], { encoding: 'utf8' });
    assert.equal(r2.status, 1);
    assert.match(r2.stderr, /refusing to write inside the repository/);
    assert.ok(!existsSync(join(REPO, 'docs', 'audit', 'nope')));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ── anchors ─────────────────────────────────────────────────────────────────────────────────

test('praise anchors: sections, numbered items (bold or plain), and bold-led set entries under B', () => {
  const a = praiseAnchors(PRAISE);
  for (const k of ['A', 'A.1', 'A.2', 'B', 'B:Phosphor', 'B:Atlassian', 'B:Octicons', 'C1', 'C1.1', 'C2', 'C2.1', 'C2.2', 'C3', 'C4', 'C4.1', 'C4.2', 'D']) assert.ok(a.has(k), `missing ${k}`);
  assert.ok(!a.has('A.3'));
  assert.ok(!a.has('B:Marek Minor'), 'a plain numbered item under C4 is not a B entry');
  assert.match(a.get('A.2'), /Sets drift/);
  assert.match(a.get('C4.1'), /Marek Minor/);
  assert.ok(!/Atlassian, "Behind/.test(a.get('C4.1')), 'an item ends where the next begins');
});

test('construction anchors: §n, §n.m, headline items §1.k and table rows "§n.m Row"', () => {
  const a = constructionAnchors(CONSTRUCTION);
  for (const k of ['§1', '§1.1', '§1.2', '§1.7', '§2', '§2.1', '§2.5', '§2.5 Stroke', '§2.5 Stroke at 12', '§2.1 Keylines as shipped', '§3', '§3.1', '§3.5', '§5', '§6']) assert.ok(a.has(k), `missing ${k}`);
  assert.ok(!a.has('§2.9'));
  assert.ok(!a.has('§2.5 Dimension'), 'the header row is not a row anchor');
  assert.match(a.get('§1.2'), /Nobody publishes 1\.25/);
  assert.ok(!/Filled twin/.test(a.get('§1.2')), 'a headline item ends at the next one');
});

test('cited anchors: several per bracket, each with its own report name; code spans and run-on lines are not citations', () => {
  const c = citedAnchors('x [praise A.2; construction §2.5 Stroke at 12] y [construction §1.2] z [praise B:Atlassian; C2.1]');
  assert.deepEqual(c.map((x) => `${x.report}|${x.anchor}`), ['praise|A.2', 'construction|§2.5 Stroke at 12', 'construction|§1.2', 'praise|B:Atlassian', 'praise|C2.1']);
  assert.deepEqual(citedAnchors('cited here as `[praise …]` and `[construction §n]`'), [], 'a label in backticks is the grammar, not a citation');
  assert.deepEqual(citedAnchors('[praise C1;\nnot a citation]'), [], 'a bracket does not run past its line');
});

// ── quotes ──────────────────────────────────────────────────────────────────────────────────

test('an invented quote fails; a verbatim one passes; curly quotes and inline code are handled', () => {
  const reports = reportsOf();
  assert.equal(findQuote('Sets drift when nobody owns them', reports), 'field-survey-praise.md');
  assert.equal(findQuote('sets DRIFT when nobody owns them', reports), 'field-survey-praise.md', 'case-insensitive');
  assert.equal(findQuote('Nobody publishes 1.25 at 16', reports), 'field-construction-systems.md');
  assert.equal(findQuote('this sentence was never written', reports), null);
  assert.deepEqual(quotedStrings('He said “too restrictive” and "too generic" but `"code"` is not a quote.'), ['too restrictive', 'too generic']);
  assert.deepEqual(quotedStrings('a quotation "wrapped across\ntwo lines" is one quotation; a blank line\n\n"ends" it'), ['wrapped across two lines', 'ends'], 'a line break inside a paragraph does not hide a quotation');
  const spans = reportQuotedSpans(reports);
  assert.equal(isThirdParty('Sets drift when nobody owns them', 'field-survey-praise.md', spans), true, 'the report wraps it in quotes');
  assert.equal(isThirdParty('nobody owns them', 'field-survey-praise.md', spans), true, 'a fragment of a quoted span counts too');
  assert.equal(isThirdParty('Nobody publishes 1.25 at 16', 'field-construction-systems.md', spans), false, 'the report says this in its own voice');
  assert.equal(isThirdParty('anything', '/tmp/evidence/web/page.txt', spans), true, 'found only in the evidence');
  const dir = tmp();
  try {
    mkdirSync(join(dir, 'web'));
    writeFileSync(join(dir, 'web', 'page.txt'), 'the evidence page says: reducing both size and stroke worked well.');
    writeFileSync(join(dir, 'web', 'hn.json'), '{"text":"icons are &quot;a smudgy mess&quot; on 1x screens"}');
    const files = [join(dir, 'web', 'page.txt'), join(dir, 'web', 'hn.json')];
    assert.equal(findQuote('reducing both size and stroke worked well', reports, files), files[0], 'found only in the evidence');
    assert.equal(findQuote('a smudgy mess', reports, files), files[1], 'HTML-escaped evidence is unescaped before matching');
    assert.equal(findQuote('worked badly', reports, files), null);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('checkDocument: a bad anchor, an invented quote and a quote over 15 words are each a problem; a clean doc has none', () => {
  const reports = reportsOf();
  const clean = 'Atlassian found a hand-drawn 12 "too restrictive" [praise B:Atlassian; construction §2.5 Stroke at 12]. The field says "Sets drift when nobody owns them" [praise A.2].';
  const ok = checkDocument({ doc: clean, reports, transcription: false });
  assert.deepEqual(ok.problems, []);
  assert.equal(ok.transcription, null);
  assert.equal(ok.anchorsCited, 3);
  assert.equal(ok.quotes.length, 2);
  const withGuard = checkDocument({ doc: clean, reports });
  assert.ok(withGuard.transcription.length > 0, 'against a fake report the guard reports every embedded snippet it cannot find');
  assert.ok(withGuard.problems.every((p) => /not found in §/.test(p)), 'and nothing else');
  const dirty = 'See [praise A.9] and [construction §2.9 Stroke] and "an invented quotation" and "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen" [praise A.1]. HN: "My favourite open source icon set these days" [praise B:Phosphor].';
  const bad = checkDocument({ doc: dirty, reports, transcription: false });
  assert.ok(bad.problems.some((p) => /anchor not in the praise report: \[praise A\.9\]/.test(p)));
  assert.ok(bad.problems.some((p) => /anchor not in the construction report: \[construction §2\.9 Stroke\]/.test(p)));
  assert.ok(bad.problems.some((p) => /quote not found.*an invented quotation/.test(p)));
  assert.ok(bad.problems.some((p) => /over 15 words/.test(p)));
  assert.ok(bad.problems.some((p) => /third-party quotation of 8 words.*My favourite open source icon set these days/.test(p)), 'an HN comment of 7+ words is flagged even though it is verbatim');
  assert.equal(QUOTE_WORD_CAP, 7);
  assert.deepEqual(bad.quoteStats, { total: 1, distinct: 1, thirdParty: 1, atOrOverCap: 1, longest: 8 }, 'the stats count quotations that were found; the invented and the over-long ones were rejected first');
  // a long quotation in the report's own voice is counted but not flagged
  const own = checkDocument({ doc: 'The report says "Nobody publishes 1.25 at 16" [construction §1.2].', reports, transcription: false });
  assert.deepEqual(own.problems, []);
  assert.equal(own.quoteStats.thirdParty, 0);
});

// ── counts ──────────────────────────────────────────────────────────────────────────────────

test('failure modes: the C2 list parses with its shared ranks and HN/designer split', () => {
  const fm = failureModes(PRAISE);
  assert.deepEqual(fm.total, { n: 5, hn: 3, designers: 2 });
  assert.deepEqual(fm.modes, [
    { rank: 1, label: 'Generic, "slop"', n: 3, hn: 2, designers: 1 },
    { rank: 2, label: 'Blur', n: 1 },
    { rank: 2, label: 'Drift', n: 1 },
  ]);
});

test('recountTally: the coding table in a tally3.py recounts per type and per code', () => {
  const py = `rows = [
("a","P","Feather","https://x/1","BLUR OPT"),
("b","P","Lucide","https://x/2","GEN"),
("c","V","many","https://x/3","INC FILL"),
("d","P","generic","https://x/4","GEN BLUR"),
]
import collections`;
  const t = recountTally(py);
  assert.equal(t.rows, 4); assert.equal(t.independent, 3); assert.equal(t.vendor, 1);
  assert.deepEqual(t.P, [['BLUR', 2], ['GEN', 2], ['OPT', 1]]);
  assert.deepEqual(t.V, [['FILL', 1], ['INC', 1]]);
});

test('constructionCounts: systems, strokes at 16, multi-size policy, live-area rows, contradictions, filled-twin table', () => {
  const c = constructionCounts(CONSTRUCTION);
  assert.equal(c.systems, 2);
  assert.deepEqual(c.strokesAt16, { '1.0': 4, '1.5': 3 });
  assert.equal(c.multiSizeRows, 4);
  assert.equal(c.oneDrawingPerConcept, 1);
  assert.equal(c.oneTopologyWithAxes, 1);
  assert.equal(c.liveAreaRows, 2);
  assert.equal(c.contradictionTopics, 2);
  assert.equal(c.filledTwinSystems, 2);
});

// ── the calibration table ───────────────────────────────────────────────────────────────────

test('normalise: a length is a share of its canvas and a multiple of its own stroke, on canvases of 24, 16 and 20', () => {
  const row = { system: 'T', size: 24, canvas: 24, basis: 'S', stroke: { v: 2 }, circle: { v: 20 }, square: { v: 18 }, radius: { v: 2 }, gap: { v: 1 }, cut: null, bound: { v: 20, kind: 'live' } };
  const n = normaliseRow(row);
  assert.equal(n.strokeShare.toFixed(3), '8.333');
  assert.equal(n.circle.share.toFixed(2), '83.33'); assert.equal(n.circle.strokes, 10);
  assert.equal(n.square.share, 75); assert.equal(n.square.strokes, 9);
  assert.equal(n.radius.strokes, 1); assert.equal(n.gap.strokes, 0.5);
  assert.equal(n.cut, null);
  assert.equal(n.bound.kind, 'live'); assert.equal(n.margin.v, 2); assert.equal(n.margin.strokes, 1);
  const noStroke = normaliseRow({ ...row, stroke: null });
  assert.equal(noStroke.strokeShare, null); assert.equal(noStroke.circle.strokes, null); assert.equal(noStroke.circle.share.toFixed(2), '83.33');
  assert.match(normaliseTable([row]), /\| T \| 24 \| 8\.3% \| 20 \(83\.3% · 10\.00×\) \| 18 \(75\.0% · 9\.00×\) \| 2 \(8\.3% · 1\.00×\) \| 1 \(4\.2% · 0\.50×\) \| n\/s \| 20 live \(83\.3% · margin 2 = 1\.00×\) \| S \|/);
  // a 16 canvas: the share must divide by 16, not by a constant 24
  const r16 = normaliseRow({ system: 'U', size: 16, canvas: 16, basis: 'S', stroke: { v: 1 }, circle: { v: 14 }, square: { v: 12 }, radius: { v: 1 }, gap: { v: 1 }, cut: { v: 1.5 }, bound: { v: 14, kind: 'keyline' } });
  assert.equal(r16.strokeShare, 6.25); assert.equal(r16.circle.share, 87.5); assert.equal(r16.circle.strokes, 14);
  assert.equal(r16.square.share, 75); assert.equal(r16.cut.strokes, 1.5); assert.equal(r16.margin.v, 1); assert.equal(r16.margin.share, 6.25);
  // a 20 canvas with a range
  const r20 = normaliseRow({ system: 'V', size: 20, canvas: 20, basis: 'S', stroke: { v: 1.5 }, circle: null, square: null, radius: { v: { lo: 1, hi: 3 } }, gap: null, cut: null, bound: { v: 16, kind: 'live' } });
  assert.equal(r20.radius.range[0].share, 5); assert.equal(r20.radius.range[1].share, 15); assert.equal(r20.radius.range[1].strokes, 2);
  assert.equal(r20.margin.v, 2); assert.equal(r20.margin.strokes.toFixed(2), '1.33');
  assert.match(normaliseTable([r20 && { system: 'V', size: 20, canvas: 20, basis: 'S', stroke: { v: 1.5 }, circle: null, square: null, radius: { v: { lo: 1, hi: 3 } }, gap: null, cut: null, bound: { v: 16, kind: 'live' } }]), /\| 1–3 \(5\.0%–15\.0% · 0\.67×–2\.00×\) \| n\/s \| n\/s \| 16 live \(80\.0% · margin 2 = 1\.33×\) \|/);
});

test('a value is backed by its snippet only when it is one of the numbers written there (or derived from them)', () => {
  assert.equal(valueBacked({ v: 1.5 }, '24 = 1.5'), true);
  assert.equal(valueBacked({ v: 2.5 }, '24 = 1.5'), false, 'a wrong number beside the right snippet');
  assert.equal(valueBacked({ v: 1 }, '16 = 1.0'), true);
  assert.equal(valueBacked({ v: { lo: 1, hi: 3 } }, '1 to 3px depending on object roundness'), true);
  assert.equal(valueBacked({ v: { lo: 1, hi: 4 } }, '1 to 3px depending on object roundness'), false);
  assert.equal(valueBacked({ v: 22, calc: '2*10+2' }, 'Circle r 10 on the centreline', 2), true, 'derived from a stated number and the row stroke');
  assert.equal(valueBacked({ v: 22, calc: '2*10+2' }, 'Circle r 10 on the centreline', 1.5), false, 'the 2 is neither stated nor the stroke');
  assert.equal(valueBacked({ v: 23, calc: '2*10+2' }, 'Circle r 10 on the centreline', 2), false, 'the arithmetic does not give the value');
  assert.equal(valueBacked({ v: 22, calc: 'process.exit(1)' }, 'Circle r 10', 2), false, 'only arithmetic is evaluated');
});

test('transcription guard: a missing snippet, a wrong section, a wrong value and words gone from a repo file are each reported; a moved repo line is not; every embedded row has a source', () => {
  const dir = tmp();
  try {
    mkdirSync(join(dir, 'docs', 'audit'), { recursive: true });
    writeFileSync(join(dir, 'docs', 'audit', 'fake-card.md'), 'line one\n| cut | 1.00 · 1.50 · 2.00 |\nline three\n');
    writeFileSync(join(dir, 'ROOT.md'), 'the floor is 1.5 at every master\n');
    const base = { circle: null, square: null, radius: null, gap: null, cut: null, bound: null };
    const rows = [
      { ...base, system: 'ok', size: 16, canvas: 16, basis: 'S', stroke: { v: 1.5, say: '1.5px. Legacy set was 2px on a 24 canvas', at: '§2.5' } },
      { ...base, system: 'absent', size: 16, canvas: 16, basis: 'S', stroke: { v: 1.0, say: 'stroke 1.0 at 16', at: '§2.5' } },
      { ...base, system: 'nosec', size: 16, canvas: 16, basis: 'S', stroke: { v: 1.5, say: '1.5px', at: '§2.99' } },
      { ...base, system: 'wrongv', size: 16, canvas: 16, basis: 'S', stroke: { v: 2.5, say: '1.5px. Legacy set was 2px on a 24 canvas', at: '§2.5' } },
      { ...base, system: 'repo-ok', size: 24, canvas: 24, basis: 'K', stroke: { v: 1.5, say: '1.00 · 1.50 · 2.00', at: 'fake-card.md:2' }, gap: { v: 1.5, say: 'the floor is 1.5', at: 'ROOT.md:1' } },
      { ...base, system: 'repo-moved', size: 24, canvas: 24, basis: 'K', stroke: { v: 1.5, say: '1.00 · 1.50 · 2.00', at: 'fake-card.md:3' } },
      { ...base, system: 'repo-bad', size: 24, canvas: 24, basis: 'K', stroke: { v: 1.5, say: '1.00 · 1.50 · 2.50', at: 'fake-card.md:2' } },
      { ...base, system: 'nosay', size: 24, canvas: 24, basis: 'K', stroke: { v: 1.5, say: null, at: null } },
    ];
    const bad = checkTranscription(CONSTRUCTION, rows, dir);
    assert.deepEqual(bad.map((b) => b.split(':')[0]), ['absent 16 stroke', 'nosec 16 stroke', 'wrongv 16 stroke', 'repo-bad 24 stroke', 'nosay 24 stroke']);
    assert.match(bad[2], /value 2\.5 is not among the numbers in "1\.5px\. Legacy set was 2px on a 24 canvas"/);
    assert.match(bad[3], /not found in fake-card\.md:2 — nor on any other line of that file/);
    // the words cited at :3 sit on :2 — found, and said to have moved
    assert.deepEqual(locateSay('1.00 · 1.50 · 2.00', 'fake-card.md:3', new Map(), dir), { found: true, line: 2, stated: 3, moved: true });
    assert.deepEqual(locateSay('the floor is 1.5', 'ROOT.md:1', new Map(), dir), { found: true, line: 1, stated: 1, moved: false });
    assert.deepEqual(locateSay('the floor is 1.5', 'nowhere.md:1', new Map(), dir), { found: false, line: null, stated: 1, moved: false, missing: true });
    assert.match(checkTranscription('', [{ system: 'gone', size: 24, stroke: { v: 1.5, say: 'the floor is 1.5', at: 'nowhere.md:1' } }], dir)[0], /not found in nowhere\.md:1 — that file is not in the repo/);
    assert.deepEqual(movedCitations(rows, dir), [{ system: 'repo-moved', size: 24, key: 'stroke', at: 'fake-card.md:3', line: 2 }]);
    // words on more than one line: the nearest to the stated line is the one meant
    writeFileSync(join(dir, 'TWICE.md'), 'MIN_GAP = 1.5\na\nb\nc\nMIN_GAP = 1.5\n');
    assert.equal(locateSay('MIN_GAP = 1.5', 'TWICE.md:4', new Map(), dir).line, 5);
    assert.equal(locateSay('MIN_GAP = 1.5', 'TWICE.md:2', new Map(), dir).line, 1);
    assert.equal(sourceText('ROOT.md:1', new Map(), dir), 'the floor is 1.5 at every master');
    assert.equal(sourceText('nowhere.md:1', new Map(), dir), null);
  } finally { rmSync(dir, { recursive: true, force: true }); }
  // the real rows' repo citations hold in this repo, wherever their lines have moved to
  for (const r of CALIBRATION) for (const k of CALIBRATION_KEYS) {
    const d = r[k];
    if (d?.at && !d.at.startsWith('§')) assert.ok(locateSay(d.say, d.at, new Map(), REPO).found, `${r.system} ${r.size} ${k}: "${d.say}" is in ${d.at.replace(/:\d+$/, '')}`);
  }
  for (const r of CALIBRATION) for (const k of CALIBRATION_KEYS) {
    const d = r[k];
    if (!d) continue;
    assert.ok(d.say != null && d.at != null, `${r.system} ${r.size} ${k} has a source snippet`);
    assert.match(d.at, /^§\d+\.\d+$|^[\w./-]+\.(md|mjs):\d+$/, `${r.system} ${k} cites ${d.at}`);
    if (k === 'bound') assert.match(d.kind, /^(live|keyline|stated)$/, `${r.system} bound kind`);
  }
});

test('CLI check: a document with an invented quote exits 1, a clean one exits 0, and both print the counts', () => {
  const dir = tmp();
  try {
    writeFileSync(join(dir, 'field-survey-praise.md'), PRAISE);
    writeFileSync(join(dir, 'field-construction-systems.md'), CONSTRUCTION);
    writeFileSync(join(dir, 'clean.md'), 'Atlassian: "too restrictive" [praise B:Atlassian; construction §2.5]. One of 2 systems [construction §1.2].');
    writeFileSync(join(dir, 'dirty.md'), 'A "quotation nobody wrote" [praise A.1].');
    const run = (doc) => spawnSync('node', [TOOL, 'check', join(dir, doc), dir, '--no-hash'], { encoding: 'utf8' });
    const ok = run('clean.md');
    assert.equal(ok.status, 0, ok.stdout + ok.stderr);
    assert.match(ok.stdout, /quotes: 1 found verbatim \(1 distinct\) · third-party 1 · 7\+ words 0 · longest 2 words/);
    assert.match(ok.stdout, /praise C2, as the report states it: n=5/);
    assert.match(ok.stdout, /systems 2 · stroke at 16 stated as 1\.0 by 4, as 1\.5 by 3/);
    assert.match(ok.stdout, /calibration transcription: skipped/, 'the fake reports cannot back the real embedded rows, so the guard does not run without the recorded hashes');
    const bad = run('dirty.md');
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /quote not found.*quotation nobody wrote/);
    // and with the real hashes required, fake reports are refused outright
    const strict = spawnSync('node', [TOOL, 'check', join(dir, 'clean.md'), dir], { encoding: 'utf8' });
    assert.equal(strict.status, 1);
    assert.match(strict.stderr, /is not the recorded/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
