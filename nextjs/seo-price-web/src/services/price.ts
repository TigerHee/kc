/**
 * Owner: mage.tai@kupotech.com
 */
import { pull as originPull } from 'gbiz-next/request';

const pull = originPull;
const quicksilverService = '/quicksilver';

/**
 * 获取所有币种
 * @param data: { currencyName, sortField, sortType, source, pageIndex, pageSize default 100 }
 * @returns {Object}
 */
export async function getCoinsCategory(data) {
  return pull('/quicksilver/universe-currency/currency-base-info-page', data);
}

export function getBuyCampaign(currency) {
  return pull(`${quicksilverService}/currency-detail/buyCampaign/${currency}`);
}

// // 根据币种获取交易对行情统计信息
// export async function getCoinStats({ currency, symbol, legalCurrency }) {
//   const [statsRes, statesV2Res] = await Promise.all([
//     pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`),
//     pull(`/quicksilver/universe-currency/currency/information/${currency}`, {
//       legalCurrency,
//       symbol,
//     }),
//   ]);
//   const coinStats = {};
//   if (statesV2Res.success && statesV2Res.data) {
//     Object.assign(coinStats, statesV2Res.data);
//   }
//   if (statsRes.success && statsRes.data) {
//     const { highestPrice24h, lowestPrice24h, price } = statsRes.data;
//     Object.assign(coinStats, { highestPrice24h, lowestPrice24h, price });
//   }
//   return coinStats;
// }

// 获取usdt 对法币汇率
export const getUsdtRate = (params) => {
  return pull('/quicksilver/universe-currency/currency/rate', params, { cache: true });
};

export function searchAllTypeList(params) {
  return pull(`/market-front/search`, params);
}

export function getMarketEmotion() {
  return pull('/discover-front/market-emotion');
}
