/**
 * Owner: will.wang@kupotech.com
 */
import { reportPriceKlineError } from '@/tools/sentry';
import { numberFormat } from '@kux/mui-next/utils'
import multiplyFloor from "@/tools/math/multiplyFloor";
import { IChartApi, ISeriesApi } from "lightweight-charts";
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useMemo } from "react";
import { DurationInputArg1 } from 'moment';
import { Chartdata } from '@/components/KLineChart/hooks/useChartData';
import { useMount, useUpdateEffect } from 'ahooks';
import { useCurrencyStore } from '@/store/currency';
import { bootConfig } from 'kc-next/boot';
import { useMarketStore } from '@/store/market';


export default function useSideEffects(options: {
  lang: string;
  // currency: string;
  symbol: string;
  resolution: string;
  timeRange: DurationInputArg1,
  chartRef: MutableRefObject<IChartApi | null>;
  chartSeriesRef: MutableRefObject<ISeriesApi<'Area'> | null>;
  cacheLineDataRef: MutableRefObject<Chartdata>;
  isRefresh: {} | null;
  isUnsaleATemporary: boolean;
  changeResolutionLoading: boolean;
  setChangeResolutionLoading: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<{} | null>>;
  syncHistoryCandles: (symbol: any, resolution: any, timeRange: any) => Promise<void>;
  setCandleData: (list: Chartdata) => void;
  setNoData: (isNoata: boolean) => void;
}) {
  const { lang, chartRef, symbol, changeResolutionLoading, cacheLineDataRef, setNoData, setChangeResolutionLoading, syncHistoryCandles, timeRange, resolution, setCandleData, chartSeriesRef, isRefresh, isUnsaleATemporary } = options;

  // 当前的法币
  const currency = useCurrencyStore((state) => state.currency);
  const prices = useCurrencyStore((state) => state.prices);
  const allCurrencyRates = useCurrencyStore((state) => state.rates);
  const symbolsInfoMap = useMarketStore((market) => market.symbolsInfoMap);

  const getChartData = useCallback(async () => {
    if (symbol) {
      try {
        setChangeResolutionLoading(true);
        await syncHistoryCandles(symbol, resolution, timeRange);
      } catch (err) {
        reportPriceKlineError(err);
        setCandleData([]);
      } finally {
        setChangeResolutionLoading(false);
      }
    }
  }, [resolution, setCandleData, setChangeResolutionLoading, symbol, syncHistoryCandles, timeRange])

  useUpdateEffect(() => {
    if (lang && chartRef.current) {
      chartRef.current.applyOptions({
        localization: { locale: lang.replace('_', '-') },
      });
    }
  }, [lang]);

  useUpdateEffect(() => {
    if (currency && symbol && chartRef.current) {
      chartRef.current.applyOptions({
        localization: {
          priceFormatter(price) {
            let baseCoinRate = prices[symbol.split('-')[1]];
            
            if (bootConfig._BRAND_SITE_ === 'TH' && allCurrencyRates) {
              baseCoinRate = allCurrencyRates[currency];
            }
            
            if (baseCoinRate) {
              let target =
                multiplyFloor(baseCoinRate, price, symbolsInfoMap[symbol]?.precision || 8) + '';

              let integer = target.split('.')[0];
              let decimals = '';
              let unit = '';

              //整数位大于1，小数点后取2位，末位去0。否则按照默认精度 (避免出现竖轴的数据1.00xxx的数据变化(1.11232,1.11453,保留两位展示1.11)，调整展示全部小数)
              //当数值大于等于10000时，使用K，小数保留两位
              //当数值大于等于1000000时，使用M，小数保留两位

              if (integer.length > 6) {
                target = (+integer * 1) / 1000000 + '';
                decimals = target.split('.')[1];
                unit = 'M';
              } else if (integer.length > 4) {
                target = (+integer * 1) / 1000 + '';
                decimals = target.split('.')[1];
                unit = 'K';
              } else {
                // (避免出现竖轴的数据1.00xxx的数据变化(1.11232,1.11453,保留两位展示1.11)，调整展示全部小数)
                // decimals = !(Math.abs(price) < 1) ? target.split('.')[1] : '';
              }

              target = decimals
                ? target.split('.')[0] +
                  '.' +
                  decimals.slice(0, 1) +
                  (decimals.slice(1, 2) === '0' ? '' : decimals.slice(1, 2))
                : target;
              const precision = decimals ? 2 : symbolsInfoMap[symbol]?.precision || 8;
              target = numberFormat({
                number: target,
                lang: lang,
                options: { maximumFractionDigits: precision, minimumFractionDigits: precision },
              });
              return target + unit;
            }

            return price
              ? numberFormat({
                  number: price,
                  lang,
                  options: {
                    maximumFractionDigits: symbolsInfoMap[symbol]?.precision || 8,
                    minimumFractionDigits: symbolsInfoMap[symbol]?.precision || 2,
                  },
                })
              : price;
          },
        },
      });
    }
  }, [currency, symbol, prices, symbolsInfoMap, lang, isRefresh, allCurrencyRates]);

  useUpdateEffect(() => {
    getChartData();

    return () => {
      setCandleData([]);
    };
  }, [symbol, resolution, timeRange, chartRef.current, syncHistoryCandles, setCandleData]);

  // 价格轴精度设置
  useUpdateEffect(() => {
    if (symbol && symbolsInfoMap && symbolsInfoMap[symbol] && chartSeriesRef.current) {
      chartSeriesRef.current?.applyOptions({
        priceFormat: {
          precision: symbolsInfoMap[symbol].precision,
          minMove: +(symbolsInfoMap[symbol].priceIncrement || 0),
        },
      });
    }
  }, [symbolsInfoMap, symbol, isRefresh]);


  useUpdateEffect(() => {
    if (
      isUnsaleATemporary &&
      !changeResolutionLoading &&
      !cacheLineDataRef.current?.length &&
      symbol
    ) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [isUnsaleATemporary, changeResolutionLoading, setNoData, symbol]);

  useMount(() => {
    getChartData();
  })
}