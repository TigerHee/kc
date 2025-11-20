import fetch from 'tools/request/fetch';
import { getReport } from 'tools/report';

// 设备指纹埋点接口
const FINGERPRINT_URLS = [
  {
    url: '/_api/risk-validation-center/v1/available/verify',
    event: 'available-verify',
  },
  {
    url: '/_api/risk-validation-center/v1/security/validation/combine',
    event: 'validation-combine',
  },
  {
    url: '/_api/risk-validation-center/v1/security/validation/send-validation-code',
    event: 'send-validation-code',
  },
  {
    url: '/_api/risk-validation-center/v1/security/validation/risk/verify',
    event: 'validation-risk-verify',
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
