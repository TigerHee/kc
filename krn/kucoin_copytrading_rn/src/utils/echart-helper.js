import * as echarts from 'echarts/core';

import {convertPxToReal} from './computedPx';

export const getPnlGradient = param => {
  const {max, min, light = true, cstyle} = param;
  const stop = light ? '#FFF' : '#1A1A1A';
  if (max >= 0 && min >= 0) {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: cstyle ? 'green' : 'red',
      },
      {
        offset: 1,
        color: stop,
      },
    ]);
  }
  if (max < 0 && min < 0) {
    return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 1,
        color: stop,
      },
      {
        offset: 0,
        color: cstyle ? 'red' : 'green',
      },
    ]);
  }
  const stopRatio = max / (max - min);
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: cstyle ? 'green' : 'red',
    },
    {
      offset: stopRatio,
      color: stop,
    },
    {
      offset: 1,
      color: cstyle ? 'red' : 'green',
    },
  ]);
};

export const convertChartPx = number => convertPxToReal(number, false);

/** 收益折线图红绿线条pieces生成 ， 优化数据都为 0 时重叠问题 需传入 isAllElementEqZero: boolean */
export const generateLineVisualMap = ({
  cstyle,
  green,
  red,
  isAllElementEqZero,
}) => {
  const pieces = [
    !isAllElementEqZero && {
      lt: 0,
      color: cstyle ? red : green,
    },

    {
      gte: 0,
      lt: 999999999,
      color: cstyle ? green : red,
    },
  ]?.filter(i => !!i);

  return [
    {
      show: false,
      pieces,
    },
  ];
};
