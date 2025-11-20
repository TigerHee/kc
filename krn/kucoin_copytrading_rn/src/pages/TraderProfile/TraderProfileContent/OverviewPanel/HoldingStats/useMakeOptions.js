import {useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {useTheme} from '@krn/ui';

import {useGetChartColors} from 'hooks/copyTrade/charts/useGetChartColors';
import {useMakeChartFormatHelper} from 'hooks/useMakeChartFormatHelper';
import {convertChartPx} from 'utils/echart-helper';
import {formatNumberShow, safeArray} from 'utils/helper';
import {
  formatDuration,
  getScaledValue,
  getScatterXLabelByLabelValue,
} from './helper';

const itemStyle = {
  opacity: 1,
};

const TEXT_GAP_CHAR = ' ';

export const useMakeOptions = ({distributionData = []}) => {
  const helper = useMakeChartFormatHelper();
  const {colorV2, cstyle} = useTheme();
  const safeData = safeArray(distributionData);
  const {red, green} = useGetChartColors();

  const holdingScatterOption = useMemo(() => {
    const {amountFormat, _t} = helper;

    const growData = safeData
      .filter(i => i.closePnl >= 0)
      .map(i => [getScaledValue(i.holdTimeMS, 6000), i.closePnl, i.holdTimeMS]);

    const lossData = safeData
      .filter(i => i.closePnl < 0)
      .map(i => [getScaledValue(i.holdTimeMS, 6000), i.closePnl, i.holdTimeMS]);

    return {
      dataset: [
        {
          dimensions: ['x', 'profitValue', 'holdTimeMs'],
          source: growData,
        },
        {
          dimensions: ['x', 'profitValue', 'holdTimeMs'],
          source: lossData,
        },
      ],
      xAxis: {
        axisLine: {show: false},
        axisTick: {show: false},
        type: 'value',
        // 设置最小和最大时间范围
        min: 0,
        max: 6000,
        interval: 1000, // 设置时间间隔，
        axisLabel: {
          formatter: value => getScatterXLabelByLabelValue(value, _t),
          show: true,
          color: colorV2.text40,
          fontSize: 10,
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        axisLine: {show: false},
        splitNumber: 3, // 设置 Y 轴刻度数量最多为 5
        axisLabel: {
          show: true,
          color: colorV2.text40,
          fontSize: 10,
          formatter: formatNumberShow,
        },
        axisTick: {show: false},
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: colorV2.cover12,
            width: convertChartPx(1.1),
          },
        },
      },
      tooltip: {
        confine: true,
        axisPointer: {
          type: 'line',
          snap: true,
          z: 1,
        },
        // 使用函数来自定义 tooltip 的显示内容
        formatter: function (params) {
          const [_, profitValue, timeUnix] = params[0].value || [];
          //  rtl下字符串拼接会镜像，此处 unicode 强制不镜像保证显示正确
          const time = `\u200C${formatDuration(+timeUnix, _t)}`;
          const profitText = `${_t(
            'b8212ff2ae424000a3eb',
          )}:${TEXT_GAP_CHAR}${amountFormat(profitValue)} ${getBaseCurrency()}`;
          return `${time}  \n${profitText}`;
        },
        trigger: 'axis', // 坐标轴触发
        backgroundColor: '#2D2D2F', // 初始背景半透明
        textStyle: {
          lineHeight: 18.2,
          fontSize: 14,
          fontWeight: 600,
          color: '#fff', // 文字颜色
        },
      },
      grid: {
        left: convertChartPx(16), // 距离容器左侧的距离
        right: convertChartPx(16), // 距离容器右侧的距离
        top: convertChartPx(16), // 距离容器顶部的距离
        bottom: convertChartPx(35), // 距离容器底部的距离
        containLabel: true, // 确保标签不会超出容器
      },
      legend: {
        bottom: convertChartPx(2),
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          lineHeight: 15.6,
          fontSize: 10,
          fontWeight: 400,
          color: colorV2.text40,
        },
      },
      series: [
        {
          dataIndex: '1',
          encode: {
            x: 'x', // 将 'x' 维度的数据映射到 x 轴
            y: 'profitValue', // 将 'profitValue' 维度的数据映射到 y 轴
          },
          name: _t('b8212ff2ae424000a3eb'),
          type: 'scatter',
          itemStyle: itemStyle,
          data: growData,
          color: cstyle ? green : red,
          symbolSize: 10,
        },
        {
          dataIndex: '2',
          encode: {
            x: 'x', // 将 'x' 维度的数据映射到 x 轴
            y: 'profitValue', // 将 'profitValue' 维度的数据映射到 y 轴
          },
          name: _t('770ba2f67a474000ad3f'),
          type: 'scatter',
          itemStyle: itemStyle,
          data: lossData,
          color: !cstyle ? green : red,
          symbolSize: 10,
        },
      ],
    };
  }, [colorV2.cover12, colorV2.text40, cstyle, green, helper, red, safeData]);

  return holdingScatterOption;
};
