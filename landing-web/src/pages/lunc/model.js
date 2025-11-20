/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import * as services from 'services/lunc';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { each } from 'lodash';


export default extend(base, polling, {
  namespace: 'lunc',
  state: {
    postDetail: [], // 社区话题帖子
    symbolMap: {}, // 交易对数据
  },
  reducers: {
    updateSymbolMap(state, { payload }) {
      const newSymbolMap = {};
      each(payload, ({ data }) => {
        newSymbolMap[data.symbol] = data;
      });
      return {
        ...state,
        symbolMap: {
          ...state.symbolMap,
          ...newSymbolMap,
        },
      };
    },
  },
  effects: {
    // 获取话题帖子
    *getPostDetail(action, { call, put }) {
      try {
        const { success, data } = yield call(services.getPostDetail);
        if (success) {
          yield put({
            type: 'update',
            payload: { postDetail: data },
          });
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
    // 获取市场数据
    *pullMarketInfo({ payload }, { put, call, select }) {
      const symbols = yield select(state => Object.keys(state.lunc.symbolMap || {}));
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const ws = yield call(() => import('@kc/socket'));
      const socket = ws.getInstance();
      if (socket.connected()) {
        const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, { SYMBOLS: symbols });
        const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;
        if (socket) {
          const { topicState } = socket;
          if (topicState[topic] && topicState[topic][0] === topicStateData) {
            return;
          }
        }
      }
      yield put({
        type: 'getSymbolStats',
      });
    },

    *getSymbolStats({ payload }, { select, call, put }) {
      const symbols = yield select(state => state.lunc.symbolMap || {});
      const lunc = 'LUNC-USDT';
      const luna = 'LUNA-USDT';

      try {
        const { success, data } = yield call(services.getSymbolStats, lunc);
        const { success: _success, data: _data } = yield call(services.getSymbolStats, luna);
        const newSymbolMap = { ...symbols };
        if (success) {
          newSymbolMap[lunc] = data;
        }
        if (_success) {
          newSymbolMap[luna] = _data;
        }
        yield put({
          type: 'update',
          payload: { symbolMap: newSymbolMap },
        });
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
  },
});
