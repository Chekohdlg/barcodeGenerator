import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      // bwip-js v4.10 ESM bundle has a broken re-export; use the self-contained browser build
      "bwip-js": path.resolve(__dirname, "node_modules/bwip-js/dist/bwip-js-min.js"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
