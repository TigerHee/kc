/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import Price from './Price';
import LastPrice from './LastPrice';
import { Wrapper, PriceContent } from './style';
import { useEtfCoin } from 'src/utils/hooks';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';

// ADL，指数价格做好了的，后面合约接入放开注释
const Bar = () => {
  const isShow = useEtfCoin();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const { indexPricePrecision } = useGetCurrentSymbolInfo();
  return (
    <Wrapper className="orderbook-bar">
      <LastPrice className="bar" />
      <div className="bar-left">
        <PriceContent>
          <Price dataKey="markPrice" tips="isolated.markPrice.desc" fixed={indexPricePrecision} />
          <Price
            dataKey="indexPrice"
            tips="trade.orderbook.indexPrice.desc"
            fixed={indexPricePrecision}
          />
          {isShow && !isFutures ? (
            <Price dataKey="netAssets" tips="etf.netAssetValue.tip" />
          ) : (
            <></>
          )}
        </PriceContent>
      </div>
    </Wrapper>
  );
};

export default Bar;
