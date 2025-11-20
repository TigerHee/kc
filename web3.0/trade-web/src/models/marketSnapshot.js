/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getSymbolTick } from 'services/markets';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import selectSync from 'utils/createAppSelect';
import workerSocket from 'common/utils/socketProcess';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

/**
 * 修改状态
 * @param {*} payload
 */
const updateSnapshot = async (payload) => {
  const ticks = await marketSnapshotStore.handler.select(
    (state) => state.marketSnapshot,
  );
  const { currentSymbol } = selectSync((state) => state.trade);
  const newTicks = {};

  _.each(payload, ({ data = {} }) => {
    const _data = data.data || {};
    const { symbolCode } = _data;

    if (symbolCode) {
      const oldTick = ticks[symbolCode] || {};
      newTicks[symbolCode] = {
        ...oldTick,
        ..._data,
      };
    }
  });
  if (newTicks[currentSymbol]) {
    await marketSnapshotStore.handler.update(newTicks);
  }
};

// 货币对的当前交易快照
export default extend(base, polling, {
  namespace: 'marketSnapshot',
  state: {},
  reducers: {},
  effects: {
    *initData({ payload: { symbol } }, { call, put }) {
      const { data = [] } = yield call(getSymbolTick, { symbols: symbol });
      const result = {};
      data.forEach((item) => {
        result[item.symbol] = item;
      });

      yield marketSnapshotStore.handler.update(result);
    },
    *pull({ payload: { symbol } }, { call, put }) {
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const connected = yield workerSocket.connected();
      if (connected) {
        const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
          SYMBOLS: [symbol],
        });

        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;

          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topicState[topic] &&
            topicState[topic].status === topicStateData
          ) {
            return;
          }
        }
      }

      const { data = [] } = yield call(getSymbolTick, { symbols: symbol });
      const result = {};
      data
        // .filter((v) => v)
        .forEach((item) => {
          result[item.symbol] = item;
        });

      yield marketSnapshotStore.handler.update(result);
    },
  },
  subscriptions: {
    setUpMarketSnapshot({ dispatch }) {
      dispatch({ type: 'watchPolling', payload: { effect: 'pull' } });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;
      workerSocket.marketSnapshotMessage((arr) => {
        updateSnapshot(arr);
      });
    },
  },
});
