// Tests for tools/audit/optical-probe.mjs — the core measurements, on inline fixtures.
// Every fixture is a path string copied from a committed drawing or drawn by hand; no scratch
// paths, no pin. Run: node --test tools/audit/optical-probe.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bbox } from '../geometry.mjs';
import {
  triangleOffset, triangleOffsetTrue, bendGeometry, recommend, mirrors, centreOffset, gridRounding, partsOf, partProud,
  bodyCentred, keylineEdgeHeld, classifyOffcentre, proseHints, centrelineCentroid, polygonCentroid, isClosedTriangle,
  shapeClass, readNotes, r05, K,
} from './optical-probe.mjs';

const r2 = (v) => Math.round(v * 100) / 100 || 0;

/** A drawing the way dist/icons.json carries it: paths, areas, stroke and the build's 2 dp ink box. */
function icon(paths, { areas = [], stroke = 1.5 } = {}) {
  const h = stroke / 2, boxes = [];
  if (paths.length) { const b = bbox(paths); boxes.push([b.x0 - h, b.y0 - h, b.x1 + h, b.y1 + h]); }
  if (areas.length) { const b = bbox(areas); boxes.push([b.x0, b.y0, b.x1, b.y1]); }
  const [x0, y0, x1, y1] = [0, 1, 2, 3].map((k) => (k < 2 ? Math.min : Math.max)(...boxes.map((b) => b[k])));
  return { paths, areas, stroke, ink: { x: r2(x0), y: r2(y0), w: r2(x1 - x0), h: r2(y1 - y0) } };
}

// src/icons/24/chevron-down.svg — classic, declared optical 0 0.5
const CHEVRON_DOWN = 'M5.75 9.54L11.47 15.25A0.75 0.75 0 0 0 12.53 15.25L18.25 9.54';
// src/icons/24/check.svg — classic, box-centred by decision
const CHECK = 'M4.75 12.66L8.72 16.63A0.75 0.75 0 0 0 9.78 16.63L19.25 7.16';
// src/icons/24/play.svg — a closed triangle with paired corner arcs; declared optical 0.95 0
const PLAY = 'M5.7 5.25A1.5 1.5 0 0 1 7.2 3.75A1.5 1.5 0 0 1 7.96 3.96L19.46 10.71A1.5 1.5 0 0 1 20.2 12A1.5 1.5 0 0 1 19.46 13.29L7.96 20.04A1.5 1.5 0 0 1 7.2 20.25A1.5 1.5 0 0 1 5.7 18.75Z';
// src/icons/24/watch-2.svg — case, two straps, and a crown standing proud on the right
const WATCH_2 = [
  'M8.25 5.75H15.75A2.5 2.5 0 0 1 18.25 8.25V15.75A2.5 2.5 0 0 1 15.75 18.25H8.25A2.5 2.5 0 0 1 5.75 15.75V8.25A2.5 2.5 0 0 1 8.25 5.75Z',
  'M8.75 5.75V4.25A1.5 1.5 0 0 1 10.25 2.75H13.75A1.5 1.5 0 0 1 15.25 4.25V5.75',
  'M8.75 18.25V19.75A1.5 1.5 0 0 0 10.25 21.25H13.75A1.5 1.5 0 0 0 15.25 19.75V18.25',
  'M18.25 12H19.25',
];

test('triangleOffset reproduces the sheet on the classic chevron: offset −0.99 up, recommendation 0.5 down', () => {
  const tri = triangleOffset(icon([CHEVRON_DOWN]));
  assert.ok(Math.abs(tri[0]) < 0.005, `x offset ${tri[0]}`);
  assert.ok(Math.abs(tri[1] + 0.99) < 0.01, `y offset ${tri[1]}`);
  assert.deepEqual(recommend(tri), [0, 0.5]);                   // C15's calibration: classic 0.5
  assert.equal(K, 0.5);
});

test('triangleOffset is defined only on one open bend (M L A L)', () => {
  assert.equal(triangleOffset(icon([CHEVRON_DOWN, 'M12 5.25V18.75'])), null);   // an arrow: bend + shaft
  assert.equal(triangleOffset(icon([PLAY])), null);                             // a closed triangle
  assert.equal(triangleOffset(icon([CHEVRON_DOWN], { areas: ['M4 4H20V20H4Z'] })), null);
  const check = triangleOffset(icon([CHECK]));
  assert.ok(check[0] < -0.9 && check[1] > 0.2, `check triangle ${check}`);      // lopsided both ways
});

test('mirrors: a chevron mirrors left–right only, a check neither way, a plus both', () => {
  assert.deepEqual(mirrors(icon([CHEVRON_DOWN])), [true, false]);
  assert.deepEqual(mirrors(icon([CHECK])), [false, false]);
  assert.deepEqual(mirrors(icon(['M4 12H20', 'M12 4V20'])), [true, true]);
});

test('centreOffset and gridRounding', () => {
  assert.deepEqual(centreOffset({ x: 5, y: 2, w: 15, h: 20 }, 24), [0.5, 0]);
  // 13.75 wide at 20: an exactly centred box would start at 3.125, off the quarter grid
  const g = gridRounding({ x: 3.25, y: 3, w: 13.75, h: 14 }, 20, 0.25, [0.125, 0]);
  assert.equal(g[0].centredEdgeOnGrid, false);
  assert.equal(g[0].edgeOnGrid, true);
  assert.equal(g[0].rounding, true);
  assert.equal(g[1].rounding, false);
  // 14 wide: centred is 3, on the grid — an offset of 0.125 is not rounding
  assert.equal(gridRounding({ x: 3.125, y: 3, w: 14, h: 14 }, 20, 0.25, [0.125, 0])[0].rounding, false);
});

test('partProud finds the crown of watch-2: the rest is centred, the stub stands one unit past', () => {
  const i = icon(WATCH_2);
  assert.deepEqual(centreOffset(i.ink, 24), [0.5, 0]);
  const p = partProud(i, 24, [0.5, 0]);
  assert.equal(p.part.index, 3);
  assert.equal(p.axis, 'x');
  assert.equal(p.past, 1);
  assert.equal(p.restCentre, 12);
  assert.equal(partProud(icon([CHEVRON_DOWN]), 24, [0, 0.5]), null);           // one part: nothing to remove
  assert.equal(partsOf(icon([], { areas: ['M4 4H20V20H4ZM8 8H16V16H8Z'] })).length, 2);   // area subpaths are parts
});

test('bodyCentred: a centred body with two legs that set the box', () => {
  const i = icon(['M6 6H18V18H6Z', 'M6 18L3 22', 'M18 18L21 22']);
  const off = centreOffset(i.ink, 24);
  assert.ok(off[1] > 0.005, `off ${off}`);
  const b = bodyCentred(i, 24, off);
  assert.equal(b.body.index, 0);
  assert.equal(b.others, 2);
  assert.equal(bodyCentred(icon(['M6 7H18V19H6Z', 'M12 19V22']), 24, [0, 0.5]), null);   // the body itself is off
});

test('proseHints matches a recorded placement and ignores "centred"', () => {
  assert.ok(proseHints('ink box 15x20 (agreed box, 0.5 off the case centre, as D)').length === 1);
  assert.ok(proseHints('Box 0.25 right of centre at 20, 0.125 at 16, as B.').length === 1);
  assert.equal(proseHints('Ink 18x18, centred on 12,12, filled identical.').length, 0);
});

test('centrelineCentroid weights by length; polygonCentroid is the area centroid', () => {
  assert.deepEqual(centrelineCentroid(['M4 12H20']).slice(0, 2).map(r2), [12, 12]);
  const L = centrelineCentroid(['M4 4V20H20']);                     // two equal legs: midpoints (4,12) and (12,20)
  assert.deepEqual(L.slice(0, 2).map(r2), [8, 16]);
  assert.equal(r2(L[2]), 32);
  const sq = polygonCentroid('M4 4H20V20H4Z');
  assert.deepEqual(sq.slice(0, 2).map(r2), [12, 12]);
  assert.equal(r2(sq[2]), 256);
});

test('a closed triangle is recognised and play\'s shipped shift equals its centroid × 0.5', () => {
  assert.equal(isClosedTriangle(PLAY), true);
  assert.equal(isClosedTriangle(CHEVRON_DOWN), false);
  assert.equal(shapeClass(icon([PLAY])), 'closed triangle');
  assert.equal(shapeClass(icon([CHEVRON_DOWN])), 'single bend');
  const i = icon([PLAY]), c = polygonCentroid(PLAY);
  assert.equal(r05(-K * (c[0] - (i.ink.x + i.ink.w / 2))), 0.95);   // src/icons/24/play.svg: optical 0.95 0
});

// src/icons/24/bug.svg — body on the circle keyline's foot, the dome 0.5 short of its top; ink 20×19.5, 0.25 low
const BUG_24 = [
  'M8.75 6.25H15.25A2 2 0 0 1 17.25 8.25V16A5.25 5.25 0 0 1 6.75 16V8.25A2 2 0 0 1 8.75 6.25Z',
  'M9 6.25A3 3 0 0 1 15 6.25', 'M12 9.25V21.25', 'M6.75 9.75L2.75 5.75', 'M17.25 9.75L21.25 5.75',
  'M6.75 13.25H2.75', 'M17.25 13.25H21.25', 'M6.87 17.13L2.75 21.25', 'M17.13 17.13L21.25 21.25',
];
const BUG_PROSE = 'Ink 20x19.5 · 16x16 · 14x14, circle keyline, centred. The seam lands on a half pixel at 16 and reads grey.';
// src/icons/20/map-pin.svg — head on the portrait keyline's top, the tip 0.5 short of its foot; ink 12×15.5, 0.25 high
const MAP_PIN_20 = [
  'M5.66 10.95A5.25 5.25 0 0 1 4.75 8A5.25 5.25 0 0 1 15.25 8A5.25 5.25 0 0 1 14.34 10.95L10.62 16.42A0.75 0.75 0 0 1 10 16.75A0.75 0.75 0 0 1 9.38 16.42Z',
  'M7.75 8A2.25 2.25 0 1 0 12.25 8A2.25 2.25 0 1 0 7.75 8Z',
];
// src/icons/24/check-2-small.svg — a bend with unequal legs
const CHECK_2_SMALL = 'M6.25 13.41L8.72 15.88A0.75 0.75 0 0 0 9.78 15.88L17.75 7.91';
// the classic chevron with its right leg's end raised 0.3: it no longer mirrors left–right, but every mirrored point lands within 0.3 of the other leg
const LOPSIDED_CHEVRON = 'M5.75 9.54L11.47 15.25A0.75 0.75 0 0 0 12.53 15.25L18.25 9.24';
// src/icons/16/list-bullet.svg — ink 2.375 → 14.0; the build's 2 dp box reads x 2.38, w 11.63, so x + w = 14.01 against the mark ceiling's edge at 14
const LIST_BULLET_16 = [
  'M3 3.5A0.25 0.25 0 1 0 3.5 3.5A0.25 0.25 0 1 0 3 3.5Z', 'M3 8A0.25 0.25 0 1 0 3.5 8A0.25 0.25 0 1 0 3 8Z',
  'M3 12.5A0.25 0.25 0 1 0 3.5 12.5A0.25 0.25 0 1 0 3 12.5Z', 'M6.625 3.5h6.75', 'M6.625 8h6.75', 'M6.625 12.5h6.75',
];

test('keylineEdgeHeld names the held side: bug sits on the circle keyline\'s foot, map-pin on the portrait keyline\'s top', () => {
  const bug = icon(BUG_24), bugOff = centreOffset(bug.ink, 24);
  assert.deepEqual(bugOff, [0, 0.25]);
  const b = keylineEdgeHeld(bug, 24, bugOff);
  assert.equal(b.held, 'bottom');
  assert.equal(b.keyline, 20);
  assert.ok(Math.abs(b.short - 0.5) < 0.011, `short ${b.short}`);
  const pin = icon(MAP_PIN_20), pinOff = centreOffset(pin.ink, 20);
  assert.deepEqual(pinOff, [0, -0.25]);
  const p = keylineEdgeHeld(pin, 20, pinOff);
  assert.equal(p.held, 'top');
  assert.equal(p.keyline, 16);
  assert.ok(Math.abs(p.short - 0.5) < 0.011, `short ${p.short}`);
  // off centre with no edge on any keyline: 16 wide at 4.25 → 20.25 (keyline edges at 24 are 2, 3, 4 and 20, 21, 22)
  assert.equal(keylineEdgeHeld(icon(['M5 3H19.5V21H5Z']), 24, [0.25, 0]), null);
  assert.equal(keylineEdgeHeld(icon(['M4 12H20', 'M12 4V20']), 24, [0, 0]), null);     // centred: nothing to explain
});

test('mirrors tolerates 0.2 and no more: a chevron lopsided by 0.3 mirrors neither way', () => {
  assert.deepEqual(mirrors(icon([LOPSIDED_CHEVRON])), [false, false]);
  assert.deepEqual(mirrors(icon([CHEVRON_DOWN])), [true, false]);   // and the even one still does
});

test('the keyline-edge tolerance absorbs the 2 dp box: list-bullet at 16 lands on the mark ceiling, not in the prose bucket', () => {
  const lb = icon(LIST_BULLET_16, { stroke: 1.25 });
  assert.equal(lb.ink.x, 2.38);
  assert.equal(lb.ink.w, 11.63);
  assert.ok(Math.abs(lb.ink.x + lb.ink.w - 14.01) < 1e-9, 'the fixture must drift the way the build does');
  const off = centreOffset(lb.ink, 16);
  const held = keylineEdgeHeld(lb, 16, off);
  assert.equal(held?.held, 'right');
  assert.equal(held?.keyline, 12);
  const i = { master: 16, name: 'list-bullet', concept: 'list-bullet', style: 'outline', shift: [0, 0], anchor: null,
    prose: 'the outline sits inside it, right of centre by half the dot\'s growth', ...lb };
  assert.equal(classifyOffcentre([i]).classed[0].cause, 'one edge on the keyline, the other side short');
});

test('the cause order: a keyline edge held is named before a prose hint, a proud part before both', () => {
  const bug = { master: 24, name: 'bug', concept: 'bug', style: 'outline', shift: [0, 0], anchor: null, prose: BUG_PROSE, ...icon(BUG_24) };
  const watch = { master: 24, name: 'watch-2', concept: 'watch-2', style: 'outline', shift: [0, 0], anchor: null, prose: 'agreed box, 0.5 off the case centre', ...icon(WATCH_2) };
  const { classed, rest } = classifyOffcentre([bug, watch]);
  assert.equal(rest.length, 2);
  const byName = Object.fromEntries(classed.map((c) => [c.i.name, c]));
  assert.ok(byName.bug.hints.length > 0, 'the fixture prose must carry a placement word for the order to be tested');
  assert.equal(byName.bug.cause, 'one edge on the keyline, the other side short');
  assert.equal(byName['watch-2'].cause, 'part standing proud');
  assert.equal(byName.bug.reason, null);
  assert.ok(byName['watch-2'].reason, 'watch-2 at 24 is in STATED_REASON');
});

test('the true arc apex: equal to the sheet\'s on an equal-legged chevron, one step away on check-2-small', () => {
  const chev = icon([CHEVRON_DOWN]);
  const a = triangleOffset(chev), b = triangleOffsetTrue(chev);
  assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6);
  assert.ok(bendGeometry(chev).apexGap < 1e-6);
  const check = icon([CHECK_2_SMALL]);
  assert.deepEqual(recommend(triangleOffset(check)), [0.5, -0.25]);        // the sheet's measure
  assert.deepEqual(recommend(triangleOffsetTrue(check)), [0.45, -0.25]);   // the arc's real midpoint
  const g = bendGeometry(check);
  assert.ok(g.apexGap > 0.05 && g.apexGap < 0.2, `apex gap ${g.apexGap}`);
  assert.ok(g.legRatio > 2, `leg ratio ${g.legRatio}`);
});

test('readNotes separates keyed notes from prose', () => {
  const n = readNotes('<svg>\n  <!-- tags: a, b -->\n  <!-- box: 15x20 -->\n  <!-- optical: -0.45 0 -->\n  <!-- anchor: volume -->\n  <!-- The drawing, 0.5 off the case centre. -->\n</svg>');
  assert.deepEqual(n.optical, [-0.45, 0]);
  assert.equal(n.box, '15x20');
  assert.equal(n.anchor, 'volume');
  assert.equal(n.prose, 'The drawing, 0.5 off the case centre.');
  assert.equal(readNotes('<svg><!-- plain --></svg>').optical, null);
});
