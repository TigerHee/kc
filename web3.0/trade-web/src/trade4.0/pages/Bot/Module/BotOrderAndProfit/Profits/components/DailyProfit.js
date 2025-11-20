/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import { Column } from '@ant-design/plots';
import { useTheme } from '@kux/mui';
import { useDispatch } from 'dva';
import _ from 'lodash';
import { styled } from '@kux/mui/emotion';
import { formatNumber, numberResolve } from 'Bot/helper';
import Tabs from './Tabs';
import { _t } from 'Bot/utils/lang';
import { Container2 } from './Main';


const TabItems = [
  {
    value: 30,
    label: 'r30days',
  },
  {
    value: 90,
    label: 'r90days',
  },
];
export default function ({ day }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(30);
  const oldValue = useRef(30);

  useEffect(() => {
    if (!_.isEmpty(day[value].timeProfits)) {
      oldValue.current = value;
    }
  }, [day, value]);

  const handleChange = (e) => {
    // 保存旧值
    oldValue.current = value;
    setValue(e);
    const data = day[e]?.timeProfits || [];
    dispatch({
      type: 'BotProfit/update',
      payload: {
        currentDay: e,
      },
    });
    // 不存在就去拿
    if (_.isEmpty(data)) {
      dispatch({
        type: 'BotProfit/getDayProfit',
      });
    }
  };
  const data = day[value]?.timeProfits || [];
  const { colors } = useTheme();

  const config = {
    data,
    autoFit: true,
    animation: false,
    padding: 'auto',
    xField: 'time',
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
        formatter: (val) => {
          return numberResolve(val);
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
    rawFields: ['profit'],
    tooltip: {
      formatter: (val) => {
        return {
          name: _t('fprofit'),
          value: `${formatNumber(val.showprofit, 3) } USDT`,
        };
      },
    },
    color: ({ profit }) => {
      return profit < 0 ? colors.secondary : colors.primary;
    },
  };
  return (
    <div>
      <Tabs current={value} onChange={handleChange} items={TabItems} />
      <Container2>
        <Column {...config} />
      </Container2>
    </div>
  );
}
