const webpack = require('webpack');

module.exports = function (memo) {
  memo.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
  return memo;
};
