/**
 * Owner: willen@kupotech.com
 */
export default (decimalPrecision) => {
  const maxDecimalPrecision = 10;
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
