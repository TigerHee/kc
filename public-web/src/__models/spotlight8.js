/**
 * Owner: jessie@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import isNil from 'lodash/isNil';
import {
  getActivitySubcribeCount,
  getReserveStatus,
  getSpotlightInfo,
  getSpotlightQualification,
  getSubRecord,
  getUserSubcribeInfo,
  pullPage,
  signAgreement,
  signCountryAgreement,
  subcribe,
} from 'services/spotlight8';
import { EVENT_STATUS } from 'src/components/Spotlight/SpotlightR8/constants';

export default extend(base, filter, polling, {
  namespace: 'spotlight8',
  state: {
    filters: {
      id: '',
    },
    pageData: null,
    list: null, // 首页list
    cycleList: null, // 周期list
    ticksInfo: {},
    // 是否已经预约
    isBooked: false,
    // 活动状态
    eventStatus: EVENT_STATUS.ENDED,
    detailInfo: {}, // spotlight8 活动内容
    qualification: {}, // spotlight8 活动资格达成情况
    showBlackListDrawer: false, // 黑名单
    showAgreementDrawer: false, // 协议
    // 活动相关的统计信息
    summary: null,
    userSubcribeInfo: {},
    recordList: {}, //申购记录
  },
  effects: {
    *query(_, { put, select }) {
      const { filters } = yield select((state) => state.spotlight8);
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
    *getDetailInfo({ payload: { id } }, { call, put, all, select }) {
      const { data, success, msg } = yield call(getSpotlightInfo, id);
      if (success && data) {
        const currencyList = normalizeCurrencyList(data.currencyList, data.tokenPrice);
        yield put({
          type: 'update',
          payload: {
            detailInfo: {...data, currencyList },
          },
        });
      }
    },
    *getIsBooked({ payload: { id } }, { call, put }) {
      const { data, success, msg } = yield call(getReserveStatus, id);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            isBooked: data,
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
      const campaignId = yield select((state) => state.spotlight8.detailInfo.campaignId);
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
      const campaignId = yield select((state) => state.spotlight8.detailInfo.campaignId);
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
    // 活动报名人数及其他统计信息
    *getActivitySubcribeCount({ payload = {} }, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight8.detailInfo.campaignId);
      const { success, data, msg } = yield call(getActivitySubcribeCount, campaignId);
      if (success && !isNil(data)) {
        yield put({
          type: 'update',
          payload: {
            summary: data,
          },
        });
      }
    },
    // 获取用户申购信息
    *getUserSubcribeInfo(__, { call, select, put }) {
      const campaignId = yield select((state) => state.spotlight8.detailInfo.campaignId);
      const { success, data } = yield call(getUserSubcribeInfo, campaignId);
      if (success && !isNil(data)) {
        yield put({
          type: 'update',
          payload: {
            userSubcribeInfo: data,
          },
        });
      }
    },

    // 根据活动id查询spotlight8活动申购记录
    *getRecordList({ payload: { currentPage, pageSize } }, { put, select, call }) {
      const campaignId = yield select((state) => state.spotlight8.detailInfo.campaignId);
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
    },
  },
});

/**
 * 格式化货币列表, 标准化 tokenPrice, 增加 hasDiscount 字段
 * * 对货币列表进行排序, KCS 排在最前面, 有折扣的排在前面
 */
function normalizeCurrencyList(currencyList, standTokenPrice) {
  if (!currencyList || !currencyList.length) {
    return [];
  }
  return currencyList.map((item) => {
    const hasDiscount = !!Number(item.discountRate);
    const tokenPrice = hasDiscount ? item.discountTokenPrice : standTokenPrice;
    return {
      ...item,
      hasDiscount,
      tokenPrice,
    };
  }).sort((a, b) => {
    if (a.currency === 'KCS') {
      return -1;
    }
    if (a.hasDiscount && b.hasDiscount) {
      return Number(b.discountRate) - Number(a.discountRate) > 0 ? -1 : 0;
    }
    return a.hasDiscount ? -1 : b.hasDiscount ? 1 : 0;
  });
}
