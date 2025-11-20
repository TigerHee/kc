/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';
import { isSub } from 'helper';
import { getUcenterUserInfo } from './ucenterUserInfo'
// import fetch from 'isomorphic-fetch';
// import { MAINSITE_HOST } from 'utils/siteConfig';

const _BASE_ = '/land/';

export function getVersion() {
  const { protocol, host } = window.location;
  const prefix = `${protocol}//${host}`;
  return pull(`${prefix}${isSub() ? _BASE_ : '/'}version.json?_ts=${Date.now()}`);
  // return pull(`http://localhost:8001/version.json?_ts=${Date.now()}`);
}

// 当前用户信息
export const getUserInfo = getUcenterUserInfo

// 查询用户设置了哪些安全保护措施以及是否进行过KYC
export async function pullSecurtyMethods(userId) {
  return pull('/ucenter/user/security-methods', { userId });
}

// 获取服务器时间
export async function getServerTime() {
  return pull('/timestamp');
}

/**
 * 根据ip获取国家
 * @returns
 */
export function getCountry() {
  return pull(`/universal-core/ip/country`);
}
