module.exports = {
  extends: [require.resolve('kc-web-eslint')],
  plugins: ['eslint-plugin-ui-module'],
  rules: {
    'ui-module/should-no-destructuring': 0,
    'ui-module/should-no-emotion': 0,
  },
  globals: {
    _KC_LOCALE_DATA: false,
    _DEV_: false,
    _XVERSION_: false,
    _APP_NAME_: false,
    _VERSION_: false,
    _SITE_: false,
    _ENV_: false,
    _APP_: false,
    __webpack_public_path__: false,
    IS_INSIDE_WEB: false,
    IS_TEST_ENV: false,
    IS_SANDBOX: false,
    CHARTING_PATH: false,
    SENTRY_DEBUG: false,
    System: false,
    DEPLOY_PATH: false
  },
};
