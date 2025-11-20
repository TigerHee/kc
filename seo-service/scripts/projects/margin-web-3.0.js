/**
 * Owner: borden@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

const distDirName = 'margin-web-3.0';

module.exports = {
  projectName: distDirName,
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '',
  supportLangs: [],
  routes: null,
  routeSets: [
    'default',
    'app-default',
    'etf-details',
    'spot-index',
    'app-spot-index',
  ],
  mobileGen: true,
  resolveContentConfig: {
    removeHeadScriptPatterns: [
      '/yandex-metrica-watch/',
      '/twitter-ads/',
      '/sensorsdata.min.js',
      '/natasha/npm/sa/',
      '/bundle.tracing.min.js',
      'www.googletagmanager.com/gtm.js',
    ],
    moveToBodyHeadScriptPatterns: ['/margin-web-3.0/'],
  },
};
