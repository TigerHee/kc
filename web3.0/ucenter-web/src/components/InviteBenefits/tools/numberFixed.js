/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/tools/numberFixed.js
 */
import Decimal from 'decimal.js';

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
export default (v, decimal, round = Decimal.ROUND_DOWN) => {
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
