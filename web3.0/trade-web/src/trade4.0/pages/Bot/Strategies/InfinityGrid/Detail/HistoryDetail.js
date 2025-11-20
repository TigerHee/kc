/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useLayoutEffect } from 'react';
import { getMatchOrderDetailById } from 'InfinityGrid/services';
import isEmpty from 'lodash/isEmpty';
import { SpotDetail } from 'Bot/components/Common/history/detail';
import { getDealAvg } from 'Bot/utils/util';

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
      getMatchOrderDetailById({
        dealSize: Number(stopOrderItem.dealSize),
        orderId: id,
        taskId,
      }).then(({ data }) => {
        if (data) {
          data.pprice = getDealAvg(data, symbolInfo.pricePrecision);
          setBuy(data);
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
