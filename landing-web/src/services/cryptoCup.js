/*
 * @Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/campaign-center';

// 5.1.活动详情
export function getCampaigns(params) {
  return pull(`${prefix}/entry/campaigns`, params);
}

// 获取服务器时间
export const getServerTime = () => pull(`/timestamp`);

// 查询我的报名
export const getRegistInfo = params =>
  post(`${prefix}/entry/campaign-teams-myself`, params, false, true);

export const uploadBehavior = params => post(`${prefix}/sjb/behavior/submit`, params, false, true);

export const getBehavior = params => pull(`${prefix}/sjb/behavior/get`, params);

// 获取队伍
export const getCampaignTeams = params =>
  post(`${prefix}/entry/campaign-teams`, params, false, true);

// 活动注册(加入队伍)
export const joinTeam = params => post(`${prefix}/entry/campaign-enter`, params, false, true);

// 获取邀请码
export const getInvitationCode = params => pull(`/promotion/user/invitationCode`, params);

// 队伍积分详情
export const getTeamRecords = params => {
  return post(`${prefix}/score/team/point/records`, params, false, true);
};

// 我的比赛
export const getMyRace = params => {
  return pull(`${prefix}/score/user/game/records`, params);
};

// 我的积分
export const getMyScore = params => {
  return pull(`${prefix}/score/user/point/records`, params);
};

// 用户分享码
export const getShareCode = params => {
  return pull(`${prefix}/user/shareCode`, params);
};

// 分享助力
export const assistShare = params => {
  return post(`${prefix}/share/assist`, params, false, true);
};

// 比赛结果
export const getRaceResult = params => {
  return pull(`${prefix}/reward/season/user/unclaimed`, params);
};

// 主页面-积分排行
export const getRanking = params => {
  return pull(`${prefix}/score/user/point/ranking`, params);
  // return {
  //   success: true,
  //   code: '200',
  //   msg: 'success',
  //   retry: false,
  //   data: [
  //     {
  //       rank: 1, //排名
  //       identity: 'king', //身份id
  //       point: 100, //积分
  //       myself: false, //该条排名是否为登录用户
  //     },
  //     {
  //       rank: 2, //排名
  //       identity: 'king', //身份id
  //       point: 90, //积分
  //       myself: false, //该条排名是否为登录用户
  //     },
  //     {
  //       rank: 1000, //排名
  //       identity: 'king', //身份id
  //       point: 10, //积分
  //       myself: true, //该条排名是否为登录用户
  //     },
  //     {
  //       rank: 4, //排名
  //       identity: 'king', //身份id
  //       point: 10, //积分
  //       myself: false, //该条排名是否为登录用户
  //     },
  //   ],
  // };
};

// 反查邀请者——通过scode
export const queryInvitor = params => {
  return pull(`${prefix}/user-by-scode`, params);
};

// 领取获胜奖励
export const obtainReward = params => {
  return post(`${prefix}/reward/season/user/obtain`, params, false, true);
};

// 查询队伍获胜奖励
export const getTeamRewards = params => {
  return post(`${prefix}/reward/season/user/records`, params, false, true);
};
