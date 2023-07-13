import { defineManifest } from '@crxjs/vite-plugin'

const getManifestSettings = (env) => {
  console.log('Environment mode: ', env.mode)
  const baseManifest = {
    manifest_version: 3,
    short_name: 'CaretTab',
    name: env.mode === 'beta' ? 'CaretTab BETA' : '__MSG_appName__',
    description: env.mode === 'beta' ? 'Beta version of the New Tab extension, CaretTab' : '__MSG_appDesc__',
    version: `4.0.0.1`,
    version_name: `4.0.0 BETA 1`,
    default_locale: 'en',
    icons: {
      16: 'img/icon16.png',
      48: 'img/icon48.png',
      128: 'img/icon128.png',
    },
    chrome_url_overrides: {
      newtab: 'index.html',
    },
    content_scripts: [
      {
        matches: ['https://extensionpay.com/*'],
        js: ['import-ExtPay.js'],
        run_at: 'document_start',
      },
    ],
    background: {
      service_worker: 'src/service_worker.js',
      type: 'module',
    },
    permissions: ['storage'],
    host_permissions: ['https://dtfv5mvrx9.execute-api.us-west-2.amazonaws.com/*', 'https://fonts.googleapis.com/*'],
    optional_permissions: ['favicon', 'bookmarks', 'topSites'],
    optional_host_permissions: ['https://developer.sepush.co.za/*', 'https://api.openai.com/'],
    commands: {
      'goto-link-1': {
        suggested_key: {
          default: 'Alt+1',
        },
        description: 'Load Quick Link 1',
      },
      'goto-link-2': {
        suggested_key: {
          default: 'Alt+2',
        },
        description: 'Load Quick Link 2',
      },
      'goto-link-3': {
        suggested_key: {
          default: 'Alt+3',
        },
        description: 'Load Quick Link 3',
      },
      'goto-link-4': {
        suggested_key: {
          default: 'Alt+4',
        },
        description: 'Load Quick Link 4',
      },
      'goto-link-5': {
        description: 'Load Quick Link 5',
      },
      'goto-link-6': {
        description: 'Load Quick Link 6',
      },
      'goto-link-7': {
        description: 'Load Quick Link 7',
      },
      'goto-link-8': {
        description: 'Load Quick Link 8',
      },
      'goto-link-9': {
        description: 'Load Quick Link 9',
      },
    },
    web_accessible_resources: [
      {
        resources: ['src/assets/ExtPay.js'],
        matches: ['https://extensionpay.com/*'],
      },
      {
        resources: ['fonts/*.woff2'],
        extension_ids: [],
      },
    ],
  }

  return baseManifest
}

export default defineManifest(async (env) => getManifestSettings(env))
