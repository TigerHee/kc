module.exports = {
  extends: 'eslint-config-egg',
  env: {
    browser: true,
  },
  rules: {
    'no-bitwise': 'off',
    'array-bracket-spacing': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/check-param-names': 'off',
    'jsdoc/check-tag-names': 'off',
    'jsdoc/require-returns-type': 'off',
  },
};
