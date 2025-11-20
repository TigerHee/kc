/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');
const { THEME_DEFAULT, THEME_DARK } = require('@scripts/themes');

// 配置路由不带 entry
const routes = {
  [THEME_DEFAULT]: {
    webRoutes: ['/signup', '/signin', '/reset-password'],
  },
  [THEME_DARK]: {
    webRoutes: ['/signup', '/signin', '/reset-password'],
  },
};
const distDirName = 'ucenter-web';

module.exports = {
  projectName: distDirName,
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '/ucenter',
  supportLangs: [],
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
    moveToBodyHeadScriptPatterns: ['/ucenter-web/'],
  },
};
