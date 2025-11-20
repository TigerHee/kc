/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import { add } from 'helper';
import moment from 'moment';
import { getAccountOpenConfig, getKumexIsBonus } from 'services/account';
import {
  getAssetDetail2,
  getAssetDetailV2,
  getProfitAssetsLayout,
  getProfitEarnings,
  getProfitMinDay,
  getProfitOverview,
  getUserBlanceRank,
  getUserDailyTrend,
  getUserTotalBlance,
  updateSwitchSubAssets,
} from 'services/assets';
import { getLastDayTotalInCome } from 'services/bonus';

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
    kumexIsBonus: false,
    // 盈亏分析
    showProfitDetail: false,
    profitLayouts: {
      TOTAL: {}, // 资产概览
      MAIN: {}, // 储蓄账户
      TRADE: {}, // 币币账户
    },
    profitEarnings: {
      TOTAL: {}, // 资产概览
      MAIN: {}, // 储蓄账户
      TRADE: {}, // 币币账户
    },
    profitOverview: {
      TOTAL: {}, // 资产概览
      MAIN: {}, // 储蓄账户
      TRADE: {}, // 币币账户
    },
    profitEarnMinDay: moment().subtract(3, 'months').format('YYYY-MM-DD'), // 盈亏分析-收益-时间选择最小值
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
      const { filters } = yield select((state) => state.overview);
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
    *pullUserBalanceRank(_, { put, call }) {
      const {
        data: { scaleBalanceModels, totalBalance },
      } = yield call(getUserBlanceRank, { baseCurrency: 'BTC', size: 5 });
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
    *pullUserTotalBalance(_, { put, call }) {
      const { data } = yield call(getUserTotalBlance, { baseCurrency: 'BTC' });
      const { mainModel, tradeModel } = data || {};
      const mainAssets = mainModel.totalBalance || 0;
      const tradeAssets = tradeModel.totalBalance || 0;
      const totalAssets = add(mainAssets, tradeAssets) || 0;
      yield put({
        type: 'update',
        payload: {
          totalBalance: data,
          totalAssets,
        },
      });
    },
    *pullAssetDetail({ callBack }, { put, call, select }) {
      const { balanceCurrency } = yield select((state) => state.user);
      const { success, data } = yield call(getAssetDetail2, {
        balanceCurrency: balanceCurrency || window._BASE_CURRENCY_,
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            assetDetail: data,
          },
        });
        if (callBack) {
          callBack();
        }
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
    *checkKumexIsOpen(action, { call, put, select }) {
      const { isLogin } = yield select((state) => state.user);
      if (!isLogin) return;
      const { data } = yield call(getAccountOpenConfig, {
        type: 'CONTRACT',
      });
      yield put({
        type: 'update',
        payload: {
          kumexOpenFlag: data,
        },
      });
    },
    *getKumexIsBonus(__, { put, call, select }) {
      const { isLogin, user } = yield select((state) => state.user);
      if (!isLogin) return;
      const payload = {
        isForOpen: false,
        userId: user.uid,
      };
      try {
        const { data } = yield call(getKumexIsBonus, payload);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              kumexIsBonus: data.hasRewards,
            },
          });
        }
      } catch (err) {
        //
      }
    },
    *updateSwitch({ payload }, { put, call }) {
      yield call(updateSwitchSubAssets, payload);
      yield put({ type: 'pullAssetDetail' });
    },
    *pullProfitLayouts({ payload }, { put, call, select }) {
      // 资产概览使用 assets/overview接口
      const { type } = payload;
      const handler = type === 'TOTAL' ? getAssetDetailV2 : getProfitAssetsLayout;
      let layoutData = {};
      try {
        const { data } = yield call(handler, {
          ...payload,
          balanceCurrency: window._BASE_CURRENCY_,
        });
        layoutData = data;
      } catch (e) {
        console.error(e);
      }
      const { profitLayouts } = yield select((state) => state.overview);
      yield put({
        type: 'update',
        payload: {
          profitLayouts: {
            ...profitLayouts,
            [type]: layoutData,
          },
        },
      });
    },
    *pullProfitEarnings({ payload }, { put, call, select }) {
      const { type } = payload;
      let earningsData = [];
      try {
        const { data } = yield call(getProfitEarnings, payload);
        earningsData = data;
      } catch (e) {
        console.error(e);
      }
      const { profitEarnings } = yield select((state) => state.overview);
      yield put({
        type: 'update',
        payload: {
          profitEarnings: {
            ...profitEarnings,
            [type]: earningsData,
          },
        },
      });
    },
    *pullProfitOverview({ payload }, { put, call, select }) {
      const { type } = payload;
      let overviewData = {};
      try {
        const { data } = yield call(getProfitOverview, payload);
        overviewData = data;
      } catch (e) {
        console.error(e);
      }
      const { profitOverview } = yield select((state) => state.overview);
      yield put({
        type: 'update',
        payload: {
          profitOverview: {
            ...profitOverview,
            [type]: overviewData,
          },
        },
      });
    },
    *pullProfitMinDay({ payload = {} }, { put, call }) {
      const { data } = yield call(getProfitMinDay, payload);
      yield put({
        type: 'update',
        payload: {
          profitEarnMinDay: data,
        },
      });
    },
  },
  subscriptions: {
    watchTotalPolling({ dispatch }) {
      //@deprecated 未触发
      // dispatch({
      //   type: 'watchPolling',
      //   payload: {
      //     effect: 'pullAssetDetail',
      //     interval: 20 * 1000,
      //   },
      // });
      // dispatch({
      //   type: 'watchPolling',
      //   payload: {
      //     effect: 'pullUserTotalBalance',
      //     interval: 30000,
      //   },
      // });
      // dispatch({
      //   type: 'watchPolling',
      //   payload: {
      //     effect: 'pullUserBalanceRank',
      //     interval: 30000,
      //   },
      // });
    },
  },
});
