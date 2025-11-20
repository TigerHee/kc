/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useLayoutEffect } from 'react';
import { getMatchOrderDetailById } from 'FutureGrid/services';
import isEmpty from 'lodash/isEmpty';
import Decimal from 'decimal.js';
import { checkStatus } from './History';
import { Text } from 'Bot/components/Widgets';
import { SpotDetail } from 'Bot/components/Common/history/detail';

const handleMatcher = (buy, stopOrderItem) => {
  // matchPrice 不为空需要特殊处理
  if (!buy.matchPrice) return;
  // 成交价格
  buy.price = buy.matchPrice;
  // 成交金额
  const temp = Decimal(stopOrderItem.price).div(stopOrderItem.dealValue);
  buy.dealValue = Decimal(buy.matchPrice).div(temp).toFixed(12, Decimal.ROUND_DOWN);
  // 手续费
  buy.fee = Decimal(buy.dealValue)
    .times(6 / 10000)
    .toFixed(12, Decimal.ROUND_DOWN);
};

const HistoryDetail = ({ stopOrderItem, symbolInfo, status }) => {
  const id = stopOrderItem.matchNo ? stopOrderItem.matchNo : 'nevermatch';
  const isShowMatcher = id !== 'nevermatch';
  const { profitPrecision } = symbolInfo;
  const [buy, setBuy] = useState({
    dealSize: 0,
    fee: 0,
    isLoaded: false,
  });
  // 获取匹配的单子
  useLayoutEffect(() => {
    isShowMatcher &&
      getMatchOrderDetailById(id).then(({ data }) => {
        const buyFoo = data;
        if (buyFoo) {
          handleMatcher(buyFoo, stopOrderItem);
          setBuy(buyFoo);
        }
      });
  }, []);

  const { profitText, isToBeClosed } = checkStatus(stopOrderItem, profitPrecision, status);
  const profit = <Text color={isToBeClosed ? 'text' : 'primary'}>{profitText}</Text>;

  if (isEmpty(stopOrderItem)) {
    return null;
  }

  return (
    <SpotDetail
      order={{ ...stopOrderItem, profit }}
      buy={buy}
      symbolInfo={symbolInfo}
      isShowMatcher={isShowMatcher}
      isShowFeePopover={isToBeClosed}
    />
  );
};
export default HistoryDetail;
