const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (api, { webpackConfig }) => {
  const { context } = api;
  const { userConfig: { outputPath }, rootDir } = context;
  const outputDir = path.join(rootDir, outputPath);
  webpackConfig
    .plugin('CopyWebpackPlugin')
    .use(CopyWebpackPlugin, [{
      patterns: [
        {
          from: path.resolve(rootDir, 'public'),
          to: path.resolve(rootDir, outputDir),
          noErrorOnMissing: true,
          info: {
            minimized: true
          },
          globOptions: {
            dot: true,
            gitignore: true
          }
        }
      ]
    }]);
};
