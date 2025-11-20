/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import authentication from 'common/models/authentication';
import base from 'common/models/base';
import kycCode from 'common/models/kycCode';
import extend from 'dva-model-extend';
import { isIOS } from 'helper';
import { kycCheckFace, kycCheckPic } from 'services/kyc';
import { pullG2faStatus, resetG2fa, resetG2fa2 } from 'services/ucenter/resetG2fa';
import { getConfig, pullFailCount, pullKycInfo, pullQuestions } from 'services/ucenter/security.js';

export default extend(base, authentication, kycCode, {
  namespace: 'reset_g2fa',
  state: {
    securityAllowTypes: null,
    currentStep: 0,
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
      const ret = yield call(pullG2faStatus, { token });
      if (ret.success) {
        const { status } = ret.data || {};
        // status: 0-人工审核 1-人工审核通过 2-人工审核不通过 10-系统自动审核通过, 11-申请失败: 系统驳回
        if (status === 0) {
          yield put({
            type: 'update',
            payload: {
              status,
              currentStep: 4, // 最多4步， 直接去最后一步
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
        throw e;
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
        const { fields, isKYC2 } = yield select((state) => state.reset_g2fa);
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
    // 通过提交身份照信息重置谷歌
    *submitAuthentication({ payload: { token = '' } }, { select, call, put }) {
      const isInApp = JsBridge.isApp();
      const { fields, currentStep, faceCheckResult } = yield select((state) => state.reset_g2fa);
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
      try {
        const { success, data } = yield call(resetG2fa, { token, ...postData });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              currentStep: currentStep + 1,
              status: data.status,
            },
          });
        }
      } catch (e) {
        yield put({ type: 'app/setToast', payload: { message: e.msg, type: 'error' } });
        return e;
      }
    },
    // 通过手机重置谷歌验证
    *resetG2fa2({ payload }, { select, call, put }) {
      const { currentStep } = yield select((state) => state.reset_g2fa);
      try {
        const { data } = yield call(resetG2fa2, payload);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              currentStep: currentStep + 1,
              status: 10,
            },
          });
        }
      } catch (e) {
        throw e;
      }
    },
  },
});
