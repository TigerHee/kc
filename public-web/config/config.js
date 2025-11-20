/**
 * 开发、国际站配置
 * dev变量区分
 */
import { defineConfig } from 'umi';
import path from 'path';
import _ from 'lodash';
import { isDev } from './env';
import externalScripts, {
  kufoxMuiLink,
  kufoxMuiStyleSheet,
  kufoxMuiFontStyleSheet,
} from './sources';
import theme from './theme.config';
import pkg from '../package.json';
import alias from './umi/alias';
import define from './umi/define';
import extraBabelPlugins from './umi/extraBabelPlugins';
import extraPostCSSPlugins from './umi/extraPostCSSPlugins';
import chainWebpack from './chain-webpack/index';
import scripts from './umi/scripts';

require('dotenv').config({ path: path.resolve(__dirname, '../.xversion') });

const publicPath = `https://assets.staticimg.com/${pkg.name}/${pkg.version}/`;

const _APP_ = `${pkg.name}_${pkg.version}`;
const plugins = [];
// if (isDev) {
//   plugins.push('./config/umi/plugins/umi-plugin-ssg');
// }

export default defineConfig({
  favicon: 'https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png',
  copy: [{ from: 'cdnAssets', to: `${pkg.name}/${pkg.version}/` }],
  inlineLimit: 5000,
  title: false, // 由@kc/tdk处理title
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  chunks: ['vendors', 'commons', 'umi'],
  targets: {
    ie: false,
  },
  fastRefresh: {},
  runtimeHistory: {},
  dynamicImport: {
    loading: 'src/Loading',
  },
  dynamicImportSyntax: {},
  dva: {
    disableModelsReExport: true,
    skipModelValidate: true,
  },
  request: false,
  terserOptions: {
    parallel: true,
  },
  runtimePublicPath: true,
  publicPath,
  theme: theme(),
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  analyze: {
    port: 8889,
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
  ],
  scripts: [
    ...scripts,
    {
      src: 'https://assets.staticimg.com/natasha/npm/@kc/sensors@1.3.0/umd/kcsensors.min.js',
    },
    {
      src: 'https://assets.staticimg.com/web-domain-relation/project_routes.js',
    },
    ...externalScripts,
  ],
  alias,
  define,
  extraBabelPlugins,
  chainWebpack,
  // 添加阿拉伯语右排布局插件
  extraPostCSSPlugins,
  plugins,
  proxy: {
    "/": {
      target: "http://localhost:3001",
      bypass: (req) => {
        if (!req.query.usessg) {
          return req.url;
        }
      }
    }
  }
});
