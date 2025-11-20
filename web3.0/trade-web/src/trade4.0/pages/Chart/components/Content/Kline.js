/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, memo } from 'react';
import { useChartType } from '@/pages/Chart/hooks/useChartType';
import { useInterval } from '@/pages/Chart/hooks/useChartToolBar';
import { useUnit } from '@/hooks/futures/useUnit';
import { FUTURES } from '@/meta/const';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import TradingView from '../TradingViewV24';
import FuturesContent from './FuturesContent';
import SpotContent from './SpotContent';
import {
  useKlinePriceType,
  useKlinePriceKeyForSymbol,
} from '../TradingViewV24/Header/PriceSelect/hooks';

const Kline = ({ symbol, tradeType, enableSave, sizeType }) => {
  const { chartType = 'normal' } = useChartType();
  const { interval, onIntervalChange } = useInterval();

  const isFutures = useMemo(() => {
    return !isSpotTypeSymbol(symbol) && tradeType === FUTURES;
  }, [symbol, tradeType]);

  const tradingUnit = useUnit();

  const key = useMemo(() => {
    if (isFutures) {
      return `${sizeType}_${tradeType}_${tradingUnit}_${chartType}`;
    }
    return `${sizeType}_${tradeType}_${chartType}`;
  }, [isFutures, sizeType, tradeType, chartType, tradingUnit]);

  const priceType = useKlinePriceType(symbol);
  const paramSymbol = useKlinePriceKeyForSymbol(symbol, priceType, tradeType);

  return (
    <TradingView
      id={`${symbol}_${chartType}_${sizeType}`}
      key={key}
      symbol={paramSymbol || symbol}
      interval={chartType === 'timeline' ? '1' : interval}
      updateGranularity={onIntervalChange}
      chartType={chartType}
      sizeType={sizeType}
      enableSave={enableSave}
      tradeType={tradeType}
      originSymbol={symbol}
    >
      {tradeType === FUTURES ? (
        <FuturesContent symbol={symbol} chartType={chartType} priceType={priceType} />
      ) : (
        <SpotContent
          symbol={symbol}
          chartType={chartType}
          tradeType={tradeType}
          interval={interval}
        />
      )}
    </TradingView>
  );
};
export default memo(Kline);
