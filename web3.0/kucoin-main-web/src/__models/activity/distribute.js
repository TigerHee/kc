/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import * as distributeServ from 'services/activity/distribute';

const bizType = 'SPOTLIGHT_ORDER';
const REMAIN_SEC = _.random(5, 15) * 60; // [5min, 15min] => s

export default extend(base, polling, {
  namespace: 'distribute',
  state: {
    REMAIN_SEC,
    bizType,
    rule: null,
    list: null,
    needCaptcha: false,
    success: null,
    qualification: null,
  },
  effects: {
    *pullRule({ payload: { id } }, { call, put }) {
      const { data } = yield call(distributeServ.getDistributeInfo, id);
      console.log(data);
      // 剩余5分钟之内，检查人机验证
      // const {
      //   countDownSeconds,
      // } = data;
      // if (countDownSeconds <= REMAIN_SEC) {
      //   yield put({
      //     type: 'checkValidate',
      //   });
      // }

      yield put({
        type: 'update',
        payload: {
          rule: data,
        },
      });
    },
    *refreshRule(a, { select, put }) {
      const { rule, isLogin } = yield select((state) => {
        return {
          rule: state.distribute.rule,
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
      const { data } = yield call(distributeServ.getQualification, { campaignId: id, type: 12 });
      yield put({
        type: 'update',
        payload: {
          qualification: data,
        },
      });
    },

    *getList(a, { call, put, select }) {
      const rule = yield select((state) => state.distribute.rule);
      const { campaignId } = rule || {};

      if (campaignId) {
        const { data } = yield call(distributeServ.getHistoryList, campaignId);
        yield put({
          type: 'update',
          payload: {
            list: data,
          },
        });
      }
    },

    *orderAndVerify({ payload: { captchaType, validate } }, { select, call, put }) {
      try {
        const verification = JSON.stringify({
          bizType,
          captchaType,
          response: validate,
          secret: '',
        });

        // const success = false;
        const rule = yield select((state) => state.distribute.rule);
        const { campaignId } = rule || {};
        let data = null;
        if (campaignId) {
          data = yield call(distributeServ.order, campaignId, verification);
          yield put({ type: 'getQualification', payload: { id: campaignId } });
        }
        yield put({ type: 'refreshRule' });
        // yield put({
        //   type: 'update',
        //   payload: { success },
        // });
        return data;
      } catch (error) {
        return error;
      }
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
          effect: 'getList',
        },
      });
    },
  },
});
