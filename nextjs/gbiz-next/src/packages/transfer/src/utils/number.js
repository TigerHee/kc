import BigNumber from 'bignumber.js';

const maxPrecision = 8;

const isEmpty = (str) => {
  return str === undefined || str === null || Number.isNaN(str) || str === '';
};

// 从步长获取精度
const getPrecisionFromIncrement = (increment) => {
  if (!increment) return maxPrecision;
  if (typeof increment === 'number') {
    increment = new BigNumber(increment).toFixed();
  }
  const decimalsArr = (increment || '').split('.');
  if (decimalsArr.length > 1) {
    return decimalsArr[1].length;
  }
  return 0;
};
/**
 * 格式化币种精度，多余0会被移除,最低显示2位小数
 * @param {*} num
 * @param {*} pre 精度
 * @param {*} fixZero 是否默认补0
 * @returns
 */
export const setNumToPrecision = (num, pre, { fixZero = true, fixLength = 2 } = {}) => {
  if (isEmpty(num)) return num;
  try {
    // 如果toFixed后值相等，如 0.01 fixed 8位后 0.01000000 则返回 0.01(不显示多余0)
    // 有精度传入，使用向下取整
    const originalRoundingMode = BigNumber.config().ROUNDING_MODE;
    if (pre !== undefined) {
      BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
    }
    let fixedResult = new BigNumber(num || 0).toFixed(pre);
    if (pre !== undefined) {
      BigNumber.config({ ROUNDING_MODE: originalRoundingMode });
    }
    const noZeroResult = new BigNumber(fixedResult).toFixed();
    const isEqual = new BigNumber(fixedResult).isEqualTo(noZeroResult);

    if (new BigNumber(num || 0).isEqualTo(fixedResult) || isEqual) {
      fixedResult = noZeroResult;
    }
    if (fixZero) {
      const precision = getPrecisionFromIncrement(fixedResult);
      if (precision < fixLength) {
        fixedResult = new BigNumber(fixedResult).toFixed(fixLength);
      }
    }
    return fixedResult;
  } catch (e) {
    console.error(e);
  }
  return num;
};

export const safeBigNumber = (func, defaultValue = '--') => {
  try {
    return func(BigNumber);
  } catch {
    return defaultValue;
  }
};

export const minus = (a, b) => {
  return BigNumber(a)
    .minus(b)
    .toString();
};

export const max = (...numbers) => {
  return numbers.reduce((max, current) => (BigNumber(max).isGreaterThan(current) ? max : current));
};

export const min = (...numbers) => {
  return numbers.reduce((min, current) => (BigNumber(min).isLessThan(current) ? min : current));
};
