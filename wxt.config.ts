import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Throwaway',
    description: 'Securely generate a digital identity for testing and privacy.',
    permissions: ['activeTab', 'scripting', 'contextMenus', 'storage'],
    icons: {
      16: 'assets/icon-72.png',
      32: 'assets/icon-96.png',
      48: 'assets/icon-120.png',
      128: 'assets/icon-128.png',
    },
    action: {
      default_title: 'Throwaway',
    },
  },
});
