/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import { pull, post } from 'utils/request';
import { siteCfg } from 'config';

const { MAINSITE_HOST } = siteCfg;

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

// 获取用户当前的时区
export async function getTimeZone() {
  return pull(`${prefix}/locale`);
}

// 保存用户的本地化设置
export async function setLocal(params) {
  return post(`${prefix}/user/locale`, params);
}

export async function setUserCookie(params) {
  const _params = {};

  let index = 0;
  _.each(params, (value, key) => {
    _params[`key[${index}]`] = key;
    _params[`value[${index}]`] = value;
    index += 1;
  });
  // return post(`${MAINSITE_HOST}/api/v1/cms/cookies`, _params);
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

// 查询临时令牌信息
export async function queryRenewalToken() {
  return post('/login-status');
}

// 续期
export async function renewalSession(data) {
  return post('/login-renewal', data);
}

// 查询用户是否为中国用户-仅包含状态
export async function getUserRestrictedStatus(params) {
  return pull(`${prefix}/user/is-restricted`, params);
}

// 查询用户是否为中国用户并返回提示文案
export async function getUserRestrictedStatusAndNotice(params) {
  return pull(`${prefix}/user/is-restricted-notice-info`, params);
}
// 查询封禁信息
// 入参支持多个bizType，以英文逗号分隔，如：IP_DIALOG, IP_TOP_MESSAGE, REGISTER
export function queryIpDismiss(params) {
  return pull('/user-dismiss/ip-dismiss/notice', params);
}

// 被动触发弹窗文案
export function queryPassiveNotice(params) {
  return pull('/user-dismiss/dismiss/notice/passive', params);
}

// 获取用户是否可以进行kcs抵扣
export async function queryKcsEnable(params) {
  return pull('/trade-marketing/user/kcs/enable', params);
}
