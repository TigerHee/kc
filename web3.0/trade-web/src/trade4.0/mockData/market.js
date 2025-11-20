/**
 * Owner: clyne@kupotech.com
 */

// /kumex-trade/market/list
const marketList = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: [
    {
      symbol: 'PEPEUSDTM',
      volume: '0',
      turnover: '0',
      turnoverUsdt: '0',
      price24HoursBefore: null,
      lastPrice: '0.0000065',
      lowPrice: '0',
      highPrice: '0',
      priceChgPct: '0',
      ts: 1713497862856066000,
      priceChg: '0',
    },
    {
      symbol: 'XBTUSDTM',
      volume: '0',
      turnover: '0',
      turnoverUsdt: '0',
      price24HoursBefore: null,
      lastPrice: '65000',
      lowPrice: '0',
      highPrice: '0',
      priceChgPct: '0',
      ts: 1713497862856066000,
      priceChg: '0',
    },
    {
      symbol: 'IDUSDTM',
      volume: '0',
      turnover: '0',
      turnoverUsdt: '0',
      price24HoursBefore: null,
      lastPrice: '0.84513',
      lowPrice: '0',
      highPrice: '0',
      priceChgPct: '0',
      ts: 1713497862856066000,
      priceChg: '0',
    },
    {
      symbol: 'XBTUSDM',
      volume: '0',
      turnover: '0',
      turnoverUsdt: '0',
      price24HoursBefore: null,
      lastPrice: '64000',
      lowPrice: '0',
      highPrice: '0',
      priceChgPct: '0',
      ts: 1713497862856066000,
      priceChg: '0',
    },
    {
      symbol: 'XBTMM24',
      volume: '0',
      turnover: '0',
      turnoverUsdt: '0',
      price24HoursBefore: null,
      lastPrice: '64500',
      lowPrice: '0',
      highPrice: '0',
      priceChgPct: '0',
      ts: 1713497862856066000,
      priceChg: '0',
    },
  ],
};

export const IP_AND_MP = {
  XBTUSDTM: {
    markPrice: '65000',
    indexPrice: '65001',
  },
  PEPEUSDTM: {
    markPrice: '0.0000065000',
    indexPrice: '0.000006501',
  },
  IDUSDTM: {
    markPrice: '65000',
    indexPrice: '65001',
  },
  XBTUSDM: {
    markPrice: '61000',
    indexPrice: '61001',
  },
  XBTMM24: {
    markPrice: '65000',
    indexPrice: '65001',
  },
};
const markPrice = {
  success: true,
  code: '200',
  msg: 'success',
  retry: false,
  data: {
    symbol: 'XBTUSDM',
    granularity: 1000,
    timePoint: 1713498604000,
    value: '65000',
    indexPrice: '3500',
  },
};
export const mockMap = {
  '/_api_kumex/kumex-index/mark-price/XBTUSDM/current-GET': markPrice,
  '/_api_kumex/kumex-index/mark-price/XBTUSDTM/current-GET': markPrice,
  '/_api_kumex/kumex-trade/market/list-GET': marketList,
};
