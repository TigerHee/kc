/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import { getTodayProfit } from 'Bot/services/machine';
import { getHotSymbols, getCreateInfo } from './services';
import { getRunningDetail, getStopOrders, getOpenOrders } from 'Bot/services/running';
import { toSplitCase } from 'Bot/helper';
import _ from 'lodash';

const templateId = 5;
const templateName = 'INFINITY_GRID';

export default modelBase({
  namespace: 'infinitygrid',
  state: {
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    rankings: {
      1: {},
      7: {},
    }, // 网格排行榜数据
    rankingsLoader: false, // 网格排行榜加载图
    rankingSymbol: '', // 网格排行榜选择的交易对
    hotSymbols: [], // 创建页面热币排行
    runningLists: [], // 运行列表
    copyDetail: {}, // 排行榜 详情
    copyParams: {}, // 排行榜 复制参数创建
    createInfo: {
      // 现货网格创建需要启动参数
      // symbolCode: {}
    },
    historyLists: [], // 历史列表
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
    *getOpenOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload || {};
      let stop = yield select((state) => state.infinitygrid.stop);
      try {
        const { data: open } = yield call(getOpenOrders, {
          taskId,
          type: 'limit',
          symbol,
          pageSize: 500,
          currentPage: 1,
        });
        stop = { ...stop };
        open.currencies = open?.currencies || [];
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
        console.error(error);
      }
    },
    // 已经成委托
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload || {};
      let open = yield select((state) => state.infinitygrid.open);
      try {
        const { data: stop } = yield call(getStopOrders, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        open = { ...open };
        open.totalNum = stop.anotherStateNum;
        if (stop && stop.items) {
          stop.items.forEach((el) => {
            el.entryPrice = stop.entryPrice || 0;
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
        console.error(error);
      }
    },
    // 排行榜
    *getRanking({ payload: { id, day, symbol } }, { call, put, select }) {
      try {
        const oldRankings = yield select((state) => state.infinitygrid.rankings);
        const cacheKey = _.isEmpty(symbol) ? 'ALL' : symbol;
        // 没有缓存的，就显示加载图
        if (!oldRankings[day][cacheKey]) {
          yield put({
            type: 'update',
            payload: {
              rankingsLoader: true,
            },
          });
        }
        const { data: ranking } = yield call(getTodayProfit, id, day, symbol);
        ranking.topProfitRates = ranking.topProfitRates?.map((el) => {
          el.symbolName = toSplitCase(el.symbolName);
          return el;
        });
        ranking.myProfitRates = ranking.myProfitRates?.map((el) => {
          el.symbolName = toSplitCase(el.symbolName);
          return el;
        });
        // 数据过滤
        const effective = ranking.topProfitRates.filter((el) => Number(el.profitRateYear) > 0);
        ranking.topProfitRates = effective;
        // 只展示正的
        // 盈利（年化>0）人数超过5个，就显示排行榜
        // 盈利人数小于5，不显示排行榜
        if (effective.length < 5) {
          ranking.topProfitRates = [];
        }
        // 再次获取最新的
        const oldRankingsNow = yield select((state) => state.infinitygrid.rankings);
        yield put({
          type: 'update',
          payload: {
            rankingsLoader: false,
            rankings: {
              ...oldRankingsNow,
              [day]: {
                ...oldRankingsNow[day],
                [cacheKey]: ranking,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 热门币
    *getHotSymbols({ payload }, { call, put }) {
      try {
        const { data: hotSymbols } = yield call(getHotSymbols);
        _.forEach(hotSymbols, (row) => {
          row.base = row.symbolCode?.split('-')?.[0];
          row.lastTradedPrice = row.price;
        });
        yield put({
          type: 'update',
          payload: {
            hotSymbols,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 获取创建的必要参数
    *getCreateInfo({ payload: symbolCode }, { call, put, select }) {
      try {
        const oldCreateInfo = yield select((state) => state.infinitygrid.createInfo);
        const { data: createInfo } = yield call(getCreateInfo, symbolCode);
        let info = {};
        if (createInfo) {
          const { gridAiParam, gridSymbolInfo, symbolTick } = createInfo;
          info = {
            feeRate: +gridSymbolInfo.feeRate,
            down: +gridAiParam.down,
            gridProfitRatio: +gridAiParam.gridProfitRatio,
            minimumOrderValue: +symbolTick.minimumOrderValue,
            minimumInvestment: +gridSymbolInfo.minimumInvestment,
          };
        }
        yield put({
          type: 'update',
          payload: {
            createInfo: {
              ...oldCreateInfo,
              [symbolCode]: info,
            },
          },
        });
        return createInfo;
      } catch (error) {
        console.error(error);
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {},
  },
});
