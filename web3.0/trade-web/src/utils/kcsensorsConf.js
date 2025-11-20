/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-03-20 17:43:57
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2024-05-22 16:46:23
 * @FilePath: /trade-web/src/utils/kcsensorsConf.js
 * @Description:  sensors使用本地包
 */
import sensors from '@kucoin-base/sensors';
import { _IS_TEST_ENV_ } from 'src/utils/env';

export const siteId = 'kcWeb';

// 旧版交易大厅pageid配置
export const oldPageIdMap = {
  '/trade/:symbol?': 'B5trading',
  '/trade/spot/:symbol?': 'B5trading',
  '/trade/margin/:symbol?': 'B5trading',
  '/trade/isolated/:symbol?': 'B5trading',
  '/trade/grid/:symbol?': 'B5trading',
};

export const pageIdMap = {
  '/trade/:symbol?': 'B5trading',
  '/trade/spot/:symbol?': 'B5trading',
  '/trade/margin/:symbol?': 'B5crosstrading',
  '/trade/isolated/:symbol?': 'B5isolatedtrading',
  '/trade/grid/:symbol?': 'B5trading',

  '/trade/strategy/:symbol?': 'B5strategy',
  '/trade/strategy/spotgrid/:symbol?': 'B5spotgrid',
  '/trade/strategy/futuresgrid/:symbol?': 'B5futuresgrid',
  '/trade/strategy/infinitygrid/:symbol?': 'B5infinitygrid',
  '/trade/strategy/margingrid/:symbol?': 'B5margingrid',
  '/trade/strategy/supergrid/:symbol?': 'B5supergrid',
  '/trade/strategy/dca/:symbol?': 'B5dca',
  '/trade/strategy/cta/:symbol([^-]+)?': 'B5futurescta',
  '/trade/strategy/cta/:symbol([A-Za-z]{2,8}-[A-Za-z]{2,8})?': 'B5spotcta',
  '/trade/strategy/rebalance/:symbol?': 'B5rebalance',
  '/trade/strategy/martingale/:symbol([^-]+)?': 'B5futuresmartingale', // 现货交易对
  '/trade/strategy/martingale/:symbol([A-Za-z]{2,8}-[A-Za-z]{2,8})?': 'B5spotmartingale', // 合约交易对
  '/trade/strategy/dualfuturesai/:symbol?': 'B5dualfuturesai',

  '/trade/futures/:symbol?': 'B5futures',
};

const sensorsConfig = {
  env: _DEV_ || _IS_TEST_ENV_ ? 'development' : 'production',
  ...(_IS_SANDBOX_ ? { log: false } : {}),
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    _DEV_ || _IS_TEST_ENV_
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
};

function initHandler() {
  // saveSpmQueryParam2SessionStorage
  if (window.$KcSensors && window.$KcSensors.spmStorage) {
    window.$KcSensors.spmStorage.initSpmParam(window.location.href);
  }
  window.$KcSensors.init(sensorsConfig);
}

export default () => {
  window.$KcSensors = sensors;
  if (window.$KcSensors) {
    initHandler();
  }
};

export const KcSensorsLogin = (uid, userLevel) => {
  if (window.$KcSensors) {
    window.$KcSensors.login(uid, userLevel);
  }
};

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  const getABFunc = sensors.fastFetchABTest;
  if (getABFunc) {
    return getABFunc(_config);
  }
  return Promise.resolve(_config.default_value);
};

// 神策ab默认传参
export const PAGE_AB_CONFIG = (paramName) => {
  // param_name: 'trade_ab',// 新老交易页面AB测
  return {
    param_name: paramName,
    value_type: 'String',
    default_value: 'old',
  };
};
