/**
 * Owner: willen@kupotech.com
 */
import { each } from 'lodash-es';
import { post, pull as originPull, postJson, gbizPull, gbizPost } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';
import { reportCookiesWriteError } from '@/core/telemetryModule';


const pull = pullWrapper(originPull);

const prefix = '/ucenter';

// 获取用户信息
export async function pullUserInfo() {
  return gbizPull(`${prefix}/user-info`);
}

// 获取csrf token
export async function pullCsrf() {
  return pull('/csrftoken');
}

// 查询用户设置了哪些安全保护措施以及是否进行过KYC
export async function pullSecurtyMethods(userId) {
  return gbizPull(`${prefix}/user/security-methods`, { userId });
}

// 获取系统可用时区列表
export async function getTimeZones() {
  return pull(`${prefix}/time-zones`);
}

// 获取系统可用时区列表V2
export async function getTimeZonesV2() {
  return pull(`${prefix}/v2/time-zones`);
}

// 保存用户的本地化设置
export async function setLocal(params) {
  return gbizPost(`${prefix}/user/locale`, params, false, false, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
}

// !!! only run in browser
export async function setUserCookie(params) {
  const _params = {};

  let index = 0;
  each(params, (value, key) => {
    _params[`key[${index}]`] = key;
    _params[`value[${index}]`] = value;
    index += 1;
  });
  return post(`${window.location.origin}/api/v1/cms/cookies`, _params);
}

// 退出登录
export async function logout() {
  return post('/logout');
}

/**
 * @description 获取可用的头像列表
 * @return {Promise<Object>}
 */
export async function getUserAvailableAvatar() {
  return pull(`${prefix}/user/available-avatars`);
}

/**
 * @description 用户修改头像
 * @param code
 * @return {Promise<Object>}
 */
export async function updateAvatar({ code }) {
  return post(`${prefix}/user/avatar/update`, { code });
}

/**
 * @description 用户修改昵称
 * @param nickname
 * @return {Promise<Object>}
 */
export async function udpateNickName({ nickname }) {
  return post('/user-biz-front/user/nickname/update', { nickname });
}

// 检测用户是否碰撞
export async function validateConflict() {
  return pull(`${prefix}/is-need-alert`);
}

// 获取是否支持手机注册
export async function getPhoneSignUpEnabled() {
  return pull(`${prefix}/locale`);
}

// 查询冻结交易和冻结提现状态
export async function getUserFrozenStatus() {
  return pull('/kucoin-web-front/black-group/forbidden-status');
}

// 查询用户是否为中国用户-仅包含状态
export async function getUserRestrictedStatus(params) {
  return pull(`${prefix}/user/is-restricted`, params);
}

// 查询用户是否为中国用户并返回提示文案
export async function getUserRestrictedStatusAndNotice(params) {
  return pull(`${prefix}/user/is-restricted-notice-info`, params);
}

// 获取kyc/充币清退限制开启标志
export async function getUserRestrictType(params) {
  return pull(`${prefix}/user/restrict-type`, params);
}

// 获取用户标签
export async function getUserLabel(params) {
  return pull('/intelligent-service/user/user-label', params);
}

// 获取客户经理服务状态
export async function getManagerStatus() {
  return pull('/intelligent-service/dedicated/service/user/info');
}

// 登录授权
export async function loginVerify(params) {
  return post(`${prefix}/login-verify`, params);
}
// 登录授权-通用接口
export async function commonLoginVerify(params) {
  return post('/validation-email/email/verify', params);
}

/**
 * 获取用户是否入金、交易记录
 */
export const getUserDepositFlag = (params) => {
  return gbizPull('/user-portrait/web/user-label/trade-action', params);
};

/**
 * 获取ada入口配置
 */
export const getAdaEntraceConfig = () => {
  return pull('/intelligent-service/entry/list');
};

// 忘记密码授权
export const forgetPwdVerify = (params) => {
  return post('/ucenter/ucenter-email/verify', params);
};

// 获取用户信息
export async function pullUserExternalBindings() {
  return pull(`${prefix}/external-bindings`);
}

// 解绑第三方
export const unbindExternal = (params) => {
  return post(`${prefix}/external-unbinding`, params);
};

// 绑定第三方
export const bindExternal = (params) => {
  return post(`${prefix}/external-binding`, params, false, true);
};

/** 查询用户设置了哪些安全保护措施 */
export function getSecurityMethods({ token }) {
  return pull(`${prefix}/user/whitelist/security-methods/${token}`);
}

export const setCookies = (data) => postJson('/setCookies', data);

export async function changeTheme(payload) {
  try {
    await setCookies([{ name: 'kc_theme', value: payload.theme }]);
  } catch (e) {
    reportCookiesWriteError(`set theme cookie failed - ${JSON.stringify(e)}`);
  }
}
