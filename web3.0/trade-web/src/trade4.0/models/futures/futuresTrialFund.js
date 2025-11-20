/**
 * Owner: garuda@kupotech.com
 */
import extend from 'dva-model-extend';
import { isObject } from 'lodash';
import { getTrialFundDetail, getCurrentUserCoupon, getTrialDetail } from '@/services/futures';

import base from 'common/models/base';

export default extend(base, {
  namespace: 'futuresTrialFund',
  state: {
    isHasTrialFund: false, // 当前用户是否有体验金
    isAvailableTrialFund: false, // 当前用户是否有可用体验金
    switchTrialFund: false, // 是否切换使用体验金
    trialFundDetail: {}, // 当前体验金券详情
    trialFundVisible: false, // 优惠券选择弹框
    trialFundActivateVisible: false, // 激活弹框提示
    trialFundInsufficientVisible: false, // 体验金保证金不足弹框提示
    isHidden: false, // 是否勾选隐藏单
    trialId: undefined, // 体验金id
    trialModalState: false, // 体验金详情弹框
    trialModalData: {}, // 体验金详情
    couponModalState: false, // 抵扣券详情弹框
    couponModalData: {}, // 抵扣券详情
  },
  effects: {
    *getTrialFund({ payload }, { call }) {
      try {
        const data = yield call(getTrialFundDetail, payload);
        return data;
      } catch (err) {
        throw err;
      }
    },
    *getCurrentUserCoupon({ payload }, { call, put }) {
      const oData = yield call(getCurrentUserCoupon, payload);
      if (oData && isObject(oData)) {
        yield put({
          type: 'update',
          payload: {
            currentCoupon: oData.data,
          },
        });
      }
    },
    /**
     * @name pullTrialModalDetail
     * @description 获取体验金详情(规则弹框)
     */
    *pullTrialModalDetail({ payload = {} }, { call, put }) {
      const { data, success } = yield call(getTrialDetail, payload.code);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            trialModalData: data,
          },
        });
      }
    },
  },
  subscriptions: {},
});
