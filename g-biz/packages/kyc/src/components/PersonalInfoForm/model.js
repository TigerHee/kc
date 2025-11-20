/**
 * Owner: iron@kupotech.com
 */
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import * as services from './service';
import { PREFIX, ERROR_CODE } from '../../common/constants';

export const namespace = `${PREFIX}_personalInfoForm`;

export const initState = {
  checkError: '', // 身份验证信息
  kycInfo: {},
  failureReason: {},
  countries: [],
  specialTypeList: [], // 特殊国家的证件类型
  recommendIdType: '',
  kycClearInfo: {}, // kyc打回信息
};

export default {
  namespace,

  state: {
    ...initState,
  },

  effects: {
    *pullKycInfo({ payload }, { call, put }) {
      try {
        const { data } = yield call(services.getKycInfo, payload);

        const failureReason = data.failureReason ? JSON.parse(data.failureReason) : {};
        if (failureReason.identityVerification) {
          failureReason.idNumber = { ...failureReason.identityVerification };
          delete failureReason.identityVerification;
        }

        yield put({ type: 'update', payload: { kycInfo: data, failureReason } });

        const clearRes = yield call(services.getKycClearInfo);

        if (clearRes.success && clearRes.data) {
          yield put({
            type: 'update',
            payload: {
              kycClearInfo: clearRes?.data,
            },
          });
        }

        return { success: true };
      } catch (e) {
        return { success: false, msg: e.msg };
      }
    },
    *updateClearInfo(action, { call }) {
      yield call(services.clearInfo);
    },
    *getIdentityTypes({ payload }, { call, put }) {
      try {
        const res = yield call(services.getIdentityTypes, payload);
        if (res.success) {
          const updateData = {
            specialTypeList:
              res?.data?.configs?.find((i) => i.region === payload.region)?.entities || [],
          };
          if (payload && payload?.region) {
            updateData.recommendIdType = res?.data?.recommendIdType;
          }
          yield put({
            type: 'update',
            payload: updateData,
          });
        }
        return { success: true };
      } catch (error) {
        return { success: false, msg: error.msg };
      }
    },
    *primarySubmit({ payload }, { call, put }) {
      try {
        yield call(services.primarySubmit, payload);
        return { success: true };
      } catch (e) {
        if (e.code === '710005') {
          return { success: false, identity2VerifyFailed: true }; // 身份2次验证失败
        }
        if (e.code === '710017') {
          // 国家地区被禁用
          yield put({ type: 'kycGetCountries', payload: {} });
        }
        if (ERROR_CODE.includes(e.code)) {
          yield put({ type: 'update', payload: { checkError: e.msg } });
          return { success: false };
        }
        return { success: false, msg: e.msg };
      }
    },
    *primaryUpdate({ payload }, { call, put }) {
      try {
        const { clearStatus, ...params } = payload;
        const serviceFn =
          clearStatus === 1 ? services.primaryUpdateForClear : services.primaryUpdate;

        yield call(serviceFn, params);
        return { success: true };
      } catch (e) {
        if (e.code === '710005') {
          return { success: false, identity2VerifyFailed: true }; // 身份2次验证失败
        }
        if (e.code === '710017') {
          // 国家地区被禁用
          yield put({ type: 'kycGetCountries', payload: {} });
        }
        if (ERROR_CODE.includes(e.code)) {
          yield put({ type: 'update', payload: { checkError: e.msg } });
          return { success: false };
        }
        return { success: false, msg: e.msg };
      }
    },
    *kycGetCountries({ payload }, { call, put }) {
      try {
        const { data } = yield call(services.kycGetCountries, payload);
        let list = data || [];
        if (tenantConfig.kyc1.fixedCountry) {
          list = list.filter((i) => i.code === tenantConfig.kyc1.fixedCountry);
        }
        yield put({ type: 'update', payload: { countries: list } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
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
};
