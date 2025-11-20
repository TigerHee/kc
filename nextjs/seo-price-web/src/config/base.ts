/**
 * Owner: victor.ren@kupotech.com
 */

import { namespace } from "gbiz-next/syncStorage";
import { bootConfig, getIsApp } from "kc-next/boot";

export const isApp = getIsApp();

// X-Platform 有透传这个 header，值是 default / mobile / app
export const X_PLATFORM_HEADER = 'x-platform';


// default:  按照PC屏幕大小渲染
// mobile :  按照移动端设备小屏幕进行渲染
// app.   :  按照app小屏渲染，一般隐藏默认header和footer，使用自定义header
export const UAPlatforms = {
  PC: 'default',
  MOBILE: 'mobile',
  APP: 'app',
} as const;

// 提取类型（类似 enum 的效果）
export type UAPlatformTypes = (typeof UAPlatforms)[keyof typeof UAPlatforms];

// NOTICE: 其他可以通用的配置全部迁移到了 gbiz-next/config
// 最大精度
export const maxPrecision = 8;

// 全局消息
export const message = {
  top: 120,
  duration: 4.5,
};

export const notification = {
  top: 100,
  duration: 4,
};

export const SEO_META_CONFIG = [];

export const CURRENCY_CHARS = [
  { currency: 'CNY', char: '¥' }, // country: '中国(人民币)'
  { currency: 'DKK', char: 'kr' }, // country: '丹麦、法罗群岛(克朗)'
  { currency: 'UAH', char: '₴' }, // country: '乌克兰(格里夫纳)'
  { currency: 'ILS', char: '₪' }, // country: '以色列、巴基斯坦(新谢克尔)'
  { currency: 'IRR', char: '﷼' }, // country: '伊朗(里亚尔)'
  { currency: 'RUB', char: '₽' }, // country: '俄罗斯'
  { currency: 'BGN', char: 'лв' }, // country: '保加利亚(列弗)'
  { currency: 'HRK', char: 'kn' }, // country: '克罗埃西亚(库纳)'
  { currency: 'CAD', char: '$' }, // country: '加拿大(加拿大元)'
  { currency: 'IDR', char: 'Rp' }, // country: '印尼(印尼盾)'
  { currency: 'INR', char: '₨' }, // country: '印度、不丹(卢比)'
  { currency: 'TWD', char: '$' }, // country: '台湾(新台币元)'
  { currency: 'KZT', char: 'T' }, // country: '哈萨卡(坚戈)'
  { currency: 'COP', char: '$' }, // country: '哥伦比亚(比索)'
  { currency: 'TRY', char: '₺' }, // country: '土耳其、北赛普勒斯(里拉)'
  { currency: 'MXN', char: '$' }, // country: '墨西哥(比索)'
  { currency: 'NGN', char: '₦' }, // country: '奈及利亚(奈拉)'
  { currency: 'BDT', char: '৳' }, // country: '孟加拉(塔卡)'
  { currency: 'PKR', char: '₨' }, // country: '巴基斯坦(卢比)'
  { currency: 'BRL', char: 'R$' }, // country: '巴西(雷阿尔)'
  { currency: 'NOK', char: 'kr' }, // country: '挪威(克朗)'
  { currency: 'CZK', char: 'Kč' }, // country: '捷克(克朗)'
  { currency: 'SGD', char: '$' }, // country: '新加坡、汶莱(新加坡元)'
  { currency: 'JPY', char: '¥' }, // country: '日本(日元)'
  { currency: 'EUR', char: '€' }, // country: '法国、荷兰、西班牙、爱尔兰、比利时、葡萄牙、安道尔、德国、奥地利、波兰、捷克、斯洛伐克、希腊、马耳他、芬兰等(欧元)'
  { currency: 'PLN', char: 'zł' }, // country: '波兰(兹罗提)'
  { currency: 'THB', char: '฿' }, // country: '泰国(泰铢)'
  { currency: 'AUD', char: '$' }, // country: '澳洲、吐瓦鲁、诺鲁、吉里巴斯(澳元)'
  { currency: 'SEK', char: 'kr' }, // country: '瑞典(克朗)'
  { currency: 'CHF', char: 'Fr' }, // country: '瑞士(法郎)'
  { currency: 'ZAR', char: 'R' }, // country: '纳米比亚、赖索托、南非共和国(兰特)'
  { currency: 'NZD', char: '$' }, // country: '纽西兰、库克群岛(纽西兰元)'
  { currency: 'RON', char: 'L' }, // country: '罗马尼亚(列伊)'
  { currency: 'USD', char: '$' }, // country: '美国、巴拿马(美元)'
  { currency: 'GBP', char: '£' }, // country: '英国(英镑)'
  { currency: 'PHP', char: '₱' }, // country: '菲律宾(披索)'
  { currency: 'VND', char: '₫' }, // country: '越南(越南盾)'
  { currency: 'DZD', char: 'د.ج' }, // country: '阿尔及利亚(第纳尔)'
  { currency: 'ARS', char: '$' }, // country: '阿根廷(比索)'
  { currency: 'KRW', char: '₩' }, // country: '韩国(韩元)'
  { currency: 'HKD', char: '$' }, // country: '香港(港元)'
  { currency: 'MYR', char: 'RM' }, // country: '马来西亚(令吉)'
];

export const currencyMap = {};

CURRENCY_CHARS.forEach((item) => {
  currencyMap[item.currency] = item.char;
});


// 长语言语种 需特殊处理下拉框宽度
export const long_language = [
  "pt_PT",
  "ru_RU",
  "es_ES",
  "ms_MY",
  "fr_FR",
  "fil_PH",
  "pl_PL",
  "de_DE",
  "vi_VN",
];

// 导航高度
export const CONTAINER_HEIGHT = {
  common: {
    max: 80,
    min: 64,
  },
  mini: {
    max: 56,
    min: 48,
  },
};

// 学院仅支持的13种语言
export const SURPORT_LANG = [
  "en_US",
  "es_ES",
  "pt_PT",
  "ar_AE",
  "tr_TR",
  "fr_FR",
  "ja_JP",
  "ko_KR",
  "zh_HK",
  "ru_RU",
  "vi_VN",
  "de_DE",
  "nl_NL",
  "ur_PK",
  "uk_UA",
];

export const LEARN_PAGE_CONFIGS = {
  // 新手学院首页引导
  LearnHomepageGuide: "LearnHomepageGuide",
  // 学院文章详情法务声明
  LearnLegalAnnounce: "LearnLegalAnnounce",
};

// userInfo中的冻结状态
export const FROZEN_STATUS = 3;

export const COUNTRY_INFO_KEY = "locale_country_info";

export const COUNTRY_INFO_PULLING_VALUE = undefined;

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = [
  "rcode",
  "utm_source",
  "utm_campaign",
  "utm_medium",
];

// 常用正则
export const emailReg =
  /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;  
export const phoneReg = /^\d+$/;
export const uidReg = /^\d+$/;

export const allLanguages = [];

// 设备指纹埋点接口
export const FINGERPRINT_URLS = [];

// 低于该版本H5无法使用app的设备指纹token
export const SUPPORT_APP_TOKEN = "3.66.0";

// localStorage 前缀
export const storagePrefix = namespace;


export const RTL_LOCALES = ['ar', 'ur'];

export const RTL_LANGUAGES = ['ar_AE', 'ur_PK'];

// price/coin 获取tdk模板 其余price/xx自路由获取后台配置的tdk
const isPriceTemplate = (pathname: string) => {
  if (/^\/price/.test(pathname)) {
    if (/^\/price(\/(hot-list|top-gainers|new-coins))?$/.test(pathname)) {
      return false;
    }
    return true;
  }
  return false;
};

// 需要单独处理tdk,不采用tdk系统配置的路由。
export const TDK_EXCLUDE_PATH: ((pathname: string) => boolean  | RegExp)[] = [isPriceTemplate];

// 需要替换tdk的二级路由
export const TDK_REPLACE_PATH: (RegExp)[] = [];


export const ALL_I18N_LOCALES = [
    "common",
    "header",
    "notice-center",
    "footer",
    "siteRedirect",
    "userRestricted",
  ]


export const PointType = {
  hotCoins: 'hotlist',
  newCoins: 'newCoins',
  topList: 'topGainers',
}