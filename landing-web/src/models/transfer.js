/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import _ from 'lodash';
import { _t } from 'src/utils/lang';

import {
  getUserMarginPostion,
  userSignAgreement,
  getMarginCoins,
  getMarginCoinsCount,
  getAccountOpenConfig,
  getTransferBalance,
  getAutoLendConf,
  transfer
} from 'services/transfer';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;
const commonParams = { channel: 'WEB' };

export default extend(base, {
  namespace: 'transfer',
  state: {
    userPosition: null,
    transferBalance: undefined,
    coins: [],
    coinsMap: {},
    currentMarket: 'USDT',
    noviceBenefitsVisible: false,
    autoLendConfig: null,
  },
  reducers: {

  },
  effects: {
    *pullAutoLendConf({ payload = {} }, { put, call, select }) {
      const { currency } = payload;
      const categories = yield select(state => state.categories);
      // 开通杠杆的币种才能请求
      if (!categories[currency] || !categories[currency].isMarginEnabled) return;
      const result = yield call(getAutoLendConf, { ...commonParams, ...payload });
      // const { currentMarket } = yield select(state => state.marginMeta);
      if (result.success) {
        yield put({
          type: 'update',
          payload: {
            autoLendConfig: result.data,
          },
        });
      }
      return result;
    },
    *checkKumexIsOpen({ payload = {} }, { call, put, select }) {
      const { isLogin } = yield select(state => state.user);
      if (!isLogin) return;
      const { data } = yield call(getAccountOpenConfig, {
        type: 'CONTRACT',
      });
      yield put({
        type: 'update',
        payload: {
          kumexOpenFlag: data,
        },
      });
    },
    // todo 去掉开发阶段的强赋值
    *pullUserMarginPostion({ payload = {} }, { put, call, select }) {
      const { data } = yield call(getUserMarginPostion);

      yield put({
        type: 'update',
        payload: {
          userPosition: { ...(data || {}) },
        },
      });
    },
    *pullTransferBalance({ payload = {} }, { put, call }) {
      try {
        const { success, data } = yield call(getTransferBalance, { ...payload, tag: 'DEFAULT' });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              transferBalance: data.availableBalance,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            transferBalance: -1,
          },
        });
      }
    },
    *transfer({ payload = {}, callback }, { call, put }) {
      const { success } = yield call(transfer, payload);
      if (success) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('operation.succeed'),
          },
        });
        if (typeof callback === 'function') {
          callback(success);
        }
      }
    },
    *updateStatus({ payload = {} }, { put, select }) {
      const { userPosition } = yield select(state => state.marginMeta);
      const { data: { type } } = payload;
      if (userPosition && type) {
        yield put({
          type: 'update',
          payload: {
            userPosition: { ...userPosition, status: type },
          },
        });
      }
    },

    *userSignAgreement({ payload = {} }, { put, call }) {
      const { data, success } = yield call(userSignAgreement);
      if (success) {
        if (data.hasFreshmanPackage) {
          yield put({
            type: 'update',
            payload: {
              noviceBenefitsVisible: true,
            },
          });
        }
        yield put({ type: 'pullUserMarginPostion' });
      }
    },

    *pullMarginCoins({ payload = {} }, { put, call, select }) {
      const { data } = yield call(getMarginCoins, payload);
      const coinsMap = {};
      _.each(data, (item) => {
        coinsMap[item.currency] = item;
      });
      yield put({
        type: 'update',
        payload: {
          coinsMap,
          coins: data,
        },
      });
    },
  },
  subscriptions: {
    subscribeMessage: async ({ dispatch }) => {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      import('@kc/socket').then(ws => {
        const socket = ws.getInstance();
        socket.topicMessage('/margin/position', 'position.status', true)((arr) => {
          dispatch({
            type: 'updateStatus',
            payload: arr[0],
          });
        });
      })
    },
  },
});
