/**
 * 开发、国际站配置
 * dev变量区分
 */
import { defineConfig } from 'umi';
import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import externalScripts, {
  kufoxMuiLink,
  kufoxMuiStyleSheet,
  kufoxMuiFontStyleSheet,
} from './sources';
import theme from './theme.config';
import pkg from '../package.json';
import registerPluginConfig from './regiter-plugin-config';
import { isDev, isProd } from './env';

const chainWebpackConfigs = require('./webpack');

require('dotenv').config({ path: path.resolve(__dirname, '../.xversion') });

const { XVersion, Desc, FAST } = process.env;
const startFast = FAST === 'startFast';
const _APP_ = `${pkg.name}_${pkg.version}`;
const packageVersion = `${pkg.name}/${pkg.version}`;

const dev = process.env.NODE_ENV === 'development';
const IS_TEST_ENV = process.env.UMI_ENV === 'sit' || process.env.BUILD_ENV === 'sit';

const publicPath = `https://assets.staticimg.com/${packageVersion}/`;
const chartingLibraryPath = dev ? '/static/charting_library_master/' : '/charting_library_master/';

const plugins = [];
// if (dev) {
//   plugins.push('./config/umi-plugin-ssg');
// }

let devConfig = {};
if (dev && startFast) {
  const { routes } = require('./onlyDevRoutes');

  devConfig = {
    routes: routes,
  };
}

export default defineConfig({
  ...devConfig,
  favicon: 'https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png',
  title: false, // 由 @kc/tdk 处理 title
  inlineLimit: 5000,
  copy: dev ? [{ from: 'cdnAssets', to: `${packageVersion}/` }] : void 0, // 仅本地开发保留 copy
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  runtimeHistory: {},
  chunks: dev ? ['vendors', 'umi', 'commons'] : ['vendors', 'umi'],
  fastRefresh: {},
  dynamicImport: {
    loading: 'src/Loading',
  },
  dynamicImportSyntax: {},
  dva: {
    disableModelsReExport: true,
    skipModelValidate: true,
  },
  request: false,
  locale: false,
  terserOptions: {
    parallel: true,
  },
  runtimePublicPath: true,
  publicPath,
  theme: theme(),
  devtool: dev ? 'cheap-module-source-map' : false,
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'stat', // stat  // gzip
  },
  links: [
    {
      rel: 'stylesheet',
      href: kufoxMuiStyleSheet,
    },
    {
      rel: 'stylesheet',
      href: kufoxMuiFontStyleSheet,
    },
    {
      rel: 'preload',
      href: kufoxMuiStyleSheet,
      as: 'style',
    },
    {
      rel: 'preload',
      href: kufoxMuiLink,
      as: 'script',
    },
  ],
  headScripts: [
    {
      src: `https://assets.staticimg.com/web-domain-relation/boot.js?_v=${_APP_}`,
    },
    {
      src: 'https://assets.staticimg.com/natasha/npm/gtm/gtm.js',
    },
  ],
  scripts: [
    {
      // for sentry lazyLoad
      src: `https://assets.staticimg.com/natasha/npm/sentry/7.52.1/sentry-loader.js`,
    },
    {
      src: 'https://assets.staticimg.com/natasha/npm/@kc/sensors@1.3.2/umd/kcsensors.min.js',
    },
    {
      src: 'https://assets.staticimg.com/web-domain-relation/project_routes.js',
    },
    ...externalScripts,
  ],
  alias: {
    scripts: path.resolve(__dirname, '../scripts'),
    static: path.resolve(__dirname, '../cdnAssets/static'),
    src: path.resolve(__dirname, '../src'),
    helper: path.resolve(__dirname, '../src/helper'),
    config: path.resolve(__dirname, '../src/config'),
    codes: path.resolve(__dirname, '../src/codes'),
    paths: path.resolve(__dirname, '../src/paths'),
    utils: path.resolve(__dirname, '../src/utils'),
    tools: path.resolve(__dirname, '../src/tools'),
    hocs: path.resolve(__dirname, '../src/hocs'),
    routes: path.resolve(__dirname, '../src/routes'),
    models: path.resolve(__dirname, '../src/__models'),
    services: path.resolve(__dirname, '../src/services'),
    selector: path.resolve(__dirname, '../src/selector'),
    components: path.resolve(__dirname, '../src/components'),
    meta: path.resolve(__dirname, '../src/meta'),
    common: path.resolve(__dirname, '../src/common'),
    hooks: path.resolve(__dirname, '../src/hooks'),
    theme: path.resolve(__dirname, '../src/theme'),
  },
  define: {
    _XVERSION_: _.isEmpty(XVersion) ? undefined : XVersion,
    _DESC_: _.isEmpty(Desc) ? undefined : Desc,
    _DEV_: dev,
    _APP_NAME_: pkg.name,
    _VERSION_: pkg.version,
    _SITE_: dev ? 'dev' : 'site',
    _APP_,
    SENTRY_DEBUG: true,
    IS_INSIDE_WEB: false,
    IS_TEST_ENV,
    IS_SANDBOX: false,
    CHARTING_PATH: chartingLibraryPath,
    KUFOX_MUI_LINK: kufoxMuiLink,
    _ENV_: isProd ? 'prod' : isDev ? 'dev' : 'sit',
  },
  extraBabelPresets: [
    ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
  ],
  extraBabelPlugins: [
    '@emotion/babel-plugin',
    ['register-model', registerPluginConfig],
    ['import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'],
    ['import', { libraryName: '@kc/ui', style: (name) => `${name}/style.less` }, '@kc/ui'],
    [
      'import',
      { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false },
      'lodash',
    ],
    [
      'import',
      {
        libraryName: '@kc/mui',
        libraryDirectory: 'lib/components',
        camel2DashComponentName: false,
      },
      '@kc/mui',
    ],
    [
      'import',
      {
        libraryName: '@kufox/mui',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      '@kufox/mui',
    ],
    [
      'import',
      {
        libraryName: '@kufox/icons',
        libraryDirectory: 'lib/components',
        camel2DashComponentName: false,
      },
      '@kufox/icons',
    ],
    ['react-loadable/babel'],
  ],
  chainWebpack(memo) {
    chainWebpackConfigs(memo, webpack, {
      isDev: dev,
      publicPathForLoader: publicPath,
      packageVersion,
    });
  },
  // 添加阿拉伯语右排布局插件
  extraPostCSSPlugins: [
    require('postcss-rtl')({
      blacklist: [
        // 'animation',
        // 'animation-duration',
        // 'animation-fill-mode',
        // 'animation-fill-mode',
        // 'animation-play-state',
        // 'animation-name',
        'background',
        'background-attachment',
        'background-color',
        'background-clip',
        '-webkit-background-clip',
        'background-image',
        'background-position',
        'background-position-x',
        'background-position-y',
        'background-repeat',
        'background-size',
        'border',
        'border-bottom',
        'border-bottom-color',
        'border-bottom-style',
        'border-bottom-width',
        'border-color',
        'border-style',
        'border-width',
        'border-top',
        'border-top-color',
        'border-top-style',
        'border-top-width',
        'border-radius',
        'box-shadow',
        'clear',
        'cursor',
        'float',
        'margin',
        'margin-top',
        'margin-bottom',
        'padding',
        'padding-top',
        'padding-bottom',
        'transform-origin',
        'transform',
        '-webkit-transition',
        'transition-delay',
        'transition-duration',
        'transition-property',
        'transition-timing-function',
        'text-align',
        'text-align-last',
        'text-shadow',
      ],
    }),
  ],
  plugins,
  proxy: {
    '/': {
      target: 'http://localhost:3001',
      bypass: (req) => {
        if (!req.query.usessg) {
          return req.url;
        }
      },
    },
  },
});
