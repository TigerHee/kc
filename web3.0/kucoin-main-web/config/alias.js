import path from 'path';

export default {
  '@': path.resolve(__dirname, '../src'),
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
};
