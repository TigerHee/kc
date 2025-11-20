/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import useOrderHistoryInit from './useOrderHistoryInit';

const InitComponent = () => {
  useOrderHistoryInit({ active: true });
  return null;
};

export default memo(InitComponent);
