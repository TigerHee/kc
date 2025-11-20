/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';
/**
 * 获取机器人列表
 */
export function getRunningLists(params) {
  return RobotHttp.get('/v1/task/user/query', { TOAST_NO: true, ...params });
}

/**
 * 获取机器人详情
 */
export function getRunningDetail(taskId, sky, rankType) {
  return RobotHttp.get('/v1/task/run_params', { taskId, sky, rankType });
}
/**
 * 获取当前委托
 */
export function getOpenOrders(params) {
  return RobotHttp.get('/v1/task/orders', {
    status: 'active',
    ...params,
  });
}
/**
 * 获取已成交委托
 */
export function getStopOrders(params) {
  return RobotHttp.get('/v1/task/orders', {
    status: 'done',
    ...params,
  });
}

/**
 * 停止机器人
 */
export function stopMachine({ taskId, sellAllBase, buyBase }) {
  return RobotHttp.post(
    `/v1/task/cancel?taskId=${taskId}&sellAllBase=${sellAllBase}&buyBase=${buyBase}`,
  );
}

/**
 * 获取机器人持仓数量
 */
export function getStoreAmount(taskId) {
  return RobotHttp.get(`/v1/task/user/currency?taskId=${taskId}`);
}

/**
 * 设置止损价、止盈价、止损百分比
 */
export function setStopLossAndProfitPrice(data) {
  let url = `/v1/task/update/run_param?taskId=${data.taskId}`;
  if (typeof data.stopProfitPrice !== 'undefined') {
    url += `&stopProfitPrice=${data.stopProfitPrice}`;
  }
  if (typeof data.stopLossPrice !== 'undefined') {
    url += `&stopLossPrice=${data.stopLossPrice}`;
  }
  if (typeof data.stopLossPercent !== 'undefined') {
    url += `&stopLossPercent=${data.stopLossPercent}`;
  }
  return RobotHttp.post(url);
}
/**
 * 设置开关提醒
 */
export function setNoticeOutbound(data) {
  return RobotHttp.post(
    `/v1/task/update/run_param?taskId=${data.taskId}&isNoticeOutbound=${data.isNoticeOutbound}&stopLossPrice=${data.stopLossPrice}`,
  );
}

/**
 * 设置网格利润复投
 */
export function setCanReInvestment(data) {
  return RobotHttp.post(
    `/v1/task/update/run_param?taskId=${data.taskId}&canReInvestment=${data.canReInvestment}`,
  );
}

/**
 * 获取运行数量
 */
export function getRobotRunNum() {
  return RobotHttp.get('/v1/task/user/queryRunTaskNum');
}
