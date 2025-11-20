
export const KLINE_RESOLUTION_TYPES = [
  // 刻度1min，candles请求区间1小时，60个点
  ['1H', '1', 3600000, 60],
  // 刻度5min，candles请求区间24小时，288个点
  ['24H', '5', 24 * 3600000, 288],
  // 刻度30min，candles请求区间7天，336个点
  ['1W', '30', 7 * 24 * 3600000, 336],
  // 刻度1hour，candles请求区间30天，720个点
  ['1M', '60', 30 * 24 * 3600000, 720],
  // 刻度1day，candles请求区间365天，365个点
  ['1Y', '1D', 365 * 24 * 3600000, 365],
  // 刻度1day，candles请求区间365*3天，1095个点
  ['3Y', '1D', 3 * 365 * 24 * 3600000, 1095],
];

// 针对临时币种和未开售币种, 初始数据基础不够隐藏一部分选项
export const NOT_KUCOIN_KLINE_RESOLUTION_TYPES = [
  ['24H', '1day', 24 * 3600000, 288],
];

export const CANDLE_RESOLUTION_TYPES: [string, string, number][] = [
  ['1m', '1', 1000],
  ['5m', '5', 5 * 1000],
  ['15m', '15', 15 * 1000],
  ['1H', '60', 30000],
  ['8H', '480', 8 * 30000],
  ['1D', '1D', 24 * 30000],
  ['1W', '1W', 7 * 24 * 30000],
];

// 临时币种K线数据点位
export const NO_KUCOIN_CANDLE_RESOLUTION_TYPES = [
  ['1H', '60', 30000],
  ['1D', '1D', 24 * 30000],
  ['1W', '1W', 7 * 24 * 30000],
];

// 交易对类型
export const SYMBOL_TYPE = {
  SPOT: 'SPOT',
  MARGIN: 'MARGIN',
  FUTURE: 'FUTURE',
};

// 快捷买币币种
export const BASE_COIN = ['BTC', 'ETH', 'USDT'];

// 币种信息数据来源
export const COIN_DATA_SOURCE = {
  kucoin: 'Kucoin', // 正式
  ti: 'TI', // 未上线
  cmc: 'CMC', // 未上线
  kucoinUnsale: 'Kucoin Unsale', // 已上线，未开交易对
};
