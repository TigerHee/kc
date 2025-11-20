/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import { each, isEmpty } from 'lodash';
import base from 'common/models/base';
import polling from 'common/models/polling';
import * as serv from 'services/leveragedTokens';
import { pullArticleDetail, pullEtfExamContent } from 'services/homepage';
import socketStore from 'src/pages/Trade3.0/stores/store.socket';
import workerSocket from 'common/utils/socketProcess';
import { isABNew } from '@/meta/const';

// const socket = ws.getInstance();

export default extend(base, polling, {
  namespace: 'leveragedTokens',
  state: {
    showRiskModal: false,
    openFlag: undefined,
    tokensMap: {},
    agreement: '',
    examContent: [],
  },
  effects: {
    *watchUser({ type }, { take, put, select }) {
      // 新交易大厅统一到@/hooks/useInitRequest处理下面请求
      if (!isABNew()) {
        while (true) {
          yield take('user/pullUser/@@end');
          const { user } = yield select((state) => state.user);
          if (user) {
            yield put({
              type: 'leveragedTokens/checkUserAgreement',
            });
          }
        }
      }
    },
    *queryBaseTokens({ payload = {} }, { put, call, select }) {
      const { tokensMap } = yield select((state) => state.leveragedTokens);
      if (!isEmpty(tokensMap)) return true;
      const { success, data } = yield call(serv.queryBaseTokens, payload);
      if (success) {
        const _tokensMap = {};
        each(data, (item) => {
          _tokensMap[item.code] = item;
        });
        yield put({
          type: 'update',
          payload: {
            tokensMap: _tokensMap,
          },
        });
      }
      return success;
    },
    *checkUserAgreement(_, { put, call, select }) {
      const { openFlag } = yield select((state) => state.leveragedTokens);
      // 开通状态不可逆，已经开通的不再请求
      if (openFlag) return;
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
    *pullCurrencyInfo({ payload = {}, callback }, { call }) {
      const { success, data } = yield call(serv.queryCurrencyInfo, payload);
      if (success && typeof callback === 'function') callback(data);
    },
    *pullCurrencyNav({ payload = {} }, { call }) {
      const { currencyCode } = payload;
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const connected = yield workerSocket.connected();
      if (connected) {
        const topic = ws.Topic.get('/margin-fund/nav:{SYMBOL_LIST}', {
          SYMBOLS: [currencyCode],
        });

        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;

          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topicState[topic] &&
            topicState[topic].status === topicStateData
          ) {
            return;
          }
        }
      }
      const { success, data } = yield call(serv.queryCurrencyNav, payload);
      if (success) {
        socketStore.handler.update({
          netAssetValue: data,
        });
      }
    },
    *pullAgreementContent(_, { put, call, select }) {
      const { currentLang } = yield select((state) => state.app);
      const { agreement } = yield select((state) => state.leveragedTokens);
      if (agreement) return;
      const path =
        currentLang === 'zh_CN'
          ? 'risk-disclosure-statement-of-kucoin-leveraged-tokens'
          : 'en-risk-disclosure-statement-of-kucoin-leveraged-tokens';

      const { data } = yield call(pullArticleDetail, path);
      yield put({
        type: 'update',
        payload: {
          agreement: data.content,
        },
      });
    },
    // 杠杆ETF交易测试答题
    *pullEtfExamContent(_, { put, call, select }) {
      const { data } = yield call(pullEtfExamContent);
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
  reducers: {},
  subscriptions: {
    setUpLeverageToken({ dispatch }) {
      // TIPS: 旧版本逻辑，先清理
      // if (!isABNew()) {
      //   dispatch({ type: 'queryBaseTokens' });
      // }
    },
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullCurrencyNav',
        },
      });
    },
    // TIPS: 旧版本逻辑，先清理
    // watchUser({ dispatch }) {
    //   dispatch({
    //     type: 'watchUser',
    //   });
    // },
  },
});
