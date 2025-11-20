/*
 * owner: borden@kupotech.com
 */
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import useShowMarginMask from '@/hooks/useShowMarginMask';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getSymbolAuctionInfo } from '@/utils/business';
import styled from '@emotion/styled';
import { useSelector } from 'dva';
import React from 'react';
import { isSymbolMaintenance } from 'src/utils/noticeUtils';
import EtfMask from './EtfMask';
import TradeNotEnabledMask from './TradeNotEnabledMask';

export const Container = styled.div`
  position: relative;
`;

const TradeMask = React.memo(({ children }) => {
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const etfOpenFlag = useSelector((state) => state.leveragedTokens.openFlag);
  const maintenanceStatus = useSelector((state) => state.tradeForm.maintenanceStatus);
  const isolatedSymbolsMap = useSelector((state) => state.symbols.isolatedSymbolsMap);

  const { checkIsForbiddenTrade = () => true } = TRADE_TYPES_CONFIG[tradeType] || {};

  const isForbidden = checkIsForbiddenTrade({
    symbolsMap,
    currentSymbol,
    isolatedSymbolsMap,
  });
  const isMaintenance = isSymbolMaintenance(maintenanceStatus, currentSymbol);

  const MarginMask = useShowMarginMask();

  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { previewEnableShow } = getSymbolAuctionInfo(
    symbolsMap[currentSymbol],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  const showEtfMask =
    symbolsMap[currentSymbol] &&
    symbolsMap[currentSymbol].type === 'MARGIN_FUND' &&
    etfOpenFlag === false;
  // 冻结或者停机维护
  if ((isForbidden || isMaintenance) && !previewEnableShow) {
    return <TradeNotEnabledMask announcement={maintenanceStatus} />;
  }

  // 杠杆开通引导
  if (MarginMask) {
    return <MarginMask />;
  }

  // 杠杆代币开通引导
  if (showEtfMask) {
    return <EtfMask />;
  }

  return <Container>{children}</Container>;
});

export default TradeMask;
