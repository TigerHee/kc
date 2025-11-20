const hash = require('object-hash');
const path = require('path');
const fs = require('fs');

module.exports = function configWebpack5 (api, { webpackConfig: config }) {
  const { context } = api;
  const { command, userConfig, rootDir, webpack } = context;

  let cacheConfig = {};

  if (command === 'start') {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');
    // 持久化缓存
    cacheConfig = {
      cache: {
        type: 'filesystem',
        store: 'pack',
        version: `${process.env.__NATASHA_VERSION__}-${hash(userConfig)}`,
        buildDependencies: {
          config: [
            path.join(rootDir, 'package.json')
          ],
          tsconfig: [
            fs.existsSync(tsconfigPath) ? tsconfigPath : __dirname
          ]
        }
      }
    };
  }

  config.merge({
    ...cacheConfig,
    infrastructureLogging: {
      level: 'error'
    }
  });

  config.resolve.alias.set('path', 'path-browserify');
  config.plugin('ProvidePlugin').use(webpack.ProvidePlugin, [{ process: require.resolve('process/browser') }]);

  config.output.merge({
    assetModuleFilename: 'assets/[hash][ext][query]'
  });
};
