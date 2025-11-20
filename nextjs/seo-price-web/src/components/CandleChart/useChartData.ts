/**
 * Owner: will.wang@kupotech.com
 */
import { reportPriceKlineError } from '@/tools/sentry';
import { ISeriesApi, SeriesDataItemTypeMap, UTCTimestamp } from 'lightweight-charts';
import { MutableRefObject, useCallback, useMemo, useRef, useState } from "react";
import moment from 'moment';
import { last, findIndex, forEach } from 'lodash-es';
import { getNoLineCandles } from '@/services/coinDetail';
import { getKLineData } from '@/services/newhomepage';
import { useMemoizedFn, useThrottleFn, useUpdateEffect } from 'ahooks';
import continueBars from '@/components/CandleChart/utils/continueBars';
import { useCoinDetailStore } from '@/store/coinDetail';
import { onRealtimeCallKey } from '@/hooks/useWsSubscribe';
import { bootConfig } from 'kc-next/boot';

const TOGGLE_MAX_COUNT = 1e6;

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
  kLineContainer: MutableRefObject<HTMLDivElement | null>;
  candlestickSeriesRef: MutableRefObject<ISeriesApi<'Candlestick'> | null >;
  symbol: string;
  resolution: string;
  _wsInstanceId: number | null;
}) {
  const { coin, _wsInstanceId, candlestickSeriesRef, symbol, resolution, kLineContainer } = options;
  const scaleRangeRef = useRef<null | { from: any; to: any; }>(null);

  const [selectBar, setSelectBar] = useState<Record<string, any>>({});
  const [cacheBars, setCacheBarsData] = useState<any[]>([]);
  const [candleDataToggle, setCandleDataStateToggle] = useState(0);
  const [isRefresh, setRefresh] = useState<null | {}>(null);
  const [constructorHasRun, setConstructorHasRun] = useState(false);
  const onRealtimeCallbackTemp = useRef<Record<string, (...args: any[]) => void>>({});

  const updateCoinDetail = useCoinDetailStore((s) => s.updateProp);
  const coinInfoReady = useCoinDetailStore((state) => state.coinInfoReady);
  const updateLatestPrice = useCoinDetailStore(s => s.updateLatestPrice)

  const coinInfo = {
    isUnsale: false,
    isTemporary: false,
  }

  const updateSelectBar = useThrottleFn(
    (bar) => {
      if (bar && bar.point && bar.point.x && kLineContainer.current) {
        const kLineWidth = kLineContainer.current
          .querySelector('tr')?.querySelectorAll('td')[1].clientWidth ?? 0;
        const item = cacheBars.find((i) => i.time === bar.time);
        setSelectBar({
          ...item,
          position: bar.point.x >= kLineWidth / 2 ? 'left' : 'right',
        });
      } else {
        setSelectBar({});
      }
    },
    { wait: 100, trailing: false },
  );

  // 设置图表的data
  const setCandleData = useCallback((data: any) => {
    setCacheBarsData([...data]);
    setCandleDataStateToggle((toggle) => {
      return toggle > TOGGLE_MAX_COUNT ? 0 : toggle + 1;
    });
  }, []);


  const syncHistoryCandles = useCallback(
    async (symbol: string, resolution: string, endMillseconds?: number) => {
      // 若缓存数据在1分钟以内有过更新，则直接使用缓存数据，不再全量拉candles
      const selectCache = cacheAllLineData[`${symbol}_${resolution}`];

      if (
        selectCache &&
        Date.now() - selectCache._timestamp < 60000 &&
        selectCache.list.length > 0
      ) {
        setCandleData(selectCache.list);
        return;
      }
      const from = moment(endMillseconds).subtract(moment.duration(180, 'days')).unix();
      const to = (endMillseconds ?? 0) / 1000 || moment().unix();
      const [, type] = getSymbolTypes({ symbol, resolution }).split('_');

      let data: any[] | null = null;

      if (coinInfoReady) {
        if (coinInfo.isUnsale || coinInfo.isTemporary) {
          const res = await getNoLineCandles({ symbol: `${coin}-${bootConfig._BASE_CURRENCY_}`, type });
          data = res.data;
        } else {
          const res = await getKLineData({
            symbol,
            type,
            begin: from,
            end: to,
          });
          data = res.data;
        }
      }

      if (!data || !Array.isArray(data)) {
        updateCoinDetail({ hideChart: true });
        return
      };
      
      const bars: any[] = [];
      for (let i = data.length - 1; i >= 0; --i) {
        const item = data[i];
        const barValue: any = {
          time: parseFloat(item[0]) * 1000,
          close: parseFloat(item[2]),
        };
        if (item[1]) {
          barValue.open = parseFloat(item[1]);
          barValue.high = parseFloat(item[3]);
          barValue.low = parseFloat(item[4]);
        } else {
          barValue.open = barValue.high = barValue.low = barValue.close;
        }

        barValue.amount = parseFloat(item[5]);
        barValue.volume = parseFloat(item[6]);
        bars.push(barValue);
      }
      cacheAllLineData[`${symbol}_${resolution}`] = {
        _timestamp: Date.now(),
        list: [...bars],
      };
      if (bars.length) {
        updateLatestPrice({ latestPrice: last(bars).close });
      }
      let newCandleData = [...bars];

      if (endMillseconds) {
        if (
          cacheBars[0] &&
          bars[0] &&
          cacheBars[0].time > bars[bars.length - 1].time
        ) {
          newCandleData = continueBars(resolution, [...bars, ...cacheBars]);
        } else {
          scaleRangeRef.current = null;
        }
      } else {
        scaleRangeRef.current = null;
      }
      setCandleData(newCandleData);
    },
    [coinInfoReady, setCandleData, coinInfo.isUnsale, coinInfo.isTemporary, coin, updateCoinDetail, updateLatestPrice, cacheBars],
  );

  const onRealtimeCallback = useMemoizedFn(
    ([st, timesMap]) => {
      forEach(timesMap, (candle) => {
        let [time, open, close, high, low, amount, volume] = candle;
        if (!open) open = high = low = close;
        const insertItem = {
          time: parseFloat(time) * 1000 as UTCTimestamp,
          close: parseFloat(close),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          amount: parseFloat(amount),
          volume: parseFloat(volume),
        };

        // 更新最新价格
        updateLatestPrice({ latestPrice: insertItem.close });
        // setTick && setTick({ isReal: true, key: symbol, value: +insertItem.close || 0 });
        const findOldNodeIndex = findIndex(cacheBars, (item) => item.time === time);
        if (findOldNodeIndex === -1) {
          setCacheBarsData([...cacheBars, insertItem]);
        } else {
          const newItems = [...cacheBars];
          newItems[findOldNodeIndex] = insertItem;
          setCacheBarsData(newItems);
        }
        
        if (candlestickSeriesRef.current) {
          try {
            candlestickSeriesRef.current.update({
              ...insertItem,
              time: insertItem.time as UTCTimestamp,
            });

          } catch (e) {

            syncHistoryCandles(symbol, resolution);
            reportPriceKlineError(e, {
              ...insertItem,
              errorFrom: 'onRealtimeCallback candle',
            });
          }
        }
      });
    },
  );


  const displayBar = useMemo(() => {
    return selectBar?.time ? selectBar : last(cacheBars);
  }, [cacheBars, selectBar]);

  const hookOnRealTimeCallback = useCallback(
    (shouldHook: boolean) => {
      if (_wsInstanceId === null) return;

      const key = onRealtimeCallKey(_wsInstanceId);
      if (shouldHook) {
        onRealtimeCallbackTemp.current[key] = onRealtimeCallback;
      } else {
        delete onRealtimeCallbackTemp.current[key];
      }
    },
    [_wsInstanceId, onRealtimeCallback],
  );
  
  const constructor = () => {
    if (_wsInstanceId === null) return;
    if (constructorHasRun) return;

    hookOnRealTimeCallback(true);
    setConstructorHasRun(true);
  };

  useUpdateEffect(() => {
    constructor();
  }, [_wsInstanceId])

  constructor();


  return {
    cacheBars,
    isRefresh,
    displayBar,
    selectBar,
    updateSelectBar,
    scaleRangeRef,
    candleDataToggle,
    onRealtimeCallbackTemp,
    setRefresh,
    setCandleData,
    syncHistoryCandles,
    onRealtimeCallback,
  }
}