/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

const initailStates = {};

/**
 * 基类模型
 */
export default {
  reducers: {
    // 更新 state
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 缓存 initailState
    _collect(state, { type }) {
      const [namespace] = type.split('/');
      initailStates[namespace] = state;
      return state;
    },
    // 重置 state
    reset(state, { payload, type }) {
      const [namespace] = type.split('/');
      if (_.isPlainObject(payload) && _.isPlainObject(initailStates[namespace])) {
        return {
          ...initailStates[namespace],
          ...payload,
        };
      }

      return { ...initailStates[namespace] };
    },
  },
  subscriptions: {
    _setUpReset({ dispatch }) {
      dispatch({
        type: '_collect',
      });
    },
  },
};
