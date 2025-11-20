/**
 * Owner: will.wang@kupotech.com
 */
import { IChartApi, createChart, LineStyle, LineType, ISeriesApi } from 'lightweight-charts';
import { useCallback, useRef } from "react";
import { dateTimeFormat } from '@kux/mui-next/utils';
import theme from '@/config/theme';
import useScreen from '@/hooks/useScreen';
import useChartResize from '@/components/KLineChart/hooks/useChartResize';
import { useUnmount } from 'ahooks';

const timeFormatter  = (timestamp) => {
  let options = {
    timeZone: 'UTC',
  };

  return dateTimeFormat({
    lang: 'en_US',
    date: timestamp,
    options,
  });
}

// 初始化chart实例
export default function useChartInstance(options: {
  domId: string;
  isDialog: boolean;
  noData: boolean;
}) {
  const { domId, isDialog, noData } = options;
  const chartRef =  useRef<IChartApi | null>(null)
  const chartSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  const { isSm } = useScreen();

  const initChart = useCallback(() => {
    const dom = document.getElementById(domId);

    // if (!dom|| noData || chartRef.current) return;
    if (!dom) return;

    dom.oncontextmenu = () => false;
    chartRef.current = createChart(dom, {
      handleScroll: {
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        pinch: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: {
          color: 'rgba(29, 29, 29, 0.04)',
          style: isDialog ? LineStyle.Dashed : LineStyle.Solid,
        },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderColor: 'rgba(29, 29, 29, 0.08)',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        allowBoldLabels: false,
      },
      localization: {
        locale: 'en-US',
        timeFormatter: (timestamp) => {
          return timeFormatter(timestamp * 1000);
        },
      },
      layout: {
        textColor: theme.colors.text60,
        attributionLogo: false,
      },
      crosshair: {
        // TODO: 确认是否有style这个属性，api上没有：  style: LineStyle.Dashed,
        horzLine: { style: 2, color: theme.colors.primary },
        vertLine: { style: 2, color: theme.colors.primary },
      },
    });

    chartRef.current.timeScale().fitContent();

    // AddAreaSeries, 添加series
    chartSeriesRef.current = chartRef.current.addAreaSeries({
      // TODO 确认是否属性可以转成 topColor & bottomColor
      // areaTopColor: theme.colors.primary,
      // areaBottomColor: 'rgba(1, 188, 141, 0)',
      lineColor: theme.colors.primary,
      topColor: theme.colors.primary,
      bottomColor: 'rgba(1, 188, 141, 0)',
      lineWidth: 1,
      lineType: LineType.Curved,
    })
  }, [domId, isDialog]);

  useChartResize({ chartRef, domId, isSm });

  useUnmount(() => {
    chartRef.current?.remove();
  })

  return {
    chartRef,
    chartSeriesRef,
    initChart,
  }
}

