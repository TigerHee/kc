/**
 * Owner: mike@kupotech.com
 */
import { RobotPromotionHttp, RobotHttp } from 'Bot/utils/request';

/**
 * 获取卡券规则
 */
export function getRule(type = 'FEE_REBATE') {
  return RobotPromotionHttp.get('/v1/coupons/rules', { type });
}

/**
 * 获取卡圈可用列表
 */
export function postCouponLists(data) {
  return RobotPromotionHttp.post('/v2/coupons/list', data); // 2022/10/20 替换为v2接口
}

/**
 * 获取卡券机器人卡圈数据
 */
export function getBotCoupon(data) {
  return RobotPromotionHttp.get('/v1/reward/get-one', data);
}

/**
 * 获取卡券机器人卡圈列表数据
 */
export function getCouponByTaskIds(taskIds) {
  return RobotPromotionHttp.post('/v1/coupons/reward', taskIds, 'TOAST_NO');
}

/**
 * 运行中使用卡券
 */
export function applyCoupon(data) {
  return RobotHttp.post('/v1/task/coupon', data);
}

/**
 * 从卡券选择匹配的机器人
 */
export function getBotsByCouponId(couponsId) {
  return RobotPromotionHttp.get('/v1/coupons/usable-tasks', { couponsId });
}

// 获取卡券
export const receiveCoupon = () => {
  return RobotPromotionHttp.post('/v1/coupons/receive?typeEnum=FEE_REBATE');
};

// 获取链接上的卡券 和 推送的卡券
export const receiveCouponById = (ruleIds) => {
  return RobotPromotionHttp.post('/v1/coupons/receive', { ruleIds, limit: 10 });
};

// 领取大额弹窗优惠券 receiveReason:'AB_TEST_0',
export const receiveBigCouponDialog = () => {
  return RobotPromotionHttp.post('/v1/coupons/receive', {
    receiveReason: 'AB_TEST_0',
    TOAST_NO: true,
  });
};
