/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { Line } from '@ant-design/plots';
import { styled } from '@kux/mui/emotion';
import { useDispatch } from 'dva';
import { formatNumber, numberResolve } from 'Bot/helper';
import { useTheme } from '@kux/mui';
import Tabs from './Tabs';
import { _t } from 'Bot/utils/lang';
import { Container2 } from './Main';

const TabItems = [
  {
    value: 'WEEKLY',
    label: 'r7days',
  },
  {
    value: 'MONTHLY',
    label: 'r30days',
  },
  {
    value: 'QUARTERLY',
    label: 'r90days',
  },
];
export default function ({ currentDay, data }) {
  const dispatch = useDispatch();
  const { colors, currentTheme } = useTheme();
  const handleChange = useCallback((e) => {
    dispatch({
      type: 'BotProfit/getAccuProfit',
      payload: e,
    });
  }, []);
  const overlay = colors.overlay;

  const con = useMemo(() => {
    const res = {
      autoFit: true,
      data: data[currentDay],
      padding: 'auto',
      xField: 'date',
      yField: 'showprofit',
      lineStyle: {
        stroke: colors.primary,
      },
      xAxis: {
        line: null,
        label: {
          style: {
            fill: colors.text30,
          },
        },
      },
      yAxis: {
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
      point: null,
      tooltip: {
        formatter: (value) => {
          return {
            name: _t('fprofit'),
            value: `${formatNumber(value.showprofit, 3)} USDT`,
          };
        },
      },
    };
    if (data[currentDay].length <= 20) {
      res.point = {
        size: 5,
        shape: 'circle',
        style: {
          fill: overlay,
          stroke: colors.primary,
        },
      };
    }
    return res;
  }, [data, currentDay, overlay]);

  return (
    <div>
      <Tabs current={currentDay} onChange={handleChange} items={TabItems} />
      <Container2>
        <Line {...con} />
      </Container2>
    </div>
  );
}
