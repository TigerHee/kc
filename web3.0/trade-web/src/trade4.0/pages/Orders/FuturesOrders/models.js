/**
 * Owner: charles.yang@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import _, { cloneDeep, filter, findIndex, equals } from 'lodash';
import voice from '@/utils/voice';
import { futuresCalcControl } from '@/pages/Futures/components/SocketDataFormulaCalc/utils';

import { isFuturesCrossNew, FUTURES } from '@/meta/const';
import {
  pullPositions,
  getCurrentBrawl,
  isBattle,
  // getCloseOrder,
  getFills,
  getDoneOrders,
  getProfitHistory,
  cancelAllStopOrders,
  getStopOrders,
  getActiveOrders,
  cancelOrder,
  cancelAllOrders,
  getCloseDetail,
  appendMargin,
  createCloseOrder,
  createPartailCloseOrder,
  createStopOrderFromShortcut,
  getMarketList,
  updateMarginAutoAppend,
  cancelTrialOrder,
  trialFundAppendMargin,
  updateTrialFundMarginAutoAppend,
  trialFundCreateStopOrderFromShortcut,
  trialFundCreateCloseOrder,
  trialFundCreatePartailCloseOrder,
} from '@/services/futures';
import polling from 'common/models/polling';
import { _t } from 'utils/lang';
import { abs, toFixed } from 'utils/operation';
import { getSymbolText } from '@/hooks/futures/useGetSymbolText';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import moment from 'moment';
import {
  defaultState,
  futuresPositionNameSpace,
  // MAX_TOTAL_PAGE,
  PAGE_SIZE,
  MARKET,
  orderVars,
  SYMBOL_FILTER_ENUM,
  ORDERS_MAX_COUNT,
  FILLS_MAX_COUNT,
  POSITION_CLOSE_MAX_COUNT,
} from './config';
import { getShortcutOrder, quantityToText } from './util';
import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { getPosition } from 'src/trade4.0/hooks/futures/useGetFuturesPositionsInfo';
import { ABC_POSITION } from '@/components/AbnormalBack/constant';
import orderErrorCatch from 'common/models/futures/orderErrorCatch';
import {
  OPEN_ORDER,
  STOP_ORDER,
  BIClick,
  POSITIONS,
  getClosePosType,
} from 'src/trade4.0/meta/futuresSensors/list';
import { CANNOT_CANCELED } from 'src/trade4.0/meta/futures';

// 如果正在轮询，不处理仓位的消息
const positionPolling = false;

let activePolling = false;

let getMarketListPolling = false;
/**
 * 合约仓位列表model
 */
export default extend(base, polling, orderErrorCatch, {
  namespace: futuresPositionNameSpace,
  state: defaultState,
  reducers: {
    updateActiveOrders(state, { payload: { activeOrders = [] } }) {
      // 设置closeOrders
      const closeOrders = filter(activeOrders, (order) => order.fromReduce);
      return {
        ...state,
        activeOrders,
        closeOrders,
      };
    },
  },
  effects: {
    /**
     * 仓位列表获取(初始化，轮训)
     */
    *pullPosList({ payload = {} }, { call, put }) {
      try {
        const oData = yield call(pullPositions, payload);
        if (oData && _.isObject(oData)) {
          yield put({
            type: 'update',
            payload: {
              positions: oData.data,
            },
          });
          if (isFuturesCrossNew()) {
            // 触发一次计算
            futuresCalcControl.triggerCalc();
          }
          yield put({
            type: 'futuresCommon/updateCrossAbnormal',
            payload: {
              updateKey: ABC_POSITION,
              status: true,
              locationId: '3',
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_POSITION,
            status: false,
            locationId: '3',
            error: e,
          },
        });
        throw e;
      }
    },
    /**
     * 初始化，用于loading的检测
     */
    *initPullPositions({ payload }, { put }) {
      yield put({
        type: 'pullPosList',
        payload,
      });
    },
    /**
     * 专门给轮询使用 避免 effects loading
     */
    *getPositionList({ payload }, { put }) {
      yield put({
        type: 'pullPosList',
      });
    },
    *updateSocketPosition({ payload }, { select, put }) {
      const positions = yield select((state) => state.futures_orders.positions);
      // 如果没有仓位数据 则走兜底更新逻辑
      // if (!positions || !positions.length) {
      //   // event.emit(EVENT_POSITION_BLOCK_UPDATE, payload);
      //   return;
      // }
      let isMissPosition = false;
      _.reduce(
        payload,
        (p, n) => {
          const positionAt = p.findIndex(
            (item) =>
              item.symbol === n.data.symbol && !!item.isTrialFunds === !!n.data.isTrialFunds,
          );
          if (positionAt !== -1) {
            p[positionAt] = { ...positions[positionAt], ...n.data };
          } else {
            isMissPosition = true;
          }

          return p;
        },
        positions,
      );

      yield put({
        type: 'update',
        payload: {
          positions: [...positions],
        },
      });
      // 如果有未更新的仓位，则再请求一次仓位的数据
      if (isMissPosition) {
        isMissPosition = false;
        yield put({
          type: 'initPullPositions',
          payload: { queryAll: true },
        });
      }
    },
    *getBattleDetail({ payload: { symbol } }, { call, put }) {
      try {
        const oData = yield call(getCurrentBrawl, { contract: symbol });
        if (oData && _.isObject(oData.data)) {
          const dData = yield call(isBattle, { code: oData.data.code, symbol });
          if (dData && dData.data && dData.data.status === 'processing') {
            yield put({
              type: 'update',
              payload: {
                battleInProgress: true,
              },
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    *getFills(a, { call, put, select }) {
      const { fillsSymbolFilters = {} } = yield select((state) => state.futures_orders);
      const { fillsPagination, firstRequest } = yield select((state) => state.futures_orders);
      const { currentPage = 1 } = fillsPagination;

      const params = {
        currentPage: 1,
        pageSize: PAGE_SIZE * currentPage,
        offset: 0,
        trialOffset: 0,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        ...fillsSymbolFilters,
      };

      const oData = yield call(getFills, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        if (!firstRequest) {
          yield put({
            type: 'update',
            payload: {
              fills: items || [],
            },
          });
        } else {
          // 最大限制500
          const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
          const realHasMore = equals(currentPage * PAGE_SIZE)(FILLS_MAX_COUNT) ? true : dataHasMore;
          yield put({
            type: 'update',
            payload: {
              fills: items || [],
              fillsPagination: { ...rest, hasMore: realHasMore },
              firstRequest: false,
            },
          });
        }
      }
    },
    // FIXME: 合约后续优化：这里的逻辑差不多，后续跟上面那个合并下吧
    *loadMoreFills({ payload = {} }, { call, put, select }) {
      const { fillsSymbolFilters = {} } = yield select((state) => state.futures_orders);
      const { fills, fillsPagination } = yield select((state) => state.futures_orders);
      const { offset, trialOffset } = fillsPagination;
      const { currentPage = 1 } = payload;

      const params = {
        currentPage,
        pageSize: PAGE_SIZE,
        offset,
        trialOffset,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        ...fillsSymbolFilters,
      };

      const oData = yield call(getFills, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        const allData = fills.concat(items || []);
        const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
        // 最大限制500
        const realHasMore = equals(currentPage * PAGE_SIZE)(FILLS_MAX_COUNT) ? true : dataHasMore;

        yield put({
          type: 'update',
          payload: {
            fills: allData,
            fillsPagination: { ...rest, hasMore: realHasMore },
          },
        });
      }
    },

    *getHistoryOrders(a, { call, put, select }) {
      const { historySymbolFilters = {} } = yield select((state) => state.futures_orders);
      const { historyOrdersPagination, historyOrdersFirstRequest } = yield select(
        (state) => state.futures_orders,
      );
      const { currentPage = 1 } = historyOrdersPagination;
      const params = {
        offset: 0,
        trialOffset: 0,
        pageSize: PAGE_SIZE * currentPage,
        currentPage: 1,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        ...historySymbolFilters,
      };

      const oData = yield call(getDoneOrders, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        if (!historyOrdersFirstRequest) {
          yield put({
            type: 'update',
            payload: {
              historyOrders: items || [],
            },
          });
        } else {
          const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
          // 最大限制500
          const realHasMore = equals(currentPage * PAGE_SIZE)(ORDERS_MAX_COUNT)
            ? false
            : dataHasMore;
          yield put({
            type: 'update',
            payload: {
              historyOrders: items || [],
              historyOrdersPagination: { ...rest, hasMore: realHasMore },
              historyOrdersFirstRequest: false,
            },
          });
        }
      }
    },
    // FIXME: 合约后续优化：这里的逻辑差不多，后续跟上面那个合并下吧
    *loadMoreHistoryOrders({ payload = {} }, { call, put, select }) {
      const { historySymbolFilters = {} } = yield select((state) => state.futures_orders);
      const { historyOrders, historyOrdersPagination } = yield select(
        (state) => state.futures_orders,
      );
      const { offset, trialOffset } = historyOrdersPagination;
      const { currentPage = 1 } = payload;

      const params = {
        currentPage,
        pageSize: PAGE_SIZE,
        offset,
        trialOffset,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        ...historySymbolFilters,
      };
      const oData = yield call(getDoneOrders, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        const allData = historyOrders.concat(items || []);
        const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
        // 最大限制500
        const realHasMore = equals(currentPage * PAGE_SIZE)(ORDERS_MAX_COUNT) ? false : dataHasMore;
        yield put({
          type: 'update',
          payload: {
            historyOrders: allData,
            historyOrdersPagination: { ...rest, hasMore: realHasMore },
          },
        });
      }
    },
    *getPrevClosedPositions(action, { call, put, select }) {
      const { closedPositionsPagination } = yield select((state) => state.futures_orders);
      const { currentPage = 1 } = closedPositionsPagination;
      const { isPnlOnlySymbolCheck } = yield select((state) => state.futures_orders);
      const currentSymbol = yield select((state) => state.trade.currentSymbol);

      const params = {
        offset: 0,
        trialOffset: 0,
        pageSize: PAGE_SIZE * currentPage,
        currentPage: 1,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        symbol: isPnlOnlySymbolCheck ? currentSymbol : undefined,
      };
      const oData = yield call(getProfitHistory, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        // 最大限制500
        const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
        const realHasMore = equals(currentPage * PAGE_SIZE)(POSITION_CLOSE_MAX_COUNT)
          ? true
          : dataHasMore;
        yield put({
          type: 'update',
          payload: {
            closedPositions: items || [],
            closedPositionsPagination: { ...rest, hasMore: realHasMore },
          },
        });
      }
    },
    *loadPrevClosedPositions({ payload }, { call, put, select }) {
      const { closedPositions } = yield select((state) => state.futures_orders);
      const { isPnlOnlySymbolCheck, closedPositionsPagination } = yield select(
        (state) => state.futures_orders,
      );
      const currentSymbol = yield select((state) => state.trade.currentSymbol);
      const { currentPage = 1 } = payload || {};
      const { offset, trialOffset } = closedPositionsPagination;

      const params = {
        offset,
        trialOffset,
        pageSize: PAGE_SIZE,
        currentPage,
        start: moment().subtract(3, 'months').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf(),
        symbol: isPnlOnlySymbolCheck ? currentSymbol : undefined,
      };
      const oData = yield call(getProfitHistory, params);
      if (oData && _.isObject(oData.data)) {
        const { items, ...rest } = oData.data;
        // 最大限制500
        const dataHasMore = rest.hasMore || items.length === PAGE_SIZE;
        const realHasMore = equals(currentPage * PAGE_SIZE)(POSITION_CLOSE_MAX_COUNT)
          ? true
          : dataHasMore;

        const allData = closedPositions.concat(items || []);

        yield put({
          type: 'update',
          payload: {
            closedPositions: allData,
            closedPositionsPagination: { ...rest, hasMore: realHasMore },
          },
        });
      }
    },
    *pullMarketList(a, { call, put }) {
      if (getMarketListPolling) return;
      getMarketListPolling = true;
      try {
        const oData = yield call(getMarketList);
        if (oData && Array.isArray(oData.data)) {
          const { data } = oData;
          yield put({
            type: 'update',
            payload: {
              marketList: data,
            },
          });
        }
      } catch (err) {
        throw err;
      } finally {
        getMarketListPolling = false;
      }
    },
    *getStopOrders({ payload = {} }, { call, put, select }) {
      const userInfo = yield select((state) => state.user.user);
      if (userInfo) {
        const oData = yield call(getStopOrders, { ...payload });
        if (oData && _.isObject(oData.data)) {
          const stopOrders = (oData.data.items || []).map((item) => ({
            key: item.orderId,
            ...item,
          }));
          yield put({
            type: 'update',
            payload: {
              stopOrders,
            },
          });
        }
      }
    },
    *getActiveOrders({ payload = {} }, { call, put, select }) {
      if (!activePolling) {
        activePolling = true;
        try {
          const oData = yield call(getActiveOrders, payload);

          if (oData && _.isObject(oData.data)) {
            const activeOrders = [];
            _.forEach(oData.data.items || [], (item) => {
              if (item.type !== MARKET) {
                activeOrders.push({ key: item.id, ...item });
              }
            });

            yield put({
              type: 'updateActiveOrders',
              payload: {
                activeOrders,
              },
            });
          }
        } finally {
          activePolling = false;
        }
      }
    },
    /* 专门给轮询使用，避免 effects 监听loading 问题 */
    *pullActiveOrders(action, { call, put, select }) {
      if (!activePolling) {
        activePolling = true;
        try {
          const activeOrderSymbolFilter = yield select(
            (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER],
          );
          const currentSymbol = yield select((state) => state.trade.currentSymbol);

          const oData = yield call(getActiveOrders, {
            symbol: activeOrderSymbolFilter ? currentSymbol : undefined,
          });

          if (oData && _.isObject(oData.data)) {
            const activeOrders = [];
            _.forEach(oData.data.items || [], (item) => {
              if (item.type !== MARKET) {
                activeOrders.push({ key: item.id, ...item });
              }
            });

            yield put({
              type: 'updateActiveOrders',
              payload: {
                activeOrders,
              },
            });
          }
        } finally {
          activePolling = false;
        }
      }
    },
    *updateWorkerActiveOrder({ payload = [] }, { put }) {
      console.log(payload, 'payload');
      yield put({
        type: 'updateActiveOrders',
        payload: {
          activeOrders: [...payload],
        },
      });
    },
    *cancel(
      { payload: { orderId, isTrialFunds, order, stop, sensorType } },
      { call, select, put },
    ) {
      const startSensorParams = stop
        ? [STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_SEND]
        : [OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_SEND];
      BIClick(startSensorParams, {
        type: sensorType,
      });
      try {
        if (isTrialFunds) {
          yield call(cancelTrialOrder, orderId);
        } else {
          yield call(cancelOrder, orderId);
        }
      } catch (e) {
        const errorSensorParams = stop
          ? [STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_FAIL]
          : [OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_FAIL];
        BIClick(errorSensorParams, {
          type: `${sensorType}|${e?.code || e.msg || e.message}`,
        });
        if (e && e.code === CANNOT_CANCELED) {
          if (stop) {
            yield put({ type: 'getStopOrders' });
          } else {
            yield put({ type: 'getActiveOrders' });
          }
        }
        throw e;
      }

      if (order) {
        const activeOrders = yield select((state) => state.futures_orders.activeOrders) || [];
        if (activeOrders.length) {
          const updateActiveOrders = activeOrders.filter((item) => {
            return item.id !== orderId;
          });
          yield put({
            type: 'updateActiveOrders',
            payload: {
              activeOrders: updateActiveOrders,
            },
          });
        }
        futuresSensors.activeOrder.cancelSuccess.click();
        BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_SUCCESS], { type: sensorType });
      }
      if (stop) {
        const stopOrders = yield select((state) => state.futures_orders.stopOrders);
        if (stopOrders.length) {
          const updateStopOrders = stopOrders.filter((item) => {
            return item.id !== orderId;
          });
          yield put({
            type: 'update',
            payload: {
              stopOrders: updateStopOrders,
            },
          });
        }

        BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_SUCCESS], { type: sensorType });
        futuresSensors.stopOrder.cancelSuccess.click();
      }
    },
    *cancelAllOrders(action, { call, put, select }) {
      const { activeOrders } = yield select((state) => state.futures_orders);
      const activeOrderSymbolFilter = yield select(
        (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER],
      );
      const currentSymbol = yield select((state) => state.trade.currentSymbol);
      if (activeOrders.length > 0) {
        const {
          data: { cancelledOrderIds },
        } = yield call(cancelAllOrders, {
          symbol: activeOrderSymbolFilter ? currentSymbol : undefined,
        });
        const updateActiveOrders = activeOrders.filter(
          (item) => !cancelledOrderIds.includes(item.id),
        );
        BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_ALL_SUCCESS]);
        yield put({
          type: 'updateActiveOrders',
          payload: {
            activeOrders: updateActiveOrders,
          },
        });
      }

      futuresSensors.activeOrder.cancelAllSuccess.click();
    },
    *cancelAllStopOrders(__, { call, select, put }) {
      const { stopOrders } = yield select((state) => state.futures_orders);
      const stopOrderFilterState = yield select(
        (state) => state.futures_orders[SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER],
      );
      const currentSymbol = yield select((state) => state.trade.currentSymbol);
      if (stopOrders.length > 0) {
        const { data } = yield call(cancelAllStopOrders, {
          // shortCutOnly: true,
          // triggerOrderOnly: true,
          includeShortCutStopOrders: true,
          symbol: stopOrderFilterState ? currentSymbol : undefined,
        });
        const filterStopOrders = _.filter(
          stopOrders,
          (item) => !data?.cancelledOrderIds.includes(item.id),
        );
        yield put({
          type: 'update',
          payload: {
            stopOrders: filterStopOrders,
          },
        });
      }
      futuresSensors.stopOrder.cancelAllSuccess.click();
      BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_ALL_SUCCESS]);
    },
    *pullCloseDetail({ payload: { id, currentPage, pageSize, fundsType } }, { call, put }) {
      const oData = yield call(getCloseDetail, {
        realisedPnlId: id,
        currentPage,
        pageSize,
        fundsType,
      });

      if (oData && _.isObject(oData.data)) {
        const { items, currentPage: page, totalNum } = oData.data;
        yield put({
          type: 'update',
          payload: {
            closeDetails: {
              items,
              page,
              count: totalNum,
            },
          },
        });
      }
    },
    *appendMargin({ payload: { value, symbol, isTrialFunds, trialCode } }, { call, put }) {
      if (isTrialFunds) {
        yield call(trialFundAppendMargin, { margin: value, symbol, isTrialFunds, trialCode });
      } else {
        yield call(appendMargin, { margin: value, symbol });
      }
      futuresSensors.position.addMarginSuccess.click();
      yield put({
        type: 'update',
        payload: {
          appendMarginVisible: false,
        },
      });
    },
    *checkStopOrderBeforeCreate({ payload }, { select, put }) {
      const stopOrders = yield select((state) => state.futures_orders.stopOrders);
      const { type, symbol, price, side, size, isTrialFunds, trialCode, marginMode } = payload;
      const stopOrdersFromShortcut = getShortcutOrder({ stopOrders, symbol, isTrialFunds });
      // 如果存在止盈止损 则弹出止盈止损撤销提示
      if (stopOrdersFromShortcut.length > 0) {
        yield put({
          type: 'update',
          payload: {
            liquidationPLWarningVisible: true,
            liquidationData: payload,
          },
        });
        return;
      }
      yield put({
        type: 'createCloseOrder',
        payload: {
          type,
          symbol,
          price,
          side,
          size,
          isTrialFunds,
          trialCode,
          marginMode,
        },
      });
    },
    *createCloseOrder({ payload }, { select, call, put }) {
      const { type, symbol, price, side, size, isTrialFunds } = payload;
      const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
      const { currentQty } = yield select((state) => state.futures_orders.positionItem);
      let realSize = payload.size;
      const sensorsType = getClosePosType(payload, type);
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_SEND], { type: sensorsType });
      try {
        // 如果size跟仓位中的一样，则代表全部平仓单， 不一致则走减仓 closeOnly 减仓 closeOrder 平仓
        if (Math.abs(currentQty) <= Math.abs(size)) {
          realSize = currentQty;
          yield call(isTrialFunds ? trialFundCreateCloseOrder : createCloseOrder, payload);
        } else {
          yield call(
            isTrialFunds ? trialFundCreatePartailCloseOrder : createPartailCloseOrder,
            payload,
          );
        }
        BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_SUCCESS], { type: sensorsType });

        const symbolTextInfo = getSymbolText(contract);
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'notification.info',
            message: `${_t('trade.notice.closeOrderTitle')}:`,
            extra: {
              description: _t('trade.notice.closeOrderSuccess', {
                symbol: `${symbolTextInfo.base}/${symbolTextInfo.settle} ${symbolTextInfo.type}`,
                price: type === 'market' ? _t('trade.order.market') : price,
                side: _t(orderVars[side]),
                size: toFixed(abs(realSize))(),
                tips: quantityToText(contract),
              }),
            },
          },
        });
      } catch (e) {
        BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_FAIL], {
          type: `${sensorsType}|${e?.code}`,
        });
        yield put({
          type: 'orderCatch',
          payload: {
            error: e,
            payload,
          },
        });
      }
    },
    *createStopOrderFromShortcut({ payload }, { call, put }) {
      const { isTrialFunds, sensorType, ...params } = payload;
      let oData;
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_CREATE], { type: sensorType });
      try {
        if (isTrialFunds) {
          oData = yield call(trialFundCreateStopOrderFromShortcut, params);
        } else {
          oData = yield call(createStopOrderFromShortcut, params);
        }
        BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_CREATE_SUCCESS], { type: sensorType });
      } catch (e) {
        BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_CREATE_FAIL], {
          type: `${sensorType}|${e?.code || e.msg || e.message}`,
        });
        throw e;
      }
      yield put({
        type: 'notice/feed',
        payload: {
          type: 'message.success',
          message: _t('trade.notice.orderTitle'),
        },
      });
    },
    *cancelStopOrderFromShortcut({ payload }, { call, put, select }) {
      const { id, isTrialFunds, ...params } = payload;
      let oData;
      BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_SEND], { type: 'fromReduce' });
      if (isTrialFunds) {
        oData = yield call(trialFundCreateStopOrderFromShortcut, params);
      } else {
        oData = yield call(createStopOrderFromShortcut, params);
      }
      BIClick([STOP_ORDER.BLOCK_ID, STOP_ORDER.CANCEL_SUCCESS], { type: 'fromReduce' });
      const success = oData && oData.success;
      if (success && id) {
        const stopOrders = yield select((state) => state.futures_orders.stopOrders);
        yield put({
          type: 'update',
          payload: {
            stopOrders: stopOrders.filter((item) => item.id !== id),
          },
        });
        futuresSensors.position.stopLPCancelSuccess.click();
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('operation.succeed'),
          },
        });
      }
      return success;
    },
    *updateMarginAutoAppend(
      { payload: { symbol, status, isTrialFunds, trialCode } },
      { call, put },
    ) {
      // 体验金仓位走体验金自动追加保证金逻辑
      let isSuccess = false;
      if (isTrialFunds) {
        const { success: trialFundSuccess } = yield call(updateTrialFundMarginAutoAppend, {
          status,
          trialCode,
          symbol,
        });
        isSuccess = trialFundSuccess;
      } else {
        const { success: selfSuccess } = yield call(updateMarginAutoAppend, symbol, { status });
        isSuccess = selfSuccess;
      }
      // 成功
      if (isSuccess) {
        yield put({ type: 'updateSymbolPosition', payload: { symbol, status, isTrialFunds } });
      } else {
        console.log('Update auto margin fail');
      }
    },

    *updateSymbolPosition({ payload: { symbol, status, isTrialFunds } }, { put }) {
      const oriPosAll = cloneDeep(getPosition());
      const index = findIndex(
        oriPosAll,
        (item) => item.symbol === symbol && !!item.isTrialFunds === !!isTrialFunds,
      );
      if (index !== -1) {
        oriPosAll[index].autoDeposit = status;
      }

      yield put({
        type: 'update',
        payload: {
          positions: oriPosAll,
        },
      });

      yield put({
        type: 'preferences/update',
        payload: {
          autoDeposit: status,
        },
      });
    },
  },
  subscriptions: {
    initLoop({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'getFills', interval: 300000 },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getHistoryOrders',
          interval: 300000,
        },
      });
      dispatch({
        type: 'watchPolling',
        // 修改为15s
        payload: { effect: 'pullActiveOrders', interval: 15000 },
      });
      dispatch({
        type: 'watchPolling',
        // 修改为20s
        payload: { effect: 'getPositionList', interval: 20000 },
      });
    },
    setUpSocket({ dispatch }) {
      window.$voice = voice;
      futuresWorkerSocket.topicStopOrder((data) => {
        const { stopOrders, stopOrderActive } = data;
        dispatch({ type: 'update', payload: { stopOrders } });
        // 条件单触发
        if (stopOrderActive) {
          voice.notify('trigger_advanced_orders');
        }
      });
      futuresWorkerSocket.topicActiveOrder(({ data, hasFullFill, hasPartFill }) => {
        // 部分成交
        if (hasPartFill) {
          voice.notify('orders_partially_completed');
        }
        // 完全成交
        if (hasFullFill) {
          voice.notify('orders_fully_completed');
        }
        dispatch({ type: 'updateWorkerActiveOrder', payload: data });
      });
      futuresWorkerSocket.topicPosition((data) => {
        dispatch({
          type: 'updateSocketPosition',
          payload: data,
        });
      });
    },
  },
});
