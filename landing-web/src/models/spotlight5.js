/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { _t } from 'utils/lang';
import * as spotlightServ5 from 'services/spotlight5';

export default extend(base, polling, {
  namespace: 'spotlight5',
  state: {
    rule: null,
    qualification: null,
    winningInfo: {},
  },
  effects: {
    *pullRule({ payload: { id } }, { call, put }) {
      const { data } = yield call(spotlightServ5.getSpotlightInfo, id);

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
          rule: state.spotlight5.rule,
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
      const { data } = yield call(spotlightServ5.getSpotlightQualification, id);
      const winningInfo = yield call(spotlightServ5.getWinningInfo, id);

      yield put({
        type: 'update',
        payload: {
          qualification: data,
          winningInfo: winningInfo.data || {},
        },
      });
    },
    *signCountryAgreement({ payload = {} }, { call, select, put }) {
      const rule = yield select(state => state.spotlight5.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        const { data } = yield call(spotlightServ5.signCountryAgreement, campaignId);
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
    *signAgreement({ payload = {} }, { call, select, put }) {
      const rule = yield select(state => state.spotlight5.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        const { data } = yield call(spotlightServ5.signAgreement, campaignId);
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
    *reservation({ payload: { cb } }, { call, select, put }) {
      const rule = yield select(state => state.spotlight5.rule);
      const { campaignId } = rule || {};
      if (campaignId) {
        const { data } = yield call(spotlightServ5.reservation, campaignId);
        if(cb){
          cb(data);
        }
        yield put({
          type: 'refreshRule',
        });
        // yield put({
        //   type: 'notice/feed',
        //   payload: {
        //     type: 'message.success',
        //     message: _t('spotlight.reservation.success'),
        //   },
        // });
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
