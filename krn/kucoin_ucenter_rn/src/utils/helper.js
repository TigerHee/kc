import _ from 'lodash';
import storage from 'utils/storage';
import Decimal from 'decimal.js';
import moment from 'moment';

// 对象转表单数据
export const formlize = obj => {
  if (obj instanceof FormData) {
    return obj;
  }
  const form = new FormData();
  _.each(obj, (value, key) => {
    if (typeof value !== 'undefined') {
      form.append(key, value);
    }
  });
  return form;
};

// 设置NATIVE_INFO
let _NATIVE_INFO;
export const setNativeInfo = async info => {
  if (info) {
    _NATIVE_INFO = info;
    await storage.setItem('NATIVE_INFO', info);
  }
};

export const getNativeInfo = async () => {
  if (_NATIVE_INFO) {
    return _NATIVE_INFO;
  } else {
    return (await storage.getItem('NATIVE_INFO')) || {};
  }
};

export const dropZero = str => {
  if (!str) return '-';
  const e = new Decimal(str);
  return e.toFixed();
};

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
export const numberFixed = (v, decimal, round = Decimal.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Decimal(stringV).toFixed(decimal, round);
};
export const showDatetime = (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(_.toNumber(timestamp)).format(format);
};
/**
 * 按固定时区格式化
 * @param {*} ts
 * @param {*} zone
 */
export const showDateTimeByZone = (
  ts,
  format = 'YYYY/MM/DD HH:mm:ss',
  zone = 8,
) => {
  return moment(ts).utcOffset(zone).format(format);
};

/**
 * 高精度除法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divide = (a, b, decimal = 8, round = Decimal.ROUND_HALF_UP) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new Decimal(a).div(b).toFixed(decimal, round);
};

/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number} 如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。
 */

export const compareVersion = (v1, v2) => {
  let _v1 = v1.split('.');
  let _v2 = v2.split('.');
  let _r = _v1[0] - _v2[0];

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};
