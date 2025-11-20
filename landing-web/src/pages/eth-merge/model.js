/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { reduce, each } from 'lodash';
import * as services from 'services/ethMerge';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';

import { formatDateSchedule } from 'components/$/Prediction/selector';


export default extend(base, polling, {
  namespace: 'ethMerge',
  state: {
    activityConfig: {}, // 活动配置
    postDetail: [], // 社区话题帖子
    poolStakingProducts: [], // 赚币产品信息
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
    // ETH Merge kucoin赚币产品信息
    *getPoolStakingProducts({ payload }, { call, put }) {
      try {
        const { success, data } = yield call(services.getPoolStakingProducts);
        if (success) {
          yield put({
            type: 'update',
            payload: { poolStakingProducts: data },
          });
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
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
    // 获取活动配置
    *getConfig(action, { call, put }) {
      try {
        const { success, data } = yield call(services.getConfig);
        if (success) {
          const newData = formatDateSchedule({ ...data } || {});
          yield put({
            type: 'update',
            payload: { activityConfig: newData },
          });
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
    // 获取市场数据
    *pullMarketInfo({ payload }, { put, call, select }) {
      const symbols = yield select(state => Object.keys(state.ethMerge.symbolMap || {}));
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
      const { data } = yield call(services.getSymbolsStats);
      if (data && data.length) {
        const newSymbolMap = reduce(
          data,
          (prev, cur) => {
            const result = prev;
            prev[cur.symbol] = cur;
            return result;
          },
          {},
        );
        yield put({
          type: 'update',
          payload: {
            symbolMap: newSymbolMap,
          },
        });
      }
    },
  },
});
