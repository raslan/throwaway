import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { chromeExtension } from "rollup-plugin-chrome-extension";
import tsconfigPaths from "vite-tsconfig-paths";
import * as manifest from "./manifest.json";
import zip from "rollup-plugin-zip";
import copy from "rollup-plugin-copy2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    chromeExtension({ manifest }),
    copy({
      assets: [
        ["public/assets/icon-32.png", "assets/icon-32.png"],
        ["public/assets/icon-128.png", "assets/icon-128.png"],
        ["public/assets/icon-192.png", "assets/icon-192.png"],
      ],
    }),
    zip(),
  ],
});
