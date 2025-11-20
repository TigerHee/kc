/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'tools/request';

const prefix = '/universal-core';

const _prefix = '/growth-ucenter';

export const getBackgroundUrl = (params) => {
  return pull(`${prefix}/image/config`, params);
};

export const getSignupWelfare = (params) => {
  return pull(`${_prefix}/exclusive/benefits/query`, params);
};
