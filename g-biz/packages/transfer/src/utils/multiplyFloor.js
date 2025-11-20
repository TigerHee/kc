import BigNumber from 'bignumber.js';

// 设置舍入模式为向下舍入
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

/**
 * @description 高精度乘法并取给定位数向下取整
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
const multiplyFloor = (a, b, decimal = 8) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new BigNumber(a).times(b).toFixed(decimal);
};

export default multiplyFloor;
