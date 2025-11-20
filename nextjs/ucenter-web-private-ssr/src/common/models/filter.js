/**
 * Owner: willen@kupotech.com
 */

/**
 * 筛选器模型
 */
export default {
  state: {
    filters: null,
  },
  reducers: {
    updateFilters(state, { payload = null, override = false, key = 'filters' } = {}) {
      return {
        ...state,
        [key]: {
          ...(override ? null : state[key]),
          page: 1,
          ...payload,
        },
      };
    },
  },
  effects: {
    *filter({ payload, override, effect = 'query', key = 'filters' }, { put }) {
      yield put({ type: 'updateFilters', payload, override, key });

      if (effect) {
        yield put({ type: effect });
      }
    },
  },
};
