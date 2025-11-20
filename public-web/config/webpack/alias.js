/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-02 14:36:39
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-12 19:53:07
 * @FilePath: /public-web/config/webpack/alias.js
 * @Description: 
 */
import path from 'path';

const cwd = process.cwd();

export default {
  scripts: path.join(cwd, 'scripts'),
  static: path.join(cwd, 'cdnAssets/static'),
  src: path.join(cwd, 'src'),
  helper: path.join(cwd, 'src/helper'),
  config: path.join(cwd, 'src/config'),
  codes: path.join(cwd, 'src/codes'),
  paths: path.join(cwd, 'src/paths'),
  utils: path.join(cwd, 'src/utils'),
  tools: path.join(cwd, 'src/tools'),
  hocs: path.join(cwd, 'src/hocs'),
  routes: path.join(cwd, 'src/routes'),
  models: path.join(cwd, 'src/models'),
  services: path.join(cwd, 'src/services'),
  selector: path.join(cwd, 'src/selector'),
  components: path.join(cwd, 'src/components'),
  meta: path.join(cwd, 'src/meta'),
  common: path.join(cwd, 'src/common'),
  hooks: path.join(cwd, 'src/hooks'),
  theme: path.join(cwd, 'src/theme'),
  TradeActivityCommon: path.join(cwd, 'src/components/TradeActivity/ActivityCommon'),
  TradeActivity: path.join(cwd, 'src/components/TradeActivity'),
};
