/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

// const routes = [];
const distDirName = 'cashback-referral-web';

module.exports = {
  projectName: distDirName,
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '', // main-web 和 public-web 不区分 entry
  supportLangs: [],
  routes: null,
  routeSets: [
    'default-static', // web- 静态路由
    // 'app-default-static', // app - 静态路由
  ],
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
    moveToBodyHeadScriptPatterns: ['/cashback-referral-web/'],
  },
};
