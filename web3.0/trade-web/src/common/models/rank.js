/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from './base';
import polling from './polling';
import { listTops, getRank } from '../../services/account';

export default extend(base, polling, {
  state: {
    coin: null,
    type: null,
    since: 0,
    before: 0,
    limit: 100,
    tops: [],
    myself: {},
  },
  effects: {
    *pullTops(action, { select, call, put }) {
      const namespace = action.type.split('/')[0];
      const { coin, type, since, before, limit } = yield select(state => state[namespace]);

      try {
        const { data } = yield call(listTops, coin, { type, since, before, limit });

        if (data) {
          yield put({
            type: 'update',
            payload: {
              tops: data,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *pullMyself(action, { select, call, put }) {
      const namespace = action.type.split('/')[0];
      const { coin, type, since, before } = yield select(state => state[namespace]);

      try {
        const { data } = yield call(getRank, coin, { type, since, before });

        if (data) {
          yield put({
            type: 'update',
            payload: {
              myself: data,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  subscriptions: {
    setUpRank({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullTops', interval: 2 * 60 * 1000 },
      });

      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullMyself', interval: 2 * 60 * 1000 },
      });
    },
  },
});
