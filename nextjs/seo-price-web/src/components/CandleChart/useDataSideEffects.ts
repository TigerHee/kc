/**
 * Owner: will.wang@kupotech.com
 */
import { useMarketStore } from "@/store/market";
import { useMount, useUpdateEffect } from "ahooks";
import { IChartApi, ISeriesApi } from "lightweight-charts";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export default function useDataSideEffects(options: {
  symbol: string;
  chartReadyFlag: boolean;
  resolution: string;
  isRefresh: any;
  candlestickSeriesRef: MutableRefObject<ISeriesApi<'Candlestick'> | null >;
  changeResolutionLoading: boolean;
  chartRef: MutableRefObject<IChartApi | null>;
  updateSelectBar: (bar: any) => void;
  setChangeResolutionLoading: Dispatch<SetStateAction<boolean>>
  setCandleData: (data: any) => void;
  syncHistoryCandles: (symbol: string, resolution: string, endMillseconds?: number | undefined) => Promise<void>;
}) {
  const { symbol, chartRef, candlestickSeriesRef, resolution, isRefresh, chartReadyFlag, setChangeResolutionLoading, updateSelectBar, syncHistoryCandles, setCandleData } = options;
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);

  useUpdateEffect(() => {
    if (chartRef.current && chartReadyFlag) {
      chartRef.current.subscribeCrosshairMove(updateSelectBar);
    }
    return () => {
      chartRef.current?.unsubscribeCrosshairMove(updateSelectBar);
    };
  }, [updateSelectBar, chartReadyFlag]);

  useUpdateEffect(() => {
    if (symbol && symbolsInfoMap && symbolsInfoMap[symbol]) {
      if (symbolsInfoMap[symbol]) {
        candlestickSeriesRef.current?.applyOptions({
          priceFormat: {
            precision: symbolsInfoMap[symbol].precision,
            minMove: Number(symbolsInfoMap[symbol].priceIncrement),
          },
        });
      }
    }
  }, [symbolsInfoMap, symbol, resolution, isRefresh]);

  useUpdateEffect(() => {
    (async () => {
      if (symbol) {
        try {
          setChangeResolutionLoading(true);
          await syncHistoryCandles(symbol, resolution);
        } finally {
          setChangeResolutionLoading(false);
        }
      }
    })();

    return () => {
      setCandleData([]);
    };
  }, [symbol, resolution]);

  useMount(() => {
    (async () => {
      if (symbol) {
        try {
          setChangeResolutionLoading(true);
          await syncHistoryCandles(symbol, resolution);
        } finally {
          setChangeResolutionLoading(false);
        }
      }
    })();
  })
}