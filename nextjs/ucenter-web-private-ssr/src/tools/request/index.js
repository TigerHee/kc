// import { pull, postJson, post, axiosFetch } from 'gbiz-next/request';
import { pull as gbizPull, post as gbizPost, axiosFetch } from 'gbiz-next/request';
import { FINGERPRINT_URLS } from 'config/base';
import { getReport } from 'gbiz-next/report';
import { pull, postJson, post, postV2, setCsrf, bindOldFetchInterceptors, del } from './old';

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


const bindFingerprintInterceptor = () => {
  axiosFetch.interceptors.request.use(fingerprintInterceptor);
};

const initInterceptor = () => {
  bindFingerprintInterceptor();
  bindOldFetchInterceptors();
};


export { gbizPull, gbizPost, pull, postJson, post, postV2, del, initInterceptor, setCsrf };
