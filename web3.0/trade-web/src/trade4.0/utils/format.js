/**
 * Owner: borden@kupotech.com
 */
import Decimal from 'decimal.js';
import {
  greaterThan,
  greaterThanOrEqualTo,
  dividedBy,
  transformParam,
  lessThan,
} from 'utils/operation';
import { intlFormatNumber } from '@/hooks/common/useIntlFormat';

const T = 1000000000000; // 万亿 1,000,000,000,000
const B = 1000000000; // 十亿 1,000,000,000
const M = 1000000; // 百万 1,000,000
const K = 1000; // 千

const FORMAT_THREE = ['T', 'B'];
export const formatNumberKMB = (
  value,
  { minStep = 0.01, showMinStep = true, fixed, formatProps = {} } = {},
) => {
  let resultUnit = '';
  if (isNaN(value) || isNaN(+value)) return '-';
  if (minStep !== -1 && showMinStep) {
    if (greaterThan(minStep)(value)) {
      return `<${minStep}`;
    }
  }
  let calcRet = value;
  // 是否大于10亿
  if (greaterThanOrEqualTo(value)(T)) {
    calcRet = dividedBy(value)(T).toString();
    resultUnit = 'T';
  } else if (greaterThanOrEqualTo(value)(B)) {
    calcRet = dividedBy(value)(B).toString();
    resultUnit = 'B';
  } else if (greaterThanOrEqualTo(value)(M)) {
    calcRet = dividedBy(value)(M).toString();
    resultUnit = 'M';
  } else if (greaterThanOrEqualTo(value)(K)) {
    calcRet = dividedBy(value)(K).toString();
    resultUnit = 'K';
  } else {
    resultUnit = '';
  }

  const KMBFixed = FORMAT_THREE.includes(resultUnit) ? 3 : 2;

  return `${formatNumber(calcRet, {
    pointed: true,
    fixed: resultUnit ? KMBFixed : fixed,
    dropZ: false,
    ...formatProps,
  })}${resultUnit}`;
};

export const dropZero = (str) => {
  if (!str) return '-';
  const e = new Decimal(str);
  return e.toFixed();
};

/**
 * 根据步长展示数字
 */

export const roundByStep = (
  value,
  { step, noRound = false, round: _round = Decimal.ROUND_DOWN },
) => {
  if (noRound) {
    return new Decimal(step).mul(new Decimal(value).dividedBy(step));
  }
  return new Decimal(step).mul(new Decimal(value).dividedBy(step).toFixed(0, _round));
};

/**
 * 格式化数字
 */
// TODO 合约默认 Decimal.ROUND_HALF_UP 使用formatNumber需处理round ！！
// TIPS: 合约后续格式化，使用 futures makeNumber/formatNumber，round 默认传入四舍五入
export const formatNumber = (
  value,
  { fixed, step, round: _round, negate = false, pointed = true, dropZ = true } = {},
) => {
  if (!value) {
    return 0;
  }

  let exactValue = +value;

  if (isFinite(exactValue)) {
    if (lessThan(fixed)(0)) {
      exactValue = roundByStep(exactValue, { step, noRound: true });
    } else if (fixed || fixed === 0) {
      exactValue = new Decimal(exactValue).toFixed(fixed, _round || Decimal.ROUND_DOWN);
    }

    if (negate) {
      exactValue *= -1;
    }

    if (dropZ) {
      exactValue = dropZero(exactValue);
    }
    if (pointed) {
      exactValue = intlFormatNumberTransfer({ value: exactValue, dropZ });
    }
    return exactValue;
  } else {
    return value;
  }
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
    return formatNumber(value, { dropZ: false });
  }

  return formatNumber(value, { fixed: 2, dropZ: false });
};

/**
 * 整数部分千位分割符
 */
export const thousandPointed = (value) => {
  return intlFormatNumberTransfer({
    value: Decimal.isDecimal(value) ? value.toFixed() : value,
  });
};

/**
 * 科学计数法转数字字符串
 */
export const toNonExponential = (a) => {
  try {
    let value = a;
    if (Decimal.isDecimal(a)) {
      value = a.toString();
    }
    const isExponential = /\d(?:.(\d*))?e([+-]\d+)/.test(value);
    if (!isExponential) return value;
    const _a = transformParam(value);
    return _a.toFixed();
  } catch (e) {
    console.log(e);
    return a;
  }
};

// 去掉纳秒
export const transUnix = (time) => {
  return `${time}`.slice(0, 13);
};

// 处理数字过大的展示
export const numberResolve = (num, pre = 8) => {
  let _pre = pre;
  if (num > 1e5 && num < 1e6) {
    _pre = 1;
  } else if (num >= 1e6) {
    _pre = 2;
  } else if (num >= 1e9) {
    _pre = 2;
  } else if (num >= 1e12) {
    _pre = 2;
  } else {
    // 不足1e5显示千分位
    return formatNumber(num, { fixed: _pre });
  }
  return intlFormatNumberTransfer({
    value: num,
    precision: _pre,
    options: { notation: 'compact' },
  });
};

/**
 * 判断是否满足最小精度
 * @param {any} val
 * @param {number} step
 */
export const isMinStep = (val, step) => {
  return +Decimal.mod(val, step || 1).toFixed() === 0;
};

/**
 * 转换成百分比
 * @param {*} num
 */
export const floadToPercent = (num, { isPositive = true, precision, dropZ = true } = {}) => {
  if (typeof +num !== 'number' || Number.isNaN(+num)) {
    return num;
  }

  return intlFormatNumberTransfer({
    value: num,
    options: { style: 'percent' },
    isPositive,
    dropZ,
    precision,
  });
};

/**
 * 使用组件库方法处理金融数字
 */
export const intlFormatNumberTransfer = ({
  value,
  dropZ = false,
  precision,
  options,
  ...others
}) => {
  const _options = { ...options };
  if (precision || precision === 0) {
    _options.maximumFractionDigits = precision;
  }
  // 不去0处理
  if (!dropZ) {
    if (precision) {
      _options.minimumFractionDigits = precision;
    } else {
      const arr = `${value}`?.split('.');
      if (arr && arr[1]) {
        _options.minimumFractionDigits = arr[1].length;
      }
    }
  }
  return intlFormatNumber({ number: value, options: _options, ...others });
};

/**
 * 获取数目展示值(处理小于精度但大于0的情形)
 */
export const formatLittleSize = (params) => {
  const { value, withSign, fixed = 8, ...other } = params || {};
  if ([value, fixed].every((v) => isFinite(v) && v !== null)) {
    const absValue = Decimal.abs(value);
    const minStep = new Decimal(10).pow(-fixed).toFixed();
    if (greaterThan(absValue)(0) && greaterThan(minStep)(absValue)) {
      return `< ${minStep}`;
    }
    const sign = withSign && +value > 0 ? '+' : '';
    const ret = formatNumber(value, { fixed, ...other });
    return `${sign}${ret}`;
  }
  return value;
};

/**
 * 获取百分比展示值(处理小于精度但大于0的情形)
 */
export const formatLittlePercent = (params) => {
  const { value, precision = 2, ...other } = params || {};
  if ([value, precision].every((v) => isFinite(v) && v !== null)) {
    const absValue = Decimal.abs(value);
    // 小数精度 = 百分数精度 + 2
    const floatPrecision = new Decimal(precision).add(2).toNumber();
    const minStep = new Decimal(10).pow(-floatPrecision).toFixed();
    if (greaterThan(absValue)(0) && greaterThan(minStep)(absValue)) {
      return `< ${floadToPercent(minStep, { precision, ...other, isPositive: false })}`;
    }
    // 格式化了精度再传给 Intl, 避免Intl取整在部分浏览器不兼容的情形
    return floadToPercent(formatNumber(value, { fixed: floatPrecision, pointed: false }), {
      precision,
      ...other,
    });
  }
  return value;
};

/**
 * prd : https://k-devdoc.atlassian.net/wiki/spaces/XHPT/pages/289932754
 * 如果展示的价格或者数量，若实际数据不为0，但是按照展示精度的要求因此为零时，此时数量展示为： <数量步长  价格展示为<价格步长
 *
 */
export const lessThanMinValue = (value, precision) => {
  const minValue = new Decimal(10).pow(-precision).toFixed();
  const absValue = Decimal.abs(value);
  if (lessThan(absValue)(minValue) && greaterThan(absValue)(0)) {
    return `${value > 0 ? '< ' : '> -'}${minValue}`;
  } else {
    return false;
  }
};
