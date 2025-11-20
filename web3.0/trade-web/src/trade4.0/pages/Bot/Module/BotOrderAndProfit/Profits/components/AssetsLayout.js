/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Pie } from '@ant-design/plots';
import { useTheme } from '@kux/mui';
import { times100, floatText, floatToPercent, reverseText } from 'Bot/helper';
import { Container } from './Main';
import { WrapperContext } from '../../config';

export default function ({ assetLayout }) {
  const screen = React.useContext(WrapperContext);
  const data = assetLayout.items || [];
  const { colors } = useTheme();

  const config = {
    data,
    autoFit: true,
    animation: false,
    padding: 'auto',
    angleField: 'showpercent',
    colorField: 'showname',
    radius: 0.8,
    innerRadius: 0.6,
    statistic: null,
    label: null,
    pieStyle: {
      stroke: colors.cover4,
      lineWidth: 2,
    },
    tooltip: {
      formatter: (value) => {
        return {
          name: value.showname,
          value: floatToPercent(value.showpercent),
        };
      },
    },
    legend: {
      // maxWidthRatio: 0.5,
      // itemWidth:180,
      // layout: 'vertical',
      // position: 'bottom',
      // flipPage: false,

      itemValue: {
        alignRight: true,
        formatter: (value) => {
          const tar = data.find((item) => item.showname === value);
          const num = times100(tar.showpercent);
          return num < 1 ? reverseText('<1%') : floatText(num);
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
      flipPage: true,
      maxRow: 3,
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
