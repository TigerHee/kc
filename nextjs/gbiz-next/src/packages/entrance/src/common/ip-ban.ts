/**
 * Owner: sean.shi@kupotech.com
 */
import { IP_BAN_CODE } from './constants';
import addLangToPath from 'tools/addLangToPath';
import { AxiosResponse } from 'axios';

// 美国 IP 封禁触发的接口
const IP_BAN_API = [
  '/_api/ucenter/v2/login-validation',
  '/_api/ucenter/login-validation',
  '/_api/ucenter/sign-up-phone-email',
  '/_api/ucenter/sign-up-email',
  '/_api/ucenter/sign-up-phone',
  '/_api/ucenter/external-register',
  '/_api/ucenter/send-validation-code',
];
/**
 * @description 对于 网关IP 封禁的报错，直接跳转到对应合规链接
 * @param {接口返回} response
 * @returns 响应
 */
export async function ipBanInterceptor(response: AxiosResponse) {
  try {
    const { data } = response;
    const url = response?.config?.url;
    // 命中美国 IP 封禁错误码 & 还需要是特定的 API 才能真正认为需要触发美国 IP 封禁
    if (data?.code === IP_BAN_CODE && data?.url && url && IP_BAN_API.some(item => url.includes(item))) {
      // 返回 promise 防止业务逻辑 toast、弹窗错误提示
      await new Promise(() => {
        restrictJump(data);
      });
    }
  } catch (err) {
    console.log('err..', err);
  }
  return Promise.resolve(response);
}

export function restrictJump(res) {
  // 50003为网关返回的CDN封禁标识，直接跳转
  if (res?.code === IP_BAN_CODE && res?.url) {
    // 当前url和跳转url相同时，不跳转
    const currentPathname = window.location.pathname;
    const redirectUrl = new URL(res.url);
    // currentPathname可能带有语言前缀，以后缀匹配为准
    if (currentPathname.endsWith(redirectUrl.pathname)) return;
    // 尝试从localstorage中取语言
    window.location.replace(addLangToPath(res.url));
  }
}
