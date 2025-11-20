/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

const distDirName = 'brisk-web';

module.exports = {
  projectName: distDirName,
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '',
  supportLangs: [],
  routes: null,
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
    moveToBodyHeadScriptPatterns: ['/brisk-web/'],
  },
};
