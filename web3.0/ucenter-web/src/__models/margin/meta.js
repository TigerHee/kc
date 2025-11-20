/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import {
  getAutoLendConf,
  getUserMarginPostion,
  postAutoLend,
  setAutoRepayConfig,
  userSignAgreement,
} from 'services/margin';
import { pullArticleDetail, pullMarginTradeExamContent } from 'services/news';

const commonParams = { channel: 'WEB' };

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

export default extend(base, {
  namespace: 'marginMeta',
  state: {
    userPosition: null,
    currentMarket: window._BASE_CURRENCY_,
    positionDetail: {},
    autoLendConfig: {},
    noviceBenefitsVisible: false,
    agreement: {},
  },
  reducers: {
    updateAutoLendConfig(state, { payload }) {
      const { currency, isAutoLend } = payload;
      return {
        ...state,
        autoLendConfig: { ...state.autoLendConfig, [currency]: isAutoLend },
      };
    },
  },
  effects: {
    // todo 去掉开发阶段的强赋值
    *pullUserMarginPostion(action, { put, call }) {
      const { data } = yield call(getUserMarginPostion);

      yield put({
        type: 'update',
        payload: {
          userPosition: { ...(data || {}) },
        },
      });
    },
    *updateStatus({ payload = {} }, { put, select }) {
      const { userPosition } = yield select((state) => state.marginMeta);
      const {
        data: { type },
      } = payload;
      if (userPosition && type) {
        yield put({
          type: 'update',
          payload: {
            userPosition: { ...userPosition, status: type },
          },
        });
      }
    },

    *userSignAgreement({ disabledOpenLoansModal }, { put, call }) {
      const { data, success } = yield call(userSignAgreement);
      if (success) {
        if (data.hasFreshmanPackage && !disabledOpenLoansModal) {
          yield put({
            type: 'update',
            payload: {
              noviceBenefitsVisible: true,
            },
          });
        }
        yield put({ type: 'pullUserMarginPostion' });
      }
      return success;
    },
    // 获取自动借出配置
    *pullAutoLendConf({ payload = {} }, { put, call }) {
      const { currency } = payload;
      // 开通杠杆的币种才能请求
      const result = yield call(getAutoLendConf, { ...commonParams, ...payload });
      if (result.success) {
        yield put({
          type: 'updateAutoLendConfig',
          payload: {
            currency,
            isAutoLend: result.data.autoLendStatus === 'ENABLE',
          },
        });
      }
      return result;
    },
    // 修改自动借出配置
    *postAutoLend({ payload = {} }, { put, call }) {
      const { success } = yield call(postAutoLend, { ...commonParams, ...payload });
      if (success) {
        yield put({
          type: 'pullAutoLendConf',
          payload: {
            currency: payload.currency,
          },
        });
      }
      return success;
    },
    // 修改自动还币配置
    *postAutoRepayConfig({ payload = {}, callback }, { put, call, select }) {
      const { userPosition, positionDetail } = yield select((state) => state.marginMeta);
      const switchStatus = payload.switchStatus ? 'ON' : 'OFF';
      const { success } = yield call(setAutoRepayConfig, { switchStatus });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            userPosition: {
              ...userPosition,
              isAutoRepay: payload.switchStatus,
            },
            positionDetail: {
              ...positionDetail,
              isAutoRepay: payload.switchStatus,
            },
          },
        });
        if (typeof callback === 'function') callback();
      }
    },
    *pullAgreementContent({ payload = {}, forceFetch }, { put, call, select }) {
      const { agreement } = yield select((state) => state.marginMeta);
      const { isZh } = payload;
      const path = isZh ? 'margin-trading-agreement' : 'en-margin-trading-agreement';
      const key = isZh ? 'zh_CN' : 'default';
      // 非强制更新的情况下，协议只拉一遍
      if (agreement[key] && !forceFetch) return;
      const { data } = yield call(pullArticleDetail, path);
      yield put({
        type: 'update',
        payload: {
          agreement: {
            ...agreement,
            [key]: data,
          },
        },
      });
    },
    // 杠杆交易测试答题
    *pullMarginTradeExamContent(_, { put, call, select }) {
      const { data } = yield call(pullMarginTradeExamContent);
      let content = [];

      try {
        content = JSON.parse(data);
      } catch (error) {
        content = [];
      }

      yield put({
        type: 'update',
        payload: {
          examContent: Array.isArray(content) ? content : [],
        },
      });
    },
  },
  subscriptions: {
    subscribeMessage: async ({ dispatch }) => {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(
          '/margin/position',
          'position.status',
          true,
        )((arr) => {
          dispatch({
            type: 'updateStatus',
            payload: arr[0],
          });
        });
      });
    },
  },
});
