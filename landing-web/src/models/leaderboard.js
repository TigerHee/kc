/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import Toast from 'components/Toast';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { getRankData, getActivityData, isJoin, join } from 'src/services/leaderboard';

export default extend(base, polling, {
  namespace: 'leaderboard',
  state: {
    rankData: null,
    activityData: null,
    joinStatus: null,
    joinStatusLoading: false,
  },
  reducers: {},
  effects: {
    *getRankData({ payload }, { call, put }) {
      const { data = {} } = yield call(getRankData, payload);
      yield put({
        type: 'update',
        payload: { rankData: data },
      });
    },
    *getActivityData({ payload }, { call, put }) {
      const { data = {} } = yield call(getActivityData, payload);
      yield put({
        type: 'update',
        payload: { activityData: data },
      });
    },
    *getJoinStatus({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: { joinStatusLoading: true },
      });
      const { data = {} } = yield call(isJoin, payload);
      yield put({
        type: 'update',
        payload: { joinStatus: data, joinStatusLoading: false },
      });
    },
    *join({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: { joinStatusLoading: true },
      });
      try {
        const { data } = yield call(join, payload);
        yield put({
          type: 'update',
          payload: { joinStatus: !!data, joinStatusLoading: false },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: { joinStatusLoading: false },
        });
        if (e && e.msg) {
          Toast({
            type: 'error',
            msg: e?.msg || 'error'
          })
        }
      }
    },
  },
  subscriptions: {},
});
