/**
 * Owner:mike@kupotech.com
 */
import {
  getPositionDetails,
  getStopAndOpenOrders,
  setStopLossPercent,
  getAIParams,
} from './services';
import modelBase from 'Bot/utils/modelBase';

const emptyItem = {
  isEmpty: true,
  currentQty: '--',
  liquidationPrice: '--',
  leverage: '',
  unrealisedPnl: '--',
  avgEntryPrice: '--',
};

export default modelBase({
  namespace: 'aiFutureBilater',
  state: {
    createInfo: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    futureIcon: {}, // 按照base取合约服务那边的图标
    futureIconBySymbol: {}, // 按照交易对取合约服务那边的图标
    futureSymbolArr: [], // 双向赢合约所有交易对
    positionDetails: [], // 当前委托数据
  },
  effects: {
    *setStopLossPercent({ payload }, { call, put }) {
      try {
        const { success } = yield call(setStopLossPercent, payload);
        if (success) {
          // toast(_t('runningdetail'));
          return 'success';
        }
        return '';
      } catch (error) {
        return '';
      }
    },
    // 和其他策略保持一致
    *getOpenOrders({ payload }, { put }) {
      yield put({
        type: 'getStopAndOpenOrders',
        payload,
      });
      yield put({
        type: 'getPositionDetails',
        payload,
      });
    },
    // 和其他策略保持一致
    *getStopOrders({ payload }, { put }) {
      yield put({
        type: 'getStopAndOpenOrders',
        payload,
      });
    },
    *getStopAndOpenOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol } = payload ?? {};
      try {
        const { data } = yield call(getStopAndOpenOrders, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        if (!data) {
          yield put({
            type: 'update',
            payload: {
              CurrentLoading: false,
              HistoryLoading: false,
            },
          });
          return;
        }
        const { activeOrders, trades } = data || { activeOrders: [], trades: [] };
        // 将外层stopReason移到每一个
        // 处理后端返回是大写问题
        // eslint-disable-next-line
        trades?.forEach((el) => {
          // el.stopReason = stop.stopReason; // 需要后端补充的字段
          el.side = el.side?.toLowerCase();
          el.type = el.type?.toLowerCase();
        });
        // eslint-disable-next-line
        activeOrders?.forEach((el) => {
          // el.stopReason = stop.stopReason; // 需要后端补充的字段
          el.side = el.side?.toLowerCase();
          el.type = el.type?.toLowerCase();
        });

        yield put({
          type: 'update',
          payload: {
            stoptotalNum: trades?.length ?? 0,
            opentotalNum: activeOrders?.length ?? 0,
            CurrentLoading: false,
            HistoryLoading: false,
            stop: {
              totalNum: trades?.length ?? 0,
              items: trades,
            },
            open: {
              totalNum: activeOrders?.length ?? 0,
              items: activeOrders,
            },
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            CurrentLoading: false,
            HistoryLoading: false,
          },
        });
      }
    },
    *getPositionDetails({ payload: { taskId } }, { call, put }) {
      try {
        const { data } = yield call(getPositionDetails, {
          taskId,
        });
        let positionDetails = [];
        if (data) {
          if (data.leverage) {
            emptyItem.leverage = data.leverage;
          }
          const valItem = {
            isEmpty: false,
            currentQty: Math.abs(data?.currentQty || 0),
            symbol: data?.symbol,
            avgEntryPrice: data?.avgEntryPrice,
            liquidationPrice: data?.liquidationPrice,
            leverage: data?.leverage,
            unrealisedPnl: data?.unrealisedPnl,
          };

          const isKong = +data?.currentQty < 0;
          const isDuo = +data?.currentQty > 0;
          const one = isKong ? valItem : emptyItem;
          const two = isDuo ? valItem : emptyItem;
          positionDetails = [one, two];
          yield put({
            type: 'update',
            payload: {
              positionDetails,
              CurrentLoading: false,
            },
          });
          return;
        }
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            positionDetails: [emptyItem, emptyItem],
            CurrentLoading: false,
          },
        });
      }
    },
    // 获取创建的必要参数
    *getCreateInfo({ payload }, { call, put, select }) {
      try {
        const params = { symbol: payload.symbol };
        let cacheKey = [params.symbol];
        if (payload.leverage) {
          params.leverage = payload.leverage;
          cacheKey.push(params.leverage);
        }
        cacheKey = cacheKey.join('-');

        const { data: createInfo } = yield call(getAIParams, params);
        const oldCreateInfo = yield select((state) => state.aiFutureBilater.createInfo);

        yield put({
          type: 'update',
          payload: {
            createInfo: {
              ...oldCreateInfo,
              [cacheKey]: createInfo,
            },
          },
        });
        return createInfo;
      } catch (error) {
        return null;
      }
    },
  },
  subscriptions: {},
});
