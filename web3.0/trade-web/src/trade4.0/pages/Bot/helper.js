/**
 * Owner: mike@kupotech.com
 */
import { numberFixed, dropZero, showDateTimeByZone } from 'helper';
import Decimal from 'decimal.js/decimal';
import intl from 'react-intl-universal';
import { _t } from 'Bot/utils/lang';
import { dateTimeFormat } from '@kux/mui/utils';
import { isRTLLanguage } from 'src/utils/langTools';
import {
  numberResolve as rawNumberResolve,
  formatNumber as rawFormatNumber,
  floadToPercent,
} from '@/utils/format';

const numberResolve = (val, precision = 2) => rawNumberResolve(val, precision);

const formatNumber = (value, precision, dropZ = true) => {
  return rawFormatNumber(value, { fixed: precision, dropZ });
};

export { formatNumber, numberFixed, dropZero, showDateTimeByZone, numberResolve };

/**
 * @description:
 * @param {*} rate
 * @param {*} precision
 * @return {*}
 */
export const RateToNumber = (rate, precision = 2) => {
  if (!rate) return 0;
  return Number(
    Decimal(rate || 0)
      .times(100)
      .toFixed(precision, Decimal.ROUND_DOWN),
  );
};
/**
 * @description: 不需要分割
 * @param {*} num
 * @param {*} precision
 * @return {*}
 */
export const pureNumber = (num, precision) => {
  return dropZero(numberFixed(num, precision));
};
export const getNumberUnit = (num) => (+num > 0 ? '+' : '');

export function isNull(str) {
  return ['', null, undefined, 'null', 'undefined'].includes(str);
}
/**
 * 按照精度格式化，如果为0，就至少保留两位有效小数
 * 一直取到有值为effectivePlaces小数位为止 /0\.0{2,8}[1-9]{1}\d{1}/
 * 如果整数位为0小数位需要保留三位有效数字
 * @param {} num
 * @param {*} precision 理想精度
 * @param {*} effectivePlaces  实际有效精度
 */
const precisionRegrex = (precision) => new RegExp(`-?0\\.0{${precision},8}\\d{1,3}`);

export const formatEffectiveDecimal = (num, precision = 8, hasSeparator = true) => {
  precision = +precision || 8;
  if (!num || isNaN(num)) {
    return 0;
  }
  if (Number(num) === 0) return 0;
  const firstLevel = numberFixed(num, precision);
  if (Number(firstLevel) !== 0) {
    return hasSeparator ? formatNumber(firstLevel) : dropZero(firstLevel);
  }
  const numStr = new Decimal(num).toFixed();
  const regrex = precisionRegrex(Math.min(precision, 8));
  const result = numStr.match(regrex);
  if (result) {
    return dropZero(result?.[0]);
  }
  return '0';
};

export const div100 = (num) => {
  if (!num) return 0;
  return Decimal(num).div(100).toNumber();
};
export const times100 = (num, precision = 2) => {
  if (!num) return 0;
  if (precision) {
    return Number(Decimal(num).times(100).toFixed(precision));
  }
  return Decimal(num).times(100).toNumber();
};

export const isDecimal = (num) => {
  if (!num) return false;
  return /\.\d+$/.test(num);
};

// '0' 0
export const isNumber = (num) => {
  return /^\d+(\.\d+)?$/.test(num);
};
export function isZero(val) {
  return /^0(\.0*)?$/.test(val);
}
// 科学计数法转数字字符串
export function toNonExponential(num) {
  num = Number(num);
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}
// 正则判断是否满足需要的小数位
export const testDecimalIsOk = (precision, value) => {
  precision = +precision;
  // 整数情况
  if (precision === 0) {
    return !String(value).includes('.');
  }
  value = toNonExponential(value);
  const t = new RegExp(`^\\d+(\\.\\d{1,${precision}})?$`);
  return t.test(value);
};

export function toSplitCase(symbol) {
  if (!symbol) return;
  return symbol.replace('-', '/');
}
export function toCableCase(symbol) {
  if (!symbol) return;
  return symbol.replace('/', '-');
}
export const getLang = () => {
  return intl.options.currentLocale;
};
// 很多配置 就只有中文 和 英语
export const getAvailLang = () => {
  const lang = getLang();
  return ['zh_CN', 'en_US'].includes(lang) ? lang : 'en_US';
};

export function decodeSymbol(symbol) {
  if (!symbol) return [];
  return symbol.split(/\/|-/);
}

export function getBase(symbol) {
  if (!symbol) return;
  return decodeSymbol(symbol)[0];
}

export function getQuota(symbol) {
  if (!symbol) return;
  return decodeSymbol(symbol)[1];
}

// 计算时间差 原子函数
export const nuclearCaclRunTime = (runTime) => {
  const diff = Number(runTime) / 1000; // 秒
  const daySec = 24 * 3600;
  const day = Math.floor(diff / daySec);
  const hour = Math.floor((diff % daySec) / 3600);
  const minite = Math.floor(((diff % daySec) % 3600) / 60);
  const sec = Math.floor(((diff % daySec) % 3600) % 60);
  return {
    day,
    hour,
    minite,
    sec,
  };
};

export const calcRunTime = (runTime, lang = getLang(), format = 'DD HH MM') => {
  const { day, hour, minite } = nuclearCaclRunTime(runTime);
  const results = [];
  format.split(' ').forEach((f) => {
    if (f === 'DD') {
      results.push(lang === 'zh_CN' ? `${day}天` : `${day}d`);
    } else if (f === 'HH') {
      results.push(lang === 'zh_CN' ? `${hour}小时` : `${hour}h`);
    } else if (f === 'MM') {
      results.push(lang === 'zh_CN' ? `${minite}分` : `${minite}m`);
    }
  });
  return results.join(' ');
};
/**
 * 开始结束时间格式化
 * @param {*} startTime
 * @param {*} endTime
 */
export function formatDuration(startTime, endTime) {
  endTime = endTime || Date.now();
  const lang = getLang();
  if (lang === 'zh_CN') {
    if (!startTime) return '0天0小时0分';
  }
  if (!startTime) return '0d 0h 0m';
  const diff = endTime - startTime;
  return calcRunTime(diff);
}

/**
 * 时间段格式化
 * @param {*} runTime
 */
export function formatSpanDuration(runTime, format = 'DD HH MM') {
  const lang = getLang();
  if (lang === 'en_US') {
    if (!runTime) return '0d 0h';
  }
  if (!runTime) return '0天0小时';
  return calcRunTime(runTime, lang, format);
}

// 参数string 话
export function queryString(data) {
  const query = [];
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      query.push(`${key}=${data[key]}`);
    }
  }
  return query.join('&');
}

/**
 * 转换成百分比
 * @param {*} num
 */
export const floatToPercent = (num, precision, multiple, isPositive = false) => {
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }
  return floadToPercent(num, { isPositive, precision });
};

/**
 * @description: 多语言时间格式化
 * @return {*}
 */
const defaultOptions = {
  year: 'numeric',
  // month: 'numeric',
  // day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
  day: '2-digit',
  month: '2-digit',
};

export function localDateTimeFormat(date, options) {
  if (!date) return date;
  return dateTimeFormat({
    lang: getLang(),
    date,
    options: options ?? defaultOptions,
  });
}
/**
 * @description: 判断是否是合约交易对
 * @param {*} symbol
 * @return {*}
 */
export const isFutureSymbol = (symbol) => {
  if (!symbol) return false;
  if (symbol.match('XBT') || symbol.match(/(USDTM|USDCM|USDM)/)) return true;
  return false;
};

/**
 * @description: 判断是否是现货交易对
 * @param {*} symbol
 * @return {*}
 */
export const isSpotSymbol = (symbol) => {
  if (!symbol) return false;
  const reg = /^[A-Z]{2,}-[A-Z]{2,}$/;
  return reg.test(symbol);
};

export const jump = (url) => {
  window.open(url, '_blank');
};

/**
 * @description: 主要拆解 -9999.99%这样的数据
 * @param {*} value
 * @return {array|string}
 */
export const dividerNumberParts = (value) => {
  let unit = '';
  let num = '';
  let percent = '';
  value = String(value).trim();
  const reg = /^([-+<])?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)(%?)$/;
  const results = reg.exec(value);
  if (results) {
    unit = results[1] ?? '';
    num = results[2] ?? '';
    percent = results[3] ?? '';
  } else {
    return value;
  }
  return [unit, num, percent];
};

/**
 * @description: RTL翻转效果 -9999.8888%
 * @param {*} str
 * @return {*}
 */
export const reverseText = (str) => {
  if (!isRTLLanguage()) {
    return str;
  }
  const results = dividerNumberParts(str);
  if (!Array.isArray(results)) {
    return str;
  }
  const [unit, , percent] = results;
  // 没有符号 百分号 不处理
  if (!unit && !percent) {
    return str;
  }
  return results.reverse().join('');
};
/**
 * @description: 函数使用
 * @param {*} value
 * @param {*} append
 * @return {*}
 */
export const floatText = (value, append = '%') => {
  let strShow = [value, append];
  if (isRTLLanguage() && append !== 'x') {
    strShow = strShow.reverse();
  }
  return strShow.join('');
};

/**
 * @description: 计算开盘以来的涨跌幅
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} openingPrice 开盘价
 * @return {}
 */
export const calcChangeRateAll = (lastTradedPrice, openingPrice) => {
  lastTradedPrice = +lastTradedPrice;
  openingPrice = +openingPrice;
  if (!lastTradedPrice && !openingPrice) return 0;
  return ((lastTradedPrice - openingPrice) / openingPrice).toFixed(4);
};

// 字符串转换为
export function convertBool(checked) {
  if (typeof checked === 'string') {
    if (checked === 'false') {
      checked = false;
    } else if (checked === 'true') {
      checked = true;
    } else {
      checked = Boolean(checked);
    }
  }
  return checked;
}

/**
 * @description: 创建slider的mark
 * @param {*} min
 * @param {*} max
 * @param {*} step
 * @param {*} unit
 * @return {*}
 */
export const createMarks = ({ min, max, step = 1, unit }) => {
  const starter = min;
  const isInteger = max % step === 0;
  const stepNum = Math.floor(max / step);
  const marks = [];
  Array.from({ length: stepNum + 1 }).forEach((_, index) => {
    marks.push({
      value: step * index + starter,
      label: step * index + starter + unit,
    });
  });
  if (!isInteger) {
    marks.push({
      value: max,
      label: max + unit,
    });
  }

  return marks;
};

/**
 * @description:判断form的key是否有错误
 * @param {*} arr
 * @return {boolean}
 */
export const getFormErr = (arr = []) => {
  return arr?.some((el) => el.errors?.length > 0);
};
