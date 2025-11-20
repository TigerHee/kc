/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { _t } from 'utils/lang';
import * as spotlightServ from 'services/spotlight';

const bizType = 'SPOTLIGHT_ORDER';
const REMAIN_SEC = _.random(5, 15) * 60; // [5min, 15min] => s

export default extend(base, polling, {
  namespace: 'spotlight',
  state: {
    REMAIN_SEC,
    bizType,
    rule: null,
    list: null,
    qualification: null,
    needCaptcha: false,
    success: null,
  },
  effects: {
    *pullRule({ payload: { id } }, { call, put }) {
      const { data } = yield call(spotlightServ.getSpotlightInfo, id);
      yield put({
        type: 'update',
        payload: {
          rule: data,
        },
      });
    },
    *refreshRule({ payload = {} }, { select, put }) {
      const { rule, isLogin } = yield select((state) => {
        return {
          rule: state.spotlight.rule,
          isLogin: state.user.isLogin,
        };
      });
      const { campaignId } = rule || {};
      if (campaignId) {
        yield put({
          type: 'pullRule',
          payload: {
            id: campaignId,
          },
        });
        if (isLogin) {
          yield put({
            type: 'getQualification',
            payload: {
              id: campaignId,
            },
          });
        }
      }
    },
    *getQualification({ payload: { id } }, { call, put }) {
      const { data } = yield call(spotlightServ.getSpotlightQualification, id);
      yield put({
        type: 'update',
        payload: {
          qualification: data,
        },
      });
    },
    *signAgreement({ payload = {} }, { call, select, put }) {
      const rule = yield select(state => state.spotlight.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        const { data } = yield call(spotlightServ.signAgreement, campaignId);
        if (data) {
          yield put({
            type: 'getQualification',
            payload: {
              id: campaignId,
            },
          });

          yield put({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: _t('operation.succeed'),
            },
          });
        }
      }
    },
    *getList({ payload = {} }, { call, put, select }) {
      const rule = yield select(state => state.spotlight.rule);
      const { campaignId } = rule || {};

      if (campaignId) {
        const { data } = yield call(spotlightServ.getHistoryList, campaignId);
        yield put({
          type: 'update',
          payload: {
            list: data,
          },
        });
      }
    },
    *orderAndVerify({ payload: { captchaType, validate, currency } }, { select, call, put }) {
      const verification = JSON.stringify({
        bizType,
        captchaType,
        response: validate,
        secret: '',
      });

      let success = false;
      const rule = yield select(state => state.spotlight.rule);
      const { campaignId } = rule || {};

      if (campaignId) {
        const { data } = yield call(spotlightServ.order, campaignId, currency, verification);
        if (data) {
          success = true;
        }
      }
      yield put({ type: 'refreshRule' });
      yield put({
        type: 'update',
        payload: { success },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullRule',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getQualification',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getList',
        },
      });
    },
  },
});
