/**
 * Owner: roger.chen@kupotech.com
 */
import {pull, post} from 'utils/request';

/**
 * 获取kline
 *
 * @returns {Object}
 */
export async function getKline(prams) {
  return pull('/order-book/candles', prams);
}

/**
 *
 *
 * @returns {Object}
 * 榜单币种列表
 */
export async function getCurrencyList(prams) {
  return pull('/discover-front/gem-box/currency/list', prams);
}

export async function flashTradeCoin(prams) {
  return pull(`/speedy/common/valid/enter/${prams}`);
}

// 点赞/取消点赞
export async function likeCurrencyReason(prams) {
  return post('/discover-front/gem-box/like', prams, false, true);
}

// 查询点赞数
export async function queryLikeCounts(prams) {
  return pull('/discover-front/gem-box/like-count', prams);
}

// 查询交易详情
export async function queryTradeDetail(prams) {
  return pull('/discover-front/gem-box/trade-detail', prams);
}
