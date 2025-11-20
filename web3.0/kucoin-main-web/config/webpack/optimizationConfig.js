module.exports = function (config) {
  config.merge({
    optimization: {
      sideEffects: true,
      splitChunks: {
        minSize: 20000,
        minChunks: 3,
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
          antv: {
            minChunks: 1,
            name: 'chunk-antv',
            test: /[\\/]node_modules[\\/]?@antv(.*)/,
            priority: 20,
          },
          // lottie-web独立 chunk
          kcsocket: {
            name: 'chunk-kc-socket',
            test: /[\\/]node_modules[\\/]@kc[\\/]socket(.*)/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          kctdk: {
            name: 'chunk-kc-tdk',
            test: /[\\/]node_modules[\\/]@kc[\\/]tdk(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // higncharts独立 chunk
          highcharts: {
            minChunks: 1,
            name: 'chunk-highcharts',
            test: /[\\/]node_modules[\\/]?highcharts(.*)/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          // react-virtualized独立 chunk
          virtualized: {
            minChunks: 1,
            name: 'chunk-react-virtualized',
            test: /[\\/]node_modules[\\/]?react-virtualized(.*)/,
            priority: 40,
            reuseExistingChunk: true,
          },
          //crypto-js 独立 chunk
          crypto: {
            name: 'chunk-crypto-js',
            test: /[\\/]node_modules[\\/]?crypto-js(.*)/,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          //@sentry/tracing chunk
          sentrybrowsertracing: {
            name: 'chunk-sentry-browsertracing',
            test: /[\\/]node_modules[\\/]@sentry[\\/]tracing[\\/]esm[\\/]browser(.*)/,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          //@sentry/react独立 chunk
          sentryreact: {
            name: 'chunk-sentry-react',
            test: /[\\/]node_modules[\\/]@sentry[\\/]react[\\/]esm(.*)/,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          jsrsasign: {
            minChunks: 1,
            name: 'chunk-jsrsasign',
            test: /[\\/]node_modules[\\/]?jsrsasign(.*)/,
            priority: 20,
            reuseExistingChunk: true,
          },
          bizcharts: {
            name: 'chunk-bizcharts',
            test: /[\\/]node_modules[\\/]?bizcharts(.*)/,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
  });
};
