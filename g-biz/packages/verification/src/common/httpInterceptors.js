/**
 * Owner: vijay.zhou@kupotech.com
 */
// 请求拦截器，上报设备指纹
import request from '@tools/request';
import find from 'lodash/find';
import remoteEvent from '@tools/remoteEvent';

let Report = null;

const FINGERPRINT_URLS = [
  {
    url: '/risk-validation-center/v1/available/verify',
    event: 'available-verify',
  },
  {
    url: '/risk-validation-center/v1/security/validation/combine',
    event: 'validation-combine',
  },
  {
    url: '/risk-validation-center/v1/security/validation/send-validation-code',
    event: 'send-validation-code',
  },
  {
    url: '/risk-validation-center/v1/security/validation/risk/verify',
    event: 'validation-risk-verify',
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
    config.headers.TOKEN_SM = token?.token_sm || '';
  }
  return config;
};

request.interceptors.request.use(fingerprintInterceptor);
