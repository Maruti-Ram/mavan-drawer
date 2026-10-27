// Tests for the React package's generator (plans/shipping.md card 2.2): names → components, the size rule, the
// optical margins, and the generated renderer itself, run on a two-name box against a stub React.
// `node --test tools/gen-react.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { componentName, master, opticalMargin, generate, MASTERS } from './gen-react.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('names: kebab-case → PascalCase, -filled → Filled', () => {
  assert.equal(componentName('check'), 'Check');
  assert.equal(componentName('check-filled'), 'CheckFilled');
  assert.equal(componentName('check-2-small'), 'Check2Small');
  assert.equal(componentName('check-2-small-filled'), 'Check2SmallFilled');
  assert.equal(componentName('arrow-up-right-2'), 'ArrowUpRight2');
});

test('the size rule: the master at or below the size, scaled up; below 16 the 16 master', () => {
  const rule = [[1, 16], [12, 16], [15, 16], [16, 16], [17, 16], [19, 16], [19.99, 16], [20, 20], [21, 20], [23, 20],
    [23.5, 20], [24, 24], [25, 24], [32, 24], [48, 24], [512, 24]];
  for (const [size, m] of rule) assert.equal(master(size), m, `size ${size}`);
});

test('optical margins: minus each bearing × size ÷ master, to 0.01 px, top right bottom left', () => {
  const check24 = [4.4, 7.41, 4.95, 7.34], check20 = [3.4, 6.15, 3.92, 6.06]; // [left, top, right, bottom]
  assert.equal(opticalMargin(check24, 24, 24), '-7.41px -4.95px -7.34px -4.4px');
  assert.equal(opticalMargin(check24, 48, 24), '-14.82px -9.9px -14.68px -8.8px');
  assert.equal(opticalMargin(check20, 21, 20), '-6.46px -4.12px -6.36px -3.57px', '21 px: the 20 master × 1.05');
  assert.equal(opticalMargin([2.37, 4.73, 2.77, 4.67], 12, 16), '-3.55px -2.08px -3.5px -1.78px', '12 px: the 16 master × 0.75');
  assert.equal(opticalMargin([0, 0, 0, 0], 17, 16), '0px 0px 0px 0px', 'no -0px');
  // every rounding is within 0.005 px of the exact product
  for (let size = 12; size <= 64; size++) for (let b = 0; b <= 12; b += 0.01) {
    const m = master(size), got = -parseFloat(opticalMargin([b, b, b, b], size, m));
    assert.ok(Math.abs(got - (b * size) / m) <= 0.005 + 1e-9, `${b} at ${size}`);
  }
});

/** A box of two names in the shipped form, and an output folder holding the real template. */
function fakeBox(names = ['check', 'check-2-small']) {
  const dir = mkdtempSync(join(tmpdir(), 'gen-react-')), box = join(dir, 'box'), out = join(dir, 'out');
  const files = names.flatMap((n) => [n, `${n}-filled`]);
  mkdirSync(out, { recursive: true });
  copyFileSync(join(ROOT, 'packages/icons-react/package.template.json'), join(out, 'package.template.json'));
  for (const m of MASTERS) {
    mkdirSync(join(box, 'svg', String(m)), { recursive: true });
    files.forEach((f, i) => writeFileSync(join(box, 'svg', String(m), `${f}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m} ${m}" fill="currentColor"><path fill-rule="evenodd" d="M${i} 0H${m}V${m}Z"/></svg>\n`));
  }
  writeFileSync(join(box, 'package.json'), JSON.stringify({ name: '@mavan/icons', version: '9.8.7' }));
  writeFileSync(join(box, 'meta.json'), JSON.stringify({ icons: names.map((name) => ({ name })) }));
  const metrics = { icons: {} };
  for (const m of MASTERS) metrics.icons[m] = Object.fromEntries(files.map((f) => [f, { optical: { left: m / 8, top: 1, right: 2, bottom: 0 } }]));
  writeFileSync(join(box, 'metrics.json'), JSON.stringify(metrics));
  writeFileSync(join(box, 'README.md'), '# readme\n');
  writeFileSync(join(box, 'LICENSE.md'), '# licence\n');
  // a stub React beside the output (generate clears the output folder): forwardRef hands back the render
  // function, createElement a plain tree
  mkdirSync(join(dir, 'node_modules/react'), { recursive: true });
  writeFileSync(join(dir, 'node_modules/react/index.js'),
    'exports.forwardRef = (f) => f; exports.createElement = (type, props, ...children) => ({ type, props, children });\n');
  return { dir, box, out, files };
}

test('generate: the shipped renderer follows the rule, the box\'s d, optical and title', () => {
  const { dir, box, out } = fakeBox();
  try {
    const r = generate({ boxDir: box, outDir: out });
    assert.deepEqual([r.version, r.names, r.files], ['9.8.7', 2, 4]);
    const pkg = JSON.parse(readFileSync(join(out, 'package.json'), 'utf8'));
    assert.equal(pkg.version, '9.8.7');
    assert.ok(existsSync(join(out, 'package.template.json')), 'the template survives the clear');
    const runtime = readFileSync(join(out, 'esm/create-icon.mjs'), 'utf8');
    assert.ok(runtime.includes(master.toString()) && runtime.includes(opticalMargin.toString()), 'the tested functions ship verbatim');

    const lib = createRequire(join(out, 'x.js'))('./cjs/index.js');
    assert.deepEqual(Object.keys(lib).sort(), ['Check', 'Check2Small', 'Check2SmallFilled', 'CheckFilled', 'Icon']);
    const svg = (C, props) => C(props, 'REF');
    for (const [size, m] of [[undefined, 24], [12, 16], [19, 16], [21, 20], [24, 24], [48, 24]]) {
      const el = svg(lib.Check2SmallFilled, { size });
      assert.equal(el.props.viewBox, `0 0 ${m} ${m}`);
      assert.equal(el.props.width, size ?? 24);
      assert.equal(el.children[1].props.d, `M3 0H${m}V${m}Z`, 'the box file\'s d, byte for byte');
      assert.equal(el.children[1].props.fillRule, 'evenodd');
    }
    const plain = svg(lib.Check, { className: 'a', width: 99, viewBox: 'no', 'data-x': 1 });
    assert.equal(plain.props.fill, 'currentColor');
    assert.equal(plain.props['aria-hidden'], 'true');
    assert.equal(plain.props.role, undefined);
    assert.equal(plain.props.className, 'a');
    assert.equal(plain.props['data-x'], 1);
    assert.equal(plain.props.width, 24, 'width follows size');
    assert.equal(plain.props.viewBox, '0 0 24 24');
    assert.equal(plain.props.ref, 'REF');
    assert.equal(plain.children[0], null, 'no <title>');
    assert.ok(!JSON.stringify(plain).includes('stroke'));

    const titled = svg(lib.Check, { title: 'Done' });
    assert.equal(titled.props.role, 'img');
    assert.equal(titled.props['aria-hidden'], undefined);
    assert.deepEqual(titled.children[0], { type: 'title', props: null, children: ['Done'] });

    const opt = svg(lib.Check, { size: 21, optical: true, style: { marginLeft: 1, color: 'red' } });
    assert.deepEqual(opt.props.style, { margin: '-1.05px -2.1px 0px -2.63px', marginLeft: 1, color: 'red' }, 'left 20/8 × 1.05; the caller\'s margin after');

    const viaIcon = svg(lib.Icon, { name: 'check-2-small', size: 16 });
    assert.equal(viaIcon.type, lib.Check2Small);
    assert.equal(viaIcon.props.ref, 'REF');
    assert.equal(viaIcon.props.name, undefined);
    assert.equal(svg(lib.Icon, { name: 'constructor' }), null, 'an unknown name renders nothing');

    // the code a customer receives names the package, never a folder of this repo (card 2.1's standard)
    const walk = (d, pre = '') => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name), `${pre}${e.name}/`) : [`${pre}${e.name}`]));
    const code = walk(out).filter((p) => !p.endsWith('.md') && p !== 'package.template.json');
    for (const p of code) {
      const t = readFileSync(join(out, p), 'utf8');
      assert.ok(!/\b(src|tools|dist|plans|lab|research|packages)\//.test(t) && !t.includes(ROOT), `${p} names a repo path`);
    }
    const heads = code.filter((p) => !p.includes('/icons/') && p !== 'package.json');
    assert.equal(heads.length, 8);
    for (const p of heads) assert.equal(readFileSync(join(out, p), 'utf8').split('\n')[0], '// @mavan/icons-react 9.8.7, generated from @mavan/icons 9.8.7. Do not edit.', p);

    // IconProps leaves out the svg's own `name`: it is Icon's prop alone, so <Check name="x" /> does not type-check
    for (const p of ['esm/index.d.mts', 'cjs/index.d.ts']) {
      const omit = /interface IconProps extends Omit<SVGProps<SVGSVGElement>, ([^>]*)>/.exec(readFileSync(join(out, p), 'utf8'));
      assert.ok(omit && omit[1].split(' | ').includes("'name'"), `${p}: IconProps omits name`);
      assert.match(readFileSync(join(out, p), 'utf8'), /const Icon: ForwardRefExoticComponent<IconProps & \{ name: IconName \} & RefAttributes<SVGSVGElement>>/);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('generate refuses an incomplete box and colliding names', () => {
  const a = fakeBox();
  try {
    rmSync(join(a.box, 'svg/20/check-filled.svg'));
    assert.throws(() => generate({ boxDir: a.box, outDir: a.out }), /svg\/20\/ holds 3 files, meta.json's 2 names × 2 = 4[\s\S]*missing check-filled.svg/);
  } finally { rmSync(a.dir, { recursive: true, force: true }); }
  const b = fakeBox(['a2b', 'a-2b']);
  try { assert.throws(() => generate({ boxDir: b.box, outDir: b.out }), /collision[\s\S]*a2b and a-2b → A2b|a-2b and a2b → A2b/); }
  finally { rmSync(b.dir, { recursive: true, force: true }); }
  const c = fakeBox(['icon']);
  try { assert.throws(() => generate({ boxDir: c.box, outDir: c.out }), /icon → Icon, which the package exports itself/); }
  finally { rmSync(c.dir, { recursive: true, force: true }); }
});
