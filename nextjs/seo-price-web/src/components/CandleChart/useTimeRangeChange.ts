/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useDebounceFn } from 'ahooks';
import { useEffect } from 'react';

export default (
  syncHistoryCandles,
  symbol,
  resolution,
  subscribeVisibleTimeRangeChange,
  subscribeKlineEvt,
  cacheBarRef,
  scaleRangeRef,
  chartRef,
) => {
  const onRangeChangeDebouncedFn = useDebounceFn((timeRange) => {
    if (timeRange) {
      const { from } = timeRange;
      const firstNode = cacheBarRef.current[0];
      if (firstNode && from === firstNode.time) {
        scaleRangeRef.current = chartRef.current.timeScale().getVisibleLogicalRange();
        syncHistoryCandles(symbol, resolution, firstNode.time);
      }
    }
  }, { wait: 500, });

  const onRangeChange = onRangeChangeDebouncedFn.run;


  useEffect(() => {
    let _onRangeChange = onRangeChange;
    subscribeKlineEvt.on(subscribeVisibleTimeRangeChange, _onRangeChange);
    return () => {
      subscribeKlineEvt.off(subscribeVisibleTimeRangeChange, _onRangeChange);
    };
  }, [onRangeChange]);

};
