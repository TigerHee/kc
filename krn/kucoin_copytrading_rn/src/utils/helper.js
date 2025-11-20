import Decimal from 'decimal.js';
import _ from 'lodash';
import moment from 'moment';
import {Platform} from 'react-native';
import {storage} from '@krn/toolkit';
export {compareVersion} from '@krn/toolkit/src/utils/util';

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
  if (Number.isNaN(numberV) || typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Decimal(stringV).toFixed(decimal, round);
};

/**
 * 移除数字字符串表示中的末尾零。
 * @param {number} number - 需要移除末尾零的数字。
 * @return {string} 移除末尾零后的数字字符串表示。
 */
export const removeTrailingZeros = input => {
  if (typeof input !== 'number' && typeof input !== 'string') {
    console.error('输入必须是数字或数字字符串');
    return input;
  }
  // 如果输入是数字，则将其转换为字符串
  let str = typeof input === 'number' ? input.toString() : input;
  // 去除小数点后多余的零
  if (str.includes('.')) {
    str = str.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '');
  }
  return str;
};

export const showDatetime = (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(_.toNumber(timestamp)).format(format);
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

export const isUndef = v =>
  v === null || v === undefined || v === '' || Number.isNaN(v);

export const isValidNumber = v => {
  if (isUndef(v)) return false;
  return !isNaN(Number(v));
};

/**
 * 移除对象中所有值为 `undefined` 的属性。
 * @param {Object} obj - 要处理的对象。
 * @return {Object} - 返回一个新的对象，移除了值为 `undefined` 的属性。
 * @example
 * const obj = { a: 1, b: undefined, c: 3 };
 * const result = removeUndefinedProperties(obj);
 * console.log(result); // { a: 1, c: 3 }
 */
export const removeUndefinedProperties = obj => {
  return _.omitBy(obj, _.isUndefined);
};

/**
 * 判断目标是否为字符串或数字。
 * @param {*} target - 要检查的目标。
 * @return {boolean} - 如果目标是字符串或数字，则返回 `true`，否则返回 `false`。
 *
 * @example
 * console.log(isStringOrNumber('hello')); // true
 * console.log(isStringOrNumber(123)); // true
 * console.log(isStringOrNumber(false)); // false
 */
export const isStringOrNumber = target => {
  return ['string', 'number'].includes(typeof target);
};

/**
 * 将字符串的首字母大写，其余字母小写。
 *
 * @param {string} str - 要处理的字符串。
 * @return {string} - 返回首字母大写、其余字母小写的字符串。
 *
 * @example
 * console.log(capitalizeFirstLetter('SHORT')); // 'Short'
 * console.log(capitalizeFirstLetter('cross')); // 'Cross'
 */
export const capitalizeFirstLetter = str => {
  if (!str) return str; // 如果传入的字符串为空，则直接返回
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * 创建一个超时保护函数
 * @param {Promise} promise - 需要保护的Promise
 * @param {number} timeout - 超时时间（毫秒）
 * @return {Promise} - 一个新的Promise，它将在超时或原始Promise完成时解决
 */
export const timeoutPromise = (promise, timeout = 1000) => {
  // 创建一个超时的 Promise
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeout} ms`));
    }, timeout);
  });

  // 使用 Promise.race 来竞争原始 Promise 和超时 Promise
  return Promise.race([promise, timeoutPromise]);
};

export const makeListAppendNo = list =>
  list?.map((i, idx) => ({...i, no: idx + 1}));

/**
 * 获取小数位数，只适用于科学计数法以及纯0小数位数(例如: 0.01 0.001)
 *  */
export const getDigit = (v, isMultipler) => {
  try {
    // 合约乘数，整数情况
    if (isMultipler && new Decimal(v).toExponential().match(/e[+](\d+)/)) {
      return 0;
    }
    v = new Decimal(v).toExponential().match(/e[+-](\d+)/);
    if (!v || !v[1] || v > 10) {
      return undefined;
    }
    const digit = Number(v[1]);
    return digit;
  } catch (err) {
    return undefined;
  }
};
export const isIOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

/** 判断数字是否为 undefined NaN null 0 */
export const isUnfOrZero = val => isUndef(val) || +val === 0;

/** 获取网站 '?' 前 url */
export const getPathname = urlString => urlString?.split?.('?')?.[0];

export const formatNumberShow = (value, decimal = 2) => {
  // 计算绝对值并转换单位
  var absValue = Math.abs(value);
  var formattedValue = '';
  if (absValue >= 1e9) {
    formattedValue = numberFixed(absValue / 1e9, decimal) + 'B'; // 亿
  } else if (absValue >= 1e6) {
    formattedValue = numberFixed(absValue / 1e6, decimal) + 'M'; // 百万
  } else if (absValue >= 1e3) {
    formattedValue = numberFixed(absValue / 1e3, decimal) + 'K'; // 千
  } else {
    // 如果小于1000且为整数，则不显示小数
    if (absValue < 1e3 && absValue === parseInt(absValue, 10)) {
      formattedValue = absValue; // 直接使用整数
    } else {
      formattedValue = numberFixed(absValue, decimal);
    }
  }

  // 如果原始值是负数，添加负号
  if (value < 0) {
    formattedValue = '-' + formattedValue;
  }

  return formattedValue;
};

export const safeArray = data => {
  // 检查输入是否为null或者不是数组类型
  if (!data || !Array.isArray(data)) {
    // 返回空数组
    return [];
  }

  return data;
};

/**
 * 将一个数组按指定大小分组，并用 null 填充每一组不足的部分。
 *
 * @param {Array} array - 要分组的数组。
 * @param {number} chunkSize - 每个分组的大小。
 * @returns {Array<Array<*>>} 一个由分组数组组成的数组，每个分组的长度为 chunkSize。不足部分用 null 填充。
 */
export const makeGroupArrayByFillNull = (array, chunkSize) => {
  if (!chunkSize || !array || !Array.isArray(array)) return array;

  let result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    // 取当前索引开始的chunkSize个元素，如果不足chunkSize个，则取剩余所有元素
    let chunk = array.slice(i, i + chunkSize);
    // 如果chunk的长度小于chunkSize，用null填充到chunkSize长度
    while (chunk.length < chunkSize) {
      chunk.push(null);
    }
    result.push(chunk);
  }
  return result;
};

/**
 * 计算一个浮点数的小数位数。
 *
 * @function countDecimalPlaces
 * @param {number} num - 需要计算小数位数的浮点数。
 * @returns {number} 小数位数，如果没有小数部分则返回0。
 * @example
 * const Decimal = require('decimal.js');
 * let num = new Decimal(123.456);
 * console.log(countDecimalPlaces(num)); // 输出: 3
 */
export const countDecimalPlaces = num => {
  let decimal = new Decimal(`${num}`);
  let stringNum = decimal.toString();
  return stringNum?.split('.')[1].length || 0;
};

export const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 基于对象全量内容去重的JSON序列化方法
 * @template T - 数组元素类型（需为可序列化的对象）
 * @param {T[]} list - 待去重的对象数组
 * @returns {T[]} 去重后的新数组（保留首次出现的元素）
 * @example
 * const data = [{a:1}, {a:1}, {a:2}];
 * deduplicateByContent(data); // 返回 [{a:1}, {a:2}]
 *
 * @notes
 * 1. 依赖JSON序列化，属性顺序不同会被视为不同对象
 * 2. 无法处理包含不可序列化属性的对象（如函数、undefined等）
 * 3. 大数组性能较低，建议数据量小于1万时使用
 */
export const deduplicateByContent = list => {
  try {
    const seen = new Set();
    return list.filter(item => {
      const str = JSON.stringify(item);
      return seen.has(str) ? false : seen.add(str);
    });
  } catch (e) {
    return list;
  }
};
