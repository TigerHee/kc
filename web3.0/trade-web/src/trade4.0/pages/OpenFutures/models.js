/**
 * Owner: charles.yang@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import {
  agreeRisk,
  agreeUser,
  openUserContract,
  postGetOpenFuturesBonus,
  getOpenFuturesIsBonus,
  getOpenStatus,
} from '@/services/futures';

import { futuresSensors } from '@/meta/sensors';

import { _t } from 'utils/lang';
import { defaultState, EMAIL_NOT_BIND } from './config';

/**
 * 开通合约model
 */
export default extend(base, {
  namespace: 'openFutures',
  state: defaultState,
  effects: {
    *openContract({ payload = {} }, { call, put }) {
      try {
        // 埋点
        futuresSensors.openFutures && futuresSensors.openFutures();

        yield call(agreeRisk, { version: 1.0 });
        yield call(agreeUser, { version: 1.0 });
        yield call(openUserContract);

        yield put({
          type: 'update',
          payload: {
            openFuturesVisible: false,
            openFuturesBonusVisible: false,
            openContract: true,
          },
        });

        if (payload.isBonus) {
          const { data } = yield call(postGetOpenFuturesBonus);
          if (data.rewards && data.hasRewards) {
            return data;
          }
          return false;
        }
        return false;
      } catch (e) {
        const { code } = e;
        if (code === EMAIL_NOT_BIND) {
          yield put({
            type: 'update',
            payload: {
              openFuturesVisible: false,
            },
          });
        } else {
          throw e;
        }
        return false;
      }
    },
    *agreeRisk(_, { call }) {
      const result = yield call(agreeRisk, { version: 1.0 });
      return result;
    },
    *agreeUser(_, { call }) {
      const result = yield call(agreeUser, { version: 1.0 });
      return result;
    },
    *getOpenFuturesIsBonus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      const params = {
        isForOpen: false,
        userId: user.uid,
      };
      const { data } = yield call(getOpenFuturesIsBonus, params) || {};
      yield put({
        type: 'update',
        payload: {
          isBonus: data.hasRewards,
          needGuide: data.hasRewards && data.rewardType === 'TRIAL_FUNDS',
        },
      });
    },
    *getOpenStatus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      if (!user) return;
      const { data } = yield call(getOpenStatus) || {};
      yield put({
        type: 'update',
        payload: {
          openContract: data,
        },
      });
    },
  },
  subscriptions: {},
});
