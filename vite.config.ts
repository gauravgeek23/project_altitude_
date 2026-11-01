import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default build (Vercel, any static host): a normal Vite build with React and d3 bundled in.
// SINGLE_FILE=1 (npm run build:single): one IIFE whose libraries come from cdnjs globals,
// inlined into dist/project-altitude.html by scripts/inline.mjs.
const single = process.env.SINGLE_FILE === "1";

export default defineConfig({
  plugins: [react()],
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
