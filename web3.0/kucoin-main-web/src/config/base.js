/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

// 默认语言
export const DEFAULT_LANG = window._DEFAULT_LANG_;
// 默认locale
export const DEFAULT_LOCALE = window._DEFAULT_LOCALE_;

// 最大精度
export const maxPrecision = 8;

// 首页24h全站数据货币单位
export const HOME_CURRENCY = 'USDT';

// 全局消息
export const message = {
  top: 120,
  duration: 4.5,
};

export const notification = {
  top: 100,
  duration: 4,
};

// 短信验证码发送时间间隔(秒)
export const smsSendInterval = 60;

// localStorage 前缀，memstorage 使用随请求库替换删除
export const storagePrefix = 'kucoinv2';

export const languages = window?.__KC_LANGUAGES__?.__ALL__;

export const allLanguages = window?.__KC_LANGUAGES__?.__ALL__;

export const ActivityType = {
  RANK: 1, // 竞赛
  AIRDROP: 2, // 空投
  VOTE: 3, // 投票
  UNIVERSAL: 4, // 万能活动
  SPOTLIGHT: 8, // SPOTLIGHT抢购
  SPOTLIGHT2: 9, // SPOTLIGHT2预约抽签
  DISTRIBUTE: 12, // 代币分发活动
  SPOTLIGHT5: 13, // SPOTLIGHT5
  SPOTLIGHT6: 14, // SPOTLIGHT6
  SPOTLIGHT7: 15, // SPOTLIGHT7
  SPOTLIGHT8: 16, // SPOTLIGHT8
};
export const SpotlightActivityType = [
  ActivityType.SPOTLIGHT,
  ActivityType.SPOTLIGHT2,
  ActivityType.SPOTLIGHT5,
  ActivityType.SPOTLIGHT6,
  ActivityType.SPOTLIGHT7,
  ActivityType.SPOTLIGHT8,
];

export const ActivityStatus = {
  WAIT_START: 1,
  PROCESSING: 2,
  WAIT_REWARD: 3,
  OVER: 4,
};

/** route store key */
export const APP_ROUTE = 'app_route';

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
  { currency: 'TRY', char: '₤' }, // country: '土耳其、北赛普勒斯(里拉)'
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

// 设备指纹埋点接口
export const FINGERPRINT_URLS = [
  {
    url: '/ucenter/aggregate-login',
    event: 'login',
  },
  {
    url: '/payment/withdraw/apply',
    event: 'withdrawal',
  },
  {
    url: '/welfare/web/receive2phone',
    event: 'redpack-receive',
  },
  {
    url: '/welfare/web/receive2code',
    event: 'redpack-receive',
  },
  {
    url: '/payment/withdraw-address/add',
    event: 'withdraw-address',
  },
  {
    url: '/payment/withdraw-address/delete',
    event: 'delete-withdraw-address',
  },
  {
    url: '/payment/deposit-address/get',
    event: 'query-deposit-address',
  },
  {
    url: '/pool-staking/v3/locks',
    event: 'buy_financial_product',
  },
  {
    url: '/payment/withdraw/info-confirm',
    event: 'withdraw-info-confirm',
  },
  {
    url: '/user-biz-front/v2/freeze-user',
    event: 'freeze-user',
  },
];

// 被清退用户-进行受限制操作时-弹出的提示文案
export const restrictedInfo = {
  zh_CN: '由于国家地区限制，该功能已暂停服务',
  en_US: 'Sorry, the service is temporarily unavailable in your country/region.',
};

// 3.15.0 低于该版本H5无法使用App注入登录
export const SUPPORT_COOKIE_LOGIN = '3.15.0';

// 低于该版本H5无法使用app的设备指纹token
export const SUPPORT_APP_TOKEN = '3.66.0';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

export const SEO_META_CONFIG = [];
