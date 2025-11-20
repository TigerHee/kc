/**
 * Owner: mike@kupotech.com
 */
import { timeOptions } from './util';
import { localDateTimeFormat, formatNumber } from 'Bot/helper';
import * as LightweightCharts from 'Bot/utils/lightweight-charts.development.mjs';

/**
 * @description: 创建chart实例
 * @param {*} boxRef
 * @param {*} toolTipRef
 * @param {*} theme
 * @return {*}
 */
const createChart = ({ boxRef, theme = {}, pricePrecision, autoSize }) => {
  const {
    colors: { overlay, text40 },
  } = theme;
  const chart = LightweightCharts.createChart(boxRef.current, {
    autoSize,
    width: boxRef.current.clientWidth,
    height: 266,
    layout: {
      textColor: text40,
      background: {
        type: 'solid',
        color: 'transparent',
      },
    },
    priceScale: {
      borderVisible: false,
      entireTextOnly: true,
      autoScale: true,

    },
    rightPriceScale: {
      scaleMargins: {
        top: 0,
        bottom: 0,
      },
      borderVisible: false,
      lineVisible: false,
      entireTextOnly: true,
    },
    timeScale: {
      borderColor: 'rgba(29, 29, 29, 0.04)',
      // rightOffset: 5,
      fixRightEdge: true,
      tickMarkWeightValue: 500,
      timeVisible: true,
      // fixLeftEdge: true
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        visible: false,
      },
    },
    localization: {
      locale: 'en-US',
      timeFormatter: (timestamp) => {
        return localDateTimeFormat(timestamp, timeOptions);
      },
      // priceFormatter(price) {
      //   return formatNumber(price, pricePrecision);
      // },
    },
  });
  const timeScale = chart.timeScale();
  timeScale.applyOptions({
    tickMarkFormatter: (time) => {
      return localDateTimeFormat(time, timeOptions);
    },
  });
  return chart;
};

export default createChart;
