/**
 * Owner: willen@kupotech.com
 */
import { delay } from 'utils/delay';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getServerTime } from 'services/open';
import moment from 'moment';

const DELAY_HTTP = 20 * 1000;

export default extend(base, polling, {
  namespace: 'server_time',
  state: {
    serverTime: 0,
    requestedLocalTime: 0, // 请求serverTime那刻的本地时间
  },
  effects: {
    *pullServerTime(action, { put, call, race }) {
      const overTimeCancel = function* overTimeCancel() {
        yield call(delay, DELAY_HTTP / 2);
        yield put({ type: 'ping/setDelayHTTP', payload: { delayHTTP: -3 } });
      };

      const pingHTTPTs = function* pingHTTPTs() {
        try {
          const ts1 = Date.now();
          const { data } = yield call(getServerTime);
          const ts2 = Date.now();

          if (data) {
            const delayHTTP = ts2 - ts1;
            if (delayHTTP > 0) {
              yield put({ type: 'ping/setDelayHTTP', payload: { delayHTTP } });
            } else {
              yield put({ type: 'ping/setDelayHTTP', payload: { delayHTTP: -1 } });
            }

            yield put({
              type: 'update',
              payload: {
                serverTime: data,
                requestedLocalTime: moment().valueOf(),
              },
            });
          }
        } catch (e) {
          yield put({ type: 'ping/setDelayHTTP', payload: { delayHTTP: -2 } });
        }
      };

      yield race([call(overTimeCancel), call(pingHTTPTs)]);
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullServerTime',
          interval: 1000 * 60 * 5,
        },
      });
    },
  },
});
