/**
 * Owner: garuda@kupotech.com
 * 存放提取保证金相关的字段
 */
import extend from 'dva-model-extend';

import base from 'common/models/base';
import {
  getMaxWithdrawMargin,
  postOperatorMargin,
  postAppendMargin,
  getWithdrawAvailable,
} from '@/services/futures';
import { MARGIN_ERROR } from '@/pages/Futures/components/OperatorMargin/config';

export default extend(base, {
  namespace: 'futures_operator_margin',
  state: {
    showWithdrawMargin: false, // 是否展示提取保证金
    operatorMarginVisible: false, // 追加/减少保证金弹框
    maxWithdrawMarginMap: {}, // 最大可提取保证金 map
    changeRealLeverageVisible: false, // 调整真实杠杆弹框
  },
  reducers: {},
  effects: {
    *getMaxWithdrawMargin({ payload }, { select, call, put }) {
      const updateWithdrawMarginMap = yield select(
        (state) => state.futures_operator_margin.maxWithdrawMarginMap,
      );
      const data = yield call(getMaxWithdrawMargin, payload);
      if (data.success) {
        updateWithdrawMarginMap[payload.symbol] = data.data;
        yield put({
          type: 'update',
          payload: {
            maxWithdrawMarginMap: updateWithdrawMarginMap,
          },
        });
      }
    },
    *getWithdrawAvailable({ payload }, { call, put }) {
      const data = yield call(getWithdrawAvailable, payload);
      if (data.success) {
        yield put({
          type: 'update',
          payload: {
            showWithdrawMargin: data.data,
          },
        });
      }
    },
    *postOperatorMargin({ payload }, { call }) {
      try {
        const { isAppend, symbol, margin } = payload;
        if (isAppend) {
          return yield call(postAppendMargin, { margin, symbol });
        }
        return yield call(postOperatorMargin, { withdrawAmount: margin, symbol });
      } catch (err) {
        // 判断不属于以下code 直接走 toast 报错
        if (!err || !MARGIN_ERROR.includes(err.code)) {
          throw err;
        }
        return err;
      }
    },
  },
  subscriptions: {},
});
