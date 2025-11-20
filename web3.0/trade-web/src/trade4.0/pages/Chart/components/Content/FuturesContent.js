/**
 * Owner: jessie@kupotech.com
 */
import React, { memo } from 'react';

import { map } from 'lodash';

import { KLINE_LAST } from '@/meta/chart';
import { useFuturesPositionLineData } from '@/pages/Chart/hooks/useFuturesPositionLineData';
import { useFuturesOrderLineData } from '@/pages/Chart/hooks/useOrderLineData';

import OrderLine from '../TradingViewV24/Lines/OrderLine';
import PositionLine from '../TradingViewV24/Lines/PositionLine';

const PositionLineRender = memo(({ symbol, chartType, tvWidget }) => {
  const position = useFuturesPositionLineData({ symbol, chartType });

  return position ? <PositionLine key={symbol} tvWidget={tvWidget} position={position} /> : null;
});
/**
 * 合约
 */
const FuturesContent = ({ symbol, chartType, tvWidget, priceType }) => {
  const orderList = useFuturesOrderLineData({ symbol, chartType });

  if (chartType === 'timeline' || priceType !== KLINE_LAST) return null;

  return (
    <div>
      {map(orderList, (order) => {
        if (order) {
          return (
            <OrderLine key={order.id} order={order} chartType={chartType} tvWidget={tvWidget} />
          );
        }
      })}
      <PositionLineRender symbol={symbol} chartType={chartType} tvWidget={tvWidget} />
    </div>
  );
};

export default memo(FuturesContent);
