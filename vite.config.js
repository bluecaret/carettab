import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config.js'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    hmr: {
      port: 3000,
    },
  },
  build: {
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    crx({ manifest }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      runtimeOnly: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
