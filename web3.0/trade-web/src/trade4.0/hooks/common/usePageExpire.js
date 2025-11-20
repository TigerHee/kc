/**
 * Owner: garuda@kupotech.com
 * 获取页面是否到期
 */

import { useSelector } from 'react-redux';

import { getState } from 'helper';
import { requestAnimationPolyfill } from 'src/trade4.0/utils/requestTimeout';

export const usePageExpire = () => {
  return useSelector((state) => state.futuresCommon.pageExpiredTimer);
};

export const getPageExpire = () => {
  return getState((state) => state.futuresCommon.pageExpiredTimer);
};

export const RAFTaskFallback = (callback) => {
  const pageHidden = getState((state) => state.futuresCommon.pageHidden);
  if (pageHidden) {
    return callback();
  } else {
    return requestAnimationPolyfill(callback);
  }
};
