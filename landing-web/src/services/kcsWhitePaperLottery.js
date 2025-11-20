/**
 * Owner: jesse.shao@kupotech.com
 */
import { post, pull } from 'utils/request';

const prefix = '/web3-promotion';

export async function getKcsActivityInfo() {
  return pull(`${prefix}/kcs-activity/info`);
}

export async function getKcsActivityQuestion() {
  return pull(`${prefix}/kcs-activity/question`);
}

export async function getWinningCode() {
  return pull(`${prefix}/kcs-activity/winning-code`);
}

export async function answerKcsActivityQuestion(params) {
  return post(`${prefix}/kcs-activity/question`, params, false, true);
}

export async function confirmKcsActivityJoin(params) {
  return post(`${prefix}/kcs-activity/participate`, params, false, true);
}

export async function getKcsActivityInviteCount() {
  return pull(`${prefix}/kcs-activity/invite-count`);
}

export async function inviteKcsActivityCount(params) {
  return post(`${prefix}/kcs-activity/invite`, params, false, true);
}

export async function nftPreCollectEmail(params) {
  return post(`${prefix}/nft/collect-email`, params, false, true);
}
