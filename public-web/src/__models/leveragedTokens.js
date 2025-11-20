/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import { map } from 'lodash';
import * as serv from 'services/leveragedTokens';
import { pullArticleDetail } from 'services/news';
import base from 'common/models/base';
import mulPagination from 'common/models/mulPagination';
import filter from 'common/models/filter';
import polling from 'common/models/polling';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

export default extend(base, mulPagination, filter, polling, {
  namespace: 'leveragedTokens',
  state: {
    currentListType: 0,
    tokensMap: {},
    riskModalConfig: {
      isShow: false,
      callback: null,
    },
    showApplyModal: false,
    openFlag: undefined,
    applyData: {},
    applyType: '',
    agreement: {},
  },
  effects: {
    *watchUser(action, { take, put, select }) {
      while (true) {
        yield take('user/pullUser/@@end');
        const { user } = yield select((state) => state.user);
        if (user) {
          yield put({
            type: 'checkUserAgreement',
          });
        }
      }
    },
    *queryTokens({ payload = {} }, { put, call }) {
      const { success, data } = yield call(serv.queryTokens, payload);
      if (success) {
        yield put({
          type: 'updateAllTokens',
          payload: { data },
        });
      }
    },
    *queryBaseTokens({ payload = {} }, { put, call, select }) {
      const { tokensList } = yield select((state) => state.leveragedTokens);
      if (tokensList && tokensList.records.length) return;
      const { success, data } = yield call(serv.queryBaseTokens, payload);
      if (success) {
        // origin: 用作二次拦截当前接口的数据, 避免两个接口都在pending状态，queryTokens先拉取到，后被queryBaseTokens覆盖
        yield put({
          type: 'updateAllTokens',
          payload: {
            data,
            origin: 'baseTokens',
          },
        });
      }
    },
    *updateAllTokens({ payload = {} }, { put, select }) {
      const { data, origin } = payload;
      const { tokensList } = yield select((state) => state.leveragedTokens);
      // queryTokens先拉取到，则不应用queryBaseTokens的数据
      if (origin === 'baseTokens' && tokensList && tokensList.records.length) return;
      const tokensMap = {};
      const currencies = map(data, ({ code, ...other }) => {
        const item = {
          code,
          currency: code,
          currencyName: code,
          ...other,
        };
        tokensMap[code] = item;
        return item;
      });
      yield put({ type: 'update', payload: { tokensMap } });
      yield put({
        type: 'savePage',
        payload: {
          items: currencies,
        },
        listName: 'tokensList',
      });
    },
    *querySubscriptionHistory(_, { put, select, call }) {
      const { filters } = yield select((state) => state.leveragedTokens);
      const { success, ...other } = yield call(serv.querySubscriptionHistory, filters);
      if (success) {
        yield put({
          type: 'savePage',
          payload: other,
          listName: 'subscriptionHistory',
        });
      }
    },
    *queryRedemptionHistory(_, { put, select, call }) {
      const { filters } = yield select((state) => state.leveragedTokens);
      const { success, ...other } = yield call(serv.queryRedeemList, filters);
      if (success) {
        yield put({
          type: 'savePage',
          payload: other,
          listName: 'redemptionHistory',
        });
      }
    },
    *checkUserAgreement(_, { put, call }) {
      const { success, data } = yield call(serv.checkUserAgreement);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            openFlag: !!data,
          },
        });
      }
    },
    *agreeAgreement({ callback }, { put, call }) {
      const { success } = yield call(serv.agreeAgreement);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            openFlag: true,
          },
        });
        if (typeof callback === 'function') callback(success);
      }
    },
    *pullCurrencyInfo({ payload = {} }, { put, call, select }) {
      const { applyData } = yield select((state) => state.leveragedTokens);
      const { success, data } = yield call(serv.queryCurrencyInfo, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            applyData: {
              ...applyData,
              ...data,
            },
          },
        });
      }
    },
    *postSubscribeApply({ payload = {} }, { call }) {
      const result = yield call(serv.subscribeApply, payload);
      return result;
    },
    *postRedeemApply({ payload = {} }, { call }) {
      const result = yield call(serv.redeemApply, payload);
      return result;
    },
    *queryRebalanceList({ payload = {} }, { put, call }) {
      const { success, ...other } = yield call(serv.queryRebalanceList, payload);
      if (success) {
        yield put({
          type: 'savePage',
          payload: other,
          listName: 'rebalanceList',
        });
      }
    },
    *queryDealTime({ payload = {} }, { call }) {
      const res = yield call(serv.queryDealTime, payload);
      return res;
    },
    *updateNetAssetValue({ payload = {} }, { put, select }) {
      const { netAssetValue } = payload;
      const { applyData } = yield select((state) => state.leveragedTokens);
      if (applyData.code && netAssetValue !== undefined) {
        yield put({
          type: 'update',
          payload: {
            applyData: {
              ...applyData,
              netAssetValue,
            },
          },
        });
      }
    },
    *updateSnapshot({ payload }, { put, select }) {
      const { lastTradedPrice } = payload;
      const { applyData } = yield select((state) => state.leveragedTokens);
      if (applyData.code && lastTradedPrice !== undefined) {
        yield put({
          type: 'update',
          payload: {
            applyData: {
              ...applyData,
              lastTradedPrice,
            },
          },
        });
      }
    },
    *pullAgreementContent({ payload = {} }, { put, call, select }) {
      const { agreement } = yield select((state) => state.leveragedTokens);
      const { isZh } = payload;
      const path = isZh
        ? 'risk-disclosure-statement-of-kucoin-leveraged-tokens'
        : 'en-risk-disclosure-statement-of-kucoin-leveraged-tokens';
      const key = isZh ? 'zh_CN' : 'default';
      // 协议只拉一遍
      if (agreement[key]) return;
      const { data } = yield call(pullArticleDetail, path);
      yield put({
        type: 'update',
        payload: {
          agreement: {
            ...agreement,
            [key]: data.content,
          },
        },
      });
    },
  },
  reducers: {},
  subscriptions: {
    watchPollingLeveragedToken({ dispatch }) {
      // @deprecated 未触发
      // dispatch({
      //   type: 'watchPolling',
      //   payload: {
      //     effect: 'queryTokens',
      //     interval: 10 * 1000,
      //   },
      // });
    },
    watchUser({ dispatch }) {
      dispatch({
        type: 'watchUser',
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;
      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(
          '/margin-fund/nav:{SYMBOL_LIST}',
          'margin-fund.nav',
        )((arr) => {
          dispatch({
            type: 'updateNetAssetValue',
            payload: {
              netAssetValue: arr[0].data.netAssetValue,
            },
          });
        });
        socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
          (arr) => {
            dispatch({
              type: 'updateSnapshot',
              payload: {
                lastTradedPrice: arr[0].data.data.lastTradedPrice,
              },
            });
          },
          100,
          true,
        );
      });
    },
  },
});
