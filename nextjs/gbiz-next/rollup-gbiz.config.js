/**
 * Owner: iron@kupotech.com
 */
const fs = require('fs');
const path = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const babel = require('@rollup/plugin-babel');
const alias = require('@rollup/plugin-alias');
const url = require('@rollup/plugin-url');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const { default: outputManifest } = require('rollup-plugin-output-manifest');
const mv = require('rollup-plugin-mv');
const { optimizeLodashImports } = require('@optimize-lodash/rollup-plugin');
const { visualizer } = require('rollup-plugin-visualizer');
const typescript = require('@rollup/plugin-typescript');
const VaultPlugin = require('vault-webpack-plugin/dist/rollup-plugin-vault');
const OutputImportmap = require('./config/rollup-plugin-importmap-generator');
const moduleReplacementPlugin = require('./config/rollup-plguin-replace-import');
const absolutePathSourceMap = require('./config/rollip-plugin-sourcemap-path');
const { calculateIntegrityHashByContent } = require('./config/utils');
const babelConfig = require('./config/babel.systemjs.config');
const packageJson = require('./package.json');

const styles = require('rollup-plugin-styles');
const { copyStaticAssets } = require('./config/rollup-plugins');

const packagesDir = path.resolve(__dirname, 'remoteExternal/');
const isProd = process.env.NODE_ENV === 'production';

const currentVersion = '2022-06-01';
const publicPath =
  // process.env.SITE_ENV === 'dev'
  process.env.NODE_ENV === 'development'
    ? `http://localhost:5002/externals/`
    : `https://assets.staticimg.com/gbiz-next/externals/`;

const outputBase = 'dist/assets/';
const outputDir = path.join(outputBase, `/externals/${currentVersion}/`);

const packageInputs = fs.readdirSync(packagesDir).map(item => `${packagesDir}/${item}`);

const OutputImportmapConfig = {
  currentVersion,
  // externals 下的资源会拷贝到 S3 。import-map.json 这种文件发布到 s3 会导致预发布和生产同时生效，
  // 把 import-map 放到 lib，发布到 efs，隔离预发布和生产环境
  dir: path.join(outputBase, 'externals/import-map'),
};
module.exports = [
  {
    input: packageInputs,
    output: {
      format: 'system',
      dir: outputDir,
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
        entries: {
          tools: path.resolve(__dirname, './src/tools'),
          packages: path.resolve(__dirname, './src/packages'),
          hooks: path.resolve(__dirname, './src/hooks'),
          provider: path.resolve(__dirname, './src/provider'),
          styles: path.resolve(__dirname, './src/styles'),
          locales: path.resolve(__dirname, './src/locales'),
          adaptor: path.resolve(__dirname, './src/adaptor'),
          kycCompliance: path.resolve(__dirname, './src/packages/kyc/src/components/Compliance'),
          'kc-next/boot': path.resolve(__dirname, './src/adaptor/kc-next/boot.js'),
          'kc-next/i18n': path.resolve(__dirname, './src/adaptor/kc-next/i18n.js'),
          'kc-next/env': path.resolve(__dirname, './src/adaptor/kc-next/env.js'),
          'kc-next/compat/router': path.resolve(__dirname, './src/adaptor/kc-next/compat/router.js'),
          'kc-next/utils': path.resolve(__dirname, './src/adaptor/kc-next/utils.js'),
          'next-i18next': path.resolve(__dirname, './src/adaptor/tools/next-i18next.jsx'),
          '@sentry/nextjs': path.resolve(__dirname, './src/adaptor/sentry/index.js'),
          '@transfer': path.resolve(__dirname, './src/packages/transfer/src'),
        },
      }),
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        strictRequires: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: outputDir,
        exclude: ['**/__tests__/**'],
        sourceMap: false,
        removeComments: process.env.NODE_ENV === 'production',
      }),
      babel(babelConfig),
      moduleReplacementPlugin(),
      replace({
        preventAssignment: true,
        values: {
          _SITE_ENV_: JSON.stringify(process.env.SITE_ENV),
          __env__: JSON.stringify(process.env.NODE_ENV),
          __public_path__: JSON.stringify(publicPath),
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          __version__: JSON.stringify(packageJson.version),
          'process.env.NEXT_PUBLIC_SPA': JSON.stringify(process.env.NEXT_PUBLIC_SPA || 'true'),
          'process.env.KC_CDN_SITE_TYPE': "''",
          'process.env.NODE_DEBUG': "''",
          'process.env.NEXT_PUBLIC_APP_NAME': "window.__APP_NAME__ || ''",
          IS_PROXY_DEV: JSON.stringify(process.env.IS_PROXY_DEV),
          'process.env.LEGACY': JSON.stringify(true), // system打包给非SSR工程使用标志
        },
      }),
      // prod 时，SSR build 会先 copy 过去，不用重复copy
      // dev:externals 时需要 copy 
      !isProd && copyStaticAssets(),
      VaultPlugin(),
      styles({
        mode: 'inject',
        autoModules: true,
        minimize: true,
        sourceMap: false,
      }),
      // 兼容 node_modules ESM 中的 ?url / ?inline 资源导入（如 @kux/design）
      // 将 xxx.ext?query 在解析阶段重写为 xxx.ext，让 url 插件接管处理
      {
        name: 'strip-asset-query',
        async resolveId(source, importer) {
          if (/\.(svg|png|jpe?g|gif|mp3|json|woff2?|ttf|eot|webp)\?(?:url|inline).*$/i.test(source)) {
            const cleaned = source.replace(/\?.*$/, '');
            const res = await this.resolve(cleaned, importer, { skipSelf: true });
            if (res) return res;
            return cleaned;
          }
          return null;
        },
      },
      url({
        include: [/\.(svg|png|jpe?g|gif|mp3|json|woff2?|ttf|eot|webp)(\?.*)?$/i],
        publicPath: `${publicPath}${currentVersion}/`,
        limit: 0,
      }),
      // 其后再处理常规 JSON（已被 url 接管为资产的 JSON 不再进入此插件）
      json({
        exclude: [
          /node_modules\/@kux\/design\/dist\/assets\/.*\.json$/i,
        ],
      }),
      absolutePathSourceMap(),
      isProd && terser(),
      OutputImportmap(OutputImportmapConfig),
      outputManifest({
        fileName: 'gbiz-import-map.json',
        publicPath: `${publicPath}${currentVersion}/`,
        nameWithExt: false,
        basePath: '@kucoin-gbiz-next/',
        generate: (keyValueDecorator, seed, opt) => chunks => ({
          imports: chunks.reduce(
            (manifest, { name, fileName }) => ({
              ...manifest,
              ...keyValueDecorator(name, fileName, opt),
            }),
            seed
          ),
          integrity: chunks.reduce((manifest, { fileName, code }) => {
            if (code && code.length > 0) {
              const integrityHash = calculateIntegrityHashByContent(code);
              return {
                ...manifest,
                ...keyValueDecorator(`${publicPath}${currentVersion}/${fileName}`, integrityHash, {}),
              };
            }
            return manifest;
          }, seed),
        }),
      }),
      mv(
        [
          {
            src: path.join(outputDir, 'gbiz-import-map.json'),
            dest: path.join(outputBase, 'externals/import-map', 'gbiz-import-map.json'),
          },
        ],
        {
          overwrite: true,
        }
      ),
      process.env.IS_PROXY_DEV && copyStaticAssets(),
      optimizeLodashImports(),
      visualizer({
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },
];
