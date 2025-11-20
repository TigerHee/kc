/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';

import SymbolCodeToName from '@/components/SymbolCodeToName';
import ChangeRender from '@/components/ChangeRender';
import SymbolText from '@/components/SymbolText';
import { formatNumber, floadToPercent } from '@/utils/format';
import { getDigit } from 'src/helper';
import { deepEqual } from 'src/utils/tools';

import { ItemCurrency, ItemPrice, ItemWrapper, DividerWrapper } from './style';
import { getSymbolPath } from 'src/trade4.0/utils/path';
import { FUTURES } from 'src/trade4.0/meta/const';

// 会引起组件变更的参数
const COMPARE_PARAMS_SPOT = ['symbolCode', 'changeRate', 'lastTradedPrice', 'precision'];
const COMPARE_PARAMS_FUTURE = ['symbol', 'changeRate', 'lastTradePrice', 'tickSize'];

/**
 * Item
 */
const Item = ({ data, onClick }) => {
  // 注意：这里的解构出来的变量做了缓存，后续有调整用到的属性变量，需要同步调整COMPARE_PARAMS_SPOT用到的参数
  const { symbolCode = '--', changeRate = 0, lastTradedPrice = '--', precision = 8 } = data || {};
  return (
    <ItemWrapper symbol={symbolCode} onClick={() => { onClick(symbolCode); }}>
      <ItemCurrency className="currency">
        <SymbolCodeToName code={symbolCode} />
      </ItemCurrency>
      <ChangeRender
        className="percent"
        render={(v) => floadToPercent(v, { isPositive: !!(v > 0), precision: 2, dropZ: false })}
        value={changeRate}
      />
      <ItemPrice className="price">
        {formatNumber(lastTradedPrice, { fixed: precision, dropZ: false })}
      </ItemPrice>
      <DividerWrapper type="vertical" className="divider" />
    </ItemWrapper>
  );
};

export const FuturesItem = memo(({ data, onClick }) => {
  // 注意：这里的解构出来的变量做了缓存，后续有调整用到的属性变量，需要同步调整COMPARE_PARAMS_FUTURE用到的参数
  const { symbol = '--', changeRate = 0, lastTradePrice = '--', tickSize = 0.01 } = data || {};
  const { path } = getSymbolPath(FUTURES, symbol);
  return (
    <ItemWrapper href={path} onClick={() => onClick(symbol)}>
      <ItemCurrency className="currency">
        <SymbolText symbol={symbol} />
      </ItemCurrency>
      <ChangeRender
        className="percent"
        render={(v) => floadToPercent(v, { isPositive: !!(v > 0), precision: 2, dropZ: false })}
        value={changeRate}
      />
      <ItemPrice className="price">
        {formatNumber(lastTradePrice, { fixed: getDigit(tickSize), dropZ: false })}
      </ItemPrice>
      <DividerWrapper type="vertical" className="divider" />
    </ItemWrapper>
  );
}, (prevProps, nextProps) => {
  return deepEqual(prevProps.data, nextProps.data, COMPARE_PARAMS_FUTURE);
});

export default memo(Item, (prevProps, nextProps) => {
  return deepEqual(prevProps.data, nextProps.data, COMPARE_PARAMS_SPOT);
});
