/**
 * Owner: garuda@kupotech.com
 * jest 使用的 babel 配置
 */

const babelOptions = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [['rewire'], ['@babel/plugin-proposal-decorators', { legacy: true }]],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
