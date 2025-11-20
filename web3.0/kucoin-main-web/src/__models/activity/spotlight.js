/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
// import { checkValidations, verify } from 'services/security';
import { _t } from 'tools/i18n';
import * as spotlightServ from 'services/activity/spotlight';

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
    *signAgreement(a, { call, select, put }) {
      const rule = yield select((state) => state.spotlight.rule);
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
    // *order({ payload: { currency, size } }, { call, put, select }) {
    //   const result = { success: false };
    //   const rule = yield select(state => state.spotlight.rule);
    //   const { campaignId } = rule || {};

    //   if (campaignId) {
    //     const { data } = yield call(spotlightServ.order, campaignId, currency, size);
    //     if (data) {
    //       // 下单成功，更新资格
    //       yield put({
    //         type: 'getQualification',
    //         payload: {
    //           id: campaignId,
    //         },
    //       });
    //       result.success = true;
    //     }
    //   }
    //   return result;
    // },
    *getList(a, { call, put, select }) {
      const rule = yield select((state) => state.spotlight.rule);
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
    // 检查是否需要人机验证
    // *checkValidate({ payload = {} }, { call, put }) {
    //   const { data } = yield call(checkValidations, { bizType });
    //   let needCaptcha = false;
    //   if (data && data.length) {
    //     const checkArr = _.flatten(data);
    //     if (_.indexOf(checkArr, 'captcha') > -1) {
    //       needCaptcha = true;
    //     }
    //   }
    //   yield put({
    //     type: 'update',
    //     payload: { needCaptcha },
    //   });
    // },
    // *verifyCode({ payload: { captchaType, validate } }, { put }) {
    //   yield yield put({
    //     type: 'security_new/sec_verify',
    //     payload: {
    //       validationType: 'captcha',
    //       validationVal: JSON.stringify({
    //         bizType,
    //         captchaType,
    //         response: validate,
    //         secret: '',
    //       }),
    //       bizType,
    //     },
    //   });
    //   yield put({ type: 'refreshRule' });
    // },
    *orderAndVerify({ payload: { captchaType, validate, currency } }, { select, call, put }) {
      const verification = JSON.stringify({
        bizType,
        captchaType,
        response: validate,
        secret: '',
      });

      let success = false;
      const rule = yield select((state) => state.spotlight.rule);
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
