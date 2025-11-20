/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-26 18:11:41
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-30 16:15:13
 * @FilePath: /seo-service/scripts/projects/seo-price-web.js
 * @Description:
 */
/**
 * Owner: hanx.wei@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

const distDirName = 'seo-price-web';

module.exports = {
  projectName: distDirName,
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '',
  supportLangs: [],
  routes: null,
  routeSets: ['default', 'price'],
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
    moveToBodyHeadScriptPatterns: ['/seo-price-web/'],
  },
};
