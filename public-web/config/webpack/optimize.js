module.exports = function (memo) {
  memo.merge({
    optimization: {
      sideEffects: true,
      splitChunks: {
        minSize: 80000,
        minChunks: 3,
        chunks: 'async',
        automaticNameDelimiter: '-',
        cacheGroups: {
          svg: {
            minChunks: 1,
            minSize: 1,
            name: 'svg-icons',
            test: /[\\/]static[\\/]svg_icons[\\/]/,
            reuseExistingChunk: true,
          }
        },
      },
    },
  });

  return memo;
};
