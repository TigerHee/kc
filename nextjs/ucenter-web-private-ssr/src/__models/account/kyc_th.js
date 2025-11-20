/**
 * Owner: vijay.zhou@kupotech.com
 * 泰国站kyc信息
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import * as servTh from 'services/kyc_th';

const initStates = {
  kycInfo: {},
  privileges: {}, // 权益数据
  verifyResult: {}, // kyc/kyb 认证结果，{verifyStatus, failReason: []}
  advanceStatusData: {},
};

export default extend(base, {
  namespace: 'kyc_th',
  state: initStates,
  effects: {
    // 初始化数据
    *resetValues({}, { put }) {
      yield put({ type: 'update', payload: initStates });
    },
    // 获取kyc的各种状态
    *pullKycInfo({ payload = {} }, { call, put }) {
      try {
        const { data, success } = yield call(servTh.getKycVerifyStatus, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              kycInfo: data,
            },
          });
        }
      } catch (error) {
        console.error('pullKycInfo error', error);
      }
    },
    // 获取advance状态
    *pullAdvanceList(_, { call, put }) {
      try {
        const { success, data } = yield call(servTh.getAdvanceStatus);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              advanceStatusData: data || {},
            },
          });
        }
      } catch (error) {
        console.log('error...', error);
      }
    },
    // 获取认证结果和失败原因
    *pullVerifyResult({ payload }, { call, put }) {
      try {
        const type = payload.type;
        const { data = {}, success } = yield call(
          type === 'kyc' ? servTh.getKYCVerifyResult : servTh.getKYBVerifyResult,
          payload,
        );
        if (success) {
          yield put({
            type: 'update',
            payload: {
              verifyResult: data,
            },
          });
        }
      } catch (error) {
        console.error('pullVerifyResult error', error);
      }
    },
    // 获取权益列表
    *getPrivileges({ payload }, { call, put }) {
      try {
        const { data } = yield call(servTh.getPrivileges, payload);
        yield put({ type: 'update', payload: { privileges: data } });
        return data;
      } catch (error) {
        const msg = error?.msg
          ? typeof error?.msg === 'string'
            ? error?.msg
            : 'error'
          : typeof error === 'string'
            ? error
            : 'error';

        return { success: false, msg, data: {} };
      }
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
