/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useCallback } from 'react';
import { futuresPositionNameSpace } from '../../config';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

export default (props) => {
  const dispatch = useDispatch();
  const tradeHistoryData = useSelector((state) => state[futuresPositionNameSpace].historyOrders);

  const showDetail = useCallback(
    (orderDetail) => {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          orderHistoryVisible: true,
          orderDetail,
        },
      });
    },
    [dispatch],
  );

  return { dataSource: tradeHistoryData, showDetail };
};
