module.exports = {
  "extends":[ require.resolve('kc-web-eslint')],
  "globals": {
    "_DEV_": false,
    // "IS_TEST_ENV": false,
    // "NOT_PROD": false,
    "_BASE_": false,
    "_PUBLIC_PATH_": false,
    "_RELEASE_": false,
    "SENTRY_DEBUG": false,
    "_VERSION_": false,
    // "_SITE_": false,
    "_XVersion_": false,
    "_DESC_": false,
    "_KUCOIN_API_HOST_": false,
    "_ASSET_PREFIX_": false,
    "_USE_MOCK_": false,
    "ISDEV": false,
    "IS_INSIDE_WEB": false,
    "_APP_NAME_": false,
    "System": false,
    "_KC_PAGE_LANG_LOADER": false,
    "_KC_LOCALE_DATA": false,
    "GOOGLE_CAPTCHA_SITE_KEY": false,
    "GOOGLE_CAPTCHA_DEV_SITE_KEY": false,
    "cy": false,
    "Cypress": false
  },
  "plugins": ["eslint-plugin-ui-module", 'google-trans'],
  rules: {
    "kupo-lint/no-dangerously-html": "off",
    "react/no-unescaped-entities": "off",// 关闭，实际文案中较多的' " 等存在
    "jsx-a11y/media-has-caption": "off", //关闭，如果没有实际的src，那么track 没有任何意义，
    "no-restricted-imports": "off", // landing-web 还是 umi 项目，暂时不处理这个
    "react-hooks/exhaustive-deps": "off" // 不能自动修复
  }
}
