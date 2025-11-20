/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import { DEFAULT_FAIL_REASON_CODE, FAIL_REASON } from 'config/base';
import { tenantConfig } from 'config/tenant';
import extend from 'dva-model-extend';
import { VERIFY_ITEM } from 'routes/AccountPage/Kyc/config';
import * as serv from 'services/kyc';
import * as transferServ from 'services/user_transfer';
import { _t } from 'tools/i18n';

const loop = () => '';

// 方法需要添加异常处理避免页面白屏
export const fillFailReason = (obj, lang) => {
  try {
    if (lang !== 'zh_CN' && lang !== 'zh_HK') {
      lang = 'en_US';
    }
    const linkFlag = lang === 'en_US' ? ':' : '：';
    obj = JSON.parse(obj || '{}');
    const data = {};
    if (Object.keys(obj).length > 0) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const reasonItem = FAIL_REASON[obj[key].code] || FAIL_REASON[DEFAULT_FAIL_REASON_CODE];
          const fieldTitle = (VERIFY_ITEM[key] || loop)();
          const prefix = fieldTitle ? `${fieldTitle}${linkFlag}` : '';
          const _key = reasonItem.key || '';
          const msg = _key
            ? _t(_key)
            : lang === 'zh_CN'
            ? reasonItem.zh_CN
            : reasonItem.en_US || obj[key].val;

          obj[key][lang === 'en_US' ? 'valEn' : 'val'];
          data[key] = msg ? `${prefix}${msg}` : '';
          if (obj[key].code === 'otherError') {
            data[key] = `${prefix}${obj[key].val}`;
          }
        }
      }
    }
    return data;
  } catch (error) {
    console.log('error', error);
    return {};
  }
};

const KYC_OF_RESIDENCE_UPDATE = 'ALL_RESIDENCE_REGION_UPDATE';

export default extend(base, {
  namespace: 'kyc',
  state: {
    kycInfo: {},
    kybPrivileges: {},
    positiveImg: [], // 证件照正面，
    backImg: [], // 证件照背面
    photoWithIDImg: [], // 手持证件照片
    registrationAttachmentImg: [], // 公司注册证书和商业登记证
    handleRegistrationAttachmentImg: [], // 手持公司注册证书照
    directorAttachmentImg: [], // 所有董事名单
    incumbencyPhotoImg: [], // 在职证明
    frontPhotoImg: [], // 证件照正面
    backPhotoImg: [], // 证件照背面
    handlePhotoImg: [], // 手持证件照
    authorizeAttachmentImg: [], // 董事会决议或授权书
    performanceAttachmentImg: [], // 履约承诺协议
    shareholdersAttachmentImg: [], // 股东名单
    otherAttachmentImg: [], // 其他补充文件
    kycCode: '',
    kycRealName: null,
    countries: [],
    countriesKYB: [],
    companyDetail: {},
    failureReason: {},
    kyc2ChannelInfo: null, //kyc2渠道信息
    isCompleted: true, //advance扫脸是否完成
    isCurrentDevice: true, //是否在当前设备完成扫脸
    ekycFlowId: '',
    legoPhotos: {}, // lego 证件照片
    photoType: 'front',
    showCamera: false,
    legoCameraStep: '',
    legoType: 'camera',
    identityType: '',
    legoPhotoIds: {},
    privileges: {},
    kyc_id_photo_catch_type: 'shot',
    kybInfo: {},
    kycClearInfo: {}, //kyc打回信息
    rewardInfo: {}, // kyc3福利信息
    advanceFrom: '',
    advanceType: '',
    advanceEkycFlowId: '',
    countriesWithWhiteList: [],
    financeListKYC: [], // KYC准入认证列表
    financeListKYB: [], // KYB准入认证列表
    autoOpenKycModal: false, // 自动打开KYC认证
    isKYCModalOpen: false, // KYC认证弹窗是否显示
    isRestartOpen: false, // restart 弹窗是否显示
    residenceConfig: {
      // 居住地配置
      isDisplay: false, // 是否展示居住地更新功能
      isMigrateNow: false, // 是否需要做站点迁移
      residenceRegionCode: '', // 居住地编码
      residenceRegionName: '', // 居住地名称
      verifyStatus: -1, // kyc 状态
    },
    canTransferInfo: {},
    kycRedirect: true,
    ocr: {
      query: false, // 是否查询
      channel: null, // 渠道
      ekycflowId: null, // 流程 id
    },
  },
  effects: {
    *pullKycInfo({ payload = {}, callback }, { call, put, select }) {
      const { currentLang } = yield select((state) => state.app);
      let handler = serv.getKycResult;
      if (payload && payload.type === 1) {
        // 企业认证请求原有接口，个人认证请求新的kycInfo接口
        handler = serv.getKycInfo;
      }
      const { data, success } = yield call(handler, payload);
      if (success) {
        try {
          const res = yield call(serv.getKycClearInfo);

          if (res.success && res.data) {
            yield put({
              type: 'update',
              payload: {
                kycClearInfo: res?.data,
              },
            });
          }
        } catch (error) {}

        const info = {
          ...data,
          originFailureReason: data.failureReason,
          failureReason: fillFailReason(data.failureReason, currentLang),
        };
        const _payload = payload && payload.type === 1 ? { kybInfo: info } : { kycInfo: info };
        yield put({
          type: 'update',
          payload: _payload,
        });
        if (typeof callback === 'function') {
          callback();
        }
        return info;
      }
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          kycInfo: {},
          countries: [],
          kycCode: '',
          companyDetail: {},
          failureReason: {},
          positiveImg: [], // 证件照正面，
          backImg: [], // 证件照背面
          photoWithIDImg: [], // 手持证件照片
          registrationAttachmentImg: [], // 公司注册证书和商业登记证
          handleRegistrationAttachmentImg: [], // 手持公司注册证书照
          directorAttachmentImg: [], // 所有董事名单
          incumbencyPhotoImg: [], // 在职证明
          frontPhotoImg: [], // 证件照正面
          backPhotoImg: [], // 证件照背面
          handlePhotoImg: [], // 手持证件照
          authorizeAttachmentImg: [], // 董事会决议或授权书
          performanceAttachmentImg: [], // 履约承诺协议
          shareholdersAttachmentImg: [], // 股东名单
          otherAttachmentImg: [], // 其他补充文件
        },
      });
    },
    *kycSeniorSubmit({ payload }, { call }) {
      try {
        yield call(serv.kycSeniorSubmit, payload);
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *kycCompBasicSubmit({ payload }, { call, put }) {
      try {
        yield call(serv.kycCompBasicSubmit, payload);
        return { success: true };
      } catch (e) {
        if (e.code === '710017') {
          // 国家地区被禁用
          yield put({ type: 'getKybCountries', payload: {} });
        }
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *submitCompanyContact({ payload }, { call }) {
      try {
        yield call(serv.kycCompContactSubmit, payload);
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *getKycCode({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.getKycCode, payload);
        yield put({ type: 'update', payload: { kycCode: data } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *getUserKycName({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.getKycName, payload);
        yield put({ type: 'update', payload: { kycRealName: data } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *confirmCheck({ payload }, { call }) {
      try {
        yield call(serv.confirm, payload);
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *kycGetCountries({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.kycGetCountries, payload);
        yield put({ type: 'update', payload: { countries: data } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *getKybCountries({}, { call, put }) {
      try {
        const { data } = yield call(serv.kybGetCountries, { kycType: 2 });
        yield put({ type: 'update', payload: { countriesKYB: data || [] } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *kycGetCountries2({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.kycGetCountries2, payload);
        yield put({ type: 'update', payload: { countriesWithWhiteList: data } });
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *KycCompanyDetail({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.KycCompanyDetail, payload);
        const failureReason = data.verifyFailReason ? JSON.parse(data.verifyFailReason) : {};

        yield put({ type: 'update', payload: { companyDetail: data, failureReason } });

        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    // 机构认证的时候多个图片上传提交
    *submitKycCompMoreImg({ payload }, { call }) {
      try {
        yield call(serv.kycCompMoreImg, payload);
        return { success: true };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    //获取高级认证渠道
    *getKyc2Channel({ payload, callback }, { call, put }) {
      try {
        const { data } = yield call(serv.getKyc2Channel, payload);
        yield put({ type: 'update', payload: { kyc2ChannelInfo: data } });
        return data;
      } catch (e) {
        return e;
      }
    },
    *kycUpload({ payload }, { call }) {
      try {
        const { data } = yield call(serv.kycUpload, payload);
        return { success: true, data };
      } catch (e) {
        const msg = e.msg ? e.msg : _t('kyc.verification.info.upload.failed');
        return { success: false, msg };
      }
    },
    *checkKycRisk({ payload, callback }, { call, put }) {
      try {
        const { data, success, code } = yield call(serv.checkKycRisk, payload);
        return { data, success, code };
      } catch (e) {
        const msg = e?.msg || (typeof e === 'string' ? e : 'error');
        return { success: false, data: false, code: e.code, msg };
      }
    },
    *submitKycOcr({ payload, callback }, { call, put }) {
      try {
        const { data, success, code } = yield call(serv.submitKycOcr, payload);
        return { data: data?.submitSuccess, success, code };
      } catch (e) {
        const msg = e?.msg || (typeof e === 'string' ? e : 'error');
        return { success: false, data: false, code: e.code, msg };
      }
    },
    *submitIdImgs({ payload, callback }, { call, put }) {
      try {
        const { data, success, code } = yield call(serv.submitIdImgs, payload);
        return { data, success, code };
      } catch (e) {
        const msg = e?.msg || (typeof e === 'string' ? e : 'error');
        return { success: false, data: false, code: e.code, msg };
      }
    },
    *submitSelfie({ payload, callback }, { call, put }) {
      try {
        const { data, success, code } = yield call(serv.submitSelfie, payload);
        return { data: data, success, code };
      } catch (e) {
        const msg = e?.msg || (typeof e === 'string' ? e : 'error');
        return { success: false, data: false, code: e.code, msg };
      }
    },
    *uploadImg({ payload }, { call }) {
      try {
        const { data } = yield call(serv.uploadImg, payload);
        return { success: true, data };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *checkImg({ payload }, { call }) {
      try {
        const { data } = yield call(serv.checkImg, payload);
        return { success: true, data };
      } catch (e) {
        const msg = e.msg ? e.msg : e;
        return { success: false, msg };
      }
    },
    *submitNgKyc1({ payload }, { call }) {
      try {
        const { data, success } = yield call(serv.submitNgKyc1, payload);
        return { data, success, msg: '' };
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
    *pullKybPrivileges(a, { call, put }) {
      const { data, success } = yield call(serv.getKybPrivileges);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            kybPrivileges: data,
          },
        });
      }
    },
    *getPrivileges({ payload, callback }, { call, put }) {
      try {
        const { data } = yield call(serv.getPrivileges, payload);
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
    *getKYC3RewardInfo({ payload }, { call, put }) {
      if (tenantConfig.kyc.showKycRewardInfo) {
        try {
          const { data } = yield call(serv.getKYC3RewardInfo);
          yield put({ type: 'update', payload: { rewardInfo: data } });
        } catch (e) {}
      }
    },
    *getUserTransferInfo({}, { call, put }) {
      try {
        const { data } = yield call(transferServ.getUserTransferNotice, { entrySource: 'KYC' });
        yield put({ type: 'update', payload: { canTransferInfo: data || {} } });
      } catch (e) {
        console.error(e);
      }
    },
    *updateClearInfo({ payload }, { call }) {
      yield call(serv.clearInfo);
    },
    *pullFinanceList({ payload: { kycType } }, { call, put }) {
      try {
        const { success, data } = yield call(serv.getFinanceList, { kycType });
        if (success) {
          if (kycType === 'KYC') {
            yield put({ type: 'update', payload: { financeListKYC: data?.fianceList || [] } });
          }
          if (kycType === 'KYB') {
            yield put({ type: 'update', payload: { financeListKYB: data?.fianceList || [] } });
          }
        }
      } catch (error) {}
    },
    /** 保存国家&证件 */
    *postCountryAndIdentity({ payload }, { call, put }) {
      const { regionCode, identityType, userState } = payload;
      // 新建 kyc 记录
      const res = yield call(serv.postCountryID, {
        regionCode,
        identityType,
        userState,
        source: 'web',
      });
      if (!res.success) throw res;
      yield put({ type: 'update', payload: { autoOpenKycModal: true } });
    },
    /** 重新认证，会重置 kyc 状态 */
    *restart(_, { call, put }) {
      const res = yield call(serv.postKycCancel);
      if (!res.success) throw res;
      yield put({ type: 'pullKycInfo' });
    },
    /** 拉取居住地配置 */
    *pullResidenceConfig(_, { put, call }) {
      const { data, success, msg } = yield call(serv.getResidenceInfo);
      yield put({
        type: 'update',
        payload: { residenceConfig: data },
      });
      if (!success) throw new Error(msg);
      return data;
    },
    /** 发起居住地 kyc 审核 */
    *postKycResidence({ payload }, { call }) {
      const { regionCode, source } = payload;
      const { data, success, msg } = yield call(serv.postKycCreate, {
        type: KYC_OF_RESIDENCE_UPDATE,
        source,
        complianceExtraInfo: JSON.stringify({
          residenceRegion: regionCode,
        }),
      });
      if (!success) throw new Error(msg);
      return data;
    },
    /** 重置居住地 kyc 审核 */
    *restartKycResidence({}, { call }) {
      yield call(serv.postKycCancelV2, {
        type: KYC_OF_RESIDENCE_UPDATE,
      });
    },
    /** 拉取居住地 kyc 审核结果 */
    *pullKycResidence(_, { call }) {
      const { data, success, msg } = yield call(serv.getKycResultV2, {
        type: KYC_OF_RESIDENCE_UPDATE,
      });
      if (!success) throw new Error(msg);
      return data;
    },
    /** 请求 kyc 和 kyb 状态 */
    *pullKycKybInfo({ callback }, { put }) {
      const kycInfo = yield put.resolve({ type: 'kyc/pullKycInfo' });
      if (kycInfo.type === 1) {
        const kybInfo = yield put.resolve({ type: 'kyc/pullKycInfo', payload: { type: 1 } });
        callback?.({ kycInfo: null, kybInfo });
        return { kycInfo: null, kybInfo };
      } else {
        callback?.({ kycInfo, kybInfo: null });
        return { kycInfo, kybInfo: null };
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
