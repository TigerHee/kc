/**
 * Owner: harry.lai@kupotech.com
 */
import { getSensorsABResult, PAGE_AB_CONFIG } from '../kcsensorsConf';

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

/**
 * 使用提供的 fetch 函数异步获取 AB 测试数据，返回一个以 abTestKey 为键的包含 AB 测试结果的对象。
 *
 * @param {string} abTestKey - 代表 AB 测试的键。
 * @param {Function} promiseFetchFnc - 一个异步函数，用于获取 AB 测试数据。
 * @returns {Promise<Object>} 一个 promise 对象，解析为一个以 abTestKey 为键，包含 AB 测试结果的对象。
 */
export const makeTaskABTestResultByFetch = async (abTestKey, promiseFetchFnc) => {
  try {
    if (!abTestKey) {
      console.error('makeTaskABTestResultByFetch-abTestKey 参数是必须的。');
      return Promise.reject();
    }
    if (typeof promiseFetchFnc !== 'function') {
      console.error('makeTaskABTestResultByFetch-promiseFetchFnc 必须是一个函数。');
      return Promise.reject();
    }

    const data = await promiseFetchFnc();
    return {
      [abTestKey]: data,
    };
  } catch (error) {
    console.error('makeTaskABTestResultByFetch failed!', error);
    return Promise.reject();
  }
};

export const convertPromiseRespTask = (promisedResults) => {
  const res = promisedResults.reduce((state, currentResp) => {
    const { status, value } = currentResp;

    if (status !== 'fulfilled') return state;

    return {
      ...state,
      ...(value || {}),
    };
  }, {});

  return res;
};
