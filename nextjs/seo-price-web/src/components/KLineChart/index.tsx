/**
 * Owner: will.wang@kupotech.com
 */
import styles from "./styles.module.scss";
import useScreen from "@/hooks/useScreen";
import ScaleButton from "@/components/KLineChart/components/ScaleButton";
import LogoBar from "@/components/LogoBar";
import LoadingSpin from "@/components/KLineChart/components/LoadingSpin";
import LoadingNoData from "@/components/KLineChart/components/LoadingNoData";
import clsx from "clsx";
import { DurationInputArg1 } from "moment";
import { useState } from "react";
import useChartInstance from "@/components/KLineChart/hooks/useChartInstance";
import { useMount } from "ahooks";
import { saTrackForBiz } from "@/tools/ga";
import useChartData from "@/components/KLineChart/hooks/useChartData";
import useSideEffects from "@/components/KLineChart/hooks/useSideEffects";
import { useLang } from "gbiz-next/hooks";

type KLineProps = {
  coin: string;
  hideScale?: boolean;
  className?: string;
  _wsInstanceId: number;
  symbol: string;
  resolution: string;
  timeRange: DurationInputArg1;
  limitPoints: number;
  resolutionLabel: string;
  isUnsaleATemporary: boolean;
  noData: boolean;
  setNoData: (isNoata: boolean) => void;
  domId?: string;
  height?: number;
  isDialog?: boolean;
};

export default function KLineChart(props: KLineProps) {
  const {
    coin,
    isUnsaleATemporary,
    hideScale = false,
    domId = "price_coin_chart",
    height = 170,
    isDialog = false,
    noData,
    limitPoints,
    symbol,
    timeRange,
    resolution,
    _wsInstanceId,
    resolutionLabel,
    className,
    setNoData,
  } = props;
  const { isSm } = useScreen();
  const { currentLang: lang } = useLang()
  const [changeResolutionLoading, setChangeResolutionLoading] = useState(false);

  const { initChart, chartRef, chartSeriesRef } = useChartInstance({
    domId,
    isDialog,
    noData,
  });

  const { cacheLineDataRef, shouldHide, setCandleData, isRefresh, setRefresh, syncHistoryCandles } = useChartData({
    coin,
    chartRef,
    chartSeriesRef,
    resolutionLabel,
    limitPoints,
    symbol,
    resolution,
    timeRange,
    _wsInstanceId,
  });

  useSideEffects({
    lang, chartRef, symbol, changeResolutionLoading, cacheLineDataRef, setNoData, setChangeResolutionLoading, syncHistoryCandles, timeRange, resolution, setCandleData, chartSeriesRef, isRefresh, isUnsaleATemporary, setRefresh,
  });

  // chart初始化
  useMount(() => {
    console.log()
    // 初始化图表实例
    initChart();
    setRefresh({});

    // 埋点
    try {
      saTrackForBiz({}, ["Kline", "3"]);
    } catch (e) {
      console.log("e", e);
    }
  });

  const showScaleButton =
    !hideScale &&
    isSm &&
    !changeResolutionLoading &&
    cacheLineDataRef.current?.length > 0;
  const showLogoBar =
    !changeResolutionLoading && cacheLineDataRef.current?.length > 0;

  const showLoading = changeResolutionLoading;
  const showNoData = false;

  const hideStyle = shouldHide ? { display: 'none' }  : {};

  return (
    <div
      className={clsx(styles.klineOuter, className)}
      data-inspector="price-kline-line-chart"
      style={hideStyle}
    >
      <div className={styles.klineContainer} style={isSm ? { height: height } : {}} id={domId}>
        {showScaleButton && <ScaleButton />}
        {showLogoBar && <LogoBar />}
      </div>

      {showLoading && <LoadingSpin />}
      {showNoData && <LoadingNoData />}
    </div>
  );
};
