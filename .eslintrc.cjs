/* eslint-env node */

module.exports = {
  root: true,
  env: {
    node: true,
    webextensions: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    semi: ['warn', 'never'],
  },
}
