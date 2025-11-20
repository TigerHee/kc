import {useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {useTheme} from '@krn/ui';

import {useIsLight} from 'hooks/useIsLight';
import {useMakeChartFormatHelper} from 'hooks/useMakeChartFormatHelper';
import {convertPxToReal} from 'utils/computedPx';
import {
  convertChartPx,
  generateLineVisualMap,
  getPnlGradient,
} from 'utils/echart-helper';
import {safeArray} from 'utils/helper';
import {useGetChartColors} from './useGetChartColors';

/** Main 页面头部收益折线图配置 */
export const useMakeMainPageProfitLineConfig = ({xData, yData}) => {
  const {colorV2, cstyle} = useTheme();
  const light = useIsLight();
  const {red, green} = useGetChartColors();
  const {dateTimeFormat, amountFormat} = useMakeChartFormatHelper();

  return useMemo(() => {
    const [safeXData, safeYData] = [safeArray(xData), safeArray(yData)];
    const max = Math.max(...safeYData);
    const min = Math.min(...safeYData);

    const isAllElementEqZero = safeYData?.every(i => Number(i) === 0);

    const visualMap = generateLineVisualMap({
      red,
      green,
      isAllElementEqZero,
      cstyle,
    });

    return {
      xAxis: {
        type: 'category',
        data: safeXData,
        show: false,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      tooltip: {
        confine: true,
        axisPointer: {
          type: 'line',
          snap: true,
          z: 1,
        },
        formatter: params => {
          const {name: dateTimeStamp, value} = params[0] || {};
          const profitText = amountFormat(value);
          const dateText = dateTimeFormat(dateTimeStamp);
          return `${profitText} ${getBaseCurrency()}  ${dateText}`;
        },
        trigger: 'axis',
        backgroundColor: colorV2.tip,
        textStyle: {
          lineHeight: 15.6,
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
        },
        padding: [convertChartPx(4), convertChartPx(6)],
      },
      grid: {
        // left right增加 4px 保证能显示完整 tooltip的圆点图标
        left: 4,
        right: 4,
        top: convertPxToReal(6),
        bottom: convertPxToReal(6),
      },
      visualMap,
      series: [
        {
          areaStyle: {
            opacity: 0.2,
            color: getPnlGradient({
              max,
              min,
              light,
              cstyle,
            }),
          },
          animation: false,
          showSymbol: false,
          smooth: 0.15,
          data: safeYData,
          type: 'line',
          encode: {
            x: 'statTime',
            y: 'ratio',
          },
        },
      ],
    };
  }, [
    amountFormat,
    colorV2.tip,
    cstyle,
    dateTimeFormat,
    green,
    light,
    red,
    xData,
    yData,
  ]);
};
