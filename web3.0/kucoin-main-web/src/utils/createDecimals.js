/**
 * Owner: willen@kupotech.com
 */
import { maxDecimalPrecision } from 'config/base';

const createDecimals = (decimalPrecision) => {
  const decimals = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: Math.pow(10, maxDecimalPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};
export default createDecimals;
