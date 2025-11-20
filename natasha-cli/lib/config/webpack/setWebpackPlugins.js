const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const WebpackBar = require('webpackbar');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = (config) => {
  config
    .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].[contenthash].css',
      ignoreOrder: true,
      chunkFilename: '[id].[contenthash].css'
    }])
    .end()
    .plugin('FilterWarningsPlugin')
    .use(FilterWarningsPlugin, [{
      exclude: /Conflicting order between:/
    }])
    .end()
    .plugin('WebpackBar')
    .use(WebpackBar)
    .end()
    .plugin('CaseSensitivePathsPlugin')
    .use(CaseSensitivePathsPlugin);
};
