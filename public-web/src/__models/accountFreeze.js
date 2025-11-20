/**
 * Owner: willen@kupotech.com
 */
import _isUndefined from 'lodash/isUndefined';
import base from 'common/models/base';
import authentication from 'common/models/authentication';
import countDown from 'common/models/countDown';
import kycCode from 'common/models/kycCode';
import extend from 'dva-model-extend';
import { push as routerPush } from 'utils/router';
import { checkFrozen, confirmFreeze, pullApplyStatus, authSubmit } from 'services/freeze';
import { SECURITY_EXPIRED } from 'codes';

export default extend(base, countDown, authentication, kycCode, {
  namespace: 'account_freeze',
  state: {
    pageLoading: true,
    userChecked: false,
    email: '',
    frozen: false,
    codeError: false,
    securityAllowTypes: [],
    verifyStep: 0,
    rejectReason: '',
  },
  effects: {
    *updateFrozenTime({ payload: { frozenTime } }, { put, select }) {
      const { frozenTime: frozenTimeState } = yield select((state) => state.account_freeze);
      if (_isUndefined(frozenTimeState)) {
        yield put({
          type: 'update',
          payload: {
            frozenTime,
          },
        });
        if (frozenTime > 0) {
          yield put({
            type: 'countDown',
            payload: {
              countKey: 'frozenTime',
              initial: frozenTime,
              step: 1000,
            },
          });
        } else {
          yield put({
            type: 'countDownClear',
            payload: {
              countKey: 'frozenTime',
            },
          });
        }
      }
    },
    *pullApplyInfo(_, { call, put }) {
      const { success, data } = yield call(pullApplyStatus);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            applyStatus: data.status,
            rejectReason: data.reason,
          },
        });
      }
    },
    *checkFreeze({ payload: { code } }, { call, put }) {
      try {
        const { data } = yield call(checkFrozen, { code });
        const { frozen, remainingTime, email } = data;
        yield put({
          type: 'update',
          payload: {
            frozen,
            email,
          },
        });
        if (frozen && remainingTime) {
          yield put({
            type: 'updateFrozenTime',
            payload: {
              frozenTime: Number(remainingTime),
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            codeError: true,
          },
        });
      } finally {
        yield put({
          type: 'update',
          payload: {
            pageLoading: false,
          },
        });
      }
    },
    *confirmFreeze({ payload: { code } }, { call, put }) {
      const { success } = yield call(confirmFreeze, { code });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            frozen: true,
          },
        });
      }
    },
    *getSecurityAllowTypes(_, { put }) {
      const allowTypes = yield yield put({
        type: 'security_new/get_verify_type',
        payload: {
          bizType: 'UNFROZEN_ACCOUNT',
        },
      });
      yield put({
        type: 'update',
        payload: {
          securityAllowTypes: allowTypes || [],
        },
      });
    },
    *authenticationSubmit(_, { select, call, put }) {
      const { fields } = yield select((state) => state.account_freeze);
      const postData = {};
      Object.keys(fields).forEach((key) => {
        // postData[key] = fields[key].fileId;
        // 后端返回一个原图id 一个缩略图id
        postData[key] = fields[key].fileId.original;
        postData[`${key}Mini`] = fields[key].fileId.mini;
      });
      try {
        const { success } = yield call(authSubmit, postData);
        if (success) {
          routerPush('/freeze');
        }
      } catch (e) {
        if (e.code === SECURITY_EXPIRED) {
          yield put({
            verifyStep: 0,
          });
        }
        throw e;
      }
    },
  },
});
