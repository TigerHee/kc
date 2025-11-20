/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import mulPagination from 'common/models/mulPagination';

import {
  getBorrowSize,
  postBorrow,
  postRepay,
  pullExpectedRate,
} from 'services/margin';

export default extend(base, mulPagination, {
  namespace: 'marginBorrow',
  state: {
    expecteDate: undefined,
    borrowSize: null,
    borrowResult: null,

    symbolBorrowSize: {},
  },
  reducers: {

  },
  effects: {

    *pullBorrowSize({ payload = {} }, { put, call, select }) {
      const { userPosition } = yield select(state => state.marginMeta);
      if (!userPosition || !userPosition.openFlag) return;
      const { data, success } = yield call(getBorrowSize, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            borrowSize: data,
          },
        });
      }
    },
    *postBorrow({ payload = {} }, { call }) {
      const res = yield call(postBorrow, payload);
      return res;
    },
    *postRepay({ payload = {} }, { call }) {
      const res = yield call(postRepay, payload);
      return res;
    },
    *getExpectedRate({ payload = {} }, { call, put }) {
      const { data, success } = yield call(pullExpectedRate, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            expecteDate: data.rate,
          },
        });
      }
    },

    *getSymbolsBorrowSize({ payload = {} }, { select, all, call }) {
      // const  { coins } = payload;
      const { symbolBorrowSize } = yield select(state => state.marginBorrow);

      return symbolBorrowSize;
    },

    *triggerGetBorrowSize({ payload }, { call, all, put, select }) {
      const { symbol } = payload;
      const { symbolsMap } = yield select(state => state.symbols);
      if (!symbolsMap[symbol] || !symbolsMap[symbol].isMarginEnabled) return;
      const [baseCoin, quoteCoin] = symbol.split('-');
      const result = yield all([
        call(getBorrowSize, { currency: baseCoin }),
        call(getBorrowSize, { currency: quoteCoin }),
      ]);

      const symbolBorrowSize = result.reduce((rsult, cur) => {
        const { data } = cur;
        return {
          ...rsult,
          [data.currency]: {
            ...data,
          },
        };
      }, {});
      yield put({
        type: 'update',
        payload: {
          symbolBorrowSize: { ...symbolBorrowSize },
        },
      });
    },
  },
});
