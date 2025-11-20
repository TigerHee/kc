/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { useKlineMarketsInit } from '@/pages/Chart/hooks/useKlineSymbols';
import ChartType from './ChartType';
import TabSymbols from './TabSymbols';
import { HeaderWrapper } from './style';

export default () => {
  useKlineMarketsInit();
  return (
    <HeaderWrapper className="chart-header" data-inspector="trade-chart-header">
      <TabSymbols />
      <ChartType />
    </HeaderWrapper>
  );
};
