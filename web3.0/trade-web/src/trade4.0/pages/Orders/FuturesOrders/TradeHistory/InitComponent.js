/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import useTradeHistoryInit from './useTradeHistoryInit';

const InitComponent = () => {
  useTradeHistoryInit({ active: true });
  return null;
};

export default memo(InitComponent);
