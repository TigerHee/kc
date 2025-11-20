/**
 * Owner: willen@kupotech.com
 */
import sensors from 'tools/ext/kc-sensors';
import { updateQueryStringParameter } from 'utils/formatUrlWithLang';

// 用于拼接spm参数
export const compose = (...rest) => {
  if (!sensors) return '';
  const { compose: _compose = () => '' } = sensors.spm || {};
  const spmModule = sensors.spm;
  const kc_siteid = spmModule.getSiteId();
  const kc_pageid = spmModule.getPageId();
  if (!kc_siteid || !kc_pageid) return '';
  return _compose(...rest);
};
// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms) => {
  if (!spms) return url;
  const spm = compose(spms);
  if (!spm) return url;
  return updateQueryStringParameter(url, 'spm', spm);
};
