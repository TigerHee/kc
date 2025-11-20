/**
 * Owner: will.wang@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

// 配置路由不带 entry
const routes = null;
const distDirName = 'futures/pro';

module.exports = {
  projectName: 'kumex-pro',
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '/futures',
  supportLangs: [],
  routes,
  routeSets: ['default'],
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
    moveToBodyHeadScriptPatterns: ['/futures/pro'],
  },
};
