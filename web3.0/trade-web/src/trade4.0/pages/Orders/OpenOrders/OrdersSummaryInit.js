/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 16:40:35
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-26 20:05:45
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OpenOrders/OrdersSummaryInit.js
 * @Description:
 */
import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'dva';
import { FUTURES, SPOT } from '@/meta/const';
import { useOrderStopTableData } from '@/hooks/futures/useOrderStop';
import { useActiveOrderLen } from '@/hooks/futures/useActiveOrder';
import { _t, _tHTML } from 'src/utils/lang';
import { add } from 'lodash';

// 查询当前委托和高级委托的数量
export default memo(({ justShowTitle }) => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const tradeType = useSelector((state) => state.trade.tradeType);
  const isCurrentSymbol = useSelector((state) => state.orderCurrent.filters.symbol);
  const activeOrderCount = useSelector((state) => state.orderCurrent.activeOrderCount);
  const twapOrderTotalNum = useSelector((state) => state.orderTwap.totalNum);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);

  const currentLength = useActiveOrderLen();
  const stopOrders = useOrderStopTableData();
  const stopLength = stopOrders.length;

  const activeOrderAndTwapOrderCount = useMemo(() => {
    if (tradeType !== SPOT) return activeOrderCount;
    // 现货类型 下 活跃订单 累加twap 订单
    return add(activeOrderCount, twapOrderTotalNum || 0);
  }, [activeOrderCount, twapOrderTotalNum, tradeType, isCurrentSymbol, currentSymbol]);

  useEffect(() => {
    if (tradeType === FUTURES) {
      const totalNum = add(currentLength, stopLength);
      dispatch({
        type: 'orderCurrent/update',
        payload: {
          activeOrderCount: totalNum,
        },
      });
    }
  }, [dispatch, tradeType, currentLength, stopLength]);

  useEffect(() => {
    if (isLogin && tradeType !== FUTURES) {
      // 立刻
      dispatch({
        type: 'orderCurrent/queryOrdersSummary@polling',
      });

      dispatch({
        type: 'orderTwap/queryOrderSummary',
      });

      return () => {
        dispatch({
          type: 'orderCurrent/queryOrdersSummary@polling:cancel',
        });
      };
    }
  }, [isLogin, dispatch, tradeType, isCurrentSymbol, currentSymbol]);

  if (justShowTitle) return _t('orders.c.order.cur');
  return (
    <div>
      {_t('orders.c.order.cur')} (
      {isNaN(activeOrderAndTwapOrderCount) ? 0 : activeOrderAndTwapOrderCount})
    </div>
  );
});
