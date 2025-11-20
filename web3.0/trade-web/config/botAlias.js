/**
 * Owner: mike@kupotech.com
 * 用来处理文件别名
 */

const path = require('path');

const genPath = (moduleName) => {
  return path.resolve(__dirname, `../src/trade4.0/pages/Bot/Strategies/${moduleName}/`);
};
const pathMap = {};
const moduleNames = [
  'ClassicGrid',
  'AutomaticInverst',
  'FutureGrid',
  'InfinityGrid',
  'SmartTrade',
  'Martingale',
  'SuperAI',
  'AiFutureBilater',
  'LeverageGrid',
  'AiSpotTrend',
  'AiFutureTrend',
  'FutureMartingale',
];
moduleNames.forEach((moduleName) => {
  pathMap[moduleName] = genPath(moduleName);
});
module.exports = pathMap;
