/**
 * Owner: mike@kupotech.com
 */
import { queryString } from 'Bot/helper';
import { RobotHttp } from 'Bot/utils/request';

/**
 * 修改机器人参数
 */
export function updateBotParams(data) {
  return RobotHttp.post(`/v1/task/update/run_param?${queryString(data)}`);
}
/**
 * 获取默认配置参数
 */
export function getParams(symbol) {
  return RobotHttp.get('/v1/futures/martingale/page/param', { symbol });
}
/**
 * 获取最小投资额度/爆仓价格
 */
export function postMinInvest(data) {
  return RobotHttp.post('/v1/futures/martingale/calculate/param', data);
}
/**
 * 追加保证金
 */
export function addMargin(data) {
  return RobotHttp.post(
    `/v1/futures/martingale/margin/add?amount=${data.amount}&taskId=${data.taskId}`,
  );
}
/**
 * 计算追加保证金后的爆仓价格
 */
export function calcBlowUpPrice(params) {
  return RobotHttp.get('/v1/futures/martingale/margin/liquidation', {
    taskId: params.taskId,
    amount: params.addAmount,
  }).then(({ data }) => ({ data: data.blowUpPrice }));
}

/**
 * 获取当前委托
 */
export function getOpen(params) {
  return RobotHttp.get('/v1/futures/martingale/current/page', params);
}

/**
 * 获取历史委托
 */
export function getStopOrder(params) {
  return RobotHttp.get('/v1/futures/martingale/done/page', params);
}

/**
 * 创建页面预计算挂单
 */
export function preComputeOrders(data) {
  return RobotHttp.post(`/v1/futures/martingale/precompute/orders`, { ...data, TOAST_NO: true });
}
