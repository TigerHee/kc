const loadEnv = require('./loadEnv');
const getRuntimeEnv = require('../utils/getRuntimeEnv');
const VaultPlugin = require('vault-webpack-plugin');

module.exports = function setEnv (api, { webpackConfig }) {
  const { context } = api;
  const { command, commandArgs, rootDir, webpack } = context;

  const envMode = command === 'start' ? 'development' : 'production';
  const env = loadEnv(rootDir, envMode);
  const runtimeEnv = getRuntimeEnv(env);

  const defineVars = {
    ...runtimeEnv.stringified,
    'process.env.NODE_ENV': JSON.stringify(envMode || 'devlopment'),
    'process.env.PORT': JSON.stringify(commandArgs.port)
  };

  webpackConfig
    .plugin('DefinePlugin')
    .use(webpack.DefinePlugin, [defineVars]);

  webpackConfig.plugin('VaultPlugin')
    .use(VaultPlugin);
};
