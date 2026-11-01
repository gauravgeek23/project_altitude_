// Turns the Vite build into one self-contained page: CSS and app JS inlined (data and terrain
// image are already inside the JS), libraries from cdnjs at pinned versions.
import { readFileSync, writeFileSync } from "node:fs";
const js = readFileSync("dist/assets/app.js", "utf8").replace(/<\/script/gi, "<\\/script");
const css = readFileSync("dist/assets/style.css", "utf8");
const page = `<title>Ladakh–Himachal Circuits</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
<script>${js}</script>
`;
writeFileSync("dist/route-explorer.html", page);
console.log("dist/route-explorer.html", Math.round(page.length / 1024), "KiB");
