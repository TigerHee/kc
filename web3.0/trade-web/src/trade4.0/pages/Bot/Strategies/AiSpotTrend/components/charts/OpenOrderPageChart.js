/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import * as seriesOptions from './config';
import CreatePageChartLazy from './CreatePageChartLazy';
import { numberFixed } from 'Bot/helper';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { _t } from 'Bot/utils/lang';

const makeUpData = (data = [], speedLines = [], pricePrecision) => {
  const [from, to] = data;
  const fromTime = moment(from.time).valueOf();
  const toTime = moment(to.time).valueOf();
  const makeUp = [];
  speedLines.forEach(hour => {
    const time = moment(hour.time).valueOf();
    const maxValue = Math.max(hour.weightedPrice, hour.standPrice);
    if (fromTime <= time && toTime >= time) {
      makeUp.push({
        time: hour.time,
        value: Number(numberFixed(maxValue, pricePrecision)),
      });
    }
  });
  return makeUp;
};
/**
 * @description: 数据变更,更细绘制
 * @param {*} chartRef
 * @param {*} hourKline
 * @param {*} arbitrageInfo
 * @return {*}
 */
const updateChartArea = ({
  chartRef,
  hourKline: speedLines = [],
  arbitrageInfo = [],
  pricePrecision,
  priceIncrement,
}) => {
  const chart = chartRef.current.chart;

  let { weightedLine, standLine } = chartRef.current.allSeries;
  const colorAreaSeries = chartRef.current.allSeries.colorAreaSeries;
  if (isEmpty(standLine) && isEmpty(weightedLine)) {
    standLine = chart.addLineSeries({
      color: '#F8B200',
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    weightedLine = chart.addLineSeries({
      color: '#AF55FF',
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });
  }
  // 绘制主区域
  const standData = [];
  const weightedData = [];
  speedLines.forEach(el => {
    standData.push({
      time: el.time,
      value: Number(numberFixed(el.standPrice, pricePrecision)),
    });
    weightedData.push({
      time: el.time,
      value: Number(numberFixed(el.weightedPrice, pricePrecision)),
    });
  });

  standLine.setData(standData);
  weightedLine.setData(weightedData);

  standLine.applyOptions({
    priceFormat: {
      type: 'price',
      precision: pricePrecision,
      minMove: priceIncrement,
    },
  });

  // 先暴力清除 套利区域
  if (!isEmpty(colorAreaSeries)) {
    colorAreaSeries.forEach(series => {
      chart.removeSeries(series.areaSeries);
    });
    chartRef.current.allSeries.colorAreaSeries = [];
  }

  // 绘制套利区域
  const colorAreaSeriesHere = arbitrageInfo
    .filter(arbitrage => !!arbitrage.sellTime && !!arbitrage.buyTime)
    .map(arbitrage => {
      let { buyTime, sellTime, buyPrice, sellPrice, profitRate, profit } = arbitrage;
      profitRate = Number(profitRate);
      profit = Number(profit);
      buyPrice = Number(numberFixed(buyPrice, pricePrecision));
      sellPrice = Number(numberFixed(sellPrice, pricePrecision));
      // 后端把这两个字段的值设置反了
      if (buyTime > sellTime) {
        [buyTime, sellTime] = [sellTime, buyTime];
      }
      let data = [
        { time: buyTime, value: buyPrice },
        { time: sellTime, value: sellPrice },
      ];
      data = makeUpData(data, speedLines, pricePrecision);
      const isProfit = (profitRate || profit) > 0;
      const areaSeries = chart.addAreaSeries(
        isProfit ? seriesOptions.primaryOptions : seriesOptions.secondaryOptions,
      );
      areaSeries.setData(data);
      return {
        areaSeries,
        arbitrage,
        // markers
      };
    });

  // 下次清除
  chartRef.current.allSeries = {
    standLine,
    weightedLine,
    colorAreaSeries: colorAreaSeriesHere,
  };
};

export default ({ speedLines, ...rest }) => {
  return (
    <CreatePageChartLazy
      autoSize={false}
      hourKline={speedLines}
      updateChart={updateChartArea}
      title={_t('currentstatus')}
      hint={_t('openorderchart')}
      {...rest}
    />
  );
};
