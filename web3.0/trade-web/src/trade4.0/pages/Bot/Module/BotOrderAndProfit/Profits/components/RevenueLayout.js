/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Bar } from '@ant-design/plots';
import { useTheme } from '@kux/mui';
import { formatNumber, numberResolve, reverseText } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import { Container } from './Main';

export default function ({ profitDistributions = [] }) {
  const { colors } = useTheme();

  const config = {
    data: profitDistributions,
    animation: false,
    autoFit: true,
    padding: 'auto',
    xField: 'showprofit',
    yField: 'templateName',
    lineStyle: {
      stroke: colors.primary,
    },
    rawFields: ['profit'],
    tooltip: {
      formatter: (value) => {
        return {
          name: _t('fprofit'),
          value: `${formatNumber(value.showprofit, 3)} USDT`,
        };
      },
    },
    color: ({ profit }) => {
      return profit < 0 ? colors.secondary : colors.primary;
    },
    label: {
      // position: 'middle',
      layout: 'overlap',
      style: {
        fill: colors.text,
      },
      formatter: (value) => {
        return reverseText(formatNumber(value.showprofit, 2));
      },
    },
    yAxis: {
      line: null,
      tickLine: false,
      label: {
        style: {
          fill: colors.text30,
        },
      },
    },
    xAxis: {
      label: {
        formatter: (value) => {
          return numberResolve(value);
        },
        style: {
          fill: colors.text30,
        },
      },
      grid: {
        line: {
          style: {
            lineDash: [2, 2],
            opacity: 0.12,
            lineWidth: 1,
          },
        },
      },
    },
  };
  return (
    <div>
      <Container dir="ltr">
        <Bar {...config} />
      </Container>
    </div>
  );
}
