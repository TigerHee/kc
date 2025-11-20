/* eslint-disable max-len */
module.exports = {
  extends: [
    require.resolve('@krn/eslint'),
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
  ],
  plugins: ['unused-imports', 'simple-import-sort', 'react-hooks'],
  globals: {
    _px: true,
  },
  env: {
    jest: true,
  },
  rules: {
    'react/no-unstable-nested-components': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 1,
      },
    ],
    'import/named': 'off',
    'react/function-component-definition': 0,
    'no-use-before-define': 'off',
    'react/react-in-jsx-scope': 'off',
    'linebreak-style': 'off',
    'eol-last': 0,
    'max-len': ['warn', {code: 120}],
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
        peerDependencies: true,
      },
    ],

    'no-unused-vars': 'off', //
    'unused-imports/no-unused-imports': 'error',
    'import/first': ['warn', 'disable-absolute-first'],
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'no-undef': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
    'no-unused-expressions': [
      'error',
      {allowShortCircuit: true, allowTernary: true},
    ],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            // eslint-disable-next-line max-len
            '^(assert|buffer|child_process|cluster|console|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          [
            '^(?![^\\w]|locales/.*|utils/.*|components/.*|services/.*|models/.*|config/.*|assets/.*|layouts/.*|hooks/.*|constants/.*)',
            '^@(/*|$)',
          ],
          [
            '^(locales|utils|components|services|models|config|assets|layouts|hooks|constants)(/.*)?$',
            // Parent imports. Put `..` last.
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
          // Side effect imports.
          ['^\\u0000'],
          // Style imports.
          ['^.+\\.less$'],
        ],
      },
    ],
  },
};
