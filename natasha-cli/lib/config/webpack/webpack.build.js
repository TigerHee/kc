const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const path = require('path');

module.exports = (config) => {
  config.devtool('source-map');

  // 设置 source-map sources 资源，用于web增量代码测试
  config.output.devtoolModuleFilenameTemplate(info =>
    path.relative(process.cwd(), info.absoluteResourcePath).replace(/\\/g, '/')
  );

  config.optimization.minimize(true);

  // uglify js file
  config.optimization
    .minimizer('TerserPlugin')
    .use(TerserPlugin, [{
      parallel: true,
      extractComments: false,
      terserOptions: {
        parse: {
          // We want terser to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending further investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true
        }
      }
    }]);

  // optimize css file
  config.optimization
    .minimizer('CssMinimizerPlugin')
    .use(CssMinimizerPlugin, [{
      parallel: false,
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true }
          }
        ],
        processorOptions: {
          parser: safeParser
        }
      }
    }]);
};
