/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import * as api from 'services/contentCreator';

export default extend(base, {
  namespace: 'contentCreator',
  state: {
    topicList: [],
  },
  effects: {
    // topic列表
    *getTopicList({ payload }, { put, call }) {
      const { data } = yield call(api.getTopicList, payload);
      yield put({
        type: 'update',
        payload: {
          topicList: data || [],
        },
      });
    },
  },
});
