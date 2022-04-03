import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { chromeExtension } from "rollup-plugin-chrome-extension";
import tsconfigPaths from "vite-tsconfig-paths";
import * as manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), chromeExtension({ manifest })],
});
