/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import useRealizedPNLInit from './useRealizedPNLInit';

const InitComponent = () => {
  useRealizedPNLInit();
  return null;
};

export default memo(InitComponent);
