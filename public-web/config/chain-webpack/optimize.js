module.exports = function (memo) {
  memo.merge({
    optimization: {
      sideEffects: true,
      splitChunks: {
        minSize: 20000,
        minChunks: 3,
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
          commons: {
            name: 'commons',
            minChunks: 3,
            priority: 30,
            test: /[\\/]src[\\/](components|common|utils|hooks|tools|helper)/,
            reuseExistingChunk: true,
          },
          svg: {
            minChunks: 1,
            minSize: 1,
            name: 'svg-icons',
            test: /[\\/]static[\\/]svg_icons[\\/]/,
            reuseExistingChunk: true,
          },
          // umijs独立 chunk
          // lottie-web独立 chunk
          lottie: {
            name: 'chunk-lottie-web',
            test: /[\\/]node_modules[\\/]?lottie-web(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // lottie-web独立 chunk
          kcsocket: {
            name: 'chunk-kc-socket',
            test: /[\\/]node_modules[\\/]@kc[\\/]socket(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          kctdk: {
            name: 'chunk-kc-tdk',
            test: /[\\/]node_modules[\\/]@kc[\\/]tdk(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // react-virtualized独立 chunk
          virtualized: {
            minChunks: 1,
            name: 'chunk-react-virtualized',
            test: /[\\/]node_modules[\\/]?react-virtualized(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          mobiledetect: {
            minChunks: 1,
            name: 'chunk-mobiledetect',
            test: /[\\/]node_modules[\\/]mobile-detect(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  });

  return memo;
};
