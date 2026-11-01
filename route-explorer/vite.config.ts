import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production: one IIFE bundle; React, ReactDOM and D3 come from cdnjs globals (see scripts/inline.mjs).
export default defineConfig({
  plugins: [react()],
  build: {
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
  },
});
