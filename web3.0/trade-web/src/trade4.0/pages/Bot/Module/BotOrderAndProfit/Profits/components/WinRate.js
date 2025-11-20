/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Pie } from '@ant-design/plots';
import { useTheme } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import { times100 } from 'Bot/helper';
import { divide } from 'helper';
import { _t } from 'Bot/utils/lang';
import { Container } from './Main';
import { WrapperContext } from '../../config';

const map = {
  balanceCount: 'pc.profitchart1',
  deficitCount: 'pc.profitchart2',
  profitCount: 'pc.profitchart3',
};
const handleData = (data) => {
  const newData = [];
  let totalCount = 0;
  for (const key in data) {
    if (key in map) {
      totalCount += data[key] || 0;
      newData.push({
        count: data[key] || 0,
        label: _t(map[key]),
        name: key,
        orangeKey: key,
      });
    }
  }
  newData.forEach((el) => {
    el.percent =
      totalCount !== 0 ? Number(divide(el.count, totalCount).toFixed(2)) : 0;
    el.value = el.count;
    el.name = _t(map[el.name]);
  });
  return newData;
};
export default function ({ data }) {
  const screen = React.useContext(WrapperContext);
  const { colors } = useTheme();

  const newData = handleData(data);
  const config = {
    data: newData,
    animation: false,
    autoFit: true,
    padding: 'auto',
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.6,
    statistic: null,
    label: null,
    rawFields: ['percent', 'orangeKey'],
    pieStyle: {
      stroke: colors.cover4,
      lineWidth: 2,
    },
    color: [colors.primary, colors.secondary, colors.text60],
    tooltip: {
      fields: ['name', 'percent'],
      formatter: (value) => {
        let name = value.name;
        if (name.endsWith('：')) {
          name = name.substring(0, name.length - 1);
        }
        return {
          name,
          value: `${times100(value.percent) }%`,
        };
      },
    },

    legend: {
      // layout: 'vertical',
      // position: 'bottom',
      // flipPage: false,
      // maxWidthRatio: 0.5,
      // itemWidth: 180,
      itemValue: {
        alignRight: true,
        formatter: (value) => {
          const tar = newData.find((item) => item.name === value);
          return tar.value;
        },
        style: {
          opacity: 1,
          fill: colors.text,
        },
      },
    },
  };
  if (['sm', 'md', 'lg'].includes(screen)) {
    config.legend = {
      ...config.legend,
      position: 'bottom',
      flipPage: false,
    };
  } else {
    config.legend = {
      ...config.legend,
      maxWidthRatio: 0.5,
      itemWidth: 180,
    };
  }
  return (
    <div>
      <Container dir="ltr">
        <Pie {...config} />
      </Container>
    </div>
  );
}
