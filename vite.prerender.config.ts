import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid({ ssr: true })],
  build: {
    ssr: "scripts/prerender-entry.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
    target: "node20",
    rollupOptions: {
      output: {
        entryFileNames: "prerender-entry.mjs",
      },
    },
  },
});
