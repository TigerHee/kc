/**
 * Owner: iron@kupotech.com
 */
import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-import-css';
import { terser } from 'rollup-plugin-terser';
import outputManifest from 'rollup-plugin-output-manifest';
import mv from 'rollup-plugin-mv';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import visualizer from 'rollup-plugin-visualizer';
import copy from 'rollup-plugin-copy';
import VaultPlugin from 'vault-webpack-plugin/dist/rollup-plugin-vault';
import OutputImportmap from './config/rollup-plugin-importmap-generator';
import moduleReplacementPlugin from './config/rollup-plguin-replace-import';
import absolutePathSourceMap from './config/rollip-plugin-sourcemap-path';
import MuiModuleReplacementList from './config/muiModuleReplacement';
import packageJson from './package.json';
import { calculateIntegrityHashByContent } from './config/utils';

const currentVersion = '2022-06-01';
const publicPath =
  process.env.SITE_ENV === 'dev'
    ? `http://localhost:5001/externals/`
    : `https://assets.staticimg.com/g-biz/externals/`;

const packagesDir = path.resolve(__dirname, 'externals/packages/');
const isProd = process.env.NODE_ENV === 'production';

let packageInputs = fs.readdirSync(packagesDir).map((item) => `${packagesDir}/${item}`);

// 快速开发模式，只编译部分包
if (process.env.DEV_FAST) {
  packageInputs = ['compliance', 'header', 'tools'].map((item) => `${packagesDir}/${item}`);
}

const OutputImportmapConfig = {
  currentVersion,
  // externals 下的资源会拷贝到 S3 。import-map.json 这种文件发布到 s3 会导致预发布和生产同时生效，
  // 把 import-map 放到 lib，发布到 efs，隔离预发布和生产环境
  dir: 'lib',
};

const aliasEntries = [
  {
    find: '@tools',
    replacement: path.resolve(__dirname, 'externals/tools'),
  },
  {
    find: '@utils',
    replacement: path.resolve(__dirname, 'externals/utils'),
  },
  {
    find: '@hooks',
    replacement: path.resolve(__dirname, 'externals/hooks'),
  },
  {
    find: '@packages',
    replacement: path.resolve(__dirname, 'packages'),
  },
  {
    find: '@components',
    replacement: path.resolve(__dirname, 'src/components'),
  },
  {
    find: '@statics',
    replacement: path.resolve(__dirname, 'src/statics'),
  },
  {
    find: '@models',
    replacement: path.resolve(__dirname, 'src/models'),
  },
  {
    find: '@services',
    replacement: path.resolve(__dirname, 'src/services'),
  },
  {
    find: '@contexts',
    replacement: path.resolve(__dirname, 'src/contexts'),
  },
  {
    find: '@transfer',
    replacement: path.resolve(__dirname, 'packages/transfer/src/transferv2'),
  },
  {
    find: '@kc/gbiz-base/lib',
    replacement: path.resolve(__dirname, 'packages/gbiz-base/src'),
  },
  {
    find: '@kycCompliance',
    replacement: path.resolve(__dirname, 'packages/kyc/src/components/Compliance'),
  },
];

export default [
  {
    input: 'externals/syncStorage.js',
    external: [],
    output: {
      dir: 'lib/externals/',
      entryFileNames: `${packageJson.version}/[name].js`,
      format: 'umd',
      name: '$SyncStorage',
      globals: {},
      sourcemap: true,
    },
    plugins: [
      alias({
        entries: aliasEntries,
      }),
      absolutePathSourceMap(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        configFile: path.resolve(__dirname, 'babel_pureJS.config'),
      }),
      resolve({
        browser: true,
      }),
      replace({
        preventAssignment: true,
        values: {
          _SITE_ENV_: JSON.stringify(process.env.SITE_ENV),
          __env__: JSON.stringify(process.env.NODE_ENV),
          __public_path__: JSON.stringify(publicPath),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          __version__: JSON.stringify(packageJson.version),
        },
      }),
      commonjs(),
      isProd && terser(),
    ],
  },
  {
    input: 'externals/complianceAuto.js',
    external: ['react', 'react-dom'],
    output: {
      dir: 'lib/externals/',
      entryFileNames: `${packageJson.version}/[name].js`,
      format: 'umd',
      name: '$Compliance',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
    },
    plugins: [
      alias({
        entries: aliasEntries,
      }),
      absolutePathSourceMap(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        configFile: path.resolve(__dirname, 'babel_compliance.config'),
      }),
      resolve({
        browser: true,
      }),
      replace({
        preventAssignment: true,
        values: {
          _SITE_ENV_: JSON.stringify(process.env.SITE_ENV),
          __env__: JSON.stringify(process.env.NODE_ENV),
          __public_path__: JSON.stringify(publicPath),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          __version__: JSON.stringify(packageJson.version),
        },
      }),
      commonjs(),
      isProd && terser(),
    ],
  },
  {
    input: 'externals/mui.js',
    external: ['react', 'react-dom'],
    output: {
      dir: 'lib/externals/',
      entryFileNames: !isProd ? '[name].js' : '[name].[hash].js',
      format: 'umd',
      name: '$KcMui',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
      }),
      url({
        include: ['**/*.woff', '**/*.woff2'],
        publicPath,
      }),
      isProd && terser(),
      OutputImportmap(OutputImportmapConfig),
      absolutePathSourceMap(),
    ],
  },
  {
    input: packageInputs,
    output: {
      format: 'system',
      dir: `lib/externals/${currentVersion}/`,
      entryFileNames: '[name].[hash].js',
      // chunkFileNames: '[name].[hash].js',
      sourcemap: true,
      manualChunks(id, { getModuleInfo }) {
        const { importers } = getModuleInfo(id);
        if (
          id.includes('node_modules') &&
          importers.length > 1 &&
          !/node_modules\/(antd|@ant)/.test(id) &&
          !/node_modules\/html-to-react/.test(id) &&
          !/node_modules\/react-helmet-async/.test(id) &&
          !/node_modules\/@sentry/.test(id) &&
          !/node_modules\/react-virtualized/.test(id) &&
          !/node_modules\/@kufox/.test(id) &&
          !/node_modules\/@kux/.test(id)
        ) {
          return 'vendor';
        }
      },
    },
    external: ['react', 'react-dom', 'react-redux', '@emotion/css'],
    // onwarn(warning) {
    //   if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
    // },
    plugins: [
      alias({
        entries: aliasEntries,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      resolve({
        browser: true,
      }),
      commonjs({
        strictRequires: true,
      }),
      json(),
      replace({
        preventAssignment: true,
        values: {
          _SITE_ENV_: JSON.stringify(process.env.SITE_ENV),
          __env__: JSON.stringify(process.env.NODE_ENV),
          __public_path__: JSON.stringify(publicPath),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          __version__: JSON.stringify(packageJson.version),
        },
      }),
      VaultPlugin(),
      url({
        include: ['**/*.svg', '**/*.png', '**/*.mp3', '**/*.webp', '**/*.gif'],
        publicPath: `${publicPath}${currentVersion}/`,
        limit: 0,
      }),
      css({
        output: 'remote-app.css',
      }),
      moduleReplacementPlugin(MuiModuleReplacementList),
      absolutePathSourceMap(),
      isProd && terser(),
      OutputImportmap(OutputImportmapConfig),
      outputManifest({
        fileName: 'gbiz-import-map.json',
        publicPath: `${publicPath}${currentVersion}/`,
        nameWithExt: false,
        basePath: '@kucoin-biz/',
        generate: (keyValueDecorator, seed, opt) => (chunks) => ({
          imports: chunks.reduce(
            (manifest, { name, fileName }) => ({
              ...manifest,
              ...keyValueDecorator(name, fileName, opt),
            }),
            seed,
          ),
          integrity: chunks.reduce((manifest, { fileName, code }) => {
            // 预生成的 sourceMappingURL 注释
            const sourceMappingURL = `//# sourceMappingURL=${fileName}.map`;

            // 如果代码中还没有插入 sourceMappingURL，则提前添加
            const codeWithSourceMap = `${code}${sourceMappingURL}\n`;

            const integrityHash = calculateIntegrityHashByContent(codeWithSourceMap);

            return {
              ...manifest,
              ...keyValueDecorator(`${publicPath}${currentVersion}/${fileName}`, integrityHash, {}),
            };
          }, seed),
        }),
      }),
      mv(
        [
          {
            src: `lib/externals/${currentVersion}/gbiz-import-map.json`,
            dest: 'lib/gbiz-import-map.json',
          },
        ],
        {
          overwrite: true,
        },
      ),
      copy({
        targets: fs.readdirSync('packages').map((pkg) => {
          return {
            src: `packages/${pkg}/src/locale/*.json`,
            dest: `lib/externals/${packageJson.version}/locales/${pkg}`,
          };
        }),
      }),
      optimizeLodashImports(),
      visualizer({
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },
];
