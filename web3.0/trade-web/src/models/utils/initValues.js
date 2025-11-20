/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

export default extend(base, {
  namespace: 'initValues',
  state: {},
  effects: {
    *collect({ payload = {} }, { select, put }) {
      const state = yield select();

      const values = { ...state };
      delete values['@@dva'];
      delete values.routing;
      delete values.loading;
      delete values.initValues;

      yield put({ type: 'update', payload: values });
    },
  },
  subscriptions: {
    setUpInitial({ dispatch }) {
      dispatch({ type: 'collect' });
    },
  },
});
