/**
 * Owner: will.wang@kupotech.com
 */
import dynamic from 'next/dynamic';
import { Spin } from '@kux/mui-next';
import ChartLoadingPlaceholder from '@/routes/[coin]/components/PriceKline/ChartLoadingPlaceholder';

const KlineLoader = <Spin spinning type="brand" size="xsmall" >
  <div style={{ height: 226, width: '100%' }}></div>
</Spin>;

export const PriceKlineChart = dynamic(() => import('@/components/KLineChart'), { 
  ssr: false,
  loading: ChartLoadingPlaceholder,
});

export const PriceCandleChart = dynamic(() => import('@/components/CandleChart/index'), { 
  ssr: false,
  loading: ChartLoadingPlaceholder,
});