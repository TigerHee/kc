/**
 * Owner: jessie@kupotech.com
 */
import { post as originPost, pull } from 'tools/request';
import siteCfg from 'utils/siteConfig';

const { MAIN_HOST } = siteCfg;

const post = (url, data) => {
  return originPost(url, data, false, true);
};
const nameSpace = '/gem-staking-front';
const nameSpace2 = '/gem-staking';

/**
 * 查询banner
 * @returns
 */
export async function pullGemPoolBanner() {
  return pull(`${nameSpace}/gempool/staking/overview`);
}

/**
 * 历史列表
 * @returns
 */
export async function pullGemPoolHistoryRecords(params) {
  return pull(`${nameSpace}/gempool/staking/campaign/history`, params);
}

/**
 * 当前列表
 * @returns
 */
export async function pullGemPoolRecords() {
  return pull(`${nameSpace}/gempool/staking/campaign`);
}

/**
 * 项目详情
 * @param {*} earnTokenName 挖币名称
 * @returns
 */
export async function pullGemPoolProjectDetail(earnToken) {
  return pull(`${nameSpace}/gempool/staking/campaign/details`, { earnToken });
}

/**
 * 待领取奖励项目数
 * 登录下调用
 * @returns
 */
export async function pullGemPoolUnclaimedRewardsNum() {
  return pull(`${nameSpace}/gempool/staking/campaign/unclaimedRewards`);
}

/**
 * 待领取奖励项目额度(弹框展示内容)
 * 登录下调用
 * @returns
 */
export async function pullGemPoolUnclaimedRewards() {
  return pull(`${nameSpace}/gempool/staking/campaign/claimInfoByCampaign`);
}

/**
 * 收益领取接口
 * 登录下调用
 * @params    campaignId  -- 必填
 * @returns
 */
export async function postGemPoolRewards(params) {
  return post(`${nameSpace2}/gempool/staking/campaign/rewards`, params);
}

/**
 * 收益领取接口-矿池维度
 * 登录下调用
 * @params    poolId  -- 必填
 * @returns
 */
export async function postGemPoolRewardByPoolId(id) {
  return post(`${nameSpace2}/gempool/staking/campaign/pool/claim`, { poolId: id });
}

/**
 * 质押接口
 * 登录下调用
 * @params    poolId  -- 必填
 * @params    stakingAmount 质押数量  -- 必填
 * @returns
 */
export async function postGemPoolStaking(params) {
  return post(`${nameSpace2}/gempool/staking/campaign/order`, params);
}

/**
 * 赎回接口
 * 登录下调用
 * @params    poolId  -- 必填
 * @params    redeemAmount 质押数量  -- 必填
 * @returns
 */
export async function postGemPoolUnstaking(params) {
  return post(`${nameSpace2}/gempool/staking/campaign/redeem`, params);
}

/**
 * 用户查询任务接口
 * 登录下调用
 * @params    campaignId  -- 必填
 * @returns
 */
export async function pullGemPoolBonusTask(campaignId) {
  return pull(`${nameSpace}/gempool/staking/bonus/task`, { campaignId });
}

/**
 * 邀请邀请任务配置
 */
export async function pullInviteActivity(campaignId) {
  return pull(`${nameSpace}/gempool/staking/campaign/invite-activity`, { campaignId });
}

/**
 * 报名 gempool 邀请活动
 */
export async function postSignupInvite(activityCode) {
  return post('/quest-center/activity/sign/up', { activityCode });
}

/**
 * 题库查询接口
 * 登录下调用
 * @params     "campaignId":"fdsf23fdf23fd945r73fdlcvxzfwe3",--活动ID,必填
 * @returns
 */
export async function pullGemPoolExam(payload) {
  return pull(`${nameSpace}/gempool/staking/campaign/exam`, payload);
}

/**
 * 答题校验接口
 * 登录下调用
 * @params    poolId  -- 必填
 * @params    redeemAmount 质押数量  -- 必填
 * @returns
 */
export async function postGemPoolExamSubmit(payload) {
  return post(`${nameSpace}/gempool/staking/campaign/examSubmit`, payload);
}

/**
 * 审核通过了的所有挖矿tokenlist的接口
 * @returns
 */
export async function pullGemPoolEarnTokenList() {
  return pull(`${nameSpace}/gempool/staking/earnTokenList`);
}

/**
 * 历史收益 记录列表接口
 * @returns
 */
export async function pullEarningsRecordList(params) {
  delete params.dateTime;
  return pull(`${nameSpace}/gempool/staking/rewards/records`, params);
}

/**
 * 历史收益的汇总列表接口
 * @returns
 */
export async function pullEarningsSummaryList(params) {
  delete params.dateTime;
  return pull(`${nameSpace}/gempool/staking/rewards/summary`, params);
}

/**
 * 根据base币种获取可用交易对-USDT优先
 * @returns 可交易的symbol ｜ null
 */
export async function pullEnableSymbol(currency) {
  return pull(`${nameSpace}/gempool/getSymbols`, { currency });
}

/**
 * 判断该用户是否可以质押当前矿池
 * @returns bool
 */
export async function pullVaildStatus(poolId) {
  return pull(`${nameSpace}/gempool/validSpecific`, { poolId });
}

/**
 * gempool质押查询kcs可用余额
 * 登录下调用
 * @returns
 * "currency": "string",
    "available_balance": "string",
    "hold_balance": "string",
    "total_balance": "string"
 */
export async function pullGempoolBalance() {
  return pull(`${MAIN_HOST}/_pxapi/pool-staking/gempool/balance`);
}
