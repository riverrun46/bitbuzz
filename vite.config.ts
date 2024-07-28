import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';
// import { resolve } from 'path';
import { environment } from './src/utils/environments';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true,
    //   },
    // }),
    nodePolyfills(),
    wasm(),
  ],
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    // lib: {
    //   entry: resolve(__dirname, 'src/index.ts'),
    //   name: 'Metaid',
    //   fileName: 'metaid',
    //   formats: ['es'],
    // },
    minify: false,
  },
  server: {
    proxy: {
      '/api/trans/vip/translate': {
        target: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        changeOrigin: true,
      },
    },
  },
});
