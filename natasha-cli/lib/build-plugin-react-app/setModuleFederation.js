const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const isObject = require('../utils/isObject');

// 模块联邦导出文件名
const REMOTE_ENTRY = 'remoteEntry';
const MF_IMPORT_MAP_JSON = 'mf-import-map.json';

module.exports = function setModuleFederation (api, { webpackConfig }) {
  const { context } = api;
  const { rootDir, userConfig } = context;
  const { moduleFederation } = userConfig;
  const { name, filename, library, exposes, remotes, shared } = moduleFederation || {};
  const pkg = require(path.join(rootDir, 'package.json'));
  const isHasExport = isObject(exposes) && Object.keys(exposes).length > 0;
  const isHasImport = isObject(remotes) && Object.keys(remotes).length > 0;

  // 如果不存在导出和导入配置，则不做处理
  if (!isHasExport && !isHasImport) {
    return;
  }

  // 模块联邦name，默认name为项目名，只用作模块联邦name和map.json的name
  const mfName = name || pkg.name;

  // 加入module federation plugin
  webpackConfig.plugin('ModuleFederationPlugin').use(ModuleFederationPlugin, [
    {
      // 默认package name
      name: mfName,
      // 导出文件，6位hash
      filename: filename || `${pkg.name}/${REMOTE_ENTRY}.[chunkhash:6].js`,
      // 导出格式为system
      library: library || { type: 'system' },
      // 来自自定义配置的导出路径
      exposes: exposes || {},
      // 来自自定义配置的导入路径
      remotes: remotes || {},
      // 共享模块
      shared: shared || {}
    }
  ]);

  // 如果存在导出配置，生成mf-import-map.json文件，存放remoteEntry.js地址
  if (isHasExport) {
    webpackConfig.plugin('WebpackManifestMFPlugin').use(WebpackManifestPlugin, [
      {
        generate (seed, files) {
          const importMap = {
            imports: {}
          };
          files.forEach((file) => {
            if (file.isChunk && new RegExp(REMOTE_ENTRY).test(file.path)) {
              importMap.imports[mfName] = file.path;
            }
          });
          return importMap;
        },
        fileName: MF_IMPORT_MAP_JSON
      }
    ]);
  }
};
