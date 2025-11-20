/**
 * Owner: will.wang@kupotech.com
 */
import { IChartApi, createChart, LineStyle, ISeriesApi } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from '@kux/mui-next';
import { dateTimeFormat } from '@kux/mui-next/utils';
import useScreen from '@/hooks/useScreen';
import useChartResize from '@/components/KLineChart/hooks/useChartResize';
import { useLang } from 'gbiz-next/hooks';
import { useUnmount } from 'ahooks';

// 初始化chart实例
export default function useChartInstance(options: {
  domId: string;
  isDialog: boolean;
  resolution: string;
}) {
  const theme = useTheme();
  const { domId, isDialog, resolution } = options;
  const kLineContainer = useRef<HTMLDivElement | null>(null);
  const chartRef =  useRef<IChartApi | null>(null)
  const [chartReadyFlag, setChartReadyFlag] = useState(false);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  const { currentLang: lang } = useLang();

  const { isSm } = useScreen();

  const timeFormatter = useCallback(
    (timestamp: string) => {
      let options = {};
      // const _lang = lang.replace('_', '-');
      if (resolution === '1W' || resolution === '1D') {
        options = {
          hour: undefined,
          minute: undefined,
          second: undefined,
        };
      } else {
        options = {
          year: undefined,
          second: undefined,
        };
      }
      const resultDate = dateTimeFormat({
        lang: 'en_US',
        date: timestamp,
        options,
      });
      return resultDate;
    },
    [resolution],
  );


  const initChart = useCallback(() => {
    const dom = document.getElementById(domId);

    // if (!dom|| noData || chartRef.current) return;
    if (!dom) return;

    dom.oncontextmenu = () => false;
    chartRef.current = createChart(dom, {
      timeScale: {
        rightBarStaysOnScroll: true,
        // fixLeftEdge: true,
        fixRightEdge: true,
        allowBoldLabels: false,
        borderColor: 'rgba(29, 29, 29, 0.08)',
      },
      handleScroll: {
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      rightPriceScale: { borderVisible: false },
      localization: {
        locale: 'en-US',
        timeFormatter: (timestamp) => {
          // return moment(timestamp).utc().format('YYYY/MM/DD HH:mm:ss');
          return timeFormatter(timestamp);
        },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: {
          color: 'rgba(29, 29, 29, 0.04)',
          style: isDialog ? LineStyle.Dashed : LineStyle.Solid,
        },
      },
      layout: {
        textColor: theme.colors.text60,
        attributionLogo: false,
      },
      crosshair: {
        // style: LineStyle.Dashed,
        // horzLine: false,
        vertLine: { style: 2, color: theme.colors.primary },
      },
    });

    chartRef.current.applyOptions({
      localization: { locale: lang.replace('_', '-'), timeFormatter },
      timeScale: {
        tickMarkFormatter: timeFormatter,
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: theme.colors.primary,
      downColor: theme.colors.secondary,
      borderUpColor: theme.colors.primary,
      borderDownColor: theme.colors.secondary,
      borderVisible: false,
    });
    candlestickSeriesRef.current.setData([]);
    setChartReadyFlag(true);
  }, [domId, isDialog, lang, theme.colors.primary, theme.colors.secondary, theme.colors.text60, timeFormatter]);

  useChartResize({ chartRef, domId, isSm });

  useUnmount(() => {
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }
  })

  return {
    chartReadyFlag,
    chartRef,
    kLineContainer,
    candlestickSeriesRef,
    initChart,
  }
}

