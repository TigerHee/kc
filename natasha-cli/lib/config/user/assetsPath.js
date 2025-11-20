const path = require('path');
const formatPath = require('../../utils/formatPath');

function getFileName (filePath) {
  return (filePath || '').split('/').pop();
}

module.exports = (config, outputAssetsPath) => {
  const filename = getFileName(config.output.get('filename'));

  config.output.filename(formatPath(path.join(outputAssetsPath.js || '', filename)));

  if (config.plugins.get('MiniCssExtractPlugin')) {
    const options = config.plugin('MiniCssExtractPlugin').get('args')[0];
    config.plugin('MiniCssExtractPlugin').tap((args) => [Object.assign(...args, {
      filename: formatPath(path.join(outputAssetsPath.css || '', getFileName(options.filename))),
      chunkFilename: formatPath(path.join(outputAssetsPath.css || '', getFileName(options.chunkFilename)))
    })]);
  }
};
