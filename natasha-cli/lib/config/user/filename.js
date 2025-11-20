const path = require('path');
const formatPath = require('../../utils/formatPath');

module.exports = (config, filename) => {
  let pathArray = filename.split('/');
  pathArray.pop(); // pop filename
  pathArray = pathArray.filter((v) => v);
  const outputPath = pathArray.length ? pathArray.join('/') : '';
  if (filename) {
    config.output.filename(filename);
  }
  if (config.plugins.get('MiniCssExtractPlugin')) {
    config.plugin('MiniCssExtractPlugin').tap((args) => [
      Object.assign(...args, {
        filename: formatPath(path.join(outputPath, '[name].[contenthash].css'))
      })
    ]);
  }
};
