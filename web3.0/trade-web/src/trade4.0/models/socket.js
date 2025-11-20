/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { POLLING_FIVE_SEC } from 'utils/hooks/usePolling/constants';

export default extend(base, polling, {
  namespace: 'socket',
  state: {
    wsConnected: true,
    statistics: {},
    futuresWsConnected: true, // 新增 合约 socket 链接状态
    futuresStatistics: {}, // 新增 合约统计
  },
  reducers: {
    updateStatistics(state, { payload }) {
      const { topic, count = 1 } = payload;
      return {
        ...state,
        statistics: {
          ...state.statistics,
          [topic]: (state.statistics?.[topic] || 0) + count,
        },
      };
    },
    updateFuturesStatistics(state, { payload }) {
      const { topic, count = 1 } = payload;
      return {
        ...state,
        futuresStatistics: {
          ...state.futuresStatistics,
          [topic]: (state.futuresStatistics?.[topic] || 0) + count,
        },
      };
    },
  },
  effects: {
    *wsConnectedPull(_, { select, put }) {
      const connected = yield workerSocket.connected();
      const wsConnected = !!connected;
      const wsConnectedPrev = yield select((state) => state.socket.wsConnected);
      if (wsConnectedPrev !== wsConnected) {
        yield put({
          type: 'update',
          payload: {
            wsConnected,
          },
        });
      }
    },
  },
  subscriptions: {
    wsConnectedState({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'wsConnectedPull', interval: POLLING_FIVE_SEC },
      });
    },
    socketWatch({ dispatch }) {
      futuresWorkerSocket.socketConnectSub((data) => {
        if (data === 'connect') {
          console.log(`futures ws connected 。。。。。 ${+new Date()}`);
          dispatch({
            type: 'socket/update',
            payload: {
              wsConnected: true,
            },
          });
        } else if (data === 'disconnect') {
          console.log(`futures ws disconnect 。。。。。 ${+new Date()}`);
          dispatch({
            type: 'socket/update',
            payload: {
              wsConnected: false,
            },
          });
        }
      });
    },
  },
});
