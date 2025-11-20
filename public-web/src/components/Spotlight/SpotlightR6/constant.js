/**
 * Owner: solar.xia@kupotech.com
 */
// 活动未开始
export const ACTIVITY_NOT_STARTED = 'activity_not_started';
// 预约未开始
export const RESERVATION_NOT_STARTED = 'reservation_not_started';
// 正在预约，可报名
export const START_RESERVATION_STATUS = 'start_reservation';
// 预约结束，等待公布
export const END_RESERVATION_STATUS = 'end_reservation';
// 已公布签数未开奖
export const REWARD_EXPECT_STATUS = 'reward_expect';
// 已中奖结果公布
export const RESULT_ANNOUNCED_STATUS = 'result_announced';
// 已扣发但未活动结束
export const LOTTERY_STATUS = 'lottery';
// 已结束
export const END_ACTIVITY_STATUS = 'end_activity';
// 时间轴顺序
export const TIME_STATUS_ARR = [
  ACTIVITY_NOT_STARTED,
  RESERVATION_NOT_STARTED,
  START_RESERVATION_STATUS,
  END_RESERVATION_STATUS,
  REWARD_EXPECT_STATUS,
  RESULT_ANNOUNCED_STATUS,
  LOTTERY_STATUS,
  END_ACTIVITY_STATUS,
];
