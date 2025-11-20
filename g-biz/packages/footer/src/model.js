/**
 * Owner: iron@kupotech.com
 */
import extend from 'dva-model-extend';
import polling from '@kc/gbiz-base/lib/polling';
import { PREFIX, BASE_CURRENCY } from './common/constants';
import * as services from './service';

export const namespace = `${PREFIX}_footer`;

const initialValue = {
  summary: {},
  serverTime: 0,
  turnoverRank: {}, // 成交额榜
};
export default extend(polling, {
  namespace,

  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *pullSummary(_, { call, put }) {
      const { data } = yield call(services.getSummary, BASE_CURRENCY);
      let contractSummaryData = null;
      try {
        contractSummaryData = yield call(services.getContractSummary, BASE_CURRENCY);
      } catch (e) {
        contractSummaryData = { data: { volume: 0 } };
      }
      try {
        const {
          data: { volume: contractVolume },
        } = contractSummaryData;
        const summary = {};
        if (data) {
          data.forEach((item) => {
            summary[item.type] = item;
          });
        }
        // 交易量统计加入合约的交易量
        if (summary.TRADING_VOLUME) {
          const item = summary.TRADING_VOLUME;
          summary.TRADING_VOLUME = {
            ...item,
            amount: contractVolume || '0',
          };
        }
        yield put({
          type: 'update',
          payload: { summary },
        });
      } catch (e) {
        console.error('error pull Summary', e);
      }
    },

    *pullServerTime(_, { put, call }) {
      const { data } = yield call(services.getServerTime);
      yield put({ type: 'update', payload: { serverTime: data } });
    },
    // 获取成交额榜
    *getTurnoverRank(_, { put, call }) {
      const { data } = yield call(services.getTurnoverRank, {
        tagId: '6225ad8d491ffe87c4e42490',
      }); // 获取交易榜单数据需要写死tagId
      yield put({ type: 'update', payload: { turnoverRank: data } });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullServerTime',
          interval: 1000 * 60 * 5,
        },
      });
    },
  },
});
