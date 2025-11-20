const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

module.exports = function setEnv (api, { webpackConfig }) {
  const { context } = api;
  const { rootDir, userConfig } = context;

  const pkg = require(path.join(rootDir, 'package.json'));

  webpackConfig
    .plugin('WebpackManifestPlugin')
    .use(WebpackManifestPlugin, [{
      generate (seed, files) {
        const importMap = {
          imports: {}
        };
        files.forEach(file => {
          if (file.isChunk && file.isInitial && file.chunk) {
            if (/\.js$/.test(file.name)) {
              importMap.imports[`${pkg.name}/${file.chunk.name}`] = file.path;
            }
            if (/\.css$/.test(file.name)) {
              importMap.imports[`${pkg.name}/${file.chunk.name}@css`] = file.path;
            }
          }
        });
        return importMap;
      },
      fileName: userConfig.mapVersion ? `import-map.${pkg.version}.json` : 'import-map.json'
    }]);
};
