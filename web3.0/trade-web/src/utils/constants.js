/**
 * Owner: borden@kupotech.com
 */

/**
 * 空对象
 * 别往上加属性
 */
export const EmptyObj = Object.freeze({});

/**
 * 停机代码 Trade
 */
export const MaintenanceCode = 'Trade';


// 市价交易类型
export const MARKET_TRADES = {
  marketPrise: 1,
  marketTriggerPrice: 1,
};

export const TRADE_DIRECTION = {
  BUY: 'buy',
  SELL: 'sell',
};

export const isTriggerTrade = (TrType) => {
  return /triggerpri(s|c)e/i.test(TrType);
};
/**
 * 币对符号
 */
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

/**
 * @type { Record<string, string> }
 */
export const currencyMap = CURRENCY_CHARS.reduce((res, item) => {
  res[item.currency] = item.char;
  return res;
}, {});
