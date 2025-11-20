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
 */
export default (a: Decimal.Value, b: Decimal.Value, decimal = 8, round = Decimal.ROUND_FLOOR) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }

  // if (isNaN(a) || isNaN(b)) {
  //   return '0';
  // }

  return new Decimal(a).mul(b).toFixed(decimal || 8, round);
};
