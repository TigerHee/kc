/**
 * Owner: corki.bai@kupotech.com
 */
import fetch from 'tools/request/fetch';
import { getReport } from 'tools/report';

// 设备指纹埋点接口
export const FINGERPRINT_URLS: { url: string, event: string, method?: string }[] = [
  {
    url: '/_api/ucenter/user/security/malware-plugin-check',
    event: 'malware-plugin-check',
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
