/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useLayoutEffect } from 'react';
import Decimal from 'decimal.js';
import { getMatchOrder } from 'LeverageGrid/services';
import isEmpty from 'lodash/isEmpty';
import { SpotDetail } from 'Bot/components/Common/history/detail';
import { getDealAvg } from 'Bot/utils/util';

/**
 * @description: 获取匹配自身的时候的成交价格
 * @param {*} stopOrderItem
 * @return {*}
 */
const getMatchSelfPrice = (stopOrderItem) => {
  if (stopOrderItem) {
    const strategyExt = JSON.parse(stopOrderItem.strategyExt);
    if (strategyExt) {
      return Number(strategyExt.matchPrice) > 0 ? strategyExt.matchPrice : stopOrderItem.entryPrice;
    }
  }
};
/**
 * @description: 计算匹配的买单字段
 * @param {*} stopOrderItem
 * @param {*} precision
 * @param {*} buy
 * @return {*}
 */
const calcData = ({ stopOrderItem, symbolInfo, buy }) => {
  // 买单的价格
  buy.avgPrice = Decimal(Decimal(buy.dealFunds).toFixed(8))
    .div(buy.dealSize)
    .toFixed(symbolInfo.pricePrecision, Decimal.ROUND_DOWN);
  // 匹配自身
  if (stopOrderItem.matchNo === stopOrderItem.orderId && stopOrderItem.orderId) {
    // 成交价格用入场价格显示
    // 成交金额用 = 成交数量*入场价格
    const selfAvgPrice = getMatchSelfPrice(stopOrderItem);
    if (selfAvgPrice) {
      buy.avgPrice = selfAvgPrice;
    }
    buy.dealFunds = Decimal(buy.avgPrice)
      .times(buy.dealSize)
      .toFixed(symbolInfo.quotaPrecision, Decimal.ROUND_DOWN);
    // 用卖单手续费倒推手续费率
    const feeRate = Decimal(stopOrderItem.fee).div(stopOrderItem.dealFunds);
    buy.fee = Decimal(buy.dealFunds).times(feeRate).toFixed(10, Decimal.ROUND_DOWN);
  }
  return {
    ...buy,
    pprice: buy.avgPrice,
    isLoaded: true,
  };
};

const HistoryDetail = ({ stopOrderItem, symbolInfo }) => {
  const isShowMatcher = orderId !== 'nevermatch';
  const orderId = stopOrderItem.matchNo ?? 'nevermatch';
  const taskId = stopOrderItem.taskId;

  // 成交均价
  const pprice = getDealAvg(stopOrderItem, symbolInfo.pricePrecision);

  const [buy, setBuy] = useState({
    dealSize: 0,
    pprice: 0,
    fee: 0,
    isLoaded: false,
    // side: 'buy',
  });
  // 获取匹配的单子
  useLayoutEffect(() => {
    isShowMatcher &&
      getMatchOrder({ orderId, taskId }).then(({ data }) => {
        const buyOrder = data;
        if (buyOrder) {
          setBuy(calcData({ stopOrderItem, symbolInfo, buy: buyOrder }));
        }
      });
  }, [orderId, taskId]);

  if (isEmpty(stopOrderItem)) {
    return null;
  }
  return (
    <SpotDetail
      order={{ ...stopOrderItem, pprice }}
      buy={buy}
      symbolInfo={symbolInfo}
      isShowMatcher={isShowMatcher}
    />
  );
};

export default HistoryDetail;
