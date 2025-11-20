/**
 * Owner: jesse.shao@kupotech.com
 */
import _, { isEmpty, isNil, isNaN } from 'lodash';
import FormData from 'form-data';
import moment from 'moment';
import JsBridge from 'utils/jsBridge';
import { MAIN_HOST } from 'utils/siteConfig';
import Decimal from 'decimal.js/decimal';
import { maxDecimalPrecision } from 'config';
import pathToRegexp from 'path-to-regexp';
import EventEmitter from 'event-emitter';
import MD5 from 'crypto-js/md5';
import qs from 'query-string';
import { getLocalBase, getPathByLang, _BASE_, KC_APP_SUPPORT_VERSION } from './config';
import { sensors } from 'utils/sensors';


/**
 * @decription 高精度减法
 */
export const sub = (a, b) => {
  return new Decimal(a).sub(b);
};

/**
 *  高精度加法
 */
export const add = (x, y) => {
  return new Decimal(x).plus(y).toFixed();
};

/**
 * 高精度乘法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiply = (a, b, decimal = 8, round = Decimal.ROUND_HALF_UP) => {
  return new Decimal(a).mul(b).toFixed(decimal, round);
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
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new Decimal(a).div(b).toFixed(decimal, round);
};

/**
 * Date string to timestamp
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
 * Timestamp formatting
 * Format by local time zone
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export const showDatetime = (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(_.toNumber(timestamp)).format(format);
};

/**
 * Format by fixed time zone
 * @param {*} ts
 * @param {*} zone
 */
export const showDateTimeByZone = (ts, format = 'YYYY/MM/DD HH:mm:ss', zone = 8) => {
  return moment(ts).utcOffset(zone).format(format);
};

/**
 * Object to form data
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
 * Thousands separator
 * @param n
 * @returns {string}
 */
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
      // Clear cache
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};
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
 * Whether open in WeChat browser
 *
 * @returns {boolean}
 */
export const isOpenInWechat = (pUA) => {
  const ua = pUA || navigator.userAgent.toLowerCase();
  const match = ua.match(/MicroMessenger/i);

  return match && match[0] === 'micromessenger';
};

/**
 * Scroll to anchor
 * @param anchorName
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
 * Events
 */
export const Event = {};

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
 *
 * @description Get queryString string into JSON object
 * @param {String} search Optional parameter None is to automatically obtain the queryString behind the location
 * @returns {Object}
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
 * Get browser language
 *
 * @returns {String|null}
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
 * get Window rect height
 */
export const getWindowRectHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

/**
 * 解决移动端弹窗滚动穿透问题，弹窗打开时，固定背景：fixedBody，弹窗关闭时移除：looseBody
 */
export const fixedBody = () => {
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px';
};

export const looseBody = () => {
  const body = document.body;
  body.style.position = '';
  const top = body.style.top;
  document.body.scrollTo = document.documentElement.scrollTo = -parseInt(top);
  body.style.top = '';
};

// 距离未来某个时间还剩多少时间
// 时间戳
export const getLastedTime = (endDate) => {
  const durTime = endDate - new Date().getTime();
  if (durTime <= 0) {
    return false;
  }
  const date = moment.duration(durTime, 'ms');
  return {
    day: date.get('days'),
    hour: date.get('hours'),
    min: date.get('minutes'),
    sec: date.get('seconds'),
  };
};

// 距离过去某个时间过去了多少时间
// 时间戳
export const getFormerlyTime = (startDate, compareNow) => {
  if (!startDate || startDate <= 0) {
    return false;
  }
  const durTime = compareNow ? new Date().getTime() - startDate : startDate;
  if (durTime <= 0) {
    return false;
  }
  const date = moment.duration(durTime, 'ms');
  const hours = Math.floor(date.asHours());
  return {
    hour: hours,
    min: date.get('minutes'),
    sec: date.get('seconds'),
  };
};

// 向url添加参数
export const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || typeof uri !== 'string' || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }
  return `${uri}${separator}${key}=${value}`;
};

// 判断是否是IOS
export const isIOS = () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
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

export const dropZero = (str) => {
  if (isNaN(str) || str === undefined) return '--';
  const e = new Decimal(str);
  return e.toFixed();
};

export const formatNumber = (num, precision) => {
  return separateNumber(dropZero(numberFixed(num, precision)));
};

export const createDecimals = (decimalPrecision) => {
  const decimals = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: Math.pow(10, maxDecimalPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};

/**
 * @decription 小数转百分比
 */
export const toPercent = (a, sign = '%') => {
  return `${new Decimal(a).mul(100).toFixed()}${sign}`;
};

/**
 * 小数转分数, 小数精度最大2位
 * @param {*} num
 */
export const decimalsToFractional = (num) => {
  if (!num || typeof +num !== 'number') return 0;
  // 分子
  let numerator = new Decimal(+num).mul(100).toFixed();
  // 分母
  let denominator = 100;
  // 较小的
  let min = Math.min(numerator, denominator);
  for (let i = min; i > 1; i--) {
    if (!(numerator % i) && !(denominator % i)) {
      numerator = numerator / i;
      denominator = denominator / i;
      min = Math.min(numerator, denominator);
    }
  }
  return `${numerator}/${denominator}`;
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
 * 转换px rem
 * @param {*} px
 * @param {*} base
 */
export const px2rem = (px, base = 14.0625) => {
  return px / base + 'rem';
};
/**
 * 计算相对px
 * @param {*} pxHeight 原px
 */
export function calcPx(pxHeight, base = 14.0625) {
  const fontSize = (document.querySelector('html').style.fontSize || `${base}px`).replace('px', '');
  return (pxHeight * fontSize) / base;
}

// 检查url是否包含
const _ex = new RegExp('^' + _BASE_.replace(/\//g, '\\/') + '[/]');
export const checkPathname = (paths) => {
  const pathname = `${window.location.pathname}`.replace(_ex, '/');
  const data = _.some(paths, (item) => {
    const regexp = pathToRegexp(item);
    if (regexp.exec(pathname)) {
      return true;
    }
    return false;
  });
  return data;
};

/** 加载图片完执行callback */
export const loadImg = (imgNeed, cb, i = 0) => {
  const img = new Image();
  img.src = imgNeed[i];
  img.onload = () => {
    if (i++ < imgNeed.length - 1) {
      loadImg(imgNeed, cb, i);
    } else {
      cb();
    }
  };
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

/**
 * 格式化日期时间，固定东八区
 */
export const formatDateTime = (timestamp, format = 'YYYY-MM-DD') => {
  if (timestamp) {
    if (timestamp.toString().length < 11) {
      timestamp = timestamp * 1000; // 秒转毫秒
    }
    return moment(_.toNumber(timestamp)).utcOffset(480).format(format);
  }
  return '--';
};

/**
 * 格式化日期时间UTC格式 默认是UTC0
 */
export const formatDateTimeToUTC = (timestamp, format = 'YYYY-MM-DD', utc = 0) => {
  if (timestamp) {
    if (timestamp.toString().length < 11) {
      timestamp = timestamp * 1000; // 秒转毫秒
    }
    return moment(_.toNumber(timestamp)).utcOffset(utc).format(format);
  }
  return '--';
};

/**
 * 数值展示
 */
export const numberShow = (number) => {
  if (!number && number !== 0 && number !== '0') {
    return '--';
  }
  return number ? separateNumber(number) : number;
};

// 取头像
export const getUserFlag = (user) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (
        nicknameStr[1] &&
        nicknameStr[0].charCodeAt() <= 255 &&
        nicknameStr[1].charCodeAt() <= 255
      ) {
        userFlag += nicknameStr[1];
      }
      if (/^\*+\d+$/.test(nickname)) {
        userFlag = nickname.substring(nickname.length - 2);
      }
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    } else {
      userFlag = 'KU';
    }
    if (user.isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};
/**
 * 页面跳转,app, h5, web
 */
// isExternal： 是否是app外浏览器打开网页
export const openPage = (isInApp, url, isExternal = false) => {
  if (!url) {
    return;
  }
  let _url = url;
  if (isInApp) {
    // 不是app原生路由,就打开网页
    if (url.indexOf('/') !== 0) {
      _url = `${isExternal ? '/external' : ''}/link?url=${encodeURIComponent(url)}`;
    }
    JsBridge.open({
      type: 'jump',
      params: {
        url: _url,
      },
    });
    return;
  }
  if (url) {
    if (url.indexOf('/') === 0) {
      _url = `${MAIN_HOST}${url}`;
    }
    const newTab = window.open(_url, '_blank');
    newTab.opener = null;
  }
};

export const isSub = () => {
  return window.location.hostname.indexOf('land') === -1;
};

export const getTimeStampByLen = (len) => {
  return Date.now().toString().slice(0, len);
};

export function getCmsCdnHost() {
  return 'https://assets.staticimg.com/cms-static';
}

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
 * 判断是否字段值不存在，若不存在显示-
 */
export const underlinedVal = (value) => {
  if (value === undefined || value === null) return '-';
  return value;
};

/**
 * 计算倒计时
 * @returns 时，分，秒
 */
export const computeCountdown = (endDate, startDate) => {
  const time = Math.abs((startDate ? moment(startDate) : moment()) - moment(endDate));
  const duration = moment.duration(time, 'ms');
  return {
    h: duration.asHours() | 0,
    m: duration.minutes() | 0,
    s: duration.seconds() | 0,
  };
};

/**
 * 获取页面加载时间参数
 */
export const getLoadTimesMap = () => {
  try {
    const list = window.performance ? window.performance.getEntriesByType('navigation') : undefined;
    if (list && list.length) {
      const {
        startTime,
        domContentLoadedEventEnd,
        requestStart,
        responseStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        connectEnd,
      } = list[0] || {};
      return {
        startTime,
        domContentLoadedEventEnd, // dom渲染完成时间，DOMContentLoaded时间
        requestStart, // 发起请求的时间
        responseStart, // 服务器开始响应的时间，白屏时间
        dnsTime: (domainLookupEnd || 0) - (domainLookupStart || 0), // DNS解析时间
        tcpTime: (connectStart || 0) - (connectEnd || 0), // TCP建立连接时间
      };
    }
    return {};
  } catch (e) {
    console.error(e);
    return {};
  }
};

/**
 * 数字前补0
 */
export const preFixNum = (num, length) => (Array(length).join('0') + num).slice(-length);

export const FORBIDDEN_COUNTRIES_FOR_USE = [
  {
    code: 'CN',
    mobileCode: '86',
    aliasName: '其他', // 被屏蔽的国家，界面显示的别名
    aliasNameEN: 'Other',
  },
];

export const isForbiddenCountry = (mobileCode, field = 'mobileCode') => {
  return _.find(FORBIDDEN_COUNTRIES_FOR_USE, (forbiddenItem) => {
    return forbiddenItem[field] === mobileCode;
  });
};

export const getForbiddenCode = (forbiddenItem, lang = 'zh_CN') => {
  const displayCode = 'Other';
  if (forbiddenItem) {
    const codeField = _.includes(['zh_CN'], lang) ? 'aliasName' : 'aliasNameEN';
    return forbiddenItem[codeField] || displayCode;
  }
  return displayCode;
};

// 获取字符串里a标签的href链接
export const getHrefValue = (playText) => {
  let arr = null;
  if (playText.indexOf('href="') !== -1) {
    let index1 = playText.indexOf('href="');
    let index2 = playText.indexOf('</a>');
    let str = playText.substring(index1, index2);
    index1 = str.indexOf('"');
    str = str.substr(index1 + 1);
    index2 = str.indexOf('"');
    arr = str.substring(0, index2);
  }
  return arr;
};
// 得到两个数之间的随机整数，包括两个数在内
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
/**
 * 获取天时分
 * @param {Number} seconds 总秒数
 */
export const getTFM = (second_time) => {
  let time = '0分';
  if (parseInt(second_time) > 60) {
    // let second = parseInt(second_time) % 60;
    let min = parseInt(second_time / 60);
    time = min + '分';

    if (min > 60) {
      min = parseInt(second_time / 60) % 60;
      var hour = parseInt(parseInt(second_time / 60) / 60);
      time = hour + '小时' + min + '分';

      if (hour > 24) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        time = day + '天' + hour + '小时' + min + '分';
      }
    }
  }
  return time;
};

// 获取制定总位数和小数位置的数字
export const getDecimalNumber = (number, totalDecimal, pointDecimal) => {
  const strArray = number.toString().split('.');
  const len1 = strArray[0].length;
  const len2 = strArray[1] ? strArray[1].length : 0;
  if (len1 + len2 <= totalDecimal) {
    return numberFixed(Number(number), pointDecimal);
  } else {
    return numberFixed(Number(number), totalDecimal - len1);
  }
};

export function deleteLangQuery(url = '') {
  if (!url) {
    return url;
  }
  let href = url;
  const query = qs.parse(window.location.search, { decode: false });
  if (query.lang) {
    delete query.lang;
    const search = qs.stringify(query);
    if (search) {
      href = url.replace(window.location.search, `?${search}`);
    } else {
      // 去掉lang的search
      href = url.substr(0, url.lastIndexOf('?'));
    }
  }
  if (href.endsWith('/')) {
    href = href.substring(0, href.length - 1);
  }
  return href;
}

export const changeLocation = (l) => {
  const { isExist: oldLang, localeBasenameFromPath } = getLocalBase();
  let newBase = getPathByLang(l);
  if (oldLang) {
    const hasLineBase = `/${newBase}`;
    // safari浏览器不支持 ?<=
    let href = window.location.href.replace(
      new RegExp(`${window.location.origin}/${localeBasenameFromPath}`),
      `${window.location.origin}${newBase === window._DEFAULT_LOCALE_ ? '' : hasLineBase}`,
    );
    window.location.replace(deleteLangQuery(href));
  } else {
    const locationOrigin = window.location.origin;
    const pathRe = pathToRegexp('/land(.*)?');
    const execResult = pathRe.exec(window.location.pathname);
    if (execResult && newBase === window._DEFAULT_LOCALE_) {
      return;
    }
    if (newBase === window._DEFAULT_LOCALE_) {
      newBase = '';
    }
    if (!execResult) {
      newBase = `${newBase}${newBase ? '/' : ''}land`;
    }
    let href = window.location.href.replace(
      locationOrigin,
      `${locationOrigin}${newBase ? '/' : ''}${newBase}`,
    );
    window.location.replace(deleteLangQuery(href));
  }
};

//返回监听
export let handleBack = null;
export const changeHandleBack = (func) => {
  if (typeof func === 'function') {
    handleBack = func;
  }
};
export const clearHandleBack = () => {
  handleBack = null;
};
/**
 * 获取当前设备是否为IOS终端设备
 * @returns bool
 */
export const getIsIos = () => {
  const u = navigator.userAgent;
  const ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const iPad = u.indexOf('iPad') > -1;
  const iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
  if (ios || iPad || iPhone) {
    return true;
  } else {
    return false;
  }
};

/**
 * 获取当前设备是否为安卓终端设备
 * @returns bool
 */
export const getIsAndroid = () => {
  const u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return true;
  } else {
    return false;
  }
};

/**
 * 获取当前设备是否为iphone刘海屏
 * @returns bool
 */
export const getIsIPhoneX = () => {
  if (typeof window !== 'undefined' && window) {
    return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
  }
  return false;
};

/**
 * 获取当前打开的浏览器页面是否是移动端
 * @returns
 */
export const getIsMobileBrowser = () => {
  if (typeof window !== 'undefined' && window) {
    return /Android|Mobi|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)
  }
  return false
}

/**
 * 获取0时区格式化时间
 * @param {传入时间} time
 * @param {格式化格式} format
 */
export const getUtcZeroTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (moment(time).isValid()) {
    return moment.utc(time).format(format);
  }
  return '';
};

/**
 * 延迟函数
 * @param {*} time
 * @param {*} res
 * @returns
 */
export const delay = (time = 1000, res = {}) =>
  new Promise((resolve) => setTimeout(() => resolve(res), time));

/**
 * isNilOrEmpty
 * @returns
 */
export const isNilOrEmpty = (v) => isNil(v) || isEmpty(v);

// 判断是否是在App中
export const getIsInApp = () => {
  /* 多租户 */
  return window.navigator.userAgent.indexOf('KuCoin') > -1;
};

// 转为千分位
export const formatThousandth = (num) => {
  if (!num || isNaN(num) || +num < 1000) return num;

  // Convert to string
  const numStr = String(num);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');

  // Reverse the integer part and insert commas every 3 characters
  const reversed = integerPart.split('').reverse();
  const formattedReversed = [];
  for (let i = 0; i < reversed.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedReversed.push(',');
    }
    formattedReversed.push(reversed[i]);
  }

  // Reverse back to get the correctly formatted integer part
  const formattedInteger = formattedReversed.reverse().join('');

  // Combine the integer part and decimal part (if any)
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// 千分位转回正常数字
export const formatThousandthToNumber = (numOrigin) => {
  if (!numOrigin) return numOrigin;
  let num = numOrigin.toString();
  if (num.trim() === '') {
    return '';
  }
  num = num.replace(/,/gi, '');
  return Number(num);
};

const defaultOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23', // 如果用h24的话 会出现 00:00:00 变成24:00:00的问题
};
/**
 * 国际化日期
 * @param {*} param0
 * @param currentLang 语言参数 默认是 'en_US'
 * @param ts 需要转化的数据
 * @param options 可选选项
 * 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * 参考 https://kux.kucoin.net/#/intl
 * @returns
 * formatLocalLangNumber({ data: '2023-03-29 22:42:02 ', lang: 'bn-BD', }) =>  ২৯/৩/২০২৩, ২২:৪২:০২
 */
export const dateTimeFormat = ({ currentLang, ts, options = {} }) => {
  if (!ts) {
    return '';
  }

  const _lang = (currentLang || window._DEFAULT_LANG_)?.replace('_', '-');
  const dateTimeFormat = new Intl.DateTimeFormat(_lang, { ...defaultOptions, ...options });

  return dateTimeFormat.format(ts);
};

export const setHTMLLang = (lang) => {
  const langNow = lang.split(/[-_]/)[0];
  const t = document.documentElement.classList;
  t.remove(...[...t]);
  t.add(langNow);
};
/**
 * 从window.location.search 中匹配key对应的值
 * @param {*} variable 匹配key
 * @returns
 * 例如 http://kucoin.net/zh-hant/land/KuRewards/coupons?jumpSource=KuRewards
 * variable传入值为 jumpSource return KuRewards
 * variable传入值为 id return false;
 */
export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
};

/**
 * 截取小数位
 * @param {*} num 数字
 * @param {*} interceptDigits
 * @returns Number类型的返回值
 * 举例 numSeparateDecimal(3212.12545, 2) => 3212.12
 * 举例 numSeparateDecimal('3212.12545', 8) => 3212.12545
 *
 */
export const numSeparateDecimal = (num, interceptDigits = 2) => {
  if (isNil(num) || isNaN(num) || !num) return 0;
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
  if (isNil(data) || isNaN(data) || _.isNaN(num)  || typeof num !== 'number') return data;
  const _lang = lang.replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    ...{ maximumFractionDigits: 8 },
    ...options,
  });
  let result;
  let newNum = num;
  if (!isNil(interceptDigits) && typeof interceptDigits === 'number' && interceptDigits >= 0) {
    newNum = numSeparateDecimal(newNum, interceptDigits);
  }
  result = numberFormat.format(newNum);
  return result;
};


export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null) {
    a = new Decimal(0);
  }
  if (!Decimal.isDecimal(a)) {
    // @Clyne 2022.12.13 修改，一来toNumber之后又超过精度的字符串就G了
    const isNaN = _.isNaN(_.toNumber(a));
    a = new Decimal(isNaN ? NaN : a);
  }

  return a;
}

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
 * 跳转到app的登陆
 * 分支 - 支持生物识别登陆 调用gotoCheckLoginPage
 * 分支 - 不支持生物识别登陆 跳转到app原生登陆页面
 */
export const gotoAppLogin = () => {
  // 如果在app中， 统一调起app的登录
  if (JsBridge.isApp()) {
    JsBridge.open(
      {
        type: 'func',
        params: {
          name: 'getAppVersion',
        },
      },
      ({ data: appVersion } = {}) => {
        const supportCookieLogin =
          compareVersion(appVersion, KC_APP_SUPPORT_VERSION.supportCookieLogin) >= 0;
        if (supportCookieLogin) {
          /** 是否支持跳转到生物识别登陆页面 */
          const supportJumpCheckLoginPage =
            compareVersion(appVersion, KC_APP_SUPPORT_VERSION.supportJumpCheckLoginPage) >= 0;
          if (supportJumpCheckLoginPage) {
            /** 神策埋点 */
            sensors.trackClick(['appGotoCheckLoginPage', '1']);
            /** 跳转到生物识别登陆页面 */
            JsBridge.open({
              type: 'func',
              params: {
                name: 'gotoCheckLoginPage',
              },
            });
          } else {
            /** 神策埋点 */
            sensors.trackClick(['appJumpLoginPage', '1']);
            JsBridge.open({
              type: 'jump',
              params: {
                url: '/user/login',
              },
            });
          }
        }
      },
    );
  }
};
