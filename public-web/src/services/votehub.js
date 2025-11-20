/**
 * Owner: jessie@kupotech.com
 */
import { post as originPost, pull } from 'tools/request';

const post = (url, data) => {
  return originPost(url, data, false, true);
};

const nameSpace = '/activity-rank';
const nameSpaceWelfare = '/platform-markting';

/**
 * 查询当前开始的活动
 * @returns
 */
export async function pullCurrentActivity() {
  return pull(`${nameSpace}/v1/currency_vote/get_current_activity`);
}

/**
 * 查询参与活动的项目列表
 * @param {activityId} 活动id required
 * @param {currentPage} 页码 required
 * @param {pageSize} 页大小 required
 * @returns
 */
export async function pullActivityProjects(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_activity_project`, params);
}

/**
 * 查询获胜活动的项目列表
 * @returns
 */
export async function pullWinProjects(activityId) {
  return pull(`${nameSpace}/v1/currency_vote/get_activity_win_project`, { activityId });
}

/**
 * 查询历史获胜的项目列表
 * @param {currentPage} 页码 required
 * @param {pageSize} 页大小 required
 * @returns
 */
export async function pullHistoricallyProjects(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_win_projects`, params);
}

/**
 * 用户发起项目提名
 * @param {project} 项目方名称 required
 * @param {currency} 币种名称 required
 * @param {chainType} 链类型 required
 * @param {contractAddress} 合约地址 required
 * @returns
 */
export async function postCreateProject(params) {
  return post(`${nameSpace}/v1/currency_vote_project/create`, params);
}

/**
 * 获取基础配置
 * @returns
 * -- NOMINATION_THRESHOLD 提名所需票数
 * -- VOTE_UPPER_LIMIT 用户投票上限
 * -- KCS_HOLD_REWARD_SWITCH kcs持仓任务开关
 * -- KCS_HOLD_REWARD_LIMIT kcs持仓任务限制
 */
export async function pullBaseConfig() {
  return pull(`${nameSpace}/v1/currency_vote/get_base_config`);
}

/**
 * 获取链配置
 * @returns
 */
export async function pullChainConfig() {
  return pull(`${nameSpace}/v1/currency_vote/get_chain_config`);
}

/**
 * 获取用户可用票数 (登陆下调用)
 * @returns
 */
export async function pullAvailableVotes() {
  return pull(`${nameSpace}/v1/currency_vote/get_available_votes`);
}

/**
 * 获取用户项目剩余可投票数量 (登陆下调用)
 * @param {activityDetailId} 活动详情ID required
 * @returns
 */
export async function pullRemainingVotes(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_remaining_vote_count`, params);
}

/**
 * 获取用户投票记录
 * @returns
 */
export async function pullVoteRecords(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_vote_records`, params);
}

/**
 * 获取用户提名记录
 * @returns
 */
export async function pullNominateRecords(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_nominate_records`, params);
}
/**
 * 用户投票
 * @param {activityId} 活动ID required
 * @param {projectId} 项目ID required
 * @param {voteNum} 投票数量 required
 * @returns
 */
export async function postVoteProject(params) {
  return post(`${nameSpace}/v1/currency_vote/vote`, params);
}

/**
 * 获取用户上币票获得记录
 * @returns
 */
export async function pullRewardRecords(params) {
  return pull(`${nameSpace}/v1/currency_vote/get_reward_records`, params);
}

/**
 * 福利中心任务：查询用户可以参与的投票上币任务以及对应的报名状态
 * @returns
 */
export async function pullWelfareTaskList() {
  return pull(`${nameSpaceWelfare}/v2/quest/query/sign-info/vote-quest`);
}

/**
 * 福利中心任务：报名接口
 * @param {questId} 任务id required
 * @param {source} 2.任务跳转连接-web,3. 任务跳转连接-H5, 4.任务跳转连接-APP
 * @returns
 */
export async function postWelfareTaskSignUp(params) {
  return post(`${nameSpaceWelfare}/quest/signUp`, params);
}

/**
 * GemVote 用户邀请任务状态
 * @param {*} params
 * @returns
 */
export async function pullWelfareInviteTaskStatus() {
  return pull(`${nameSpace}/v1/invite-activity/query-current`);
}

/**
 * GemVote 报名邀请任务
 * @param {*} params
 * @returns
 */
export async function postWelfareInviteTaskSign(activityCode) {
  return post(`${nameSpace}/v1/invite-activity/sign?activityCode=${encodeURIComponent(activityCode)}`);
}

/**
 * GemVote 邀请任务 可领取的票数
 * @param {*} params
 * @returns
 */
export async function pullWelfareInviteTaskTicket(activityCode) {
  return pull(`${nameSpace}/v1/invite-activity/query_to_receive`, { activityCode });
}

/**
 * GemVote 邀请任务 领取票数
 * @param {*} params
 * @returns
 */
export async function postWelfareInviteTaskReceive(activityCode) {
  return post(`${nameSpace}/v1/invite-activity/receive?activityCode=${encodeURIComponent(activityCode)}`);
}

/**
 * 获取KCS持仓奖励信息 (登陆下调用)
 * @returns
 */
export async function pullKcsHoldRewardInfo() {
  return pull(`${nameSpace}/v1/currency_vote/get_kcs_hold_reward_info`);
}

/**
 * 领取KCS持仓奖励 (登陆下调用)
 * @returns
 */
export async function postClaimKcsHoldReward() {
  return post(`${nameSpace}/v1/currency_vote/claim_kcs_hold_reward`);
}

/**
 * 获取投票上币现金礼包邀请任务信息
 * @returns
 */
export const pullCashInviteTaskInfo = (params) => {
  return pull('/growth-config/get/client/config/codes', params);
};

/**
 * 获取投票上币现金礼包邀请任务完成状态 (登陆下调用)
 * @returns
 */
export const pullCashInviteTaskStatus = () => {
  return pull('/campaign-center/fission/reward/obtain/status');
};

/**
 * 获取投票上币白名单状态
 * @returns
 */
export const pullCheckPermissions = () => {
  return pull(`${nameSpace}/v1/currency_vote_project/check_nomination_permissions`);
};
