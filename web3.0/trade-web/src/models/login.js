/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

export default extend(base, {
  namespace: 'login',
  state: {
    safeWords: '',
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *pullUserInfo({ payload, sleep = false }, { put, select, fork }) {
      const currency = yield select(state => state.currency);
      yield fork(put, {
        type: 'user/pullUser',
        payload: {
          currency: currency.currency,
        },
      });
    },
  },

  subscriptions: {
  },

});
