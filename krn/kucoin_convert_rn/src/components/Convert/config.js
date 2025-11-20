/**
 * Owner: willen@kupotech.com
 */

// 支付账户类型
export const ACCOUNT_TYPE_LIST = [
  {type: 'MAIN', localeKey: '6riKn13iHwQtu6EfeUKj12'},
  {type: 'TRADE', localeKey: 'mW1qzL3ErnvMxRQ7r5Lu3y'},
  {type: 'BOTH', localeKey: 'o8Py8ie2wTUvz37UyVPCsD'},
];

// 充值类型
export const DEPOSITE_TYPE_LIST = [
  {
    type: 'TRANSFER',
    localeKey: 'transfer.s', // 划转
    url: (coin, from) =>
      `/account/transfer?from=${from}&coin=${coin || 'USDT'}`,
  },
  {
    type: 'DEPOSITE',
    localeKey: '1xLSFvwP7kwM6TUV5VGPzh', // 充值
    url: coin => `/account/deposit?coin=${coin}`,
  },
  {
    type: 'OTC',
    localeKey: 'buy.crypto', // 买币
    url: () => '/otc?type=2',
  },
];

// 交易类型
export const TRADE_TYPE_LIST = [
  {
    value: 'MARKET',
    label: 'trade.order.market',
  },
  {
    value: 'LIMIT',
    label: 'trade.order.limit',
  },
];

// 轮询最大次数
export const MAX_QUOTE_LOOP_COUNT = 40;

export const DEFAULT_BASE = 'USDT';
export const DEFAULT_QUOTE = 'BTC';

/**
 * 获取支付账户名字
 */
export const getAccountLabelKey = type => {
  const target = ACCOUNT_TYPE_LIST.find(i => i.type === type);
  return target && target.localeKey;
};

/**
 * 杠杆标识 tips
 */
export const MARGIN_MARKS_TIPS = {
  LONG3: '4KNCpdzcdH8SrCdquHNtzc',
  SHORT3: '4VkigTSasXxSHFetwC1Hte',
  LONG2_4: 'uB6ZyoQTT1ymMYvq3mDpsK',
  SHORT2_4: 'nFrq9byyeCuxv61qDo5VoF',
};

// 交易类型
export const HISTORY_TYPE_LIST = [
  {
    value: 'HISTORY',
    label: '9CSj2u5F9sWQuRuD45gHQL',
  },
  {
    value: 'CURRENT',
    label: 'open.orders',
  },
];

// 市价订单类型
export const ORDER_STATUS_ENUM = {
  SUCCESS: {
    label: 'g5YDiR7qk7y9dGCWHcHU8u',
    id: 'SUCCESS',
    value: 'SUCCESS',
    selected: false,
    color: 'primary',
    bgColor: 'primary8',
  },
  IN_ORDER: {
    label: 'mCkRLuoP1M83q1gmyzwk4A',
    id: 'IN_ORDER',
    value: 'IN_ORDER',
    selected: false,

    color: 'complementary',
    bgColor: 'complementary8',
  },
  CANCEL: {
    label: 'vwd6VPwgCSrnAx9ZZMPEex',
    id: 'CANCEL',
    value: 'CANCEL',
    selected: false,
    color: 'text40',
    bgColor: 'cover4',
  },

  // 限价单
  FAIL: {
    label: 'failed',
    id: 'FAIL',
    value: 'FAIL',
    selected: false,
    color: 'secondary',
    bgColor: 'secondary8',
  },
  ACTIVE: {
    label: '62jCAUUio4WahfGniW611d',
    id: 'ACTIVE',
    value: 'ACTIVE',
    selected: false,
    color: 'secondary',
    bgColor: 'secondary8',
  },
};
