import alias from './config/webpack/alias.js';
import define from './config/webpack/define.js';
import extraBabelPlugins from './config/webpack/extraBabelPlugins.js';
import rtl from './config/webpack/extraPostCSSPlugins/index.js';
import theme from './config/webpack/theme.config.js';
import pkg from './package.json' assert { type: 'json' };
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackDeadcodePlugin from 'webpack-deadcode-plugin';

const analyze = process.env.ANALYZE;
const deployPath = `${pkg.name}/${pkg.version}`;

export default {
  entry: {
    app: './src/app.js',
  },
  publicPath: process.env.APP_CDN || '/',
  filename: '[name].[contenthash].js',
  assetsPath: {
    js: `${deployPath}/js`,
    css: `${deployPath}/css`,
  },
  theme: theme(),
  outputPath: 'dist',
  externals: [
    'react-redux',
    'react-router-dom',
    /@kucoin-biz/,
    /@kucoin-base/,
    /@kucoin-gbiz-next/,
    'charting-library-master',
    'lottie-web',
  ],
  alias,
  define,
  extraBabelIncludes: [/node_modules/],
  extraBabelPlugins,
  presetReactOption: { runtime: 'automatic', importSource: '@emotion/react' },
  extraPostCSSPlugins: [rtl],
  // mapVersion: true,
  copy: [
    {
      from: 'cdnAssets',
      to: `./${deployPath}/`,
    },
  ],
  chainWebpack: (config) => {
    config.module
      .rule('babel')
      .exclude.clear()
      .add({
        and: [/node_modules/],
        not: [/chart.js/],
      });
    config.module
      .rule('svgr')
      .use('file-loader')
      .merge({
        options: {
          name: `${deployPath}/svg/[name].[hash:8].[ext]`,
        },
      });

    // 新增 mp4, webp 文件的 file-loader 规则
    config.module
      .rule('mp4')
      .test(/\.mp4$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: `${deployPath}/media/[name].[hash:8].[ext]`,
      });

    // 配置 SCSS Module
    config.module
      .rule('scss-module')
      .test(/\.module\.scss$/)
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({
        sourceMap: true,
        modules: {
          mode: 'local',
          auto: true,
          exportGlobals: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
          exportLocalsConvention: 'camelCase'
        },
        importLoaders: 2
      })
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .end()
      .use('sass-loader')
      .loader('sass-loader')
      .options({
        sassOptions: {
          includePaths: ['node_modules'],
        },
      });

    // 配置普通的 SCSS
    config.module
      .rule('scss')
      .test(/\.scss$/)
      .exclude
      .add(/\.module\.scss$/)
      .end()
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .end()
      .use('sass-loader')
      .loader('sass-loader');

    config.merge({
      output: {
        uniqueName: pkg.name,
        devtoolNamespace: pkg.name,
        assetModuleFilename: `${deployPath}/media/[hash][ext][query]`,
        clean: true,
      },
    });
    // 过滤掉一些 node_modules 包里面的 warning，因为我们没法处理
    config.merge({
      ignoreWarnings: [
        (warning) => {
          // 这个警告都升级下 antd，但是需要发布 @kc/ui，所以先过滤掉
          if (warning.toString().indexOf('Replace text-decoration-skip: ink') > -1) {
            return true;
          }
        },
      ],
    });
    config.plugin('ignore').use(webpack.IgnorePlugin, [
      {
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      },
    ]);

    if (analyze) {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'server',
          analyzerPort: 8889,
          openAnalyzer: true,
        },
      ]);
    }

    // 处理kufox按需加载
    config.plugin('moduleReplace').use(webpack.NormalModuleReplacementPlugin, [
      /@kufox\/mui/,
      (resource) => {
        if (resource.request.match(/(isPropValid)/)) {
          resource.request = '@emotion/is-prop-valid';
        }
        if (resource.request.match(/(css)|(ClassNames)|(keyframes)|(Global)/)) {
          resource.request = resource.request.replace('@kufox/mui', '@kufox/mui/emotion');
        }
        if (resource.request.match(/(styled)/)) {
          resource.request = '@kufox/mui/emotion';
        }
        if (resource.request.match(/\/use/)) {
          resource.request = resource.request.replace('@kufox/mui', '@kufox/mui/hooks');
        }
        if (resource.request.match(/\/with/)) {
          resource.request = resource.request.replace('@kufox/mui', '@kufox/mui/hocs');
        }
        if (resource.request.match(/(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)/)) {
          resource.request = resource.request.replace('@kufox/mui', '@kufox/mui/utils');
        }
      },
    ]);

    // 处理kux按需加载
    config.plugin('moduleReplaceKuxmui').use(webpack.NormalModuleReplacementPlugin, [
      /@kux\/mui/,
      (resource) => {
        if (resource.request.match(/(isPropValid)/)) {
          resource.request = '@emotion/is-prop-valid';
        }
        if (resource.request.match(/(css)|(ClassNames)|(keyframes)|(Global)/)) {
          resource.request = resource.request.replace('@kux/mui', '@kux/mui/emotion');
        }
        if (resource.request.match(/(styled)/)) {
          resource.request = '@kux/mui/emotion';
        }
        if (resource.request.match(/\/use/)) {
          resource.request = resource.request.replace('@kux/mui', '@kux/mui/hooks');
        }
        if (resource.request.match(/\/with/)) {
          resource.request = resource.request.replace('@kux/mui', '@kux/mui/hocs');
        }
        if (
          resource.request.match(
            /(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)|(refType)|(numberFormat)/,
          )
        ) {
          resource.request = resource.request.replace('@kux/mui', '@kux/mui/utils');
        }
      },
    ]);

    // 检查deadcode
    config.plugin('webpack-deadcode-plugin').use(WebpackDeadcodePlugin, [
      {
        patterns: ['src/**/*.js'],
        exclude: ['**/*.(spec|test).js'],
      },
    ]);
  },
};
