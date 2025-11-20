/**
 * Owner: Ray.Lee@kupotech.com
 */

// google 商店对应站点的链接
export const GOOGLE_PLAY_LINKS = {
  global: '/link?url=market://details?id=com.kubi.kucoin',
  turkey: '/link?url=market://details?id=com.kubi.turkey',
  thailand: '/link?url=market://details?id=com.kubi.thailand',
};

export const getSiteLink = (siteType, datas) => datas[siteType];

export const getGooglePlayLink = siteType =>
  getSiteLink(siteType, GOOGLE_PLAY_LINKS);
