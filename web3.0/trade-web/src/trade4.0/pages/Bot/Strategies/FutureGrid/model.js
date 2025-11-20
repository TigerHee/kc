/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import { getRunningDetail } from 'Bot/services/running';
import { getTodayProfit } from 'Bot/services/machine';
import {
  getOpenOrders,
  getStopOrders,
  getHotSymbols,
  getSymbolTickItem,
  getAIParams,
} from './services';

import _ from 'lodash';

export default modelBase({
  namespace: 'futuregrid',
  state: {
    futureSymbol: [],
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    rankings: {
      1: {},
      7: {},
    }, // 网格排行榜数据
    rankingsLoader: false, // 网格排行榜加载图
    rankingSymbol: '', // 网格排行榜选择的交易对
    longShort: {
      longUser: 0,
      shortUser: 0,
    },
    hotSymbols: [], // 热币排行
    runningLists: [],
    copyDetail: {}, // 排行榜 详情
    historyLists: [], // 历史列表
    createInfo: {}, // 创建网格需要的参数 主要是里面minAmount 决定最小投资额
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
    *getOpenOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol } = payload || {};
      const stop = yield select((state) => state.futuregrid.stop);
      try {
        const { data: open } = yield call(getOpenOrders, {
          taskId,
          type: 'limit',
          symbol,
          pageSize: 500,
          currentPage: 1,
        });
        if (!open) {
          yield put({
            type: 'update',
            payload: {
              CurrentLoading: false,
            },
          });
          return;
        }
        // 处理后端返回是大写问题
        open.items = open.items?.map((el) => {
          el.side = el.side?.toLowerCase();
          el.type = el.type?.toLowerCase();
          return el;
        });
        yield put({
          type: 'update',
          payload: {
            opentotalNum: open.items?.length || 0,
            stoptotalNum: open?.anotherStateNum || 0,
            CurrentLoading: false,
            open,
            stop,
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            CurrentLoading: false,
          },
        });
      }
    },
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbolCode } = payload || {};
      const open = yield select((state) => state.futuregrid.open);
      try {
        const { data: stop } = yield call(getStopOrders, {
          taskId,
          symbol: symbolCode,
          pageSize: 100,
          currentPage: 1,
        });
        if (!stop) {
          yield put({
            type: 'update',
            payload: {
              HistoryLoading: false,
            },
          });
          return;
        }
        // 将外层stopReason移到每一个
        // 处理后端返回是大写问题
        stop.items = stop.items?.map((el) => {
          el.stopReason = stop.stopReason;
          el.side = el.side?.toLowerCase();
          el.type = el.type?.toLowerCase();
          return el;
        });
        yield put({
          type: 'update',
          payload: {
            stoptotalNum: stop?.totalSize || 0,
            opentotalNum: stop?.anotherStateNum || 0,
            HistoryLoading: false,
            stop,
            open,
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            HistoryLoading: false,
          },
        });
      }
    },
    *getRanking({ payload: { id, day, symbol } }, { call, put, select }) {
      try {
        const oldRankings = yield select((state) => state.futuregrid.rankings);
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
        const oldRankingsNow = yield select((state) => state.futuregrid.rankings);
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
    // 获取创建的必要参数
    *getCreateInfo({ payload: symbolCode }, { call, put, select }) {
      try {
        const oldCreateInfo = yield select((state) => state.futuregrid.createInfo);
        const { data: createInfo } = yield call(getSymbolTickItem, symbolCode);

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
        return {};
      }
    },
    // 获取ai参数
    *getAIParams({ payload: params }, { call, put, select }) {
      try {
        const oldAiparams = yield select((state) => state.futuregrid.aiparams);
        // 初始化没有direction, 就不传
        const postData = { symbol: params.symbol };
        if (params.direction) {
          postData.direction = params.direction;
        }
        const { data: aiparams } = yield call(getAIParams, postData);
        // ai参数接口返回的字段 不一样  转换哈
        aiparams.lowerPrice = aiparams.lowerLimit;
        aiparams.upperPrice = aiparams.upperLimit;
        yield put({
          type: 'update',
          payload: {
            aiparams: {
              ...oldAiparams,
              [params.symbol]: aiparams,
            },
          },
        });
        return aiparams;
      } catch (error) {
        console.log(error, 999);
        return {};
      }
    },
  },
});
