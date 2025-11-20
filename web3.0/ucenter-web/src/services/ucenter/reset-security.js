import { post } from 'tools/request';

/**
 * 获取重置安全项token
 * @param {*} userAccount 用户邮箱或手机
 */
export const pullResetToken = ({ userAccount }) => {
  return post('/ucenter/user/rebind/token', { userAccount });
};

/**
 * 查询重置安全项状态
 * @param {*} token 半登录态token,(半登录态必传)
 * @return {*} status 0-处理中 1-通过-2 拒绝,10 自动审核通过,11系统驳回
 * @return {*} reason 拒绝原因
 */
export const pullResetResult = ({ token }) => {
  return post('/ucenter/user/rebind/result', { token });
};

export const pullSecurityItems = ({ token }) => {
  return post('/ucenter/user/security-methods/detail', { token });
};

/**
 * 重置安全项
 * @param {string} data.token 半登录态token,(半登录态必传)
 * @param {string} data.backPic 证件背面照
 * @param {string} data.backPicMini 证件背面照缩略图
 * @param {string} data.handPic 证件手持照
 * @param {string} data.handPicMini 证件手持照缩略图
 * @param {string} data.frontPic 证件正面照
 * @param {string} data.frontPicMini 证件正面照缩略图
 * @param {string} data.livenessPhotoId 人脸照片
 * @param {string} data.channel 渠道 web，iOS，android，h5
 * @param {string} data.thirdpartDepositPic 三方充值记录图片
 * @param {string} data.rebind 重新绑定的安全项枚举集合
 * @param {string} data.rebindTradePassword 新交易密码
 */
export const postResetApply = ({ payload, headers }) => {
  return post('/ucenter/user/rebind/apply', payload, false, true, headers);
};

export const pullQuestions = ({ token }) => {
  return post('/ucenter/self/security/query/questions', { token });
};

export const postVerifyQuestions = ({ token, data }) => {
  return post('/ucenter/self/security/verify/questions', { token, data });
};

export const postSendCode = ({ bizType, sendChannel, token, address }) => {
  return post('/ucenter/send-validation-code', { bizType, sendChannel, token, address });
};

export const postVerifyCode = (payload) => {
  return post('/ucenter/verify-validation-code', payload);
};

export const getAdvanceUrl = (params) => {
  return post('/kyc/web/kyc/new/advance-liveness/url', params, false, true);
};

export const postFaceCheck = (params) => {
  return post('/kyc/web/kyc/liveness/match/senior', params, false, true);
};

export const postResetG2FA = ({ token }) => {
  return post('/ucenter/google2fa', { token });
};

export const postValidateG2FA = ({ token, code }) => {
  return post('/ucenter/user/google2fa/validate', { token, code });
};
