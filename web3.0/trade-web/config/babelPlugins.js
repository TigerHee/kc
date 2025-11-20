/**
 * Owner: garuda@kupotech.com
 * 用来babel plugin 的加载
 */

const path = require('path');

const { dirname } = path;

const babelPlugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: false,
      // https://github.com/babel/babel/issues/10261
      version: require('@babel/runtime/package.json').version,
      regenerator: true,
      // 7.13 之后根据 exports 自动选择 esm 和 cjs，无需此配置
      useESModules: false,
      helpers: true,
      // Undocumented option that lets us encapsulate our runtime, ensuring
      // make sure we are using the correct version
      // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
      absoluteRuntime: dirname(require.resolve('@babel/runtime/package.json')),
    },
  ],
  ['add-module-exports'],
  ['babel-plugin-lodash'],
  '@emotion/babel-plugin',
  // [
  //   'register-model',
  //   {
  //     extraNamespaces: [{}],
  //     ignore: [],
  //   },
  // ],
  ['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'],
  [
    'import',
    {
      libraryName: '@kufox/mui',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kufox/mui',
  ],
  [
    'import',
    {
      libraryName: '@kufox/icons',
      libraryDirectory: 'lib/components',
      camel2DashComponentName: false,
    },
    'icons',
  ],
  [
    'import',
    {
      libraryName: '@kux/mui',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kux/mui',
  ],
  [
    'import',
    {
      libraryName: '@kux/icons',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kux/icons',
  ],
];

if (process.env.NODE_ENV === 'production') {
  babelPlugins.push(['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]);
}

export default babelPlugins;
