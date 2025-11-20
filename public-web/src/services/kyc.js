/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, post } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';
import CryptoJS from 'crypto-js';

const pull = pullWrapper(originPull);

const key = CryptoJS.enc.Utf8.parse('ry35490gf27et52d');

// 加密方法
const encrypt = (data) => {
  data = JSON.stringify(data);
  const srcs = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

const prefix = '/ucenter';

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
  return pull(`${prefix}/kyc/submit`, params);
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
  return post(`${prefix}/kyc/upload`, params);
};

// 获取脱敏信息
export function getMaskInfo(params) {
  const { kycType } = params;
  return pull(`${prefix}/kyc/${TYPE_MAP[kycType]}/info`, params);
}

/**
 * 提交结构基本信息
 * @param {*} data
 */
export const submitBasicCompany = (data) => {
  return post(`${prefix}/kyc/company/normal/create-or-update`, {
    info: encrypt(data),
  });
};

/**
 * 提交结构联系人信息
 * @param {*} data
 */
export const submitContactCompany = (data) => {
  return post(`${prefix}/kyc/company/contact/create-or-update`, {
    info: encrypt(data),
  });
};

export const getKycCode = () => {
  return pull(`${prefix}/kyc-code`);
};
/**
 * 新KYC接口
 * Author：绍兴会
 */
// 获取kyc认证状态
export const getKycInfo = (params) => {
  return pull(`${prefix}/kyc/info`, params);
};
// 获取kyc权益
export const getKycPrivileges = () => {
  return pull(`${prefix}/kyc/privileges`);
};
// 获取机构认证信息
export const getKycCompanyInfo = () => {
  return pull(`${prefix}/kyc/company/info`);
};

// 初级kyc认证
export const primarySubmit = (params) => post('/ucenter/kyc/primary/submit', params);

export const kycUpload = (params) => post('/ucenter/kyc/upload', params);

// 提交高级认证
export const kycSeniorSubmit = (params) => post('/ucenter/kyc/senior/submit', params);

// KYC机构基本信息提交
export const kycCompBasicSubmit = (params) =>
  post('/ucenter/kyc/company/normal/create-or-update', { info: encrypt(params) });

// KYC机构联系人信息
export const kycCompContactSubmit = (params) =>
  post('/ucenter/kyc/company/contact/create-or-update', { info: encrypt(params) });

// KYC获取国家接口
export const kycGetCountries = (params) => pull('/ucenter/kyc/regions', params);

// KYC获取国家接口-加了白名单的
export const kycGetCountries2 = ({ token }) =>
  pull(`/ucenter/whitelist/kyc/regions?token=${token}`);

// 查询用户机构认证信息
export const KycCompanyDetail = (params) => pull('/ucenter/kyc/company/detail', params);
