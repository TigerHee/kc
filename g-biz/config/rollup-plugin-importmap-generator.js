/**
 * Owner: iron@kupotech.com
 */
import fs from 'fs';
import path from 'path';
import { calculateIntegrityHashByContent } from './utils';

const globalInfo = {
  imports: {
    'react': 'app:react',
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
    return 'http://localhost:5001/externals/';
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
        // eslint-disable-next-line no-unused-vars
        .filter(([key, bundleInfo]) => bundleInfo.isEntry)
        // eslint-disable-next-line no-unused-vars
        .forEach(([key, bundleInfo]) => {
          const pgkName = bundleInfo.name === 'mui' ? '_mui' : `@remote/${bundleInfo.name}`;
          const fileUrl = `${envConfig.host}${opts.currentVersion}/${bundleInfo.fileName}`;

          // 添加到 imports
          globalInfo.imports[pgkName] = fileUrl;
          // 计算并添加到 integrity
          const { code } = bundleInfo;

          // 预生成的 sourceMappingURL 注释
          const sourceMappingURL = `//# sourceMappingURL=${bundleInfo.fileName}.map`;

          // 如果代码中还没有插入 sourceMappingURL，则提前添加
          const codeWithSourceMap = `${code}${sourceMappingURL}\n`;

          // 计算内容 hash
          const hash = calculateIntegrityHashByContent(codeWithSourceMap);
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
export default OutputImportmap;
