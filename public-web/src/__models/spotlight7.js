/**
 * Owner: jessie@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import {
  getActivitySubcribeCount,
  getTabData,
  getSpotlightInfo,
  getSpotlightQualification,
  getSubRecord,
  getVaildSymbol,
  pullPage,
  signAgreement,
  signCountryAgreement,
  subcribe,
} from 'services/spotlight7';

export default extend(base, filter, polling, {
  namespace: 'spotlight7',
  state: {
    filters: {
      id: '',
    },
    pageData: null,
    list: null, // 首页list
    tabData: {}, //活动Tab区内容
    ticksInfo: {},
    detailInfo: {}, // spotlight7 活动内容
    qualification: {}, // spotlight7 活动资格达成情况
    showBlackListDrawer: false, // 黑名单
    showAgreementDrawer: false, // 协议
    showExplainModal: false, // 权益/规则弹窗
    explainModalType: '', //权益/规则弹窗
    activitySubcribeCount: 0, // 活动预约人数
    tradeSymbol: undefined,
    recordList: {}, //申购记录
  },
  effects: {
    *query(_, { put, select }) {
      const { filters } = yield select((state) => state.spotlight7);
      yield put({
        type: 'pullPage',
        payload: {
          ...filters,
        },
      });
    },
    *pullPage({ payload }, { call, put }) {
      const { data } = yield call(pullPage, payload);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            pageData: {
              ...data,
            },
          },
        });
      }
    },
    *getDetailInfo({ payload: { id } }, { call, put }) {
      const { data, success, msg } = yield call(getSpotlightInfo, id);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            detailInfo: data || {},
          },
        });
      }
    },
    *getQualification({ payload: { id } }, { call, put }) {
      const { data, success, msg } = yield call(getSpotlightQualification, id);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            qualification: data || {},
          },
        });
      }
    },
    *signCountryAgreement({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight7.detailInfo.campaignId);
      if (campaignId) {
        const { success } = yield call(signCountryAgreement, campaignId);
        if (success) {
          yield put({
            type: 'getQualification',
            payload: {
              id: campaignId,
            },
          });

          yield put({
            type: 'update',
            payload: {
              showBlackListDrawer: false,
            },
          });
        }
      }
    },
    *signAgreement({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight7.detailInfo.campaignId);
      if (campaignId) {
        const { success } = yield call(signAgreement, campaignId);
        if (success) {
          yield put({
            type: 'getQualification',
            payload: {
              id: campaignId,
            },
          });

          yield put({
            type: 'update',
            payload: {
              showAgreementDrawer: false,
            },
          });
        }
      }
    },
    // 申购
    *subcribe({ payload }, { call }) {
      const res = yield call(subcribe, payload);
      return res;
    },
    // 活动报名人数
    *getActivitySubcribeCount({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight7.detailInfo.campaignId);
      const { success, data, msg } = yield call(getActivitySubcribeCount, campaignId);
      if (success && !isNil(data)) {
        yield put({
          type: 'update',
          payload: {
            activitySubcribeCount: data,
          },
        });
      }
    },
    // 获取活动Tab区内容
    *getTabData({ payload: { id } }, { put, call, select }) {
      const { success, data } = yield call(getTabData, id);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            tabData: data,
          },
        });
      }
    },
    // 查看是否有可用交易对
    *getVaildSymbol({ payload: { currency } }, { put, call }) {
      const { success, data } = yield call(getVaildSymbol, currency);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            tradeSymbol: data,
          },
        });
      }
    },

    // 根据活动id查询spotlight7活动申购记录
    *getRecordList({ payload: { currentPage, pageSize } }, { put, select, call }) {
      const campaignId = yield select((state) => state.spotlight7.detailInfo.campaignId);
      const params = {
        campaignId,
        currentPage,
        pageSize,
      };
      const data = yield call(getSubRecord, params);
      if (data.success) {
        yield put({
          type: 'update',
          payload: {
            recordList: data,
          },
        });
      }
    },
    *openExplainModal({ payload } , { put }) {
      const { type } = payload;
      yield put({
        type: 'update',
        payload: {
          showExplainModal: true,
          explainModalType: type
        },
      });
    },
    *closeExplainModal(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          showExplainModal: false,
        },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getActivitySubcribeCount',
          interval: 3 * 60 * 1000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getTabData',
          interval: 30 * 1000,
        },
      });
    },
  },
});
