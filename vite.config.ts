import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import tsconfigPaths from 'vite-tsconfig-paths';
import zip from 'rollup-plugin-zip';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    crx({ manifest }),
    zip() as unknown as Plugin,
  ],
});
