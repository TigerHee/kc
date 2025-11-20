/**
 * @Owner: lucas.l.lu@kupotech.com
 * 币种字符表
 */
/**
 * @deprecated
 * TODO - 后续换成 gbiz-next 的变量
 */
export const currencyMap = {
  // country: '法国、荷兰、西班牙、爱尔兰、比利时、葡萄牙、安道尔、德国、奥地利、波兰、捷克、斯洛伐克、希腊、马耳他、芬兰等(欧元)'
  EUR: '€',
  // country: '印度、不丹(卢比)'
  INR: '₹',
  // country: '巴西(雷阿尔)'
  BRL: 'R$',
  PEN: 'S/.',
  // country: '瑞士(法郎)'
  CHF: 'CHF',
  KES: 'KSh',
  // country: '美国、巴拿马(美元)'
  USD: '$',
  // country: '奈及利亚(奈拉)'
  NGN: '₦',
  // country: '中国(人民币)'
  CNY: '¥',
  // country: '菲律宾(披索)'
  PHP: '₱',
  // country: '乌克兰(格里夫纳)'
  UAH: '₴',
  // country: '俄罗斯'
  RUB: '₽',
  // country: '以色列、巴基斯坦(新谢克尔)'
  ILS: '₪',
  // country: '台湾(新台币元)'
  TWD: 'NT$',
  // country: '保加利亚(列弗)'
  BGN: 'лв',
  SAR: 'ر.س',
  // country: '哥伦比亚(比索)'
  COP: 'COL$',
  UGX: 'USh',
  // country: '纳米比亚、赖索托、南非共和国(兰特)'
  ZAR: 'R',
  // country: '丹麦、法罗群岛(克朗)'
  DKK: 'KR',
  // country: '纽西兰、库克群岛(纽西兰元)'
  NZD: 'NZ$',
  // country: '哈萨卡(坚戈)'
  KZT: '₸',
  MAD: 'م.د.',
  // country: '泰国(泰铢)'
  THB: '฿',
  // country: '巴基斯坦(卢比)'
  PKR: '₨',
  BOB: '$b',
  // country: '土耳其、北赛普勒斯(里拉)'
  TRY: '₺',
  // country: '阿根廷(比索)'
  ARS: 'ARS$',
  // country: '孟加拉(塔卡)'
  BDT: '৳',
  // country: '墨西哥(比索)'
  MXN: 'Mex$',
  // country: '瑞典(克朗)'
  SEK: 'kr',
  HUF: 'Ft',
  // country: '克罗埃西亚(库纳)'
  HRK: 'kn',
  // country: '日本(日元)'
  JPY: '¥',
  AED: 'د.إ',
  // country: '加拿大(加拿大元)'
  CAD: 'C$',
  // country: '澳洲、吐瓦鲁、诺鲁、吉里巴斯(澳元)'
  AUD: 'A$',
  EGP: '£',
  MNT: '₮',
  // country: '罗马尼亚(列伊)'
  RON: 'lei',
  // country: '印尼(印尼盾)'
  IDR: 'Rp',
  // country: '波兰(兹罗提)'
  PLN: 'zł',
  // country: '香港(港元)'
  HKD: 'HKD',
  // country: '越南(越南盾)'
  VND: '₫',
  // country: '英国(英镑)'
  GBP: '£',
  // country: '捷克(克朗)'
  CZK: 'Kč',
  VES: 'Bs',
};

/**
 * @deprecated
 * 币种字符表，数组形式
 */
export const currencyArray = Object.keys(currencyMap).map(currency => ({
  currency,
  char: currencyMap[currency],
}));
