/**
 * Owner: jessie@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import { ACTIVITY_NOT_STARTED } from 'components/Spotlight/SpotlightR6/constant';
import extend from 'dva-model-extend';
import isNil from 'lodash/isNil';
import {
  getActivityRegistrationCount,
  getSpotlightInfo,
  getSpotlightQualification,
  getTickets,
  pullActivityList,
  pullPage,
  reservation,
  signAgreement,
  signCountryAgreement,
} from 'services/spotlight';

export default extend(base, filter, polling, {
  namespace: 'spotlight',
  state: {
    filters: {
      id: '',
    },
    pageData: null,
    list: null,
    ticksInfo: {},
    detailInfo: {}, // spotlight6 活动内容
    qualification: {}, // spotlight6 活动资格达成情况
    showBlackListDrawer: false, // 黑名单
    showAgreementDrawer: false, // 协议
    activityRegistrationCount: 0, // 活动报名人数
    processingStatus: ACTIVITY_NOT_STARTED, // 目前活动进度
  },
  reducers: {
    processingStatusChange(state, { payload = {} }) {
      const { status = ACTIVITY_NOT_STARTED } = payload;
      return {
        ...state,
        processingStatus: status,
      };
    },
  },
  effects: {
    *query(_, { put, select }) {
      const { filters } = yield select((state) => state.spotlight);
      yield put({
        type: 'pullPage',
        payload: {
          ...filters,
        },
      });
    },
    *pullPage({ payload }, { call, put }) {
      const { data } = yield call(pullPage, payload);
      yield put({
        type: 'update',
        payload: {
          pageData: {
            ...data,
          },
        },
      });
    },
    *pullActivityList({ payload: { page, pageSize } }, { put, call }) {
      const {
        data: { items },
      } = yield call(pullActivityList, { page, pageSize });
      yield put({
        type: 'update',
        payload: {
          list: items || [],
        },
      });
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
    *changeProcessStatus({ payload: { status } }, { put }) {
      yield put({
        type: 'processingStatusChange',
        payload: {
          status,
        },
      });
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
    *getTickets({ payload: { id } }, { call, put, select }) {
      const { data, success } = yield call(getTickets, id);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            ticksInfo: data || {},
          },
        });
      }
    },
    *signCountryAgreement({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight.detailInfo.campaignId);
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
      const campaignId = yield select((state) => state.spotlight.detailInfo.campaignId);
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
    // 预约
    *reservation({ payload: { id, cb } }, { call, select, put }) {
      const { success } = yield call(reservation, id);
      if (success) {
        yield put({
          type: 'getQualification',
          payload: {
            id,
          },
        });
      }
    },
    // 活动报名人数
    *getActivityRegistrationCount({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight.detailInfo.campaignId);
      const { success, data, msg } = yield call(getActivityRegistrationCount, campaignId);
      if (success && !isNil(data)) {
        yield put({
          type: 'update',
          payload: {
            activityRegistrationCount: data,
          },
        });
      }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getActivityRegistrationCount',
          interval: 3 * 60 * 1000,
        },
      });
    },
  },
});
