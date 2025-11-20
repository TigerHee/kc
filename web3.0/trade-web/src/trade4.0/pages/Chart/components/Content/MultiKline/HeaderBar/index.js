/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { useKlineSymbols } from '@/pages/Chart/hooks/useKlineSymbols';
import IntervalSelectBar from '@/pages/Chart/components/TradingViewV24/IntervalSelectBar';
import SymbolInfo from './SymbolInfo';
import { HeaderBarWrapper, Operator, Icon } from './style';
import PriceSelect from '../../../TradingViewV24/Header/PriceSelect';

const HeaderBar = ({ symbol, interval, onIntervalChange, tradeType }) => {
  const { onDeleteSymbol, onFullScreenSymbol, kLineSymbols } = useKlineSymbols();

  return (
    <HeaderBarWrapper>
      <SymbolInfo symbol={symbol} tradeType={tradeType} />
      <Operator>
        <PriceSelect symbol={symbol} tradeType={tradeType} type="multi" />
        <IntervalSelectBar interval={interval} onIntervalChange={onIntervalChange} />

        <Icon
          type="full-page"
          fileName="chart"
          size={12}
          onClick={(e) => onFullScreenSymbol(e, symbol)}
        />

        {kLineSymbols.length > 1 ? (
          <Icon
            type="close-outline"
            fileName="chart"
            size={12}
            onClick={(e) => onDeleteSymbol(e, symbol)}
          />
        ) : null}
      </Operator>
    </HeaderBarWrapper>
  );
};
export default HeaderBar;
