/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import { strategiesMap } from 'Bot/config';
import * as CommonServe from 'Bot/services/running';
import { getTodayProfit } from 'Bot/services/machine';
import {
  getHotSymbols,
  getUpdateEntryPriceLists,
  getSpotCreateInfo,
  getBackTestData,
} from './services';
import { toSplitCase } from 'Bot/helper';
import Decimal from 'decimal.js/decimal';
import _ from 'lodash';

const { classicgrid } = strategiesMap;

export default modelBase({
  namespace: 'classicgrid',
  state: {
    createInfo: {},
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    rankings: {
      1: {},
      7: {},
    }, // 网格排行榜数据
    rankingsLoader: false, // 网格排行榜加载图
    rankingSymbol: '', // 网格排行榜选择的交易对
    hotSymbols: [], // 创建页面热币排行
    entryPriceLists: [], // 修改入场价格的列表
    backtest: {}, // 回测数据
  },
  effects: {
    *getOpenOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload || {};
      const stop = yield select((state) => state.classicgrid.stop);
      try {
        const { data: open } = yield call(CommonServe.getOpenOrders, {
          taskId,
          type: 'limit',
          symbol,
          pageSize: 500,
          currentPage: 1,
        });
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
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload || {};
      const open = yield select((state) => state.classicgrid.open);
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

    *getRanking({ payload: { id, day, symbol } }, { call, put, select }) {
      try {
        const oldRankings = yield select((state) => state.classicgrid.rankings);
        const cacheKey = _.isEmpty(symbol) ? 'all' : symbol;
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
        const oldRankingsNow = yield select((state) => state.classicgrid.rankings);
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
        console.error(error);
      }
    },
    // 获取创建的必要参数
    *getCreateInfo({ payload: { symbolCode, taskId } }, { call, put, select }) {
      try {
        const { data: createInfo } = yield call(getSpotCreateInfo, { symbolCode, taskId });
        let info = {};
        if (createInfo) {
          const { gridAiParam, gridSymbolInfo, symbolTick } = createInfo;
          info = {
            ...gridAiParam,
            ...gridSymbolInfo,
            lowerLimit: +gridAiParam.lowerLimit,
            upperLimit: +gridAiParam.upperLimit,
            minimumOrderValue: symbolTick.minimumOrderValue,
          };
        }
        const oldCreateInfo = yield select((state) => state.classicgrid.createInfo);
        yield put({
          type: 'update',
          payload: {
            createInfo: {
              ...oldCreateInfo,
              [symbolCode]: info,
            },
          },
        });
        return info;
      } catch (error) {
        const defaultCreateInfo = {
          lowerLimit: 0,
          upperLimit: 0,
          minimumOrderValue: 1,
          minimumInvestment: 10,
          gridNum: 100,
          gridProfitLowerRatio: 0,
          gridProfitUpperRatio: 0,
          gridProfitRatio: 0,
          feeRate: 0.0008,
        };
        return defaultCreateInfo;
      }
    },
    // 获取创建的必要参数
    *getBackTest({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getBackTestData, payload);

        const oldBacktest = yield select((state) => state.classicgrid.backtest);
        yield put({
          type: 'update',
          payload: {
            backtest: {
              ...oldBacktest,
              [payload.symbol]: data,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    //  获取修改入场价格的记录
    *getUpdateEntryPriceLists({ payload: taskId }, { call, put }) {
      try {
        const { data: entryPriceLists } = yield call(getUpdateEntryPriceLists, taskId);
        yield put({
          type: 'update',
          payload: {
            entryPriceLists,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
