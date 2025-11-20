/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import {storage} from '@krn/toolkit';
import Decimal from 'decimal.js';
import moment from 'moment';
import {openNative} from '@krn/bridge';

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

export const isUndef = v => [null, undefined, '', NaN].includes(v);

export const dropZero = str => {
  if (isUndef(str)) return '-';
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
 * 高精度除法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divide = (a, b, decimal = 8, round = Decimal.ROUND_HALF_UP) => {
  try {
    if (!a || !b) {
      return 0;
    }
    if (+b === 0) {
      // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
      return 0;
    }
    return dropZero(new Decimal(a).div(b).toFixed(decimal, round));
  } catch (error) {
    return 0;
  }
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
  try {
    if (!a || !b) {
      return 0;
    }
    if (+b === 0) {
      // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
      return 0;
    }
    return dropZero(new Decimal(a).mul(b).toFixed(decimal, round));
  } catch (error) {
    return 0;
  }
};

/**
 * 千分分隔符
 * @param {String} str
 * @returns
 */
export function digitGrouped(str) {
  if (!str) return '';
  const arr = str.toString().split('.');
  const int = arr[0].replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
    return $1 + ',';
  });
  return int + (typeof arr[1] === 'string' ? `.${arr[1]}` : '');
}

export function digitUngrouped(str) {
  if (!str) return '';
  const arr = str.toString().split('.');
  return (
    String(arr[0]).replace(/\$\s?|(,*)/g, '') +
    (typeof arr[1] === 'string' ? `.${arr[1]}` : '')
  );
}

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

export const inputParser = str => {
  if (!str || isNaN(+str.toString().replace(/\$\s?|(,*)/g, ''))) return str;
  return digitUngrouped(str);
};

export const delay = (ms = 100, data = {}) =>
  new Promise(resolve => setTimeout(() => resolve(data), ms));

/**
 * 切换状态-背景需要闪一下
 * interval 一个状态持续多久
 * count 切换几次
 */
export const changeBackground = async (change, interval = 100, count = 3) => {
  for (let i = 0; i < count; i++) {
    change(true);
    await delay(interval);
    change(false);
    await delay(interval);
  }
};

/**
 * 处理输入框的数字，需要按照精度截取
 */
export const handleInputAmountByPrecision = (amount, precision) => {
  if (!amount) return '';

  // 检查输入中是否已经有小数点
  const hasDecimalPoint = amount.includes('.');
  // 检查输入中是否已经有逗号
  const hasDecimalComma = amount.includes(',');

  if (hasDecimalPoint && hasDecimalComma) {
    amount = amount.replace(',', '');
  }

  if (!hasDecimalPoint && hasDecimalComma) {
    amount = amount.replace(',', '.');
  }

  if (isNaN(amount)) return '';

  // 当输入的数字小数位数超过精度则抛弃超过的部分
  if (amount.indexOf('.') !== -1 && precision) {
    const [int, dec] = amount.split('.');

    amount = int + '.' + dec.substr(0, precision);
  }
  return amount;
};

/**
 * 获取 输入框 title
 * 需要展示预估的展示预估
 */
export const getInputTitle = (
  selfDir,
  shouldDir,
  normalTitle,
  unNormalTitle,
) => {
  return selfDir === shouldDir ? unNormalTitle : normalTitle;
};

/**
 * 取小
 */
export const min = (...params) => {
  try {
    return Decimal.min(...params);
  } catch (error) {
    return 0;
  }
};

/**
 * 等于
 */
export const equals = (v1, v2) => {
  try {
    return new Decimal(v1).equals(v2);
  } catch (error) {
    return false;
  }
};

/**
 * 大于
 */
export const degt = (v1, v2) => {
  try {
    return new Decimal(v1).gt(v2);
  } catch (error) {
    return false;
  }
};

/**
 * 小于
 */
export const delt = (v1, v2) => {
  try {
    return new Decimal(v1).lt(v2);
  } catch (error) {
    return false;
  }
};

/**
 * 大于等于
 */
export const degte = (v1, v2) => {
  try {
    return new Decimal(v1).gte(v2);
  } catch (error) {
    return false;
  }
};

/**
 * 小于等于
 */
export const delte = (v1, v2) => {
  try {
    return new Decimal(v1).lte(v2);
  } catch (error) {
    return false;
  }
};

/**
 * 高精度加法
 * @param a {number|string|Decimal}
 * @param b {number|string|Decimal}
 * @returns {Decimal}
 */
export const add = (a, b) => {
  try {
    return new Decimal(a).add(b);
  } catch (error) {
    return 0;
  }
};

/**
 * 获取某个币种对应账户下的可用额度
 */
export const getCoinAvailableBalance = ({
  coin,
  precision,
  mainMap,
  tradeMap,
  accountType,
  isLogin,
}) => {
  if (!isLogin) return;

  const getAvailableBalance = map => map[coin]?.availableBalance || 0;

  const mainAmount = getAvailableBalance(mainMap);
  const tradeAmount = getAvailableBalance(tradeMap);

  let availableBalance;

  switch (accountType) {
    case 'MAIN':
      availableBalance = mainAmount;
      break;
    case 'TRADE':
      availableBalance = tradeAmount;
      break;
    default:
      availableBalance = add(mainAmount, tradeAmount);
  }

  return isUndef(precision)
    ? dropZero(availableBalance)
    : dropZero(numberFixed(availableBalance, precision));
};

// 打开 h5 链接
export const openLink = async url => {
  const NATIVE_INFO = await getNativeInfo();

  const joinFlag = url.includes('?') ? '&' : '?';

  const _url = `${url}${joinFlag}loading=2&appNeedLang=true`;

  const encodedUrl = encodeURIComponent(
    `https://${NATIVE_INFO.webApiHost}${_url}`,
  );
  openNative(`/link?url=${encodedUrl}`);
};
/**
 * @description: 0.0001==>4转换
 * @param {*} data
 * @return {*}
 */
export const percisionConvert = data => {
  try {
    return String(data).split('.')[1]?.length || 0;
  } catch (error) {
    return 8;
  }
};

const getCurrencyConfig = (currency, invertCurrency, data) => {
  if (currency === 'USDT') {
    return data?.usdtCurrencyLimitMap?.[invertCurrency] || {};
  }
  return data?.normalCurrencyLimitMap?.[currency] || {};
};
// 判断交易对是否被禁用
export const checkSymbolIsDisabled = ({
  orderType,
  symbol,
  to,
  from,
  matchCoinsMap,
}) => {
  try {
    const pair = symbol?.split('-') || [from.coin, to.coin];
    return (
      !_.isEmpty(matchCoinsMap?.[orderType]) &&
      pair.some((v, i) => {
        const ret = getCurrencyConfig(v, pair[1 - i], matchCoinsMap[orderType]);
        return _.isEmpty(ret);
      })
    );
  } catch (e) {
    return false;
  }
};
