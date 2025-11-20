export const siteKeyMap = {
  GLOBAL: 'KuCoin',
  EUROPE: 'KuCoin EU',
  AUSTRALIA: 'KuCoin Australia',
};

/**
 * 获取站点名称
 * @param {string} key 如果要获取当前站全名，使用 window._BRAND_SITE_FULL_NAME_
 * @returns
 */
const getSiteName = (key) => {
  if (typeof key !== 'string') return '';
  return siteKeyMap[key.toUpperCase()] || '';
};

export default getSiteName;
