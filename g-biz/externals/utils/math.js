/**
 * Owner: iron@kupotech.com
 */
import Big from 'bignumber.js';
import { numberFormat as kuxNumberFormat } from '@kux/mui/utils';

export function multiply(x, y, dp = 8, round = Big.ROUND_DOWN) {
  return new Big(x).multipliedBy(y).toFixed(dp, round);
}

export function toPercent(n, lang = 'en_US') {
  if (typeof +n !== 'number' || Number.isNaN(+n)) {
    return n;
  }

  // bignumber.js 的 toFixed 会保留默认的精度
  const ret = new Big(n).toFixed();

  // kuxNumberFormat 内部会乘以100
  return kuxNumberFormat({ number: +ret, lang, options: { style: 'percent' } });
}

// 去掉 toFixed 后小数后几位 0
// export function dropZero(n) {
//   return parseFloat(n).toString();
// }
export function dropZero(str) {
  if (!str && str !== 0) return '-';
  let stringV;
  try {
    stringV = str.toString(); // 解决返回Decimal
  } catch (e) {
    stringV = str;
  }
  const e = new Big(stringV);
  return e.toFixed();
}

// 千分位分割
export function withCommas(n) {
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * 格式化数字，展示优化
 *
 * @param {*} n 需要格式化的数字
 * @param {*} { dp = 0, commas = true, keepZero = false }
 * 配置参数
 *  dp 需要保留的小数位数，默认 0
 *  commas 是否需要进行千分位转化, 默认 true
 *  keepZero 是否保留小数末尾的 0，默认 false
 */
export function formatNumber(n, { dp = 0, commas = true, keepZero = false }) {
  if (typeof +n !== 'number' || Number.isNaN(+n)) {
    return n;
  }
  n = n.toString();
  n = new Big(n).toFixed(dp, Big.ROUND_DOWN);

  if (!keepZero) {
    n = dropZero(n);
  }

  if (commas) {
    n = withCommas(n);
  }

  return n;
}

export const cusCoinPrecision = (coin, value, needSeparateNumber = true, lang = 'en_US') => {
  const customCoinDict = {
    BTC: { precision: 8 },
    KCS: { precision: 8 },
    USDT: { precision: 2 },
    USDC: { precision: 2 },
  };
  const coinObj = customCoinDict[coin];
  let num = new Big(value);
  num = num.decimalPlaces(coinObj.precision, Big.ROUND_DOWN); // 舍去多余的小数位
  num = num.toFixed(coinObj.precision);

  return needSeparateNumber ? kuxNumberFormat({ number: +num, lang }) : num;
};
