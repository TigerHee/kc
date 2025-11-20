/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/spot-nft';

export const join = (data) => {
  const {
    activityId,
    ...other
  } = data;
  return post(`${prefix}/activity/${activityId}/join`, other, false, true);
}

export const isJoin = (data) => {
  const {
    activityId,
    ...other
  } = data;
  return pull(`${prefix}/activity/${activityId}/register`, other);
}

export const getRankData = (data) => {
  const {
    activityId,
    ...other
  } = data;
  return pull(`${prefix}/activity/${activityId}/rank`, other);
}

export const getActivityData = (data) => {
  return pull(`${prefix}/activity/${data.id}/info`);
}
