/**
 * Owner: clyne@kupotech.com
 */

import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import {
  namespace,
  defaultState,
  dataSize,
  orderbooksLoop,
  netAssetsLoop,
  name,
} from '@/pages/Orderbook/config';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { formatData, getRequestPrecision } from './utils/format';
import * as service from 'services/trade';
import { pullAuctionOrders } from '@/services/callAuction';
import * as serv from 'services/leveragedTokens';
import { checkFuturesSocketTopic, checkSocketTopic } from '@/utils/socket';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { getModelAuctionInfo } from '@/utils/business';
import voiceQueue from 'src/trade4.0/utils/voice';
import { getStore } from 'src/utils/createApp';
import { get } from 'lodash';
import { FUTURES } from '@/meta/const';
import { getFuturesOrderBook } from '@/services/futures';
import { getTradeType } from '@/hooks/common/useTradeType';
import { getCurrentSymbol } from '@/hooks/common/useSymbol';
import { RAFTaskFallback } from 'src/trade4.0/hooks/common/usePageExpire';

let count = 0;

const a = false;
// OrderBook
export default extend(base, polling, {
  namespace,
  state: defaultState,
  effects: {
    // 获取orderbook数据, 这里不做任何处理直接拿到数据更新，数据处理逻辑都在hooks中
    *getOrderBooks({ payload }, { put, call }) {
      const { currentDepth, currentSymbol, showAuction } = payload;
      const tradeType = getTradeType();
      let retData;
      // 合约扩展
      if (tradeType === FUTURES) {
        const { data } = yield call(getFuturesOrderBook, {
          symbol: currentSymbol,
          precision: currentDepth,
          limit: 50,
        });
        retData = data;
      } else {
        // 现货这里传递的是不是精度的具体枚举，是传递的小数位数，需要用
        const precision = getRequestPrecision(currentDepth);
        // 判断是否是集合竞价
        const serApi = showAuction ? pullAuctionOrders : service.pullLevel2;
        // 现货杠杆
        const { data } = yield call(serApi, currentSymbol, dataSize, {
          precision,
        });
        retData = data;
      }

      const { sell, buy } = formatData({ data: retData, symbol: currentSymbol, tradeType });
      // 频繁请求的时候，可能出现currentSymbol根参数中的symbol不一致问题导致更新问题
      if (currentSymbol !== getCurrentSymbol()) {
        return;
      }
      yield put({
        type: 'update',
        payload: {
          data: {
            [currentSymbol]: {
              sell,
              buy,
            },
          },
        },
      });
    },

    *checkSocket({ payload }, { put, select }) {
      const { currentDepth, currentSymbol } = payload;
      const tradeType = getTradeType();
      const isFutures = tradeType === FUTURES;
      // 显示集合竞价
      const showAuction = yield select((state) => {
        return getModelAuctionInfo(state, currentSymbol).showAuction;
      });
      let topic = '';
      if (isFutures) {
        topic = `/contractMarket/level2Depth50:${currentSymbol}`;
        // 集合竞价
      } else if (showAuction) {
        topic = ws.Topic.get(PushConf.OPENPRDERSAuctionLimit50.topic, {
          SYMBOLS: [currentSymbol],
        });
      } else {
        // 现货这里传递的是不是精度的具体枚举，是传递的小数位数，需要用
        const precision = getRequestPrecision(currentDepth);
        topic = ws.Topic.get('/spotMarket/level2Depth50:{SYMBOL_LIST}', {
          SYMBOLS: [`${currentSymbol}_${precision}`],
        });
      }
      let checkTopic;
      if (isFutures) {
        checkTopic = yield checkFuturesSocketTopic({ topic });
      } else {
        checkTopic = yield checkSocketTopic({ topic });
      }
      // 检查socket
      if (!checkTopic) {
        // 现货杠杆
        yield put({
          type: 'getOrderBooks',
          payload: {
            currentDepth,
            currentSymbol,
            showAuction,
          },
        });
      }
    },

    *getNetAssets({ payload }, { put, call }) {
      const topic = ws.Topic.get('/margin-fund/nav:{SYMBOL_LIST}', {
        SYMBOLS: [payload.currencyCode],
      });
      const checkTopic = yield checkSocketTopic({ topic });
      // 检查socket
      if (!checkTopic) {
        const { success, data } = yield call(serv.queryCurrencyNav, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              netAssets: data,
            },
          });
        }
      }
    },
    *orderbookSocket({ payload }, { put, select }) {
      const currentSymbol = getCurrentSymbol();
      const tradeType = getTradeType();
      const currentDepth = yield select((state) => state[namespace].currentDepth);
      const precision = getRequestPrecision(currentDepth);
      const { data, topic } = payload[0] || {};
      // fix：当前交易对才能update
      // 显示集合竞价
      const showAuction = yield select((state) => {
        return getModelAuctionInfo(state, currentSymbol).showAuction;
      });
      // fix:集合竞价topic不包含精度，需特殊处理
      const symbolStr = topic.split(':')[1];
      let topicSymbol = showAuction ? currentSymbol : `${currentSymbol}_${precision}`;
      // 合约
      if (tradeType === FUTURES) {
        topicSymbol = currentSymbol;
      }
      if (topicSymbol !== symbolStr) {
        // 取消无用的topic
        count += 1;
        if (count >= 20) {
          workerSocket.unsubscribe(topic, false);
          count = 0;
        }
        return;
      }
      const { sell, buy } = formatData({ data, symbol: currentSymbol, tradeType, currentDepth });
      // 更新数据
      yield put({
        type: 'update',
        payload: {
          data: {
            [currentSymbol]: {
              sell,
              buy,
            },
          },
        },
      });
    },
  },

  subscriptions: {
    initLoop({ dispatch }) {
      // 10s
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'checkSocket', interval: orderbooksLoop },
      });

      // 15s
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'getNetAssets', interval: netAssetsLoop },
      });
    },

    initSocket({ dispatch }) {
      workerSocket.openOrdersL2Limit50((ret = []) => {
        const store = getStore().getState().setting;
        const hasOrderbook = get(store, `inLayoutIdMap.${name}`, undefined) !== undefined;
        if (hasOrderbook) {
          voiceQueue.notify('order_book_change');
        }
        RAFTaskFallback(() => {
          dispatch({ type: 'orderbookSocket', payload: ret });
        });
      });
      futuresWorkerSocket.topicLevel2((ret = []) => {
        // 接入合约买卖盘声音
        const store = getStore().getState().setting;
        const hasOrderbook = get(store, `inLayoutIdMap.${name}`, undefined) !== undefined;
        if (hasOrderbook) {
          voiceQueue.notify('order_book_change');
        }
        RAFTaskFallback(() => {
          dispatch({ type: 'orderbookSocket', payload: ret });
        });
      });
      // 集合竞价消息订阅
      const fn = workerSocket[PushConf.OPENPRDERSAuctionLimit50.eventName];
      if (fn) {
        fn((ret = []) => {
          dispatch({ type: 'orderbookSocket', payload: ret });
        });
      }
    },
  },
});
