/**
 * Owner: mike@kupotech.com
 */
import { getSevenProfit, getTotalProfit } from 'Bot/services/machine';
import { getInverstOpenOrdersDetail, updateBotParams, getMinInvest } from './services';
import { getRunningDetail, getStopOrders } from 'Bot/services/running';
import _ from 'lodash';
import modelBase from 'Bot/utils/modelBase';

export default modelBase({
  namespace: 'automaticinverst',
  state: {
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    rankings: {
      sevenDay: {},
      total: {},
    }, // 网格排行榜数据
    rankingsLoader: false, // 网格排行榜加载图
    rankingSymbol: '', // 网格排行榜选择的交易对
    hotSymbols: [], // 创建页面热币排行
    createInfo: {
      // 现货网格创建需要启动参数
      // symbolCode: {}
    },
    copyDetail: {}, // 排行榜 详情
    copyParams: {}, // 现货网格排行榜 复制参数创建
    minInvestMap: {}, // 最小投资额度
  },
  effects: {
    // 获取跟单详情
    *getCopyDetail({ payload: { id } }, { call, put }) {
      try {
        const { data: copyDetail } = yield call(getRunningDetail, id);
        yield put({
          type: 'update',
          payload: {
            copyDetail: copyDetail ? JSON.parse(copyDetail) : {},
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 当前委托
    *getOpenOrders({ payload: { taskId } }, { call, put }) {
      try {
        const { data } = yield call(getInverstOpenOrdersDetail, taskId);
        const open = { ...data };
        // open.items = open.orders;
        yield put({
          type: 'update',
          payload: {
            CurrentLoading: false,
            open,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 已成交历史
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload;
      try {
        const { data: stopOrders } = yield call(getStopOrders, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        yield put({
          type: 'update',
          payload: {
            HistoryLoading: false,
            stop: stopOrders,
            stoptotalNum: stopOrders.totalNum,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 排行榜
    *getRanking({ payload: { id, day, symbol = 'ALL' } }, { call, put, select }) {
      try {
        const API = {
          sevenDay: getSevenProfit,
          total: getTotalProfit,
        }[day];

        const { data: ranking } = yield call(API, id);
        // 再次获取最新的
        const oldRankings = yield select((state) => state.automaticinverst.rankings);
        yield put({
          type: 'update',
          payload: {
            rankingsLoader: false,
            rankings: {
              ...oldRankings,
              [day]: {
                [symbol]: ranking,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 修改机器人参数
    *updateBotParams({ payload: { data } }, { call, put }) {
      let res;
      try {
        res = yield call(updateBotParams, data);
      } catch (error) {
        console.error(error);
      }
      return res;
    },
    // 获取最小投资额度
    *getMinInvest({ payload: symbol }, { call, put, select }) {
      try {
        const oldMinInvestMap = yield select((state) => state.automaticinverst.minInvestMap);
        if (oldMinInvestMap[symbol]) {
          return oldMinInvestMap[symbol];
        }
        const { data: minInvest } = yield call(getMinInvest, symbol);

        yield put({
          type: 'update',
          payload: {
            minInvestMap: {
              ...oldMinInvestMap,
              [symbol]: Number(minInvest),
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {},
  },
});
