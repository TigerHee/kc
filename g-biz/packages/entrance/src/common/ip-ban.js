/**
 * Owner: sean.shi@kupotech.com
 */
import storage from '@utils/storage';
import { IP_BAN_CODE } from './constants';
import { addLangToPath } from './tools';

// 美国 IP 封禁触发的接口
const IP_BAN_API = [
  '/ucenter/v2/login-validation',
  '/ucenter/login-validation',
  '/ucenter/sign-up-phone-email',
  '/ucenter/sign-up-email',
  '/ucenter/sign-up-phone',
  '/ucenter/external-register',
  '/ucenter/send-validation-code',
];
/**
 * @description 对于 网关IP 封禁的报错，直接跳转到对应合规链接
 * @param {接口返回} response
 * @returns 响应
 */
export async function ipBanInterceptor(response) {
  try {
    const { data } = response;
    // 命中美国 IP 封禁错误码 & 还需要是特定的 API 才能真正认为需要触发美国 IP 封禁
    if (data?.code === IP_BAN_CODE && data?.url && IP_BAN_API.includes(response?.config?.url)) {
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
    window.location.replace(addLangToPath(res.url, storage.getItem('kucoinv2_lang')));
  }
}
