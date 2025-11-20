/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import authentication from 'common/models/authentication';
import base from 'common/models/base';
import kycCode from 'common/models/kycCode';
import extend from 'dva-model-extend';
import { evtEmitter, isIOS } from 'helper';
import { kycCheckFace, kycCheckPic } from 'services/kyc';
import { getValidationCode } from 'services/security.js';
import { pullMethods, pullPhoneStatus, rebindPhone } from 'services/ucenter/rebindPhone';
import { getConfig, pullFailCount, pullKycInfo, pullQuestions } from 'services/ucenter/security';

const evt = evtEmitter.getEvt();

export default extend(base, authentication, kycCode, {
  namespace: 'rebind_phone',
  state: {
    securityAllowTypes: null,
    currentStep: 0,
    loadingSms: false,
    sendChannel: 'SMS',
    retryAfterSeconds: 0,
  },
  effects: {
    *pullConfig(_, { call, put }) {
      try {
        const { data, success } = yield call(getConfig);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              configs: data?.configs || {},
            },
          });
        }
      } catch (e) {
        throw e;
      }
    },
    *pullStatus({ payload: { bizType, token } }, { call, put }) {
      const ret = yield call(pullPhoneStatus, { token });
      if (ret.success) {
        const { status } = ret.data || {};
        // status: 0-人工审核 1-人工审核通过 2-人工审核不通过 10-系统自动审核通过, 11-申请失败
        if (status === 0) {
          // 如果正在申请中，直接跳到最后一步，完成
          yield put({
            type: 'update',
            payload: {
              status,
              currentStep: 4,
            },
          });
        } else {
          yield put({
            type: 'getSecurityAllowTypes',
            payload: {
              bizType,
              token,
            },
          });
        }
      }
    },
    // 获取改用户是否绑定谷歌
    *pullMethods({ payload: { token } }, { call, put }) {
      try {
        const { data, success } = yield call(pullMethods, { token });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              securityMethods: data,
            },
          });
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    // 获取校验失败次数
    *pullFailCount({ payload, callBack }, { call }) {
      try {
        const { data, success } = yield call(pullFailCount, payload);
        if (success && callBack) {
          callBack(data);
        }
      } catch (e) {
        throw e;
      }
    },
    *pullQuestions({ payload }, { call, put }) {
      try {
        const { items, success } = yield call(pullQuestions, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              questions: items,
            },
          });
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    *getValidationCode({ payload, callBack }, { call, put }) {
      const { sendChannel, ...others } = payload;
      yield put({ type: 'update', payload: { loadingSms: true, retryAfterSeconds: 0 } });
      try {
        const { success, data, msg } = yield call(getValidationCode, { sendChannel, ...others });
        if (success) {
          const { retryAfterSeconds } = data;
          if (sendChannel && sendChannel.toLowerCase() !== 'voice') {
            evt.emit('__TIMER_BTN_COUNT_START__', {
              send: true,
              id: '_REBIND_PHONE_',
              delay: retryAfterSeconds,
            });
          }
          yield put({ type: 'update', payload: { retryAfterSeconds, sendChannel } });
          if (msg && callBack) {
            callBack(msg);
          }
        }
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        yield put({ type: 'update', payload: { loadingSms: false } });
      }
    },
    *getSecurityAllowTypes({ payload }, { put }) {
      const allowTypes = yield yield put({
        type: 'security_new/get_verify_type',
        payload,
      });
      if (allowTypes != null) {
        yield put({
          type: 'update',
          payload: {
            securityAllowTypes: allowTypes || [],
          },
        });
      }
    },
    *submitNewPhone({ payload }, { call, select, put }) {
      const isInApp = JsBridge.isApp();
      const { fields, currentStep, sendChannel, faceCheckResult } = yield select(
        (state) => state.rebind_phone,
      );
      const postData = {};
      Object.keys(fields).forEach((key) => {
        // 后端返回一个原图id 一个缩略图id
        postData[key] = fields[key].fileId.original;
        postData[`${key}Mini`] = fields[key].fileId.mini;
      });
      postData.identityFlowId = faceCheckResult?.flowId;
      if (faceCheckResult?.livenessPhotoId) {
        postData.livenessPhotoId = faceCheckResult?.livenessPhotoId;
      }
      postData.channel = isInApp ? (isIOS() ? 'ios' : 'android') : 'web';
      const { success, data } = yield call(rebindPhone, {
        ...payload,
        ...postData,
        validationType: sendChannel,
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            currentStep: data.status === 11 ? 4 : currentStep + 1,
            status: data.status,
          },
        });
      }
    },
    // 获取用户KYC认证信息
    *pullKycInfo({ payload }, { call, put }) {
      try {
        const { data, success } = yield call(pullKycInfo, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              isKYC2: data?.verifyStatus === 'VERIFY_PASSED',
            },
          });
        }
      } catch (e) {
        throw e;
      }
    },
    // 人脸识别认证
    *checkFacePic({ payload, callBack }, { select, call, put }) {
      try {
        const { fields, isKYC2 } = yield select((state) => state.rebind_phone);
        // 初级认证情况下，正面照和人脸识别照比对,需要传正面照id
        if (!isKYC2) {
          payload.frontPhotoId = fields?.frontPic?.fileId?.original;
        }
        const { data, success } = yield call(isKYC2 ? kycCheckFace : kycCheckPic, payload);
        if (success && callBack) {
          yield put({
            type: 'update',
            payload: {
              faceCheckResult: data,
            },
          });
          callBack(data);
        }
      } catch (e) {
        callBack(e);
      }
    },
  },
});
