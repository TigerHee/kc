/**
 * Owner: willen@kupotech.com
 */
export default (decimalPrecision: number) => {
  const maxDecimalPrecision = 10;
  const decimals: { length: number; group: number }[] = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: Math.pow(10, maxDecimalPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};
