/**
 * Owner: willen@kupotech.com
 */

import { IS_SERVER_ENV } from 'kc-next/env';

export default {
  effects: {
    *watchClear({ type }, { take, put }) {
      const namespace = type.split('/')[0];
      while (true) {
        yield take('order@loginInvalid');
        yield put({
          type: `${namespace}/query@polling:cancel`,
        });
        yield put({
          type: 'clearPage',
        });
      }
    },
  },
  subscriptions: IS_SERVER_ENV ? {} : {
    watchClear({ dispatch }) {
      dispatch({
        type: 'watchClear',
      });
    },
  },
};
