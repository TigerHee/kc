/**
 * Owner: garuda@kupotech.com
 */
import { useMemo } from 'react';

import { COMPLIANT_CONFIG } from '@/meta/multiTenantSetting';
import { getBrandSite, KC_SITE } from '@/utils/brand';

const isSSG = () => {
  return navigator.userAgent.indexOf('SSG_ENV') > -1;
};

export const useDisplayRule = (ruleId) => {
  const site = getBrandSite();
  const currentConfig = useMemo(() => {
    return COMPLIANT_CONFIG[site] || {};
  }, [site]);
  // 如果在 SSG || 配置项存在则返回不显示
  if (isSSG() || currentConfig[ruleId]) return false;

  return true;
};

// 获取多站点链接地址
export const getBrandLink = (linkMap) => {
  const currentBrand = getBrandSite();
  if (!linkMap) {
    console.error('getBrandLink error, linkMap is empty');
    return '';
  }
  return linkMap[currentBrand] || linkMap[KC_SITE];
};

export { useCompliantShow } from '@kucoin-biz/compliantCenter';
