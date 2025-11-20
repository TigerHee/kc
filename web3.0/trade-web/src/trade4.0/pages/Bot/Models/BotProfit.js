/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import {
  getMyProfit,
  getTotalProfit,
  getAccuProfit,
  getAssetLayout,
} from 'Bot/services/profit';
import Decimal from 'decimal.js';
import { _t } from 'Bot/utils/lang';
import { strasMap } from 'Bot/config';
import { showDateTimeByZone } from 'helper';
import { getAccountType } from 'Bot/utils/util';

// 是否已经获取过这个接口标记
let hasFetchProfit_getDayProfit = false;
// 总排行榜交易对列表
export default extend(base, polling, {
  namespace: 'BotProfit',
  state: {
    detail: {
      pageData: [],
    },
    total: {},
    day: {
      7: {},
      30: {},
      90: {},
      todayRunningProfit: 0, // 今日收益 之前是todayProfit
      todayHistoryProfit: 0, // 历史收益
      totalRunningAmount: 0, // 运行资产 之前是runningAmount
      totalRunningProfit: 0, // 总收益 之前是totalProfit
      totalProfit: 0, // 累计收益
      historyProfit: 0, // 历史收益
    },
    currentDay: 30,
    quotaCurrency: 'USDT',
    accuProfit: {
      // 累计收益
      currentDay: 'WEEKLY',
      data: {
        WEEKLY: [],
        MONTHLY: [],
        QUARTERLY: [],
      },
    },
    assetLayout: {},
  },
  effects: {
    *getTotalProfit({ payload }, { call, put, select }) {
      try {
        const quotaCurrency = yield select(
          (state) => state.BotProfit.quotaCurrency,
        );
        const { data } = yield call(getTotalProfit, {
          quotaCurrency,
        });
        const total = { ...data };
        total.profitDistributions = total.profitDistributions?.map((el) => {
          el.templateName = strasMap.get(el.templateId)
            ? _t(strasMap.get(el.templateId)?.lang)
            : el.templateId;
          el.showprofit = Number(el.profit);
          return el;
        });
        // 处理模板名字国际化
        yield put({
          type: 'update',
          payload: {
            total,
          },
        });
      } catch (error) {
        console.log('error', error);
      }
    },
    *getDayProfit({ payload }, { call, put, select }) {
      try {
        const { oldDay, currentDay = 30, quotaCurrency } = yield select(
          (state) => ({
            oldDay: state.BotProfit.day,
            currentDay: state.BotProfit.currentDay,
            quotaCurrency: state.BotProfit.quotaCurrency,
          }),
        );
        const { data } = yield call(getMyProfit, {
          statisticsDays: currentDay,
          quotaCurrency,
        });
        const day = { ...data };
        if (day.timeProfits) {
          day.timeProfits.forEach((el) => {
            el.time = showDateTimeByZone(el.time, 'YYYY/MM/DD');
            el.showprofit = Number(el.profit);
          });
        }
        yield put({
          type: 'update',
          payload: {
            day: {
              ...oldDay,
              [currentDay]: day,
              todayRunningProfit: day.todayRunningProfit, // 今日收益 之前是todayProfit
              totalRunningAmount: day.totalRunningAmount, // 运行资产 之前是runningAmount
              totalRunningProfit: day.totalRunningProfit, // 总收益 之前是totalProfit
              totalProfit: day.totalProfit, // 累计收益
              historyProfit: day.historyProfit, // 历史收益
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getAccuProfit({ payload: currentDay }, { call, put, select, take, all }) {
      currentDay = currentDay || 'WEEKLY';
      const { data } = yield select((state) => state.BotProfit.accuProfit);
      try {
        let currentDayData;
        // 第一次获取需要等待这个接口获取完成之后 再拼装数据
        if (!hasFetchProfit_getDayProfit) {
          // 等待这个接口获取之后
          const [, { data: accData }] = yield all([
            take('BotProfit/getDayProfit/@@end'),
            call(getAccuProfit, currentDay),
          ]);
          currentDayData = accData;
          hasFetchProfit_getDayProfit = true;
        } else {
          const { data: results } = yield call(getAccuProfit, currentDay);
          currentDayData = results;
        }
        currentDayData = [...currentDayData];
        // 今天最新的利润数据
        const { todayRunningProfit, todayHistoryProfit } = yield select(
          (state) => state.BotProfit.day,
        );
        if (Number(todayRunningProfit) > 0) {
          // 将最后一条数据 替换为今天最新的利润数据， 因为原始数据是每小时更新，而最新数据是时时更新，会导致用户疑惑，所以前端拼装哈
          currentDayData[currentDayData.length - 1].profit = Decimal(
            currentDayData[currentDayData.length - 2].profit || 0,
          )
            .add(todayRunningProfit || 0)
            .add(todayHistoryProfit || 0)
            .toFixed(8, Decimal.ROUND_DOWN);
        }
        currentDayData.forEach((el) => {
          el.date = showDateTimeByZone(el.date, 'YYYY/MM/DD');
          el.showprofit = Number(el.profit);
        });
        yield put({
          type: 'update',
          payload: {
            accuProfit: {
              currentDay,
              data: {
                ...data,
                [currentDay]: currentDayData,
              },
            },
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            accuProfit: {
              currentDay,
              data: {
                ...data,
                [currentDay]: [],
              },
            },
          },
        });
      }
    },
    *getAssetLayout({ payload }, { call, put }) {
      try {
        const { data } = yield call(getAssetLayout);
        const assetLayout = { ...data };
        assetLayout.items = assetLayout?.items?.sort(
          (a, b) => Number(b.percent) - Number(a.percent),
        );
        assetLayout.items = assetLayout?.items?.map((el) => {
          el.showpercent = Number(el.percent);
          const type = getAccountType(el);
          el.showname = `${el.currency}${type}`;
          return el;
        });
        yield put({
          type: 'update',
          payload: {
            assetLayout,
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
