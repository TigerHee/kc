/**
 * Owner: willen@kupotech.com
 */
// import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { _t } from 'tools/i18n';
import * as spotlightServ2 from 'services/activity/spotlight2';

export default extend(base, polling, {
  namespace: 'spotlight2',
  state: {
    rule: null,
    qualification: null,
    winningInfo: {},
  },
  effects: {
    *pullRule({ payload: { id } }, { call, put }) {
      const { data } = yield call(spotlightServ2.getSpotlightInfo, id);

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
          rule: state.spotlight2.rule,
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
      const { data } = yield call(spotlightServ2.getSpotlightQualification, id);
      const winningInfo = yield call(spotlightServ2.getWinningInfo, id);

      yield put({
        type: 'update',
        payload: {
          qualification: data,
          winningInfo: winningInfo.data || {},
        },
      });
    },
    *signAgreement(a, { call, select, put }) {
      const rule = yield select((state) => state.spotlight2.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        const { data } = yield call(spotlightServ2.signAgreement, campaignId);
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
    // 预约
    *reservation(payload, { call, select, put }) {
      const rule = yield select((state) => state.spotlight2.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        yield call(spotlightServ2.reservation, campaignId);
        yield put({
          type: 'refreshRule',
        });

        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('spotlight.reservation.success'),
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
          effect: 'pullRule',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'getQualification',
        },
      });
    },
  },
});
