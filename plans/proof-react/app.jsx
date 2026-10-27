// The browser page of the card 2.2 proof, bundled by browser.mjs with esbuild against apps/<react version>/ and
// client-rendered with react-dom/client. ?mode= picks what it draws; it sets window.__ready when the page is final.
//   pixels&size=S&kind=K  every icon at S in one grid at the page's top left, drawn as K: react (the component),
//                  img (the box's .svg as <img>) or inline (the box's .svg text inlined); each kind is its own page
//                  load, so every icon is rasterised at the same device position in each
//                  (the <img> gets a blob: URL of the file's exact bytes, typed image/svg+xml: 2,620 parallel image
//                  requests overrun Chromium's outstanding-request limit, and the image path is the same)
//   color          every icon at 24 inside color: rgb(214, 40, 110), on a transparent page
//   a11y           every icon without and with a title; Icon by name beside its component at 16 · 20 · 24; refs
//   optical&size=S every icon at S with optical, and without, each in its own inline-flex box in a flex row
//   contact        every outline icon at 16, for the contact sheet
import * as Pkg from '@mavan/icons-react';
import { Icon, Check } from '@mavan/icons-react';
import { useEffect, useRef, version } from 'react';
import { createRoot } from 'react-dom/client';

const q = new URLSearchParams(location.search);
const mode = q.get('mode'), S = Number(q.get('size') || 24);
const pascal = (f) => f.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const master = (s) => (s >= 24 ? 24 : s >= 20 ? 20 : 16);
export const COLS = 64;

function Done({ children, check }) {
  useEffect(() => {
    (async () => {
      await Promise.all([...document.images].map((i) => i.decode().catch(() => { window.__imgFail = (window.__imgFail || 0) + 1; })));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.__result = check ? check() : {};
      window.__ready = true;
    })();
  }, []);
  return children;
}

function Pixels({ files, texts, urls }) {
  const kind = q.get('kind');
  const P = S + 8, m = master(S);
  const at = (i) => ({ position: 'absolute', left: (i % COLS) * P + 4, top: Math.floor(i / COLS) * P + 4 });
  return (
    <div style={{ position: 'relative', width: COLS * P, height: Math.ceil(files.length / COLS) * P }}>
      {kind === 'react' && files.map((f, i) => { const C = Pkg[pascal(f)]; return <C key={f} size={S} style={{ display: 'block', ...at(i) }} />; })}
      {kind === 'img' && files.map((f, i) => <img key={f} alt="" src={urls[f]} width={S} height={S} style={{ display: 'block', ...at(i) }} />)}
      {kind === 'inline' && files.map((f, i) => <div key={f} className="inl" style={{ width: S, height: S, ...at(i) }} dangerouslySetInnerHTML={{ __html: texts[f] }} />)}
    </div>
  );
}

function Color({ files }) {
  return (
    <div id="color" style={{ color: 'rgb(214, 40, 110)', display: 'flex', flexWrap: 'wrap', gap: 8, width: COLS * 32 }}>
      {files.map((f) => { const C = Pkg[pascal(f)]; return <C key={f} size={24} style={{ display: 'block' }} />; })}
    </div>
  );
}
const colorCheck = () => {
  const bad = [];
  for (const el of document.querySelectorAll('#color svg, #color path')) if (getComputedStyle(el).fill !== 'rgb(214, 40, 110)') bad.push(getComputedStyle(el).fill);
  return { checked: document.querySelectorAll('#color svg, #color path').length, bad: bad.slice(0, 5), badCount: bad.length };
};

function A11y({ files }) {
  const r1 = useRef(null), r2 = useRef(null);
  window.__refs = [r1, r2];
  return (
    <>
      <div id="deco">{files.map((f) => { const C = Pkg[pascal(f)]; return <C key={f} size={16} />; })}</div>
      <div id="titled">{files.map((f) => { const C = Pkg[pascal(f)]; return <C key={f} size={16} title={`Label ${f}`} />; })}</div>
      <div id="byname">{[16, 20, 24].flatMap((s) => files.map((f) => { const C = Pkg[pascal(f)]; return <span key={`${s}${f}`} data-f={f}><Icon name={f} size={s} /><C size={s} /></span>; }))}</div>
      <div id="refs"><Check ref={r1} /><Icon name="check-filled" ref={r2} /></div>
    </>
  );
}
const a11yCheck = (files) => () => {
  const deco = [...document.querySelectorAll('#deco > svg')], titled = [...document.querySelectorAll('#titled > svg')];
  const decoBad = deco.filter((s) => s.getAttribute('aria-hidden') !== 'true' || s.getAttribute('focusable') !== 'false' || s.hasAttribute('role') || s.querySelector('title')).length;
  const titledBad = titled.filter((s, i) => s.getAttribute('role') !== 'img' || s.hasAttribute('aria-hidden') || s.firstElementChild?.tagName !== 'title'
    || s.firstElementChild.textContent !== `Label ${files[i]}`).length;
  const pairs = [...document.querySelectorAll('#byname > span')];
  const byNameBad = pairs.filter((p) => p.children.length !== 2 || p.children[0].outerHTML !== p.children[1].outerHTML).map((p) => p.dataset.f);
  const [r1, r2] = window.__refs;
  return {
    deco: deco.length, decoBad, titled: titled.length, titledBad, byName: pairs.length, byNameBad: byNameBad.slice(0, 5), byNameBadCount: byNameBad.length,
    headTitles: [...document.head.querySelectorAll('title')].map((t) => t.textContent), documentTitle: document.title,
    titlesOutsideSvg: [...document.querySelectorAll('title')].filter((t) => !t.closest('svg') && !t.closest('head')).length,
    refs: [r1.current instanceof SVGSVGElement && r1.current.querySelector('path') !== null, r2.current instanceof SVGSVGElement],
    react: version,
    globals: Object.keys(Pkg).filter((k) => k in window),
  };
};

function Optical({ files }) {
  const box = { display: 'inline-flex', alignItems: 'flex-start' };
  return (
    <>
      <div id="on" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 4 }}>
        {files.map((f) => { const C = Pkg[pascal(f)]; return <div key={f} style={box}><C size={S} optical /></div>; })}
      </div>
      <div id="off" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 4 }}>
        {files.map((f) => { const C = Pkg[pascal(f)]; return <div key={f} style={box}><C size={S} /></div>; })}
      </div>
    </>
  );
}
const opticalCheck = () => {
  const read = (id) => [...document.querySelectorAll(`#${id} > div`)].map((d) => { const r = d.getBoundingClientRect(); return [r.width, r.height]; });
  return { on: read('on'), off: read('off') };
};

function Contact({ files }) {
  const outline = files.filter((f) => !f.endsWith('-filled'));
  return (
    <div id="sheet" style={{ display: 'grid', gridTemplateColumns: 'repeat(40, 24px)', gridAutoRows: '24px', padding: 12, width: 'max-content', background: '#fff', color: '#000' }}>
      {outline.map((f) => { const C = Pkg[pascal(f)]; return <div key={f} style={{ display: 'grid', placeItems: 'center' }}><C size={16} style={{ display: 'block' }} /></div>; })}
    </div>
  );
}

(async () => {
  const { files } = await (await fetch('/files.json')).json();
  let body, check;
  if (mode === 'pixels') {
    const texts = q.get('kind') === 'react' ? {} : await (await fetch(`/box-text/${master(S)}.json`)).json();
    const urls = {};
    if (q.get('kind') === 'img') {
      // decode every image before it goes on the page (decoding them in place costs a frame each: 90 s, measured)
      window.__keep = await Promise.all(files.map(async (f) => {
        const im = new Image(S, S);
        im.src = urls[f] = URL.createObjectURL(new Blob([texts[f]], { type: 'image/svg+xml' }));
        await im.decode();
        return im;
      }));
    }
    body = <Pixels files={files} texts={texts} urls={urls} />;
  }
  else if (mode === 'color') { body = <Color files={files} />; check = colorCheck; }
  else if (mode === 'a11y') { body = <A11y files={files} />; check = a11yCheck(files); }
  else if (mode === 'optical') { body = <Optical files={files} />; check = opticalCheck; }
  else if (mode === 'contact') body = <Contact files={files} />;
  createRoot(document.getElementById('root')).render(<Done check={check}>{body}</Done>);
})();
