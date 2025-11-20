/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-26 18:11:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-04 12:34:18
 * @FilePath: /seo-service/scripts/projects/public-web.js
 * @Description:
 */
/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

const distDirName = 'public-web';

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
    'pre-market',
    'app-pre-market',
    'gemslot-details',
    'app-gemslot-details',
    'gempool-detail',
    'app-gempool-detail',
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
    moveToBodyHeadScriptPatterns: ['/public-web/'],
  },
};
