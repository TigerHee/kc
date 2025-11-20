/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { namespace } from '@/pages/Chart/config';
import { useTradePreview } from '@/pages/Chart/hooks/useTradePreview';
import { getSymbolAuctionInfo } from '@/utils/business';
import { useSelector } from 'dva';
import Multi from './Multi';
import Normal from './Normal';
import { PreviewWrapper } from './style';

const TradePreview = ({ symbol, tradeType }) => {
  const boxCount = useSelector((state) => state[namespace].boxCount);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { symbolInfo, coinSummary, iconUrl } = useTradePreview({ symbol, tradeType });

  if (
    !getSymbolAuctionInfo(symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap)
      .previewEnableShow
  ) {
    return null;
  }

  return (
    <PreviewWrapper>
      {boxCount === '1' ? (
        <Normal
          symbol={symbol}
          symbolInfo={symbolInfo}
          coinSummary={coinSummary}
          iconUrl={iconUrl}
        />
      ) : (
        <Multi symbol={symbol} symbolInfo={symbolInfo} />
      )}
    </PreviewWrapper>
  );
};
export default TradePreview;
