/**
 * Owner: ella@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { makeBet, getBetResult, getCoinInfo, getStatsBySymbol } from 'services/bitcoinHalving';

export default extend(base, {
  namespace: 'bitcoinHalving',
  state: {
    fallPercent: null,
    risePercent: null,
    coinInfo: {},
    tradeData: {},
  },
  effects: {
    *makeBet({ payload }, { call }) {
      const { success } = yield call(makeBet, payload);
      return success;
    },
    *getBetResult({ payload }, { call, put }) {
      const { success, data } = yield call(getBetResult, payload);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            risePercent: data.risePercent || null,
            fallPercent: data.fallPercent || null,
          },
        });
      }
    },
    *getCoinInfo({ payload }, { call, put }) {
      const { success, data } = yield call(getCoinInfo, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            coinInfoReady: true,
            coinInfo: data,
          },
        });
      }
    },
    *getStatsBySymbol({ payload }, { call, put, select }) {
      const { success, data } = yield call(getStatsBySymbol, { symbol: payload.bestSymbol });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            tradeData: data,
          },
        });
      }
    },
  },
});
