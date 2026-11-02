import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default build (Vercel, any static host): a normal Vite build with React and d3 bundled in.
// SINGLE_FILE=1 (npm run build:single): one IIFE whose libraries come from cdnjs globals,
// inlined into dist/project-altitude.html by scripts/inline.mjs.
const single = process.env.SINGLE_FILE === "1";
// the site's public address, for the social-preview image link (og:image must be absolute);
// set VITE_SITE_URL in Vercel to the real domain
const siteUrl = process.env.VITE_SITE_URL ?? "https://project-altitude.vercel.app";

export default defineConfig({
  plugins: [react(), { name: "site-url", transformIndexHtml: (html) => html.replace(/%VITE_SITE_URL%/g, siteUrl) }],
  // the single-file page loads photos from the shared album instead of public/photos
  define: { __SINGLE__: JSON.stringify(single) },
  build: single
    ? {
        assetsInlineLimit: 16 * 1024 * 1024,
        cssCodeSplit: false,
        rollupOptions: {
          external: ["react", "react-dom", "react-dom/client", "d3"],
          output: {
            format: "iife",
            globals: { react: "React", "react-dom": "ReactDOM", "react-dom/client": "ReactDOM", d3: "d3" },
            inlineDynamicImports: true,
            entryFileNames: "assets/app.js",
            assetFileNames: "assets/[name][extname]",
          },
        },
      }
    : { chunkSizeWarningLimit: 2048 },
});
