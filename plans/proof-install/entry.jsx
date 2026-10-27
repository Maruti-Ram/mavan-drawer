// The browser page of the card 3.1 proof. Bundled by shoot.mjs with the throwaway app's own esbuild, against the
// packages the app installed from the tarballs. ?mode= picks what it draws; window.__ready says the page is final.
//
//   mode=grid&kind=K&size=S   every icon at S px (S = 16 · 20 · 24, so the master is S), one per slot of a 64-column
//                  grid at the page's top left, all at the same positions in every kind:
//                    lab    the stroked source as lab/library.html puts it on the page (the lab's own `svg` template,
//                           innerHTML, the lab's CSS `svg{display:block;overflow:visible}`)
//                    react  the component from @mavan/icons-react, <Check size={S} />
//                    svg    the installed @mavan/icons/svg/<S>/<name>.svg, its markup inlined
//                    img    the same file as an <img> from a blob: URL of its exact bytes
//                  (a kind is drawn alone on its page; `lab2` and `react2` are the same page again, the controls)
//   mode=scaled&file=F&m=M&ks=1,2,4   one icon, the stroked source as the lab draws it beside the installed file,
//                  both the M master at M × k px, for each k — the pinhole at sizes the lab also shows
import * as Pkg from '@mavan/icons-react';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';

const q = new URLSearchParams(location.search);
const mode = q.get('mode'), kind = (q.get('kind') || '').replace(/2$/, '');
const COLS = 64;
const pascal = (f) => f.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const getJson = async (u) => (await fetch(u)).json();

function Done({ children }) {
  useEffect(() => {
    (async () => {
      await Promise.all([...document.images].map((i) => i.decode().catch(() => { window.__imgFail = (window.__imgFail || 0) + 1; })));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.__ready = true;
    })();
  }, []);
  return children;
}

function Grid({ files, S, lab, svg, urls }) {
  const P = S + 8;
  const at = (i) => ({ left: (i % COLS) * P + 4, top: Math.floor(i / COLS) * P + 4, width: S, height: S });
  return (
    <div style={{ position: 'relative', width: COLS * P, height: Math.ceil(files.length / COLS) * P, '--s': `${S}px` }}>
      {kind === 'lab' && files.map((f, i) => <div key={f} className="cell lab" style={at(i)} dangerouslySetInnerHTML={{ __html: lab[f] }} />)}
      {kind === 'react' && files.map((f, i) => { const C = Pkg[pascal(f)]; return <div key={f} className="cell cust" style={at(i)}><C size={S} /></div>; })}
      {kind === 'svg' && files.map((f, i) => <div key={f} className="cell cust" style={at(i)} dangerouslySetInnerHTML={{ __html: svg[f] }} />)}
      {kind === 'img' && files.map((f, i) => <div key={f} className="cell cust" style={at(i)}><img alt="" src={urls[f]} width={S} height={S} /></div>)}
    </div>
  );
}

function Scaled({ file, ks, lab, svg }) {
  let x = 4;
  return (
    <div style={{ position: 'relative', height: 8 + Math.max(...ks) * Number(q.get('m')) }}>
      {ks.flatMap((k) => {
        const px = k * Number(q.get('m')), a = x, b = x + px + 4;
        x = b + px + 12;
        return [
          <div key={`l${k}`} className="cell lab" style={{ left: a, top: 4, width: px, height: px }} dangerouslySetInnerHTML={{ __html: lab[k] }} />,
          <div key={`s${k}`} className="cell cust" style={{ left: b, top: 4, width: px, height: px, '--s': `${px}px` }} dangerouslySetInnerHTML={{ __html: svg }} />,
        ];
      })}
    </div>
  );
}

(async () => {
  let body;
  if (mode === 'grid') {
    const S = Number(q.get('size'));
    const { files } = await getJson('/files.json');
    const missing = files.filter((f) => kind === 'react' && typeof Pkg[pascal(f)] !== 'object' && typeof Pkg[pascal(f)] !== 'function');
    if (missing.length) throw new Error(`no component for ${missing.length} names, first ${missing[0]}`);
    const lab = kind === 'lab' ? await getJson(`/data/${S}/lab.json`) : null;
    const svg = kind === 'svg' || kind === 'img' ? await getJson(`/data/${S}/svg.json`) : null;
    const urls = {};
    if (kind === 'img') {
      // decode every image before it goes on the page (decoding them in place costs a frame each); a blob: URL of
      // the file's exact bytes — 2,620 parallel image requests overrun Chromium's request limit
      window.__keep = await Promise.all(files.map(async (f) => {
        const im = new Image(S, S);
        im.src = urls[f] = URL.createObjectURL(new Blob([svg[f]], { type: 'image/svg+xml' }));
        await im.decode();
        return im;
      }));
    }
    body = <Grid files={files} S={S} lab={lab} svg={svg} urls={urls} />;
  } else if (mode === 'scaled') {
    const ks = q.get('ks').split(',').map(Number), m = Number(q.get('m')), file = q.get('file');
    const lab = Object.fromEntries(await Promise.all(ks.map(async (k) => [k, (await getJson(`/data/${m}/lab-at.json?file=${file}&px=${k * m}`)).markup])));
    const svg = (await getJson(`/data/${m}/svg.json`))[file];
    body = <Scaled file={file} ks={ks} lab={lab} svg={svg} />;
  }
  createRoot(document.getElementById('root')).render(<Done>{body}</Done>);
})().catch((e) => { document.title = `ERROR ${e.message}`; window.__error = e.message; throw e; });
