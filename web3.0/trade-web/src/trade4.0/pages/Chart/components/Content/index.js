/**
 * Owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { useSelector } from 'dva';
import { map, find } from 'lodash';
import { useTheme } from '@kux/mui';
import { namespace } from '@/pages/Chart/config';
import { useChart } from '@/pages/Chart/hooks/useChart';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useKlineSymbols } from '@/pages/Chart/hooks/useKlineSymbols';
import SvgComponent from '@/components/SvgComponent';
import CallAuction from '@/pages/CallAuction';
import { getSingleModule } from '@/layouts/utils';
import { FUTURES } from '@/meta/const';
import TradePreview from '../TradePreview';
import ScriptLoad from '../TradingViewV24/ScriptLoad';
import { ContentWrapper, MultiWrapper, MultiItem, EmptyWrapper, ChartContent } from './style';
import Kline from './Kline';
import MultiKline from './MultiKline/index';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';

/**
 * 预览、集合竞价等与k线无关的组件
 */
const ExtraComp = memo(({ symbol, isMulti, tradeType }) => {
  const isSpotSymbol = isSpotTypeSymbol(symbol);
  const isFutures = tradeType === FUTURES;
  if (!symbol || !isSpotSymbol || isFutures) return null;
  return (
    <>
      <TradePreview symbol={symbol} />
      <CallAuction symbol={symbol} isMulti={isMulti} />
    </>
  );
});

const SingleContent = memo(({ kLineSymbols }) => {
  const currentSymbol = useGetCurrentSymbol();
  const { symbol, tradeType } = find(kLineSymbols, { displayIndex: 0 }) || {};
  const { sizeType, enableSave } = useChart();
  const _symbol = symbol || currentSymbol;
  if (!_symbol) return null;
  return (
    <ChartContent>
      <Kline symbol={_symbol} sizeType={sizeType} enableSave={enableSave} tradeType={tradeType} />
      <ExtraComp symbol={_symbol} tradeType={tradeType} isMulti={false} />
    </ChartContent>
  );
});
const MultiContent = memo(({ kLineSymbols, onSymbolChange, activeIndex }) => {
  const { isSingle } = getSingleModule();
  const { colors } = useTheme();
  return (
    <MultiWrapper>
      {map(new Array(4), (item, index) => {
        const { symbol, displayIndex, tradeType } =
          find(kLineSymbols, { displayIndex: index }) || {};
        return (
          <MultiItem
            key={`${symbol}_${index}_${tradeType}`}
            onClick={() => onSymbolChange(symbol)}
            isSingle={isSingle}
            className={`border${index} ${displayIndex === activeIndex ? 'active' : ''}`}
          >
            {!symbol ? (
              <EmptyWrapper>
                <SvgComponent type="logo-null" fileName="chart" color={colors.icon} />
                <span>{window.location.hostname}</span>
              </EmptyWrapper>
            ) : (
              <ChartContent>
                <MultiKline symbol={symbol} tradeType={tradeType} />
                <ExtraComp symbol={symbol} tradeType={tradeType} isMulti={!0} />
              </ChartContent>
            )}
          </MultiItem>
        );
      })}
    </MultiWrapper>
  );
});

export default memo(() => {
  const { onSymbolChange, kLineSymbols, activeIndex } = useKlineSymbols();
  const boxCount = useSelector((state) => state[namespace].boxCount);

  return (
    <ScriptLoad>
      <ContentWrapper data-inspector="trade-chart-content">
        {boxCount === '1' ? (
          <SingleContent kLineSymbols={kLineSymbols} />
        ) : (
          <MultiContent
            kLineSymbols={kLineSymbols}
            onSymbolChange={onSymbolChange}
            activeIndex={activeIndex}
          />
        )}
      </ContentWrapper>
    </ScriptLoad>
  );
});
