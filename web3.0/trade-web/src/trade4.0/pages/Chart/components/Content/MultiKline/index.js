/**
 * Owner: jessie@kupotech.com
 */
import React, { Fragment, useState, useMemo } from 'react';
import { _t } from 'utils/lang';
import { DEFAULT_INTERVAL } from '@/pages/Chart/config';
import { useUnit } from '@/hooks/futures/useUnit';
import { FUTURES } from '@/meta/const';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import HeaderBar from './HeaderBar';
import TradingView from '../../TradingViewV24';
import {
  useKlinePriceType,
  useKlinePriceKeyForSymbol,
} from '../../TradingViewV24/Header/PriceSelect/hooks';

const MultiKline = (props) => {
  const [interval, setInterval] = useState(DEFAULT_INTERVAL);
  const tradingUnit = useUnit();

  const { tradeType, symbol } = props;

  const isFutures = useMemo(() => {
    return !isSpotTypeSymbol(symbol) && tradeType === FUTURES;
  }, [symbol, tradeType]);


  const key = useMemo(() => {
    if (isFutures) {
      return `${symbol}_multi_${tradeType}_${tradingUnit}`;
    }
    return `${symbol}_multi_${tradeType}`;
  }, [isFutures, symbol, tradeType, tradingUnit]);

  const priceType = useKlinePriceType(symbol);
  const paramSymbol = useKlinePriceKeyForSymbol(symbol, priceType, tradeType);

  return (
    <Fragment>
      <HeaderBar interval={interval} onIntervalChange={setInterval} {...props} />
      <div style={{ height: 'calc(100% - 33px)' }}>
        <TradingView
          id={`${symbol}_multi`}
          key={key}
          interval={interval}
          chartType="multi"
          {...props}
          symbol={paramSymbol || symbol}
          originSymbol={symbol}
        />
      </div>
    </Fragment>
  );
};

export default MultiKline;
