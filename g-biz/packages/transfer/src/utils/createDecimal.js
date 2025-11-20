import BigNumber from 'bignumber.js';

const createDecimals = (decimalPrecision) => {
  const decimals = [];
  const maxDecimalPrecision = new BigNumber(decimalPrecision);
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: new BigNumber(10).pow(maxDecimalPrecision.minus(decimalPrecision)),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};

export default createDecimals;
