import BigNumber from 'bignumber.js';

const dropZero = (str) => {
  if (!str) return '-';
  const e = new BigNumber(str);
  return e.toFixed();
};

export default dropZero;
