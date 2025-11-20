/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, post, postJson } from 'gbiz-next/request';
import { pullWrapper } from "@/tools/pullCache";
import { getUcenterUserInfo } from "./ucenterUserInfo";

const pull = pullWrapper(originPull);

const prefix = "/ucenter";

// 获取用户信息
export const pullUserInfo = getUcenterUserInfo;

// 获取csrf token
export async function pullCsrf() {
  return pull("/csrftoken");
}

// 查询用户设置了哪些安全保护措施以及是否进行过KYC
export async function pullSecurtyMethods(userId) {
  return pull(`${prefix}/user/security-methods`, { userId });
}

// 保存用户的本地化设置
export async function setLocal(params) {
  return post(`${prefix}/user/locale`, params);
}

// 退出登录
export async function logout() {
  return postJson("/logout");
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

/**
 * 获取用户是否入金、交易记录
 */
export const getUserDepositFlag = (params?: { [key: string]: any }) => {
  return pull("/user-portrait/web/user-label/trade-action", params);
};
