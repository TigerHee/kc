/**
 * Owner: mike@kupotech.com
 */
import * as seriesOptions from './config';
import { makeUpData } from './util';
import { numberFixed } from 'Bot/helper';
import { isEmpty } from 'lodash';

// arbitrageInfo
// @ApiModelProperty("买单成交时间")
//     private Date buyTime;

//     @ApiModelProperty("卖单成交时间")
//     private Date sellTime;

//     @ApiModelProperty("买单价格")
//     private BigDecimal buyPrice;

//     @ApiModelProperty("卖单价格")
//     private BigDecimal sellPrice;

//     @ApiModelProperty("收益")
//     private BigDecimal profit;

//     @ApiModelProperty("收益率")
//     private BigDecimal profitRate;

// hourKline

// @ApiModelProperty("小时时间")
//     private Date time;

//     @ApiModelProperty("收盘价")
//     private BigDecimal closePrice;

/**
 * @description: 数据变更,更细绘制
 * @param {*} chartRef
 * @param {*} hourKline
 * @param {*} arbitrageInfo
 * @param {*} mode (create)
 * @return {*}
 */
const updateChartArea = ({
  chartRef,
  hourKline = [],
  arbitrageInfo = [],
  mode,
  pricePrecision,
  priceIncrement,
}) => {
  const chart = chartRef.current.chart;

  let { mainAreaSeries } = chartRef.current.allSeries;
  const { colorAreaSeries } = chartRef.current.allSeries;
  if (isEmpty(mainAreaSeries)) {
    mainAreaSeries = chart.addAreaSeries(seriesOptions.bgOptions);
  }
  // 绘制主区域
  const mainData = hourKline.map((el) => {
    return {
      time: el.time,
      value: Number(numberFixed(el.closePrice, pricePrecision)),
    };
  });
  mainAreaSeries.setData(mainData);
  // 设置Y轴精度显示
  mainAreaSeries.applyOptions({
    priceFormat: {
      type: 'price',
      precision: pricePrecision,
      minMove: priceIncrement,
    },
  });

  // 先暴力清除 套利区域
  if (!isEmpty(colorAreaSeries)) {
    colorAreaSeries.forEach((series) => {
      chart.removeSeries(series.areaSeries);
    });
    chartRef.current.allSeries.colorAreaSeries = [];
  }

  let colorAreaSeriesHere = arbitrageInfo;
  // 创建页面图表 需要把 买卖时间不全的 补全
  // if (mode !== 'create') {
  //   colorAreaSeriesHere = arbitrageInfo.filter(
  //     arbitrage => !!arbitrage.sellTime && !!arbitrage.buyTime
  //   );
  // }
  // 绘制套利区域
  colorAreaSeriesHere = colorAreaSeriesHere
    .map((arbitrage) => {
      let { buyTime, sellTime, buyPrice, sellPrice, profitRate, profit } = arbitrage;
      profitRate = Number(profitRate);
      profit = Number(profit);
      buyPrice = Number(numberFixed(buyPrice, pricePrecision));
      sellPrice = Number(numberFixed(sellPrice, pricePrecision));
      // 是否补充过数据
      let isMakeUpData = false;
      // 创建页面图表 需要把 买卖时间不全的 补全
      // 卖单价格没有, 用k线数据最后一条补充
      const lastKLineData = mainData[mainData.length - 1];
      if (!sellTime) {
        sellTime = lastKLineData.time;
        sellPrice = lastKLineData.value;
        isMakeUpData = true;
      }

      // 后端把这两个字段的值设置反了
      if (buyTime > sellTime) {
        [buyTime, sellTime] = [sellTime, buyTime];
      }
      // 数据构造后有可能相同 抛弃
      if (buyTime === sellTime) {
        return null;
      }
      let data = [
        { time: buyTime, value: buyPrice },
        { time: sellTime, value: sellPrice },
      ];
      data = makeUpData(data, mainData);
      const isProfit = isMakeUpData ? sellPrice - buyPrice > 0 : (profitRate || profit) > 0;
      const areaSeries = chart.addAreaSeries(
        isProfit ? seriesOptions.primaryOptions : seriesOptions.secondaryOptions,
      );
      areaSeries.setData(data);

      return {
        areaSeries,
        arbitrage: {
          ...arbitrage,
          buyPrice,
          sellPrice,
          sellTime,
          isMakeUpData,
        },
      };
    })
    .filter((effective) => effective);

  // 下次清除
  chartRef.current.allSeries = {
    mainAreaSeries,
    colorAreaSeries: colorAreaSeriesHere,
  };
};

export default updateChartArea;
