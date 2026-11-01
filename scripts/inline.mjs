// One self-contained page: CSS and app JS inlined (the map image is inside the JS), React from cdnjs.
import { readFileSync, writeFileSync } from "node:fs";
const js = readFileSync("dist/assets/app.js", "utf8").replace(/<\/script/gi, "<\\/script");
const css = readFileSync("dist/assets/style.css", "utf8");
writeFileSync("dist/project-altitude.html", `<title>Project Altitude</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
<script>${js}</script>
`);
console.log("dist/project-altitude.html", Math.round((js.length + css.length) / 1024), "KiB");
