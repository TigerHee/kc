/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
const prefix = '/score-center';

// 获取数据
export const getConfig = () => pull(`${prefix}/eth-merge/config`);

// 话题相关社区帖子
export const getPostDetail = () => pull(`${prefix}/eth-merge/social/post-detail`);

// ETH Merge kucoin赚币产品信息
export const getPoolStakingProducts = () => pull(`${prefix}/eth-merge/pool-staking/products`);

// 获取交易统计信息
export const getSymbolStats = (symbol) => pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`);
