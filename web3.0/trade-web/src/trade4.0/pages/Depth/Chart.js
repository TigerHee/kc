/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useState } from 'react';
import { useSelector } from 'dva';
import { useTheme } from '@kux/mui';
import DepthChart from '@kc/depth';
import { theme, chartConfig } from './config';
import { namespace as orderbookNamespace } from '@/pages/Orderbook/config';
import { getModelList as getOrderbookData } from '@/pages/Orderbook/hooks/useModelData';
import { formatNumber } from '@/utils/format';
import { reverse } from 'lodash';
import { Wrapper } from './style';
import { useResize } from './hooks/useResize';
import getTips from './Tips';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';

const Depth = () => {
  const isLoading = useSelector(
    (state) => state.loading.effects[`${orderbookNamespace}/getOrderBooks`],
  );

  const { currentTheme, colors } = useTheme();
  const { sell: _sell = [], buy: _buy = [] } = getOrderbookData();
  const [zoom, setZoom] = useState(chartConfig.zoomDefault);
  const [isLeave, setLeave] = useState(false);
  // 不能直接使用，需要copy一份返回新的值
  const sell = [].concat(_sell);
  const buy = [].concat(_buy);
  const { direction, depthRef } = useResize();

  const formatPrice = (n) => {
    return formatNumber(n);
  };

  const storeDepthRef = (ref) => {
    depthRef.current = ref;
  };

  const zoomedData = {
    asks: DepthChart.zoomData(reverse(sell) || [], zoom, 'asks'),
    bids: DepthChart.zoomData(buy || [], zoom, 'bids'),
  };

  if (isLoading) {
    return <Spin />;
  }

  if (buy.length === 0 && sell.length === 0) {
    return <Empty />;
  }

  return (
    <Wrapper
      className="depth-chart"
      direction={direction}
      onMouseLeave={() => setLeave(true)}
      onMouseOver={() => setLeave(false)}
    >
      <DepthChart
        {...chartConfig}
        {...(theme(currentTheme, colors) || {})}
        ref={storeDepthRef}
        data={zoomedData}
        layout={direction}
        onZoom={(value) => {
          setZoom(value);
        }}
        formatPrice={formatPrice}
        tooltipComponent={!isLeave ? getTips(sell) : null}
        step
      />
    </Wrapper>
  );
};

export default memo(Depth);
