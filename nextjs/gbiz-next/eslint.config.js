const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');
const prototypePollutionPlugin = require('eslint-plugin-prototype-pollution')
const { noTopLevelBoot } = require('kc-next/config');

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prototypePollutionPlugin.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,  // 添加 Node.js 全局变量
        ...globals.browser // 如果同时需要浏览器环境
      }
    },
    rules: {
      "kc-next/no-top-level-boot": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prototype-pollution/no-bracket-notation-property-accessor": "off",
      "no-irregular-whitespace": "off",
    },
    plugins: {
      "kc-next": noTopLevelBoot,
    },
  }
);