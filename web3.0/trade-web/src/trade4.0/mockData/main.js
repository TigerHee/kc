/**
 * Owner: clyne@kupotech.com
 */

// leverage接口
export const leverage = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    XBTUSDM: {
      symbol: 'XBTUSDM',
      leverage: '8',
    },
    XBTUSDTM: {
      symbol: 'XBTUSDTM',
      leverage: '5',
    },
    PEPEUSDTM: {
      symbol: 'PEPEUSDTM',
      leverage: '10',
    },
  },
};

export const gray = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    occupancyMode: true,
    marginModes: ['ISOLATED', 'CROSS'],
  },
};

export const marginMode = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    XBTUSDTM: 'CROSS',
    XBTUSDM: 'CROSS',
    PEPEUSDTM: 'CROSS',
    IDUSDTM: 'CROSS',
    XBTMM24: 'CROSS',
  },
};

export const orderBook = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    sequence: 1713533690015,
    symbol: 'XBTUSDTM',
    bids: [[64000, 100]],
    asks: [[65000, 562]],
    ts: 1713584758859000000,
  },
};

export const bestInfo = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    sequence: 1713533690016,
    symbol: 'XBTUSDTM',
    side: 'buy',
    size: 10,
    tradeId: '1713533690016',
    price: '64445',
    // PEPE
    baseBidPrice: '0.0000064',
    bestAskPrice: '0.0000065',
    // XBTUSDTM
    // bestBidPrice: '64000',
    // bestAskPrice: '65000',
    bestBidSize: 19,
    bestAskSize: 552,
    ts: 1713584937288000000,
  },
};

export const mockMap = {
  '/_api_kumex/futures-trade-proxy/configs/getCrossUserLeverage-GET': leverage,
  '/_api_kumex/kumex-contract/contract/cross/gray-GET': gray,
  '/_api_kumex/futures-position-proxy/position/queryMarginMode-GET': marginMode,
  '/_api_kumex/kumex-market/v1/level2/snapshot-GET': orderBook,
  '/_api_kumex/kumex-market/v1/ticker-GET': bestInfo,
};
