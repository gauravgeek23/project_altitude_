// Renders the creator's icon (public/icon.png, 82 × 84) to the sizes the page links, and the social-preview image
// public/og.png. Run after changing the icon: node scripts/icons.cjs   (needs playwright with its Chromium)
const { chromium } = require("playwright");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const PUB = resolve(__dirname, "../public");
const data = "data:image/png;base64," + readFileSync(`${PUB}/icon.png`).toString("base64");
const page = (w, h, body) => `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:${w}px;height:${h}px;background:transparent}</style>${body}`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const [size, file] of [[180, "apple-touch-icon.png"], [32, "icon-32.png"]]) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(page(size, size, `<img src="${data}" width="${size}" height="${size}" style="display:block">`));
    await p.screenshot({ path: `${PUB}/${file}`, omitBackground: true });
  }
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(page(1200, 630, `
    <div style="position:absolute;inset:0;background:#0e2a4c;display:flex;align-items:center;gap:64px;padding:0 96px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#fff">
      <img src="${data}" width="164" height="168" style="display:block;flex:none">
      <div>
        <div style="font-size:30px;letter-spacing:.18em;opacity:.7">PROJECT ALTITUDE</div>
        <div style="font-size:66px;font-weight:700;line-height:1.08;margin-top:14px">A rider's field guide<br>to Ladakh and Himachal</div>
        <div style="font-size:26px;opacity:.75;margin-top:22px">Four circuits, the villages and passes between them, and what you need to ride them.</div>
      </div>
    </div>`));
  await p.screenshot({ path: `${PUB}/og.png` });
  await b.close();
  console.log("wrote icon-32, apple-touch-icon and og.png in public/");
})();
