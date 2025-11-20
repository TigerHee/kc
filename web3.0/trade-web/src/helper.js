/**
 * Owner: borden@kupotech.com
 */
/**
 * helper
 * runtime: next/browser
 */
import _ from 'lodash';
import moment from 'moment';
import Decimal from 'decimal.js/decimal';
import FormData from 'form-data';
import { maxDecimalsPrecision } from 'config';
import MD5 from 'crypto-js/md5';
import EventEmitter from 'event-emitter';
import { isRTLLanguage } from 'utils/langTools';
import { intlFormatDate } from '@/hooks/common/useIntlFormat';
import { lessThan } from './utils/operation';
import { equals } from 'lodash/fp';
import { isRTL } from '@/hooks/common/useLang';
import { getStore } from './utils/createApp';

// export const Raven = _Raven;

export const captureException = (ev) => {
  return new Promise((resolve) => {
    resolve();
  });
};

/**
 * 高精度计算库
 */
export { Decimal };

export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null) {
    a = new Decimal(0);
  }
  if (!Decimal.isDecimal(a)) {
    const isNaNB = _.isNaN(_.toNumber(a));
    a = new Decimal(isNaNB ? NaN : a);
  }

  return a;
}

/**
 * 高精度加法
 * @param a {number|string|Decimal}
 * @param b {number|string|Decimal}
 * @returns {Decimal}
 */
export const add = (a, b) => {
  return new Decimal(a).add(b);
};

/**
 * 高精度加法，并转换成字符串显示（默认超出精度截断）
 * @param a {number|string|Decimal}
 * @param b {number|string|Decimal}
 * @returns {string}
 */
export const addAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  return add(a, b).toFixed(decimal, round);
};

/**
 * 高精度除法
 * @param a
 * @param b
 * @returns {Decimal}
 */
export const divide = (a, b) => {
  return new Decimal(a).div(b);
};

/**
 * 高精度除法，并转换成字符串显示（默认超出精度截断）
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divideAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  return divide(a, b).toFixed(decimal, round);
};

/**
 *  舍弃小数位0
 *  @param str
 */
export const dropZero = (str) => {
  if (!str) return '-';
  if (isNaN(Number(str))) return str;
  const e = new Decimal(str);
  return e.toFixed();
};

/**
 *  舍弃小数位0
 *  @param str
 */
export const dropZeroSafe = (str) => {
  try {
    if (Number.isNaN(Number(str))) return str;
    return dropZero(str);
  } catch (err) {
    return str;
  }
};

/**
 *  补全小数位0
 *  @param v
 *  @param decimal 小数位精度
 */
export const fixWithZero = (v, decimal) => {
  const bit = `0.${Array({ length: decimal * 2 }).join('0')}1`;
  const valueWithBit = _.toNumber(v) + _.toNumber(bit);
  return numberFixed(valueWithBit, decimal);
};

/**
 *  格式化数据（截断超出精度位数，舍弃小数位0）
 *  @param num
 *  @param decimal
 */
export const normalizeNumber = (...rest) => {
  return dropZero(numberFixed(...rest));
};
/**
 *  数据展示（小于精度的，展示<xxxx）
 */
export const displayNumber = (num, decimal) => {
  if (!/(^[1-9]\d*$)/.test(decimal)) return num;
  const minValue = new Decimal(10).pow(-decimal).toFixed();
  if (num < minValue) return `< ${minValue}`;
  return normalizeNumber(num, decimal);
};
/**
 *  格式化数据（截断超出精度位数，舍弃小数位0，增加千位分隔符）
 *  @param num
 *  @param decimal
 */
export const formatNumber = (num, decimal) => {
  return separateNumber(normalizeNumber(num, decimal));
};
// 根据步长格式化数据, 默认向下取整
export const formatNumberByStep = (num, step = 1, round = 'DOWN') => {
  if (typeof +num !== 'number' || isNaN(+num) || step <= 0) {
    return num;
  }
  const remainder = Decimal.mod(num, step);
  const isDivisible = !remainder.toNumber();
  if (isDivisible) return Decimal(num).toFixed();
  if (round === 'DOWN') {
    return sub(num, remainder).toFixed();
  }
  return sub(add(num, step), remainder).toFixed();
};
/**
 * 高精度乘法
 * @param a
 * @param b
 * @returns {Decimal}
 */
export const multiply = (a, b) => {
  return new Decimal(a).mul(b);
};

/**
 * 高精度乘法，并转换成字符串显示（默认超出精度截断）
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiplyAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  return multiply(a, b).toFixed(decimal, round);
};

/**
 * 高精度指定位数（默认超出精度截断）
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

/**
 * 精简大位数，并增加千分位分隔符 (超出百万的数字，小数位只显示2位)
 * @param value
 * @returns {*}
 */
export const readableNumber = (value) => {
  const million = 1000000;
  const number = parseFloat(value);

  if (isNaN(number)) {
    return value;
  }
  if (number < million) {
    return separateNumber(value);
  }

  return separateNumber(numberFixed(number, 2));
};

const SeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k) {
    return !!this.pool[k];
  },
  get(k) {
    return this.pool[k];
  },
  set(k, v) {
    if (this.poolCount > 100000) {
      // 清理缓存
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};

/**
 * 增加千分位分隔符
 * @param n
 * @returns {string}
 */
export const separateNumber = (n) => {
  if (typeof +n !== 'number') {
    return n;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num);
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    integer = arr[0];
    floater = arr[1];
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

/**
 * 高精度减法
 * @param a {number|string|Decimal}
 * @param b {number|string|Decimal}
 * @returns {Decimal}
 */
export const sub = (a, b) => {
  return new Decimal(a).sub(b);
};

/**
 * 高精度减法，并转换成字符串显示（默认超出精度截断）
 * @param a {number|string|Decimal}
 * @param b {number|string|Decimal}
 * @returns {string}
 */
export const subAndFixed = (a, b, decimal = 8, round = Decimal.ROUND_DOWN) => {
  return sub(a, b).toFixed(decimal, round);
};

/**
 * 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
 * @param {*} num
 */
export const transStepToPrecision = (num) => {
  if (num > 1) {
    return 0;
  }
  const decimal = `${num}`.split('.')[1];
  return decimal ? decimal.length : 0;
};

export const reportCoinLost = (coin) => {
  console.log('coin lost', coin);
};

export const createDecimals = (decimalPrecision) => {
  const decimals = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: Math.pow(10, maxDecimalsPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }
  return decimals;
};

// 从步长获取精度
// todo 跟transStepToPrecision功能重复，又略微不同，需要用哪个？
export const getPrecisionFromIncrement = (increment) => {
  // if (!increment) return maxPrecision;
  if (typeof increment === 'number') {
    increment = increment.toString();
  }
  const decimalsArr = (increment || '').split('.');
  if (decimalsArr.length > 1) {
    return decimalsArr[1].length;
  }
  return 0;
};

/**
 * 从URL获取文件类型
 * @param timestamp
 * @param format
 * @returns {string}
 */
export const getFileType = (url = '') => {
  const tmp = (url || '').split('?').shift().split('/').pop();
  const fileType = tmp.substring(tmp.lastIndexOf('.'), tmp.length);
  return (fileType || '').toLowerCase();
};

// 常见文档类型
export const DOC_FILE_TYPE = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // 兼容file.type 为空的情况
  'doc',
  'docx',
  'pdf',
  'xls',
  'xlsx',
];
// 数字时区 -> IANA时区标识符
const timeZoneMap = new Array(25)
  .fill()
  .map((__, index) => index - 12)
  .reduce((a, b) => {
    const sign = b <= 0 ? '+' : '';
    a[`${b}`] = `Etc/GMT${sign}${-b}`; // 9: 'Etc/GTM-9', -9: 'Etc/GTM+9'
    return a;
  }, {});

export const moment2Intl = ({ date, format, timeZone }) => {
  const options = [
    ['year', 'YY'],
    ['month', 'MM'],
    ['day', 'DD'],
    ['hour', 'HH'],
    ['minute', 'mm'],
    ['second', 'ss'],
  ].reduce((a, b) => {
    if (!_.includes(format, b[1][0])) {
      a[b[0]] = undefined;
    } else if (_.split(format, b[1]).length - 1 === 1) {
      a[b[0]] = '2-digit';
    } else {
      a[b[0]] = 'numeric';
    }
    return a;
  }, {});
  if (timeZoneMap[timeZone]) {
    options.timeZone = timeZoneMap[timeZone];
  }
  return intlFormatDate({
    date,
    options,
  });
};
/**
 * 时间戳格式化
 * 按本地时区格式化
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export const showDatetime = (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment2Intl({ date: moment(_.toNumber(timestamp)), format });
};

/**
 * 按固定时区格式化
 * @param {*} ts
 * @param {*} zone
 */
export const showDateTimeByZone = (ts, format = 'YYYY/MM/DD HH:mm:ss', zone = 8) => {
  return moment2Intl({
    format,
    timeZone: zone,
    date: moment(ts).utcOffset(zone),
  });
};

/**
 * 将某时区的时间转化成用户本地时间
 * @param {*} ts
 * @param {*} zone
 * @param {*} format
 */
export const zoneTime2LocalTime = (ts, format = 'YYYY/MM/DD HH:mm:ss', zone = 8) => {
  return moment2Intl({
    format,
    date: moment(ts).utcOffset(zone),
  });
};

/**
 * 获取时间戳的日期部分
 * @param {*} timestamp
 * @returns ms
 */
export const toDateTs = (timestamp) => {
  const date = moment(timestamp).format('YYYY-MM-DD');
  return moment(date).valueOf();
};

/**
 * 字符串转时间戳
 * @param timestamp
 * @param format
 * @returns {string}
 */
export const timestamp = (date) => {
  if (moment(date).isValid()) {
    return moment(date).valueOf();
  }
  return null;
};

/**
 * 对象转表单数据
 * @param obj
 * @returns {*}
 */
export const formlize = (obj) => {
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

/**
 * 键值对转为值数组
 * @param map
 */
export const mapToArray = (map) => {
  return _.map(map, (value) => value);
};

/**
 * 根据路径检查是否需要检测用户是否登录
 * @param pathname
 * @returns {*}
 */
export const getPathAuth = (pathname) => {
  if (typeof pathname !== 'string') {
    throw new TypeError('Expected argument 1 to be a string.');
  }
  if (pathname.indexOf('/user/') > -1 || pathname.indexOf('/unbind-g2fa/') > -1) {
    return 'LOGIN';
  }
  return null;
};
// app/login 后不进行两步验证就按照login之前的href进行跳转
export const ignoreG2faToLoginHref = {
  '/unbind-g2fa/kyc': true,
};

// runtime: browser
export const getScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

export const genWalletTxUrl = (coinType, txUrl = '', txId) => {
  if (!txId || !txUrl) return null;
  if (['NEO', 'GAS', 'NEP'].indexOf(coinType) !== -1) {
    if (txId.indexOf('0x') === 0) {
      txId = txId.substr(2);
    }
  }
  return (txUrl || '').replace('{txId}', txId);
};

/**
 * @description 高精度乘法并取给定位数向下取整
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiplyFloor = (a, b, decimal = 8, round = Decimal.ROUND_FLOOR) => {
  return new Decimal(a).mul(b).toFixed(decimal, round);
};

/**
 * 获取时区
 * @returns {*}
 */
export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.log(e);
  }
};

/**
 * 将秒转化为 日、时、分、秒 四个部分
 * @param totalSeconds
 * @returns {[number,number,number,number]}
 */
export const getTimeData = (totalSeconds) => {
  const data = [0, 0, 0, 0];
  if (!totalSeconds) {
    return data;
  }

  data[0] = Math.floor(totalSeconds / (60 * 60 * 24)); // 天
  totalSeconds %= 60 * 60 * 24;
  data[1] = Math.floor(totalSeconds / 3600); // 时
  totalSeconds %= 3600;
  data[2] = Math.floor(totalSeconds / 60); // 分
  data[3] = totalSeconds % 60; // 秒

  data[1] = _.padStart(data[1], 2, '0');
  data[2] = _.padStart(data[2], 2, '0');
  data[3] = _.padStart(data[3], 2, '0');

  return data;
};

/**
 * Array sort 保持顺序
 * @param arr
 * @param sorter
 * @returns {*}
 */
export const orderSort = (arr, sorter) => {
  if (arr && arr.length && sorter) {
    const mp = new Map();
    arr.forEach((item, index) => {
      mp.set(item, index);
    });

    return arr.sort((a, b) => {
      const sort = sorter(a, b);
      if (sort === 0) {
        return mp.get(a) - mp.get(b);
      } else {
        return sort;
      }
    });
  } else {
    return arr;
  }
};

/**
 * 获取浏览器语言
 *
 * @returns {String|null}
 * runtime: browser
 */
export const getFirstBrowserLanguage = () => {
  const nav = window.navigator;
  const browserLanguagePropertyKeys = [
    'language',
    'browserLanguage',
    'systemLanguage',
    'userLanguage',
  ];
  let i;
  let language;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }

  return null;
};

/**
 * 获取浏览器地址、参数、hash信息组合的URL
 * runtime: browser
 */
export const getURL = () => {
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
};

/**
 * 随机取数组元素
 */
export const getRandomItem = (arr) => {
  if (!_.isArray(arr) || !arr.length) {
    return null;
  }

  return arr[_.random(0, arr.length - 1)];
};

/**
 * 是否在微信浏览器打开
 *
 * @returns {boolean}
 */
export const isOpenInWechat = (pUA) => {
  const ua = pUA || navigator.userAgent.toLowerCase();
  const match = ua.match(/MicroMessenger/i);

  return match && match[0] === 'micromessenger';
};

/**
 * 移动数组元素，取遇到的第一个值相等的元素移动到头部或尾部
 * @param arr 数组
 * @param value 值
 * @param toFront 默认加到后面
 * @returns {*}
 */
export const mvArrayValue = (arr, value, toFront) => {
  const tmpArr = _.cloneDeep(arr);
  for (let i = 0; i < tmpArr.length; i++) {
    if (tmpArr[i] === value) {
      tmpArr.splice(i, 1);
      break;
    }
  }
  if (toFront) {
    tmpArr.unshift(value);
  } else {
    tmpArr.push(value);
  }
  return tmpArr;
};

/**
 * 返回数组的分页数据
 * @param pageNo    当前页
 * @param pageSize  每页大小
 * @param array     原始数组
 * @returns {Blob|ArrayBuffer|Array.<T>|string|*}
 */
export const getArrayPage = (pageNo, pageSize, array) => {
  const offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
};

/**
 * 滚动到锚点
 * @param anchorName
 * runtime: browser
 */
export const scrollToAnchor = (anchorName) => {
  if (anchorName) {
    const anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      anchorElement.scrollIntoView();
    }
  }
};

/**
 * meta 处理
 * @param isMobile
 * runtime: browser
 */
export const viewPortMeta = (isMobile) => {
  let metaBase = ['width=device-width', 'initial-scale=1'];
  const metaNoScale = ['maximum-scale=1', 'minimum-scale=1', 'user-scalable=no'];
  if (isMobile) {
    metaBase = metaBase.concat(metaNoScale);
  }
  const head = document.getElementsByTagName('head')[0];
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = metaBase.join(',');
  head.appendChild(meta);
};

/**
 * 字符串全部转同一个字符
 * @param str
 * @param pad
 * @returns {string}
 */
export const padString = (str, pad = '*') => {
  if (!str) {
    return '';
  }
  return `${str}`.replace(/./g, pad);
};

/**
 * 容器滚动不影响全局滚动
 * @param {*} Dom 容器target
 * @param {*} ReactEvent
 */
export const blockScroll = (target, event) => {
  // 一些数据
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const height = target.clientHeight;

  const delta = event.nativeEvent.wheelDelta
    ? event.nativeEvent.wheelDelta
    : -(event.nativeEvent.detail || 0);

  if (
    (delta > 0 && scrollTop <= delta) ||
    (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)
  ) {
    // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
    target.scrollTop = delta > 0 ? 0 : scrollHeight;
    // 向上滚 || 向下滚
    event.preventDefault();
  }
};

/**
 *
 * @description 获取queryString字符串转换为JSON对象
 * @param {String} search 可选参数 无是自动获取浏览器后面的queryString
 * @returns {Object}
 * runtime: next/browser
 */
export function searchToJson(search) {
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      for (const key in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return temp;
}

/**
 * 替换urld的query参数
 * @param {*} url
 * @param {*} key
 * @param {*} value
 */
export const replaceSearch = (url, key, value) => {
  const regex2 = new RegExp(`^([^#]+[?&])${key}=[^&]*(.*)$`);
  return url.replace(regex2, `$1${key}=${encodeURIComponent(value)}$2`);
};

export const Event = {};

Event.addHandler = window.addEventListener
  ? (target, type, handler, capture) => {
      target.addEventListener(type, handler, capture || false);
    }
  : (target, type, handler, capture) => {
      target.attachEvent(`on${type}`, handler);
    };

Event.removeHandler = window.removeEventListener
  ? (target, type, handler, capture) => {
      target.removeEventListener(type, handler, capture || false);
    }
  : (target, type, handler, capture) => {
      target.detachEvent(`on${type}`, handler);
    };

Event.triggerEvent = (target, type) => {
  if (document.createEvent) {
    const eventMp = {
      HTMLEvents: [
        'abort',
        'blur',
        'change',
        'error',
        'focus',
        'load',
        'reset',
        'resize',
        'scroll',
        'select',
        'submit',
        'unload',
      ],
      UIEvents: ['DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup'],
      MouseEvents: ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'],
      MutationEvents: [
        'DOMAttrModified',
        'DOMNodeInserted',
        'DOMNodeRemoved',
        'DOMCharacterDataModified',
        'DOMNodeInsertedIntoDocument',
        'DOMNodeRemovedFromDocument',
        'DOMSubtreeModified',
      ],
    };
    let eventKey = null;
    _.map(eventMp, (types, key) => {
      if (_.indexOf(types, type) > -1) {
        eventKey = key;
        return false;
      }
    });

    if (!eventKey) {
      throw new TypeError('Unknown EventType.');
    }

    const event = document.createEvent(eventKey);
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  } else if (document.createEventObject) {
    target.fireEvent(`on${type}`);
  }
};
/**
 * 事件集合，可以创建、获取、删除指定的事件(只需要一个事件处理器, 建议不传参数，这样可以保持单例模式)
 */
const evts = {};

const getEvt = (evtId = 'event') => {
  if (!evts[evtId]) {
    evts[evtId] = new EventEmitter();
  }
  return evts[evtId];
};

const removeEvt = (id) => {
  delete evts[id];
};

/**
 *
 * @type {{getEvt: (function(*): *), removeEvt: removeEvt}}
 */
export const evtEmitter = {
  getEvt,
  removeEvt,
};

/**
 * 递归加密
 * @param str
 * @param time
 * @returns {*}
 */
function loopCrypto(str, time) {
  const salt = '_kucoin_';
  const c = MD5(`${salt}${str}${salt}`).toString();
  if (time <= 0) {
    return c;
  } else {
    return loopCrypto(c, time - 1);
  }
}

/**
 * @param {*} 加密
 */
export const cryptoPwd = (str) => {
  // const salt = '_kucoin_';
  return loopCrypto(str, 2);
  // return MD5(`${salt}${MD5(`${salt}${str}${salt}`).toString()}${salt}`).toString();
};

/**
 * 时间戳转UTC+8时间
 * @param timestamp
 * @param format
 * @returns {string}
 */

export const toUTC8 = (_timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(_timestamp).utcOffset(8).format(format);
};
/**
 * 倒计时格式化
 * @param millisecond
 * @return { string }
 */
export const formatCountdown = (millisecond, format = 'HH:mm:ss') => {
  millisecond = Number(millisecond);
  const offset = moment.duration(millisecond);
  const hour = offset.hours();
  const minute = offset.minutes();
  const second = offset.seconds();
  const diff = moment({ hour, minute, second });
  return diff.format(format);
};

/**
 * 从File对象拿到base64编码
 */
export const getBase64 = (img) => {
  const promise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(img);
  });
  return promise;
};

/**
 * 处理路径连接
 */
export const concatPath = (base = '', path = '') => {
  const hasSlashes = path.indexOf('/') === 0;
  if (base && base.endsWith('/')) {
    return `${base}${hasSlashes ? path.substring(1) : path}`;
  }
  return `${base}${hasSlashes ? '' : '/'}${path}`;
};

/**
 * 睡眠一段时间
 * @param {*} delay
 */
export const sleep = (delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

/**
 * 转换成百分比
 * @param {*} num
 */
export const floadToPercent = (num, flag = '%', pre = undefined) => {
  // console.log('floadToPercent', num);
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  let dir = '';
  if (num < 0) {
    dir = '-';
    num = -num;
  }
  if (isRTLLanguage()) {
    return `${dir}${flag}${new Decimal(+num).mul(100).toFixed(pre)}`;
  }
  return `${dir}${new Decimal(+num).mul(100).toFixed(pre)}${flag}`;
};

// 全屏
export const launchFullScreen = (e) => {
  const api =
    e.requestFullscreen ||
    e.webkitRequestFullscreen ||
    e.mozRequestFullScreen ||
    e.msRequestFullscreen;
  api.call(e);
};

export const exitFullscreen = () => {
  const api =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;
  api.call(document);
};

// 去除左右空格
export const removeSpaceSE = (str) => {
  return (str || '').replace(/(^\s*)|(\s*$)/g, '');
};

// zendesk 登录处理
export const getJWTPath = (platform, jwt, returnTo) => {
  if (platform === 'zendesk') {
    let zendesk = `https://support.kucoin.plus/access/jwt?jwt=${jwt}`;
    if (returnTo) {
      zendesk = `${zendesk}&return_to=${returnTo}`;
    }
    return zendesk;
  }

  return null;
};
/**
 * 去除分隔符
 * eg. KCS/BTC | KCS-BTC | KCS BTC ==> KCSBTC
 */
export const removeSeparator = (str) => {
  if (!str) {
    return str;
  }
  return str.replace(/\W/g, '');
};
/**
 * 获得页面 URL 地址，埋点使用
 */
export const getFullURL = () => {
  // const { origin, pathname } = window.location;
  return window.location.href;
};

/** 加载图片完执行callback */
export const loadImg = (imgNeed, cb, i = 0) => {
  const img = new Image();
  img.src = imgNeed[i];
  img.onload = () => {
    i += 1;
    if (i < imgNeed.length - 1) {
      loadImg(imgNeed, cb, i);
    } else if (cb) {
      cb();
    }
  };
};

/**
 * 获取时间戳的一定长度值，主要用于缓存使用
 *
 * @param   {[type]}  len  [len description]
 *
 * @return  {[type]}       [return description]
 */
export const getTimeStampOnHour = (len) => {
  return Date.now().toString().slice(0, len);
};

export const getCmsCdnHost = () => {
  // // 如果存在服务端渲染，那么直接走线上
  // try {
  //   if (!window) {
  //     return 'https://assets.staticimg.com/cms-static';
  //   }
  //   const { origin } = window.location;
  //   const isDevOrQA =
  //     origin.indexOf('net') > -1 || origin.indexOf('localhost') > -1;
  //   // 开发或qa 走测试环境
  //   if (isDevOrQA) {
  //     return 'https://assets-v2.kucoin.net/cms-static';
  //   }
  //   return 'https://assets.staticimg.com/cms-static';
  // } catch (e) {
  //   return 'https://assets.staticimg.com/cms-static';
  // }
  return 'https://assets.staticimg.com/cms-static';
};

/**
 * 根据lang从fieldOb取值
 * 例如 fieldObj { "zh_CN": "系统正在维护,请耐心等待","en_US": "System is maintenancing" }
 * lang zh_CN
 * @param {*} fieldObj
 * @param {*} lang
 */
const getFieldValueByLang = (fieldObj = {}, lang = 'zh_CN') => {
  const supportLang = ['zh_CN', 'en_US'];
  const defaultLang = 'en_US';
  const finalLang = _.includes(supportLang, lang) ? lang : defaultLang;
  return _.get(fieldObj, finalLang);
};
// 转换停机通知静态json相关字段，与getMaintenanceStatus的返回数据结构保持一致
export function convertMaintenanceJSON(jsonData = {}, currentLang) {
  const { titleList, linkUrlList, linkTextList, ...others } = jsonData || {};
  if (!titleList) return {};
  return {
    ...others,
    title: getFieldValueByLang(titleList, currentLang),
    link: getFieldValueByLang(linkUrlList, currentLang),
    redirectContent: getFieldValueByLang(linkTextList, currentLang),
  };
}

const MAX_OVER_TIME = 20 * 1000; // 误差在 20s 内 使用serverTime， 否则使用本地时间

// 传入serverTime ，比较决定使用哪个作为当前时间
export const getCurrentTime = ({ serverTime = -1, requestedLocalTime = -1 } = {}) => {
  const dateNow = moment().valueOf();
  if (serverTime <= 0 || requestedLocalTime <= 0) return dateNow;
  const duration = dateNow - requestedLocalTime;
  serverTime += duration;

  // serverTime 与dateNow差距不大，使用dateNow
  if (Math.abs(serverTime - dateNow) < MAX_OVER_TIME) {
    return dateNow;
  }
  // serverTime 与dateNow差距过大，使用serverTime
  return serverTime;
};

export function isOutOfTimeRange(time, rangeList = []) {
  if (time < 1) return true;
  const [start, end] = rangeList || [];
  if (!start || !end) return true;
  return time < start || time > end;
}

// 处理数字过大的展示
export const numberResolve = (num, pre = 8) => {
  let _pre = pre;
  let _m = 1;
  let unit = '';
  // T
  if (num >= 1e12) {
    _pre = 2;
    _m = 1e-12;
    unit = 'T';
    // B
  } else if (num >= 1e9) {
    _pre = 2;
    _m = 1e-9;
    unit = 'B';
    // M
  } else if (num >= 1e6) {
    _pre = 2;
    _m = 1e-6;
    unit = 'M';
    // K
  } else if (num > 1e5 && num < 1e6) {
    _pre = 1;
    _m = 1e-3;
    unit = 'K';
  }
  return `${numberFixed(num * _m, _pre)}${unit}`;
};

/**
 * 根据lang转换数字后名词展示规则（单复数形式）
 * 阿拉伯语是3种；波兰语和俄语是3种；中、日、韩、越、泰、印尼是1种；其余是2种。
 * 规则：
 *   1、阿拉伯语
 *     firstType = 0, 1 and above
 *     secondType = 2
 *     thirdType = 3, 4, 5, 6, 7, 8 ,9, 10
 *   2、俄语，波兰语
 *     firstType = 1
 *     secondType = 结尾是2, 3, 4的数字
 *     thirdType = 结尾是5, 6, 7, 8, 9, 0的数字
 * 对应国际化eg: {pluralType, plural, =firstType {{num} Minute} other {{num} Minutes}}
 *
 * pluralType 是对应plural类型参数 值有以下几种
 *   firstType | secondType | thirdType | fourthType | other
 * num 是对应数字参数, 必须是正整数
 * plural 固定值
 * @param {*} lang
 * @param {*} num
 */
const thirdTypeArr = ['ru_RU', 'pl_PL'];
const oneTypeArr = ['zh_CN', 'zh_HK', 'ja_JP', 'ko_KR', 'vi_VN', 'th_TH', 'id_ID'];
export const transferNumDisplayByLang = (lang, num) => {
  const number = +num;
  if (_.isNaN(number) || number < 0 || number !== Math.ceil(number)) return;

  let type;
  if (lang === 'ar_AE') {
    // 阿拉伯语
    if (number === 2) {
      type = 'secondType';
    } else if (number >= 3 && number <= 10) {
      type = 'thirdType';
    } else {
      type = 'firstType';
    }
  } else if (_.includes(thirdTypeArr, lang)) {
    // 俄语，波兰语
    if (number === 1) {
      type = 'firstType';
    } else if (_.indexOf([2, 3, 4], number % 10) > -1) {
      type = 'secondType';
    } else if (_.indexOf([5, 6, 7, 8, 9, 0], number % 10) > -1) {
      type = 'thirdType';
    }
  } else if (_.includes(oneTypeArr, lang)) {
    // 只有一种单复数形式
    type = 'other';
  } else if (number < 2) {
    // 两种单复数形式中的单数
    type = 'firstType';
  } else {
    // 两种单复数形式中的复数
    type = 'other';
  }
  return type;
};

export const isUndef = (v) => ['', null, undefined, NaN].includes(v);

/**
 * 格式化币种精度，多余0会被移除,最低显示2位小数
 * @param {*} num
 * @param {*} pre 精度
 * @param {*} fixZero 是否默认补0
 * @returns
 */
export const setNumToPrecision = (num, pre, { fixZero = true, fixLength = 2 } = {}) => {
  if (isUndef(num)) return num;
  try {
    // 如果toFixed后值相等，如 0.01 fixed 8位后 0.01000000 则返回 0.01(不显示多余0)
    // 有精度传入，使用向下取整
    const mode = pre !== undefined ? Decimal.ROUND_FLOOR : undefined;
    let fixedResult = Decimal(num || 0).toFixed(pre, mode);
    const noZeroResult = Decimal(fixedResult).toFixed();
    const isEqual = Decimal(fixedResult).eq(noZeroResult);

    if (Decimal(num || 0).eq(fixedResult) || isEqual) {
      fixedResult = noZeroResult;
    }
    if (fixZero) {
      const precision = getPrecisionFromIncrement(fixedResult);
      if (precision < fixLength) {
        fixedResult = Decimal(fixedResult).toFixed(fixLength);
      }
    }
    return fixedResult;
  } catch (e) {
    console.error(e);
  }
  return num;
};

/**
 * 科学计数法转数字字符串
 */
export const toNonExponential = (a) => {
  let value = a;
  if (Decimal.isDecimal(a)) {
    value = a.toString();
  }
  const isExponential = /\d(?:.(\d*))?e([+-]\d+)/.test(value);
  if (!isExponential) return value;
  const _a = transformParam(value);
  return _a.toFixed();
};

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

/**
 * 小数转化为百分数
 */
export const toPercent = (
  point,
  precision = 2,
  dropZ = false,
  round = Decimal.ROUND_HALF_UP,
  isShowPlusDir = false,
  notRtl = false,
) => {
  if (!point) {
    point = 0;
  }
  let dir = '';
  if (lessThan(point)(0)) {
    dir = '-';
  } else if (isShowPlusDir) {
    if (equals(point)(0)) {
      dir = '';
    } else {
      dir = '+';
    }
  }
  const val = new Decimal(point).mul(100).abs();
  let percent = val.toDP(precision, round).toFixed();
  if (dropZ) {
    percent = dropZero(percent);
  }

  if (notRtl) {
    return `${dir}${percent}%`;
  }
  const isRtl = isRTL();
  if (isRtl) {
    return `${dir}%${percent}`;
  }
  return `${dir}${percent}%`;
};

/** 根据步长，向下靠近步长
 * @param {number} value 原始值
 * @param {number} step 步长
 * @return 向下靠近步长的Decimal
 */

export const roundDownByStep = (value, step) => {
  return new Decimal(step).mul(new Decimal(value).dividedBy(step).toFixed(0, Decimal.ROUND_DOWN));
};

/**
 * 根据步长，向s上靠近步长
 * @param {number} value 原始值
 * @param {number} step 步长
 * @return 向上靠近步长的值
 */

export const roundUpByStep = (value, step) => {
  return new Decimal(step).mul(new Decimal(value).dividedBy(step).toFixed(0, Decimal.ROUND_UP));
};

/**
 * @description 格式化时间
 * @param timestamp
 * @param format
 * @param isNs
 */
export const formatDateTime = (time, format = 'YYYY/MM/DD HH:mm:ss', isNs = false) => {
  if (isNs) {
    time = Decimal(time).mul(1e-6).toFixed(0);
  }
  return moment(_.toNumber(time)).format(format);
};

/**
 * 生成唯一id
 */
export function guid(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    // eslint-disable-next-line
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export const getColors = (color) => props => props.theme.colors[color];
/**
 * @param {string} array 交易对对象数组
 * @param {string} symbolCode
 * @return 返回过滤后的数组和检查结果
 */
export const filterAndCheckSymbolArray = (array, symbolCode) => {
  // 过滤数组，保留enableTrading或者isAuctionEnabled为true,的对象
  const filteredArray = array.filter(
    (item) => item.enableTrading === true || item.isAuctionEnabled === true,
  );
  // 检查过滤后的数组中是否存在给定的symbolCode
  const symbolExists = filteredArray.some((item) => item.symbolCode === symbolCode);

  // 返回过滤后的数组和检查结果
  return {
    filteredArray,
    symbolExists,
  };
};

export const getState = (fn) => fn(getStore().getState());
