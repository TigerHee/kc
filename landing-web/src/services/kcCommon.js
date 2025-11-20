/**
 * Owner: melon@kupotech.com
 */
import { post, pull } from 'utils/request';

const scoreCenterPrefix = '/score-center';
const platformMarktingPrefix = '/platform-markting';
const novicePrefix = '/novice-zone';
const invite_prefix = '/growth-ucenter';

// 用户报名
export const userSignIn = params => post(`${scoreCenterPrefix}/activity/userSignUp`, params);
//
export const getUserIsSignIn = params => pull(`${scoreCenterPrefix}/activity/isSignUp`, params);

// 获取默认邀请码
export async function getInvitationCode(params) {
  return pull(`/promotion/user/invitationCode`, params);
}

// 获取新版邀请码
export function getNewInvitationCode(params = {}) {
  return pull(`${invite_prefix}/v2/invitation-code/default`, params);
};

// 获取数据
export const getEthMergeConfig = () => pull(`${scoreCenterPrefix}/eth-merge/config`);

// 话题相关社区帖子
export const getPostDetail = () => pull(`${scoreCenterPrefix}/eth-merge/social/post-detail`);

// kucoin赚币产品信息
export const getPoolStakingProducts = () => pull(`${scoreCenterPrefix}/eth-merge/pool-staking/products`);

// 获取交易统计信息
export const getSymbolStats = (symbol) => pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`);

// 获取交易对行情统计信息[5s延迟]
export const getSymbolsStatus = () => pull(`${scoreCenterPrefix}/eth-merge/quick-silver/symbols/stats`);

// 用户信息
export const getUserInfo = () => pull(`${platformMarktingPrefix}/newcommer/lottery/info`);

// 用户领券
export const getCoupons = payload => pull(`${platformMarktingPrefix}/newcommer/get/coupons`, payload);

// 开通杠杆
export const openMargin = () => post('/margin-position/position', { channel: 'WEB' });

// 同意用户协议
export const openUser = () => post('/ucenter/agree-user-agreement', { version: 1 });
// 同意风险协议
export const openRisk = () => post('/ucenter/agree-risk-agreement', { version: 1 });
// 开通合约
export const openFuture = () => post('/ucenter/open-contract');
// 卡券激活
export async function couponActive(params) {
  return post(`${novicePrefix}/v2/novice/coupon/active`, params, false, true);
}
