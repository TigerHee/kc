/**
 * Owner: jessie@kupotech.com
 */
import React, { useCallback, useRef, useEffect, memo } from 'react';
import { map } from 'lodash';
import { useOrderListInit } from '@/pages/Orders/Common/hooks/useOrderListInit';
import { useOrderLineData } from '@/pages/Chart/hooks/useOrderLineData';
import useOrderHistoryData from '@/pages/Chart/hooks/useOrderHistoryData';
import OrderLine from '../TradingViewV24/Lines/OrderLine';
import BsPoint from '../TradingViewV24/Lines/BsPoint';

const OrderLineContent = memo(({ order, ...others }) => {
  const refOrder = useRef(order);
  const { onCancel } = useOrderListInit({
    namespace: order.orderType === 'active' ? 'orderCurrent' : 'orderStop',
    type: order.orderType === 'active' ? 'current' : 'stop',
  });

  useEffect(() => {
    refOrder.current = order;
  }, [order]);

  const handleCancel = useCallback(() => {
    onCancel(refOrder.current);
  }, [onCancel]);

  return <OrderLine {...others} order={order} onCancel={handleCancel} />;
});

/**
 * 现货/杠杆
 */
const SpotContent = ({ symbol, chartType, tradeType, interval, tvWidget, ...others }) => {
  const orderList = useOrderLineData({ symbol, chartType });
  const bsList = useOrderHistoryData({
    chartType,
    tradeType,
    interval,
    symbol,
    tvWidget,
    ...others,
  });

  return (
    <div>
      {map(orderList, (order) => {
        if (order) {
          return (
            <OrderLineContent
              key={order.id}
              order={order}
              chartType={chartType}
              tvWidget={tvWidget}
            />
          );
        }
      })}
      {map(bsList, (order) => {
        if (order) {
          return <BsPoint order={order} tvWidget={tvWidget} />;
        }
      })}
    </div>
  );
};

export default memo(SpotContent);
