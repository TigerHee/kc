/**
 * Owner: harry.lai@kupotech.com
 */
import { getABtestResultBySensorKey } from './util';

export const getTradeFuturesAB = async () => {
  try {
    // 请求神策ab 接口
    // const data = await getSensorsABResult({
    //   ...PAGE_AB_CONFIG('trade_futures_version'),
    // });
    const data = 'old';
    console.log('futures ABTest --->', data);
    window.TRADE_FUTURES_AB = data; // 判断合约 ab 全局变量
    return data;
  } catch (err) {
    window.TRADE_FUTURES_AB = 'old';
    console.log('futures ABTest failed! --->', err);
  }
};

export const getTradeAB_test = async () => {
  try {
    // 神策abTest查询是否展示新交易页面
    // const data = await getSensorsABResult({
    //   ...PAGE_AB_CONFIG('trade_ab'),
    // });
    const data = 'new'; // 直接赋值为新版本，去掉 abtest 接口请求代码
    console.log(data, 'abtest trade4.0');
    window.TRADE_AB = data; // 判断新老交易页 全局变量
    return data;
  } catch (err) {
    console.log(err, 'abtest failed!');
  }
};

export const getTradeFuturesCrossAB = async () => {
  try {
    // 请求神策ab 接口
    // const data = await getABtestResultBySensorKey('trade_futures_cross_version', {
    //   defaultValue: 'old',
    //   valueType: 'String',
    // });
    const data = 'new';
    console.log('futures cross ABTest --->', data);
    window.TRADE_FUTURES_CROSS_AB = data; // 判断合约 ab 全局变量
    return data;
  } catch (err) {
    window.TRADE_FUTURES_CROSS_AB = 'old';
    console.log('futures cross ABTest failed! --->', err);
  }
};

/**
 * 神策获取kline点击冒泡优化是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getOptimizeKlineBubblingEvent = async () => {
  const data = await getABtestResultBySensorKey('trade_ab_optimize_kline_bubble', {
    defaultValue: '0',
    valueType: 'String',
  });

  return data === '1';
};

/**
 * 神策获取xkucoin是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getTradeXkucoinAB = async () => {
  const data = await getABtestResultBySensorKey('trade_ab_miniApp', {
    defaultValue: '0',
    valueType: 'String',
  });
  return data === '1';
};

/**
 * 神策获取交易下单委托与订单查询增加TWAP时间加权委托类型是否启用， 灰度默认为'0' 不启用 '1'表示启用
 * @returns {Promise<boolean>}
 */
export const getTradeAddTWAPOrder = async () => {
  const data = await getABtestResultBySensorKey('trade_ab_twap_order', {
    defaultValue: '0',
    valueType: 'String',
  });

  return data;
};

/* 策略ABtest bot开关功能保留
 * @returns {Promise<boolean>}
 */
export const getTradeBotAB_test = async () => {
  // 判断bot ab 全局变量
  window.IS_NEW_TRADE_BOT = true;
  return true;
};
