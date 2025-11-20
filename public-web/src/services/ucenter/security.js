/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';
const prefix = '/ucenter';
/**
 * 获取验证码
 * @param {*} type register-email/register-short-message
 */
export async function verify(data) {
  return post(`${prefix}/verify-validation-code`, data);
}

export async function getValidationCode({ sendChannel, bizType, address }) {
  return post(`${prefix}/send-validation-code`, {
    bizType,
    sendChannel,
    address,
  });
}

/**
 * 查询安全验证问题
 */
export function pullQuestions({ bizType, token }) {
  return pull(`${prefix}/self/security/query/question/${bizType}/${token}`);
}

/**
 * 查询安全验证问题失败次数
 */
export function pullFailCount(query) {
  return post(`${prefix}/user/verify/failed/count`, query);
}

/**
 * 获取KYC信息
 */
export function pullKycInfo({ token, bizType }) {
  return pull(`${prefix}/self/security/kyc/user/status/${token}`, { bizType });
}

/**
 * KYC0 KYC1: 人脸识别的照片和证件正面照比对
 */
export function checkFacePic(query) {
  return post(`${prefix}/self/security/kyc/face-match`, query, false, true);
}

/**
 * KYC2: 人脸识别的照片和KYC照片比对
 */
export function checkFaceKYC(query) {
  return post(`${prefix}/self/security/kyc/face-match/face-only`, query, false, true);
}

/**
 * 获取智能客服服务开关
 */
export function getConfig() {
  return pull(`${prefix}/query/config`);
}
