const path = require('path');
const babelConfig = require('../config/babel.config');
const getWebpackConfig = require('../config/webpack');
const setEnv = require('./setEnv');
// const applyCliOption = require('./applyCliOption');
const applyUserConifg = require('./applyUserConifg');
const setDev = require('./setDev');
const setCopy = require('./setCopy');
const setManifest = require('./setManifest');
const setWebpack5 = require('./setWebpack5');
const setModuleFederation = require('./setModuleFederation');

module.exports = async (api) => {
  const { context, onGetWebpackConfig, registerTask } = api;
  const { command, rootDir, userConfig } = context;
  const mode = command === 'start' ? 'development' : 'production';

  // 注册 cli 选项
  // applyCliOption(api);

  onGetWebpackConfig((chainConfig) => {
    chainConfig.resolve.modules.add(path.join(rootDir, 'node_modules'));
    const publicPath = chainConfig.output.get('publicPath');

    chainConfig.devServer.merge({
      devMiddleware: {
        publicPath
      }
    });

    if (!process.env.PUBLIC_PATH) {
      process.env.PUBLIC_PATH = publicPath;
    }

    chainConfig.plugin('DefinePlugin').tap((args) => [
      Object.assign({}, ...args, {
        'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH)
      })
    ]);
  });

  const taskName = 'web';
  const webpackConfig = getWebpackConfig(mode);

  // babel-loader
  // jsx?
  webpackConfig.module
    .rule('babel')
    .test(/\.(js|mjs|cjs|jsx|ts|tsx)$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(
      babelConfig({
        presetReact: userConfig.presetReactOption || {},
        presetEnv: userConfig.presetEnvOption || {}
      })
    );

  webpackConfig.name(taskName);
  setEnv(api, { webpackConfig });

  // 注册用户配置
  applyUserConifg(api);

  setCopy(api, { webpackConfig });
  setWebpack5(api, { webpackConfig });
  setManifest(api, { webpackConfig });
  setModuleFederation(api, { webpackConfig });

  registerTask(taskName, webpackConfig);

  if (command === 'start') {
    setDev(api);
  }
};
