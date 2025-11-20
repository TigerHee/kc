/**
 * Owner: willen@kupotech.com
 */
/**
 * helper
 * runtime: next/browser
 *
 * helper 模块在 performance 分析中性能表现差，将复用的函数移到 utils 下面做按需加载，非复用的函数定义到对应使用的模块中
 */
import { maxPrecision } from 'config/base';
import Decimal from 'decimal.js';
import _ from 'lodash';
import moment from 'moment';

import MD5 from 'crypto-js/md5';

import md5 from 'md5'; // 和上面的MD5不同
import { isRTLLanguage } from 'utils/langTools';
import numberFixed from 'utils/numberFixed';
import separateNumber from 'utils/separateNumber';
import { v4 as uuid } from 'uuid';

export { default as checkBackUrlIsSafe } from 'utils/checkBackUrlIsSafe';
export { default as compareVersion } from 'utils/compareVersion';
export { default as concatPath } from 'utils/concatPath';
export { default as createDecimals } from 'utils/createDecimals';
export { default as dateToChartTimeMinute } from 'utils/dateToChartTimeMinute';
export { default as dropZero } from 'utils/dropZero';
export { default as evtEmitter } from 'utils/evtEmitter';
export { default as formatNumber } from 'utils/formatNumber';
export { default as formlize } from 'utils/formlize';
export { default as getCurrentTime } from 'utils/getCurrentTime';
export { default as isIOS } from 'utils/isIOS';
export { default as isOutOfTimeRange } from 'utils/isOutOfTimeRange';
export { default as judgeChrome } from 'utils/judgeChrome';
export { default as multiply } from 'utils/multiply';
export { default as multiplyFloor } from 'utils/multiplyFloor';
export { default as searchToJson } from 'utils/searchToJson';
export { default as showDatetime } from 'utils/showDatetime';
export { default as toDateTs } from 'utils/toDateTs';
export { separateNumber };
/**
 * 高精度计算库
 */
export { Decimal };
export { numberFixed };

// let _Raven;
// if (_IS_SERVER_) {
//   // _Raven = require('../sentry/node');
// } else {
//   // _Raven = require('../sentry/browser');
// }
// export const Raven = _Raven;
export const captureException = () => {
  return new Promise((resolve) => {
    resolve();
    // if (!(ev && ev._no_sentry)) {
    //   Raven.captureException(ev, (_e, id) => {
    //     console.log('Raven sent', id);
    //     resolve();
    //   });
    // } else {
    //   resolve();
    // }
  });
};

export const reportCoinLost = (coin) => {
  console.log('coin lost', coin);
};

// 从步长获取精度
export const getPrecisionFromIncrement = (increment) => {
  if (!increment) return maxPrecision;
  if (typeof increment === 'number') {
    increment = Decimal(increment).toFixed();
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

/**
 * 按固定时区格式化
 * @param {*} ts
 * @param {*} zone
 */
export const showDateTimeByZone = (ts, format = 'YYYY/MM/DD HH:mm:ss', zone = 8) => {
  return moment(ts).utcOffset(zone).format(format);
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
 * 精简大位数，并增加千分位分隔符
 * @param value
 * @returns {*}
 */
export const readableNumber = (value) => {
  const million = 1000000;
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return value;
  }
  if (number < million) {
    return separateNumber(value);
  }

  return separateNumber(numberFixed(number, 2));
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

export const dropZeroNew = (str) => {
  if (!str) return 0;
  const e = new Decimal(str);
  return e.toFixed();
};

/**
 * @decription 高精度减法
 */
export const sub = (a, b) => {
  return new Decimal(a).sub(b);
};

// 根据步长格式化数据
export const formatNumberByStep = (num, step = 1) => {
  if (typeof +num !== 'number' || Number.isNaN(+num) || step <= 0) {
    return num;
  }
  return sub(num, Decimal.mod(num, step)).toFixed();
};

// 补全小数位0
export const fixWithZero = (v, decimal) => {
  const bit = `0.${Array({ length: decimal * 2 }).join('0')}1`;
  const valueWithBit = _.toNumber(v) + _.toNumber(bit);
  return numberFixed(valueWithBit, decimal);
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
 * @decription 高精度加法
 */
export const add = (a, b) => {
  return new Decimal(a).plus(b);
};

/**
 * @decription 小数转百分比
 */
export const toPercent = (a, sign = '%') => {
  return `${new Decimal(a).mul(100).toFixed()}${sign}`;
};
/**
 * @decription 过长字符串超出指定长度部分显示成省略号
 */
export const formatStr = (str, maxLen) => {
  let result = str;
  try {
    if (str.length > maxLen) {
      result = `${str.substr(0, 6)}...`;
    }
  } catch (e) {
    console.log(e);
  }
  return result;
};

export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null) {
    a = new Decimal(0);
  }
  if (!Decimal.isDecimal(a)) {
    a = _.toNumber(a);
    a = new Decimal(a);
  }
  return a;
}

/**
 * Decimal 取最小值
 * @param  {...any} rest
 */
export const min = (...rest) => {
  const params = rest.map((r) => transformParam(r));
  return Decimal.min(...params);
};

/**
 * 获取时区
 * @returns {*}
 */
// export const getTimezone = () => {
//   try {
//     return Intl.DateTimeFormat().resolvedOptions().timeZone;
//   } catch (e) {
//     console.log(e);
//   }
// };

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
      }
      return sort;
    });
  }

  return arr;
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
  const { scrollTop, scrollHeight } = target;
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

// runtime: browser
Event.addHandler = window.addEventListener
  ? (target, type, handler) => {
      target.addEventListener(type, handler, false);
    }
  : (target, type, handler) => {
      target.attachEvent(`on${type}`, handler);
    };

Event.removeHandler = window.removeEventListener
  ? (target, type, handler) => {
      target.removeEventListener(type, handler, false);
    }
  : (target, type, handler) => {
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

      return true;
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
  }
  return loopCrypto(c, time - 1);
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
// 对比目标时间和当前时间(utc+8)的差额(target如果为日期格式, 用'/'分割， 如：YYYY/MM/dd hh:mm:ss )
export const contrastTime = (target = '2020/09/13 15:00:00') => {
  const targetTime = new Date(target).getTime();
  const now = moment(new Date().getTime())
    .subtract(moment().utcOffset() / 60 - 8, 'hours')
    .valueOf();
  const result = targetTime - now;
  return result < 0 ? 0 : result;
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

// 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
export const transStepToPrecision = (num) => {
  if (num > 1) {
    return 0;
  }
  const decimal = `${num}`.split('.')[1];
  return decimal ? decimal.length : 0;
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
export const floadToPercent = (num) => {
  // console.log('floadToPercent', num);
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return `${new Decimal(+num).mul(100).toFixed()}%`;
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
export const getFullURL = (pathname) => {
  // const { origin, pathname } = window.location;
  if (pathname) {
    return `${window.location.origin}${pathname}`;
  }
  return window.location.href;
};

// 跳转检查是否是安全的链接，防止可执行代码；
export const checkUrlIsSafe = (url) => {
  const _url = decodeURIComponent(decodeURIComponent(url));
  if (!url) {
    return false;
  }
  const _newUrl = new URL(_url);
  // 是否是可执行代码
  // eslint-disable-next-line no-script-url
  if (_newUrl.protocol === 'javascript:') {
    return false;
  }
  return true;
};

export const filterChainInfo = (chainInfo) => {
  const temp = [];
  _.each(chainInfo, (item) => {
    if (
      Object.prototype.hasOwnProperty.call(item, 'isChainEnabled') &&
      item.isChainEnabled === 'false'
    ) {
      return null;
    }
    temp.push(item);
  });
  return temp;
};

export const getImgBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 将换行符和空格替换为标签
export const getFormatCode = (str) => {
  return str.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
};

// 将换行符和空格替换为其他字符
export const getReplaceCode = (str, char) => {
  return str.replace(/\r\n/g, char).replace(/\n/g, char).replace(/\s/g, ' ');
};

export const getAuthPayload = (APP_KEY, SEC_KEY) => {
  const random_str = uuid().split('-').join('');
  const timeStamp = `${new Date().getTime()}`;

  const signature = md5(
    `appkey=${APP_KEY}&timestamp=${timeStamp}&random_str=${random_str}&key=${SEC_KEY}`,
  );

  return {
    appkey: APP_KEY,
    random_str,
    signature,
    timestamp: timeStamp,
  };
};

// 获取页面是否可见
export const getDomVisible = () => {
  // 设置隐藏属性和改变可见属性的事件的名称
  let hidden;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
  }

  if (document[hidden]) {
    return true;
  }
  return false;
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

/** 记录通过广告来注册的用户数量 */
export const gtag_report_conversion = (url) => {
  const callback = () => {
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  window.gtag('event', 'conversion', {
    send_to: 'AW-380686645/IogkCP3om4oCELWiw7UB',
    event_callback: callback,
  });

  window.ym(84577030, 'reachGoal', 'registration');

  return false;
};

export function getCmsCdnHost() {
  let cdnhost = 'https://assets.staticimg.com/cms-static';
  return cdnhost;
}

/**
 * 判断是否字段值不存在，若不存在显示-
 */
export const underlinedVal = (value) => {
  if (value === undefined || value === null) return '-';
  return value;
};
// 增加-的显示，不省略小数位的0，只按指定位数显示
export const underlinedNumberVal = (num, precision = 2) => {
  if (num === undefined || num === null) {
    return '-';
  }
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return separateNumber(numberFixed(num, precision));
};

/**
 * 获取网络请求类型
 */
export const getNetworkType = () => {
  let userAgent = navigator.userAgent;
  let networkStr = userAgent.match(/NetType\/\w+/)
    ? userAgent.match(/NetType\/\w+/)[0]
    : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  let networkType;
  switch (networkStr) {
    case 'wifi':
      networkType = 'wifi';
      break;
    case '5g':
      networkType = '5g';
      break;
    case '4g':
      networkType = '4g';
      break;
    case '3g':
      networkType = '3g';
      break;
    case '3gnet':
      networkType = '3g';
      break;
    case '2g':
      networkType = '2g';
      break;
    default:
      networkType = 'other';
  }
  return networkType;
};

/**
 * 获取浏览器设备信息
 */
export const getUserAgentInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  let name = 'Unknown';
  let version = 'Unknown';
  let browserInfo = {
    type: 'Unknown',
    versions: 'Unknown',
  };
  const networkType = getNetworkType();

  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (
      userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
    ) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
    ) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (!!userAgent.match(/iphone/i)) {
    name = 'iPhone';
    version = 'ios';
  } else if (!!userAgent.match(/Ipad/i)) {
    name = 'iPad';
    version = 'ios';
  } else if (
    userAgent.indexOf('mac') > -1 ||
    !!userAgent.match(/Macintosh/i) ||
    userAgent.match(/MacIntel/i)
  ) {
    name = 'Mac';
    version = 'macOS';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
    version = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
      version = 'Android';
    } else {
      name = 'Linux';
      version = 'Linux';
    }
  } else {
    name = 'Unknown';
    version = 'Unknown';
  }
  const browserArray = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome: userAgent.indexOf('chrome') > -1 && userAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: userAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: userAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') == -1, // safari浏览器
    Edge: userAgent.indexOf('edge') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(userAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(userAgent), // 微信浏览器
  };
  for (var i in browserArray) {
    if (browserArray[i]) {
      var versions = '';
      if (i == 'IE') {
        const matchTarget = userAgent.match(/(msie\s|trident.*rv:)([\w.]+)/);
        versions = matchTarget?.length >= 3 ? matchTarget[2] : null;
      } else if (i == 'Chrome') {
        for (var mt in navigator.mimeTypes) {
          //检测是否是360浏览器(测试只有pc端的360才起作用)
          if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
            i = '360';
          }
        }
        const matchTarget = userAgent.match(/chrome\/([\d.]+)/);
        versions = matchTarget?.length >= 2 ? matchTarget[1] : null;
      } else {
        let matchTarget = [];
        if (i == 'Firefox') {
          matchTarget = userAgent.match(/firefox\/([\d.]+)/);
        } else if (i == 'Opera') {
          matchTarget = userAgent.match(/opera\/([\d.]+)/);
        } else if (i == 'Safari') {
          matchTarget = userAgent.match(/version\/([\d.]+)/) || userAgent.match(/safari\/([\d.]+)/);
        } else if (i == 'Edge') {
          matchTarget = userAgent.match(/edge\/([\d.]+)/);
        } else if (i == 'QQBrowser') {
          matchTarget = userAgent.match(/qqbrowser\/([\d.]+)/);
        }
        versions = matchTarget?.length >= 2 ? matchTarget[1] : null;
      }

      browserInfo.type = i;
      browserInfo.versions = _.isNil(versions) ? '' : parseInt(versions);
    }
  }
  const { type: browserType, versions: browserVersion } = browserInfo;
  const browser = `${browserType} ${browserVersion}`;
  const result = {
    systemName: name,
    systemVersion: version,
    browserType,
    browserVersion,
    browser,
    networkType,
  };
  return result;
};

// convert json to url params
export const jsonToUrlParams = (json) => {
  return Object.keys(json)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key] || '');
    })
    .join('&');
};

export const isArrEqual = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele));
};

/**
 * 返回截取小数位后的数字
 * @param {*} num 数字
 * @param {*} interceptDigits
 * @returns Number类型的返回值
 * 举例 numSeparateDecimal(3212.12545, 2) => 3212.12
 * 举例 numSeparateDecimal('3212.12545', 8) => 3212.12545
 *
 */
export const numSeparateDecimal = (num, interceptDigits = 2) => {
  if (_.isNil(num) || _.isNaN(num) || !num) return 0;
  let stringNum = '' + num;
  let stringNumArray = stringNum.split('.');
  if (stringNumArray.length <= 1) return parseFloat(stringNum);
  if (stringNumArray[1].length > interceptDigits) {
    const n1 = stringNumArray[1].slice(0, interceptDigits);
    stringNumArray.splice(1, 1, n1);
    return parseFloat(stringNumArray.join('.'));
  }
  return +num;
};

/**
 * 国际化数字千分位, 支持负数
 * @param {*} param0
 * @param lang 语言参数 默认是 'en_US'
 * @param data 需要转化的数字数据
 * @param options 可选选项
 * @param interceptDigits 截取小数位数 有的业务需要使用的是直接截取小数位数而不是直接四舍五入就需要传递这个 默认值 null
 * 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * 参考 https://kux.kucoin.net/#/intl
 * bn-BD国际化数字对应是 1234567890 =>  ১২৩৪৫৬৭৮৯০
 * @returns
 * 举例 formatLocalLangNumber({ data: 9999, lang: 'bn-BD' }) => ৯,৯৯৯
 * 举例 formatLocalLangNumber({ data: '3212.12545', interceptDigits: 2 }) => 3,212.12
 * 举例 formatLocalLangNumber({ data: '3212.12545', lang: 'bn-BD' }) =>  ৩,২১২.১২৫৪৫
 * 举例 formatLocalLangNumber({ data: '-10000.234', lang: 'bn-BD' }) =>  -১০,০০০.২৩৪
 * 举例 formatLocalLangNumber({ data: '3212.12545', lang: 'bn-BD', interceptDigits: 2 }) => ৩,২১২.১২
 * 举例 formatLocalLangNumber({ data:  0.258789, lang: 'bn-BD', options:{ style: 'percent' } }) => ২৫.৮৭৮৯%
 */
export const formatLocalLangNumber = ({
  lang = window._DEFAULT_LANG_,
  data,
  options = {},
  interceptDigits = null,
}) => {
  const num = +data;
  if (_.isNil(data) || _.isNaN(data) || typeof num !== 'number') return data;
  const _lang = lang.replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    ...{ maximumFractionDigits: 8 },
    ...options,
  });
  let result;
  let newNum = num;
  if (!_.isNil(interceptDigits) && typeof interceptDigits === 'number' && interceptDigits >= 0) {
    newNum = numSeparateDecimal(newNum, interceptDigits);
  }
  result = numberFormat.format(newNum);
  return result;
};

/**
 * 注意：不要再使用该方法，使用组件库里封装的！！
 * 处理从右向左顺序下的percent显示
 * @param {*} char % | M
 * @param {*} value 需转换的数字
 * @param {*} isPositive 是否需要+号
 * @param {*} isRTL
 * @returns
 */
export const transformRtlNum = ({ char = '%', value, isPositive, lang }) => {
  try {
    const isRTL = isRTLLanguage(lang);
    if (typeof +value !== 'number' || Number.isNaN(+value)) {
      return !isRTL ? `${value}${char}` : `${char}${value}`;
    }

    const sign = +value < 0 ? '-' : isPositive ? '+' : '';

    if (!isRTL) {
      return `${sign}${Math.abs(value)}${char}`;
    } else {
      return `${sign}${char}${Math.abs(value)}`;
    }
  } catch (e) {
    console.log(e || 'transformRtlNum error');
    return value;
  }
};

