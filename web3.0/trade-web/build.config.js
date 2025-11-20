/**
 * Owner: garuda@kupotech.com
 */

import webpack from 'webpack';
import UselessFile from 'useless-files-webpack5-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import CircularDependencyPlugin from 'circular-dependency-plugin';

import alias from './config/alias';
import { analyzer, analyzer_useless } from './config/base';
import define, { _PUBLIC_PATH_ } from './config/define';
import extraBabelPlugins from './config/babelPlugins';
import theme from './config/theme.config';
import pkg from './package.json';
import postCssPlugin from './config/postCssPlugin';
import cssLoaderModules from './config/cssLoaderModules';
import devServer from './config/devServer';

const deployPath = 'static';
const ANTD_ICON_REGEXP = /node_modules\/antd\/es\/icon\/index\.js/;

export default {
  entry: {
    app: './src/app.js',
    theme: './src/theme-boot.js',
  },
  publicPath: _PUBLIC_PATH_ || '/',
  filename: '[name].[chunkhash:6].js',
  assetsPath: {
    js: `${deployPath}/js`,
  },
  outputPath: 'dist',
  externals: [
    'react-redux',
    'react-router-dom',
    /@kucoin-biz/,
    /@kucoin-base/,
    'trade_charting-library-master',
  ],
  theme: theme(),
  alias,
  define,
  extraBabelPlugins,
  extraPostCSSPlugins: postCssPlugin,
  presetReactOption: { runtime: 'automatic', importSource: '@emotion/react' },
  mapVersion: false,
  autoCssModules: false, // 全部启用 css modules
  cssLoaderModules,
  // 覆盖 devServer
  devServer,
  // 模块联邦配置
  moduleFederation: {
    filename: `${deployPath}/js/remoteEntry.[chunkhash:6].js`,
    exposes: {
      BotList: './src/trade4.0/pages/Bot/Module/BotOrderAndProfit/export.js',
    },
  },
  chainWebpack: (config) => {
    // 使用 split chunks 分割出 light.css 跟 dark.css 变量文件
    config.optimization.splitChunks({
      cacheGroups: {
        styleDark: {
          test: /dark\.theme\.less$/,
          name: 'dark',
          chunks: 'all',
          enforce: true,
        },
        styleLight: {
          test: /light\.theme\.less$/,
          name: 'light',
          chunks: 'all',
          enforce: true,
        },
      },
    });
    // remove natasha/cli MiniCssExtractPlugin
    config.plugins.delete('MiniCssExtractPlugin');

    // 覆写 mini-css-extract-plugin 配置，输出不带hash 的css
    config.plugin('extract-css').use(MiniCssExtractPlugin, [
      {
        filename: `${deployPath}/css/[name].css`,
        ignoreOrder: true,
      },
    ]);

    // remove natasha/cli WebpackManifestPlugin
    config.plugins.delete('WebpackManifestPlugin');
    // 覆写 WebpackManifestPlugin
    config.plugin('manifest').use(WebpackManifestPlugin, [
      {
        generate(seed, files) {
          const importMap = {
            imports: {},
          };
          files.forEach((file) => {
            // 限定死入口文件为 app.js
            if (file.isChunk && file.chunk) {
              if (file.name === 'app.css') {
                importMap.imports[`${pkg.name}/app@css`] = file.path;
              }
              if (file.name === 'app.js') {
                importMap.imports[`${pkg.name}/app`] = file.path;
              }
            }
          });
          return importMap;
        },
        fileName: 'import-map.json',
      },
    ]);

    // 过滤 plugin
    config
      .plugin('ignore-locale')
      .use(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
      );
    config.plugin('ignore-intl').use(
      new webpack.IgnorePlugin({
        resourceRegExp: /^intl\/locale-data\/jsonp\/.+\.js$/,
      }),
    );

    // 加载 worker-loader
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader(require.resolve('worker-loader'))
      .options({
        filename: '[name].[contenthash].worker.js',
        inline: 'fallback',
      });

    // 加载 antd-icon
    config
      .plugin('normal-module-replacement-plugin')
      .use(webpack.NormalModuleReplacementPlugin, [
        ANTD_ICON_REGEXP,
        './src/components/Icon/index.js',
      ]);

    if (analyzer) {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          analyzerPort: 8889,
          openAnalyzer: true,
          analyzerMode: 'server',
        },
      ]);
    }

    if (analyzer_useless) {
      config.plugin('useless-files').use(
        new UselessFile({
          webpack: '5', // 如果是webpack5的项目，需要说明webpack版本为 5 ，其他webpack版本无需这个参数
          root: './src', // 项目目录
          out: './coverage/fileList.json', // 输出文件列表名
          clean: false, // 是否自动删除文件, 谨慎使用
          exclude: /node_modules/, // 排除文件列表
        }),
      );
    }

    config.merge({
      output: {
        uniqueName: pkg.name,
        devtoolNamespace: pkg.name,
        assetModuleFilename: `${deployPath}/media/[hash][ext][query]`,
        clean: true,
        crossOriginLoading: 'anonymous',
      },
    });

    // 分析循环依赖
    // config.plugin('circular-dependency-plugin').use(CircularDependencyPlugin, [
    //   {
    //     exclude: /node_modules/, // 排除 node_modules 目录
    //     // `onStart` is called before the cycle detection starts
    //     onStart({ compilation }) {
    //       console.log('start detecting webpack modules cycles');
    //     },
    //     // `onDetected` is called for each module that is cyclical
    //     onDetected({ module: webpackModuleRecord, paths, compilation }) {
    //       // `paths` will be an Array of the relative module paths that make up the cycle
    //       // `module` will be the module record generated by webpack that caused the cycle
    //       console.log('compileError --->', paths.join(' -> '))
    //       // compilation.errors.push(new Error(paths.join(' -> ')));
    //     },
    //     // `onEnd` is called before the cycle detection ends
    //     onEnd({ compilation }) {
    //       console.log('end detecting webpack modules cycles');
    //     },
    //   },
    // ]);

    // 处理kufox按需加载
    config
      .plugin('moduleReplace-kufox-mui')
      .use(webpack.NormalModuleReplacementPlugin, [
        /@kufox\/mui/,
        (resource) => {
          if (resource.request.match(/(isPropValid)/)) {
            resource.request = '@emotion/is-prop-valid';
          }
          if (
            resource.request.match(/(css)|(ClassNames)|(keyframes)|(Global)/)
          ) {
            if (/\/emotion\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kufox/mui',
              '@kufox/mui/emotion',
            );
          }
          if (resource.request.match(/(styled)/)) {
            if (/\/emotion\//.test(resource.request)) return;
            resource.request = '@kufox/mui/emotion';
          }
          if (resource.request.match(/\/use/)) {
            if (/\/hooks\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kufox/mui',
              '@kufox/mui/hooks',
            );
          }
          if (resource.request.match(/\/with/)) {
            if (/\/hocs\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kufox/mui',
              '@kufox/mui/hocs',
            );
          }
          if (
            resource.request.match(
              /(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)/,
            )
          ) {
            if (/\/utils\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kufox/mui',
              '@kufox/mui/utils',
            );
          }
        },
      ]);
    // 处理kux按需加载
    config
      .plugin('moduleReplace-kux-mui')
      .use(webpack.NormalModuleReplacementPlugin, [
        /@kux\/mui/,
        (resource) => {
          if (resource.request.match(/(isPropValid)/)) {
            resource.request = '@emotion/is-prop-valid';
          }
          if (
            resource.request.match(/(css)|(ClassNames)|(keyframes)|(Global)/)
          ) {
            if (/\/emotion\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kux/mui',
              '@kux/mui/emotion',
            );
          }
          if (resource.request.match(/(styled)/)) {
            if (/\/emotion\//.test(resource.request)) return;
            resource.request = '@kux/mui/emotion';
          }
          if (resource.request.match(/\/use/)) {
            if (/\/hooks\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kux/mui',
              '@kux/mui/hooks',
            );
          }
          if (resource.request.match(/\/with/)) {
            if (/\/hocs\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kux/mui',
              '@kux/mui/hocs',
            );
          }
          if (
            resource.request.match(
              /(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)/,
            )
          ) {
            if (/\/utils\//.test(resource.request)) return;
            resource.request = resource.request.replace(
              '@kux/mui',
              '@kux/mui/utils',
            );
          }
        },
      ]);

    // 过滤掉一些 node_modules 包里面的 warning，因为我们没法处理
    config.merge({
      ignoreWarnings: [
        (warning) => {
          // 这个警告都升级下 antd，但是需要发布 @kc/ui，所以先过滤掉
          if (
            warning.toString().indexOf('Replace text-decoration-skip: ink') > -1
          ) {
            return true;
          }
        },
      ],
    });
  },
};
