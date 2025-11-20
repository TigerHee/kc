/*
 * owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useDispatch } from 'dva';
import { useInitOrder, useInitOrderbook, useOrderBookMaxAmount } from './hooks/useOrderBook';
import { useBarInit } from './hooks/useBar';
import { useSocket, useCheckSocket } from './hooks/useSocket';

const InitOrders = memo(() => {
  useInitOrder();
  return null;
});

const InitHooks = memo(() => {
  const dispatch = useDispatch();
  // 初始化当前深度，深度options
  // useInitDepth(dispatch);
  // 初始化买卖盘数据
  useInitOrderbook(dispatch);
  // 设置数据中最大amount
  useOrderBookMaxAmount();
  // 初始化中间bar
  useBarInit(dispatch);
  // socket
  useSocket();
  useCheckSocket();
  return <InitOrders />;
});

export default InitHooks;
