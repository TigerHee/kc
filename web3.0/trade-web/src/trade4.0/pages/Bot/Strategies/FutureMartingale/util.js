/**
 * Owner: mike@kupotech.com
 */
import { times100 } from 'Bot/helper';

export const nextTick = (callback) => {
  Promise.resolve().then(callback);
};

/**
 * @description: // 做多 价格跌多少加仓/做空 价格涨多少加仓
 * @param {*} direction
 * @return {*}
 */
export const getBuyAfterFallLabel = (direction) => {
  return direction === 'long' ? 'rjtTsZTWM5bqh7Rzmbr4Gt' : '9sSvrPa2yYzBortZ3xeCT2'; // label 名字
};

/**
 * @description: 根据方向/买 获取显示的买卖文本
 * @param {*} direction
 * @param {*} isBuy
 * @return {*}
 */
export const getSideTextMeta = ({ direction, isBuy }) => {
  const sideConfig = {
    buy: {
      color: 'primary',
      text: 'buy',
    },
    sell: {
      color: 'secondary',
      text: 'sell',
    },
  };
  let { buy, sell } = sideConfig;
  if (direction === 'short') {
    [buy, sell] = [sell, buy];
  }
  const meta = isBuy ? buy : sell;
  return meta;
};

/**
 * @description: 删除data数据中, keys字段
 * @param {object} data
 * @param {string|array} data
 * @return {*}
 */
export const dropKeys = (data = {}, keys = []) => {
  data = { ...data };
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  keys.forEach((key) => {
    delete data[key];
  });
  return data;
};

/**
 * @description: 把参数中的字段乘100
 * @param {object} data
 * @param {array} times100Config
 * @return {*}
 */
export const times100Process = (data = {}, times100Config = []) => {
  data = { ...data };
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (times100Config.includes(key)) {
        data[key] = data[key] ? times100(data[key]) : '';
      } else {
        data[key] = data[key] ?? '';
      }
    }
  }
  return data;
};

/**
 * @description: 这几个字段乘100
 * @param {*} params
 * @return {*}
 */
export const processData = (params) => {
  params = { ...params };
  ['buyAfterFall', 'stopProfitPercent', 'stopLossPercent'].forEach((key) => {
    if (params[key] !== undefined) {
      params[key] = times100(params[key]);
    }
  });
  return params;
};
