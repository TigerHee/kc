/**
 * Owner: iron@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const { calculateIntegrityHashByContent } = require('./utils.js');

const globalInfo = {
  imports: {
    react: 'app:react',
    'react-dom': 'app:react-dom',
    'react-redux': 'app:react-redux',
    '@kc/mui': 'app:kc-mui',
    '@kc/mui/lib/styles': 'app:kc-mui-styles',
    '@kc/mui/lib/hook': 'app:kc-mui-hook',
    '@kc/mui/lib/utils': 'app:kc-mui-utils',
    '@emotion/css': 'app:emotion-css',
    '@kufox/mui': 'app:kufox-mui',
  },
  integrity: {},
};

function getHost() {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:5002/externals/';
  }

  return 'https://assets.staticimg.com/g-biz/externals/';
}

const envConfig = {
  info: { ...globalInfo },
  host: getHost(),
};

function OutputImportmap(opts = { dir: '/', currentVersion: '' }) {
  return {
    name: 'rollup-plugin-output-importmap',
    generateBundle(outputOptions, bundle) {
      const targetDir = opts.dir;

      Object.entries(bundle)
        .filter(([key, bundleInfo]) => bundleInfo.isEntry)
        .filter(([key, bundleInfo]) => bundleInfo.code && bundleInfo.code.length > 0)
        .forEach(([key, bundleInfo]) => {
          const pgkName = bundleInfo.name === 'mui' ? '_mui' : `@remote/${bundleInfo.name}`;
          const fileUrl = `${envConfig.host}${opts.currentVersion}/${bundleInfo.fileName}`;

          // 添加到 imports
          globalInfo.imports[pgkName] = fileUrl;
          const { code } = bundleInfo;

           // 计算内容 hash
          const hash = calculateIntegrityHashByContent(code);

          if (hash) {
            // 文件路径作为 key
            globalInfo.integrity[fileUrl] = hash;
          }
        });
      // 创建目标目录
      const workspace = process.cwd();
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.resolve(workspace, targetDir, `gbiz-old-import-map.json`);
      fs.writeFileSync(filePath, `${JSON.stringify(globalInfo, null, 2)}`);

      return null;
    },
  };
}
module.exports = OutputImportmap;
