const { watchIgnore } = require('./constant');
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = [
  {
    name: 'entry',
    defaultValue: 'src/index',
    validation: 'string|array|object'
  },
  {
    name: 'alias',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'outputPath',
    validation: 'string',
    defaultValue: 'dist'
  },
  {
    name: 'publicPath',
    validation: 'string',
    defaultValue: '/'
  },
  {
    name: 'filename',
    validation: 'string',
    defaultValue: '[name].[chunkhash].js'
  },
  {
    name: 'assetsPath',
    validation: 'object',
    defaultValue: { js: 'js', css: 'css' }
  },
  {
    name: 'externals',
    validation: 'object|array',
    defaultValue: {}
  },
  {
    name: 'devServer',
    validation: 'object',
    defaultValue: {
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      compress: true,
      hot: true,
      webSocketServer: 'ws',
      devMiddleware: {
        publicPath: '/'
      },
      historyApiFallback: true,
      static: {
        watch: {
          ignored: watchIgnore
        }
      },
      client: {
        overlay: true,
        logging: 'info',
        webSocketURL: {
          hostname: sockHost,
          pathname: sockPath,
          port: sockPort
        }
      }
    }
  },
  {
    name: 'fastRefresh',
    validation: 'boolean',
    defaultValue: true
  },
  {
    name: 'theme',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'extraBabelPlugins',
    validation: 'array',
    defaultValue: []
  },
  {
    name: 'extraBabelPresets',
    validation: 'array',
    defaultValue: []
  },
  {
    name: 'extraBabelIncludes',
    validation: 'array',
    defaultValue: []
  },
  {
    name: 'define',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'extraPostCSSPlugins',
    validation: 'array',
    defaultValue: []
  },
  {
    name: 'chainWebpack',
    validation: (v) => typeof v === 'function',
    defaultValue: () => {}
  },
  {
    name: 'cssLoaderModules',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'copy',
    validation: 'array',
    defaultValue: []
  },
  {
    name: 'autoCssModules',
    validation: 'boolean',
    defaultValue: true
  },
  {
    name: 'presetReactOption',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'presetEnvOption',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'mapVersion',
    validation: 'boolean',
    defaultValue: false
  },
  {
    name: 'vaultPlugin',
    validation: 'object',
    defaultValue: {}
  },
  {
    name: 'moduleFederation',
    validation: 'object',
    defaultValue: {}
  }
];
