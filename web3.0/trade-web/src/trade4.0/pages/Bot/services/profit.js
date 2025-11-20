/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

/**
 * 获取收益明细
 */
export function getDetailProfit(params) {
  return RobotHttp.get('/v1/profit/own/page', params);
}
/**
 * 获取总收益
 */
export function getTotalProfit(params) {
  return RobotHttp.get('/v1/profit/own/total', params);
}

/**
 * 获取每日收益
 */
export function getDayProfit(params) {
  return RobotHttp.get('/v1/profit/own/daily', params);
}

/**
 * 获取运行/历史的详情
 */
export function getMachineDetail(taskId) {
  return RobotHttp.get('/v1/task/profit/detail', { taskId });
}

/**
 * 获取单位切换列表
 */
export function getUnitLists() {
  return RobotHttp.get('/v1/symbol/quote_name/query');
}

// DAILY("DAILY", 1),
// WEEKLY("WEEKLY", 7),
// MONTHLY("MONTHLY", 30),
// QUARTERLY("QUARTERLY", 90);
/**
 * 获取累计收益
 */
export function getAccuProfit(interval) {
  return RobotHttp.get('/v1/profit/user/curve', { interval });
}

/**
 * 获取资产分布
 */
export function getAssetLayout() {
  return RobotHttp.get('/v1/account/overview');
}

/**
 * 我的收益接口
 */
export function getMyProfit(params) {
  return RobotHttp.get('/v1/asset/profit', params);
}
