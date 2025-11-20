/**
 * Owner: garuda@kupotech.com
 */

export const sortedMarket = (marketList) => {
  // 按照交易量从大到小排序，若交易量相同，则按照涨跌幅绝对值从大到小排序
  let markets = [];
  if (marketList.length) {
    marketList.sort((a, b) => {
      const aTurnover = +a.turnover || 0;
      const bTurnover = +b.turnover || 0;
      if (aTurnover > bTurnover) {
        return -1;
      }
      if (aTurnover < bTurnover) {
        return 1;
      }
      if (aTurnover === bTurnover) {
        return b.priceChgPct - a.priceChgPct;
      }
      return 0;
    });

    markets = marketList.map((item) => ({
      symbol: item.symbol,
      priceChgPct: item.priceChgPct,
      lastPrice: item.lastPrice,
    }));
  }
  return markets;
};
