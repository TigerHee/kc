/**
 * Owner: roger.chen@kupotech.com
 */
import _ from 'lodash';
import storage from 'utils/storage';
import * as ws from '@kc/socket/lib/rn';
import {DEFAULT_LANG, languages} from 'config';

// 将文本插入光标位置
export const insertTextInSelection = (insertText, originText, selection) => {
  insertText = insertText || '';
  originText = originText || '';
  if (selection) {
    const {start, end} = selection;
    const leftText = originText.substring(0, start);
    const rightText = originText.substring(end, originText.length);
    return leftText + insertText + rightText;
  } else {
    // 无光标对象则插入到最后
    return originText + insertText;
  }
};

// 将html富文本还原为tag占位符
export const convertHtmlToTagPlaceholder = html => {
  html = html
    .replace(/[\r\n]/g, '')
    .replace(/<i.*?data-key="(.+?)".*?i>/g, '{{$1}}');
  // 去除不认识的富文本标签
  return html.replace(/<.+?>/g, '');
};

// 将html富文本还原为tagList
export const getAllTagListWithHtml = html => {
  if (!html) return [];
  html = convertHtmlToTagPlaceholder(html);
  const matchList = html.match(/{{[^{]+?}}/g) || [];
  return matchList
    .map(item => {
      const type = item.replace(/{{(.+?):.+?}}/, '$1');
      const code = item.replace(/{{.+?:(.+?)}}/, '$1');
      if (['coin', 'portfolio'].some(i => i === type)) {
        return {type, code};
      } else {
        return false;
      }
    })
    .filter(i => !!i);
};

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

// 数字转换
export const unitConverter = num => {
  if (!num || isNaN(num)) {
    return '--';
  }
  num = Number(num);
  if (Math.abs(num) > 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'; // 十亿
  } else if (Math.abs(num) > 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (Math.abs(num) > 1000) {
    return (num / 1000).toFixed(2) + 'k';
  } else {
    return num.toFixed(0);
  }
};

export const numberFixed = (v, decimal) => {
  return v.toFixed(decimal);
};

// 获取制定总位数和小数位置的数字
export const getDecimalNumber = (numberOrigin, totalDecimal, pointDecimal) => {
  const number = Number(numberOrigin) || 0;
  const strArray = number.toString().split('.');
  const len1 = strArray[0].length;
  const len2 = strArray[1] ? strArray[1].length : 0;
  let number1 = '';
  if (len1 + len2 <= totalDecimal) {
    number1 = Number(number).toFixed(pointDecimal);
  } else {
    const decimalNumber = totalDecimal - len1;
    number1 = Number(number).toFixed(decimalNumber >= 0 ? decimalNumber : 0);
  }
  return (Number(number1) * 100) / 100;
};
// 设置session
let AppSession = '';
export const setSession = async session => {
  AppSession = session || '-1';
  // 设置ws的cookie
  ws.setRnCookie(`;SESSION=${session};`);
};

// 设置语言（可能存在不支持的语言）
let currentLang = DEFAULT_LANG;
export const setCurrentLang = async lang => {
  let _lang = lang;
  if (!_lang) {
    _lang = await storage.getItem('lang');
  }
  if (_lang && languages.some(i => i === _lang)) {
    currentLang = _lang;
  }
  storage.setItem('lang', currentLang);
  return currentLang;
};

export const getCurrentLang = () => {
  return currentLang;
};

// 设置NATIVE_INFO
let _NATIVE_INFO;
export const setNativeInfo = async info => {
  if (info) {
    _NATIVE_INFO = info;
    storage.setItem('NATIVE_INFO', info);
  } else {
    _NATIVE_INFO = (await storage.getItem('NATIVE_INFO')) || {};
  }
  return _NATIVE_INFO;
};

export const getNativeInfo = async () => {
  if (_NATIVE_INFO) {
    return _NATIVE_INFO;
  } else {
    return (await storage.getItem('NATIVE_INFO')) || {};
  }
};

// 设置 webApiHost
let _WEB_API_HOST;
export const setWebApiHost = async host => {
  if (host) {
    _WEB_API_HOST = host;
    storage.setItem('WEB_API_HOST', host);
  } else {
    _WEB_API_HOST = await storage.getItem('WEB_API_HOST');
  }
  return _WEB_API_HOST;
};

export const getWebApiHost = async () => {
  if (_WEB_API_HOST) {
    return _WEB_API_HOST;
  } else {
    return await storage.getItem('WEB_API_HOST');
  }
};

/**
 * 增加千分位分隔符
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
export const separateNumber = n => {
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
    [integer, floater] = arr;
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

export const showDatetime = function (timestamp, fmt = 'YYYY/MM/DD hh:mm:ss') {
  const date = new Date(Number(timestamp));
  const o = {
    'M+': date.getMonth() + 1, //月份
    'D+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
};

// 取整点时间的字符串
export const getHourTime = function () {
  const t = new Date();
  const now = t.toLocaleTimeString().replace(/^\D*/, '');
  const num = now.indexOf(':');
  const time = now.substring(0, num) + ':00';
  return time;
};

export const scientificToNumber = num => {
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    let zero = '0';
    let parts = String(num).toLowerCase().split('e');
    let e = parts[1];
    let zeroLen = Math.abs(e);
    let sign = e / zeroLen;
    let beforeArr = parts[0].split('.');
    if (sign < 0) {
      num = zero + '.' + new Array(zeroLen).join(zero) + beforeArr.join('');
    } else {
      let dec = beforeArr[1];
      if (dec) {
        zeroLen = zeroLen - dec.length;
        num = beforeArr.join('') + new Array(zeroLen + 1).join(zero);
      }
    }
  }
  return num;
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
