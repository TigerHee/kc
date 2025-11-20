/**
 * Owner: iron@kupotech.com
 */
// 请求拦截器，在 login 和 signup 之前上报设备指纹
import request, { defaultInterceptor, defaultResponseInterceptorId } from '@tools/request';
import find from 'lodash/find';
import remoteEvent from '@tools/remoteEvent';
import { ipBanInterceptor } from './ip-ban';
import { clearUserInterceptor } from './clear-user';
import { invitationListInterceptor } from './invitation-list';

let Report = null;

const FINGERPRINT_URLS = [
  {
    url: '/ucenter/aggregate-login',
    event: 'login',
  },
  {
    url: '/ucenter/v2/aggregate-login',
    event: 'login-v2',
  },
  {
    url: '/ucenter/passkey/authentication/options',
    event: 'login',
  },
  {
    url: '/ucenter/passkey-login',
    event: 'login',
  },
  {
    url: '/ucenter/sign-up-email',
    event: 'register',
  },
  {
    url: '/ucenter/sign-up-phone',
    event: 'register',
  },
  {
    url: '/ucenter/login-validation',
    event: 'login-validation',
  },
  {
    url: '/ucenter/v2/login-validation',
    event: 'login-validation-v2',
  },
  {
    url: '/ucenter/login-verify/resend',
    event: 'login-verify-resend',
  },
  {
    url: '/ucenter/qr-token/create',
    event: 'create-qr-token',
  },
  {
    url: '/ucenter/ucenter-email/risk-check',
    event: 'ucenter-risk-check',
  },
  {
    url: '/ucenter/ucenter-email/resend',
    event: 'ucenter-email-resend',
  },
  {
    url: '/ucenter/login-kickout',
    event: 'login-kickout',
  },
  {
    url: '/ucenter/send-login-sms',
    event: 'send-login-sms',
  },
  {
    url: '/ucenter/register-short-message',
    event: 'register-short-message',
  },
  {
    url: '/ucenter/send-validation-code',
    event: 'send-validation-code',
  },
  {
    url: '/ucenter/external-login',
    event: 'external-login',
  },
  {
    url: '/ucenter/external-account',
    event: 'external-account',
  },
  {
    url: '/ucenter/v2/external-login',
    event: 'external-login-v2',
  },
  {
    url: '/ucenter/check-account',
    event: 'check-account',
  },
  {
    url: '/ucenter/v3/reset-password-phone',
    event: 'reset-password-phone',
  },
  {
    url: '/ucenter/v3/reset-password-email',
    event: 'reset-password-email',
  },
  {
    url: '/ucenter/sign-up-phone-email',
    event: 'sign-up-phone-email',
  },
  {
    url: '/ucenter/external-register',
    event: 'external-register',
  },
  {
    url: '/ucenter/sign-up-validation',
    event: 'sign-up-validation',
  },
  {
    url: '/ucenter/register-email',
    event: 'register-email',
  },
];

const fingerprintInterceptor = async (config) => {
  if (!config.url.startsWith('/')) {
    config.url = `/${config.url}`;
  }
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (_Report) => {
    Report = _Report;
  });

  const urlMatch = find(FINGERPRINT_URLS, (o) => config.url.startsWith(o.url));
  if (urlMatch && Report) {
    const token = await Report.logFingerprint(urlMatch.event);
    // token重新取值
    let tokenObj = {};
    if (Object.prototype.toString.call(token) === '[object Object]') {
      tokenObj = {
        TOKEN_SM: token?.token_sm,
      };
    }
    config.headers = {
      ...config.headers,
      ...tokenObj,
    };
  }
  return config;
};

// 取消默认注册的拦截器
request.interceptors.response.eject(defaultResponseInterceptorId);

request.interceptors.request.use(fingerprintInterceptor);
// 清退用户拦截器
request.interceptors.response.use(clearUserInterceptor);
// 美国 IP 限制拦截器
request.interceptors.response.use(ipBanInterceptor);
// 泰国站注册邀请白名单限制
request.interceptors.response.use(invitationListInterceptor);

// 重新注册默认拦截器
request.interceptors.response.use(defaultInterceptor, (err) => Promise.reject(err));
