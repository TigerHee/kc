/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/activity-rank';

export const join = (data) => {
  return post(`${prefix}/activity/join`, data, false, true);
}

export const isJoin = (data) => {
  return pull(`${prefix}/activity/join`, data);
}

export const getRankData = (data) => {
  return pull(`${prefix}/activity/rank`, data);
}

export const getActivityData = (data) => {
  return pull(`${prefix}/v1/activity/${data.id}`);
}
