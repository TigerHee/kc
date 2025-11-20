/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 11:27:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-30 20:32:34
 * @FilePath: /public-web/src/tools/sensorsReportConf.js
 * @Description:
 */
/**
 * Owner: willen@kupotech.com
 */
import sensors from 'tools/ext/kc-sensors';
import { IS_TEST_ENV, _DEV_ } from '../utils/env';

export const siteId = 'kcWeb';

export const pageIdMap = {
  '/': 'B1homepage',
  '/price/:coin': 'BScoinDetail',
  '/download': 'B1Download',
  '/convert': 'BSfastTrade',
  '/support': 'Support',
  // '/aptp': 'B5PreMarket',
  '/pre-market': 'B5PreMarket',
  '/pre-market/:coin': 'B5PreMarket',
  '/pre-market/myOrder': 'B5PreMarketOrder',
  '/gemvote': 'B5GemVote',
  '/gemvote/voting': 'B5GemVote',
  '/gemvote/record': 'B5GemVote',
  '/gemvote/history': 'B5GemVote',
  '/gemspace/:type': 'B5gemspace',
  '/gempool': 'B5gempool',
  '/gempool/:coin': 'B5gempool',
  '/cert': 'OfficalVerfi',
  '/kcs': 'B9earnkcs',
  '/spotlight-center': 'B5spotlight',
  '/spotlight_r6/:id': 'B5spotlightR6',
  '/spotlight7/:id': 'B5spotlightR7',
  '/spotlight_r8/:id': 'B5spotlightR8',
  '/user-guide/:type': 'B5UserGuide',
};

export const sensorsConfig = {
  env: _DEV_ || IS_TEST_ENV ? 'development' : 'production',
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    _DEV_ || IS_TEST_ENV
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
  log: false,
  // log: true, // 需要在 dev 环境查看上报log的话，就要把这里设置为 true
  sdk_url: 'https://assets.staticimg.com/natasha/npm/sensorsdata/sensorsdata.min.js',
};

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  if (sensors) {
    return sensors.fastFetchABTest(_config);
  }
  return Promise.resolve(_config.default_value);
};

export const getABtestResultBySensorKey = async (sensorKey, { defaultValue, valueType }) => {
  if (!sensorKey) return;
  // 默认需要传入 valueType ,推断类型慎用
  const inferValueType = (value) => {
    const str = typeof value;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  try {
    // 请求神策ab 接口
    const data = await getSensorsABResult({
      param_name: sensorKey,
      value_type: valueType || inferValueType(defaultValue),
      default_value: defaultValue,
    });
    return data || defaultValue;
  } catch (err) {
    console.error(`getABtestResultBySensorKey failed! ---> key: ${sensorKey}`, err);
    return defaultValue;
  }
};
