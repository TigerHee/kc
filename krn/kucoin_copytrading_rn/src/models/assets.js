/**
 * Owner: harry@kupotech.com
 */
import extend from 'dva-model-extend';
import {getBaseCurrency} from 'site/tenant';

import {
  fetchSmallExchangeConfig,
  getRestrictedInfo,
  queryTradeAccount,
} from 'services/assets';
import {getKycGuide, getKycGuideContent} from 'services/kyc';
import {baseModel} from 'utils/dva';
import polling from 'utils/models/polling';

const getCoinMap = coins => {
  const temp = {};
  coins.forEach(item => {
    const {currency} = item;
    temp[currency] = {...item};
  });
  return temp;
};
// 按交易对获取map

export default extend(baseModel, polling, {
  namespace: 'assets',
  state: {
    trade: [],
    tradeMap: {},
    smallExchangeConfig: null,
    restrictedStatus: 0, // 是否是 KYC 清退用户  0-正常 1-清退 10-ip限制 20-kyc限制
    restrictedInfo: {},
  },
  effects: {
    *pullAccountCoins(_, {call, put, _all, select}) {
      const {smallExchangeConfig} = yield select(state => state.assets);
      const {data: trade} = yield call(
        queryTradeAccount,
        0,
        smallExchangeConfig?.baseCurrency,
      );
      const tradeMap = getCoinMap(trade);
      yield put({
        type: 'update',
        payload: {
          trade: trade || [],
          tradeMap,
        },
      });
    },

    *pullRestrictedInfo(_, {call, put}) {
      const {success, data} = yield call(getRestrictedInfo);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            restrictedStatus: data?.status || 0,
            restrictedInfo: data || {},
          },
        });
      }
    },

    *getSmallExchangeConfig({payload}, {put, call}) {
      try {
        const {data} = yield call(fetchSmallExchangeConfig, payload);
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: {
              baseCurrency: getBaseCurrency(),
              quotaLimit: 0,
            },
          },
        });
      }
    },

    *watchUserAndBaseConfig(action, {take, put, select, all}) {
      const {userInfo} = yield select(state => state.app);
      const {smallExchangeConfig} = yield select(state => state.assets);

      if (userInfo && smallExchangeConfig) {
        return;
      }

      while (true) {
        yield take('*');

        const {userInfo: nextUser} = yield select(state => state.app);
        const {smallExchangeConfig: nextConfig} = yield select(
          state => state.assets,
        );

        if (nextUser && nextConfig) {
          // yield put({
          //   type: 'pullAccountCoins',
          // });

          // yield put({
          //   type: 'assets/pullAccountCoins@polling:cancel',
          // });
          yield put({
            type: 'pullAccountCoins@polling',
          });
          yield put({
            type: 'pullAccountCoins',
          });
          return;
        }
      }
    },

    *pullKYCGuide(_, {put, call}) {
      try {
        const {success, data} = yield call(getKycGuide, {
          biz: 'currency',
        });
        if (success) {
          return data.needKyc;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    *pullKYCGuideContent(_, {put, call}) {
      try {
        const {success, data} = yield call(getKycGuideContent, {
          biz: 'currency',
        });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              kycGuideContent: data.assetGuildContent,
            },
          });
        }
      } catch (e) {}
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'getSmallExchangeConfig'});
    },

    watchUserAndBaseConfig({dispatch}) {
      dispatch({
        type: 'watchUserAndBaseConfig',
      });
    },
    watchPolling({dispatch}) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullAccountCoins',
          interval: 10 * 1000,
        },
      });
    },
  },
});
