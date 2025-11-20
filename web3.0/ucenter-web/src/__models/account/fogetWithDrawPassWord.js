/**
 * Owner: lori@kupotech.com
 */
import authentication from 'common/models/authentication';
import base from 'common/models/base';
import kycCode from 'common/models/kycCode';
import extend from 'dva-model-extend';
import { getIsInApp, isIOS } from 'helper';
import { kycCheckFace, kycCheckPic } from 'services/kyc';
import {
  applyResetWithDrawPassword,
  getConfig,
  getResetWithDrawPasswordInfo,
} from 'services/security';

export default extend(base, authentication, kycCode, {
  namespace: 'forget_withdraw_password',
  state: {
    status: null,
  },
  effects: {
    // 获取人脸识别配置开关
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
    *submit(_, { put, call, select }) {
      const { fields, faceCheckResult } = yield select((state) => state.forget_withdraw_password);
      const isInApp = getIsInApp() || false;
      const postData = {};
      Object.keys(fields).forEach((key) => {
        // 后端返回一个原图id 一个缩略图id
        postData[key] = fields[key].fileId.original;
        postData[`${key}Mini`] = fields[key].fileId.mini;
      });
      postData.channel = isInApp ? (isIOS() ? 'ios' : 'android') : 'web';
      postData.identityFlowId = faceCheckResult?.flowId;
      if (faceCheckResult?.livenessPhotoId) {
        postData.livenessPhotoId = faceCheckResult?.livenessPhotoId;
      }
      try {
        const res = yield call(applyResetWithDrawPassword, postData);
        yield put({
          type: 'update',
          payload: {
            status: res.data.status,
          },
        });
        return res;
      } catch (e) {
        return e;
      }
    },
    // 查询重置交易密码状态
    *resetInfo(_, { put, call }) {
      const { data } = yield call(getResetWithDrawPasswordInfo);
      yield put({
        type: 'update',
        payload: {
          // status: 0-人工审核 1-人工审核通过 2-人工审核不通过 10-系统自动审核通过, 11-申请失败
          status: (data || {}).status,
        },
      });
    },
    // 人脸识别认证
    *checkFacePic({ payload, callBack }, { select, call, put }) {
      try {
        const { fields } = yield select((state) => state.forget_withdraw_password);
        const { kycInfo } = yield select((state) => state.kyc);
        const isKYC2 = kycInfo?.verifyStatus === 1;
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
        throw e;
      }
    },
  },
});
