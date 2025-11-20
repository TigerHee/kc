/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import { formatNumberKMB } from '@/utils/format';

const BigNumberTransform = ({ value, options = {} }) => {
  return <>{formatNumberKMB(value, options)}</>;
};
export default BigNumberTransform;
