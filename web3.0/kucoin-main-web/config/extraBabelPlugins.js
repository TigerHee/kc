import registerPluginConfig from './regiter-plugin-config';
import { dirname } from 'path';

export default [
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
  '@emotion/babel-plugin',
  ['register-model', registerPluginConfig],
  ['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'],
  ['import', { libraryName: '@kc/ui', style: (name) => `${name}/style.less` }, '@kc/ui'],
  [
    'import',
    { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false },
    'lodash',
  ],
  [
    'import',
    {
      libraryName: '@kc/mui',
      libraryDirectory: 'lib/components',
      camel2DashComponentName: false,
    },
    '@kc/mui',
  ],
  [
    'import',
    {
      libraryName: '@kufox/icons',
      libraryDirectory: 'lib/components',
      camel2DashComponentName: false,
    },
    '@kufox/icons',
  ],
  ['react-loadable/babel'],
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
      libraryName: '@kux/icons',
      libraryDirectory: '/',
      camel2DashComponentName: false,
    },
    '@kux/icons',
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
];
