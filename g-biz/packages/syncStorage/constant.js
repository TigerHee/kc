/**
 * Owner: garuda@kupotech.com
 */
export const getBrandSite = () => window._BRAND_SITE_ || ''; // 获取当前站点

export const brandPrefix = '!_'; // 私有 key 前缀

export const namespace = 'kucoinv2_'; // 默认

export const isSupportStorageType = ['localStorage', 'sessionStorage']; // 可以支持的 storage 类型

export const defaultStorageType = 'localStorage'; // 默认的 storage type

// 独立站点
export const STAND_SITE = ['KC', 'TH', 'TR', 'CL'];

// FIXME: 多租户上线前需要删除，否则无法适配多租户 key 隔离
// 需要额外处理的 key 类型
// 非 public key 并且需要跨项目复用的 key
export const NEED_SET_TWICE = [
  'lang',
  'currency',
  'locale_country_info',
  'coinIconUrlMap',
  'kucoinv2_lang',
  'kucoinv2_currency',
  'kucoinv2_locale_country_info',
  'kucoinv2_coinIconUrlMap',
];

// 不需要 namespace，且强制为 public 的
// 用户传的 key 是什么，就用什么，忽略 namespace，且是 public 的
export const FORCE_USE_KEY = ['kc_theme'];
// 需要 namesapce，且强制为 public 的
export const FORCE_PUBLIC_KEY = ['kucoinv2__x_version'];
