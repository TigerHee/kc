const path = require('path');

module.exports = (config, outputPath, context) => {
  const { rootDir } = context;

  const absoluteOutputPath = path.resolve(rootDir, outputPath);

  config.output.path(absoluteOutputPath);
};
