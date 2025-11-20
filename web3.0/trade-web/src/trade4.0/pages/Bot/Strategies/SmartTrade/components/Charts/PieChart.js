/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Pie } from '@ant-design/plots';
import { colors } from 'SmartTrade/config';
import { floatText } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';

export default React.memo(({ data = [] }) => {
  const config = {
    height: 200,
    appendPadding: 10,
    data: data.filter((coin) => Number(coin.formatedPercent) > 0),
    angleField: 'formatedPercent',
    colorField: 'currency',
    color: colors,
    radius: 0.9,
    legend: false,
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.currency,
          value: floatText(datum.formatedPercent),
        };
      },
    },
    pieStyle: {
      stroke: 'transparent',
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ formatedPercent }) => floatText(formatedPercent),
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
});
