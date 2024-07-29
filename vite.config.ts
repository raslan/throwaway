import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import tsconfigPaths from 'vite-tsconfig-paths';
import zipPack from 'vite-plugin-zip-pack';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    crx({ manifest }),
    zipPack({
      outDir: 'dist',
      outFileName: `${manifest.short_name}-${manifest.version}.zip`,
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
