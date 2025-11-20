/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

// 默认语言
export const DEFAULT_LANG = window._DEFAULT_LANG_;
// 默认locale
export const DEFAULT_LOCALE = window._DEFAULT_LOCALE_;

export const BASE_CURRENCY = window._BASE_CURRENCY_;
/** 多租户站点配置 */
export const SITE_CONFIG = window._SITE_CONFIG_
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

// localStorage 前缀
export const storagePrefix = 'kucoinv2';

// SEO创建url别名时，如果url有query部分在这里配置
export const SEOMetaQueryConfig = [];

export const languages = window?.__KC_LANGUAGES__?.__ALL__;

export const allLanguages = window?.__KC_LANGUAGES__?.__ALL__ || languages;

// zendesk 语言列表key
export const zElanguages = {
  ar_AE: 'ar',
  bn_BD: 'bn',
  de_DE: 'de',
  en_US: 'en-us',
  es_ES: 'es',
  fil_PH: 'fil',
  fr_FR: 'fr',
  hi_IN: 'hi',
  it_IT: 'it',
  ja_JP: 'ja',
  ko_KR: 'ko-kr',
  id_ID: 'id-id',
  ms_MY: 'ms-my',
  nl_NL: 'nl',
  pl_PL: 'pl',
  pt_PT: 'pt',
  ru_RU: 'ru',
  th_TH: 'th',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-tw',
  ur_PK: 'ur',
  uk_UA: 'uk-ua',
};

export const zendeskApiPrefix = '/support';

// 用于买卖盘深度合并的精度
export const maxDecimalPrecision = 10;

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
const getCurencyMap = () => {
  _.forEach(CURRENCY_CHARS, (item) => {
    currencyMap[item.currency] = item.char;
  });
};

getCurencyMap();

// 不使用socket的页面
export const noWsPageList = [];
// 当前页面是否使用socket
export const nowPageUseWs = (url = '') => {
  // 校验当前页面是否使用socket
  const nowPageUrl = url || window.location.href || '';
  const _find = _.find(noWsPageList, (item) => _.includes(nowPageUrl, item));
  return !_find;
};

export const intoPageGaName = 'pageVisitCollectionV1';
export const clickGaName = 'eleClickCollectionV1';
export const exposureGaName = 'eleExposureCollectionV1';
export const siteidGaName = 'kucoinWeb';
// 设备指纹埋点接口
export const FINGERPRINT_URLS = [
  {
    url: '/grey-market-trade/grey/market/order/take',
  },
  {
    url: '/grey-market-trade/grey/market/order/create',
  },
  {
    url: '/gem-staking/gempool/staking/campaign/order',
  },
];

export const restrictedStatusList = [1, 2];

// 3.15.0 低于该版本H5无法使用App注入登录
export const SUPPORT_COOKIE_LOGIN = '3.15.0';

// 3.61.0 低于该版本H5无法使用app的人脸识别
export const SUPPORT_BAIDU_FACE = '3.61.0';

// 低于该版本H5无法使用app的ada和Zendesk服务
export const SUPPORT_SDK = '3.65.0';

// 低于该版本H5无法使用app的设备指纹token
export const SUPPORT_APP_TOKEN = '3.66.0';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

// 独立文章路由配置（业务 & seo meta 会用到）
export const INDEPENDENT_ARTICLE_PATHS = [
  '/legal/terms-of-use',
  '/legal/privacy-policy',
  '/legal/risk-disclosure-statement',
  '/legal/anti-money-laundering-and-counter-terrorism-financing',
  '/legal/special-treatment',
  '/legal/law-enforcement-request-guidelines',
  '/legal/kucoin-info-privacy-policy',
  '/legal/kucoin-info-terms-of-use',
];

// 独立文章路由配置（业务 & seo meta 会用到）-- 澳洲站
export const AU_INDEPENDENT_ARTICLE_PATHS = [
  '/legal/au-earn-structured-agreement',
  '/legal/au-earn-snowball-agreement',
  '/legal/au-earn-shark-fin-agreement',
  '/legal/au-earn-dual-agreement',
  '/legal/au-earn-twin-win-agreement',
  '/legal/au-earn-convert-plus-agreement',
  '/legal/au-earn-future-plus-agreement',
  '/legal/au-earn-range-bound-agreement',
];


