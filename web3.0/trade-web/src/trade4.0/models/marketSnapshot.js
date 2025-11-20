/**
 * Owner: borden@kupotech.com
 */
import { forEach } from 'lodash';
import * as ws from '@kc/socket';
import extend from 'dva-model-extend';
import base from 'src/common/models/base';
import polling from 'src/common/models/polling';
import { checkSocketTopic } from '@/utils/socket';
import { getSymbolTick } from 'src/services/markets';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';

// 交易对的当前交易快照
export default extend(base, polling, {
  namespace: 'marketSnapshot',
  state: {},
  reducers: {},
  effects: {
    *pull({ payload: { symbol } }, { call }) {
      const currentData = yield marketSnapshotStore.handler.select(
        (state) => state.marketSnapshot[symbol],
      );
      const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
        SYMBOLS: [symbol],
      });
      const checkTopic = yield checkSocketTopic({ topic });

      if (!currentData || !checkTopic) {
        const { data = [] } = yield call(getSymbolTick, { symbols: symbol });
        const result = {};
        forEach(data, (item) => {
          result[item.symbol] = item;
        });

        yield marketSnapshotStore.handler.update(result);
      }
    },

    *pullDataBySymbols({ payload: { symbols } }, { call }) {
      const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
        SYMBOLS: symbols,
      });

      const checkTopic = yield checkSocketTopic({ topic });

      if (!checkTopic) {
        const { data = [] } = yield call(getSymbolTick, { symbols: symbols.join(',') });
        const result = {};
        forEach(data, (item) => {
          result[item.symbol] = item;
        });

        yield marketSnapshotStore.handler.update(result);
      }
    },

    *registerPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pull' },
      });
    },

    *registerSymbolbarPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pullDataBySymbols' },
      });
    },
  },
});
