/**
 * Owner: john.zhang@kupotech.com
 */

export const isAu = (site) => {
  if (typeof site !== 'string') return false;
  const upper = site.toUpperCase();
  return upper === 'AU' || upper === 'AUSTRALIA';
};

export const isAT = (userTransferInfo) => {
  return userTransferInfo?.targetRegion === 'AT';
};

export const getTargetSiteType = (transferUserInfo, transferStatus) => {
  return transferUserInfo?.targetSiteType || transferStatus?.targetSiteType || '';
};

export const getOriginSiteType = () => window._BRAND_SITE_FULL_NAME_ || '';
