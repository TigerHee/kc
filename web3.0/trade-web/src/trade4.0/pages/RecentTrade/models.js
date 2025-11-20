/**
 * Owner: clyne@kupotech.com
 */

import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import { namespace, defaultState, recentTradeLoop } from '@/pages/RecentTrade/config';
import base from 'common/models/base';
import polling from 'common/models/polling';
import * as service from 'services/trade';
import { getFuturesRecentTrade } from '@/services/futures';
import { checkFuturesSocketTopic, checkSocketTopic } from '@/utils/socket';
import { format } from './utils';
import { RecentTradeTopic } from '@/meta/newTopic';
import { FUTURES } from 'src/trade4.0/meta/const';
import { getTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { getCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';

// OrderBook
export default extend(base, polling, {
  namespace,
  state: defaultState,
  effects: {
    *getRecentTrade({ payload = {} }, { put, call }) {
      const { tradeType, symbol } = payload;
      console.log('=====recent init');
      const requestPath = tradeType === FUTURES ? getFuturesRecentTrade : service.getDealOrders;
      const { success, data } = yield call(requestPath, symbol);
      // 频繁请求的时候，可能出现currentSymbol根参数中的symbol不一致问题导致更新问题
      if (symbol !== getCurrentSymbol()) {
        return;
      }
      const ret = data.sort((a, b) => {
        return Number(b.sequence) - Number(a.sequence);
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            data: {
              [symbol]: ret,
            },
          },
        });
      }
    },

    *checkSocket({ payload = {} }, { put, call }) {
      const { symbol } = payload;
      const tradeType = getTradeType();
      const isFutures = tradeType === FUTURES;
      const topic = isFutures
        ? `/contractMarket/execution:${symbol}`
        : ws.Topic.get(RecentTradeTopic, {
            SYMBOLS: [symbol],
          });
      let checkTopic;
      if (isFutures) {
        checkTopic = yield checkFuturesSocketTopic({ topic });
      } else {
        checkTopic = yield checkSocketTopic({ topic });
      }

      console.log('=== recent trade socket check', checkTopic);
      // 检查socket
      if (!checkTopic) {
        yield put({
          type: 'getRecentTrade',
          payload,
        });
      }
    },
  },

  subscriptions: {
    initLoop({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'checkSocket', interval: recentTradeLoop },
      });
    },
  },
});
