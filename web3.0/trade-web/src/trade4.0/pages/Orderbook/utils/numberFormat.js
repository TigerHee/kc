/**
 * Owner: clyne@kupotech.com
 * tips: numberFormat存在性能问题，对于高频render的买卖盘用以前老的api
 */
import Decimal from 'decimal.js';
import { isFinite, isNaN } from 'lodash';
import {
  dividedBy,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
} from '../../OrderForm/FuturesFormNew/builtinCommon';
import { roundByStep } from 'src/trade4.0/utils/format';

export const dropZero = (str) => {
  if (!str) return '-';
  const e = new Decimal(str);
  return e.toFixed();
};

/**
 * 格式化数字
 */
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
      exactValue = thousandPointed(exactValue);
    }
    return exactValue;
  } else {
    return value;
  }
};

/**
 * 整数部分千位分割符
 */
export const thousandPointed = (value, keepDot) => {
  const reg = /\B(?=(\d{3})+\b)/g;
  const [integerPart, decimalPart] = `${value}`.split('.');
  const integerPartPointed = integerPart.replace(reg, ',');
  if (!decimalPart && keepDot && `${value}`.includes('.')) {
    return `${integerPartPointed}.`;
  }

  return `${integerPartPointed}${decimalPart ? `.${decimalPart}` : ''}`;
};

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

window.formatNumberKMB = formatNumberKMB;
