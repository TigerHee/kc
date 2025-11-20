/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useCoinDetailStore } from '@/store/coinDetail';
import { reportPriceKlineError } from '@/tools/sentry';
import { useUpdateEffect } from 'ahooks';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { isEmpty, last } from 'lodash-es';
import { MutableRefObject, useEffect, useRef } from 'react';

// 剔除data中重复time的值
function deduplicateData(data) {
  const map = new Map();
  data.forEach(item => {
    const t = item.time;
    map.set(t, { ...item, time: t });
  });
  return Array.from(map.values());
}

export default (options: {
  candlestickSeriesRef: MutableRefObject<ISeriesApi<'Candlestick'> | null >;
  chartRef: MutableRefObject<IChartApi | null>;
  scaleRangeRef: any;
  cacheBars: any[];
  candleDataToggle: any;
  resolution: string;
}) => {
  const { candlestickSeriesRef, chartRef, scaleRangeRef, cacheBars, candleDataToggle, resolution } = options;
  const fullupdateFlag = useRef(false);

  const updateProp = useCoinDetailStore(s => s.updateProp);
  
  useUpdateEffect(() => {
    fullupdateFlag.current = false;
  }, [candleDataToggle, resolution]);

  useEffect(() => {
    const data = cacheBars;

    // 只全量更新一次
    if (candlestickSeriesRef.current && data.length && fullupdateFlag.current === false) {
      try {
        candlestickSeriesRef.current.setData(deduplicateData(data));
        fullupdateFlag.current = true;
      } catch (err) {
        reportPriceKlineError(err, {
          ...data,
          errorFrom: 'useDataSet',
        });
      }

      // DONE 更新盘口价
      updateProp({ openPrice: last(data).open ?? null });

      if (!isEmpty(data) && chartRef.current) {
        if (scaleRangeRef.current) {
          chartRef.current
            .timeScale()
            .setVisibleLogicalRange({ from: scaleRangeRef.current.from, to: scaleRangeRef.current.to });
          scaleRangeRef.current = null;
        } else {
          const to = Math.max(data.length - 1, 30);
          const from = Math.max(0, to - 30);
          chartRef.current.timeScale().setVisibleLogicalRange({ from, to });
          chartRef.current.timeScale().scrollToRealTime();
        }
      }
    }
  }, [candleDataToggle, resolution, cacheBars, scaleRangeRef, chartRef, candlestickSeriesRef, updateProp]);
};
