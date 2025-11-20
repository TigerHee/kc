/*
 * @owner: charles.yang@kupotech.com
 * @desc: tradeType是合约的时候，需要全局init 仓位数据，条件委托，当前委托
 */
import { useEffect } from 'react';
import { useInitActiveOrder, useActiveOrderSubscribe } from '@/hooks/futures/useActiveOrder';
// eslint-disable-next-line max-len
import useAdvancedOrdersInit from '@/pages/Orders/FuturesOrders/AdvancedOrders/useAdvancedOrdersInit';
// eslint-disable-next-line max-len
import { useInit as usePositionsInit } from '@/pages/Orders/FuturesOrders/NewPosition/hooks/useInit';

export default function useFuturesOrdersInit() {
  useActiveOrderSubscribe();
  useInitActiveOrder();
  useAdvancedOrdersInit();
  usePositionsInit();
}
