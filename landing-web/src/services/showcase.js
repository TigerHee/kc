/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const showCasePrefix = '/promotion';

export const getPublish = ({ id }) => pull(`${showCasePrefix}/web/showcase/publish-get/${id}`);

// kcs 持仓情况
export const getUserHold = ({ id }) => pull(`${showCasePrefix}/web/showcase/user-hold/list/${id}`);

// 用户票数信息
export const getUserVote = ({ id }) => pull(`${showCasePrefix}/web/showcase/user-vote/${id}`);

// 投票
export const postVote = params => post(`${showCasePrefix}/web/showcase/vote`, params, false, true);

// 获取活动货币投票信息
export const getTokenVote = ({ showcaseId }) => pull(`${showCasePrefix}/web/showcase/token-vote/${showcaseId}`);
