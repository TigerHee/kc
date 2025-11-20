/**
 * Owner: borden@kupotech.com
 */
import { pullOrder, newQueryStopOrderById, queryDealOrders, pullMarginOrder } from 'services/order';

let _orderId = null;

export default {
  state: {
    orderDetail: {},
    fillsRecords: [],
    fillTotal: 0,
    fillCurrent: 1,
  },
  reducers: {
    resetData(state, { payload }) {
      return {
        ...state,
        orderDetail: {},
        fillsRecords: [],
        fillTotal: 0,
        fillCurrent: 1,
      };
    },
  },
  effects: {
    *pullOrder(
      {
        payload: { id /* isStop */ },
      },
      { call, put },
    ) {
      if (id) {
        _orderId = id;
      }
      // const { success, data } = yield call(isStop ? newQueryStopOrderById : pullOrder, _orderId);
      const { success, data } = yield call(pullOrder, _orderId);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            orderDetail: data,
          },
        });
      }
    },
    *pullMarginOrder(
      {
        payload: { id },
      },
      { call, put },
    ) {
      if (id) {
        _orderId = id;
      }
      const { success, data } = yield call(pullMarginOrder, _orderId);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            orderDetail: data,
          },
        });
      }
    },
    *pullFills(
      {
        payload: { id, page, isMargin },
      },
      { call, put },
    ) {
      if (id) {
        _orderId = id;
      }
      const params = {
        orderId: _orderId,
        currentPage: page || 1,
        pageSize: 10,
      };
      if (isMargin) { // 杠杆查询添加参数
        params.tradeType = 'MARGIN_TRADE';
      }
      const { success, items, totalNum } = yield call(queryDealOrders, params);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            fillsRecords: items,
            fillCurrent: page || 1,
            fillTotal: totalNum,
          },
        });
      }
    },
  },
};
