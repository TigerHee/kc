/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Line } from '@ant-design/plots';
import Decimal from 'decimal.js';
import { showDateTimeByZone, dropZero } from 'Bot/helper';
import styled from '@emotion/styled';
import { useTheme } from '@kux/mui';
import { _t } from 'Bot/utils/lang';

const Box = styled.div`
  height: 200px;
`;
export default ({ open = {}, symbolInfo = {} }) => {
  const theme = useTheme();

  const grayColor = theme.colors.icon40;
  const textColor = theme.colors.text;
  let { avgBuyPrice } = open;
  const { orders } = open;
  const { pricePrecision } = symbolInfo;

  avgBuyPrice = Number(Decimal(avgBuyPrice).toFixed(pricePrecision, Decimal.ROUND_DOWN));
  const data = orders.map((el) => {
    return {
      // day: showDateTimeByZone(el.completionAt, 'YYYY/MM/DD HH:mm'),
      day: el.completionAt,
      value: dropZero(
        Decimal(el.dealFunds).div(el.dealSize).toFixed(pricePrecision, Decimal.ROUND_DOWN),
      ),
    };
  });

  const config = {
    data,
    padding: 'auto',
    color: grayColor,
    lineStyle: {
      lineWidth: 1,
    },
    xField: 'day',
    yField: 'value',
    xAxis: {
      type: 'timeCat',
      label: null,
      tickLine: null,
      line: {
        style: {
          lineWidth: 1,
          stroke: grayColor,
        },
      },
    },
    yAxis: {
      type: 'linear',
      line: {
        style: {
          lineWidth: 1,
          stroke: grayColor,
        },
      },
      label: null,
      grid: null,
    },
    tooltip: {
      customContent: (title, mdata) => {
        const Data = mdata.length > 0 ? mdata[0]?.data : null;
        if (!Data) return '';
        return `<div class="pt-12">${showDateTimeByZone(Data.day, 'YYYY/MM/DD HH:mm')}</div>
            <br/>
            <div class="pb-12">${Data.value} USDT</div>
            `;
      },
    },
    annotations: [
      {
        type: 'line',
        id: 'line',
        top: true,
        start: ['min', avgBuyPrice],
        end: ['max', avgBuyPrice],
        text: {
          content: `${_t('auto.commonbuyprice')}\n\n${avgBuyPrice}`,
          position: 'right',
          offsetY: 18,
          style: {
            textAlign: 'right',
            fill: textColor,
          },
        },
        style: {
          lineWidth: 1,
          lineDash: [3],
          stroke: textColor,
        },
      },
    ],
  };
  if (data.length < 10) {
    config.point = {
      size: 4,
      shape: 'point',
      color: theme.colors.primary,
      style: {
        fill: theme.colors.primary,
      },
    };
  }
  return (
    <Box>
      <Line {...config} />
    </Box>
  );
};
