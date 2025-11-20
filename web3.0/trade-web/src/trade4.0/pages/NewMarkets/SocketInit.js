/*
 * @Owner: Clyne@kupotech.com
 */

import React, { memo } from 'react';
import { useSocket } from './hooks/useSocket';

const SocketInit = memo(() => {
  useSocket();
  return <></>;
});

export default SocketInit;
