/* eslint-disable no-undef */
import extend from 'dva-model-extend';

import {
  getKyc3TradeLimitInfo,
  getPrices,
  getRates,
  queryUserInfo,
} from 'services/app';
import {baseModel} from 'utils/dva';
import {getNativeInfo, setNativeInfo} from 'utils/helper';
import {QueryClientCacheController} from 'utils/query-client-cache-controller';
import {setCsrf} from 'utils/request';

export default extend(baseModel, {
  namespace: 'app',
  state: {
    isLogin: null, // 初始化未发生请求时为null，已登录为true，未登录为false
    nativeInfo: null, // null为未获取到，获取到为object
    userInfo: null,
    currency: null,
    currencyList: [],
    rates: {},
    prices: {},
    networkType: 'CELLULAR',
    kyc3TradeLimitInfo: {
      // showPrivacy: true,
      // displayType: 'ERROR',
      // closable: true,
      // title: '需要身份認證',
      // content:
      //   '您的身份認證已失敗，可重新認證或加入 Telegram 社群尋求官方客服幫助。',
      // buttonAgree: '重新認證',
      // buttonAgreeWebUrl: '/account/kyc',
      // buttonAgreeAppUrl: '/user/kyc',
      // buttonRefuse: '取消',
    }, // kyc 信息，有需要展示 kyc 弹窗
    appVersion: null,
  },
  effects: {
    *initApp({payload}, {put}) {
      yield put({type: 'getUser'});
      yield put({type: 'pullRates'});
      yield put({type: 'pullPrices', payload: {}});
      // 可能改成遇到接口拦截报错 主动查询
      put({type: 'getKyc3TradeLimitInfo'});
    },
    *getUser(_, {put, call}) {
      try {
        const {success, data} = yield call(queryUserInfo);
        if (success && data) {
          data.csrf && setCsrf(data.csrf);
          QueryClientCacheController.resetQueriesByParentUid(data.uid);
          yield put({type: 'update', payload: {isLogin: true, userInfo: data}});

          yield put({type: 'leadInfo/pullUserLeadInfo'});
        } else {
          QueryClientCacheController.resetQueries();
          yield put({type: 'update', payload: {isLogin: false}});
        }
      } catch (e) {
        // 由于生物识别 或者 app token 掉登录态 都会进入 401 导致此处链路频繁 上报量较大 移除
        // Sentry.captureEvent({
        //   message: `app-getUser-catchMsg:${e?.msg + '_code:' + e?.code}`,
        //   tags: {
        //     fatal_type: 'network',
        //   },
        // });
        QueryClientCacheController.resetQueries();
        yield put({type: 'update', payload: {isLogin: false}});
      }
    },

    *pullRates(action, {call, put}) {
      const currencyList = [];
      let rates = {};
      try {
        const {data} = yield call(getRates);
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              currencyList.push(key);
            }
          }
          rates = data;
        }
      } catch (e) {
        console.log(e);
      }
      yield put({
        type: 'update',
        payload: {
          currencyList,
          rates,
        },
      });
    },

    *pullPrices({payload: {currency}}, {call, put, select}) {
      let nowCurrency = currency;
      const user = yield select(state => state.app.userInfo);
      if (!currency) {
        const nativeInfo = yield getNativeInfo();
        nowCurrency = nativeInfo.legal || 'USD';
        if (user && user.currency && user.currency !== 'null') {
          nowCurrency = user.currency;
        } else if (nowCurrency === 'CNY') {
          // 从缓存拿的CNY需要处理成USD
          nowCurrency = 'USD';
          yield setNativeInfo({...nativeInfo, legal: nowCurrency});
        }
      }
      yield put({
        type: 'update',
        payload: {
          currency: nowCurrency,
        },
      });

      const {data} = yield call(getPrices, nowCurrency);
      yield put({
        type: 'update',
        payload: {
          prices: data || {},
        },
      });
    },

    *getKyc3TradeLimitInfo({payload}, {call, put}) {
      const defaultQueryPayload = {status: 'KYC_LIMIT'};
      const {data} = yield call(
        getKyc3TradeLimitInfo,
        payload || defaultQueryPayload,
      );
      yield put({type: 'update', payload: {kyc3TradeLimitInfo: data || {}}});
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'initApp'});
    },
  },

  reducers: {
    resetUserInfo(state) {
      return {
        ...state,
        isLogin: false,
        userInfo: null,
      };
    },
  },
});
