/**
 * Owner: will.wang@kupotech.com
 */
import styles from "./style.module.scss";
import useScreen from "@/hooks/useScreen";
import ScaleButton from "@/components/KLineChart/components/ScaleButton";
import LogoBar from "@/components/LogoBar";
import LoadingSpin from "@/components/KLineChart/components/LoadingSpin";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useMount } from "ahooks";
import { saTrackForBiz } from "@/tools/ga";
import useChartInstance from "@/components/CandleChart/useChartInstance";
import useChartData from "@/components/CandleChart/useChartData";
import useChartLocalizationUpdate from "@/components/CandleChart/useChartLocalizationUpdate";
import useDataSideEffects from "@/components/CandleChart/useDataSideEffects";
import useDataSet from "@/components/CandleChart/useDataSet";
import KlineStatus from "@/components/CandleChart/KlineStatus";
import { each, last } from "lodash-es";
import { useMarketStore } from "@/store/market";
import useWsSubscribe, {
  getSymbolTypeFromTopic,
  getSymbolTypes,
  onRealtimeCallKey,
} from "@/hooks/useWsSubscribe";
import evtEmitter from "@/tools/evtEmitter";
import asyncSocket from "@/tools/asyncSocket";

const KLINE_CONTAINER_ID = "kc_s_k_line";

/**
 * datafeed ws数据相关处理
 */
const datafeedWsEv = evtEmitter.getEvt("klineWs");

type CandleProps = {
  className?: string;
  coin: string;
  symbol: string;
  resolution: string;
  useWithShare?: boolean;
  domId?: string;
  hideScale?: boolean;
  height?: number;
  isDialog?: boolean;
  wsInstanceId: number;
};

export default function CandleChart(props: CandleProps) {
  const {
    coin,
    // symbol交易对
    symbol,
    useWithShare = false,
    hideScale = false,
    domId = KLINE_CONTAINER_ID,
    height = 170,
    isDialog = false,
    resolution,
    className,
    wsInstanceId,
  } = props;
  const renderedDomId = domId + `_${useWithShare ? 2 : 1}`;

  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);
  const precision = symbolsInfoMap[symbol]?.precision || 8;

  const { isSm } = useScreen();
  const [changeResolutionLoading, setChangeResolutionLoading] = useState(false);

  const {
    initChart,
    chartReadyFlag,
    chartRef,
    kLineContainer,
    candlestickSeriesRef,
  } = useChartInstance({ domId: renderedDomId, isDialog, resolution });

  const {
    cacheBars,
    isRefresh,
    candleDataToggle,
    updateSelectBar,
    scaleRangeRef,
    selectBar,
    onRealtimeCallbackTemp,
    setCandleData,
    setRefresh,
    syncHistoryCandles,
  } = useChartData({
    coin,
    symbol,
    candlestickSeriesRef,
    resolution,
    kLineContainer,
    _wsInstanceId: wsInstanceId,
  });

  useWsSubscribe({
    wsInstanceId,
    props,
    getTopics: (Topic, props) => {
      const st = getSymbolTypes(props);

      if (props.isUnsaleATemporary) {
        return [
          [Topic.get(`/quicksilver/candles:${st}`), { SYMBOL_TYPES: [st] }],
        ];
      }

      return [[Topic.MARKET_CANDLES, { SYMBOL_TYPES: [st] }]];
    },
    didUpdateDeps: [symbol, resolution],
    onSubscribe: (topic) => {
      const symbolType = getSymbolTypeFromTopic(topic);
      const key = onRealtimeCallKey(wsInstanceId);
      onRealtimeCallbackTemp.current[key] &&
        datafeedWsEv.on(symbolType, onRealtimeCallbackTemp.current[key]);
    },
    onUnSubscribe: (topic) => {
      const st = getSymbolTypeFromTopic(topic);
      const key = onRealtimeCallKey(wsInstanceId);
      onRealtimeCallbackTemp.current[key] &&
        datafeedWsEv.off(st, onRealtimeCallbackTemp.current[key]);
    },
  });

  useChartLocalizationUpdate({ symbol, resolution, chartRef });

  useDataSideEffects({
    chartReadyFlag,
    resolution,
    isRefresh,
    candlestickSeriesRef,
    changeResolutionLoading,
    symbol,
    chartRef,
    updateSelectBar: updateSelectBar.run,
    setCandleData,
    syncHistoryCandles,
    setChangeResolutionLoading,
  });

  useDataSet({
    cacheBars,
    candleDataToggle,
    candlestickSeriesRef,
    scaleRangeRef,
    resolution,
    chartRef,
  });

  // chart初始化
  useMount(() => {
    // 初始化图表实例
    initChart();
    setRefresh({});

    // 埋点
    try {
      saTrackForBiz({}, ["Kline", "3"]);
    } catch (e) {
      console.log("e", e);
    }

    // 订阅topic的数据，然后emit出去
    asyncSocket((socket, ws) => {
      socket.topicMessage(
        ws.Topic.MARKET_CANDLES,
        "trade.candles.update"
      )((arr) => {
        const map = {};
        each(arr, ({ topic, data: { candles } }) => {
          const st = getSymbolTypeFromTopic(topic);
          if (!map[st]) {
            map[st] = {};
          }

          const time = candles[0];
          map[st][time] = candles;
        });

        each(map, (timesMap, st) => {
          datafeedWsEv.emit(st, [st, timesMap]);
        });
      });

      socket.topicMessage(
        ws.Topic.MARKET_CANDLES,
        "trade.candles.add"
      )((arr) => {
        const map = {};
        each(arr, ({ topic, data: { candles } }) => {
          const st = getSymbolTypeFromTopic(topic);
          if (!map[st]) {
            map[st] = {};
          }

          const time = candles[0];
          map[st][time] = candles;
        });

        each(map, (timesMap, st) => {
          datafeedWsEv.emit(st, [st, timesMap]);
        });
      });
    });
  });

  const displayBar = useMemo(() => {
    return selectBar?.time ? selectBar : last(cacheBars);
  }, [cacheBars, selectBar]);

  const showScaleButton =
    !hideScale && isSm && !changeResolutionLoading && cacheBars.length > 0;

  const showLogoBar = !changeResolutionLoading;

  return (
    <div
      className={clsx(styles.wrapper, isDialog && styles.isDialog, className)}
      data-inspector="price-kline-candle-chart"
    >
      <KlineStatus
        bar={displayBar || last(cacheBars)}
        precision={precision}
        symbol={symbol}
      />
      <div
        className={styles.kLineContainer}
        id={renderedDomId}
        style={isSm ? { height } : {}}
        ref={kLineContainer}
      >
        {showScaleButton && <ScaleButton />}
        {showLogoBar && <LogoBar />}
      </div>

      {changeResolutionLoading && <LoadingSpin />}
      {/* {!cacheBars.length && symbol && <LoadingNoData />} */}
    </div>
  );
}
