/**
 * Owner: terry@kupotech.com
 */

const { dirname } = require('path');

function getCorejsVersion() {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const corejsVersion = require(require.resolve('core-js/package.json')).version;
  const [major, minor] = corejsVersion.split('.');
  return `${major}.${minor}`;
}

module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: getCorejsVersion() },
        bugfixes: true,
        loose: true,
        include: ['@babel/plugin-transform-block-scoping'],
        targets: {
          chrome: '64',
          edge: '79',
          firefox: '67',
          opera: '51',
          safari: '12',
        },
      },
    ],
    ['@babel/react', { 'runtime': 'automatic', 'importSource': '@emotion/react' }],
  ],
  'plugins': [
    '@emotion/babel-plugin',
    ['@babel/plugin-proposal-decorators', { 'decoratorsBeforeExport': true }],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        // https://github.com/babel/babel/issues/10261
        // eslint-disable-next-line global-require
        version: require('@babel/runtime/package.json').version,
        // make sure we are using the correct version
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: dirname(require.resolve('@babel/runtime/package.json')),
      },
    ],
    'lodash',
  ],
};
