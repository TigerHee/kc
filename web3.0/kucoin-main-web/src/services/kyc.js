/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, post, postJson } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';
import encUtf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import Base64 from 'crypto-js/enc-base64';

const pull = pullWrapper(originPull);

const key = encUtf8.parse('ry35490gf27et52d');
const dev = process.env.NODE_ENV === 'development';
// 加密方法
const encrypt = (data) => {
  data = JSON.stringify(data);
  const srcs = encUtf8.parse(data);
  const encrypted = AES.encrypt(srcs, key, {
    mode: ECB,
    padding: Pkcs7,
  });
  return encrypted.ciphertext.toString(Base64);
};

const prefix = '/ucenter';
const eKycPrefix = '/kyc';

const TYPE_MAP = {
  0: 'personal',
  1: 'company',
};

// 个人 - 基本信息提交
export const submitBasic = (data) => {
  return post(`${prefix}/kyc/personal/normal/create-or-update`, {
    info: encrypt(data),
  });
};

// 个人 - 其他信息提交
export const submitOtherInfo = (data) => {
  return post(`${prefix}/kyc/personal/funds/create-or-update`, {
    info: encrypt(data),
  });
};

// 确认提交审核
export const confirm = (params) => {
  return pull('/kyc/kyc/submit', params);
};

// KYC信息
export const getDetail = (params) => {
  const { kycType } = params;
  return pull(`${prefix}/kyc/${TYPE_MAP[kycType]}/detail`, params);
};

// KYC审核状态
export const checkStatus = (params) => {
  return pull(`${prefix}/kyc/check/result`, params);
};

// 上传KYC图片
export const upload = (params) => {
  return post('/kyc/kyc/web/upload', params);
};

// 获取脱敏信息
export function getMaskInfo(params) {
  const { kycType } = params;
  return pull(`${prefix}/kyc/${TYPE_MAP[kycType]}/info`, params);
}

/**
 * 是否需要做kyc引导
 * @param {string} biz // 业务线 default-kyc业务 kucard-支付业务 customer-客服业务 currency-现货业务 futures-合约业务 tradingbot-机器人业务 operation-平台运营
 */
export const getKycGuide = (params) => {
  return postJson(`${eKycPrefix}/common/kyc/guide`, params);
};

export const getKycGuideContent = (params) => {
  return postJson(`${eKycPrefix}/common/kyc/guide/content`, params);
};

/**
 * 提交结构基本信息
 * @param {*} data
 */
export const submitBasicCompany = (data) => {
  return post('/kyc/kyc/company/normal/create-or-update', {
    info: encrypt(data),
  });
};

/**
 * 提交结构联系人信息
 * @param {*} data
 */
export const submitContactCompany = (data) => {
  return post('/kyc/kyc/company/contact/create-or-update', {
    info: encrypt(data),
  });
};

export const getKycCode = () => {
  return pull('/kyc/kyc-code');
};

/**
 * 获取用户填写的kyc姓名，不带*号
 * @returns
 */
export const getKycName = () => {
  return pull(`${prefix}/kyc-info`);
};

/**
 * 新KYC接口
 * Author：绍兴会
 */
// 获取kyc认证状态
export const getKycInfo = (params) => {
  return pull('/kyc/kyc/info', params);
};
/**
 * 获取kyc认证状态（新）verifyStatus 会返回 6，7，8（EKYC的认证状态）
 * /kyc/kyc/info的接口状态6、7返回状态0、状态8返回状态2
 * @param {*} params
 * @returns
 */
export const getKycResult = (params) => {
  const url = `${eKycPrefix}/web/kyc/result/personal`;

  return pull(url, params);
};
// 获取kyc权益
export const getKycPrivileges = () => {
  return pull('/kyc/kyc/privileges');
};
// 获取机构认证信息
export const getKycCompanyInfo = () => {
  return pull('/kyc/kyc/company/info');
};

// 初级kyc认证
export const primarySubmit = (params) => post('/kyc/web/kyc/primary/submit', params);

export const kycUpload = (params) => post('/kyc/kyc/web/upload', params);

// 提交高级认证
export const kycSeniorSubmit = (params) => post('/kyc/kyc/senior/submit', params);

// KYC机构基本信息提交
export const kycCompBasicSubmit = (params) =>
  post('/kyc/kyc/company/normal/create-or-update', { info: encrypt(params) });

// KYC机构联系人信息
export const kycCompContactSubmit = (params) =>
  post('/kyc/kyc/company/contact/create-or-update', { info: encrypt(params) });

// KYC获取国家接口
export const kycGetCountries = (params) => pull('/kyc/kyc/regions', params);

// 查询用户机构认证信息
export const KycCompanyDetail = (params) => pull('/kyc/v2/kyc/company/detail', params);

// ekyc支持的国家，返回空代表未开启ekyc流程，走原有流程
export const getEKycCountries = (params) => pull(`${eKycPrefix}/kyc/country`, params);

// 更新KYC1信息
export const updatePrimaryKyc = (params) => post(`${eKycPrefix}/kyc/primary/update`, params);

/***
 * 新增接口
 * Author：minica
 */
export const kycCompMoreImg = (params) =>
  post('/kyc/kyc/company/credentials/create-or-update', params, false, true);

//获取高级认证的渠道
export const getKyc2Channel = (params) => {
  const url = '/kyc/web/kyc/channel';
  return post(url, params, false, true);
};
//完成jumio认证流程，触发后续结果处理
export const finishJumio = (params) => {
  return post('/kyc/web/kyc/finish/jumio', params, false, true);
};
// 获取advance扫脸url
export const getAdvanceUrl = (params) => {
  return pull('/kyc/web/kyc/face-identity/url', params);
};
// 获取尼日利亚用户bvn/nin认证结果
export const getNGResult = () => {
  return pull('/kyc/web/kyc/ng/check-result');
};
// 获取advance扫脸结果,扫脸是否完成
export const getAdvanceResult = (params) => {
  return post('/kyc/web/kyc/ng/finish', params, false, true);
};
// kyc去认证前置风控
export const checkKycRisk = () => {
  return pull('/kyc/web/kyc/verify-risk/check');
};
//lego 提交证件照
export const submitKycOcr = (params) => {
  return post('/kyc/web/kyc/ocr', params, false, true);
};
// lego 获取advance扫脸结果,扫脸是否完成
export const getLegoAdvanceResult = (params) => {
  return post('/kyc/web/kyc/finish/lego', params, false, true);
};
// lego 获取advance扫脸url
export const getLegoAdvanceUrl = (params) => {
  return pull('/kyc/web/kyc/advance-liveness/url', params);
};
// 手动上传证件路径上报接口
export const submitIdImgs = (params) => {
  return post('/kyc/web/kyc/id/upload', params, false, true);
};
//自拍人脸照上传接口
export const submitSelfie = (params) => {
  return post('/kyc/web/kyc/selfie/upload', params, false, true);
};
//单证件照片iqa检测接口
export const checkImg = (params) => {
  return post('/kyc/web/kyc/id-image/check', params, false, true);
};
//kyc权益
export const getPrivileges = (params) => {
  return post('/kyc/web/kyc/privileges', params, false, true);
};
// kyc等级限额
export const getAmountLimit = (params) => {
  return post('/kyc/web/kyc/afterkyclimit', params, false, true);
};
//通用上传接口（手动上传证件/自拍人脸照片）
export const uploadImg = (params) => {
  return post('/kyc/web/kyc/file/upload', params);
};
// 尼日利亚bvn/nin 提交kyc1信息
export const submitNgKyc1 = (params) => post('/kyc/web/kyc/ng-primary/update', params, false, true);
