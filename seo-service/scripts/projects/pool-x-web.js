/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');
const { THEME_DEFAULT } = require('@scripts/themes');

// 配置路由不带 entry
const routes = {
  [THEME_DEFAULT]: {
    webRoutes: [
      '/',
      '/dual',
      '/convert-plus',
      '/future-plus',
      '/dot-slot-auction',
      '/kcs',
      '/eth2',
      '/snowball',
      '/twin-win',
      '/shark-fin',
      '/x-lockdrop',
      '/savings',
      '/staking',
      '/promotion',
      '/range-bound',
      '/welfare',
    ],
  },
};
const distDirName = 'earn-pc';

module.exports = {
  projectName: 'pool-x-web',
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '/earn',
  supportLangs: ['en', 'zh-hant'],
  routes,
  routeSets: [],
  mobileGen: true,
  resolveContentConfig: {
    removeHeadScriptPatterns: [
      '/yandex/metrica-watch-tag.min.js',
      '/twitter-ads/',
      '/sensorsdata.min.js',
      '/natasha/npm/sa/',
      '/bundle.tracing.min.js',
      'www.googletagmanager.com/gtm.js',
    ],
    moveToBodyHeadScriptPatterns: ['/pool-x-web/'],
  },
};
