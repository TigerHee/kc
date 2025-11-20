/**
 * Owner: ella.wang@kupotech.com
 */
import { pull, post } from 'tools/request';
import config from 'config';

const { v2ApiHosts } = config;
const { ROBOT } = v2ApiHosts;
const prefix = '/quicksilver';
export const apiHost = '/cloudx-scheduler';

export const getCountdown = () => {
  return pull(`${prefix}/universe-currency/currency/bitcoin/countdown`);
};

// 竞猜
export const makeBet = (params) =>
  pull(`/quicksilver/currency-detail/symbols/guessing/${params.currency}`, params);

export const getBetResult = (params) =>
  pull(`/quicksilver/currency-detail/symbols/queryGuessing/${params}`);

export const getRobotRank = (param) => {
  return post(`${ROBOT}${apiHost}/v1/task/common/rank`, param, false, true);
};

export const getBTCfutures = (param) => {
  return pull(`/market-front/search`, param);
};

// 获取币种信息
export const getCoinInfo = (params) =>
  pull(`/quicksilver/universe-currency/symbols/info/${params.coin}`, params);

// 根据币种获取交易对行情统计信息
export async function getStatsBySymbol({ symbol }) {
  return pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`);
}

// 获取首页-文章推荐
export function getLearnArticleDetail(params) {
  return pull(`/seo-front/category/detail/info`, params);
}

export const getCategoryList = (params) => {
  return pull('/seo-front/toc/topic/name', params);
};

export function getBlogDetail({ title }) {
  return pull(`/cms/articles/${title}?type=3`);
}
