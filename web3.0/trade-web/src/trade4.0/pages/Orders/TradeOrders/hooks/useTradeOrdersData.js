/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:18:55
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-01 20:49:13
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/TradeOrders/hooks/useHistoryOrdersData.js
 * @Description:
 */
import { useSelector } from 'dva';
import { checkIsMargin } from '@/meta/tradeTypes';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

export const useTradeOrderProps = () => {
  const userPosition = useSelector((state) => state.marginMeta.userPosition);
  const tradeType = useSelector((state) => state.trade.tradeType);
  const orderDealDetail = useSelector((state) => state.orderDealDetail) || {};
  const isMargin = checkIsMargin(tradeType);
  const isLogin = useSelector((state) => state.user.isLogin);
  const currentSymbol = useGetCurrentSymbol();

  const tabObj = {
    orderDealDetail: orderDealDetail.filters,
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
