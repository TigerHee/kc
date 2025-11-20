module.exports = {
  extends: [require.resolve('kc-web-eslint')],
  rules: {
    'ui-module/should-no-destructuring': 0,
    'ui-module/should-no-emotion': 0,
    'no-restricted-imports': 'off', // 暂时忽略
    'jsx-a11y/control-has-associated-label': 'off', // 暂时忽略
    'jsx-a11y/click-events-have-key-events': 'off', // 暂时忽略
    'jsx-a11y/no-static-element-interactions': 'off', // 暂时忽略
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
  },
  globals: {
    _KC_LOCALE_DATA: false,
    _DEV_: false,
    _XVERSION_: false,
    _APP_NAME_: false,
    _VERSION_: false,
    _APP_: false,
    __webpack_public_path__: false,
    IS_INSIDE_WEB: false,
    IS_SANDBOX: false,
    CHARTING_PATH: false,
    SENTRY_DEBUG: false,
    _PUBLIC_PATH_: false,
    DEPLOY_PATH: false,
    System: false,
    _VERSION_PATH_: false,
    CMS_CDN: false,
    _ENV_: false,
    UCENTER_KYC_ENCRYPT_KEY: false,
    cy: false,
  },
};
