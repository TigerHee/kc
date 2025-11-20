/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 登录
export async function login(param) {
  return post('/ucenter/aggregate-login', param, true);
}

// 登录V2
export async function loginV2(param) {
  return post('/ucenter/v2/aggregate-login', param, true);
}

// // 登录校验
// export async function validate(param) {
//   return post('/ucenter/login-validation', param, true);
// }

// 登录校验V2
export async function validateV2(param) {
  return post('/ucenter/v2/login-validation', param, true);
}

// 发送手机验证码
export function sendSms(param) {
  return get('ucenter/send-login-sms', param);
}
// 发送邮箱验证码
export function sendEmailCode(param) {
  return get('ucenter/send-login-email', param);
}
// 获取区号列表
export function getCountryCodes() {
  return get('ucenter/country-codes');
}
// 检查账号是否重复
export function validateAccount(params) {
  return get('ucenter/phone-number-validate', params);
}

// web查询扫码登录token状态
export function checkLoginStatus({ qrToken }) {
  return get('ucenter/qr-token/status', { qrToken });
}

// web生成扫码登录token
export function getToken(params) {
  return post('ucenter/qr-token/create', params, true);
}

// 扫码登录
export function validationLogin({ token, validations }) {
  return post('ucenter/v2/login-validation', { token, validations }, true); // 切换到新的登录验证接口
}

// 重新发送登录授权邮件
export function resendMail(params = {}) {
  return post('/ucenter/login-verify/resend', params, true);
}

// 查询授权结果
export function getMailVerifyResult(params = {}) {
  return get('/ucenter/login-verify/query', params);
}

// 获取邮箱后缀
export const getEmailSuffixes = (payload) => get(`/market-operation/mail-suffixes`, payload);

// 确认登录并踢出其他Web设备
export function loginKickOut(params = {}) {
  return post('/ucenter/login-kickout', params, true);
}

// 三方账号 第一步登陆
export function thirdPartyLoginSubmit(params = {}) {
  return post('/ucenter/v2/external-login', params);
}

// 查询用户是否已存在
export function checkAccount(params = {}) {
  return post('/ucenter/check-account', params);
}

// 查询当前三方登录信息的基础信息，如邮箱、用户名
export function getThirdPartyBaseInfo(params = {}) {
  return post('/ucenter/external-account', params);
}

// Passkey 登录获取认证 options
export function getPasskeyAuthnOptionsApi(params = {}) {
  return get('/ucenter/passkey/authentication/options', params);
}

// Passkey 登录
export function passkeyLoginApi(params = {}) {
  return post('ucenter/passkey-login', params);
}

// 发送验证码 - 标准方式
export function sendVerifyCode(param) {
  return post('/ucenter/send-validation-code', param, true);
}

// 查询待重新签署协议
export function queryWaitedSignTerms() {
  return get('/ucenter/user/query-waited-sign-term');
}

// 签署协议
export function signTermUsingPost(param) {
  return post('/ucenter/user/sign-term', param, false);
}

// 退出登录
export const logout = () => {
  return post('/logout');
};

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 查询用户密码修改弹窗接口
export function queryChangePassword() {
  return get('/ucenter/user/query-change-password');
}

// 延长密码修改提示时间接口
export function expandPasswordDuration() {
  return post('/ucenter/user/expand-password-duration');
}
