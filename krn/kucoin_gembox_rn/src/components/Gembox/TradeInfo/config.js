/**
 * Owner: roger.chen@kupotech.com
 */
export const TAB_MAP = {
  buy: 'BUY',
  sell: 'SELL',
};
export const USER_TREADEINFO_TAB_MAP = {
  BIG_MONEY: 'BIG_MONEY',
  PRO_TRADER: 'PRO_TRADER',
};

export const USER_TREADEINFO_COlOR_MAP = {
  BIG_MONEY: '#FFB547',
  PRO_TRADER: '#5C95E8',
  BIG_MONEY12: 'rgba(255, 181, 71, 0.12)',
  PRO_TRADER12: 'rgba(92, 149, 232, 0.12)',
};

export const ORDERINFO_COlOR_MAP = {
  BUY: 'rgba(33, 195, 151, 0.12))',
  SELL: 'rgba(237, 102, 102, 0.12)',
};

const HIGHLIGHTS_MAP_COMMON = {
  SUDDEN_RISE: {
    imgUrl: require('assets/gembox/klineNew.png'),
    showTime: true,
  },
  SUDDEN_FALL: {
    imgUrl: require('assets/gembox/down.png'),
    showTime: true,
  },
  NEW_CURRENCY_OPEN: {
    imgUrl: require('assets/gembox/newIconColor.png'),
  },
  BREAKING_NEWS: {
    imgUrl: require('assets/gembox/Newspaper.png'),
    userDes: true,
    action: () => {},
  },
  HOT_TOPIC: {
    imgUrl: require('assets/gembox/ReasonTopic.png'),
    userDes: true,
    action: () => {},
  },
  MARKET_CHANGE: {
    imgUrl: require('assets/gembox/ReasonChange.png'),
    userDes: true,
    action: () => {},
  },
};
export const HIGHLIGHTS_MAP_BUY = {
  BIG_ORDER: {
    imgUrl: require('assets/gembox/ReasonGreen.png'),
    action: () => {},
  },
  ...HIGHLIGHTS_MAP_COMMON,
};

export const HIGHLIGHTS_MAP_SELL = {
  BIG_ORDER: {
    imgUrl: require('assets/gembox/ReasonRed.png'),
    action: () => {},
  },
  ...HIGHLIGHTS_MAP_COMMON,
};

export const DEFAULT_PERCENT = 60;

export const BROADCAST_MAP = {
  BIG_ORDER: {
    buyTextKey: 'wzxGcph5UFxY2MdfDUxkGV',
    sellTextKey: 'kzPn6H7kCVvXXRv5U69cTB',
  },
  BIG_MONEY: {
    img: require('assets/gembox/OrangePerson.png'),
    buyTextKey: 'vmhothxJ8mGQUSVPudxK87',
    sellTextKey: 'hU3DJYibRnTxJdVKnUW2vH',
  },
  PRO_TRADER: {
    img: require('assets/gembox/BluePerson.png'),
    buyTextKey: 'o2fjTcekWH5ESzAoGZgQLv',
    sellTextKey: '3n4WQaMtMgrQwacKoDkspJ',
  },
};
