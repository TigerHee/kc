/*
 * @owner: clyne@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { useSelector, shallowEqual } from 'dva';
import { name as orderBookName } from '@/pages/Orderbook/config';
import { name as recentTradeName } from '@/pages/RecentTrade/config';
import { name as depthName } from '@/pages/Depth/config';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { FUTURES } from 'src/trade4.0/meta/const';
import { getSingleModule } from '@/layouts/utils';
import useQuickOrderState from '@/components/QuickOrder/useQuickOrderState';

export default function useComponentsInit() {
  const { lg } = useResponsive();
  const { isSingle } = getSingleModule();
  const { isQuickOrderEnable, quickOrderVisible } = useQuickOrderState();
  // 买卖盘,实时交易，深度图依赖
  const { hasOrderbook, hasRecentTrade, hasDepth, isRecentTradeShow, isFutures } = useSelector(
    (state) => {
      const { tradeType } = state.trade;
      const _isFutures = tradeType === FUTURES;
      const mapData = state.setting?.inLayoutIdMap || {};
      return {
        hasOrderbook:
          undefined !== mapData[orderBookName] ||
          (lg && isQuickOrderEnable && quickOrderVisible && !isSingle) ||
          (TRADE_TYPES_CONFIG[tradeType]?.needCheckBPP && mapData.orderForm),
        hasRecentTrade: undefined !== mapData[recentTradeName],
        hasDepth: undefined !== mapData[depthName],
        isRecentTradeShow: mapData[recentTradeName],
        isFutures: _isFutures,
      };
    },
    shallowEqual,
  );

  const spotRecentTradeInit = hasDepth || hasOrderbook || hasRecentTrade;

  // 合约这里初始化只跟显示隐藏相关，现货有数据以来
  const isRecentTradeInit = isFutures ? isRecentTradeShow : spotRecentTradeInit;
  return {
    // 依赖于：用 -> 表示
    // 深度图 -> 买卖盘
    isOrderBookInit: hasDepth || hasOrderbook,
    // 深度图 -> 买卖盘 -> 实时成交
    isRecentTradeInit,
  };
}
