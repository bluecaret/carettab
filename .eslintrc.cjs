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
  ignorePatterns: ['src/assets/ExtPay.js'],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    semi: ['warn', 'never'],
  },
}
