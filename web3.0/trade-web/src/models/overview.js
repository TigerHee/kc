/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import moment from 'moment';
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import { add } from 'helper';
import { getLastDayTotalInCome } from 'services/bonus';
import { getUserDailyTrend, getUserBlanceRank, getAssetDetail2 } from 'services/assets';
import { getAccountOpenConfig } from 'services/account';

export default extend(base, filter, polling, {
  namespace: 'overview',
  state: {
    showAssets: true,
    filters: {
      accountType: 'ACCOUNT_TYPE_TOTAL',
      targetCurrency: 'BTC',
      startDate: 30,
    },
    assetDetail: {},
    dailyTrends: null,
    totalTrends: null,
    totalBalance: null,
    totalAssets: null,
    accountBalance: null,
    LastDayTotalInCome: 0,
    kumexOpenFlag: undefined,
  },
  effects: {
    *pullDailyTrend({ payload }, { put, call }) {
      const { data } = yield call(getUserDailyTrend, payload);
      yield put({
        type: 'update',
        payload: {
          dailyTrends: data,
        },
      });
    },
    *query(_, { put, select }) {
      const { filters } = yield select(state => state.overview);
      const { accountType, targetCurrency } = filters;
      const startDate = moment().subtract(filters.startDate, 'd').valueOf();
      const endDate = moment().valueOf();
      yield put({
        type: 'pullDailyTrend',
        payload: {
          accountType,
          targetCurrency,
          startDate,
          endDate,
        },
      });
    },
    *checkKumexIsOpen({ payload = {} }, { call, put, select }) {
      const { isLogin } = yield select(state => state.user);
      if (!isLogin) return;
      const { data, success } = yield call(getAccountOpenConfig, {
        type: 'CONTRACT',
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            kumexOpenFlag: data,
          },
        });
      }
    },
    *pullUserBalanceRank(_, { put, call }) {
      const { data: { scaleBalanceModels, totalBalance } } =
        yield call(getUserBlanceRank, { baseCurrency: 'BTC', size: 5 });
      yield put({
        type: 'update',
        payload: {
          totalTrends: {
            scaleAssets: scaleBalanceModels,
            totalAssets: totalBalance,
          },
        },
      });
    },
    // 废弃，无调用了
    // *pullUserTotalBalance(_, { put, call, select }) {
    //   const { balanceCurrency } = yield select(state => state.user);
    //   const { data } = yield call(getUserTotalBlance, { baseCurrency: balanceCurrency || 'USDT' });
    //   const { mainModel = {}, tradeModel = {}, marginModel = {}, baseCurrency } = data || {};
    //   const mainAssets = mainModel.totalBalance || 0;
    //   const tradeAssets = tradeModel.totalBalance || 0;
    //   const marginAssets = marginModel.totalBalance || 0;
    //   const totalAssets = add(add(mainAssets, tradeAssets), marginAssets) || 0;
    //   yield put({
    //     type: 'update',
    //     payload: {
    //       totalBalance: data,
    //       totalAssets,
    //       backBaseCurrency: baseCurrency,
    //     },
    //   });
    // },
    *pullAssetDetail(_, { put, call, select }) {
      const { balanceCurrency } = yield select(state => state.user);
      const { success, data } = yield call(getAssetDetail2, {
        balanceCurrency: balanceCurrency || 'USDT',
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            assetDetail: data,
          },
        });
      }
    },
    *getLastDayTotalInCome(_, { put, call }) {
      const { data } = yield call(getLastDayTotalInCome, { currency: 'BTC' });
      yield put({
        type: 'update',
        payload: {
          LastDayTotalInCome: data,
        },
      });
    },
  },
  subscriptions: {
    watchTotalPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullUserTotalBalance',
          interval: 30000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullUserBalanceRank',
          interval: 30000,
        },
      });
    },
  },
});
