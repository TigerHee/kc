/**
 * Owner: iron@kupotech.com
 */
import Decimal from 'decimal.js';
/**
 * @description 高精度乘法并取给定位数向下取整
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export default (a, b, decimal = 8, round = Decimal.ROUND_FLOOR) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    return 0;
  }
  return new Decimal(a).mul(b).toFixed(decimal, round);
};
