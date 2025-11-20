/**
 * Owner: iron@kupotech.com
 */
import { getTenant, getTenantConfig } from '../../tenantConfig';

export const USER_NAV_KEY = {
  ORDER: 'order',
  ASSET: 'asset',
  PERSON: 'person',
  I18N: 'i18n',
  NOTICE: 'notice',
  CURRENCY: 'currency',
  DOWNLOAD: 'download',
  THEME: 'theme',
  SEARCH: 'search',
};

export const USER_NAV_KEY_LIST = [
  USER_NAV_KEY.ASSET,
  USER_NAV_KEY.ORDER,
  USER_NAV_KEY.PERSON,
  USER_NAV_KEY.SEARCH,
  USER_NAV_KEY.NOTICE,
  USER_NAV_KEY.DOWNLOAD,
  USER_NAV_KEY.I18N,
  // USER_NAV_KEY.CURRENCY,
  // USER_NAV_KEY.THEME, 默认不开启主题
];

// 土耳其站header右侧导航菜单配置
// const TR_USER_NAV_KEY_LIST = [
//   USER_NAV_KEY.ASSET,
//   // USER_NAV_KEY.ORDER,
//   USER_NAV_KEY.PERSON,
//   // USER_NAV_KEY.SEARCH,
//   USER_NAV_KEY.NOTICE,
//   USER_NAV_KEY.DOWNLOAD,
//   USER_NAV_KEY.I18N,
//   USER_NAV_KEY.CURRENCY,
//   // USER_NAV_KEY.THEME, 默认不开启主题
// ];

const SITE_USER_NAV_KEY_LIST = {
  TR: [
    USER_NAV_KEY.ASSET,
    USER_NAV_KEY.ORDER,
    USER_NAV_KEY.PERSON,
    USER_NAV_KEY.SEARCH,
    USER_NAV_KEY.NOTICE,
    USER_NAV_KEY.DOWNLOAD,
    USER_NAV_KEY.I18N,
    // USER_NAV_KEY.CURRENCY,
    // USER_NAV_KEY.THEME, 默认不开启主题
  ],
};

export function filterNavUserMenuByBrandSite(menuConfig) {
  // 根据不同站点屏蔽不同站点的header右侧导航菜单
  if (!menuConfig) {
    return menuConfig;
  }
  if (getTenantConfig().isFilterUserMenuConfig) {
    return menuConfig.filter((menu) => {
      if (typeof menu === 'string' && USER_NAV_KEY[menu.toUpperCase()]) {
        return SITE_USER_NAV_KEY_LIST[getTenant()].includes(menu);
      }
      return true;
    });
  }
  return menuConfig;
}
