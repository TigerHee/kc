/**
 * Owner: sean.shi@kupotech.com
 */
import fetch from 'tools/request/fetch';
import { getReport } from 'tools/report';
import { ipBanInterceptor } from './ip-ban';
import { clearUserInterceptor } from './clear-user';
import { invitationListInterceptor } from './invitation-list';

// 设备指纹埋点接口
export const FINGERPRINT_URLS: { url: string, event: string, method?: string }[] = [
  {
    url: '/_api/ucenter/aggregate-login',
    event: 'login',
  },
  {
    url: '/_api/ucenter/v2/aggregate-login',
    event: 'login-v2',
  },
  {
    url: '/_api/ucenter/passkey/authentication/options',
    event: 'login',
  },
  {
    url: '/_api/ucenter/passkey-login',
    event: 'login',
  },
  {
    url: '/_api/ucenter/sign-up-email',
    event: 'register',
  },
  {
    url: '/_api/ucenter/sign-up-phone',
    event: 'register',
  },
  {
    url: '/_api/ucenter/login-validation',
    event: 'login-validation',
  },
  {
    url: '/_api/ucenter/v2/login-validation',
    event: 'login-validation-v2',
  },
  {
    url: '/_api/ucenter/login-verify/resend',
    event: 'login-verify-resend',
  },
  {
    url: '/_api/ucenter/qr-token/create',
    event: 'create-qr-token',
  },
  {
    url: '/_api/ucenter/ucenter-email/risk-check',
    event: 'ucenter-risk-check',
  },
  {
    url: '/_api/ucenter/ucenter-email/resend',
    event: 'ucenter-email-resend',
  },
  {
    url: '/_api/ucenter/login-kickout',
    event: 'login-kickout',
  },
  {
    url: '/_api/ucenter/send-login-sms',
    event: 'send-login-sms',
  },
  {
    url: '/_api/ucenter/register-short-message',
    event: 'register-short-message',
  },
  {
    url: '/_api/ucenter/send-validation-code',
    event: 'send-validation-code',
  },
  {
    url: '/_api/ucenter/external-login',
    event: 'external-login',
  },
  {
    url: '/_api/ucenter/external-account',
    event: 'external-account',
  },
  {
    url: '/_api/ucenter/v2/external-login',
    event: 'external-login-v2',
  },
  {
    url: '/_api/ucenter/check-account',
    event: 'check-account',
  },
  {
    url: '/_api/ucenter/v3/reset-password-phone',
    event: 'reset-password-phone',
  },
  {
    url: '/_api/ucenter/v3/reset-password-email',
    event: 'reset-password-email',
  },
    {
    url: '/_api/ucenter/v4/reset-password-phone',
    event: 'reset-password-phone-v4',
  },
  {
    url: '/_api/ucenter/v4/reset-password-email',
    event: 'reset-password-email-v4',
  },
  {
    url: '/_api/ucenter/sign-up-phone-email',
    event: 'sign-up-phone-email',
  },
  {
    url: '/_api/ucenter/external-register',
    event: 'external-register',
  },
  {
    url: '/_api/ucenter/sign-up-validation',
    event: 'sign-up-validation',
  },
  {
    url: '/_api/ucenter/register-email',
    event: 'register-email',
  },
];

const fingerprintInterceptor = async config => {
  const urlMatch = FINGERPRINT_URLS.find(o => config.url.startsWith(o.url));
 
  if (!urlMatch) {
    return config;
  }
  const Report = await getReport();
  if (Report) {
    const token = await Report.logFingerprint(urlMatch.event);
    config.headers.TOKEN_SM = token?.token_sm || '';
  }
  return config;
};

fetch.interceptors.request.use(fingerprintInterceptor);
// 清退用户拦截器
fetch.interceptors.response.use(clearUserInterceptor);
// 美国 IP 限制拦截器
fetch.interceptors.response.use(ipBanInterceptor);
// 泰国站注册邀请白名单限制
fetch.interceptors.response.use(invitationListInterceptor);
