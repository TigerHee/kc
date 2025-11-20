/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: ''
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import filter from 'common/models/filter';
import { divide, multiply, sub } from 'helper';
import { queryCurrentOrders, queryOrdersSummary } from 'services/order';
import workerSocket from 'common/utils/socketProcess';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
import { toBoolean } from 'utils/tools';
import sentry from '@kc/sentry';
import { isABNew, isFuturesNew, FUTURES } from '@/meta/const';
import cancel from './common/cancel';
import detail from './common/detail';
import clearRecords from './common/clearRecords';

// 第一次fetch不阻止
let isFetched = false;

export default extend(base, polling, filter, cancel, detail, clearRecords, {
  namespace: 'orderCurrent',
  state: {
    filters: {},
    totalNum: 0,
    num: 30,
    page: 1,
    records: [],
    priceMap: {},
    tryAgainNum: 0, // query轮训请求数据时的重试次数，让在撤单之后的轮训请求不被跳过
    allowCancelAll: true, // 批量撤单
    activeOrderCount: 0, // 根据tradeType 查询当前委托+高级委托 总订单数量，可以超过60条，展示真实订单数量 trade4.0专用
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
        ...state.orderCurrent,
        ...state.trade,
        ...state.user,
      }));
      const { tradeType } = yield select((state) => state.trade);
      if (!isLogin) {
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
      let symbol;
      if (filters.symbol === 'current') {
        symbol = currentSymbol;
      }
      const params = {
        currentPage: 1,
        pageSize: 30,
        symbol,
        side: filters.side || undefined,
        type: filters.type || undefined,
      };
      params.tradeType = tradeType;
      const connected = yield workerSocket.connected();
      // triggerMethod，标识该次dispatch原因， 如果是因为轮训触发，sokect正常且之前拉取过的，阻断掉
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
              topicState['/spotMarket/tradeOrdersBatchFrequency500'] &&
              topicState['/spotMarket/tradeOrdersBatchFrequency500'].status === topicStateData
            ) {
              return;
            }
          } else if (
            topicState['/spotMarket/tradeOrders-batch'] &&
            topicState['/spotMarket/tradeOrders-batch'].status === topicStateData
          ) {
            return;
          }
        }
      }
      // tradeType不合法完成一次上报
      if (!TRADE_TYPES_CONFIG[params.tradeType]) {
        try {
          sentry.captureEvent({
            level: 'fatal',
            message: `tradeType-Error: ${params.tradeType}`,
            tags: {
              fatal_type: 'tradeTypeError',
            },
          });
        } catch (err) {
          console.error(err);
        }
      }

      const ret = yield call(queryCurrentOrders, params);
      const { success } = ret;
      if (success) {
        isFetched = true;
        const orderSymbols = [];
        const orderSymbolsMap = {};
        const priceMap = {};
        ret.items = (ret.items || []).map((item) => {
          priceMap[item.symbol] = priceMap[item.symbol] || {};
          priceMap[item.symbol][`${item.side}__${item.price}`] = true;
          if (!orderSymbolsMap[item.symbol]) {
            orderSymbols.push(item.symbol);
            orderSymbolsMap[item.symbol] = item.symbol;
          }
          const { size, total } = item;
          const rate = multiply(divide(total - size, total, 4), 100, 2);
          return {
            ...item,
            oid: item.id,
            rate,
            traded: sub(total, size), // 已成交量 total - size(未成交量)
          };
        });
        const maxPage = Math.ceil(ret.items.length / 10) || 1;
        yield put({
          type: 'symbols/update',
          payload: {
            orderSymbols,
            orderSymbolsMap,
          },
        });
        yield put({
          type: 'update',
          payload: {
            priceMap,
            allowCancelAll: toBoolean(ret.allowCancelAll),
            records: ret.items,
            num: ret.items.length,
            totalNum: ret.totalNum,
            page: page <= maxPage ? page : maxPage,
            tryAgainNum: tryAgainNum > 0 ? tryAgainNum - 1 : 0,
          },
        });
      }
    },
    *queryOrdersSummary(_, { select, call, put }) {
      const tradeType = yield select((state) => state.trade.tradeType);
      const currentSymbol = yield select((state) => state.trade.currentSymbol);
      const filters = yield select((state) => state.orderCurrent.filters);
      let symbol;
      if (filters.symbol === 'current') {
        symbol = currentSymbol;
      }
      const params = {
        symbolCode: symbol,
        tradeType,
      };
      const isFutures = isFuturesNew();
      if (isFutures) {
        if (params.tradeType === FUTURES) {
          return;
        }
      }

      const ret = yield call(queryOrdersSummary, params);
      const { success, data } = ret;
      if (success) {
        yield put({
          type: 'update',
          payload: {
            totalNum: data.activeOrderCount,
            activeOrderCount: data.activeOrderCount + data.advancedOrderCount,
          },
        });
        yield put({
          type: 'orderStop/update',
          payload: {
            totalNum: data.advancedOrderCount,
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
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'queryOrdersSummary',
        },
      });
    },
  },
});
