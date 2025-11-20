/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const resolveProjectDist = require('@utils/resolve-project-dist');
const rootDistConfigs = require('@scripts/dists');

const distDirName = 'trade';

module.exports = {
  projectName: 'trade-web',
  distDirName,
  distConfig: resolveProjectDist(distDirName, rootDistConfigs),
  entry: '/trade',
  routes: null,
  routeSets: [],
  mobileGen: false,
  supportLangs: [],
  resolveContentConfig: {
    removeHeadScriptPatterns: [
      '/sensorsdata.min.js',
      '/natasha/npm/sa/',
    ],
  },
};
