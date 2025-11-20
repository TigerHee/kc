/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {queryIpDismiss} from 'services/dismiss';

export default extend(baseModel, {
  namespace: 'dismiss',
  state: {
    dismissInfo: {},
  },
  effects: {
    *getIpDismiss({payload}, {put, call}) {
      try {
        const {data} = yield call(queryIpDismiss, payload);
        if (data) {
          // 找到第一个dismiss为true的bizType
          const displayBizType = Object.keys(data).find(
            key => data[key].dismiss,
          );
          yield put({
            type: 'update',
            payload: {dismissInfo: data?.[displayBizType] || {}},
          });
        } else {
          yield put({type: 'update', payload: {dismissInfo: {}}});
        }
      } catch (e) {
        yield put({type: 'update', payload: {dismissInfo: {}}});
      }
    },
  },
});
