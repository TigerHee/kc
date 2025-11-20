/**
 * Owner: garuda@kupotech.com
 * 适用于纯 JS babel 转换
 */

// const { dirname } = require('path');

// function getCorejsVersion() {
//   // eslint-disable-next-line global-require, import/no-dynamic-require
//   const corejsVersion = require(require.resolve('core-js/package.json')).version;
//   const [major, minor] = corejsVersion.split('.');
//   return `${major}.${minor}`;
// }

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'loose': true,
        'modules': false,
        'useBuiltIns': false,
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
};
