/**
 * Owner: solar@kupotech.com
 */
import Big from 'bignumber.js';

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
const numberFixed = (v, decimal, round = Big.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Big(stringV).toFixed(decimal, round);
};

export default numberFixed;
