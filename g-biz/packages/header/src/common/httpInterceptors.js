/**
 * Owner: corki.bai@kupotech.com
 */
import request from '@tools/request';
import find from 'lodash/find';
import remoteEvent from '@tools/remoteEvent';

let Report = null;

const FINGERPRINT_URLS = [
  {
    url: '/ucenter/user/security/malware-plugin-check',
    event: 'malware-plugin-check',
  },
];

const fingerprintInterceptor = async (config) => {
  const urlMatch = find(FINGERPRINT_URLS, (o) => config.url.startsWith(o.url));

  // 为了保证 Report 有值,大部分项目是同步运行的,但少部项目（如landing-web）是异步加载的
  await new Promise((resolve) => {
    remoteEvent.emit(remoteEvent.evts.GET_REPORT, (_Report) => {
      Report = _Report;
      resolve();
    });
  });
  if (urlMatch && Report) {
    const token = await Report.logFingerprint(urlMatch.event);
    config.headers.TOKEN_SM = token?.token_sm || '';
  }
  return config;
};

request.interceptors.request.use(fingerprintInterceptor);
