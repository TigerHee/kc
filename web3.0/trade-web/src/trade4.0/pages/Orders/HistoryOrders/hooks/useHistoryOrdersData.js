/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:18:55
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-02 21:25:28
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/HistoryOrders/hooks/useHistoryOrdersData.js
 * @Description:
 */
import { useSelector } from 'dva';
import { checkIsMargin } from '@/meta/tradeTypes';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import orderTwapHistory from 'src/models/orders/orderTwapHistory';

export const useHistoryOrderProps = () => {
  const userPosition = useSelector((state) => state.marginMeta.userPosition);
  const tradeType = useSelector((state) => state.trade.tradeType);
  const orderHistoryFilters = useSelector((state) => state.orderHistory.filters) || {};
  const orderTwapHistoryFilters = useSelector((state) => state.orderTwapHistory.filters) || {};
  const isMargin = checkIsMargin(tradeType);
  const isLogin = useSelector((state) => state.user.isLogin);
  const currentSymbol = useGetCurrentSymbol();

  const tabObj = {
    orderHistory: orderHistoryFilters,
    orderTwapHistory: orderTwapHistoryFilters,
  };

  return {
    isMargin,
    tradeType,
    userPosition,
    tabObj,
    isLogin,
    currentSymbol,
  };
};
