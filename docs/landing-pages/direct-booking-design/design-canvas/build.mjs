// Assembles *.src.html -> *.dc.html, injecting shared CSS and the base64 Nohemi faces.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const n300 = readFileSync('nohemi-300.b64', 'utf8').trim();
const n400 = readFileSync('nohemi-400.b64', 'utf8').trim();
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
const common = `
    :root { --ink:#1a1512; --ink2:#0f0d0b; --paper:#FAF9F6; --paper2:#FAFAFA; --orange:#ff5501; --orange2:#E8480C; --grey:#f3f4f6; --grey2:#e8e8e8; --line:#e8e8e8; }
    @font-face { font-family:'Nohemi'; src:url(data:font/ttf;base64,${n300}) format('truetype'); font-weight:300; font-style:normal; }
    @font-face { font-family:'Nohemi'; src:url(data:font/ttf;base64,${n400}) format('truetype'); font-weight:400; font-style:normal; }
    body { margin:0; font-family:'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color:var(--paper); background:var(--ink); -webkit-font-smoothing:antialiased; text-wrap:pretty; }
    a { color:#E8480C; } a:hover { color:#ff5501; }
    .mono { font-family:'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
    .display { font-family:'Nohemi', 'Inter', sans-serif; letter-spacing:-0.02em; }
    .noise { position:absolute; inset:0; pointer-events:none; opacity:0.035; background-image:${NOISE}; background-size:120px 120px; }
    .cta { display:flex; align-items:center; justify-content:center; gap:10px; height:56px; border-radius:14px; background:#ff5501; color:#ffffff; font-size:17px; font-weight:500; text-decoration:none; box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 28px rgba(255,85,1,0.28), 0 1px 2px rgba(0,0,0,0.25); }
    .cta:hover { color:#ffffff; background:#E8480C; }
    .dark-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.15), 0 20px 48px rgba(0,0,0,0.25); }
    .paper-card { background:#ffffff; border:1px solid #e8e8e8; box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.4); }
    .raised { background:#f6f5f6; border:1px solid #e8e8e8; box-shadow: 0 1px 2px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4), inset 0 -1px 0 0 rgba(0,0,0,0.04); }
    .grey-row { background:#f3f4f6; border:1px solid rgba(26,21,18,0.05); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.65); }
`;
for (const f of readdirSync('.').filter(f => f.endsWith('.src.html'))) {
  const out = f.replace('.src.html', '.dc.html');
  writeFileSync(out, readFileSync(f, 'utf8').replace('/*@@COMMON@@*/', common));
  console.log('built', out);
}
