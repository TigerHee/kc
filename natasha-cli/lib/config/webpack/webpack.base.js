const Config = require('webpack-chain');
const setWebpackLoaders = require('./setWebpackLoaders');
const setWebpackPlugins = require('./setWebpackPlugins');
const { watchIgnore } = require('../constant');

module.exports = (mode) => {
  const config = new Config();

  config.mode(mode);
  config.resolve.extensions.merge([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.wasm', '.less'
  ]);
  // https://stackoverflow.com/questions/70429654/webpack-5-errors-cannot-resolve-crypto-http-and-https-in-reactjs-proje
  config.resolve.set('fallback', {
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    url: require.resolve('url/'),
    events: require.resolve('events/'),
    path: require.resolve('path-browserify')
  });
  // https://github.com/reactjs/react-transition-group/issues/556#issuecomment-544583423
  config.resolve.modules.add('node_modules');
  config.watchOptions({
    aggregateTimeout: 200,
    ignored: watchIgnore
  });

  // 设置 output.libraryTarget 为 system
  config.output.libraryTarget('system');
  // 设置 output.crossOriginLoading 为 anonymous
  config.output.crossOriginLoading('anonymous');
  // 设置基础依赖为外部依赖
  config.externals(['react', 'react-dom', 'react-router-dom']);

  // 配置 loaders
  setWebpackLoaders(config, mode);
  // 配置 plugins
  setWebpackPlugins(config);

  return config;
};
