/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: ''
 */
import extend from 'dva-model-extend';
import { includes } from 'lodash';
import base from 'common/models/base';
import polling from 'common/models/polling';
import filter from 'common/models/filter';
import cancel from './common/cancel';
import clearRecords from './common/clearRecords';
import { newQueryStopOrders } from 'services/order';
import workerSocket from 'common/utils/socketProcess';
import { isABNew } from '@/meta/const';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';

// 第一次fetch不阻止
let isFetched = false;
const orderStopList = ['tso'];

export default extend(base, polling, filter, cancel, clearRecords, {
  namespace: 'orderStop',
  state: {
    filters: {},
    num: 0,
    totalNum: 0,
    page: 1,
    records: [],
    tryAgainNum: 0,
  },
  effects: {
    *updateTryAgainNum({ payload }, { put }) {
      const { tryAgainNum } = payload;
      yield put({
        type: 'update',
        payload: {
          tryAgainNum,
        },
      });
    },
    *query(_, { select, call, put }) {
      const { filters, page, currentSymbol, isLogin, tryAgainNum } = yield select((state) => ({
        ...state.orderStop,
        ...state.trade,
        ...state.user,
      }));
      const { tradeType } = yield select((state) => state.trade);
      let symbol;
      if (filters.symbol === 'current') {
        symbol = currentSymbol;
      }
      // 判断是不是现货的 symbol
      if (!isLogin || !isSpotTypeSymbol(symbol)) {
        yield put({
          type: 'update',
          payload: {
            records: [],
            num: 0,
            totalNum: 0,
            page: 1,
          },
        });
        return;
      }
      const params = {
        currentPage: 1,
        pageSize: 30,
        symbol,
        side: filters.side || undefined,
        stop: filters.type ? 'stop' : undefined,
        type: filters.type ? (includes(filters.type, 'limit') ? 'limit' : 'market') : undefined,
      };
      if (includes(filters.type, 'oco')) {
        // oco
        params.stop = 'oco';
      } else {
        const stopKey = orderStopList.find((str) => includes(filters.type, str));
        if (stopKey) {
          params.stop = stopKey;
        }
      }
      params.tradeType = tradeType;
      // if (params.type) {
      //   params.type = params.type.replace('_stop', '');
      // }
      // sokect正常连接并且topic_state为1时，阻止轮训
      const connected = yield workerSocket.connected();
      // tryAgainNum为0，且请求是由轮训触发，且socket已连接的情况下，进行阻断判断
      // tryAgainNum为0的判断，是存在撤单之后这里接口获取的数据比后端socket推送新数据更老的情况
      // 为了能在批量撤销之后，tryAgainNum不为0，能够跳过这里的return逻辑，进行后面的请求，多请求几次，拿到最新的
      if (!tryAgainNum && isFetched && connected && filters.triggerMethod === 'polling') {
        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;

          const topicStateData = topicStateConst.SUBSCRIBED;
          if (isABNew()) {
            if (
              topicState['/spotMarket/advancedOrdersFrequency500'] &&
              topicState['/spotMarket/advancedOrdersFrequency500'].status === topicStateData
            ) {
              return;
            }
          } else if (
            topicState['/spotMarket/advancedOrders'] &&
            topicState['/spotMarket/advancedOrders'].status === topicStateData
          ) {
            return;
          }
        }
      }
      const ret = yield call(newQueryStopOrders, params);
      // const ret = yield call(queryStopOrders, params);
      const { success } = ret;
      if (success) {
        isFetched = true;
        const maxPage = Math.ceil(ret.items.length / 10) || 1;
        yield put({
          type: 'update',
          payload: {
            records: ret.items,
            num: ret.items.length,
            totalNum: ret.totalNum,
            page: page <= maxPage ? page : maxPage,
            tryAgainNum: tryAgainNum > 0 ? tryAgainNum - 1 : 0,
          },
        });

        yield put({
          type: 'orderCurrent/update',
          payload: {
            advancedOrderCount: ret.totalNum,
          },
        });
      }
    },
  },
  subscriptions: {
    setPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'filter',
        },
      });
    },
  },
});
