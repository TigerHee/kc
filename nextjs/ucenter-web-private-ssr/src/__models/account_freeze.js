/**
 * Owner: willen@kupotech.com
 */
import { SECURITY_EXPIRED } from 'codes';
import authentication from 'common/models/authentication';
import base from 'common/models/base';
import countDown from 'common/models/countDown';
import kycCode from 'common/models/kycCode';
import { message } from 'components/Toast';
import extend from 'dva-model-extend';
import { isUndefined as _isUndefined } from 'lodash-es';
import {
  authSubmit,
  checkFrozen,
  confirmFreeze,
  confirmFreezeNew,
  getPositionInfo,
  hasFreezeSub,
  hasSubUser,
  pullApplyStatus,
} from 'services/freeze';

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
    freezeSub: true,
    hasSubUser: false,
    positionInfo: {},
    hasFreezeSub: false,
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
      postData.unFreezeSub = false;
      if (window.location.search.includes('unfreezeSub')) {
        postData.unFreezeSub = true;
      }
      try {
        const { success } = yield call(authSubmit, postData);
        if (success) {
          // routerPush('/freeze');
          yield put({
            type: 'update',
            payload: {
              verifyStep: 2,
            },
          });
        }
      } catch (e) {
        if (e.code === SECURITY_EXPIRED) {
          yield put({
            type: 'update',
            payload: {
              verifyStep: 0,
            },
          });
        }
        throw e;
      }
    },
    *hasSubUser({ payload: { code } }, { call, put }) {
      const { success, data } = yield call(hasSubUser, { code });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            hasSubUser: data,
          },
        });
      }
    },
    *getPositionInfo(_, { call, put }) {
      const res = yield call(getPositionInfo);
      if (res?.success) {
        yield put({
          type: 'update',
          payload: {
            positionInfo: res?.data,
          },
        });
      }
      return res;
    },
    *confirmFreezeNew({ payload }, { call, put }) {
      try {
        const { success } = yield call(confirmFreezeNew, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              frozen: true,
            },
          });
        }
        return {};
      } catch (e) {
        if (e.code === '500030') {
          return { checkVerify: true };
        }
        message.error(e.msg || '');
        return {};
      }
    },
    *hasFreezeSub(_, { call, put }) {
      const { success, data } = yield call(hasFreezeSub);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            hasFreezeSub: data,
          },
        });
      }
    },
  },
});
