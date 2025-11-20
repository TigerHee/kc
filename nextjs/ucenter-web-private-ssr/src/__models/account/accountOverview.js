/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { forEach } from 'lodash-es';
import {
  getKycStatusDisplayInfo,
  getUserPromptInformations,
  getUserVipInfo,
  pullUserOverviewInfo,
  queryAssetOverview,
  queryFvoriteMarket,
  queryKumexCandles,
  queryNewHotMarket,
  queryNewsByCategories,
  queryUserOverviewInfo,
} from 'services/account';
import { queryExamine } from 'services/examine';
import * as serv from 'services/homepage';
import { getUserFee } from 'services/kumex_trade';
import { bootConfig } from 'kc-next/boot';
import { IS_SERVER_ENV } from 'kc-next/env';

export default extend(base, {
  namespace: 'accountOverview',
  state: {
    news: [],
    hideBalanceAmount: !!IS_SERVER_ENV, // 隐藏资产数量 ssr 环境必隐藏
    baseInfo: {
      ipRecordResponse: {},
      userOverviewResponse: {
        securityLevel: 0,
        kycStatus: 'not_commit',
      },
    },
    assetOverview: {},
    balanceCurrency: bootConfig._BASE_CURRENCY_,
    vipInfo: {},
    feeDiscountConfig: {
      discountRate: 100,
      isGlobalDeductionEnabled: false,
    },
    feeDiscountEnable: {}, // 用户是否可以进行kcs抵扣
    userKcsDiscountStatus: false,
    hotMarketList: [],
    favoriteMarketList: [],
    trendMap: {},
    kumexTrendMap: {},
    futureFee: {},
    examinInfo: {}, //信息审查信息
    kycStatusDisplayInfo: {}, // kyc状态显示文案信息
    modifyPermissions: {
      nickname: false,
      avatar: false,
    },
  },
  effects: {
    *getUserVipInfo({ payload = {} }, { put, call }) {
      const { data = {} } = yield call(getUserVipInfo, payload);
      const { makerFeeRate, takerFeeRate } = data || {};
      yield put({ type: 'update', payload: { vipInfo: data } });
      yield put({
        type: 'getUserKcsEnable',
        payload: { makerFeeRate, takerFeeRate },
      });
    },
    *getUserKcsEnable({ payload = {} }, { put, call }) {
      const { data } = yield call(serv.getUserKcsEnable, payload);
      yield put({ type: 'update', payload: { feeDiscountEnable: data || {} } });
    },
    *getUserOverviewInfo({ payload = {} }, { put, call }) {
      const { data = {} } = yield call(queryUserOverviewInfo, payload);
      yield put({ type: 'update', payload: { baseInfo: data } });
    },
    *getAssetOverview({ payload = {} }, { put, call }) {
      try {
        const { data = {} } = yield call(queryAssetOverview, payload);
        yield put({ type: 'update', payload: { assetOverview: data } });
      } catch (e) {
        yield put({ type: 'update', payload: { assetOverview: {} } });
      }
    },
    *getNewsByCategories({ payload = {} }, { put, call }) {
      try {
        const { items = [], success } = yield call(queryNewsByCategories, payload);
        if (success) {
          yield put({ type: 'update', payload: { news: items } });
        } else {
          yield put({ type: 'update', payload: { news: [] } });
        }
      } catch (e) {
        yield put({ type: 'update', payload: { news: [] } });
      }
    },
    *getFeeDeductionConfig(_, { put, call }) {
      const { data } = yield call(serv.getFeeDeductionConfig);
      yield put({
        type: 'update',
        payload: {
          feeDiscountConfig: data,
        },
      });
    },
    *getUserKcsDiscount(_, { put, call }) {
      const { data } = yield call(serv.checkIsKcsDiscountOn);
      yield put({
        type: 'update',
        payload: {
          userKcsDiscountStatus: (data || {}).isDeductionEnabled || false,
        },
      });
    },
    *updateUserKcsDiscount({ payload }, { put, call }) {
      yield call(serv.updateKcsDiscount, payload.enabled);
      yield put({
        type: 'getUserKcsDiscount',
      });
    },
    *getHotMarket({ payload }, { put, call }) {
      // const { data } = yield call(queryHotMarket, payload); 统一迁移到新接口
      const { data } = yield call(queryNewHotMarket, payload);
      yield put({ type: 'update', payload: { hotMarketList: data?.data || [] } });
    },

    *getFvoriteMarket({ payload }, { put, call }) {
      // 请求前先清空之前的数据，防止数据干扰
      yield put({ type: 'update', payload: { favoriteMarketList: [] } });
      const { data } = yield call(queryFvoriteMarket, payload);
      yield put({ type: 'update', payload: { favoriteMarketList: data || [] } });
    },
    *getKLineData({ payload }, { call, put, select }) {
      const trendMap = yield select((state) => state.accountOverview.trendMap);
      const { symbol, begin, end } = payload || {};
      if (trendMap[symbol]) {
        // 不重复查询
        return;
      }
      const { success, data } = yield call(serv.getKLineData, {
        symbol,
        type: '5min',
        begin,
        end,
      });
      if (success) {
        const list = data || [];
        const result = [];
        forEach(list, (item) => {
          if (item && item.length > 2) {
            const key = item[0];
            const val = item[2];
            if (key && val !== undefined) {
              result.push([Number(key), Number(val)]);
            }
          }
        });
        result.sort((a, b) => Number(a[0]) - Number(b[0]));
        trendMap[symbol] = result;
        yield put({
          type: 'update',
          payload: {
            trendMap: { ...trendMap },
          },
        });
      }
    },
    *getKumexCandles({ payload }, { call, put, select }) {
      const kumexTrendMap = yield select((state) => state.accountOverview.kumexTrendMap);
      const { symbol, begin, end } = payload || {};
      if (kumexTrendMap[symbol]) {
        // 不重复查询
        return;
      }
      let res = {};
      try {
        res = yield call(queryKumexCandles, {
          symbol,
          resolution: 5,
          from: begin,
          to: end,
        });
      } catch (e) {
        res = e;
      }
      const { c = [], t = [] } = res || {};
      if (t?.length) {
        const result = [];
        forEach(t, (time, index) => {
          if (time) {
            const close = c[index];
            if (time && close !== undefined) {
              result.push([Number(time), Number(close)]);
            }
          }
        });
        result.sort((a, b) => Number(a[0]) - Number(b[0]));
        kumexTrendMap[symbol] = result;
        yield put({ type: 'update', payload: { kumexTrendMap: { ...kumexTrendMap } } });
      }
    },
    *pullUserPromptInformations({ payload }, { call }) {
      const { success, data } = yield call(getUserPromptInformations, payload);
      if (success) return data;
      return null;
    },
    *getRealFutureFee(_, { call, put }) {
      try {
        const { data } = yield call(getUserFee, { symbol: 'XBTUSDTM' });
        yield put({ type: 'update', payload: { futureFee: data || {} } });
      } catch (e) {
        console.log(e);
      }
    },
    *getKycStatusDisplayInfo(_, { call, put }) {
      const { data } = yield call(getKycStatusDisplayInfo);
      yield put({ type: 'update', payload: { kycStatusDisplayInfo: data } });
    },
    *queryExamine(_, { call, put }) {
      try {
        const { data } = yield call(queryExamine, { bizType: 'EXAMINE_MESSAGE' });
        if (data && data?.EXAMINE_MESSAGE) {
          if (data?.EXAMINE_MESSAGE?.dismiss) {
            yield put({
              type: 'update',
              payload: { examinInfo: data?.EXAMINE_MESSAGE?.notice || {} },
            });
          } else {
            yield put({
              type: 'update',
              payload: { examinInfo: {} },
            });
          }
        } else {
          yield put({
            type: 'update',
            payload: { examinInfo: {} },
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    *pullModifyPermissions(_, { put, call }) {
      try {
        const { success, msg, data = {} } = yield call(pullUserOverviewInfo);
        if (success) {
          const { canModifyNickname = false, canModifyAvatar = false } = data;
          yield put({
            type: 'update',
            payload: {
              modifyPermissions: {
                nickname: canModifyNickname,
                avatar: canModifyAvatar,
              },
            },
          });
        } else {
          throw new Error(msg);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
});
