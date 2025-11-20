/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:18:55
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-19 22:22:04
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OpenOrders/hooks/useOpenOrdersData.js
 * @Description:
 */
import { useSelector } from 'dva';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

export const useOpenOrderProps = () => {
  const orderStopSymbol = useSelector((state) => state.orderStop.filters?.symbol) || false;
  const orderCurrentSymbol = useSelector((state) => state.orderCurrent.filters?.symbol) || false;
  const orderTwapSymbol = useSelector((state) => state.orderTwap.filters?.symbol) || false;
  const isLogin = useSelector((state) => state.user.isLogin);
  const tradeType = useSelector((state) => state.trade.tradeType);
  const currentSymbol = useGetCurrentSymbol();

  const tabObj = {
    orderStop: orderStopSymbol,
    orderCurrent: orderCurrentSymbol,
    orderTwap: orderTwapSymbol,
  };

  return {
    tradeType,
    tabObj,
    isLogin,
    currentSymbol,
  };
};
const noop = [];
// 获取当前委托
export const useGetOrderCurrent = () => {
  return useSelector((state) => state.orderCurrent?.records || noop);
};
