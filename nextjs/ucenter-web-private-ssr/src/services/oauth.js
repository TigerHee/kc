/**
 * Owner: willen@kupotech.com
 */
import { getDefaultInvitationCodeByBrokerNameUsingGet } from 'api/broker';
import { pull } from 'tools/request';

const getHost = () => {
  const isDev =
    process.env.NODE_ENV === 'development' || typeof window !== 'undefined'
      ? window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1')
      : false;
  let host = '/';
  if (!isDev) {
    host = window.location.origin;
  } else {
    host = 'https://nginx-web-01.dev.kucoin.net';
  }

  return host;
};

// 确认前检测
export async function authCheck(params) {
  return pull(`${getHost()}/_oauth/auth-check`, params, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

// 确认授权
export async function authCode(params) {
  const { token, ...rest } = params;
  return pull(`${getHost()}/_oauth/v2/auth-code`, rest, {
    headers: {
      'Cache-Control': 'no-store',
      // token 放在请求头，在网关处解析
      ['X-VALIDATION-TOKEN']: token,
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
