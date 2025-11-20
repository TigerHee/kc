/*
 * owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useDispatch } from 'dva';
import { useInit } from './hooks/useInit';
import { useSocket } from './hooks/useSocket';

const InitHooks = memo(() => {
  const dispatch = useDispatch();
  // 初始化数据
  useInit(dispatch);
  // socket
  useSocket(dispatch);
  return null;
});

export default InitHooks;
