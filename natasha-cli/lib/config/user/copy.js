module.exports = (config, copyPatterns) => {
  if (copyPatterns.length) {
    config.plugin('copy').use(require('copy-webpack-plugin'), [{
      patterns: copyPatterns
    }]);
  }
};
