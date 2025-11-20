/**
 * Owner: garuda@kupotech.com
 * 用来处理文件别名
 */

const path = require('path');
const botAlias = require('./botAlias');

module.exports = {
  ...botAlias,
  '@': path.resolve(__dirname, '../src/trade4.0'),
  '@mui': path.resolve(__dirname, '../src/trade4.0/components/mui'),
  '@/pages/Orderbook': path.resolve(__dirname, '../src/trade4.0/pages/Orderbook'),
  Bot: path.resolve(__dirname, '../src/trade4.0/pages/Bot'),
  src: path.resolve(__dirname, '../src'),
  codes: path.resolve(__dirname, '../src/codes'),
  assets: path.resolve(__dirname, '../src/assets'),
  components: path.resolve(__dirname, '../src/components'),
  hooks: path.resolve(__dirname, '../src/hooks'),
  hocs: path.resolve(__dirname, '../src/hocs'),
  models: path.resolve(__dirname, '../src/models'),
  pages: path.resolve(__dirname, '../src/pages'),
  pipeline: path.resolve(__dirname, '../src/pipeline'),
  services: path.resolve(__dirname, '../src/services'),
  themes: path.resolve(__dirname, '../src/themes'),
  style: path.resolve(__dirname, '../src/style'),
  utils: path.resolve(__dirname, '../src/utils'),
  config: path.resolve(__dirname, '../src/runtime-config'),
  helper: path.resolve(__dirname, '../src/helper'),
  paths: path.resolve(__dirname, '../src/paths'),
  common: path.resolve(__dirname, '../src/common'),
  tools: path.resolve(__dirname, '../tools'),
};
