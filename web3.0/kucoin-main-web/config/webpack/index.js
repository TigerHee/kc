const path = require('path');
const optimizationConfig = require('./optimizationConfig');
const moduleConfig = require('./moduleConfig');

/**
 * chainWebpack function
 */
module.exports = function(config, webpack, params) {
  if (params.isDev) {
    config.output.path(path.resolve(__dirname, `../../dist/${params.packageVersion}/`));
  }
  moduleConfig(config, params);
  config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
  config.externals([
    {
      react: 'window.React',
      'react-dom': 'window.ReactDOM',
      'react-redux': 'window.ReactRedux',
      '@emotion/css': 'window.emotion',
    },
    function (context, request, callback) {
      if (/^@kc\/mui$/.test(request)) {
        return callback(null, '$KcMui.components');
      }
      if (/^@kc\/mui\/lib/.test(request)) {
        return callback(null, request.replace(/^@kc\/mui\/lib/, '$KcMui').replace(/\//g, '.'));
      }
      if (/^@kufox\/mui/.test(request)) {
        return callback(null, request.replace(/^@kufox\/mui/, '$KufoxMui').replace(/\//g, '.'));
      }
      return callback();
    },
  ]);
  optimizationConfig(config);
}
