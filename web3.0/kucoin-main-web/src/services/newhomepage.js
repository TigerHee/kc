/**
 * Owner: mcqueen@kupotech.com
 */
import config from 'config';

import { pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

const {
  v2ApiHosts: { CMS },
} = config;

/**
 * 获取新闻列表
 *
 * @returns {Object}
 */
export const getNews = ({ pageSize }) => pull(`${CMS}/cms/articles`, { pageSize });

/**
 * 获取统计数据，累计交易人次，累计交易量
 */
export const pullStatistics = () => pull('/trade-front/trade-statistics');

/**
 * 统计数据：获取累计交易量,累计交易人次（包含合约交易）
 */
export const pullContractStatistics = () => {
  return pull('/kucoin-web-front/statistics/accumulative').catch((e) => {
    // 加载异常的情况下，直接返回0，避免因接口访问异常，导致交易统计无法刷新
    console.error('pullContractStatistics', e);
    return {
      data: { transactions: 0, volumes: 0 },
    };
  });
};

/**
 * 获取广告列表
 *
 * @returns {Object}
 */
export const getAds = (payload) => pull(`${CMS}/cms/ads`, payload);

/**
 * 获取指数币种实时价格
 */
export const queryTickers = () => pull('/index/tickers', { type: 1 });

/**
 * 获取全站汇总数据
 *
 * @returns {Object}
 */
export async function getSummary(currency) {
  const _pull = pullWrapper(pull);
  return _pull(`/promotion/campaign/last24HourIncome/${currency}`);
}

/**
 * 获取全站24H交易量统计(包含合约交易量)
 * @param {*} currency
 * @returns
 */
export function getContractSummary(currency = 'USDT') {
  return pull(`/kucoin-web-front/statistics/last24HourIncome?currency=${currency}`);
}

// 福利中心-新客任务-任务配置信息
export const getKuRewardsNewcomerConfig = (params = {}) => {
  return pull(`/platform-reward/newcomer/config`, params);
};

/**
 * 页面配置
 * @param {{ businessLine: string; codes:string }} params
 * @returns
 */
export const getPageConfigItems = (params) => {
  return pull(`/growth-config/get/client/config/codes`, params);
};
