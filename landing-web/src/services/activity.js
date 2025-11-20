/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';
import { isOnCache } from 'utils/pullCache';

import { v2ApiHosts, ActivityType } from 'config';

const { CMS } = v2ApiHosts;

/**
 * @description 获取活动页面详情接口
 * @param id
 * @return {*}
 */
export function pullPage({ id }) {
  const onCache = isOnCache();

  const url = onCache ? `${CMS}/kcscache/cms/activity/${id}` : `${CMS}/cms/activity/${id}`;
  return pull(url);
}

/**
 * @description 获取活动详情
 * @param id
 * @return {*}
 */

export function pullActivity({ type, campaignId }) {
  const requestUrl = {
    [ActivityType.RANK]: '/promotion/competition/getCompetition',
    [ActivityType.VOTE]: '/promotion/vote/getVoteList',
    [ActivityType.UNIVERSAL]: '/promotion/campaign/getCampaign',
    [ActivityType.AIRDROP]: '/promotion/campaign/getCampaign',
  };
  const url = requestUrl[type];
  return pull(url, { campaignId });
}

/**
 * @description 报名参加竞赛活动
 * @param campaignId
 * @param channel
 * @return {*}
 */
export function joinCompetition({ campaignId, channel }) {
  return post('/promotion/competition/enroll', { campaignId, channel });
}

/**
 * @description 竞赛活动排名
 * @param campaignId
 */
export function getCompetionRank({ campaignId }) {
  return pull('/promotion/competition/getRankingList', { campaignId });
}

/**
 * @description 获取自己的排名
 * @param campaignId
 */
export function getMyRank({ campaignId }) {
  return pull('/promotion/competition/getMyRanking', { campaignId });
}

/**
 * @promotion 获取是否中奖
 * @param campaignId
 * @param type
 */
export function getReward({ campaignId, type }) {
  const requestUrl = {
    [ActivityType.UNIVERSAL]: `/promotion/general/rewards/${campaignId}`,
    [ActivityType.AIRDROP]: `/promotion/airdrop/rewards/${campaignId}`,
  };
  const url = requestUrl[type];
  return pull(url);
}


/**
 * @promotion 用户投票参加活动投票上币活动
 * @param campaignId
 * @param channel
 * @param currency
 * @param number
 */
export function addVote({ campaignId, channel, currency, number }) {
  return post('/promotion/vote/addVote', { campaignId, channel, currency, number });
}

/**
 * @deprecated 活动前端-cms列表信息
 * @param page
 * @param pageSize
 * @param {*} param0
 */
export function getActivityList({ page, pageSize }) {
  return pull('/promotion/campaign/cms', { page, pageSize });
}

