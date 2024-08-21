import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
