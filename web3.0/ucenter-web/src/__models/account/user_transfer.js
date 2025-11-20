/**
 * Owner: eli@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import * as serv from 'services/user_transfer';
import { message } from 'src/components/Toast';
import { pullSymbols } from 'src/services/market';

export default extend(base, {
  namespace: 'userTransfer',
  state: {
    userTransferInfo: null,
    userTransferStatus: null,
    assetsCostInfo: null,
    nextFetchBlockTime: 0, // 下一次倒计时请求时间
  },
  effects: {
    *setUserTransferStatus({ payload = {} }, { put }) {
      const { data } = payload;
      console.log('call getUserTransferStatus in userTransfer model');
      yield put({ type: 'update', payload: { userTransferStatus: data } });
    },
    *getUserTransferInfo({ payload = {} }, { call, put }) {
      console.log('call getUserTransferInfo in userTransfer model');
      try {
        const { data } = yield call(serv.pullUserCanTransfer, payload);
        yield put({
          type: 'update',
          payload: {
            userTransferInfo: data,
          },
        });
        return { success: true, data };
      } catch (e) {
        message.error(e?.msg || '');
      }
    },
    *queryUserAssetCost(params, { call, put }) {
      try {
        const { payload } = params;
        const { success, data } = yield call(serv.queryUserAssetCost, payload);
        if (success && data) {
          const { needToClearData, assetCostItemList = [] } = data;
          yield put({
            type: 'update',
            payload: {
              assetsCostInfo: {
                needToClearData,
                assetCostItemList,
              },
            },
          });
        } else {
          message.error('Failed to query AssetCost');
        }
        return { success, data };
      } catch (error) {
        message.error(error?.msg || error?.message);
        return { success: false, data: null };
      }
    },
    *pullSymbols(_, { call, put }) {
      try {
        const { success, data } = yield call(pullSymbols, {});
        if (success) {
          const symbolsMap = data.reduce((acc, val) => {
            acc[val.symbol] = {
              baseCurrency: val.baseCurrency,
              type: val.type,
              quoteCurrency: val.quoteCurrency,
              settleDate: val.settleDate,
              symbol: val.symbol,
            };
            return acc;
          }, {});
          yield put({
            type: 'update',
            payload: {
              // symbols: records,
              symbolsMap,
            },
          });
        } else {
          message.error('Failed to pull symbols');
        }
      } catch (error) {
        message.error(error?.msg || 'Failed to pull symbols');
      }
    },
    *updateNextFetchBlockInfoTime({ payload: { time } }, { put }) {
      try {
        yield put({ type: 'update', payload: { nextFetchBlockTime: time } });
      } catch (error) {}
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
