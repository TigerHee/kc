/*
 * @Owner: mike@kupotech.com
 */
import React from 'react';
import { Line } from '@ant-design/plots';
import { floatToPercent } from 'Bot/helper';
import { showDatetime } from 'helper';
import Empty from '@mui/Empty';
import Spin from '@mui/Spin';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useTheme } from '@kux/mui';


/**
 * @description: 当前状态里面的这折线图
 * @return {*}
 */
export default React.memo(({ data, noData, loading }) => {
  const theme = useTheme();
  if (noData) {
    return <Empty style={{ minHeight: 300 }} />;
  }
  if (loading) {
    return (
      <Spin style={{ minHeight: 300 }} />
    );
  }

  const config = {
    data,
    smooth: true,
    xField: 'day',
    yField: 'profitRate',
    seriesField: 'type',
    colorField: 'type',
    color: [theme.colors.primary, theme.colors.complementary],
    legend: {
      position: 'top-left',
      marker: {
        symbol: 'circle',
      },
      itemName: {
        style: {
          fill: theme.colors.text30,
          fontSize: 12,
        },
      },
      itemSpacing: 16,
    },
    tooltip: {
      showTitle: false,
      formatter: (datum) => {
        return {
          name: datum.type,
          value: floatToPercent(datum.profitRate, 2),
        };
      },
    },
    xAxis: {
      line: {
        style: {
          stroke: theme.colors.text30,
          lineWidth: 1,
        },
      },
      label: {
        formatter: (v) => {
          return showDatetime(v, 'MM-DD HH:mm');
        },
        style: {
          fill: theme.colors.text30,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => floatToPercent(v, 2),
        style: {
          fill: theme.colors.text30,
        },
      },
      grid: {
        line: {
          style: {
            stroke: theme.colors.text30,
            lineWidth: 1,
            lineDash: [4, 5],
          },
        },
      },
    },
  };

  return <Line {...config} />;
});

/**
 * @description: 智能持仓 排行榜详情
 * @return {*}
 */
export const RankingDetailLine = React.memo(({ data, loading, noData = false }) => {
  const theme = useTheme();
  if (noData) {
    return <Empty style={{ minHeight: 200 }} />;
  }

  if (loading) {
    return (
      <Spin style={{ minHeight: 200 }} />
    );
  }

  const config = {
    data,
    height: 200,
    smooth: true,
    xField: 'day',
    yField: 'profit_rate',
    color: theme.colors.text,
    tooltip: {
      formatter: (datum) => {
        return {
          name: _t('machinedetail20'),
          value: floatToPercent(datum.profit_rate, 2),
        };
      },
      domStyles: {
        'g2-tooltip': {
          boxShadow: 'none', // 智能持仓折线图去掉阴影
          'background-color': '#737E8D',
          color: '#11151F',
        },
      },
    },
    xAxis: false,
    yAxis: {
      label: {
        formatter: (v) => floatToPercent(v, 2),
        style: {
          fill: theme.colors.text,
        },
      },
      grid: {
        line: {
          style: {
            stroke: theme.colors.text30,
            lineWidth: 1,
            lineDash: [1, 4],
          },
        },
      },
    },
  };
  return <Line {...config} className="recentProfits" />;
});
