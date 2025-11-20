module.exports = {
  extends: [require.resolve('kc-web-eslint')],
  rules: {
    'ui-module/should-no-destructuring': 0,
    'ui-module/should-no-emotion': 0,
    'kupo-lint/no-dangerously-html': 'off', // 这条规则会报错
  },
  globals: {
    System: false,
  },
};
