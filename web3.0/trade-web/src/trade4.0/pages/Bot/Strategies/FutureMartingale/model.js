/**
 * Owner: mike@kupotech.com
 */
import { getOpen, getStopOrder } from './services';
import _ from 'lodash';
import modelBase from 'Bot/utils/modelBase';

export default modelBase({
  namespace: 'futuremartingale',
  state: {
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    hotSymbols: [], // 创建页面热币排行
    entryPriceLists: [], // 修改入场价格的列表
    openData: {}, // 运行中记录加仓是否已经开单数据
    canReduce: {}, // 运行中记录加仓是否可以
  },
  effects: {
    // 获取当前委托
    *getOpenOrders({ payload }, { call, put }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload ?? {};
      try {
        const { data: open } = yield call(getOpen, {
          taskId,
          type: 'limit',
          symbol,
          pageSize: 500,
          currentPage: 1,
        });
        // 前端使用items字段
        open.items = open.activeOrders ?? [];
        yield put({
          type: 'update',
          payload: {
            opentotalNum: open.activeOrders?.length,
            CurrentLoading: false,
            open,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 已成交委托
    *getStopOrders({ payload }, { call, put }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload ?? {};
      try {
        const { data: stop } = yield call(getStopOrder, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        // 前端使用items字段
        stop.items = stop.doneOrders ?? [];

        yield put({
          type: 'update',
          payload: {
            HistoryLoading: false,
            stop,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
