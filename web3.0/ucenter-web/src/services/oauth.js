/**
 * Owner: willen@kupotech.com
 */
import { getDefaultInvitationCodeByBrokerNameUsingGet } from 'api/broker';
import { pull } from 'tools/request';

let host = '/';
if (!_DEV_) {
  host = window.location.origin;
} else {
  host = 'https://nginx-web-01.dev.kucoin.net';
}
// 确认前检测
export async function authCheck(params) {
  return pull(`${host}/_oauth/auth-check`, params, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

// 确认授权
export async function authCode(params) {
  const { headers, ...rest } = params;
  return pull(`${host}/_oauth/v2/auth-code`, rest, {
    headers: {
      ...headers,
      'Cache-Control': 'no-store',
    },
  });
}

// 获取系统可用语言列表
export function getLangList() {
  // TODO: 后续删除此行注释
  // return pull('/ucenter/languages');
  return pull('/kucoin-config/web/international/config-list');
}

export function getInvitationCodeByBrokerName(param) {
  return getDefaultInvitationCodeByBrokerNameUsingGet(param, { baseUrl: '/broker' });
}
