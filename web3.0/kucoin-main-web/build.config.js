import { rtl } from './config/postCssPlugins';
import alias from './config/alias';
import define from './config/define';
import extraBabelPlugins from './config/extraBabelPlugins';
import theme from './config/theme.config';
import pkg from './package.json';
const webpack = require('webpack');
const deployPath = `${pkg.name}/${pkg.version}`;
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const analyze = process.env.ANALYZE;

export default {
  entry: {
    app: './src/app.js',
  },
  publicPath: process.env.APP_CDN || '/',
  filename: '[name].[chunkhash:6].js',
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
      .rule('svgr')
      .use('file-loader')
      .merge({
        options: {
          name: `${deployPath}/svg/[name].[hash:8].[ext]`,
        },
      });

    const splitChunks = config.optimization.get('splitChunks');
    if (!splitChunks) {
      // 如果 splitChunks 未定义，则初始化它
      config.optimization.splitChunks({});
    }

    // 直接定义 mathjsVendor 缓存组，而不是尝试访问已有的 cacheGroups
    config.optimization.splitChunks({
      cacheGroups: {
        mathjsVendor: {
          test: /[\\/]node_modules[\\/]mathjs[\\/]/,
          name: 'vendor-mathjs',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
      },
    });
    //测试阶段
    // config.module
    //   .rule('babel')
    //   .use('babel-loader')
    //   .tap((options) => {
    //     options.presets[0][1] = {
    //       ...options.presets[0][1],
    //       useBuiltIns: 'entry',
    //     };
    //     return options;
    //   });
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
    // 处理kufox按需加载
    config.plugin('moduleReplace').use(webpack.NormalModuleReplacementPlugin, [
      /@kufox\/mui/,
      (resource) => {
        if (resource.request.match(/(isPropValid)/)) {
          resource.request = '@emotion/is-prop-valid';
        }
        if (resource.request.match(/(variant)/)) {
          resource.request = 'styled-system';
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
        if (
          resource.request.match(
            /(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)|(refType)/,
          )
        ) {
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
        if (resource.request.match(/(variant)/)) {
          resource.request = 'styled-system';
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
            /(px2rem)|(animate)|(ownerWindow)|(ownerDocument)|(debounce)|(refType)/,
          )
        ) {
          resource.request = resource.request.replace('@kux/mui', '@kux/mui/utils');
        }
      },
    ]);
    if (analyze) {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static', // 设置模式为 'static' 生成静态文件
          reportFilename: 'report.html', // 输出报告的文件名，默认为 'report.html'
          openAnalyzer: false, // 设置为 `false` 防止自动打开分析报告
          // 其他配置项...
        },
      ]);
    }
  },
};
