/**
 * Owner: willen@kupotech.com
 */
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
  subscriptions: {
    watchClear({ dispatch }) {
      dispatch({
        type: 'watchClear',
      });
    },
  },
};
