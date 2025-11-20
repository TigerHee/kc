/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-10-11 20:55:00
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-01 15:39:37
 * @FilePath: /trade-web/src/trade4.0/components/QuickOrder/useQuickOrderState.js
 * @Description:
 */

import { ISOLATED, MARGIN, SPOT } from '@/meta/const';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getSymbolAuctionInfo } from '@/utils/business';
import { useSelector } from 'dva';
import { useMemo } from 'react';
import { isSystemMaintenance } from 'utils/noticeUtils';

const useQuickOrderState = () => {
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const currentTradeType = useSelector((state) => state.trade.tradeType);
  const currentTradeMode = useSelector((state) => state.trade.tradeMode);
  const tradeFormMaintenanceStatus = useSelector((state) => state.tradeForm.maintenanceStatus);
  const settingQuickOrderVisible = useSelector((state) => state.setting.quickOrderVisible);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const coinPair = currentSymbol;
  const symbolAuctionInfo = getSymbolAuctionInfo(
    symbolsMap?.[coinPair],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
  const { previewEnableShow, showAuction } = symbolAuctionInfo;
  const stopTrade = isSystemMaintenance(tradeFormMaintenanceStatus, coinPair);
  const notQuickOrder = stopTrade || !!showAuction || !!previewEnableShow;
  const quickOrderVisible = settingQuickOrderVisible;
  const { checkIsForbiddenTrade } = TRADE_TYPES_CONFIG.TRADE || {};
  const isForbidden = useMemo(() => {
    if (typeof checkIsForbiddenTrade !== 'function') return true;
    return checkIsForbiddenTrade({
      symbolsMap,
      currentSymbol,
    });
  }, [checkIsForbiddenTrade, symbolsMap, currentSymbol]);

  return useMemo(() => {
    const isQuickOrderEnable =
      !isForbidden &&
      !notQuickOrder &&
      currentTradeMode === 'MANUAL' &&
      [SPOT, MARGIN, ISOLATED].includes(currentTradeType);
    return {
      isQuickOrderEnable, // 是否可以展示快速下单浮动窗
      quickOrderVisible, // setting 面板switch状态
    };
  }, [quickOrderVisible, isForbidden, notQuickOrder, currentTradeType, currentTradeMode]);
};

export default useQuickOrderState;
