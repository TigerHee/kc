/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-16 00:00:42
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-23 17:39:35
 */
import { receiveRewards } from 'src/services/slothub';
import { TASK_REWARD_POINT_COMMON_TYPE } from './constant';

export const receiveSharedRewards = async (prizes) => {
  return await receiveRewards({
    projectIds: [...new Set(prizes.map((i) => i.projectId))],
  });
};

/**
 * 格式化后端返回的任务奖励列表，返回总奖励点数和奖励点列表。
 *
 * @param {Array} listData - 接口返回的任务奖励数据数组。
 * @param {string} [coin=TASK_REWARD_POINT_COMMON_TYPE] - 奖励点类型，不传值默认为通用签
 * @returns {Object} - 包含总奖励点数和奖励点列表的对象。
 * @property {number} totalPoints - 所有任务奖励点的总和。
 * @property {Array} pointList - 任务奖励点的数组。
 */
export const formatBackendTaskPointRewards = (listData, coin = TASK_REWARD_POINT_COMMON_TYPE) => {
  if (!listData) return undefined;

  const pointList = listData?.map((i) => i.pointsValue);
  return {
    totalPoints: pointList.reduce((a, b) => a + b, 0),
    pointList,
    coin,
  };
};
