// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').FlatConfigItem[]} */
const config = [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    rules: {
      'quotes': ['warn', 'single'],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
        argsIgnorePattern: '^(_|args)', // 忽略以 _ 开头或名为 args 的参数
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          prefix: ['E']
        }
      ],
      'no-restricted-syntax': [
        'warn',
        {
          'selector': 'TSEnumDeclaration',
          'message': 'Don\'t declare enums, use const objects instead.'
        }
      ]
    }
  },
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'build',
      'docs-build',
      'public',
      'out',
      'storybook-static',
      '.next',
      '.cache',
      '.turbo',
      'eslintrc.js'
    ]
  },
  ...storybook.configs['flat/recommended']
];

export default config;