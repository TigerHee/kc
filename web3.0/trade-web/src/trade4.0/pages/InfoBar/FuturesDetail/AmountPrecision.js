/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { formatNumber } from 'src/trade4.0/utils/futures';

const AmountPrecision = (props) => {
  const { value, pointed = true, dropZ = false, ...others } = props;
  return <React.Fragment>{formatNumber(value, { pointed, ...others })}</React.Fragment>;
};
export default AmountPrecision;
