/**
 * Owner: will.wang@kupotech.com
 */
import { reportPriceKlineError } from '@/tools/sentry';
import { IChartApi, ISeriesApi, SeriesDataItemTypeMap } from 'lightweight-charts';
import { MutableRefObject, useCallback, useRef, useState } from "react";
import moment, { DurationInputArg1 } from 'moment';
import { each, last, findIndex } from 'lodash-es';
import dateToChartTimeMinute from '@/tools/dateToChartTimeMinute';
import { getNoLineCandles } from '@/services/coinDetail';
import { getKLineData } from '@/services/newhomepage';
import { useCoinDetailStore } from '@/store/coinDetail';
import { bootConfig } from 'kc-next/boot';

const onRealtimeCallbackTemp = {};
const onRealtimeCallKey = (i: number) => `k${i}`;

// Area图数据类型
export type Chartdata = SeriesDataItemTypeMap['Area'][];

const cacheAllLineData: Record<string, { list: Chartdata; _timestamp: number; }> = {};

/** get symbol && types */
const getSymbolTypes = (props: {
  symbol: string;
  resolution: string;
}) => {
  const { symbol, resolution } = props;
  let type = '8hour';
  if (resolution === '1D' || resolution === 'D') {
    type = '1day';
  } else if (resolution === '1W' || resolution === 'W') {
    type = '1week';
  } else {
    const resolutionNum = parseFloat(resolution);
    if (resolutionNum < 60) {
      type = `${resolution}min`;
    } else if (resolutionNum >= 60 && resolutionNum < 1440) {
      type = `${resolutionNum / 60}hour`;
    }
  }
  return `${symbol}_${type}`;
};


/**
 * 图表data
 * 更新data
 */
export default function useChartData(options: {
  coin: string;
  resolutionLabel: string;
  chartRef: MutableRefObject<IChartApi | null>;
  chartSeriesRef: MutableRefObject<ISeriesApi<"Area"> | null>;
  limitPoints: number;
  symbol: string;
  resolution: string;
  timeRange: DurationInputArg1,
  _wsInstanceId: number;
}) {
  const { coin, chartRef, chartSeriesRef, resolutionLabel, limitPoints, symbol, resolution, timeRange, _wsInstanceId } = options;
  const [isRefresh, setRefresh] = useState<null | {}>(null);
  const [constructorHasRun, setConstructorHasRun] = useState(false);

  const [shouldHide, setShouldHide] = useState(false);

  const coinInfoReady = useCoinDetailStore((s) => s.coinInfoReady);
  const coinInfo = useCoinDetailStore(s => s.coinInfo);
  const updateCoinDetail = useCoinDetailStore((s) => s.updateProp);
  const updateLatestPrice = useCoinDetailStore((s) => s.updateLatestPrice);

  
  const cacheLineDataRef = useRef<Chartdata>([]);

  // 设置图表的data
  const setCandleData = useCallback(
    (list: Chartdata) => {
      cacheLineDataRef.current = list;

      if (chartSeriesRef.current) {
        try {
          chartSeriesRef.current.setData(list);
        } catch (err) {
          reportPriceKlineError(err, { ...list, errorFrom: 'setCandleData line' });
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateCoinDetail({ openPrice: list[0]?.open ?? null });

      if (list.length && chartRef.current && last(list)) {
        chartRef.current.timeScale().setVisibleRange({ from: list[0].time, to: last(list)!.time });
      }
    },
    [chartRef, chartSeriesRef, updateCoinDetail],
  );


  const syncHistoryCandles = useCallback(
    async (symbol, resolution, timeRange) => {
      // 若缓存数据在1分钟以内有过更新，则直接使用缓存数据，不再全量拉candles
      const selectCache = cacheAllLineData[`${symbol}_${resolutionLabel}`];
      if (selectCache && Date.now() - selectCache._timestamp < 60000) {
        setCandleData(selectCache.list);
        return;
      }
      const from = moment().subtract(moment.duration(timeRange)).unix();
      const to = moment().unix();
      const st = getSymbolTypes({ symbol, resolution });
      let data: null | any[] = null;
      if (coinInfoReady) {
        if (coinInfo.isUnsale || coinInfo.isTemporary) {
          // 目前临时币种和未开售币种只能拉1天的数据
          const res = await getNoLineCandles({ symbol: `${coin}-${bootConfig._BASE_CURRENCY_}`, type: '1day' });
          data = res.data;
        } else {
          const res = await getKLineData({ symbol, type: st.split('_')[1], begin: from, end: to });
          data = res.data;
        }
      }
      if (!data || !Array.isArray(data) || data.length === 0  ) {
        setShouldHide(true);
        updateCoinDetail({ hideChart: true })
        return;
      }
      if (data) {
        const bars: any[] = [];
        // 限制一下点位个数
        data.length = Math.min(limitPoints, data.length);
        for (let i = data.length - 1; i >= 0; --i) {
          const item = data[i];
          bars.push({
            time: dateToChartTimeMinute(new Date(item[0] * 1000)),
            open: parseFloat(item[1]),
            close: parseFloat(item[2]),
            value: parseFloat(item[2]),
            high: parseFloat(item[3]),
            low: parseFloat(item[4]),
          });
        }
        cacheAllLineData[`${symbol}_${resolutionLabel}`] = { _timestamp: Date.now(), list: bars };

        if (bars.length) {
          updateLatestPrice({ latestPrice: last(bars).close })
        }
        setCandleData(bars);
      }
    },
    [coin, coinInfo.isTemporary, coinInfo.isUnsale, coinInfoReady, limitPoints, resolutionLabel, setCandleData, updateCoinDetail, updateLatestPrice],
  );

  const onRealtimeCallback = useCallback(
    ([st, timesMap]) => {
      each(timesMap, (candle) => {
        const insertItem = {
          time: dateToChartTimeMinute(new Date(candle[0] * 1000)),
          open: parseFloat(candle[1]),
          close: parseFloat(candle[2]),
          value: parseFloat(candle[2]),
        };
        updateLatestPrice({ latestPrice: insertItem.close });

        const findOldNodeIndex = findIndex(
          cacheLineDataRef.current,
          (item) => item.time === insertItem.time,
        );
        if (findOldNodeIndex === -1) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cacheLineDataRef.current = [...cacheLineDataRef.current, insertItem];
          // 总点位超过点位上限。将最老的数据进行移除
          if (cacheLineDataRef.current.length > limitPoints) {
            cacheLineDataRef.current.shift();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const _price = cacheLineDataRef.current[0]?.open;
            if (_price) {
              updateCoinDetail({ openPrice: _price });
            }
          }
          try {
            chartSeriesRef.current?.setData(cacheLineDataRef.current);
          } catch (e) {
            syncHistoryCandles(symbol, resolution, timeRange);
            reportPriceKlineError(e, cacheLineDataRef.current);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cacheLineDataRef.current[findOldNodeIndex] = insertItem;
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            chartSeriesRef.current?.update(insertItem);
          } catch (e) {
            syncHistoryCandles(symbol, resolution, timeRange);
            reportPriceKlineError(e, { ...insertItem, errorFrom: 'onRealtimeCallback line' });
          }
        }
      });
    },
    [updateLatestPrice, limitPoints, updateCoinDetail, chartSeriesRef, syncHistoryCandles, symbol, resolution, timeRange],
  );

  const hookOnRealTimeCallback = useCallback(
    (hook) => {
      const key = onRealtimeCallKey(_wsInstanceId);
      if (hook) {
        onRealtimeCallbackTemp[key] = onRealtimeCallback;
      } else {
        delete onRealtimeCallbackTemp[key];
      }
    },
    [_wsInstanceId, onRealtimeCallback],
  );
  
  const constructor = () => {
    if (constructorHasRun) return;
    hookOnRealTimeCallback(true);
    setConstructorHasRun(true);
  };

  constructor();

  return {
    shouldHide,
    cacheLineDataRef,
    isRefresh,
    setRefresh,
    setCandleData,
    syncHistoryCandles
  }
}