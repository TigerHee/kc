/**
 * Owner: harry.lai@kupotech.com
 */

/** SPOT-13214新增结果发布状态补充 活动进行态类型 */
export const ACTIVITY_PROCESS_TYPE = {
  ActivityInProgress: 2, // 活动在进行中
  ActivityArriveEnd: 3, //活动已到达结束时间
  ActivityArriveEndAndIsPub: 4, //活动已到达结束时间&&活动已发布
};

export const POLL_ACTIONS_BY_ACTIVITY_STATUS = {
  [ACTIVITY_PROCESS_TYPE.ActivityInProgress]: 'votehub/pullActivityProjects@polling',
  //活动到达结束时 轮训 获胜结果是否已发布
  [ACTIVITY_PROCESS_TYPE.ActivityArriveEnd]: 'votehub/pullActivityIsPubStatus@polling',
  //活动到达结束时 轮训获胜项目数据
  [ACTIVITY_PROCESS_TYPE.ActivityArriveEndAndIsPub]: 'votehub/pullWinProjects@polling',
};

export const CANCEL_POLL_ACTIONS_BY_ACTIVITY_STATUS = {
  [ACTIVITY_PROCESS_TYPE.ActivityInProgress]: 'votehub/pullActivityProjects@polling:cancel',
  [ACTIVITY_PROCESS_TYPE.ActivityArriveEnd]: 'votehub/pullActivityIsPubStatus@polling:cancel',
  [ACTIVITY_PROCESS_TYPE.ActivityArriveEndAndIsPub]: 'votehub/pullWinProjects@polling:cancel',
};
