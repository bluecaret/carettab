import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' assert { type: 'json' } // Node >=17

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
    rollupOptions: {
      output: {
        manualChunks: {
          fa: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome',
          ],
          vue: ['vue'],
          vuetools: ['pinia', 'vue-i18n', 'vuedraggable'],
          vendors: ['luxon', 'lodash', 'convert', 'openai'],
          de: ['./src/locales/de.json'],
          en: ['./src/locales/en.json'],
          es: ['./src/locales/es.json'],
          fr: ['./src/locales/fr.json'],
          he: ['./src/locales/he.json'],
          it: ['./src/locales/it.json'],
          ja: ['./src/locales/ja.json'],
          ko: ['./src/locales/ko.json'],
          pt: ['./src/locales/pt.json'],
          ru: ['./src/locales/ru.json'],
          sv: ['./src/locales/sv.json'],
          uk: ['./src/locales/uk.json'],
          ur: ['./src/locales/ur.json'],
          vi: ['./src/locales/vi.json'],
          zh: ['./src/locales/zh.json'],
        },
      },
    },
  },
  plugins: [
    vue(),
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
