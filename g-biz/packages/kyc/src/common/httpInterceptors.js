/**
 * Owner: iron@kupotech.com
 */
// 请求拦截器，在 login 和 signup 之前上报设备指纹
import request from '@tools/request';
import find from 'lodash/find';
import remoteEvent from '@tools/remoteEvent';

let Report = null;

const FINGERPRINT_URLS = [
  {
    url: '/kyc/web/kyc/primary/submit',
    event: 'kyc1',
  },
  {
    url: '/kyc/kyc/senior/submit',
    event: 'kyc2',
  },
  {
    url: '/compliance-center-flow/compliance/flow/pre',
    event: 'kyc-compliance-flow-pre',
  },
  { url: '/kyc/web/kyc/ng-primary/update', event: 'ng-primary-update' },
];

const fingerprintInterceptor = async (config) => {
  const urlMatch = find(FINGERPRINT_URLS, (o) => config.url.startsWith(o.url));
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (_Report) => {
    Report = _Report;
  });
  if (urlMatch && Report) {
    const token = await Report.logFingerprint(urlMatch.event);
    config.headers.TOKEN_SM = token?.token_sm || '';
  }
  return config;
};

request.interceptors.request.use(fingerprintInterceptor);
