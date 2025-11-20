/**
 * Owner: iron@kupotech.com
 */
module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    '_VERSION_': false,
  },
  rules: {
    'prettier/prettier': 'error',
    camelcase: 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
  },
  ignorePatterns: ['babel.config.js'],
};
