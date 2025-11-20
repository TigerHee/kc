/**
 * Owner: willen@kupotech.com
 */
import { getRegGuideText } from './service';

export default {
  namespace: '$dialog_center',
  state: {},
  effects: {
    *getRegGuideText(_, { call }) {
      try {
        const { data } = yield call(getRegGuideText, {
          businessLine: 'ucenter',
          codes: 'web202312homepagePop',
        });
        return data || false;
      } catch (e) {
        return false;
      }
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
