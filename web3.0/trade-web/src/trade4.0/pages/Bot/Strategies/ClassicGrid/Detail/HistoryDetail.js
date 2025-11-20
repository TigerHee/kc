/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useLayoutEffect } from 'react';
import Decimal from 'decimal.js';
import { getMatchOrderDetailById } from 'ClassicGrid/services';
import isEmpty from 'lodash/isEmpty';
import { SpotDetail } from 'Bot/components/Common/history/detail';
import { getDealAvg } from 'Bot/utils/util';
import { formatNumber } from 'Bot/helper';

const calcBuy = (stopOrderItem, buy, symbolInfo) => {
  // 匹配自身
  if (stopOrderItem.matchNo === stopOrderItem.id) {
    // 成交价格用入场价格显示
    // 成交金额用 = 成交数量*入场价格
    buy.pprice =
      Number(stopOrderItem.matchPrice) > 0 ? stopOrderItem.matchPrice : stopOrderItem.entryPrice;
    buy.dealFunds = Decimal(buy.pprice)
      .times(buy.dealSize)
      .toFixed(symbolInfo.quotaPrecision, Decimal.ROUND_DOWN);
    // 用卖单手续费倒推手续费率
    const feeRate = Decimal(stopOrderItem.fee).div(stopOrderItem.dealFunds);
    buy.fee = Decimal(buy.dealFunds).times(feeRate).toFixed(10, Decimal.ROUND_DOWN);
  } else {
    buy.pprice = Decimal(Decimal(buy.dealFunds).toFixed(8))
      .div(buy.dealSize)
      .toFixed(symbolInfo.pricePrecision, Decimal.ROUND_DOWN);
  }
  buy.pprice = formatNumber(buy.pprice);
  return buy;
};

const HistoryDetail = ({ stopOrderItem, symbolInfo }) => {
  const id = stopOrderItem.matchNo ?? 'nevermatch';
  const taskId = stopOrderItem.taskId;
  const isShowMatcher = id !== 'nevermatch';

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
      getMatchOrderDetailById(id, taskId).then(({ data }) => {
        const buyOrder = data[0];
        if (buyOrder) {
          setBuy(calcBuy(stopOrderItem, buyOrder, symbolInfo));
        }
      });
  }, []);

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
