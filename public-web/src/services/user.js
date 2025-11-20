/**
 * Owner: willen@kupotech.com
 */
import { post, pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

const prefix = '/ucenter';

// 获取用户信息
export async function pullUserInfo() {
  return pull(`${prefix}/user-info`);
}

// 获取csrf token
export async function pullCsrf() {
  return pull('/csrftoken');
}

// 查询用户设置了哪些安全保护措施以及是否进行过KYC
export async function pullSecurtyMethods(userId) {
  return pull(`${prefix}/user/security-methods`, { userId });
}

// 获取系统可用时区列表
export async function getTimeZones() {
  return pull(`${prefix}/time-zones`);
}

// 保存用户的本地化设置
export async function setLocal(params) {
  return post(`${prefix}/user/locale`, params);
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
  return post(`${prefix}/user/nickname/update`, { nickname });
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
  return pull(`/intelligent-service/user/user-label`, params);
}

// 获取客户经理服务状态
export async function getManagerStatus() {
  return pull(`/intelligent-service/dedicated/service/user/info`);
}

/**
 * 获取用户是否入金、交易记录
 */
export const getUserDepositFlag = (params) => {
  return pull('/user-portrait/web/user-label/trade-action', params);
};

/**
 * 获取ada入口配置
 */
export const getAdaEntraceConfig = () => {
  return pull('/intelligent-service/entry/list');
};

/**
 * 获取邀请好友信息
 */
export const getReferralCode = () => {
  return pull('/promotion/v1/invitation/share-to-friends');
};
