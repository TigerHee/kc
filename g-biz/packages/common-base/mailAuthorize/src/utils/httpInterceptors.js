/**
 * Owner: tiger@kupotech.com
 */
// 上报设备指纹
import request from '@tools/request';
import find from 'lodash/find';
import remoteEvent from '@tools/remoteEvent';

let Report = null;

const FINGERPRINT_URLS = [
  {
    url: '/validation-email/email/risk-check',
    event: 'validation-risk-check',
  },
  {
    url: '/validation-email/email/resend',
    event: 'validation-email-resend',
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
