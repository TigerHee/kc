import alias from './config/webpack/alias';
import define from './config/webpack/define';
import extraBabelPlugins from './config/webpack/extraBabelPlugins';
import extraBabelPresets from './config/webpack/extraBabelPresets';
import rtl from './config/webpack/extraPostCSSPlugins';
import optimize from './config/webpack/optimize';
import theme from './config/webpack/theme.config';
import pkg from './package.json';
const analyze = process.env.ANALYZE;
const deployPath = `${pkg.name}/${pkg.version}`;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

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
    'charting-library-master',
  ],
  alias,
  define,
  extraBabelIncludes: [/node_modules/],
  extraBabelPlugins,
  extraBabelPresets,
  // presetReactOption: { runtime: 'automatic', importSource: '@emotion/react' },
  extraPostCSSPlugins: [rtl],
  // mapVersion: true,
  copy: [
    {
      from: 'cdnAssets',
      to: `./${deployPath}/`,
    },
  ],
  // devServer: {
  //   client: {
  //     overlay: false,
  //   },
  // },
  chainWebpack: (config) => {
   if(  config.devServer){
    config.devServer.client = {
      ...(config.devServer.client || {}),
      overlay: false,
    }
   }
    config.module
      .rule('svgr')
      .use('file-loader')
      .merge({
        options: {
          name: `${deployPath}/svg/[name].[hash:8].[ext]`,
        },
      });

    config.module
      .rule('img')
      .test(/\.(png|jpg|webp|jpeg|gif)$/i)
      .set('type', 'asset')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 0,
        },
      });

    config.module
      .rule('babel')
      .exclude.clear()
      .add({
        and: [/node_modules/],
        not: [/react-countup/, /kc\/mk-design/],
      });

    optimize(config);
    config.plugin('ignore').use(webpack.IgnorePlugin, [
      {
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      },
    ]);
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

    if (analyze) {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'server',
          analyzerPort: 8889,
          openAnalyzer: true,
        },
      ]);
    }

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
  },
};
