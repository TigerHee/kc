/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import { getHotSymbols, getPosition, getOpenAndHistoryOrder, getAIParams } from './services';
import Decimal from 'decimal.js/decimal';
import _ from 'lodash';
import { numberFixed } from 'Bot/helper';

export default modelBase({
  namespace: 'leveragegrid',
  state: {
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    hotSymbols: [], // 创建页面热币排行
    position: {}, // 运行中机器人的仓位
  },
  effects: {
    // 获取运行中机器人的仓位
    *getPosition({ payload }, { call, put }) {
      try {
        const { data: position } = yield call(getPosition, payload.taskId);
        yield put({
          type: 'update',
          payload: {
            position,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 获取当前委托/历史委托列表
    *getOpenAndHistoryOrder({ payload }, { call, put }) {
      const { taskId } = payload ?? {};
      try {
        const { data: order } = yield call(getOpenAndHistoryOrder, taskId);
        if (!order) {
          yield put({
            type: 'update',
            payload: {
              CurrentLoading: false,
              HistoryLoading: false,
            },
          });
          return;
        }
        let { activeOrders: open, hisOrders: stop } = order;
        open = open ?? [];
        stop = stop ?? [];
        // 处理后端返回是大写问题
        stop.forEach((el) => {
          el.side = el.side?.toLowerCase();
          el.type = el.type?.toLowerCase();
          el.taskId = taskId;
        });

        yield put({
          type: 'update',
          payload: {
            opentotalNum: open.length,
            stoptotalNum: stop.length,
            CurrentLoading: false,
            HistoryLoading: false,
            open: {
              items: open,
            },
            stop: {
              items: stop,
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
    // 和其他策略保持相同的effect Name
    *getStopOrders({ payload }, { put }) {
      yield put({
        type: 'getOpenAndHistoryOrder',
        payload,
      });
    },
    // 详情页面需要定时刷新接口
    *getOrder({ payload }, { put }) {
      yield put({
        type: 'getPosition',
        payload,
      });
      yield put({
        type: 'getOpenAndHistoryOrder',
        payload,
      });
    },
    *getHotSymbols({ payload }, { call, put }) {
      try {
        const { data: hotSymbols } = yield call(getHotSymbols);
        _.forEach(hotSymbols, (row) => {
          row.base = row.symbolCode?.split('-')?.[0];
          row.lastTradedPrice = row.price;
          row.amplitudeRatioRaw = row.amplitudeRatio
            ? Decimal(row.amplitudeRatio).times(100).toFixed(2)
            : '--';
          row.changeRateRaw = row.changeRate ? Decimal(row.changeRate).times(100).toFixed(2) : '--';
        });
        yield put({
          type: 'update',
          payload: {
            hotSymbols,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 获取创建的必要参数
    *getAIParams({ payload }, { call, put, select }) {
      try {
        const params = {
          symbol: payload.symbol,
        };
        if (payload.direction) {
          params.direction = payload.direction;
        }
        if (payload.limitAsset) {
          params.limitAsset = payload.limitAsset;
        }
        const oldAiparams = yield select((state) => state.leveragegrid.aiparams);
        const { data } = yield call(getAIParams, params);
        const aiparams = { ...data };
        const cacheKey = `${aiparams.symbol}-${aiparams.direction}`;
        aiparams.down = numberFixed(aiparams.down);
        aiparams.up = numberFixed(aiparams.up);
        yield put({
          type: 'update',
          payload: {
            aiparams: {
              ...oldAiparams,
              [cacheKey]: aiparams,
            },
          },
        });
        return aiparams;
      } catch (error) {
        return {};
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
});
