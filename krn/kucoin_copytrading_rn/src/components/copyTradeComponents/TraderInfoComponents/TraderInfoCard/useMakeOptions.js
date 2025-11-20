import {useMemo} from 'react';
import {useTheme} from '@krn/ui';

import {useGetChartColors} from 'hooks/copyTrade/charts/useGetChartColors';
import {
  convertChartPx,
  generateLineVisualMap,
  getPnlGradient,
} from 'utils/echart-helper';
import {safeArray} from 'utils/helper';

export const useMakeOptions = ({totalPnlDate}) => {
  const safePnlList = safeArray(totalPnlDate).map(i => {
    if (Number(i) === 0) {
      return i;
    }
    return i;
  });
  const xData = safePnlList.map((i, index) => index + 1);

  const max = Math.max(...safePnlList);
  const min = Math.min(...safePnlList);

  const {type, cstyle} = useTheme();
  const light = type === 'light';
  const {red, green} = useGetChartColors();
  const isAllElementEqZero = safePnlList?.every(i => Number(i) === 0);

  const visualMap = generateLineVisualMap({
    red,
    green,
    isAllElementEqZero,
    cstyle,
  });

  const options = useMemo(
    () => ({
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        large: true,
        type: 'value',
        show: false,
      },
      grid: {
        top: convertChartPx(5),
        bottom: 3,
        left: 0,
        right: 0,
      },
      visualMap,
      series: [
        {
          large: true,
          animation: false,
          showSymbol: false,
          smooth: 0.15,
          data: safePnlList,
          type: 'line',
          areaStyle: {
            opacity: 0.2,
            color: getPnlGradient({
              max,
              min,
              light,
              cstyle,
            }),
          },
          lineStyle: {
            width: 1.2,
          },
        },
      ],
    }),
    [cstyle, light, max, min, safePnlList, visualMap, xData],
  );
  return options;
};
