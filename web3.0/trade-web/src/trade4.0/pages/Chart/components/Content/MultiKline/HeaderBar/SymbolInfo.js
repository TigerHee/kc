/**
 * Owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { isNil } from 'lodash';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import SymbolText from '@/components/SymbolText';
import { useSymbolPrice } from '@/pages/Chart/hooks/useKlineSymbols';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';
import { getCoinInfo } from '@/hooks/common/useCoin';
// import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import ChangeRender from '@/components/ChangeRender';
import ChangingNumber from '@/components/ChangingNumber';
import { toNonExponential, formatNumber } from '@/utils/format';
import { useMarketInfoForSymbol } from '@/hooks/futures/useMarket';
import { LazyImage } from '@/components/LazyBackground';
import { Change, MarketInfo, SymbolWrapper } from './style';

const InfoContent = memo(({ iconUrl, symbolCode, lastPrice, changeRate }) => {
  const priceChangeColor = usePriceChangeColor();

  return (
    <MarketInfo className="no-scrollbar">
      <SymbolWrapper>
        <LazyImage src={iconUrl} alt="coin-icon" />
        <span sir="ltr">{symbolCode()}</span>
      </SymbolWrapper>
      <ChangingNumber value={lastPrice} {...priceChangeColor} showIcon={false} showBgArea={false}>
        {isNil(lastPrice) ? '--' : lastPrice ? `${formatNumber(toNonExponential(lastPrice))}` : '0'}
      </ChangingNumber>

      <Change>
        <ChangeRender value={changeRate} withPrefix={changeRate > 0} />
      </Change>
    </MarketInfo>
  );
});

const SymbolInfo = memo(({ symbol }) => {
  const { iconUrl } = getCoinInfo({ symbol });
  const { lastTradedPrice, changeRate } = useSymbolPrice({ symbol });

  return (
    <InfoContent
      iconUrl={iconUrl}
      symbolCode={() => <SymbolCodeToName code={symbol} />}
      changeRate={changeRate}
      lastPrice={lastTradedPrice}
    />
  );
});

const FuturesSymbolInfo = memo(({ symbol }) => {
  const { iconUrl } = getCoinInfo({ symbol });
  const detail = useMarketInfoForSymbol(symbol);

  return (
    <InfoContent
      iconUrl={iconUrl}
      symbolCode={() => <SymbolText symbol={symbol} />}
      changeRate={detail?.changeRate}
      lastPrice={detail?.lastPrice}
    />
  );
});

export default memo(({ symbol, tradeType }) => {
  if (tradeType === FUTURES) {
    return symbol ? <FuturesSymbolInfo symbol={symbol} /> : null;
  }
  return <SymbolInfo symbol={symbol} />;
});
