import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'Throwaway',
    description: 'Securely generate a digital identity for testing and privacy.',
    permissions: ['activeTab', 'scripting', 'contextMenus', 'storage'],
    host_permissions: ['https://throwaway.raslan.dev/*'],
    icons: {
      16: 'assets/icon-72.png',
      32: 'assets/icon-96.png',
      48: 'assets/icon-120.png',
      128: 'assets/icon-128.png',
    },
    action: {
      default_title: 'Throwaway',
    },
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'throwaway@raslan.dev',
          strict_min_version: '109.0',
        },
      },
    }),
  }),
});
