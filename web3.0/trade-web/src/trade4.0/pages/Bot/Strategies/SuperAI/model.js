/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import * as CommonServe from 'Bot/services/running';
import { getSuperAIParams } from './services';
import Decimal from 'decimal.js/decimal';
import _ from 'lodash';

export default modelBase({
  namespace: 'superai',
  state: {
    createInfo: {},
  },
  effects: {
    // 获取创建的必要参数
    *getCreateInfo({ payload: symbolCode }, { call, put, select }) {
      try {
        const { data: createInfo } = yield call(getSuperAIParams, symbolCode);
        const oldCreateInfo = yield select((state) => state.superai.createInfo);
        yield put({
          type: 'update',
          payload: {
            createInfo: {
              ...oldCreateInfo,
              [symbolCode]: createInfo,
            },
          },
        });
        return createInfo;
      } catch (error) {
        return null;
      }
    },
    *getOpenOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload ?? {};
      const stop = yield select((state) => state.superai.stop);
      try {
        const { data: open } = yield call(CommonServe.getOpenOrders, {
          taskId,
          type: 'limit',
          symbol,
          pageSize: 500,
          currentPage: 1,
        });
        open.currencies = open?.currencies ?? [];
        stop.totalNum = open.anotherStateNum;

        yield put({
          type: 'update',
          payload: {
            opentotalNum: open.totalNum,
            stoptotalNum: open.anotherStateNum,
            CurrentLoading: false,
            open,
            stop,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload ?? {};
      const open = yield select((state) => state.superai.open);
      try {
        const { data: stop } = yield call(CommonServe.getStopOrders, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        open.totalNum = stop.anotherStateNum;
        if (stop && stop.items) {
          stop.items.forEach((el) => {
            el.entryPrice = stop.entryPrice ?? 0;
          });
        }

        yield put({
          type: 'update',
          payload: {
            stoptotalNum: stop.totalNum,
            opentotalNum: stop.anotherStateNum,
            HistoryLoading: false,
            stop,
            open,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
