/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Pie } from '@ant-design/plots';
import { colors } from 'SmartTrade/config';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useTheme } from '@kux/mui';

export default React.memo(({ data = [] }) => {
  const theme = useTheme();
  const config = {
    height: 20,
    width: 20,
    autoFit: false,
    appendPadding: 0,
    data: data?.map(el => {
      el.percent = +el.percent;
      return el;
    }),
    angleField: 'percent',
    colorField: 'currency',
    color: colors,
    innerRadius: 0.4,
    radius: 0.98,
    tooltip: false,
    legend: false,
    annotations: false,
    label: false,
    interactions: false,
    statistic: false,
    pieStyle: {
      stroke: theme.colors.overlay,
    },
  };
  return <Pie {...config} />;
});
