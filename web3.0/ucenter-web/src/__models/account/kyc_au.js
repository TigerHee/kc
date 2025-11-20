/**
 * Owner: vijay.zhou@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { getKycResultV2, postKycCancelV2, postKycCreate } from 'services/kyc';
import {
  AU_KYB_LEVEL_ENUM,
  KYC_CERT_ENUM,
  KYC_ROLE_ENUM,
  KYC_STATUS_ENUM,
} from 'src/constants/kyc/enums';
import { getTempValue, kybGetCountries, postTempValue } from 'src/services/kyc';

const INIT_KYC_INFO = {
  status: KYC_STATUS_ENUM.UNVERIFIED,
  failReasonList: [],
  extraInfo: null,
};

const kybCountryTempKey = 'SELECT_KYB_REGION';

export default extend(base, {
  namespace: 'kyc_au',
  state: {
    kyc1: { ...INIT_KYC_INFO }, // 基础 kyc 认证
    kyc2: { ...INIT_KYC_INFO }, // 零售用户认证
    kyc3: { ...INIT_KYC_INFO }, // 批发用户认证
    role: null, // 选择认证角色（零售 or 批发）
    regionCode: null, // 证件发行国家
    identityType: null, // 证件类型
    needToChangeSite: false, // 是否需要切换站点
    kyb1: { ...INIT_KYC_INFO },
    kyb2: { ...INIT_KYC_INFO },
    kyb3: { ...INIT_KYC_INFO },
    kybCountryList: [],
  },
  effects: {
    /** 获取基础 kyc 认证状态 */
    *getKyc1(_, { call, put, select }) {
      const { labelList = [] } = yield select((state) => state.kyc?.kycInfo ?? {});
      const { verifyStatus, regionType, dismissCountryVerifyStatus } = yield select(
        (state) => state.kyc?.kycInfo ?? {},
      );
      if (
        verifyStatus === 5 ||
        (verifyStatus === 1 && regionType !== 3 && dismissCountryVerifyStatus === 1)
      ) {
        // 假失败 = 认证中
        yield put({
          type: 'update',
          payload: {
            kyc1: { status: KYC_STATUS_ENUM.VERIFYING, failReasonList: [] },
          },
        });
        return;
      }
      if (
        labelList?.includes(KYC_CERT_ENUM.AU_ADVANCE_RETAIL) ||
        labelList?.includes(KYC_CERT_ENUM.AU_WHOLESALE)
      ) {
        // 有高级认证（批发 or 零售）的标签代表基础 kyc 已经过了，不需要请求，直接设置为通过
        yield put({
          type: 'update',
          payload: {
            kyc1: { ...INIT_KYC_INFO, status: KYC_STATUS_ENUM.VERIFIED },
          },
        });
      } else {
        try {
          const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.AU_BASIC_KYC });
          if (!res.success) throw res;
          const { status = KYC_STATUS_ENUM.UNVERIFIED, failReasonList = [] } = res.data ?? {};
          yield put({
            type: 'update',
            payload: {
              kyc1: { status, failReasonList },
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    /** 获取零售用户认证状态 */
    *getKyc2(_, { call, put, select }) {
      const { labelList = [] } = yield select((state) => state.kyc?.kycInfo ?? {});
      if (labelList?.includes(KYC_CERT_ENUM.AU_ADVANCE_RETAIL)) {
        // 有对应的标签代表已经完成了认证，不需要请求，直接设置为通过
        yield put({
          type: 'update',
          payload: {
            kyc2: { ...INIT_KYC_INFO, status: KYC_STATUS_ENUM.VERIFIED },
          },
        });
      } else {
        try {
          const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.AU_ADVANCE_RETAIL });
          if (!res.success) throw res;
          const {
            status = KYC_STATUS_ENUM.UNVERIFIED,
            failReasonList = [],
            extraInfo,
          } = res.data ?? {};
          yield put({
            type: 'update',
            payload: {
              kyc2: { status, failReasonList, extraInfo },
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    /** 获取批发用户认证状态 */
    *getKyc3(_, { call, put, select }) {
      const { labelList = [] } = yield select((state) => state.kyc?.kycInfo ?? {});
      if (labelList?.includes(KYC_CERT_ENUM.AU_WHOLESALE)) {
        // 有对应的标签代表已经完成了认证，不需要请求，直接设置为通过
        yield put({
          type: 'update',
          payload: {
            kyc3: {
              ...INIT_KYC_INFO,
              status: KYC_STATUS_ENUM.VERIFIED,
            },
          },
        });
      } else {
        try {
          const res = yield call(getKycResultV2, { type: KYC_CERT_ENUM.AU_WHOLESALE });
          if (!res.success) throw res;
          const { status = KYC_STATUS_ENUM.UNVERIFIED, failReasonList = [] } = res.data ?? {};
          yield put({
            type: 'update',
            payload: {
              kyc3: { status, failReasonList },
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    /** 获取缓存的角色选择 */
    *getRole(_, { call, put }) {
      try {
        const res = yield call(getTempValue, { tempKey: 'AU_SELECT_WHOLESALE_RETAIL' });
        if (!res.success) throw res;
        yield put({
          type: 'update',
          payload: {
            role: res.data,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    /** 缓存角色选择 */
    *setRole({ payload: { role } }, { call, put }) {
      yield put({
        type: 'update',
        payload: { role },
      });
      try {
        yield call(postTempValue, {
          tempKey: 'AU_SELECT_WHOLESALE_RETAIL',
          tempValue: role,
        });
      } catch (error) {
        console.log(error);
      }
      switch (role) {
        case KYC_ROLE_ENUM.RETAIL:
          yield put({ type: 'getKyc2' });
          break;
        case KYC_ROLE_ENUM.WHOLESALE:
          yield put({ type: 'getKyc3' });
          break;
        default:
      }
    },
    /** 发起认证 */
    *start({ payload }, { call }) {
      const res = yield call(postKycCreate, payload);
      if (!res.success) throw res;
      return res.data;
    },
    /** 从新认证，会重置 kyc 状态 */
    *restart(_, { call, put }) {
      const res = yield call(postKycCancelV2, { type: KYC_CERT_ENUM.AU_BASIC_KYC });
      if (!res.success) throw res;
      yield put({ type: 'kyc/pullKycInfo' });
    },
    *getKyb1({ payload }, { call, put }) {
      try {
        const res = yield call(getKycResultV2, payload);
        if (!res.success) throw res;
        const { status = KYC_STATUS_ENUM.UNVERIFIED, failReasonList = [] } = res.data ?? {};
        yield put({
          type: 'update',
          payload: {
            kyb1: { status, failReasonList },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getKyb2(_, { call, put }) {
      try {
        const res = yield call(getKycResultV2, { type: AU_KYB_LEVEL_ENUM.KYB2 });
        if (!res.success) throw res;
        const { status = KYC_STATUS_ENUM.UNVERIFIED, failReasonList = [] } = res.data ?? {};
        yield put({
          type: 'update',
          payload: {
            kyb2: { status, failReasonList },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getKyb3(_, { call, put }) {
      try {
        const res = yield call(getKycResultV2, { type: AU_KYB_LEVEL_ENUM.KYB3 });
        if (!res.success) throw res;
        const { status = KYC_STATUS_ENUM.UNVERIFIED, failReasonList = [] } = res.data ?? {};
        yield put({
          type: 'update',
          payload: {
            kyb3: { status, failReasonList },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getKybCountryList({}, { call, put }) {
      try {
        const { data } = yield call(kybGetCountries, { kycType: 2 });
        yield put({ type: 'update', payload: { kybCountryList: data || [] } });
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
});
