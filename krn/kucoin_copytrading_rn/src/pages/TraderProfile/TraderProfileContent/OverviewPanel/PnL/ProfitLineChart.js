import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {useTheme} from '@krn/ui';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {useGetChartColors} from 'hooks/copyTrade/charts/useGetChartColors';
import useLang from 'hooks/useLang';
import {useMakeChartFormatHelper} from 'hooks/useMakeChartFormatHelper';
import {convertPxToReal} from 'utils/computedPx';
import {
  convertChartPx,
  generateLineVisualMap,
  getPnlGradient,
} from 'utils/echart-helper';
import {formatNumberShow, safeArray} from 'utils/helper';
import {ShowPnlSwitchType} from '../constant';
import {formatPercent} from '../helper';

const TEXT_GAP_CHAR = '    ';

const useMakeOptions = ({pnlList, showType}) => {
  const {dateTimeFormat, amountFormat, percentFormat} =
    useMakeChartFormatHelper();
  const {_t} = useLang();
  const {type, colorV2, cstyle} = useTheme();
  const light = type === 'light';
  const {red, green} = useGetChartColors();

  const safePnlList = safeArray(pnlList);

  const isProfitShowType = showType === ShowPnlSwitchType.profit;
  const data = useMemo(
    () =>
      safePnlList.map(item => (isProfitShowType ? item.pnl : item.ratio)) || [],
    [safePnlList, isProfitShowType],
  );

  const dateList = safePnlList.map(item => item.statTime); // 使用转换后的日期

  const options = useMemo(() => {
    const {cover12, text40} = colorV2;
    const max = Math.max(...data);
    const min = Math.min(...data);

    const isAllElementEqZero = data?.every(i => Number(i) === 0);

    const visualMap = generateLineVisualMap({
      red,
      green,
      isAllElementEqZero,
      cstyle,
    });

    return {
      xAxis: {
        data: dateList,
        type: 'category',
        boundaryGap: false,
        axisLine: {show: false},
        axisTick: {show: false},
        splitNumber: 3, // 设置 Y 轴刻度数量最多为 5
        axisLabel: {
          formatter: value => moment(parseInt(value, 10)).format('M/D'),
          show: true,
          color: text40,
          fontSize: 10,
          alignMaxLabel: 'right',
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        axisLine: {show: false},
        splitNumber: 3,
        axisLabel: {
          show: true,
          color: text40,
          fontSize: 10,
          formatter: val =>
            isProfitShowType ? formatNumberShow(val, 2) : formatPercent(val),
        },
        axisTick: {show: false},
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: cover12,
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
          const {name: dateTimeStamp, value} = params[0] || {};
          const profitRadioText = `${_t(
            '35ab2ab6ea154000aab7',
          )}${TEXT_GAP_CHAR}${percentFormat(value)}`;
          const profitText = `${_t(
            '028edb3d3d0d4000a2dd',
          )}${TEXT_GAP_CHAR}${amountFormat(value)} ${getBaseCurrency()}`;

          return `${dateTimeFormat(+dateTimeStamp)} \n${
            isProfitShowType ? profitText : profitRadioText
          }`;
        },
        trigger: 'axis', // 坐标轴触发
        backgroundColor: '#2D2D2F', // 初始背景半透明
        textStyle: {
          lineHeight: 15.6,
          fontSize: 14,
          fontWeight: 600,
          color: '#fff', // 文字颜色
        },
      },
      grid: {
        left: 16, // 距离容器左侧的距离
        right: 16, // 距离容器右侧的距离
        top: 16, // 距离容器顶部的距离
        bottom: convertPxToReal(6), // 距离容器底部的距离
        containLabel: true, // 确保标签不会超出容器
      },
      series: [
        {
          data,
          itemStyle: {
            borderColor: '#FFF',
            borderWidth: convertChartPx(1.5),
          },
          animation: false,
          showSymbol: false,
          smooth: true,
          type: 'line',
          lineStyle: {
            width: convertChartPx(2),
          },
          areaStyle: {
            opacity: 0.2,
            color: getPnlGradient({
              max,
              min,
              light,
              cstyle,
            }),
          },
        },
      ],
      visualMap,
    };
  }, [
    _t,
    amountFormat,
    colorV2,
    cstyle,
    data,
    dateList,
    dateTimeFormat,
    green,
    isProfitShowType,
    light,
    percentFormat,
    red,
  ]);
  return options;
};

const ProfitLineChart = ({pnlList, showType}) => {
  const option = useMakeOptions({pnlList, showType});

  return (
    <DynamicEcharts
      width={convertPxToReal(343)}
      height={convertPxToReal(186)}
      option={option}
    />
  );
};

export default memo(ProfitLineChart);
