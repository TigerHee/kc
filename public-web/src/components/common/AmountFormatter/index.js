/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { divide, formatNumber } from 'helper';

const AmountFormatter = ({ value }) => {
  const handleMarkCap = (target) => {
    let markCap;
    if (target < 1000000) {
      return formatNumber(target, 2);
    }
    if (target < 10 ** 9) {
      markCap = divide(target, 1000000, 2);
      return markCap + 'M';
    }
    if (target < 10 ** 12) {
      markCap = divide(target, 10 ** 9, 2);
      return markCap + 'B';
    }
    if (target < 10 ** 15) {
      markCap = divide(target, 10 ** 12, 2);
      return markCap + 'T';
    }
    markCap = divide(target, 10 ** 15, 2);
    return markCap + 'P';
  };
  return <React.Fragment>{value ? handleMarkCap(value) : '--'}</React.Fragment>;
};

export default AmountFormatter;
