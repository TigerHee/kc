/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import * as Service from 'AiFutureTrend/services';
import _ from 'lodash';
import { getStopOrders } from 'Bot/services/running';
import { uniqueByTime } from 'Bot/utils/util';
import { times100, div100 } from 'Bot/helper';
import { getMinInvestCacheKey } from './util';

let isGetCreatePageChartLoading = false;
export default modelBase({
  namespace: 'aifuturetrend',
  state: {
    createPageParams: {
      'BTC-USDT': {
        minInvestment: 10, // 最小投资额
        maxInvestment: 100000, // 最大投资额
        hourKline: [], // 小时K线收盘价
        arbitrageInfo: [], // 套利信息
      },
    }, // 创建页面参数
    createChart: {
      noMore: false,
      arbitrageInfo: [],
      hourKline: [],
    }, // 创建页面图表
    minInvestMap: {}, // 最小投资额

    stopChart: {
      noMore: false,
      hourKline: [],
      arbitrageInfo: [],
    },
  },
  effects: {
    // 获取创建页面参数
    *getCreatePageChart({ payload: { symbol, endTime, type } }, { call, put, select }) {
      if (isGetCreatePageChartLoading) return;
      isGetCreatePageChartLoading = true;
      const { createPageParams: oldCreatePageParams, createChart: OldCreateChart } = yield select(
        (state) => state.aifuturetrend,
      );
      try {
        const { data: createPageParams } = yield call(Service.getCreatePageChart, {
          symbol,
          endTime,
        });
        isGetCreatePageChartLoading = false;
        if (createPageParams) {
          [
            'defaultPullBack',
            'minStopLossPercent',
            'maxStopLossPercent',
            'maxStopProfitPercent',
            'minStopProfitPercent',
          ].forEach((key) => {
            createPageParams[key] = times100(createPageParams[key] || 0);
          });
        }
        let arbitrageInfo = createPageParams.arbitrageInfo ?? [];
        let hourKline = createPageParams.hourKline ?? [];
        const noMore = hourKline.length === 0;
        delete createPageParams.arbitrageInfo;
        delete createPageParams.hourKline;

        if (type === 'fetchMore') {
          arbitrageInfo = uniqueByTime(arbitrageInfo.concat(OldCreateChart.arbitrageInfo), [
            'buyTime',
            'sellTime',
          ]);
          hourKline = uniqueByTime(hourKline.concat(OldCreateChart.hourKline));
        }
        yield put({
          type: 'update',
          payload: {
            createPageParams: {
              ...oldCreatePageParams,
              [symbol]: createPageParams,
            },
            createChart: {
              noMore,
              arbitrageInfo,
              hourKline,
            },
          },
        });
        return createPageParams;
      } catch (error) {
        isGetCreatePageChartLoading = false;
      }
    },
    // 获取最小投资额度
    *getMinInvest({ payload: params }, { call, put, select }) {
      const oldMinInvestMap = yield select((state) => state.aifuturetrend.minInvestMap);
      try {
        if (!params.symbol || !params.leverage || !params.pullBack) {
          return;
        }
        const cacheKey = getMinInvestCacheKey(params);
        params.pullBack = div100(params.pullBack);

        const { data: minInvest } = yield call(Service.getMinInvest, params);

        yield put({
          type: 'update',
          payload: {
            minInvestMap: {
              ...oldMinInvestMap,
              [cacheKey]: minInvest,
            },
          },
        });
        return minInvest;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取当前委托参数
    *getOpenOrders({ payload: { taskId, endTime } }, { call, put, select }) {
      const oldOpen = yield select((state) => state.aifuturetrend.open);
      const { speedLines: oldSpeedLines = [], arbitrageInfo: oldArbitrageInfo = [] } = oldOpen;
      try {
        let { data: open } = yield call(Service.getOpenOrderPageChart, {
          taskId,
          endTime,
        });
        open.speedLines = open.speedLines ?? [];
        open.arbitrageInfo = open.arbitrageInfo ?? [];

        if (open.speedLines.length > 0) {
          // 时间又小到大排列
          open.speedLines.sort((a, b) => a.time - b.time);
          // 处理最后时间相同问题, 去除掉
          if (oldSpeedLines.length > 0) {
            const lastOne = open.speedLines[open.speedLines.length - 1];
            const firstOne = oldSpeedLines[0];
            if (lastOne.time === firstOne.time) {
              open.speedLines.pop();
            }
          }
        }

        if (open.speedLines.length > 0) {
          open.speedLines = [...open.speedLines, ...oldSpeedLines];
          open.arbitrageInfo = [...open.arbitrageInfo, ...oldArbitrageInfo];
          open.noMore = false;
        } else {
          // 这次没有返回数据, 就用之前的
          open = { ...oldOpen };
          open.noMore = true;
        }
        // 确保数据中没有相同的时间
        open.speedLines = uniqueByTime(open.speedLines);
        open.arbitrageInfo = uniqueByTime(open.arbitrageInfo, ['buyTime', 'sellTime']);
        yield put({
          type: 'update',
          payload: {
            CurrentLoading: false,
            open,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getStopOrders({ payload }, { call, put, select }) {
      const { taskId = '', symbol = 'BTC-USDT' } = payload ?? {};
      try {
        const { data: stop } = yield call(getStopOrders, {
          taskId,
          symbol,
          pageSize: 100,
          currentPage: 1,
        });
        yield put({
          type: 'update',
          payload: {
            stoptotalNum: stop.totalNum,
            HistoryLoading: false,
            stop,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 获取历史委托参数
    *getStopOrderPageChart({ payload: { taskId, endTime } }, { call, put, select }) {
      const oldStopChart = yield select((state) => state.aifuturetrend.stopChart);
      try {
        const { data } = yield call(Service.getStopOrderPageChart, {
          taskId,
          endTime,
        });
        const { hourKline = [], arbitrageInfo = [] } = data;
        // 处理最后时间相同问题
        if (hourKline.length > 0 && oldStopChart.hourKline.length > 0) {
          const lastOne = hourKline[hourKline.length - 1];
          const firstOne = oldStopChart.hourKline[0];
          if (lastOne.time === firstOne.time) {
            hourKline.pop();
          }
        }
        // 确保数据中没有相同的时间
        yield put({
          type: 'update',
          payload: {
            stopChart: {
              noMore: hourKline.length === 0,
              hourKline: uniqueByTime([...hourKline, ...oldStopChart.hourKline]),
              arbitrageInfo: uniqueByTime(
                [...arbitrageInfo, ...oldStopChart.arbitrageInfo],
                ['buyTime', 'sellTime'],
              ),
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
