#!/usr/bin/env python3
"""tools/audit/refs/independent-check.py — three headline numbers re-derived with NO code shared with the JS tools.

Reads only the ingested records under research/references/{untitled,central}/figma/ (gitignored third-party
geometry; nothing is written). Run: python3 tools/audit/refs/independent-check.py

  1. Untitled UI: outline vs solid outer ink box, Figma's own render bounds only      (JS report: 1087 of 1170 hold to 0.01)
  2. Central: stroke axis, radius 0 round, whole box held at stroke 1.5 and 1, render bounds only, non-rotated
                                                                                      (JS, verified boxes: 1135 of 1651 = 68.7%)
  3. How many outlines have a slanted-ended open stroke (an end more than 1 degree off horizontal/vertical)
                                                                                      (JS report: Untitled 606 of 1170, Central 886 of 1926)
"""
import glob, json, math, os, re

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'research', 'references')
SKIP = ('index.json', 'catalogue.json', 'calibration.json')

def concepts(source):
    for f in sorted(glob.glob(os.path.join(BASE, source, 'figma', '*.json'))):
        if os.path.basename(f) in SKIP:
            continue
        yield json.load(open(f))

def render_box(r):
    k = r['measure']['ink']
    return (k['x']['abs'], k['y']['abs'], k['x']['abs'] + k['w']['abs'], k['y']['abs'] + k['h']['abs'])

# 1 ---------------------------------------------------------------------------------------------
n = hold = 0
for c in concepts('untitled'):
    o = [r for r in c['records'] if r['style'] == 'outline']
    s = [r for r in c['records'] if r['style'] == 'filled']
    if len(o) != 1 or len(s) != 1:
        continue
    a, b = render_box(o[0]), render_box(s[0])
    n += 1
    hold += max(abs(x - y) for x, y in zip(a, b)) <= 0.01
print('1. Untitled UI pairs (one outline, one solid):', n, '| outer box equal on all four sides to 0.01:', hold, '(%.1f%%)' % (100 * hold / n))

# 2 ---------------------------------------------------------------------------------------------
tot = held = 0
for c in concepts('central'):
    by = {(r['variant']['filled'], r['variant']['stroke'], r['variant']['radius'], r['variant']['join']): r for r in c['records']}
    rs = [by.get(('off', st, '0', 'round')) for st in ('2', '1.5', '1')]
    if any(r is None for r in rs) or any(r['meta']['flags'].get('rotated') for r in rs):
        continue
    b = [render_box(r) for r in rs]
    tot += 1
    held += all(max(abs(x - y) for x, y in zip(b[0], b[i])) <= 0.02 for i in (1, 2))
print('2. Central, radius 0 round, non-rotated triples:', tot, '| whole box held at 1.5 and 1:', held, '(%.1f%%; the JS figure uses verified boxes only)' % (100 * held / tot))

# 3 ---------------------------------------------------------------------------------------------
def subpaths(d):
    toks = re.findall(r'[MLCQZ]|-?\d*\.?\d+(?:[eE][-+]?\d+)?', d)
    subs, cur, i, cmd = [], None, 0, None
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t; i += 1
            if cmd == 'Z':
                if cur: cur['closed'] = True
                continue
        k = {'M': 2, 'L': 2, 'C': 6, 'Q': 4}[cmd]
        v = [float(x) for x in toks[i:i + k]]; i += k
        if cmd == 'M':
            cur = {'pts': [(v[0], v[1])], 'segs': [], 'closed': False}; subs.append(cur); cmd = 'L'
        elif cmd == 'L':
            cur['segs'].append(('L', cur['pts'][-1], None, None, (v[0], v[1]))); cur['pts'].append((v[0], v[1]))
        elif cmd == 'C':
            cur['segs'].append(('C', cur['pts'][-1], (v[0], v[1]), (v[2], v[3]), (v[4], v[5]))); cur['pts'].append((v[4], v[5]))
        else:
            cur['segs'].append(('Q', cur['pts'][-1], (v[0], v[1]), None, (v[2], v[3]))); cur['pts'].append((v[2], v[3]))
    return subs

def off_axis(dx, dy):
    a = math.degrees(math.atan2(dy, dx)) % 90
    return min(a, 90 - a)

def end_tangents(seg):
    kind, a, c1, c2, b = seg
    sub = lambda p, q: (p[0] - q[0], p[1] - q[1])
    if kind == 'L':
        t0 = sub(b, a); t1 = t0
    elif kind == 'Q':
        t0 = sub(c1, a); t1 = sub(b, c1)
    else:
        t0 = sub(c1, a)
        if math.hypot(*t0) < 1e-6: t0 = sub(c2, a)
        t1 = sub(b, c2)
        if math.hypot(*t1) < 1e-6: t1 = sub(b, c1)
    if math.hypot(*t0) < 1e-6: t0 = sub(b, a)
    if math.hypot(*t1) < 1e-6: t1 = sub(b, a)
    return t0, t1

def slanted_ended(rec):
    for p in rec['paths']:
        if p['paint'] not in ('stroke', 'both'):
            continue
        for sp in subpaths(p['d']):
            if sp['closed'] or not sp['segs']:
                continue
            if sum(math.dist(s[1], s[4]) for s in sp['segs']) < 1e-6:
                continue
            for t in (end_tangents(sp['segs'][0])[0], end_tangents(sp['segs'][-1])[1]):
                if math.hypot(*t) > 1e-9 and off_axis(*t) > 1:
                    return True
    return False

n = d = 0
for c in concepts('untitled'):
    o = [r for r in c['records'] if r['style'] == 'outline']
    s = [r for r in c['records'] if r['style'] == 'filled']
    if len(o) == 1 and len(s) == 1:
        n += 1; d += slanted_ended(o[0])
print('3. Untitled UI pairs with a slanted-ended outline:', d, 'of', n, '(%.1f%%)' % (100 * d / n))
n = d = 0
for c in concepts('central'):
    r = [x for x in c['records'] if (x['variant']['filled'], x['variant']['stroke'], x['variant']['radius'], x['variant']['join']) == ('off', '2', '0', 'round')]
    if r:
        n += 1; d += slanted_ended(r[0])
print('   Central icons with a slanted-ended outline (stroke 2, radius 0, round):', d, 'of', n, '(%.1f%%)' % (100 * d / n))
