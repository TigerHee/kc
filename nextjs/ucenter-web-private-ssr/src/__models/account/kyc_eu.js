/**
 * Owner: vijay.zhou@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { getKycResultV2, postKycCancelV2, postKycCreate } from 'services/kyc';
import {
  KYC_CERT_ENUM,
  KYC_STATUS_ENUM,
  KYC_CERT_PASSED_ENUM,
} from 'src/constants/kyc/enums';

const INIT_KYC_INFO = {
  status: KYC_STATUS_ENUM.UNVERIFIED,
  failReasonList: [],
  extraInfo: null,
};

export default extend(base, {
  namespace: 'kyc_eu',
  state: {
    basicResult: { ...INIT_KYC_INFO }, // 基础 kyc 认证
    basicCraResult: { ...INIT_KYC_INFO }, // 基础 kyc 认证 CRA 补充
    advanceResult: { ...INIT_KYC_INFO }, // 高级 kyc 认证
    proUserResult: { ...INIT_KYC_INFO }, // 专业投资者 kyc 认证
  },
  effects: {
    *pullBasicResult(_, { select, call, put }) {
      const labelList = yield select((state) => state.kyc?.kycInfo?.labelList ?? []);
      const isVerified = KYC_CERT_PASSED_ENUM[KYC_CERT_ENUM.EU_BASIC_KYC]?.some(label => labelList?.includes(label));
      if (isVerified) {
        yield put({
          type: 'update',
          payload: { basicResult: { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null } },
        });
        return;
      }
      const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.EU_BASIC_KYC });
      if (res.success) {
        const { status = null, failReasonList = [], extraInfo = null } = res.data ?? {};
        yield put({
          type: 'update',
          payload: { basicResult: { status, failReasonList, extraInfo} },
        });
      }
    },
    *pullBasicStandardAlias({ payload }, { call }) {
      const { extraInfo } = payload;
      const { data } = yield call(postKycCreate, {
        type: KYC_CERT_ENUM.EU_BASIC_KYC,
        source: 'web',
        complianceExtraInfo: extraInfo ? JSON.stringify(extraInfo) : undefined,
      });
      return data.standardAlias;
    },
    *cancelBasicCert(_, { call }) {
      yield call(postKycCancelV2, { type: KYC_CERT_ENUM.EU_BASIC_KYC });
    },
    *pullBasicCraResult(_, { select, call, put }) {
      const labelList = yield select((state) => state.kyc?.kycInfo?.labelList ?? []);
      const isVerified = KYC_CERT_PASSED_ENUM[KYC_CERT_ENUM.EU_BASIC_KYC_CRA]?.some(label => labelList?.includes(label));
      if (isVerified) {
        yield put({
          type: 'update',
          payload: { basicCraResult: { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null } },
        });
        return;
      }
      const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.EU_BASIC_KYC_CRA });
      if (res.success) {
        const { status = null, failReasonList = [], extraInfo = null } = res.data ?? {};
        yield put({
          type: 'update',
          payload: { basicCraResult: { status, failReasonList, extraInfo} },
        });
      }
    },
    *pullBasicCraStandardAlias(_, { call }) {
      const { data } = yield call(postKycCreate, {
        type: KYC_CERT_ENUM.EU_BASIC_KYC_CRA,
        source: 'web',
      });
      return data.standardAlias;
    },
    *cancelBasicCraCert(_, { call }) {
      yield call(postKycCancelV2, { type: KYC_CERT_ENUM.EU_BASIC_KYC_CRA });
    },
    *pullAdvanceResult(_, { select, call, put }) {
      const labelList = yield select((state) => state.kyc?.kycInfo?.labelList ?? []);
      const isVerified = KYC_CERT_PASSED_ENUM[KYC_CERT_ENUM.EU_KYC_ADVANCE]?.some(label => labelList?.includes(label));
      if (isVerified) {
        yield put({
          type: 'update',
          payload: { advanceResult: { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null } },
        });
        return;
      }
      const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.EU_KYC_ADVANCE });
      if (res.success) {
        const { status = null, failReasonList = [], extraInfo = null } = res.data ?? {};
        yield put({
          type: 'update',
          payload: { advanceResult: { status, failReasonList, extraInfo} },
        });
      }
    },
    *pullAdvanceStandardAlias(_, { call }) {
      const { data } = yield call(postKycCreate, {
        type: KYC_CERT_ENUM.EU_KYC_ADVANCE,
        source: 'web',
      });
      return data.standardAlias;
    },
    *cancelAdvanceCert(_, { call }) {
      yield call(postKycCancelV2, { type: KYC_CERT_ENUM.EU_KYC_ADVANCE });
    },
    *pullProUserResult(_, { select, call, put }) {
      const labelList = yield select((state) => state.kyc?.kycInfo?.labelList ?? []);
      const isVerified = KYC_CERT_PASSED_ENUM[KYC_CERT_ENUM.EU_KYC_PRO_USER]?.some(label => labelList?.includes(label));
      if (isVerified) {
        yield put({
          type: 'update',
          payload: { proUserResult: { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null } },
        });
        return;
      }
      const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.EU_KYC_PRO_USER });
      if (res.success) {
        const { status = null, failReasonList = [], extraInfo = null } = res.data ?? {};
        yield put({
          type: 'update',
          payload: { proUserResult: { status, failReasonList, extraInfo} },
        });
      }
    }
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
