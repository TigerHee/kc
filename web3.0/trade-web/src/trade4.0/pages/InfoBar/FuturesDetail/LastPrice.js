/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';

import { useLastPrice } from 'src/trade4.0/hooks/futures/useMarket';
import { useGetCurrentSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { useDetailData } from './hooks/useDetail';

import PriceInfo from './PriceInfo';

import { getDigit } from 'src/helper';

const LastPrice = () => {
  const { symbol, tickSize } = useGetCurrentSymbolInfo();
  const LP = useLastPrice(symbol);
  const changeRate = useDetailData('priceChgPct');
  const changePrice = useDetailData('priceChg');
  const lastTradePrice = useDetailData('lastTradePrice');
  const price = LP === '0' ? lastTradePrice : LP;
  return (
    <PriceInfo
      className="item-list"
      changeRate={changeRate}
      price={price}
      changePrice={changePrice}
      fixed={getDigit(tickSize)}
    />
  );
};

export default LastPrice;
