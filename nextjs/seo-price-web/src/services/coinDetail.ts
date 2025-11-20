/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'gbiz-next/request';

// 根据币种获取最佳交易对（保留）
export async function getBestSymbolByCoin({ coin }) {
  return pull(`/quicksilver/universe-currency/market/symbols/${coin}`);
}

// // 根据币种获取交易对行情统计信息
// export async function getStatsBySymbol({ symbol }) {
//   return pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`);
// }

// // 获取币种信息
// export const getCoinInfo = (params) =>
//   pull(`/quicksilver/universe-currency/symbols/info/${params.coin}`, params);

// // 获取币价走势信息
// export const getTrendInfo = ({ symbol }) => {
//   return pull(`/quicksilver/currency-detail/symbols/trend/${symbol}`);
// };

// 竞猜
export const makeBet = (params) =>
  pull(`/quicksilver/currency-detail/symbols/guessing/${params.currency}`, params);

// 获取竞猜结果（保留，竞猜操作后刷新使用）
export const getBetResult = (params) =>
  pull(`/quicksilver/currency-detail/symbols/queryGuessing/${params}`);

// 获取临时币种K线
export const getNoLineCandles = (params) => {
  return pull(`/quicksilver/universe-currency/symbols/candles`, params);
};

// 获取未开售/临时币种价格数据
export const getNotSalePriceData = (symbol) => {
  return pull(`/quicksilver/universe-currency/notSale/priceData/${symbol}`);
};

// 获取币种信息（合并后的新接口）合并了 getCoinInfo & getExplain & getBestSymbolByCoin & getBetResult
export const fetchNewCoinInfos = (params) =>
  pull(`/quicksilver/currency-detail/currency/price/info`, params);

// 获取币种交易对相关数据（合并后的新接口） 合并了 getStatsBySymbol & getTrendInfo
export const fetchCoinSymbolData = (params) =>
  pull(`/quicksilver/currency-detail/symbols/price/info`, params);
