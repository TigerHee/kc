/*
 * owner: Clyne@kupotech.com
 */
import React, { useRef } from 'react';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import { namespace } from '@/pages/Orderbook/config';
import { formatNumber, formatNumberKMB } from '@/utils/format';
import { getCurrentSymbolInfo, useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTip } from './hooks/useTip';
import { TipWrapper, TipFlex, TipName, TipValue } from './style';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import { getCurrenciesPrecision } from 'src/trade4.0/hooks/futures/useGetCurrenciesPrecision';

const Tip = () => {
  const ref = useRef();
  const quoteCurrency = useSelector((state) => state[namespace].quoteCurrency);
  const baseCurrency = useSelector((state) => state[namespace].baseCurrency);
  const currentSymbol = useGetCurrentSymbol();
  const tradeType = useTradeType();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
  const isFutures = !isSpotSymbol && tradeType === FUTURES;
  const symbolInfo = getCurrentSymbolInfo();
  const categories = useSelector((state) => state.categories);

  const {
    price = 0,
    total = 0,
    volume = 0,
    amountPrecision,
    avaragePrice = 0,
    dataLength,
    style,
    arrow,
  } = useTip({ ref });

  const volumePrecision =
    (isFutures
      ? getCurrenciesPrecision(quoteCurrency).shortPrecision
      : categories[quoteCurrency]?.precision) || 2;
  return (
    <TipWrapper arrow={arrow} style={style} className="orderbook-tips" show={dataLength} ref={ref}>
      <TipFlex>
        <TipName>{_t('span.avarage.price', { currency: quoteCurrency })}</TipName>
        <TipValue>
          {formatNumber(avaragePrice || price, {
            dropZ: false,
            fixed: symbolInfo?.pricePrecision,
          })}
        </TipValue>
      </TipFlex>
      <TipFlex>
        <TipName>{_t('span.vol', { currency: baseCurrency })}</TipName>
        <TipValue>{formatNumberKMB(total, { fixed: amountPrecision })}</TipValue>
      </TipFlex>
      <TipFlex>
        <TipName>{_t('span.amount', { currency: quoteCurrency })}</TipName>
        <TipValue>{formatNumberKMB(volume, { fixed: volumePrecision })}</TipValue>
      </TipFlex>
    </TipWrapper>
  );
};

export default Tip;
