/**
 * Owner: harry.lai@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import filter from 'common/models/filter';
import workerSocket from 'common/utils/socketProcess';
import { _t } from 'utils/lang';
import { pauseTWAPOrder, queryTWAPOrders, queryTWAPSubOrder, runTWAPOrder } from 'services/order';
import { isABNew } from '@/meta/const';
import cancel from './common/cancel';
import clearRecords from './common/clearRecords';

// 第一次fetch不阻止
let isFetched = false;
const TWAP_ACTIVE_PROCESS_STATUS = {
  PENDING: 'PENDING', // 委托中
  PAUSED: 'PAUSED', // 已暂停
};
const ACTIVE_PROCESS_STATUS_LIST = [
  TWAP_ACTIVE_PROCESS_STATUS.PENDING,
  TWAP_ACTIVE_PROCESS_STATUS.PAUSED,
];

export default extend(base, polling, filter, cancel, clearRecords, {
  namespace: 'orderTwap',
  state: {
    filters: {},
    totalNum: 0,
    num: 30,
    page: 1,
    records: [],
    tryAgainNum: 0, // query轮训请求数据时的重试次数，让在撤单之后的轮训请求不被跳过
    allowCancelAll: true, // 批量撤单
    orderDetail: {},
    fillsRecords: [],
    fillTotal: 0,
    fillCurrent: 1,
    queryScene: '',
    fetchTime: undefined, // 查询列表数据响应时间
  },
  reducers: {
    resetData(state) {
      return {
        ...state,
        orderDetail: {},
        fillsRecords: [],
        fillTotal: 0,
        fillCurrent: 1,
      };
    },
    resetFilter(state) {
      return { ...state, filters: {} };
    },
    pullOrder(state, { payload }) {
      const orderDetail = state.records.find((i) => i.id === payload.id);
      return { ...state, orderDetail };
    },
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
        ...state.orderTwap,
        ...state.trade,
        ...state.user,
      }));
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

      const { symbol, rangeDate = [], side, status } = filters;

      const ret = yield call(queryTWAPOrders, {
        currentPage: 1,
        pageSize: 30,
        symbol: symbol === 'current' ? currentSymbol : undefined,
        side,
        statusList: ACTIVE_PROCESS_STATUS_LIST,
      });
      const connected = yield workerSocket.connected();

      const { success } = ret || {};
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
            fetchTime: new Date().getTime(),
          },
        });
      }
    },
    *runOrPauseTWAPOrder({ payload }, { call, put }) {
      const { order } = payload;
      const { id: orderId, status } = order;

      const actionApi =
        status === TWAP_ACTIVE_PROCESS_STATUS.PENDING ? pauseTWAPOrder : runTWAPOrder;
      const failMsgFallbackStr = _t('futures.marginMode.settingError');
      try {
        const { success, msg } = yield call(actionApi, orderId);
        if (success) {
          yield put({
            type: `orderTwap/query`,
          });
        } else {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'notification.error',
              message: msg || failMsgFallbackStr,
              groupName: 'trade',
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'notification.error',
            message: e?.msg || failMsgFallbackStr,
            groupName: 'trade',
          },
        });
      }
    },

    *pullFills({ payload: { id, page } }, { call, put }) {
      const { success, items, totalNum } = yield call(queryTWAPSubOrder, id);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            fillsRecords: items,
            fillCurrent: page || 1,
            fillTotal: totalNum,
          },
        });
      }
    },

    *queryOrderSummary(_, { call, put }) {
      const QUERY_FIRST_PAGE_PARAMS = {
        currentPage: 1,
        pageSize: 10,
        statusList: ACTIVE_PROCESS_STATUS_LIST,
      };
      const { success, totalNum } = (yield call(queryTWAPOrders, QUERY_FIRST_PAGE_PARAMS)) || {};
      if (!success) return;

      yield put({
        type: 'update',
        payload: {
          totalNum,
        },
      });
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
